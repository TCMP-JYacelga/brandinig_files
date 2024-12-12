Ext.define( 'GCP.view.CodeMapFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'codeMapFilterViewType',
	requires :
	[
		'Ext.ux.gcp.AutoCompleter'
	],
	width : '100%',
	margin : '0 0 10 0',
	componentCls : 'gradiant_back ux_border-bottom',
	collapsible : true,
	collapsed :true,
	cls : 'xn-ribbon ux_extralargemargin-top',
	layout :
	{
		type : 'vbox'
	},
	initComponent : function()
	{
		var codeMapSummaryView = this;
		var me = this;
		var statusStore = Ext.create('Ext.data.Store', {
			fields : ["name", "value"],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'services/categoryStatusList.json',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'd.filter'
				}
			}
		});
		this.items =
		[
			{
				xtype : 'panel',
				layout : 'hbox',
				width : '100%',
				cls: 'ux_border-top ux_largepadding',
				items :
				[
					{
						xtype : 'container',
						width : '100%',
						layout : 'column',
						items :
						[
							{
								   xtype : 'container',
								   columnWidth : 0.22,
								   padding : '5px',
						           hidden : entityType == '0' ? false : true,
						           items: 
						           [
						        	   {
						        		   xtype : 'label',
						        		   cls : 'f20 ux_font-size14 ux_normalmargin-bottom',
						        		   text : getLabel( 'lbl.codeMap.Seller', 'Financial Institution' )									
						        	   },
						        	   {
											xtype : 'combobox',
											width : 'auto',
											cls:'w165',
											fieldCls : 'xn-form-field inline_block ux_font-size14-normal ',
											triggerBaseCls : 'xn-form-trigger',
											filterParamName : 'sellerId',
											editable : false,
											// autoSelect: false,
											name : 'seller',
											itemId : 'sellerIdItemId',
											displayField : 'DESCRIPTION',
											valueField : 'CODE',
											queryMode : 'local',
											listeners : {
												'select' : function(combo,
														record) {
													sellerValue = combo
															.getValue();
													setAdminSeller(sellerValue);
												//	codeMapSummaryView.seller = sellerValue;
													me.sellerFilterVal = sellerValue;
													var field = codeMapSummaryView
															.down('combobox[itemId="sellerIdItemId"]');
													field.setValue(sellerValue);
													field.setRawValue(combo.rawValue);

													field.cfgExtraParams = [ {
														key : '$filtercode1',
														value : sellerValue
													} ];
												}
											}
						        	   }
						        	]
								},
														        	   {	
											xtype : 'panel',
											cls : 'xn-filter-toolbar',
											flex : 0.25,
											layout : 'vbox',
											columnWidth : 0.22,
											items :[{
												xtype : 'label',
												text : getLabel('status', 'Status'),
												cls : 'frmLabel',
												flex : 0.20
											},
											{
												xtype : 'combo',
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												width : 165,
												itemId : 'statusFilter',	
												store : statusStore,
												valueField : 'name',
												displayField : 'value',
												name : 'requestState',
												editable : false,
												value :  getLabel('all', 'All')
							/*					listeners : {
													'select' : function(combo, strNewValue, strOldValue) {
														me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
													}
												}*/
											}]
										},

									{
										xtype : 'panel',
										cls : 'xn-filter-toolbar',
										layout : 'vbox',
										columnWidth : 0.22,
										flex : 0.25,
										items : [{
													xtype : 'panel',
													layout : 'hbox',
													padding : '23 0 1 0',
													items : [{
																xtype : 'button',
																itemId : 'btnFilter',
																text : getLabel('search',
																		'Search'),
																cls : 'search_button ux_button-background-color ux_button-padding',														
																height : 25
															}]
												}]
									},
								{
									xtype : 'container',
									columnWidth : 0.3,
									padding : '5px',
									hidden : isBankCodeMap == 'true' ? true : false,
									items : 
									[
										{
											xtype : 'label',
											text : getLabel( 'lbl.codeMap.client', 'Client' ),
											cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
										}, 
										{
											xtype : 'AutoCompleter',
											fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
											cls:'ux_font-size14-normal',
											labelSeparator : '',
											name : 'clientId',
											itemId : 'clientIdItemId',
											cfgUrl : 'services/userseek/codeMapClientIdSeek.json',
											cfgQueryParamName : '$autofilter',
											cfgRecordCount : -1,
											cfgSeekId : 'clientIdIdSeek',
											cfgRootNode : 'd.preferences',
											cfgKeyNode : 'CODE',
											cfgDataNode1 : 'DESCRIPTION',
											cfgStoreFields :
											[
												'CODE', 'DESCRIPTION'
											]
										}
									]
								}
						]
					}
				]
			}
		];
		
		me
		.on(
				'afterrender',
				function(panel) {
					Ext.Ajax
							.request({
								url : 'services/userseek/codeMapSellerIdSeek.json',
								method : "POST",
								async : false,
								success : function(
										response) {
									if (response
											&& response.responseText)
										me
												.populateSellerMenu(Ext
														.decode(response.responseText));
								},
								failure : function(
										response) {
									// console.log('Error
									// Occured');
								}
							});
				});
		
		this.callParent( arguments );
	},
	populateSellerMenu : function(data) {
		var me = this;
		var storeValue = null;
		var sellerDrop = me
				.down('combobox[itemId="sellerIdItemId"]');
		var sellerArray = data || [];

		if( data.d && data.d.preferences )
		{
			storeValue = data.d.preferences;
		}
		var objStore = Ext.create('Ext.data.Store', {
			fields : [ 'CODE', 'DESCRIPTION','DISPATCHBANK' ],
			data : storeValue,
			reader : {
				type : 'json'
			}
		});
		sellerDrop.store = objStore;
		if( objStore.totalCount > 0 )
			sellerDrop.setValue(sellerValue);
	}/*,
	tools :
	[
		{
			xtype : 'button',
			itemId : 'btnSavePreferencesItemId',
			icon : 'static/images/icons/save.gif',
			disabled : true,
			text : getLabel( 'saveFilter', 'Save Filters' ),
			cls : 'xn-account-filter-btnmenu',
			textAlign : 'right',
			width : 85
		}
	]*/
} );
