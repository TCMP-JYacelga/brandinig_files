function goToBack(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function goToPageWithToken(strUrl, frmId) {
	$('input').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	var me = this;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.appendChild(createFormField('INPUT', 'HIDDEN',
					'enteredByClientDesc', enteredByClientDesc));
	frm.submit();
}
function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}
function goBackValidateWithToken(strUrl, frmId) {
	if ($('#dirtyBit').val() == "1")
		getConfirmationPopup(frmId, strUrl);
	else
		goToPageWithToken(strUrl, frmId);
}
function saveCreditDebitNote(strUrl, frmId) {
	$('#invoiceOutStandingAmount').removeAttr("readonly");
	$('input').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function clearInvoiceRef(InvRefDesc, InvRef, OutstandAmntId) {
	document.getElementById(InvRefDesc).value = "";
	document.getElementById(InvRef).value = "";
	document.getElementById(OutstandAmntId).value = "";
}

function setDirtyBit() {
	document.getElementById("dirtyBit").value = "1";
}

function getConfirmationPopup(frmId, strUrl) {
	$('#confirmPopup').dialog({
				autoOpen : false,
				maxHeight : 550,
				minHeight : 'auto',
				width : 400,
				modal : true,
				resizable : false,
				draggable : false
			});
	$('#confirmPopup').dialog("open");

	$('#cancelConfirmMsg').bind('click', function() {
				$('#confirmPopup').dialog("close");
			});

	$('#doneConfirmMsgbutton').bind('click', function() {
				var frm = document.forms[frmId];
				frm.action = strUrl;
				frm.target = "";
				frm.method = "POST";
				frm.submit();
			});
	$('#textContent').focus();
}

function getDiscardConfirmationPopup(strUrl, frmId) {
	$('#discardConfirmPopup').dialog({
				autoOpen : false,
				maxHeight : 550,
				minHeight : 'auto',
				width : 400,
				modal : true,
				resizable : false,
				draggable : false
			});
	$('#discardConfirmPopup').dialog("open");

	$('#discardCancelBtn').bind('click', function() {
				$('#discardConfirmPopup').dialog("close");
			});

	$('#discardDoneBtn').bind('click', function() {
				var frm = document.forms[frmId];
				frm.action = strUrl;
				frm.target = "";
				frm.method = "POST";
				frm.submit();
			});
	$('#discardTextContent').focus();
}

jQuery.fn.buyerSellerAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : "services/userseek/creditDebitNoteBuyerSellers.json",
							type : "POST",
							dataType : "json",
							data : {
								$autofilter : request.term,
								$filtercode1 : $('#scmMyProduct').val(),
								$filtercode2 : $('#enteredByClient').val()
							},
							success : function(data) {
								if (data) {
									var rec = data.d.preferences;
									response($.map(rec, function(item) {
												return {
													label : item.DESCR,
													itemDtl : item
												}
											}));
								}
							}
						});
			},
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.itemDtl;
				if (data) {
					if (!isEmpty(data.CODE)) {
						$('#dealerVendorCodeDesc').val(data.DESCR);
						$('#dealerVendorCode').val(data.CODE);
						clearInvoiceRef('invoiceReferenceDesc',
								'invoiceReference', 'invoiceOutStandingAmount');
						strSelectedBuyerSellerDesc = data.DESCR;
						loadCounterPartyDetails(data.BENE_CASHIN_CLIENT);
					}
				}
				$(this).attr('oldValue', data.DESCR);
			},
			change : function() {
				if ($('#dealerVendorCodeDesc').attr('oldValue') !== $('#dealerVendorCodeDesc')
						.val()) {
					$('#dealerVendorCode').val('');
					$('#dealerVendorCodeDesc').val('');
					clearInvoiceRef('invoiceReferenceDesc', 'invoiceReference',
							'invoiceOutStandingAmount');
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
}

jQuery.fn.invoiceAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : "services/creditDebitNoteInvoices/"
									+ $('#userMode').val() + ".json",
							type : "POST",
							dataType : "json",
							data : {
								$filter : request.term,
								$clientCode : $('#clientCode').val(),
								$enteredByClient : $('#enteredByClient').val(),
								$scmProduct : $('#scmMyProduct').val(),
								$dealerVendorCode : $('#dealerVendorCode')
										.val()
							},
							success : function(data) {
								if (data) {
									response($.map(data, function(item) {
												return {
													label : item.invoiceNumber,
													itemDtl : item
												}
											}));
								}
							}
						});
			},
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.itemDtl;
				if (data) {
					$('#invoiceReferenceDesc').val(data.invoiceNumber);
					$('#invoiceReference')
							.val(data.invoiceInternalReferenceNumber);
					$('#invoiceOutStandingAmount').val(data.outstandingAmount);
					strSelectedInvoiceDesc = data.invoiceNumber;
					$(this).attr('oldValue', data.invoiceNumber);
				}
			},
			change : function() {
				if ($('#invoiceReferenceDesc').attr('oldValue') !== $('#invoiceReferenceDesc')
						.val()) {
					clearInvoiceRef('invoiceReferenceDesc',
								'invoiceReference', 'invoiceOutStandingAmount')
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
}

function showCreditDebitNoteTxnInfoPopup() {
	$('#creditDebitNoteAdditionalInfoDiv').dialog({
		autoOpen : false,
		maxHeight : 620,
		width : 690,
		modal : true,
		dialogClass : 'ft-dialog',
		draggable : false,
		title : getLabel('transinfo','Transaction Information'),
		open : function() {
			$('#creditDebitNoteAdditionalInfoDiv').removeClass('hidden');
			$('#creditDebitNoteAdditionalInfoDiv').dialog('option', 'position',
					'center');
			if(typeof createHistoryGrid !== "undefined")
				createHistoryGrid();
		},
		close : function() {
		}
	});
	$('#creditDebitNoteAdditionalInfoDiv').dialog("open");
	$('#creditDebitNoteAdditionalInfoDiv').dialog('option', 'position',
			'center');
}
function closeCreditDebitNoteTxnInfoPopup() {
	$('#creditDebitNoteAdditionalInfoDiv').dialog("close");
}

function loadCounterPartyDetails(strCashinClient) {
	if (!strCashinClient)
		return;
	var strMyProduct = product, strEnteredClient = $('#enteredByClient').val(), strAnchorClient = clientCode;
	var url = 'services/' + strInvoiceNoteType + 'NoteAdditioalInfo' + "/"
			+ strMyProduct;
	$.ajax({
		type : "POST",
		url : url,
		data : {
			$productRelClient : strAnchorClient,
			$enteredClient : strEnteredClient,
			$counterParty : strCashinClient
		},
		async : false,
		complete : function(XMLHttpRequest, textStatus) {
		},
		success : function(data) {
			if (data != null && data.d.counterPartyCompanyInfo) {
				$('.counterPartyInfoHdr')
						.html((data.d.counterPartyCompanyInfo.company || ''));
				$('<BR/>').appendTo($('.counterPartyInfoHdr'));
				var elt = $('<span />');
				elt.attr({
							'title' : data.d.counterPartyCompanyInfo.companyAddress
									|| ''
						});
				elt.html(data.d.counterPartyCompanyInfo.companyAddress || '');
				elt.appendTo($('.counterPartyInfoHdr'));
			} else
				$('.counterPartyInfoHdr').empty()
		}
	});
}
