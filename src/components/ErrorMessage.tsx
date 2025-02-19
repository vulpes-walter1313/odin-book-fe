type ErrorMessageProps = {
  message: string;
};
function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p className="bg-red-100 p-4 text-mobp text-red-900 md:text-deskp">
      {message}
    </p>
  );
}

export default ErrorMessage;
