Ext.define('Cashweb.controller.PaymentsActivityController',
		{
			extend : 'Ext.app.Controller',
			xtype : 'paymentsActivityController',
			views : [ 'portlet.PaymentsActivity' ],
			stores : [ 'PaymentsActivityStore' ],
			models : [ 'PaymentsActivityModel' ],
			mask : null,
			refs : [ {
				ref : 'paymentsActivityPortlet',
				selector : 'paymentsactivity'
			}, {
				ref : 'paymentsActivityRefreshTool',
				selector : 'portlet2 tool[itemId=paymentsactivity_refresh]'
			} ],

			init : function() {
				this.control({
					'paymentsactivity' : {
						render : this.onPaymentsActivityPortletRender,
						afterrender : this.afterPaymentsActivityRender,
						boxready : this.onBoxReady
					}
				});
			},
			onBoxReady : function(portlet) {
				 portlet.getTargetEl().mask(label_map.loading);
			},
			onPaymentsActivityPortletRender : function(component, eOpts) {
				this.getPaymentsActivityRefreshTool().on('click',
						this.portletRefresh, this);
				this.ajaxRequest();
			},
			afterPaymentsActivityRender : function() {
				if (this.getPaymentsActivityRefreshTool().record
						.get('refreshType') == "A") {
					this.handleSummaryAutoRefresh(this
							.getPaymentsActivityRefreshTool().record);
				}
			},
			loadData : function(data) {
				/*data = {
					success : true,
					summary : [ [ {
						columnName : "PERIOD",
						value : "Sept2014 to Date",
						valueType : "STRING"
					}, {
						columnName : "PAY_COUNT",
						value : 23,
						valueType : "NUMBER"
					}, {
						columnName : "PAY_AMNT",
						value : 234567.89,
						valueType : "BIGDECIMAL"
					}, {
						columnName : "FALIED_PAY_CNT",
						value : 23,
						valueType : "NUMBER"
					}, {
						columnName : "FAILED_AMNT",
						value : 234567.89,
						valueType : "BIGDECIMAL"
					}, {
						columnName : "CCY_SYMBOL",
						value : "$",
						valueType : "STRING"
					} ], [ {
						columnName : "PERIOD",
						value : "Aug2014",
						valueType : "STRING"
					}, {
						columnName : "PAY_COUNT",
						value : 54,
						valueType : "NUMBER"
					}, {
						columnName : "PAY_AMNT",
						value : 1234567.79,
						valueType : "BIGDECIMAL"
					}, {
						columnName : "FALIED_PAY_CNT",
						value : 23,
						valueType : "NUMBER"
					}, {
						columnName : "FAILED_AMNT",
						value : 1234567.79,
						valueType : "BIGDECIMAL"
					}, {
						columnName : "CCY_SYMBOL",
						value : "$",
						valueType : "STRING"
					} ], [ {
						columnName : "PERIOD",
						value : "Jul2014",
						valueType : "STRING"
					}, {
						columnName : "PAY_COUNT",
						value : 23,
						valueType : "NUMBER"
					}, {
						columnName : "PAY_AMNT",
						value : 112467.89,
						valueType : "BIGDECIMAL"
					}, {
						columnName : "FALIED_PAY_CNT",
						value : 23,
						valueType : "NUMBER"
					}, {
						columnName : "FAILED_AMNT",
						value : 112467.89,
						valueType : "BIGDECIMAL"
					}, {
						columnName : "CCY_SYMBOL",
						value : "$",
						valueType : "STRING"
					} ], [ {
						columnName : "PERIOD",
						value : "Jun2014",
						valueType : "STRING"
					}, {
						columnName : "PAY_COUNT",
						value : 55,
						valueType : "NUMBER"
					}, {
						columnName : "PAY_AMNT",
						value : 887776.32,
						valueType : "BIGDECIMAL"
					}, {
						columnName : "FALIED_PAY_CNT",
						value : 55,
						valueType : "NUMBER"
					}, {
						columnName : "FAILED_AMNT",
						value : 887776.32,
						valueType : "BIGDECIMAL"
					}, {
						columnName : "CCY_SYMBOL",
						value : "$",
						valueType : "STRING"
					} ], [ {
						columnName : "PERIOD",
						value : "May2014",
						valueType : "STRING"
					}, {
						columnName : "PAY_COUNT",
						value : 13,
						valueType : "NUMBER"
					}, {
						columnName : "PAY_AMNT",
						value : 2447.89,
						valueType : "BIGDECIMAL"
					}, {
						columnName : "FALIED_PAY_CNT",
						value : 13,
						valueType : "NUMBER"
					}, {
						columnName : "FAILED_AMNT",
						value : 2447.89,
						valueType : "BIGDECIMAL"
					}, {
						columnName : "CCY_SYMBOL",
						value : "$",
						valueType : "STRING"
					} ] ]
				};*/

				var storeData = [];
				var arrData = data.summary;
				  for (var i=0;i<arrData.length;i++) {
					   var colJson = {};
						if(arrData[i]){
						         colJson["CCY_SYMBOL"]=arrData[i].CCY_SYMBOL;
								 colJson["REQUEST_DATE"]=arrData[i].REQUEST_DATE;
								 colJson["TOTAL_TXN"]=arrData[i].TOTAL_TXN
								 colJson["TOTAL_AMNT"]=arrData[i].TOTAL_AMNT,
								 colJson["FAILED_COUNT"]=arrData[i].FAILED_COUNT;
								 colJson["FAILED_AMNT"]=arrData[i].FAILED_AMNT;
						} 
						   storeData.push(colJson);
					}
				
				this.getPaymentsActivityPortlet().getStore()
						.loadData(storeData);
				this.getPaymentsActivityPortlet().getTargetEl().unmask();
			},

			ajaxRequest : function() {
				var obj;
				var thisClass = this;
				var strSqlDateFormat = 'Y-m-d';
				var dtFormat = strExtApplicationDateFormat;
				var date = new Date(Ext.Date.parse(dtApplicationDate, dtFormat));
				var appDate = Ext.Date.format(date, strSqlDateFormat);
				var strUrl ='./getPaymentActivityDetails.rest?dtFrom='+appDate+'&dtTo='+appDate;
				Ext.Ajax.request({
									url : strUrl,
									success : function(response) {
										obj = Ext.decode(response.responseText);
										thisClass.getPaymentsActivityPortlet().total=obj.totalPaymentAmnt;
										thisClass.loadData(obj);
									},
									failure : function(response) {
										if (!Ext.isEmpty(thisClass
												.getPaymentsActivityPortlet())) {
											thisClass
													.getPaymentsActivityPortlet()
													.getTargetEl().unmask();
										}
										var viewref = thisClass
												.getPaymentsActivityPortlet();
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
				this.getPaymentsActivityPortlet().getTargetEl().mask(
						label_map.loading);
				this.ajaxRequest();
			},
			handleSummaryAutoRefresh : function(record) {
				var portlet = this;
				var taskRunner = new Ext.util.TaskRunner();
				var task = taskRunner.newTask({
					run : portlet.portletRefresh,
					interval : record.get('refreshInterval') * 1000,
					scope : portlet
				});
				task.start();
				this.getPaymentsActivityPortlet().taskRunner = taskRunner;
			}
		});