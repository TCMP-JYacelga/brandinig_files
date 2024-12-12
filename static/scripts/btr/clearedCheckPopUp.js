var entry_date_opt = null;
function showAdvanceFilterPopup(filterId){
	var blnHasError = false;
	$('#clearedCheckAdvancedFilterPopup').dialog({  
		autoOpen : false,
		maxHeight: 580,
		minHeight: (screen.width) > 1024 ? 156 : 0 ,
		width : 800,
		dialogClass: 'ft-dialog',
		resizable: false,
		draggable: false,
		title : getLabel('advancedFilter', 'Advanced Filter'),
		modal : true,
		open:function(){
		$('#clearedCheckAdvancedFilterPopup').dialog('option','position','center');
		$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
		if( $("input[type='checkbox'][id='saveFilterChkBox']").is(':checked'))
		{
			$("#filterCodeLabel").addClass("required");
		}
		else
		{
			$('#filterCode').removeClass('requiredField');
		}
		if($('#clearedCheckAccount-niceSelect').hasClass('requiredField'))
		{
			$('#clearedCheckAccount-niceSelect').removeClass('requiredField');
		}				
    	  if(!advancedFilterFieldsDataAdded){
	    	 
			/*$('#postingDatePicker').datepick({
				monthsToShow : 1,
				changeMonth : false,
				minDate : dtHistoryDate,
				rangeSeparator : '  to  ',
				onClose : function(dates) {
					if (!Ext.isEmpty(dates)) {
						$(document).trigger("datePickPopupSelectedDate",
								["postingDatePicker", dates]);
					}
				},
				onSelect : function(dates) {
					var dateArray = $(this).datepick('getDate');
					var dtSelectedDate = new Date(dateArray[0]);
					dtSelectedDate.setDate((dtSelectedDate.getDate()+parseInt(DateRangeDays)));
					if(new Date(dateArray[1])>dtSelectedDate)
					{
						dtSelectedDate = $.datepicker.formatDate(localeDatePickerFormat,dtSelectedDate);
						var arrError = new Array();
						arrError.push({	"errorMessage" : "To Date should be less than or equal to "+dtSelectedDate});
						paintAdvancedFilterErrors('#advancedFilterErrorDiv','#advancedFilterErrorMessage',arrError);
						$(this).datepick('setDate',new Date(dateArray[0]));
						blnHasError = true;
					}
					else
					{
						if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden') && !blnHasError)
						{
							$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
						}
						blnHasError = false;
					}
			}
			}).attr('readOnly', true);*/
			//setProcessingDateDropDownMenu("postingDateDropDown");
			$( "#clearedCheckAmountOperator" ).change(function () {
				var amtOp = $("select[id='clearedCheckAmountOperator']").val();
					if( amtOp != 'all' )
					{
						$('#clearedCheckAmount').val('');
						$('#clearedCheckAmount').removeAttr("disabled");
					}
					else
					{
						$('#clearedCheckAmount').val('');
						$('#clearedCheckAmount1').val('');
						$('#clearedCheckAmount').attr("disabled", true);
					}
					if(amtOp == 'bt'){
                        $('#serialNmbr').val('');
                        $('#serialNmbr').removeAttr("disabled");
					}else{
						$('#clearedCheckAmountTo').hide();
					    $('#serialNmbr').attr("disabled", true);
					}
			});
			$( "#serialNmbrOperator" ).change(function () {
				var amtOp = $("select[id='serialNmbrOperator']").val();
				if( amtOp != 'all' )
				{
					$('#div_serialNmbr').show();
				}
				else
				{
					$('#div_serialNmbr').hide();
					$('#serialNmbr').val('');
					$('#serialNmbr1').val('');
				}
					if(amtOp == 'bt'){
						$('#serialNmbrTo').show();
					}else{
						$('#serialNmbrTo').hide();
					}
			});
			$('#clearedCheckAmount, #clearedCheckAmount1').ForceNumericOnly();
			advancedFilterFieldsDataAdded=true;
		}
      }
	});
	$('#clearedCheckAdvancedFilterPopup').dialog("open");

	if( $('#clearedCheckAmountOperator').val() == 'all' )
	{
		$('#clearedCheckAmount').val('');
		$('#clearedCheckAmount').attr("disabled", true);
	}
	if( $('#serialNmbrOperator').val() == 'all' )
	{
		$('#serialNmbr').val('');
		$('#serialNmbr').attr("disabled", true);
	}

}
function changeAdvancedFilterTab(index) {
	if (index == 0) {
		$('#advFilterSearch').hide();
		$('#advFilterSaveAndSearch').hide();
		$('#advFilterClear').hide();
		$('#advFilterCancel').hide();
	} else {
		$('#advFilterSearch').show();
		$('#advFilterSaveAndSearch').show();
		$('#advFilterClear').show();
		$('#advFilterCancel').show();
	}

}
function createFilterGrid(filterId) {
	var store = filterGridStore(filterId);
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				maxHeight : 430,
				overFlowY : 'auto',
				width : 'auto',
				//autoScroll : true,
				forceFit:true,
				popup : true,
				cls : 't7-grid ft-padding-bottom',
				listeners : {
					cellclick : function (view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
						var IconLinkClicked = (e.target.tagName == 'A');
	         		     if(IconLinkClicked){
					        var clickedId = e.target.id;
							if(clickedId=='viewFilterIconId'){
								$(document).trigger("viewFilterEvent",
										[grid, rowIndex]);
							}else if(clickedId=='editFilterIconId'){
								$(document).trigger("editFilterEvent",
										[grid, rowIndex]);
							}else if(clickedId=='deleteFilterIconId'){
								$(document).trigger("deleteFilterEvent",
										[grid, rowIndex]);
							}
						}
					}
				},
				columns : [{
					text: '#',
					width : 50,
					align : 'center',
					sortable : false,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){
					    return rowIndex+1;
				 	}
				},{
					xtype : 'templatecolumn',
					header : getLabel('actions', 'Actions'),
					align : 'center',
					sortable : false,
					flex : 1,
					menuDisabled : true,
					tpl : '<a href="#" id= "viewFilterIconId" class="grid-row-action-icon icon-view" title="View"></a><a href="#" id= "editFilterIconId" class="grid-row-action-icon icon-edit" title="Edit"></a><a href="#" id= "deleteFilterIconId" class="grid-row-action-icon icon-delete" title="Delete"></a>'
				}, {
					text : 'Filter Name',
					dataIndex : 'filterName',
					flex : 3,
					sortable : false,
					menuDisabled : true
				},
				{
					xtype : 'actioncolumn',
					align : 'center',
					header : getLabel('order', 'Order'),
					sortable : false,
					menuDisabled : true,
					flex : 1,
					items : [{
						iconCls : 'grid-row-up-icon',
						tooltip : getLabel('up', 'Up'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger('orderUpGridEvent',
									[grid, rowIndex, -1]);
						}
					}, {
						iconCls : 'grid-row-down-icon',
						tooltip : getLabel('down', 'Down'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger('orderUpGridEvent',
									[grid, rowIndex, 1]);
						}
					}]
				}],
				renderTo : 'filterList'
			});
	grid.on('resize', function() {
				grid.doLayout();
			});

	return grid;
}
function filterGridStore(filterId) {
	var myStore = null;
	var records = [];
	var strUrl = 'services/userfilterslist/clearedCheckInqFltr.json?';
	strUrl = Ext.String.format( strUrl, filterId);
	Ext.Ajax.request({
		url : strUrl,
		async : false,
		method : "GET",
		success : function(response) {
			if (!Ext.isEmpty(response.responseText)) {
				var decodedJson = Ext.decode(response.responseText);
				var arrJson = new Array();

				if(!Ext.isEmpty(decodedJson.d.filters))
				{
					for(i=0;i<decodedJson.d.filters.length;i++)
					{
						arrJson.push({"filterName":decodedJson.d.filters[i]});
					}
					myStore = Ext.create('Ext.data.Store', {
									fields : ['filterName'],
									data : arrJson,
									autoLoad : true
								});
				}
			}
		},
		failure : function(response) {
		}
	});
	return myStore;
}

