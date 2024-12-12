var FORECAST_GENERIC_COLUMN_MODEL = [{
			"colId" : "glId",
			"colHeader" : getLabel('accountNumber','Account Number'),
			"colSequence" : 1,
			"hidden" : false,
			"width" : 150
		},{
			"colId" : "forecastDate",
			"colType" : "date",
			"colHeader" : getLabel('forecastDate','Effective Date'),
			"colSequence" : 2,
			"hidden" : false
		}, {
			"colId" : "productDesc",
			"colHeader" : getLabel('forecastMyproduct','Package'),
			"colSequence" : 3,
			"hidden" : false
		},{
			"colId" : "transactionType",
			"colHeader" : getLabel('transactionType','Transaction Type'),
			"colSequence" : 4,
			"hidden" : false
		},{
			"colId" : "transactionAmount",
			"colHeader" : getLabel('transactionAmount','Transaction Amount'),
			"colSequence" : 5,
			"colType" : "amount",
			"hidden" : true
		},{
			"colId" : "forecastAmount",
			"colType" : "amount",
			"colHeader" : getLabel('forecastAmount','Forecast Amount'),
			"colSequence" : 6,
			"hidden" : false
		}, {
			"colId" : "forecastReference",
			"colHeader" : getLabel('forecastReference','Reference'),
			"colSequence" : 7,
			"hidden" : false
		}, {
			"colId" : "requestStateDesc",
			"colHeader" : getLabel('status','Status'),
			"colSequence" : 8,
			"hidden" : false
		}, {
			"colId" : "rejectRemarks",
			"colHeader" : getLabel('remarks','Reject Remarks'),
			"colSequence" : 9,
			"hidden" : false
		},
		{
			"colId" : "clientDesc",//changed
			"colHeader" : getLabel('companyName','Company Name'),
			"colSequence" : 10,
			"hidden" : true
		},{
			"colId" : "forecastType",
			"colType" : "date",
			"colHeader" : getLabel('forecastType','Forecast Type'),
			"colSequence" : 11,
			"hidden" : true
		}, {
			"colId" : "forecastExpectation",
			"colHeader" : getLabel('expectation','Expectation(%)'),
			"colSequence" : 12,
			"hidden" : true
		},{
			"colId" : "settledAmount",
			"colHeader" : getLabel('settledAmt','Settled Amount'),
			"colSequence" : 13,
			"colType" : "amount",
			"hidden" : true
		},{
			"colId" : "isRepetitive",
			"colHeader" : getLabel('recurring','Recurring'),
			"colSequence" : 14,
			"hidden" : true
		}, {
			"colId" : "startDate",
			"colHeader" : getLabel('startDate','Start Date'),
			"colType" : "date",
			"colSequence" : 15,
			"hidden" : true
		}, {
			"colId" : "endDate",
			"colHeader" : getLabel('endDate','End Date'),
			"colType" : "date",
			"colSequence" : 16,
			"hidden" : true
		},{
			"colId" : "frequencyCode",
			"colHeader" : getLabel('frequency','Frequency'),
			"colSequence" : 17,
			"hidden" : true
		},{
			"colId" : "forecastPeriod",
			"colHeader" : getLabel('period','Period'),
			"colSequence" : 18,
			"hidden" : true
		}, {
			"colId" : "forecastReferenceDay",
			"colHeader" : getLabel('ref','Reference Day'),
			"colSequence" : 19,
			"hidden" : true
		}
		];

var arrStatus = [	  {
                 		"code": "0",
                 		"desc": "Draft"
                 	  },
					  {
                 		"code": "1",
                 		"desc": "Pending Submit"
                 	  },
					  {
                 		"code": "2",
                 		"desc": "Pending Approval"
                 	  },
					  {
                 		"code": "3",
                 		"desc": "Submitted"
                      },
                 	  {
                 		"code": "4",
                 		"desc": "Approved"
                 	  }
                ];

var arrSortByForecastFields = [{
	"colId" : "accountId",
	"colDesc" : "Account Number"
},{
	"colId" : "forecastDate",
	"colDesc" : "Effective Date"
}, {
	"colId" : "forecastMyproduct",
	"colDesc" : "Package"
},{
	"colId" : "transactionType",
	"colDesc" : "Type of Transaction"
},{
	"colId" : "forecastAmount",
	"colDesc" : "Forecast Amount"
}, {
	"colId" : "forecastReference",
	"colDesc" : "Reference"
}, {
	"colId" : "requestStateDesc",
	"colDesc" : "Status"
}, {
	"colId" : "rejectRemarks",
	"colDesc" : "Reject Remarks"
},

{
	"colId" : "companyName",
	"colDesc" : "Company Name"
},{
	"colId" : "forecastType",
	"colDesc" : "Forecast Type"
}, {
	"colId" : "expectation",
	"colDesc" : "Expectation"
},{
	"colId" : "settledAmt",
	"colDesc" : "Settled Amount"
},{
	"colId" : "recurring",
	"colDesc" : "Recurring"
},{
	"colId" : "frequency",
	"colDesc" : "Frequency"
},{
	"colId" : "period",
	"colDesc" : "Period"
},  {
	"colId" : "ref",
	"colDesc" : "Reference Day"
}]; 

function getDateDropDownItems(filterType,buttonIns){
	var me = this;
	var intFilterDays = !Ext.isEmpty(filterDays)
		? parseInt(filterDays,10)
		: '';
		
		var arrMenuItem = [];

		if (intFilterDays >= 1 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
				text : getLabel('today', 'Today'),
				btnId : 'btnToday',
				btnValue : '1',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (Today)");
				}
			});
		
		if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
				text : getLabel('yesterday', 'Yesterday'),
				btnId : 'btnYesterday',
				btnValue : '2',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (Yesterday)");
				}
			});
		
		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Week)");
					}
				});
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Week To Date)");
					}
				});
		if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
				text : getLabel('thismonth', 'This Month'),
				btnId : 'btnThismonth',
				btnValue : '5',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (This Month)");
				}
			});
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate',
								'Last Month to date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : me,
						handler : function(btn, opts) {
							//me.fireEvent('dateChange', btn, opts);
							$(document).trigger("filterDateChange",[filterType,btn,opts]);
							updateToolTip(filterType," (Last Month to date)");
						}
					});
		 if (Ext.isEmpty(intFilterDays))
		   arrMenuItem.push({
				text : getLabel('lastmonthonly', 'Last Month Only'),
				btnId : 'btnLastmonthonly',
				btnValue : '14',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (Last Month Only)");
				}
			});
		if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
				text : getLabel('thisquarter', 'This Quarter'),
				btnId : 'btnLastMonthToDate',
				btnValue : '8',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
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
							$(document).trigger("filterDateChange",[filterType,btn,opts]);
							updateToolTip(filterType," (Last Quarter To Date)");
						}
			});
		if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
				text : getLabel('thisyear', 'This Year'),
				btnId : 'btnLastQuarterToDate',
				btnValue : '10',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (This Year)");
				}
			});
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
				text : getLabel('lastyeartodate', 'Last Year To Date'),
				btnId : 'btnYearToDate',
				btnValue : '11',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (Last Year To Date)");
				}
			});
		
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
			itemId : 'DateMenu',
			cls : 'ext-dropdown-menu',
			items : arrMenuItem
		});

	return dropdownMenu;
}

