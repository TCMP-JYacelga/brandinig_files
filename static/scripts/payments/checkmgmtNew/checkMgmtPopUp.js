function showSingleCheckInquiryResPopUp(record)
{
	$('#chkInqView').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:156,
		width : 858,
		modal : true,
		dialogClass : 'ft-dialog',
		resizable: false,
		draggable: false,
		open: function() {
			resetFields();
			
			$("#reference").text(decodeFinComponent(record.get('reference')));
			$("#makerId").text(record.get('entryUser'));
			
			var time, makerStamp,entryDate;					
			makerStamp = new Date(record.get('entryDate'));
			time = makerStamp.toLocaleTimeString();
			makerStamp = Ext.Date.format(makerStamp, strExtApplicationDateFormat);	
			entryDate = makerStamp;
			
			$("#entryDate").text(record.get('entryDate'));
			$("#sellerId").text(record.get('sellerId') );
			$("#accountSingleCheck").text((record.get('account')+" | "+decodeFinComponent(record.get('accountName'))+" | "+record.raw.ccy));
			$("#checkNmbrFrom").text(record.get('checkNmbrFrom'));
			
			if(record.get('amount') === "" || record.get('amount') === null)
				$("#amount").text("");
			else
				$("#amount").text(record.get('amount'));
			
			$("#checkDateSingleCheck").text(record.get('checkDate'));
			$("#payee").text(record.get('payee'));
			$("#hostMessage").text(record.get('hostMessage'));
			
			$("#reference").prop('title', decodeFinComponent(record.get('reference')));
			$("#makerId").prop('title', record.get('entryUser'));
			$("#entryDate").prop('title', entryDate);
			$("#sellerId").prop('title', record.get('sellerId') );
			$("#accountSingleCheck").prop('title', (record.get('account')+" | "+decodeFinComponent(record.get('accountName'))+" | "+record.raw.ccy));
			$("#checkNmbrFrom").prop('title', record.get('checkNmbrFrom'));
			$("#amount").prop('title',record.get('amount'));
			$("#checkDateSingleCheck").prop('title', record.get('checkDate'));
			$("#payee").prop('title', record.get('payee'));
			$("#hostMessage").prop('title', record.get('hostMessage'));
			
			var actionState = record.get('actionState');
			if(!isEmpty(actionState)  && actionState === '11')
			{
				$('#stopBtn').show();
				$('#singleChkViewReportBtn').hide();
				$('#cancelChkViewBottomBtn').removeClass('ft-button-primary').addClass('ft-button-light');
			}
			else
			{
				$('#stopBtn').hide();
				$('#singleChkViewReportBtn').show();
				//$('#cancelChkViewBottomBtn').removeClass('ft-button-light').addClass('ft-button-primary');
				//$('#singleChkViewReportBtn').addClass('ft-button ft-button-primary ft-margin-l');
			}
			var strUrl = record.get('view').__deferred.uri;
			var id =  record.get('identifier');
			generateDataForCustPopupStore(strUrl,id);	
		 }
	});
	$('#chkInqView').dialog("open");
	$('#referenceDiv').focus();
	autoFocusOnFirstElement(null, 'checkMgmtSingleCheckFooter', true);
	
	$('#singleChkViewReportBtn').bind('click',function(){
		 getCheckMgmtDetailReport(record.get('identifier'),'ChkInq');
	});
	
	$('#stopBtn').bind('click',function(){
		$(this).dialog("close");
		$(document).trigger("stopAction",[btn]);
	});
}
function showSingleStopPayResPopUp(record,type)
{
	var strTitle = '';
	if(record.get('description') == 'Stop Pay')
		strTitle = 'Stop Pay Response';
	else
		strTitle = 'Cancel Stop Pay Response';
	$('#stopPayView').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:156,
		width : 865,
		modal : true,
		resizable: false,
		dialogClass : 'ft-dialog',
		draggable: false,
		open: function() {
			
			$( "#stopPayView" ).dialog({ title: strTitle });
			
			$("#reference1").text(decodeFinComponent(record.get('reference')));
			$("#makerId1").text(record.get('entryUser'));
			
			var time, makerStamp,entryDate;					
			makerStamp = new Date(record.get('entryDate'));
			time = makerStamp.toLocaleTimeString();
			makerStamp = Ext.Date.format(makerStamp, strExtApplicationDateFormat);	
			entryDate = makerStamp;
			
			$("#entryDate1").text(record.get('entryDate'));
			$("#sellerId1").text(record.get('sellerId') );
			$("#account1").text((record.get('account')+" | "+decodeFinComponent(record.get('accountName'))+" | "+record.raw.ccy));
			$("#checkNmbrFrom1").text(record.get('checkNmbrFrom'));
			
			if(record.get('amount') === "" || record.get('amount') === null)
				$("#amount1").text("");
			else
				$("#amount1").text(record.get('amount'));
			
			$("#checkDate1").text(record.get('checkDate'));
			$("#payee1").text(record.get('payee'));
			$("#hostMessage1").text(record.get('hostMessage'));
			$("#reason1").text(record.get('reason'));
			$("#expirationDate1").text(record.raw.expirationDate);
			$("#replacementCheck1").text(record.get('replacementCheck'));
			$("#contactPerson1").text(record.get('contactPerson'));
			$("#phoneNmbr1").text(record.get('phoneNmbr'));
			
			$("#reference1").prop('title', decodeFinComponent(record.get('reference')));
			$("#makerId1").prop('title', record.get('entryUser'));
			$("#entryDate1").prop('title', record.get('entryDate'));
			$("#sellerId1").prop('title', record.get('sellerId') );
			$("#account1").prop('title', (record.get('account')+" | "+decodeFinComponent(record.get('accountName'))+" | "+record.raw.ccy));
			$("#checkNmbrFrom1").prop('title', record.get('checkNmbrFrom'));
			$("#amount1").prop('title', record.get('amount'));
			$("#checkDate1").prop('title', record.get('checkDate'));
			$("#payee1").prop('title', record.get('payee'));
			$("#hostMessage1").prop('title', record.get('hostMessage'));
			$("#reason1").prop('title', record.get('reason'));
			$("#expirationDate1").prop('title', record.raw.expirationDate);
			if(record.raw.replacementCheckFlag)
			{
			$("#replacementCheck1").prop('title', record.get('replacementCheck'));
				$('#replacementCheckDiv').show();
			}
			else
			{
				$('#replacementCheckDiv').hide();
			}
			
			$("#contactPerson1").prop('title', record.get('contactPerson'));
			$("#phoneNmbr1").prop('title', record.get('phoneNmbr'));
			if ( ( record.get('description') === "Cancel Stop Pay" || record.get('description') === "Stop Pay" )
					&& record.get('requestSubType') === 1 ) {
				$('#singleStopPayDeatilsDiv').hide();
			} else {
				$('#singleStopPayDeatilsDiv').show();
			}
			if(record.get('replacementChk') == 'Y')
				{
				$('#single_replacementCheckDiv').removeClass("hidden");
				}
			var strUrl = record.get('view').__deferred.uri;
			var id =  record.get('identifier');
			generateDataForCustPopupStore(strUrl,id);	
		 }
	});
	$('#stopPayView').dialog("open");
	$('#reference1Div').focus();
	autoFocusOnFirstElement(null, 'checkMgmtSingleStopFooter', true);

	$('#reportBottomBtn').bind('click',function(){
		 getCheckMgmtDetailReport(record.get('identifier'),'StopPaySing');
	});

}
function generateDataForCustPopupStore(strUrl,id)
{
	var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g; 
	var strUrl=strUrl + '?'  + 'identifier=' + id + '&' + csrfTokenName + '=' + csrfTokenValue;

	 while (arrMatches = strRegex.exec(strUrl)) {
						objParam[arrMatches[1]] = arrMatches[2];
					}
	 strUrl = strUrl.substring(0, strUrl.indexOf('?'));
	Ext.Ajax.request({
			 url : strUrl,
				method : 'POST',
				params:objParam,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if(!Ext.isEmpty(data)){
							chkMgmtRes = data.d.chkmgmtresponse;
							if(!Ext.isEmpty(chkMgmtRes)){
								var jsonData =chkMgmtRes;
								var count=jsonData.length;
								var requestStateDesc = '';
								var trakingNumber = '';
								var requestNmbr = '';
								for (var index = 0; index < count; index++) {
									
									requestStateDesc = jsonData[index].requestStateDesc != undefined ? jsonData[index].requestStateDesc : '';
									trakingNumber = jsonData[index].trakingNumber != undefined ? jsonData[index].trakingNumber : '';
									requestNmbr = jsonData[index].recordKeyNo != undefined ? jsonData[index].recordKeyNo : '';
									
									$("#status").text(requestStateDesc);
									$("#status").prop('title',  requestStateDesc);
									$("#status1").text(requestStateDesc);
									$("#status1").prop('title',  requestStateDesc);
									
									$("#bankReference").text(trakingNumber);
									$("#bankReference").prop('title', trakingNumber);
									$("#bankReference1").text(trakingNumber);
									$("#bankReference1").prop('title', trakingNumber);
									
									$("#trakingNumber").text(requestNmbr);	
									$("#trakingNumber").prop('title', requestNmbr);	
									$("#trakingNumber1").text(requestNmbr);
									$("#trakingNumber1").prop('title', requestNmbr);
								}
							}
						} 
					 },
					 failure : function(response) {
						  //console.log("Ajax Get account sets call failed");
						}
		});
}
function showMultiStopPayResPopUp(record)
{
	var strTitle = '';
	if(record.get('description') == 'Check Inquiry')
		strTitle = 'Check Inquiry Response';
	else if(record.get('description') == 'Stop Pay')
		strTitle = 'Stop Pay Response';
	else
		strTitle = 'Cancel Stop Pay Response';

	$('#stopPayMultiView').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:156,
		width : 865,
		modal : true,
		resizable: false,
		dialogClass : 'ft-dialog',
		draggable: false,
		open: function() {
				$( "#stopPayMultiView" ).dialog({ title: strTitle });
				showHideFields(record);
				setData(record);
				responseGrid = createResponseGrid(record);
		 }
	});
	$('#stopPayMultiView').dialog("open");
	$('#multi_reference_div').focus();
	autoFocusOnFirstElement(null, 'stopPayMultiViewFooter', true);
	$('#multiViewReportBtn').bind('click',function(){
		if(record.get('description') == 'Check Inquiry')
			getCheckMgmtDetailReport(record.get('identifier'),'ChkInq');
		else 
			getCheckMgmtDetailReport(record.get('identifier'),'StopPayMulti');
		 
	});
}
function showHideFields(record)
{
	if(record.get('description') == 'Check Inquiry')
	{
		$("#lbl_multi_reason").hide();
		$("#multi_reason").hide();
		$("#lbl_multi_expirationDate").hide();
		$("#multi_expirationDate").hide();
		$("#lbl_multi_replacementCheck").hide();
		$("#multi_replacementCheck").hide();
		$("#multiInquiry").hide();
		$("#lbl_multi_contactPerson").hide();
		$("#multi_contactPerson").hide();
		$("#lbl_multi_phoneNmbr").hide();
		$("#multi_phoneNmbr").hide();
	}
	else
	{
		$("#lbl_multi_reason").show();
		$("#multi_reason").show();
		$("#lbl_multi_expirationDate").show();
		$("#multi_expirationDate").show();
		$("#lbl_multi_replacementCheck").show();
		$("#multi_replacementCheck").show();
		if ( record.get('description') === "Cancel Stop Pay" && record.get('requestSubType') === 1 ) {
			$("#multiInquiry").hide();
		} else {
			$("#multiInquiry").show();
		}
		$("#lbl_multi_contactPerson").show();
		$("#multi_contactPerson").show();
		$("#lbl_multi_phoneNmbr").show();
		$("#multi_phoneNmbr").show();
	}
}
function resetFields()
{
	$("#reference").val('');
	$("#makerId").val('');
	$("#entryDate").val('');
	$("#sellerId").val('');
	$("#accountSingleCheck").val('');
	$("#reason").val('');
	$("#expirationDate").val('');
	$("#replacementCheck").val('');
	$("#contactPerson").val('');
	$("#phoneNmbr").val('');
}
function setData(record)
{
	$("#multi_reference").text(Ext.String.htmlDecode(decodeFinComponent(record.get('reference'))));
	$("#multi_reference").prop('title', Ext.String.htmlDecode(decodeFinComponent(record.get('reference'))));
	
	$("#multi_makerId").text(record.get('entryUser'));
	$("#multi_makerId").prop('title', record.get('entryUser'));
	
	var time, makerStamp,entryDate;					
	makerStamp = new Date(record.get('entryDate'));
	time = makerStamp.toLocaleTimeString();
	makerStamp = Ext.Date.format(makerStamp, strExtApplicationDateFormat);	
	entryDate = makerStamp;
	
	$("#multi_entryDate").text(record.get('entryDate'));
	$("#multi_entryDate").prop('title', record.get('entryDate'));
	
	$("#multi_sellerId").text(record.get('sellerId') );
	$("#multi_sellerId").prop('title', record.get('sellerId') );
	
	$("#multi_account").text((record.get('account')+' | '+decodeFinComponent(record.get('accountName'))+" | "+record.raw.ccy));
	$("#multi_account").prop('title',(record.get('account')+' | '+decodeFinComponent(record.get('accountName'))+" | "+record.raw.ccy));
	
	if($("#multi_reason")){
		$("#multi_reason").text(record.get('reason'));
		$("#multi_reason").prop('title', record.get('reason'));
	}
	
	if($("#multi_expirationDate")){
		$("#multi_expirationDate").text(record.raw.expirationDate);
		$("#multi_expirationDate").prop('title', record.get('expirationDate'));
	}
		
	if(record.raw.replacementCheckFlag)
	{
		$('#multiReplacementCheckDiv').show();
	if($("#multi_replacementCheck")){
		$("#multi_replacementCheck").text(record.get('replacementCheck'));
		$("#multi_replacementCheck").prop('title', record.get('replacementCheck'));
	}
	}
	else
	{
		$('#multiReplacementCheckDiv').hide();
	}
	
	
	$("#multi_contactPerson").text(record.get('contactPerson'));
	$("#multi_contactPerson").prop('title', record.get('contactPerson'));
	
	$("#multi_phoneNmbr").text(record.get('phoneNmbr'));
	$("#multi_phoneNmbr").prop('title', record.get('phoneNmbr'));
	
	if(record.get('replacementChk') == 'Y')
		{
		$('#multi_replacementCheckDiv').removeClass("hidden");
		}
}
function createResponseGrid(record)
{
	$(document).trigger('loadResponseSmartGrid',[record]);
}

