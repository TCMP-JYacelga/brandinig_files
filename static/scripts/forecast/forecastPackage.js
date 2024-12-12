jQuery.fn.sellerCodeSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/foreSellerIdSeek.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,									
										$top:-1
										
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.CODE,														
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
							if (!isEmpty(data.DESCRIPTION))
							{
								$('#txtMySellerDesc').val(data.DESCRIPTION);
								$('#txtMySellerCode').val(data.CODE);
							}
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

jQuery.fn.clientCodeEntrySeekAutoComplete= function(seller) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/foreCorpSeek.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,										
										$sellerCode : seller,
										$top:-1
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
							if (!isEmpty(data.DESCR))
							{
								$('#txtBillMyClientDesc, #clientName').val(data.DESCR);
								$('#txtBillMyClientCode, #cboMyClient').val(data.CODE);
								clientChanged(data.CODE);
							}
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

function setDirtyBit()
{
	dirtyBitSet=true;
	$("#dirtyBit").val("1");
}

function getDiscardConfirmPopUp(strUrl){
	$('#cancelDiscardConfirmMsg').bind('click',function(){
		$('#discardMsgPopup').dialog("close");
	});
	$('#doneConfirmDiscardbutton').bind('click',function(){
		$(this).dialog("close");
		discardProfile(strUrl);
	});
	$('#discardMsgPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
	});
	$('#discardMsgPopup').dialog("open");
	$('#textContent').focus();
}

function getCancelConfirmPopUp(strUrl) {
	$('#cancelConfirmMsg').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
	});

	$('#doneConfirmMsgbutton').bind('click',function(){
		$(this).dialog("close");
		gotoPage(strUrl);
	});
	if(dirtyBitSet)
	{
		$('#confirmMsgPopup').dialog({
			autoOpen : false,
			maxHeight: 550,
			minHeight:'auto',
			width : 400,
			modal : true,
			resizable: false,
			draggable: false
		});
		$('#confirmMsgPopup').dialog("open");
		$('#textContent').focus();
	}
	else
	{
		gotoPage(strUrl);
	}
}



