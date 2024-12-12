Ext.define('CPON.view.FSCFeatureAccMstView', {
	extend : 'Ext.container.Container',
	xtype : 'fscFeatureAccMstView',
	requires : ['Ext.container.Container','CPON.view.FSCFeatureAccMstFilterView', 'CPON.view.FSCFeatureAccMstGridView'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [/*{
					xtype : 'fscFeatureAccMstFilterView',
					width : '100%',
					margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By :')
					+ ' <img id="imgFilterInfo" class="largepadding icon-information"/>'
				},*/ {
					xtype : 'fscFeatureAccMstGridView',
					padding:'2 2 2 2',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});