var import_date_opt ="";
function showUploadPopup(fptrCallback,selectedSeller,selectedClient,selectedClientDesc)
{
	var strUrl;
	var popupLabel = "";
	if(screenType == 'ACH')
	{
		strUrl = 'passThruFileACHupload.srvc';
		popupLabel = labels.uploadFile;
	}		
	else
	{
		strUrl = 'passThruPositivePayupload.srvc';
		popupLabel = labels.uploadFilePositivePay;
	}
	$("#uploadBtn").addClass("ft-button ft-button-primary");
	$('#uploadBtn').attr('disabled','disabled');
	$(".selector").autocomplete({delay : 3000});
    $("#clientName").passThruClientAutoComplete();
	$("#clientName").placehold("something-temporary");
    $('#selectedSeller').val(selectedSeller);
    $('#selectedClientDesc').val(selectedClientDesc);
    $('#selectedClient').val(selectedClient);
    $('#clientId').val(selectedClient);
    $('#uploadInstrumentFile').find('#uploadErrors').hide();
	var dlg = $('#uploadInstrumentFile');
	var btnsArr={};		
	btnsArr[labels.uploadBtn]=function() {$(this).dialog("close"); fptrCallback.call(null, strUrl);};
	btnsArr[labels.cancelBtn]=function() {$(this).dialog('close');};
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false,draggable:false, width:400,title :popupLabel});
					//Cancel: function() {$(this).dialog('close');}}});
	dlg.dialog('open');
	$('#clientName').blur();
	$('#uploadBtn').bind('blur', function () {
		autoFocusOnFirstElement(null, 'uploadInstrumentFile', true);
	});
	$('#btnCancel').bind('blur', function () {
		if($('#uploadBtn').is(':disabled'))
			{
				autoFocusOnFirstElement(null, 'uploadInstrumentFile', true);
}
	});
	autoFocusOnFirstElement(null, 'uploadInstrumentFile', true);
}
function uploadFile(strUrl)
{
	if(screenType == 'ACH')
		strUrl = 'passThruFileACHupload.srvc';
	else
		strUrl = 'passThruPositivePayupload.srvc';
	count = 0;
	isRefresh = false;
	var selectedSeller = $('#selectedSeller').val();
	var selectedClient = $('#selectedClient').val();
	var selectedClientDesc = $('#selectedClientDesc').val();
	if($('#clientName').val() != null && $('#clientName').val() != undefined)
		document.getElementById("clientId").value = $('#clientName').val();
	
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	
	var formData = new FormData();
	
	formData.append(csrfTokenName, csrfTokenValue);
	formData.append('selectedSeller',selectedSeller);
	formData.append('selectedClient',selectedClient);
	if($('#clientName').val() != null && $('#clientName').val() != undefined)
		formData.append('clientId',$('#clientName').val());
	else
		formData.append('clientId',selectedClient);
	formData.append('selectedClientDesc',selectedClientDesc);
	formData.append('file',document.getElementsByName('file')[0].files[0]);
	
	$.ajax({
		url: frm.action,
		type: frm.method,
		data: formData,
	    contentType: false,
	    processData: false,
		success: function(response) {
			if(response && response.d && response.d.auth && response.d.auth === 'AUTHREQ') {
			} else if(response && response.success && response.success === 'N') {
				$('#uploadInstrumentFile #uploadErrors ul').empty();
				$.each(response.errors, function(index, item) {
					$('<li></li>').text(item.errorMessage).appendTo($('#uploadInstrumentFile #uploadErrors ul'));
				});
				$('#uploadInstrumentFile').find('#uploadErrors').show(); 
			} else {
				$('#lblSelectedFileName').html("no file selected");
				$('#uploadInstrumentFile').dialog('close');
				$(document).trigger("refreshGrid");
			}
			$('#frmMain').empty();
		}
	});
	
	/*frm.submit();*/
}
function createFormField (element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function setImportDateDropDownMenu(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'ImportDateContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "importDateLabel",
							text:getLabel('importDate', 'Import Date'),
							listeners: {
							       render: function(c) {
							    	   			var tip = Ext.create('Ext.tip.ToolTip', {
											            	    target: c.getEl(),
											            	    listeners:{
											            	    	beforeshow:function(tip){
											            	    		if(import_date_opt === null)
												            	    		tip.update('Import Date');
												            	    	else
												            	    		tip.update('Import Date' + import_date_opt);

											            	    	}
											            	    }
							        			});
							       	}	
							}
						},{
							xtype : 'button',
							border : 0,
							id : 'importDateButton',
							tabIndex :"1",
							cls : 'ui-caret-dropdown',
							listeners : {
								click:function(event){
										var menus=getDateDropDownItems("importDate",this,"importDateButton");
										var xy=event.getXY();
										menus.showAt(xy[0],xy[1]+16);
										event.menu=menus;
								}
							}
						}
					]
		});
		return dropDownContainer;
}
function getDateDropDownItems(filterType) {	
	var menu = null;
	var intFilterDays = filterDays ? parseInt(filterDays,10) : '';
	var arrMenuItem = [];

	arrMenuItem.push({
				text : getLabel('latest', 'Latest'),
				btnId : 'btnLatest',
				btnValue : '12',				
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",
								[filterType,btn, opts]);
					updateToolTip(filterType," (Latest)");
				}
			});
