Ext.define('GCP.view.PositivePayIssuancePopUp', {
	extend : 'Ext.window.Window',
	requires : [],
	xtype : 'positivePayIssuancePopUp',
	width : 540,
	minHeight : 450,
	autoScroll : true,
	closeAction : 'destroy',
	modal : true,
	cls:'t7-popup',
	title : getLabel('createNewPosPayIssuane', 'Create New Issuance'),
	config : {
		mode : null,
		layout : 'fit'
	},
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'panel',
			items : [{
						xtype : 'container',
						itemId : 'errorContainer',
						maxHeight : 150,
						layout : 'vbox',
						height : 'auto',
						margin : '0 0 10 0',
						hidden : true
					}, {
						xtype : 'container',
						cls : 'ux_padding-top-18',
						layout : 'hbox',
						flex : 1,
						items : [{
							xtype : 'container',
							layout : 'vbox',
							flex : 1,
							items : [{
								xtype : 'label',
								text : getLabel("corporation", "Corporation"),
								cls : modeVal == 'VIEW'
										? 'f13 ux_font-size14 ux_padding0060 '
										: 'f13 ux_font-size14 ux_padding0060 required'
							}, {
								xtype : 'container',
								layout : 'hbox',
								itemId : 'posPayCorpContainer',
								items : [{
									xtype : 'combo',
									itemId : 'posPayCorpCombo',
									name : 'posPayCorpCombo',
									width : 165,
									queryMode : 'local',
									fieldCls : 'xn-form-field  ',
									disabled : (modeVal == 'EDIT' || modeVal == 'VIEW'),
									triggerBaseCls : 'xn-form-trigger xn-form-trigger-first ',
									store : me.getNewStore(),
									editable : false,
									displayField : 'DESCR',
									valueField : 'CODE',
									emptyText : getLabel('select', 'Select'),
									listeners : {
										select : function(combo, records, eOpts) {
											var corpId = records[0].get('CODE');
											me.fireEvent('changeClientStore',
													corpId);
										}
									}
								}]
							}]
						}, {
							xtype : 'container',
							layout : 'vbox',
							flex : 1,
							items : [{
								xtype : 'label',
								text : getLabel("client", "Company Name"),
								cls : modeVal == 'VIEW'
										? 'f13 ux_font-size14 ux_padding0060 '
										: 'f13 ux_font-size14 ux_padding0060 required'
							}, {
								xtype : 'container',
								layout : 'hbox',
								itemId : 'posPayClientContainer',
								items : [{
									xtype : 'combo',
									itemId : 'posPayClientCombo',
									name : 'posPayClientCombo',
									width : 165,
									disabled : (modeVal == 'EDIT' || modeVal == 'VIEW'),
									queryMode : 'local',
									fieldCls : 'xn-form-field ',
									triggerBaseCls : 'xn-form-trigger xn-form-trigger-first ',
									editable : false,
									store : me.getNewStore(),
									displayField : 'DESCR',
									valueField : 'CODE',
									emptyText : getLabel('select', 'Select'),
									listeners : {
										select : function(combo, records, eOpts) {
											var clientId = records[0]
													.get('CODE');
											me.fireEvent('changeAccountsStore',
													clientId);
										}
									}
								}]
							}]
						}]
					}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'label',
					text : getLabel("account", "Account"),
					cls : modeVal == 'VIEW'
							? 'f13 ux_font-size14 ux_padding0060 '
							: 'f13 ux_font-size14 ux_padding0060 required'
				}, {
					xtype : 'container',
					layout : 'hbox',
					itemId : 'posPayAccountContainer',
					items : [{
								xtype : 'combo',
								itemId : 'posPayAccountCombo',
								name : 'posPayAccountCombo',
								width : 165,
								disabled :  modeVal == 'VIEW',
								queryMode : 'local',
								store : me.getAcountStore(),
								editable : false,						
								fieldCls : 'xn-form-field ',
								triggerBaseCls : 'xn-form-trigger xn-form-trigger-first',
								displayField : 'DESCR',
								valueField : 'CODE',
								emptyText : getLabel('select', 'Select')
							}]
				}]
			}, {
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'label',
					text : getLabel("amount", "Amount"),
					cls : modeVal == 'VIEW'
							? 'f13 ux_font-size14 ux_padding0060 '
							: 'f13 ux_font-size14 ux_padding0060 required'
				}, {
					xtype : 'container',
					layout : 'hbox',
					itemId : 'posPayAmountContainer',
					items : [{
								xtype : 'numberfield',
								width : 165,
								itemId : 'posPayAmount',
								fieldCls : 'xn-form-text w165 ',
								name : 'posPayAmount',
								hideTrigger : true,
								disabled : (modeVal == 'VIEW'),
								cls : 'ux_paddingb',
								labelWidth : 150,
								enforceMaxLength : true,
								enableKeyEvents : true,
								maxLength : 21,
								msgTarget : 'under'
							}]
				}]
			}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
						xtype : 'container',
						layout : 'vbox',
						flex : 1,
						items : [{
									xtype : 'label',
									text : getLabel("issueDate", "Issue Date"),
									cls : 'f13 ux_font-size14 ux_padding0060 '
								}, {
									xtype : 'container',
									layout : 'hbox',
									itemId : 'posPayIssueDateContainer',
									items : [{
												xtype : 'datefield',
												itemId : 'posPayIssueDateFrom',
												name : 'posPayIssueDateFrom',
												format : 'Y-m-d',
												submitFormat : 'ymd',
												hideTrigger : true,
												disabled : (modeVal == 'VIEW'),
												width : 165,
												flex : 1,
												fieldCls : 'xn-form-text w165 ',
												cls : 'date-range-font-size',
												padding : '0 3 0 0',
												editable : false,
												fieldIndex : '7'
											}]
								}]
					}, {
						xtype : 'container',
						layout : 'hbox',
						flex : 1,
						items : [{
							xtype : 'container',
							layout : 'vbox',
							items : [{
								xtype : 'label',
								text : getLabel("serialNumber", "Serial Number"),
								cls : modeVal == 'VIEW'
										? 'f13 ux_font-size14 ux_padding0060 '
										: 'f13 ux_font-size14 ux_padding0060 required'
							}, {
								xtype : 'container',
								layout : 'hbox',
								itemId : 'serialNoContainer',
								items : [{
											xtype : 'numberfield',
											width : 110,
											itemId : 'posPaySerialNumber',
											fieldCls : 'xn-form-text ',
											name : 'posPaySerialNumber',
											hideTrigger : true,
											disabled : (modeVal == 'VIEW'),
											cls : 'ux_paddingb',
											labelWidth : 115,
											enforceMaxLength : true,
											enableKeyEvents : true,
											maxLength : 10,
											msgTarget : 'under'
										}]
							}]
						}, {
							xtype : 'checkbox',
							itemId : 'posPayVoid',
							padding : '24 0 0 10',
							disabled : (modeVal == 'VIEW'),
							labelSeparator : '',
							boxLabel : getLabel('void', 'Void'),
							labelAlign : 'right',
							name : 'posPayVoid'
						}]
					}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : {
				type : 'vbox'
			},
			items : [{
						xtype : 'label',
						text : getLabel('payee', 'Payee'),
						cls : 'f13 ux_font-size14 ux_padding0060 '
					}, {
						xtype : 'container',
						layout : 'hbox',
						itemId : 'posPayPayeeContainer',
						items : [{
									xtype : 'textfield',
									margin : '0 70 0 0',
									width : 420,
									itemId : 'posPayPayee',
									disabled : (modeVal == 'VIEW'),
									name : 'posPayPayee',
									cls : 'ux_paddingb',
									maxLength : 35,
									enforceMaxLength : true,
									enableKeyEvents : true,
									msgTarget : 'under',
									maskRe : /^[a-zA-Z0-9\s]+$/
								}]
					}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : {
				type : 'vbox'
			},
			items : [{
						xtype : 'label',
						text : getLabel('description', 'Description'),
						cls : 'f13 ux_font-size14 ux_padding0060 '
					}, {
						xtype : 'container',
						layout : 'hbox',
						itemId : 'posPayDescriptionContainer',
						items : [{
									xtype : 'textfield',
									margin : '0 70 0 0',
									width : 420,
									itemId : 'posPayDescription',
									disabled : (modeVal == 'VIEW'),
									name : 'posPayDescription',
									cls : 'ux_paddingb',
									maxLength : 35,
									enforceMaxLength : true,
									enableKeyEvents : true,
									msgTarget : 'under',
									maskRe : /^[a-zA-Z0-9\s]+$/
								}]
					}]
		}, {
			xtype : 'panel',
			dockedItems : [{
				xtype : 'toolbar',
				cls : 'ux_panel-transparent-background xn-pad-10 ux_border-top',
				margin : '10 0 0 0',
				dock : 'bottom',
				items : [{
							xtype : 'button',
							itemId : 'btnCancel',
							text : getLabel('btnCancel', 'Cancel'),
							cls : 'ux_button-background-color ux_font-color-black',
							glyph : 'xf056@fontawesome',
							parent : this,
							handler : function(btn, opts) {
								me.close();
							}
						}, '->', {
							xtype : 'button',
							itemId : 'btnSaveAndAdd',
							margin : '0 0 0 120',
							text : getLabel('btnSaveAndAdd', 'Save And Add'),
							hidden : (modeVal == 'EDIT' || modeVal == 'VIEW'),
							cls : 'ux_button-background-color ux_font-color-black',
							glyph : 'xf058@fontawesome',
							parent : this,
							handler : function(btn, opts) {
								me.fireEvent('saveAndAddPositivePayAction',
										btn, opts);
							}
						}, {
							xtype : 'button',
							itemId : 'btnSave',
							margin : '0 0 0 10',
							text : getLabel('btnSave', 'Save'),
							hidden : (modeVal == 'EDIT' || modeVal == 'VIEW'),
							cls : 'ux_button-background-color ux_font-color-black',
							glyph : 'xf058@fontawesome',
							parent : this,
							handler : function(btn, opts) {
								// me.close();
								me
										.fireEvent('savePositivePayAction',
												btn, opts);
							}
						}, {
							xtype : 'button',
							itemId : 'btnUpdate',
							margin : '0 0 0 260',
							text : getLabel('btnUpdate', 'Update'),
							hidden : (modeVal == 'NEW' || modeVal == 'VIEW'),
							cls : 'ux_button-background-color ux_font-color-black',
							glyph : 'xf058@fontawesome',
							parent : this,
							handler : function(btn, opts) {
								// me.close();
								me.fireEvent('updatePositivePayAction', btn,
										opts);
							}
						}]
			}]
		}];
		me.callParent(arguments);
	},
	getNewStore : function() {
		var store = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					autoLoad : true,
					data : [{
								"CODE" : "",
								"DESCR" : "Select"
							}]
				});
		return store;
	},
	getAcountStore : function(){
		var store = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					autoLoad : true,
					data : [{
								"CODE" : "",
								"DESCR" : "Select"
							}]
				});
		return store;	
	}
});