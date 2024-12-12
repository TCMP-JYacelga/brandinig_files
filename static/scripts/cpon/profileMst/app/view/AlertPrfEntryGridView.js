Ext.define('GCP.view.AlertPrfEntryGridView', {
	extend : 'Ext.panel.Panel',
	border : false,
	xtype : 'alertPrfEntryGridView',
	requires : ['Ext.ux.gcp.SmartGrid', 'GCP.view.PrfMstDtlsActionBarView'],
	autoHeight : true,
	layout : 'vbox',
	initComponent : function() {
		var me = this, grid = null;
		
		actionBar = Ext.create('GCP.view.PrfMstDtlsActionBarView', {
					itemId : 'dtlsActionBar',
					height : 21,
					width : '100%',
					parent : me
				});

		textfieldAlertSearch = Ext.create('Ext.form.field.Text', {
					itemId : 'searchAlertEntryTextField',
					cls : 'w10',
					padding : '0 0 0 5'
				});

		radioMatchCriteria = Ext.create('Ext.form.RadioGroup', {
					xtype : 'radiogroup',
					itemId : 'matchCriteriaAlertEntry',
					vertical : true,
					columns : 1,
					items : [{
								boxLabel : getLabel('exactMatch', 'Exact Match'),
								name : 'searchOnPageAlertEntry',
								inputValue : 'exactMatchAlertEntry'
							}, {
								boxLabel : getLabel('anyMatch', 'Any Match'),
								name : 'searchOnPageAlertEntry',
								inputValue : 'anyMatchAlertEntry',
								checked : true
							}]

				});

		me.items = [{
			xtype : 'container',
			layout : 'hbox',
			cls : 'ux_panel-background',
			padding : '0 0 12 0',
			width : '100%',
			items : [{
							xtype : 'toolbar',
							itemId : 'btnCreateNewToolBar',
							cls : ' ux_panel-background',
							flex : 1,
							items : []
					 },{
						xtype : 'container',
						layout : 'hbox',
						cls : 'rightfloating ux_hide-image',
						items : [{
									xtype : 'button',
									border : 0,
									itemId : 'btnAlertSearchOnPageEntry',
									//padding : '4 0 4 0',
									text : getLabel('btnSearchOnPage',
											'Search on Page'),
									cls : 'xn-custom-button cursor_pointer',
									menu : Ext.create('Ext.menu.Menu', {
												itemId : 'menu',
												items : [radioMatchCriteria]
											})
								}, textfieldAlertSearch]
					}]
		}, {
			xtype : 'panel',
			collapsible : true,
			width : '100%',
			cls : 'xn-ribbon ux_border-bottom x-portlet gradiant_back',
			//style : 'top : 0px !important;',
			title : getLabel('alertProfiles', 'Alert Profiles'),
			itemId : 'prfMstDtlView',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						cls: 'ux_panel-transparent-background',
						itemId : 'prfMstActionsView',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'ux_font-size14',
									padding : '5 0 0 10'
								}, actionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								}]

					}]
		}];

		me.on('resize', function() {
					me.doLayout();
				});

		me.callParent(arguments);
	}
});