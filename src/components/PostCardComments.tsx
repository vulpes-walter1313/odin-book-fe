import { IoClose } from "react-icons/io5";
type PostCardCommentsProps = {
  postId: number;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
};
function PostCardComments({ postId, setShowComments }: PostCardCommentsProps) {
  // TODO: get comments
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 border border-zinc-700 bg-zinc-900">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <p className="text-mobh6 font-semibold text-zinc-50 lg:text-deskh6 lg:font-semibold">
            Comments
          </p>
          <IoClose
            className="h-6 w-6 fill-zinc-50"
            onClick={() => setShowComments(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default PostCardComments;