function getClearedChkAdvancedFilterQueryJson()
{
	var objJson = null;
	var jsonArray = [];
	var filterCode = $("input[type='text'][id='filterCode']").val();
	var accountCodesData =$("select[id='clearedCheckAccount']").getMultiSelectValueString();
	var tempAccCodesData=accountCodesData;
	multiAccounts = accountCodesData;
	if (!Ext.isEmpty(tempAccCodesData))
	{
		if(!Ext.isEmpty(filterAccountDataCount))
		{
			var accountCodesArray=accountCodesData.split(',');
			if(filterAccountDataCount==accountCodesArray.length)
			{
				tempAccCodesData='all';
			}
		}
		if(tempAccCodesData!='all')
		{
			jsonArray.push(
			{
				field : 'clearedCheckAccount',
				operator : 'eq',
				value1 : tempAccCodesData,
				value2 : '',
				dataType : 0,
				displayType : 6,
				fieldLabel : getLabel('depositAccount','Deposit Account'),
				displayValue1 : tempAccCodesData.toString()
			});
		}
	}

	if (!jQuery.isEmptyObject(selectedPostingDateFilter))
	{
		jsonArray.push(
		{
			field : 'postingDatePicker',
			operator : selectedPostingDateFilter.operator,
			value1 : Ext.util.Format.date(
					selectedPostingDateFilter.fromDate, 'Y-m-d'),
			value2 : (!Ext.isEmpty(selectedPostingDateFilter.toDate))
					? Ext.util.Format.date(selectedPostingDateFilter.toDate,'Y-m-d')
					: '',
			dataType : 'D',
			displayType : 6 ,
			fieldLabel : getLabel('postingDate','Posting Date')
		});
	}

	var opFilter = $("select[id='clearedCheckAmountOperator']").val();
	var amountVal = $("input[type='text'][id='clearedCheckAmount']").val();
	var amountVal2 = $("input[type='text'][id='clearedCheckAmount1']").val();
	if (opFilter != 'all'&& !Ext.isEmpty(amountVal) && !Ext.isEmpty(opFilter)) {
		jsonArray.push({
					field : 'clearedCheckAmount',
					operator : opFilter,
					value1 : amountVal,
					value2 : amountVal2==null?'':amountVal2,
					dataType :2,
					displayType : 3 ,
					fieldLabel : getLabel('depositAmount','Deposit Amount'),
					displayValue1 : amountVal
				});
	}

	var serialNmbrOperator = $("select[id='serialNmbrOperator']").val();
	var serialNmbr = $("input[type='text'][id='serialNmbr']").val();
	var serialNmbrVal2 = $("input[type='text'][id='serialNmbr1']").val();
	if (!Ext.isEmpty(serialNmbr)  && serialNmbrOperator != 'all') {
		jsonArray.push({
					field : 'serialNmbr',
					operator : serialNmbrOperator,
					value1 : serialNmbr,
					value2 : serialNmbrVal2==null?'':serialNmbrVal2,
					dataType : 2,
					displayType : 4,
					fieldLabel : getLabel('serial','Serial Number'),
					displayValue1 : serialNmbr
				});
	}

	objJson = jsonArray;
	return objJson;
}
function getClearedChkAdvancedFilterValueJson(FilterCodeVal)
{
	var jsonArray = [];
	var filterCode = $("input[type='text'][id='filterCode']").val();
	var accountCodesData =$("select[id='clearedCheckAccount']").getMultiSelectValueString();
	var tempAccCodesData=accountCodesData;
	multiAccounts = accountCodesData;
	if (!Ext.isEmpty(tempAccCodesData))
	{
		if(!Ext.isEmpty(filterAccountDataCount))
		{
			var accountCodesArray=accountCodesData.split(',');
			if(filterAccountDataCount==accountCodesArray.length)
			{
				tempAccCodesData='all';
			}
		}
		if(tempAccCodesData!='all')
		{
			jsonArray.push(
			{
				field : 'clearedCheckAccount',
				operator : 'eq',
				value1 : tempAccCodesData,
				value2 : '',
				dataType : 0,
				displayType : 6,
				fieldLabel : getLabel('depositAccount','Deposit Account'),
				displayValue1 : tempAccCodesData.toString()
			});
		}
	}

	if (!jQuery.isEmptyObject(selectedPostingDateFilter))
	{
		jsonArray.push(
		{
			field : 'postingDatePicker',
			operator : selectedPostingDateFilter.operator,
			value1 : Ext.util.Format.date(
					selectedPostingDateFilter.fromDate, 'Y-m-d'),
			value2 : (!Ext.isEmpty(selectedPostingDateFilter.toDate))
					? Ext.util.Format.date(selectedPostingDateFilter.toDate, 'Y-m-d')
					: '',
			dataType : 'D',
			displayType : 6 ,
			fieldLabel : getLabel('postingDate','Posting Date')
		});
	}

	var opFilter = $("select[id='clearedCheckAmountOperator']").val();
	var amountVal = $("input[type='text'][id='clearedCheckAmount']").val();
	var amountVal2 = $("input[type='text'][id='clearedCheckAmount1']").val();
	if (!Ext.isEmpty(amountVal) && opFilter != 'all' && !Ext.isEmpty(opFilter)) {
		jsonArray.push({
					field : 'clearedCheckAmount',
					operator : opFilter,
					value1 : amountVal,
					value2 : amountVal2==null?'':amountVal2,
					dataType :2,
					displayType : 3 ,
					fieldLabel : getLabel('depositAmount','Deposit Amount'),
					displayValue1 : amountVal
				});
	}

	var serialNmbrOperator = $("select[id='serialNmbrOperator']").val();
	var serialNmbr = $("input[type='text'][id='serialNmbr']").val();
	var serialNmbrVal2 = $("input[type='text'][id='serialNmbr1']").val();
	if (!Ext.isEmpty(serialNmbr) && serialNmbrOperator != 'all') {
		jsonArray.push({
					field : 'serialNmbr',
					operator : serialNmbrOperator,
					value1 : serialNmbr,
					value2 : serialNmbrVal2==null?'':serialNmbrVal2,
					dataType : 2,
					displayType : 4,
					fieldLabel : getLabel('serial','Serial'),
					displayValue1 : serialNmbr
				});
	}

	objJson = {};
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
	{
		objJson.filterCode = FilterCodeVal;
	}
	return objJson;
}
function populateAdvancedFilterFieldValue()
{
	if(isSingleAccount === 'N')
	{
		setAccountIdAndAccountNumber("#clearedCheckAccount");
	}
	else
	{
		setAccountDropDownItems("#clearedCheckAccount");
	}
	setProcessingDateDropDownMenu("postingDateDropDown");
	setSavedFilterComboItems('#msSavedFilter');
}
function setSavedFilterComboItems(element){
	$.ajax({
		url : 'services/userfilterslist/clearedCheckInqFltr.json',
		async : false,
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
function setAccountIdAndAccountNumber(elementId){
	$.ajax({
		url : 'clearedCheckAccountList.srvc' + '?' + csrfTokenName + '=' + csrfTokenValue,
		type : 'POST',
		data:{$top:-1},
		success:function(data){
			if(data && data.d){
				var data = data.d.txnlist;
				addDataInAccountMultiSelect(elementId, data);
				filterAccountDataCount = data.length;
			}
		}
	});
}

function addDataInAccountMultiSelect(elementId, data)
{
	var el = $(elementId).multiselect();
	el.attr('multiple',true);
	for(index=0;index<data.length;index++)
	{
		var opt = $('<option />', {
			value: data[index].clearedCheckAccount,
			text: data[index].clearedCheckAccountDescription
		});
		opt.attr('selected',false);
		opt.appendTo( el );
	}
	el.multiselect('refresh');
}

function setAccountDropDownItems(elementId) {
	var data = getAccountStore();
	var opt = $('<option />', {
					value : '',
					text : 'Select Account'
				});
		opt.appendTo(elementId);
    if(data !== null)
        {
        for (var index = 0; index < data.length; index++) {
            var opt = $('<option />', {
                        value : data[index].clearedCheckAccount,
                        text : data[index].clearedCheckAccount
                    });
            opt.appendTo(elementId);
        }
    }
	$('#clearedCheckAccount').niceSelect();
}
function getAccountStore() {	
		var accountData = null;
		var objAccountStore = null;
		var strUrl = 'clearedCheckAccountList.srvc';			
		Ext.Ajax.request({
			url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						accountData = data.d.txnlist;
					}
				}
			}
		});
		return accountData;
}
function hideErrorPanel(errorDivId){
	if($(errorDivId).is(':visible')){
		$(errorDivId).addClass('ui-helper-hidden');
	}
}
function paintError(errorDiv,errorMsgDiv,errorMsg){
	if(!$(errorDiv).is(':visible')){
		$(errorDiv).removeClass('ui-helper-hidden');
	}
	$(errorMsgDiv).text(errorMsg);
}
function paintAdvancedFilterErrors(errorDiv,errorMsgDiv,arrError){
	if(!$(errorDiv).is(':visible')){
		$(errorDiv).removeClass('ui-helper-hidden');
	}$(errorMsgDiv).empty();
	if (arrError && arrError.length > 0) {
		$.each(arrError, function(index, error) {
		var errorMsg = error.errorMessage,element=null;
		element = $('<p>').text( errorMsg);
		element.appendTo(errorMsgDiv);			
		});
	}
	
}

