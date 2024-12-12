function setItemCodeCurrency(item) {
	var strValue = $('#lineParticulars option:selected').text();
	if (isEmpty(strValue)) {
		return;
	}
	var pos = strValue.lastIndexOf("-");
	if (pos > -1) {
		var lineType = strValue.substring(pos + 1, strValue.length);
		if (lineType == 'TI' || lineType == 'T' || lineType == 'F') {
			document.getElementById("lineOperator").value = "+";
		} else if (lineType == 'A') {
			document.getElementById("lineOperator").value = "-";
		}
	}
}

function showActions(ctrl, divId, focusId) {
	if (!ctrl || isEmpty(divId))
		return;
	$("#" + divId).show();
	$(ctrl).hide();
	if (null != focusId && '' != focusId)
		$("#" + focusId).focus();
	return false;
}
function hideActions(ctrl, divId, moreLink, focusId) {
	var v = document.getElementById("moreLink");
	if (!ctrl || isEmpty(divId))
		return;
	$("#" + divId).hide();
	$("#" + moreLink).show();
	if (null != focusId && '' != focusId)
		$("#" + focusId).focus();
	return false;
}
function sectionCollapseExpandOnLoad() {
	var collapsFlag = 0;
	var labels = $(".enrichLabel.required").size();
	if (labels != 0) {
		$("#title_AdditionalDtls").children('a').toggleClass(
				"icon-expand-minus icon-collapse-plus");
		$("#title_AdditionalDtls").next().slideToggle("fast");
		return;
	}
	$(".enrichValue").each(function() {

		if (!isEmpty($(this).val())) {
			collapsFlag = 1;
		}

	});
	if (collapsFlag == 1) {
		$("#title_AdditionalDtls").children('a').toggleClass(
				"icon-expand-minus icon-collapse-plus");
		$("#title_AdditionalDtls").next().slideToggle("fast");
		return;
	}
}
function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function goBackValidate(strUrl, frmId) {
	if ($('#dirtyBit').val() == "1")
		getConfirmationPopup(frmId, strUrl);
	else
		goToPage(strUrl, frmId);
}
function setDirtyBit() {
	document.getElementById("dirtyBit").value = "1";
}
function getConfirmationPopup(frmId, strUrl) {
	$('#confirmPopup').dialog({
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
function addInvoiceInfo(strUrl, frmId) {
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	$("#frmMain").attr("encoding", "multipart/form-data");
	frm.method = "POST";
	frm.submit();

}
function showClearIfSelect(fileId, ctrlId, textId) {
	var file = $("#" + fileId).val();

	if (file != "") {
		$("#" + textId).text(file);
		$("#" + ctrlId).show();
		// $("#" + fileId).hide();
		$("#" + fileId).next().hide();
	} else {
		$("#" + ctrlId).hide();
	}
}
/*
 * function clearFile() { var ctrl = document.getElementById("fileText");
 * if(ctrl != null) { ctrl.value = ""; $("#fileText").text(""); } var ctrl =
 * document.getElementById("clearInvoiceFile"); if(ctrl != null) {
 * $("#clearInvoiceFile").hide(); } var ctrl =
 * document.getElementById("clearFile"); if(ctrl != null) {
 * $("#clearFile").hide(); } var ctrl =
 * document.getElementById("invoiceFileUploadFlag"); if(ctrl != null) {
 * ctrl.value = "N"; $("#invoiceFileUploadFlag").val("N"); } var ctrl =
 * document.getElementById("updateInvoiceFileSelector"); if(ctrl != null) {
 * $("#updateInvoiceFileSelector").show(); } var ctrl =
 * document.getElementById("invoiceFile"); if(ctrl != null) { ctrl.value = "";
 * $("#invoiceFile").val(""); $("#invoiceFile").next().show(); } }
 */

function clearFile() {
	var ctrl = document.getElementById("invoiceFileUploadFlag");
	if (ctrl != null) {
		ctrl.value = "N";
		$("#invoiceFileUploadFlag").val("N");
	}
	var ctrl = document.getElementById("invoiceFile");
	if (ctrl != null && ctrl != "") {
		ctrl.value = "";
		$("#invoiceFile").val("");
	}

}
function clearEnrichFile(fileId, ctrlId, uploadFlagId, uploadSelectorId, textId) {
	var ctrl = document.getElementById(fileId);
	if (ctrl != null) {
		ctrl.value = "";
		$("#" + fileId).val("");
		$("#" + fileId).show();
		$("#" + fileId).next().show();
	}
	var ctrl = document.getElementById(textId);
	if (ctrl != null) {
		ctrl.value = "";
		$("#" + textId).text("");
	}
	var ctrl = document.getElementById(ctrlId);
	if (ctrl != null) {
		$("#" + ctrlId).hide();
	}
	var ctrl = document.getElementById(uploadSelectorId);
	if (ctrl != null) {
		$("#" + uploadSelectorId).show();
	}
	var ctrl = document.getElementById(uploadFlagId);
	if (ctrl != null) {
		ctrl.value = "N";
		$("#" + uploadFlagId).val("N");
	}
}
function updateInvoice(strUrl, frmId, invoiceInternalReferenceNumber) {
	frm = document.getElementById(frmId);
	document.getElementById("txtInvNum").value = invoiceInternalReferenceNumber;
	frm.action = strUrl;
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function submitInvoice(strUrl, frmId, invoiceInternalReferenceNumber) {
	frm = document.getElementById(frmId);
	document.getElementById("txtInvNum").value = invoiceInternalReferenceNumber;
	frm.action = strUrl;
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function showInvoiceLineItem(strUrl, frmId, invoiceInternalReferenceNumber) {
	setDirtyBit();
	frm = document.getElementById(frmId);
	document.getElementById("txtInvNum").value = invoiceInternalReferenceNumber;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function editInvoiceLineItem(strUrl, frmId, invoiceInternalReferenceNumber,
		detailRefNumber, productCode) {
	document.getElementById("txtInvNum").value = invoiceInternalReferenceNumber;
	document.getElementById("txtItemNo").value = detailRefNumber;
	document.getElementById("txtSCMProduct").value = productCode;
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function deleteInvoiceLineItem(strUrl, frmId, invoiceInternalReferenceNumber,
		detailRefNumber) {
	document.getElementById("txtInvNum").value = invoiceInternalReferenceNumber;
	document.getElementById("txtItemNo").value = detailRefNumber;
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewInvoiceAttachment(strUrl, frmId, invoiceInternalRefNumber,
		enrichcode) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvNum").value = invoiceInternalRefNumber;
	document.getElementById("txtItemNo").value = enrichcode;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	frm.submit();
}
function deleteInvoiceAttachment(strUrl, frmId, invoiceInternalRefNumber,
		enrichcode) {
	document.getElementById("txtInvNum").value = invoiceInternalRefNumber;
	document.getElementById("txtItemNo").value = enrichcode;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function addLineItem(strUrl, frmId) {
	setDirtyBit();
	
	var strValue=$('#lineParticulars').val();
	var pos = strValue.lastIndexOf("--");
	if (pos > -1) {
		var linePart = (strValue.substring(0, pos)).trim();
		
	}
	document.getElementById("txtLineParticulars").value = linePart;
	document.getElementById("txtLineQuantity").value = $('#lineQuantity').val();
	document.getElementById("txtLineRate").value = $('#lineRate').val();
	document.getElementById("txtLineOperator").value = $('#lineOperator').val();
	document.getElementById("txtLineAmount").value = $('#lineAmount').val();
	document.getElementById("txtLineRemarks").value = $('#lineRemarks').val();

	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getLineItemPopup(strIde, strAction, strPopUpDivId, record) {
	var strDivId = strPopUpDivId || 'addLineItemPopup';
	blockPOLineItemUI(true);
	$("#" + strDivId).dialog({
		autoOpen : false,
		maxHeight : 500,
		width : 869,
		dialogClass : "hide-title-bar",
		modal : true,
		draggable:false,
		 resizable: false,
		open : function(event, ui) {
		$("#" + strDivId).dialog('option', 'position', 'center');
			var strMsgDivId = strAction === 'VIEW'
					? '#messageContentLineItemViewDiv'
					: '#messageContentInstrumentDiv';
			$('#messageContentDiv').appendTo($(strMsgDivId));
			doClearMessageSection();
			doClearLineItemMessageSection();			
			$(this).data['strTxnWizardAction']= strAction;
			if (strAction === 'UPDATE' || strAction === 'VIEW')
				doShowAddedLineItem(strIde, strAction, record);
			else
				doShowInstrumentForm(strAction);
			$('.transaction-wizard :input:not(:checkbox):not(:radio):not([readonly]):visible:enabled:first')
					.focus();
			blockPOLineItemUI(false);
		},
		close : function(event, ui) {
			$('#messageContentDiv').appendTo($('#messageContentHeaderDiv'));
			/*var strTxnWizardAction =$(this).data['strTxnWizardAction'];
			if((isEmpty(strTxnWizardAction) || strTxnWizardAction=== 'ADD' || strTxnWizardAction=== 'UPDATE') && typeof objInstrumentEntryGrid != 'undefined'
					&& objInstrumentEntryGrid) {
				objLineItemEntryGrid.refreshData();
	     }*/
		}
	});
	$("#" + strDivId).dialog("open");
}

function showUploadDialogEnrich(hlnk, enrichHiddenFlag,
		viewAttachmentInvoiceEnrichId, fileActionId, divFilUploadId,
		enrichFileId, fileUploadFlag) {
	var ctrlFile = document.getElementById(enrichFileId);
	var ctrlFileUploadFlag = document.getElementById(fileUploadFlag);
	var ctrlEnrichHiddenFlag = document.getElementById(enrichHiddenFlag);
	if (ctrlEnrichHiddenFlag.value == "N") {
		$(hlnk).find('span').text('Import File..');
		$("#" + viewAttachmentInvoiceEnrichId).addClass("ui-helper-hidden");
		if (!$.browser.msie) {
			ctrlFile.value = '';
		} else {
			$("#" + enrichFileId)
					.replaceWith($("#" + enrichFileId).clone(true));
		}
		ctrlFileUploadFlag.value = "N";
		ctrlEnrichHiddenFlag.value = "Y"
		setDirtyBit();
	} else {
		var dlg = $('#' + divFilUploadId);
		dlg.dialog({
			bgiframe : true,
			autoOpen : false,
			height : "auto",
			modal : true,
			resizable : false,
			width : 'auto',
			hide : "explode",
			buttons : {
				"Ok" : function() {
					if (ctrlFile.value != null && ctrlFile.value != "") {
						var fileText = 'Remove File.. ' + ctrlFile.value;
						$(hlnk).find('span').text(fileText);
						ctrlFileUploadFlag.value = "Y";
						ctrlEnrichHiddenFlag.value = "N"
					}

					if (navigator.appName == "Microsoft Internet Explorer") {
					$(this).dialog("close");
					} else {
						var fileSize = ctrlFile.files[0].size;
						if (fileSize > maxUploadSize) {
							$('#uploadEnrichFileSize').val(fileSize);
							ctrlFile.value = "";
						}
						$(this).dialog("close");
					}
				},
				Cancel : function() {
					if (!$.browser.msie) {
						ctrlFile.value = '';
					} else {
						$("#" + enrichFileId).replaceWith(
								$("#" + enrichFileId).clone(true));
					}
					$(hlnk).find('span').text('Import File..');
					$(this).dialog('destroy');
					ctrlFileUploadFlag.value = "N";
					ctrlEnrichHiddenFlag.value = "Y"
				}
			}
		});
		dlg.parent().appendTo($('#frmMain'));
		dlg.dialog('open');
	}
}

jQuery.fn.poReferenceNmbrAutoComplete = function() {
	
	var strUrl = null;
	var filter1=clientCode;
	var filter2=aliasClientCode;
	var filter3=product;
	if(strEntityType == '0')
	{
		strUrl = "services/userseek/invoiceDocumentNoSeek.admin";
	}
	else
	{
		strUrl = "services/userseek/invoiceDocumentNoSeek";
	}
	
	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
							url : strUrl,
									dataType : "json",
									type:'POST',
									data : {
										$filtercode1: filter1,
										$filtercode2: filter2,
										$filtercode3: filter3,
										top:-1,
										$autofilter : request.term
									},
									success : function(data) {
											var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.DESCR,
														record : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.payerDtl;
						$('#POInternalReferenceNumberHdr').val(ui.item.record.CODE);
					},
					change : function(event, ui) { 							
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};


jQuery.fn.receiverPayerAutoComplete = function() {
	var buyerSellerUrl = "services/userseek/invoiceSellers";
	if(clientMode == 'BUYER')
	{
		buyerSellerUrl = "services/userseek/invoiceSellers";
	}
	else if(clientMode == 'SELLER')
	{
		buyerSellerUrl = "services/userseek/invoiceBuyers";
	}
	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : buyerSellerUrl,
									dataType : "json",
									type:'POST',
									data : {
										$filtercode1: clientCode, 
										$filtercode2 :product,
										top:-1,
										$autofilter : request.term
									},
									success : function(data) {
											var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.DRAWER_DESCRIPTION,
														record : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.payerDtl;
						$('#dealerVendorCodeHdr').val(ui.item.record.DRAWER_CODE);
						aliasClientCode = ui.item.record.BENE_CASHIN_CLIENT;
						counterPartyCode = ui.item.record.BENE_CASHIN_CLIENT;
						loadPOHeaderFields(productCode, clientCode);
						$('#POReferenceNumberHdr').poReferenceNmbrAutoComplete();
					},
					change : function(event, ui) { 							
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};


function showInvoiceInfoPopup() {
	$('#invFinTrasanctionSummaryDiv').dialog({
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				dialogClass : 'ft-dialog',
				title :  getLabel('TransactionInformation','Transaction Information'),

				open : function() {
					$('#invFinTrasanctionSummaryDiv').removeClass('hidden');
					$("#importedTxnDetailsInfoGrid").empty();
					var auditData = getInvoiceAddtionInformationData(invIdentifier);
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
						hideable : false,
						sortable: false
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
	if (null != data && data.SUCCESS == 'success'){
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
	}else{
		$(".hdrAnchorClient_InfoSpan").text(poResponseHeaderData.d.anchorCompanyInfo.company+' '+poResponseHeaderData.d.anchorCompanyInfo.companyAddress);
		var objInfo = poResponseHeaderData.d.counterPartyCompanyInfo;
		if (null != objInfo){
			var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
			strText += '<br/>'
				+ (!isEmpty(objInfo.companyAddress)
						? objInfo.companyAddress
								: '');
			$(".hdrCounterparty_InfoSpan").html(strText);
		}
		$(".hdrWorkflow_InfoSpan").text(poResponseHeaderData.d.workflow);
		$(".hdrPackage_InfoSpan").text(poResponseHeaderData.d.packageName);
		$(".hdrEnteredby_InfoSpan").text(poResponseHeaderData.d.enteredBy);
		$(".hdrDatasource_InfoSpan").text(poResponseHeaderData.d.dataSource);
	}
	if (null != data && data.SUCCESS == 'success' && data.invStatus != '')
		$(".hdrStatus_InfoSpan").text(data.invStatus);
	else
		$('#divStatus_InfoSpan').addClass('hidden');
	if (null != data && data.SUCCESS == 'success' && data.invHeaderInfo.entryWorkflow != ''){
		$(".workflow_InfoSpan").text(data.invHeaderInfo.entryWorkflow);
		$(".entryenrichment_InfoSpan").text(data.invHeaderInfo.entryEnrchWorkflow);
		$(".acceptance_InfoSpan").text(data.invHeaderInfo.accpWorkflow);
		$(".acceptanceEnrich_InfoSpan").text(data.invHeaderInfo.accpEnrchWorkflow);
	}else{
		$('#additionalInfo_InfoSpan').addClass('hidden');
	}
}

function removeUploadedImage() {
	var control = $("#invoiceFile");
	control.replaceWith(control = control.clone(true));
	$('#inoviceFileRemoveLink').addClass('hidden');
	$('#invoiceFileUploadFlagHdr').removeClass('hidden');
	$(".fileName_InfoSpan").text('No File Uploaded');
	$("#fileNameHdr").val("");
	$('.fileName_InfoSpan').prop('title', '');
	$('#viewAttachment').addClass('hidden');
    removeFlag='Y';
	isFileUploaded=false;
}
function updateFileName() {
	if ($("#invoiceFile") && $("#invoiceFile")[0]
			&& $("#invoiceFile")[0].files) {
		var strUploadedImageName = $("#invoiceFile")[0].files[0].name;
		$(".fileName_InfoSpan").text(strUploadedImageName);
		$('#inoviceFileRemoveLink').removeClass('hidden');
		$('#invoiceFileUploadFlagHdr').addClass('hidden');
		$("#fileNameHdr").val(strUploadedImageName);
		$('.fileName_InfoSpan').prop('title',strUploadedImageName);
		isFileUploaded=true;
		 removeFlag='N';
	}
}
function showUploadDialog(hlnk) {
	$('#invoiceFile').trigger('click');
}
function downloadAttachment(){
	var strUrl=_mapUrl['loadPOHeaderUrl'] + "/("+ strHeaderIdentifier+")/download";
	var frm = document.getElementById("frmMain");
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	frm.submit();
	frm.target = "";
}

function loadPOHeaderFields(strMyProduct, anchorClient) {
	if (!isEmpty(strMyProduct)) {
		var url = 'services/invTxnHeaderInfo' + "/" + strMyProduct;
		$.ajax({
			type : "POST",
			url : url,
			data : {
				$productRelClient : anchorClient,
				$enteredClient : enteredByClient,
				$counterParty : counterPartyCode
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
						poResponseHeaderData = data;
					}
				}
			}
		});
	}
}