import {Entity, hasMany, model, property} from '@loopback/repository';
import {PlayerStatsPlayer} from './player-stats-player.model';
import {Player} from './player.model';

@model({settings: {strict: true}})
export class PlayerStats extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @hasMany(() => Player, {through: {model: () => PlayerStatsPlayer}})
  players?: Player[];

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    itemType: 'number',
    required: true,
  })
  value: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PlayerStats>) {
    super(data);
  }
}

export interface PlayerStatsRelations {
  // describe navigational properties here
}

export type PlayerStatsWithRelations = PlayerStats & PlayerStatsRelations;
