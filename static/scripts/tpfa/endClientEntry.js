jQuery.fn.AgentCodeAutoComplete= function(){
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				agentSeekUrl = 'agentCodeSeek';
			
				$.ajax({
					url: 'services/userseek/' + agentSeekUrl + '.json',
							type : 'POST',
							dataType : "json",
							data : {
								$autofilter : request.term
							},
				success : function(data) {
					var rec = data.d.preferences;
					
					response($.map(rec, function(item) {
								return {	
									
									label : item.DISPLAYFIELD,	
									agentDtl : item
								}
					}));
		}
	});
},
minLength : 1,
select : function(event, ui) {
	var data = ui.item.agentDtl;
	if (data) {
		if (!isEmpty(data.CODE))
		{
			$('#agentCode').val(data.CODE);
			$('#agentDesc').val(data.DESCR);
			setAccntDtls(data.CODE,null)
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
})/*.data("autocomplete")._renderItem = function(ul, item) {
var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
+ item.label + '</ul></ol></a>';
return $("<li></li>").data("item.autocomplete", item)
.append(inner_html).appendTo(ul);
};*/
});
};



function setEndClientCategory(comboval)
{
	$("#content3").addClass("hidden");
	$("#content4").addClass("hidden");
	$("#content5").addClass("hidden");
	$("#content6").addClass("hidden");
	$("#content7").addClass("hidden");
	$("#content9").addClass("hidden");
	if (comboval == "INDIVIDUAL")
		{
		$("#content3").removeClass("hidden");
		$("#content7").removeClass("hidden");
		}
	else if(comboval == "COMPANY")
		{
	$("#content4").removeClass("hidden");
	$("#content7").removeClass("hidden");
		}
	else if(comboval == "TRUST")
		{
		$("#content5").removeClass("hidden");
		$("#content7").removeClass("hidden");
		}
	else if(comboval == "PARTNERSHP")
		{
		$("#content6").removeClass("hidden");
		$("#content7").removeClass("hidden");
		}
	else if(comboval == "TPFA_ENDCLNTCAT5")
		{
		
		}
}

function saveProfile(strUrl)
{
	var frm = document.forms["formMain"];
	$(':input').removeAttr('disabled');
	frm.action = strUrl;	
	frm.method = "POST";
	$(':input').removeAttr('disabled');
	frm.submit();
}
function setAccntDtls(selectedAgentCode, accountId) {
	$.ajax({
		url : 'services/getSelectedAgentCode.json',
		type : 'POST',
		data : {
			selectedAgentCode : selectedAgentCode,
			pageMode : pageMode,
			accountId : selAccountId,
			viewState : $('#viewState').val()
		},
		success : function(response) {
			var data = response;
			accountData = data;
			var selectAccountId = $('#accountId');
			selectAccountId.find('option').remove().end().append(
					'<option value="">Select</option>').val('');
			var el = $('#accountId').select();
			if (null != data) {
				for (var index = 0; index < data.length; index++) {
					var $option = $('<option value="' + data[index].CODE + '">'
							+ data[index].DESCR + '</option>');
					selectAccountId.append($option);

				}
			}
			selectAccountId.val(accountId);
			selectAccountId.niceSelect('update');
			populateAccountData(accountId);
		},
		failure : function() {
		}

	});

}

function populateAccountData(accountId) {
	var detailsFound = false;
	if (accountData != null) {
		for (var index = 0; index < accountData.length; index++) {
			if (accountData[index].CODE === accountId) {
				$('#accountName').val(accountData[index].accountname);
				$('#accountType').val(accountData[index].account_type_desc);
				$('#bank').val(accountData[index].bankdescription);
				$('#bankBranch').val(accountData[index].branchdescription);
				detailsFound = true;
			}
		}
		if(!detailsFound){
			$('#accountName').val("");
			$('#accountType').val("");
			$('#bank').val("");
			$('#bankBranch').val("");
		}
	}
}

function populateClientData(accountId) {
	if (accountId != null) {

		var selectedAccount = $('#accountId').find(":selected");

		$('#accountName').val(selectedAccount.attr('accountname'));
		$('#accountType').val(selectedAccount.attr('account_type_desc'));
		$('#bank').val(selectedAccount.attr('bankdescription'));
		$('#bankBranch').val(selectedAccount.attr('branchdescription'));

	}

}
function setConditionalFields(clientCat)
{
if(clientCat == "INDIVIDUAL")
{
	$('#vatRadioBtnY').attr('disabled',true);
	$('#vatRadioBtnN').attr('disabled',true);
	$('#VATRegisteredNo').attr('disabled',true);
}
if(clientCat == "PARTNERSHP" || clientCat == "TRUST" )
	{
	$('#countryOfIncorporation').attr('disabled',true);
	$('#birthCountryLbl').removeClass('required');
	}
if(clientCat != "COMPANY" &&  clientCat != "TRUST")
	{
	$('#countryOfEffectiveManagement').attr('disabled',true);
	$('#effectiveCountryLbl').removeClass('required');
	$('#countryOfEffectiveManagement').niceSelect('update');
	$('#countryOfPrincipalOffice').attr('disabled',true);
	$('#principalCountryLbl').removeClass('required');
	$('#countryOfPrincipalOffice').niceSelect('update');
	$('#globalIntermediaryIdNumber').attr('disabled',true);
	}
if(clientCat == "INDIVIDUAL" ||  clientCat == "PARTNERSHP")
	{
	$('#question1Y').attr('disabled',true);
	$('#question1N').attr('disabled',true);
	$('#question2Y').attr('disabled',true);
	$('#question2N').attr('disabled',true);
	$('#question3Y').attr('disabled',true);
	$('#question3N').attr('disabled',true);
	$('#question4Y').attr('disabled',true);
	$('#question4N').attr('disabled',true);
	}
if(clientCat != "INDIVIDUAL")
	{
	$('#townOfBirth').attr('disabled',true);
	$('#townOfBirthId').removeClass('required');
	}
	if(clientCat == "COMPANY" && entitySubTypeValue != '')
	{
	$('#entitySubType').attr('disabled',true);
	$('#entitySubType').niceSelect('update');
	}
if(clientCat == "TRUST")
$('#globalIntermediaryIdNumberLbl').addClass("required");

}

