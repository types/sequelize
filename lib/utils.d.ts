import parameterValidator = require('./utils/parameter-validator')

export type Primitive = 'string' | 'number' | 'boolean'

export function useInflection(inflection: any): void

export function camelizeIf(string: string, condition?: boolean): string
export function underscoredIf(string: string, condition?: boolean): string
export function isPrimitive(val: any): val is Primitive

/** Same concept as _.merge, but don't overwrite properties that have already been assigned */
export function mergeDefaults(a: any, b: any): any
export function lowercaseFirst(s: string): string
export function uppercaseFirst(s: string): string
export function spliceStr(str: string, index: number, count: number, add: string): string
export function camelize(str: string): string
export function format(arr: any[], dialect: string): string
export function formatNamedParameters(sql: string, parameters: any, dialect: string): string
export function cloneDeep<T>(obj: T, fn?: Function): T

/** Expand and normalize finder options */
export function mapFinderOptions(options: any, Model: any): any

/* Used to map field names in attributes and where conditions */
export function mapOptionFieldNames(options: any, Model: any): any

export function mapWhereFieldNames(attributes: any, Model: any): any
/** Used to map field names in values */
export function mapValueFieldNames(dataValues: any, fields: any, Model: any): any

export function isColString(value: string): boolean
export function argsArePrimaryKeys(args: any, primaryKeys: any): boolean
export function canTreatArrayAsAnd(arr: any[]): boolean
export function combineTableNames(tableName1: string, tableName2: string): string

export function singularize(s: string): string
export function pluralize(s: string): string

export function removeCommentsFromFunctionString(s: string): string
export function toDefaultValue(value: any): any

/**
 * Determine if the default value provided exists and can be described
 * in a db schema using the DEFAULT directive.
 *
 * @param value Any default value.
 */
export function defaultValueSchemable(value: any): boolean

export function defaultValueSchemable(hash: any, omitNull: any, options: any): any
export function inherit(SubClass: any, SuperClass: any): any
export function stack(): string
export function sliceArgs(args: any, begin: any): any[]
export function now(dialect: string): Date
export function tick(func: Function): void

// Note: Use the `quoteIdentifier()` and `escape()` methods on the
// `QueryInterface` instead for more portable code.
export const TICK_CHAR: string
export function addTicks(s: string, tickChar?: string): string
export function removeTicks(s: string, tickChar?: string): string

/*
 * Utility functions for representing SQL functions, and columns that should be escaped.
 * Please do not use these functions directly, use Sequelize.fn and Sequelize.col instead.
 */
export class Fn {
    private _isSequelizeMethod: boolean
    constructor(fn: any, args: any)
    public clone(): this
}

export class Col {
    public col: string
    private _isSequelizeMethod: boolean
    constructor(col: string)
}

export class Cast {
    public val: any
    public type: string
    private _isSequelizeMethod: boolean
    constructor(val: any, type?: string)
}

export class Literal {
    public val: any
    private _isSequelizeMethod: boolean
    constructor(val: any)
}

export class Json {
    public conditions: object
    public path: string
    public value: string | number | boolean
    private _isSequelizeMethod: boolean
    constructor(conditionsOrPath: string | object, value?: string | number | boolean)
}

export class Where {
    public attribute: object
    public comparator: string
    public logic: string | object
    private _isSequelizeMethod: boolean
    constructor(attr: object, comparator: string, logic: string | object)
    constructor(attr: object, logic: string | object)
}

export const validateParameter: typeof parameterValidator
export function formatReferences(obj: any): any

export { Promise } from './promise'
