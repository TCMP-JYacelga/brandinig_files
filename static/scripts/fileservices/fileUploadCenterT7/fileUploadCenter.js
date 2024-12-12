function getDateDropDownItems(filterType,buttonIns) {
	var dropdownMenu = Ext.create('Ext.menu.Menu', {
				itemId : 'DateMenu',
				cls : 'ext-dropdown-menu',
				listeners : {
					hide:function(event) {
						buttonIns.removeCls('action-down-hover');
					}
				},	
				items : [{
					text : getLabel('latest', 'Latest'),
					btnId : 'latest',
					btnValue : '12',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
								updateToolTip(filterType," Latest");
					}
				}, {
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
								updateToolTip(filterType," Today");
					}
				}, {
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
								updateToolTip(filterType," Yesterday");
					}
				}, {
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
								updateToolTip(filterType," This Week");
					}
				}, {
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
								updateToolTip(filterType," Last Week To Date");
					}
				}, {
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',
					btnValue : '5',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
								updateToolTip(filterType," This Month");
					}
				}, {
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'btnLastmonth',
					btnValue : '6',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
								updateToolTip(filterType," Last Month To Date");
					}
				}, {
					text : getLabel('lastmonthonly', 'Last Month Only'),
					btnId : 'btnLastmonthonly',
					btnValue : '14',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
								updateToolTip(filterType," Last Month Only");
					}
				},{
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
								updateToolTip(filterType," this Quater");
					}
				}, {
					text : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
								updateToolTip(filterType," Last Quater To Date");
					}
				}, {
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
								updateToolTip(filterType," This Year");
					}
				}, {
					text : getLabel('lastyeartodate', 'Last Year To Date'),
					btnId : 'btnYearToDate',
					btnValue : '11',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType, btn, opts]);
								updateToolTip(filterType," Last Year To Date");
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
		maxHeight: 580,
		minHeight: (screen.width) > 1024 ? 156 : 0 ,
		width : 840,
		modal : true,
		open : function() {
			hideErrorPanel('#advancedFilterErrorDiv');
			setImportDateDropDownMenu('importDateDropDown');	
			/*if (!advancedFilterFieldsDataAdded) {
				advancedFilterFieldsDataAdded = true;
				setSavedFilterComboItems('#msSavedFilter');
			}*/
			selectedStatusListSumm = $("select[id='statusAdvFilter']").getMultiSelectValueString();
			setStatusDropDownItems("statusAdvFilter");
			setSavedFilterComboItems('#msSavedFilter');
			$(document).trigger("setImportDateFilterLabel");
		}
	});
	$('#advancedFilterPopup').dialog("open");
	autoFocusOnFirstElement(null, 'advancedFilterPopup', true);
}

function populateAdvancedFilterFieldValue()
{
    setImportDateDropDownMenu('importDateDropDown');
    setStatusDropDownItems("statusAdvFilter");
    setSavedFilterComboItems('#msSavedFilter');
}

function setStatusDropDownItems(elementId) {
	var statusArray = advFilterJsonArray;
	var el = $("#"+elementId).multiselect();
	$("#"+elementId).empty();
	el.attr('multiple',true);
	
	if (selectedStatusListSumm != undefined && selectedStatusListSumm != "")
	{
		var itemArray=selectedStatusListSumm.split(',');
		if (itemArray.length != 0)
		{
			for (var index = 0; index < statusArray.length; index++) 
			{
				var opt = $('<option />', {
							value : statusArray[index].key,
							text : statusArray[index].value
						});
				
				for (var cnt = 0; cnt < itemArray.length; cnt++) 
				{	
					if ( statusArray[index].key == itemArray[cnt])
					{
						opt.attr('selected',true);
						opt.appendTo( el );
						break;
					}
					else
					{
						opt.attr('selected',false);
						opt.appendTo( el );
					}
				}
			}
		}
	}
	else
	{
		for (var index = 0; index < statusArray.length; index++) {
			var opt = $('<option />', {
						value : statusArray[index].key,
						text : statusArray[index].value
					});
			opt.attr('selected','selected');
			opt.appendTo(el);
		}
	}
	filterStatusCount=statusArray.length;
	el.multiselect('refresh');
}
function isEmpty(strValue) {
	return (strValue == null || strValue == undefined || strValue.length == 0);
}

