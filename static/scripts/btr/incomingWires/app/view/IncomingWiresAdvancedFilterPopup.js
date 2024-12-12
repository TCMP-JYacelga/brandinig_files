Ext.define('GCP.view.IncomingWiresAdvancedFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'incomingWiresAdvancedFilterPopup',
	requires : ['GCP.view.IncomingWireCreateNewAdvFilter','GCP.view.IncomingWireSummaryAdvFilterGridView'],			
	width : 660,
	//height : 410,
	tapPanelWidth:750,
	//tapPanelHeight:405,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function() {
		var me = this;
		var Advancedfiltertab = null;

		this.title = getLabel('btnAdvancedFilter', 'Advance Filter');

		Advancedfiltertab = Ext.create('Ext.tab.Panel', {
					width : this.tapPanelWidth,
					height : this.tapPanelHeight,
					itemId : 'advancedFilterTab',
					items : [{
								title : getLabel('filters', 'Filters'),
								itemId : 'FilterSetTab',
								items : [{
											xtype : 'incomingWireSummaryAdvFilterGridView',
											callerParent : me.parent
										}]
							}, {
								title : getLabel('createNewFilter', 'Create New Filter'),
								itemId : 'filterDetailsTab',
								items : [me.filterPanel]
							}]
				});

		me.items = [Advancedfiltertab];

		this.callParent(arguments);
	}
});