import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CreateOrderRequest, OrderLineItems, OrderStatus } from '../dto/order';
import { OrderRepository } from '../repository/order.repository';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order_items.entity';

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository, private readonly dataSource: DataSource) {}

  findOrderHistory(userId: string): Promise<Order[]> {
    return this.orderRepository.findUserOrderHistory(userId);
  }

  findOrder(orderId: string): Promise<Order> {
    return this.orderRepository.findOrder(orderId);
  }

  async createOder(input: CreateOrderRequest, manager: EntityManager): Promise<Order> {
    const order = new Order();
    order.userId = input.userId;
    order.status = OrderStatus.PENDING;
    order.deliveryInfo = input.deliveryInfo;
    order.paymentInfo = input.paymentInfo;
    order.orderSubTotal = input.subTotal;
    order.orderTotal = input.total;
    order.orderItems = this.createOrderDetails(input.orderLineItems);
    const newOrder = await manager.save(order);
    return newOrder;
  }

  createOrderInTransaction(input: CreateOrderRequest) {
    return this.dataSource.transaction((manager: EntityManager) => {
      return this.createOder(input, manager);
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

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.getById(orderId);
    if (!order) throw new NotFoundException('Order not found!');
    order.status = status;
    return this.orderRepository.save(order);
  }
}