function getAdvancedFilterPopup(strUrl, frmId) {
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
	open:function(){
      	  hideErrorPanel('#advancedFilterErrorDiv');
      	  $('#advancedFilterPopup').dialog('option', 'position', 'center');
		  
      },
	  focus :function(){
			
	  },
	  close : function(){
	  }
	});
	$('#advancedFilterPopup').dialog("open");

}
function setDateDropDownMenu(renderToElementId){
$('#'+renderToElementId).empty();
	var dropDownContainer=Ext.create('Ext.Container', {
		itemId : 'lbl'+renderToElementId,
		renderTo:renderToElementId,
		items : [{
			xtype : 'label',
			forId : renderToElementId+"Label",
			text : getLabel(renderToElementId, renderToElementId),
			listeners: {
		    	render: function(c) {
		    	var tip = Ext.create('Ext.tip.ToolTip', {
		    			target: c.getEl(),
		    			listeners: {
		    				beforeshow: function(tip) {
								if(renderToElementId === 'effectiveDateDropDown')
								{
									if(effective_date_opt === null) {
										tip.update('Effective Date');
									} else {
										tip.update('Effective Date' + effecive_date_opt);
									}
								}
								
		    				}
		    			}
		    		});
				}
			}
		}, {
			xtype : 'button',
			border : 0,
			itemId : 'effectiveDateButton',
			cls : 'ui-caret-dropdown',
			listeners : {
				click: function(event) {
					var menus = '';
					if(renderToElementId === 'effectiveDateDropDown')
						menus = getDateDropDownItems("effectiveDate", this);
					var xy=event.getXY();
					menus.showAt(xy[0],xy[1]+16);
					event.menu=menus;
				}
			}
		}]
	});
	return dropDownContainer;
}

function toggleMoreLessText(me)
{
	$(".moreCriteria").toggleClass("hidden");
	$("#moreLessCriteriaCaret").toggleClass("fa-caret-up fa-caret-down");
	var textContainer = $(me).children("#moreLessCriteriaText");
	var labelText = textContainer.text().trim();
	if(labelText === getLabel("lesscriterial", "Less Criteria")) 
	{
		textContainer.text(getLabel("morecriterial","More Criteria"));
		
	}
	else if(labelText === getLabel("morecriterial","More Criteria")) 
	{
		textContainer.text(getLabel("lesscriterial","Less Criteria"));
		
	}
}

function setPackageItems(sectionDiv){
		var packageURL ="";
		 packageURL =  'services/userseek/forecastPackageSeek.json?$top=-1&sellerCode='+ strSeller +'&$filtercode1='+selectedClient;
		if(strEntityType === "1" && selectedClient ==="")
			packageURL = 'services/userseek/forecastPackageSeek.json?$top=-1&sellerCode='+ strSeller +'&$filtercode1='+strClient;
		
	$.ajax({
		url : packageURL,
		async : false,
		method:"GET",
		success:function(responseData){
			if(!isEmpty(responseData)&&!isEmpty(responseData.d)){
				$("#dropdownPackage option").remove();
				var data = responseData.d.preferences;
				var el = $("#"+sectionDiv).multiselect();
				el.attr('multiple',true);
				for(index=0;index<data.length;index++){
					var opt = $('<option />', {
						value: data[index].CODE,
						text: data[index].DESCR
					});
					opt.attr('selected','selected');
					opt.appendTo( el );
				}
				el.multiselect('refresh');
				filterPackageCount=data.length;	
			}
		}
	});
}

function toggleAscendingDescendingText(me){
	var labelText=$(me).text().trim();
	if(labelText==getLabel("ascending", "Ascending")){
		$(me).text(getLabel("descending","Descending"));
	}else if(labelText==getLabel("descending","Descending")){
		$(me).text(getLabel("ascending", "Ascending"));
	}
}

function updateToolTip(filterType,date_option){
	if(filterType === 'effectiveDate')
		effecive_date_opt = date_option;
	
}
function populateAdvancedFilterFieldValue(){
		$(document).trigger("resetAllFieldsEvent");
		$("#dropdownCompany  option").remove();
		$("#dropdownStatus  option").remove();
		$("#dropdownAccountNo option").remove();
		$("#dropdownPackage option").remove();
		$("#dropdownForecastType  option").remove();
		setCompanyMenuItems("#dropdownCompany");
		setStatusMenuItems("dropdownStatus");
		setAccountNumberItems("#dropdownAccountNo");
		setDateDropDownMenu('effectiveDateDropDown');
		setForecastTypeMenuItems("#dropdownForecastType");
		  setPackageItems("dropdownPackage");
		  $("#amountOperator").niceSelect();
		  $("#tranAmountOperator").niceSelect();
		  $('#txtAmount, #amountFieldTo').ForceNumericOnly();
		  $('#tranTxtAmount, #tranAmountFieldTo').ForceNumericOnly();
		 
		setSavedFilterComboItems('#msSavedFilter');
		$("#dropdownForecastType").niceSelect();
		setSortByMenuItems("#dropdownSortBy1",arrSortByForecastFields);
		$("#dropdownSortBy2").append($('<option />', {
			value : "None",
			text : "None"
			}));
		$("#dropdownSortBy3").append($('<option />', {
			value : "None",
			text : "None"
			}));
		$('#dropdownSortBy2').attr('disabled',true);
		$('#dropdownSortBy3').attr('disabled',true);
} 

function setSortByMenuItems(elementId,columnsArray){
	var defaultOpt = $('<option />', {
		value : "None",
		text : "None"
		});	
	defaultOpt.appendTo(elementId);
	for (var index = 0; index < columnsArray.length; index++) {
		 var opt=$('<option />', {
		value : columnsArray[index].colId,
		text :columnsArray[index].colDesc
		});	
		opt.appendTo(elementId);
	}
	$("#dropdownSortBy1").niceSelect();
}

