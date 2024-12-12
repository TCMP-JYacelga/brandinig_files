Ext.define('GCP.view.PackageAssignmentPopup', {
			extend : 'Ext.window.Window',
			xtype : 'packageAssignmentPopup',
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
					this.title = getLabel('addWorkflowToPackage',
						'Add Approval Matrix to Package');
				}
				else if ('EDIT' == me.mode)
				{
					this.title = getLabel('editWorkflowToPackage',
						'Edit Approval Matrix to Package');
				}
				var packageStore = Ext.create('Ext.data.Store', {
							fields : ['packageName','packageId'],
							proxy : {
								type : 'ajax',
								url : 'services/approvalWorkflow/packageList.json?id='
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
							labelCls: 'frmLabel',
							labelAlign : 'top',
							displayField : 'packageName',
							valueField : 'packageId',
							allowBlank : false,
							editable : false
						});
				var matrixCombo = Ext.create('Ext.form.ComboBox', {
							fieldLabel : getLabel('authorizationmatrix', 'Approval Matrix'),
							width : 200,
							xtype : 'matrixCombo',
							store : matrixStore,
							itemId : 'matrixCombo',
							padding : '0 5 0 0',
							fieldCls : 'xn-form-field',
							triggerBaseCls : 'xn-form-trigger',
							labelSeparator : '',
							labelAlign : 'top',
							labelCls: 'frmLabel',
							displayField : 'axmName',
							emptyText : getLabel('select','Select'),
							allowBlank : false,
							valueField : 'axmCode',
							editable : false
						});
				this.items = [{
							xtype : 'form',
							layout : 'vbox',
							cls : 'form-pnl-cls ux_extralargemargin-bottom',
							width : 460,
							height : 150,
							items : [packageCombo, {
										xtype : 'container',
										layout : 'hbox',
										cls : 'ux_extralargepadding-top',
										items : [matrixCombo,
											{
												xtype: 'numberfield',
												allowDecimals : false,
												hideTrigger: true,
												labelCls: 'frmLabel',
												keyNavEnabled: false,
												mouseWheelEnabled: false,
												minValue: 1,
												margin : '0 0 0 50',
												width : 200,
												fieldLabel : getLabel('approvercount', 'No. of Aprrovers'),
												labelSeparator : '',
												labelAlign : 'top',
												itemId : 'txtApproversPackage',
												disabled : true
											}
										]

									}],
							bbar : ['->',{
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
							text : getLabel('save', 'Save'),
							padding : 4,
							margin : '2 0 0 0',
							formBind : true,
							itemId : 'btnAccountAssignSave',
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf0c7@fontawesome',
							handler : function() {

								this.fireEvent('savePackageAssignment',me.identifier);
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