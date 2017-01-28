import {Promise} from 'sequelize';
var p: Promise<number>;
p
  .then((arg: number) => ({}))
  .then((a: {}) => void 0);

p = new Promise<number>(() => {});
