var poFinanceResponseHeaderData = null;
function addInvoiceFinance(strUrl, frmId) 
{
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	$('#maxFinancePossible').removeAttr("readonly");
	$('#minFinanceReq').removeAttr("readonly");
	$('#requestsAllowed').removeAttr("readonly");
	$('#requestsProcessed').removeAttr("readonly");
	frm.submit();
}


function updateInvoiceFinance(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


function goToBack(frmId,strUrl)
{
	if($('#dirtyBit').val()=="1")
		getConfirmationPopup(frmId, strUrl);
	else
    {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	}
}
function addNewSCMProduct(frmId, strUrl)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}
function getConfirmationPopup(frmId, strUrl)
{
	$('#confirmPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Yes" : function() {
					var frm = document.getElementById(frmId);
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
					},
				"No" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#confirmPopup').dialog("open");
}
function goToPage(strUrl, frmId)
{
	 var frm = document.getElementById(frmId);
	 frm.action = strUrl;
	 frm.target = "";
	 frm.method = "POST";
	 frm.submit();
}

function paintPoFinanceActionButtons(mode){
	
	$('#poFinanceEntryActionButtonListLB','#poFinanceEntryActionButtonListRB').empty();
	
	var leftButtons = '#poFinanceEntryActionButtonListLB';
	var rightButtons = '#poFinanceEntryActionButtonListRB';
	var viewPoUrl = null;
	
	if(mode === "ENTRY"){
		viewPoUrl = "viewPoFromPoFinanceRequestEntry.form"
	}else if(mode === "VERIFY"){
		viewPoUrl = "viewPoFromPoFinanceRequestVerify.form"
	}
	
	//back button
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
		goToPage(backUrl,'frmMain');
	});

	//discard button
	btnDiscard = createButton('btnDiscard', 'L');
	btnDiscard.click(function(){
		getDiscardConfirmationPopup('purchaseOrderCenter.form')
	});
	
	//verify button
	btnVerify = createButton('btnVerify', 'P');
	btnVerify.click(function(){
		goToPage('poFinanceRequestVerify.form','frmMain');
		
	});
	
	//view PO button
	btnViewPO = createButton('viewPo','L');
	btnViewPO.click(function() {
		goToPage(viewPoUrl,'frmMain');
	});
	
	//submit button
	btnSubmit = createButton('btnSubmit','P');
	btnSubmit.click(function(){
		if(financeRequestAction === 'ADD'){
			addInvoiceFinance('addPoFinance.form','frmMain');
		}else if(financeRequestAction === 'EDIT'){
			updateInvoiceFinance('updatePoFinance.form','frmMain');
		}
		blockUI(true);
	});
	
	//approve button
	btnApprove = createButton('btnApprove','P');
	btnApprove.click(function(){
		 
		var arrayJson = new Array();
		arrayJson.push({
			serialNo : 1,
			identifier : indentifier,
			userMessage : ''
		});
		
		$.ajax({
			url : "services/purchaseOrderFinance/authourize",
			type : 'POST',
			contentType : "application/json",
			data : JSON.stringify(arrayJson),
			success :function(data){
				var result = data[0];
				var isSuccess = data[0].success;
				var msg="";
				if(isSuccess == 'N')
				{
						Ext.each(result.errors, function(error) {
							msg = msg + error.code + ' : ' + error.errorMessage;
							errCode = error.code;
							});
						var arrActionMsg = [];
						 arrActionMsg.push({
							success : result.success,
							actualSerailNo : result.serialNo,
							actionTaken : 'Y',
							reference : poFinanceReferenceNo,
							actionMessage : msg
						});
						 getRecentActionResult(arrActionMsg);
				}else{
					goToPage('poFinanceCenter.form','frmMain');
				}
			},
			error : function(data){
				console.log("error in approving data")
			}
		});
	});
	
	//reject button
	btnReject = createButton('btnReject','P');
	btnReject.click(function(){
		getFinanceRejectPopup()
	});
	
	//cancel button
	btnCancel = createButton('btnCancel','S');
	btnCancel.click(function(){
		goToPage('purchaseOrderCenter.form','frmMain');
	});
	
	//close button
	btnClose = createButton('btnClose','S');
	btnClose.click(function(){
		goToPage('poFinanceCenter.form','frmMain');
	});
	
	//send button
	btnSend = createButton('btnSend','P');
	btnSend.click(function(){
		var arrayJson = new Array();
		arrayJson.push({
			serialNo : 1,
			identifier : indentifier,
			userMessage : ''
		});
		$.ajax({
			url : "services/purchaseOrderFinance/send",
			type : 'POST',
			contentType : "application/json",
			data : JSON.stringify(arrayJson),
			success :function(data){
				var result = data[0];
				var isSuccess = data[0].success;
				var msg="";
				if(isSuccess == 'N')
				{
						Ext.each(result.errors, function(error) {
							msg = msg + error.code + ' : ' + error.errorMessage;
							errCode = error.code;
							});
						var arrActionMsg = [];
						 arrActionMsg.push({
							success : result.success,
							actualSerailNo : result.serialNo,
							actionTaken : 'Y',
							reference : poFinanceReferenceNo,
							actionMessage : msg
						});
						 getRecentActionResult(arrActionMsg);
				}else{
					goToPage('poFinanceCenter.form','frmMain');
				}
			},
			error : function(data){
				console.log("error in approving data")
			}
		});
	});
	
	if(mode === "ENTRY"){
		//left buttons
		btnCancel.appendTo($(leftButtons));
		if(financeRequestAction === 'EDIT'){
			btnDiscard.appendTo($(leftButtons));
		}
		//right buttons
		btnViewPO.appendTo($(rightButtons));
		btnVerify.appendTo($(rightButtons));
		
	}else if(mode == 'VIEW'){
		btnClose.appendTo($(leftButtons)); //left buttons
		btnApprove.appendTo($(rightButtons)); //right buttons
		btnReject.appendTo($(rightButtons)); 
		btnSend.appendTo($(rightButtons)); 
		
		$(btnSend).addClass('hidden');
		$(btnApprove).addClass('hidden');
		$(btnReject).addClass('hidden');
		if(canFinanceAuthourize == 'true'){
			$(btnApprove).removeClass('hidden');
			$(btnReject).removeClass('hidden');
		}
		if(canFinanceSend == 'true'){
			$(btnSend).removeClass('hidden');
		}
	}
	else if (mode === "VERIFY" ){
		$('#txnStep1').removeClass('ft-status-bar-li-active');
		$('#txnStep1').addClass('ft-status-bar-li-done');
		$('#txnStep2').addClass('ft-status-bar-li-active');
		
		btnBack.appendTo($(leftButtons)); //left buttons
		if(financeRequestAction === 'EDIT'){
			btnDiscard.appendTo($(leftButtons));
		}
		btnSubmit.appendTo($(rightButtons)); //right buttons
	}
}


