import SidebarNav from "@/components/SidebarNav";
import { getUserExplore } from "@/tquery/queries";
import { QueryKeys } from "@/tquery/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import UserCard, { UserFromRequest } from "@/components/UserCard";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { useDebouncedCallback } from "use-debounce";

function UsersPage() {
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSetKeyword = useDebouncedCallback((value) => {
    setSearchKeyword(value);
    console.log("debounced", value);
  }, 800);
  const [totalPages, setTotalPages] = useState(1);
  const pagesArr = Array.from({ length: totalPages }).map((_, idx) => idx + 1);
  const userQuery = useQuery({
    queryKey: [QueryKeys.FIND_USERS, `page-${page}`, searchKeyword],
    queryFn: async () => {
      const data = await getUserExplore(page, searchKeyword);
      if (data.totalPages != totalPages) {
        setTotalPages(data.totalPages);
      }
      return data.users;
    },
  });

  return (
    <div className="min-h-[calc(100vh-72px)] bg-zinc-900">
      <div className="pb-32 pt-14">
        <SidebarNav />
        <div className="mb-6 px-4">
          {/* search component here */}
          <div className="mx-auto flex max-w-72 items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800 pr-4">
            <Input
              type="text"
              className="border-0 bg-zinc-800 text-zinc-50"
              placeholder="Search by Username"
              onChange={(e) => debouncedSetKeyword(e.target.value)}
            />
            <FaSearch className="h-4 w-4 fill-zinc-50" />
          </div>
        </div>
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
          {userQuery.isLoading && <p>Loading...</p>}
          {userQuery.isError && <p>Error...</p>}
          {userQuery.data &&
            userQuery.data.map((user: UserFromRequest) => {
              return <UserCard user={user} key={user.id} />;
            })}
        </div>
        <div className="my-8 flex justify-center p-4">
          {pagesArr.map((num) => (
            <button
              className="min-h-8 min-w-8 rounded-lg bg-violet-400 text-mobp font-medium text-zinc-50 lg:text-deskp lg:font-medium"
              onClick={() => setPage(num)}
              key={num}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
