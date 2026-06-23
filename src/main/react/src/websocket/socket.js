import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connectSocket = (onConnect) => {
  if (stompClient?.active) return stompClient;
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8111/ws"),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("[WS] STOMP connected");
      onConnect?.(stompClient);
    },
    onStompError: (frame) => console.error("[WS] STOMP error", frame),
  });
  stompClient.activate();
  return stompClient;
};

export const subscribeTicketStatus = (spotId, callback) => {
  if (!stompClient?.active) return () => {};
  const sub = stompClient.subscribe(`/topic/tickets/${spotId}`, (msg) => {
    try {
      callback(JSON.parse(msg.body));
    } catch (e) {
      console.error(e);
    }
  });
  return () => sub.unsubscribe();
};

export const disconnectSocket = () => {
  stompClient?.deactivate();
  stompClient = null;
};
