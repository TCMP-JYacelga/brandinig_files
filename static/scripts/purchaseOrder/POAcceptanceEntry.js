var mapLbl = {'txnRemarks':"Remarks", 'txnUser':"User", 'txnAction' :'Action', 'txnDateTime' : 'DateTime'};
var poAcceptanceResponseHeaderData = null;
var strpoAcceptanceAdditionalInfoData = null;
function showAcceptanceTxnInfoPopup() {
	$('#purchaseOrderSummaryDiv').dialog({
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				dialogClass : 'ft-dialog',
				draggable:false,
				title : 'Transaction Information',
				open : function() {
					$('#purchaseOrderSummaryDiv').removeClass('hidden');
					paintTransactionInformation(identifier,false, 'VERIFY');
						$('#purchaseOrderSummaryDiv').dialog('option','position','center'); 
				},
				close : function() {
				}
			});
	$('#purchaseOrderSummaryDiv').dialog("open");
	$('#purchaseOrderSummaryDiv').dialog('option','position','center');
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


//formatting acceptance amount on blur
function formatAcceptanceAmount(){
	if(!isEmpty($('#acceptedAmount').val())){
		var acceptanceAmount = $('#acceptedAmount').val();
		acceptanceAmount = parseFloat(acceptanceAmount);
		if(isNaN(acceptanceAmount)){
			$('#acceptedAmount').val("0.00");
		}else{
			$('#acceptedAmount').val(acceptanceAmount.toFixed(2));
		}
		
	}
	
}

//formatting deducted amount on blur
function formatDeductedAmount(){
	if(!isEmpty($('#deductedAmount').val())){
		var deductedAmount = $('#deductedAmount').val();
		deductedAmount = parseFloat(deductedAmount);
		if(isNaN(deductedAmount)){
			$('#deductedAmount').val("0.00");
		}else{
			$('#deductedAmount').val(deductedAmount.toFixed(2));
		}
		
	}
	
}

function goToPage(strUrl, frmId)
{
	 var frm = document.getElementById(frmId);
	 frm.action = strUrl;
	 frm.target = "";
	 frm.method = "POST";
	 frm.submit();
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
								url : "services/purchaseOrderAcceptance/discard/SELLER",
								type : 'POST',
								contentType : "application/json",
								data : JSON.stringify(arrayJson),
								success :function(data){
									goToPage('poAcceptanceCenter.form','frmMain');
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


function addInvoiceAcceptance(strUrl, frmId) 
{
	frm = document.getElementById(frmId);
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'poEnteredByClient',	poEnteredByClientCode));
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'counterPartyName',	counterPartyName));
	frm.action = strUrl;
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}

