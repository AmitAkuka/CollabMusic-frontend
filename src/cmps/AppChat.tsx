import { chatService } from "@/services/chat.service";
import { socketService } from "@/services/socket.service";
import { ChatMessage, User } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppChatMessage } from "./AppChatMessage";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import WifiTetheringIcon from "@mui/icons-material/WifiTethering";
import { ROOM_ID } from "@/constants";

type Props = {
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loggedUser: User | null;
};
export const AppChat = ({ loggedUser, isChatOpen, setIsChatOpen }: Props) => {
  const [connectedAmount, setConnectedAmount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isEmojiDisplayed, setIsEmojiDisplayed] = useState(false);
  const [chatTxt, setChatTxt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socketService.on("chatUpdate", (data: string) => {
      setChatMessages((prevState) => [...prevState, JSON.parse(data)]);
    });
    socketService.on("chatConnectedUpdate", (data: number) => {
      setConnectedAmount(data);
    });
    socketService.emit("getInitialConnectedAmount", ROOM_ID);

    return () => {
      socketService.off("chatUpdate");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      block: "end",
    });
  }, [chatMessages]);

  const onEnterPress = (ev: React.KeyboardEvent<HTMLFormElement>) => {
    if (loggedUser && ev.keyCode == 13 && ev.shiftKey == false) {
      ev.preventDefault();
      const textareaElement = ev.target as HTMLFormElement;
      const msg = textareaElement.value;
      if (!msg.length) return;
      const chatId = "1000";
      chatService.sendMessage(msg, chatId);
      setChatTxt("");
    }
  };

  const onEmojiClick = useCallback(
    (emoji: string) => {
      setChatTxt((prevState) => prevState + emoji);
    },
    [chatTxt]
  );

  const getNormalizedTime = (timestamp: number) => {
    const time = new Date(timestamp);
    return (
      ("0" + time.getHours()).slice(-2) +
      ":" +
      ("0" + time.getMinutes()).slice(-2) +
      ":" +
      ("0" + time.getSeconds()).slice(-2)
    );
  };

  return (
    <section
      className={`app-chat-main-container ${isChatOpen ? "open" : "closed"}`}
    >
      <header className="chat-header">
        <button onClick={() => setIsChatOpen((prevState) => !prevState)}>
          <KeyboardTabIcon />
        </button>
        <div className="chat-info-container">
          <WifiTetheringIcon />
          <p>Live Chat ({connectedAmount})</p>
        </div>
      </header>
      {isEmojiDisplayed && (
        <EmojiPicker
          emojiStyle={EmojiStyle.NATIVE}
          autoFocusSearch={false}
          skinTonesDisabled={true}
          onEmojiClick={({ emoji }) => onEmojiClick(emoji)}
        />
      )}
      <div className="chat-messages-container">
        {!!chatMessages.length &&
          chatMessages.map((chatMsg, idx) => (
            <AppChatMessage
              key={idx + 91475}
              chatMsg={chatMsg}
              getNormalizedTime={getNormalizedTime}
            />
          ))}
        <div className="end-msg" ref={messagesEndRef}></div>
      </div>
      <form className="chat-input-container" onKeyDown={onEnterPress}>
        <textarea
          value={chatTxt}
          onChange={({ target }) => setChatTxt(target.value)}
          onFocus={() => setIsEmojiDisplayed(false)}
          maxLength={50}
          placeholder="Say something..."
        ></textarea>
        <EmojiEmotionsIcon
          onClick={() => setIsEmojiDisplayed((prevState) => !prevState)}
        />
      </form>
      <footer className="chat-footer-container">Made by Amit Akuka</footer>
    </section>
  );
};
