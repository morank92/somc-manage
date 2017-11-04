
    const url = "http://localhost:8080/somcSystem/";
    // const url = "http://192.168.7.111:8080/somcSystem/";

    import { Loading } from 'element-ui';

  function sendAjax(surl,asy,sparam,loadFlag){
      let params = JSON.stringify(sparam);
      let promise = new Promise(function (resolve,reject) {
          let loadingInstance = "";
          let s1 = "";
          let s2 = "";
          $.ajax({
              type: "POST",
              url: url+surl,
              dataType: "json",
              contentType: "application/json;charset=utf-8",
              async:asy,
              data:params,
              beforeSend:function () {
                  if(loadFlag!=1){
                      s1 = new Date().getTime();
                      loadingInstance = Loading.service({fullscreen:true,body:true,lock:true,text:"加载中。。。"});
                  }
              },
              success: function (msg) {
                  resolve(msg);
              },
              complete:function(){
                  if(loadFlag!=1){
                      s2 = new Date().getTime()
                      let s = s2-s1;
                      if(s<700){
                          window.setTimeout(function(){
                              loadingInstance.close();
                          },(700-s))
                      }else{
                          loadingInstance.close();
                      }
                  }
              }
          });
      });
      return promise;
    }

    function sendGetAjax(surl,asy,loadFlag){
        let promise = new Promise(function(resolve, reject){
            let loadingInstance = "";
            let s1 = "";
            let s2 = "";
            $.ajax({
                type: "GET",
                url: url+surl,
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                async:asy,
                //timeout:20,
                //headers: {"Request-Uri":"/system/manageLogin","Log-TYPE":"LOGIN","LOG-USER":"admin"},
                beforeSend:function () {
                    if(loadFlag!=1){
                        s1 = new Date().getTime();
                        loadingInstance = Loading.service({fullscreen:true,body:true,lock:true,text:"加载中。。。"});
                    }
                },
                success: function (msg) {
                    resolve(msg);
                },
                complete:function(){
                    if(loadFlag!=1){
                        s2 = new Date().getTime()
                        let s = s2-s1;
                        if(s<700){
                            window.setTimeout(function(){
                                loadingInstance.close();
                            },(700-s))
                        }else{
                            loadingInstance.close();
                        }
                    }
                }
            });
        });
        return promise;
    }


export {sendAjax,sendGetAjax}

