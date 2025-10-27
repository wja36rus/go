import { WebSocketServer } from "ws";

const initialData = {
  user: [],
  start: "black",
  clear: false,
  point: [
    {
      id: 1,
      user: "",
    },
    {
      id: 2,
      user: "",
    },
    {
      id: 3,
      user: "",
    },
    {
      id: 4,
      user: "",
    },
    {
      id: 5,
      user: "",
    },
    {
      id: 6,
      user: "",
    },
    {
      id: 7,
      user: "",
    },
    {
      id: 8,
      user: "",
    },
    {
      id: 9,
      user: "",
    },
    {
      id: 10,
      user: "",
    },
    {
      id: 11,
      user: "",
    },
    {
      id: 12,
      user: "",
    },
    {
      id: 13,
      user: "",
    },
    {
      id: 14,
      user: "",
    },
    {
      id: 15,
      user: "",
    },
    {
      id: 16,
      user: "",
    },
    {
      id: 17,
      user: "",
    },
    {
      id: 18,
      user: "",
    },
    {
      id: 19,
      user: "",
    },
    {
      id: 20,
      user: "",
    },
    {
      id: 21,
      user: "",
    },
    {
      id: 22,
      user: "",
    },
    {
      id: 23,
      user: "",
    },
    {
      id: 24,
      user: "",
    },
    {
      id: 25,
      user: "",
    },
    {
      id: 26,
      user: "",
    },
    {
      id: 27,
      user: "",
    },
    {
      id: 28,
      user: "",
    },
    {
      id: 29,
      user: "",
    },
    {
      id: 30,
      user: "",
    },
    {
      id: 31,
      user: "",
    },
    {
      id: 32,
      user: "",
    },
    {
      id: 33,
      user: "",
    },
    {
      id: 34,
      user: "",
    },
    {
      id: 35,
      user: "",
    },
    {
      id: 36,
      user: "",
    },
    {
      id: 37,
      user: "",
    },
    {
      id: 38,
      user: "",
    },
    {
      id: 39,
      user: "",
    },
    {
      id: 40,
      user: "",
    },
    {
      id: 41,
      user: "",
    },
    {
      id: 42,
      user: "",
    },
    {
      id: 43,
      user: "",
    },
    {
      id: 44,
      user: "",
    },
    {
      id: 45,
      user: "",
    },
    {
      id: 46,
      user: "",
    },
    {
      id: 47,
      user: "",
    },
    {
      id: 48,
      user: "",
    },
    {
      id: 49,
      user: "",
    },
    {
      id: 50,
      user: "",
    },
    {
      id: 51,
      user: "",
    },
    {
      id: 52,
      user: "",
    },
    {
      id: 53,
      user: "",
    },
    {
      id: 54,
      user: "",
    },
    {
      id: 55,
      user: "",
    },
    {
      id: 56,
      user: "",
    },
    {
      id: 57,
      user: "",
    },
    {
      id: 58,
      user: "",
    },
    {
      id: 59,
      user: "",
    },
    {
      id: 60,
      user: "",
    },
    {
      id: 61,
      user: "",
    },
    {
      id: 62,
      user: "",
    },
    {
      id: 63,
      user: "",
    },
    {
      id: 64,
      user: "",
    },
    {
      id: 65,
      user: "",
    },
    {
      id: 66,
      user: "",
    },
    {
      id: 67,
      user: "",
    },
    {
      id: 68,
      user: "",
    },
    {
      id: 69,
      user: "",
    },
    {
      id: 70,
      user: "",
    },
    {
      id: 71,
      user: "",
    },
    {
      id: 72,
      user: "",
    },
    {
      id: 73,
      user: "",
    },
    {
      id: 74,
      user: "",
    },
    {
      id: 75,
      user: "",
    },
    {
      id: 76,
      user: "",
    },
    {
      id: 77,
      user: "",
    },
    {
      id: 78,
      user: "",
    },
    {
      id: 79,
      user: "",
    },
    {
      id: 80,
      user: "",
    },
    {
      id: 81,
      user: "",
    },
  ],
};
class WebSocketGameServer {
  constructor(port = 8081) {
    this.port = port;
    this.wss = new WebSocketServer({ port });
    this.clients = new Map();
    this.gameData = initialData;
    this.setupEventHandlers();
    this.setupProcessHandlers();

    console.log(
      `✅ Go WebSocket server running on ws://localhost:${this.port}`
    );
  }

