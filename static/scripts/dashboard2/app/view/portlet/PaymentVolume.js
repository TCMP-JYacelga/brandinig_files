var colors = ['#EDE4DF', '#DCD4D1'];
Ext.define('Cashweb.view.portlet.PaymentVolume', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.paymentvolume',
	cols : 3,
	border : false,
	animate : false,
	shadow : false,
	margin : '0 10 0 0',
	strFilter : '',
	selectedClientCode : '',
	dateFilterLabel : 'Creation Date( Latest )',
	dateFilterVal : '12',
	dateHandler : null,
	vFromDate1 : null,
	vToDate1 : null,
	jsonData : null,
	titleStr : '(MILLIONS)',
	dateType : "YEAR",
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;

		thisClass.on('refreshWidget', function() {
					var record = thisClass.record, settings = [];
					thisClass.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					filterUrl = thisClass.generateUrl(settings);
					thisClass.setTitle(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});

		thisClass.on('render', function(component, eOpts) {
					var settings = [];
					var filterUrl = '';
					var record = thisClass.record;
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
					}
					filterUrl = thisClass.generateUrl(settings);
					// thisClass.setTitle(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});

		thisClass.on('reloadChart', function(btn, opts) {
					var weekArray = thisClass.jsonData.week;
					var monthArray = thisClass.jsonData.month;
					var yearArray = thisClass.jsonData.year;

					if (btn.itemId === 'year') {
						if (Ext.isEmpty(yearArray)) {
							thisClass.down('label[itemId=errorLabel]').show();
							thisClass.down('panel[itemId=cashflowCreditPanel]')
									.hide();
							thisClass.getTargetEl().unmask();
						} else {
							thisClass.titleStr = '(MILLIONS)';
							thisClass.dateType = "YEAR";
							thisClass.down('label[itemId=errorLabel]').hide();
							thisClass.down('panel[itemId=cashflowCreditPanel]')
									.show();
							thisClass.loadData(null, null, yearArray);
						}
					}

					if (btn.itemId === 'month') {
						if (Ext.isEmpty(monthArray)) {
							thisClass.down('label[itemId=errorLabel]').show();
							thisClass.down('panel[itemId=cashflowCreditPanel]')
									.hide();
							thisClass.getTargetEl().unmask();
						} else {
							thisClass.titleStr = '(MILLIONS)';
							thisClass.dateType = "MONTH";
							thisClass.down('label[itemId=errorLabel]').hide();
							thisClass.down('panel[itemId=cashflowCreditPanel]')
									.show();
							thisClass.loadData(null, monthArray, null);
						}
					}

					if (btn.itemId === 'week') {
						if (Ext.isEmpty(weekArray)) {
							thisClass.down('label[itemId=errorLabel]').show();
							thisClass.down('panel[itemId=cashflowCreditPanel]')
									.hide();
							thisClass.getTargetEl().unmask();
						} else {
							thisClass.titleStr = '';
							thisClass.dateType = "WEEK";
							thisClass.down('label[itemId=errorLabel]').hide();
							thisClass.down('panel[itemId=cashflowCreditPanel]')
									.show();
							thisClass.loadData(weekArray, null, null);
						}
					}
				});

		Ext.apply(this, {
			items : [{
				xtype : 'panel',
				height : 50,
				padding : '10 0 0 600',
				items : [{
					xtype : 'buttongroup',
					cls : 'rightfloating button-transparent-background ux_button-group',
					items : [{
								text : getLabel("year", "YEAR"),
								itemId : 'year',
								cls : 'xn-btn ux-button-s',
								handler : function(btn, opts) {
									thisClass.fireEvent('reloadChart', btn,
											opts);
								}
							}, {
								text : getLabel("month", "MONTH"),
								itemId : 'month',
								cls : 'xn-btn ux-button-s',
								handler : function(btn, opts) {
									thisClass.fireEvent('reloadChart', btn,
											opts);
								}
							}, {
								text : getLabel("week", "WEEK"),
								itemId : 'week',
								cls : 'xn-btn ux-button-s',
								handler : function(btn, opts) {
									thisClass.fireEvent('reloadChart', btn,
											opts);
								}
							}]
				}]

			}, {
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
				itemId : 'cashflowCreditPanel',
				autoHeight : true,
				items : [{
							xtype : 'panel',
							itemId : 'chartCreditPanel',
							items : [],
							margins : {
								top : 10,
								left : 0,
								right : 0,
								bottom : 0
							}
						}]
			}]
		});
		this.callParent();
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
					if(count > 1){
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
					if(menuRef.items.length==1){
						summaryPortlet.down('textfield[itemId="Client"]').setValue(menuRef.items.items[0].text);
					}
					else{
						if(Ext.isEmpty(summaryPortlet.down('textfield[itemId="Client"]').getValue()))
					    summaryPortlet.down('textfield[itemId="Client"]').setValue(menuRef.items.items[0].text);
					}
				}
			},
			failure : function(summaryPortlet) {

			}
		});
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
	addSendingAccountsMenuItems : function(summaryPortlet) {
		var me = this;
		Ext.Ajax.request({
			url : 'services/userseek/debitaccounts.json?$top=-1&$skip=-1&$filterCode1='
					+ me.selectedClientCode,
			method : 'GET',
			async : false,
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var data = responseData.d.preferences;
				me.loadSendingAccountMenu(summaryPortlet, data);
			},
			failure : function() {
				// console.log("Error Occured - Addition Failed");
			}
		});
	},

	loadSendingAccountMenu : function(summaryPortlet, data) {
		var me = this;
		var menuRef = summaryPortlet.down('menu[itemId="sendingAccountMenu"]');
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
									me.sendingAccMenuAllHandler(summaryPortlet,
											menuRef, item, checked);
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
										summaryPortlet, menuRef, item, checked);
							}
						}
					});

				}
			}
		}
	},
	sendingAccMenuAllHandler : function(summaryPortlet, menuRef, item, checked) {
		var me = this;
		var sendingAccountTextField = summaryPortlet
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
	updateSendingAccountTextField : function(summaryPortlet, menuRef, item,
			checked) {
		var me = this;
		var maxCountReached = false;

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = menuRef.items.items;
			var itemArrayLength = itemArray.length;
			var sendingAccountTextField = summaryPortlet
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
	// Sending Account field handling ends
	generateUrl : function(settings) {
		var me = this;
		var isFilterApplied = false;
		var strFilter = '';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {

				if (settings[index].field != 'customname') {
					if (settings[index].field == 'dateType')
						continue;
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
	setRefreshLabel : function() {
		var thisClass = this;
		$("#" + thisClass.titleId).empty();
		var label = Ext.create('Ext.form.Label', {
					text : getLabel('asof',"As of ")+ displaycurrenttime(),
					margin : '0 0 0 5',
					style : {
						'font-size' : '14px !important',
						'font-weight' : 'bold',
						'float' :'right',
						'color' : '#67686b'
					},
					renderTo : Ext.get(thisClass.titleId)
				});
	},
	ajaxRequest : function(filterUrl, settings) {
		var obj;
		var dateTypeStr = '';
		var me = this;
		var strUrl = 'services/getPaymentVolume.json' + filterUrl;
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					// async : false,
					success : function(response) {
						me.chartServiceData = response.responseText;
						var objData = Ext.decode(me.chartServiceData);
						me.jsonData = objData;

						for (var index = 0; index < settings.length; index++) {

							if (settings[index].field === 'dateType') {
								dateTypeStr = settings[index].value1;
								break;
							}
						}

						if (Ext.isEmpty(objData.week)
								|| Ext.isEmpty(objData.month)
								|| Ext.isEmpty(objData.year)) {
							me.down('label[itemId=errorLabel]').show();
							me.down('panel[itemId=cashflowCreditPanel]').hide();
							me.getTargetEl().unmask();
						} else {
							if (!Ext.isEmpty(dateTypeStr)
									&& dateTypeStr === "YEAR") {
								me.loadData(null, null, objData.year);
							} else if (!Ext.isEmpty(dateTypeStr)
									&& dateTypeStr === "MONTH") {
								me.loadData(null, objData.month, null);
							} else if (!Ext.isEmpty(dateTypeStr)
									&& dateTypeStr === "WEEK") {
								me.loadData(objData.week, null, null);
							} else {
								me.down('label[itemId=errorLabel]').hide();
								me.down('panel[itemId=cashflowCreditPanel]')
										.show();
								me.loadData(null, null, objData.year);
							}

							me.down('label[itemId=errorLabel]').hide();
							me.down('panel[itemId=cashflowCreditPanel]').show();
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

	getDate : function(date) {
		var strDate = '';
		var strDay = '';
		var strYear = dtApplicationDate.split('/')[2];

		strDay = date[0] + date[1];
		var month = date[2] + date[3] + date[4];

		switch (month) {
			case 'Jan' :
				strDate = strYear + "-01-" + strDay;
				break;
			case 'Feb' :
				strDate = strYear + "-02-" + strDay;
				break;
			case 'Mar' :
				strDate = strYear + "-03-" + strDay;
				break;
			case 'Apr' :
				strDate = strYear + "-04-" + strDay;
				break;
			case 'May' :
				strDate = strYear + "-05-" + strDay;
				break;
			case 'Jun' :
				strDate = strYear + "-06-" + strDay;
				break;
			case 'Jul' :
				strDate = strYear + "-07-" + strDay;
				break;
			case 'Aug' :
				strDate = strYear + "-08-" + strDay;
				break;
			case 'Sep' :
				strDate = strYear + "-09-" + strDay;
				break;
			case 'Oct' :
				strDate = strYear + "-10-" + strDay;
				break;
			case 'Nov' :
				strDate = strYear + "-11-" + strDay;
				break;
			case 'Dec' :
				strDate = strYear + "-12-" + strDay;
				break;
		}
		return strDate;
	},

	createDateFilter : function(date, dateType) {
		var strDate = '';
		var strYear = dtApplicationDate.split('/')[2];
		if (dateType === "YEAR")
			strDate = "01/01/" + date;

		if (dateType === "MONTH") {
			switch (date) {
				case 'Jan' :
					strDate = "01/01/" + strYear;
					break;
				case 'Feb' :
					strDate = "02/01/" + strYear;
					break;
				case 'Mar' :
					strDate = "03/01/" + strYear;
					break;
				case 'Apr' :
					strDate = "04/01/" + strYear;
					break;
				case 'May' :
					strDate = "05/01/" + strYear;
					break;
				case 'Jun' :
					strDate = "06/01/" + strYear;
					break;
				case 'Jul' :
					strDate = "07/01/" + strYear;
					break;
				case 'Aug' :
					strDate = "08/01/" + strYear;
					break;
				case 'Sep' :
					strDate = "09/01/" + strYear;
					break;
				case 'Oct' :
					strDate = "10/01/" + strYear;
					break;
				case 'Nov' :
					strDate = "11/01/" + strYear;
					break;
				case 'Dec' :
					strDate = "12/01/" + strYear;
					break;
			}
		}

		var objDateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		var date = new Date(Ext.Date.parse(strDate, "m/d/Y"));
		var dtJson = {};
		if (dateType === "YEAR")
			dtJson = objDateHandler.getLastYear(date);
		if (dateType === "MONTH")
			dtJson = objDateHandler.getThisMonthStartAndEndDate(date);

		fieldValue1 = Ext.Date.format(dtJson.fromDate, 'Y-m-d');
		fieldValue2 = Ext.Date.format(dtJson.toDate, 'Y-m-d');

		var dateRange = {};
		dateRange.val1 = fieldValue1;
		dateRange.val2 = fieldValue2;
		return dateRange;
	},

	loadData : function(week, month, year) {

		var me = this;
		var storeData = [];
		if (!Ext.isEmpty(week)) {
			for (var i = 0; i < week.length; i++) {
				var colJson = {};
				if (week[i]) {
					colJson["Amount"] = parseInt(week[i].Amount
							.replace(',', ''),10);
					colJson["Date"] = week[i].Date;
				}
				storeData.push(colJson);
			}
		}

		if (!Ext.isEmpty(month)) {
			for (var i = 0; i < month.length; i++) {
				var colJson = {};
				if (month[i]) {
					colJson["Amount"] = month[i].Amount;
					colJson["Date"] = month[i].Date;
				}
				storeData.push(colJson);
			}
		}

		if (!Ext.isEmpty(year)) {
			for (var i = 0; i < year.length; i++) {
				var colJson = {};
				if (year[i]) {
					colJson["Amount"] = year[i].Amount;
					colJson["Date"] = year[i].Date;
				}
				storeData.push(colJson);
			}
		}

		if (storeData.length > 0) {
			var debitChart = me.createCreditChart(storeData);
			var chartPanel = me.down('panel[itemId=chartCreditPanel]');
			chartPanel.removeAll();
			chartPanel.add(debitChart);
			chartPanel.doLayout();
		}
		me.getTargetEl().unmask();
		me.setLoading(false);
	},

	createCreditChart : function(storeData) {
		var thisClass = this, chart;
		var paymentsVolumeStore = Ext.create('Ext.data.JsonStore', {
					fields : ['Amount', 'Date']
				});
		paymentsVolumeStore.loadData(storeData);

		chart = Ext.create('Ext.chart.Chart', {
			minWidth : 850,
			minHeight : 170,
			itemId : "payVol",
			shadow : false,
			store : paymentsVolumeStore,
			axes : [{
						type : 'Numeric',
						position : 'left',
						fields : ['Amount'],
						title : this.titleStr,
						labelTitle : {
							font : '12px Arial'
						},
						grid : false,
						label : {
							'fill' : '#6E6A68',
							font : '11px Helvetica, sans-serif'
						},
						dashSize : 0,
						minimum : 0,
						majorTickSteps : 2
					}, {
						type : 'Category',
						position : 'bottom',
						fields : ['Date'],
						dashSize : 0,
						title : false,
						label : {
							'fill' : '#6E6A68',
							font : '11px Helvetica, sans-serif'
						},
						getOrCreateLabel : function(i, text) {
							var me = this, labelGroup = me.labelGroup, textLabel = labelGroup
									.getAt(i), surface = me.chart.surface;
							if (textLabel) {
								if (text != textLabel.attr.text) {
									textLabel.setAttributes(Ext.apply({
														text : text,
														listeners : {
															'click' : function(
																	obj, eOpts) {
															}
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
										'click' : function(obj, eOpts) {
											var filterDate = '';
											var fieldValue1 = '';
											var fieldValue2 = '';
											var navSettings = thisClass.record
													.get('settings');
											if (thisClass.dateType === "YEAR")
												filterDate = parseInt(obj.text,10)
														+ 1;

											if (thisClass.dateType === "MONTH")
												filterDate = obj.text;

											if (thisClass.dateType === "WEEK") {
												var rangeArray = obj.text
														.split('-');
												fieldValue1 = thisClass
														.getDate(rangeArray[0]);
												fieldValue2 = thisClass
														.getDate(rangeArray[1]);
											}

											if (thisClass.dateType != "WEEK") {
												var dateRange = thisClass
														.createDateFilter(
																filterDate,
																thisClass.dateType);
												fieldValue1 = dateRange.val1;
												fieldValue2 = dateRange.val2;
											}

											var filter = thisClass.strFilter;

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
														+ fieldValue2 + "'";
											else
												filter = filter
														+ " and EntryDate bt date'"
														+ fieldValue1
														+ "' and date'"
														+ fieldValue2 + "'";
											filter = filter + '&$filterDetail='
													+ filterDetail;

											if (navSettings === ""
													|| JSON
															.stringify(navSettings) === '{}')
												navSettings = [];

											thisClass.fireEvent(
													'navigateToPayments',
													filter, navSettings);
										}
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
						type : 'column',
						axis : 'bottom',
						gutter : 0,
						highlight : {
							fill : '#F36F27',
							stroke : '#F36F27'
						},
						showInLegend : true,
						xPadding : 0,
						renderer : function(sprite, record, attributes, index,
								store) {
							attributes.fill = colors[index % colors.length];

							return attributes;
						},
						tips : {
							trackMouse : true,
							anchor : 'bottom',
							bodyBorder : false,
							border : 0,
							style : {
								'background-color' : '#F36F27 !important',
								// color : '#000 !important'
								borderColor : '#FF4000 !important',
								borderStyle : 'solid'
							},
							height : 37,
							width : 55,
							bodyStyle : {
								background : '#F36F27 !important',
								color : '#000 !important',
								width : '55px !important'
							},
							renderer : function(storeItem, item) {
								this.setTitle('$' + storeItem.get('Amount'));
							}
						},
						xField : 'Date',
						yField : 'Amount'
					}]
		});
		return chart;
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
					dateType : this.dateType,
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
									/*
									 * me.up('panel').fireEvent( 'saveSettings',
									 * record, me.getSettingsPanel()
									 * .getSettings(this .up('window')));
									 */
									var settings = me.getSettingsPanel()
											.getSettings(this.up('window'));
									me.record.set('settings', settings);
									me.setLoading(label_map.loading);
									var filterUrl = me.generateUrl(settings);
									me.ajaxRequest(filterUrl, settings);
									me.setTitle(settings);
									me.up('panel').fireEvent('saveSettings',
											record, settings);
									this.up('window').close();
								}
							}]
				});
		portletSettings.show();
		me.addSendingAccountsMenuItems(portletSettings);
		me.addMyProductsMenuItems(portletSettings);
		me.addClientMenu(portletSettings);
		me.getSettingsPanel().setSettings(portletSettings,
				me.record.get('settings'));
	},
	setTitle : function(settings) {
		var me = this;
		var titleChangeFlag = false;
		for (var i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			if (fieldName === 'customname' && !Ext.isEmpty(fieldVal)) {
				me.up('panel').setTitle(fieldVal + '<span id='
						+ me.record.get('widgetCode').toLowerCase()
						+ me.record.get('position') + '>&nbsp;&nbsp;</span> ');
				titleChangeFlag = true;
				break;
			}
		}		
		if(!titleChangeFlag){
			var defaultTitle = label_map[me.record.get('widgetCode').toLowerCase()];
			me.up('panel').setTitle(defaultTitle + '<span id='
						+ me.record.get('widgetCode').toLowerCase()
						+ me.record.get('position') + '>&nbsp;&nbsp;</span> ');
		}
	},
	getSettingsPanel : function() {
		var me = this;

		var paymentCategoryStore = Ext.create('Ext.data.Store', {
					fields : ['colId', 'colDesc']
				});

		Ext.Ajax.request({
					url : 'services/instrumentType.json',
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
			//padding : '10 10 10 10',
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
								clientCodesData : ''
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
								width : 165,
								triggerBaseCls : 'xn-form-trigger',
								editable : false,
								fieldLabel : getLabel("startingFrom",
										"Starting From")
							}]
				}, {
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

				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				padding : '10 10 10 0',
				flex : 1,
				items : [{
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
				}, {
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
					maxLength : 40, // restrict user to enter 40 chars max
					enforceMaxLength : true,
					maskRe : /[A-Za-z0-9 .]/
				}]

			}],
			setSettings : function(widget, settings) {
				for (i = 0; i < settings.length; i++) {
					fieldName = settings[i].field;
					fieldVal = settings[i].value1;
					fieldVal2 = settings[i].value2;
					operatorValue = settings[i].operator;
					if (fieldName === 'CreditDebitFlag') {

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

				// Year/Month/Week
				if (!Ext.isEmpty(me.dateType)) {
					jsonArray.push({
								field : 'dateType',
								operator : 'eq',
								value1 : me.dateType,
								dataType : 0,
								displayType : 6
							});
				}

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

				return jsonArray;
			}
		});
		return settingsPanel;
	}

});