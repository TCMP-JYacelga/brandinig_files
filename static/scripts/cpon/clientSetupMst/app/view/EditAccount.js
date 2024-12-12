Ext.define('GCP.view.EditAccount', {
	extend : 'Ext.window.Window',
	xtype : 'editAccountPopup',
	modal : true,
	title : getLabel('accountDetails', 'Account Details'),
	width : 570,
	height : 370,
	layout : 'column',
	config : {
		productName : null,
		productCode : null
	},
	initComponent : function() {
		var me = this;
		var accountStore = Ext.create(
		'Ext.data.Store',
		{
			fields : [ 'name', 'value' ],
			proxy : {
				type : 'ajax',
				url : 'cpon/clientServiceSetup/fscEnabledAccounts.json?id='
														+ encodeURIComponent(parentkey),
				actionMethods : {
					create : "POST",
					read : "POST",
					update : "POST",
					destroy : "POST"
				},
				reader : {
					type : 'json',
					root : 'd.filter'
				}
			},
			autoLoad : true
		});
		me.items = [
				{
					xtype : 'panel',
					itemId : 'leftPanel',
					columnWidth: 0.5,
					layout : 'vbox',
					padding: '0 10 0 0',
					items : [
							{
								xtype : 'textfield',
								fieldLabel : getLabel('fscScmProduct', 'SCF Package'),
								itemId : 'scmProduct',
								value : me.productName,
								labelAlign : 'top',
								readOnly : 'true',
								labelSeparator : '',
								width: '100%',
								fieldCls : 'xn-form-text',
								name : me.productCode
							},
							{
								xtype : 'combo',
								fieldLabel : getLabel('ldAccount',
										'Loan Disbursal Account'),
								labelAlign : 'top',
								editable : false,
								itemId : 'ldAccount',
								store : accountStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								width: '100%',
								name : 'CL_LOAN_DISB'
							},
							{
								xtype : 'combo',
								fieldLabel : getLabel('preAccount',
										'Preshipment Loan Account'),
								labelAlign : 'top',
								editable : false,
								itemId : 'preAccount',
								store : accountStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								width: '100%',
								name : 'CL_PRE_LOAN'
							},
							{
								xtype : 'combo',
								fieldLabel : getLabel('icsAccount',
										'Invoice Collection Susp A/C'),
								labelAlign : 'top',
								itemId : 'icsAccount',
								editable : false,
								store : accountStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								width: '100%',
								name : 'CL_INV_COSUS'
							},
							{
								xtype : 'combo',
								fieldLabel : getLabel('idAccount',
										' Interest Debit Account'),
								labelAlign : 'top',
								itemId : 'idAccount',
								editable : false,
								store : accountStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								width: '100%',
								name : 'CL_INT_DEBIT'
							} ]
				},
				{
					xtype : 'panel',
					itemId : 'rightPanel',
					layout : 'vbox',
					columnWidth: 0.5,
					padding : '0 0 0 10',
					items : [
							{
								xtype : 'combo',
								fieldLabel : getLabel('plAccount', 'Postshipment Loan Account'),
								labelAlign : 'top',
								editable : false,
								itemId : 'plAccount',
								store : accountStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								width: '100%',
								name : 'CL_POS_LOAN'
							},							
							{
								xtype : 'combo',
								fieldLabel : getLabel('sTaxAccount',
										'Service Tax Account'),
								labelAlign : 'top',
								itemId : 'sTaxAccount',
								editable : false,
								store : accountStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								width: '100%',
								name : 'CL_CF_STAX'  
							},
							{
								xtype : 'combo',
								fieldLabel : getLabel('invCollAccount',
										'Invoice Collection Account'),
								labelAlign : 'top',
								itemId : 'invCollAccount',
								editable : false,
								store : accountStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								width: '100%',
								name : 'CL_INV_COLL'  
							},							
							{
								xtype : 'combo',
								fieldLabel : getLabel('commAccount',
										'Charge Account'),
								labelAlign : 'top',
								itemId : 'commAccount',
								editable : false,
								store : accountStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								width: '100%',
								name : 'CL_COMM'  
							},
							{
								xtype : 'combo',
								fieldLabel : getLabel('cfEduCessAccount',
										'Education Cess Account'),
								labelAlign : 'top',
								itemId : 'cfEduCessAccount',
								editable : false,
								store : accountStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								width: '100%',
								name : 'CL_CF_EDUCESS'  
							}]
				} ];
		me.buttons = [ {
			xtype : 'button',
			text : getLabel('cancel', 'Cancel'),
			cls : 'xn-button',
			itemId : 'cancelButton',
			handler : function() {
				me.close();
			}
		} ];
		this.callParent(arguments);
	}
});
