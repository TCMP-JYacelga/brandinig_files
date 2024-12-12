var toMovResList1 = new Array( 3 );
var toMovResList2 = new Array( 2 );
var toMovResList3 = new Array( 1 );
var selectedToMovItem;

function showList( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showAddNewForm( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function saveRecord( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showHistoryForm( strUrl, index )
{
	var intTop = ( screen.availHeight - 300 ) / 2;
	var intLeft = ( screen.availWidth - 400 ) / 2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms[ "frmMain" ];
	document.getElementById( "updateIndex" ).value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open( "", "hWinHistory", strAttr );
	frm.submit();
}

function showViewForm( strUrl, index )
{
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "updateIndex" ).value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm( strUrl, index )
{
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "updateIndex" ).value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function validateAgreement( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function submitForAuthAgreement( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecordList( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	if( document.getElementById( "updateIndex" ).value == "" )
	{
		alert( "Select Atlease One Record" )
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function disableRecordList( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	if( document.getElementById( "updateIndex" ).value == "" )
	{
		alert( "Select Atlease One Record" )
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord( me, strUrl )
{
	if( me.className.startsWith( "imagelink grey" ) )
		return;
	var frm = document.forms[ "frmMain" ];
	if( document.getElementById( "updateIndex" ).value == "" )
	{
		alert( "Select Atlease One Record" )
		return;
	}
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function getRejectRecord( me, rejTitle, rejMsg, strUrl )
{
	var temp = document.getElementById( "btnReject" );
	if( temp.className.startsWith( "imagelink grey" ) )
		return;
	if( document.getElementById( "updateIndex" ).value == "" )
	{
		alert( "Select Atlease One Record" )
		return;
	}
	getRemarks( 230, rejTitle, rejMsg, strUrl, rejectRecord );
}

function rejectRecord( arrData, strRemarks, strUrl )
{
	var frm = document.forms[ "frmMain" ];

	if( strRemarks.length > 255 )
	{
		alert( "Reject Remarks Length Cannot Be Greater than 255 Characters!" );
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.target = "";
		frm.action = arrData;
		frm.method = 'POST';
		frm.submit();
	}
}

function deleteList( me, strUrl )
{
	var temp = document.getElementById( "btnDiscard" );
	if( temp.className.startsWith( "imagelink grey" ) )
		return;
	if( document.getElementById( "updateIndex" ).value == "" )
	{
		alert( "Select Atlease One Record" );
		return;
	}
	deleteRecord( document.getElementById( "updateIndex" ).value, strUrl );
}

function deleteRecord( arrData, strUrl )
{
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "txtIndex" ).value = arrData;
	frm.target = "";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

// List navigation
function prevPage( strUrl, intPg )
{
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "txtCurrent" ).value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function nextPage( strUrl, intPg )
{
	document.getElementById( "txtCurrent" ).value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function selectRecord( ctrl, status, index, maker )
{
	var strAuthIndex = document.getElementById( "updateIndex" ).value;
	var strActionMap = document.getElementById( "actionmap" ).value;
	if( index.length < 2 )
	{
		index = '0' + index;
	}
	var aPosition = strAuthIndex.indexOf( index );
	var mapPosition;
	var strCurrentAction;
	var strDelimAction;
	var lenDelimAction;
	var strArrSplitAction;
	var strFinalBitmap = document.getElementById( "bitmapval" ).value;
	var lenLooplen;
	if( aPosition >= 0 )
	{
		document.getElementById( "updateIndex" ).value = strAuthIndex.replace(
				strAuthIndex.substring( aPosition, aPosition + 2 ), "" );
		mapPosition = strActionMap.indexOf( index + ":" );
		document.getElementById( "actionmap" ).value = strActionMap.replace(
				strActionMap.substring( mapPosition, mapPosition + 7 ), "" );
	}
	else
	{
		document.getElementById( "updateIndex" ).value = index + ","
				+ document.getElementById( "updateIndex" ).value;
		strCurrentAction = arrActionMap[ status ];
		document.getElementById( "actionmap" ).value = index + ":"
				+ strCurrentAction + ","
				+ document.getElementById( "actionmap" ).value;
	}
	if( ctrl.className.indexOf( "acceptlink" ) > -1 )
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}
	// perform the operation of bitwise anding
	lenDelimAction = document.getElementById( "actionmap" ).value.length;
	if( lenDelimAction > 1 )
	{
		strDelimAction = document.getElementById( "actionmap" ).value;
		strDelimAction = strDelimAction.substring( 0, lenDelimAction - 1 );
		strArrSplitAction = strDelimAction.split( "," );
		for( var i = 0 ; i < strArrSplitAction.length ; i++ )
		{
			strArrSplitAction[ i ] = strArrSplitAction[ i ]
					.substring( strArrSplitAction[ i ].indexOf( ":" ) + 1 );
		}

		if( strArrSplitAction.length == 1 )
		{
			strFinalBitmap = strArrSplitAction[ 0 ];
		}
		else
		{
			lenLooplen = strArrSplitAction.length - 1;
			for( var j = 0 ; j < lenLooplen ; j++ )
			{
				if( j == 0 )
				{
					strFinalBitmap = performAnd( strArrSplitAction[ j ],
							strArrSplitAction[ j + 1 ] );
				}
				else
				{
					strFinalBitmap = performAnd( strFinalBitmap,
							strArrSplitAction[ j + 1 ] );
				}
			}
		}
		document.getElementById( "bitmapval" ).value = strFinalBitmap;
		refreshButtons( maker );
	}
	else
	{
		strFinalBitmap = _strValidActions;
		document.getElementById( "bitmapval" ).value = strFinalBitmap;
		refreshButtons( maker );
	}
}

function performAnd( validAction, currentAction )
{
	var strOut = "";
	var i = 0;
	if( validAction.length = currentAction.length )
	{
		for( i = 0 ; i < 5 ; i++ )
		{
			strOut = strOut
					+ ( ( validAction.charAt( i ) * 1 ) && ( currentAction
							.charAt( i ) * 1 ) );
		}
	}
	return strOut;
}

function refreshButtons( maker )
{
	var strPopultedButtons = document.getElementById( "bitmapval" ).value;
	var strActionButtons;
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd( strPopultedButtons, _strServerBitmap );
	// alert('the final bitmap::' + strActionButtons);
	var i = 0;
	if( strActionButtons.length > 0 )
	{
		for( i = 0 ; i < 5 ; i++ )
		{
			switch( i )
			{
				case 0:
					if( strActionButtons.charAt( i ) * 1 == 1
							&& maker != _strUserCode )
					{
						document.getElementById( "btnAuth" ).className = "imagelink black inline_block button-icon icon-button-accept font_bold";
					}
					else
					{
						document.getElementById( "btnAuth" ).className = "imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
					}
					break;

				case 1:
					if( strActionButtons.charAt( i ) * 1 == 1
							&& maker != _strUserCode )
					{
						document.getElementById( "btnReject" ).className = "imagelink black inline_block button-icon icon-button-reject font_bold";
					}
					else
					{
						document.getElementById( "btnReject" ).className = "imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
					}
					break;

				case 2:
					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnEnable" ).className = "imagelink black inline_block button-icon icon-button-enable font_bold";
					}
					else
					{
						document.getElementById( "btnEnable" ).className = "imagelink grey inline_block button-icon icon-button-enable-grey font-bold";
					}
					break;

				case 3:
					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnDisable" ).className = "imagelink black inline_block button-icon icon-button-disable font_bold";
					}
					else
					{
						document.getElementById( "btnDisable" ).className = "imagelink grey inline_block button-icon icon-button-disable-grey font-bold";
					}
					break;

				case 4:
					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnDiscard" ).className = "imagelink black inline_block button-icon icon-button-discard font_bold";
					}
					else
					{
						document.getElementById( "btnDiscard" ).className = "imagelink grey inline_block button-icon icon-button-discard-grey font-bold";
					}
					break;
			}
		}
	}
}

function checkMasterAccount( me )
{
	//var incomeSharing = document.getElementById( 'incomeSharing' );
	if( me.checked == true )
	{
		//document.getElementById( 'masterAccountNmbrLbl' ).style.visibility = "visible";
		//document.getElementById( 'masterAccountNmbr' ).style.visibility = "visible";
		//if( document.getElementById( 'masterAccountIdSeek' ) )
		//	document.getElementById( 'masterAccountIdSeek' ).style.visibility = "visible";
	}
	else
	{
		//document.getElementById( 'masterAccountNmbrLbl' ).style.visibility = "hidden";
		//document.getElementById( 'masterAccountNmbr' ).style.visibility = "hidden";
		//if( document.getElementById( 'masterAccountIdSeek' ) )
		//	document.getElementById( 'masterAccountIdSeek' ).style.visibility = "hidden";
	}
}

function setAgreementCcy( me )
{
	if( me )
	{
		if( me.value == 'M' )
		{
			document.getElementById( 'agreementCurrencyLbl' ).style.visibility = "hidden";
			document.getElementById( 'agreementCurrency' ).value = "";
			document.getElementById( 'agreementCurrency' ).style.visibility = "hidden";
			if( document.getElementById( 'agreementCurrencySeek' ) )
				document.getElementById( 'agreementCurrencySeek' ).style.visibility = "hidden";

			document.getElementById( 'multiLevelFdLbl' ).style.visibility = "hidden";
			document.getElementById( 'multiLevelFd' ).value = "N";
			document.getElementById( 'multiLevelFd' ).checked = false;
			document.getElementById( 'multiLevelFd' ).style.visibility = "hidden";

			document.getElementById( 'incomeSharingLbl' ).style.visibility = "hidden";
			document.getElementById( 'incomeSharing' ).style.visibility = "hidden";
			document.getElementById( 'incomeSharing' ).value = "N";
			document.getElementById( 'incomeSharing' ).checked = false;

			document.getElementById( 'benefitAllocationMethodLabel' ).style.visibility = "hidden";
			document.getElementById( 'benefitAllocMethod' ).style.visibility = "hidden";
			document.getElementById( 'benefitAllocMethod' ).value = "N";
		}
		else if( me.value == 'S' )
		{
			document.getElementById( 'agreementCurrencyLbl' ).style.visibility = "visible";
			document.getElementById( 'agreementCurrency' ).readOnly = true;
			document.getElementById( 'agreementCurrency' ).style.visibility = "visible";
			if( document.getElementById( 'agreementCurrencySeek' ) )
				document.getElementById( 'agreementCurrencySeek' ).style.visibility = "visible";

			document.getElementById( 'multiLevelFdLbl' ).style.visibility = "visible";
			document.getElementById( 'multiLevelFd' ).style.visibility = "visible";

			document.getElementById( 'incomeSharingLbl' ).style.visibility = "visible";
			document.getElementById( 'incomeSharing' ).style.visibility = "visible";

			if( document.getElementById( 'incomeSharing' ).checked == true )
			{
				document.getElementById( 'benefitAllocationMethodLabel' ).style.visibility = "visible";
				document.getElementById( 'benefitAllocMethod' ).style.visibility = "visible";
			}
			else
			{
				document.getElementById( 'benefitAllocationMethodLabel' ).style.visibility = "hidden";
				document.getElementById( 'benefitAllocMethod' ).style.visibility = "hidden";
			}
		}
		checkMasterAccount( document.getElementById( 'multiLevelFd' ) );
	}
}
function onClickIncomeSharing( me )
{
	if( me )
	{
		if( me.checked == true )
		{
			document.getElementById( 'benefitAllocationMethodLabel' ).style.visibility = "visible";
			document.getElementById( 'benefitAllocMethod' ).style.visibility = "visible";
		}
		else
		{
			document.getElementById( 'benefitAllocationMethodLabel' ).style.visibility = "hidden";
			document.getElementById( 'benefitAllocMethod' ).style.visibility = "hidden";
			document.getElementById( 'benefitAllocMethod' ).value = "N";
		}
	}
	checkMasterAccount( document.getElementById( 'multiLevelFd' ) );
}
function setBenefitReAllocation( me )
{
	if( me.value == 'N' )
	{
		document.getElementById( 'partOfHybrid' ).style.visibility = "visible";
		document.getElementById( 'partOfHybridLbl' ).style.visibility = "visible";
	}
	else
	{
		document.getElementById( 'partOfHybrid' ).value = "N";
		document.getElementById( 'partOfHybrid' ).checked = false;
		document.getElementById( 'partOfHybrid' ).style.visibility = "hidden";
		document.getElementById( 'partOfHybridLbl' ).style.visibility = "hidden";
	}
}
function checkAllowOndemand( me )
{
	if( me.checked == true )
	{
		document.getElementById( 'partOfHybrid' ).value = "N";
		document.getElementById( 'partOfHybrid' ).checked = false;
	}
}

function checkPartOfHybrid( me )
{
	if( me.checked == true )
	{
		document.getElementById( 'allowOndemand' ).value = "N";
		document.getElementById( 'allowOndemand' ).checked = false;
	}
}

// Details
function addDetail( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function saveDetailRecord( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	enableFileldsToSave();
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function enableFileldsToSave()
{
	$("#frmMain").find('input').addClass("enabled");
	$("#frmMain").find('input').attr("disabled",false);
	$("#frmMain").find('select').addClass("enabled");
	$("#frmMain").find('select').attr("disabled",false);
}

function removeRecord( strUrl, method )
{
	if( document.getElementById( "txtIndex" ).value == "" )
	{
		alert( "Select Atlease One Record" )
		return;
	}
	if( document.getElementById( "txtIndex" ).value.length >= 0 )
	{
		showAlert( strConfMessage, null, [ strUrl ], method );
	}
}
function deleteDetail( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm( strUrl, index )
{
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "txtIndex" ).value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm( strUrl, index )
{
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "txtIndex" ).value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function selectDetailRecord( ctrl, index )
{
	var strDetailIndex = document.getElementById( "txtIndex" ).value;
	if( index.length < 2 )
	{
		index = '0' + index;
	}
	var aPosition = strDetailIndex.indexOf( index );
	if( aPosition >= 0 )
	{
		document.getElementById( "txtIndex" ).value = strDetailIndex.replace(
				strDetailIndex.substring( aPosition, aPosition + 3 ), "" );
	}
	else
	{
		document.getElementById( "txtIndex" ).value = index + ","
				+ strDetailIndex;
	}
	if( ctrl.className.indexOf( "acceptlink" ) > -1 )
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}
	var removeInstr = document.getElementById( "removeInstr" );
	if( document.getElementById( "txtIndex" ).value.length > 0 )
	{
		removeInstr.disabled = false;
	}
	else
	{
		removeInstr.disabled = true;
	}
}

function getRecord( json, elementId, fptrCallback )
{
	var myJSONObject = JSON.parse( json );
	var inputIdArray = elementId.split( "|" );

	for( i = 0 ; i < inputIdArray.length ; i++ )
	{
		var field = inputIdArray[ i ];
		if( document.getElementById( inputIdArray[ i ] )
				&& myJSONObject.columns[ i ] )
		{
			var type = document.getElementById( inputIdArray[ i ] ).type;
			if( type == 'text' )
			{
				document.getElementById( inputIdArray[ i ] ).value = myJSONObject.columns[ i ].value;
			}
			else if( type == 'hidden' )
			{
				document.getElementById( inputIdArray[ i ] ).value = myJSONObject.columns[ i ].value;
			}
			else
			{
				document.getElementById( inputIdArray[ i ] ).innerHTML = myJSONObject.columns[ i ].value;
			}
		}
	}
	if( !isEmpty( fptrCallback ) && typeof window[ fptrCallback ] == 'function' )
		window[ fptrCallback ]();
}

function showAgreementTreePopup()
{
	var agrTreeJson = document.getElementById( "agreementTreeJson" );
	if( agrTreeJson )
	{
		if( agrTreeJson.value != '' )
		{
			$( '#AgreementTreeDialog' ).dialog( {
				autoOpen : false,
				width : 900,
				height : 500,
				title : getLabel('treeView', 'Tree View'),
				modal : true
			} );
			$( '#dialogMode' ).val( '1' );
			$( '#AgreementTreeDialog' ).dialog( 'open' );
			drawAgreementTree();
		}
	}
}

var mapMoveRestrictionLabel = {
		"Z" : [
			['C' , getLabel("Concentration","Concentration")],
			['R' , getLabel("Range","Range")]
		],
		"M" : [
			['C' , getLabel("Concentration","Concentration")],
			['R' , getLabel("Range","Range")],
			['T' , getLabel("Target","Target")]
		],
		"R" : [
			['C' , getLabel("Concentration","Concentration")],
			['R' , getLabel("Range","Range")]
		],
		"F" : [
			['C' , getLabel("Concentration","Concentration")],
			['R' , getLabel("Range","Range")]
		],
		"P" : [
			['C' , getLabel("Concentration","Concentration")],
			['R' , getLabel("Range","Range")]
		]
};

function loadMovementRestrictionDropdown(element){
	$('#toAccMovRestriction').empty();
	$.each(mapMoveRestrictionLabel[element],function(index,item){
		$('#toAccMovRestriction').append($('<option>', { 
			value: mapMoveRestrictionLabel[element][index][0],
			text : mapMoveRestrictionLabel[element][index][1]
			}));
		if(selectedToMovItem == item[0])
		{
			$('#toAccMovRestriction option[value='+item[0]+']').attr('selected','selected');
		}
		});	
	
	$('#toAccMovRestriction').niceSelect('update');
	selectToMovCond($('#toAccMovRestriction'));
}

function selectFromMovCond( me )
{
	var element = $( '#fromAccMovRestriction' ).val();
	if( element == 'F' )
	{
		loadMovementRestrictionDropdown(element);
		$( '#fromMinBalance' ).val(strPlaceHolder );
		$( '#fromMinBalance' ).attr('disabled',true);
		$( '#fromMinBalance' ).attr('readOnly',true);
		$( '#fromMinBalance' ).addClass('form-control disabled');
		$( '#fromMaxBalance' ).val (strPlaceHolder );
		$( '#fromMaxBalance' ).attr('disabled',true);
		$( '#fromMaxBalance' ).attr('readOnly',true);
		$( '#fromMaxBalance' ).addClass('form-control disabled');
		$( '#proportionate' ).val(strPlaceHolder );
		$( '#proportionate' ).attr('disabled',true);
		$( '#proportionate' ).attr('readOnly',true);
		$( '#proportionate' ).addClass('form-control disabled');

		if( $( '#fromFixedAmnt' ) )
		{
			$( '#fromFixedAmnt' ).show();
			$( '#fromFixedAmnt' ).attr('disabled',false);
			$( '#fromFixedAmnt' ).attr('readOnly',false);
			$( '#fromFixedAmnt' ).addClass('form-control');
		}
	}
	else if( element == 'M' )
	{
		loadMovementRestrictionDropdown(element);
		$( '#fromFixedAmnt' ).val(strPlaceHolder );
		$( '#fromFixedAmnt' ).attr('disabled',true);
		$( '#fromFixedAmnt' ).attr('readOnly',true);
		$( '#fromFixedAmnt' ).addClass('form-control disabled');
		$( '#fromMaxBalance' ).val (strPlaceHolder );
		$( '#fromMaxBalance' ).attr('disabled',true);
		$( '#fromMaxBalance' ).attr('readOnly',true);
		$( '#fromMaxBalance' ).addClass('form-control disabled');
		$( '#proportionate' ).val(strPlaceHolder );
		$( '#proportionate' ).attr('disabled',true);
		$( '#proportionate' ).attr('readOnly',true);
		$( '#proportionate' ).addClass('form-control disabled');

		if( $( '#fromMinBalance' ) )
		{
			$( '#fromMinBalance' ).show();
			$( '#fromMinBalance' ).attr('disabled',false);
			$( '#fromMinBalance' ).attr('readOnly',false);
			$( '#fromMinBalance' ).addClass('form-control');
		}
	}
	else if( element == 'R' )
	{
		loadMovementRestrictionDropdown(element);
		$( '#fromFixedAmnt' ).val(strPlaceHolder );
		$( '#fromFixedAmnt' ).attr('disabled',true);
		$( '#fromFixedAmnt' ).attr('readOnly',true);
		$( '#fromFixedAmnt' ).attr('disabled',true);
		$( '#proportionate' ).val (strPlaceHolder );
		$( '#proportionate' ).attr('disabled',true);
		$( '#proportionate' ).attr('readOnly',true);
		$( '#proportionate' ).addClass('form-control disabled');

		if( $( '#fromMinBalance' ) )
		{
			$( '#fromMinBalance' ).show();
			$( '#fromMinBalance' ).attr('disabled',false);
			$( '#fromMinBalance' ).attr('readOnly',false);
			$( '#fromMinBalance' ).addClass('form-control');

			$( '#fromMaxBalance' ).show();
			$( '#fromMaxBalance' ).attr('disabled',false);
			$( '#fromMaxBalance' ).attr('readOnly',false);
			$( '#fromMaxBalance' ).addClass('form-control');
		}
	}
	else if( element == 'P' )
	{
		loadMovementRestrictionDropdown(element);
		$( '#fromFixedAmnt' ).val(strPlaceHolder );
		$( '#fromFixedAmnt' ).attr('disabled',true);
		$( '#fromFixedAmnt' ).attr('readOnly',true);
		$( '#fromFixedAmnt' ).addClass('form-control disabled');
		$( '#fromMaxBalance' ).val(strPlaceHolder );
		$( '#fromMaxBalance' ).attr('disabled',true);
		$( '#fromMaxBalance' ).attr('readOnly',true);
		$( '#fromMaxBalance' ).addClass('form-control disabled');
		$( '#fromMinBalance' ).val(strPlaceHolder );
		$( '#fromMinBalance' ).attr('disabled',true);
		$( '#fromMinBalance' ).attr('readOnly',true);
		$( '#fromMinBalance' ).addClass('form-control disabled');

		if( $( '#proportionate' ) )
		{
			$( '#proportionate' ).show();
			$( '#proportionate' ).attr('disabled',false);
			$( '#proportionate' ).attr('readOnly',false);
			$( '#proportionate' ).addClass('form-control');
		}
	}
	else if( element == 'Z' )
	{
		loadMovementRestrictionDropdown(element);
		$( '#fromFixedAmnt' ).val(strPlaceHolder );
		$( '#fromFixedAmnt' ).attr('disabled',true);
		$( '#fromFixedAmnt' ).attr('readOnly',true);
		$( '#fromFixedAmnt' ).addClass('form-control disabled');
		$( '#fromMaxBalance' ).val(strPlaceHolder );
		$( '#fromMaxBalance' ).attr('disabled',true);
		$( '#fromMaxBalance' ).attr('readOnly',true);
		$( '#fromMaxBalance' ).addClass('form-control disabled');
		$( '#fromMinBalance' ).val(strPlaceHolder );
		$( '#fromMinBalance' ).attr('disabled',true);
		$( '#fromMinBalance' ).attr('readOnly',true);
		$( '#fromMinBalance' ).addClass('form-control disabled');
		$( '#proportionate' ).val(strPlaceHolder );
		$( '#proportionate' ).attr('disabled',true);
		$( '#proportionate' ).attr('readOnly',true);
		$( '#proportionate' ).addClass('form-control disabled');
	}
	if($('#multiLevelFd').val() != 'Y'){
		if( element == 'F' || element == 'P')
		{
			$( '#allowFillDeficit' ).val('N');
			$( '#allowFillDeficit' ).attr('disabled',true);
		}
		else
		{
			$( '#allowFillDeficit' ).attr('disabled',false);
		}
	}
	$( '#allowFillDeficit' ).niceSelect('update');
}

function selectToMovCond( me )
{
	var element = $( '#toAccMovRestriction' ).val();

	if( element == 'T' )
	{
		$( '#toMinBalance' ).val(strPlaceHolder );
		$( '#toMinBalance' ).attr('disabled',true);
		$( '#toMinBalance' ).attr('readOnly',true);
		$( '#toMinBalance' ).addClass('form-control disabled');
		$( '#toMaxBalance' ).val(strPlaceHolder );
		$( '#toMaxBalance' ).attr('disabled',true);
		$( '#toMaxBalance' ).attr('readOnly',true);
		$( '#toMaxBalance' ).addClass('form-control disabled');

		if( $( '#toTargetAmnt' ) )
		{
			$( '#toTargetAmnt' ).show();
			$( '#toTargetAmnt' ).attr('disabled',false);
			$( '#toTargetAmnt' ).attr('readOnly',false);
			$( '#toTargetAmnt' ).addClass('form-control');
		}
	}
	else if( element == 'R' )
	{
		$( '#toTargetAmnt' ).val(strPlaceHolder );
		$( '#toTargetAmnt' ).attr('disabled',true);
		$( '#toTargetAmnt' ).attr('readOnly',true);
		$( '#toTargetAmnt' ).addClass('form-control disabled');

		if( $( '#toMinBalance' ) )
		{
			$( '#toMinBalance' ).show();
			$( '#toMinBalance' ).attr('disabled',false);
			$( '#toMinBalance' ).attr('readOnly',false);
			$( '#toMinBalance' ).addClass('form-control');

			$( '#toMaxBalance' ).show();
			$( '#toMaxBalance' ).attr('disabled',false);
			$( '#toMaxBalance' ).attr('readOnly',false);
			$( '#toMaxBalance' ).addClass('form-control');
		}

	}
	else if( element == 'C' )
	{
		$( '#toTargetAmnt' ).val(strPlaceHolder );
		$( '#toTargetAmnt' ).attr('disabled',true);
		$( '#toTargetAmnt' ).attr('readOnly',true);
		$( '#toTargetAmnt' ).addClass('form-control disabled');
		$( '#toMaxBalance' ).val(strPlaceHolder );
		$( '#toMaxBalance' ).attr('disabled',true);
		$( '#toMaxBalance' ).attr('readOnly',true);
		$( '#toMaxBalance' ).addClass('form-control disabled');
		$( '#toMinBalance' ).val(strPlaceHolder );
		$( '#toMinBalance' ).attr('disabled',true);
		$( '#toMinBalance' ).attr('readOnly',true);
		$( '#toMinBalance' ).addClass('form-control disabled');
	}
}

function unDefined( val )
{
	return( typeof val == "undefined" );
}

function chkLimitOnFundTrf( me )
{
	if( me.checked == true )
	{
		$( '#minFundLimit' ).attr('readOnly',false);
		$( '#minFundLimit' ).addClass('form-control');
		$( '#maxFundLimit' ).attr('readOnly',false);
		$( '#maxFundLimit' ).addClass('form-control disabled');
	}
	else
	{
		$( '#minFundLimit' ).attr('readOnly',true);
		$( '#minFundLimit' ).addClass('form-control disabled');
		$( '#minFundLimit' ).val(strPlaceHolder );
		$( '#maxFundLimit' ).attr('readOnly',true);
		$( '#maxFundLimit' ).addClass("form-control disabled");
		$( '#maxFundLimit' ).val(strPlaceHolder );
	}
}

function chkMinimumLotCondition( me )
{
	if( me.checked == true )
	{
		$( '#minLotAmnt' ).attr('readOnly',false);
		$( '#minLotAmnt' ).addClass("form-control");
	}
	else
	{
		$( '#minLotAmnt' ).attr('readOnly',true);
		$( '#minLotAmnt' ).addClass("form-control disabled");
		$( '#minLotAmnt' ).val(strPlaceHolder );
	}
}
function settoaccdesc()
{
	var toAccountCCY = "";
	var toAccountDesc = "";
	if( document.getElementById( "toAccDesc" )
			&& document.getElementById( "toAccCcy" ) )
	{
		if( document.getElementById( "toAccDesc" ).value != "" )
			toAccountDesc = document.getElementById( "toAccDesc" ).value;
		if( document.getElementById( "toAccCcy" ).value != "" )
			toAccountCCY = '('.concat(
					document.getElementById( "toAccCcy" ).value ).concat( ')' );
		/*document.getElementById( "toaccdescspan" ).innerHTML = toAccountDesc
				.concat( toAccountCCY );
		$('#toaccdescspan').title = toAccountDesc.concat( toAccountCCY );*/
		document.getElementById( "toaccccyspan" ).innerHTML = toAccountCCY;
		document.getElementById( "toaccccyspan1" ).innerHTML = toAccountCCY;
		document.getElementById( "toaccccyspan2" ).innerHTML = toAccountCCY;
	}
}
function setfromaccdesc()
{
	var fromAccountDesc = "";
	var fromAccountCCY = "";
	if( document.getElementById( "fromAccDesc" )
			&& document.getElementById( "fromAccCcy" ) )
	{
		if( document.getElementById( "fromAccDesc" ).value != "" )
			fromAccountDesc = document.getElementById( "fromAccDesc" ).value;
		if( document.getElementById( "fromAccCcy" ).value != "" )
			fromAccountCCY = '('.concat(
					document.getElementById( "fromAccCcy" ).value )
					.concat( ')' );

		/*document.getElementById( "fromaccdescspan" ).innerHTML = fromAccountDesc
				.concat( fromAccountCCY );
		$('#fromaccdescspan').title = fromAccountDesc.concat( fromAccountCCY );*/
		document.getElementById( "fromaccccyspan" ).innerHTML = fromAccountCCY;
		document.getElementById( "fromaccccyspan1" ).innerHTML = fromAccountCCY;
		document.getElementById( "fromaccccyspan2" ).innerHTML = fromAccountCCY;
	}
}

function onChangeAllowFillDefict( me )
{
	if( me )
	{
		if( me.value == 'N' )
		{
			if( document.getElementById( "limitFdInterAccContrb" ) )
			{
				document.getElementById( "limitFdInterAccContrb" ).value = "N";
				document.getElementById( "limitFdInterAccContrb" ).checked = false;
				document.getElementById( "limitFdInterAccContrb" ).disabled = true;
			}
		}
		else
		{
			document.getElementById( "limitFdInterAccContrb" ).disabled = false;
		}
	}
}
function OnChangeFormatAmount( me )
{
	if( isNaN( parseFloat( me.value ) ) )
		return false;
	me.value = parseFloat( me.value ).toFixed(2);	
}

function setCheckboxesChecked()
{
	if( document.getElementById( "multiLevelFd" ).value == 'Y' )
		document.getElementById( "multiLevelFd" ).checked = true;	
}

function copyToMovResData()
{
	var j = 0;
	var k = 0;
	var comboItem = document.getElementById( 'toAccMovRestriction' );
	selectedToMovItem = comboItem.options[ comboItem.selectedIndex ].value;
	for( i = 0 ; i < comboItem.options.length ; i++ )
	{
		toMovResList1[ i ] = new Array( 2 );
		toMovResList1[ i ][ 0 ] = comboItem.options[ i ].value;
		toMovResList1[ i ][ 1 ] = comboItem.options[ i ].text;
		if( comboItem.options[ i ].value != 'T' )
		{
			toMovResList2[ j ] = new Array( 2 );
			toMovResList2[ j ][ 0 ] = comboItem.options[ i ].value;
			toMovResList2[ j ][ 1 ] = comboItem.options[ i ].text;
			j++;
		}
		if( comboItem.options[ i ].value != 'T' && comboItem.options[ i ].value != 'R' )
		{
			toMovResList3[ k ] = new Array( 1 );
			toMovResList3[ k ][ 0 ] = comboItem.options[ i ].value;
			toMovResList3[ k ][ 1 ] = comboItem.options[ i ].text;
			k++;
		}
		
	}
}

function removeToMovRes()
{
	var toMovRes = document.getElementById( 'toAccMovRestriction' );
	while( toMovRes.firstChild )
	{
		toMovRes.removeChild( toMovRes.firstChild );
	}
}

function loadToMovRes( fromMoveflag )
{
	var comboItem = document.getElementById( 'toAccMovRestriction' );
	var comboArrayList;
	if( fromMoveflag == 'M' )
	{
		comboArrayList = toMovResList1;
	}
	else if( fromMoveflag == 'P' )
	{
		comboArrayList = toMovResList3;
	}
	else
	{
		comboArrayList = toMovResList2;
	}
	for( var i = 0 ; i < comboArrayList.length ; i++ )
	{
		var optionItem = new Option();
		optionItem.value = comboArrayList[ i ][ 0 ];
		optionItem.text = comboArrayList[ i ][ 1 ];
		if( selectedToMovItem == optionItem.value )
		{
			optionItem.selected = true;
		}
		comboItem.options[ i ] = optionItem;
	}
	selectToMovCond( comboItem );
}


function resetFromAccount() {
			getLabel('autoCompleterEmptyText', 'Enter Keyword or %')
			$("#fromAccNmbr" ).val('');
			$("#fromAccDesc").val('');			
            $("#fromAccCcy").val('');
            $("#fromAccId").val('');
            $("#toAcctId").val('');
			setfromaccdesc();			
}

function resetToAccount() 
{
			$("#toAccNmbr" ).val('');
			$("#toAccDesc").val('');			
            $("#toAccCcy").val('');
            $("#toAccId").val('');
            $("#toAcctId").val('');
			settoaccdesc();
}

function setDefaultAllowDeficit() 
{
			$("#allowFillDeficit > option").each(function() {			      
			        if(this.value == "IB"){
			        	this.selected = true;
			        }
			    });
	onChangeAllowFillDefict(document.getElementById("allowFillDeficit"));	
}
function setDirtyBit()
{
	document.getElementById( "dirtyBit" ).value = '1';
}
