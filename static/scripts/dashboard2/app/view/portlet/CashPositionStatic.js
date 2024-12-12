Ext.define('Cashweb.view.portlet.CashPositionStatic', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.cashpositionstatic',
	cols : 2,
	cls : 'cp-details-wgt',
	ccyCode : '',
	enableColumnMove : false,
	enableColumnResize : false,
	enableLocking : true,
	enableColumnHide : false,
	summaryFromDateFilter : '',
	summaryToDateFilter : '',
	crDrFlag : 'all',
	accountId : 'All',
	bank : '',
	initComponent : function() {
		var me = this;
		me.store = new Cashweb.store.CashPositionDtlStore();
		me.on('refreshWidget', function() {
					var record = me.record, settings = [];
					var filterUrl = '';
					me.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					filterUrl = me.generateUrl(settings);
					me.ajaxRequest(filterUrl, settings);
				});
		me.on('render', function(component, eOpts) {
					var settings = [];
					var filterUrl = '';
					var record = me.record;
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'ccy')
							me.ccyCode = settings[i].value1;
					}
					filterUrl = me.generateUrl(settings);
					me.strFilterUrl = filterUrl;
					me.ajaxRequest(filterUrl, settings);
				});
		var objDefaultArr = [{
					header : "",
					dataIndex : 'desc',
					flex : 0.60,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("trasanctionCount", "Transaction Count"),
					dataIndex : 'count',
					align : 'right',
					flex : 0.20,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("current", "Current"),
					dataIndex : 'current',
					align : 'right',
					flex : 0.20,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}];
		var columnModel = objDefaultArr;
		for (var i = 0; i < columnModel.length; i++) {
			columnModel[i].renderer = function(value, meta, record, row,
					column, store) {
				meta.tdAttr = 'title="' + (value) + '"';
				if (meta.column.dataIndex === "desc"
						&& ("posted_header" === record.data.type
								|| "pendingcr_header" === record.data.type
								|| "pendingdr_header" === record.data.type || "estimate_header" === record.data.type)) {
					var desc = record.data.desc;
					return '<span style="font-weight: 600; color:#1670A8">'
							+ desc + '</span>';
				}
				if (meta.column.dataIndex === "current"
						&& ("posted_header" === record.data.type
								|| "pendingcr_header" === record.data.type
								|| "pendingdr_header" === record.data.type || "estimate_header" === record.data.type)) {
					var desc = record.data.current;
					return '<span style="font-weight: 600; color:#1670A8">'
							+ desc + '</span>';
				} else if (meta.column.dataIndex === "desc") {
					var desc = record.data.desc;
					return '<span style="margin-left: 30px;">' + desc
							+ '</span>';
				}
				return value;
			}
		}
		me.bbar = [{
			xtype : 'label',
			text : 'Note : Intra Day data is available for <x> out of <y> accounts',
			style : {
				color : 'red'
			}
		}, '->', {
			type : 'button',
			text : getLabel("seeMore", "See More"),
			cls : 'xn-account-filter-btnmenu',
			handler : function() {
				me.fireEvent('seeMoreAccountRecords');
			}
		}];
		me.columns = columnModel;
		me.callParent();
	},
	ajaxRequest : function(filterUrl, setting) {
		var obj;
		var thisClass = this;
		var strUrl = '';
		if (!Ext.isEmpty(filterUrl))
			strUrl = strUrl + filterUrl;

		if (strUrl.charAt(0) == "?") { // remove first qstnmark
			strUrl = strUrl.substr(1);
		}
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = strUrl || {}, arrMatches;
		if (thisClass.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(strUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
		}
		thisClass.setTitle(setting);
		obj = {
			"summary" : {
				"posted" : [{
							"desc" : "Direct Deposit Accounts",
							"current" : '700,000.00',
							"txnType" : "SUBFAC0102",
							"count" : 20
						}, {
							"desc" : "Timed Deposit Acounts",
							"current" : "100,000.09",
							"txnType" : "SUBFAC0101",
							"count" : 20
						}, {
							"desc" : "Savings Account",
							"current" : "100,000.00",
							"txnType" : "SUBFAC0101",
							"count" : 20
						}],
				"pending" : [{
							"desc" : "Pending Trnasactions",
							"current" : "500,000.35",
							"txnType" : "CR",
							"count" : 17
						}, {
							"desc" : "ACH",
							"current" : "2,0000.20",
							"txnType" : "CR",
							"count" : 23
						}, {
							"desc" : "Wires",
							"current" : "250,000.25",
							"txnType" : "CR",
							"count" : 13
						}, {
							"desc" : "Controlled Disbursement",
							"current" : "98,000.00",
							"txnType" : "CR",
							"count" : 15
						}, {
							"desc" : "Pending Trnasactions",
							"current" : "100,000.00",
							"txnType" : "DB",
							"count" : 20
						}, {
							"desc" : "Incoming transaction",
							"current" : "200,000.23",
							"txnType" : "DB",
							"count" : 20
						}, {
							"desc" : "Remote Deposit",
							"current" : "150,000.20",
							"txnType" : "DB",
							"count" : 18
						}, {
							"desc" : "Lockbox Deposit",
							"current" : "150,000.00",
							"txnType" : "DB",
							"count" : 20
						}]
			},
			"currency" : "USD",
			"ccy_symbol" : "$"
		};	
		
		 Ext.Ajax.request({
					url : 'services/getCashPositionDetails.json',// strUrl,
					method : 'POST',
					params : objParam,
					success : function(response) {
						//obj = Ext.decode(response.responseText);
						//console.log(obj);
						if (thisClass.ccyCode === '')
							thisClass.ccyCode = obj.currency;
						thisClass.loadData(obj);
					},
					failure : function(response) {
						thisClass.loadData(obj);
					}
				});
		if (thisClass.ccyCode === '')
			thisClass.ccyCode = obj.currency;
	},
	setTitle : function(settings) {
		var me = this;
		var titleChangeFlag = false;
		for (var i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			if (fieldName === 'customname' && !Ext.isEmpty(fieldVal)) {
				me.up('panel').setTitle(fieldVal + ' as of ' + displayDate
						+ '<span id=' + me.titleId + '>&nbsp;&nbsp;</span> ');
				titleChangeFlag = true;
				break;
			}
		}
		if (!titleChangeFlag) {
			var defaultTitle = label_map[me.record.get('widgetCode')
					.toLowerCase()];
			me.up('panel').setTitle(defaultTitle + ' as of ' + displayDate
					+ '<span id=' + me.titleId + '>&nbsp;&nbsp;</span> ');
		}
	},

	loadData : function(data) {
		var me = this;
		var storeData = [], postedStoreData = [], pendingcrStoreData = [], pendingdrStoreData = [];
		var postedTotalAmt = 0, pendingcrTotalAmt = 0, pendingdrTotalAmt = 0, totalAmt = 0;
		var postedData = data.summary.posted;
		var pendingData = data.summary.pending;
		if (!Ext.isEmpty(postedData)) {
			for (var i = 0; i < postedData.length; i++) {
				var colJson = {};
				colJson["desc"] = postedData[i].desc;
				colJson["count"] = postedData[i].count;
				colJson["current"] = data.ccy_symbol + ' '
						+ postedData[i].current;
				colJson["type"] = "posted";
				postedTotalAmt = '900,000.09';
				// postedTotalAmt
				// + parseInt(postedData[i].current);
				postedStoreData.push(colJson);
				if ((i + 1) === postedData.length) {
					var colJson = {};
					colJson["desc"] = getLabel("postedBalance","Posted Balance");
					colJson["current"] = data.ccy_symbol + ' ' + postedTotalAmt;
					colJson["type"] = "posted_header";
					postedStoreData.unshift(colJson);
				}
			}
		}
		if (!Ext.isEmpty(pendingData)) {
			for (var i = 0; i < pendingData.length; i++) {
				var colJson = {};
				if (pendingData[i].txnType === 'CR') {
					colJson["desc"] = pendingData[i].desc;
					colJson["count"] = pendingData[i].count;
					colJson["current"] = data.ccy_symbol + ' '
							+ pendingData[i].current;
					colJson["type"] = "pendingcr";
					pendingcrTotalAmt = '850,000.85';
					// pendingcrTotalAmt
					// + parseInt(pendingData[i].current);
					pendingcrStoreData.push(colJson);
				} else if (pendingData[i].txnType === 'DB') {
					colJson["desc"] = pendingData[i].desc;
					colJson["count"] = pendingData[i].count;
					colJson["current"] = data.ccy_symbol + ' '
							+ pendingData[i].current;
					colJson["type"] = "pendingdr";
					pendingdrTotalAmt = '700,000.43';
					// pendingdrTotalAmt
					// + parseInt(pendingData[i].current);
					pendingdrStoreData.push(colJson);
				}

			}
		}
		var colJson = {};
		colJson["desc"] = getLabel("pendingCredit","Pending Credits");
		colJson["current"] = data.ccy_symbol + ' ' + pendingcrTotalAmt;
		colJson["type"] = "pendingcr_header";
		pendingcrStoreData.unshift(colJson);
		var colJson = {};
		colJson["desc"] = getLabel("pendingDebit","Pending Debits");
		colJson["current"] = data.ccy_symbol + ' ' + pendingdrTotalAmt;
		colJson["type"] = "pendingdr_header";
		pendingdrStoreData.unshift(colJson);

		pendingcrStoreData = pendingcrStoreData.concat(pendingdrStoreData);
		storeData = postedStoreData.concat(pendingcrStoreData);
		totalAmt = '501,010.00';// postedTotalAmt + pendingcrTotalAmt +
								// pendingdrTotalAmt;

		var colJson = {};
		colJson["desc"] = getLabel("estimatedBalance","Estimated Balance");
		colJson["current"] = data.ccy_symbol + ' ' + totalAmt;
		colJson["type"] = "estimate_header";
		storeData.push(colJson);
		me.getStore().loadData(storeData);
		me.setLoading(false);
	},

	// Account field handling starts
	addAccountsMenuItems : function(creditPortlet) {
		var me = this;
		Ext.Ajax.request({
					url : 'services/balancesummary/btruseraccountsforwidgets.json',
					// + me.selectedCcyCode,
					// Add currency parameter above
					method : 'GET',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.btruseraccount;
						me.loadAccountMenu(creditPortlet, data);
					},
					failure : function() {
						// console.log("Error Occured - Addition
						// Failed");
					}
				});
	},
	loadAccountMenu : function(creditPortlet, data) {
		var me = this;
		var menuRef = creditPortlet.down('menu[itemId="accountMenu"]');
		if (!Ext.isEmpty(data)) {
			if (!Ext.isEmpty(menuRef)) {
				if (menuRef.items.length > 0) {
					menuRef.removeAll();
				}
			}
			var count = data.length;
			if (count > 0) {
				menuRef.add({
							xtype : 'menucheckitem',
							text : getLabel('all', 'All'),
							acctId : 'ALL',
							checked : true,
							listeners : {
								checkchange : function(item, checked) {
									me.accMenuAllHandler(creditPortlet, item,
											checked);
								}
							}
						});

				for (var index = 0; index < count; index++) {
					menuRef.add({
								xtype : 'menucheckitem',
								text : data[index].accountName,
								acctId : data[index].accountId,
								checked : true,
								listeners : {
									checkchange : function(item, checked) {
										me.updateAccountTextField(
												creditPortlet, item, checked);
									}
								}
							});
				}
			}
		}
	},
	accMenuAllHandler : function(creditPortlet, item, checked) {
		var me = this;
		var menuRef = creditPortlet.down('menu[itemId="accountMenu"]');
		var accountTextField = creditPortlet
				.down('textfield[itemId="accountNo"]');
		var itemArray = menuRef.items.items;

		if (checked) {
			me.allAccountItemChecked = true;
			for (var index = 1; index < itemArray.length; index++) {
				itemArray[index].setChecked(true);
			}
			if (!Ext.isEmpty(accountTextField)) {
				accountTextField.setValue("");
				accountTextField.setValue(getLabel('all', 'All'));
			}
		} else if (!me.allAccountItemUnChecked && !checked) {
			me.allAccountItemChecked = false;
			me.allAccountItemUnChecked = false;
			for (var index = 1; index < itemArray.length; index++) {
				accountTextField.setValue('');
				itemArray[index].setChecked(false);
			}
		} else {
			me.allAccountItemUnChecked = false;
		}
	},
	updateAccountTextField : function(creditPortlet, item, checked) {
		var me = this;
		var maxCountReached = false;
		var menuRef = creditPortlet.down('menu[itemId="accountMenu"]');

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = menuRef.items.items;
			var itemArrayLength = itemArray.length;
			var accountTextField = creditPortlet
					.down('textfield[itemId="accountNo"]');
			var textFieldData = '';
			var acctIdData = '';

			if (!me.allAccountItemChecked && checked) {
				me.allAccountItemUnChecked = false;
				var count = 1;
				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
						acctIdData += itemArray[index].acctId + ',';
						count++;

					}
				}

				if (count == itemArrayLength) {
					maxCountReached = true;
				}

			} else if (me.allAccountItemChecked && !checked) {
				if (itemArray[0].checked) {
					me.allAccountItemUnChecked = true;
					me.allAccountItemChecked = false;
					itemArray[0].setChecked(false);
				}

				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
						acctIdData += itemArray[index].acctId + ',';
					}
				}
			} else if (!me.allAccountItemChecked && !checked) {
				me.allAccountItemUnChecked = false;
				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
						acctIdData += itemArray[index].acctId + ',';
					}
				}
			}

			if (maxCountReached) {
				itemArray[0].setChecked(true);
			} else {
				var commaSeparatedString = textFieldData.substring(0,
						(textFieldData.length - 1));
				var commaSeparatedAcctIdString = acctIdData.substring(0,
						(acctIdData.length - 1));
				accountTextField.setValue('');
				accountTextField.setValue(commaSeparatedString);
				accountTextField.acctIdData = commaSeparatedAcctIdString;
			}
		}
	},
	showSettingsPopup : function(widgetCode, titleforsettings, record) {
		var me = this;
		var portletSettings = Ext.create('Ext.window.Window', {
					record : record,
					minHeight : 200,
					cls : 'settings-popup',
					buttonAlign : 'center',
					itemId : widgetCode + 'SettingsPanel',
					title : titleforsettings,
					autoHeight : true,
					width : 740,
					modal : true,
					resizable : false,
					items : me.getSettingsPanel(),
					buttons : [{
								text : getLabel("cancel", "Cancel"),
								cls : 'xn-btn ux-button-s ft-button-secondary',
								handler : function() {
									this.up('window').close();
								}
							}, '->', {
								text : getLabel("save", "Save"),
								cls : 'xn-btn ux-button-s',
								style : {
									'left' : '93.5% !important'
								},
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
		if (!Ext.isEmpty(me.ccyCode)) {
			var ccyField = portletSettings
					.down('AutoCompleter[itemId="Currency"]');
			if (!Ext.isEmpty(ccyField)) {
				ccyField.setValue(me.ccyCode);
			}
		}
		portletSettings.show();
		me.addAccountsMenuItems(portletSettings);
		me.addDatePanel(portletSettings);
		me.addDateMenu(portletSettings);
		me.setSettings(portletSettings, me.record.get('settings'));
	},
	addDatePanel : function(portletSettings) {
		var me = this;
		var dateParentPanel = Ext.create('Ext.panel.Panel', {
					cls : 'xn-filter-toolbar',
					layout : 'hbox',
					flex : 0.7,
					itemId : 'ParentPanel',
					items : []
				});
		me.addDateContainerPanel(dateParentPanel, portletSettings);
	},
	checkInfinity : function(intFilterDays) {
		if (intFilterDays == '0' || Ext.isEmpty(intFilterDays)) {
			return true;
		}
	},
	addDateMenu : function(portletSettings) {
		var me = this;
		var intFilterDays = me.filterRestrict;
		var arrMenuItem = portletSettings.down('menu[itemId="dateMenu"]');
		arrMenuItem.add({
					text : getLabel('latest', 'Latest'),
					btnId : 'btnLatest',
					parent : me,
					btnValue : '12',
					handler : function(btn, opts) {
						me.dateFilterVal = btn.btnValue;
						me.dateFilterLabel = btn.text;
						me.handleDateChange(portletSettings, btn.btnValue);
					}
				});

		if (intFilterDays >= 7 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : me,
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(portletSettings, btn.btnValue);
						}
					});

		if (intFilterDays >= 14 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : me,
						btnValue : '4',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(portletSettings, btn.btnValue);
						}
					});

		if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : me,
						btnValue : '5',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(portletSettings, btn.btnValue);
						}
					});

		if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : me,
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(portletSettings, btn.btnValue);
						}
					});

		if (intFilterDays >= 90 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : me,
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(portletSettings, btn.btnValue);
						}
					});

		if (intFilterDays >= 180 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : me,
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(portletSettings, btn.btnValue);
						}
					});

		arrMenuItem.add({
					text : "Date Range",
					btnId : 'btnDateRange',
					btnValue : '7',
					parent : me,
					handler : function(btn, opts) {
						var field = me.down('datefield[itemId="fromDate"]');
						if (field)
							field.setValue('');
						field = me.down('datefield[itemId="toDate"]');
						if (field)
							field.setValue('');
						me.dateFilterVal = btn.btnValue;
						me.dateFilterLabel = btn.text;
						me.handleDateChange(portletSettings, btn.btnValue);
					}
				});
	},
	addDateContainerPanel : function(dateParentPanel, portletSettings) {
		var me = this;
		var dateContainerPanel = Ext.create('Ext.panel.Panel', {
			layout : 'hbox',
			items : [{
				xtype : 'container',
				itemId : 'dateRangeComponent',
				layout : 'hbox',
				hidden : true,
				items : [{
					xtype : 'datefield',
					itemId : 'fromDate',
					hideTrigger : true,
					width : 82,
					fieldCls : 'h2',
					fieldStyle : 'background-color: white; font-weight:bold;',
					cls : 'date-range-font-size',
					padding : '0 3 0 0',
					editable : false,
					parent : me,
					endDateField : 'toDate',
					format : !Ext.isEmpty(strExtApplicationDateFormat)
							? strExtApplicationDateFormat
							: 'm/d/Y',
					listeners : {
						'change' : function(field, newValue, oldValue) {
							if (!Ext.isEmpty(newValue)) {
								var portlet2 = portletSettings
										.down('container[itemId="completDatePanel"]');
								var daterange = portlet2
										.down('container[itemId="dateRangeComponent"]');
								var toDate = daterange
										.down('datefield[itemId="toDate"]')
										.getValue();
								var frmDate = newValue;
								var dtParams = me.getDateParamForDateRange('7',
										frmDate, toDate);
								me.dateFilterFromVal = dtParams.fieldValue1;
								me.dateFilterToVal = dtParams.fieldValue2;
								portlet2.down('datefield[itemId="fromDate"]')
										.setMaxValue(me.dateFilterToVal);
								portlet2.down('datefield[itemId="toDate"]')
										.setMinValue(me.dateFilterFromVal);
							}
						}
					}
				}, {
					xtype : 'datefield',
					itemId : 'toDate',
					hideTrigger : true,
					padding : '0 3 0 0',
					editable : false,
					width : 83,
					margin : '0 0 0 2',
					fieldCls : 'h2',
					fieldStyle : 'background-color: white; font-weight:bold;',
					cls : 'date-range-font-size',
					parent : me,
					startDateField : 'fromDate',
					format : !Ext.isEmpty(strExtApplicationDateFormat)
							? strExtApplicationDateFormat
							: 'm/d/Y',
					listeners : {
						'change' : function(field, newValue, oldValue) {
							if (!Ext.isEmpty(newValue)) {
								var portlet2 = portletSettings
										.down('container[itemId="completDatePanel"]');
								var daterange = portlet2
										.down('container[itemId="dateRangeComponent"]');
								var frmDate = daterange
										.down('datefield[itemId="fromDate"]')
										.getValue();
								var toDate = newValue;
								var dtParams = me.getDateParamForDateRange('7',
										frmDate, toDate);
								me.dateFilterFromVal = dtParams.fieldValue1;
								me.dateFilterToVal = dtParams.fieldValue2;
								portlet2.down('datefield[itemId="fromDate"]')
										.setMaxValue(me.dateFilterToVal);
								portlet2.down('datefield[itemId="toDate"]')
										.setMinValue(me.dateFilterFromVal);
							}
						}
					}
				}]
			}]
		});
		dateParentPanel.add(dateContainerPanel);
		portletSettings.down('container[itemId="completDatePanel"]')
				.add(dateParentPanel);
	},
	// Payment Method field handlling ends
	handleDateChange : function(portlet2, index) {
		var me = this;
		var objDateParams = me.getDateParam(index, null);
		var fromDateLabel = portlet2.down('label[itemId="dateFilterFrom"]');
		var toDateLabel = portlet2.down('label[itemId="dateFilterTo"]');
		fromDateLabel.show();
		toDateLabel.show();
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			portlet2.down('label[itemId="creationDateLbl"]').setText("Date"
					+ " (" + me.dateFilterLabel + ")");
		}
		vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);

		if (index == '7') {
			var dtEntryDate = new Date(Ext.Date.parse(dtApplicationDate,
					strExtApplicationDateFormat));
			portlet2.down('container[itemId="dateRangeComponent"]').show();
			portlet2.down('label[itemId="dateFilterFrom"]').hide();
			portlet2.down('label[itemId="dateFilterTo"]').hide();
			portlet2.down('datefield[itemId="fromDate"]').setValue(dtEntryDate);
			portlet2.down('datefield[itemId="toDate"]').setValue(dtEntryDate);
			// portlet2.down('datefield[itemId="fromDate"]').setMinValue(clientFromDate);
			// portlet2.down('datefield[itemId="toDate"]').setMinValue(clientFromDate);

		} else {
			portlet2.down('container[itemId="dateRangeComponent"]').hide();
			portlet2.down('label[itemId="dateFilterFrom"]').show();
			portlet2.down('label[itemId="dateFilterTo"]').show();
		}
		if (index === '1' || index === '2' || index === '12') {
			if (index === '12') {
				// Do nothing for latest
				fromDateLabel.setText('' + '  ' + vFromDate);
				fromDateLabel.btnValue = objDateParams.btnValue;
			} else
				fromDateLabel.setText(vFromDate);

			toDateLabel.setText("");
		} else {
			fromDateLabel.setText(vFromDate + " - ");
			fromDateLabel.btnValue = objDateParams.btnValue;
			toDateLabel.setText(vToDate);
			me.vFromDate1 = vFromDate;
			me.vToDate1 = vToDate;
		}
	},
	getDateParamForDateRange : function(index, fromDate, toDate) {
		var me = this;
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		switch (index) {
			case '7' :
				// Date Range
				fieldValue1 = Ext.Date.format(fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
				operator = 'bt';
				break;
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		retObj.btnValue = index;
		return retObj;
	},
	getDateParam : function(index, dateType) {
		var me = this;
		var objDateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		switch (index) {
			case '3' :
				// This Week
				dtJson = objDateHandler.getThisWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '4' :
				// Last Week To Date
				dtJson = objDateHandler.getLastWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '8' :
				// This Quarter
				dtJson = objDateHandler.getQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '9' :
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '12' :
				// Latest
				// fieldValue1 = Ext.Date.format(date,
				// strSqlDateFormat);
				// fieldValue2 = fieldValue1;
				// operator = 'le';
				break;
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		retObj.btnValue = index;
		return retObj;
	},
	getSettingsPanel : function() {
		var thisClass = this;
		var settingsPanel = Ext.create('Ext.panel.Panel', {
			padding : '10 10 10 10',
			items : [{
				xtype : 'container',
				layout : {
					type : 'hbox',
					pack : 'center'
				},
				flex : 1,
				padding : '10 0 10 0',
				items : [{
					xtype : 'container',
					layout : 'hbox',
					flex : 0.38,
					items : [{
								xtype : 'AutoCompleter',
								flex : 0.24,
								fieldCls : 'xn-form-text w165 xn-suggestion-box',
								labelCls : 'frmLabel',
								fieldLabel : getLabel("CCY", "CCY"),
								labelAlign : 'top',
								labelSeparator : '',
								itemId : 'Currency',
								name : 'Currency',
								cfgUrl : 'services/userseek/paymentccy.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'Currency',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE',
								cfgKeyNode : 'CODE'

							}]
				}, {
					xtype : 'container',
					layout : 'vbox',
					flex : 0.38,
					items : [{
								xtype : 'label',
								text : getLabel("accounts", "Accounts"),
								cls : 'frmLabel'

							}, {
								xtype : 'container',
								layout : 'hbox',
								itemId : 'accountContainer',
								items : [{
									xtype : 'textfield',
									itemId : 'accountNo',
									width : 140,
									height : 25,
									acctIdData : '',
									name : 'accountNo',
									editable : false,
									fieldCls : 'ux_no-border-right xn-form-field',
									readOnly : true,
									value : 'All'
								}, {
									xtype : 'button',
									border : 0,
									height : 25,
									itemId : 'accountDropDown',
									cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
									iconCls : 'black',
									glyph : 'xf0d7@fontawesome',
									menuAlign : 'tr-br',
									menu : Ext.create('Ext.menu.Menu', {
												itemId : 'accountMenu',
												width : 165,
												cls : 'ux_dropdown',
												maxHeight : 200,
												items : []
											})
								}]
							}]
				}, {
					xtype : 'container',
					layout : 'hbox',
					flex : 0.38,
					items : [{
								xtype : 'combo',
								itemId : 'bank',
								multiSelect : false,
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								fieldCls : 'ux_no-border-right xn-form-field w165',
								triggerBaseCls : 'xn-form-trigger',
								editable : false,
								displayField : 'colDesc',
								valueField : 'colId',
								width : 165,
								queryMode : 'local',
								value : 'All',
								// store : accountTypeStore,
								fieldLabel : getLabel("bank", "Bank")
							}]
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				padding : '10 0 10 0',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'vbox',
					itemId : 'completDatePanel',
					flex : 0.38,
					items : [{
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'creationDateLbl',
									name : 'creationDateLbl',
									text : getLabel("date", "Date"),
									style : {
										'padding-right' : '10px !important'
									},
									cls : 'frmLabel'
								}, {
									xtype : 'button',
									border : 0,
									itemId : 'creationDateBtn',
									margin : '7 0 0 0',
									menuAlign : 'tr-br',
									name : 'creationDateBtn',
									cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
									glyph : 'xf0d7@fontawesome',
									menu : Ext.create('Ext.menu.Menu', {
										itemId : 'dateMenu',
										width : 175,
										cls : 'ux_dropdown ux_dropdown-no-leftpadding',
										maxHeight : 200,
										items : []
									})

								}]
					}, {
						xtype : 'container',
						itemId : 'CreateDate',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'dateFilterFrom',
									name : 'dateFilterFrom',
									btnValue : ''
								}, {
									xtype : 'label',
									itemId : 'dateFilterTo',
									name : 'dateFilterTo'
								}]
					}]
				}, {
					xtype : 'radiogroup',
					flex : 0.38,
					columns : [55, 62, 62],
					itemId : 'creditDebitFlag',
					labelAlign : 'top',
					labelSeparator : '',
					labelCls : 'frmLabel',
					fieldLabel : getLabel("transactionType", "Transaction Type"),
					items : [{
								boxLabel : getLabel("all", "All"),
								name : 'creditDebitFlag',
								inputValue : 'All',
								checked : true
							}, {
								boxLabel : getLabel("debit", "Debit"),
								name : 'creditDebitFlag',
								inputValue : 'D'
							}, {
								boxLabel : getLabel("credit", "Credit"),
								name : 'creditDebitFlag',
								inputValue : 'C'
							}]
				}, {
					xtype : 'textfield',
					hideTrigger : true,
					flex : 0.38,
					labelAlign : 'top',
					labelSeparator : '',
					fieldLabel : getLabel("widgetName", "Widget Name"),
					itemId : 'customname',
					fieldCls : 'xn-form-text w165',
					labelCls : 'frmLabel',
					name : 'customname',
					maxLength : 40, // restrict user to enter 40 chars max
					enforceMaxLength : true,
					maskRe : /[A-Za-z0-9 .]/
				}]
			}]
		});
		return settingsPanel;
	},
	generateUrl : function(settings) {
		var me = this;
		var ccyPresent = false, strFilter = '', accountPresent = false;
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {
				if (settings[index].field != 'customname') {
					if (settings[index].field === 'summaryFromDate') {
						me.summaryFromDateFilter = settings[index].value1;
						continue;
					}
					if (settings[index].field === 'summaryToDate') {
						me.summaryToDateFilter = settings[index].value1;
						continue;
					}
					if (settings[index].field === 'accountId') {
						me.accountId = settings[index].value1;
						accountPresent = true;
						continue;
					}
					if (settings[index].field === 'bank') {
						me.bank = settings[index].value1;
						continue;
					}
					if (settings[index].field === 'ccy') {
						if (!Ext.isEmpty(settings[index].value1)) {
							me.ccyCode = settings[index].value1;
							ccyPresent = true;
						}
						continue;
					}
					if (settings[index].field === 'CreditDebitFlag') {
						strFilter = strFilter + settings[index].field + ' '
								+ settings[index].operator + ' ' + '\''
								+ settings[index].value1 + '\'';
					}
				}
			}
			if (!ccyPresent)
				me.ccyCode = '';
			if (!accountPresent)
				me.accountId = '';
			var strUrl = '';
			// Date is mandetory so default Balance period will be
			// This week
			if (Ext.isEmpty(me.summaryFromDateFilter)
					|| Ext.isEmpty(me.summaryToDateFilter)) {
				var dtJson = {}, fieldValue1 = '', fieldValue2 = '';
				var objDateHandler = Ext.create('Ext.ux.gcp.DateUtil');
				var strAppDate = dtApplicationDate;
				var dtFormat = strExtApplicationDateFormat;
				var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
				var strSqlDateFormat = 'Y-m-d';
				dtJson = objDateHandler.getThisWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				me.summaryFromDateFilter = fieldValue1;
				me.summaryToDateFilter = fieldValue2;
			}
			if (!Ext.isEmpty(strFilter))
				strUrl = strUrl + '?$filter=' + strFilter;
			strUrl = strUrl + '&$summaryFromDate=' + me.summaryFromDateFilter;
			strUrl = strUrl + '&$summaryToDate=' + me.summaryToDateFilter;
			if (!Ext.isEmpty(me.ccyCode))
				strUrl = strUrl + '&$ccy=' + me.ccyCode;
			if (!Ext.isEmpty(me.accountId))
				strUrl = strUrl + '&$accountId=' + me.accountId;
			if (!Ext.isEmpty(me.bank))
				strUrl = strUrl + '&$filterValue=' + me.bank;
			return strUrl;
		}
	},
	setSettings : function(widget, settings) {
		var strSqlDateFormat = 'm/d/Y';
		var temp = widget.down('label[itemId="creationDateLbl"]');
		if (temp.text == "Date") {
			var dateFilterLabel = "Date (Latest)";
			widget.down('label[itemId="creationDateLbl"]')
					.setText(dateFilterLabel);
		}
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			operatorValue = settings[i].operator;
			// Curreny
			if (fieldName === 'ccy') {
				var ccyField = widget.down('AutoCompleter[itemId="Currency"]');
				if (!Ext.isEmpty(ccyField)) {
					if (!Ext.isEmpty(fieldVal2))
						ccyField.setValue(fieldVal2);
				}
			}
			// Accounts
			if (fieldName === 'accountId') {
				var menuRef = widget.down('menu[itemId="accountMenu"]');
				var account = widget.down('textfield[itemId="accountNo"]');
				if (!Ext.isEmpty(menuRef)) {
					var itemArray = menuRef.items.items;

					if (fieldVal === 'All') {
						for (var index = 0; index < itemArray.length; index++) {
							itemArray[index].setChecked(true);
						}
					} else {
						for (var index = 0; index < itemArray.length; index++) {
							itemArray[index].setChecked(false);
						}

						var dataArray = fieldVal2.split(',');
						for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
							for (var index = 1; index < itemArray.length; index++) {
								if (dataArray[dataIndex] == itemArray[index].text) {
									itemArray[index].setChecked(true);
								}
							}
						}
					}
				}
				if (!Ext.isEmpty(account)) {
					if (!Ext.isEmpty(fieldVal2))
						account.setValue(fieldVal2);
				}
			}

			// Bank
			if (fieldName === 'bank') {
				var bankName = widget.down('combo[itemId="bank"]');
				if (!Ext.isEmpty(bankName)) {
					if (!Ext.isEmpty(fieldVal))
						bankName.setValue(fieldVal);
				}
			}
			// Date
			if (fieldName === 'EntryDate') {
				var dateFilterLabel = settings[i].dateLabel;
				var datefrom = new Date(fieldVal);
				var dateto = new Date(fieldVal2);
				fieldVal = Ext.Date.format(datefrom, strSqlDateFormat);
				fieldVal2 = Ext.Date.format(dateto, strSqlDateFormat);
				if (dateFilterLabel.indexOf("Date Range") > -1) {
					widget.down('label[itemId="creationDateLbl"]')
							.setText(dateFilterLabel);
					widget.down('container[itemId="dateRangeComponent"]')
							.show();
					widget.down('label[itemId="dateFilterFrom"]').hide();
					widget.down('label[itemId="dateFilterTo"]').hide();
					widget.down('datefield[itemId="fromDate"]')
							.setValue(fieldVal);
					widget.down('datefield[itemId="toDate"]')
							.setValue(fieldVal2);
				} else {
					widget.down('label[itemId="dateFilterFrom"]').show();
					widget.down('label[itemId="dateFilterTo"]').show();
					if (!Ext.isEmpty(dateFilterLabel)) {
						widget.down('label[itemId="creationDateLbl"]')
								.setText(dateFilterLabel);
						widget.down('label[itemId="dateFilterFrom"]')
								.setText(fieldVal);
						widget.down('label[itemId="dateFilterTo"]').setText('-'
								+ fieldVal2);
					}
				}
			}

			// Credit Debit Flag
			if (fieldName === 'CreditDebitFlag') {

				if (fieldVal === 'D') {
					var debitRadio = widget.down('radio[inputValue="D"]');
					debitRadio.setValue(true);
				}
				if (fieldVal === 'C') {
					var creditRadio = widget.down('radio[inputValue="C"]');
					creditRadio.setValue(true);
				}
			}

			// Widget Name
			if (fieldName === 'customname') {
				var customnameField = widget
						.down('textfield[itemId=customname]');
				if (!Ext.isEmpty(customnameField)) {
					if (!Ext.isEmpty(fieldVal))
						customnameField.setValue(fieldVal);
				}
			}
		}
	},
	getSettings : function(portletPanel) {
		var me = portletPanel;
		var jsonArray = [];
		// Currency
		var currencyCode = me.down('AutoCompleter[itemId="Currency"]')
				.getValue();
		if (!Ext.isEmpty(currencyCode)) {
			jsonArray.push({
						field : 'ccy',
						value1 : currencyCode,
						operator : 'eq',
						dataType : 0,
						displayType : 6
					});
		}

		// Accounts
		var acctNo = me.down('textfield[itemId="accountNo"]').getValue();
		var acctIdData = me.down('textfield[itemId="accountNo"]').acctIdData;
		if (!Ext.isEmpty(acctNo) && acctNo != 'All') {
			jsonArray.push({
						field : 'accountId',
						operator : 'in',
						value1 : acctIdData,
						value2 : acctNo,
						dataType : 0,
						displayType : 0,
						detailFilter : 'Y'
					});
		}

		// Bank Name
		var bank = me.down('combo[itemId="bank"]').getValue();
		if (!Ext.isEmpty(bank) && bank != 'All') {
			jsonArray.push({
						field : 'bank',
						operator : 'eq',
						value1 : bank,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// CreditDebitFlag
		var creditDebitFlagValue = me
				.down('radiogroup[itemId="creditDebitFlag"]').getValue().creditDebitFlag;
		if (!Ext.isEmpty(creditDebitFlagValue) && creditDebitFlagValue != 'All') {
			jsonArray.push({
						field : 'CreditDebitFlag',
						operator : 'eq',
						value1 : creditDebitFlagValue,
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

		// Creation Date

		var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
		var fromCreation, toCreation, creationFromDate, creationToDate;
		if (dateLabel.indexOf("Date Range") > -1) {
			var portlet2 = me.down('container[itemId="completDatePanel"]');
			var daterange = portlet2
					.down('container[itemId="dateRangeComponent"]');
			fromCreation = daterange.down('datefield[itemId="fromDate"]')
					.getValue();
			toCreation = daterange.down('datefield[itemId="toDate"]')
					.getValue();

			if (Ext.isEmpty(toCreation)) {
				toCreation = fromCreation;
			}
			creationFromDate = fromCreation;
			creationToDate = toCreation;
		} else {
			fromCreation = me.down('label[itemId="dateFilterFrom"]');
			toCreation = me.down('label[itemId="dateFilterTo"]');
			if (!Ext.isEmpty(fromCreation.text)
					&& fromCreation.text.length > 10) {
				creationFromDate = (!Ext.isEmpty(fromCreation.text))
						? (fromCreation.text.substring(0,
								fromCreation.text.length - 3))
						: '';
			} else {
				creationFromDate = (!Ext.isEmpty(fromCreation.text))
						? fromCreation.text
						: '';
			}
			creationToDate = (!Ext.isEmpty(toCreation.text))
					? toCreation.text
					: '';
		}
		if (!(creationFromDate instanceof Date)
				&& (!creationFromDate.replace(/\s/g, '').length)) {
			creationFromDate = '';
		}
		if (!Ext.isEmpty(creationFromDate)) {
			jsonArray.push({
						field : 'EntryDate',
						operator : (!Ext.isEmpty(creationToDate)) ? 'bt' : 'eq',
						value1 : Ext.util.Format
								.date(creationFromDate, 'Y-m-d'),
						value2 : Ext.util.Format.date(creationToDate, 'Y-m-d'),
						dateLabel : dateLabel,
						dataType : 'D',
						displayType : 5,
						btnValue : fromCreation.btnValue
					});
		}
		return jsonArray;
	}
});