import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/tquery/queryKeys";
import SidebarNav from "@/components/SidebarNav";
import { getExplorePosts } from "@/tquery/queries";
import { useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingMessage from "@/components/LoadingMessage";
import PostCard, { type PostsFromRequests } from "@/components/PostCard";
import { Button } from "@/components/ui/button";

type SortValueType = "popular" | "latest" | "oldest";
function ExplorePage() {
  const [sort, setSort] = useState<SortValueType>("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsQuery = useQuery({
    queryKey: [QueryKeys.EXPLORE, sort, page],
    queryFn: async () => {
      const data = await getExplorePosts({ sort: sort, page: page });

      if (totalPages != data.totalPages) {
        setTotalPages(data.totalPages);
      }
      return data.posts;
    },
  });
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
              <ErrorMessage message="Error fetching explore feed" />
            </div>
          )}
          {postsQuery.isPending && (
            <div className="flex w-full items-center justify-center pt-12">
              <LoadingMessage message="Loading explore feed" />
            </div>
          )}
          {postsQuery.data &&
            postsQuery.data.map((post: PostsFromRequests) => {
              return (
                <PostCard post={post} sort={sort} page={page} key={post.id} />
              );
            })}
        </div>
        <div className="col-span-3"></div>
      </div>
    </div>
  );
}

export default ExplorePage;
