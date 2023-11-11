import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Address from 'App/Models/Address';
import Client from 'App/Models/Client';
import CreateEditAddressValidator from 'App/Validators/CreateEditAddressValidator';

export default class AddressesController {
  public async store({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate(CreateEditAddressValidator);
    const userAuth = await auth.use('api').authenticate();
    const client = await Client.findByOrFail('user_id', userAuth.id);

    const address = await Address.create({
      cityId: payload.city_id,
      clientId: client.id,
      street: payload.street,
      number: payload.number,
      district: payload.district,
      referencePoint: payload.reference_point,
      complement: payload.complement,
    });

    return response.ok(address);
  }

  public async index({ response, auth }: HttpContextContract) {
    const userAuth = await auth.use('api').authenticate();
    const client = await Client.findByOrFail('user_id', userAuth.id);

    const getClient = await Client.query()
      .where('id', client.id)
      .preload('addresses', (cityQuery) => {
        cityQuery.preload('city', (stateQuery) => {
          stateQuery.preload('state');
        })
      }).firstOrFail();

    return response.ok(getClient.addresses);
  }

  public async update({ request, response, params }: HttpContextContract) {
    const payload = await request.validate(CreateEditAddressValidator);
    const address = await Address.findOrFail(params.id);

    address.merge(payload);

    await address.save();

    return response.ok(address);
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const resp = await Address.query().where('id', params.id).delete();

      if (resp.includes(1)) {
        return response.noContent();
      } else {
        return response.notFound();
      }
    } catch (error) {
      return response.badRequest()
    }
  }
}
