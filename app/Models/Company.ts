import { DateTime } from 'luxon'
import { BaseModel, HasMany, ManyToMany, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import SupplyPayment from './SupplyPayment'
import Env from '@ioc:Adonis/Core/Env'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public name: string

  @column({
    consume: (value) => (value == null ? value : Env.get('API_URL') + value)
  })

  @column()
  public logo: string | null

  @column()
  public blocked: boolean

  @column()
  public online: boolean

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Category, {
    foreignKey: 'company_id',
    localKey: 'id'
  })

  public categories: HasMany<typeof Category>

  @manyToMany(() => SupplyPayment, {
    pivotTable: 'company_supply_payments',
    localKey: 'id',
    pivotForeignKey: 'company_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'supply_payment_id',
  })

  public supplypayments: ManyToMany<typeof SupplyPayment>
}
