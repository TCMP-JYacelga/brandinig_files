var recDetails;
function saveHybridDetail( strUrl )
{	
	var form;
	var viewState = document.getElementById( "viewState" ).value;
	strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="+ csrfTokenValue;
	form = document.createElement( 'FORM' );
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';	
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();	
}

function closeAddHybridDtlPopup(dtlMode) {
	if(dtlMode === 'A' || dtlMode === 'E' )
	{
		$('#HybridDetailsPopup').dialog("close");
	}
	else
	{
		$('#HybridDetailsPopupView').dialog("close");	
	}
}

jQuery.fn.agreementAutoComplete = function() {
	var stUrl = 'services/userseek/hybridAgreementCodeIdSeek.json';
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
					url : stUrl,
					dataType : "json",
					type : 'POST',
					data : {
						top : -1,
						$autofilter : request.term,
						$filtercode1 : parentRecordKeyNo,
						$filtercode2 : clientId,
						$sellerCode  : sellerCode
					},
					success : function(data) {
						var clientData = data.d.preferences;
						recDetails = clientData;
						if (isEmpty(clientData) || (isEmpty(data.d)) || clientData.length === 0) {
							var rec = [ {
								label : 'No match found..',
								value : ""
							} ];
							response($.map(rec, function(item) {
								return {
									label : item.label,
									value : item.value
								}
							}));

						}
						else {
							var record = data.d.preferences;
							response($.map(record, function(item) {
								return {
									label : item.CODE,
									value : item.CODE,
									record : item
								}
							}));

						}
						compareFlag = false;
						errorFlag = false;
					}
				});
			},
			minLength : 1,
			select : function(event, ui) {
				var rec = ui.item.record;
				$('#agreementDescription').removeClass("disabled");
				$('#agreementDescription').val(rec.DESCRIPTION);
				$('#agreementDescription').addClass("disabled");
				$('#attachAgreementAutoCompleter').val(rec.CODE);
				hybridAgreement = rec.CODE;
				hybridDescription = rec.DESCRIPTION;
				agreementId  = rec.RECKEY;
			},
			change : function(event, ui) {
				// resetFields('acctnmbr');
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul">' + item.label + '</ul></ol></a>'
			return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
		};*/
	});

};
function showPopup(frmId,record) {

	$('#' + frmId).dialog({
		resizable : false,
		modal : true,
		maxHeight : 500,
		width : 600,
		dialogClass : "hide-title-bar",
		// title : 'Payout Parameters',
		focus : function() {

		},
		close : function() {
		},
		open : function() {
			if(popUpMode === 'E')
				{
				$('#attachAgreementAutoCompleter').val(record.data.hybridAgreementCode);
				$('#agreementDescription').removeClass("disabled");
				$('#agreementDescription').val(record.data.hybridAgreementName);
				$('#agreementDescription').addClass("disabled");
				$('#priority').val(record.data.priority);
				$('#priorityRow').removeClass("hidden");
				$('#btnVAAdd').addClass("hidden");
				$('#btnVAUpdate').removeClass("hidden");
				identifier = record.data.identifier;
				}
			else if(popUpMode === 'V')
				{
				$('#attachAgreementAutoCompleterSpan').text(record.data.hybridAgreementCode);
				$('#agreementDescriptionSpan').text(record.data.hybridAgreementName);
				$('#prioritySpan').text(record.data.priority)
				}
		}
	});
	$('#' + frmId).dialog("open");
	$('#' + frmId).parent().appendTo($("#frmMain"));
	if(popUpMode !== 'A')
{
 hybridAgreement = record.data.hybridAgreementCode;
 hybridDescription =record.data.hybridAgreementName;
 priorityVal = record.data.priority;
 identifier = record.data.identifier;
}

}
function saveHybridDetailPopup()
{
	$('input').removeAttr('disabled');
	$(document).trigger("saveAction", true);
	if(errMsg !== "" && errMsg !== undefined)
	{
		$('<p>' +getLabel('','Agreement already exists') + '</p>').appendTo('#errorMessage');	
		$('#errorDiv1').removeClass("ui-helper-hidden");
		errorFlag = true;
		errMsg = '';
	}
	if(!errorFlag)
	$('#HybridDetailsPopup').dialog("close");
}
/*function updateHybridDetailPopup()
{
	$(document).trigger("updateAction", true);
	$('#HybridDetailsPopup').dialog("close");
}*/
function setVariables()
{
popUpMode = 'A';
$('#attachAgreementAutoCompleter').val('');
$('#agreementDescription').removeClass("disabled");
$('#agreementDescription').val('');
$('#agreementDescription').addClass("disabled");
$('#priority').val('');
hybridAgreement = '';
hybridDescription = '';
priorityVal = '';
$('#priorityRow').addClass("hidden");
$('#btnVAUpdate').addClass("hidden");
$('#btnVAAdd').removeClass("hidden");
errorFlag = false;
$("#errorMessage").html('');
$('#errorDiv1').addClass("ui-helper-hidden");
}
function updateDetails()
{
	
	var jsonObject = generateVAJSON(identifier, $("#viewState").val());
	$.ajax({
		url : 'services/updateHybridDtl',
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
					// doClearMessageSection();
					closeAddHybridDtlPopup('E');
					$(document).trigger("OnSaveRestoreGrid");
					//detailMode = null;
				}
				else
					if (objResponse.errors && objResponse.errors.length > 0) {
						var objErrors = objResponse.errors;
						doHandlePaintErrors(objErrors);
					}
			}
		}
	});

}
function generateVAJSON(strDetailIdentifier, strParentIdentifier) {
	var jsonObject = {};
	jsonObject['identifier'] = strParentIdentifier;
	jsonObject['detailIdentifier'] = strDetailIdentifier;
	
	jsonObject['agreementNumber'] = hybridAgreement ;
	jsonObject['agreementDescription'] = hybridDescription;
	jsonObject['priority'] = priorityVal;
	
	return jsonObject;
}

