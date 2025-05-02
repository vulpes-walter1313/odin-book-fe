import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { useNavigate } from "react-router";
import FileUploader from "./FileUploader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/tquery/mutations";
import { QueryKeys } from "@/tquery/queryKeys";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  caption: z
    .string()
    .min(1, {
      message: "caption must be at least 1 characters.",
    })
    .max(2048, { message: "caption must be less than 2048 characters" }),
  image: z.instanceof(File, { message: "A file must be uploaded" }),
});

function CreatePostForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createPostMuta = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const data = await createPost(values);
      return data;
    },
    onSuccess: () => {
      toast({ description: "Post Created" });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FEED] });
      navigate("/feed");
    },
    onError: (err) => {
      toast({
        description: err.message ?? "Error occured in upload",
        variant: "destructive",
      });
    },
  });
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      image: undefined as unknown as File,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createPostMuta.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-1"
      >
        <div className="flex w-full flex-col gap-4 lg:col-span-3">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <FileUploader
                    onChange={field.onChange}
                    setImgPreview={setImgPreview}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {imgPreview && (
            <img
              src={imgPreview}
              alt="image Preview"
              className="h-auto w-full rounded-lg"
            />
          )}
        </div>
        <div className="flex flex-col gap-4 lg:col-span-3">
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caption</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write down your thoughts..."
                    className="border border-zinc-600 bg-zinc-700 text-mobp text-zinc-200 placeholder:text-zinc-500 lg:text-deskp"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button
              type="submit"
              className="self-start"
              disabled={createPostMuta.isPending}
            >
              {createPostMuta.isPending ? "Creating..." : "Create Post"}
            </Button>
            <Button
              type="button"
              variant="link"
              className="text-violet-400"
              onClick={() => navigate("/feed")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default CreatePostForm;
