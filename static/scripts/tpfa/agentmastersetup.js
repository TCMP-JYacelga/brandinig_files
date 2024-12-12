
function toggleRadioKycUpld(elm)
{
	var kycFlag =$("#kycUpldRequired").val();
	if(elm == 'Y')
	{
		$("#kycUpldRequired").val('Y');	
	}
	else
	{
		$("#kycUpldRequired").val('N');	
	}
}

function setDirtyBit() {		
		$('#dirtyBit').val("1");
}

function agentTypeChange(){	
	
	var agentTypeVal = null;
	agentTypeVal = document.getElementById( "agentType" ).value;
	
	switch (parseInt(agentTypeVal,10)) {
	
	case 0 : //Individual
		 $("#lbltrustRegNmbr").removeClass("required-lbl-right");
		 $("#lblCompanyRegNmbr").removeClass("required-lbl-right");
		 $('#trustNumber').val('');
		 $('#trustNumber').attr('disabled',true);
		 $('#trustNumber').addClass('disabled');
		 $('#companyRegNmbr').val('');
		 $('#companyRegNmbr').attr('disabled',true);
		 $('#companyRegNmbr').addClass('disabled');
		 $('#residentLabelRow').show();
		 $('#residentFieldRow').show();
		 $('#regNumberLabelRow').hide();
		 $('#regNumberFieldRow').hide();		 
		break;	
	case 1 : 	//Company
			$("#lbltrustRegNmbr").removeClass("required-lbl-right");
			 $("#lblCompanyRegNmbr").addClass("required-lbl-right");
			 $('#trustNumber').val('');
			 $('#trustNumber').attr('disabled',true);
			 $('#trustNumber').addClass('disabled');			 
			 $('#companyRegNmbr').attr('disabled',false);
			 $('#companyRegNmbr').removeClass('disabled');
			 $('#residentLabelRow').hide();
			 $('#residentFieldRow').hide();
			 $('#regNumberLabelRow').show();
			 $('#regNumberFieldRow').show();
			 $('#lblTrustNumberLabelTD').hide();
			 $('#lblTrustNumberFieldTD').hide();
			 $('#lblCompanyRegLabelTD').show();
			 $('#lblCompanyRegFieldTD').show();			 
		break;		
	case 2 : //Trust
		 $("#lbltrustRegNmbr").addClass("required-lbl-right");
		 $("#lblCompanyRegNmbr").removeClass("required-lbl-right");		 
		 $('#trustNumber').attr('disabled',false);
		 $('#trustNumber').removeClass('disabled');
		 $('#companyRegNmbr').val('');
		 $('#companyRegNmbr').attr('disabled',true);
		 $('#companyRegNmbr').addClass('disabled');
		 $('#residentLabelRow').hide();
		 $('#residentFieldRow').hide();
		 $('#regNumberLabelRow').show();
		 $('#regNumberFieldRow').show();
		 $('#lblTrustNumberLabelTD').show();
		 $('#lblTrustNumberFieldTD').show();
		 $('#lblCompanyRegLabelTD').hide();
		 $('#lblCompanyRegFieldTD').hide();
		break;		
	case 3 : //Partnership	
		 $("#lbltrustRegNmbr").removeClass("required-lbl-right");
		 $("#lblCompanyRegNmbr").removeClass("required-lbl-right");
		 $('#trustNumber').val('');
		 $('#trustNumber').attr('disabled',true);
		 $('#trustNumber').addClass('disabled');
		 $('#companyRegNmbr').val('');
		 $('#companyRegNmbr').attr('disabled',true);
		 $('#companyRegNmbr').addClass('disabled');
		 $('#residentLabelRow').show();
		 $('#residentFieldRow').show();
		 $('#regNumberLabelRow').hide();
		 $('#regNumberFieldRow').hide();		
		break;
	default:
	 $("#lbltrustRegNmbr").removeClass("required-lbl-right");
	 $("#lblCompanyRegNmbr").removeClass("required-lbl-right");
	 $('#trustNumber').val('');
	 $('#trustNumber').attr('disabled',true);
	 $('#trustNumber').addClass('disabled');
	 $('#companyRegNmbr').val('');
	 $('#companyRegNmbr').attr('disabled',true);
	 $('#companyRegNmbr').addClass('disabled');
	 $('#residentLabelRow').show();
	 $('#residentFieldRow').show();
	 $('#regNumberLabelRow').hide();
	 $('#regNumberFieldRow').hide();
		break;
	}
	
}

function reloadIndustryTypeLov(accountableFlag) {
	
	var indutryTypeList;
	var sellerId = $('#sellerId').val();
	var opt;
	if(pageMode != "VIEW" ) {
	$.ajax({
		url : "cpon/agentSetup/industryTypeList.json",
	//	contentType : "application/json",
		type : "POST",
		data : {
			accountableFlag : accountableFlag,
			sellerId : sellerId
		},
		success : function(data) {
			$( '#industryTypeCode > option' ).remove();
			if (data.d.filter) {
				indutryTypeList = data.d.filter;
				for( var i = 0 ; i < indutryTypeList.length ; i++ )
				{
					opt = document.createElement("option");
		            document.getElementById("industryTypeCode").options.add(opt);
		            opt.text = indutryTypeList[i].name;
		            if(industryVal == indutryTypeList[i].value) {
		            	opt.selected = true;
		            }
		            opt.value =indutryTypeList[i].value;
				}
																	
			}
		}
	});
	}
	
	
}

function toggleRadioAccountableFlag (elm) {
	var accountableFlag =$("#accountableFlag").val();
	if(elm == 'Y')
	{
		$("#accountableFlag").val('Y');
		reloadIndustryTypeLov('Y');
	}
	else
	{
		$("#accountableFlag").val('N');
		reloadIndustryTypeLov('N');
	}
}

function toggleRadioChargeAgentFeeFlag(elm) {
	var chargeFeeFlag =$("#chargeAgentFeeFlag").val();
	if(elm == 'Y')
	{
		$("#chargeAgentFeeFlag").val('Y');		
	}
	else
	{
		$("#chargeAgentFeeFlag").val('N');	
	}	
}

function toggleRadioResidentFlag (elm) {
	var residentFlag =$("#residentFlag").val();
	if(elm == 'Y')
	{
		$("#residentFlag").val('Y');
		$("#lblresidentId").addClass("required-lbl-right");
		$('#residentId').attr('disabled',false);
		$('#residentId').removeClass('disabled');
		$("#lblpassportNumber").removeClass("required-lbl-right");
	}
	else
	{
		$("#residentFlag").val('N');	
		$("#lblresidentId").removeClass("required-lbl-right");
		$('#residentId').val('');
		$('#residentId').attr('disabled',true);
		$('#residentId').addClass('disabled');
		$("#lblpassportNumber").addClass("required-lbl-right");
	}
}

function toggleRadioVatCustomer (elm) {
	var isVatCustomer =$("#isVatCustomer").val();
	if(elm == 'Y')
	{
		$("#isVatCustomer").val('Y');
		$("#lblVatNumber").addClass("required-lbl-right");		
		$('#vatNumber').attr('disabled',false);
		$('#vatNumber').removeClass('disabled');
	}
	else
	{
		$("#isVatCustomer").val('N');
		$("#lblVatNumber").removeClass("required-lbl-right");
		$('#vatNumber').val('');
		$('#vatNumber').attr('disabled',true);
		$('#vatNumber').addClass('disabled');
		
	}
}

function toggleRadioSubAccountServiceFeeFlag (elm) {
	var subAccountServiceFeeFlag =$("#subAccountServiceFeeFlag").val();
	if(elm == 'Y')
	{
		$("#subAccountServiceFeeFlag").val('Y');	
	}
	else
	{
		$("#subAccountServiceFeeFlag").val('N');	
	}
}

