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
import {
  deleteById,
  deleteThroughById,
  findById,
  findThrough,
  findThroughById,
  patchById,
  patchThroughById,
  postThrough,
} from '../helpers/helperFunctions';
import {Match, Player, PlayerStats} from '../models';
import {MatchRepository, PlayerRepository} from '../repositories';

@authenticate('jwt')
export class MatchController {
  constructor(
    @repository(MatchRepository)
    public matchRepository: MatchRepository,
    @repository(PlayerRepository)
    public playerRepository: PlayerRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) {}
  @authorize({allowedRoles: ['ADMIN']})
  @post('/matches', {
    responses: {
      '201': {
        description: 'Match model instance',
        content: {'application/json': {schema: getModelSchemaRef(Match)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {
            title: 'NewMatch',
            exclude: ['id'],
          }),
        },
      },
    })
    match: Omit<Match, 'id'>,
  ): Promise<Match> {
    this.response.status(201);
    return this.matchRepository.create(match);
  }

  @get('/matches', {
    responses: {
      '200': {
        description: 'Array of Match model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Match, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Match) filter?: Filter<Match>): Promise<Match[]> {
    return this.matchRepository.find(filter);
  }

  @get('/matches/{id}', {
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
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Match, {exclude: 'where'})
    filter?: FilterExcludingWhere<Match>,
  ): Promise<Match> {
    return this.matchRepository.findById(id, filter);
  }
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/matches/{id}', {
    responses: {
      '204': {
        description: 'Match PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {partial: true}),
        },
      },
    })
    match: Match,
  ): Promise<void> {
    await this.matchRepository.updateById(id, match);
  }
  @authorize({allowedRoles: ['ADMIN']})
  @del('/matches/{id}', {
    responses: {
      '204': {
        description: 'Match DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.matchRepository.deleteById(id);
  }
  @get('/matches/{id}/players', {
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
    @param.path.string('id') id: typeof Match.prototype.id,
    @param.filter(Player) filter?: Filter<Player>,
  ): Promise<Player[]> {
    return this.matchRepository.players(id).find(filter);
  }
  @get('/matches/{id}/players/{playerId}', {
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
    @param.path.string('id') id: typeof Match.prototype.id,
    @param.path.string('playerId') playerId: typeof Player.prototype.id,
    @param.filter(Player, {exclude: 'where'})
    filter?: FilterExcludingWhere<Player>,
  ): Promise<Player> {
    return findById(playerId, filter, this.matchRepository, 'players', id);
  }
  @authorize({allowedRoles: ['ADMIN']})
  @del('/matches/{id}/players/{playerId}', {
    responses: {
      '204': {
        description: 'Player DELETE success',
      },
    },
  })
  async deletePlayer(
    @param.path.string('id') id: typeof Match.prototype.id,
    @param.path.string('playerId')
    playerId: typeof Player.prototype.id,
  ): Promise<String> {
    this.response.status(204);
    return deleteById(playerId, {}, this.matchRepository, 'players', id);
  }
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/matches/{id}/players/{playerId}', {
    responses: {
      '204': {
        description: 'Player PATCH success',
      },
    },
  })
  async patchPlayer(
    @param.path.string('id') id: typeof Match.prototype.id,
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
    return patchById(playerId, {}, this.matchRepository, 'players', id, player);
  }
  @authorize({allowedRoles: ['ADMIN']})
  @post('/matches/{id}/players', {
    responses: {
      '201': {
        description: 'Player model instance',
        content: {'application/json': {schema: getModelSchemaRef(Player)}},
      },
    },
  })
  async createPlayer(
    @param.path.string('id') id: typeof Match.prototype.id,
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
    return this.matchRepository.players(id).create(playerData);
  }
  @get('/matches/{id}/players/{playerId}/player-stats', {
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
    @param.path.string('id') id: typeof Match.prototype.id,
    @param.path.string('playerId') playerId: typeof Player.prototype.id,
    @param.filter(PlayerStats) filter?: Filter<PlayerStats>,
  ): Promise<PlayerStats[]> {
    return findThrough(
      this.matchRepository.players(id).find({where: {id: playerId}}),
      filter,
      this.playerRepository.playerStats,
    );
  }
  @get('/matches/{id}/players/{playerId}/player-stats/{playerStatsId}', {
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
    @param.path.string('id') id: typeof Match.prototype.id,
    @param.path.string('playerId') playerId: typeof Player.prototype.id,
    @param.path.string('playerStatsId')
    playerStatsId: typeof PlayerStats.prototype.id,
    @param.filter(PlayerStats, {exclude: 'where'})
    filter?: FilterExcludingWhere<PlayerStats>,
  ): Promise<PlayerStats> {
    return findThroughById(
      playerStatsId,
      this.matchRepository.players(id).find({where: {id: playerId}}),
      filter,
      this.playerRepository.playerStats,
    );
  }
  @authorize({allowedRoles: ['ADMIN']})
  @del('/matches/{id}/players/{playerId}/player-stats/{playerStatsId}', {
    responses: {
      '204': {
        description: 'PlayerStat DELETE success',
      },
    },
  })
  async deletePlayerStats(
    @param.path.string('id') id: typeof Match.prototype.id,
    @param.path.string('playerId') playerId: typeof Player.prototype.id,
    @param.path.string('playerStatsId')
    playerStatsId: typeof PlayerStats.prototype.id,
  ): Promise<void> {
    this.response.status(204);
    return deleteThroughById(
      playerStatsId,
      this.matchRepository.players(id).find({where: {id: playerId}}),
      {},
      this.playerRepository.playerStats,
    );
  }
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/matches/{id}/players/{playerId}/player-stats/{playerStatsId}', {
    responses: {
      '204': {
        description: 'Player PATCH success',
      },
    },
  })
  async patchPlayerStats(
    @param.path.string('id') id: typeof Match.prototype.id,
    @param.path.string('playerId') playerId: typeof Player.prototype.id,
    @param.path.string('playerStatsId')
    playerStatsId: typeof PlayerStats.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlayerStats, {partial: true}),
        },
      },
    })
    playerStat: PlayerStats,
  ): Promise<void> {
    this.response.status(204);
    return patchThroughById(
      playerStatsId,
      this.matchRepository.players(id).find({where: {id: playerId}}),
      {},
      this.playerRepository.playerStats,
      playerStat,
    );
  }
  @authorize({allowedRoles: ['ADMIN']})
  @post('/matches/{id}/players/{playerId}/player-stats', {
    responses: {
      '201': {
        description: 'PlayerStats model instance',
        content: {'application/json': {schema: getModelSchemaRef(PlayerStats)}},
      },
    },
  })
  async createPlayerStats(
    @param.path.string('id') id: typeof Match.prototype.id,
    @param.path.string('playerId') playerId: typeof Player.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlayerStats, {
            title: 'NewPlayerStat',
            exclude: ['id'],
          }),
        },
      },
    })
    playerStatsData: Omit<PlayerStats, 'id'>,
  ): Promise<PlayerStats> {
    this.response.status(201);
    return postThrough(
      this.matchRepository.players(id).find({where: {id: playerId}}),
      this.playerRepository.playerStats,
      playerStatsData,
    );
  }
}
