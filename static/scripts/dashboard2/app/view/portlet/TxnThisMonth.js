Ext.define('Cashweb.view.portlet.TxnThisMonth', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.txnthismonth',
	requires : ['Cashweb.store.TxnThisMonthStore','Ext.chart.series.Bar'],
	border : false,
	cols : 2,
	emptyText : null,
	taskRunner : null,
	minHeight : 336,
	selectedData:[],
	dateFilterLabel : getLabel('thismonth', 'Last Quarter To Date'),
	dateFilterVal : '9',
	bodyStyle: 'background:#fff',
	colorSet : [],
	hideHeaders : true,
	ccyCode : '',
	strFilter : '',
	accountFilter : '$accountID=(ALL)',
	txnTypeFilter : '',
	navStore : null,
	dateRangeFilterVal : '13',
	datePickerSelectedDate : [],
	datePickerSelectedEntryDate : [],
	portletref : null,
	dateHandler : null,
	vFromDate1 : null,
	vToDate1 : null,
	filterRestrict : '999',
	enableQueryParam : false,
	titleId : '',
	txn_date_opt : null,
	height:336,
	cls : 'chart_wgt',
	activityDates : '',
	typeCodefield : false,
	typcodesellerlevel :[],
	initComponent : function() {
		var me = this;
		var strClient = null;
		var strClientDescr = null;
		var jsonArray =[];
		me.emptyText = label_map.noDataFound;
		
		if (!Ext.isEmpty(sellertypecode))
		{
			var sellertypecodeArr = sellertypecode.split(',');
			for (var i = 0; i < sellertypecodeArr.length; i++) {
				var value = sellertypecodeArr[i].split('=');
				var record = {
						'CODE' : value[0].trim(),
						'DESCR' : value[1]
					};
					jsonArray.push(record);
			}
			me.typcodesellerlevel = jsonArray;
		}
		me.on('refreshWidget', function() {
					var record = me.record, settings = [], txnPresentFlag = false;
					var filterUrl = '';
					me.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'txntype') {
							txnPresentFlag = true;
							break;
						}
					}
					if (!txnPresentFlag) {
						me.fetchTypeCodes(settings);
					} else {
						filterUrl = me.generateUrl(settings);
						me.ajaxRequest(filterUrl, settings, false);
					}
				});

		me.on('render', function(component, eOpts) {
					var settings = [];
					var filterUrl = '';
					var txnPresentFlag = false;
					var record = me.record;
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
					}
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'txntype') {
							txnPresentFlag = true;
							break;
						}
						if (settings[i].field === 'activityDates') {
							me.dateFilterVal = settings[i].displayType;
							me.datePickerSelectedDate[0]=Ext.Date.parse(settings[i].value1, 'Y-m-d');
							me.datePickerSelectedDate[1]=Ext.Date.parse(settings[i].value2, 'Y-m-d');
						}
					}
					if (!txnPresentFlag) {
								me.dateFilterVal = '12';
								var objDateParams = me.getDateParam("12", null);
								me.dateFilterLabel = "Posting Date (Latest)";
								me.dateFilterFromVal = objDateParams.fieldValue1;
								me.dateFilterToVal = objDateParams.fieldValue2;
								vFromDate = $.		datepick.formatDate(strApplDateFormat.toLowerCase(), 
								$.
									datepick.		parseDate('yyyy-mm-dd', objDateParams.fieldValue1));
									
									vToDate = $.	datepick.
									formatDate(strApplDateFormat.toLowerCase(), $.
									
									datepick.		parseDate('yyyy-mm-dd', objDateParams.fieldValue2));

									settings.push({
											field : 'activityDates',
											operator : 'bt',
											value1 : Ext.util.Format.date(vFromDate, 'Y-m-d'),
											value2 : Ext.util.Format.date(vToDate, 'Y-m-d'),
											dateLabel : "Posting Date (Latest)",
											dataType : 'D',
											displayType : '12',
											btnValue : "12"
										});
										me.record.set('settings', settings);
						if(!txnPresentFlag)
						me.fetchTypeCodes(settings);
					}else {
						filterUrl = me.generateUrl(settings);
						me.ajaxRequest(filterUrl, settings, false);
					}
					
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
								itemId : 'txnThisMonthPanel',
								autoHeight : true,
								items : [{
											xtype : 'panel',
											itemId : 'chartTxnThisMonthPanel',
											items : []
										}]
							}]
				});

		me.callParent(arguments);
	},
	fetchTypeCodes : function(settings) {
		var me = this;
		var txnDesc = '', txn = '';
		Ext.Ajax.request({
					url : 'services/autoCompleter/typecodelistdashboard?$top=-1',
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (undefined != data) {
							var length = (data.length <= 5) ? data.length : 5;
							for (var j = 0; j < length; j++) {
								if (!Ext.isEmpty(me.typcodesellerlevel))
								{
									txn += me.typcodesellerlevel[j].CODE + ',';
									txnDesc += me.typcodesellerlevel[j].DESCR + ',';
								}
								else
								{
									txn += data[j].CODE + ',';
									txnDesc += data[j].DESCR + ',';
								}
							}
							txn = txn.substring(0, (txn.length - 1));
							txnDesc = txnDesc
									.substring(0, (txnDesc.length - 1));

							if (!Ext.isEmpty(txn)) {
								settings.push({
											field : 'txntype',
											operator : 'eq',
											value1 : txn,
											value2 : txnDesc,
											dataType : 0,
											displayType : 6
										});
							}
						}
						filterUrl = me.generateUrl(settings);
						me.ajaxRequest(filterUrl, settings, false);
					},
					failure : function() {
						// console.log("Error Occured - Addition
						// Failed");
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
						}
					}, {
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						btnValue : '4',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						btnValue : '5',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
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
						}
					}, {
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						btnValue : '11',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}]
		});
		return dropdownMenu;
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
					fieldStyle : 'background-color: white;',
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
					fieldStyle : 'background-color: white;',
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
		retObj.btnValue = index;
		return retObj;
	},
	
	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#creationDatePicker');
		var toDatePickerRef = $('#entryDataToPicker');

		if (!Ext.isEmpty(me.dateFilterLabel) && !Ext.isEmpty(me.portletref)) {
			creation_date_opt = "Posting Date (" + me.dateFilterLabel + ")";
			me.portletref.down('label[itemId="creationDateLbl"]')
			.setText("Posting Date" + " (" + me.dateFilterLabel + ")");
		}

		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.datepick('setDate', vFromDate);
			} else {
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
				/*toDatePickerRef.setDateRangePickerValue(vToDate);*/
			}
		} else {
			if (index === '1' || index === '2') {
					datePickerRef.datepick('setDate', vFromDate);
			} else {
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
			}
		}
	},

	addTxnType : function(summaryPortlet) {
		var me = this;
		Ext.Ajax.request({
					url : 'services/userseek/typecodelist',
					method : 'GET',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						var fieldData = [];
						for (var i = 0; i < data.length; i++) {
							var record = {};
							record.fieldLabel = data[i].DESCR;
							record.fieldName = data[i].CODE;
							fieldData.push(record);
						}
						me.loadTxnType(summaryPortlet, fieldData);
					},
					failure : function() {
						// console.log("Error Occured - Addition
						// Failed");
					}
				});
	},
	loadTxnType : function(summaryPortlet, data) {
		var me = this;
		var menuRef = summaryPortlet.down('menu[itemId="txnMenu"]');
		var txnTextField = summaryPortlet.down('textfield[itemId="txn"]');
		var txn = '', txnDesc = '';
		if (!Ext.isEmpty(data)) {
			if (!Ext.isEmpty(menuRef)) {
				if (menuRef.items.length > 0) {
					menuRef.removeAll();
				}
			}
			var count = data.length;
			if (count > 0) {
				for (var index = 0; index < count; index++) {
					/*var checkedFlag = false;
					if (index < 5)
						checkedFlag = true;*/
					menuRef.add({
								xtype : 'menucheckitem',
								text : data[index].fieldLabel,
								txnNo : data[index].fieldName,
								//checked : checkedFlag,
								//disabled : !checkedFlag,
								listeners : {
									checkchange : function(item, checked) {
										me.updateTxnTextField(summaryPortlet,
												menuRef, item, checked);
									}
								}
							});

					/* (checkedFlag) {
						txn += data[index].fieldName + ',';
						txnDesc += data[index].fieldLabel + ';';
						me.updateTxnTextField(summaryPortlet, menuRef, null,
								true);
					}*/
				}
				txn = txn.substring(0, (txn.length - 1));
				txnDesc = txnDesc.substring(0, (txnDesc.length - 1));
				me.txnTypeFilter = txn;
				me.txnDesc = txnDesc;
				txnTextField.setValue('');
				txnTextField.setValue(txnDesc);
				txnTextField.txnData = txn;
			}
		}
	},
	updateTxnTextField : function(summaryPortlet, menuRef, item, checked) {
		var me = this;
		if (!Ext.isEmpty(menuRef)) {
			var itemArray = menuRef.items.items;
			var itemArrayLength = itemArray.length;
			var txnTextField = summaryPortlet.down('textfield[itemId="txn"]');
			var textFieldData = '';
			var txnData = '';
			var arrTxnTypeJson = [];

			if (checked) {
				var count = 1;
				for (var index = 0; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						var code = itemArray[index].txnNo;
						var desc = itemArray[index].text;
						arrTxnTypeJson.push({
									// code : desc
									code : code
								});
						textFieldData += itemArray[index].text + ';';
						txnData += itemArray[index].txnNo + ',';
						count++;
					}
				}

			} else if (!checked) {
				for (var index = 0; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						var code = itemArray[index].txnNo;
						var desc = itemArray[index].text;
						arrTxnTypeJson.push({
									code : desc
								});
						textFieldData += itemArray[index].text + ';';
						txnData += itemArray[index].txnNo + ',';
					}
				}
			}
			me.arrTxnTypeJson = arrTxnTypeJson;
			if (count > 5) {
				for (var index = 0; index < itemArrayLength; index++) {
					if (!itemArray[index].checked) {
						itemArray[index].setDisabled(true);
					}
				}
			} else {
				for (var index = 0; index < itemArrayLength; index++) {
					if (!itemArray[index].checked) {
						itemArray[index].enable();
					}
				}
			}
			var commaSeparatedString = textFieldData.substring(0,
					(textFieldData.length - 1));
			var commaSeparatedPrdCodes = txnData.substring(0,
					(txnData.length - 1));

			txnTextField.setValue('');
			txnTextField.setValue(commaSeparatedString);
			txnTextField.txnData = commaSeparatedPrdCodes;

		}
	},
	setRefreshLabel : function() {
		var thisClass = this;
		$("#" + thisClass.titleId).empty();
		var label = Ext.create('Ext.form.Label', {
					text : "As of "+ displaycurrenttime(),
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
	ajaxRequest : function(filterUrl, settings, record) {
		var thisClass = this;
		thisClass.setTitle(settings);
		var obj;
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = filterUrl || {}, arrMatches;
		if (thisClass.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(filterUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
		}
		Ext.Ajax.request({
					url : 'services/getTransactionsBarChart.json',// strUrl,
					method : 'POST',
					params : objParam,
					success : function(response) {
						obj = Ext.decode(response.responseText);

						if (!Ext.isEmpty(obj.summary)) {
							var noOfRecords = obj.summary.length;
							var maxHeight = 47 + 37 * noOfRecords;
						}

						if (Ext.isEmpty(obj.summary)) {
							thisClass.down('label[itemId=errorLabel]').show();
							thisClass.down('panel[itemId=txnThisMonthPanel]')
									.hide();
							thisClass.getTargetEl().unmask();
							thisClass.setLoading(false);
						} else {
							thisClass.down('label[itemId=errorLabel]').hide();
							thisClass.down('panel[itemId=txnThisMonthPanel]')
									.show();
							thisClass.loadData(obj, maxHeight);
						}
						if (Ext.isEmpty(thisClass.ccyCode)
								|| thisClass.ccyCode == "undefined")
							thisClass.ccyCode = obj.currency;
						thisClass.setRefreshLabel();
						if(record){
							thisClass.up('panel').fireEvent('saveSettings',
									record, settings);
						}
					},
					failure : function(response) {
						thisClass.getTargetEl().unmask();
						thisClass.setLoading(false);
					}
				});

	},
	loadData : function(data, maxHeight) {
		var me = this;
		var storeData = [], strCategory = "";
		var arrData = data.summary;
		if (!Ext.isEmpty(arrData)) {
			for (var i = 0; i < arrData.length; i++) {
				var colJson = {};
				if (arrData[i]) {
					//colJson["COUNT"] = arrData[i].count * -1;
					//colJson["AMOUNT"] = Math.ceil(arrData[i].amount.replace(',', ''))* -1;
					colJson["COUNT"] = arrData[i].count;
					colJson["AMOUNT"] = Math.ceil(arrData[i].amount.split(',').join(''));					
					colJson["TIPAMOUNT"] = data.ccy_symbol+" "+arrData[i].amount ;
					colJson["TYPECODE_SET"] = arrData[i].typecode_set;
					colJson["TYPECODES"] = arrData[i].typecodes;
				}
				storeData.push(colJson);
				me.getTargetEl().unmask();
			}
		}
		if (storeData.length > 0) {
			var barChart = me.createBarChart(storeData, maxHeight);
			var barChartPanel = me.down('panel[itemId=chartTxnThisMonthPanel]');
			barChartPanel.removeAll();
			barChartPanel.add(barChart);
			me.doLayout();
		}
		me.getTargetEl().unmask();
		me.setLoading(false);
	},
	createBarChart : function(storeData, chartMaxHeight) {
		var thisClass = this, chart;
		var barChartStore = new Cashweb.store.TxnThisMonthStore();
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
			storeData : storeData,
			store : barChartStore,
			legend : {
				position : 'bottom',
				boxStroke : 'transparent',
				boxFill : 'transparent',
				//labelFont : '10px Helvetica, sans-serif',
				labelFont : 'bold 14px Arial-BoldMT, Arial',
				clickable : false,
				updatePosition: function(){
					var me = this,
		            items = me.items,
		            pos, i, l, bbox;
		
			        if (me.isDisplayed()) {
			            // Find the position based on the dimensions
			            pos = me.calcPosition();
			            
			            me.x = pos.x;
			            me.y = pos.y;
			
			            // Update the position of each item
			            for (i = 0, l = items.length; i < l; i++) {
			            	var item = items[i];
			            	item.updatePosition();
			            	var tspanElement = item.items[0].el.child('tspan');
							tspanElement.dom.setAttribute('dy', 4);
			            }
			            
			            bbox = me.getBBox();
			
			            //if some of the dimensions are NaN this means that we
			            //cannot set a specific width/height for the legend
			            //container. One possibility for this is that there are
			            //actually no items to show in the legend, and the legend
			            //should be hidden.
			            if (isNaN(bbox.width) || isNaN(bbox.height)) {
			                if (me.boxSprite) {
			                    me.boxSprite.hide(true);
			                }
			            }
			            else {
			                if (!me.boxSprite) {
			                    me.createBox();
			                }
			                
			                // Update the position of the outer box
			                me.boxSprite.setAttributes(bbox, true);
			                me.boxSprite.show(true);
			            }
			        }
		    },
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
					x = mfloor(chartX + chartWidth - 125 - legendWidth);
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
						fields : ['AMOUNT', 'COUNT'],
						grid: false,
						adjustMaximumByMajorUnit: true,
						adjustMinimumByMajorUnit: true,
						hidden :true,
		                minimum: 0
					}, {
						type : 'Category',
						position : 'left',
						fields : 'TYPECODE_SET',
						title : false,
						grid : false,
						getOrCreateLabel : function(i, text) {
							var me = this, labelGroup = me.labelGroup, textLabel = labelGroup
									.getAt(i), surface = me.chart.surface;
							if (textLabel) {
								if (text != textLabel.attr.text) {
									textLabel.setAttributes(Ext.apply({
										text : text,
										listeners : {
											'click' : function(obj, eOpts) {
												var typeCodes = barChartStore
														.getAt(i)
														.get("TYPECODES");
												if (Ext
														.isEmpty(thisClass.strFilter))
													var filter = "$typeCode="
															+ typeCodes;
												else
													var filter = "&$typeCode="
															+ typeCodes;
												thisClass
														.fireEvent(
																'navigateToBalances',
																thisClass.strFilter
																		+ filter
																		+ "&$serviceType=BR_TXN_SRC_GRID&$serviceParam=BR_GRIDVIEW_GENERIC&$filterOn=&$filterValue=",
																thisClass.record
																		.get('settings'));
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
											var typeCodes = barChartStore
													.getAt(i).get("TYPECODES");
											if (Ext
													.isEmpty(thisClass.strFilter))
												var filter = "$typeCode="
														+ typeCodes;
											else
												var filter = "&$typeCode="
														+ typeCodes;
											thisClass
													.fireEvent(
															'navigateToBalances',
															thisClass.strFilter
																	+ filter
																	+ "&$serviceType=BR_TXN_SRC_GRID&$serviceParam=BR_GRIDVIEW_GENERIC&$filterOn=&$filterValue=",
															thisClass.record
																	.get('settings'));
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
				type : 'bar',
				axis : 'bottom',
				title : ['AMOUNT', 'COUNT'],
				//gutter : 200,
				xField : 'TYPECODE_SET',
				yField : ['AMOUNT', 'COUNT'],
				xPadding : 15,
				renderer : function(sprite, record, attributes, index, store) {
					attributes.y = attributes.y + 3;
					attributes.width = attributes.width < 5 ? 5 : attributes.width;
					//if (attributes.width < 20) attributes.width=20;
					return attributes;
				},
				stacked : false,	
				style : {
					strokeStyle : ['#fff'],
					stroke : ['#fff'],
					height : 19
				},
				tips : {
					trackMouse : true,
					constrainPosition : true,
					//anchor : 'bottom',
					height : 45,
					width : 230,
					bodyStyle : {
						background : '#ffffff',
						color : 'black',
						//width : '230px !important'
						padding : '10px',
						'font-size' : '16px',
						'font-family' : 'Arial'

					},

					renderer : function(storeItem, item) {
						if(item.yField == 'AMOUNT')
						{
							this.update("Amount  : "
									+ storeItem.data.TIPAMOUNT);
						}
						else
						{
							this.update("Count  : "
									+ storeItem.data.COUNT);
						}
					}
				}
			}]
		});
		return chart;
	},

	generateUrl : function(settings) {
		var me = this;
		var isFilterApplied = false;
		var strFilter = '';
		var jsonArray = [], ccyPresent = false, accountPresent = false, txnTypePresent = false;
		me.txnTypeFilter ='';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {
				if (settings[index].field != 'customname') {
					if (settings[index].field === 'ccy') {
						if (!Ext.isEmpty(settings[index].value1)) {
							me.ccyUrl = '$ccy=' + settings[index].value1;
							ccyPresent = true;
						}
						continue;
					}
					if (settings[index].field === 'txntype') {
						var arr = [];
						var typecode = settings[index].value1.split(",");
						var typedesc = settings[index].value2.split(",");
						for (var j = 0; j < typecode.length; j++) {
							var record = {
								'typeCodes' : typecode[j],
								'typeDesc' : typedesc[j]
							};
							jsonArray.push(record);
						}
						var selectedTypeCodes = Ext.JSON.encode(jsonArray);
						me.txnTypeFilter = '$txnType=' + selectedTypeCodes;
						txnTypePresent = true;
						continue;
					}
					if (settings[index].field === 'account'
							|| settings[index].field === 'accountset') {
						me.accountFilter = '$accountID='
								+ settings[index].value1;
						isFilterApplied = false;
						accountPresent = true;
						continue;
					}
					if(settings[index].field === 'activityDates'){
						if(!Ext.isEmpty(settings[index].value1)){
							me.activityDates = '$activityFromDate='
								+ settings[index].value1;
							if(!Ext.isEmpty(settings[index].value2)){
								me.activityDates += '&$activityToDate='
									+ settings[index].value2;
							}
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

						case 'lteqto' :
							if (settings[index].dataType === 1) {
								strFilter = strFilter + '(';
								strFilter = strFilter + settings[index].field
										+ ' ' + 'eq' + ' ' + 'date\''
										+ settings[index].value1 + '\'';
								strFilter = strFilter + ' or ';
								strFilter = strFilter + settings[index].field
										+ ' ' + 'lt' + ' ' + 'date\''
										+ settings[index].value1 + '\'';
								strFilter = strFilter + ')';
							} else {
								strFilter = strFilter + '(';
								strFilter = strFilter + settings[index].field
										+ ' ' + 'eq' + ' ' + '\''
										+ settings[index].value1 + '\'';
								strFilter = strFilter + ' or ';
								strFilter = strFilter + settings[index].field
										+ ' ' + 'lt' + ' ' + '\''
										+ settings[index].value1 + '\'';
								strFilter = strFilter + ')';
							}
							break;

						case 'lteqtoorgt' :
							if ("valueDate" == settings[index].field) {
								strFilter = strFilter + '(';
								strFilter = strFilter + '(';
								strFilter = strFilter + settings[index].field
										+ ' ' + 'eq' + ' ' + 'date\''
										+ settings[index].value1 + '\'';
								strFilter = strFilter + ' or ';
								strFilter = strFilter + settings[index].field
										+ ' ' + 'lt' + ' ' + 'date\''
										+ settings[index].value1 + '\'';
								strFilter = strFilter + ')';
								strFilter = strFilter + ' or ';
								strFilter = strFilter + '(';
								strFilter = strFilter + settings[index].field
										+ ' ' + 'gt' + ' ' + 'date\''
										+ settings[index].value1 + '\'';
								strFilter = strFilter + ')';
								strFilter = strFilter + ')';
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
								if (settings[index].field == 'valueDate') {
									strFilter = strFilter
											+ settings[index].field + ' '
											+ settings[index].operator + ' '
											+ 'date\'' + settings[index].value1
											+ '\'';
								} else {
									strFilter = strFilter
											+ settings[index].field + ' '
											+ settings[index].operator + ' '
											+ '\'' + settings[index].value1
											+ '\'';
								}
							}
							break;
					}
					isFilterApplied = true;
				}
			}
		}
		if (!ccyPresent)
			me.ccyUrl = '';
		if (!accountPresent)
			me.accountFilter = '$accountID=(ALL)';
		if (!Ext.isEmpty(strFilter)) {
			me.strFilter = strFilter;
			strFilter = '$filter=' + strFilter;
		}
		if (!Ext.isEmpty(strFilter)) {
			if (!Ext.isEmpty(me.txnTypeFilter))
				strFilter = strFilter + '&' + me.txnTypeFilter;
			if (!Ext.isEmpty(me.accountFilter))
				strFilter = strFilter + '&' + me.accountFilter;
			if (!Ext.isEmpty(me.ccyUrl))
				strFilter = strFilter + '&' + me.ccyUrl;
			if(!Ext.isEmpty(me.activityDates))
				strFilter = strFilter + '&' + me.activityDates;
		} else {
			strFilter = strFilter + '&' + me.accountFilter;
			strFilter = strFilter + '&' + me.txnTypeFilter;
			strFilter = strFilter + '&' + me.activityDates;
			if (!Ext.isEmpty(me.ccyUrl))
				strFilter = strFilter + '&' + me.ccyUrl;
		}
		return strFilter;
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
					boxLabel : getLabel('accountSet', 'Account Set'),
					name : 'account',
					inputValue : 'AS',
					handler : function(cb, nv, ov) {
						me.handleAccTypAutoComp(portletSettings, cb, nv, ov);
					}
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
					width  : (screen.width) > 1024 ? 735 : 733,
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
								//cls : 'ux-button-s footer-btns',
								handler : function() {
									var settings = me.getSettings(this
											.up('window'));
									me.record.set('settings', settings);
									me.setLoading(label_map.loading);
									var filterUrl = me.generateUrl(settings);
									me.ajaxRequest(filterUrl, settings, record);
									//me.up('panel').fireEvent('saveSettings',
									//		record, settings);
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
		me.addAccountGroup(portletSettings);
		me.portletref = portletSettings; // TODO: need to change the dependency of portletref variable
		me.setSettings(portletSettings, me.record.get('settings'));
		var typeArray = [];
		if(!me.typeCodefield)
		{
			var txtType = portletSettings.down('checkcombo[itemId="txnDropDown"]')
			//txtType.setValue('');
			//txtType.fireEvent('select', me, []);
				for (var index = 0; index < 5; index++)
				{
					typeArray[index]= txtType.getStore().getAt(index).data.CODE;
				}
			txtType.setValue(typeArray);
			me.txnTypeFilter = "";
		}
		for (var i= 0;i < portletSettings.down('radiogroup[itemId="creditDebitFlag"]').items.length;i++)
		{
			if(portletSettings.down('radiogroup[itemId="creditDebitFlag"]').items.items[i].checked)
			{
				portletSettings.down('radiogroup[itemId="creditDebitFlag"]').items.items[i].focus();
				break;
			}
		}
	},
		getDatePicker : function() {
		var me = this;
		$('#creationDatePicker').datepick({
			dateFormat : strjQueryDatePickerDateFormat,
			monthsToShow : 1,
			changeMonth : true,
			changeYear : true,
			rangeSeparator : ' to ',
			onClose : function(dates) {
				var datePickerText = $('#creationDatePicker').val();
				if (!Ext.isEmpty(dates)) {
					if(!Ext.isEmpty(datePickerText))
					{
						me.dateRangeFilterVal = '13';
						me.datePickerSelectedDate = dates;
						me.datePickerSelectedEntryDate = dates;
						me.dateFilterVal = me.dateRangeFilterVal;
						me.dateFilterLabel = getLabel('daterange',
							'Date Range');
						me.handleDateChange(me.dateRangeFilterVal);
					}
					else 
					{
						me.dateFilterVal = '';
						me.dateFilterLabel = '';
						var creationDateLbl = me.portletref.down('label[itemId="creationDateLbl"]');
						if(!Ext.isEmpty(creationDateLbl)) creationDateLbl.setText("Posting Date");
					}
				}
			}
		});
	},
	setTitle : function(settings) {
		var me = this;
		var tyCodeStore = null;
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
	getTxnTypeStore : function(thisClass) {
		var me=this;
		var data;
		Ext.Ajax.request({
			url : 'services/userseek/typecodelist?$top=-1',
			async : false,
			method : 'GET',
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					data = data.d.preferences;
					data.forEach(function(record){
						record.DESCR = record.DESCR +' | '+record.CODE;
					});
					if (data !== null && typeof(data) !== 'undefined') {
						tyCodeStore = Ext.create('Ext.data.Store', {
								fields : ['DESCR', 'CODE'],
								data : data
							});
						}
					}
				},
			failure : function() {
			}
		});
		/*if(me.selectedData.length==0)
		{
		me.selectedData=[data[0].CODE,data[1].CODE,data[2].CODE,data[3].CODE,data[4].CODE];
        }*/
		var txnCategoryStore = null;
		if (!Ext.isEmpty(data)) {
			txnCategoryStore = Ext.create('Ext.data.Store', {
						fields : ['CODE','DESCR','DESCR1'],
						data : data,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			txnCategoryStore.load();
		}
		return txnCategoryStore;
	},
	handleAccTypAutoComp : function(portlet, cb, nv, ov) {
		var me = this;
		var objAutoCmp = portlet.down('container[itemId="accTypAutoComp"]')
		var objAccAllAutoComp = portlet
				.down('combo[itemId="accAutoComp"]');
		var objAccSetAutoComp = portlet
				.down('combobox[itemId="accSetAutoComp"]');
		if (!Ext.isEmpty(objAutoCmp)) {
			var objRadioBtn = cb.inputValue;
			if (!Ext.isEmpty(objRadioBtn) && objRadioBtn == 'A' && nv == true) {

				if (!Ext.isEmpty(objAccAllAutoComp))
					objAccAllAutoComp.show();
				objAccAllAutoComp.setValue('');
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
	},
	getSettingsPanel : function() {
		var me = this;
		var portlet = me.up('panel');
		var records = [];
		var typeCodeStore = Ext.create('Ext.data.Store', {
			fields : ['accountSetName', 'accounts'],
			data : records
		});
		var tyCodeStore = null;
		var accountNoStore = null;
		Ext.Ajax.request({
			url : 'services/transcationSearch/accountSetForWidgets.json',
			method : "POST",
			async : false,
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					pref = data.d.userAccount;
					if (pref !== null && typeof(pref) !== 'undefined') {
						records.push({
							accountSetName : 'All',
							accounts : ''
								})
						Ext.each(pref, function(obj) {
									records.push({
										accountSetName : obj.accountSetName+'('+ obj.accounts.length+')',
										//accountSetName : obj.accountSetName,
										accounts : obj.accounts
											})
								});
						typeCodeStore.loadData(records);
					}
				}
			}
		});
		Ext.Ajax.request({
			url : 'services/balancesummary/btruseraccountsforwidgets.json?$top=-1',
			method : 'GET',
			async : false,
			success : function(response) {
				responseData = Ext.decode(response.responseText);
				data = responseData.d.btruseraccount;
				data.forEach(function(record){
					record.accountName = record.accountName +' | '+record.accountNumber;
				});
				if (!Ext.isEmpty(responseData)) {
					accountNoStore = Ext.create('Ext.data.Store', {
						fields : ['accountId', 'accountName', 'accountNumber'],
						data : data
					});
				}
			},
			failure : function() {
			}
		});
		Ext.Ajax.request({
			url : 'services/autoCompleter/typecodelistdashboard?$top=-1',
			method : "GET",
			async : false,
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					data = data.d.preferences;
					data.forEach(function(record){
						record.DESCR = record.DESCR +' | '+record.CODE;
					});
					if (data !== null && typeof(data) !== 'undefined') {
						tyCodeStore = Ext.create('Ext.data.Store', {
								fields : ['DESCR', 'CODE'],
								data : data
							});
						}
					}
				}
		});
		var settingsPanel = Ext.create('Ext.panel.Panel', {
			//padding : '10 10 10 10',
			items : [{
				xtype : 'container',
				cls : 'ft-padding-bottom',
				layout : 'column',
				flex : 1,
				items : [{
					xtype : 'radiogroup',
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-right',
					columns : [55, 62, 62],
					itemId : 'creditDebitFlag',
					labelAlign : 'top',
					labelSeparator : '',
					labelCls : 'f13 ux_font-size14 ux_padding0060',
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
				
				},{
					xtype : 'container',
					layout : 'hbox',
					//flex : 0.30,
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-left',
					items : [{
						xtype : 'container',
						width : '100%',
						layout : 'vbox',
						items : [{
									xtype : 'radiogroup',
									itemId : 'accountRadioGrp',
									width : '100%',
									columns : [80, 120],
									items : []

								}, {
									xtype : 'container',
									
									itemId : 'accTypAutoComp',
									items : [{
										xtype : 'checkcombo',
										fieldLabel : '',
										emptyText : getLabel('select', 'All'),
										width  : (screen.width) > 1024 ? 218 : 218,
										addAllSelector : true,
										multiSelect : true,
										editable : false,
										itemId : 'accAutoComp',
										fieldCls : 'ux_no-border-right xn-form-field w110',
										triggerBaseCls : 'xn-form-trigger',
										width  : (screen.width) > 1024 ? 218 : 220,
										fitToParent : true,
										store : accountNoStore,
										valueField : 'accountId',
										displayField : 'accountName',
										arrAccountVal : '',
										listeners : {
											select : function(combo, record,
													index) {
													combo.arrAccountVal = combo.getValue();
											}
										}
									}, 
									{
										xtype : 'combo',
										itemId : 'accSetAutoComp',
										id :'accountSet',
										hidden : true,
										queryMode : 'local',
										fieldCls : 'ux_no-border-right xn-form-field w110',
										triggerBaseCls : 'xn-form-trigger',
						                width  : (screen.width) > 1024 ? 218 : 218,
										editable : false,
										store : typeCodeStore,
										displayField : 'accountSetName',
										valueField : 'accounts',
										arrAccountSetVal : '',
										emptyText : getLabel('select', 'All'),
										listeners : {
											select : function(combo, record, index) {
												combo.arrAccountSetVal = combo.getValue();
											},
											afterrender : function(combo) {
												combo.arrAccountSetVal = combo.getValue();
						                	}
										},
										
										listConfig:{
									   tpl: [
								            '<ul><tpl for=".">',
								                '<li role="option" class="x-boundlist-item" data-qtip="{accountSetName}" value="{accounts}">' +
								                '{accountSetName}</li>',
								            '</tpl></ul>'
								        ]
									 }
									}]

								}]
					}]
				}]
			}, {
				xtype : 'container',
				layout : 'column',
				cls : 'ft-padding-bottom',
				flex : 1,
				cls : 'ft-padding-bottom',
				items : [{										
					xtype : 'container',
					itemId : 'entryDateContainer',
					layout : 'vbox',
					cls : 'pagesetting',
					columnWidth : 0.3333,
					items : [{
						xtype : 'panel',
						itemId : 'completDatePanel',
						layout : 'hbox',
						items : [{
							xtype : 'label',
							itemId : 'creationDateLbl',
							height : 19,
							style : {
								'padding-right' : '10px !important'
							},
							name : 'creationDateLbl',
							text : getLabel("transactionDate",
									"Posting Date"),
							cls : 'widget_date_menu',
							listeners: {
							       render: function(c) {
							    	   			var tip = Ext.create('Ext.tip.ToolTip', {
											            	    target: c.getEl(),
											            	    listeners:{
											            	    	beforeshow:function(tip){
											            	    		if(creation_date_opt === null)
												            	    		tip.update('Posting Date');
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
									itemId : 'creationDateBtn',
									name : 'transactionDateBtn',
									padding: '4 0 0 5',
									height : 19,
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
					}, {
						xtype : 'container',
						itemId : 'TransactionDate',
						layout : 'hbox',
						width: 220,
						cls : 'pagesetting',
						items : [{
							xtype : 'component',
							width : '87%',
							padding : '0 0 4 0',
							itemId : 'creationDateDataPicker',
							filterParamName : 'EntryDate',
							html : '<input type="text"  id="creationDatePicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment " style="width: 100%;">'
						}, {
							xtype : 'component',
							cls : 'icon-calendar t7-adjust-cal',
							margin : '1 0 0 0',
							html : '<span class=""><i class="fa fa-calendar"></i></span>'
						}]
					}]
				
				}, {
					xtype : 'container',
					layout : 'hbox',
					//flex : 0.35,
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-right ft-extraLargeMargin-left  pagesetting',
					items : [{
								
								xtype : 'AutoCompleter',
								flex : 0.24,
								fieldCls : 'xn-form-text xn-suggestion-box pagesetting t7-adjust-amnt-height',
								labelCls : 'frmLabel',
								width  : (screen.width) > 1024 ? 220 : 230,
								fieldLabel : getLabel("CCY", "Currency"),
								emptyText : 'Enter Keyword or %',
								fitToParent : true,
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
					columnWidth : 0.3333,
					itemId : 'statusContainer',
					cls : 'ft-extraLargeMargin-left pagesetting',
					items : [{
							xtype : 'label',
							text : getLabel('transactionType', 'Type Code'),
							cls : 'f13 ux_font-size14 ',
							padding : '0 0 2 0'
						}, {	
							
								xtype : 'checkcombo',
								editable : false,
								//addAllSelector : true,
								//multiSelect : true,
								itemId : 'txnDropDown',
								name : 'txnDropDown',
								valueField : 'CODE',
								displayField : 'DESCR',
								hideTrigger : true,
								width : (screen.width) > 1024 ? 218 : 228,
								store : tyCodeStore,
								listeners:{
								select:function(){
								  var count=this.value.length;
								  if(count >5)
								   {
								    return true;
								   }
				
								 },
								 beforeselect:function(){
								  var count=this.value.length;
									  if(count==5)
									  {
									   return false;
									  }
								 }
								}
							}]
				}]
			}, {
				xtype : 'container',
				layout : 'column',
				flex : 1,
				//padding : '0 0 12 0',
				//cls : 'ft-padding-bottom',
				items : [{
					xtype : 'textfield',
					hideTrigger : true,
					//flex : 0.38,
					width : 220,
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-right pagesetting',
					//padding : '10 0 10 0',
					padding : '0 0 0 0',
					margin : '0 16 0 0',
					labelAlign : 'top',
					labelSeparator : '',
					fieldLabel : getLabel("widgetName", "Widget Name"),
					itemId : 'customname',
					fieldCls : 'xn-form-text',
					labelCls : 'frmLabel',
					name : 'customname',
					maxLength : 20, // restrict user to enter 25 chars max
					enforceMaxLength : true,
					maskRe : /[A-Za-z0-9 .]/
				}]
			}]
		});
		return settingsPanel;
	},
	setSettings : function(widget, settings) {
		var me = this;
		var strSqlDateFormat = 'm/d/Y';
		var txnPresent = false;
		me.typeCodefield = false;
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			fieldVal3 = settings[i].value3;
			operatorValue = settings[i].operator;

			// CreditDebitFlag Set values
			if (fieldName === 'debitCreditFlag') {
				if (fieldVal === 'D') {
					var debitRadio = widget.down('radio[inputValue="D"]');
					debitRadio.setValue(true);
				}
				if (fieldVal === 'C') {
					var creditRadio = widget.down('radio[inputValue="C"]');
					creditRadio.setValue(true);
				}
			}
			// Account/Account Set Values

			var objAutoCompRef1 = null;
			var objAutoCompRef2 = null;
			if (fieldName === 'account') {
				var accRadio = widget.down('radio[inputValue="A"]');
				accRadio.setValue(true);
				objAutoCompRef2 = widget
						.down('combobox[itemId=accSetAutoComp]');
				if (!Ext.isEmpty(objAutoCompRef2) ) {
					//objAutoCompRef1.arrAccountVal = fieldVal;
					//objAutoCompRef1.setRawValue(fieldVal2);
					objAutoCompRef2.setValue('');
				}
				if(!Ext.isEmpty(fieldVal) && (typeof fieldVal === 'string'))
				{
					var values = fieldVal.split(',');
					var accountNos = [];
					Ext.each(values, function(account){
						accountNos.push(parseInt(account,10));
					});
					objAutoCompRef1 = widget
							.down('checkcombo[itemId=accAutoComp]');
					if (!Ext.isEmpty(objAutoCompRef1) && !Ext.isEmpty(accountNos)) {
						objAutoCompRef1.setValue(accountNos);
					}
				}		
			}
			if (fieldName === 'accountset') {
				var accsRadio = widget.down('radio[inputValue="AS"]');
				accsRadio.setValue(true);
				objAutoCompRef1 = widget
						.down('combobox[itemId=accSetAutoComp]');
				objAutoCompRef2 = widget
						.down('combo[itemId=accAutoComp]');
				if (!Ext.isEmpty(objAutoCompRef1) && !Ext.isEmpty(fieldVal)) {
					/*objAutoCompRef1.store.add({
								"accountSetName" : fieldVal2,
								"accounts" : fieldVal
							});*/
					objAutoCompRef1.arrAccountSetVal = fieldVal;
					objAutoCompRef1.setValue(fieldVal);
					objAutoCompRef1.setRawValue(fieldVal3);
					//objAutoCompRef2.setValue('');
				}
			}

			// posted pending set values
			if (fieldName === 'valueDate') {
			}

			// Transaction Date Set Values
			if (fieldName === 'activityDates') {
				var dateFilterLabel = settings[i].dateLabel;
				var dateFilterRefFrom = $('#creationDatePicker');
				me.dateFilterVal = settings[i].displayType;
				me.dateFilterLabel = settings[i].dateLabel.substring(settings[i].dateLabel.indexOf('(')+1,settings[i].dateLabel.indexOf(')'));
				me.datePickerSelectedDate[0] = Ext.Date.parse(settings[i].value1, 'Y-m-d');
				me.datePickerSelectedDate[1] = Ext.Date.parse(settings[i].value2, 'Y-m-d');
				
				if (!Ext.isEmpty(fieldVal)) 
					 formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fieldVal, 'Y-m-d'),
							strExtApplicationDateFormat);

				if (!Ext.isEmpty(fieldVal2)) 
						formattedToDate = Ext.util.Format.date(Ext.Date
										.parse(fieldVal2, 'Y-m-d'),
								strExtApplicationDateFormat);

				if (operatorValue === 'eq' || operatorValue === 'le') {
					dateFilterRefFrom.val(formattedFromDate);
				}
				else if (operatorValue === 'bt') {
					dateFilterRefFrom.datepick('setDate', [formattedFromDate, formattedToDate]);
				}
				if (!Ext.isEmpty(dateFilterLabel)) {
					widget.down('label[itemId="creationDateLbl"]').setText(dateFilterLabel);
					creation_date_opt = dateFilterLabel;
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

			// Currency ccy
			if (fieldName === 'ccy') {
				var ccyField = widget.down('AutoCompleter[itemId="Currency"]');
				if (!Ext.isEmpty(ccyField)) {
					if (!Ext.isEmpty(fieldVal))
						ccyField.setValue(fieldVal);
				}
			}

			// TxnType
			if (fieldName === 'txntype') {
				me.typeCodefield = true;
				var txtType = widget.down('checkcombo[itemId="txnDropDown"]');
				var values = fieldVal.split(',');
				if(!(Ext.isEmpty(txtType) || Ext.isEmpty(values))) {
					txtType.setValue(values);
				}
			}
		}
	},
	getSettings : function(portletPanel) {
		var me = portletPanel;
		var jsonArray = [];
		var thisClass = this;
		// Account/ Account Group
		var getCheckedBtnA = me.down('radio[inputValue="A"]').checked;
		var accAutoCompVal = me.down('combo[itemId="accAutoComp"]').getValue();
		var accAutoDispVal = me.down('combo[itemId="accAutoComp"]').getRawValue();
		if (!(Ext.isEmpty(accAutoCompVal) || me.down('combo[itemId="accAutoComp"]').isAllSelected()) && getCheckedBtnA == true) {
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
		var accSetAutoCompVal = me.down('combobox[itemId="accSetAutoComp"]').arrAccountSetVal;
		var accSetAutoDispVal = me.down('combobox[itemId="accSetAutoComp"]').getRawValue();
		if (!Ext.isEmpty(accSetAutoCompVal) && getCheckedBtnAS == true
				&& !Ext.isEmpty(accSetAutoDispVal)) {
			jsonArray.push({
						field : 'accountset',
						operator : 'eq',
						value1 : accSetAutoCompVal,
						value2 : accSetAutoDispVal.substring(0,accSetAutoDispVal.indexOf('(')),
						value3 : accSetAutoDispVal,
						dataType : 0,
						displayType : 4
					});
		}
		// CreditDebitFlag
		var creditDebitFlagValue = me
				.down('radiogroup[itemId="creditDebitFlag"]').getValue().creditDebitFlag;
		if (!Ext.isEmpty(creditDebitFlagValue) && creditDebitFlagValue != 'All') {
			jsonArray.push({
						field : 'debitCreditFlag',
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

		// Currency
		var currencyCode = me.down('AutoCompleter[itemId="Currency"]')
				.getValue();
		if (!Ext.isEmpty(currencyCode)) {
			jsonArray.push({
						field : 'ccy',
						value1 : currencyCode,
						operator : 'eq',
						dataType : 0,
						displayType : 4
					});
		}

		// Transaction Date
		var index = thisClass.dateFilterVal;
		var objDateParams = thisClass.getDateParam(index);
		var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
		if (!Ext.isEmpty(index)) {
			jsonArray.push({
						field : 'activityDates',
						value1 : objDateParams.fieldValue1,
						value2 : objDateParams.fieldValue2,
						operator : objDateParams.operator,
						dataType : 'D',
						displayType : index,
						dateLabel : dateLabel
					});
			thisClass.activityDates = '';
		} else {
			objDateParams = thisClass.getDateParam('5');
			if (!Ext.isEmpty(objDateParams.fieldValue1)) {
				jsonArray.push({
							field : 'activityDates',
							value1 : objDateParams.fieldValue1,
							value2 : objDateParams.fieldValue2,
							operator : objDateParams.operator,
							dataType : 'D',
							displayType : '5',
							dateLabel : dateLabel
						});
			}
		}
		// TxnType
		var txnTypeCombo = me.down('checkcombo[itemId="txnDropDown"]');
		me.txnTypeFilter = "";
		if (!(txnTypeCombo.isAllSelected())) {
			jsonArray.push({
						field : 'txntype',
						operator : 'in',
						value1 : txnTypeCombo.getValue(),
						value2 : txnTypeCombo.getRawValue(),
						dataType : 0,
						displayType : 6
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