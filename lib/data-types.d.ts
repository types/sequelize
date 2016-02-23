/**
 * A convenience class holding commonly used data types. The datatypes are used when defining a new model using `Sequelize.define`, like this:
 * ```js
 * sequelize.define('model', {
 *   column: DataTypes.INTEGER
 * })
 * ```
 * When defining a model you can just as easily pass a string as type, but often using the types defined here is beneficial. For example, using `DataTypes.BLOB`, mean
 * that that column will be returned as an instance of `Buffer` when being fetched by sequelize.
 *
 * Some data types have special properties that can be accessed in order to change the data type.
 * For example, to get an unsigned integer with zerofill you can do `DataTypes.INTEGER.UNSIGNED.ZEROFILL`.
 * The order you access the properties in do not matter, so `DataTypes.INTEGER.ZEROFILL.UNSIGNED` is fine as well. The available properties are listed under each data type.
 *
 * To provide a length for the data type, you can invoke it like a function: `INTEGER(2)`
 *
 * Three of the values provided here (`NOW`, `UUIDV1` and `UUIDV4`) are special default values, that should not be used to define types. Instead they are used as shorthands for
 * defining default values. For example, to get a uuid field with a default value generated following v1 of the UUID standard:
 * ```js
 * sequelize.define('model', {
 *   uuid: {
 *     type: DataTypes.UUID,
 *     defaultValue: DataTypes.UUIDV1,
 *     primaryKey: true
 *   }
 * })
 * ```
 * There may be times when you want to generate your own UUID conforming to some other algorithm. This is accomplised
 * using the defaultValue property as well, but instead of specifying one of the supplied UUID types, you return a value
 * from a function.
 * ```js
 * sequelize.define('model', {
 *   uuid: {
 *     type: DataTypes.UUID,
 *     defaultValue: function() {
 *       return generateMyId()
 *     },
 *     primaryKey: true
 *   }
 * })
 * ```
 *
 * @class DataTypes
 */
export class ABSTRACT {
  constructor(options);

  key: string;
  static key: string;

  dialectTypes: string;
  toSql(): string;
  stringify(value, options?): string;
  toString(options): string;

  static warn(link: string, text: string): void;
  static inherits(Constructor: Function): Function;
}

/**
 * A variable length string. Default length 255
 *
 * Available properties: `BINARY`
 *
 * @property STRING
 */
export class STRING extends ABSTRACT {
  constructor(length?: number, binary?: boolean);
  constructor(options?: STRING_Options);

  options: STRING_Options;

  private _binary: boolean;
  private _length: boolean;

  BINARY: this;

  validate(value: any): boolean;
}
export interface STRING_Options {
  length?: number;
  binary?: boolean;
}

/**
 * A fixed length string. Default length 255
 *
 * Available properties: `BINARY`
 *
 * @property CHAR
 */
export class CHAR extends STRING {
  BINARY: this;
}

/**
 * An (un)limited length text column. Available lengths: `tiny`, `medium`, `long`
 * @property TEXT
 */
export class TEXT extends ABSTRACT {
  constructor(length?: number);
  constructor(options?: TEXT_Options);
  options: TEXT_Options;

  private _length: boolean;

  validate(value: any): boolean;
}
export interface TEXT_Options {
 length?: number;
}

export class NUMBER extends ABSTRACT {
  constructor(options?: NUMBER_Options);
  options: NUMBER_Options;

  private _length: boolean;

  validate(value: any): boolean;

  UNSIGNED: this;
  ZEROFILL: this;
}
export interface NUMBER_Options {
  length?: number;
  zerofill?: boolean;
  decimals?: number;
  precision?: number;
  scale?: number;
  unsigned?: boolean;
}

/**
 * A 32 bit integer.
 *
 * Available properties: `UNSIGNED`, `ZEROFILL`
 *
 * @property INTEGER
 */
export class INTEGER extends NUMBER {
  constructor(options?: NUMBER_Options);
  options: NUMBER_Options;
}
export interface INTEGER_Options {
  length?: number;
}

/**
 * A 64 bit integer.
 *
 * Available properties: `UNSIGNED`, `ZEROFILL`
 *
 * @property BIGINT
 */
export class BIGINT extends NUMBER {
  constructor(options?: BIGINT_Options);
  options: BIGINT_Options;
}
export interface BIGINT_Options {
  length?: number;
}

