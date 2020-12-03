import ObjectState from '../models/ObjectState';
import { DbService } from './DbService';

const targetCollection = 'state';

export class StateService extends DbService {
  private static instance?: StateService;

  private constructor() {
    super();
  }

  public static getInstance(): StateService {
    if (StateService.instance === undefined) {
      StateService.instance = new StateService();
    }
    return StateService.instance!;
  }

  public async save(objectId: string, stateToSave: ObjectState): Promise<ObjectState> {
    if (this.collections[targetCollection] === undefined) {
      this.collections[targetCollection] = this.database!.collection(targetCollection);
    }
    await this.collections[targetCollection].replaceOne({ objectId }, stateToSave, { upsert: true });
    return stateToSave;
  }
}