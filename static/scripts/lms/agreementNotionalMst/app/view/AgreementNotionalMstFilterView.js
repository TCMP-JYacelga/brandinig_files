Ext.define( 'GCP.view.AgreementNotionalMstFilterView',
	{
		extend : 'Ext.panel.Panel',
		xtype : 'agreementNotionalFilterViewType',
		requires : 
		[
		   'Ext.ux.gcp.AutoCompleter'
		],
		width : '100%',
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
			var structureSubTypeList;
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
			structureTypeStore = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data :
					[
						
						{
							"key" : "all",
							"value" : getLabel( 'lms.notionalMst.All', 'All' )
						},
						{
							"key" : "CB",
							"value" : getLabel( 'lms.notionalMst.combination', 'Combination' )
						},
						{
							"key" : "CP",
							"value" : getLabel( 'lms.notionalMst.compensation', 'Compensation' )
						},
						{
							"key" : "TE",
							"value" : getLabel( 'lms.notionalMst.tierEnhancement', 'Tier Enhancement' )
						}
						
					]
				} );
			
			strucSubTypeList = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data :
					[
						
						
					]
				} );
			
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
						"value" : getLabel('lms.notionalMst.All', 'All')
					},
					{
						"key" : "0NN",
						"value" : getLabel('new', 'New')

					},
					{
						"key" : "0NY",
						"value" : getLabel('lblSubmitted',
								'New Submitted')

					},
					{
						"key" : "3YN",
						"value" : getLabel('lblAuthorized',
								'Approved')
					},
					{
						"key" : "7NN",
						"value" : getLabel('lblNewRejected',
								'New Rejected')
					},
					{
						"key" : "1YN",
						"value" : getLabel('lblModified',
								'Modified')
					},
					{
						"key" : "1YY",
						"value" : getLabel('lblModifiedSubmitted',
								'Modified Submitted')

					},
					{
						"key" : "8YN",
						"value" : getLabel('lblModifiedReject',
								'Modified Rejected')
					},
					{
						"key" : "5YY",
						"value" : getLabel('lblDisableRequest',
								'Disable Request')
					},
					{
						"key" : "9YN",
						"value" : getLabel(
								'lblDisableReqRejected',
								'Disable Request Rejected')
					},
					{
						"key" : "3NN",
						"value" : getLabel('lblDisabled',
								'Disabled')
					},
					{
						"key" : "4NY",
						"value" : getLabel('lblEnableRequest',
								'Enable Request')
					},
					{
						"key" : "10NN",
						"value" : getLabel(
								'lblEnableReqRejected',
								'Enable Request Rejected')
					},
					{
						"key" : "6YY",
						"value" : getLabel( 'lblClosed', 'Closed' )
					},
					{
						"key" : "6YN",
						"value" : getLabel( 'lblExpired', 'Expired' )
					},
					{
						"key" : "13NY",
						"value" : getLabel( 'lblPendingMyApproval', 'Pending My Approval' )
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
							hidden : multipleSellersAvailable == true ? false : true,
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
									},width : 115,
									items :
									[
										{
											xtype : 'label',
											text : getLabel( 'lbl.notionalMst.companyname', 'Company Name' ),
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
									cfgUrl : 'services/userseek/notionalClientIdSeek.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'notionalClientIdSeek',
									cfgRootNode : 'd.preferences',
									cfgDataNode1 : 'DESCRIPTION',
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
									},
									items :
									[
										{
											xtype : 'label',
											text : getLabel( 'lbl.notionalMst.agreementCode', 'Agreement Code' ),
											cls : 'frmLabel'
										}
									]
								},
								{
									xtype : 'AutoCompleter',
									matchFieldWidth : true,
									width : '100%',
									fieldCls : 'xn-form-text w14 xn-suggestion-box',
									labelSeparator : '',
									name : 'agreementRecKey',
									itemId : 'agreementCodeItemId',									
									cfgUrl : 'services/userseek/{0}.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'notionalMstAgreementCodeFilterSeekAll',
									cfgRootNode : 'd.preferences',
									cfgDataNode1 : 'CODE',
									cfgDataNode2 : 'DESCRIPTION',
									cfgStoreFields :
									[
										'CODE', 'DESCRIPTION','RECKEY'
									],
									cfgExtraParams : [ {
										key : '$filtercode1',
										value : strSellerId
									} ]
								}
							]
						},						
						//Panel 4
						{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							flex : 0.05,
							layout : 'vbox',
							columnWidth : 0.22,
							items : [
							           {
											xtype : 'label',
											text : getLabel('structureType', 'Structure Type'),
											cls : 'frmLabel',
											flex : 1
										},
										{
											xtype : 'combobox',
											fieldCls : 'xn-form-field inline_block',
											triggerBaseCls : 'xn-form-trigger',
											cls : 'w15',
											matchFieldWidth : true,
											itemId : 'structureTypeId',
											store : structureTypeStore,
											valueField : 'key',
											displayField : 'value',
											editable : false,
											value : getLabel('lms.notionalMst.All',
													'All'),
											parent : this,
											listeners :
											{
												select : function( combo, record, index )
												{
													this.parent.fireEvent('filterStructureType', combo, record, index);
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
							columnWidth : 0.22,
							items : [
							           {
											xtype : 'label',
											text :getLabel('lms.notionalMst.structureSubtype', 'Structure Subtype'),
											cls : 'frmLabel',
											flex : 1
										},
										{
											xtype : 'combobox',
											fieldCls : 'xn-form-field inline_block',
											triggerBaseCls : 'xn-form-trigger',
											matchFieldWidth : true,
											itemId : 'structureSubtypeId',
											store : strucSubTypeList,
											valueField : 'key',
											cls : 'w15',
											displayField : 'value',
											editable : false,
											value : getLabel('lms.notionalMst.All',
													'All'),
											parent : this,
											listeners :
											{
												select : function( combo, record, index )
												{
													this.parent.fireEvent('filterStructureSubtype', combo, record, index);
												}
											}		
										}
									]
						},
						//Panel 6
						{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							flex : 0.05,
							layout : 'vbox',
							columnWidth : 0.22,
							items : [
							           {
											xtype : 'label',
											text :getLabel('lms.notionalMst.status', 'Status'),
											cls : 'frmLabel',
											flex : 1
										},
										{
											xtype : 'combobox',
											fieldCls : 'xn-form-field inline_block',
											triggerBaseCls : 'xn-form-trigger',
											matchFieldWidth : true,
											itemId : 'statusId',
											cls : 'w15',
											store : statusStore,
											valueField : 'key',
											displayField : 'value',
											editable : false,
											value : getLabel('lms.notionalMst.All',
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
						//Panel 7
						 {
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							layout : 'vbox',
							flex : 0.05,
							height : 60,
							columnWidth : 0.15,
							items : [{
										xtype : 'panel',
										layout : 'hbox',										
										padding : '26 0 1 0',
										items : [{
													xtype : 'button',
													itemId : 'btnFilter',
													text : getLabel('search',
															'Search'),
													cls : 'ux_button-padding ux_button-background ux_button-background-color'
												}]
									}]
						}
					]
				}
			];
			this.callParent( arguments );
		},
		tools :
		[	/*{
				xtype : 'label',
				text  : getLabel('preferences','Preferences : '),
				cls : 'xn-account-filter-btnmenu'
			},{
				xtype : 'button',
				itemId : 'btnClearPreferences',
				disabled : false,
				text : getLabel('clearFilter', 'Clear'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 40
			},{
				xtype : 'image',
				src : 'static/images/icons/icon_spacer.gif',
				height : 18
			},{
				xtype : 'button',
				itemId : 'btnSavePreferences',
				disabled : true,
				text : getLabel( 'saveFilter', 'Save' ),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 30
			}*/
		]
	} );
