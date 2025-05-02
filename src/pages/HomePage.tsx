import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function HomePage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[radial-gradient(#1e1b4b,#18181b)] px-4 py-12 lg:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-6">
        <div className="flex flex-col gap-8 lg:col-span-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-mobh1 text-zinc-50 lg:text-deskh1">
              Follow Your Friends, Real or Parasocial!
            </h1>
            <p className="text-mobp font-semibold text-zinc-50 lg:text-deskp lg:font-semibold">
              Share your day with an image and a caption! Just like every other
              platform.
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/signin" className="text-violet-400">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
        <img
          src="/Internet_friends_CC.svg"
          width={2734}
          height={2609}
          className="lg:col-span-3"
        />
      </div>
    </main>
  );
}

export default HomePage;
