Ext.define('GCP.view.CounterPartyView', {
	extend : 'Ext.container.Container',
	xtype : 'counterPartyView',
	requires : ['Ext.container.Container', 'GCP.view.CounterPartyTitleView',
			'GCP.view.CounterPartyFilterView', 'GCP.view.CounterPartyGridView'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'counterPartyTitleView',
					width : '100%'
				},{
					xtype : 'counterPartyFilterView',
					width : '100%',
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {
					xtype : 'counterPartyGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});