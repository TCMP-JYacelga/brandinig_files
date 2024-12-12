Ext.define( 'GCP.view.SweepTxnAgreementFilterView',
	{
		extend : 'Ext.panel.Panel',
		xtype : 'sweepTxnAgreementFilterViewType',
		requires : 
		[
		   'Ext.ux.gcp.AutoCompleter'
		],
		layout:'vbox',
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
			var me = this;
			var structureTypeStore;
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
								"value" : getLabel( 'lblAll', 'All' )
							},
							{
								"key" : "101",
								"value" : getLabel( 'lblSweep', 'Sweep' )
							},
							{
								"key" : "201",
								"value" : getLabel( 'lblFlexible', 'Flexible' )
							},
							{
								"key" : "501",
								"value" : getLabel( 'lblHybrid', 'Hybrid' )
							}
							
						]
					} );
			me.items =
			[
				{
					xtype : 'container',
					width : '100%',
					layout : 'hbox',
					items :
					[
					 	//Panel 1
						{
							xtype : 'container',
							hidden : multipleSellersAvailable == true  && entity_type === '0' ? false : true,
							layout : 'vbox',
							width : '25%',
							padding : '0 30 0 0',
							items :
							[{
								xtype : 'label',
								text : getLabel( 'lbl.notionalMst.seller', 'Financial Institution' )
							},{
									xtype : 'combo',
									displayField : 'description',
									valueField : 'sellerCode',
									triggerAction : 'all',
									width : '100%',
									padding : '-4 0 0 0',
									filterParamName : 'sellerCode',
									itemId : 'entitledSellerIdItemId',
									name : 'sellerCombo',
									editable : false,
									value :strSellerId,
									store : objSellerStore
								}
							]
						},
						//Panel 2
						{
							xtype : 'container',
							padding : '0 30 0 0',
							hidden : entity_type === '0' ? false : (entity_type === '1' && isMultipleClientAvailable ? false : true),
							width : '25%',
							layout : 'vbox',
							items :
							[{
									xtype : 'label',
									hidden : entity_type === '0' ? false : (entity_type === '1' && isMultipleClientAvailable ? false : true),
									text : getLabel( "grid.column.company", "Company Name" )
								},
								{
									xtype : 'AutoCompleter',
									width : '100%',
									matchFieldWidth : true,
									name : 'clientId',
									itemId : 'clientIdItemId',
									cfgUrl : 'services/userseek/sweepTxnAdminClientIdSeek.json',
									padding : '-4 0 0 0',
									hidden : entity_type === '0' ? false : true,
									labelSeparator : '',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'sweepTxnAdminClientIdSeek',
									cfgRootNode : 'd.preferences',
									cfgDataNode1 : 'DESCRIPTION',
									emptyText : getLabel('autoCompleterEmptyText','Enter Keyword or %'),
									cfgDataNode2 : 'SHORTNAME',
									cfgStoreFields :
									[
										'CODE', 'DESCRIPTION', 'SHORTNAME'
									],
									cfgExtraParams: [{
										key : '$filtercode1',
										value : strSellerId
									  }]
								},
								{
									xtype : 'combo',
									displayField : 'DESCRIPTION',
									valueField : 'CODE',
									matchFieldWidth : true,
									editable : false,
									triggerAction : 'all',
									hidden : entity_type === '1' && isMultipleClientAvailable ? false : true,
									padding : '-4 0 0 0',
									width : '100%',
									filterParamName : 'clientCode',
									itemId : 'clientCodeId',
									name : 'clientCode',
									value : 'All Companies',
									store : objStore
								}]
						},
						//Panel 3
						{
							xtype : 'container',
							itemId : 'agreementCodeContainer',
							layout : 'vbox',
							width : '25%',
							padding : '0 30 0 0',
							items : [{
											xtype : 'label',
											text : getLabel('agreementCode', 'Agreement Code')
										},
										{
											xtype : 'AutoCompleter',
											matchFieldWidth : true,
											width : '100%',
											labelSeparator : '',
											name : 'agreementId',
											itemId : 'agreementItemId',
											cfgUrl : 'services/userseek/{0}.json',
											cfgQueryParamName : '$autofilter',
											cfgRecordCount : -1,
											//cfgSeekId : entity_type === '1' ? 'sweepTxnAgreementIdSeek' : 'sweepTxnAgreementIdAdminSeek',
											cfgSeekId : entity_type === '1' ? 'sweepTxnAgreementIdSeek' : 'sweepTxnAgreementIdSeekAll',
											cfgRootNode : 'd.preferences',
											cfgDataNode2 : 'DESCRIPTION',
											cfgDataNode1 : 'CODE',
											emptyText : getLabel('autoCompleterEmptyText','Enter Keyword or %'),
											cfgStoreFields :
											[
												'CODE', 'DESCRIPTION'
											],
											cfgExtraParams: entity_type === '1' ? [{
													key : '$filtercode1',
													value : strClientId
												  } ] : [{
												  	key : '$filtercode1',
													value : strSellerId
												  }],
											padding : '-4 0 0 0'
										}]
						},
						//Panel 4
						{	xtype : 'container',
							layout : 'vbox',
							padding : '0 30 0 0',
							width : '25%',
							items :	[{
										xtype : 'label',
										text : getLabel( 'noPostStructureId', 'Live / Non Live' )
									},{
										xtype : 'combobox',							
										labelSeparator : '',
										matchFieldWidth : true,
										padding : '-4 0 0 0',
										width : '100%',
										name : 'NoPostStructure',
										itemId : 'noPostStructureId',
										store : noPostStructureIdStore,
										valueField : 'noPostStructureKey',
										displayField : 'noPostStructureValue',
										editable : false,
										value : getLabel('all','ALL'),
										parent : this
										}]
					},
						//Panel 5
						{
							xtype : 'container',
							itemId : 'structureTypeContainer',
							layout : 'vbox',
							width : '25%',
							padding : '0 30 0 0',
							items : [{
											xtype : 'label',
											text :getLabel('structureType', 'Structure Type')
										},
										{
											xtype : 'combobox',
											valueField : 'key',
											displayField : 'value',
											queryMode : 'local',
											editable : false,
											matchFieldWidth : true,
											triggerAction : 'all',
											width : '100%',
											padding : '-4 0 0 0',
											itemId : 'structureTypeId',
											store : structureTypeStore,
											value : getLabel('all','All'),
											parent : this
									}]
						}
					]
				}
			];
			this.callParent( arguments );
		}
	} );
