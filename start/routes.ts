import Route from '@ioc:Adonis/Core/Route'

Route.post('/login', 'AuthController.login');
Route.post('/logout', 'AuthController.logout');

Route.post('/cliente/cadastro', 'ClientController.store');

Route.get('/cidades', 'CitiesController.index');
Route.get('/cidades/:id/estabelecimentos', 'CitiesController.companies');

Route.group(() => {
  Route.get('/auth/me', 'AuthController.me');

  Route.resource('/enderecos', 'AddressesController').only(['store', 'index', 'update', 'destroy']);

  Route.put('/cliente', 'ClientController.update');
}).middleware('auth');

Route.get('/', async () => {
  return {
    hortifruti: 'API Hortifruti',
  }
});