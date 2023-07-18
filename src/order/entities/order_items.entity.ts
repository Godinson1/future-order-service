import { IsEmpty, IsUUID, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty()
  @IsUUID('4')
  id?: string;

  @IsDate()
  @CreateDateColumn({ name: 'created_date' })
  createdDate?: Date;

  @IsDate()
  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate?: Date;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order?: Order;

  @Column({ name: 'product_id', nullable: true, type: 'text' })
  productId?: string;

  @Column({ name: 'quantity', nullable: true })
  quantity?: number;

  @Column({ name: 'price', nullable: true })
  price?: number;
}
