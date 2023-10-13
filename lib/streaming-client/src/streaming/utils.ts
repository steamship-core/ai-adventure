import { Block } from "../schema/block";

const streamToArray = async (
  stream: ReadableStream,
  decodeAsText: boolean = true
) => {
  const reader = stream.getReader();
  const textDecoder = new TextDecoder();
  let result: any[] = [];

  async function read() {
    const { done, value } = await reader.read();

    if (done) {
      return result;
    }

    // TODO: It doesn't make sense to me that `value` could be a value..
    if (typeof value == "string") {
      result.push(value);
    } else {
      if (decodeAsText) {
        result.push(textDecoder.decode(value, { stream: true }));
      } else {
        result.push(value);
      }
    }
    return read();
  }

  return read();
};

const decoder = new TextDecoder();

const streamToString = async (stream: ReadableStream<string>) => {
  let ret = "";
  let done = false;
  let reader = stream.getReader();

  while (!done) {
    try {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (done) {
        break;
      }
      ret += value;
      console.log("Streaming Chunk", value);
    } catch (e) {
      console.log(e);
    }
  }

  return ret;
};

/*
 * Converts a string into a Readable Stream.
 */
const stringToStream = (s: string): ReadableStream => {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(s);
      controller.close();
    },
  });
};

const isStreamTerminatingBlock = (block: Block) => {
  for (const tag of block?.tags || []) {
    if (tag.kind == "agent-status-message" && tag.name == "request-complete") {
      return true;
    }
  }
  return false;
};

export {
  streamToString,
  streamToArray,
  stringToStream,
  isStreamTerminatingBlock,
};
