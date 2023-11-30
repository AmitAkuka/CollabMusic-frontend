import { ChatMessage } from "@/types";

type Props = {
  chatMsg: ChatMessage;
  getNormalizedTime: (timestamp: number) => string;
};
export const AppChatMessage = ({ chatMsg, getNormalizedTime }: Props) => {
  const { sender, message, timestamp, color, eventType } = chatMsg;
  const normalizedTime = getNormalizedTime(timestamp);

  return eventType ? (
    <div className="main-message-container">
      <p>
        {sender.username} {eventType} the chat room!
      </p>
    </div>
  ) : (
    <div className="main-message-container">
      <div className="message-container">
        <p className="sender-name" style={{ color }}>
          {sender.username}
        </p>
        <p>{message}</p>
      </div>
      <p>{normalizedTime}</p>
    </div>
  );
};
