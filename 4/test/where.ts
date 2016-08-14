
import {Model, Sequelize, WhereOptions, WhereOperators} from 'sequelize';

class MyModel extends Model { }

let where: WhereOptions;

// From http://docs.sequelizejs.com/en/v4/docs/querying/

// Operators

let operators: WhereOperators = {
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

// Combinations

where = {
  rank: {
    $or: {
      $lt: 1000,
      $eq: null
    }
  }
};
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
MyModel.findAll({
  include: [{
    model: MyModel,
    where: { state: Sequelize.col('project.state') }
  }]
});

MyModel.find({
  where,
  include: [
    {
      model: MyModel,
      where,
      include: [
        { model: MyModel, where }
      ]
    }
  ]
});
MyModel.destroy({ where });
MyModel.update({ hi: 1 }, { where });

// From http://docs.sequelizejs.com/en/v4/docs/models-usage/

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
