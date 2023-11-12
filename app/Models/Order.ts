import { DateTime } from 'luxon'
import { BaseModel, HasMany, HasOne, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import OrderStatus from './OrderStatus'
import Company from './Company'
import OrderProduct from './OrderProduct'
import Address from './Address'
import SupplyPayment from './SupplyPayment'

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
  public address_order_id: number

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

  @hasOne(() => Client, {
    foreignKey: 'id',
    localKey: 'client_id'
  })

  public client: HasOne<typeof Client>

  @hasMany(() => OrderStatus, {
    foreignKey: 'order_id',
    localKey: 'id'
  })

  public order_status: HasMany<typeof OrderStatus>

  @hasOne(() => Company, {
    foreignKey: 'id',
    localKey: 'company_id'
  })

  public company: HasOne<typeof Company>

  @hasMany(() => OrderProduct, {
    foreignKey: 'order_id',
    localKey: 'id'
  })

  public products: HasMany<typeof OrderProduct>

  @hasOne(() => Address, {
    foreignKey: 'id',
    localKey: 'address_order_id'
  })

  public address: HasOne<typeof Address>

  @hasOne(() => SupplyPayment, {
    foreignKey: 'id',
    localKey: 'supply_payment_id'
  })

  public supply_payment: HasOne<typeof SupplyPayment>
}
