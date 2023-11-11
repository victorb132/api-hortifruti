import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('hash_id').unique().notNullable();
      table
        .integer('client_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('clients')
      table
        .integer('company_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('companies')
      table
        .integer('supply_payment_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('supply_payments')
      table
        .integer('addres_order_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('addres_orders')
      table.decimal('value', 10, 2).notNullable();
      table.decimal('change_to', 10, 2).nullable();
      table.decimal('delivery_cost', 10, 2).notNullable();
      table.string('observation').nullable();
      table.timestamp('created_at').notNullable();
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
