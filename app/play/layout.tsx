import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { ZapIcon } from "lucide-react";
import { ReactNode } from "react";

const PlayLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative h-full pb-3">
    {children}
    <div className="w-full text-center flex items-center justify-center absolute bottom-0 left-0 bg-background">
      <TypographySmall className="py-1">
        <ZapIcon size={16} className="fill-yellow-600 inline text-yellow-600" />{" "}
        by{" "}
        <a href="https://steamship.com" target="_blank" className="underline">
          Steamship
        </a>
      </TypographySmall>
    </div>
  </div>
);

export default PlayLayout;
