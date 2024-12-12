
function savePassiveDetail( strUrl )
{	
	var me= this;
	var form;
	var viewState = document.getElementById( "viewState" ).value;
	strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="+ csrfTokenValue;
	form = document.createElement( 'FORM' );
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';	
	form.action = strUrl;
	form.submit();	
}