function doHandlePaintErrors(arrError) {
	var element = null, strErrorCode = '';
	if (arrError && arrError.length > 0) {
		$("#errorMessage").html('');
		$.each(arrError, function(index, error) {
			strErrorCode = error.errorCode || error.code;
			if (!isEmpty(strErrorCode)) {
				var msg = error.errorMessage;
				element = $('<p>').text(msg);
				element.appendTo($('#errorMessage'));
				$('#errorDiv1').removeClass('ui-helper-hidden');
			}
		});
		$(".ft-content-pane-scroll").animate({
			scrollTop : 0
		}, "slow");
	}
}

function checkValidations()
{
	$("#errorMessage").html('');
	$('#errorDiv1').addClass("ui-helper-hidden");
	if(recDetails !== undefined){
	if (recDetails.length > 0) {
		$.each(recDetails, function (i, item) {
									
		if($('#attachAgreementAutoCompleter').val() == item.CODE && $('#agreementDescription').val() == item.DESCRIPTION)
		{
				compareFlag = true;
				}
		
						});
	}
	if(compareFlag == false)
		{
		$('<p>' + getLabel('','Invalid Details') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
		}
	}
	if($('#attachAgreementAutoCompleter').val() === ""){
		$('<p>' +getLabel('','Agreement Code is required') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
	}	
	
	
	if(compareFlag = true)
		{
		$('#errorDiv1').addClass("ui-helper-hidden");
		}
	if(errorFlag == true){
		$('#errorDiv1').removeClass("ui-helper-hidden");
	}
}
function setValues()
{
	hybridAgreement = $('#attachAgreementAutoCompleter').val();
	 hybridDescription = $('#agreementDescription').val();
	 priorityVal = $('#priority').val();

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
function discardProfile(strUrl){
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	if(entityType=='1')
	{
		//$('#clientDesc').val(strClientDesc);	
	}	
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function gotoPage(strUrl) {
	var frm = document.forms['frmMain'];
	var viewState = document.getElementById( "viewState" ).value;
	strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="+ csrfTokenValue;
	frm.action = strUrl;
	$('input').removeAttr('disabled');
	$('select').removeAttr('disabled');

	frm.target = '';
	frm.method = 'POST';
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}