function toggleTaxDetails(value)
{
	if(value == 'Y')
	{
	$('#countryOfTaxResidenceLbl').addClass('required');
	$('#taxIdentificationNoLbl').addClass('required');
	$('#citizenshipCountryLbl').addClass('required');
	$('#taxRegY').prop('checked',true);
	}
	else
		{
		$('#countryOfTaxResidenceLbl').removeClass('required');
		$('#taxIdentificationNoLbl').removeClass('required');
		$('#citizenshipCountryLbl').removeClass('required');
		$('#taxRegN').prop('checked',true);
		}
}

function setPPDetails(value)
{
	if(value == 'Y')
	{
	$('#PPDiv').addClass('hidden');
	$('#SAIdDiv').removeClass('hidden');
	}
	else
	{
		$('#SAIdDiv').addClass('hidden');
		$('#PPDiv').removeClass('hidden');	
	}
}
function toggleVATNo(value)
{
	if (value == 'Y')
		$('#VATRegisteredNoLbl').addClass('required');
	else
		$('#VATRegisteredNoLbl').removeClass('required');
}

function setActDetails(value)
{
 if(value == '13')
	 {
	 $('#specifyAct').removeAttr('disabled');
	 $('#specifyActLbl').addClass('required');
	 }
 else
	 {
	 $('#specifyAct').val("");
	 $('#specifyAct').attr('disabled',true);
	 $('#specifyActLbl').removeClass('required');
	 }

  if(value == '16' && autoFidilityFlag == 'Y')
	 {
	 $('#autofidilityRadioY').removeAttr('disabled');
	 $('#autofidilityRadioN').removeAttr('disabled');
	 }
	 else
		 {
		 $('#autofidilityRadioY').attr('disabled',true);
		 $('#autofidilityRadioN').attr('disabled',true);
		 $('#autofidilityRadioN').prop('checked',true);
		}
  if(autoFidilityFlag == 'N')
	  {
	  $('#autofidilityDiv').addClass("hidden");
	  }

}

function goToPage(strUrl)
{
	var frm = document.forms["formMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.appendChild(createFormField('INPUT', 'HIDDEN',
				csrfTokenName, csrfTokenValue));
	$(':input').removeAttr('disabled');
	frm.submit();
}

