import SignInForm from "@/components/SignInForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SigninPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-900 px-4 py-14">
      <Card className="mx-auto w-full max-w-md border-0 bg-zinc-800">
        <CardHeader>
          <CardTitle>
            <h1 className="text-zinc-50">Sign In</h1>
          </CardTitle>
          <CardDescription>
            <p className="text-zinc-50">Sign in to jump back in!</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default SigninPage;
