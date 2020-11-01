import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,


  HasManyThroughRepositoryFactory,
  repository
} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Match, MatchPlayer, MatchRelations, Player} from '../models';
import {MatchPlayerRepository} from './match-player.repository';
import {PlayerRepository} from './player.repository';

export class MatchRepository extends DefaultCrudRepository<
  Match,
  typeof Match.prototype.id,
  MatchRelations
> {
  public readonly players: HasManyThroughRepositoryFactory<
    Player,
    typeof Player.prototype.id,
    MatchPlayer,
    typeof MatchPlayer.prototype.id
  >;
  // public readonly playerStats: HasManyThroughRepositoryFactory<
  //   PlayerStats,
  //   typeof PlayerStats.prototype.id,
  //   Player,
  //   typeof Player.prototype.id
  // >;
  constructor(
    @inject('datasources.mongoDb') dataSource: MongoDbDataSource,
    // @repository.getter('PlayerStatsRepository')
    // playerStatsRepositoryGetter: Getter<PlayerStatsRepository>,
    @repository.getter('PlayerRepository')
    playersRepositoryGetter: Getter<PlayerRepository>,
    @repository.getter('MatchPlayerRepository')
    matchPlayerRepositoryGetter: Getter<MatchPlayerRepository>,
  ) {
    super(Match, dataSource);
    this.players = this.createHasManyThroughRepositoryFactoryFor(
      'players',
      playersRepositoryGetter,
      matchPlayerRepositoryGetter
    );
    // this.playerStats = this.createHasManyThroughRepositoryFactoryFor(
    //   'players',
    //   playerStatsRepositoryGetter,
    //   playersRepositoryGetter,
    // );
  }
}
