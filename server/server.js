import { WebSocketServer } from "ws";

class WebSocketGameServer {
  constructor(port = 8081) {
    this.port = port;
    this.wss = new WebSocketServer({ port });
    this.clients = new Map();

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
    this.sendToClient(ws, { type: "CONNECTED", clientId });

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
    const { type, move, user } = message;

    console.log(`📨 Received message from ${clientId}:`, message);

    const messageHandlers = {
      MOVE: () => this.handleMove(clientId, move),
      CREATE_USER: () => this.handleCreateUser(clientId, user),
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

  handleCreateUser(clientId, user) {
    if (!user || !user.id || !user.name || !user.gameId) {
      console.warn(`⚠️ Invalid CREATE_USER data from ${clientId}`);
      this.sendError(clientId, "Invalid user data");
      return;
    }

    const userData = {
      type: "CREATE_USER",
      data: {
        clientId,
        id: user.id,
        name: user.name,
        gameId: user.gameId,
        timestamp: Date.now(),
      },
    };

    this.broadcast(userData);
    console.log(`🎯 User created by ${clientId}: ${user.name} (${user.id})`);
  }

  handleMove(clientId, move) {
    if (!move || move.cellId === undefined || !move.gameId) {
      console.warn(`⚠️ Invalid MOVE data from ${clientId}`);
      this.sendError(clientId, "Invalid move data");
      return;
    }

    const moveData = {
      type: "MOVE",
      data: {
        clientId,
        cellId: move.cellId,
        uuid: move.uuid || "default",
        gameId: move.gameId,
        timestamp: Date.now(),
      },
    };

    this.broadcast(moveData);
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
