Ext.define('Cashweb.controller.PayPendingApprController', {
	extend : 'Ext.app.Controller',
	views : [ 'portlet.PayPendingAppr' ],
	stores : [ 'PayPendingApprStore' ],
	models : [ 'PayPendingApprModel' ],
	mask : null,
	refs : [ {
		ref : 'summaryPortlet',
		selector : 'paypendingappr'
	}, {
		ref : 'summaryRefreshTool',
		selector : 'portlet tool[itemId=paypendingappr_refresh]'
	} ],

	init : function() {
		this.control({
			'paypendingappr' : {
				render : this.onAccountSummaryPortletRender,
				afterrender : this.afterAccountSummaryRender,
				boxready : this.onBoxReady
			}
		});
	},
	onBoxReady : function(portlet) {
		portlet.getTargetEl().mask(label_map.loading);
	},
	onAccountSummaryPortletRender : function(component, eOpts) {
		this.getSummaryRefreshTool().on('click', this.portletRefresh, this);
		this.ajaxRequest();
	},
	afterAccountSummaryRender : function() {
		if (this.getSummaryRefreshTool().record.get('refreshType') == "A") {
			this.handleSummaryAutoRefresh(this.getSummaryRefreshTool().record);
		}
	},
	loadData : function(data) {
		var me = this;
		var storeData = [];
				var arrData = data.summary;
                   
				  for (var i=0;i<arrData.length;i++) {
					   var colJson = {};
						if(arrData[i]){
						         colJson["CCY_SYMBOL"]=arrData[i].CCY_SYMBOL;
								 colJson["MAKER_DATE"]=arrData[i].MAKER_DATE;
								 colJson["PHDREFERENCE"]=arrData[i].PHDREFERENCE
								 colJson["PHDTOTALNO"]=arrData[i].PHDTOTALNO,
								 colJson["TXN_AMNT"]=arrData[i].TXN_AMNT;
								 colJson["USRDESCRIPTION"]=arrData[i].USRDESCRIPTION;
						} 
						   storeData.push(colJson);
					}
		me.getSummaryPortlet().getStore().loadData(storeData);
		me.getSummaryPortlet().getTargetEl().unmask();
	},

	ajaxRequest : function() {
		var obj;
		var thisClass = this;
		Ext.Ajax.request({
			url : './getApprovalPendingPayments.rest',
			success : function(response) {
				/*var obj = {
						  "success": true,
						  "summary": 
							[
							  {
								"date": "August 30, 2014",
								"ref": "Reference 1",
								"count": "1",
								"amount": "$234,567.89",
								"maker": "John Maker"
							  },{
								"date": "August 27, 2014",
								"ref": "Reference 2",
								"count": "1",
								"amount": "$1,364,567.80",
								"maker": "Carl Wise"
							  },{
								"date": "August 19, 2014",
								"ref": "Reference 3",
								"count": "23",
								"amount": "$934,344.01",
								"maker": "Henry Walker"
							  },{
								"date": "August 18, 2014",
								"ref": "Reference 4",
								"count": "45",
								"amount": "$454,567.80",
								"maker": "John Maker"
							  },{
								"date": "August 15, 2014",
								"ref": "Reference 5",
								"count": "4",
								"amount": "$2,334,007.23",
								"maker": "Carl Wise"
							  }
							]
						  
						}*/
				obj = Ext.decode(response.responseText);
				thisClass.getSummaryPortlet().total=obj.totalAmount;
				thisClass.loadData(obj);
			},
			failure : function(response) {
				if (!Ext.isEmpty(thisClass.getSummaryPortlet())) {
					thisClass.getSummaryPortlet().getTargetEl().unmask();
				}
				var viewref = thisClass.getSummaryPortlet();
				thisClass.mask = new Ext.LoadMask(viewref, {
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
		}
		});
	} ,

	portletRefresh : function() {
		if (this.mask != null) {
			this.mask.hide();
			Ext.destroy(this.mask);
		}
		this.getSummaryPortlet().getTargetEl().mask(label_map.loading);
		this.ajaxRequest();
	},
	handleSummaryAutoRefresh : function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run : portlet.portletRefresh,
			interval : record.get('refreshInterval') * 100,
			scope : portlet
		});
		task.start();
		this.getSummaryPortlet().taskRunner = taskRunner;
	}
});