import { getUserPosts } from "@/tquery/queries";
import { QueryKeys } from "@/tquery/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PostCard from "@/components/PostCard";
import InfiniteContainer from "@/components/InfiniteContainer";

type SortOptions = "popular" | "latest" | "oldest";
function UserPostsPage() {
  const { username } = useParams();
  const [sort] = useState<SortOptions>("latest");
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
    queryKey: [QueryKeys.USER, username ? username : "", "posts", sort],
    queryFn: async ({ pageParam }) => {
      const data = await getUserPosts({
        username,
        sort: pageParam.sort,
        page: pageParam.page,
      });

      return data;
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts = postsQuery.data?.pages?.flatMap((page: any) => page?.posts);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mx-auto max-w-lg py-12">
      <InfiniteContainer
        hasNextPage={postsQuery.hasNextPage}
        onViewCallback={postsQuery.fetchNextPage}
        isFetchingNextPage={postsQuery.isFetchingNextPage}
      >
        {posts &&
          posts.map((post) => (
            <PostCard post={post} sort={sort} key={post.id} />
          ))}
      </InfiniteContainer>
    </div>
  );
}

export default UserPostsPage;
