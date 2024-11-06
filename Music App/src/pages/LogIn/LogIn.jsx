//page for loging in or registering
import "./LogIn.css";
import SignInBox from "../../components/SignInBox";

export default function LogIn() {
  return (
    <div className="logIn container-xl">
      <div className="row">
        <section className="bannersection col-md-6"></section>
        <section className="signinsection col-md-6">
          <SignInBox />
        </section>
      </div>
    </div>
  );
}