function sortBy1ComboSelected(columnId){
	var filteredRecords = [];
	var sortByColumns=arrSortByForecastFields;
	if(!Ext.isEmpty(columnId) && columnId != undefined)
		var selectedColumnId=columnId;
	else
		var selectedColumnId=$('#dropdownSortBy1').val();
	selectedColumnId = (selectedColumnId === 'glId')? 'accountId': (selectedColumnId === 'productDesc')? 'forecastMyproduct' : selectedColumnId;
	if(selectedColumnId!='None'){
		for (var index = 0; index < sortByColumns.length; index++) {
			if(selectedColumnId!==sortByColumns[index].colId){
				filteredRecords.push({
					colId:sortByColumns[index].colId,
					colDesc:sortByColumns[index].colDesc
				});
			}
		}
		$('#dropdownSortBy2 option').remove();
		setSortByMenuItems("#dropdownSortBy2",filteredRecords);
		$('#dropdownSortBy2').attr('disabled',false);
		$('#dropdownSortBy3 option').remove();
		setSortByMenuItems("#dropdownSortBy3",filteredRecords);
		$('#dropdownSortBy3').attr('disabled',true);
		$('#dropdownSortBy2').niceSelect();
		$('#dropdownSortBy2').niceSelect("update");
	}else{	
		$('#dropdownSortBy1 option').remove();
		setSortByMenuItems("#dropdownSortBy1",sortByColumns);
		$('#dropdownSortBy2').val("").attr('disabled',true);
		$('#dropdownSortBy3').val("").attr('disabled',true);
		$('#dropdownSortBy2').niceSelect("destroy");
		$('#dropdownSortBy3').niceSelect("destroy");
	}
} 

function sortBy2ComboSelected(columnId){
	var filteredRecords = [];
	var filteredRecordsSortBy1 = [];
	var sortByColumns=arrSortByForecastFields;
	var selectedColumnIdFromSort1Combo=$('#dropdownSortBy1').val();
	if(!Ext.isEmpty(columnId) && columnId != undefined)
		var selectedColumnId=columnId;
	else
		var selectedColumnId=$('#dropdownSortBy2').val();
	selectedColumnId = (selectedColumnId === 'glId')? 'accountId': (selectedColumnId === 'productDesc')? 'forecastMyproduct' : selectedColumnId;
	if(selectedColumnId!='None'){
		for (var index = 0; index < sortByColumns.length; index++) {
			if(selectedColumnId!==sortByColumns[index].colId&&selectedColumnIdFromSort1Combo!==sortByColumns[index].colId){
				filteredRecords.push({
					colId:sortByColumns[index].colId,
					colDesc:sortByColumns[index].colDesc
				});
			}
			if(selectedColumnId!==sortByColumns[index].colId){
				filteredRecordsSortBy1.push({
					colId:sortByColumns[index].colId,
					colDesc:sortByColumns[index].colDesc
				});
			}
		}		
		$('#dropdownSortBy1 option').remove();
		setSortByMenuItems("#dropdownSortBy1",filteredRecordsSortBy1);
		$('#dropdownSortBy1').val(selectedColumnIdFromSort1Combo);
		$('#dropdownSortBy3 option').remove();
		setSortByMenuItems("#dropdownSortBy3",filteredRecords);
		$('#dropdownSortBy2').val(selectedColumnId);
		$('#dropdownSortBy3').attr('disabled',false);
		$('#dropdownSortBy3').niceSelect();
		$('#dropdownSortBy3').niceSelect("update");
	}else{	
		$('#dropdownSortBy1 option').remove();
		setSortByMenuItems("#dropdownSortBy1",sortByColumns);
		$('#dropdownSortBy1').val(selectedColumnIdFromSort1Combo);
		$('#dropdownSortBy3').val("");
		$('#dropdownSortBy3').attr('disabled',true);
		$("#dropdownSortBy3").niceSelect("destroy");
	}
}

function sortBy3ComboSelected(columnId){
	var filteredRecordsSortBy1 = [];
	var filteredRecordsSortBy2 = [];
	var filteredRecordsSortBy1With3None = [];
	var filteredRecordsSortBy2With3None = [];
	var sortByColumns=arrSortByForecastFields;
	var selectedColumnIdFromSort1Combo=$('#dropdownSortBy1').val();
	var selectedColumnIdFromSort2Combo=$('#dropdownSortBy2').val();
	if(!Ext.isEmpty(columnId) && columnId != undefined)
		var selectedColumnId=columnId;
	else
		var selectedColumnId=$('#dropdownSortBy2').val();
	if(selectedColumnId!='None'){
		for (var index = 0; index < sortByColumns.length; index++) {
			if(selectedColumnIdFromSort1Combo!==sortByColumns[index].colId){ //selectedColumnId!==sortByColumns[index].colId&&
				filteredRecordsSortBy2.push({
					colId:sortByColumns[index].colId,
					colDesc:sortByColumns[index].colDesc
				});
			}
			if(selectedColumnId!==sortByColumns[index].colId&&selectedColumnIdFromSort2Combo!==sortByColumns[index].colId){
				filteredRecordsSortBy1.push({
					colId:sortByColumns[index].colId,
					colDesc:sortByColumns[index].colDesc
				});
			}	
			if(selectedColumnIdFromSort2Combo!==sortByColumns[index].colId){
				filteredRecordsSortBy1With3None.push({
					colId:sortByColumns[index].colId,
					colDesc:sortByColumns[index].colDesc
				});
			}
			if(selectedColumnIdFromSort1Combo!==sortByColumns[index].colId){
				filteredRecordsSortBy2With3None.push({
					colId:sortByColumns[index].colId,
					colDesc:sortByColumns[index].colDesc
				});
			}			
		}
		$('#dropdownSortBy1 option').remove();
		setSortByMenuItems("#dropdownSortBy1",filteredRecordsSortBy1);
		$('#dropdownSortBy1').val(selectedColumnIdFromSort1Combo);
		$('#dropdownSortBy2 option').remove();
		setSortByMenuItems("#dropdownSortBy2",filteredRecordsSortBy2);
		$('#dropdownSortBy2').val(selectedColumnIdFromSort2Combo);
		$('#dropdownSortBy2').niceSelect("update");
	}else{	
		for (var index = 0; index < sortByColumns.length; index++) {		
			if(selectedColumnIdFromSort2Combo!==sortByColumns[index].colId){
				filteredRecordsSortBy1With3None.push({
					colId:sortByColumns[index].colId,
					colDesc:sortByColumns[index].colDesc
				});
			}
			if(selectedColumnIdFromSort1Combo!==sortByColumns[index].colId){
				filteredRecordsSortBy2With3None.push({
					colId:sortByColumns[index].colId,
					colDesc:sortByColumns[index].colDesc
				});
			}
		}
		$('#dropdownSortBy1 option').remove();
		setSortByMenuItems("#dropdownSortBy1",filteredRecordsSortBy1With3None);
		$('#dropdownSortBy1').val(selectedColumnIdFromSort1Combo);
		$('#dropdownSortBy2 option').remove();		
		setSortByMenuItems("#dropdownSortBy2",filteredRecordsSortBy2With3None);
		$('#dropdownSortBy2').val(selectedColumnIdFromSort2Combo);
	}
}

