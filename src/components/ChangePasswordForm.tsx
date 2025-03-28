import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/tquery/mutations";
import { toast } from "@/hooks/use-toast";

const formSchema = z
  .object({
    // update the input validation
    oldPassword: z
      .string()
      .max(48, { message: "Old Password should be at most 48 characters" }),
    newPassword: z
      .string()
      .min(8, { message: "New Password should be at least 8 characters" })
      .max(48, {
        message: "New Password must be at most 48 characters",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "New Password should be at least 8 characters" })
      .max(48, { message: "Confirm Password should be at most 48 characters" }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords must match",
        code: "custom",
      });
    }
  });

function ChangePasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const updatePasswordMuta = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const data = await updatePassword({
        newPassword: values.newPassword,
        oldPassword: values.oldPassword,
        confirmNewPassword: values.confirmPassword,
      });
      return data;
    },
    onSuccess: () => {
      toast({
        description: "👍 Your Profile has been updated",
      });
    },
    onError: (err) => {
      toast({
        description: err.message,
        variant: "destructive",
      });
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    updatePasswordMuta.mutate(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-zinc-100">
                Old Password:
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-zinc-600 bg-zinc-700 text-zinc-50"
                  placeholder="••••••••"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-zinc-100">
                New Password
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-zinc-600 bg-zinc-700 text-zinc-50"
                  placeholder="••••••••"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-zinc-100">
                Confirm New Password
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-zinc-600 bg-zinc-700 text-zinc-50"
                  placeholder="••••••••"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="default"
          type="submit"
          className="self-start px-8"
          disabled={updatePasswordMuta.isPending}
        >
          {updatePasswordMuta.isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}

export default ChangePasswordForm;
