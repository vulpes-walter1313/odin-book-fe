import { createContext } from "react";

type PostCardContextValue = {
  postId: number;
  feedSort: "popular" | "latest" | "oldest";
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
};
export const PostCardContext = createContext<PostCardContextValue>(
  {} as PostCardContextValue,
);
