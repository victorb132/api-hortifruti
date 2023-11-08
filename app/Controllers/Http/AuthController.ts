import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin';
import Client from 'App/Models/Client';
import Company from 'App/Models/Company';
import User from 'App/Models/User';

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email');
    const password = request.input('password');

    try {
      const user = await User.findByOrFail('email', email);

      let expires;

      switch (user.type) {
        case 'clients':
          expires = '30days';
          break;
        case 'companies':
          expires = '7days';
          break;
        case 'admins':
          expires = '1day';
          break;
        default:
          expires = '30days'
          break;
      }

      const token = await auth.use('api').attempt(email, password, {
        expiresIn: expires,
        name: user?.serialize().email,
      });

      response.ok(token);
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.use('api').revoke();
    } catch {
      return response.unauthorized('You are not logged in')
    }

    return response.ok({
      revoked: true,
    });
  }

  public async me({ auth, response }: HttpContextContract) {
    const userAuth = await auth.use('api').authenticate();

    let data: any;

    switch (userAuth.type) {
      case 'client':
        const client = await Client.findByOrFail('user_id', userAuth.id);
        data = {
          id_client: client.id,
          name: client.name,
          phone: client.phone,
          email: userAuth.email,
        }
        break;
      case 'company':
        const company = await Company.findByOrFail('user_id', userAuth.id);
        data = {
          id_company: company.id,
          name: company.id,
          logo: company.logo,
          online: company.online,
          blocked: company.blocked,
          email: userAuth.email,
        }
        break;
      case 'admin':
        const admin = await Admin.findByOrFail('user_id', userAuth.id);
        data = {
          admin_id: admin.id,
          name: admin.name,
          email: userAuth.email,
        }
        break;
      default:
        return response.unauthorized('Unauthorized user - type not found')
    }

    return response.ok(data);
  }
}
