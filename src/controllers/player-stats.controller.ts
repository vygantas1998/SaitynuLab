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
import {deleteById, findById, patchById} from '../helpers/helperFunctions';
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
        description: 'Array of Player model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Player, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findPlayers(
    @param.path.string('id') id: typeof PlayerStats.prototype.id,
    @param.filter(Player) filter?: Filter<Player>,
    ): Promise<Player[]> {
    return this.playerStatsRepository.players(id).find(filter);
  }
  @get('/player-stats/{id}/players/{playerId}', {
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
  async findPlayer(
    @param.path.string('id') id: typeof PlayerStats.prototype.id,
    @param.path.string('playerId') playerId: typeof Player.prototype.id,
    @param.filter(Player, {exclude: 'where'})
    filter?: FilterExcludingWhere<Player>,
    ): Promise<Player> {
    return findById(playerId, filter, this.playerStatsRepository, "players", id);
  }
  @del('/player-stats/{id}/players/{playerId}', {
    responses: {
      '204': {
        description: 'Player DELETE success',
      },
    },
  })
  async deletePlayer(
    @param.path.string('id') id: typeof PlayerStats.prototype.id,
    @param.path.string('playerId')
    playerId: typeof Player.prototype.id,
    ): Promise<String> {
      this.response.status(204);
    return deleteById(playerId, {}, this.playerStatsRepository, "players", id);
  }
  @patch('/player-stats/{id}/players/{playerId}', {
    responses: {
      '204': {
        description: 'Player PATCH success',
      },
    },
  })
  async patchPlayer(
    @param.path.string('id') id: typeof PlayerStats.prototype.id,
    @param.path.string('playerId')
    playerId: typeof Player.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Player, {partial: true}),
        },
      },
    })
    player: Player,
    ): Promise<String> {
    this.response.status(204);
    return patchById(playerId, {}, this.playerStatsRepository, "players", id, player);
  }
  @post('/player-stats/{id}/players', {
    responses: {
      '201': {
        description: 'Player model instance',
        content: {'application/json': {schema: getModelSchemaRef(Player)}},
      },
    },
  })
  async createPlayer(
    @param.path.string('id') id: typeof PlayerStats.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Player, {
            title: 'NewPlayer',
            exclude: ['id'],
          }),
        },
      },
    })
    playerData: Omit<Player, 'id'>,
    ): Promise<Player> {
      this.response.status(201);
    return this.playerStatsRepository.players(id).create(playerData);
  }
}

