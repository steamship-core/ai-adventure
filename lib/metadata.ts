import { ResolvedMetadata, ResolvingMetadata } from "next";

export const getNonNullMetadata = async (parent: ResolvingMetadata) => {
  const parentMetadata = await parent;
  let ret = {};
  // create a new metadata object with the non null values from the parent
  for (const key in parentMetadata) {
    // @ts-ignore
    if (parentMetadata[key]) {
      // @ts-ignore
      ret[key] = parentMetadata[key];
    }
  }
  return ret as ResolvedMetadata;
};
