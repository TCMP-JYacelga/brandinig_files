Ext.define('GCP.view.SearchTransactionNewTemplateTabView', {
			extend : 'Ext.form.Panel',
			cls : 'form-pnl-cls',
			xtype : 'searchTransactionNewTemplateTabView',
			requires : [ 'Ext.form.Label'],
			itemId : "searchTransactionNewTemplateTabView",
			padding : '15 0 0 0',
			height : 300,
			initComponent : function() {
				var me = this;
				this.callParent(arguments);
			}
		});