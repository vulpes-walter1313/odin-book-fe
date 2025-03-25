import EditProfileForm from "@/components/EditProfileForm";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingMessage from "@/components/LoadingMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUserProfile } from "@/tquery/queries";
import { QueryKeys } from "@/tquery/queryKeys";
import { useQuery } from "@tanstack/react-query";

function AccountPage() {
  const { data, isSuccess, isError, isLoading } = useQuery({
    queryFn: getCurrentUserProfile,
    queryKey: [QueryKeys.USER, "current"],
  });
  return (
    <div className="min-h-screen bg-zinc-900 py-16 text-zinc-50">
      <div className="mx-auto flex max-w-2xl flex-col">
        <Card className="border-0 bg-zinc-800">
          <CardHeader>
            <CardTitle>
              <h1 className="text-zinc-50">Edit Profile Info</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSuccess && data && <EditProfileForm user={data.user} />}
            {isLoading && <LoadingMessage message="Loading..." />}
            {isError && (
              <ErrorMessage message="There was an error in loading profile data. Please refresh page." />
            )}
          </CardContent>
        </Card>
        <div>
          <h2>Change Password</h2>
        </div>
        <div>
          <h2>Danger Zone</h2>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
