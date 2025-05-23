import { useInfiniteQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/tquery/queryKeys";
import SidebarNav from "@/components/SidebarNav";
import { getExplorePosts } from "@/tquery/queries";
import { useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingMessage from "@/components/LoadingMessage";
import PostCard, { type PostsFromRequests } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import InfiniteContainer from "@/components/InfiniteContainer";
import AuthLayout from "@/layouts/AuthLayout";

type SortValueType = "popular" | "latest" | "oldest";
function ExplorePage() {
  const [sort, setSort] = useState<SortValueType>("latest");
  const postsQuery = useInfiniteQuery({
    initialPageParam: {
      page: 1,
      sort: sort,
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      // @ts-expect-error can't find type of these in unknown
      if (lastPage?.currentPage === lastPage?.totalPages) {
        return undefined;
      }
      return {
        page: lastPageParam.page + 1,
        sort: sort,
      };
    },
    queryKey: [QueryKeys.EXPLORE, sort],
    queryFn: async ({ pageParam }) => {
      const data = await getExplorePosts({
        sort: pageParam.sort,
        page: pageParam.page,
      });
      return data;
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts = postsQuery.data?.pages?.flatMap((page: any) => page?.posts);

  return (
    <AuthLayout>
      <div className="min-h-[calc(100vh-72px)] bg-zinc-900 text-zinc-50">
        <div className="mx-auto max-w-lg gap-4 px-4 py-8 lg:relative">
          <SidebarNav />
          <div className="mx-auto mb-12 flex flex-col gap-6">
            <div className="flex gap-4">
              <Button
                variant="outline"
                className={`${sort === "popular" ? "bg-violet-400 text-zinc-50" : "text-violet-400"}`}
                onClick={() => setSort("popular")}
              >
                Popular
              </Button>
              <Button
                variant="outline"
                className={`${sort === "latest" ? "bg-violet-400 text-zinc-50" : "text-violet-400"}`}
                onClick={() => setSort("latest")}
              >
                Latest
              </Button>
              <Button
                variant="outline"
                className={`${sort === "oldest" ? "bg-violet-400 text-zinc-50" : "text-violet-400"}`}
                onClick={() => setSort("oldest")}
              >
                Oldest
              </Button>
            </div>
            {postsQuery.isError && (
              <div className="flex w-full items-center justify-center pt-12">
                <ErrorMessage message="Error fetching explore feed" />
              </div>
            )}
            {postsQuery.isPending && (
              <div className="flex w-full items-center justify-center pt-12">
                <LoadingMessage message="Loading explore feed" />
              </div>
            )}
            {posts && (
              <InfiniteContainer
                hasNextPage={postsQuery.hasNextPage}
                onViewCallback={postsQuery.fetchNextPage}
                isFetchingNextPage={postsQuery.isFetchingNextPage}
              >
                {posts &&
                  posts.map((post: PostsFromRequests) => {
                    return <PostCard post={post} sort={sort} key={post.id} />;
                  })}
              </InfiniteContainer>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ExplorePage;
