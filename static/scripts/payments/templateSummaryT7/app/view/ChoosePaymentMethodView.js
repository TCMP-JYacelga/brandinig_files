Ext.define('GCP.view.ChoosePaymentMethodView', {
	extend : 'Ext.panel.Panel',
	xtype : 'choosePaymentMethodView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	// height : '100%',
	height : 330,
	//margin : '2 0 2 0',
	//cls : 'xn-panel',
	cls : 'xn-panel ux_background-color-white',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		var receiverSearchTextField = Ext.create('Ext.ux.gcp.AutoCompleter', {
					margin : '2 0 2 110',
					name : 'receiverName',
					itemId : 'receiverNameId',
					cfgUrl : 'services/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'recieverseek',
					cfgRootNode : 'd.receivers',
					cfgDataNode1 : 'receiverCode',
					cfgDataNode2 : 'receiverName'
				});
		receiverSearchTextField.on('select', function(combo, records) {
					me.fireEvent('receiverCodeSelect', combo.findRecord(
									'receiverCode', combo.getValue()).raw);
				});

		this.items = [{
			xtype : 'panel',
			layout : 'vbox',
			height : 60,
			margin : '4 0 4 0',
			componentCls : 'gradiant_back roundify ui-corner-all',
			items : [{
				xtype : 'toolbar',
				itemId : 'newPaymentTitle',
				layout : 'hbox',
				width : '100%',
				items : [{
							xtype : 'label',
							text : getLabel('instrumentsNewPaymentPopupTitle', 'New Payment'),
							cls : 'font_bold ux_font-size16',
							padding : '0 0 0 5'
						}, '->', {
							xtype : 'AutoCompleter',
							fieldCls : 'xn-form-text w12 xn-suggestion-box',
							itemId : 'sellerAutoCompleter',
							hidden : (!Ext.isEmpty(strEntityType) && (strEntityType === '1'))
									? true
									: false,
							name : 'sellerAutoCompleter',
							cfgUrl : 'services/userseek/sellerSeek.json',
							cfgRecordCount : -1,
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'CODE',
							cfgDataNode2 : 'DESCRIPTION',
							cfgKeyNode : 'CODE',
							value : strSeller,
							listeners : {
								'select' : function(combo, record) {
									strSeller = combo.getValue();
									me.fireEvent('sellerComboSelect', combo,
											record);
								}
							}
						}, {
							xtype : 'AutoCompleter',
							fieldCls : 'xn-form-text w12 xn-suggestion-box',
							itemId : 'clientAutoCompleter',
							hidden : (!Ext.isEmpty(strEnableSeek) && (strEnableSeek === 'Y'))
									? false
									: true,
							name : 'clientAutoCompleter',
							cfgUrl : 'services/userseek/userclients.json',
							cfgRecordCount : -1,
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCR',
							cfgKeyNode : 'CODE',
							value : strClient,
							listeners : {
								'select' : function(combo, record) {
									strClient = combo.getValue();
									strClientDesc = combo.getRawValue();
									me.fireEvent('clientComboSelect', combo,
											record);
								},
								'render' : function(combo) {
									combo.store.loadRawData({
												"d" : {
													"preferences" : [{
																"CODE" : strClient,
																"DESCR" : strClientDesc
															}]
												}
											});
									combo.suspendEvents();
									combo.setValue(strClient);
									combo.resumeEvents();
								}
							}
						}]
			}, {
				xtype : 'toolbar',
				width : '100%',
				layout : 'hbox',
				cls : 'ux_toolbar',
				itemId : 'newPaymentOptions',
				items : [{
					xtype : 'panel',
					itemId : 'paymentTypeOptionPanel',
					layout : 'hbox',
					items : [{
								xtype : 'label',
								text : getLabel('createPaymentMsg', 'Create a Payment by selecting'),
								padding : '0 15 0 5',
								cls : 'ux_font-size14-normal ux_line-height24'
							}, {
								xtype : 'checkboxfield',
								cls : 'ux_line-height24 ux_radio-button',
								padding : '0 0 0 20',
								itemId : 'paymentMethodCheckbox',
								boxLabel : getLabel('instrumentAdvFltPaymentMethod', 'Payment Package'),
								checked : true,
								readOnly : true,
								parent : this,
								handler : function(field, value) {
									click : this.parent.fireEvent(
											"paymentTypeSelectionEvent", field,
											field.checked);
								}
							}, /*{
								xtype : 'label',
								text : 'OR',
								padding : '4 10 0 10'
							},*/ {
								xtype : 'checkboxfield',
								itemId : 'selectingReceiverCheckbox',
								padding : '0 0 0 20',
								cls : 'ux_line-height24 ux_radio-button',
								boxLabel : getLabel('receiverlbl', 'Receiver'),
								parent : this,
								handler : function(field, value) {
									click : this.parent.fireEvent(
											"paymentTypeSelectionEvent", field,
											field.checked);
								}
							}, /*{
								xtype : 'label',
								text : 'OR',
								padding : '4 10 0 10'

							},*/ {
								xtype : 'checkboxfield',
								padding : '0 0 0 20',
								cls : 'ux_line-height24 ux_radio-button',
								itemId : 'selectingBankReceiverCheckbox',
								boxLabel : getLabel('bankDefinedReceiver', 'Selecting a Bank Defined Receiver'),
								parent : this,
								handler : function(field, value) {
									click : this.parent.fireEvent(
											"paymentTypeSelectionEvent", field,
											field.checked);
								}
							}]
				}]

			}]
		}, {
			xtype : 'panel',
			items : [{
						xtype : 'label',
						itemId : 'errorLabel',
						cls : 'error-msg-color',
						padding : '0 0 5 0'
					}]
		}, {
			xtype : 'panel',
			width : '100%',
			layout : 'column',
			cls : 'ux_hide-image',
			itemId : 'selectProfileLabelPanel',
			items : [{
						xtype : 'container',
						minHeight : 20,
						columnWidth : 0.24
					}, {
						xtype : 'container',
						minHeight : 20,
						columnWidth : 0.41,
						itemId : 'selectPmtProfilePanelContainer',
						layout : {
							type : 'hbox'
							// pack: 'end'
						},
						items : [{
							xtype : 'label',
							text : getLabel('pmtEmtrySelectProfile',
									'Select Payment Profile (Select One)'),
							itemId : 'payProfileLabel',
							padding : '2 0 0 0',
							cls : 'font_bold'
						}]
					}, {
						xtype : 'container',
						minHeight : 20,
						columnWidth : 0.35,
						layout : {
							type : 'hbox',
							pack : 'end'
						},
						items : [{
									xtype : 'button',
									itemId : 'btnSavePreferences',
									margin : '0 0 0 15',
									icon : 'static/images/icons/information.png',
									text : getLabel('paymentProfileGuide', 'Payment Profile Guide'),
									cls : 'xn-account-filter-btnmenu',
									textAlign : 'right',
									width : 145
								}]
					}]

		}, {
			xtype : 'panel',
			itemId : 'paymentMethodPanel',
			layout : 'hbox',
			margin : '4 4 4 4',
			padding : '5 0 0 2',
			width : '100%',
			height : 230,
			items : [{
						xtype : 'panel',
						itemId : 'paymentTypeListPanel',
						cls : 'panel-seperator',
						width : '22%',
						height : 230,
						layout : 'vbox',
						items : [{}]
					}, {
						xtype : 'panel',
						padding : '4 2 0 20',
						//padding : '4 2 0 8',
						width : '78%',
						height : 210,
						itemId : 'paymentProfileSelectionPanel',
						overflowY : 'auto',
						items : [{
									xtype : 'panel',
									padding : '5 0 5 0',
									itemId : 'paymentProfileListPanel',
									items : [{}]
								}, {
									xtype : 'label',
									itemId : 'noDataErrorLabel',
									text : getLabel('emptyDataMsg',
											'No Profiles created for the selected Payment Type.'),
									flex : 1,
									padding : '10 0 0 0',
									hidden : true
								}]

					}, {
						xtype : 'label',
						itemId : 'noClientDataErrorLabel',
						text : getLabel('noClientDataError',
								'No Data Available for the moment.'),
						flex : 1,
						hidden : true
					}]
		}, {
			xtype : 'panel',
			itemId : 'paymentReceiverPanel',
			layout : 'hbox',
			width : '100%',
			margin : '4 4 2 4',
			padding : '5 0 0 2',
			height : 225,
			hidden : true,
			items : [{
				xtype : 'panel',
				width : '100%',
				layout : 'vbox',
				items : [{
					xtype : 'label',
					text : getLabel('searchReceiverMsg', 'Search Receiver Name  or  Browse the Receiver Directory Below'),
					margin : '2 0 2 110'
				}, receiverSearchTextField, {
					xtype : 'panel',
					layout : 'hbox',
					padding : '3 0 3 0',
					margin : '2 0 0 0',
					items : [{
								xtype : 'label',
								text : getLabel('makePaymentMsg', 'Make Payment to'),
								cls : 'font_bold'
							}, {
								xtype : 'label',
								margin : '0 0 0 20',
								itemId : 'makePaymentToLabel',
								width : '100%',
								text : 'Receiver Name, Account, Bank Name, Product'
							}]
				}, {
					xtype : 'panel',
					layout : 'hbox',
					margin : '8 0 0 0',
					items : [{
								xtype : 'label',
								text : getLabel('receiverDirectory', 'Receiver Directory'),
								margin : '2 0 0 0'
							}, {
								xtype : 'panel',
								cls : 'xn-panel',
								margin : '2 2 3 14',
								width : '100%',
								items : [{
											xtype : 'toolbar',
											itemId : 'receiverDirectoryToolbar',
											items : []
										}]
							}]
				}, {
					xtype : 'panel',
					layout : 'hbox',
					width : '100%',
					items : [{
						xtype : 'panel',
						width : '100%',
						items : [{
							xtype : 'panel',
							layout : 'hbox',
							items : [{
								xtype : 'label',
								itemId : 'iconReceiverDirectoryLabel',
								height : 22,
								width : 22,
								padding : '4 0 0 0',
								text : 'all',
								cls : 'icon-receiver-filter font_bold white centerAlign bottomAlign'
							}, {
								xtype : 'container',
								width : '100%',
								baseCls : 'horizontal-row-blue',
								margin : '10 0 0 0'
							}]
						}, {
							xtype : 'panel',
							// overflowY : 'auto',
							height : 85,
							margin : '2',
							itemId : 'paymentReceiverGridPanel',
							layout : 'column',
							items : []
						}, {
							xtype : 'toolbar',
							width : '100%',
							padding : '1 0 0 0',
							itemId : 'paymentReceiverGridPanelPagination',
							items : [{
										xtype : 'label',
										itemId : 'lblReceiverFrom',
										hidden : true,
										text : '1'
									}, {
										xtype : 'label',
										hidden : true,
										itemId : 'lblReceiverTo',
										text : '9'
									}, {
										text : '<span class="small-linkblue"><< First</span>',
										itemId : 'btnfirstpagination',
										handler : function(btn, opts) {
											me
													.fireEvent(
															'paymentReceiverPagination',
															'first');
										}
									}, {
										text : '<span class="small-linkblue">< Previous</span>',
										itemId : 'btnprevpagination',
										handler : function(btn, opts) {
											me
													.fireEvent(
															'paymentReceiverPagination',
															'previous');
										}
									}, {
										xtype : 'tbseparator'
									}, {
										text : '<span class="small-linkblue">Next ></span>',
										itemId : 'btnnextpagination',
										handler : function(btn, opts) {
											me
													.fireEvent(
															'paymentReceiverPagination',
															'next');
										}
									}, {
										text : '<span class="small-linkblue">Last >></span>',
										itemId : 'btnlastpagination',
										handler : function(btn, opts) {
											me
													.fireEvent(
															'paymentReceiverPagination',
															'last');
										}
									}]
						}/*
							 * , { xtype : 'container', width : '100%', baseCls :
							 * 'horizontal-row-blue' }
							 */]
					}]
				}]
			}]
		}, {
			xtype : 'panel',
			itemId : 'bankBenePanel',
			layout : 'hbox',
			margin : '4 4 4 4',
			padding : '0 0 0 2',
			width : '100%',
			height : 230,
			items : [{
						xtype : 'panel',
						itemId : 'bankBeneficiaryCategoriesListPanel',
						cls : 'panel-seperator',
						width : '22%',
						height : 230,
						layout : 'vbox',
						items : [{}]
					}, {
						xtype : 'panel',
						padding : '4 2 0 8',
						width : '78%',
						height : 210,
						itemId : 'bankDefineReceivarSelectionPanel',
						overflowY : 'auto',
						items : [{
									xtype : 'panel',
									padding : '5 0 5 0',
									itemId : 'bankDefineReceivarListPanel',
									items : [{}]
								}, {
									xtype : 'label',
									itemId : 'noDataErrorLabel',
									text : getLabel('emptyDataMsg',
											'No Profiles created for the selected Payment Type.'),
									flex : 1,
									padding : '10 0 0 0',
									hidden : true
								}]

					}, {
						xtype : 'label',
						itemId : 'noClientBankBeneDataErrorLabel',
						text : getLabel('noClientDataError',
								'No Data Available for the moment.'),
						flex : 1,
						hidden : true
					}]
		}

		];
		this.callParent(arguments);
	}
});