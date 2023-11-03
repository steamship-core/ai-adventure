export const sortOptions = {
  newest: "desc",
  oldest: "asc",
  updated: "desc",
};

export const tagToBgColor = {
  fantasy: "bg-red-600",
};

export const getTagBgColor = (tag: string) => {
  // @ts-ignore
  return tagToBgColor[tag] || "bg-indigo-600";
};
