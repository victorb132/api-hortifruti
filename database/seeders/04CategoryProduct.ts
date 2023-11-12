import { faker } from '@faker-js/faker'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'
import Product from 'App/Models/Product';

export default class extends BaseSeeder {
  public async run() {
    for (let iComp = 1; iComp <= 20; iComp++) {
      let category = await Category.create({
        name: faker.commerce.department(),
        description: faker.lorem.sentence(),
        position: 1,
        company_id: iComp,
      });

      await Product.createMany([
        {
          name: faker.commerce.productName(),
          image: faker.image.urlLoremFlickr({ category: 'food', width: 300, height: 300 }),
          price: faker.number.float({ min: 5, max: 100, precision: 0.5 }),
          category_id: category.id,
          position: 1,
          unity: 'KG'
        },
        {
          name: faker.commerce.productName(),
          image: faker.image.urlLoremFlickr({ category: 'food', width: 300, height: 300 }),
          price: faker.number.float({ min: 5, max: 100, precision: 0.5 }),
          category_id: category.id,
          position: 2,
          unity: 'KG'
        },
        {
          name: faker.commerce.productName(),
          image: faker.image.urlLoremFlickr({ category: 'food', width: 300, height: 300 }),
          price: faker.number.float({ min: 5, max: 100, precision: 0.5 }),
          category_id: category.id,
          position: 3,
          unity: 'KG'
        }
      ])
    }
  }
}