if (intFilterDays >= 1 || Ext.isEmpty(intFilterDays))
	arrMenuItem.push({
				text : getLabel('today', 'Today'),
				btnId : 'btnToday',
				btnValue : '1',				
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",
								[filterType,btn, opts]);
					updateToolTip(filterType," (Today)");
				}
			});
	if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
		arrMenuItem.push({
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',					
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType,btn, opts]);
						updateToolTip(filterType," (Yesterday)");
					}
				});
	if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
		arrMenuItem.push({
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',					
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType,btn, opts]);
						updateToolTip(filterType," (This Week)");
					}
				});
	if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
		arrMenuItem.push({
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',					
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType,btn, opts]);
						updateToolTip(filterType," (Last Week To Date)");
					}
				});
	if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
	{
		arrMenuItem.push({
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',					
					btnValue : '5',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType,btn, opts]);
						updateToolTip(filterType," (This Month)");
					}
				});
	}
	if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
		arrMenuItem.push({
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'btnLastmonth',
					btnValue : '6',					
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType,btn, opts]);
						updateToolTip(filterType," (Last Month To Date)");
					}
				});
	if (lastMonthOnlyFilter===true||Ext.isEmpty(intFilterDays))
	{
		arrMenuItem.push({
					text : getLabel('lastmonthonly', 'Last Month Only'),
					btnId : 'btnLastmonthonly',					
					btnValue : '14',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType,btn, opts]);
						updateToolTip(filterType," (Last Month Only)");
					}
				});
	}
	if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
		arrMenuItem.push({
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',					
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType,btn, opts]);
						updateToolTip(filterType," (This Quarter)");
					}
				});
	if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
		arrMenuItem.push({
					text : getLabel('lastQuarterToDate',
							'Last Quarter To Date'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',					
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType,btn, opts]);
						updateToolTip(filterType," (Last Quarter To Date)");
					}
				});
	if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
		arrMenuItem.push({
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',					
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType,btn, opts]);
						updateToolTip(filterType," (This Year)");
					}
				});
	if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
		arrMenuItem.push({
					text : getLabel('lastyeartodate', 'Last Year To Date'),
					btnId : 'btnYearToDate',					
					btnValue : '11',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",
								[filterType,btn, opts]);
						updateToolTip(filterType," (Last Year To Date)");
					}
				});
	/*arrMenuItem.push({
				text : getLabel('daterange', 'Date Range'),
				btnId : 'btnDateRange',				
				btnValue : '7',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",
								[btn, opts]);
				}
			});*/
	menu = Ext.create('Ext.menu.Menu', {
				items : arrMenuItem,
				cls : 'ext-dropdown-menu'
			});
	return menu;

}

