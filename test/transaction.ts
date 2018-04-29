import { Deferrable, Sequelize, Transaction } from 'sequelize'
import { User } from './models/User'

export const sequelize = new Sequelize('uri')

sequelize.transaction(async transaction => {
    transaction.afterCommit(() => console.log('transaction complete'))
    User.create(
        {
            data: 123,
        },
        {
            transaction,
        }
    )
})

async function transact() {
    const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        deferrable: Deferrable.SET_DEFERRED(['test']),
        type: Transaction.TYPES.DEFERRED,
    })
    await t.commit()
    await t.rollback()
}

transact()
