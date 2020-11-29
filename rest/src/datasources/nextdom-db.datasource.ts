import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'nextdomDb',
  connector: 'postgresql',
  url: 'postgres://postgres:admin@nextdom-db/nextdom',
  host: 'nextdom-db',
  port: 5432,
  user: 'postgres',
  password: 'admin',
  database: 'nextdom'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class NextdomDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'nextdomDb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.nextdomDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