function showWarning(strUrl) {
	$('#cancelWarningMsg').bind('click',function(){
		$('#warningMsgPopup').dialog("close");
	});

	$('#doneWarningMsgbutton').bind('click',function(){
		$(this).dialog("close");
		update(strUrl);
	});
	if(dirtyBitSet && isTxnExists=='true')
	{
		$('#warningMsgPopup').dialog({
			autoOpen : false,
			maxHeight: 550,
			minHeight:'auto',
			width : 400,
			modal : true,
			resizable: false,
			draggable: false
		});
		$('#warningMsgPopup').dialog("open");
		$('#textContent').focus();
	}
	else
	{
		update(strUrl);
	}
}
function discardProfile(strUrl){
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	if(strEntityType=='1')
	{
		$('#clientDesc').val(strClientDesc);	
	}	
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function toggleCheckBoxValue(me)
{
	if (me.checked)
	{
		me.value="Y";
	}
	else
	{
		me.value="N";
	}	
}

function validateForecastTypes(index)
{
	if(mode !='VIEW' || mode !='VERIFY'){
		if($("#lstDetails_"+index+"_requiredFlag").val()=='Y')
		{
			if(sysParamExpectedComputation == 'Y'){
				$("#lstDetails_"+index+"_requiredFlag").attr('checked',true);
				$("#lstDetails_"+index+"_expectationPercentage").removeAttr("disabled");
				$("#lstDetails_"+index+"_editableFlag").removeAttr("disabled");
				if($("#lstDetails_"+index+"_editableFlag").val()=='N')
					$("#lstDetails_"+index+"_editableFlag").attr('checked',false);
			}else{
				$("#lstDetails_"+index+"_requiredFlag").attr('checked',true);
				$("#lstDetails_"+index+"_expectationPercentage").val('100.00');
				$("#lstDetails_"+index+"_expectationPercentage").attr("disabled","true");
				$("#lstDetails_"+index+"_editableFlag").attr("disabled","true");
				$("#lstDetails_"+index+"_editableFlag").attr('checked',false);
			}
		}else{
			$("#lstDetails_"+index+"_requiredFlag").attr('checked',false);
			$("#lstDetails_"+index+"_expectationPercentage").val('');
			$("#lstDetails_"+index+"_editableFlag").attr('checked',false);
			$("#lstDetails_"+index+"_editableFlag").val('N');
			$("#lstDetails_"+index+"_expectationPercentage").attr("disabled","true");
			$("#lstDetails_"+index+"_editableFlag").attr("disabled","true");
		}
	}
	if(mode == 'VIEW' || mode == 'VERIFY'){
		
		if($("#lstDetails_"+index+"_requiredFlag").val()=='Y')
		{
			$("#lstDetails_"+index+"_requiredFlagSpan").addClass('fa fa-check');
		}
		else{
			$("#lstDetails_"+index+"_requiredFlagSpan").removeClass('fa fa-check');
		}
		if($("#lstDetails_"+index+"_editableFlag").val()=='Y')
		{
			$("#lstDetails_"+index+"_editableFlagSpan").addClass('fa fa-check');
		}
		else{
			$("#lstDetails_"+index+"_editableFlagSpan").removeClass('fa fa-check');
		}
		//$("#lstDetails_"+index+"_requiredFlag").attr("disabled","true");
		//$("#lstDetails_"+index+"_editableFlag").attr("disabled","true");
	}
	
}
function validateForecastType()
{
	if (!document.getElementById("mypBankedRequired1").checked)
	{
		document.getElementById("mypBankedPerExpectation").disabled = true;
		document.getElementById("mypBankedPerExpectation").value="0.00";
		document.getElementById("mypBankedEditable1").disabled = true;
	}
	else
	{
		document.getElementById("mypBankedPerExpectation").disabled = false;
		document.getElementById("mypBankedEditable1").disabled = false;
	}
	
	if (!document.getElementById("mypMandatedRequired1").checked)
	{
		document.getElementById("mypMandatedPerExpectation").disabled = true;
		document.getElementById("mypMandatedPerExpectation").value="0.00";
		document.getElementById("mypMandatedEditable1").disabled = true;
	}
	else
	{
		document.getElementById("mypMandatedPerExpectation").disabled = false;
		document.getElementById("mypMandatedEditable1").disabled = false;
	}
	
	if (!document.getElementById("mypInvoicedRequired1").checked)
	{
		document.getElementById("mypInvoicedPerExpectation").disabled = true;
		document.getElementById("mypInvoicedPerExpectation").value="0.00";
		document.getElementById("mypinvoicedEditable1").disabled = true;
	}
	else
	{
		document.getElementById("mypInvoicedPerExpectation").disabled = false;
		document.getElementById("mypinvoicedEditable1").disabled = false;
	}
	
	if (!document.getElementById("mypPoRequired1").checked)
	{
		document.getElementById("mypPoPerExpectation").disabled = true;
		document.getElementById("mypPoPerExpectation").value="0.00";
		document.getElementById("mypPoEditable1").disabled = true;
	}
	else
	{
		document.getElementById("mypPoPerExpectation").disabled = false;
		document.getElementById("mypPoEditable1").disabled = false;
	}
	
	if (!document.getElementById("mypContractedRequired1").checked)
	{
		document.getElementById("mypContractedPerExpectation").disabled = true;
		document.getElementById("mypContractedPerExpectation").value="0.00";
		document.getElementById("mypContractedEditable1").disabled = true;
	}
	else
	{
		document.getElementById("mypContractedPerExpectation").disabled = false;
		document.getElementById("mypContractedEditable1").disabled = false;
	}
	
	if (!document.getElementById("mypExpectedRequired1").checked)
	{
		document.getElementById("mypExpectedPerExpectation").disabled = true;
		document.getElementById("mypExpectedPerExpectation").value="0.00";
		document.getElementById("mypExpectedEditable1").disabled = true;
	}
	else
	{
		document.getElementById("mypExpectedPerExpectation").disabled = false;
		document.getElementById("mypExpectedEditable1").disabled = false;
	}
	
	if (!document.getElementById("mypPlanedRequired1").checked)
	{
		document.getElementById("mypPlanedPerExpectation").disabled = true;
		document.getElementById("mypPlanedPerExpectation").value="0.00";
		document.getElementById("mypPlanedEditable1").disabled = true;
	}
	else
	{
		document.getElementById("mypPlanedPerExpectation").disabled = false;
		document.getElementById("mypPlanedEditable1").disabled = false;
	}
	
//	if (!document.getElementById("mypAllowAutoClose1").checked)
//	{
//		document.getElementById("mypafterDays").disabled = true;
//		document.getElementById("mypafterDays").value="";
//	}
//	else
//	{
//		document.getElementById("mypafterDays").disabled = false;
//	}
}

function update(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	if(strEntityType=='1')
	{
	//	$('#txtBillMyClientDesc').val(strClientDesc);	
	}	
	
	handleAutonumericvalues();
	frm.target = "";
	frm.method = "POST";
	if($('#txtBillMyClientCode').length)
		$('#txtBillMyClientCode').removeAttr("disabled");
	frm.action = strUrl;	
	frm.method = "POST";
	frm.submit();
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

function handleAutonumericvalues(ele){
	var blnAutoNumeric = false, objVal = null, strFieldName = null;
	$('.expectaionAutonumeric').each(function () {
		strFieldName = this.id;
		blnAutoNumeric = isAutoNumericApplied(strFieldName);
		if (blnAutoNumeric)
			objVal = $("#"+strFieldName).autoNumeric('get');
		else
			objVal = $("#"+strFieldName).val();
		
		$("#"+strFieldName).val(objVal);
});
}

function showAdditionalInfoEntryPopup() {
	resetPreviousValue();
	$('#messageContentDiv').addClass('hidden');
	doClearMessageSection();
	openAddAdditionalInfoPopup();
	$('#btnEnrichAdd').removeClass('hidden');
	$('#btnEnrichUpdate').addClass('hidden');
}

function resetPreviousValue() {
	$('#enrichDateFormat').prop('selectedIndex', 0);
	$("#enrichDateFormat").niceSelect('update');
	$('#enrichMandatory').prop('selectedIndex', 0);
	$("#enrichMandatory").niceSelect('update');
	$('#enrichDatatype').prop('selectedIndex', 0);
	$("#enrichDatatype").niceSelect('update');
	$("#panelBodyEnrichDetail :input").val('');
}

function doClearMessageSection() {
	$('#messageArea').empty();
	$('#successMessageArea, #messageArea, #messageContentDiv')
			.addClass('hidden');
}
function openAddAdditionalInfoPopup(){
	$('#additionalInfo').dialog({
		autoOpen : false,
		modal : true,
		maxHeight : 580,
		minHeight : (screen.width) > 1024 ? 156 : 0,
		width : 840,
		dialogClass : 'ft-dialog',
		resizable : false,
		draggable : false
		});
	$('#additionalInfo').dialog("open");
	$('#additionalInfo').dialog("option","position","center");
	enableEnrichmentFields();
}

function openViewAdditionalInfoPopup(){
	$('#additionalInfoView').dialog({
		autoOpen : false,
		modal : true,
		maxHeight : 580,
		minHeight : (screen.width) > 1024 ? 156 : 0,
		width : 840,
		dialogClass : 'ft-dialog',
		resizable : false,
		draggable : false
		});
	$('#additionalInfoView').dialog("open");
}
function closeViewAdditionalInfoPopup(){
	$('#additionalInfoView').dialog("close");
}
function closeAddAdditionalInfoPopup(){
	$('#additionalInfo').dialog("close");
	$('#btnAddAdditionalInfo').get(0).focus();
}

function saveAddAdditionalInfoPopup() {
	postAdditionalInfo('services/saveCffEnrichments', null, $("#viewState").val());
}

function postAdditionalInfo(strUrl, strDetailIdentifier, strParentIdentifier) {
	var jsonObject = generateAdditionalInfoJSON(strDetailIdentifier, strParentIdentifier);
	$.ajax({
				url : strUrl,
				type : 'POST',
				contentType : "application/json",
				data : JSON.stringify(jsonObject),
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
							"errorCode" : "Message",
							"errorMessage" : "Unknown Error"
						// TODO : getLabel
						});
						doHandlePaintErrors(arrError);
					}
				},
				success : function(data) {
					if (data && data.length > 0) {
						var objResponse = data[0];
						if (objResponse.success === 'Y') {
							$('#viewState').val(objResponse.successValue);
							doClearMessageSection();
							closeAddAdditionalInfoPopup();
							$(document).trigger("OnSaveRestoreGrid");
							detailMode = null;
						} else if (objResponse.errors
								&& objResponse.errors.length > 0) {
							var objErrors = objResponse.errors;
							doHandlePaintErrors(objErrors);
						}
					}
				}
			});
}

