import { Client, DataType } from 'ts-postgres';
import { IoTObject } from '../models/BaseModel';
import { Light } from '../models/Light';

export class DbService {
  private client?: Client;
  private static instance?: DbService;

  public static getInstance(): DbService {
    if (DbService.instance === undefined) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  public connect(credentials: object) {
    this.client = new Client(credentials);
    this.client.on('connect', () => {
      console.log('DB: Connected');
    })
    this.client.on('error', (err) => {
      console.log('DB: Error ' + err.message);
    });
    this.client.connect();
  }

  public save(objectToSave: IoTObject): void {
    if (objectToSave instanceof Light) {
      // TODO: JSON.parse(JSON.string), il y a mieux à faire
      console.log(objectToSave);
      const { id, capabilities, ...dataToSave } = objectToSave;
      this.client?.query(
        "INSERT INTO light (id, data, capabilities) VALUES ($1, $2, $3) ON CONFLICT(id) DO UPDATE SET data=$2",
        [objectToSave.id, JSON.parse(JSON.stringify(dataToSave)), objectToSave.capabilities],
        [DataType.Varchar, DataType.Json, DataType.Json]);
      console.log(`Save ${objectToSave.id}`);
    }
  }
}