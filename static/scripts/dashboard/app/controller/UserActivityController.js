Ext
		.define('Cashweb.controller.UserActivityController',
				{
					extend : 'Ext.app.Controller',
					xtype : 'userActivityController',
					views : [ 'Cashweb.view.portlet.UserActivity' ],
					stores : [ 'UserActivityStore' ],
					models : [ 'UserActivityModel' ],
					mask : null,
					refs : [ {
						ref : 'userActivityPortlet',
						selector : 'useractivity'
					}, {
						ref : 'userActivityRefreshTool',
						selector : 'portlet tool[itemId=useractivity_refresh]'
					} ],

					init : function() {
						this.control({
							'useractivity' : {
								render : this.onUserActivityPortletRender,
								afterrender : this.afterUserActivityRender,
								boxready : this.onBoxReady
							}
						});
					},
					onBoxReady : function(portlet) {
						portlet.getTargetEl().mask(label_map.loading);
					},
					onUserActivityPortletRender : function(component, eOpts) {
						this.getUserActivityRefreshTool().on('click',
								this.portletRefresh, this);
						this.ajaxRequest();
					},
					afterUserActivityRender : function() {
						if (this.getUserActivityRefreshTool().record
								.get('refreshType') == "A") {
							this.handleUserActivityAutoRefresh(this
									.getUserActivityRefreshTool().record);
						}
					},
					loadData : function(data) {
						/*data = {
							success : true,
							summary : [ [ {
								columnName : "USER_NAME",
								value : "John Maker",
								valueType : "STRING"
							}, {
								columnName : "LOGIN_COUNT",
								value : "23",
								valueType : "STRING"
							}, {
								columnName : "LAST_lOGIN",
								value : "8/30/14 12:00 AM",
								valueType : "BIGDECIMAL"
							}, {
								columnName : "CCY_SYMBOL",
								value : "$",
								valueType : "STRING"
							} ], [ {
								columnName : "USER_NAME",
								value : "Carl Wise",
								valueType : "STRING"
							}, {
								columnName : "LOGIN_COUNT",
								value : "54",
								valueType : "STRING"
							}, {
								columnName : "LAST_lOGIN",
								value : "8/30/14 12:00 AM",
								valueType : "BIGDECIMAL"
							}, {
								columnName : "CCY_SYMBOL",
								value : "$",
								valueType : "STRING"
							} ], [ {
								columnName : "USER_NAME",
								value : "Henry Walker",
								valueType : "STRING"
							}, {
								columnName : "LOGIN_COUNT",
								value : "40",
								valueType : "STRING"
							}, {
								columnName : "LAST_lOGIN",
								value : "8/30/14 12:00 AM",
								valueType : "BIGDECIMAL"
							}, {
								columnName : "CCY_SYMBOL",
								value : "$",
								valueType : "STRING"
							} ], [ {
								columnName : "USER_NAME",
								value : "John Maker",
								valueType : "STRING"
							}, {
								columnName : "LOGIN_COUNT",
								value : "23",
								valueType : "STRING"
							}, {
								columnName : "LAST_lOGIN",
								value : "8/30/14 12:00 AM",
								valueType : "BIGDECIMAL"
							}, {
								columnName : "CCY_SYMBOL",
								value : "$",
								valueType : "STRING"
							} ], [ {
								columnName : "USER_NAME",
								value : "Carl Wise",
								valueType : "STRING"
							}, {
								columnName : "LOGIN_COUNT",
								value : "54",
								valueType : "STRING"
							}, {
								columnName : "LAST_lOGIN",
								value : "8/30/14 12:00 AM",
								valueType : "BIGDECIMAL"
							}, {
								columnName : "CCY_SYMBOL",
								value : "$",
								valueType : "STRING"
							} ] ]
						};*/
						
						var storeData = [];
						var arrData = data.summary;

						Ext.each(arrData, function(object, index) {
							var arrCol = object;
							var colJson = {};
							Ext.each(arrCol, function(colObj, colIndex) {
								colJson[colObj.columnName] = colObj.value;
							});
							storeData.push(colJson);
						});
						this.getUserActivityPortlet().getStore().loadData(
								storeData);
						this.getUserActivityPortlet().getTargetEl().unmask();
					},

					ajaxRequest : function() {
						var obj;
						var thisClass = this;
						var strSqlDateFormat = 'Y-m-d';
						var dtFormat = strExtApplicationDateFormat;
						var date = new Date(Ext.Date.parse(dtApplicationDate, dtFormat));
						var appDate = Ext.Date.format(date, strSqlDateFormat);
						//var strUrl = './getUserActivityDetails.rest?dtFrom=2014-01-01&dtTo=2014-12-30';
						var strUrl ='./getUserActivityDetails.rest?dtFrom='+appDate+'&dtTo='+appDate;
						Ext.Ajax.request({
											url : strUrl,
											success : function(response) {
												obj = Ext.decode(response.responseText);
												thisClass.loadData(obj);
											},
											failure : function(response) {
												if (!Ext.isEmpty(thisClass
														.getUserActivityPortlet())) {
													thisClass
															.getUserActivityPortlet()
															.getTargetEl().unmask();
												}
												var viewref = thisClass
														.getUserActivityPortlet();
												thisClass.mask = new Ext.LoadMask(
														viewref, {
															msgCls : 'error-msg'
														});
												if (response.timedout) {
													thisClass.mask.msg = label_map.timeoutmsg;
												} else if (response.aborted) {
													thisClass.mask.msg = label_map.abortmsg;
												} else {
													if (response.status === 0) {
														thisClass.mask.msg = label_map.serverStopmsg;
													} else
														thisClass.mask.msg = response.statusText;
												}
												thisClass.mask.show();
											}
										});
					},

					portletRefresh : function() {
						if (this.mask != null) {
							this.mask.hide();
							Ext.destroy(this.mask);
						}
						this.getUserActivityPortlet().getTargetEl().mask(
								label_map.loading);
						this.ajaxRequest();
					},
					handleUserActivityAutoRefresh : function(record) {
						var portlet = this;
						var taskRunner = new Ext.util.TaskRunner();
						var task = taskRunner.newTask({
							run : portlet.portletRefresh,
							interval : record.get('refreshInterval') * 1000,
							scope : portlet
						});
						task.start();
						this.getUserActivityPortlet().taskRunner = taskRunner;
					}
				});