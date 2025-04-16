import BanUserForm from "./BanUserForm";
import { Card, CardContent, CardHeader } from "./ui/card";

type BanUserModalProps = {
  username: string;
  setShowBanModal: React.Dispatch<React.SetStateAction<boolean>>;
};
function BanUserModal({ username, setShowBanModal }: BanUserModalProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-zinc-950/60"
      onClick={() => setShowBanModal(false)}
    >
      <Card
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-full max-w-screen-sm border-0 bg-zinc-700 text-zinc-50"
      >
        <CardHeader>
          <h2>Ban User</h2>
        </CardHeader>
        <CardContent>
          <BanUserForm username={username} setShowBanModal={setShowBanModal} />
        </CardContent>
      </Card>
    </div>
  );
}

export default BanUserModal;
