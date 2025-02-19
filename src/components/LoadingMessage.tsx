import { AiOutlineLoading3Quarters } from "react-icons/ai";
type LoadingMessageProps = {
  message: string;
};
function LoadingMessage({ message }: LoadingMessageProps) {
  return (
    <div className="flex gap-4">
      <AiOutlineLoading3Quarters className="h-8 w-8 animate-spin fill-zinc-50" />
      <p className="text-mobp text-zinc-50 md:text-deskp">{message}</p>
    </div>
  );
}

export default LoadingMessage;
