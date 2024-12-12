function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId), strValue = null;
	if(strUrl == 'submitStopPay.srvc')
	{
	frm.appendChild(createFrmField('INPUT', 'HIDDEN', 'newRecid',
			newRecid));
	frm.appendChild(createFrmField('INPUT', 'HIDDEN', 'isAdv','Y'));
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function createFrmField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function getUrlMap() {
	return {
		'gridUrl' : 'services/chkAdvStopPayGridList/id.json',
		'discardUrl' : 'services/chkAdvStopPayBackdiscard/id.json',
		//'saveRecordUrl' : 'static/scripts/payments/checkmgmtNew/data/saveData.json',
		'saveRecordUrl' : 'services/chkAdvStopPaySave.json',
		'gridGroupActionUrl' : 'services/chkAdvStopPayGridlist', //'static/scripts/payments/checkmgmtNew/data/{0}.json',
		'placeEnquiryUrl' : 'services/chkAdvPlaceInquiry/id.json', //'static/scripts/payments/checkmgmtNew/data/placeEnquiry{0}.json',
		'backToSummary' : 'checkManagement.srvc',
		'importFileUrl' : 'services/chkAdvStpTransactionImport',
		'mapcodelistUrl' : 'chkAdvStopMapcodelist.srvc',
		'importGridUrl'	: 'services/chkAdvStpTransactionStatus.json',
		'importErrorReportUrl'	: 'services/getFileUploadCenterList/getUploadErrorReport.pdf',
		'stopPayRequest' : 'services/chkAdvPlaceStopPay.json'
	}
}

function toggleGridAddRow(canBind) {
	if (canBind) {
		$('#btnAddRow').unbind('click');
		$('#btnAddRow').bind('click', function() {
					$(document).trigger("addGridRow");
				});
		$('#btnSaveRec').unbind('click');
		$('#btnSaveRec').bind('click', function() {
					if (objAdvStopPayEntryGrid
							&& objAdvStopPayEntryGrid.isRecordInEditMode()) {
						objAdvStopPayEntryGrid.doHandleRecordSaveOnFocusOut(
								refreshEditableGrid, null);
					}
		});		
	} else
	{
		$('#btnAddRow').unbind('click');
		$('#btnSaveRec').unbind('click');
}
}
function refreshEditableGrid()
{
	objAdvStopPayEntryGrid.refreshData();
}

function doHandleBack() {
	var objJson = new Array();
	var strUrl = _mapUrl['discardUrl'];
	$.ajax({
				type : "POST",
				url : strUrl,
				data:{
					'id':strBatchRefNmbr
				},
				async : false,
				complete : function(XMLHttpRequest, textStatus) {

				},
				success : function(data) {
					goToPage(_mapUrl['backToSummary'], 'frmMain');
				}
			});

}
function doHandlePlaceEnquiry() {
	var me = this;
	 grid = objAdvStopPayEntryGrid.getGroupView().getGrid();
	var objJson = new Array();
	var strUrl = _mapUrl['placeEnquiryUrl'];
	
	var arrayJson = new Array();
	var records = (objAdvStopPayEntryGrid.getGroupView().getGrid().getSelectedRecords() || []);
	for (var index = 0; index < records.length; index++) {
		arrayJson.push({
			serialNo : grid.getStore().indexOf(records[index]) + 1,
			identifier : records[index].data.advStopPayMetaData._detailId,
			userMessage : ""
		});
	}
	if (arrayJson)
		arrayJson = arrayJson.sort(function(valA, valB) {
					return valA.serialNo - valB.serialNo
				});
	
	if(records.length > 0)
	    strUrl = 'services/chkAdvPlaceInquiry.json';
	
	
	$.ajax({
				type : "POST",
				url : strUrl,
				async : false,				
				data : records.length > 0 ?JSON.stringify(arrayJson):{id : strBatchRefNmbr},
				success : function(data) {
					if (data && data.d && data.d.instrumentActions
							&& data.d.instrumentActions[0]
							&& data.d.instrumentActions[0].success === 'Y')
						isEnquiryPlaced = true;
					$('#stopPayActionCt').empty();
					paintActions('STOPPAY');
					if (objAdvStopPayEntryGrid) {
						objAdvStopPayEntryGrid.removeAll(true);
						objAdvStopPayEntryGrid.destroy(true);
						objAdvStopPayEntryGrid = null;
						doCreateAdvStopPayEntryGrid('Y', false, false);
					}
				}
			});
}
function doHandleStopPayAndVerify() {
	var selectedRecords = null;
	var grid = null,groupView=null,strSeqNumber='';
	if (objAdvStopPayEntryGrid) {
		groupView = objAdvStopPayEntryGrid.getGroupView();
		if(!isEmpty(groupView))
			grid = objAdvStopPayEntryGrid.getGroupView().getGrid();
		if(!isEmpty(grid))
			selectedRecords = grid.getSelectedRecords();
		
		$.each(selectedRecords, function(index, cfg) {
			var objData = cfg.data;
			if(objData)
					strSeqNumber+=objData.sequenceNmbr+',';
				
		});
		if(!isEmpty(strSeqNumber))
			strSeqNumber=strSeqNumber.slice(0,-1);
		
		objAdvStopPayEntryGrid.removeAll(true);
		objAdvStopPayEntryGrid.destroy(true);
		objAdvStopPayEntryGrid = null;
		$('#txnStep1').removeClass('ft-status-bar-li-active')
				.addClass('ft-status-bar-li-done');
		$('#txnStep2').addClass('ft-status-bar-li-active')
		paintActions('VERIFY');
		doCreateAdvStopPayEntryGrid('Y', true, false,strSeqNumber);
		toggleAccountNumberField(true);
	}
}

function toggleAccountNumberField(blnShowAccSpanFeild){
	var objAccNoSelect=null,objAccNoSpan=null,objAccNoDiv=null;
	objAccNoSelect = $('#account,#account_jq');
	objAccNoSpan = $('#accountNoSpan');
	objAccNoDiv = $('#accountNoDiv');
	if(blnShowAccSpanFeild){
		if(!isEmpty(objAccNoSelect)){
			objAccNoSpan.text($('#account :selected').text());
			objAccNoDiv.removeClass('hidden');
			objAccNoSelect.addClass('hidden');
		}
	}
	else{
		objAccNoSpan.empty();
		objAccNoDiv.addClass('hidden');
		objAccNoSelect.removeClass('hidden');
	}
}

function doHandleBackToEntryPage() {
	if (objAdvStopPayEntryGrid) {
		objAdvStopPayEntryGrid.removeAll(true);
		objAdvStopPayEntryGrid.destroy(true);
		objAdvStopPayEntryGrid = null;
		$('#txnStep2').removeClass('ft-status-bar-li-active');
		$('#txnStep1').removeClass('ft-status-bar-li-done')
				.addClass('ft-status-bar-li-active')
		paintActions('STOPPAY');
		doCreateAdvStopPayEntryGrid('Y', false, true);
		toggleAccountNumberField(false);
	}
}

function doHandleSubmit() {
	var objJson = new Array(),selectedRecords=null;
	var strUrl = _mapUrl['stopPayRequest'];
	var grid=null,groupView=null;
	
		if (objAdvStopPayEntryGrid) {
			groupView = objAdvStopPayEntryGrid.getGroupView();
			if(!isEmpty(groupView))
				grid = objAdvStopPayEntryGrid.getGroupView().getGrid();
			
			if(!isEmpty(grid)){
				//if (isVerifyEnabled)
					selectedRecords =  grid.getSelectedRecords();
				/*else 
					selectedRecords = grid.getSelectedRecords();*/
			}	
			if(!isEmpty(selectedRecords)){
				$.each(selectedRecords, function(index, cfg) {
						objJson.push({
							serialNo : grid.getStore().indexOf(selectedRecords[index]) + 1,
							identifier : selectedRecords[index].data.advStopPayMetaData._detailId,
							userMessage : ''
						});
				});
			}
			
			if (objJson)
				objJson = objJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
		}
		
		$.ajax({
				type : "POST",
				url : strUrl,
				async : false,
				contentType : "application/json",
				data : JSON.stringify(objJson),
				success : function(data) {
					
					if (data && data.d && data.d.instrumentActions
							&& data.d.instrumentActions[0]
							&& data.d.instrumentActions[0].success === 'Y'){
						newRecid = data.d.instrumentActions[0].updatedStatusCode;				 
						goToPage('submitStopPay.srvc', 'frmMain');
						
					}
				}
			});
}
function getRecordCountToBeAdded(intGridRecordCnt, intMaxApplicableCount) {
	var intRetCount = 0;
	if (intGridRecordCnt === 0 || isEmpty(intGridRecordCnt)) {
		intRetCount = intMaxApplicableCount > intMaxAllowedRows
				? intMaxAllowedRows
				: intMaxApplicableCount;
	} else {
		intRetCount = intMaxApplicableCount >= (intMaxAllowedRows - intGridRecordCnt)
				? (intMaxAllowedRows - intGridRecordCnt)
				: intMaxApplicableCount;

	}
	return intRetCount;
}
function autoFocusFirstElement() {
	$('#advStopPayDiv :input:not(:checkbox):not(:radio):not([readonly]):visible:enabled:first')
			.focus();
}
function handleAccountChange() {
	$(document).trigger("handleAccountChange", [$('#account').val()]);
}
function handleSellerChange() {
	$(document).trigger("handleSellerChange", []);
}
function handleClientChange() {
	$(document).trigger("handleClientChange", []);
}

function getBackConfirmationPopup() {
	var _objDialog = $('#backConfirmationPopup');
	var  _objDialog1 = $('#backConfirmationPopup1');
	
	if(isEnquiryPlaced){
				_objDialog1.dialog({
					bgiframe : true,
					autoOpen : false,
					modal : true,
					resizable : false,
					width : "320px",
					buttons :[
						{
							text:getLabel('btnOk','Ok'),
							click : function() {
							$(this).dialog("close");
							goToPage(_mapUrl['backToSummary'], 'frmMain');
							}
						},
						{
							text:getLabel('btncancel','Cancel'),
						click : function() {
							$(this).dialog('destroy');
						}
					}
					]
				});
		_objDialog1.dialog('open');
		_objDialog1.dialog('option', 'position', 'center');
		
	}
	else{
		_objDialog.dialog({
					bgiframe : true,
					autoOpen : false,
					modal : true,
					resizable : false,
					width : "320px",
					buttons :[
						{
							text:getLabel('btnOk','Ok'),
							click : function() {
							$(this).dialog("close");
							doHandleBack();
							}
						},
						{
							text:getLabel('btncancel','Cancel'),
						click : function() {
							$(this).dialog('destroy');
						}
					}
					]
				});
		_objDialog.dialog('open');
		_objDialog.dialog('option', 'position', 'center');
	}
}

function createButton(btnKey, charIsPrimary) {
	var strCls = charIsPrimary === 'P'
			? 'ft-button canDisable ft-button-primary ft-margin-l'
			: (charIsPrimary === 'L'
					? 'ft-btn-link canDisable '
					: 'ft-button canDisable ft-button-light');

	var elt = null;
	elt = $('<input>').attr({
				'type' : 'button',
				'tabindex' : 1,
				'class' : strCls,
				'id' : 'button_' + btnKey,
				'value' : mapLbl[btnKey]
			});
	return elt;
}

function paintActions(strAction) {
	/**
	 * strAction can be ADD, STOPPAY VERIFY
	 */
	var elt = null, btnBack = null;
	$('#stopPayActionButtonListLB,#stopPayActionButtonListRB').empty();
	var strBtnLTLB = '#stopPayActionButtonListLB';
	var strBtnRTRB = '#stopPayActionButtonListRB';
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
				getBackConfirmationPopup();
			});
	if (strAction === 'ADD') {
		elt = createButton('btnPlaceEnquiry', 'P');
		elt.click(function() {
					doHandlePlaceEnquiry();
				});
		elt.appendTo($(strBtnRTRB));
		togglePlaceEnquiryButton(true);
		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'STOPPAY') {
		elt = createButton('btnStopPayAndSubmit', 'P');
		if (isVerifyEnabled)
			elt.attr('value', mapLbl['btnStopPayAndVerify']);
		elt.click(function() {
					if (isVerifyEnabled)
						doHandleStopPayAndVerify();
					else
						doHandleSubmit();
				});
		elt.appendTo($(strBtnRTRB));
		toggleStopPayButton(true);
		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'VERIFY') {
		elt = createButton('btnSubmit', 'P');
		elt.click(function() {
					doHandleSubmit();
				});
		elt.appendTo($(strBtnRTRB));
		btnBack.unbind('click');
		btnBack.bind('click', function() {
					doHandleBackToEntryPage();
				});
		btnBack.appendTo($(strBtnLTLB));
	}

}

