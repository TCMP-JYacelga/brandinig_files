Ext.define('GCP.view.ReportParameterGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','Ext.panel.Panel'],
	xtype : 'reportParameterGridView',
	width : '100%',
	cls:'xn-ribbon',
	initComponent : function() {
		var me = this;
		this.items = [{
			xtype : 'container',
			layout : 'hbox',
			flex : 1,
			items : [{
						xtype : 'toolbar',
						itemId : 'btnCreateNewToolBar',
						cls : 'ux_panel-background',
						flex : 1,
						items : []
					}]
	}, {
			xtype : 'panel',
			width : '100%',
			collapsible : true,	
			title : getLabel('lblReportParameter', 'Parameter Details'),
			autoHeight : true,
			cls:'ux_extralargemargin-top xn-ribbon ux_panel-transparent-background',
			itemId : 'clientSetupDtlView'
		}];
		this.callParent(arguments);
	}

});