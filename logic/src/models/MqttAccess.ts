import { model, Schema, Document } from 'mongoose';

export interface MqttAccessInterface extends Document {
  _id: string,
  topic: string,
  path: string,
  format: string
}

const MqttAccessSchema: Schema = new Schema({
  topic: { type: String, required: true },
  path: { type: String, required: true },
  format: { type: Object, required: false },
})

export const MqttAccess = model('MqttAccess', MqttAccessSchema);
