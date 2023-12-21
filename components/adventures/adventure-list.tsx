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
import { Skeleton } from "../ui/skeleton";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographySmall } from "../ui/typography/TypographySmall";
import AdventureTag from "./adventure-tag";

const fetchPage = async (
  pageParam?: number,
  incomingSearchParams?: URLSearchParams,
  tagFilter?: string
) => {
  const searchParams = new URLSearchParams(incomingSearchParams);
  if (pageParam) {
    searchParams.set("pageParam", `${pageParam}`);
  }

  if (tagFilter) {
    searchParams.set("tag", tagFilter);
  }

  const res = await fetch(`/api/adventure?${searchParams.toString()}`);
  return res.json() as Promise<{
    results: (Adventure & {
      mappedReactions: Record<string, number>;
    })[];
    nextPage?: number;
    prevPage?: number;
  }>;
};

const AdventureList = ({
  emojis,
  tagName = undefined,
}: {
  tagName?: string;
  emojis: Emojis[];
}) => {
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
    queryFn: ({ pageParam = 0 }) => fetchPage(pageParam, searchParams, tagName),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    getPreviousPageParam: (firstPage) => {
      if (firstPage.prevPage) {
        return firstPage.prevPage;
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
    : "reactions";

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
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
        <div className="w-full">
          <div className="relative flex flex-col gap-2">
            <Input
              placeholder="Search by title, description, or tag"
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
        <div className="flex flex-col gap-2">
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
                    pathname + "?" + createQueryString("sort", "reactions")
                  );
                }}
              >
                Reactions
              </DropdownMenuItem>
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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {result.data?.pages.map((page, i) => (
          <Fragment key={page.nextPage}>
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
                    sizes="524px"
                  />
                  {Object.keys(adventure.mappedReactions).length > 0 && (
                    <div className="bottom-0 left-0 w-full absolute z-20 bg-background/80">
                      <div className="flex gap-4 px-2 py-1 flex-wrap">
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
                        Adventure
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
                        {adventure.shortDescription}
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
        {isLoading && !result.data && (
          <>
            {new Array(8).fill(0).map((_, i) => (
              <Skeleton
                key={i}
                className="rounded-md overflow-hidden w-full h-[330px] "
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default AdventureList;
