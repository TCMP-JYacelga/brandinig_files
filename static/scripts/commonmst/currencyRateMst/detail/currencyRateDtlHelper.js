function warnBeforeBack( strUrl )
{
	strUrl = strUrl + '?&$viewState=' + encodeURIComponent( viewState ) + '&$pageMode=' + pageMode;
	strUrl = strUrl + '&' + csrfTokenName + '=' + tokenValue;
	var dirtyBit = $( '#dirtyBit' ).val();
	if( '1' == dirtyBit )
	{
		$( '#confirmMsgPopup' ).dialog(
		{
			autoOpen : false,
			height : 200,
			width : 420,
			modal : true,
			buttons :
			{
				"Ok" : function()
				{
					var frm = document.forms[ "frmMain" ];
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
				},
				"Cancel" : function()
				{
					$( this ).dialog( "close" );
				}
			}
		} );
		$( '#confirmMsgPopup' ).dialog( "open" );
	}
	else
	{
		var frm = document.forms[ "frmMain" ];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}

function setDirtyBit()
{
	document.getElementById( "dirtyBit" ).value = '1';
}

function submitCurrencyRateMst( strUrl )
{
		var strUrl = strUrl + '?' + csrfTokenName + '=' + csrfTokenValue;
		strUrl = strUrl + '&$viewState=' + encodeURIComponent( viewState );
		strUrl = strUrl + '&$pageMode=' + pageMode;

		var frm = document.getElementById( 'frmMain' );
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
}
