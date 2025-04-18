import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  deleteUser,
  followMutation,
  unbanUser,
  unfollowMutation,
} from "@/tquery/mutations";
import { QueryKeys } from "@/tquery/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { HiUser } from "react-icons/hi";
import { FaPlus, FaMinus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router";
import { getAuthCheck } from "@/tquery/queries";
import { useToast } from "@/hooks/use-toast";
import BanUserModal from "./BanUserModal";
import { DateTime } from "luxon";

export type UserFromRequest = {
  id: string;
  name: string;
  username: string;
  bannedUntil: string | null;
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showBanModal, setShowBanModal] = useState(false);
  const [following, setFollowing] = useState(user.areFollowing);
  const [followerCount, setFollowerCount] = useState(user._count.followedBy);

  const authUserQuery = useQuery({
    queryFn: getAuthCheck,
    queryKey: [QueryKeys.USER, "auth"],
  });

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

  const deleteUserMuta = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast({ description: "Successfully deleted user" });
      setTimeout(() => {
        navigate("/feed");
      }, 3000);
    },
    onError: (err) => {
      toast({
        description: err.message ?? "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const unbanMuta = useMutation({
    mutationFn: unbanUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER],
      });
      toast({
        description: "User successfully unbanned",
      });
    },
    onError: () => {
      toast({
        description: "Unban failed!",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 rounded-xl bg-zinc-800 p-6">
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
      {/* Admin buttons */}
      {authUserQuery.isSuccess && authUserQuery.data.isAdmin === true && (
        <div className="mb-4 flex flex-col items-center gap-2">
          <h2 className="text-mobsmp font-medium lg:text-desksmp lg:font-medium">
            Admin Tools:
          </h2>
          <div className="flex justify-center gap-4">
            <button
              className="rounded-lg bg-red-500 px-4 py-2 text-mobsmp font-medium leading-none text-red-50 lg:text-desksmp lg:font-medium lg:leading-none"
              onClick={() => deleteUserMuta.mutate({ username: user.username })}
            >
              Delete
            </button>
            {user.bannedUntil &&
            DateTime.fromISO(user.bannedUntil).toJSDate() >
              new Date(Date.now()) ? (
              <button
                className="rounded-lg border-2 border-red-500 px-4 py-2 text-mobsmp font-medium leading-none text-red-500 lg:text-desksmp lg:font-medium lg:leading-none"
                onClick={() => unbanMuta.mutate({ username: user.username })}
              >
                Unban
              </button>
            ) : (
              <button
                className="rounded-lg border-2 border-red-500 px-4 py-2 text-mobsmp font-medium leading-none text-red-500 lg:text-desksmp lg:font-medium lg:leading-none"
                onClick={() => setShowBanModal(true)}
              >
                Ban
              </button>
            )}
          </div>
          {showBanModal && (
            <BanUserModal
              setShowBanModal={setShowBanModal}
              username={user.username}
            />
          )}
        </div>
      )}
      {user.bannedUntil &&
      DateTime.fromISO(user.bannedUntil).toJSDate() > new Date(Date.now()) ? (
        <p className="rounded-md bg-amber-200 p-4 text-amber-950">
          Banned Until:{" "}
          {DateTime.fromISO(user.bannedUntil).toLocaleString(
            DateTime.DATETIME_MED_WITH_WEEKDAY,
          )}
        </p>
      ) : null}
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
