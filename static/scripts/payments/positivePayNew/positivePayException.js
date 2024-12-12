var advFilterJsonArray = new Array();
	advFilterJsonArray.push({
				"key" : "All",
				"value" : "All"
			});
	advFilterJsonArray.push({
				"key" : "0",
				"value" : "New"
			});
	advFilterJsonArray.push({
				"key" : "3",
				"value" : "Approved"
			});
	advFilterJsonArray.push({
				"key" : "4",
				"value" : "Rejected"
			});
	advFilterJsonArray.push({
				"key" : "7",
				"value" : "Aborted"
			});
	advFilterJsonArray.push({
				"key" : "8",
				"value" : "Completed"
			});

function showAdvanceFilterPopup(){
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
		/*buttons :[{
	       	   id: 'advFilterSearch',
	       	   text: 'Search',
	       	   click: function(){
		       		if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
						$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
					}
		       		$(document).trigger("searchActionClicked");
					$(this).dialog("close");
	       	   }
       },{
	       	   id: 'advFilterSaveAndSearch',
	       	   text: 'Save And Search',
	       	   click: function(){
		       		$(document).trigger("saveAndSearchActionClicked");
	       	   }
       },{
	       	   id: 'advFilterClear',
	       	   text: 'Clear',
	       	   click: function(){
	       			$(document).trigger("resetAllFieldsEvent");
	       	   }
       }, {
	       	   id: 'advFilterCancel',
	       	   text: 'Cancel',
	       	   click: function(){
				$(this).dialog("close");
	       	   }
      }],*/
      open:function(){
      	  hideErrorPanel('#advancedFilterErrorDiv');
      	  setCompanyMenuItems('clientSelect');
      	  setActionStatusMenuItems('actionStatus');
      	  $('#advancedFilterPopup').dialog('option', 'position', 'center');
      	filterGridStore();
      },
	  focus :function(){
			
	  },
	  close : function(){
		  $(this).dialog('destroy');		
	  }
	});
	if(''==$("#summaryClientFilter").val() || null==$("#summaryClientFilter").val() || undefined==$("#summaryClientFilter").val())
	{
		$('#clientSelect' + ' option').prop('selected', true);
		$("#clientSelect").multiselect("refresh");		
	}
	$('#advancedFilterPopup').dialog("open");
}

function populateAdvancedFilterFieldValue(){
	setAccountMenuItems('accountSelect');
	setSavedFilterComboItems('#msSavedFilter');
	setActionStatusMenuItems('actionStatus');
	setIssuanceAdvDateDropDownMenu('issuanceAdvDateDropDown');
	if( achPositivePay == 'true' )
	{
		setSecCodeMenuItems('secCode');
		setTxnTypeMenuItems('txnType');
	}
	advancedFilterFieldsDataAdded=true;
}