function togglePlaceEnquiryButton(blnDisable) {
	$('#button_btnPlaceEnquiry').attr("disabled", blnDisable);
}
function toggleStopPayButton(blnDisable) {
	$('#button_btnStopPayAndVerify,#button_btnStopPayAndSubmit').attr(
			"disabled", blnDisable);
}
function handlePageActionsVisibilty(strActionMask) {
	var isVisible = !isEmpty(strActionMask) && strActionMask.length >= 2
			&& strActionMask.substr(1, 1) == '1' ? true : false;
	$('#button_btnStopPayAndVerify,#button_btnStopPayAndSubmit').attr(
			"disabled", !isVisible);
}

function doClearMessageSection() {
	$('#messageArea').empty();
	$('#successMessageArea, #messageArea, #messageContentDiv')
			.addClass('hidden');
}
function paintErrors(arrError) {
	doHandlePaintErrors(arrError);
}

function doHandlePaintErrors(arrError) {
	var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '';
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
					strMsg = error.errorMessage;
					strErrorCode = error.errorCode || error.code;
					strMsg += !isEmpty(strErrorCode) ? ' (' + strErrorCode
							+ ')' : '';
					if (!isEmpty(strErrorCode)) {
						element = $('<p>').text(strMsg);
						element.appendTo($('#' + strTargetDivId));
						$('#' + strTargetDivId + ', #messageContentDiv')
								.removeClass('hidden');
					}
				});
	}
}

