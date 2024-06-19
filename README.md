# **Microservices Project Documentation**

## **Table of Contents**

1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Environment Setup](#environment-setup)
4. [Project Structure](#project-structure)
5. [Microservices Configuration](#microservices-configuration)
6. [Testing the Application](#testing-the-application)
7. [References](#references)

## **Introduction**

This project demonstrates a microservices architecture using NestJS, Prisma, RabbitMQ, and SQLite. The application consists of several independent services that communicate through a message bus (RabbitMQ).

## **Architecture**

The project architecture includes the following components:

- **RabbitMQ**: Used for asynchronous communication between microservices.
- **SQLite**: Database used by the microservices.
- **API Gateway**: Single entry point for clients, responsible for routing requests to the appropriate microservices.
- **Microservices**: Individual services responsible for different functionalities (entry-exit, parking-spot, payment).

## **Environment Setup**

### **Prerequisites**
- Docker and Docker Compose installed
- Node.js and npm installed

### **Starting the Docker Containers**

Create a `docker-compose.yml` file with the following content:

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

### **Running Docker Compose**

To start all services, run the command:

```bash
docker-compose up
```

## **Project Structure**

```
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

## **Microservices Configuration**

### **API Gateway**

*app.module.ts*

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

*gateway.controller.ts*

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

### **Entry-Exit Service**

*entry-exit.controller.ts*

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

## **Testing the Application**

### **Testing with Postman**

1. **Start all services**: Run `docker-compose up` to start all Docker containers.

2. **Test vehicle entry**:

   - Open Postman.
   - Create a new POST request to `http://localhost:3003/vehicle/entry`.
   - In the request body, add a JSON with the vehicle data:
     ```json
     {
       "licensePlate": "ABC1234",
       "model": "Toyota",
       "color": "Red"
     }
     ```
   - Send the request.

3. **Test vehicle exit**:

   - Create a new POST request to `http://localhost:3003/vehicle/exit`.
   - In the request body, add a JSON with the vehicle data:
     ```json
     {
       "licensePlate": "ABC1234",
       "model": "Toyota",
       "color": "Red"
     }
     ```
   - Send the request.

## **References**

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Docker Documentation](https://docs.docker.com/)

This basic documentation should help you understand the setup and operation of the project. Make sure to adjust any specifics to your implementation as necessary.