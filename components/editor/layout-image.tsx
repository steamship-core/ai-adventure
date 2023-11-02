"use client";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import {
  EditorLayoutImage,
  recoilEditorLayoutImage,
} from "../providers/recoil";
import { Skeleton } from "../ui/skeleton";

const LayoutImage = () => {
  const adventureImage = useRecoilValue(recoilEditorLayoutImage);
  return (
    <div className="h-44 aspect-video my-2 md:my-0">
      {adventureImage === EditorLayoutImage.UNSET ? (
        <Skeleton className="w-full h-full" />
      ) : (
        <div className="h-full w-full relative rounded-md overflow-hidden">
          <Image
            src={
              adventureImage === EditorLayoutImage.DEFAULT
                ? "/adventurer.png"
                : adventureImage
            }
            fill
            alt="Adventurer"
          />
        </div>
      )}
    </div>
  );
};

export default LayoutImage;
