import { Transaction } from './transaction';
import { WhereOptions, FindAttributeOptions } from './model';

export interface Logging {
  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;
}

export interface Transactionable {
  /**
   * Transaction to run query under
   */
  transaction?: Transaction;
}

export interface SearchPathable {
  /**
   * An optional parameter to specify the schema search_path (Postgres only)
   */
  searchPath?: string;
}

export interface Filterable {
  /**
   * Attribute has to be matched for rows to be selected for the given action.
   */
  where?: WhereOptions;
}

export interface Projectable {
  /**
   * A list of the attributes that you want to select. To rename an attribute, you can pass an array, with
   * two elements - the first is the name of the attribute in the DB (or some kind of expression such as
   * `Sequelize.literal`, `Sequelize.fn` and so on), and the second is the name you want the attribute to
   * have in the returned instance
   */
  attributes?: FindAttributeOptions;
}

export interface Paranoid {
    /**
   * If true, only non-deleted records will be returned. If false, both deleted and non-deleted records will
   * be returned. Only applies if `options.paranoid` is true for the model.
   */
  paranoid?: boolean;
}
