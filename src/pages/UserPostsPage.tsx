import { getUserPosts } from "@/tquery/queries";
import { QueryKeys } from "@/tquery/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PostCard, { type PostsFromRequests } from "@/components/PostCard";

type SortOptions = "popular" | "latest" | "oldest";
function UserPostsPage() {
  const { username } = useParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<SortOptions>("latest");
  const { data } = useQuery({
    queryKey: [QueryKeys.USER, username ? username : "", "posts", sort, page],
    queryFn: async () => {
      const data = await getUserPosts({ username, sort, page });

      return data.posts as PostsFromRequests[];
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 py-12">
      {data &&
        data.map((post) => (
          <PostCard post={post} sort={sort} page={page} key={post.id} />
        ))}
    </div>
  );
}

export default UserPostsPage;
