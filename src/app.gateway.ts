import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Aquí se debe cambiar port la url que ùnicamente puede consumir, por ahora '*' sirve para indicar que cualquier sitio pueda consumir
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  connections: Array<any> = [] // Servirá para almacenar las conexiones, no es persistente, cuando se reincia el microservicio se vacia

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway'); // Para imprimir en consola si necesita hacer algún log o debug

  // Se ejecuta al iniciar el microservicio
  afterInit(server: Server) {
    this.logger.log('Init sockets service');
  }

  // Se ejecuta una sola vez por cada nueva conexión
  handleConnection(client: Socket, ...args: any[]) {
    const connection = client.handshake.auth.user || client.id
    this.connections.push(connection)
    this.logger.log(`Client connected: ${client.id}`);
    this.logger.verbose(`Clients connected: ${this.connections.length}`);
  }

  // Se ejecuta cada vez que una conexión termina
  handleDisconnect(client: Socket) {
    const connection = client.handshake.auth.user || client.id
    let x = this.connections.filter(c => c != connection)
    this.connections = x
    this.logger.log(`Client disconnected: ${client.id}`);
    this.logger.verbose(`Clients connected: ${this.connections.length}`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload);
  }
}