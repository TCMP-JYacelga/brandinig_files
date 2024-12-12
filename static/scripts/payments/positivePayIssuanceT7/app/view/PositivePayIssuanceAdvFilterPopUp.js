Ext.define('GCP.view.PositivePayIssuanceAdvFilterPopUp', {
	extend : 'Ext.window.Window',
	xtype : 'positivePayIssuanceAdvFilterPopUp',
	requires : ['GCP.view.PositivePayIssuanceCreateNewAdvFilter',
			'GCP.view.PositivePayIssuanceAdvFilterGridView'],
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
		this.title = getLabel('btnAdvancedFilter', 'Advanced Filter');
		Advancedfiltertab = Ext.create('Ext.tab.Panel', {
			width : this.tapPanelWidth,
			height : 'auto',
			itemId : 'advancedFilterTab',
			cls : 'adv-filter-tabPanel-height',
			items : [{
						title : getLabel('filtersList', 'Filters List'),
						itemId : 'FilterSetTab',
						items : [{
									xtype : 'positivePayIssuanceAdvFilterGridView'
								}]
					}, {
						title : getLabel('createNewFilter', 'Create New Filter'),
						itemId : 'filterDetailsTab',
						processFromDate : me.processFromDate,
						processToDate : me.processToDate,
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