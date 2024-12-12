Ext.define('Cashweb.view.portlet.TransactionsPortlet', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.transactionsportlet',
	requires : ['Cashweb.store.TransactionsPortletStore',
			'Ext.ux.gcp.AutoCompleter'],
	border : false,
	emptyText : null,
	cls : 'widget-grid',
	taskRunner : null,
	minHeight : 336,
	cols : 3,
	total : 0,
	strFilter : '',
	selectedClientCode : '',
	allSendingAccountItemChecked : true,
	allSendingAccountItemUnChecked : false,
	allMyProductItemChecked : true,
	allMyProductItemUnChecked : false,
	dateFilterLabel : 'Latest',
	dateRangeFilterVal : '13',
	datePickerSelectedDate : [],
	datePickerSelectedEntryDate : [],
	dateFilterVal : '',
	dateHandler : null,
	vFromDate1 : null,
	vToDate1 : null,
	portletref : null,
	filterRestrict : '999',
	enableQueryParam : false,
	txn_date_opt : null,
	titleId : '',
	accountFilter : '$accountID=(ALL)',
	typeCodeFilter:'',
	activityDates : '',
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		thisClass.emptyText = label_map.noDataFound;
		thisClass.store = new Cashweb.store.TransactionsPortletStore();

		thisClass.on('refreshWidget', function() {
					var record = thisClass.record, settings = [];
					var filterUrl = '';
					thisClass.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					filterUrl = thisClass.generateUrl(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});
		/*thisClass.on('cellclick', function(me, td, cellIndex, record, tr,
				rowIndex, e, eOpts) {
			thisClass.fireEvent('seeMoreBalanceRecords',
					thisClass.strFilter, thisClass.record
					.get('settings'));
		});*/
		thisClass.on('boxready', function(component, eOpts) {
			thisClass.setLoading(label_map.loading);
		});
		thisClass.on('viewready', function(component, eOpts) {
					var settings = [];
					var filterUrl = '';
					var record = thisClass.record;
					var datePresentFlag = false;
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
					}
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'postingDate') {
							thisClass.dateFilterVal = ''+settings[i].displayType;
							thisClass.datePickerSelectedDate[0]=Ext.Date.parse(settings[i].value1, 'Y-m-d');
							thisClass.datePickerSelectedDate[1]=Ext.Date.parse(settings[i].value2, 'Y-m-d');
							datePresentFlag = true;
							continue;
						}
					}
					if (!datePresentFlag) {
						var objDateParams = thisClass.getDateParam("12", null);
						vFromDate = Ext.util.Format.date(Ext.Date.parse(
										objDateParams.fieldValue1, 'Y-m-d'),
								strExtApplicationDateFormat);
						vToDate = Ext.util.Format.date(Ext.Date.parse(
										objDateParams.fieldValue2, 'Y-m-d'),
								strExtApplicationDateFormat);
						thisClass.dateFilterVal = '12';
						settings.push({
									field : 'postingDate',
									operator : 'bt',
									value1 : Ext.util.Format.date(vFromDate, 'Y-m-d'),
									value2 : Ext.util.Format.date(vToDate, 'Y-m-d'),
									dateLabel : "Posting Date (Latest)",
									dataType : 'D',
									displayType : 12,
									btnValue : '12'
								});
						thisClass.record.set('settings', settings);
					}
								var objDateParams = thisClass.getDateParam("12", null);
								vFromDate = $.		datepick.formatDate(strApplDateFormat.toLowerCase(), 
								$.
									datepick.		parseDate('yyyy-mm-dd', objDateParams.fieldValue1));
									
									vToDate = $.	datepick.
									formatDate(strApplDateFormat.toLowerCase(), $.
									
									datepick.		parseDate('yyyy-mm-dd', objDateParams.fieldValue2));

									settings.push({
											field : 'activityDates',
											value1 : Ext.util.Format.date(vFromDate, 'Y-m-d'),
											value2 : Ext.util.Format.date(vToDate, 'Y-m-d'),
											displayType : 12
										});
							thisClass.record.set('settings', settings);
//					thisClass.setLoading(label_map.loading);
					filterUrl = thisClass.generateUrl(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});

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

		var objDefaultArr = [{
					header : getLabel("typeDesc", "Type Code Description"),
					dataIndex : 'TYPECODEDESC',
					align : 'left',
					hidden : false,
					flex : 20,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("bankref", "Bank Reference"),
					dataIndex : 'BANKRFERENCE',
					align : 'left	',
					hidden : false,
					flex : 20,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("postingdate", "Posting Date"),
					dataIndex : 'DATE',
					hidden : false,
					align : 'left',
					flex : 20,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("amount", "Amount"),
					dataIndex : 'TXN_AMNT',
					align : 'right',
					hidden : false,
					flex : 20,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("account", "Account Name"),
					dataIndex : 'ACCOUNT',
					align : 'left',
					hidden : false,
					flex : 30,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("drcr", "Debit / Credit"),
					dataIndex : 'CREDIT_DEBIT',
					align : 'left',
					hidden : false,
					flex : 20,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, /*{
					header : getLabel("valueDate", "Value Date"),
					dataIndex : 'VALUE_DATE',
					align : 'left',
					hidden : false,
					flex : 20,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				},*/
			/*	{
					header : getLabel("type", "Transaction Type"),
					dataIndex : 'TYPE',
					align : 'left',
					hidden : false,
					flex : 20,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
			
				                }*/];

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
				if (meta.column.dataIndex === "TXN_AMNT") {
					var balance = record.data.TXN_AMNT;
					balance = parseInt(balance.replace(',', ''),10);
					if (!Ext.isEmpty(record.data.TXN_AMNT)) {
							meta.tdAttr = 'title="' + record.raw.CCY_SYMBOL + " "
							+ record.data.TXN_AMNT + '"';
							return record.raw.CCY_SYMBOL + " "
									+ record.data.TXN_AMNT;
						}
				} else if (meta.column.dataIndex === "CREDIT_DEBIT") {
					value = (value === 'C') ? "Credit" : "Debit";

				}
				meta.tdAttr = 'title="' + (value) + '"';
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
					thisClass.fireEvent('seeMoreBalanceRecords',
							thisClass.strFilter, thisClass.record
									.get('settings'));
				}
			}]
		}];
		this.callParent();
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
					}, /*{
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					},*/ {
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
						text : getLabel('lastweekToYesterday', 'Last Week To Yesterday'),
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
						text : getLabel('lastMonthToYesterday', 'Last Month To Yesterday'),
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
						text : getLabel('lastQuarterToYesterday',
								'Last Quarter To Yesterday'),
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
						text : getLabel('lastYearToYesterday', 'Last Year To Yesterday'),
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
		
	addTypeCodeGroup : function(portletSettings) {
		var me = this;
		var arrMenuItem = portletSettings
				.down('radiogroup[itemId="typeRadioGrp"]');
		arrMenuItem.add({
					boxLabel : getLabel('typecode', 'Type Code'),
					name : 'type',
					inputValue : 'T',
					checked : true,
					handler : function(cb, nv, ov) {
						me.handleTypAutoComp(portletSettings, cb, nv, ov);
					}
				});

		arrMenuItem.add({
					boxLabel : getLabel('typecodeset', 'Type Code Set'),
					name : 'type',
					inputValue : 'TS',
					handler : function(cb, nv, ov) {
						me.handleTypAutoComp(portletSettings, cb, nv, ov);
					}
				});
	},
	getDateParamForDateRange : function(index, fromDate, toDate) {
		var me = this;
		me.dateRangeFilterVal = index;
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
		if(index != '2')
			date = objDateHandler.getYesterdayDate(date);		
		switch (index) {
		case '1' :
			// Today
			fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
			fieldValue2 = fieldValue1;
			operator = 'eq';
			break;
		case '2' :
			// Yesterday
			fieldValue1 = Ext.Date.format(objDateHandler.getYesterdayDate(date), strSqlDateFormat);
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
				// Previous Week
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
				// Previous Month
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
				// Previous Quarter
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
				if(dtHistoryDate > Ext.Date.parse(fieldValue1, 'Y-m-d'))
				{
					fieldValue1 = Ext.Date.format(dtHistoryDate , strSqlDateFormat);
				}				
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;

				

			case '12' :
				// Latest
				var fromDate = new Date(Ext.Date.parse(from_date_btr, dtFormat));
			    var toDate = new Date(Ext.Date.parse(to_date_btr, dtFormat));		
				 
				fieldValue1 = Ext.Date.format(
							fromDate,
				 strSqlDateFormat);
				fieldValue2 = Ext.Date.format(objDateHandler.getYesterdayDate(toDate),strSqlDateFormat);
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
		//retObj.btnValue = index;
		return retObj;
	},
	

	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#creationDatePicker');
		var toDatePickerRef = $('#entryDataToPicker');

		if (!Ext.isEmpty(me.dateFilterLabel) && !Ext.isEmpty(me.portletref)) {
			me.portletref.down('label[itemId="creationDateLbl"]')
			.setText("Posting Date ("+ me.dateFilterLabel+")" );			
			creation_date_opt = "Posting Date ("+ me.dateFilterLabel+")";
		}

		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.datepick('setDate',vFromDate);
			} else {
				datePickerRef.datepick('setDate',[vFromDate, vToDate]);
			}
		} else {
			if (index === '1' || index === '2') {
					datePickerRef.datepick('setDate',vFromDate);
			} else {
				datePickerRef.datepick('setDate',[vFromDate, vToDate]);
			}
		}
	},


	generateUrl : function(settings) {
		var me = this, typecode;
		var isFilterApplied = false;
		var strFilter = '';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {
				if (settings[index].field != 'customname'
						&& settings[index].field != 'colPref') {
					if (settings[index].field === 'account'
							|| settings[index].field === 'accountset') {
						me.accountFilter = '$accountID='
								+ settings[index].value1;
						isFilterApplied = false;
						continue;
					}

					if (settings[index].field === 'typecode'
							|| settings[index].field === 'typecodeset') {
						typecode = settings[index].field;
						me.typeCodeFilter='$typeCode='+
						settings[index].value1;
						isFilterApplied = false;
						continue;
					}
					
					if(settings[index].field === 'postingDate'){
						if(!Ext.isEmpty(settings[index].value1)){
							me.activityDates = '$activityFromDate='
								+ settings[index].value1;
							if(!Ext.isEmpty(settings[index].value2)){
								me.activityDates += '&$activityToDate='
									+ settings[index].value2;
							}
						}
					}
					
					if (Ext.isEmpty(settings[index].operator)) {
						isFilterApplied = false;
						continue;
					}
					if (isFilterApplied)
						strFilter = strFilter + ' and ';
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
						case 'btamt' :
							strFilter = strFilter + settings[index].field + ' '
									+ ' bt ' + ' ' + '\''
									+ settings[index].value1 + '\'' + ' and '
									+ '\'' + settings[index].value2 + '\''
									+ ' or ' + settings[index].field + ' '
									+ ' bt ' + ' ' + '\''
									+ (settings[index].value2 * (-1)) + '\''
									+ ' and ' + '\''
									+ (settings[index].value1 * (-1)) + '\'';
							isFilterApplied = true;
							break;

						case 'gtamt' :
							strFilter = strFilter + settings[index].field + ' '
									+ 'gt' + ' ' + settings[index].value1;
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
						case 'gte' :
							strFilter = strFilter + '(';
							strFilter = strFilter + settings[index].field + ' '
									+ 'eq' + ' ' + '\'' + settings[index].value1
									+ '\'';
							strFilter = strFilter + ' or ';
							strFilter = strFilter + settings[index].field + ' '
									+ 'gt' + ' ' + '\'' + settings[index].value1
									+ '\'';
							strFilter = strFilter + ')';
							break;
						case 'lte' :
							strFilter = strFilter + '(';
							strFilter = strFilter + settings[index].field + ' '
									+ 'eq' + ' ' + '\'' + settings[index].value1
									+ '\'';
							strFilter = strFilter + ' or ';
							strFilter = strFilter + settings[index].field + ' '
									+ 'lt' + ' ' + '\'' + settings[index].value1
									+ '\'';
							strFilter = strFilter + ')';
							break;
						case 'eqamt' :
							var reg = new RegExp(/[\(\)]/g);
							var objValue = settings[index].value1;
							if (objValue != 'All') {

								strFilter = strFilter + settings[index].field
										+ ' ' + ' eq ' + ' ' + '\'' + objValue
										+ '\'' + ' or ' + settings[index].field
										+ ' ' + ' eq ' + ' ' + '\''
										+ (objValue * (-1)) + '\'';
								isFilterApplied = true;
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
								} else
									strFilter = strFilter
											+ settings[index].field + ' '
											+ settings[index].operator + ' '
											+ '\'' + settings[index].value1
											+ '\'';
							}
							break;
					}
					isFilterApplied = true;
				}

				if (settings[index].field === 'typeCode') {
					settings[index].field = typecode;
				}
			}
		}
		if (!Ext.isEmpty(strFilter)) {
			me.strFilter = strFilter;
			strFilter = '$filter=' + strFilter;
		}
		if (!Ext.isEmpty(strFilter)) {
			if(!Ext.isEmpty(me.activityDates))
				strFilter = strFilter + '&' + me.activityDates;
		} else {
			strFilter = strFilter + '&' + me.activityDates;
		}
		return strFilter;
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
	ajaxRequest : function(filterUrl, settings) {
		var obj;
		var thisClass = this;
		thisClass.setTitle(settings);
		var strUrl = '?$top=5&$skip=1&$inlinecount=allpages&$filterOn=&$filterValue=&$serviceType=BR_TXN_SRC_GRID&$serviceParam=BR_GRIDVIEW_GENERIC';
		if (!Ext.isEmpty(filterUrl)) {
			strUrl = strUrl + '&' + filterUrl;
			if (!Ext.isEmpty(thisClass.accountFilter))
				strUrl = strUrl + '&' + thisClass.accountFilter;
			if (!Ext.isEmpty(thisClass.typeCodeFilter))
				strUrl = strUrl + '&' + thisClass.typeCodeFilter;
		} 
		else {
			strUrl = strUrl + '&' + thisClass.accountFilter;
		}
		thisClass.strFilter = strUrl.split('$inlinecount=allpages')[1];

		if (strUrl.charAt(0) == "?") { //remove first qstnmark
			strUrl = strUrl.substr(1);
		}
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = strUrl || {};
		var arrMatches = {};
		if (thisClass.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(strUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
		}
		Ext.Ajax.request({
					url : 'services/activities/transactionWidgetData',//strUrl,
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
						var fbarInstance = thisClass.down('toolbar');
						fbarInstance.hide();
						
					}
				});
	},

	loadData : function(data) {
		var me = this;
		var storeData = [];
		if (('__count' in data.d) && data.d.__count < 5) {
			var fbarInstance = me.down('toolbar');
			if (fbarInstance != null)
				fbarInstance.hide();
		}
		if (('__count' in data.d) && data.d.__count >= 5) {
			var fbarInstance = me.down('toolbar');
			if (fbarInstance != null)
				fbarInstance.show();
		}
		if (!('__count' in data.d)) {
			var fbarInstance = me.down('toolbar');
			if (fbarInstance != null)
				fbarInstance.hide();
		}
		
		if (undefined != data.d && undefined != data.d.btractivities) {
			var arrData = data.d.btractivities;
			if (!Ext.isEmpty(arrData)) {
				for (var i = 0; i < arrData.length && i < 5; i++) {
					var colJson = {};
					if (arrData[i]) {
						colJson["TYPE"] = arrData[i].text;
						colJson["BANKRFERENCE"] = arrData[i].bankRef;
						colJson["TXN_AMNT"] = setDigitAmtGroupFormat(arrData[i].txnAmount);
						colJson["DATE"] = arrData[i].postingDate;
						colJson["ACCOUNT"] = arrData[i].accountName + " " + "|"
								+ " " + arrData[i].accountNo;
						colJson["CURRENCY"] = arrData[i].text;
						colJson["CREDIT_DEBIT"] = arrData[i].drCrFlag;
						colJson["VALUE_DATE"] = arrData[i].valueDate;
						colJson["CCY_SYMBOL"] = arrData[i].currencySymbol;
						colJson["TYPECODEDESC"] = arrData[i].typeCodeDesc+" " + "|"
						+ " " + arrData[i].typeCode;;
					}
					storeData.push(colJson);
				}
			}
		}
		me.getStore().loadData(storeData);
		this.setLoading(false);
	},

	
	handleTypAutoComp : function(portlet, cb, nv, ov) {
		var me = this;
		var objAutoCmp = portlet.down('container[itemId="tyTypAutoComp"]')
		var objAccAllAutoComp = portlet
				.down('textfield[itemId="tyAutoComp"]');
		var objAccSetAutoComp = portlet.down('combo[itemId="tySetAutoComp"]');
		if (!Ext.isEmpty(objAutoCmp)) {
			var objRadioBtn = cb.inputValue;
			if (!Ext.isEmpty(objRadioBtn) && objRadioBtn == 'T' && nv == true) {

				if (!Ext.isEmpty(objAccAllAutoComp))
					objAccAllAutoComp.show();
				objAccAllAutoComp.setValue('');
				if (!Ext.isEmpty(objAccSetAutoComp))
					objAccSetAutoComp.hide();

			} else if (!Ext.isEmpty(objRadioBtn) && objRadioBtn == 'TS'
					&& nv == true) {

				if (!Ext.isEmpty(objAccAllAutoComp))
					objAccAllAutoComp.hide();
				if (!Ext.isEmpty(objAccSetAutoComp))
					objAccSetAutoComp.show();
				objAccSetAutoComp.setValue('All');
			}
		}
	},
	showSettingsPopup : function(widgetCode, titleforsettings, record) {
		var me = this;
		var portletSettings = Ext.create('Ext.window.Window', {
					record : record,
					//minHeight : 200,
					minHeight : 156,
					maxHeight : 550,
					cls : 'settings-popup xn-popup',
					buttonAlign : 'center',
					itemId : widgetCode + 'SettingsPanel',
					title : titleforsettings,
					autoHeight : true,
					width  : (screen.width) > 1024 ? 760 : 768,
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
									var accountFilterPresent = false;
									var tcFilterPresent = false;
									for (var i = 0; i < settings.length; i++) {
										if (settings[i].field === 'account'
												|| settings[i].field === 'accountset') {
											me.accountFilter = '$accountID='
													+ settings[i].value1;
											accountFilterPresent = true;
										}
										if (settings[i].field === 'typecode'
												|| settings[i].field === 'typecodeset') {
											me.typeCodeFilter = '$typeCode='
													+ settings[i].value1;
										    tcFilterPresent = true;
										}
										else{
											me.typeCodeFilter = null;
										}
									}
									if (!accountFilterPresent)
										me.accountFilter = '$accountID=(ALL)';
									if(!tcFilterPresent)
										me.typeCodeFilter = '';																			 
									var filterUrl = me.generateUrl(settings);
									me.ajaxRequest(filterUrl, settings);
									me.up('panel').fireEvent('saveSettings',
											record, settings);
									this.up('window').close();
								}
							}]
				});

		portletSettings.show();
		me.portletSettingObj = portletSettings;
		me.portletref = portletSettings;
		me.getDatePicker();
		//me.addDatePanel(portletSettings);
		//me.addDateMenu(portletSettings);
		//me.addAmountMenu(portletSettings);
		me.setDateField(record);
		me.addTypeCodeGroup(portletSettings);
		me.setSettings(portletSettings, me.record.get('settings'));
		
		Ext.getCmp('creationDateBtn').focus();
	},
	getDatePicker : function() {
		var me = this;
		$('#creationDatePicker').datepick({
			dateFormat : strjQueryDatePickerDateFormat, 
			monthsToShow : 1,
			changeMonth : true,
			changeYear : true,
			/*minDate:dtHistoryDate,*/
			maxDate : me.getPreviousDate(dtSellerDate),
			rangeSeparator : ' to ',
			onClose : function(dates) {
				var datePickerText = $('#creationDatePicker').val();
				if (!Ext.isEmpty(dates)) {
					if(!Ext.isEmpty(datePickerText))
					{
					me.dateRangeFilterVal = '13';
					me.datePickerSelectedDate = dates;
					me.datePickerSelectedEntryDate = dates;
						me.dateFilterVal = ''+me.dateRangeFilterVal;
					me.dateFilterLabel = getLabel('daterange','Date Range');
					me.handleDateChange(me.dateRangeFilterVal);
				}
					else 
					{
					me.dateFilterVal = '';
					me.dateFilterLabel = '';
					var creationDateLbl = me.portletSettingObj.down('label[itemId="creationDateLbl"]');
						if(!Ext.isEmpty(creationDateLbl)) creationDateLbl.setText("Transaction Date");
				}
			}
			}
		});
	},
	
	getPreviousDate : function (strAppDate){
		var me = this;
		var objDateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var yesterdayDate = objDateHandler.getYesterdayDate(date);
		return yesterdayDate;
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
		var records = [];
		var recordstyCode = [];
		var accountNoStore = null;
		var typeCodeStore = Ext.create('Ext.data.Store', {
					fields : ['txnCategory', 'typeCodes'],
					data : records
				});
		var tyCodeStore = null;

		var rangeStore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			data : [{
						"key" : "lt",
						"value" : "Less Than"
					},
			        {
						"key" : "gt",
						"value" : "Greater Than"
			      	},
					{
						"key" : "eq",
						"value" : "Equal To"
					}]
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
			url : 'services/userpreferences/tranSearchSummaryCategories/transactionCategories.json',
			method : "GET",
			async : false,
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					pref = Ext.decode(data.preference);
					if (pref !== null && typeof(pref) !== 'undefined') {
						records.push({
									txnCategory : 'All',
									typeCodes : ''
								})
						Ext.each(pref, function(obj) {
									records.push({
												txnCategory : obj.txnCategory,
												typeCodes : obj.typeCodes
											})
								});
						typeCodeStore.loadData(records);
					}
				}
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

		var portlet = thisClass.up('panel');
		var paymentCategoryStore = Ext.create('Ext.data.Store', {
					fields : ['colId', 'colDesc']
				});
		var menuRef = Ext.create('Ext.menu.Menu', {
					itemId : 'clientMenu',
					width : 150,
					maxHeight : 200,
					items : []
				});

		var settingsPanel = Ext.create('Ext.panel.Panel', {
			//padding : '10 10 10 10',
			items : [{
				xtype : 'container',
				cls : 'ft-padding-bottom',
				layout : 'column',
				flex : 1,
				items : [ {
							xtype : 'container',
							//	layout : 'vbox',
								//width : '150%',
								itemId : 'completDatePanel',
								//flex : 0.37,
								columnWidth : 0.3333,
								cls : 'ft-extraLargeMargin-right',
								items : [{
									xtype : 'container',
									layout : 'vbox',
									itemId : 'creationDateBtn',
									columnWidth : 0.3333,
									cls : 'ft-extraLargeMargin-right',
									width : '104%',
									//padding : '8 0 10 0',
									//flex : 0.38,
									items : [{
											

											xtype : 'container',
											layout : 'hbox',
											columnWidth : 0.3333,
											cls : 'ft--right',
											items : [{
														xtype : 'label',
														itemId : 'creationDateLbl',
														cls : 'widget_date_menu',
														text : getLabel("generationDate", "Posting Date"),
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
														//labelAlign : 'top',
													}, {
														xtype : 'button',
														border : 0,
														filterParamName : 'creationDateBtn',
														id : 'creationDateBtn',
														itemId : 'creationDateBtn',
														padding: '4 0 0 5',
														cls : 'ui-caret-dropdown settings-ui-caret',
														listeners : {
															click : function(event) {
																var menus = thisClass.getDateDropDownItems();
																var xy = event.getXY();
																menus.showAt(xy[0], xy[1] + 16);
																event.menu = menus;
															}
														}
													}]
										
										
										}, {
											xtype : 'container',
											itemId : 'entryDateToContainer',
											layout : 'hbox',
											width : '100%',
											cls : 'pagesetting',
											items : [{
												xtype : 'component',
												width : '87%',
												//padding: '4 0 0 25',
												itemId : 'creationDateDataPicker',
												filterParamName : 'postingDate',
												html : '<input type="text"  id="creationDatePicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment " style="width: 100%;">'
											}, {
												xtype : 'component',
												cls : 'icon-calendar t7-adjust-cal',
												margin : '1 0 0 0',
												width: '15%',
												html : '<span class=""><i class="fa fa-calendar"></i></span>'
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
									xtype : 'container',
									itemId : 'TransactionDate',
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
							}, 
							{
								xtype : 'radiogroup',
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								fieldLabel : getLabel("transactionType", "Transaction Type"),
								//flex : 0.37,
								columnWidth : 0.3333,
								cls : 'ft-extraLargeMargin-left ft-smallMargin-right ft-margin-t',
								columns : [55, 62, 62],
								itemId : 'creditDebitFlag',
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
							},
						]
					}, {
				xtype : 'container',
				layout : 'column',
				labelAlign : 'bottom',
				cls:'pagesetting',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'hbox',
					//flex : 0.27,
					columnWidth : 0.3333,
					padding : '10 0 0 0',
					cls : 'ft-smallMargin-right',
					items : [{
						xtype : 'container',
						layout : 'vbox',
						width : '100%',
						items : [{
									xtype : 'label',
									text :getLabel("account", "Account"),
									cls : 'frmLabel'
								},
								{								
									items : [{
										xtype : 'checkcombo',
										editable : false,
										addAllSelector : true,
										multiSelect : true,
										itemId : 'accAutoComp',
										valueField : 'accountId',
										displayField : 'accountName',
										hideTrigger : true,
										width : (screen.width) > 1024 ? 218 : 228,
										store : accountNoStore
									}]

								}]
					}]
				},{
					xtype : 'container',
					layout : 'vbox',
					//flex : 0.33,
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-left ft-smallMargin-right',
					items : [{
								xtype : 'radiogroup',
								itemId : 'typeRadioGrp',
								columns : [100, 125],
								width : '98%',
								items : []

							}, {
								xtype : 'container',
								itemId : 'tyTypAutoComp',
								items : [
							         {
							        	 	xtype : 'checkcombo',
											editable : false,
											addAllSelector : true,
											multiSelect : true,
									itemId : 'tyAutoComp',
											name : 'tyAutoComp',
											valueField : 'CODE',
											displayField : 'DESCR',
											hideTrigger : true,
											width : (screen.width) > 1024 ? 218 : 228,
											store : tyCodeStore
							         },
										{
									xtype : 'combo',
									itemId : 'tySetAutoComp',
									name : 'tySetAutoComp',
									queryMode : 'local',
									fieldCls : 'ux_no-border-right xn-form-field w110',
									triggerBaseCls : 'xn-form-trigger',
					                width  : (screen.width) > 1024 ? 218 : 218,
									editable : false,
									hidden : true,
									store : typeCodeStore,
									displayField : 'txnCategory',
									valueField : 'typeCodes',
									arrTypeCodeVal : '',
									emptyText : getLabel('select', 'Select'),
									listeners : {
										select : function(combo, record, index) {
											arrTypeCodeVal = combo.getValue();
											}/*,
											afterrender : function(combo) {
						                		arrTypeCodeVal = combo.getValue();
						                	}*/
									},
									
									listConfig:{
								   tpl: [
							            '<ul><tpl for=".">',
							                '<li role="option" class="x-boundlist-item" data-qtip="{txnCategory} value="{typeCodes}"">' +
							                '{txnCategory}</li>',
							            '</tpl></ul>'
							        ]
								 }
								}]

							}]
				}]
			},{
				xtype : 'container',
				layout : 'column',
				labelAlign : 'top',
				flex : 1,
				items : [				
						{
							xtype : 'container',
							layout : 'vbox',
							columnWidth : 0.3333,
							cls : 'pagesetting',
							items : [{	
									xtype : 'combo',
									border : 0,
									itemId : 'amountTypeBtn',
									name : 'amountTypeBtn',
									labelAlign : 'top',
									labelSeparator : '',
									labelCls : 'frmLabel',
									fieldLabel : getLabel("operator",
									"Operator"),
									displayField : 'value',
									valueField : 'key',
									value :'eq',
									editable : false,
									hideTrigger : true,
									store : rangeStore,
									padding:'3 0 0 0',
									width : (screen.width) > 1024 ? 232 : 235,
									listener : {
										select :function(){
											thisClass.handleAmountOperatorChange();
										}
									}
									
							}]
						},
						{
						xtype : 'container',
						layout : 'vbox',
						//flex : 0.27,
						columnWidth : 0.3333,
						//margin : '3 0 0 0',
						style : {
							'margin-top' : '3px'
						},
						cls : 'ft-extraLargeMargin-left',
						items : [{
							xtype : 'container',
							layout : 'hbox',
							width : '100%',
							items : [{
										xtype : 'label',
										itemId : 'amountLabel',
										name : 'amountLabel',
										text : getLabel('amount', 'Amount'),
										cls : 'frmLabel'
									}]
						}, {
							xtype : 'textfield',
							hideTrigger : true,
							itemId : 'amount',
							fieldCls : 'xn-valign-middle xn-form-text w7 xn-field-amount x-form-text',
							name : 'amount',
							decimalPrecision : 4,
							maxLength : 16,
							width : 220,
							height : '25px !important',
							enforceMaxLength : true,
							enableKeyEvents : true,
							msgTarget : 'under',
							listeners : {
								'afterrender' : function(field) {
									var strId = field.getEl() && field.getEl().id ? field
											.getEl().id : null;
									var inputField = strId ? $('#' + strId + ' input') : null;
									if (inputField) {
										inputField.autoNumeric("init", {
													aSep : strGrpSeparator,
													dGroup: strAmountDigitGroup,
													aDec : strDecSeparator,
													mDec : strMinFraction,
													vMin : 0,
													vMax : '99999999999.99'
												});
										
									}
								}
							}
						}]
				}]
			},{
				xtype : 'container',
				layout : 'column',
				labelAlign : 'top',
				flex : 1,
				width : '103%',
				//	padding : '10 0 10 0',
				items : [{
							xtype : 'textfield',
							hideTrigger : true,
							//flex : 0.37,
							columnWidth : 0.3333,
							cls : 'ft-extraLargeMargin-right',
							labelAlign : 'top',
							labelSeparator : '',
							fieldLabel : getLabel("widgetName", "Widget Name"),
							itemId : 'customname',
							fieldCls : 'xn-form-text',
							labelCls : 'frmLabel',
							name : 'customname',
							style : {
								'margin-top' : '05px'
							},
							maxLength : 40, // restrict user to enter 40 chars
							// max
							enforceMaxLength : true,
							maskRe : /[A-Za-z0-9 .]/
						}, {
							xtype : 'container',
							flex : 0.35
						}, {
							xtype : 'container',
							flex : 0.30
						}]
			}]
		});
		return settingsPanel;
	},

	setSettings : function(widget, settings) {
		var me = this;
		var strSqlDateFormat = 'm/d/Y';
		var formattedFromDate ,formattedToDate ; 
		var temp = widget.down('label[itemId="creationDateLbl"]');
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			operatorValue = settings[i].operator;

			// Amount Set values
			if (fieldName === 'amount') {
				widget.down("label[itemId=amountLabel]").setText(getLabel(
						'amount', 'Amount'));
				$( '#' + widget.down('textfield[itemId="amount"]').getInputId() ).autoNumeric('set',fieldVal);
				widget.down('combo[itemId="amountTypeBtn"]').setValue(operatorValue);
			}

			// CreditDebitFlag Set
			// values
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

			// Account/Account Set
			// Values
			
			var objAutoCompRef1 = null;
			if (fieldName === 'account') {
				
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
			

			// Typecode/Typecode Set
			// Values

			var objAutoCompRef1 = null;
			var objAutoCompRef2 = null;
			if (fieldName === 'typecode') {
				var accRadio = widget.down('radio[inputValue="T"]');
				accRadio.setValue(true);
				objAutoCompRef2 = widget.down('combo[itemId=tySetAutoComp]');
				objAutoCompRef2.setValue('All');
				if(!Ext.isEmpty(fieldVal) && (typeof fieldVal === 'string'))
				{
					var values = fieldVal.split(',');
					var tyCodeNos = [];
					Ext.each(values, function(tyCode){
						tyCodeNos.push(tyCode);
							});
					objAutoCompRef1 = widget
							.down('checkcombo[itemId=tyAutoComp]');
					if (!Ext.isEmpty(objAutoCompRef1) && !Ext.isEmpty(tyCodeNos)) {
						objAutoCompRef1.setValue(tyCodeNos);
				}
				}	
			}
			if (fieldName === 'typecodeset') {
				var accsRadio = widget.down('radio[inputValue="TS"]');
				accsRadio.setValue(true);
				objAutoCompRef1 = widget.down('combo[itemId=tySetAutoComp]');
				objAutoCompRef2 = widget
						.down('checkcombo[itemId=tyAutoComp]');
				if (!Ext.isEmpty(objAutoCompRef1) && !Ext.isEmpty(fieldVal)) {
					objAutoCompRef1.arrTypeCodeVal = fieldVal;
					objAutoCompRef1.setValue(fieldVal);
					objAutoCompRef1.setRawValue(fieldVal2);
					objAutoCompRef2.setValue('');
				}
			}

			// posted pending set values
			if (fieldName === 'valueDate') {
				}

			// Transaction Date Set
			// Values
			if (fieldName === 'postingDate') {
				var dateFilterLabel = settings[i].dateLabel;
				
				var dateFilterRefFrom = $('#creationDatePicker');

				me.dateFilterVal = ''+settings[i].displayType;
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

		}
		var dateFilterRefFrom = $('#creationDatePicker');
		if(!Ext.isEmpty(formattedFromDate) || !Ext.isEmpty(formattedToDate)){
			if (formattedFromDate === formattedToDate) {
				dateFilterRefFrom.val(formattedFromDate);
			} else {
				dateFilterRefFrom.datepick('setDate',[formattedFromDate, formattedToDate]);
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

		// Account/ Account Group
		var accAutoComp =  me.down('combobox[itemId="accAutoComp"]');
		var accAutoCompVal = me.down('combobox[itemId="accAutoComp"]').getValue();
		
		if (!Ext.isEmpty(accAutoCompVal) && !accAutoComp.isAllSelected()) {
			jsonArray.push({
						field : 'account',
						operator : 'in',
						value1 : accAutoCompVal,
						value2 : accAutoCompVal,
						dataType : 0,
						displayType : 4
					});
		}

		// Type/ Type Group
		var getCheckedBtnT = me.down('radio[inputValue="T"]').checked;
		if(getCheckedBtnT == true)
		{
		var typeAutoCompVal = me.down('textfield[itemId="tyAutoComp"]')
					.getValue();
		var typeAutoDispVal = me.down('textfield[itemId="tyAutoComp"]')
					.getRawValue();
		if (!Ext.isEmpty(typeAutoCompVal) && getCheckedBtnT == true && (me.down('textfield[itemId="tyAutoComp"]').value.length 
				!= me.down('textfield[itemId="tyAutoComp"]').getStore().getCount())) {
				jsonArray.push({
							field : 'typecode',
							operator : 'eq',
							value1 : typeAutoCompVal,
							value2 : typeAutoDispVal,
							dataType : 0,
							displayType : 4
						});
			}
		}

		var getCheckedBtnTS = me.down('radio[inputValue="TS"]').checked;
		var typeSetAutoCompVal = null;
		typeSetAutoCompVal=me.down('combo[itemId="tySetAutoComp"]')
				.getValue();
				if(Ext.isEmpty(typeSetAutoCompVal))
				typeSetAutoCompVal=me.down('combo[itemId="tySetAutoComp"]').getValue();
		if(getCheckedBtnTS == true)
		{
			var typeSetAutoCompVal = me.down('combo[itemId="tySetAutoComp"]').getValue();
			var typeSetAutoDispVal = me.down('combo[itemId="tySetAutoComp"]')
					.getRawValue();
			
			if(typeSetAutoCompVal == typeSetAutoDispVal){
				typeSetAutoCompVal = me.down('combo[itemId="tySetAutoComp"]').arrTypeCodeVal;
			}
			if (!Ext.isEmpty(typeSetAutoCompVal) && typeSetAutoCompVal != 'All'
					&& getCheckedBtnTS == true) {
				jsonArray.push({
							field : 'typecodeset',
							operator : 'eq',
							value1 : typeSetAutoCompVal,
							value2 : typeSetAutoDispVal,
							dataType : 0,
							displayType : 4
						});
			}
		}

		// Posted Pending

		var date = new Date(Ext.Date.parse(dtApplicationDate,
				strExtApplicationDateFormat));
		valueDateFrom = Ext.Date.format(date, 'Y-m-d');

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

		// Amount
		var debitCreditCheckedVal = me
				.down('radiogroup[itemId="creditDebitFlag"]').getValue().creditDebitFlag;

		if (debitCreditCheckedVal == 'C' || debitCreditCheckedVal == 'D' || debitCreditCheckedVal == 'All') { // Credit
			var amountOperator = me.down('combo[itemId="amountTypeBtn"]').getValue();
			var amount = me.down('textfield[itemId="amount"]').getValue();
				amount = $( '#' + me.down('textfield[itemId="amount"]').getInputId() ).autoNumeric( 'get' );	
			if(!Ext.isEmpty(amountOperator) && !Ext.isEmpty(amount)){
				jsonArray.push({
					field : 'amount',
					operator : amountOperator,
					value1 : amount,
					value2 : '',
					dataType : 2,
					displayType : 3
				});
			}		
		}
		//var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
		var datePickerText = $('#creationDatePicker').val();
		if(Ext.isEmpty(datePickerText)) {
			thisClass.dateFilterVal = '';
			thisClass.dateFilterLabel = '';
			me.down('label[itemId="creationDateLbl"]').setText("Posting Date( Latest )");
		}
		var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
		var index  = thisClass.dateFilterVal;
		var objDateParams = thisClass.getDateParam(""+index,null);
		if (!Ext.isEmpty(thisClass.dateFilterVal)) {
			jsonArray.push({
						field : 'postingDate',
						value1 : objDateParams.fieldValue1,
						value2 : objDateParams.fieldValue2,
						operator : objDateParams.operator,
						dataType : 'D',
						displayType : index,
						dateLabel : dateLabel == null ? getLabel("generationDate", "Posting Date") : dateLabel,
						btnValue : index
					});
		}
		
		
			return jsonArray;
		},
		
	getDataPanel : function() {
		return this;
	},
	
	setDateField : function(record){
		var me = this;
		var fromDate = null,toDate = null;
		if(!Ext.isEmpty(record)){
			var previousSettings = record.get('settings')
			if(!Ext.isEmpty(previousSettings)){
				for(var i=0 ; i<previousSettings.length ; i++){
					if(previousSettings[i].field === 'postingDate'){
						me.dateFilterVal = previousSettings[i].btnValue;
						if(!Ext.isEmpty(previousSettings[i].value1)){
							fromDate = Ext.Date.parse(previousSettings[i].value1, 'Y-m-d');
							toDate = Ext.Date.parse(previousSettings[i].value2, 'Y-m-d');
							me.datePickerSelectedDate = [fromDate , toDate];
						}
					}
				}
			}
			
		}
	},
	
	handleAmountOperatorChange : function(){
		var me = this;
		me.down('textfield[itemId="amount"]').setValue('');
	}
	
});