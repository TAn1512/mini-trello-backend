import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
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

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          auth: {
            user: config.get<string>('EMAIL_USER'),
            pass: config.get<string>('EMAIL_PASS'),
          },
        },
        defaults: {
          from: '"Mini Trello" <noreply@minitrello.com>',
        },
      }),
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