function setProcessingDateDropDownMenu(renderToElementId)
{
	var dropDownContainer=Ext.create('Ext.Container', 
	{
		itemId : 'PostingDateContainer',
		renderTo:renderToElementId,
		items : [{
					xtype : 'label',
					forId : "PostingDateLabel",
					cls :"required",
					text:getLabel('postingDate', 'Posting Date')
				}
				/*{
					xtype : 'button',
					border : 0,
					padding : '2 10 2 10',
					itemId : 'postingDateBtn',
					cls : 'ui-caret-dropdown',
					listeners : {
						click:function(event){
							var menus=getDateDropDownItems("postingDate",this);
							var xy=event.getXY();
							menus.showAt(xy[0],xy[1]+16);
							event.menu=menus;
							event.removeCls('ui-caret-dropdown'),
							event.addCls('action-down-hover');
						},
						render: function(c) {
				    		var tip = Ext.create('Ext.tip.ToolTip', {
				    			target: c.getEl(),
				    			listeners: {
				    				beforeshow: function(tip) {
				    					if(entry_date_opt === null) {
				    						tip.update('Entry Date');
				    					} else {
				    						tip.update('Entry Date' + entry_date_opt);
				    					}
				    				}
				    			}
				    		});
						}
					}
				}*/
				]
		});
		return dropDownContainer;
}
function updateToolTip(filterType,date_option){
	if(filterType === 'postingDate')
		entry_date_opt = date_option;
}
function getDateDropDownItems(filterType,buttonIns)
{
	var dropdownMenu = Ext.create('Ext.menu.Menu', 
	{
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		listeners :
		{
			hide:function(event)
			{
				buttonIns.addCls('ui-caret-dropdown');
				buttonIns.removeCls('action-down-hover');
			}
		},
		items : [{
					text : getLabel('latest', 'Latest'),
					btnId : 'latest',
					btnValue : '12',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',
					btnValue : '5',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'btnLastmonth',
					btnValue : '6',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('lastQuarterToDate',
							'Last Quarter To Date'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('lastyeartodate', 'Last Year To Date'),
					btnId : 'btnYearToDate',
					btnValue : '11',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}]
	});
	return dropdownMenu;
}
