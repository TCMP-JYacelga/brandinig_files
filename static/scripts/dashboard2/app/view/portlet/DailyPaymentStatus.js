Ext.define('Cashweb.view.portlet.DailyPaymentStatus', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.dailypaymentstatus',
	requires : ['Cashweb.store.DailyPaymentStatusStore'],
	cols : 2,
	border : false,
	animate : false,
	shadow : false,
	cls : 'ux_panel-transparent-background',
	margin : '0 10 0 0',
	strFilter : '',
	selectedClientCode : '',
	allSendingAccountItemChecked : true,
	allSendingAccountItemUnChecked : false,
	allMyProductItemChecked : true,
	allMyProductItemUnChecked : false,
	dateFilterLabel : 'Creation Date( Latest )',
	dateFilterVal : '12',
	minHeight : 185,
	dateHandler : null,
	vFromDate1 : null,
	vToDate1 : null,

	initComponent : function() {
		var me = this;
		me.emptyText = label_map.noDataFound;

		me.on('refreshWidget', function() {
					var record = this.record, settings = [];
					me.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					filterUrl = me.generateUrl(settings);
					me.ajaxRequest(filterUrl);
				});

		me.on('render', function(component, eOpts) {
					var me = this;
					var settings = [];
					var filterUrl = '';
					var record = me.record;
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
					}
					filterUrl = me.generateUrl(settings);
					me.ajaxRequest(filterUrl);
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
								itemId : 'dailyPayStatusPanel',
								autoHeight : true,
								items : [{
											xtype : 'panel',
											itemId : 'chartDailyPayStatusPanel',
											items : []
										}]
							}]
				});

		Ext.define('Ext.ux.chart.LegendItem.Unclickable', {
			override : 'Ext.chart.LegendItem',
			onMouseDown : function(obj) {
				var navSettings = me.record.get('settings');
				if (obj.text === "Processed") {
					if (Ext.isEmpty(me.strFilter))
						me.strFilter = me.strFilter + "(ActionStatus eq '15')";
					else
						me.strFilter = me.strFilter
								+ " and (ActionStatus eq '15')";
				} else {
					if (Ext.isEmpty(me.strFilter))
						me.strFilter = me.strFilter
								+ "(ActionStatus eq '8' or ActionStatus eq '16' or ActionStatus eq '13')";
					else
						me.strFilter = me.strFilter
								+ " and (ActionStatus eq '8' or ActionStatus eq '16' or ActionStatus eq '13')";
				}

				if (Ext.isEmpty(navSettings)
						|| JSON.stringify(navSettings) === '{}')
					navSettings = [];

				me
						.fireEvent('seeMorePaymentRecords', me.strFilter,
								navSettings);
			}
		});

		me.callParent(arguments);
	},

	addClientMenu : function(summaryPortlet) {
		var menuRef = summaryPortlet.down('menu[itemId="clientMenu"]');
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json?$top=-1&$skip=-1',
			method : 'POST',
			async : false,
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var data = responseData.d.preferences;
				var count = data.length;
				if (menuRef.items.length > 0) {
					menuRef.removeAll();
				}
				if (count > 0) {
					menuRef.add({
								text : getLabel('allCompanies', 'All companies'),
								clientCode : 'all',
								handler : function(item, opts) {
									var clientField = summaryPortlet
											.down('textfield[itemId="Client"]');
									clientField.setValue(item.text);
									clientField.clientCodesData = item.clientCode;
								}
							});

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
		me.addDateContainerPanel(dateParentPanel,portletSettings);
	},
	addDateMenu : function(portletSettings) {
		var me = this;
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

		arrMenuItem.add({
					text : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
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
	addDateContainerPanel : function(dateParentPanel,portletSettings) {
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
									var portlet2 =	portletSettings.down('container[itemId="completDatePanel"]');
								    var daterange = 	portlet2.down('container[itemId="dateRangeComponent"]');
								    var toDate = daterange.down('datefield[itemId="toDate"]').getValue(); 
										var frmDate = newValue;
										var dtParams = me.getDateParamForDateRange('7',frmDate,toDate);
										me.dateFilterFromVal = dtParams.fieldValue1;
										me.dateFilterToVal = dtParams.fieldValue2;
										portlet2.down('datefield[itemId="fromDate"]').setMaxValue(me.dateFilterToVal);
										portlet2.down('datefield[itemId="toDate"]').setMinValue(me.dateFilterFromVal);
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
							margin: '0 0 0 2',
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
									var portlet2 =	portletSettings.down('container[itemId="completDatePanel"]');
								    var daterange = 	portlet2.down('container[itemId="dateRangeComponent"]');
								    var frmDate = daterange.down('datefield[itemId="fromDate"]').getValue();
										var toDate = newValue;
										var dtParams = me.getDateParamForDateRange('7',frmDate,toDate);
										me.dateFilterFromVal = dtParams.fieldValue1;
										me.dateFilterToVal = dtParams.fieldValue2;
										portlet2.down('datefield[itemId="fromDate"]').setMaxValue(me.dateFilterToVal);
										portlet2.down('datefield[itemId="toDate"]').setMinValue(me.dateFilterFromVal);
									}
								}
							}
						}]
					}]
				});
				dateParentPanel.add(dateContainerPanel);
				portletSettings.down('container[itemId="completDatePanel"]').add(dateParentPanel);
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
			portlet2.down('label[itemId="creationDateLbl"]')
					.setText("Creation Date" + " (" + me.dateFilterLabel + ")");
		}
		vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
				
		if (index == '7') {
		var dtEntryDate = new Date( Ext.Date.parse( dtApplicationDate,
					strExtApplicationDateFormat ));
				portlet2.down('container[itemId="dateRangeComponent"]').show();
				portlet2.down('label[itemId="dateFilterFrom"]').hide();
				portlet2.down('label[itemId="dateFilterTo"]').hide();
				portlet2.down('datefield[itemId="fromDate"]').setValue( dtEntryDate );
				portlet2.down('datefield[itemId="toDate"]').setValue( dtEntryDate );
				//portlet2.down('datefield[itemId="fromDate"]').setMinValue(clientFromDate);
				//portlet2.down('datefield[itemId="toDate"]').setMinValue(clientFromDate);
			
		} else {
			portlet2.down('container[itemId="dateRangeComponent"]').hide();
			portlet2.down('label[itemId="dateFilterFrom"]').show();
			portlet2.down('label[itemId="dateFilterTo"]').show();
		}	
		
		if (index === '1' || index === '2' || index === '12') {
			if (index === '12') {
				// Do nothing for latest
				fromDateLabel.setText('' + '  ' + vFromDate);
			} else
				fromDateLabel.setText(vFromDate);

			toDateLabel.setText("");
		} else {
			fromDateLabel.setText(vFromDate + " - ");
			toDateLabel.setText(vToDate);
			me.vFromDate1 = vFromDate;
			me.vToDate1 = vToDate;
		}
	},
	getDateParamForDateRange : function(index,fromDate,toDate) {
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
				fieldValue1 = Ext.Date
						.format(fromDate, strSqlDateFormat);
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
		return retObj;
	},

	// Payment Method field handling starts
	addMyProductsMenuItems : function(summaryPortlet) {
		var me = this;
		var myProductMenuRef = summaryPortlet
				.down('menu[itemId="payMethodMenu"]');
		if (!Ext.isEmpty(myProductMenuRef)) {

			Ext.Ajax.request({
				url : 'services/userseek/usermyproducts.json?$top=-1&$skip=-1&$filterCode1='
						+ me.selectedClientCode,
				method : 'GET',
				async : false,
				success : function(response) {
					var responseData = Ext.decode(response.responseText);
					var data = responseData.d.preferences;
					me.loadMyProductMenu(summaryPortlet, data);
				},
				failure : function() {
					// console.log("Error Occured - Addition
					// Failed");

				}

			});

		}
	},

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

	// Payment Method field handlling ends
	// Sending account field handling starts
	addSendingAccountsMenuItems : function(creditPortlet) {
		var me = this;
		Ext.Ajax.request({
			url : 'services/userseek/debitaccounts.json?$top=-1&$skip=-1&$filterCode1='
					+ me.selectedClientCode,
			method : 'GET',
			// async : false,
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var data = responseData.d.preferences;
				me.loadSendingAccountMenu(creditPortlet, data);
			},
			failure : function() {
				// console.log("Error Occured - Addition
				// Failed");
			}
		});
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
	ajaxRequest : function(filterUrl) {
		var me = this;
		var obj;
		var strUrl = 'services/getDailyPayments.json' + filterUrl;
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					// async : false,
					success : function(response) {
						obj = Ext.decode(response.responseText);
						if (Ext.isEmpty(obj.summary)) {
							me.down('label[itemId=errorLabel]').show();
							me.down('panel[itemId=dailyPayStatusPanel]').hide();
							me.getTargetEl().unmask();
						} else {
							me.down('label[itemId=errorLabel]').hide();
							me.down('panel[itemId=dailyPayStatusPanel]').show();
							me.loadData(obj);
						}
						me.setLoading(false);
						me.setRefreshLabel();
					},
					failure : function(response) {
						if(response.status === 400) {
								me.setLoading(false);
							}
						 if(response.status === 500) {
								me.setLoading(false);
							}
					}
				});

	},
	loadData : function(data) {
		var me = this;
		var storeData = [], strCategory = "";
		var arrData = data.summary;
		if (!Ext.isEmpty(arrData)) {
			for (var i = 0; i < arrData.length; i++) {
				var colJson = {};
				if (arrData[i]) {
					colJson["Date"] = arrData[i].Date;
					colJson["Processed"] = arrData[i].Processed;
					colJson["Rejected"] = arrData[i].Rejected;
				}
				storeData.push(colJson);
			}
		}
		if (storeData.length > 0) {
			var barChart = me.createLineChart(storeData);
			var barChartPanel = me
					.down('panel[itemId=chartDailyPayStatusPanel]');
			barChartPanel.removeAll();
			barChartPanel.add(barChart);
			me.doLayout();
		}
		me.getTargetEl().unmask();
		me.setLoading(false);
	},
	createLineChart : function(storeData) {
		var thisClass = this, chart;
		var lineChartStore = new Cashweb.store.DailyPaymentStatusStore();
		lineChartStore.removeAll();
		lineChartStore.loadData(storeData);
		thisClass.navStore = lineChartStore;
		var mfloor = Math.floor;

		chart = Ext.create('Ext.chart.Chart', {
			border : false,
			animate : false,
			shadow : false,
			minWidth : 560,
			height : 232,
			store : lineChartStore,
			legend : {
				position : 'top',
				boxStrokeWidth : 0,
				boxFill : 'transparent',
				labelColor : '#6E6A68',
				labelFont : '14px calibri',
				calcPosition : function() {
					var me = this, x, y, legendWidth = me.width, legendHeight = me.height, chart = me.chart, chartBBox = chart.chartBBox, insets = chart.insetPadding, chartWidth = chartBBox.width
							- (insets * 2), chartHeight = chartBBox.height
							- (insets * 2), chartX = chartBBox.x + insets, chartY = chartBBox.y
							+ insets, surface = chart.surface, mfloor = Math.floor;
					x = mfloor(chartX + chartWidth + 15 - legendWidth);
					y = insets;
					return {
						x : x,
						y : y
					};
				}
			},
			axes : [{
						type : 'Numeric',
						position : 'left',
						fields : ['Processed', 'Rejected'],
						majorTickSteps : 5,
						dashSize : 0,
						grid : {
							odd : {
								opacity : 1,
								stroke : '#EDEDED',
								'stroke-width' : 0.5
							},
							even : {
								opacity : 1,
								stroke : '#EDEDED',
								'stroke-width' : 0.5
							}
						},
						label : {
							'fill' : '#6E6A68',
							font : "11px Helvetica, sans-serif"
						},
						minimum : 0
					}, {
						type : 'Category',
						position : 'bottom',
						dashSize : 0,
						grid : {
							odd : {
								opacity : 1,
								stroke : '#EDEDED',
								'stroke-width' : 0.5
							},
							even : {
								opacity : 1,
								stroke : '#EDEDED',
								'stroke-width' : 0.5
							}
						},
						fields : ['Date'],
						label : {
							'fill' : '#6E6A68',
							font : "10px Helvetica, sans-serif"
						}
					}],
			series : [{
				type : 'line',
				highlight : {
					size : 10,
					radius : 7
				},
				fill : true,
				axis : 'left',
				xField : 'Date',
				yField : 'Processed',
				showMarkers : true,
				style : {
					stroke : '#6496B1',
					'stroke-width' : 3,
					fill : '#E2EAED'
				},
				markerConfig : {
					type : 'circle',
					size : 4,
					radius : 5,
					stroke : '#6496B1',
					'stroke-width' : 2,
					'fill' : '#ACC7D0'
				},

				tips : {
					trackMouse : true,
					anchor : 'bottom',
					border : 8,
					style : {
						borderColor : '#6496B1 !important',
						'background-color' : '#E2EAED !important'
					},
					height : 37,
					width : 55,
					bodyStyle : {
						background : '#E2EAED !important',
						color : '#6496B1 !important',
						width : '55px !important'
					},
					renderer : function(storeItem, item) {
						this.setTitle(storeItem.get('Processed') + '<br/>'
								+ 'Processed');
					}
				}
			}, {
				type : 'line',
				highlight : {
					size : 10,
					radius : 7
				},
				fill : true,
				axis : 'left',
				xField : 'Date',
				yField : 'Rejected',
				showMarkers : true,
				style : {
					stroke : '#DF5150',
					'stroke-width' : 3,
					fill : '#DEB1AE'
				},
				markerConfig : {
					type : 'circle',
					size : 4,
					radius : 5,
					stroke : '#DF5150',
					'stroke-width' : 2,
					'fill' : '#DFB0B6'
				},
				tips : {
					trackMouse : true,
					anchor : 'bottom',
					border : 8,
					style : {
						borderColor : '#DF5150 !important',
						'background-color' : '#EEDCDC !important',
						'color' : '#DF5150 !important'
					},
					height : 37,
					width : 55,
					bodyStyle : {
						background : '#EEDCDC !important',
						'color' : '#DF5150 !important',
						width : '55px !important'
					},
					renderer : function(storeItem, item) {
						this.setTitle(storeItem.get('Rejected') + '<br/>'
								+ 'Rejected');
					}
				}
			}]
		});
		return chart;
	},
	// Date field handling ends
	generateUrl : function(settings) {
		var me = this;
		var isFilterApplied = false;
		var strFilter = '';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {

				if (settings[index].field != 'customname') {
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
			strFilter = '?$filter=' + strFilter;
		}
		return strFilter;
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
					width : 800,
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
								handler : function() {
									me.up('panel').fireEvent(
											'saveSettings',
											record,
											me.getSettingsPanel()
													.getSettings(this
															.up('window')));
									/*
									 * var settings = me.getSettingsPanel()
									 * .getSettings(this .up('window'));
									 * me.record.set('settings', settings);
									 * me.setLoading(label_map.loading); var
									 * filterUrl = me.generateUrl(settings);
									 * me.ajaxRequest(filterUrl);
									 */
									me.up('panel').fireEvent('saveSettings',
											record, settings);
									this.up('window').close();
								}
							}]
				});
		portletSettings.show();
		this.addSendingAccountsMenuItems(portletSettings);
		this.addMyProductsMenuItems(portletSettings);
		this.addClientMenu(portletSettings);
		this.addDatePanel(portletSettings);
		this.addDateMenu(portletSettings);
		me.getSettingsPanel().setSettings(portletSettings,
				record.get('settings'));
	},
	getSettingsPanel : function() {
		var me = this;

		var paymentCategoryStore = Ext.create('Ext.data.Store', {
					fields : ['colId', 'colDesc']
				});

		Ext.Ajax.request({
					url : 'services/paymentMethod.json',
					method : 'GET',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.instrumentType;
						if (paymentCategoryStore) {
							paymentCategoryStore.removeAll();
							var count = data.length;
							if (count > 0) {
								paymentCategoryStore.add({
											'colId' : 'All',
											'colDesc' : 'All'
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'colId' : data[index].instTypeCode,
									'colDesc' : data[index].instTypeDescription
								}
								paymentCategoryStore.add(record);
							}
						}
					},
					failure : function() {
					}
				});
		var settingsPanel = Ext.create('Ext.panel.Panel', {
			padding : '10 10 10 10',
			items : [{
				xtype : 'container',
				layout : {
					type : 'hbox',
					pack : 'center'
				},
				flex : 1,
				items : [{
					xtype : 'checkboxgroup',
					columns : [110, 100],
					labelAlign : 'top',
					fieldLabel : getLabel("paymentType", "Payment Type"),
					labelSeparator : '',
					labelCls : 'frmLabel',
					flex : 0.33,
					vertical : true,
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
					flex : 0.33,
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
					xtype : 'container',
					layout : 'hbox',
					flex : 0.32,
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
								width : 160,
								height : 45,
								name : 'Client',
								clientCodesData : '',
								value : getLabel('allCompanies',
										'All companies')
							}, {
								xtype : 'button',
								border : 0,
								margin : '18 0 0 0',
								itemId : 'clientBtn',
								cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
								glyph : 'xf0d7@fontawesome',
								height : 25,
								menuAlign : 'tr-br',
								menu : Ext.create('Ext.menu.Menu', {
											itemId : 'clientMenu',
											width : 185,
											cls : 'ux_dropdown',
											maxHeight : 200,
											items : []
										}),
								handler : function(btn, event) {
									btn.menu.show();
								}
							}]
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				flex : 1,
				padding : '10 10 10 0',
				items : [{
					xtype : 'container',
					layout : 'vbox',
					flex : 0.35,
					items : [{
						xtype : 'combo',
						itemId : 'payCategory',
						multiSelect : false,
						labelAlign : 'top',
						labelSeparator : '',
						labelCls : 'frmLabel',
						fieldCls : 'ux_no-border-right  xn-form-field',
						triggerBaseCls : 'xn-form-trigger',
						editable : false,
						width : 165,
						displayField : 'colDesc',
						valueField : 'colId',
						queryMode : 'local',
						value : 'All',
						store : paymentCategoryStore,
						fieldLabel : getLabel("paymentType",
								"Payment Type")
					}]
				}, {
					xtype : 'container',
					layout : 'vbox',
					flex : 0.35,
					items : [{
								xtype : 'monthfield',
								itemId : 'startingFrom',
								format : 'Y-m-d',
								maxValue : new Date(),
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								fieldCls : 'ux_no-border-right xn-form-field',
								width : 180,
								triggerBaseCls : 'xn-form-trigger',
								editable : false,
								fieldLabel : getLabel("startingFrom",
										"Starting From")
							}]
				}, {
					xtype : 'container',
					layout : 'vbox',
					itemId : 'completDatePanel',
					flex : 0.33,
					items : [{
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'creationDateLbl',
									name : 'creationDateLbl',
									text : getLabel("creationDate",
											"Creation Date"),
									style : {
										'padding-right' : '10px !important'
									},
									cls : 'frmLabel'
								}, {
									xtype : 'button',
									border : 0,
									itemId : 'creationDateBtn',
									name : 'creationDateBtn',
									cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
									glyph : 'xf0d7@fontawesome',
									menu : Ext.create('Ext.menu.Menu', {
												itemId : 'dateMenu',
												width : 220,
												cls : 'ux_dropdown',
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
									name : 'dateFilterFrom'
								}, {
									xtype : 'label',
									itemId : 'dateFilterTo',
									name : 'dateFilterTo'
								}]
					}]
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				padding : '10 10 10 0',
				flex : 1,
				items : [{
							xtype : 'AutoCompleter',
							flex : 0.33,
							fieldCls : 'xn-form-text w165 xn-suggestion-box',
							labelCls : 'frmLabel',
							fieldLabel : getLabel("createdBy", "Created By"),
							labelAlign : 'top',
							labelSeparator : '',
							itemId : 'createdBy',
							name : 'createdBy',
							cfgUrl : 'services/userseek/corpuser.json',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'createdBy',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'CODE',
							cfgDataNode2 : 'DESCR',
							cfgKeyNode : 'CODE'

						}, {
							xtype : 'container',
							layout : 'vbox',
							flex : 0.35,
							items : [{
								xtype : 'label',
								text : getLabel("paymentMethod",
										"Payment Package"),
								cls : 'frmLabel'
							}, {
								xtype : 'container',
								layout : 'hbox',
								itemId : 'payMethodContainer',
								items : [{
									xtype : 'textfield',
									itemId : 'payMethod',
									width : 165,
									height : 25,
									name : 'payMethod',
									productCodesData : '',
									editable : false,
									fieldCls : 'ux_no-border-right xn-form-field',
									readOnly : true,
									value : 'All'
								}, {
									xtype : 'button',
									border : 0,
									height : 25,
									itemId : 'payMethodDropDown',
									cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
									iconCls : 'black',
									glyph : 'xf0d7@fontawesome',
									menuAlign : 'tr-br',
									menu : Ext.create('Ext.menu.Menu', {
												itemId : 'payMethodMenu',
												width : 190,
												cls : 'ux_dropdown',
												maxHeight : 200,
												items : []
											})
								}]
							}]
						}, {
							xtype : 'container',
							layout : 'vbox',
							flex : 0.33,
							items : [{
								xtype : 'label',
								margin : '0 0 3 0',
								text : getLabel("sendingAccounts",
										"Sending Accounts"),
								cls : 'frmLabel'

							}, {
								xtype : 'container',
								layout : 'hbox',
								itemId : 'sendingAccountContainer',
								items : [{
									xtype : 'textfield',
									itemId : 'AccountNo',
									width : 145,
									height : 25,
									name : 'AccountNo',
									editable : false,
									fieldCls : 'ux_no-border-right xn-form-field',
									readOnly : true,
									value : 'All'
								}, {
									xtype : 'button',
									border : 0,
									height : 25,
									itemId : 'sendingAccountDropDown',
									cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
									iconCls : 'black',
									glyph : 'xf0d7@fontawesome',
									menuAlign : 'tr-br',
									menu : Ext.create('Ext.menu.Menu', {
												itemId : 'sendingAccountMenu',
												width : 170,
												cls : 'ux_dropdown',
												maxHeight : 200,
												items : []
											})
								}]
							}]
						}]

			}, {
				xtype : 'container',
				layout : 'hbox',
				padding : '10 10 10 0',
				flex : 1,
				items : [{
							xtype : 'textfield',
							hideTrigger : true,
							flex : 0.33,
							labelAlign : 'top',
							labelSeparator : '',
							fieldLabel : getLabel("widgetName", "Widget Name"),
							itemId : 'customname',
							fieldCls : 'xn-form-text w165',
							labelCls : 'frmLabel',
							name : 'customname',
							maxLength : 40, // restrict user to enter 40 chars
											// max
							enforceMaxLength : true,
							maskRe : /[A-Za-z0-9 .]/
						}, {
							xtype : 'container',
							flex : 0.66
						}]

			}],
			setSettings : function(widget, settings) {
				var strSqlDateFormat = 'm/d/Y';
				var temp = widget.down('label[itemId="creationDateLbl"]');
				if (temp.text == "Creation Date") {
					var dateFilterLabel = "Creation Date (Latest)";
					widget.down('label[itemId="creationDateLbl"]')
							.setText(dateFilterLabel);
				}
				for (i = 0; i < settings.length; i++) {
					fieldName = settings[i].field;
					fieldVal = settings[i].value1;
					fieldVal2 = settings[i].value2;
					operatorValue = settings[i].operator;
					if (fieldName === 'CreditDebitFlag') {
						/*
						 * var radioGroupRef = widget
						 * .down('radiogroup[itemId=CreditDebitFlag]'); if
						 * (!Ext.isEmpty(radioGroupRef)) { if
						 * (!Ext.isEmpty(fieldVal)) radioGroupRef.setValue({
						 * CreditDebitFlag : fieldVal }); }
						 */
						if (fieldVal === 'D') {
							var debitRadio = widget
									.down('radio[inputValue="D"]');
							debitRadio.setValue(true);
						}
						if (fieldVal === 'C') {
							var creditRadio = widget
									.down('radio[inputValue="C"]');
							creditRadio.setValue(true);
						}
					}

					if (fieldName === 'startingFrom') {
						var startingFromValue = widget
								.down('monthfield[itemId="startingFrom"]');
						if (!Ext.isEmpty(startingFromValue)) {
							if (!Ext.isEmpty(fieldVal))
								startingFromValue.setValue(fieldVal);
						}
					}

					if (fieldName === 'InstrumentType') {
						var paymentCategoryValue = widget
								.down('combo[itemId="payCategory"]');
						if (!Ext.isEmpty(paymentCategoryValue)) {
							if (!Ext.isEmpty(fieldVal))
								paymentCategoryValue.setValue(fieldVal);
						}
					}

					if (fieldName === 'Client') {
						var clientField = widget
								.down('textfield[itemId=Client]');
						if (!Ext.isEmpty(clientField)) {
							if (!Ext.isEmpty(fieldVal2))
								clientField.setValue(fieldVal2);
							clientField.clientCodesData = fieldVal;
						}
					}

					if (fieldName === 'Maker') {
						var createdByValue = widget
								.down('AutoCompleter[itemId="createdBy"]');
						if (!Ext.isEmpty(createdByValue)) {
							if (!Ext.isEmpty(fieldVal))
								createdByValue.setValue(fieldVal);
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
					if (fieldName === 'EntryDate') {
						var dateFilterLabel = settings[i].dateLabel;
						var datefrom = new Date(fieldVal);
						var dateto = new Date(fieldVal2);
						fieldVal = Ext.Date.format(datefrom, strSqlDateFormat);
						fieldVal2 = Ext.Date.format(dateto, strSqlDateFormat);
						
						if(dateFilterLabel.indexOf("Date Range") > -1){
							widget.down('label[itemId="creationDateLbl"]')
								.setText(dateFilterLabel);
							widget.down('container[itemId="dateRangeComponent"]').show();
							widget.down('label[itemId="dateFilterFrom"]').hide();
							widget.down('label[itemId="dateFilterTo"]').hide();
							widget.down('datefield[itemId="fromDate"]').setValue( fieldVal );
							widget.down('datefield[itemId="toDate"]').setValue( fieldVal2 );
						}
					else{
						widget.down('label[itemId="dateFilterFrom"]').show();
						widget.down('label[itemId="dateFilterTo"]').show();
						widget.down('label[itemId="creationDateLbl"]')
								.setText(dateFilterLabel);
						widget.down('label[itemId="dateFilterFrom"]')
								.setText(fieldVal);
						widget.down('label[itemId="dateFilterTo"]').setText('-'
								+ fieldVal2);
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

					if (fieldName === 'ProductType') {
						var menuRef = widget
								.down('menu[itemId="payMethodMenu"]');
						var payMethod = widget
								.down('textfield[itemId="payMethod"]');
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

						if (!Ext.isEmpty(payMethod)) {
							if (!Ext.isEmpty(fieldVal2))
								payMethod.setValue(fieldVal2);
						}
					}

					if (fieldName === 'AccountNoPDT') {
						var menuRef = widget
								.down('menu[itemId="sendingAccountMenu"]');
						var sendingAccount = widget
								.down('textfield[itemId="AccountNo"]');
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

						if (!Ext.isEmpty(sendingAccount)) {
							if (!Ext.isEmpty(fieldVal2))
								sendingAccount.setValue(fieldVal2);
						}
					}
				}
			},
			getSettings : function(portletPanel) {
				var me = portletPanel;
				var jsonArray = [];
				// Client
				var clientCode = me.down('textfield[itemId="Client"]').clientCodesData;
				var clientDesc = me.down('textfield[itemId="Client"]')
						.getValue();
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

				// Starting From

				var startingFromField = me
						.down('monthfield[itemId="startingFrom"]');
				var startingFrom = startingFromField.rawValue;
				if (!Ext.isEmpty(startingFrom)) {
					jsonArray.push({
								field : 'startingFrom',
								value1 : Ext.util.Format.date(startingFrom,
										'Y-m-d'),
								operator : 'le',
								dataType : 'D',
								displayType : 5
							});
				}

				// Batch or Single
				var instrumentType = '';
				var multiPayValue = me
						.down('checkbox[itemId="multiPayCheckBox"]').getValue();
				var singlePayValue = me
						.down('checkbox[itemId="singlePayCheckBox"]')
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
				var paymentCategoryValue = me
						.down('combo[itemId="payCategory"]').getValue();
				if (!Ext.isEmpty(paymentCategoryValue)
						&& paymentCategoryValue != 'All') {
					jsonArray.push({
								field : 'InstrumentType',
								operator : 'eq',
								value1 : paymentCategoryValue,
								dataType : 0,
								displayType : 6
							});
				}

				// Entry User
				var entryUser = me.down('AutoCompleter[itemId="createdBy"]')
						.getValue();
				if (!Ext.isEmpty(entryUser)) {
					jsonArray.push({
								field : 'Maker',
								operator : 'eq',
								value1 : entryUser,
								dataType : 0,
								displayType : 4
							});
				}

				// CreditDebitFlag
				var creditDebitFlagValue = me
						.down('radiogroup[itemId="creditDebitFlag"]')
						.getValue().creditDebitFlag;
				if (!Ext.isEmpty(creditDebitFlagValue)
						&& creditDebitFlagValue != 'All') {
					jsonArray.push({
								field : 'CreditDebitFlag',
								operator : 'eq',
								value1 : creditDebitFlagValue,
								dataType : 0,
								displayType : 4
							});
				}
				// sending account #
				var sendingAcctNo = me.down('textfield[itemId="AccountNo"]')
						.getValue();
				if (!Ext.isEmpty(sendingAcctNo) && sendingAcctNo != 'All') {
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
				// Payment Method
				var ProductType = me.down('textfield[itemId="payMethod"]')
						.getValue();
				var productCodesData = me.down('textfield[itemId="payMethod"]').productCodesData;
				if (!Ext.isEmpty(ProductType) && ProductType != 'All') {
					jsonArray.push({
								field : 'ProductType',
								operator : 'in',
								value1 : productCodesData,
								value2 : ProductType,
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

				// Creation Date

				var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
				var fromCreation, toCreation, creationFromDate, creationToDate;
				if(dateLabel.indexOf("Date Range") > -1){
					var portlet2 =	me.down('container[itemId="completDatePanel"]');
					var daterange = 	portlet2.down('container[itemId="dateRangeComponent"]');
					fromCreation = daterange.down('datefield[itemId="fromDate"]').getValue();
					toCreation = daterange.down('datefield[itemId="toDate"]').getValue();
					
					if(Ext.isEmpty(toCreation)){
						toCreation = fromCreation;
					}
					creationFromDate = fromCreation;
					creationToDate = toCreation;
				}
				else{
				var fromCreation = me.down('label[itemId="dateFilterFrom"]');
				var toCreation = me.down('label[itemId="dateFilterTo"]');
				var creationFromDate = (!Ext.isEmpty(fromCreation.text))
						? (fromCreation.text.substring(0,
								fromCreation.text.length - 3))
						: '';
				var creationToDate = (!Ext.isEmpty(toCreation.text))
						? toCreation.text
						: '';
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
						displayType : 5
					});
				}

				return jsonArray;
			}
		});
		return settingsPanel;
	}
});
