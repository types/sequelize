// Type definitions for Sequelize 3.x
// Project: http://sequelizejs.com

import * as interfaces from './interfaces';
import * as DataTypes from './lib/data-types';

declare module sequelize {
  type Promise = typeof interfaces.Promise;
  type Sequelize = interfaces.Static;
  type Connection = interfaces.Connection;
  type Model<TInstance, TAttributes> = interfaces.Model<TInstance, TAttributes>;
}

declare var sequelize: sequelize.Sequelize;
export = sequelize;
