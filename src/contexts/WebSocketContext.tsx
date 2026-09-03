import { Client } from "@stomp/stompjs"
import { createContext, useContext, useEffect, useState } from "react"
import SockJS from 'sockjs-client';

const WebSocketContext = createContext<Client | null>(null)

function WebSocketProvider({ children }: {children: React.ReactNode}) {
    const [client, setClient] = useState<Client | null>(null)

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        })

        client.onConnect = () => {
            setClient(client)
        }

        client.activate()

        return () => {
            client.deactivate()
        }
        
    }, [])
  return (
    <WebSocketContext.Provider value={client}>
        {children}
    </WebSocketContext.Provider>
  )
}


export function useWebSocket() {
    return useContext(WebSocketContext)
}
