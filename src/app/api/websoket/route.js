import { WebSocketServer } from 'ws';

let wss;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (!wss) {
    wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (socket) => {
      console.log('WebSocket 연결 성공');
      socket.on('message', (message) => {
        console.log('수신 메시지:', message);
        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(message);
          }
        });
      });
    });
  }

  res.socket.server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (client) => {
      wss.emit('connection', client, req);
    });
  });

  res.end();
}
