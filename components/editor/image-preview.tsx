"use client";
import { Block } from "@/lib/streaming-client/src";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";

const BlockImagePreview = ({ block }: { block: Block }) => {
  const { data, isError } = useQuery({
    queryKey: ["block", block.id],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_STEAMSHIP_API_BASE}block/${block.id}/raw`
      ).then((res) => res.blob()),
    staleTime: Infinity,
  });

  if (isError) {
    return (
      <div>
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Oh no!</AlertTitle>
          <AlertDescription>
            We couldn&apos;t load the preview for this image theme. If the issue
            persists, please contact us on discord
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="overflow-hidden relative w-44 h-44 mt-1 mb-1 rounded-md">
      {data ? (
        <Image
          src={URL.createObjectURL(data)}
          className="object-cover"
          alt="Preview Image"
          fill
        />
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </div>
  );
};

export const ImagePreview = ({
  block,
  url,
}: {
  block?: Block;
  url?: string;
}) => {
  if (block) {
    return <BlockImagePreview block={block} />;
  }

  return (
    <div className="overflow-hidden relative w-44 h-44 mt-1 mb-1 rounded-md">
      {url ? (
        <Image src={url} className="object-cover" alt="Preview Image" fill />
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </div>
  );
};