function showEndClientDetailPopup(record,mode){
var dataToPopulate=[];
	clearErrorMsgArea();		
	$('#endClientDetails').dialog({
		autoOpen : false,
		modal : true,
		maxHeight : 580,
		minHeight : (screen.width) > 1024 ? 156 : 0,
		width : 840,
		dialogClass : 'ft-dialog',
		resizable : false,
		draggable : false,
		open : function(event, ui) {
			$("#birthDatePopup").datepicker({
				dateFormat :jqueryDateFormat,
				changeMonth : true,
				changeYear : true,
				maxDate : dtApplicationDate,
				yearRange: 'c-100:c+10'
			});
			$('#relatedPersonType').focus();
			$('#countryOfBirthPopup').val("");
			$('#firstNamePopup').val("");
			$('#surNamePopup').val("");
			$('#surNamePopup').val("");
			$('#SAIdPopup').val("");
			$('#PPNoPopup').val("");
			$('#emailPopup').val("");
			$('#telephonePopup').val("");
			$('#taxIdentificationNoPopup').val("");
			$('#taxIdentificationNo1Popup').val("");
			$('#taxIdentificationNo2Popup').val("");
			$('#taxIdentificationNo3Popup').val("");
			$('#taxIdentificationNo4Popup').val("");
			$('#taxRegisteredFlagPopup').val("");
			$('#birthDatePopup').val("");
			$('#initialsPopup').val("");
			$('#telephoneCountryCodePopup option:eq(0)').attr('selected','selected');
			$('#telephoneCountryCodePopup').niceSelect('update');
			$('#city_townOfBirthPopup').val("");
			$('#relatedPersonType option:eq(0)').attr('selected','selected');
			$('#relatedPersonType').niceSelect('update');
			$('#countryOfBirthPopup option:eq(0)').attr('selected','selected');
			$('#countryOfBirthPopup').niceSelect('update');
			$('#countryOfCitizenshipPopup option:eq(0)').attr('selected','selected');
			$('#countryOfCitizenshipPopup').niceSelect('update');
			$('#countryOfTaxResidencePopup option:eq(0)').attr('selected','selected');
			$('#countryOfTaxResidencePopup').niceSelect('update');
			$('#countryOfCitizenship1Popup option:eq(0)').attr('selected','selected');
			$('#countryOfCitizenship1Popup').niceSelect('update');
			$('#countryOfTaxResidence1Popup option:eq(0)').attr('selected','selected');
			$('#countryOfTaxResidence1Popup').niceSelect('update');
			$('#countryOfCitizenship2Popup option:eq(0)').attr('selected','selected');
			$('#countryOfCitizenship2Popup').niceSelect('update');
			$('#countryOfTaxResidence2Popup option:eq(0)').attr('selected','selected');
			$('#countryOfTaxResidence2Popup').niceSelect('update');
			$('#countryOfCitizenship3Popup option:eq(0)').attr('selected','selected');
			$('#countryOfCitizenship3Popup').niceSelect('update');
			$('#countryOfTaxResidence3Popup option:eq(0)').attr('selected','selected');
			$('#countryOfTaxResidence3Popup').niceSelect('update');
			$('#countryOfCitizenship4Popup option:eq(0)').attr('selected','selected');
			$('#countryOfCitizenship4Popup').niceSelect('update');
			$('#countryOfTaxResidence4Popup option:eq(0)').attr('selected','selected');
			$('#countryOfTaxResidence4Popup').niceSelect('update');
			$("#SA_Y_Flag").attr('checked', 'checked');
			$("#taxRegisteredFlagY").attr('checked', 'checked');
			$('#relCityOfBirthLbl').removeClass('required');
			$('#relCountryOfBirthLbl').removeClass('required');
			$('#relCitizenshipCountryLbl').addClass('required');
			$('#relCountryOfTaxResidenceLbl').addClass('required');
			$('#relTaxIdentificationNoLbl').addClass('required');
			setPPDetailsForPopup('Y');
			var selectedEntitySubtype = $('#entitySubType :selected').val();
			if (selEndClientCat === 'COMPANY')
				getRelatedPersonTypeList(selectedEntitySubtype);
			if(record)
			{
				dataToPopulate=record.data;
				populateEditPopupData(dataToPopulate);
			}
		}
		});
		detailMode = mode;
	if(detailMode === "ADD")
	{
		$('#btnEndClientDetailAdd').text("Save");
	}
	else if(detailMode === "EDIT")
	{
		$('#btnEndClientDetailAdd').text("Update");
	}
	else //View mode
	{
		$("#endClientDetailInfo :input").attr('disabled','disabled');
		$("#endClientDetailInfo .input-group-addon").addClass('disabled');
		$("#endClientAdditionalInfo :input").attr('disabled','disabled');
		$("#btnEndClientDetailAdd").hide();
	}
	if(detailMode === "ADD" || detailMode === "EDIT")
	{
		$("#endClientDetailInfo :input").attr('disabled',false);
		$("#endClientDetailInfo .input-group-addon").removeClass('disabled');
		$("#endClientAdditionalInfo :input").attr('disabled',false);
		$("#btnEndClientDetailAdd").show();
	}
	$('#messageContentDiv').addClass('hidden');
	$('#endClientDetails').dialog("open");
	$('#endClientDetails').dialog("option","position","center");
}