function paintInvoiceFinanceActionButtons(mode){
	$('#poFinanceEntryActionButtonListLB','#poFinanceEntryActionButtonListRB').empty();
	
	var leftButtons = '#poFinanceEntryActionButtonListLB';
	var rightButtons = '#poFinanceEntryActionButtonListRB';
	
	var viewFinanceUrl = null;
	
	if(mode === "ENTRY"){
		viewFinanceUrl = "viewInvoiceFromInvoiceFinanceRequestEntry.form";
	}else if(mode === "VERIFY"){
		viewFinanceUrl = "viewInvoiceFromInvoiceFinanceRequestVerify.form";
	}
	
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
		goToPage(backUrl,'frmMain');
	});
	
	btnCancel = createButton('btnCancel','S');
	btnCancel.click(function(){
		goToPage('invoiceCenter.form','frmMain');
	});

	btnDiscard = createButton('btnDiscard', 'S');
	btnDiscard.click(function(){
		getFinanceDiscardConfirmationPopup('financeCenter.form');
	});
	
	btnVerify = createButton('btnVerify', 'P');
	btnVerify.click(function(){
		goToPage('invoiceFinanceRequestVerify.form','frmMain');
		
	});
	
	btnViewPO = createButton('viewPo','L');
	btnViewPO.click(function() {
		goToPage(viewFinanceUrl,'frmMain');
	});
	
	btnSubmit = createButton('btnSubmit','P');
	btnSubmit.click(function(){
		if(financeRequestAction === 'ADD'){
			addInvoiceFinance('addFinance.form','frmMain');
		}else if(financeRequestAction === 'EDIT'){
			updateInvoiceFinance('updateFinance.form','frmMain');
		}
		blockUI(true);
	});
	
	//approve button
	btnApprove = createButton('btnApprove','P');
	btnApprove.click(function(){
		var msg = ""; 
		var arrayJson = new Array();
		arrayJson.push({
			serialNo : 1,
			identifier : indentifier,
			userMessage : '',
			selectedClient : selectedClient
		});
		
		$.ajax({
			url : "services/invoiceFinance/authourize",
			type : 'POST',
			contentType : "application/json",
			data : JSON.stringify(arrayJson),
			success :function(data){
				var result = data[0];
				var isSuccess = data[0].success;
				
				if(isSuccess == 'N')
				{
						Ext.each(result.errors, function(error) {
							msg = msg + error.code + ' : ' + error.errorMessage;
							errCode = error.code;
							});
						var arrActionMsg = [];
						 arrActionMsg.push({
							success : result.success,
							actualSerailNo : result.serialNo,
							actionTaken : 'Y',
							lastActionUrl : strAction,
							reference : Ext.isEmpty(record) ? '' : record
									.get('poReferenceNmbr'),
							actionMessage : msg
						});
						 getRecentActionResult(arrActionMsg);
				}else{
					goToPage('financeCenter.form','frmMain');
				}
			},
			error : function(data){
			}
		});
	});
	
	//reject button
	btnReject = createButton('btnReject','P');
	btnReject.click(function(){
		getInvoiceFinanceRejectPopup();
	});
	
	//close button
	btnClose = createButton('btnClose','S');
	btnClose.click(function(){
		goToPage('financeCenter.form','frmMain');
	});
	
	//send button
	btnSend = createButton('btnSend','P');
	btnSend.click(function(){
		var arrayJson = new Array();
		arrayJson.push({
			serialNo : 1,
			identifier : identifier,
			userMessage : '',
			selectedClient : selectedClient
		});
		$.ajax({
			url : "services/invoiceFinance/send",
			type : 'POST',
			contentType : "application/json",
			data : JSON.stringify(arrayJson),
			success :function(data){
				var result = data[0];
				var isSuccess = data[0].success;
				
				if(isSuccess == 'N')
				{
						Ext.each(result.errors, function(error) {
							msg = msg + error.code + ' : ' + error.errorMessage;
							errCode = error.code;
							});
						var arrActionMsg = [];
						 arrActionMsg.push({
							success : result.success,
							actualSerailNo : result.serialNo,
							actionTaken : 'Y',
							lastActionUrl : strAction,
							reference : Ext.isEmpty(record) ? '' : record
									.get('poReferenceNmbr'),
							actionMessage : msg
						});
						 getRecentActionResult(arrActionMsg);
				}else{
					goToPage('financeCenter.form','frmMain');
				}
			},
			error : function(data){
			}
		});
	});
	
	if(mode === "ENTRY"){
		//left buttons
		btnCancel.appendTo($(leftButtons));
		//right buttons
		btnViewPO.appendTo($(rightButtons));
		btnVerify.appendTo($(rightButtons));
	}else if (mode === "VERIFY"){
		$('#txnStep1').removeClass('ft-status-bar-li-active');
		$('#txnStep1').addClass('ft-status-bar-li-done');
		$('#txnStep2').addClass('ft-status-bar-li-active');
		if (displayState == 'lbl.transactionStatus.13'){	// For Bank Action
			btnClose.appendTo($(leftButtons));	//left buttons
		}	
		else{
			btnBack.appendTo($(leftButtons));
			//right button
			//btnViewPO.appendTo($(rightButtons));
			if (financeState != "REJECTED")
				btnSubmit.appendTo($(rightButtons));
		}
	}else if(mode === 'VIEW'){
		btnClose.appendTo($(leftButtons)); //left buttons
		btnApprove.appendTo($(rightButtons)); //right buttons
		btnReject.appendTo($(rightButtons)); 
		btnSend.appendTo($(rightButtons)); 
		
		$(btnSend).addClass('hidden');
		$(btnApprove).addClass('hidden');
		$(btnReject).addClass('hidden');
		if(canFinanceAuthourize == 'true'){
			$(btnApprove).removeClass('hidden');
			$(btnReject).removeClass('hidden');
		}
		if(canFinanceSend == 'true'){
			$(btnSend).removeClass('hidden');
		}
	}

	if(mode === "AUTH" || mode === "SEND" || mode === "VIEW"){
		btnClose.appendTo($(leftButtons)); //left buttons
		btnApprove.appendTo($(rightButtons)); //right buttons
		btnReject.appendTo($(rightButtons)); 
		btnSend.appendTo($(rightButtons)); 
		
		if(mode === "AUTH"){
			$(btnSend).addClass('hidden');
			if (forMyAuth === "false"){
				$(btnApprove).addClass('hidden');
				$(btnReject).addClass('hidden');
			}
		}
		if(mode === "SEND"){
			$(btnApprove).addClass('hidden');
			$(btnReject).addClass('hidden');
		}else if (mode === "VIEW"){
			$(btnApprove).addClass('hidden');
			$(btnReject).addClass('hidden');
			$(btnSend).addClass('hidden');
		}
	}
}

