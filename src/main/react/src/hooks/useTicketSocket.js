import { useState, useEffect } from "react";
import { connectSocket, subscribeTicketStatus } from "../websocket/socket";

export function useTicketSocket(spotId, initialStatus = null) {
  const [ticketStatus, setTicketStatus] = useState(initialStatus);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!spotId) return;
    let unsubscribe = () => {};
    connectSocket(() => {
      setIsConnected(true);
      unsubscribe = subscribeTicketStatus(spotId, (msg) =>
        setTicketStatus(msg),
      );
    });
    return () => unsubscribe();
  }, [spotId]);

  return { ticketStatus, isConnected };
}
