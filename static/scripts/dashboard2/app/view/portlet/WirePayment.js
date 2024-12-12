Ext.define('Cashweb.view.portlet.WirePayment', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.wirepayment',
	requires : ['Cashweb.store.WirePaymentStore', 'Ext.ux.gcp.AutoCompleter'],
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
	dateFilterLabel : getLabel('thismonth', 'Latest'),
	dateFilterVal : '12',
	dateRangeFilterVal : '13',
	datePickerSelectedDate : [],
	datePickerSelectedEntryDate : [],
	portletref : null,
	dateHandler : null,
	vFromDate1 : null,
	vToDate1 : null,
	filterRestrict : '999',
	accntUrl : "",
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
		var strClient = null;
		var strClientDescr = null;
		creation_date_opt = null;
		thisClass.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		thisClass.emptyText = label_map.noDataFound;
		thisClass.store = new Cashweb.store.PayPendingApprStore();
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

		thisClass.on('cellclick', function(me, td, cellIndex, record, tr,
						rowIndex, e, eOpts) {
					thisClass.fireEvent('navigateToPayments', record);
				});

		thisClass.on('refreshWidget', function() {
					var record = thisClass.record, settings = [],datePresent = false;
					thisClass.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'EntryDate') {
							thisClass.dateFilterVal = settings[i].displayType;
							datePresent = true;
						}
					}
					if (!datePresent) {
						var objDateParams = thisClass.getDateParam('12');
						settings.push({
									field : 'EntryDate',
									value1 : objDateParams.fieldValue1,
									value2 : objDateParams.fieldValue2,
									operator : objDateParams.operator,
									dataType : 'D',
									displayType : 5,
									btnValue : '12',
									dateLabel : getLabel("entryDate", "Entry Date")+" (Latest)"
								});
						var statusValueArr = this.getStatusArray("All");		
						var statusValueString = statusValueArr.join("and");
						var tempStatusValue, tempStatusValue2='';
						if (!Ext.isEmpty(statusValueString)) {
								var statusValueArray=statusValueString.split("and");
								tempStatusValue=statusValueArray.join(',');
								statusValueArray.forEach( function(val,indx){
										var valArr=val.split(',');
										var valJoin = valArr.join('^');
										tempStatusValue2+=valJoin+',';
									});
							}
						settings.push({
										field : 'ActionStatus',
										value1 : tempStatusValue,
										value2 : tempStatusValue2,
										value3 : 'All',
										statusarray :statusValueArr,
										paramValue1 : tempStatusValue,
										operator : 'bt',
										dataType : 0,
										displayType : 6,
										displayValue1 :'All'
									});
					}
					thisClass.record.set('settings', settings);
					filterUrl = thisClass.generateUrl(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});

		thisClass.on('boxready', function(component, eOpts) {
			thisClass.setLoading(label_map.loading);
		});
		thisClass.on('viewready', function(component, eOpts) {
					var settings = [];
					var filterUrl = '';
					var record = thisClass.record,datePresent = false;;
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
//					thisClass.setLoading(label_map.loading);
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'EntryDate') {
							thisClass.dateFilterVal = settings[i].btnValue;
							thisClass.datePickerSelectedDate[0]=Ext.Date.parse(settings[i].value1, 'Y-m-d');
							thisClass.datePickerSelectedDate[1]=Ext.Date.parse(settings[i].value2, 'Y-m-d');
							datePresent = true;
						}
					}
					if (!datePresent) {
						var objDateParams = thisClass.getDateParam('12');
						settings.push({
									field : 'EntryDate',
									value1 : objDateParams.fieldValue1,
									value2 : objDateParams.fieldValue2,
									operator : objDateParams.operator,
									dataType : 'D',
									displayType : 5,
									btnValue : '12',
									dateLabel : getLabel("entryDate", "Entry Date")+" (Latest)"
								});
						var statusValueArr = this.getStatusArray("All");		
						var statusValueString = statusValueArr.join("and");
						var tempStatusValue, tempStatusValue2='';
						if (!Ext.isEmpty(statusValueString)) {
								var statusValueArray=statusValueString.split("and");
								tempStatusValue=statusValueArray.join(',');
								statusValueArray.forEach( function(val,indx){
										var valArr=val.split(',');
										var valJoin = valArr.join('^');
										tempStatusValue2+=valJoin+',';
									});
							}
						settings.push({
										field : 'ActionStatus',
										value1 : tempStatusValue,
										value2 : tempStatusValue2,
										value3 : 'All',
										statusarray :statusValueArr,
										paramValue1 : tempStatusValue,
										operator : 'bt',
										dataType : 0,
										displayType : 6,
										displayValue1 :'All'
									});
					}
					thisClass.record.set('settings', settings);
					filterUrl = thisClass.generateUrl(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});

		var objDefaultArr = [{
					header : getLabel("payReference", "Payment Reference"),
					dataIndex : 'PHDREFERENCE',
					flex : 23,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("entryDate", "Entry Date"),
					dataIndex : 'MAKER_DATE',
					flex : 17,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("processDate", "Process Date"),
					dataIndex : 'PROCESS_DATE',
					flex : 17,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("paymentType", "Payment Type"),
					dataIndex : 'BANKPRODUCTDESCRIPTION',
					flex : 23,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("paymentMethod", "Payment Package"),
					dataIndex : 'PHDPRODUCTDESC',
					flex : 23,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("amount", "Amount"),
					dataIndex : 'TXN_AMNT',
					align : 'right',
					flex : 23,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("status", "Status"),
					dataIndex : 'actionStatus',
					align : 'left',
					flex : 23,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
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

		for (var i = 0; i < columnModel.length; i++) {
			columnModel[i].renderer = function(val, metadata, record) {
				//metadata.tdAttr = 'title="' + (val) + '"';
				metadata['tdAttr'] = 'title="' + (val) + '"';
				metadata.style = 'cursor: pointer;';
				return val;
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
					var filter = thisClass.strFilter;
					if (!Ext.isEmpty(thisClass.accntUrl))
					{
						filter = filter + "&" + thisClass.accntUrl;
					}
					thisClass.fireEvent('seeMorePaymentRecords', filter,
							thisClass.record.get('settings'));
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
	/*addClientMenu : function(summaryPortlet) {
		var menuRef = summaryPortlet.down('menu[itemId="clientMenu"]');
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json?$top=-1&$skip=-1',
			method : 'GET',
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
	},*/
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
	// Sending account field handling starts
	/*addSendingAccountsMenuItems : function(summaryPortlet) {
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
							tooltip : "All",
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
			creation_date_opt = "Creation Date (" + me.dateFilterLabel + ")";
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
			} else
				fromDateLabel.setText(vFromDate);

			toDateLabel.setText("");
		} else {
			fromDateLabel.setText(vFromDate + " - ");
			toDateLabel.setText(vToDate);
			me.vFromDate1 = vFromDate;
			me.vToDate1 = vToDate;
		}
	},*/
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
		return retObj;
	},
		handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#creationDatePicker');
		/*var toDatePickerRef = $('#entryDataToPicker');*/

		if (!Ext.isEmpty(me.dateFilterLabel) && !Ext.isEmpty(me.portletref)) {
			creation_date_opt = getLabel("entryDate", "Entry Date")+" (" + me.dateFilterLabel + ")";
			me.portletref.down('label[itemId="creationDateLbl"]').setText(getLabel("entryDate", "Entry Date") + " (" + me.dateFilterLabel + ")");
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
				/*toDatePickerRef.setDateRangePickerValue(vToDate);*/
			}
		} else {
			if (index === '1' || index === '2') {
					datePickerRef.setDateRangePickerValue(vFromDate);
			} else {
				datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
			}
		}
	},
	generateUrl : function(settings) {
		var me = this;
		var isFilterApplied = false, accountpresent = false;
		var strFilter = '', accntFilter = '';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {
				if (settings[index].field === 'AccountNoPDT') {
					var reg = new RegExp(/[\(\)]/g);
					var objValue = settings[index].value1;
					objValue = objValue.replace(reg, '');
					var objArray = objValue.split(',');
					if (objArray.length > 0) {
						if (objArray[0] != 'All') {
							//isFilterApplied = true;
							accntFilter = accntFilter + '(';
							for (var i = 0; i < objArray.length; i++) {
								accntFilter = accntFilter
										+ settings[index].field + ' eq ';
								accntFilter = accntFilter + '\'' + objArray[i]
										+ '\'';
								if (i != objArray.length - 1)
									accntFilter = accntFilter + ' or ';
							}
							accntFilter = accntFilter + ')';
						}
					}
					me.accntUrl = '$filterDetail=' + accntFilter;
					accountpresent = true;
				}

				if (settings[index].field != 'customname'
						&& settings[index].field != 'AccountNoPDT'
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
							} else if (settings[index].field === 'ActionStatus') {
								if (settings[index].value3 === 'All')//failed
									strFilter = strFilter
											+ "((ActionStatus eq '13' or ActionStatus eq '59') or "
											+ "(ActionStatus eq '1' or ActionStatus eq '2' or ActionStatus eq '3' or ActionStatus eq '31' or ActionStatus eq '30' or ActionStatus eq '32' or ActionStatus eq '108' or ActionStatus eq '109' or " 
											+ "ActionStatus eq '40' or ActionStatus eq '4' or ActionStatus eq '7' or ActionStatus eq '19' or ActionStatus eq '29' or ActionStatus eq '51'" +
													" or ActionStatus eq '52' or ActionStatus eq '53' or ActionStatus eq '54' or ActionStatus eq '55' or ActionStatus eq '56' or ActionStatus eq '57' or ActionStatus eq '62' or ActionStatus eq '63' or ActionStatus eq '64' or ActionStatus eq '65' or ActionStatus eq '66' or ActionStatus eq '67' or ActionStatus eq '68' or ActionStatus eq '69' or ActionStatus eq '70' or ActionStatus eq '71' or ActionStatus eq '94' or ActionStatus eq '95' or ActionStatus eq '96' or ActionStatus eq '14' or ActionStatus eq '28' or ActionStatus eq '43')"
											+ " or (ActionStatus eq '15' or ActionStatus eq '58' or ActionStatus eq '60' or ActionStatus eq '61'))";
								if (settings[index].value3 === '1')//failed
									strFilter = strFilter
											+ "(ActionStatus eq '13' or ActionStatus eq '59')";

								if (settings[index].value3 === '2')//inprocess
									strFilter = strFilter
											+ "(ActionStatus eq '1' or ActionStatus eq '2' or ActionStatus eq '3' or  ActionStatus eq '31' or ActionStatus eq '30' or ActionStatus eq '32' or ActionStatus eq '108' or ActionStatus eq '109' " +
													"ActionStatus eq '40' or ActionStatus eq '4' or ActionStatus eq '7' or ActionStatus eq '9' or ActionStatus eq '19' or ActionStatus eq '29' or ActionStatus eq '51' or ActionStatus eq '52' or ActionStatus eq '53' or ActionStatus eq '54' or ActionStatus eq '55' or ActionStatus eq '56' or ActionStatus eq '57' or ActionStatus eq '62' or ActionStatus eq '63' or ActionStatus eq '64' or ActionStatus eq '65' or ActionStatus eq '66' or ActionStatus eq '67' or ActionStatus eq '68' or ActionStatus eq '69' or ActionStatus eq '70' or ActionStatus eq '71' or ActionStatus eq '94' or ActionStatus eq '95' or ActionStatus eq '96' or ActionStatus eq '14' or ActionStatus eq '28' or ActionStatus eq '43')";

								if (settings[index].value3 === '3')//processed
									strFilter = strFilter
											+ "(ActionStatus eq '15' or ActionStatus eq '58' or ActionStatus eq '60' or ActionStatus eq '61')";
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
		//Added condition as payment center query is not accepting empty $filter
		if (!Ext.isEmpty(strFilter))
		{
			me.strFilter = strFilter;
			strFilter = '?$filter=' + strFilter;
		}

		if (!accountpresent)
			me.accntUrl = "";
		return strFilter;
	},
	ajaxRequest : function(filterUrl, settings) {
		var obj;
		var thisClass = this;
		thisClass.setTitle(settings);
		if (!Ext.isEmpty(thisClass.accntUrl))
			filterUrl = filterUrl + "&" + thisClass.accntUrl;
		if (filterUrl.charAt(0) == "?") { // remove first qstnmark
			filterUrl = filterUrl.substr(1);
		}
		filterUrl += "&$widgetreq=Y";
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = filterUrl || {}, arrMatches;
		if (thisClass.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(filterUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
		}
		Ext.Ajax.request({
					url : 'services/wirePaymentList/paymentsbatch.json',// + filterUrl,
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
		var arrData = data.summary;
		var multipleCcy = "<a title='"+ getLabel("iconBatchFcy", "Multiple Currencies")+ "' class='iconlink grdlnk-notify-icon icon-gln-fcy'></a>";
		if (arrData.length < 5) {
			var fbarInstance = me.down('toolbar');
			fbarInstance.hide();
		}
		if (arrData.length >= 5) {
			var fbarInstance = me.down('toolbar');
			fbarInstance.show();
		}
		if (!Ext.isEmpty(arrData)) {
			for (var i = 0; i < 5 && i < arrData.length; i++) {
				var colJson = {};
				if (arrData[i]) {
					colJson["CCY_SYMBOL"] = (!Ext.isEmpty(colJson["CCY_SYMBOL"])) ? arrData[i].CCY_SYMBOL : "" ;
					colJson["MAKER_DATE"] = arrData[i].MAKER_DATE;
					colJson["PHDREFERENCE"] = arrData[i].PHDREFERENCE
					colJson["PHDTOTALNO"] = arrData[i].PHDTOTALNO, 
					colJson["TXN_AMNT"] =
							(!Ext.isEmpty(arrData[i].CCY_SYMBOL))
							? arrData[i].CCY_SYMBOL + " " + setDigitAmtGroupFormat(arrData[i].TXN_AMNT)
							: multipleCcy + " " + setDigitAmtGroupFormat(arrData[i].TXN_AMNT);
					colJson["USRDESCRIPTION"] = arrData[i].USRDESCRIPTION;
					colJson["BANKPRODUCTDESCRIPTION"] = arrData[i].BANKPRODUCTDESCRIPTION;
					colJson["paymentType"] = arrData[i].paymentType;
					colJson["identifier"] = arrData[i].identifier;
					colJson["productType"] = arrData[i].productType;
					colJson["actionStatus"] = arrData[i].actionStatus;
					colJson["phdnumber"] = arrData[i].phdnumber;
					colJson["PHDPRODUCTDESC"] = arrData[i].PHDPRODUCTDESC;
					colJson["PROCESS_DATE"] = arrData[i].PROCESS_DATE;
				}
				storeData.push(colJson);
			}
		}
		me.getStore().loadData(storeData);
		this.setLoading(false);
	},
	showSettingsPopup : function(widgetCode, titleforsettings, record) {
		var me = this;
		creation_date_opt = null;
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
								tabIndex : "1",
								//cls : 'ux-button-s ft-button-secondary footer-btns',
								handler : function() {
									this.up('window').close();
								}
							}, '->', {
								text : getLabel("save", "Save"),
								tabIndex : "1",
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
		me.getDatePicker();
		//me.addSendingAccountsMenuItems(portletSettings);
		//me.addMyProductsMenuItems(portletSettings);
		//me.addClientMenu(portletSettings);
		//me.addDatePanel(portletSettings);
		//me.addDateMenu(portletSettings);
		me.portletref = portletSettings; // TODO: need to change the dependency of portletref variable
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
	getDatePicker : function() {
		var me = this;
		$('#creationDatePicker').datepick({
			monthsToShow : 1,
			changeMonth : true,
			changeYear : true,
			rangeSeparator : ' to ',
			dateFormat : strjQueryDatePickerDateFormat,
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
				else {
					me.dateFilterVal = '';
					me.dateFilterLabel = '';
					var creationDateLbl = me.down('label[itemId="creationDateLbl"]');
					if(!Ext.isEmpty(creationDateLbl)) creationDateLbl.setText(getLabel("entryDate", "Entry Date"));
				}
			}
			}
		});
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
						var responseData = Ext.decode(response.responseText);
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
					      	}/*,
							{
								"key" : "all",
								"value" : "All"
							}*/]
				});

		var statusStore = Ext.create('Ext.data.Store', {
					fields : ['colId', 'colDesc'],
					data : [{
								"colId" : "All",
								"colDesc" :  getLabel("all","All")
							}, {
								"colId" : "1",
								"colDesc" : getLabel("failed","Failed")
							}, {
								"colId" : "2",
								"colDesc" : getLabel("inprocess","In Process")
							}, {
								"colId" : "3",
								"colDesc" : getLabel("processed","Processed")
							}]
				});

		var clientStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		});
			Ext.Ajax.request({
						url : 'services/userseek/userclients.json',
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
												'CODE' : 'All',
												'DESCR' : getLabel('allCompanies', 'All Companies')
											});
								}
								for (var index = 0; index < count; index++) {
									var record = {
										'CODE' : data[index].CODE,
										'DESCR' : data[index].DESCR
									}
									clientStore.add(record);
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
					type : 'column',
					pack : 'center'
				},
				flex : 1,
				cls : 'ft-padding-bottom',
				items : [
		         {
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
										value : 'All',
										editable : false,
										triggerAction : 'all',
										width : '116%',
										padding : '-4 0 0 0',
										itemId : 'Client',
										id : 'companyName',
										tabIndex : "1",
										mode : 'local',
										emptyText : getLabel('selectCompany', 'Select Company'),
										store : clientStore,
										listeners : {
											'select' : function(combo, record) {
												strClient = combo.getValue();
												strClientDescr = combo.getRawValue();

											}
										}
									}]

						}]
				    },
				    {
					xtype : 'radiogroup',
					columnWidth : 0.3333,
					cls : ((clientStore.getCount() < 2) || !isClientUser) ? 'ft-extraLargeMargin-right' : 'ft-smallMargin-left ft-smallMargin-right',
					columns : [55, 62, 62],
					itemId : 'creditDebitFlag',
					labelAlign : 'top',
					tabIndex : "1",
					labelSeparator : '',
					labelCls : 'f13 ux_font-size14 ux_padding0060',
					fieldLabel : getLabel("transactionType", "Transaction Type"),
					items : [{
								boxLabel : getLabel("all", "All"),
								name : 'creditDebitFlag',
								inputValue : 'All',
								id : 'creditDebitFlagAll',
								checked : true,
								tabIndex : "1"
							}, {
								boxLabel : getLabel("debit", "Debit"),
								name : 'creditDebitFlag',
								inputValue : 'D',
								tabIndex : "1"
							}, {
								boxLabel : getLabel("credit", "Credit"),
								name : 'creditDebitFlag',
								inputValue : 'C',
								tabIndex : "1"
							}]
				}]
			}, {

				xtype : 'container',
				layout : 'column',
				cls : 'ft-padding-bottom',
				flex : 1,
				items : [ {
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
									//cls: 'frmLabel',
									text : getLabel("creationDate", getLabel("entryDate", "Entry Date")+" (Latest)"),
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
						itemId : 'entryDateToContainer',
						layout : 'hbox',
						width: '100%',
						items : [{
							xtype : 'component',
							width : '81%',
							tabIndex : "1",
							itemId : 'creationDateDataPicker',
							filterParamName : 'EntryDate',
							html : '<input type="text"  id="creationDatePicker" tabindex = "1" class="ft-datepicker from-date-range ui-datepicker-range-alignment" style="width: 100%;">'
						}, {
							xtype : 'component',
							cls : 'icon-calendar t7-adjust-cal',
							margin : '1 0 0 0',
							width: '15%',
							html : '<span class=""><i class="fa fa-calendar"></i></span>'
						}]
					}]
				}, {
					xtype : 'AutoCompleter',
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-left ft-smallMargin-right',
					width  : (screen.width) > 1024 ? 220 : 230,
					fieldCls : 'xn-form-text xn-suggestion-box pagesetting t7-adjust-amnt-height',
					labelCls : 'frmLabel',
					fieldLabel : getLabel("createdBy", "Created By"),
					emptyText : getLabel('searchCreator', 'Search By Creator'),
					fitToParent : true,
					labelAlign : 'top',
					tabIndex : "1",
					labelSeparator : '',
					itemId : 'createdBy',
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
					userCodesDesc : '',
					listeners : {
						'select' : function(combo, record) {
							strUser = combo.getValue();
							strUserDescr = combo.getRawValue();
							combo.userCodesData = record[0].data.CODE;
							combo.userCodesDesc = record[0].data.CODE1;
						},
						'change' : function(combo, newValue, oldValue, eOpts) {
							if (Ext.isEmpty(newValue)) {
								combo.userCodesData = "";
								combo.userCodesDesc = "";
							}
						}
					}

				}, 
				{
					xtype : 'container',
					layout : 'vbox',
					columnWidth : 0.3333,
					items : [{
								xtype : 'combo',
								itemId : 'status',
								multiSelect : false,
								labelAlign : 'top',
								tabIndex : "1",
								width  : (screen.width) > 1024 ? 218 : 225,
								labelSeparator : '',
								labelCls : 'frmLabel',
								fieldCls : 'ux_no-border-right xn-form-field',
								cls : 'ft-extraLargeMargin-left',
								triggerBaseCls : 'xn-form-trigger',
								editable : false,
								displayField : 'colDesc',
								valueField : 'colId',
								queryMode : 'local',
								value : 'All',
								store : statusStore,
								fieldLabel : getLabel("status", "Status")
							}]
				}]
			}, {
				xtype : 'container',
				layout : 'column',
				cls : 'ft-padding-bottom',
				flex : 1,
				items : [

				{
					xtype : 'container',
					layout : 'vbox',
					columnWidth : 0.3333,
					itemId : 'sendingAccountContainer',
					cls : 'ft-extraLargeMargin-right pagesetting',
					items : [{
								xtype : 'label',
								text : getLabel("sendingAccounts",
										"Sending Accounts"),
								cls : 'f13 ux_font-size14 ux_padding0060'
							}, Ext.create('Ext.ux.gcp.CheckCombo', {
								valueField : 'CODE',
								displayField : 'DESCR',
								editable : false,
								addAllSelector : true,
								emptyText : getLabel('all','All'),
								tabIndex : "1",
								multiSelect : true,
								width : '111%',
								padding : '-4 0 0 0',
								itemId : 'sendingAccountDropDown',
								isQuickStatusFieldChange : false,
								store : thisClass.getSendingAccStore(thisClass),
								listConfig:{
								   tpl: [
							            '<ul><tpl for=".">',
							                '<li role="option" class="x-boundlist-item" data-qtip="{DESCR}">' +
							                 '<span class="x-combo-checker">&nbsp;</span>'+
							                '{DESCR}</li>',
							            '</tpl></ul>'
							        ]
								 }

							})]
				}, {
					xtype : 'container',
					layout : 'vbox',
					columnWidth : 0.3333,
					cls : 'pagesetting ft-smallMargin-left ft-smallMargin-right',
					items : [{
						xtype : 'label',
						text : getLabel("paymentCategory", "Payment Type"),
						cls : 'frmLabel'
					}, {
						xtype : 'checkcombo',
						editable : false,
						addAllSelector : true,
						padding : '5 0 0 0',
						multiSelect : true,
						tabIndex : "1",
						itemId : 'payCategory',
						valueField : 'CODE',
						displayField : 'DESCR',
						hideTrigger : true,
						width : 218,
						store : thisClass.getPaymentCategoryStore(),
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
				}, {
					xtype : 'container',
					layout : 'vbox',
					columnWidth : 0.3333,
					itemId : 'payMethodContainer',
					cls : 'ft-extraLargeMargin-left pagesetting',
					items : [{
								xtype : 'label',
								text : getLabel("paymentMethod",
											"Payment Package"),
								cls : 'f13 ux_font-size14 ux_padding0060'
							}, Ext.create('Ext.ux.gcp.CheckCombo', {
								valueField : 'CODE',
								displayField : 'DESCR1',
								editable : false,
								addAllSelector : true,
								emptyText : getLabel('all','All'),
								multiSelect : true,
								tabIndex : "1",
								width : '111%',
								padding : '-4 0 0 0',
								itemId : 'payMethodDropDown',
								isQuickStatusFieldChange : false,
								store : thisClass.getPaymentMethodStore(thisClass),
								listConfig:{
								tpl: [
							            '<ul><tpl for=".">',
							                '<li role="option" class="x-boundlist-item" data-qtip="{qtip}">' +
							                 '<span class="x-combo-checker">&nbsp;</span>'+
							                '{DESCR1}</li>',
							            '</tpl></ul>'
							        ]
								 }

							})]
				}]
			},{
				xtype : 'container',
				layout : 'column',
				labelAlign : 'top',
				flex : 1,
				items : [{
							xtype : 'textfield',
							hideTrigger : true,
							columnWidth : 0.3333,
							cls : 'ft-extraLargeMargin-right',
							labelAlign : 'top',
							labelSeparator : '',
							tabIndex : "1",
							fieldLabel : getLabel("widgetName", "Widget Name"),
							itemId : 'customname',
							fieldCls : 'xn-form-text',
							width  : (screen.width) > 1024 ? 218 : 228,
							labelCls : 'frmLabel',
							name : 'customname',
							maxLength : 40, // restrict user to enter 40 chars
							// max
							enforceMaxLength : true,
							maskRe : /[A-Za-z0-9 .]/
						},{
							xtype : 'container',
							layout : 'vbox',
							columnWidth : 0.3333,
							cls : 'pagesetting',
							items : [{
								xtype : 'combo',
								itemId : 'amountRange',
								hideTrigger : true,
								labelAlign : 'top',
								tabIndex : "1",
								cls : 'ft-smallMargin-right ft-smallMargin-left',
								labelSeparator : '',
								labelCls : 'f13 ux_font-size14 ux_padding0060',
								width : (screen.width) > 1024 ? 218 : 225,
								editable : false,
								displayField : 'value',
								valueField : 'key',
								value : 'eq',
								store : rangeStore,
								labelCls : 'frmLabel',
								fieldLabel : getLabel("operator",
										"Operator")
							}]
						},{
							xtype : 'container',
							layout : 'vbox',
							labelAlign : 'top',
							columnWidth : 0.3333,
							cls : 'ft-extraLargeMargin-left',
							items : [{
										xtype : 'label',
										itemId : 'amtLabel',
										text : getLabel('amount', 'Amount'),
										cls : 'frmLabel',
										width : '100%'
									}, {
										xtype : 'panel',
										layout : 'hbox',
										items : [{
											xtype : 'textfield',
											fieldCls : 'xn-valign-middle xn-form-text w7 xn-field-amount',
											allowBlank : true,
											itemId : 'amount',
											name : 'amount',
											tabIndex : "1",
											hideTrigger : true,
											width  : (screen.width) > 1024 ? 218 : 228,
											maxLength : 20,
											enforceMaxLength : true,
											enableKeyEvents : true,
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
									}
									]
						},
						{

							xtype : 'checkboxgroup',
							columns : [80, 100],
							columnWidth : 0.3333,
							cls : 'ft-extraLargeMargin-left ft-margin-t',
							vertical : true,
							//hidden :true,
							hidden : charAllowedPayment === 'S' ? true :false,
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
								tabIndex : "1",
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
									xtype : 'container',
									flex : 0.38
								}, {
									xtype : 'container',
									flex : 0.24
								}]
			}
			]
		});
		return settingsPanel;
	},
	getPaymentCategoryStore : function() {
		var paymentCategoryStore = null;
		var paymentCategoryStoreData = null;
		Ext.Ajax.request({
			url : 'services/paymentMethod.json',
			method : 'GET',
			async : false,
			success : function(response) {
				paymentCategoryStoreData = [];
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d && data.d.instrumentType) {
						data.d.instrumentType.forEach(function(item, index){
							var record = {};
							var instTypeDesc = (NONUSUSER == 'N' && item.instTypeCode == "WIRE")? getLabel(item.instTypeCode+"_US",item.instTypeDescription) : 
								getLabel(item.instTypeCode,item.instTypeDescription)  ;
							record.CODE = item.instTypeCode;
							record.DESCR = instTypeDesc;
							paymentCategoryStoreData.push(record);
						});
					}
				}
			},
			failure : function() {
			}
		});
		if (!Ext.isEmpty(paymentCategoryStoreData)) {
			paymentCategoryStore = Ext.create('Ext.data.Store', {
				fields : ['CODE','DESCR'],
				data : paymentCategoryStoreData
			});
		}
		return paymentCategoryStore;
	},
	getPaymentMethodStore : function(me) {

		var data;

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
						item.qtip=item.CODE + "&nbsp|&nbsp" +item.PRDDESCR;
			        }, this);

				},
				failure : function() {
				}

			});
		var paymentMethStore = null;
		if (!Ext.isEmpty(data)) {
			paymentMethStore = Ext.create('Ext.data.Store', {
						fields : ['CODE','DESCR','DESCR1','qtip'],
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
	getSendingAccStore : function(me) {

		var data;
		Ext.Ajax.request({
			url : 'services/userseek/debitaccounts.json?$top=-1&$skip=-1&$filterCode1='
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
	setSettings : function(widget, settings) {
		var me = this;
		var strSqlDateFormat = 'm/d/Y';
		var temp = widget.down('label[itemId="creationDateLbl"]');
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			fieldVal3 = settings[i].value3;
			operatorValue = settings[i].operator;
			if (fieldName === 'CreditDebitFlag') {
				if (fieldVal === 'D') {
					var debitRadio = widget.down('radio[inputValue="D"]');
					debitRadio.setValue(true);
				}
				if (fieldVal === 'C') {
					var creditRadio = widget.down('radio[inputValue="C"]');
					creditRadio.setValue(true);
				}
			}

			if (fieldName === 'Client') {
				var clientField = widget.down('textfield[itemId=Client]');
				if (!Ext.isEmpty(clientField)) {
					if (!Ext.isEmpty(fieldVal))
						clientField.setValue(fieldVal);
					clientField.clientCodesData = fieldVal;
				}
			}

			if (fieldName === 'Amount') {
				var amountField = widget.down('textfield[itemId=amount]');
				if (!Ext.isEmpty(amountField)) {
					if (!Ext.isEmpty(fieldVal))
						$( '#' + widget.down('textfield[itemId="amount"]').getInputId() ).autoNumeric('set',fieldVal);
				}

				var rangeField = widget.down('combobox[itemId="amountRange"]');
				if (!Ext.isEmpty(rangeField) && 'All' != rangeField) {
					if (!Ext.isEmpty(fieldVal2))
						rangeField.setValue(fieldVal2);
				}
			}

			if (fieldName === 'ProductCategory') {
				var paymentCategoryValue = widget
						.down('combo[itemId="payCategory"]');
				var values = fieldVal.split(',');
				if(!(Ext.isEmpty(paymentCategoryValue) || Ext.isEmpty(values))) {
					paymentCategoryValue.setValue(values)
				}
			}

			if (fieldName === 'ActionStatus') {
				var statusValue = widget.down('combo[itemId="status"]');
				if (!Ext.isEmpty(statusValue)) {
					if (!Ext.isEmpty(fieldVal3))
						statusValue.setValue(fieldVal3);
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

			if (fieldName === 'ProductType') {
				var dataArray1 = fieldVal.split(',');
				var payMethodValue = widget
						.down('combo[itemId="payMethodDropDown"]');
				if (!Ext.isEmpty(payMethodValue)) {
					if (!Ext.isEmpty(dataArray1))
						payMethodValue.setValue(dataArray1);
				}
						}

			if (fieldName === 'AccountNoPDT') {
				var dataArray = fieldVal2.split(',');
				var sendingAccountValue = widget
						.down('combo[itemId="sendingAccountDropDown"]');
				if (!Ext.isEmpty(sendingAccountValue)) {
					if (!Ext.isEmpty(dataArray))
						sendingAccountValue.setValue(dataArray);
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
			if (fieldName === 'EntryDate')  {
			var dateFilterLabel = settings[i].dateLabel;

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
				}
				else if (operatorValue === 'bt') {
					dateFilterRefFrom.setDateRangePickerValue([formattedFromDate, formattedToDate]);
				}
				if (!Ext.isEmpty(dateFilterLabel)) {
					widget.down('label[itemId="creationDateLbl"]').setText(dateFilterLabel);
					creation_date_opt = dateFilterLabel;
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
		var clientCode = me.down('textfield[itemId="Client"]').getValue();
		var clientDesc = me.down('combo[itemId="Client"]').getRawValue();
		if(clientDesc == 'All')
		{
			clientCode = 'all';
		}
		if (!Ext.isEmpty(clientCode) && clientCode != 'all' && clientCode != 'All') {
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
		var instrumentTypeDesc ='';
		var multiPayValue = me.down('checkbox[itemId="multiPayCheckBox"]')
				.getValue();
		var singlePayValue = me.down('checkbox[itemId="singlePayCheckBox"]')
				.getValue();
		if (multiPayValue === true && singlePayValue === true) {
			instrumentType = '';
			instrumentTypeDesc= '';
		} else if (multiPayValue === true) {
			instrumentType = 'B';
			instrumentTypeDesc= 'Batch Transactions';
		} else if (singlePayValue === true) {
			instrumentType = 'Q';
			instrumentTypeDesc= 'Single Transactions';
		}
		if (!Ext.isEmpty(instrumentType)) {
			jsonArray.push({
						field : 'PayCategory',
						operator : 'eq',
						value1 : instrumentType,
						value2 : instrumentTypeDesc,
						dataType : 0,
						displayType : 4
					});
		}
		// Status
		var statusValue = me.down('combo[itemId="status"]').getValue();
		var statusValueArr = this.getStatusArray(statusValue);		
		var statusValueString = statusValueArr.join("and");
		
		var tempStatusValue, tempStatusValue2='';
		if (!Ext.isEmpty(statusValueString)) {
				var statusValueArray=statusValueString.split("and");
				tempStatusValue=statusValueArray.join(',');
				statusValueArray.forEach( function(val,indx){
						var valArr=val.split(',');
						var valJoin = valArr.join('^');
						tempStatusValue2+=valJoin+',';
					});
			}
		
		//if (!Ext.isEmpty(tempStatusValue) && tempStatusValue != 'All') {
			jsonArray.push({
						field : 'ActionStatus',
						value1 : tempStatusValue,
						value2 : tempStatusValue2,
						value3 : statusValue,
						statusarray :statusValueArr,
						paramValue1 : tempStatusValue,
						operator : 'bt',
						dataType : 0,
						displayType : 6,
						displayValue1 :me.down('combo[itemId="status"]').getRawValue()
					});
	//	}

		// Amount
		var amountValue = me.down('textfield[itemId="amount"]').getValue();
		amountValue = $( '#' + me.down('textfield[itemId="amount"]').getInputId() ).autoNumeric( 'get' );
		var rangeValue = me.down('combobox[itemId="amountRange"]').getValue();
		if (rangeValue === 'Less than Equal to')
			rangeValue = 'le';
		else if (rangeValue === 'Less Than')
			rangeValue = 'lt';
		else if (rangeValue === 'Greater than Equal to')
			rangeValue = 'ge';
		else if ( rangeValue === 'Greater Than')
			rangeValue = 'gt';
		else if (rangeValue === 'All' || rangeValue === 'Equal To')
			rangeValue = 'eq';
		var range = me.down('combobox[itemId="amountRange"]').rawValue;
		if (!Ext.isEmpty(amountValue)) {
			jsonArray.push({
						field : 'Amount',
						operator : rangeValue,
						value1 : amountValue,
						value2 : range,
						dataType : 0,
						displayType : 6
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
		// sending account #
		var sendingAcctNo = me.down('combo[itemId="sendingAccountDropDown"]').getValue();
		var sendingAccCombo = me.down('combo[itemId="sendingAccountDropDown"]');
		if (!Ext.isEmpty(sendingAcctNo) && sendingAcctNo != 'All' &&  (sendingAccCombo.value.length != sendingAccCombo.getStore().getCount())) {
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

		// Payment Category
		var paymentCategoryMultiselect = me.down('combo[itemId="payCategory"]');
		if (!(Ext.isEmpty(paymentCategoryMultiselect.getValue()) || paymentCategoryMultiselect.isAllSelected())) {
			jsonArray.push({
						field : 'ProductCategory',
						operator : 'in',
						value1 : paymentCategoryMultiselect.getValue(),
						value2 : paymentCategoryMultiselect.getRawValue(),
						dataType : 0,
						displayType : 6
					});
		}

		// Payment Method
		var ProductType = me.down('combo[itemId="payMethodDropDown"]').getRawValue();
		var productCodesData = me.down('combo[itemId="payMethodDropDown"]').getValue();
		var productTypeCombo = me.down('combo[itemId="payMethodDropDown"]');
		if (!Ext.isEmpty(ProductType) && ProductType != 'All' && (productTypeCombo.value.length != productTypeCombo.getStore().getCount()) ) {
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
		var datePickerText = $('#creationDatePicker').val();
		if(Ext.isEmpty(datePickerText)) {
			thisClass.dateFilterVal = '';
			thisClass.dateFilterLabel = '';
			me.down('label[itemId="creationDateLbl"]').setText(getLabel("entryDate", "Entry Date"));
		}
		var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
		var index = thisClass.dateFilterVal;
		var objDateParams = thisClass.getDateParam(index);
		if (!Ext.isEmpty(index)) {
			jsonArray.push({
						field : 'EntryDate',
						value1 : objDateParams.fieldValue1,
						value2 : objDateParams.fieldValue2,
						operator : objDateParams.operator,
						dataType : 'D',
						displayType : parseInt(index,10),
						btnValue : index,
						dateLabel : dateLabel == null ? getLabel("entryDate", "Entry Date") : dateLabel
					});
		}

		return jsonArray;
	},
	getStatusArray : function(statusVal) {
		var statusArr =[];
		if(statusVal=="All")
		{
			statusArr= ["59","13","1", "2", "3","31","30","32","108","109", "40", "4", "7", "9", "19", "29","14","43","51,52,53,54,55,56,57,62,63,64,65,66,67,68,69,70,71,94,95,96,28","15,58,60,61"];
		}
		if(statusVal=="1")
		{
			statusArr =["59","13"];
		}
		if(statusVal=="2")
		{
			statusArr =["1", "2", "3","31","30","32","108","109", "40", "4", "7", "9", "19","29","14","43","51,52,53,54,55,56,57,62,63,64,65,66,67,68,69,70,71,94,95,96,28"];
		}
		if(statusVal=="3")
		{
			statusArr =["15,58,60,61"];
		}
		return statusArr;
	},
	getDataPanel : function() {
		return this;
	}
});