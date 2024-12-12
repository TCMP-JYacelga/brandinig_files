Ext.define('GCP.view.PaymentFromTemplateView', {
	extend : 'Ext.window.Window',
	xtype : 'paymentFromTemplateView',
	requires : ['Ext.panel.Panel', 'Ext.data.Store', 'Ext.form.CheckboxGroup',
			'Ext.tip.ToolTip'],
	width : 800,
	height : 380,
	modal : true,
	header : false,
	minButtonWidth : 60,
	initComponent : function() {
		var me = this;
		var headerPanel = null;
		// me.title = 'Payment Using Template';
		headerPanel = Ext.create('Ext.panel.Panel', {
			width : '100%',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			margin : '0 0 5 0',
			items : [{
				html : '<div id="crumbs" class="crumbs">'
						+ '<ul>'
						+ '<li style="width:170px;"><a class="active"><span class="mediumfont font_bold">1&nbsp;</span>Choose Template</a></li>'
						+ '<li style="width:170px;"><a><span class="mediumfont font_bold">2&nbsp;</span>Enter Payment Details</a></li>'
						+ '<li style="width:170px;"><a><span class="mediumfont font_bold">3&nbsp;</span>Submit Payment&nbsp;&nbsp;</a></li>'
						+ '</ul> ' + '</div>',
				itemId : 'singlePaymentEntryTabPanelHeader',
				width : '100%'

			}]
		});
		me.items = [headerPanel, {
			xtype : 'panel',
			width : '100%',
			margin : '2 0 2 0',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			cls : 'xn-panel',
			items : [{
				xtype : 'panel',
				layout : 'vbox',
				height : 45,
				margin : '4 4 4 4',
				width : '100%',

				componentCls : 'gradiant_back roundify ui-corner-all',
				items : [{
						xtype:'toolbar',
						itemId : 'newPaymentTitle',
						layout : 'hbox',
						width : '100%',
						items:[{
						xtype : 'label',
						text : getLabel('newPaymentTitle', 'New Payment'),
						cls : 'font_bold',
						padding : '0 0 0 2'
					},'->',{
							xtype : 'AutoCompleter',
							fieldCls : 'xn-form-text w12 xn-suggestion-box',
							itemId : 'sellerAutoCompleter',
							name : 'sellerAutoCompleter',
							hidden : (!Ext.isEmpty(strEntityType) && (strEntityType === '1')) ? true : false,
							cfgUrl : 'services/userseek/sellerSeek.json',
							cfgRecordCount : -1,
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'CODE',
							cfgDataNode2 : 'DESCRIPTION',
							cfgKeyNode : 'CODE',
							value : strSeller,
							listeners : {
								'select' : function(combo, record) {
									strSeller = combo.getValue();
									me.fireEvent('sellerComboSelect', combo,
											record);
								}
							}
						},{
							xtype : 'AutoCompleter',
							fieldCls : 'xn-form-text w12 xn-suggestion-box',
							itemId : 'clientAutoCompleter',
							hidden : (!Ext.isEmpty(strEnableSeek) && (strEnableSeek === 'Y'))
									? false
									: true,
							name : 'clientAutoCompleter',
							cfgUrl : 'services/userseek/userclients.json',
							cfgRecordCount : -1,
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCR',
							cfgKeyNode : 'CODE',
							value : strClient,
							listeners : {
								'select' : function(combo, record) {
									strClient = combo.getValue();
									strClientDesc = combo.getRawValue();
									me.fireEvent('clientComboSelect', combo,
											record);
								},
								'render' : function(combo) {
									combo.store.loadRawData({
												"d" : {
													"preferences" : [{
																"CODE" : strClient,
																"DESCR" : strClientDesc
															}]
												}
											});
									combo.suspendEvents();
									combo.setValue(strClient);
									combo.resumeEvents();
								}
							}
						}]
					}]
			}, {
				xtype : 'label',
				itemId : 'templateErrorLabel',
				cls : 'error-msg-color',
				padding : '0 0 5 0'
			}, {
				xtype : 'panel',
				itemId : 'paymentMethodPanel',
				layout : 'hbox',
				margin : '4 4 4 4',
				padding : '5 0 0 2',
				width : '100%',
				height : 230,
				items : [{
							xtype : 'panel',
							itemId : 'templateCategoryList',
							padding : '20 0 0 0',
							cls : 'panel-seperator',
							width : '22%',
							height : 230,
							layout : 'vbox',
							items : []
						}, {
							xtype : 'panel',
							padding : '4 2 0 8',
							width : '78%',
							height : 210,
							itemId : 'templateProfileSelectionPanel',
							overflowY : 'auto',
							items : [{
										xtype : 'panel',
										padding : '5 0 0 0',
										itemId : 'templatesCt',
										items : []
									},
									{
									xtype : 'label',
									itemId : 'noDataErrorLabel',
									text : getLabel('emptyDataMsg','No Profiles created for the selected Payment Type.'),
									flex : 1,
									padding : '10 0 0 0',
									hidden : true
									}
									],
							dockedItems : [{
								xtype : 'container',
								dock : 'top',
								layout : 'hbox',
								items : [{
									xtype : 'label',
									text : getLabel('pmtEmtrySelectProfile',
											'Select Payment Profile (Select One)'),
									padding : '2 0 0 0',
									cls : 'font_bold'
								}]

							}]
						}, {
							xtype : 'label',
							itemId : 'noClientDataErrorLabel',
							text : getLabel('noClientDataError',
									'No Data Available for the moment.'),
							flex : 1,
							hidden : true
						}],
				dockedItems : [{
					xtype : 'toolbar',
					dock : 'bottom',
					items : ['->', {
								xtype : 'button',
								itemId : 'btnCancel',
								text : '<span class="linkblue">Cancel</span>',
								cls : 'xn-account-filter-btnmenu',
								parent : this,
								handler : function(btn, opts) {
									me.close();
								}

							}, {
								xtype : 'image',
								src : 'static/images/icons/icon_spacer.gif',
								height : 14
								// padding : '3 2 2 2'
						}	, {
								xtype : 'button',
								itemId : 'btnNext',
								text : '<span class="linkblue">Next</span>',
								cls : 'xn-account-filter-btnmenu',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('nextTemplateAction',
											btn, opts);
								}
							}]
				}]
			}]
		}];
		this.callParent(arguments);
	},

	loadTemplates : function(data, catCode, catDesc) {
		var me = this;
		var noDataLabelRef = me.down('label[itemId="noDataErrorLabel"]');
		var templateCt = me.down('panel[itemId="templatesCt"]');
		if (!Ext.isEmpty(templateCt)) {
			if (templateCt.items.length > 0) {
				templateCt.removeAll();
			}
		}
		if (data && data.d && data.d.myproductsandtemplates) {
			var templates = data.d.myproductsandtemplates;
			var checkedFlg = true;
			var checkboxArray = [];
			var selectedTemplate = null;
			var strHtml = '', strBoxLabelCls = 'x-form-cb-label', charLimitReached = null;
			var blnLimitReached = false;
	
			if (!Ext.isEmpty(noDataLabelRef))
				noDataLabelRef.hide();
				
			for (var i = 0; i < templates.length; i++) {
				strHtml = '';
				charLimitReached = templates[i].limitReached;
				if (!Ext.isEmpty(templates[i].paymentType)
						&& templates[i].paymentType === 'Q')
					strHtml = '<a title="'
							+ getLabel('batchQuickPay', 'Quick Pay')
							+ '" class="grid-row-action-icon icon-quickpay xn-icon-16x16" href="#" onclick="return false;"></a>';
				blnLimitReached = templates[i].limitReached === 'Y'
						? true
						: false;
				// if (i == 5) {
				// blnLimitReached = true;
				// charLimitReached = 'Y';
				// }
				if (blnLimitReached)
					strBoxLabelCls = 'red';
				else
					strBoxLabelCls = ''

				checkboxArray.push({
					xtype : 'checkboxfield',
					identifier : templates[i].identifier,
					myProduct : templates[i].myProduct,
					paymentType : templates[i].paymentType,
					clientReference : templates[i].clientReference,
					strLayout : templates[i].layout,
					catCode : catCode,
					catDesc : catDesc,
					limitReached : charLimitReached,
					boxLabel : templates[i].myProductDescription + strHtml,
					checked : checkedFlg,
					cls : strBoxLabelCls,
					listeners : {
						change : function() {
							me.deselectCheckBox(this, this.checked, me)
						},
						render : function(c) {
							if (c.limitReached === 'Y')
								Ext.create('Ext.tip.ToolTip', {
									target : c.getEl(),
									html : getLabel('templateLimitReached',
											'No. of execution limit is reached..')
								});
						}
					}
				});
				if (i == 0) {
					var catTemProdPanel = me
							.down('panel[itemId="templatesCt"]');
					selectedTemplate = {
						"identifier" : templates[i].identifier,
						"myProduct" : templates[i].myProduct,
						"paymentType" : templates[i].paymentType,
						"clientReference" : templates[i].clientReference,
						"layout" : templates[i].layout,
						"catCode" : catCode,
						"catDesc" : catDesc,
						"limitReached" : charLimitReached
					};
					catTemProdPanel
							.fireEvent('selectedProductForTemplateEvent',
									selectedTemplate);
					checkedFlg = false;
					if (blnLimitReached)
						me.toggleNextButton(true);
				}
			}
			templateCt.add({
						xtype : 'checkboxgroup',
						columns : 3,
						width : '100%',
						vertical : true,
						items : checkboxArray

					});
			templateCt.doLayout();
		}else {
			if (!Ext.isEmpty(noDataLabelRef))
				noDataLabelRef.show();
		}
		
	},
	deselectCheckBox : function(cb, checked, me) {
		var isDisabled = cb.limitReached === 'Y' ? true : false;
		me.toggleNextButton(isDisabled);
		if (checked) {
			var catTemProdPanel = me.down('panel[itemId="templatesCt"]');
			var group = cb.findParentByType('checkboxgroup');
			// get the siblings and uncheck
			if (group) {
				group.items.each(function(it) {
							if (it.getName() != cb.getName()) {
								it.suspendEvents();
								it.setValue(0);
								it.resumeEvents();
							}
						});
			}
			var selectedTemplate = {
				"identifier" : cb.identifier,
				"myProduct" : cb.myProduct,
				"paymentType" : cb.paymentType,
				"clientReference" : cb.clientReference,
				"layout" : cb.strLayout,
				"catCode" : cb.catCode,
				"catDesc" : cb.catDesc,
				"limitReached" : cb.limitReached
			};
			catTemProdPanel.fireEvent('selectedProductForTemplateEvent',
					selectedTemplate);

		} else {
			cb.suspendEvents();
			cb.setValue(1);
			cb.resumeEvents();
		}
	},

	loadTemplateCategoryList : function(data) {
		var me = this;
		var categoryTemplatePanel = me.down('panel[itemId="templateCategoryList"]');
		var lblNoData = me.down('label[itemId="noClientDataErrorLabel"]');
		var panelProfile = me
				.down('panel[itemId="templateProfileSelectionPanel"]');
		if (!Ext.isEmpty(categoryTemplatePanel)) {
			if (categoryTemplatePanel.items.length > 0) {
				categoryTemplatePanel.removeAll();
			}
		}
		if (!Ext.isEmpty(data.d.instrumentType)) {
			var prodType = data.d.instrumentType;
			var checkedFlg = false;
			var disableFlg = false;
			var charLimitReached = 'N';
			var truncatedCheckboxLabel = '';
			var checkboxLabel = '';
			var selectedCatTemplateType = null, strCatDesc = null;
			var strCls = '';
			var checkboxArray = [];
			for (var i = 0; i < prodType.length; i++) {
				checkboxLabel = prodType[i].instTypeDescription;
				if (i == 0) {
					checkedFlg = true;
					disableFlg = true;
					selectedCatTemplateType = prodType[i].instTypeCode;
					strCatDesc = checkboxLabel;
					strCls = 'selected-cb-background';
				} else {
					checkedFlg = false;
					disableFlg = false;
					strCls = '';
				}
				
				if(!Ext.isEmpty(checkboxLabel)){
				if (checkboxLabel.length > 21) {
						truncatedCheckboxLabel = Ext.util.Format.ellipsis(checkboxLabel,21);
						charLimitReached = 'Y';
					} else {
						truncatedCheckboxLabel = checkboxLabel;
						charLimitReached = 'N';
					}
				}
				
				checkboxArray.push({
							code : prodType[i].instTypeCode,
							boxLabel :truncatedCheckboxLabel,
							checked : checkedFlg,
							cls : strCls,
							readOnly : disableFlg,
							width : 140,
							limitReached : charLimitReached,
							handler : function(btn, opts) {
								click : me.deselectTemplateTypeCheckbox(this,
										this.checked);
							},
							listeners : {
							render : function(c) {
								if (c.limitReached === 'Y') {
									Ext.create('Ext.tip.ToolTip', {
										target : c.getEl(),
										html : checkboxLabel
									});
								}
							}
						}
						});
			}
			categoryTemplatePanel.add([{
						xtype : 'checkboxgroup',
						columns : 1,
						width : '100%',
						items : checkboxArray
					}]);
			if (!Ext.isEmpty(selectedCatTemplateType)) {
				categoryTemplatePanel.fireEvent('populateTemplateListEvent',
						selectedCatTemplateType, strCatDesc);
			}
			if (lblNoData)
				lblNoData.hide();
			if (panelProfile)
				panelProfile.show();
			if (categoryTemplatePanel)
				categoryTemplatePanel.show();

			categoryTemplatePanel.doLayout();

		} else {
			if (panelProfile)
				panelProfile.hide();
			if (categoryTemplatePanel)
				categoryTemplatePanel.hide();
			if (lblNoData)
				lblNoData.show();
		}
	},
	deselectTemplateTypeCheckbox : function(cb, checked) {
		var me = this;
		var categoryTemplatePanel = me
				.down('panel[itemId="templateCategoryList"]');
		if (checked) {
			cb.addCls('selected-cb-background');
			cb.setReadOnly(true);
			var group = cb.findParentByType('checkboxgroup');
			// get the siblings and uncheck
			if (group) {
				group.items.each(function(it) {
							if (it.getName() != cb.getName()) {
								it.setValue(0);
								it.removeCls('selected-cb-background');
								it.setReadOnly(false);
							}
						});
			}

			categoryTemplatePanel.fireEvent('populateTemplateListEvent',
					cb.code, cb.boxLabel);
		}
	},
	toggleNextButton : function(isDisabled) {
		var me = this;
		var btnNext = me.down('button[itemId="btnNext"]');
		if (btnNext)
			btnNext.setDisabled(isDisabled);
	}
});