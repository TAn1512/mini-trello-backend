import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { ConfigService } from '@nestjs/config';
import { initFirebase } from 'src/config/firebase.config';

@Module({
  controllers: [CardsController],
  providers: [CardsService,
    {
      provide: 'FIREBASE',
      inject: [ConfigService],
      useFactory: () => initFirebase(),
    },],
})
export class CardsModule { }
