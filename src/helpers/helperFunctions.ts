export function findById(id: any, filters: any, func: any) {
  return func({...filters, where: {id}});
}
export function deleteById(id: any, func: any) {
  return func({ where: {id}});
}
export function patchById(id: any, data: any, func: any) {
  return func(data, {id});
}
