import { MongoClient, Db, Collection } from 'mongodb';
//import { IoTObject } from '../models/BaseModel';
//import { Light } from '../models/Light';

interface CollectionIndex {
  [key: string]: Collection
}

export class DbService {
  private client?: MongoClient;
  protected database?: Db;
  protected collections: CollectionIndex = {};

  public connect(credentials: any): Promise<void> {
    return new Promise(async (resolve) => {
      const uri = `mongodb://${credentials.user}:${credentials.password}@${credentials.host}/${credentials.database}?w=majority`;
      this.client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      try {
        await this.client.connect();
        this.database = this.client.db(credentials.database);
        const collections = await this.database.collections();
        collections.forEach((collection) => {
          this.collections[collection.collectionName] = collection;
        });
        resolve();
      } catch (err) {
        console.log(err);
      }
    });
  }
}