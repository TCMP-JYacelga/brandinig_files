Ext.define('Cashweb.view.portlet.PaymentsTrend', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.paymentstrend',
	requires : ['Cashweb.store.PaymentsTrendStore', 'Ext.chart.series.Bar'],
	border : false,
	cols : 1,
	emptyText : null,
	taskRunner : null,
	minHeight : 336,
	dateFilterLabel : getLabel("entryDate", "Entry Date"),
	bodyStyle: 'background:#fff',
	colorSet : [],
	hideHeaders : true,
	strFilter : '',
	ccyCode : '',
	navStore : null,
	allSendingAccountItemChecked : true,
	allSendingAccountItemUnChecked : false,
	dateFilterVal : '',
	allMyProductItemChecked : true,
	allMyProductItemUnChecked : false,
	dateHandler : null,
	vFromDate1 : null,
	vToDate1 : null,
	filterRestrict : '999',
	enableQueryParam : false,
	creation_date_opt : null,
	toolTip : null,
	selectedClientCode : null,
	selectedSellerCode : null,
	payCategoryData : null,
	payPackageData : null,
	datePickerSelectedDate : [],
	dateFilterLabel : getLabel('lastQuarterToDate','Last Quarter To Date'),
	dateFilterVal : '9',
	titleId : '',
	cls : 'chart_wgt',

	initComponent : function() {
		var me = this;
		var strClient = null;
		var strSellerCode = null;
		creation_date_opt = null;
		me.emptyText = label_map.noDataFound;

		me.on('refreshWidget', function() {
					var record = me.record, settings = [];
					var filterUrl = '';
					me.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'ccy')
							me.ccyCode = settings[i].value1;
						if (settings[i].field === 'PayReqEntryDate') {
							datePresentFlag = true;
						}
					}
					if (!datePresentFlag) {
						var objDateParams = me.getDateParam('9');
						settings.push({
									field : 'PayReqEntryDate',
									value1 : objDateParams.fieldValue1,
									value2 : objDateParams.fieldValue2,
									operator : objDateParams.operator,
									dataType : 'D',
									displayType : '9',
									btnValue : '9',
									dateLabel : getLabel("entryDate", "Entry Date")+" ("+getLabel('lastQuarterToDate','Last Quarter To Date')+")"
								});
								me.record.set('settings', settings);
					}
					filterUrl = me.generateUrl(settings);
					me.ajaxRequest(filterUrl, settings);
				});

		me.on('render', function(component, eOpts) {
					var settings = [];
					var filterUrl = '';
					var record = me.record;
					var datePresentFlag = false;
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
					}
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'ccy')
							me.ccyCode = settings[i].value1;
						if (settings[i].field === 'PayReqEntryDate') {
							me.dateFilterVal = settings[i].btnValue;
							me.datePickerSelectedDate[0]=Ext.Date.parse(settings[i].value1, 'Y-m-d');
							me.datePickerSelectedDate[1]=Ext.Date.parse(settings[i].value2, 'Y-m-d');
							datePresentFlag = true;
					}
					}
					if (!datePresentFlag) {
						var objDateParams = me.getDateParam('9');
						settings.push({
									field : 'PayReqEntryDate',
									value1 : objDateParams.fieldValue1,
									value2 : objDateParams.fieldValue2,
									operator : objDateParams.operator,
									dataType : 'D',
									displayType : '9',
									btnValue : '9',
									dateLabel : getLabel("entryDate", "Entry Date")+" (Last Quarter To Date)"
								});
								me.record.set('settings', settings);
					}
					filterUrl = me.generateUrl(settings);
					me.ajaxRequest(filterUrl, settings);
				});
		Ext.apply(this, {
					items : [{
								xtype : 'label',
								hidden : true,
								cls : 'font_normal',
								itemId : 'errorLabel',
								text : label_map.noDataFound
							}, {
								layout : {
									type : 'vbox',
									align : 'center'
								},
								bodyStyle: 'background:#fff',
								itemId : 'payTrendPanel',
								autoHeight : true,
								items : [{
											xtype : 'panel',
											itemId : 'chartPayTrendPanel',
											items : []
										}]
							}]
				});

		me.callParent(arguments);
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
	addClientMenu : function(summaryPortlet) {
		var menuRef = summaryPortlet.down('menu[itemId="clientMenu"]');
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json?$top=-1&$skip=-1',
			method : 'POST',
			// async : false,
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var data = responseData.d.preferences;
				var count = data.length;
				if (menuRef.items.length > 0) {
					menuRef.removeAll();
				}
				if (count > 0) {
					if (count > 1) {
						menuRef.add({
									text : getLabel('allCompanies',
											'All companies'),
									clientCode : 'all',
									handler : function(item, opts) {
										var clientField = summaryPortlet
												.down('textfield[itemId="Client"]');
										clientField.setValue(item.text);
										clientField.clientCodesData = item.clientCode;
									}
								});
					}

					for (var index = 0; index < count; index++) {
						menuRef.add({
									text : data[index].DESCR,
									clientCode : data[index].CODE,
									handler : function(item, opts) {
										var clientField = summaryPortlet
												.down('textfield[itemId="Client"]');
										clientField.setValue(item.text);
										clientField.clientCodesData = item.clientCode;
									}
								});
					}
					if (menuRef.items.length == 1) {
						summaryPortlet.down('textfield[itemId="Client"]')
								.setValue(menuRef.items.items[0].text);
					} else {
						if (Ext.isEmpty(summaryPortlet
								.down('textfield[itemId="Client"]').getValue()))
							summaryPortlet.down('textfield[itemId="Client"]')
									.setValue(menuRef.items.items[0].text);
					}
				}
			},
			failure : function(summaryPortlet) {
			}
		});
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
						text : getLabel('lastQuarterToDate','Last Quarter To Date'),
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
					text :  getLabel('daterange','Date Range'),
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
					fieldStyle : 'background-color: white; ',
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
					fieldStyle : 'background-color: white; ',
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
		fromDateLabel.addCls("label-font-normal");
		toDateLabel.addCls("label-font-normal");
		fromDateLabel.show();
		toDateLabel.show();
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			creation_date_opt = getLabel("entryDate", "Entry Date")+" (" + me.dateFilterLabel + ")";
			portlet2.down('label[itemId="creationDateLbl"]')
					.setText(getLabel("entryDate", "Entry Date") + " (" + me.dateFilterLabel + ")");
		}
		var vFromDate = Ext.Date.parse(
				objDateParams.fieldValue1, 'Y-m-d');
		var vToDate = Ext.Date.parse(
				objDateParams.fieldValue2, 'Y-m-d');

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

		if (index === '1' || index === '2') {
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
	/*getDateParam : function(index, dateType) {
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
	},*/

	loadMyProductMenu : function(summaryPortlet, data) {
		var me = this;
		var menuRef = summaryPortlet.down('menu[itemId="payMethodMenu"]');
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
							checked : true,
							tooltip : getLabel('all','All'),
							listeners : {
								checkchange : function(item, checked) {
									me.myProductMenuAllHandler(summaryPortlet,
											menuRef, item, checked);
								}
							}
						});

				for (var index = 0; index < count; index++) {
					menuRef.add({
								xtype : 'menucheckitem',
								text : data[index].DESCR,
								productCode : data[index].CODE,
								checked : true,
								tooltip : data[index].DESCR,
								listeners : {
									checkchange : function(item, checked) {
										me.updateMyProductTextField(
												summaryPortlet, menuRef, item,
												checked);
									}
								}
							});
				}
			}
		}
	},

	myProductMenuAllHandler : function(summaryPortlet, myProductMenuRef, item,
			checked) {
		var me = this;
		var myProductTextFieldRef = summaryPortlet
				.down('textfield[itemId="payMethod"]');
		var itemArray = myProductMenuRef.items.items;
		if (checked) {
			me.allMyProductItemChecked = true;
			for (var index = 1; index < itemArray.length; index++) {
				itemArray[index].setChecked(true);
			}

			if (!Ext.isEmpty(myProductTextFieldRef)) {
				myProductTextFieldRef.setValue(getLabel('all', 'All'));
			}

		} else if (!me.allMyProductItemUnChecked && !checked) {
			me.allMyProductItemChecked = false;
			me.allMyProductItemUnChecked = false;
			for (var index = 1; index < itemArray.length; index++) {
				myProductTextFieldRef.setValue('');
				itemArray[index].setChecked(false);
			}
		} else {
			me.allMyProductItemUnChecked = false;
		}
	},

	updateMyProductTextField : function(summaryPortlet, menuRef, item, checked) {
		var me = this;
		var maxCountReached = false;
		var myProductTextFieldRef = summaryPortlet
				.down('textfield[itemId="payMethod"]');

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = menuRef.items.items;
			var itemArrayLength = itemArray.length;
			var textFieldData = '';
			var productCodesData = '';

			if (!me.allMyProductItemChecked && checked) {
				me.allMyProductItemUnChecked = false;
				var count = 1;
				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
						productCodesData += itemArray[index].productCode + ',';
						count++;
					}
				}

				if (count == itemArrayLength) {
					maxCountReached = true;
				}

			} else if (me.allMyProductItemChecked && !checked) {
				if (itemArray[0].checked) {
					me.allMyProductItemUnChecked = true;
					me.allMyProductItemChecked = false;
					itemArray[0].setChecked(false);
				}

				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
						productCodesData += itemArray[index].productCode + ',';
					}
				}
			} else if (!me.allMyProductItemChecked && !checked) {
				me.allMyProductItemUnChecked = false;
				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
						productCodesData += itemArray[index].productCode + ',';
					}
				}
			}

			if (maxCountReached) {
				itemArray[0].setChecked(true);
			} else {
				var commaSeparatedString = textFieldData.substring(0,
						(textFieldData.length - 1));
				var commaSeparatedPrdCodes = productCodesData.substring(0,
						(productCodesData.length - 1));

				myProductTextFieldRef.setValue('');
				myProductTextFieldRef.setValue(commaSeparatedString);
				myProductTextFieldRef.productCodesData = commaSeparatedPrdCodes;
			}
		}

	},

	loadSendingAccountMenu : function(creditPortlet, data) {
		var me = this;
		var menuRef = creditPortlet.down('menu[itemId="sendingAccountMenu"]');
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
							checked : true,
							listeners : {
								checkchange : function(item, checked) {
									me.sendingAccMenuAllHandler(creditPortlet,
											item, checked);
								}
							}
						});

				for (var index = 0; index < count; index++) {
					menuRef.add({
								xtype : 'menucheckitem',
								text : data[index].CODE,
								checked : true,
								listeners : {
									checkchange : function(item, checked) {
										me.updateSendingAccountTextField(
												creditPortlet, item, checked);
									}
								}
							});

				}
			}
		}
	},
	sendingAccMenuAllHandler : function(creditPortlet, item, checked) {
		var me = this;
		var menuRef = creditPortlet.down('menu[itemId="sendingAccountMenu"]');
		var sendingAccountTextField = creditPortlet
				.down('textfield[itemId="AccountNo"]');
		var itemArray = menuRef.items.items;

		if (checked) {
			me.allSendingAccountItemChecked = true;
			for (var index = 1; index < itemArray.length; index++) {
				itemArray[index].setChecked(true);
			}
			if (!Ext.isEmpty(sendingAccountTextField)) {
				sendingAccountTextField.setValue("");
				sendingAccountTextField.setValue(getLabel('all', 'All'));
			}
		} else if (!me.allSendingAccountItemUnChecked && !checked) {
			me.allSendingAccountItemChecked = false;
			me.allSendingAccountItemUnChecked = false;
			for (var index = 1; index < itemArray.length; index++) {
				sendingAccountTextField.setValue('');
				itemArray[index].setChecked(false);
			}
		} else {
			me.allSendingAccountItemUnChecked = false;
		}
	},
	updateSendingAccountTextField : function(creditPortlet, item, checked) {
		var me = this;
		var maxCountReached = false;
		var menuRef = creditPortlet.down('menu[itemId="sendingAccountMenu"]');

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = menuRef.items.items;
			var itemArrayLength = itemArray.length;
			var sendingAccountTextField = creditPortlet
					.down('textfield[itemId="AccountNo"]');
			var textFieldData = '';

			if (!me.allSendingAccountItemChecked && checked) {
				me.allSendingAccountItemUnChecked = false;
				var count = 1;
				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
						count++;

					}
				}

				if (count == itemArrayLength) {
					maxCountReached = true;
				}

			} else if (me.allSendingAccountItemChecked && !checked) {
				if (itemArray[0].checked) {
					me.allSendingAccountItemUnChecked = true;
					me.allSendingAccountItemChecked = false;
					itemArray[0].setChecked(false);
				}

				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
					}
				}
			} else if (!me.allSendingAccountItemChecked && !checked) {
				me.allSendingAccountItemUnChecked = false;
				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
					}
				}
			}

			if (maxCountReached) {
				itemArray[0].setChecked(true);
			} else {
				var commaSeparatedString = textFieldData.substring(0,
						(textFieldData.length - 1));
				sendingAccountTextField.setValue('');
				sendingAccountTextField.setValue(commaSeparatedString);
			}
		}
	},

	ajaxRequest : function(filterUrl, settings) {
		var me = this;
		var obj;
		var strUrl = '';

		if (!Ext.isEmpty(filterUrl)) {
			strUrl = strUrl + '?$filter=' + filterUrl;
			if (!Ext.isEmpty(me.ccyUrl))
				strUrl = strUrl + '&' + me.ccyUrl;
		} else {
			if (!Ext.isEmpty(me.ccyUrl))
				strUrl = strUrl + '?' + me.ccyUrl;
		}
		if (strUrl.charAt(0) == "?") { // remove first qstnmark
			strUrl = strUrl.substr(1);
		}
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = strUrl || {}, arrMatches;
		if (me.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(strUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
		}
		me.setTitle(settings);

		Ext.Ajax.request({
					url : 'services/getPaymentsByMonth.json',// strUrl,
					// filterUrl,
					method : 'POST',
					params : objParam,
					// async : false,
					success : function(response) {
						obj = Ext.decode(response.responseText);

						if (!Ext.isEmpty(obj.summary)) {
							var noOfRecords = obj.summary.length;
							var maxHeight = 47 + 37 * noOfRecords;
						}

						if (Ext.isEmpty(obj.summary)) {
							me.down('label[itemId=errorLabel]').show();
							me.down('panel[itemId=payTrendPanel]').hide();
							me.getTargetEl().unmask();
							me.setLoading(false);
						} else {
							me.down('label[itemId=errorLabel]').hide();
							me.down('panel[itemId=payTrendPanel]').show();
							me.loadData(obj, maxHeight);
						}
						if (Ext.isEmpty(me.ccyCode))
							me.ccyCode = obj.currency;
						
						me.setRefreshLabel();
					},
					failure : function(response) {
						me.getTargetEl().unmask();
						me.setLoading(false);
					}
				});

	},
	loadData : function(data, maxHeight) {
		var me = this;
		var storeData = [], strCategory = "";
		var arrData = data.summary;
		if (!Ext.isEmpty(arrData)) {
			for (var i = arrData.length - 1; i >= 0; i--) {
				var colJson = {};
				if (arrData[i]) {
					colJson["Month"] = arrData[i].Month;
					//colJson["Processed"] = arrData[i].Processed * -1;
					//colJson["Failed"] = arrData[i].Failed * -1;
					colJson["Processed"] = arrData[i].ProcessedCount;
					colJson["ProcessedAmount"] = data.ccy_symbol+" "+arrData[i].ProcessedAmount;
					colJson["Failed"] = arrData[i].FailedCount;	
					colJson["FailedAmount"] = data.ccy_symbol+" "+arrData[i].FailedAmount;
					colJson["batchCount"] = arrData[i].batchCount;
					colJson["batchAmount"] = data.ccy_symbol+" "+arrData[i].batchAmount;
					colJson["failedBatchCount"] = arrData[i].failedBatchCount;
					colJson["processedBatchCount"] = arrData[i].processedBatchCount;
				}
				storeData.push(colJson);
			}
		}
		if(storeData.length < 4){
			for(var i= storeData.length ; i<storeData.length ; i++){
				storeData.push({});
			}
		}
		//storeData.reverse();
			
		if (storeData.length > 0) {
			var barChart = me.createBarChart(storeData, maxHeight);
			var barChartPanel = me.down('panel[itemId=chartPayTrendPanel]');
			barChartPanel.removeAll();
			barChartPanel.add(barChart);
			me.doLayout();
		}
		me.getTargetEl().unmask();
		me.setLoading(false);
	},
	createBarChart : function(storeData, chartMaxHeight) {
		var thisClass = this, chart;
		var barChartStore = new Cashweb.store.PaymentsTrendStore();
		barChartStore.removeAll();
		barChartStore.loadData(storeData);
		thisClass.navStore = barChartStore;
		var mfloor = Math.floor;

		chart = Ext.create('Ext.chart.Chart', {
			border : false,
			animate : false,
			shadow : false,
			theme : 'Fancy',
			minWidth : 600,
			background : '#fff',
			height : 300,
			store : barChartStore,
			legend : {
				position : 'bottom',
				boxStroke : 'transparent',
				boxFill : 'transparent',
				//labelFont : '10px Helvetica, sans-serif',
				labelFont : 'bold 14px Arial-BoldMT, Arial',
				clickable : false,
				updateItemDimensions : function() {
					var me = this, items = me.items, padding = me.padding, itemSpacing = me.itemSpacing, maxWidth = 0, maxHeight = 0, totalWidth = 0, totalHeight = 0, vertical = me.isVertical, mfloor = Math.floor, mmax = Math.max, spacing = 0, i, l, item, bbox, width, height;

					// Collect item dimensions and position each one
					// properly in relation to the previous item
					for (i = 0, l = items.length; i < l; i++) {
						item = items[i];

						bbox = item.getBBox();

						// always measure from x=0, since not all markers go all
						// the
						// way to the left
						width = bbox.width;
						height = bbox.height;

						spacing = (i === 0 ? 0 : itemSpacing);

						// Set the item's position relative to the legend box
						item.x = padding
								+ mfloor(vertical ? 0 : totalWidth + spacing);
						item.y = padding
								+ mfloor(vertical ? totalHeight + spacing : 0)
								+ height / 2;

						// Collect cumulative dimensions
						totalWidth += spacing + width;
						totalHeight += spacing + height;
						maxWidth = mmax(maxWidth, width);
						maxHeight = mmax(maxHeight, height);
					}

					return {
						totalWidth : totalWidth - 5,
						totalHeight : totalHeight - 5,
						maxWidth : maxWidth,
						maxHeight : maxHeight
					};
				},
				// Function overrriden to make legend right align
				calcPosition : function() {
					var me = this, x, y, legendWidth = me.width, legendHeight = me.height, chart = me.chart, chartBBox = chart.chartBBox, insets = chart.insetPadding, chartWidth = chartBBox.width
							- (insets * 2), chartHeight = chartBBox.height
							- (insets * 2), chartX = chartBBox.x + insets, chartY = chartBBox.y
							+ insets, surface = chart.surface, mfloor = Math.floor;
					x = mfloor(chartX + chartWidth - 322 - legendWidth);
					y = mfloor(surface.height - legendHeight) - insets;
					return {
						x : x,
						y : y
					};
				},
				// Function overrriden to change the sequence of legend items
				createItems : function() {
					var me = this, seriesItems = me.chart.series.items, items = me.items, fields, i, li, j, lj, series, item;

					// remove all legend items
					me.removeItems();

					// Create all the item labels
					for (i = 0, li = seriesItems.length; i < li; i++) {
						series = seriesItems[i];

						if (series.showInLegend) {
							fields = [].concat(series.yField);

							for (j = 0, lj = fields.length; j < lj; j++) {
								item = me.createLegendItem(series, j);
								items.push(item);
							}
						}
					}
					items.reverse();
					me.alignItems();
				}
			},
			axes : [{
						type : 'Numeric',
						position : 'bottom',
						fields : ['Processed','Failed'],
						title : false,
						hidden : true
					}, {
						type : 'Category',
						position : 'left',
						fields : ['Month'],
						title : false,
						dashSize : 0,
						label : {
							renderer : function(v) {
								return v;
							}
						},
						getOrCreateLabel : function(i, text) {
							var me = this, labelGroup = me.labelGroup, textLabel = labelGroup
									.getAt(i), surface = me.chart.surface;
							var statusFilter = "(ActionStatus eq '8' or ActionStatus eq '13' or ActionStatus eq '14' or " +
							"ActionStatus eq '15' or ActionStatus eq '41') and ( Module eq 'C') ";
							if (textLabel) {
								if (text != textLabel.attr.text) {
									textLabel.setAttributes(Ext.apply({
										text : text,
										listeners : {
											/*'click' : function(obj, eOpts) {

												var monthData = barChartStore
														.getAt(i).get("Month")
														.split(',');
												var dateRange = thisClass
														.createDateFilter(monthData);

												var fieldValue1 = dateRange.val1;
												var fieldValue2 = dateRange.val2;

												var filter = thisClass.strFilter;
												var start = filter
														.indexOf('AccountNoPDT')
														- 1;
												var filterDetail = filter
														.substr(start);
												var end = filterDetail
														.indexOf(')')
														+ 1;
												filterDetail = filterDetail
														.substr(0, end);
												filter = filter.replace(
														filterDetail, '');
												if (!Ext.isEmpty(filterDetail))
													filter = filter.substr(0,
															filter.length - 5);

												if (Ext.isEmpty(filter))
													filter = filter
															+ "EntryDate bt date'"
															+ fieldValue1
															+ "' and date'"
															+ fieldValue2 + "'"
															+ " and " + statusFilter;
												else
													filter = filter
															+ " and EntryDate bt date'"
															+ fieldValue1
															+ "' and date'"
															+ fieldValue2 + "'"
															+ " and " + statusFilter;
												filter = filter
														+ '&$filterDetail='
														+ filterDetail;
												thisClass
														.fireEvent(
																'navigateToPayments',
																filter,
																thisClass.record
																		.get('settings'));
											}*/
										}
									}, me.label), true);
									textLabel._bbox = textLabel.getBBox();
								}
							} else {
								textLabel = surface.add(Ext.apply({
									group : labelGroup,
									type : 'text',
									x : 0,
									y : 0,
									text : text,
									listeners : {
										/*'click' : function(obj, eOpts) {
											var monthData = barChartStore
													.getAt(i).get("Month")
													.split(',');
											var dateRange = thisClass
													.createDateFilter(monthData);

											var fieldValue1 = dateRange.val1;
											var fieldValue2 = dateRange.val2;

											var filter = thisClass.strFilter;
											var start = filter
													.indexOf('AccountNoPDT')
													- 1;
											var filterDetail = filter
													.substr(start);
											var end = filterDetail.indexOf(')')
													+ 1;
											filterDetail = filterDetail.substr(
													0, end);
											filter = filter.replace(
													filterDetail, '');
											if (!Ext.isEmpty(filterDetail))
												filter = filter.substr(0,
														filter.length - 5);

											if (Ext.isEmpty(filter))
												filter = filter
														+ "EntryDate bt date'"
														+ fieldValue1
														+ "' and date'"
														+ fieldValue2 + "'"
														+ " and " + statusFilter;
											else
												filter = filter
														+ " and EntryDate bt date'"
														+ fieldValue1
														+ "' and date'"
														+ fieldValue2 + "'"
														+ " and " + statusFilter;
											filter = filter + '&$filterDetail='
													+ filterDetail;
											thisClass.fireEvent(
													'navigateToPayments',
													filter, thisClass.record
															.get('settings'));
										}*/
									}
								}, me.label));
								surface.renderItem(textLabel);
								textLabel._bbox = textLabel.getBBox();
							}
							// get untransformed bounding box
							if (me.label.rotation) {
								textLabel.setAttributes({
											rotation : {
												degrees : 0
											}
										}, true);
								textLabel._ubbox = textLabel.getBBox();
								textLabel.setAttributes(me.label, true);
							} else {
								textLabel._ubbox = textLabel._bbox;
							}
							return textLabel;
						}
					}],
			series : [{
				type : 'bar',
				axis : 'bottom',
				gutter : 250,
				xField : 'Month',
				yField : ['Processed', 'Failed'],
				xPadding : 15,
				stacked : false,
				shadowAttributes : [],
				style : {
					strokeStyle : ['#fff'],
					stroke : ['#fff'],
					height : 19
					
				},
				renderer : function(sprite, record, attributes, index, store) {
					attributes.y = attributes.y + 3;
					if(record != undefined )
						{
						if(record.data.Failed == 0 && record.data.Processed == 0 )
						{
							attributes.width = 0 ;
						}
						/*else
							{
							if (attributes.width < 10 )
			                        {
								attributes.width=10;
			                        }
						}*/
			                        }
					return attributes;
			    },
				tips : {
					trackMouse : true,
					constrainPosition : true,
					//anchor : 'bottom',
					height : 'auto',
					width : 450,
					bodyStyle : {
						background : '#ffffff',
						color : 'black',
						padding : '10px',
						'font-size' : '16px',
						'font-family' : 'Arial'
					},

					renderer : function(storeItem, item) {
						var str = "",txnCount,txnAmount,batchCount;
						if(item.yField == 'Failed')
						{
							txnCount = storeItem.data.Failed;
							txnAmount = storeItem.data.FailedAmount;
							batchCount =  storeItem.data.failedBatchCount;
						}
						else
						{
							txnCount = storeItem.data.Processed;
							txnAmount = storeItem.data.ProcessedAmount;
							batchCount =  storeItem.data.processedBatchCount;
						}
						if (!Ext.isEmpty(storeItem.data.batchCount)
								&& !Ext.isEmpty(storeItem.data.batchAmount)) {
							/*str = "Batch " + storeItem.data.batch + ", "
									+ "Transactions "
									+ txnCount + ", "
									+ "Amount " + storeItem.data.amount;*/
							  str = getLabel("batch", "Batch")+" " + batchCount + ", "
									+getLabel("txns","Transactions")+" "+ txnCount + ", "
									+ getLabel("amount","Amount")+" " + txnAmount;
						} else
							str = "";
						this.update(str);
					}
				}
			}]
		});
		return chart;
	},

	createDateFilter : function(monthData) {
		var strDate = '';
		var month = monthData[0].split(/'/g);
		var date = month[1].replace(/ /g, "");
		switch (month[0]) {
			case 'Jan' :
				strDate = "01/01/20" + date;
				break;
			case 'Feb' :
				strDate = "02/01/20" + date;
				break;
			case 'Mar' :
				strDate = "03/01/20" + date;
				break;
			case 'Apr' :
				strDate = "04/01/20" + date;
				break;
			case 'May' :
				strDate = "05/01/20" + date;
				break;
			case 'Jun' :
				strDate = "06/01/20" + date;
				break;
			case 'Jul' :
				strDate = "07/01/20" + date;
				break;
			case 'Aug' :
				strDate = "08/01/20" + date;
				break;
			case 'Sep' :
				strDate = "09/01/20" + date;
				break;
			case 'Oct' :
				strDate = "10/01/20" + date;
				break;
			case 'Nov' :
				strDate = "11/01/20" + date;
				break;
			case 'Dec' :
				strDate = "12/01/20" + date;
				break;
		}

		var objDateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		var date = new Date(Ext.Date.parse(strDate, "m/d/Y"));
		var dtJson = {};
		dtJson = objDateHandler.getThisMonthStartAndEndDate(date);
		fieldValue1 = Ext.Date.format(dtJson.fromDate, 'Y-m-d');
		fieldValue2 = Ext.Date.format(dtJson.toDate, 'Y-m-d');

		var dateRange = {};
		dateRange.val1 = fieldValue1;
		dateRange.val2 = fieldValue2;
		return dateRange;
	},
	// Date field handling ends
	generateUrl : function(settings) {
		var me = this;
		var isFilterApplied = false;
		var strFilter = '';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {

				if (settings[index].field != 'customname') {
					if (settings[index].field === 'ccy') {
						if (!Ext.isEmpty(settings[index].value1)) {
							if (settings[index].value1 != 'all')
								me.ccyUrl = '$ccy=' + settings[index].value1;
						}
						continue;
					}
					if (isFilterApplied)
						strFilter = strFilter + ' and ';
					if (Ext.isEmpty(settings[index].operator)) {
						isFilterApplied = false;
						continue;
					}

					switch (settings[index].operator) {
						case 'bt' :
							if (settings[index].dataType === 'D') {

								strFilter = strFilter + settings[index].field
										+ ' ' + settings[index].operator + ' '
										+ 'date\'' + settings[index].value1
										+ '\'' + ' and ' + 'date\''
										+ settings[index].value2 + '\'';
							} else {
								strFilter = strFilter + settings[index].field
										+ ' ' + settings[index].operator + ' '
										+ '\'' + settings[index].value1 + '\''
										+ ' and ' + '\''
										+ settings[index].value2 + '\'';
							}
							break;
						case 'in' :
							var reg = new RegExp(/[\(\)]/g);
							var objValue = settings[index].value1;
							objValue = objValue.replace(reg, '');
							var objArray = objValue.split(',');
							if (objArray.length > 0) {
								if (objArray[0] != 'All') {
									isFilterApplied = true;
									strFilter = strFilter + '(';
									for (var i = 0; i < objArray.length; i++) {
										strFilter = strFilter
												+ settings[index].field
												+ ' eq ';
										strFilter = strFilter + '\''
												+ objArray[i] + '\'';
										if (i != objArray.length - 1)
											strFilter = strFilter + ' or ';
									}
									strFilter = strFilter + ')';
								}
							}
							break;
						default :
							// Default opertator is eq
							if (settings[index].dataType === 'D') {

								strFilter = strFilter + settings[index].field
										+ ' ' + settings[index].operator + ' '
										+ 'date\'' + settings[index].value1
										+ '\'';
							} else {

								strFilter = strFilter + settings[index].field
										+ ' ' + settings[index].operator + ' '
										+ '\'' + settings[index].value1 + '\'';
							}
							break;
					}
					isFilterApplied = true;
				}
			}
		}
		if (!Ext.isEmpty(strFilter)) {
			me.strFilter = strFilter;
		}
		return strFilter;
	},

	showSettingsPopup : function(widgetCode, titleforsettings, record) {
		var me = this;
		creation_date_opt = null;
		me.settingsPanel = me.getSettingsPanel();
		var portletSettings = Ext.create('Ext.window.Window', {
					record : record,
					minHeight : 156,
					maxHeight : 550,
					cls : 'settings-popup xn-popup',
					buttonAlign : 'center',
					itemId : widgetCode + 'SettingsPanel',
					title : titleforsettings,
					autoHeight : true,
					width : (screen.width) > 1024 ? 735 : 733,
					modal : true,
					resizable : false,
					draggable : false,
					items : me.settingsPanel,
					listeners : {
						resize : function() {
							this.center();
						}
					},
					bbar : [{
								text : getLabel("cancel", "Cancel"),
								// cls : 'ux-button-s ft-button-secondary
								// footer-btns',
								handler : function() {
									this.up('window').close();
								}
							}, '->', {
								text : getLabel("save", "Save"),
								// cls : 'ux-button-s footer-btns',
								handler : function() {
									/*
									 * me.up('panel').fireEvent( 'saveSettings',
									 * record, me.getSettingsPanel()
									 * .getSettings(this .up('window')));
									 * this.up('window').close();
									 */
									var settings = me.getSettings(this
											.up('window'));
									me.record.set('settings', settings);
									me.setLoading(label_map.loading);
									var ccyPresent = false;
									for (var i = 0; i < settings.length; i++) {
										if (settings[i].field === 'ccy')
											me.ccyCode = settings[i].value1;
										ccyPresent = true;
									}
									if (!ccyPresent) {
										me.ccyCode = '';
										me.ccyUrl = '';
									}
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
		me.getDatePicker();
		//this.addSendingAccountsMenuItems(portletSettings);
		//this.addMyProductsMenuItems(portletSettings);
		//this.addClientMenu(portletSettings);
		//me.addDatePanel(portletSettings);
		//this.addDateMenu(portletSettings);
		me.portletSettingObj = portletSettings;
		me.setSettings(portletSettings, me.record.get('settings'));
		if(((clientStore.getCount() < 2) || !isClientUser) ? true : false)
		{
			//Ext.getCmp('creditDebitFlagAll').focus();
			for (var i= 0;i < portletSettings.down('radiogroup[itemId="creditDebitFlag"]').items.length;i++)
			{
				if(portletSettings.down('radiogroup[itemId="creditDebitFlag"]').items.items[i].checked)
				{
					portletSettings.down('radiogroup[itemId="creditDebitFlag"]').items.items[i].focus();
					break;
		}
			}
		}
		else
			{
			Ext.getCmp('companyName').focus();
			}
		
	},
	setTitle : function(settings) {
		var me = this;
		var titleChangeFlag = false;
		var toolTipText = '';
		for (var i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			if (fieldName === 'customname' && !Ext.isEmpty(fieldVal)) {
				var str = fieldVal;
				toolTipText = fieldVal;
				fieldVal = Ext.util.Format.ellipsis(fieldVal, 25);
				me.up('panel').setTitle(fieldVal + '<span id=' + me.titleId
						+ ' >&nbsp;&nbsp;</span> ');
				titleChangeFlag = true;
				break;
			}
		}
		if (!titleChangeFlag) {
			var defaultTitle = label_map[me.record.get('widgetCode')
					.toLowerCase()];
			toolTipText = defaultTitle;
			defaultTitle = Ext.util.Format.ellipsis(defaultTitle, 13);
			me.up('panel').setTitle(defaultTitle + '<span id=' + me.titleId
					+ '>&nbsp;&nbsp;</span> ');
		}
		var parent = $("#" + me.titleId).parent().attr("id");
		if (toolTipText.length > 13) {
			if (null === me.toolTip) {
				toolTip = Ext.create('Ext.tip.ToolTip', {
							html : toolTipText
						});
				me.toolTip = toolTip;
			}
			me.toolTip.update(toolTipText);
			me.toolTip.setTarget(parent);

		} else {
			if (null != me.toolTip)
				me.toolTip.disable();
		}
	},
	getSettingsPanel : function() {
		var me = this;
		var clientStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR', 'SELLER']
		});
			Ext.Ajax.request({
						//url : 'services/userseek/userclients.json',
						url : 'services/userseek/userclients.json?$top=-1&$skip=-1',
						method : 'POST',
						async : false,
						success : function(response) {
							var responseData = Ext.decode(response.responseText);
							var data = responseData.d.preferences;
							if (clientStore) {
								clientStore.removeAll();
								var count = data.length;
								if (count > 1) {
									clientStore.add({
												'CODE' : 'all',
												'DESCR' : getLabel('allCompanies','All companies')
											});
								}
								for (var index = 0; index < count; index++) {
									var record = {
										'CODE' : data[index].CODE,
										'DESCR' : data[index].DESCR,
										'SELLER' : data[index].SELLER
									}
									clientStore.add(record);
								}
							}
						},
						failure : function() {
						}

					});
		var settingsPanel = Ext.create('Ext.panel.Panel', {
			// padding : '10 10 10 10',
			items : [{
				xtype : 'container',
				layout : {
					type : 'column',
					pack : 'center'
				},
				flex : 1,
				cls : 'ft-padding-bottom',
				items : [{
					xtype : 'container',
					layout : 'hbox',
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-right',
					items : [{

							xtype : 'container',
							layout : 'vbox',
							width : '100%',
							cls : 'pagesetting',
							padding : '0 30 0 0',
							flex : 1,
							hidden: ((clientStore.getCount() < 2) || !isClientUser) ? true : false,//If count is one or admin then hide
							items : [{
										xtype : 'label',
										text : getLabel("company","Company Name"),
										cls : 'f13 ux_font-size14 ux_padding0060'
									}, {
										xtype : 'combo',
										displayField : 'DESCR',
										valueField : 'CODE',
										hideTrigger : true,
										queryMode : 'local',
										editable : false,
										triggerAction : 'all',
										width : '116%',
										padding : '-4 0 0 0',
										itemId : 'Client',
										id : 'companyName',
										tabindex : "1",
										mode : 'local',
										emptyText : getLabel('selectCompany', 'Select Company Name'),
										store : clientStore,
										listeners : {
											'select' : function(combo, record) {
												strClient = combo.getValue();
												strClientDescr = combo.getRawValue();
												if(!isEmpty(record)
														&& !isEmpty(record[0])
														&& !isEmpty(record[0].data)
														&& !isEmpty(record[0].data.SELLER))
													strSellerCode = record[0].data.SELLER;
												else
													strSellerCode = null;
												
												if(!isEmpty(strClient) && strClient !== 'all') {
													me.selectedClientCode = strClient;
												} else {
													me.selectedClientCode = null;
												}
												
												if(!isEmpty(strSellerCode) && strSellerCode != null)
													me.selectedSellerCode = strSellerCode;
												else
													me.selectedSellerCode = null;
												//me.handleClientChange();
											},
											afterrender : function(combo, eOpts ){
												if(clientStore.getCount() > 2){
													combo.setValue(combo.getStore().getAt(0));													
												}
											}
										}
									}]

						}]
				  },				         
				  {
					xtype : 'checkboxgroup',
					columns : [80, 100],
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-right ft-margin-t',
					vertical : true,
					hidden : charAllowedPayment === 'S' ? true :false,
					items : [{
						boxLabel : getLabel("batch", "Batch"),
						name : 'multi',
						inputValue : 'M',
						itemId : 'multiPayCheckBox',
						checked : true,
						listeners : {
							'change' : function(checkBox, newValue, oldValue,
									eOpts) {
								this.fireEvent('multiPayCheckBoxClicked',
										newValue);
							},
							'render' : function(checkBox, eOpts) {
								this.fireEvent('multiPayCheckBoxClicked',
										checkBox.getValue());
							}
						}
					}, {
						boxLabel : getLabel("single", "Single"),
						name : 'single',
						inputValue : 'S',
						itemId : 'singlePayCheckBox',
						checked : true,
						listeners : {
							'change' : function(checkBox, newValue, oldValue,
									eOpts) {
								this.fireEvent('singlePayCheckBoxClicked',
										newValue);
							},
							'render' : function(checkBox, eOpts) {
								this.fireEvent('singlePayCheckBoxClicked',
										checkBox.getValue());
							}
						}
					}]
				}, {
					xtype : 'radiogroup',
					columnWidth : 0.3333,
					//cls : 'ft-smallMargin-left ft-smallMargin-right',
					cls : ((clientStore.getCount() < 2) || !isClientUser) ? 'ft-extraLargeMargin-right' : 'ft-smallMargin-left ft-smallMargin-right',
					columns : [55, 62, 62],
					itemId : 'creditDebitFlag',
					labelAlign : 'top',
					labelSeparator : '',
					labelCls : 'frmLabel',
					tabindex : "1",
					fieldLabel : getLabel("transactionType", "Transaction Type"),
					items : [{
								boxLabel : getLabel("all", "All"),
								name : 'creditDebitFlag',
								inputValue : 'All',
								checked : true,
								id : 'creditDebitFlagAll'
							}, {
								boxLabel : getLabel("debit", "Debit"),
								name : 'creditDebitFlag',
								inputValue : 'D'
							}, {
								boxLabel : getLabel("credit", "Credit"),
								name : 'creditDebitFlag',
								inputValue : 'C'
							}]
					}]
				}, /*{
					xtype : 'container',
					layout : 'hbox',
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-left',
					items : [{
								xtype : 'textfield',
								fieldLabel : getLabel("batchColumnClient",
										"Client"),
								labelPad : 2,
								labelWidth : 55,
								labelAlign : 'top',
								labelCls : 'frmLabel',
								labelSeparator : '',
								readOnly : true,
								itemId : 'Client',
								fieldCls : 'ux_no-border-right xn-form-field',
								width : (screen.width) > 1024 ? 203 : 213,
								height : 45,
								name : 'Client',
								clientCodesData : ''
							}, {
								xtype : 'button',
								border : 0,
								margin : '19 0 0 0',
								itemId : 'clientBtn',
								cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
								glyph : 'xf0d7@fontawesome',
								height : 25,
								menuAlign : 'tr-br',
								menu : Ext.create('Ext.menu.Menu', {
									itemId : 'clientMenu',
									width : (screen.width) > 1024 ? 220 : 230,
									cls : 'ux_dropdown ux_dropdown-no-leftpadding',
									maxHeight : 200,
									items : []
								}),
								handler : function(btn, event) {
									btn.menu.show();
								}
							}]
				}]
			},*/
			{
				xtype : 'container',
				layout : 'column',
				flex : 1,
				cls : 'ft-padding-bottom pagesetting',
				items : [{
					xtype : 'container',
					layout : 'vbox',
					itemId : 'completDatePanel',
					columnWidth : 0.3333,
					cls : 'pagesetting',
					items : [{
						xtype : 'container',
						layout : 'hbox',
						items : [{
							xtype : 'label',
							itemId : 'creationDateLbl',
							name : 'creationDateLbl',
							height : 19,
							text : getLabel("entryDate", "Entry Date"),
							style : {
								'padding-right' : '10px !important'
							},
							cls : 'widget_date_menu',
							listeners : {
								render : function(c) {
									var tip = Ext.create('Ext.tip.ToolTip', {
										target : c.getEl(),
										listeners : {
											beforeshow : function(tip) {
												if (creation_date_opt === null)
													tip.update(getLabel("entryDate", "Entry Date"));
												else
													tip.update(creation_date_opt);
											}
										}
									});
								}
							}
						}, {
							xtype : 'button',
							border : 0,
							filterParamName : 'creationDateBtn',
							itemId : 'creationDateBtn',
							id :'creationDateBtn',
							padding: '4 0 0 5',
							height : 19,
							tabindex : "1",
							cls : 'ui-caret-dropdown settings-ui-caret',									
							listeners : {
								click : function(event) {
									var menus = me.getDateDropDownItems();
									var xy = event.getXY();
									menus.showAt(xy[0], xy[1] + 16);
									event.menu = menus;
								}
							}

						}]
					},
					{
						xtype : 'container',
						itemId : 'entryDateToContainer',
						layout : 'hbox',
						width: 220,
						items : [{
							xtype : 'component',
							width : '87%',
							itemId : 'creationDateDataPicker',
							padding : '0 0 4 0',
							filterParamName : 'PayReqEntryDate',
							html : '<input type="text"  tabindex : "1" id="creationDatePicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment " style="width: 100%;">'
						}, {
							xtype : 'component',
							cls : 'icon-calendar t7-adjust-cal',
							margin : '1 0 0 0',
							html : '<span class=""><i class="fa fa-calendar"></i></span>'
						}]
						
					}]
							}, {
					xtype : 'container',
					layout : 'vbox',
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-left ft-smallMargin-right',
					items : [{
								xtype : 'AutoCompleter',
								flex : 0.38,
								fieldCls : 'xn-form-text xn-suggestion-box',
								labelCls : 'frmLabel',
								fieldLabel : getLabel("createdBy", "Created By"),
								emptyText : 'Enter Keyword or %',
								fitToParent : true,
								width : (screen.width) > 1024 ? 218 : 220,
								labelAlign : 'top',
								labelSeparator : '',
								itemId : 'createdBy',
								tabindex : "1",
								name : 'createdBy',
								cfgUrl : 'services/userseek/corpuser.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'createdBy',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE1',
								cfgDataNode2 : 'DESCR',
								cfgKeyNode : 'CODE',
								cfgDelimiter: '|&nbsp',
								userCodesData : '',
								listeners : {
									'select' : function(combo, record) {
										strUser = combo.getValue();
										strUserDescr = combo.getRawValue();
										combo.userCodesData = record[0].data.CODE;
									},
									'change' : function(combo, newValue, oldValue, eOpts) {
										if (Ext.isEmpty(newValue)) {
											combo.userCodesData = "";
										}
									}
								}

							}]
				}, 
				{
					xtype : 'container',
					layout : 'hbox',
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-left',
					items : [{
								xtype : 'AutoCompleter',
								flex : 0.24,
								fieldCls : 'xn-form-text xn-suggestion-box',
								labelCls : 'frmLabel',
								width : (screen.width) > 1024 ? 220 : 225,
								fieldLabel : getLabel("CCY", "Currency"),
								emptyText : 'Enter Keyword or %',
								fitToParent : true,
								labelAlign : 'top',
								labelSeparator : '',
								itemId : 'Currency',
								tabindex : "1",
								name : 'Currency',
								cfgUrl : 'services/userseek/paymentccy.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'Currency',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE',
								cfgKeyNode : 'CODE'

				}]
				}
				]
			}, {
				xtype : 'container',
				layout : 'column',
				cls : 'ft-padding-bottom pagesetting',
				flex : 1,
				items : [
				          {
					xtype : 'container',
					layout : 'vbox',
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-right',
								items : [{
						xtype : 'container',
						layout : 'vbox',
						columnWidth : 0.3333,
							itemId : 'sendingAccountContainer',
						cls : 'ft-extraLargeMargin-right',
						items : [{
									xtype : 'label',
										text : getLabel("sendingAccounts",
												"Sending Accounts"),
									cls : 'f13 ux_font-size14 ux_padding0060'
								}, {
									xtype : 'checkcombo',
									valueField : 'CODE',
										displayField : 'DESCR',
									editable : false,
									addAllSelector : true,
									emptyText : 'All',
									multiSelect : true,
										width : 243,
									padding : '-7 0 0 0',
										itemId : 'sendingAccountDropDown',
									tabindex : "1",
									isQuickStatusFieldChange : false,
										store : me.getSendingAccStore(me),
									listConfig:{
								   tpl: [
							            '<ul><tpl for=".">',
								                '<li role="option" class="x-boundlist-item" data-qtip="{DESCR}">' +
							                 '<span class="x-combo-checker">&nbsp;</span>'+
								                '{DESCR}</li>',
							            '</tpl></ul>'
							        ]
								 }

								}]
						}]
				},
				{
					xtype : 'container',
					layout : 'vbox',
					columnWidth : 0.3333,
					itemId : 'payCategoryContainer',
					cls : 'ft-smallMargin-right ft-smallMargin-left',
					items : [{
								xtype : 'label',
								text : getLabel("paymentCategory",
											"Payment Type"),
								cls : 'f13 ux_font-size14 ux_padding0060'
							}, {
								xtype : 'checkcombo',
								valueField : 'instTypeCode',
								displayField : 'instTypeDescription',
									editable : false,
								addAllSelector : true,
								emptyText : getLabel('all','All'),
								multiSelect : true,
								width : (screen.width) > 1024 ? 243 : 244,
								padding : '-7 0 0 0',
								itemId : 'payCategory',
								tabindex : "1",
								isQuickStatusFieldChange : false,
								store : me.getPaymentCategoryStore(me),
								listConfig:{
								   tpl: [
							            '<ul><tpl for=".">',
							                '<li role="option" class="x-boundlist-item" data-qtip="{instTypeDescription}">' +
							                 '<span class="x-combo-checker">&nbsp;</span>'+
							                '{instTypeDescription}</li>',
							            '</tpl></ul>'
							        ]
								 }
								}]
				},
				,{
							xtype : 'container',
							layout : 'vbox',
							columnWidth : 0.3333,
					cls : 'ft-smallMargin-right ft-smallMargin-left',
					items : [{
						xtype : 'container',
						layout : 'vbox',
						columnWidth : 0.3333,
						itemId : 'payMethodContainer',
							cls : 'ft-extraLargeMargin-right',
							items : [{
										xtype : 'label',
									text : getLabel("paymentMethod",
											"Payment Package"),
										cls : 'f13 ux_font-size14 ux_padding0060'
									}, {
										xtype : 'checkcombo',
										valueField : 'CODE',
									displayField : 'DESCR1',
										editable : false,
										addAllSelector : true,
										emptyText : getLabel('all','All'),
										multiSelect : true,
									width : (screen.width) > 1024 ? 243 : 244,
										padding : '-7 0 0 0',
									itemId : 'payMethodDropDown',
										tabindex : "1",
										isQuickStatusFieldChange : false,
									store : me.getPaymentMethodStore(me),
										listConfig:{
									   tpl: [
								            '<ul><tpl for=".">',
							                '<li role="option" class="x-boundlist-item" data-qtip="{DESCR1}">' +
								                 '<span class="x-combo-checker">&nbsp;</span>'+
							                '{DESCR1}</li>',
								            '</tpl></ul>'
								        ]
									 }

									}]
						}]
							}]
			}, {
				xtype : 'container',
				layout : 'column',
				// padding : '10 0 10 0',
				flex : 1,
				items : [{
							xtype : 'textfield',
							hideTrigger : true,
							flex : 0.38,
							labelAlign : 'top',
							labelSeparator : '',
							fieldLabel : getLabel("widgetName", "Widget Name"),
							itemId : 'customname',
							tabindex : "1",
							fieldCls : 'xn-form-text',
							width : (screen.width) > 1024 ? 220 : 225,
							labelCls : 'frmLabel',
							cls : 'ft-extraLargeMargin-right',
							name : 'customname',
							maxLength : 20, // restrict user to enter 25 chars max
							enforceMaxLength : true,
							maskRe : /[A-Za-z0-9 .]/
						}, {
							xtype : 'container',
							flex : 0.24
						}]

			}]
		});
		return settingsPanel;
	},
	getDatePicker : function() {
		var me = this;
		$('#creationDatePicker').datepick({
			monthsToShow : 1,
			changeMonth : true,
			changeYear : true,
			rangeSeparator : ' to ',
			minDate: new Date(year, month - 7, day),
			dateFormat : strjQueryDatePickerDateFormat,
			onClose : function(dates) {
				var datePickerText = $('#creationDatePicker').val();
				if (!Ext.isEmpty(dates)) {
					if (!Ext.isEmpty(datePickerText))
					{
						me.dateRangeFilterVal = '13';
						me.datePickerSelectedDate = dates;
						me.datePickerSelectedEntryDate = dates;
						me.dateFilterVal = me.dateRangeFilterVal;
						me.dateFilterLabel = getLabel('daterange', 'Date Range');
						me.handleDateChange(me.dateRangeFilterVal);
				} 
					else
					{
						me.dateFilterVal = '';
						me.dateFilterLabel = '';
						var creationDateLbl = me.portletSettingObj.down('label[itemId="creationDateLbl"]');
						if(!Ext.isEmpty(creationDateLbl)) creationDateLbl.setText(getLabel("entryDate", "Entry Date")+"(Date Range)");
					}
				}
			}
		});
	},
	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#creationDatePicker');
		if (!Ext.isEmpty(me.dateFilterLabel) && !Ext.isEmpty(me.portletSettingObj)) {
			me.portletSettingObj.down('label[itemId="creationDateLbl"]').setText(getLabel("entryDate", "Entry Date") + " (" + me.dateFilterLabel + ")");
			creation_date_opt = getLabel("entryDate", "Entry Date")+" (" + me.dateFilterLabel + ")";
		}

		var vFromDate = Ext.Date.parse(
				objDateParams.fieldValue1, 'Y-m-d');
		var vToDate = Ext.Date.parse(
				objDateParams.fieldValue2, 'Y-m-d');
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.setDateRangePickerValue(vFromDate);
			} else {
				datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
			}
		} else {
			if (index === '1' || index === '2') {
					datePickerRef.setDateRangePickerValue(vFromDate);
			} else {
				datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
			}
		}
	},
	getDateDropDownItems : function(){
		var me = this;
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
			itemId : 'DateMenu',
			cls : 'ext-dropdown-menu',
			items : [{
						text : getLabel('latest', 'Latest'),
						btnId : 'latest',
						btnValue : '12',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							Ext.getCmp("creationDateBtn").focus();
						}
					}, {
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							Ext.getCmp("creationDateBtn").focus();
						}
					}, {
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							Ext.getCmp("creationDateBtn").focus();
						}
					}, {
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							Ext.getCmp("creationDateBtn").focus();
						}
					}, {
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						btnValue : '4',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							Ext.getCmp("creationDateBtn").focus();
						}
					}, {
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						btnValue : '5',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							Ext.getCmp("creationDateBtn").focus();
						}
					}, {
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							Ext.getCmp("creationDateBtn").focus();
						}
					}, {
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							Ext.getCmp("creationDateBtn").focus();
						}
					}, {
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							Ext.getCmp("creationDateBtn").focus();
						}
					}/*, {
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							Ext.getCmp("creationDateBtn").focus();
						}
					}, {
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						btnValue : '11',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							Ext.getCmp("creationDateBtn").focus();
						}
					}*/]
		});
		return dropdownMenu;
	},
	getDateParam : function(index, dateType) {
		var me = this;
		me.dateRangeFilterVal = index;
		var objDateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		switch (index) {
			case '1' :
				// Today
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '2' :
				// Yesterday
				fieldValue1 = Ext.Date.format(objDateHandler
								.getYesterdayDate(date), strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
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
			case '10' :
				// This Year
				dtJson = objDateHandler.getYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '11' :
				// Last Year To Date
				dtJson = objDateHandler.getLastYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '12' :
				// Latest
				var fromDate = new Date(Ext.Date.parse(from_date_payment, dtFormat));
			    var toDate = new Date(Ext.Date.parse(to_date_payment, dtFormat));
				 
				fieldValue1 = Ext.Date.format(
							fromDate,
							strSqlDateFormat);
				fieldValue2 = Ext.Date.format(
							toDate,
							strSqlDateFormat);
				operator = 'bt';
				break;
			case '13' :
				// Date Range
				if(!isEmpty(me.datePickerSelectedDate)){
				if (me.datePickerSelectedDate.length == 1) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'eq';
				} else if (me.datePickerSelectedDate.length == 2) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
					fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1],
							strSqlDateFormat);
					operator = 'bt';
				}
			}
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	getPaymentMethodStore : function(thisClass) {
		var data;
		var me = this;
		var strUrl = 'services/userseek/usermyproducts.json?$top=-1';
		
		/*if(!Ext.isEmpty(thisClass.selectedClientCode)) {
			strUrl += '&$filtercode1=' + thisClass.selectedClientCode;
		}*/
		
		if(!Ext.isEmpty(thisClass.selectedSellerCode)) {
			strUrl += '&$sellerCode=' + thisClass.selectedSellerCode;
		}
		
		Ext.Ajax.request({
			url : strUrl,
			async : false,
			method : 'GET',
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				data = responseData.d.preferences;
				var arData = new Array();
				var cnt=0;
				Ext.each(data || [], function(item) {
					arData[cnt] = item.CODE;
						//item.DESCR1=item.CODE + "&nbsp|&nbsp" +item.PRDDESCR;
						item.DESCR1 = item.PRDDESCR;
						item.qtip=item.CODE + "&nbsp|&nbsp" +item.PRDDESCR;
						cnt++;
			        }, this);
				me.payPackageData = arData;
			},
			failure : function() {
			}
		});
		var paymentMethStore = null;
		if (!Ext.isEmpty(data)) {
			paymentMethStore = Ext.create('Ext.data.Store', {
						fields : ['CODE','DESCR','DESCR1'],
						data : data,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			paymentMethStore.load();
		}
		return paymentMethStore;
	},
	getPaymentCategoryStore : function(thisClass) {
		var me = this;
		var data;
		Ext.Ajax.request({
			url : 'services/paymentMethod.json',
			method : 'GET',
			async : false,
			success : function(response) {
				if(!Ext.isEmpty(response.responseText)){
					var responseData = Ext.decode(response.responseText);
					if (responseData && responseData.d && responseData.d.instrumentType) {
						data = responseData.d.instrumentType;
						var codeAr = new Array();
						var i=0;
						Ext.each(data || [], function(item) {
							codeAr[i]=item.instTypeCode;
							i++
						}, this);
						me.payCategoryData= codeAr;
					}
				}
			},
			failure : function() {
			}
		});
		
		var paymentCategoryStore = Ext.create('Ext.data.Store', {
			fields : ['instTypeCode', 'instTypeDescription'],
			data : data,
			autoLoad : true,
			listeners : {
				load : function() {
				}
			}
		});
		paymentCategoryStore.load();
		return paymentCategoryStore;
	},
	getSendingAccStore : function(thisClass) {
		var data;
		var strUrl = 'services/userseek/debitaccounts.json?';
		
		/*if(!Ext.isEmpty(strClient)) {
			strUrl +='$filtercode1=' + strClient;
		}*/
		
		if(!Ext.isEmpty(thisClass.selectedSellerCode)) {
			strUrl += '&$sellerCode=' + thisClass.selectedSellerCode;
		}
		
		Ext.Ajax.request({
			url : strUrl,
			async : false,
			method : 'GET',
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				data = responseData.d.preferences;
			},
			failure : function() {
				// console.log("Error Occured - Addition
				// Failed");
			}
		});
		var sendingAccStore = null;
		if (!Ext.isEmpty(data)) {
			sendingAccStore = Ext.create('Ext.data.Store', {
						fields : ['CODE','DESCR'],
						data : data,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			sendingAccStore.load();
			}
		return sendingAccStore;
	},
	handleClientChange : function() {
		var me = this;
		var payPkgsCombo = me.settingsPanel.down('checkcombo[itemId="payMethodDropDown"]');
		var payMethodComboStore = me.getPaymentMethodStore(me);
		payPkgsCombo.bindStore(payMethodComboStore);
		payPkgsCombo.reset();
		
		var sendingAccountCombo = me.settingsPanel.down('checkcombo[itemId="sendingAccountDropDown"]');
		var sendingAccountStore = me.getSendingAccStore(me);
		sendingAccountCombo.bindStore(sendingAccountStore);
		sendingAccountCombo.reset();
	},
	setSettings : function(widget, settings) {
		var me = this,
			strSqlDateFormat = 'm/d/Y';
		/*var temp = widget.down('label[itemId="creationDateLbl"]');
		if (temp.text == "Creation Date") {
			var dateFilterLabel = "Creation Date (Latest)";
			widget.down('label[itemId="creationDateLbl"]')
					.setText(dateFilterLabel);
			creation_date_opt = "Creation Date (Latest)";
		}*/
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			operatorValue = settings[i].operator;
			if (fieldName === 'CreditDebitFlag') {
				/*
				 * var radioGroupRef = widget
				 * .down('radiogroup[itemId=CreditDebitFlag]'); if
				 * (!Ext.isEmpty(radioGroupRef)) { if (!Ext.isEmpty(fieldVal))
				 * radioGroupRef.setValue({ CreditDebitFlag : fieldVal }); }
				 */
				if (fieldVal === 'D') {
					var debitRadio = widget.down('radio[inputValue="D"]');
					debitRadio.setValue(true);
				}
				if (fieldVal === 'C') {
					var creditRadio = widget.down('radio[inputValue="C"]');
					creditRadio.setValue(true);
				}
			}

			if (fieldName === 'ProductCategory') {
				var paymentCategoryCombo = widget.down('checkcombo[itemId="payCategory"]');
				var values = fieldVal.split(',');
				if(me.payCategoryData != null)
				{
					var element;
					for(var j=0; j < values.length;j++ )
					{
						element = values[j];
						 var spliceIndex = me.payCategoryData.indexOf(element);
						  if(spliceIndex == -1)
						  {
							  console.log(' Removing element :  '+element+' at index '+spliceIndex);
							  values.splice(spliceIndex, 1);
						  }
					}
				 }
				if(!(Ext.isEmpty(paymentCategoryCombo) || Ext.isEmpty(values))) {
					paymentCategoryCombo.setValue(values);
				}
			}

			if (fieldName === 'Client') {
				var clientField = widget.down('textfield[itemId=Client]');
				if (!Ext.isEmpty(clientField)) {
					if (!Ext.isEmpty(fieldVal2))
						clientField.setValue(fieldVal);
					clientField.clientCodesData = fieldVal;
					if (!Ext.isEmpty(fieldVal)) {
						me.selectedClientCode = fieldVal;
						//me.handleClientChange();
					}
				}
			}

			if (fieldName === 'Maker') {
				var createdByValue = widget
						.down('AutoCompleter[itemId="createdBy"]');
				createdByValue.userCodesData =fieldVal;
				if (!Ext.isEmpty(createdByValue)) {
					if (!Ext.isEmpty(fieldVal2))
						createdByValue.setValue(fieldVal2);
				}
			}

			if (fieldName === 'PayCategory') {
				var multiPayValue = widget
						.down('checkbox[itemId="multiPayCheckBox"]');
				var singlePayValue = widget
						.down('checkbox[itemId="singlePayCheckBox"]');
				if (fieldVal === 'B') {
					multiPayValue.setValue(true);
					singlePayValue.setValue(false);
				}
				if (fieldVal === 'Q') {
					singlePayValue.setValue(true);
					multiPayValue.setValue(false);
				}
			}

			if (fieldName === 'PayReqEntryDate') {
				var dateLabel = settings[i].dateLabel;
				me.dateFilterLabel = settings[i].dateLabel.substring(settings[i].dateLabel.indexOf('(')+1,settings[i].dateLabel.indexOf(')'));
				me.dateFilterVal =  settings[i].btnValue;
				me.datePickerSelectedDate[0] = Ext.Date.parse(settings[i].value1, 'Y-m-d');
				me.datePickerSelectedDate[1] = Ext.Date.parse(settings[i].value2, 'Y-m-d');
				
				var dateFilterRefFrom = $('#creationDatePicker');
				if (!Ext.isEmpty(fieldVal)) 
					formattedFromDate = Ext.Date.parse(fieldVal, 'Y-m-d');
				if (!Ext.isEmpty(fieldVal2))
					formattedToDate = Ext.Date.parse(fieldVal2, 'Y-m-d');
				if (operatorValue === 'eq' || operatorValue === 'le') {
					dateFilterRefFrom.val(formattedFromDate);
				} else if (operatorValue === 'bt') {
					dateFilterRefFrom.setDateRangePickerValue([formattedFromDate, formattedToDate]);
				}
				if (!Ext.isEmpty(dateLabel)) {
					widget.down('label[itemId="creationDateLbl"]').setText(dateLabel);
					creation_date_opt = dateLabel;
				}
			}
			
			if (fieldName === 'customname') {
				var customnameField = widget
						.down('textfield[itemId=customname]');
				if (!Ext.isEmpty(customnameField)) {
					if (!Ext.isEmpty(fieldVal))
						customnameField.setValue(fieldVal);
				}
			}

			if (fieldName === 'ccy') {
				var ccyField = widget.down('AutoCompleter[itemId="Currency"]');
				if (!Ext.isEmpty(ccyField)) {
					if (!Ext.isEmpty(fieldVal2))
						ccyField.setValue(fieldVal2);
				}
			}
			if (fieldName === 'ProductType') {
				var ProductTypeCombo = widget.down('checkcombo[itemId="payMethodDropDown"]');
				var values = fieldVal.split(',');
				if(me.payPackageData != null)
				{	
					for(var j=0; j < values.length;j++ )
					{
						var element = values[j];
						var spliceIndex = me.payPackageData.indexOf(element);
						  if(spliceIndex == -1)
						  {
							  console.log(' Removing Element :  '+element+' at index '+spliceIndex);
							  values.splice(spliceIndex, 1);
						  }
					}
				}
				if(!(Ext.isEmpty(ProductTypeCombo) || Ext.isEmpty(values))) {
					ProductTypeCombo.setValue(values);
				}
			}

			if (fieldName === 'AccountNoPDT') {
				var sendingAcctCombo = widget.down('checkcombo[itemId="sendingAccountDropDown"]');
				var values = fieldVal.split(',');
				if(!(Ext.isEmpty(sendingAcctCombo) || Ext.isEmpty(values))) {
					sendingAcctCombo.setValue(values);
				}
			}
		}
	},
	getSettings : function(portletPanel) {
		var me = portletPanel;
		var jsonArray = [];
		var thisClass = this;
		
		// Client
		var clientCode = me.down('textfield[itemId="Client"]').getValue();
		//var clientCode = strClient;
		var clientDesc = me.down('textfield[itemId="Client"]').getRawValue();
		if (!Ext.isEmpty(clientCode) && clientCode != 'all') {
			jsonArray.push({
						field : 'Client',
						operator : 'eq',
						value1 : clientCode,
						value2 : clientDesc,
						dataType : 0,
						displayType : 6
					});
		}

		// Batch or Single
		var instrumentType = '';
		var multiPayValue = me.down('checkbox[itemId="multiPayCheckBox"]')
				.getValue();
		var singlePayValue = me.down('checkbox[itemId="singlePayCheckBox"]')
				.getValue();
		if (multiPayValue === true && singlePayValue === true) {
			instrumentType = '';
		} else if (multiPayValue === true) {
			instrumentType = 'B';
		} else if (singlePayValue === true) {
			instrumentType = 'Q';
		}
		if (!Ext.isEmpty(instrumentType)) {
			jsonArray.push({
						field : 'PayCategory',
						operator : 'eq',
						value1 : instrumentType,
						dataType : 0,
						displayType : 4
					});
		}

		// Payment Category
		var ProductCatType = me.down('combo[itemId="payCategory"]').getRawValue();
		var productCodesData = me.down('combo[itemId="payCategory"]').getValue();
		var productCatTypeCombo = me.down('combo[itemId="payCategory"]');
		if (!Ext.isEmpty(ProductCatType) && ProductCatType != 'All' && (productCatTypeCombo.value.length != productCatTypeCombo.getStore().getCount()) ) {
			
			jsonArray.push({
						field : 'ProductCategory',
						operator : 'in',
				value1 : productCodesData,
				value2 : ProductCatType,
						dataType : 0,
						displayType : 0,
						detailFilter : 'Y'
					});
		}
		// Entry User
		var entryUser = me.down('AutoCompleter[itemId="createdBy"]').userCodesData;
		var entryUserDesc = me.down('AutoCompleter[itemId="createdBy"]').getRawValue();
		if (!Ext.isEmpty(entryUser)) {
			jsonArray.push({
						field : 'Maker',
						operator : 'eq',
						value1 : entryUser,
						value2 : entryUserDesc,
						dataType : 0,
						displayType : 4
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
		var ProductTypeCombo = me.down('checkcombo[itemId="payMethodDropDown"]');
		if (!(Ext.isEmpty(ProductTypeCombo.getValue()) || ProductTypeCombo.isAllSelected())) {
			jsonArray.push({
						field : 'ProductType',
						operator : 'in',
						value1 : ProductTypeCombo.getValue(),
						value2 : ProductTypeCombo.getRawValue(),
						dataType : 0,
						displayType : 6
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

		// Creation Date
		var datePickerText = $('#creationDatePicker').val();
		if(Ext.isEmpty(datePickerText)) {
			thisClass.dateFilterVal = '';
			thisClass.dateFilterLabel = '';
			me.down('label[itemId="creationDateLbl"]').setText(getLabel("entryDate", "Entry Date"));
		}
		var index = thisClass.dateFilterVal;
		var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
		var objDateParams = thisClass.getDateParam(index);
		if (!Ext.isEmpty(index)) {
			jsonArray.push({
				field : 'PayReqEntryDate',
				value1 : objDateParams.fieldValue1,
				value2 : objDateParams.fieldValue2,
				operator : objDateParams.operator,
				dateLabel : dateLabel,
				dataType : 'D',
				displayType : index,
				btnValue : index
			});
		}else{
			var strSqlDateFormat = 'Y-m-d';
			var operator = 'eq';
			var fieldValue1 = '';
			var fieldValue2 = '';	
			var fieldValueArray;			
			if(!Ext.isEmpty(datePickerText))
			{
				if(datePickerText.indexOf("to") != -1)
				{
					operator = 'bt';
					fieldValueArray = datePickerText.split('to');
					fieldValue1 = fieldValueArray[0] != undefined ? fieldValueArray[0].trim(): '';
					fieldValue2 = fieldValueArray[0] != undefined ? fieldValueArray[1].trim(): '';					
					
					fieldValue1 = Ext.Date.format(new Date(Ext.Date.parse(fieldValue1, strExtApplicationDateFormat)), strSqlDateFormat);
					fieldValue2 = Ext.Date.format(new Date(Ext.Date.parse(fieldValue2, strExtApplicationDateFormat)), strSqlDateFormat);
					
				}else
				{	
					operator = 'eq';				
					fieldValue1 = datePickerText;					
					fieldValue1 = Ext.Date.format(new Date(Ext.Date.parse(fieldValue1, strExtApplicationDateFormat)), strSqlDateFormat);
		}

			jsonArray.push({
					field : 'PayReqEntryDate',
					value1 : fieldValue1,
					value2 : fieldValue2,
					operator : operator,
						dateLabel : dateLabel,
						dataType : 'D',
					displayType : 5,
					btnValue   : 5
					});
			}
		}
		var sendingAcctNo = me.down('combo[itemId="sendingAccountDropDown"]').getValue();
		var sendingAcctCombo = me.down('combo[itemId="sendingAccountDropDown"]');
		if (!Ext.isEmpty(sendingAcctNo) && sendingAcctNo != 'All' &&  (sendingAcctCombo.value.length != sendingAcctCombo.getStore().getCount())) {
			jsonArray.push({
				field : 'AccountNoPDT',
				operator : 'in',
				value1 : sendingAcctNo,
				value2 : sendingAcctNo,
				dataType : 0,
				displayType : 0,
				detailFilter : 'Y'
			});
		}
		return jsonArray;
	}
});


Ext.define('Ext.ux.chart.LegendItem.Unclickable', {
			override : 'Ext.chart.LegendItem',
			onMouseDown : function() {
				if (this.legend.clickable !== false) {
					this.callParent(arguments);
				}
			},
			onMouseOver : function() {
				if (this.legend.clickable !== false) {
					this.callParent(arguments);
				}
			},
			onMouseOut : function() {
				if (this.legend.clickable !== false) {
					this.callParent(arguments);
				}
			}
		});


Ext.define('Ext.chart.theme.Fancy', {
			extend : 'Ext.chart.theme.Base',
			constructor : function(config) {
				var ident = Ext.identityFn;
				this.callParent([Ext.apply({
							axis : {
								//stroke : "#fff"
							},
							axisLabelLeft : {
								fill : '#000',
								//x : 10,
								//font : 'bold 12px Arial, Helvetica, sans-serif',
								font : 'bold 20px Arial-BoldMT, Arial',
								renderer : ident
							},
							axisTitleLeft : {
								fill : "#789"
							},
							axisTitleBottom : {
								fill : "#789"
							},
							colors : ['#4c892f', '#4597cb']
						}, config)]);
			}
		});
		
// Labels were not displaying on IE browser
// Hence below method overridden for this graph and commented code of hiding the labels
Ext.define('Ext.chart.axis.override.Axis', {
    override: 'Ext.chart.axis.Axis',
    
    drawVerticalLabels: function () {
        var me = this,
            inflections = me.inflections,
            position = me.position,
            ln = inflections.length,
            chart = me.chart,
            insetPadding = chart.insetPadding,
            labels = me.labels,
            maxWidth = 0,
            max = Math.max,
            floor = Math.floor,
            ceil = Math.ceil,
            axes = me.chart.axes,
            gutters = me.chart.maxGutters,
            bbox, point, prevLabel, prevLabelId,
            hasTop = axes.findIndex('position', 'top') != -1,
            hasBottom = axes.findIndex('position', 'bottom') != -1,
            adjustEnd = me.adjustEnd,
            textLabel, text,
            last = ln - 1, x, y, i;

        for (i = 0; i < ln; i++) {
            point = inflections[i];
            text = me.label.renderer(labels[i]);
            textLabel = me.getOrCreateLabel(i, text);
            bbox = textLabel._bbox;

            maxWidth = max(maxWidth, bbox.width + me.dashSize + me.label.padding);
            y = point[1];
            if (adjustEnd && (gutters.bottom + gutters.top) < bbox.height / 2) {
                if (i == last && !hasTop) {
                    y = Math.max(y, me.y - me.length + ceil(bbox.height / 2) - insetPadding);
                }
                else if (i == 0 && !hasBottom) {
                    y = me.y + gutters.bottom - floor(bbox.height / 2);
                }
            }
            if (position == 'left') {
                x = point[0] - bbox.width - me.dashSize - me.label.padding - 2;
            }
            else {
                x = point[0] + me.dashSize + me.label.padding + 2;
            }
            textLabel.setAttributes(Ext.apply({
                hidden: false,
                x: x,
                y: y
            }, me.label), true);
            // Skip label if there isn't available minimum space
            if (i != 0 && me.intersect(textLabel, prevLabel)) {
                if (i === last && prevLabelId !== 0) {
                    //prevLabel.hide(true);
                } else {
                    //textLabel.hide(true);
                    continue;
                }
            }
            prevLabel = textLabel;
            prevLabelId = i;
        }

        return maxWidth;
    }
    
});
