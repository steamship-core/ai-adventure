"use client";

import { sortOptions } from "@/lib/adventure/constants";
import { Adventure, Emojis } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import millify from "millify";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographySmall } from "../ui/typography/TypographySmall";
import AdventureTag from "./adventure-tag";

const fetchPage = async (
  pageParam?: string | undefined | null,
  incomingSearchParams?: URLSearchParams
) => {
  const searchParams = new URLSearchParams(incomingSearchParams);
  if (pageParam) {
    searchParams.set("cursor", pageParam);
  }
  const res = await fetch(`/api/adventure?${searchParams.toString()}`);
  return res.json() as Promise<{
    results: (Adventure & {
      mappedReactions: Record<string, number>;
    })[];
    nextCursor?: string;
    prevCursor?: string;
  }>;
};

const AdventureList = ({ emojis }: { emojis: Emojis[] }) => {
  const { inView, ref } = useInView();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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
    queryFn: ({ pageParam }) => fetchPage(pageParam, searchParams),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => {
      if (firstPage.prevCursor) {
        return firstPage.prevCursor;
      }
      return null;
    },
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams]
  );

  const searchQuery = searchParams.get("search") || "";
  // @ts-ignore
  const sort = sortOptions[searchParams.get("sort")]
    ? searchParams.get("sort")
    : "newest";

  useEffect(() => {
    // debounce refetch call
    const timeout = setTimeout(() => {
      refetch();
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, sort, refetch]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <>
      <div className="flex gap-2 items-end">
        <div className="w-full">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Input
              placeholder="Search"
              id="search"
              defaultValue={searchQuery}
              onChange={(e) => {
                router.push(
                  pathname +
                    "?" +
                    createQueryString("search", e.target.value || "")
                );
              }}
            />
            {(isRefetching || isLoading) && (
              <LoaderIcon className="absolute right-2 top-2 text-gray-400 animate-spin" />
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="w-44">
            <Button variant="outline" className="capitalize">
              {sort}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  pathname + "?" + createQueryString("sort", "newest")
                );
              }}
            >
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  pathname + "?" + createQueryString("sort", "oldest")
                );
              }}
            >
              Oldest
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  pathname + "?" + createQueryString("sort", "updated")
                );
              }}
            >
              Updated
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {result.data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.results.map((adventure) => (
              <Link
                key={adventure.id}
                href={`/adventures/${adventure.id}`}
                className="rounded-md border-foreground/20 border overflow-hidden hover:border-indigo-600 flex flex-col"
              >
                <div className="relative aspect-video ">
                  <Image
                    src={adventure.image || "/adventurer.png"}
                    fill
                    alt="Adventurer"
                  />
                  {Object.keys(adventure.mappedReactions).length > 0 && (
                    <div className="bottom-0 left-0 w-full absolute z-20 bg-background/80">
                      <div className="flex gap-4 px-2 py-1">
                        {Object.keys(adventure.mappedReactions).map((key) => (
                          <div
                            className="text-sm flex gap-1"
                            key={`${adventure.id}-${key}`}
                          >
                            <span>
                              {emojis.find(
                                (emoji) => `${emoji.id}` === `${key}`
                              )?.emoji || ""}
                            </span>
                            <span>
                              {millify(adventure.mappedReactions[key])}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="pb-2 px-4 flex flex-1 flex-col justify-between">
                  <div>
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
                  <div className="flex mt-2 flex-wrap gap-2">
                    {adventure.tags.map((tag) => (
                      <AdventureTag key={tag} tag={tag} />
                    ))}
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
