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
  Route.post('/pedidos/:hash_id/statuses', 'OrdersController.statuses');

  Route.put('/cliente', 'ClientController.update');

  // Estabelecimentos
  Route.get('/estabelecimentos/pedidos', 'CompaniesController.orders');
  Route.patch('estabelecimento', 'CategoriesController.update');
  Route.delete('/estabelecimento/produtos/:id/imagem', 'ProductsController.removeImage');
  Route.delete('/estabelecimento/logo', 'CompaniesController.removeLogo');

  Route.resource("/estabelecimento/categorias", "CategoriesController").only([
    "store",
    "index",
    "update",
    "destroy",
  ]);


  Route.resource('/produtos', 'ProductsController').only([
    'store',
    'index',
    'update',
    'destroy'
  ]);
}).middleware('auth');

Route.get('/', async () => {
  return {
    hortifruti: 'API Hortifruti',
  }
});