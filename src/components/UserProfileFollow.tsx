import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HiUser } from "react-icons/hi";
import { followMutation, unfollowMutation } from "@/tquery/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/tquery/queryKeys";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router";

export type UserProfileFromRequest = {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  profileImg: string | null;
  _count: {
    followedBy: number;
    following: number;
  };
  areFollowing: boolean;
};
type UserProfileFollowProps = {
  user: UserProfileFromRequest;
  type: "following" | "followers";
};
function UserProfileFollow({ user, type }: UserProfileFollowProps) {
  const [following, setFollowing] = useState(user.areFollowing);
  const [followedByCount, setFollowedByCount] = useState(
    user._count.followedBy,
  );

  const queryClient = useQueryClient();
  const followMuta = useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      followMutation(username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER, user.username, type],
      });
      setFollowing(true);
      setFollowedByCount((num) => num + 1);
    },
  });
  const unfollowMuta = useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      unfollowMutation(username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER, user.username, type],
      });
      setFollowing(false);
      setFollowedByCount((num) => num - 1);
    },
  });
  return (
    <div className="rounded-xl bg-zinc-800 p-4">
      <div className="flex items-center justify-between">
        <Link to={`/users/${user.username}`} className="flex gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={user.profileImg ?? ""}
              alt={`${user.name}'s profile image`}
              className="object-cover"
            />
            <AvatarFallback className="bg-zinc-700">
              <HiUser className="h-8 w-8 fill-zinc-50" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-mobp font-semibold text-zinc-50 lg:text-deskp lg:font-semibold">
              {user.name}
            </p>
            <p className="text-mobsmp font-medium text-zinc-300 lg:text-desksmp lg:font-medium">
              @{user.username}
            </p>
          </div>
        </Link>
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
      </div>
      <div className="flex gap-4 pt-2 text-zinc-400">
        <p className="text-mobxsp lg:text-deskxsp">
          Followers: {followedByCount}
        </p>
        <p className="text-mobxsp lg:text-deskxsp">
          Following: {user._count.following}
        </p>
      </div>
      <p className="text-zinc-300">
        {user.bio && user.bio !== "undefined"
          ? user.bio
          : "Follow me to get to know me! We might become best friends!"}
      </p>
    </div>
  );
}

export default UserProfileFollow;
