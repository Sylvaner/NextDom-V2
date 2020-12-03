import mongoose from 'mongoose';
import { LightInterface, LightSchema } from '../models/Light';

export class StoreDb {
  protected connection?: mongoose.Connection;
  private static instance?: StoreDb;
  public static lightModel: any;

  public static getInstance(): StoreDb {
    if (StoreDb.instance === undefined) {
      StoreDb.instance = new StoreDb();
    }
    return StoreDb.instance;
  }

  public connect(credentials: any): Promise<mongoose.Connection> {
    console.log('DEB');
    return new Promise((resolve) => {
      mongoose.createConnection(`mongodb://${credentials.username}:${credentials.password}@${credentials.host}/${credentials.database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (err, conn) => {
        this.connection = conn;
        console.log(`DB (${credentials.database}): Connected`);
        resolve(this.connection);
      })
    })
  }

  public registerModels(): void {
    console.log('REGISTER');
    StoreDb.lightModel = this.connection!.model<LightInterface>('Light', LightSchema)
  }
  /*
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
  */
}

export const Light = StoreDb.lightModel;