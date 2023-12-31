import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CompanySupplyPayment extends BaseModel {
  @column({ isPrimary: true })
  public company_id: number

  @column({ isPrimary: true })
  public supply_payment_id: number
}
