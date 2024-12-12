Ext.define('GCP.view.CollectionMethodView', {
	extend : 'Ext.container.Container',
	xtype : 'collectionMethodView',
	requires : ['Ext.container.Container', 'GCP.view.CollectionMethodTitleView',
			'GCP.view.CollectionMethodFilterView', 'GCP.view.CollectionMethodGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'collectionMethodTitleView',
					width : '100%'
				},{
					xtype : 'collectionMethodFilterView',
					width : '100%',
					title : getLabel('filterBy', 'Filter By: ')
					+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {
					xtype : 'collectionMethodGridView',
					width : '100%',
					parent : me
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});