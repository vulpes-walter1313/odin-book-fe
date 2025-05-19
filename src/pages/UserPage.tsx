import LoadingMessage from "@/components/LoadingMessage";
import { getUserProfile } from "@/tquery/queries";
import { QueryKeys } from "@/tquery/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useParams } from "react-router";
import UserProfile, { UserFromRequest } from "@/components/UserProfile";
import ErrorMessage from "@/components/ErrorMessage";
import SidebarNav from "@/components/SidebarNav";
import AuthLayout from "@/layouts/AuthLayout";

function UserPage() {
  const { username } = useParams();

  const {
    data: user,
    isError,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: [QueryKeys.USER, username],
    queryFn: async () => {
      const data = await getUserProfile(username);
      return data.user as UserFromRequest;
    },
  });
  return (
    <AuthLayout>
      <div className="min-h-screen bg-zinc-900 text-zinc-50">
        <div className="px-4 pb-40 pt-6">
          <SidebarNav />
          {isSuccess && user && <UserProfile user={user} />}
          {isPending && (
            <LoadingMessage message={`loading ${username}'s profile`} />
          )}
          {isError && <ErrorMessage message="Something went wrong" />}
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default UserPage;
