Ext.define('Cashweb.controller.SummaryController', {
	extend : 'Ext.app.Controller',
	xtype : 'summaryController',
	views : ['portlet.SummaryPortlet'],
	stores : ['SummaryStore'],
	models : ['SummaryModel'],
	mask:null,
	refs : [{
				ref : 'summaryPortlet',
				selector : 'cash_frcst'
			}, {
				ref: 'summaryRefreshTool',
				selector: 'portlet tool[itemId=cash_frcst_refresh]'
			}],

	init : function() {
		this.control({
					'cash_frcst' : {
						render : this.onSummaryPortletRender,
						afterrender: this.afterSummaryRender,
						boxready: this.onBoxReady
					}
				});
	},
	onBoxReady: function(portlet) {
		portlet.getTargetEl().mask(label_map.loading);
	},
	onSummaryPortletRender : function(component, eOpts) {
		this.getSummaryRefreshTool().on('click', this.portletRefresh, this);
		this.ajaxRequest();
	},
	afterSummaryRender: function() {
		if(this.getSummaryRefreshTool().record.get('refreshType') == "A") {
			this.handleSummaryAutoRefresh(this.getSummaryRefreshTool().record);
		}
	},

	loadData : function(data) {
		var storeData = [];
		storeData.push({
					balanceType : label_map.closingBal,
					balanceAmount : data.summary[0].closingBalance
				}, {
					balanceType : label_map.openingBal,
					balanceAmount : data.summary[0].openingBalance
				}, {
					balanceType : label_map.ProjectedinFlows,
					balanceAmount : data.summary[0].inFlow
				}, {
					balanceType : label_map.ProjectedoutFlows,
					balanceAmount : data.summary[0].outFlow
				});
		this.getSummaryPortlet().config.currency = data.sellerCurrency;
		this.getSummaryPortlet().getStore().loadData(storeData);
		this.getSummaryPortlet().getTargetEl().unmask();
	},

	ajaxRequest : function() {
		var obj;
		var thisClass = this;
		Ext.Ajax.request({
			url : './getCashflows.rest',
			success : function(response) {
				obj = Ext.decode(response.responseText);
				thisClass.loadData(obj);
			},
			failure : function(response) {
					if(!Ext.isEmpty(thisClass.getSummaryPortlet()))
					{
					thisClass.getSummaryPortlet().getTargetEl().unmask();
					}
					var viewref =thisClass.getSummaryPortlet();
					thisClass.mask = new Ext.LoadMask(viewref ,{msgCls:'error-msg'});	
					if (response.timedout) {
						thisClass.mask.msg=label_map.timeoutmsg;
						
										
					} else if (response.aborted) {
						 thisClass.mask.msg=label_map.abortmsg;
						
					} else {
						 if(response.status === 0)
						 {
							thisClass.mask.msg=label_map.serverStopmsg;
						 }
						else
						 thisClass.mask.msg=response.statusText;
						 
					}
					thisClass.mask.show();
			   }
		});
	},
	
	portletRefresh: function() {
		if(this.mask != null)
		{
		this.mask.hide();
		Ext.destroy(this.mask);
		}
		this.getSummaryPortlet().getTargetEl().mask(label_map.loading);
		this.ajaxRequest();
	},
	handleSummaryAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: portlet.portletRefresh,
			interval: record.get('refreshInterval') * 1000,
			scope: portlet
		});
		task.start();
		this.getSummaryPortlet().taskRunner = taskRunner;
	}
});