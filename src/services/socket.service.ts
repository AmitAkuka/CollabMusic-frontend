import io, { Socket } from "socket.io-client";

const baseUrl = process.env.NODE_ENV === "production" ? "" : "//localhost:3030";

export const socketService = createSocketService();

// socketService.setup()

function createSocketService() {
  var socket: Socket | null = null;
  const socketService = {
    setup() {
      socket = io(baseUrl);
    },
    on(eventName: string, cb: (...args: any[]) => void) {
      socket && socket.on(eventName, cb);
    },
    off(eventName: string, cb = null) {
      if (!socket) return;
      if (!cb) socket.removeAllListeners(eventName);
      else socket.off(eventName, cb);
    },
    emit(eventName: string, data: string) {
      socket && socket.emit(eventName, data);
    },
    terminate() {
      socket = null;
    },
    join(eventName: string, joinEvent: string) {
      socket && socket.emit(eventName, joinEvent);
    },
    disconnect() {
      socket && socket.disconnect();
    },
  };
  return socketService;
}
