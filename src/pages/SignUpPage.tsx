import SignUpForm from "@/components/SignUpForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-4 py-14">
      <Card className="mx-auto w-full max-w-md border-0 bg-zinc-800">
        <CardHeader>
          <CardTitle>
            <h1 className="text-zinc-50">Sign Up</h1>
          </CardTitle>
          <CardDescription>
            <p className="text-zinc-50">Sign up to jump the fun!</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupPage;
