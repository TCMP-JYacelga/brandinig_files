Ext.define('GCP.view.TokenFilesGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','Ext.panel.Panel'],
	xtype : 'tokenFilesGridView',
	width : '100%',
	initComponent : function() {
		var me = this;
		this.items = [{
			xtype : 'panel',
			width : '100%',
			collapsible : true,
			margin:'10 0 0 0',
			cls : 'xn-ribbon ux_header-width ux_panel-transparent-background',
			title : getLabel('tokenFilesList', 'Token Files List'),
			itemId : 'clientSetupDtlView',
			items : [{
						xtype : 'container',
						cls: 'ux_largepaddinglr ux_border-top',
						layout : 'hbox',
						items : []

					}]
		}];
		this.callParent(arguments);
	}

});