Ext.define('GCP.view.PkgAccAssignmentPopup', {
			extend : 'Ext.window.Window',
			xtype : 'pkgAccAssignmentPopup',
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
					this.title = getLabel('addWorkflowToPackageAccount',
						'Add Approval Matrix to Package Account');
				}
				else if ('EDIT' == me.mode)
				{
					this.title = getLabel('editWorkflowToPackageAccount',
						'Edit Approval Matrix to Package Account');
				}
				var packageStore = Ext.create('Ext.data.Store', {
							fields : ['packageName','packageId'],
							proxy : {
								type : 'ajax',
								url : 'services/approvalWorkflow/packageCombinationList.json?id='
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
				var packageCombo = Ext.create('Ext.form.ComboBox', {
							fieldLabel : getLabel('paypkgname', 'Payment Package Name'),
							xtype : 'packageCombo',
							width : 200,
							store : packageStore,
							itemId : 'packageCombo',
							padding : '0 5 0 0',
							fieldCls : 'xn-form-field',
							triggerBaseCls : 'xn-form-trigger',
							emptyText : getLabel('select','Select'),
							labelSeparator : '',
							labelAlign : 'top',
							allowBlank : false,
							displayField : 'packageName',
							valueField : 'packageId',
							editable : false
						});
				var	accountStore = Ext.create('Ext.data.Store', {
							fields : ['accountNmbr', 'accountName','displayField'],
							proxy : {
								type : 'ajax',
								url : '',
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
							autoLoad:false
						});
				var accountCombo = Ext.create('Ext.form.ComboBox', {
							fieldLabel : getLabel('accountname', 'Account Name'),
							xtype : 'accountCombo',
							width : 200,
							itemId : 'cmbPkgAccount',
							store : accountStore,
							padding : '0 5 0 0',
							fieldCls : 'xn-form-field',
							triggerBaseCls : 'xn-form-trigger',
							emptyText : getLabel('select','Select'),
							labelSeparator : '',
							labelAlign : 'top',
							displayField : 'displayField',
							allowBlank : false,
							valueField : 'accountNmbr',
							editable : false
						});
				var matrixCombo = Ext.create('Ext.form.ComboBox', {
							fieldLabel : getLabel('authorizationmatrix', 'Approval Matrix'),
							xtype : 'matrixCombo',
							width : 200,
							store : matrixStore,
							itemId : 'matrixCombo',
							padding : '0 5 0 0',
							fieldCls : 'xn-form-field',
							triggerBaseCls : 'xn-form-trigger',
							emptyText : getLabel('select','Select'),
							labelSeparator : '',
							labelAlign : 'top',
							displayField : 'axmName',
							allowBlank : false,
							valueField : 'axmCode',
							editable : false
						});
				this.items = [{
							xtype : 'form',
							layout : 'vbox',
							cls : 'form-pnl-cls',
							width : 440,
							height : 200,
							items : [packageCombo, accountCombo,{
										xtype : 'container',
										layout : 'hbox',
										items : [matrixCombo,
											{
												xtype: 'numberfield',
												allowDecimals : false,
												hideTrigger: true,
												keyNavEnabled: false,
												mouseWheelEnabled: false,
												minValue: 1,
												margin : '0 0 0 50',
												fieldLabel : getLabel('approvercount', 'No. of Aprrovers'),
												labelSeparator : '',
												labelAlign : 'top',
												itemId : 'txtApproversPkgAcc',
												disabled : true
											}
										]

									}],
							bbar : ['->',{
							xtype : 'button',
							padding : 4,
							margin : '2 4 0 0',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button',
							handler : function() {
								me.close();
							}
						}, {
							xtype : 'button',
							text : getLabel('save', 'Save'),
							padding : 4,
							margin : '2 0 0 0',
							itemId : 'btnAccountAssignSave',
							cls : 'xn-button',
							formBind : true,
							handler : function() {

								this.fireEvent('savePkgAccAssignment',me.identifier);
							}
						}]
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
							cls : 'xn-button',
							handler : function() {

								this.fireEvent('saveAccountAssignment');
							}
						}];*/
				this.callParent(arguments);
			}

		});