import { getAuthCheck, getPostComments } from "@/tquery/queries";
import { QueryKeys } from "@/tquery/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Comment, { type CommentFromRequest } from "./Comment";
import { HiUser } from "react-icons/hi";
import CommentForm from "./CommentForm";

type PostCardCommentsProps = {
  postId: number;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
};
function PostCardComments({ postId, setShowComments }: PostCardCommentsProps) {
  const [page, setPage] = useState(1);

  const commentsQuery = useQuery({
    queryKey: [QueryKeys.COMMENTS, `post-${postId}`, `page-${page}`],
    queryFn: async () => {
      const data = await getPostComments({ postId, page });
      return data;
    },
  });

  const currentUserQuery = useQuery({
    queryKey: [QueryKeys.USER],
    queryFn: getAuthCheck,
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 h-[70vh] border border-zinc-700 bg-zinc-800">
      <div className="grid h-full grid-cols-1 grid-rows-[1fr_144px] gap-4">
        <div className="overflow-y-scroll">
          <div className="flex items-center justify-between p-4">
            <p className="text-mobh6 font-semibold text-zinc-50 lg:text-deskh6 lg:font-semibold">
              Comments
            </p>
            <IoClose
              className="h-6 w-6 fill-zinc-50"
              onClick={() => setShowComments(false)}
            />
          </div>
          <div className="flex flex-col gap-4 overflow-y-scroll px-4">
            {commentsQuery.isSuccess &&
              commentsQuery.data &&
              commentsQuery.data.comments.map((comment: CommentFromRequest) => {
                return <Comment comment={comment} key={comment.id} />;
              })}
          </div>
        </div>
        <div className="flex h-36 items-center justify-center gap-4 border-t border-zinc-600 p-4">
          {currentUserQuery.data?.profileImg ? (
            <img
              src={currentUserQuery.data.profileImg}
              alt={`${currentUserQuery.data.name}'s profile image`}
              width={40}
              height={40}
              className="flex-none"
            />
          ) : (
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-zinc-700">
              <HiUser className="h-6 w-6 fill-zinc-50" />
            </div>
          )}
          <CommentForm postId={postId} />
        </div>
      </div>
    </div>
  );
}

export default PostCardComments;
