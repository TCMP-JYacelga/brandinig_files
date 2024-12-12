Ext.define('Cashweb.view.portlet.CashPositionDtl', {
	extend : 'Ext.grid.Panel',
	requires : ['Ext.ux.gcp.CheckCombo'],
	alias : 'widget.cashpositiondtl',
	cols : 2,
	cls : 'cp-details-wgt',
	ccyCode : '',
	enableColumnMove : false,
	enableColumnResize : false,
	//enableLocking : true,
	enableColumnHide : false,
	summaryFromDateFilter : '',
	summaryToDateFilter : '',
	datePickerSelectedDate : [],
	selectedUser : '',
	crDrFlag : 'all',
	accountId : 'All',
	bank : '',
	bankCode : '',
	summaryDate : '',
	dateFilterVal : '',
	height:336,
	selfReference : null,
	
	initComponent : function() {
		var me = this;
		me.store = new Cashweb.store.CashPositionDtlStore();
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
		me.on('cellclick', function(xyz, td, cellIndex, record, tr,
						rowIndex, e, eOpts) {					
							me.fireEvent('seeMoreAccountRecords');
				});
		me.on('render', function(component, eOpts) {
					var settings = [];
					var filterUrl = '', datePresentFlag = false;
					me.setLoading(label_map.loading);
					var record = me.record;
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'ccy')
							me.ccyCode = settings[i].value1;
						if (settings[i].field === 'summaryDate')
							datePresentFlag = true;
						if (settings[i].field === 'bank')
						{
							if(settings[i].value1!='All')
							me.bankCode = settings[i].value1;
						}
					}
					if (!datePresentFlag) {
						var objDateParams = me.getDateParam("12", null);
						vFromDate = Ext.util.Format.date(Ext.Date.parse(
										objDateParams.fieldValue1, 'Y-m-d'),
								strExtApplicationDateFormat);
						settings.push({
									field : 'summaryDate',
									operator : 'eq',
									value1 : Ext.util.Format.date(vFromDate,
											'Y-m-d'),
									dateLabel : "Creation Date (Latest)",
									dataType : 'D',
									displayType : 5,
									btnValue : "12"
								});

						me.record.set('settings', settings);
					}

					filterUrl = me.generateUrl(settings);
					me.strFilterUrl = filterUrl;
					me.ajaxRequest(filterUrl, settings);
				});
		var objDefaultArr = [{
					header : "",
					dataIndex : 'desc',
					flex : 0.45,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header :getLabel("trasanctionCount", "Transaction Count"),
					dataIndex : 'count',
					align : 'right',
					flex : 0.20,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false				
				}, {
					header : getLabel("current", "Current"),
					dataIndex : 'current',
					align : 'right',
					flex : 0.20,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}];
		var columnModel = objDefaultArr;
		for (var i = 0; i < columnModel.length; i++) {
			columnModel[i].renderer = function(value, meta, record, row,
					column, store) {
				meta.tdAttr = 'title="' + (value) + '"';
				meta.style = 'cursor: pointer;';
				if (meta.column.dataIndex === "desc"
						&& ("posted_header" === record.data.type
								|| "pendingcr_header" === record.data.type
								|| "pendingdr_header" === record.data.type || "estimate_header" === record.data.type)) {
					var desc = record.data.desc;
					return '<span style="font-weight: 600; color:#1670A8">'
							+ desc + '</span>';
				}
				if (meta.column.dataIndex === "current"
						&& ("posted_header" === record.data.type
								|| "pendingcr_header" === record.data.type
								|| "pendingdr_header" === record.data.type || "estimate_header" === record.data.type)) {
					var desc = record.data.current;
					return '<span style="font-weight: 600; color:#1670A8">'
							+ desc + '</span>';
				} else if (meta.column.dataIndex === "desc") {
					var desc = record.data.desc;
					return '<span style="margin-left: 30px;">' + desc
							+ '</span>';
				}
				return value;
			}
		}

		me.dockedItems = [{
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
										padding : '0 45 0 0',
										cls : 'widget-footer-cls',
										handler : function() {
											me.fireEvent('seeMoreAccountRecords');
										}
									}]
								},{
									xtype : 'container',
									itemId : 'docLblContainer',
									dock : 'bottom',
									layout : 'hbox',
									items : [{
												xtype : 'label',
												itemId : 'firstLabel',
												width : '2%'
									},{
												xtype : 'label',
												itemId : 'dockLabel',
												style : 
												{
													'font-weight' : 'normal',
													'color' : '#f00'
												}
									},{
												xtype : 'label',
												itemId : 'blankLabel',
												width : '17%'
										}]
							}];
									
		me.columns = columnModel;
		me.callParent();
	},
	ajaxRequest : function(filterUrl, setting) {
		var obj;
		var thisClass = this;
		var strUrl = '';
		if (!Ext.isEmpty(filterUrl))
			strUrl = strUrl + filterUrl;

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
					url : 'services/getCashPositionDetails.json',// strUrl,
					method : 'POST',
					params : objParam,
					success : function(response) {
						obj = Ext.decode(response.responseText);
						if (thisClass.ccyCode === '')
							thisClass.ccyCode = obj.currency;
						thisClass.loadData(obj, setting);
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

	loadData : function(data, setting) {
		var me = this;
		var storeData = [], postedStoreData = [], pendingcrStoreData = [], pendingdrStoreData = [];
		var postedTotalAmt = 0, pendingcrTotalAmt = 0, pendingdrTotalAmt = 0, totalAmt = 0;
		var postedData = data.summary.posted;
		var trimmedAmt = 0;
		var pendingData = data.summary.pending;
		var xAccountcount = data.summary.x_account_count;
		var yAccountcount = data.summary.y_account_count;
		var summaryDate = data.summary.summaryDate;
		if (!Ext.isEmpty(summaryDate)) {
			var ampmChar = summaryDate[summaryDate.length - 1];
			if (ampmChar === '0') {
				summaryDate = summaryDate.slice(0, summaryDate.length - 2)
						+ ' AM';
			} else {
				summaryDate = summaryDate.slice(0, summaryDate.length - 2)
						+ ' PM';
			}
		}
		me.summaryDate = summaryDate;
		var noteInstance = me.down('label[itemId="dockLabel"]');
		//var labelConainer = me.down('container[itemId="docLblContainer"]');
		
		if(noteInstance){
		if (xAccountcount != yAccountcount) {
			noteInstance.setText("      Note : Intra Day data is available for "
					+ xAccountcount + " out of " + yAccountcount + " accounts");
					
			noteInstance.show();
			//labelConainer.show();
		} else
			noteInstance.hide();
			//labelConainer.hide();
		}
		me.setTitle(setting);
		if (!Ext.isEmpty(postedData)) {
			for (var i = 0; i < postedData.length; i++) {
				var colJson = {};
				colJson["desc"] = postedData[i].desc;
				if(undefined != postedData[i].count  && postedData[i].count != null)
					colJson["count"] = parseFloat(postedData[i].count);
				
				if(undefined != data.ccy_symbol  && data.ccy_symbol != null)
					colJson["current"] = data.ccy_symbol + ' '
						+ postedData[i].current;
				else
					colJson["current"] =  postedData[i].current;
				colJson["type"] = "posted";
				trimmedAmt = postedData[i].current.replace(/[, ]+/g, "").trim();
				postedTotalAmt = postedTotalAmt + parseFloat(trimmedAmt);
				postedStoreData.push(colJson);
				//if ((i + 1) === postedData.length) {
					
				//}
			}
		}
		if (!Ext.isEmpty(pendingData)) {
			for (var i = 0; i < pendingData.length; i++) {
				var colJson = {};
				if (pendingData[i].txnType === 'CR') {
					colJson["desc"] = pendingData[i].desc;
					colJson["count"] = parseFloat(pendingData[i].count);
					if(undefined != data.ccy_symbol  && data.ccy_symbol != null)
						colJson["current"] = data.ccy_symbol + ' '
							+ pendingData[i].current;
					else		
							colJson["current"] = pendingData[i].current;							
					colJson["type"] = "pendingcr";
					trimmedAmt = pendingData[i].current.replace(/[, ]+/g, "")
							.trim();
					pendingcrTotalAmt = pendingcrTotalAmt
							+ parseFloat(trimmedAmt);
					pendingcrStoreData.push(colJson);
				} else if (pendingData[i].txnType === 'DB') {
					colJson["desc"] = pendingData[i].desc;
					colJson["count"] = parseFloat(pendingData[i].count);
					if(undefined != data.ccy_symbol  && data.ccy_symbol != null)
						colJson["current"] = data.ccy_symbol + ' '
							+ pendingData[i].current;
					else		
						colJson["current"] = pendingData[i].current;							
					colJson["type"] = "pendingdr";
					trimmedAmt = pendingData[i].current.replace(/[, ]+/g, "")
							.trim();
					pendingdrTotalAmt = pendingdrTotalAmt
							+ parseFloat(trimmedAmt);
					pendingdrStoreData.push(colJson);
				}

			}
		}
		
		
		var colJson = {};
		colJson["desc"] = getLabel("postedBalance","Posted Balance");
		if(undefined != data.ccy_symbol  && data.ccy_symbol != null)
			colJson["current"] = data.ccy_symbol + ' '
				+ me.addCommas(postedTotalAmt);
		else
			colJson["current"] = me.addCommas(postedTotalAmt);
		colJson["type"] = "posted_header";
		postedStoreData.unshift(colJson);
		
		var colJson = {};
		colJson["desc"] = getLabel("pendingCredit","Pending Credits");
		if(undefined != data.ccy_symbol  && data.ccy_symbol != null)
			colJson["current"] = data.ccy_symbol + ' '
				+ me.addCommas(pendingcrTotalAmt);
		else
			colJson["current"] =  me.addCommas(pendingcrTotalAmt);				
		colJson["type"] = "pendingcr_header";
		pendingcrStoreData.unshift(colJson);
		var colJson = {};
		colJson["desc"] =getLabel("pendingDebit","Pending Debits");
		if(undefined != data.ccy_symbol  && data.ccy_symbol != null)
			colJson["current"] = data.ccy_symbol + ' '
				+ me.addCommas(pendingdrTotalAmt);
		else
			colJson["current"] = me.addCommas(pendingdrTotalAmt);				
		colJson["type"] = "pendingdr_header";
		pendingdrStoreData.unshift(colJson);

		pendingcrStoreData = pendingcrStoreData.concat(pendingdrStoreData);
		storeData = postedStoreData.concat(pendingcrStoreData);
		totalAmt = postedTotalAmt + pendingcrTotalAmt - pendingdrTotalAmt;

		var colJson = {};
		colJson["desc"] = getLabel("estimatedBalance","Estimated Balance");
		if(undefined != data.ccy_symbol  && data.ccy_symbol != null)
			colJson["current"] = data.ccy_symbol + ' ' + me.addCommas(totalAmt);
		else	
			colJson["current"] =  me.addCommas(totalAmt);
		colJson["type"] = "estimate_header";
		storeData.push(colJson);
		me.getStore().loadData(storeData);
		me.setLoading(false);
	},
	getAccStoreReload:function(thisClass,widget){
	var me = this; 
	var accDd=widget.down('combo[itemId="accountNumberDropDown"]');
	var data=null;
	var strUrl = 'services/balancesummary/btruseraccountsforwidgets.json';
		if (!Ext.isEmpty(me.bankCode))
			strUrl = strUrl + '?$bankCode=' + me.bankCode;
	Ext.Ajax.request({
		url:strUrl,
		async : false,
		method : 'GET',
		success : function(response) {
			var responseData = Ext.decode(response.responseText);
		      data = responseData.d.btruseraccount;
		}
	});
	var accStore = null;
	if (!Ext.isEmpty(data)) {
		accStore = Ext.create('Ext.data.Store', {
					fields : ['accountId','accountName'],
					data : data,
					autoLoad : true,
					listeners : {
						load : function() {
						}
					}
				});
		accStore.load();
		accDd.bindStore(accStore);
		accDd.allSelector=false;
		    accDd.selectAllValues(true);
		    accDd.updateSelectionCount();
		    accDd.createPicker();
		    accDd.setComboText(getLabel('all','All') +" "+ getLabel('selected','Selected'));
	}
	
	},
    getAccStore : function(thisClass) {
    	var me=this;
    	var data=null;
	var strUrl = 'services/balancesummary/btruseraccountsforwidgets.json';
		if (!Ext.isEmpty(me.bankCode))
			strUrl = strUrl + '?$bankCode=' + me.bankCode;
	Ext.Ajax.request({
		url:strUrl,
		async : false,
		method : 'GET',
		success : function(response) {
			var responseData = Ext.decode(response.responseText);
		     data = responseData.d.btruseraccount;
		     data.forEach(function(record){
					record.accountName = record.accountName +' | '+record.accountNumber;
				});
		}
	});
		
	var accStore = null;
	if (!Ext.isEmpty(data)) {
		accStore = Ext.create('Ext.data.Store', {
					fields : ['accountId','accountName'],
					data : data,
					autoLoad : true,
					listeners : {
						load : function() {
						}
					}
				});
		accStore.load();
	}
	return accStore;
},
	// Account field handling starts
	addAccountsMenuItems : function(creditPortlet) {
		var me = this;
		var strUrl = 'services/balancesummary/btruseraccountsforwidgets.json';
		if (!Ext.isEmpty(me.bankCode))
			strUrl = strUrl + '?$bankCode=' + me.bankCode;
		Ext.Ajax.request({
					url : strUrl,
					// Add currency parameter above
					method : 'GET',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.btruseraccount;
						me.loadAccountMenu(creditPortlet, data);
					},
					failure : function() {
						// console.log("Error Occured - Addition
						// Failed");
					}
				});
	},
	loadAccountMenu : function(creditPortlet, data) {
		var me = this;
		var menuRef = creditPortlet.down('menu[itemId="accountMenu"]');
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
							acctId : 'ALL',
							checked : true,
							listeners : {
								checkchange : function(item, checked) {
									me.accMenuAllHandler(creditPortlet, item,
											checked);
								}
							}
						});

				for (var index = 0; index < count; index++) {
					menuRef.add({
								xtype : 'menucheckitem',
								text : data[index].accountName,
								acctId : data[index].accountId,
								checked : true,
								listeners : {
									checkchange : function(item, checked) {
										me.updateAccountTextField(
												creditPortlet, item, checked);
									}
								}
							});
				}
			}
		}
	},
	accMenuAllHandler : function(creditPortlet, item, checked) {
		var me = this;
		var menuRef = creditPortlet.down('menu[itemId="accountMenu"]');
		var accountTextField = creditPortlet
				.down('textfield[itemId="accountNo"]');
		var itemArray = menuRef.items.items;

		if (checked) {
			me.allAccountItemChecked = true;
			for (var index = 1; index < itemArray.length; index++) {
				itemArray[index].setChecked(true);
			}
			if (!Ext.isEmpty(accountTextField)) {
				accountTextField.setValue("");
				accountTextField.setValue(getLabel('all', 'All'));
			}
		} else if (!me.allAccountItemUnChecked && !checked) {
			me.allAccountItemChecked = false;
			me.allAccountItemUnChecked = false;
			for (var index = 1; index < itemArray.length; index++) {
				accountTextField.setValue('');
				itemArray[index].setChecked(false);
			}
		} else {
			me.allAccountItemUnChecked = false;
		}
	},
	updateAccountTextField : function(creditPortlet, item, checked) {
		var me = this;
		var maxCountReached = false;
		var menuRef = creditPortlet.down('menu[itemId="accountMenu"]');

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = menuRef.items.items;
			var itemArrayLength = itemArray.length;
			var accountTextField = creditPortlet
					.down('textfield[itemId="accountNo"]');
			var textFieldData = '';
			var acctIdData = '';

			if (!me.allAccountItemChecked && checked) {
				me.allAccountItemUnChecked = false;
				var count = 1;
				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
						acctIdData += itemArray[index].acctId + ',';
						count++;
					}
				}
				if (count == itemArrayLength) {
					maxCountReached = true;
				}
			} else if (me.allAccountItemChecked && !checked) {
				if (itemArray[0].checked) {
					me.allAccountItemUnChecked = true;
					me.allAccountItemChecked = false;
					itemArray[0].setChecked(false);
				}

				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
						acctIdData += itemArray[index].acctId + ',';
					}
				}
			} else if (!me.allAccountItemChecked && !checked) {
				me.allAccountItemUnChecked = false;
				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
						acctIdData += itemArray[index].acctId + ',';
					}
				}
			}

			if (maxCountReached) {
				itemArray[0].setChecked(true);
			} else {
				var commaSeparatedString = textFieldData.substring(0,
						(textFieldData.length - 1));
				var commaSeparatedAcctIdString = acctIdData.substring(0,
						(acctIdData.length - 1));
				accountTextField.setValue('');
				accountTextField.setValue(commaSeparatedString);
				accountTextField.acctIdData = commaSeparatedAcctIdString;
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
		//me.getDatePicker();
		me.doLayout();
		//me.addAccountsMenuItems(portletSettings);
		//me.addDatePanel(portletSettings);
		me.selfReference =portletSettings;
		//me.addDateMenu(portletSettings);
		me.setSettings(portletSettings, me.record.get('settings'));
	},
	checkInfinity : function(intFilterDays) {
		if (intFilterDays == '0' || Ext.isEmpty(intFilterDays)) {
			return true;
		}
	},
	/*getDatePicker : function() {
		var me = this;
		$('#entryDatePickerQuickText').datepick({
			monthsToShow : 1,
			changeMonth : true,
			changeYear : true,
			dateFormat : strApplDateFormat.toLowerCase(),
			rangeSeparator : '  to  ',
			onClose : function(dates) {
				if (!Ext.isEmpty(dates)) {
					me.dateFilterVal = '13';
					var formattedFromDate = null, formattedToDate = null;
					var arrDates = [];
					
					var datePickerRef = $('#entryDatePickerQuickText');
					if (!Ext.isEmpty(dates)) {
						if (dates.length === 1) {
							formattedFromDate = Ext.Date.format(dates[0],
									strExtApplicationDateFormat);
							me.summaryFromDateFilter = formattedFromDate;
							me.summaryToDateFilter = formattedFromDate;
							datePickerRef.val(formattedFromDate);
							arrDates.push(formattedFromDate);
							arrDates.push(formattedFromDate);
						} else if (dates.length === 2) {
							formattedFromDate = Ext.Date.format(dates[0],
									strExtApplicationDateFormat);
							formattedToDate = Ext.Date.format(dates[1],
									strExtApplicationDateFormat);
							me.summaryFromDateFilter = formattedFromDate;
							me.summaryToDateFilter = formattedToDate;
							datePickerRef.setDateRangePickerValue([
									formattedFromDate, formattedToDate]);
							arrDates.push(formattedFromDate);
							arrDates.push(formattedToDate);		
						}
						me.datePickerSelectedDate = arrDates;
					}
					me.handleDateChange( me.dateFilterVal);
				} else {
					me.dateFilterVal = '';
					me.dateFilterLabel = '';
				}
			}
		});
	},*/
	// Payment Method field handlling ends
	/*handleDateChange : function(index) {
	
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#entryDatePickerQuickText');
		//var toDatePickerRef = $('#entryDataToPicker');

		if ( !Ext.isEmpty(me.selfReference)) {
			if (!Ext.isEmpty(me.dateFilterLabel) && !Ext.isEmpty(me.dateFilterVal) && me.dateFilterVal!='13') {
				me.selfReference.down('label[itemId=creationDateLbl]')
						.setText("Creation Date" + " ("
								+ me.dateFilterLabel + ")");
			} else {
				me.selfReference.down('label[itemId=creationDateLbl]')
						.setText("Creation Date (Date Range)");
			}
		}
 
		me.summaryFromDateFilter = objDateParams.fieldValue1;
		me.summaryToDateFilter = objDateParams.fieldValue2;
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.setDateRangePickerValue(me.summaryFromDateFilter);
			} else {
				datePickerRef.setDateRangePickerValue([
				me.summaryFromDateFilter, me.summaryToDateFilter]);
			}
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12') {
					datePickerRef
							.val(/* getLabel('till', 'Till') + ' ' + *//*me.summaryFromDateFilter);
				} else {
					datePickerRef
							.setDateRangePickerValue(me.summaryFromDateFilter);
				}
			} else {
				datePickerRef.setDateRangePickerValue([
						me.summaryFromDateFilter, me.summaryToDateFilter]);
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
	},*/
	getDateParam : function(index, dateType) {
		var me = this;
		me.dateFilterVal = index;
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
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;

				

			case '12' :
				// Latest
				 fieldValue1 = Ext.Date.format(date,
				 strSqlDateFormat);
				 fieldValue2 = fieldValue1;
				 operator = 'le';
				break;
				
			case '13' :
				// Date Range
				if(!isEmpty(me.datePickerSelectedDate)){
				if (me.datePickerSelectedDate.length == 1) {
					fieldValue1 = me.summaryFromDateFilter;
					fieldValue2 = me.summaryToDateFilter;
					operator = 'eq';
				} else if (me.datePickerSelectedDate.length == 2) {
					fieldValue1 = me.summaryFromDateFilter;
					fieldValue2 = me.summaryToDateFilter;
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
	getSettingsPanel : function() {
		var thisClass = this;
		var bankStore = Ext.create('Ext.data.Store', {
					fields : ['colId', 'colDesc']
				});
		Ext.Ajax.request({
					url : 'services/userseek/banklist.json',
					method : 'GET',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (bankStore) {
							bankStore.removeAll();
							var count = data.length;
							if (count > 0) {
								bankStore.add({
											'colId' : 'All',
											'colDesc' : getLabel('all','All')
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'colId' : data[index].BANK_CODE,
									'colDesc' : data[index].BANK_DESC
								}
								bankStore.add(record);
							}
						}
					},
					failure : function() {
					}
				});
		var settingsPanel = Ext.create('Ext.panel.Panel', {
			items : [{
				xtype : 'container',
				layout : 'column',
				padding : '0 0 0 0',
				flex : 1,
				items : [/*{
					xtype : 'container',
					// layout : 'vbox',
					itemId : 'completDatePanel',
					// flex : 0.38,
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-right',
					items : [{
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'creationDateLbl',
									text : getLabel("creationDate", "Creation Date"),
									cls : 'widget_date_menu'
								}, {
									xtype : 'button',
									border : 0,
									itemId : 'creationDateBtn',
									name : 'creationDateBtn',
									cls : 'ui-caret-dropdown',
									listeners : {
										click : function(event) {
											var menus = thisClass
													.createDateFilterMenu(thisClass.selfReference);
											var xy = event.getXY();
											menus.showAt(xy[0], xy[1] + 16);
											event.menu = menus;
										}
									}
								}]
					}, {

						xtype : 'container',
						itemId : 'dateRangeComponent',
						layout : 'hbox',
						hidden : false,
						items : [{
							xtype : 'component',
							width : '89%',
							// margin : '0 0 0 0',// Top Right Bottom Left
							itemId : 'entryDatePickerQuick',
							filterParamName : 'summaryDate',
							// endDateField : 'toDate',
							// startDateField : 'fromDate',
							html : '<input type="text"  id="entryDatePickerQuickText" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
						}, {
							itemId : 'entryDateFaFaCalender',
							xtype : 'component',
							margin : '1 0 0 -12',// Top Right Bottom Left
							cls : 'icon-calendar t7-adjust-cal',
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
				},*/
				{
					xtype : 'radiogroup',
					//flex : 0.38,
					columnWidth : 0.3333,
					cls : 'ft-smallMargin-left ft-smallMargin-right',
					columns : [55, 62, 62],
					itemId : 'creditDebitFlag',
					labelAlign : 'top',
					labelSeparator : '',
					labelCls : 'frmLabel',
					fieldLabel : getLabel("transactionType", "Transaction Type"),
					items : [{
								boxLabel : getLabel("all", "All"),
								name : 'creditDebitFlag',
								padding : '3 0 0 0',
								inputValue : 'All',
								checked : true
							}, {
								boxLabel : getLabel("debit", "Debit"),
								padding : '3 0 0 0',
								name : 'creditDebitFlag',
								inputValue : 'D'
							}, {
								boxLabel : getLabel("credit", "Credit"),
								padding : '3 0 0 0',
								name : 'creditDebitFlag',
								inputValue : 'C'
							}]
				},{
					xtype : 'container',
					layout : 'vbox',
					columnWidth : 0.3333,
					itemId : 'accountContainer',
					cls : 'ft-extraLargeMargin-left pagesetting',
					items : [{
								xtype : 'label',
								text : getLabel("accounts", "Accounts"),
								cls : 'f13 ux_font-size14'
							}, {
								xtype : 'checkcombo',
								valueField : 'accountId',
								displayField : 'accountName',
								editable : false,
								addAllSelector : true,
								emptyText : getLabel('all','All'),
								multiSelect : true,
								width : '100%',
								hideTrigger: true,
								padding : '0 6 0 0',
								itemId : 'accountNumberDropDown',
								isQuickStatusFieldChange : false,
								store:thisClass.getAccStore(this),
								listConfig:{
								   tpl: [
							            '<ul><tpl for=".">',
							                '<li role="option" class="x-boundlist-item" data-qtip="{accountName}">' +
							                 '<span class="x-combo-checker">&nbsp;</span>'+
							                '{accountName}</li>',
							            '</tpl></ul>'
							        ]
								 },
								listeners:{
									expand:function( field, eOpts){
									
									}
								}

							}]
				}, /*{
					xtype : 'container',
					layout : 'vbox',
					//flex : 0.38,
					columnWidth : 0.3344,
					cls : 'ft-extraLargeMargin-left',
					items : [{
								xtype : 'label',
								
								cls : 'frmLabel'
							}, {
								xtype : 'container',
								layout : 'hbox',
								itemId : 'accountContainer',
								margin : '7 0 0 0',//Top Right Bottom Left
								//width : 220,
								width  : (screen.width) > 1024 ? 247 : 247,
								items : [{
									xtype : 'textfield',
									itemId : 'accountNo',
									height : 35,
									width  : (screen.width) > 1024 ? 227 : 227,	
									acctIdData : '',
									name : 'accountNo',
									editable : false,
									fieldCls : 'ux_no-border-right xn-form-field',
									readOnly : true,
									value : 'All',
									listeners: {
							            render: function(textfield, eOpts ) {
							            	var accTextFiled = textfield;
							                this.getEl().on('mousedown', function(e, t, eOpts) {
							                	var ParentContainer,
							                		buttonRef;
							                	ParentContainer = accTextFiled.up('container[itemId="accountContainer"]');
							                	if(!Ext.isEmpty(ParentContainer)) {
							                		buttonRef = ParentContainer.down('button[itemId="accountDropDown"]');
							                	}
							                	if(!Ext.isEmpty(buttonRef)) {
							                		buttonRef.showMenu(e);
							                	}
							                });
							            }
							        }
								}, {
									xtype : 'button',
									border : 0,
									height : 35,
									margin : '0 -1 4 0',//Top Right Bottom Left
									itemId : 'accountDropDown',
									cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
									iconCls : 'black',
									glyph : 'xf0d7@fontawesome',
									menuAlign : 'tr-br',
									menu : Ext.create('Ext.menu.Menu', {
												itemId : 'accountMenu',
												width  : (screen.width) > 1024 ? 245 : 230,
												cls : 'ux_dropdown',
												maxHeight : 200,
												items : []
											})
								}]
							}]
				}*/{
					xtype : 'container',
					layout : 'hbox',
					//flex : 0.38,
					columnWidth : 0.3333,
					//cls : 'ft-extraLargeMargin-right',
					cls : 'ft-extraLargeMargin-left',
					items : [{
								xtype : 'AutoCompleter',
								flex : 0.24,
								fieldCls : 'xn-form-text xn-suggestion-box',
								width  : (screen.width) > 1024 ? 220 : 250,
								fitToParent : true,
								labelCls : 'frmLabel',
								emptyText : getLabel('searchCCY','Search By CCY'),
								fieldLabel : getLabel("CCY", "Currency"),
//								padding : '0 8 0 0',
								labelAlign : 'top',
								labelSeparator : '',
								itemId : 'Currency',
								name : 'Currency',
								cfgUrl : 'services/userseek/paymentccy.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'Currency',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE',
								cfgKeyNode : 'CODE'

							}]
				}]
			},			
			{
				xtype : 'container',
				layout : {
					type : 'column',
					pack : 'center'
				},
				flex : 1,
				cls : 'ft-padding-bottom',
				items : [/*{
					xtype : 'container',
					layout : 'hbox',
					//flex : 0.38,
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-right',
					items : [{
								xtype : 'AutoCompleter',
								flex : 0.24,
								fieldCls : 'xn-form-text xn-suggestion-box',
								width  : (screen.width) > 1024 ? 220 : 250,
								fitToParent : true,
								labelCls : 'frmLabel',
								emptyText : 'Enter Keyword or %',
								fieldLabel : getLabel("CCY", "CCY"),
//								padding : '0 8 0 0',
								labelAlign : 'top',
								labelSeparator : '',
								itemId : 'Currency',
								name : 'Currency',
								cfgUrl : 'services/userseek/paymentccy.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'Currency',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE',
								cfgKeyNode : 'CODE'

							}]
				},*/ {
					xtype : 'container',
					layout : 'hbox',
					//flex : 0.38,
					columnWidth : 0.3344,
					cls : 'ft-smallMargin-left ft-smallMargin-right',
					items : [{
						xtype : 'combo',
						itemId : 'bank',
						multiSelect : false,
						labelAlign : 'top',
						labelSeparator : '',
						labelCls : 'frmLabel',
						fieldCls : 'ux_no-border-right xn-form-field',
						triggerBaseCls : 'xn-form-trigger',
						editable : false,
						displayField : 'colDesc',
						valueField : 'colId',
						width  : (screen.width) > 1024 ? 245 : 245,
						queryMode : 'local',
						value : getLabel('all','All'),
						store : bankStore,
						fieldLabel : getLabel("bank", "Bank"),
						listConfig:{
								   tpl: [
							            '<ul><tpl for=".">',
							                '<li role="option" class="x-boundlist-item" data-qtip="{colDesc}">' +
							                '{colDesc}</li>',
							            '</tpl></ul>'
							        ]
								 },
						listeners : {
							select : function(combo, records, eOpts) {
								if (records[0].data.colId != 'All')
									thisClass.bankCode = records[0].data.colId;
								else
									thisClass.bankCode = '';
								thisClass.getAccStoreReload(thisClass,combo.up('window'));
							},
							boxready : function( combo , width, height, eOpts){
								if(combo.getStore().getCount() >= 2){
									combo.setValue(combo.getStore().getAt(0));
								}
							} 
						}
					}]
				}, {
					xtype : 'textfield',
					hideTrigger : true,
					//flex : 0.38,
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-left',
					labelAlign : 'top',
					labelSeparator : '',
					fieldLabel : getLabel("widgetName", "Widget Name"),
					itemId : 'customname',
					fieldCls : 'xn-form-text',
					//width : 220,
					width  : (screen.width) > 1024 ? 215 : 215,
					padding : '0 6 0 0',
					labelCls : 'frmLabel',
					name : 'customname',
					maxLength : 40, // restrict user to enter 40 chars max
					enforceMaxLength : true,
					maskRe : /[A-Za-z0-9 .]/
				}]
			}]
		});
		return settingsPanel;
	},
	generateUrl : function(settings) {
		var me = this;
		var ccyPresent = false, strFilter = '', accountPresent = false, datePresent = false;
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {
				if (settings[index].field != 'customname') {
						if (settings[index].field === 'summaryDate' )
						{
							me.summaryFromDateFilter = settings[index].value1;
							me.summaryToDateFilter = settings[index].value1;
							if (!Ext.isEmpty(settings[index].value2))
							{
								me.summaryToDateFilter = settings[index].value2;
								datePresent = true;
								continue;
							}
							datePresent = true;
							continue;
						}
					
					
					if (settings[index].field === 'accountId') {
						me.accountId = settings[index].value1;
						accountPresent = true;
						continue;
					}
					if (settings[index].field === 'bank') {
						me.bank = settings[index].value1;
						continue;
					}
					if (settings[index].field === 'ccy') {
						if (!Ext.isEmpty(settings[index].value1)) {
							me.ccyCode = settings[index].value1;
							ccyPresent = true;
						}
						continue;
					}
					if (settings[index].field === 'crDrValue') {
						strFilter = strFilter + settings[index].field + ' '
								+ settings[index].operator + ' ' + '\''
								+ settings[index].value1 + '\'';
					}
				}
			}
			if (!ccyPresent)
				me.ccyCode = '';
			if (!accountPresent)
				me.accountId = '';
			var strUrl = '';
			if (!Ext.isEmpty(strFilter))
				strUrl = strUrl + '?$filter=' + strFilter;
			if (!datePresent) {
				me.summaryFromDateFilter = '';
				me.summaryToDateFilter = '';
			}
			if (!Ext.isEmpty(me.summaryFromDateFilter)) {
				strUrl = strUrl + '&$summaryFromDate='
						+ me.summaryFromDateFilter;
				strUrl = strUrl + '&$summaryToDate=' + me.summaryToDateFilter;
			}
			if (!Ext.isEmpty(me.ccyCode))
				strUrl = strUrl + '&$ccy=' + me.ccyCode;
			if (!Ext.isEmpty(me.accountId))
				strUrl = strUrl + '&$accountId=' + me.accountId;
			if (!Ext.isEmpty(me.bank) && me.bank!='All')
				strUrl = strUrl + '&$filterValue=' + me.bank;
			return strUrl;
		}
	},
	setSettings : function(widget, settings) {
	var me = this;
		var strSqlDateFormat = 'm/d/Y';
		/*var temp = widget.down('label[itemId=creationDateLbl]');
		if (temp.text == "Creation Date") {
			var dateFilterLabel = "Creation Date (Latest)";
			widget.down('label[itemId=creationDateLbl]')
					.setText(dateFilterLabel);
		}*/
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			operatorValue = settings[i].operator;
			// Curreny
			if (fieldName === 'ccy') {
				var ccyField = widget.down('AutoCompleter[itemId="Currency"]');
				if (!Ext.isEmpty(ccyField)) {
					if (!Ext.isEmpty(fieldVal2))
						ccyField.setValue(fieldVal2);
				}
			}
			//Accounts
			if (fieldName === 'accountId') {
				var dataArray = fieldVal2.split(',').map(Number);
				var account = widget
						.down('combo[itemId="accountNumberDropDown"]');
						
				if (!Ext.isEmpty(account)) {
					if (!Ext.isEmpty(dataArray))
						account.setValue(dataArray);
				}
			}
			/*if (fieldName === 'accountId') {
				var menuRef = widget.down('menu[itemId="accountMenu"]');
				var account = widget.down('textfield[itemId="accountNo"]');
				if (!Ext.isEmpty(menuRef)) {
					var itemArray = menuRef.items.items;

					if (fieldVal === 'All') {
						for (var index = 0; index < itemArray.length; index++) {
							itemArray[index].setChecked(true);
						}
					} else {
						for (var index = 0; index < itemArray.length; index++) {
							itemArray[index].setChecked(false);
						}

						var dataArray = fieldVal2.split(',');
						for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
							for (var index = 1; index < itemArray.length; index++) {
								if (dataArray[dataIndex] == itemArray[index].text) {
									itemArray[index].setChecked(true);
								}
							}
						}
					}
				}
				if (!Ext.isEmpty(account)) {
					if (!Ext.isEmpty(fieldVal2))
						account.setValue(fieldVal2);
				}
			}*/
			// Bank
			if (fieldName === 'bank') {
				var bankName = widget.down('combo[itemId="bank"]');
				if (!Ext.isEmpty(bankName)) {
					if (!Ext.isEmpty(fieldVal))
						bankName.setValue(fieldVal);
				}
			}
			// Date

			/*if (fieldName === 'summaryDate') 
			{
				var dateFilterLabel = settings[i].dateLabel;
				var formattedFromDate = null, formattedToDate = null;
				var dateFilterRefFrom = $('#entryDatePickerQuickText');
				if (!Ext.isEmpty(fieldVal)) 
					 formattedFromDate = fieldVal;

				if (!Ext.isEmpty(fieldVal2)) 
						formattedToDate = fieldVal2;
						
				if (operatorValue === 'eq' || operatorValue==='le') {
					dateFilterRefFrom.val(formattedFromDate);
				}
				else if (operatorValue === 'bt') {
					dateFilterRefFrom.setDateRangePickerValue([formattedFromDate, formattedToDate]);
				}
				if (!Ext.isEmpty(dateFilterLabel)) {
					widget.down('label[itemId=creationDateLbl]').setText(dateFilterLabel);
					widget.creation_date_opt = dateFilterLabel;//TODO
				}
								
//				var dateVar1 = $.datepick.parseDate('yyyy-mm-dd', fieldVal);
//				var dateVar2 = $.datepick.parseDate('yyyy-mm-dd', fieldVal2);
//				var vFromDate = $.datepick.formatDate(strApplDateFormat.toLowerCase(), dateVar1 );
//				var vToDate = $.datepick.formatDate(strApplDateFormat.toLowerCase(), dateVar2 );

				//creation_date_opt = dateFilterLabel;
				//value1 : Ext.util.Format.date(vFromDate,
				//							'Y-m-d')
				
					//widget.down('label[itemId="creationDateLbl"]').setText(dateFilterLabel);
					//widget.down('container[itemId="dateRangeComponent"]').show();
					//var datePickerRef = $('#entryDatePickerQuickText');
					//datePickerRef.datepick('setDate', [formattedFromDate]);
			}*/
			// Credit Debit Flag
			if (fieldName === 'crDrValue') {

				if (fieldVal === 'DB') {
					var debitRadio = widget.down('radio[inputValue="D"]');
					debitRadio.setValue(true);
				}
				if (fieldVal === 'CR') {
					var creditRadio = widget.down('radio[inputValue="C"]');
					creditRadio.setValue(true);
				}
			}

			// Widget Name
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
		var me =  this;
		var jsonArray = [];
		// Currency
		var currencyCode = portletPanel.down('AutoCompleter[itemId="Currency"]')
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

		// Accounts
		/*var acctNo = portletPanel.down('textfield[itemId="accountNo"]').getValue();
		var acctIdData = portletPanel.down('textfield[itemId="accountNo"]').acctIdData;
		if (!Ext.isEmpty(acctNo) && acctNo != 'All') {
			jsonArray.push({
						field : 'accountId',
						operator : 'in',
						value1 : acctIdData,
						value2 : acctNo,
						dataType : 0,
						displayType : 0,
						detailFilter : 'Y'
					});
		}*/
		var accCombo = portletPanel.down('combo[itemId="accountNumberDropDown"]');
		var acctNo = accCombo.getValue();
		if (!Ext.isEmpty(acctNo) && acctNo != 'All' && (accCombo.value.length != accCombo.getStore().getCount())) {
			jsonArray.push({
						field : 'accountId',
						operator : 'in',
						value1 : acctNo,
						value2 : acctNo,
						dataType : 0,
						displayType : 0,
						detailFilter : 'Y'
					});
		}
		// Bank Name
		var bank = portletPanel.down('combo[itemId="bank"]').getValue();
		if (!Ext.isEmpty(bank)) {
			jsonArray.push({
						field : 'bank',
						operator : 'eq',
						value1 : bank,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// CreditDebitFlag
		var creditDebitFlagValue = portletPanel
				.down('radiogroup[itemId="creditDebitFlag"]').getValue().creditDebitFlag;
		if (!Ext.isEmpty(creditDebitFlagValue) && creditDebitFlagValue != 'All') {
			jsonArray.push({
						field : 'crDrValue',
						operator : 'eq',
						value1 : creditDebitFlagValue === 'D' ? 'DB' : 'CR' ,
						dataType : 0,
						displayType : 4
					});
		}

		// custom Name
		var customnameValue = portletPanel.down('textfield[itemId="customname"]')
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
		/*var datePickerText = $('#entryDatePickerQuickText').val();
		if(Ext.isEmpty(datePickerText)) {
			me.dateFilterVal = '';
			me.dateFilterLabel = '';
			portletPanel.down('label[itemId=creationDateLbl]').setText("Creation Date(Latest) ");
		}else{
			
		}
		var dateLabel = portletPanel.down('label[itemId=creationDateLbl]').text;

		
		var index = me.dateFilterVal;
		//var fieldVal = Ext.util.Format.date(me.summaryFromDateFilter, 'Y-m-d');
		//var fieldVal2 = Ext.util.Format.date(me.summaryToDateFilter, 'Y-m-d');

		//fromCreation = fieldVal;
		//toCreation = fieldVal2;
		//thisClass.datePickerSelectedDate = me.datePickerSelectedDate;
		var objDateParams = me.getDateParam(index);
		if (!Ext.isEmpty(index)) {
			me.summaryFromDateFilter = objDateParams.fieldValue1;
			me.summaryToDateFilter = objDateParams.fieldValue2;
			jsonArray.push({
						field : 'summaryDate',
						value1 : objDateParams.fieldValue1,
						value2 : objDateParams.fieldValue2,
						operator : objDateParams.operator,
						dateLabel : dateLabel,
						dataType : 'D',
						displayType : 5,
						btnValue : index
						//dateLabel : dateLabel == null ? getLabel("generationDate", "Transaction Date") : dateLabel
					});
		}*/
		
		return jsonArray;
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
	}
	/*createDateFilterMenu : function(portletSettings) {
		var me = this;
		var menu = null;
		var intFilterDays = me.filterRestrict;
		var arrMenuItem = [];

		arrMenuItem.push({
					text : getLabel('latest', 'Latest'),
					btnId : 'btnLatest',
					btnValue : '12',
					parent : this,
					handler : function(btn, opts) {
						//this.parent.fireEvent('dateChange', btn, opts);
						//$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						me.dateFilterVal = btn.btnValue;
						me.dateFilterLabel = btn.text;
						me.handleDateChange(btn.btnValue);
					}
				});
		arrMenuItem.push({
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					parent : this,
					handler : function(btn, opts) {
						//this.parent.fireEvent('dateChange', btn, opts);
						//$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						me.dateFilterVal = btn.btnValue;
						me.dateFilterLabel = btn.text;
						me.handleDateChange(btn.btnValue);
					}
				});
		//if (intFilterDays >= 2 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							//$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					});
	//	if (intFilterDays >= 7 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							//$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange( btn.btnValue);
						}
					});
	//	if (intFilterDays >= 14 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : this,
						btnValue : '4',
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							//$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					});
					
					
		//if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : this,
						btnValue : '5',
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							//$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange( btn.btnValue);
						}
					});
	//	if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							//$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange( btn.btnValue);
						}
					});
	//	if (intFilterDays >= 90 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							//$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					});
	//	if (intFilterDays >= 180 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : this,
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							//$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange( btn.btnValue);
						}
					});
		//if (intFilterDays >= 365 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							//$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange( btn.btnValue);
						}
					});
		//if (intFilterDays >= 730 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						parent : this,
						btnValue : '11',
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							//$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
						}
					});
		arrMenuItem.push({
					text : getLabel('daterange', 'Date Range'),
					btnId : 'btnDateRange',
					parent : this,
					btnValue : '7',
					handler : function(btn, opts) {
						this.parent.fireEvent('dateChange', btn, opts);
						//$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						var field = me.down('datefield[itemId="fromDate"]');
						if (field)
							field.setValue('');
						field = me.down('datefield[itemId="toDate"]');
						if (field)
							field.setValue('');
						me.dateFilterVal = btn.btnValue;
						me.dateFilterLabel = btn.text;
						me.handleDateChange(btn.btnValue);
					}
				});
				
			
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'dateMenu',
		cls : 'ext-dropdown-menu',
		items : arrMenuItem,
		listeners : {
				hide:function(event) {
					this.addCls('ui-caret-dropdown');
					this.removeCls('action-down-hover');
				},
				render : function(){
					
				}
			}
		});
			
		/* menu = Ext.create('Ext.menu.Menu', {
					items : arrMenuItem
				});	*/
		
		//return dropdownMenu;

	//}
});