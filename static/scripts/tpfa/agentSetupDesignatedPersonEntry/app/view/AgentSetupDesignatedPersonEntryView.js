Ext
	.define(
		'GCP.view.AgentSetupDesignatedPersonEntryView',
		{
			extend : 'Ext.panel.Panel',
			xtype : 'AgentSetupDesignatedPersonEntryViewType',
			requires :
			[
				'Ext.toolbar.Spacer','Ext.panel.Panel', 'Ext.button.Button', 'Ext.ux.gcp.AutoCompleter','Ext.grid.plugin.CellEditing'
			],
			modal : true,
			title : getLabel( 'lbldesignatedPersonDetails', 'Designated Person Details' ),
			cls : 'xn-ribbon ux_panel-transparent-background',
			collapsible : true,
			bodyCls : 'x-portlet ux_no-padding',
			height : 'auto',
			overflow : 'auto',
			closeAction : 'hide',
			width : 'auto',
			storeData : null,
			layout : 'fit',
			initComponent : function()
			{
				var me = this;
				if(entity_type === '0')
				{
					
				}
				var personTypeStore = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data :
					[
						{
							"key" : "-1",
							"value" : getLabel( "lblSelect", "Selectl")
						},
						{
							"key" : "0",
							"value" : getLabel( "lblDesignatedPerson", "Designated Person")
						},
						{
							"key" : "1",
							"value" : getLabel( "lblPartner", "Partner")
						}
					]
				} );

		var slabTypeStore = Ext.create('Ext.data.Store', {
		autoLoad: true,
		fields : ["CODE", "DESCR"],
			proxy : {
			type : 'ajax',
			url : 'services/userseek/interestprofileslabType.json',
			actionMethods : {
				read : 'POST'
				},
		reader : {
			type : 'json',
				root : 'd.preferences'
			}
			}
		});
					
					
					
/*				var slabTypeStore = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data :
					[
						{
							"key" : "1",
							"value" : getLabel( "direct", "Direct")
						},
						{
							"key" : "2",
							"value" : getLabel( "banded", "Banded")
						},
						{
							"key" : "3",
							"value" : getLabel( "steppedBanded", "Stepped Banded")
						}
					]
				} );*/

				this.items =
				[
					{
						xtype : 'hidden',
						name : csrfTokenName,
						value : csrfTokenValue
					},
					{
						xtype : 'container',
						width : '100%',
						layout : 'vbox',
						cls : 'filter-container-cls',
						items :
						[
							// 1st row
							{
								xtype : 'container',
								width : '100%',
								layout : 'column',		
								cls : 'filter-container-cls ux_largepaddinglr ux_largepadding-top',
								items :
								[
									{
										xtype : 'container',
										hidden : multipleSellersAvailable == true ? false : true,
										columnWidth : 0.33,
										defaults :
										{
											layout : 'vbox',
											labelAlign : 'top',
											labelSeparator : ''
										},
										cls : 'filter-container-cls',
										items :
										[
											{
												xtype : 'hidden',
												hidden : false,
												itemId : 'strEffectiveDate',
												value : strEffectiveDate
											},
											{
												xtype : 'hidden',
												itemId : 'specialEditStatus',
												value : specialEditStatus
											},
											{
												xtype : 'hidden',
												itemId : 'specialEditRemarks',
												value : specialEditRemarks
											},
											{
												xtype : 'hidden',
												itemId : 'sellerId',
												value : sellerId == "" || sellerId == null ? strSellerId : sellerId
											},
											{
												xtype : 'label',
												cls : 'frmLabel required  ',
												text : getLabel( "seller", "Financial Institution"  )
											},
											{
												xtype : 'combo',
												displayField : 'description',
												//fieldLabel : getLabel( "lblFi", "Financial Institution" ),
												//labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required  ',
												//hidden : multipleSellersAvailable == true ? false : true,
												//cls: 'w15',
												width : 180,
												fieldCls : pageMode == 'view' ? '' : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												filterParamName : 'sellerCode',
												itemId : 'dummySellerId',
												valueField : 'sellerCode',
												name : 'sellerCombo',
												editable : false,
												readOnly : pageMode == 'view',
												disabled : isUpdate,
												value :strSellerId,
												store : objStore,
												listeners :
												{
													select : function( combo, newValue, oldValue )
													{
														me.fireEvent( "sellerIdSelect", combo, newValue, oldValue );
													}
												}
											}
										]
									},
									{
										xtype : 'container',
										columnWidth : 0.33,
										defaults :
										{
											layout : 'vbox',
											labelAlign : 'top',
											labelSeparator : ''
										},
										cls : 'filter-container-cls',
										items :
										[
											{
												xtype : 'label',
												cls : 'frmLabel required  ',
												text : getLabel( "profileCode", "Profile Code"  )
											},
											{
												xtype : 'textfield',
												itemId : 'profileCode',
												cls: 'w15',
												maxLength : 10,
												enforceMaxLength : true,  
												readOnly : pageMode == 'view' || isUpdate,
												//disabled : isUpdate,
												//disabledCls : 'field-disable-cls',
												value : profileCode,
												listeners: 
												{
												    change: function(field, newValue, oldValue) 
												    {
												        field.setValue(newValue.toUpperCase());
												        setDirtyBit();
												    }
												}
											}
										]
									},
									{
										xtype : 'container',
										columnWidth : 0.33,
										defaults :
										{
											layout : 'vbox',
											labelAlign : 'top',
											labelSeparator : ''
										},
										cls : 'filter-container-cls',
										items :
										[
											{
												xtype : 'label',
												cls : 'frmLabel required  ',
												text : getLabel( "prfDesc", "Profile Description"  )
											},
											{
												xtype : 'textfield',
												itemId : 'profileDescription',
												value : profileDescription,
												readOnly : pageMode == 'view',
												//disabled : pageMode == 'view',
												maxLength : 40,
												enforceMaxLength : true,  
												cls: 'w15',
												listeners: 
												{
												    change: function(field, newValue, oldValue) 
												    {
												        setDirtyBit();
												    }
												}
											}
										]
									}
								]
							},

							// 2nd
							{
								xtype : 'container',
								width : '100%',
								layout : 'column',								
								cls : 'filter-container-cls ux_largepaddinglr ux_extralargepadding-top',
								items :
								[
									{
										xtype : 'container',
										columnWidth : 0.33,
										defaults :
										{
											layout : 'vbox',
											labelAlign : 'top',
											labelSeparator : ''
										},
										cls : 'filter-container-cls',
										items :
										[
											{
												xtype : 'label',
												cls : 'frmLabel required  ',
												text : getLabel( "profileType", "Profile Type" )
											},
											{
												xtype : 'container',
												columnWidth : 0.34,
												defaults :
												{
													layout : 'hbox',
													labelAlign : 'left',
													labelSeparator : ''
												},
												cls : 'filter-container-cls ',
												items :
												[
													{
														xtype : 'radiogroup',
														itemId : 'profileType',
														//layout : 'hbox',
														disabled : ( pageMode == 'view' || isUpdate ),
														items :
														[
															{
																boxLabel : getLabel('bank','Bank'),
																name : 'profileType',
																inputValue : 'B',
																id : 'profileTypeBank',
																checked : ( null != profileType && 'B' == profileType ? true
																	: false )
															},
															{
																xtype : 'tbspacer',
																width : 15
															},
															{
																boxLabel : getLabel('apportionment','Apportionment'),
																name : 'profileType',
																inputValue : 'C',
																id : 'profileTypeClient',
																checked : ( null != profileType && 'C' == profileType ? true
																	: false )
															}
														],
														listeners :
														{
															change : function( radiogroup, newValue, oldValue, eOpts )
															{
																setDirtyBit();
															}
														}
													} 
												]
											}
										]
									},
									{
										xtype : 'container',
										columnWidth : 0.33,
										defaults :
										{
											layout : 'vbox',
											labelAlign : 'left',
											labelSeparator : ''
										},
										cls : 'filter-container-cls',
										items :
										[
											{
												xtype : 'label',
												cls : 'frmLabel required  ',
												text : getLabel( "interestType", "Interest Type" )
											},
											{
												xtype : 'container',
												columnWidth : 0.45,
												defaults :
												{
													layout : 'hbox',
													labelAlign : 'left',
													labelSeparator : ''
												},
												cls : 'filter-container-cls',
												items :
												[
													{
														xtype : 'radiogroup',
														itemId : 'interestType',
														//layout : 'hbox',
														disabled : ( pageMode == 'view' || isUpdate ),
														items :
														[
															{
																boxLabel : getLabel('debit','Debit'),
																name : 'interestType',
																inputValue : 'D',
																id : 'interestTypeDebit',
																checked : ( null != interestType && 'D' == interestType ? true
																	: false )
															},
															{
																xtype : 'tbspacer',
																width : 15
															},
															{
																boxLabel : getLabel('credit','Credit'),
																name : 'interestType',
																inputValue : 'C',
																id : 'interestTypeCredit',
																checked : ( null != interestType && 'C' == interestType ? true
																	: false )
															}
														],
														listeners :
														{
															change : function( radiogroup, newValue, oldValue, eOpts )
															{
																setDirtyBit();
															}
														}
													}
												]
											}	
										]
									},
									{
										xtype : 'container',
										columnWidth : 0.34,
										defaults :
										{
											layout : 'vbox',
											labelAlign : 'left',
											labelSeparator : ''
										},
										cls : 'filter-container-cls',
										items :
										[
											{
												xtype : 'label',
												cls : 'frmLabel required  ',
												text : getLabel( "slabType", "Slab Type" )
											},
											{
												xtype : 'combobox',
												itemId : 'slabType',
												store : slabTypeStore,
												valueField : 'CODE',												
												width : 180,
												displayField : 'DESCR',
												fieldCls : pageMode == 'view' ? '' : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												value : slabType,
												readOnly : pageMode == 'view' ,
												disabled : pageMode == 'view',
												editable : false,
												listeners :
												{
													select : function( combo, newValue, oldValue )
													{
														setDirtyBit();
													},
													change : function( combo, newValue, oldValue )
													{
													}
												}
											}
										]
									}
								]
							},
							// 3rd row
							{
								xtype : 'container',
								width : '100%',
								layout : 'column',
								cls : 'filter-container-cls ux_largepaddinglr ux_extralargepadding-top ux_largepadding-bottom',
								items :
								[
									{
										xtype : 'container',
										columnWidth : 0.33,
										defaults :
										{
											layout : 'vbox',
											labelAlign : 'top',
											labelSeparator : ''
										},
										cls : 'filter-container-cls',
										items :
										[
											{
												xtype : 'label',
												cls : 'frmLabel required  ',
												text : getLabel( "interestBasis", "Interest Basis" )
											},
											{
												xtype : 'combo',
												displayField : 'value',
												width : 180,
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												itemId : 'interestBasis',
												valueField : 'key',
												name : 'interestBasisCombo',
												editable : false,
												readOnly : pageMode == 'view',
												disabled : pageMode == 'view',
												value :interestBasis,
												store : interestBasisStore,
												listeners :
												{
													select : function( combo, newValue, oldValue )
													{
														//me.fireEvent( "sellerIdSelect", combo, newValue, oldValue );
														setDirtyBit();
													}
												}
											}
										]
									},
									{
										xtype : 'container',
										columnWidth : 0.33,
										defaults :
										{
											layout : 'vbox',
											labelAlign : 'top',
											labelSeparator : ''
										},
										cls : 'filter-container-cls',
										items :
										[
											{
												xtype : 'hidden',
												itemId : 'ccyCode',
												value : ccyCode
											},
											{
												xtype : 'label',
												cls : 'frmLabel required',
												text : getLabel( "prfCcy", "Profile CCY" )
											},
											{
												xtype : 'AutoCompleter',
												itemId : 'dummyccyCode',
												cls : 'autoCmplete-field',
												fieldCls : 'xn-form-text w13 xn-suggestion-box',
												labelSeparator : '',
												cfgUrl : 'services/userseek/interestprofilepaymentccy.json',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'paymentccy',
												cfgRootNode : 'd.preferences',
												cfgDataNode1 : 'CODE',
												cfgDataNode2 : 'DESCR',
												value : ccyCode,
												readOnly : pageMode == 'view' || isUpdate,
												//disabled : isUpdate,
												disabledCls : 'field-disable-cls',
												//labelCls : 'x-form-item-label x-unselectable x-form-item-label-top tdfrmLabel tdrequired',
												listeners :
												{
													select : function( combo, newValue, oldValue )
													{
														me.fireEvent( "ccyCodeSelect", combo, newValue, oldValue );
														setDirtyBit();
													}
												}
											}
										]
									},
									{
										xtype : 'container',
										columnWidth : 0.34,
										defaults :
										{
											layout : 'vbox',
											labelAlign : 'top',
											labelSeparator : ''
										},
										cls : 'filter-container-cls',
										items :
										[
											
										]
									}
								]
							}
						]
					}
				//main Container
				];
				this.callParent( arguments );
			}
		} );
