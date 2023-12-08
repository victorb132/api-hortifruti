import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateEditProductValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    name: schema.string({ trim: true }),
    description: schema.string.nullableAndOptional({ trim: true }),
    image: schema.file.nullableAndOptional({
      size: "5mb",
      extnames: ["jpg", "png", "jpeg"],
    }),
    price: schema.number(),
    unity: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(3),
    ]),
    position: schema.number(),
    active: schema.boolean.optional(),
    category_id: schema.number([
      rules.exists({
        table: "categories",
        column: "id",
        where: { deleted_at: null },
      }),
    ]),
  });

  public messages: CustomMessages = {};
}