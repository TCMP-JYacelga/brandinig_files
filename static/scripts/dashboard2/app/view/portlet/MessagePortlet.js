Ext.define('Cashweb.view.portlet.MessagePortlet', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.alerts',
	requires : ['Cashweb.store.MessageStore', 'Ext.Ajax'],
	border : false,
	emptyText : null,
	cls : 'widget-grid',
	taskRunner : null,
	minHeight : 336,
	cols : 2,
	total : 0,
	strFilter : '',
	dateFilterLabel : getLabel('thismonth', 'This Month'),
	dateFilterVal : '5',
	dateHandler : null,
	vFromDate1 : null,
	vToDate1 : null,
	filterRestrict : '999',
	portletref : null,
	datePickerSelectedDate :[],
	enableQueryParam : false,
	alert_date_opt : null,
	titleId : '',
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
		alert_date_opt = null;
		thisClass.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		thisClass.emptyText = label_map.noDataFound;
		this.store = new Cashweb.store.MessageStore();

		thisClass.on('cellclick', function(me, td, cellIndex, record, tr,
				rowIndex, e, eOpts) {
			if (!Ext.isEmpty(record.data.identifier)) {
				thisClass
						.showViewAlertPopup(record, this.up('panel'), rowIndex);
				thisClass.fireMarkAsRead(record, thisClass);
			}
		});

		thisClass.on('refreshWidget', function() {
					var record = thisClass.record, settings = [],datePresent = false;
					var filterUrl = '';
					thisClass.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'eventTime') {
							thisClass.dateFilterVal = settings[i].displayType;
							datePresent = true;
						}
					}
					if (!datePresent) {
						var objDateParams = thisClass.getDateParam('5');
						settings.push({
									field : 'eventTime',
									value1 : objDateParams.fieldValue1,
									value2 : objDateParams.fieldValue2,
									operator : objDateParams.operator,
									dataType : 'D',
									displayType : '5',
									btnValue : '5',
									dateLabel : "Alert Date (This Month)"
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
					var settings = [], messagePortlet, widget;
					var filterUrl = '';
					var record = thisClass.record ,datePresent = false;
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
					}
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'eventTime') {
							thisClass.dateFilterVal = settings[i].displayType;
							thisClass.datePickerSelectedDate[0]=Ext.Date.parse(settings[i].value1, 'Y-m-d');
							thisClass.datePickerSelectedDate[1]=Ext.Date.parse(settings[i].value2, 'Y-m-d');
							datePresent = true;
						}
					}
					if (!datePresent) {
						var objDateParams = thisClass.getDateParam('5');
						settings.push({
									field : 'eventTime',
									value1 : objDateParams.fieldValue1,
									value2 : objDateParams.fieldValue2,
									operator : objDateParams.operator,
									dataType : 'D',
									displayType : '5',
									btnValue : '5',
									dateLabel : "Alert Date (This Month)"
								});
					}
					thisClass.record.set('settings', settings);
//					this.setLoading(label_map.loading);
					filterUrl = this.generateUrl(settings);
					this.ajaxRequest(filterUrl, settings);
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
		var objDefaultArr = [{
					header : getLabel("alertDate","Alert Date"),
					dataIndex : 'eventTime',
					align : 'left',
					flex : 2,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : label_map.subjectLabel,
					dataIndex : 'subject',
					align : 'left',
					flex : 3,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("serviceModule", "Module"),
					dataIndex : 'module',
					align : 'left',
					flex : 2,
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
			columnModel[i].renderer = function(value, meta, record, row,
					column, store) {
				meta.style = 'cursor: pointer;';
				if (meta.column.dataIndex === "eventTime") {
					var dateFormat = serverdateFormat + " H:i:s";
					var newDate = Ext.Date.parse(value, dateFormat);
					var msgDate = Ext.Date.format(newDate, serverdateFormat);

					if (record.data.msgStatus != 'R') {
						var cls = 'dashboard-msgs';
						var formattedDate = msgDate;
						meta.tdAttr = 'title="' + (formattedDate) + '"';
						return formattedDate;
					} else {
						meta.tdAttr = 'title="' + (msgDate) + '"';
						return msgDate;
					}
				} else if (meta.column.dataIndex === "subject") {
					var appendedString = value;
					if (record.get('msgStatus') == "U"
							|| record.get('msgStatus') == "N") {
						meta.style = 'font-weight: bold !important;'
					}
					meta.tdAttr = 'title="' + (appendedString) + '"';
					return appendedString;
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
					var filter = thisClass.strFilter;
					thisClass.fireEvent('navigateToAlert', filter,
							thisClass.record.get('settings'));
				}

			}]
		}];

		thisClass.callParent();
	},
	getClientData : function() {
		var me = this;
		var clientStoreData = [];
		var clientStore = null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json?$top=-1&$skip=-1',
			method : 'POST',
			async : false,
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var data = responseData.d.preferences || [];
				
				if(data.length > 1) {
					var allRecord = {};
					allRecord.CODE = 'all';
					allRecord.DESCR = getLabel('allCompanies', 'All companies');
					clientStoreData.push(allRecord);
					data.forEach(function(item, index){
						clientStoreData.push(item);
					});
				} else if(data.length === 1) {
					clientStoreData = data;
				}
			},
			failure : function(summaryPortlet) {
				thisClass.getTargetEl().unmask();
				thisClass.setLoading(false);
				
			}
		});
		clientStore = Ext.create('Ext.data.Store', {
			fields : ['CODE','DESCR'],
			data : clientStoreData
		});
		return clientStore;
	},
	
	manageClientCombo : function(portletSettings) {
		clientCombo = portletSettings.down('combo[itemId="companyCombo"]');
		var count = clientCombo.getStore().getTotalCount();
		if (count == 1) {
			clientCombo.up('container[itemId="clientMenuContainer"]').hide();
		} else {
			clientCombo.setValue(clientCombo.getStore().getAt(0));
		}
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
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					align : objCol.align,
					renderer : objCol.renderer
				};
				if (!Ext.isEmpty(objCol.locked))
					objCfg.locked = objCol.locked;
				arrColPref.push(objCfg);
			}
		}
		objState['columns'] = arrColPref;
		return objState;
	},
	addClientMenu : function(messagePortlet) {
		var menuRef = messagePortlet.down('menu[itemId="clientMenu"]');
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
										var clientField = messagePortlet
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
										var clientField = messagePortlet
												.down('textfield[itemId="Client"]');
										clientField.setValue(item.text);
										clientField.clientCodesData = item.clientCode;
									}
								});
					}
					if (menuRef.items.length == 1) {
						messagePortlet.down('textfield[itemId="Client"]')
								.setValue(menuRef.items.items[0].text);
					} else {
						if (Ext.isEmpty(messagePortlet
								.down('textfield[itemId="Client"]').getValue()))
							messagePortlet.down('textfield[itemId="Client"]')
									.setValue(menuRef.items.items[0].text);
					}
				}
			},
			failure : function(messagePortlet) {

			}
		});
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
	// Payment Method field handlling ends
	/*handleDateChange : function(portlet2, index) {
		var me = this;
		var objDateParams = me.getDateParam(index, null);
		var fromDateLabel = portlet2.down('label[itemId="dateFilterFrom"]');
		var toDateLabel = portlet2.down('label[itemId="dateFilterTo"]');
		fromDateLabel.addCls("label-font-normal");
		toDateLabel.addCls("label-font-normal");		
		fromDateLabel.show();
		toDateLabel.show();
		if (!Ext.isEmpty(me.dateFilterLabel)) {
		alert_date_opt = "Alert Date (" + me.dateFilterLabel + ")";
			portlet2.down('label[itemId="creationDateLbl"]')
					.setText("Alert Date" + " (" + me.dateFilterLabel + ")");
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
	
	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#alertsDatePicker');
		if (!Ext.isEmpty(me.dateFilterLabel) && !Ext.isEmpty(me.portletSettingObj)) {
			me.portletSettingObj.down('label[itemId="creationDateLbl"]').setText("Alert Date" + " (" + me.dateFilterLabel + ")");
			alert_date_opt = "Alert Date (" + me.dateFilterLabel + ")";
		}

		var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'), strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'), strExtApplicationDateFormat);
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
				var fromDate = new Date(Ext.Date.parse(from_date_admin, dtFormat));
			    var toDate = new Date(Ext.Date.parse(to_date_admin, dtFormat));		
				 
				fieldValue1 = Ext.Date.format(
							fromDate,
							strSqlDateFormat);
				fieldValue2 = Ext.Date.format(
							toDate,
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
		return retObj;
	},

	generateUrl : function(settings) {
		var me = this;
		var isFilterApplied = false;
		var strFilter = '';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {

				if (settings[index].field != 'customname') {
					if (isFilterApplied && !Ext.isEmpty(settings[index].operator))
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

	showViewAlertPopup : function(record, messagePortlet, rowIndex) {
		var buttonsOpts = {};
		buttonsOpts[btnsArray['okBtn']] = function() {
			$(this).dialog("close");
		};
		var date = record.data.eventTime;
		$('#viewAlertPopup').dialog({
					bgiframe : true,
					autoOpen : false,
					/*height : "auto",*/
					modal : true,
					resizable : false,
					draggable: false,
					maxHeight : 550,
					minHeight : 156,
					title : getLabel('viewAlert',"View Alert"),
					width : 600,
					cls : 'ui-dialog ui-dialog-titlebar-close'
				});
		//$('#viewAlertPopup')
		//		.addClass("ux_panel-transparent-background ux_font-size14-normal");
		$('#subject').text(record.data.subject);
		$('#sent').text(date.toString());
		$('#from').text(record.data.senderMail);
		//$('#messageText').addClass("ux_font-size14-normal");
		$('#messageText')
				.html(record.data.messageText.replace(/\n/g, '<br />'));
		$('#viewAlertPopup').dialog("open");
	},

	fireMarkAsRead : function(record, messagePortlet) {
		var me = this;
		var settings = me.record.get('settings');
		if (record.get('msgStatus') == "U" || record.get('msgStatus') == "N") {
			var strUrl = Ext.String.format('MsgCenterAlert/read.srvc?');
			strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
			var arrayJson = new Array();

			records = record;
			arrayJson.push({
						identifier : records.data.identifier,
						jornalNmbr : records.data.jornalNmbr
					});

			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							me
									.ajaxRequest("?$filter=" + me.strFilter,
											settings);
						},
						failure : function(response) {
							messagePortlet.ownerCt.setLoading(false);
							this.mask = new Ext.LoadMask(messagePortlet, {
										msgCls : 'error-msg'
									});
							if (response.timedout) {
								this.mask.msg = label_map.timeoutmsg;
							} else if (response.aborted) {
								this.mask.msg = label_map.abortmsg;
							} else {
								if (response.status === 0) {
									thisClass.mask.msg = label_map.serverStopmsg;
								} else
									this.mask.msg = response.statusText;
							}
							this.mask.show();
						}
					});

		}
	},

	ajaxRequest : function(filterUrl, settings) {
		var obj;
		var thisClass = this;
		thisClass.setTitle(settings);
		if (filterUrl.charAt(0) == "?") { // remove first qstnmark
			filterUrl = filterUrl.substr(1);
		}
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = filterUrl || {}, arrMatches;
		if (thisClass.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(filterUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
		}
		Ext.Ajax.request({
					url : 'services/getAlertList.json',// + filterUrl,
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
					colJson["identifier"] = arrData[i].identifier;
					colJson["jornalNmbr"] = arrData[i].jornalNmbr;
					colJson["eventId"] = arrData[i].eventId;
					colJson["messageText"] = arrData[i].messageText;
					colJson["recipient"] = arrData[i].recipient;
					colJson["recipientMail"] = arrData[i].recipientMail
					colJson["senderMail"] = arrData[i].senderMail;
					colJson["senderName"] = arrData[i].senderName;
					colJson["msgStatus"] = arrData[i].msgStatus;
					colJson["subject"] = arrData[i].subject;
					colJson["eventTime"] = arrData[i].eventTime;
					colJson["module"] = arrData[i].eventDesc;
				}
				storeData.push(colJson);
			}
		}
		me.getStore().removeAll();
		me.getStore().loadData(storeData);
		me.setLoading(false);
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
	showSettingsPopup : function(widgetCode, titleforsettings, record) {
		alert_date_opt = null;
		var me = this;
		var portletSettings = Ext.create('Ext.window.Window', {
					record : record,
					minHeight : 200,
					cls : 'settings-popup xn-popup',
					buttonAlign : 'center',
					itemId : widgetCode + 'SettingsPanel',
					title : titleforsettings,
					autoHeight : true,
					width  : (screen.width) > 1024 ? 735 : 733,
					minHeight : 156,
					maxHeight : 550,
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
								//cls : 'ux-button-s',
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
		me.portletSettingObj = portletSettings;
		/* me.addClientMenu(portletSettings);*/ 
		/*me.addDatePanel(portletSettings);*/
		/*me.addDateMenu(portletSettings);*/
		me.manageClientCombo(portletSettings);
		me.manageAlertDatePicker();
		me.portletref = portletSettings;
		me.setSettings(portletSettings, me.record.get('settings'));
		if(portletSettings.down('combo[itemId="companyCombo"]').up().hidden)
		{
			for (var i= 0;i < portletSettings.down('radiogroup[itemId="typeFlag"]').items.length;i++)
			{
				if(portletSettings.down('radiogroup[itemId="typeFlag"]').items.items[i].checked)
				{
					portletSettings.down('radiogroup[itemId="typeFlag"]').items.items[i].focus();
					break;
				}
			}
		}
		else
		{
			Ext.getCmp('companyName').focus();
		}
	},
	
	manageAlertDatePicker : function() {
		var me = this;
		$('#alertsDatePicker').datepick({
			monthsToShow : 1,
			changeMonth : true,
			changeYear : true,
			rangeSeparator : ' to ',
			dateFormat : strjQueryDatePickerDateFormat,
			onClose : function(dates) {
				var datePickerText = $('#alertsDatePicker').val();
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
						if(!Ext.isEmpty(creationDateLbl)) creationDateLbl.setText("Alert Date");
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
		var me = this;
		var responseData = data = null;
		var moduleStore = null; 
		Ext.Ajax.request({
					url : 'services/userseek/getModule.json?$top=-1&$skip=-1',
					method : 'GET',
					async : false,
					success : function(response) {
						responseData = Ext.decode(response.responseText);
						data = responseData.d.preferences;
					},
					failure : function() {
					}
				});
		for(var i=0; i< data.length;i++)
		{
			data[i].MODULE_NAME = getModuleLabel(data[i].MODULE_CODE , data[i].MODULE_NAME);
		}
		if (!Ext.isEmpty(responseData)) {
			moduleStore = Ext.create('Ext.data.Store', {
				fields : ['MODULE_CODE', 'MODULE_NAME'],
				data : data
			});
		}

		var settingsPanel = Ext.create('Ext.panel.Panel', {
			items : [{
				xtype : 'container',
				cls : 'ft-padding-bottom',
				layout : {
					type : 'column',//'hbox',
					pack : 'center'
				},
				flex : 1,
				items : [						
						{
							xtype : 'container',
							layout : 'vbox',
							columnWidth : 0.3333,
							itemId : 'clientMenuContainer',
							cls : 'ft-smallMargin-left pagesetting',
							items : [{
										xtype : 'label',
										itemId : 'amtLabel',
										text :  getLabel("company", "Company Name"),
										cls : 'frmLabel',
										width : '100%'
									}, {
										xtype : 'combobox',
										editable : false,
										id : 'companyName',
										matchFieldWidth : true,
										valueField : 'CODE',
										displayField : 'DESCR',
										itemId : 'companyCombo',
										store : this.getClientData(),
										hideTrigger : true,
										width : 218
										/*padding : '0 5 0 0'*/
									}]
						},
						{
							xtype : 'radiogroup',
							//flex : 0.38,
							columnWidth : 0.3333,
							cls : 'ft-smallMargin-right ft-smallMargin-left pagestting',
							columns : [51, 62, 74],
							itemId : 'typeFlag',
							labelAlign : 'top',
							labelSeparator : '',
							labelCls : 'frmLabel',
							fieldLabel : 'Type',
							items : [{
										boxLabel : getLabel("all", "All"),
										name : 'typeFlag',
										inputValue : 'All',
										id :'typeFlagAll',
										checked : true
									}, {
										boxLabel : getLabel("read", "Read"),
										name : 'typeFlag',
										inputValue : 'R'
									}, {
										boxLabel : getLabel("unRead", "Unread"),
										name : 'typeFlag',
										inputValue : 'U'
									}]
						}]
			}, {
				xtype : 'container',
				layout : 'column',//'hbox',
				cls : 'ft-padding-bottom pagesetting',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'vbox',
					itemId : 'completDatePanel',
					//flex : 0.38,
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-left ft-smallMargin-right',
					width : '100%',
					items : [{
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'creationDateLbl',
									name : 'creationDateLbl',
									text : getLabel("alertDate",
											"Alert Date"),
									height : 19,
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
											            	    		if(Ext.isEmpty(alert_date_opt))
												            	    		tip.update('Alert Date');
												            	    	else
												            	    		tip.update(alert_date_opt);

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
					},
					{
						xtype : 'container',
						itemId : 'CreateDate',
						layout : 'hbox',
						width: 218,
						items : [{
							xtype : 'component',
							width : '87%',
							itemId : 'alertDateDataPicker',
							filterParamName : 'EntryDate',
							html : '<input type="text"  id="alertsDatePicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment" style="width: 100%;">'
						}, {
							xtype : 'component',
							cls : 'icon-calendar t7-adjust-cal',
							margin : '1 0 0 0',
							html : '<span class=""><i class="fa fa-calendar"></i></span>'
						}]
					}]
				},
				{
					xtype : 'container',
					layout : 'vbox',
					//flex : 0.38,
					cls : 'ft-smallMargin-right ft-smallMargin-left pagestting',
					columnWidth : 0.3333,
					items : [{
									xtype : 'container',
									layout : 'vbox',
									columnWidth : 0.3333,
									items : [{
										xtype : 'label',
										text :getLabel("module", "Module"),
										cls : 'frmLabel'
									}, {
										xtype : 'checkcombo',
										editable : false,
										addAllSelector : true,
										multiSelect : true,
										itemId : 'module',
										valueField : 'MODULE_CODE',
										displayField : 'MODULE_NAME',
										hideTrigger : true,
										width : (screen.width) > 1024 ? 218 : 228,
										store : moduleStore
									}]
								}
					]
				},
				{
					xtype : 'textfield',
					hideTrigger : true,
					cls : 'ft-extraLargeMargin-left pagestting',
					columnWidth : 0.3333,
					labelAlign : 'top',
					labelSeparator : '',
					fieldLabel : getLabel("widgetName", "Widget Name"),
					itemId : 'customname',
					fieldCls : 'xn-form-text',
					labelCls : 'frmLabel',
					width : (screen.width) > 1024 ? 218 : 228,
					name : 'customname',
					maxLength : 20, // restrict user to enter 40 chars max
					enforceMaxLength : true,
					maskRe : /[A-Za-z0-9 .]/
				}
				]
			}]
		});
		return settingsPanel;
	},

	setSettings : function(widget, settings) {
		var me = this;
		var strSqlDateFormat = 'm/d/Y';
		var temp = widget.down('label[itemId="creationDateLbl"]');
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			operatorValue = settings[i].operator;

			if (fieldName === 'typeFlag') {
				if (fieldVal === 'R') {
					var readRadio = widget.down('radio[inputValue="R"]');
					readRadio.setValue(true);
				}
				if (fieldVal === 'U' || fieldVal.indexOf('U') > 0) {
					var unreadRadio = widget.down('radio[inputValue="U"]');
					unreadRadio.setValue(true);
				}
			}

			if (fieldName === 'clientCode') {
				var clientField = widget.down('combo[itemId="companyCombo"]');
				if (!Ext.isEmpty(clientField)) {
					if (!Ext.isEmpty(fieldVal))
						clientField.setValue(fieldVal);
					//clientField.clientCodesData = fieldVal;
				}
			}

			if (fieldName === 'alertModule') {
				var moduleValue = widget.down('checkcombo[itemId="module"]');
				var values = fieldVal.split(',');
				if (!Ext.isEmpty(moduleValue) || Ext.isEmpty(values)) {
					if (!Ext.isEmpty(fieldVal))
						moduleValue.setValue(values);
				}
				
			}

			if (fieldName === 'eventTime') {
				var dateLabel = settings[i].dateLabel;
				me.dateFilterLabel = settings[i].dateLabel.substring(settings[i].dateLabel.indexOf('(')+1,settings[i].dateLabel.indexOf(')'));
				me.dateFilterVal =  settings[i].btnValue;
				me.datePickerSelectedDate[0] = Ext.Date.parse(settings[i].value1, 'Y-m-d');
				me.datePickerSelectedDate[1] = Ext.Date.parse(settings[i].value2, 'Y-m-d');
				
				var dateFilterRefFrom = $('#alertsDatePicker');
				if (!Ext.isEmpty(fieldVal)) 
					 formattedFromDate = Ext.util.Format.date(Ext.Date.parse(fieldVal, 'Y-m-d'), strExtApplicationDateFormat);
				if (!Ext.isEmpty(fieldVal2))
					formattedToDate = Ext.util.Format.date(Ext.Date.parse(fieldVal2, 'Y-m-d'), strExtApplicationDateFormat);
				if (operatorValue === 'eq' || operatorValue === 'le') {
					dateFilterRefFrom.val(formattedFromDate);
				} else if (operatorValue === 'bt') {
					dateFilterRefFrom.datepick('setDate',[formattedFromDate, formattedToDate]);
				}
				if (!Ext.isEmpty(dateLabel)) {
					widget.down('label[itemId="creationDateLbl"]').setText(dateLabel);
					alert_date_opt = dateLabel;
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
		// Client
		var clientCode = me.down('textfield[itemId="companyCombo"]').getValue();
		var clientDesc = me.down('textfield[itemId="companyCombo"]').getRawValue();
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

		// Module 
		var moduleCombo = me.down('checkcombo[itemId="module"]');
		var moduleNo = moduleCombo.getValue();
		if (!(Ext.isEmpty(moduleNo) || moduleCombo.isAllSelected())) {
			jsonArray.push({
						field : 'alertModule',
						operator : 'in',
						value1 : moduleNo,
						value2 : moduleNo,
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

		// type
		var typeValue = me.down('radiogroup[itemId="typeFlag"]').getValue().typeFlag;
		var typeValue2 = typeValue;
		if(typeValue == 'U'){
			typeValue = 'U,N';
		}
		if (!Ext.isEmpty(typeValue) && typeValue != 'All') {
			if (typeValue === 'R') {
			jsonArray.push({
						field : 'typeFlag',
						operator : 'in',
						value1 : typeValue,
						value2 : typeValue2,
						dataType : 0,
						displayType : 4
					});
			} else {
				jsonArray.push({
					field : 'typeFlag',
					operator : 'in',
					value1 : 'N,U',
					value2 : 'N,U',
					dataType : 0,
					displayType : 4
				});
		}

				
		}
		// Alert Date
		var datePickerText = $('#alertsDatePicker').val();
		if(Ext.isEmpty(datePickerText)) {
			thisClass.dateFilterVal = '';
			thisClass.dateFilterLabel = '';
			me.down('label[itemId="creationDateLbl"]').setText("Alert Date");
		}
		var index = thisClass.dateFilterVal;
		var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
		var objDateParams = thisClass.getDateParam(index);
		if (!Ext.isEmpty(objDateParams.fieldValue1)) {
			jsonArray.push({
				field : 'eventTime',
				value1 : objDateParams.fieldValue1,
				value2 : objDateParams.fieldValue2,
				operator : objDateParams.operator,
				dateLabel : dateLabel,
				dataType : 'D',
				displayType : index,
				btnValue : index
			});
		}
		return jsonArray;
	},

	getDataPanel : function() {
		return this;
	}
});