function toggleRadioStep2ApprovalFlag (elm) {
	var step2ApprovalFlag =$("#step2ApprovalFlag").val();
	if(elm == 'Y')
	{
		$("#step2ApprovalFlag").val('Y');	
	}
	else
	{
		$("#step2ApprovalFlag").val('N');	
	}
}

function toggleRadioAutoTrfrFidelityFundFlag (elm) {
	var autoTrfrFidelityFundFlag =$("#autoTrfrFidelityFundFlag").val();
	if(elm == 'Y')
	{
		$("#autoTrfrFidelityFundFlag").val('Y');
		$("#lblFidelityFundCode").addClass("required-lbl-right");		
		$('#fidelityFundCode').attr('disabled',false);
		$('#fidelityFundCode').removeClass('disabled');
	}
	else
	{
		$("#autoTrfrFidelityFundFlag").val('N');
		$('#fidelityFundCode').val('');		
		$("#lblFidelityFundCode").removeClass("required-lbl-right");
		$('#fidelityFundCode').attr('disabled',true);
		$('#fidelityFundCode').addClass('disabled');
	}
}

function stmtDeliveryChange() {
	
	var stmtDeliveryVal = null;
	stmtDeliveryVal = document.getElementById( "stmtDelivery" ).value;
	
	switch (parseInt(stmtDeliveryVal,10)) {
	
	case 0 : //Collect by Customer		
		$('#lblbulkStmtDeliveryFlag').removeClass('required-lbl-right');
		$('#bulkStmtDeliveryFlag').addClass('disabled');
		$('#bulkStmtDeliveryFlag').attr('disabled',true);
		$('#bulkStmtDeliveryFlag').val('');
		break;
	case 1 : //Mail to Customer
		$('#lblbulkStmtDeliveryFlag').addClass('required-lbl-right');
		$('#bulkStmtDeliveryFlag').removeClass('disabled');
		$('#bulkStmtDeliveryFlag').attr('disabled',false);				
		break;
	case 2 : //Suppress Statement
		$('#lblbulkStmtDeliveryFlag').removeClass('required-lbl-right');
		$('#bulkStmtDeliveryFlag').addClass('disabled');
		$('#bulkStmtDeliveryFlag').attr('disabled',true);
		$('#bulkStmtDeliveryFlag').val('');
		break;
	default :
		break;
	}
}

function bulkStmtDeliveryFlagChange() {
	
}

function copyPostAddressToPhysicalAddress (me) {
	
	var temp = null;
	if (me.checked){
	temp = $('#postAddressLine1').val();
	$('#phyAddressLine1').val(temp);temp = null;
	temp = $('#postAddressLine2').val();
	$('#phyAddressLine2').val(temp);temp = null;
	temp = $('#postAddressLine3').val();
	$('#phyAddressLine3').val(temp);temp = null;
	temp = $('#postAddressLine4').val();
	$('#phyAddressLine4').val(temp);temp = null;
	temp = $('#postAddressZipCode').val();
	$('#phyAddressZipCode').val(temp);temp = null;
	temp = $('#postAddressTelephone').val();
	$('#phyAddressTelephone').val(temp);temp = null;
	temp = $('#postAddressCountryCode').val();
	$('#phyAddressCountryCode').val(temp);temp = null;
	temp = $('#postAddressState').val();
	if(null != temp)
	{
		populateStates(document.getElementById("phyAddressCountryCode"), temp);
	}
	//$('#phyAddressState').val(temp);
	temp = null;
	}
	else{
		$('#phyAddressLine1').val('');
		$('#phyAddressLine2').val('');
		$('#phyAddressLine3').val('');
		$('#phyAddressLine4').val('');
		$('#phyAddressZipCode').val('');
		$('#phyAddressTelephone').val('');
		$('#phyAddressCountryCode').val('');
		$('#phyAddressState').val('');
	}
	
}

function checkRecordsCountInGrid() {
	
	var detailGrid = GCP.getApplication().controllers.items[ 0 ].getAgentSetupDtlGridRef();
	var detailRecords = detailGrid.store.data.items;
	
	if(detailRecords.length >= 10) {		
		Ext.Msg.show({
		       title      : 'Error',
		       width : 350,
		       msg        :getLabel('warn.agentSetup.maxDesignatedPerson','Maximum 10 Designated Persons are allowed.'),
		       buttons    : Ext.MessageBox.OK,		      
		       icon       : Ext.MessageBox.ERROR
		    });
	return false;
	}
	return true;
	
}

function showAgentDesignatedPersonPopup( record ,mode )
{
	var popupTitle = null;
	
	if(mode === "ADD" ) {
	var checkCountFlag = checkRecordsCountInGrid();
	if(!checkCountFlag){
		return;
	}
	}
	
	popupTitle = "Add Designated Person Details";
	
	if(mode === "VIEW" ) {
		popupTitle = "View Designated Person Details";
	}
	if(mode === "EDIT" ) {
		popupTitle = "Modify Designated Person Details";
	}	
		
	$( '#agentDesignatedPersonEntryPopup' ).dialog(
	{
		bgiframe:true,
		autoOpen : false,
		height : 'auto',
		width : '60%',
		modal : true,
		resizable : false,
		title : popupTitle,
		position: { of: $( window ), at: "center",my: "center" },
		buttons : {			
			'Save' :  {
				id : "btnSave",
				text: mode == "EDIT" ? 'Update' : 'Save',
				"class": "ux_label-margin-right",
	             click: function() {
	            	addPersonAndUpdateAgentMaster('updateAgentMasterSetup.srvc',mode);
	            }
		},
		'Cancel' : {
			id : "btnCancel",
			text: 'Cancel',
			"class": "ux_label-margin-right",
            click: function() {
            	closePopup( 'agentDesignatedPersonEntryPopup' );
           }
	}		
		}
	} );
	if( null== record && mode == "ADD") {
		$("#frmDetail :input").attr('disabled',false);
		$("#frmDetail :input").removeClass('disabled');
		$('#detailViewState').val('');
		$('#personType').val('');
		$('#personTitle').val('');
		$('#firstName').val('');
		$('#surName').val('');
		$('#prefCommunication').val('');
		$('#landlineNumber').val('');
		$('#faxNumber').val('');
		$('#email').val('');
		$('#mobileNumber').val('');
		$('#personResidentFlag').val('Y');
		$('#personResidentId').val('');
		$('#personPassportNumber').val('');
		toggleAgentDesignatedPersonResidentFlag('Y');
		showHideTaxField($('#personType')[0] , record);
		$("#btnSave").show();
		
	}
	else {
		$("#frmDetail :input").attr('disabled',false);
		$("#frmDetail :input").removeClass('disabled');
		$('#detailViewState').val(record.get("viewState"));
		$('#personType').val(record.get("personType"));
		$('#personTitle').val(record.get("personTitle"));
		$('#firstName').val(record.get("firstName"));
		$('#surName').val(record.get("surName"));
		$('#prefCommunication').val(record.get("prefCommunication"));
		$('#landlineNumber').val(record.get("landlineNumber"));
		$('#faxNumber').val(record.get("faxNumber"));
		$('#email').val(record.get("email"));
		$('#mobileNumber').val(record.get("mobileNumber"));
		$('#personResidentFlag').val(record.get("residentFlag"));
		$('#personResidentId').val(record.get("residentId"));
		$('#personPassportNumber').val(record.get("passportNumber"));
		toggleAgentDesignatedPersonResidentFlag($('#personResidentFlag').val());
		showHideTaxField($('#personType')[0] , record);
		$("#btnSave").show();
		
	}
	if(mode == "VIEW"){
		$("#frmDetail :input").attr('disabled','disabled');
		$("#frmDetail :input").addClass('disabled');
		$("#btnSave").hide();		
	}
	
	clearAndHideErrorDiv();
	
	$( '#agentDesignatedPersonEntryPopup' ).dialog( "open" );
}

