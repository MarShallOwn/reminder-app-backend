import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import EventService from "./event.service";
import { EventDTO, NewEventDTO } from "./dto";
import { ApiOkResponse } from "@nestjs/swagger";

@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @ApiOkResponse({
        description: 'Return all the events',
        type: "string",
        isArray: true
    })
    @Get("/notifications")
    getAllEvents() {
        return this.eventService.getNotifyEvents()
    }

    @Get()
    getNotifyEvents() {
        return this.eventService.getAllEvents()
    }


    @Post()
    insertEvent(@Body() dto : NewEventDTO){
        return this.eventService.insertEvent(dto)
    }

    @HttpCode(204)
    @Put()
    updateEvent(@Body() dto: EventDTO) {
        return this.eventService.updateEvent(dto);
    }

    @HttpCode(204)
    @Delete("/:id")
    deleteEvent(@Param("id") eventId: string) {
        return this.eventService.deleteEvent(eventId);
    }
}