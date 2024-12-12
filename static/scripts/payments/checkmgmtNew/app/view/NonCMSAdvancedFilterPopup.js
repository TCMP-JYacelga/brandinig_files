Ext.define('GCP.view.NonCMSAdvancedFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'nonCMSAdvancedFilterPopup',
	requires : ['GCP.view.NonCMSCreateNewAdvFilter',
			'GCP.view.NonCMSAdvFilterGridView'],
	width : 500,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function() {
		var me = this;
		var Advancedfiltertab = null;

		this.title = getLabel('btnAdvancedFilter', 'Advanced Filter');

		Advancedfiltertab = Ext.create('Ext.tab.Panel', {
					width : 600,
					itemId : 'advancedFilterTab',
					items : [{
								title : getLabel('filters', 'Filters'),
								itemId : 'FilterSetTab',
								items : [{
											xtype : 'nonCMSAdvFilterGridView',
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