/**
 * 
 */
var dataFormDestination = new Array();
var dataFormUsers = new Array();

function showEditMessageForm( recViewState )
{
	var frm = document.getElementById( "frmMain" );
	frm.action = "showEditMessageForm.srvc" ;
	frm.appendChild(createFormField('INPUT', 'HIDDEN','viewState', recViewState));
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}// showEditMessageForm

function editMessageForm()
{
	$("#messageFormInfo").find('input').removeClass("disabled");
	$("#messageFormInfo").find('input').attr("disabled",false);
	
	var frm = document.getElementById( "frmMain" );
	frm.action = "./showEditMessageForm.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}// editMessageForm

function showViewMessageForm( recViewState )
{
	var frm = document.getElementById( "frmMain" );
	frm.action = "showViewMessageForm.srvc";
	frm.appendChild(createFormField('INPUT', 'HIDDEN','viewState', recViewState));
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}// showViewMessageForm

function showAddNewMessageForm(selectedSellerId,arrJsn)
{
	var frm = document.getElementById( "frmMain" );
	
	frm.action = "showAddNewMessageForm.srvc";
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'sellerId', selectedSellerId));
	frm.appendChild(createFormField('INPUT', 'HIDDEN','filterData', Ext.encode(arrJsn)));
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}// showAddNewMessageForm

