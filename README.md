# Typed Sequelize

[![Join the chat at https://gitter.im/louy/typed-sequelize](https://badges.gitter.im/louy/typed-sequelize.svg)](https://gitter.im/louy/typed-sequelize?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/louy/typed-sequelize.svg?branch=master)](https://travis-ci.org/louy/typed-sequelize)

Typescript Typings for [Sequelize](http://sequelizejs.com).


## Usage

First, install:
```bash
typings install --save sequelize
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
