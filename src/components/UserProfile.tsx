import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { followMutation, unfollowMutation } from "@/tquery/mutations";
import { QueryKeys } from "@/tquery/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { HiUser } from "react-icons/hi";
import { FaPlus, FaMinus } from "react-icons/fa";
import { NavLink } from "react-router";

export type UserFromRequest = {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  profileImg: string | null;
  _count: {
    posts: number;
    followedBy: number;
    following: number;
  };
  areFollowing: boolean;
};
type UserProfileProps = {
  user: UserFromRequest;
};
function UserProfile({ user }: UserProfileProps) {
  const [following, setFollowing] = useState(user.areFollowing);
  const [followerCount, setFollowerCount] = useState(user._count.followedBy);

  const queryClient = useQueryClient();
  const followMuta = useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      followMutation(username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER, user.username],
      });
      setFollowing(true);
      setFollowerCount((num) => num + 1);
    },
  });
  const unfollowMuta = useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      unfollowMutation(username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER, user.username],
      });
      setFollowing(false);
      setFollowerCount((num) => num - 1);
    },
  });
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-10 rounded-xl bg-zinc-800 p-6">
      <div className="flex gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={user.profileImg ?? ""}
            alt={`${user.name}'s profile image`}
            className="object-cover"
          />
          <AvatarFallback className="bg-zinc-700">
            <HiUser className="h-14 w-14 fill-zinc-50" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-4">
          <div className="flex grow items-center justify-between gap-4">
            <div>
              <h1 className="text-mobh4 font-semibold lg:text-deskh4 lg:font-semibold">
                {user.name}
              </h1>
              <p className="text-zinc-300">@{user.username}</p>
            </div>
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
          <p>
            {user.bio && user.bio !== "undefined"
              ? user.bio
              : "Follow me and get to know me! We might end up best friends!"}
          </p>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        {/* Links and stats */}
        <NavLink
          to={`/users/${user.username}`}
          className={({ isActive }) =>
            `flex gap-4 ${isActive ? "border-b-2 border-zinc-50" : ""}`
          }
          end
        >
          <p>Posts</p>
          <p>{user._count.posts}</p>
        </NavLink>
        <NavLink
          to={`/users/${user.username}/followers`}
          className={({ isActive }) =>
            `flex gap-4 ${isActive ? "border-b-2 border-zinc-50" : ""}`
          }
        >
          <p>Followers</p>
          <p>{followerCount}</p>
        </NavLink>
        <NavLink
          to={`/users/${user.username}/following`}
          className={({ isActive }) =>
            `flex gap-4 ${isActive ? "border-b-2 border-zinc-50" : ""}`
          }
        >
          <p>Following</p>
          <p>{user._count.following}</p>
        </NavLink>
      </div>
    </div>
  );
}

export default UserProfile;
