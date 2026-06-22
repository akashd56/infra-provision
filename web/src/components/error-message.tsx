type ErrorMessageProps = {
  message: string;
};

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <p className="text-red-600">{message}</p>
    </div>
  );
}

export { ErrorMessage };
