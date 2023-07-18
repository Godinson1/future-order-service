import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { lastValueFrom } from 'rxjs';
import { INVENTORY_SERVICE, NOTIFICATION_SERVICE, PAYMENT_SERVICE } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderRequest } from '../dto/order';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderEvents {
  constructor(
    @Inject(INVENTORY_SERVICE) private inventoryClient: ClientProxy,
    @Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy,
    @Inject(NOTIFICATION_SERVICE) private notificationClient: ClientProxy,
  ) {}

  @OnEvent('order.created')
  async handleOrderCreatedInventory(
    input: CreateOrderRequest,
    orderId: string,
    authentication: string,
  ) {
    await lastValueFrom(
      this.inventoryClient.emit('order_created', {
        userId: input.userId,
        orderId,
        orderLineItems: input.orderLineItems,
        Authentication: authentication,
      }),
    );
  }

  @OnEvent('order.created')
  async handleOrderCreatedPayment(
    input: CreateOrderRequest,
    orderId: string,
    authentication: string,
  ) {
    await lastValueFrom(
      this.paymentClient.emit('order_created', {
        userId: input.userId,
        orderId,
        paymentInfo: input.paymentInfo,
        total: input.total,
        Authentication: authentication,
      }),
    );
  }

  @OnEvent('order_status_updated')
  async handleOrderStatusUpdated(order: Order, authentication: string) {
    await lastValueFrom(
      this.notificationClient.emit('order_status_updated', {
        order,
        Authentication: authentication,
      }),
    );
  }
}
