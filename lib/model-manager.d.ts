import { Model } from './model'
import { Sequelize } from './sequelize'

export class ModelManager {
    sequelize: Sequelize
    models: Array<typeof Model>
    all: Array<typeof Model>

    constructor(sequelize: Sequelize)
    addModel<T extends typeof Model>(model: T): T
    removeModel(model: typeof Model): void
    getModel(against: any, options?: { attribute?: string }): typeof Model

    /**
     * Iterate over Models in an order suitable for e.g. creating tables. Will
     * take foreign key constraints into account so that dependencies are visited
     * before dependents.
     */
    forEachModel(iterator: (model: typeof Model, name: string) => any, options?: { reverse?: boolean }): void
}

export default ModelManager