function toggleAgentDesignatedPersonResidentFlag (elm) {
	var agentDesignatedPersonResidentFlag =$("#personResidentFlag").val();
	if(elm == 'Y')
	{
		$("#personResidentFlag").val('Y');
		$('[name="personResidentFlagYes"]').attr('checked','checked');
		$('[name="personResidentFlagNo"]').attr('checked',false);
		$('#personPassportNumber').val('');
		$('#personPassportNumber').attr('disabled',true);
		$('#personPassportNumber').addClass('disabled');
		$('#lblPersonPassportNumber').removeClass("required-lbl-right");
		$('#lblPersonResidentId').addClass("required-lbl-right");	
		$('#personResidentId').attr('disabled',false);
		$('#personResidentId').removeClass('disabled');
		
	}
	else{
		$("#personResidentFlag").val('N');
		$('[name="personResidentFlagNo"]').attr('checked','checked');
		$('[name="personResidentFlagYes"]').attr('checked',false);
		$('#personPassportNumber').attr('disabled',false);
		$('#personPassportNumber').removeClass('disabled');
		$('#lblPersonPassportNumber').addClass("required-lbl-right");
		$('#lblPersonResidentId').removeClass("required-lbl-right");
		$('#personResidentId').val('');
		$('#personResidentId').attr('disabled',true);
		$('#personResidentId').addClass('disabled');
	}
	
}

function closePopup( dlgId )
{
	$( '#' + dlgId + '' ).dialog( "close" );
}

function createErrorDiv()
{
	var parentMessageArea = document.getElementById('popupParentMessageArea');
	var messageArea = document.getElementById('popupMessageArea');
	if( null == messageArea )
	{
		messageArea = document.createElement('div');
		messageArea.id="popupMessageArea";
		messageArea.className = "errors";
		parentMessageArea.appendChild(messageArea);
		messageArea.innerHTML = "<span>Error</span>";
	}
}
function addErrorToDiv(errorMessage)
{
	var updatedErrorMessage = "<ul><li>" + errorMessage + "</li></ul>";
	var messageArea = document.getElementById('popupMessageArea');
	messageArea.innerHTML += updatedErrorMessage;
}//
function closeErrorDiv()
{
	var messageArea = document.getElementById('popupMessageArea');
	//messageArea.innerHTML += "</ul>";
}
function clearAndHideErrorDiv()
{
	var messageArea = document.getElementById('popupMessageArea');
	if( null != messageArea )
	{
		messageArea.innerHTML = "";
		messageArea.style.display = 'none';		
	}
}
function showErrorDiv()
{
	var messageArea = document.getElementById('popupMessageArea');
	if( null != messageArea )
	{
		messageArea.className = "errors";
		messageArea.style.display = 'block';		
	}
}



function validatePersonMandatoryFields () {
	var personType;
	var personTitle;
	var firstName;
	var surName;
	var prefCommunication;
	var personResidentFlag;
	var personResidentId;
	var personPassportNumber;
	var hasErrors = false;
	var agentType = null;
	agentType = $('#agentType').val();
	clearAndHideErrorDiv();
	createErrorDiv();	
	personType = $('#personType').val();
	if(null != agentType && agentType == "3" ) {
	if(null == personType || "" == personType)
	{		
		addErrorToDiv(getLabel('lblPersonType.error.required','Person Type is required.'));
		hasErrors = true;
	 }
	else if( "1" == personType ) {
		var personTaxNumber = $('#personTaxNumber').val();
		if(null == personTaxNumber || "" == personTaxNumber) {
		addErrorToDiv(getLabel('lblPersonTaxNumber.error.required','Tax Number is required.'));
		hasErrors = true;
		}
	}
	else {
		$('#personTaxNumber').val('');
	}
	
	
	}
	personTitle = $('#personTitle').val();
	if(null == personTitle || "" == personTitle)
	{	
		addErrorToDiv(getLabel('lblPersonTitle.error.required','Person Title is required.'));
		hasErrors = true;
	 }
	firstName = $('#firstName').val();
	if(null== firstName || "" == firstName)
	{
		addErrorToDiv(getLabel('lblFirstName.error.required','First Name is required.'));
		hasErrors = true;
	 }
	surName = $('#surName').val();
	if(null == surName || "" == surName)
	{
		addErrorToDiv(getLabel('lblSurname.error.required','Surname is required.'));
		hasErrors = true;
	 }
	prefCommunication = $('#prefCommunication').val();
	if(null == prefCommunication || "" == prefCommunication)
	{	
		addErrorToDiv(getLabel('lblPrefCommunication.error.required','Preferred Communication is required.'));
		hasErrors = true;
	 }
	
	personResidentFlag = $('#personResidentFlag').val();
	personResidentId =  $('#personResidentId').val();
	personPassportNumber =  $('#personPassportNumber').val();
	if( "Y" == personResidentFlag && "" == personResidentId)
	{
		addErrorToDiv(getLabel('lblPersonResidentId.error.required','ID Number is required.'));
		hasErrors = true;
	 }
	if( "N" == personResidentFlag && "" == personPassportNumber)
	{
		addErrorToDiv(getLabel('lblPersonPassportNumber.error.required','Passport Number  is required.'));
		hasErrors = true;
	 }
	var personEmail = null;
	personEmail = $('#email').val();
	var validEmail = false;
	
	if(null!=personEmail && "" != personEmail  ) {	
	validEmail = isValidEmailAddress(personEmail);
	if(!validEmail) {
		addErrorToDiv(getLabel('lblpersonEmail.error.required','Email is Invalid.'));
		hasErrors = true;
	}
	}
	
     	if(!hasErrors) {
     		clearAndHideErrorDiv();
     	}
	
	return hasErrors;
}

function checkDuplicatePerson () {
	var errorFlag = false;
var detailGrid = GCP.getApplication().controllers.items[ 0 ].getAgentSetupDtlGridRef();
var detailRecords = detailGrid.store.data.items;

var firstName = $('#firstName').val().toUpperCase();
var surName = $('#surName').val().toUpperCase();

clearAndHideErrorDiv();
var recFirstName,recSurname;

			for( var index = 0 ; index < detailRecords.length ; index++ )
			{
				recFirstName = detailRecords[index].data.firstName.toUpperCase();
				recSurname = detailRecords[index].data.surName.toUpperCase();
				
				if(recFirstName == firstName && recSurname == surName  ){
					errorFlag = true;
					break;
				}
			}
			if(errorFlag) {
				addErrorToDiv(getLabel('lblPerson.error.alreadyExists','Designated Person Already Exists.'));
			}
			return errorFlag;
}

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
    return pattern.test(emailAddress);
}


