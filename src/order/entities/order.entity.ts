import { IsEmpty, IsUUID, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DeliveryInfo, PaymentInfo } from '../dto/order';
import { OrderItem } from './order_items.entity';

@Entity({ name: 'orders' })
export class Order {
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

  @Column({ name: 'user_id', nullable: true, type: 'text' })
  userId?: string;

  @Column({ name: 'status', nullable: true, type: 'text' })
  status?: string;

  @Column({ name: 'order_subtotal', nullable: true })
  orderSubTotal?: number;

  @Column({ name: 'order_total', nullable: true })
  orderTotal?: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems?: OrderItem[];

  @Column({ name: 'delivery_info', nullable: true, type: 'jsonb' })
  deliveryInfo?: DeliveryInfo;

  @Column({ name: 'payment_info', nullable: true, type: 'jsonb' })
  paymentInfo?: PaymentInfo;
}
