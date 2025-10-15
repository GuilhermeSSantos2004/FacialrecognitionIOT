let socket: WebSocket | null = null;

//Future implementation

export function initSocket(url: string) {
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("🔌 Conectado ao WebSocket");
  };

  socket.onmessage = (event) => {
    console.log("📨 Mensagem recebida:", event.data);
  };

  socket.onclose = () => {
    console.log("❌ Conexão fechada");
  };

  socket.onerror = (error) => {
    console.log("⚠️ Erro no WebSocket:", error);
  };

  return socket;
}

export function sendMessage(message: any) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

export function closeSocket() {
  if (socket) {
    socket.close();
  }
}