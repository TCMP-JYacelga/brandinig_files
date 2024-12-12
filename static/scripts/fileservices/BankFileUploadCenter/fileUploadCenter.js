function getDateDropDownItems(filterType,buttonIns) {
	var dropdownMenu = Ext.create('Ext.menu.Menu', {
				itemId : 'DateMenu',
				cls : 'ext-dropdown-menu',
				listeners : {
					hide:function(event) {
						buttonIns.addCls('ui-caret-dropdown');
						buttonIns.removeCls('action-down-hover');
					}
				},

				
				items : [
					
					/*{
					text : getLabel('latest', 'Latest'),
					btnId : 'latest',
					btnValue : '12',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
					}
				},*/
				
				{
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
					}
				}, {
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
					}
				}, {
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
					}
				}, {
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
					}
				}, {
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',
					btnValue : '5',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
					}
				}, {
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'btnLastmonth',
					btnValue : '6',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
					}
				}, {
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
					}
				}, {
					text : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
					}
				}, {
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
					}
				}, {
					text : getLabel('lastyeartodate', 'Last Year To Date'),
					btnId : 'btnYearToDate',
					btnValue : '11',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
					}
				}]
			});
	return dropdownMenu;
}

function showAdvanceFilterPopup() {
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		resizable : false,
		draggable : false,
		minHeight : 156,
		maxHeight : 550,
		width : 735,
		modal : true,
		dialogClass : 'ft-tab-bar',
	/*	buttons : [{
			id : 'advFilterSearch',
			text : 'Search',
			click : function() {
				if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
					$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
				}
				$(document).trigger("searchActionClicked");
				$(this).dialog("close");
			}
		}, {
			id : 'advFilterSaveAndSearch',
			text : 'Save And Search',
			click : function() {
				$(document).trigger("saveAndSearchActionClicked");
			}
		}, {
			id : 'advFilterClear',
			text : 'Clear',
			click : function() {
				$(document).trigger("resetAllFieldsEvent");
			}
		}, {
			id : 'advFilterCancel',
			text : 'Cancel',
			click : function() {
				$(this).dialog("close");
			}
		}],*/
		
		open : function() {
			if (!advancedFilterFieldsDataAdded) {
				$("#tabs").tabs({
					select : function(event, tab) {
						if (tab.index == 0) {
							if (!$('#advancedFilterErrorDiv')
									.hasClass('ui-helper-hidden')) {
								$('#advancedFilterErrorDiv')
										.addClass('ui-helper-hidden');
							}
							$('#advFilterSearch').hide();
							$('#advFilterSaveAndSearch').hide();
							$('#advFilterClear').hide();
							$('#advFilterCancel').hide();
							$('#advFilterClose').show();
						} else {
							$('#advFilterSearch').show();
							$('#advFilterSaveAndSearch').show();
							$('#advFilterClear').show();
							$('#advFilterCancel').show();
							$('#advFilterClose').hide();
						}
					},
					show : function(e, ui) {
						if ('undefined' != filterGrid && !isEmpty(filterGrid))
							filterGrid.getView().refresh();
					}
				});
				$("#tabs").barTabs();
				setStatusDropDownItems("#statusAdvFilter");
				filterGrid = createFilterGrid();
				changeAdvancedFilterTab(1);
				advancedFilterFieldsDataAdded = true;
			}
		}
	});
	$('#advancedFilterPopup').dialog("open");
}

function setStatusDropDownItems(elementId) {
	var statusArray = advFilterJsonArray;
	for (var index = 0; index < statusArray.length; index++) {
		var opt = $('<option />', {
					value : statusArray[index].key,
					text : statusArray[index].value
				});
		opt.appendTo(elementId);
	}
}
function isEmpty(strValue) {
	return (strValue == null || strValue == undefined || strValue.length == 0);
}
function changeAdvancedFilterTab(index) {
	if (index == 0) {
		$('#advFilterSearch').hide();
		$('#advFilterSaveAndSearch').hide();
		$('#advFilterClear').hide();
		$('#advFilterCancel').hide();
		$('#advFilterClose').show();
	} else {
		$('#advFilterSearch').show();
		$('#advFilterSaveAndSearch').show();
		$('#advFilterClear').show();
		$('#advFilterCancel').show();
		$('#advFilterClose').hide();
	}
	$('#tabs').tabs("option", "selected", index);
}

