Ext.define('GCP.view.PaymentPackageView', {
	extend : 'Ext.container.Container',
	xtype : 'paymentPackageView',
	requires : ['Ext.container.Container', 'GCP.view.PaymentPackageTitleView',
			'GCP.view.PaymentPackageFilterView', 'GCP.view.PaymentPackageGridView'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'paymentPackageTitleView',
					width : '100%'
				},{
					xtype : 'paymentPackageFilterView',
					width : '100%',
					title : getLabel( 'filterBy', 'Filter By: ')+
			 				'<img id="imgFilterInfo" class="largepadding icon-information"/>'+'</span>'
				}, {
					xtype : 'paymentPackageGridView',
					width : '100%',
					parent : me
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});