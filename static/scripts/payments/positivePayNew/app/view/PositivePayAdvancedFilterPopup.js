Ext.define('GCP.view.PositivePayAdvancedFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'positivePayAdvancedFilterPopup',
	requires : ['GCP.view.PositivePayCreateNewAdvFilter','GCP.view.PositivePaySummaryAdvFilterGridView'],			
	width : 650,
	height : 320,
	tapPanelWidth:700,
	tapPanelHeight:400,
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
											xtype : 'positivePaySummaryAdvFilterGridView',
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