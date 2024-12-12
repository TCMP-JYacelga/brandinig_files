Ext.define('CPON.view.PaymentParametersPopUp', {
	extend : 'Ext.window.Window',
	xtype : 'paymentParametersPopUp',
	requires : ['Ext.data.Store'],
	width : 650,
	height : 350,
	modal : true,
	draggable : true,
	closeAction : 'hide',
	autoScroll : true,
	listeners : {
						afterrender : function() {
							this.setInitialValues()
						}
					},
	config : {
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null
	},

	initComponent : function() {
		var me = this;
		this.title = me.title;
		var instNoStore = Ext.create('Ext.data.Store', {
					fields : ['key', 'value'],
					data : [{
								"key" : '',
								"value" : 'Select'
							}]
				});

		this.items = [{
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				flex : 1,
				margin : '8 0 0 8',
				items : [{
					xtype : 'checkboxfield',
					itemId : 'clientendPrintingCheck',
					boxLabel : getLabel('clientendPrinting',
							'Client End Printing'),
					labelSeparator : '',
					labelAlign : 'right',
					listeners : {
						change : function(field, newValue) {
							me.toggleCheckUncheck(field,
									'clientendPrintingFlag');
						}
					}
				}]
			}, {
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				margin : '0 0 0 8',
				items : [{
					xtype : 'label',
					text : getLabel('instNoGenrtn', 'Instrument No. Generation'),
					padding : '5 0 0 3'
				}, {
					xtype : 'combobox',
					displayField : 'value',
					itemId : 'instCombo',
					valueField : 'key',
					fieldCls : 'xn-form-field',
					triggerBaseCls : 'xn-form-trigger',
					value : '',
					width : 100,
					store : instNoStore,
					editable : false,
					listConfig : {
						width : 170
					}
				}]
			}]
		}, {
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				margin : '8 0 0 8',
				flex : 1,
				items : [{
							xtype : 'checkboxfield',
							itemId : 'paperAdviceReqCheck',
							boxLabel : getLabel('pprAdvice',
									'Paper Advice Required'),
							labelSeparator : '',
							labelAlign : 'right',
							listeners : {
								change : function(field, newValue) {
									me.toggleCheckUncheck(field,
											'paperAdviceReq');
								}
							}
						}]
			}, {
				xtype : 'container',
				layout : 'vbox',
				margin : '0 0 0 8',
				flex : 1,
				items : [{
							xtype : 'label',
							text : getLabel('statCode', 'Stationary Code'),
							padding : '5 0 0 3'
						}, {
							xtype : 'textfield',
							itemId : 'statCodeTextField',
							maxLength : 20,
							enforceMaxLength :true,
							listeners : {
								change : function(field, newValue) {
									field.setValue(newValue.toUpperCase());
								}
							}
						}]
			}]
		}, {
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				margin : '8 0 0 8',
				flex : 1,
				items : [{
					xtype : 'checkboxfield',
					itemId : 'denominationApplicableCheck',
					boxLabel : getLabel('denomApplicable',
							'Denomination Applicable'),
					labelSeparator : '',
					labelAlign : 'right',
					listeners : {
						change : function(field, newValue) {
							me.toggleCheckUncheck(field,
									'denominationApplicable');
						}
					}
				}]
			}, {
				xtype : 'container',
				layout : 'vbox',
				margin : '0 0 0 8',
				flex : 1,
				items : [{
					xtype : 'label',
					text : getLabel('highDenomVale',
							'Highest Denomination Value'),
					padding : '5 0 0 3'
				}, {
					xtype : 'textfield',
					itemId : 'highestDenomTextField',
					maxLength : 20,
					enforceMaxLength :true,
					listeners : {
						change : function(field, newValue) {
							field.setValue(newValue.toUpperCase());
						}
					}
				}]
			}]
		}, {
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			margin : '8 0 0 0',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				margin : '8 0 0 8',
				flex : 1,
				items : [{
					xtype : 'checkboxfield',
					itemId : 'backdatedInstAllowCheck',
					boxLabel : getLabel('backdatedInstAllwd',
							'Backdated Instrument Allowed'),
					labelSeparator : '',
					labelAlign : 'right',
					listeners : {
						change : function(field, newValue) {
							me.toggleCheckUncheck(field, 'backdatedInstAllow');
						}
					}
				}

				]
			}, {
				xtype : 'container',
				layout : 'hbox',
				margin : '8 0 0 8',
				flex : 1,
				items : [{
							xtype : 'checkboxfield',
							itemId : 'refundAtStaleCheck',
							boxLabel : getLabel('refundAtStale',
									'Refund At Stale'),
							labelSeparator : '',
							labelAlign : 'right',
							listeners : {
								change : function(field, newValue) {
									me.toggleCheckUncheck(field,
											'refundAtStale');
								}
							}
						}

				]
			}]
		}];
		this.buttons = [{
					xtype : 'button',
					text : getLabel('save', 'Save'),
					itemId : 'btnSaveParamPopUp',
					cls : 'xn-button',
					handler : function() {
						me.saveItems();
						me.close();
					}
				}, {
					xtype : 'button',
					text : getLabel('cancel', 'Cancel'),
					itemId : 'btnCancelParamPopUp',
					cls : 'xn-button',
					handler : function() {
						me.close();
					}
				}];
		this.callParent(arguments);
	},

	saveItems : function() {
		var me = this;
		var instVal = me.down('combobox[itemId=instCombo]').value;
		var statCodeVal = me.down('textfield[itemId=statCodeTextField]').value;
		var higDenVal = me.down('textfield[itemId=highestDenomTextField]').value;

		$('#instNmbrGeneration').val(instVal);
		$('#stationaryCode').val(statCodeVal);
		$('#highestDenomCode').val(higDenVal);
	},

	toggleCheckUncheck : function(field, flag) {
		if (field.checked) {
			$('#' + flag).val('Y');
		} else {
			$('#' + flag).val('N');
		}
	},
	setCheckUncheckParamIcons : function(checkEl, flagVal) {
		if (flagVal == "Y") {
			checkEl.setValue(true);
		} else {
			checkEl.setValue(false);
		}
	},
	setInitialValues : function() {
		var me = this;
		me.down('combobox[itemId=instCombo]').setValue(instNmbrGenerationVal);
		me.down('textfield[itemId=statCodeTextField]')
				.setValue(stationaryCodeVal);
		me.down('textfield[itemId=highestDenomTextField]')
				.setValue(highestDenomCodeVal);

		var clientendPrintingCheck = me
				.down('checkboxfield[itemId=clientendPrintingCheck]');
		var paperAdviceReqCheck = me.down('checkboxfield[itemId=paperAdviceReqCheck]');
		var denominationApplicableCheck = me
				.down('checkboxfield[itemId=denominationApplicableCheck]');
		var backdatedInstAllowCheck = me
				.down('checkboxfield[itemId=backdatedInstAllowCheck]');
		var refundAtStaleCheck = me.down('checkboxfield[itemId=refundAtStaleCheck]');

		me.setCheckUncheckParamIcons(clientendPrintingCheck,
				clientendPrintingFlagVal);
		me.setCheckUncheckParamIcons(paperAdviceReqCheck, paperAdviceReqVal);
		me.setCheckUncheckParamIcons(denominationApplicableCheck,
				denominationApplicableVal);
		me.setCheckUncheckParamIcons(backdatedInstAllowCheck,
				backdatedInstAllowVal);
		me.setCheckUncheckParamIcons(refundAtStaleCheck, refundAtStaleVal);
		
		if (modeVal == 'VIEW') {
			me.down('combobox[itemId=instCombo]').setDisabled(true);
			me.down('textfield[itemId=statCodeTextField]').setDisabled(true);
			me.down('textfield[itemId=highestDenomTextField]').setDisabled(true);
			clientendPrintingCheck.setDisabled(true);
			paperAdviceReqCheck.setDisabled(true);
			denominationApplicableCheck.setDisabled(true);
			backdatedInstAllowCheck.setDisabled(true);
			refundAtStaleCheck.setDisabled(true);
		}
	}
});