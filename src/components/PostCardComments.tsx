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
  postImg: string;
};
function PostCardComments({
  postId,
  setShowComments,
  postImg,
}: PostCardCommentsProps) {
  const [page, setPage] = useState(1);

  const commentsQuery = useQuery({
    queryKey: [QueryKeys.COMMENTS, `post-${postId}`, `page-${page}`],
    queryFn: async () => {
      const data = await getPostComments({ postId, page });
      return data;
    },
  });

  const currentUserQuery = useQuery({
    queryKey: [QueryKeys.USER, "auth"],
    queryFn: getAuthCheck,
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 h-[70vh] overflow-hidden border border-zinc-700 bg-zinc-800 lg:bottom-2/4 lg:left-[10%] lg:right-[10%] lg:grid lg:translate-y-2/4 lg:grid-cols-[4fr_3fr] lg:rounded-lg">
      <img
        src={postImg}
        alt="post image"
        className="hidden h-full w-full object-contain lg:block"
      />
      <div className="grid h-full grid-cols-1 grid-rows-[[comments]_1fr_[commentForm]_144px] gap-4 lg:h-[inherit]">
        <div className="h-full overflow-y-scroll">
          <div className="flex items-center justify-between p-4">
            <p className="text-mobh6 font-semibold text-zinc-50 lg:text-deskh6 lg:font-semibold">
              Comments
            </p>
            <IoClose
              className="h-6 w-6 fill-zinc-50"
              onClick={() => setShowComments(false)}
            />
          </div>
          <div className="flex max-h-full flex-col gap-4 px-4">
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