function getAddRowValidationPopup(){
	var _objDialog = $('#addRowValidationPopup');
	_objDialog.dialog({
					bgiframe : true,
					autoOpen : false,
					modal : true,
					resizable : false,
					width : "320px",
buttons :[
						{
							text:getLabel('btnOk','Ok'),
							click : function() {
								$(this).dialog("close");
							}
						}
					]
				
				});
		_objDialog.dialog('open');
		_objDialog.dialog('option', 'position', 'center');
}

/* Import handling Starts Here */
function showImportTransactionsPopup() {
	var blnResult = true;	
    $("#lblSelectedFileName").html("");
	if(!isEmpty(objAdvStopPayEntryGrid))
		blnResult = objAdvStopPayEntryGrid.validateTotalRow();
	if(blnResult === false){
		getAddRowValidationPopup();
	}
	else {
		$("#importTransactionPopup").dialog({
			modal : true,
			maxHeight : 550,
			width : 735,
			resizable : false,
			draggable : false,
			title : getLabel('importTransactions', 'Import Transactions'),
	
			open : function(event, ui) {
				populateClientMapCodeField();
				$('#importTxn_btnUpload').unbind("click");
				$('#importTxn_btnUpload').bind("click", function() {
							doUploadFile();
						});
				$('#txnDetailsGridDiv').empty();
				txnDetailsGrid = createTxnDetailsGrid('txnDetailsGridDiv', null);
			},
			close : function(event, ui) {
				if (typeof objInstrumentEntryGrid != 'undefined'
						&& objInstrumentEntryGrid) {
				}
				$(document).trigger("refreshGridData");
			}
		});
	}
}
function closeImportTransactionsPopup() {
		$('#importTransactionPopup').dialog('close');
}
function createTxnDetailsGrid(divId, strIdentifier) {
	var renderToDiv = !isEmpty(divId) ? divId : 'txnDetailsGridDiv';
	var store = createTxnDetailsGridStore();
	var grid = Ext.create('Ext.grid.Panel', {
		store : store,
		maxHeight : 200,
		scroll : 'vertical',
		cls : 't7-grid',
		popup : true,
		listeners : {
			cellclick : function(view, td, cellIndex, record, tr, rowIndex, e,
					eOpts) {
				if (record.data.statusCode === 'E'
						|| record.data.statusCode === 'T') {
					showUploadErrorReport(record.data);;
				}

			}
		},
		columns : [{
			text : getLabel('lblAction', 'Action'),
			width : 70,
			draggable : false,
			resizable : false,
			sortable : false,
			hideable : false,
			colType : 'action',
			showPager : true,
			renderer : function(value, metaData, record, rowIndex, colIndex,
					store) {
				if (record.data.statusCode === 'E'
						|| record.data.statusCode === 'T') {
					return '<a class="grey cursor_pointer action-link-align grid-row-action-icon icon-error" name="btnViewError" title="'
							+ getLabel('lblViewReport', 'View Report')
							+ '">&nbsp;&nbsp;</a>';
				}
				if (record.data.statusCode === 'Q'
						|| record.data.statusCode === 'R') {
					return '<i class="fa fa-spinner"></i>';
				} else {
					return '<a class="grey cursor_pointer action-link-align grid-row-action-icon icon-completed" name="btnViewOk" title="'
							+ getLabel('lblCompleted', 'Completed')
							+ '">&nbsp;&nbsp;</a>';
				}
			}

		}, {
			text : getLabel('lblFileName', 'File Name'),
			dataIndex : 'fileName',
			width : 110,
			draggable : false,
			resizable : true,
			hideable : false,
			sortable : false
		}, {
			text : getLabel('lblCreatedOn', 'Import DateTime'),
			dataIndex : 'createdOn',
			width : 130,
			draggable : false,
			resizable : true,
			hideable : false,
			sortable : false
		}, {
			text : getLabel('lblRemarks', 'Status'),
			dataIndex : 'remarks',
			flex : 1,
			draggable : false,
			resizable : true,
			hideable : false,
			sortable : false
		}],
		renderTo : renderToDiv
	});
	return grid;
}

