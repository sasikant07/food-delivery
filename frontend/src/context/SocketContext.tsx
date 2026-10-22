import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {io, Socket} from "socket.io-client";
import { useAppData } from "./AppContext";
import { realtimeService } from "../main";

interface SocketContextType {
    socket: Socket | null,

}

const SocketContext = createContext<SocketContextType>({socket: null});

export const SocketProvider = ({children}: {children: ReactNode}) => {
    const {isAuth} = useAppData();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if(!isAuth) {
            setSocket(null);
            return;
        }

        const client = io(realtimeService, {
            auth: {
                token: localStorage.getItem("token"),
            },
            transports: ["websocket"],
        });
        setSocket(client);

        client.on("connect", () => {
            console.log("Socket connected!", client.id);
        })

        client.on("disconnect", () => {
            console.log("Socket disconnected!");
        })

        client.on("connect_error", (err) => {
            console.log("Socket Error: ", err.message);
        })

        return () => {
            client.disconnect();
            setSocket((current) => current === client ? null : current);
        }
    }, [isAuth]);

    return <SocketContext.Provider value={{socket}}>
        {children}
    </SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext);