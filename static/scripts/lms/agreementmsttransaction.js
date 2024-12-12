function selectAccount()
{
	var frm = document.forms[ "frmMain" ];
	var strUrl = 'saveTransactionAgreementDtl.form';
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function removeRecord( strUrl, method )
{
	if( document.getElementById( "updateIndex" ).value == "" )
	{
		alert( "Select Atlease One Record" )
		return;
	}
	if( document.getElementById( "updateIndex" ).value.length >= 0 )
	{
		showAlert( strConfMessage, null, [ strUrl ], method );
	}
}
function removeAccount( strUrl )
{
	document.getElementById( "txtIndex" ).value = document
			.getElementById( "updateIndex" ).value;
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function showAgreementTreePopup()
{
	var agrTreeJson = document.getElementById("agreementTreeJson");
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
function updateNotionalAgreement( index )
{
		var frm = document.forms[ "frmMain" ];
		var strUrl = 'updateTransactionAgreement.form';
		frm.target = "";
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
}
function submitUrl( strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function handoffLiqOffset( strUrl, method )
{
	showAlert( strHandMessage, null, [ strUrl ], method );
}
function deleteAgreementDetail( ctrl, index )
{
	var detailIndex = document.getElementById( "updateIndex" ).value;
	if (index.length < 2)
	{
		index = '0' + index;
	}
	if( ctrl.className.indexOf( "acceptlink" ) > -1 )
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}
	var aPosition = detailIndex.indexOf(index);
	if (aPosition >= 0)
	{
		document.getElementById("updateIndex").value = detailIndex.replace(detailIndex.substring(aPosition, aPosition + 3),"");
	}
	else
	{
		document.getElementById("updateIndex").value = index+ ","+detailIndex ;
	}
	var removeAccountBtn = document.getElementById( "removeAccountBtn" );
	if(document.getElementById("updateIndex").value.length > 0)
	{
		removeAccountBtn.disabled = false;
	}
	else
	{
		removeAccountBtn.disabled = true;
	}
}
function getRecord(json,elementId,fptrCallback)
{		  
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length; i++)
	{
    	var field = inputIdArray[i];
    	if(document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
			var type = document.getElementById(inputIdArray[i]).type;
			if(type=='text'){
				document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;}
			else if (type == 'hidden') {
				document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;}
			else {
				document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;} 
    	}
	}    
    if( !isEmpty( fptrCallback ) && typeof window[ fptrCallback ] == 'function' )
		window[ fptrCallback ]( json, elementId );
}

function enableDisableContributionLimit(me)
{
	var defaultMasterAccount;
	var contributionLimit;
	var liquidityLimit;
	var contributionLimitlbl;
	var liquidityLimitlbl;
	var masterAccountLbl;
	
	contributionLimitlbl = document.getElementById( "contributionLimitLbl" );
	liquidityLimitlbl = document.getElementById( "liquidityLimitLbl" );
	masterAccountLbl = document.getElementById( "masterAccountLabel" );
	
	if(me.checked == true)
	{
		me.value = "Y";
		contributionLimitlbl.style.visibility = "visible";
		liquidityLimitlbl.style.visibility = "visible";
		masterAccountLbl.style.visibility = "visible";
		for( i = 0 ; i < gridCounter ; i++ )
		{
			contributionLimit = document.getElementById( "agreementDtlBean["+i+"].contributionLimit" );
			liquidityLimit = document.getElementById( "agreementDtlBean["+i+"].liqLimit" );
			defaultMasterAccount = document.getElementById( "agreementDtlBean["+i+"].defaultMasterAcc" );
			
			if( defaultMasterAccount )
			{
				if( defaultMasterAccount.value == 'Y' )
				{
					defaultMasterAccount.value="Y";
					defaultMasterAccount.checked = true;
					defaultMasterAccount.style.visibility = "visible";
					contributionLimit.style.visibility = "visible";
					liquidityLimit.style.visibility = "hidden";
					liquidityLimit.value = '0.0';
				}
				else
				{
					defaultMasterAccount.value="N";
					defaultMasterAccount.checked = false;
					defaultMasterAccount.style.visibility = "visible";
					contributionLimit.style.visibility = "hidden";
					liquidityLimit.style.visibility = "visible";
					contributionLimit.value = '0.0';
				}
			}
			else
			{
				defaultMasterAccount.value="N";
				defaultMasterAccount.checked = false;
				defaultMasterAccount.style.visibility = "visible";
				contributionLimit.style.visibility = "hidden";
				liquidityLimit.style.visibility = "visible";
				contributionLimit.value = '0.0';
			}
		}
	}
	else
	{
		me.value = "N";
		contributionLimitlbl.style.visibility = "hidden";
		liquidityLimitlbl.style.visibility = "hidden";
		masterAccountLbl.style.visibility = "hidden";
		
		for( i = 0 ; i < gridCounter ; i++ )
		{
			contributionLimit = document.getElementById( "agreementDtlBean["+i+"].contributionLimit" );
			liquidityLimit = document.getElementById( "agreementDtlBean["+i+"].liqLimit" );
			defaultMasterAccount = document.getElementById( "agreementDtlBean["+i+"].defaultMasterAcc" );
			
			defaultMasterAccount.value="N";
			defaultMasterAccount.checked = false;
			defaultMasterAccount.style.visibility = "hidden";
			contributionLimit.style.visibility = "hidden";
			contributionLimit.value = '0.0';
			liquidityLimit.style.visibility = "hidden";
			liquidityLimit.value = '0.0';
		}
	}
}
function onChangeMasterAccount(me,index)
{
	var contributionLimit;
	var liquidityLimit;
	var contributionLimitlbl;
	var masterAccount ;
	contributionLimitlbl = document.getElementById( "contributionLimitLbl" );
	
	for( i = 0 ; i < gridCounter ; i++ )
	{
		contributionLimit = document.getElementById( "agreementDtlBean["+i+"].contributionLimit" );
		liquidityLimit = document.getElementById( "agreementDtlBean["+i+"].liqLimit" );
		masterAccount = document.getElementById( "agreementDtlBean["+i+"].defaultMasterAcc" );
		if(index == i)
		{
			if(masterAccount.checked == true)
			{
				masterAccount.value="Y";
				contributionLimit.style.visibility = "visible";
				contributionLimitlbl.style.visibility = "visible";
				liquidityLimit.style.visibility = "hidden";
				liquidityLimit.value = '0.0';
			}
			else
			{
				masterAccount.value="N";
				masterAccount.checked = false;
				contributionLimit.style.visibility = "hidden";
				contributionLimitlbl.style.visibility = "visible";
				liquidityLimit.style.visibility = "visible";
				contributionLimit.value = '0.0';
			}
		}
		else
		{
			masterAccount.value="N";
			masterAccount.checked = false;
			contributionLimit.style.visibility = "hidden";
			contributionLimitlbl.style.visibility = "visible";
			liquidityLimit.style.visibility = "visible";
			contributionLimit.value = '0.0';
		}	
	}
}

function showLiquidityPosition()
{
	document.getElementById( "viewLiquidityPosition" ).style.visibility = "visible";
	$( '#viewLiquidityPosition' ).dialog( {
		bgiframe : true,
		autoOpen : false,
		width : "auto",
		height : "auto",
		resizable : true,
		title : getLabel('liquidityPositionDetail', 'Liquidity Position Detail'),
		modal : true
	} );
	$( '#dialogMode' ).val( '1' );
	$( '#viewLiquidityPosition' ).dialog( 'open' );
}

function checkAmount(me)
{
	if( isNaN( parseFloat( me.value ) ) ) 
		me.value = "";
	$(me).keypress(function (e) {
	     //if the letter is not digit then display error and don't type anything
	     if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
	        //display error message	        
	               return false;
	    }
	   });
}
function closePopup()
{
	$( '#viewLiquidityPosition' ).dialog( 'close' );
}
function enableHandoffOffsetBtn(me)
{
	var processcount = document.getElementById( "PROCESSCOUNT" );
	var liqpositioncnt = document.getElementById( "LIQPOSITIONCNT" );
	var resetbtn = document.getElementById( "resetbtn" );
	if(me.value == 'A')
	{
		if(processcount.value == 0 && liqpositioncnt.value != 0)
		{
			if(resetbtn)
			{
				resetbtn.disabled = false;
			}
		}
		else
		{
			if(resetbtn)
			{
				resetbtn.disabled = true;
			}
		}
	}
	else
	{
		resetbtn.disabled = true;
	}
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