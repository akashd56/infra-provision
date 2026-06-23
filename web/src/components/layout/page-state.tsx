import { Navbar } from "./navbar";
import { LoadingMessage } from "../messages/loading-message";
import { ErrorMessage } from "../messages/error-message";

type PageStateProps = {
  loading?: boolean;
  error?: string | null;
  loadingMessage: string;
};

function PageState({ loading, error, loadingMessage }: PageStateProps) {
  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingMessage message={loadingMessage} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <ErrorMessage message={error} />
      </>
    );
  }

  return null;
}

export { PageState };
