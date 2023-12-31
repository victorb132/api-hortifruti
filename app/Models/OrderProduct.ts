import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'

export default class OrderProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public order_id: number

  @column()
  public product_id: number

  @column()
  public quantity: number

  @column()
  public value: number

  @column()
  public observation: string | null

  @hasOne(() => Product, {
    localKey: 'product_id',
    foreignKey: 'id',
  })

  public product: HasOne<typeof Product>
}
