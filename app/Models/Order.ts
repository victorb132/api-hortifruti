import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public hash_id: string

  @column()
  public client_id: number

  @column()
  public company_id: number

  @column()
  public supply_payment_id: number

  @column()
  public addres_order_id: number

  @column()
  public value: number

  @column()
  public change_to: number | null

  @column()
  public delivery_cost: number

  @column()
  public observation: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

}
