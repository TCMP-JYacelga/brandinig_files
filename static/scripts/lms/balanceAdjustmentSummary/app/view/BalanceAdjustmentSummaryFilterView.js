Ext.define( 'GCP.view.BalanceAdjustmentSummaryFilterView',
	{
		extend : 'Ext.panel.Panel',
		xtype : 'balanceAdjustmentSummaryFilterViewType',
		requires : 
		[
		   'Ext.ux.gcp.AutoCompleter'
		],
		width : '100%',
		margin : '0 0 10 0',
		componentCls : 'gradiant_back',
		collapsible : true,
		collapsed : true,
		cls : 'xn-ribbon ux_border-bottom',
		layout :
		{
			type : 'vbox',
			align : 'stretch'
		},
		initComponent : function()
		{
			var statusStore;
			if(entity_type === '0')
			{
				Ext.Ajax.request(
						{
							url : 'services/sellerListFltr.json'+"?" + csrfTokenName + "=" + csrfTokenValue,
							method : 'POST',
							async: false,
							success : function( response )
							{
								var data = Ext.decode( response.responseText );
								var sellerData = data.filterList;
								if( !Ext.isEmpty( data ) ){
									storeData = data;
								}
							},
							failure : function(response)
							{
								// console.log("Ajax Get data Call Failed");
							}
				});
				var objStore = Ext.create('Ext.data.Store', {
							fields : ['sellerCode', 'description'],
							data : storeData,
							reader : {
								type : 'json',
								root : 'filterList'
							}
							});
				if(objStore.getCount() > 1){
					multipleSellersAvailable = true;
				}
			}
			statusStore = Ext.create( 'Ext.data.Store',
					{
						fields :
						[
							'key', 'value'
						],
						data :
						[
							{
								"key" : "all",
								"value" : getLabel( 'lblAll', 'All' )
							},
							{
								"key" : "0N",
								"value" : getLabel( 'lblNew', 'New' )
							},
							{
								"key" : "0Y",
								"value" : getLabel( 'lblSubmitted', 'Submitted' )
							},
							{
								"key" : "3N",
								"value" : getLabel( 'lblAuthorized', 'Approved' )
							},
							{
								"key" : "7N",
								"value" : getLabel( 'lblRejected', 'Rejected' )
							}
						]
					} );
			this.items =
			[
				{
					xtype : 'panel',
					layout : 'hbox',
					cls : 'ux_largepadding',
					items :
					[
						//Panel 1
						{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							flex : 0.05,
							hidden : multipleSellersAvailable == true ? false : true,
							layout :
							{
								type : 'vbox'
							},
							items :
							[
								{
									xtype : 'panel',
									layout :
									{
										type : 'hbox'
									},width : 150,
									items :
									[
										{
											xtype : 'label',
											text : getLabel( 'lbl.notionalMst.seller', 'Financial Institution' ),
											cls : 'frmLabel'
										}
									]
								},
								{
									xtype : 'combo',
									displayField : 'description',
									cls: 'w15',
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'sellerCode',
									itemId : 'entitledSellerIdItemId',
									valueField : 'sellerCode',
									name : 'sellerCombo',
									editable : false,
									value :strSellerId,
									store : objStore,
									listeners : {
										'select' : function(combo, strNewValue, strOldValue) {
											setAdminSeller(combo.getValue());
										}
									}
								}
							]
						},
						//Panel 2
						{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							flex : 0.05,
							layout :
							{
								type : 'vbox'
							},
							items :
							[
								{
									xtype : 'panel',
									layout :
									{
										type : 'hbox'
									},width:115,
									items :
									[
										{
											xtype : 'label',
											text : getLabel( 'lbl.notionalMst.client', 'Company Name' ),
											cls : 'frmLabel'
										}
									]
								},
								{
									xtype : 'AutoCompleter',
									matchFieldWidth : true,
									width : '100%',
									fieldCls : 'xn-form-text w12 xn-suggestion-box',
									labelSeparator : '',
									name : 'clientId',
									itemId : 'clientIdItemId',
									cfgUrl : 'services/userseek/{0}.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'balanceAdjustmentClientIdSeek',
									cfgRootNode : 'd.preferences',
									cfgDataNode1 : 'DESCRIPTION',
									//cfgDataNode2 : 'CODE',
									cfgDataNode2 : 'SHORTNAME',
									cfgStoreFields :
									[
										'CODE', 'DESCRIPTION','SHORTNAME'
									],
									cfgExtraParams: 
									[ 
									  {
										key : '$filtercode1',
										value : strSellerId
									  } 
									]
								}
							]
						},
						//Panel 3
						{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							flex : 0.05,
							layout :
							{
								type : 'vbox'
							},
							items :
							[
								{
									xtype : 'panel',
									layout :
									{
										type : 'hbox'
									},width : 150,
									items :
									[
										{
											xtype : 'label',
											text : getLabel('agreementCode', 'Agreement Code'),
											cls : 'frmLabel'
										}
									]
								},
								{
									xtype : 'AutoCompleter',
									matchFieldWidth : false,
									width : '100%',
									fieldCls : 'xn-form-text w12 xn-suggestion-box',
									labelSeparator : '',
									name : 'agreementId',
									itemId : 'agreementItemId',
									cfgUrl : 'services/userseek/{0}.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'balanceAdjustmentAgreementIdSeek',
									cfgRootNode : 'd.preferences',
									cfgDataNode1 : 'CODE',
									cfgDataNode2 : 'DESCRIPTION',
									cfgStoreFields :
									[
										'CODE', 'DESCRIPTION'
									]
								}
							]
						},
						//Panel 4
						{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							flex : 0.05,
							layout : 'vbox',
							items : [
										{
											xtype : 'panel',
											width:'100%',
											layout :
											{
												type : 'hbox'
											},
											items :
											[
												{
													xtype : 'label',
													text :getLabel('changeDate', 'Change Date'),
													cls : 'frmLabel'
												}
											]
										},
										{
											xtype : 'datefield',
											itemId : 'changeDate',
											format : strExtApplicationDateFormat,
											value : dtApplicationDate,
											minValue : dtLmsRetentionDate,
											maxValue : dtApplicationDate,	
											hideTrigger : true,
											editable : false,
											fieldCls : 'xn-form-text w12',
											parent : this,
											listeners :
											{
												change : function(oldvalue,newValue)
												{
													this.parent.fireEvent('filterChangeDate', oldvalue, newValue);
												}
											}
										}
									]
						},
						//Panel 5
						{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							flex : 0.05,
							layout : 'vbox',
							items : [
										{
												xtype : 'panel',
												layout :
												{
													type : 'hbox'
												},
												items :
												[
													{
														xtype : 'label',
														text :getLabel('lms.notionalMst.status', 'Status'),
														cls : 'frmLabel'
													}
												]
										},
										{
											xtype : 'combobox',
											fieldCls : 'xn-form-field inline_block',
											triggerBaseCls : 'xn-form-trigger',
											matchFieldWidth : true,
											itemId : 'statusId',
											store : statusStore,
											valueField : 'key',
											displayField : 'value',
											editable : false,
											value : getLabel('lblAll',
													'All'),
											parent : this,
											listeners :
											{
												select : function( combo, record, index )
												{
													this.parent.fireEvent('filterStatusType', combo, record, index);
												}
											}	
										}
									]
						},
						//Panel 6
						 {
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							layout : 'vbox',
							flex : 0.05,
							height : 70,
							items : [{
										xtype : 'panel',
										layout : 'hbox',
										padding : '30 0 1 0',
										items : [{
													xtype : 'button',
													itemId : 'btnFilter',
													text : getLabel('search',
															'Search'),
													cls : 'ux_button-padding ux_button-background ux_button-background-color',
													height : 22
												}]
									}]
						}
					]
				}
			];
			this.callParent( arguments );
		},
		tools :
		[
		]
	} );