function getSortByAscendingDescendingText(elementId){
	var labelText=$(elementId).text().trim();
	if(labelText==getLabel("ascending", "Ascending")){
		return 'asc';
	}else if(labelText==getLabel("descending","Descending")){
		return 'desc';
	}
}

function getAdvancedFilterSortByJson(){
	var objJson = null;
	var jsonArray = [];

	// Sort By
	var sortByCombo = $("select[id='dropdownSortBy1']").val();
	var sortByOption = getSortByAscendingDescendingText('#sortBy1AscDescLabel');
	if (!Ext.isEmpty(sortByCombo) && sortByCombo !== "None") {
		if(sortByCombo == "accountId")
			sortByCombo = "glId";
		if(sortByCombo == "forecastMyproduct")
			sortByCombo = "productDesc";
		jsonArray.push({
					field : 'SortBy',
					operator : 'st',
					value1 : sortByCombo,
					value2 : sortByOption,
					dataType : 0,
					displayType : 6
				});
	}

	// First Then Sort By
	var firstThenSortByCombo = $("select[id='dropdownSortBy2']").val();
	var firstThenSortByOption = getSortByAscendingDescendingText('#sortBy2AscDescLabel');
	if (!Ext.isEmpty(firstThenSortByCombo)
			&& firstThenSortByCombo !== "None") {
		if(firstThenSortByCombo == "accountId")
			firstThenSortByCombo = "glId";
		if(firstThenSortByCombo == "forecastMyproduct")
			firstThenSortByCombo = "productDesc";
		jsonArray.push({
					field : 'FirstThenSortBy',
					operator : 'st',
					value1 : firstThenSortByCombo,
					value2 : firstThenSortByOption,
					dataType : 0,
					displayType : 6
				});
	}

	// Second Then Sort By
	var secondThenSortByCombo = $("select[id='dropdownSortBy3']").val();
	var secondThenSortByOption =getSortByAscendingDescendingText('#sortBy3AscDescLabel'); 
	if (!Ext.isEmpty(secondThenSortByCombo)
			&& secondThenSortByCombo !== "None") {
		if(secondThenSortByCombo == "accountId")
			secondThenSortByCombo = "glId";
		if(secondThenSortByCombo == "forecastMyproduct")
			secondThenSortByCombo = "productDesc";
		jsonArray.push({
					field : 'SecondThenSortBy',
					operator : 'st',
					value1 : secondThenSortByCombo,
					value2 : secondThenSortByOption,
					dataType : 0,
					displayType : 6
				});
	}
	
	objJson = jsonArray;
	return objJson;
}

function setCompanyMenuItems(elementId){
	$.ajax({
		async : false,
		url : 'services/userseek/userclients.json&$sellerCode='+ strSeller,
		success : function(responseText) {
			$("#dropdownCompany  option").remove();
			var responseData=responseText.d.preferences;
			var defaultOpt = $('<option />', {
				value : "all",
				text : getLabel('allCompanies', 'All companies')
				});
			defaultOpt.appendTo(elementId);
			$.each(responseData,function(index,item){
				$(elementId).append($('<option>', { 
					value: responseData[index].CODE,
					text : responseData[index].DESCR
					}));
			});
			filterClientCount=$(elementId+" option").length;
			$(elementId).niceSelect();
		}
		
	});	
}

function setForecastTypeMenuItems(elementId)
{
	$.ajax({
		url : 'services/forecastTypes.json?$clientId='+ selectedClient,
		async : false,
		success : function(responseText) {
			$("#dropdownForecastType  option").remove();
			var defaultOpt = $('<option />', {
				value : "All",
				text : getLabel('ALL', 'ALL')
			});
			defaultOpt.appendTo(elementId);
			$.each(responseText,function(index,item){
				$(elementId).append($('<option>', { 
					value: responseText[index].forecastType,
					text : responseText[index].forecastTypeDesc
				}));
			});
			filterForecastTypeCount=$(elementId+" option").length;
			$(elementId).niceSelect('update');
		}
		
	});	
}

function setStatusMenuItems(elementId) {
	var el = $("#"+elementId).multiselect();
	el.attr('multiple',true);
	if (typeof arrStatus != 'undefined' && arrStatus) {
		for(index=0;index<arrStatus.length;index++)
		{
			var opt = $('<option />', {
				value: arrStatus[index].code,
				text: arrStatus[index].desc
			});
			opt.attr('selected','selected');	
			opt.appendTo(el);
		}
		el.multiselect('refresh');
		filterStatusCount=arrStatus.length;
	}	
}

function setAccountNumberItems(elementId){
	var strUrl = 'services/userseek/forecastAccountsSeek.json?$sellerCode='+ strSeller;
	if(!isEmpty(selectedClient) && selectedClient !='all')
		strUrl = strUrl+ '&$filtercode1='+selectedClient;
	$.ajax({
		//url : 'services/userseek/forecastAccountsSeek.json?$sellerCode='+ strSeller+ '&$filtercode1='+selectedClient,
		async : false,
		url : strUrl,
		success : function(responseText) {
			$("#dropdownAccountNo  option").remove();
			var responseData=responseText.d.preferences;
			var defaultOpt = $('<option />', {
				value : "selectAccount",
				text : getLabel('selectAccount', 'Select Account Number')
				});
			defaultOpt.appendTo(elementId);
			$.each(responseData,function(index,item){
				$(elementId).append($('<option>', { 
					value: responseData[index].CODE,
					text : responseData[index].DISPLAYFIELD 
					}));
			});
			filterAccCount=$(elementId+" option").length;
			$(elementId).niceSelect();
			$('#dropdownAccountNo').niceSelect('update');
		}
		
	});	
}