function updateInvoiceAcceptance(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'poEnteredByClient',	poEnteredByClientCode));
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'counterPartyName',	counterPartyName));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function paintPoAcceptanceActionButtons(mode){
	$('#poAcceptanceEntryActionButtonListLB','#poAcceptanceEntryActionButtonListRB').empty();
	
	var leftButtons = '#poAcceptanceEntryActionButtonListLB';
	var rightButtons = '#poAcceptanceEntryActionButtonListRB';
	var viewPoUrl = null;
	
	if(mode === "ENTRY"){
		viewPoUrl = "viewPoFromPoAcceptanceRequestEntry.form"
	}else if(mode === "VERIFY"){
		viewPoUrl = "viewPoFromPoAcceptanceRequestVerify.form"
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
		//goToPage('poAcceptanceRequestVerify.form','frmMain');
		if(acceptanceRequestAction === 'ADD'){
			addInvoiceAcceptance('addPOAcceptance.form','frmMain');
		}else if(acceptanceRequestAction === 'EDIT'){
			updateInvoiceAcceptance('updatePOAcceptance.form','frmMain');
		}
		
	});
	
	//view PO button
	btnViewPO = createButton('viewPo','L');
	btnViewPO.click(function() {
		goToPage(viewPoUrl,'frmMain');
	});
	
	//submit button
	btnSubmit = createButton('btnSubmit','P');
	btnSubmit.click(function(){
		/*if(acceptanceRequestAction === 'ADD'){
			addInvoiceAcceptance('addPOAcceptance.form','frmMain');
		}else if(acceptanceRequestAction === 'EDIT'){
			updateInvoiceAcceptance('updatePOAcceptance.form','frmMain');
		}*/
		goToPage('submitPOAcceptance.form','frmMain');
		blockUI(true);
	});
	
	//approve button
	btnApprove = createButton('btnApprove','P');
	btnApprove.click(function(){
		 
		var arrayJson = new Array();
		arrayJson.push({
			serialNo : 1,
			identifier : identifier,
			userMessage : ''
		});
		
		$.ajax({
			url : "services/purchaseOrderAcceptance/authourize/"+clientMode,
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
							reference : poRefNo,
							actionMessage : msg
						});
						 getRecentActionResult(arrActionMsg);
				}else{
					goToPage('poAcceptanceCenter.form','frmMain');
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
		getPOAcceptanceRejectPopup()
	});
	
	//cancel button
	btnCancel = createButton('btnCancel','S');
	btnCancel.click(function(){
		if(isEmpty($('#poAcceptIntRefNumber').val())
				|| (!isEmpty($('#poAcceptIntRefNumber').val()) && $('#poAcceptIntRefNumber').val() == '0'))
		{
			
			goToPage('purchaseOrderCenter.form','frmMain');
		}
		else 
		{
			goToPage('poAcceptanceCenter.form','frmMain');
		}
			
	});
	
	//close button
	btnClose = createButton('btnClose','S');
	btnClose.click(function(){
		if(backUrl != ''){
			goToPage(backUrl,'frmMain');
		}else{			
			goToPage('poAcceptanceCenter.form','frmMain');
		}
	});
	
	//send button
	btnSend = createButton('btnSend','P');
	btnSend.click(function(){
		var arrayJson = new Array();
		arrayJson.push({
			serialNo : 1,
			identifier : identifier,
			userMessage : ''
		});
		$.ajax({
			url : "services/purchaseOrderAcceptance/send/"+clientMode,
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
							reference : poRefNo,
							actionMessage : msg
						});
						 getRecentActionResult(arrActionMsg);
				}else{
					goToPage('poAcceptanceCenter.form','frmMain');
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
		if(acceptanceRequestAction === 'EDIT' && acceptanceState!='REJECTED'){
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
		if(canAcceptanceAuthourize == 'true'){
			$(btnApprove).removeClass('hidden');
			$(btnReject).removeClass('hidden');
		}
		if(canAcceptanceSend == 'true'){
			$(btnSend).removeClass('hidden');
		}
	}
	else if (mode === "VERIFY" ){
		$('#txnStep1').removeClass('ft-status-bar-li-active');
		$('#txnStep1').addClass('ft-status-bar-li-done');
		$('#txnStep2').addClass('ft-status-bar-li-active');
		
		btnBack.appendTo($(leftButtons)); //left buttons
		if(acceptanceRequestAction === 'EDIT' && acceptanceState!='REJECTED'){
			btnDiscard.appendTo($(leftButtons));
		}
		//right buttons
		btnSubmit.appendTo($(rightButtons)); //right buttons
	}
}

function paintTransactionInformation(strIdentifier, blnCollapsed, strMode) {
	var strPostFix = '_InfoSpan', fieldName = null, strValueToBeDisplayed = null, intMaxFieldLength = 20, blnHistoryExists = false, strAuthLevel = 'B',strhdrActionStatus ='';
	// if (isEmpty(strpoFinanceAdditionalInfoData))
	var objValue = null;
	if(acceptanceState != null)
	{
		strpoAcceptanceAdditionalInfoData = getpoAcceptanceAddtionInformationData(strIdentifier);
	 }
	if(poAcceptanceResponseHeaderData && poAcceptanceResponseHeaderData.d && poAcceptanceResponseHeaderData.d.anchorCompanyInfo)
	{
		var objInfo = poAcceptanceResponseHeaderData.d.anchorCompanyInfo;
			var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
			strText += (!isEmpty(objInfo.companyAddress)
							? objInfo.companyAddress
							: '');
			$('.anchorClientInfoHdr').html(strText); 
		
	}
	
	if(poAcceptanceResponseHeaderData && poAcceptanceResponseHeaderData.d && poAcceptanceResponseHeaderData.d.counterPartyCompanyInfo)
	{
			objInfo = poAcceptanceResponseHeaderData.d.counterPartyCompanyInfo;
			var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
			strText += (!isEmpty(objInfo.companyAddress)
							? objInfo.companyAddress
							: '');
			$('.counterPartyInfoHdr').html(strText); 
			
		
	}
	
	if(poAcceptanceResponseHeaderData && poAcceptanceResponseHeaderData.d && poAcceptanceResponseHeaderData.d.workflow)
	{
		objValue = poAcceptanceResponseHeaderData.d.workflow;
		$('.workflowInfoHdr').html(objValue); 
	}
	
	if(poAcceptanceResponseHeaderData && poAcceptanceResponseHeaderData.d && poAcceptanceResponseHeaderData.d.packageName)
	{
		objValue = poAcceptanceResponseHeaderData.d.packageName;
		$('.packageNameInfoHdr').html(objValue); 
	}
	
	if(poAcceptanceResponseHeaderData && poAcceptanceResponseHeaderData.d && poAcceptanceResponseHeaderData.d.enteredBy)
	{
		objValue = poAcceptanceResponseHeaderData.d.enteredBy;
		$('.enteredByInfohdr').html(objValue); 
	}
	
	if(poAcceptanceResponseHeaderData && poAcceptanceResponseHeaderData.d && poAcceptanceResponseHeaderData.d.dataSource)
	{
		objValue = poAcceptanceResponseHeaderData.d.dataSource;
		$('.dataSourceInfohdr').html(objValue); 
	}
	
	if(poAcceptanceResponseHeaderData && poAcceptanceResponseHeaderData.d && poAcceptanceResponseHeaderData.d.cpAcceptanceWorkflow)
	{
		$('.acceptanceEntryWorkflowInfoHdr').empty();
		objValue = poAcceptanceResponseHeaderData.d.cpAcceptanceWorkflow;
		$('.acceptanceEntryWorkflowInfoHdr').html(objValue); 
	}
	else{
	    $('.acceptanceEntryWorkflowInfoHdr_parent').hide();
	}
	if(poAcceptanceResponseHeaderData && poAcceptanceResponseHeaderData.d && poAcceptanceResponseHeaderData.d.acceptanceEnrichmentProfile)
	{
		objValue = poAcceptanceResponseHeaderData.d.acceptanceEnrichmentProfile;
		$('.acceptanceEnrichmentInfoHdr').html(objValue); 
	}
	else
	{
		$('.acceptanceEnrichmentInfoHdr_parent').hide();
	}
	// Hide Status Div Initially
	$('.statusDiv').hide();
	$('.auditInformationInfoHdrDiv').hide();
	if(strpoAcceptanceAdditionalInfoData && strpoAcceptanceAdditionalInfoData.poStatus)
	{
		objValue = strpoAcceptanceAdditionalInfoData.poStatus;
		$('.statusDiv').show();
		$('.statusInfo').html(objValue); 
	}
	if(strpoAcceptanceAdditionalInfoData && strpoAcceptanceAdditionalInfoData.history && strpoAcceptanceAdditionalInfoData.poStatus && strpoAcceptanceAdditionalInfoData.history.length > 0)
	{
		$('.auditInformationInfoHdrDiv').show();
		paintpoAcceptanceTransactionAuditInfoGrid(strpoAcceptanceAdditionalInfoData.history, '');
	}
	
}

function getpoAcceptanceAddtionInformationData(strIdentifier) {
	var objResponseData = null;
	if (strIdentifier && strIdentifier != '') {
		var strUrl = 'services/poAcceptanceTxnInfo/(' + strIdentifier + ').json';
		$.ajax({
					url : strUrl,
					type : 'POST',
					async : false,
					contentType : "application/json",
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							// TODO : Error handling to be done.
							// alert("Unable to complete your request!");
							// blockpoFinanceUI(true);
						}
					},
					success : function(data) {
						if (data && data.d)
							objResponseData = data.d;
					}
				});
	}
	/*
	 * Remove comments to test with Dummay data if (isEmpty(objResponseData)) {
	 * objResponseData = dummayAdditionalInfoJson; }
	 */
	return objResponseData;
}

