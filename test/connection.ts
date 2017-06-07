
import {Sequelize, SyncOptions} from 'sequelize';

export const sequelize = new Sequelize('uri');

sequelize.afterBulkSync((options: SyncOptions) => {
  console.log('synced');
});
