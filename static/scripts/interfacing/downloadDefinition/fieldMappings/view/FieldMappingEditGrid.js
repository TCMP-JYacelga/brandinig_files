Ext.define('GCP.view.FieldMappingEditGrid', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid'],
	xtype : 'fieldMappingEditGrid',
	cls : 'xn-ribbon',
	width : '100%',	
	parent : null,
	initComponent : function() {
		var me = this;		
		this.items = [ {
			itemId : 'fieldMappingEditGridView'
		}];
		this.callParent(arguments);
	}

});