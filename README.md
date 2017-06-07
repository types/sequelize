
# TypeScript Typings for [Sequelize v3](https://sequelize.readthedocs.io/en/v3/)

[![Build Status](https://travis-ci.org/types/npm-sequelize.svg?branch=v3)](https://travis-ci.org/types/npm-sequelize)

## Usage

First, install:
```bash
typings install --save sequelize@3
```

or

```bash
npm install --save-dev types/npm-sequelize#<commit hash>
```

To create a model:

```ts
/** models/thing.ts */
import * as Sequelize from 'sequelize';
import sequelize from '../connection'; // A Sequelize instance

interface Thing { // interface used to create/update an instance
  id?: number;
  name?: string;
}
interface ThingInstance extends Sequelize.Instance<ThingInstance, Thing> { // an instance
  id: number;

  // you should add all instance methods here
  doSomething(): any;
}
const Thing = sequelize.define<ThingInstance, Thing>('thing', {
  name: Sequelize.STRING,
}, {
  instanceMethods: {
    doSomething() {
      // whatever...
    }
  },
});

export default Thing;
export {ThingInstance};

```