function setSavedFilterComboItems(element){
	$.ajax({
		url : 'services/userfilterslist/positivepayFilter.json',
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
	} else {
		$('#advFilterSearch').show();
		$('#advFilterSaveAndSearch').show();
		$('#advFilterClear').show();
		$('#advFilterCancel').show();
	}
	$('#tabs').tabs("option", "selected", index);
}
function getAdvancedFilterQueryJson(firstcallFlag) {
	var objJson = null;
	var jsonArray = [];

	//Client
	var clientCodesData =$("select[id='clientSelect']").getMultiSelectValueString(); 	
	if(Ext.isEmpty(clientCodesData) && "" != clientCodesData){
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
	
	//Account
	var accountCodesData =$("select[id='accountSelect']").getMultiSelectValueString(); 	
	var tempAccCodesData=accountCodesData;
	if (!Ext.isEmpty(tempAccCodesData)) {
		if(!Ext.isEmpty(filterAccountDataCount)){
			var accountCodesArray=accountCodesData.split(',');
						
				 if( accountCodesArray.length > 0 )
				{
					 tempAccCodesData = '';
					for( var x = 0; x < accountCodesArray.length; x++)
					{
						tempAccCodesData = tempAccCodesData + accountCodesArray[x];
						
						// following x + 1 condifiotn for adding comma till second last element. 
						if( accountCodesArray.length > x + 1 )
						{
							tempAccCodesData = tempAccCodesData + ',';
		}
					}	
				} 
			
		}
		
		if(tempAccCodesData!='all'){
		jsonArray.push({
						field : 'accountNumber',
					operator : 'in',
						value1 : tempAccCodesData,
					value2 : '',
					dataType : 0,
						displayType : 11,
						detailFilter : 'Y',
						fieldLabel : getLabel('lblAccount','Account'),
						displayValue1 : tempAccCodesData.toString()
				});
		}
	}
	
	if (!jQuery.isEmptyObject(selectedCheckDateFilter)) {
		jsonArray.push({
					field : 'checkdate',
					operator : selectedCheckDateFilter.operator,
					value1 : Ext.util.Format.date(
							selectedCheckDateFilter.fromDate, 'Y-m-d'),
					value2 : (!Ext
							.isEmpty(selectedCheckDateFilter.toDate))
							? Ext.util.Format.date(
									selectedCheckDateFilter.toDate,
									'Y-m-d')
							: '',
					dataType : 1,
					paramFieldLable : getLabel('issueDate', 'Issue Date'),
                    displayType : 5,
                    displayValue1 : selectedCheckDateFilter.fromDate
				});
	}
	
	// checkNmbr
	var descriptionTextVal = $("input[type='text'][id='checkNmbr']").val();
	if (!Ext.isEmpty(descriptionTextVal) && descriptionTextVal!='%') {
		jsonArray.push({
					field : 'checkNmbr',
					operator : 'lk',
					value1 : encodeURIComponent(descriptionTextVal.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 4,
					paramFieldLable : getLabel('checkNmbr', 'Check No.'),
                    displayValue1 : descriptionTextVal
				});
	}
	var blnAutoNumeric = true;
	// Amount 
	var amountFrom=$("#amountFieldFrom").val();
	// jquery autoNumeric formatting
	blnAutoNumeric = isAutoNumericApplied("amountFieldFrom");
	if (blnAutoNumeric)
		amountFrom = $("#amountFieldFrom").autoNumeric('get');
	else
		amountFrom = $("#amountFieldFrom").val();
	// jquery autoNumeric formatting
	if(!Ext.isEmpty(amountFrom)){
		var amountOperator = $("#amountOperator").val();		
		if (!Ext.isEmpty(amountOperator)) {
			jsonArray.push({
						field : 'amount',
						operator : amountOperator,							
						value1 : amountFrom,
						value2 : '',
						dataType : 2,
						displayType : 3,
						paramFieldLable : getLabel('wireAmount', 'Amount'),
	                    displayValue1 : amountFrom
					});
		}
	}
	
	// Decision
	var decision = $("select[id='decision']").val();
	var decisionDesc = $("#decision option:selected").text();	
	if (!Ext.isEmpty(decision)) {
		jsonArray.push({
					field : 'decision',
					operator : 'eq',
					value1 : encodeURIComponent(decision.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 5,
					paramFieldLable :getLabel("decision", "Decision"),
                    displayValue1 :decisionDesc
				});
	}
	
	// Status
	var actionStatusVal = $("select[id='actionStatus']").val();
	var actionStatusdesc = $("#actionStatus option:selected").text();
	if (!Ext.isEmpty(actionStatusVal) && actionStatusVal !== "None") {
	
		 if(actionStatusVal == "3P")
		 {
			jsonArray.push({
					field    : 'status',
					operator : 'eq',
					value1 	 : '3',
					value2   : '',
					paramFieldLable : getLabel('status', 'Status'),
                    displayType : 5,
                    displayValue1 : '3'
				});
			jsonArray.push({
					field    : 'decision',
					operator : 'eq',
					value1 	 : 'P',
					value2   : '',
					paramFieldLable : getLabel("decision", "Decision"),
                    displayType : 5,
                    displayValue1 : 'P'
				});
		     }
			 else  if(actionStatusVal == "3R")
		     {
				 jsonArray.push({
						field    : 'status',
						operator : 'eq',
						value1 	 : '3',
						value2   : '',
						paramFieldLable : getLabel('status', 'Status'),
	                    displayType : 5,
	                    displayValue1 : '3'
					});
				 jsonArray.push({
						field    : 'decision',
						operator : 'eq',
						value1 	 : 'R',
						value2   : '',
						paramFieldLable : getLabel("decision", "Decision"),
	                    displayType : 5,
	                    displayValue1 : 'R'
					});
		     }
			 else
		     {
				/*jsonArray.push({
					field : 'status',
					operator : 'eq',
					value1 : actionStatusVal,
					value2 : '',
					dataType : 0,
					displayType : 5,
					paramFieldLable : getLabel('status', 'Status'),
                    displayValue1 : actionStatusdesc
				});*/
		     	
			 	var actionStatusCodesData =$("select[id='actionStatus']").getMultiSelectValueString(); 	
				var tempActionStatusCodesData = actionStatusCodesData;
				
				var actionStatusDescData = [];
				$('#actionStatus :selected').each(function(i, selected){
					actionStatusDescData[i] = $(selected).text();
				});
				
				if (!Ext.isEmpty(tempActionStatusCodesData)) {
					if(!Ext.isEmpty(filterActionStatusDataCount)){
						var actionStatusCodesArray=actionStatusCodesData.split(',');
						if(filterActionStatusDataCount==actionStatusCodesArray.length)
							tempActionStatusCodesData='all';
					}
					if(tempActionStatusCodesData!='all'){
					jsonArray.push({
								field : 'status',
								operator : 'in',
								value1 : tempActionStatusCodesData,
								value2 : '',
								dataType : 0,
								displayType : 6,
								paramFieldLable :  getLabel('status', 'Status'),
			                    displayValue1 : actionStatusDescData.toString()
							});
					}
				}
			}
	}
	
	// Payee Name
	var payeeTextVal = $("input[type='text'][id='payeeText']").val();
		if (!Ext.isEmpty(payeeTextVal) && payeeTextVal!='%') {
		jsonArray.push({
					field : 'receiverName',
					operator : 'lk',
					value1 : encodeURIComponent(payeeTextVal.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 4,
					paramFieldLable : getLabel('receiverName', 'Payee'),
                    displayValue1 : payeeTextVal
				});
	}
		//ACH PP START
		  if( achPositivePay == 'true' )
		  {
			  var secCodesData =$("select[id='secCode']").getMultiSelectValueString(); 	
			  var tempSecCodesData = secCodesData;
			  var secCodesDataArr = [];
			  
			$('#secCode :selected').each(function(i, selected){
				secCodesDataArr[i] = $(selected).text();
			});
			
			if (!Ext.isEmpty(tempSecCodesData)) {
				if(!Ext.isEmpty(filterSecCodeDataCount)){
					var secCodesArray=secCodesData.split(',');
					if(filterSecCodeDataCount==secCodesArray.length)
						tempSecCodesData='all';
				}
				if(tempSecCodesData!='all'){
				jsonArray.push({
							field : 'secCode',
							operator : 'in',
							value1 : tempSecCodesData,
							value2 : '',
							dataType : 0,
							displayType : 6,
							paramFieldLable :  getLabel('secCode', 'Sec Code'),
		                    displayValue1 : secCodesDataArr.toString()
						});
				}
			}
			
			var txnTypeData =$("select[id='txnType']").getMultiSelectValueString(); 	
		  	var tempTxnTypeData = txnTypeData;
		  	var txnTypeDataArr = [];
			  
			$('#txnType :selected').each(function(i, selected){
				txnTypeDataArr[i] = $(selected).text();
			});
			
			if (!Ext.isEmpty(tempTxnTypeData)) {
				if(!Ext.isEmpty(filterTxnTypeDataCount)){
					var txnTypeArray=txnTypeData.split(',');
					if(filterTxnTypeDataCount==txnTypeArray.length)
						tempTxnTypeData='all';
				}
				if(tempTxnTypeData!='all'){
				jsonArray.push({
							field : 'txnType',
							operator : 'in',
							value1 : tempTxnTypeData,
							value2 : '',
							dataType : 0,
							displayType : 6,
							paramFieldLable :  getLabel('txnType', 'Transaction Type'),
		                    displayValue1 : txnTypeDataArr.toString()
						});
				}
			}
		  }
		  //ACH PP END
	objJson = jsonArray;
	return objJson;
}
function getAdvancedFilterValueJson(FilterCodeVal) {
	var jsonArray = [];
	
	//Client
	var clientCodesData =$("select[id='clientSelect']").getMultiSelectValueString(); 	
	
		jsonArray.push({
					field : 'clientId',
					operator : 'in',
					value1 : clientCodesData,
					value2 : '',
					dataType : 0,
					displayType : 6
				});
		
	
	
	//Account
	var accountCodesData =$("select[id='accountSelect']").getMultiSelectValueString(); 	
	
		jsonArray.push({
					field : 'accountNumber',
					operator : 'in',
					value1 : accountCodesData,
					value2 : '',
					dataType : 0,
					displayType : 6
				});
	
	// Issuance Date	
	/*var issuanceDate = $("input[type='text'][id='issuanceAdvDate']").val();
	if (!Ext.isEmpty(issuanceDate) && issuanceDate!='%') {
		jsonArray.push({
					field : 'checkdate',
					operator : 'eq',
					value1 : Ext.util.Format.date(issuanceDate, 'Y-m-d'),
					value2 : '',
					dataType : 1,
					displayType : 5,
					paramFieldLable : getLabel('issueDate', 'Issue Date'),
                    displayValue1 : Ext.util.Format.date(issuanceDate, 'Y-m-d')
				});
	}*/
	
		if (!jQuery.isEmptyObject(selectedCheckDateFilter)) {
			jsonArray.push({
						field : 'checkdate',
						operator : selectedCheckDateFilter.operator,
						value1 : Ext.util.Format.date(selectedCheckDateFilter.fromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty(selectedCheckDateFilter.toDate))? Ext.util.Format.date(selectedCheckDateFilter.toDate,'Y-m-d'): '',
						dataType : 1,
						paramFieldLable : getLabel('issueDate', 'Issue Date'),
	                    displayType : 5,
	                    displayValue1 : Ext.util.Format.date(
								selectedCheckDateFilter.fromDate, 'Y-m-d')
					});
		}
	// Issuance Date	
	/*if(!jQuery.isEmptyObject(selectedIssuanceDate)){
		jsonArray.push({
					field : 'checkdate',
					operator : selectedIssuanceDate.operator,
					value1 : Ext.util.Format.date(selectedIssuanceDate.fromDate, 'Y-m-d'),
					value2 : (!Ext.isEmpty( selectedIssuanceDate.toDate))? Ext.util.Format.date(selectedIssuanceDate.toDate, 'Y-m-d'): '',
					dataType : 1,
					displayType : 5
				});
	}
	*/
	// checkNmbr
	var descriptionTextVal = $("input[type='text'][id='checkNmbr']").val();
	if (!Ext.isEmpty(descriptionTextVal) && descriptionTextVal!='%') {
		jsonArray.push({
					field : 'checkNmbr',
					operator : 'lk',
					value1 : encodeURIComponent(descriptionTextVal.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 4,
					paramFieldLable : getLabel('checkNmbr', 'Check No.'),
                    displayValue1 : descriptionTextVal
				});
	}
	
	// Amount 
	var amountFrom=$("#amountFieldFrom").val();
	if(!Ext.isEmpty(amountFrom)){
		var amountOperator = $("#amountOperator").val();		
		if (!Ext.isEmpty(amountOperator)) {
			jsonArray.push({
						field : 'amount',
						operator : amountOperator,							
						value1 : amountFrom,
						value2 : '',
						dataType : 2,
						displayType : 3,
						paramFieldLable : getLabel('wireAmount', 'Amount'),
	                    displayValue1 : amountFrom
					});
		}
	}
	
	// Decision
	var decision = $("select[id='decision']").val();
	if (!Ext.isEmpty(decision) && decision !== "None") {
		jsonArray.push({
					field : 'decision',
					operator : 'eq',
					value1 : encodeURIComponent(decision.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 6,
					paramFieldLable : getLabel("decision", "Decision"),
                    displayValue1 : decision
				});
	}
	
	// Status
	var actionStatusVal = $("select[id='actionStatus']").val();
	if (!Ext.isEmpty(actionStatusVal) && actionStatusVal !== "None") {
	
		 if(actionStatusVal == "3P")
		 {
			jsonArray.push({
					field    : 'status',
					operator : 'eq',
					value1 	 : '3',
					value2   : '',
					paramFieldLable : getLabel('status', 'Status'),
                    displayType : 5,
                    displayValue1 : '3'
				});
			jsonArray.push({
					field    : 'decision',
					operator : 'eq',
					value1 	 : 'P',
					value2   : '',
					paramFieldLable : getLabel("decision", "Decision"),
                    displayType : 5,
                    displayValue1 : 'P'
				});
		 }
		 else  if(actionStatusVal == "3R")
		 {
			 jsonArray.push({
					field    : 'status',
					operator : 'eq',
					value1 	 : '3',
					value2   : '',
					paramFieldLable : getLabel('status', 'Status'),
                    displayType : 5,
                    displayValue1 : '3'
				});
			 jsonArray.push({
					field    : 'decision',
					operator : 'eq',
					value1 	 : 'R',
					value2   : '',
					paramFieldLable : getLabel("decision", "Decision"),
                    displayType : 5,
                    displayValue1 : 'R'
				});
		 }
		 else
		 {
			/*jsonArray.push({
				field : 'status',
				operator : 'eq',
				value1 : actionStatusVal,
				value2 : '',
				dataType : 0,
				displayType : 6,
				paramFieldLable : getLabel('status', 'Status'),
                displayValue1 : actionStatusVal
			});*/
		 	
		 	var actionStatusCodesData =$("select[id='actionStatus']").getMultiSelectValueString(); 	
			var tempActionStatusCodesData = actionStatusCodesData;
			
			var actionStatusDescData = [];
			$('#actionStatus :selected').each(function(i, selected){
				actionStatusDescData[i] = $(selected).text();
			});
			
			if (!Ext.isEmpty(tempActionStatusCodesData)) {
				if(!Ext.isEmpty(filterActionStatusDataCount)){
					var actionStatusCodesArray=actionStatusCodesData.split(',');
					if(filterActionStatusDataCount==actionStatusCodesArray.length)
						tempActionStatusCodesData='all';
				}
				if(tempActionStatusCodesData!='all'){
				jsonArray.push({
							field : 'status',
							operator : 'in',
							value1 : tempActionStatusCodesData,
							value2 : '',
							dataType : 0,
							displayType : 6,
							paramFieldLable :  getLabel('status', 'Status'),
		                    displayValue1 : actionStatusDescData.toString()
						});
				}
			}
		}
	}
	
	// Payee Name
	var payeeTextVal = $("input[type='text'][id='payeeText']").val();
		if (!Ext.isEmpty(payeeTextVal) && payeeTextVal!='%') {
		jsonArray.push({
					field : 'receiverName',
					operator : 'lk',
					value1 : encodeURIComponent(payeeTextVal.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 4,
					paramFieldLable : getLabel('receiverName', 'Payee'),
                    displayValue1 : payeeTextVal
				});
	}

		//ACH PP START
		  if( achPositivePay == 'true' )
		  {
			  var secCodesData =$("select[id='secCode']").getMultiSelectValueString(); 	
			  var tempSecCodesData = secCodesData;
			  var secCodesDataArr = [];
			  
			$('#secCode :selected').each(function(i, selected){
				secCodesDataArr[i] = $(selected).text();
			});
			
			if (!Ext.isEmpty(tempSecCodesData)) {
				if(!Ext.isEmpty(filterSecCodeDataCount)){
					var secCodesArray=secCodesData.split(',');
					if(filterSecCodeDataCount==secCodesArray.length)
						tempSecCodesData='all';
				}
				if(tempSecCodesData!='all'){
				jsonArray.push({
							field : 'secCode',
							operator : 'in',
							value1 : tempSecCodesData,
							value2 : '',
							dataType : 0,
							displayType : 6,
							paramFieldLable :  getLabel('secCode', 'Sec Code'),
		                    displayValue1 : secCodesDataArr.toString()
						});
				}
			}
			
			var txnTypeData =$("select[id='txnType']").getMultiSelectValueString(); 	
		  	var tempTxnTypeData = txnTypeData;
		  	var txnTypeDataArr = [];
			  
			$('#txnType :selected').each(function(i, selected){
				txnTypeDataArr[i] = $(selected).text();
			});
			
			if (!Ext.isEmpty(tempTxnTypeData)) {
				if(!Ext.isEmpty(filterTxnTypeDataCount)){
					var txnTypeArray=txnTypeData.split(',');
					if(filterTxnTypeDataCount==txnTypeArray.length)
						tempTxnTypeData='all';
				}
				if(tempTxnTypeData!='all'){
				jsonArray.push({
							field : 'txnType',
							operator : 'in',
							value1 : tempTxnTypeData,
							value2 : '',
							dataType : 0,
							displayType : 6,
							paramFieldLable :  getLabel('txnType', 'Transaction Type'),
		                    displayValue1 : txnTypeDataArr.toString()
						});
				}
			}
		  }
		  //ACH PP END

	objJson = {};
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
		objJson.filterCode = FilterCodeVal;
	return objJson;
}

function setAccountMenuItems(elementId){
	var clientSelVal =$("select[id='clientSelect']").getMultiSelectValueString(); 
	var strTemp = '';
	var strUrl = 'services/positivePayDecAccountList.json?';
	if (!Ext.isEmpty(clientSelVal)) {
			var objArray = clientSelVal.split(',');
			if (objArray.length > 0) {
				if (objArray[0] != 'All') {
					strTemp = strTemp + '(';
					for (var i = 0; i < objArray.length; i++) {
						strTemp = strTemp + ' filterClientCode ' + ' eq ';
						strTemp = strTemp + '\'' + objArray[i] + '\'';
						if (i != objArray.length - 1)
							strTemp = strTemp + ' or ';
					}
					strTemp = strTemp + ')';
				}
			}
			strUrl += '$filter=' + strTemp;
		}
	 var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
	 while (arrMatches = strRegex.exec(strUrl)) {
    	 objParam[arrMatches[1]] = arrMatches[2];
   	 }
   	 var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
     strUrl = strGeneratedUrl;
		
	$.ajax({
		url : strUrl,
		type : 'POST',
		async:false,
		data:objParam,
		success:function(responseData){
			if(!isEmpty(responseData)){
				var data = responseData.d;
				resetAllMenuItemsInMultiSelect(elementId);
				addDataInAccountMultiSelect(elementId, data);
				filterAccountDataCount = data.length;	
			}
		}
	});		
}

function setActionStatusMenuItems(elementId){
	var data = [
		{'CODE' : '0', 'DESCR' : 'New'},
		{'CODE' : '1', 'DESCR' : 'Pending Approval'},
		{'CODE' : '9', 'DESCR' : 'Pending My Approval'},
		{'CODE' : '15', 'DESCR' : 'Decision Pending Submit'},
		{'CODE' : '3', 'DESCR' : 'Action Taken'} /*, -- removed for SP Merging.
		{'CODE' : '7', 'DESCR' : 'Rejected'}*/
	];
	filterActionStatusDataCount = data.length;
	addDataInStatusMultiSelect(elementId, data);
}
function addDataInStatusMultiSelect(elementId,data) {

	var el = $("#"+elementId).multiselect();
	el.attr('multiple',true);
	
	$("#"+elementId + ' option').prop('selected', false);
	$("#"+elementId).multiselect("refresh");	
	var itemArray = $(elementId + " option");
	if (itemArray.length != 0)
	{
			for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
				for (var index = 0; index < itemArray.length; index++) {
					if (data[dataIndex] == itemArray[index].value) {
						$(elementId + " option[value=" + itemArray[index].value
								+ "]").prop("selected", true);
						break;
					}
				}
			}
	}
	else
	{	
	$("#"+elementId).empty();
	for(index=0;index<data.length;index++)
	{
		var opt = $('<option />', {
			value: data[index].CODE,
			text: data[index].DESCR
		});
		opt.appendTo( el );		
	}
	}
	el.multiselect('refresh');

}
function setTxnTypeMenuItems(elementId)
{
	var data = [
		{"CODE" : "CR", "DESCR" : "Credit"},
		{"CODE" : "DR", "DESCR" : "Debit"}
	];
	filterTxnTypeDataCount = data.length;
	addDataInAccountMultiSelect(elementId, data);
}

function setSecCodeMenuItems(elementId)
{
	strUrl = 'services/positivePayList/secCodes.json';	
	$.ajax({
		url : strUrl,
		type : 'POST',
		data:{$top:-1,$client : strClient},
		success:function(responseData){
			if(!isEmpty(responseData)){
				var data = responseData;
				addDataInAccountMultiSelect(elementId, data);
				filterAccountDataCount = data.length;	
			}
		}
	});
}
function addDataInAccountMultiSelect(elementId, data)
{
	var el = $("#"+elementId).multiselect();
	el.attr('multiple',true);
	
	$("#"+elementId + ' option').prop('selected', false);
	$("#"+elementId).multiselect("refresh");	
	var itemArray = $(elementId + " option");
	if (itemArray.length != 0)
	{
			for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
				for (var index = 0; index < itemArray.length; index++) {
					if (data[dataIndex] == itemArray[index].value) {
						$(elementId + " option[value=" + itemArray[index].value
								+ "]").prop("selected", true);
						break;
					}
				}
			}
	}
	else
	{	
	$("#"+elementId).empty();
	for(index=0;index<data.length;index++)
	{
		var opt = $('<option />', {
			value: data[index].CODE,
			text: data[index].DESCR
		});
		opt.appendTo( el );		
	}
	}
	el.multiselect('refresh');
}

function setTxnTypeMenuItems(elementId)
{
	var data = [
		{"CODE" : "CR", "DESCR" : "Credit"},
		{"CODE" : "DR", "DESCR" : "Debit"}
	];
	filterTxnTypeDataCount = data.length;
	addDataInSecCodeAndTxnTypeMultiSelect(elementId, data);
}

function setSecCodeMenuItems(elementId)
{
	strUrl = 'services/positivePayList/secCodes.json';	
	$.ajax({
		url : strUrl,
		type : 'POST',
		data:{$top:-1,$client : strClient},
		success:function(responseData){
			if(!isEmpty(responseData)){
				var data = responseData;
				addDataInSecCodeAndTxnTypeMultiSelect(elementId, data);
				filterAccountDataCount = data.length;	
			}
		}
	});
}

function addDataInAccountMultiSelect(elementId, data)
{
	var el = $("#"+elementId).multiselect();
	el.attr('multiple',true);
	
	$("#accountSelect" + ' option').prop('selected', false);
	$("#accountSelect").multiselect("refresh");	
	var itemArray = $(elementId + " option");
	if (itemArray.length != 0)
	{
			for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
				for (var index = 0; index < itemArray.length; index++) {
					if (data[dataIndex] == itemArray[index].value) {
						$(elementId + " option[value=" + itemArray[index].value
								+ "]").prop("selected", true);
						break;
					}
				}
			}
	}
	else
	{	
	$("#accountSelect").empty();
	for(index=0;index<data.length;index++)
	{
		var opt = $('<option />', {
			value: data[index].filterCode,
			text: data[index].filterValue+" | "+data[index].additionalValue1
		});
		opt.attr('selected','selected');
		opt.appendTo( el );		
	}
	}
	el.multiselect('refresh');
}

function addDataInSecCodeAndTxnTypeMultiSelect(elementId, data)
{
	var el = $("#"+elementId).multiselect();
	el.attr('multiple',true);
	
	$("#"+elementId + ' option').prop('selected', false);
	$("#"+elementId).multiselect("refresh");	
	var itemArray = $(elementId + " option");
	if (itemArray.length != 0)
	{
			for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
				for (var index = 0; index < itemArray.length; index++) {
					if (data[dataIndex] == itemArray[index].value) {
						$(elementId + " option[value=" + itemArray[index].value
								+ "]").prop("selected", true);
						break;
					}
				}
			}
	}
	else
	{	
	$("#"+elementId).empty();
	for(index=0;index<data.length;index++)
	{
		var opt = $('<option />', {
			value: data[index].CODE,
			text: data[index].CODE+" | "+data[index].DESCR
		});
		opt.appendTo( el );		
	}
	}
	el.multiselect('refresh');
}

function resetAllMenuItemsInMultiSelect(elementId)
{
	$(elementId).empty();
	$(elementId+' option').prop('selected', true);
	$(elementId).multiselect("refresh");
}
function hideErrorPanel(errorDivId){
	if($(errorDivId).is(':visible')){
		$(errorDivId).addClass('ui-helper-hidden');
	}
}
function showPositivePayViewPopUp(record)
{
	$('#positivePayView').dialog({
		autoOpen : false,
		maxHeight: 580,
		minHeight: (screen.width) > 1024 ? 156 : 0 ,
		width : 840,
		modal : true,
		resizable: false,
		draggable: false,
		/*buttons :[{
	       	   id: 'btnPay',
	       	   text: 'Pay',
	       	   click: function(){
		       		GCP.getApplication().fireEvent('callDecision', 'btnPay' );
	       	   }
          },{
	       	   id: 'btnReturn',
	       	   text: 'Return',
	       	   click: function(){
		       		GCP.getApplication().fireEvent('callDecision', 'btnReturn' );
	       	   }
          },{
	       	   id: 'btnReport',
	       	   text: 'Report',
	       	   click: function(){
		       		GCP.getApplication().fireEvent('showReport', 'btnReport' );
	       	   }
          },{
	       	   id: 'btnCancel',
	       	   text: 'Cancel',
	       	   click: function(){
		       		$(this).dialog("close");
	       	   }
          }],*/
		open: function() {
			/*$("#account").attr('value', record.get('accountNmbr') + '|'+record.get('accountName'));
			$("#instNmbr").attr('value', record.get('instNmbr'));
			if(record.get('amount') != null )
			{
				$("#amount").attr('value', "$"+ record.get('amount'));
			}
			else
			{
				$("#amount").attr('value', "0.00");
			}
			$("#checkDate").attr('value', record.get('instDate') );
			$("#payee").attr('value', record.get('beneficiaryName'));
			$("#exceptionReason").attr('value', record.get('exceptionReason'));
			$("#decisionStatus").attr('value',  record.get('decisionStatus'));
			
			if(record.get('decision')!= null && record.get('decision') === 'P')
			{
				$("#decisionVal").attr('value', "Pay");
			}
			else if(record.get('decision')!= null && record.get('decision') === 'R')
			{
				$("#decisionVal").attr('value', "Return");
			}	
			if(record.get('defaultAction')!= null && record.get('defaultAction') === 'P')
			{
				$("#defaultDecision").attr('value', "Pay");
			}
			else if(record.get('defaultAction')!= null && record.get('defaultAction') === 'R')
			{
				$("#defaultDecision").attr('value', "Return");
			}
			
			$("#decisionReason").attr('value', record.get('decisionReason'));
			$("#fileImportDate").attr('value', record.get('fileImportDate'));*/
			
			$("#account").text( record.get('accountNmbr') + '|'+record.get('accountName'));
			$("#account").prop('title',record.get('accountNmbr') + '|'+record.get('accountName'));
			
			$("#instNmbr").text(record.get('instNmbr'));
			$("#instNmbr").prop('title',record.get('instNmbr'));
			
			if(record.get('amount') != null )
			{
				$("#amount").text("$"+ record.get('amount'));
				$("#amount").prop('title',"$"+ record.get('amount'));
			}
			else
			{
				$("#amount").prop('title',"0.00");
				$("#amount").text("0.00");
			}

			$("#checkDate").text(record.get('instDate') );
			$("#checkDate").prop('title', record.get('instDate') );
			
			$("#payee").text(record.get('beneficiaryName'));
			$("#payee").prop('title', record.get('beneficiaryName'));
			
			$("#exceptionReason").text(record.get('exceptionReason'));
			$("#exceptionReason").prop('title', record.get('exceptionReason'));
			
			$("#decisionStatus").text(record.get('decisionStatus'));
			$("#decisionStatus").prop('title',  record.get('decisionStatus'));
			
			if(record.get('decision')!= null && record.get('decision') === 'P')
			{
				$("#decisionVal").text("Pay");
				$("#decisionVal").prop('title', "Pay");
			}
			else if(record.get('decision')!= null && record.get('decision') === 'R')
			{
				$("#decisionVal").text("Return");
				$("#decisionVal").prop('title', "Return");
				
			}	
			else if(record.get('decision')!= null && record.get('decision') === 'N')
			{
				$("#decisionVal").text("");
				$("#decisionVal").prop('title', "");
				
			}	
			if(record.get('defaultAction')!= null && record.get('defaultAction') === 'P')
			{
				$("#defaultDecision").text("Pay");
				$("#defaultDecision").prop('title', "Pay");
			}
			else if(record.get('defaultAction')!= null && record.get('defaultAction') === 'Pay')
			{
				$("#defaultDecision").text("Pay");
				$("#defaultDecision").prop('title',"Pay");
			}
			else if(record.get('defaultAction')!= null && record.get('defaultAction') === 'R')
			{
				$("#defaultDecision").text("Return");
				$("#defaultDecision").prop('title',"Return");
			}			
			else if(record.get('defaultAction')!= null && record.get('defaultAction') === 'Return')
			{
				$("#defaultDecision").text("Return");
				$("#defaultDecision").prop('title',"Return");
			}				
			else if(record.get('defaultAction')!= null && record.get('defaultAction') === 'None')
			{
				$("#defaultDecision").text("None");
				$("#defaultDecision").prop('title',"None");
			}
			
			$("#decisionReason").text(record.get('decisionReason'));
			$("#decisionReason").prop('title', record.get('decisionReason'));
			
			$("#fileImportDate").text(record.get('fileImportDate'));
			$("#fileImportDate").prop('title', record.get('fileImportDate'));
			//ACH PP START
			if( achPositivePay == 'true' )
			{
				$("#companyId").text(record.get('companyId'));
				$("#secCodeView").text(record.get('secCode'));
				$("#transactionType").text(record.get('txnType'));
			}
			//ACH PP END
			
			//ACH PP START
			if( achPositivePay == 'true' )
			{
				$("#companyId").text(record.get('companyId'));
				$("#secCodeView").text(record.get('secCode'));
				$("#transactionType").text(record.get('txnType'));
			}
			//ACH PP END
			
			GCP.getApplication().fireEvent('showHideBtn', record, $("#btnPay"), $("#btnReturn") );
		 }
	});
	$('#positivePayView').dialog("open");
	$('#positivePayView').dialog('option','position','center');
	$('#accountDiv').focus();
}

function showPositivePayViewIssuePopUp(record)
{
	$('#positivePayViewIssue').dialog({
		autoOpen : false,
		maxHeight: 580,
		minHeight: (screen.width) > 1024 ? 156 : 0 ,
		width : 840,
		modal : true,
		resizable: false,
		draggable: false,
		open: function() {
			
			$("#accountIssed").text("");
			$("#serialNumber").text("");
			$("#amountIssued").text('0.00');
			$("#issuanceDate").text("");
			$("#payeeName").text("");
			$("#issueDescription").text("");
			$("#clientDescription").text("");
			$("#issueType").text("");
			$("#issueStatus").text("");
			
			if(record != "" && record != null && record != undefined)
				{
				
			if(record.ACCOUNTNMBR != null  && record.ACCOUNTNMBR != "" ){
				$("#accountIssed").text(record.ACCOUNTNMBR + '|' +record.ACCOUNTNAME);
				$("#accountIssed").attr('title', $("#accountIssed").text());}
			else
				$("#accountIssed").text("");
			$('#serialNumber').text(record.SERIALNUMBER);
			$("#serialNumber").attr('title', $("#serialNumber").text());
			if(record.AMOUNT != null && record.AMOUNT != "" )
			{
				$('#amountIssued').text(record.AMOUNT);
				$("#amountIssued").attr('title', $("#amountIssued").text());
			}
			else
			{
				$('#amountIssued').text('0.00');
			}

			$('#issuanceDate').text(record.ISSUANCEDATE);
			$("#issuanceDate").attr('title', $("#issuanceDate").text());
			$('#payeeName').text(record.PAYEENAME);
			$("#payeeName").attr('title', $("#payeeName").text());
			$('#issueDescription').text(record.DESCRIPTION);
			$("#issueDescription").attr('title', $("#issueDescription").text());
			$('#clientDescription').text(record.CLIENTDESCRIPTION);
			$("#clientDescription").attr('title', $("#clientDescription").text());
			$('#issueType').text(record.ISSUETYPE);
			$("#issueType").attr('title', $("#issueType").text());
			$('#issueStatus').text(record.ISSUESTATUS);
			$("#issueStatus").attr('title', $("#issueStatus").text());
		}
		 }
	});
	$('#positivePayViewIssue').dialog("open");
	$('#positivePayViewIssue').dialog('option','position','center');
	$('#accountDiv').focus();
}

function showPositivePayBenePopUp(beneName,beneAccountNmbr,fromBeneAmount,beneStatus,identifier)
{
	$('#beneficiaryPopUp').dialog({
		autoOpen : false,
		width : 500,
		modal : true,
		/*buttons :[{
	       	   id: 'btnCancel',
	       	   text: 'Cancel',
	       	   click: function(){
		       		$(this).dialog("close");
	       	   }
          },{
	       	   id: 'btnSave',
	       	   text: 'Save',
	       	   click: function(){
					$(document).trigger("handleBeneSaveAction");
	       	   }
          }],*/
		open: function() {
			$("#beneAccountNmbr").attr('value',beneAccountNmbr);
			$("#beneName").attr('value', beneName);
			$("#decisionNmbr").attr('value', identifier);
			if(fromBeneAmount != null && fromBeneAmount != "")
			{
				$("#beneAmount").attr('value', "$"+fromBeneAmount);
			}
			else
			{
				$("#beneAmount").attr('value', "0.00");
			}
		 }
	});
	$('#beneficiaryPopUp').dialog("open");
}
function showReturnReasonPopUp(type)
{
	$('#returnReasonPopUp').dialog({
		autoOpen : false,
		width : 350,
		modal : true,
		/*buttons :[{
	       	   id: 'btnCancel',
	       	   text: 'Cancel',
	       	   click: function(){
		       		$(this).dialog("close");
	       	   }
          },{
	       	   id: 'btnSave',
	       	   text: 'Save',
	       	   click: function(){
					$(document).trigger("handleReturnReason");
	       	   }
          }],*/
		open: function() {
			setReturnReasonDropdownValues('#decisionReasons',type);
		 }
	});
	$('#returnReasonPopUp').dialog("open");
}
function setReturnReasonDropdownValues(elementId,type)
{
	$(elementId).empty();
	$(elementId).append('<option>Select</option>');
	var temp = arrDecisionReasons;
	if(type == 'ACH')
		temp = arrAchDecisionReasons;
	for (var i = 0; i < temp.length; i++) {
		var opt = $('<option />', {
							value : temp[i].code,
							text  : temp[i].description
						});
				opt.appendTo(elementId);
	};
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
	var filterCorp = strClient;
	if(onBehalf)
	{ 
		//if( me.clientFilterVal == 'all' || me.clientFilterVal == '' || me.clientFilterVal == undefined)
		if( $('#summaryClientFilter').val() == 'all' || $('#summaryClientFilter').val() == '' || $('#summaryClientFilter').val() == undefined)
		{
			resetClient();
		}
		else
		{
			switchClient(selectedFilterClient);
		}
		filterCorp = "";
	}
	
	var strUrl = null;
			strUrl = 'services/userseek/posPayExcClient.json';
	
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
				setAccountMenuItems('accountSelect');
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
function setResetCompanyMenuItems()
{
	var el = $("#clientSelect").multiselect();
	el.attr('multiple',true);
	
	$("#clientSelect" + ' option').prop('selected', false);
	$("#clientSelect").multiselect("refresh");
	if( selectedFilterClient != 'all' && selectedFilterClient != '' && selectedFilterClient != undefined)
	{
		$("#clientSelect option[value="+selectedFilterClient+"]").prop("selected", true);
		$("#clientSelect").multiselect("refresh");
		setAccountMenuItems('accountSelect');
	}	
	else
	{
		$("#clientSelect option").prop('selected', false);
		$("#clientSelect").multiselect("refresh");				
	}
}


function setIssuanceAdvDateDropDownMenu(renderToElementId){
    var dropDownContainer=Ext.create('Ext.Container', {
            itemId : 'CreationDateContainer',
            renderTo:renderToElementId,
            items : [{
                            xtype : 'label',
                            forId : "issunceDateAdvLabel",
                            text:getLabel('issunceDateAdvLbl', 'Issuance Date'),
                            listeners: {
                                render: function(c) {
                                    var tip = Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        listeners: {
                                            beforeshow: function(tip) {
                                                if(issue_date_opt === null) {
                                                    tip.update('Issuance Date');
                                                } else {
                                                    tip.update('Issuance Date' + issue_date_opt);
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        },{
                            xtype : 'button',
                            border : 0,
                            itemId : 'issunceDateAdvButton',
                            cls : 'ui-caret-dropdown',
                            listeners : {
                                click:function(event){
                                        var menus=getDateDropDownItems("issuanceAdvDate",this);
                                        var xy=event.getXY();
                                        menus.showAt(xy[0],xy[1]+16);
                                        event.menu=menus;
                                        event.removeCls('ui-caret-dropdown'),
                                        event.addCls('action-down-hover');
                                }
                            }
                        }
                    ]
        });
        return dropDownContainer;
}

function getDateDropDownItems(filterType,buttonIns){
    var me = this;
            var intFilterDays = !Ext.isEmpty(filterDays)
            ? parseInt(filterDays)
            : '';
            var arrMenuItem = [/*{
                        text : getLabel('latest', 'Latest'),
                        btnId : 'latest',
                        btnValue : '12',
                        handler : function(btn, opts) {
                            $(document).trigger("filterDateChange",[filterType,btn,opts]);
                            updateToolTip(filterType," (Latest)");
                        }
                    }*/];
            if( filterType == 'issuanceDate' || filterType == 'issuanceAdvDate')
            {
                arrMenuItem.push({
                    text : getLabel('latest', 'Latest'),
                    btnId : 'latest',
                    btnValue : '15',
                    handler : function(btn, opts) {
                        $(document).trigger("filterDateChange",[filterType,btn,opts]);
                        updateToolTip(filterType," (Latest)");
                    }
                });         
            }
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
                        text : getLabel('lastMonthToDate', 'Last Month To Date'),
                        btnId : 'btnLastmonth',
                        btnValue : '6',
                        handler : function(btn, opts) {
                            $(document).trigger("filterDateChange",[filterType,btn,opts]);
                            updateToolTip(filterType," (Last Month To Date)");
                        }
                    });
             if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
               arrMenuItem.push({
                        text : getLabel('lastmonthonly', 'Last Month Only'),
                        btnId : 'btnLastmonthonly',
                        btnValue : '14',
                        handler : function(btn, opts) {
                            $(document).trigger("filterDateChange",[filterType,btn,opts]);
                            updateToolTip(filterType," (Last Month Only)");
                        }});
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
                arrMenuItem.push({
                        text : getLabel('thisyear', 'This Year'),
                        btnId : 'btnLastQuarterToDate',
                        btnValue : '10',
                        handler : function(btn, opts) {
                            $(document).trigger("filterDateChange",[filterType,btn,opts]);
                            updateToolTip(filterType," (This Year)");
                        }
                    });
            if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
                arrMenuItem.push( {
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
            listeners : {
                    hide:function(event) {
                        buttonIns.addCls('ui-caret-dropdown');
                        buttonIns.removeCls('action-down-hover');
                    }
                },  
            items :arrMenuItem
        });
        return dropdownMenu;
    }

function updateToolTip(filterType,date_option){
    if(filterType === 'issuanceAdvDate')
        issue_date_opt = date_option;
}