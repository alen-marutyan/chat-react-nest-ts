import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private onlineUsers: Map<string, { roomName: string, user: { username: string, image: string, id: string } }> = new Map();
  private historyMessages: Map<string, object[]> = new Map();

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.onlineUsers.delete(client.id);
    this.server.to('roomName').emit('leftRoom',  { roomName: 'roomName', onlineUsers: Array.from(this.onlineUsers.values()) })
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, { roomName, user }: { roomName: string, user: { id: string, username: string, image: string } }) {
    try {
      client.join(roomName);

      const userId = client.id;
      if (!this.onlineUsers.has(userId)) {
        this.onlineUsers.set(userId, { roomName, user });
      }

      if(!this.historyMessages.has(roomName)) {
        this.historyMessages.set(roomName, []);
      }

      const messages = this.historyMessages.get(roomName);

      this.server.to(roomName).emit('joinedRoom', { userId, roomName, onlineUsers: Array.from(this.onlineUsers.values()), messages: messages || [] });
    } catch (error) {
      console.error('Error joining room:', error.message);
    }
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: Socket, { room, message }: { room: string; message: string }) {

    const userId = client.id;
    const currentUser = this.onlineUsers.get(userId);
    this.historyMessages.get('roomName').push({ id: currentUser.user.id, sender: currentUser.user.username, text: message, image: currentUser.user.image, timestamp: new Date().toISOString() })

    this.server.to('roomName').emit('message', { id: currentUser.user.id, sender: currentUser.user.username, message, username: currentUser.user.username, image: currentUser.user.image });
  }
}