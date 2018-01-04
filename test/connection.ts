import { QueryTypes, Sequelize, SyncOptions } from 'sequelize'

export const sequelize = new Sequelize('uri')

sequelize.afterBulkSync((options: SyncOptions) => {
    console.log('synced')
})

sequelize
    .query('SELECT * FROM `test`', {
        type: QueryTypes.SELECT,
    })
    .then((rows: any[]) => {
        rows.forEach(row => {
            console.log(row)
        })
    })
