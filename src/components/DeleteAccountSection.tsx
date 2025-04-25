import { Button } from "./ui/button";
import { useState } from "react";
import DeleteAccountForm from "./DeleteAccountForm";

type ConfirmDeleteProps = {
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
};
function ConfirmDelete({ setShowDeleteModal }: ConfirmDeleteProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-zinc-900/70"
      onClick={() => setShowDeleteModal(false)}
    >
      <div
        className="flex max-w-xl flex-col gap-4 rounded-lg bg-zinc-800 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-zinc-50">
          Are you sure you want to delete your account?
        </h2>
        <p className="text-zinc-200">
          This action is immediate and will permanently delete all your posts
          and comments.
        </p>
        <p className="text-mobsmp text-zinc-400 lg:text-desksmp">
          Type this below: delete my account
        </p>
        <DeleteAccountForm />
      </div>
    </div>
  );
}

function DeleteAccountSection() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <p className="text-mobp font-semibold text-red-100 lg:text-deskp lg:font-semibold">
          Delete Account
        </p>
        <p className="text-mobsmp text-red-100 lg:text-desksmp">
          All your comments, posts, and account will be deleted
        </p>
      </div>
      <Button
        variant="destructive"
        className="self-start"
        onClick={() => setShowDeleteModal(true)}
      >
        Delete
      </Button>
      {showDeleteModal && (
        <ConfirmDelete setShowDeleteModal={setShowDeleteModal} />
      )}
    </div>
  );
}

export default DeleteAccountSection;
