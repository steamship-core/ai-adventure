export function addNewlines(text: string): string {
  const sentenceEndings = /([^\d(Mr)(Mrs)(Ms)(Dr)A-Z][\.。!?][\)\]'"”’]* +)/gmu;
  const paragraphBreak = "$1\n\n";
  let withNewlines = text.replace(sentenceEndings, paragraphBreak);

  const sentenceEndingsMandarin =
    /([^\d(Mr)(Mrs)(Ms)(Dr)A-Z][\u3002\uFF1F\uFF01][\u300D]*)/gmu;

  withNewlines = withNewlines.replace(sentenceEndingsMandarin, paragraphBreak);

  withNewlines = withNewlines.trim();
  return withNewlines;
}
