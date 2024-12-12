/**
 * @class GCP.view.SweepTxnFilterView
 * @extends Ext.panel.Panel
 * @author Pradip Khutwad
 */
Ext.define( 'GCP.view.SweepTxnFilterView',
	{
		extend : 'Ext.panel.Panel',
		xtype : 'sweepTxnFilterViewType',
		requires : 
		[
		   'Ext.ux.gcp.AutoCompleter'
		],
		layout : 'vbox',
		initComponent : function()
		{
			var noPostStructureIdStore;
			noPostStructureIdStore = Ext.create( 'Ext.data.Store',
			{
				fields :
				[
					'noPostStructureKey', 'noPostStructureValue'
				],
				data :
				[
					{
						"noPostStructureKey" : "all",
						"noPostStructureValue" : getLabel( 'lblAll', 'ALL' )
					},
					{
						"noPostStructureKey" : "N",
						"noPostStructureValue" : getLabel( 'lblLive', 'Live' )
					},
					{
						"noPostStructureKey" : "Y",
						"noPostStructureValue" : getLabel( 'lblNonLive', 'Non Live' )
					}
				]
			} );
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
					if(objStore.getCount() >= 2){
						clientsStoreData.unshift({"CODE":"all","DESCRIPTION":"All Companies"});
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
								"value" : getLabel( 'lblAll', 'All' )
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
					//Row 1
					{
						xtype : 'panel',
						width : '100%',
						layout : 'hbox',
						items :
						[{
							xtype : 'panel',
							padding : '0 30 0 0',
							width : '25%',
							hidden : multipleSellersAvailable == true  ? false : true,
							layout : 'vbox',
							items: [{
											xtype : 'label',
											text : getLabel( 'lbl.notionalMst.seller', 'Financial Institution' ),
											cls : 'f13 ux_font-size14'
									},
									{
											xtype : 'combo',
											displayField : 'description',
											height:36,
											width : '100%',
											padding : '-4 0 0 0',
											filterParamName : 'sellerCode',
											itemId : 'entitledSellerIdItemId',
											valueField : 'sellerCode',
											name : 'sellerCombo',
											editable : false,
											value :strSellerId,
											store : objSellerStore
									}]
						 }
						 /*{
								xtype : 'container',
								layout : 'vbox',
								hidden : (isMultipleClientAvailable != true || entity_type === '0') ? true : false,
								padding : '0 30 0 0',
								width : '100%',
								items : [{
									xtype : 'label',
									itemId : 'companyComboLabel',
									text : getLabel('lblcompany', 'Company')
								}, {
									xtype : 'combo',
									displayField : 'DESCRIPTION',
									width : "23%",
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'clientCode',
									itemId : 'clientCodeId',
									valueField : 'CODE',
									name : 'clientCode',
									editable : false,
									value : strClientId,
									store : objStore
								}]
							},{
								xtype : 'container',
								layout : 'vbox',
								hidden : entity_type === '0' ? false : true,//If not admin then hide
								padding : '0 30 0 0',
								width : '100%',
								items : [{
									xtype : 'label',
									itemId : 'companyAutoLabel',
									text : getLabel('lblcompany', 'Company')
								},{
									xtype : 'AutoCompleter',
									matchFieldWidth : true,
									width : "23%",
									padding : '-4 0 0 0',
									emptyText : getLabel('searchByCompany', 'Search By Company'),
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
									]
								}]
							}*/]
					},
			
				//Row 2
				{
					xtype : 'panel',
					width : '100%',
					layout : 'hbox',
					items :[{
						xtype : 'container',
						layout : 'vbox',
						hidden : (isMultipleClientAvailable != true || entity_type === '0') ? true : false,
						padding : '0 30 0 0',
						width : '25%',
						items : [{
							xtype : 'label',
							itemId : 'companyComboLabel',
							text : getLabel('lblcompany', 'Company Name')
						}, {
							xtype : 'combo',
							displayField : 'DESCRIPTION',
							width : "100%",
							padding : '-4 0 0 0',
							triggerBaseCls : 'xn-form-trigger',
							filterParamName : 'clientCode',
							itemId : 'clientCodeId',
							valueField : 'CODE',
							name : 'clientCode',
							editable : false,
							//value : strClientId,
							value : 'All Companies',
							store : objStore						
						}]
					},{
						xtype : 'container',
						layout : 'vbox',
						hidden : entity_type === '0' ? false : true,//If not admin then hide
						padding : '0 30 0 0',
						width : '25%',
						items : [{
							xtype : 'label',
							itemId : 'companyAutoLabel',
							text : getLabel('lblcompany', 'Company Name')
						},{
							xtype : 'AutoCompleter',
							matchFieldWidth : true,
							width : "100%",
							padding : '-4 0 0 0',
							emptyText : getLabel('searchByCompany', 'Search By Company Name'),
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
							]
						}]
					},{
								xtype : 'panel',
								width : '25%',
								layout : 'vbox',
								padding : '0 30 0 0',
								items: [{
										xtype : 'label',
										text : getLabel('agreementCode', 'Agreement'),
										cls : 'f13 ux_font-size14'											
									},
									{
										xtype : 'AutoCompleter',
										matchFieldWidth : true,
										width : '100%',
										//height:36,
										padding : '-4 0 0 0',
										//fieldCls : 'xn-form-text w14 xn-suggestion-box',
										labelSeparator : '',
										name : 'agreementId',
										emptyText : getLabel('searchByAgreementCode', 'Search By Agreement Code'),
										itemId : 'agreementItemId',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										//cfgSeekId : 'sweepTxnIdSeekAll',
										cfgSeekId : entity_type === '1' ? 'sweepTxnIdSeek' : 'sweepTxnIdSeekAll',
										cfgRootNode : 'd.preferences',
										cfgDataNode2 : 'DESCRIPTION',
										cfgDataNode1 : 'CODE',
										cfgExtraParams :
											[		
												{
													key : '$filtercode1',
													value : strClientId
												  } ,
												{
													key : '$filtercode2',
													value : entity_type
												}
											],
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION'
										]
								}]
						},{
							xtype : 'panel',
							width : '25%',
							padding : '0 30 0 0',
							layout : 'vbox',
							items : [
							           {
											xtype : 'label',
											text :getLabel('noPostStructureId', 'Live / Non Live'),
											cls : 'f13 ux_font-size14'
										},
										{
											xtype : 'combobox',											
											padding : '-4 0 0 0',
											width : '100%',
											matchFieldWidth : true,
											itemId : 'noPostStructureId',
											store : noPostStructureIdStore,
											valueField : 'noPostStructureKey',
											displayField : 'noPostStructureValue',
											editable : false,
											value : getLabel('all',
													'ALL'),
											parent : this
										}
									]
						},{
							xtype : 'panel',
							width : '25%',
							padding : '0 30 0 0',
							layout : 'vbox',
							items: [{
										xtype : 'label',
										text :getLabel('transactionType', 'Transaction Type'),
										cls : 'f13 ux_font-size14'											
									},
									{
										xtype : 'combobox',
										padding : '-4 0 0 0',
										//height:36,
										queryMode : 'local',
										width:'100%',
										matchFieldWidth : true,
										itemId : 'transactionTypeId',
										store : transactionTypeStore,
										valueField : 'key',
										displayField : 'value',
										editable : false,
										value : getLabel('all',
												'All'),
										parent : this,
										listeners :
										{
											select : function( combo, record, index )
											{
												this.parent.fireEvent('filterTransactionType', combo, record, index);
											}
										}
								}]
						}]
				}
			];
			this.callParent( arguments );
		},
		tools :
		[]
	} );
