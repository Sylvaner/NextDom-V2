/**
 * Interface des plugins
 */
export interface Plugin {
  getCache(): object;
  getName(): string;
  getTopicPrefix(): string;
  getSubscribeTopic(): string;
  messageHandler(topic: string, message: Buffer): void;
};
