import { HiUser } from "react-icons/hi";
import { FaHeart } from "react-icons/fa6";
import { shortTimeAgo } from "@/lib/utils";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment, likeComment, unlikeComment } from "@/tquery/mutations";
import { Button } from "./ui/button";
import { QueryKeys } from "@/tquery/queryKeys";
import CommentForm from "./CommentForm";
import EditCommentForm from "./EditCommentForm";

export type CommentFromRequest = {
  id: number;
  createdAt: string;
  updatedAt: string;
  message: string;
  postId: number;
  author: {
    name: string;
    profileImg: string;
  };
  _count: {
    userLikes: number;
  };
  userLikedComment: boolean;
  userIsAuthor: boolean;
};
type CommentProps = {
  comment: CommentFromRequest;
};
function Comment({ comment }: CommentProps) {
  const queryClient = useQueryClient();
  const [showEditComment, setShowEditComment] = useState(false);
  const [commentLikes, setCommentLikes] = useState<number>(
    comment._count.userLikes,
  );
  const [userLikedComment, setUserLikedComment] = useState<boolean>(
    comment.userLikedComment,
  );

  const likeCommentMuta = useMutation({
    mutationFn: async ({
      postId,
      commentId,
    }: {
      postId: number;
      commentId: number;
    }) => {
      const data = await likeComment(postId, commentId);
      return data;
    },
    onSuccess: () => {
      setUserLikedComment(true);
      setCommentLikes((num) => num + 1);
    },
  });
  const unlikeCommentMuta = useMutation({
    mutationFn: async ({
      postId,
      commentId,
    }: {
      postId: number;
      commentId: number;
    }) => {
      const data = await unlikeComment(postId, commentId);
      return data;
    },
    onSuccess: () => {
      setUserLikedComment(false);
      setCommentLikes((num) => num - 1);
    },
  });

  const deleteCommentMuta = useMutation({
    mutationFn: async ({
      postId,
      commentId,
    }: {
      postId: number;
      commentId: number;
    }) => {
      const data = await deleteComment(postId, commentId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.COMMENTS, `post-${comment.postId}`],
      });
    },
  });
  return (
    <div className="flex justify-between gap-4">
      <div className="flex items-start gap-4">
        {comment.author.profileImg ? (
          <img
            src={comment.author.profileImg}
            alt={`${comment.author.name}'s profile image`}
            width={40}
            height={40}
            className="flex-none"
          />
        ) : (
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-zinc-700">
            <HiUser className="h-6 w-6 fill-zinc-50" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="lg:text-dekxsp text-mobxsp font-semibold text-zinc-50 lg:font-semibold">
              {comment.author.name}
            </p>
            <p className="text-mobxsp text-zinc-300 lg:text-deskxsp">
              {shortTimeAgo(new Date(comment.createdAt))}
            </p>
          </div>
          {showEditComment ? (
            <EditCommentForm
              postId={comment.postId}
              commentId={comment.id}
              initialComment={comment.message}
              setShowEditComment={setShowEditComment}
            />
          ) : (
            <p className="text-mobsmp leading-[120%] text-zinc-200 lg:text-desksmp">
              {comment.message}
            </p>
          )}
          {comment.userIsAuthor && (
            <div className="flex items-center gap-4">
              {/* add edit and delete buttons if user is author */}
              <Button
                variant="link"
                className="h-fit p-0 text-zinc-50"
                onClick={() => setShowEditComment((bool) => !bool)}
              >
                {showEditComment ? "Cancel" : "Edit"}
              </Button>
              <Button
                variant="link"
                className="h-fit p-0 text-red-500"
                onClick={() =>
                  deleteCommentMuta.mutate({
                    postId: comment.postId,
                    commentId: comment.id,
                  })
                }
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
      <div
        className="flex w-min flex-col items-center"
        onClick={() => {
          if (userLikedComment) {
            unlikeCommentMuta.mutate({
              postId: comment.postId,
              commentId: comment.id,
            });
          } else {
            likeCommentMuta.mutate({
              postId: comment.postId,
              commentId: comment.id,
            });
          }
        }}
      >
        <FaHeart
          className={`h-6 w-6 ${userLikedComment ? "fill-rose-600" : "fill-zinc-300"}`}
        />
        <p className="text-mobxsp text-zinc-300 lg:text-deskxsp">
          {commentLikes}
        </p>
      </div>
    </div>
  );
}

export default Comment;
