import { Model, Sequelize } from 'sequelize'

class MyModel extends Model {}

class AssociatedModel extends Model {}

MyModel.findAll({
    include: [
        {
            model: AssociatedModel,
            where: { state: Sequelize.col('project.state') },
            limit: 1,
            separate: true,
            order: [['id', 'DESC']],
        },
    ],
})

MyModel.findAll({
    include: [{ all: true }],
})
