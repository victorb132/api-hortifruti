import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CitiesCompany from 'App/Models/CitiesCompany';
import City from 'App/Models/City';
import Company from 'App/Models/Company';
import Order from 'App/Models/Order';

export default class CompaniesController {
  public async orders({ response, auth }: HttpContextContract) {
    const userAuth = await auth.use('api').authenticate();
    const company = await Company.findByOrFail('user_id', userAuth.id);

    const orders = await Order
      .query()
      .where('company_id', company.id)
      .preload('client')
      .preload('order_status', (statusQuery) => {
        statusQuery.preload('status');
      })
      .orderBy('order_id', 'desc');

    return response.json(orders);
  }

  public async show({ params, response }: HttpContextContract) {
    const idComp: number = params.id;

    let arrayCities: any = [];
    const cities = await CitiesCompany.query().where('company_id', idComp);

    for await (const city of cities) {
      const city_ = await City.findByOrFail('id', city.city_id);
      arrayCities.push({
        id: city_.id,
        city: city_.name,
        delivery_cost: city.delivery_cost,
      });
    }

    const company = await Company.query()
      .where('id', idComp)
      .preload('categories', (categoryQuery) => {
        categoryQuery.preload('products');
      })
      .preload('supplypayments')
      .firstOrFail();

    return response.ok({
      id: company.id,
      name: company.name,
      logo: company.logo,
      blocked: company.blocked,
      online: company.online,
      cities: arrayCities,
      supply_payments: company.supplypayments,
      categories: company.categories,
    })

  }
}
