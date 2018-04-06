import { DataTypes } from 'sequelize'
import { QueryInterface } from 'sequelize/lib/query-interface'

declare let queryInterface: QueryInterface

queryInterface.createTable(
    'nameOfTheNewTable',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
        attr1: DataTypes.STRING,
        attr2: DataTypes.INTEGER,
        attr3: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        // foreign key usage
        attr4: {
            type: DataTypes.INTEGER,
            references: {
                model: 'another_table_name',
                key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        },
    },
    {
        engine: 'MYISAM', // default: 'InnoDB'
        collate: 'latin1_general_ci',
        charset: 'latin1', // default: null
    }
)

queryInterface.dropTable('nameOfTheExistingTable')

queryInterface.dropAllTables()

queryInterface.renameTable('Person', 'User')

queryInterface.showAllTables().then(tableNames => {
    // do nothing
})

queryInterface.describeTable('Person').then(attributes => {
    /*
    attributes will be something like:

    {
      name: {
        type:         'VARCHAR(255)', // this will be 'CHARACTER VARYING' for pg!
        allowNull:    true,
        defaultValue: null
      },
      isBetaMember: {
        type:         'TINYINT(1)', // this will be 'BOOLEAN' for pg!
        allowNull:    false,
        defaultValue: false
      }
    }
  */
})

queryInterface.addColumn('nameOfAnExistingTable', 'nameOfTheNewAttribute', DataTypes.STRING)

// or

queryInterface.addColumn(
    { tableName: 'nameOfAnExistingTable', schema: 'nameOfSchema' },
    'nameOfTheNewAttribute',
    DataTypes.STRING
)

// or

queryInterface.addColumn('nameOfAnExistingTable', 'nameOfTheNewAttribute', {
    type: DataTypes.STRING,
    allowNull: false,
})

queryInterface.removeColumn('Person', 'signature')

// or

queryInterface.removeColumn({ tableName: 'Person', schema: 'nameOfSchema' }, 'signature')

queryInterface.changeColumn('nameOfAnExistingTable', 'nameOfAnExistingAttribute', {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
})

// or

queryInterface.changeColumn(
    { tableName: 'nameOfAnExistingTable', schema: 'nameOfSchema' },
    'nameOfAnExistingAttribute',
    {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
    }
)

queryInterface.renameColumn('Person', 'signature', 'sig')

// This example will create the index person_firstname_lastname
queryInterface.addIndex('Person', ['firstname', 'lastname'])

// This example will create a unique index with the name SuperDuperIndex using the optional 'options' field.
// Possible options:
// - indicesType: UNIQUE|FULLTEXT|SPATIAL
// - indexName: The name of the index. Default is __
// - parser: For FULLTEXT columns set your parser
// - indexType: Set a type for the index, e.g. BTREE. See the documentation of the used dialect
// - logging: A function that receives the sql query, e.g. console.log
queryInterface.addIndex('Person', ['firstname', 'lastname'], {
    indexName: 'SuperDuperIndex',
    indicesType: 'UNIQUE',
})

queryInterface.removeIndex('Person', 'SuperDuperIndex')

// or

queryInterface.removeIndex('Person', ['firstname', 'lastname'])

queryInterface.addConstraint('Person', ['firstname', 'lastname'], {
    type: 'unique',
    name: 'firstnamexlastname',
})

queryInterface.removeConstraint('Person', 'firstnamexlastname')