function generateAdditionalInfoJSON(strDetailIdentifier, strParentIdentifier) {
	var jsonObject = {};
	jsonObject['identifier'] = strParentIdentifier;
	jsonObject['detailIdentifier'] = strDetailIdentifier;
	jsonObject['enrichSequence'] = $('#enrichSequence').val();
	jsonObject['enrichLabel'] = $('#enrichLabel').val();
	jsonObject['enrichMandatory'] = $('#enrichMandatory').val();
	jsonObject['enrichDatatype'] = $('#enrichDatatype').val();
	jsonObject['enrichMaxLength'] = $('#enrichMaxSize').val();
	jsonObject['enrichDateFormat'] = $('#enrichDateFormat').val();
	return jsonObject;
}

function doHandlePaintErrors(arrError) {
	var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '';
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
			strErrorCode = error.errorCode || error.code;
			if (!isEmpty(strErrorCode)) {
				var msg = error.errorMessage;
				$('#successMessageArea').empty();
				element = $('<p>').text(msg);
				element.appendTo($('#' + strTargetDivId));
				$('#' + strTargetDivId + ', #messageContentDiv').removeClass(
						'hidden');
			}
		});
		$(".ft-content-pane-scroll").animate({
			scrollTop : 0
		}, "slow");
	}
}

