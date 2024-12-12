Ext.define('GCP.view.FileUploadCenterAdvancedFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'fileUploadCenterAdvancedFilterPopup',
	requires : ['GCP.view.FileUploadCenterCreateNewAdvFilter','GCP.view.FileUploadCenterAdvFilterGridView'],			
	width : 500,
	height : 320,
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
											xtype : 'fileUploadCenterAdvFilterGridView',
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