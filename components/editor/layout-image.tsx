"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import {
  EditorLayoutImage,
  recoilEditorLayoutImage,
} from "../providers/recoil";
import { Skeleton } from "../ui/skeleton";

const LayoutImage = () => {
  const adventureImage = useRecoilValue(recoilEditorLayoutImage);

  const { data, isLoading } = useQuery({
    queryKey: ["adventureImage", adventureImage],
    queryFn: async () => {
      if (
        adventureImage === EditorLayoutImage.LOADING ||
        adventureImage === EditorLayoutImage.UNSET ||
        adventureImage === EditorLayoutImage.DEFAULT
      )
        return null;
      if (!adventureImage) return null;
      const res = await fetch(adventureImage);
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    },
  });

  if (
    adventureImage === EditorLayoutImage.LOADING ||
    adventureImage === EditorLayoutImage.UNSET ||
    adventureImage === EditorLayoutImage.DEFAULT
  )
    return <div className="h-44 aspect-video my-2 md:my-0"></div>;

  console.log(data);
  return (
    <div className="h-44 aspect-video my-2 md:my-0">
      {isLoading ? (
        <Skeleton className="w-full h-full" />
      ) : (
        <>
          {data && (
            <div className="h-full w-full relative rounded-md overflow-hidden">
              <Image src={data} fill alt="Adventurer" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LayoutImage;
