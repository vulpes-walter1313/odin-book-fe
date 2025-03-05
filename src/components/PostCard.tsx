import { HiUser } from "react-icons/hi";
import { FaHeart, FaComment, FaShare } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost, likePost, unlikePost } from "@/tquery/mutations";
import { QueryKeys } from "@/tquery/queryKeys";
import { useState } from "react";
import { Button } from "./ui/button";
import PostCardComments from "./PostCardComments";

export type PostsFromRequests = {
  id: number;
  caption: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    username: string;
    profileImg: string | null;
  };
  _count: {
    userLikes: number;
    comments: number;
  };
  likedByUser: boolean;
  userIsAuthor: boolean;
};
type PostCardProps = {
  post: PostsFromRequests;
  sort: "popular" | "latest" | "oldest";
};
function PostCard({ post, sort }: PostCardProps) {
  const queryClient = useQueryClient();
  const [postLiked, setPostLiked] = useState<boolean>(post.likedByUser);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [postLikesCount, setPostLikesCount] = useState<number>(
    post._count.userLikes,
  );
  const likeMuta = useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      const data = await likePost(postId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FEED, sort] });
      setPostLiked(true);
      setPostLikesCount((count) => count + 1);
    },
  });
  const unlikeMuta = useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      const data = await unlikePost(postId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FEED, sort] });
      setPostLiked(false);
      setPostLikesCount((count) => count - 1);
    },
  });

  const handleLikeClick = () => {
    if (postLiked) {
      unlikeMuta.mutate({ postId: post.id });
    } else {
      likeMuta.mutate({ postId: post.id });
    }
  };

  const deletePostMuta = useMutation({
    mutationFn: async () => {
      const data = await deletePost(post.id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FEED] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EXPLORE] });
    },
  });
  return (
    <div key={post.id} className="rounded-xl bg-zinc-800 shadow-lg">
      <div className="flex gap-2 p-4">
        {post.author.profileImg ? (
          <img
            src={post.author.profileImg}
            alt={`${post.author.name}'s profile image`}
            className="h-12 w-12 rounded-full"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700">
            <HiUser className="fill=zinc-50 h-8 w-8" />
          </div>
        )}
        <div>
          <p className="text-mobp font-medium text-zinc-50 md:text-deskp md:font-medium">
            {post.author.name}
          </p>
          <p className="text-mobsmp font-light text-zinc-300 md:text-desksmp md:font-light">
            @{post.author.username}
          </p>
        </div>
      </div>
      <img
        src={post.imageUrl}
        className="aspect-square w-full object-cover"
        onDoubleClick={handleLikeClick}
      />
      <div className="flex justify-between p-4">
        <div className="flex gap-4">
          <div className="flex cursor-pointer gap-2" onClick={handleLikeClick}>
            <FaHeart
              className={`h-6 w-6 ${postLiked ? "fill-rose-600" : "fill-zinc-50"}`}
            />
            <p>{postLikesCount}</p>
          </div>
          <div className="flex gap-2">
            <FaComment className="h-6 w-6 fill-zinc-50" />
            <p>{post._count.comments}</p>
          </div>
        </div>
        <FaShare className="h-6 w-6 fill-zinc-50" />
      </div>
      <div className="px-4">
        <p className="text-zinc-50">{post.caption}</p>
      </div>
      <Button
        variant="link"
        className="text-zinc-300"
        onClick={() => setShowComments(true)}
      >
        View Comments...
      </Button>
      {post.userIsAuthor && (
        <Button
          variant="link"
          className="text-red-400"
          onClick={() => {
            deletePostMuta.mutate();
          }}
        >
          Delete Post
        </Button>
      )}
      {showComments && (
        <PostCardComments postId={post.id} setShowComments={setShowComments} />
      )}
    </div>
  );
}

export default PostCard;
