function goToPage(strUrl, frmId)
{
	 var frm = document.getElementById(frmId);
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
		var frm = document.getElementById(frmId);
		if(frm!=null && frm.action!=null)
		{
			var temp = frm.action;
			if(temp.indexOf('showAcceptance')>-1)
				strUrl = 'invoiceCenter.form';
			else
				strUrl = 'acceptanceCenter.form';
		}
		
		goToPage(strUrl, frmId);
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
function addInvoiceAcceptance(strUrl, frmId) 
{
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function updateInvoiceAcceptance(strUrl, frmId) 
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
	document.getElementById("txtInvAccIntRefNum").value = invoiceInternalRefNumber;
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

function paintAcceptanceActionButtons(mode)
{
	$('#poFinanceEntryActionButtonListLB','#poFinanceEntryActionButtonListRB').empty();
	
	var leftButtons = '#poFinanceEntryActionButtonListLB';
	var rightButtons = '#poFinanceEntryActionButtonListRB';
	
	var viewFinanceUrl = null;
	
	if(mode === "ENTRY"){
		viewFinanceUrl = "viewInvoiceFromInvAcceptanceRequestEntry.form"
	}
	
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
		if(newMode === "INVOICEVIEW")
			goToPage(backUrl,'frmMain');
		else if(mode === "VERIFY")
			goToPage(backUrl,'frmMain');
		else
		goToPage('acceptanceCenter.form','frmMain');
	});

	btnDiscard = createButton('btnDiscard', 'S');
	btnDiscard.click(function(){
		if(financeRequestAction === 'ADD'){
			getDiscardConfirmationPopup('invoiceCenter.form');
		}else if(financeRequestAction === 'EDIT'){
			getDiscardConfirmationPopup('acceptanceCenter.form');
		}
	});
	
	btnVerify = createButton('btnVerify', 'P');
	btnVerify.click(function(){
		//goToPage('invoiceAcceptanceRequestVerify.form','frmMain');
		if(financeRequestAction === 'ADD'){
			addInvoiceAcceptance('addAcceptance.form','frmMain');
		}else if(financeRequestAction === 'EDIT'){
			updateInvoiceAcceptance('updateAcceptance.form','frmMain');
		}
		
	});
	
	btnViewPO = createButton('viewPo','L');
	btnViewPO.click(function() {
		goToPage(viewFinanceUrl,'frmMain');
	});
	
	btnSubmit = createButton('btnSubmit','P');
	btnSubmit.click(function(){
		/*if(financeRequestAction === 'ADD'){
			addInvoiceAcceptance('addAcceptance.form','frmMain');
		}else if(financeRequestAction === 'EDIT'){
			updateInvoiceAcceptance('updateAcceptance.form','frmMain');
		}*/
		goToPage('submitInvoiceAcceptance.form','frmMain');
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
			userMessage : ''
		});
		
		$.ajax({
			url : "services/invoiceAcceptance/authourize",
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
							reference : invNumber,
							actionMessage : msg
						});
						 getRecentActionResult(arrActionMsg);
				}else{
					goToPage('acceptanceCenter.form','frmMain');
				}
			},
			error : function(data){
			}
		});
	});
	
	//reject button
	btnReject = createButton('btnReject','P');
	btnReject.click(function(){
		getInvoiceAcceptanceRejectPopup();
	});
	
	//close button
	btnClose = createButton('btnClose','S');
	btnClose.click(function(){
		if(newMode === "INVOICEVIEW")
			goToPage(backUrl,'frmMain');
		else
			goToPage('acceptanceCenter.form','frmMain');
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
			url : "services/invoiceAcceptance/send",
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
							reference : invNumber,
							actionMessage : msg
						});
						 getRecentActionResult(arrActionMsg);
				}else{
					goToPage('acceptanceCenter.form','frmMain');
				}
			},
			error : function(data){
			}
		});
	});
	//cancel button
	btnCancel = createButton('btnCancel','S');
	btnCancel.click(function(){
		if(isEmpty($('#invoiceAcceptIntRefNumber').val())
				|| (!isEmpty($('#invoiceAcceptIntRefNumber').val()) && $('#invoiceAcceptIntRefNumber').val() == '0'))
		{
			
			goToPage('invoiceCenter.form','frmMain');
		}
		else 
		{
			goToPage('acceptanceCenter.form','frmMain');
		}
			
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
		//left buttons
		btnBack.appendTo($(leftButtons));
		//right button
		if (financeState != "REJECTED"){
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
	
	if(newMode === "INVOICEVIEW"){
		$(btnApprove).addClass('hidden');
		$(btnReject).addClass('hidden');
		$(btnSend).addClass('hidden');
		$(btnSubmit).addClass('hidden');
	}
}

function createButton(btnKey, charIsPrimary) 
{
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
function formatFinanceAmount(id){
	if(!isEmpty($('#'+id).val())){
		var financeAmount = $('#'+id).val();
		financeAmount = parseFloat(financeAmount);
		if(isNaN(financeAmount)){
			$('#'+id).val("0.00");
		}else{
			$('#'+id).val(financeAmount.toFixed(2));
		}
		
	}
	else{
		$('#'+id).val("0.00");
	}
}

function getInvoiceAcceptanceRejectPopup()
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		bgiframe : true,
		resizable : false,
		width : 380,
		modal : true,
		buttons : {
				"OK" : function() {
					$('#txtAreaRejectRemark').val('');
					var userMessage = $('#txtAreaRejectRemark').val();
					var arrayJson = new Array();
					arrayJson.push({
						serialNo : 1,
						identifier : indentifier,
						userMessage : userMessage,
						selectedClient : selectedClient
					});
					$.ajax({
						url : "services/invoiceAcceptance/reject",
						type : 'POST',
						contentType : "application/json",
						data : JSON.stringify(arrayJson),
						success : function(data){
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
										reference : invNumber,
										actionMessage : msg
									});
									 getRecentActionResult(arrActionMsg);
									 $('#rejectPopup').dialog("close");
							}else{
								goToPage('acceptanceCenter.form','frmMain');
							}
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
}

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
							url : "services/invoiceAcceptance/discard",
							type : 'POST',
							contentType : "application/json",
							data : JSON.stringify(arrayJson),
							success :function(data){
								goToPage(backUrl,'frmMain');
							},
							error : function(data){
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
function getFinanceRejectPopup()
{
	$('#rejectPopup').dialog( {
		title : mapLbl['rejectRemarkPopUpTitle'],
		autoOpen : false,
		height : 400,
		width : 620,
		modal : true,
		buttons : {
				"OK" : function() {
					var userMessage = $('#txtAreaRejectRemark').val();
					var arrayJson = new Array();
					arrayJson.push({
						serialNo : 1,
						identifier : indentifier,
						userMessage : userMessage
					});
					$.ajax({
						url : "services/invoiceAcceptance/reject",
						type : 'POST',
						contentType : "application/json",
						data : JSON.stringify(arrayJson),
						success : function(data){
							goToPage('acceptanceCenter.form','frmMain');
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
}

function showInvoiceInfoPopup()
{
	$('#invFinTrasanctionSummaryDiv').dialog({
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				dialogClass : 'ft-dialog',
				title : getLabel('transinfo','Transaction Information'),
				open : function() {
					$('#invFinTrasanctionSummaryDiv').removeClass('hidden');
					$("#importedTxnDetailsInfoGrid").empty();
					var auditData = getInvoiceAddtionInformationData(identifier);
					paintInvoiceAdditionalInfo(auditData)
					
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

function getInvoiceAddtionInformationData(strIdentifier) {
	var objResponseData = null;
	if (strIdentifier && strIdentifier != '') {
		var strUrl = 'services/invoiceAcpTxnInfo(' + strIdentifier + ').json';
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
		$(".hdrPackage_InfoSpan").text(data.invHeaderInfo.scmMyProductName);
		$(".hdrEnteredby_InfoSpan").text(data.enteredBy);
		$(".hdrDatasource_InfoSpan").text(data.dataSource);
	}
	if (null != data && data.invStatus != '')
		$(".hdrStatus_InfoSpan").text(data.invStatus);
	else
		$('#divStatus_InfoSpan').addClass('hidden');
	if (null != data && data.invHeaderInfo.entryWorkflow != ''){
		$(".workflow_InfoSpan").text(data.invHeaderInfo.entryWorkflow);
		$(".entryenrichment_InfoSpan").text(data.invHeaderInfo.entryEnrchWorkflow);
		$(".acceptance_InfoSpan").text(data.invHeaderInfo.accpWorkflow);
		$(".acceptanceEnrich_InfoSpan").text(data.invHeaderInfo.accpEnrchWorkflow);
	}else{
		$('#additionalInfo_InfoSpan').addClass('hidden');
	}
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
						resizable : false,
						sortable: false,
						hideable : false
					}, {
						dataIndex : 'statusDesc',
						text : mapLbls['txnAction'],
						width : 150,
						draggable : false,
						resizable : false,
						sortable: false,
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
function showInvAccptUploadEnrDialog(enrichFileId) {
	var ctrlFile = $('#' + enrichFileId);
	ctrlFile.trigger('click');
}
function updateInvAccptEnrFileName(enrichFileId, spanFileName,
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
function removeInvAccptEnrUploadedImage(enrichFileId, spanFileName,
		removeLink, fileAction, viewAction, uploadFlagId, upldFileName) {
	var control = $('#' + enrichFileId);
	var fileNameSpan = $('.' + spanFileName);
	var rLink = $('#' + removeLink);
	var fAction = $('#' + fileAction);
	var vAction = $('#' + viewAction);
	
	control.replaceWith(control = control.clone(true));
	rLink.addClass('hidden');
	fAction.removeClass('hidden');
	fileNameSpan.text('');
	fileNameSpan.prop('title', '');
	vAction.addClass('hidden');
	$("#" + uploadFlagId).val("N");
	$("#" + upldFileName).val('');
	
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
		html : mapLbls['invoiceNumber']+' : '+record[i].reference+delimitor+record[i].actionMessage
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