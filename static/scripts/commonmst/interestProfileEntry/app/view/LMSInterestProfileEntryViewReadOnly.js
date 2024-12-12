Ext
	.define(
			'GCP.view.LMSInterestProfileEntryViewReadOnly',
		{
			extend : 'Ext.panel.Panel',
			xtype : 'lmsInterestProfileEntryViewTypeOnly',
			requires :
			[
				'Ext.panel.Panel', 'Ext.button.Button', 'Ext.ux.gcp.AutoCompleter','Ext.grid.plugin.CellEditing'
			],
			modal : true,
			title : getLabel( 'lblLmsAddInterestProfile', 'Interest Profile Details' ),
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
				var interestBasisStore = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data :
					[
						{
							"key" : "-1",
							"value" : getLabel( "actualValue", "Actual/Actual")
						},
						{
							"key" : "360",
							"value" : getLabel( "actual360", "Actual/360")
						},
						{
							"key" : "365",
							"value" : getLabel( "actual365", "Actual/365")
						}
					]
				} );

				var slabTypeStore = Ext.create( 'Ext.data.Store',
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
				} );

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
											labelAlign : 'top'
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
												cls : 'frmLabel',
												text : getLabel( "seller", "Financial Institution" )+":"
											},
											{
												xtype : 'label',
												cls : 'ft-margin-very-small-l label-font-normal',
												text : strSellerId
											}
										]
									},
									{
										xtype : 'container',
										columnWidth : 0.33,
										defaults :
										{
											layout : 'vbox'
										},
										margin : '1 0 0 0',
										items :
										[
											{
												xtype : 'label',
												cls : 'frmLabel required  ',
												text : getLabel( "profileCode", "Profile Code" )
											},
											{
												xtype : 'textfield',
												itemId : 'profileCode',
												cls : 'ft-padding-l label-font-normal',
												readOnly : pageMode == 'view',
												value : profileCode
											}
										]
									},
									{
										xtype : 'container',
										columnWidth : 0.33,
										defaults :
										{
											layout : 'vbox'
										},
										margin : '1 0 0 0',
										items :
										[
											{
												xtype : 'label',
												cls : 'frmLabel required  ',
												text : getLabel( "prfDesc", "Profile Description" )
											},
											{
												xtype : 'textfield',
												itemId : 'profileDescription',
												cls : 'ft-padding-l label-font-normal',
												readOnly : pageMode == 'view',
												value : profileDescription
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
										items :
										[
											{
												//xtype : 'container',
												//layout : 'hbox',
												items:[
												{
													xtype : 'label',
													//margin : '1 0 0 0',
													cls : 'frmLabel required  ',
													text : getLabel( "profileType", "Profile Type" )
												},
												{
													xtype : 'container',
													layout : 'hbox',
													align : 'stretch',
													items : [{
																xtype : 'radiogroup',
																itemId : 'profileType',
																items :
																[
																	{
																		boxLabel : getLabel('bank','Bank'),
																		name : 'profileType',
																		inputValue : 'B',
																		id : 'profileTypeBank',
																		readOnly : ( pageMode == 'view' || isUpdate ),
																		width : 60,
																		checked : ( null != profileType && 'B' == profileType ? true
																			: false )
																	},
																	{
																		boxLabel : getLabel('apportionment','Apportionment'),
																		name : 'profileType',
																		inputValue : 'C',
																		id : 'profileTypeClient',
																		readOnly : ( pageMode == 'view' || isUpdate ),
																		width : 150,
																		checked : ( null != profileType && 'C' == profileType ? true
																			: false )
																	}
																]
													}]
												}]
											}
										]
									},
									{
										xtype : 'container',
										columnWidth : 0.33,
										items :
										[{
											//xtype : 'container',
											//layout : 'hbox',
											items:[
											{
												xtype : 'label',
												//margin : '1 0 0 0',
												cls : 'frmLabel required  ',
												text : getLabel( "interestType", "Interest Type" )
											},
											{
												xtype : 'container',
												layout : 'hbox',
												align : 'stretch',
												items : [{
														xtype : 'radiogroup',
														itemId : 'interestType',
														items :
														[
															{
																boxLabel : getLabel('debit','Debit'),
																name : 'interestType',
																inputValue : 'D',
																id : 'interestTypeDebit',
																width : 60,
																readOnly : ( pageMode == 'view' || isUpdate ),
																checked : ( null != interestType && 'D' == interestType ? true
																	: false )
															},
															{
																boxLabel : getLabel('credit','Credit'),
																name : 'interestType',
																inputValue : 'C',
																id : 'interestTypeCredit',
																width : 60,
																readOnly : ( pageMode == 'view' || isUpdate ),
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
												}]
											}]
										}]
									},
									{
										xtype : 'container',
										columnWidth : 0.34,
										defaults :
										{
											layout : 'vbox'
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
												xtype : 'textfield',
												cls : 'ft-padding-l label-font-normal',
												readOnly : pageMode == 'view',
												value : me.getSlabTypeDesc(slabType)
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
								cls : 'ux_largepaddinglr ux_extralargepadding-top ux_largepadding-bottom',
								items :
								[
									{
										xtype : 'container',
										columnWidth : 0.33,
										defaults :
										{
											layout : 'vbox'
										
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
												xtype : 'textfield',
												cls : 'ft-padding-l label-font-normal',
												readOnly : pageMode == 'view',
												value : me.getInterestBasisDesc(interestBasis)
											}
										]
									},
									{
										xtype : 'container',
										columnWidth : 0.33,
										defaults :
										{
											layout : 'vbox',
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'hidden',
												itemId : 'ccyCode',
												value : ccyCode
											},
											{
												xtype : 'label',
												cls : 'frmLabel required  ',
												text : getLabel( "prfCcy", "Profile CCY" )
											},
											{
												xtype : 'AutoCompleter',
												cls : 'autoCmplete-field',
												fieldCls : 'xn-form-text w13 xn-suggestion-box',
												//cls : 'ft-padding-l label-font-normal',
												readOnly : pageMode == 'view',
												value : ccyCode
											}
										]
									},
									{
										xtype : 'container',
										columnWidth : 0.33
									}
								]
							}
						]
					}
				//main Container
				];
				this.callParent( arguments );
			},
			getSlabTypeDesc : function(slabcode){
				var me,slabDesc;
				if(!Ext.isEmpty(slabcode)){
					if(slabcode === "1")
						slabDesc=getLabel( "direct", "Direct");
					else if(slabcode === "2")
						slabDesc=getLabel( "banded", "Banded");
					else if(slabcode === "3")
						slabDesc=getLabel( "steppedBanded", "Stepped Banded");
				}
				return slabDesc;
			},
			getInterestBasisDesc :function(interestBasisCode){
				var me,interestDesc;
				if(!Ext.isEmpty(interestBasisCode)){
					if(interestBasisCode === "360")
						interestDesc=getLabel( "actual360", "Actual/360");
					else if(interestBasisCode === "365")
						interestDesc=getLabel( "actual365", "Actual/365");
					else if(interestBasisCode === "-1")
						interestDesc=getLabel( "actualValue", "Actual/Actual");
				}
				return interestDesc;
			}
		} );
