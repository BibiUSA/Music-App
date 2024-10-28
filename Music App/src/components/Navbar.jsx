import { IconHome, IconMessages, IconUserCircle } from "@tabler/icons-react";
import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar">
      <Link to="/">
        <div className="icons">
          <IconHome stroke={2} />
        </div>
      </Link>
      <div className="icons">
        <IconMessages stroke={2} />
      </div>
      <Link to="/account">
        <div className="icons">
          <IconUserCircle stroke={2} />
        </div>
      </Link>
    </div>
  );
}