function createTxnDetailsGridStore() {
	var jsonData = null;
	var data = {};
	data["identifier"] = strBatchRefNmbr;
	$.ajax({
				url : _mapUrl['importGridUrl'],
				type : 'POST',
				data : data,
				async : false,
				complete : function(XMLHttpRequest, textStatus) {
				},
				success : function(data) {
					if (data && data.d)
						jsonData = data.d.status;
				}
			});

	var myStore = Ext.create('Ext.data.Store', {
				id : 'matrixStore',
				fields : ['fileName', 'createdOn', 'remarks', 'statusCode',
						'ahtskdata', 'ahtskclient'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}

function showUploadErrorReport(record) {
	var me = this;
	var importType = 'Y';
	if (record.statusCode == 'E')
		importType = 'N';
	var strUrl = _mapUrl['importErrorReportUrl'];
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,
			csrfTokenValue));
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'taskid',
			record.ahtskdata));
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'isImportReport',
			importType));
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'client',
			record.ahtskclient));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

function toggleMoreLessText(me) {
	$(".moreCriteria").toggleClass("hidden");
	$("#moreLessCriteriaCaret").toggleClass("fa-caret-up fa-caret-down");
	var textContainer = $(me).children("#moreLessCriteriaText");
	var labelText = textContainer.text().trim();
	if (labelText == getLabel("lblHideImportHeader",
			"Hide Import Transaction Details")) {
		textContainer.text(getLabel("lblShowImportHeader",
				"Show Import Transaction Details"));

	} else if (labelText == getLabel("lblShowImportHeader",
			"Show Import Transaction Details")) {
		textContainer.text(getLabel("lblHideImportHeader",
				"Hide Import Transaction Details"));

	}

}
function populateClientMapCodeField() {
	var strData = {};
	strData[csrfTokenName] = csrfTokenValue;
	$.ajax({
				url : _mapUrl['mapcodelistUrl'],
				data : strData,
				method : 'POST',
				success : function(responseData) {
					if (!isEmpty(responseData)) {
						var data = responseData;
						var el = $("#clientMapCode");
						$(el).empty();
						for (index = 0; index < data.length; index++) {
							obj = data[index];
							Object.keys(obj).forEach(function(key)
							{
								var opt = $('<option />', {
									value : key,
									text : obj[key]
								});
							opt.attr('selected', 'selected');
							opt.appendTo(el);
							});
						}
					}
				}
			});
}