/**
 * Floating point number (4-byte precision). Accepts one or two arguments for precision
 *
 * Available properties: `UNSIGNED`, `ZEROFILL`
 *
 * @property FLOAT
 */
 export class FLOAT extends NUMBER {
   constructor(length?: number, decimals?: number);
   constructor(options?: FLOAT_Options);
   options: FLOAT_Options;
 }
 export interface FLOAT_Options {
   length?: number;
   decimals?: number;
 }


 /**
  * Floating point number (4-byte precision). Accepts one or two arguments for precision
  *
  * Available properties: `UNSIGNED`, `ZEROFILL`
  *
  * @property REAL
  */
export class REAL extends NUMBER {
  constructor(length?: number, decimals?: number);
  constructor(options?: REAL_Options);
  options: REAL_Options;
}
export interface REAL_Options {
  length?: number;
  decimals?: number;
}


/**
 * Floating point number (8-byte precision). Accepts one or two arguments for precision
 *
 * Available properties: `UNSIGNED`, `ZEROFILL`
 *
 * @property DOUBLE
 */
export class DOUBLE extends NUMBER {
  constructor(length?: number, decimals?: number);
  constructor(options?: DOUBLE_Options);
  options: DOUBLE_Options;
}
export interface DOUBLE_Options {
  length?: number;
  decimals?: number;
}

/**
 * Decimal number. Accepts one or two arguments for precision
 *
 * Available properties: `UNSIGNED`, `ZEROFILL`
 *
 * @property DECIMAL
 */
export class DECIMAL extends NUMBER {
  constructor(precision?: number, scale?: number);
  constructor(options?: DECIMAL_Options);

  options: DECIMAL_Options;

  PRECISION: this;
  SCALE: this;
}
export interface DECIMAL_Options {
  precision?: number;
  scale?: number;
}

/**
 * A boolean / tinyint column, depending on dialect
 * @property BOOLEAN
 */
export class BOOLEAN extends ABSTRACT {}

/**
 * A time column
 * @property TIME
 */
export class TIME extends ABSTRACT {}

/**
 * A datetime column
 * @property DATE
 */
export class DATE extends ABSTRACT {
  constructor(length?: number);
  constructor(options?: DATE_Options);
  options: DATE_Options;

  $applyTimezone (date, options: {timezone?: string | number}): Object; // Moment;
  $stringify (date, options: {timezone?: string | number}): string;
}
export interface DATE_Options {
  length: number;
}

/**
 * A date only column
 * @property DATEONLY
 */
export class DATEONLY extends ABSTRACT {}

/**
 * A key / value column. Only available in postgres.
 * @property HSTORE
 */
export class HSTORE extends ABSTRACT {}

/**
 * A JSON string column. Only available in postgres.
 * @property JSON
 */
export class JSON extends ABSTRACT {}

/**
 * A pre-processed JSON data column. Only available in postgres.
 * @property JSONB
 */
export class JSONB extends JSON {}

/**
 * A default value of the current timestamp
 * @property NOW
 */
export class NOW extends ABSTRACT {}

/**
 * Binary storage. Available lengths: `tiny`, `medium`, `long`
 *
 * @property BLOB
 */
export class BLOB extends ABSTRACT {
  constructor(length?: number);
  constructor(options?: BLOB_Options);
}
export interface BLOB_Options {
  length: number;

  escape: boolean;
  $stringify(value: any): string;
  $hexify(hext): string;
}

/**
 * Range types are data types representing a range of values of some element type (called the range's subtype).
 * Only available in postgres.
 * See {@link http://www.postgresql.org/docs/9.4/static/rangetypes.html|Postgres documentation} for more details
 * @property RANGE
 */
export class RANGE<T> extends ABSTRACT {
  constructor(subtype: new () => T);
  constructor(options: RANGE_Options<T>);
  _subtype: new () => T;
  options: RANGE_Options<T>;
}
export interface RANGE_Options<T> {
  subtype: new () => T;
}

/**
 * A column storing a unique universal identifier. Use with `UUIDV1` or `UUIDV4` for default values.
 * @property UUID
 */
export class UUID extends ABSTRACT {}

/**
 * A default unique universal identifier generated following the UUID v1 standard
 * @property UUIDV1
 */
export class UUIDV1 extends ABSTRACT {}

/**
 * A default unique universal identifier generated following the UUID v4 standard
 * @property UUIDV4
 */
export class UUIDV4 extends ABSTRACT {}

