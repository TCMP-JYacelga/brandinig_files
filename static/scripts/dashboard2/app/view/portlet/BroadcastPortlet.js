Ext.define('Cashweb.view.portlet.BroadcastPortlet', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.broadcast',
	requires : ['Cashweb.store.BroadcastStore',
			'Cashweb.view.portlet.BroadcastDetailsPopup','Ext.tip.ToolTip','Ext.util.Format'],
	border : false,
	emptyText : null,
	cls : 'widget-grid',
	taskRunner : null,
	minHeight : 336,
	cols : 2,
	total : 0,
	strFilter : '',
	IsAttachmentUrl : '',
	dateFilterLabel : getLabel('thismonth', 'This Week'),
	dateFilterVal : '3',
	dateRangeFilterVal : '13',
	datePickerSelectedDate : [],
	datePickerSelectedBrodDate : [],
	portletref : null,
	dateHandler : null,
	vFromDate1 : null,
	vToDate1 : null,
	enableQueryParam : false,
	broadcast_date_opt : null,
	titleId : '',
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var strClient = null;
		var thisClass = this;
		thisClass.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		thisClass.emptyText = label_map.noDataFound;
		thisClass.store = new Cashweb.store.BroadcastStore();
		thisClass.on('columnhide', thisClass.handleStateChange);
		thisClass.on('columnmove', thisClass.handleStateChange);
		thisClass.on('columnshow', thisClass.handleStateChange);
		thisClass.on('sortchange', thisClass.handleStateChange);
		thisClass.on('cellclick', thisClass.columnHandler);
		thisClass.on('lockcolumn', function(ct, colmn, width, opts) {
					thisClass.handleStateChange(ct, colmn, width, opts)
				});
		thisClass.on('unlockcolumn', function(ct, colmn, width, opts) {
					thisClass.handleStateChange(ct, colmn, width, opts)
				});

		thisClass.on('refreshWidget', function() {
					var record = thisClass.record, settings = [],datePresent = false;
					var filterUrl = '';
					thisClass.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'brodDate') {
							thisClass.dateFilterVal = settings[i].displayType;
							datePresent = true;
						}
					}
					if (!datePresent) {
						var objDateParams = thisClass.getDateParam('3');
						settings.push({
									field : 'brodDate',
									value1 : objDateParams.fieldValue1,
									value2 : objDateParams.fieldValue2,
									operator : objDateParams.operator,
									dataType : 'D',
									displayType : '3',
									btnValue : '3',
									dateLabel : "Broadcast Date (This Week)"
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
					var me = this;
					var settings = [];
					var filterUrl = '';
					var datePresent = false;
					var record = thisClass.record;
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
					}
//					thisClass.setLoading(label_map.loading);
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'brodDate') {
							thisClass.dateFilterVal = settings[i].displayType;
							thisClass.datePickerSelectedDate[0]=Ext.Date.parse(settings[i].value1, 'Y-m-d');
							thisClass.datePickerSelectedDate[1]=Ext.Date.parse(settings[i].value2, 'Y-m-d');
							datePresent = true;
						}
					}
					if (!datePresent) {
						var objDateParams = thisClass.getDateParam('3');
						settings.push({
									field : 'brodDate',
									value1 : objDateParams.fieldValue1,
									value2 : objDateParams.fieldValue2,
									operator : objDateParams.operator,
									dataType : 'D',
									displayType : '3',
									btnValue : '3',
									dateLabel : "Broadcast Date (This Week)"
								});
					}
					thisClass.record.set('settings', settings);
					filterUrl = thisClass.generateUrl(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});

		var objDefaultArr = [{
					header : getLabel("lblmessageType", "MessageType"),
					dataIndex : 'urgent',
					align : 'left',
					width : 120,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false					
				}, {
					header : getLabel("lblbroadCastdate", "Broadcast Date"),
					dataIndex : 'feedDate',
					align : 'left',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,	
					width : 160
				}, {
					header : getLabel("subject", "Subject"),
					dataIndex : 'title',
					align : 'left',
					flex : 2,
					width : 120,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}];

		var actionColumn = {
			header : getLabel("lblAttachment", "Attachment"),
			xtype : 'gridcolumn',
			dataIndex : 'attachmentActionColumn',
			align : 'center',
			width : 100,
			sortable : false,
			hideable : false,
			dataIndex : 'actionColumn',
			menuDisabled:true,
			draggable :false,
			resizable : false,			
			renderer : function(value, metaData, record, rowIndex, colIndex,
					store, view) {
				//metaData.tdAttr = 'title="' + (value) + '"';
				if(record && record.data && record.data.internalName)	
					metaData.tdAttr = 'title="' + (record.data.internalName) + '"';
				var strRet = '<a href="#" class="fa fa-paperclip" style="font-size:26px"></a>';
				if (!Ext.isEmpty(record.data.internalName)) {
					strRet = '<a  class="fa fa-paperclip" style="font-size:26px" onClick="downloadNewsAttachment(\'downloadNewsForm\',\'downloadBroadcastpdf.form\', \''
							+ rowIndex
							+ '\',\''
							+ thisClass.getStore().config.dashboardBroadcastViewState
							+ '\')"></a>';
				} else
					strRet = '';
				return strRet;
			}
		};

		var settings = thisClass.record.get('settings');
		var arrColPref = [];
		for (var i = 0; i < settings.length; i++) {
			if (settings[i].field === 'colPref') {
				var columnPref = settings[i].value1.columns;
				for (var i = 0; i < columnPref.length; i++) {
					if (columnPref[i].dataIndex !== 'actionColumn') {
						arrColPref.push(columnPref[i]);
					}
				}
				break;
			}
		}
		var columnModel = (!Ext.isEmpty(arrColPref))
				? arrColPref
				: objDefaultArr;
		var lblView = getLabel('view','View');
		for (var i = 0; i < columnModel.length; i++) {
			columnModel[i].renderer = function(value, meta, record, row,
					column, store) {
				meta.tdAttr = 'title="' + convert(value) + '"';
				if (meta.column.dataIndex === "urgent" && !Ext.isEmpty(value)) {
					return '<text style="color:red">' + value + '</>';
				} else if (meta.column.dataIndex === "title") {
					if (!Ext.isEmpty(record.data.docPath)) {
						meta.style = 'cursor: pointer;';
						var htmlPathVal = record.data.docPath;
						return '<a class="ux_font-size14-normal button_underline" href="javascript:downloadView(\''
							+ htmlPathVal + '\')">'+lblView+'</a>'
						+ '&nbsp;' +value;
					}else if (Ext.isEmpty(record.data.docPath) && !Ext.isEmpty(record.data.docName)) {
						meta.style = 'cursor: pointer;';
						var artifactId = record.data.artifactId;
						return '<a class="ux_font-size14-normal button_underline" href="javascript:downloadView(\''
							+ 'downloadHtmlFile.srvc\'' + ', \'' + artifactId + '\', true)">view</a>'
						+ '&nbsp;' +value;
					} else {
						var details = convert(record.data.details);
						details = details.replace(/([']|\\)/g, "\\$1");
						var popupTitle = convert(record.data.title) + ', ' + record.data.feedDate;
						var txtId = meta.column.dataIndex +'_'+ meta.recordIndex;
						var strRetValue = '<a class="ux_font-size14-normal button_underline" href="javascript:showMsgPopup(\''+ popupTitle + '\', \'' + txtId + '\')";>'+lblView+'&nbsp; </a>' + value ;
						strRetValue = strRetValue + '&nbsp; <textarea id='+txtId+' cols="20" rows="20" style="display:none;">'+ details+' </textarea>';
						return strRetValue;
					}
				}
				return value;
			}
		}
		spliceColumnModel(columnModel,'Attachment');
		columnModel.push(actionColumn);
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
					thisClass.fireEvent('navigateToBroadCast', filter,
							thisClass.record.get('settings'));
				}

			}]
		}];

		this.callParent();
	},
	columnHandler : function(me, td, cellIndex, record, tr,
			rowIndex, e, eOpts) {
		var IconLinkClicked = (e.target.tagName == 'A');
		if(IconLinkClicked && Ext.isEmpty(record.data.docPath)){
			//this.showMessagePopupNew(record);
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
			if (!Ext.isEmpty(objCol) && !Ext.isEmpty(objCol.dataIndex)
					&& objCol.dataIndex != "attachmentActionColumn") {
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

	showMessagePopup : function(record) {

		var msgPopup = Ext.create('Cashweb.view.portlet.BroadcastDetailsPopup',
				{
					title : record.data.title + ' , ' + record.data.feedDate,
					minHeight : 200,
					autoHeight : true,
					width : 500,
					resizable : false,
					recordDtl : record.data.details
				});
		msgPopup.show();
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

		arrMenuItem.add({
					text : getLabel('dateRange', 'Date Range'),
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
					fieldStyle : 'background-color: white',
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
	generateUrl : function(settings) {
		var me = this;
		var isFilterApplied = false;
		var isAttachmentPresent = false;
		var strFilter = '';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {

				if (settings[index].field != 'customname') {

					if (settings[index].field === 'IsAttachment') {
						if (!Ext.isEmpty(settings[index].value1)) {
							me.IsAttachmentUrl = '$IsAttachment='
									+ settings[index].value1;
							isAttachmentPresent = true;
						}
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
		if (!isAttachmentPresent)
			me.IsAttachmentUrl = '';
		if (!Ext.isEmpty(strFilter)) {
			me.strFilter = strFilter;
		}
		return strFilter;
	},
	ajaxRequest : function(filterUrl, settings) {
		var obj;
		var thisClass = this;
		thisClass.setTitle(settings);
		var strUrl = '';
		if (!Ext.isEmpty(filterUrl)) {
			strUrl = strUrl + '?$filter=' + filterUrl;
			if (!Ext.isEmpty(thisClass.IsAttachmentUrl))
				strUrl = strUrl + '&' + thisClass.IsAttachmentUrl;
		} else {
			if (!Ext.isEmpty(thisClass.IsAttachmentUrl))
				strUrl = strUrl + '?' + thisClass.IsAttachmentUrl;
		}

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
					url : 'services/getBroadcastMessages.json',// strUrl,
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
		if (data.broadcastViewState)
			me.getStore().config.dashboardBroadcastViewState = data.broadcastViewState;
		if (data.broadcast.length < 5) {
			var fbarInstance = me.down('toolbar');
			fbarInstance.hide();
		}
		if (data.broadcast.length >= 5) {
			var fbarInstance = me.down('toolbar');
			fbarInstance.show();
		}
		if (data.broadcast)
			me.getStore().loadData(data.broadcast);
		this.setLoading(false);
	},
	showSettingsPopup : function(widgetCode, titleforsettings, record) {
		var me = this;
		var portletSettings = Ext.create('Ext.window.Window', {
					record : record,
					cls : 'settings-popup xn-popup',
					buttonAlign : 'center',
					itemId : widgetCode + 'SettingsPanel',
					title : titleforsettings,
					autoHeight : true,
					width : 635,
					//width  : (screen.width) > 1024 ? 735 : 733,
					minHeight : 200,
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
		me.portletref = portletSettings; // TODO: need to change the dependency of portletref variable
		me.setSettings(portletSettings, me.record.get('settings'));
		if(portletSettings.down('combo[itemId="Client"]').up('container[itemId="clientMenuContainer"]').hidden)
		{
			Ext.getCmp('urgentId').focus();
		}
		else
		{
			Ext.getCmp('companyName').focus();
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
		var me = this;
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
											'CODE' : getLabel("lbl.all","all"),
											'DESCR' : getLabel('allCompanies','All companies')
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
				cls : 'pagesetting',
				layout : {
					type : 'hbox',//'hbox',
					pack : 'center'
				},
				flex : 1,
				items : [{
						xtype : 'container',
						layout : 'hbox',
						flex : 0.4500,
						itemId : 'clientMenuContainer',
						//columnWidth : 0.4500,
						hidden: ((clientStore.getCount() < 2) || !isClientUser) ? true : false,//If count is one or admin then hide
						cls : 'ft-extraLargeMargin-right',
						items : [{
							xtype : 'container',
							layout : 'vbox',
							width : '100%',
							cls : 'pagesetting',
							padding : '0 30 0 0',
							//flex : 1,
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
								triggerAction : 'all',
								width : '100%',
								padding : '-4 0 0 0',
								itemId : 'Client',
								id : 'companyName',
								mode : 'local',
								value : 'all',
								emptyText : getLabel('selectCompany', 'Select Company Name'),
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
			xtype : 'checkboxgroup',
			//columnWidth : 0.5500,
			flex : 0.5000,
			cls : 'ft-extraLargeMargin-right',
			columns : ['20%', '50%'],
			itemId : 'checkboxgroupID',
			labelAlign : 'top',
			labelSeparator : '',
			margin : ((clientStore.getCount() < 2) || !isClientUser) ? '0 0 0 0' : '20 0 0 0',
			labelCls : 'f13 ux_font-size14 ux_padding0060',
			items : [{
         
				xtype : 'checkboxfield',
				boxLabel : getLabel("urgent", "Urgent"),
				name : 'topping',
				inputValue : 'U',
				id : 'urgentId',
				//flex : 0.2500,//0.38,
				cls : ((clientStore.getCount() < 2) || !isClientUser) ? 'ft-extraLargeMargin-right' : 'ft-extraLargeMargin-left  ft-extraLargeMargin-right',
				labelCls : 'frmLabel',
				//margin : '0 16 0 0',
				//columnWidth : 0.2500,
				itemId : 'urgent'
			}, {
				xtype : 'checkboxfield',
				boxLabel : getLabel("withAttachments","With Attachments"),
				name : 'topping',
				inputValue : 'A',
				//flex : 0.1250,
				cls : 'ft-smallMargin-left ft-smallMargin-right',
				labelCls : 'frmLabel',
				//margin : '0 8 0 8',
				//columnWidth : 0.2500,
				itemId : 'attachments'
			}]
         },	{}]
		},	{
				xtype : 'container',
				layout : 'hbox',//'hbox',
				cls : 'pagesetting',
				flex : 1,
					items : [{
						xtype : 'container',
					itemId : 'entryDateContainer',
					layout : 'vbox',
					cls : 'pagesetting',
					flex : 0.4500,
					margin : '15 0 0 0',
					//columnWidth : 0.5000,
					items : [{
						xtype : 'panel',
						itemId : 'completDatePanel',
//						height : 23,
//						flex : 1,
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'creationDateLbl',
									cls: 'frmLabel',
									name : 'creationDateLbl',
									text : getLabel('broadcastDate', 'Broadcast Date'),
									listeners: {
										render: function(c) {
						    	   			var tip = Ext.create('Ext.tip.ToolTip', {
										            	    target: c.getEl(),
										            	    listeners:{
										            	    	beforeshow:function(tip){
										            	    		if(broadcast_date_opt === null)
											            	    		tip.update('Broadcast Date');
											            	    	else
											            	    		tip.update(broadcast_date_opt);

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
						itemId : 'entryDateToContainer',
						layout : 'hbox',
						width: '100%',
						items : [{
							xtype : 'component',
							width : '72%',
							itemId : 'brodDateDataPicker',
							filterParamName : 'brodDate',
							html : '<input type="text"  id="brodDatePicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment" style="width: 100%;">'
						}, {
							xtype : 'component',
							cls : 'icon-calendar t7-adjust-cal',
							margin : '1 0 0 0',
							width: '15%',
							html : '<span class=""><i class="fa fa-calendar"></i></span>'
						}]
					}]
				}, {
					xtype : 'container',
					layout : 'hbox',
					flex : 0.4500,
					cls : 'ft-smallMargin-left ft-smallMargin-right',
					margin : '15 0 0 0',
					//columnWidth : 0.3333,
					items : [{
								xtype : 'textfield',
								width : '80%',
								hideTrigger : true,
								labelAlign : 'top',
								labelSeparator : '',
								fieldLabel : getLabel("widgetName",
										"Widget Name"),
								itemId : 'customname',
								fieldCls : 'form-control',
								labelCls : 'frmLabel',
								name : 'customname',
								maxLength : 20, // restrict user to enter 30
								// chars max
								enforceMaxLength : true,
								maskRe : /[A-Za-z0-9 .]/
							}]

				}, {
					xtype : 'container',
					columnWidth : 0.3333
						//flex : 0.304
					}]
			}]
		});
		return settingsPanel;
	},
	setSettings : function(widget, settings) {
		var me = this;
		var strSqlDateFormat = 'm/d/Y';
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			operatorValue = settings[i].operator;

			if (fieldName === 'ClientId') {
				var clientField = widget.down('textfield[itemId=Client]');
				if (!Ext.isEmpty(clientField)) {
					if (!Ext.isEmpty(fieldVal))
						clientField.setValue(fieldVal);
					clientField.clientCodesData = fieldVal;
				}
			}

			if (fieldName === 'isUrgent') {

				var urgentValue = widget.down('checkboxfield[itemId="urgent"]');
				if (fieldVal === 'Y') {
					urgentValue.setValue(true);
				}
			}

			if (fieldName === 'IsAttachment') {

				var attachmentsValue = widget
						.down('checkboxfield[itemId="attachments"]');
				if (fieldVal === 'Y') {
					attachmentsValue.setValue(true);
				}
			}
			if (fieldName === 'brodDate') {
				var dateFilterLabel = settings[i].dateLabel;
				broadcast_date_opt = dateFilterLabel;
				var dateFilterRefFrom = $('#brodDatePicker');
				
				me.dateFilterLabel = settings[i].dateLabel.substring(settings[i].dateLabel.indexOf('(')+1,settings[i].dateLabel.indexOf(')'));
				me.dateFilterVal =  settings[i].btnValue;
				me.datePickerSelectedDate[0] = Ext.Date.parse(settings[i].value1, 'Y-m-d');
				me.datePickerSelectedDate[1] = Ext.Date.parse(settings[i].value2, 'Y-m-d');
				
				if (!Ext.isEmpty(fieldVal)) 
					 formattedFromDate = Ext.Date.parse(fieldVal, 'Y-m-d');
					 
				if (!Ext.isEmpty(fieldVal2)) 
						formattedToDate = Ext.Date.parse(fieldVal2, 'Y-m-d');

				if (operatorValue === 'eq') {
					dateFilterRefFrom.val(formattedFromDate);
				}
				else if (operatorValue === 'bt') {
					dateFilterRefFrom.setDateRangePickerValue([formattedFromDate, formattedToDate]);
				}
				if (!Ext.isEmpty(dateFilterLabel)) {
					me.portletref.down('label[itemId="creationDateLbl"]').setText(dateFilterLabel);
					broadcast_date_opt = dateFilterLabel;
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
		//var clientCode = me.down('textfield[itemId="Client"]').clientCodesData;
		var clientCode = me.down('combo[itemId="Client"]').getValue();
		var clientDesc = me.down('combo[itemId="Client"]').getRawValue();
		if (!Ext.isEmpty(clientCode) && clientCode != 'all') {
			jsonArray.push({
						field : 'ClientId',
						operator : 'eq',
						value1 : clientCode,
						value2 : clientDesc,
						dataType : 0,
						displayType : 6
					});
		}

		// urgent
		var urgentValue = me.down('checkboxfield[itemId="urgent"]').getValue();
		if (urgentValue === true) {
			jsonArray.push({
						field : 'isUrgent',
						operator : 'eq',
						value1 : 'Y',
						dataType : 0,
						displayType : 4
					});
		}

		// attachments
		var attachmentsValue = me.down('checkboxfield[itemId="attachments"]')
				.getValue();
		if (attachmentsValue === true) {
			jsonArray.push({
						field : 'IsAttachment',
						operator : 'eq',
						value1 : 'Y',
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

		// Broadcast Date
		var datePickerText = $('#brodDatePicker').val();
		if(Ext.isEmpty(datePickerText)) {
			thisClass.dateFilterVal = '';
			thisClass.dateFilterLabel = '';
			me.down('label[itemId="creationDateLbl"]').setText(getLabel('broadcastDate','Broadcast Date'));
		}
		var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
		var index = thisClass.dateFilterVal;
		var objDateParams = thisClass.getDateParam(index);
		if (!Ext.isEmpty(index)) {
			jsonArray.push({
						field : 'brodDate',
						value1 : objDateParams.fieldValue1,
						value2 : objDateParams.fieldValue2,
						operator : objDateParams.operator,
						dataType : 'D',
						displayType : index,
						btnValue : index,
						dateLabel : dateLabel == null ? getLabel("creationDate", "Broadcast Date") : dateLabel
					});
		}
		return jsonArray;
	},
	getDataPanel : function() {
		return this;
	},
	getDatePicker : function() {
		var me = this;
		$('#brodDatePicker').datepick({
			monthsToShow : 1,
			changeMonth : true,
			changeYear : true,
			dateFormat : strjQueryDatePickerDateFormat,
			clearBtn: true,
			rangeSeparator : ' to ',
			onClose : function(dates) {
				var datePickerText = $('#brodDatePicker').val();
				if (!Ext.isEmpty(dates)) {
						if(!Ext.isEmpty(datePickerText))
						{
						me.dateRangeFilterVal = '13';
						me.datePickerSelectedDate = dates;
						me.datePickerSelectedBrodDate = dates;
						me.dateFilterVal = me.dateRangeFilterVal;
						me.dateFilterLabel = getLabel('daterange','Date Range');
						me.handleDateChange(me.dateRangeFilterVal);
					}
					else {
						me.dateFilterVal = '';
						me.dateFilterLabel = '';
						var creationDateLbl = me.portletref.down('label[itemId="creationDateLbl"]');
						if(!Ext.isEmpty(creationDateLbl)) creationDateLbl.setText(getLabel('broadcastDate','Broadcast Date'));
					}
				}
			}
		});
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
	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#brodDatePicker');
		
		if (!Ext.isEmpty(me.dateFilterLabel) && !Ext.isEmpty(me.portletref)) {
			me.portletref.down('label[itemId="creationDateLbl"]')
			.setText(getLabel('broadcastDate','Broadcast Date') + " (" + me.dateFilterLabel + ")");
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
			}
		} else {
			if (index === '1' || index === '2') {
					datePickerRef.val(vFromDate);
			} else {
				datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
			}
		}
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
		return retObj;
	},
	showMessagePopupNew: function(record) {
			var msgPopup = Ext.create('Cashweb.view.portlet.BroadcastDetailsPopup', {
				title: getLabel('messageTilte', 'Message'),
				minHeight: 200,
				autoHeight: true,
				width: 520,
				resizable: false,
				record: record
			});
			msgPopup.show();	
	}
});

function spliceColumnModel(arr, val) {
	  for (var i = arr.length; i--;) {
	    if (arr[i].header === val) {
	      arr.splice(i, 1);
	    }
	  }
	}

function convert(str){
	str = str.replace(/&/g, "&amp;");
	str = str.replace(/>/g, "&gt;");
	str = str.replace(/</g, "&lt;");
	str = str.replace(/"/g, "&quot;");
	//str = str.replace(/'/g, "&apos;");
	return str;
	}