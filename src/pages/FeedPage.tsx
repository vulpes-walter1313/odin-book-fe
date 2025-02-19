import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/tquery/queryKeys";
import SidebarNav from "@/components/SidebarNav";
import { getFeedPosts } from "@/tquery/queries";
import { useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingMessage from "@/components/LoadingMessage";
import PostCard, { type PostsFromRequests } from "@/components/PostCard";

type SortValueType = "popular" | "latest" | "oldest";
function FeedPage() {
  const [sort, setSort] = useState<SortValueType>("popular");
  const [page, setPage] = useState(1);
  const postsQuery = useQuery({
    queryKey: [QueryKeys.FEED, sort, page],
    queryFn: async () => {
      const data = await getFeedPosts({ sort: sort, page: page });
      return data;
    },
  });
  return (
    <div className="min-h-[calc(100vh-72px)] bg-zinc-900 text-zinc-50">
      <div className="mx-auto max-w-lg gap-4 px-4 py-8 lg:relative">
        <SidebarNav />
        <div className="mx-auto flex flex-col gap-6">
          {postsQuery.isError && (
            <ErrorMessage message="Error is fetching personal feed" />
          )}
          {postsQuery.isPending && (
            <LoadingMessage message="Error is fetching personal feed" />
          )}
          {postsQuery.data &&
            postsQuery.data.posts.map((post: PostsFromRequests) => {
              return <PostCard post={post} sort={sort} />;
            })}
        </div>
        <div className="col-span-3"></div>
      </div>
    </div>
  );
}

export default FeedPage;
