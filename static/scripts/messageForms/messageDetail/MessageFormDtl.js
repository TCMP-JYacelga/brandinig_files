function showEditFieldPopup( recordData )
{
	$( "#fieldMandatory" ).removeAttr( 'readonly' );
	$( "#fieldMandatory" ).removeAttr( 'disabled' );
	$( "#fieldMandatory" ).removeClass( "disabled" );
	var fieldMandatory = recordData.fieldMandatory;
	isTypeChanged =false;
	if( null != fieldMandatory )
	{
		$( "#fieldMandatory" ).val( fieldMandatory );
		if( "Y" == fieldMandatory )
		{
			document.getElementById( "fieldMandatory" ).checked = true;
		}
		else if( "N" == fieldMandatory )
		{
			document.getElementById( "fieldMandatory" ).checked = false;
		}
	}

	$( "#fieldSequence,#fieldDisclaimerText" ).removeAttr( 'readonly' );
	$( "#fieldSequence,#fieldDisclaimerText" ).removeClass( "disabled" );
	$( "#fieldSequence" ).val( recordData.fieldSequence );

	$( "#fieldType" ).removeAttr( 'disabled' );
	$( "#fieldType" ).removeClass( "disabled" );
	$( "#fieldType" ).val( recordData.fieldType );

	/*
	 Following fields will be enabled on change of field type.
	*/
	$( "#fieldMinLength" ).attr( 'readonly', 'readonly' );
	$( "#fieldMinLength" ).addClass( "disabled" );
	$( "#fieldMaxLength" ).attr( 'readonly', 'readonly' );
	$( "#fieldMaxLength" ).addClass( "disabled" );
	$( "#fieldValueList" ).attr( 'readonly', 'readonly' );
	$( "#fieldValueList" ).addClass( "disabled" );
	$( "#fieldMinLength" ).val( recordData.fieldMinLength );
	$( "#fieldMaxLength" ).val( recordData.fieldMaxLength );
	$( "#fieldValueList" ).val( recordData.fieldValueList );
	$( "#fieldDisclaimerText" ).val( recordData.fieldDisclaimerText );
	$( "#fieldValueListDefVal" ).val( recordData.fieldValueListDefVal );
	//$( '#fieldName' ).removeAttr( 'readonly' );
	//$( "#fieldName" ).removeClass( "disabled" );
	//$( '#fieldName' ).val( recordData.fieldName );
	$("input[id=fieldName]").attr( 'readonly', 'readonly' );
	$("input[id=fieldName]").addClass( "disabled" );
	$("input[id=fieldName]").val( recordData.fieldName );

	/*
	 If it is already set then process it accordingly
	*/
	if( $( "#fieldType" ).val() == 8 )
	{
		$( "#fieldValueList, #fieldValueListDefVal" ).removeAttr( 'readonly' );
		$( "#fieldValueList, #fieldValueListDefVal" ).removeClass( "disabled" );
		
	} if($( "#fieldType" ).val() != 8 ){
		$( "#fieldValueListDefVal" ).attr( 'readonly' );
		$( "#fieldValueListDefVal" ).addClass( "disabled" );
	}
	else if( $( "#fieldType" ).val() == 1 || $( "#fieldType" ).val() == 2 )
	{
		$( "#fieldMinLength, #fieldMaxLength" ).removeAttr( 'readonly' );
		$( "#fieldMinLength, #fieldMaxLength" ).removeClass( "disabled" );
	}

	$( '#addNewField' ).dialog(
	{
		autoOpen : false,
		height : 'auto',
		width : 550,
		modal : true,
		title : 'Edit Form Field',
		buttons :
		{
			"Update" : function()
			{
			  var verify = verifyData();
			  if(!verify){ 
				var frm = document.getElementById( 'addMessageFieldsForm' );
				$( "#recViewState" ).val( recordData.recViewState );
				frm.action = "./updateMessageFormDtl.srvc";
				frm.target = "";
				frm.method = "POST";
				frm.submit();
			  }
			},
			"Cancel" : function()
			{
				$( this ).dialog( "close" );
			}
		}
	} );
	$( '#addNewField' ).dialog( "open" );
}//showAddNewFieldPopup

