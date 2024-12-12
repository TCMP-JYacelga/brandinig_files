Ext.define('CPON.view.AddEditViewRulePopup', {
	extend : 'Ext.window.Window',
	xtype : 'addEditViewRulePopup',
	modal : true,
	title : getLabel('addEditViewRule', 'Add ( Edit / View ) Rule'),
	width : 380,
	height : 380,
	layout : 'hbox',
	initComponent : function() {
		var me = this;
		var ruleTypeStore = Ext.create('Ext.data.Store', {
			fields : [ 'name', 'value' ],
			data : [ {
				"name" : "Auto Action",
				"value" : "AA"
			}, {
				"name" : "Auto Auth for Action Taken",
				"value" : "AT"
			} ]
		});
		var reqStore = Ext.create('Ext.data.Store', {
			fields : [ 'name', 'value' ],
			data : [ {
				"name" : "Live",
				"value" : "LV"
			}, {
				"name" : "Return",
				"value" : "RT"
			}, {
				"name" : "NOC",
				"value" : "NC"
			}, {
				"name" : "Refuse NOC",
				"value" : "RN"
			}, {
				"name" : "Dishonour Return",
				"value" : "DR"
			}, {
				"name" : "PreNote",
				"value" : "PN"
			}, {
				"name" : "Contested Return",
				"value" : "CR"
			} ]
		});
		var actStore = Ext.create('Ext.data.Store', {
			fields : [ 'name', 'value' ],
			data : [ {
				"name" : "Accept",
				"value" : "AC"
			}, {
				"name" : "Return",
				"value" : "RT"
			}, {
				"name" : "NOC with NOC Code",
				"value" : "NC"
			}, {
				"name" : "Dishonour Return",
				"value" : "DR"
			}, {
				"name" : "Return Fee Entry",
				"value" : "RF"
			}, {
				"name" : "Refuse NOC",
				"value" : "RR"
			}, {
				"name" : "NOC with NOC Code",
				"value" : "NC"
			}, {
				"name" : "Contested Return",
				"value" : "CR"
			} ]

		});
		var partyStore = Ext.create('Ext.data.Store', {
			fields : [ 'name', 'value' ],
			data : [ {
				"name" : "BW",
				"value" : "BW"
			}, {
				"name" : "Wl",
				"value" : "Wl"
			}, {
				"name" : "both",
				"value" : "BO"
			}, {
				"name" : "none",
				"value" : "NO"
			} ]
		});
		me.items = [
				{
					xtype : 'panel',
					itemId : 'leftPanel',
					layout : 'vbox',
					padding : '5 5 5 5',
					// width : 200,
					// height : 100
					items : [
							{
								xtype : 'textfield',
								fieldLabel : getLabel('ruleName', 'Rule Name'),
								itemId : 'ruleName',
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								margin : '5 5 5 5'
							},
							{
								xtype : 'panel',
								itemId : 'checkPanel',
								layout : 'hbox',
								items : [{
											xtype : 'checkbox',
											itemId : 'debitcbox',
											margin : '0 0 0 10',
											labelSeparator : '',
											labelWidth : 15
										 },{
											xtype : 'label',
											text : getLabel('dr.','Dr.'),
											margin : '5 0 0 5'
										 },{
											xtype : 'checkbox',
											itemId : 'creditcbox',
											margin : '0 0 0 20',
											labelSeparator : '',
											labelWidth : 15
										 },{
											xtype : 'label',
											text : getLabel('cr.','Cr.'),
											margin : '5 0 0 5'
										 }]
							},
							{
								xtype : 'combo',
								fieldLabel : getLabel('forRequestTypeOf',
										'for request type of,'),
								labelAlign : 'top',
								labelCls : 'frmLabel',
								cls: 'ux_trigger-height',
								editable : false,
								itemId : 'reqType',
								store : reqStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								margin : '5 5 5 5'
							},
							{
								xtype : 'container',
								layout : 'vbox',
								margin : '5 5 5 5',
								items : [
										{
											xtype : 'label',
											cls : 'frmLabel',
											text : getLabel('andOrAmountIs',
													'and / or amount is,')
										}, {
											xtype : 'container',
											layout : 'hbox',
											items : [ {
												xtype : 'combo',
												width : 40,
												store : [ "<", ">", "=" ],
												editable : false,
												itemId : 'operator',
												cls: 'ux_trigger-height',
												margin : '0 5 0 0'
											}, {
												xtype : 'textfield',
												itemId : 'amount',
												width : 100
											} ]
										} ]
							},
							{
								xtype : 'combo',
								fieldLabel : getLabel('actionToTake',
										'Action to be taken,'),
								labelCls : 'frmLabel',
								labelAlign : 'top',
								itemId : 'action',
								editable : false,
								cls: 'ux_trigger-height',
								store : actStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								margin : '5 5 5 5'
							} ]
				},
				{
					xtype : 'panel',
					itemId : 'rightPanel',
					layout : 'vbox',
					padding : '5 5 5 15',
					// width : 200,
					// height : 100,
					items : [
							{
								xtype : 'combo',
								fieldLabel : getLabel('ruleType', 'Rule Type'),
								labelAlign : 'top',
								labelCls : 'frmLabel',
								editable : false,
								itemId : 'ruleType',
								store : ruleTypeStore,
								cls: 'ux_trigger-height',
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								margin : '5 5 5 5'
							},
							{
								xtype : 'combo',
								fieldLabel : getLabel('wherePartyIs',
										'Where Party Is'),
								labelAlign : 'top',
								labelCls : 'frmLabel',
								itemId : 'whereParty',
								editable : false,
								cls: 'ux_trigger-height',
								store : partyStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								margin : '23 5 5 5'
							},
							{
								xtype : 'combo',
								fieldLabel : getLabel('underSecCode',
										'Under Sec Code,'),
								labelAlign : 'top',
								labelCls : 'frmLabel',
								cls: 'ux_trigger-height',
								itemId : 'usCode',
								labelSeparator : '',
								margin : '5 5 5 5'
							}, {
								xtype : 'textfield',
								labelCls : 'frmLabel',
								fieldLabel : getLabel('priority', 'Priority'),
								labelAlign : 'top',
								itemId : 'priority',
								labelSeparator : '',
								margin : '5 5 5 5'
							} ]
				} ];
		me.buttons = [ {
			xtype : 'button',
			text : getLabel('save', 'Save'),
			cls : 'xn-button ux_button-background-color ux_cancel-button',
			glyph : 'xf0c7@fontawesome',
			itemId : 'saveButton',
			handler : function() {
				me.fireEvent("submitRule", me);
				me.close();
			}
		} ];
		this.callParent(arguments);
	}
});
