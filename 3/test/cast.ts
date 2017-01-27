import {Model, Instance, Connection} from 'sequelize';

let sequelize: Connection;

interface ThingInstance extends Instance {
  id: number;
}
let Thing: Model<ThingInstance> = sequelize.define<ThingInstance>('thing', {});
Thing = sequelize.model<ThingInstance>('thing');
