import {inject} from '@loopback/core';
import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,

  requestBody, Response,

  RestBindings
} from '@loopback/rest';
import {Player, PlayerStats} from '../models';
import {PlayerStatsRepository} from '../repositories';

export class PlayerStatsController {
  constructor(
    @repository(PlayerStatsRepository)
    public playerStatsRepository: PlayerStatsRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response
  ) {}

  @post('/player-stats', {
    responses: {
      '201': {
        description: 'PlayerStats model instance',
        content: {'application/json': {schema: getModelSchemaRef(PlayerStats)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlayerStats, {
            title: 'NewPlayerStats',
            exclude: ['id'],
          }),
        },
      },
    })
    playerStats: Omit<PlayerStats, 'id'>,
  ): Promise<PlayerStats> {
    this.response.status(201);
    return this.playerStatsRepository.create(playerStats);
  }

  @get('/player-stats', {
    responses: {
      '200': {
        description: 'Array of PlayerStats model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(PlayerStats, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(PlayerStats) filter?: Filter<PlayerStats>,
  ): Promise<PlayerStats[]> {
    return this.playerStatsRepository.find(filter);
  }

  @get('/player-stats/{id}', {
    responses: {
      '200': {
        description: 'PlayerStats model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PlayerStats, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PlayerStats, {exclude: 'where'})
    filter?: FilterExcludingWhere<PlayerStats>,
  ): Promise<PlayerStats> {
    return this.playerStatsRepository.findById(id, filter);
  }

  @patch('/player-stats/{id}', {
    responses: {
      '204': {
        description: 'PlayerStats PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlayerStats, {partial: true}),
        },
      },
    })
    playerStats: PlayerStats,
  ): Promise<void> {
    await this.playerStatsRepository.updateById(id, playerStats);
  }

  @del('/player-stats/{id}', {
    responses: {
      '204': {
        description: 'PlayerStats DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.playerStatsRepository.deleteById(id);
  }
  @get('/player-stats/{id}/players', {
    responses: {
      '200': {
        description: 'Player model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Player, {includeRelations: true}),
          },
        },
      },
    },
  })
  async getPlayers(
    @param.path.string('id') playerStatsId: typeof PlayerStats.prototype.id,
    @param.filter(Player) filter?: Filter<Player>
    ): Promise<Player[]> {
    return this.playerStatsRepository.players(playerStatsId).find(filter);
  }
}
