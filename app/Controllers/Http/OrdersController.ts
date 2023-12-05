import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Address from 'App/Models/Address';
import AddressOrder from 'App/Models/AddressOrder';
import CitiesCompany from 'App/Models/CitiesCompany';
import Client from 'App/Models/Client';
import Order from 'App/Models/Order';
import OrderProduct from 'App/Models/OrderProduct';
import OrderStatus from 'App/Models/OrderStatus';
import Product from 'App/Models/Product';
import CreateOrderValidator from 'App/Validators/CreateOrderValidator';
var randomString = require('randomstring');

export default class OrdersController {
  public async store({ auth, response, request }: HttpContextContract) {
    const payload = await request.validate(CreateOrderValidator);

    const userAuth = await auth.use('api').authenticate();
    const client = await Client.findByOrFail('user_id', userAuth.id);

    let hash_ok: boolean = false;
    let hash_id: string = '';

    while (hash_ok == false) {
      hash_id = randomString.generate({
        length: 6,
        charset: 'alphanumeric',
        capitalization: 'uppercase',
      });

      const hash = await Order.findBy('hash_id', hash_id);

      if (hash == null) {
        hash_ok = true;
      }
    }

    const trx = await Database.transaction();

    const address = await Address.findByOrFail('id', payload.address_id);

    try {
      const addr = await AddressOrder.create({
        cityId: address.cityId,
        street: address.street,
        number: address.number,
        district: address.district,
        referencePoint: address.referencePoint,
        complement: address.complement,
      })

      const compCity = await CitiesCompany.query()
        .where('company_id', payload.company_id)
        .where('city_id', address.cityId)
        .first();

      let totalValue = 0;

      for await (const product of payload.products) {
        const prod = await Product.findByOrFail('id', product.product_id);
        totalValue += prod.price * product.quantity;
      }

      totalValue = compCity
        ? totalValue + compCity.delivery_cost
        : totalValue;

      if (payload.change_to != null && payload.change_to < totalValue) {
        trx.rollback();
        return response.badRequest('O valor do troco não pode ser menor que o valor total do pedido');
      }

      const order = await Order.create({
        hash_id: hash_id,
        client_id: client.id,
        company_id: payload.company_id,
        supply_payment_id: payload.supply_payment_id,
        address_order_id: addr.id,
        value: totalValue,
        change_to: payload.change_to,
        delivery_cost: compCity ? compCity.delivery_cost : 0,
        observation: payload.observation,
      });

      payload.products.forEach(async (product: any) => {
        let getProduct = await Product.findByOrFail('id', product.product_id);

        await OrderProduct.create({
          order_id: order.id,
          product_id: product.product_id,
          value: getProduct.price,
          quantity: product.quantity,
          observation: product.observation,
        })
      });

      await OrderStatus.create({
        order_id: order.id,
        status_id: 1,
      })

      await trx.commit();

      return response.ok(order);
    } catch (error) {
      await trx.rollback();
      return response.badRequest('Something in the request is wrong' + error)
    }
  }

  public async index({ response, auth }: HttpContextContract) {
    const userAuth = await auth.use('api').authenticate();
    const client = await Client.findByOrFail('user_id', userAuth.id);

    const orders = await Order.query()
      .where('client_id', client.id)
      .preload('company')
      .preload('order_status', (statusQuery) => {
        statusQuery.preload('status');
      })
      .orderBy('id', 'desc');

    return response.ok(orders);
  }

  public async show({ params, response }: HttpContextContract) {
    const idOrder: number = params.hash_id;

    const order = await Order.query()
      .where('hash_id', idOrder)
      .preload('products', (productsQuery) => {
        productsQuery.preload('product');
      })
      .preload('client')
      .preload('address')
      .preload('company')
      .preload('supply_payment')
      .preload('order_status', (statusQuery) => {
        statusQuery.preload('status');
      })
      .first();

    if (order == null) {
      return response.notFound('Pedido não encontrado')
    }

    return response.ok(order);
  }
}
