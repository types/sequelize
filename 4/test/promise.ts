import {Promise} from 'sequelize';

let promise: Promise<number>;
promise
  .then((arg: number) => ({}))
  .then((a: {}) => void 0);

promise = new Promise<number>(() => {});
