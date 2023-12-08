import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import user from 'App/Models/User'
import Order from 'App/Models/Order'
import Company from 'App/Models/Company'

export default class OrderPolicy extends BasePolicy {
  public async canUpdate(user: user, order: Order) {
    const company = await Company.query()
      .where('user_id', user.id)
      .firstOrFail();

    return order.company_id === company.id;
  }
}