function deletePersonDetails()
{
	$(document).trigger("OnDeleteMultipleRow");
}
function populateEditPopupData(dataToPopulate){
	$("#countryOfBirthPopup option[value='"+ dataToPopulate.CountryOfBirth +"']").attr("selected", "selected");
	$('#countryOfBirthPopup').niceSelect('update');
	$("#countryOfCitizenshipPopup option[value='"+ dataToPopulate.CountryOfCitizenship +"']").attr("selected", "selected");
	$('#countryOfCitizenshipPopup').niceSelect('update');
	$("#countryOfTaxResidencePopup option[value='"+ dataToPopulate.CountryOfTaxResidence +"']").attr("selected", "selected");
	$('#countryOfTaxResidencePopup').niceSelect('update');
	$("#countryOfCitizenship1Popup option[value='"+ dataToPopulate.IndCountryOfCitizenship1 +"']").attr("selected", "selected");
	$('#countryOfCitizenship1Popup').niceSelect('update');
	$("#countryOfCitizenship2Popup option[value='"+ dataToPopulate.IndCountryOfCitizenship2 +"']").attr("selected", "selected");
	$('#countryOfCitizenship2Popup').niceSelect('update');
	$("#countryOfCitizenship3Popup option[value='"+ dataToPopulate.IndCountryOfCitizenship3 +"']").attr("selected", "selected");
	$('#countryOfCitizenship3Popup').niceSelect('update');
	$("#countryOfCitizenship4Popup option[value='"+ dataToPopulate.IndCountryOfCitizenship4 +"']").attr("selected", "selected");
	$('#countryOfCitizenship4Popup').niceSelect('update');
	$("#countryOfTaxResidence1Popup option[value='"+ dataToPopulate.IndCountryOfTaxResidence1 +"']").attr("selected", "selected");
	$('#countryOfTaxResidence1Popup').niceSelect('update');
	$("#countryOfTaxResidence2Popup option[value='"+ dataToPopulate.IndCountryOfTaxResidence2 +"']").attr("selected", "selected");
	$('#countryOfTaxResidence2Popup').niceSelect('update');
	$("#countryOfTaxResidence3Popup option[value='"+ dataToPopulate.IndCountryOfTaxResidence3 +"']").attr("selected", "selected");
	$('#countryOfTaxResidence3Popup').niceSelect('update');
	$("#countryOfTaxResidence4Popup option[value='"+ dataToPopulate.IndCountryOfTaxResidence4 +"']").attr("selected", "selected");
	$('#countryOfTaxResidence4Popup').niceSelect('update');
	$("#relatedPersonType option[value='"+ dataToPopulate.RelatedPersonType +"']").attr("selected", "selected");
	$('#relatedPersonType').niceSelect('update');
	$("#telephoneCountryCodePopup option[value='"+ dataToPopulate.TelCountryCode +"']").attr("selected", "selected");
	$('#telephoneCountryCodePopup').niceSelect('update');

	 $("#birthDatePopup").val(dataToPopulate.DateOfBirth);
	if(dataToPopulate.ResidentFlag === "Y")
	{
		$("#SA_Y_Flag").attr('checked', 'checked');
		$('#SAIdDivPopup').addClass('required');
		$('#PPDivPopup').removeClass('required');
		$('#relCityOfBirthLbl').removeClass('required');
		$('#relCountryOfBirthLbl').removeClass('required');
		$('#SAIdDivPopup').removeClass('hidden');
		$('#PPDivPopup').addClass('hidden');
		$('#relCitizenshipCountryLbl').removeClass('required');
	}
	else
	{
		$("#SA_N_Flag").attr('checked', 'checked');
		$('#SAIdDivPopup').removeClass('required');
		$('#PPDivPopup').addClass('required');
		$('#relCityOfBirthLbl').addClass('required');
		$('#relCountryOfBirthLbl').addClass('required');
		$('#SAIdDivPopup').addClass('hidden');
		$('#PPDivPopup').removeClass('hidden');
	}
	 if(dataToPopulate.TaxRegisteredFlag === "Y")
	{
		$("#taxRegisteredFlagY").attr('checked', 'checked');
		$('#relCountryOfTaxResidenceLbl').addClass('required');
		$('#relTaxIdentificationNoLbl').addClass('required');
		$('#relCitizenshipCountryLbl').addClass('required');
	}
	else
	{
		$("#taxRegisteredFlagN").attr('checked', 'checked');
		if(dataToPopulate.ResidentFlag === "Y")
		$('#relCitizenshipCountryLbl').removeClass('required');
		$('#relCountryOfTaxResidenceLbl').removeClass('required');
		$('#relTaxIdentificationNoLbl').removeClass('required');
	}
	 $("#emailPopup").val(dataToPopulate.Email);  
	 $("#firstNamePopup").val(dataToPopulate.FirstName);
	 $("#surNamePopup").val(dataToPopulate.LastName);
	 $('#initialsPopup').val(dataToPopulate.Initials);
	 $("#PPNoPopup").val(dataToPopulate.PassportNumber);
	 $("#SAIdPopup").val(dataToPopulate.ResidentId);
	 $("#city_townOfBirthPopup").val(dataToPopulate.CityOfBirth);
	 $("#taxIdentificationNoPopup").val(dataToPopulate.TIN);
	 $("#taxIdentificationNo1Popup").val(dataToPopulate.IndTIN1);
	 $("#taxIdentificationNo2Popup").val(dataToPopulate.IndTIN2);
	 $("#taxIdentificationNo3Popup").val(dataToPopulate.IndTIN3);
	 $("#taxIdentificationNo4Popup").val(dataToPopulate.IndTIN4);
	 $("#telephonePopup").val(dataToPopulate.Telephone);
	 $("#detailViewState").val(dataToPopulate.viewState);
	}
function setDirtyBit()
{
	dirtyBitSet = true;
}

function getCancelConfirmPopUp(strUrl) {
	if(dirtyBitSet)
	{
	$('#confirmMsgPopup').dialog({
				autoOpen : false,
				width : 430,
				modal : true,
				draggable: false,
				 resizable: false
			});
	$('#confirmMsgPopup').dialog("open");
	$('#cancelConfirmMsg').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
	});

	$('#doneConfirmMsgbutton').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
		goToPage(strUrl);
	});
	}
	else
	{
		goToPage(strUrl);
	}
}


function getCancelConfirmPopUp(strUrl) {
	if(dirtyBitSet)
	{
	$('#confirmMsgPopup').dialog({
				autoOpen : false,
				width : 430,
				modal : true,
				draggable: false,
				 resizable: false
			});
	$('#confirmMsgPopup').dialog("open");
	$('#cancelConfirmMsg').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
	});

	$('#doneConfirmMsgbutton').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
		goToPage(strUrl);
	});
	}
	else
	{
		goToPage(strUrl);
	}
}

function saveRelatedPersonDetails() {	
	var hasError = false;
	if(detailMode === 'ADD'){
	hasError = validateRelatedPersonResidentId();
	if(hasError){
		return;
	}
	else {
		postRelatedPersonDetailsData('services/saveEndClientEntryDetail.srvc', 'frmMain', null,$("#viewState").val());
	}
	}
	else if(detailMode === 'EDIT'){
		hasError = validateRelatedPersonResidentId();
		if(hasError){
			return;
		}
		else{
		postRelatedPersonDetailsData('services/updateEndClientEntryDetail.srvc', 'frmMain',  $("#detailViewState").val(),$("#viewState").val());
		}
	}
}

function postRelatedPersonDetailsData(strUrl, frmId, strDetailIdentifier,strParentIdentifier) {
	var jsonObject = generateRelatedPersonDetailsJSON(strDetailIdentifier,strParentIdentifier);
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
				//	doClearMessageSection();
					closeRelatedPersonDetailsPopup();
					$(document).trigger("OnSaveRestoreGrid");
						detailMode = null;
				} else if (objResponse.errors && objResponse.errors.length > 0) {
					var objErrors = objResponse.errors;
					doHandlePaintErrors(objErrors);
				}
			}
		}
	});
}

