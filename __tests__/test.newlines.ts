import { addNewlines } from "@/lib/text";

it("it to split new lines well", () => {
  const tx0 = "Hi! I'm Ted.";
  const tg0 = "Hi! \n\nI'm Ted.";
  const ty0 = addNewlines(tx0);
  expect(ty0).toEqual(tg0);

  const tx1 = `Stallman's demo is a hit, but the quest for a trial customer is far from over. The hackers among the crowd are chanting "Run for Free! Run for Free!" as if it's the latest underground techno track, while investors' calculators are clicking away, trying to quantify this maverick's worth.`;
  const tg1 = `Stallman's demo is a hit, but the quest for a trial customer is far from over. 

The hackers among the crowd are chanting "Run for Free! Run for Free!" as if it's the latest underground techno track, while investors' calculators are clicking away, trying to quantify this maverick's worth.`;
  const ty1 = addNewlines(tx1);
  expect(ty1).toEqual(tg1);

  const tx2 = `"Richie, baby, love the vibe, but you know the Valley. It’s all about the greenbacks and the user base," he smirks, waving his latest iPhone like a talisman of capitalism.`;
  const tg2 = `"Richie, baby, love the vibe, but you know the Valley. It’s all about the greenbacks and the user base," he smirks, waving his latest iPhone like a talisman of capitalism.`;
  const ty2 = addNewlines(tx2);
  expect(ty2).toEqual(tg2);

  const tx3 = `"How about we take this little side project and really monetize it? I'm talking microtransactions, premium features, the works!" The crowd gasps. Stallman's ideals hang in the balance, the air thick with tension and the faint smell of overpriced avocado toast.`;
  const tg3 = `"How about we take this little side project and really monetize it? I'm talking microtransactions, premium features, the works!" 

The crowd gasps. 

Stallman's ideals hang in the balance, the air thick with tension and the faint smell of overpriced avocado toast.`;
  const ty3 = addNewlines(tx3);
  expect(ty3).toEqual(tg3);

  const tx4 = `"Rich, baby, your open-source opera's cute, but this ain't a charity gig," she quips, her voice dripping with the syrupy venom of a jilted co-founder. "Where's the secret sauce? The proprietary edge? You can't serve up disruption without a little mystery meat."`;
  const tg4 = `"Rich, baby, your open-source opera's cute, but this ain't a charity gig," she quips, her voice dripping with the syrupy venom of a jilted co-founder. 

"Where's the secret sauce? The proprietary edge? You can't serve up disruption without a little mystery meat."`;
  const ty4 = addNewlines(tx4);
  expect(ty4).toEqual(tg4);

  const tx5 = `I told him to ask Mr. Foosball. He said OK. But really -- what gives?`;
  const tg5 = `I told him to ask Mr. Foosball. 

He said OK. But really -- what gives?`;
  // Note: we don't break after capital letters
  const ty5 = addNewlines(tx5);
  expect(ty5).toEqual(tg5);
});
