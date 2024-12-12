var selectedBillerCode = null, selectedClientCode = null, selectedIndustryCode = null, selectedIndustryDesc = null,sellerCode =null;
function getLabel(key, defaultText) {
	return (billerRegLabelsMap && !Ext.isEmpty(billerRegLabelsMap[key])) ? billerRegLabelsMap[key]
   : defaultText;
}
function initializationForRegisterBiller() {
	$('#billerIndustrySearch').keyup(function() {
		handleBillerIndustryPopulation();
	});

	$('#billerSearch').keyup(function() {
		handleBillerPopulation();
	});
	handleClientDropDown();
	handleBillerIndustryPopulation();
	handleBillerPopulation();
}
function handleBillerIndustryPopulation() {
	var billerIndustriesUrl = 'services/userseek/billerIndustriesList.json';
	var objList;

	if (!isEmpty(selectedClient)) {
		billerIndustriesUrl = billerIndustriesUrl + '?$filtercode1=' + selectedClient;
	}
	objList = $('#bill-ind-list');
	objList.empty();
	$.ajax({
		type : 'POST',
		url : billerIndustriesUrl,
		success : function(data) {
			paintBillerIndustriesPanel(data);

		}
	});
}

function paintBillerIndustriesPanel(data) {
	var searchTerm, arrData, objList, objUl, objDiv, objLi;
	searchTerm = $('#billerIndustrySearch').val().toUpperCase();
	if ((!isEmpty(data)) && (!isEmpty(data.d)) && (!isEmpty(data.d.preferences)) && (data.d.preferences.length > 0)) {
		arrData = data.d.preferences;
		if (searchTerm) {
			arrData = arrData.filter(function(val) {
				var industryDescription = val.INDUSTRY_DESC.toUpperCase();
				return industryDescription.indexOf(searchTerm) > -1;
			});
		}
		objList = $('#bill-ind-list');
		objList.empty();
		objDiv = $('<div>').attr({
			'id' : 'billIndListDiv',
			'class' : ''
		});
		objUl = $('<ul>').attr({
			'class' : ''
		});
		objUl.appendTo(objDiv);
		objDiv.appendTo(objList);

		if ((!isEmpty(arrData)) && arrData.length > 0) {
			$.each(arrData, function(index, cfg) {
				objLi = $('<li>').attr({
					'billIndData' : cfg
				});
				$('<a>').attr({
					'code' : cfg.indCode,
					'billIndData' : JSON.stringify(cfg)
					}).html('<span class="">' + getLabel('biller.industryType.'+cfg.INDUSTRY_CODE, cfg.INDUSTRY_DESC) + '</span>').on('click', function() {
					if (!$(this).hasClass('selected-dropdown')) {
						handleVisualIndication('billIndListDiv', this);
						handleNextButtonVisiblity(true);
						handleBillerIndustryClick(cfg);
					}
				}).appendTo(objLi);
				objLi.appendTo(objUl);
			});
		}
		else {
			paintNoDataMsg($('#bill-ind-list'), 'billIndListDiv');
		}
	}
	else {
		paintNoDataMsg($('#bill-ind-list'), 'billIndListDiv');
	}
}

function handleBillerIndustryClick(cfgBillInd) {
	var strBillIndDesc =  getLabel('biller.industryType.'+cfgBillInd.INDUSTRY_CODE, cfgBillInd.INDUSTRY_DESC);
	if (!isEmpty(strBillIndDesc)) {
		$('#billerIndustrySearch').val(strBillIndDesc);
		$('#billerIndustrySearch').attr('industry_code', cfgBillInd.INDUSTRY_CODE);
	}
	$('#billerSearch').val('');
	handleBillerPopulation();
}

function handleBillerIndustryClear() {
	$('#billerIndustrySearch,#billerSearch').val('');
	$('#billerIndustrySearch').attr('industry_code', '');
	handleNextButtonVisiblity(true);
	handleBillerIndustryPopulation();
	handleBillerPopulation();
}

