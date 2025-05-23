import ChangePasswordForm from "@/components/ChangePasswordForm";
import ChangeUsernameForm from "@/components/ChangeUsernameForm";
import DeleteAccountSection from "@/components/DeleteAccountSection";
import EditProfileForm from "@/components/EditProfileForm";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingMessage from "@/components/LoadingMessage";
import SidebarNav from "@/components/SidebarNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthLayout from "@/layouts/AuthLayout";
import { getCurrentUserAccount } from "@/tquery/queries";
import { QueryKeys } from "@/tquery/queryKeys";
import { useQuery } from "@tanstack/react-query";

function AccountPage() {
  const { data, isSuccess, isError, isLoading } = useQuery({
    queryFn: getCurrentUserAccount,
    queryKey: [QueryKeys.USER, "current"],
  });
  return (
    <AuthLayout>
      <div className="min-h-screen bg-zinc-900 px-4 py-10 text-zinc-50">
        <SidebarNav />
        <div className="mx-auto flex max-w-xl flex-col gap-6">
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
          <Card className="border-0 bg-zinc-800">
            <CardHeader>
              <CardTitle>
                <h2 className="text-zinc-50">Change Username</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSuccess && data && <ChangeUsernameForm user={data.user} />}
              {isLoading && <LoadingMessage message="Loading..." />}
              {isError && (
                <ErrorMessage message="There was an error in loading profile data. Please refresh page." />
              )}
            </CardContent>
          </Card>
          {isSuccess && data.hasCredentialsAccount && (
            <Card className="border-0 bg-zinc-800">
              <CardHeader>
                <CardTitle>
                  <h2 className="text-zinc-50">Change Password</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSuccess && data && <ChangePasswordForm />}
                {isLoading && <LoadingMessage message="Loading..." />}
                {isError && (
                  <ErrorMessage message="There was an error in loading profile data. Please refresh page." />
                )}
              </CardContent>
            </Card>
          )}
          <Card className="mb-28 border-0 bg-zinc-800">
            <CardHeader>
              <CardTitle>
                <h2 className="text-red-600">Danger Zone</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSuccess && data && <DeleteAccountSection />}
              {isLoading && <LoadingMessage message="Loading..." />}
              {isError && (
                <ErrorMessage message="There was an error in loading profile data. Please refresh page." />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthLayout>
  );
}

export default AccountPage;
