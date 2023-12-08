import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User';

export const { actions } = Bouncer.define('UserIsCompany', (user: User) => {
  const typeAllowed = ['company'];
  return typeAllowed.includes(user.type);
});

export const { policies } = Bouncer.registerPolicies({
  OrderPolicy: () => import('App/Policies/OrderPolicy'),
  CategoryPolicy: () => import('App/Policies/CategoryPolicy'),
  ProductPolicy: () => import('App/Policies/ProductPolicy'),
  ClientPolicy: () => import('App/Policies/ClientPolicy')
})
