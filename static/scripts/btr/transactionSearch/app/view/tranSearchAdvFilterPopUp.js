Ext.define('GCP.view.tranSearchAdvFilterPopUp', {
	extend : 'Ext.window.Window',
	xtype : 'tranSearchAdvFilterPopUp',
	requires : ['GCP.view.tranSearchCreateNewAdvFilter',
	            'GCP.view.tranSearchAdvFilterGridView'],
	width : 750,
	// width : 700,
	minHeight : 450,
	// tapPanelWidth : 670,
	tapPanelWidth : 720,
	autoHeight : true,
	modal : true,
	closeAction : 'hide',
	layout : 'vbox',
	initComponent : function() {
		var me = this;

		var Advancedfiltertab = null;
		me.title = getLabel('btnAdvancedFilter', 'Advanced Filter');
		Advancedfiltertab = Ext.create('Ext.tab.Panel', {
			width : this.tapPanelWidth,
			height : 'auto',
			itemId : 'advancedFilterTab',
			cls : 'adv-filter-tabPanel-height',
			items : [{
						title : getLabel('filtersList', 'Filters List'),
						itemId : 'FilterSetTab',
						items : [{
									xtype : 'tranSearchAdvFilterGridView'
								}]
					}, {
						title : getLabel('createNewFilter', 'Create New Filter'),
						itemId : 'filterDetailsTab',
						items : [me.filterPanel]
					}]

		});
		me.items = [Advancedfiltertab];
		me.on('resize', function() {
					me.doLayout();
					Advancedfiltertab.doLayout();
				});
		me.callParent(arguments);
	}
});