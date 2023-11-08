import Route from '@ioc:Adonis/Core/Route'

Route.post('/login', 'AuthController.login');
Route.post('/logout', 'AuthController.logout');

Route.post('/cliente/cadastro', 'ClientController.store');

Route.group(() => {
  Route.get('/auth/me', 'AuthController.me');

  Route.put('/cliente', 'ClientController.update');
}).middleware('auth');

Route.get('/', async () => {
  return {
    hortifruti: 'API Hortifruti',
  }
});