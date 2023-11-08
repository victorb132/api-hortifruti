import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Company from 'App/Models/Company'
import User from 'App/Models/User'

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
  }
}