function getAdvancedFilterQueryJson() {
	var objJson = null;
	var jsonArray = [];
	
	//Client code
	var clientCodesData =$("select[id='dropdownCompany']").getMultiSelectValueString(); 	
	var tempCodesData=clientCodesData;
	var selClientDesc = selectedClientDesc;
	if (!Ext.isEmpty(tempCodesData)) {
		if(!Ext.isEmpty(filterClientCount)){
			var clientCodeArray=clientCodesData.split(',');
			if(filterClientCount==clientCodeArray.length)
				tempCodesData='all';
		}
		if(tempCodesData!='all' && selClientDesc != 'All companies'){
		jsonArray.push({
					field : 'clientCode',
					/* operator : 'in', */
					operator : tempCodesData.indexOf(',') === -1 ? 'eq' : 'in',
					value1 : tempCodesData,
					value2 : '',
					dataType : 0,
					/* displayType : 11,// 6, */
					displayType : tempCodesData.indexOf(',') === -1 ? 5 : 11,
					fieldLabel : getLabel('lblcompany', 'Company Name'),
					displayValue1 : selClientDesc
				});
		}
	}
	
	// Status
	var statusValue=$("select[id='dropdownStatus']").getMultiSelectValue();
	
	var statusValueDesc = [];
	$('#dropdownStatus :selected').each(function(i, selected){
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
			tempStatusValue=statusValueArray;
			//tempStatusValue=statusValueArray.join(',');
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
		}
		if(tempStatusValue != "All")
			jsonArray.push({
						field : 'requestState',
						operator : 'statusFilterOp',
						value1 : tempStatusValue,
						value2 : '',
						dataType : 0,
						displayType :11,// 6,
						fieldLabel : getLabel('status','Status'),
						displayValue1 : statusValueDesc.toString()
						
					});
	}
	
	//Package
	var productType =  $("select[id='dropdownPackage']").getMultiSelectValueString();
	
	var productTypeDesc = [];
	$('#dropdownPackage :selected').each(function(i, selected){
		productTypeDesc[i] = $(selected).text();
	});
	
	var tempProductType=productType;
	if(productType =='' && !Ext.isEmpty(selectedProductTypeList)){
	filterPackageCount =selectedProductTypeList.length-1;
	if(!Ext.isEmpty(filterPackageCount)){
			tempProductType=selectedProductTypeList.join('and').split('and').join(',');
			if(filterPackageCount==tempProductType.length)
				tempProductType='All';
		}
	}
	if (!Ext.isEmpty(tempProductType)) {
		if(!Ext.isEmpty(filterPackageCount)){
			var productTypeArray=productType.split(',');
			if(filterPackageCount==productTypeArray.length)
				tempProductType='All';
		}
		if(tempProductType != "All")
			jsonArray.push({
						field : 'forecastMyproduct',
						operator : 'in',
						value1 : tempProductType,
						value2 : '',
						dataType : 0,
						displayType : 11,// 6,
						fieldLabel : getLabel('package','Package'),
						displayValue1 : productTypeDesc.toString()
					});
	}
	
	//forecast type
	var dropdownForecastType =$("select[id='dropdownForecastType']").getMultiSelectValueString(); 	
	var tempForecastType=dropdownForecastType;
	var selectedForecastType = null;
	if($('#dropdownForecastType :selected')[0] != undefined)
		selectedForecastType = $('#dropdownForecastType :selected')[0].label;
	else
		selectedForecastType = $('#dropdownForecastType :selected');
	
	var filterForecastTypeCount=$("#dropdownForecastType option").length;
	if (!Ext.isEmpty(tempForecastType)) {
		if(!Ext.isEmpty(filterForecastTypeCount)){
			var forecastTypeArray=dropdownForecastType.split(',');
			if(filterForecastTypeCount==forecastTypeArray.length)
				tempForecastType = 'ALL';
		}
		if(tempForecastType!='All' && selectedForecastType != 'ALL'){
			jsonArray.push({
				field : 'forecastType',
				/* operator : 'in', */
				operator : tempForecastType.indexOf(',') === -1 ? 'eq' : 'in',
				value1 : tempForecastType,
				value2 : '',
				dataType : 0,
				/* displayType : 11,// 6, */
				displayType : tempForecastType.indexOf(',') === -1 ? 5 : 11,
				fieldLabel : getLabel('forecastType', 'Forecast Type'),
				displayValue1 : selectedForecastType
			});
		}
	}

	//Forecast Reference
	var forecastRef = $("#txtForecastRef").val();
	if (!Ext.isEmpty(forecastRef)) {
		jsonArray.push({
					field : 'forecastReference',
					operator : 'lk',
					value1 : forecastRef.toUpperCase(),
					value2 : '',
					dataType : 0,
					displayType : 0,
					displayValue1 : forecastRef,
					fieldLabel : getLabel('forecastRef','Reference')
				});
	}
	
	// forecast Amount 
	var blnAutoNumeric = true;
	var amountFrom=$("#txtAmount").val();
	// jquery autoNumeric formatting
	blnAutoNumeric = isAutoNumericApplied("txtAmount");
	if (blnAutoNumeric)
		amountFrom = $("#txtAmount").autoNumeric('get');
	else
		amountFrom = $("#txtAmount").val();
	// jquery autoNumeric formatting
	if(!Ext.isEmpty(amountFrom)){
		var amountOperator = $("#amountOperator").val();
		var amountTo=$("#amountFieldTo").val();
		// jquery autoNumeric formatting
		blnAutoNumeric = isAutoNumericApplied("amountFieldTo");
		if (blnAutoNumeric)
			amountTo = $("#amountFieldTo").autoNumeric('get');
		else
			amountTo = $("#amountFieldTo").val();
		// jquery autoNumeric formatting
		if (!Ext.isEmpty(amountOperator)) {
			jsonArray.push({
						field : 'forecastAmount',
						operator : amountOperator,							
						value1 : amountFrom,
						value2 : amountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : getLabel('amount','Amount')
					});
		}
	}
	
	
	
	// transcation Amount 
	var blnTranAutoNumeric = true;
	var amountTranFrom=$("#tranTxtAmount").val();
	// jquery autoNumeric formatting
	blnTranAutoNumeric = isAutoNumericApplied("tranTxtAmount");
	if (blnTranAutoNumeric)
		amountTranFrom = $("#tranTxtAmount").autoNumeric('get');
	else
		amountTranFrom = $("#tranTxtAmount").val();
	// jquery autoNumeric formatting
	if(!Ext.isEmpty(amountTranFrom)){
		var tranAmountOperator = $("#tranAmountOperator").val();
		var tranAmountTo=$("#tranAmountFieldTo").val();
		// jquery autoNumeric formatting
		blnTranAutoNumeric = isAutoNumericApplied("tranAmountFieldTo");
		if (blnTranAutoNumeric)
			tranAmountTo = $("#tranAmountFieldTo").autoNumeric('get');
		else
			tranAmountTo = $("#tranAmountFieldTo").val();
		// jquery autoNumeric formatting
		if (!Ext.isEmpty(tranAmountOperator)) {
			jsonArray.push({
						field : 'transactionAmount',
						operator : tranAmountOperator,							
						value1 : amountTranFrom,
						value2 : tranAmountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : getLabel('tranamount','Transaction Amount')
					});
		}
	}
	
	// Transaction Type
	var creditDebitType='';
	var creditDebitTypeDesc = '';
	var debitValue=$("input[type='checkbox'][id='optDebit']").is(':checked');
	var creditValue=$("input[type='checkbox'][id='optCredit']").is(':checked');	
	if(debitValue === true && creditValue === true)
	{
		creditDebitType = '';
		creditDebitTypeDesc = "Credit,Debit";
	}
	else if(debitValue === true)
	{
		creditDebitType = 'D';
		creditDebitTypeDesc = "Debit";
	}
	else if(creditValue === true)
	{
		creditDebitType = 'C';
		creditDebitTypeDesc = "Credit";
	}	
	
	if ((!Ext.isEmpty(creditDebitType))) {
			jsonArray.push({
						field : 'transactionType',
						operator : 'eq',
						value1 : creditDebitType,
						value2 : '',
						dataType : 0,
						displayType : 13,
						fieldLabel : getLabel('transactionType','Transaction Type'),
						displayValue1 : creditDebitTypeDesc
					});
	}
	
	// Rucurring 
	var optIsRecurringValue='';
	var optIsRecurringDesc = '';
	var yesValue=$("input[type='checkbox'][id='optYes']").is(':checked');
	var noValue=$("input[type='checkbox'][id='optNo']").is(':checked');	
	if(yesValue === true && noValue === true)
	{
		optIsRecurringValue = '';
		optIsRecurringDesc = "Yes,No";
	}
	else if(yesValue === true)
	{
		optIsRecurringValue = 'Y';
		optIsRecurringDesc = "Yes";
	}
	else if(noValue === true)
	{
		optIsRecurringValue = 'N';
		optIsRecurringDesc = "No";
	}	
	
	if ((!Ext.isEmpty(optIsRecurringValue))) {
			jsonArray.push({
						field : 'isRepetitive',
						operator : 'eq',
						value1 : optIsRecurringValue,
						value2 : '',
						dataType : 0,
						displayType : 13,
						fieldLabel : getLabel('recurring','Recurring'),
						displayValue1 : optIsRecurringDesc
					});
	}
	
	// Effective Date	
	if(!jQuery.isEmptyObject(selectedEffectiveDate)){
		var EffectiveVal1 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedEffectiveDate.fromDate));
		var EffectiveVal2 = '';
		if(!Ext.isEmpty(selectedEffectiveDate.toDate)) {
			EffectiveVal2 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedEffectiveDate.toDate));
		}
		jsonArray.push({
			field : 'forecastDate',
			operator : selectedEffectiveDate.operator,
			value1 : EffectiveVal1,
			value2 : EffectiveVal2,
			dataType : 1,
			displayType : 6,// 5,
			fieldLabel : getLabel('EffectiveDate','Effective Date'),
			dropdownLabel : selectedEffectiveDate.dateLabel
		});
	}
	
	//Account ID
	var dropdownAccountNo =$("select[id='dropdownAccountNo']").getMultiSelectValueString(); 	
	var tempAccountNo=dropdownAccountNo;
	if($('#dropdownAccountNo :selected')[0] != undefined)
		var selectedAccountNo = $('#dropdownAccountNo :selected')[0].label;
	else
		var selectedAccountNo = $('#dropdownAccountNo :selected');
	var filterAcountNoCount=$("#dropdownAccountNo option").length;
	if (!Ext.isEmpty(tempAccountNo)) {
		if(!Ext.isEmpty(filterAcountNoCount)){
			var accountNoArray=dropdownAccountNo.split(',');
			if(filterAcountNoCount==accountNoArray.length)
				tempAccountNo='select Account';
		}
		if(tempAccountNo!='select Account' && selectedAccountNo != 'Select Account'){
		jsonArray.push({
					field : 'accountId',
					/* operator : 'in', */
					operator : tempAccountNo.indexOf(',') === -1 ? 'eq' : 'in',
					value1 : tempAccountNo,
					value2 : '',
					dataType : 0,
					/* displayType : 11,// 6, */
					displayType : tempAccountNo.indexOf(',') === -1 ? 5 : 11,
					fieldLabel : getLabel('accountNumber', 'Account Number'),
					displayValue1 : selectedAccountNo
				});
		}
	}
	
	objJson = jsonArray;
	return objJson;
}

