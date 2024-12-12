var amtOperatorsArray = new Array(); 
amtOperatorsArray.push({
			"key" : "eq",
			"value" : "="
		});
amtOperatorsArray.push({
			"key" : "gt",
			"value" : ">"
		});
amtOperatorsArray.push({
			"key" : "lt",
			"value" : "<"
		});
		
function showDepositInquiryViewPopUp(record)
{
	$('#depositTicketView').dialog({
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
			resetDepositFields();
			$("#depSlipNmbrHdr").attr('value', record.get('depSlipNmbr'));
			$("#depositAmountHdr").attr('value', record.get('depositAmount'));
			$("#depositAccountHdr").attr('value', record.get('depositAccount'));
			$("#depositDateHdr").attr('value', record.get('depositDate') );
			$("#depSeqNmbrHdr").attr('value', record.get('depSeqNmbr'));
			$("#lockBoxIdHdr").attr('value', record.get('lockBoxId'));
		 }
	});
	$('#depositTicketView').dialog("open");
}

function resetDepositFields()
{
	$("#depSlipNmbrHdr").val('');
	$("#depositAmountHdr").val('');
	$("#depositAccountHdr").val('');
	$("#depositDateHdr").val('');
	$("#depSeqNmbrHdr").val('');
	$("#lockBoxIdHdr").val('');
	$("#depositTicketOperator").val('');
	$("#depositTicket1").val('');	
	$("#depositAmountOperator").val('');
	$("#depositAmount1").val('');
	$("#serialOperator").val('');
	$("#serial1").val('');	
	$("#lockBoxNmbrOperator").val('');
	$("#lockBoxNmbr1").val('');	
}
function showAdvanceFilterPopup(filterId){
	var blnHasError = false;
	$('#depAdvancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight : 580,
		minHeight: 700,
		width : 840,
		minHeight: (screen.width) > 1024 ? 156 : 0 ,
		minWidth : 400,
		modal : true,
		dialogClass: 'ft-dialog',
		resizable: false,
		draggable: false,
		open:function(){
		$('#depAdvancedFilterPopup').dialog('option','position','center');
		$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
		if( $("input[type='checkbox'][id='saveFilterChkBox']").is(':checked'))
		{
			$("#filterCodeLabel").addClass("required");
		}
		if($('#depositAccount-niceSelect').hasClass('requiredField'))
		{
			$('#depositAccount-niceSelect').removeClass('requiredField');
		}
		if($('#filterCode').hasClass('requiredField'))
		{
			$('#filterCode').removeClass('requiredField');
		}
		$('#depositAccount-niceSelect').bind('blur',function(){
			markRequired(this);
		});
		$('#depositAccount-niceSelect').bind('focus',function(){
			removeMarkRequired(this);
		});
    	  if(!advancedFilterFieldsDataAdded){
			
			$( "#depositTicketOperator" ).change(function () {
				var ticketOp = $("select[id='depositTicketOperator']").val();
				
					if( ticketOp != 'all' )
			{			
						$('#depositTicket').val('');
						$('#depositTicket').removeAttr("disabled");
			}
			else
			{
						$('#depositTicket').val('');
						$('#depositTicket1').val('');
						$('#depositTicket').attr("disabled", true);
			}
					if(ticketOp == 'bt'){						
						$('#depositTicketTo').show();
						$('#depositTicketLbl').html("From "+$('#depositTicketLbl').html());
					}else{
						$('#depositTicketTo').hide();
						$('#depositTicketLbl').html($('#depositTicketLbl').html().replace("From ",""));
					}
			});
			$( "#depositAmountOperator" ).change(function () {
				var amtOp = $("select[id='depositAmountOperator']").val();
				
					if( amtOp != 'all' )
					{
						$('#depositAmount').val('');
						$('#depositAmount').removeAttr("disabled");
					}
					else
					{
						$('#depositAmount').val('');
						$('#depositAmount1').val('');
						$('#depositAmount').attr("disabled", true);
					}				
					if(amtOp == 'bt'){						
						$('#depositAmountTo').show();
                        if($('#depositAmountLbl').html().indexOf('From') < 0)
                            $('#depositAmountLbl').html("From "+$('#depositAmountLbl').html());
					}else{
						$('#depositAmountTo').hide();
						$('#depositAmountLbl').html($('#depositAmountLbl').html().replace("From ",""));
					}
			});
			$( "#serialOperator" ).change(function () {
				var serialOp = $("select[id='serialOperator']").val();
					if(serialOp == 'bt'){						
						$('#serialTo').show();
					}else{
						$('#serialTo').hide();
					}
			});
			$( "#lockBoxNmbrOperator" ).change(function () {
				var lockBoxOp = $("select[id='lockBoxNmbrOperator']").val();
				
					if( lockBoxOp != 'all' )
					{
						$('#lockBoxNmbr').val('');
						$('#lockBoxNmbr').removeAttr("disabled");
					}
					else
					{
						$('#lockBoxNmbr').val('');
						$('#lockBoxNmbr1').val('');
						$('#lockBoxNmbr').attr("disabled", true);
					}				
					if(lockBoxOp == 'bt'){						
						$('#lockBoxNmbrTo').show();
						$('#lockBoxNmbrLbl').html("From "+$('#lockBoxNmbrLbl').html());
					}else{
						$('#lockBoxNmbrTo').hide();
						$('#lockBoxNmbrLbl').html($('#lockBoxNmbrLbl').html().replace("From ",""));
					}
			});
			
			advancedFilterFieldsDataAdded=true;
		}
      }
	});
	$('#depAdvancedFilterPopup').dialog("open");
	
	if( $('#depositTicketOperator').val() == 'all' )
	{
		$('#depositTicket').val('');
		$('#depositTicket').attr("disabled", true);
}
	if( $('#depositAmountOperator').val() == 'all' )
	{
		$('#depositAmount').val('');
		$('#depositAmount').attr("disabled", true);
	}
	if( $('#lockBoxNmbrOperator').val() == 'all' )
	{
		$('#lockBoxNmbr').val('');
		$('#lockBoxNmbr').attr("disabled", true);
	}
	
}
function setAccountIdAndAccountNumber(elementId){
	$.ajax({
		url : 'depositAccountList.srvc' + '?' + csrfTokenName + '=' + csrfTokenValue,
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
		var strUrl = 'depositAccountList.srvc';			
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
function setStatusDropDownItems(elementId) {
	var statusArray = advFilterStatusArray;
	for (var index = 0; index < statusArray.length; index++) {
		var opt = $('<option />', {
					value : statusArray[index].key,
					text : statusArray[index].value
				});
		opt.appendTo(elementId);
	}
}
function setOperatorDropDownItems(elementId) {
	var operatorArray = amtOperatorsArray;
	for (var index = 0; index < operatorArray.length; index++) {
		var opt = $('<option />', {
					value : operatorArray[index].key,
					text : operatorArray[index].value
				});
		opt.appendTo(elementId);
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
					flex:1,
					menuDisabled : true,
					tpl: '<a href="#" id="viewFilterIconId" class="grid-row-action-icon icon-view" title="View"></a><a href="#" id="editFilterIconId" class="grid-row-action-icon icon-edit" title="Edit"></a><a class="grid-row-action-icon icon-delete" title="Delete" href="#" id="deleteFilterIconId"></a>'
				}, {
					text : 'Filter Name',
					dataIndex : 'filterName',
					flex : 3,
					sortable : false,
					menuDisabled : true
				}, /*{
					xtype : 'templatecolumn',
					align : 'center',
					header : getLabel('deleteFilter', 'Delete Filter'),
					sortable : false,
					tpl: '<a class="grid-row-action-icon icon-delete" title="Delete" href="#" id="deleteFilterIconId"></a>',
					menuDisabled : true
				},*/ {
					xtype : 'actioncolumn',
					align : 'center',
					header : getLabel('order', 'Order'),
					sortable : false,
					menuDisabled : true,
					flex:1,
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
	var strUrl = 'services/userfilterslist/depositInqFilter.json';
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
function getAdvancedFilterQueryJson()
{
	var objJson = null;
	var jsonArray = [];
	
	// Account	
	/*var accountCodesData =$("select[id='depositAccount']").getMultiSelectValueString(); 	
	var tempAccCodesData=accountCodesData;
	multiAccounts = accountCodesData;
	if (!Ext.isEmpty(tempAccCodesData)) {
		if(!Ext.isEmpty(filterAccountDataCount)){
			var accountCodesArray=accountCodesData.split(',');
			if(filterAccountDataCount==accountCodesArray.length)
				tempAccCodesData='all';
		}
		if(tempAccCodesData!='all'){
		jsonArray.push({
					field : 'depositAccount',
					operator : 'in',
					value1 : tempAccCodesData,
					value2 : '',
					dataType : 0,
					displayType : 6,
					fieldLabel : getLabel('depositAccount','Deposit Account'),
					displayValue1 : tempAccCodesData.toString()
				});
		}
	}*/
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
	// Posting Date
	if (!jQuery.isEmptyObject(selectedPostingDateFilter)) {
		jsonArray.push({
					field : 'postingDate',
					operator : selectedPostingDateFilter.operator,
					value1 : Ext.util.Format.date(
							selectedPostingDateFilter.fromDate, 'Y-m-d'),
					value2 : (!Ext
							.isEmpty(selectedPostingDateFilter.toDate))
							? Ext.util.Format.date(
									selectedPostingDateFilter.toDate,
									'Y-m-d')
							: '',
					dataType : 'D',
					displayType : 6,
					fieldLabel : getLabel('postingDate','Posting Date')
				});
	}
	// depositTicketOperator
	var ticketOperator = $("select[id='depositTicketOperator']").val();
	//Deposit Ticket
	var depSlipNmbr = '';
	var depSlipNmbr1 = $("input[type='text'][id='depositTicket1']").val(); 
	if(!Ext.isEmpty(depSlipNmbr1))
	{
		depSlipNmbr = depSlipNmbr1;
	}
	var depSlipNmbrVal = $("input[type='text'][id='depositTicket']").val();
	if (!Ext.isEmpty(depSlipNmbrVal)) {
		jsonArray.push({
					field : 'depositTicketNmbr',
					operator : ticketOperator,
					value1 : depSlipNmbrVal,
					value2 : depSlipNmbr,
					dataType : 2,
					displayType : 3,//4,
					fieldLabel : getLabel('depositTicketNmbr','Deposit Ticket'),
					displayValue1 : depSlipNmbrVal
				});
	}
	// depositAmountOperator
	var blnAutoNumeric = true;
	var opFilter = $("select[id='depositAmountOperator']").val();
	// Amount
	var depositAmount = '';
	var depositAmount1 = $("input[type='text'][id='depositAmount1']").val();  
	if(!Ext.isEmpty(depositAmount1))
	{
		depositAmount = depositAmount1;
	}
	var amountVal = $("input[type='text'][id='depositAmount']").val();
	// jquery autoNumeric formatting
	blnAutoNumeric = isAutoNumericApplied("depositAmount");
	if (blnAutoNumeric)
		amountVal = $("#depositAmount").autoNumeric('get');
	else
		amountVal = $("#depositAmount").val();
	
	if (!Ext.isEmpty(amountVal) && !Ext.isEmpty(opFilter)) {
		jsonArray.push({
					field : 'depositAmount',
					operator : opFilter,
					value1 : amountVal,
					value2 : depositAmount,
					dataType :2,
					displayType : 3,
					fieldLabel : getLabel('depositAmount','Deposit Amount'),
					displayValue1 : amountVal
				});
	}

	var lockBoxOperator = $("select[id='lockBoxNmbrOperator']").val();
	// lockBoxId
	var lockBoxId = '';
	var lockBoxId1 =  $("input[type='text'][id='lockBoxNmbr1']").val();
	if(!Ext.isEmpty(lockBoxId1))
	{
		lockBoxId = lockBoxId1;
	}
	var lockBoxIdVal = $("input[type='text'][id='lockBoxNmbr']").val();
	if (!Ext.isEmpty(lockBoxIdVal)) {
		jsonArray.push({
					field : 'lockBoxId',
					operator : lockBoxOperator,
					value1 : lockBoxIdVal,
					value2 : lockBoxId,
					dataType :2,
					displayType : 3,//3,
					fieldLabel : getLabel('lockBoxId','Store Id/Lockbox'),
					displayValue1 : lockBoxIdVal
				});
	}
	
		
	objJson = jsonArray;
	return objJson;
}
function getAdvancedFilterValueJson(FilterCodeVal) {
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
	// Posting Date
	if (!jQuery.isEmptyObject(selectedPostingDateFilter)) {
		jsonArray.push({
					field : 'postingDate',
					operator : selectedPostingDateFilter.operator,
					value1 : Ext.util.Format.date(
							selectedPostingDateFilter.fromDate, 'Y-m-d'),
					value2 : (!Ext
							.isEmpty(selectedPostingDateFilter.toDate))
							? Ext.util.Format.date(
									selectedPostingDateFilter.toDate,
									'Y-m-d')
							: '',
					dataType : 'D',
					displayType : 6,
					fieldLabel : getLabel('postingDate','Posting Date')
				});
	}
	// Operator
	var ticketOperator = $("select[id='depositTicketOperator']").val();
	// depSlipNmbr
	var depSlipNmbrVal = $("input[type='text'][id='depositTicket']").val();
	var depSlipNmbrVal2 = $("#depositTicket1").val();
	if (!Ext.isEmpty(depSlipNmbrVal)) {
		jsonArray.push({
					field : 'depositTicketNmbr',
					operator : ticketOperator,
					value1 : depSlipNmbrVal,
					value2 : depSlipNmbrVal2,
					dataType : 2,
					displayType : 2,//4,
					fieldLabel : getLabel('depositTicketNmbr','Deposit Ticket'),
					displayValue1 : depSlipNmbrVal
				});
	}
	
	// Operator
	var amountOperator = $("select[id='depositAmountOperator']").val();
	// Amount
	var amountVal = $("input[type='text'][id='depositAmount']").val();
	var amountVal2 = $("#depositAmount1").val();
	if (!Ext.isEmpty(amountVal) && !Ext.isEmpty(amountOperator)) {
		jsonArray.push({
					field : 'depositAmount',
					operator : amountOperator,
					value1 : amountVal,
					value2 : amountVal2==null?'':amountVal2,
					dataType :2,
					displayType : 2,//3,
					fieldLabel : getLabel('depositAmount','Deposit Amount'),
					displayValue1 : amountVal
				});
	}	

	// serialOperator
	var serialOperator = $("select[id='serialOperator']").val();
	// serial
	var serial = $("input[type='text'][id='serial']").val();
	var serialVal2 = $("#serial1").val();
	if (!Ext.isEmpty(serial)) {
		jsonArray.push({
					field : 'serial',
					operator : serialOperator,
					value1 : serial,
					value2 : serialVal2==null?'':serialVal2,
					dataType :2,
					displayType : 2,//3,
					fieldLabel : getLabel('serial','Serial'),
					displayValue1 : serial
				});
	}		
	
	// lockBoxOperator
	var lockBoxOperator = $("select[id='lockBoxNmbrOperator']").val();
	// lockBoxId
	var lockBoxIdVal = $("input[type='text'][id='lockBoxNmbr']").val();
	var lockBoxIdVal2 = $("#lockBoxNmbr1").val();
	if (!Ext.isEmpty(lockBoxIdVal)) {
		jsonArray.push({
					field : 'lockBoxId',
					operator : lockBoxOperator,
					value1 : lockBoxIdVal,
					value2 : lockBoxIdVal2==null?'':lockBoxIdVal2,
					dataType : 2,
					displayType : 2,//3,
					fieldLabel : getLabel('lockBoxId','Store Id/Lockbox'),
					displayValue1 : lockBoxIdVal
				});
	}
	objJson = {};
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
		objJson.filterCode = FilterCodeVal;
	return objJson;
}

function getInstAdvancedFilterQueryJson()
{
	var objJson = null;
	var jsonArray = [];
	
	// instrumentNmbr
	var instrumentNmbrVal = $("input[type='text'][id='instrumentNmbr']").val();
	if (!Ext.isEmpty(instrumentNmbrVal)) {
		jsonArray.push({
					field : 'instrumentNmbr',
					operator : 'eq',
					value1 : instrumentNmbrVal,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	
	// Import Date
	if (!jQuery.isEmptyObject(selectedDepositDate)) {
		jsonArray.push({
					field : 'depositDate',
					operator : selectedDepositDate.operator,
					value1 : Ext.util.Format.date(
							selectedDepositDate.fromDate, 'Y-m-d'),
					value2 : (!Ext
							.isEmpty(selectedDepositDate.toDate))
							? Ext.util.Format.date(
									selectedDepositDate.toDate,
									'Y-m-d')
							: '',
					dataType : 1,
					displayType : 5
				});
	}
	
	// Operator
	var opFilter = $("select[id='depositAmountOperator']").val();
	// Amount
	var amountVal = $("input[type='text'][id='instrumentAmount']").val();
	if (!Ext.isEmpty(amountVal) && !Ext.isEmpty(opFilter)) {
		jsonArray.push({
					field : 'instrumentAmount',
					operator : opFilter,
					value1 : amountVal,
					value2 : '',
					dataType :2,
					displayType : 3
				});
	}		
	
	// depositAccount
	var accountVal = $("input[type='text'][id='depositAccount']").val();
	if (!Ext.isEmpty(accountVal)) {
		jsonArray.push({
					field : 'depositAccount',
					operator : 'eq',
					value1 : accountVal,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	
	// debitAccount
	var debitAccountVal = $("input[type='text'][id='debitAccount']").val();
	if (!Ext.isEmpty(debitAccountVal)) {
		jsonArray.push({
					field : 'debitAccount',
					operator : 'eq',
					value1 : debitAccountVal,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	
	// instrumentStatus
	var instrumentStatusVal = $("input[type='text'][id='instrumentStatus']").val();
	if (!Ext.isEmpty(instrumentStatusVal)) {
		jsonArray.push({
					field : 'instrumentStatus',
					operator : 'eq',
					value1 : instrumentStatusVal,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	// instrumentStatus
	var rtnVal = $("input[type='text'][id='rtn']").val();
	if (!Ext.isEmpty(rtnVal)) {
		jsonArray.push({
					field : 'rtn',
					operator : 'eq',
					value1 : rtnVal,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	
	objJson = jsonArray;
	return objJson;
}
function getInstAdvancedFilterValueJson(FilterCodeVal) {
	var jsonArray = [];
	
	// instrumentNmbr
	var instrumentNmbrVal = $("input[type='text'][id='instrumentNmbr']").val();
	if (!Ext.isEmpty(instrumentNmbrVal)) {
		jsonArray.push({
					field : 'instrumentNmbr',
					operator : 'eq',
					value1 : instrumentNmbrVal,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	
	// Import Date
	if (!jQuery.isEmptyObject(selectedDepositDate)) {
		jsonArray.push({
					field : 'depositDate',
					operator : selectedDepositDate.operator,
					value1 : Ext.util.Format.date(
							selectedDepositDate.fromDate, 'Y-m-d'),
					value2 : (!Ext
							.isEmpty(selectedDepositDate.toDate))
							? Ext.util.Format.date(
									selectedDepositDate.toDate,
									'Y-m-d')
							: '',
					dataType : 1,
					displayType : 5
				});
	}
	
	// Operator
	var opFilter = $("select[id='depositAmountOperator']").val();
	// Amount
	var amountVal = $("input[type='text'][id='instrumentAmount']").val();
	if (!Ext.isEmpty(amountVal)) {
		jsonArray.push({
					field : 'instrumentAmount',
					operator : opFilter,
					value1 : amountVal,
					value2 : '',
					dataType :2,
					displayType : 3
				});
	}		
	
	// depositAccount
	var accountVal = $("input[type='text'][id='depositAccount']").val();
	if (!Ext.isEmpty(accountVal)) {
		jsonArray.push({
					field : 'depositAccount',
					operator : 'eq',
					value1 : accountVal,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	
	// debitAccount
	var debitAccountVal = $("input[type='text'][id='debitAccount']").val();
	if (!Ext.isEmpty(debitAccountVal)) {
		jsonArray.push({
					field : 'debitAccount',
					operator : 'eq',
					value1 : debitAccountVal,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	
	// instrumentStatus
	var instrumentStatusVal = $("input[type='text'][id='instrumentStatus']").val();
	if (!Ext.isEmpty(instrumentStatusVal)) {
		jsonArray.push({
					field : 'instrumentStatus',
					operator : 'eq',
					value1 : instrumentStatusVal,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	// instrumentStatus
	var rtnVal = $("input[type='text'][id='rtn']").val();
	if (!Ext.isEmpty(rtnVal)) {
		jsonArray.push({
					field : 'rtn',
					operator : 'eq',
					value1 : rtnVal,
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


function hideErrorPanel(errorDivId){
	if($(errorDivId).is(':visible')){
		$(errorDivId).addClass('ui-helper-hidden');
	}
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
							text:getLabel('postingDate', 'Posting Date'),
							listeners: {
								render: function(c) {
				    	   			var tip = Ext.create('Ext.tip.ToolTip', {
								            	    target: c.getEl(),
								            	    listeners:{
								            	    	beforeshow:function(tip){
								            	    		if(posting_date_opt === null)
									            	    		tip.update('Posting Date');
									            	    	else
									            	    		tip.update(posting_date_opt);

								            	    	}
								            	    }
				    	   					});
									}	
								}
						},{
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
										//event.removeCls('ui-caret-dropdown'),
										//event.addCls('action-down-hover');
								}
							}
						}
					]	
		});
		return dropDownContainer;
}
function getDateDropDownItems(filterType,buttonIns){		
	var me = this;		
	var intFilterDays = filterDays ? filterDays : '';
	var arrMenuItem = [];
	
	arrMenuItem.push({
				text : getLabel('latest', 'Latest'),
				btnId : 'btnLatest',
				btnValue : '12',
				parent : this,
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
				}
			});
	arrMenuItem.push({
				text : getLabel('today', 'Today'),
				btnId : 'btnToday',
				btnValue : '1',
				parent : this,
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
				}
			});
	if (intFilterDays >= 2 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				});
	if (intFilterDays >= 7 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				});
	if (intFilterDays >= 14 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',
					parent : this,
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				});
	if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',
					parent : this,
					btnValue : '5',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				});
	if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'btnLastmonth',
					btnValue : '6',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				});
	if (intFilterDays >= 90 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				});
	if (intFilterDays >= 180 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('lastQuarterToDate',
							'Last Quarter To Date'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				});
	if (intFilterDays >= 365 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				});
	if (intFilterDays >= 730 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('lastyeartodate', 'Last Year To Date'),
					btnId : 'btnYearToDate',
					parent : this,
					btnValue : '11',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				});
	/*arrMenuItem.push({
				text : getLabel('daterange', 'Date Range'),
				btnId : 'btnDateRange',
				parent : this,
				btnValue : '7',
				handler : function(btn, opts) {
					this.parent.fireEvent('dateChange', btn, opts);

				}
			});*/
			
	
	var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		listeners : {
			hide : function(event) {
				buttonIns.addCls('ui-caret-dropdown');
				buttonIns.removeCls('action-down-hover');
			}
		},
		items : arrMenuItem
	});
	return dropdownMenu;
}
function populateAdvancedFilterFieldValue()
{
	if(isSingleAccount === 'N')
	{			
		setAccountIdAndAccountNumber("#depositAccount");
	}
	else
	{
		setAccountDropDownItems("#depositAccount");
	}
	setProcessingDateDropDownMenu("postingDateDropDown");
	setSavedFilterComboItems('#msSavedFilter');
}
function setSavedFilterComboItems(element){
	$.ajax({
		url : 'services/userfilterslist/depositInqFilter.json',
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
function updateToolTip(filterType,date_option){
	if(filterType === 'postingDate')
		posting_date_opt = date_option;
}
function checkInfinity(intFilterDays)
{
	if(intFilterDays == '0' || Ext.isEmpty(intFilterDays))
		{ 
			return true;
		}		
}