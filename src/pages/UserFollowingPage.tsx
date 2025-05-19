import { getUserFollowing } from "@/tquery/queries";
import { QueryKeys } from "@/tquery/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";
import UserProfileFollow, {
  UserProfileFromRequest,
} from "@/components/UserProfileFollow";

function UserFollowingPage() {
  const { username } = useParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const totalPagesArr = Array.from({ length: totalPages }).map(
    (_, idx) => idx + 1,
  );
  const { data, isSuccess } = useQuery({
    queryKey: [QueryKeys.USER, username ?? "", "following"],
    queryFn: async () => {
      const data = await getUserFollowing(username, page);
      if (
        data.totalPages &&
        typeof data.totalPages === "number" &&
        totalPages !== data.totalPages
      ) {
        setTotalPages(data.totalPages);
      }
      return data.users as UserProfileFromRequest[];
    },
  });
  return (
    <div className="mx-auto mt-4 max-w-xl pt-8">
      <div className="flex flex-col gap-4">
        {isSuccess &&
          data &&
          data.map((user) => (
            <UserProfileFollow user={user} type="following" key={user.id} />
          ))}
      </div>
      <div className="flex justify-center py-12">
        {totalPagesArr.map((num) => {
          return (
            <button
              onClick={() => setPage(num)}
              key={num}
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${num === page ? "bg-violet-400 text-zinc-800" : "border border-violet-400 text-violet-400"}`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default UserFollowingPage;
