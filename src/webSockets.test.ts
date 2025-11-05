import { Server } from 'mock-socket';
import { connectWebSocket, setMessageListener, waitForResponse, getConnectionId } from './webSockets';

const WS_URL = 'wss://379yahvbg7.execute-api.us-east-2.amazonaws.com/getResponse/';

describe('WebSocket', () => {
    let mockServer: Server;
    let secondServer: Server;

    beforeEach(() => {
    mockServer = new Server(WS_URL);

    mockServer.on('connection', socket => {
      // Simular handshake retornando connectionId
      socket.on('message', (msg: any) => {
        const data = JSON.parse(msg);
        if (data.action === 'sendmessage') {
          socket.send(JSON.stringify({ connectionId: 'teste123' }));
        } else if (data.type === 'ping') {
          socket.send(JSON.stringify({ type: 'pong' }));
        }
      });
    });

    afterEach(() => {
        mockServer.stop();
    });

    test('Conectando', async() => {
        const conectionId = await connectWebSocket();
        expect(conectionId).toBe('teste123');
        expect(getConnectionId()).toBe('teste123');
    });



  });
})