export function addNewlines(text: string): string {
  const sentenceEndings = /([^\dA-Z][\.。!?][\)\]'"”’]* +)/gmu;
  const paragraphBreak = "$1\n\n";
  let withNewlines = text.replace(sentenceEndings, paragraphBreak);

  const sentenceEndingsMandarin = /([^\dA-Z][\u3002\uFF1F\uFF01][\u300D]*)/gmu;

  withNewlines = withNewlines.replace(sentenceEndingsMandarin, paragraphBreak);

  withNewlines = withNewlines.trim();

  // Now we're going to do a bit of cleaning -- we'll remove any \n\n inside of quotes.
  var dbQuotes = false;

  for (let i = 0; i < withNewlines.length; i++) {
    if (withNewlines[i] == '"') {
      dbQuotes = !dbQuotes;
    } else if (
      i > 0 &&
      withNewlines[i] == "\n" &&
      withNewlines[i - 1] == "\n" &&
      dbQuotes === true
    ) {
      // We're inside an open quote and hit a double newline -- we should remove it! We'll do it in place!
      withNewlines = withNewlines.slice(0, i - 1) + withNewlines.slice(i + 1);
      // We've now need to made the string TWO chars shorter, so we need to decrement i by 2
      i -= 2;
    }
  }

  // And finally we'll replace \n\n[a-z] with [a-z]
  const newParaStartingWithLower = /\n\n([a-z])/gmu;
  const justTheLower = "$1";
  withNewlines = withNewlines.replace(newParaStartingWithLower, justTheLower);

  // And finally we'll replace Mr. Ms. etc
  const mrMs = /((Mr|Mrs|Ms|Dr)\.\s*)\n\n/gmu;
  withNewlines = withNewlines.replace(mrMs, justTheLower);
  return withNewlines;
}
