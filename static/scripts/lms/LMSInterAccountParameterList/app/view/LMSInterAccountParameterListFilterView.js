Ext.define( 'GCP.view.LMSInterAccountParameterListFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'lmsInterAccountParameterListFilterView',
	requires :
	[
		'Ext.ux.gcp.AutoCompleter'
	],
	width : '100%',
	cls : 'ft-ux-grid-header',
	componentCls : 'gradiant_back',
	bodyCls:'ft-ux-body',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
		
		var statusStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				"name", "value"
			],
			proxy :
			{
				type : 'ajax',
				autoLoad : true,
				url : 'cpon/statusList.json',
				actionMethods :
				{
					read : 'POST'
				},
				reader :
				{
					type : 'json',
					root : 'd.filter'
				}
			}
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
					"value" : getLabel('tokenall', 'ALL')
				},
				{
					"key" : "B",
					"value" : getLabel('bank', 'Bank')
				},
				{
					"key" : "C",
					"value" : getLabel('client', 'Client')
				}
			]
		} );

		var clientAutoCompleterSeekId;
		if( entityType != null && entityType === '0' )
			clientAutoCompleterSeekId = 'interAccountParameterClientBankIdSeek';
		else
			clientAutoCompleterSeekId = 'interAccountParameterClientIdSeek';
		this.items =
		[
				
					{
						xtype : 'container',
						itemId : 'firstRow',
						width : 'auto',
						layout : 'column',
						cls : 'filter-container-cls',
						margin : 5,
						items :
						[ {
							   xtype : 'container',
							   columnWidth : 0.25,
							   padding : '5px',
					           itemId : 'clientFilter',
					           items: [{
										xtype : 'label',
										cls : 'f20 ux_font-size14 ux_normalmargin-bottom',
										itemId : 'labelclient',
										text : getLabel('grid.column.company', 'Company Name')
										 //cls : 'xn-custom-button cursor_pointer',
							          }, {
										xtype : 'AutoCompleter',								
										itemId : 'clientCodeItemId',
										matchFieldWidth : true,
										fieldCls : 'xn-form-text xn-suggestion-box ux_font-size14-normal',
					                    cls:'ux_font-size14-normal',
					                    height:25,
					                    fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelSeparator : '',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : clientAutoCompleterSeekId,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode1 : 'DESCRIPTION',
										cfgKeyNode : 'CODE',
										width:200,
										filterParamName : 'clientCode',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION'
										]
									}]
		    					},
							     {
									   xtype : 'container',
									   columnWidth : 0.25,
									   padding : '5px',
									   items: [{
											xtype : 'label',
											cls : 'f20 ux_font-size14 ux_normalmargin-bottom',
											itemId : 'labelAgreement',
											text : getLabel('agreementcode', 'Agreement Code')
											 //cls : 'xn-custom-button cursor_pointer',
								          },
								          {
											xtype : 'AutoCompleter',								
											itemId : 'agreementCodeItemId',
											matchFieldWidth : true,
											fieldCls : 'xn-form-text xn-suggestion-box ux_font-size14-normal',
					                        cls:'ux_font-size14-normal',
											labelSeparator : '',
											height:25,
											cfgUrl : 'services/userseek/interAccountParameterAgreementCodeSeek.json',
											cfgQueryParamName : '$autofilter',
											cfgRecordCount : -1,
											cfgSeekId : 'interAccountParameterAgreementCodeSeek',
											cfgRootNode : 'd.preferences',
											cfgDataNode1 : 'CODE',
											cfgDataNode2 : 'DESCRIPTION',
											cfgKeyNode : 'CODE',
											width:200,
											filterParamName : 'agreementCode',
											cfgStoreFields :
											[
												'CODE', 'DESCRIPTION','RECKEY'
											]
											
									}]
							   },
							   {
								xtype : 'container',
							    columnWidth : 0.25,
								padding : '5px',
								items: [{
										xtype : 'label',
										cls : 'f20 ux_font-size14 ux_normalmargin-bottom',
										itemId : 'labelfromAccnt',
										text : getLabel('fromAccnt', 'From Account')
										 //cls : 'xn-custom-button cursor_pointer',
							     		 },
									      {
											xtype : 'AutoCompleter',								
											itemId : 'fromAccountItemId',
											matchFieldWidth : true,
											fieldCls : 'xn-form-text xn-suggestion-box ux_font-size14-normal',
					                        cls:'ux_font-size14-normal',
											labelSeparator : '',
											cfgUrl : 'services/userseek/interAccountParameterFromAccountSeek.json',
											cfgQueryParamName : '$autofilter',
											cfgRecordCount : -1,
											height:25,
											cfgSeekId : 'interAccountParameterFromAccountSeek',
											cfgRootNode : 'd.preferences',
											cfgDataNode1 : 'DESCRIPTION',
											cfgDataNode2 : 'CODE',
											cfgKeyNode : 'ACCOUNTID',
											width:200,
											filterParamName : 'fromAccount',
											cfgStoreFields :
											[
												'CODE', 'DESCRIPTION','ACCOUNTID'									
											]
											
									 }]
							 },
							 {
							   xtype : 'container',
								columnWidth : 0.25,
							    padding : '5px',
								items: [{
										xtype : 'label',
										cls : 'f20 ux_font-size14 ux_normalmargin-bottom',
										itemId : 'labelToAccnt',
										text : getLabel('toAccnt', 'To Account')
										 //cls : 'xn-custom-button cursor_pointer',
							    		},
													
										{
											xtype : 'AutoCompleter',								
											itemId : 'toAccountItemId',
											matchFieldWidth : true,
											fieldCls : 'xn-form-text xn-suggestion-box ux_font-size14-normal',
					                        cls:'ux_font-size14-normal',
											labelSeparator : '',
											height:25,
											cfgUrl : 'services/userseek/interAccountParameterToAccountSeek.json',
											cfgQueryParamName : '$autofilter',
											cfgRecordCount : -1,
											cfgSeekId : 'interAccountParameterToAccountSeek',
											cfgRootNode : 'd.preferences',
											cfgDataNode1 : 'DESCRIPTION',
											cfgDataNode2 : 'CODE',
											width:200,
											filterParamName : 'toAccount',
											cfgKeyNode : 'ACCOUNTID',
											cfgStoreFields :
											[
												'CODE', 'DESCRIPTION','ACCOUNTID'
											]
											
										}]
							}
							/*{
								xtype : 'tbspacer',
								width : 30
							},*/
							/*{
								xtype : 'button',
								itemId : 'btnFilter',
								text : getLabel( 'search', 'Search' ),
								cls : 'search_button',
								padding : '0 0 0 0'
							}*/
							//Panel 4
							/*{
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
												text : getLabel( 'query', 'Query' ),
												cls : 'ux_button-padding ux_button-background-color',
												height : 22
											}
										]
									}
								]
							}*/
						]
					}
				
			
		];
		this.callParent( arguments );
	}
} );
