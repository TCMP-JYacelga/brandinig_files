Ext.define( 'GCP.view.AgreementPassiveDtlFilterView',
	{
		extend : 'Ext.panel.Panel',
		xtype : 'agreementPassiveDtlFilterViewType',
		requires : 
		[
		   'Ext.ux.gcp.AutoCompleter'
		],
		width : '100%',
		margin : '0 0 10 0',
		componentCls : 'gradiant_back',
		collapsible : true,
		cls : 'xn-ribbon',
		layout :
		{
			type : 'vbox',
			align : 'stretch'
		},
		initComponent : function()
		{			
			var statusStore;			
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
							"value" : getLabel( 'lblAll', 'ALL' )
						},
						{
							"key" : "101",
							"value" : getLabel( 'lblSweep', 'Sweep' )
						},
						{
							"key" : "401",
							"value" : getLabel( 'lblPassive', 'Passive' )
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
			
			strucSubTypeList = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data :
					[
						
						
					]
				} );
			
				statusStore = Ext.create( 'Ext.data.Store',
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
							"key" : "0.N.N",
							"value" : getLabel( 'lblDraft', 'Draft' )
							
						},
						{
							"key" : "0NY",
							"value" : getLabel( 'lblNew', 'New' )
							
						},
						{
							"key" : "1YN",
							"value" : getLabel( 'lblModifiedDraft', 'Modified Draft' )
						},
						{
							"key" : "1YY",
							"value" : getLabel( 'lblModified', 'Modified' )
						},
						{
							"key" : "3NN",
							"value" : getLabel( 'lblDeleted', 'Disabled' )
						},
						{
							"key" : "3YN",
							"value" : getLabel( 'lblAuthorized', 'Authorized' )
						},
						{
							"key" : "4NY",
							"value" : getLabel( 'lblAuthorized', 'Enable Request' )
						},
						{
							"key" : "5YY",
							"value" : getLabel( 'lblDisableRequest', 'Disable Request' )
						},
						{
							"key" : "5YY",
							"value" : getLabel( 'lblClosed', 'Closed' )
						},
						{
							"key" : "7NN",
							"value" : getLabel( 'lblNewRejected', 'New Rejected' )
						},
						{
							"key" : "8YN",
							"value" : getLabel( 'lblModifiedReject', 'Modified Reject' )
						},
						{
							"key" : "9YN",
							"value" : getLabel( 'lblDisableReqRejected', 'Disable Request Rejected' )
						},
						{
							"key" : "10NN",
							"value" : getLabel( 'lblEnableReqRejected', 'Enable Request Rejected' )
						}
					]
				} );
			
			this.items =
			[
				{
					xtype : 'panel',
					layout : 'hbox',
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
											text : getLabel( 'lbl.notionalMst.seller', 'Financial Institution' ),
											cls : 'f13',
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
									name : 'entitledSellerId',
									itemId : 'entitledSellerIdItemId',
									cfgUrl : 'services/userseek/sweepEntitledSellerIdSeek.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'sweepEntitledSellerIdSeek',
									cfgRootNode : 'd.preferences',
									cfgDataNode1 : 'DESCRIPTION',
									cfgDataNode2 : 'CODE',
									cfgStoreFields :
									[
										'CODE', 'DESCRIPTION'
									],
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
											text : getLabel( 'lbl.notionalMst.client', 'Client Code' ),
											cls : 'f13',
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
									itemId : 'clientIdItemId',
									cfgUrl : 'services/userseek/sweepClientIdSeek.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'sweepClientIdSeek',
									cfgRootNode : 'd.preferences',
									cfgDataNode1 : 'DESCRIPTION',
									cfgStoreFields :
									[
										'CODE', 'DESCRIPTION'
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
							layout : 'vbox',
							columnWidth : 0.22,
							items : [
							           {
											xtype : 'label',
											text : getLabel('lms.notionalMst.structureType', 'Structure Type'),
											cls : 'f13',
											flex : 1,
											padding : '6 0 0 8'
										},
										{
											xtype : 'combobox',
											fieldCls : 'xn-form-field inline_block',
											triggerBaseCls : 'xn-form-trigger',
											padding : '5 5 1 5',
											matchFieldWidth : true,
											itemId : 'structureTypeId',
											store : structureTypeStore,
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
													//this.parent.fireEvent('filterStructureType', combo, record, index);
												}
											}
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
											text :getLabel('lms.notionalMst.status', 'Status'),
											cls : 'f13',
											flex : 1,
											padding : '6 0 0 8'
										},
										{
											xtype : 'combobox',
											fieldCls : 'xn-form-field inline_block',
											triggerBaseCls : 'xn-form-trigger',
											padding : '5 5 1 5',
											matchFieldWidth : true,
											itemId : 'statusId',
											store : statusStore,
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
													//this.parent.fireEvent('filterStatusType', combo, record, index);
												}
											}	
										}
									]
						},
						//Panel 6
						 {
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							layout : 'vbox',
							flex : 0.05,
							columnWidth : 0.15,
							items : [{
										xtype : 'panel',
										layout : 'hbox',
										padding : '23 0 1 0',
										items : [{
													xtype : 'button',
													itemId : 'btnFilter',
													text : getLabel('search',
															'Search'),
													cls : 'search_button',		
													width : 60,
													height : 22
												}]
									}]
						}
					]
				}
			];
			this.callParent( arguments );
		},
		tools :
		[	{
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
			}
		]
	} );
