import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { formatDateForDateTimeLocalInput } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { banUser } from "@/tquery/mutations";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  banUntil: z.string().regex(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/),
});

type BanUserFormProps = {
  username: string;
  setShowBanModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function BanUserForm({ username, setShowBanModal }: BanUserFormProps) {
  const { toast } = useToast();
  const [date] = useState<Date>(new Date(Date.now() + 1 * 60 * 60 * 1000));
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      banUntil: formatDateForDateTimeLocalInput(date),
    },
  });
  const banUserMuta = useMutation({
    mutationFn: banUser,
    onSuccess: () => {
      toast({ description: "User successfully banned!" });
    },
    onError: (err) => {
      toast({
        description: err.message ?? "User ban failed!",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const date = new Date(values.banUntil).toISOString();
    banUserMuta.mutate({ username: username, banUntil: date });
    setShowBanModal(false);
  }
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="banUntil"
          render={({ field }) => (
            <FormItem className="self-start">
              <FormLabel className="text-mobp font-medium lg:text-deskp lg:font-medium">
                Ban until date:
              </FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  className="text-zinc-800"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This the date you want to lift the ban.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Ban</Button>
      </form>
    </Form>
  );
}

export default BanUserForm;
