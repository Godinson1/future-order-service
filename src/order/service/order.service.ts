import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../repository/order.repository';
import { CreateOrderRequest, OrderLineItems, OrderResponse, OrderStatus } from '../dto/order';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order_items.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  findOrderHistory(userId: string): Promise<Order[]> {
    return this.orderRepository.findUserOrderHistory(userId);
  }

  findOrder(orderId: string): Promise<Order> {
    return this.orderRepository.findOrder(orderId);
  }

  async createOder(
    input: CreateOrderRequest,
    manager: EntityManager,
    token: string,
  ): Promise<OrderResponse> {
    const order = new Order();
    order.userId = input.userId;
    order.status = OrderStatus.PENDING;
    order.deliveryInfo = input.deliveryInfo;
    order.paymentInfo = input.paymentInfo;
    order.orderSubTotal = input.subTotal;
    order.orderTotal = input.total;
    order.orderItems = this.createOrderDetails(input.orderLineItems);
    const newOrder = await manager.save(order);
    this.eventEmitter.emit('order.created', input, newOrder.id, token);
    return {
      orderId: newOrder.id,
      orderTotal: newOrder.orderTotal,
      status: 'success',
      message: 'Order created successfully!',
    };
  }

  createOrderInTransaction(input: CreateOrderRequest, token: string) {
    return this.dataSource.transaction((manager: EntityManager) => {
      return this.createOder(input, manager, token);
    });
  }

  createOrderDetails(lineItems: OrderLineItems[]): OrderItem[] {
    return lineItems.map((item: OrderLineItems) => {
      const orderLineItems = new OrderItem();
      orderLineItems.productId = item.productId;
      orderLineItems.quantity = item.quantity;
      orderLineItems.price = item.price;
      return orderLineItems;
    });
  }

  reviseOrder() {
    return this.orderRepository.find();
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    token: string,
  ): Promise<OrderResponse> {
    const order = await this.orderRepository.getById(orderId);
    if (!order) throw new NotFoundException('Order not found!');
    order.status = status;
    await this.orderRepository.save(order);
    this.eventEmitter.emit('order_status_updated', order, token);
    return {
      orderId,
      status: 'success',
      message: 'Order status updated successfully!',
    };
  }
}
