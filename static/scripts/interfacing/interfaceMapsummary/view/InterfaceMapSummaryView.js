Ext.define('GCP.view.InterfaceMapSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'interfaceMapSummaryView',
	requires : ['GCP.view.InterfaceMapSummaryFilterView',
			'GCP.view.InterfaceMapSummaryInfoView',
			'GCP.view.InterfaceMapSummaryTitleView', 'Ext.tab.Panel',
			'Ext.tab.Tab', 'Ext.layout.container.HBox', 'Ext.form.Label',
			'Ext.button.Button', 'Ext.Img', 'Ext.panel.Panel',
			'Ext.ux.portal.WidgetContainer', 'Ext.form.field.Text',
			'Ext.container.Container', 'Ext.form.RadioGroup'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var menuItems = null;
		if (isBankFlag === 'true') {
			menuItems = [{
						xtype : 'label',
						margin : '7 0 3 0',
						cls : 'ux_font-size14',
						text : getLabel('createNew', 'Create : ')
					}, {
						xtype : 'button',
						itemId : 'uploadDefId',
						name : 'alert',
						margin : '7 0 5 0',
						text : '<span class="button_underline thePointer">'
								+ getLabel('uploadDefinition',
										'Upload Definition') + '</span>',
						cls : 'xn-account-filter-btnmenu'

					}, {
						xtype : 'button',
						itemId : 'downloadDefId',
						name : 'alertDownload',
						margin : '7 0 5 0',
						text : '<span class=" button_underline thePointer">'
								+ getLabel('downloadDefinition',
										'Download Definition') + '</span>',
						disabled : false,
						cls : 'xn-account-filter-btnmenu'

					}]
		}
		me.items = [{
			xtype : 'interfaceMapSummaryTitleView',
			cls : 'ux_no-border ux_largepaddingtb ',
			width : '100%'
				// margin : '0 0 1 0'
			}, {
			xtype : 'panel',
			layout : {
				type : 'hbox'
			},
			items : menuItems
		}, {
			xtype : 'interfaceMapSummaryFilterView',
			// margin : '0 0 10 0',
			title : getLabel('filterBy', 'Filter By: ')
		},/* {
			xtype : 'interfaceMapSummaryInfoView'
				// margin : '5 0 5 0'
			},*/ {
			xtype : 'panel',
			height : '200',
			layout : 'hbox',
			hidden : true,
			flex : 1,
			padding : '2 0 0 0',
			items : [{
						xtype : 'label',
						text : '',
						flex : 1
					}, {
						xtype : 'container',
						layout : 'hbox',
						cls : 'rightfloating',
						items : [{
							xtype : 'button',
							border : 0,
							itemId : 'btnSearchOnPage',
							text : getLabel('searchOnPage', 'Search on Page'),
							cls : 'xn-custom-button cursor_pointer',
							padding : '5 0 0 3',
							menu : Ext.create('Ext.menu.Menu', {
										items : [{
											xtype : 'radiogroup',
											itemId : 'widgetMatchCriteria',
											vertical : true,
											columns : 1,
											items : [{
												boxLabel : getLabel(
														'exactMatch',
														'Exact Match'),
												name : 'widgetAdvanceFlt',
												inputValue : 'exactMatch'
											}, {
												boxLabel : getLabel('anyMatch',
														'Any Match'),
												name : 'widgetAdvanceFlt',
												inputValue : 'anyMatch',
												checked : true
											}]

										}]
									})

						}, {
							xtype : 'textfield',
							itemId : 'searchTxnTextField',
							cls : 'w10',
							padding : '2 0 0 5'

						}]
					}]
		}, {
			xtype : 'widgetContainer',
			itemId : 'moduleContainer',
			cls : 'xn-ribbon ux_extralargemargin-top ',
			autoHeight : true,
			autoScroll : false,
			minHeight : 300,
			width : 'auto'
		}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});