Ext.define('Cashweb.view.portlet.ReportsForYou', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.reportsforyou',
	requires : ['Cashweb.store.ReportsForYouStore'],
	border : false,
	emptyText : null,
	cls : 'widget-grid',
	taskRunner : null,
	minHeight : 336,
	cols : 3,
	total : 0,
	strFilter : '',
	//dateFilterLabel : 'Generation Date( Latest )',
	//dateFilterVal : '12',
	dateHandler : null,
	vFromDate1 : null,
	allClientMenuData : [],
	vToDate1 : null,
	filterRestrict : '999',
	enableQueryParam : false,
	generation_date_opt : null,
	dateFilterLabel : getLabel('thismonth', 'This Week'),
	dateFilterVal : '3',
	datePickerSelectedDate : [],
	datePickerSelectedEntryDate : [],
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
			var clickedColumn = me.getGridColumns()[cellIndex];
			var columnType = clickedColumn.xtype;
			if(columnType !== 'actioncolumn'){
				thisClass.fireEvent('navigateToReports',
						thisClass.strFilter, thisClass.record
						.get('settings'));
			}
		});

		thisClass.on('refreshWidget', function() {
			var record = thisClass.record, settings = [], isClientPresent = false ,datePresent = false;
			var filterUrl = '';
			thisClass.setLoading(label_map.loading);
			if (!Ext.isEmpty(record.get('settings')))
				settings = record.get('settings');
			for (var i = 0; i < settings.length; i++) {
				if (settings[i].field == 'client') {
					isClientPresent = true;
				}
				if (settings[i].field === 'generationDate') {
					thisClass.dateFilterVal = settings[i].displayType;
					datePresent = true;
			}
			}
			if (!datePresent) {
				var objDateParams = thisClass.getDateParam('3');
				settings.push({
							field : 'generationDate',
							value1 : objDateParams.fieldValue1,
							value2 : objDateParams.fieldValue2,
							operator : objDateParams.operator,
							dataType : 'D',
							displayType : '5',
							btnValue : '3',
							dateLabel : "Generation Date (This Week)"
						});
			}
			thisClass.record.set('settings', settings);
			if (isClientPresent) {
				filterUrl = thisClass.generateUrl(settings);
				thisClass.ajaxRequest(filterUrl, settings);
			} else {
				thisClass.getClientMenuData(settings);
			}
		});

		thisClass.on('boxready', function(component, eOpts) {
			thisClass.setLoading(label_map.loading);
		});
		thisClass.on('viewready', function(component, eOpts) {
					var settings = [], summaryPortlet, widget, isClientPresent = false ,datePresent = false;
					var filterUrl = '';
					var record = thisClass.record;
					summaryPortlet = thisClass.up('panel');
					widget = summaryPortlet.widgetCode;
//					thisClass.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field == 'client') {
							isClientPresent = true;
						}
						if (settings[i].field === 'generationDate') {
							thisClass.dateFilterVal = settings[i].displayType;
							datePresent = true;
					}
					}
					if (!datePresent) {
						var objDateParams = thisClass.getDateParam('3');
						settings.push({
									field : 'generationDate',
									value1 : objDateParams.fieldValue1,
									value2 : objDateParams.fieldValue2,
									operator : objDateParams.operator,
									dataType : 'D',
									displayType : '5',
									btnValue : '3',
									dateLabel : "Generation Date (This Week)"
								});
					}
					thisClass.record.set('settings', settings);
					if (isClientPresent) {
						filterUrl = thisClass.generateUrl(settings);
						thisClass.ajaxRequest(filterUrl, settings);
					} else {
						thisClass.getClientMenuData(settings);
					}
				});

		thisClass.store = new Cashweb.store.ReportsForYouStore();
		var objDefaultArr = [ {
					  header : getLabel("repgenerationDate", "Generation Date"),
			          dataIndex : 'CREATED_DATE',
					  flex : 33,
					  sortable : false,
					  hideable : false,
					  menuDisabled:true,
					  draggable :false,
					  resizable : false
		         },
		             {
						header : label_map.reportname,
						dataIndex : 'SRC_NAME',
						flex : 33,
						sortable : false,
						hideable : false,
						menuDisabled:true,
						draggable :false,
						resizable : false
				},
		            {
			         header : label_map.moduleName,
			         dataIndex : 'MODULE_NAME',
			         flex : 33,
			         sortable : false,
					  hideable : false,
					  menuDisabled:true,
					  draggable :false,
					  resizable : false
		       },
	                {
			         header : getLabel("Company", "Company"),
			         dataIndex : 'CLIENT_DESC',
			         flex : 33,
			         sortable : false,
					  hideable : false,
					  menuDisabled:true,
					  draggable :false,
					  resizable : false
		           }
				 ];

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
				metadata.tdAttr = 'title="' + (val) + '"';
				metadata.style = 'cursor: pointer;';
				return val;
			}
		}

		thisClass.columns = columnModel;

		var actionColumn = {
			header : '',
			xtype : 'actioncolumn',
			dataIndex : 'ACTION_COLUMN',
			align : 'left',
			hideable : false,
			//margin: '0 0 5 0',
			width : 50,
			tooltip : getLabel( 'Download', 'Download' ),
			sortable : false,
			header : label_map.link,
			getClass : function(value, metaData, record, rowIndex, colIndex,
					store, view) {
				if (!Ext.isEmpty(record.data.fileName))
					return "grid-row-action-icon download-icon";
			},
			handler : function(grid, rowIndex, columnIndex, item, event, record) {
				
				thisClass.submitRequest('Download', record);
			}
		}

		columnModel.splice(4, 0, actionColumn);
		thisClass.columns = columnModel;

		this.dockedItems = [{
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
					thisClass.fireEvent('navigateToReports', filter,
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
				if (objCol.dataIndex === "ACTION_COLUMN") {
				} else {
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
		}
		objState['columns'] = arrColPref;
		return objState;
	},
	getClientMenuData : function(settings) {
		var me = this;
		Ext.Ajax.request({
					url : 'services/userseek/userclients.json?$top=-1&$skip=-1',
					method : 'POST',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						me.allClientMenuData = responseData.d.preferences;
						/*if (me.allClientMenuData.length > 0) {
							settings.push({
										field : 'client',
										operator : 'eq',
										value1 : 'all',
										value2 : '',
										dataType : 0,
										displayType : 6
									});
						}*/
						filterUrl = me.generateUrl(settings);
						me.ajaxRequest(filterUrl, settings);
					},
					failure : function(settings) {
						thisClass.getTargetEl().unmask();
						thisClass.setLoading(false);
					}
				});
	},

	addClientMenu : function(summaryPortlet) {
		var me = this;
		var menuRef = summaryPortlet.down('menu[itemId="clientMenu"]');
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json?$top=-1&$skip=-1',
			method : 'POST',
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				me.allClientMenuData = responseData.d.preferences;
				var data = me.allClientMenuData
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
					if (me.record.get('settings').length > 0) {
					} else {
						if (menuRef.items.length == 1) {
							summaryPortlet.down('textfield[itemId="Client"]')
									.setValue(menuRef.items.items[0].text);
						} else {
							summaryPortlet.down('textfield[itemId="Client"]')
									.setValue(menuRef.items.items[0].text);
						}
					}
				}
			},
			failure : function(settings) {
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
					margin : '0 0 0 2',
					width : 83,
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
	handleDateChange : function(portlet2, index) {
		var me = this;
		var objDateParams = me.getDateParam(index, null);
		var fromDateLabel = portlet2.down('label[itemId="dateFilterFrom"]');
		var toDateLabel = portlet2.down('label[itemId="dateFilterTo"]');
		fromDateLabel.show();
		toDateLabel.show();
		fromDateLabel.addCls("label-font-normal");
		toDateLabel.addCls("label-font-normal");		
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			generation_date_opt = "Generation Date (" + me.dateFilterLabel + ")";
			portlet2.down('label[itemId="creationDateLbl"]')
					.setText("Generation Date" + " (" + me.dateFilterLabel
							+ ")");
		}
		vFromDate = Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d');
		vToDate = Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d');

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
		if (index === '1' || index === '2') {
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
	//	retObj.btnValue = index;
		return retObj;
	},


	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#creationDatePicker');
		var toDatePickerRef = $('#entryDataToPicker');

		if (!Ext.isEmpty(me.dateFilterLabel) && !Ext.isEmpty(me.portletref)) {
			me.portletref.down('label[itemId="creationDateLbl"]')
			.setText("Generation Date" + " (" + me.dateFilterLabel + ")");
			generation_date_opt = "Generation Date (" + me.dateFilterLabel + ")";
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
		var isFilterApplied = false;
		var strFilter = '';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {

				if (settings[index].field != 'customname'
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
		if (!Ext.isEmpty(strFilter)) {
			me.strFilter = strFilter;
			strFilter = '?$filter=' + strFilter;
		}
		return strFilter;
	},
	ajaxRequest : function(filterUrl, settings) {
		var obj;
		var me = this;
		me.setTitle(settings);
		var thisClass = this;
		
		var strSqlDateFormat = 'Y-m-d';
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(dtApplicationDate, dtFormat));
		var appDate = Ext.Date.format(date, strSqlDateFormat);

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
					url : 'services/getReportsForYou.json',// strUrl,
					method : 'POST',
					params : objParam,
					success : function(response) {
						obj = Ext.decode(response.responseText);
						thisClass.loadData(obj);

						thisClass.setRefreshLabel();
					},
					failure : function(response) {
						if (response.status === 0) {
							thisClass.mask.msg = label_map.serverStopmsg;
						} else if (response.status === 400) {
							thisClass.setLoading(false);
							var fbarInstance = thisClass.down('toolbar');
							fbarInstance.hide();
						} else if (response.status === 500) {
							thisClass.setLoading(false);
							var fbarInstance = thisClass.down('toolbar');
							fbarInstance.hide();
						} else
							thisClass.mask.msg = response.statusText;
					}
				});
	},
	setRefreshLabel : function() {
		var thisClass = this;
		$("#" + thisClass.titleId).empty();
		var label = Ext.create('Ext.form.Label', {
					text : getLabel('asof','As of ')+ displaycurrenttime(),
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
	loadData : function(data) {
		var storeData = [];
		var arrData = data.d.preGeneratedReport;
		if (data.d.__count < 5 || data.d.__count == undefined) {
			var fbarInstance = this.down('toolbar');
			fbarInstance.hide();
		}
		if (data.d.__count >= 5) {
			var fbarInstance = this.down('toolbar');
			fbarInstance.show();
		}
		if (!Ext.isEmpty(arrData)) {
			for (var i = 0; i < 5 && i < arrData.length; i++) {
				var colJson = {};
			
				if (arrData[i]) {
					colJson["CREATED_DATE"] = arrData[i].genDateTimeStr;
					colJson["SRC_NAME"] = arrData[i].srcDescription;
					colJson["MODULE_NAME"] = arrData[i].moduleName
					colJson["fileName"] = arrData[i].fileName;
					colJson["recordKeyNo"] = arrData[i].recordKeyNo;
					colJson["gaFileName"] = arrData[i].gaFileName;
					colJson["CLIENT_DESC"] = arrData[i].clientDescr;
					colJson["viewState"] = arrData[i].viewState;
				}
				storeData.push(colJson);
			}
		}
		this.getStore().loadData(storeData);
		this.setLoading(false);
	},
	showSettingsPopup : function(widgetCode, titleforsettings, record) {
		var me = this;
		var portletSettings = Ext.create('Ext.window.Window', {
					record : record,
					minHeight : 200,
					cls : 'settings-popup xn-popup',
					buttonAlign : 'center',
					itemId : widgetCode + 'SettingsPanel',
					title : titleforsettings,
					autoHeight : true,

					width  : (screen.width) > 1024 ? 765 : 765,
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
		me.getDatePicker();
		//me.addClientMenu(portletSettings);
		//me.addDatePanel(portletSettings);
		//me.addDateMenu(portletSettings);
		me.portletref = portletSettings;
		me.setSettings(portletSettings, me.record.get('settings'));
		if(me.portletref.down('combobox[itemId="Client"]').up().hidden)
		{
			me.portletref.down('button[itemId="creationDateBtn"]').focus();
		}
		else
		{
			me.portletref.down('textfield[itemId="Client"]').focus();
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
						var creationDateLbl = me.portletref.down('label[itemId="creationDateLbl"]');
					if(!Ext.isEmpty(creationDateLbl)) creationDateLbl.setText("Generation Date");
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
		/*var moduleStore = Ext.create('Ext.data.Store', {
					fields : ['MODULE_CODE', 'MODULE_NAME']
				});
		Ext.Ajax.request({
					url : 'services/userseek/getModule.json?$top=-1&$skip=-1',
					method : 'GET',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (moduleStore) {
							moduleStore.removeAll();
							var count = data.length;
							if (count > 0) {
								moduleStore.add({
											'MODULE_CODE' : 'All',
											'MODULE_NAME' : 'All'
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'MODULE_CODE' : data[index].MODULE_CODE,
									'MODULE_NAME' : data[index].MODULE_NAME
								}
								moduleStore.add(record);
							}
						}
					},
					failure : function() {
					}
				});*/

			var clientStore = Ext.create('Ext.data.Store', {
				fields : ['CODE', 'DESCR']
			});
			Ext.Ajax.request({
						//url : 'services/userseek/userclients.json',
						url : 'services/userseek/userclients.json?$top=-1&$skip=-1',
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
												'CODE' : 'all',
												'DESCR' : 'All Companies'
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
			items : [{
				xtype : 'container',
				cls : 'ft-padding-bottom',
				layout : {
					type : 'column',//'hbox',
					pack : 'center'
				},
				flex : 1,
				items : [{				

					xtype : 'container',
					layout : 'hbox',
					columnWidth : 0.3333,
					//cls : 'ft-smallMargin-right',
					items : [{

							xtype : 'container',
							layout : 'vbox',
							width : '100%',
							cls : 'pagesetting',
							padding : '0 20 0 0',
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
										editable : false,
										//triggerAction : 'all',
                                        width : 235,
										padding : '-4 0 0 0',
										itemId : 'Client',
										mode : 'local',
										value : 'all',
										//emptyText : getLabel('selectCompany', 'Select Company Name'),
										store : clientStore,
										listeners : {
											'select' : function(combo, record) {
												strClient = combo.getValue();
												strClientDescr = combo.getRawValue();

											}
										}
									}]

						}]
				    
				
				
				
				}, {
					xtype : 'container',
					width : '100%',					
					padding :((clientStore.getCount() < 2) || !isClientUser) ? '0 0 0 0' :'0 0 0 8',
					margin : '0 0 0 2',
					layout : 'vbox',
					itemId : 'completDatePanel',
					columnWidth : 0.3333,
					//cls : 'ft-smallMargin-right',					
					//flex : 0.38,
					items : [{
							xtype : 'container',
							layout : 'hbox',
							columnWidth : 0.3333,
							
							cls : 'ft-smallMargin-right',
							items : [{
										xtype : 'label',
										itemId : 'creationDateLbl',
										text : getLabel("repgenerationDate", "Generation Date"),
										//labelAlign : 'top',
										cls : 'widget_date_menu',
										listeners: {
											render: function(c) {
							    	   			var tip = Ext.create('Ext.tip.ToolTip', {
											            	    target: c.getEl(),
											            	    listeners:{
											            	    	beforeshow:function(tip){
											            	    		if(generation_date_opt === null)
												            	    		tip.update('Generation Date');
												            	    	else
												            	    		tip.update(generation_date_opt);

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
										//padding: '4 0 0 5',
										cls : 'ui-caret-dropdown settings-ui-caret ',
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
							itemId : 'entryDateToContainer',
							layout : 'hbox',
							width : '100%',
							cls : 'pagesetting',
							items : [{
								xtype : 'component',
								width : 205,
								itemId : 'creationDateDataPicker',
								filterParamName : 'generationDate',
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
					layout : 'vbox',
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-left pagesetting',
					items : [{
								xtype : 'label',
								text : getLabel("Module", "Module"),
								cls : 'f13 ux_font-size14 ux_padding0060'
							}, {
								xtype : 'checkcombo',
								valueField : 'MODULE_CODE',
								displayField : 'MODULE_NAME',
								editable : false,
								addAllSelector : true,
								emptyText : 'All',
								multiSelect : true,
								width : (screen.width) > 1024 ? 243 : 244,
								padding : '-5 0 0 0',
								itemId : 'module',
								isQuickStatusFieldChange : false,
								store : me.getServiceStore(me)
							}]
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'vbox',
					labelAlign : 'top',
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-right',
					//flex : 0.30,
					items : [{
								xtype : 'textfield',
								hideTrigger : true,
								labelAlign : 'top',
								labelSeparator : '',
								fieldLabel : getLabel("widgetName",
										"Widget Name"),
								itemId : 'customname',
								fieldCls : 'xn-form-text',
								labelCls : 'frmLabel',
								width : 235,
								name : 'customname',
								maxLength : 40, // restrict user to enter 40
								// chars max
								enforceMaxLength : true,
								maskRe : /[A-Za-z0-9 .]/
							}]
				}, {
					xtype : 'container',
					flex : 0.65
				}]
			}]
		});
		return settingsPanel;
	},

	setSettings : function(widget, settings) {
		var me = this;
		var strSqlDateFormat = 'm/d/Y';
		var temp = widget.down('label[itemId="creationDateLbl"]');
		if (temp.text == "Generation Date") {
			var dateFilterLabel = "Generation Date (Latest)";
			widget.down('label[itemId="creationDateLbl"]')
					.setText(dateFilterLabel);
					generation_date_opt = "Generation Date (Latest)";
		}

		/*if (me.allClientMenuData.length > 0 && settings.length === 0) {
			settings.push({
						field : 'client',
						operator : 'eq',
						value1 : me.allClientMenuData[0].CODE,
						value2 : me.allClientMenuData[0].DESCR,
						dataType : 0,
						displayType : 6
					});
		}*/

		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			operatorValue = settings[i].operator;

			if (fieldName === 'client') {
				var clientField = widget.down('textfield[itemId=Client]');
				if (!Ext.isEmpty(clientField)) {
					if (!Ext.isEmpty(fieldVal))
						clientField.setValue(fieldVal);
					clientField.clientCodesData = fieldVal;
				}
			}

			if (fieldName === 'reportModule') {
				var reportModuleCombo = widget.down('checkcombo[itemId="module"]');
				var values = fieldVal.split(',');
				if(!(Ext.isEmpty(reportModuleCombo) || Ext.isEmpty(values))) {
					reportModuleCombo.setValue(values);
				}
			}

			if (fieldName === 'generationDate') {
				var dateFilterLabel = settings[i].dateLabel;
				//var datefrom = new Date(fieldVal);
				//var dateto = new Date(fieldVal2);
				//fieldVal = Ext.Date.format(datefrom, strSqlDateFormat);
				//fieldVal2 = Ext.Date.format(dateto, strSqlDateFormat);
				me.dateFilterLabel = settings[i].dateLabel.substring(settings[i].dateLabel.indexOf('(')+1,settings[i].dateLabel.indexOf(')'));
				me.dateFilterVal =  settings[i].btnValue;

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
					generation_date_opt = dateFilterLabel;
				}
				if (dateFilterLabel.indexOf("Date Range") > -1) {
					widget.down('label[itemId="creationDateLbl"]')
							.setText(dateFilterLabel);
					
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
		var clientCode = me.down('textfield[itemId="Client"]').getValue();
		var clientDesc = me.down('textfield[itemId="Client"]').getRawValue();
		if (!Ext.isEmpty(clientCode) && clientCode != 'all') {
			jsonArray.push({
						field : 'client',
						operator : 'eq',
						value1 : clientCode,
						value2 : clientDesc,
						dataType : 0,
						displayType : 6
					});
		}

		// Module
		var moduleValue = me.down('checkcombo[itemId="module"]');
		var moduleServices = moduleValue.getValue();
			jsonArray.push({
						field : 'reportModule',
						operator : 'in',
						value1 : moduleServices,
						value2 : moduleValue.getRawValue(),
						dataType : 0,
						displayType : 0,
						detailFilter : 'Y'
					});
		

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
			me.down('label[itemId="creationDateLbl"]').setText("Generation Date");
		}
		// Generation Date
		// To Do
		var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
	var index = thisClass.dateFilterVal;
	thisClass.datePickerSelectedDate = thisClass.datePickerSelectedEntryDate;
	var objDateParams = thisClass.getDateParam(index);
	if (!Ext.isEmpty(index)) {
		jsonArray.push({
					field : 'generationDate',
					value1 : objDateParams.fieldValue1,
					value2 : objDateParams.fieldValue2,
					operator : objDateParams.operator,
					dataType : 'D',
					displayType : index,
						btnValue : index,
					dateLabel : dateLabel == null ? getLabel("generationDate", "Generation Date") : dateLabel
				});
	}
	
		return jsonArray;
	},
	getServiceStore : function(thisClass) {
		var data;
		Ext.Ajax.request({
			url : 'services/userseek/getReportModule.json?$top=-1&$skip=-1',
			method : 'GET',
			async : false,
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				data = responseData.d.preferences;
			},
			failure : function() {
			}
		});
		
		var serviceStore = Ext.create('Ext.data.Store', {
			fields : ['MODULE_CODE', 'MODULE_NAME'],
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
	getDataPanel : function() {
		return this;
	},

	submitRequest : function(str, record) {
		var me = this;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		if (str == 'Download') {
			strUrl = "downldPreGeneratedReport.srvc";
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'viewState', record.raw.viewState  ) );
		}
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,
				csrfTokenValue));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},

	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	}

});