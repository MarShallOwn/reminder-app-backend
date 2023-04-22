import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import EventService from "./event.service";
import { EventDTO, NewEventDTO } from "./dto";

@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Get()
    getAllEvents() {
        return this.eventService.getAllEvents()
    }

    @Post()
    insertEvent(@Body() dto : NewEventDTO){
        return this.eventService.insertEvent(dto)
    }

    @Put()
    updateEvent(@Body() dto: EventDTO) {
        return this.eventService.updateEvent(dto);
    }

    @Delete("/:id")
    deleteEvent(@Param("id") eventId: string) {
        return this.eventService.deleteEvent(eventId);
    }
}