function handleBillerPopulation() {
	var billerUrl = 'services/userseek/billerList.json';
	var filterCode2 = '?$filtercode2=';
	var objList, selectedBillerIndustry = $('#billerIndustrySearch').attr('industry_code');
	if (!isEmpty(selectedClient)) {
		billerUrl = billerUrl + '?$filtercode1=' + selectedClient;
		filterCode2 = '&$filtercode2=';
	}
	if (!isEmpty(selectedBillerIndustry)) {
		billerUrl = billerUrl + filterCode2 + selectedBillerIndustry;
	}
	objList = $('#biller-list');
	objList.empty();
	$.ajax({
		type : 'POST',
		url : billerUrl,
		success : function(data) {
			paintBillersPanel(data);
		}
	});
}
function paintBillersPanel(data) {
	var searchTerm, arrData, objList, objUl, objDiv, objLi;
	searchTerm = $('#billerSearch').val().toUpperCase();
	if ((!isEmpty(data)) && (!isEmpty(data.d)) && (!isEmpty(data.d.preferences)) && (data.d.preferences.length > 0)) {
		arrData = data.d.preferences;
		if (searchTerm) {
			arrData = arrData.filter(function(val) {
				var billerDescription = val.SYS_BENE_DESC.toUpperCase();
				return billerDescription.indexOf(searchTerm) > -1;
			});
		}
		objList = $('#biller-list');
		objList.empty();
		objDiv = $('<div>').attr({
			'id' : 'billerListDiv',
			'class' : ''
		});
		objUl = $('<ul>').attr({
			'class' : ''
		});
		objUl.appendTo(objDiv);
		objDiv.appendTo(objList);

		if ((!isEmpty(arrData)) && arrData.length > 0) {
			$.each(arrData, function(index, cfg) {
				objLi = $('<li>').attr({
					'billerData' : cfg
				});
				$('<a>').attr({
					'code' : cfg.SYS_BENE_CODE,
					'billerData' : JSON.stringify(cfg)
				}).html('<span class="">' + cfg.SYS_BENE_DESC + '</span>').on('click', function() {
					if (!$(this).hasClass('selected-dropdown')) {
						handleVisualIndication('billerListDiv', this);
						handleNextButtonVisiblity(false);
						handleBillerClick(cfg);
					}
				}).appendTo(objLi);
				objLi.appendTo(objUl);
			});
		}
		else {
			paintNoDataMsg($('#biller-list'), 'billerListDiv');
		}
	}
	else {
		paintNoDataMsg($('#biller-list'), 'billerListDiv');
	}
}

function handleBillerClick(cfgBiller) {
	var strBillerDesc = cfgBiller.SYS_BENE_DESC;
	if (!isEmpty(strBillerDesc)) {
		$('#billerSearch').val(strBillerDesc);
		selectedBillerCode = cfgBiller.SYS_BENE_CODE;
		selectedBillerDesc = strBillerDesc;
		selectedClientCode = selectedClient;
		sellerCode = strSeller;
		if(cfgBiller.INDUSTRY_TYPE !== undefined)
		{
		selectedIndustryCode = cfgBiller.INDUSTRY_TYPE;
		}
		if(cfgBiller.INDUSTRY_DESC !== undefined)
		{
		selectedIndustryDesc = cfgBiller.INDUSTRY_DESC;
		}
	}
}

function handleBillerClear() {
	$('#billerSearch').val('');
	handleNextButtonVisiblity(true);
	handleBillerPopulation();
}
function handleClientDropDown() {
	var objClient = $('#clientDescAutoCompleter');
	var stUrl = 'services/userseek/userclients.json?$top=-1', opt = null;

	objClient.empty();

	$.ajax({
		type : 'POST',
		url : stUrl,
		success : function(data) {
			if (!isEmpty(data)) {
				data = data.d.preferences;
				$.each(data, function(index, cfg) {
					opt = $('<option />', {
						value : cfg.CODE,
						text : cfg.DESCR,
						'data-seller' : cfg.SELLER
					});
					opt.appendTo(objClient);
				});
				
				objClient.niceSelect();

				if (!isEmpty(selectedClient)) {
					$('#clientDescAutoCompleter').val(selectedClient);
					strSeller =$('#clientDescAutoCompleter :selected').data('seller');
					$('#clientDescAutoCompleter').niceSelect('update');
				}

				$('#clientMargin').show();
				if (strEntityType === '0') {
					$('#corporationDiv').show();
				}
				else
					if (strEntityType === '1' && data.length > 1) {
						$('#corporationDiv').show();
					}
					else
						if (strEntityType === '1' && data.length === 1 || data.length === 0) {
							$('#corporationDiv').hide();
							$('#clientMargin').hide();
						}
			}
		}
	});
}

function handleClientSelection() {
	
	strSeller =$('#clientDescAutoCompleter :selected').data('seller');
	selectedClient = $('#clientDescAutoCompleter').val();
	$('#billerIndustrySearch,#billerSearch').val('');
	$('#billerIndustrySearch').attr('industry_code', '');
	handleNextButtonVisiblity(true);
	initializationForRegisterBiller();
}
function handleRegisterBillerNext() {
	var frm;
	var strUrl = 'addBillerRegistration.srvc';

	frm = document.createElement('FORM');
	frm.name = 'frmMain';
	frm.id = 'frmMain';
	frm.action = strUrl;
	frm.target = '';
	frm.method = 'POST';
	frm.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'selectedClientCode', selectedClientCode));
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'selectedIndustryCode', selectedIndustryCode));
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'selectedIndustryDesc', selectedIndustryDesc));
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'selectedBillerCode', selectedBillerCode));
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'selectedBillerDesc', selectedBillerDesc));
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'sellerCode', sellerCode));
	
	document.body.appendChild(frm);
	frm.submit();
	document.body.removeChild(frm);
}

