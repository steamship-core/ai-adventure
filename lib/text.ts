export function addNewlines(text: string): string {
  const sentenceEndings = /([^\d(Mr)(Mrs)(Ms)(Dr)A-Z][\.。!?][\)\]'"”’]* +)/g;
  const paragraphBreak = "$1\n\n";
  let withNewlines = text.replace(sentenceEndings, paragraphBreak);
  withNewlines = withNewlines.trim();
  return withNewlines;
}
