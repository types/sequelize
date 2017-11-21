
import {Sequelize, SyncOptions, QueryTypes} from 'sequelize';

export const sequelize = new Sequelize('uri');

sequelize.afterBulkSync((options: SyncOptions) => {
  console.log('synced');
});

sequelize.query('SELECT * FROM `test`', {
  type: QueryTypes.SELECT
})
.then(rows => {
  rows.forEach(row => {
    console.log(row);
  });
});