function generateRelatedPersonDetailsJSON(strDetailIdentifier,strParentIdentifier) {
	var jsonObject = {};
	jsonObject['identifier'] = strParentIdentifier;
	jsonObject['detailIdentifier'] = strDetailIdentifier;
	jsonObject['CountryOfBirth'] = $('#countryOfBirthPopup').val();
	jsonObject['FirstName'] = $('#firstNamePopup').val();
	jsonObject['LastName'] = $('#surNamePopup').val();
	jsonObject['ResidentId'] = $('#SAIdPopup').val();
	jsonObject['PassportNumber'] = $('#PPNoPopup').val();
	jsonObject['Email'] = $('#emailPopup').val();
	jsonObject['Telephone'] = $('#telephonePopup').val();
	jsonObject['TelCountryCode'] = $('#telephoneCountryCodePopup').val();
	jsonObject['CountryOfTaxResidence'] = $('#countryOfTaxResidencePopup').val();
	jsonObject['CountryOfCitizenship'] = $('#countryOfCitizenshipPopup').val();
	jsonObject['CityOfBirth'] = $('#city_townOfBirthPopup').val();
	jsonObject['TIN'] = $('#taxIdentificationNoPopup').val();
	jsonObject['IndCountryOfCitizenship1'] = $('#countryOfCitizenship1Popup').val();
	jsonObject['IndCountryOfTaxResidence1'] = $('#countryOfTaxResidence1Popup').val();
	jsonObject['IndTIN1'] = $('#taxIdentificationNo1Popup').val();
	jsonObject['IndCountryOfCitizenship2'] = $('#countryOfCitizenship2Popup').val();
	jsonObject['IndCountryOfTaxResidence2'] = $('#countryOfTaxResidence2Popup').val();
	jsonObject['IndTIN2'] = $('#taxIdentificationNo2Popup').val();
	jsonObject['IndCountryOfCitizenship3'] = $('#countryOfCitizenship3Popup').val();
	jsonObject['IndCountryOfTaxResidence3'] = $('#countryOfTaxResidence3Popup').val();
	jsonObject['IndTIN3'] = $('#taxIdentificationNo3Popup').val();
	jsonObject['IndCountryOfCitizenship4'] = $('#countryOfCitizenship4Popup').val();
	jsonObject['IndCountryOfTaxResidence4'] = $('#countryOfTaxResidence4Popup').val();
	jsonObject['IndTIN4'] = $('#taxIdentificationNo4Popup').val();
	jsonObject['DateOfBirth'] = $('#birthDatePopup').val();
	jsonObject['CountryOfBirth'] = $('#countryOfBirthPopup').val();
	jsonObject['Initials'] = $('#initialsPopup').val();
	if($("#SA_Y_Flag").is(':checked'))
	{
		jsonObject['ResidentFlag'] ="Y";
	}
	else
	{
		jsonObject['ResidentFlag'] ="N";
	}
	
	if($("#taxRegisteredFlagY").is(':checked'))
	{
		jsonObject['TaxRegisteredFlag'] ="Y";
	}
	else
	{
		jsonObject['TaxRegisteredFlag'] ="N";
	}
	jsonObject['RelatedPersonType'] = $('#relatedPersonType').val();
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
						$('#' + strTargetDivId + ', #messageContentDiv')
								.removeClass('hidden');
					}
				});
	  $(".ft-content-pane-scroll").animate({ scrollTop: 0 }, "slow");
	}
}

function populateProvinceList(selectedCountry,provinceId) {
	$.ajax({
		url : 'services/getSelectedCountry.json',
		type : 'POST',
		data : {
			selectedCountry : selectedCountry
		},
		success : function(response) {
			var data = response;
			provinceData = data;
			var selectProvinceId = $("#"+provinceId);
			selectProvinceId.find('option').remove().end().append(
					'<option value="">Select</option>').val('');
			var el = $("#"+provinceId).select();
			if (null != data) {
				for (var index = 0; index < data.length; index++) {
					var $option = $('<option value="' + data[index].CODE + '">'
							+ data[index].DESCR + '</option>');
					selectProvinceId.append($option);

				}
			}
			selectProvinceId.niceSelect('update');
			setProvinceValue(provinceVal1,provinceVal2,provinceId);
		},
		failure : function() {	
		}

	});
	

}
function clearProvinceValue()
{
	$("#province1").val("");
	$("#province2").val("");
}
function setProvinceValue(provinceVal1,provinceVal2,provinceId)
{
	if(provinceId == 'province1')
	$("#province1").val(provinceVal1);
	if(provinceId == 'province2')
	$("#province2").val(provinceVal2);
	$("#province1").niceSelect('update');
	$("#province2").niceSelect('update');
}
function PopulateTelephoneCountryCode()
{
	$.ajax({
		url : 'services/getTelephoneCode.json',
		type : 'POST',
		success : function(response) {
			var data = response;
			accountData = data;
			var telephoneCode = $('#telephoneCountryCode');
			telephoneCode.find('option').remove().end().append(
					'<option value="">Select</option>').val('');
			var el = $('#telephoneCountryCode').select();
			if (null != data) {
				for (var index = 0; index < data.length; index++) {
					var $option = $('<option value="' + data[index].CODE + '">'
							+ data[index].DISPLAYFIELD + '</option>');
					telephoneCode.append($option);

				}
			}
			telephoneCode.niceSelect('update');
			setTelephoneCountryCode(telephoneCntryCode);
			
		},
		complete:function(){
		
		},
		failure : function() {	
		}

	});
}
function setTelephoneCountryCode(value)
{
 $('#telephoneCountryCode').val(value);
 $('#telephoneCountryCode').niceSelect('update');
}

