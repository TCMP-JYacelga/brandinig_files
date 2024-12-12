/**
 * @class BankProcessingQueueCreateNewAdvFilter
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */

Ext
	.define(
		'GCP.view.BankProcessingQueueCreateNewAdvFilter',
		{
			extend : 'Ext.panel.Panel',
			xtype : 'bankProcessingQueueCreateNewAdvFilter',
			requires :
			[
				'Ext.ux.gcp.DateHandler', 'Ext.ux.gcp.AutoCompleter'
			],
			callerParent : null,
			//width : 680,
			width : 'auto',
			height : 'auto',
			layout :
			{
				type : 'vbox'
			},
			initComponent : function()
			{
				var me = this;

				var fieldWidth = 220;
				var blankLineHeight = 1.5;

				var arrAmountOptFilter =
				[
					{
						"key" : "ge",
						"value" : ">="
					},
					{
						"key" : "le",
						"value" : "<="
					},
					{
						"key" : "eq",
						"value" : "="
					},
					{
						"key" : "gt",
						"value" : ">"
					},
					{
						"key" : "lt",
						"value" : "<"
					}
				];
				var comboStoreAmountOptFilter = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data : arrAmountOptFilter
				} );

				var dateHandlerController = Ext.create( 'Ext.ux.gcp.DateHandler' );
				if( !Ext.isEmpty( dateHandlerController ) )
					this.dateHandler = dateHandlerController;

				this.items =
				[
					{
						xtype : 'container',
						layout : 'vbox',
						cls : 'filter-container-cls',
						width : 'auto',
						itemId : 'parentContainer',
						defaults :
						{
							margin : '5 0 0 3'
						},
						items :
						[
							// filter name
							{
								xtype : 'container',
								layout : 'hbox',
								defaults :
								{
									labelAlign : 'top'
								},
								items :
								[
									{
										xtype : 'container',
										width : fieldWidth,
										layout : 'vbox',
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'label',
												cls : 'red',
												itemId : 'errorLabel',
												height : 10,
												hidden : true
											},
											{
												xtype : 'textfield',
												itemId : 'filterCode',
												fieldLabel : getLabel( 'filterName', 'Filter Name' ),
												maxLength : 20,
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													keypress : function( text )
													{
														if( text.value.length === 20 )
															me.showErrorMsg();
													}
												}
											}
										]
									}
								]
							},

							// blank 1 line space
							{
								xtype : 'label',
								height : blankLineHeight
							},

							// user branch, all branches, enter branch
							{
								xtype : 'container',
								layout : 'hbox',
								defaults :
								{
									labelAlign : 'top'
								},
								items :
								[
									{
										xtype : 'radiogroup',
										itemId : 'branchRadioFilterItemId',
										layout : 'hbox',
										items :
										[
											{
												boxLabel : getLabel( 'userBranch', 'User branch' ),
												width : fieldWidth,
												name : 'branchTypeFilter',
												inputValue : userBranch,
												checked : true
											},
											{
												boxLabel : getLabel( 'allBranches', 'All Branches' ),
												width : fieldWidth - 25,
												name : 'branchTypeFilter',
												inputValue : 'All'
											},
											{
												name : 'branchTypeFilter',
												inputValue : 'seek'
											},
											{
												xtype : 'label',
												text : '',
												width : 3
											}
										]
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										name : 'branchCode',
										itemId : 'branchSeekFilterItemId',
										editable : false,
										cfgUrl : 'services/userseek/BankProcessingQueueBranch.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'BankProcessingQueueBranch',
										cfgRootNode : 'd.preferences',
										cfgKeyNode : 'CODE',
										cfgDataNode1 : 'DESCR',
										cfgDataNode2 : 'CODE',
										cfgExtraParams :
										[
											{
												key : '$filtercode1',
												value : userSeller
											}
										]
									}
								]
							},

							// blank 1 line space
							{
								xtype : 'label',
								height : blankLineHeight
							},

							// file name, payment type, package
							{
								xtype : 'container',
								layout : 'hbox',
								defaults :
								{
									labelAlign : 'top'
								},
								items :
								[
									{
										xtype : 'container',
										layout : 'vbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'textfield',
												itemId : 'fileNameFilterItemId',
												fieldLabel : getLabel( 'fileName', 'File Name' ),
												maxLength : 20,
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													keypress : function( text )
													{
														if( text.value.length === 20 )
															me.showErrorMsg();
													}
												}
											}
										]
									},
									{
										xtype : 'container',
										layout : 'vbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'combobox',
												displayField : 'value',
												valueField : 'key',
												fieldLabel : getLabel( 'paymentType', 'Payment Type' ),
												itemId : 'paymentTypeFilterItemId',
												editable : false,
												store : paymentTypeList,
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												value : 'All'
											}
										]
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldLabel : getLabel( 'package', 'Package' ),
										name : 'paymentPkgName',
										itemId : 'paymentPkgNameFilterItemId',
										cfgUrl : 'services/userseek/BankProcessingQueuePackage.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'BankProcessingQueuePackage',
										cfgRootNode : 'd.preferences',
										cfgKeyNode : 'CODE',
										cfgDataNode1 : 'DESCR',
										cfgDataNode2 : 'CODE',
										cfgExtraParams :
										[
											{
												key : '$filtercode1',
												value : userSeller
											}
										]
									}
								]
							},

							// blank 1 line space
							{
								xtype : 'label',
								height : blankLineHeight
							},

							// product, amount, no of instrument
							{
								xtype : 'container',
								layout : 'hbox',
								defaults :
								{
									labelAlign : 'top'
								},
								items :
								[
									{
										xtype : 'AutoCompleter',
										width : fieldWidth,
										cls : 'autoCmplete-field',
										fieldLabel : getLabel( 'product', 'Product' ),
										name : 'productCode',
										itemId : 'productCodeFilterItemId',
										cfgUrl : 'services/userseek/BankProcessingQueueProduct.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'BankProcessingQueueProduct',
										cfgRootNode : 'd.preferences',
										cfgKeyNode : 'CODE',
										cfgDataNode1 : 'DESCR',
										cfgDataNode2 : 'CODE',
										cfgExtraParams :
										[
											{
												key : '$filtercode1',
												value : userSeller
											}
										]
									},
									{
										xtype : 'container',
										layout : 'hbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'combobox',
												width : fieldWidth - 180,
												fieldLabel : getLabel( 'amount', 'Amount' ),
												displayField : 'value',
												valueField : 'key',
												itemId : 'amountOptFilterItemId',
												editable : false,
												store : comboStoreAmountOptFilter,
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												value : '>='
											},
											{
												xtype : 'textfield',
												itemId : 'batchAmountFilterItemId',
												padding : '18 0 0 10',
												width : fieldWidth - 125,
												//fieldLabel : getLabel( 'amount', 'Amount' ),
												maxLength : 20,
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													keypress : function( text )
													{
														if( text.value.length === 20 )
															me.showErrorMsg();
													}
												}
											}
										]
									},
									{
										xtype : 'textfield',
										itemId : 'totalTxnsFilterItemId',
										fieldLabel : getLabel( 'noOfInst', 'No. of Instruments' ),
										maxLength : 20,
										enforceMaxLength : true,
										enableKeyEvents : true,
										listeners :
										{
											keypress : function( text )
											{
												if( text.value.length === 20 )
													me.showErrorMsg();
											}
										}
									}
								]
							},

							// blank 1 line space
							{
								xtype : 'label',
								height : blankLineHeight
							},

							// creation date, effective date, process date
							{
								xtype : 'container',
								layout : 'hbox',
								defaults :
								{
									labelAlign : 'top'
								},
								items :
								[
									{
										xtype : 'container',
										layout : 'vbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'datefield',
												name : 'receivedOn',
												itemId : 'creationDateFilterItemId',
												editable : false,
												fieldLabel : getLabel( 'creationDate', 'Creation Date' ),
												//labelStyle : 'padding-left:10px',
												fieldCls : 'xn-valign-middle xn-form-text',
												allowBlank : true,
												hideTrigger : true
											}
										]
									},
									{
										xtype : 'container',
										layout : 'vbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'datefield',
												name : 'effectiveDate',
												itemId : 'effectiveDateFilterItemId',
												editable : false,
												fieldLabel : getLabel( 'effectiveDate', 'Effective Date' ),
												//labelStyle : 'padding-left:10px',
												fieldCls : 'xn-valign-middle xn-form-text',
												allowBlank : true,
												hideTrigger : true
											}
										]
									},
									{
										xtype : 'container',
										layout : 'vbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'datefield',
												name : 'processDate',
												itemId : 'processDateFilterItemId',
												editable : false,
												fieldLabel : getLabel( 'processDate', 'Process Date' ),
												//labelStyle : 'padding-left:10px',
												fieldCls : 'xn-valign-middle xn-form-text',
												allowBlank : true,
												hideTrigger : true
											}
										]
									}
								]
							},

							// blank 1 line space
							{
								xtype : 'label',
								height : blankLineHeight
							},

							// sending account, sending account name, payment reference
							{
								xtype : 'container',
								layout : 'hbox',
								defaults :
								{
									labelAlign : 'top'
								},
								items :
								[
									{
										xtype : 'AutoCompleter',
										width : fieldWidth,
										cls : 'autoCmplete-field',
										fieldLabel : getLabel( 'sendingAccount', 'Sending Account' ),
										name : 'debitAccount',
										itemId : 'debitAccountFilterItemId',
										cfgUrl : 'services/userseek/BankProcessingQueueSendingAcc.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'BankProcessingQueueSendingAcc',
										cfgRootNode : 'd.preferences',
										cfgKeyNode : 'CODE',
										cfgDataNode1 : 'DESCR',
										cfgDataNode2 : 'CODE',
										cfgExtraParams :
										[
											{
												key : '$filtercode1',
												value : userSeller
											}
										]
									},
									{
										xtype : 'container',
										layout : 'vbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'textfield',
												itemId : 'debitAccountNameFilterItemId',
												fieldLabel : getLabel( 'sendingAccountName', 'Sending Account Name' ),
												maxLength : 40,
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													keypress : function( text )
													{
														if( text.value.length === 40 )
															me.showErrorMsg();
													}
												}
											}
										]
									},
									{
										xtype : 'container',
										layout : 'vbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'textfield',
												itemId : 'referenceFilterItemId',
												fieldLabel : getLabel( 'paymentReference', 'Payment Reference' ),
												maxLength : 20,
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													keypress : function( text )
													{
														if( text.value.length === 20 )
															me.showErrorMsg();
													}
												}
											}
										]
									}
								]
							},

							// blank 1 line space
							{
								xtype : 'label',
								height : blankLineHeight
							},

							// arrangement, instrument code, batch status
							{
								xtype : 'container',
								layout : 'hbox',
								defaults :
								{
									labelAlign : 'top'
								},
								items :
								[

									{
										xtype : 'container',
										layout : 'hbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'combobox',
												//width : fieldWidth - 180,
												fieldLabel : getLabel( 'arrangement', 'Arrangement' ),
												displayField : 'value',
												valueField : 'key',
												itemId : 'arrangementCodeFilterItemId',
												editable : false,
												store : arrangementCodeList,
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												value : 'All'
											}
										]
									},
									{
										xtype : 'container',
										layout : 'hbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'combobox',
												//width : fieldWidth - 180,
												fieldLabel : getLabel( 'instrumentCode', 'Instrument Code' ),
												displayField : 'value',
												valueField : 'key',
												itemId : 'instCodeFilterItemId',
												editable : false,
												store : channelCodeList,
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												value : 'All'
											}
										]
									},
									{
										xtype : 'container',
										layout : 'hbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'combobox',
												//width : fieldWidth - 180,
												fieldLabel : getLabel( 'batchStatus', 'Batch Status' ),
												displayField : 'value',
												valueField : 'key',
												itemId : 'statusFilterItemId',
												editable : false,
												store : '',
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												value : 'All'
											}
										]
									}
								]
							},

							// blank 1 line space
							{
								xtype : 'label',
								height : blankLineHeight
							},

							// channel, delivery mode, maker id
							{
								xtype : 'container',
								layout : 'hbox',
								defaults :
								{
									labelAlign : 'top'
								},
								items :
								[

									{
										xtype : 'container',
										layout : 'hbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'combobox',
												//width : fieldWidth - 180,
												fieldLabel : getLabel( 'channel', 'Channel' ),
												displayField : 'value',
												valueField : 'key',
												itemId : 'channelCodeFilterItemId',
												editable : false,
												store : channelCodeList,
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												value : 'All'
											}
										]
									},
									{
										xtype : 'container',
										layout : 'hbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'combobox',
												//width : fieldWidth - 180,
												fieldLabel : getLabel( 'deliveryMode', 'Delivery Mode' ),
												displayField : 'value',
												valueField : 'key',
												itemId : 'deliveryModeFilterItemId',
												editable : false,
												store : deliverModesList,
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												value : 'All'
											}
										]
									},
									{
										xtype : 'AutoCompleter',
										width : fieldWidth,
										cls : 'autoCmplete-field',
										fieldLabel : getLabel( 'makerId', 'Maker Id' ),
										name : 'makerId',
										itemId : 'makerIdFilterItemId',
										cfgUrl : 'services/userseek/BankProcessingQueueMakerId.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'BankProcessingQueueMakerId',
										cfgRootNode : 'd.preferences',
										cfgKeyNode : 'CODE',
										cfgDataNode1 : 'DESCR',
										cfgDataNode2 : 'CODE',
										cfgExtraParams :
										[
											{
												key : '$filtercode1',
												value : userSeller
											}
										]
									}
								]
							},

							// blank 1 line space
							{
								xtype : 'label',
								height : blankLineHeight
							}
						]
					}
				];

				this.dockedItems =
				[
					{
						xtype : 'toolbar',
						padding : '10 0 10 0',
						dock : 'bottom',
						items :
						[
							'->',
							{
								xtype : 'button',
								cls : 'xn-button',
								text : getLabel( 'btnSearch', 'Search' ),
								itemId : 'searchBtn',
								handler : function( btn )
								{
									if( me.callerParent == 'bankProcessingQueueView' )
									{
										me.fireEvent( 'handleSearchAction', btn );
									}
								}
							},
							{
								xtype : 'button',
								cls : 'xn-button',
								text : getLabel( 'btnSaveAndSearch', 'Save and Search' ),
								itemId : 'saveAndSearchBtn',
								handler : function( btn )
								{
									if( me.callerParent == 'bankProcessingQueueView' )
									{
										me.fireEvent( 'handleSaveAndSearchAction', btn );
									}

								}
							},
							{
								xtype : 'button',
								cls : 'xn-button',
								text : getLabel( 'btnCancel', 'Cancel' ),
								itemId : 'cancelBtn',
								handler : function( btn )
								{
									if( me.callerParent == 'bankProcessingQueueView' )
									{
										me.fireEvent( 'closeFilterPopup', btn );
									}

								}
							}
						]
					}
				];

				this.callParent( arguments );
			},

			getAdvancedFilterValueJson : function( filterCodeVal, objOfCreateNewFilter )
			{
				var objJson = null;
				var jsonArray = [];

				var branchRadioFilter = objOfCreateNewFilter.down( 'radiogroup[itemId="branchRadioFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( branchRadioFilter ) )
				{
					jsonArray.push(
					{
						field : 'branchRadio',
						operator : 'eq',
						value1 : branchRadioFilter,
						value2 : ''
					} );

					if( branchRadioFilter.branchTypeFilter === 'seek' )
					{
						var branchSeekFilter = objOfCreateNewFilter.down(
							'AutoCompleter[itemId="branchSeekFilterItemId"]' ).getValue();
						if( !Ext.isEmpty( branchSeekFilter ) )
						{
							jsonArray.push(
							{
								field : 'branchSeek',
								operator : 'eq',
								value1 : branchSeekFilter,
								value2 : ''
							} );
						}
					}
					else if( branchRadioFilter.branchTypeFilter != 'All' )
					{
						/*jsonArray.push(
						{
							field : 'branchCode',
							operator : 'eq',
							value1 : branchRadioFilter.branchTypeFilter,
							value2 : ''
						} );*/
					}
				}

				var fileNameFilter = objOfCreateNewFilter.down( 'textfield[itemId="fileNameFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( fileNameFilter ) )
				{
					jsonArray.push(
					{
						field : 'fileName',
						operator : 'eq',
						value1 : fileNameFilter,
						value2 : ''
					} );
				}

				var paymentTypeFilter = objOfCreateNewFilter.down( 'combobox[itemId="paymentTypeFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( paymentTypeFilter ) && paymentTypeFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'paymentType',
						operator : 'eq',
						value1 : paymentTypeFilter,
						value2 : ''
					} );
				}

				var paymentPkgNameFilter = objOfCreateNewFilter.down(
					'AutoCompleter[itemId="paymentPkgNameFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( paymentPkgNameFilter ) )
				{
					jsonArray.push(
					{
						field : 'paymentPkgName',
						operator : 'eq',
						value1 : paymentPkgNameFilter,
						value2 : ''
					} );
				}

				var productCodeFilter = objOfCreateNewFilter.down( 'AutoCompleter[itemId="productCodeFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( productCodeFilter ) )
				{
					jsonArray.push(
					{
						field : 'productCode',
						operator : 'eq',
						value1 : productCodeFilter,
						value2 : ''
					} );
				}

				var batchAmountFilter = objOfCreateNewFilter.down( 'textfield[itemId="batchAmountFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( batchAmountFilter ) )
				{
					var amountOptFilter = objOfCreateNewFilter.down( 'combobox[itemId="amountOptFilterItemId"]' )
						.getValue();
					jsonArray.push(
					{
						field : 'batchAmount',
						operator : amountOptFilter,
						value1 : batchAmountFilter,
						value2 : ''
					} );

					jsonArray.push(
					{
						field : 'amountOpt',
						operator : 'eq',
						value1 : amountOptFilter,
						value2 : ''
					} );

				}

				var totalTxnsFilter = objOfCreateNewFilter.down( 'textfield[itemId="totalTxnsFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( totalTxnsFilter ) )
				{
					jsonArray.push(
					{
						field : 'totalTxns',
						operator : 'eq',
						value1 : totalTxnsFilter,
						value2 : ''
					} );
				}

				var creationDateFilter = objOfCreateNewFilter.down( 'datefield[itemId="creationDateFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( creationDateFilter ) )
				{
					jsonArray.push(
					{
						field : 'creationDate',
						operator : 'eq',
						dataType : 1,
						value1 : Ext.Date.format( creationDateFilter, 'Y-m-d' ),
						value2 : ''
					} );
				}

				var effectiveDateFilter = objOfCreateNewFilter.down( 'datefield[itemId="effectiveDateFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( effectiveDateFilter ) )
				{
					jsonArray.push(
					{
						field : 'effectiveDate',
						operator : 'eq',
						dataType : 1,
						value1 : Ext.Date.format( effectiveDateFilter, 'Y-m-d' ),
						value2 : ''
					} );
				}

				var processDateFilter = objOfCreateNewFilter.down( 'datefield[itemId="processDateFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( processDateFilter ) )
				{
					jsonArray.push(
					{
						field : 'processDate',
						operator : 'eq',
						dataType : 1,
						value1 : Ext.Date.format( processDateFilter, 'Y-m-d' ),
						value2 : ''
					} );
				}

				var debitAccountFilter = objOfCreateNewFilter.down( 'AutoCompleter[itemId="debitAccountFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( debitAccountFilter ) )
				{
					jsonArray.push(
					{
						field : 'debitAccount',
						operator : 'eq',
						value1 : debitAccountFilter,
						value2 : ''
					} );
				}

				var debitAccountNameFilter = objOfCreateNewFilter.down(
					'textfield[itemId="debitAccountNameFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( debitAccountNameFilter ) )
				{
					jsonArray.push(
					{
						field : 'debitAccountName',
						operator : 'eq',
						value1 : debitAccountNameFilter,
						value2 : ''
					} );
				}

				var referenceFilter = objOfCreateNewFilter.down( 'textfield[itemId="referenceFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( referenceFilter ) )
				{
					jsonArray.push(
					{
						field : 'reference',
						operator : 'eq',
						value1 : referenceFilter,
						value2 : ''
					} );
				}

				var arrangementCodeFilter = objOfCreateNewFilter
					.down( 'combobox[itemId="arrangementCodeFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( arrangementCodeFilter ) && arrangementCodeFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'arrangementCode',
						operator : 'eq',
						value1 : arrangementCodeFilter,
						value2 : ''
					} );
				}

				var instCodeFilter = objOfCreateNewFilter.down( 'combobox[itemId="instCodeFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( instCodeFilter ) && instCodeFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'instCode',
						operator : 'eq',
						value1 : instCodeFilter,
						value2 : ''
					} );
				}

				var statusFilter = objOfCreateNewFilter.down( 'combobox[itemId="statusFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( statusFilter ) && statusFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'status',
						operator : 'eq',
						value1 : statusFilter,
						value2 : ''
					} );
				}

				var channelCodeFilter = objOfCreateNewFilter.down( 'combobox[itemId="channelCodeFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( channelCodeFilter ) && channelCodeFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'channelCode',
						operator : 'eq',
						value1 : channelCodeFilter,
						value2 : ''
					} );
				}

				var deliveryModeFilter = objOfCreateNewFilter.down( 'combobox[itemId="deliveryModeFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( deliveryModeFilter ) && deliveryModeFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'deliveryMode',
						operator : 'eq',
						value1 : deliveryModeFilter,
						value2 : ''
					} );
				}

				var makerIdFilter = objOfCreateNewFilter.down( 'AutoCompleter[itemId="makerIdFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( makerIdFilter ) )
				{
					jsonArray.push(
					{
						field : 'makerId',
						operator : 'eq',
						value1 : makerIdFilter,
						value2 : ''
					} );
				}

				var filterCode = '';
				objJson = {};
				objJson.filterBy = jsonArray;
				if( filterCodeVal && !Ext.isEmpty( filterCodeVal ) )
					objJson.filterCode = filterCode;
				return objJson;
			},

			getAdvancedFilterQueryJson : function( objOfCreateNewFilter )
			{
				var objJson = null;
				var jsonArray = [];

				var branchRadioFilter = objOfCreateNewFilter.down( 'radiogroup[itemId="branchRadioFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( branchRadioFilter ) )
				{
					if( branchRadioFilter.branchTypeFilter == 'seek' )
					{
						var branchSeekFilter = objOfCreateNewFilter.down(
							'AutoCompleter[itemId="branchSeekFilterItemId"]' ).getValue();
						if( !Ext.isEmpty( branchSeekFilter ) )
						{
							jsonArray.push(
							{
								field : 'branchCode',
								operator : 'eq',
								value1 : branchSeekFilter,
								value2 : ''
							} );
						}
					}
					else if( branchRadioFilter.branchTypeFilter != 'All' )
					{
						jsonArray.push(
						{
							field : 'branchCode',
							operator : 'eq',
							value1 : branchRadioFilter.branchTypeFilter,
							value2 : ''
						} );
					}
				}

				var fileNameFilter = objOfCreateNewFilter.down( 'textfield[itemId="fileNameFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( fileNameFilter ) )
				{
					jsonArray.push(
					{
						field : 'fileName',
						operator : 'eq',
						value1 : fileNameFilter,
						value2 : ''
					} );
				}

				var paymentTypeFilter = objOfCreateNewFilter.down( 'combobox[itemId="paymentTypeFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( paymentTypeFilter ) && paymentTypeFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'paymentType',
						operator : 'eq',
						value1 : paymentTypeFilter,
						value2 : ''
					} );
				}

				var paymentPkgNameFilter = objOfCreateNewFilter.down(
					'AutoCompleter[itemId="paymentPkgNameFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( paymentPkgNameFilter ) )
				{
					jsonArray.push(
					{
						field : 'paymentPkgName',
						operator : 'eq',
						value1 : paymentPkgNameFilter,
						value2 : ''
					} );
				}

				var productCodeFilter = objOfCreateNewFilter.down( 'AutoCompleter[itemId="productCodeFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( productCodeFilter ) )
				{
					jsonArray.push(
					{
						field : 'productCode',
						operator : 'eq',
						value1 : productCodeFilter,
						value2 : ''
					} );
				}

				var batchAmountFilter = objOfCreateNewFilter.down( 'textfield[itemId="batchAmountFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( batchAmountFilter ) )
				{
					var amountOptFilter = objOfCreateNewFilter.down( 'combobox[itemId="amountOptFilterItemId"]' )
						.getValue();
					jsonArray.push(
					{
						field : 'batchAmount',
						operator : amountOptFilter,
						value1 : batchAmountFilter,
						value2 : ''
					} );
				}

				var totalTxnsFilter = objOfCreateNewFilter.down( 'textfield[itemId="totalTxnsFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( totalTxnsFilter ) )
				{
					jsonArray.push(
					{
						field : 'totalTxns',
						operator : 'eq',
						value1 : totalTxnsFilter,
						value2 : ''
					} );
				}

				var creationDateFilter = objOfCreateNewFilter.down( 'datefield[itemId="creationDateFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( creationDateFilter ) )
				{
					jsonArray.push(
					{
						field : 'creationDate',
						operator : 'eq',
						dataType : 1,
						value1 : Ext.Date.format( creationDateFilter, 'Y-m-d' ),
						value2 : ''
					} );
				}

				var effectiveDateFilter = objOfCreateNewFilter.down( 'datefield[itemId="effectiveDateFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( effectiveDateFilter ) )
				{
					jsonArray.push(
					{
						field : 'effectiveDate',
						operator : 'eq',
						dataType : 1,
						value1 : Ext.Date.format( effectiveDateFilter, 'Y-m-d' ),
						value2 : ''
					} );
				}

				var processDateFilter = objOfCreateNewFilter.down( 'datefield[itemId="processDateFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( processDateFilter ) )
				{
					jsonArray.push(
					{
						field : 'processDate',
						operator : 'eq',
						dataType : 1,
						value1 : Ext.Date.format( processDateFilter, 'Y-m-d' ),
						value2 : ''
					} );
				}

				var debitAccountFilter = objOfCreateNewFilter.down( 'AutoCompleter[itemId="debitAccountFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( debitAccountFilter ) )
				{
					jsonArray.push(
					{
						field : 'debitAccount',
						operator : 'eq',
						value1 : debitAccountFilter,
						value2 : ''
					} );
				}

				var debitAccountNameFilter = objOfCreateNewFilter.down(
					'textfield[itemId="debitAccountNameFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( debitAccountNameFilter ) )
				{
					jsonArray.push(
					{
						field : 'debitAccountName',
						operator : 'eq',
						value1 : debitAccountNameFilter,
						value2 : ''
					} );
				}

				var referenceFilter = objOfCreateNewFilter.down( 'textfield[itemId="referenceFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( referenceFilter ) )
				{
					jsonArray.push(
					{
						field : 'reference',
						operator : 'eq',
						value1 : referenceFilter,
						value2 : ''
					} );
				}

				var arrangementCodeFilter = objOfCreateNewFilter
					.down( 'combobox[itemId="arrangementCodeFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( arrangementCodeFilter ) && arrangementCodeFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'arrangementCode',
						operator : 'eq',
						value1 : arrangementCodeFilter,
						value2 : ''
					} );
				}

				var instCodeFilter = objOfCreateNewFilter.down( 'combobox[itemId="instCodeFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( instCodeFilter ) && instCodeFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'instCode',
						operator : 'eq',
						value1 : instCodeFilter,
						value2 : ''
					} );
				}

				var statusFilter = objOfCreateNewFilter.down( 'combobox[itemId="statusFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( statusFilter ) && statusFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'status',
						operator : 'eq',
						value1 : statusFilter,
						value2 : ''
					} );
				}

				var channelCodeFilter = objOfCreateNewFilter.down( 'combobox[itemId="channelCodeFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( channelCodeFilter ) && channelCodeFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'channelCode',
						operator : 'eq',
						value1 : channelCodeFilter,
						value2 : ''
					} );
				}

				var deliveryModeFilter = objOfCreateNewFilter.down( 'combobox[itemId="deliveryModeFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( deliveryModeFilter ) && deliveryModeFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'deliveryMode',
						operator : 'eq',
						value1 : deliveryModeFilter,
						value2 : ''
					} );
				}

				var makerIdFilter = objOfCreateNewFilter.down( 'AutoCompleter[itemId="makerIdFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( makerIdFilter ) )
				{
					jsonArray.push(
					{
						field : 'makerId',
						operator : 'eq',
						value1 : makerIdFilter,
						value2 : ''
					} );
				}

				objJson = jsonArray;
				return objJson;
			},

			resetAllFields : function( objCreateNewFilterPanel )
			{
				objCreateNewFilterPanel.down( 'label[itemId="errorLabel"]' ).setText( ' ' );
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).reset();
				objCreateNewFilterPanel.down( 'radiogroup[itemId="branchRadioFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="branchSeekFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="paymentTypeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="paymentPkgNameFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="productCodeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="amountOptFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="batchAmountFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="totalTxnsFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'datefield[itemId="creationDateFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'datefield[itemId="effectiveDateFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'datefield[itemId="processDateFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="debitAccountFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="debitAccountNameFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="referenceFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="arrangementCodeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="instCodeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="channelCodeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="deliveryModeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="makerIdFilterItemId"]' ).reset();
			},

			enableDisableFields : function( objCreateNewFilterPanel, boolVal )
			{
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setDisabled( boolVal );

				objCreateNewFilterPanel.down( 'radiogroup[itemId="branchRadioFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="branchSeekFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="paymentTypeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="paymentPkgNameFilterItemId"]' ).setDisabled(
					boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="productCodeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="amountOptFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="batchAmountFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="totalTxnsFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="creationDateFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="effectiveDateFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="processDateFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="debitAccountFilterItemId"]' )
					.setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="debitAccountNameFilterItemId"]' )
					.setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="referenceFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="arrangementCodeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="instCodeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="channelCodeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="deliveryModeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="makerIdFilterItemId"]' ).setDisabled( boolVal );
			},

			removeReadOnly : function( objCreateNewFilterPanel, boolVal )
			{
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setReadOnly( boolVal );

				objCreateNewFilterPanel.down( 'radiogroup[itemId="branchRadioFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="branchSeekFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="paymentTypeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="paymentPkgNameFilterItemId"]' ).setReadOnly(
					boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="productCodeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="amountOptFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="batchAmountFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="totalTxnsFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="creationDateFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="effectiveDateFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="processDateFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="debitAccountFilterItemId"]' )
					.setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="debitAccountNameFilterItemId"]' )
					.setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="referenceFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="arrangementCodeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="instCodeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="channelCodeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="deliveryModeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="makerIdFilterItemId"]' ).setReadOnly( boolVal );
			},

			showErrorMsg : function()
			{
				var me = this;
				var objErrorLabel = me.down( 'label[itemId="errorLabel"]' );
				objErrorLabel.setText( getLabel( 'filterCodeLength', 'The max length of Filter Name is 20' ) );
				objErrorLabel.show();
			}

		} );
