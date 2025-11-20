global.WebSocket = require("ws");

import {
  connectWebSocket,
  isConnected,
} from "./webSockets";

jest.setTimeout(10000);

afterAll(() => {
  if ((global as any).socket && (global as any).socket.close) {
    console.log("🔌 Fechando WebSocket...");
    (global as any).socket.close();
  }
});

describe("WebSocket AWS – Teste real", () => {
  test("Conecta ao WebSocket e recebe connectionId", async () => {
    const id = await connectWebSocket();

    expect(id).toBeDefined();
    expect(typeof id).toBe("string");
    expect(isConnected()).toBe(true);

    console.log("ConnectionId recebido:", id);
  });
});
