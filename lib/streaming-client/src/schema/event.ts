export type ServerSentEvent<T> = {
  id: string;
  event: string;
  data: T;
};

export type BlockCreatedPayload = {
  blockId: string;
  createdAt: string;
};

export interface FileEvent extends ServerSentEvent<BlockCreatedPayload> {
  id: string;
  event: "blockCreated";
  data: BlockCreatedPayload;
}
