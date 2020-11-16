/**
 * Interface des plugins
 */
export interface Plugin {
  getCache(): Object;
  getName(): string;
  getTopicPrefix(): string;
  getSubscribeTopic(): string;
  messageHandler(topic: string, message: Buffer): void;
};
