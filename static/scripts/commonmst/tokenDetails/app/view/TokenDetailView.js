Ext.define('GCP.view.TokenDetailView', {
	extend : 'Ext.container.Container',
	xtype : 'tokenDetailView',
	requires : ['Ext.container.Container', 'GCP.view.TokenDetailTitleView',
			'GCP.view.TokenDetailFilterView', 'GCP.view.TokenDetailGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		//var tokenImportToolBar = me.createTokenImportToolBar();
		me.items = [{
					xtype : 'tokenDetailTitleView',
					width : '100%'
				},{
					xtype : 'tokenDetailFilterView',
					width : '100%',
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {
					xtype : 'tokenDetailGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}	
});