export function findById(id: any, filters: any, repo: any, obj:any, objId:any) {
  return repo[obj](objId).find({...filters, where: {id}}).then((r: any)=>r[0]);
}
export function deleteById(id: any, filters: any, repo: any, obj:any, objId:any) {
  return repo[obj](objId).delete({...filters, where: {id}});
}
export function patchById(id: any, filters: any, repo: any, obj:any, objId:any, data: any) {
  return repo[obj](objId).patch(data, {...filters, where: {id}}).then((r: any)=>r[0]);
}

export async function findThrough(data: any, filters: any, repoFunc: any){
  let d = await data;
  let dat: any = [];
  for(let i = 0; i < d.length; i++){
    let dd = await repoFunc(d[i].id).find(filters);
    dat = dat.concat(dd);
  }
  return dat;
}

export async function findThroughById(id: any, data: any, filters: any, repoFunc: any){
  let d = await data;
  for(let i = 0; i < d.length; i++){
    let dd = await repoFunc(d[i].id).find({...filters, where: {id}});
    if(dd.length != 0){
      return dd[0];
    }
  }
}

export async function patchThroughById(id: any, data: any, filters: any, repoFunc: any, patchData: any){
  let d = await data;
  for(let i = 0; i < d.length; i++){
    let dd = await repoFunc(d[i].id).patch(patchData, {...filters, where: {id}});
    if(dd.length != 0){
      return dd;
    }
  }
}
export async function deleteThroughById(id: any, data: any, filters: any, repoFunc: any){
  let d = await data;
  for(let i = 0; i < d.length; i++){
    let dd = await repoFunc(d[i].id).delete({...filters, where: {id}});
    if(dd.length != 0){
      return dd;
    }
  }
}
export async function postThrough(data: any, repoFunc: any, postData: any){
  let d = await data;
  for(let i = 0; i < d.length; i++){
    let dd = await repoFunc(d[i].id).create(postData);
    if(dd.length != 0){
      return dd;
    }
  }
}
