Ext.define('Cashweb.view.portlet.LoansAccounts', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.loansaccounts',
	requires : ['Cashweb.store.LoansAccountsStore'],
	border : false,
	emptyText : null,
	cls : 'widget-grid',
	taskRunner : null,
	minHeight : 336,
	cols : 3,
	total : 0,
	strFilter : '',
	accountFilter : '$accountID=ALL',
	accountTypeFilter : '$filterValue=',
	eqCurrencyFilter : '$eqCurrency=USD',
	serviceTypeFilter : '$serviceType=BR_STD_SUMM_GRID',
	serviceParamFilter : '$serviceParam=BR_GRIDVIEW_GENERIC',
	accountID : '',
	summaryTypeFilter : '',
	filterRestrict : '999',
	isSelectAcc : false,
	isSelectAccGrp : false,
	enableQueryParam : false,
	jsonDatetArray : null,
	titleId : '',
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		thisClass.store = new Cashweb.store.LoansAccountsStore();
		var jsondtArray = [];
		var objDateParams = thisClass.getDateParam('1');
		
		if (!Ext.isEmpty(objDateParams.fieldValue1)) {
			jsondtArray.push({
						field : 'summaryFromDate',
						operator : 'eq',
						value1 : Ext.util.Format
								.date(objDateParams.fieldValue1, 'Y-m-d'),
						dateLabel : 'Today',
						dateLabelwidget :'Today',
						dataType : 'D',
						displayType : '1',
						btnValue : objDateParams.btnValue
					});
		}
		this.jsonDatetArray = jsondtArray;
		thisClass.on('refreshWidget', function() {
					var record = thisClass.record, settings = [];
					var filterUrl = '';
					thisClass.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					filterUrl = thisClass.generateUrl(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});
		thisClass.on('cellclick', function(me, td, cellIndex, record, tr,
				rowIndex, e, eOpts) {
			thisClass.navigate( thisClass.record
					.get('settings'), record);
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
		thisClass.on('boxready', function(){
			thisClass.setLoading(label_map.loading);
		});
		thisClass.on('viewready', function(component, eOpts) {
					var settings = [];
					var filterUrl = '';
					var record = this.record;
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
					}
//					thisClass.setLoading(label_map.loading);
					filterUrl = thisClass.generateUrl(settings);
					thisClass.ajaxRequest(filterUrl, settings);
				});

		var objDefaultArr = [{
					header : getLabel("obligorId", "Obligor ID"),
					dataIndex : 'obligorId',
					align : 'left',
					flex : 20,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("obligationNo", "Obligation ID"),
					dataIndex : 'obligationNo',
					align : 'left',
					flex : 21,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("accountName", "Account Name"),
					dataIndex : 'accountName',
					flex : 30,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,					
					hidden : false,
					align : 'left'
				}, {
					header : getLabel("principleAmount", "Principal Balance"),
					dataIndex : 'principleAmount',
					align : 'right',
					flex : 30,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,					
					hidden : false
				}, {
					header : getLabel("maturityDate", "Maturity Date"),
					dataIndex : 'maturityDate',
					align : 'left',
					flex : 15,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,					
					hidden : false
				}, {
					header : getLabel("totalDue", "Principal Due"),
					dataIndex : 'totalDue',					
					flex : 15,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,					
					align : 'right'
				}, {
					header : getLabel("dateTimeOfRefreshUpdate",
							"Last Updated"),
					dataIndex : 'dateTimeOfRefreshUpdate',
					align : 'left',
					flex : 27,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,					
					hidden : false
				}, {
					header : getLabel("accountId",
					"AccountId"),
					dataIndex : 'accountId',
					align : 'left',
					sortable : true,
					hidden : true,
					hideable: false,
					flex : 27
				}];
		var settings = thisClass.record.get('settings');
		var arrColPref = [];
		for (var i = 0; i < settings.length; i++) {
			if (settings[i].field === 'colPref') {
				arrColPref = settings[i].value1.columns;
				//metadata.tdAttr = 'title="' + (settings[i].value1) + '"';
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
									.get('settings'),thisClass.jsonDatetArray);
				}
			}]
		}];

		this.callParent();
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
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		//retObj.btnValue = index;
		return retObj;
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
					boxLabel : getLabel('accountSet', 'Account Group'),
					name : 'account',
					inputValue : 'AS',
					checked : true,
					hidden : true,
					handler : function(cb, nv, ov) {
						me.handleAccTypAutoComp(portletSettings, cb, nv, ov);
					}
				});
	},
	generateUrl : function(settings) {
		var me = this;
		var isFilterApplied = false;
		var strFilter = '';
		var accountFilterPresent = false, accountTypeFilterPresent = false;
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

		if (!accountFilterPresent){
			if(Ext.isEmpty(me.accountID)){
				me.accountFilter = '$accountID=ALL';
			}
			else{
				me.accountFilter = '$accountID=' + me.accountID;
			}
		}
		if (!accountTypeFilterPresent)
			me.accountTypeFilter = '$filterValue=';

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
		var thisClass = this;
		thisClass.setTitle(settings);
		var strUrl = '?$top=5&$skip=1&$inlinecount=allpages';

		strUrl = strUrl + '&$summaryType=intraday';
		thisClass.summaryTypeFilter = '$summaryType=intraday';

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
		strUrl = strUrl + '&$orderby=summaryDate desc&$acctType=LOAN';

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
					url : 'services/balancesummary/liquidityforwidgets',// strUrl
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
		if (('_count' in data.d) && data.d.count < 5) {
			var fbarInstance = me.down('toolbar');
			if (fbarInstance != null)
				fbarInstance.hide();
		}
		if (!('_count' in data.d)) {
			var fbarInstance = me.down('toolbar');
			if (fbarInstance != null)
				fbarInstance.hide();
		}
		if (('_count' in data.d) && data.d.count >= 5) {
			var fbarInstance = me.down('toolbar');
			if (fbarInstance != null)
				fbarInstance.show();
		}
	var objData=data.d.summary;
	if(objData.length>=5)
		{
		var fbarInstance = me.down('toolbar');
		if (fbarInstance != null)
			fbarInstance.show();
		}
	if(objData.length<5)
	{
	var fbarInstance = me.down('toolbar');
	if (fbarInstance != null)
		fbarInstance.hide();
	}
		if (undefined != data.d && undefined != data.d.summary) {
			var arrData = data.d.summary;
			if (!Ext.isEmpty(arrData)) {
				for (var i = 0; i < 5 && i < arrData.length; i++) {
					var colJson = {};
					if (arrData[i]) {
						colJson["obligorId"] = arrData[i].accountNumber;
						colJson["obligationNo"] = arrData[i].obligationNumber;
						colJson["accountName"] = arrData[i].accountName;
						colJson["accountId"] = arrData[i].accountId;
						if(!Ext.isEmpty(arrData[i].mapTypeCodeAmounts["701"])){
							colJson["principleAmount"] = arrData[i].currencySymbol
							+ " " +arrData[i].mapTypeCodeAmounts["701"];							
						}
						colJson["maturityDate"] = arrData[i].mapTypeCodeAmounts["CL2019"];
						
						if(!Ext.isEmpty(arrData[i].mapTypeCodeAmounts["707"])){
							colJson["totalDue"] = arrData[i].currencySymbol + " "
									+arrData[i].mapTypeCodeAmounts["707"];
						}
						colJson["dateTimeOfRefreshUpdate"] = arrData[i].summaryDate;
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
				.down('AutoCompleter[itemId="accAutoComp"]');
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
				.down('AutoCompleter[itemId="tyAutoComp"]');
		var objAccSetAutoComp = portlet
				.down('AutoCompleter[itemId="tySetAutoComp"]');
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
					minHeight : 156,
					maxHeight : 550,
					cls : 'settings-popup xn-popup',
					buttonAlign : 'center',
					itemId : widgetCode + 'SettingsPanel',
					title : titleforsettings,
					autoHeight : true,
					width : 600,
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
		Ext.getCmp('accountSet').focus();
		this.addAccountGroup(portletSettings);
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
		var records = [];
		var typeCodeStore = Ext.create('Ext.data.Store', {
			fields : ['accountSetName', 'accounts'],
			data : records
		});
		Ext.Ajax.request({
			url : 'services/transcationSearch/accountSetForWidgets.json?$transactionType=intraday',
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
		var settingsPanel = Ext.create('Ext.panel.Panel', {
			//padding : '10 10 10 10',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'vbox',
					//margin : '-5 0 12 0',
					padding : '0 30 0 0',
					style : {
						'margin-top' : '-5px'
					},
					cls : 'ft-padding-bottom',
					flex : 0.45,
					items : [{
						xtype : 'container',
						layout : 'vbox',
						items : [{
									xtype : 'radiogroup',
									itemId : 'accountRadioGrp',
									columns : [80, 120],
									items : []
								}, {
									xtype : 'container',
									itemId : 'accTypAutoComp',
									items : [{
										xtype : 'AutoCompleter',
										fieldLabel : '',
										emptyText : getLabel('searchAcc','Search By Account'),
										fieldCls : 'xn-form-text  xn-suggestion-box',
										itemId : 'accAutoComp',
										hidden : true,
										cls : 'autoCmplete-field',
										labelSeparator : '',
										width  : (screen.width) > 1024 ? 268 : 268,
										fitToParent : true,
										margin : '-5 0 0 0',
										cfgUrl : 'services/balancesummary/btruseraccountsforwidgets.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'btruseraccounts',
										cfgRootNode : 'd.btruseraccount',
										cfgDataNode1 : 'accountName',
										cfgDataNode2 : 'accountNumber',
										cfgKeyNode : 'accountId',
										cfgProxyMethodType : 'POST',
										cfgExtraParams : [{
													key : '$facCode',
													value : 'FAC00003'
												}],
										cfgDelimiter:'|&nbsp&nbsp&nbsp',		
										listeners : {
											select : function(combo, record,
													index) {
												thisClass.isSelectAcc = true;
											},
											keyup :  function( combo, e, eOpts){
												thisClass.isSelectAcc = false;
											},
											blur : function(combo, The, eOpts){
												if(!thisClass.isSelectAcc){
													combo.setValue("");
													thisClass.isSelectAcc = false;
												}
											}
										}
									},/* {
										xtype : 'AutoCompleter',
										flex : 0.40,
										fieldLabel : '',
										emptyText : 'Enter Keyword or %',
										fieldCls : 'xn-form-text  xn-suggestion-box',
										itemId : 'accSetAutoComp',
										id :'accountSet',
										//hidden : true,
										width  : (screen.width) > 1024 ? 268 : 268,
										fieldLabel : getLabel("accountSet",
										"Account Set"),									
										labelCls : 'frmLabel',
										fitToParent : true,
										cls : 'autoCmplete-field',
										labelSeparator : '',
										labelAlign : 'top',	
										cfgUrl : 'services/transcationSearch/accountSetForWidgets.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										margin : '0 0 0 0',
										cfgSeekId : 'accountSet',
										cfgRootNode : 'd.userAccount',
										cfgDataNode1 : 'accountSetName',
										cfgDataNode2 : 'accounts',
										cfgKeyNode : 'accounts',
										cfgProxyMethodType : 'POST',
										arrAccountVal : '',
										cfgDelimiter:'|&nbsp&nbsp&nbsp',
										listeners : {
											select : function(combo, record,
													index) {
												if (record
														&& record[0].data
														&& record[0].data.accounts)
													combo.arrAccountVal = record[0].data.accounts;
												thisClass.isSelectAccGrp = true;
											},
											keyup :  function( combo, e, eOpts){
												thisClass.isSelectAccGrp = false;
											},
											blur : function(combo, The, eOpts){
												if(!thisClass.isSelectAccGrp){
													combo.setValue("");
													thisClass.isSelectAccGrp = false;
												}
											}
										}
									}*/
									{
										xtype : 'label',
										text : getLabel('transactionType', 'Account Set'),
										cls : 'f13 ux_font-size14 ',
										padding : '0 0 2 0'
									},
									{
										xtype : 'combo',
										itemId : 'accSetAutoComp',
										id :'accountSet',
										queryMode : 'local',
										fieldCls : 'ux_no-border-right xn-form-field w110',
										triggerBaseCls : 'xn-form-trigger',
						                width  : (screen.width) > 1024 ? 218 : 218,
										editable : false,
										store : typeCodeStore,
										displayField : 'accountSetName',
										valueField : 'accounts',
										arrTypeCodeVal : '',
										emptyText : getLabel('select', 'All'),
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
				}, {
					xtype : 'container',
					layout : 'vbox',
					flex : 0.40,
					margin : '0 0 0 0',
					items : [{
								xtype : 'textfield',
								hideTrigger : true,
								labelAlign : 'top',
								labelSeparator : '',
								flex : 1,
								width  : (screen.width) > 1024 ? 268 : 268,
								fieldLabel : getLabel("widgetName",
										"Widget Name"),
								itemId : 'customname',
								fieldCls : 'xn-form-text',
								labelCls : 'frmLabel',
								name : 'customname',
								maxLength : 40, // restrict user to enter 40
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
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			fieldVal3 = settings[i].value3;
			operatorValue = settings[i].operator;

			// Account/Account Set
			// Values

			var objAutoCompRef1 = null;
			var objAutoCompRef2 = null;
			if (fieldName === 'account') {
				var accRadio = widget.down('radio[inputValue="A"]');
				accRadio.setValue(true);
				objAutoCompRef1 = widget
						.down('AutoCompleter[itemId=accAutoComp]');
				objAutoCompRef2 = widget
						.down('combobox[itemId=accSetAutoComp]');
				if (!Ext.isEmpty(objAutoCompRef1) && !Ext.isEmpty(fieldVal)) {
					/*objAutoCompRef1.store.add({
								"accountName" : fieldVal2,
								"accountId" : fieldVal
							});*/
					objAutoCompRef1.setValue(fieldVal);
					objAutoCompRef2.setValue('');
					me.isSelectAcc = true;
				}
			}
			if (fieldName === 'accountset') {
				var accsRadio = widget.down('radio[inputValue="AS"]');
				accsRadio.setValue(true);
				objAutoCompRef1 = widget
						.down('combobox[itemId=accSetAutoComp]');
				objAutoCompRef2 = widget
						.down('AutoCompleter[itemId=accAutoComp]');
				if (!Ext.isEmpty(objAutoCompRef1) && !Ext.isEmpty(fieldVal)) {
					/*objAutoCompRef1.store.add({
								"accountSetName" : fieldVal2,
								"accounts" : fieldVal
							});*/
					objAutoCompRef1.arrAccountVal = fieldVal;
					objAutoCompRef1.setValue(fieldVal3);
					objAutoCompRef2.setValue('');
					me.isSelectAccGrp = true;
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
	},
	getSettings : function(portletPanel) {
		var me = portletPanel;
		var thisClass = this;
		var jsonArray = [];
		var jsondtArray = [];
		// colPref
		jsonArray.push({
					field : 'colPref',
					value1 : thisClass.getGridState()
				});

		// Account/ Account Group
		var getCheckedBtnA = false;
		if(me.down('radio[inputValue="A"]')!=null)
			getCheckedBtnA = me.down('radio[inputValue="A"]').checked;
		var accAutoCompVal = me.down('AutoCompleter[itemId="accAutoComp"]')
				.getValue();
		var accAutoDispVal = me.down('AutoCompleter[itemId="accAutoComp"]')
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
		}

		var getCheckedBtnAS = me.down('radio[inputValue="AS"]').checked;
		var accSetAutoCompVal = null;
		var accSetAutoDispVal = me.down('combobox[itemId="accSetAutoComp"]').getRawValue();
		
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
		if (!Ext.isEmpty(accSetAutoCompVal) && getCheckedBtnAS == true
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
		var objDateParams = thisClass.getDateParam('1');
		
		if (!Ext.isEmpty(objDateParams.fieldValue1)) {
			jsondtArray.push({
						field : 'summaryFromDate',
						operator : 'eq',
						value1 : Ext.util.Format
								.date(objDateParams.fieldValue1, 'Y-m-d'),
						dateLabel : 'Today',
						dateLabelwidget :'Today',
						dataType : 'D',
						displayType : '1',
						btnValue : objDateParams.btnValue
					});
		}
		this.jsonDatetArray = jsondtArray;
		return jsonArray;
	},

	getDataPanel : function() {
		return this;
	},
	
	navigate : function (settings, record){
		var me = this;
		me.accountID = record.get('accountId');
		var strFilterUrl = '&$summaryType=previousday' + me.generateUrl(settings);
		strFilterUrl = strFilterUrl + '&' + me.accountTypeFilter
		+ '&$filterOn=' + '&' + me.accountFilter;
		me.fireEvent('navigateToAccountSummary', settings, strFilterUrl);
	}
});