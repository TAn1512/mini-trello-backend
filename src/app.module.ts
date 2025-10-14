import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { initFirebase } from './config/firebase.config';
import { BoardsModule } from './modules/boards/boards.module';
import { CardsModule } from './modules/cards/cards.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    BoardsModule,
    CardsModule,
    TasksModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'FIREBASE',
      inject: [ConfigService],
      useFactory: () => initFirebase(),
    },
  ],
})
export class AppModule { }
