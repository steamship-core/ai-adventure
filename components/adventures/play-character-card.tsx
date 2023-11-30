import Image from "next/image";

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="group relative aspect-[2/3] w-full rounded-xl bg-gray-900/5 overflow-hidden shadow-lg">
    {children}
  </div>
);

const CardDescription = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <div className="absolute bottom-0 left-0 w-full">
    <div className="backdrop-blur-sm p-2 bg-background/40 text-xs">
      <div className="font-bold">{title}</div>
      {description && (
        <div className="h-0 group-hover:mt-2 group-hover:h-[13rem] transition-all invisible group-hover:visible">
          {description}
        </div>
      )}
    </div>
  </div>
);

export default function PlayAsCharacterCard({
  characterName,
  adventureName,
  image,
  adventureDescription,
}: {
  characterName: string;
  adventureName: string;
  image: string;
  adventureDescription?: string;
}) {
  return (
    <Card>
      <Image src={image} alt={characterName} fill className="object-cover" />
      <CardDescription
        title={adventureName}
        description={adventureDescription}
      />
    </Card>
  );
}
