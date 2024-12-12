Ext.define('Cashweb.view.portlet.FscOverdueLoans', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.fscoverdueloans',
	requires : ['Cashweb.store.FscOverdueLoansStore',
			'Ext.ux.gcp.AutoCompleter'],
	border : false,
	emptyText : null,
	cls : 'widget-grid',
	taskRunner : null,
	minHeight : 336,
	cols : 3,
	total : 0,
	strFilter : '',
	clientUrl : '',
	clientCode : '',
	portletref : null,
	scmProdFilter : null,
	dateFilterLabel : 'Due Date( Latest )',
	dateFilterVal : '12',
	datePickerSelectedDate : [],
	dateHandler : null,
	loanStore : null,
	arrSellerBuyer : null,
	sellerOrBuyerValue : 'SELLER',
	vFromDate1 : null,
	vToDate1 : null,
	filterRestrict : '999',
	enableQueryParam : false,
	creation_date_opt : null,
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
		thisClass.store = new Cashweb.store.FscOverdueLoansStore();

		thisClass.on('cellclick', function(me, td, cellIndex, record, tr,
						rowIndex, e, eOpts) {
					thisClass.fireEvent('navigateToFsc', record);
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
					header : getLabel("reference", "Loan Reference"),
					dataIndex : 'REFERENCES',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,					
					flex : 20,
					hidden : false
				}, {
					header : getLabel("scmProd", "SCF Package"),
					dataIndex : 'SCM_PROD',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					flex : 20,
					hidden : false
				}, {
					header : getLabel("dueDate", "Due Date"),
					dataIndex : 'DUE_DATE',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,					
					flex : 20,
					hidden : false
				}, {
					header : getLabel("os__amount", "Outstanding Amount"),
					dataIndex : 'OS_Amount',
					align : 'right',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,					
					flex : 18,
					hidden : false
				}, {
					header : getLabel("typeOfLoan", "Type of Loan"),
					dataIndex : 'TYPE_OF_LOAN',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,					
					flex : 22,
					hidden : false
				}/*, {
					header : getLabel("invoiceNo", "Invoice Number"),
					dataIndex : 'INVOICE_NO',
					sortable : true,
					flex : 23,
					hidden : true
				}*/, {
					header : getLabel("counterParty", "Counter Party"),
					dataIndex : 'COUNTER_PARTY',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,					
					flex : 23,
					hidden : true
				}, {
					header : getLabel("principalAmount", "Principal Amount"),
					dataIndex : 'PRINCIPAL_AMOUNT',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,					
					align : 'right',
					flex : 23,
					hidden : true
				}, {
					header : getLabel("anchorClient", "Anchor Client"),
					dataIndex : 'ANCHOR_CLIENT',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,					
					flex : 20,
					hidden : true
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

		thisClass.columns = objDefaultArr;
		thisClass.dockedItems = [{	xtype: 'toolbar', 
									dock: 'bottom',
									overCls : 'widgetTable-footer',
									layout: {
									    pack: 'center',
									    type: 'hbox'
									},
									items:[{
											type : 'button',
											text : getLabel("seeMore", "See More"),
											cls : 'widget-footer-cls',
											handler : function() 
											{
												var filter = '';
												thisClass.fireEvent('seemoreFSCRecords', filter,thisClass.record.get('settings'));
											}
		}]}];
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
					fieldCls : 'h2',
					margin : '0 0 0 2',
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
	handleDateChange : function( index) {
		var me = this;
		var objDateParams = me.getDateParam(index, null);
		var datePickerRef = $('#dueDatePicker');

		if (!Ext.isEmpty(me.dateFilterLabel) && !Ext.isEmpty(me.dateFilterVal)) 
		{
			if (!Ext.isEmpty(me.dateFilterLabel) && !Ext.isEmpty(me.portletref)) 
				me.portletref.down('label[itemId="dueDateLbl"]').setText("Due Date (" + me.dateFilterLabel + ")");
				creation_date_opt = "Due Date (" + me.dateFilterLabel + ")";
		}
		
		vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'),
					strExtApplicationDateFormat);
		vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'),
					strExtApplicationDateFormat);

		if (index=='13') 
		{
			if (objDateParams.operator == 'eq') 
			{
				datePickerRef.setDateRangePickerValue(vFromDate);
			}
			else 
			{
				datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
			}
		}
		else 
		{
			if (index === '1' || index === '2' || index === '12') 
			{
				if (index === '12') 
				{
					datePickerRef.val(vFromDate);
				} 
				else 
				{
					datePickerRef.setDateRangePickerValue(vFromDate);
				}
			}
			else 
			{
				datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
			}
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
			case '13' :
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
				/*fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'le';*/
				break;
			case '13' :
			// Date Range
				if(!isEmpty(me.datePickerSelectedDate))
				{
					if (me.datePickerSelectedDate.length == 1) 
					{
						fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedDate.length == 2) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
						fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1],strSqlDateFormat);
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
	generateUrl : function(settings) {
		var me = this;
		var isFilterApplied = false;
		var strFilter = '', clientFilter = '';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {
				if(settings[index].field != 'SellerOrBuyerrCombo'){
				if (settings[index].field === 'clientCode') {
					clientFilter = settings[index].value1;
					me.clientUrl = '$clientFilter=' + clientFilter;
					me.clientCode = clientFilter;
				}
				if (settings[index].field != 'customname'
						&& settings[index].field != 'clientCode'
						&& settings[index].field != 'colPref') {
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
		}
		if (!Ext.isEmpty(strFilter)){
				strFilter = '$filter=' + strFilter;
		}
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
		for(var i=0;i<settings.length;i++){
			if(settings[i].field == "SellerOrBuyerrCombo"){
				thisClass.sellerOrBuyerValue = settings[i].value1;
			}
		}
		Ext.Ajax.request({
					url : 'services/getFscOverdueLoansData/' + thisClass.sellerOrBuyerValue + '.json',
					method : 'POST',
					params : objParam,
					success : function(response) {
						obj = Ext.decode(response.responseText);
						thisClass.loadData(obj);
						thisClass.setRefreshLabel();

					},
					failure : function(response) {
						thisClass.getTargetEl().unmask();
						thisClass.setLoading(false);
					}
				});
	},

	loadData : function(data) {
		var me = this;
		var storeData = [];
		var arrData = data.summary.d.commonDataTable;
		if (!Ext.isEmpty(arrData)) {
			for (var i = 0; i < 5 && i < arrData.length; i++) {
				var colJson = {};
				if (arrData[i]) {
					colJson["REFERENCES"] = arrData[i].FIN_REF_NMBR;
					colJson["SCM_PROD"] = arrData[i].MYPDESCRIPTION;
					colJson["DUE_DATE"] = arrData[i].EXPECTED_REPAYMENT_DATE;
					colJson["OS_Amount"] = me.addCommas(arrData[i].SETTLEMENT_PENDING_AMNT);
					colJson["TYPE_OF_LOAN"] = arrData[i].LOAN_DESCRIPTION;
					//colJson["INVOICE_NO"] = arrData[i].INV_NMBR;
					colJson["COUNTER_PARTY"] = arrData[i].VENDOR_DEALER_CODE;
					colJson["PRINCIPAL_AMOUNT"] = me.addCommas(arrData[i].PROCESSED_AMNT);
					colJson["ANCHOR_CLIENT"] = arrData[i].ANCHOR_CLIENT;
					colJson["CW_INVOICE_INT_REF_NMBR"] = arrData[i].CW_INVOICE_INT_REF_NMBR;
					colJson["INVOICE_PO_FLAG"] = arrData[i].INVOICE_PO_FLAG;
					colJson["CLIENT_CODE"] = arrData[i].CLIENT_CODE;
					
				}
				storeData.push(colJson);
			}
		}
		me.getStore().loadData(storeData);
		this.setLoading(false);
	},
	showSettingsPopup : function(widgetCode, titleforsettings, record) {
		var me = this;
		me.getClientDataForSettingPanel();
		me.loanStore = me.getLoanStore();
		me.arrSellerBuyer = me.getSellerBuyerStore();
		var portletSettings = Ext.create('Ext.window.Window', {
					record : record,
					minHeight : 156,
					maxHeight : 550,
					cls : 'settings-popup xn-popup',
					buttonAlign : 'center',
					itemId : widgetCode + 'SettingsPanel',
					title : titleforsettings,
					autoHeight : true,
					width  : (screen.width) > 1024 ? 810 : 800,
					draggable : false,
					modal : true,
					resizable : false,
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
		me.getDatePicker();
		//me.addDateMenu(portletSettings);
		me.portletref = portletSettings;
		me.addTypeOfLoanComponant(portletSettings);
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
					type : 'column',
					pack : 'center'
				},
				flex : 1,
				cls : 'ft-padding-bottom',
				items : [{
					xtype : 'container',
					layout : 'hbox',
					columnWidth : 0.3333,
					margin : '0 0 0 0',
					hidden : thisClass.getClientOrAdminLogin(true),
					cls : 'ft-padding-bottom', 
					items : [{
						xtype : 'textfield',
						fieldLabel : getLabel("batchColumnClient",
								"Client"),
						labelPad : 2,
						labelWidth : 55,
						padding : '0 0 5 0',// Top Right Bottom Left
						readOnly : true,
						labelAlign : 'top',
						labelCls : 'frmLabel',
						labelSeparator : '',
						itemId : 'Client',
						fieldCls : 'ux_no-border-right xn-form-field',
						width  : (screen.width) > 1024 ? 203 : 213,
						height : 55,
						name : 'Client',
						clientCodesData : ''
					}, {
						xtype : 'button',
						border : 0,
						margin : '19 0 0 0',
						itemId : 'clientBtn',
						cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
						glyph : 'xf0d7@fontawesome',
						height : 37,
						menuAlign : 'tr-br',
						menu : Ext.create('Ext.menu.Menu', {
							itemId : 'clientMenu',
							width  : (screen.width) > 1024 ? 220 : 230,
							cls : 'ux_dropdown ux_dropdown-no-leftpadding',
							maxHeight : 200,
							items : []
						}),
						handler : function(btn, event) {
							btn.menu.show();
						}
					}]
				}, {
					xtype : 'container',
					layout : 'vbox',
					itemId : 'completDatePanel',
					columnWidth : 0.3333,
					items : [{
						xtype : 'container',
						layout : 'hbox',
						margin : '0 0 -5 -14',// Top Right Bottom Left
						items : [{
									xtype : 'label',
									itemId : 'dueDateLbl',
									padding : '0 0 0 -5',// Top Right Bottom Left
									name : 'dueDateLbl',
									text : getLabel("dueDate",
											"Due Date"),
											listeners : {
												render : function(c) {
													var tip = Ext.create('Ext.tip.ToolTip', {
														target : c.getEl(),
														listeners : {
															beforeshow : function(tip) {
																if (creation_date_opt === null)
																	tip.update('Due Date');
																else
																	tip.update(creation_date_opt);
															}
														}
													});
												}
											},
									cls : thisClass.getClientOrAdminLogin(true) ? 'frmLabel ft-extraLargeMargin-left' : 'frmLabel'
								}, {
									xtype : 'button',
									border : 0,
									itemId : 'dueDateBtn',
									name : 'dueDateBtn',

									cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
									glyph : 'xf0d7@fontawesome',
									menu : Ext.create('Ext.menu.Menu',
											{
												itemId : 'dateMenu',
												width : 220,
												cls : 'ux_dropdown ux_dropdown-no-leftpadding',
												maxHeight : 200,
												items : []
											}),
									listeners : {
										click : function(event) {
											var menus = thisClass.getDateDropDownItems();
											var xy = event.getXY();
											menus.showAt(xy[0], xy[1] + 16);
											event.menu = menus;
										}
									}

								}]
					},{
							xtype : 'container',
							itemId : 'dateRangeComponent',
							layout : 'hbox',
							width: '100%',
							cls : 'ft-smallmargin-left ft-extraLargeMargin-right',
							items : [{
								xtype : 'component',
								width : '88%',
								height : '70',
								margin : '-2 0 0 0',// Top Right Bottom Left
								padding : '2 0 3 0',// Top Right Bottom Left
								itemId : 'dueDatePickerQuick',
								fieldCls : 'xn-form-text',
								filterParamName : 'summaryDate',
								// endDateField : 'toDate',
								// startDateField : 'fromDate',
								html : '<input type="text"  id="dueDatePicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
							}, {
								itemId : 'dueDateFaFaCalender',
								xtype : 'component',
								height : 36,
								width: '100%',
								margin : '1 0 0 -12',// Top Right Bottom Left
								cls : 'icon-calendar t7-adjust-cal',
								html : '<span class=""><i class="fa fa-calendar"></i></span>'
							}]
							
				}]
				},{
						xtype : 'container',
						layout : 'hbox',
						columnWidth : 0.3333,
						items : [{
							xtype : 'AutoCompleter',
							cls : (thisClass.getClientOrAdminLogin(true)) ? 'ft-extraLargeMargin-left' : 'ft-extraLargeMargin-right',
							width  : (screen.width) > 1024 ? 230 : 220,
							fieldCls : 'xn-form-text xn-suggestion-box',
							labelCls : 'frmLabel',
							fitToParent : true,							
							fieldLabel : getLabel("scmProduct", "SCF Package"),
							emptyText : getLabel('searchSFGPKG', 'Search By SCF Package'),
							labelAlign : 'top',
							labelSeparator : '',
							itemId : 'scmProduct',
							name : 'scmProduct',
							cfgUrl : 'services/userseek/scmProducts.json',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'createdBy',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCR',
							cfgDataNode2 : 'CODE',
							cfgKeyNode : 'CODE',
							cfgExtraParams : [{
										key : '$filtercode1',
										value : thisClass.clientCode
									}]
						}]
						},
					{
							xtype : 'container',
							layout : 'hbox',
							hidden : thisClass.getClientOrAdminLogin(false),
							itemId : 'typeOfLoanId',
							flex : 1,
							columnWidth : 0.3333,
							items : []
					}]
			}, {
				xtype : 'container',
				layout : 'column',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'vbox',
					hidden : thisClass.getClientOrAdminLogin(true),
					flex : 0.38,
					items : [{
						xtype : 'container',
						layout : 'vbox',
						columnWidth : 0.3333,
							items : [{
									xtype : 'combo',
									itemId : 'typeOfLoan',
									multiSelect : false,
									labelAlign : 'top',
									labelSeparator : '',
									labelCls : 'frmLabel',
									fieldCls : 'ux_no-border-right xn-form-field',
									triggerBaseCls : 'xn-form-trigger',
									cls : 'ft-extraLargeMargin-right',
									width  : (screen.width) > 1024 ? 220 : 230,
									listConfig : {
										width  : (screen.width) > 1024 ? 220 : 230,
										tpl: [
									            '<ul><tpl for=".">',
									                '<li role="option" class="x-boundlist-item" data-qtip="{colDesc}">{colDesc}</li>',
									            '</tpl></ul>'
									        ]
									},
									matchFieldWidth : false,
									editable : false,
									displayField : 'colDesc',
									valueField : 'colId',
									queryMode : 'local',
									value : 'All',
									store : thisClass.loanStore,
									fieldLabel : getLabel("typeOfLoan",
											"Type of Loan")
								}]
					}]
				}, {
						xtype : 'container',
						layout : 'vbox',
						flex : 0.3333,
							items : [{
									xtype : 'combo',
									itemId : 'sellerOrBuyerrCombo',
									multiSelect : false,
									labelAlign : 'top',
									labelSeparator : '',
									labelCls : 'frmLabel',
									fieldCls : 'ux_no-border-right xn-form-field',
									triggerBaseCls : 'xn-form-trigger',
									cls : 'ft-extraLargeMargin-right',
									width  : (screen.width) > 1024 ? 240 : 230,
									listConfig : {
										width  : (screen.width) > 1024 ? 240 : 230
									},
									matchFieldWidth : false,
									editable : false,
									displayField : 'desc',
									valueField : 'code',
									queryMode : 'local',
									triggerAction : 'all',
									store : thisClass.arrSellerBuyer,
									fieldLabel : getLabel('sellerOrBuyerr', 'View as'),
									listeners : {
										'select' : function(combo, record) {
											thisClass.sellerOrBuyerValue = combo.getValue();
										},
										boxready : function(combo, width, height, eOpts) {
											if(thisClass.sellerOrBuyerValue == "SELLER")
											combo.setValue(combo.getStore().getAt(0));
											else
												combo.setValue(combo.getStore().getAt(1));
											
										}
									}
								}]
				}, {
					xtype : 'textfield',
					hideTrigger : true,
					//cls : thisClass.getClientOrAdminLogin(true)? '' : 'ft-smallMargin-right ft-smallMargin-left',
					labelAlign : 'top',
					labelSeparator : '',
					margin : '0 0 0 18',
					fieldLabel : getLabel("widgetName", "Widget Name"),
					itemId : 'customname',
					fieldCls : 'xn-form-text',
					cls : '.ft-extraLargeMargin-left',
					width  : (screen.width) > 1024 ? 230 : 238,
					labelCls : 'frmLabel',
					name : 'customname',
					maxLength : 40, // restrict user to enter 40 chars
					// max
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
	getSettings : function(portletPanel) {
		var thisClass = this;
		var me = portletPanel;
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

		// Type of Loan
		var typeOfLoanValue = me.down('combo[itemId="typeOfLoan"]').getValue();
		if (!Ext.isEmpty(typeOfLoanValue) && typeOfLoanValue != 'All') {
			jsonArray.push({
						field : 'TypeOfLoan',
						operator : 'eq',
						value1 : typeOfLoanValue,
						dataType : 0,
						displayType : 6
					});
		}
		
		//Buyer Seller
		thisClass.sellerOrBuyerValue = me.down('combo[itemId="sellerOrBuyerrCombo"]').getValue();
		if (!Ext.isEmpty(thisClass.sellerOrBuyerValue)) {
			jsonArray.push({
						field : 'SellerOrBuyerrCombo',
						operator : 'eq',
						value1 : thisClass.sellerOrBuyerValue,
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

		// SCM Product
		var scmProduct = me.down('AutoCompleter[itemId="scmProduct"]')
				.getValue();
		var prodDesc = me.down('AutoCompleter[itemId="scmProduct"]')
				.getRawValue();
		if(scmProduct===prodDesc)
				 scmProduct = thisClass.scmProdFilter;
		if (!Ext.isEmpty(scmProduct)) {
			jsonArray.push({
						field : 'scmProduct',
						operator : 'eq',
						value1 : scmProduct,
						value2 : prodDesc,
						dataType : 0,
						displayType : 4
					});
		}

		// Due Date
		// To Do
		var dateLabel = me.down('label[itemId="dueDateLbl"]').text;
		var fromCreation, toCreation, creationFromDate, creationToDate;
	
		var portlet2 = me.down('container[itemId="completDatePanel"]');
		var daterange = portlet2.down('container[itemId="dateRangeComponent"]');
		
		var index = thisClass.dateFilterVal;
		var objDateParams = thisClass.getDateParam(index);
			
		var fieldVal = objDateParams.fieldValue1;
		var fieldVal2 = objDateParams.fieldValue2;
		
		creationFromDate = fieldVal;
		creationToDate = fieldVal2;

		if (Ext.isEmpty(creationToDate)) 
		{
			creationToDate = creationFromDate;
		}
		if (!Ext.isEmpty(creationFromDate)) 
		{
			jsonArray.push({
						field : 'DueDate',
						operator : (!Ext.isEmpty(creationToDate)) ? 'bt' : 'eq',
						value1 : Ext.util.Format.date(creationFromDate, 'Y-m-d'),
						value2 : Ext.util.Format.date(creationToDate, 'Y-m-d'),
						dateLabel : dateLabel,
						dataType : 'D',
						displayType : 5,
						btnValue : thisClass.dateFilterVal
					});
		}
		return jsonArray;
	},
	setSettings : function(widget, settings) {
		var me = this;
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

			if (fieldName === 'TypeOfLoan') {
				var loanTypeValue = widget.down('combo[itemId="typeOfLoan"]');
				if (!Ext.isEmpty(loanTypeValue)) {
					if (!Ext.isEmpty(fieldVal))
						loanTypeValue.setValue(fieldVal);
				}
			}

			if (fieldName === 'SellerOrBuyerrCombo') {
				me.sellerOrBuyerValue = widget.down('combo[itemId="sellerOrBuyerrCombo"]');
				if (!Ext.isEmpty(me.sellerOrBuyerValue)) {
					if (!Ext.isEmpty(fieldVal))
						me.sellerOrBuyerValue.setValue(me.sellerOrBuyerValue.getValue());
				}
			}
			
			if (fieldName === 'scmProduct') {
				var scmProductField = widget
						.down('AutoCompleter[itemId="scmProduct"]');
				if (!Ext.isEmpty(scmProductField)) {
					if (!Ext.isEmpty(fieldVal))
					{	
						me.scmProdFilter = fieldVal;
						scmProductField.setValue(fieldVal);	
						scmProductField.setRawValue(fieldVal2);
					}
				}
			}
			if (fieldName === 'DueDate') {
				var dateFilterLabel = settings[i].dateLabel;
				if(!Ext.isEmpty(fieldVal) || !Ext.isEmpty(fieldVal2))
				{	
						var dateVar1 = $.datepick.parseDate('yyyy-mm-dd', fieldVal);
						var dateVar2 = $.datepick.parseDate('yyyy-mm-dd', fieldVal2);
						var vFromDate = $.datepick.formatDate(strApplDateFormat.toLowerCase(), dateVar1 );
						var vToDate = $.datepick.formatDate(strApplDateFormat.toLowerCase(), dateVar2 );

						creation_date_opt = dateFilterLabel;

						$('#dueDatePicker').datepick({
										monthsToShow : 1,
										changeMonth : true,
										changeYear : true,
										dateFormat : strApplDateFormat.toLowerCase(),
										rangeSeparator : '  to  ',
										onClose : function(dates) {
											if (!Ext.isEmpty(dates)) 
											{
													me.dateFilterVal = '13';
													me.datePickerCreatedDate = dates;
													me.dateFilterLabel = getLabel('daterange','Date Range');
													var dtParams = me.getDateParamForDateRange(me.dateFilterVal, dates[0],dates[1]);
													me.dateFilterFromVal = dtParams.fieldValue1;
													me.dateFilterToVal = dtParams.fieldValue2;
											}
										}
									});
						widget.down('label[itemId="dueDateLbl"]').setText(dateFilterLabel);
						widget.down('container[itemId="dateRangeComponent"]').show();
						var datePickerRef = $('#dueDatePicker');
						datePickerRef.datepick('setDate', [vFromDate, vToDate]);
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
		}
	},
	getDataPanel : function() {
		return this;
	},
	getDateDropDownItems : function()
	{
		var me = this;
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
			itemId : 'DateMenu',
			cls : 'ext-dropdown-menu',
			items : [{
						text : getLabel('latest', 'Latest'),
						btnId : 'latest',
						btnValue : '12',
						handler : function(btn, opts) {
							//me.datePickerSelectedDate = null;
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						handler : function(btn, opts) {
							//me.datePickerSelectedDate = null;
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						handler : function(btn, opts) {
						//	me.datePickerSelectedDate = null;
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						handler : function(btn, opts) {
						//	me.datePickerSelectedDate = null;
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						btnValue : '4',
						handler : function(btn, opts) {
						//	me.datePickerSelectedDate = null;
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						btnValue : '5',
						handler : function(btn, opts) {
							//me.datePickerSelectedDate = null;
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						handler : function(btn, opts) {
							//me.datePickerSelectedDate = null;
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						handler : function(btn, opts) {
							//me.datePickerSelectedDate = null;
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
							//me.datePickerSelectedDate = null;
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						handler : function(btn, opts) {
						//	me.datePickerSelectedDate = null;
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}, {
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						btnValue : '11',
						handler : function(btn, opts) {
							//me.datePickerSelectedDate = null;
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					}]
		});
		return dropdownMenu;
	},
	addTypeOfLoanComponant : function (summaryPortlet)
	{
		var thisClass = this;
		var arrMenuItem = null;
		if(thisClass.getClientOrAdminLogin(true))
		{ 
			arrMenuItem = summaryPortlet.down('container[itemId="typeOfLoanId"]');
			arrMenuItem.add({
								xtype : 'container',
								layout : 'vbox',
								flex : 0.38,
								items : [{
									xtype : 'container',
									layout : 'vbox',
									columnWidth : 0.3333,
										items : [{
												xtype : 'combo',
												itemId : 'typeOfLoan',
												multiSelect : false,
												labelAlign : 'top',
												labelSeparator : '',
												labelCls : 'frmLabel',
												fieldCls : 'ux_no-border-right xn-form-field',
												triggerBaseCls : 'xn-form-trigger',
												cls : 'ft-extraLargeMargin-left',
												width  : (screen.width) > 1024 ? 220 : 230,
												listConfig : {
													width  : (screen.width) > 1024 ? 220 : 230,
													tpl: [
									            			'<ul><tpl for=".">',
											                '<li role="option" class="x-boundlist-item" data-qtip="{colDesc}">{colDesc}</li>',
												            '</tpl></ul>'
		  									        	]
												},
												matchFieldWidth : false,
												editable : false,
												displayField : 'colDesc',
												valueField : 'colId',
												queryMode : 'local',
												value : 'All',
												store : thisClass.loanStore,
												fieldLabel : getLabel("typeOfLoan",
														"Type of Loan")
											}]
								}]
							});
		}
	},
	getClientDataForSettingPanel : function(settings) {
		var me = this;
		Ext.Ajax.request({
					url : 'services/userseek/userclients.json?',
					method : 'POST',
					async : false,
					success : function(response) 
					{
						var responseData = Ext.decode(response.responseText);
						me.allClientMenuData = responseData.d.preferences;
					},
					failure : function(settings) {
					}
				});
	},
	getDatePicker : function() {
		var me = this;
		$('#dueDatePicker').datepick({
			monthsToShow : 1,
			changeMonth : true,
			changeYear : true,
			rangeSeparator : ' to ',
			onClose : function(dates) {
				if (!Ext.isEmpty(dates)) {
					me.dateRangeFilterVal = '13';
					me.datePickerSelectedDate = dates;
					me.dateFilterVal = me.dateRangeFilterVal;
					me.dateFilterLabel = getLabel('daterange','Date Range');
					me.handleDateChange(me.dateRangeFilterVal);
				}
				else {
					me.dateFilterVal = '';
					me.dateFilterLabel = '';
					var dueDateLbl = me.down('label[itemId="dueDateLbl"]');
					if(!Ext.isEmpty(dueDateLbl)) 
						dueDateLbl.setText("Due Date");
				}

			}
		});
	},
	getLoanStore : function()
	{
		var loanStore = Ext.create('Ext.data.Store', {
			fields : ['colId', 'colDesc']
		});
			Ext.Ajax.request({
						url : 'services/userseek/loanTypes.json?$top=-1&$skip=-1',
						method : 'GET',
						async : false,
						success : function(response) {
							var responseData = Ext.decode(response.responseText);
							var data = responseData.d.preferences;
							if (loanStore) {
								loanStore.removeAll();
								var count = data.length;
								if (count > 0) {
									loanStore.add({
												'colId' : 'All',
												'colDesc' : 'All'
											});
								}
								for (var index = 0; index < count; index++) {
									var record = {
										'colId' : data[index].LOAN_TYPE,
										'colDesc' : data[index].LOAN_DESCRIPTION
									}
									loanStore.add(record);
								}
							}
						},
						failure : function() {
						}
					});

			return loanStore;
	},
	getClientOrAdminLogin : function(flag)
	{
		var thisClass = this;
		var clientOrAdminFlag = false;
		if(flag)
			clientOrAdminFlag = ((thisClass.allClientMenuData.length <= 2) || !isClientUser) ? true : false; //If count is one or admin then hide
		else
			clientOrAdminFlag = ((thisClass.allClientMenuData.length <= 2) || !isClientUser) ? false : true; //If count is one or admin then hide
		
		return clientOrAdminFlag;
	},
	addCommas : function(nStr) {
		nStr += '';
		var x = nStr.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1].substring(0, 2) : '.00';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	},
	getSellerBuyerStore : function(){
		var thisClass = this;
		thisClass.arrSellerBuyer = [{
			"code": "SELLER",
			"desc": "Seller"
		  },{
			"code": "BUYER",
			"desc": "Buyer"
		}];
		var objPOSellerBuyerStore = null;
		if (!Ext.isEmpty(thisClass.arrSellerBuyer)) {
			objPOSellerBuyerStore = Ext.create('Ext.data.Store', {
						fields : ['code','desc'],
						data : thisClass.arrSellerBuyer,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objPOSellerBuyerStore.load();
		}
		return objPOSellerBuyerStore;
	}
});