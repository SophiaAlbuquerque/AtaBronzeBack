import request from 'supertest';
import app from '../index';

describe('API Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('message', 'Atabrinze API is running');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return welcome message on root', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Bem-vindo à Atabrinze API');
    expect(response.body).toHaveProperty('version', '1.0.0');
  });

  it('should return 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/non-existent-route')
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Rota não encontrada');
  });
});
