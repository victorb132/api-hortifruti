import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Category from "App/Models/Category";
import Company from "App/Models/Company";
import CreateEditCategoryValidator from "App/Validators/CreateEditCategoryValidator";

export default class CategoriesController {
  public async store({
    request,
    response,
    auth,
    bouncer,
  }: HttpContextContract) {
    await bouncer.authorize("UserIsCompany");

    const payload = await request.validate(CreateEditCategoryValidator);
    const userAuth = await auth.use("api").authenticate();
    const company = await Company.findByOrFail(
      "user_id",
      userAuth.id
    );

    const category = await Category.create({
      name: payload.name,
      description: payload.description,
      position: payload.position,
      active: payload.active,
      company_id: company.id,
    });

    return response.ok(category);
  }

  public async index({ auth, response, bouncer }: HttpContextContract) {
    await bouncer.authorize("UserIsCompany");

    const userAuth = await auth.use("api").authenticate();
    const company = await Company.findByOrFail(
      "user_id",
      userAuth.id
    );

    const categories = await Category.query()
      .whereNull("deleted_at")
      .where("company_id", company.id)
      .orderBy("position", "asc");

    return response.ok(categories);
  }

  public async update({
    request,
    response,
    params,
    bouncer,
  }: HttpContextContract) {
    await bouncer.authorize("UserIsCompany");

    const payload = await request.validate(CreateEditCategoryValidator);
    const category = await Category.findOrFail(params.id);

    await bouncer.with("CategoryPolicy").authorize("isOwner", category);

    category.merge(payload);
    await category.save();

    return response.ok(category);
  }

  public async destroy({ response, params, bouncer }: HttpContextContract) {
    await bouncer.authorize("UserIsCompany");

    const category = await Category.findOrFail(params.id);
    await bouncer.with("CategoryPolicy").authorize("isOwner", category);

    try {
      await Category.query()
        .where("id", params.id)
        .update({ deletedAt: new Date() });
    } catch {
      return response.badRequest();
    }
  }
}