Ext.define('GCP.view.IncomingWiresView', {
	extend : 'Ext.panel.Panel',
	xtype : 'incomingWiresView',
	requires : ['GCP.view.IncomingWiresGridView','GCP.view.IncomingWiresFilterView','GCP.view.IncomingWiresGridInformationView',
	            'GCP.view.IncomingWiresGridTitleView','GCP.view.IncomingWiresAdvancedFilterPopup','Ext.tab.Panel','Ext.tab.Tab'],
	width : '100%',
	autoHeight : true,
	//minHeight : 600,
	cls : 'ux_panel-background',
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'incomingWiresGridTitleView',
					width : '100%',
					cls : 'ux_largepaddingtb'
					},
					{
						xtype : 'incomingWiresFilterView',
						width : '100%',
						margin : '12 0 0 0',
						collapsible : true,
			            collapsed :filterPanelCollapsed
						//title : getLabel('filterBy', 'Filter By: ')+'<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'
	
					}, 
					{
						xtype : 'incomingWiresGridInformationView',
						margin : '12 0 0 0'
					},
					{
						xtype : 'incomingWiresGridView',
						width : '100%',
						margin : '12 0 0 0',
						cls : 'ux_panel-transparent-background ux_border-bottom',
						parent : me
				 }];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});