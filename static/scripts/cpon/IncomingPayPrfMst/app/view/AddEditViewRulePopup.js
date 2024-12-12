Ext.define('GCP.view.AddEditViewRulePopup', {
			extend : 'Ext.window.Window',
			xtype : 'addEditViewRulePopup',
			modal : true,
			title : getLabel('addEditViewRule','Add ( Edit / View ) Rule'),
			width : 380,
			height : 380,
			layout : 'hbox',
			initComponent : function() {
				var me = this;
				var ruleTypeStore = Ext.create('Ext.data.Store', {
						fields: ['name', 'value'],
						data : [
							{"name":"Auto Action", "value":"AA"},
							{"name":"Auto Auth for Action Taken", "value":"AT"}]
					});
				var reqStore = Ext.create('Ext.data.Store', {
						fields: ['name', 'value'],
						data : [
							{"name":"Live", "value":"LV"},
							{"name":"Return", "value":"RT"},
							{"name":"NOC", "value":"NC"},
							{"name":"Refuse NOC", "value":"RN"},
							{"name":"Dishonour Return", "value":"DR"},
							{"name":"PreNote", "value":"PN"},
							{"name":"Contested Return", "value":"CR"}]
					});
				var actStore = Ext.create('Ext.data.Store', {
						fields: ['name', 'value'],
						data : [
							{"name":"Accept", "value":"AC"},
							{"name":"Return", "value":"RT"},
							{"name":"NOC with NOC Code", "value":"NC"},
							{"name":"Dishonour Return", "value":"DR"},
							{"name":"Return Fee Entry", "value":"RF"},
							{"name":"Refuse NOC", "value":"RR"},
							{"name":"NOC with NOC Code", "value":"NC"},
							{"name":"Contested Return", "value":"CR"}]
					
					});
				var partyStore = Ext.create('Ext.data.Store', {
						fields: ['name', 'value'],
						data : [
							{"name":"BW", "value":"BW"},
							{"name":"Wl", "value":"Wl"},
							{"name":"both", "value":"BO"},
							{"name":"none", "value":"NO"}]
					});		
					me.items = [{
								xtype : 'panel',
								itemId : 'leftPanel',
								layout : 'vbox',
								padding : '5 5 5 5',
								//width : 200,
								//height : 100
								items : [{
									xtype : 'textfield',
									fieldLabel : getLabel('ruleName','Rule Name'),
									itemId : 'ruleName',
									labelAlign : 'top',
									labelSeparator : '',
									margin : '5 5 5 5'
								},
								{
									xtype : 'container',
									layout : 'hbox',
									margin : '5 5 5 5',
									itemId : 'crDrPanel',
									items : [{
										xtype : 'checkboxfield',
										boxLabel : getLabel('dr','Dr.'),
										itemId : 'debit',
										margin : '0 5 0 0'
									},{
										xtype : 'checkboxfield',
										boxLabel : getLabel('cr','Cr.'),
										itemId : 'credit',
										margin : '0 5 0 0'
									}]
									
								},{
									xtype : 'combo',
									fieldLabel : getLabel('forRequestTypeOf','for request type of,'),
									labelAlign : 'top',
									editable : false,
									itemId : 'reqType',
									store : reqStore,
									displayField : 'name',
									valueField : 'value',
									labelSeparator : '',
									margin : '5 5 5 5'
								},{
									xtype : 'container',
									layout : 'vbox',
									margin : '5 5 5 5',
									items : [{
										xtype : 'label',
										text : getLabel('andOrAmountIs','and / or amount is,')
									},{
										xtype : 'container',
										layout : 'hbox',
										items : [{
												xtype : 'combo',
												width : 40,
												store:["<",">","="],
												editable : false,
												itemId : 'operator',
												margin : '0 5 0 0'
											},{
												xtype : 'textfield',
												itemId : 'amount',
												width : 100
											}
										]
									}]
								},{
									xtype : 'combo',
									fieldLabel : getLabel('actionToTake','Action to be taken,'),
									labelAlign : 'top',
									itemId : 'action',
									editable : false,
									store : actStore,
									displayField : 'name',
									valueField : 'value',
									labelSeparator : '',
									margin : '5 5 5 5'
								}]
							},{
								xtype : 'panel',
								itemId : 'rightPanel',
								layout : 'vbox',
								padding : '5 5 5 15',
								//width : 200,
								//height : 100,
								items :[{
									xtype : 'combo',
									fieldLabel : getLabel('ruleType','Rule Type'),
									labelAlign : 'top',
									editable : false,
									itemId : 'ruleType',
									store : ruleTypeStore,
									displayField : 'name',
									valueField : 'value',
									labelSeparator : '',
									margin : '5 5 5 5'
								},{
									xtype : 'container',
									layout : 'hbox',
									margin : '5 5 5 5',
									padding : '5 5 5 5',
									itemId : 'crDrPanel',
									items : [{
										xtype : 'label',
										margin : '0 5 0 0'
									},{
										xtype : 'label',
										margin : '0 5 0 0'
  									 }]
									
								},{
									xtype : 'combo',
									fieldLabel : getLabel('wherePartyIs','Where Party Is'),
									labelAlign : 'top',
									itemId : 'whereParty',
									editable : false,
									store : partyStore,
									displayField : 'name',
									valueField : 'value',
									labelSeparator : '',
									margin : '15 5 5 5'
								},{
									xtype : 'combo',
									fieldLabel : getLabel('underSecCode','Under Sec Code,'),
									labelAlign : 'top',
									itemId : 'usCode',
									labelSeparator : '',
									margin : '5 5 5 5'
								},{
									xtype : 'textfield',
									fieldLabel : getLabel('priority','Priority'),
									labelAlign : 'top',
									itemId : 'priority',
									labelSeparator : '',
									margin : '5 5 5 5'
								},
								{
									xtype: 'hiddenfield',
									name: 'recordKeyNo',
									itemId : 'recordKeyNo'
								}]
							}];
				me.buttons = [{
							xtype : 'button',
							text : getLabel('save', 'Save'),
							cls : 'xn-button',
							handler : function() {
								me.fireEvent("submitRule", me);
								me.close();
							}
						}];
				this.callParent(arguments);
				//this.down('textfield[itemId=priority]').setValue("333");
			}
		});