function showAdvanceFilterPopup(){
	if(window.advanceFilterPopup){
		$('#advancedFilterPopup').dialog("open");
	}else{
		window.advanceFilterPopup = $('#advancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight: 580,
		minHeight:(screen.width) > 1024 ? 156 : 0,
		width : 840,
		dialogClass: 'ft-dialog',
		resizable: false,
		draggable: false,
		title : 'Advanced Filter',
		modal : true,
      open:function(){
			hideErrorPanel('#advancedFilterErrorDiv');
	      	  removeMarkRequired('#filterCode');
			  markAdvFilterNameMandatory('saveFilterChkBox','filterNameId','filterCode');
			setCompanyMenuItems('clientSelect');
			$('#advancedFilterPopup').dialog('option', 'position', 'center');
	      	
      },
	  focus :function(){
				
	  },
	  close : function(){
	  }
	 
	});
	$('#advancedFilterPopup').dialog("open");
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
	$('#tabs').tabs("option", "selected", index);
}
function setStatusDropDownItems(elementId) {
	var el = $("#"+elementId).multiselect();
	el.attr('multiple',true);
	var statusArray = advFilterStatusArray;
	for (var index = 0; index < statusArray.length; index++) {
		var opt = $('<option />', {
					value : statusArray[index].key,
					text : statusArray[index].value
				});
		opt.attr('selected','selected');	
		opt.appendTo(el);
	}
	el.multiselect('refresh');
	filterStatusCount=statusArray.length;
}
/*function setAccountIdAndAccountNumber(elementId){

	if(GranularPermissionFlag == 'Y')
		strUrl = 'services/userseek/checkAcctNumberAccNameSeekGranular.json';
	else
		strUrl = 'services/userseek/checkAcctNumberAccNameSeek.json';
		
	$.ajax({
		async: false,
		url : strUrl ,
		type : 'POST',
		data:{$top:-1},
		success:function(responseData){
			if(!isEmpty(responseData)){
				var data = responseData.d.preferences;
				addDataInAccountMultiSelect(elementId, data);
				filterAccountDataCount = data.length;	
			}
		}
	});
}*/

