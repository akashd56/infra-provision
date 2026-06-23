import { Link } from "react-router";

function Navbar() {
  return (
    <nav className="border-b mb-6">
      <div className="max-w-4xl mx-auto p-4 flex gap-6">
        <Link className="font-semibold" to="/">
          Infra Provision
        </Link>

        <Link className="text-blue-600" to="/resources">
          Resources
        </Link>

        <Link className="text-blue-600" to="/jobs">
          Jobs
        </Link>

        <Link className="text-blue-600" to="/health">
          Health
        </Link>
      </div>
    </nav>
  );
}

export { Navbar };
