import { Button } from "@/components/ui/button";
import { Link, NavLink, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/tquery/queryKeys";
import { getAuthCheck } from "@/tquery/queries";
import { HiUser } from "react-icons/hi";
import { useState } from "react";
import { logout } from "@/lib/requests";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const { isError, isPending, isSuccess, data } = useQuery({
    queryKey: [QueryKeys.USER, "auth"],
    queryFn: getAuthCheck,
  });
  return (
    <nav className="bg-zinc-900 p-4 text-zinc-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link to="/">
          <p className="text-mobh5 md:text-deskh5">Odook</p>
        </Link>
        {(isError || isPending) && (
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <NavLink to="/signin" className="text-violet-400">
                Sign In
              </NavLink>
            </Button>
            <Button variant="default" asChild>
              <NavLink to="/signup" className="">
                Sign Up
              </NavLink>
            </Button>
          </div>
        )}
        {isSuccess && data != undefined && (
          <div className="relative flex items-center gap-4">
            <Button variant="link" asChild className="text-purple-400">
              <NavLink to="/feed" className="hidden md:block">
                Home
              </NavLink>
            </Button>
            <Button
              variant="default"
              asChild
              className="hidden md:flex md:items-center"
            >
              <NavLink to="/posts/create">Create Post</NavLink>
            </Button>
            <div
              className="flex cursor-pointer items-center gap-4"
              onClick={() => setSubmenuOpen((bool) => !bool)}
            >
              <p className="hidden md:block">{data.name}</p>
              <Avatar className="h-11 w-11">
                <AvatarImage
                  src={data.profileImg ?? ""}
                  alt={`${data.name}'s profile image`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-zinc-700">
                  <HiUser className="h-6 w-6 fill-zinc-50" />
                </AvatarFallback>
              </Avatar>
            </div>
            {submenuOpen && (
              <div
                className="absolute right-0 top-16 flex flex-col justify-center rounded-lg bg-zinc-800 p-4"
                onClick={() => setSubmenuOpen(false)}
              >
                <Button variant="link" asChild className="text-violet-400">
                  <NavLink to={`/users/${data.username}`}>Your Profile</NavLink>
                </Button>
                <Button variant="link" asChild className="text-violet-400">
                  <NavLink to="/account">Settings</NavLink>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center text-violet-400"
                  onClick={() => {
                    logout();
                    queryClient.invalidateQueries({
                      queryKey: [QueryKeys.USER],
                    });
                    navigate("/signin");
                  }}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
