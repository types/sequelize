import * as Sequelize from 'sequelize';

const sequelize = new Sequelize('str');

var s: Sequelize.Connection;
var e: typeof Sequelize.Error;

var v: typeof Sequelize.Validator;
var qt: typeof Sequelize.QueryTypes;
var dt: Sequelize.DataTypes;
// var dt: typeof Sequelize.DataTypes; // Should give an error. It's not a value but an interface.

var i: typeof Sequelize.Instance;

const Something = sequelize.define('', {});
const User = sequelize.define('', {});
const Company = sequelize.define('', {});

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
