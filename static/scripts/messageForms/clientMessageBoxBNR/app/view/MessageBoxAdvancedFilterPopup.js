Ext.define('GCP.view.MessageBoxAdvancedFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'messageBoxAdvancedFilterPopup',
	requires : ['GCP.view.MessageBoxCreateNewAdvFilter',
			'GCP.view.MessageBoxSummaryAdvFilterGridView'],
	width : 500,
	height : 450,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function() {
		var me = this;
		var Advancedfiltertab = null;

		this.title = getLabel('btnAdvancedFilter', 'Advanced Filter');

		Advancedfiltertab = Ext.create('Ext.tab.Panel', {
					width : 600,
					height : 450,
					itemId : 'advancedFilterTab',
					items : [{
								title : getLabel('filters', 'Filters'),
								itemId : 'FilterSetTab',
								items : [{
											xtype : 'messageBoxSummaryAdvFilterGridView',
											callerParent : me.parent
										}]
							}, {
								title : getLabel('createNewFilter', 'Create New Filter'),
								itemId : 'filterDetailsTab',
								items : [me.filterPanel
								/*
								 * { xtype:'pmtCreateNewAdvFilter', margin :'4 0
								 * 0 0', callerParent : me.parent }
								 */]
							}]
				});

		me.items = [Advancedfiltertab];

		this.callParent(arguments);
	}
});