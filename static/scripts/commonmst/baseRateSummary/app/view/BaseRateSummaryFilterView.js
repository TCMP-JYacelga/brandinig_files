Ext
		.define(
				'GCP.view.BaseRateSummaryFilterView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'baseRateSummaryFilterView',
					requires : [ 'Ext.ux.gcp.AutoCompleter' ],
					width : '100%',
					componentCls : 'gradiant_back',
					collapsible : true,
					collapsed : true,
					cls : 'xn-ribbon',
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					initComponent : function() {

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
						                    "value" : getLabel( 'all', 'All' )
						               },
						               {
						                    "key" : "0NN",
						                    "value" : getLabel( 'new', 'New' )
						                    
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
						                    "value" : getLabel( 'lbl.userstatus.8', 'Modified Rejected' )
						               },
						               {
						                    "key" : "5YY",
						                    "value" : getLabel( 'lbl.userstatus.5', 'Suspend Request' )
						               },
						               {
						                    "key" : "9YN",
						                    "value" : getLabel( 'lbl.userstatus.9', 'Suspend Request Rejected' )
						               },
						               {
						                    "key" : "3NN",
						                    "value" : getLabel( 'lbl.userstatus.11', 'Suspended' )
						               },
						               {
						                    "key" : "4NY",
						                    "value" : getLabel( 'lbl.userstatus.4', 'Enable Request' )
						               },
						               {
						                    "key" : "10NN",
						                    "value" : getLabel( 'lbl.userstatus.10', 'Enable Request Rejected' )
						               },
									   {
											"key":"13NY",
											"value" : getLabel('lbl.userstatus.13', 'Pending My Approval')
									   }

									]
								} );

						this.items = [ {
							xtype : 'panel',
							layout : 'hbox',
							cls: ' ux_border-top ux_largepadding',
							items : [
									// Panel 1
									{
										xtype : 'panel',
										cls : 'xn-filter-toolbar',
										flex : 0.05,
										layout : {
											type : 'vbox'
										},
										items : [
												{
													xtype : 'panel',
													layout : {
														type : 'hbox'
													},
													items : [ {
														xtype : 'label',
														text : getLabel(
																'currency',
																'Currency'),
														cls : 'frmLabel',
														padding : '6 0 0 0'
													} ]
												},
												{
													xtype : 'AutoCompleter',
													matchFieldWidth : true,
													width : '100%',
													fieldCls : 'xn-form-text w14 xn-suggestion-box',
													labelSeparator : '',
													name : 'baseRateCurrency',
													itemId : 'baseRateCurrency',
													cfgUrl : 'services/userseek/{0}.json',
													cfgQueryParamName : '$autofilter',
													cfgRecordCount : -1,
													cfgSeekId : 'baseRatesMstCcySeek',
													cfgRootNode : 'd.preferences',
													cfgDataNode1 : 'CODE',
													cfgDataNode2 : 'DESCR',
													cfgStoreFields : [ 'CODE',
															'DESCR' ],
													padding : '6 0 0 0',
													cfgExtraParams : [],
													cfgProxyMethodType:'POST',
													enableQueryParam:false
												} ]
									},
									// Panel 2
									{
										xtype : 'panel',
										cls : 'xn-filter-toolbar',
										flex : 0.05,
										layout : {
											type : 'vbox'
										},
										items : [
												{
													xtype : 'panel',
													layout : {
														type : 'hbox'
													},
													items : [ {
														xtype : 'label',
														text : getLabel(
																'baseRateCode',
																'Base Rate Code'),
														cls : 'frmLabel',
														padding : '6 0 0 0'
													} ]
												},
												{
													xtype : 'AutoCompleter',
													matchFieldWidth : true,
													width : '100%',
													fieldCls : 'xn-form-text w14 xn-suggestion-box',
													labelSeparator : '',
													name : 'baseRateType',
													itemId : 'baseRateType',
													cfgUrl : 'services/userseek/{0}.json',
													cfgQueryParamName : '$autofilter',
													cfgRecordCount : -1,
													cfgSeekId : 'baseRatesMstRateTypeSeek',
													cfgRootNode : 'd.preferences',
													cfgDataNode1 : 'CODE',
													cfgDataNode2 : 'DESCR',
													cfgStoreFields : [ 'CODE',
															'DESCR' ],
													padding : '6 0 0 0',
													cfgExtraParams : [],
													cfgProxyMethodType:'POST',
													enableQueryParam:false
												} ]
									},
									// Panel 3
									{
										xtype : 'panel',
										cls : 'xn-filter-toolbar',
										flex : 0.05,
										layout : 'vbox',
										columnWidth : 0.22,
										items : [
												{
													xtype : 'label',
													text : getLabel(
															'status',
															'Status'),
													cls : 'frmLabel',
													flex : 1,
													padding : '6 0 0 0'
												},
												{
													xtype : 'combobox',
													fieldCls : 'xn-form-field inline_block',
													triggerBaseCls : 'xn-form-trigger',
													width : 165,
													padding : '6 0 0 0',													
													itemId : 'statusFilter',													
													store : statusStore,
													valueField : 'key',
													displayField : 'value',
													editable : false,
													value : getLabel('all', 'All'),
													listeners :
													{
														select : function( combo, record, index )
														{
															this.fireEvent('filterStatusType', combo, record, index);
														}
													}	
												} ]
									},
									// Panel 4
									{
										xtype : 'panel',
										cls : 'xn-filter-toolbar',
										layout : 'vbox',
										padding : '25 0 1 5',
										items : [ {
											xtype : 'button',
											itemId : 'btnFilter',
											text : getLabel(
													'search',
													'Search'),
											cls : 'ux_button-padding ux_button-background ux_button-background-color'
										} ]
									} ]
						} ];

						this.callParent(arguments);
					}
				});
