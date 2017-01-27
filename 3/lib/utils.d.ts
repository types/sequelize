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
export function cloneDeep<T>(obj: T, fn?: Function): T;

/** Expand and normalize finder options */
export function mapFinderOptions(options: any, Model: any): any;

/* Used to map field names in attributes and where conditions */
export function mapOptionFieldNames(options: any, Model: any): any;

export function mapWhereFieldNames(attributes: any, Model: any): any;
/** Used to map field names in values */
export function mapValueFieldNames(dataValues: any, fields: any, Model: any): any;

export function isColString(value: string): boolean;
export function argsArePrimaryKeys(args: any, primaryKeys: any): boolean;
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

export function defaultValueSchemable(hash: any, omitNull: any, options: any): any;
export function inherit(SubClass: any, SuperClass: any): any;
export function stack(): string;
export function sliceArgs(args: any, begin: any): any[];
export function now(dialect: string): Date;
export function tick(func: Function): void;

// Note: Use the `quoteIdentifier()` and `escape()` methods on the
// `QueryInterface` instead for more portable code.
export const TICK_CHAR: '`';
export function addTicks(s: string, tickChar?: string): string;
export function removeTicks(s: string, tickChar?: string): string;

export type GroupOption = string | fn | col | (string | fn | col)[];

/*
 * Utility functions for representing SQL functions, and columns that should be escaped.
 * Please do not use these functions directly, use Sequelize.fn and Sequelize.col instead.
 */
export class fn {
  constructor(fn: any, args: any);
  _isSequelizeMethod: boolean;

  clone(): this;
}
export class col {
  constructor(col: any);
  _isSequelizeMethod: boolean;
}
export class cast {
  constructor(val: any, type?: string);
  _isSequelizeMethod: boolean;
}
export class literal {
  constructor(val: any);
  _isSequelizeMethod: boolean;
}
export class json {
  constructor(conditionsOrPath: any, value: any);
  _isSequelizeMethod: boolean;
}
export class where {
  constructor(attribute: any, comparator: any, logic?: any);
  _isSequelizeMethod: boolean;
}

export const validateParameter: typeof parameterValidator;
export function formatReferences(obj: any): any;
