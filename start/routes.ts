import Route from '@ioc:Adonis/Core/Route'

Route.post('/login', 'AuthController.login');
Route.post('/logout', 'AuthController.logout');

Route.post('/cliente/cadastro', 'ClientController.store');

Route.get('/cidades', 'CitiesController.index');
Route.get('/cidades/:id/estabelecimentos', 'CitiesController.companies');

Route.get('/estabelecimentos/:id', 'CompaniesController.show');

Route.group(() => {
  Route.get('/auth/me', 'AuthController.me');

  Route.resource('/enderecos', 'AddressesController').only(['store', 'index', 'update', 'destroy']);

  Route.post('/pedidos', 'OrdersController.store');
  Route.get('/pedidos', 'OrdersController.index');
  Route.get('/pedidos/:hash_id', 'OrdersController.show');

  Route.get('/estabelecimentos/pedidos', 'CompaniesController.orders');

  Route.put('/cliente', 'ClientController.update');
}).middleware('auth');

Route.get('/', async () => {
  return {
    hortifruti: 'API Hortifruti',
  }
});