function resetValuesOnClientChange(){
	blnClientSelectionChanged=true;
	selectedClient=$("#dropdownCompany").val();
	if(!isEmpty(selectedClient) && 'all' !=selectedClient)
		selectedClientDesc=$("#dropdownCompany option:selected").text();
	else{
		selectedClient='';
		selectedClientDesc='';
	}	
	setPackageItems("dropdownPackage");
	setAccountNumberItems("#dropdownAccountNo");	
	setForecastTypeMenuItems("#dropdownForecastType");
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

function handleAmountOperatorChange(me){
	var selectedAmountOperator=$("#amountOperator").val();
	if(selectedAmountOperator=='bt'){
		$(".amountTo").removeClass("hidden");
		$("#amountToLabel").text("Forecast Amount To");
		$("#amountFieldTo").removeClass("hidden");
		$("#amountLabel").text(getLabel("amountFrom","Forecast Amount From"));
	}else{
		$(".amountTo").addClass("hidden");
		$("#amountToLabel").text("");
		$("#amountLabel").text(getLabel("amount","Forecast Amount"));
	}
}

function handleTranAmountOperatorChange(me){
	var selectedAmountOperator=$("#tranAmountOperator").val();
	if(selectedAmountOperator=='bt'){
		$(".tranAmountTo").removeClass("hidden");
		$("#tranAmountToLabel").text("Transaction Amount To");
		$("#tranAmountFieldTo").removeClass("hidden");
		$("#tranAmountLabel").text(getLabel("tranAmtFrom","Transaction Amount From"));
	}else{
		$(".tranAmountTo").addClass("hidden");
		$("#tranAmountToLabel").text("");
		$("#tranAmountLabel").text(getLabel("tranAmount","Transaction Amount"));
	}
}

function getAdvancedFilterValueJson(FilterCodeVal){
	var jsonArray = [];

	//Client code
	var clientCodesData =$("select[id='dropdownCompany']").getMultiSelectValueString(); 	
	var tempCodesData=clientCodesData;
	var selClientDesc = selectedClientDesc;
	if (!Ext.isEmpty(tempCodesData)) {
		if(!Ext.isEmpty(filterClientCount)){
			var clientCodeArray=clientCodesData.split(',');
			if(filterClientCount==clientCodeArray.length)
				tempCodesData='all';
		}
		if(tempCodesData!='all' && selClientDesc != 'All companies'){
		jsonArray.push({
					field : 'clientCode',
					/* operator : 'in', */
					operator : tempCodesData.indexOf(',') === -1 ? 'eq' : 'in',
					value1 : tempCodesData,
					value2 : '',
					dataType : 0,
					/* displayType : 11,// 6, */
					displayType : tempCodesData.indexOf(',') === -1 ? 5 : 11,
					fieldLabel : getLabel('lblcompany', 'Company Name'),
					displayValue1 : selClientDesc
				});
		}
		else if((strEntityType === "0") && (tempCodesData === null || tempCodesData === "" ||tempCodesData==='all' || selClientDesc === 'All companies')){
		jsonArray.push({
					field : 'clientCode',
					/* operator : 'in', */
					operator : 'eq',
					value1 : "",
					value2 : '',
					dataType : 0,
					/* displayType : 11,// 6, */
					displayType : tempCodesData.indexOf(',') === -1 ? 5 : 11,
					fieldLabel : getLabel('lblcompany', 'Company Name'),
					displayValue1 : ""
				});
		}
	}
	
	// Status
	var statusValue=$("select[id='dropdownStatus']").getMultiSelectValue();
	
	var statusValueDesc = [];
	$('#dropdownStatus :selected').each(function(i, selected){
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
			tempStatusValue=statusValueArray;
			//tempStatusValue=statusValueArray.join(',');
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
		}
		if(tempStatusValue != "All")
			jsonArray.push({
						field : 'requestState',
						operator : 'statusFilterOp',
						value1 : tempStatusValue,
						value2 : '',
						dataType : 0,
						displayType :11,// 6,
						fieldLabel : getLabel('status','Status'),
						displayValue1 : statusValueDesc.toString()
						
					});
	}
	
	//Package
	var productType =  $("select[id='dropdownPackage']").getMultiSelectValueString();
	
	var productTypeDesc = [];
	$('#dropdownPackage :selected').each(function(i, selected){
		productTypeDesc[i] = $(selected).text();
	});
	
	var tempProductType=productType;
	if(productType =='' && !Ext.isEmpty(selectedProductTypeList)){
	filterPackageCount =selectedProductTypeList.length-1;
	if(!Ext.isEmpty(filterPackageCount)){
			tempProductType=selectedProductTypeList.join('and').split('and').join(',');
			if(filterPackageCount==tempProductType.length)
				tempProductType='All';
		}
	}
	if (!Ext.isEmpty(tempProductType)) {
		if(!Ext.isEmpty(filterPackageCount)){
			var productTypeArray=productType.split(',');
			if(filterPackageCount==productTypeArray.length)
				tempProductType='All';
		}
		if(tempProductType != "All")
			jsonArray.push({
						field : 'forecastMyproduct',
						operator : 'in',
						value1 : tempProductType,
						value2 : '',
						dataType : 0,
						displayType : 11,// 6,
						fieldLabel : getLabel('package','Package'),
						displayValue1 : productTypeDesc.toString()
					});
	}
	
	//forecast type
	var dropdownForecastType =$("select[id='dropdownForecastType']").getMultiSelectValueString(); 	
	var tempForecastType=dropdownForecastType;
	var selectedForecastType = $('#dropdownForecastType :selected')[0].label;
	var filterForecastTypeCount=$("#dropdownForecastType option").length;
	if (!Ext.isEmpty(tempForecastType)) {
		if(!Ext.isEmpty(filterForecastTypeCount)){
			var forecastTypeArray=dropdownForecastType.split(',');
			if(filterForecastTypeCount==forecastTypeArray.length)
				tempForecastType='all';
		}
		if(tempForecastType!='all' && selectedForecastType != 'ALL'){
		jsonArray.push({
					field : 'forecastType',
					/* operator : 'in', */
					operator : tempForecastType.indexOf(',') === -1 ? 'eq' : 'in',
					value1 : tempForecastType,
					value2 : '',
					dataType : 0,
					/* displayType : 11,// 6, */
					displayType : tempForecastType.indexOf(',') === -1 ? 5 : 11,
					fieldLabel : getLabel('forecastType', 'Forecast Type'),
					displayValue1 : selectedForecastType
				});
		}
	}
	
	//Account ID
	var dropdownAccountNo =$("select[id='dropdownAccountNo']").getMultiSelectValueString(); 	
	var tempAccountNo=dropdownAccountNo;
	if($('#dropdownAccountNo :selected')[0] != undefined)
		var selectedAccountNo = $('#dropdownAccountNo :selected')[0].label;
	else
		var selectedAccountNo = $('#dropdownAccountNo :selected');
	var filterAcountNoCount=$("#dropdownAccountNo option").length;
	if (!Ext.isEmpty(tempAccountNo)) {
		if(!Ext.isEmpty(filterAcountNoCount)){
			var accountNoArray=dropdownAccountNo.split(',');
			if(filterAcountNoCount==accountNoArray.length)
				tempAccountNo='select Account';
		}
		if(tempAccountNo!='select Account' && selectedAccountNo != 'Select Account'){
		jsonArray.push({
					field : 'accountId',
					/* operator : 'in', */
					operator : tempAccountNo.indexOf(',') === -1 ? 'eq' : 'in',
					value1 : tempAccountNo,
					value2 : '',
					dataType : 0,
					/* displayType : 11,// 6, */
					displayType : tempAccountNo.indexOf(',') === -1 ? 5 : 11,
					fieldLabel : getLabel('accountnumber', 'Account Number'),
					displayValue1 : selectedAccountNo
				});
		}
	}
	
	//Forecast Reference
	var forecastRef = $("#txtForecastRef").val();
	if (!Ext.isEmpty(forecastRef)) {
		jsonArray.push({
					field : 'forecastReference',
					operator : 'lk',
					value1 : forecastRef.toUpperCase(),
					value2 : '',
					dataType : 0,
					displayType : 0,
					displayValue1 : forecastRef,
					fieldLabel : getLabel('forecastRef','Reference')
				});
	}
	
	// Amount 
	var blnAutoNumeric = true;
	var amountFrom=$("#txtAmount").val();
	// jquery autoNumeric formatting
	blnAutoNumeric = isAutoNumericApplied("txtAmount");
	if (blnAutoNumeric)
		amountFrom = $("#txtAmount").autoNumeric('get');
	else
		amountFrom = $("#txtAmount").val();
	// jquery autoNumeric formatting
	if(!Ext.isEmpty(amountFrom)){
		var amountOperator = $("#amountOperator").val();
		var amountTo=$("#amountFieldTo").val();
		// jquery autoNumeric formatting
		blnAutoNumeric = isAutoNumericApplied("amountFieldTo");
		if (blnAutoNumeric)
			amountTo = $("#amountFieldTo").autoNumeric('get');
		else
			amountTo = $("#amountFieldTo").val();
		// jquery autoNumeric formatting
		if (!Ext.isEmpty(amountOperator)) {
			jsonArray.push({
						field : 'forecastAmount',
						operator : amountOperator,							
						value1 : amountFrom,
						value2 : amountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : getLabel('amount','Amount')
					});
		}
	}
	
	// transcation Amount 
	var blnTranAutoNumeric = true;
	var amountTranFrom=$("#tranTxtAmount").val();
	// jquery autoNumeric formatting
	blnTranAutoNumeric = isAutoNumericApplied("tranTxtAmount");
	if (blnTranAutoNumeric)
		amountTranFrom = $("#tranTxtAmount").autoNumeric('get');
	else
		amountTranFrom = $("#tranTxtAmount").val();
	// jquery autoNumeric formatting
	if(!Ext.isEmpty(amountTranFrom)){
		var tranAmountOperator = $("#tranAmountOperator").val();
		var tranAmountTo=$("#tranAmountFieldTo").val();
		// jquery autoNumeric formatting
		blnTranAutoNumeric = isAutoNumericApplied("tranAmountFieldTo");
		if (blnTranAutoNumeric)
			tranAmountTo = $("#tranAmountFieldTo").autoNumeric('get');
		else
			tranAmountTo = $("#tranAmountFieldTo").val();
		// jquery autoNumeric formatting
		if (!Ext.isEmpty(tranAmountOperator)) {
			jsonArray.push({
						field : 'transactionAmount',
						operator : tranAmountOperator,							
						value1 : amountTranFrom,
						value2 : tranAmountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : getLabel('tranamount','Transaction Amount')
					});
		}
	}
	
	// Transaction Type
	var creditDebitType='';
	var creditDebitTypeDesc = '';
	var debitValue=$("input[type='checkbox'][id='optDebit']").is(':checked');
	var creditValue=$("input[type='checkbox'][id='optCredit']").is(':checked');	
	if(debitValue === true && creditValue === true)
	{
		creditDebitType = '';
		creditDebitTypeDesc = "Credit,Debit";
	}
	else if(debitValue === true)
	{
		creditDebitType = 'D';
		creditDebitTypeDesc = "Debit";
	}
	else if(creditValue === true)
	{
		creditDebitType = 'C';
		creditDebitTypeDesc = "Credit";
	}	
	
	if ((!Ext.isEmpty(creditDebitType))) {
			jsonArray.push({
						field : 'transactionType',
						operator : 'eq',
						value1 : creditDebitType,
						value2 : '',
						dataType : 0,
						displayType : 13,
						fieldLabel : getLabel('transactionType','Transaction Type'),
						displayValue1 : creditDebitTypeDesc
					});
	}
	
	// Rucurring 
	var optIsRecurringValue='';
	var optIsRecurringDesc = '';
	var yesValue=$("input[type='checkbox'][id='optYes']").is(':checked');
	var noValue=$("input[type='checkbox'][id='optNo']").is(':checked');	
	if(yesValue === true && noValue === true)
	{
		optIsRecurringValue = '';
		optIsRecurringDesc = "Yes,No";
	}
	else if(yesValue === true)
	{
		optIsRecurringValue = 'Y';
		optIsRecurringDesc = "Yes";
	}
	else if(noValue === true)
	{
		optIsRecurringValue = 'N';
		optIsRecurringDesc = "No";
	}	
		
	if ((!Ext.isEmpty(optIsRecurringValue))) {
			jsonArray.push({
						field : 'isRepetitive',
						operator : 'eq',
						value1 : optIsRecurringValue,
						value2 : '',
						dataType : 0,
						displayType : 13,
						fieldLabel : getLabel('recurring','Recurring'),
						displayValue1 : optIsRecurringDesc
					});
	}
	
	// Effective Date	
	if(!jQuery.isEmptyObject(selectedEffectiveDate)){
		var EffectiveVal1 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedEffectiveDate.fromDate));
		var EffectiveVal2 = '';
		if(!Ext.isEmpty(selectedEffectiveDate.toDate)) {
			EffectiveVal2 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedEffectiveDate.toDate));
		}
		jsonArray.push({
			field : 'forecastDate',
			operator : selectedEffectiveDate.operator,
			value1 : EffectiveVal1,
			value2 : EffectiveVal2,
			dataType : 1,
			displayType : 6,// 5,
			fieldLabel : getLabel('EffectiveDate','Effective Date'),
			dropdownLabel : selectedEffectiveDate.dateLabel
		});
	}
	
	// Sort By
	var sortByCombo = $("select[id='dropdownSortBy1']").val();
	var sortByOption = getSortByAscendingDescendingText('#sortBy1AscDescLabel');
	if (!Ext.isEmpty(sortByCombo) && sortByCombo !== "None") {
		jsonArray.push({
					field : 'SortBy',
					operator : 'st',
					value1 : sortByCombo,
					value2 : sortByOption,
					dataType : 0,
					displayType : 6
				});
	}

	// First Then Sort By
	var firstThenSortByCombo = $("select[id='dropdownSortBy2']").val();
	var firstThenSortByOption = getSortByAscendingDescendingText('#sortBy2AscDescLabel');
	if (!Ext.isEmpty(firstThenSortByCombo)
			&& firstThenSortByCombo !== "None") {
		jsonArray.push({
					field : 'FirstThenSortBy',
					operator : 'st',
					value1 : firstThenSortByCombo,
					value2 : firstThenSortByOption,
					dataType : 0,
					displayType : 6
				});
	}

	// Second Then Sort By
	var secondThenSortByCombo = $("select[id='dropdownSortBy3']").val();
	var secondThenSortByOption =getSortByAscendingDescendingText('#sortBy3AscDescLabel'); 
	if (!Ext.isEmpty(secondThenSortByCombo)
			&& secondThenSortByCombo !== "None") {
		jsonArray.push({
					field : 'SecondThenSortBy',
					operator : 'st',
					value1 : secondThenSortByCombo,
					value2 : secondThenSortByOption,
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
function setSavedFilterComboItems(element){
	$.ajax({
		url : 'services/userfilterslist/forecastCenter.json',
		success : function(responseText) {
			if(responseText && responseText.d && responseText.d.filters){
				$("#msSavedFilter option").remove();
				$(element).append('<option value=""> Select </option>');
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
function changeClientAndRefreshGrid(selectedClientCode, selectedClientDescription) {
	selectedFilterClient = selectedClientCode;
	selectedFilterClientDesc = selectedClientDescription;
	selectedClient = selectedFilterClient;
	$(document).trigger("handleClientChangeInQuickFilter", false);
}

function handleSavedFilterClick(){
	$(document).trigger("handleSavedFilterClick");
}

var freqMapForPeriod = {
	"D" : {"1" : "1-Everyday",
			"2" : "2-Every 2nd Day",
			"3" : "3-Every 3rd Day",
			"4" : "4-Every 4th Day",
			"5" : "5-Every 5th Day",
			"6" : "6-Every 6th Day",
			"7" : "7-Every 7th Day"
			
		   },
	"W" : {"1" : "1-Weekly",
			"2" : "2-Fortnightly",
			"3" : "3-Every 3rd Week",
			"4" : "4-Every 4th Week"
		   },
	"M" : {
			"1" : "1-Monthly",
			"2" : "2-Every 2nd Month",
			"3" : "3-Quarterly",
			"4" : "4-Every 4th Month",
			"5" : "5-very 5th Month",
			"6" : "6-Semi Annually",
			"7" : "7-Every 7th Month",
			"8" : "8-Every 8th Month",
			"9" : "9-Every 9th Month",
			"10" : "10-Every 10th Month",
			"11" : "11-Every 11th Month",
			"12" : "12-Annually"
		  }
	
};
var freqMapForRefDay = {
	"W" : {	"0" : "Sunday",
			"1" : "Monday",
			"2" : "Tuesday",
			"3" : "Wednesday",
			"4" : "Thursday",
			"5" : "Friday",
			"6" : "Saturday"
			
		   }
};
