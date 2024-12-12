/*Advance Filter Popup handling:start*/
function showAdvanceFilterPopup(){
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight: 580,
		minHeight:(screen.width) > 1024 ? 156 : 0,
		width : 845,
		resizable: false,
		draggable: false,
		modal : true,
		dialogClass: 'ft-dialog',
       open:function(){
       	   hideErrorPanel('#advancedFilterErrorDiv');
       	   $('#advancedFilterPopup').dialog('option', 'position', 'center');
	    	$('#paymentDueDateAdv').datepick({
				monthsToShow : 1,
				changeMonth : false,
				rangeSeparator : '  to  ',
				onClose : function(dates) {
					if (!Ext.isEmpty(dates)) {
						$(document).trigger("datePickPopupSelectedDate",
								["paymentDueDateAdv", dates]);
					}
				}
			}).attr('readOnly', true);
	 		setDataToObligorId("#obligorIDAdvFilter");
	    	setDataToObligationId("#obligationIDAdvFilter", '');
	    	$('input[id="obligorIDAdvFilter"]').hover(function() {
	    		$(this).attr('title', $(this).val()); 
	    		});
    	   }
       });
	$('#advancedFilterPopup').dialog("open");
	$('#requestedAmntAdvFilter').removeAttr("placeholder");
	$('#operatorAmntAdvFilter').niceSelect();
	$('#operatorAmntAdvFilter').niceSelect('update');

}

