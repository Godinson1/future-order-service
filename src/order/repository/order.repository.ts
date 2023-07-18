import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  async getById(id: string) {
    return this.findOne({ where: { id } });
  }

  async saveItem(entity: EntityTarget<any>, items: any) {
    return this.dataSource.getRepository(entity).save(items);
  }

  async findUserOrderHistory(userId: string): Promise<Order[]> {
    return this.find({ where: { userId }, relations: { orderItems: true } });
  }

  async findOrder(id: string): Promise<Order> {
    return this.findOne({ where: { id }, relations: { orderItems: true } });
  }
}
