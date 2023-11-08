import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class City extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public state_id: number

  @column()
  public active: boolean
}