function addPersonAndUpdateAgentMaster (strUrl , mode) {
	
	var hasError = false;
	//make the Ajax Call first
	hasError = validateDesignatedPersonResidentId();
	if(hasError){
		showErrorDiv();
		return false;
	}
	else{
		hasError = false;	
	}

	hasError = validatePersonMandatoryFields();

	if(hasError){
		showErrorDiv();
		return false;
	}
	if(mode == "ADD") {
	hasError = checkDuplicatePerson();
	if(hasError){
		showErrorDiv();
		return false;
	}
	}
	
	hasError = checkTaxPersonNumberLength();
	if(hasError){
		showErrorDiv();
		return false;
	}

	
	var parentForm = document.forms[ "frmMain" ];
	var url = strUrl;
	 $('input:disabled').each( 
		    	function()
		    	{
		    		$(this).removeAttr( " disabled " );    	
		    });

		    $('textarea:disabled').each( 
		    	function()
		    	{
		    		$(this).removeAttr( " disabled " );    		
		    });

		    $('select:disabled').each( 
		    	function()
		    	{
		    		$(this).removeAttr( " disabled " );    		
		    });
	parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
					'agentDesignatedPersonDtlBeans[0].agentCode', $('#agentCode').val() ) );	
	parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].personType', $('#personType').val() ) );
	parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].personTitle', $('#personTitle').val() ) );
	parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].firstName', $('#firstName').val() ) );
	parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].surName', $('#surName').val() ) );
	parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].prefCommunication', $('#prefCommunication').val() ) );
	parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].landlineNumber', $('#landlineNumber').val() ) );
	parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].faxNumber', $('#faxNumber').val() ) );
	parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].email', $('#email').val() ) );
	parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].mobileNumber', $('#mobileNumber').val() ) );
	parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].residentFlag', $('#personResidentFlag').val() ) );
	parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].residentId', $('#personResidentId').val()) );
	parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].passportNumber', $('#personPassportNumber').val()) );
	parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].viewState', $('#detailViewState').val() ) );
	parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].isDeleted',false ) );
	parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
			'agentDesignatedPersonDtlBeans[0].taxNumber', $('#personTaxNumber').val()  ) );	
	
	parentForm.method = 'POST';
	parentForm.action = url;
	parentForm.submit();
	
}

function checkTaxPersonNumberLength() {
	var errorFlag = false;
	var intLength = 0;


var personTaxNumber = $('#personTaxNumber').val();
intLength = personTaxNumber.length

clearAndHideErrorDiv();

if(intLength > 10){
	errorFlag  = true;
}
if(errorFlag) {
	addErrorToDiv(getLabel('lblPerson.error.personTaxNumberExceedLength','Tax Number should not exceeds 10 characters.'));
}
return errorFlag;	
}




window.onload = function() {

/*
$("a[id^='chkService']").click(function() {  // this is your event
	setDirtyBit();
});
$("input").change(function() {  // this is your event
	setDirtyBit();
});
$("img[id^='chkAll']").click(function() {  // this is your event
	setDirtyBit();
});
$("a[class^='button_underline']").click(function() {  // this is your event
	setDirtyBit();
});
$("a[class^='thePointer button_underline']").click(function() {  // this is your event
	setDirtyBit();
});

$("a[id^='chk_']").click(function() {  // this is your event
	setDirtyBit();
});
$("img[id^='chk']").click(function() {  // this is your event
	setDirtyBit();
});*/
	
$('#lnkClientInfo').attr('disabled',true);
$('#lnkClientInfo').css({'pointer-events' : 'none',
					     'cursor' : 'default'});
(function ($) {
    $.fn.selected = function (fn) {
        return this.each(function () {
            $(this).change(function () {
                this.dataChanged = true;
                fn(this);
            })
        });
    };
})(jQuery);

/*
$("select").selected(function (e) {
	setDirtyBit();
});
*/
};
function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	if(null == frm) {
		frm = document.createElement('FORM');
		frm.name = 'frmMain';
		frm.id = 'frmMain';
		frm.method = 'POST';
		frm.appendChild(createFormField('INPUT', 'HIDDEN',
			csrfTokenName, tokenValue));
		frm.appendChild(createFormField('INPUT', 'HIDDEN',
				'viewState', viewState));
		frm.appendChild(createFormField('INPUT', 'HIDDEN',
				'pageMode', pageMode));
		frm.action = strUrl;
	document.body.appendChild(frm);
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	 $('input:disabled').each( 
		    	function()
		    	{
		    		$(this).removeAttr( " disabled " );    	
		    });

		    $('textarea:disabled').each( 
		    	function()
		    	{
		    		$(this).removeAttr( " disabled " );    		
		    });

		    $('select:disabled').each( 
		    	function()
		    	{
		    		$(this).removeAttr( " disabled " );    		
		    });
		    
	frm.submit();
}

function goToPageAgentSetupSave(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	
    $('input:disabled').each( 
    	function()
    	{
    		$(this).removeAttr( " disabled " );    	
    });

    $('textarea:disabled').each( 
    	function()
    	{
    		$(this).removeAttr( " disabled " );    		
    });

    $('select:disabled').each( 
    	function()
    	{
    		$(this).removeAttr( " disabled " );    		
    });
    
    if(strUrl == 'updateAgentConfigureServiceSetup.srvc' ||strUrl == 'saveAndNextAgentConfigureSetup.srvc') {
    assignAccrualSchedulingParams();
	assignSettlementSchedulingParams();
    }
    
    if(strUrl == 'saveAndNextAgentConfigureSetup.srvc') {
    	var selectedTab = document.getElementById("selectedServiceTab").value;
    	document.getElementById("selectedServiceTab").value = selectedTab+'_next';
    }
	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit(); 
}

function assignAccrualSchedulingParams()
{
	if( accrualFreqType == 'D' )
	{
		document.getElementById( "accrualFreqPeriod" ).value = document.getElementById( "accrualFreqDayPeriod" ).value;
		document.getElementById( "accrualFreqDayNmbr" ).value = "";
	}
	else if( accrualFreqType == 'W' )
	{
		document.getElementById( "accrualFreqPeriod" ).value = document.getElementById( "accrualFreqWeekPeriod" ).value;
		document.getElementById( "accrualFreqDayNmbr" ).value = document.getElementById( "accrualFreqWeekDayNmbr" ).value;
	}
	else if( accrualFreqType == 'M' )
	{
		document.getElementById( "accrualFreqPeriod" ).value = document.getElementById( "accrualFreqMonthPeriod" ).value;
		document.getElementById( "accrualFreqDayNmbr" ).value = document.getElementById( "accrualFreqMonthDayNmbr" ).value;
	}
}

function assignSettlementSchedulingParams()
{
	if( settlementFreqType == 'D' )
	{
		document.getElementById( "settlementFreqPeriod" ).value = document.getElementById( "settlementFreqDayPeriod" ).value;
		document.getElementById( "settlementFreqDayNmbr" ).value = "";
	}
	else if( settlementFreqType == 'W' )
	{
		document.getElementById( "settlementFreqPeriod" ).value = document.getElementById( "settlementFreqWeekPeriod" ).value;
		document.getElementById( "settlementFreqDayNmbr" ).value = document
			.getElementById( "settlementFreqWeekDayNmbr" ).value;
	}
	else if( settlementFreqType == 'M' )
	{
		document.getElementById( "settlementFreqPeriod" ).value = document.getElementById( "settlementFreqMonthPeriod" ).value;
		document.getElementById( "settlementFreqDayNmbr" ).value = document
			.getElementById( "settlementFreqMonthDayNmbr" ).value;
	}
}



function goBackValidate(strUrl, frmId) {	
	
	 if ($('#dirtyBit').val() == "1")
		getConfirmationPopup(frmId, strUrl);
	else
		goToPage(strUrl, frmId);
}