/**
 * A virtual value that is not stored in the DB. This could for example be useful if you want to provide a default value in your model that is returned to the user but not stored in the DB.
 *
 * You could also use it to validate a value before permuting and storing it. Checking password length before hashing it for example:
 * ```js
 * sequelize.define('user', {
 *   password_hash: DataTypes.STRING,
 *   password: {
 *     type: DataTypes.VIRTUAL,
 *     set: function (val) {
 *        this.setDataValue('password', val); // Remember to set the data value, otherwise it won't be validated
 *        this.setDataValue('password_hash', this.salt + val);
 *      },
 *      validate: {
 *         isLongEnough: function (val) {
 *           if (val.length < 7) {
 *             throw new Error("Please choose a longer password")
 *          }
 *       }
 *     }
 *   }
 * })
 * ```
 *
 * VIRTUAL also takes a return type and dependency fields as arguments
 * If a virtual attribute is present in `attributes` it will automatically pull in the extra fields as well.
 * Return type is mostly useful for setups that rely on types like GraphQL.
 * ```js
 * {
 *   active: {
 *     type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['createdAt']),
 *     get: function() {
 *       return this.get('createdAt') > Date.now() - (7 * 24 * 60 * 60 * 1000)
 *     }
 *   }
 * }
 * ```
 *
 * In the above code the password is stored plainly in the password field so it can be validated, but is never stored in the DB.
 * @property VIRTUAL
 * @alias NONE
 */
export class VIRTUAL<T, F> extends ABSTRACT {
  constructor(ReturnType: new () => T, fields: F);
  returnType: new () => T;
  fields: F
}

/**
 * An enumeration. `DataTypes.ENUM('value', 'another value')`.
 *
 * @property ENUM
 */
export class ENUM extends ABSTRACT{
  constructor(...values: string[]);
  constructor(options: ENUM_Options);
  values: string[];
  options: ENUM_Options;
}
export interface ENUM_Options {
  values: string[];
}

/**
 * An array of `type`, e.g. `DataTypes.ARRAY(DataTypes.DECIMAL)`. Only available in postgres.
 * @property ARRAY
 */
export class ARRAY<T extends new () => ABSTRACT> extends ABSTRACT {
  constructor(type: T);
  constructor(options: ARRAY_Options<T>);

  options: ARRAY_Options<T>;

  static is<C>(obj: any, type: C): obj is ARRAY<C>;
}
export interface ARRAY_Options<T> {
  type: T;
}

/**
 * A geometry datatype represents two dimensional spacial objects.
 * @property GEOMETRY
 */
export class GEOMETRY extends ABSTRACT {
  constructor(type, srid);
  constructor(options: GEOMETRY_Options);

  options: GEOMETRY_Options;
  type: any;
  srid: any;

  escape: boolean;
  $stringify(value: any): string;
}
export interface GEOMETRY_Options {
  type: any;
  srid: any;
}

/**
 * A geography datatype represents two dimensional spacial objects in an elliptic coord system.
 * @property GEOGRAPHY
 */
export class GEOGRAPHY extends ABSTRACT {
  construcor(type, srid);
  construcor(options: GEOGRAPHY_Options);

  options: GEOGRAPHY_Options

  type: any;
  srid: any;

  escape: boolean;
  $stringify(value: any): string;
}
export interface GEOGRAPHY_Options {
  type: any;
  srid: any;
}

export const NONE: typeof VIRTUAL;
// export ['DOUBLE PRECISION']: typeof DOUBLE;

export interface DataTypes {
  ABSTRACT: typeof ABSTRACT;
  STRING: typeof STRING;
  CHAR: typeof CHAR;
  TEXT: typeof TEXT;
  NUMBER: typeof NUMBER;
  INTEGER: typeof INTEGER;
  BIGINT: typeof BIGINT;
  FLOAT: typeof FLOAT;
  REAL: typeof REAL;
  DOUBLE: typeof DOUBLE;
  DECIMAL: typeof DECIMAL;
  BOOLEAN: typeof BOOLEAN;
  TIME: typeof TIME;
  DATE: typeof DATE;
  DATEONLY: typeof DATEONLY;
  HSTORE: typeof HSTORE;
  JSON: typeof JSON;
  JSONB: typeof JSONB;
  NOW: typeof NOW;
  BLOB: typeof BLOB;
  RANGE: typeof RANGE;
  UUID: typeof UUID;
  UUIDV1: typeof UUIDV1;
  UUIDV4: typeof UUIDV4;
  VIRTUAL: typeof VIRTUAL;
  ENUM: typeof ENUM;
  ARRAY: typeof ARRAY;
  GEOMETRY: typeof GEOMETRY;
  GEOGRAPHY: typeof GEOGRAPHY;
  'DOUBLE PRECISION': typeof DOUBLE;
}
