import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Company from 'App/Models/Company';
import CompanySupplyPayment from 'App/Models/CompanySupplyPayment';
import SupplyPayment from 'App/Models/SupplyPayment'

export default class extends BaseSeeder {
  public async run() {
    await SupplyPayment.createMany([
      { name: 'Dinheiro' },
      { name: 'Cartão de Crédito/Débito' },
      { name: 'PIX' },
      { name: 'Picpay' },
    ]);

    const companies = await Company.all();
    for (const company of companies) {
      await CompanySupplyPayment.createMany([
        {
          company_id: company.id,
          supply_payment_id: 1,
        },
        {
          company_id: company.id,
          supply_payment_id: 2,
        },
        {
          company_id: company.id,
          supply_payment_id: 3,
        },
        {
          company_id: company.id,
          supply_payment_id: 4,
        },
      ])
    }
  }
}
