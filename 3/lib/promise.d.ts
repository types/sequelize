import * as Bluebird from 'bluebird';

/**
 * A slightly modified version of bluebird promises. This means that, on top of the methods below, you can also call all the methods listed on the link below.
 *
 * The main difference is that sequelize promises allows you to attach a listener that will be called with the generated SQL, each time a query is run.
 *
 * The sequelize promise class works seamlessly with other A+/thenable libraries, with one exception.
 * If you want to propagate SQL events across then, all calls etc., you must use sequelize promises exclusively.
 */
declare class SequelizePromise<T> extends Bluebird<T> {
  sql(fct: (sql: string) => void): void;
}

export = SequelizePromise;
