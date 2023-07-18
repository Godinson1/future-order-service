import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AUTH_SERVICE,
  BITCOIN_SERVICE,
  INVENTORY_SERVICE,
  NOTIFICATION_SERVICE,
  PAYMENT_SERVICE,
} from 'src/constants';
import { AuthModule, RmqModule } from 'future-connectors';
import { OrderController } from './controller/order.controller';
import { OrderService } from './service/order.service';
import { OrderRepository } from './repository/order.repository';
import { Order } from './entities/order.entity';
import { OrderEvents } from './events/order.event';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    RmqModule,
    AuthModule,
    RmqModule.register({ name: AUTH_SERVICE }),
    RmqModule.register({ name: INVENTORY_SERVICE }),
    RmqModule.register({ name: NOTIFICATION_SERVICE }),
    RmqModule.register({ name: PAYMENT_SERVICE }),
    RmqModule.register({ name: BITCOIN_SERVICE }),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderEvents],
})
export class OrderModule {}
