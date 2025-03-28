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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HiUser } from "react-icons/hi";
import { useState } from "react";
import AvatarUploader from "./AvatarUploader";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProfileInfo, EditProfileInfoPayload } from "@/tquery/mutations";
import { QueryKeys } from "@/tquery/queryKeys";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name should be at least 3 characters" })
    .max(48, { message: "Name should be at most 48 characters" }),
  bio: z
    .string()
    .max(512, { message: "bio should be at most 512 characters" })
    .optional(),
  profileImg: z
    .instanceof(File, { message: "A file must be uploaded" })
    .optional(),
});
export type UserFromRequest = {
  id: string;
  name: string;
  bio: string | null;
  profileImg: string | null;
};
type EditProfileFormProps = {
  user: UserFromRequest;
};
function EditProfileForm({ user }: EditProfileFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imgPreview, setImgPreview] = useState<string | null>(user.profileImg);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      bio: user.bio ?? "",
      profileImg: undefined as unknown as File,
    },
  });

  const editProfileMuta = useMutation({
    mutationFn: async (payload: EditProfileInfoPayload) => {
      const data = await editProfileInfo(payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER, "current"],
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER, "auth"] });
      toast({
        description: "👍 Your Profile has been updated",
      });
    },
    onError: () => {
      toast({
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    editProfileMuta.mutate(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full gap-4 lg:grid-cols-6"
      >
        <div className="flex flex-col items-center gap-4 lg:col-span-2">
          <Avatar className="h-28 w-28">
            <AvatarImage
              src={imgPreview ?? ""}
              alt={`${user.name}'s profile image`}
              className="object-cover"
            />
            <AvatarFallback className="bg-zinc-700">
              <HiUser className="h-16 w-16 fill-zinc-50" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-2">
            <p className="text-mobp font-semibold text-zinc-50 lg:text-deskp lg:font-semibold">
              Update Profile Image
            </p>
            <p className="lg:text-deksmp text-mobsmp text-zinc-200">
              Should be less than 5mb
            </p>
            <p className="text-mobxsp text-zinc-300 lg:text-deskxsp">
              Recommended size:
            </p>
            <p className="text-mobxsp text-zinc-300 lg:text-deskxsp">
              500px x 500px
            </p>
          </div>
          <FormField
            control={form.control}
            name="profileImg"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AvatarUploader
                    onChange={field.onChange}
                    setImgPreview={setImgPreview}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-zinc-100">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-zinc-600 bg-zinc-700 text-zinc-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-zinc-100">
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="min-h-44 border-zinc-600 bg-zinc-700 text-zinc-50"
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
            disabled={editProfileMuta.isPending}
          >
            {editProfileMuta.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default EditProfileForm;
