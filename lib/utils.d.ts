// import * as LoDash from 'lodash';
//
// export interface SequelizeLoDash extends LoDash.LoDashStatic {
//   camelizeIf(str: string, condition: boolean): string;
//   underscoredIf(str: string, condition: boolean): string;
//   /**
//    * * Returns an array with some falsy values removed. The values null, "", undefined and NaN are considered
//    * falsey.
//    *
//    * @param arr Array to compact.
//    */
//   compactLite<T>(arr: Array<T>): Array<T>;
//   matchesDots(dots: string | Array<string>, value: Object): (item: Object) => boolean;
// }
// export const _: SequelizeLoDash;

// import inflection = require('inflection');
// export const inflection: typeof inflection;

import parameterValidator = require('./utils/parameter-validator');

export type Primitive = 'string'|'number'|'boolean';

export function camelizeIf(string: string, condition?: boolean): string;
export function underscoredIf(string: string, condition?: boolean): string;
export function isPrimitive(val: any): val is Primitive;

/** Same concept as _.merge, but don't overwrite properties that have already been assigned */
export function mergeDefaults(a: any, b: any): any;
export function lowercaseFirst(s: string): string;
export function uppercaseFirst(s: string): string;
export function spliceStr(str: string, index: number, count: number, add: string): string;
export function camelize(str: string): string;
export function format(arr: any[], dialect: string): string;
export function formatNamedParameters(sql: string, parameters: any, dialect: string): string;
export function cloneDeep<T>(obj: T, fn?: Function): T;

/** Expand and normalize finder options */
export function mapFinderOptions(options, Model): any;

/* Used to map field names in attributes and where conditions */
export function mapOptionFieldNames(options, Model): any;

export function mapWhereFieldNames(attributes, Model): any;
/** Used to map field names in values */
export function mapValueFieldNames(dataValues, fields, Model): any;

export function isColString(value: string): boolean;
export function argsArePrimaryKeys(args, primaryKeys): boolean;
export function canTreatArrayAsAnd(arr: any[]): boolean;
export function combineTableNames(tableName1: string, tableName2: string): string;

export function singularize(s: string): string;
export function pluralize(s: string): string;

export function removeCommentsFromFunctionString(s: string): string;
export function toDefaultValue(value: any): any;


/**
 * Determine if the default value provided exists and can be described
 * in a db schema using the DEFAULT directive.
 *
 * @param  {*} value Any default value.
 * @return {boolean} yes / no.
 */
export function defaultValueSchemable(value: any): boolean;

export function defaultValueSchemable(hash, omitNull, options): any;
export function inherit(SubClass, SuperClass): any;
export function stack(): string;
export function sliceArgs(args, begin): any[];
export function now(dialect: string): Date;
export function tick(func: Function): void;

// Note: Use the `quoteIdentifier()` and `escape()` methods on the
// `QueryInterface` instead for more portable code.
export const TICK_CHAR: '`';
export function addTicks(s: string, tickChar?: string): string;
export function removeTicks(s: string, tickChar?: string): string;

/*
 * Utility functions for representing SQL functions, and columns that should be escaped.
 * Please do not use these functions directly, use Sequelize.fn and Sequelize.col instead.
 */
export class fn {
  constructor(fn, args);
  _isSequelizeMethod: boolean;

  clone(): this;
}
export class col {
  constructor(col);
  _isSequelizeMethod: boolean;
}
export class cast {
  constructor(val, type?: string);
  _isSequelizeMethod: boolean;
}
export class literal {
  constructor(val);
  _isSequelizeMethod: boolean;
}
export class json {
  constructor(conditionsOrPath, value);
  _isSequelizeMethod: boolean;
}
export class where {
  constructor(attribute, comparator, logic?);
  _isSequelizeMethod: boolean;
}

export const validateParameter: typeof parameterValidator;
export function formatReferences(obj): any;

import Promise = require('./promise');
export {Promise};
