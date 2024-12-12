Ext.define('Cashweb.view.portlet.PaymentBreakup', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.paymentbreakup',
	requires : ['Cashweb.store.PaymentBreakupStore', 'Ext.ux.gcp.AutoCompleter'],
	border : false,
	emptyText : null,
	cls : 'widget-grid',
	taskRunner : null,
	minHeight : 336,
	autoHeight : true,
	cols : 3,
	total : 0,
	strFilter : '',
	selectedClientCode : '',
	allSendingAccountItemChecked : true,
	allSendingAccountItemUnChecked : false,
	allMyProductItemChecked : true,
	allMyProductItemUnChecked : false,
	dateFilterLabel : getLabel("entryDate", "Entry Date")+'('+getLabel('thismonth', 'This Month')+')',
	dateFilterVal : '12',
	dateHandler : null,
	clientUrl : '',
	clientCode : '',
	vFromDate1 : null,
	vToDate1 : null,
	filterRestrict : '999',
	accntUrl : "",
	filterUrl : '',
	portletref : null,
	enableQueryParam : false,
	creation_date_opt : null,
	titleId : '',
	ccyCode : '',
	dateFilterFromVal : null,
	dateFilterToVal : null,
	datePickerCreatedDate : [],
	defalutSettings : true,
	isAchSelected : false,
	isCcyCodeSelected : false,
	statusFilterUrl : 'and  ActionStatus ne \'0\'  and  ActionStatus ne \'4\'  and ActionStatus ne \'8\' and ActionStatus ne \'9\' and'
					+ '	ActionStatus ne \'13\' and ActionStatus ne \'19\' and'
					+ ' ActionStatus ne \'41\' and  ActionStatus ne \'101\' )',
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		thisClass.emptyText = label_map.noDataFound;
		thisClass.store = new Cashweb.store.PaymentBreakupStore();

		thisClass.on('cellclick', function(me, td, cellIndex, record, tr,
						rowIndex, e, eOpts) {
					var filter = thisClass.filterUrl;
					var settingsArray = thisClass.record.get('settings');
					
					if(record.data.LABEL === 'In Process'){
						filter = filter + ' and ( ActionStatus ne \'14\' or ActionStatus ne \'15\' ' + thisClass.statusFilterUrl;
						settingsArray.push({
							paramName : getLabel('ActionStatus', 'ActionStatus'),
							paramValue1 : ["1","2","3","40","7","18","29","51,52,53,54,55,56,57,62,63,64,65,66,67,68,69,70,71,94,95,96","59","75","76","77","78","93","97"],
							operatorValue : 'in',
							dataType : 'S',
							paramFieldLable : getLabel('lblStatus', 'Status'),
							field : getLabel('lblStatus', 'Status'),
							displayType : 5
						});
					}else if(record.data.LABEL === 'Processed'){
						filter = filter + ' and ( ActionStatus ne \'14\' and ActionStatus eq \'15\' ' + thisClass.statusFilterUrl;
						settingsArray.push({
							paramName : getLabel('ActionStatus', 'ActionStatus'),
							paramValue1 :"14,15",	
							operatorValue : 'in',
							dataType : 'S',
							paramFieldLable : getLabel('lblStatus', 'Status'),
							field : getLabel('lblStatus', 'Status'),
							displayType : 5
						});
					}					
							if (filter.indexOf("sendingAccnt") > -1) {
								var start = filter.indexOf('sendingAccnt') - 1;
								var filterDetail = filter.substr(start);
								var end = filterDetail.indexOf(')') + 1;
								filterDetail = filterDetail.substr(0, end);
								filter = filter.replace(filterDetail, '');
								if (!Ext.isEmpty(filterDetail))
									filter = filter
											.substr(0, filter.length - 5);
								filterDetail = filterDetail.replace(
										new RegExp("sendingAccnt", 'g'), "AccountNoPDT")
								filter = filter + '&$filterDetail='
										+ filterDetail;
							}
							if (filter.indexOf("paymentCategory") > -1)
								filter = filter.replace(new RegExp("paymentCategory", 'g'),
										"ProductType");
							if (filter.indexOf("PaymentCategory") > -1)
								filter = filter.replace("PaymentCategory",
										"ProductType");
							if (filter.indexOf("creationDate") > -1)
								filter = filter.replace("creationDate",
										"EntryDate");
							if (filter.indexOf("PaymentMode") > -1)
								filter = filter.replace("PaymentMode",
										"PayCategory");
							/*thisClass.fireEvent('seeMorePaymentRecords',
									filter, settingsArray);*/
				});

		thisClass.on('refreshWidget', function() {
					var record = thisClass.record, settings = [];
					var filterUrl = '';
					thisClass.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					for(var i=0;i<settings.length;i++){
						if(settings[i].field == 'ProductCategory' && settings[i].value1 == 'ACH'){
							thisClass.isAchSelected = true;
							break;
						}else{
							thisClass.isAchSelected = false;
						}
					}
					filterUrl = thisClass.generateUrl(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});

		thisClass.on('boxready', function(component, eOpts) {
			thisClass.setLoading(label_map.loading);
		});
		thisClass.on('viewready', function(component, eOpts) {
			var settings = [];
			var filterUrl = '', isClientPresent = false, isCategoryPresent = false, datePresentFlag = false;
			var record = thisClass.record;
			if (!Ext.isEmpty(record.get('settings'))) {
				settings = record.get('settings');
				thisClass.defalutSettings = false;
				for(var i=0;i<settings.length;i++){
					if(settings[i].field == 'ProductCategory' && settings[i].value1 == 'ACH'){
						thisClass.isAchSelected = true;
						break;
					}else{
						thisClass.isAchSelected = false;
					}
				}
			}
//			thisClass.setLoading(label_map.loading);
			for (var i = 0; i < settings.length; i++) {
				if (settings[i].field === 'Client') {
					isClientPresent = true;
					continue;
				}
				if (settings[i].field === 'creationDate') {
					thisClass.dateFilterVal = settings[i].btnValue;
					thisClass.datePickerCreatedDate[0]=Ext.Date.parse(settings[i].value1, 'Y-m-d');
					thisClass.datePickerCreatedDate[1]=Ext.Date.parse(settings[i].value2, 'Y-m-d');
					datePresentFlag = true;
					continue;
				}
				
			}
			if (!datePresentFlag) {
				var objDateParams = thisClass.getDateParam("5", null);
				thisClass.dateFilterFromVal = objDateParams.fieldValue1;
				thisClass.dateFilterToVal = objDateParams.fieldValue2;

				vFromDate = $.		datepick.formatDate(strApplicationDateFormat, 
				$.
					datepick.		parseDate('yyyy-mm-dd', objDateParams.fieldValue1));
					
					vToDate = $.	datepick.
					formatDate(strApplicationDateFormat, $.
					
					datepick.		parseDate('yyyy-mm-dd', objDateParams.fieldValue2));
				settings.push({
							field : 'creationDate',
							operator : (!Ext.isEmpty(vToDate)) ? 'bt' : 'eq',
							value1 : Ext.util.Format.date(vFromDate, 'Y-m-d'),
							value2 : Ext.util.Format.date(vToDate, 'Y-m-d'),
							dateLabel : getLabel("entryDate", "Entry Date")+" ("+getLabel('thismonth', 'This Month')+")",
							dataType : 'D',
							displayType : 5,
							btnValue : "5"
						});
			}
			
			/*var isProductCategoryPresent=false;
			for(var i=0;i<settings.length;i++){
				if(settings[i].field == 'ProductCategory'){
					isProductCategoryPresent = true;
					break;
				}
				else{
					isProductCategoryPresent = false;
				}	
			}
			/*if(isProductCategoryPresent){}
			else{
				settings.push({
					dataType: 0,
					displayType :6,
					field:"ProductCategory",
					operator : "eq",
					value1 : "WIRE"
				});
			}*/
			
			thisClass.record.set('settings', settings);
			/*if (isClientPresent) {*/
				filterUrl = thisClass.generateUrl(settings);
				thisClass.ajaxRequest(filterUrl, settings);
			/*} else {
				thisClass.getClientMenuData(settings);
			}*/
		});
		var objDefaultArr = [{
					dataIndex : 'LABEL',
					sortable : false,
					flex : 23,
					hidden : false,
					hideable : false,
					resizable : false
				}, {
					header : getLabel("repetitive", "Repetitive"),
					dataIndex : 'REPETITIVE',
					flex : 23,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,					
					hidden : repetitiveFlag == 'Y' ? false : true,
					align : 'right'
				}, {
					header : getLabel("semiRepetitive", "Semi Repetitive"),
					dataIndex : 'SEMIREPETITIVE',
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					flex : 23,
					hideable : false,
					hidden : semiRepetitiveFlag == 'Y' ? false : true,
					align : 'right'
				}, {
					header : getLabel("nonRepetitive", "Non Repetitive"),
					dataIndex : 'NONREPETITIVE',
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					flex : 23,
					hideable : false,
					hidden : nonRepetitiveFlag == 'Y' ? false : true,
					align : 'right'
				}, {
					header : getLabel("recurringpayment", "Recurring Payment"),
					dataIndex : 'STANDINGORDER',
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					flex : 23,
					hideable : false,
					hidden : recurring_payment == 'Y' ? false : true,
					align : 'right'
				}, {
					header : getLabel("total", "Total"),
					dataIndex : 'TOTAL',
					align : 'right',
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hideable : false,
					flex : 23,
					hidden : false
				}];
		var settings = thisClass.record.get('settings');
		var arrColPref = [];
		for (var i = 0; i < settings.length; i++) {
			if (settings[i].field === 'colPref') {
				arrColPref = settings[i].value1.columns;
				break;
			}
		}
		var columnModel = objDefaultArr;

		for (var i = 0; i < columnModel.length; i++) {
			columnModel[i].renderer = function(value, meta, record, rowIndex, colIndex, store, view, colId) {
				var strRetValue = value;
				if (colId === 'col_amount' || colId === 'col_creditAmount' || colId === 'col_debitAmount') {
					if (!record.get('isEmpty')) {
						if (Ext.isEmpty(record.get('currency'))) {
							strRetValue = '<a title="'
									+ getLabel('iconBatchFcy', 'Multiple Currencies')
									+ '" class="iconlink grdlnk-notify-icon icon-gln-fcy"></a>'
									+ ' ' + value;
							meta.tdAttr = 'title="' + value + '"';
						} else {
							strRetValue = record.get('currency') + ' ' + value;
							meta.tdAttr = 'title="' + strRetValue + '"';
			}
		}
				}
				meta.tdAttr = 'title="' + strRetValue + '"';
				return strRetValue;
			}
		}

		thisClass.columns = columnModel;

	/*	thisClass.dockedItems = [{
			xtype : 'toolbar',
			dock : 'bottom',
			padding : '0 0 11 0',
			//layout : {
			//	pack : 'center',
			//	type : 'hbox'
			//},
			items : [{
						xtype : 'label',
						text : "Drawdowns are not included in the totals",
						cls : 'ft-font-italic ft-disclaimer-font-size wgt-confirm-text'
					}]
		}];*/
		thisClass.callParent();
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
						/*if (!Ext.isEmpty(me.allClientMenuData)) {
							settings.push({
										field : 'Client',
										operator : 'eq',
										value1 : me.allClientMenuData[0].CODE,
										value2 : me.allClientMenuData[0].DESCR,
										dataType : 0,
										displayType : 6
									});
						}*/
						filterUrl = me.generateUrl(settings);
						me.ajaxRequest(filterUrl, settings);
					},
					failure : function(settings) {
					}
				});
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
						Ext.getCmp("creationDateBtn").focus();
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
							Ext.getCmp("creationDateBtn").focus();
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
							Ext.getCmp("creationDateBtn").focus();
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
							Ext.getCmp("creationDateBtn").focus();
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
							Ext.getCmp("creationDateBtn").focus();
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
							Ext.getCmp("creationDateBtn").focus();
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
							Ext.getCmp("creationDateBtn").focus();
						}
					});

		arrMenuItem.add({
					text : getLabel('daterange','Date Range'),
					btnId : 'btnDateRange',
					btnValue : '7',
					parent : me,
					handler : function(btn, opts) {
						me.dateFilterVal = btn.btnValue;
						me.dateFilterLabel = btn.text;
						me.handleDateChange(portletSettings, btn.btnValue);
						Ext.getCmp("creationDateBtn").focus();
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
		if (intFilterDays >= 1 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
				text : getLabel('today', 'Today'),
				btnId : 'btnToday',
				btnValue : '1',
				handler : function(btn, opts) {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(me.portletref, btn.btnValue);
					me.datedrdownChange = true;
					me.portletref.down('button[itemId="creationDateBtn"]').focus();
				}
			});
			if (intFilterDays >= 2 || me.checkInfinity(intFilterDays))
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
				text : getLabel('lastweektodate', 'Last Week To Date'),
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
				text : getLabel('lastMonthToDate', 'Last Month To Date'),
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
				text : getLabel('lastQuarterToDate',
						'Last Quarter To Date'),
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
	if (intFilterDays >= 365 || me.checkInfinity(intFilterDays))
		arrMenuItem.add({
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',
					parent : me,
					handler : function(btn, opts) {
						me.dateFilterVal = btn.btnValue;
						me.dateFilterLabel = btn.text;
						me.handleDateChange(me.portletref, btn.btnValue);
						me.datedrdownChange = true;
						me.portletref.down('button[itemId="creationDateBtn"]').focus();
					}
				});
	if (intFilterDays >= 730 || me.checkInfinity(intFilterDays))
		arrMenuItem.add({
					text : getLabel('lastyeartodate', 'Last Year To Date'),
					btnId : 'btnYearToDate',
					btnValue : '11',
					parent : me,
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
				hidden : true,
				items : [{
							xtype : 'component',
							width : '224px',
							margin : '3 0 0 0',//Top Right Bottom Left
							itemId : 'entryDatePickerQuick',
							filterParamName : 'EntryDate',
							endDateField : 'toDate',
							startDateField : 'fromDate',
							html : '<input type="text" tabindex ="1" id="entryDatePickerQuickText" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
						},{
							itemId : 'entryDateFaFaCalender',
							xtype : 'component',
							margin : '4 0 0 -11',//Top Right Bottom Left
							cls : 'icon-calendar',
							html : '<span class=""><i class="fa fa-calendar"></i></span>'
						}
						]
			}]
		});
		dateParentPanel.add(dateContainerPanel);
		portletSettings.down('container[itemId="completDatePanel"]')
				.add(dateParentPanel);
	},
	// Sending account field handling starts
	addSendingAccountsMenuItems : function(summaryPortlet) {
		var me = this;
		Ext.Ajax.request({
					url : 'services/userseek/debitaccounts.json?$filterCode1='
							+ me.selectedClientCode,
					async : false,
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						me.loadSendingAccountMenu(summaryPortlet, data);
					},
					failure : function() {
						// console.log("Error Occured - Addition
						// Failed");
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
	// Payment Method field handlling starts
	addMyProductsMenuItems : function(summaryPortlet) {
		var me = this;
		var myProductMenuRef = summaryPortlet
				.down('menu[itemId="payMethodMenu"]');
		if (!Ext.isEmpty(myProductMenuRef)) {

			Ext.Ajax.request({
				url : 'services/userseek/usermyproducts.json?$top=-1&$filterCode1='
						+ me.selectedClientCode,
				async : false,
				method : 'GET',
				success : function(response) {
					var responseData = Ext.decode(response.responseText);
					var data = responseData.d.preferences;
					me.loadMyProductMenu(summaryPortlet, data);
				},
				failure : function() {
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
	handleDateChange : function(portlet2, index) {
		var me = this;
		var objDateParams = null;
		var vFromDate = null;
		var vToDate = null;
		if(index === '7')
		{
			objDateParams = me.getDateParamForDateRange(index, null);
		}	
		else
		{
			objDateParams = me.getDateParam(index, null);
			me.dateFilterFromVal = objDateParams.fieldValue1;
			me.dateFilterToVal = objDateParams.fieldValue2;			
		}
			
		vFromDate = $.		datepick.
		formatDate(strApplicationDateFormat, $.
		datepick.		parseDate('yyyy-mm-dd', objDateParams.fieldValue1));
		
		vToDate = $.	datepick.
		formatDate(strApplicationDateFormat, $.
		datepick.		parseDate('yyyy-mm-dd', objDateParams.fieldValue2));
			
		
		if (!Ext.isEmpty(me.dateFilterLabel)) 
		{
			creation_date_opt = getLabel("entryDate", "Entry Date")+" (" + me.dateFilterLabel + ")";
			if(me.portletref)
			{
			me.portletref.down('label[itemId="creationDateLbl"]')
						.setText(getLabel("entryDate", "Entry Date") + " (" + me.dateFilterLabel + ")");
		}
		}
		var datePickerRef = $('#entryDatePickerQuickText');
		
		if(me.portletref)
		{
		me.portletref.down('container[itemId="dateRangeComponent"]').show();
		}
		
		$('#entryDatePickerQuickText').datepick({
					monthsToShow : 1,
					changeMonth : false,
					dateFormat : strApplicationDateFormat,
					rangeSeparator : '  to  ',
					onClose : function(dates) {
						if (!Ext.isEmpty(dates)) {
							me.dateFilterVal = '13';
							me.datePickerCreatedDate = dates;
							me.dateFilterLabel = getLabel('daterange','Date Range');
							var dtParams = me.getDateParamForDateRange(me.dateFilterVal, dates[0],dates[1]);
							me.dateFilterFromVal = dtParams.fieldValue1;
							me.dateFilterToVal = dtParams.fieldValue2;
						}
					}
				}).show();
		if(vFromDate != '' && vToDate != '')
			datePickerRef.datepick('setDate', [vFromDate, vToDate]);
		else if(vFromDate != ''  && vToDate == '')
			datePickerRef.datepick('setDate', vFromDate);
		
		if($('#entryDatePickerQuickText').datepick('getDate'))
		 me.datePickerCreatedDate = $('#entryDatePickerQuickText').datepick('getDate');
		 


	},
	getDateParamForDateRange : function(index, fromDate, toDate) {
		var me = this;
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = Ext.Date.parse(strAppDate, dtFormat);
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
		var strFilter = '', accntFilter = '', clientFilter = '';
		var ccyPresent = false;
		me.clientUrl = '';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {
				if (settings[index].field != 'customname'
						&& settings[index].field != 'colPref') {
					if (Ext.isEmpty(settings[index].operator)) {
						isFilterApplied = false;
						continue;
					}
					if (settings[index].field === 'ccy') {
						me.ccyCode = settings[index].value1;
						ccyPresent = true;
					}
					if (settings[index].field === 'Client') {
						clientFilter = settings[index].value1;
						me.clientUrl = '$clientFilter=' + clientFilter;
						me.clientCode = clientFilter;
					}

					switch (settings[index].operator) {
						case 'bt' :
							if (isFilterApplied)
								strFilter = strFilter + ' and ';
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
							isFilterApplied = true;
							break;
						case 'in' :
							if (isFilterApplied)
								strFilter = strFilter + ' and ';
							var reg = new RegExp(/[\(\)]/g);
							var objValue = settings[index].value1;
							objValue = objValue.replace(reg, '');
							var objArray = objValue.split(',');
							if (objArray.length > 0) {
								if (objArray[0] != 'All') {
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
							isFilterApplied = true;
							break;
						default :
							// Default opertator is eq
							if (settings[index].dataType === 'D') {

								if (isFilterApplied)
									strFilter = strFilter + ' and ';
								strFilter = strFilter + settings[index].field
										+ ' ' + settings[index].operator + ' '
										+ 'date\'' + settings[index].value1
										+ '\'';
							} else {
								if (settings[index].field != 'Client'
										&& settings[index].field != 'ccy') {
									if (isFilterApplied)
										strFilter = strFilter + ' and ';
									strFilter = strFilter
											+ settings[index].field + ' '
											+ settings[index].operator + ' '
											+ '\'' + settings[index].value1
											+ '\'';
									isFilterApplied = true;
								}
							}
							break;
					}
				}
			}
			if (!ccyPresent) {
				me.ccyCode = '';
			}
		}
		me.filterUrl = strFilter;
		strFilter = '?$filter=' + strFilter;
		if (!Ext.isEmpty(me.ccyCode))
			strFilter = strFilter + '&$ccy=' + me.ccyCode;
		return strFilter;
	},
	ajaxRequest : function(filterUrl, settings) {
		var obj;
		var thisClass = this;
		if(thisClass.clientUrl)
		{
			filterUrl = filterUrl + "&" + thisClass.clientUrl;
		}
		if (filterUrl.charAt(0) == "?") { // remove first qstnmark
			filterUrl = filterUrl.substr(1);
		}
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = filterUrl || {}, arrMatches;
		if (thisClass.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(filterUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
		}
		thisClass.setTitle(settings);
		Ext.Ajax.request({
					url : 'services/getWireSummaryWidgetData.json',// +
					// filterUrl,
					method : 'POST',
					params : objParam,
					success : function(response) {
						obj = Ext.decode(response.responseText);
						thisClass.loadData(obj);

						if (Ext.isEmpty(thisClass.ccyCode)
								|| thisClass.ccyCode == "undefined")
							thisClass.ccyCode = obj.currency;
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
		var arrData = data.summary.d.commonDataTable;
		if (!Ext.isEmpty(arrData)) {
			for (var i = 0; i < arrData.length; i++) {
				var colJson = {};
				var totalAmount = '';
				var totalRowAmount = 0;
			if (arrData[i]) 
				{
				   if(repetitiveFlag == 'Y')
				   {
					totalAmount = totalAmount + parseFloat(arrData[i].REPETITIVE).toFixed(strAmountMinFraction);
					   totalRowAmount += Number(parseFloat(totalAmount).toFixed(strAmountMinFraction)) ;
					colJson["REPETITIVE"] = strSellerCurr  + ' '+ me.addCommas(totalAmount);
				   }
					
				   if(recurring_payment == 'Y')
				   {
					totalAmount = '';
					totalAmount = totalAmount + parseFloat(arrData[i].STANDINGORDER).toFixed(strAmountMinFraction);
					   totalRowAmount += Number(parseFloat(totalAmount).toFixed(strAmountMinFraction)) ;
					colJson["STANDINGORDER"] = strSellerCurr  + ' '+ me.addCommas(totalAmount);
				   }

				   if(nonRepetitiveFlag == 'Y')
				   {
					totalAmount = '';
					totalAmount = totalAmount + parseFloat(arrData[i].NONREPETITIVE).toFixed(strAmountMinFraction);					
					   totalRowAmount += Number(parseFloat(totalAmount).toFixed(strAmountMinFraction)) ;
					colJson["NONREPETITIVE"] = strSellerCurr  + ' '+ me.addCommas(totalAmount);
				   }

				   if(semiRepetitiveFlag == 'Y')
				   {
					totalAmount = '';
					   totalAmount = totalAmount + parseFloat(arrData[i].SEMIREPETITIVE).toFixed(strAmountMinFraction);
					   totalRowAmount += Number(parseFloat(totalAmount).toFixed(strAmountMinFraction)) ;
					   colJson["SEMIREPETITIVE"] = strSellerCurr  + ' '+ me.addCommas(totalAmount);
				   }
					
						
						totalAmount = '';
					totalAmount = totalAmount + parseFloat(totalRowAmount).toFixed(strAmountMinFraction);					
					colJson["TOTAL"] = strSellerCurr  + ' '+ me.addCommas(totalAmount);
					
					colJson["LABEL"] = arrData[i]["DECODE(GROUPING(STATE),1,'TOTAL',STATE)"];
				}
				storeData.push(colJson);
			}
		}
		me.getStore().loadData(storeData);
		me.setLoading(false);
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
					width  : (screen.width) > 1024 ? 830 : 830,
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
								//class : 'ux-button-s ft-button-secondary footer-btns',
								tabIndex : "1",
								handler : function() {
									this.up('window').close();
								}
							}, '->', {
								text : getLabel("save", "Save"),
								tabIndex : "1",
								//class : 'ux-button-s footer-btns',
								handler : function() {
									var settings = me.getSettings(this
											.up('window'));
									me.record.set('settings', settings);
									me.setLoading(label_map.loading);
									var filterUrl = me.generateUrl(settings);
									me.ajaxRequest(filterUrl, settings);
									me.up('panel').fireEvent('saveSettings',
											record, settings);
									me.defalutSettings = false;
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
		me.portletref = portletSettings;
		//me.addSendingAccountsMenuItems(portletSettings);
		//me.addMyProductsMenuItems(portletSettings);
		me.addClientMenu(portletSettings);
		me.addDatePanel(portletSettings);
		//me.addDateMenu(portletSettings);
		me.setSettings(portletSettings, me.record.get('settings'));
		if(me.portletref.down('textfield[itemId="Client"]').up().hidden)
		{
			me.portletref.down('button[itemId="creationDateBtn"]').focus();
		}
		else
		{
			me.portletref.down('textfield[itemId="Client"]').focus();
		}
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
		var paymentCategoryStore = Ext.create('Ext.data.Store', {
					fields : ['colId', 'colDesc']
				});
		Ext.Ajax.request({
					url : 'services/paymentMethod.json',
					method : 'GET',
					async : false,
					success : function(response) {
						if(!Ext.isEmpty(response.responseText)){
							var responseData = Ext.decode(response.responseText);
							if (responseData && responseData.d && responseData.d.instrumentType) {
							var data = responseData.d.instrumentType;
								if (paymentCategoryStore) {
									paymentCategoryStore.removeAll();
									var count = data.length;
									if (count > 0) {
										paymentCategoryStore.add({
													'colId' : 'All',
													'colDesc' : getLabel('all','All')
												});
									}
									for (var index = 0; index < count; index++) {
										var instTypeDesc = (NONUSUSER == 'N' && data[index].instTypeCode == "WIRE")? getLabel(data[index].instTypeCode+"_US",data[index].instTypeDescription) : 
											getLabel(data[index].instTypeCode,data[index].instTypeDescription)  ;
										var record = {
											'colId' : data[index].instTypeCode,
											'colDesc' : instTypeDesc
										}
										paymentCategoryStore.add(record);
									}
								}
							}
						}
					},
					failure : function() {
					}
				});

		var rangeStore = Ext.create('Ext.data.Store', {
					fields : ['key', 'value'],
					data : [{
								"key" : "lt",
								"value" : getLabel("lt","Less Than")
							},
					        {
								"key" : "gt",
								"value" : getLabel("gt","Greater Than")
					      	},
					        {
								"key" : "eq",
								"value" : getLabel("eq","Equal To")
							}]
				});

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
				items : [
				         thisClass.getClientPanel()
				]
			}, {
				xtype : 'container',
				layout : {
					type : 'column',
					pack : 'center'
				},
				flex : 1,
				cls : 'ft-padding-bottom',
				items : [
				    {
					xtype : 'container',
					layout : 'vbox',
					itemId : 'completDatePanel',
					columnWidth : 0.3340,
					cls : 'ft-smallMargin-left',
					items : [{
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'creationDateLbl',
									name : 'creationDateLbl',
									text : getLabel("entrydate",
											"Entry Date"),
									style : {
										'padding-right' : '10px !important'
									},
									cls : 'widget_date_menu',
									listeners: {
									       render: function(c) {
									    	   			var tip = Ext.create('Ext.tip.ToolTip', {
													            	    target: c.getEl(),
													            	    listeners:{
													            	    	beforeshow:function(tip){
													            	    		if(creation_date_opt === null)
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
									itemId : 'creationDateBtn',
									padding: '4 0 0 5',
									tabIndex : "1",
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
						itemId : 'CreateDate',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'dateFilterFrom',
									tabIndex : "1",
									name : 'dateFilterFrom',
									btnValue : ''
								}, {
									xtype : 'label',
									itemId : 'dateFilterTo',
									tabIndex : "1",
									name : 'dateFilterTo'
								}]
					}]
				},
				{
					xtype : 'AutoCompleter',
					cls : 'ft-smallMargin-right ft-smallMargin-left',
					fieldCls : 'xn-form-text xn-suggestion-box pagesetting t7-adjust-amnt-height',
					labelCls : 'frmLabel',
					layout : 'hbox',
					fieldLabel : getLabel("CCY", "Currency"),
					emptyText : 'Enter Keyword or %',
					labelAlign : 'top',
					labelSeparator : '',
					width  : (screen.width) > 1024 ? 200 : 200,
					fitToParent : true,
					columnWidth : 0.3333,
					margin : '7 10 0 16',//Top Right Bottom Left
					itemId : 'Currency',
					tabIndex : "1",
					fitToParent : true,
					name : 'Currency',
					cfgUrl : 'services/userseek/paymentccy.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'Currency',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'CODE',
					cfgKeyNode : 'CODE',
					listeners : {
					select : function(combo, record,
							index) {
						if (record
								&& record[0].data
								&& record[0].data.CODE)									
						thisClass.isCcyCodeSelected = true;
					},
					keyup :  function( combo, e, eOpts){
						thisClass.isCcyCodeSelected = false;
					},
					blur : function(combo, The, eOpts){
						/*if(!thisClass.isCcyCodeSelected){
							combo.setValue("");
							thisClass.isCcyCodeSelected = false;
						}*/
					}
				}

				}
				]
			},
			{

				xtype : 'container',
				layout : {
					type : 'column',
					pack : 'center'
				},
				flex : 1,
				cls : 'ft-padding-bottom',
				items : [
				{
					xtype : 'container',
					layout : 'vbox',
					columnWidth : 0.3330,
					cls : 'ft-smallMargin-left pagesetting',
					items : [{
								xtype : 'label',
								text : getLabel("sendingAccounts",
										"Sending Accounts"),
								cls : 'f13 ux_font-size14 ux_padding0060'
							},
							{
								xtype : 'checkcombo',
								valueField : 'CODE',
								displayField : 'DESCR',
								editable : false,
								addAllSelector : true,
								emptyText : 'All',
								multiSelect : true,
								matchFieldWidth : true,
								width : (screen.width) > 1024 ? 268 : 244,
								padding : '-4 0 0 0',
								itemId : 'AccountNo',
								tabIndex : "1",
								isQuickStatusFieldChange : false,
								store : thisClass.getSendingAccountStore(thisClass),
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
				},
				{
					xtype : 'container',
					layout : 'vbox',
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-left ft-smallMargin-right pagesetting',
					items : [{
						xtype : 'combo',
						itemId : 'payCategory',
						tabIndex : "1",
						multiSelect : false,
						labelAlign : 'top',
						labelSeparator : '',
						labelCls : 'frmLabel',
						fieldCls : 'ux_no-border-right xn-form-field',
						triggerBaseCls : 'xn-form-trigger',
						//cls : 'ft-smallMargin-left ft-smallMargin-right',
						width  : (screen.width) > 1024 ? 242 : 242,
						editable : false,
						displayField : 'colDesc',
						valueField : 'colId',
						queryMode : 'local',
						value : 'All',
						store : paymentCategoryStore,
						fieldLabel : getLabel("paymentCategory",
								"Payment Type")
					}]
				},
				 {
					xtype : 'container',
					layout : 'vbox',
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-left pagesetting',
					items : [{
								xtype : 'label',
								text : getLabel("paymentMethod","Payment Package"),
								cls : 'f13 ux_font-size14 ux_padding0060'
							},
							{
								xtype : 'checkcombo',
								valueField : 'CODE',
								displayField : 'DESCR1',
								editable : false,
								addAllSelector : true,
								emptyText : getLabel('all','All'),
								multiSelect : true,
								matchFieldWidth : true,
								width : (screen.width) > 1024 ? 252 : 244,
								hideTrigger: true,
								padding : (screen.width) > 1024 ? '-8 0 0 0' : '-5 0 0 0',
								itemId : 'payMethod',
								tabIndex : "1",
								isQuickStatusFieldChange : false,
								store : thisClass.getPaymentMethodStore(thisClass),
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
				}
				]
			
			}, 
			{
				xtype : 'container',
				layout : 'column',
				labelAlign : 'top',
				flex : 1,				
				cls : 'ft-padding-top',
				items : [{
						xtype : 'checkboxgroup',
						columns : [80, 100],
						columnWidth : 0.3290,
						cls : 'ft-extraLargeMargin-right ft-extraLargeMargin-left ',
						margin : '10 0 0 10',//Top Right Bottom Left
						vertical : true,
						hidden : true,
						items : [{
							boxLabel : getLabel("batch", "Batch"),
							name : 'multi',
							inputValue : 'M',
							itemId : 'multiPayCheckBox',
							tabIndex : "1",
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
							tabIndex : "1",
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
					},
					thisClass.getWidgetNamePanel(true) ,
						{
							xtype : 'container',
							flex : 0.24
						}]
			}]
		});
		return settingsPanel;
	},

	getSendingAccountStore : function(thisClass) {
		var data;
		var me = this;
		Ext.Ajax.request({
				url : 'services/userseek/debitaccounts.json?$filterCode1='
					+ me.selectedClientCode,	
				
			async : false,
			method : 'GET',
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				data = responseData.d.preferences;
			},
			failure : function() {
			}
		});
		
		var serviceStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR'],
			data : data,
			autoLoad : true,
			listeners : {
				load : function() {
				}
			}
		});
		serviceStore.load();
		return serviceStore;
	},
	
	getPaymentMethodStore : function(thisClass) {
		var data;
		var me = this;
		Ext.Ajax.request({
			url : 'services/userseek/usermyproducts.json?$top=-1&$filterCode1='
				+ me.selectedClientCode,
			async : false,
			method : 'GET',
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				data = responseData.d.preferences;
				Ext.each(data || [], function(item) {
						item.DESCR1 = item.PRDDESCR;
			        }, this);
			},
			failure : function() {
			}
		});
		
		var payMethodStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR','DESCR1'],
			data : data,
			autoLoad : true,
			listeners : {
				load : function() {
				}
			}
		});
		payMethodStore.load();
		return payMethodStore;
	},	
	setSettings : function(widget, settings) {
	var me = this;
		var strSqlDateFormat = 'm/d/Y';
		/*var temp = widget.down('label[itemId="creationDateLbl"]');
		if (temp.text == "Entry Date") {
			var dateFilterLabel = getLabel("entryDate", "Entry Date")+" (Latest)";
			widget.down('label[itemId="creationDateLbl"]')
					.setText(dateFilterLabel);
		}*/
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			operatorValue = settings[i].operator;

			if (fieldName === 'Client') {
				var clientField = widget.down('textfield[itemId=Client]');
				if (!Ext.isEmpty(clientField)) {
					if (!Ext.isEmpty(fieldVal2))
						clientField.setValue(fieldVal2);
					clientField.clientCodesData = fieldVal;
				}
			}
			/*if(me.defalutSettings)
			{
				var paymentCategoryValue = widget
						.down('combo[itemId="payCategory"]');
						paymentCategoryValue.setValue('All');
			}*/
			if (fieldName === 'sendingAccnt') {
				var accountNumberCombo = widget.down('checkcombo[itemId="AccountNo"]');
				var values = fieldVal.split(',');
				if(!(Ext.isEmpty(accountNumberCombo) || Ext.isEmpty(values))) {
					accountNumberCombo.setValue(values);
				}
			}
			
			if (fieldName === 'ProductCategory') {
				var paymentCategoryValue = widget
						.down('combo[itemId="payCategory"]');
				if (!Ext.isEmpty(paymentCategoryValue)) {
					if (!Ext.isEmpty(fieldVal))
						paymentCategoryValue.setValue(fieldVal);
				}
			}
			if (fieldName === 'paymentCategory') {
				var payMethodCombo = widget.down('checkcombo[itemId="payMethod"]');
				var values = fieldVal.split(',');
				if(!(Ext.isEmpty(payMethodCombo) || Ext.isEmpty(values))) {
					payMethodCombo.setValue(values);
				}
			}
			if (fieldName === 'PaymentMode') {
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
			if (fieldName === 'creationDate') {
				var dateFilterLabel = settings[i].dateLabel;
				me.dateFilterLabel = settings[i].dateLabel.substring(settings[i].dateLabel.indexOf('(')+1,settings[i].dateLabel.indexOf(')'));
				me.dateFilterVal =  settings[i].btnValue;
				me.datePickerCreatedDate[0] = Ext.Date.parse(settings[i].value1, 'Y-m-d');
				me.datePickerCreatedDate[1] = Ext.Date.parse(settings[i].value2, 'Y-m-d');
				
				var dateVar1 = $.datepick.parseDate('yyyy-mm-dd', fieldVal);
				var dateVar2 = $.datepick.parseDate('yyyy-mm-dd', fieldVal2);
				var vFromDate = $.datepick.formatDate(strApplicationDateFormat, dateVar1 );
				var vToDate = $.datepick.formatDate(strApplicationDateFormat, dateVar2 );

				creation_date_opt = dateFilterLabel;
				me.dateFilterFromVal = vFromDate;
				me.dateFilterToVal = vToDate;

				$('#entryDatePickerQuickText').datepick({
								monthsToShow : 1,
								changeMonth : true,
								changeYear : true,
								dateFormat : strApplicationDateFormat,
								rangeSeparator : '  to  ',								
								onClose : function(dates) {
									if (!Ext.isEmpty(dates)) {
											me.dateFilterVal = '13';
											me.datePickerCreatedDate = dates;
											me.dateFilterLabel = getLabel('daterange','Date Range');
											var dtParams = me.getDateParamForDateRange(me.dateFilterVal, dates[0],dates[1]);
											me.dateFilterFromVal = dtParams.fieldValue1;
											me.dateFilterToVal = dtParams.fieldValue2;
											var label = getLabel("entryDate", "Entry Date")+" (" + me.dateFilterLabel + ")";
											widget.down('label[itemId="creationDateLbl"]').setText(label);
											me.handleDateChange(null,me.dateFilterVal);
									}
								}
							});
				$('#entryDatePickerQuickText').attr('tabindex','1');
				widget.down('label[itemId="creationDateLbl"]').setText(dateFilterLabel);
				widget.down('container[itemId="dateRangeComponent"]').show();
				var datePickerRef = $('#entryDatePickerQuickText');
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
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

		}
	},
	getSettings : function(portletPanel) {
		var me = portletPanel;
		var thisClass = this;
		var jsonArray = [];
		// Client
		var clientCode = me.down('textfield[itemId="Client"]').clientCodesData;
		var clientDesc = me.down('textfield[itemId="Client"]').getValue();
		var isFieldHidden = me.down('textfield[itemId="Client"]').up().hidden;
		if (!Ext.isEmpty(clientCode) 
				&& clientCode != 'all'
					&& !isFieldHidden) {
			jsonArray.push({
						field : 'Client',
						operator : 'eq',
						value1 : clientCode,
						value2 : clientDesc,
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
						field : 'PaymentMode',
						operator : 'eq',
						value1 : instrumentType,
						dataType : 0,
						displayType : 4
					});
		}

		// Payment Category
		var paymentCategoryValue = me.down('combo[itemId="payCategory"]')
				.getValue();
		if(paymentCategoryValue == 'ACH')
			thisClass.isAchSelected = true;
		else
			thisClass.isAchSelected = false;
		if (!Ext.isEmpty(paymentCategoryValue) && paymentCategoryValue != 'All') {
			jsonArray.push({
						field : 'ProductCategory',
						operator : 'eq',
						value1 : paymentCategoryValue,
						dataType : 0,
						displayType : 6
					});
		}

		// Payment Method
		/*var ProductType = me.down('textfield[itemId="payMethod"]').getValue();
		var productCodesData = me.down('textfield[itemId="payMethod"]').productCodesData;
		if (!Ext.isEmpty(ProductType) && ProductType != 'All') {
			jsonArray.push({
						field : 'paymentCategory',
						operator : 'in',
						value1 : productCodesData,
						value2 : ProductType,
						dataType : 0,
						displayType : 6
					});
		}*/
		
		// Payment Method		
		var payMethodValue = me.down('checkcombo[itemId="payMethod"]');
		var payMethod = payMethodValue.getValue();
		if(!Ext.isEmpty(payMethodValue.getValue()) && !payMethodValue.isAllSelected()){
			jsonArray.push({
				field : 'paymentCategory',
				operator : 'in',
				value1 : payMethod,
				value2 : payMethod,
				dataType : 0,
				displayType : 0,
				detailFilter : 'Y'
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
		var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
		var fromCreation, toCreation, creationFromDate, creationToDate;
		
			var portlet2 = me.down('container[itemId="completDatePanel"]');
			var daterange = portlet2.down('container[itemId="dateRangeComponent"]');
			var index = thisClass.dateFilterVal;
			var objDateParams = thisClass.getDateParam(index);
			
			if (!Ext.isEmpty(index)) {
			jsonArray.push({
						field : 'creationDate',
						value1 : objDateParams.fieldValue1,
						value2 : objDateParams.fieldValue2,
						operator : objDateParams.operator,
						dataType : 'D',
						displayType : 5,
						btnValue : thisClass.dateFilterVal,
						dateLabel :dateLabel
					});
		}
		//  sending account #
		var accountValue = me.down('checkcombo[itemId="AccountNo"]');
		var sendingAcctNo = accountValue.getValue();
		if(!Ext.isEmpty(accountValue.getValue()) && !accountValue.isAllSelected()){
			jsonArray.push({
						field : 'sendingAccnt',
						operator : 'in',
						value1 : sendingAcctNo,
						value2 : sendingAcctNo,
						dataType : 0,
						displayType : 0,
						detailFilter : 'Y'
					});
		}

		return jsonArray;
	},

	getDataPanel : function() {
		return this;
	},
	getClientStore:function(){
		var clientData=null;
		var objClientStore=null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json',
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						clientData = data.d.preferences;
						objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE',
											'DESCR'],
									data : clientData,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														CODE : 'all',
														DESCR : getLabel('allCompanies', 'All Companies')
													});
										}
									}
								});
						objClientStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objClientStore;
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
	getWidgetNamePanel : function(widthFlag){
				var widgetNamePanel = {
							xtype : 'textfield',
							hideTrigger : true,
							width  : (screen.width) > 1024 ? 240 : 200,
							columnWidth : 0.33,
							margin : widthFlag ? '0 20 0 0' : '0 8 0 0',//Top Right Bottom Left
							cls : ' ft-smallMargin-right',
							labelAlign : 'top',
							labelSeparator : '',
							fieldLabel : getLabel("widgetName", "Widget Name"),
							itemId : 'customname',
							fieldCls : 'xn-form-text',
							labelCls : 'frmLabel',
							name : 'customname',
							tabIndex : "1",
							maxLength : 40, // restrict user to enter 40 chars
							// max
							enforceMaxLength : true,
							maskRe : /[A-Za-z0-9 .]/
						};
						return widgetNamePanel;
	},
	
	getClientPanel : function(){
	var thisClass = this;
		var cpanel = {
					xtype : 'container',
					layout : 'hbox',
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-left pagesetting',
					hidden : ((thisClass.getClientStore().getCount() <= 2) || !isClientUser) ? true : false,//If count is one or admin then hide
					items : [{
								xtype : 'textfield',
								fieldLabel : getLabel("batchColumnClient",
										"Company Name"),
								labelPad : 2,
								labelWidth : 55,
								readOnly : true,
								labelAlign : 'top',
								labelCls : 'frmLabel',
								labelSeparator : '',
								itemId : 'Client',
								//id : 'companyName',
								tabIndex : "1",
								fieldCls : 'ux_no-border-right xn-form-field',
								width  : (screen.width) > 1024 ? 220 : 226,
								name : 'Client',
								clientCodesData : ''
							}, {
								xtype : 'button',
								border : 0,
								margin : '19 0 0 0',
								itemId : 'clientBtn',
								cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
								glyph : 'xf0d7@fontawesome',
								height : 36,
								//tabIndex : "1",
								menuAlign : 'tr-br',
								menu : Ext.create('Ext.menu.Menu', {
									itemId : 'clientMenu',
									width  : (screen.width) > 1024 ? 226 : 226,
									cls : 'ux_dropdown ux_dropdown-no-leftpadding',
									maxHeight : 200,
									items : []
								}),
								handler : function(btn, event) {
									btn.menu.show();
								}
							}]
				};
				return cpanel;
	}
});