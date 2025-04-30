import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/tquery/queryKeys";
import SidebarNav from "@/components/SidebarNav";
import { getFeedPosts } from "@/tquery/queries";
import { useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingMessage from "@/components/LoadingMessage";
import PostCard, { type PostsFromRequests } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import InfiniteContainer from "@/components/InfiniteContainer";

type SortValueType = "popular" | "latest" | "oldest";
interface Post {
  id: number;
  caption: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    name: string;
    profileImg: string;
  };
  _count: {
    userLikes: number;
    comments: number;
  };
  likedByUser: boolean;
  userIsAuthor: boolean;
}
interface PostsPage {
  success: boolean;
  posts: Post[];
  currentPage: number;
  totalPages: number;
}
interface PostPageParam {
  page: number;
  sort: SortValueType;
}
type FeedQueryKey = [QueryKeys, SortValueType];
function FeedPage() {
  const [sort, setSort] = useState<SortValueType>("latest");
  const [page, setPage] = useState(1);
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
    queryKey: [QueryKeys.FEED, sort],
    queryFn: async ({ pageParam }) => {
      const data = await getFeedPosts({
        sort: pageParam.sort,
        page: pageParam.page,
      });
      return data;
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts = postsQuery.data?.pages?.flatMap((page: any) => page?.posts);
  console.log(posts);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-zinc-900 text-zinc-50">
      <div className="mx-auto max-w-lg gap-4 px-4 py-8 lg:relative">
        <SidebarNav />
        <div className="mx-auto flex flex-col gap-6">
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
              <ErrorMessage message="Error fetching personal feed" />
            </div>
          )}
          {postsQuery.isPending && (
            <div className="flex w-full items-center justify-center pt-12">
              <LoadingMessage message="Loading personal feed" />
            </div>
          )}
          {posts && (
            <InfiniteContainer
              hasNextPage={postsQuery.hasNextPage}
              onViewCallback={postsQuery.fetchNextPage}
              isFetchingNextPage={postsQuery.isFetchingNextPage}
            >
              {posts.map((post: PostsFromRequests) => {
                return <PostCard post={post} sort={sort} key={post.id} />;
              })}
            </InfiniteContainer>
          )}
        </div>
        <div className="col-span-3"></div>
      </div>
    </div>
  );
}

export default FeedPage;
