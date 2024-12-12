Ext.define( 'GCP.view.LmsCmtmAccountStoreFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'lmsCmtmAccountStoreFilterViewType',
	requires :
	[
		'Ext.ux.gcp.AutoCompleter'
	],
	width : '100%',
	//margin : '0 0 10 0',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed :true,
	cls : 'xn-ribbon ux_border-bottom ux_extralargemargin-bottom',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
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
						storeData = data;
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
				data : storeData,
				reader :
				{
					type : 'json',
					root : 'filterList'
				}
			} );
			if( sellerIdStore.getCount() > 1 )
			{
				multipleSellersAvailable = true;
			}
		}

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
								},
								items :
								[
									{
										xtype : 'label',
										text : getLabel( 'lbl.lmsCmtmAccountStore.seller', 'Financial Institution' ),
										cls : 'f13 ux_font-size14',
										padding : '6 0 0 0'
									}
								]
							},
							{
								xtype : 'combo',
								displayField : 'description',
								cls : 'w15',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								filterParamName : 'sellerCode',
								itemId : 'entitledSellerIdItemId',
								valueField : 'sellerCode',
								name : 'sellerCombo',
								editable : false,
								value : strSellerId,
								store : sellerIdStore,
								padding : '6 0 0 0'
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
								},
								items :
								[
									{
										xtype : 'label',
										text : getLabel( 'grid.column.company', 'Company Name' ),
										cls : 'f13 ux_font-size14',
										padding : '6 0 0 0'
									}
								]
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								width : '100%',
								fieldCls : 'xn-form-text w14 xn-suggestion-box',
								labelSeparator : '',
								name : 'clientCode',
								itemId : 'clientCodeItemId',
								cfgUrl : 'services/userseek/cmtmClientCodeSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'cmtmClientCodeSeek',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'DESCRIPTION',
								cfgDataNode2 : 'SHORTNAME',
								cfgStoreFields :
								[
									'CODE', 'DESCRIPTION','SHORTNAME'
								],
								cfgExtraParams :
								[
									{
										key : '$filtercode1',
										value : strSellerId
									}
								],
								padding : '6 0 0 0'
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
										text : getLabel( 'lbl.lmsCmtmAccountStore.agreementCode', 'Agreement' ),
										cls : 'f13 ux_font-size14',
										padding : '6 0 0 0'
									}
								]
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								width : '100%',
								fieldCls : 'xn-form-text w14 xn-suggestion-box',
								labelSeparator : '',
								name : 'clientId',
								itemId : 'agreementCodeItemId',
								cfgUrl : 'services/userseek/{0}.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'cmtmAgreementCodeSeekAll',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE',
								cfgDataNode2 : 'DESCRIPTION',
								cfgStoreFields :
								[
									'CODE', 'DESCRIPTION', 'RECORD_KEY_NO'
								],
								padding : '6 0 0 0'
							}
						]
					},

					//Panel 4
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						flex : 0.05,
						columnWidth : 0.15,
						items :
						[
							{
								xtype : 'panel',
								layout : 'hbox',
								padding : '23 0 1 0',
								items :
								[
									{
										xtype : 'button',
										itemId : 'btnFilter',
										text : getLabel( 'search', 'Search' ),
										cls : 'ux_button-padding ux_button-background ux_button-background-color'
									}
								]
							}
						]
					}
				]
			}
		];
		this.callParent( arguments );
	},
	tools :
	[]
} );