function goToCenterPage() {
	var frm;
	var strUrl = 'billerRegistrationCenter.srvc';

	frm = document.createElement('FORM');
	frm.name = 'frmMain';
	frm.id = 'frmMain';
	frm.action = strUrl;
	frm.target = '';
	frm.method = 'POST';
	frm.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
	document.body.appendChild(frm);
	frm.submit();
	document.body.removeChild(frm);
}

function paintNoDataMsg(listId, divId) {
	var objList, objUl, objDiv, objLi;
	objList = listId;
	objList.empty();
	objDiv = $('<div>').attr({
		'id' : divId
	});
	objUl = $('<ul>').attr({
		'class' : ''
	});
	objUl.appendTo(objDiv);
	objDiv.appendTo(objList);
	objLi = $('<li>');
	$('<span>').attr({
		'class' : 'ft-padding'
	}).html('No Data Present').appendTo(objLi);
	objLi.appendTo(objUl);
}
function handleVisualIndication(div, selectedAnchor) {
	var objDiv = $('#' + div);
	objDiv.find('a').each(function() {
		$(this).removeClass('selected-dropdown');
	});
	if (!isEmpty(selectedAnchor) && selectedAnchor !== null) {
		$(selectedAnchor).addClass('selected-dropdown');
	}
}
function handleNextButtonVisiblity(isDisabled) {
	var objNextButton = $('#btnRegisterBillerNext');
	if (isDisabled === true) {
		objNextButton.prop('disabled', true);
	}
	else
		if (isDisabled === false) {
			objNextButton.prop('disabled', false);
		}
}

function goToPage(strUrl) {
    handleAutonumericvalues();
	var frm = document.getElementById('frmMain');
	$('#reference').attr('disabled', false);
	$('#registrationDate').attr('disabled', false);
	frm.action = strUrl;
	frm.target = '';
	frm.method = 'POST';
	frm.submit();
}
function showWarning(strUrl) {
	$('#cancelWarningMsg').bind('click', function() {
		$('#warningMsgPopup').dialog('close');
	});

	$('#doneWarningMsgbutton').bind('click', function() {
		$(this).dialog('close');
		gotoPage(strUrl);
	});
	if (dirtyBitSet && isTxnExists === 'true') {
		$('#warningMsgPopup').dialog({
			autoOpen : false,
			maxHeight : 550,
			minHeight : 'auto',
			width : 400,
			modal : true,
			resizable : false,
			draggable : false
		});
		$('#warningMsgPopup').dialog('open');
		$('#textContent').focus();
	}
	else {
		gotoPage(strUrl);
	}
}
function handleAutoPayDisplay() {
	var strBillPayType = $('input[type="radio"][name="billPayType"]:checked').val();
	if ('M' === strBillPayType) {
		$('#autoPayDetailsDiv').addClass('hidden');
	}
	else {
		$('#autoPayDetailsDiv').removeClass('hidden');
	}
}
function getCancelConfirmPopUp(strUrl) {
	$('#cancelConfirmMsg').bind('click', function() {
		$('#confirmMsgPopup').dialog('close');
	});

	$('#doneConfirmMsgbutton').bind('click', function() {
		$(this).dialog('close');
		gotoPage(strUrl);
	});
	if (dirtyBitSet) {
		$('#confirmMsgPopup').dialog({
			autoOpen : false,
			maxHeight : 550,
			minHeight : 'auto',
			width : 400,
			modal : true,
			resizable : false,
			draggable : false
		});
		$('#confirmMsgPopup').dialog('open');
		$('#textContent').focus();
	}
	else {
		gotoPage(strUrl);
	}
}
function setDirtyBit() {
	dirtyBitSet = true;
	$('#dirtyBit').val('1');
}

function getDiscardConfirmPopUp(strUrl) {
	$('#cancelDiscardConfirmMsg').bind('click', function() {
		$('#discardMsgPopup').dialog('close');
	});
	$('#doneConfirmDiscardbutton').bind('click', function() {
		$(this).dialog('close');
		goToPage(strUrl);
	});
	$('#discardMsgPopup').dialog({
		autoOpen : false,
		maxHeight : 550,
		width : 400,
		modal : true,
		resizable : false,
		draggable : false
	});
	$('#discardMsgPopup').dialog('open');
	$('#textContent').focus();
}

