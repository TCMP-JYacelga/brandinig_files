Ext
		.define(
				'GCP.view.AttachRulePriorityPopup',
				{
					extend : 'Ext.window.Window',
					xtype : 'attachRulePriorityPopup',
					requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store',
							'Ext.ux.gcp.AutoCompleter' ],
					width : 400,
					autoHeight : true,
					modal : true,
					padding : '10 5 5 10',
					draggable : true,
					// closeAction : 'hide',
					config : {
						productValue : null,
						ruleValue : null,
						mode : null,
						identifier : null
					},
					autoScroll : true,
					layout : 'vbox',
					title : getLabel('addEditRulePriority',
							'Add / Edit Rule Priority'),
					initComponent : function() {
						var me = this;
						if ('VIEW' === me.mode)
						 this.title = "View Rule Priority";
						
						var productStore = Ext
								.create(
										'Ext.data.Store',
										{
											fields : [ 'name', 'value' ],
											proxy : {
												type : 'ajax',
												url : 'cpon/clientPayment/priorityProductList.json?id='
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

						var ruleStore = Ext
								.create(
										'Ext.data.Store',
										{
											fields : [ 'name', 'value' ],
											proxy : {
												type : 'ajax',
												url : 'cpon/clientPayment/priorityRuleCodeList.json?id='
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

						var defaultProductComboBoxView = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'defaultProductCombo',
									store : productStore,
									fieldLabel : getLabel('priority.product',
											'Product'),
									labelAlign : 'left',
									itemId : 'defaultProductCombo',
									fieldCls : 'xn-form-field',
									triggerBaseCls : 'xn-form-trigger',
									queryMode : 'local',
									displayField : 'name',
									valueField : 'value',
									padding : '5 5 5 5',
									editable : false,
									listeners : {
										scope : this,
										'select' : this.getArrangementCode
									}
								});
						var defaultRuleComboBoxView = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'defaultRuleCombo',
									store : ruleStore,
									fieldLabel : getLabel('priority.rule',
											'Rule'),
									labelAlign : 'left',
									itemId : 'defaultRuleCombo',
									fieldCls : 'xn-form-field',
									triggerBaseCls : 'xn-form-trigger',
									queryMode : 'local',
									displayField : 'name',
									valueField : 'value',
									padding : '5 5 5 5',
									editable : false,
									listeners : {
										scope : this,
										'select' : this.getArrangementCode
									}
								});
						if ('ADD' === me.mode || 'VIEW' === me.mode) {

							defaultArrangementComboBoxView = Ext.create(
									'Ext.form.ComboBox', {
										xtype : 'defaultArrangementCombo',
										// store : arrangementStore,
										fieldLabel : getLabel(
												'priority.arrangement',
												'Arrangement'),
										labelAlign : 'left',
										itemId : 'defaultArrangementCombo',
										fieldCls : 'xn-form-field',
										triggerBaseCls : 'xn-form-trigger',
										queryMode : 'local',
										displayField : 'value',
										valueField : 'value',
										padding : '5 5 5 5',
										editable : false,
										disabled : true
									});
						} else {

							if (me.ruleValue != null && me.productValue != null) {
								var arrangementStore = Ext
										.create(
												'Ext.data.Store',
												{
													fields : [ 'name', 'value' ],
													proxy : {
														type : 'ajax',
														url : 'cpon/clientServiceSetup/getAllPaymentRules.json?id='
																+ encodeURIComponent(parentkey)
																+ '&$filter=product_code eq \''
																+ me.productValue
																+ '\' and rule_code eq \''
																+ me.ruleValue
																+ '\'',
														params : {
															'id' : parentkey
														},
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
													autoLoad : false
												});
							}
							defaultArrangementComboBoxView = Ext.create(
									'Ext.form.ComboBox', {
										xtype : 'defaultArrangementCombo',
										store : arrangementStore,
										fieldLabel : getLabel(
												'priority.arrangement',
												'Arrangement'),
										labelAlign : 'left',
										itemId : 'defaultArrangementCombo',
										fieldCls : 'xn-form-field',
										triggerBaseCls : 'xn-form-trigger',
										queryMode : 'local',
										displayField : 'value',
										valueField : 'value',
										padding : '5 5 5 5',
										editable : false
									});
						}
						me.items = [
								defaultProductComboBoxView,
								defaultRuleComboBoxView,
								{
									xtype : 'textfield',
									itemId : 'txtPriority',
									fieldLabel : getLabel('priority',
											'Priority'),
									editable : false,
									disabled : true,
									padding : '5 5 5 5'
								}, defaultArrangementComboBoxView ];
						if ('VIEW' === me.mode) {
							me.buttons = [ {
								xtype : 'button',
								text : getLabel('cancel', 'Cancel'),
								cls : 'xn-button',
								handler : function() {
									me.close();
								}
							} ];
						} else {
							me.buttons = [
									{
										xtype : 'button',
										text : getLabel('cancel', 'Cancel'),
										cls : 'xn-button',
										handler : function() {
											me.close();
										}
									},
									{
										xtype : 'button',
										text : getLabel('submit', 'Submit'),
										itemId : 'btnSubmitRulePriority',
										cls : 'xn-button',
										handler : function() {
											this.fireEvent(
													"submitRulePriorities",
													me.identifier);
										}
									} ];

						}
						me.callParent(arguments);
					},

					getArrangementCode : function(combo, records, eOpts) {
						var me = this;
						if (combo.itemId === "defaultRuleCombo")
							me.ruleValue = combo.getValue();
						if (combo.itemId === "defaultProductCombo")
							me.productValue = combo.getValue();
						if (me.ruleValue != null && me.productValue != null) {
							var arrangementStore = Ext
									.create(
											'Ext.data.Store',
											{
												fields : [ 'name', 'value' ],
												proxy : {
													type : 'ajax',
													url : 'cpon/clientServiceSetup/getAllPaymentRules.json?id='
															+ encodeURIComponent(parentkey)
															+ '&$filter=product_code eq \''
															+ me.productValue
															+ '\' and rule_code eq \''
															+ me.ruleValue
															+ '\'',
													params : {
														'id' : parentkey
													},
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
												autoLoad : false
											});

							defaultArrangementComboBoxView.enable();
							defaultArrangementComboBoxView.store = arrangementStore;
							defaultArrangementComboBoxView.store.load();
						}

					}

				});