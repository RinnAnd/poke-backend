import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TradingService } from './trading.service';

@Controller('trades')
export class TradingController {
  constructor(private readonly tradingService: TradingService) {}

  @Post()
  addPokemonTrade(@Body() body: { userPokemonId: string }) {
    return this.tradingService.addPokemonTrade(body.userPokemonId);
  }

  @Delete(':userPokemonId')
  removePokemonTrade(@Param('userPokemonId') userPokemonId: string) {
    return this.tradingService.removePokemonTrade(userPokemonId);
  }

  @Get()
  getPokemonsForTrade() {
    return this.tradingService.getPokemonsForTrade();
  }

  @Get('offers')
  getTrades() {
    return this.tradingService.getTradeOffers();
  }

  @Post(':id/propose')
  proposeTrade(
    @Param('id') id: string,
    @Body() body: { offeredPokemonId: string },
  ) {
    return this.tradingService.proposeTrade(id, body.offeredPokemonId);
  }

  @Post(':id/confirm')
  confirmTrade(@Param('id') id: string, @Body() body: { accepted: boolean }) {
    return this.tradingService.confirmTrade(id, body.accepted);
  }
}
