import { DateTime } from "luxon";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CreateEditProductValidator from "App/Validators/CreateEditProductValidator";
import Drive from "@ioc:Adonis/Core/Drive";
import Product from "App/Models/Product";

export default class productsController {
  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.authorize("UserIsCompany");

    const payload = await request.validate(CreateEditProductValidator);

    await bouncer
      .with("ProductPolicy")
      .authorize("isOwner", payload.category_id);

    if (payload.image) {
      await payload.image.moveToDisk("./");
    }

    const product = await Product.create({
      name: payload.name,
      description: payload.description,
      image: payload.image
        ? await Drive.getUrl(payload.image.fileName!)
        : null,
      price: payload.price,
      unity: payload.unity,
      position: payload.position,
      active: payload.active,
      category_id: payload.category_id,
    });

    return response.created(product);
  }

  public async index({ response, request, bouncer }: HttpContextContract) {
    if (request.input("category_id") >= 1) {
      await bouncer.authorize("UserIsCompany");
      await bouncer
        .with("ProductPolicy")
        .authorize("isOwner", request.input("category_id"));

      // const page = request.input("page", 1);
      // const limt = 15;

      const products = await Product.query()
        // .if(request.input("active"), (builder) => {
        //   builder.where("active", request.input("active"));
        // })
        .if(request.input("category_id"), (builder) => {
          builder.where("category_id", request.input("category_id"));
        })
        .whereNull("deleted_at");
      // .paginate(page, limit);

      return response.ok(products);
    } else {
      return response.badRequest("A category_id é obrigatória");
    }
  }

  public async update({
    request,
    response,
    bouncer,
    params,
  }: HttpContextContract) {
    await bouncer.authorize("UserIsCompany");

    const payload = await request.validate(CreateEditProductValidator);
    const product = await Product.findOrFail(params.id);

    await bouncer
      .with("ProductPolicy")
      .authorize("isOwner", product.category_id);

    if (payload.image) {
      if (product.image) {
        const file = product.image.split("/").filter(Boolean).pop();
        if (file?.length) await Drive.delete(file);
      }

      await payload.image.moveToDisk("./");
    }

    let tmpProduct = {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      unity: payload.unity,
      position: payload.position,
      active: payload.active,
      category_id: payload.category_id,
    };

    if (payload.image) {
      tmpProduct["image"] = await Drive.getUrl(payload.image.fileName!);
    }

    product.merge(tmpProduct);
    await product.save();

    return response.ok(product);
  }

  public async destroy({ response, bouncer, params }: HttpContextContract) {
    await bouncer.authorize("UserIsCompany");

    const product = await Product.findOrFail(params.id);

    await bouncer
      .with("ProductPolicy")
      .authorize("isOwner", product.category_id);

    product.deletedAt = DateTime.local();
    await product.save();

    return response.noContent();
  }

  public async removeImage({
    response,
    bouncer,
    params,
  }: HttpContextContract) {
    await bouncer.authorize("UserIsCompany");

    const product = await Product.findOrFail(params.id);

    await bouncer
      .with("ProductPolicy")
      .authorize("isOwner", product.category_id);

    if (product.image) {
      const file = product.image.split("/").filter(Boolean).pop();
      if (file?.length) await Drive.delete(file);

      product.image = null;
      await product.save();
    }

    return response.noContent();
  }
}