import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderRequest, OrderResponse, OrderStatus } from '../dto/order';
import { Order } from '../entities/order.entity';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { JwtAuthGuard, RmqService, extractTokenFromHeader } from 'future-connectors';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly rmqService: RmqService,
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
  createOder(@Body() input: CreateOrderRequest, @Req() req: any): Promise<OrderResponse> {
    return this.orderService.createOrderInTransaction(input, extractTokenFromHeader(req));
  }

  @Put('/:id')
  reviseOrder() {
    return this.orderService.reviseOrder();
  }

  @Patch(':id')
  updateOrderStatus(
    @Param() params: any,
    @Body() input: { status: OrderStatus },
    token?: string,
  ): Promise<OrderResponse> {
    return this.orderService.updateOrderStatus(params.id, input.status, token);
  }

  @EventPattern('order_verified')
  @UseGuards(JwtAuthGuard)
  orderVerificationStatus(
    @Payload() data: { status: OrderStatus; orderId: string; Authentication: string },
    @Ctx() context: RmqContext,
  ) {
    this.orderService.updateOrderStatus(data.orderId, OrderStatus.VERIFIED, data.Authentication);
    this.rmqService.ack(context as any);
  }

  @MessagePattern('bitcoin')
  getCustomers(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context as any);
  }
}
