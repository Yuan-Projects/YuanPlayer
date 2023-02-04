// @ts-ignore
export * from '@rainyjune/yuanjs';

export function isArray(vArg: any) {
  if (Array.isArray) {
    return Array.isArray(vArg);
  }
  return Object.prototype.toString.call(vArg) === "[object Array]";
};