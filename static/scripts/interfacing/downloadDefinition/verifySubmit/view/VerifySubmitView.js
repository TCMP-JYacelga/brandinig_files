Ext.define('GCP.view.VerifySubmitView', {
	extend : 'Ext.panel.Panel',
	xtype : 'verifySubmitView',
	requires : ['GCP.view.VerifySubmitFormatDetailsView','GCP.view.VerifySubmitFileDetailsView',
	            'GCP.view.VerifySubmitHookDetailsView','Ext.tab.Panel','Ext.tab.Tab'],
	width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
						xtype : 'verifySubmitFormatDetailsView'
						
					},{
						xtype : 'verifySubmitHookDetailsView'
						
				 },{
						xtype : 'verifySubmitFileDetailsView'
						
				 }];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});