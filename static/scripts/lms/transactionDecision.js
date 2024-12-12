function back(strUrl)
{
	var frm = document.forms['frmMain'];
	frm.action = strUrl;
	frm.method='POST';
	frm.target='';
	frm.submit();
	return true;
}
function filterData( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function filterDetailData( strUrl,index )
{
	document.getElementById("txtIndex").value = index;
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
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