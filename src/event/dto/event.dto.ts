import { IsDateString, IsNotEmpty, IsString } from "class-validator";
import { IsBeforeDate } from "src/decorator/IsBeforeDate.decorator";

export class NewEventDTO {
    @IsString()
    @IsNotEmpty()
    title: string;
    
    description: string;

    @IsDateString()
    @IsNotEmpty()
    start: Date;

    @IsDateString()
    @IsNotEmpty()
    @IsBeforeDate("start")
    end: Date;

    @IsString()
    @IsNotEmpty()
    priority: string;
}

export class EventDTO extends NewEventDTO {
    @IsString()
    @IsNotEmpty()
    _id: string;
}