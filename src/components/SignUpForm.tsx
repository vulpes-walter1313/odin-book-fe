import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUpMutation } from "@/tquery/mutations";
import { useState } from "react";
import { BannedError } from "@/lib/errors";
import { useNavigate } from "react-router";
import { QueryKeys } from "@/tquery/queryKeys";

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(48, { message: "Name must be at least 48 characters long" }),
    username: z
      .string()
      .min(3, { message: "username must be at least 3 characters long" })
      .max(48, { message: "" })
      .refine((val) => !val.includes("@"), {
        message: "Username should not include an @ symbol",
      }),
    email: z.string().email(),
    password: z
      .string()
      .min(0, { message: "Please enter a password" })
      .max(64, { message: "Password should be less than 64" }),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords must match",
        code: "custom",
      });
    }
  });

function SignUpForm() {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const signupMuta = useMutation({
    // replace with signUpMutation
    mutationFn: signUpMutation,
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
      navigate("/feed");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    signupMuta.mutate(values);
  }
  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg text-zinc-50">Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Display name"
                  {...field}
                  className="bg-zinc-50"
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg text-zinc-50">Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Display name"
                  {...field}
                  className="bg-zinc-50"
                />
              </FormControl>
              <FormDescription>
                This is a unique username that your friends can use to find you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg text-zinc-50">
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Confirm password"
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
          disabled={signupMuta.isPending}
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
}

export default SignUpForm;
