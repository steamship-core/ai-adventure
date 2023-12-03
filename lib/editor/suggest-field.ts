import { Block } from "../streaming-client/src";

export const suggestField = async (
  fieldName: string,
  fieldKeyPath: (string | number)[],
  adventureId: string,
  dataToUpdate: any = {}
) => {
  console.log({
    field_name: fieldName,
    field_key_path: fieldKeyPath,
    unsaved_server_settings: dataToUpdate,
  });
  const response = await fetch(`/api/adventure/generate`, {
    method: "POST",
    body: JSON.stringify({
      operation: "suggest",
      id: adventureId,
      data: {
        field_name: fieldName,
        field_key_path: fieldKeyPath,
        unsaved_server_settings: dataToUpdate,
      },
    }),
  });

  if (!response.ok) {
    const e = {
      title: "Failed suggestion request.",
      message: "The server responded with an error response",
      details: `Status: ${response.status}, StatusText: ${
        response.statusText
      }, Body: ${await response.text()}`,
    };
    console.error(e);
    throw e;
  } else {
    let block = (await response.json()) as Block;
    if (block.text) {
      if (block.mimeType?.endsWith("json")) {
        const j = JSON.parse(block.text);
        return j;
      } else {
        let cleanText = block.text.trim();
        if (cleanText.startsWith('"')) {
          cleanText = cleanText.substring(1, cleanText.length);
        }
        if (cleanText.endsWith('"')) {
          cleanText = cleanText.substring(0, cleanText.length - 1);
        }
        if (cleanText.startsWith("'")) {
          cleanText = cleanText.substring(1, cleanText.length);
        }
        if (cleanText.endsWith("'")) {
          cleanText = cleanText.substring(0, cleanText.length - 1);
        }
        return cleanText;
      }
    } else if (block.id) {
      const blockUrl = `${process.env.NEXT_PUBLIC_STEAMSHIP_API_BASE}block/${block.id}/raw`;
      if (block.mimeType?.startsWith("image")) {
        return blockUrl;
      } else {
        const blockContent = await fetch(blockUrl);
        const streamedText = await blockContent.text();
        return streamedText;
      }
    }
  }
};
