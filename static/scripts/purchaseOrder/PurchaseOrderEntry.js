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
	if(strUrl==="showPOAcceptance.form"){
	 frm.appendChild(createFormField('INPUT', 'HIDDEN', 'poEnteredByClient',	enteredByClient));
	 frm.appendChild(createFormField('INPUT', 'HIDDEN', 'counterPartyName',	counterpartyName));
	}
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
function addPOInfo(strUrl, frmId) {
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
function updatePO(strUrl, frmId, invoiceInternalReferenceNumber) {
	frm = document.getElementById(frmId);
	document.getElementById("txtInvNum").value = invoiceInternalReferenceNumber;
	frm.action = strUrl;
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function submitPO(strUrl, frmId, invoiceInternalReferenceNumber) {
	frm = document.getElementById(frmId);
	document.getElementById("txtInvNum").value = invoiceInternalReferenceNumber;
	frm.action = strUrl;
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function showPoLineItem(strUrl, frmId, invoiceInternalReferenceNumber) {
	setDirtyBit();
	frm = document.getElementById(frmId);
	document.getElementById("txtInvNum").value = invoiceInternalReferenceNumber;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function editPoLineItem(strUrl, frmId, invoiceInternalReferenceNumber,
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
function deletePoLineItem(strUrl, frmId, invoiceInternalReferenceNumber,
		detailRefNumber) {
	document.getElementById("txtInvNum").value = invoiceInternalReferenceNumber;
	document.getElementById("txtItemNo").value = detailRefNumber;
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewPoAttachment(strUrl, frmId, invoiceInternalRefNumber,
		enrichcode) {
	var frm = document.getElementById(frmId);
	//document.getElementById("txtInvNum").value = invoiceInternalRefNumber;
	//document.getElementById("txtItemNo").value = enrichcode;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop = (screen.availHeight - 300) / 2;
	var intLeft = (screen.availWidth - 400) / 2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=350";
	window.open("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
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
			$("#" + strDivId).dialog('option', 'position', 'center');
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

function removeUploadedImage() {
	var control = $("#poFile");
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
	if ($("#poFile") && $("#poFile")[0]
			&& $("#poFile")[0].files) {
		var strUploadedImageName = $("#poFile")[0].files[0].name;
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
	$('#poFile').trigger('click');
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
jQuery.fn.poSellerAutoComplete = function() {
	var buyerSellerUrl = "services/userseek/poSellers";
	if(clientMode == 'BUYER')
	{
		buyerSellerUrl = "services/userseek/poSellers";
	}
	else if(clientMode == 'SELLER')
	{
		buyerSellerUrl = "services/userseek/poBuyers";
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
						counterparty = ui.item.record.BENE_CASHIN_CLIENT;
						counterpartyName=ui.item.record.DRAWER_CODE
						loadPOHeaderFields(scmProduct, anchorClient);
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