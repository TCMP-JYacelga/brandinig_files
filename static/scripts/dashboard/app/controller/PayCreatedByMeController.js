Ext.define('Cashweb.controller.PayCreatedByMeController',
				{
					extend : 'Ext.app.Controller',
					xtype : 'payCreatedByMeController',
					views : [ 'Cashweb.view.portlet.PayCreatedByMe' ],
					stores : [ 'PayCreatedByMeStore' ],
					models : [ 'PayCreatedByMeModel' ],
					mask : null,
					refs : [ {
						ref : 'paycreatedbymePortlet',
						selector : 'paycreatedbyme'
					}, {
						ref : 'paycreatedbymeRefreshTool',
						selector : 'portlet tool[itemId=paycreatedbyme_refresh]'
					} ],

					init : function() {
						this.control({
							'paycreatedbyme' : {
								render : this.onPayCreatedMyMePortletRender,
								afterrender : this.afterPayCreatedByMeRender,
								boxready : this.onBoxReady
							}
						});
					},
					onBoxReady : function(portlet) {
						//portlet.getTargetEl().mask(label_map.loading);
					},
					onPayCreatedMyMePortletRender : function(component, eOpts) {
						this.getPaycreatedbymeRefreshTool().on('click',
								this.portletRefresh, this);
						this.ajaxRequest();
					},
					afterPayCreatedByMeRender : function() {
						if (this.getPaycreatedbymeRefreshTool().record
								.get('refreshType') == "A") {
							this.handlePayCreatedByMeAutoRefresh(this
									.getPaycreatedbymeRefreshTool().record);
						}
					},
					loadData : function(data) {
					
					var storeData = [];
					var arrData = data.summary;
					  for (var i=0;i<arrData.length;i++) {
						   var colJson = {};
							if(arrData[i]){
									 colJson["MAKER_DATETIME"]=arrData[i].MAKER_DATETIME;
									 colJson["PHDREFERENCE"]=arrData[i].PHDREFERENCE;
									  colJson["phdpayccy"]=arrData[i].phdpayccy;
									 colJson["PHDTOTALNO"]=arrData[i].PHDTOTALNO
									 colJson["TXN_AMNT"]=arrData[i].txn_amnt,
									 colJson["statusDescription"]=arrData[i].statusDescription;
							} 
							   storeData.push(colJson);
						}
				
						/*Ext.each(arrData, function(object, index) {
							var arrCol = object;
							var colJson = {};
							Ext.each(arrCol, function(colObj, colIndex) {
								colJson[colObj.columnName] = colObj.value;
							});
							storeData.push(colJson);
						});*/
						this.getPaycreatedbymePortlet().getStore().loadData(
								storeData);
						this.getPaycreatedbymePortlet().getTargetEl().unmask();
					},

					ajaxRequest : function() {
						var obj;
							var thisClass = this;
							var strSqlDateFormat = 'Y-m-d';
							var dtFormat = strExtApplicationDateFormat;
							var date = new Date(Ext.Date.parse(dtApplicationDate, dtFormat));
							var appDate = Ext.Date.format(date, strSqlDateFormat);
							var strUrl ='./getPaymentCreatedByMeDetails.rest?';
							Ext.Ajax.request({
												url : strUrl,
												success : function(response) {
													obj = Ext.decode(response.responseText);
													thisClass.getPaycreatedbymePortlet().total=obj.totalPaymentAmnt;
													thisClass.loadData(obj);
												},
												failure : function(response) {
													
												}
											});
					},

					portletRefresh : function() {
						if (this.mask != null) {
							this.mask.hide();
							Ext.destroy(this.mask);
						}
						this.getPaycreatedbymePortlet().getTargetEl().mask(
								label_map.loading);
						this.ajaxRequest();
					},
					handlePayCreatedByMeAutoRefresh : function(record) {
						var portlet = this;
						var taskRunner = new Ext.util.TaskRunner();
						var task = taskRunner.newTask({
							run : portlet.portletRefresh,
							interval : record.get('refreshInterval') * 1000,
							scope : portlet
						});
						task.start();
						this.getPaycreatedbymePortlet().taskRunner = taskRunner;
					}
				});