function toggleCheckSetSameAdd(imgElement){
	if(imgElement.src.indexOf("checkbox.png")>-1){
		imgElement.src="static/styles/Themes/t7-SBSA/resources/images/T7/checked.png"
		$('[name="postAddLine1"]').val($('[name="regAddLine1"]').val()); 		
		$('[name="postAddCountry"]').val($('[name="regAddCountry"]').val()); 
		$('[name="postAddCountry"]').niceSelect('update');
		provinceVal2 = $('[name="regAddState"]').val();
		populateProvinceList($('[name="postAddCountry"]').val(),'province2');
		$('[name="postAddState"]').val($('[name="regAddState"]').val());
		$('[name="postAddState"]').niceSelect('update');
		$('[name="postAddLine2"]').val($('[name="regAddLine2"]').val()); 		
		$('[name="postAddZip"]').val($('[name="regAddZip"]').val()); 		
		$('[name="postAddLine3"]').val($('[name="regAddLine3"]').val()); 		
		$('[name="postAddLine4"]').val($('[name="regAddLine4"]').val()); 		
	}
	else{
		imgElement.src="static/styles/Themes/t7-SBSA/resources/images/T7/checkbox.png"	
		$('[name="postAddLine1"]').val(""); 		
		$('[name="postAddCountry"]').val(""); 
		$('[name="postAddCountry"]').niceSelect('update');
		$('[name="postAddState"]').val(""); 
		$('[name="postAddState"]').niceSelect('update');
		$('[name="postAddLine2"]').val(""); 		
		$('[name="postAddZip"]').val(""); 		
		$('[name="postAddLine3"]').val(""); 		
		$('[name="postAddLine4"]').val(""); 		
	}
}

function closeRelatedPersonDetailsPopup(){
	if(!(pageMode === 'VIEW' || pageMode === 'VERIFY'))
	{
	$('#messageContentDiv').addClass('hidden');
	$('#endClientDetails').dialog("close");
	$('#addEndClientDetails').get(0).focus();
	}
	else{
	$('#messageContentDiv').addClass('hidden');
	$('#endClientDetailsView').dialog("close");
	}
}

function closeViewRelatedPersonDetailsPopup() {	
	
	$('#messageContentDiv').addClass('hidden');
	$('#endClientDetailsView').dialog("close");
	
}

function getFormatedDate(date){
	if(date)
	{
		var initialDateArray = date.split('/');
		var newDate = initialDateArray[2] + '-' + initialDateArray[0] + '-' + initialDateArray[1];
		return newDate;
	}else{
		return "";
	}
}

function setFormatedDate(date){
	if(date)
	{
		var initialDateArray = date.split('-');
		var newDate =initialDateArray[1] + '/' + initialDateArray[2] + '/' +initialDateArray[0];
		return newDate;
	}else{
		return "";
	}
}

function PopulateTelephoneCountryCodeForPopup()
{
	$.ajax({
		url : 'services/getTelephoneCode.json',
		type : 'POST',
		success : function(response) {
			var data = response;
			accountData = data;
			var telephoneCode = $('#telephoneCountryCodePopup');
			telephoneCode.find('option').remove().end().append(
					'<option value="">Select</option>').val('');
			var el = $('#telephoneCountryCodePopup').select();
			if (null != data) {
				for (var index = 0; index < data.length; index++) {
					var $option = $('<option value="' + data[index].CODE + '">'
							+ data[index].DISPLAYFIELD + '</option>');
					telephoneCode.append($option);
				}
			}
			telephoneCode.niceSelect('update');
		},
		complete:function(){
		
		},
		failure : function() {	
		}

	});
}

function setPPDetailsForPopup(value)
{
	if(value == 'Y')
	{
	$('#PPDivPopup').addClass('hidden');
	$('#SAIdDivPopup').removeClass('hidden');
	}
	else
	{
		$('#SAIdDivPopup').addClass('hidden');
		$('#PPDivPopup').removeClass('hidden');	
	}
}

function relatedToggleTaxDetails(value)
{
	if(value == 'Y')
	{
	$('#relCountryOfTaxResidenceLbl').addClass('required');
	$('#relTaxIdentificationNoLbl').addClass('required');
	$('#relCitizenshipCountryLbl').addClass('required');
	$('#taxRegisteredFlagY').prop('checked',true);
	}
	else
		{
		$('#relCountryOfTaxResidenceLbl').removeClass('required');
		$('#relTaxIdentificationNoLbl').removeClass('required');
		if($("#SA_Y_Flag").is(':checked'))
		$('#relCitizenshipCountryLbl').removeClass('required');
		$('#taxRegisteredFlagN').prop('checked',true);
		}
}

function toggleSAResident(value)
{
	if (value == 'N')
	{
		$('#relCityOfBirthLbl').addClass('required');
		$('#relCountryOfBirthLbl').addClass('required');
		$('#relCitizenshipCountryLbl').addClass('required');
	}
	else
	{
		$('#relCityOfBirthLbl').removeClass('required');
		$('#relCountryOfBirthLbl').removeClass('required');
		if($("#taxRegisteredFlagN").is(':checked'))
		$('#relCitizenshipCountryLbl').removeClass('required');
	}
}

