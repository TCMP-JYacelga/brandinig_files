Ext.define('Cashweb.view.portlet.TradeOverdueLoans', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.tradeoverdueloans',
	requires : ['Cashweb.store.TradeOverdueLoansStore',
			'Ext.ux.gcp.AutoCompleter'],
	border : false,
	emptyText : null,
	cls : 'widget-grid',
	taskRunner : null,
	minHeight : 50,
	height:336,
	cols : 3,
	total : 0,
	strFilter : '',
	clientUrl : '',
	clientCode : '',
	selectedClientCode : '',
	allClientMenuData : null,
	dateFilterLabel : 'Due Date( Latest )',
	dateFilterVal : '12',
	dateHandler : null,
	vFromDate1 : null,
	vToDate1 : null,
	enableQueryParam : false,
	titleId : '',
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
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
		thisClass.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		thisClass.emptyText = label_map.noDataFound;
		thisClass.store = new Cashweb.store.TradeOverdueLoansStore();

		thisClass.on('cellclick', function(me, td, cellIndex, record, tr,
						rowIndex, e, eOpts) {
					thisClass.fireEvent('navigateToPayments', record);
				});

		thisClass.on('refreshWidget', function() {
					var record = thisClass.record, settings = [];
					var filterUrl = '';
					thisClass.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					filterUrl = thisClass.generateUrl(settings);
					thisClass.setTitle(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});

		thisClass.on('boxready', function(component, eOpts) {
			thisClass.setLoading(label_map.loading);
		});
		thisClass.on('viewready', function(component, eOpts) {
					var settings = [];
					var filterUrl = '', isClientPresent = false;
					var record = thisClass.record;
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
					}
//					thisClass.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'clientCode') {
							isClientPresent = true;
							break;
						}
					}
					if (isClientPresent) {
						filterUrl = thisClass.generateUrl(settings);
						thisClass.ajaxRequest(filterUrl, settings);
					} else {
						thisClass.getClientMenuData(settings);
					}
				});

		var objDefaultArr = [{
					header : getLabel("reference", "Reference"),
					dataIndex : 'REFERENCES',
					flex : 25,
					hidden : false,
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hideable : false
				}, {
					header : getLabel("dueDate", "Due Date"),
					dataIndex : 'DUE_DATE',
					flex : 23,
					hidden : false,
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hideable : false
				}, {
					header : getLabel("osAmount  ", "O/S Amount"),
					dataIndex : 'OS_Amount',
					flex : 23,
					align : 'right',
					hidden : false,
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hideable : false
				}, {
					header : getLabel("lcReference", "LC Reference"),
					dataIndex : 'LC_REF',
					flex : 23,
					hidden : false,
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hideable : false
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

		thisClass.columns = columnModel;
		thisClass.callParent();
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
					menuDisabled:true,
					draggable :false,
					resizable : false,
					align : objCol.align
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
	getClientMenuData : function(settings) {
		var me = this;
		Ext.Ajax.request({
					url : 'services/userseek/userclients.json?$top=-1&$skip=-1',
					method : 'POST',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						me.allClientMenuData = responseData.d.preferences;
						if (!Ext.isEmpty(me.allClientMenuData)) {
							settings.push({
										field : 'clientCode',
										operator : 'eq',
										value1 : me.allClientMenuData[0].CODE,
										value2 : me.allClientMenuData[0].DESCR,
										dataType : 0,
										displayType : 6
									});
						}
						filterUrl = me.generateUrl(settings);
						me.ajaxRequest(filterUrl, settings);
					},
					failure : function(settings) {
					}
				});
	},

	addClientMenu : function(summaryPortlet) {
		var me = this;
		var menuRef = summaryPortlet.down('menu[itemId="clientMenu"]');
		var data;
		if (Ext.isEmpty(me.allClientMenuData)) {
			Ext.Ajax.request({
						url : 'services/userseek/userclients.json?$top=-1&$skip=-1',
						method : 'POST',
						async : false,
						success : function(response) {
							var responseData = Ext
									.decode(response.responseText);
							me.allClientMenuData = responseData.d.preferences;
						},
						failure : function(settings) {
						}
					});
		}
		data = me.allClientMenuData;
		var count = data.length;
		if (menuRef.items.length > 0) {
			menuRef.removeAll();
		}
		if (count > 0) {
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
				summaryPortlet.down('textfield[itemId="Client"]')
						.setValue(menuRef.items.items[0].text);
			}
		}
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
	handleDateChange : function(portlet2, index) {
		var me = this;
		var objDateParams = me.getDateParam(index, null);
		var fromDateLabel = portlet2.down('label[itemId="dateFilterFrom"]');
		var toDateLabel = portlet2.down('label[itemId="dateFilterTo"]');
		fromDateLabel.show();
		toDateLabel.show();
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			portlet2.down('label[itemId="dueDateLbl"]').setText("Due Date"
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
	generateUrl : function(settings) {
		var me = this;
		var isFilterApplied = false, accountpresent = false;
		var strFilter = '', accntFilter = '';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {

				if (settings[index].field === 'clientCode') {
					clientFilter = settings[index].value1;
					me.clientUrl = '$clientFilter =' + clientFilter;
				}

				if (settings[index].field != 'customname'
						&& settings[index].field != 'colPref'
						&& settings[index].field != 'clientCode') {
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
		if (!Ext.isEmpty(strFilter))
			strFilter = '$filter=' + strFilter;
		return strFilter;
	},
	ajaxRequest : function(filterUrl, settings) {
		var obj;
		var thisClass = this;
		thisClass.setTitle(settings);
		filterUrl = thisClass.clientUrl + "&" + filterUrl;
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = filterUrl || {}, arrMatches;
		if (thisClass.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(filterUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
		}
		Ext.Ajax.request({
					url : 'services/getExchangeRates.json',// +
					method : 'POST',
					params : objParam,
					success : function(response) {
						obj = {
							"success" : true,
							"summary" : [{
										"REFERENCES" : "Ref-365987",
										"DUE_DATE" : "22/06/2015",
										"OS_Amount" : "$ 250,000.00",
										"LC_REF" : "LC-669989",
										"COUNTER_PARTY" : "FundTech",
										"PRINCIPAL_AMOUNT" : "$5,00,000",
										"INVOICE_NO" : "45511"
									}, {
										"REFERENCES" : "Ref-114898",
										"DUE_DATE" : "15/04/2015",
										"OS_Amount" : "$ 300,000.00",
										"LC_REF" : "LC-996858",
										"COUNTER_PARTY" : "FundTech",
										"PRINCIPAL_AMOUNT" : "$5,00,000",
										"INVOICE_NO" : "45511"
									}, {
										"REFERENCES" : "Ref-226598",
										"DUE_DATE" : "16/05/2015",
										"OS_Amount" : "$ 540,000.00",
										"LC_REF" : "LC-226565",
										"COUNTER_PARTY" : "FundTech",
										"PRINCIPAL_AMOUNT" : "$5,00,000",
										"INVOICE_NO" : "45511"
									}, {
										"REFERENCES" : "Ref-445788",
										"DUE_DATE" : "18/03/2015",
										"OS_Amount" : "$ 32,785.00",
										"LC_REF" : "LC-445788",
										"COUNTER_PARTY" : "FundTech",
										"PRINCIPAL_AMOUNT" : "$5,00,000",
										"INVOICE_NO" : "45511"
									}, {
										"REFERENCES" : "Ref-225986",
										"DUE_DATE" : "22/06/2015",
										"OS_Amount" : "$ 28,989.00",
										"LC_REF" : "LC-1156",
										"COUNTER_PARTY" : "FundTech",
										"PRINCIPAL_AMOUNT" : "$5,00,000",
										"INVOICE_NO" : "45511"
									}],
							"count" : 5
						};// Ext.decode(response.responseText);
						thisClass.loadData(obj);
						thisClass.setRefreshLabel();
					},
					failure : function(response) {
						if (!Ext.isEmpty(thisClass)) {
							thisClass.getTargetEl().unmask();
						}
						var viewref = thisClass;
						thisClass.mask = new Ext.LoadMask(viewref, {
									msgCls : 'error-msg'
								});
						if (response.timedout) {
							thisClass.mask.msg = label_map.timeoutmsg;
						} else if (response.aborted) {
							thisClass.mask.msg = label_map.abortmsg;
						} else {
							if (response.status === 0) {
								thisClass.mask.msg = label_map.serverStopmsg;
							} else
								thisClass.mask.msg = response.statusText;
						}
					}
				});

	},

	loadData : function(data) {
		var me = this;
		var storeData = [];
		var arrData = data.summary;
		if (!Ext.isEmpty(arrData)) {
			for (var i = 0; i < arrData.length && i < 5; i++) {
				var colJson = {};
				if (arrData[i]) {
					colJson["REFERENCES"] = arrData[i].REFERENCES;
					colJson["DUE_DATE"] = arrData[i].DUE_DATE;
					colJson["OS_Amount"] = arrData[i].OS_Amount
					colJson["LC_REF"] = arrData[i].LC_REF;
				}
				storeData.push(colJson);
			}
		}
		me.getStore().loadData(storeData);
		this.setLoading(false);
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
		portletSettings.show();
		me.addClientMenu(portletSettings);
		me.addDatePanel(portletSettings);
		me.addDateMenu(portletSettings);
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
		var thisClass = this;

		var settingsPanel = Ext.create('Ext.panel.Panel', {
			//padding : '10 10 10 10',
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
					layout : 'vbox',
					itemId : 'completDatePanel',
					flex : 0.38,
					items : [{
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'dueDateLbl',
									name : 'dueDateLbl',
									text : getLabel("dueDate", "Due Date"),
									style : {
										'padding-right' : '10px !important'
									},
									cls : 'frmLabel'
								}, {
									xtype : 'button',
									border : 0,
									itemId : 'dueDateBtn',
									margin : '7 0 0 0',
									menuAlign : 'tr-br',
									name : 'dueDateBtn',
									cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
									glyph : 'xf0d7@fontawesome',
									menu : Ext.create('Ext.menu.Menu', {
										itemId : 'dateMenu',
										width : 165,
										cls : 'ux_dropdown ux_dropdown-no-leftpadding',
										maxHeight : 200,
										items : []
									})

								}]
					}, {
						xtype : 'container',
						itemId : 'DueDate',
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
					xtype : 'container',
					layout : 'hbox',
					flex : 0.37,
					items : [{
								xtype : 'textfield',
								fieldLabel : getLabel("batchColumnClient",
										"Client"),
								labelPad : 2,
								labelWidth : 55,
								readOnly : true,
								labelAlign : 'top',
								labelCls : 'frmLabel',
								labelSeparator : '',
								itemId : 'Client',
								fieldCls : 'ux_no-border-right xn-form-field',
								width : 140,
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
									width : 165,
									cls : 'ux_dropdown ux_dropdown-no-leftpadding',
									maxHeight : 200,
									items : []
								}),
								handler : function(btn, event) {
									btn.menu.show();
								}
							}]
				}, {
					xtype : 'textfield',
					hideTrigger : true,
					flex : 0.25,
					labelAlign : 'top',
					labelSeparator : '',
					fieldLabel : getLabel("widgetName", "Widget Name"),
					itemId : 'customname',
					fieldCls : 'xn-form-text w170',
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
	setSettings : function(widget, settings) {
		var strSqlDateFormat = 'm/d/Y';
		var temp = widget.down('label[itemId="dueDateLbl"]');
		if (temp.text == "Due Date") {
			var dateFilterLabel = "Due Date (Latest)";
			widget.down('label[itemId="dueDateLbl"]').setText(dateFilterLabel);
		}
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			operatorValue = settings[i].operator;

			if (fieldName === 'clientCode') {
				var clientField = widget.down('textfield[itemId=Client]');
				if (!Ext.isEmpty(clientField)) {
					if (!Ext.isEmpty(fieldVal2))
						clientField.setValue(fieldVal2);
					clientField.clientCodesData = fieldVal;
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

			if (fieldName === 'DueDate') {
				var dateFilterLabel = settings[i].dateLabel;
				var datefrom = new Date(fieldVal);
				var dateto = new Date(fieldVal2);
				fieldVal = Ext.Date.format(datefrom, strSqlDateFormat);
				fieldVal2 = Ext.Date.format(dateto, strSqlDateFormat);
				if (dateFilterLabel.indexOf("Date Range") > -1) {
					widget.down('label[itemId="dueDateLbl"]')
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
					widget.down('label[itemId="dueDateLbl"]')
							.setText(dateFilterLabel);
					widget.down('label[itemId="dateFilterFrom"]')
							.setText(fieldVal);
					widget.down('label[itemId="dateFilterTo"]').setText('-'
							+ fieldVal2);
				}
			}

		}
	},
	getSettings : function(portletPanel) {
		var me = portletPanel;
		var thisClass = this;
		var jsonArray = [];
		// colPref
		jsonArray.push({
					field : 'colPref',
					value1 : thisClass.getGridState()
				});

		// Client
		var clientCode = me.down('textfield[itemId="Client"]').clientCodesData;
		var clientDesc = me.down('textfield[itemId="Client"]').getValue();
		if (!Ext.isEmpty(clientCode) && clientCode != 'all') {
			jsonArray.push({
						field : 'clientCode',
						operator : 'eq',
						value1 : clientCode,
						value2 : clientDesc,
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
		// To Do
		var dateLabel = me.down('label[itemId="dueDateLbl"]').text;
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
						field : 'DueDate',
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
	},
	getDataPanel : function() {
		return this;
	}
});