function getAdvancedFilterQueryJson() {
	var objJson = null;
	var jsonArray = [];

	// File Name
	var fileNameVal = $("input[type='text'][id='fileName']").val();
	if (!Ext.isEmpty(fileNameVal)) {
		var tempFileName =fileNameVal.toLowerCase();
		tempFileName = encodeURIComponent(tempFileName.replace(new RegExp("'", 'g'), "\''"));
		jsonArray.push({
					field : 'fileName',
					operator : 'lk',
					value1 : tempFileName,
					paramFieldLable : getLabel('fileName', 'File Name'),
					value2 : '',
					displayValue1 : fileNameVal,
					dataType : 0,
					displayType : 0
				});
	}

	// User Name
	var userNameVal = $("input[type='text'][id='user']").val();
	if (!Ext.isEmpty(userNameVal)) {
		var tempUserName = userNameVal.toLowerCase();
		tempUserName = encodeURIComponent(tempUserName.replace(new RegExp("'", 'g'), "\''"));
		jsonArray.push({
					field : 'userName',
					operator : 'lk',
					value1 : tempUserName,
					paramFieldLable : getLabel('user', 'User'),
					displayValue1 : userNameVal,
					value2 : '',
					dataType : 0,
					displayType : 0
				});
	}

	// Import Date
	if (!jQuery.isEmptyObject(selectedImportDateInAdvFilter)) {
		var val1 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDefaultFormat, selectedImportDateInAdvFilter.fromDate));
        var val2 = '';
        if(!Ext.isEmpty(selectedImportDateInAdvFilter.toDate)) {
            val2 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDefaultFormat, selectedImportDateInAdvFilter.toDate));
        }
		jsonArray.push({
					field : 'uploadDateFilter',
					paramFieldLable : getLabel('importDate', 'Import Date'),
					operator : selectedImportDateInAdvFilter.operator,
					paramIsMandatory : true,
					value1 : val1,
					value2 : val2,
					dataType : 1, 
					//displayType : 5,
                    fieldLabel : getLabel('importDate', 'Import Date'),
                    dropdownLabel : selectedImportDateInAdvFilter.importDateLabel,
                    displayValue1 : val1
				});
	}

	var statusValue=$("select[id='statusAdvFilter']").getMultiSelectValue();
	
	var statusValueDesc = [];
	$('#statusAdvFilter :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});
	
	if(statusValue=="" && !Ext.isEmpty(selectedStatusListSumm)){
		statusValue = selectedStatusListSumm;
		filterStatusCount=selectedStatusListSumm.length +1;
		}
	var statusValueString=statusValue.join("and");
	var tempStatusValue;
	if (!Ext.isEmpty(statusValueString)) {
		if(!Ext.isEmpty(filterStatusCount)){
			var statusValueArray=statusValueString.split("and");
			tempStatusValue=statusValueArray.join(',');
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
		}
		if(tempStatusValue != "All")
			jsonArray.push({
						field : 'status',
						operator : 'in',
						value1 : tempStatusValue,
						value2 : '',
						dataType : 0,
						displayType :11,// 6,
						fieldLabel : getLabel('status','Status'),
						displayValue1 : statusValueDesc.toString()
						
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
		var tempFileName =fileNameVal.toLowerCase();
		tempFileName = encodeURIComponent(tempFileName.replace(new RegExp("'", 'g'), "\''"));
		jsonArray.push({
					field : 'fileName',
					paramFieldLable : getLabel('fileName', 'File Name'),
					operator : 'lk',
					value1 : tempFileName,
					value2 : '',
					dataType : 0,
					displayType : 4,
					fieldLabel : getLabel('fileName', 'File Name')
				});
	}

	// User Name
	var userNameVal = $("input[type='text'][id='user']").val();
	if (!Ext.isEmpty(userNameVal)) {
		var tempUserName = userNameVal.toLowerCase();
		tempUserName = encodeURIComponent(tempUserName.replace(new RegExp("'", 'g'), "\''"));
		jsonArray.push({
					field : 'userName',
					paramFieldLable : getLabel('user', 'User'),
					operator : 'lk',
					value1 : tempUserName,
					value2 : '',
					dataType : 0,
					displayType : 4,
					fieldLabel : getLabel('user', 'user')
				});
	}

	// Import Date
	if (!jQuery.isEmptyObject(selectedImportDateInAdvFilter)) {
		jsonArray.push({
					field : 'uploadDateFilter',
					paramFieldLable : getLabel('importDate', 'Import Date'),
					operator : selectedImportDateInAdvFilter.operator,
					paramIsMandatory : true,
					value1 : Ext.util.Format.date(
							selectedImportDateInAdvFilter.fromDate, 'Y-m-d'),
					value2 : (!Ext
							.isEmpty(selectedImportDateInAdvFilter.toDate))
							? Ext.util.Format.date(
									selectedImportDateInAdvFilter.toDate,
									'Y-m-d')
							: '',
					dataType : 1,
					//displayType : 5,
					fieldLabel : getLabel('importDate', 'Import Date'),
		            dropdownLabel : selectedImportDateInAdvFilter.importDateLabel,
					displayValue1 : Ext.util.Format.date(selectedImportDateInAdvFilter.fromDate, 'Y-m-d'),
				});
	}

	// Status
	/*var statusAdvFilterCombo = $("select[id='statusAdvFilter']").val();
	if (!Ext.isEmpty(statusAdvFilterCombo) && statusAdvFilterCombo !== "All") {
		jsonArray.push({
					field : 'status',
					operator : 'eq',
					value1 : statusAdvFilterCombo,
					dataType : 0,
					displayType : 6
				});
	}*/
	var statusValue=$("#statusAdvFilter").getMultiSelectValue();
	
	var statusValueDesc = [];
	$('#statusAdvFilter :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});
	
	var statusValueString=statusValue.join("and");
	var tempStatusValue;
	if (!Ext.isEmpty(statusValueString)) {
		if(!Ext.isEmpty(filterStatusCount)){
			var statusValueArray=statusValueString.split("and");
			 tempStatusValue=statusValueArray;
			 /* tempStatusValue=statusValueArray.join(','); */
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
		}
		if(tempStatusValue != "All")
			jsonArray.push({
						field : 'status',
						operator : 'in',
						value1 : tempStatusValue,
						value2 : '',
						dataType : 0,
						displayType :11,// 6,
						fieldLabel : getLabel('status','Status'),
						displayValue1 : statusValueDesc.toString()
						
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
							text : getLabel('btnOk','OK'),
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
	var strUrl = 'fileUploadCenterList/errorReport.srvc?' + csrfTokenName + '='
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
								buttonText: {
						            ok: getLabel('btnOk', 'OK')
									} ,
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

function setSavedFilterComboItems(element){
	$.ajax({
		url : 'services/userfilterslist/fileUploadCenter.json',
		async : false,
		success : function(responseText) {
			if(responseText && responseText.d && responseText.d.filters){
				$(element).empty();
				$(element).append($('<option>', { 
					value: '',
					text : getLabel('select','Select'),
					selected : false
					}));
				 var responseData=responseText.d.filters;
				 if(responseData.length > 0){
					$.each(responseData,function(index,item){
						$(element).append($('<option>', { 
							value: responseData[index],
							text : responseData[index],
							selected : false
							}));
					});
				 }
			}
			$(element).multiselect('refresh');
		}
		
	});	
}
function resetAllMenuItemsInMultiSelect(elementId)
{
	$(elementId+' option').prop('selected', true);
	$(elementId).multiselect("refresh");
}