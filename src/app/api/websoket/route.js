import { Server } from 'ws';

let wss;

export const config = {
  api: {
    bodyParser: false, // WebSocket은 body를 처리하지 않음
  },
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).end(); // Allow only GET requests
    return;
  }

  if (!wss) {
    // WebSocket 서버 초기화
    wss = new Server({ noServer: true });

    wss.on('connection', (socket) => {
      console.log('WebSocket 연결');

      socket.on('message', (message) => {
        console.log('수신 메시지:', message);

        // 연결된 모든 클라이언트에게 메시지 브로드캐스트
        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(message);
          }
        });
      });

      socket.on('close', () => {
        console.log('WebSocket 연결 종료');
      });
    });
  }

  if (res.socket.server.wss) {
    console.log('WebSocket 서버가 이미 실행 중입니다.');
  } else {
    console.log('WebSocket 서버를 초기화합니다.');
    res.socket.server.on('upgrade', (req, socket, head) => {
      wss.handleUpgrade(req, socket, head, (client) => {
        wss.emit('connection', client, req);
      });
    });
    res.socket.server.wss = wss;
  }

  res.end();
}
