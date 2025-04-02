//currently the page for posting the video
import LinkOutPutBox from "../../components/LinkOutPutBox";
import "./Account.css";
import { useContext } from "react";
import context from "../../contexts/auth/context";

export default function Account() {
  const { user } = useContext(context);

  if (!user) {
    window.location = "/login";
  }

  return (
    <div className="account">
      <LinkOutPutBox />
    </div>
  );
}
