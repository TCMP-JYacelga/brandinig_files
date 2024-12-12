Ext.define('GCP.view.FieldMappingView', {
	extend : 'Ext.panel.Panel',
	xtype : 'fieldMappingView',
	requires : ['GCP.view.FieldMappingEditGrid'],	
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [				
				
				{
					xtype : 'fieldMappingEditGrid',					
					parent : me
				}
				];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});