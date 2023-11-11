import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from 'App/Models/City'

export default class CitiesController {
  public async index({ response }: HttpContextContract) {
    const cities = await City.query().whereHas('companies', (query: any) => {
      query.where('blocked', false)
    }).preload('state');

    return response.ok(cities);
  }

  public async companies({ params, response }: HttpContextContract) {
    const city = await City.query().where('id', params.id).preload('companies').firstOrFail();

    return response.ok(city.companies);
  }
}
