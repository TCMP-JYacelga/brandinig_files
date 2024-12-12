Ext
		.define(
				'CPON.view.EditScmAccountPopup',
				{
					extend : 'Ext.window.Window',
					xtype : 'editScmAccountPopup',
					requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store',
							'Ext.ux.gcp.AutoCompleter','Ext.form.ComboBox' ],
					width : 600,
					autoHeight : true,
					modal : true,
					padding : '10 5 5 10',
					draggable : true,
					// closeAction : 'hide',
					cls: 'non-xn-popup',
					config : {
						accName : null,
						scmProduct : null,
						mode : null,
						identifier : null
					},
					autoScroll : true,
					layout : 'vbox',
					title : getLabel('editAccountDetails',
							'Edit Account Details'),
					initComponent : function() {
						var me = this;
						if ('VIEW' === me.mode)
						 this.title = getLabel('viewAccountDetails',
										'View Account Details');
						
						var accountTypeStore = Ext
								.create(
										'Ext.data.Store',
										{
											fields : [ 'name', 'value' ],
											proxy : {
												type : 'ajax',
												url : 'cpon/scmAccountMst/accountTypeList.json?',
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

						var ccyStore = Ext
								.create(
										'Ext.data.Store',
										{
											fields : [ 'name', 'value' ],
											proxy : {
												type : 'ajax',
												url : 'cpon/scmAccountMst/currencyList.json',
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
						
						var branchStore = Ext
						.create(
								'Ext.data.Store',
								{
									fields : [ 'name', 'value' ],
									proxy : {
										type : 'ajax',
										url : 'cpon/scmAccountMst/branchCodeList.json?id='
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

						var defaultAccountTypeComboBoxView = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'defaultAccountTypeCombo',
									store : accountTypeStore,
									fieldLabel : getLabel('accountType', 'Account Type'),
									labelAlign : 'top',
									itemId : 'defaultAccountTypeCombo',
									fieldCls : 'xn-form-field',
									triggerBaseCls : 'xn-form-trigger',
									labelSeparator:'',
									queryMode : 'local',
									displayField : 'name',
									valueField : 'value',
									padding : '5 10 0 0',
									editable : false,
									listeners : {
										scope : this
										//'select' : this.getArrangementCode
									}
								});
						var defaultCurrencyComboBoxView = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'defaultCcyCombo',
									store : ccyStore,
									itemId : 'defaultCcyCombo',
									fieldLabel: getLabel('ccy','CCY'),
									labelAlign : 'top',
									fieldCls : 'xn-form-field w3',
									triggerBaseCls : 'xn-form-trigger',
									labelSeparator:'',
									queryMode : 'local',
									displayField : 'value',
									valueField : 'value',
									padding : '5 10 0 0',
									editable : false,
									listeners : {
										scope : this
										//'select' : this.getArrangementCode
									}
								});
						
						var defaultBranchComboBoxView = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'defaultBranchTypeCombo',
									store : branchStore,
									fieldLabel : getLabel('sellerBankBranch', 'Seller Bank Branch'),
									labelAlign : 'top',
									itemId : 'defaultBranchTypeCombo',
									fieldCls : 'xn-form-field',
									triggerBaseCls : 'xn-form-trigger',
									queryMode : 'local',
									displayField : 'name',
									valueField : 'value',
									labelSeparator:'',
									padding : '5 10 0 0',
									editable : false,
									listeners : {
										scope : this
										//'select' : this.getArrangementCode
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
						}
						me.items = [
						      {
						          xtype: 'container',
						           items: [{
						            xtype: 'panel',
						            width:'auto',
						            id : 'ScmAccPanel1',
						            layout:'hbox',
						            items: [
						            {
						            		xtype : 'textfield',
						            		fieldLabel : getLabel('accountName', 'Account Name'),
						            		labelAlign : 'top',						            		
						            		width : 180,
						            		enforceMaxLength : true,
						            		labelSeparator:'',
						            		maxLength : 10,
						            		itemId : 'accNameField',
						            		value: me.accName,
						            		disabled: true,
						            		 padding : '5 10 0 0'
						            },{
					            			xtype : 'textfield',
					            			fieldLabel : getLabel('scmProduct', 'SCF Package'),
					            			labelAlign : 'top',
					            			width : 150,
					            			enforceMaxLength : true,
					            			labelSeparator:'',
					            			maxLength : 10,
					            			itemId : 'productDescField',
					            			 padding : '5 10 0 0',
					            			value: me.scmProduct,
					            			disabled: true
					            			
						            },defaultAccountTypeComboBoxView]}] },
						      {
							    xtype: 'container',
								   items: [{
								   xtype: 'panel',
								   width:'auto',
								     id : 'ScmAccPanel2',
								     layout:'hbox',
								  items: [          
						            {
					            		xtype : 'textfield',
					            		fieldLabel : getLabel('accountNumber', 'Account Number'),
					            		labelAlign : 'top',
					            		width : 160,
					            		enforceMaxLength : true,
					            		labelSeparator:'',
					            		maxLength : 20,
					            		itemId : 'accNmbrField',
					            		 padding : '5 1 0 0'
					                },defaultCurrencyComboBoxView,
					                {
					            		xtype : 'textfield',
					            		fieldLabel : getLabel('accDesc', 'Account Description'),
					            		labelAlign : 'top',
					            		width : 150,
					            		enforceMaxLength : true,
					            		labelSeparator:'',
					            		maxLength : 10,
					            		itemId : 'accDescField',
					            		 padding : '5 8 0 20'
					                },
					                defaultBranchComboBoxView]}
					               
						            ]}];
						    me.bbar = ('VIEW' === me.mode)? ['->',{
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							cls : ' ft-button ft-button-secondary',
							itemId : 'cancelBtn',
							handler : function() {
									me.close();
								} }] : [{
									xtype : 'button',
									text : getLabel('cancel', 'Cancel'),
									cls : ' ft-button ft-button-secondary',
									itemId : 'cancelBtn',
									handler : function() {
											me.close();
										}
									},'->',{
									xtype : 'button',
									text : getLabel('submit', 'Submit'),
									cls : ' ft-button ft-button-primary',
									itemId : 'btnSubmitScmAccount',
									handler : function() {
											this.fireEvent(
													"submitUpdateScmAccount",
													me.identifier);
											}
								}];
						me.callParent(arguments);
					},

					getArrangementCode : function(combo, records, eOpts) {
						var me = this;
						if (combo.itemId === "defaultCcyCombo")
							me.ruleValue = combo.getValue();
						if (combo.itemId === "defaultAccountTypeCombo")
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