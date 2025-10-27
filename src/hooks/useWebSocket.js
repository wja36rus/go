// src/hooks/useWebSocket.js
import { useState, useEffect, useRef, useCallback } from "react";
import { useAppStore } from "../store/appStore";

export const useWebSocket = (url) => {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [clientId, setClientId] = useState(null);
  const reconnectCountRef = useRef(0);
  const isConnectingRef = useRef(false);
  const addUser = useAppStore.use.addUser();
  const setStoneByUser = useAppStore.use.setStoneByUser();
  const [gameData, setGameData] = useState();

  useEffect(() => {
    const user = gameData?.user;
    const move = gameData?.move;

    if (user) {
      addUser(user);
    }

    if (move) {
      setStoneByUser(move);
    }
  }, [gameData]);

  const connect = useCallback(() => {
    if (
      isConnectingRef.current ||
      wsRef.current?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    isConnectingRef.current = true;
    console.log("🔄 Connecting to WebSocket...");

    try {
      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log("✅ Connected to Go server");
        setIsConnected(true);
        isConnectingRef.current = false;
        reconnectCountRef.current = 0;
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 Received:", data);

          switch (data.type) {
            case "CONNECTED":
              setClientId(data.clientId);
              break;

            case "CREATE_USER":
              setGameData({ user: { id: data.data.id, name: data.data.name } });
              break;

            case "MOVE":
              setGameData({
                move: { cellId: data.data.cellId, uuid: data.data.uuid },
              });
              break;

            case "PONG":
              break;

            default:
              console.log("❓ Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("❌ Error parsing message:", error);
        }
      };

      socket.onclose = (event) => {
        console.log("🔌 Disconnected from server:", event.code, event.reason);
        setIsConnected(false);
        isConnectingRef.current = false;

        // Автопереподключение с экспоненциальной задержкой
        if (reconnectCountRef.current < 5) {
          const delay = Math.min(
            1000 * Math.pow(2, reconnectCountRef.current),
            30000
          );
          reconnectCountRef.current++;
          console.log(
            `🔄 Reconnecting in ${delay}ms... (attempt ${reconnectCountRef.current})`
          );

          setTimeout(() => {
            connect();
          }, delay);
        }
      };

      socket.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        isConnectingRef.current = false;
      };

      wsRef.current = socket;
    } catch (error) {
      console.error("❌ Failed to create WebSocket:", error);
      isConnectingRef.current = false;
    }
  }, [url]);

  // Один раз подключаемся при монтировании
  useEffect(() => {
    connect();

    return () => {
      console.log("🧹 Cleaning up WebSocket...");
      isConnectingRef.current = false;
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
        wsRef.current = null;
      }
    };
  }, [connect]);

  const sendMove = useCallback((move) => {
    wsRef.current.send(
      JSON.stringify({
        type: "MOVE",
        move: move,
      })
    );
  }, []);

  const createUser = useCallback((user) => {
    wsRef.current.send(
      JSON.stringify({
        type: "CREATE_USER",
        user: user,
      })
    );
  }, []);

  const ping = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "PING" }));
    }
  }, []);

  const reconnect = useCallback(() => {
    reconnectCountRef.current = 0;
    if (wsRef.current) {
      wsRef.current.close();
    }
    connect();
  }, [connect]);

  return {
    isConnected,
    clientId,
    sendMove,
    createUser,
    ping,
    reconnect,
  };
};
