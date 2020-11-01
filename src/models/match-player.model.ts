import {Entity, model, property} from '@loopback/repository';

@model()
export class MatchPlayer extends Entity {
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
  matchId: string;

  @property({
    type: 'string',
    required: true,
  })
  playerId: string;


  constructor(data?: Partial<MatchPlayer>) {
    super(data);
  }
}

export interface MatchPlayerRelations {
  // describe navigational properties here
}

export type MatchPlayerWithRelations = MatchPlayer & MatchPlayerRelations;
