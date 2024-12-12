Ext.define('GCP.view.UserActivityAdvancedFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'userActivityAdvancedFilterPopup',
	requires : ['GCP.view.UserActivityCreateNewAdvFilter',
			'GCP.view.UserActivityAdvFilterGridView'],
	width : 500,
	height : 550,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function() {
		var me = this;
		var Advancedfiltertab = null;

		this.title = getLabel('btnAdvancedFilter', 'Advanced Filter');

		Advancedfiltertab = Ext.create('Ext.tab.Panel', {
					width : 500,
					height : 500,
					itemId : 'advancedFilterTab',
					items : [{
								title : getLabel('filters', 'Filters'),
								itemId : 'FilterSetTab',
								items : [{
											xtype : 'userActivityAdvFilterGridView',
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