function getAdvancedFilterQueryJson() {
	var objJson = null;
	var jsonArray = [];

	// File Name
	var fileNameVal = $("input[type='text'][id='fileName']").val();
	if (!Ext.isEmpty(fileNameVal)) {
		jsonArray.push({
					field : 'fileName',
					operator : 'lk',
					value1 : fileNameVal,
					value2 : '',
					dataType : 0,
					displayType : 0
				});
	}

	// User Name
	var userNameVal = $("input[type='text'][id='user']").val();
	if (!Ext.isEmpty(userNameVal)) {
		jsonArray.push({
					field : 'userName',
					operator : 'lk',
					value1 : userNameVal,
					value2 : '',
					dataType : 0,
					displayType : 0
				});
	}

	// Import Date
	if (!jQuery.isEmptyObject(selectedImportDateInAdvFilter)) {
		jsonArray.push({
					field : 'uploadDateFilter',
					operator : selectedImportDateInAdvFilter.operator,
					value1 : Ext.util.Format.date(
							selectedImportDateInAdvFilter.fromDate, 'Y-m-d'),
					value2 : (!Ext
							.isEmpty(selectedImportDateInAdvFilter.toDate))
							? Ext.util.Format.date(
									selectedImportDateInAdvFilter.toDate,
									'Y-m-d')
							: '',
					dataType : 1,
					displayType : 5
				});
	}

	// Sort By
	var statusAdvFilterVal = $("select[id='statusAdvFilter']").val();
	if (!Ext.isEmpty(statusAdvFilterVal) && statusAdvFilterVal != "All"
			&& statusAdvFilterVal != "None") {
		jsonArray.push({
					field : 'statusCombo',
					operator : 'eq',
					value1 : statusAdvFilterVal,
					dataType : 0,
					displayType : 6
				});
	}
	objJson = jsonArray;
	return objJson;
}
function getAdvancedFilterValueJson(FilterCodeVal) {
	var jsonArray = [];

	// File Name
	var fileNameVal = $("input[type='text'][id='fileName']").val();
	if (!Ext.isEmpty(fileNameVal)) {
		jsonArray.push({
					field : 'fileName',
					operator : 'lk',
					value1 : fileNameVal,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}

	// User Name
	var userNameVal = $("input[type='text'][id='user']").val();
	if (!Ext.isEmpty(userNameVal)) {
		jsonArray.push({
					field : 'userName',
					operator : 'lk',
					value1 : userNameVal,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}

	// Import Date
	if (!jQuery.isEmptyObject(selectedImportDateInAdvFilter)) {
		jsonArray.push({
					field : 'uploadDateFilter',
					operator : selectedImportDateInAdvFilter.operator,
					value1 : Ext.util.Format.date(
							selectedImportDateInAdvFilter.fromDate, 'Y-m-d'),
					value2 : (!Ext
							.isEmpty(selectedImportDateInAdvFilter.toDate))
							? Ext.util.Format.date(
									selectedImportDateInAdvFilter.toDate,
									'Y-m-d')
							: '',
					dataType : 1,
					displayType : 5
				});
	}

	// Status
	var statusAdvFilterCombo = $("select[id='statusAdvFilter']").val();
	if (!Ext.isEmpty(statusAdvFilterCombo) && statusAdvFilterCombo !== "All") {
		jsonArray.push({
					field : 'status',
					operator : 'eq',
					value1 : statusAdvFilterCombo,
					dataType : 0,
					displayType : 6
				});
	}

	objJson = {};
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
		objJson.filterCode = FilterCodeVal;
	return objJson;
}
function showErrorReportPopUp(record) {
	$('#errorReportPopUp').dialog({
				autoOpen : false,
				maxHeight : 550,
				width : 600,
				modal : true,
				buttons : [{
							id : 'advFilterCancel',
							text : 'OK',
							click : function() {
								$(this).dialog("close");
							}
						}],
				open : function() {
					populatePopUp(record);
					var ahtskid = record.get("ahtskid");
					filterGrid = createErrorGrid(ahtskid);
				}
			});
	$('#errorReportPopUp').dialog("open");
}

function createErrorGrid(fileId) {
	var arrayData = errorGridStore(fileId);
	$('#errorReportDetails').empty();
	var grid = Ext.create('Ext.grid.Panel', {
				margin : '15 0 0 0',
				autoScroll : true,
				forceFit : true,
				store : arrayData,
				defaultSortable : false,
				columns : [{
							dataIndex : 'srNO',
							sortable : false,
							menuDisabled : true,
							width : 5,
							text : getLabel('srNO', 'Sr No')
						}, {
							dataIndex : 'error',
							sortable : false,
							menuDisabled : true,
							width : 90,
							text : getLabel('description', 'Description')
						}],
				renderTo : 'errorReportDetails'		
			});
	grid.on('resize', function() {
				grid.doLayout();
			});

	return grid;
}

function errorGridStore(fileId) {
	var strUrl = 'fileUploadCenterList/errorReport.srvc?'+ csrfTokenName + '='
			+ csrfTokenValue;

	var errorData = new Array();
	var arrayData = new Array();
	Ext.Ajax.request({
				url : strUrl,
				method : 'POST',
				jsonData : fileId,
				async : false,
				success : function(response) {
					var data = Ext.decode(response.responseText);
					var count = data.d.fileUploadCenter.length;
					var errorCode;
					arrayData = new Ext.data.ArrayStore({
								fields : ['srNO', 'error']
							});
					for (var i = 0; i < count; i++) {
						// data = data.d.fileUploadCenter[i];

						errorCode = data.d.fileUploadCenter[i].errorCode;
						var errorData = [[1, errorCode]];
						arrayData.loadData(errorData);
					}
				},
				failure : function() {
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel('HistoryPopUpTitle', 'Error'),
								msg : getLabel('HistoryErrorPopUpMsg',
										'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});
	return arrayData;
}
function populatePopUp(record) {
	$('#errorFileName').val(record.get("ahtskSrc"));
	$('#errorTotalNoOfTxns').val(record.get("ahtskTotalInst"));
	$('#errorImportDate').val(record.get("uploadDateFilter"));
	$('#errorStatus').val(record.get("ahtskStatus"));
	$('#erroControlAmnt').val(record.get("ahtskTotalAmnt"));
	$('#erroTotalRejTxns').val(record.get("ahtskTotalInstRejected"));
}