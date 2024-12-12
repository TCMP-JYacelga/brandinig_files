Ext.define('GCP.view.EODCenterGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid'],
	xtype : 'eodCenterGridView',
	//cls : 'xn-panel',
	//bodyPadding : '2 4 2 2',
	bodyPadding : '0 0 0 0',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function() {
		var me = this;
		var storeData = null;

		Ext.Ajax.request({
					url : 'services/userseek/adminSellersListCommon.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var sellerData = data.d.preferences;
						if (!Ext.isEmpty(data)) {
							storeData = sellerData;
						}
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}
				});

		var objStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'preferences'
					}
				});
				
		this.items = [{
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						width : '100%',
						//margin : '6 0 3 0',
						margin : '0 0 0 0',
						flex : 1,
						items : [{
									xtype : 'label',
									text : '',
									flex : 1
								}, {
									xtype : 'container',
									layout : 'hbox',
									cls : 'rightfloating ux_hide-image',
									items : [{
										xtype : 'button',
										border : 0,
										itemId : 'btnSearchOnPage',
										text : getLabel('searchOnPage',
												'Search on Page'),
										cls : 'xn-custom-button cursor_pointer',
										padding : '0 0 0 3',
										menu : Ext.create('Ext.menu.Menu', {
													itemId : 'menu',
													items : [{
														xtype : 'radiogroup',
														itemId : 'matchCriteria',
														vertical : true,
														columns : 1,
														items : [{
															boxLabel : getLabel(
																	'exactMatch',
																	'Exact Match'),
															name : 'searchOnPage',
															inputValue : 'exactMatch'
														}, {
															boxLabel : getLabel(
																	'anyMatch',
																	'Any Match'),
															name : 'searchOnPage',
															inputValue : 'anyMatch',
															checked : true
														}]

													}]
												})
									}, {
										xtype : 'textfield',
										itemId : 'searchTxnTextField',
										cls : 'w10',
										padding : '0 0 0 5'
									}]
								}]
					}]
		}, {
					xtype : 'panel',
					collapsible : true,
					//cls : 'xn-panel',
					cls : 'x-portlet xn-panel ux_file-details-panel ux_panel-transparent-background',
					title : getLabel('preEodDetails', 'Pre End of the day'),
					itemId : 'preEodCenterDtlViewId',
					items : [{
								xtype : 'container',
								layout : 'hbox',
								cls : 'ux_panel-transparent-background',
								flex : 1,
								margin : '6 0 3 10',
								items : [
									{
										xtype : 'label',
										text : getLabel('financialInstitution', 'Financial Institution'),
										cls : 'ux_font-size14',
										padding : '3 10 0 0'
									},
									{
										xtype : 'combobox',
										displayField : 'DESCR',
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										filterParamName : 'sellerId',
										itemId : 'sellerFltId',
										valueField : 'CODE',
										name : 'sellerCombo',
										editable : false,
										value :sessionSellerCode,
										store : objStore,
										width : 185,
										matchFieldWidth : true,
										listeners : {
											'render' : function(combo, record) {
												combo.store.load();
											},
											'select' : function(combo, strNewValue, strOldValue) {
												setAdminSeller(combo.getValue());
											}
										}
									}]
							},{
								xtype : 'container',
								layout : 'hbox',
								itemId : 'preEodContainer',
								margin : '6 0 3 10',
								cls : 'ux_panel-transparent-background',
								flex : 1,
								items : [
									{
										xtype : 'button',
										cls : 'xn-button ux_button-background-color ux_search-button',
										text : getLabel('btnPreEoD', '&nbsp;Start Pre EOD'),
										itemId : 'btnPreEoD',
										disabled : 'false' === hasRunPermission,
										handler : function(btn) {
											runPreEoD();
										}
									},
									{
										xtype : 'container',
										layout : 'hbox',
										itemId : 'datesContainer',
										margin : '6 0 3 10',
										items : [{
											xtype : 'label',
											text : getLabel('applDate', 'Current Application Date: '),
											cls : 'ux_font-size14',
											padding : '0 0 0 0'
											
										},
										{
											xtype : 'label',
											itemId : 'applDate',
											text : eodApplDate,
											cls : 'ux_font-size12',
											padding : '0 0 0 5'
										},
										{
											xtype : 'label',
											text : '',
											height : 18,
											padding : '0 0 0 0'
										},									
										{
											xtype : 'image',
											src : 'static/images/icons/icon_spacer.gif',
											height : 18,
											padding : '0 0 0 5'
										},
										{
											xtype : 'label',
											text : getLabel('nextApplDate', 'Next Application Date: '),
											cls : 'ux_font-size14 rightAlign',
											padding : '0 0 0 5'
										},
										{
											xtype : 'label',
											itemId : 'nextApplDate',
											text : eodNextApplDate,
											cls : 'ux_font-size12 rightAlign',
											padding : '0 0 0 5'
										}]
																		
									}							
								]
							}]
			},
			{
				xtype : 'panel',
				collapsible : true,
				//cls : 'xn-panel',
				cls : 'x-portlet xn-panel ux_file-details-panel ux_panel-transparent-background',
				title : getLabel('eodDetails', 'End of the day'),
				itemId : 'eodCenterDtlViewId',
				items : [{
						xtype : 'container',
						layout : 'hbox',
						//margin : '6 0 3 10',
						margin : '6 0 3 10',
						cls : 'ux_panel-transparent-background',
						flex : 1,
						items : [{
									xtype : 'label',
									text : ''
									//flex : 1
								}]
					},
					{
						xtype : 'progressbar',
						layout : 'hbox',
						width : '33%',
						itemId : 'eodProgressBar',
						margin : '6 0 3 10',
						text : '0%'
					}]
					}
					];
		this.callParent(arguments);
	}
	

});