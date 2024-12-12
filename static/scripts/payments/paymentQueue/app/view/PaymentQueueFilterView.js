/**
 * @class GCP.view.PaymentQueueFilterView
 * @extends Ext.panel.Panel
 * @author Anil Pahane
 * @author Vinay Thube
 */
Ext.define('GCP.view.PaymentQueueFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'paymentQueueFilterView',
	requires : ['Ext.panel.Panel', 'Ext.ux.gcp.AutoCompleter',
			'Ext.data.Store', 'Ext.form.Label', 'Ext.form.field.ComboBox',
			'Ext.layout.container.VBox', 'Ext.layout.container.HBox',
			'Ext.toolbar.Toolbar', 'Ext.button.Button'],
	width : '100%',
	margin : '0 0 10 0',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed :true,
	cls : 'xn-ribbon ux_border-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	title : getLabel('filterBy', 'Filter By: ')
			+ '<img id="imgFilterInfoStdView" class="largepadding icon-information"/>',
	statusCode : null,
	statusDesc : null,
	tools : [{
				xtype : 'container',
				padding : '0 9 0 0',
				layout : 'hbox',
				items : [{
							xtype : 'label',
							text : getLabel('preferences', 'Preferences : '),
							cls : 'xn-account-filter-btnmenu',
							padding : '2 0 0 0'
						}, {
							xtype : 'button',
							itemId : 'btnClearPreferences',
							disabled : true,
							text : getLabel('clearFilter', 'Clear'),
							cls : 'xn-account-filter-btnmenu',
							textAlign : 'right',
							width : 40
						}, {
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18
						}, {
							xtype : 'button',
							itemId : 'btnSavePreferences',
							disabled : true,
							text : getLabel('saveFilter', 'Save'),
							cls : 'xn-account-filter-btnmenu',
							textAlign : 'right',
							width : 30
						}]
			}],
	initComponent : function() {
		var me = this;
		var arrItems = [], panel = null;
		panel = me.createFilterUpperPanel();
		arrItems.push(panel);
		panel = me.createFilterLowerPanel();
		arrItems.push(panel);
		me.items = arrItems;
		me.callParent(arguments);
	},
	createFilterUpperPanel : function() {
		var me = this;
		var flex = 0;
		var fieldFI = null, filedQueue = null, fieldClient = null, btnSearch = null, intCnt = 0;
		fieldFI = me.createFICombo();
		filedQueue = me.createPQCombo();
		fieldClient = me.createClientAutocompleter();
		btnSearch = me.createSearchBtn();

		intCnt += fieldFI.hidden === true ? 0 : 1;
		intCnt += filedQueue.hidden === true ? 0 : 1;
		intCnt += fieldClient.hidden === true ? 0 : 1;
		intCnt += btnSearch.hidden === true ? 0 : 1;

		flex = parseFloat((1 / intCnt).toFixed(2));

		fieldFI.flex = fieldFI.hidden === true ? 0 : flex;
		filedQueue.flex = filedQueue.hidden === true ? 0 : flex;
		fieldClient.flex = fieldClient.hidden === true ? 0 : flex;
		btnSearch.flex = btnSearch.hidden === true ? 0 : flex;

		var parentPanel = Ext.create('Ext.panel.Panel', {
					layout : 'hbox',
					itemId : 'filterUpperPanel',
					cls : 'ux_normalpadding-top',
					items : [fieldFI, filedQueue, fieldClient, btnSearch]
				});
		return parentPanel;
	},
	createFilterLowerPanel : function() {
		var me = this;
		var parentPanel = Ext.create('Ext.panel.Panel', {
					layout : 'hbox',
					itemId : 'filterLowerPanel',
					cls : 'ux_normalpaddingtb',
					width : '100%',
					items : [me.createStatusFilter(),  me.createCashFilter(), me.createAdvanceFilter()]
				});
		return parentPanel;
	},
	createFICombo : function() {
		var me = this;
		var storeData = null;
		var isMultipleSellerAvailable = false;
		Ext.Ajax.request({
					url : 'services/userseek/adminSellersListCommon.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var sellerData = data.d.preferences;
						if (!Ext.isEmpty(data)) {
							storeData = sellerData;
						}
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}

				});
		var objStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'd.preferences'
					}
				});// check if multiple sellers are available
		if (objStore.getCount() > 1) {
			isMultipleSellerAvailable = true;
		}
		var fiComboPanel = Ext.create('Ext.panel.Panel', {
			cls : 'xn-filter-toolbar',
			flex : 0.25,
			layout : {
				type : 'vbox'
			},
			hidden : !isMultipleSellerAvailable,
			items : [{
				xtype : 'label',
				text : getLabel('lblfinancialinstitution', 'Financial Institution'),
				cls : 'ux_payment-type',
				flex : 1,
				padding : '6 0 0 8'
			}, {
				xtype : 'combobox',
				padding : '5 10 0 0',
				margin : '0 0 0 10',
				width : 160,
				fieldCls : 'xn-form-field inline_block x-trigger-noedit',
				triggerBaseCls : 'xn-form-trigger',
				filterParamName : 'seller',
				editable : false,
				name : 'sellerCombo',
				itemId : 'paymentQueueSellerId',
				displayField : 'DESCR',
				valueField : 'CODE',
				queryMode : 'local',
				store : objStore,
				value : strSeller,
				listeners : {
					'change' : function(combo, strNewValue, strOldValue) {
						setAdminSeller(combo.getValue());
						me.setSellerToClientAutoCompleterUrl();
					}

				}

			}]
		});

		var fiCombo = fiComboPanel
				.down('combobox[itemId="paymentQueueSellerId"]');

		if (Ext.isEmpty(strSeller)) {
			fiCombo.suspendEvents();
			fiCombo.select(fiCombo.getStore().getAt(0));
			fiCombo.resumeEvents();
		}
		return fiComboPanel;
	},
	createPQCombo : function() {
		var me = this;
		var queues = Ext.create('Ext.data.Store', {
					fields : ['code', 'name'],
					data : arrQueues

				});
		var pqComboPanel = Ext.create('Ext.panel.Panel', {
			cls : 'xn-filter-toolbar',
			flex : 0.25,
			hidden : (strPaymentQueueType === 'Q' || strPaymentQueueType === 'CW'),
			layout : {
				type : 'vbox'
			},
			items : [{
						xtype : 'label',
						text : getLabel('processingQueue', 'Processing Queue'),
						cls : 'f13 ux_payment-type',
						flex : 1,
						padding : '6 0 0 8'
					}, {
						xtype : 'combobox',
						padding : '5 0 0 0',
						margin : '0 0 0 10',
						width : 160,
						fieldCls : 'xn-form-field inline_block x-trigger-noedit',
						triggerBaseCls : 'xn-form-trigger',
						editable : false,
						name : 'QueueCombo',
						itemId : 'processingQueuesComboBox',
						queryMode : 'local',
						filterParamName : 'queueType',
						displayField : 'name',
						valueField : 'code',
						store : queues,
						hidden : (strPaymentQueueType === 'Q' || strPaymentQueueType === 'CW'),
						listeners : {
							'change' : function(combo, strNewValue, strOldValue) {
								me.fireEvent('processingQueueChange', strNewValue,
										combo.getRawValue());
							}
						}
					}]
		});
		var pqCombo = pqComboPanel.down('combo');
		var isPresent = false;
		if (!Ext.isEmpty(strPaymentQueueType)){
			for(var i=0;i<arrQueues.length;i++){
				if(arrQueues[i].code === strPaymentQueueType){
					pqCombo.select(strPaymentQueueType);
					isPresent = true;
				}
			}
		}	
		if(!isPresent)
			pqCombo.select(pqCombo.getStore().getAt(0));
		return pqComboPanel;
	},

	createClientAutocompleter : function() {
		var me = this;
		var clientPanel = Ext.create('Ext.panel.Panel', {
			cls : 'xn-filter-toolbar',
			flex : 0.25,
			layout : {
				type : 'vbox'
			},
			items : [{
						xtype : 'label',
						text : getLabel('companyName', 'Company Name'),
						cls : 'f13 ux_font-size14',
						flex : 1,
						padding : '6 0 0 8'
					}, {
						xtype : 'AutoCompleter',
						padding : '6 0 0 3',
						margin : '0 0 0 10',
						matchFieldWidth : true,
						cls : 'autoCmplete-field',
						fieldCls : 'w14 xn-form-text xn-suggestion-box',
						labelSeparator : '',
						name : 'client',
						itemId : 'bankProcessingQueueClientId',
						cfgUrl : 'services/userseek/BankProcessingQueueClient.json',
						cfgQueryParamName : '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'clientSeek',
						cfgRootNode : 'd.preferences',
						value : strClientDesc,
						cfgKeyNode : 'DESCR',
						cfgDataNode1 : 'DESCR',
						listeners : {
							'render' : function(combo, eOpts) {
								if (!Ext.isEmpty(strClient)
										&& !Ext.isEmpty(strClientDesc)) {
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
								me.setSellerToClientAutoCompleterUrl();
							}

						}
					}]
		});
		return clientPanel;
	},
	createSearchBtn : function() {
		var me = this;
		var searchBtnPanel = Ext.create('Ext.toolbar.Toolbar', {
					cls : 'xn-filter-toolbar',
					margin : '15 0 0 0',
					items : ['->', {
								xtype : 'button',
								itemId : 'filterBtnId',
								text : getLabel('search', 'Search'),
								cls : 'xn-btn ux-button-s',
								listeners : {
									'click' : function(btn, e, eOpts) {
										me.handleQuickFilterChange();
									}
								}
							}, '']
				});
		return searchBtnPanel;
	},
	createStatusFilter : function() {
		var me = this;
		var flexSize = 0.6;
		if(strPaymentQueueType === 'Q' || strPaymentQueueType === 'CW')
			flexSize = 0.35;
		var statusPanel = Ext.create('Ext.panel.Panel', {
			itemId : 'statusFilterPanel',
			cls : 'xn-filter-toolbar',
			flex : flexSize,
			layout : {
				type : 'vbox'
			},
			items : [{
						xtype : 'label',
						text : getLabel('status', 'Status'),
						hidden : (strPaymentQueueType === 'Q' || strPaymentQueueType === 'CW'),
						cls : 'f13 ux_font-size14',
						padding : '6 0 0 8'
					}, {
						xtype : 'toolbar',
						padding : '6 0 0 6',
						hidden : (strPaymentQueueType === 'Q' || strPaymentQueueType === 'CW'),
						itemId : 'queueSubTypeToolBar',
						cls : 'xn-toolbar-small',
						filterParamName : 'queueSubType',
						enableOverflow : true,
						width : '100%',
						componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
						items : []
					}]
		});
		return statusPanel;
	},
	createCashFilter : function() {
		var me = this;
		var strCss = 'xn-custom-heighlight';
		var cashPanel = Ext.create('Ext.panel.Panel', {
			itemId : 'cashFilterPanel',
			hidden : (strPaymentQueueType != 'Q' && strPaymentQueueType != 'CW'),
			cls : 'xn-filter-toolbar',
			flex : 0.3,
			items : [{
						xtype : 'toolbar',
						padding : '4 0 0 6',
						itemId : 'cashToolBar',
						cls : 'xn-toolbar-small',
						enableOverflow : true,
						width : '100%',
						componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
						items : [{
									text : getLabel('cashIn', 'Bank View'),
									itemId : 'QBtn',
									cls : 'xn-custom-heighlight',
									handler : function(btn, opts) 
										{
											me.dohandleCashClick(btn); 
											me.fireEvent('paymentQueueChange', 'Q', 'Batch');
										}
								}, {
									text : getLabel('cashWeb', 'Client View'),
									itemId : 'CWBtn',
									handler : function(btn, opts) {
										me.dohandleCashClick(btn);
										me.fireEvent('paymentQueueChange', 'CW', 'Cash-Web');
									}
								}]
					}]
		});
		var selectedBtn = cashPanel.down('toolbar').down('button[itemId="'+strPaymentQueueType+'Btn"]');
			cashPanel.down('toolbar[itemId="cashToolBar"]').items.each(function(
						item) {
					item.removeCls(strCss);
				});
		if(selectedBtn)		
			selectedBtn.addCls(strCss);
		return cashPanel;
	},
	dohandleCashClick : function(btn) {
		var me = this;
		var strCss = 'xn-custom-heighlight';
		me.down('toolbar[itemId="cashToolBar"]').items.each(function(
						item) {
					item.removeCls(strCss);
				});
		btn.addCls(strCss);
	},
	createAdvanceFilter : function() {
		var me = this;
		var advanceFilterPanel = Ext.create('Ext.panel.Panel', {
					itemId : 'advFilterPanel',
					cls : 'xn-filter-toolbar',
					flex : 0.4,
					layout : {
						type : 'vbox'
					},
					items : [{
						xtype : 'panel',
						cls : 'ux_paddingtl',
						layout : {
							type : 'hbox'
						},
						items : [{
							xtype : 'label',
							text : getLabel('advFilters', 'Advanced Filters'),
							cls : 'f13 ux_font-size14'
								// hidden : isHidden('AdvanceFilter')
								// padding : '6 0 0 6'
							}, {
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							// hidden : isHidden('AdvanceFilter'),
							padding : '5 0 0 9',
							cls : 'ux_hide-image'

						}, {
							xtype : 'button',
							itemId : 'newFilter',
							text : '<span class="button_underline thePointer">'
									+ getLabel('createNewFilter',
											'Create New Filter') + '</span>',
							cls : 'xn-account-filter-btnmenu xn-small-button',
							// width : 100,
							// margin : '7 0 0 0',
							margin : '0 0 0 10'
								// hidden : isHidden('AdvanceFilter')
						},
						{
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18
						},
						{
							xtype : 'button',
							itemId : 'btnClearAdvFilter',
							text : getLabel('clearAdvFilter','Clear Filter'),
							cls : 'xn-account-filter-btnmenu xn-small-button',
							disabled : true,
							listeners : {
								'click' : function(btn, e, eOpts) {
									me.handleClearAdvFilter();
								}
							}
						}]
					}, {
						xtype : 'toolbar',
						itemId : 'advFilterActionToolBar',
						cls : 'xn-toolbar-small',
						padding : '5 0 0 1',
						width : '100%',
						enableOverflow : true,
						border : false,
						items : []

					}]
				});
		return advanceFilterPanel;
	},

	loadPaymentStatus : function(arrStatusType, strSelectedQueue,
			strSelectedStatus) {
		var me = this;
		var arrStatusType = (arrStatusType || []);
		var objTbar = me.down('toolbar[itemId="queueSubTypeToolBar"]'), btnAll = null, objType = null;
		var strCls = 'xn-custom-heighlight';
		var arrItem = arrStatusType;
		me.statusCode = null;
		me.statusDesc = null;
		// Logic to filter status for specified queue
		/*
		 * for (var i = 0; i < arrStatusType.length; i++) { if
		 * (arrStatusType[i].queueType == strSelectedQueue) {
		 * arrItem.push(arrStatusType[i]); } }
		 */
		if (!Ext.isEmpty(objTbar)) {
			var tbarItems = (objTbar.items || []);;
			objTbar.removeAll();
		}
		// TODO : Commented as per requirement
		if (false)
			objTbar.add({
						text : getLabel('all', 'All'),
						btnId : 'allStatusBtn',
						code : 'all',
						btnDesc : getLabel('all', 'All'),
						tooltip : getLabel('all', 'All'),
						cls : strCls,
						handler : function(btn, opts) {
							// me.dohandlePaymentQueueStatusClick(btn);
							me.statusCode = btn.code;
							me.statusDesc = btn.btnDesc;
							// me.handleQuickFilterChange();
						}
					});
		// Adds buttons from json
		for (var i = 0; i < arrItem.length; i++) {
			objType = arrItem[i];
			if (i === 0 && Ext.isEmpty(strSelectedStatus)) {
				me.statusCode = objType.queueSubType;
				me.statusDesc = objType.queueDescrition;
				strCls = 'xn-custom-heighlight';
			} else
				strCls = '';
			if (strSelectedStatus === objType.queueSubType) {
				strCls = 'xn-custom-heighlight';
				me.statusCode = objType.queueSubType;
				me.statusDesc = objType.queueDescrition;
			}
			objTbar.add({
				text : objType.queueDescrition + '(' + objType.queueCount + ')',
				btnId : objType.queueDescrition,
				code : objType.queueSubType,
				btnDesc : objType.queueDescrition,
				tooltip : objType.queueDescrition,
				cls : strCls,
				handler : function(btn, opts) {
					me.statusCode = btn.code;
					me.statusDesc = btn.btnDesc;
					me.dohandlePaymentQueueStatusClick(btn);
					me.handleQuickStatusFilterChange();
				}
			});
		}

	},
	dohandlePaymentQueueStatusClick : function(btn) {
		var me = this;
		me.down('toolbar[itemId="queueSubTypeToolBar"]').items.each(function(
						item) {
					item.removeCls('xn-custom-heighlight');
				});
		btn.addCls('xn-custom-heighlight');
	},
	getQuickFilterJSON : function(selectedQueue) {
		var me = this;
		var filterJson = {};
		var field = null, strValue = null;

		field = me.down('combobox[itemId="paymentQueueSellerId"]');
		strValue = field ? field.getValue() : '';
		filterJson['sellerCode'] = strValue;

		field = me.down('combobox[itemId="bankProcessingQueueClientId"]');
		strValue = field ? field.getValue() : '';
		filterJson['clientCode'] = strValue;
		strValue = field ? field.getRawValue() : '';
		filterJson['clientDesc'] = strValue;
		filterJson['statusCode'] = me.statusCode;
		filterJson['statusDesc'] = me.statusDesc

		filterJson['creationDate1'] = creationdate1;
		filterJson['creationDate2'] = creationdate2;
		
		field = me.down('combobox[itemId="processingQueuesComboBox"]');
		if(field.hidden != true)
			strValue = field ? field.getValue() : '';
		else
			strValue = selectedQueue;		
		if('CW' === selectedQueue)
			filterJson['queueType'] = selectedQueue;
		else		
			filterJson['queueType'] = strValue;
		return filterJson;
	},
	handleQuickFilterChange : function() {
		var me = this;
		me.fireEvent('quickFilterChange', me.getQuickFilterJSON());

	},
	handleQuickStatusFilterChange : function() {
		var me = this;
		me.fireEvent('quickStatusFilterChange', me.getQuickFilterJSON());

	},
	setSellerToClientAutoCompleterUrl : function() {
		var me = this;
		var sellerCombo = me.down('combobox[itemId="paymentQueueSellerId"]');
		var seller = sellerCombo.getValue();
		var clientautoComplter = me
				.down('combobox[itemId="bankProcessingQueueClientId"]');
		clientautoComplter.reset();
		clientautoComplter.cfgExtraParams = [{
					key : '$filtercode1',
					value : seller
				}];
	},
	addAllSavedFilterCodeToView : function(arrFilters) {
		var me = this;
		var objToolbar = me.down('toolbar[itemId="advFilterActionToolBar"]');
		var arrTBarItems = [], item = null;
		if (objToolbar) {
			if (objToolbar.items && objToolbar.items.length > 0)
				objToolbar.removeAll();
			if (arrFilters && arrFilters.length > 0) {
				for (var i = 0; i < 5; i++) {
					if (arrFilters[i]) {
						item = Ext.create('Ext.Button', {
							cls : 'cursor_pointer xn-account-filter-btnmenu',
							text : Ext.util.Format.ellipsis(arrFilters[i], 11),
							itemId : arrFilters[i],
							tooltip : arrFilters[i],
							handler : function(btn, opts) {
								var objToolbar = me
										.down('toolbar[itemId="advFilterActionToolBar"]');
								objToolbar.items.each(function(item) {
											item
													.removeCls('xn-custom-heighlight');
										});
								btn.addCls('xn-custom-heighlight');
								me.fireEvent('handleSavedFilterItemClick',
										btn.itemId, btn, true);
							}
						});
						arrTBarItems.push(item);
					}
				}
				var imgItem = Ext.create('Ext.Img', {
							src : 'static/images/icons/icon_spacer.gif',
							height : 16,
							padding : '0 3 0 3',
							cls : 'ux_hide-image'
						});
				item = Ext.create('Ext.Button', {
					cls : 'cursor_pointer xn-account-filter-btnmenu xn-button-transparent',
					menuAlign : 'tr-br',
					text : getLabel('moreText', 'more') + '&nbsp;>>',
					itemId : 'AdvMoreBtn',
					// width : 48,
					padding : '2 0 0 0',
					handler : function(btn, opts) {
						// TODO: To be handled
						me.fireEvent('moreAdvancedFilterClick', btn);
					}
				});
				arrTBarItems.push(imgItem);
				arrTBarItems.push(item);
				objToolbar.removeAll();
				objToolbar.add(arrTBarItems);
			}
		}
	},
	highlightSavedFilter : function(strFilterCode) {
		var me = this;
		var objToolbar = me.down('toolbar[itemId="advFilterActionToolBar"]');
		if (objToolbar) {
			objToolbar.items.each(function(item) {
						item.removeCls('xn-custom-heighlight');
						if (item.itemId === strFilterCode)
							item.addCls('xn-custom-heighlight');
					});
		}
	},
	handleClearAdvFilter : function() {
		var me = this;
		me.fireEvent('clearAdvFilter', me.getQuickFilterJSON());

	}
});
