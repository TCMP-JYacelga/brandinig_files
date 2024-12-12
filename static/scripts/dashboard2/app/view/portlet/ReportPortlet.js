Ext.define('Cashweb.view.portlet.ReportPortlet', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.reports',
	requires : ['Cashweb.store.ReportStore'],
	border : false,
	emptyText : null,
	cls : 'widget-grid',
	taskRunner : null,
	minHeight : 50,
	height:336,
	cols : 3,
	total : 0,
	strFilter : '',
	dateFilterLabel : 'Generation Date( Latest )',
	dateFilterVal : '12',
	dateHandler : null,
	vFromDate1 : null,
	vToDate1 : null,
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		thisClass.emptyText = label_map.noDataFound;
		this.store = new Cashweb.store.ReportStore();

		this.on('render', function(component, eOpts) {
					var me = this;
					var settings = null, summaryPortlet, widget;
					var filterUrl = '';
					var record = this.record;
					summaryPortlet = this.up('panel');
					widget = summaryPortlet.widgetCode;

					// Setting the Date Label at Header
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
						for (var index = 0; index < settings.length; index++) {
							if (settings[index].field === 'generationDate') {
								this.dateFilterLabel = settings[index].dateLabel;
								break;
							}
						}
					}

					var label = Ext.create('Ext.form.Label', {
								text : "("
										+ this.dateFilterLabel
												.slice(
														17,
														this.dateFilterLabel.length
																- 1) + ")",
								style : {
									'font-size' : '10px !important'
								},
								renderTo : Ext.get(widget
										+ this.record.get('position'))
							});

					filterUrl = this.generateUrl(settings);
					this.ajaxRequest(filterUrl);
				});

		this.columns = [{
					header : label_map.reportdate,
					dataIndex : 'artifactDate',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					flex : 1,
					renderer : function(value, meta, record, row, column, store) {
						var newDate = Ext.util.Format.date(value,
								serverdateFormat)
						return newDate;
					}
				}, {
					header : label_map.reportname,
					dataIndex : 'title',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					flex : 2
				}, {
					xtype : 'actioncolumn',
					align : 'right',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					width : 50,
					getClass : function(value, metaData, record, rowIndex,
							colIndex, store, view) {
						if (!Ext.isEmpty(record.data.docPath))
							return "grid-row-action-icon downloadrep";
					},
					handler : function(grid, rowIndex, columnIndex, item,
							event, record) {
						downloadReportsAttachment(
								'downloadReportsForm',
								'downloadReport.form',
								rowIndex,
								grid.getStore().config.dashboardReportsViewState);
					}
				}];
		this.bbar = ['->',{
			type : 'button',
			text : 'See More',
			cls : 'xn-account-filter-btnmenu',
			handler : function() {
				thisClass.fireEvent('seeMorePaymentRecords',
						thisClass.strFilter);
			}
		}];

		this.callParent();
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
					menuRef.add({
								text : getLabel('allCompanies', 'All companies'),
								clientCode : 'all',
								handler : function(item, opts) {
									var clientField = summaryPortlet
											.down('textfield[itemId="Client"]');
									clientField.setValue(item.text);
									clientField.clientCodesData = item.clientCode;
								}
							});

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
				}
			},
			failure : function(summaryPortlet) {

			}
		});
	},

	addDateMenu : function(portletSettings) {
		var me = this;
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

		arrMenuItem.add({
					text : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					parent : me,
					handler : function(btn, opts) {
						me.dateFilterVal = btn.btnValue;
						me.dateFilterLabel = btn.text;
						me.handleDateChange(portletSettings, btn.btnValue);
					}
				});

	},

	// Payment Method field handlling ends
	handleDateChange : function(portlet2, index) {
		var me = this;
		var objDateParams = me.getDateParam(index, null);
		var fromDateLabel = portlet2.down('label[itemId="dateFilterFrom"]');
		var toDateLabel = portlet2.down('label[itemId="dateFilterTo"]');
		fromDateLabel.show();
		toDateLabel.show();
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			portlet2.down('label[itemId="creationDateLbl"]')
					.setText("Generation Date" + " (" + me.dateFilterLabel + ")");
		}
		vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
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
		return retObj;
	},

	generateUrl : function(settings) {
		var me = this;
		var isFilterApplied = false;
		var strFilter = '';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {

				if (settings[index].field != 'customname') {
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
	ajaxRequest : function(filterUrl) {
		var obj;
		var thisClass = this;
		Ext.Ajax.request({
					url : './getMyReports.rest'+filterUrl,
					success : function(response) {
						obj = Ext.decode(response.responseText);
						thisClass.loadData(obj);
					},
					failure : function(response) {
						thisClass.getReportPortlet().getTargetEl().unmask();
						var viewref = thisClass.getReportPortlet();
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
						thisClass.mask.show();
					}
				});
	},
	loadData : function(data) {
		this.getStore().loadData(data.reports);
		this.getStore().config.dashboardReportsViewState = data.reportsViewState;
		this.getTargetEl().unmask();
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
					width : 800,
					modal : true,
					resizable : false,
					items : me.getSettingsPanel(),
					buttons : [{
								text : 'Cancel',
								cls : 'xn-btn ux-button-s',
								handler : function() {
									this.up('window').close();
								}
							}, '->', {
								text : 'Save',
								cls : 'xn-btn ux-button-s',
								handler : function() {
									me.up('panel').fireEvent(
											'saveSettings',
											record,
											me.getSettingsPanel()
													.getSettings(this
															.up('window')));
									this.up('window').close();
								}
							}]
				});
		portletSettings.show();
		this.addClientMenu(portletSettings);
		this.addDateMenu(portletSettings);
		this.getSettingsPanel().setSettings(portletSettings,
				record.get('settings'));
	},
	getSettingsPanel : function() {
		var me = this;
		var paymentCategoryStore = Ext.create('Ext.data.Store', {
					fields : ['colId', 'colDesc']
				});
		Ext.Ajax.request({
					url : 'services/instrumentType.json',
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
											'colDesc' : 'All'
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

		var settingsPanel = Ext.create('Ext.panel.Panel', {
			//padding : '10 10 10 10',
			items : [{
				xtype : 'container',
				layout : {
					type : 'hbox',
					pack : 'center'
				},
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'vbox',
					flex : 0.33,
					items : [{
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'creationDateLbl',
									name : 'creationDateLbl',
									text : 'Generation Date',
									style : {
										'padding-right' : '10px !important'
									},
									cls : 'frmLabel'
								}, {
									xtype : 'button',
									border : 0,
									itemId : 'creationDateBtn',
									name : 'creationDateBtn',
									cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
									glyph : 'xf0d7@fontawesome',
									menu : Ext.create('Ext.menu.Menu', {
												itemId : 'dateMenu',
												width : 220,
												maxHeight : 200,
												items : []
											})

								}]
					},{
						xtype : 'container',
						itemId : 'CreateDate',
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
				}, {
					xtype : 'container',
					layout : 'hbox',
					flex : 0.33,
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
								width : 160,
								height : 45,
								name : 'Client',
								clientCodesData : '',
								value : getLabel('allCompanies',
										'All companies')
							}, {
								xtype : 'button',
								border : 0,
								margin : '24 0 0 0',
								itemId : 'clientBtn',
								cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
								glyph : 'xf0d7@fontawesome',
								height : 25,
								menuAlign : 'tr-br',
								menu : Ext.create('Ext.menu.Menu', {
											itemId : 'clientMenu',
											width : 220,
											maxHeight : 200,
											items : []
										}),
								handler : function(btn, event) {
									btn.menu.show();
								}
							}]
				},{
						xtype : 'container',
						layout : 'vbox',
						flex : 0.33,
						items : [{
									xtype : 'combo',
									itemId : 'module',
									multiSelect : false,
									labelAlign : 'top',
									labelSeparator : '',
									labelCls : 'frmLabel',
									fieldCls : 'ux_no-border-right xn-form-field w110',
									triggerBaseCls : 'xn-form-trigger',
									width : 165,
									editable : false,
									displayField : 'colDesc',
									valueField : 'colId',
									queryMode : 'local',
									value : 'All',
									store : paymentCategoryStore,
									fieldLabel : "Module"
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
							flex : 0.33,
							margin : '0 0 5 0',
							padding : '10 10 0 0',
							items : [{
										xtype : 'textfield',
										hideTrigger : true,
										margin : '5 0 0 0',
										flex : 0.33,
										labelAlign : 'top',
										labelSeparator : '',
										fieldLabel : 'Widget Name',
										itemId : 'customname',
										fieldCls : 'xn-form-text',
										labelCls : 'frmLabel',
										width : 185,
										name : 'customname'
									}]
						}, {
							xtype : 'container',
							flex : 0.66
						}]
			}],
			setSettings : function(widget, settings) {
			var strSqlDateFormat = 'm/d/Y';
			 var temp= widget.down('label[itemId="creationDateLbl"]');
					if(temp.text=="Generation Date"){
					 var dateFilterLabel = "Generation Date (Latest)";
					  widget.down('label[itemId="creationDateLbl"]')
								.setText(dateFilterLabel);
					}
				for (i = 0; i < settings.length; i++) {
					fieldName = settings[i].field;
					fieldVal = settings[i].value1;
					fieldVal2 = settings[i].value2;
					operatorValue = settings[i].operator;
					
					if (fieldName === 'Client') {
						var clientField = widget
								.down('textfield[itemId=Client]');
						if (!Ext.isEmpty(clientField)) {
							if (!Ext.isEmpty(fieldVal2))
								clientField.setValue(fieldVal2);
							clientField.clientCodesData = fieldVal;
						}
					}

					if (fieldName === 'module') {
						var moduleValue = widget
								.down('combo[itemId="module"]');
						if (!Ext.isEmpty(moduleValue)) {
							if (!Ext.isEmpty(fieldVal))
								moduleValue.setValue(fieldVal);
						}
					}

					if (fieldName === 'generationDate') {
						var dateFilterLabel = settings[i].dateLabel;
						var datefrom=new Date(fieldVal);
						var dateto=new Date(fieldVal2);
						fieldVal=Ext.Date.format(datefrom, strSqlDateFormat);
						fieldVal2=Ext.Date.format(dateto, strSqlDateFormat);
						widget.down('label[itemId="dateFilterFrom"]').show();
						widget.down('label[itemId="dateFilterTo"]').show();
						widget.down('label[itemId="creationDateLbl"]')
								.setText(dateFilterLabel);
						widget.down('label[itemId="dateFilterFrom"]')
								.setText(fieldVal);
						widget.down('label[itemId="dateFilterTo"]').setText('-'
								+ fieldVal2);
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
				var jsonArray = [];
				// Client
				var clientCode = me.down('textfield[itemId="Client"]').clientCodesData;
				var clientDesc = me.down('textfield[itemId="Client"]')
						.getValue();
				if (!Ext.isEmpty(clientCode) && clientCode != 'all') {
					jsonArray.push({
								field : 'Client',
								operator : 'eq',
								value1 : clientCode,
								value2 : clientDesc,
								dataType : 0,
								displayType : 6
							});
				}

				// Module
				var moduleValue = me.down('combo[itemId="module"]')
						.getValue();
				if (!Ext.isEmpty(moduleValue)
						&& moduleValue != 'All') {
					jsonArray.push({
								field : 'module',
								operator : 'eq',
								value1 : moduleValue,
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

				// Generation Date
				// To Do
				var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
				var fromCreation = me.down('label[itemId="dateFilterFrom"]');
				var toCreation = me.down('label[itemId="dateFilterTo"]');
				var creationFromDate = (!Ext.isEmpty(fromCreation.text))
						? (fromCreation.text.substring(0,
								fromCreation.text.length - 3))
						: '';
				var creationToDate = (!Ext.isEmpty(toCreation.text))
						? toCreation.text
						: '';
				if (!Ext.isEmpty(creationFromDate)) {
					jsonArray.push({
						field : 'generationDate',
						operator : (!Ext.isEmpty(creationToDate)) ? 'bt' : 'eq',
						value1 : Ext.util.Format
								.date(creationFromDate, 'Y-m-d'),
						value2 : Ext.util.Format.date(creationToDate, 'Y-m-d'),
						dateLabel : dateLabel,
						dataType : 'D',
						displayType : 5
					});
				}

				return jsonArray;
			}
		});
		return settingsPanel;
	},

	getDataPanel : function() {
		return this;
	}
});