export class DeliveryInfo {
  billingAddress: string;
  shippingAddress: string;
}

export class PaymentInfo {
  type: string;
  status: string;
}

export class OrderLineItems {
  productId: string;
  quantity: number;
  price: number;
}

export class CreateOrderRequest {
  userId: string;
  orderLineItems: OrderLineItems[];
  paymentInfo: PaymentInfo;
  deliveryInfo: DeliveryInfo;
  subTotal: number;
  total: number;
}

export class OrderResponse {
  orderId: string;
  status: string;
  message: string;
  orderTotal?: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  VERIFIED = 'VERIFIED',
}