function populateAdvancedFilterFieldValue()
{
	setStatusDropDownItems("#statusAdvFilter");
	setSavedFilterComboItems('#msSavedFilter');
	setEntryDateDropDownMenu('entryDateDropDown');
}
function setSavedFilterComboItems(element){
	$.ajax({
		url : 'services/userfilterslist/' +(isSiTabSelected == 'Y' ? 'loanCenterSiAdvFltr.srvc' : 'loanCenterTxnAdvFltr.srvc'),
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

function paintError(errorDiv,errorMsgDiv,errorMsg){
	if(!$(errorDiv).is(':visible')){
		$(errorDiv).removeClass('ui-helper-hidden');
	}
	$(errorMsgDiv).text(errorMsg);
}
function hideErrorPanel(errorDivId){
	if($(errorDivId).is(':visible')){
		$(errorDivId).addClass('ui-helper-hidden');
	}
}
function setDataToObligorId(elementId){
	var strUrl;
	if(GranularPermissionFlag == 'Y')
	{
			if(isSiTabSelected == 'Y')
				strUrl = 'services/userseek/loanCenterClientObligorIDSiGranularSeek.json';
			else
	 			strUrl = 'services/userseek/loanCenterClientObligorIDGranularSeek.json';
	}
	else
	 strUrl = 'services/userseek/loanCenterClientObligorIDSeek.json';
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				
				$.ajax({
					url :strUrl,
					type:'POST',
					data : {$autofilter : request.term},
					success : function(data) {
						$('#obligorIDAdvFilter').attr('optionSelected',false);
						if(!isEmpty(data)&&!(isEmpty(data.d))){
							var rec = data.d.preferences;
							obligorIdRes = rec;
							response($.map(rec, function(item) {
								return {
									value : item.DESCRIPTION,
									label : item.DESCRIPTION,
									code : item.CODE
									}
							}));	
						}
					}
				});
			},
			focus: function( event, ui ) {
				$(".ui-autocomplete > li").attr("title", ui.item.label);
			},
			select: function( event, ui )
			{
				$('#obligorIDAdvFilter').attr('optionSelected',true);
				$('#obligationIDAdvFilter').val("");
				setDataToObligationId( "#obligationIDAdvFilter", ui.item.code );
				getAdvFilterObligationId(ui.item.code);
				if(obligationIDlist.length == 1){
						for(res in obligationIDlist)
						{
							code = obligationIDlist[res].CODE;
							desc = obligationIDlist[res].DESCRIPTION ;
						}
						selectedObligationId= code;
						$('#obligationIDAdvFilter').val(desc);
					}
				
				
			},
			change: function( event, ui )
			{ 
				if( $('#obligationIDAdvFilter').val()== '')
				{
					$('#obligationIDAdvFilter').val("");
					setDataToObligationId("#obligationIDAdvFilter",'');
				}
			}
		 });/*.data("autocomplete")._renderItem = function(ul, item) {
					var inner_html = '<a><ol class="t7-autocompleter"><ul>'
							+ item.label + '</ul></ol></a>';
					return $("<li></li>").data("item.autocomplete", item)
							.append(inner_html).appendTo(ul);
		};*/
}
function setDataToObligationId(elementId, obligorIdValue)
{
	
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
			strUrl = 'services/userseek/loanCenterClientObligationIDSeek.json?$filtercode1=' + obligorIdValue;
			$.ajax({
					url :strUrl,
					type:'POST',
					data : {$autofilter : request.term},
					success : function(data) {
						$('#obligationIDAdvFilter').attr('optionSelected',false);
						if(!isEmpty(data)&&!(isEmpty(data.d))){
							var rec = data.d.preferences;
							obligationIdRes = rec;
							response($.map(rec, function(item) {
								return {
									label : item.DESCRIPTION,
									value : item.DESCRIPTION,
									itemCode : item.CODE
									}
							}));	
						}
					}
				});
			},
			focus: function( event, ui ) {
				$(".ui-autocomplete > li").attr("title", ui.item.label);
			},
			select: function (event, ui) {
				$('#obligationIDAdvFilter').attr('optionSelected',true);
					selectedObligationId = ui.item.itemCode;
					$('#obligationIDAdvFilter').prop('title',ui.item.value);
					//$(elementId).val(ui.item.label);
				return true;
			},
			change : function() {
				if($('#obligationIDAdvFilter').val() == "")
				{
					$('#obligationIDAdvFilter').prop('title','');
				}
			}
		 });/*.data("autocomplete")._renderItem = function(ul, item) {
					var inner_html = '<a><ol class="t7-autocompleter"><ul>'
							+ item.label + '</ul></ol></a>';
					return $("<li></li>").data("item.autocomplete", item)
							.append(inner_html).appendTo(ul);
		};*/
}
function setFieldToolTip(elementId)
{
	var obligationId = $('#'+elementId).val();
	if(obligationId == "")
	{
		$('#obligationIDAdvFilter').prop('title','');
	}
	
}
function setStatusDropDownItems(elementId) {
	var el = $(elementId).multiselect();
	el.attr('multiple',true);
	var statusArray = arrStatusFilter;
	for (var index = 0; index < statusArray.length; index++) {
		var opt = $('<option />', {
					value : statusArray[index].key,
					text : statusArray[index].value
				});
		opt.appendTo(elementId);		
	}
	el.multiselect('refresh');
	filterStatusCount=statusArray.length;
}