function paintpoAcceptanceTransactionAuditInfoGrid(data, strMode) {
	var renderToDiv = null;
	renderToDiv = 'auditInfoGridDiv';
	
	if (!isEmpty(renderToDiv)) {
		$('#'+renderToDiv).empty();
		var store = createAuditInfoGridStore(data);
		var grid = Ext.create('Ext.grid.Panel', {
			store : store,
			popup : true,
			columns : [{
						dataIndex : 'userCode',
						text : mapLbl['txnUser'],
						width : 150,
						draggable : false,
						resizable : false,
						sortable: false,
						hideable : false
					}, {
						dataIndex : 'logDate',
						text : mapLbl['txnDateTime'],
						width : 200,
						draggable : false,
						resizable : false,
						sortable: false,
						hideable : false
					}, {
						dataIndex : 'statusDesc',
						text : mapLbl['txnAction'],
						width : 150,
						draggable : false,
						resizable : false,
						sortable: false,
						hideable : false
					}, {
						dataIndex : 'rejectRemarks',
						text : mapLbl['txnRemarks'],
						flex : 1,
						draggable : false,
						sortable: false,
						resizable : false,
						hideable : false,
						renderer : function(value, metadata) {
								if(!Ext.isEmpty(value) && value.length > 11){
									metadata.tdAttr = 'title="' + value + '"';
			                    	return value;
								}
								else{
									return value;
								}
			            }
					}],
			renderTo : renderToDiv
				/*
			 * , afterRender : function() { if(strPmtType==='Q')
			 * $('#poAcceptanceInstrumentTrasanctionSummaryDiv
			 * span.expand-vertical').trigger('click'); else
			 * if(strPmtType==='B') $('#poAcceptanceHeadeerTrasanctionSummaryDiv
			 * span.expand-vertical').trigger('click'); }
			 */
			});
		grid.on('afterlayout', function() {
			if (strMode && strMode !== 'VERIFY') {
				$('#poAcceptanceInstrumentTrasanctionSummaryDiv span.expand-vertical')
							.trigger('click');
			}			
		});
		return grid;
	}
}

