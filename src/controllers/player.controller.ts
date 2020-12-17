import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {deleteById, findById, patchById} from '../helpers/helperFunctions';
import {Match, Player, PlayerStats} from '../models';
import {PlayerRepository} from '../repositories';

@authenticate('jwt')
export class PlayerController {
  constructor(
    @repository(PlayerRepository)
    public playerRepository: PlayerRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) {}
  @authorize({allowedRoles: ['ADMIN']})
  @post('/players', {
    responses: {
      '201': {
        description: 'Player model instance',
        content: {'application/json': {schema: getModelSchemaRef(Player)}},
      },
    },
  })
  async create(
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
    player: Omit<Player, 'id'>,
  ): Promise<Player> {
    this.response.status(201);
    return this.playerRepository.create(player);
  }

  @get('/players', {
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
  async find(@param.filter(Player) filter?: Filter<Player>): Promise<Player[]> {
    return this.playerRepository.find(filter);
  }

  @get('/players/{id}', {
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
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Player, {exclude: 'where'})
    filter?: FilterExcludingWhere<Player>,
  ): Promise<Player> {
    return this.playerRepository.findById(id, filter);
  }
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/players/{id}', {
    responses: {
      '204': {
        description: 'Player PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Player, {partial: true}),
        },
      },
    })
    player: Player,
  ): Promise<void> {
    await this.playerRepository.updateById(id, player);
  }
  @authorize({allowedRoles: ['ADMIN']})
  @del('/players/{id}', {
    responses: {
      '204': {
        description: 'Player DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.playerRepository.deleteById(id);
  }
  @get('/players/{id}/player-stats', {
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
  async findPlayerStats(
    @param.path.string('id') playerId: typeof Player.prototype.id,
    @param.filter(PlayerStats) filter?: Filter<PlayerStats>,
  ): Promise<PlayerStats[]> {
    return this.playerRepository.playerStats(playerId).find(filter);
  }
  @get('/players/{id}/player-stats/{playerStatId}', {
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
  async findPlayerStat(
    @param.path.string('id') playerId: typeof Player.prototype.id,
    @param.path.string('playerStatId')
    playerStatId: typeof PlayerStats.prototype.id,
    @param.filter(PlayerStats, {exclude: 'where'})
    filter?: FilterExcludingWhere<PlayerStats>,
  ): Promise<PlayerStats> {
    return findById(
      playerStatId,
      filter,
      this.playerRepository,
      'playerStats',
      playerId,
    );
  }
  @authorize({allowedRoles: ['ADMIN']})
  @del('/players/{id}/player-stats/{playerStatsId}', {
    responses: {
      '204': {
        description: 'PlayerStat DELETE success',
      },
    },
  })
  async deletePlayerStats(
    @param.path.string('id') playerId: typeof Player.prototype.id,
    @param.path.string('playerStatsId')
    playerStatId: typeof PlayerStats.prototype.id,
  ): Promise<String> {
    this.response.status(204);
    return deleteById(
      playerStatId,
      {},
      this.playerRepository,
      'playerStats',
      playerId,
    );
  }
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/players/{id}/player-stats/{playerStatsId}', {
    responses: {
      '204': {
        description: 'Match PATCH success',
      },
    },
  })
  async patchPlayerStats(
    @param.path.string('id') playerId: typeof Player.prototype.id,
    @param.path.string('playerStatsId')
    playerStatId: typeof PlayerStats.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlayerStats, {partial: true}),
        },
      },
    })
    playerStat: PlayerStats,
  ): Promise<String> {
    this.response.status(204);
    return patchById(
      playerStatId,
      {},
      this.playerRepository,
      'playerStats',
      playerId,
      playerStat,
    );
  }
  @authorize({allowedRoles: ['ADMIN']})
  @post('/players/{id}/player-stats', {
    responses: {
      '201': {
        description: 'PlayerStats model instance',
        content: {'application/json': {schema: getModelSchemaRef(PlayerStats)}},
      },
    },
  })
  async createPlayerStats(
    @param.path.string('id') playerId: typeof Player.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlayerStats, {
            title: 'NewStat',
            exclude: ['id'],
          }),
        },
      },
    })
    playerStatData: Omit<PlayerStats, 'id'>,
  ): Promise<PlayerStats> {
    this.response.status(201);
    return this.playerRepository.playerStats(playerId).create(playerStatData);
  }
  @get('/players/{id}/matches', {
    responses: {
      '200': {
        description: 'Match model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Match, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findMatches(
    @param.path.string('id') playerId: typeof Player.prototype.id,
    @param.filter(Match) filter?: Filter<Match>,
  ): Promise<Match[]> {
    return this.playerRepository.matches(playerId).find(filter);
  }
  @get('/players/{id}/matches/{matchId}', {
    responses: {
      '200': {
        description: 'Match model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Match, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findMatch(
    @param.path.string('id') playerId: typeof Player.prototype.id,
    @param.path.string('matchId') matchId: typeof Match.prototype.id,
    @param.filter(Match) filter?: Filter<Match>,
  ): Promise<Match> {
    return findById(
      matchId,
      filter,
      this.playerRepository,
      'matches',
      playerId,
    );
  }
  @authorize({allowedRoles: ['ADMIN']})
  @del('/players/{id}/matches/{matchId}', {
    responses: {
      '204': {
        description: 'Match DELETE success',
      },
    },
  })
  async deleteMatch(
    @param.path.string('id') playerId: typeof Player.prototype.id,
    @param.path.string('matchId')
    matchId: typeof Match.prototype.id,
  ): Promise<String> {
    this.response.status(204);
    return deleteById(matchId, {}, this.playerRepository, 'matches', playerId);
  }
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/players/{id}/matches/{matchId}', {
    responses: {
      '204': {
        description: 'Match PATCH success',
      },
    },
  })
  async patchMatch(
    @param.path.string('id') playerId: typeof Player.prototype.id,
    @param.path.string('matchId')
    matchId: typeof Match.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {partial: true}),
        },
      },
    })
    match: Match,
  ): Promise<String> {
    this.response.status(204);
    return patchById(
      matchId,
      {},
      this.playerRepository,
      'matches',
      playerId,
      match,
    );
  }
  @authorize({allowedRoles: ['ADMIN']})
  @post('/players/{id}/matches', {
    responses: {
      '201': {
        description: 'Match model instance',
        content: {'application/json': {schema: getModelSchemaRef(Match)}},
      },
    },
  })
  async createMatch(
    @param.path.string('id') playerId: typeof Player.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {
            title: 'NewStat',
            exclude: ['id'],
          }),
        },
      },
    })
    matchData: Omit<Match, 'id'>,
  ): Promise<Match> {
    this.response.status(201);
    return this.playerRepository.matches(playerId).create(matchData);
  }
}
