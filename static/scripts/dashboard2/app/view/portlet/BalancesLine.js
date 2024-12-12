Ext.define('Cashweb.view.portlet.BalancesLine', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.balancesline',
	requires : ['Cashweb.store.BalancesLineStore'],
	cols : 2,
	border : false,
	animate : false,
	shadow : false,
	height:336,
	margin : '0 0 0 0',
	dateFilterLabel : getLabel("balancePeriod","Balances Period")+"("+getLabel('thismonth', 'This Month')+")",
	accountFilter : '',
	summaryFromDateFilter : '',
	summaryToDateFilter : '',
	filterValue : '',
	selectValue : '',
	ccyCode : '',
	minHeight : 185,
	dateHandler : null,
	arrAccountsIdJson : [],
	arrAccountsJson : [],
	arrAccountsDesc : [],
	arrAccountDispJson : [],
	groupBy : 'D',
	navFilter : '',
	filterRestrict : btrFilterDays,
	enableQueryParam : false,
	balance_line_period_opt : null,
	titleId : '',
	datePickerCreatedDate : [],
	portletref : null,
	amountArr : [],
	initComponent : function() {
		var me = this;
		me.emptyText = label_map.noDataFound;
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
			var record = me.record;
			var settings = record.data.settings || [];
			var filterUrl = '', accountPresentFlag = false, typeCodePresent = false, isSummarydatePresent = false;
			for (var i = 0; i < settings.length; i++) {
				if (settings[i].field === 'account') {
					accountPresentFlag = true;
				}
				if (settings[i].field === 'summaryTypeCodes') {
					typeCodePresent = true;
				}
				if (settings[i].field === 'summaryDate') {
					isSummarydatePresent = true;
					me.datePickerCreatedDate[0]=Ext.Date.parse(settings[i].value1, 'Y-m-d');
					me.datePickerCreatedDate[1]=Ext.Date.parse(settings[i].value2, 'Y-m-d');
					me.dateFilterVal = settings[i].btnValue;
				}
			}
			if (!isSummarydatePresent)
			{
					var objDateParams = me.getDateParam("5", null);
					vFromDate = $.datepick.formatDate(strApplDateFormat.toLowerCase(), 
					$.datepick.parseDate('yyyy-mm-dd', objDateParams.fieldValue1));
					vToDate = $.datepick.formatDate(strApplDateFormat.toLowerCase(), $.datepick.parseDate('yyyy-mm-dd', objDateParams.fieldValue2));
                          settings.push({
								field : 'summaryDate',
								operator : (!Ext.isEmpty(vToDate)) ? 'bt' : 'eq',
								value1 : Ext.util.Format.date(vFromDate, 'Y-m-d'),
								value2 : Ext.util.Format.date(vToDate, 'Y-m-d'),
								dateLabel : getLabel("balancePeriod","Balances Period")+"("+getLabel('thismonth', 'This Month')+")",
								dataType : 'D',
								displayType : 5,
								btnValue : "5"
							});
							me.record.set('settings', settings);
					}
			if (!accountPresentFlag || !typeCodePresent) {
				if (!accountPresentFlag) {
					me.fetchAccounts(typeCodePresent);
				} else if (accountPresentFlag && !typeCodePresent) {
					me.fetchTypecodes(settings);
				}
			} else {
				var record = me.record;
				if (!Ext.isEmpty(record.get('settings'))) {
					settings = record.get('settings');
				}
				filterUrl = me.generateUrl(settings);
				me.ajaxRequest(filterUrl, settings);
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
								itemId : 'balancesLinePanel',
								autoHeight : true,
								items : [{
											xtype : 'panel',
											itemId : 'chartBalancesLinePanel',
											items : []
										}]
							},
							{
								layout : {
									type : 'vbox',
									align : 'center'
								},
								items : [{
										xtype : 'label',
										cls : 'font_normal',
										align : 'center',
										itemId : 'typeCodeLabel'
									}]
							}]
				});
		Ext.define('Ext.ux.chart.LegendItem.Unclickable', {
			override : 'Ext.chart.LegendItem',
			onMouseDown : function() {
				if(this.legend.clickable !== false)
				{
					var navSettings = me.record.get('settings');
					me.navFilter = me.navFilter
							+ "&$summaryType=previousday&$eqCurrency=USD&$serviceType=BR_STD_SUMM_GRID&$serviceParam=BR_GRIDVIEW_GENERIC";
					if (me.navFilter.indexOf('$accountID') == -1)
						me.navFilter = me.navFilter + "&$accountID=ALL";
					if (me.navFilter.indexOf('$filterValue') != -1)
						me.navFilter = me.navFilter + "&$filterOn=FAC";
					else
						me.navFilter = me.navFilter + "&$filterOn=&$filterValue=";

					if (Ext.isEmpty(navSettings)
							|| JSON.stringify(navSettings) === '{}')
						navSettings = [];
					//me.fireEvent('seeMoreBalanceRecords', me.navFilter,navSettings);
				}
			}
		});
		me.callParent(arguments);
	},
	fetchAccounts : function(typeCodePresent) {
		var me = this;
		var accountNo = '', accountDesc = '', settings = [], filterUrl = '', accounDispValues = '';
		Ext.Ajax.request({
					url : 'services/balancesummary/btruseraccountsforwidgets.json',
					method : 'POST',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.btruseraccount;
						if (undefined != data && data.length!=0) {
							var length = (data.length <= 3) ? data.length : 3;
							for (var j = 0; j < length; j++) {
								accountNo += data[j].accountId + '|';
								accountDesc += data[j].accountName + '|';
								accounDispValues += data[j].accountName + ":"
										+ data[j].accountNumber + '|';

							}
							accountNo = accountNo.substring(0,
									(accountNo.length - 1));
							accounDispValues = accounDispValues.substring(0,
									(accounDispValues.length - 1));
							accountDesc = accountDesc.substring(0,
									(accountDesc.length - 1));
						}
						var record = me.record;
						if (!Ext.isEmpty(record.get('settings'))) {
							settings = record.get('settings');
						}
						var accountsName = accounDispValues.split('|');
						var accountsNamedesc = ''; 
						for(var a=0;a<accountsName.length;a++)
						{
							 accountsNamedesc +=accountsName[a].split(':')[0]+'|';
						}	
						accountsNamedesc = accountsNamedesc.substring(0,(accountsNamedesc.length - 1))
						// Account No
						if (!Ext.isEmpty(accountNo)) {
							settings.push({
										field : 'account',
										operator : 'eq',
										value1 : accountNo,
										value2 : accountDesc,
										value3 : accounDispValues,
										value4 : accountsNamedesc,
										dataType : 0,
										displayType : 6
									});

						}
						if (typeCodePresent) {
							filterUrl = me.generateUrl(settings);
							me.ajaxRequest(filterUrl, settings);
						} else
							me.fetchTypecodes(settings);
					},
					failure : function() {
					}
				});
	},
	fetchTypecodes : function(settings) {
		var me = this;
		var filterUrl = '';
		Ext.Ajax.request({
					url : 'services/getSummaryTypecodes.json',
					method : 'POST',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.summary;
						var record = me.record;
						if (!Ext.isEmpty(record.get('settings'))) {
							settings = record.get('settings');
						}
						if (!Ext.isEmpty(data) && !Ext.isEmpty(data[0].fieldName)) {
							settings.push({
										field : 'summaryTypeCodes',
										operator : 'eq',
										value1 : data[0].fieldName,
										value2 : data[0].fieldLabel,
										dataType : 0,
										displayType : 6
									});
						}
						filterUrl = me.generateUrl(settings);
						me.ajaxRequest(filterUrl, settings);
					},
					failure : function() {
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
					text : getLabel('daterange','Date Range'),
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
	getDateDropDownItems : function(){
		var me = this;
		var intFilterDays = me.filterRestrict;
		var arrMenuItem = Ext.create('Ext.menu.Menu', {
			itemId : 'DateMenu',
			cls : 'ext-dropdown-menu'
		});
		
		arrMenuItem.add({
			text : getLabel('latest', 'Latest'),
			btnId : 'btnLatest',
			parent : me,
			btnValue : '12',
			handler : function(btn, opts) {
				me.dateFilterVal = btn.btnValue;
				me.dateFilterLabel = btn.text;
				me.handleDateChange(me.portletref, btn.btnValue);
				me.datedrdownChange = true;
				me.portletref.down('button[itemId="creationDateBtn"]').focus();
			}
		});
		if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			arrMenuItem.add({
				text : getLabel('yesterday', 'Yesterday'),
				btnId : 'btnYesterday',
				btnValue : '2',
				handler : function(btn, opts) {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(me.portletref, btn.btnValue);
					me.datedrdownChange = true;
					me.portletref.down('button[itemId="creationDateBtn"]').focus();
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
					me.handleDateChange(me.portletref, btn.btnValue);
					me.datedrdownChange = true;
					me.portletref.down('button[itemId="creationDateBtn"]').focus();
				}
			});
		if (intFilterDays >= 14 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
				text : getLabel('lastweekToYesterday', 'Last Week To Yesterday'),
				btnId : 'btnLastweek',
				parent : me,
				btnValue : '4',
				handler : function(btn, opts) {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(me.portletref, btn.btnValue);
					me.datedrdownChange = true;
					me.portletref.down('button[itemId="creationDateBtn"]').focus();
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
					me.handleDateChange(me.portletref, btn.btnValue);
					me.datedrdownChange = true;
					me.portletref.down('button[itemId="creationDateBtn"]').focus();
				}
			});
		if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
				text : getLabel('lastMonthToYesterday', 'Last Month To Yesterday'),
				btnId : 'btnLastmonth',
				btnValue : '6',
				parent : me,
				handler : function(btn, opts) {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(me.portletref, btn.btnValue);
					me.datedrdownChange = true;
					me.portletref.down('button[itemId="creationDateBtn"]').focus();
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
					me.handleDateChange(me.portletref, btn.btnValue);
					me.datedrdownChange = true;
					me.portletref.down('button[itemId="creationDateBtn"]').focus();
				}
			});
		if (intFilterDays >= 180 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
				text : getLabel('lastQuarterToYesterday',
						'Last Quarter To Yesterday'),
				btnId : 'btnQuarterToDate',
				btnValue : '9',
				parent : me,
				handler : function(btn, opts) {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(me.portletref, btn.btnValue);
					me.datedrdownChange = true;
					me.portletref.down('button[itemId="creationDateBtn"]').focus();
				}
			});
		if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
			arrMenuItem.add({
							text : getLabel('thisyear', 'This Year'),
							btnId : 'btnLastQuarterToDate',
							btnValue : '10',
							handler : function(btn, opts) {
								me.dateFilterVal = btn.btnValue;
								me.dateFilterLabel = btn.text;
								me.handleDateChange(me.portletref, btn.btnValue);
								me.datedrdownChange = true;
								me.portletref.down('button[itemId="creationDateBtn"]').focus();
							}
					});
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.add({
							text : getLabel('lastYearToYesterday', 'Last Year To Yesterday'),
							btnId : 'btnYearToDate',
							btnValue : '11',
							handler : function(btn, opts) {
								me.dateFilterVal = btn.btnValue;
								me.dateFilterLabel = btn.text;
								me.handleDateChange(me.portletref, btn.btnValue);
								me.datedrdownChange = true;
								me.portletref.down('button[itemId="creationDateBtn"]').focus();
							}
					});
		return arrMenuItem;
	},	
	addDateContainerPanel : function(dateParentPanel, portletSettings) {
		var me = this;
		var dateContainerPanel = Ext.create('Ext.panel.Panel', {
			layout : 'hbox',
			items : [{
				xtype : 'container',
				itemId : 'dateRangeComponent',
				layout : 'hbox',
				hidden : false,
				items : [{
							xtype : 'component',
							width : '225px',
							margin : '0 0 0 0',//Top Right Bottom Left
							itemId : 'entryDatePickerQuick',
							filterParamName : 'EntryDate',
							endDateField : 'toDate',
							format : !Ext.isEmpty(strExtApplicationDateFormat)
							? strExtApplicationDateFormat
							: 'm/d/Y',
							startDateField : 'fromDate',
							html : '<input type="text"  id="entryDatePickerQuickText" tabIndex="1" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
						},{
							itemId : 'entryDateFaFaCalender',
							xtype : 'component',
							margin : '1 0 0 -10',//Top Right Bottom Left
							cls : 'icon-calendar',
							html : '<span class=""><i class="fa fa-calendar"></i></span>'
						}]
			}]
		});
		dateParentPanel.add(dateContainerPanel);
		portletSettings.down('container[itemId="completDatePanel"]')
				.add(dateParentPanel);
	},
	getPreviousDate : function (strAppDate){
		var me = this;
		var objDateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var yesterdayDate = objDateHandler.getYesterdayDate(date);
		return yesterdayDate;
	},	
	handleDateChange : function(portlet2, index) {
		var me = this;
		var objDateParams = me.getDateParam(index, null);
		var datePickerRef = $('#entryDatePickerQuickText');
		var vFromDate = null;
		var vToDate = null;
		if(index === '7')
		{
			objDateParams = me.getDateParamForDateRange(index, null);
		}	
		else
		{
			objDateParams = me.getDateParam(index, null);			
		}
		$('#entryDatePickerQuickText').datepick({
			monthsToShow : 1,
			changeMonth : true,
			changeYear : true,
			maxDate : me.getPreviousDate(dtSellerDate),
			dateFormat : strApplDateFormat.toLowerCase(),
			rangeSeparator : '  to  ',
			onClose : function(dates) {
				if (!Ext.isEmpty(dates)) {
					me.dateFilterVal = '13';
					me.datePickerCreatedDate = dates;
					me.dateFilterLabel = getLabel('daterange','Date Range');
					var dtParams = me.getDateParamForDateRange(me.dateFilterVal, dates[0],dates[1]);
					me.dateFilterFromVal = dtParams.fieldValue1;
					me.dateFilterToVal = dtParams.fieldValue2;
					balance_line_period_opt = getLabel("balancePeriod", "Balance Period") + ' (' + me.dateFilterLabel + ')';
					widget.down('label[itemId="creationDateLbl"]').setText(balance_line_period_opt);
				}
			}
		}).show();
		
		var vFromDate = Ext.Date.parse(
				objDateParams.fieldValue1, 'Y-m-d');
		var vToDate = Ext.Date.parse(
				objDateParams.fieldValue2, 'Y-m-d');
			
		var fromDateLabel = portlet2.down('label[itemId="dateFilterFrom"]');
		var toDateLabel = portlet2.down('label[itemId="dateFilterTo"]');
		fromDateLabel.addCls("label-font-normal");
		toDateLabel.addCls("label-font-normal");
		
		if (!Ext.isEmpty(me.dateFilterLabel)) 
		{
			balance_line_period_opt = getLabel("balancePeriod", "Balance Period") + " (" + me.dateFilterLabel + ")";
			portlet2.down('label[itemId="creationDateLbl"]').setText(balance_line_period_opt);
		}
		var datePickerRef = $('#entryDatePickerQuickText');
		
		portlet2.down('container[itemId="dateRangeComponent"]').show();
		if(vFromDate != '' && vToDate != '')
			datePickerRef.datepick('setDate', [vFromDate, vToDate]);
		else if(vFromDate != ''  && vToDate == '')
			datePickerRef.datepick('setDate', vFromDate);
		me.datePickerCreatedDate = datePickerRef.datepick('getDate');		
		
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
		if(index != '2')
			date = objDateHandler.getYesterdayDate(date);		
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var latest_to_date = objDateHandler.getYesterdayDate(new Date(Ext.Date.parse(to_date_btr, dtFormat)));
		var retObj = {};
		var dtJson = {};
		switch (index) {
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
			  //  var toDate = new Date(Ext.Date.parse(to_date_btr, dtFormat));		
				 
				fieldValue1 = Ext.Date.format(
							fromDate,
							strSqlDateFormat);
				fieldValue2 = Ext.Date.format(
						latest_to_date,
							strSqlDateFormat);
				operator = 'bt';
				break;
			case '13' :
				// Date Range
				if(!isEmpty(me.datePickerCreatedDate)){
				if (me.datePickerCreatedDate.length == 1) {
					fieldValue1 = Ext.Date.format(me.datePickerCreatedDate[0],
							strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'eq';
				} else if (me.datePickerCreatedDate.length == 2) {
					fieldValue1 = Ext.Date.format(me.datePickerCreatedDate[0],
							strSqlDateFormat);
					fieldValue2 = Ext.Date.format(me.datePickerCreatedDate[1],
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
	ajaxRequest : function(filterUrl, settings) {
		var obj;
		var me = this;
		me.setTitle(settings);
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = filterUrl || {}, arrMatches;
		if (me.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(filterUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
		}
		Ext.Ajax.request({
					url : 'services/getBalanceLineChartData.json',// strUrl,
					method : 'POST',
					params : objParam,
					success : function(response) {
						obj = Ext.decode(response.responseText);
						if (Ext.isEmpty(obj.summary)) {
							me.down('label[itemId=errorLabel]').show();
							me.down('panel[itemId=balancesLinePanel]').hide();
							me.down('label[itemId="typeCodeLabel"]').hide();
							me.getTargetEl().unmask();
						} else {
							me.down('label[itemId=errorLabel]').hide();
							me.down('panel[itemId=balancesLinePanel]').show();
							me.down('label[itemId="typeCodeLabel"]').show();
							me.loadData(obj);
						}
						if (Ext.isEmpty(me.ccyCode))
							me.ccyCode = obj.currency;
						me.setLoading(false);
						me.setRefreshLabel(0);
					},
					failure : function(response) {
						me.getTargetEl().unmask();
						me.setLoading(false);
						
					}
				});

	},
	loadData : function(data) {
		var me = this;
		var storeData = [], strCategory = "";
		var arrData = data.summary;
		var k = 0;
		if (!Ext.isEmpty(arrData)) {
			var arrCount = 0;
			for (var i = 0; i < arrData.length; i = i + k) {
				var colJson = {}, arrAccDisplayValues = [];
				if (arrData[i]) {
					var date = arrData[i].Date;
					colJson["Date"] = arrData[i].Date;
					colJson["Currency"] = data.ccy_symbol;
					var arrSingleDateJson = [];
					for (var j = 0; j < arrData.length; j++) {
						if (arrData[j].Date === date) {
							arrSingleDateJson.push(arrData[j]);
						}
					}
					for (k = 0; k < arrSingleDateJson.length; k++) {
						if (undefined != arrSingleDateJson[k]
								&& arrSingleDateJson[k].AccountId === me.arrAccountsIdJson[0]
								&& undefined != arrSingleDateJson[k].Amount) {
							colJson["ColumnVamt"] = arrSingleDateJson[k].Amount;	
							if(arrSingleDateJson[k].Amount!=null)
							{	
							colJson["ColumnV"] = Math
									.ceil(arrSingleDateJson[k].Amount.split(',').join(''));
							}
						}
						if (undefined != arrSingleDateJson[k]
								&& arrSingleDateJson[k].AccountId === me.arrAccountsIdJson[1]
								&& undefined != arrSingleDateJson[k].Amount) {
							colJson["ColumnWamt"] = arrSingleDateJson[k].Amount;
							if(arrSingleDateJson[k].Amount!=null)
							{	
							colJson["ColumnW"] = Math
									.ceil(arrSingleDateJson[k].Amount.split(',').join(''));
							}
						}
						if (undefined != arrSingleDateJson[k]
								&& arrSingleDateJson[k].AccountId === me.arrAccountsIdJson[2]
								&& undefined != arrSingleDateJson[k].Amount) {
							colJson["ColumnXamt"] = arrSingleDateJson[k].Amount;
							if(arrSingleDateJson[k].Amount!=null)
							{
								colJson["ColumnX"] = Math
										.ceil(arrSingleDateJson[k].Amount.split(',').join(''));
								 if(Ext.isEmpty(me.amountArr))
								 {
								 	me.amountArr[arrCount] = colJson["ColumnX"];
								 	arrCount++;
								 }
								 else if(!Ext.isEmpty(me.amountArr) && !me.amountArr.includes(colJson["ColumnX"]) )
								 {
								 	me.amountArr[arrCount] = colJson["ColumnX"];
								 	arrCount++;
								 }							
							}
						}
					}
				}
				storeData.push(colJson);
			}
		}
		if (storeData.length > 0) {
			var barChart = me.createLineChart(storeData, arrAccDisplayValues);
			var lineChartPanel = me
					.down('panel[itemId=chartBalancesLinePanel]');
			lineChartPanel.removeAll();
			lineChartPanel.add(barChart);
			me.doLayout();
		}
		me.getTargetEl().unmask();
		me.setLoading(false);
	},
	createLineChart : function(storeData, arrAccDisplayValues) {
		var thisClass = this, chart;
		var lineChartStore = new Cashweb.store.BalancesLineStore();
		lineChartStore.removeAll();
		lineChartStore.loadData(storeData);
		thisClass.navStore = lineChartStore;
		var mfloor = Math.floor;
		var titleV, titleW, titleX;
		titleV = thisClass.arrAccountDispJson[0];
		titleW = thisClass.arrAccountDispJson[1];
		titleX = thisClass.arrAccountDispJson[2];

		chart = Ext.create('Ext.chart.Chart', {
					border : false,
					animate : false,
					shadow : false,
					minWidth : 560,
					height : 300,
					store : lineChartStore,
					legend : {
						position : 'right',
						boxStrokeWidth : 0,
						boxFill : '#f9f9f9',
						clickable : false,
					    createItems: function() {
					        var me = this,
					            seriesItems = me.chart.series.items,
					            items = me.items,
					            fields, i, li, j, lj, series, item;

					        //remove all legend items
					        me.removeItems();
					        
					        // Create all the item labels
					        for (i = 0, li = seriesItems.length; i < li; i++) {
					            series = seriesItems[i];
					            
					            if (series.showInLegend && !Ext.isEmpty(series.title)) {
					                fields = [].concat(series.yField);
					                for (j = 0, lj = fields.length; j < lj; j++) {
					                    item = me.createLegendItem(series, j);
					                    items.push(item);
					                }
					            }
					        }
					        
					        me.alignItems();
					    }
					},
					axes : [{
								type : 'Numeric',
								position : 'left',
								fields : ['ColumnV', 'ColumnW', 'ColumnX'],
								majorTickSteps : 3,
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
								minimum : 0
							}, {
								type : 'Category',
								position : 'bottom',
								fields : ['Date'],
								dashSize : 0,
								majorTickSteps : 3,
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
									rotate : {
										degrees : 315
									}
								}
							}],
					series : [{
								type : 'line',
								highlight : {
									size : 10,
									radius : 7
								},
								tips: {
								
									trackMouse: true,
									layout: 'fit',
									bodyStyle : {
										background : '#ffffff',
										color : 'black',
										padding : '10px',
										'font-size' : '16px',
										'font-family' : 'Arial'
									},
									renderer: function (storeItem, item) {
										this.update("Balance:"+item.storeItem.raw.Currency+" "+item.storeItem.raw.ColumnVamt);
									}
								},
								fill : false,
								axis : 'left',
								xField : 'Date',
								yField : 'ColumnV',
								showMarkers : true,
								style : {
									stroke : '#115fa6',
									'stroke-width' : 3,
									fill : '#115fa6'
								},
								markerConfig : {
									type : 'circle',
									size : 4,
									radius : 5,
									stroke : '#115fa6',
									'fill' : '#115fa6'

								},
								title : titleV
							}, {
								type : 'line',
								highlight : {
									size : 10,
									radius : 7
								},
								tips: {
									trackMouse: true,
									layout: 'fit',
									bodyStyle : {
										background : '#ffffff',
										color : 'black',
										padding : '10px',
										'font-size' : '16px',
										'font-family' : 'Arial'
									},
									renderer: function (storeItem, item) {
										this.update("Balance:"+item.storeItem.raw.Currency+" "+item.storeItem.raw.ColumnWamt);
										
									}
								},
								fill : false,
								axis : 'left',
								xField : 'Date',
								yField : 'ColumnW',
								showMarkers : true,
								markerConfig : {
									type : 'circle',
									size : 4,
									radius : 5,
									stroke : '#94ae0a',
									'fill' : '#94ae0a'
								},
								style : {
									stroke : '#94ae0a',
									'stroke-width' : 3,
									fill : '#94ae0a'
								},
								title : titleW
							}, {
								type : 'line',
								highlight : {
									size : 10,
									radius : 7
								},
								tips: {
									trackMouse: true,
									layout: 'fit',
									bodyStyle : {
										background : '#ffffff',
										color : 'black',
										padding : '10px',
										'font-size' : '16px',
										'font-family' : 'Arial'
									},
									renderer: function (storeItem, item) {
										this.update("Balance:"+item.storeItem.raw.Currency+" "+item.storeItem.raw.ColumnXamt);
									}
								},
								axis : 'left',
								fill : false,
								xField : 'Date',
								yField : 'ColumnX',
								showMarkers : true,
								markerConfig : {
									type : 'circle',
									size : 4,
									radius : 5,
									stroke : '#A61120',
									'fill' : '#A61120'
								},
								style : {
									stroke : '#A61120',
									'stroke-width' : 3,
									fill : '#A61120'
								},
								title : titleX
							}]
				});
		return chart;
	},
	generateUrl : function(settings) {
		var me = this;
		var ccyPresent = false, accountTypePresent = false;
		var arrAccountsJson = [];
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {
				if (settings[index].field != 'customname') {
					if (settings[index].field === 'account') {
						me.accountFilter = settings[index].value1;
						me.arrAccountsIdJson = settings[index].value1.split('|');
						me.arrAccountsJson = settings[index].value2.split('|');
						if(settings[index].value4!=undefined)
							me.arrAccountsDesc = settings[index].value4.split('|');						
						if(!Ext.isEmpty(settings[index].value3))
							me.arrAccountDispJson = settings[index].value3.split('|');
						me.accountNo = settings[index].value1;
						me.accountDesc = settings[index].value2;
						continue;
					}
					if (settings[index].field === 'summaryDate' )
					{
						me.summaryFromDateFilter = settings[index].value1;
						if (!Ext.isEmpty(settings[index].value2))
						{
							me.summaryToDateFilter = settings[index].value2;
							datePresent = true;
							continue;
						}
						datePresent = true;
						continue;
					}
					if (settings[index].field === 'accountType') {
						me.filterValue = settings[index].value1;
						accountTypePresent = true;
						continue;
					}

					if (settings[index].field === 'summaryTypeCodes') {
						me.selectValue = settings[index].value1;
						continue;
					}
					if (settings[index].field === 'ccy') {
						if (!Ext.isEmpty(settings[index].value1)) {
							me.ccyCode = settings[index].value1;
							ccyPresent = true;
						}
						continue;
					}
				}
			}
			if (!ccyPresent)
				me.ccyCode = '';
			if (!accountTypePresent)
				me.filterValue = '';
		}
		var strUrl = '';
		if(me.accountNo== undefined)
		{
		 me.accountNo="";
		}
		strUrl = strUrl + '&$summaryFromDate=' + me.summaryFromDateFilter;
		strUrl = strUrl + '&$summaryToDate=' + me.summaryToDateFilter;
		if (!Ext.isEmpty(me.accountFilter))
			strUrl = strUrl + '&$accountID=' + me.accountFilter;
		else
		{
			if(Ext.isEmpty(me.accountNo))
				me.accountNo = 0;
			strUrl = strUrl + '&$accountID=' + me.accountNo;
		}
		if (!Ext.isEmpty(me.filterValue))
			strUrl = strUrl + '&$filterValue=' + me.filterValue;
		if (!Ext.isEmpty(me.selectValue))
			strUrl = strUrl + '&$select=' + me.selectValue;
		if (!Ext.isEmpty(me.ccyCode))
			strUrl = strUrl + '&$ccy=' + me.ccyCode;
		me.navFilter = strUrl.split('&$select=')[0];
		me.navFilter = me.navFilter.split('?')[1];
		return strUrl;
	},
	// Accounts field handling starts
	addaccountsMenu : function(summaryPortlet) {
		var me = this;
		Ext.Ajax.request({
					url : 'services/balancesummary/btruseraccountsforwidgets.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.btruseraccount;
						var fieldData = [];
						for (var i = 0; i < data.length; i++) {
							var record = {};
							record.dispValue = data[i].accountName +" | "+data[i].accountNumber;
							record.fieldLabel = data[i].accountName;
							record.fieldName = data[i].accountId;
							record.fieldDesc = data[i].accountName + ":"
									+ data[i].accountNumber;
							fieldData.push(record);
						}
						me.loadAccountsMenu(summaryPortlet, fieldData);
					},
					failure : function() {
						// console.log("Error Occured - Addition
						// Failed");
					}
				});
	},
	loadAccountsMenu : function(summaryPortlet, data) {
		var me = this;
		var menuRef = summaryPortlet.down('menu[itemId="accountsMenu"]');
		var accountsTextField = summaryPortlet
				.down('textfield[itemId="accounts"]');
		var accounts = '', accountsDesc = '';
		var checkCount = 0;
		if (!Ext.isEmpty(data)) {
			if (!Ext.isEmpty(menuRef)) {
				if (menuRef.items.length > 0) {
					menuRef.removeAll();
				}
			}
			var count = data.length;
			if (count > 0) {
				for (var index = 0; index < count; index++) {
					var checkedFlag = false;
					if (index < 3)
						checkedFlag = true;
					menuRef.add({
								xtype : 'menucheckitem',
								text : data[index].dispValue,
								accountNo : data[index].fieldName,
								acountDesc : data[index].fieldDesc,
								checked : checkedFlag,
								tooltip :data[index].dispValue,
								disabled : !checkedFlag,
								listeners : {
									checkchange : function(item, checked) {
										me.updateAccountsTextField(
												summaryPortlet, menuRef, item,
												checked);
									}
								}
							});

					if (checkedFlag) {
						checkCount++;
						accounts += data[index].fieldName + '|';
						accountsDesc += data[index].fieldLabel + '|';
						me.updateAccountsTextField(summaryPortlet, menuRef,
								null, true);
					}
				}
				accounts = accounts.substring(0, (accounts.length - 1));
				accountsDesc = accountsDesc.substring(0,
						(accountsDesc.length - 1));
				me.accountFilter = accounts;
				me.accountsDesc = accountsDesc;
				accountsTextField.setValue('');
				if(checkCount == 0)
					accountsTextField.setValue("Select Options");
				else if(checkCount > 0)
					accountsTextField.setValue(checkCount+" selected");
				//accountsTextField.setValue(accountsDesc);
				accountsTextField.accountNoData = accounts;
			}
		}
	},
	updateAccountsTextField : function(summaryPortlet, menuRef, item, checked) {
		var me = this;
		if (!Ext.isEmpty(menuRef)) {
			var itemArray = menuRef.items.items;
			var itemArrayLength = itemArray.length;
			var accountTextField = summaryPortlet
					.down('textfield[itemId="accounts"]');
			var textFieldData = '';
			var accountNoData = '';
			var accountDisplayData = '';
			var arrAccountsJson = [], arrAccountDispJson = [];
			var checkedCount = 0;
			if (checked) {
				var count = 1;
				for (var index = 0; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						var code = itemArray[index].accountNo;
						var desc = itemArray[index].text;
						var dispValue = itemArray[index].acountDesc;
						arrAccountsJson.push(dispValue);
						arrAccountDispJson.push(desc);
						textFieldData += itemArray[index].text + '|';
						accountNoData += itemArray[index].accountNo + '|';
						accountDisplayData += itemArray[index].acountDesc + '|';
						count++;
						checkedCount++;
					}
				}

			} else if (!checked) {
				for (var index = 0; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						var code = itemArray[index].accountNo;
						var desc = itemArray[index].text;
						var dispValue = itemArray[index].acountDesc;
						arrAccountsJson.push(dispValue);
						arrAccountsJson.push(desc);
						textFieldData += itemArray[index].text + '|';
						accountNoData += itemArray[index].accountNo + '|';
						accountDisplayData += itemArray[index].acountDesc + '|';
						checkedCount++;
					}
				}
			}
			me.arrAccountsJson = arrAccountsJson;
			me.arrAccountDispJson = arrAccountDispJson;
			if (count > 3) {
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
			var commaSeparatedPrdCodes = accountNoData.substring(0,
					(accountNoData.length - 1));
			var commaSeparatedAccDispVal = accountDisplayData.substring(0,
					(accountDisplayData.length - 1));

			accountTextField.setValue('');
			if(checkedCount == 0)
				accountTextField.setValue("Select Options");
			else if(checkedCount > 0)
				accountTextField.setValue(checkedCount+" selected");
			//accountTextField.setValue(commaSeparatedString);
			accountTextField.accountNoDispData = commaSeparatedString;
			accountTextField.accountNoData = commaSeparatedPrdCodes;
			accountTextField.accountDisplayData = commaSeparatedAccDispVal;

		}
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
					width  : (screen.width) > 1024 ? 820 : 820,
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
								text : getLabel("cancel","Cancel"),
								//cls : 'ux-button-s ft-button-secondary footer-btns',
								handler : function() {
									this.up('window').close();
								}
							}, '->', {
								text : getLabel("save","Save"),
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
		if (!Ext.isEmpty(me.ccyCode)) {
			var ccyField = portletSettings
					.down('AutoCompleter[itemId="Currency"]');
			if (!Ext.isEmpty(ccyField)) {
				ccyField.setValue(me.ccyCode);
			}
		}
		portletSettings.show();
		me.portletref=portletSettings;
		me.addDatePanel(portletSettings);
		me.addaccountsMenu(portletSettings);
		me.setSettings(portletSettings, me.record.get('settings'));
		portletSettings.down('button[itemId="creationDateBtn"]').focus();
	},
	setTitle : function(settings) {
		var me = this;
		var selectedTypeCodeDesc = "", widgetName = "";
		for (var i = 0; i < settings.length; i++) {
			var fieldName = settings[i].field;
			var fieldVal = settings[i].value1;
			var fieldVal2 = settings[i].value2;
			if (fieldName === 'customname'
					&& !Ext.isEmpty(fieldVal)) {
				widgetName = fieldVal;
			} else if (fieldName === 'summaryTypeCodes') {
				selectedTypeCodeDesc = fieldVal2;
			}
		}
		widgetName = (!Ext.isEmpty(widgetName) ? widgetName
				: label_map[me.record.get('widgetCode')
						.toLowerCase()]);
		me.up('panel').setTitle(
				widgetName
						+ '<span id=' + me.titleId
						+ '>&nbsp;&nbsp;</span>');
		me.down('label[itemId="typeCodeLabel"]').setText(selectedTypeCodeDesc);
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
											'colDesc' : getLabel('all','All')
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'colId' : data[index].SUB_FACILITY_CODE,
									'colDesc' : getLabel(data[index].SUB_FACILITY_CODE,data[index].SUB_FACILITY_DESC)
								}
								accountTypeStore.add(record);
							}
						}
					},
					failure : function() {
					}
				});
		var typeCodeStore = Ext.create('Ext.data.Store', {
					fields : ['colId', 'colDesc']
				});
		Ext.Ajax.request({
					url : 'services/getSummaryTypecodes.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.summary;
						if (typeCodeStore) {
							typeCodeStore.removeAll();
							var count = data.length;
							for (var index = 0; index < count; index++) {
								var record = {
									'colId' : data[index].fieldName,
									'colDesc' : data[index].fieldLabel
								}
								typeCodeStore.add(record);
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
				cls : 'ft-padding-bottom',
				layout : 'column',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'vbox',
					itemId : 'completDatePanel',
					//flex : 0.38,
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-right',
					items : [{
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'creationDateLbl',
									name : 'creationDateLbl',
									text : getLabel("balancePeriod",
											"Balance Period"),
									cls : 'widget_date_menu',
									//labelCls : 'frmLabel',
									listeners: {
									       render: function(c) {
									    	   			var tip = Ext.create('Ext.tip.ToolTip', {
													            	    target: c.getEl(),
													            	    listeners:{
													            	    	beforeshow:function(tip){
													            	    		if(balance_line_period_opt === null)
														            	    		tip.update('Broadcast Date');
														            	    	else
														            	    		tip.update(balance_line_period_opt);
		
													            	    	}
													            	    }
									        			});
									       	}	
									}
								},
								{
									xtype : 'button',
									border : 0,
									filterParamName : 'creationDateBtn',
									itemId : 'creationDateBtn',
                                    id : 'creationDateBtn',
									padding: '4 0 0 5',
									tabIndex : "1",
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
				}, 
				 {
					xtype : 'container',
					layout : 'hbox',
					//flex : 0.38,
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-left ft-smallMargin-right',
					items : [{
								xtype : 'AutoCompleter',
								columnWidth : 0.3333,
								fieldCls : 'xn-form-text xn-suggestion-box',
								labelCls : 'frmLabel',
								emptyText : getLabel('searchCCY','Search By CCY'),
								margin : '5 0 0 0',
								fieldLabel : getLabel("CCY", "Currency"),
								labelAlign : 'top',
								labelSeparator : '',
								tabIndex : "1",
								width  : (screen.width) > 1024 ? 225 : 225,
								fitToParent : true,
								itemId : 'Currency',
								name : 'Currency',
								cfgUrl : 'services/userseek/paymentccy.json',
								cfgQueryParamName : '$autofilter',
								cfgSeekId : 'Currency',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE',
								cfgKeyNode : 'CODE'

							}]
				},
				{
					xtype : 'container',
					layout : 'hbox',
					//flex : 0.24,
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-left',
					items : [{
								xtype : 'combo',
								itemId : 'accountType',
								multiSelect : false,
								labelAlign : 'top',
								labelSeparator : '',
								tabIndex : "1",
								labelCls : 'frmLabel',
								margin : '5 0 0 0',
								fieldCls : 'xn-form-field ux_no-border-right',
								width  : (screen.width) > 1024 ? 225 : 225,
								triggerBaseCls : 'xn-form-trigger',
								editable : false,
								displayField : 'colDesc',
								valueField : 'colId',
								queryMode : 'local',
								value : 'All',
								store : accountTypeStore,
								fieldLabel : getLabel("accountType",
										"Account Type"),
							    listConfig:{
								   tpl: [
							            '<ul><tpl for=".">',
							                '<li role="option" class="x-boundlist-item" data-qtip="{colDesc}">' +
							                '{colDesc}</li>',
							            '</tpl></ul>'
							        ]
								 }
							}]
				}]
			}, {
				xtype : 'container',
				layout : 'column',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'vbox',
					//flex : 0.38,
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-right',
					width : '100%',
					items : [{
								xtype : 'label',
								text : getLabel("accounts", "Accounts"),
								cls : 'frmLabel'
							}, {
								xtype : 'container',
								layout : 'hbox',
								width : '100%',
								items : [{
									xtype : 'textfield',
									width  : (screen.width) > 1024 ? 225 : 225,
									//height : 25,
									itemId : 'accounts',
									name : 'accounts',
									tabIndex : "1",
									editable : false,
									readOnly : true,
									fieldCls : 'ux_no-border-right xn-form-field',
									codeVal : null
								}, {
									xtype : 'button',
									border : 0,
									itemId : 'accountsDropDown',
									height : 35.8,
									cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown', 
									glyph : 'xf0d7@fontawesome',
									//padding : '06 0 0 0',
									menuAlign : 'tr-br',
									menu : Ext.create('Ext.menu.Menu', {
												itemId : 'accountsMenu',
												width  : (screen.width) > 1024 ? 225 : 225,
												cls : 'ux_dropdown',
												maxHeight : 200,
												items : []
											})
								}]
							}]
				},{
					xtype : 'container',
					layout : 'hbox',
					//flex : 0.38,
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-left ft-smallMargin-right',
					items : [{
						xtype : 'combo',
						itemId : 'summaryTypeCodes',
						multiSelect : false,
						labelAlign : 'top',
						labelSeparator : '',
						labelCls : 'frmLabel',
						fieldCls : 'xn-form-field ux_no-border-right',
						width  : (screen.width) > 1024 ? 225 : 225,
						triggerBaseCls : 'xn-form-trigger',
						editable : false,
						displayField : 'colDesc',
						valueField : 'colId',
						queryMode : 'local',
						store : typeCodeStore,
						tabIndex : "1",
						fieldLabel : getLabel("summaryTypeCodes",
								"Summary Type Codes"),
						listConfig:{
								   tpl: [
							            '<ul><tpl for=".">',
							                '<li role="option" class="x-boundlist-item" data-qtip="{colDesc}">' +
							                '{colDesc}</li>',
							            '</tpl></ul>'
							        ]
								 }
					}]
				}
				         , {
					xtype : 'container',
					layout : 'hbox',
					//flex : 0.24,
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-left',
					items : [{
								xtype : 'textfield',
								hideTrigger : true,
								labelAlign : 'top',
								labelSeparator : '',
								fieldLabel : getLabel("widgetName",
										"Widget Name"),
								itemId : 'customname',
								fieldCls : 'xn-form-text',
								width  : (screen.width) > 1024 ? 225 : 225,
								labelCls : 'frmLabel',
								name : 'customname',
								maxLength : 20, // restrict user to enter 40
								// chars max
								enforceMaxLength : true,
								maskRe : /[A-Za-z0-9 .]/

							}]
				}]

			}]
		});
		return settingsPanel;
	},
	setSettings : function(widget, settings) {
		var me = this;
		var strSqlDateFormat = 'm/d/Y';
		var temp = widget.down('label[itemId="creationDateLbl"]');
		var typeCodePresent = false;
		var accountPresent = false;
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			operatorValue = settings[i].operator;
			// Account/Account Set Values
			var objAutoCompRef1 = null;
			var objAutoCompRef2 = null;
			// Account
			if (fieldName === 'account') {
				accountPresent = true;
				var checkedCount = 0;
				var menuRef = widget.down('menu[itemId="accountsMenu"]');
				var payMethod = widget.down('textfield[itemId="accounts"]');
				if (!Ext.isEmpty(menuRef)) {
					var itemArray = menuRef.items.items;

					for (var index = 0; index < itemArray.length; index++) {
						itemArray[index].setChecked(false);
					}

					var dataArray = fieldVal.split('|');
					for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
						for (var index = 0; index < itemArray.length; index++) {
							if (dataArray[dataIndex] == itemArray[index].accountNo) {
								checkedCount++;
								itemArray[index].setChecked(true);
							}
						}
					}
				}

				if (!Ext.isEmpty(payMethod)) {
					if(checkedCount == 0)
						payMethod.setValue("Select Options");
					else if(checkedCount > 0)
						payMethod.setValue(checkedCount+" selected");
				}
			}
			// Balance Summary Date Set Values
			if (fieldName === 'summaryDate') 
			{
				var dateFilterLabel = settings[i].dateLabel;
				var dateVar1 = $.datepick.parseDate('yyyy-mm-dd', fieldVal);
				var dateVar2 = $.datepick.parseDate('yyyy-mm-dd', fieldVal2);
				var vFromDate = $.datepick.formatDate(strApplDateFormat.toLowerCase(), dateVar1 );
				var vToDate = $.datepick.formatDate(strApplDateFormat.toLowerCase(), dateVar2 );
				me.dateFilterVal =  settings[i].btnValue;
				me.datePickerCreatedDate[0] = Ext.Date.parse(settings[i].value1, 'Y-m-d');
				me.datePickerCreatedDate[1] = Ext.Date.parse(settings[i].value2, 'Y-m-d');				

				balance_line_period_opt = dateFilterLabel;

					$('#entryDatePickerQuickText').datepick({
									monthsToShow : 1,
									changeMonth : true,
									changeYear : true,
									minDate: btrHistoryDate,
									maxDate : me.getPreviousDate(dtSellerDate),
									dateFormat : strApplDateFormat.toLowerCase(),
									rangeSeparator : '  to  ',
									onClose : function(dates) {
										if (!Ext.isEmpty(dates)) {
												me.dateFilterVal = '13';
												me.datePickerCreatedDate = dates;
												me.dateFilterLabel = getLabel('daterange','Date Range');
												var dtParams = me.getDateParamForDateRange(me.dateFilterVal, dates[0],dates[1]);
												me.dateFilterFromVal = dtParams.fieldValue1;
												me.dateFilterToVal = dtParams.fieldValue2;
												balance_line_period_opt = getLabel("balancePeriod", "Balance Period") + ' (' + me.dateFilterLabel + ')';
												widget.down('label[itemId="creationDateLbl"]').setText(balance_line_period_opt);
										}
									}
								});
					widget.down('label[itemId="creationDateLbl"]').setText(dateFilterLabel);
					widget.down('container[itemId="dateRangeComponent"]').show();
					var datePickerRef = $('#entryDatePickerQuickText');
					datePickerRef.datepick('setDate', [vFromDate, vToDate]);
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
			// Summary Type Code
			if (fieldName === 'summaryTypeCodes') {
				typeCodePresent = true;
				var typeCodeValue = widget
						.down('combo[itemId="summaryTypeCodes"]');
				if (!Ext.isEmpty(typeCodeValue)) {
					if (!Ext.isEmpty(fieldVal))
						typeCodeValue.setValue(fieldVal);
				}
			}

			// Currency
			if (fieldName === 'ccy') {
				var ccyField = widget.down('AutoCompleter[itemId="Currency"]');
				if (!Ext.isEmpty(ccyField)) {
					if (!Ext.isEmpty(fieldVal2))
						ccyField.setValue(fieldVal2);
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
		if (!accountPresent) {
			var payMethod = widget.down('textfield[itemId="accounts"]');
			payMethod.setValue(me.accountDesc);
		}
		if (!typeCodePresent) {
			var payMethod = widget.down('combo[itemId="summaryTypeCodes"]');
			payMethod.setValue(me.selectValue);
		}
	},
	getSettings : function(portletPanel) {
		var me = portletPanel;
		var jsonArray = [];

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

		// Balance Period
		var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
		var index = this.dateFilterVal;
		var objDateParams = this.getDateParam(index,null);
		
		if (!Ext.isEmpty(index)) {
			jsonArray.push({
						field : 'summaryDate',
						value1 : objDateParams.fieldValue1,
						value2 : objDateParams.fieldValue2,
						operator : objDateParams.operator,
						dataType : 'D',
						displayType : index,
						btnValue : index,
						dateLabel : dateLabel
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

		// Type Codes
		var summaryTypeCodesData = me.down('combo[itemId="summaryTypeCodes"]')
				.getValue();
		var summaryTypeCodesDesc = me.down('combo[itemId="summaryTypeCodes"]')
		.getRawValue();
		if (!Ext.isEmpty(summaryTypeCodesData)) {
			jsonArray.push({
						field : 'summaryTypeCodes',
						operator : 'eq',
						value1 : summaryTypeCodesData,
						value2 : summaryTypeCodesDesc,
						dataType : 0,
						displayType : 6
					});
		}

		// Account No
		var accountNoData = me.down('textfield[itemId="accounts"]').accountNoData;
		var accountDisplayData = me.down('textfield[itemId="accounts"]').accountDisplayData;
		var ProductType = me.down('textfield[itemId="accounts"]').getValue();
		var accountsName = accountDisplayData.split('|');
		var accountsNamedesc = ''; 
		for(var a=0;a<accountsName.length;a++)
		{
			 accountsNamedesc +=accountsName[a].split(':')[0]+'|';
		}	
		accountsNamedesc = accountsNamedesc.substring(0,(accountsNamedesc.length - 1))
		if (!Ext.isEmpty(ProductType) && ProductType != 'All') {
			jsonArray.push({
						field : 'account',
						operator : 'eq',
						value1 : accountNoData,
						value2 : accountDisplayData.replace(/:/g,'|'),
						value3 : accountDisplayData,
						value4 : accountsNamedesc,
						dataType : 0,
						displayType : 6
					});
		}
		return jsonArray;
	}
});
