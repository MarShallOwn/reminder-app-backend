import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument } from './event.model';
import jsonResponse from 'src/utils/jsonResponse';
import { catchError } from 'src/utils/catchError';

type EventType = {
  _id?: string;
  title: string;
  start: Date;
  end: Date;
  priority: string;
  description?: string;
  notificationDate?: Date;
};

@Injectable({})
export default class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async insertEvent(reqEvent: EventType) {
    try {
      let savedEvent = reqEvent;
      if(!reqEvent.hasOwnProperty("notificationDate")) {
        const oneDayBeforeStartDate = new Date(reqEvent.start);
        oneDayBeforeStartDate.setDate(oneDayBeforeStartDate.getDate() - 1);
        savedEvent.notificationDate = oneDayBeforeStartDate;
      }

      const event = new this.eventModel(savedEvent);

      const result = await event.save();

      return jsonResponse(201, 'Event Added Successfully', {
        data: { eventId: result.id },
      });
    } catch (err) {
      return catchError(err);
    }
  }

  async getAllEvents() {
    try {
      const events = await this.eventModel.find();

      return jsonResponse(200, 'Events Successfully Retrieved', {
        data: { events },
      });
    } catch (err) {
      return catchError(err);
    }
  }

  async updateEvent(reqEvent: EventType) {
    try {
      await this.eventModel.findByIdAndUpdate(reqEvent._id, { ...reqEvent });

      return jsonResponse(204, 'Events Successfully Updated', { data: null });
    } catch (err) {
      return catchError(err);
    }
  }

  async deleteEvent(eventId: string) {
    try {
      await this.eventModel.findByIdAndDelete(eventId);

      return jsonResponse(204, 'Events Successfully Deleted', { data: null });
    } catch (err) {
      return catchError(err);
    }
  }
}
