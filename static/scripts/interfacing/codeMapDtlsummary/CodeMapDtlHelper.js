function cancelPopup()
{
	$('#codeMapAddNewPopup').dialog( "close" );
}

function checkDefaultValueType()
{
	var form = document.getElementById( 'codeMapMstNewForm' ), radioRef = form[ 'codeMapCustDefaultValue' ], n;
	for( n = 0 ; n < radioRef.length ; n++ )
	{
		if( radioRef[ n ].checked )
		{
			if( radioRef[ n ].value == 'AS-IS' )
			{
				$( '#codeMapDefaultValue' ).removeClass( 'w14 rounded' );
				$( '#codeMapDefaultValue' ).addClass( 'w14 rounded disabled' );
				document.getElementById( "codeMapDefaultValue" ).value = 'AS-IS';
				document.getElementById( "codeMapDefaultValue" ).disabled = true;
			}
			else
			{
				document.getElementById( "codeMapDefaultValue" ).disabled = false;
				document.getElementById( "codeMapDefaultValue" ).value = '';
				$( '#codeMapDefaultValue' ).removeClass( 'w14 rounded disabled' );
				$( '#codeMapDefaultValue' ).addClass( 'w14 rounded' );

			}
		}
	}

}

function checkOtherValueType()
{
	var codeMapCustOtherComboBox = document.getElementById( "codeMapCustOthersValue" );
	var selectedOption = codeMapCustOtherComboBox.options[ codeMapCustOtherComboBox.selectedIndex ].value;

	if( selectedOption == 'AS-IS' )
	{
		$( '#codeMapOthersValue' ).removeClass( 'w14 rounded' );
		$( '#codeMapOthersValue' ).addClass( 'w14 rounded disabled' );
		document.getElementById( "codeMapOthersValue" ).value = 'AS-IS';
		document.getElementById( "codeMapOthersValue" ).disabled = true;
	}
	else if( selectedOption == 'UNDEFINED' )
	{
		$( '#codeMapOthersValue' ).removeClass( 'w14 rounded' );
		$( '#codeMapOthersValue' ).addClass( 'w14 rounded disabled' );
		document.getElementById( "codeMapOthersValue" ).value = 'UNDEFINED';
		document.getElementById( "codeMapOthersValue" ).disabled = true;
	}
	else if( selectedOption == 'CUSTOM' )
	{
		document.getElementById( "codeMapOthersValue" ).disabled = false;
		document.getElementById( "codeMapOthersValue" ).value = '';
		$( '#codeMapOthersValue' ).removeClass( 'w14 rounded disabled' );
		$( '#codeMapOthersValue' ).addClass( 'w14 rounded' );
	}

}

function saveCodeMapDetails( strUrl, frmId )
{
	var frm = document.getElementById( frmId );
	var viewState = document.getElementById( "masterViewState" ).value;

	if( document.getElementById( "outValue" ).disabled )
	{
		document.getElementById( "outValue" ).disabled = false;
	}
	strUrl = strUrl + "?$masterViewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="
		+ csrfTokenValue;

	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function updateCodeMapDetails( strUrl, frmId )
{
	var frm = document.getElementById( frmId );
	var viewState = document.getElementById( "dtlViewState" ).value;

	if( document.getElementById( "outValue" ).disabled )
	{
		document.getElementById( "outValue" ).disabled = false;
	}
	strUrl = strUrl + "?$viewState=" +  viewState  + "&" + csrfTokenName + "="
		+ csrfTokenValue;

	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showCodeMapDetailsEntryPopup()
{
	$( '#codeMapAddNewPopup' ).dialog(
	{
		autoOpen : false,
		minHeight : 156,
		maxHeight : 550,
		width : 450,
		modal : true,
		resizable : false,
		draggable : false
	} );
	$('#saveBtn').show();
	$('#updateBtn').hide();
	$( '#inValue' ).val('');
	$( '#outValue' ).val('');
	document.getElementById( "outValue" ).disabled = false;
	$( '#outValue' ).removeClass( 'rounded disabled' );
	$( '#outValue' ).addClass( 'rounded' );
	$("input[name=codeMapOutputValueType][value='CUSTOM']").attr('checked', 'checked');
	$( '#codeMapAddNewPopup' ).dialog( "open" );
	$( '#codeMapAddNewPopup' ).dialog('option','position','center');
}

function showCodeMapDetailsModifyPopup(record)
{
	var outValue = record.get('outValue') ;
	$( '#codeMapAddNewPopup' ).dialog(
	{
		autoOpen : false,
		minHeight : 156,
		maxHeight : 550,
		width : 450,
		modal : true,
		resizable : false,
		draggable : false
	} );
	$( '#inValue' ).val(record.get('inValue'));
	$( '#inValue' ).attr('title',record.get('inValue'));
	$( '#outValue' ).val(outValue);
	$( '#outValue' ).attr('title',outValue);
	$( '#dtlViewState' ).val(record.get('viewState'));
	if (outValue == 'AS-IS')
	{
		document.getElementById( "outValue" ).disabled = true;
		$("input[name=codeMapOutputValueType][value='AS-IS']").attr('checked', 'checked');
		$( '#outValue' ).addClass( 'rounded disabled' );
	}
	else if (outValue == 'DEFAULT')
	{
		document.getElementById( "outValue" ).disabled = true;
		$("input[name=codeMapOutputValueType][value='DEFAULT']").attr('checked', 'checked');
		$( '#outValue' ).addClass( 'rounded disabled' );
	}
	else
	{
		document.getElementById( "outValue" ).disabled = false;
		$("input[name=codeMapOutputValueType][value='CUSTOM']").attr('checked', 'checked');
		$( '#outValue' ).removeClass( 'rounded disabled' );
	}
	$('#saveBtn').hide();
	$('#updateBtn').show();
	$( '#codeMapAddNewPopup' ).dialog( "open" );
	$( '#codeMapAddNewPopup' ).dialog('option','position','center');
}

function setOutputValueParam()
{
	var form = document.getElementById( 'addCodeMapFieldsForm' ), radioRef = form[ 'codeMapOutputValueType' ], n;
	for( n = 0 ; n < radioRef.length ; n++ )
	{
		if( radioRef[ n ].checked )
		{
			if( radioRef[ n ].value == 'AS-IS' )
			{
				$( '#outValue' ).removeClass( 'rounded' );
				$( '#outValue' ).addClass( 'rounded disabled' );
				document.getElementById( "outValue" ).value = 'AS-IS';
				document.getElementById( "outValue" ).disabled = true;
			}
			else if( radioRef[ n ].value == 'DEFAULT' )
			{
				$( '#outValue' ).removeClass( 'rounded' );
				$( '#outValue' ).addClass( 'rounded disabled' );
				document.getElementById( "outValue" ).value = 'DEFAULT';
				document.getElementById( "outValue" ).disabled = true;
			}
			else
			{
				$( '#outValue' ).removeClass( 'rounded disabled' );
				$( '#outValue' ).addClass( 'rounded' );
				document.getElementById( "outValue" ).value = '';
				document.getElementById( "outValue" ).disabled = false;
			}
		}
	}

}
