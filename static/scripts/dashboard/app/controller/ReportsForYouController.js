Ext.define('Cashweb.controller.ReportsForYouController',
				{
					extend : 'Ext.app.Controller',
					xtype : 'reportsForYouController',
					views : [ 'Cashweb.view.portlet.ReportsForYou' ],
					stores : [ 'ReportsForYouStore' ],
					models : [ 'ReportsForYouModel' ],
					mask : null,
					refs : [ {
						ref : 'reportsForYouPortlet',
						selector : 'reportsforyou'
					}, {
						ref : 'reportsforyouRefreshTool',
						selector : 'portlet tool[itemId=reportsforyou_refresh]'
					} ],

					init : function() {
						this.control({
							'reportsforyou' : {
								render : this.onReportsForYouPortletRender,
								afterrender : this.afterReportsForYouRender,
								boxready : this.onBoxReady
							}
						});
					},
					onBoxReady : function(portlet) {
						//portlet.getTargetEl().mask(label_map.loading);
					},
					onReportsForYouPortletRender : function(component, eOpts) {
						this.getReportsforyouRefreshTool().on('click',
								this.portletRefresh, this);
						this.ajaxRequest();
					},
					afterReportsForYouRender : function() {
						if (!Ext.isEmpty(this.getReportsforyouRefreshTool()) && this.getReportsforyouRefreshTool().record
								.get('refreshType') == "A") {
							this.handleReportsForYouAutoRefresh(this
									.getReportsforyouRefreshTool().record);
						}
					},
					loadData : function(data) {
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
						this.getReportsForYouPortlet().getStore().loadData(
								storeData);
						this.getReportsForYouPortlet().getTargetEl().unmask();
					},

					ajaxRequest : function() {
						var obj;
							var thisClass = this;
							var strSqlDateFormat = 'Y-m-d';
							var dtFormat = strExtApplicationDateFormat;
							var date = new Date(Ext.Date.parse(dtApplicationDate, dtFormat));
							var appDate = Ext.Date.format(date, strSqlDateFormat);
							var strUrl ='./getReportsForYou.rest?';
							Ext.Ajax.request({
												url : strUrl,
												success : function(response) {
													obj = Ext.decode(response.responseText);
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
						this.getReportsForYouPortlet().getTargetEl().mask(
								label_map.loading);
						this.ajaxRequest();
					},
					handleReportsForYouAutoRefresh : function(record) {
						var portlet = this;
						var taskRunner = new Ext.util.TaskRunner();
						var task = taskRunner.newTask({
							run : portlet.portletRefresh,
							interval : record.get('refreshInterval') * 1000,
							scope : portlet
						});
						task.start();
						this.getReportsForYouPortlet().taskRunner = taskRunner;
					}
				});