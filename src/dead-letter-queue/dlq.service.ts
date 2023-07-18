import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Dlq } from './schema/dlq.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DlqService {
  constructor(@InjectModel(Dlq.name) private dlqModel: Model<Dlq>) {}

  addToQueue(data: { value: Record<string, any>; topic: (string | RegExp)[] }) {
    return this.dlqModel.create({ value: data.value, topic: data.topic });
  }
}
