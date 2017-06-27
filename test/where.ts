
import * as Sequelize from 'sequelize';

let Model: Sequelize.Model<any, any>;

let where: Sequelize.WhereOptions;

// From http://docs.sequelizejs.com/en/v3/docs/querying/

// Operators

let operators: Sequelize.WhereOperators = {
  $and: { a: 5 },                 // AND (a = 5)
  $or: [{ a: 5 }, { a: 6 }],      // (a = 5 OR a = 6)
  $gt: 6,                         // > 6
  $gte: 6,                        // >= 6
  $lt: 10,                        // < 10
  $lte: 10,                       // <= 10
  $ne: 20,                        // != 20
  $not: true,                     // IS NOT TRUE
  $between: [6, 10],              // BETWEEN 6 AND 10
  $notBetween: [11, 15],          // NOT BETWEEN 11 AND 15
  $in: [1, 2],                    // IN [1, 2]
  $notIn: [1, 2],                 // NOT IN [1, 2]
  $like: '%hat',                  // LIKE '%hat'
  $notLike: '%hat',               // NOT LIKE '%hat'
  $iLike: '%hat',                 // ILIKE '%hat' (case insensitive) (PG only)
  $notILike: '%hat',              // NOT ILIKE '%hat'  (PG only)
  $overlap: [1, 2],               // && [1, 2] (PG array overlap operator)
  $contains: [1, 2],              // @> [1, 2] (PG array contains operator)
  $contained: [1, 2],             // <@ [1, 2] (PG array contained by operator)
  $any: [2, 3]                    // ANY ARRAY[2, 3]::INTEGER (PG only)
};

operators = {
  $like: { $any: ['cat', 'hat'] } // LIKE ANY ARRAY['cat', 'hat'] - also works for iLike and notLike
};

where = Sequelize.and();

where = Sequelize.or();

where = {$and: []};

where = {
  rank: Sequelize.and({$lt: 1000}, {$eq: null})
};

where = {
  rank: Sequelize.or({$lt: 1000}, {$eq: null})
};

// Combinations
// rank < 1000 OR rank IS NULL

where = {
  createdAt: {
    $lt: new Date(),
    $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
};
// createdAt < [timestamp] AND createdAt > [timestamp]

where = {
  $or: [
    {
      title: {
        $like: 'Boat%'
      }
    },
    {
      description: {
        $like: '%boat%'
      }
    }
  ]
};
// title LIKE 'Boat%' OR description LIKE '%boat%'

// Containment

where = {
  'meta': {
    $contains: {
      site: {
        url: 'http://google.com'
      }
    }
  }
};

// Relations / Associations
// Find all projects with a least one task where task.state === project.task
Model.findAll({
    include: [{
        model: Model,
        where: { state: Sequelize.col('project.state') }
    }]
});

Model.find({
  where,
  include: [
    {
      model: Model,
      where,
      include: [
        { model: Model, where }
      ]
    }
  ]
});
Model.destroy({ where });
Model.update({ hi: 1 }, { where });

// From http://docs.sequelizejs.com/en/v3/docs/models-usage/


// find multiple entries
Model.findAll().then(function(projects) {
  // projects will be an array of all Model instances
});

// also possible:
Model.all().then(function(projects) {
  // projects will be an array of all Model instances
});

// search for specific attributes - hash usage
Model.findAll({ where: { name: 'A Model', enabled: true } }).then(function(projects) {
  // projects will be an array of Model instances with the specified name
});

// search with string replacements
Model.findAll({ where: ['id > ?', 25] }).then(function(projects) {
  // projects will be an array of Models having a greater id than 25
});

// search within a specific range
Model.findAll({ where: { id: [1,2,3] } }).then(function(projects) {
  // projects will be an array of Models having the id 1, 2 or 3
  // this is actually doing an IN query
});

Model.findAll({
  where: {
    id: <Sequelize.WhereOperators>{ // casting here to check a missing operator is not accepted as field name
      $and: {a: 5},          // AND (a = 5)
      $or: [{a: 5}, {a: 6}], // (a = 5 OR a = 6)
      $gt: 6,                // id > 6
      $gte: 6,               // id >= 6
      $lt: 10,               // id < 10
      $lte: 10,              // id <= 10
      $ne: 20,               // id != 20
      $between: [6, 10],     // BETWEEN 6 AND 10
      $notBetween: [11, 15], // NOT BETWEEN 11 AND 15
      $in: [1, 2],           // IN [1, 2]
      $notIn: [1, 2],        // NOT IN [1, 2]
      $like: '%hat',         // LIKE '%hat'
      $notLike: '%hat',      // NOT LIKE '%hat'
      $iLike: '%hat',        // ILIKE '%hat' (case insensitive)  (PG only)
      $notILike: '%hat',     // NOT ILIKE '%hat'  (PG only)
      $overlap: [1, 2],      // && [1, 2] (PG array overlap operator)
      $contains: [1, 2],     // @> [1, 2] (PG array contains operator)
      $contained: [1, 2],    // <@ [1, 2] (PG array contained by operator)
      $any: [2, 3]           // ANY ARRAY[2, 3]::INTEGER (PG only)
    },
    status: {
      $not: false            // status NOT FALSE
    }
  }
});

// Complex filtering / NOT queries

where = {
  name: 'a project',
  $or: [
    { id: [1, 2, 3] },
    { id: { $gt: 10 } }
  ]
};

where = {
  name: 'a project',
  id: {
    $or: [
      [1, 2, 3],
      { $gt: 10 }
    ]
  }
};

// $not example:
where = {
  name: 'a project',
  $not: [
    { id: [1, 2, 3] },
    { array: { $contains: [3, 4, 5] } }
  ]
};

// JSONB

// Nested object

where = {
  meta: {
    video: {
      url: {
        $ne: null
      }
    }
  }
};

// Nested key
where = {
  'meta.audio.length': {
    $gt: 20
  }
};
