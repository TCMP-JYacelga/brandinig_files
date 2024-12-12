Ext.define('GCP.view.AgentAccountGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','Ext.panel.Panel'],
	xtype : 'agentAccountGridView',
	width : '100%',
	componentCls : 'ux_panel-background  x-portlet',
	initComponent : function() {
		var me = this;		
		this.items = [{
			xtype : 'panel',
			width : '100%',
			collapsible : true,
			title : getLabel('accountList','Account List'),
			cls : 'xn-ribbon ux_panel-transparent-background ux_border-bottom',
			autoHeight : true,
			itemId : 'agentAccountDtlView',
			items : []
		}];
		this.callParent(arguments);
	}

});