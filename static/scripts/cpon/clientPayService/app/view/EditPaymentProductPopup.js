Ext.define(
				'GCP.view.EditPaymentProductPopup',
				{
					extend : 'Ext.window.Window',
					xtype : 'editPaymentProductPopup',
					requires : [ 'Ext.data.Store' ],
					width : 330,
					height : 200,
					modal : true,
					draggable : true,
					autoScroll : true,
					layout : 'hbox',
					config : {
						productCode : null,
						defaultPkg : null
					},
					initComponent : function() {
						var me = this;
						
						this.title = getLabel('editPaymentProductPopup',
								'Edit Payment Product');
						var packageStore = Ext.create('Ext.data.Store',
											{
											fields : [ 'productName',
													'packageId',
													'useSingleName','identifier' ,'productCode'],
											proxy : {
												type : 'ajax',
												url : 'cpon/clientServiceSetup/updateProductList.json?id='
														+ encodeURIComponent(parentkey)
														+ '&$select='
														+ me.productCode,
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
											listeners : {
												load : {
													fn : function() {
														var productLabel = me
																.query('label[itemId=productName]')[0];
														var productName = this.getAt(0).get('productName');
														productLabel
																.setText(productName);
														me.productCode = this.getAt(0).get('productCode');
														me.defaultPkg = this.getAt(0).get('useSingleName');
													}
												}
											},
											autoLoad : true
										});
						var defaultPackageCombo = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'defaultAccountCombo',
									store : packageStore,
									itemId : 'defPackage',
									displayField : 'useSingleName',
									valueField : 'identifier',
									value:me.defaultPkg,
									margin : '5 5 15 5',
									editable : false
								});
						this.items = [
								{
									xtype : 'container',
									width : '50%',
									layout : 'vbox',
									items : [ {
										xtype : 'label',
										margin : '5 5 15 5',
										text : getLabel('product', 'Product')
									}, {
										xtype : 'label',
										margin : '10 5 15 5',
										itemId : 'productName'
									} ]
								},
								{
									xtype : 'container',
									width : '50%',
									layout : 'vbox',
									items : [
											{
												xtype : 'label',
												margin : '5 5 15 5',
												text : getLabel(
														'defaultpackage',
														'Default Package')
											}, defaultPackageCombo ]
								} ];
						this.buttons = [ {
							xtype : 'button',
							text : getLabel('save', 'Save'),
							itemId : 'editProductSaveBtn',
							cls : 'xn-button',
							handler : function() {
								
								this.fireEvent('saveEditProduct',me.productCode);	
							}
						}, {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button',
							handler : function() {
								me.close();
							}
						} ];
						this.callParent(arguments);
					}
					
				});