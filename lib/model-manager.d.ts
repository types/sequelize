import { Model } from './model'
import { Sequelize } from './sequelize'

export class ModelManager {
    public sequelize: Sequelize
    public models: typeof Model[]
    public all: typeof Model[]

    constructor(sequelize: Sequelize)
    public addModel<T extends typeof Model>(model: T): T
    public removeModel(model: typeof Model): void
    public getModel(against: any, options?: { attribute?: string }): typeof Model

    /**
     * Iterate over Models in an order suitable for e.g. creating tables. Will
     * take foreign key constraints into account so that dependencies are visited
     * before dependents.
     */
    public forEachModel(iterator: (model: typeof Model, name: string) => any, options?: { reverse?: boolean }): void
}

export default ModelManager
