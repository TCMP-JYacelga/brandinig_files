Ext.define('Cashweb.view.portlet.WSJPortlet', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.wall_st_jrnl',
	taskRunner: null,
	autoHeight: true,
	handleRefresh: true,
	config: {
		width: null,
		autoHeight: true,
		listeners: {
			scope: this,
			'boxready': {
				fn: function(panel, width, height, eopts) {
					width = panel.getWidth() - 50;
					var calculatedHeight = 0;
					panel.config.width = width;
					panel.config.height = calculatedHeight;
					panel.update('<iframe frameborder="0" style="border:none" height=90% width=100% src="static/scripts/dashboard/gadgets/wsj.jsp?height='+calculatedHeight+' &width='+width+'" ></iframe>');
				}
			},
			afterrender: function(portlet) {
				if(portlet.record.get('refreshType') == "A") {
					portlet.handleWidgetAutoRefresh(portlet.record);
				}
			}
		}
	},
	
	initComponent : function() {
		Ext.apply(this, {
			layout : 'fit',
			draggable : true,
			height : 260,
			autoScroll: false,
			html : '<iframe frameborder="0" style="border:none" height=90% width=100%></iframe>'
		});
		this.callParent();
	},
	portletRefresh: function() {
		this.update('<iframe frameborder="0" style="border:none" height=90% width=100% src="static/scripts/dashboard/gadgets/wsj.jsp?height='+this.config.height+' &width='+this.config.width+'" ></iframe>');
	},
	handleWidgetAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: portlet.portletRefresh,
			interval: record.get('refreshInterval') * 1000,
			scope: portlet
		});
		task.start();
		this.taskRunner = taskRunner;
	}
});

