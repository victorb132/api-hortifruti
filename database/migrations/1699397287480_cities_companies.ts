import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cities_companies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('city_id').unsigned().notNullable().references('id').inTable('cities');
      table.integer('company_id').unsigned().notNullable().references('id').inTable('companies');
      table.decimal('delivery_cost', 8, 2).notNullable();
      table.primary(['city_id', 'company_id']);
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
