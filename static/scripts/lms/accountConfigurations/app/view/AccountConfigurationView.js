Ext.define('GCP.view.AccountConfigurationView', {
	extend : 'Ext.container.Container',
	xtype : 'clientSetupView',
	requires : ['Ext.container.Container', 'GCP.view.AccountConfigurationFilterView', 'GCP.view.AccountConfigurationGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [
				{
					xtype : 'clientSetupGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});