function clearErrorMsgArea(){
	$('#messageArea >  p').empty();
	$('#messageContentDiv').addClass('hidden');
}

function onNextClick(updateUrl, nextUrl){
	if(dirtyBitSet)
		saveProfile(updateUrl);
	else
		saveProfile(nextUrl);			
}

function showEndClientDetailViewPopup(record) {
var dataToPopulate=[];
dataToPopulate = record.data;
	clearErrorMsgArea();	
	$('#endClientDetailsView').dialog({
		autoOpen : false,
		modal : true,
		maxHeight : 580,
		minHeight : (screen.width) > 1024 ? 156 : 0,
		width : 840,
		dialogClass : 'ft-dialog',
		resizable : false,
		draggable : false,
		open : function(event, ui) {
		$(".ft-content-pane-scroll").animate({ scrollTop: 0 }, 0);
		$("#endClientDetailInfo :input").val('');
		$("#endClientDetailInfo :radio").attr('checked',false)
		$("#endClientAdditionalInfo :input").val('');
		$("#SAIdDivPopup").addClass("hidden");
		$("#PPNoPopup").addClass("hidden");
		setRelatedPersonType(dataToPopulate.RelatedPersonType);
		$('#initialsRelPerson').text(dataToPopulate.Initials);
		$('#firstNameRelPerson').text(dataToPopulate.FirstName);
		$('#surNameRelPerson').text(dataToPopulate.LastName);
		$('#birthDateRelPerson').text(dataToPopulate.DateOfBirth);
		$('#SAIdRelPerson').text(dataToPopulate.ResidentId);
		$('#PPNoRelPerson').text(dataToPopulate.PassportNumber);
		$('#telephoneCountryCodeRelPerson').text(getCountryDescription(dataToPopulate.TelCountryCode));
		$('#telephoneRelPerson').text(dataToPopulate.Telephone);
		$('#emailRelPerson').text(dataToPopulate.Email);
		$('#cityOfBirthRelPerson').text(dataToPopulate.CityOfBirth);
		$('#countryOfBirthRelPerson').text(getCountryDescription(dataToPopulate.CountryOfBirth));
		$('#countryOfCitizenshipRelPerson').text(getCountryDescription(dataToPopulate.CountryOfCitizenship));
		$('#countryOfTaxResidenceRelPerson').text(getCountryDescription(dataToPopulate.CountryOfTaxResidence));
		$('#taxIdentificationNoRelPerson').text(dataToPopulate.TIN);
		$('#countryOfTaxResidenceRelPerson1').text(getCountryDescription(dataToPopulate.IndCountryOfTaxResidence1));
		$('#countryOfTaxResidenceRelPerson2').text(getCountryDescription(dataToPopulate.IndCountryOfTaxResidence2));
		$('#countryOfTaxResidenceRelPerson3').text(getCountryDescription(dataToPopulate.IndCountryOfTaxResidence3));
		$('#countryOfTaxResidenceRelPerson4').text(getCountryDescription(dataToPopulate.IndCountryOfTaxResidence4));
		
		$('#countryOfCitizenshipRelPerson1').text(getCountryDescription(dataToPopulate.IndCountryOfCitizenship1));
		$('#countryOfCitizenshipRelPerson2').text(getCountryDescription(dataToPopulate.IndCountryOfCitizenship2));
		$('#countryOfCitizenshipRelPerson3').text(getCountryDescription(dataToPopulate.IndCountryOfCitizenship3));
		$('#countryOfCitizenshipRelPerson4').text(getCountryDescription(dataToPopulate.IndCountryOfCitizenship4));
		
		$('#taxIdentificationNoRelPerson1').text(dataToPopulate.IndTIN1);
		$('#taxIdentificationNoRelPerson2').text(dataToPopulate.IndTIN2);
		$('#taxIdentificationNoRelPerson3').text(dataToPopulate.IndTIN3);
		$('#taxIdentificationNoRelPerson4').text(dataToPopulate.IndTIN4);
		$('#residentFlag').text(dataToPopulate.ResidentFlag);
		if(dataToPopulate.TaxRegisteredFlag === "Y")
		$('#texRegFlag').text("Yes");
		else
		$('#texRegFlag').text("No");
		if(dataToPopulate.ResidentFlag === "Y")
		{
			$("#SAIdDivPopup").removeClass("hidden");
			$('#residentFlag').text("Yes");
		}else
		{
			$("#PPNoPopup").removeClass("hidden");
			$('#residentFlag').text("No");
		}relPersonRecord = dataToPopulate;
		}
		});
	$('#messageContentDiv').addClass('hidden');
	$('#endClientDetailsView').dialog("open");
	$('#endClientDetailsView').dialog("option","position","center");
}

function submitEndClient(strUrl) {
	
	var arrayJson = [{
		serialNo : 1,
		recordDesc : $('#viewState').val(),
		identifier : identifier,
		userMessage : ''
	}];
	
	Ext.Ajax.request({
		url : strUrl,
		type : 'POST',
		contentType : "application/json",
		jsonData : Ext.encode(arrayJson),
		success : function(response) {
			var errorMessage = '';
			if (response.responseText != '[]') {
				var jsonData = Ext
						.decode(response.responseText);
				jsonData = jsonData.d ? jsonData.d : jsonData;	
				var isSuccess = jsonData[0].success;
				var msg="";
				var result = jsonData[0];
				if(isSuccess == 'N')
				{
					Ext.each(result.errors, function(error) {
						msg = msg + error.errorMessage;
						errCode = error.code;
					});
					var arrActionMsg = [];
					 arrActionMsg.push({
						success : result.success,
						actualSerailNo : result.serialNo,
						actionTaken : 'Y',
						actionMessage : msg
					});
				 getRecentActionResult(arrActionMsg);
				}
				else{
					goToPage('endClientList.srvc');
				}
			}
			}
	});
}