function getConfirmationPopup(frmId, strUrl) {
	$('#confirmPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:'auto',
		width : 450,
		modal : true,
		resizable: false,
		draggable: false	
	});
	$('#confirmPopup').dialog("open");
	$('#cancelConfirmMsg').bind('click',function(){
		$('#confirmPopup').dialog("close");
	});
	
	$('#cancelBackConfirmMsg').bind('click',function(){
		$('#confirmPopup').dialog("close");
	});
	
	$('#doneConfirmMsgbutton').bind('click',function(){
		var frm = document.forms["frmMain"];
			frm.action = strUrl;
			frm.target = "";
			frm.method = "POST";
			frm.submit();
	});
	$('#doneBackConfirmMsgbutton').bind('click',function(){
		var frm = document.forms["frmMain"];
			frm.action = strUrl;
			frm.target = "";
			frm.method = "POST";
			frm.submit();
	});
	$('#textContent').focus();
}

function nextClickHandler(strUrl1, strUrl2, strUrl3, frmId) {
	/*
	 * if ($('#dirtyBit').val() == "1") { if ($('#txtRecordKeyNo').val() == "") {
	 * goToPage(strUrl1, frmId); } else { getConfirmationPopup(frmId, strUrl2); } }
	 * else { if ($('#txtRecordKeyNo').val() == "") goToPage(strUrl1, frmId);
	 * else goToPage(strUrl3, frmId); }
	 */
	if ($('#dirtyBit').val() == "1")
		getConfirmationPopup(frmId, strUrl2);
	else
		goToPage(strUrl3, frmId);
}
/*
 * function getFilterData(ctrl) { var filterCode =
 * ctrl.options[ctrl.selectedIndex].value; var versionCode =
 * document.getElementById("txtVersion").value; if (filterCode) { var strData =
 * {}; strData['client_id'] = filterCode; strData['version'] = versionCode;
 * strData["screenId"] = 'Client Setup'; strData[csrfTokenName] =
 * csrfTokenValue;
 * $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI); $.ajax({ type :
 * 'POST', data : strData, url : "brandingPackageInfo.formx", success :
 * function(data) { if (data != null) { //advFilterResetForm('filterForm'); //
 * ctrl.value = filterCode; //valuesRetrieved(data, filterCode); } else { } }
 * }); } }
 */


jQuery.fn.ForceNoSpecialSymbol = function() {
	return this
			.each(function() {
				$(this)
						.keydown(
								function(e) {
									var key = e.charCode || e.keyCode || 0;
									// allow backspace, tab, delete, numbers
									// keypad numbers, letters ONLY
									if (event.which) { // Netscape/Firefox/Opera
										keynum = event.which;
									}
									if (event.shiftKey || event.ctrlKey) {
										return false;
									}
									return (key == 8 || key == 9 || key == 46
											|| key == 190
											|| (key >= 37 && key <= 40)
											|| (key >= 48 && key <= 57)
											|| (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
								})
			})
};



function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}



function closePopupCashPositionExport(frmId){
	$('#'+frmId).dialog("close");
}

function validateAndNavigate(strUrl, frmId) {
	if ($('#dirtyBit').val() == "1")
		getNavigationPopup(frmId, strUrl);
	else
		goToPage(strUrl, frmId);
}

function warnAndNavigate(strUrl, frmId) {
	if ($('#dirtyBit').val() == "1")
		getNavigationPopup(frmId, strUrl);
	else
		goToPage(strUrl, frmId);
}

function getNavigationPopup(frmId, strUrl) {
	$('#navigatePopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight: 156,
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
		/*buttons : {
			"Yes" : {
				text: 'Yes',
				"class": "ux_label-margin-right",
				click: function() {
				var frm = document.getElementById(frmId);
				frm.action = strUrl;
				frm.target = "";
				frm.method = "POST";
				frm.submit();
			}
			},
			"No" : {
				text: 'No',
				click: function() {
				$(this).dialog("close");
			}
			}
		}*/
	});
	$('#navigatePopup').dialog("open");
	
	$('#cancelNavConfirmMsg').bind('click',function(){
		$('#navigatePopup').dialog("close");
	});
	
	$('#doneNavConfirmMsgbutton').bind('click',function(){
		var frm =  document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	});
	$('#textContent').focus();
	
}
jQuery.fn.ForceAmountOnly = function() {
	return this
			.each(function() {
				$(this)
						.keydown(
								function(event) {
									var keynum;
									var keychar;
									if (window.event) { // IE
										keynum = event.keyCode;
									}
									if (event.which) { // Netscape/Firefox/Opera
										keynum = event.which;
									}
									if (event.shiftKey) {
										return false;
									}
									if ((keynum == 8
											|| keynum == 9
											|| keynum == 27
											|| keynum == 46
											||
											// Allow: Ctrl+A
											(keynum == 65 && event.ctrlKey === true)
											||
											// Allow: home, end, left, right
											(keynum >= 35 && keynum <= 40)
											|| (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))) {
										if (((keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))
												&& (this.value.indexOf('.') != -1 && (this.value
														.substring(this.value
																.indexOf('.'))).length > 4))
											return false;
										return true;
									} else if (keynum == 110 || keynum == 190) {
										var checkdot = this.value;
										var i = 0;
										for (i = 0; i < checkdot.length; i++) {
											if (checkdot[i] == '.')
												return false;
										}
										if (checkdot.length == 0)
											this.value = '0';
										return true;
									} else {
										// Ensure that it is a number and stop
										// the keypress
										if (event.shiftKey
												|| (keynum < 48 || keynum > 57)
												&& (keynum < 96 || keynum > 105)) {
											event.preventDefault();
										}
									}

									keychar = String.fromCharCode(keynum);

									return !isNaN(keychar);
								})
			})
};

jQuery.fn.dateTextBox = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) {
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad for TAB
							return (key == 9 || key==8 || key==46);
							})
			})
};



function to_upperCase(element)
{
	$(element).val($(element).val().toUpperCase());
}


function populateStates(elmt, mState)
{
	var state = "";
	if(elmt && elmt.id == "phyAddressCountryCode")
	{
		if(elmt.value == "")
		{
			$('#phyAddressState').attr("disabled", "true");
			$('#phyAddressState').val("");
		}
		else
		{
			$('#phyAddressState').removeAttr("disabled");
			state = document.getElementById("phyAddressState");
		}
	}
	else if(elmt && elmt.id == "postAddressCountryCode")
	{
		if(elmt.value == "")
		{
			$('#postAddressState').attr("disabled", "true");
			$('#postAddressState').val("");
		}
		else
		{
			$('#postAddressState').removeAttr("disabled");
			state = document.getElementById("postAddressState");
		}
	}
	if(elmt && elmt.value != "")
	{
		blockClientUI(true);
		$.post('cpon/agentSetup/agentCountryStateList.json', { $countryCode: elmt.value}, 
		function(data){
			populateData(state, data);
			if(mState != "")
				state.value = mState;
			blockClientUI(false);
		})
		.fail(function() 
		{
			blockClientUI(false);
		});
	}
}

function blockClientUI(blnBlock) {
	if (blnBlock === true) {
		$("#pageContentDiv").addClass('ui-helper-hidden');
		$('#entryFormDiv').block({
			overlayCSS : {
				opacity : 0
			},
			baseZ : 2000,
			message : '<div style="z-index: 1"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
			css : {
				height : '32px',
				padding : '8px 0 0 0'
			}
		});
	} else {
		$("#pageContentDiv").removeClass('ui-helper-hidden');
		$('#entryFormDiv').unblock();
	}
}

function populateData(select, states)
{
	var x;
	select.length=1;
	
	for (x in states)
	{
		var option=document.createElement("option");
		option.text=states[x].STATE_DESC;
		option.value=states[x].STATE_CODE;
		select.add(option);
	}
}



