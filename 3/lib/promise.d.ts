import * as Bluebird from 'bluebird';

declare const Promise: typeof Bluebird;
declare type Promise<T> = Bluebird<T>;
export = Promise;
