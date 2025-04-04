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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccount } from "@/tquery/mutations";
import { QueryKeys } from "@/tquery/queryKeys";
import { useToast } from "@/hooks/use-toast";
import { logout } from "@/lib/requests";
import { useNavigate } from "react-router";

const formSchema = z.object({
  password: z.string(),
});

function DeleteAccountForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const deleteAccountMuta = useMutation({
    mutationFn: async (payload: z.infer<typeof formSchema>) => {
      const data = await deleteAccount(payload);
      return data;
    },
    onSuccess: () => {
      for (const val of Object.values(QueryKeys)) {
        queryClient.removeQueries({ queryKey: [val] });
      }
      toast({
        description: "Your account has been deleted",
      });
      logout();
      navigate("/signup");
    },
    onError: (err) => {
      toast({
        description: err.message ?? "There was an error. Please try again.",
        variant: "destructive",
      });
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    deleteAccountMuta.mutate(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full gap-4"
      >
        <div className="flex w-full flex-col items-center gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-mobp text-zinc-50 lg:text-deskp">
                  Password
                </FormLabel>
                <FormControl>
                  <Input type="password" {...field} className="" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="default"
            type="submit"
            className="self-start px-8"
            disabled={deleteAccountMuta.isPending}
          >
            {deleteAccountMuta.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default DeleteAccountForm;
