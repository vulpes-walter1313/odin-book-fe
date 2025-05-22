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
import { updateUsername } from "@/tquery/mutations";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const formSchema = z.object({
  newUsername: z
    .string()
    .min(3, { message: "Usernames should be at least 3 characters" })
    .max(32, {
      message: "Usernames must be at most 32 characters",
    })
    .regex(/^[a-zA-Z]\w+[^-_$%#@!\s&*()]$/, {
      message:
        "Usernames should not have special characters or spaces, and not start with an @.",
    }),
});

export type UserFromRequest = {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  profileImg: string | null;
};
type ChangeUsernameFormProps = {
  user: UserFromRequest;
};
function ChangeUsernameForm({ user }: ChangeUsernameFormProps) {
  const [usernameFromDb, setUsernameFormDb] = useState(user.username);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newUsername: "",
    },
  });
  const updateUsernameMuta = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const data = await updateUsername({
        newUsername: values.newUsername,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      setUsernameFormDb(variables.newUsername);
      toast({
        description: "👍 Your Username has been updated",
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
    updateUsernameMuta.mutate(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <div>
          <p className="text-lg font-semibold text-zinc-100">
            Current Username:
          </p>
          <p className="text-mobp text-zinc-50 lg:text-deskp">
            {usernameFromDb}
          </p>
        </div>
        <FormField
          control={form.control}
          name="newUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-zinc-100">
                New Username
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-zinc-600 bg-zinc-700 text-zinc-50"
                  placeholder="Your new username"
                  type="text"
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
          disabled={updateUsernameMuta.isPending}
        >
          {updateUsernameMuta.isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}

export default ChangeUsernameForm;
