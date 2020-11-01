import {Entity, hasMany, model, property} from '@loopback/repository';
import {MatchPlayer} from './match-player.model';
import {Player} from './player.model';

@model({settings: {strict: true}})
export class Match extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  team1Title: string;

  @property({
    type: 'string',
    required: true,
  })
  team2Title: string;

  @property({
    type: 'number',
  })
  team1Score?: number;

  @property({
    type: 'number',
  })
  team2Score?: number;

  @hasMany(() => Player, {through: {model: () => MatchPlayer}})
  players?: Player[];

  // @hasMany(() => PlayerStats, {through: {model: () => Player}})
  // playersStats?: PlayerStats[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Match>) {
    super(data);
  }
}

export interface MatchRelations {
  // describe navigational properties here
}

export type MatchWithRelations = Match & MatchRelations;
