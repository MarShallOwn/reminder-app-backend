import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsAfterDate } from "src/decorator/IsAfterDate.decorator";
import { IsBeforeDate } from "src/decorator/IsBeforeDate.decorator";

export class NewEventDTO {
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsString()
    @IsOptional()
    description: string;

    @IsDateString()
    @IsNotEmpty()
    start: Date;

    @IsDateString()
    @IsNotEmpty()
    @IsAfterDate("start")
    end: Date;

    @IsString()
    @IsNotEmpty()
    priority: string;

    @IsDateString()
    @IsOptional()
    @IsBeforeDate("start")
    notificationDate?: Date;

    @IsBoolean()
    @IsOptional()
    silentNotification?: boolean = false;
}

export class EventDTO extends NewEventDTO {
    @IsString()
    @IsNotEmpty()
    _id: string;
}