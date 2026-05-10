import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { RecepientsModule } from './recepients/recepients.module';
import { EmailsModule } from './emails/emails.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASS'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity.js'],
        synchronize: true,
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('BULL_HOST'),
          port: configService.get<number>('BULL_PORT'),
        },
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const user = config.get<string>('SMTP_USER');
        const pass = config.get<string>('SMTP_PASS');
        return {
          transport: {
            host: config.get<string>('SMTP_HOST'),
            port: parseInt(config.get<string>('SMTP_PORT') ?? '1025', 10),
            secure: false,
            ...(user && pass ? { auth: { user, pass } } : {}),
          },
        };
      },
    }),
    UsersModule,
    AuthModule,
    CampaignsModule,
    RecepientsModule,
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