function viewEnrichDetail(record)
{
	var dataToPopulate=[];
	var dataType = null;
	dataToPopulate = record.data;
	openViewAdditionalInfoPopup();
	switch(dataToPopulate.enrichDataType)
	{
	case 'S': dataType = "Text";
	break;
	case 'A': dataType = "Amount";
	break;
	case 'D': dataType = "Date";
	break;
	case 'N': dataType = "Number";
	break;
	}
	$("#enrichDatatypeView").text(dataType);
	$("#enrichDateFormatView").text(dataToPopulate.enrichFormat);
	if(dataToPopulate.mandatoryFlag === 'Y')
	$("#enrichMandatoryView").text("Yes");
	else
	$("#enrichMandatoryView").text("No");
	$("#enrichSequenceView").text(dataToPopulate.enrichNmbr);
	$("#enrichmentLabelView").text(dataToPopulate.enrichLabelDescription);
	$("#enrichMaxSizeView").text(dataToPopulate.enrichMaxLength);
}

function editEnrichDetail(record)
{
	var dataToPopulate=[],strDetailId;
	dataToPopulate = record.data;
	strDetailId = dataToPopulate.identifier;
	resetPreviousValue();
	$('#btnEnrichAdd').addClass('hidden');
	$('#btnEnrichUpdate').removeClass('hidden');
	$('#btnEnrichUpdate').unbind('click');
	$('#btnEnrichUpdate').click(function() {
		updateEnrichDetail(strDetailId);
	});
	openAddAdditionalInfoPopup();
	doClearMessageSection()
	$("#enrichDatatype option[value='"+ dataToPopulate.enrichDataType +"']").attr("selected", "selected");
	$('#enrichDatatype').niceSelect('update');
	$("#enrichDateFormat option[value='"+ dataToPopulate.enrichFormat +"']").attr("selected", "selected");
	$('#enrichDateFormat').niceSelect('update');
	$("#enrichMandatory option[value='"+ dataToPopulate.mandatoryFlag +"']").attr("selected", "selected");
	$('#enrichMandatory').niceSelect('update');
	$("#enrichSequence").val(dataToPopulate.enrichNmbr);
	$("#enrichLabel").val(dataToPopulate.enrichLabelDescription);
	$("#enrichMaxSize").val(dataToPopulate.enrichMaxLength);
	enableDisableEnrichmentFields();
}

