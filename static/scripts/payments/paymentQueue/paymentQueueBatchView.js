function blockPaymentUI(blnBlock) {
	if (blnBlock === true) {
		$("#pageContentDiv").addClass('ui-helper-hidden');
		$('#blockUIDiv').removeClass('ui-helper-hidden');
		$('#blockUIDiv').block({
			overlayCSS : {
				opacity : 0
			},
			baseZ : 2000,
			message : '<div style="z-index: 1"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;'
					+ getLabel("lbl.paymentqueue.processreq",
							"Processing your request...") + '</h2></div>',
			css : {
				height : '32px',
				padding : '8px 0 0 0'
			}
		});
	} else {
		$("#pageContentDiv").removeClass('ui-helper-hidden');
		$('#blockUIDiv').addClass('ui-helper-hidden');
		$('#blockUIDiv').unblock();
	}
}

function blockInstrumentUI(blnBlock) {
	if (blnBlock === true) {
		$("#gridDiv").addClass('ui-helper-hidden');
		$("#viewFormDiv").addClass('ui-helper-hidden');
		$('#instrumentPageDiv').removeClass('ui-helper-hidden');
		$('#instrumentPageDiv').block({
			overlayCSS : {
				opacity : 0
			},
			baseZ : 2000,
			message : '<div style="z-index: 1"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;'
					+ getLabel("lbl.paymentqueue.processreq",
							"Processing your request...") + '</h2></div>',
			css : {
				height : '32px',
				padding : '8px 0 0 0'
			}
		});
	} else {
		$("#gridDiv").removeClass('ui-helper-hidden');
		$("#viewFormDiv").removeClass('ui-helper-hidden');
		$('#instrumentPageDiv').addClass('ui-helper-hidden');
		$('#instrumentPageDiv').unblock();
	}
}

function readPaymentPaymentQueueHeader() {
	if (!isEmpty(strPirNumber)) {
		var strUrl = null;
		// strUrl =
		// "static/scripts/payments/paymentQueue/data/paymentQueueHeader.json";
		if (strPaymentQueueType === 'C' || strPaymentQueueType === 'D' || strPaymentQueueType === 'L')
			strUrl = 'getProcessingQueueCashinInstHeader.srvc?';
		else if (strPaymentQueueType === 'CW')
			strUrl = 'getPaymentProcessingQueryInstHeader.srvc?';
		else
			strUrl = "getBankProcessingQueueInstHeader.srvc?";
		strUrl += '&$queueTypeFltr=' + strPaymentQueueType;
		strUrl += '&$batchInstFltr=B';
		strUrl += '&$filter=pirNmbr eq \'' + strPirNumber + '\'';
		if(strPaymentQueueType === 'L')
		strUrl += ' and internalTxnNmbr eq \'' + strInternalTxnNmbr + '\'';
		strUrl += "&" + csrfTokenName + "=" + csrfTokenValue;
		// blockPaymentUI(true);
		$.ajax({
			type : "POST",
			url : strUrl,
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					// TODO : Error handling to be done.
					// alert("Unable to complete your request!");
				}
			},
			success : function(data) {
				var formData = data || {
					"d" : {
						"bankProcessingQueue" : [{}]
					}
				};
				formData = formData['d']['bankProcessingQueue']
						? formData['d']['bankProcessingQueue'][0]
						: null;
				if (formData) {
					$('.txnDateHdrSpan').text(formData['effectiveDate'] || '');
					$('.accountNoHdrSpan').text(formData['sendingAcc'] || '');
					$('.referenceNoHdrSpan').text(formData['reference'] || '');
					$('.totalNoHdrSpan').text(formData['totalTxns'] || '');					 		
					var hdrAmt = formData['ccySymbol'].concat(setDigitAmtGroupFormat(formData['totalInstAmount']));
					$('.amountHdrSpan').text(hdrAmt || '');

					if (!formData['rateType']) {
						$('.rateTypeHdrDiv').addClass('ui-helper-hidden');
					} else {
						if (formData['rateType'] === 'NONE') {
							$('.rateTypeHdrDiv').addClass('ui-helper-hidden');
						} else {
							$('.rateTypeHdrDiv')
									.removeClass('ui-helper-hidden');
							$('.rateTypeHdrSpan').text(formData['rateType']
									|| '');
						}
					}

					var strValue = formData['clientName']
							? formData['clientName'] + ','
							: '';
					$('#clientDescSpan').text(strValue);
					strValue = formData['payCat']
							? formData['payCat'] + ','
							: '';
					$('#paymentCatSpan').text(strValue);
					strValue = formData['paymentPkgName']
							? formData['paymentPkgName'] + ','
							: '';
					$('#productPackageSpan').text(strValue);
					strValue = formData['productDescription']
							? formData['productDescription']
							: '';
					$('#productCodeSpan').text(strValue);
				} else {
					$('#txnDateHdr,#accountNoHdr,#referenceNoHdr,#totalNoHdr,#amountHdr,#rateTypeHdr')
							.val('');
					$('#clientDescSpan,#paymentCatSpan,#productPackageSpan,#productCodeSpan')
							.text('');
				}
				// blockPaymentUI(false);
			}
		});
	} else {
		// blockPaymentUI(false);
	}
}
function paintPaymentDetailActions() {
	var elt = null, eltBack = null, eltSpacer = null;
	$('#queueButtonHdrDivRT, #queueButtonHdrDivRB').empty();
	eltBack = createAnchorTag('btnBack', 'D');
	eltBack.click(function() {
				doCancelPaymentQueueView();
			});
	eltBack.appendTo($('#queueButtonHdrDivRT, #queueButtonHdrDivRB'));
}

function createAnchorTag(btnKey, _charType) {
	var mapIcon = {
		btnBack : '<i class="fa fa-minus-circle ux_icon-padding"></i>'
	};
	var strIcon = _charType === 'D' ? (mapIcon[btnKey] || '') : '';
	var strCls = 'inline_block  ux_font-size14-normal';
	strCls = _charType === 'D'
			? strCls
					+ ' ux_button-padding ux_button-background ux_label-margin-right '
			: strCls;
	var elt = null;
	elt = $('<a>').attr({
				'href' : '#',
				'class' : strCls,
				'id' : 'link_' + btnKey
			}).append(strIcon + mapLbl[btnKey]);
	return elt;
}
function doCancelPaymentQueueView() {
	var form = null;
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName,
			csrfTokenValue));
	form.action = ((strPaymentQueueType === 'Q' || strPaymentQueueType === 'CW')
			? 'showBankProcessingQueryQueue.srvc'
			: 'showBankProcessingQueue.srvc');
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
