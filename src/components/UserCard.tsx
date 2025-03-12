import { followMutation, unfollowMutation } from "@/tquery/mutations";
import { QueryKeys } from "@/tquery/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiUser } from "react-icons/hi";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router";
import { useState } from "react";

export type UserFromRequest = {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  profileImg: string | null;
  _count: {
    followedBy: number;
  };
  areFollowing: boolean;
};
type UserCardProps = {
  user: UserFromRequest;
};
function UserCard({ user }: UserCardProps) {
  const [following, setFollowing] = useState(user.areFollowing);
  const [followerCount, setFollowerCount] = useState(user._count.followedBy);
  const queryClient = useQueryClient();
  const followMuta = useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      followMutation(username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FIND_USERS] });
      setFollowing(true);
      setFollowerCount((num) => num + 1);
    },
  });
  const unfollowMuta = useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      unfollowMutation(username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FIND_USERS] });
      setFollowing(false);
      setFollowerCount((num) => num - 1);
    },
  });
  return (
    <div
      key={user.id}
      className="flex w-60 flex-col items-center justify-between rounded-xl bg-zinc-800 px-4 py-2"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        {user.profileImg ? (
          <img
            src={user.profileImg}
            alt={`${user.name}'s profile image`}
            width={56}
            height={56}
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-700">
            <HiUser className="h-10 w-10 fill-zinc-50" />
          </div>
        )}
        <div className="flex flex-col gap-2 text-center">
          <div className="flex flex-col gap-1">
            <p className="text-mobh6 text-zinc-50 md:text-deskh6">
              {user.name}
            </p>
            <p className="text-mobxsp font-medium text-zinc-300 md:text-deskxsp md:font-medium">
              {followerCount} followers
            </p>
          </div>
          <p className="text-mobsmp text-zinc-400 md:text-desksmp">
            @{user.username}
          </p>
        </div>
      </div>
      <div>
        <p className="text-mobsmp text-zinc-50 md:text-desksmp">
          {user.bio
            ? user.bio
            : "Hi everyone, follow me and get to know me! We might vibe together!"}
        </p>
      </div>
      <div className="flex gap-2 py-2">
        {following ? (
          <button
            onClick={() => unfollowMuta.mutate({ username: user.username })}
            className="flex items-center justify-center gap-2 rounded-md border-2 border-violet-400 px-4 py-2 text-mobsmp leading-none text-violet-400 md:text-desksmp md:leading-none"
          >
            Unfollow
            <FaMinus />
          </button>
        ) : (
          <button
            onClick={() => followMuta.mutate({ username: user.username })}
            className="flex items-center justify-center gap-2 rounded-md bg-violet-400 px-4 py-2 text-mobsmp leading-none text-zinc-900 md:text-desksmp md:leading-none"
          >
            Follow
            <FaPlus className="h-3 w-3 fill-zinc-800" />
          </button>
        )}
        <Link
          to={`/users/${user.username}`}
          className="flex items-center justify-center rounded-md border-2 border-violet-400 px-4 py-2 text-mobsmp leading-none text-violet-400 md:text-desksmp md:leading-none"
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default UserCard;
