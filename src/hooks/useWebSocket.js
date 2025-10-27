// src/hooks/useWebSocket.js
import { useState, useEffect, useRef, useCallback } from "react";
import { useAppStore } from "../store/appStore";

export const useWebSocket = (url) => {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectCountRef = useRef(0);
  const isConnectingRef = useRef(false);
  const setData = useAppStore.use.setData();
  const [gameData, setGameData] = useState();

  useEffect(() => {
    setData(gameData);
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
              setGameData(data.data);
              break;

            case "RELOAD":
              setGameData(data.data);
              break;

            case "CREATE_USER":
              setGameData(data.data);
              break;

            case "CLEAR":
              setGameData(data.data);
              break;

            case "MOVE":
              setGameData(data.data);
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

  const sendClear = useCallback((move) => {
    wsRef.current.send(
      JSON.stringify({
        type: "CLEAR",
        move: move,
      })
    );
  }, []);

  const sendMove = useCallback((move) => {
    wsRef.current.send(
      JSON.stringify({
        type: "MOVE",
        move: move,
      })
    );
  }, []);

  const sendReload = useCallback(() => {
    wsRef.current.send(
      JSON.stringify({
        type: "RELOAD",
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
    sendMove,
    sendReload,
    sendClear,
    createUser,
    ping,
    reconnect,
  };
};
