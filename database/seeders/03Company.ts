import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Company from 'App/Models/Company'
import User from 'App/Models/User'
import { faker } from '@faker-js/faker'
import State from 'App/Models/State'
import City from 'App/Models/City'
import CitiesCompany from 'App/Models/CitiesCompany'

export default class extends BaseSeeder {
  public async run() {
    const user = await User.create({
      email: 'company@email.com',
      password: '123456',
      type: 'company'
    })

    await Company.create({
      name: 'Company',
      logo: 'https://logopng.com.br/logos/google-37.png',
      online: true,
      blocked: false,
      userId: user.id
    })

    for (let i = 2; i <= 20; i++) {
      await User.create({
        email: `company${i}@email.com`,
        password: '12345678',
        type: 'company',
      })
    }

    for (let i = 2; i <= 20; i++) {
      await Company.create({
        name: `Company ${i}`,
        logo: `https://picsum.photos/id/${i}/200/200`,
        online: true,
        blocked: false,
        userId: i,
      })
    }

    await State.createMany([
      {
        name: 'Minas Gerais',
        uf: 'MG',
      },
      {
        name: 'São Paulo',
        uf: 'SP',
      }
    ]);

    await City.createMany([
      {
        name: 'Aimorés',
        state_id: 1,
      },
      {
        name: 'São Paulo',
        state_id: 2,
      }
    ]);

    for (let i = 2; i <= 20; i++) {
      await CitiesCompany.createMany([
        {
          city_id: faker.number.int({ min: 1, max: 2 }),
          company_id: i,
          delivery_cost: faker.number.float({ min: 1, max: 10, precision: 0.01 })
        }
      ])
    }
  }
}
