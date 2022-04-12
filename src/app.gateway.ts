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
import { SampleService } from './sample/sample.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Aquí se debe cambiar port la url que ùnicamente puede consumir, por ahora '*' sirve para indicar que cualquier sitio pueda consumir
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  connections: Array<any> = [] // Servirá para almacenar las conexiones, no es persistente, cuando se reincia el microservicio se vacia

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway'); // Para imprimir en consola si necesita hacer algún log o debug

  constructor(
    private readonly sampleService: SampleService
  ) {
  }

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

  // Canal de prueba
  @SubscribeMessage('msgToServer') // Nombre del canal, esto llega a ser como el me2todo 'on', listener
  handleMessage(client: Socket, payload: string): void { // Se recibe el client socket, contiene la configuración de quién llama al canal; y payload que recibe la data
    this.server.emit('msgToClient', payload); // Para devolver o notificar a cualquier cliente conectado debe hacerse un 'emit', para notificar y pasar el payload que se debe devolver
  }

  // Canal de prueba
  @SubscribeMessage('connectBidsRoom') // Servirá para cuando entre a una sala recupere directamente la última puja/ puede usar este o su propio ep
  async connectBidsRoom(client: Socket, payload: string): Promise<void> {
    const connection = client.handshake.auth.user || client.id
    const room = client.handshake.auth.room || 1
    const bid = await this.sampleService.getSampleById(room);
    this.server.emit(`bidsRoom-room${room}-connection${connection}`, bid); // Se devolverá únicamente al usuario que recién ingresa a la sala de pujas, se le indica el identificador u3nico y a que sala
  }

  // Canal de prueba
  @SubscribeMessage('handleBids') // Cuando cree una puja, llegará aquí
  async handleBids(client: Socket, payload: any): Promise<void> {
    const connection = client.handshake.auth.user || client.id
    const room = client.handshake.auth.room || 1
    let createBid // const createBid = await this.sampleService.newSample(payload) // Aquí llama al método para crear la puja y también donde irá toda la validación
    // Al terminar obtendrá su resultado
    // Puede hacer una validación if else; if por si la puja es válida debe notificar a todos los usuarios de la sala; else para notificar únicamente al usuario que creo que su puja no es válida
    if (createBid) {
      this.server.emit(`bidsRoom-room${room}`, createBid); // Se devolverá únicamente al usuario que recién ingresa a la sala de pujas, se le indica el identificador u3nico y a que sala
    } else {
      this.server.emit(`bidsRoom-room${room}-connection${connection}`, createBid); // Se devolverá únicamente al usuario que recién ingresa a la sala de pujas, se le indica el identificador u3nico y a que sala
    }
    this.server.emit('msgToClient', createBid); // Para devolver o notificar a cualquier cliente conectado debe hacerse un 'emit', para notificar y pasar el payload que se debe devolver
  }
}