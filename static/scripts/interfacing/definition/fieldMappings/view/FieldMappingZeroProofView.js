Ext.define('GCP.view.FieldMappingZeroProofView', {
	extend : 'Ext.panel.Panel',
	xtype : 'fieldMappingZeroProofView',
	requires : ['GCP.view.FieldMappingZeroProofGrid'],	
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [
				{
					xtype : 'fieldMappingZeroProofGridType',									
					parent : me
				}
				
				];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});