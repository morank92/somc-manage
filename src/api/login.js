//import fetch from '@/utils/fetch';


import {sendAjax,sendGetAjax} from '@/utils/ajax_common';

export function login(email, password) {//修改为一个封装了ajax的promise
    let account = {"email":email,"password":password};
    let promise = new Promise(function (resolve,reject) {
        sendAjax("user/login",true,account).then(function (sdata) {
            if(sdata.code=="20000"){
            }else{
            }
            resolve(sdata);
            reject(new Error('Could not load image at '));
        });
    });
    return promise;

  /*return fetch({
    url: '/user/login',
    method: 'post',
    data: {
      email,
      password
    }
  });*/
}

export function getInfo(token) {
    let time = new Date().getTime();
    let promise = new Promise(function (resolve,reject) {
    sendGetAjax("user/info?token=token",true).then(function(json) {
        resolve(json);
      });
    });

    /*let caldata = fetch({
                        url: '/user/info',
                        method: 'get',
                        params: { token }
                    });*/
  return promise;

}

export function logout() {
    let promise = new Promise(function (resolve,reject) {
        resolve("退出");
    });
    return promise;

  /*return fetch({
    url: '/user/logout',
    method: 'post'
  });*/
}



