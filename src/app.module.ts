import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/connection';
import { PokemonModule } from './pokemon/pokemon.module';
import { UserModule } from './user/user.module';
import { TradingModule } from './trading/trading.module';

@Module({
  imports: [UserModule, PokemonModule, DatabaseModule, TradingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
