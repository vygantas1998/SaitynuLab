import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,

  HasManyThroughRepositoryFactory,
  repository
} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Match, MatchPlayer, Player, PlayerRelations, PlayerStats, PlayerStatsPlayer} from '../models';
import {MatchPlayerRepository} from './match-player.repository';
import {MatchRepository} from './match.repository';
import {PlayerStatsPlayerRepository} from './player-stats-player.repository';
import {PlayerStatsRepository} from './player-stats.repository';

export class PlayerRepository extends DefaultCrudRepository<
  Player,
  typeof Player.prototype.id,
  PlayerRelations
> {
  public readonly playerStats: HasManyThroughRepositoryFactory<
    PlayerStats,
    typeof PlayerStats.prototype.id,
    PlayerStatsPlayer,
    typeof PlayerStatsPlayer.prototype.id
  >;
  public readonly matches: HasManyThroughRepositoryFactory<
    Match,
    typeof Match.prototype.id,
    MatchPlayer,
    typeof MatchPlayer.prototype.id
  >;

  constructor(
    @inject('datasources.mongoDb') dataSource: MongoDbDataSource,
    @repository.getter('PlayerStatsRepository')
    playerStatsRepositoryGetter: Getter<PlayerStatsRepository>,
    @repository.getter('MatchRepository')
    matchRepositoryGetter: Getter<MatchRepository>,
    @repository.getter('PlayerStatsPlayerRepository')
    playerStatsPlayerRepositoryGetter: Getter<PlayerStatsPlayerRepository>,
    @repository.getter('MatchPlayerRepository')
    matchPlayerRepositoryGetter: Getter<MatchPlayerRepository>,
  ) {
    super(Player, dataSource);
    this.playerStats = this.createHasManyThroughRepositoryFactoryFor(
      'playerStats',
      playerStatsRepositoryGetter,
      playerStatsPlayerRepositoryGetter
    );
    this.matches = this.createHasManyThroughRepositoryFactoryFor(
      'matches',
      matchRepositoryGetter,
      matchPlayerRepositoryGetter
    );
  }
}
