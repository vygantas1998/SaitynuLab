import {DefaultCrudRepository} from '@loopback/repository';
import {MatchPlayer, MatchPlayerRelations} from '../models';
import {MongoDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class MatchPlayerRepository extends DefaultCrudRepository<
  MatchPlayer,
  typeof MatchPlayer.prototype.id,
  MatchPlayerRelations
> {
  constructor(
    @inject('datasources.mongoDb') dataSource: MongoDbDataSource,
  ) {
    super(MatchPlayer, dataSource);
  }
}
