widgetMetaData.positivePay = function(widgetId, widgetType)
{
    var metadata = {
          "title": getDashLabel('positivePay.title'),
          "desc": getDashLabel('positivePay.desc'),
          "type": "datatable",
          "subType": "", 
          "url": rootUrl + "/positivePayList.srvc",
          "requestMethod":"POST",
          "responseRoot":"d.positivePay",  
          "rootData" : "d",
          "sortMethod" : 'group',
          "widgetType" : widgetType,
          "cloneMaxCount": 4,
          "maxRecords": 5,
          //"seeMoreUrl": "positivePayList.srvc",
          "fields": {
            "columns": [
                {
                    "fieldName": "instNmbr", 
                    "label": getDashLabel('positivePay.instNmbr'),
                    "type": "text"
                  },
                {
                      "fieldName": "instDate",
                      "label": getDashLabel('positivePay.instDate'),
                      "type": "text",
                      "group" : true
                },
                {
                    "fieldName": "amount",
                    "label": getDashLabel('positivePay.amount'),
                    "type": "amount",
                    "render": function (data, type, row) {
                          return row.ccysymbol +" "+ data;       
                  } 
                },
                {
                    "fieldName": "exceptionReason",
                    "label": getDashLabel('positivePay.exceptionReason'),
                    "type": "text"
                },  
                {
                      "fieldName": "decision", 
                      "label": getDashLabel('positivePay.defaultAction'),
                      "type": "text",
                      "render": function (data, type, row) {
                          if(row.decision=='P')                         
                              return "Pay";
                          else if(row.decision=='R') 
                              return "Return";
                          else 
                              return "None";
                          } 
                 },
                {
                     "fieldName": "decisionStatus", 
                     "label": getDashLabel('positivePay.decisionStatus'),
                     "type": "text"
                }, 
               
              {
                "fieldName": "beneficiaryName", 
                "label": getDashLabel('positivePay.beneficiaryName'),
                "type": "text"
              }/*,
             
              {
                    "fieldName": "decisionReason",
                    "label": getDashLabel('positivePay.decisionReason'),
                    "type": "text"
              } */            
            ],
            "rows":{
                "buttons":[
                           {
                               "id":"pay",
                               "label": getDashLabel('positivePay.pay'),
                               "hidden": function(rootData, rowData){},              
                               "callbacks":{}
                               }
                           ,{
                               "id":"return",
                               "label": getDashLabel('positivePay.return'),
                               "hidden": function(rootData, rowData){},              
                               "callbacks":{}
                               }
                           ,{
                               "id":"rejectRecord",
                               "label":getDashLabel('positivePay.rejectRecord'),
                               "hidden": function(rootData, rowData){},              
                               "callbacks":{}
                           },
                           {
                               "id":"acceptRecord",
                               "label":getDashLabel('positivePay.acceptRecord'),
                               "hidden": function(rootData, rowData){},              
                               "callbacks":{}
                           },
                   ]
            }   
          },  
         "actions":{
              "filter" : {
                  "text" : getDashLabel('filter'),
                  "callbacks" : {
                  "adaptPostData": function(filterData)
                  {
                     return "";
                  },
                  "adaptUrl": function(filterData)
                  {
                      if(filterData && filterData.filter && filterData.filter.fields && filterData.filter.fields.length > 0)
                      {
                         var criteriaQuery = "";
                         var fields = filterData.filter.fields;
                         var clientFilterValue = "";
                         for (var i = 0; i < fields.length; ++i)
                         {
                             if (fields[i].fieldName === "AccountNo")
                             {
                                 if(criteriaQuery!="")
                                     criteriaQuery =criteriaQuery+" and "
                                 criteriaQuery = criteriaQuery + "accountNumber lk '" + fields[i].value1+"'";
                             }
                             if (fields[i].fieldName === "instNmbr")
                             {
                                 if(criteriaQuery!="")
                                     criteriaQuery =criteriaQuery+" and "
                                 criteriaQuery = criteriaQuery + "checkNmbr lk '" + fields[i].value1+"'";
                             }
                              else if (fields[i].fieldName === "status")
                             {
                                  if(criteriaQuery!="")
                                      criteriaQuery =criteriaQuery+" and "
                                  criteriaQuery = criteriaQuery + "status eq '" + fields[i].value1+"'";
                             }
                             else if (fields[i].fieldName === "decision")
                             {
                                  if(criteriaQuery!="")
                                      criteriaQuery =criteriaQuery+" and "
                                  criteriaQuery = criteriaQuery + "decision eq '" + fields[i].value1+"'";
                             }
                            else if (fields[i].fieldName === "instDate")
                             {
                                if(criteriaQuery!="")
                                    criteriaQuery =criteriaQuery+" and "
                                 var date = VAMUtils.getFromDate(fields[i].value1);
                                 criteriaQuery = criteriaQuery + "instDate eq date'" + date.toISOString().slice(0, 10)+"'";
                             }
                         }
                         if(criteriaQuery!="")
                             criteriaQuery ="&$filter="+criteriaQuery;
                             metadata.url = encodeURI(rootUrl + "/positivePayList.srvc?"+csrfTokenName+"="+ csrfTokenValue
                                             + criteriaQuery); 
                      }
                      return metadata.url;
                   }
               }
              }
          },
         "filter" : {
              "fields": [
                      {
                          "fieldName": "AccountNo",
                          "label": getDashLabel('positivePay.accountNo'),
                          "type": "multibox",
                          "filterSubType": "detail",
                          "ajax": {
                              url : rootUrl+'/services/positivePayDecAccountList.json?$filterCode1=' + strClient,
                              dataType : "json",
                              data : [],
                              success : function(data, response) {
                                  if(data && data.d )
                                  {
                                      var res =  data.d;
                                      response($.map(res, function(item) {
                                          return {
                                              label : item.filterCode,
                                              code  : item.filterValue
                                          }
                                      }));                                    
                                  }
                              }
                          },
                      },
                      {
                          "fieldName": "instDate",          
                          "label": getDashLabel('positivePay.issueDate'),
                          "filterSubType": "header",
                          "type": "date",  
                      },
                      {
                          "fieldName": "decision",         
                          "label":  getDashLabel('positivePay.action'),
                          "type": "multibox",
                          "filterSubType": "header",
                          "data": [
                                   {
                                     "code": "N",
                                     "label": getDashLabel('positivePay.open')
                                   },
                                   {
                                     "code": "P",
                                     "label": getDashLabel('positivePay.pay'),
                                   },
                                   {
                                     "code": "R",
                                     "label": getDashLabel('positivePay.return')
                                   }
                             ], 
                         "defalut": "checkall",
                         "default" : {},                  
                         "callbacks":{}   
                    },
                      {
                        "fieldName": "instNmbr",         
                        "label":  getDashLabel('positivePay.checkno'),
                        "type": "text",
                        "filterSubType": "header"
                  },
                      {
                      "fieldName": "status",            
                      "label":  getDashLabel('positivePay.status'),
                      "type": "multibox",
                      "filterSubType": "header",
                      "data": [
                                {
                                  "code": "0",
                                  "label": getDashLabel('positivePay.new')
                                },
                                {
                                  "code": "15",
                                  "label": getDashLabel('positivePay.pendingSubmit'),
                                },
                                {
                                  "code": "1",
                                  "label": getDashLabel('positivePay.pendingApproval')
                                },
                                {
                                  "code": "3",
                                  "label": getDashLabel('positivePay.actionTaken')
                                }
                          ], 
                      "defalut": "checkall",
                      "default" : {},                  
                      "callbacks":{}                              
                }
                  ]
          }
    }
    return metadata;
    
}
