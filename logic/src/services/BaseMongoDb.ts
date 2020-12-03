import mongoose from 'mongoose';

export class BaseMongoDb {
  protected connection?: mongoose.Connection;
  private static instance?: BaseMongoDb;

  public static getInstance(): BaseMongoDb {
    if (BaseMongoDb.instance === undefined) {
      BaseMongoDb.instance = new BaseMongoDb();
    }
    return BaseMongoDb.instance;
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
  /*
    public registerModel<T extends Document>(modelName: string, modelSchema: Schema): Model<T> {
      console.log(this.connection);
      return this.connection!.model(modelName, modelSchema);
    }
  
    public save() {
      console.log(this.connection);
    }
    */
}