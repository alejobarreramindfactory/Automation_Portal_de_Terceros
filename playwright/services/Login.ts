import { APIRequestContext, APIResponse } from '@playwright/test';

export class Login {
    async postLogin(request: APIRequestContext, payload: object): Promise<APIResponse> {
    // Obtenemos la URL de la API desde las variables de entorno de process.env
    const HOST: string = process.env.URL_API || '';
    const path: string = '/login';

    const headers: Record<string, string> = {
      'content-type': 'application/json',
      'x-api-key': 'reqres-free-v1'
    };

    // Realizamos la petición POST usando el contexto request de Playwright
    const response: APIResponse = await request.post(`${HOST}${path}`, {
      headers: headers,
      data: payload
    });

    return response;
  }
}

export default Login;