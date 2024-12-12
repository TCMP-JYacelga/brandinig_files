Ext.define('GCP.view.AccountAssignmentPopup', {
			extend : 'Ext.window.Window',
			xtype : 'accountAssignmentPopup',
			requires : ['Ext.data.Store','Ext.form.Panel'],
			modal : true,
			draggable : true,
			autoScroll : true,
			layout : 'hbox',
			config : {
			mode : null,
			identifier : null
			},
			initComponent : function() {
				var me = this;
				
				if ('ADD' == me.mode)
				{
					this.title = getLabel('addWorkflowToAccount',
						'Add Approval Matrix to Account');
				}
				else if ('EDIT' == me.mode)
				{
					this.title = getLabel('editWorkflowToAccount',
						'Edit Approval Matrix to Account');
				}
				var accountStore = Ext.create('Ext.data.Store', {
							fields : ['accountNmbr', 'accountName', 'accountCcyCode', 'displayField'],
							proxy : {
								type : 'ajax',
								url : 'services/approvalWorkflow/accountList.json?id='
										+ encodeURIComponent(matrixId),
								reader : {
									type : 'json',
									root : 'd.accounts'
								},
								actionMethods : {
									create : "POST",
									read : "POST",
									update : "POST",
									destroy : "POST"
								}
							},
							autoLoad : true
						});
				var matrixStore = Ext.create('Ext.data.Store', {
							fields : ['axmCode', 'axmName'],
							proxy : {
								type : 'ajax',
								url : 'services/approvalWorkflow/matrixList.json?id='
										+ encodeURIComponent(matrixId),
								reader : {
									type : 'json',
									root : 'matrices'
								},
								actionMethods : {
									create : "POST",
									read : "POST",
									update : "POST",
									destroy : "POST"
								}
							},
							autoLoad : true
						});
				var accountCombo = Ext.create('Ext.form.ComboBox', {
							fieldLabel : getLabel('accountname', 'Account Name'),
							xtype : 'accountCombo',
							width : 200,
							store : accountStore,
							itemId : 'accountCombo',
							padding : '0 5 0 0',
							fieldCls : 'xn-form-field',
							labelCls: 'frmLabel',
							triggerBaseCls : 'xn-form-trigger',
							labelSeparator : '',
							labelAlign : 'top',
							displayField : 'displayField',
							valueField : 'accountNmbr',
							emptyText : getLabel('select','Select'),
							allowBlank : false,
							editable : false
						});
				var matrixCombo = Ext.create('Ext.form.ComboBox', {
							fieldLabel : getLabel('authorizationmatrix', 'Approval Matrix'),
							xtype : 'matrixCombo',
							store : matrixStore,
							itemId : 'matrixCombo',
							padding : '0 5 0 0',
							labelCls: 'frmLabel',
							fieldCls : 'xn-form-field',
							triggerBaseCls : 'xn-form-trigger',
							labelSeparator : '',
							labelAlign : 'top',
							displayField : 'axmName',
							width : 200,
							valueField : 'axmCode',
							emptyText : getLabel('select','Select'),
							allowBlank : false,
							editable : false
						});
				this.items = [{
							xtype : 'form',
							layout : 'vbox',
							cls : 'form-pnl-cls ux_extralargemargin-bottom',
							width : 460,
							height : 150,
							items : [accountCombo, {
										xtype : 'container',
										layout : 'hbox',
										cls : 'ux_extralargepadding-top',
										items : [matrixCombo,
											{
												xtype: 'numberfield',
												allowDecimals : false,
												hideTrigger: true,
												keyNavEnabled: false,
												labelCls: 'frmLabel',
												mouseWheelEnabled: false,
												minValue: 1,
												itemId : 'txtApproversAccount',
												margin : '0 0 0 50',
												fieldLabel : getLabel('approvercount', 'No. of Aprrovers'),
												labelSeparator : '',
												labelAlign : 'top',
												width : 200,
												disabled : true
											}
										]

									}],
							bbar : ['->', 
								{
							xtype : 'button',
							padding : 4,
							margin : '2 4 0 0',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf056@fontawesome',
							handler : function() {
								me.close();
							}
						}, {
							xtype : 'button',
							padding : 4,
							margin : '2 0 0 0',
							text : getLabel('save', 'Save'),
							itemId : 'btnAccountAssignSave',
							formBind : true,
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf0c7@fontawesome',
							handler : function() {

								this.fireEvent('saveAccountAssignment',me.identifier);
							}
						}
							]
						}];
				/*this.buttons = [{
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button',
							handler : function() {
								me.close();
							}
						}, {
							xtype : 'button',
							text : getLabel('save', 'Save'),
							itemId : 'btnAccountAssignSave',
							formBind : true,
							cls : 'xn-button',
							handler : function() {

								this.fireEvent('saveAccountAssignment');
							}
						}];*/
				this.callParent(arguments);
			}
			
		});