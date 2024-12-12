Ext.define( 'GCP.view.InterestProfileFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'interestProfileFilterView',
	requires :
	[
		'Ext.ux.gcp.AutoCompleter'
	],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon ux_no-border',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
		var storeData;
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
		var statusStore = Ext.create( 'Ext.data.Store',
		{
			fields :
				[
					'key', 'value'
				],
				data :
			[
					{
						"key" : "all",
						"value" : getLabel('all', 'ALL')
					},
					{
						"key" : "0NN",
						"value" : getLabel('new', 'New')

					},
					{
						"key" : "0NY",
						"value" : getLabel('lbl.userstatus.2',
								'New Submitted')

					},
					{
						"key" : "3YN",
						"value" : getLabel('lbl.userstatus.3',
								'Approved')
					},
					{
						"key" : "7NN",
						"value" : getLabel('newRejected',
								'New Rejected')
					},
					{
						"key" : "1YN",
						"value" : getLabel('lbl.userstatus.1',
								'Modified')
					},
					{
						"key" : "1YY",
						"value" : getLabel('lbl.userstatus.14',
								'Modified Submitted')
					},
					{
						"key" : "8YN",
						"value" : getLabel('lbl.userstatus.8',
								'Modified Rejected')
					},
					{
						"key" : "5YY",
						"value" : getLabel('lbl.userstatus.5',
								'Suspend Request')
					},
					{
						"key" : "9YN",
						"value" : getLabel(
								'lbl.userstatus.9',
								'Suspend Request Rejected')
					},
					{
						"key" : "3NN",
						"value" : getLabel('lbl.userstatus.11',
								'Suspended')
					},
					{
						"key" : "4NY",
						"value" : getLabel('lbl.userstatus.4',
								'Enable Request')
					},
					{
						"key" : "10NN",
						"value" : getLabel(
								'lbl.userstatus.10',
								'Enable Request Rejected')
					},
				    {
						"key":"13NY",
						 "value" : getLabel('lbl.userstatus.13', 'Pending My Approval')
				   }
				]
			} );

		var profileTypeStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'key', 'value'
			],
			data :
			[
				{
					"key" : "ALL",
					"value" : getLabel('all', 'All')
				},
				{
					"key" : "B",
					"value" : getLabel('bank', 'Bank')
				},
				{
					"key" : "C",
					"value" : getLabel('apportionment', 'Apportionment')
				}
			]
		} );

		this.items =
		[
			{
				xtype : 'container',
				itemId : 'mainContainer',
				width : 'auto',
				layout : 'vbox',
				cls : 'filter-container-cls ux_border-top',
				margin : 5,
				defaults :
				{
					padding : 2,
					labelAlign : 'top',
					labelSeparator : ''
				},
				items :
				[
					{
						xtype : 'container',
						itemId : 'firstRow',
						width : '100%',
						layout : 'hbox',
						cls : 'filter-container-cls',
						margin : 5,
						defaults :
						{
							padding : 2,
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'combo',
								flex :1,
								displayField : 'description',
								hidden : multipleSellersAvailable == true ? false : true,
								fieldLabel : getLabel('financialInstitution', 'Financial Institution'),
								cls: 'w14',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								labelCls: 'frmLabel',
								filterParamName : 'sellerId',
								itemId : 'sellerFltId',
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
							},
							
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								flex :1,
								fieldCls : 'xn-form-text w14 xn-suggestion-box',
								name : 'profileName',
								itemId : 'profileName',
								cfgUrl : 'services/userseek/lmsinterestprofilenameseek.json',
								cfgSeekId : 'lmsinterestprofilenameseek',
								fieldLabel :  getLabel( "profileCode", 'Profile Code' ),
								labelCls: 'frmLabel',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,								
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE',
								cfgDataNode2 : 'DESCRIPTION',
								cfgStoreFields :
								[
									'CODE', 'DESCRIPTION'
								],
								cfgExtraParams: 
								[
								  {
									key : '$filtercode1',
									value : strSellerId
								  } 
								]	
							},
							
							{
								xtype : 'combobox',
								flex :1,
								itemId : 'profileType',
								store : profileTypeStore,
								valueField : 'key',
								cls: 'w14',
								displayField : 'value',
								labelCls: 'frmLabel',
								fieldLabel : getLabel( "profileType", "Profile Type" ),
								fieldCls : 'xn-form-field inline_block',
								editable : false,
								triggerBaseCls : 'xn-form-trigger',
								value : getLabel('all','ALL'),
								//padding : '0 0 0 190',
								//width : 288,
								listeners :
								{
									change : function( combo, newValue, oldValue )
									{
									}
								}								
							},
												
							{
								xtype : 'combobox',
								flex :1,
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								padding : '1 5 1 5',
								//width : 196,
								cls: 'w14',
								itemId : 'statusFilter',
								labelCls: 'frmLabel',
								filterParamName : 'requestState',
								store : statusStore,
								valueField : 'key',
								displayField : 'value',
								editable : false,
								value : getLabel('all','ALL'),
								fieldLabel : getLabel( "status", "Status" ),
								parent : this,
								listeners :
								{
									select : function( combo, record, index )
									{
										this.parent.fireEvent('filterStatusType', combo, record, index);
									}
								}	
							},
							
							{
								xtype : 'panel',
								flex :1,
								cls : 'xn-filter-toolbar',
								layout : 'vbox',
								padding : '20 0 1 5',
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
	}
} );
