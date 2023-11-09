import { BaseModel, column, hasOne, HasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import State from './State'
import Company from './Company'

export default class City extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public state_id: number

  @column()
  public active: boolean

  @hasOne(() => State, {
    foreignKey: 'id',
    localKey: 'state_id',
  })

  public state: HasOne<typeof State>

  @manyToMany(() => Company, {
    pivotTable: 'cities_companies',
    localKey: 'id',
    pivotForeignKey: 'city_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'company_id',
  })

  public companies: ManyToMany<typeof Company>
}
