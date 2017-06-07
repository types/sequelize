
// Error === BaseError
import {Error, BaseError, UniqueConstraintError} from 'sequelize';
import {User} from './models/User';

async function test() {
  try {
    await User.create({username: 'john_doe'});
  } catch (e) {
    if (e instanceof UniqueConstraintError) {
      console.error((<UniqueConstraintError>e).sql);
    }
  }
}

