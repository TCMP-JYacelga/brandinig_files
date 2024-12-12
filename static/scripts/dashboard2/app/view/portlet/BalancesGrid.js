var fromDateMonth;
var toDateMonth;
var settingsPanel;
Ext.define('Cashweb.view.portlet.BalancesGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.balancesgrid',
	requires : ['Cashweb.store.BalancesGridStore'],
	border : false,
	emptyText : null,
	cls : 'widget-grid',
	taskRunner : null,
	minHeight : 50,
	height:338,
	cols : 3,
	total : 0,
	strFilter : '',
	selectedClientCode : '',
	allSendingAccountItemChecked : true,
	allSendingAccountItemUnChecked : false,
	allMyProductItemChecked : true,
	allMyProductItemUnChecked : false,
	dateFilterLabel : getLabel("balancePeriod","Balances Period")+ "("+getLabel("thismonth","This Month")+")",
	dateFilterVal : '5',
	dateHandler : null,
	vFromDate1 : null,
	vToDate1 : null,
	accountFilter : '$accountID=ALL',
	accountTypeFilter : '$filterValue=',
	eqCurrencyFilter : '$eqCurrency=',
	eqCurrencySymbol : '$',
	serviceTypeFilter : '$serviceType=BR_STD_SUMM_GRID',
	serviceParamFilter : '$serviceParam=BR_GRIDVIEW_GENERIC',
	summaryTypeFilter : '',
	filterValueFilter : '$filterValue=SUBFAC0102',
	filterOnFilter : '$filterOn=FAC',
	filterRestrict : '999',
	enableQueryParam : false,
	titleId : '',
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		thisClass.emptyText = label_map.noDataFound;
		thisClass.store = new Cashweb.store.BalancesGridStore();
		thisClass.on('refreshWidget', function() {
					var record = thisClass.record, settings = [];
					var filterUrl = '';
//					thisClass.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					filterUrl = thisClass.generateUrl(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});

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

		thisClass.legend = {
			position : 'bottom',
			boxStroke : 'transparent',
			boxFill : 'transparent',
			labelFont : '10px Helvetica, sans-serif',
			clickable : false
		}

		thisClass.on('boxready', function(component, eOpts) {
			thisClass.setLoading(label_map.loading);
		});
		thisClass.on('viewready', function(component, eOpts) {
					var me = this;
					var settings = [],tempSettings = [], isIntraDay = false;
					var filterUrl = '';
					var record = this.record;
					if (!Ext.isEmpty(record.get('settings'))) {
						tempSettings = record.get('settings');
						
						if(tempSettings && tempSettings.length > 0)
						{
							for (var i = 0; i < tempSettings.length; i++) {
								fieldName = tempSettings[i].field;
								fieldVal = tempSettings[i].value1;
								if (fieldName === 'tranType' && !Ext.isEmpty(fieldVal) &&
										fieldVal == 'intraday') {
									isIntraDay = true;
									break;
								}
							}			
						}
						// viewReady event, fetches the existing Saved parameter and apply it for AJAX call.
						// to avoid intra day Saved call we have written above logic
						if(!isIntraDay)
							settings = record.get('settings');
					}
					thisClass.setLoading(label_map.loading);
					var datePresentFlag = false;					
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'summaryFromDate' || settings[i].field === 'summaryToDate') {
							datePresentFlag = true;
							continue;
						}
					}
					if(datePresentFlag)
					{
						for (var i = 0; i < settings.length; i++) {
							if (settings[i].field === 'summaryFromDate') {
								if(settings[i].btnValue)
								{
									me.dateFilterVal = settings[i].btnValue;
									break;
								}
							}
						}
					}
					if (!datePresentFlag) {
						var objDateParams = thisClass.getDateParam("5", true);
						vFromDate = Ext.util.Format.date(Ext.Date.parse(
										objDateParams.fieldValue1, 'Y-m-d'),
								strExtApplicationDateFormat);
						vToDate = Ext.util.Format.date(Ext.Date.parse(
										objDateParams.fieldValue2, 'Y-m-d'),
								strExtApplicationDateFormat);
						settings.push({
									field : 'summaryFromDate',
									operator : 'eq',
									value1 : Ext.util.Format.date(vFromDate, 'Y-m-d'),
									dateLabel : getLabel("balancePeriod","Balances Period")+ "("+getLabel("thismonth","This Month")+")",
									dataType : 'D',
									displayType : 5,
									btnValue : "5"
						});				
						settings.push({
							field : 'summaryToDate',
							operator : 'eq',
							value1 : Ext.util.Format.date(vToDate, 'Y-m-d'),
							dateLabel : getLabel("balancePeriod","Balances Period")+ "("+getLabel("thismonth","This Month")+")",
							dataType : 'D',
							displayType : 5,
							btnValue : "5"						
						});
						settings.push({
							field : 'tranType',
							operator : 'eq',
							value1 : 'previousday',
							value2 : '',
							value3 : 'Previousday',
							dataType : 0,
							displayType : 4
						});
						thisClass.record.set('settings', settings);
					}
					filterUrl = thisClass.generateUrl(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});

		var objDefaultArr = [{
			        header : getLabel("accountName", "Account Name"),
			        dataIndex : 'ACCOUNTNAME',
			        align : 'left',
			        hidden : false,
			        sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
			        width : 200
	           	},  {
					header : getLabel("account", "Account"),
					dataIndex : 'ACCOUNTNO',
					align : 'left',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hidden : false,
					width : 200
				}, {
					header :  getLabel("openingLedger", "Opening Ledger"),
					tooltip : getLabel("asOfStartOfPeriod", "As of Start of Period"),
					dataIndex : 'OPN_LEDGER',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hidden : false,
					align : 'right',
					width: 216
				}, {
					header : getLabel("closingLedger", "Closing Ledger"),
					tooltip : getLabel("asOfEndOfPeriod", "As of End of Period"),
					dataIndex : 'CLG_LEDGER',
					align : 'right',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hidden : false,
					width: 216
				},  {
					header :getLabel("openingAvailable", "Opening Available"),
					dataIndex : 'OPN_AVAILABLE',
					align : 'right',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hidden : false,
					width: 216
				}, {
					header : getLabel("closingAvailable", "Closing Available"),
					dataIndex : 'CLG_AVAILABLE',
					align : 'right',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hidden : false,
					width: 216
				}, {
					header : getLabel("amountCr", "Amount Cr"),
					dataIndex : 'AMOUNT_CR',
					align : 'right',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hidden : true,
					width: 100
				}, {
					header : getLabel("amountDr", "Amount Dr"),
					dataIndex : 'AMOUNT_DR',
					align : 'right',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hidden : true,
					width: 100
				}, {
					header : getLabel("crCount", "Cr Count"),
					dataIndex : 'CRCOUNT',
					align : 'right',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hidden : true,
					width: 100
				}, {
					header : getLabel("drCount", "Dr Count"),
					dataIndex : 'DRCOUNT',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					align : 'right',
					width: 100,
					hidden : true
				}];
		var settings = thisClass.record.get('settings');
		if(settings.length == 0)
		{
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var objDateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		var strSqlDateFormat = 'Y-m-d';
		var jsonArray = [];
		dtJson = objDateHandler.getThisMonthToDate(date);
		fromDateMonth = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
		toDateMonth = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
		
		}
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
				//meta.style = 'cursor: pointer;';
				if (meta.column.dataIndex === "OPN_LEDGER") {
					if (!Ext.isEmpty(record.data.OPN_LEDGER)) {
						return record.data.OPN_LEDGER.trim();
					}
				} else if (meta.column.dataIndex === "CLG_LEDGER") {
					if (!Ext.isEmpty(record.data.CLG_LEDGER)) {
						return record.data.CLG_LEDGER.trim();
					}
				} else if (meta.column.dataIndex === "OPN_AVAILABLE") {
					if (!Ext.isEmpty(record.data.OPN_AVAILABLE)) {
						return record.data.OPN_AVAILABLE.trim();
					}
				}
				else if (meta.column.dataIndex === "AMOUNT_DR") {
					if (!Ext.isEmpty(record.data.AMOUNT_DR)) {
						return  record.data.AMOUNT_DR.trim();
					}
				} else if (meta.column.dataIndex === "CLG_AVAILABLE") {
					if (!Ext.isEmpty(record.data.CLG_AVAILABLE)) {
						return record.data.CLG_AVAILABLE.trim();
					}
				}
				return value;
			}
		}

		thisClass.columns = columnModel;

		thisClass.dockedItems = [{
			xtype : 'toolbar',
			dock : 'bottom',
			overCls:'widgetTable-footer',
			layout: {
			    pack: 'center',
			    type: 'hbox'
			},
			items : [/*{
						type : 'button',
						cls : 'custom_sprite_orange'
					}, {
						type : 'button',
						text : 'As of Start of Period'
					}, {
						type : 'button',
						cls : 'custom_sprite_green'
					}, {
						type : 'button',
						text : 'As of End of Period'
					},*/ {
						type : 'button',
						//margin : '0 0 0 280',
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
					tooltip : objCol.tooltip,
					hidden : objCol.hidden,
					flex : objCol.flex,
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					align : objCol.align,
					renderer : objCol.renderer,
					width : objCol.width
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
	checkInfinity : function(intFilterDays) {
		if (intFilterDays == '0' || Ext.isEmpty(intFilterDays)) {
			return true;
		}
	},
	addDateMenu : function(portletSettings) {
		var me = this;
		var intFilterDays = me.filterRestrict;
		var arrMenuItem = portletSettings.down('menu[itemId="dateMenu"]');
		/*arrMenuItem.add({
					text : getLabel('latest', 'Latest'),
					btnId : 'btnLatest',
					parent : me,
					btnValue : '12',
					handler : function(btn, opts) {
						me.dateFilterVal = btn.btnValue;
						me.dateFilterLabel = btn.text;
						me.handleDateChange(portletSettings, btn.btnValue);
					}
				});*/

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
					margin : '0 0 0 2',
					width : 83,
					fieldStyle : 'background-color: white;',
					fieldCls : 'h2',
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
	addAccountGroup : function(portletSettings) {
		var me = this;
		var arrMenuItem = portletSettings
				.down('radiogroup[itemId="accountRadioGrp"]');
		/*arrMenuItem.add({
					boxLabel : getLabel('account', 'Account'),
					name : 'account',
					inputValue : 'A',
					checked : true,
					handler : function(cb, nv, ov) {
						me.handleAccTypAutoComp(portletSettings, cb, nv, ov);
					}
				});*/

		arrMenuItem.add({
					boxLabel : getLabel('accountSet', 'Account Set'),
					name : 'account',
					inputValue : 'AS',
					handler : function(cb, nv, ov) {
						me.handleAccTypAutoComp(portletSettings, cb, nv, ov);
					}
				});
	},

	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#balancePeriodDatePicker');
		if (!Ext.isEmpty(me.dateFilterLabel) && !Ext.isEmpty(me.portletSettingObj)) {
			me.portletSettingObj.down('label[itemId="creationDateLbl"]').setText(getLabel("balancePeriod","Balances Period")
					+ " (" + me.dateFilterLabel + ")");
		}
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			creation_date_opt = getLabel("balancePeriod","Balances Period")+" (" + me.dateFilterLabel + ")";
		}

		var vFromDate = Ext.Date.parse(
				objDateParams.fieldValue1, 'Y-m-d');
		var vToDate = Ext.Date.parse(
				objDateParams.fieldValue2, 'Y-m-d');
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
	getDateParam : function(index, isViewReadyMode) {
		var me = this;
		var objDateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
			me.dateFilterVal = index;
		if(index != '2' && index != '1')
			date = objDateHandler.getYesterdayDate(date);
		var latest_to_date = objDateHandler.getYesterdayDate(new Date(Ext.Date.parse(to_date_btr, dtFormat)));
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
				fieldValue1 = Ext.Date.format(objDateHandler.getYesterdayDate(date), strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '3' :
				// This Week
				dtJson = objDateHandler.getThisWeekToDate(date);
				var noOfDays = (dtJson.fromDate.getDay() - dtJson.toDate.getDay());
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				if(noOfDays == 1)					
					fieldValue1 =  Ext.Date.format(dtJson.toDate, strSqlDateFormat);
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
				fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
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
				fieldValue2 = Ext.Date.format(
							latest_to_date,
							strSqlDateFormat);
				operator = 'bt';
				break;
			case '13' :
				if(!isEmpty(me.datePickerSelectedDate)) {
					if (me.datePickerSelectedDate.length == 1) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0], strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedDate.length == 2) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0], strSqlDateFormat);
						fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
						operator = 'bt';
					}
				}
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
		var isFilterApplied = false;
		var strFilter = '';
		var accountFilterPresent = false, accountTypeFilterPresent = false;
		var summaryFromDateFilterPresent = false, summaryToDateFilterPresent = false;
		var tranTypeFilterPresent = false;
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {
				if (settings[index].field != 'customname'
						&& settings[index].field != 'colPref') {
					if (settings[index].field === 'account'
							|| settings[index].field === 'accountset') {
						me.accountFilter = '$accountID='
								+ settings[index].value1;
						isFilterApplied = false;
						accountFilterPresent = true;
						continue;
					}

					if (settings[index].field === 'tranType') {
						me.tranTypeFilter = '$summaryType='+  settings[index].value1;
						tranTypeFilterPresent = true;
						continue;
					}
					if (settings[index].field === 'summaryFromDate') {
						/*/if(me.dateFilterVal === '12')
						{
							me.summaryFromDateFilter = '$summaryFromDate='+  null;
						}
						else
						{*/
							me.summaryFromDateFilter = '$summaryFromDate='+  settings[index].value1;
						//}
						summaryFromDateFilterPresent = true;
						continue;
					}
					if (settings[index].field === 'summaryToDate') {
						/*if(me.dateFilterVal === '12')
						{
							me.summaryToDateFilter = '$summaryToDate='
								+ null;
							
						}
						else
						{*/
							me.summaryToDateFilter = '$summaryToDate='
								+ settings[index].value1;
						//}
						summaryToDateFilterPresent = true;
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

		if (!accountFilterPresent)
			me.accountFilter = '$accountID=ALL';
		if (!accountTypeFilterPresent)
			me.accountTypeFilter = '$filterValue=';
		if (!summaryFromDateFilterPresent)
			me.summaryFromDateFilter = '$summaryFromDate=' + fromDateMonth;
		if (!summaryToDateFilterPresent)
			me.summaryToDateFilter = '$summaryToDate=' + toDateMonth;

		if (!Ext.isEmpty(strFilter)) {
			me.strFilter = strFilter;
			strFilter = '$filter=' + strFilter;
		}

		strFilter = strFilter + '&' + me.eqCurrencyFilter;
		strFilter = strFilter + '&' + me.serviceTypeFilter;
		strFilter = strFilter + '&' + me.serviceParamFilter;

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
	loadRealtimeBalance : function(filterUrl, settings) {
		var strUrl = 'services/getRealtimeBalance.json';
		strUrl = strUrl+'?&$source=WIDGET';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++)
			{
				if (settings[index].field === 'account'
						|| settings[index].field === 'accountset')
				{
					strUrl = strUrl + '&$accountID='+ settings[index].value1;
				}
			}
		}
		
		var me = this;
	    Ext.Ajax.request({
			url : strUrl,
			method : 'POST',
			async: true,
			success : function( response )
			{
				var data = Ext.decode( response.responseText );
				if( !Ext.isEmpty( data ) )
				{
					if(data.response && data.response.success)
					{
						if(data.response.success == 'Y')
						{
							me.fetchRecords(filterUrl, settings);
						}
						else if(data.response.success == 'N')
						{
							me.setLoading(false);
							me.renderError(data.response);
						}
					}
				}
			},
			failure : function(response)
			{
				me.ajaxError();
				me.setLoading(false);
			}
	    });
	},
	ajaxError : function()
	{
		alert( "AJAX error, please contact admin!" );
	},
	renderError : function(json)
	{
		var errMsg = "";
		var me = this;
		if(!Ext.isEmpty(json.realTimeErrorCode))
			errMsg = errMsg + json.realTimeErrorCode + ' - '
		if(!Ext.isEmpty(json.realTimeErrorMessage))
			errMsg = errMsg + json.realTimeErrorMessage
			
		Ext.MessageBox.show(
		{
			title : getLabel( 'filterPopupTitle', 'Error' ),
			msg :  errMsg,
			buttons : Ext.MessageBox.OK,
			icon : Ext.MessageBox.ERROR
		} );
	}	,
	ajaxRequest : function(filterUrl, settings) {
		var obj,isIntraDay = false;
		var thisClass = this;
		if(settings && settings.length > 0)
		{
			for (var i = 0; i < settings.length; i++) {
				fieldName = settings[i].field;
				fieldVal = settings[i].value1;
				if (fieldName === 'tranType' && !Ext.isEmpty(fieldVal) &&
						fieldVal == 'intraday') {
					isIntraDay = true;
				}
			}			
		}
		if(isIntraDay)
		{
			thisClass.loadRealtimeBalance(filterUrl, settings);
		}
		else
		{
			thisClass.fetchRecords(filterUrl, settings);
		}
	},
	fetchRecords : function(filterUrl, settings) {
		var obj;
		var thisClass = this;
		thisClass.setTitle(settings);
		var strUrl = '?$top=10&$skip=0&$inlinecount=allpages';

		if(!Ext.isEmpty(thisClass.tranTypeFilter))
		{
			strUrl = strUrl + '&' + thisClass.tranTypeFilter;
			thisClass.summaryTypeFilter = thisClass.tranTypeFilter;;
		}
		if (!Ext.isEmpty(thisClass.summaryFromDateFilter)
				|| !Ext.isEmpty(thisClass.summaryToDateFilter)) {
			strUrl = strUrl + '&' + thisClass.summaryFromDateFilter;
			strUrl = strUrl + '&' + thisClass.summaryToDateFilter;
		}

		if (!Ext.isEmpty(filterUrl)) {
			strUrl = strUrl + '&' + filterUrl;
			if (thisClass.accountTypeFilter !== '$filterValue=')
				strUrl = strUrl + '&' + thisClass.accountTypeFilter
						+ '&$filterOn=FAC';
			else
				strUrl = strUrl + '&' + thisClass.accountTypeFilter
						+ '&$filterOn=';

			if (!Ext.isEmpty(thisClass.accountFilter))
				strUrl = strUrl + '&' + thisClass.accountFilter;
			else
				strUrl = strUrl + '&' + thisClass.accountFilter;
		} else {
			if (thisClass.accountTypeFilter !== '$filterValue=')
				strUrl = strUrl + '&' + thisClass.accountTypeFilter
						+ '&$filterOn=FAC';
			else
				strUrl = strUrl + '&' + thisClass.accountTypeFilter
						+ '&$filterOn=';

			strUrl = strUrl + '&' + thisClass.accountFilter;

		}
		thisClass.strFilter = strUrl.split('$inlinecount=allpages')[1];
		strUrl = strUrl + '&$orderby=accountName&$acctType=CASA';

		if (strUrl.charAt(0) == "?") { // remove first qstnmark
			strUrl = strUrl.substr(1);
		}
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = strUrl || {}, arrMatches;
		if (thisClass.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(strUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
		}
		Ext.Ajax.request({
					url : 'services/balancesummary/balancehistory',// strUrl
																		// +
																		// '&$orderby=accountName',
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
		if (data && data.d && data.d.commonDataTable.length < 5) {
			var fbarInstance = me.down('toolbar');
			if (fbarInstance != null)
				fbarInstance.hide();
		}
		if (data && data.d && data.d.commonDataTable.length >= 5) {
			var fbarInstance = me.down('toolbar');
			if (fbarInstance != null)
				fbarInstance.show();
		}
		if (!data.d.commonDataTable.length) {
			var fbarInstance = me.down('toolbar');
			if (fbarInstance != null)
				fbarInstance.hide();
		}
		if (!data || !data.d || !data.d.commonDataTable) {
			var fbarInstance = me.down('toolbar');
			if (fbarInstance != null)
				fbarInstance.hide();
		}
		if (undefined != data.d && undefined != data.d.commonDataTable) {
			var arrData = data.d.commonDataTable;
			if (!Ext.isEmpty(arrData)) {
				for (var i = 0; i < 5 && i < arrData.length; i++) {
					var colJson = {};
					if (arrData[i]) {
						colJson["ACCOUNTNO"] = arrData[i].ACCOUNT_NMBR;
						colJson["DRCOUNT"] = arrData[i].DEBIT_COUNT;
						colJson["OPN_LEDGER"] = arrData[i].OP_LEDGER;
						colJson["CRCOUNT"] = arrData[i].CREDIT_COUNT;
						colJson["CLG_LEDGER"] = arrData[i].CL_LEDGER;
						colJson["ACCOUNTNAME"] = arrData[i].ACCOUNT_NAME;
						colJson["OPN_AVAILABLE"] = arrData[i].OP_AVAILABLE;
						colJson["CLG_AVAILABLE"] = arrData[i].CL_AVAILABLE;
						//colJson["CURRENCY"] = arrData[i].currencySymbol;
						colJson["AMOUNT_DR"] =arrData[i].DEBIT_AMOUNT;
						colJson["AMOUNT_CR"] =arrData[i].CREDIT_AMOUNT;
					}
					storeData.push(colJson);
				}
			}
		}
		me.getStore().loadData(storeData);
		this.setLoading(false);
	},

	handleAccTypAutoComp : function(portlet, cb, nv, ov) {
		var me = this;
		var objAutoCmp = portlet.down('container[itemId="accTypAutoComp"]')
		var objAccAllAutoComp = portlet
				.down('combobox[itemId="accAutoComp"]');
		var objAccSetAutoComp = portlet
				.down('combobox[itemId="accSetAutoComp"]');
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
	},
	handleTypAutoComp : function(portlet, cb, nv, ov) {
		var me = this;
		var objAutoCmp = portlet.down('container[itemId="tyTypAutoComp"]')
		var objAccAllAutoComp = portlet
				.down('combobox[itemId="tyAutoComp"]');
		var objAccSetAutoComp = portlet
				.down('combobox[itemId="tySetAutoComp"]');
		if (!Ext.isEmpty(objAutoCmp)) {
			var objRadioBtn = cb.inputValue;
			if (!Ext.isEmpty(objRadioBtn) && objRadioBtn == 'T' && nv == true) {

				if (!Ext.isEmpty(objAccAllAutoComp))
					objAccAllAutoComp.show();
				if (!Ext.isEmpty(objAccSetAutoComp))
					objAccSetAutoComp.hide();

			} else if (!Ext.isEmpty(objRadioBtn) && objRadioBtn == 'TS'
					&& nv == true) {

				if (!Ext.isEmpty(objAccAllAutoComp))
					objAccAllAutoComp.hide();
				if (!Ext.isEmpty(objAccSetAutoComp))
					objAccSetAutoComp.show();
			}
		}
	},
	showSettingsPopup : function(widgetCode, titleforsettings, record) {
		var me = this;
		var portletSettings = Ext.create('Ext.window.Window', {
					record : record,
					height : 430,
					maxHeight : 550,
					cls : 'settings-popup xn-popup',
					buttonAlign : 'center',
					itemId : widgetCode + 'SettingsPanel',
					title : titleforsettings,
					autoHeight : false,
					width : 450,
					modal : true,
					resizable : false,
					draggable : false,
					items : me.getSettingsPanel(),
					listeners : {
						resize : function(){
							this.center();
						},
						afterrender : function() {
							var records = [];
							this.down('combobox[itemId=accSetAutoComp]').store = me.fetchAccountSetList();
						}
					},
					bbar : [{
								text : getLabel("cancel", "Cancel"),
								tabIndex : "1",
								//cls : 'ux-button-s ft-button-secondary footer-btns',
								handler : function() {
									this.up('window').close();
								}
							}, '->', {
								text : getLabel("save", "Save"),
								tabIndex : "1",
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
		this.addDatePanel(portletSettings);
		me.portletSettingObj = portletSettings;
		this.manageCreationDatePicker();		
		//this.addDateMenu(portletSettings);
		//this.addAccountGroup(portletSettings);
		me.setSettings(portletSettings, me.record.get('settings'));
		me.portletSettingObj.down('combobox[itemId="tranType"]').focus();
	},
	fetchAccountSetList : function()
	{
		var me = this,isIntraDay = false;
		var strUrl = null, records = [];
		var settings = me.record.get('settings');
		if(!Ext.isEmpty(settings) && settings.length > 0)
		{
			for (var i = 0; i < settings.length; i++) {
				fieldName = settings[i].field;
				fieldVal = settings[i].value1;
				if (fieldName === 'tranType' && !Ext.isEmpty(fieldVal) &&
						fieldVal == 'intraday') {
					isIntraDay = true;
				}
			}								
		}
		if(isIntraDay)
		{
			strUrl = 'services/transcationSearch/accountSetForWidgets.json?$transactionType=intraday'; 
		}
		else
		{
			strUrl = 'services/transcationSearch/accountSetForWidgets.json?$transactionType=previousday'; 
		}			
		var typeCodeStore = Ext.create('Ext.data.Store', {
			fields : ['accountSetName', 'accounts'],
			data : records
		});
		Ext.Ajax.request({
				url : strUrl,
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
		return typeCodeStore;
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
		var typeCodeStore = Ext.create('Ext.data.Store', {
			fields : ['accountSetName', 'accounts'],
			data : records
		});
		var tranTypeStore = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data :
					[
						{
							"key" : "intraday",
							"value" : "IntraDay"
						},
						{
							"key" : "previousday",
							"value" : "Previous Day"
						}
					]
				} );
	settingsPanel = Ext.create('Ext.panel.Panel', {
			//padding : '10 10 10 10',
			height : 400,
			items : [{
				xtype : 'container',
				height : 400,
				padding : '0 0 0 0',
				layout : 'vbox',
				items : [
					{
						xtype : 'container',
						layout : 'vbox',
						itemId : 'tranTypePanel',
						cls : 'ft-padding-bottom pagesetting',	
						items : [{
							xtype : 'container',
							layout : 'hbox',
							width : 300,
							autoScroll:  true,
							items : [
								     {
											xtype : 'label',
											text : getLabel('lbltransactionType', 'Transaction Type'),
											cls : 'f13 ux_font-size14 ',
											padding : '0 0 2 0'
									}]
						},
						{
							xtype : 'container',
							itemId : 'tranTypeItem',
							layout : 'hbox',
							width: 312,
							items : [{
								xtype : 'combo',
								editable : false,
								displayField : 'value',
								itemId : 'tranType',
								store : tranTypeStore,
								tabIndex : "1",
								valueField : 'key',
				                width  : (screen.width) > 1024 ? 218 : 218,
								fieldCls : 'ux_no-border-right xn-form-field w110',
								triggerBaseCls : 'xn-form-trigger',
								listeners : {
									'change' : function(comboRef, newValue, oldValue, eOpts) 
									{
										var strUrl = null, records = [];
										var strFromDate=null,strToDate = null;	
										var objDateParams =null;
										// START - following code change for Date Picker value reset
										if(newValue == 'intraday')
										{
											 objDateParams = thisClass.getDateParam("1");
											 thisClass.dateFilterVal ='1';
											 settingsPanel.down('component[itemId="creationDatecalendar"]').hide();
											 settingsPanel.down('label[itemId="creationDateLbl"]').setText('Balances Period (Today)');
											 $('#balancePeriodDatePicker').datepicker( "option", "maxDate", dtSellerDate);
											 creation_date_opt ='Balances Period (Today)';
											 settingsPanel.down('button[itemId=creationDateBtn]').hide();
										}
										else
										{
											 objDateParams = thisClass.getDateParam("5");
											 thisClass.dateFilterVal ='5';
											 settingsPanel.down('label[itemId="creationDateLbl"]').setText('Balances Period (This Month)');
											 settingsPanel.down('component[itemId="creationDatecalendar"]').show();
											 $('#balancePeriodDatePicker').datepicker( "option", "maxDate", thisClass.getPreviousDate(dtSellerDate));
											 
											 creation_date_opt ='Balances Period (This Month)';
											 settingsPanel.down('button[itemId=creationDateBtn]').show();
										}
										strFromDate = Ext.util.Format.date(Ext.Date.parse(
														objDateParams.fieldValue1, 'Y-m-d'),
												strExtApplicationDateFormat);
										strToDate = Ext.util.Format.date(Ext.Date.parse(
														objDateParams.fieldValue2, 'Y-m-d'),
												strExtApplicationDateFormat);

										var dateFilterRefFrom = $('#balancePeriodDatePicker');
										
										if(!Ext.isEmpty(strFromDate) || !Ext.isEmpty(strToDate)){
											if (strFromDate === strToDate) {
												dateFilterRefFrom.val(strFromDate);
											} else {
												dateFilterRefFrom.datepick('setDate',[strFromDate, strToDate]);
											}
										}
										if(newValue == 'intraday')
										{
											dateFilterRefFrom.prop('disabled', true);
										}
										else
										{
											dateFilterRefFrom.prop('disabled', false);
										}
										// END - following code change for Date Picker value reset
										
										// START - following code change for Account Set dropdown list population
										if(newValue == 'intraday')
										{
											strUrl = 'services/transcationSearch/accountSetForWidgets.json?$transactionType=intraday';
										}
										else
										{
											strUrl = 'services/transcationSearch/accountSetForWidgets.json?$transactionType=previousday';
										}			
										settingsPanel.down('combobox[itemId=accSetAutoComp]').store.removeAll();
										var typeCodeStore = Ext.create('Ext.data.Store', {
											fields : ['accountSetName', 'accounts'],
											data : records
										});
										Ext.Ajax.request({
												url : strUrl,
												method : "POST",
												async : false,
												success : function(response) {
													settingsPanel.down('combobox[itemId=accSetAutoComp]').reset();
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
															settingsPanel.down('combobox[itemId=accSetAutoComp]').bindStore(typeCodeStore);
															settingsPanel.down('combobox[itemId=accSetAutoComp]').getStore().load();
														}
													}
												}
										});
										// START - following code change for Account Set dropdown list population
									}
								}
							}]
						}]
					},
					{
					xtype : 'container',
					layout : 'vbox',
					itemId : 'completDatePanel',
					cls : 'ft-padding-bottom pagesetting',
					items : [{
						xtype : 'container',
						layout : 'hbox',
						width : 300,
						autoScroll:  true,
						items : [{
									xtype : 'label',
									itemId : 'creationDateLbl',
									name : 'creationDateLbl',
									style : {
										'padding-right' : '10px !important'
									},
									text : getLabel("balancePeriod",
											"Balances Period"),
									cls : 'frmLabel',
									listeners: {
										render: function(c) {
						    	   			var tip = Ext.create('Ext.tip.ToolTip', {
										            	    target: c.getEl(),
										            	    listeners:{
										            	    	beforeshow:function(tip){
										            	    		if(creation_date_opt === null)
											            	    		tip.update('Balance Date');
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
									id : 'creationDateBtn',
									padding: '4 0 0 5',
									height : 19,
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
						itemId : 'BalancePeriod',
						layout : 'hbox',
						width: 312,
						items : [{
									xtype : 'component',
									width : '87%',
									itemId : 'creationDateDataPicker',
									filterParamName : 'EntryDate',
									html : '<input type="text"  id="balancePeriodDatePicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment" style="width: 100%;">'
								}, {
									xtype : 'component',
									itemId : 'creationDatecalendar',
									cls : 'icon-calendar t7-adjust-cal',
									margin : '1 0 0 0',
									html : '<span class=""><i class="fa fa-calendar"></i></span>'
								}]
					}]
				}, {
					xtype : 'container',
					layout : 'hbox',
					cls : 'ft-padding-bottom',
					items : [
					  {
						xtype : 'container',
						layout : 'hbox',
						items : [{
							xtype : 'container',
							layout : 'vbox',
					
							width : 300,
							items : [{
										xtype : 'container',
										itemId : 'accTypAutoComp',
										layout : 'vbox',
										width : '100%',
										items : [
							         {
											xtype : 'label',
											text : getLabel('accountSet', 'Account Set'),
											cls : 'f13 ux_font-size14 ',
											padding : '0 0 2 0'
									},
									{
										xtype : 'combo',
										itemId : 'accSetAutoComp',
										queryMode : 'local',
										tabIndex : "1",
										fieldCls : 'ux_no-border-right xn-form-field w110',
										triggerBaseCls : 'xn-form-trigger',
						                width  : (screen.width) > 1024 ? 218 : 218,
										editable : false,
										store : typeCodeStore,
										displayField : 'accountSetName',
										valueField : 'accounts',
										arrTypeCodeVal : '',
										emptyText : getLabel('all', 'All'),
										listeners : {
											select : function(combo, record, index) {
												arrTypeCodeVal = combo.getValue();
											},
											afterrender : function(combo) {
						                		arrTypeCodeVal = combo.getValue();
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
					layout : 'hbox',
					margin : '0 0 0 0',
					items : [{
							xtype : 'textfield',
							hideTrigger : true,
							labelAlign : 'top',
							labelSeparator : '',
							tabIndex : "1",
							width  : (screen.width) > 1024 ? 300 : 300,
							fieldLabel : getLabel("widgetName", "Widget Name"),
							itemId : 'customname',
							fieldCls : 'xn-form-text',
							labelCls : 'frmLabel',
							name : 'customname',
							maxLength : 40, // restrict user to enter 40 chars max
							enforceMaxLength : true,
							maskRe : /[A-Za-z0-9 .]/
						}]
				},{

					xtype : 'container',
					layout : 'hbox',
					margin : '0 0 0 0'
									
				}]
			}]
		});
		return settingsPanel;
	},
	getDateDropDownItems : function() {
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
				text : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
				btnId : 'btnQuarterToDate',
				btnValue : '9',
				handler : function(btn, opts) {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(btn.btnValue);
				}
			}]
		});
		return dropdownMenu;
	
	},
	getPreviousDate : function (strAppDate){
		var me = this;
		var objDateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var yesterdayDate = objDateHandler.getYesterdayDate(date);
		return yesterdayDate;
	},
	manageCreationDatePicker : function() {
		var me = this;
		$('#balancePeriodDatePicker').datepick({
			dateFormat : strjQueryDatePickerDateFormat,
			monthsToShow : 1,
			changeMonth : true,
			changeYear : true,
			rangeSeparator : ' to ',
			//minDate: new Date(year, month - 6, day),
			onClose : function(dates) {
				var datePickerText = $('#balancePeriodDatePicker').val();
				if (!Ext.isEmpty(dates)) {
					if(!Ext.isEmpty(datePickerText)) {
						me.dateRangeFilterVal = '13';
						me.datePickerSelectedDate = dates;
						me.dateFilterVal = me.dateRangeFilterVal;
						me.dateFilterLabel = getLabel('daterange', 'Date Range');
						me.handleDateChange(me.dateRangeFilterVal);
					} else {
						me.dateFilterVal = '';
						me.dateFilterLabel = '';
						var creationDateLbl = me.portletSettingObj.down('label[itemId="creationDateLbl"]');
						if(!Ext.isEmpty(creationDateLbl)) creationDateLbl.setText(getLabel("balancePeriod","Balances Period"));
					}
				}
			}
		});
	},	

	setSettings : function(widget, settings) {
		var isTranTypepresent = false;
		var strSqlDateFormat = 'm/d/Y';
		var strFromDate=null,strToDate = null;		
		var temp = widget.down('label[itemId="creationDateLbl"]');
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			fieldVal3 = settings[i].value3;
			operatorValue = settings[i].operator;
			var objAutoCompRef1 = null;
			var objAutoCompRef2 = null;
			if (fieldName === 'accountset') {
				//var accsRadio = widget.down('radio[inputValue="AS"]');
				//accsRadio.setValue(true);
				objAutoCompRef1 = widget
						.down('combobox[itemId=accSetAutoComp]');
				/*objAutoCompRef2 = widget
						.down('combobox[itemId=accAutoComp]');*/
				if (!Ext.isEmpty(objAutoCompRef1) && !Ext.isEmpty(fieldVal)) {
					/*objAutoCompRef1.store.add({
								"accountSetName" : fieldVal2,
								"accounts" : fieldVal
							});*/
					objAutoCompRef1.arrTypeCodeVal = fieldVal;
					objAutoCompRef1.setValue(fieldVal3);
					//objAutoCompRef2.setValue('');
				}
			}
			
			if (fieldName === 'tranType') {
				isTranTypepresent =true;
				objAutoCompRef1 = widget
						.down('combobox[itemId=tranType]');
				if (!Ext.isEmpty(objAutoCompRef1) && !Ext.isEmpty(fieldVal)) {
					objAutoCompRef1.setValue(fieldVal);
				}
			}
			
			// Balance Summary Date Set
			// Values
			if (fieldName === 'summaryFromDate') {
				var dateLabel = settings[i].dateLabel;
				var dateFilterRefFrom = $('#balancePeriodDatePicker');
				if (!Ext.isEmpty(fieldVal)) 
					strFromDate = Ext.Date.parse(fieldVal, 'Y-m-d');
				
				if (!Ext.isEmpty(dateLabel)) {
					widget.down('label[itemId="creationDateLbl"]').setText(dateLabel);
					creation_date_opt = dateLabel
				}
			}

			if (fieldName === 'summaryToDate') {
				var dateLabel = settings[i].dateLabel;
				
				var dateFilterRefFrom = $('#balancePeriodDatePicker');
				
				if (!Ext.isEmpty(fieldVal)) 
					strToDate = Ext.Date.parse(fieldVal, 'Y-m-d');
				
				if (!Ext.isEmpty(dateLabel)) {
					widget.down('label[itemId="creationDateLbl"]').setText(dateLabel);
					creation_date_opt = dateLabel
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
		// on First time Widget Setting popup, default Previous Day value should be populated.
		if(!isTranTypepresent)
		{
			var tranTypeRef = widget.down('combobox[itemId=tranType]');
			if (!Ext.isEmpty(tranTypeRef)) {
				tranTypeRef.setValue('previousday');
			}
		}
		var dateFilterRefFrom = $('#balancePeriodDatePicker');
		if(!Ext.isEmpty(strFromDate) || !Ext.isEmpty(strToDate)){
			if (strFromDate === strToDate) {
				dateFilterRefFrom.val(strFromDate);
			} else {
				dateFilterRefFrom.datepick('setDate',[strFromDate, strToDate]);
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
		/*var getCheckedBtnA = me.down('radio[inputValue="A"]').checked;
		var accAutoCompVal = me.down('combobox[itemId="accAutoComp"]')
				.getValue();
		var accAutoDispVal = me.down('combobox[itemId="accAutoComp"]')
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
		}*/

		var tranTypeRef=null,tranTypeVal=null,tranTypeDesc=null; 
		tranTypeRef = me.down('combobox[itemId="tranType"]');
		
		if(!Ext.isEmpty(tranTypeRef))
		{
			tranTypeDesc = tranTypeRef.getRawValue();
			tranTypeVal = tranTypeRef.getValue();
		}
			
		
		if (!Ext.isEmpty(tranTypeVal) 
				&& !Ext.isEmpty(tranTypeDesc)) {
			jsonArray.push({
						field : 'tranType',
						operator : 'eq',
						value1 : tranTypeVal,
						value2 : '',
						value3 : tranTypeDesc,
						dataType : 0,
						displayType : 4
					});
		}
		//var getCheckedBtnAS = me.down('radio[inputValue="AS"]').checked;
		var accSetAutoCompVal=null; 
			accSetAutoCompVal = me.down('combobox[itemId="accSetAutoComp"]').arrTypeCodeVal;
		if(Ext.isEmpty(accSetAutoCompVal))	
			accSetAutoCompVal = me.down('combobox[itemId="accSetAutoComp"]').arrAccountVal;
		var accSetAutoDispVal = me.down('combobox[itemId="accSetAutoComp"]').getRawValue();
		var accountSetData = me.down('combobox[itemId="accSetAutoComp"]').store.proxy.reader.rawData;
		if(!Ext.isEmpty(accSetAutoDispVal) && accountSetData){
			var listOfAccountSet = accountSetData;
			me.down('combobox[itemId="accSetAutoComp"]').store.each(function(record)   
			  {   
		      	if(record.get('accountSetName') === accSetAutoDispVal){
					accSetAutoCompVal = record.get('accounts');      	
				}
			  });
		}
		if (!Ext.isEmpty(accSetAutoCompVal) 
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

		var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
		var fromCreation, toCreation, creationFromDate, creationToDate;
		var datePickerText = $('#balancePeriodDatePicker').val();
		if(Ext.isEmpty(datePickerText)) {
			thisClass.dateFilterVal = '';
			thisClass.dateFilterLabel = '';
			me.down('label[itemId="creationDateLbl"]').setText(getLabel("balancePeriod","Balances Period"));
		}
		var index = thisClass.dateFilterVal;
		var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
		var objDateParams = thisClass.getDateParam(index);
		
		if (!Ext.isEmpty(objDateParams.fieldValue1)) {
			jsonArray.push({
						field : 'summaryFromDate',
						operator : 'eq',
						value1 : Ext.util.Format
								.date(objDateParams.fieldValue1, 'Y-m-d'),
						dateLabel : dateLabel,
						dateLabelwidget :dateLabel.substring(dateLabel.indexOf("(")+1,dateLabel.indexOf(")")),
						dataType : 'D',
						displayType : index,
						btnValue : objDateParams.btnValue
					});
		}
		if (!Ext.isEmpty(objDateParams.fieldValue2)) {
			jsonArray.push({
						field : 'summaryToDate',
						operator : 'eq',
						value1 : Ext.util.Format.date(objDateParams.fieldValue2, 'Y-m-d'),
						dateLabel : dateLabel,
						dateLabelwidget :dateLabel.substring(dateLabel.indexOf("(")+1,dateLabel.indexOf(")")),
						dataType : 'D',
						displayType : index
					});
		}

		return jsonArray;
	},

	getDataPanel : function() {
		return this;
	},
	accountStore : function(){
		// Define autocomplete model
		Ext.define('accountModel', {
		    extend: 'Ext.data.Model',
		    fields: [
		       'accountName', 'accountId', 'accountNumber'
		    ]
		});
		// store auto complete
		var autoCompleteStore = Ext.create('Ext.data.Store', {
		    model: accountModel,
		    autoLoad: true,
		    proxy: {
		        type: 'ajax',
		        url: 'services/balancesummary/btruseraccountsforwidgets.json?$top=-1',
		        reader: {
		            type: 'json',
		            root: 'd.btruseraccount'
		        }
		    }
		});
		return autoCompleteStore;
	},
	
	accountSetStore : function(){
		// Define autocomplete model
		Ext.define('accountSetModel', {
		    extend: 'Ext.data.Model',
		    fields: [
		       'accountSetName', 'accounts'
		    ]
		});
		// store auto complete
		var autoCompleteSetStore = Ext.create('Ext.data.Store', {
		    model: accountSetModel,
		    autoLoad: true,
		    proxy: {
		        type: 'ajax',
		        url: 'services/transcationSearch/accountSetForWidgets.json?$top=-1',
		        actionMethods : 'POST',
		        reader: {
		            type: 'json',
		            root: 'd.userAccount'
		        }
		    }
		});
		return autoCompleteSetStore;
	}
});