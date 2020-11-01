import {Entity, hasMany, model, property} from '@loopback/repository';
import {MatchPlayer} from './match-player.model';
import {Match} from './match.model';
import {PlayerStatsPlayer} from './player-stats-player.model';
import {PlayerStats} from './player-stats.model';

@model({settings: {strict: true}})
export class Player extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  surname?: string;

  @property({
    type: 'string',
    required: true,
  })
  nickName: string;

  @property({
    type: 'string',
  })
  pictureURL?: string;

  @hasMany(() => PlayerStats, {through: {model: () => PlayerStatsPlayer}})
  playerStats?: PlayerStats[];

  @hasMany(() => Match, {through: {model: () => MatchPlayer}})
  matches?: Match[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Player>) {
    super(data);
  }
}

export interface PlayerRelations {
  // describe navigational properties here
}

export type PlayerWithRelations = Player & PlayerRelations;
