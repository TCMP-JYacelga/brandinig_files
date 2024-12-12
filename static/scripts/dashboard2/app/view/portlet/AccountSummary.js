Ext.define('Cashweb.view.portlet.AccountSummary', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.accountsummary',
	requires : ['Cashweb.store.AccountSummaryStore'],
	border : false,
	emptyText : null,
	cls : 'widget-grid',
	taskRunner : null,
	cols : 3,
	minHeight : 336,
	accountFilter : '$accountID=ALL',
	accountTypeFilter : '$filterValue=',
	eqCurrencyFilter : '$eqCurrency=USD',
	summaryTypeFilter : '',
	enableQueryParam : false,
	titleId : '',
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		thisClass.store = new Cashweb.store.AccountSummaryStore();

		thisClass.on('columnhide', thisClass.handleStateChange);
		thisClass.on('columnmove', thisClass.handleStateChange);
		// TODO
		// thisClass.on('columnresize', thisClass.handleStateChange);
		thisClass.on('columnshow', thisClass.handleStateChange);
		thisClass.on('sortchange', thisClass.handleStateChange);
		thisClass.on('lockcolumn', function(ct, colmn, width, opts) {
					thisClass.handleStateChange(ct, colmn, width, opts)
				});
		thisClass.on('unlockcolumn', function(ct, colmn, width, opts) {
					thisClass.handleStateChange(ct, colmn, width, opts)
				});

		thisClass.on('refreshWidget', function() {
					var record = thisClass.record, settings = [];
					var filterUrl = '';
					thisClass.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					filterUrl = thisClass.generateUrl(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});

		thisClass.on('boxready', function(component, eOpts) {
			thisClass.setLoading(label_map.loading);
		});
		thisClass.on('viewready', function(component, eOpts) {
					var settings = [];
					var filterUrl = '';
					var record = thisClass.record;
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
					}
//					thisClass.setLoading(label_map.loading);
					filterUrl = thisClass.generateUrl(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});
		var objDefaultArr = [{
					header : getLabel("account", "Account"),
					dataIndex : 'ACCOUNT',
					flex : 1
				}, {
					header : label_map.ledgerBal,
					dataIndex : 'BALANCE',
					align : 'right',
					flex : 1
				}, {
					header : getLabel("availableBal", "Available Balance"),// label_map.availableBal,
					dataIndex : 'AVAILABLE_BALANCE',
					align : 'right',
					flex : 1
				}, {
					header : label_map.projectEODBalance,
					dataIndex : 'TOTAL_ECB',
					align : 'right',
					flex : 1
				}, {
					header : getLabel("summaryDate",
							"Date Time of Refresh/Update"),
					dataIndex : 'SUMMARY_DATE',
					flex : 1
				}];

		var settings = thisClass.record.get('settings');
		var arrColPref = [];
		for (var i = 0; i < settings.length; i++) {
			if (settings[i].field === 'colPref') {
				arrColPref = settings[i].value1.columns;
				break;
			}
		}
		var columnModel = (!Ext.isEmpty(arrColPref))
				? arrColPref
				: objDefaultArr;

		for (var i = 0; i < columnModel.length; i++) {
			columnModel[i].renderer = function(value, meta, record, row,
					column, store) {
				meta.tdAttr = 'title="' + (value) + '"';
				if (meta.column.dataIndex === "BALANCE") {
					var balance = record.data.BALANCE;
					if (!Ext.isEmpty(record.data.BALANCE)
							&& !Ext.isEmpty(record.data.CCY_SYMBOL)) {
						var balanceStr = balance.toString();
						balance = balanceStr.replace(/,/g, "");
						balance = (balance || '').replace(/\s/g, "");
						if (balance > 0) {
							return record.data.CCY_SYMBOL + " "
									+ record.data.BALANCE;
						} else {
							// balance = balance*-1;
							return '<span class="red">' + ' ('
									+ record.data.CCY_SYMBOL + " "
									+ record.data.BALANCE + ')' + '</span>';
						}
					}
				} else if (meta.column.dataIndex === "AVAILABLE_BALANCE") {

					var availbalance = record.data.AVAILABLE_BALANCE;
					if (!Ext.isEmpty(record.data.AVAILABLE_BALANCE)
							&& !Ext.isEmpty(record.data.CCY_SYMBOL)) {
						availbalance = availbalance.toString();
						availbalance = (availbalance || '').replace(/,/g, "");
						availbalance = (availbalance || '').replace(/\s/g, "");
						if (availbalance > 0) {
							return record.data.CCY_SYMBOL + " "
									+ record.data.AVAILABLE_BALANCE + " "

						} else {
							var temp = 0.00;
							return "(" + " " + record.data.CCY_SYMBOL + " "
									+ record.data.AVAILABLE_BALANCE + " " + ")";
						}
					}
				} else if (meta.column.dataIndex === "TOTAL_ECB") {
					var balance = record.data.TOTAL_ECB;
					if (!Ext.isEmpty(record.data.TOTAL_ECB)
							&& !Ext.isEmpty(record.data.CCY_SYMBOL)) {
						balance = balance.replace(/,/g, "");
						balance = (balance || '').replace(/\s/g, "");
						if (balance > 0) {
							return record.data.CCY_SYMBOL + " "
									+ record.data.TOTAL_ECB;
						} else {
							// balance = balance*-1;
							return '<span class="red1">' + ' ('
									+ record.data.CCY_SYMBOL + " "
									+ record.data.TOTAL_ECB + ')' + '</span>';
						}
					}
				}
				return value;
			}
		}

		thisClass.columns = columnModel;
		thisClass.dockedItems = [{
			xtype : 'toolbar',
			dock : 'bottom',
			overCls : 'widgetTable-footer',
			layout : {
				pack : 'center',
				type : 'hbox'
			},
			items : [{
				type : 'button',
				text : getLabel("seeMore", "See More"),
				cls : 'widget-footer-cls',
				handler : function() {
					thisClass.fireEvent('seeMoreAccountRecords',
							thisClass.strFilter, thisClass.record
									.get('settings'));
				}
			}]
		}];

		this.callParent();
	},
	ajaxRequest : function(filterUrl, settings) {
		var obj;
		var thisClass = this;
		thisClass.setTitle(settings);
		var strUrl = '';
		if (!Ext.isEmpty(filterUrl))
			strUrl = strUrl + filterUrl;

		if (strUrl.charAt(0) == "?") { //remove first qstnmark
			strUrl = strUrl.substr(1);
		}
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = strUrl || {}, arrMatches;
		if (thisClass.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(strUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
		}
		Ext.Ajax.request({
					url : 'services/getAccountSummaryWidgetData.json',//strUrl,
					method : 'POST',
					params : objParam,
					success : function(response) {
						obj = Ext.decode(response.responseText);
						thisClass.loadData(obj);
						thisClass.setRefreshLabel(0);
					},
					failure : function(response) {
						if (response.status === 0) {
							thisClass.mask.msg = label_map.serverStopmsg;
						} else if (response.status === 400) {
							thisClass.setLoading(false);
							var fbarInstance = thisClass.down('toolbar');
							fbarInstance.hide();
						} else if (response.status === 500) {
							thisClass.setLoading(false);
							var fbarInstance = thisClass.down('toolbar');
							fbarInstance.hide();
						} else
							thisClass.mask.msg = response.statusText;
					}
				});
	},
	loadData : function(data) {
		var me = this;
		var storeData = [];
		var arrData = data.summary.d.commonDataTable;
		if (arrData.length < 5) {
			var fbarInstance = me.down('toolbar');
			fbarInstance.hide();
		}
		if (arrData.length >= 5) {
			var fbarInstance = me.down('toolbar');
			fbarInstance.show();
		}
		/*Ext.each(arrData, function(object, index) {
					var arrCol = object;
					var colJson = {};
					var accno = "";
					var str = "";
					Ext.each(arrCol, function(colObj, colIndex) {
								//colJson[colObj.columnName] = colObj.value;
								if (colObj.columnName == "ACCOUNT_NMBR") {
									accno = colObj.value;
								} else if (colObj.columnName == "ACCOUNT_NAME"
										&& !Ext.isEmpty(accno)) {
									str = accno + " " + ":" + " "
											+ colObj.value;
									flag = true;
									colJson['ACCOUNT'] = str;
								} else
									colJson[colObj.columnName] = colObj.value;
							});
					storeData.push(colJson);
				});*/

		if (undefined != data.summary && undefined != data.summary.d) {
			var arrData = data.summary.d.commonDataTable;
			if (!Ext.isEmpty(arrData)) {
				for (var i = 0; i < 5 && i < arrData.length; i++) {
					var colJson = {};
					if (arrData[i]) {
						colJson["ACCOUNT"] = arrData[i].ACCOUNT_NAME + " : "
								+ arrData[i].ACCOUNT_NMBR;
						colJson["BALANCE"] = arrData[i].BALANCE;
						colJson["CCY_SYMBOL"] = arrData[i].CCY_SYMBOL;
						colJson["TOTAL_ECB"] = arrData[i].TOTAL_ECB;
						colJson["AVAILABLE_BALANCE"] = arrData[i].AVAILABLE_BALANCE;
						colJson["SUMMARY_DATE"] = arrData[i].SUMMARY_DATE;
					}
					storeData.push(colJson);
				}
			}
		}
		me.getStore().loadData(storeData);
		me.setLoading(false);
	},
	generateUrl : function(settings) {
		var thisClass = this;
		var strUrl = '';
		var accountTypeFilterPresent = false;
		var accountFilterPresent = false;
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {
				if (settings[index].field != 'customname'
						&& settings[index].field != 'colPref') {
					if (settings[index].field === 'account'
							|| settings[index].field === 'accountset') {
						thisClass.accountFilter = '$accountID='
								+ settings[index].value1;
						accountFilterPresent = true;
						continue;
					}
					if (settings[index].field === 'accountType') {
						thisClass.accountTypeFilter = '$filterValue='
								+ settings[index].value1;
						accountTypeFilterPresent = true;
						continue;
					}
				}
			}
		}
		if (!accountFilterPresent)
			thisClass.accountFilter = '$accountID=ALL';
		if (!accountTypeFilterPresent)
			thisClass.accountTypeFilter = '$filterValue=';
		if (!Ext.isEmpty(thisClass.accountTypeFilter))
			strUrl = strUrl + '&' + thisClass.accountTypeFilter;

		if (!Ext.isEmpty(thisClass.accountFilter))
			strUrl = strUrl + '&' + thisClass.accountFilter;

		return strUrl;
	},
	handleStateChange : function(ct, colmn, width, opts) {
		var thisClass = this;
		thisClass.up('panel').fireEvent('statechanged', thisClass.record,
				thisClass.getGridState())
	},
	getGridState : function() {
		var me = this;
		var arrCols = null, objCol = null, objCfg = null, arrColPref = null, objState = {};
		arrCols = me.headerCt.getGridColumns();
		arrColPref = new Array();
		for (var j = 0; j < arrCols.length; j++) {
			objCol = arrCols[j];
			if (!Ext.isEmpty(objCol)) {
				objCfg = {
					dataIndex : objCol.dataIndex,
					header : objCol.text,
					hidden : objCol.hidden,
					flex : objCol.flex,
					sortable : objCol.sortable,
					align : objCol.align,
					menuDisabled:true,
					draggable :false,
					resizable : false
				};
				if (!Ext.isEmpty(objCol.locked))
					objCfg.locked = objCol.locked;
				arrColPref.push(objCfg);
			}
		}
		objState['columns'] = arrColPref;
		return objState;
	},
	setRefreshLabel : function() {
		var thisClass = this;
		$("#" + thisClass.titleId).empty();
		var label = Ext.create('Ext.form.Label', {
					text : getLabel('asof',"As of ")+ displaycurrenttime(),
					margin : '0 0 0 5',
					style : {
						'font-size' : '14px !important',
						'font-weight' : 'bold',
						'position' : 'absolute',
						'right' : '50px',
						'color' : '#67686b'
					},
					renderTo : Ext.get(thisClass.titleId)
				});
	},
	showSettingsPopup : function(widgetCode, titleforsettings, record) {
		var me = this;
		var portletSettings = Ext.create('Ext.window.Window', {
					record : record,
					minHeight : 156,
					maxHeight : 550,
					cls : 'settings-popup xn-popup',
					buttonAlign : 'center',
					itemId : widgetCode + 'SettingsPanel',
					title : titleforsettings,
					autoHeight : true,
					width : 450,
					modal : true,
					resizable : false,
					draggable : false,
					items : me.getSettingsPanel(),
					listeners : {
						resize : function(){
							this.center();
						}
					},
					bbar : [{
								text : getLabel("cancel", "Cancel"),
								//cls : 'ux-button-s ft-button-secondary footer-btns',
								handler : function() {
									this.up('window').close();
								}
							}, '->', {
								text : getLabel("save", "Save"),
								//cls : 'settings-oneCol-popup-btn',
								handler : function() {
									var settings = me.getSettings(this
											.up('window'));
									me.record.set('settings', settings);
									me.setLoading(label_map.loading);
									var filterUrl = me.generateUrl(settings);
									me.ajaxRequest(filterUrl, settings);
									me.up('panel').fireEvent('saveSettings',
											record, settings);
									this.up('window').close();
								}
							}]
				});
		portletSettings.show();
		me.addAccountGroup(portletSettings);
		me.setSettings(portletSettings, me.record.get('settings'));
	},
	setTitle : function(settings) {
		var me = this;
		var titleChangeFlag = false;
		for (var i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			if (fieldName === 'customname' && !Ext.isEmpty(fieldVal)) {
				me.up('panel').setTitle(fieldVal + '<span id=' + me.titleId
						+ '>&nbsp;&nbsp;</span> ');
				titleChangeFlag = true;
				break;
			}
		}
		if (!titleChangeFlag) {
			var defaultTitle = label_map[me.record.get('widgetCode')
					.toLowerCase()];
			me.up('panel').setTitle(defaultTitle + '<span id=' + me.titleId
					+ '>&nbsp;&nbsp;</span> ');
		}
	},
	getSettingsPanel : function() {
		var me = this;
		var accountTypeStore = Ext.create('Ext.data.Store', {
					fields : ['colId', 'colDesc']
				});

		Ext.Ajax.request({
					url : 'services/userseek/accountTypeSeek.json',
					method : 'GET',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (accountTypeStore) {
							accountTypeStore.removeAll();
							var count = data.length;
							if (count > 0) {
								accountTypeStore.add({
											'colId' : 'All',
											'colDesc' : 'All'
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'colId' : data[index].SUB_FACILITY_CODE,
									'colDesc' : data[index].SUB_FACILITY_DESC
								}
								accountTypeStore.add(record);
							}
						}
					},
					failure : function() {
						thisClass.getTargetEl().unmask();
						thisClass.setLoading(false);
			          	var fbarInstance = thisClass.down('toolbar');
							fbarInstance.hide();
					}
				});

		var settingsPanel = Ext.create('Ext.panel.Panel', {
			//padding : '10 10 10 10',
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'hbox',
					items : [{
						xtype : 'container',
						layout : 'vbox',
						cls : 'ft-padding-bottom',
						items : [{
									xtype : 'radiogroup',
									itemId : 'accountRadioGrp',
									columns : [80, 120],
									items : [],
									width : 300
								}, {
									xtype : 'container',
									itemId : 'accTypAutoComp',
									items : [{
										xtype : 'AutoCompleter',
										fieldLabel : '',
										emptyText : getLabel('searchAcc','Search By Account'),
										fieldCls : 'xn-form-text  xn-suggestion-box',
										itemId : 'accAutoComp',
										cls : 'autoCmplete-field',
										labelSeparator : '',
										width  : (screen.width) > 1024 ? 300 : 300,
										fitToParent : true,
										cfgUrl : 'services/balancesummary/btruseraccountsforwidgets.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'btruseraccounts',
										cfgRootNode : 'd.btruseraccount',
										cfgDataNode1 : 'accountName',
										cfgDataNode2 : 'accountNumber',
										cfgKeyNode : 'accountId',
										cfgProxyMethodType : 'POST',
										cfgDelimiter:'|&nbsp&nbsp&nbsp',
										listeners : {
											select : function(combo, record,
													index) {
											}
										}
									}, {
										xtype : 'AutoCompleter',
										fieldLabel : '',
										emptyText : getLabel('searchAccGrp','Search By Account Group'),
										fieldCls : 'xn-form-text  xn-suggestion-box',
										itemId : 'accSetAutoComp',
										hidden : true,
										width  : (screen.width) > 1024 ? 300 : 300,
										fitToParent : true,
										cls : 'autoCmplete-field',
										labelSeparator : '',
										cfgUrl : 'services/transcationSearch/accountSetForWidgets.json',
										// cfgUrl
										// :
										// 'static/scripts/btr/transactionSearch/data/accountSet.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'accountSet',
										cfgRootNode : 'd.userAccount',
										cfgDataNode1 : 'accountSetName',
										cfgDataNode2 : 'accounts',
										cfgKeyNode : 'accounts',
										cfgProxyMethodType : 'POST',
										arrAccountVal : '',
										cfgDelimiter:'|&nbsp&nbsp&nbsp',
										listeners : {
											select : function(combo, record,
													index) {
												if (record
														&& record[0].data
														&& record[0].data.accounts)
													combo.arrAccountVal = record[0].data.accounts;
											}
										}
									}]

								}]
					}]
				}, {
					xtype : 'container',
					layout : 'hbox',
					//flex : 0.38,
					cls : 'ft-padding-bottom',
					items : [{
								xtype : 'combo',
								itemId : 'accountType',
								multiSelect : false,
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								fieldCls : 'ux_no-border-right xn-form-field',
								triggerBaseCls : 'xn-form-trigger',
								editable : false,
								displayField : 'colDesc',
								valueField : 'colId',
								width  : (screen.width) > 1024 ? 300 : 300,
								queryMode : 'local',
								value : 'All',
								store : accountTypeStore,
								fieldLabel : getLabel("accountType",
										"Account Type")
							}]
				}, {
					xtype : 'container',
					layout : 'vbox',
					//flex : 0.24,
					margin : '0 0 0 0',
					items : [{
								xtype : 'textfield',
								hideTrigger : true,
								labelAlign : 'top',
								labelSeparator : '',
								width  : (screen.width) > 1024 ? 300 : 300,
								fieldLabel : getLabel("widgetName",
										"Widget Name"),
								itemId : 'customname',
								fieldCls : 'xn-form-text',
								labelCls : 'frmLabel',
								name : 'customname',
								maxLength : 40, // restrict user to enter 40 chars max
								enforceMaxLength : true,
								maskRe : /[A-Za-z0-9 .]/
							}]
				}]
			}]
		});
		return settingsPanel;
	},

	setSettings : function(widget, settings) {
		var typeCodePresent = false;
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			operatorValue = settings[i].operator;

			// Account/Account Set
			// Values

			var objAutoCompRef1 = null;
			var objAutoCompRef2 = null;
			if (fieldName === 'account') {
				var accRadio = widget.down('radio[inputValue="A"]');
				accRadio.setValue(true);
				objAutoCompRef1 = widget
						.down('AutoCompleter[itemId=accAutoComp]');
				objAutoCompRef2 = widget
						.down('AutoCompleter[itemId=accSetAutoComp]');
				if (!Ext.isEmpty(objAutoCompRef1) && !Ext.isEmpty(fieldVal)) {
					objAutoCompRef1.store.add({
								"accountName" : fieldVal2,
								"accountId" : fieldVal
							});
					objAutoCompRef1.setValue(fieldVal);
					objAutoCompRef2.setValue('');
				}
			}
			if (fieldName === 'accountset') {
				var accsRadio = widget.down('radio[inputValue="AS"]');
				accsRadio.setValue(true);
				objAutoCompRef1 = widget
						.down('AutoCompleter[itemId=accSetAutoComp]');
				objAutoCompRef2 = widget
						.down('AutoCompleter[itemId=accAutoComp]');
				if (!Ext.isEmpty(objAutoCompRef1) && !Ext.isEmpty(fieldVal)) {
					objAutoCompRef1.store.add({
								"accountSetName" : fieldVal2,
								"accounts" : fieldVal
							});
					objAutoCompRef1.arrAccountVal = fieldVal;
					objAutoCompRef1.setValue(fieldVal2);
					objAutoCompRef2.setValue('');
				}
			}
			// Custon Name Set Values
			if (fieldName === 'customname') {
				var customnameField = widget
						.down('textfield[itemId=customname]');
				if (!Ext.isEmpty(customnameField)) {
					if (!Ext.isEmpty(fieldVal))
						customnameField.setValue(fieldVal);
				}
			}

			// Account Type
			if (fieldName === 'accountType') {
				var paymentCategoryValue = widget
						.down('combo[itemId="accountType"]');
				if (!Ext.isEmpty(paymentCategoryValue)) {
					if (!Ext.isEmpty(fieldVal))
						paymentCategoryValue.setValue(fieldVal);
				}
			}

		}

	},
	getSettings : function(portletPanel) {
		var me = portletPanel;
		var jsonArray = [];

		// Account/ Account Group
		var getCheckedBtnA = me.down('radio[inputValue="A"]').checked;
		var accAutoCompVal = me.down('AutoCompleter[itemId="accAutoComp"]')
				.getValue();
		var accAutoDispVal = me.down('AutoCompleter[itemId="accAutoComp"]')
				.getRawValue();
		if (!Ext.isEmpty(accAutoCompVal) && getCheckedBtnA == true) {
			jsonArray.push({
						field : 'account',
						operator : 'eq',
						value1 : accAutoCompVal,
						value2 : accAutoDispVal,
						dataType : 0,
						displayType : 4
					});
		}

		var getCheckedBtnAS = me.down('radio[inputValue="AS"]').checked;
		var accSetAutoCompVal = me
				.down('AutoCompleter[itemId="accSetAutoComp"]').arrAccountVal;
		var accSetAutoDispVal = me
				.down('AutoCompleter[itemId="accSetAutoComp"]').getRawValue();
		if (!Ext.isEmpty(accSetAutoCompVal) && getCheckedBtnAS == true
				&& !Ext.isEmpty(accSetAutoDispVal)) {
			jsonArray.push({
						field : 'accountset',
						operator : 'eq',
						value1 : accSetAutoCompVal,
						value2 : accSetAutoDispVal,
						dataType : 0,
						displayType : 4
					});
		}

		// custom Name
		var customnameValue = me.down('textfield[itemId="customname"]')
				.getValue();
		if (!Ext.isEmpty(customnameValue)) {
			jsonArray.push({
						field : 'customname',
						operator : 'eq',
						value1 : customnameValue,
						dataType : 0,
						displayType : 6
					});
		}

		// Account Type
		var accTypString = me.down('combo[itemId="accountType"]').getValue();
		if (!Ext.isEmpty(accTypString) && accTypString != 'All') {
			jsonArray.push({
						field : 'accountType',
						operator : 'eq',
						value1 : accTypString,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		return jsonArray;
	},

	getDataPanel : function() {
		return this;
	},
	addAccountGroup : function(portletSettings) {
		var me = this;
		var arrMenuItem = portletSettings
				.down('radiogroup[itemId="accountRadioGrp"]');
		arrMenuItem.add({
					boxLabel : getLabel('account', 'Account'),
					name : 'account',
					inputValue : 'A',
					checked : true,
					handler : function(cb, nv, ov) {
						me.handleAccTypAutoComp(portletSettings, cb, nv, ov);
					}
				});

		arrMenuItem.add({
					boxLabel : getLabel('accountSet', 'Account Group'),
					name : 'account',
					inputValue : 'AS',
					handler : function(cb, nv, ov) {
						me.handleAccTypAutoComp(portletSettings, cb, nv, ov);
					}
				});
	},
	handleAccTypAutoComp : function(portlet, cb, nv, ov) {
		var me = this;
		var objAutoCmp = portlet.down('container[itemId="accTypAutoComp"]')
		var objAccAllAutoComp = portlet
				.down('AutoCompleter[itemId="accAutoComp"]');
		var objAccSetAutoComp = portlet
				.down('AutoCompleter[itemId="accSetAutoComp"]');
		if (!Ext.isEmpty(objAutoCmp)) {
			var objRadioBtn = cb.inputValue;
			if (!Ext.isEmpty(objRadioBtn) && objRadioBtn == 'A' && nv == true) {

				if (!Ext.isEmpty(objAccAllAutoComp))
					objAccAllAutoComp.show();
				objAccAllAutoComp.suspendEvent('change');
				objAccAllAutoComp.setValue('');
				objAccAllAutoComp.resumeEvent('change');
				if (!Ext.isEmpty(objAccSetAutoComp))
					objAccSetAutoComp.hide();

			} else if (!Ext.isEmpty(objRadioBtn) && objRadioBtn == 'AS'
					&& nv == true) {

				if (!Ext.isEmpty(objAccAllAutoComp))
					objAccAllAutoComp.hide();
				if (!Ext.isEmpty(objAccSetAutoComp))
					objAccSetAutoComp.show();
				objAccSetAutoComp.setValue('');
			}
		}
	}
});