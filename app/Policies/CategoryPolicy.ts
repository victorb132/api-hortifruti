import Category from "App/Models/Category";
import { BasePolicy } from "@ioc:Adonis/Addons/Bouncer";
import Company from "App/Models/Company";
import User from "App/Models/User";

export default class CategoriaPolicy extends BasePolicy {
  public async isOwner(user: User, category: Category) {
    const company = await Company.query()
      .where("user_id", user.id)
      .firstOrFail();

    return category.company_id === company.id;
  }
}