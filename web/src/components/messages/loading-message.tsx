type LoadingMessageProps = {
  message: string;
};

function LoadingMessage({ message }: LoadingMessageProps) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <p>{message}</p>
    </div>
  );
}

export { LoadingMessage };