function updateToolTip(filterType,date_option){
	if(filterType === 'importDate')
		import_date_opt = date_option;
}
jQuery.fn.passThruClientAutoComplete = function() {

	var strUrl = null;
	if(screenType == 'ACH'){
		strUrl = 'services/userseek/adminPassThruACHClientSeek.json';
	}
	else{
		if(entity_type == '0')
		{
			strUrl = 'services/userseek/userclients.json';
		}
		else
		strUrl = 'services/userseek/adminPassThruClientSeek.json';
	
	}
	 return this.each(function() {
                    $(this).autocomplete({
                                    source : function(request, response) {
                                                    $.ajax({
                                                            url : strUrl,
                                                            dataType : "json",
                                                            data : {
                                                                            $autofilter : request.term,
                                                                            $sellerCode : $('#sellerId').val()
                                                            },
                                                            success : function(data) {
                                                                            var rec = data.d.preferences;
                                                                            response($.map(rec, function(item) {
                                                                                        return {
                                                                                                        label : item.DESCR,
																										value : item.DESCR,
																										code  : item.CODE
																										
                                                                                        }
                                                                        }));
                                                            }
                                            });
                                    },
                                    minLength : 1,
                                    select : function(event, ui) {
                                                    log(ui.item ? "Selected: " + ui.item.label + " -show lbl:"
                                                                                    + ui.item.lbl : "Nothing selected, input was "
                                                                                    + this.value);
                                                                                    var val = ui.item.code;
													
                                                      $('#clientName').val(ui.item.label);
													  $('#clientId').val(val);
													  var seller = $('#sellerId').val();
													  var clientdesc = $('#clientName').val();
													 //showUploadPopup(uploadFile,'passThruFileACHupload.srvc',seller,val,clientdesc);
                                    },
                                    open : function() {
                                                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                                    },
                                    close : function() {
                                                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                                    }
                    });/*.data("autocomplete")._renderItem = function(ul, item) {
                                    var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:100px;" class="inline">'
                                                                    + item.label
                                                                    + '</ul><ul style="width:200px;font-size:0.8em;color:#06C;" class=inline>'
                                                                    + '</ul></ol></a>';                                                                       
                                    return $("<li></li>").data("item.autocomplete", item)
                                                                    .append(inner_html).appendTo(ul);
                    };*/
    });
};

var advFilterJsonArray = new Array();
/*advFilterJsonArray.push({
			"key" : "All",
			"value" : "All"
		});*/
advFilterJsonArray.push({
	"key" : "7",
	"value" : "Aborted"
});
advFilterJsonArray.push({
			"key" : "3",
			"value" : "Approved"
		});
advFilterJsonArray.push({
			"key" : "0",
			"value" : "Pending Approval"
});
advFilterJsonArray.push({
			"key" : "0.A",
			"value" : "Pending My Approval"
});
advFilterJsonArray.push({
	"key" : "11",
	"value" : "Processed"
});
advFilterJsonArray.push({
	"key" : "4",
	"value" : "Rejected"
});
advFilterJsonArray.push({
	"key" : "12",
	"value" : "Deleted"
});
function showAdvanceFilterPopup() {
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight: 580,
		minHeight: (screen.width) > 1024 ? 156 : 0 ,
		width : 840,
		dialogClass: 'ft-dialog',
		resizable: false,
		draggable: false,
		title : 'Advanced Filter',
		modal : true,
		/*buttons : [{
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
		
	/*	open : function() {
			$(document).trigger("resetAllFieldsEvent");
			hideErrorPanel('#advancedFilterErrorDiv');
			$('#advancedFilterPopup').dialog('option','position','center');
			if (!advancedFilterFieldsDataAdded) {
			//	$("#tabs").tabs({
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
						$('#advancedFilterPopup').dialog('option','position','center');
					},
					show : function(e, ui) {
						if ('undefined' != filterGrid && !isEmpty(filterGrid))
							filterGrid.getView().refresh();
						$('#advancedFilterPopup').dialog('option','position','center');
					}
			//	});
				//$("#tabs").barTabs();
				setStatusDropDownItems("#uploadStatus");
				//filterGrid = createFilterGrid();
				//changeAdvancedFilterTab(1);
				advancedFilterFieldsDataAdded = true;
			}
		}*/
		 open:function(){
      	  hideErrorPanel('#advancedFilterErrorDiv');
      	  $('#advancedFilterPopup').dialog('option', 'position', 'center');
      	  setCompanyMenuItems('clientSelect');
	      },
		  focus :function(){
				/* if(!isEmpty(selectedClient))
					$("#msClient").val(selectedClient); */
		  },
		  close : function(){
		  }
		
	});
	$('#advancedFilterPopup').dialog("open");
}

