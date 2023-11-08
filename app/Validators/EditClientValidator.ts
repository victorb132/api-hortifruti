import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EditClientValidator {
  constructor(protected ctx: HttpContextContract) { }

  public refs = schema.refs({
    user_id: this.ctx.auth.user?.id,
  })

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(255)
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.maxLength(255),
      rules.unique({ table: 'users', column: 'email', whereNot: { id: this.refs.user_id } })
    ]),
    password: schema.string.nullableAndOptional({}, [rules.minLength(8), rules.maxLength(180)]),
    phone: schema.string({ trim: true }, [
      rules.mobile(
        { locale: ['pt-BR'] },
      ),
      rules.maxLength(15),
    ]),
  })

  public messages: CustomMessages = {
    required: "{{field}} é obrigatório para a edição",
    "email.email": "{{field}} deve ser um email válido",
    "email.unique": "{{field}} já está em uso",
    "password.minLength": "{{field}} deve ter no mínimo {{options.minLength}} caracteres",
    "password.maxLength": "{{field}} deve ter no máximo {{options.maxLength}} caracteres",
    "phone.mobile": "{{field}} deve ser um número de celular válido",
  }
}
