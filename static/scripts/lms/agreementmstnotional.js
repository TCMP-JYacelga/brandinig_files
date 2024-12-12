function submitUrl( strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function selectAccount()
{
	var frm = document.forms[ "frmMain" ];
	var strUrl = 'saveNotionalAgreementDtl.form';
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
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
function showInterestProfileDtl()
{
	document.getElementById( "interestProfileView" ).style.visibility = "visible";
	$( '#interestProfileView' ).dialog( {
		bgiframe : true,
		autoOpen : false,
		width : "auto",
		height : "auto",
		resizable : true,
		title : getLabel('interestProfileDetail', 'Interest Profile Detail'),
		modal : true,
		buttons :[
			{
				text:getLabel('btnOk','Ok'),
				click : function() {
					$(this).dialog("close");
				}
			}
		]
	} );
	$( '#dialogMode' ).val( '1' );
	$( '#interestProfileView' ).dialog( 'open' );
}

function showInterestProfileDtlReq( profoile )
{
	var csrf_name = document.getElementById( "csrfTok" ).name;
	var csrf_token = document.getElementById( csrf_name ).value;
	var strData = {};
	
	strData[ 'PROFILE' ] = profoile;
	strData[ csrf_name ] = csrf_token;
	$.ajax( {
		type : 'POST',
		data : strData,
		url : 'interestProfileView.form',
		dataType : 'html',
		success : function( data )
		{
			var $response = $( data );
			$( '#interestProfile' ).html(
					$response.find( '#interestProfileView' ) );
			$( '#interestProfile' ).dialog( {
				bgiframe : true,
				autoOpen : false,
				width : "auto",
				height : "auto",
				resizable : true,
				title : getLabel('interestProfileDetail', 'Interest Profile Detail'),
				modal : true,
				buttons :[
					{
						text:getLabel('btnOk','Ok'),
						click : function() {
							$(this).dialog("close");
						}
					}
				]
			} );
			$( '#dialogMode' ).val( '1' );
			$( '#interestProfile' ).dialog( 'open' );
		}
	} );
}

function chkDefaultMasterAccount( me )
{
	var accountId;
	for( i = 0 ; i < gridCounter ; i++ )
	{
		isDefaultAccountFirst =  document.getElementById( "agreementDtlBean["+i+"].defaultMasterAcc" );
		if( me.checked == true )
		{
			if( me == isDefaultAccountFirst )
			{
				isDefaultAccountFirst.checked = true;
				isDefaultAccountFirst.value = 'Y';
			}
			else
			{
				isDefaultAccountFirst.checked = false;
				isDefaultAccountFirst.value = 'N';
			}
		}
		else
		{
			isDefaultAccountFirst.value = 'N';
		}
	}
}
function enableDisableRatioBox()
{
	var interestAllocationMethod = document
			.getElementById( "benefitAllocMethod" );
	var interestAllocationMethodLabel = document
			.getElementById( "benefitAllocationMethodLabel" )
	var interestSettlementMethod = document
			.getElementById( "interestCompMethod" );
	var ratioLabel = document.getElementById( "ratioLabel" );
	var defaultMasterAccountLabel = document
			.getElementById( "defaultMasterAccountLabel" );
	var ratio;
	var defaultMasterAccount;
	for( i = 0 ; i < gridCounter ; i++ )
	{
		ratio = document.getElementById( "agreementDtlBean["+i+"].allocationRatio" );
		
		defaultMasterAccount = document.getElementById( "agreementDtlBean["+i+"].defaultMasterAcc" );
		
		if( interestSettlementMethod.value == 'CB'
				|| interestSettlementMethod.value == 'Combination' )
		{
			if( defaultMasterAccount )
			{
				defaultMasterAccountLabel.style.visibility = "visible";
				defaultMasterAccount.style.visibility = "visible";
			}
			ratioLabel.style.visibility = "hidden";
			ratio.style.visibility = "hidden";
		}
		else if( interestSettlementMethod.value == 'CP'
				|| interestSettlementMethod.value == 'Compensation' )
		{
			if( interestAllocationMethod.value == 'R'
					|| interestAllocationMethod.value == 'Ratio Based' )
			{
				if( defaultMasterAccount )
				{
					defaultMasterAccountLabel.style.visibility = "hidden";
					defaultMasterAccount.style.visibility = "hidden";
				}
				ratioLabel.style.visibility = "visible";
				ratio.style.visibility = "visible";
			}
			else if( ( interestAllocationMethod.value == 'S'
					|| interestAllocationMethod.value == 'D' || interestAllocationMethod.value == 'SD' )
					|| ( interestAllocationMethod.value == 'Surplus Balance Based'
							|| interestAllocationMethod.value == 'Deficit Balance Based' || interestAllocationMethod.value == 'Surplus/Deficit balance based' ) )
			{
				if( defaultMasterAccount )
				{
					defaultMasterAccountLabel.style.visibility = "visible";
					defaultMasterAccount.style.visibility = "visible";
				}
				ratioLabel.style.visibility = "hidden";
				ratio.style.visibility = "hidden";
			}
			else
			{
				if( defaultMasterAccount )
				{
					defaultMasterAccountLabel.style.visibility = "hidden";
					defaultMasterAccount.style.visibility = "hidden";
				}
				ratioLabel.style.visibility = "hidden";
				ratio.style.visibility = "hidden";
			}
		}
		else if( interestSettlementMethod.value == 'TE'
				|| interestSettlementMethod.value == 'Tier Enhancement' )
		{
			if( defaultMasterAccount )
			{
				defaultMasterAccountLabel.style.visibility = "hidden";
				defaultMasterAccount.style.visibility = "hidden";
			}
			ratioLabel.style.visibility = "hidden";
			ratio.style.visibility = "hidden";
		}
		else
		{
			if( defaultMasterAccount )
			{
				defaultMasterAccountLabel.style.visibility = "hidden";
				defaultMasterAccount.style.visibility = "hidden";
			}
			ratioLabel.style.visibility = "hidden";
			ratio.style.visibility = "hidden";
		}
	}
}
function chkAllocationRatio( me )
{
	if( me.value < 0 )
	{
		showError( 'Account Ratio should be greater than Zero!', null );
		return false;
	}
	else if( me.value > 100 )
	{
		showError( 'Account Ratio should be less than 100!', null );
		return false;
	}
}
function chkAllocationRatioSum()
{
	var ratio;
	var sum = 0;
	for( i = 0 ; i < gridCounter ; i++ )
	{
		ratio = document.getElementById( "agreementDtlBean["+i+"].allocationRatio" );
		sum = parseInt( sum,10 ) + parseInt( ratio.value,10 );
	}
	if( sum != 100 )
	{
		showError( 'The sum of all Account Ratio should be 100 %', null );
		return false;
	}
}
function isDefaultMasterAccSelect()
{
	var isDefaultAccount;
	var interestAllocationMethod = document
			.getElementById( "benefitAllocMethod" );
	var interestSettlementMethod = document
			.getElementById( "interestCompMethod" );
	if( interestSettlementMethod.value == 'CB'
			|| ( interestSettlementMethod.value == 'CP' && ( interestAllocationMethod.value == 'S'
					|| interestAllocationMethod.value == 'D' || interestAllocationMethod.value == 'SD' ) ) )
	{
		for( i = 0 ; i < gridCounter ; i++ )
		{
			isDefaultAccount = document.getElementById( "agreementDtlBean["+i+"].defaultMasterAcc" );
			if( isDefaultAccount.checked == true )
			{
				break;
			}
			else if( isDefaultAccount.checked == false && i == gridCounter - 1 )
			{
				showError('AtLeast one Account Should be Default Master Account!',null );
				return false;
			}
		}
	}
	return true;
}

function verifyIsDefaultFlagFlag()
{
	var isDefaultAccount;
	for( i = 0 ; i < gridCounter ; i++ )
	{
		isDefaultAccount = document.getElementById( "agreementDtlBean["+i+"].defaultMasterAcc" );
		if( isDefaultAccount )
		{
			if( isDefaultAccount.value == "Y" )
			{
				isDefaultAccount.checked = true;
			}
			else
			{
				isDefaultAccount.checked = false;
			}
		}

	}
}
function setAllocationMethod()
{
	var computaionMethod = document.getElementById( "interestCompMethod" );
	var interestAllocationMethod = document
			.getElementById( "benefitAllocMethod" );
	var interestAllocationMethodLabel = document
			.getElementById( "benefitAllocationMethodLabel" );
	if( computaionMethod.value == 'CP'
			|| computaionMethod.value == 'Compensation' )
	{
		if( interestAllocationMethod )
		{
			interestAllocationMethodLabel.style.visibility = "visible";
			interestAllocationMethod.style.visibility = "visible";
		}
	}
	else
	{
		if( interestAllocationMethod )
		{
			interestAllocationMethodLabel.style.visibility = "hidden";
			interestAllocationMethod.style.visibility = "hidden";
		}

	}
}

function updateNotionalAgreement( index )
{
	if( isDefaultMasterAccSelect() )
	{
		var frm = document.forms[ "frmMain" ];
		var strUrl = 'updateNotionalAgreement.form';
		frm.target = "";
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
	}
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