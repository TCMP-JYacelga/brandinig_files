Ext.define('Cashweb.controller.ReportController', {
	extend : 'Ext.app.Controller',
	xtype : 'reportController',
	views : [ 'portlet.ReportPortlet' ],
	stores : [ 'ReportStore' ],
	models : [ 'ReportModel' ],
	mask : null,
	refs : [ {
		ref : 'reportPortlet',
		selector : 'reports'
	}, {
		ref : 'reportRefreshTool',
		selector : 'portlet2 tool[itemId=reports_refresh]'
	} ],

	init : function() {
		this.control({
			'reports' : {
			// render : this.onReportPortletRender,
			// afterrender: this.afterReportRender,
			// boxready: this.onBoxReady
			}
		});
	},

	portletRefresh : function() {
		if (this.mask != null) {
			this.mask.hide();
			Ext.destroy(this.mask);
		}
		this.getReportPortlet().getTargetEl().mask(label_map.loading);
		this.ajaxRequest();
	},
	handleReportAutoRefresh : function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run : portlet.portletRefresh,
			interval : record.get('refreshInterval') * 1000,
			scope : portlet
		});
		task.start();
		this.getReportPortlet().taskRunner = taskRunner;
	}
});