function populateAdvancedFilterFieldValue(){
		$(document).trigger("resetAllFieldsEvent");
		hideErrorPanel('#advancedFilterErrorDiv');
		setStatusDropDownItems("#uploadStatus");
		setImportDateDropDownMenu('importDateDropDown');
		setSavedFilterComboItems('#msSavedFilter');
		setClientMenuItems("#clientName");	
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
	var el = $(elementId).multiselect();
	el.attr('multiple',true);
	$(elementId).multiselect("checkAll");
}
function setSavedFilterComboItems(element){
		var strUrl;
		if(screenType == 'ACH')
			strUrl = 'services/userfilterslist/passThruFileACH.json';
		else
			strUrl = 'services/userfilterslist/passThruPositivePay.json';
	$.ajax({
		
		url : strUrl,
		success : function(responseText) {
			if(responseText && responseText.d && responseText.d.filters){
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

	var clientCodesData =$("select[id='clientSelect']").getMultiSelectValueString(); 	
	if(Ext.isEmpty(clientCodesData)){
		clientCodesData=advFilterSelectedClients;
	}
	var tempClientCodesData=clientCodesData;
	if (!Ext.isEmpty(tempClientCodesData)) {
		if(!Ext.isEmpty(filterClientDataCount))
		{
			var clientCodesArray=clientCodesData.split(',');
				if( clientCodesArray.length > 0 )
					{
 						tempClientCodesData = '';
 						for( var x = 0; x < clientCodesArray.length; x++)
						{
							tempClientCodesData = tempClientCodesData  + clientCodesArray[x];
							
							// following x + 1 condifiotn for adding comma till second last element.
							 if( clientCodesArray.length > x + 1 )
							{
								tempClientCodesData = tempClientCodesData + ',';
							} 
						} 
					}
					//tempClientCodesData=clientCodesArray;
			
		}
		var clientValueDesc = [];
		$('#clientSelect :selected').each(function(i, selected){
			clientValueDesc[i] = $(selected).text();
		});
	    if(tempClientCodesData!='all'){
			jsonArray.push({
						field : 'clientId',
						operator : 'in',
						value1 : tempClientCodesData,
						value2 : '',
						dataType : 0,
						displayType : 11,
						detailFilter : 'Y',
						fieldLabel : getLabel('lblClient','Client'),
						displayValue1 : clientValueDesc.toString()
					});
			}
	}
	
	// File Name
	//var fileNameVal = $("input[type='text'][id='FileName']").val();
	var fileNameVal = decodeURI($("input[type='text'][id='FileName']").val());
	
	if (!Ext.isEmpty(fileNameVal)) {
		jsonArray.push({
					field : 'FileName',
					operator : 'lk',
					value1 : encodeURIComponent(fileNameVal.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 0,
					fieldLabel : getLabel('fileName', 'File Name'),
					displayValue1 : fileNameVal
					
				});
	}
	
	var blnAutoNumeric = true;
	//Total Cr Amount
	var totalCrAmount = $("input[type='text'][id='totalCrAmount']").val();
	// jquery autoNumeric formatting
	blnAutoNumeric = isAutoNumericApplied("totalCrAmount");
	if (blnAutoNumeric)
		totalCrAmount = $("#totalCrAmount").autoNumeric('get');
	else
		totalCrAmount = $("#totalCrAmount").val();
	// jquery autoNumeric formatting
	if (!Ext.isEmpty(totalCrAmount)) {
		jsonArray.push({
					field : 'totalCrAmount',
					operator : 'eq',
					value1 : encodeURIComponent(totalCrAmount.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 0,
					fieldLabel :  getLabel('totalCrAmount', 'Total Credit Amount'),
					displayValue1 : totalCrAmount
				});
	}
	
	//Total Cr Count
	var totalCrCount = $("input[type='text'][id='totalCrCount']").val();
	if (!Ext.isEmpty(totalCrCount)) {
		jsonArray.push({
					field : 'totalCrCount',
					operator : 'eq',
					value1 : encodeURIComponent(totalCrCount.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 0,
					fieldLabel : getLabel('totalCrCount', 'Total Credit Count'),
					displayValue1 : totalCrCount
				});
	}
	if(screenType == 'ACH')
	{
		var blnAutoNumeric = true;
		//Total Dr Amount
		var totalDrAmount = $("input[type='text'][id='totalDrAmount']").val();
		// jquery autoNumeric formatting
		blnAutoNumeric = isAutoNumericApplied("totalDrAmount");
		if (blnAutoNumeric)
			totalDrAmount = $("#totalDrAmount").autoNumeric('get');
		else
			totalDrAmount = $("#totalDrAmount").val();
		// jquery autoNumeric formatting
		if (!Ext.isEmpty(totalDrAmount)) {
			jsonArray.push({
						field : 'totalDrAmt',
						operator : 'eq',
						value1 : totalDrAmount,
						value2 : '',
						dataType : 0,
						displayType : 0,
						fieldLabel : getLabel('totalDrAmount', 'Total Debit Amount'),
						displayValue1 : totalDrAmount
					});
		}
		
		//Total Dr Count
		var totalDrCount = $("input[type='text'][id='totalDrCount']").val();
		if (!Ext.isEmpty(totalDrCount)) {
			jsonArray.push({
						field : 'totalDrCount',
						operator : 'eq',
						value1 : encodeURIComponent(totalDrCount.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 0,
						fieldLabel : getLabel('totalDrCount', 'Total Debit Count'),
						displayValue1 : totalDrCount
					});
		}
		
		//No.of Company
		var noOfCompany = $("input[type='text'][id='noOfCompany']").val();
		if (!Ext.isEmpty(noOfCompany)) {
			jsonArray.push({
						field : 'noOfCompany',
						operator : 'eq',
						value1 : encodeURIComponent(noOfCompany.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 0,
						fieldLabel : getLabel('noOfCompany', 'No. of Company'),
						displayValue1 : noOfCompany
					});
		}
	}
	// Import Date
	if (!jQuery.isEmptyObject(selectedImportDateInAdvFilter)) {
		jsonArray.push({
					field : 'importDateTime',
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
					dropdownLabel : selectedImportDateInAdvFilter.dateLabel,
					displayValue1 : Ext.util.Format.date(
							selectedImportDateInAdvFilter.fromDate, 'Y-m-d')
				});
	}

	// Status
	
	var statusFilter = $("#uploadStatus").getMultiSelectValue();
	var statusValueDesc = [];
	$('#uploadStatus :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});
	
	var statusValueString=statusFilter.join("and");
	var tempStatusValue;
	if (!Ext.isEmpty(statusValueString)) {
		var statusValueArray=statusValueString.split("and");
		var statusArray = advFilterJsonArray;
		tempStatusValue=statusValueArray;
		tempStatusValue=statusValueArray.join(',');
		if(statusArray.length==statusValueArray.length){
				tempStatusValue='All';
		}	
		if(tempStatusValue != "All")
		jsonArray.push({
					field : 'uploadStatus',
					operator : 'in',
						value1 : tempStatusValue,
						value2 : '',
					dataType : 0,
						displayType :11,// 6,
						fieldLabel : getLabel('lblstatus','Status'),
						displayValue1 : statusValueDesc.toString()
						
				});
	}
	
	objJson = jsonArray;
	return objJson;
}
function getAdvancedFilterValueJson(FilterCodeVal) {
	var jsonArray = [];

	//Client
	var clientCodesData =$("select[id='clientSelect']").getMultiSelectValueString(); 	
	if (!Ext.isEmpty(clientCodesData)) {		
		jsonArray.push({
					field : 'clientId',
					operator : 'in',
					value1 : clientCodesData,
					value2 : '',
					dataType : 0,
					displayType : 6
				});
		
	}
	// File Name
	//var fileNameVal = $("input[type='text'][id='FileName']").val();
	  var fileNameVal = decodeURI($("input[type='text'][id='FileName']").val());
	if (!Ext.isEmpty(fileNameVal)) {
		jsonArray.push({
					field : 'FileName',
					operator : 'lk',
					value1 : encodeURIComponent(fileNameVal.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 4,
					fieldLabel : getLabel('fileName', 'File Name'),
					displayValue1 : fileNameVal
				});
	}

	//Total Cr Amount
	var totalCrAmount = $("input[type='text'][id='totalCrAmount']").val();
	if (!Ext.isEmpty(totalCrAmount)) {
		jsonArray.push({
					field : 'totalCrAmount',
					operator : 'eq',
					value1 : totalCrAmount,
					value2 : '',
					dataType : 0,
					displayType : 4,
					fieldLabel : getLabel('totalCrAmount', 'Total Credit Amount'),
					displayValue1 : totalCrAmount
				});
	}
	
	//Total Cr Count
	var totalCrCount = $("input[type='text'][id='totalCrCount']").val();
	if (!Ext.isEmpty(totalCrCount)) {
		jsonArray.push({
					field : 'totalCrCount',
					operator : 'eq',
					value1 : encodeURIComponent(totalCrCount.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 4,
					fieldLabel : getLabel('totalCrCount', 'Total Credit Count'),
					displayValue1 : totalCrCount
				});
	}

	
	// Import Date
	if (!jQuery.isEmptyObject(selectedImportDateInAdvFilter)) {
		jsonArray.push({
					field : 'importDateTime',
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
					displayType : 5,
					fieldLabel : getLabel('importDate', 'Import Date'),
					dropdownLabel : selectedImportDateInAdvFilter.dateLabel,
					displayValue1 : Ext.util.Format.date(
							selectedImportDateInAdvFilter.fromDate, 'Y-m-d')
				});
	}
		
	// Status
	var statusAdvFilterCombo =$("#uploadStatus").getMultiSelectValue();
	var statusFilter = $("#uploadStatus").getMultiSelectValue();
	var statusValueDesc = [];
	$('#uploadStatus :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});
	var statusValueString=statusFilter.join("and");
	var tempStatusValue;
	if (!Ext.isEmpty(statusValueString)) {
		 var statusValueArray=statusValueString.split("and");
		 var statusArray = advFilterJsonArray;
		 tempStatusValue=statusValueArray;
		 tempStatusValue=statusValueArray.join(',');
		 	if(statusArray.length==statusValueArray.length){
		 		statusAdvFilterCombo='All';
		 		tempStatusValue='All';
			}
	}
	if (!Ext.isEmpty(statusAdvFilterCombo) && statusAdvFilterCombo !== "All") {
		jsonArray.push({
					field : 'uploadStatus',
					operator : 'in',
					value1 : tempStatusValue,
					dataType : 0,
					displayType : 11,
					fieldLabel : getLabel( 'status', 'Status' ),
					displayValue1 : statusValueDesc.toString()
				});
	}
	if(screenType == 'ACH')
	{
		//Total Dr Amount
		var totalDrAmount = $("input[type='text'][id='totalDrAmount']").val();
		if (!Ext.isEmpty(totalDrAmount)) {
			jsonArray.push({
						field : 'totalDrAmt',
						operator : 'eq',
						value1 : totalDrAmount,
						value2 : '',
						dataType : 0,
						displayType : 4,
						fieldLabel : getLabel('totalDrAmount', 'Total Debit Amount'),
						displayValue1 : totalDrAmount
					});
		}
		
		//Total Dr Count
		var totalDrCount = $("input[type='text'][id='totalDrCount']").val();
		if (!Ext.isEmpty(totalDrCount)) {
			jsonArray.push({
						field : 'totalDrCount',
						operator : 'eq',
						value1 : encodeURIComponent(totalDrCount.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 4,
						fieldLabel :getLabel('totalDrCount', 'Total Debit Count'),
						displayValue1 : totalDrCount
					});
		}
	
		//No.of Company
		var noOfCompany = $("input[type='text'][id='noOfCompany']").val();
		if (!Ext.isEmpty(noOfCompany)) {
			jsonArray.push({
						field : 'noOfCompany',
						operator : 'eq',
						value1 : noOfCompany,
						value2 : '',
						dataType : 0,
						displayType : 4,
						fieldLabel : getLabel('noOfCompany', 'No. of Company'),
						displayValue1 : noOfCompany
					});
		}
	}
	
	objJson = {};
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
		objJson.filterCode = FilterCodeVal;
	return objJson;
}
function showErrorReportPopUp(record,strUrl) {
	$('#errorReportPopUp').dialog({
				autoOpen : false,
				maxHeight : 550,
				width : 710,
				modal : true,
				buttons : [{
							id : 'advFilterCancel',
							text : getLabel('btnOk', 'OK'),
							click : function() {
								$(this).dialog("close");
							}
						}],
				open : function() {
					populateErrorPopUp(record);
					var ahtskid = record.get("ahtskid");
					filterGrid = createErrorGrid(ahtskid,strUrl);
				}
			});
	$('#errorReportPopUp').dialog("open");
}
function populateErrorPopUp(record) {
	$('#errorFileName').val(record.get("fileName"));
	$('#totalCrTransaction').val(record.get("totalCrCount"));
	$('#errorImportDate').val(record.get("uploadDate"));
	$('#errorStatus').val(record.get("status"));
	$('#totalCrAmountInError').val(record.get("totalCrAmt"));
	$('#totalDrTransaction').val(record.get("totalDrCount"));
	$('#totalBatch').val(record.get("batchCount"));
	$('#totalDrAmountInError').val(record.get("totalDrAmt"));
}
function createErrorGrid(fileId,strUrl) {
	var arrayData = errorGridStore(fileId,strUrl);
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
function errorGridStore(fileId,strUrl) {
	var strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
	var errorData = new Array();
	var arrayData = new Array();
	Ext.Ajax.request({
				url : strUrl,
				method : 'POST',
				jsonData : fileId,
				async : false,
				success : function(response) {
					var data = Ext.decode(response.responseText);
					var count = data.d.passThruFileACH.length ;
					var errorCode;
					arrayData = new Ext.data.ArrayStore({
								fields : ['srNO', 'error']
							});
					for (var i = 0; i < count; i++) {
						errorCode = data.d.passThruFileACH[i].errorCode;
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
function closeUploadInstrumentFilePopup()
{	
	var filename = $('#file').val();
	if(filename) {
		$('#lblSelectedFileName').html("no file selected");
	}
	$('#uploadInstrumentFile').dialog('close');	
}

function newfileselected () {
	var filename = $('#file').val();
	if(filename) {
		$('#lblSelectedFileName').html(filename.substring(filename.lastIndexOf('\\')+1));
	} else {
		$('#lblSelectedFileName').html(labels.lblNoFileSelected);
	}
	$("#lblSelectedFileName").addClass("wrap-word");
}

function chooseFileClicked() {
	$('#file').click();
}

function isAutoNumericApplied(strId) {
	var isAutoNumericApplied = false;
	$.each(($('#'+strId).data('events')||[]), function(i, event) {
				if (isAutoNumericApplied === true)
					return false;
				$.each(event, function(i, eventHandler) {
							if (eventHandler.namespace === 'autoNumeric')
								isAutoNumericApplied = true;
							return false;
						});
			});
	return isAutoNumericApplied;
}
function setCompanyMenuItems(elementId){
	var me = this;
	var filterCorp = strClientId;
	if(onBehalf)
	{ 
		if( me.clientFilterVal == 'all' || me.clientFilterVal == '' || me.clientFilterVal == undefined)
		{
			resetClient();
		}
		else
		{
			switchClient(selectedFilterClient);
		}
		if (selectedFilterClient != null)
			filterCorp = selectedFilterClient
		else
			filterCorp = "";
	}
	var strUrl = null;
			strUrl = 'services/userseek/posPayPassThruClient.json';
	
	$.ajax({
		url : strUrl,
		type : 'POST',
		data:{$top:-1,
			$filtercode1:filterCorp
			},
		success:function(responseData){
			if(!isEmpty(responseData)){
				var data = responseData.d.preferences;
				resetAllMenuItemsInMultiSelect(elementId);
				addDataInClientMultiSelect(elementId,data);
				filterClientDataCount=data.length;
				
			}
		}
	});
}
function addDataInClientMultiSelect(elementId,data)
{
	$('#'+elementId).empty();
	var defaultOpt = $('<option />', {
		value : "All",
		text : getLabel('allCompanies', 'All Companies')
		});
	
	defaultOpt.appendTo('#'+elementId);
	$.each(data,function(index,item){
		$('#'+elementId).append($('<option>', { 
			value: data[index].CODE,
			text : data[index].DESCR
			}));
	});
}
function resetAllMenuItemsInMultiSelect(elementId)
{
	$("#"+elementId).empty();
	$(elementId+' option').prop('selected', true);
	$(elementId).multiselect("refresh");
}