  setupEventHandlers() {
    this.wss.on("connection", (ws) => this.handleConnection(ws));
    this.wss.on("error", (error) => this.handleServerError(error));
  }

  setupProcessHandlers() {
    process.on("SIGINT", () => this.gracefulShutdown());
    process.on("SIGTERM", () => this.gracefulShutdown());
  }

  handleConnection(ws) {
    const clientId = this.generateId();
    this.clients.set(clientId, ws);

    console.log(`🔗 Client connected: ${clientId}`);
    this.sendToClient(ws, { type: "CONNECTED", data: this.gameData });

    ws.on("message", (data) => this.handleMessage(clientId, data));
    ws.on("close", () => this.handleDisconnection(clientId));
    ws.on("error", (error) => this.handleClientError(clientId, error));
  }

  handleMessage(clientId, data) {
    try {
      const message = this.parseMessage(data);
      this.routeMessage(clientId, message);
    } catch (error) {
      console.error(`❌ Error handling message from ${clientId}:`, error);
      this.sendError(clientId, "Invalid message format");
    }
  }

  parseMessage(data) {
    if (typeof data !== "string") {
      data = data.toString();
    }
    return JSON.parse(data);
  }

  routeMessage(clientId, message) {
    const { type, move, user, clear } = message;

    console.log(`📨 Received message from ${clientId}:`, message);

    const messageHandlers = {
      MOVE: () => this.handleMove(clientId, move),
      CLEAR: () => this.handleClear(clientId, move),
      SET_CLEAR: () => this.handleSetClear(clear),
      CREATE_USER: () => this.handleCreateUser(clientId, user),
      RELOAD: () => this.handleReload(),
      EXIT_GAME: () => this.handleExit(),
      PING: () => this.handlePing(clientId),
    };

    const handler = messageHandlers[type];
    if (handler) {
      handler();
    } else {
      console.warn(`❓ Unknown message type from ${clientId}: ${type}`);
      this.sendError(clientId, `Unknown message type: ${type}`);
    }
  }

  handleExit() {
    this.gameData.user = [];
    this.gameData.start = "black";
    this.gameData.clear = false;
    this.gameData.point.forEach((element) => {
      element.user = "";
      element.last = "";
    });

    const reloadData = {
      type: "EXIT_GAME",
      data: this.gameData,
    };

    this.broadcast(reloadData);
    console.log(`🎯 Exit success`);
  }

  handleReload() {
    this.gameData.user.forEach((element) => {
      element.eats = [];
    });
    this.gameData.start = "black";
    this.gameData.clear = false;
    this.gameData.point.forEach((element) => {
      element.user = "";
      element.last = "";
    });

    const reloadData = {
      type: "RELOAD",
      data: this.gameData,
    };

    this.broadcast(reloadData);
    console.log(`🎯 Reload success`);
  }

  handleCreateUser(clientId, user) {
    if (!user || !user.id || !user.name || !user.gameId) {
      console.warn(`⚠️ Invalid CREATE_USER data from ${clientId}`);
      this.sendError(clientId, "Invalid user data");
      return;
    }
    if (this.gameData.user.length > 1) {
      return;
    } else {
      if (this.gameData.user.length === 0) {
        this.gameData.user.push({
          id: user.id,
          name: user.name,
          color: "black",
          eats: [],
        });
      } else {
        this.gameData.user.push({
          id: user.id,
          name: user.name,
          color: "white",
          eats: [],
        });
      }
    }

    const createUserData = {
      type: "CREATE_USER",
      data: this.gameData,
    };

    this.broadcast(createUserData);
    console.log(`🎯 User created by ${clientId}: ${user.name} (${user.id})`);
  }

  handleSetClear(clear) {
    console.log("### ~ WebSocketGameServer ~ handleSetClear ~ clear:", clear);

    this.gameData.clear = clear.clear;
    this.gameData.clearUser = clear.uuid;

    const createUserData = {
      type: "SET_CLEAR",
      data: this.gameData,
    };

    this.broadcast(createUserData);
    console.log(`🎯 Clear by ${clear.clear}`);
  }