function updateEnrichDetail(strDetailId) {
	postAdditionalInfo('services/updateCffEnrichments',strDetailId,$("#viewState").val());
}

function discardEnrichDetail(strDetailIdentifier)
{
	var jsonObject = {};
	jsonObject['detailIdentifier'] = strDetailIdentifier;
	jsonObject['identifier'] = $('#viewState').val();
	$.ajax({
		url : 'services/discardCffEnrichments',
		type : 'POST',
		contentType : "application/json",
		data : JSON.stringify(jsonObject),
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : getLabel('lbl.reconciliation.unknownerror','Unable to process your request at this moment.Please contact Admin!')
							//TODO : getLabel
						});
				doHandlePaintErrors(arrError);
			}
		},
		success : function(data) {
			if (data && data.length > 0) {
				var objResponse = data[0];
				if (objResponse.success === 'Y') {
					$('#viewState').val(objResponse.successValue);
					$(document).trigger("OnSaveRestoreGrid");
				} else if (objResponse.errors && objResponse.errors.length > 0) {
					var objErrors = objResponse.errors;
					doHandlePaintErrors(objErrors);
				}
			}
		}
	});
}

function enableDisableEnrichmentFields() {
	var dataType = $("#enrichDatatype").val();
	if (dataType === 'S' || dataType === 'N' || dataType === 'A') {
		disableEnrichDateType();
		if (dataType === 'A')
			disableEnrichMaxSize();
		else
			enableEnrichMaxSize();
	} else {
		disableEnrichMaxSize();
		enableEnrichDateType();
	}
}

function enableEnrichmentFields() {
	$("#enrichMaxSize").prop("disabled", true);
	$('#enrichDateFormat').removeClass('disabled');
	$('#dateFormatLabel').removeClass('required');
	$("#maxSizeLabel").removeClass('required');
	$('#enrichDateFormat').niceSelect('update');
}

function enableEnrichMaxSize() {
	$("#enrichMaxSize").prop("disabled", false);
	$("#maxSizeLabel").addClass('required');
}

function disableEnrichMaxSize() {
	$("#enrichMaxSize").prop("disabled", true);
	$("#maxSizeLabel").removeClass('required');
	$("#enrichMaxSize").val("");
}

function enableEnrichDateType() {
	$('#enrichDateFormat').removeClass('disabled');
	$('#enrichDateFormat').removeAttr('disabled');
	$('#dateFormatLabel').addClass('required');
	$('#enrichDateFormat').niceSelect('update');
}

function disableEnrichDateType() {
	$('#enrichDateFormat').addClass('disabled');
	$("#dateFormatLabel").removeClass('required');
	$('#enrichDateFormat').val("");
	$('#enrichDateFormat').niceSelect('update');
}

function clientChanged(client)
{
	var frm = document.getElementById("frmMain");
	$('#cboMyClient,#txtBillMyClientCode').val(client);
	$(":input").removeAttr('disabled');
	frm.action = "addForecastPackageMst.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}