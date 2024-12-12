Ext.define('Cashweb.controller.ReportController', {
	extend : 'Ext.app.Controller',
	xtype : 'reportController',
	views : ['portlet.ReportPortlet'],
	stores : ['ReportStore'],
	models : ['ReportModel'],
	mask:null,
	refs : [{
				ref : 'reportPortlet',
				selector : 'reports'
			}, {
				ref: 'reportRefreshTool',
				selector: 'portlet tool[itemId=reports_refresh]'
			}],

	init : function() {
		this.control({
					'reports' : {
						render : this.onReportPortletRender,
						afterrender: this.afterReportRender,
						boxready: this.onBoxReady
					}
				});
	},
	onBoxReady: function(portlet) {
		portlet.getTargetEl().mask(label_map.loading);
	},
	onReportPortletRender : function(component, eOpts) {
		this.getReportRefreshTool().on('click', this.portletRefresh, this);
		this.ajaxRequest();
	},
	afterReportRender: function() {
		if(this.getReportRefreshTool().record.get('refreshType') == "A") {
			this.handleReportAutoRefresh(this.getReportRefreshTool().record);
		}
	},

	loadData : function(data) {
		this.getReportPortlet().getStore().loadData(data.reports);
		this.getReportPortlet().getStore().config.dashboardReportsViewState = data.reportsViewState;
		this.getReportPortlet().getTargetEl().unmask();
	},

	ajaxRequest : function() {
		var obj;
		var thisClass = this;
		Ext.Ajax.request({
			 url : './getMyReports.rest',
			success : function(response) {
				obj = Ext.decode(response.responseText);
				thisClass.loadData(obj);
			},
			failure : function(response) {
				thisClass.getReportPortlet().getTargetEl().unmask();
				var viewref = thisClass.getReportPortlet();
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
		this.getReportPortlet().getTargetEl().mask(label_map.loading);
		this.ajaxRequest();
	},
	handleReportAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: portlet.portletRefresh,
			interval: record.get('refreshInterval') * 1000,
			scope: portlet
		});
		task.start();
		this.getReportPortlet().taskRunner = taskRunner;
	}
});