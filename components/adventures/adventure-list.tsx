"use client";

import { Adventure } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographySmall } from "../ui/typography/TypographySmall";

const fetchPage = async (
  pageParam?: string | undefined | null,
  search?: string
) => {
  const searchParams = new URLSearchParams();
  if (search) {
    searchParams.set("search", search);
  }
  if (pageParam) {
    searchParams.set("cursor", pageParam);
  }
  console.log("fetching with", searchParams.toString());
  const res = await fetch(`/api/adventure?${searchParams.toString()}`);
  return res.json() as Promise<{
    results: Adventure[];
    nextCursor?: string;
    prevCursor?: string;
  }>;
};

const AdventureList = () => {
  const { inView, ref } = useInView();
  const [search, setSearch] = useState<string | undefined>();

  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isFetched,
    isPending,
    isLoading,
    isRefetching,
    refetch,
    ...result
  } = useInfiniteQuery({
    queryKey: ["all-adventures"],
    queryFn: ({ pageParam }) => fetchPage(pageParam, search),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => {
      if (firstPage.prevCursor) {
        return firstPage.prevCursor;
      }
      return null;
    },
  });

  useEffect(() => {
    // debounce refetch call
    const timeout = setTimeout(() => {
      console.log("refetching");
      refetch();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <>
      <div>
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Input
            placeholder="Search"
            id="search"
            onChange={(e) => setSearch(e.target.value)}
          />
          {(isRefetching || isLoading) && (
            <LoaderIcon className="absolute right-2 top-2 text-gray-400 animate-spin" />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {result.data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.results.map((adventure) => (
              <Link
                key={adventure.id}
                href={`/adventures/${adventure.id}`}
                className="rounded-md border-foreground/20 border overflow-hidden hover:border-indigo-600"
              >
                <div className="relative aspect-video ">
                  <Image
                    src={adventure.image || "/adventurer.png"}
                    fill
                    alt="Adventurer"
                  />
                </div>
                <div className="pb-2 px-4 flex flex-col">
                  <div>
                    <TypographySmall className="text-muted-foreground">
                      Quest
                    </TypographySmall>
                    <TypographyLarge>
                      {adventure.name || "Epic Quest"}
                    </TypographyLarge>
                  </div>
                  <div>
                    <TypographySmall className="text-muted-foreground">
                      Description
                    </TypographySmall>
                    <TypographyLarge className="line-clamp-3">
                      {adventure.description}
                    </TypographyLarge>
                  </div>
                </div>
              </Link>
            ))}
          </Fragment>
        ))}
        {isFetched && (result?.data?.pages?.length || 0) > 0 && (
          <div
            className="mx-auto flex max-w-6xl justify-center opacity-0"
            ref={ref}
          />
        )}
      </div>
    </>
  );
};

export default AdventureList;
