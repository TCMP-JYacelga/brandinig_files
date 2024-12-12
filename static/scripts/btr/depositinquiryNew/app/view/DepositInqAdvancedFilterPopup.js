Ext.define('GCP.view.DepositInqAdvancedFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'depositInqAdvancedFilterPopup',
	requires : ['GCP.view.DepositInqCreateNewAdvFilter',
			'GCP.view.DepositInqAdvFilterGridView'],
	width : 530,
	//height : 310,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function() {
		var me = this;
		var Advancedfiltertab = null;

		this.title = getLabel('btnAdvancedFilter', 'Advanced Filter');

		Advancedfiltertab = Ext.create('Ext.tab.Panel', {
					//width : 500,
					//height : 380,
					itemId : 'advancedFilterTab',
					items : [{
								title : getLabel('filters', 'Filters'),
								itemId : 'FilterSetTab',
								items : [{
											xtype : 'depositInqAdvFilterGridView',
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