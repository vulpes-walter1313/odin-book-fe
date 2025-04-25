import SignInForm from "@/components/SignInForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";

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
        <CardContent className="flex w-full flex-col items-center gap-4">
          <a
            href={`${import.meta.env.VITE_BE_URL}/auth/google`}
            className="flex items-center justify-center gap-4 rounded-lg bg-zinc-50 px-4 py-2 text-mobp lg:text-deskp"
          >
            <FcGoogle className="h-8 w-8" /> Continue With Google
          </a>
          <p className="text-zinc-50">&mdash; OR &mdash;</p>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default SigninPage;
