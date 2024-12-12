Ext.define('GCP.view.SCMProductView', {
	extend : 'Ext.container.Container',
	xtype : 'scmProductView',
	requires : ['Ext.container.Container', 'GCP.view.SCMProductTitleView',
			'GCP.view.SCMProductFilterView', 'GCP.view.SCMProductGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'scmProductTitleView',
					width : '100%',
					margin : '0 0 5 0'
				},{
					xtype : 'scmProductFilterView',
					width : '100%',
					margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By: ')+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {
					xtype : 'scmProductGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});