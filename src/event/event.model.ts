import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop({ required: true })
  title: string;

  description: string;

  @Prop({ required: true })
  priority: string;

  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
