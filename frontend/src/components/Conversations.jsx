import "./Conversations.css";
//shows the list of people the user is having conversations with

export default function Conversations() {
  return (
    <div className="conversations">
      <div className="eachConvo">
        <img
          className="eachConvoImg"
          src="https://thedecisionlab.com/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fthedecisionlab%2Fcc70a04a-f6a5-40fd-9799-4a61b89e51bc_barack-obama.png%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C0%2C400%2C400%26w%3D400%26h%3D400&w=3840&q=75"
        />
        <div className="eachConvoInfo">
          <p>Chat Username</p>
          <p>2 hours ago</p>
        </div>
      </div>
    </div>
  );
}