function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function saveAndAddFormFields()
{
	var frm = document.getElementById( "frmMain" );
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//saveAndAddFormFields

function cancelSaveAndAddFormFields()
{
	var frm = document.getElementById( "frmMain" );
	frm.action = "showMessageFormMaster.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//cancelSaveAndAddFormFields

function updateFormFields()
{
	$("#messageFormInfo").find('input').addClass("enabled");
	$("#messageFormInfo").find('input').attr("disabled",false);
	$("#messageFormInfo").find('select').addClass("enabled");
	$("#messageFormInfo").find('select').attr("disabled",false);
	var frm = document.getElementById( "frmMain" );
	frm.action = "./updateMessageFormMst.srvc";
	frm.appendChild(createFormField('INPUT', 'HIDDEN','isNext', "N"));
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//updateFormFields

function getFromGroups( entitleSellerId )
{
	var counter  = null;
	
	if( entitleSellerId.value != '-1')
	{
		$.ajax(
			{
				url : "./getFormGroupDestinations.srvc",
				type : "GET",
				context : this,
				error : function()
				{
				},
				dataType : 'json',
				data :
				{
					entitleSellerId : entitleSellerId.value,
					
				},
				success : function( response )
				{
					$.each( response, function( key, val )
					{
						if( "FORM_GROUPS" == key )
						{
							counter = 0;
							$( '#formGroup' ).empty();
							$( '#formGroup' ).append( $( "<option></option>" ).attr( "value", -1 ).text( "Select" ) );
							$.each( val, function( key, val )
							{
								$( '#formGroup' ).append( $( "<option></option>" ).attr( "value", key ).text( val ) );
								counter ++;
							} );
							
							if( counter == 1 )
							{
								$("#formGroup option[value='-1']").remove();
							}
						}
						else if( "CUSTOM_EXTERNAL_WEB_RESOURCES" == key )
						{
							counter = 0;
							var value = $( '#customResourceID' ).val();
							$( '#customResourceID' ).empty();
							$( '#customResourceID' ).append( $( "<option></option>" ).attr( "value", -1 ).text( "Select" ) );
							$.each( val, function( key, val )
							{
								$( '#customResourceID' ).append( $( "<option></option>" ).attr( "value", key ).text( val ) );
								counter++;
							} );
							$( '#customResourceID' ).val(value);
							//if( counter == 1 )
							//{
								//$("#customResourceID option[value='-1']").remove();
							//}
						}
						else if( "BANK_EXTERNAL_WEB_RESOURCES" == key )
						{
							counter = 0;
							var value = $( '#bankInfoResourceID' ).val();
							$( '#bankInfoResourceID' ).empty();
							$( '#bankInfoResourceID' ).append( $( "<option></option>" ).attr( "value", -1 ).text( "Select" ) );
							$.each( val, function( key, val )
							{
								$( '#bankInfoResourceID' ).append( $( "<option></option>" ).attr( "value", key ).text( val ) );
								counter++;
							} );
							$( '#bankInfoResourceID' ).val(value);
							//if( counter == 1 )
							//{
								//$("#bankInfoResourceID option[value='-1']").remove();
							//}
						}
						/*else if( "FORM_DEST_ADMIN_USERS" == key || "FORM_DESTINATIONS" == key )
						{
							counter = 0;
							var value = $( '#formDestination' ).val();
							$( '#formDestination' ).empty();
							$( '#formDestination' ).append( $( "<option></option>" ).attr( "value", -1 ).text( "Select" ) );
							$.each( val, function( key, val )
							{
								$( '#formDestination' ).append( $( "<option></option>" ).attr( "value", key ).text( val ) );
								counter++;
							} );
							$( '#formDestination' ).val(value);
						}*/
						else if( "FORM_DEST_ADMIN_USERS" == key )
						{
							saveFormDestinationData(key, val);
						}
						else if( "FORM_DESTINATIONS" == key )
						{
							saveFormDestinationData(key, val);
						}
					} );
					populateFormDestinationData();
				}
			} );
	}	
	}// getFromGroups

function saveFormDestinationData(key, val)
{
	for(var item in val)
	{
		if("FORM_DEST_ADMIN_USERS" == key )
			dataFormUsers = val ;
		else
			dataFormDestination = val ;
	}
}

function populateFormDestinationData( )
{
	$( '#formDestination' ).empty();
	$( '#formDestination' ).append( $( "<option></option>" ).attr( "value", -1 ).text( "Select" ) );
	if(!(dataFormDestination.length === 0))
	{
		$( '#formDestination' ).append( $( "<option></option>" ).attr( "value", "destination" ).addClass('separator').text( "--Destinations--" ) );
		for(var key in dataFormDestination)
			$( '#formDestination' ).append( $( "<option></option>" ).attr( "value", key ).text( dataFormDestination[key]  ) );
	}
	if(!(dataFormUsers.length === 0))
	{
		$( '#formDestination' ).append( $( "<option></option>" ).attr( "value", "user" ).addClass('separator').text( "--Users--" ) );			
		var sortable = [];
		for(var key in dataFormUsers){
			if (dataFormUsers.hasOwnProperty(key) && dataFormUsers[key] != null && dataFormUsers[key] != ""){
				sortable.push({
					'key': key,
					'value': dataFormUsers[key]
				});
			}
		}
		/*sortable.sort(function(a, b) {
				  var nameA = a.value.toUpperCase(); // ignore upper and lowercase
				  var nameB = b.value.toUpperCase(); // ignore upper and lowercase
				  if (nameA < nameB) {
					return -1;
				  }
				  if (nameA > nameB) {
					return 1;
				  }
				  // names must be equal
				  return 0;
			})*/
		
		for(var i=0;i<sortable.length;i++)		
			$( '#formDestination' ).append( $( "<option></option>" ).attr( "value",  Object.keys(dataFormUsers[i]) ).text( dataFormUsers[i][Object.keys(dataFormUsers[i])]));			
	}
	dataFormDestination = null;
	dataFormUsers = null;
}

function clickElement(val)
{
	if( $('#formDestination option:selected').hasClass('separator') )
		$('#formDestination option:selected').next().attr('selected', 'selected');
}

function changeScreenType( screenType )
{
	if( null != screenType && 'undefined' != screenType )
	{
		$( "#customResourceID" ).attr( 'disabled', 'disabled' );
		$( "#customResourceID" ).addClass( "disabled" );
		$( "#bankInfoText" ).attr( 'readonly', true );
		$( "#bankInfoText" ).addClass( "disabled" );
		$( "#bankInfoResourceID" ).attr( 'disabled', 'disabled' );
		$( "#bankInfoResourceID" ).addClass( "disabled" );
		$( "#bankInfoType" ).attr( 'disabled', 'disabled' );
		$( "#bankInfoType" ).addClass( "disabled" );

		if( 0 == screenType.value ) // Free Form
		{
			$( "#customResourceID" ).val( '-1' );
			$( "#bankInfoText" ).val( '' );
			$( "#bankInfoResourceID" ).val( '-1' );
			$( "#bankInfoType" ).val( '-1' );
			$("#lblcustomResourceID").removeClass("required");
			$("#lblbankInfoType").removeClass("required");
			$("#lblBankInfoResourceID").removeClass("required");
			$("#lblBankInfoText").removeClass("required");
			
		}//if
		else if( 1 == screenType.value ) // Standard or Structured
		{
			$( "#bankInfoType" ).removeAttr( 'disabled', 'disabled' );
			$( "#bankInfoType" ).removeClass( 'disabled' );
			$("#lblbankInfoType").addClass("required");
			$("#lblcustomResourceID").removeClass("required");
			$( "#customResourceID" ).val( '-1' );
		}//else
		else if( 2 == screenType.value ) // Custom Screen
		{
			$( "#customResourceID" ).removeAttr( 'disabled', 'disabled' );
			$( "#customResourceID" ).removeClass( 'disabled' );
			$("#lblcustomResourceID").addClass("required");
			$( "#bankInfoText" ).attr( 'readonly', true );
			$( "#bankInfoText" ).addClass( "disabled" );
			$( "#bankInfoResourceID" ).attr( 'disabled', 'disabled' );
			$( "#bankInfoResourceID" ).addClass( "disabled" );
			$( "#bankInfoType" ).val( '-1' );
			$("#lblbankInfoType").removeClass("required");
			$( "#bankInfoResourceID" ).val( '-1' );
			$( "#bankInfoText" ).val('');
			$("#lblBankInfoResourceID").removeClass("required");
			$("#lblBankInfoText").removeClass("required");
		}//else
	}//if
}//changeScreenType

function changeBankInfoType( bankInfoType )
{
	if( null != bankInfoType && 'undefined' != bankInfoType )
	{
		$( "#bankInfoText" ).attr( 'readonly', true );
		$( "#bankInfoText" ).addClass( "disabled" );
		$( "#bankInfoResourceID" ).attr( 'disabled', 'disabled' );
		$( "#bankInfoResourceID" ).addClass( "disabled" );
		$( "#lblBankInfoResourceID" ).removeClass( "required" );
		$( "#lblBankInfoText").removeClass( "required" );
		$( "#bankInfoResourceID" ).val( '-1' );
		$( "#bankInfoText" ).val('');

		if( 2 == bankInfoType.value ) //Text
		{
			$( "#bankInfoText" ).removeAttr( 'readonly' );
			$( "#bankInfoText" ).removeClass( 'disabled' );
			$( "#lblBankInfoResourceID" ).removeClass( "required" );
			$( "#lblBankInfoText" ).addClass( "required" );
			$( "#bankInfoResourceID" ).val( '-1' );
		}
		else if( 3 == bankInfoType.value )// Html type
		{
			$( "#bankInfoText" ).attr( 'readonly', true );
			$( "#bankInfoText" ).addClass( "disabled" );
			$( "#bankInfoResourceID" ).removeAttr( 'disabled', 'disabled' );
			$( "#bankInfoResourceID" ).removeClass( 'disabled' );
			$( "#lblBankInfoResourceID" ).addClass( "required" );
			$( "#lblBankInfoText" ).removeClass( "required" );
			$( "#bankInfoText" ).val('');
		}
	}//if
}//changeBankInfoType

function isEmpty(strValue) {
	return (strValue == null || strValue == undefined || strValue.length == 0);
	}
	function hideErrorPanel(errorDivId){
		if($(errorDivId).is(':visible')){
			$(errorDivId).addClass('ui-helper-hidden');
		}
	}
	function paintError(errorDiv,errorMsgDiv,errorMsg){
		if(!$(errorDiv).is(':visible')){
			$(errorDiv).removeClass('ui-helper-hidden');
		}
		element = $('<li class="error-msg-color">').text(errorMsg);
		//$(errorMsgDiv).text(errorMsg);
		element.appendTo(errorDiv);
	}
	function verifyData(){
		var paintErMsg = false;
		$('#advancedFilterErrorDiv').empty();
		$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
		if(isEmpty($( "#fieldName" ).val())){
			paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter Field Name');
			paintErMsg = true;
		}
		if(isEmpty($( "#fieldSequence" ).val())){
			paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter Field Sequence');
			paintErMsg = true;
		}
		if(isEmpty($( "#fieldType" ).val()) || $( "#fieldType" ).val() == -1){
			paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter Field Type');
			paintErMsg = true;
		}
		if(!isEmpty($( "#fieldType" ).val()) && $( "#fieldType" ).val() == 1 || !isEmpty($( "#fieldType" ).val()) && $( "#fieldType" ).val() == 5 || $( "#fieldType" ).val() == 9){			
			if(isEmpty($( "#fieldMinLength" ).val())||( parseInt($( "#fieldMinLength" ).val(),10)== 0)){
				paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Field Min Length value should be greater than 0');
				paintErMsg = true;
			}if(isEmpty($( "#fieldMaxLength" ).val())||( parseInt($( "#fieldMaxLength" ).val(),10)== 0)){
				paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Field Max Length value should be greater than 0');
				paintErMsg = true;
			}if(parseInt($( "#fieldMaxLength" ).val(),10) < parseInt($( "#fieldMinLength" ).val(),10)){
				 paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Field Min Length Cannot be greater than Field Max Length');
				 paintErMsg = true;			 
				}
			
			else{
				if($( "#fieldMaxLength" ).val() > 40){
				 paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Field Max Length Cannot be greater than 40');
				 paintErMsg = true;			 
				}
			}
		}
		if(!isEmpty($( "#fieldType" ).val()) && $( "#fieldType" ).val() == 2){
			if(isEmpty($( "#fieldMinLength" ).val())){
				paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter Field Min Length');
				paintErMsg = true;
			}if(isEmpty($( "#fieldMaxLength" ).val())){
				paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter Field Max Length');
				paintErMsg = true;
			}if(parseInt($( "#fieldMaxLength" ).val(),10) < parseInt($( "#fieldMinLength" ).val(),10)){
				 paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Field Min Length Cannot be greater than Field Max Length');
				 paintErMsg = true;			 
				}
			else{
				if($( "#fieldMaxLength" ).val() > 255){
				 paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Field Max Length Cannot be greater than 255');
				 paintErMsg = true;			 
				}
			}
		}
		/*if(!isEmpty($( "#fieldType" ).val()) && $( "#fieldType" ).val() == 3){
			if(isEmpty($( "#fieldLength" ).val())){
				paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter Field Length');
				paintErMsg = true;
			}else{
				if($( "#fieldLength" ).val() > 40){
				 paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter Field Length');
				 paintErMsg = true;			 
				}
			}
		}*/		
		if(!isEmpty($( "#fieldType" ).val()) && $( "#fieldType" ).val() == 6){
			if(isEmpty($( "#fieldValueList" ).val())){
				paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter Field Value List');
				paintErMsg = true;
			}else{
				if($( "#fieldValueList" ).val() > 40){
				 paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter Field Value List');
				 paintErMsg = true;			 
				}
			}
		}
		if(!isEmpty($( "#fieldType" ).val()) && $( "#fieldType" ).val() == 7){
			if(isEmpty($( "#fieldValueList" ).val())){
				paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter Field Value List');
				paintErMsg = true;
			}else{
				if($( "#fieldValueList" ).val() > 40){
				 paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter Field Value List');
				 paintErMsg = true;			 
				}
			}
		}
		if(!isEmpty($( "#fieldType" ).val()) && $( "#fieldType" ).val() == 8){
			if(isEmpty($( "#fieldValueList" ).val())){
				paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter Field Value List');
				paintErMsg = true;
			}else{
				if($( "#fieldValueList" ).val() > 40){
				 paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter Field Value List');
				 paintErMsg = true;			 
				}
			}
			if(parseInt($( "#fieldValueListDefVal" ).val(),10) == 0){
				 paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Default Position Value Should be greater then 0');
				 paintErMsg = true;		
			}
		}
		if(!isEmpty($( "#fieldType" ).val()) && $( "#fieldType" ).val() == 9 && parseInt($( "#fieldMaxLength" ).val(),10)>13){
				 paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Amount Max Length Should not be greater then 13');
				 paintErMsg = true;	
		}
		if(!Ext.isEmpty($( "#fieldValueList" ).val())) {
			var commaSeparatedValues = $( "#fieldValueList" ).val().split(','),temp;
			$( "#fieldValueList" ).val('');
			for(var i=0;i<commaSeparatedValues.length;i++) {
				var trimmedData = commaSeparatedValues[i].trim();
				if(Ext.isEmpty($( "#fieldValueList" ).val())) {
					temp = trimmedData;
				} else {
					temp = $( "#fieldValueList" ).val() + "," + trimmedData;
				}
				$( "#fieldValueList" ).val(temp);
			}
		}
		
		return paintErMsg;
	}
function showAddNewFieldPopup()
{
	$('#advancedFilterErrorDiv').empty();
	$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
	$( "#fieldName" ).removeAttr( 'readonly' );
	$( "#fieldName" ).removeClass( 'disabled' );
	$( "#fieldName" ).val( '' );

	$( "#fieldMandatory" ).removeAttr( 'readonly' );
	$( "#fieldMandatory" ).removeClass( 'disabled' );
	$( "#fieldMandatory" ).val( 'N' );
	$( "#fieldMandatory" ).attr('checked',false)

	$( "#fieldSequence , #fieldDisclaimerText" ).removeAttr( 'readonly' );
	$( "#fieldSequence , #fieldDisclaimerText" ).removeClass( 'disabled' );
	$( "#fieldSequence" ).val( '' );

	$( "#fieldType" ).removeAttr( 'disabled' );
	$( "#fieldType" ).removeClass( 'disabled' );
	$( "#fieldType" ).val( '-1' );
	
	$( "#lblfieldValueList" ).removeClass( "required" );
	$( "#lblfieldLength" ).removeClass( "required" );
	
	/*
	 Following fields will be enabled on change of field type.
	*/
	$( "#fieldMinLength, #fieldMaxLength, #fieldValueListDefVal" ).attr( 'readonly', 'readonly' );
	$( "#fieldMinLength, #fieldMaxLength, #fieldValueListDefVal" ).addClass( "disabled" );
	$( "#lblfieldMinLength,#lblfieldMaxLength" ).removeClass( "required" );
	$( "#fieldValueList" ).attr( 'readonly', 'readonly' );
	$( "#fieldValueList" ).addClass( "disabled" );
	$( "#fieldMinLength, #fieldMaxLength" ).val( '' );
	$( "#fieldValueList, #fieldValueListDefVal, #fieldDisclaimerText" ).val( '' );
	var buttonsOpts = {};
	buttonsOpts[getLabel('btnSave','Save')] = function()
	{
				var verify = verifyData();
				if(!verify){
					var frm = document.getElementById( 'addMessageFieldsForm' );
					frm.action = "./saveMessageFormDtl.srvc";
					frm.target = "";
					frm.method = "POST";
					frm.submit();
				}
	}
	
	buttonsOpts[getLabel('cancel','Cancel')] = function()
			{
				$( this ).dialog( "close" );
			}

	isTypeChanged = null;
	$( '#addNewField' ).dialog(
	{
		autoOpen : false,
		//height : 380,
		height : 'auto',
		width : 550,
		modal : true,
		title : getLabel('newFormField', 'Add New Form Field'),
		buttons :buttonsOpts
		
	} );
	$( '#addNewField' ).dialog( "open" );
	if(isErrorExists)
		setOldValuesOnValidationErrorForDetailEntry();
}//showAddNewFieldPopup

function changeFieldType( fieldType )
{
	/*$( "#fieldValueList" ).attr( 'readonly', 'readonly' );
	$( "#fieldValueList" ).addClass( "disabled" );
	$( "#lblfieldValueList" ).removeClass( "required" );	
	$( "#fieldLength" ).attr( 'readonly', 'readonly' );
	$( "#fieldLength" ).addClass( "disabled" );
	$( "#fieldLength" ).val( '' );*/
	$('#advancedFilterErrorDiv').empty();
	$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
	if( $( "#fieldType" ).val() == 8 || $( "#fieldType" ).val() == 7 || $( "#fieldType" ).val() == 6)
	{
		$( "#fieldValueList" ).removeAttr( 'readonly' );
		$( "#fieldValueList" ).removeClass( 'disabled' );
		$( "#lblfieldValueList" ).addClass( 'frmLabel required' );
		$( "#fieldMinLength,#fieldMaxLength" ).attr( 'readonly', 'readonly' );
		$( "#fieldMinLength,#fieldMaxLength" ).addClass( "disabled" );
		$( "#fieldMinLength,#fieldMaxLength" ).val( '' );
		$( "#lblfieldMinLength,#lblfieldMaxLength" ).removeClass( "required" );
	}
	else if( $( "#fieldType" ).val() == 1 || $( "#fieldType" ).val() == 2 || $( "#fieldType" ).val() == 5 || $( "#fieldType" ).val() == 9)
	{
		$( "#fieldMinLength,#fieldMaxLength" ).removeAttr( 'readonly' );
		$( "#fieldMinLength,#fieldMaxLength" ).removeClass( 'disabled' );
		$( "#lblfieldMinLength,#lblfieldMaxLength" ).addClass( 'frmLabel required' );		
		$( "#fieldValueList, #fieldValueListDefVal" ).attr( 'readonly', 'readonly' );
		$( "#fieldValueList, #fieldValueListDefVal" ).addClass( "disabled" );
		$( "#fieldValueList, #fieldValueListDefVal" ).val( '' );
		$( "#lblfieldValueList" ).removeClass( "required" );
		$("#fieldMinLength,#fieldMaxLength").val('');
		if($( "#fieldType" ).val() == 1){
			$("#fieldMinLength,#fieldMaxLength").attr('maxlength',2);
			$("#tokenLength").val(40);
		}else if($( "#fieldType" ).val() == 2){
			$("#fieldMinLength,#fieldMaxLength").attr('maxlength',3);
			$("#tokenLength").val(255);
		}else if($( "#fieldType" ).val() == 5){
			$("#fieldMinLength,#fieldMaxLength").attr('maxlength',2);
			$("#tokenLength").val(40);
		}else if($( "#fieldType" ).val() == 9){
			$("#fieldMinLength,#fieldMaxLength").attr('maxlength',2);
			$("#tokenLength").val(13);
		}			
	}
	if($( "#fieldType" ).val() == 6 ){
		$("#fieldValueList").attr('maxlength',79);
		$("#tokenLength").val(15);
		$("#countOfTokens").val(4);
	}
	if( $( "#fieldType" ).val() == 7){
		$("#fieldValueList").attr('maxlength',255);
		$("#tokenLength").val(255);
		$("#countOfTokens").val(5);
	}	
	if($( "#fieldType" ).val() == 8){
		$("#fieldValueList").attr('maxlength',909);
		$("#fieldValueListDefVal").removeClass( 'disabled' );
		$("#fieldValueListDefVal").removeAttr( 'readonly' );
		$("#tokenLength").val(90);
		$("#countOfTokens").val(9);
	} if($( "#fieldType" ).val() != 8){
		$( "#fieldValueListDefVal" ).attr( 'readonly', 'readonly' );
		$( "#fieldValueListDefVal" ).addClass( "disabled" );
	}
	if($( "#fieldType" ).val() == 3 || $( "#fieldType" ).val() == 10){
		$( "#fieldMinLength,#fieldMaxLength" ).attr( 'readonly', 'readonly' );
		$( "#fieldMinLength,#fieldMaxLength" ).addClass( "disabled" );
		$( "#fieldMinLength,#fieldMaxLength" ).val( '' );
		$( "#lblfieldMinLength,#lblfieldMaxLength" ).removeClass( "required" );
		
		$( "#fieldValueList, #fieldValueListDefVal" ).attr( 'readonly', 'readonly' );
		$( "#fieldValueList, #fieldValueListDefVal" ).addClass( "disabled" );
		$( "#fieldValueList, #fieldValueListDefVal" ).val( '' );
		$( "#lblfieldValueList" ).removeClass( "required" );
		
		$("#fieldMinLength,#fieldMaxLength").attr('maxlength',2);
		$("#tokenLength").val(40);
	}
	if($( "#fieldType" ).val() == 10 && isEmpty($("#fieldDisclaimerText" ).val())){
		    $("#fieldDisclaimerText" ).attr( 'readonly','readonly'  );
	        $("#fieldDisclaimerText" ).addClass( "disabled" );
	    	$("#fieldDisclaimerText" ).val( 'Max File size is 5 MB' );
	}else if (isTypeChanged && !isEmpty($("#fieldDisclaimerText" ).val())){
		$("#fieldDisclaimerText" ).val(''); 
	}
}

function isNumeric( event, ctrl )
{
	// allows numbers,backspace, tab
	var keycode = event.which || event.keyCode;
	if( ( keycode >= 48 && keycode <= 57 ) || keycode == 8 || keycode == 9 )
		return true;
	return false;
}

function isNumberKey( type,ch, ctrl )
{
	// allows numbers,backspace, tab
	/*var keycode = event.which || event.keyCode;
	if( ( keycode >= 48 && keycode <= 57 ) || keycode == 8 || keycode == 9 ){
		return true;
	}*/	
	var fieldValue = ctrl.value.trim();	
	fieldValue = fieldValue + ch;
	var validCharacters = /^[0-9]+$/;
	bool = validateValidCharacters(type,fieldValue, validCharacters)
	if(bool == false){
		if(type == 2){
			fieldValue = "";
		}
		return bool;
	}	
	var maxValue = $("#tokenLength").val();
	if(ctrl.id === "fieldSequence"){
		   maxValue = 999;
	}	
	if(Number(fieldValue) > Number(maxValue)){
		if(type == 2){
			ctrl.value = "";
		}
		return false;
	}
	//return false;
}

function keyPressEventHandler(E){
	var ReturnValue = String.fromCharCode(E.which || E.keyCode);
	return ReturnValue;
}			
function validateLength(type, fieldValue, length){
	if(fieldValue.length > length){
		if(type == 2){
			field.value = "";
		}
		return false;
	}
	return true;
}

function validateValidCharacters(type, fieldValue, validCharacters)
{
	if(fieldValue == "")
	{
		return;
	}

	var RE = new RegExp(validCharacters);
	var ReturnValue = RE.exec(fieldValue)
	if(ReturnValue == null){
		if(type == 2){
			fieldValue = "";
		}
		return false;
	}
	return true;
}

function validateCountOfTokens(type, fieldValue, field, countOfTokens, separator, tokenLength)
{
	var ReturnValue = fieldValue.split(separator);
	var tokenizedCountOfTokens = ReturnValue.length;
	if((tokenizedCountOfTokens < 0) || (tokenizedCountOfTokens > (parseInt(countOfTokens,10) + parseInt(1,10)))){
		return false;
	}

	for(i = 0;i < tokenizedCountOfTokens;i++){
		if((i == (tokenizedCountOfTokens - 1)) && (ReturnValue[i] == "")){
			if(type == 1){
				continue;
			}
			else if(type == 2){
				field.value = fieldValue.substr(0, (fieldValue.length - 1));
				continue;
			}
		}
		if(ReturnValue[i].length > tokenLength){
			if(type == 2){
				field.value = "";
			}
			return false;
		}

		if((ReturnValue[i]) == ""){
			if(type == 2){
				field.value = "";
			}
			return false;
		}
	}
	return true;
}

function validateField(type, ch, field,separator){

	var bool = false;
	var validCharacters = /^[a-zA-Z0-9, ]+$/;
	var countOfTokens = $("#countOfTokens").val();
	var tokenLength = $("#tokenLength").val();
	//var fieldValue = field.value.trim();
	var fieldValue = field.value;
	if(((fieldValue.length == 0) || ((fieldValue.charAt((fieldValue.length - 1)) == separator))) && (ch == separator)){		
		return false;
	}

	fieldValue = fieldValue + ch;

	//bool = validateLength(type, fieldValue, tokenLength);
	/*if(bool == false){		
		return bool;
	}*/

	bool = validateValidCharacters(type, fieldValue, validCharacters)
	if(bool == false){		
		return bool;
	}

	bool = validateCountOfTokens(type, fieldValue, field, countOfTokens, separator, tokenLength);
	if(bool == false){		
		return bool;
	}
	
	if(field.id =="fieldValueListDefVal" && fieldValue > 10){
		return false;
	}
	//field.value = field.value.trim();
	return true;
}
function changeFieldMandatory( fieldMandatory )
{
	if( true == fieldMandatory.checked )
	{
		fieldMandatory.value = 'Y';
	}
	else
	{
		fieldMandatory.value = 'N';
	}
}

function changeFormType( formType )
{
	if( true == formType.checked )
	{
		formType.value = 'A';
	}
	else
	{
		formType.value = 'N';
	}
}
function verifyMessageForm()
{
	$("#messageFormInfo").find('select').addClass("enabled");
	$("#messageFormInfo").find('select').attr("disabled",false);
	
	var frm = document.getElementById( "frmMain" );
	frm.action = "./updateMessageFormMst.srvc";
	frm.appendChild(createFormField('INPUT', 'HIDDEN','isNext', "Y"));
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function submitMessageForm(strUrl)
{
	$("#messageFormInfo").find('input').addClass("enabled");
	$("#messageFormInfo").find('input').attr("disabled",false);
	$("#messageFormInfo").find('select').addClass("enabled");
	$("#messageFormInfo").find('select').attr("disabled",false);
	$("#messageFormInfo").find('textarea').addClass("enabled");
	$("#messageFormInfo").find('textarea').attr("disabled",false);
	var frm = document.getElementById( "frmMain" );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


jQuery.fn.carbonCopyAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/carbonCopySeek.json?$carbonCopyDesc="+$('#carbonCopyDesc').val()+"&$sellerId="+$('#sellerId').val(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data;
										response($.map(rec, function(item) {
													var strKey = Object.keys(item);
													return {														
														value : strKey,
														label : item[strKey], 
														company : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.company;
						if (data) {
							if (!isEmpty(Object.keys(data)))
							{
								$('#carbonCopyTo').val(Object.keys(data));
								$('#carbonCopyDesc').val(data[Object.keys(data)]);
							}
						}
						event.preventDefault();
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

function showPreviewPopup()
{
	$( '#previewPopup' ).dialog(
			{
				autoOpen : false,
				height : 550,
				width : 825,
				modal : true,
				buttons :
				{
					"OK" : function()
					{
						$( this ).dialog( "close" );
					}
				}
			} );
			$( '#previewPopup' ).dialog( "open" );	
}
