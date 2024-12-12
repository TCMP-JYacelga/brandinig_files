var recDetails;
function saveFlexibleDetail( strUrl )
{	
	var form;
	var viewState = document.getElementById( "viewState" ).value;
	strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="+ csrfTokenValue;
	form = document.createElement( 'FORM' );
	document.body.appendChild(form);
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.action = strUrl;
	$('input').removeAttr('disabled');
	form.submit();	
}

function setCponEnforcedPartOfHybrid()
{
	var strData = {};
	var strUrl = 'getFlexCponEnforcedHybridStrucType.srvc';
	
	strData[ '$viewState' ] = viewState;
	strData[ csrfTokenName ] = csrfTokenValue;

	$.ajax(
	{
		cache : false,
		data : strData,
		dataType : 'json',
		success : function( response )
		{
			loadPartOfHybrid( response.PART_OF_HYBRID );
		},
		error : ajaxError,
		url : strUrl,
		type : 'POST'
	} );

}

function loadPartOfHybrid( partOfHybridFlag )
{
	if( partOfHybridFlag == 'T' )
	{
		// Part of Hybrid checkbox will be visible only if HYBRID feature is enabled.
        $('#partOfHybridLblDiv').show();
        $('#partOfHybridChkBox').show();
	}
}

function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}
function saveRecord(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	$('input').removeAttr('disabled');
	frm.submit();	
}
function closeAddFlexibleDtlPopup(dtlMode) {
	
	if(dtlMode === 'A' || dtlMode === 'E' )
	{
		$('#FlexibleDetailsPopup').dialog("close");
	}
	else
	{
		$('#FlexibleDetailsPopupView').dialog("close");	
	}
	
}

jQuery.fn.agreementAutoComplete = function() {
	var stUrl = "";
	if(entityType == '0'){
		 stUrl = 'services/userseek/flexibleAccountCodeIdSeekAdmin.json';
	}
	else {
		 stUrl = 'services/userseek/flexibleAccountCodeIdSeekClient.json';
	}
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
						$filtercode1 : clientId,
						$filtercode2 : agreementCcy,
						$filtercode3 : sellerCode,
						$filtercode4 : USER,
						$filtercode5 : agreementId
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
				$('#accountDescription').removeClass("disabled");
				$('#accountDescription').val(rec.DESCRIPTION);
				$('#accountDescription').addClass("disabled");
				$('#attachAccountAutoCompleter').val(rec.CODE);
				acctCode = rec.CODE;
				acctId = rec.ACCTID;
				acctDesc = rec.DESCRIPTION;
				agreementId  = rec.RECKEY;
				ccyCode = rec.CCYCODE
			},
			change : function(event, ui) {
				
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
			$('#attachAccountAutoCompleter').val(record.data.fromAccNmbr);
			$('#accountDescription').removeClass("disabled");
			$('#accountDescription').val(record.data.fromAccDesc);
			$('#accountDescription').addClass("disabled");
			$('#priority').val(record.data.priority);
			$('#priorityRow').removeClass("hidden");
			$('#btnVAAdd').addClass("hidden");
			$('#btnVAUpdate').removeClass("hidden");
			identifier = record.data.identifier;
			}
		else if( popUpMode === 'V')
			{
			$('#attachAccountAutoCompleterSpan').text(record.data.fromAccNmbr);
			$('#accountDescriptionSpan').text(record.data.fromAccDesc);
			$('#prioritySpan').text(record.data.priority)
			}
	
		}
	});
	if(popUpMode !== 'A')
	{
		acctId = record.data.fromAccNmbr;
		acctDesc =record.data.fromAccDesc;
		priorityVal = record.data.priority;
	}
	$('#' + frmId).dialog("open");
	$('#' + frmId).parent().appendTo($("#frmMain"));

}
function saveFlexibleDetailPopup()
{
	$('input').removeAttr('disabled');
	$(document).trigger("saveAction", true);
	if(errMsg !== "" && errMsg !== undefined)
	{
		$('<p>' +getLabel('','Account already exists') + '</p>').appendTo('#errorMessage');	
		$('#errorDiv2').removeClass("ui-helper-hidden");
		errorFlag = true;
		errMsg = '';
	}
	if(!errorFlag)
	$('#FlexibleDetailsPopup').dialog("close");
}
function updateFlexibleDetailPopup()
{
	$(document).trigger("updateAction", true);
	$('#FlexibleDetailsPopup').dialog("close");
}
function setVariables()
{
popUpMode = 'A';
$('#attachAccountAutoCompleter').val('');
$('#accountDescription').removeClass("disabled");
$('#accountDescription').val('');
$('#accountDescription').addClass("disabled");
$('#priority').val('');
acctId = '';
acctDesc = '';
priorityVal = '';
$('#priorityRow').addClass("hidden");
$('#btnVAUpdate').addClass("hidden");
$('#btnVAAdd').removeClass("hidden");
errorFlag = false;
$("#errorMessage").html('');
$('#errorDiv2').addClass("ui-helper-hidden");
}

function checkValidations()
{
	$("#errorMessage").html('');
	$('#errorDiv2').addClass("ui-helper-hidden");
	if(recDetails !== undefined){
	if (recDetails.length > 0) {
		$.each(recDetails, function (i, item) {
									
		if($('#attachAccountAutoCompleter').val() == item.CODE && $('#accountDescription').val() == item.DESCRIPTION)
		{
				compareFlag = true;
				}
		
						});
	}
	if(compareFlag == false)
		{
		$('<p>' + getLabel('','Invalid Account Number') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
		}
	}
	if($('#attachAccountAutoCompleter').val() === ""){
		$('<p>' +getLabel('','Account Number is required') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
	}	
	
	if(compareFlag = true)
		{
		$('#errorDiv2').addClass("ui-helper-hidden");
		}
	if(errorFlag == true){
		$('#errorDiv2').removeClass("ui-helper-hidden");
	}
	
}
function setValues()
{
	acctCode = acctId;
	acctId = $('#attachAccountAutoCompleter').val();
	acctDesc = $('#accountDescription').val();
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