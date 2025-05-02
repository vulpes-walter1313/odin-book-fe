import { HiUser } from "react-icons/hi";
import { FaHeart, FaComment, FaShare } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePost, likePost, unlikePost } from "@/tquery/mutations";
import { QueryKeys } from "@/tquery/queryKeys";
import { useState } from "react";
import { Button } from "./ui/button";
import PostCardComments from "./PostCardComments";
import { PostCardContext } from "@/contexts/postCardContexts";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { getAuthCheck } from "@/tquery/queries";
import { DateTime } from "luxon";

export type PostsFromRequests = {
  id: number;
  caption: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
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
interface PostCardProps {
  post: PostsFromRequests;
  sort: "popular" | "latest" | "oldest";
}
function PostCard({ post, sort }: PostCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const authUserQuery = useQuery({
    queryFn: getAuthCheck,
    queryKey: [QueryKeys.USER, "auth"],
  });
  const [postLiked, setPostLiked] = useState<boolean>(post.likedByUser);
  const [commentCount, setCommentCount] = useState<number>(
    post._count.comments,
  );
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
    },
    onError: () => {
      toast({ description: "Liking post failed. Try again." });
      setPostLiked(false);
      setPostLikesCount((count) => count - 1);
    },
  });
  const unlikeMuta = useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      const data = await unlikePost(postId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FEED, sort] });
    },
    onError: () => {
      toast({ description: "Post unlike failed. Try again." });
      setPostLiked(true);
      setPostLikesCount((count) => count + 1);
    },
  });

  const handleLikeClick = () => {
    if (postLiked) {
      unlikeMuta.mutate({ postId: post.id });
      setPostLiked(false);
      setPostLikesCount((count) => count - 1);
    } else {
      likeMuta.mutate({ postId: post.id });
      setPostLiked(true);
      setPostLikesCount((count) => count + 1);
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
    <PostCardContext.Provider
      value={{
        postId: post.id,
        feedSort: sort,
        setCommentCount: setCommentCount,
      }}
    >
      <div key={post.id} className="rounded-xl bg-zinc-800 shadow-lg">
        <Link to={`/users/${post.author.username}`}>
          <div className="flex gap-2 p-4">
            {post.author.profileImg ? (
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={post.author.profileImg ?? ""}
                  alt={`${post.author.name}'s profile image`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-zinc-700">
                  <HiUser className="h-8 w-8 fill-zinc-50" />
                </AvatarFallback>
              </Avatar>
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
        </Link>
        <img
          src={post.imageUrl}
          className="w-full object-cover"
          width={post.imageWidth}
          height={post.imageHeight}
          onDoubleClick={handleLikeClick}
        />
        <div className="flex justify-between p-4">
          <div className="flex gap-4">
            <div
              className="flex cursor-pointer gap-2"
              onClick={handleLikeClick}
            >
              <FaHeart
                className={`h-6 w-6 ${postLiked ? "fill-rose-600" : "fill-zinc-50"}`}
              />
              <p>{postLikesCount}</p>
            </div>
            <div className="flex gap-2">
              <FaComment className="h-6 w-6 fill-zinc-50" />
              <p>{commentCount}</p>
            </div>
          </div>
          <FaShare
            className="h-6 w-6 fill-zinc-50 hover:scale-95 hover:cursor-pointer hover:fill-violet-400"
            onClick={() => {
              navigator.clipboard.writeText(
                `${import.meta.env.VITE_FE_URL}/posts/${post.id}`,
              );
              toast({ description: "✅ Post link copied to clipboard" });
            }}
          />
        </div>
        <div className="px-4">
          <p className="text-mobsmp text-zinc-500 md:text-desksmp">
            {DateTime.fromISO(post.updatedAt).toLocaleString(
              DateTime.DATETIME_MED,
            )}
          </p>
          <p className="text-zinc-50">{post.caption}</p>
        </div>
        <Button
          variant="link"
          className="text-zinc-300"
          onClick={() => setShowComments(true)}
        >
          View Comments...
        </Button>
        {(post.userIsAuthor ||
          (authUserQuery.isSuccess && authUserQuery.data.isAdmin)) && (
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
          <PostCardComments
            postId={post.id}
            postImg={post.imageUrl}
            postImgWidth={post.imageWidth}
            postImgHeight={post.imageHeight}
            setShowComments={setShowComments}
          />
        )}
      </div>
    </PostCardContext.Provider>
  );
}

export default PostCard;
