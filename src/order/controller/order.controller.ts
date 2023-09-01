import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderRequest, OrderResponse, OrderStatus } from '../dto/order';
import { Order } from '../entities/order.entity';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { JwtAuthGuard, RmqService, extractTokenFromHeader } from 'future-connectors';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly rmqService: RmqService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  findOrderHistory(@Body() input: { userId: string }): Promise<Order[]> {
    return this.orderService.findOrderHistory(input.userId);
  }

  @Get(':id')
  findOrder(@Param() params: any): Promise<Order> {
    return this.orderService.findOrder(params.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOder(@Body() input: CreateOrderRequest, @Req() req: any): Promise<OrderResponse> {
    const token = extractTokenFromHeader(req);
    const order = await this.orderService.createOrderInTransaction(input);
    this.eventEmitter.emit('order.created', input, order.id, token);
    return {
      orderId: order.id,
      orderTotal: order.orderTotal,
      status: 'success',
      message: 'Order created successfully!',
    };
  }

  @Put('/:id')
  reviseOrder() {
    return this.orderService.reviseOrder();
  }

  @Patch(':id')
  async updateOrderStatus(
    @Param() params: any,
    @Body() input: { status: OrderStatus },
    token?: string,
  ): Promise<OrderResponse> {
    const order = await this.orderService.updateOrderStatus(params.id, input.status);
    this.eventEmitter.emit('order_status_updated', order, token);
    return {
      orderId: order.id,
      status: 'success',
      message: 'Order status updated successfully!',
    };
  }

  @EventPattern('order_verified')
  @UseGuards(JwtAuthGuard)
  orderVerificationStatus(
    @Payload() data: { status: OrderStatus; orderId: string; Authentication: string },
    @Ctx() context: RmqContext,
  ) {
    const order = this.orderService.updateOrderStatus(data.orderId, OrderStatus.VERIFIED);
    this.eventEmitter.emit('order_status_updated', order, data.Authentication);
    this.rmqService.ack(context as any);
  }

  @MessagePattern('bitcoin')
  getCustomers(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context as any);
  }
}
