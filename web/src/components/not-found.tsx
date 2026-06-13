import { Link } from "react-router";

function NotFound() {
  return (
    <div>
      <div>404 - Not Found</div>
      <Link to={"/"}>
        <button>Go Back Home</button>
      </Link>
    </div>
  );
}

export default NotFound;
