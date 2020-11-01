import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {PlayerStatsPlayer, PlayerStatsPlayerRelations} from '../models';

export class PlayerStatsPlayerRepository extends DefaultCrudRepository<
  PlayerStatsPlayer,
  typeof PlayerStatsPlayer.prototype.id,
  PlayerStatsPlayerRelations
> {
  constructor(
    @inject('datasources.mongoDb') dataSource: MongoDbDataSource,
  ) {
    super(PlayerStatsPlayer, dataSource);
  }
}
