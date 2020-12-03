import { IoTObject } from '../models/BaseModel';
import { DbService } from './DbService';

export class StoreService extends DbService {
  private static instance?: StoreService;

  private constructor() {
    super();
  }

  public static getInstance(): StoreService {
    if (StoreService.instance === undefined) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance!;
  }

  public async save(type: string, objectToSave: IoTObject): Promise<IoTObject> {
    if (this.collections[type] === undefined) {
      this.collections[type] = this.database!.collection(type);
    }
    if (objectToSave !== null) {
      if (objectToSave._id === undefined) {
        await this.collections[type].insertOne(objectToSave);
      } else {
        await this.collections[type].replaceOne({ _id: objectToSave._id }, objectToSave);
      }
    }
    return objectToSave;
  }

  public getObject(type: string, objectId: string): Promise<IoTObject> {
    return new Promise((resolve, reject) => {
      this.collections[type].findOne({ id: objectId }).then((targetObject) => {
        resolve(<IoTObject>targetObject);
      }).catch(() => {
        reject();
      });
    })
  }
}