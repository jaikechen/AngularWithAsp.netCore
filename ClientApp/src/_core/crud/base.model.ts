export type ModelProto = BaseModel | (new () => BaseModel)
export type TypeProto<T> = T | (new() => T)
export const createModel = (item) => item && {}.toString.call(item) === '[object Function]'?new item():item

export type ModelName = string | BaseModel
export const getModelName = (item) =>  item.constructor.name == "String" ? item: item.constructor.name;

export class BaseModel {
  id: number;
  status: string;
}

