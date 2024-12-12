Ext.define( 'GCP.view.SweepTxnFilterView',
	{
		extend : 'Ext.panel.Panel',
		xtype : 'sweepTxnFilterViewType',
		requires : 
		[
		   'Ext.ux.gcp.AutoCompleter'
		],
		width : '100%',
		margin : '0 0 10 0',
		cls : 'ft-ux-grid-header',
		componentCls : 'gradiant_back',
		bodyCls:'ft-ux-body',
		//collapsible : true,
		//collapsed : true,
		layout :
		{
			type : 'vbox',
			align : 'stretch'
		},
		initComponent : function()
		{
			var transactionTypeStore;
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
				var objSellerStore = Ext.create('Ext.data.Store', {
							fields : ['sellerCode', 'description'],
							data : storeData,
							reader : {
								type : 'json',
								root : 'filterList'
							}
							});
				if(objSellerStore.getCount() > 1){
					multipleSellersAvailable = true;
				}
				isMultipleClientAvailable = true;
			}
			else 
			{
				Ext.Ajax.request(
						{
							url : 'services/userseek/sweepTxnClientIdSeek.json?$top=-1',
							method : 'POST',
							async: false,
							success : function( response )
							{
								clientsData = Ext.decode( response.responseText );
								if( !Ext.isEmpty( clientsData ) ){
									clientsStoreData = clientsData.d.preferences;
								}
							},
							failure : function(response)
							{
								// console.log("Ajax Get data Call Failed");
							}

				});
				if( !Ext.isEmpty( clientsData ) ){
					var objStore = Ext.create('Ext.data.Store', {
								fields : ['CODE', 'DESCRIPTION'],
								data : clientsStoreData,
								reader : {
									type : 'json'
								}
								});
					if(objStore.getCount() >= 1){
						clientsStoreData.unshift({"CODE":"","DESCR":"ALL"});
						isMultipleClientAvailable = true;
					}
				}
			}
			transactionTypeStore = Ext.create( 'Ext.data.Store',
					{
						fields :
						[
							'key', 'value'
						],
						data :
						[
							
							{
								"key" : "all",
								"value" : getLabel( 'lblAll', 'ALL' )
							},
							{
								"key" : "1",
								"value" : getLabel( 'lblAdjust', 'Adjustment' )
							},
							{
								"key" : "2",
								"value" : getLabel( 'lblTransfer', 'Transfer' )
							},
							{
								"key" : "3",
								"value" : getLabel( 'lblExecute', 'Execute' )
							},
							{
								"key" : "4",
								"value" : getLabel( 'lblSimulate', 'Simulate' )
							},
							{
								"key" : "5",
								"value" : getLabel( 'lblCancelSchedule', 'Cancel Schedule' )
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
							hidden : multipleSellersAvailable == true  && entity_type === '0' ? false : true,
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
											text : getLabel( 'lbl.notionalMst.seller', 'Financial Institution' ),
											cls : 'f13 ux_font-size14',
											padding : '6 0 0 10'
										}
									]
								},
								{
									xtype : 'combo',
									displayField : 'description',
									height:25,
									width:200,
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'sellerCode',
									itemId : 'entitledSellerIdItemId',
									valueField : 'sellerCode',
									name : 'sellerCombo',
									editable : false,
									value :strSellerId,
									store : objSellerStore,
									padding : '6 0 0 10'
								}
							]
						},
						//Panel 2
						{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							hidden : isMultipleClientAvailable == true  ? false : true,
							flex : 0.05,
							layout :
							{
								type : 'vbox'
							},
							items :
							[
								{
									xtype : 'label',
									text : getLabel( 'grid.column.company', 'Company Name' ),
									cls : 'f13 ux_font-size14',
									padding : '6 0 0 0'
								},
								{
									xtype : 'AutoCompleter',
									matchFieldWidth : true,
									hidden : entity_type === '0' ? false : true,
									width : 200,
									height:25,
									fieldCls : 'xn-form-text w14 xn-suggestion-box',
									labelSeparator : '',
									name : 'clientId',
									itemId : 'clientIdItemId',
									cfgUrl : 'services/userseek/sweepTxnAdminClientIdSeek.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'sweepTxnAdminClientIdSeek',
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
									],
									padding : '6 0 0 0'
								},
								{
									xtype : 'combo',
									hidden : entity_type === '0' ? true : false,
									displayField : 'DESCRIPTION',
									width:200,
									height:25,
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'clientCode',
									itemId : 'clientCodeId',
									valueField : 'CODE',
									name : 'clientCode',
									editable : false,
									value : strClientId,
									store : objStore,
									padding : '6 0 0 0'
								}
							]
						},
						//Panel 3
						{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							flex : 0.05,
							layout : 'vbox',
							columnWidth : 0.22,
							items : [
							           {
											xtype : 'label',
											text : getLabel('agreementCode', 'Agreement'),
											cls : 'f13 ux_font-size14',											
											padding : '6 0 0 0'
										},
										{
											xtype : 'AutoCompleter',
											matchFieldWidth : true,
											width : 200,
											height:25,
											fieldCls : 'xn-form-text w14 xn-suggestion-box',
											labelSeparator : '',
											name : 'agreementId',
											itemId : 'agreementItemId',
											cfgUrl : 'services/userseek/{0}.json',
											cfgQueryParamName : '$autofilter',
											cfgRecordCount : -1,
											cfgSeekId : 'sweepTxnIdSeekAll',
											cfgRootNode : 'd.preferences',
											cfgDataNode2 : 'DESCRIPTION',
											cfgDataNode1 : 'CODE',
											cfgExtraParams :
												[													
													{
														key : '$filtercode2',
														value : entity_type
													}
												],
											cfgStoreFields :
											[
												'CODE', 'DESCRIPTION'
											],
											padding : '6 0 0 0'
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
											text :getLabel('transactionType', 'Transaction Type'),
											cls : 'f13 ux_font-size14',											
											padding : '6 0 0 5'
										},
										{
											xtype : 'combobox',
											fieldCls : 'xn-form-field inline_block',
											triggerBaseCls : 'xn-form-trigger',
											padding : '5 5 1 5',
											height:25,
											width:200,
											matchFieldWidth : true,
											itemId : 'transactionTypeId',
											store : transactionTypeStore,
											valueField : 'key',
											displayField : 'value',
											editable : false,
											value : getLabel('all',
													'ALL'),
											parent : this,
											listeners :
											{
												select : function( combo, record, index )
												{
													this.parent.fireEvent('filterTransactionType', combo, record, index);
												}
											}	
										}
									]
						}
						//Panel 6
						/* {
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							layout : 'vbox',
							flex : 0.05,
							columnWidth : 0.15,
							items : [{
										xtype : 'panel',
										layout : 'hbox',
										padding : '30 0 1 0',
										items : [{
													xtype : 'button',
													itemId : 'btnFilter',
													text : getLabel('search',
															'Search'),
													cls : 'search_button ux_button-background-color ux_button-padding',		
													height : 22
												}]
									}]
						}*/
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
