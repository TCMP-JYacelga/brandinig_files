Ext.define( 'GCP.view.LmsNotionalPoolViewFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'lmsNotionalPoolViewFilterViewType',
	requires :
	[
		'Ext.ux.gcp.AutoCompleter'
	],
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
		var sellerStoreData;
		var clientsResponseData;
		var clientsStoreData;
		var objClientStore;
		var firstClientOption = null;

		if( entityType === '0' )
		{
			Ext.Ajax.request(
			{
				url : 'services/sellerListFltr.json' + "?" + csrfTokenName + "=" + csrfTokenValue,
				method : 'POST',
				async : false,
				success : function( response )
				{
					var data = Ext.decode( response.responseText );
					var sellerData = data.filterList;
					if( !Ext.isEmpty( data ) )
					{
						sellerStoreData = data;
					}
				},
				failure : function( response )
				{
					// console.log("Ajax Get data Call Failed");
				}

			} );
			var sellerIdStore = Ext.create( 'Ext.data.Store',
			{
				fields :
				[
					'sellerCode', 'description'
				],
				data : sellerStoreData,
				reader :
				{
					type : 'json',
					root : 'filterList'
				}
			} );
			if( sellerIdStore.getCount() > 1 )
			{
				isMultipleSellersAvailable = true;
			}
		}
		else
		{
			Ext.Ajax.request(
			{
				url : 'services/userseek/poolViewClientIdSeek.json?$top=-1',
				method : 'POST',
				async : false,
				success : function( response )
				{
					clientsResponseData = Ext.decode( response.responseText );
					if( !Ext.isEmpty( clientsResponseData ) )
					{
						clientsStoreData = clientsResponseData.d.preferences;
					}
				},
				failure : function( response )
				{
					// console.log("Ajax Get data Call Failed");
				}
			} );

			if( !Ext.isEmpty( clientsResponseData ) )
			{
				var objClientStore = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'CODE', 'DESCRIPTION'
					],
					data : clientsStoreData,
					reader :
					{
						type : 'json'
					}
				} );
				clientStoreLength = objClientStore.getCount();
				if( objClientStore.getCount() >= 1 )
				{
					clientsStoreData.unshift(
					{
						"CODE" : "",
						"DESCRIPTION" : "All Companies"
					} );
					isMultipleClientAvailable = true;
				}
				if( objClientStore && objClientStore.getCount() > 0 )
				{
					firstClientOption = objClientStore.getAt(0).data.CODE
				}
			}
		}

		this.items =
		[
			{
				xtype : 'panel',
				layout : 'hbox',
				cls: 'ux_largepadding ux_border-top',
				items :
				[
					//Panel 1
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						flex : 0.20,
						hidden : entityType === '0' && isMultipleSellersAvailable == true ? false : true,
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
										text : getLabel( 'lbl.lmsNotionalPoolView.seller', 'Financial Institution' ),
										cls : 'frmLabel'
									}
								]
							},
							{
								xtype : 'combo',
								displayField : 'description',
								width: '50%',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								filterParamName : 'sellerCode',
								itemId : 'sellerIdItemId',
								valueField : 'sellerCode',
								name : 'sellerCombo',
								editable : false,
								value : strSellerId,
								store : sellerIdStore
							}
						]
					},

					//Panel 2
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						flex : 0.20,
						hidden :  entityType === '0' ? false : ( clientStoreLength > 1 ? false : true),
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
										text : getLabel( 'lbl.companyname', 'Company Name' ),
										cls : 'frmLabel'
									}
								]
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								hidden : entityType === '0' ? false : true,
								fieldCls : 'xn-form-text xn-suggestion-box',
								width: '220',
								labelSeparator : '',
								name : 'clientId',
								itemId : 'clientIdAutoCompleterItemId',
								cfgUrl : 'services/userseek/poolViewAdminClientIdSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'poolViewAdminClientIdSeek',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'DESCRIPTION',
								//cfgDataNode2 : 'CODE',
								cfgDataNode2 : 'SHORTNAME',
								emptyText: getLabel('autoCompleterEmptyText','Enter Keyword or %'),
								cfgStoreFields :
								[
									'CODE', 'DESCRIPTION','SHORTNAME'
								],
								cfgExtraParams :
								[
									{
										key : '$sellerCode',
										value : strSellerId
									}
								]
							},
							{
								xtype : 'combo',
								displayField : 'DESCRIPTION',
								hidden : entityType === '0' ? true : ( clientStoreLength > 1 ? false : true),
								width : 220,
								height: 36,
								filterParamName : 'clientCode',
								itemId : 'clientIdComboItemId',
								valueField : 'CODE',
								name : 'clientCode',
								editable : false,
								value : 'All Companies',
								store : objClientStore,
								parent : this
							}
						]
					},

					//Panel 3
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						flex : 0.20,
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
										text : getLabel( 'lbl.lmsCmtmAccountStore.agreementCode', 'Agreement Code' ),
										cls : 'frmLabel required'
									}
								]
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								fieldCls : 'xn-form-text xn-suggestion-box',
								width: 220,
								labelSeparator : '',
								name : 'clientId',
								itemId : 'agreementCodeItemId',
								cfgUrl : 'services/userseek/{0}.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'poolViewAgreementCodeSeekAll',
								emptyText:getLabel('autoCompleterEmptyText','Enter Keyword or %'),
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE',
								cfgDataNode2 : 'DESCRIPTION',
								cfgStoreFields :
								[
									'CODE', 'DESCRIPTION', 'RECORD_KEY_NO', 'SUB_TYPE'
								],
								cfgExtraParams :
								[
									{
										key : '$filtercode1',
										value : firstClientOption
									}
								]
							}
						]
					},
					//Panel 4
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : {
							type : 'vbox',
							align : 'left',
							pack: 'end'
						},
						defaults : {
							margin : '12 15 0 0'
						},
						flex : 0.20,
						items :
						[
							{
								xtype : 'panel',
								layout : 'hbox',
								padding : '17 0 1 0',
								items :
								[
									{
										xtype : 'button',
										itemId : 'btnFilter',
										text : getLabel( 'query', 'Search' ),
										cls : 'searchBtn'
									}
								]
							}
						]
					}
				]
			}
		];
		this.callParent( arguments );
	}
} );