function importPopup() {
	doUploadFile();
}

function refreshUploadGrid()
{
	$("#txnDetailsGridDiv").empty();
	createTxnDetailsGrid('txnDetailsGridDiv', null);
}

function doUploadFile() {
	var data = new FormData();
	var me = this;
	$("#importBtn").attr('disabled','true');

	if(((_mapAccounts[$("#account").val()] || {}).accountId || '') == '')
	{
		var errors = [{errorMessage:"Account is required.", code:"REQ"}];
		paintErrors(errors);
		$("#importBtn").removeAttr('disabled');
		//closeImportTransactionsPopup();
		
	}
	else
	{
		data.append("file",
				document.getElementById('transactionImportFile').files[0]);
		data.append("clientMapCode", $('#clientMapCode').val());
		data.append("is", $('input[name=processParameterBean]:checked').val());		
		data.append("selectedAccount", ((_mapAccounts[$("#account").val()] || {}).accountId || ''));
		data.append("id",strBatchRefNmbr)
		$.ajax({
			url : _mapUrl['importFileUrl'] +'/id.json',
			type : "POST",
			data : data,
			processData : false,
			contentType : false,
			complete : function(XMLHttpRequest, textStatus) {
				},
			success : function(data) {
				var responseData = data.success;
				var isSuccess;
				var title, strMsg, imgIcon;
				if (responseData)
					isSuccess = responseData;
				if (isSuccess && isSuccess === 'N') {
					var errorMessage = '';
					var errorsList = data.errors;
					paintErrors(errorsList);
				} else {
					//closeImportTransactionsPopup();
					$(document).trigger("refreshGridData");
				}
				$("#importBtn").removeAttr('disabled');
				$('#transactionImportFile').val('');
				$('#lblSelectedFileName').html('');
				refreshUploadGrid();
			},
			error: function (error) {
				$("#importBtn").removeAttr('disabled');
	        }		
				
		});		
	}

}

