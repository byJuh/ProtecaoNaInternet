// Array para armazenar os listeners de mensagens
const listeners: Array<(data: any) => void> = [];

const ws_url = 'link_do_websocket'; // Substitua pelo URL real do WebSocket

let socket: WebSocket | null = null;
let connectionId: string | null = null;
let connectionResolve: ((id: string) => void) | null = null;
let clientId: string  = 'raspberry_pi_bloqueio_1';

let heartBeatInterval: NodeJS.Timeout | null = null;
let timeout: NodeJS.Timeout | null = null;
let isReconnecting = false;


// Função para conectar ao WebSocket
export const connectWebSocket = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    connectionResolve = resolve;

    // Se já está conectado, retorna o ID
    if (connectionId && socket?.readyState === WebSocket.OPEN) {
      resolve(connectionId);
      return;
    }

    //criando um novo WebSocket
    socket = new WebSocket(ws_url);

    socket.onopen = () => {
        console.log('WebSocket aberto, enviando handshake...');
        if(socket) {
            //iniciando um handshake com o servidor
            socket.send(JSON.stringify({ action: 'sendmessage', data: 'hello' }));
        }
    }

    socket.onclose = () => {
        if (isReconnecting) return;
        isReconnecting = true;

        //reconectar automaticamente
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        connectionId = null;

        stopHeartbeat();

        setTimeout(() => {
            connectWebSocket()
                .then(() => {
                    isReconnecting = false;
                })
                .catch(err => {
                    console.error("Erro ao reconectar WebSocket:", err);
                    isReconnecting = false;
                });
        }, 2000);
    }

    socket.onerror = (err: any) => {
        // Tratar erro de conexão
        connectionId = null;

        stopHeartbeat();
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        socket?.close();
    }

    timeout = setTimeout(() => {
        // Timeout se não receber connection_ack em 30 segundos
        reject(new Error('Timeout waiting for connection_ack'));
    }, 30000);

    socket.onmessage = (event) => {
        // Espera receber uma mensagem do servidor
        const data = JSON.parse(event.data);

        // Se for a mensagem de confirmação de conexão, extrai o connectionId
        if(data.connectionId) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            // Armazena o connectionId
            connectionId = data.connectionId;

            if(socket) startHeartbeat(socket);

            // Resolver a Promise se ambos foram recebido
            if (connectionResolve && connectionId) {
                //garantir que connectionResolve é chamado apenas uma vez
                connectionResolve(connectionId);
                connectionResolve = null;
            }
        }

        // Notifica todos os listeners com a nova mensagem
        listeners.forEach(listener => listener(data));
    };

    return socket;
  });
}

// Função para adicionar um listener de mensagens
export const setMessageListener = (callback: (data: any) => void) => {
    listeners.push(callback);

    return () => {
        // Função para remover o listener
        const index = listeners.indexOf(callback);
        if (index >= 0) {
            listeners.splice(index, 1);
        }
    }

}   

// Retorna o connectionId atual
export const getConnectionId = () => { return connectionId; }   

export const getClienteId = () => { return clientId; }  

// Função para verificar se o WebSocket está conectado
export const isConnected = () => { return connectionId !== null && socket?.readyState === WebSocket.OPEN; }

// Função para esperar por uma resposta com um correlationId específico
export const waitForResponse = (correlationId: string): Promise<any> => {
    
    return new Promise((resolve, reject) => {
        let unsubscribe: (() => void) | null = null;
        
        // Timeout para evitar esperar indefinidamente
        const timer = setTimeout(() => {
            if (unsubscribe) {
                unsubscribe();
            }
            reject(new Error('Timeout waiting for response'));
        }, 15000);

        // Definir unsubscribe primeiro
        unsubscribe = setMessageListener((data) => {

            if (data.correlationId === correlationId) {
                clearTimeout(timer);
                if (unsubscribe) unsubscribe();
                resolve(data);
            }
        });
    });
};

function startHeartbeat(socket: WebSocket) {

    stopHeartbeat(); // Garantir que não há múltiplos heartbeats

    heartBeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'ping'}));
        }
    }, 10000); // Envia a cada 10 segundos
}

function stopHeartbeat() {
    if (heartBeatInterval) {
        clearInterval(heartBeatInterval);
        heartBeatInterval = null;
    }
}


