Ext.define('GCP.view.SearchTransactionFilterSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'searchTransactionFilterSummaryView',
	requires : ['Ext.panel.Panel', 'Ext.Img', 'Ext.form.Label',
			'Ext.button.Button'],
	width : '100%',
	margin : '5 0 0 0',
	collapsible : true,
	title : getLabel('filtersummary', 'Filter Summary'),
	cls : 'xn-ribbon',
	componentCls : 'gradiant_back',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		this.items = [];
		this.callParent(arguments);
	}
});