  handleClear(clientId, move) {
    if (!move || move.cellId === undefined || !move.gameId) {
      console.warn(`⚠️ Invalid MOVE data from ${clientId}`);
      this.sendError(clientId, "Invalid move data");
      return;
    }

    const cell = this.gameData.point.find((item) => item.id == move.cellId);

    cell.user = "";
    cell.last = "";

    this.gameData.user
      .find((item) => item.id == move.uuid)
      .eats.push(move.cellId);

    const moveDataUser = {
      type: "CLEAR",
      data: this.gameData,
    };

    this.broadcast(moveDataUser);
    console.log(
      `🎯 Move by ${clientId}: cell ${move.cellId}, game ${move.gameId}`
    );
  }

  handleMove(clientId, move) {
    if (!move || move.cellId === undefined || !move.gameId) {
      console.warn(`⚠️ Invalid MOVE data from ${clientId}`);
      this.sendError(clientId, "Invalid move data");
      return;
    }

    const cell = this.gameData.point.find((item) => item.id == move.cellId);

    if (cell.user !== "") {
      cell.user = "";
    } else {
      cell.user = move.uuid;
      this.gameData.point.forEach((element) => {
        element.last = "";
      });
      cell.last = true;

      if (this.gameData.start === "black") {
        this.gameData.start = "white";
      } else {
        this.gameData.start = "black";
      }
    }

    const moveDataUser = {
      type: "MOVE",
      data: this.gameData,
    };

    this.broadcast(moveDataUser);
    console.log(
      `🎯 Move by ${clientId}: cell ${move.cellId}, game ${move.gameId}`
    );
  }

  handlePing(clientId) {
    const client = this.clients.get(clientId);
    if (client) {
      this.sendToClient(client, { type: "PONG" });
    }
  }

  handleDisconnection(clientId) {
    console.log(`🔌 Client disconnected: ${clientId}`);
    this.clients.delete(clientId);

    // Уведомляем других клиентов о отключении
    this.broadcast({
      type: "USER_DISCONNECTED",
      data: { clientId, timestamp: Date.now() },
    });
  }

  handleClientError(clientId, error) {
    console.error(`❌ WebSocket error for ${clientId}:`, error);
  }

  handleServerError(error) {
    console.error("❌ WebSocket server error:", error);
  }

  // Utility methods
  broadcast(message) {
    const data = JSON.stringify(message);
    let sentCount = 0;

    this.clients.forEach((client, clientId) => {
      if (this.isConnectionOpen(client)) {
        try {
          client.send(data);
          sentCount++;
        } catch (error) {
          console.error(`❌ Failed to send message to ${clientId}:`, error);
        }
      }
    });

    console.log(`📤 Broadcasted ${message.type} to ${sentCount} clients`);
  }

  sendToClient(ws, message) {
    if (this.isConnectionOpen(ws)) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error("❌ Failed to send message to client:", error);
      }
    }
  }

  sendError(clientId, errorMessage) {
    const client = this.clients.get(clientId);
    if (client) {
      this.sendToClient(client, {
        type: "ERROR",
        error: errorMessage,
        timestamp: Date.now(),
      });
    }
  }

  isConnectionOpen(ws) {
    return ws.readyState === 1; // OPEN
  }

  generateId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  getClientCount() {
    return this.clients.size;
  }

  gracefulShutdown() {
    console.log("\n🛑 Shutting down server...");

    // Уведомляем клиентов о закрытии сервера
    this.broadcast({
      type: "SERVER_SHUTDOWN",
      data: { message: "Server is shutting down", timestamp: Date.now() },
    });

    // Закрываем все соединения
    this.clients.forEach((client) => {
      if (this.isConnectionOpen(client)) {
        client.close();
      }
    });

    this.wss.close(() => {
      console.log("✅ Server shut down gracefully");
      process.exit(0);
    });

    // Форсированное завершение через 5 секунд
    setTimeout(() => {
      console.log("⚠️ Forcing server shutdown");
      process.exit(1);
    }, 5000);
  }
}

// Создание и запуск сервера
new WebSocketGameServer(8081);

// Экспорт для тестирования
export default WebSocketGameServer;
