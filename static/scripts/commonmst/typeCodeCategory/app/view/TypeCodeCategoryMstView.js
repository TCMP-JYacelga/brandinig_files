Ext.define('GCP.view.TypeCodeCategoryMstView', {
	extend : 'Ext.container.Container',
	xtype : 'typeCodeCategoryMstView',
	width : '100%',
	requires : ['GCP.view.TypeCodeCategoryMstTitleView','GCP.view.TypeCodeCategoryMstGridView','GCP.view.TypeCodeCategoryMstFilterView'],
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'typeCodeCategoryTitleView',
					width : '100%',
					margin : '0 0 12 0'
				},{
					xtype : 'typeCodeCategoryFilterView',
					width : '100%',
					margin : '0 0 12 0',
					title : getLabel('filterBy', 'Filter By: ')+
							'<img id="imgFilterInfo" class="largepadding icon-information"/>'+'</span>'
				},{
					xtype : 'typeCodeCategoryMstGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});