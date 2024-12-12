Ext.define('CPON.view.CounterPartyAccMstView', {
	extend : 'Ext.container.Container',
	xtype : 'counterPartyAccMstView',
	requires : ['Ext.container.Container','CPON.view.CounterPartyAccMstFilterView', 'CPON.view.CounterPartyAccMstGridView'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [/*{
					xtype : 'counterPartyAccMstFilterView',
					width : '100%',
					margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By :')
					+ ' <img id="imgGridViewInfo" class="largepadding icon-information"/>'
				},*/{
					xtype : 'counterPartyAccMstGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});