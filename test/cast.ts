import {Model, Instance, Connection} from 'sequelize';

let sequelize: Connection;

interface Thing {
  id?: number;
}
interface ThingInstance extends Instance<ThingInstance, Thing> {
  id: number;
}
let Thing: Model<ThingInstance, Thing> = sequelize.define<ThingInstance, Thing>('thing', {});
Thing = sequelize.model<ThingInstance, Thing>('thing');