function createButton(btnKey, charIsPrimary) {
	 var strCls = charIsPrimary === 'P'
			? 'ft-button canDisable ft-button-primary ft-margin-l'
			: (charIsPrimary === 'L' ? 'ft-btn-link canDisable ' : 'ft-button canDisable ft-button-light');
			
	var elt = null;
	elt = $('<input>').attr({
				'type' : 'button',
				'tabindex':1,
				'class' : strCls,
				'id' : 'button_' + btnKey,
				'value' : mapLbls[btnKey]
			});
	return elt;
}

//formatting finance amount on blur
function formatFinanceAmount(){
	if(!isEmpty($('#poFinanceAmount').val())){
		var financeAmount = $('#poFinanceAmount').val();
		financeAmount = parseFloat(financeAmount);
		if(isNaN(financeAmount)){
			$('#poFinanceAmount').val("0.00");
		}else{
			$('#poFinanceAmount').val(financeAmount.toFixed(2));
		}
		
	}
	
}


//confirmation pop up on discard
function getDiscardConfirmationPopup(backUrl) {
	var confirmPopup = $('#discardConfirmationPopup');
	confirmPopup.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				draggable : false,
				width : "320px",
				buttons : {
					"Ok" : function() {
						var arrayJson = new Array();
						arrayJson.push({
						serialNo : 1,
						identifier : identifier,
						userMessage : ''
						});
						$.ajax({
								url : "services/purchaseOrderFinance/discard",
								type : 'POST',
								contentType : "application/json",
								data : JSON.stringify(arrayJson),
								success :function(data){
									goToPage('poFinanceCenter.form','frmMain');
								},
								error : function(data){
									console.log("error in discarding data")
								}
						});
					},
					Cancel : function() {
						$(this).dialog('destroy');
					}
				}
			});
	confirmPopup.dialog('open');
}