function getAdvancedFilterValueJson(FilterCodeVal) {
	var objJson = {};
	var jsonArray = [];
	
	//Reference
	var requestReferenceAdvFilter=$('#requestReferenceAdvFilter').val();
	if( !isEmpty(requestReferenceAdvFilter)){
			jsonArray.push(
			{
				field : 'requestReference',
				operator : 'eq',
				value1 : encodeURIComponent(requestReferenceAdvFilter.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			} );
	}
	//ObligorId
	var obligorID=$('#obligorIDAdvFilter').val();
	if( !isEmpty(obligorID)&&obligorID!='%'&&obligorID!='All'){
			jsonArray.push(
			{
				field : 'obligorID',
				operator : 'eq',
				value1 : encodeURIComponent(obligorID.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			} );
	}
	//ObligationId	
	var obligationIDAdvFilter=$('#obligationIDAdvFilter').val();
	if( !Ext.isEmpty( selectedObligationId)&&selectedObligationId!='All'){
			jsonArray.push(
			{
				field : 'obligationID',
				operator : 'eq',
				value1 : encodeURIComponent(selectedObligationId.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
				value2 : obligationIDAdvFilter
			});
	}
	//Account Name	
	var accountNameAdvFilter=$('#accountNameAdvFilter').val();
	if( !isEmpty(accountNameAdvFilter)){
			jsonArray.push(
			{
				field : 'accountName',
				operator : 'eq',
				value1 : encodeURIComponent(accountNameAdvFilter.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			} );
	}
	//Amount
	var loanAmount = 0;
	var blnAutoNumeric = isAutoNumericApplied('requestedAmntAdvFilter');
	if (blnAutoNumeric)
		loanAmount = $("#requestedAmntAdvFilter").autoNumeric('get');
	else
		loanAmount = $("#requestedAmntAdvFilter").val();
	
	if( !Ext.isEmpty( loanAmount ) )
	{
		var amountOptFilter =$("#operatorAmntAdvFilter").val();
		jsonArray.push(
		{
			field : 'requestedAmnt',
			operator : amountOptFilter,
			value1 : encodeURIComponent(loanAmount.replace(new RegExp("'", 'g'), "\''")),
			value2 : ''
		} );
	}
	//Status	
	var statusFilter = $("#statusAdvFilter").getMultiSelectValue();
	var statusValueDesc = [];
	$('#statusAdvFilter :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});

	var statusValueString=statusFilter.join("and");
	var tempStatusValue;
	if (!Ext.isEmpty(statusValueString)) {
		if(!Ext.isEmpty(filterStatusCount)){
			var statusValueArray=statusValueString.split("and");
			 tempStatusValue=statusValueArray;
			 tempStatusValue=statusValueArray.join(',');
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
		}
			if (!Ext.isEmpty(tempStatusValue) && tempStatusValue != 'All') {
				if( isSiTabSelected == 'Y' )
				{
					var siTemp1='';
					var siTempStatVal = '';
					var temp1='';
					var tempStatVal = '';
					
					for (j=0; j<statusFilter.length; j++)
					{
						var temp = statusFilter[j];	
						temp = temp.split( "." );
						siTemp1 = siTemp1 + temp[0].split( "." );
						siTemp1 = siTemp1 + temp[1].split( "." )+"^";
						if( temp.length == 3 )
						{	
							temp1 = temp1 + temp[2].split( "." )+",";
						}	
						siTempStatVal = siTemp1.substring(0, siTemp1.length-1);
						tempStatVal = temp1.substring(0, temp1.length-1);
					}
					
					if( !Ext.isEmpty( statusFilter ) && statusFilter != 'All' )
					{
						jsonArray.push(
						{
							field : 'siReqStateValidFlag',
							operator : 'in',
							value1 : siTempStatVal,
							value2 : '',
							dataType : 'S',
							displayType :5,
							fieldLabel : getLabel('lblstatus','Status'),
							displayValue1 : statusValueDesc				
						} );
						if( tempStatVal == 'A' )
						{
							jsonArray.push(
							{
								field : 'makerId',
								operator : 'ne',
								value1 : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
								value2 : '',
								dataType : 0,
								displayType :0
							} );
						}

					}
				}
				else
				{
					var siTemp1='';
					var siTempStatVal = '';
					var temp1='';
					var tempStatVal = '';
									
					for (j=0; j<statusFilter.length; j++)
					{
						var temp = statusFilter[j];	
						temp = temp.split( "." );
						siTemp1 = siTemp1 + temp[0].split( "." )+"^";
						if( temp.length == 2 )
						{	
							temp1 = temp1 + temp[1].split( "." )+",";
						}
						siTempStatVal = siTemp1.substring(0, siTemp1.length-1);
						tempStatVal = temp1.substring(0, temp1.length-1);
						
					}
					if( !Ext.isEmpty( statusFilter ) && statusFilter != 'All' )
					{
						if( tempStatVal == 'A')
						{
							jsonArray.push(
							{
								field : 'requestStatus',
								operator : 'in',
								value1 : siTempStatVal,
								value2 : '',
								dataType : 'S',
								displayType :5,
								fieldLabel : getLabel('lblstatus','Status'),
								displayValue1 : statusValueDesc
							} );

							jsonArray.push(
							{
								field : 'makerId',
								operator : 'ne',
								value1 : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
								value2 : '',
								dataType : 0,
								displayType :0
							} );
						}
						else if( tempStatVal == 'P' )
						{
							jsonArray.push(
							{
								field : 'requestStatus',
								operator : 'in',
								value1 : siTempStatVal,
								value2 : '',
								dataType : 'S',
								displayType :5,
								fieldLabel : getLabel('lblstatus','Status'),
								displayValue1 : statusValueDesc
							} );

							jsonArray.push(
							{
								field : 'makerId',
								operator : 'eq',
								value1 : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
								value2 : '',
								dataType : 0,
								displayType :0
							} );
						}				
						else
						{
							jsonArray.push(
							{
								field : 'requestStatus',
								operator : 'in',
								value1 : siTempStatVal,
								value2 : '',
								dataType : 'S',
								displayType :5,
								fieldLabel : getLabel('lblstatus','Status'),
								displayValue1 : statusValueDesc
								} );
						}
					}
				}
			}	
		}
		
	// Entry Date
	if(!jQuery.isEmptyObject(selectedEntryDate)) {
		jsonArray.push({
			field : isSiTabSelected == 'Y' ? 'requestDate' : 'requestDate',
			operator : selectedEntryDate.operator,
			value1 : Ext.util.Format.date(Ext.Date.parse(selectedEntryDate.fromDate,'Y-m-d'), 'Y-m-d'),
			value2 : (!Ext.isEmpty( selectedEntryDate.toDate))? Ext.util.Format.date(Ext.Date.parse(selectedEntryDate.toDate,'Y-m-d'), 'Y-m-d'): '',
			dropdownLabel : selectedEntryDate.dateLabel	
			//dataType : 1,
			//displayType : 6,//5,
			//fieldLabel : getLabel('lblreqdate', 'Request Date')
		});
	}
	objJson.filterBy = jsonArray;
	if( FilterCodeVal && !isEmpty( FilterCodeVal ))
		objJson.filterCode = FilterCodeVal;
	return objJson;
}

function getAdvancedFilterQueryJson() {
	var objJson = {};
	var jsonArray = [];
	//Reference
	var requestReferenceAdvFilter=$('#requestReferenceAdvFilter').val();
	if(!isEmpty(requestReferenceAdvFilter)){
			jsonArray.push(
			{
				field : 'requestReference',
				operator : 'lk',
				value1 : encodeURIComponent(requestReferenceAdvFilter.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
				value2 : '',
				dataType : 0,
				displayType : 0,
				fieldLabel : getLabel('lblReference','Request Reference'),
				displayValue1 : requestReferenceAdvFilter
			} );
	}
	//ObligorId
	var obligorID=$('#obligorIDAdvFilter').val().split('|')[0].trim();
	var obligorIdDesc=$('#obligorIDAdvFilter').val();
	if( !isEmpty(obligorID)&&obligorID!='%'&&obligorID!='All'){
			jsonArray.push(
			{
				field : 'obligorID',
				operator : 'eq',
				value1 : encodeURIComponent(obligorID.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
				value2 : '',
				dataType : 0,
				displayType : 0,
				fieldLabel : getLabel('lblobligorID','Obligor ID'),
				displayValue1 : obligorIdDesc
			} );
	}
	//Obligation ID
	var obligationIDAdvFilter=$('#obligationIDAdvFilter').val();								  
	if(( !Ext.isEmpty( obligationIDAdvFilter )&&obligationIDAdvFilter!='All') ){
			jsonArray.push(
			{
				field : 'obligationID',
				operator : 'eq',
				value1 : !Ext.isEmpty(selectedObligationId) ? selectedObligationId : encodeURIComponent(obligationIDAdvFilter.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
				value2 : encodeURIComponent(obligationIDAdvFilter.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
				dataType : 0,
				displayType : 5,
				fieldLabel : getLabel('lblobligationID','Obligation ID'),
				displayValue1 : obligationIDAdvFilter
			});
		}
	//Account Name	
	var accountNameAdvFilter=$('#accountNameAdvFilter').val();
	if( !isEmpty(accountNameAdvFilter)){
			jsonArray.push(
			{
				field : 'accountName',
				operator : 'eq',
				value1 : encodeURIComponent(accountNameAdvFilter.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
				value2 : '',
				dataType : 0,
				displayType : 0,
				fieldLabel : getLabel('lblaccountName','Account Name'),
				displayValue1 : accountNameAdvFilter
			} );
	}
	//Loan Amount
	
	// Operator
	var opFilter = $("select[id='operatorAmntAdvFilter']").val();
	// Amount
	var amount = 0;
	var blnAutoNumeric = isAutoNumericApplied('requestedAmntAdvFilter');
	if (blnAutoNumeric)
		amount = $("#requestedAmntAdvFilter").autoNumeric('get');
	else
		amount = $("#requestedAmntAdvFilter").val();
	
	// jquery autoNumeric formatting
	if (!Ext.isEmpty(amount)) {
		jsonArray.push({
					field : 'requestedAmnt',
					operator : opFilter,
					value1 : amount,
					value2 : '',
					dataType :2,
					displayType : 2,
					fieldLabel : getLabel('lblAmount','Amount'),
					displayValue1 : amount	
				});
	}	
	
	//Status	
	var statusFilter = $("#statusAdvFilter").getMultiSelectValue();
	var statusValueDesc = [];
	$('#statusAdvFilter :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});

	var statusValueString=statusFilter.join("and");
	var tempStatusValue;
	var siTemp1='';
	var siTempStatVal = '';
	var siTemp2='';
	var siTempStatVal2 = '';
	var temp1='';
	var tempStatVal = '';
	if (!Ext.isEmpty(statusValueString)) {
		if(!Ext.isEmpty(filterStatusCount)){
			var statusValueArray=statusValueString.split("and");
			 tempStatusValue=statusValueArray;
			 tempStatusValue=statusValueArray.join(',');
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
		}
			if (!Ext.isEmpty(tempStatusValue) && tempStatusValue != 'All') {
				if( isSiTabSelected == 'Y' )
				{
					
					for (j=0; j<statusFilter.length; j++)
					{
						var temp = statusFilter[j];	
						temp = temp.split( "." );
						siTemp1 = siTemp1 + temp[0].split( "." );
						siTemp1 = siTemp1 + temp[1].split( "." )+"^";
						siTemp2 = siTemp2 + statusFilter[j]+",";
						if( temp.length == 3 )
						{	
							temp1 = temp1 + temp[2].split( "." )+",";
						}	
						siTempStatVal = siTemp1.substring(0, siTemp1.length-1);
						tempStatVal = temp1.substring(0, temp1.length-1);
						siTempStatVal2 = siTemp2.substring(0, siTemp2.length-1);
					}
					
					if( !Ext.isEmpty( statusFilter ) && statusFilter != 'All' )
					{
						jsonArray.push(
						{
							field : 'siReqStateValidFlag',
							operator : 'in',
							value1 : siTempStatVal,
							value2 : siTempStatVal2,
							dataType : 'S',
							displayType :5,
							fieldLabel : getLabel('lblstatus','Status'),
							displayValue1 : statusValueDesc				
						} );
						if( tempStatVal == 'A' )
						{
							jsonArray.push(
							{
								field : 'makerId',
								operator : 'ne',
								value1 : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
								value2 : '',
								dataType : 0,
								displayType :0
							} );
						}

					}
				}
				else
				{
								
					for (j=0; j<statusFilter.length; j++)
					{
						var temp = statusFilter[j];	
						temp = temp.split( "." );
						siTemp1 = siTemp1 + temp[0].split( "." )+"^";
						siTemp2 = siTemp2 + statusFilter[j]+",";
						if( temp.length == 2 )
						{	
							temp1 = temp1 + temp[1].split( "." )+",";
						}
						siTempStatVal = siTemp1.substring(0, siTemp1.length-1);
						tempStatVal = temp1.substring(0, temp1.length-1);
						siTempStatVal2 = siTemp2.substring(0, siTemp2.length-1);
						
					}
					if( !Ext.isEmpty( statusFilter ) && statusFilter != 'All' )
					{
						if( tempStatVal == 'A')
						{
							jsonArray.push(
							{
								field : 'requestStatus',
								operator : 'in',
								value1 : siTempStatVal,
								value2 : siTempStatVal2,
								dataType : 'S',
								displayType :5,
								fieldLabel : getLabel('lblstatus','Status'),
								displayValue1 : statusValueDesc
							} );

							jsonArray.push(
							{
								field : 'makerId',
								operator : 'ne',
								value1 : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
								value2 : '',
								dataType : 0,
								displayType :0
							} );
						}
						else if( tempStatVal == 'P' )
						{
							jsonArray.push(
							{
								field : 'requestStatus',
								operator : 'in',
								value1 : siTempStatVal,
								value2 : siTempStatVal2,
								dataType : 'S',
								displayType :5,
								fieldLabel : getLabel('lblstatus','Status'),
								displayValue1 : statusValueDesc
							} );

							jsonArray.push(
							{
								field : 'makerId',
								operator : 'eq',
								value1 : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
								value2 : '',
								dataType : 0,
								displayType :0
							} );
						}				
						else
						{
							jsonArray.push(
							{
								field : 'requestStatus',
								operator : 'in',
								value1 : siTempStatVal,
								value2 : siTempStatVal2,
								dataType : 'S',
								displayType :5,
								fieldLabel : getLabel('lblstatus','Status'),
								displayValue1 : statusValueDesc
								} );
						}
					}
				}
			}
		}
		// Entry Date
		if(!jQuery.isEmptyObject(selectedEntryDate)) {
			jsonArray.push({
				field : isSiTabSelected == 'Y' ? 'requestDate' : 'requestDate',
				operator : selectedEntryDate.operator,
				paramIsMandatory : true,
				value1 : Ext.util.Format.date(Ext.Date.parse(selectedEntryDate.fromDate,'Y-m-d'), 'Y-m-d'),
				value2 : (!Ext.isEmpty( selectedEntryDate.toDate))? Ext.util.Format.date(Ext.Date.parse(selectedEntryDate.toDate,'Y-m-d'), 'Y-m-d'): '',
				dataType : 1,
				displayType : 6,//5,
				dropdownLabel : selectedEntryDate.dateLabel,
				fieldLabel : getLabel('lblreqdate', 'Request Date')
			});
		}
		objJson = jsonArray;
		return objJson;	
}

function showFilterSeqAsPerPref(originalFilterOrder,filterGridStore) {
	var records = [];
	var strURL = isSiTabSelected == 'Y' ? 'userpreferences/loanCenterSiAdvFltr/gridViewAdvanceFilter.srvc?'
					: 'userpreferences/loanCenterTxnAdvFltr/gridViewAdvanceFilter.srvc?';
	Ext.Ajax.request({
		url : strURL ,
		headers: objHdrCsrfParams,
		async : false,
		method : "GET",
		success : function(response) {
			if (!Ext.isEmpty(response.responseText)) {
				var responseData = Ext.decode(response.responseText);
				
				if (responseData && responseData.preference) {
					var filtersObj = JSON.parse(responseData.preference);
					var filterNames = filtersObj.filters;
					if(Ext.isEmpty(filterNames)&&originalFilterOrder.length>0){
						filterNames=originalFilterOrder;
						for(var i=0;i<filterNames.length;i++){
							records.push({
								'filterName' : filterNames[i]
							});
						}
						filterGridStore.loadData(records);
					}
					else if (!Ext.isEmpty(filterNames)) {
						for (var i = 0; i < filterNames.length; i++) {
							var recPosition = $.inArray(filterNames[i], originalFilterOrder);
							if (recPosition > -1) {
								records.push({
									'filterName' : filterNames[i]
									});
								originalFilterOrder.splice(recPosition,1);		
							}
							
						}
						for (var i = 0; i < originalFilterOrder.length; i++) {
							records.push({
										'filterName' : originalFilterOrder[i]
									});
						}	
						filterGridStore.loadData(records);
					}
				}
			}else {
				for (var i = 0; i < originalFilterOrder.length; i++) {
					records.push({
								'filterName' : originalFilterOrder[i]
							});
				}
				filterGridStore.loadData(records);

			}
		},
		failure : function(response) {
			// console.log('Error Occured');
		}
	});
}

function filterGridStore() {
	var myNewStore = Ext.create('Ext.data.Store', {
							fields : ['filterName'],
							data:[]
						});
	var strUrl = isSiTabSelected == 'Y' ? 'userfilterslist/loanCenterSiAdvFltr.srvc?'
					: 'userfilterslist/loanCenterTxnAdvFltr.srvc?';					
	Ext.Ajax.request({
				url : strUrl ,
				headers: objHdrCsrfParams,
				async : false,
				method : "GET",
				success : function(response) {
					if (!Ext.isEmpty(response.responseText)) {
						var responseData = Ext.decode(response.responseText);
						if (responseData && responseData.d.filters) {
							var arrRecords = responseData.d.filters;
							showFilterSeqAsPerPref(arrRecords,myNewStore);
						}
					}
				}
			});
	return myNewStore;
}

function setEntryDateDropDownMenu(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
		itemId : 'EntryDateContainer',
		renderTo:renderToElementId,
		items : [{
			xtype : 'label',
			forId : "requestDateLabelItemId",
			text : 'Request Date',
			listeners: {
		    	render: function(c) {
		    		var tip = Ext.create('Ext.tip.ToolTip', {
		    			target: c.getEl(),
		    			listeners: {
		    				beforeshow: function(tip) {
		    					if(request_date_opt === null) {
		    						tip.update('Request Date');
		    					} else {
		    						tip.update('Request Date' + request_date_opt);
		    					}
		    				}
		    			}
		    		});
				}
			}
		}, {
			xtype : 'button',
			border : 0,
			itemId : 'requestDateItemId',
			cls : 'ui-caret-dropdown',
			listeners : {
				click: function(event) {
					var menus = createDateFilterMenu("entryDate", this);
					var xy=event.getXY();
					menus.showAt(xy[0],xy[1]+16);
					event.menu=menus;
				}
			}
		}]
	});
	return dropDownContainer;
}

function checkInfinity (intFilterDays)
{
	if(Ext.isEmpty(intFilterDays))
		{ 
			return true;
		}		
}

function updateToolTip(filterType,date_option){
	if(filterType=="entryDate"){
		request_date_opt = date_option;
	}
}

function createDateFilterMenu(filterType,buttonIns) {
	var me = this;
	var menu = null;
	var arrMenuItem = [];

	arrMenuItem.push({
		text : getLabel('latest', 'Latest'),
		btnId : 'btnLatest',
		btnValue : '12',
		parent : this,
		handler : function(btn, opts) {
			$(document).trigger("filterDateChange",[filterType,btn,opts]);
			updateToolTip(filterType," (Today)");
		}
	});

	if (intFilterDays >= 1 || me.checkInfinity(intFilterDays))
	{
		arrMenuItem.push({
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Today)");
					}
				});
	}
	if (intFilterDays >= 2 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Yesterday)");
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
						updateToolTip(filterType," (This Week)");
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
						updateToolTip(filterType," (Last Week To Date)");
					}
				});
	if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
	{
		arrMenuItem.push({
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',
					parent : this,
					btnValue : '5',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Month)");
					}
				});
	}
	if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'btnLastmonth',
					btnValue : '6',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Month To Date)");
					}
				});
	if (lastMonthOnlyFilter===true || me.checkInfinity(intFilterDays))
	{
				arrMenuItem.push({
						text : getLabel('lastmonthonly', 'Last Month Only'),
						btnId : 'btnLastmonthonly',
						parent : this,
						btnValue : '14',
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",[filterType,btn,opts]);
							updateToolTip(filterType," (Last Month Only)");
						}
					});	
	}
	if (intFilterDays >= 90 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Quarter)");
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
						updateToolTip(filterType," (Last Quarter To Date)");
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
						updateToolTip(filterType," (This Year)");
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
						updateToolTip(filterType," (Last Year To Date)");
					}
				});
	var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		items : arrMenuItem,
		listeners : {
				hide:function(event) {
					this.addCls('ui-caret-dropdown');
					this.removeCls('action-down-hover');
				}
			}
	});
	return dropdownMenu;
}
function checkAdvanceFilterObligorId()
{	
	var attribute = $('#obligorIDAdvFilter').attr('optionSelected');
	var count = null, code = null, desc = null;
	if(obligorIdRes != null)
	{	
		count = obligorIdRes.length;
		if(count == 0)
		{
			if(attribute != 'true')
				$("#obligorIDAdvFilter").val('');
		}
		else if(count == 1)
		{
			for(res in obligorIdRes)
			{
				code = obligorIdRes[res].CODE;
				desc = obligorIdRes[res].DESCRIPTION ;
			}
			$('#obligorIDAdvFilter').val(desc);
			setDataToObligationId( "#obligationIDAdvFilter", code );
			getAdvFilterObligationId(code);
			if(obligationIDlist.length == 1){
					for(res in obligationIDlist)
					{
						code = obligationIDlist[res].CODE;
						desc = obligationIDlist[res].DESCRIPTION ;
					}
					selectedObligationId= code;
					$('#obligationIDAdvFilter').val(desc);
				}			
							
		}
		else
		{
			if(attribute != 'true')
				$("#obligorIDAdvFilter").val('');
		}
}
}

function checkAdvanceFilterObligationId()
{
	var attribute = $('#obligationIDAdvFilter').attr('optionSelected');
	if(obligationIdRes != null)
	{
		if($("#obligationIDAdvFilter").val() == '' && attribute != 'true')
		{
			$("#obligationIDAdvFilter").val('');
			$('.ui-autocomplete').hide();
		}
		else
		{
			count = obligationIdRes.length;
			if(count == 0)
			{
				if($("#obligationIDAdvFilter").val() == ''  && attribute != 'true')
					$("#obligationIDAdvFilter").val('');
			}
			else if(count == 1)
			{
				for(res in obligationIdRes)
				{
					code = obligationIdRes[res].CODE;
					desc = obligationIdRes[res].DESCRIPTION ;
				}
				selectedObligationId = code;
				$('#obligationIDAdvFilter').prop('title',desc);
				$("#obligationIDAdvFilter").val(desc);
			}
			else
			{
				if(attribute != 'true')
					$("#obligationIDAdvFilter").val('');
			}
		}
	}
}

/*Advance Filter Grid:End*/
/*Advance Filter Popup handling:start*/