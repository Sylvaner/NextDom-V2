import {DefaultCrudRepository} from '@loopback/repository';
import {Light, LightRelations} from '../models';
import {NextdomDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LightRepository extends DefaultCrudRepository<
  Light,
  typeof Light.prototype.id,
  LightRelations
> {
  constructor(
    @inject('datasources.nextdomDb') dataSource: NextdomDbDataSource,
  ) {
    super(Light, dataSource);
  }
}
