import { NavLink } from "react-router";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaHeart } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi2";
import { MdRssFeed } from "react-icons/md";
import { MdOutlineExplore } from "react-icons/md";

function SidebarNav() {
  return (
    <div className="fixed bottom-10 left-4 right-4 z-10 flex h-min flex-col gap-20 rounded-xl bg-zinc-800/50 px-4 py-4 backdrop-blur-md lg:left-[max(0px,calc(50%-37rem))] lg:right-auto lg:top-28 lg:w-64 lg:bg-zinc-800 lg:py-6 lg:backdrop-blur-none">
      <div className="flex justify-between lg:flex-col lg:gap-3">
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `flex items-center justify-between rounded-full px-3 py-3 lg:rounded-lg lg:px-4 ${
              isActive ? "bg-zinc-50" : "lg:bg-zinc-800"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <p
                className={`hidden text-mobh6 lg:block lg:text-deskh6 ${
                  isActive ? "text-zinc-800" : "text-zinc-50"
                }`}
              >
                Feed
              </p>
              <MdRssFeed
                className={`h-8 w-8 ${
                  isActive ? "fill-zinc-800" : "fill-zinc-50"
                }`}
              />
            </>
          )}
        </NavLink>
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex items-center justify-between rounded-full px-3 py-3 lg:rounded-lg lg:px-4 ${
              isActive ? "bg-zinc-50" : "lg:bg-zinc-800"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <p
                className={`hidden text-mobh6 lg:block lg:text-deskh6 ${
                  isActive ? "text-zinc-800" : "text-zinc-50"
                }`}
              >
                Explore
              </p>
              <MdOutlineExplore
                className={`h-8 w-8 ${
                  isActive ? "fill-zinc-800" : "fill-zinc-50"
                }`}
              />
            </>
          )}
        </NavLink>
        <NavLink
          to="/posts/create"
          className={({ isActive }) =>
            `flex items-center justify-between rounded-full px-3 py-3 lg:hidden ${
              isActive ? "bg-zinc-50" : "bg-violet-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <IoMdAddCircleOutline
                className={`h-8 w-8 ${
                  isActive ? "fill-zinc-800" : "fill-violet-950"
                }`}
              />
            </>
          )}
        </NavLink>
        <NavLink
          to="/users"
          end
          className={({ isActive }) =>
            `flex items-center justify-between rounded-full px-3 py-3 lg:rounded-lg lg:px-4 ${
              isActive ? "bg-zinc-50" : "lg:bg-zinc-800"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <p
                className={`hidden text-mobh6 lg:block lg:text-deskh6 ${
                  isActive ? "text-zinc-800" : "text-zinc-50"
                }`}
              >
                Find Users
              </p>
              <HiUsers
                className={`h-8 w-8 ${
                  isActive ? "fill-zinc-800" : "fill-zinc-50"
                }`}
              />
            </>
          )}
        </NavLink>
        <NavLink
          to="/likes"
          className={({ isActive }) =>
            `flex items-center justify-between rounded-full px-3 py-3 lg:rounded-lg lg:px-4 ${
              isActive ? "bg-zinc-50" : "lg:bg-zinc-800"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <p
                className={`hidden text-mobh6 lg:block lg:text-deskh6 ${
                  isActive ? "text-zinc-800" : "text-zinc-50"
                }`}
              >
                Likes
              </p>
              <FaHeart
                className={`h-8 w-8 ${
                  isActive ? "fill-zinc-800" : "fill-zinc-50"
                }`}
              />
            </>
          )}
        </NavLink>
      </div>
      <NavLink
        to="/posts/create"
        className="hidden items-center justify-between rounded-lg bg-violet-400 px-4 py-3 lg:flex"
      >
        <p className="text-mobh6 text-violet-950 lg:text-deskh6">Create Post</p>
        <IoMdAddCircleOutline className="h-8 w-8 fill-violet-950" />
      </NavLink>
    </div>
  );
}

export default SidebarNav;
