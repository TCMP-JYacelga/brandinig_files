/**
 * @class GCP.view.BankAdminCategoryFilterView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */

Ext.define( 'GCP.view.BankAdminCategoryFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bankAdminCategoryFilterViewType',
	requires :
	[
		'Ext.ux.gcp.AutoCompleter'
	],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed :true,
	cls : 'xn-ribbon',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
		var requestStateComboStore;

		requestStateComboStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'key', 'value'
			],
			data :
			[  {
                "key" : "all",
                "value" : getLabel( 'lblAll', 'All' )
           },
           {
                "key" : "0NN",
                "value" : getLabel( 'lblNew', 'New' )
                
           },
           {
                "key" : "0NY",
                "value" : getLabel( 'lblSubmitted', 'New Submitted' )
                
           },
           {
                "key" : "3YN",
                "value" : getLabel( 'lblAuthorized', 'Approved' )
           },
           {
                "key" : "7NN",
                "value" : getLabel( 'lblNewRejected', 'New Rejected' )
           },
           {
                "key" : "1YN",
                "value" : getLabel( 'lblModified', 'Modified' )
           },
		   {
				 "key" : "1YY",
				 "value" : getLabel( 'lblModifiedSubmitted', 'Modified Submitted' )
		   },
           {
                "key" : "8YN",
                "value" : getLabel( 'lblModifiedReject', 'Modified Rejected' )
           },
           {
                "key" : "5YY",
                "value" : getLabel( 'lblDisableRequest', 'Disable Request' )
           },
           {
                "key" : "9YN",
                "value" : getLabel( 'lblDisableReqRejected', 'Disable Request Rejected' )
           },
           {
                "key" : "3NN",
                "value" : getLabel( 'lblDisabled', 'Disabled' )
           },
           {
                "key" : "4NY",
                "value" : getLabel( 'lblEnableRequest', 'Enable Request' )
           },
           {
                "key" : "10NN",
                "value" : getLabel( 'lblEnableReqRejected', 'Enable Request Rejected' )
           },
           	{
				 "key" : "13NY",
				 "value" : getLabel( 'pendingMyApproval', 'Pending My Approval' )
		    }

			]
		} );

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
										text : getLabel( 'lbl.bankAdminCategory.bankRoleName', 'Role Name' ),
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
								name : 'categoryCode',
								itemId : 'categoryCodeFilterItemId',
								cfgUrl : 'services/userseek/bankAdminAllCategoryCodeSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'bankAdminAllCategoryCodeSeek',
								cfgRootNode : 'd.preferences',								
								cfgDataNode1 : 'CODE',		
								cfgDataNode2 : 'DESCRIPTION',
								enableQueryParam:false,
								cfgProxyMethodType:'POST',
								cfgStoreFields :
								[
									'CODE', 'DESCRIPTION', 'RECORD_KEY_NO'
								],
								cfgExtraParams :
								[
									{
										key : '$sellerCode',
										value : strSellerId
									}
								]
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
										text : getLabel( 'status', 'Status' ),
										cls : 'frmLabel'
									}
								]
							},
							{
								xtype : 'combobox',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								matchFieldWidth : true,
								width: 196,
								itemId : 'requestStateFilterItemId',
								store : requestStateComboStore,
								valueField : 'key',
								displayField : 'value',
								editable : false,
								value : getLabel( 'lblAll', 'All' ),
								parent : this
							}
						]
					},

					//Panel 3
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
										cls : 'ux_button-padding ux_button-background ux_button-background-color',
										height : 22
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
	tools : []
} );
