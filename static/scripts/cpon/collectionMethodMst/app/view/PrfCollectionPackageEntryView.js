Ext.define('GCP.view.PrfCollectionPackageEntryView', {
	extend : 'Ext.panel.Panel',
	border : false,
	xtype : 'prfCollectionPackageEntryView',
	requires : ['Ext.ux.gcp.SmartGrid'],
	//autoHeight : true,
	//layout : 'vbox',
	initComponent : function() {
		var me = this, grid = null;
		
		actionBar = Ext.create('Ext.toolbar.Toolbar', {
					itemId : 'dtlsActionBar',
					componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
					height : 21,
					width : '100%',
					items : [{
							text : getLabel('prfMstActionUnassign', 'Unassign'),
							disabled : true,
							itemId:'unassignBtn',
							actionName : 'unassign',
							maskPosition : 9
						}]
				});
		
		textfieldAlertSearch = Ext.create('Ext.form.field.Text', {
					itemId : 'searchPrfPkgTextField',
					cls : 'w10',
					padding : '0 0 0 5'
				});

		radioMatchCriteria = Ext.create('Ext.form.RadioGroup', {
					xtype : 'radiogroup',
					itemId : 'matchCriteriaPrfPkg',
					vertical : true,
					columns : 1,
					items : [{
								boxLabel : getLabel('exactMatch', 'Exact Match'),
								name : 'searchOnPagePrfPkg',
								inputValue : 'exactMatchPrfPkg'
							}, {
								boxLabel : getLabel('anyMatch', 'Any Match'),
								name : 'searchOnPagePrfPkg',
								inputValue : 'anyMatchPrfPkg',
								checked : true
							}]

				});

		me.items = [{
			xtype : 'container',
			layout : 'hbox',
			cls : 'ux_panel-background ux_extralargepaddingtb',
			width : '100%',
			items : [{
					xtype:'container',
					cls : 'ux_panel-background',
					itemId : 'prdSelectionContainer',
					items:[{
						xtype : 'button',
						border : 0,
						itemId : 'selectProdBtn',
						padding : '4 0 4 0',
						text : '<span class="button_underline">'
								+ getLabel('selectProd','Selected Product')
								+ '</span>',
						cls : 'cursor_pointer ux_panel-background'
					},
					{
						xtype : 'button',
						border : 0,
						itemId : 'cpyPkgBtn',
						padding : '4 0 4 0',
						text : '<span class="button_underline">'
								+ getLabel('copyCollectionPackage','Copy Collection Method')
								+ '</span>',
						cls : ' cursor_pointer ux_panel-background'
					}]}
					,{
						xtype : 'label',
						text : '',
						flex:1
					}, {
						xtype : 'container',
						layout : 'hbox',
						cls : 'rightfloating ux_hide-image',
						items : [{
									xtype : 'button',
									border : 0,
									itemId : 'btnPrfPkgSearchOnPage',
									padding : '4 0 4 0',
									text : getLabel('searchOnPage',
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
			cls : 'xn-ribbon ux_border-bottom ux_panel-transparent-background',
			bodyCls : 'x-portlet ux_no-padding',
			title : getLabel('collectionProduct', 'Collection Product'),
			itemId : 'prfMstDtlView',
			items : [{
						xtype : 'container',
						layout : 'hbox',
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