function chooseFileClicked(){
	$('#transactionImportFile').click();
}

function newfileselected () {
	var filename = $('#transactionImportFile').val();
	if(filename) {
		$('#lblSelectedFileName').html(filename.substring(filename.lastIndexOf('\\')+1));
		$('#lblSelectedFileName').attr('title', filename.substring(filename.lastIndexOf('\\')+1));
	} else {
		$('#lblSelectedFileName').html(labels.lblNoFileSelected);
	}
}
/* Import handling Ends Here */

jQuery.fn.ClientSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url: 'services/userseek/adminAdvCheckMgtCorpSeek.json',
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$filtercode1 : $('#sellerId').val()
									},
									success : function(data) {
										var rec = data.d.preferences;
										
										response($.map(rec, function(item) {
													return {	
														
														label : item.DESCR,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.CODE))
							{
								// clear account dropdown and grid before selecting client
								handleClientChange();
								$('#account').empty();
								//$('#account').niceSelect();
					    		//$('#account').editablecombobox({emptyText : 'Select Account',dependantFieldId : null,maxLength : 40});
					    		//$('#account_jq').val('');
					    		
					    		
								$('#clientId').val(data.CODE);
								$('#clientDesc').val(data.DESCR);
								getSellerClientAccounts($('#sellerId').val(),$('#clientId').val());
							}
						}
						
					},
					change : function (combo, newValue, oldValue, eOpts) {
						if($('#clientDesc').val() == '')
						{
							$('#account').empty();
							//$('#account').niceSelect();
				    		//$('#account').editablecombobox({emptyText : 'Select Account',dependantFieldId : null,maxLength : 40});
				    		//$('#account_jq').val('');
				    		handleClientChange();
						}
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
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function getSellerClientAccounts(sellerCode,accountId)
{
	 var strData = {};
	var opt ;
	var clientId = null;
	var sellerDescription=null;
	var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g; 
	var strUrl = 'getAdvStopPayAccounts.srvc?'+ csrfTokenName + "=" + csrfTokenValue +"&$sellerCode="+ $('#sellerId').val();
	
	// in case of multi-seller when select dropdown renders
	if($( "#sellerId").length > 0) {
		sellerDescription = $( "#sellerId option:selected" ).text();
	}
	// in case of Single seller
	if( sellerDescription == '' && $('#sellerDescription').length > 0) {
		sellerDescription = sellerDesc != "" ? sellerDesc : $( "#sellerDescription" ).val();
	}
	
	clientId  = $('#clientId').val();	
	if(clientId != null && clientId != "")
	 strUrl = strUrl +"&$clientCode="+ clientId;
	 
	strUrl = strUrl +"&$screenType=AdvStopPay";
	
	
	while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
		strUrl = strUrl.substring(0, strUrl.indexOf('?'));
	
	if( sellerCode.value != "")
	{
		$.ajax(
			{
			    url: strUrl,
			    type: "POST",
			    context: this,
			    error: function () {},
			    dataType: 'json',
			     data: objParam ,
			    success : function (response) 
			    {
			    	$('#account').empty();
			    	//$('#account').niceSelect();
			    	//$('#account').editablecombobox({emptyText : 'Select Account',dependantFieldId : null,maxLength : 40});
		    		
			    	for( var i = 0 ; i < response.length ; i++ )
			    	{
						_mapAccounts[response[i].accountNmbr] = {
							'accountName' : response[i].accountName,
							'accountId' : response[i].accountId,
							'accountDesc' : response[i].accountDesc,
							'accountCcy' : response[i].accountCcy,
							'sellerCode' : $('#sellerId').val(),
							'sellerDesc' : sellerDescription,
							'clientId'   : response[i].clientId
						}
						$('#account').append($('<option>', {
							value : response[i].accountNmbr,
							text : response[i].accountDesc
						}));		
			    	}
			    }
			});
	}
	
}

function initatePaymentHeaderValidation() {
	var field = null, fieldId = null;
	$('#advStopPayGridDiv label.required').each(function() {
				fieldId = $(this).attr('for');
				field = $('#' + fieldId);
				if (field && field.length != 0) {
					field.bind('blur', function mark() {
								markRequired($(this));
							});
				}
			});
}

function enableDisableGridButton(strAccountNo){
	if(Ext.isEmpty(strAccountNo) || strAccountNo == null || strAccountNo == '' )
	{
		$('#btnAddRow ,#btnImportTxn ,#btnSaveRec').unbind('click');
		 $('#btnAddRow ,#btnImportTxn ,#btnSaveRec').addClass("x-btn-default-toolbar-small-disabled");
	}
	else
	{
		 $('#btnAddRow ,#btnImportTxn ,#btnSaveRec').removeClass("x-btn-default-toolbar-small-disabled");
			$('#btnSaveRec').bind('click', function() {
				if (objAdvStopPayEntryGrid
						&& objAdvStopPayEntryGrid.isRecordInEditMode()) {
					objAdvStopPayEntryGrid.doHandleRecordSaveOnFocusOut(
							refreshEditableGrid, null);
				}
			});
			$('#btnAddRow').bind('click', function() {
				$(document).trigger("addGridRow");
			});	
			$('#btnImportTxn').bind('click', function() {
				showImportTransactionsPopup();
			});					
	}		
}