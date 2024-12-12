
Ext.override(Ext.form.field.Text, {
    setCaretPosition: function(pos) {
        var el = this.inputEl.dom;
        if (typeof(el.selectionStart) === "number") {
            el.focus();
            el.setSelectionRange(pos, pos);
        } else if (el.createTextRange) {
            var range = el.createTextRange();
            range.move("character", pos);
            range.select();
        } else {
            throw 'setCaretPosition() not supported';
        }
    },

    getCaretPosition: function() {
        var el = this.inputEl.dom;
        if (typeof(el.selectionStart) === "number") {
            return el.selectionStart;
        } else if (document.selection && el.createTextRange){
            var range = document.selection.createRange();
            range.collapse(true);
            range.moveStart("character", -el.value.length);
            return range.text.length;
        } else {
            throw 'getCaretPosition() not supported';
        }
    }
});


Ext.define('GCP.view.PaymentQueueCreateNewAdvFilter',{
			extend : 'Ext.panel.Panel',
			xtype : 'paymentQueueCreateNewAdvFilter',
			requires :
			[
				'Ext.ux.gcp.DateHandler', 'Ext.ux.gcp.AutoCompleter'
			],
			callerParent : null,
			width : 600,
			//width : 'auto',
			height : 'auto',
			layout :
			{
				type : 'vbox'
			},
			config : {
				sellerVal : null,
				queueType : null
			},
			initComponent : function()
			{
				var me = this;
				var fieldWidth = 220;
				var blankLineHeight = 1.5;
				var comboStoreAmountOptFilter = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data : arrAmountOptFilter
				} );
				var statusStore = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data : arrBatchStatusData[me.queueType],
					autoLoad : false,
					reloadBatchStatus : function(data, append)
					{
						var objStore = me.store;						
						result = objStore.proxy.reader.read(data), records = result.records;
						if( result.success )
						{
							objStore.currentPage = objStore.currentPage === 0 ? 1 : objStore.currentPage;
							objStore.totalCount = result.total;
							objStore.loadRecords( records, append ? objStore.addRecordsOptions : undefined );
							objStore.fireEvent( 'load', objStore, records, true );
						}
					}
				} );
				me.store=statusStore;
				var errorStore = Ext.create( 'Ext.data.Store',
						{
							fields :
							[
								'key', 'value'
							],
							data : errorStatusData
						} );
				var dateHandlerController = Ext.create( 'Ext.ux.gcp.DateHandler' );
				if( !Ext.isEmpty( dateHandlerController ) )
					this.dateHandler = dateHandlerController;
				var storeData = null;
				Ext.Ajax.request({
							url : 'services/userseek/sellerSeek.json',
							method : 'POST',
							async : false,
							success : function(response) {
								var data = Ext.decode(response.responseText);
								var sellerData = data.d.preferences;
								if (!Ext.isEmpty(data)) {
									storeData = sellerData;
								}
							},
							failure : function(response) {
								// console.log("Ajax Get data Call Failed");
							}

						});
				var objStore = Ext.create('Ext.data.Store', {
							fields : ['CODE', 'DESCRIPTION'],
							data : storeData,
							reader : {
								type : 'json',
								root : 'd.preferences'
							}
						});	
				
				
				Ext.Ajax.request({
							url : 'services/userseek/assignedClientCountries.json',
							method : 'POST',
							async : false,
							success : function(response) {
								var data = Ext.decode(response.responseText);
								var sellerData = data.d.preferences;
								if (!Ext.isEmpty(data)) {
									storeData = sellerData;
								}
							},
							failure : function(response) {
								// console.log("Ajax Get data Call Failed");
							}

						});
				var objClientCountriesStore = Ext.create('Ext.data.Store', {
							fields : ['COUNTRY_CODE', 'COUNTRY_DESC'],
							data : storeData,
							reader : {
								type : 'json',
								root : 'd.preferences'
							}
						});	
					

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
												fieldCls: 'w10_5',
												labelSeparator : '',
												labelCls: 'frmLabel',
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													'keypress' : function( text )
													{
														//if( text.value.length === 20 )
														//	me.showErrorMsg();
													}
												}
											}
										]
									},{
										xtype : 'container',
										flex : 1,
										layout : 'vbox',
										//hidden : '',
										itemId : 'crossCurrencyContainer',
										padding : '15 0 0 0',
										items : [{
											xtype : 'container',
											items : [{
												xtype : 'radiogroup',
												itemId : 'currencyRadioGroup',
												items : [{
															boxLabel : getLabel('all', 'All'),
															name : 'crossCurrency',
															inputValue : 'All',
															width : 60,
															checked : true
														}, {
															boxLabel : getLabel('crossCurrency',
																	'Cross Currency'),
															padding : '0 0 0 0',
															name : 'crossCurrency',
															width : 150,
															inputValue : 'Y'
														}]
											}]
										}]
									},
									{
										xtype : 'container',
										layout : 'vbox',
										hidden : '',
										width : fieldWidth,
										itemId : 'parentBatchRefIdContainer',	
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'textfield',
												itemId : 'parentBatchRefId',
												fieldLabel : getLabel('parentBatchReference', 'Parent Batch Tracking Id'),
												maxLength : 20,
												fieldCls: 'w10_5',
												labelCls: 'frmLabel',
												cls: 'w14',
												listeners :
												{
													'keypress' : function( text )
													{
														
													}
												}
											}
										]
									}
								]
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
												maxLength : 255,
												labelSeparator : '',
												fieldCls: 'w10_5',
												labelCls: 'frmLabel',
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													'keypress' : function( text )
													{
														//if( text.value.length === 20 )
														//	me.showErrorMsg();
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
												cls: 'w14',
												labelSeparator : '',
												store : paymentTypeList,
												labelCls: 'frmLabel',
												fieldCls : 'xn-form-field inline_block w9_2',
												triggerBaseCls : 'xn-form-trigger',
												padding : '0 8 0 0',
												value : paymentTypeList[0]
											}
										]
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										labelSeparator : '',
										labelCls: 'frmLabel',
										width: 150,
										fieldCls : 'xn-form-text xn-suggestion-box',	
										fieldLabel : getLabel( 'package', 'Package' ),
										name : 'paymentPkgName',
										itemId : 'paymentPkgNameFilterItemId',
										cfgUrl : 'services/userseek/BankProcessingQueuePackage.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'BankProcessingQueuePackage',
										cfgRootNode : 'd.preferences',
										cfgKeyNode : 'DESCR',
										cfgDataNode1 : 'DESCR',
										cfgDataNode2 : 'CODE',
										cfgExtraParams :
										[
											{
												key : '$filtercode1',
												value : me.sellerVal
											}
										]
									}
								]
							},
			
							// Batch Reference, CW batch # and Control Total Amnt
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
												itemId : 'referenceFilterItemId',
												fieldLabel : getLabel( 'batchRef', ' Batch Reference' ),
												maxLength : 20,
												fieldCls: 'w10_5',
												labelCls: 'frmLabel',
												labelSeparator : '',
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													'keypress' : function( text )
													{
														//if( text.value.length === 20 )
														//	me.showErrorMsg();
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
												itemId : 'pirNmbrFilterItemId',
												fieldLabel : getLabel( 'cwBatchRef', 'Customer Batch No.' ),
												maxLength : 20,
												fieldCls: 'w10_5',
												labelCls: 'frmLabel',
												labelSeparator : '',
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													'keypress' : function( text )
													{
														//if( text.value.length === 20 )
														//	me.showErrorMsg();
													}
												}
											}
										]
									},
									{xtype : 'container',
									layout : 'vbox',
									width : fieldWidth,
									defaults :
									{
										labelAlign : 'top'
									},
									items : [{
										xtype : 'label',
										layout : 'vbox',
										cls : 'x-form-cb-label x-form-item-label frmLabel',
										text : getLabel( 'control', 'Control Total Amount' )
									},
									{
										xtype : 'container',
										layout : 'hbox',
										width : fieldWidth,
										padding : '0 10 0 0',
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[{
												xtype : 'combobox',
												width : fieldWidth - 170,
												shrinkWrap : 1,
												displayField : 'value',
												labelSeparator : '',
												valueField : 'key',
												itemId : 'batchAmountOptFilterItemId',
												editable : false,
												store : comboStoreAmountOptFilter,
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												value : 'ge'
											},
											{
												xtype : 'numberfield',
												itemId : 'batchAmountFilterItemId',
												padding : '0 0 0 8',
												maxLength : 20,
												enforceMaxLength : true,
												fieldCls: 'w6_5',
												enableKeyEvents : true,
												allowDecimals : true,
												hideTrigger : true,
												decimalPrecision: strAmountMinFraction,
												//maskRe :/^[0-9]*(\d*\.\d*)[0-9]*$/, // /\d+(\.\d{1,2})?/,  // /^[0-9]*(\d*\.\d*)[0-9]*$/     // /^[0-9]*\.?[0-9]+$/, // /^[0-9]*\.?[0-9]+$/
												listeners :
												{
													keyup: function() {
										                var rv = (this.getRawValue() || '').toString(),
										                    dp = this.decimalPrecision,
										                    pos = this.getCaretPosition(),
										                    re;

										                // set a decimal precision if not already define
										                if (isNaN(dp) || dp < 0 || !(this.allowDecimals)) {
										                    dp = 0;
										                }

										                // only set the value if decimal points are allowed. otherwise
										                // let the compnent handle this as intended
										                if (dp > 0) {
										                    re = new RegExp('^\\d+((\\.)(\\d{0,' + dp + '}))?', 'g');
										                    this.setRawValue(rv.match(re));
										                    this.setCaretPosition(pos)
										                }
										            }
											
													
												}
											}
										]
									}]
								}]
							},
													
							// # of inst,Client,maker id,
							{
								xtype : 'container',
								layout : 'hbox',
								itemId : 'sellerClientContainer',
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
												xtype : 'combobox',
												displayField : 'CODE',
												valueField : 'CODE',
												fieldLabel : getLabel('lblfinancialinstitution', 'Financial Institution'),
												itemId : 'sellerFilterItemId',
												editable : false,
												cls: 'w14',
												labelSeparator : '',
												store : objStore,
												fieldCls : 'xn-form-field inline_block w9_2',
												triggerBaseCls : 'xn-form-trigger',
												labelCls: 'frmLabel',
												padding : '0 8 0 0',
												value : strSeller,
												listeners : {
													'change' : function(combo, strNewValue, strOldValue) {
														me.setSellerToClientAutoCompleterUrl();
													}

												}
											}
										]
									},
									{
										xtype : 'AutoCompleter',
										matchFieldWidth : true,
										cls : 'autoCmplete-field',					
										labelCls: 'frmLabel',
										fieldCls : 'xn-form-text xn-suggestion-box',	
										fieldLabel : getLabel( 'client', 'Client' ),
										labelSeparator : '',
										name : 'client',
										width: 150,
										margin : '0 70 0 0',
										itemId : 'clientNameFilterItemId',
										cfgUrl : 'services/userseek/BankProcessingQueueClient.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'clientSeek',
										cfgRootNode : 'd.preferences',
										cfgKeyNode : 'DESCR',
										cfgDataNode1 : 'DESCR',
										cfgExtraParams :
										[
											{
												key : '$filtercode1',
												value : me.sellerVal
											}
										]
									},
									{
										xtype : 'container',
										layout : 'vbox',
										//width : fieldWidth,
										//hidden : '',
										itemId : 'cashInContainer',	
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'textfield',
												itemId : 'cashInFilterItemId',
												fieldLabel : getLabel( 'cashInBatchNo', 'Bank Batch Number' ),
												maxLength : 20,
												fieldCls: 'w10_5',
												labelCls: 'frmLabel',
												cls: 'w14',
												listeners :
												{
													'keypress' : function( text )
													{
														//if( text.value.length === 20 )
														//	me.showErrorMsg();
													}
												}
											}
										]
									}
								]
							},
							// # of inst,Client,maker id,
							{
								xtype : 'container',
								layout : 'hbox',
								defaults :
								{
									labelAlign : 'top'
								},
								items :
								[
									{xtype : 'container',
									layout : 'vbox',
									width : fieldWidth,
									defaults :
									{
										labelAlign : 'top'
									},
									items :
									[
									{
										xtype : 'label',
										layout : 'vbox',
										cls : 'x-form-cb-label x-form-item-label frmLabel',
										text : getLabel( 'noOfInstruments', 'Number of Instruments' )
									},
									{
										xtype : 'container',
										layout : 'hbox',
										width : fieldWidth,
										margin : '0 0 0 0',
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[	{
												xtype : 'combobox',
												width : fieldWidth - 170,
												displayField : 'value',
												valueField : 'key',
												itemId : 'totalTxnsOptFilterItemId',
												labelSeparator : "",
												editable : false,
												store : comboStoreAmountOptFilter,
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												value : 'ge'
											},
											{
												xtype : 'textfield',
												itemId : 'totalTxnsFilterItemId',
												padding : '0 0 0 8',
												maxLength : 20,
												fieldCls : 'w6_5',
												enforceMaxLength : true,
												enableKeyEvents : true,
												maskRe :/^[0-9\s]/,
												listeners :
												{
													'keypress' : function( text )
													{
														//if( text.value.length === 20 )
														//	me.showErrorMsg();
													}
												}
											}
										]
									}]
									},
									{
										xtype : 'AutoCompleter',
										//width : fieldWidth,
										cls : 'autoCmplete-field',
										padding : '0 20 0 0',
										width: 150,
										fieldCls : 'xn-form-text xn-suggestion-box',	
										fieldLabel : getLabel( 'makerId', 'Maker Id' ),
										labelSeparator : '',
										name : 'makerId',
										labelCls: 'frmLabel',
										//padding : '10,0,0,0',
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
												value : me.sellerVal
											}
										]
									},
									{
										xtype : 'container',
										itemId : 'clientCountryContainerItemId',
										layout : 'vbox',
										padding : '0 0 0 50',
										//width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'combobox',
												//width : fieldWidth - 180,
												fieldLabel : getLabel( 'clientCountry', 'Client Country' ),
												displayField : 'COUNTRY_DESC',
												valueField : 'COUNTRY_CODE',
												itemId : 'clientCountryFilterItemId',
												//padding : '0,0,0,20',
												editable : false,
												cls: 'w14',
												labelCls: 'frmLabel',
												labelSeparator : '',
												store : objClientCountriesStore,
												fieldCls : 'xn-form-field inline_block w9_2',
												triggerBaseCls : 'xn-form-trigger'
											}
										]
									},
									{
										xtype : 'container',
										itemId : 'errorClassificationContainerItemId',
										layout : 'hbox',
										width : fieldWidth,
										hidden : (!Ext.isEmpty(ecEnable) && ecEnable == 'N')? true : false,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'combobox',
												fieldLabel : getLabel( 'errorClassification', 'Error Classification' ),
												displayField : 'value',
												valueField : 'key',
												padding : '0 0 0 50',
												cls: 'w14',
												labelSeparator : '',
												itemId : 'errorClassificationFilterItemId',
												editable : false,
												store : errorStore,
												fieldCls : 'xn-form-field inline_block w9_2',
												labelCls: 'frmLabel',
												triggerBaseCls : 'xn-form-trigger',
												value : 'All'
											}
										]
									}
								]
							},
							// Creation date From,Creation Date To,channel
							{
								xtype : 'container',
								layout : 'hbox',
								defaults :
								{
									labelAlign : 'top'
								},
								items :
								[
									/*{
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
												itemId : 'creationDateFrmFilterItemId',
												format : strExtApplicationDateFormat,
												editable : false,
												value : dtApplicationDate,
												labelSeparator : '',
												fieldLabel : getLabel( 'creationDateFrom', 'Creation Date From' ),
												//labelStyle : 'padding-left:10px',
												fieldCls : 'xn-valign-middle xn-form-text w10_5',
												allowBlank : true,
												labelCls: 'frmLabel',
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
												name : 'receivedOn',
												itemId : 'creationDateToFilterItemId',
												format : strExtApplicationDateFormat,
												editable : false,
												value : dtApplicationDate,
												fieldLabel : getLabel( 'creationDateTo', 'Creation Date To' ),
												//labelStyle : 'padding-left:10px',
												labelCls: 'frmLabel',
												fieldCls : 'xn-valign-middle xn-form-text w10_5',
												allowBlank : true,
												hideTrigger : true,
												labelSeparator : ''
											}
										]
									},*/
									me.createDateFilterPanel(),
									{
                                        xtype : 'AutoCompleter',
                                        //width : fieldWidth,
                                        cls : 'autoCmplete-field',
                                        padding : '0 20 0 0',
                                        width: 150,
										margin : '0 70 0 0',
                                        fieldCls : 'xn-form-text xn-suggestion-box',    
                                        fieldLabel : getLabel( 'entryBranch', 'Entry Branch' ),
                                        labelSeparator : '',
                                        name : 'branchCode',
                                        labelCls: 'frmLabel',
                                        //padding : '10,0,0,0',
                                        itemId : 'branchCodeFilterItemId',
                                        cfgUrl : 'services/userseek/userBranchSeek.json',
                                        cfgQueryParamName : '$autofilter',
                                        cfgRecordCount : -1,
                                        cfgSeekId : 'userBranchSeek',
                                        cfgRootNode : 'd.preferences',
                                        cfgKeyNode : 'CODE',
                                        cfgDataNode1 : 'DESCRIPTION',
                                        cfgDataNode2 : 'CODE',
                                        cfgExtraParams :
                                        [
                                            {
                                                key : '$filtercode1',
                                                value : me.sellerVal
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
												fieldLabel : getLabel( 'channel', 'Channel' ),
												displayField : 'value',
												valueField : 'key',
												itemId : 'channelCodeFilterItemId',
												editable : false,
												cls: 'w14',
												labelSeparator : '',
												store : channelCodeList,
												fieldCls : 'xn-form-field inline_block w9_2',
												triggerBaseCls : 'xn-form-trigger',
												labelCls: 'frmLabel',
												value : channelCodeList[0]
											}
										]
									}
								]
							},
							
							//processing date from,processing date to,Eff Date From
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
												name : 'processDate',
												itemId : 'processDateFrmFilterItemId',
												format : strExtApplicationDateFormat,
												editable : false,
												fieldLabel : getLabel( 'processDateFrm', 'Processing Date From' ),
												//labelStyle : 'padding-left:10px',
												fieldCls : 'xn-valign-middle xn-form-text w10_5',
												labelCls: 'frmLabel',
												labelSeparator : '',
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
												itemId : 'processDateToFilterItemId',
												format : strExtApplicationDateFormat,
												editable : false,
												fieldLabel : getLabel( 'processDateTo', 'Processing Date To' ),
												//labelStyle : 'padding-left:10px',
												fieldCls : 'xn-valign-middle xn-form-text w10_5',
												labelCls: 'frmLabel',
												labelSeparator : '',
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
												xtype : 'AutoCompleter',
												cls : 'autoCmplete-field',
												fieldCls : 'xn-form-text xn-suggestion-box',	
												labelCls: 'frmLabel',
												width: 150,
												fieldLabel : getLabel( 'dispatchBank', 'Dispatch Bank' ),
												name : 'dispatchBank',
												labelSeparator : '',
												itemId : 'dispatchBankFilterItemId',
												cfgUrl : 'services/userseek/dispathBankMasterSeek.json',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'dispathBankMasterSeek',
												cfgRootNode : 'd.preferences',
												cfgKeyNode : 'CODE',
												cfgDataNode1 : 'DESCR',
												cfgDataNode2 : 'CODE',
												cfgExtraParams :
												[
													{
														key : '$filtercode1',
														value : me.sellerVal
													}
												]
											}
										]
									}
								]
							},
							
							// Eff Date To,Product,Sender A/c
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
										//width : fieldWidth,
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text xn-suggestion-box',	
										labelCls: 'frmLabel',
										width: 150,
										fieldLabel : getLabel( 'product', 'Product' ),
										name : 'productCode',
										margin : '0 70 0 0',
										labelSeparator : '',
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
												value : me.sellerVal
											}
										]
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text xn-suggestion-box',	
										labelCls: 'frmLabel',
										width: 150,
										fieldLabel : getLabel( 'sendingAccount', 'Sending Account' ),
										name : 'debitAccount',
										labelSeparator : '',
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
												value : me.sellerVal
											}
										]
									},
									{
										xtype : 'container',
										itemId : 'utrNmbrContainerItemId',
										layout : 'vbox',
										padding : '0 0 0 70',
										//width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
													xtype : 'AutoCompleter',
											matchFieldWidth : true,
											cls : 'autoCmplete-field',					
											labelCls: 'frmLabel',
											fieldCls : 'xn-form-text xn-suggestion-box',	
											fieldLabel : getLabel( 'utrNmbr', 'UTR No / RRN No.' ),
											labelSeparator : '',
											name : 'utrNmbr',
											width: 150,
											margin : '0 70 0 0',
											itemId : 'utrNmbrFilterItemId',
											cfgUrl : 'services/userseek/BankProcessingQueueUtrNmbr.json',
											cfgQueryParamName : '$autofilter',
											cfgRecordCount : -1,
											cfgSeekId : 'BankProcessingQueueUtrNmbr',
											cfgRootNode : 'd.preferences',
											cfgKeyNode : 'CODE',
											cfgDataNode1 : 'DESCR',
											cfgDataNode2 : 'CODE',
											cfgExtraParams :
											[
												{
													key : '$filtercode1',
													value : me.sellerVal
												}
											]
											}
										]
									}
								]
							},
							
							// Receiver Name,Contract Ref
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
												itemId : 'receiverNameFilterItemId',
												fieldLabel : getLabel( 'receiverName', 'Receiver Name' ),
												maxLength : 40,
												fieldCls: 'w10_5',
												labelCls: 'frmLabel',
												labelSeparator : '',
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													'keypress' : function( text )
													{
														//if( text.value.length === 40 )
														//	me.showErrorMsg();
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
												itemId : 'dealrefFilterItemId',
												fieldLabel : getLabel( 'contractRef', 'Contract Ref' ),
												maxLength : 40,
												fieldCls: 'w10_5',
												labelCls: 'frmLabel',
												labelSeparator : '',
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													'keypress' : function( text )
													{
														//if( text.value.length === 40 )
														//	me.showErrorMsg();
													}
												}
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
												fieldLabel : getLabel( 'batchStatus', 'Batch Status' ),
												displayField : 'value',
												valueField : 'key',
												cls: 'w14',
												labelSeparator : '',
												itemId : 'statusFilterItemId',
												editable : false,
												store : statusStore,
												fieldCls : 'xn-form-field inline_block w9_2',
												labelCls: 'frmLabel',
												triggerBaseCls : 'xn-form-trigger',
												value : 'All'
											}
										]
									}
								]
							},
							// Inst. Amount, Dispatch Bank
							{
								xtype : 'container',
								layout : 'hbox',
								padding : '0 0 15 0',
								defaults :
								{
									labelAlign : 'top'
								},
								items :
								[
									{xtype : 'container',
									layout : 'vbox',
									width : fieldWidth,
									defaults :
									{
										labelAlign : 'top'
									},
									margin : '0 0 0 0',
									items :[
									{
										xtype : 'label',
										layout : 'vbox',
										cls : 'x-form-cb-label x-form-item-label frmLabel',
										text : getLabel( 'txnAmt', 'Transaction Amount' )
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
												width : fieldWidth - 170,
												displayField : 'value',
												valueField : 'key',
												labelSeparator : '',
												itemId : 'instAmountOptFilterItemId',
												editable : false,
												store : comboStoreAmountOptFilter,
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												value : 'ge'
											},
											{
												xtype : 'textfield',
												itemId : 'instAmountFilterItemId',
												padding : '0 0 0 8',
												maxLength : 20,
												enforceMaxLength : true,
												fieldCls: 'w6_5',
												enableKeyEvents : true,
												maskRe :/^[0-9\s]/,
												listeners :
												{
													'keypress' : function( text )
													{
														//if( text.value.length === 20 )
														//	me.showErrorMsg();
													}
												}
											}
										]
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
												itemId : 'effectiveDateFrmFilterItemId',
												format : strExtApplicationDateFormat,
												editable : false,
												fieldLabel : getLabel( 'effectiveDateFrm', 'Effective Date From' ),
												fieldCls : 'xn-valign-middle xn-form-text w10_5',
												labelCls: 'frmLabel',
												cls: 'w14',
												labelSeparator : '',
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
												itemId : 'effectiveDateToFilterItemId',
												format : strExtApplicationDateFormat,
												editable : false,
												fieldLabel : getLabel( 'effectiveDateTo', 'Effective Date To' ),
												fieldCls : 'xn-valign-middle xn-form-text w10_5',
												labelCls: 'frmLabel',
												allowBlank : true,
												hideTrigger : true,
												labelSeparator : ''
											}
										]
									}									
								]
							}
						]
					}
				];

				this.dockedItems =
				[{
					xtype : 'container',
					height : 10,
					dock : 'top',
					items : [{
								xtype : 'label',
								cls : 'red errmsg',
								itemId : 'errorLabel',
								hidden : true
							}]
				}, {
					xtype : 'toolbar',
					padding : '0 0 10 0',
					dock : 'bottom',
					items : ['->', {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_search-button',
						text : getLabel('search', 'Search'),
						glyph : 'xf002@fontawesome',
						itemId : 'searchBtn',
						handler : function(btn)
						{
							me.fireEvent('handleSearchAction', btn);
						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						glyph : 'xf00e@fontawesome',
						text : getLabel('btnSaveAndSearch', 'Save and Search'),
						itemId : 'saveAndSearchBtn',
						handler : function(btn)
						{
							me.fireEvent('handleSaveAndSearchAction', btn);
						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						text : getLabel('btnCancel', 'Cancel'),
						itemId : 'cancelBtn',
						handler : function(btn)
						{
							me.fireEvent('closeFilterPopup', btn);
						}
					},'->']
				}];
				this.callParent( arguments );
			},

			getAdvancedFilterValueJson : function( filterCodeVal, objOfCreateNewFilter )
			{
				var objJson = null;
				var jsonArray = [];

				var fileNameFilter = objOfCreateNewFilter.down( 'textfield[itemId="fileNameFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( fileNameFilter ) )
				{
					jsonArray.push(
					{
						field : 'fileName',
						operator : 'lk',
						value1 : fileNameFilter,
						value2 : ''
					} );
				}
				
				// Currency
				var currencyValue = objOfCreateNewFilter
						.down('radiogroup[itemId="currencyRadioGroup"]').getValue().crossCurrency;
				if (!Ext.isEmpty(currencyValue) && currencyValue!== 'All') {
					jsonArray.push({
								field : 'crossCurrency',
								operator : 'eq',
								value1 : currencyValue,
								value2 : '',
								dataType : 0,
								displayType : 4
							});
				}
				
				// Payment Type
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
				// Package Name
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
				// Reference
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
				// pirNumber
				var batchCWBatchRef = objOfCreateNewFilter.down( 'textfield[itemId="pirNmbrFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( batchCWBatchRef ) )
				{
					jsonArray.push(
					{
						field : 'pirNmbr',
						operator : 'eq',
						value1 : batchCWBatchRef,
						value2 : ''
					} );
				}
				// Batch Amount
				var batchAmountFilter = objOfCreateNewFilter.down( 'numberfield[itemId="batchAmountFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( batchAmountFilter ) )
				{
					var amountOptFilter = objOfCreateNewFilter.down( 'combobox[itemId="batchAmountOptFilterItemId"]' )
						.getValue();
					jsonArray.push(
					{
						field : 'batchAmount',
						operator : amountOptFilter,
						value1 : batchAmountFilter,
						value2 : ''
					} );
				}
				// Instance Amount
				var instAmountFilter = objOfCreateNewFilter.down( 'textfield[itemId="instAmountFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( instAmountFilter ) )
				{
					var amountOptFilter = objOfCreateNewFilter.down( 'combobox[itemId="instAmountOptFilterItemId"]' ).getValue();
					jsonArray.push(
					{
						field : 'instAmount',
						operator : amountOptFilter,
						value1 : instAmountFilter,
						value2 : ''
					} );
				}
				// Total Taxation
				var totalTxnsFilter = objOfCreateNewFilter.down( 'textfield[itemId="totalTxnsFilterItemId"]' )
					.getValue();	
				if( !Ext.isEmpty( totalTxnsFilter ) )
				{
					var instOptFilter = objOfCreateNewFilter.down( 'combobox[itemId="totalTxnsOptFilterItemId"]' )
						.getValue();
					jsonArray.push(
					{
						field : 'totalTxns',
						operator : instOptFilter,
						value1 : totalTxnsFilter,
						value2 : ''
					} );
				}
				// Client Name
				var clientNameFilterItemId = objOfCreateNewFilter.down( 'AutoCompleter[itemId="clientNameFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( clientNameFilterItemId ) )
				{
					jsonArray.push(
					{
						field : 'clientName',
						operator : 'lk',
						value1 : clientNameFilterItemId,
						value2 : ''
					} );
				}
				
				var utrNmbrFilterItemId = objOfCreateNewFilter.down( 'AutoCompleter[itemId="utrNmbrFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( utrNmbrFilterItemId ) )
				{
					jsonArray.push(
					{
						field : 'utrNmbr',
						operator : 'lk',
						value1 : utrNmbrFilterItemId,
						value2 : ''
					} );
				}
				
				// Seller
				var sellerFilterItemId = objOfCreateNewFilter.down( 'combobox[itemId="sellerFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( sellerFilterItemId ) )
				{
					jsonArray.push(
					{
						field : 'seller',
						operator : 'eq',
						value1 : sellerFilterItemId,
						value2 : ''
					} );
				}
				// Maker id
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
				// Client Country
				var clientCountry = objOfCreateNewFilter.down('combobox[itemId="clientCountryFilterItemId"]').getValue();
				if (!Ext.isEmpty(clientCountry)){
					jsonArray.push(
						{
							field : 'clientCountry',
							operator : 'eq',
							value1 : clientCountry,
							value2 : ''
						}
					);
				}				

				// Creation Date 
				var creationDateFrmFilter = objOfCreateNewFilter.down( 'datefield[itemId="creationDateFrmFilterItemId"]' )
					.getValue();
				creationdate1 = creationDateFrmFilter;
				var creationDateToFilter = objOfCreateNewFilter.down( 'datefield[itemId="creationDateToFilterItemId"]' )
					 .getValue();
				creationdate2 = creationDateToFilter;
				
				if( !Ext.isEmpty( creationDateFrmFilter ) && !Ext.isEmpty( creationDateToFilter ))
				{
					jsonArray.push(
					{
						field : 'creationDate',
						operator : 'bt',
						dataType : 1,
						value1 : Ext.Date.format( creationDateFrmFilter, 'Y-m-d' ),
						value2 : Ext.Date.format( creationDateToFilter, 'Y-m-d' ),
						dropdownLabel : selectedEntryDate.dateLabel,
						dateIndex : selectedEntryDate.dateIndex					
					} );
				}
				
				// Entry Branch
				var branchCodeFilter = objOfCreateNewFilter.down( 'AutoCompleter[itemId="branchCodeFilterItemId"]')
					.getValue();
				if( !Ext.isEmpty( branchCodeFilter ))
				{
					jsonArray.push(
					{
						field : 'branchCode',
						operator : 'eq',
						value1 : branchCodeFilter,
						value2 : ''
					} );
				}
				var channelCodeFilter = objOfCreateNewFilter.down( 'combobox[itemId="channelCodeFilterItemId"]')
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
				
				var creationDateFrmFilter = objOfCreateNewFilter.down( 'datefield[itemId="processDateFrmFilterItemId"]' )
					.getValue();
				var processDateToFilter = objOfCreateNewFilter.down( 'datefield[itemId="processDateToFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( creationDateFrmFilter ) && !Ext.isEmpty( processDateToFilter ))
				{
					jsonArray.push(
					{
						field : 'processDate',
						operator : 'bt',
						dataType : 1,
						value1 : Ext.Date.format( creationDateFrmFilter, 'Y-m-d' ),
						value2 : Ext.Date.format( processDateToFilter, 'Y-m-d' )
					} );
				}
				
				var effectiveDateFrmFilter = objOfCreateNewFilter.down( 'datefield[itemId="effectiveDateFrmFilterItemId"]' )
					.getValue();
				var effectiveDateToFilter = objOfCreateNewFilter.down( 'datefield[itemId="effectiveDateToFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( effectiveDateFrmFilter ) && !Ext.isEmpty( effectiveDateToFilter ))
				{
					jsonArray.push(
					{
						field : 'effectiveDate',
						operator : 'bt',
						dataType : 1,
						value1 : Ext.Date.format( effectiveDateFrmFilter, 'Y-m-d' ),
						value2 : Ext.Date.format( effectiveDateToFilter, 'Y-m-d' )
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

				var receiverNameFilter = objOfCreateNewFilter.down(
					'textfield[itemId="receiverNameFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( receiverNameFilter ) )
				{
					jsonArray.push(
					{
						field : 'receiverName',
						operator : 'eq',
						value1 : receiverNameFilter,
						value2 : ''
					} );
				}

				var contractRefFilter = objOfCreateNewFilter.down(
					'textfield[itemId="dealrefFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( contractRefFilter ) )
				{
					jsonArray.push(
					{
						field : 'dealref',
						operator : 'eq',
						value1 : contractRefFilter,
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
				
				//Dispatch Bank
				var dispatchBank = objOfCreateNewFilter.down( 'AutoCompleter[itemId="dispatchBankFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( dispatchBank ))
				{
					jsonArray.push(
					{
						field : 'dispatchBank',
						operator : 'eq',
						value1 : dispatchBank,
						value2 : ''
					} );
				}
				
				// Cashin Batch Number
				var cashIn = objOfCreateNewFilter.down( 'textfield[itemId="cashInFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( cashIn ))
				{
					jsonArray.push(
					{
						field : 'pirNmbr',
						operator : 'eq',
						value1 : cashIn,
						value2 : ''
					} );
				}

				//Error Classification
				var errorClassificationFilter = objOfCreateNewFilter.down( 'combobox[itemId="errorClassificationFilterItemId"]' )
				.getValue();
				if( !Ext.isEmpty( errorClassificationFilter ) && errorClassificationFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'errorClassification',
						operator : 'eq',
						value1 : errorClassificationFilter,
						value2 : ''
					} );
				}
				
				// parent batch ref Number
				var parentBatchRefId = objOfCreateNewFilter.down( 'textfield[itemId="parentBatchRefId"]' )
					.getValue();
				if( !Ext.isEmpty( parentBatchRefId ) )
				{
					jsonArray.push(
					{
						field : 'parentBatchRefNumber',
						operator : 'eq',
						value1 : parentBatchRefId,
						value2 : ''
					} );
				}
				//Need parameter Names
				/*var instAmount = objOfCreateNewFilter.down( 'textfield[itemId="instAmountFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( instAmount ))
				{
					jsonArray.push(
					{
						field : 'instAmount',
						operator : 'eq',
						value1 : instAmount,
						value2 : ''
					} );
				}*/

				//var filterCode = '';
				objJson = {};
				objJson.filterBy = jsonArray;
				if( filterCodeVal && !Ext.isEmpty( filterCodeVal ) )
					objJson.filterCode = filterCodeVal;
				return objJson;
			},
			resetAllFields : function( objCreateNewFilterPanel )
			{
				objCreateNewFilterPanel.down( 'label[itemId="errorLabel"]' ).setText( ' ' );
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).reset();
				objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setDisabled(false);
				objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="paymentTypeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="paymentTypeFilterItemId"]' ).setValue('All');
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="paymentPkgNameFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="productCodeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="batchAmountOptFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="instAmountOptFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="totalTxnsOptFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'numberfield[itemId="batchAmountFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="instAmountFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="totalTxnsFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="pirNmbrFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="parentBatchRefId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="sellerFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="clientNameFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'datefield[itemId="creationDateFrmFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'datefield[itemId="creationDateToFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'datefield[itemId="effectiveDateFrmFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'datefield[itemId="effectiveDateToFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'datefield[itemId="processDateFrmFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'datefield[itemId="processDateToFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="debitAccountFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="utrNmbrFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="receiverNameFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="dealrefFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="referenceFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="channelCodeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="channelCodeFilterItemId"]' ).setValue('All');
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="makerIdFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="branchCodeFilterItemId"]' ).reset();				
				objCreateNewFilterPanel.down( 'textfield[itemId="instAmountFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="dispatchBankFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="cashInFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'radiogroup[itemId="currencyRadioGroup"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="clientCountryFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="errorClassificationFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="errorClassificationFilterItemId"]' ).setValue('All');
			},

			enableDisableFields : function( objCreateNewFilterPanel, boolVal )
			{
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="paymentTypeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="paymentPkgNameFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="productCodeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="batchAmountOptFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="instAmountOptFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="totalTxnsOptFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'numberfield[itemId="batchAmountFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="instAmountFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="totalTxnsFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="pirNmbrFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="parentBatchRefId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="sellerFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="clientNameFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="creationDateFrmFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="creationDateToFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="effectiveDateFrmFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="effectiveDateToFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="processDateFrmFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="processDateToFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="debitAccountFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="utrNmbrFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="receiverNameFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="dealrefFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="referenceFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="channelCodeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="makerIdFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="branchCodeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="instAmountFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="dispatchBankFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="cashInFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'radiogroup[itemId="currencyRadioGroup"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="clientCountryFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="errorClassificationFilterItemId"]' ).setDisabled( boolVal );
			},

			removeReadOnly : function( objCreateNewFilterPanel, boolVal )
			{
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="paymentTypeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="paymentPkgNameFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="productCodeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="batchAmountOptFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="instAmountOptFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="totalTxnsOptFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'numberfield[itemId="batchAmountFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="instAmountFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="totalTxnsFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="pirNmbrFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="parentBatchRefId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="sellerFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="clientNameFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="creationDateFrmFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="creationDateToFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="effectiveDateFrmFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="effectiveDateToFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="processDateFrmFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="processDateToFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="debitAccountFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="utrNmbrFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="receiverNameFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="dealrefFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="referenceFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="instAmountFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="dispatchBankFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="channelCodeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="branchCodeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="makerIdFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="cashInFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'radiogroup[itemId="currencyRadioGroup"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="clientCountryFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="errorClassificationFilterItemId"]' ).setReadOnly( boolVal );
			},

			showErrorMsg : function()
			{
				var me = this;
				var objErrorLabel = me.down( 'label[itemId="errorLabel"]' );
				objErrorLabel.setText( getLabel( 'filterCodeLength', 'The max length of Filter Name is 20' ) );
				objErrorLabel.show();
			},
			
			setSellerToClientAutoCompleterUrl : function() {
				var me = this;
				var sellerCombo = me.down('combobox[itemId="sellerFilterItemId"]');
				var seller = sellerCombo.getValue();
				var clientautoComplter = me
						.down('combobox[itemId="clientNameFilterItemId"]');
				clientautoComplter.reset();
				clientautoComplter.cfgExtraParams = [{
							key : '$filtercode1',
							value : seller
						}];
			},
			hideShowFields : function(objCreateNewFilterPanel, queueType){
				if(queueType === 'R' || queueType === 'W' || queueType === 'V' || queueType === 'L') {
					objCreateNewFilterPanel.down('container[itemId="crossCurrencyContainer"]').hide();
					objCreateNewFilterPanel.down('container[itemId="cashInContainer"]').hide();
					objCreateNewFilterPanel.down('container[itemId="clientCountryContainerItemId"]').show();
				}
				if(queueType != 'W'){
					//objCreateNewFilterPanel.down('combobox[itemId="clientCountryFilterItemId"]').hide();
					objCreateNewFilterPanel.down('container[itemId="clientCountryContainerItemId"]').hide();
				}
				if(queueType === 'Q'){
					objCreateNewFilterPanel.down('container[itemId="clientCountryContainerItemId"]').show();
				}
				if(strAllowUtrNo === 'Y')
				{
					if(queueType === 'L')
						objCreateNewFilterPanel.down('container[itemId="utrNmbrContainerItemId"]').show();
					else
						objCreateNewFilterPanel.down('container[itemId="utrNmbrContainerItemId"]').hide();
					
				}
				if(queueType === 'C')
				{
					objCreateNewFilterPanel.down('container[itemId="cashInContainer"]').show();
				}
				objCreateNewFilterPanel.down('container[itemId="errorClassificationContainerItemId"]').hide();
				objCreateNewFilterPanel.down('container[itemId="parentBatchRefIdContainer"]').hide();
				if(queueType === 'CW' && verifyEnable == 'Y')
				{
					objCreateNewFilterPanel.down('container[itemId="parentBatchRefIdContainer"]').show();
				}
				if(ecEnable == 'Y' && queueType === 'D')
				{
					objCreateNewFilterPanel.down('container[itemId="errorClassificationContainerItemId"]').show();
				}
			
			},
			createDateFilterPanel : function() {
				var me = this;
				var dateMenuPanel = Ext.create('Ext.container.Container', {					
					padding : '5px 0 0 0px',
					layout : 'vbox',
					width : 220,
					items : [
					{
						xtype : 'container',						
						layout : 'hbox',
						items : [
							{
							xtype : 'label',
							itemId : 'dateLabel',
							text : getLabel('creationDate', 'Creation Date'),
							padding : '0 0 0 0px',
							cls : 'frmLabel'
								// padding : '6 0 0 5'
							}, {
							xtype : 'button',
							border : 0,
							filterParamName : 'EntryDate',
							itemId : 'entryDate',
							// cls : 'xn-custom-arrow-button cursor_pointer w1',
							cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
							glyph : 'xf0d7@fontawesome',
							//padding : '6 0 0 3',
							menu : me.createDateFilterMenu()				
						    }]
					},
					me.addDateContainerPanel()
					]
				});
				return dateMenuPanel;
			},
		    addDateContainerPanel : function() {
					var me = this;
					var dateContainerPanel = Ext.create('Ext.container.Container', {
					layout : 'hbox',
					padding : '0 0 0 0',
					items : [{
						xtype : 'container',
						itemId : 'dateRangeComponent',
						layout : 'hbox',
						hidden : true,
						items : [{
							xtype : 'datefield',
							itemId : 'creationDateFrmFilterItemId',  
							hideTrigger : true,
							width : 80,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							editable : false,
							parent : me,
							vtype : 'daterange',
							endDateField : 'creationDateToFilterItemId',
							format : !Ext.isEmpty(strExtApplicationDateFormat)
									? strExtApplicationDateFormat
									: 'm/d/Y',							
							listeners : {
								'change' : function(field, newValue, oldValue) {
									if (!Ext.isEmpty(newValue)) {
										Ext.form.field.VTypes.daterange(
												newValue, field);
									}
								}
							}
						}, {
							xtype : 'datefield',
							itemId : 'creationDateToFilterItemId',
							hideTrigger : true,
							padding : '0 3 0 0',
							editable : false,
							width : 80,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							parent : me,
							vtype : 'daterange',
							startDateField : 'creationDateFrmFilterItemId',
							format : !Ext.isEmpty(strExtApplicationDateFormat)
									? strExtApplicationDateFormat
									: 'm/d/Y',
							listeners : {
								'change' : function(field, newValue, oldValue) {
									if (!Ext.isEmpty(newValue)) {
										Ext.form.field.VTypes.daterange(
												newValue, field);
									}
								}
							}
						}]
					}, {
						xtype : 'container',
						itemId : 'dateToolBar',						
						items : [{
									xtype : 'label',
									itemId : 'dateFilterFrom',
									width : 80
								}, {
									xtype : 'label',
									itemId : 'dateFilterTo',
									width : 80
								}]
					}]
				});
			return dateContainerPanel;
		    },
	
	        createDateFilterMenu : function() {
			var me = this;
			var menu = null;
						
			var arrMenuItem = [
				];
		
			arrMenuItem.push({
					text : getLabel('latest', 'Latest'),
					btnId : 'btnLatest',
					parent : this,
					btnValue : '12',
					handler : function(btn, opts) {
						$(document).trigger("dateChange",[btn,opts]);						
					}
				});

		
			arrMenuItem.push({
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("dateChange",[btn,opts]);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("dateChange",[btn,opts]);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("dateChange",[btn,opts]);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : this,
						btnValue : '4',
						handler : function(btn, opts) {
							$(document).trigger("dateChange",[btn,opts]);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : this,
						btnValue : '5',
						handler : function(btn, opts) {
							$(document).trigger("dateChange",[btn,opts]);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("dateChange",[btn,opts]);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("dateChange",[btn,opts]);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("dateChange",[btn,opts]);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("dateChange",[btn,opts]);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						parent : this,
						btnValue : '11',
						handler : function(btn, opts) {
							$(document).trigger("dateChange",[btn,opts]);
						}
					});
		arrMenuItem.push({
					text : getLabel('daterange', 'Date Range'),
					btnId : 'btnDateRange',
					parent : this,
					btnValue : '7',
					handler : function(btn, opts) {		
						var field = me.down('datefield[itemId="fromDate"]');	
						if (field)
							field.setValue('');
						field = me.down('datefield[itemId="toDate"]');
						if (field)
							field.setValue('');
						$(document).trigger("dateChange",[btn,opts]);

					}
				});

		menu = Ext.create('Ext.menu.Menu', {
					items : arrMenuItem
				});
		return menu;
	},
	
	reloadBatchStatus : function(data,append)
	{
		var me = this;
		var objStore = me.store;						
		result = objStore.proxy.reader.read(data), records = result.records;
		if( result.success )
		{
			objStore.currentPage = objStore.currentPage === 0 ? 1 : objStore.currentPage;
			objStore.totalCount = result.total;
			objStore.loadRecords( records, append ? objStore.addRecordsOptions : undefined );
			objStore.fireEvent( 'load', objStore, records, true );
		}
	},
	selectDebitBatchStatus : function(objCreateNewFilterPanel, queueType)
	{
		var me = this;
		var batchCombo =objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]');
		var isPresent = false;
		var objStore = me.store;
		if (!Ext.isEmpty(debitBatchStatus) && debitBatchStatus !='All')
		{
			var arrBatchStatusDataQueue=arrBatchStatusData[queueType];
			for(var i=0;i<arrBatchStatusDataQueue.length;i++)
			{
				var key=arrBatchStatusDataQueue[i].key;
				if(key == debitBatchStatus){
					batchCombo.select(key);
					isPresent = true;
				}
			}
		}	
		if(!isPresent)
			batchCombo.select(objStore.getAt(0));
	}
	} );
