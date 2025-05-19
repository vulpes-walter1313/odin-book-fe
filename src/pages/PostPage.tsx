import LoadingMessage from "@/components/LoadingMessage";
import { getPost } from "@/tquery/queries";
import { QueryKeys } from "@/tquery/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import ErrorMessage from "@/components/ErrorMessage";
import SidebarNav from "@/components/SidebarNav";
import PostCard from "@/components/PostCard";
import AuthLayout from "@/layouts/AuthLayout";

function PostPage() {
  const { postId } = useParams();

  const { data, isError, isPending, isSuccess } = useQuery({
    queryKey: [QueryKeys.POST, postId],
    queryFn: async () => {
      const data = await getPost(postId);
      return data;
    },
  });
  return (
    <AuthLayout>
      <div className="min-h-screen bg-zinc-900 px-4 py-14 text-zinc-50 md:py-16">
        <div>
          <SidebarNav />
          <div className="mx-auto max-w-lg">
            {isSuccess && data.post && (
              <PostCard post={data.post} sort={"latest"} />
            )}
            {isPending && <LoadingMessage message={`loading post`} />}
            {isError && <ErrorMessage message="Something went wrong" />}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default PostPage;
