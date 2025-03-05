import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  const queryClient = useQueryClient();
  const createPostMuta = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const data = await createPost(values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FEED] });
      navigate("/feed");
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
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    createPostMuta.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <FileUploader
                  onChange={field.onChange}
                  setImgPreview={setImgPreview}
                />
              </FormControl>
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
            </FormItem>
          )}
        />
        <div>
          <Button type="submit" className="self-start">
            Create Post
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
      </form>
    </Form>
  );
}

export default CreatePostForm;
