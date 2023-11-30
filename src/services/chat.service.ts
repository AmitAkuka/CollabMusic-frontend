import { socketService } from "./socket.service";

export const chatService = {
  sendMessage,
};

function sendMessage(message: string, chatId: string) {
  socketService.emit(
    "chatMessage",
    JSON.stringify({
      chatId,
      message,
      timestamp: Date.now(),
    })
  );
}
