import { WebSocketServer } from "ws";

const PORT = 8081;
const wss = new WebSocketServer({ port: PORT });

// Храним подключенных клиентов
const clients = new Map();

console.log(`✅ Go WebSocket server running on ws://localhost:${PORT}`);

wss.on("connection", (ws) => {
  const clientId = generateId();
  clients.set(clientId, ws);

  console.log(`🔗 Client connected: ${clientId}`);

  // Отправляем клиенту его ID
  send(ws, {
    type: "CONNECTED",
    clientId: clientId,
  });

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      handleMessage(clientId, message);
    } catch (error) {
      console.error("❌ Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    console.log(`🔌 Client disconnected: ${clientId}`);
    clients.delete(clientId);
  });

  ws.on("error", (error) => {
    console.error(`❌ WebSocket error for ${clientId}:`, error);
  });
});

function handleMessage(clientId, message) {
  const { type, move, user } = message;

  console.log("### ~ handleMessage ~ message:", message);

  switch (type) {
    case "MOVE":
      handleMove(clientId, move);
      break;

    case "CREATE_USER":
      handleCreateUser(clientId, user);
      break;

    case "PING":
      // Просто отвечаем на пинг
      const client = clients.get(clientId);
      if (client) {
        send(client, { type: "PONG" });
      }
      break;

    default:
      console.log(`❓ Unknown message type: ${type}`);
  }
}

function handleCreateUser(clientId, user) {
  const { id, gameId, name } = user;

  // Просто ретранслируем ход всем подключенным клиентам
  // Фронт сам будет обрабатывать логику игры

  broadcast({
    type: "CREATE_USER",
    data: {
      clientId: clientId,
      id: id,
      name: name,
      gameId: gameId,
      timestamp: Date.now(),
    },
  });

  console.log(`🎯 UserCreate by ${clientId}: (${id}, ${name})`);
}

function handleMove(clientId, move) {
  const { cellId, gameId, uuid = "default" } = move;

  // Просто ретранслируем ход всем подключенным клиентам
  // Фронт сам будет обрабатывать логику игры

  broadcast({
    type: "MOVE",
    data: {
      clientId: clientId,
      cellId: cellId,
      uuid: uuid,
      gameId: gameId,
      timestamp: Date.now(),
    },
  });

  console.log(`🎯 Move by ${clientId}: (${cellId}, ${uuid})`);
}

// Вспомогательные функции
function broadcast(message) {
  const data = JSON.stringify(message);

  clients.forEach((client, clientId) => {
    if (client.readyState === 1) {
      // OPEN
      client.send(data);
    }
  });
}

function send(ws, message) {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify(message));
  }
}

function generateId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Обработка graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");
  wss.close();
  process.exit(0);
});
