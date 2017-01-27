import {Errors, Validator, QueryTypes, DataTypes, Connection, Sequelize, Instance, Model} from 'sequelize';

const sequelize = new Sequelize('str');

var s: Connection;
var e: typeof Errors;

var v: Validator;
var qt: QueryTypes;
var dt: typeof DataTypes;
// var dt: typeof Sequelize.DataTypes; // Should give an error. It's not a value but an interface.

var i: typeof Instance;

interface SomethingInstance extends Instance {
  id: number;
  username: string;
}

const Something = sequelize.define<Model<SomethingInstance>, SomethingInstance>('', { username: DataTypes.TEXT });
const User = sequelize.define<Model<SomethingInstance>, SomethingInstance>('', {});
const Company = sequelize.define<Model<SomethingInstance>, SomethingInstance>('', {});

Something.findOne({
  order: [
    // Will escape username and validate DESC against a list of valid direction parameters
    ['username', 'DESC'],

    // Will order by max(age)
    sequelize.fn('max', sequelize.col('age')),

    // Will order by max(age) DESC
    [sequelize.fn('max', sequelize.col('age')), 'DESC'],

    // Will order by  otherfunction(`col1`, 12, 'lalala') DESC
    [sequelize.fn('otherfunction', sequelize.col('col1'), 12, 'lalala'), 'DESC'],

    // Will order by name on an associated User
    [User, 'name', 'DESC'],

    // Will order by name on an associated User aliased as Friend
    [{model: User, as: 'Friend'}, 'name', 'DESC'],

    // Will order by name on a nested associated Company of an associated User
    [User, Company, 'name', 'DESC']
  ]
})

Something.findOne({
  order: 'convert(user_name using gbk)'
})

Something.findOne({
  order: 'username DESC'
})

Something.findOne({
  order: sequelize.literal('convert(user_name using gbk)')
})

Something.findAll({
    include: [{
        model: User,
        where: { state: Sequelize.col('project.state') },
        limit: 1,
        separate: true,
        order: [['id', 'DESC']]
    }]
})

Something.findAndCountAll({
  distinct: true
})
