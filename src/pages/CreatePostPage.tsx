import CreatePostForm from "@/components/CreatePostForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function CreatePostPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4">
      <Card className="w-full max-w-2xl border-0 bg-zinc-800 text-zinc-50">
        <CardHeader>
          <h1>Create Post</h1>
        </CardHeader>
        <CardContent>
          <CreatePostForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default CreatePostPage;