function showBillerInfoPopup() {
	$('#billerTrasanctionInfoSectionDiv').dialog(
			{
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				dialogClass : 'ft-dialog',
				title : getLabel('billerinformation', 'Biller Information'),
				open : function() {
					$('#billerTrasanctionInfoSectionDiv').removeClass('hidden');
					var additionalInfo = getBillerAddtionInformationData($('#viewState').val());
					if (!isEmpty(additionalInfo)) {
						if (additionalInfo && additionalInfo.companyInfo && additionalInfo.companyInfo.company
								&& additionalInfo.companyInfo.companyAddress) {
							var strCompany = additionalInfo.companyInfo.company + '</br>'
									+ additionalInfo.companyInfo.companyAddress;
							$('.companydetails_InfoSpan ').html(strCompany);
						}
						if (additionalInfo && additionalInfo.product) {
							$('.product_InfoSpan').text(additionalInfo.product);
						}
						if (additionalInfo && additionalInfo.enteredBy) {
							$('.enteredBy_InfoSpan').text(additionalInfo.enteredBy);
						}
						if (additionalInfo && additionalInfo.status) {
							$('.status_InfoSpan').text(additionalInfo.status);
						}
					}
					if (!isEmpty(additionalInfo.history) && additionalInfo.history.length > 0) {
						paintBillerTransactionAuditInfoGrid(additionalInfo.history);
					}
					$('#billerTrasanctionInfoSectionDiv').dialog('option', 'position', 'center');
				},
				close : function() {
				}
			});
	$('#billerTrasanctionInfoSectionDiv').dialog('open');
	$('#billerTrasanctionInfoSectionDiv').dialog('option', 'position', 'center');
}

function getBillerAddtionInformationData(strIdentifier) {
	var objResponseData = null;
	var strData = {};
	strData[csrfTokenName] = csrfTokenValue;
	if (strIdentifier && strIdentifier !== '') {
		var strUrl = 'services/billerRegistration/billerAdditionalInfo.json?viewState=' + strIdentifier;
		$.ajax({
			url : strUrl,
			type : 'POST',
			data : strData,
			async : false,
			contentType : 'application/json',
			complete : function(XMLHttpRequest, textStatus) {
			},
			success : function(data) {
				if (data && data.d) {
					objResponseData = data.d;
				}
			}
		});
	}
	return objResponseData;
}

function paintBillerTransactionAuditInfoGrid(data) {
	var renderToDiv = 'auditInfoGridDiv';
	$('#auditInformationInfoHdrDiv').removeClass('hidden');
	if (!isEmpty(renderToDiv)) {
		$('#' + renderToDiv).empty();
		var store = createAuditInfoGridStore(data);
		var grid = Ext.create('Ext.grid.Panel', {
			store : store,
			popup : true,
			columns : [ {
				dataIndex : 'userCode',
				text : getLabel('userCode', 'User'),
				width : 150,
				draggable : false,
				resizable : false,
				hideable : false
			}, {
				dataIndex : 'logDate',
				text : getLabel('logDate', 'Date Time'),
				width : 200,
				draggable : false,
				resizable : false,
				hideable : false
			}, {
				dataIndex : 'statusDesc',
				text : getLabel('statusDesc', 'Status'),
				width : 150,
				draggable : false,
				resizable : false,
				hideable : false,
				renderer : function(value, metadata) {
					if (!Ext.isEmpty(value) && value.length > 11) {
						metadata.tdAttr = 'title="' + value + '"';
					}
					return value;
				}
			}, {
				dataIndex : 'remarks',
				text : getLabel('remarks', 'Reject Remarks'),
				flex : 1,
				draggable : false,
				resizable : false,
				hideable : false,
				renderer : function(value, metadata) {
					if (!Ext.isEmpty(value) && value.length > 11) {
						metadata.tdAttr = 'title="' + value + '"';
					}
					return value;
				}
			} ],
			renderTo : renderToDiv
		});
		var layout = Ext.create('Ext.container.Container', {
			width : 'auto',
			items : [ grid ],
			renderTo : renderToDiv
		});
		layout;
		return layout;
	}
	function createAuditInfoGridStore(jsonData) {
		var myStore = Ext.create('Ext.data.Store', {
			fields : [ 'version', 'parentRecordKeyNo', 'userCode', 'logDate', 'statusDesc', 'clientCode', 'logNumber',
					'billerCode', 'remarks', '__metadata' ],
			data : jsonData,
			autoLoad : true
		});
		return myStore;
	}

}

function handleAutonumericvalues(){
    var objVal = null;
    $('.enrichmentAmount').each(function () {
        var inp = $('<input id="tempInp">')
    	inp.autoNumeric("init", {
            aSep : strGroupSeparator,
            dGroup: strAmountDigitGroup,
            aDec : strDecimalSeparator,
            mDec : strAmountMinFraction,
            vMin : 0,
            vmax : '9999999999999.99'
        });
    	inp.val($(this).val());
    	objVal = inp.autoNumeric('get');
        $(this).val(objVal);
        inp = null;
});
}