Ext.define('CPON.view.EditPaymentProductPopup', {
	extend : 'Ext.window.Window',
	xtype : 'editPaymentProductPopup',
	requires : ['Ext.data.Store'],
	width : (srvcCode == '05') ? 540 : 400,
	minHeight : 156,
	maxHeight : 550,
	draggable : false,
	resizable : false,
	cls : 'non-xn-popup',
	// layout : 'vbox',
	config : {
		productCode : null,
		initialProductCode : null,
		defaultPkg : null,
		cutOffProfileCode : null,
		cutOffProfileCodeDefault : null,
		cutOffProfileText : null,
		crLine : null,
		pdcLine : null,
		transferReceipt : null,
		mode : null,
		productIdentifier : null,
		productName : null,
		packageId : null,
		cutoffProfileId : null,
		selectedPackageIdentifier : null
	},
	listeners : {
		afterrender : function() {
			this.setInitialValues()
		},
		'resize' : function() {
			this.center();
		}
	},
	initComponent : function() {
		var me = this;
		var strCreditLine = null;
		var strPdcDiscLine = null;
		var strUpdateProdUrl = null;
		var strCollArrangmentUrl = null;
		var strCollCreditLineLstUrl = null;
		var strCollPdcLineLstUrl = null;
		var strCutoffUrl = 'cpon/clientServiceSetup/cutOffTimeList.json';
		var pdcLineStore = null;
		var arrangmentStore = null;
		var riskManagetStore = null;
		var arrangmentCombo = null;
		var crLineCombo = null;
		var pdcLineCombo = null;
		var riskManagerCombo = null;
		var identifier = null;
		var packageStore = null;
		var defaultPackageCombo = null;
		if ('02' == srvcCode) {
			strUpdateProdUrl = 'cpon/clientServiceSetup/getPackageNameForProduct.json';;
			this.title = getLabel('editPaymentProductPopup',
					'Edit Payment Product');
			packageStore = Ext.create('Ext.data.Store', {
				fields : ['productName', 'arrangment', 'ccy_code',
						'riskManagerAction', 'creditLine', 'packageId',
						'packageName', 'defaultPkgFlag', 'transferReceipt',
						'useSingleName', 'identifier', 'productCode',
						'cutoffProfileId'],
				proxy : {
					type : 'ajax',
					url : strUpdateProdUrl,
					extraParams : {
						id : encodeURIComponent(parentkey),
						qfilter : me.productCode
					},
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
							var productName = me.productName;
							var ccyCode = this.getAt(0).get('ccyCode');
							productLabel.setText(productName);
							me.initialProductCode = this.getAt(0)
									.get('productCode');
							var defPackageCombo = me
									.query('combobox[itemId=defPackage]')[0];
							if (defPackageCombo) {
								defPackageCombo.setValue(this.getAt(0)
										.get('packageId'));
							}
							Ext.getCmp('identifier').setValue(this.getAt(0)
									.get('identifier'));
							for (var i = 0; i < this.getTotalCount(); i++) {
								if ('Y' === this.getAt(i).get('defaultPkgFlag')) {
									// Ext.getCmp('defPackage').setValue(this.getAt(i).get('identifier'));
									me.selectedPackageIdentifier = this
											.getAt(i).get('identifier');
									me.defaultPkg = this.getAt(i)
											.get('useSingleName');
								}
							}
						}
					}
				},
				autoLoad : true
			});

			defaultPackageCombo = Ext.create('Ext.form.ComboBox', {
						xtype : 'defaultAccountCombo',
						columnWidth : srvcCode == '02' ? 0.333333 : 0.6,
						store : packageStore,
						fieldLabel : srvcCode == '02'
								? getLabel('defaultpackage', 'Default Package')
								: getLabel('defaultRecpackage',
										'Default Receivable Package'),
						labelSeparator : "",
						labelAlign : 'top',
						labelCls : 'font_bold ux_font-size14-normal',
						itemId : 'defPackage',
						id : 'defPackage',
						cls : ' ux_extralargemargin-bottom ft-extraLargeMarginR',
						fieldCls : 'xn-form-field',
						triggerBaseCls : 'xn-form-trigger',
						displayField : 'packageName',
						valueField : 'packageId',
						value : me.packageId,
						editable : false,
						disabled : me.getMode() == 'view' ? true : false,
						listeners : {
						 'afterrender' : {
								fn : function() {
									this.setValue(me.packageId);
								}
							}
						}
					});
			Ext.getCmp('defPackage').setValue(me.packageId);				
		}
		if ('05' == srvcCode) {
			strUpdateProdUrl = 'cpon/clientServiceSetup/getDefaultPackages.json?id=';
			strCollArrangmentUrl = 'cpon/clientCollection/collArrangmentList?id=';
			this.title = getLabel('lblEditCollectionProductPopup',
					'Edit Receivable Product');
			strCollCreditLineLstUrl = 'cpon/clientServiceSetup/collectioPrdCrLineList';
			strCollPdcLineLstUrl = 'cpon/clientServiceSetup/collectioPrdCrLineList?pdcFlag=Y';
			var strCreditLineUrl = 'cpon/clientServiceSetup/collectionCreditLineList';
			packageStore = Ext.create('Ext.data.Store', {
				fields : ['productName', 'arrangment', 'ccy_code',
						'riskManagerAction', 'creditLine', 'packageId',
						'packageName', 'defaultPkgFlag', 'transferReceipt',
						'useSingleName', 'identifier', 'productCode',
						'cutoffProfileId','creditLineCode'],
				proxy : {
					type : 'ajax',
					url : strUpdateProdUrl + encodeURIComponent(parentkey)
							+ '&$select=' + me.productCode,
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
							var productName = me.productName;
							var ccyCode = this.getAt(0).get('ccyCode');
							productLabel.setText(productName);
							me.productCode = this.getAt(0).get('productCode');
							me.initialProductCode = this.getAt(0)
									.get('productCode');
							//me.cutOffProfileCode = this.getAt(0)
							//		.get('cutoffProfileId');
							//me.cutOffProfileCodeDefault = this.getAt(0)
							//		.get('cutoffProfileId');
							me.transferReceipt = this.getAt(0)
									.get('transferReceipt');
							Ext.getCmp('defCutOff')
									.setValue(me.cutOffProfileCodeDefault);
							// Ext.getCmp('arrangmentCombo').setValue(this.getAt(0).get('arrangment'));
							var arrangmentCombo = me
									.query('combobox[itemId=arrangmentCombo]')[0];
							if (arrangmentCombo) {
								arrangmentCombo.setValue(this.getAt(0)
										.get('arrangment'));
							}
							var defPackageCombo = me
									.query('combobox[itemId=defPackage]')[0];
							if (defPackageCombo) {
								defPackageCombo.displayField = 'packageName';
								for (var i = 0; i < this.data.getCount(); i++) {
									if (this.data.getAt(i).data.defaultPkgFlag == 'Y') {
										defPackageCombo.setValue(this.getAt(i)
												.get('packageId'));
									}
								}
							}
							// Ext.getCmp('defPackage').setValue(this.getAt(0).get('packageId'));
							Ext.getCmp('identifier').setValue(this.getAt(0)
									.get('identifier'));
							// Ext.getCmp('riskManagerCombo').setValue(this.getAt(0).get('riskManagerAction'));
							var riskManagerCombo = me
									.query('combobox[itemId=riskManagerCombo]')[0];
							if (riskManagerCombo) {
								riskManagerCombo.setValue(this.getAt(0)
										.get('riskManagerAction'));
							}
							var collPrdCreditLine = me
									.query('combobox[itemId=collPrdCreditLine]')[0];
							if (collPrdCreditLine) {
								collPrdCreditLine.setValue(this.getAt(0)
										.get('creditLine'));
								lineCodeVar=this.getAt(0)
								.get('creditLineCode');
							}
							for (var i = 0; i < this.getTotalCount(); i++) {
								if ('Y' === this.getAt(i).get('defaultPkgFlag')) {
									// Ext.getCmp('defPackage').setValue(this.getAt(i).get('identifier'));
									Ext.getCmp('identifier').setValue(this
											.getAt(i).get('identifier'));
									me.defaultPkg = this.getAt(i)
											.get('useSingleName');
								}
								if (arrangmentCombo) {
									arrangmentCombo.setValue(this.getAt(i)
											.get('arrangment'));
								}
								if (riskManagerCombo) {
									riskManagerCombo.setValue(this.getAt(i)
											.get('riskManagerAction'));
								}
							}
						}
					}
				},
				autoLoad : true
			});

			defaultPackageCombo = Ext.create('Ext.form.ComboBox', {
						xtype : 'defaultAccountCombo',
						columnWidth : srvcCode == '02' ? 0.333333 : 0.6,
						store : packageStore,
						fieldLabel : srvcCode == '02'
								? getLabel('defaultpackage', 'Default Package')
								: getLabel('defaultRecpackage',
										'Default Receivable Package'),
						labelSeparator : "",
						labelAlign : 'top',
						labelCls : 'font_bold ux_font-size14-normal',
						itemId : 'defPackage',
						id : 'defPackage',
						cls : ' ux_extralargemargin-bottom ft-extraLargeMarginR',
						fieldCls : 'xn-form-field',
						triggerBaseCls : 'xn-form-trigger',
						displayField : 'packageName',
						// valueField : 'identifier',
						valueField : 'packageId',
						// value:me.defaultPkg,
						// margin : '5 5 5 5',
						editable : false,
						disabled : me.getMode() == 'view' ? true : false
					});
			pdcLineStore = Ext.create('Ext.data.Store', {
						fields : ['name', 'value'],
						proxy : {
							type : 'ajax',
							url : strCollPdcLineLstUrl,
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
			arrangmentStore = Ext.create('Ext.data.Store', {
						fields : ['name', 'value'],
						proxy : {
							type : 'ajax',
							url : strCollArrangmentUrl,
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
			riskManagetStore = Ext.create('Ext.data.Store', {
						fields : ['name', 'value'],
						/*
						 * proxy : { type : 'ajax', url : strCollRiskManagerUrl,
						 * actionMethods : { create : "POST", read : "POST",
						 * update : "POST", destroy : "POST" }, reader : { type :
						 * 'json', root : 'd.filter' } },
						 */
						data : [{
									name : 'Select',
									value : ''
								}, {
									name : 'Hold till line available',
									value : 'H'
								}, {
									name : 'Provide Clear arrangement',
									value : 'C'
								}, {
									name : 'Reject transaction',
									value : 'R'
								}, {
									name : 'Accept transaction',
									value : 'A'
								}, {
									name : 'Move transaction to Risk Manager queue',
									value : 'M'
								}],
						autoLoad : true
					});

			arrangmentCombo = Ext.create('Ext.form.ComboBox', {
				xtype : 'arrangmentCombo',
				store : arrangmentStore,
				itemId : 'arrangmentCombo',
				// id : 'arrangmentCombo',
				fieldLabel : getLabel('arrangment', 'Arrangment'),
				labelSeparator : "",
				labelAlign : 'top',
				labelCls : 'font_bold ux_font-size14-normal required',
				cls : ' ux_extralargemargin-bottom ft-extraLargeMarginR',
				fieldCls : 'xn-form-field',
				triggerBaseCls : 'xn-form-trigger',
				valueField : 'value',
				displayField : 'name',
				editable : false,
				disabled : me.getMode() == 'view' ? true : false,
				listeners : {
					change : function(cmp, newValue, oldValue, eOpts) {
						if (!Ext.isEmpty(newValue)
								&& newValue.toLowerCase().indexOf('clear') >= 0) {
							riskManagerCombo.setDisabled(true);
							riskManagerCombo.labelEl.removeCls('required');
						} else {
							if (!this.isDisabled()
									&& hidePopUpFeatures === false) {

								riskManagerCombo.setDisabled(false);
								riskManagerCombo.labelEl.addCls('required');
							}
						}
					}
				}
					// margin : '5 5 5 5',
			});

			crLineCombo = Ext.create('Ext.ux.gcp.AutoCompleter', {
				fieldCls : 'xn-form-text w10 xn-suggestion-box',
				name : 'packageName',
				fieldLabel : getLabel('collCreditLine', 'Credit Line'),
				itemId : 'collPrdCreditLine',
				cfgUrl : strCreditLineUrl,
				labelAlign : 'top',
				cfgProxyMethodType : 'POST',
				cfgQueryParamName : 'qfilter',
				cfgRecordCount : -1,
				cfgSeekId : 'collectionMethodProfileNameSeek',
				cfgRootNode : 'd.filter',
				cfgDataNode1 : 'name',
				cfgDataNode2 : 'featureSubsetCode',
				cfgKeyNode : 'featureId',
				cfgExtraParams : [{
							key : 'id',
							value : encodeURIComponent(parentkey)
						}, {
							key : 'profileId',
							value : adminFeatureProfileId
						}],
				disabled : (me.getMode() == 'view' || hidePopUpFeatures == true)
						? true
						: false,
				labelCls : 'font_bold ux_font-size14-normal required',
				margin : '0 30 0 0',
				 listeners: {
				        change: function(ele, newValue, oldValue) { lineCodeVar="" }
				    }
			});

			pdcLineCombo = Ext.create('Ext.form.ComboBox', {
						xtype : 'pdcLineCombo',
						columnWidth : 0.333333,
						store : pdcLineStore,
						fieldLabel : getLabel('collPdcLine',
								'PDC Discounting Line'),
						labelSeparator : "",
						labelAlign : 'top',
						labelCls : 'font_bold ux_w135 ux_font-size14-normal',
						itemId : 'collPrdPdcLine',
						cls : ' ux_extralargemargin-bottom ft-extraLargeMarginR',
						fieldCls : 'xn-form-field',
						triggerBaseCls : 'xn-form-trigger',
						displayField : 'name',
						valueField : 'value',
						value : me.pdcLine,
						// margin : '5 5 5 5',
						editable : false
					});
			riskManagerCombo = Ext.create('Ext.form.ComboBox', {
				xtype : 'riskManagerCombo',
				columnWidth : 0.333333,
				store : riskManagetStore,
				fieldLabel : getLabel('defaultRiskManagerAction',
						'Default Risk Manager Action'),
				labelSeparator : "",
				labelAlign : 'top',
				labelCls : 'font_bold ux_font-size14-normal',
				itemId : 'riskManagerCombo',
				// id : 'riskManagerCombo',
				cls : ' ux_extralargemargin-bottom ft-extraLargeMarginR',
				fieldCls : 'xn-form-field',
				triggerBaseCls : 'xn-form-trigger',
				displayField : 'name',
				valueField : 'value',
				// value : me.pdcLine,
				// margin : '5 5 5 5',
				editable : hidePopUpFeatures == true ? true : false,
				disabled : (me.getMode() == 'view' || hidePopUpFeatures == true)
						? true
						: false
			});
		}

		var cutoffStore = Ext.create('Ext.data.Store', {
					fields : ['key', 'value'],
					proxy : {
						type : 'ajax',
						url : strCutoffUrl,
						reader : {
							type : 'json',
							root : 'd.cutoffProfiles'
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
								Ext.getCmp('defCutOff')
										.setValue(me.cutOffProfileCodeDefault);
								if (!Ext.isEmpty(this.getAt(0))) {
									me.cutOffProfileCode = this.getAt(0)
											.get('key');
									me.cutOffProfileText = this.getAt(0)
											.get('value');
								}
							}
						}
					},
					autoLoad : true
				});

		/*
		 * var crLineStore = Ext .create( 'Ext.data.Store', { fields : [ 'name',
		 * 'value' ], proxy : { type : 'ajax', url : strCollCreditLineLstUrl,
		 * actionMethods : { create : "POST", read : "POST", update : "POST",
		 * destroy : "POST" }, reader : { type : 'json', root : 'd.filter' } },
		 * autoLoad : true });
		 */

		var cutOffProfile = Ext.create('Ext.form.ComboBox', {
					xtype : 'cutOffCombo',
					store : cutoffStore,
					itemId : 'defCutOff',
					id : 'defCutOff',
					fieldLabel : getLabel('cutOffProfile', 'Cut Off Profile'),
					labelSeparator : "",
					labelAlign : 'top',
					labelCls : 'font_bold ux_w135 ux_font-size14-normal',
					// itemId : 'collPrdCutoff',
					cls : ' ux_extralargemargin-bottom ft-extraLargeMarginR',
					fieldCls : 'xn-form-field',
					triggerBaseCls : 'xn-form-trigger',
					valueField : 'key',
					displayField : 'value',
					// margin : '5 5 5 5',
					editable : false,
					disabled : me.getMode() == 'view' ? true : false
				});
				
		Ext.getCmp('defCutOff').setValue(me.cutOffProfileCodeDefault);		

		identifier = Ext.create('Ext.form.ComboBox', {
					xtype : 'identifierCombo',
					hidden : true,
					columnWidth : 0.333333,
					store : riskManagetStore,
					fieldLabel : getLabel('defaultRiskManagerAction',
							'Default Risk Manager Action'),
					labelSeparator : "",
					labelAlign : 'top',
					labelCls : 'font_bold ux_font-size14-normal',
					itemId : 'identifier',
					id : 'identifier',
					cls : ' ux_extralargemargin-bottom ft-extraLargeMarginR',
					fieldCls : 'xn-form-field',
					triggerBaseCls : 'xn-form-trigger',
					displayField : 'name',
					valueField : 'value',
					// value:me.defaultPkg,
					// margin : '5 5 5 5',
					editable : false
				});
		/*
		 * var crLineCombo = Ext.create( 'Ext.form.ComboBox', { xtype :
		 * 'creditLineCombo', columnWidth : 0.333333, store : crLineStore,
		 * fieldLabel : getLabel('collCreditLine','Credit Line'), labelSeparator :
		 * "", labelAlign : 'top', labelCls : 'font_bold ux_w135
		 * ux_font-size14-normal', itemId : 'collPrdCreditLine', cls: '
		 * ux_extralargemargin-bottom ft-extraLargeMarginR', fieldCls :
		 * 'xn-form-field', triggerBaseCls : 'xn-form-trigger', displayField :
		 * 'name', valueField : 'value', value : me.crLine, //margin : '5 5 5
		 * 5', editable : false, disabled : me.getMode() == 'view' ? true :
		 * false });
		 */

		if ('02' == srvcCode) {
			this.items = [{
				xtype : 'container',
				cls : 'ft-padding-bottom',
				items : [{
							xtype : 'label',
							cls : 'ux_font-size14',
							html : getLabel('product', 'Product') + " : "
									+ "&nbsp;"
						}, {
							xtype : 'label',
							cls : 'ux_font-size14-normal label-font-normal',
							itemId : 'productName'
						},

						{
							xtype : 'label',
							cls : 'ux_font-size14',
							margin : '0 0 0 35',
							html : getLabel('ccyCode', 'Currency') + " : "
									+ "&nbsp;"
						}, {
							xtype : 'label',
							cls : 'ux_font-size14-normal label-font-normal',
							itemId : 'currency'
						}]
			}, {
				xtype : 'container',
				items : [defaultPackageCombo, cutOffProfile, identifier]
			}];
		}
		if ('05' == srvcCode) {
			this.items = [{
				xtype : 'container',
				cls : 'ft-padding-bottom',
				items : [{
							xtype : 'label',
							cls : 'ux_font-size14',
							html : getLabel('product', 'Product') + " : "
									+ "&nbsp;"
						}, {
							xtype : 'label',
							cls : 'ux_font-size14-normal label-font-normal',
							itemId : 'productName'
						},

						{
							xtype : 'label',
							cls : 'ux_font-size14',
							margin : '0 0 0 35',
							html : getLabel('ccyCode', 'Currency') + " : "
									+ "&nbsp;"
						}, {
							xtype : 'label',
							cls : 'ux_font-size14-normal label-font-normal',
							itemId : 'currency'
						}

				]
			}, {
				xtype : 'container',
				layout : 'hbox',

				items : [cutOffProfile, defaultPackageCombo]
			}, {
				xtype : 'container',
				layout : 'hbox',
				items : [crLineCombo, arrangmentCombo, riskManagerCombo,
						identifier]
			}, {
				xtype : 'panel',
				layout : 'hbox',
				items : [{
					xtype : 'checkboxfield',
					hidden : true,
					itemId : 'transferReceipt',
					labelWidth : 'auto',
					fieldLabel : getLabel('lblColltranfer',
							'Transfer As Receipt'),
					labelAlign : 'left',
					listeners : {}
				}]
			}];

		}
		this.bbar = [{
					xtype : 'button',
					text : getLabel('cancel', 'Cancel'),
					// cls : 'ux_button-padding ux_button-background-color',
					// glyph : 'xf056@fontawesome',
					handler : function() {
						me.close();
					}
				}, '->', {
					xtype : 'button',
					text : getLabel('save', 'Save'),
					itemId : 'editProductSaveBtn',
					// cls : 'ux_button-padding ux_button-background-color',
					// glyph : 'xf0c7@fontawesome',
					handler : function() {
						var strPackageId = null;
						var defPackageCombo = me
								.query('combobox[itemId=defPackage]')[0];
						if (defPackageCombo) {
							strPackageId = defPackageCombo.getValue();
						}
						for (var i = 0; i < packageStore.data.items.length; i++) {
							var record = packageStore.data.items[i];
							if (record.get('packageId') === strPackageId) {
								me.selectedPackageIdentifier = record
										.get('identifier');
							}
						}

						this.fireEvent('saveEditProduct', me.productCode,
								me.initialProductCode, me.selectedPackageIdentifier);
					}
				}];
		this.callParent(arguments);
	},
	setInitialValues : function() {
		var me = this;
		/*
		 * var assignAccFlagCheck = me
		 * .down('checkboxfield[itemId=assignAccFlag]'); if ('VIEW' === me.mode) {
		 * assignAccFlagCheck.setDisabled(true); }
		 */
	}
});