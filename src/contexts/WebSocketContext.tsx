import { Client } from "@stomp/stompjs";
import { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";

const WebSocketContext = createContext<Client | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);

  const api = import.meta.env.VITE_API_URL ?? "";

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(api + "/ws"),
    });

    client.onConnect = () => {
      setClient(client);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);
  return (
    <WebSocketContext.Provider value={client}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
