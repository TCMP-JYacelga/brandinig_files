function showAdvanceFilterPopup(filterId){
	var blnHasError = false;
	$('#depItemAdvancedFilterPopup').dialog({ 
		autoOpen : false,
		minHeight : 700,
		width : 845,
		minHeight: (screen.width) > 1024 ? 156 : 0 ,
		minWidth : 400,
		modal : true,
		dialogClass:'ft-dialog',
		resizable: false,
		draggable: false,
		open:function(){
		$('#depItemAdvancedFilterPopup').dialog('option','position','center');
		$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
    	  if(!advancedFilterFieldsDataAdded){
			
    		//filterGrid = createFilterGrid(filterId);
			//changeAdvancedFilterTab(1);
			advancedFilterFieldsDataAdded=true;
		}
      }
	});
	$('#depItemAdvancedFilterPopup').dialog("open");
	
	resetFilterCriteriaFields();
	resetFieldsOnCancel();
}
function resetFieldsOnCancel()
{
	if($("#saveFilterChkBox").is(":checked")){
		$("#filterName").addClass("required");		
	}else{
		$("#filterName").removeClass("required");
		$("input[type='text'][id='filterCode']").val("");
	}
	$('#depositAccount').niceSelect('update');	
	$('#depositAccount-niceSelect').bind('blur',function(){
		markRequired(this);
	});
	$('#depositAccount-niceSelect').bind('focus',function(){
		removeMarkRequired(this);
	});
}
function resetFilterCriteriaFields()
{
	if( $('#depositTicketOperator').val() == 'all' )
	{
		$('#depositTicket').val('');
		$('#depositTicket').attr("disabled", true);
	}				
	if( $('#serialNmbrOperator').val() == 'all' )
	{
		$('#serialNmbr').val('');
		$('#serialNmbr').attr("disabled", true);
	}
	if( $('#itemAmountOperator').val() == 'all' )
	{
		$('#itemAmount').val('');
		$('#itemAmount').attr("disabled", true);
	}
	if( $('#itemSeqNmbrOperator').val() == 'all' )
	{
		$('#itemSeqNmbr').val('');
		$('#itemSeqNmbr').attr("disabled", true);
	}		

}
function setAccountIdAndAccountNumber(elementId){
	$.ajax({
		url : 'depositItemAccountList.srvc' + '?' + csrfTokenName + '=' + csrfTokenValue,
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
			value: data[index].depositAccount,
			text: data[index].accountDescription
		});
		opt.attr('selected',false);
		opt.appendTo( el );		
	}
	el.multiselect('refresh');
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
	$('#tabs').tabs("option", "selected", index);
}
function createFilterGrid(filterId) {}
function filterGridStore(filterId) {
	var myStore = null;
	var records = [];
	var strUrl = 'services/userfilterslist/instrumentInqFilter.json' ;
	strUrl = Ext.String.format( strUrl, filterId);
	Ext.Ajax.request({
		url : strUrl,
		headers: objHdrCsrfParams,
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
function getInstAdvancedFilterQueryJson()
{
	var objJson = null;
	var jsonArray = [];
	
	// Account
	var sel = document.getElementById("depositAccount");
	var depositAccountVal = $('#depositAccount').val(); // or sel.value
	
	if (!Ext.isEmpty(depositAccountVal)) {
		jsonArray.push(
				{
					field : 'depositAccount',
					value1 : depositAccountVal,
					operator : 'eq',
					dataType : 'S',
					displayType : 5,
					paramFieldLable : getLabel( 'lbldepacc', 'Deposit Account' ),
					displayValue1 : depositAccountVal
				} );		
	}
	// Import Date
	if (!jQuery.isEmptyObject(selectedDepositDate)) {
		var vFromDate = Ext.util.Format.date( selectedDepositDate.fromDate,
				dtExtJSFormat_ISO );
		var vToDate = Ext.util.Format.date( selectedDepositDate.toDate,
					dtExtJSFormat_ISO );
		jsonArray.push({
					field : 'postingDate',
					operator : selectedDepositDate.operator,
					value1 : vFromDate,
					value2 : (!vToDate)
							? vToDate
							: '',
					dataType : 'D',
					fieldLabel : getLabel('postingDatedate', 'Posting Date')
				});
	}
	// ticketOperator
	var ticketOperator = $("select[id='depositTicketOperator']").val();
	//Deposit Ticket
	var depSlipNmbr = '';
	var depSlipNmbr1 = $("input[type='text'][id='depositTicket1']").val(); 
	if(!Ext.isEmpty(depSlipNmbr1))
	{
		depSlipNmbr = depSlipNmbr1;
	}
	var depSlipNmbrVal = $("input[type='text'][id='depositTicket']").val();
	if (!Ext.isEmpty(depSlipNmbrVal) && ticketOperator != 'all') {
		jsonArray.push({
					field : 'depositTicketNmbr',
					operator : ticketOperator,
					value1 : depSlipNmbrVal,
					value2 : depSlipNmbr,
					dataType : 0,
					displayType : 1,
					fieldLabel : getLabel('lbldepositTicket','Deposit Ticket No.'),
					displayValue1 : depSlipNmbrVal,
					displayValue2 : depSlipNmbr
				});
	}	
	makeNiceSelect('depositTicketOperator',true);
		
		
//	// serialNmbrOperator
	var serialNmbrOperator = $("select[id='serialNmbrOperator']").val();
//	//Deposit Ticket
	var serialNmbr = $("input[type='text'][id='serialNmbr']").val();
	var serialVal2 = $("#serialNmbr1").val();
	if (!Ext.isEmpty(serialNmbr)  && serialNmbrOperator != 'all' ) {
		jsonArray.push({
					field : 'serialNmbr',
					operator : serialNmbrOperator,
					value1 : serialNmbr,
					value2 : serialVal2==null?'':serialVal2,
					dataType : 2,
					displayType : 1,
					fieldLabel : getLabel('lblSerialNo','Check No.'),
					displayValue1 : serialNmbr,
					displayValue2 : serialVal2==null?'':serialVal2
				});
	}
	makeNiceSelect('serialNmbrOperator',true);
	// Operator
	var opFilter = $("select[id='itemAmountOperator']").val();
	// Amount
	var instrumentAmount = '';
	var instrumentAmount1 = $("input[type='text'][id='itemAmount1']").val(); 
	if(!Ext.isEmpty(instrumentAmount1))
	{
		instrumentAmount = instrumentAmount1;
	}
	var amountVal = $("input[type='text'][id='itemAmount']").val();

	if ( opFilter != 'all' && !Ext.isEmpty(amountVal) && !Ext.isEmpty(opFilter)) {
		jsonArray.push({
					field : 'itemAmount',
					operator : opFilter,
					value1 : amountVal,
					value2 : instrumentAmount,
					dataType :2,
					displayType : 2,
					fieldLabel : getLabel('lblDepositAmnt','Deposit Amount'),
					displayValue1 : amountVal,
					displayValue2 : instrumentAmount
				});
	}		
	makeNiceSelect('itemAmountOperator',true);
	// itemSeqNmbrOperator
	var itemSeqNmbrOperator = $("select[id='itemSeqNmbrOperator']").val();
	var itemSeqNmbr = '';
	var itemSeqNmbr1 = $("input[type='text'][id='itemSeqNmbr1']").val(); 
	if(!Ext.isEmpty(itemSeqNmbr1))
	{
		itemSeqNmbr = itemSeqNmbr1;
	}
	var itemSeqNmbrVal = $("input[type='text'][id='itemSeqNmbr']").val();
	if (!Ext.isEmpty(itemSeqNmbrVal) && itemSeqNmbrOperator != 'all') {
		jsonArray.push({
					field : 'itemSeqNmbr',
					operator : itemSeqNmbrOperator,
					value1 : itemSeqNmbrVal,
					value2 : itemSeqNmbr,
					dataType : 2,
					displayType : 1,
					fieldLabel : getLabel('lblItemSeqNo','Item Sequence Number'),
					displayValue1 : itemSeqNmbrVal,
					displayValue2 : itemSeqNmbr
				});
	}
	makeNiceSelect('itemSeqNmbrOperator',true);
	// itemRtnNmbrOperator
	var itemRtnNmbrOperator = $("select[id='itemRtnNmbrOperator']").val();
	//Deposit Ticket
	var itemRtnNmbr = $("input[type='text'][id='itemRtnNmbr']").val();
	if (!Ext.isEmpty(itemRtnNmbr)) {
		jsonArray.push({
					field : 'rtn',
					operator : itemRtnNmbrOperator,
					value1 : itemRtnNmbr,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}	
	makeNiceSelect('itemRtnNmbrOperator',true);
	objJson = jsonArray;
	return objJson;
}
function getInstAdvancedFilterValueJson(FilterCodeVal) {
	var jsonArray = [];
	
	// Account
	var accountVal = $("select[id='depositAccount']").val();
	
	if( !Ext.isEmpty( accountVal) && accountVal !== "All") {
		jsonArray.push({
					field : 'depositAccount',
					operator : 'eq',
					value1 : accountVal,
					value2 : '',
					dataType : 0,
					displayType : 4,
					fieldLabel : getLabel('depositAccount','Deposit Account'),
					displayValue1 : accountVal
				});
	}
	// Import Date
	if (!jQuery.isEmptyObject(selectedDepositDate)) {
		jsonArray.push({
					field : 'postingDate',
					operator : selectedDepositDate.operator,
					value1 : Ext.util.Format.date(
							selectedDepositDate.fromDate, 'Y-m-d'),
					value2 : (!Ext
							.isEmpty(selectedDepositDate.toDate))
							? Ext.util.Format.date(
									selectedDepositDate.toDate,
									'Y-m-d')
							: '',
					dataType : 'D',
					displayType : 5
				});
	}
	// ticketOperator
	var ticketOperator = $("select[id='depositTicketOperator']").val();
	//Deposit Ticket
	var depSlipNmbrVal = $("input[type='text'][id='depositTicket']").val();
	var depSlipNmbrVal2 = $("#depositTicket1").val();
	if (!Ext.isEmpty(depSlipNmbrVal)  && ticketOperator != 'all') {
		jsonArray.push({
					field : 'depositTicketNmbr',
					operator : ticketOperator,
					value1 : depSlipNmbrVal,
					value2 : depSlipNmbrVal2==null?'':depSlipNmbrVal2,
					dataType : 0,
					displayType : 4
				});
	}
	
	// serialNmbrOperator
	var serialNmbrOperator = $("select[id='serialNmbrOperator']").val();
	//serialNmbr
	var serialNmbr = $("input[type='text'][id='serialNmbr']").val();
	var serialVal2 = $("#serialNmbr1").val();
	if (!Ext.isEmpty(serialNmbr) && serialNmbrOperator != 'all') {
		jsonArray.push({
					field : 'serialNmbr',
					operator : serialNmbrOperator,
					value1 : serialNmbr,
					value2 : serialVal2==null?'':serialVal2,
					dataType : 0,
					displayType : 4
				});
	}
	
	// Operator
	var opFilter = $("select[id='itemAmountOperator']").val();
	// Amount
	var amountVal = $("input[type='text'][id='itemAmount']").val();
	var amountVal2 = $("#itemAmount1").val();
	if (!Ext.isEmpty(amountVal) && opFilter != 'all' && !Ext.isEmpty(opFilter)) {
		jsonArray.push({
					field : 'itemAmount',
					operator : opFilter,
					value1 : amountVal,
					value2 : amountVal2==null?'':amountVal2,
					dataType :2,
					displayType : 3
				});
	}		
	// itemSeqNmbrOperator
	var itemSeqNmbrOperator = $("select[id='itemSeqNmbrOperator']").val();
	//itemSeqNmbr
	var itemSeqNmbr = $("input[type='text'][id='itemSeqNmbr']").val();
	var intemSeqVal2 = $("#itemSeqNmbr1").val();
	if (!Ext.isEmpty(itemSeqNmbr)  && itemSeqNmbrOperator != 'all') {
		jsonArray.push({
					field : 'itemSeqNmbr',
					operator : itemSeqNmbrOperator,
					value1 : itemSeqNmbr,
					value2 :  intemSeqVal2==null?'':intemSeqVal2,
					dataType : 0,
					displayType : 4
				});
	}
	// itemRtnNmbrOperator
	var itemRtnNmbrOperator = $("select[id='itemRtnNmbrOperator']").val();
	//itemRtnNmbr
	var itemRtnNmbr = $("input[type='text'][id='itemRtnNmbr']").val();
	if (!Ext.isEmpty(itemRtnNmbr)) {
		jsonArray.push({
					field : 'rtn',
					operator : itemRtnNmbrOperator,
					value1 : itemRtnNmbr,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}	
	objJson = {};
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
		objJson.filterCode = FilterCodeVal;
	return objJson;
}
function showInstrumentInquiryViewPopUp(record)
{
	$('#depositItemView').dialog({
		autoOpen : false,
		//maxHeight : 275,
		width : 400,
		modal : true,
		buttons :[{
	       	   id: 'cancelBottomBtn',
	       	   text: 'Cancel',
	       	   click: function(){
		       		$(this).dialog("close");
	       	   }
          }],
		open: function() {
			resetInstrumentFields();
			$("#instrumentNmbrDtl").attr('value', record.get('itemNmbr'));
			$("#instrumentAmountDtl").attr('value', record.get('itemAmount'));
			$("#instrumentDateDtl").attr('value', record.get('instrumentDate'));
			$("#depSlipNmbrDtl").attr('value', record.get('depSlipNmbr') );
			$("#depositDateDtl").attr('value', record.get('postingDate'));
			$("#depositAccountDtl").attr('value', record.get('depositAccount'));
			$("#instrumentStatusDtl").attr('value', record.get('itemType'));
			$("#debitAccountDtl").attr('value', record.get('debitAccount'));
			$("#rtnDtl").attr('value', record.get('rtn'));			
		 }
	});
	$('#depositItemView').dialog("open");
}

function resetInstrumentFields()
{
	$("#instrumentNmbrDtl").val('');
	$("#instrumentAmountDtl").val('');
	$("#instrumentDateDtl").val('');
	$("#depSlipNmbrDtl").val('');
	$("#depositDateDtl").val('');
	$("#depositAccountDtl").val('');
	$("#instrumentStatusDtl").val('');
	$("#debitAccountDtl").val('');
	$("#rtnDtl").val('');
	
	$("#depositTicketOperator").val('');
	$("#depositTicket").val('');
	$("#depositTicket1").val('');
	
	$("#itemAmountOperator").val('');
	$("#itemAmount").val('');
	$("#itemAmount1").val('');
	
	$("#itemSeqNmbrOperator").val('');
	$("#itemSeqNmbr").val('');
	$("#itemSeqNmbr1").val('');	
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
function setProcessingDateDropDownMenu(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'PostingDateContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "PostingDateLabel",
							cls :"required",
							text:getLabel('postingDate', 'Posting Date')
						}/*,{
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
								}
							}
						}*/
					]	
		});
		return dropDownContainer;
}
function getDateDropDownItems(filterType,buttonIns){
	var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		listeners : {
				hide:function(event) {
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
					value : data[index].depositAccount,
					text : data[index].accountDescription
				});
		opt.appendTo(elementId);
	}
	}
	$('#depositAccount').niceSelect();
}
function getAccountStore() {	
	var accountData = null;
	var objAccountStore = null;
	var strUrl = 'depositItemAccountList.srvc';			
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
function populateAdvancedFilterFieldValue()
{
	$(document).trigger("resetAllFieldsEvent");
	setProcessingDateDropDownMenu('postingDateDropDown');
	
	if(isSingleAccount === 'N')
	{			
		setAccountIdAndAccountNumber("#depositAccount");
	}
	else
	{
		setAccountDropDownItems("#depositAccount");
	}
	setSavedFilterComboItems('#msSavedFilter');
	
	resetFilterCriteriaFields();
	
	$('#itemAmount, #itemAmount1').ForceNumericOnly();
	$( "#depositTicketOperator" ).change(function () {
		var ticketOp = $("select[id='depositTicketOperator']").val();
		
			if( ticketOp != 'all' )
			{
				$('#depositTicket').val('');
				$('#depositTicket').removeAttr("disabled");
				$('#depositTicket').bind('blur',function(){
					markRequired(this);
					});		
				$('#depositTicket').bind('focus',function(){
				removeMarkRequired(this);
				});
				$('#depositTicket1').bind('blur',function(){
					markRequired(this);
					});		
				$('#depositTicket1').bind('focus',function(){
				removeMarkRequired(this);
				});
			}
			else
			{
				$('#depositTicket').val('');
				$('#depositTicket1').val('');
				removeMarkRequired('#depositTicket1');
				removeMarkRequired('#depositTicket');
				$('#depositTicket').attr("disabled", true);
				
			}
		
			if(ticketOp == 'bt'){						
				$('#depositTicketTo').show();
			}else{
				$('#depositTicketTo').hide();
			}
	});
	$( "#serialNmbrOperator" ).change(function () {
		var amtOp = $("select[id='serialNmbrOperator']").val();
			if( amtOp != 'all' )
			{
				$('#serialNmbr').val('');
				$('#serialNmbr').removeAttr("disabled");
			}
			else
			{
				$('#serialNmbr').val('');
				$('#serialNmbr1').val('');
				$('#serialNmbr').attr("disabled", true);
			}
			if(amtOp == 'bt'){						
				$('#serialNmbrTo').show();
			}else{
				$('#serialNmbrTo').hide();
			}
	});			
	$( "#itemAmountOperator" ).change(function () {
		var amtOp = $("select[id='itemAmountOperator']").val();
		
			if( amtOp != 'all' )
			{
				$('#itemAmount').val('');
				$('#itemAmount').removeAttr("disabled");
			}
			else
			{
				$('#itemAmount').val('');
				$('#itemAmount1').val('');
				$('#itemAmount').attr("disabled", true);
			}			
			if(amtOp == 'bt'){						
				$('#itemAmountTo').show();
			}else{
				$('#itemAmountTo').hide();
			}
	});
	$( "#itemSeqNmbrOperator" ).change(function () {
		var serialOp = $("select[id='itemSeqNmbrOperator']").val();
			if( serialOp != 'all' )
			{
				$('#itemSeqNmbr').val('');
				$('#itemSeqNmbr').removeAttr("disabled");
			}
			else
			{
				$('#itemSeqNmbr').val('');
				$('#itemSeqNmbr1').val('');
				$('#itemSeqNmbr').attr("disabled", true);
			}	
			if(serialOp == 'bt'){						
				$('#itemSeqNmbrTo').show();
			}else{
				$('#itemSeqNmbrTo').hide();
			}
	});
}
function setSavedFilterComboItems(element){
	$.ajax({
		url : 'services/userfilterslist/instrumentInqFilter.json',
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