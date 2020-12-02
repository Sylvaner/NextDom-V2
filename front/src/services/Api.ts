import Axios, { AxiosInstance, AxiosResponse } from 'axios';

export default class Api {
  private static instance: AxiosInstance;

  private constructor() { }

  public static getInstance(): any {
    if (Api.instance === undefined) {
      Api.instance = Axios.create();
    }
    return Api.instance;
  }

  public static getLight(id: string): void {
    Api.getInstance().get('http://localhost:3000/lights/' + id).then((response: any) => {
      console.log(response);
    });
  }

  public static getLights(): Promise<any> {
    return new Promise<[any]>((resolve, reject) => {
      Api.getInstance().get('http://localhost:3000/lights')
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((response: any) => {
          reject(response)
        })
    });
  }
}