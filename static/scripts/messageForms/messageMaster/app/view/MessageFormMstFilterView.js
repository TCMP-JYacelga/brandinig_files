/**
 * @class GCP.view.MessageFormMstFilterView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext.define('GCP.view.MessageFormMstFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'messageFormMstFilterViewType',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon ux_border-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		
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
                "value" : getLabel( 'lblPendingMyApproval', 'Pending My Approval' )
           }

			]
		} );
		
		this.items = [{
				xtype : 'panel',
				cls : 'ux_largepadding',
				layout : 'hbox',
				items :
				[
					// 1st panel
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						width: '20%',
						itemId : 'sellerFilter',
						padding: '0 25 0 0',
						border : false,
						
						layout :
						{
							type : 'vbox'
						},
						items :	[]
					},
						// 2nd panel
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						width: '20%',
						layout : 'vbox',
						padding: '0 25 0 0',
						items :
						[
							{
								xtype : 'label',
								text : getLabel('formGroup', 'Form Group'),
								cls : 'frmLabel'
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								width : '100%',
								fieldCls : 'xn-form-text xn-suggestion-box',
								labelSeparator : '',
								name : 'formGroup',
								itemId : 'formGroupFilterItemId',
								cfgUrl : 'services/userseek/bankMessageFormFormGroupSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'bankMessageFormFormGroupSeek',
								cfgRootNode : 'd.preferences',								
								cfgDataNode1 : 'DESCRIPTION',		
								//cfgDataNode2 : 'DESCRIPTION',
								enableQueryParam:false,
								cfgProxyMethodType:'POST',
								cfgStoreFields :
								[
									'CODE', 'DESCRIPTION'
								]
							}
						]
					},
						// 3rd panel
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						width: '20%',
						layout : 'vbox',
						padding: '0 25 0 0',
						items :
						[
							{
								xtype : 'label',
								text : getLabel('formDestination', 'Form Destination'),
								cls : 'frmLabel'
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								width : '100%',
								fieldCls : 'xn-form-text xn-suggestion-box',
								labelSeparator : '',
								name : 'formGroup',
								itemId : 'formDestinationFilterItemId',
								cfgUrl : 'services/userseek/bankMessageFormFormDestinationSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'bankMessageFormFormDestinationSeek',
								cfgRootNode : 'd.preferences',								
								cfgDataNode1 : 'DESCRIPTION',		
								//cfgDataNode2 : 'DESCRIPTION',
								enableQueryParam:false,
								cfgProxyMethodType:'POST',
								cfgStoreFields :
								[
									'CODE', 'DESCRIPTION'
								]
							}
						]
					},
						// 4th panel
					{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							width: '20%',
							padding: '0 25 0 0',
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
									width: '100%',
									itemId : 'requestStateFilterItemId',
									store : requestStateComboStore,
									valueField : 'key',
									displayField : 'value',
									editable : false,
									value : getLabel( 'lblAll', 'All' ),
									parent : this
								}
							]
					}, {
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							padding : '23 0 1 0',
							layout : 'vbox',
							width: '20%',
							items : [{
										xtype : 'button',
										itemId : 'filterBtnId',
										cls : 'ux_button-background-color ux_button-padding',
										text : getLabel('search', 'Search')
									}]
						}]
			} /*{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				padding : '0 0 10 10',
				layout : 'vbox',
				flex : 0.8,
				items : [{
							xtype : 'button',
							itemId : 'filterBtnId',
							cls : 'ux_button-background-color ux_button-padding',
							text : 'Search'
						}]
			}*/]
		this.callParent(arguments);
	},
	tools : [/*{
				xtype : 'button',
				itemId : 'btnSavePreferencesItemId',
				icon : 'static/images/icons/save.gif',
				disabled : true,
				text : getLabel('saveFilter', 'Save Filters'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 85
			}*/]
});