function createAuditInfoGridStore(jsonData) {
	var myStore = Ext.create('Ext.data.Store', {
				fields : ['recordKeyNo', 'userCode',
						'logDate', 'requestState', 'statusDesc', 'rejectRemarks'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}

function closeTransactionInfoPopup(){
	$('#purchaseOrderSummaryDiv').dialog("close");
}

function loadPOAcceptanceHeaderFields(strMyProduct, anchorClient) {
	// blockpoAcceptanceUI(true);
	if (!isEmpty(strMyProduct)) {
		var url = 'services/poAcceptanceTxnHeaderInfo' + "/" + strMyProduct;
		$.ajax({
			type : "POST",
			url : url,
			data : {
				$productRelClient : anchorClient,
				$poViewState : poIdentifier,
				$acceptEnteredClient : acceptEnteredClient,
				$enteredByClient:poEnteredByClientCode,
				$counterPartyName:counterPartyName
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
					blockpoAcceptanceUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForpoAcceptanceHeader(data.d.message.errors);
						blockpoAcceptanceUI(false);
					} else {
						poAcceptanceResponseHeaderData = data;
					}
				}
			}
		});
	} else {
		//doHandleUnknownErrorForBatch();
		//blockpoAcceptanceUI(false);
	}
}


function goToPage(strUrl, frmId)
{
	 var frm = document.getElementById(frmId);
	 frm.action = strUrl;
	 frm.target = "";
	 frm.method = "POST";
	 frm.submit();
}
function goToPage(strUrl, frmId, poInternalRefNmbr)
{
    document.getElementById("txtPOAccIntRefNum").value = poInternalRefNmbr;
	 var frm = document.getElementById(frmId);
	  frm.appendChild(createFormField('INPUT', 'HIDDEN', 'poEnteredByClient',	poEnteredByClientCode));
	 frm.appendChild(createFormField('INPUT', 'HIDDEN', 'counterPartyName',	counterPartyName));
	 frm.action = strUrl;
	 frm.target = "";
	 frm.method = "POST";
	 frm.submit();
}

function goToBackPage(strUrl, frmId)
{
	if($('#dirtyBit').val()=="1")
		{
		getConfirmationPopup(frmId, strUrl);
		}
	else
	{
	 javascript:window.history.back();
	}
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
					javascript:window.history.back();
					},
				"No" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#confirmPopup').dialog("open");
}
function addPOAcceptance(strUrl, frmId) 
{
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function updatePOAcceptance(strUrl, frmId) 
{
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function viewEnrichAttachment(strUrl, frmId, invoiceInternalRefNumber,
		enrichcode) 
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtPOAccIntRefNum").value = invoiceInternalRefNumber;
	document.getElementById("txtEnrichCode").value = enrichcode;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	frm.submit();
}
function sectionCollapseExpandOnLoad()
{
	var labels = $(".enrichLabel.required").size();
	if(labels!=0)
	{
		$("#title_deduction_AdditionalDtls").children('a').toggleClass("icon-expand-minus icon-collapse-plus");
		$("#title_deduction_AdditionalDtls").next().slideToggle("fast");
		return;
	}
	$(".enrichValue").each(function(){
		if(!isEmpty($(this).val()))
		{
			$("#title_Acceptance_AdditionalDtls").children('a').toggleClass("icon-expand-minus icon-collapse-plus");
			$("#title_Acceptance_AdditionalDtls").next().slideToggle("fast");
			return;				
		}
	});				
}

function showClearIfSelect(fileId, ctrlId, textId) 
{
	var file = $("#" + fileId).val();

	if (file != "") {
		$("#" + textId).text(file);
		$("#" + ctrlId).show();
		$("#" + fileId).hide();
		$("#" + fileId).next().hide();		
	} else {
		$("#" + ctrlId).hide();
	}
}
function clearFile() 
{
	var ctrl = document.getElementById("fileText");
	if(ctrl != null)
	{
		ctrl.value = "";
		$("#fileText").text("");
	}
	var ctrl = document.getElementById("clearInvoiceFile");
	if(ctrl != null)
	{
		$("#clearInvoiceFile").hide();
	}
	var ctrl = document.getElementById("clearFile");
	if(ctrl != null)
	{
		$("#clearFile").hide();
	}
	var ctrl = document.getElementById("invoiceFileUploadFlag");
	if(ctrl != null)
	{	
		ctrl.value = "N";
		$("#invoiceFileUploadFlag").val("N");
	}
	var ctrl = document.getElementById("updateInvoiceFileSelector");
	if(ctrl != null)
	{	
		$("#updateInvoiceFileSelector").show();
	}
	var ctrl = document.getElementById("invoiceFile");
	if(ctrl != null)
	{
		ctrl.value = "";
		$("#invoiceFile").val("");
		$("#invoiceFile").show();
		$("#invoiceFile").next().show();
	}
}
function clearEnrichFile(fileId, ctrlId, uploadFlagId, uploadSelectorId, textId) 
{
	var ctrl = document.getElementById(fileId);
	if(ctrl != null)
	{
		ctrl.value = "";
		$("#" + fileId).val("");
		$("#" + fileId).show();
		$("#" + fileId).next().show();
	}
	var ctrl = document.getElementById(textId);
	if(ctrl != null)
	{
		ctrl.value = "";
		$("#" + textId).text("");
	}
	var ctrl = document.getElementById(ctrlId);
	if(ctrl != null)
	{
		$("#" + ctrlId).hide();
	}
	var ctrl = document.getElementById(uploadSelectorId);
	if(ctrl != null)
	{	
		$("#" + uploadSelectorId).show();
	}
	var ctrl = document.getElementById(uploadFlagId);
	if(ctrl != null)
	{
		ctrl.value = "N";
		$("#" + uploadFlagId).val("N");
	}
}
function showPOAccptUploadEnrDialog(enrichFileId) {
	var ctrlFile = $('#' + enrichFileId);
	ctrlFile.trigger('click');
}
function updatePOAccptEnrFileName(enrichFileId, spanFileName,
		removeLink, fileAction, uploadFlagId, upldFileName) {

	var ctrlFile = $('#' + enrichFileId);
	var fileNameSpan = $('.' + spanFileName);
	var rLink = $('#' + removeLink);
	var fAction = $('#' + fileAction);
	
	if(ctrlFile && ctrlFile[0] && ctrlFile[0].files[0])
	{
		var strUploadedImageName = ctrlFile[0].files[0].name;
		fileNameSpan.text(strUploadedImageName);
		rLink.removeClass('hidden');
		fAction.addClass('hidden');
		fileNameSpan.prop('title',strUploadedImageName);
		$("#" + uploadFlagId).val("Y");
		$("#" + upldFileName).val(strUploadedImageName);
	}
}
function removePOAccptEnrUploadedImage(enrichFileId, spanFileName,
		removeLink, fileAction, viewAction, uploadFlagId, upldFileName) {
	var control = $('#' + enrichFileId);
	var fileNameSpan = $('.' + spanFileName);
	var rLink = $('#' + removeLink);
	var fAction = $('#' + fileAction);
	var vAction = $('#' + viewAction);
	
	control.replaceWith(control = control.clone(true));
	rLink.addClass('hidden');
	fAction.removeClass('hidden');
//	$(".fileName_InfoSpan").text('No File Uploaded');
	fileNameSpan.text('');
//	$("#fileNameHdr").val("");
	fileNameSpan.prop('title', '');
	vAction.addClass('hidden');
	$("#" + uploadFlagId).val("N");
	$("#" + upldFileName).val('');
//    removeFlag='Y';
//	isFileUploaded=false;
	
}

function showUploadDialogEnrich(hlnk,enrichHiddenFlag,viewAttachmentInvoiceEnrichId,fileActionId,divFilUploadId,enrichFileId,fileUploadFlag)
{
var ctrlFile = document.getElementById(enrichFileId);
var ctrlFileUploadFlag = document.getElementById(fileUploadFlag);
var ctrlEnrichHiddenFlag = document.getElementById(enrichHiddenFlag);
if (ctrlEnrichHiddenFlag.value=="N") 
{
 $(hlnk).find('span').text('Import File..');
 $("#"+viewAttachmentInvoiceEnrichId).addClass("ui-helper-hidden");
 if (!$.browser.msie) {
	  ctrlFile.value = '';
	  }
	  else{
		  	$("#"+enrichFileId).replaceWith($("#"+enrichFileId).clone(true));
		  }
 ctrlFileUploadFlag.value="N";
 ctrlEnrichHiddenFlag.value="Y"
 setDirtyBit();
} 
else 
{
 var dlg = $('#'+divFilUploadId);
 dlg.dialog({
   bgiframe:true,
   autoOpen:false,
   height:"auto",
   modal:true,
   resizable:false,
   width:'auto',
   hide:"explode",
   buttons: {
    "Ok": function() {
     if (ctrlFile.value != null && ctrlFile.value !="") {
      var fileText = 'Remove File.. '+ctrlFile.value;
      $(hlnk).find('span').text(fileText);
      ctrlFileUploadFlag.value="Y";
      ctrlEnrichHiddenFlag.value="N"
     }
     $(this).dialog("close");
    },
    Cancel: function() {
  	  if (!$.browser.msie) {
		  ctrlFile.value = '';
		  }
		  else{
			  	$("#"+enrichFileId).replaceWith($("#"+enrichFileId).clone(true));
			  }
     $(hlnk).find('span').text('Import File..');
     $(this).dialog('destroy');
     ctrlFileUploadFlag.value="N";
     ctrlEnrichHiddenFlag.value="Y"
    }
   }
  }
 );
 dlg.parent().appendTo($('#frmMain'));
 dlg.dialog('open');
}
}

function saveAcceptance(strUrl,frmId)
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

jQuery.fn.dateTextBox = function() {
		return this
				.each(function() {
					$(this)
							.keydown(function(e) {
								var key = e.charCode || e.keyCode || 0;
								// allow backspace, tab, delete, arrows, numbers and
								// keypad for TAB
								return (key == 9 || key==8 || key==46);
								})
				})
	};

function getPOAcceptanceRejectPopup(strUrl, frmId) {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 360,
		width : 380,
		modal : true,
		buttons : {
				"OK" : function() {
					$('#txtAreaRejectRemark').val('');
					var userMessage = $('#txtAreaRejectRemark').val();
					var arrayJson = new Array();
					arrayJson.push({
						serialNo : 1,
						identifier : identifier,
						userMessage : userMessage
					});
					$.ajax({
						url : "services/purchaseOrderAcceptance/reject/SELLER",
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
										reference : poRefNo,
										actionMessage : msg
									});
									 getRecentActionResult(arrActionMsg);
									 $('#rejectPopup').dialog("close");
							}else{
								goToPage('poAcceptanceCenter.form','frmMain');
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