import * as Bluebird from 'bluebird'

export const Promise: typeof Bluebird
export type Promise<T> = Bluebird<T>
export default Promise
