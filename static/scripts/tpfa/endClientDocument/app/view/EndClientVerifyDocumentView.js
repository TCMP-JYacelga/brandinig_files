Ext.define('GCP.view.EndClientVerifyDocumentView', {
	extend : 'Ext.container.Container',
	xtype : 'EndClientVerifyDocumentView',
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.panel.Panel' ],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;

		$(document).on('OnSaveRestoreGrid', function() {
			me.refreshGridData(me);
		});

		me.items = [ {
			xtype : 'panel',
			width : '100%',
			cls : 'xn-panel',
			autoHeight : true,
			itemId : 'viewDocumentDtl',
			items : []
		} ];
		me.callParent(arguments);
	},

	refreshGridData : function(me) {
		var grid = me.down('smartgrid');
		me.down('smartgrid').refreshData();
	}
});