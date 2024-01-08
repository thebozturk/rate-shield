import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';

@Module({
  imports: [AuthModule, RateLimiterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
