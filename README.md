# Documentação do Projeto de Microserviços

## Sumário

1. [Introdução](#introdução)
2. [Arquitetura](#arquitetura)
3. [Configuração do Ambiente](#configuração-do-ambiente)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Configuração dos Microserviços](#configuração-dos-microserviços)
6. [Testando a Aplicação](#testando-a-aplicação)
7. [Referências](#referências)

## Introdução

Este projeto demonstra uma arquitetura de microserviços utilizando NestJS, Prisma, RabbitMQ e SQLite. A aplicação é composta por vários serviços independentes que se comunicam através de um barramento de mensagens (RabbitMQ).

## Arquitetura

A arquitetura do projeto inclui os seguintes componentes:

- **RabbitMQ**: Usado para comunicação assíncrona entre os microserviços.
- **SQLite**: Banco de dados utilizado pelos microserviços.
- **API Gateway**: Ponto de entrada único para os clientes, responsável por encaminhar as solicitações para os microserviços apropriados.
- **Microserviços**: Serviços individuais responsáveis por diferentes funcionalidades (entry-exit, parking-spot, payment).

## Configuração do Ambiente

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js e npm instalados

### Iniciando os Contêineres Docker

Crie um arquivo `docker-compose.yml` com o seguinte conteúdo:

```yaml
version: "3.8"
services:
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

  entry-exit-service:
    build:
      context: ./entry-exit-service
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: "file:./dev.db"
      RABBITMQ_URL: "amqp://rabbitmq:5672"
    depends_on:
      - rabbitmq
    ports:
      - "3000:3000"

  parking-spot-service:
    build:
      context: ./parking-spot-service
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: "file:./dev.db"
      RABBITMQ_URL: "amqp://rabbitmq:5672"
    depends_on:
      - rabbitmq
    ports:
      - "3001:3001"

  payment-service:
    build:
      context: ./payment-service
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: "file:./dev.db"
      RABBITMQ_URL: "amqp://rabbitmq:5672"
    depends_on:
      - rabbitmq
    ports:
      - "3002:3002"

  api-gateway:
    build:
      context: ./api-gateway
      dockerfile: Dockerfile
    environment:
      RABBITMQ_URL: "amqp://rabbitmq:5672"
    depends_on:
      - entry-exit-service
      - parking-spot-service
      - payment-service
    ports:
      - "3003:3003"
```

### Executando o Docker Compose

Para iniciar todos os serviços, execute o comando:

```bash
docker-compose up
```

## Estrutura do Projeto

```plaintext
.
├── api-gateway
│   ├── Dockerfile
│   ├── src
│   │   ├── app.module.ts
│   │   ├── gateway.controller.ts
│   │   └── gateway.service.ts
├── entry-exit-service
│   ├── Dockerfile
│   ├── src
│   │   ├── app.module.ts
│   │   ├── entry-exit.controller.ts
│   │   ├── entry-exit.service.ts
│   │   └── dtos
│   │       └── vehicle.dto.ts
├── parking-spot-service
│   ├── Dockerfile
│   └── src
│       ├── app.module.ts
│       ├── parking-spot.controller.ts
│       ├── parking-spot.service.ts
│       └── dtos
│           └── vehicle.dto.ts
├── payment-service
│   ├── Dockerfile
│   └── src
│       ├── app.module.ts
│       ├── payment.controller.ts
│       ├── payment.service.ts
│       └── dtos
│           └── vehicle.dto.ts
└── docker-compose.yml
```

## Configuração dos Microserviços

### API Gateway

**app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ENTRY_EXIT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'entry-exit-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'PARKING_SPOT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'parking-spot-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'payment-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class AppModule {}
```

**gateway.controller.ts**

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { VehicleDTO } from './dtos/vehicle.dto';

@Controller('vehicle')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post('entry')
  async handleVehicleEntry(@Body() data: VehicleDTO) {
    return this.gatewayService.entryExitRequest(data);
  }

  @Post('exit')
  async handleVehicleExit(@Body() data: VehicleDTO) {
    return this.gatewayService.entryExitRequest(data);
  }
}
```

### Entry-Exit Service

**entry-exit.controller.ts**

```typescript
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { EntryExitService } from './entry-exit.service';
import { VehicleDTO } from './dtos/vehicle.dto';

@Controller()
export class EntryExitController {
  constructor(private readonly entryExitService: EntryExitService) {}

  @EventPattern('vehicleEntry')
  async handleVehicleEntry(data: VehicleDTO) {
    await this.entryExitService.registerEntry(data);
  }

  @EventPattern('vehicleExit')
  async handleVehicleExit(data: VehicleDTO) {
    await this.entryExitService.registerExit(data);
  }
}
```

## Testando a Aplicação

### Testando com Postman

1. **Iniciar todos os serviços**:
   Execute `docker-compose up` para iniciar todos os contêineres Docker.

2. **Testar entrada de veículo**: ***(Need to fix)***
   - Abra o Postman.
   - Crie uma nova requisição POST para `http://localhost:3003/vehicle/entry`.
   - No corpo da requisição, adicione um JSON com os dados do veículo:

```json
{
  "licensePlate": "ABC1234",
  "model": "Toyota",
  "color": "Red"
}
```

   - Envie a requisição.

3. **Testar saída de veículo**:
   - Crie uma nova requisição POST para `http://localhost:3003/vehicle/exit`.
   - No corpo da requisição, adicione um JSON com os dados do veículo:

```json
{
  "licensePlate": "ABC1234",
  "model": "Toyota",
  "color": "Red"
}
```

   - Envie a requisição.

## Referências

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Docker Documentation](https://docs.docker.com/)

Essa documentação básica deve ajudá-lo a entender a configuração e o funcionamento do projeto. Certifique-se de ajustar qualquer detalhe específico à sua implementação conforme necessário.