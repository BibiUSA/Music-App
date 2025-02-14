//page for loging in or registering
import "./LogIn.css";
import SignInBox from "../../components/SignInBox";

export default function LogIn() {
  return (
    <div className="logIn container-xl">
      <div className="row">
        <section className="bannersection col-md-6">
          <img
            src="https://thumbs.dreamstime.com/b/music-together-sharing-music-music-brains-music-lover-51701642.jpg"
            className="login_pic"
          />
        </section>
        <section className="signinsection col-md-6">
          <SignInBox />
        </section>
      </div>
    </div>
  );
}
