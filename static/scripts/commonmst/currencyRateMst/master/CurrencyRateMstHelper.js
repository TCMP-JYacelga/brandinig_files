var globalStrUrl = null;
function warnBeforeBack( strUrl )
{
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
					var frm = document.createElement( "form" );
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
		var frm = document.createElement( "form" );
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

function goToHome( strUrl )
{
	var frm = document.getElementById( 'frmMain' );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//goToHome

function warnBeforeCancel(strUrl) {
	var dirtyBit = $('#dirtyBit').val();
	if('1' == dirtyBit) {
		$('#confirmMsgPopup').dialog({
					autoOpen : false,
					maxHeight: 550,
					minHeight:'auto',
					width : 400,
					modal : true,
					resizable: false,
					draggable: false
		});
		$('#confirmMsgPopup').dialog("open");
		$('#cancelConfirmMsg').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#doneConfirmMsgbutton').bind('click',function(){
			var frm = document.forms["frmMain"];
			frm.action = strUrl;
			frm.target = "";
			frm.method = "POST";
			frm.submit();
		});
		$('#textContent').focus();
	}
	else {
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}
function saveOrUpdateCurrencyMaster()
{

	var frm = document.getElementById( "frmMain" );
	var strUrl = null;
	if( pageMode == 'NEW' )
	{
		strUrl = 'saveCurrencyRateMstEntry.srvc';
		document.getElementById("dirtyBit").value = '0';
	}
	else
	{
		strUrl = 'updateCurrencyRateMstEntry.srvc?';
		strUrl = strUrl + '&$viewState=' + document.getElementById("viewState").value;
		document.getElementById("dirtyBit").value = '0';
	}
	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//saveOrUpdateCurrencyMaster

function showNextTab(strUrl)
{
	globalStrUrl = strUrl;
	goToNextpage();
}//showNextTab

function closeConfirmNextPopup()
{
	$( '#confirmNextPopup' ).dialog( 'close' );
}//closeConfirmNextPopup

function goToNextpage()
{
	var me = this;
	var frm = document.getElementById( 'frmMain' );
	frm.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
	frm.appendChild( me.createFormField( 'INPUT', 'HIDDEN', '$viewState', document.getElementById("viewState").value ) );
	frm.appendChild( me.createFormField( 'INPUT', 'HIDDEN', '$pageMode', pageMode ) );
	frm.action = globalStrUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//goToNextpage