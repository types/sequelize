import { Config, Sequelize } from 'sequelize'

export const sequelize = new Sequelize('uri')

// hooks

sequelize.beforeCreate('test', () => {
    // noop
})

sequelize
    .addHook('beforeConnect', (config: Config) => {
        // noop
    })
    .addHook('beforeBulkSync', () => {
        // noop
    })

Sequelize.addHook('beforeCreate', () => {
    // noop
}).addHook('beforeBulkCreate', () => {
    // noop
})
