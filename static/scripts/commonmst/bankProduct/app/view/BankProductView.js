Ext.define('GCP.view.BankProductView', {
	extend : 'Ext.container.Container',
	xtype : 'bankProductView',
	requires : ['Ext.container.Container', 'GCP.view.BankProductGridView', 'GCP.view.BankProductFilterView', 'GCP.view.BankProductTitleView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'bankProductTitleView',
			width : '100%'
		},{
			xtype : 'bankProductFilterView',
			width : '100%',
			margin : '0 0 12 0',
			title :  getLabel( 'filterBy', 'Filter By: ')+
			 		'<img id="imgFilterInfo" class="largepadding icon-information"/>'+'</span>'
		},{
			xtype : 'bankProductGridView',
			width : '100%'
		}];
		me.on('resize', function() {
			me.doLayout();
		});
		me.callParent(arguments);
	}
});