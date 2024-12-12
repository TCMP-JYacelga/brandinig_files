Ext.define('GCP.view.AddAccountPopupView', {
	extend : 'Ext.window.Window',
	requires : ['Ext.button.Button', 'Ext.form.Label',
			'Ext.container.Container', 'Ext.form.field.Text', 'Ext.data.Store',
			'Ext.form.field.ComboBox'],
	xtype : 'addAccountPopupView',
	title : getLabel('accountDetails', 'Account Details'),
	height : 320,
	width : 500,
	modal : true,
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;

		var bankStore = Ext.create('Ext.data.Store', {
					fields : ['name', 'value'],
					proxy : {
						type : 'ajax',
						url : 'cpon/cponseek/bankSeek.json',
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					},
					autoLoad : true
				});
		var ccyStore = Ext.create('Ext.data.Store', {
					fields : ['name', 'value'],
					proxy : {
						type : 'ajax',
						url : 'cpon/cponseek/ccySeek.json',
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					},
					autoLoad : true
				});
		var accTypeStore = Ext.create('Ext.data.Store', {
					fields : ['name', 'value'],
					proxy : {
						type : 'ajax',
						url : 'cpon/cponseek/accTypeSeek.json',
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					},
					autoLoad : true
				});
		var accSubTypeStore = Ext.create('Ext.data.Store', {
					fields : ['name', 'value'],
					proxy : {
						type : 'ajax',
						url : 'cpon/cponseek/accSubTypeSeek.json',
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					},
					autoLoad : true
				});

		me.items = [{
			xtype : 'container',
			layout : 'vbox',
		items : [{
			xtype : 'container',
			layout : 'hbox',
			items : [{
						xtype : 'textfield',
						itemId : 'accNo',
						fieldCls : 'w14',
						padding : '0 5 0 0',
						fieldLabel : getLabel('accountNumber', 'Account'),
						labelSeparator : '',
						labelAlign : 'top'
					}, {
						xtype : 'combo',
						value : 'CCY',
						displayField : 'name',
						editable : false,
						valueField : 'value',
						store : ccyStore,
						fieldCls : 'popup-form-field w3',
						triggerBaseCls : 'popup-form-trigger',
						itemId : 'accCcy',
						padding : '17 70 0 0',
						allowBlank : false
					}, {
						xtype : 'textfield',
						itemId : 'accName',
						fieldCls : 'w14',
						fieldLabel : getLabel('accountName', 'Account Name'),
						labelSeparator : '',
						labelAlign : 'top'

					}]
		}, {
			xtype : 'container',
			layout : 'hbox',

			items : [{
						xtype : 'combo',
						displayField : 'name',
						valueField : 'value',
						store : bankStore,
						fieldCls : 'popup-form-field w12',
						triggerBaseCls : 'popup-form-trigger',
						itemId : 'accBank',
						padding : '0 137 0 0',
						editable : false,
						fieldLabel : getLabel('bank', 'Bank'),
						labelSeparator : '',
						labelAlign : 'top'
					}, {
						xtype : 'textfield',
						itemId : 'accIBAN',
						fieldCls : 'w14',
						fieldLabel : getLabel('iban', 'IBAN'),
						labelSeparator : '',
						labelAlign : 'top'

					}]
		}, {
			xtype : 'container',
			layout : 'hbox',

			items : [{
						xtype : 'combo',
						displayField : 'name',
						valueField : 'value',
						store : accTypeStore,
						fieldCls : 'popup-form-field w12',
						triggerBaseCls : 'popup-form-trigger',
						itemId : 'accType',
						padding : '0 137 0 0',
						editable : false,
						fieldLabel : getLabel('accountType', 'Account Type'),
						labelSeparator : '',
						labelAlign : 'top'
					}, {
						xtype : 'combo',
						displayField : 'name',
						valueField : 'value',
						store : accSubTypeStore,
						fieldCls : 'popup-form-field w12',
						triggerBaseCls : 'popup-form-trigger',
						itemId : 'accSubType',
						editable : false,
						fieldLabel : getLabel('accountSubtype',
								'Account Sub Type'),
						labelSeparator : '',
						padding : '0 17 0 0',
						labelAlign : 'top'
					}]
		}, {
			xtype : 'container',
			layout : 'hbox',
			items : [{
						xtype : 'textfield',
						itemId : 'accMinBalance',
						fieldCls : 'w14',
						padding : '0 117 0 0',
						fieldLabel : getLabel('minbalance', 'Min. Balance'),
						labelSeparator : '',
						labelAlign : 'top'
					}, {
						xtype : 'textfield',
						itemId : 'accMaxBalance',
						fieldCls : 'w14',
						fieldLabel : getLabel('maxbalance', 'Max. Balance'),
						labelSeparator : '',
						labelAlign : 'top'

					}]
			}]
		}, {
			xtype : 'container',
			width : '100%',
			padding : '10 0 0 0',
			items : [{
						xtype : 'checkboxgroup',
						fieldLabel : getLabel('accountUsage', 'Account Usage'),
						columns : 3,
						width : '90%',
						padding : '10 0 0 5',
						columnWidth: '10%',
						vertical: true,
						items : [{
									boxLabel : getLabel('br', 'BR'),
									name : 'options',
									itemId : 'chkBR',
									inputValue : 'opt'
								}, {
									boxLabel : getLabel('payments', 'Payments'),
									name : 'options',
									itemId : 'chkPay',
									inputValue : 'opt'
								}, {
									boxLabel : getLabel('charges', 'Charges'),
									name : 'options',
									itemId : 'chkChg',
									inputValue : 'opt'
								}]
					}]
		}];

		me.buttons = [{
					xtype : 'button',
					text : getLabel('cancel', 'Cancel'),
					cls : 'xn-button',
					handler : function() {
						me.close();
					}},
					{
					xtype : 'button',
					text : getLabel('save', 'Save'),
					itemId : 'btnSaveAccount',
					cls : 'xn-button',
					handler : function() {
						me.fireEvent('saveAccountEntry');
					}
				}];
		this.callParent(arguments);
	}
});