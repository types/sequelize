import {
    BelongsTo,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    FindOptions,
    Model,
} from 'sequelize'
import { sequelize } from '../connection'

export class User extends Model {
    public static associations: {
        group: BelongsTo
    }

    public id: number
    public username: string
    public firstName: string
    public lastName: string
    public createdAt: Date
    public updatedAt: Date

    // mixins for association (optional)
    public groupId: number
    public group: UserGroup
    public getGroup: BelongsToGetAssociationMixin<UserGroup>
    public setGroup: BelongsToSetAssociationMixin<UserGroup, number>
    public createGroup: BelongsToCreateAssociationMixin<UserGroup>
}

User.init(
    {
        username: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
    },
    { sequelize }
)

// Hooks
User.afterFind((users, options: FindOptions) => {
    console.log('found')
})

// associate
// it is important to import _after_ the model above is already exported so the circular reference works.
import { UserGroup } from './UserGroup'
export const Group = User.belongsTo(UserGroup, { as: 'group', foreignKey: 'groupId' })