function getFinanceDiscardConfirmationPopup(backUrl) {
var confirmPopup = $('#discardConfirmationPopup');
confirmPopup.dialog({
		bgiframe : true,
		autoOpen : false,
		modal : true,
		resizable : false,
		draggable : false,
		width : "320px",
		buttons : {
			"Ok" : function() {
				var arrayJson = new Array();
				arrayJson.push({
				serialNo : 1,
				identifier : identifier,
				userMessage : ''
				});
				$.ajax({
						url : "services/purchaseOrderFinance/discard",
						type : 'POST',
						contentType : "application/json",
						data : JSON.stringify(arrayJson),
						success :function(data){
							goToPage(backUrl,'frmMain');
						},
						error : function(data){
							console.log("error in discarding data")
						}
				});
			},
			Cancel : function() {
				$(this).dialog('destroy');
			}
		}
	});
	confirmPopup.dialog('open');
}

function getFinanceRejectPopup() {
	$('#rejectPopup').dialog( {
		title : mapLbl['rejectRemarkPopUpTitle'],
		autoOpen : false,
		bgiframe : true,
		resizable : false,
		width : 380,
		modal : true,
		buttons : {
				"OK" : function() {
					var userMessage = $('#txtAreaRejectRemark').val();
					console.log(userMessage)
					var arrayJson = new Array();
					var ysue
					arrayJson.push({
						serialNo : 1,
						identifier : indentifier,
						userMessage : '',
						selectedClient : selectedClient
					});
					$.ajax({
						url : "services/purchaseOrderFinance/reject",
						type : 'POST',
						contentType : "application/json",
						data : JSON.stringify(arrayJson),
						success :function(data){
							var result = data[0];
							var isSuccess = data[0].success;
							var msg="";
							if(isSuccess == 'N')
							{
									Ext.each(result.errors, function(error) {
										msg = msg + error.code + ' : ' + error.errorMessage;
										errCode = error.code;
										});
									var arrActionMsg = [];
									 arrActionMsg.push({
										success : result.success,
										actualSerailNo : result.serialNo,
										actionTaken : 'Y',
										reference : poFinanceReferenceNo,
										actionMessage : msg
									});
									 getRecentActionResult(arrActionMsg);
							}else{
								goToPage('poFinanceCenter.form','frmMain');
							}
							
						},
						error : function(data){
							console.log("error in approving data")
						}
					});
				},
				"Cancel" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#rejectPopup').dialog("open");
}

function getInvoiceFinanceRejectPopup()
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		bgiframe : true,
		resizable : false,
		width :  380,
		modal : true,
		buttons : {
				"OK" : function() {
					var userMessage = $('#txtAreaRejectRemark').val();
					var arrayJson = new Array();
					arrayJson.push({
						serialNo : 1,
						identifier : indentifier,
						userMessage : userMessage,
						selectedClient : selectedClient
					});
					$.ajax({
						url : "services/invoiceFinance/reject",
						type : 'POST',
						contentType : "application/json",
						data : JSON.stringify(arrayJson),
						success : function(data){
							goToPage('financeCenter.form','frmMain');
						},
						error : function(data){
						}
					});
				},
				"Cancel" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#rejectPopup').dialog("open");
	$('#rejectPopup').dialog('option','position','center');
}

function showInvoiceInfoPopup(strPmtType) {
	$('#invFinTrasanctionSummaryDiv').dialog({
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				dialogClass : 'ft-dialog',
				title : getLabel('TransactionInformation','Transaction Information'),

				open : function() {
					$('#invFinTrasanctionSummaryDiv').removeClass('hidden');
					$("#importedTxnDetailsInfoGrid").empty();
					auditData = getInvoiceAddtionInformationData(identifier);
					paintInvoiceAdditionalInfo(poFinanceResponseHeaderData.d)
					
					if(null != auditData && auditData.history.length>0)
						paintInvoiceTransactionAuditInfoGrid(auditData.history);
					$('#invFinTrasanctionSummaryDiv').dialog('option','position','center'); 
				},
				close : function() {
					$(this).dialog("close");
				}
			});
	$('#invFinTrasanctionSummaryDiv').dialog("open");
	$('#invFinTrasanctionSummaryDiv').dialog('option','position','center');
}

function paintInvoiceTransactionAuditInfoGrid(data) {
	var renderToDiv = 'auditInfoGridDiv';
	
	if (!isEmpty(renderToDiv)) {
		$("#audit_InfoSpan").removeClass('hidden');
		$('#'+renderToDiv).empty();
		var store = createAuditInfoGridStore(data);
		var grid = Ext.create('Ext.grid.Panel', {
			store : store,
			popup : true,
			columns : [{
						dataIndex : 'userCode',
						text : mapLbls['txnUser'],
						width : 150,
						draggable : false,
						resizable : false,
						sortable: false,
						hideable : false
					}, {
						dataIndex : 'logDate',
						text : mapLbls['txnDateTime'],
						width : 200,
						draggable : false,
						sortable: false,
						resizable : false,
						hideable : false
					}, {
						dataIndex : 'statusDesc',
						text : mapLbls['txnAction'],
						width : 150,
						draggable : false,
						sortable: false,
						resizable : false,
						hideable : false
						
					}, {
						dataIndex : 'rejectRemarks',
						text : mapLbls['txnRemarks'],
						flex : 1,
						draggable : false,
						resizable : false,
						sortable: false,
						hideable : false
					}],
			renderTo : renderToDiv
			});
		var layout = Ext.create('Ext.container.Container',{
			width: 'auto',
			items: [grid],
           renderTo: renderToDiv
		});
		auditGrid=layout;
		return layout;
	}
}
function getInvoiceAddtionInformationData(strIdentifier) {
	var objResponseData = null;
	if (strIdentifier && strIdentifier != '') {
		var strUrl = 'services/invoiceFinTxnInfo(' + strIdentifier + ').json';
		$.ajax({
					url : strUrl,
					type : 'POST',
					async : false,
					contentType : "application/json",
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							// TODO : Error handling to be done.
						}
					},
					success : function(data) {
						if (data && data.d)
							objResponseData = data.d;
					}
				});
	}
	return objResponseData;
}

function createAuditInfoGridStore(jsonData) {
	var myStore = Ext.create('Ext.data.Store', {
				fields : ['zone', 'version', 'recordKeyNo', 'userCode',
							'logDate', 'requestState', 'phdClient', 'logNumber',
							'pirNumber', 'pirSerial', 'avmLevel', 'rejectRemarks',
							'__metadata', 'action', 'invoiceState','statusDesc'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}
function paintInvoiceAdditionalInfo(data) {
	if (null != data){
		$(".hdrAnchorClient_InfoSpan").text(data.anchorCompanyInfo.company+' '+data.anchorCompanyInfo.companyAddress);
		var objInfo = data.counterPartyCompanyInfo;
		var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
		strText += '<br/>'
				+ (!isEmpty(objInfo.companyAddress)
						? objInfo.companyAddress
						: '');
		$(".hdrCounterparty_InfoSpan").html(strText);
		$(".hdrWorkflow_InfoSpan").text(data.workflow);
		$(".hdrPackage_InfoSpan").text(data.packageName);
		$(".hdrEnteredby_InfoSpan").text(data.enteredBy);
		$(".hdrDatasource_InfoSpan").text(data.dataSource);
	}
	if (null != data && data.invStatus && data.invStatus != '')
		$(".hdrStatus_InfoSpan").text(data.invStatus);
	else
		$('#divStatus_InfoSpan').addClass('hidden');
	if (null != data && data.invHeaderInfo && data.invHeaderInfo.entryWorkflow){
		$(".workflow_InfoSpan").text(data.invHeaderInfo.entryWorkflow);
		$(".entryenrichment_InfoSpan").text(data.invHeaderInfo.entryEnrchWorkflow);
		$(".acceptance_InfoSpan").text(data.invHeaderInfo.accpWorkflow);
		$(".acceptanceEnrich_InfoSpan").text(data.invHeaderInfo.accpEnrchWorkflow);
	}else{
		$('#additionalInfo_InfoSpan').addClass('hidden');
	}
}

function getRecentActionResultFontColor(record){
	if(record.success==='Y'){
		return 'success_font';
	}
	else if (record.success === 'N')
		return 'error_font ';
}
function getRecentActionResult(record){
	if ($('#actionResultInfoDiv').children('.row').length > 0) {
		$('#actionResultInfoDiv').children('.row').remove();
	}
	var intSrNo = 0;
	for(var i=0;i<record.length;i++){
		intSrNo = record[i].actualSerailNo;
		$('#actionResultDiv').removeClass('ui-helper-hidden');
		//add a row
		var rowDiv=document.createElement('div');
		$(rowDiv).addClass('row form-control-static');
		var delimitor='&nbsp;'
		if(record[i].success==='N'){
		delimitor='<br/>';
		}
		var fontColor=getRecentActionResultFontColor(record[i]);
		$(rowDiv).append($('<p>',{
		class:'col-sm-10 '+fontColor,
		id:'actionMsg'+intSrNo,
		style : 'margin-left : 5px',
		html : mapLbls['poNumber']+' : '+record[i].reference+delimitor+record[i].actionMessage
		}));
		//add row to main div
		$(rowDiv).appendTo('#actionResultInfoDiv');
	}
}

function blockUI(blnBlock) {
	if (blnBlock === true) {
		$("#pageContentDiv").addClass('hidden');
		$('#blockUIDiv').removeClass('hidden');
		$('#blockUIDiv').block({
			overlayCSS : {
				opacity : 0
			},
			baseZ : 2000,
			message : '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
			css : {
			}
		});
	} else {
		$("#pageContentDiv").removeClass('hidden');
		$('#blockUIDiv').addClass('hidden');
		$('#blockUIDiv').unblock();
	}
}
function loadHeaderFields(strMyProduct, anchorClient) {
	// blockpoFinanceUI(true);
	if (!isEmpty(strMyProduct)) {
		var url = 'services/invoiceFinanceTxnHeaderInfo' + "/" + strMyProduct;
		$.ajax({
			type : "POST",
			url : url,
			data : {
				$productRelClient : anchorClient,
				$poViewState : invIdentifier,
				$finEnteredClient : finEnteredClient
			},
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					var arrError = new Array();
					arrError.push({
								"errorCode" : "Message",
								"errorMessage" : mapLbl['unknownErr']
							});
					paintErrors(arrError);
					blockpoFinanceUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForpoFinanceHeader(data.d.message.errors);
						blockpoFinanceUI(false);
					} else {
						poFinanceResponseHeaderData = data;
					}
				}
			}
		});
	} else {
		doHandleUnknownErrorForBatch();
		blockpoFinanceUI(false);
	}
}