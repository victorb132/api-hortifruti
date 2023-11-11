import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'company_supply_payments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('company_id').unsigned().notNullable().references('id').inTable('companies');
      table.integer('supply_payment_id').unsigned().notNullable().references('id').inTable('supply_payments');
      table.primary(['company_id', 'supply_payment_id']);
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
