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
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInMutation } from "@/tquery/mutations";
import { useState } from "react";
import { BannedError } from "@/lib/errors";
import { useNavigate } from "react-router";
import { QueryKeys } from "@/tquery/queryKeys";

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(0, { message: "Please enter a password" })
    .max(64, { message: "Password should be less than 64" }),
});

function SignInForm() {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const signinMuta = useMutation({
    mutationFn: signInMutation,
    onError: (err) => {
      if (err instanceof BannedError) {
        setError(
          `${err.message} - Banned until ${err.bannedUntil?.toLocaleString()}`,
        );
      } else {
        setError(err.message ?? "Error in signin in.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
      navigate("/");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    signinMuta.mutate(values);
  }
  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg text-zinc-50">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  {...field}
                  className="bg-zinc-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg text-zinc-50">Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Password"
                  type="password"
                  {...field}
                  className="bg-zinc-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <p className="bg-red-100 p-4 text-mobp text-red-900 md:text-deskp">
            {error}
          </p>
        )}
        <Button
          className="self-start text-lg"
          type="submit"
          disabled={signinMuta.isPending}
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
}

export default SignInForm;
