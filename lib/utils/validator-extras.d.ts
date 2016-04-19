import {ValidatorStatic} from 'validator';

//
//  Validator
// ~~~~~~~~~~~
export interface Extensions {
  notEmpty(str: string): boolean;
  len(str: string, min: number, max: number): boolean;
  isUrl(str: string): boolean;
  isIPv6(str: string): boolean;
  isIPv4(str: string): boolean;
  notIn(str: string, values: Array<string>): boolean;
  regex(str: string, pattern: string, modifiers: string): boolean;
  notRegex(str: string, pattern: string, modifiers: string): boolean;
  isDecimal(str: string): boolean;
  min(str: string, val: number): boolean;
  max(str: string, val: number): boolean;
  not(str: string, pattern: string, modifiers: string): boolean;
  contains(str: string, elem: Array<string>): boolean;
  notContains(str: string, elem: Array<string>): boolean;
  is(str: string, pattern: string, modifiers: string): boolean;
}
export const extensions: Extensions;

export interface Validator extends ValidatorStatic, Extensions {
  contains(str: string, elem: Array<string>): boolean;
}
export const validator: Validator;
