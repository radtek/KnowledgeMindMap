// /*初始化字段引用页面需要初始化一下字段*/
// var flowId="<%=flowObj.Text("flowId")%>";//流程
// var flowInstanceId="<%=curFlowInstance.Text("flowInstanceId")%>";//流程实例Id
//var stepId="<%=curStep.Text("stepId") %>";// 步骤
//var instanceName='<%=Url.Encode(instanceName) %>';//实例名
//var grantRemark=$("#grantRemark").val();//转办备注
//var referFieldValue = '<%=referFieldValue%>';//审批对象主键值
//var tableName = '<%=tableName%>';// 审批对象名
//var referFieldName = '<%=referFieldName%>';//审批主键名
//var bootStepId="<%=bootStep.Text("stepId") %>";//发起步骤Id
//var submitUserId="<%=submitUserId%>";//转办后提交人
//var curUserId="<%=curUserId %>";//当前用户Id
 function doAction(actId,jumpStepId)
   {
       var reljumpStepId=0;
       if(typeof(jumpStepId)!="undefined")
       {
        reljumpStepId=jumpStepId;
       }
      
       var content=escape($("#content").val());
      
       $.ajax({
           url: "/Home/DoAction/",
            type: 'post',
            data: {
                flowId:flowId,
                flowInstanceId:flowInstanceId,
                stepId:stepId,
                actId:actId,
                content:content,
                jumpStepId:reljumpStepId
              },
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", data.Message, { infotype: 2 });
                }
                else {
                    $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                     ReloadInstanceInfoDiv();
                    //跳转url:/DesignManage/TaskCIItemManage?listId=[id](导入成功后data.htInfo.listId)
                }
            }
        });
   
   }
   function ForeceCompleteStep()
   {
       var content=$("#content").val();
       $.ajax({
           url: "/Home/ForceCompleteStep/",
            type: 'post',
            data: {
                flowId:flowId,
                flowInstanceId:flowInstanceId,
                stepId:stepId,
                content:content
              },
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", data.Message, { infotype: 2 });
                }
                else {
                    $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                     ReloadInstanceInfoDiv();
                    //跳转url:/DesignManage/TaskCIItemManage?listId=[id](导入成功后data.htInfo.listId)
                }
            }
        });
   
   }

    ///直接结束流程
    function ForceCompleteInstance() {
      var content=$("#content").val();
        if (confirm("确定终止流程吗？")) {
               $.ajax({
                   url: "/Home/ForceCompleteInstance/",
                    type: 'post',
                    data: {
                        flowId:flowId,
                        flowInstanceId:flowInstanceId,
                        stepId:stepId,
                        content:content
                      },
                    dataType: 'json',
                    error: function () {
                        $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                    },
                    success: function (data) {
                        if (data.Success == false) {
                            $.tmsg("m_jfw", data.Message, { infotype: 2 });
                        }
                        else {
                            $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                             ReloadInstanceInfoDiv();
                            //跳转url:/DesignManage/TaskCIItemManage?listId=[id](导入成功后data.htInfo.listId)
                        }
                    }
                });
        }
    }


    function StartWorkFlow(actId) {
        
    
        var url=['/WorkFlow/ObjectWorkFlowStepDrafters/?',
            'flowInstanceId='+flowInstanceId,
            '&flowId='+flowId,
            '&instanceName='+instanceName,
            '&referFieldValue='+referFieldValue,
            '&tableName='+tableName,
            '&referFieldName='+referFieldName
        ].join("");
        box(url,
        {
            boxid: 'editexceuser',
            title: '审批人员设置',
            contentType: 'ajax',
            cls: 'shadow-container',
            width: 450,
            submit_cb:function(o) {//approvalItem completeDate approvalSubject
               var approvalItem = o.fbox.find("#approvalItem").val(),
                    completeDate = o.fbox.find("#completeDate").val(),
                    approvalSubject = o.fbox.find("#approvalSubject").val(),
                    selects = o.fbox.find('select[id^="selectUser_"]'), actionUserStr = '';
                // 步骤2|H|1,2,3,4|Y|步骤2|H|1,2,3,4
                var flag=false;
                selects.each(function(i,n) {
                    var sel = $(n).find('option:selected'),
                        setid = sel.attr('stepId'),
                        uid = sel.val();
                         if(typeof(setid)!="undefined")
                        {
                           actionUserStr +=  setid + '|Y|' + uid + '|H|';
                        }
                        if(typeof(uid)=="undefined"){
                        alert("流程步骤审批人不能为空!");
                        flag=true;
                        return false;
                        }
                    //actionUserStr +=  setid + '|Y|' + uid + '|H|';
                });
              
                if(flag==true){
                return false;
                }
                actionUserStr = actionUserStr.replace(/\|Y\|$/, '');
                   var stepIds="";
                     o.fbox.find("input:checked").each(function()
                    {
                     stepIds+= $(this).val() + ",";
                    });
                   
                LaunchWorkFlow(actId,approvalItem,completeDate,approvalSubject,actionUserStr,flowInstanceId,stepIds);
            }
        });
    }
   ///直接启动流程，人员设置在发起动作中设置,发起流程
    function LaunchWorkFlow(actId,approvalItem,completeDate,approvalSubject,actionUserStr,flowInstanceId,stepIds) {
     
        if(flowInstanceId==0)
        {
           stepId=bootStepId;
         }
        
       $.ajax({
           url: "/Home/StartWorkFlow/",
            type: 'post',
            data: {
                instanceName: instanceName,
                referFieldValue: referFieldValue,
                tableName: tableName,
                referFieldName: referFieldName,
                flowId:flowId,
                flowInstanceId:flowInstanceId,
                stepId:stepId,
                actId:actId,
                approvalItem:approvalItem,
                completeDate:completeDate,
                approvalSubject:approvalSubject,
                actionUserStr:actionUserStr,
                stepIds:stepIds
              },
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", data.Message, { infotype: 2 });
                }
                else {
                    $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                    //SaveDesignChangeStartApprovalTime(referFieldValue);
                      ReloadInstanceInfoDiv();
                    //跳转url:/DesignManage/TaskCIItemManage?listId=[id](导入成功后data.htInfo.listId)
                }
            }
        });
    }
    <%-- 保存变更单发起审批时间 --%>
    function SaveDesignChangeStartApprovalTime(dngChangeId) {
        $.ajax({
           url: "/Home/SaveDesignChangeStartTime/",
            type: 'post',
            data: {
                designChangeId:dngChangeId
              },
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", data.Message, { infotype: 2 });
                }
                else {
                    $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                     ReloadInstanceInfoDiv();
                }
            }
        });
    }


     function TurnRightToUser(userId, flowInstanceId,instanceId) {
      
      grantRemark=$("#content").val();
      
      
         SelectUsers.init({
                          rType: 'cb',
                          multiSel: false,
                          single: true,
                          onOpen: function() {
                              SelTree();
                          },
                          callback: function(rs) {
                             saveRUs(rs, grantRemark, userId, flowInstanceId,instanceId);
                          }
                      });

 
    
  }


   function SubmitTurnRightToUser(userId, flowInstanceId,instanceId) {
   
      grantRemark=$("#content").val();
        saveRUs(null, grantRemark, userId, flowInstanceId,instanceId);
//     
//      box('<div style="margin:8px;"><textarea name="g_remark" class="textarea_01" style="width:250px;height:100px;">'+grantRemark+'</textarea></div>', {boxid:'box_remark', title:'交办意见',
//                width: 280,
//                submit_cb: function(o) {
//                    var remark = o.fbox.find('textarea[name="g_remark"]').val() || '';
//                     //弹出选人窗口过滤userId
//                          saveRUs(null, remark, userId, flowInstanceId,instanceId);
//             
//                }
//              });
//    
  }

 

  function saveRUs(rs, remark, userId, flowInstanceId,instanceId) {
    var givenUserId;
    if(rs)
    {
        for (var key in rs) {
            if (key == userId) {
            $.tmsg("m_jfw", "不能交办给自己,请重试！", { infotype: 1 });
                return false;
            }
            givenUserId = key;
            break;
        }
    }else
    {
     givenUserId=submitUserId;
    }

    
    $.ajax({
    url: "/Home/TurnOnToUser/" + instanceId,
        type: 'post',
        data: { givenUserId: givenUserId,
                grantUserId: curUserId,
                flowId: flowId,
                remark: escape(remark)
                },
        dataType: 'json',
        error: function() {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function(data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", data.Message, { infotype: 2 });
            }
            else {
                $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                 ReloadInstanceInfoDiv();
                }
                      
        }
    });
  }


  //编辑属性
  function EditFee(designChangeId,setFieldName)
  {
             box('/WorkFlow/ObjectInstanceEdit?stepId='+stepId+'&referFieldValue='+referFieldValue+'&flowInstanceEditMode=1'
               +"&math="+Math.random(), { boxid: 'WorkFlowStepEdit', title: '编辑', width:650, contentType: 'ajax',
                        submit_cb: function (o) {
                           
                            SaveChange(0,ReloadDesignChagneDiv)
                            closeById('WorkFlowStepEdit');
                            return false;
                        }
                    });
       
    }
    //选择会签步骤
   function SelectActiveStep()
  {
     box('/WorkFlow/WorkFlowSlaverStepSetting?stepId='+stepId+'&flowInstanceId='+flowInstanceId
       +"&math="+Math.random(), { boxid: 'ActiveStepEdit', title: '流程部门选择', width:300, contentType: 'ajax',
                submit_cb: function (o) {
                    var stepIds="";
                     o.fbox.find("input:checked").each(function()
                    {
                     stepIds+= $(this).val() + ",";
                    });
                   
                    $.ajax({
                            url: "/Home/SetEnSalvedStep",
                            type: 'post',
                            data: {"flowId":flowId,
                                   "curStepId":stepId,"stepIds": stepIds, "flowInstanceId":flowInstanceId},
                            dataType: 'json',
                            error: function () {
                                hiAlert('未知错误，请联系服务器管理员，或者刷新页面重试', '保存失败');
                            },
                            success: function (data) {
                                if (data.Success == false) {
                                    hiOverAlert(data.Message);
                                    }
                                else {
                                closeById('ActiveStepEdit');
                                ReloadWorkFlowMap();
                                   // ReloadInstanceInfoDiv();
                                  //  ReloadDesignChagneDiv();
                                }
                            }
                        });
                  
                    return false;
                }
            });
    }
    
   //启动二次会签
   function SelectCSignStep()
  {
       var content = $("#content").val();
     box('/WorkFlow/WorkFlowResetCSignStepSetting?stepId='+stepId+'&flowInstanceId='+flowInstanceId 
       +"&math="+Math.random(), { boxid: 'ResetCSignStepEdit', title: '流程部门选择', width:300, contentType: 'ajax',
                submit_cb: function (o) {
                    var stepIds="";
                     o.fbox.find("input:checked").each(function()
                    {
                     stepIds+= $(this).val() + ",";
                    });
                    if(stepIds=="")
                    {
                     hiOverAlert("请先选中岗位");
                     return false;
                    }
                
                    if(content=="")
                    {
                    if(!confirm("您还没有填写二次会签意见是否继续"))
                    {
                       return false;
                    }
                    }
                   
                   if (confirm("是否对选中的岗位进行二次会签！")) {

                    $.ajax({
                            url: "/Home/SetResetCSignStepStep",
                            type: 'post',
                            data: {"flowId":flowId,
                                   "curStepId":stepId,"stepIds": stepIds, "flowInstanceId":flowInstanceId,remark:content},
                            dataType: 'json',
                            error: function () {
                                hiAlert('未知错误，请联系服务器管理员，或者刷新页面重试', '保存失败');
                            },
                            success: function (data) {
                                if (data.Success == false) {
                                    hiOverAlert(data.Message);
                                    }
                                else {
                                closeById('ResetCSignStepEdit');
                                 //  ReloadWorkFlowMap();
                                     ReloadInstanceInfoDiv();
                                  //  ReloadDesignChagneDiv();
                                }
                            }
                        });
                     }
                  
                    return false;
                }
            });
    }


    function ForceCounterSignNoticeUser()
   {
    
            box('/WorkFlow/WorkFlowNoticeStepSetting?stepId='+stepId+'&flowInstanceId='+flowInstanceId
               +"&math="+Math.random(), { boxid: 'stepSelect', title: '部门选择', width:300, contentType: 'ajax',
                        submit_cb: function (o) {
                            var stepIds="";
                             o.fbox.find("input:checked").each(function()
                            {
                             stepIds+= $(this).val() + ",";
                            });
                             closeById('stepSelect');
                             ForceNoticeUser(stepIds);
                            return false;
                        }
                    });
           
   }

    function ForceNoticeUser(selStepIds)
   {
      // var content=$("#content").val();
         if (confirm("确定发送催办信息！")) {
       $.ajax({
           url: "/Home/ForceNoticeUser/",
            type: 'post',
            data: {
                flowId:flowId,
                flowInstanceId:flowInstanceId,
                stepId:stepId,
                selStepIds:selStepIds
              },
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", data.Message, { infotype: 2 });
                }
                else {
                    $.tmsg("m_jfw", "提醒成功！", { infotype: 1 });
                  
                    //跳转url:/DesignManage/TaskCIItemManage?listId=[id](导入成功后data.htInfo.listId)
                }
            }
        });
        }
   
   }


    ///添加传阅人员
    function CirculateToUser(userId, flowInstanceId,instanceId,_stepId) {
      //弹出选人窗口过滤userId
      SelectUsers.init({
          rType: 'cb',
          multiSel: true,
          single: false,
          onOpen: function() {
              SelTree();
          },
          callback: function(rs) {
              box('<div style="padding:5px;"><textarea name="g_remark" style="width:180px;height:200px;"></textarea></div>', {boxid:'box_remark', title:'意见',
                width: 200, height:250,
                submit_cb: function(o) {
                    var remark = o.fbox.find('textarea[name="g_remark"]').val() || '';
                    saveCUs(rs, remark, userId, flowInstanceId,instanceId,_stepId);
                }
              });
          }
      });
  }
   function saveCUs(rs, remark, userId, flowInstanceId,instanceId,stepId) {
    var givenUserId="";
    for (var key in rs) {
        if (key == userId) {
        $.tmsg("m_jfw", "不能传阅给自己,请重试！", { infotype: 1 });
            return false;
        }
        givenUserId += key+",";
       
    }
    
    $.ajax({
    url: "/Home/CirculateToUser/" + instanceId,
        type: 'post',
        data: { givenUserIds: givenUserId,
                grantUserId: "<%=curUserId %>",
                flowId: "<%=flowId %>",
                remark: remark, 
                stepId:stepId
                },
        dataType: 'json',
        error: function() {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function(data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", data.Message, { infotype: 2 });
            }
            else {
                $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                // ReloadInstanceInfoDiv();
                }
                      
        }
    });
  }

  
 //阅读完毕确认
  function SaveCirculateComplete()
  {
     
       var remark =$("#content").val();
                  $.ajax({
                        url: "/Home/CirculateComplete/" + flowInstanceId,
                            type: 'post',
                            data: {  
                                    flowId: "<%=flowId %>",
                                    remark: remark, 
                                    stepId:stepId
                                    },
                            dataType: 'json',
                            error: function() {
                                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                            },
                            success: function(data) {
                                if (data.Success == false) {
                                    $.tmsg("m_jfw", data.Message, { infotype: 2 });
                                }
                                else {
                                    $.tmsg("m_jfw", "操作成功！", { infotype: 1 });
                                   //  ReloadInstanceInfoDiv();
                                    }
                      
                            }
                        }); 
  }


   //保存草稿
  function SaveStepDraft()
  {
    
               var remark =$("#content").val();
                  $.ajax({
                        url: "/Home/SaveStepUserDraft/" + flowInstanceId,
                            type: 'post',
                            data: {  
                                    remark: remark, 
                                    stepId:stepId
                                    },
                            dataType: 'json',
                            error: function() {
                                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                            },
                            success: function(data) {
                                if (data.Success == false) {
                                    $.tmsg("m_jfw", data.Message, { infotype: 2 });
                                }
                                else {
                                    $.tmsg("m_jfw", "操作成功！", { infotype: 1 });
                                   //  ReloadInstanceInfoDiv();
                                    }
                      
                            }
                        }); 
                    
  }