function showViewMessageFormDtl( recordData )
{
	$( "#fieldMandatory" ).attr( 'readonly', 'readonly' );
	$( "#fieldMandatory" ).addClass( "disabled" );
	$( "#fieldMandatory" ).attr( 'disabled', 'disabled' );
	var fieldMandatory = recordData.fieldMandatory;

	if( null != fieldMandatory )
	{
		$( "#fieldMandatory" ).val( fieldMandatory );
		if( "Y" == fieldMandatory )
		{
			document.getElementById( "fieldMandatory" ).checked = true;
		}
		else if( "N" == fieldMandatory )
		{
			document.getElementById( "fieldMandatory" ).checked = false;
		}
	}

	$( "#fieldSequence" ).attr( 'readonly', 'readonly' );
	$( "#fieldSequence" ).addClass( "disabled" );
	$( "#fieldSequence" ).val( recordData.fieldSequence );

	$( "#fieldType" ).attr( 'disabled', 'disabled' );
	$( "#fieldType" ).addClass( "disabled" );
	$( "#fieldType" ).val( recordData.fieldType );

	/*
	 Following fields will be enabled on change of field type.
	*/
	$( "#fieldMinLength,#fieldMaxLength,#fieldValueListDefVal,#fieldDisclaimerText" ).attr( 'readonly', 'readonly' );
	$( "#fieldMinLength,#fieldMaxLength,#fieldValueListDefVal,#fieldDisclaimerText" ).addClass( "disabled" );
	$( "#fieldValueList" ).attr( 'disabled', 'disabled' );
	$( "#fieldValueList" ).addClass( "disabled" );
	$( "#fieldMinLength" ).val( recordData.fieldMinLength );
	$( "#fieldMaxLength" ).val( recordData.fieldMaxLength );
	$( "#fieldDisclaimerText" ).val( recordData.fieldDisclaimerText );	
	$( "#fieldValueListDefVal" ).val( recordData.fieldValueListDefVal );
	$( "#fieldValueList" ).val( recordData.fieldValueList );

	//$( '#fieldName' ).removeAttr( 'readonly' );
	//$( "#fieldName" ).removeClass( "disabled" );
	//$( '#fieldName' ).val( recordData.fieldName );
	$("input[id=fieldName]").attr( 'readonly', 'readonly' );
	$("input[id=fieldName]").addClass( "disabled" );
	$("input[id=fieldName]").val( recordData.fieldName );

	/*$("#addMessageFieldsForm :input:not(:hidden)").attr('disabled','disabled');
	$("#addMessageFieldsForm :input:not(:hidden)").attr('readonly','readonly');
	$("#addMessageFieldsForm :input:not(:hidden)").addClass('disabled');*/
	$( '#addNewField' ).dialog(
	{
		autoOpen : false,
//		height : 380,
		height : 'auto',
		width : 550,
		modal : true,
		title : 'View Form Field',
		buttons :
		{
			"Close" : function()
			{
				$( this ).dialog( "close" );
			}
		}
	} );
	$( '#addNewField' ).dialog( "open" );
	if( $( "#fieldType" ).val() == 3 || $( "#fieldType" ).val() == 6 || $( "#fieldType" ).val() == 7 || $( "#fieldType" ).val() == 8  || $( "#fieldType" ).val() == 10)
		$( "#lblfieldMinLength,#lblfieldMaxLength" ).removeClass( "required" );
	else if( $( "#fieldType" ).val() == 1 || $( "#fieldType" ).val() == 2 || $( "#fieldType" ).val() == 5 || $( "#fieldType" ).val() == 9)
		$( "#lblfieldMinLength,#lblfieldMaxLength" ).addClass( 'frmLabel required' );
}// showViewMessageForm)

function deleteMessageFormDtl( recViewState )
{
	var frm = document.getElementById( "addMessageFieldsForm" );
	var viewState = document.getElementById( "viewStateFormField" );
	frm.action = "deleteMessageFormDtl.srvc";
	frm.appendChild(createFormField('INPUT', 'HIDDEN','ViewState', recViewState));
	frm.appendChild(createFormField('INPUT', 'HIDDEN','viewStateFormField', encodeURIComponent( viewState.value )));
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
