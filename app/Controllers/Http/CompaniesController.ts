import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CitiesCompany from 'App/Models/CitiesCompany';
import City from 'App/Models/City';
import Company from 'App/Models/Company';
import Order from 'App/Models/Order';
import User from 'App/Models/User';
import UpdateCompanyValidator from 'App/Validators/UpdateCompanyValidator';
import Drive from '@ioc:Adonis/Core/Drive';

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
      .orderBy('id', 'desc');

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
        categoryQuery.preload('products', (productsQuery) => {
          productsQuery.whereNull('deleted_at');
        });
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

  public async update({ request, auth, bouncer, response }: HttpContextContract) {
    await bouncer.authorize('UserIsCompany');

    const payload = await request.validate(UpdateCompanyValidator);

    const userAuth = await auth.use('api').authenticate();

    const user = await User.findOrFail(userAuth.id);
    const company = await Company.findByOrFail('user_id', user.id);

    if (payload.name !== undefined) company.name = payload.name;
    if (payload.online !== undefined) company.online = payload.online;
    if (payload.email !== undefined) user.email = payload.email;
    if (payload.password !== undefined) user.password = payload.password;
    if (payload.logo !== undefined) {
      await payload.logo?.moveToDisk('./');
      company.logo = await Drive.getUrl(payload.logo?.fileName!);
    }

    await company.save()
    await user.save()

    const getEstUpdated = await Company.findByOrFail(
      "user_id",
      user.id
    );

    const data = {
      company_id: getEstUpdated.id,
      name: getEstUpdated.name,
      logo: getEstUpdated.logo,
      online: getEstUpdated.online,
      blocked: getEstUpdated.blocked,
      email: user.email,
    };

    return response.ok(data);
  }

  public async removeLogo({ auth, bouncer, response }: HttpContextContract) {
    await bouncer.authorize("UserIsCompany");

    const userAuth = await auth.use("api").authenticate();
    const company = await Company.findByOrFail(
      "user_id",
      userAuth.id
    );

    if (company.logo) {
      const file = company.logo.split("/").filter(Boolean).pop();
      if (file?.length) await Drive.delete(file);

      company.logo = null;
      await company.save();
    }

    return response.noContent();
  }
}
