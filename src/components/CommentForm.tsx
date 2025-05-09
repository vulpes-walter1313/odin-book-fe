import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { IoIosSend } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "@/tquery/mutations";
import { QueryKeys } from "@/tquery/queryKeys";
import { useContext } from "react";
import { PostCardContext } from "@/contexts/postCardContexts";

const formSchema = z.object({
  comment: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(2048, { message: "Comment should be 2048 characters or less" }),
});

type CommentFormProps = {
  postId: number;
};
function CommentForm({ postId }: CommentFormProps) {
  const queryClient = useQueryClient();
  const { setCommentCount } = useContext(PostCardContext);

  const postCommentMuta = useMutation({
    mutationFn: async ({ comment }: { comment: string }) => {
      const data = await postComment({ postId: postId, comment: comment });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.COMMENTS, `post-${postId}`],
      });
      setCommentCount((num) => num + 1);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    postCommentMuta.mutate({ comment: values.comment });
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full items-center justify-between gap-4"
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  {...field}
                  className="flex-1 resize-none border border-zinc-600 bg-zinc-700 text-zinc-200"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <button aria-roledescription="submit">
          <IoIosSend className="h-8 w-8 flex-none fill-zinc-50" />
        </button>
      </form>
    </Form>
  );
}

export default CommentForm;