function setAccountIdAndAccountNumber(elementId){
	var clientSelVal = "";
	if(onBehalf)
	{
		clientSelVal = $("#clientSelect option:selected").text();
		}
	else
	{
		clientSelVal = "";
	}
		$.ajax({
		url : 'services/checkManagmentAccountList.json?$clientId='+ clientSelVal,
		type : 'POST',
		async : false,	
		success:function(responseData){
			if(!isEmpty(responseData)){
				var data = responseData.d;
				saveLocalAccPref = $("select[id='accountSelect']").getMultiSelectValueString();
				resetAllMenuItemsInMultiSelect(elementId);
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
	$("#accountSelect" + ' option').prop('selected', false);
	$("#accountSelect").multiselect("refresh");	
	$("#accountSelect").empty();
	//saveLocalAccPref = undefined;
	if (saveLocalAccPref != undefined && saveLocalAccPref != "")
	{
		var itemArray=saveLocalAccPref.split(',');
		if(itemArray.length != 0){
			for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
				var opt = $('<option />', {
					value: data[dataIndex].filterCode,
					text: data[dataIndex].filterValue+" | "+data[dataIndex].additionalValue1 + " | "+data[dataIndex].additionalValue2
				});
				for (var index = 0; index < itemArray.length; index++) 
				{	
					if (data[dataIndex].filterCode == itemArray[index]){
						opt.attr('selected',true);
						opt.appendTo( el );
						break;
					}else{
						opt.attr('selected',false);
						opt.appendTo( el );
					}
				}
			}
		}		
	}else{
	for(index=0;index<data.length;index++)
	{
		var opt = $('<option />', {
			value: data[index].filterCode,
			text: data[index].filterValue+" | "+data[index].additionalValue1 + " | "+data[index].additionalValue2
		});
		opt.attr('selected','selected');
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
function setOperatorDropDownItems(elementId) {
	var operatorArray = amtOperatorsArray;
	for (var index = 0; index < operatorArray.length; index++) {
		var opt = $('<option />', {
					value : operatorArray[index].key,
					text : operatorArray[index].value
				});
		if (operatorArray[index].key == 'eq')
			opt.attr('selected', true);
		
		opt.appendTo(elementId);
	}
	makeNiceSelect(elementId.replace('#',''), false);
}
function createFilterGrid() {
	var store = filterGridStore();
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				minHeight : 'auto',
				margin : '0 0 12 0',
				width : 'auto',
				autoScroll : true,
				popup : true,
				cls : 't7-grid',
				listeners: {
					cellclick: function(view, td, cellIndex, record,tr, rowIndex, e, eOpts) {
						 var IconLinkClicked = (e.target.tagName == 'A');	
	         		     if(IconLinkClicked){
					        var clickedId = e.target.id;
							if(clickedId=='advFilterEdit'){
								$(document).trigger("editFilterEvent",[view, rowIndex]);
							}else if(clickedId=='advFilterView'){
								$(document).trigger("viewFilterEvent",[view, rowIndex]);
							}else if(clickedId=='advFilterDelete'){
								$(document).trigger("deleteFilterEvent",[view, rowIndex]);
							}
						}
					}
				},
				columns : [{
					text: '#',
					width : 40,
					align :'center',
					sortable : false,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
					    return rowIndex+1;
				 }
				},{
					xtype : 'actioncolumn',
					align : 'center',
					text : getLabel('actions', 'Actions'),
					sortable:false,
					width:80,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						    return '<a id="advFilterView" class="grid-row-action-icon  icon-view" href="#" title='+getLabel('view', 'View')+'></a>'
						          +'<a id="advFilterEdit" class="grid-row-action-icon icon-edit" href="#" title='+getLabel('edit', 'Edit')+'></a>'
						          +'<a id="advFilterDelete" class="grid-row-action-icon  icon-delete" href="#" title='+getLabel('delete', 'Delete')+'></a>';
					 }
				}, {
					text : getLabel('filterName', 'Filter Name'),
					dataIndex : 'filterName',
					flex : 1,
					sortable : false,
					menuDisabled : true
				},{
					xtype : 'actioncolumn',
					align : 'center',
					header : getLabel('order', 'Order'),
					sortable : false,
					menuDisabled : true,
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
function filterGridStore() {
	var myStore = null;
	var records = [];
	Ext.Ajax.request({
		url : 'services/userfilterslist/checkMgmtFilter.json',
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
	
	//Client
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
		if(tempClientCodesData!='All'){
		jsonArray.push({
					field : 'clientId',
					operator : 'in',
					value1 : tempClientCodesData,
					value2 : '',
					dataType : 0,
					displayType : 11,
					detailFilter : 'Y',
					fieldLabel : getLabel('lblClient','Company Name'),
					displayValue1 : clientValueDesc.toString()
				});
		}
	}
	
	//Account
	var accountCodesData =$("select[id='accountSelect']").getMultiSelectValueString();
	if(Ext.isEmpty(accountCodesData)){
		accountCodesData=advFilterSelectedClients;
	}
	var tempAccCodesData=accountCodesData;
	saveLocalAccPref = tempAccCodesData;
	if(!Ext.isEmpty(accountCodesData))
	{
		var accountCodesArray=accountCodesData.split(',');
		if(accountCodesArray.length == filterAccountDataCount)
			tempAccCodesData = "all";
	}
	if (!Ext.isEmpty(tempAccCodesData) && tempAccCodesData !='all')
	{
		if(!Ext.isEmpty(filterAccountDataCount))
		{
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
	// Reference
	var Reference = $("input[type='text'][id='Reference']").val();
	if (!Ext.isEmpty(Reference)) {
		jsonArray.push({
					field : 'Reference',
					operator : 'lk',
					value1 : encodeURIComponent(Reference.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 0,
					fieldLabel : getLabel('lblReference','Reference'),
					displayValue1 : Reference
				});
	}
	// Check #
	var CheckNum = $("input[type='text'][id='CheckNum']").val();
	if (!Ext.isEmpty(CheckNum)) {
		jsonArray.push({
					field : 'CheckNum',
					operator : 'lk',
					value1 : encodeURIComponent(CheckNum.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 6,
					fieldLabel : getLabel('lblCheckNum','Check No.'),
					displayValue1 : CheckNum
				});
	}	
 	
	var blnAutoNumeric = true;
	// Operator
	var opFilter = $("select[id='amountOp']").val();
	// Amount
	var amount = $("input[type='text'][id='Amount']").val();
	// jquery autoNumeric formatting
	blnAutoNumeric = isAutoNumericApplied("Amount");
	if (blnAutoNumeric)
		amount = $("#Amount").autoNumeric('get');
	else
		amount = $("#Amount").val();
	// jquery autoNumeric formatting
	if (!Ext.isEmpty(amount)) {
		jsonArray.push({
					field : 'Amount',
					operator : opFilter,
					value1 : amount,
					value2 : '',
					dataType :2,
					displayType : 2,
					fieldLabel : getLabel('lblAmount','Amount'),
					displayValue1 : $("#Amount").val()
				});
		
	}
	// Request Date
	if (!jQuery.isEmptyObject(selectedRequestDateFilter)) {
		jsonArray.push({
					field : 'EntryDate',
					operator : selectedRequestDateFilter.operator,
					paramIsMandatory : true,
					value1 : Ext.util.Format.date(Ext.Date.parse(selectedRequestDateFilter.fromDate, strExtApplicationDateFormat), 'Y-m-d'),
					value2 : (!Ext.isEmpty(selectedRequestDateFilter.toDate))
							? Ext.util.Format.date(Ext.Date.parse(selectedRequestDateFilter.toDate, strExtApplicationDateFormat), 'Y-m-d')
							: '',
					dataType : 1,
					displayType : 6,
					fieldLabel : getLabel('lblreqdate', 'Request Date'),
					dropdownLabel : selectedRequestDateFilter.dateLabel
				});
	}
	// Check Date
	if (!jQuery.isEmptyObject(selectedCheckDateFilter)) {
		jsonArray.push({
					field : 'CheckDate',
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
					displayType : 6,
					fieldLabel : getLabel('lblchkdate', 'Issue Date'),
					dropdownLabel : selectedCheckDateFilter.dateLabel
				});
	}
	// Status
	var statusFilter = $("#statusAdvFilter").getMultiSelectValue();
	var statusValueDesc = [];
	$('#statusAdvFilter :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});
	
	var statusValueString=statusFilter.join("and");
	var tempStatusValue,tempStatusValue2='';
	if (!Ext.isEmpty(statusValueString)) {
		if(!Ext.isEmpty(filterStatusCount)){
			var statusValueArray=statusValueString.split("and");
			 tempStatusValue=statusValueArray;
			 tempStatusValue=statusValueArray.join(',');
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
			statusValueArray.forEach( function(val,indx){
				var valArr=val.split(',');
				var valJoin = valArr.join('^');
				tempStatusValue2+=valJoin+',';
			});
		}
		if(tempStatusValue != "All")
			jsonArray.push({
						field : 'RequestState',
						operator : 'in',
						value1 : tempStatusValue,
						value2 : tempStatusValue2,
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
	var clientData = $("#clientSelect").val();
	
	var clientValueDesc = [];
	$('#clientSelect :selected').each(function(i, selected){
		clientValueDesc[i] = $(selected).text();
	});
	if(clientData!='All'){
		jsonArray.push({
			field : 'clientId',
			operator : 'in',
				value1 : clientData,
			value2 : '',
			dataType : 0,
				displayType : 11,
				detailFilter : 'Y',
				fieldLabel : getLabel('lblClient','Company Name'),
				displayValue1 : clientValueDesc.toString()
		});
	}
		
		
	// Reference
	var Reference = $("input[type='text'][id='Reference']").val();
	if (!Ext.isEmpty(Reference)) {
		jsonArray.push({
					field : 'Reference',
					operator : 'lk',
					value1 : encodeURIComponent(Reference.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 4,
					fieldLabel : getLabel('lblReference','Reference'),
					displayValue1 : Reference
				});
	}
	// Check #
	var CheckNum = $("input[type='text'][id='CheckNum']").val();
	if (!Ext.isEmpty(CheckNum)) {
		jsonArray.push({
					field : 'CheckNum',
					operator : 'lk',
					value1 : encodeURIComponent(CheckNum.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 4,
					fieldLabel : getLabel('lblCheckNum','Check No.'),
					displayValue1 : CheckNum
				});
	}
	// Account
	var accountCodesData =$("select[id='accountSelect']").getMultiSelectValueString();
	if(Ext.isEmpty(accountCodesData)){
		accountCodesData=advFilterSelectedClients;
	}
	var tempAccCodesData=accountCodesData;
	saveLocalAccPref = tempAccCodesData;
	if(!Ext.isEmpty(accountCodesData))
	{
		var accountCodesArray=accountCodesData.split(',');
		if(accountCodesArray.length == filterAccountDataCount)
			tempAccCodesData = "all";
	}	
	if (!Ext.isEmpty(tempAccCodesData) && tempAccCodesData !='all') {
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
	
	// Operator
	var opFilter = $("select[id='amountOp']").val();
	// Amount
	var amount = $("input[type='text'][id='Amount']").val();
	if (!Ext.isEmpty(amount)) {
		jsonArray.push({
					field : 'Amount',
					operator : opFilter,
					value1 : amount,
					value2 : '',
					dataType :0,
					displayType : 6,
					fieldLabel : getLabel('amount','Amount')
				});
	}
	
	// Request Date
	if (!jQuery.isEmptyObject(selectedRequestDateFilter)) {
		jsonArray.push({
					field : 'EntryDate',
					operator : selectedRequestDateFilter.operator,
					value1 : Ext.util.Format.date(
							selectedRequestDateFilter.fromDate, 'Y-m-d'),
					value2 : (!Ext
							.isEmpty(selectedRequestDateFilter.toDate))
							? Ext.util.Format.date(
									selectedRequestDateFilter.toDate,
									'Y-m-d')
							: '',
					dataType : 1,
					displayType : 6,
					fieldLabel : getLabel('lblreqdate','Request Date'),
					dropdownLabel : selectedRequestDateFilter.dateLabel
				});
	}
	// Check Date
	if (!jQuery.isEmptyObject(selectedCheckDateFilter)) {
		jsonArray.push({
					field : 'CheckDate',
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
					displayType :6,
					fieldLabel : getLabel('lblchkdate','Issue Date'),
					dropdownLabel : selectedCheckDateFilter.dateLabel
				});
	}
	// Status 
	var statusFilter = $("#statusAdvFilter").getMultiSelectValue();
	var statusValueDesc = [];
	$('#statusAdvFilter :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});
	
	var statusValueString=statusFilter.join("and");
	var tempStatusValue,tempStatusValue2='';
	if (!Ext.isEmpty(statusValueString)) {
		if(!Ext.isEmpty(filterStatusCount)){
			var statusValueArray=statusValueString.split("and");
			 tempStatusValue=statusValueArray;
			 tempStatusValue=statusValueArray.join(',');
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
			statusValueArray.forEach( function(val,indx){
				var valArr=val.split(',');
				var valJoin = valArr.join('^');
				tempStatusValue2+=valJoin+',';
			});
		}
		if(tempStatusValue != "All")
			jsonArray.push({
						field : 'RequestState',
						operator : 'in',
						value1 : tempStatusValue,
						value2 : tempStatusValue2,
						dataType : 0,
						displayType :11,// 6,
						fieldLabel : getLabel('lblstatus','Status'),
						displayValue1 : statusValueDesc.toString()
						
					});
	}
	
	objJson = {};
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
		objJson.filterCode = FilterCodeVal;
	return objJson;
}
function getCheckMgmtDetailReport(identifier,reqType){
	var form = document.createElement('FORM');
	var strUrl = "services/getCheckMgmtDetailReport.pdf";
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			csrfTokenName, tokenValue));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			'viewState',identifier));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			'reqType', reqType));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}
function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
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
function populateAdvancedFilterFieldValue()
{
	//$(document).trigger("resetAllFieldsEvent");
	setRequestDateDropDownMenu('requestDateDropDown');
	setCheckDateDropDownMenu('checkDateDropDown');
	setOperatorDropDownItems("#amountOp");
	setAccountIdAndAccountNumber("#account");
	setStatusDropDownItems("statusAdvFilter");
	setSavedFilterComboItems('#msSavedFilter');
}
function setSavedFilterComboItems(element){
	$.ajax({
		url : 'services/userfilterslist/checkMgmtFilter.json',
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
function setRequestDateDropDownMenu(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'RequestDateContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "requestDateLabel",
							text:getLabel('lblreqdate', 'Request Date'),
							listeners: {
							       render: function(c) {
							    	   			var tip = Ext.create('Ext.tip.ToolTip', {
											            	    target: c.getEl(),
											            	    listeners:{
											            	    	beforeshow:function(tip){
											            	    		if(entry_date_opt === null)
												            	    		tip.update('Request Date');
												            	    	else
												            	    		tip.update('Request Date' + entry_date_opt);

											            	    	}
											            	    }
							        			});
							       	}	
							}
						},{
							xtype : 'button',
							border : 0,
							id : 'requestDateButton',
							tabIndex :"1",
							cls : 'ui-caret-dropdown',
							listeners : {
								click:function(event){
										var menus=getDateDropDownItems("entryDate",this,"requestDateButton");
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
function setCheckDateDropDownMenu(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'CheckDateContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "checkDateLabel",
							text:getLabel('lblchkdate', 'Issue Date'),
							listeners: {
							       render: function(c) {
							    	   			var tip = Ext.create('Ext.tip.ToolTip', {
											            	    target: c.getEl(),
											            	    listeners:{
											            	    	beforeshow:function(tip){
											            	    		if(process_date_opt === null)
												            	    		tip.update('Issue Date');
												            	    	else
												            	    		tip.update('Issue Date' + process_date_opt);

											            	    	}
											            	    }
							        			});
							       	}	
							}
						},{
							xtype : 'button',
							border : 0,
							id : 'checkDateButton',
							tabIndex :"1",
							cls : 'ui-caret-dropdown',
							listeners : {
								click:function(event){
										var menus=getDateDropDownItems("checkDate",this,"checkDateButton");
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
function getDateDropDownItems(filterType,buttonIns,parentBtnId){
	var me = this;
	    var intFilterDays = !Ext.isEmpty(filterDays)
		? parseInt(filterDays,10)
		: '';
		var arrMenuItem = [/*{
					text : getLabel('latest', 'Latest'),
					btnId : 'latest',
					btnValue : '12',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Latest)");
						$('#'+parentBtnId)[0].focus();
						
					}
				}*/];
		if( entityType == '1' && _IsEmulationMode == false && (filterType == 'checkDate' || filterType == 'entryDate'))
        {
            arrMenuItem.push({
                text : getLabel('latest', 'Latest'),
                btnId : 'latest',
                btnValue : '12',
                handler : function(btn, opts) {
                    $(document).trigger("filterDateChange",[filterType,btn,opts]);
                    updateToolTip(filterType," (Latest)");
                    $('#'+parentBtnId)[0].focus();
                }
            });         
        }
		if (intFilterDays >= 1 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Today)");
						$('#'+parentBtnId)[0].focus();
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
						$('#'+parentBtnId)[0].focus();
					}
				});
		
		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push( {
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Week)");
						$('#'+parentBtnId)[0].focus();
					}
				});
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push( {
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Week To Date)");
						$('#'+parentBtnId)[0].focus();
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
						$('#'+parentBtnId)[0].focus();
					}
				} );
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'btnLastmonth',
					btnValue : '6',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Month To Date)");
						$('#'+parentBtnId)[0].focus();
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
						$('#'+parentBtnId)[0].focus();
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
						$('#'+parentBtnId)[0].focus();
					}
				} );
		if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
					text : getLabel('lastQuarterToDate',
							'Last Quarter To Date'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Quarter To Date)");
						$('#'+parentBtnId)[0].focus();
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
						$('#'+parentBtnId)[0].focus();
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
						$('#'+parentBtnId)[0].focus();
					}
				});
	var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		items : arrMenuItem
	});
	return dropdownMenu;
}
function updateToolTip(filterType,date_option){
	if(filterType === 'entryDate')
		entry_date_opt = date_option;
	else if(filterType === 'checkDate')
		process_date_opt = date_option;
}
function setCompanyMenuItems(elementId){
	var me = this;
	var filterCorp = strClient;
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
		filterCorp = "";
		
	}
	if(onBehalf)
	    filterCorp =strSellerId;
	var strUrl = null;
	if(onBehalf)
	{
		strUrl = 'services/userseek/checkAcctNumberAdminSeek.json';
	}
	else
	{
			strUrl = 'services/userseek/checkAcctNumberClientSeek.json';
	}
	
	$.ajax({
		url : strUrl,
		type : 'POST',
		async : false,
		data:{$top:-1,
			$filtercode1:filterCorp
			},
		success:function(responseData){
			if(!isEmpty(responseData)){
				var data = responseData.d.preferences;
				resetAllMenuItemsInMultiSelect(elementId);
				addDataInClientMultiSelect(elementId,data);
				filterClientDataCount=data.length;
				setAccountIdAndAccountNumber("#accountSelect");
			}
		}
	});
	
}
function addDataInClientMultiSelect(elementId,data)
{
  var clientSelVal =$('#clientSelect').val();
	$('#'+elementId).empty();
	var defaultOpt = $('<option />', {
		value : "All",
			text : getLabel('allCompanies', 'All Companies'),
			selected : "All" === clientSelVal ? true : false
		});
	
	defaultOpt.appendTo('#'+elementId);
	$.each(data,function(index,item){
		$('#'+elementId).append($('<option>', { 
			value: data[index].CODE,
				text : data[index].DESCR,
				selected : data[index].CODE === clientSelVal ? true : false
			}));
	});
	makeNiceSelect(elementId, false);
}
function setResetAccountIdAndAccountNumber()
{
	var el = $("#accountSelect").multiselect();
	el.attr('multiple',true);
	$("#accountSelect" + ' option').prop('selected', false);
	$("#accountSelect").multiselect("refresh");
	if( selectedFilterClient != 'all' && selectedFilterClient != '' && selectedFilterClient != undefined)
	{
		$("#accountSelect").empty();		
		setAccountIdAndAccountNumber("#accountSelect");		
	}	
	else
	{
		$("#accountSelect option").prop('selected', true);
		$("#accountSelect").multiselect("refresh");				
	}
}
function resetValuesOnClientChange(){
	if(!isEmpty(selectedClient) && 'all' !=selectedClient)
		selectedClientDesc=$("#clientSelect option:selected").text();
	else{
		selectedClient='';
		selectedClientDesc='';
	}
	resetAllMenuItemsInMultiSelect("#accountSelect");
	setAccountIdAndAccountNumber("#accountSelect");
}