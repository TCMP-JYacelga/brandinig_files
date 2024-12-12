Ext.define('GCP.view.LMSInterAccountParameterListView', {
	extend : 'Ext.container.Container',
	xtype : 'lmsInterAccountParameterListView',
	requires : ['Ext.container.Container', 'GCP.view.LMSInterAccountParameterListTitleView',
			'GCP.view.LMSInterAccountParameterListFilterView', 'GCP.view.LMSInterAccountParameterListGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [/*{
					xtype : 'lmsInterAccountParameterListTitleView',
					width : '100%',
					margin : '0 0 5 0'
				},*/{
					xtype : 'lmsInterAccountParameterListFilterView',
					width : '100%',
					margin : '0px 0px 5px 0px',
					title : getLabel('filterLabel', 'Filter By')
							
				}, {
					xtype : 'lmsInterAccountParameterListGridView',
					width : '100%',
					padding : '20px 0px 0px 0px'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});