import { rules } from "@ioc:Adonis/Core/Validator";
import { CustomMessages, schema } from "@ioc:Adonis/Core/Validator";

import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateEditCategoryValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(255)]),
    description: schema.string.nullableAndOptional({ trim: true }, [
      rules.maxLength(255),
    ]),
    position: schema.number.optional([rules.unsigned(), rules.range(1, 99999)]),
    active: schema.boolean.optional(),
  });

  public messages: CustomMessages = {};
}