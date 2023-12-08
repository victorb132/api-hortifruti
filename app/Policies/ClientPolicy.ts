import { BasePolicy } from "@ioc:Adonis/Addons/Bouncer";
import User from "App/Models/User";
import Client from "App/Models/Client";

export default class ClientPolicy extends BasePolicy {
  public async canUpdate(user: User, client: Client) {
    return user.id === client.userId;
  }
}