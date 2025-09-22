import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CardTitle } from '../entities/card.entity';

export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    boardId: string;

    @IsEnum(CardTitle, {
        message: 'title must be one of Icebox, Backlog, On going, Waiting for review, Done',
    })
    title: CardTitle;
}
