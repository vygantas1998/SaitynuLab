import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,

  HasManyThroughRepositoryFactory,
  repository
} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Player, PlayerStats, PlayerStatsPlayer, PlayerStatsRelations} from '../models';
import {PlayerStatsPlayerRepository} from './player-stats-player.repository';
import {PlayerRepository} from './player.repository';

export class PlayerStatsRepository extends DefaultCrudRepository<
  PlayerStats,
  typeof PlayerStats.prototype.id,
  PlayerStatsRelations
> {
  public readonly players: HasManyThroughRepositoryFactory<
    Player,
    typeof Player.prototype.id,
    PlayerStatsPlayer,
    typeof PlayerStatsPlayer.prototype.id
   >;

  constructor(
    @inject('datasources.mongoDb') dataSource: MongoDbDataSource,
    @repository.getter('PlayerRepository')
    playersRepositoryGetter: Getter<PlayerRepository>,
    @repository.getter('PlayerStatsPlayerRepository')
    playerStatsPlayerRepositoryGetter: Getter<PlayerStatsPlayerRepository>,
  ) {
    super(PlayerStats, dataSource);
    this.players = this.createHasManyThroughRepositoryFactoryFor(
      'players',
      playersRepositoryGetter,
      playerStatsPlayerRepositoryGetter
    );
  }
}
