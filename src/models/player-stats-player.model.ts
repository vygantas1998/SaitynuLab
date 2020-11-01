import {belongsTo, Entity, model, property} from '@loopback/repository';
import {PlayerStats} from './player-stats.model';
import {Player} from './player.model';

@model()
export class PlayerStatsPlayer extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Player)
  playerId: string;

  @belongsTo(() => PlayerStats)
  playerStatsId: string;

  constructor(data?: Partial<PlayerStatsPlayer>) {
    super(data);
  }
}

export interface PlayerStatsPlayerRelations {
  // describe navigational properties here
}

export type PlayerStatsPlayerWithRelations = PlayerStatsPlayer & PlayerStatsPlayerRelations;