//confirmation pop up on discard
function getDiscardConfirmationPopup(strUrl) {
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
						var arrayJson = [{
							serialNo : 1,
							recordDesc : $('#viewState').val(),
							identifier : identifier,
							userMessage : ''
						}];
						Ext.Ajax.request({
								url : strUrl,
								type : 'POST',
								contentType : "application/json",
								jsonData : Ext.encode(arrayJson),
								success :function(data){
									goToPage('endClientList.srvc');
								},
								error : function(data){
									console.log("error in discarding data");
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
		html : record[i].actionMessage
		}));
		//add row to main div
		$(rowDiv).appendTo('#actionResultInfoDiv');
	}
}

function expandAll()
{
	$('#panelBodyId5, #panelBodyId7,#panelBodyConfigFee, #panelBodyRelPerson,#panelBodyDocView, #panelBodyId3, #panelBodyId6 ,#panelBodyId4').removeAttr("style");
	$('#panelBodyId5, #panelBodyId7,#panelBodyConfigFee, #panelBodyRelPerson,#panelBodyDocView, #panelBodyId3, #panelBodyId6 ,#panelBodyId4').removeClass("ui-helper-hidden ");
	$("#trustCaret, #regulatoryDetailsCaret, #relatedPersonCaret,#configFeeCaret, #docViewCaret, #partnershipCaret, #individualCaret, #corporationCaret").removeClass("fa-caret-down");
	$("#trustCaret, #regulatoryDetailsCaret, #relatedPersonCaret,#configFeeCaret, #docViewCaret, #partnershipCaret, #individualCaret, #corporationCaret").addClass("fa-caret-up");
}

function collapseAll()
{
	$('#panelBodyId5, #panelBodyId7,#panelBodyConfigFee, #panelBodyRelPerson,#panelBodyDocView, #panelBodyId3, #panelBodyId6 ,#panelBodyId4').removeAttr("style");
	$('#panelBodyId5, #panelBodyId7,#panelBodyConfigFee,#panelBodyRelPerson,#panelBodyDocView, #panelBodyId3, #panelBodyId6, #panelBodyId4').addClass("ui-helper-hidden ");
	$("#trustCaret, #regulatoryDetailsCaret, #relatedPersonCaret, #configFeeCaret, #docViewCaret ,#partnershipCaret, #individualCaret, #corporationCaret").removeClass("fa-caret-up");
	$("#trustCaret, #regulatoryDetailsCaret, #relatedPersonCaret, #configFeeCaret, #docViewCaret, #partnershipCaret, #individualCaret, #corporationCaret").addClass("fa-caret-down");
}

function validateResidentId() {

	var residentId = $('input[name=residentId]').val();	
	
	if ("" != residentId && (selEndClientCat == 'INDIVIDUAL' || selEndClientCat == 'PARTNERSHP')) {
		$('#errorDiv').hide();
		$('#messageContentDiv1').addClass('hidden');
		$.ajax({
			url : "cpon/endClient/validateResidentId.json",
			type : "POST",
			data : {
				residentId : residentId
			},
			success : function(data) {
				var objJson = data;
				var arrError = new Array();
				if(null!= objJson.ERROR){	
					var errror = {
						"errorCode" : "Error",
						"errorMessage" : objJson.ERROR
					};
					arrError.push(errror);
					$('#formMessageArea >  p').empty();
					$('#messageContentDiv1').addClass('hidden');
					var element = null, strMsg = null, strTargetDivId = 'formMessageArea', strErrorCode = '';
					if (arrError && arrError.length > 0) {
						$('#' + strTargetDivId).empty();
						$.each(arrError, function(index, error) {
									strErrorCode = error.errorCode || error.code;
									if (!isEmpty(strErrorCode)) {
										var msg = error.errorMessage;										
										element = $('<p>').text(msg);
										element.appendTo($('#' + strTargetDivId));
										$('#' + strTargetDivId + ', #messageContentDiv1')
												.removeClass('hidden');
									}
								});					 
					}
							
				}
				else {				
					$('#individualBirthDate').val(data.COMPUTED_DATE);
				}
			}

		});

	}
}

function validateRelatedPersonResidentId() {

	var residentId = $('#SAIdPopup').val();
	var hasError = false;
	$('#messageContentDiv').addClass('hidden');
	if ("" != residentId && $("[name=SAresidentFlag]")[0].checked ) {
		
		$.ajax({
			url : "cpon/endClient/validateResidentId.json",
			type : "POST",
			async :false,
			data : {
				residentId : residentId
			},
			success : function(data) {
				var objJson = data;
				var arrError = new Array();
				if(null!= objJson.ERROR){	
					var errror = {
						"errorCode" : "Error",
						"errorMessage" : objJson.ERROR
					};
					hasError =true;
					arrError.push(errror);
					doHandlePaintErrors(arrError);							
				}
				else {	
					hasError =false;
					$('#birthDatePopup').val(data.COMPUTED_DATE);
				}
			}

		});

	}
	return hasError;
}