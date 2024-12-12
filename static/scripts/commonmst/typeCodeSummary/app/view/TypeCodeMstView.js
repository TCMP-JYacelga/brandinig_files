Ext.define('GCP.view.TypeCodeMstView', {
	extend : 'Ext.container.Container',
	xtype : 'typeCodeMstView',
	width : '100%',
	requires : ['GCP.view.TypeCodeMstTitleView','GCP.view.TypeCodeMstGridView','GCP.view.TypeCodeMstFilterView'],
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'typeCodeTitleView',
					width : '100%',
					/*margin : '0 0 12 0'*/
					cls : 'ux_no-border ux_largepaddingtb'
				},{
					xtype : 'typeCodeFilterView',
					width : '100%',
					margin : '0 0 12 0',
					title : getLabel('filterBy', 'Filter By: ')+
								'<img id="imgFilterInfo" class="largepadding icon-information"/>'+'</span>'
				},{
					xtype : 'typeCodeMstGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});