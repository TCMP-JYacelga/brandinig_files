Ext.define('GCP.view.ClientBroadcastMessageView', {
	extend : 'Ext.container.Container',
	xtype : 'clientBroadcastMessageView',
	requires : ['Ext.container.Container',  'GCP.view.ClientBroadcastMessageGridView'],
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [
		/*{
					xtype : 'clientBroadcastMessageTitleView',
					width : '100%'
				},{
					xtype : 'clientBroadcastMessageFilterView',
					width : '100%',
					collapsible : true,
					collapsed : (blnCollapsed == null ? true : blnCollapsed),	
					title : '<span id=imgFilterInfoGridView>'+getLabel('filterBy', 'Filter By: ')+'</span>'
				}, */
				{
					xtype : 'clientBroadcastMessageGridView'
				}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});