function showFetchLink(){
	if($('#clientShortName').val()){
		$('#lnkClientInfo').attr('disabled',false);
		$('#lnkClientInfo').css({'pointer-events' : 'auto',	'cursor' : 'pointer'});
		$('#lnkClientInfo').click(function(){ goToPage("getClientInfo.form", "frmMain")});
	}else{
		$('#lnkClientInfo').css({'pointer-events' : 'none',
									'cursor' : 'default'});
		$('#lnkClientInfo').attr('disabled',true);
	}	
}


jQuery.fn.validateZipcode = function() {
	return this
			.each(function() {
				$(this)
						.keydown(
								function(e) {
									var key = e.charCode || e.keyCode || 0;
									// allow backspace, tab, delete, numbers
									// keypad numbers, letters ONLY
									if (event.which) { // Netscape/Firefox/Opera
										keynum = event.which;
									}
									if (event.shiftKey || event.ctrlKey) {
										return false;
									}
									return (key == 8 || key == 9 || key == 46
											|| key == 190 || key == 189 || key == 32
											|| (key >= 37 && key <= 40)
											|| (key >= 48 && key <= 57)
											|| (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
								})
			})
};

function gotoNextPage(strSaveAndNextUrl, frmId, strNextPageUrl) {
	var strDirtyBit = $('#dirtyBit').val();
	if(!isEmpty(strDirtyBit) && strDirtyBit==="0")
		goToPage(strNextPageUrl, frmId);
	else
		goToPageAgentSetupSave(strSaveAndNextUrl, frmId);
}

function resetDirtyBit(){
	$('#dirtyBit').val("0");
}

function setAccrualFreqType()
{
	accrualFreqType = $( 'input[name="accrualFreqType"]:checked' ).val();
}

function setSettlementFreqType()
{
	settlementFreqType = $( 'input[name="settlementFreqType"]:checked' ).val();
}

function setSettlementFrequency()
{
	var accrualFreqDayPeriod = document.getElementById( "accrualFreqDayPeriod" ).value ;
	var settlementFreqTypeRadioRef = document.getElementsByName( "settlementFreqType" );
	var weekDayNmbr = document.getElementById( "accrualFreqWeekDayNmbr" ).value
	var monthDayNmbr = document.getElementById( "accrualFreqMonthDayNmbr" ).value
	var dayNmbr ;
	
	if( (accrualFreqType == 'D' &&  accrualFreqDayPeriod > 1) ||  !(accrualFreqType == 'D'))
	{
		if(accrualFreqType == 'D')
		{
			settlementFreqTypeRadioRef[ 0 ].checked = true;
		}
		else if(accrualFreqType == 'W')
		{
			settlementFreqTypeRadioRef[ 1 ].checked = true;
			dayNmbr = weekDayNmbr ;
		}
		else if(accrualFreqType == 'M')
		{
			settlementFreqTypeRadioRef[ 2 ].checked = true;
			dayNmbr = monthDayNmbr ;
		}
		setSettlementFreqType();
		setSettlementFreqParamRender( 'N' );
		if(dayNmbr != null)
		{
			setSettlementFrequencyDayNumbr();
		}
	}
}
function setSettlementFrequencyDayNumbr()
{
	var weekDayNmbr = document.getElementById( "accrualFreqWeekDayNmbr" ).value
	var monthDayNmbr = document.getElementById( "accrualFreqMonthDayNmbr" ).value
	
	if(accrualFreqType == 'W')
	{
		document.getElementById( "settlementFreqWeekDayNmbr" ).value = weekDayNmbr ;
		document.getElementById( "settlementFreqDayNmbr" ).value= weekDayNmbr;
		document.getElementById( "accrualFreqDayNmbr" ).value= weekDayNmbr;
		$( "#settlementFreqWeekDayNmbr" ).attr( "disabled", true );
		$( "#settlementFreqWeekDayNmbr" ).addClass( "disabled" );
	}
	else if(accrualFreqType == 'M')
	{
		document.getElementById( "settlementFreqMonthDayNmbr" ).value = monthDayNmbr ;
		document.getElementById( "settlementFreqDayNmbr" ).value= monthDayNmbr;
		document.getElementById( "accrualFreqDayNmbr" ).value= monthDayNmbr;
		$( "#settlementFreqMonthDayNmbr" ).attr( "disabled", true );
		$( "#settlementFreqMonthDayNmbr" ).addClass( "disabled" );
	}
}

function setAccrualFreqParamRender( onLoadFlag )
{
	var creditInterestProfileKey = $('#creditInterestProfileKey').val();
	// Following If statement will set default Accrual Frequency to EOM.
	if(creditInterestProfileKey == ""  && accrualFlag == 'Y' &&  onLoadFlag == 'Y' )
	{
		var accrualFreqTypeRadioRef = document.getElementsByName( "accrualFreqType" );

		for( var i = 0 ; i < accrualFreqTypeRadioRef.length ; i++ )
		{
			if( accrualFreqTypeRadioRef[ i ].value == 'M' )
			{
				accrualFreqTypeRadioRef[ i ].checked = true;
				setAccrualFreqType();
			}
		}
	}

	if( accrualFreqType == 'D' )
	{
		$( "#accrualFreqDayPeriod" ).attr( "disabled", false );
		$( "#accrualFreqDayPeriod" ).removeClass( "disabled" );

		if( creditInterestProfileKey != "" && onLoadFlag == 'Y' )
		{
			document.getElementById( "accrualFreqDayPeriod" ).value = document.getElementById( "accrualFreqPeriod" ).value;
		}
		else
		{
			document.getElementById( "accrualFreqDayPeriod" ).value = '1';
			document.getElementById( "accrualFreqWeekPeriod" ).value = '';
			document.getElementById( "accrualFreqMonthPeriod" ).value = '';
		}	

		$( "#accrualFreqWeekDayNmbr" ).attr( "disabled", true );
		$( "#accrualFreqWeekDayNmbr" ).addClass( "disabled" );

		$( "#accrualFreqWeekPeriod" ).attr( "disabled", true );
		$( "#accrualFreqWeekPeriod" ).addClass( "disabled" );

		$( "#accrualFreqMonthDayNmbr" ).attr( "disabled", true );
		$( "#accrualFreqMonthDayNmbr" ).addClass( "disabled" );

		$( "#accrualFreqMonthPeriod" ).attr( "disabled", true );
		$( "#accrualFreqMonthPeriod" ).addClass( "disabled" );
	}

	else if( accrualFreqType == 'W' )
	{

		$( "#accrualFreqWeekPeriod" ).attr( "disabled", false );
		$( "#accrualFreqWeekPeriod" ).removeClass( "disabled" );

		$( "#accrualFreqWeekDayNmbr" ).attr( "disabled", false );
		$( "#accrualFreqWeekDayNmbr" ).removeClass( "disabled" );

		if( creditInterestProfileKey != "" &&  onLoadFlag == 'Y' )
		{
			document.getElementById( "accrualFreqWeekPeriod" ).value = document.getElementById( "accrualFreqPeriod" ).value;
			document.getElementById( "accrualFreqWeekDayNmbr" ).value = document.getElementById( "accrualFreqDayNmbr" ).value;
		}
		else
		{
			document.getElementById( "accrualFreqWeekPeriod" ).value = '1';
			document.getElementById( "accrualFreqDayPeriod" ).value = '';
			document.getElementById( "accrualFreqMonthPeriod" ).value = '';
		}		

		$( "#accrualFreqDayPeriod" ).attr( "disabled", true );
		$( "#accrualFreqDayPeriod" ).addClass( "disabled" );

		$( "#accrualFreqMonthDayNmbr" ).attr( "disabled", true );
		$( "#accrualFreqMonthDayNmbr" ).addClass( "disabled" );

		$( "#accrualFreqMonthPeriod" ).attr( "disabled", true );
		$( "#accrualFreqMonthPeriod" ).addClass( "disabled" );
	}
	else if( accrualFreqType == 'M' )
	{
		$( "#accrualFreqMonthDayNmbr" ).attr( "disabled", false );
		$( "#accrualFreqMonthDayNmbr" ).removeClass( "disabled" );

		$( "#accrualFreqMonthPeriod" ).attr( "disabled", false );
		$( "#accrualFreqMonthPeriod" ).removeClass( "disabled" );

		if( accrualFlag == 'Y' && onLoadFlag == 'Y' )
		{
			document.getElementById( "accrualFreqMonthPeriod" ).value = 1;
			document.getElementById( "accrualFreqMonthDayNmbr" ).value = -1;
			document.getElementById( "accrualFreqPeriod" ).value = 1;
			document.getElementById( "accrualFreqDayNmbr" ).value = -1;
		}
		else
		{
			document.getElementById( "accrualFreqMonthPeriod" ).value = '1';
			document.getElementById( "accrualFreqDayPeriod" ).value = '';
			document.getElementById( "accrualFreqWeekPeriod" ).value = '';
		}
		if( creditInterestProfileKey != "" && onLoadFlag == 'Y' )
		{
			document.getElementById( "accrualFreqMonthPeriod" ).value = document.getElementById( "accrualFreqPeriod" ).value;
			document.getElementById( "accrualFreqMonthDayNmbr" ).value = document.getElementById( "accrualFreqDayNmbr" ).value;
		}		

		$( "#accrualFreqDayPeriod" ).attr( "disabled", true );
		$( "#accrualFreqDayPeriod" ).addClass( "disabled" );

		$( "#accrualFreqWeekDayNmbr" ).attr( "disabled", true );
		$( "#accrualFreqWeekDayNmbr" ).addClass( "disabled" );

		$( "#accrualFreqWeekPeriod" ).attr( "disabled", true );
		$( "#accrualFreqWeekPeriod" ).addClass( "disabled" );
	}
}

function setSettlementFreqParamRender( onLoadFlag )
{
	var oPageMode = pageMode;
	
	var creditInterestProfileKey = $('#creditInterestProfileKey').val();
	// Following If statement will set default Settlement Frequency to EOM.
	if( creditInterestProfileKey == "" && onLoadFlag == 'Y' )
	{
		var settlementFreqTypeRadioRef = document.getElementsByName( "settlementFreqType" );

		for( var i = 0 ; i < settlementFreqTypeRadioRef.length ; i++ )
		{
			if( settlementFreqTypeRadioRef[ i ].value == 'M' )
			{
				settlementFreqTypeRadioRef[ i ].checked = true;
				setSettlementFreqType();
			}
		}
	}
	
	if( settlementFreqType == 'D' )
	{
		$( "#settlementFreqDayPeriod" ).attr( "disabled", false );
		$( "#settlementFreqDayPeriod" ).removeClass( "disabled" );

		if( creditInterestProfileKey != "" &&  onLoadFlag == 'Y' )
		{
			document.getElementById( "settlementFreqDayPeriod" ).value = document.getElementById( "settlementFreqPeriod" ).value;
		}
		else
		{
			document.getElementById( "settlementFreqDayPeriod" ).value = '1';
			document.getElementById( "settlementFreqWeekPeriod" ).value = '';
			document.getElementById( "settlementFreqMonthPeriod" ).value = '';
			document.getElementById( "settlementFreqWeekDayNmbr" ).value = '';
			document.getElementById( "settlementFreqMonthDayNmbr" ).value = '';
		}	

		$( "#settlementFreqWeekPeriod" ).attr( "disabled", true );
		$( "#settlementFreqWeekPeriod" ).addClass( "disabled" );

		$( "#settlementFreqWeekDayNmbr" ).attr( "disabled", true );
		$( "#settlementFreqWeekDayNmbr" ).addClass( "disabled" );

		$( "#settlementFreqMonthPeriod" ).attr( "disabled", true );
		$( "#settlementFreqMonthPeriod" ).addClass( "disabled" );

		$( "#settlementFreqMonthDayNmbr" ).attr( "disabled", true );
		$( "#settlementFreqMonthDayNmbr" ).addClass( "disabled" );
	}
	else if( settlementFreqType == 'W' )
	{
		$( "#settlementFreqWeekPeriod" ).attr( "disabled", false );
		$( "#settlementFreqWeekPeriod" ).removeClass( "disabled" );

		$( "#settlementFreqWeekDayNmbr" ).attr( "disabled", false );
		$( "#settlementFreqWeekDayNmbr" ).removeClass( "disabled" );

		if( creditInterestProfileKey != ""  && onLoadFlag == 'Y' )
		{
			document.getElementById( "settlementFreqWeekPeriod" ).value = document.getElementById( "settlementFreqPeriod" ).value;
			document.getElementById( "settlementFreqWeekDayNmbr" ).value = document.getElementById( "settlementFreqDayNmbr" ).value;
		}
		else
		{
			document.getElementById( "settlementFreqWeekPeriod" ).value = '1';
			document.getElementById( "settlementFreqDayPeriod" ).value = '';
			document.getElementById( "settlementFreqMonthPeriod" ).value = '';
			document.getElementById( "settlementFreqWeekDayNmbr" ).value = '';
			document.getElementById( "settlementFreqMonthDayNmbr" ).value = '';
		}		

		$( "#settlementFreqDayPeriod" ).attr( "disabled", true );
		$( "#settlementFreqDayPeriod" ).addClass( "disabled" );

		$( "#settlementFreqMonthPeriod" ).attr( "disabled", true );
		$( "#settlementFreqMonthPeriod" ).addClass( "disabled" );

		$( "#settlementFreqMonthDayNmbr" ).attr( "disabled", true );
		$( "#settlementFreqMonthDayNmbr" ).addClass( "disabled" );
	}
	else if( settlementFreqType == 'M' )
	{
		$( "#settlementFreqMonthPeriod" ).attr( "disabled", false );
		$( "#settlementFreqMonthPeriod" ).removeClass( "disabled" );

		$( "#settlementFreqMonthDayNmbr" ).attr( "disabled", false );
		$( "#settlementFreqMonthDayNmbr" ).removeClass( "disabled" );
		
		
		if( accrualFlag == 'Y' && creditInterestProfileKey == "" && onLoadFlag == 'Y' )
		{
			document.getElementById( "accrualFreqMonthPeriod" ).value = 1;
			document.getElementById( "settlementFreqMonthDayNmbr" ).value = -1;
			document.getElementById( "settlementFreqPeriod" ).value = 1;
			document.getElementById( "settlementFreqDayNmbr" ).value = -1;
		}
		
		if( creditInterestProfileKey != "" && onLoadFlag == 'Y' )
		{
			document.getElementById( "settlementFreqMonthPeriod" ).value = document.getElementById( "settlementFreqPeriod" ).value;
			document.getElementById( "settlementFreqMonthDayNmbr" ).value = document.getElementById( "settlementFreqDayNmbr" ).value;
		}
		else
		{
			document.getElementById( "settlementFreqPeriod" ).value = 1;
			document.getElementById( "settlementFreqDayNmbr" ).value = -1;
			document.getElementById( "settlementFreqMonthPeriod" ).value = 1;			
			document.getElementById( "settlementFreqDayPeriod" ).value = '';
			document.getElementById( "settlementFreqWeekPeriod" ).value = '';
			document.getElementById( "settlementFreqWeekDayNmbr" ).value = '';
			document.getElementById( "settlementFreqMonthDayNmbr" ).value = -1;
		}
		

		$( "#settlementFreqDayPeriod" ).attr( "disabled", true );
		$( "#settlementFreqDayPeriod" ).addClass( "disabled" );

		$( "#settlementFreqWeekPeriod" ).attr( "disabled", true );
		$( "#settlementFreqWeekPeriod" ).addClass( "disabled" );

		$( "#settlementFreqWeekDayNmbr" ).attr( "disabled", true );
		$( "#settlementFreqWeekDayNmbr" ).addClass( "disabled" );
	}

	if(oPageMode != pageMode){
		pageMode = oPageMode
	}
	
}

function toggleReportSchedulingFlag (ctrl) {
	
	var me = ctrl;
	if(me.checked){
		$('#reportSchedulingFlag').val("Y");
		$('#reportSchedulingFlag').attr('checked',true);
	}
	else {
		$('#reportSchedulingFlag').val("N");
		$('#reportSchedulingFlag').attr('checked',false);
	}
	
}	
	


	function validateResidentId() {

	var residentId = $('#residentId').val();
	var residentFlag = $('#residentFlag').val();
	var agentType = $('#agentType').val();
	
	if ("" != residentId && (agentType == '0' || agentType == '3')) {
		var messageArea = document.getElementById('messageArea');
		if( null != messageArea )
		{
			messageArea.innerHTML = "";
			messageArea.style.display = 'none';		
		}
		$.ajax({
			url : "cpon/agentSetup/validateResidentId.json",
			// contentType : "application/json",
			type : "POST",
			data : {
				residentId : residentId
			},
			success : function(data) {
				var objJson = data;
				
				if(null!= objJson.ERROR){
					var parentMessageArea = document.getElementById('parentMessageArea');
					var messageArea = document.getElementById('messageArea');
					if( null == messageArea )
					{
						messageArea = document.createElement('div');
						messageArea.id="messageArea";
						messageArea.className = "errors";
						parentMessageArea.appendChild(messageArea);
						messageArea.innerHTML = "<span>Error</span>";
					}
					var updatedErrorMessage = "<ul><li>" + objJson.ERROR + "</li></ul>";
					var messageArea = document.getElementById('messageArea');
					messageArea.innerHTML += updatedErrorMessage;				
					if( null != messageArea )
					{
						messageArea.className = "errors";
						messageArea.style.display = 'block';		
					}
				}
				else {				
					$('#regBirthDate').val(data.COMPUTED_DATE);
				}
			}

		});

	}
}
	
	function validateDesignatedPersonResidentId(){

		var residentId = $('#personResidentId').val();
		var residentFlag = $('#personResidentFlag').val();
		var agentType = $('#agentType').val();
		var hasError = false;
		
		if ("" != residentId ) {
		clearAndHideErrorDiv();			
			$.ajax({
				url : "cpon/agentSetup/validateResidentId.json",
				 async: false,
				// contentType : "application/json",
				type : "POST",
				data : {
					residentId : residentId
				},
				success : function(data) {
					var objJson = data;
					
					if(null!= objJson.ERROR){
						createErrorDiv();
						addErrorToDiv(objJson.ERROR);
						showErrorDiv();
						hasError =true;
					}
					else {				
						hasError =false;
					}
				}

			});

		}
		return hasError;

	}
	
function showHideTaxField (elem , record ) {
	
	var me = elem;
	
	if(me.value == '1' ) { //Partner
		$('#lblPersonTaxNumberTD').show();
		$('#personTaxNumber').show();
		$('#personTaxNumber').val(record.get("taxNumber"));
	}
	else {
		$('#lblPersonTaxNumberTD').hide();
		$('#personTaxNumber').hide();	
		$('#personTaxNumber').val('');
	}	
}

jQuery.fn.SetCheckIconsForMenu = function() {
	$(this)
			.each(
					function(index) {
						var imageList = $(this).find('IMG');
						var elementId = $(this).attr("id").replace(
								"chkService1_", "");
						if (null != document.getElementById("hiddenService_"
								+ elementId)) {
							if ("N" === document
									.getElementById("hiddenService_"
											+ elementId).value) {
								imageList[0].src = "static/images/icons/icon_checked_wrong.png";
							} else {
								imageList[0].src = "static/images/icons/icon_checked_correct.png";
							}
						}
					});
};

function goToFeaturePageDynamically(srvcCode, mode, frmId) {

	var frm = document.getElementById(frmId);
	var viewStateField = document.getElementById("viewState");
	document.getElementById("selectedServiceTab").value = srvcCode;
	var strUrl = 'addAgentConfigureServices.srvc';	
	if ($('#dirtyBit').val() == "1")
		getNavigationPopup(frmId, strUrl);
	else
		goToPage(strUrl, frmId);
	// frm.action = strUrl;
	// frm.target = "";
	// frm.method = "POST";

	// frm.submit();
}

function enableTPFAClient(){
    if(null != isTpfa && isTpfa == 'TRUE'){
		$("#agentCode").sellersClientSeekAutoComplete();
	}
};

jQuery.fn.sellersClientSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "cpon/agentSetup/sellersClientList.json",
									type: "POST",
									dataType : "json",
									data : {
										$sellerCode:$('#sellerId').val(),
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.filterList;
										response($.map(rec, function(item) {
													return {														
														label : item.agentCode,														
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
							if (!isEmpty(data.agentCode))
							{
								$('#agentCode').val(data.agentCode);
								$('#agentName').val(data.agentName);
								$('#clientId').val(data.clientId);
								$('#postAddressZipCode').val(data.postAddressZipCode);
								$('#postAddressLine1').val(data.postAddressLine1);
								$('#postAddressLine2').val(data.postAddressLine2);
								$('#postAddressLine3').val(data.postAddressLine3);
								$('#postAddressLine4').val(data.postAddressLine4);
								$('#postAddressCountryCode').val(data.postAddressCountryCode);
								if(!isEmpty(data.postAddressState))
								{
									populateStates(document.getElementById("postAddressCountryCode"), data.postAddressState);
									$('#postAddressState').val(data.postAddressState);
								}
								$('#postAddressEmail').val(data.postAddressEmail);
								$('#postAddressTelephone').val(data.postAddressTelephone);
								$('#postAddressMobile').val(data.postAddressMobile);
								if(!isEmpty(data.residentFlag))
								{	
									if(data.residentFlag === 'Y' || data.residentFlag === 'R')
									{
										$("#residentFlag1").prop("checked", true);
										$('[name="residentFlag"]').attr('disabled',true);
										toggleRadioResidentFlag('Y');
									}
									else
									{
										$("#residentFlag2").prop("checked", true);
										$('[name="residentFlag"]').attr('disabled',true);
										toggleRadioResidentFlag('N');
									}
								}
								if(!isEmpty(data.marketSegCode))
									$('#marketSegCode').val(data.marketSegCode);
								if(!isEmpty(data.acctMgrCode))
									$('#acctMgrCode').val(data.acctMgrCode);
								if(!isEmpty(data.branchCode))
									$('#branchCode').val(data.branchCode);
								
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
function checkResident(residentFlag){
	if(!isEmpty(residentFlag))
	{	
		if(residentFlag === 'Y' || residentFlag === 'R')
		{
			$("#residentFlag1").prop("checked", true);
			$('[name="residentFlag"]').attr('disabled',true);
			toggleRadioResidentFlag('Y');
		}
		else
		{
			$("#residentFlag2").prop("checked", true);
			$('[name="residentFlag"]').attr('disabled',true);
			toggleRadioResidentFlag('N');
		}
	}
}
