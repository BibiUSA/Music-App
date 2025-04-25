import { environment } from "../environment";

export default function Conversation(prop) {
  environment.development && console.log(prop.message);
  return (
    <div className="conversation">
      <h4>{prop.message.sender}</h4>
      <p>{prop.message.message}</p>
    </div>
  );
}
