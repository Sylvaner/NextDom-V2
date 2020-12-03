import { Schema, Document } from 'mongoose';
//import { StoreDb } from '../services/StoreDb';
//import { MqttAccess } from './MqttAccess';
console.log('a');
/*
interface LightInterface extends Document {
  plugin: string,
  name: string,
  capabilities: Array<MqttAccess>
}
*/
/*
const LightSchema: Schema = new Schema({
  id: { type: String, required: true },
  plugin: { type: String, required: true },
  name: { type: String, required: true },
  capabilities: { type: Array, required: false },
})
*/
//const Light = model('Light', LightSchema);

export interface LightInterface extends Document {
  id: string,
  plugin: string,
  name: string,
  capabilities: []
}

export const LightSchema = new Schema({
  id: { type: String, required: true },
  plugin: { type: String, required: true },
  name: { type: String, required: true },
  capabilities: { type: Array, required: false }
});

//export const Light = StoreDb.getInstance().connection.registerModel('Light', LightSchema);
// export const Light = StoreDb.getInstance().registerModel<LightInterface>('Light', LightSchema)

//export const Light = model('Light', ightSchema);