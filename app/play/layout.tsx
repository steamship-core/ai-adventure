import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { ZapIcon } from "lucide-react";
import { ReactNode } from "react";

const PlayLayout = ({ children }: { children: ReactNode }) => (
  <div className="pb-3">
    {children}{" "}
    <div className="w-full text-center flex items-center justify-center absolute bottom-2">
      <TypographySmall>
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
