import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Company from 'App/Models/Company'
import Category from 'App/Models/Category';

export default class ProductPolicy extends BasePolicy {
  public async isOwner(user: User, category_id: number) {
    const company = await Company.query()
      .where('user_id', user.id)
      .firstOrFail();

    const category = await Category.findOrFail(category_id);

    return category.company_id === company.id;
  }
}
