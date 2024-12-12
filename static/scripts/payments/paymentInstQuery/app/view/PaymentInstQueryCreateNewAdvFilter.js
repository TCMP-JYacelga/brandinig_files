
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


Ext.define('GCP.view.PaymentInstQueryCreateNewAdvFilter',{
			extend : 'Ext.panel.Panel',
			xtype : 'paymentInstQueryCreateNewAdvFilter',
			requires :
			[
				'Ext.ux.gcp.DateHandler', 'Ext.ux.gcp.AutoCompleter'
			],
			callerParent : null,
			width : 1020,
			layout :
			{
				type : 'vbox'
			},
			config : {
				sellerVal : null,
				clientVal : null,
				queueType : null,
				selectedEntryDate : {}
			},
			initComponent : function()
			{
				var me = this;
				var fieldWidth = 220;
				var maxFieldWidth = 192;
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
					data : arrInstStatusData[me.queueType]
				} );
				var requestTypeStore = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data : arrRequestTypeData[me.queueType]
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
 				[ {
							xtype : 'container',
							layout : 'vbox',
							cls : 'filter-container-cls',
                            width : '95%',
							padding : '5,0,0,0',
							itemId : 'parentContainer',
							defaults : {
								margin : '5 0 0 3'
							},
							items : [
									{

										xtype : 'container',
										layout : 'hbox',
										width : '90%',
										defaults : {
											labelAlign : 'top'
										},
										items : [
												{
													xtype : 'container',
													width : fieldWidth,
													layout : 'vbox',
													defaults : {
														labelAlign : 'top'
													},
													items : [
															{
																xtype : 'label',
																cls : 'red',
																itemId : 'errorLabel',
																height : 20,
																hidden : true
															},
															{
																xtype : 'textfield',
																itemId : 'filterCode',
																width : maxFieldWidth,
																fieldLabel : getLabel('filterName','Filter Name'),
																maxLength : 20,
																labelSeparator : '',
																labelCls : 'frmLabel',
																enforceMaxLength : true,
																enableKeyEvents : true,
																listeners : {
																	'keypress' : function(
																			text) {
																		// if(
																		// text.value.length
																		// ===
																		// 20 )
																		// me.showErrorMsg();
																	}
																}
															} ]
												},
												{
													xtype : 'container',
													flex : 1,
													layout : 'vbox',
													// hidden : '',
													itemId : 'crossCurrencyContainer',
													padding : '15 0 0 0',
													items : [ {
														xtype : 'container',
														items : [ {
															xtype : 'radiogroup',
															itemId : 'currencyRadioGroup',
															items : [
																	{
																		boxLabel : getLabel('all','All'),
																		name : 'crossCurrency',
																		inputValue : 'All',
																		width : 60,
																		checked : true
																	},
																	{
																		boxLabel : getLabel('crossCurrency','Cross Currency'),
																		padding : '0 0 0 0',
																		name : 'crossCurrency',
																		width : 150,
																		inputValue : 'Y'
																	} ]
														} ]
													} ]
												} ]
									},
									// Instrument Status,UTR Number,Amount,Instrument Number
									{
										xtype : 'container',
										layout : 'hbox',
										width : '100%',
										defaults : {
											labelAlign : 'top'
										},
										items : [
										      {
                                                    xtype : 'container',
                                                    layout : 'vbox',
                                                    defaults : {
                                                        labelAlign : 'top'
                                                    },
                                                    items : [ {
                                                        xtype : 'textfield',
                                                        itemId : 'cwInstNmbrFilterItemId',
                                                        fieldLabel : getLabel(
                                                                'instnmbr',
                                                                'Instrument Number'),
                                                        width : maxFieldWidth,
                                                        margin : '0 25 0 0',
                                                        labelCls : 'frmLabel',
                                                        labelSeparator : '',
                                                        enableKeyEvents : true,
                                                        listeners : {
                                                            'keypress' : function(
                                                                    text) {
                                                                // if(
                                                                // text.value.length
                                                                // === 40 )
                                                                // me.showErrorMsg();
                                                            }
                                                        }
                                                    } ]
                                                },
												{
												    xtype : 'container',
													layout : 'vbox',
													width : 216,
													defaults :
													{
														labelAlign : 'top'
													},
													items : [
													{
														xtype : 'label',
														layout : 'vbox',
														cls : 'frmLabel',
														text : getLabel( 'instAmnt', 'Instrument Amount' )
													},
													{
														xtype : 'container',
														layout : 'hbox',
														padding : '0 0 0 0',
														margin : '0 25 0 0',
														defaults :
														{
															labelAlign : 'top'
														},
														items :
														[{
															xtype : 'combobox',
															width : fieldWidth - 155,
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
																xtype : 'numberfield',
																itemId : 'instAmountFilterItemId',
																padding : '0 0 0 8',
																maxLength : 20,
																enforceMaxLength : true,
																fieldCls : 'w6_7',
																enableKeyEvents : true,
																allowDecimals : true,
																decimalPrecision: 2,
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
														                    this.setCaretPosition(pos);
														                }
														            }
																}
															}
														]
													}]
												},
												{
                                                    xtype : 'container',
                                                    layout : 'hbox',
                                                    defaults : {
                                                        labelAlign : 'top'
                                                    },
                                                    items : [ {
                                                        xtype : 'combobox',
                                                        fieldLabel : getLabel('inststatus','Instrument Status'),
                                                        displayField : 'value',
                                                        valueField : 'key',
                                                        width : maxFieldWidth,
                                                        margin : '0 25 0 0',
                                                        labelSeparator : '',
                                                        itemId : 'InstStatusFilterItemId',
                                                        editable : false,
                                                        store : statusStore,
                                                        fieldCls : 'xn-form-field inline_block',
                                                        labelCls : 'frmLabel',
                                                        triggerBaseCls : 'xn-form-trigger',
                                                        value : 'All'
                                                    } ]
                                                },
                                                {
                                                    xtype : 'container',
                                                    layout : 'vbox',
                                                    defaults : {
                                                        labelAlign : 'top'
                                                    },
                                                    items : [ {
                                                        xtype : 'textfield',
                                                        itemId : 'utrNmbrFilterItemId',
                                                        fieldLabel : getLabel(
                                                                'utrNmbrInst',
                                                                'UTR Number'),
                                                        width : maxFieldWidth,
                                                        margin : '0 25 0 0',
                                                        labelCls : 'frmLabel',
                                                        labelSeparator : '',
                                                        enableKeyEvents : true,
                                                        listeners : {
                                                            'keypress' : function(
                                                                    text) {
                                                                // if(
                                                                // text.value.length
                                                                // === 40 )
                                                                // me.showErrorMsg();
                                                            }
                                                        }
                                                    } ]
                                                }
											]
									},
									//client,Package,Product,Payment location
									{
										xtype : 'container',
										layout : 'hbox',
										width : '100%',
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
												fieldLabel : getLabel( 'client', 'Client' ),
												labelSeparator : '',
												name : 'client',
												width: maxFieldWidth,
												margin : '0 25 0 0',
												itemId : 'clientNameFilterItemId',
												cfgUrl : 'services/userseek/InstrumentQueryClient.json',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'clientSeek',
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
												],
												listeners : {
													'change' : function(combo, strNewValue, strOldValue) {
														me.setClientToAutoCompleterUrl();
													}
												}
											},
											{
												xtype : 'AutoCompleter',
												cls : 'autoCmplete-field',
												labelSeparator : '',
												labelCls: 'frmLabel',
												width: maxFieldWidth,
												margin : '0 25 0 0',
												fieldCls : 'xn-form-text xn-suggestion-box',
												fieldLabel : getLabel( 'package', 'Package' ),
												name : 'paymentPkgName',
												itemId : 'paymentPkgNameFilterItemId',
												cfgUrl : 'services/userseek/InstrumentQueryPackage.json',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'InstrumentQueryPackage',
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
												width: maxFieldWidth,
												fieldLabel : getLabel( 'product', 'Product' ),
												name : 'productCode',
												margin : '0 25 0 0',
												labelSeparator : '',
												itemId : 'productCodeFilterItemId',
												cfgUrl : 'services/userseek/InstrumentQueryProduct.json',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'InstrumentQueryProduct',
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
											,
											{
												xtype : 'AutoCompleter',
												cls : 'autoCmplete-field',
												fieldCls : 'xn-form-text xn-suggestion-box',
												labelCls: 'frmLabel',
												width: maxFieldWidth,
												fieldLabel : getLabel( 'payLocation', 'Payment Location' ),
												name : 'payLocation',
												margin : '0 25 0 0',
												labelSeparator : '',
												itemId : 'paymentLocationFilterItemId',
												cfgUrl : 'services/userseek/InstrumentQueryPayLocation.json',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'InstrumentQueryPayLocation',
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
									},
									//Sending Account ,Debit Date,Creation Date From ,Creation Date To
									{
										xtype : 'container',
										layout : 'hbox',
										width :'100%',
										defaults :
										{
											labelAlign : 'top',
										},
										items :
										[
											{
												xtype : 'AutoCompleter',
												cls : 'autoCmplete-field',
												fieldCls : 'xn-form-text xn-suggestion-box',
												labelCls: 'frmLabel',
												width: maxFieldWidth,
												margin : '0 25 0 0',
												fieldLabel : getLabel( 'sendingAccount', 'Sending Account' ),
												name : 'sendingAcc',
												labelSeparator : '',
												itemId : 'sendingAccFilterItemId',
												cfgUrl : 'services/userseek/InstrumentQuerySendingAcc.json',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'InstrumentQuerySendingAcc',
												cfgRootNode : 'd.preferences',
												cfgKeyNode : 'CODE',
												cfgDataNode1 : 'DESCR',
												cfgDataNode2 : 'CODE',
												cfgExtraParams :
												[
													{
														key : '$filtercode1',
														value : me.sellerVal
													},
													{
														key : '$filtercode2',
														value : '%'
													}
												]
											},
										   me.createDateFilterPanel('debitDateFilter'),
										   {
                                                xtype : 'AutoCompleter',
                                                cls : 'autoCmplete-field',
                                                fieldCls : 'xn-form-text xn-suggestion-box',
                                                labelCls: 'frmLabel',
                                                width: maxFieldWidth,
                                                fieldLabel : getLabel( 'receiverCode', 'Receiver Code' ),
                                                name : 'receiverCode',
                                                margin : '0 25 0 0',
                                                labelSeparator : '',
                                                itemId : 'receiverCodeFilterItemId',
                                                cfgUrl : 'services/userseek/InstrumentQueryReceiver.json',
                                                cfgQueryParamName : '$autofilter',
                                                cfgRecordCount : -1,
                                                cfgSeekId : 'InstrumentQueryReceiver',
                                                cfgRootNode : 'd.preferences',
                                                cfgKeyNode : 'CODE',
                                                cfgDataNode1 : 'DESCR',
                                                cfgDataNode2 : 'CODE',
                                                cfgExtraParams :
                                                [
                                                    {
                                                        key : '$filtercode1',
                                                        value : me.sellerVal
                                                    },
                                                    {
                                                        key : '$filtercode2',
                                                        value : '%'
                                                    }
                                                ]
                                            },
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
                                                        xtype : 'textfield',
                                                        itemId : 'receiverNameFilterItemId',
                                                        fieldLabel : getLabel( 'receiverName', 'Receiver Name' ),
                                                        width :maxFieldWidth,
                                                        margin : '0 25 0 0',
                                                        labelCls: 'frmLabel',
                                                        labelSeparator : '',
                                                        enableKeyEvents : true,
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
									//Effective Date From ,Effective Date To,Processing Date from ,Processing Date to
                                    {
                                        xtype : 'container',
                                        layout : 'hbox',
                                        width :'100%',
                                        defaults :
                                        {
                                            labelAlign : 'top'
                                        },
                                        items :
                                        [   
                                            me.createDateFilterPanel('instrumentDateFilter'),
                                            me.createDateFilterPanel('creationDateAdvFilter'),
                                            me.createDateFilterPanel('effectiveDateFilter'),
                                            me.createDateFilterPanel('processingDateFilter')
                                        ]
                                    },
									//Creation Date From ,Creation Date To
									{
										xtype : 'container',
										layout : 'hbox',
										width :'100%',
										hidden : true,
										itemId : 'moreCriteria2',
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
                                            xtype : 'container',
                                            layout : 'vbox',
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
                                                    width :maxFieldWidth,
                                                    margin : '0 25 0 0',
                                                    labelSeparator : '',
                                                    store : channelCodeList,
                                                    fieldCls : 'xn-form-field inline_block',
                                                    triggerBaseCls : 'xn-form-trigger',
                                                    labelCls: 'frmLabel',
                                                    value : channelCodeList[0]
                                                }
                                            ]
                                        },
											{
												xtype : 'container',
												layout : 'vbox',
												defaults : {
													labelAlign : 'top'
												},
												items : [ {
													xtype : 'textfield',
													itemId : 'batchReferenceFilterItemId',
													fieldLabel : getLabel('batchref','Batch Reference'),
													width : maxFieldWidth,
													labelCls : 'frmLabel',
													labelSeparator : '',
													enableKeyEvents : true,
													listeners : {
														'keypress' : function(
																text) {
															// if(
															// text.value.length
															// === 40 )
															// me.showErrorMsg();
														}
													}
												} ]
											},
										]
									},
									//pickup Location ,client office ,batch Ref,Channel
									{
										xtype : 'container',
										layout : 'hbox',
										hidden : true,
										width :'100%',
										itemId : 'moreCriteria1',
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
												width: maxFieldWidth,
												hidden : true,
												fieldLabel : getLabel( 'pickupLocation', 'Pickup Location' ),
												name : 'pickupLocation',
												margin : '0 25 0 0',
												labelSeparator : '',
												itemId : 'pickupLocationFilterItemId',
												cfgUrl : 'services/userseek/InstrumentQueryPickupLocation.json',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'InstrumentQueryPickupLocation',
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
												hidden : true,
												cls : 'autoCmplete-field',
												fieldCls : 'xn-form-text xn-suggestion-box',
												labelCls: 'frmLabel',
												width: maxFieldWidth,
												fieldLabel : getLabel( 'clientOffice', 'Client Office' ),
												name : 'clientOffice',
												margin : '0 25 0 0',
												labelSeparator : '',
												itemId : 'clientOfficeFilterItemId',
												cfgUrl : 'services/userseek/InstrumentQueryClientOffice.json',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'InstrumentQueryClientOffice',
												cfgRootNode : 'd.preferences',
												cfgKeyNode : 'CODE',
												cfgDataNode1 : 'DESCR',
												cfgDataNode2 : 'CODE',
												cfgExtraParams :
												[
													{
														key : '$filtercode1',
														value : me.sellerVal
													},
													{
														key : '$filtercode2',
														value : '%'
													}
												]
											}
										]
									},
									//bank Batch No,Entry Branch ,Print Branch,Liquidation Branch
									{
										xtype : 'container',
										layout : 'hbox',
										hidden : true,
                                        width : '100%',
										itemId : 'moreCriteria3',
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'container',
												layout : 'vbox',
												itemId : 'cashInContainer',
												defaults :
												{
													labelAlign : 'top'
												},
												items :
												[
													{
														xtype : 'textfield',
														itemId : 'pirNmbrFilterItemId',
														fieldLabel : getLabel( 'cashInBatchNo', 'Bank Batch Number' ),
                                                        width : maxFieldWidth,
                                                        margin : '0 25 0 0',
														labelCls: 'frmLabel',
														labelSeparator : '',
														enableKeyEvents : true,
														listeners :
														{
															'keypress' : function( text )
															{
															}
														}
													}
												]
											},
											{
												xtype : 'AutoCompleter',
												cls : 'autoCmplete-field',
												margin : '0 25 0 0',
												width: maxFieldWidth,
												fieldCls : 'xn-form-text xn-suggestion-box',
												fieldLabel : getLabel( 'entryBranch', 'Entry Branch' ),
												labelSeparator : '',
												name : 'entryBranch',
												labelCls: 'frmLabel',
												itemId : 'entryBranchFilterItemId',
												cfgUrl : 'services/userseek/InstrumentQueryEntryBranch.json',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'InstrumentQueryEntryBranch',
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
												margin : '0 25 0 0',
												width: maxFieldWidth,
												fieldCls : 'xn-form-text xn-suggestion-box',
												fieldLabel : getLabel( 'printBranch', 'Print Branch' ),
												labelSeparator : '',
												name : 'printBranch',
												labelCls: 'frmLabel',
												itemId : 'printBranchFilterItemId',
												cfgUrl : 'services/userseek/InstrumentQueryPrintBranch.json',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'InstrumentQueryPrintBranch',
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
												margin : '0 25 0 0',
												width: maxFieldWidth,
												fieldCls : 'xn-form-text xn-suggestion-box',
												fieldLabel : getLabel( 'liqBranch', 'Liquidation Branch' ),
												labelSeparator : '',
												name : 'liqBranch',
												labelCls: 'frmLabel',
												itemId : 'liqBranchFilterItemId',
												cfgUrl : 'services/userseek/InstrumentQueryLiqBranch.json',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'InstrumentQueryLiqBranch',
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
									},
									//Cancellation Brnach,Request Type,Request Date From ,Request Date To
									{
										xtype : 'container',
										layout : 'hbox',
										hidden : true,
										itemId : 'moreCriteria4',
										width :'100%',
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
										    {
                                                xtype : 'container',
                                                layout : 'hbox',
                                                defaults :
                                                {
                                                    labelAlign : 'top',
                                                },
                                                items :
                                                [
                                                    {
                                                        xtype : 'combobox',
                                                        fieldLabel : getLabel( 'requestType', 'Request Type' ),
                                                        displayField : 'value',
                                                        valueField : 'key',
                                                        width : maxFieldWidth,
                                                        margin : '0 25 0 0',
                                                        labelSeparator : '',
                                                        itemId : 'requestTypeFilterItemId',
                                                        editable : false,
                                                        store : requestTypeStore,
                                                        fieldCls : 'xn-form-field inline_block',
                                                        labelCls: 'frmLabel',
                                                        triggerBaseCls : 'xn-form-trigger',
                                                        value : 'All'
                                                    }
                                                ]
                                            },
											{
												xtype : 'AutoCompleter',
												cls : 'autoCmplete-field',
												fieldCls : 'xn-form-text xn-suggestion-box',
												labelCls: 'frmLabel',
												width: maxFieldWidth,
												fieldLabel : getLabel( 'cancelBranch', 'Cancellation Branch' ),
												name : 'cancelBranch',
												margin : '0 25 0 0',
												labelSeparator : '',
												itemId : 'cancelBranchFilterItemId',
												cfgUrl : 'services/userseek/InstrumentQueryCancelBranch.json',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'InstrumentQueryCancelBranch',
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
											 me.createDateFilterPanel('requestDateAdvFilter'),
											 me.createDateFilterPanel('liqDateDateFilter')
										]
									},
									{
										xtype : 'fieldcontainer',
										layout : 'hbox',
										defaults :
										{
											labelAlign : 'top'
										},
										items :
 										[ {
 											xtype: 'panel',
 										    itemId: 'moreLessCriteriaCaret',
 										    margin: '5 0 0 0',
 										    width : fieldWidth,
 										    html: '<a id="moreCriteriaLink" class=\'fa fa-caret-down ft-margin-very-small-l t7-action-link\' tabindex="1"  href = "#">'+
 										    	  'More Criteria</a>',
											listeners : {
												element: 'el',
											    click: function(ev) {
											        me.handleMoreCreiteria();
											    }}
										}]
									}
								]
						} ];

				this.dockedItems =
				[{
					xtype : 'container',
					height : 10,
					dock : 'top',
					items : [{
								xtype : 'label',
								cls : 'ft-error-message red errmsg',
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
				var me = this
				// Currency
				var currencyValue = objOfCreateNewFilter.down('radiogroup[itemId="currencyRadioGroup"]').getValue().crossCurrency;
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
				// Status
				var statusFilter = objOfCreateNewFilter.down( 'combobox[itemId="InstStatusFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( statusFilter ) && statusFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'InstStatus',
						operator : 'eq',
						value1 : statusFilter,
						value2 : ''
					} );
				}
				// UTR Number
				var utrNmbrFilter = objOfCreateNewFilter.down('textfield[itemId="utrNmbrFilterItemId"]').getValue();
				if( !Ext.isEmpty( utrNmbrFilter ) )
				{
					jsonArray.push(
					{
						field : 'utrNmbr',
						operator : 'lk',
						value1 : utrNmbrFilter,
						value2 : ''
					} );
				}
				// Instrument Amount
				var amountOptFilter = objOfCreateNewFilter.down('combobox[itemId="instAmountOptFilterItemId"]').getValue();
				var instAmountFilter = objOfCreateNewFilter.down('textfield[itemId="instAmountFilterItemId"]').getValue();
				if( !Ext.isEmpty( amountOptFilter ) && !Ext.isEmpty( instAmountFilter ))
				{
					jsonArray.push(
					{
						field : 'instAmount',
						operator : amountOptFilter,
						value1 : instAmountFilter,
						value2 : ''
					} );
				}
				// Instrument Number
				var instnmbrFilter = objOfCreateNewFilter.down('textfield[itemId="cwInstNmbrFilterItemId"]').getValue();
				if( !Ext.isEmpty( instnmbrFilter ) )
				{
					jsonArray.push(
					{
						field : 'cwInstNmbr',
						operator : 'eq',
						value1 : instnmbrFilter,
						value2 : ''
					} );
				}
				// Client Name
				var clientNameFilter = objOfCreateNewFilter.down('AutoCompleter[itemId="clientNameFilterItemId"]').getValue();
				if( !Ext.isEmpty( clientNameFilter ) )
				{
					jsonArray.push(
					{
						field : 'clientName',
						operator : 'lk',
						value1 : clientNameFilter,
						value2 : ''
					} );
				}
				// Package Name
				var paymentPkgNameFilter = objOfCreateNewFilter.down('AutoCompleter[itemId="paymentPkgNameFilterItemId"]').getValue();
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
				// Product Code
				var productCodeFilter = objOfCreateNewFilter.down('AutoCompleter[itemId="productCodeFilterItemId"]').getValue();
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
				// Payment Location
				var payLocationFilter = objOfCreateNewFilter.down('AutoCompleter[itemId="paymentLocationFilterItemId"]').getValue();
				if( !Ext.isEmpty( payLocationFilter ) )
				{
					jsonArray.push(
					{
						field : 'paymentLocation',
						operator : 'eq',
						value1 : payLocationFilter,
						value2 : ''
					} );
				}
				// Sending Account
				var debitAccountFilter = objOfCreateNewFilter.down('AutoCompleter[itemId="sendingAccFilterItemId"]').getValue();
				if( !Ext.isEmpty( debitAccountFilter ) )
				{
					jsonArray.push(
					{
						field : 'sendingAcc',
						operator : 'eq',
						value1 : debitAccountFilter,
						value2 : ''
					} );
				}
				// Debit Date
			     if (!Ext.isEmpty(selectedDebitDate) && !Ext.isEmpty(selectedDebitDate.fromDate)) {
                     jsonArray.push({
                            field : 'clientDrDate',
                            paramIsMandatory : true,
                            value1 : selectedDebitDate.fromDate,
                            value2 : selectedDebitDate.toDate,
                            operator : selectedDebitDate.operator,
                            dataType : 1,
                            paramFieldLable : selectedDebitDate.paramFieldLable,
                        });
                }
				// Creation Date From / Creation Date To
				if (!Ext.isEmpty(selectedCreationDateAdv) && !Ext.isEmpty(selectedCreationDateAdv.fromDate)) {
                     jsonArray.push({
                            field : 'creationDate',
                            paramIsMandatory : true,
                            value1 : selectedCreationDateAdv.fromDate,
                            value2 : selectedCreationDateAdv.toDate,
                            operator : selectedCreationDateAdv.operator,
                            dataType : 1,
                            paramFieldLable : selectedCreationDateAdv.paramFieldLable,
                        });
                }
				// Pickup Location
				var pickupLocationFilter = objOfCreateNewFilter.down('AutoCompleter[itemId="pickupLocationFilterItemId"]').getValue();
				if (!Ext.isEmpty(pickupLocationFilter)) {
					jsonArray.push({
						field : 'pickupLocation',
						operator : 'eq',
						value1 : pickupLocationFilter,
						value2 : ''
					});
				}
				// Client Office
				var clientOfficeFilter = objOfCreateNewFilter.down('AutoCompleter[itemId="clientOfficeFilterItemId"]').getValue();
				if (!Ext.isEmpty(clientOfficeFilter)) {
					jsonArray.push({
						field : 'clientOffice',
						operator : 'eq',
						value1 : clientOfficeFilter,
						value2 : ''
					});
				}
				// Batch Reference
				var batchrefFilter = objOfCreateNewFilter.down('textfield[itemId="batchReferenceFilterItemId"]').getValue();
				if (!Ext.isEmpty(batchrefFilter)) {
					jsonArray.push({
						field : 'batchReference',
						operator : 'eq',
						value1 : batchrefFilter,
						value2 : ''
					});
				}
				// Channel
				var channelCodeFilter = objOfCreateNewFilter.down('combobox[itemId="channelCodeFilterItemId"]').getValue();
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
				// Effective Date From / Effective Date To
                if (!Ext.isEmpty(selectedEffectiveDate) && !Ext.isEmpty(selectedEffectiveDate.fromDate)) {
                     jsonArray.push({
                            field : 'effectiveDate',
                            paramIsMandatory : true,
                            value1 : selectedEffectiveDate.fromDate,
                            value2 : selectedEffectiveDate.toDate,
                            operator : selectedEffectiveDate.operator,
                            dataType : 1,
                            paramFieldLable : selectedEffectiveDate.paramFieldLable
                        });
                }

				// Process Date From / Process Date To
				if (!Ext.isEmpty(selectedProcessingDate) && !Ext.isEmpty(selectedProcessingDate.fromDate)) {
                     jsonArray.push({
                            field : 'processDate',
                            paramIsMandatory : true,
                            value1 : selectedProcessingDate.fromDate,
                            value2 : selectedProcessingDate.toDate,
                            operator : selectedProcessingDate.operator,
                            dataType : 1,
                            paramFieldLable : selectedProcessingDate.paramFieldLable
                        });
                }
				// Cashin Batch Number(Bank Batch Number)
				var cashIn = objOfCreateNewFilter.down( 'textfield[itemId="pirNmbrFilterItemId"]' ).getValue();
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
				// Entry Branch
				var entryBranch = objOfCreateNewFilter.down( 'AutoCompleter[itemId="entryBranchFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( entryBranch ))
				{
					jsonArray.push(
					{
						field : 'entryBranch',
						operator : 'eq',
						value1 : entryBranch,
						value2 : ''
					} );
				}
				// Print Branch
				var printBranchFilter = objOfCreateNewFilter.down( 'AutoCompleter[itemId="printBranchFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( printBranchFilter ))
				{
					jsonArray.push(
					{
						field : 'printBranch',
						operator : 'eq',
						value1 : printBranchFilter,
						value2 : ''
					} );
				}
				// Liquidation Branch
				var liqBranchFilter = objOfCreateNewFilter.down( 'AutoCompleter[itemId="liqBranchFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( liqBranchFilter ))
				{
					jsonArray.push(
					{
						field : 'liqBranch',
						operator : 'eq',
						value1 : liqBranchFilter,
						value2 : ''
					} );
				}
				// Cancellation Branch
				var canelBranchFilter = objOfCreateNewFilter.down( 'AutoCompleter[itemId="cancelBranchFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( canelBranchFilter ))
				{
					jsonArray.push(
					{
						field : 'cancelBranch',
						operator : 'eq',
						value1 : canelBranchFilter,
						value2 : ''
					} );
				}
				// Receiver Code
				var receiverCodeFilter = objOfCreateNewFilter.down( 'AutoCompleter[itemId="receiverCodeFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( receiverCodeFilter ))
				{
					jsonArray.push(
					{
						field : 'receiverCode',
						operator : 'eq',
						value1 : receiverCodeFilter,
						value2 : ''
					} );
				}
				//receiver Name
				var receiverNameFilter = objOfCreateNewFilter.down('textfield[itemId="receiverNameFilterItemId"]').getValue();
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
				// Instrument Date From / Instrument Date To
                if (!Ext.isEmpty(selectedInstrumentDate) && !Ext.isEmpty(selectedInstrumentDate.fromDate)) {
                     jsonArray.push({
                            field : 'instDate',
                            paramIsMandatory : true,
                            value1 : selectedInstrumentDate.fromDate,
                            value2 : selectedInstrumentDate.toDate,
                            operator : selectedInstrumentDate.operator,
                            dataType : 1,
                            paramFieldLable : selectedInstrumentDate.paramFieldLable
                        });
                }
				// Liquidation Date
                if (!Ext.isEmpty(selectedLiqDate) && !Ext.isEmpty(selectedLiqDate.fromDate)) {
                     jsonArray.push({
                            field : 'liqDate',
                            paramIsMandatory : true,
                            value1 : selectedLiqDate.fromDate,
                            value2 : selectedLiqDate.toDate,
                            operator : selectedLiqDate.operator,
                            dataType : 1,
                            paramFieldLable : selectedLiqDate.paramFieldLable
                        });
                }
				// Request type
				var requestTypeFilter = objOfCreateNewFilter.down('combobox[itemId="requestTypeFilterItemId"]').getValue();
				if( !Ext.isEmpty( requestTypeFilter ) && requestTypeFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'requestType',
						operator : 'eq',
						value1 : requestTypeFilter,
						value2 : ''
					} );
				}
				// Request Date
				if (!Ext.isEmpty(selectedRequestDate) && !Ext.isEmpty(selectedRequestDate.fromDate)) {
                     jsonArray.push({
                            field : 'requestDate',
                            paramIsMandatory : true,
                            value1 : selectedRequestDate.fromDate,
                            value2 : selectedRequestDate.toDate,
                            operator : selectedRequestDate.operator,
                            dataType : 1,
                            paramFieldLable : selectedRequestDate.paramFieldLable
                        });
                }
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
				objCreateNewFilterPanel.down( 'radiogroup[itemId="currencyRadioGroup"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="InstStatusFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="utrNmbrFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="instAmountOptFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="instAmountFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="cwInstNmbrFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="clientNameFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="paymentPkgNameFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="productCodeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="paymentLocationFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="sendingAccFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="pickupLocationFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="clientOfficeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="batchReferenceFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="channelCodeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="channelCodeFilterItemId"]' ).setValue('All');
			    objCreateNewFilterPanel.down( 'textfield[itemId="pirNmbrFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="entryBranchFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="printBranchFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="liqBranchFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="receiverCodeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="receiverNameFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="cancelBranchFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="requestTypeFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="requestTypeFilterItemId"]' ).setValue('All');
				$("#moreCriteriaLink").toggleClass("fa-caret-down fa-caret-up");
				$("#moreCriteriaLink").text(getLabel("morecriterial", "More Criteria"));
				objCreateNewFilterPanel.down('container[itemId="moreCriteria1"]').hide();
				objCreateNewFilterPanel.down('container[itemId="moreCriteria2"]').hide();
				objCreateNewFilterPanel.down('container[itemId="moreCriteria3"]').hide();
				objCreateNewFilterPanel.down('container[itemId="moreCriteria4"]').hide();
				selectedCreationDateAdv = {};
                selectedDebitDate = {};
                selectedEffectiveDate = {};
                selectedProcessingDate = {};
                selectedInstrumentDate = {};
                selectedLiqDate ={};
                selectedRequestDate = {};
                creation_Adv_date_opt =null;
                debit_date_opt =null;
                effecive_date_opt =null;
                process_date_opt =null;
                inst_date_opt =null;
                liq_date_opt =null;
                request_date_opt =null;
			},
			enableDisableFields : function( objCreateNewFilterPanel, boolVal )
			{
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'radiogroup[itemId="currencyRadioGroup"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="InstStatusFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="utrNmbrFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="instAmountOptFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="instAmountFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="cwInstNmbrFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="clientNameFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="paymentPkgNameFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="productCodeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="paymentLocationFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="sendingAccFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="pickupLocationFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="clientOfficeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="batchReferenceFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="channelCodeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="channelCodeFilterItemId"]' ).setValue('All');
				objCreateNewFilterPanel.down( 'textfield[itemId="pirNmbrFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="entryBranchFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="printBranchFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="liqBranchFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="receiverCodeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="receiverNameFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="cancelBranchFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="requestTypeFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'button[itemId="creationDateAdvFilterId"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'button[itemId="debitDateFilterId"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'button[itemId="effectiveDateFilterId"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'button[itemId="processingDateFilterId"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'button[itemId="instrumentDateFilterId"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'button[itemId="liqDateDateFilterId"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'button[itemId="requestDateAdvFilterId"]').setDisabled( boolVal );
			    objCreateNewFilterPanel.down( 'container[itemId="creationDateAdvFilterTextField"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'container[itemId="debitDateFilterTextField"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'container[itemId="effectiveDateFilterTextField"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'container[itemId="processingDateFilterTextField"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'container[itemId="instrumentDateFilterTextField"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'container[itemId="liqDateDateFilterTextField"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'container[itemId="requestDateAdvFilterTextField"]').setDisabled( boolVal );
			
			},
			removeReadOnly : function( objCreateNewFilterPanel, boolVal )
			{
				objCreateNewFilterPanel.down( 'radiogroup[itemId="currencyRadioGroup"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="InstStatusFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="utrNmbrFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="instAmountOptFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="instAmountFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="cwInstNmbrFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="clientNameFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="paymentPkgNameFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="productCodeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="paymentLocationFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="sendingAccFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="pickupLocationFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="clientOfficeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="batchReferenceFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="channelCodeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="channelCodeFilterItemId"]' ).setValue('All');
				objCreateNewFilterPanel.down( 'textfield[itemId="pirNmbrFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="entryBranchFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="printBranchFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="liqBranchFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="receiverCodeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="receiverNameFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="cancelBranchFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="requestTypeFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'button[itemId="creationDateAdvFilterId"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'button[itemId="debitDateFilterId"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'button[itemId="effectiveDateFilterId"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'button[itemId="processingDateFilterId"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'button[itemId="instrumentDateFilterId"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'button[itemId="liqDateDateFilterId"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'button[itemId="requestDateAdvFilterId]').setDisabled( boolVal );
			    objCreateNewFilterPanel.down( 'container[itemId="creationDateAdvFilterTextField"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'container[itemId="debitDateFilterTextField"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'container[itemId="effectiveDateFilterTextField"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'container[itemId="processingDateFilterTextField"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'container[itemId="instrumentDateFilterTextField"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'container[itemId="liqDateDateFilterTextField"]').setDisabled( boolVal );
                objCreateNewFilterPanel.down( 'container[itemId="requestDateAdvFilterTextField"]').setDisabled( boolVal );
			    
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
				var clientautoComplter = me.down('combobox[itemId="clientNameFilterItemId"]');
				clientautoComplter.reset();
				clientautoComplter.cfgExtraParams = [{
							key : '$filtercode1',
							value : seller
						}];
			},
			setClientToAutoCompleterUrl : function() {
				var me = this;
				var clientCombo = me.down('AutoCompleter[itemId="clientNameFilterItemId"]');
				var client = clientCombo.getValue();
				var clientOfficeautoComplter = me.down('AutoCompleter[itemId="clientOfficeFilterItemId"]');
				var receiverCodeautoComplter = me.down('AutoCompleter[itemId="receiverCodeFilterItemId"]');
				var sendingAccautoComplter = me.down('AutoCompleter[itemId="sendingAccFilterItemId"]');
				
				clientOfficeautoComplter.reset();
				clientOfficeautoComplter.cfgExtraParams = [{
					key : '$filtercode1',
					value : me.sellerVal
						},{
							key : '$filtercode2',
							value : client
						  }];
				receiverCodeautoComplter.reset();
				receiverCodeautoComplter.cfgExtraParams = [{
					key : '$filtercode1',
					value : me.sellerVal
						},{
							key : '$filtercode2',
							value : client
						  }];
				sendingAccautoComplter.reset();
				sendingAccautoComplter.cfgExtraParams = [{
					key : '$filtercode1',
					value : me.sellerVal
						},{
							key : '$filtercode2',
							value : client
						  }];
			},
			handleMoreCreiteria : function (){
				var me = this;
				var labelText = $("#moreCriteriaLink").text();
				if (labelText==getLabel("lesscriterial", "Less Criteria")) {
					$("#moreCriteriaLink").toggleClass("fa-caret-down fa-caret-up");
					$("#moreCriteriaLink").text(getLabel("morecriterial", "More Criteria"));
					me.down('container[itemId="moreCriteria1"]').hide();
					me.down('container[itemId="moreCriteria2"]').hide();
					me.down('container[itemId="moreCriteria3"]').hide();
					me.down('container[itemId="moreCriteria4"]').hide();
				} else if (labelText==getLabel("morecriterial","More Criteria")) {
					$("#moreCriteriaLink").toggleClass("fa-caret-up fa-caret-down");
					$("#moreCriteriaLink").text(getLabel("lesscriterial", "Less Criteria"));
					me.down('container[itemId="moreCriteria1"]').show();
					me.down('container[itemId="moreCriteria2"]').show();
					me.down('container[itemId="moreCriteria3"]').show();
					me.down('container[itemId="moreCriteria4"]').show();
				}
			},
	        createDateFilterPanel : function(filterType) {
                var me = this;
                var dateMenuPanel = Ext.create('Ext.container.Container', {
                itemId : filterType.concat('Container'),
                layout : 'vbox',
                width : 216,
                items : [
                    {
                    xtype : 'container',
                    itemId : filterType+'Panel',
                    layout : 'hbox',
                    width : 175,
                    margin :'0 0 0 0',
                    cls : 'adv_filter_date_menu',
                    items : [
                        {
                        xtype : 'label',
                        itemId : filterType+'Label',
                        forId:filterType+'Label',
                        cls : 'f13 ux_font-size14',
                        padding : '0 0 0 0px',
                        text : getLabel(filterType, 'Creation Date')
                        }, {
                        xtype : 'button',
                        border : 0,
                        position:'absolute',
                        itemId : filterType.concat('Id'),
                        cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
                        glyph : 'xf0d7@fontawesome',
                        listeners : {
                            render: function(c) {
                                    var tip = Ext.create('Ext.tip.ToolTip', {
                                    target: c.getEl(),
                                    listeners: {
                                        beforeshow: function(tip) {
                                            me.populateToolTip(tip,filterType);
                                        }
                                    }
                                });
                            },
                            click : function(event) {
                                var menus=me.getDateDropDownItems(filterType,this);
                                var xy = event.getXY();
                                menus.showAt(xy[0], xy[1] + 16);
                                event.menu = menus;
                            }
                        }
                    },]
                 },
                 me.addDateContainerPanel(filterType)
             ]
            });
         return dateMenuPanel;
       },
       addDateContainerPanel : function(filterType) {
            var dateContainerPanel = Ext.create('Ext.container.Container', {
            layout : 'hbox',
            itemId : filterType.concat('ToContainer'),
            width : '93%',
            items : [{
                xtype : 'container',
                width : '83%',
                itemId : filterType.concat('TextField'),
                html : '<input type="text" class="ft-datepicker from-date-range ui-datepicker-range-alignment" id='+filterType.concat("Picker") +'>'
                }, {
                    xtype : 'container',
                    cls : 'icon-calendar',
                    margin : '0 0 0 0',
                    border : 1,
                    html : '<span class=""><i class="fa fa-calendar"></i></span>'
                }]
        });
            return dateContainerPanel;
       },
       populateToolTip :function(tip,filterType){
            if(filterType === 'creationDateAdvFilter'){
                if(creation_Adv_date_opt === null) {
                     tip.update(getLabel(filterType,'Creation Date'));
                } else {
                     tip.update(getLabel(filterType,'Creation Date')  + creation_Adv_date_opt);
                 }
            }
            else if(filterType === 'debitDateFilter'){
                if(debit_date_opt === null) {
                     tip.update(getLabel(filterType,'Debit Date'));
                }else{
                     tip.update(getLabel(filterType,'Debit Date') + debit_date_opt);
                }
            }
            else if(filterType === 'effectiveDateFilter'){
                if(effecive_date_opt === null) {
                     tip.update(getLabel(filterType,'Effective Date'));
                }else {
                     tip.update(getLabel(filterType,'Effective Date') + effecive_date_opt);
                }
            }
            else if(filterType === 'processingDateFilter'){
                if(process_date_opt === null) {
                     tip.update(getLabel(filterType,'Processing Date'));
                }else {
                     tip.update(getLabel(filterType,'Processing Date') + process_date_opt);
                }
            }
            else if(filterType === 'instrumentDateFilter'){
                if(inst_date_opt === null) {
                     tip.update(getLabel(filterType,'Instrument Date'));
                }else {
                     tip.update(getLabel(filterType,'Instrument Date') + inst_date_opt);
                }
            }
            else if(filterType === 'liqDateDateFilter'){
                if(liq_date_opt === null) {
                     tip.update(getLabel(filterType,'Liquidation Date'));
                } else{
                     tip.update(getLabel(filterType,'Liquidation Date') + liq_date_opt);
                }
            }
            else if(filterType === 'requestDateAdvFilter'){
                if(request_date_opt === null) {
                     tip.update(getLabel(filterType,'Request Date'));
                } else{
                     tip.update(getLabel(filterType,'Request Date') + request_date_opt);
                }
            }
        },
        getDateDropDownItems : function(filterType,buttonIns)
        {
            var me = this;
            var arrMenuItem = [];
            arrMenuItem.push({
                btnId : 'latest',
                btnValue : '12',
                text : getDateIndexLabel('12'),
                handler : function(btn, opts) {
                    $(document).trigger("filterDateChange",[filterType,btn,opts]);
                }
            });
            arrMenuItem.push({
                btnId : 'btnToday',
                btnValue : '1',
                text : getDateIndexLabel('1'),
                handler : function(btn, opts) {
                    $(document).trigger("filterDateChange",[filterType,btn,opts]);
                }
            });
            arrMenuItem.push({
                btnId : 'btnYesterday',
                btnValue : '2',
                text : getDateIndexLabel('2'),
                handler : function(btn, opts) {
                    $(document).trigger("filterDateChange",[filterType,btn,opts]);
                }
            });
            arrMenuItem.push({
                btnId : 'btnThisweek',
                btnValue : '3',
                text : getDateIndexLabel('3'),
                handler : function(btn, opts) {
                    $(document).trigger("filterDateChange",[filterType,btn,opts]);
                }
            });
            arrMenuItem.push({
                btnId : 'btnLastweek',
                btnValue : '4',
                text : getDateIndexLabel('4'),
                handler : function(btn, opts) {
                    $(document).trigger("filterDateChange",[filterType,btn,opts]);
                }
            });
            arrMenuItem.push({
                btnId : 'btnThismonth',
                btnValue : '5',
                text : getDateIndexLabel('5'),
                handler : function(btn, opts) {
                    $(document).trigger("filterDateChange",[filterType,btn,opts]);
                }
            });
            arrMenuItem.push({
                btnId : 'btnLastmonth',
                btnValue : '6',
                text : getDateIndexLabel('6'),
                handler : function(btn, opts) {
                    $(document).trigger("filterDateChange",[filterType,btn,opts]);
                }
            });
            arrMenuItem.push({
                btnId : 'btnLastMonthToDate',
                btnValue : '8',
                text : getDateIndexLabel('8'),
                handler : function(btn, opts) {
                    $(document).trigger("filterDateChange",[filterType,btn,opts]);
                }
            });
            arrMenuItem.push({
                btnId : 'btnQuarterToDate',
                btnValue : '9',
                text : getDateIndexLabel('9'),
                handler : function(btn, opts) {
                    $(document).trigger("filterDateChange",[filterType,btn,opts]);
                }
            });
            arrMenuItem.push( {
                btnId : 'btnLastQuarterToDate',
                btnValue : '10',
                text : getDateIndexLabel('10'),
                handler : function(btn, opts) {
                    $(document).trigger("filterDateChange",[filterType,btn,opts]);
                }
            });
            arrMenuItem.push({
                btnId : 'btnYearToDate',
                btnValue : '11',
                text : getDateIndexLabel('11'),
                handler : function(btn, opts) {
                    $(document).trigger("filterDateChange",[filterType,btn,opts]);
                }
            });
            var dropdownMenu = Ext.create('Ext.menu.Menu', {
                itemId : 'DateMenu',
                cls : 'ext-dropdown-menu',
                items : arrMenuItem
            });
            return dropdownMenu;
        }
		});
