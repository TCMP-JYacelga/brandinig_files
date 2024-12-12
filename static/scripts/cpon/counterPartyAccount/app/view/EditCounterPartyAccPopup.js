Ext.define('CPON.view.EditCounterPartyAccPopup',{
					extend : 'Ext.window.Window',
					xtype : 'editCounterPartyAccPopup',
					requires : ['Ext.form.ComboBox','Ext.container.Container','Ext.form.field.Text'],
					width : 600,
					autoHeight : true,
					modal : true,
					padding : '10 5 5 10',
					draggable : true,
					config : {
						accName : null,
						scmProduct : null,
						mode : null,
						identifier : null
					},
					autoScroll : true,
					layout : 'fit',
					title : getLabel('editAccountDetails','Edit Account Details'),
					initComponent : function() {
						var me = this;
						if ('VIEW' === me.mode)
						 this.title = "View Account Details";
						
						var accountTypeStore = Ext
								.create(
										'Ext.data.Store',
										{
											fields : [ 'name', 'value' ],
											proxy : {
												type : 'ajax',
												url : 'services/counterPartyMstSeek/accTypeSeek.json',
												reader : {
													type : 'json',
													root : 'filterList'
												}
											},
											autoLoad : true
										});
										
						var accountSubTypeStore = Ext.create('Ext.data.Store',{
											fields : [ 'name', 'value' ],
											proxy : {
												type : 'ajax',
												url : 'services/counterPartyMstSeek/counterpartyAccSubTypeSeek.json',
												reader : {
													type : 'json',
													root : 'filterList'
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
												url : 'cpon/counterPartyMst/currencyList.json',
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
										url : 'cpon/counterPartyMst/branchCodeList.json?id='
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
						
						var accountStore = Ext
						.create(
								'Ext.data.Store',
								{							
									fields : [ 'name', 'value' ],
									proxy : {
										type : 'ajax',
										url : 'cpon/counterPartyMst/AccountList.json?id='
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

						var defaultCurrencyComboBoxView = Ext.create(
								'Ext.form.ComboBox', {
									store : ccyStore,
									itemId : 'defaultCcyCombo',
									fieldLabel: 'CCY',
									labelAlign : 'top',
									fieldCls : 'xn-form-field',
									labelCls : 'frmLabel',
									labelSeparator:'',
									triggerBaseCls : 'xn-form-trigger',
									queryMode : 'local',
									displayField : 'value',
									valueField : 'value',
									padding : '2 0 0 4',
									editable : false,
									width:'37%'
								});
						
						var defaultBranchComboBoxView = Ext.create(
								'Ext.form.ComboBox', {
									store : branchStore,
									fieldLabel : getLabel('sellerBankBranch', 'Seller Bank Branch'),
									labelAlign : 'top',
									itemId : 'defaultBranchTypeCombo',
									fieldCls : 'xn-form-field w13',
									triggerBaseCls : 'xn-form-trigger',
									labelSeparator:'',
									queryMode : 'local',
									labelCls : 'frmLabel',
									displayField : 'name',
									valueField : 'value',
									padding : '5 17 0 0',
									editable : false
								});
						var defaultAccountComboBoxView = Ext.create(
								'Ext.form.ComboBox', {
									store : accountStore,
									fieldLabel : getLabel('accountNumber', 'Account Number'),									
									labelAlign : 'top',
									itemId : 'defaultAccountCombo',
									fieldCls : 'xn-form-field',
									labelCls : 'frmLabel',
									triggerBaseCls : 'xn-form-trigger',
									labelSeparator:'',
									queryMode : 'local',
									displayField : 'name',
									valueField : 'value',
									padding : '2 4 0 0',
									editable : false,
									width:'62%'
								});
								
						me.items = [
						{
							xtype:'container',
							layout: {
							type: 'hbox',
							align: 'center'
							},
							width:'100%',
							items:[
							{
								xtype:'container',
								layout: {
								type: 'vbox',
								align: 'left'
								},
								flex:0.5,
								defaults:{
								labelSeparator:''	
								},
								items:[
								 {
						            		xtype : 'textfield',
						            		fieldLabel : getLabel('accountName', 'Account Name'),
						            		labelAlign : 'top',
						            		width : 176,
						            		enforceMaxLength : true,
						            		labelCls : 'frmLabel',
						            		maxLength : 10,
						            		itemId : 'accNameField',
						            		value: me.accName,
						            		disabled: true,
						            		 padding : '5 0 0 0'
						            },
						            
						            {
						            	xtype:'container',
						            	layout: {
										type: 'hbox',
										align: 'left'
										},
						            	width:'100%',
						            	items:[
						            	  defaultAccountComboBoxView,defaultCurrencyComboBoxView	            	
						            	]
						            },
						             {
						            		xtype : 'textfield',
						            		labelCls : 'frmLabel',
						            		fieldLabel : getLabel('sellerBankName','Seller Bank Name'),
						            		labelAlign : 'top',
						            		width : 176,
						            		enforceMaxLength : true,
						            		maxLength : 10,
						            		itemId : 'sellerBankName',
						            		value: me.bankName,
						            		disabled: false,
						            		 padding : '5 0 0 0'
						            }
								]
								
							},
							{
								xtype:'container',
								layout: {
								type: 'vbox',
								align: 'center'
								},
								flex:0.5,
								defaults:{
								labelSeparator:''	
								},
								items:[
								{
					            			xtype : 'textfield',
					            			fieldLabel : getLabel('scmProduct', 'SCF Package'),
					            			labelAlign : 'top',
					            			labelCls : 'frmLabel',
					            			width : 176,
					            			enforceMaxLength : true,
					            			maxLength : 10,
					            			itemId : 'productDescField',
					            			padding : '5 0 0 0',
					            			value: me.scmProduct,
					            			disabled: true
					            			
						            },{
						            xtype:'container',
						            layout:{
						            	type:'hbox',
						            	align:'left'
						            },
						            items:[
						            
						            ]
						            },
						             {
					            		xtype : 'textfield',
					            		fieldLabel : getLabel('accDesc', 'Account Description'),
					            		labelAlign : 'top',
					            		width : 176,
					            		labelCls : 'frmLabel',
					            		enforceMaxLength : true,
					            		value:me.accDesc,
					            		maxLength : 10,
					            		itemId : 'accDescField',
					            		padding : '5 0 0 0'
					                },
					                {
						            xtype:'container',
						            layout:{
						            	type:'hbox',
						            	align:'left'
						            },
						            items:[
						            defaultBranchComboBoxView
						            ]
						            }
					                
					                /*{
						            		xtype : 'textfield',
						            		fieldLabel : getLabel('branch','Branch'),
						            		labelAlign : 'top',
						            		width : 176,
						            		enforceMaxLength : true,
						            		maxLength : 10,
						            		itemId : 'accNameField',
//						            		value: me.accName,
//						            		disabled: true,
						            		 padding : '5 0 0 0'
						            }*/
								
								]
							}
							
							]
							
						}];
						            
						if ('VIEW' === me.mode) {
							me.buttons = [ {
								xtype : 'button',
								text : getLabel('cancel', 'Cancel'),
								cls : 'ux_button-background-color ux_button-padding',
								handler : function() {
									me.close();
								}
							} ];
						} else {
							me.buttons = [
									{
										xtype : 'button',
										text : getLabel('cancel', 'Cancel'),
										glyph : 'xf056@fontawesome',
										cls : 'ux_button-background-color ux_button-padding',
										handler : function() {
											me.close();
										}
									},
									{
										xtype : 'button',
										text : getLabel('submit', 'Submit'),
										itemId : 'btnSubmitCFAccount',
										glyph : 'xf058@fontawesome',
										cls : 'ux_button-background-color ux_button-padding',
										handler : function() {
											this.fireEvent(
													"submitUpdateCFAccount",
													me.identifier);
										}
									} ];

						}
						me.callParent(arguments);

					}

				});