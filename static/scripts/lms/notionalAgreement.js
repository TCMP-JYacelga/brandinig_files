function filter( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function filterComputation( strUrl, agreementId )
{
	document.getElementById( "agreementId" ).value = agreementId;
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function downloadXls( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function callBackFilter()
{
	// will post only in case of accrual/settlement
	if( document.getElementById( "screenType" ).value != 'C' )
	{
		var frm = document.forms[ "frmMain" ];
		frm.target = "";
		frm.action = 'seekNotionalAgreementQry.form';
		frm.method = "POST";
		frm.submit();
	}
}

function showViewForm( strUrl, index, agreementId )
{
	document.getElementById( "agreementId" ).value = agreementId;
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "txtIndex" ).value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showAccountDtl( strUrl, index, executionId, startDate )
{
	document.getElementById( "exeId" ).value = executionId;
	document.getElementById( "startDate" ).value = startDate;
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "txtIndex" ).value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showProfileDtl( profileCode )
{
	var csrf_name = document.getElementById( "csrfTok" ).name;
	var csrf_token = document.getElementById( csrf_name ).value;
	var strData = {};
	strData[ 'PROFILE' ] = profileCode;
	strData[ csrf_name ] = csrf_token;
	$.ajax( {
		type : 'POST',
		data : strData,
		url : 'interestProfileDetail.form',
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

function showDayWiseDetail( strUrl, index, txn_ref_nmbr, typeOfHandoffStr )
{
	document.getElementById( "txn_ref_nmbr" ).value = txn_ref_nmbr;
	document.getElementById( "typeOfHandoffStr" ).value = typeOfHandoffStr;
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "txtIndex" ).value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function showAccIntrestBack( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "txtIndex" ).value = 0;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function filterData()
{
	var strUrl;
	var screenType = document.getElementById( "screenType" );
	var accrualSettlement = document.getElementById( "accrualSettlement" );
	var interestBenefit = document.getElementById( "interestBenefit" );
	var typeOfHandoff = document.getElementById( "typeOfHandoff" );
	typeOfHandoff.value = accrualSettlement.value + interestBenefit.value;

	if( screenType.value == "C" )
	{
		strUrl = 'notionalAgreementQry.form';
	}
	else
	{
		if( accrualSettlement.value == "A" )
			strUrl = 'accrualSummary.form';
		else
			strUrl = 'notionalSettlementSummary.form';
	}
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
		window[ fptrCallback ]( json, elementId );
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

function showAccountInterestProfileDtl()
{
	$( '#accountInterestProfile' ).dialog( {
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
	$( '#accountInterestProfile' ).dialog( 'open' );

}

function showFilterScreenField()
{
	var screenType = document.getElementById( "screenType" );
	var agreementCodeLbl = document.getElementById( "agreementCodeLbl" );
	var accSettRef = document.getElementById( "filterAccSettRef" );
	var partAccount = document.getElementById( "parAccount" );
	var accrualSettlement = document.getElementById( "accrualSettlement" );
	var interestBenefit = document.getElementById( "interestBenefit" );
	var accSettRefLabel = document.getElementById( "accSettRefLabel" );
	var partAccountLabel = document.getElementById( "partAccountLabel" );
	var partAccountSeek = document.getElementById( "partAccountSeek" );
	var AccrualSettlementLabel = document
			.getElementById( "AccrualSettlementLabel" );
	var interestBenefitLabel = document.getElementById( "interestBenefitLabel" );
	if( screenType.value == 'C' )
	{
		agreementCodeLbl.className = "frmLabel";
		accSettRefLabel.style.visibility = "hidden";
		accSettRef.style.visibility = "hidden";
		partAccountLabel.style.visibility = "hidden";
		partAccount.style.visibility = "hidden";
		AccrualSettlementLabel.style.visibility = "hidden";
		accrualSettlement.style.visibility = "hidden";
		interestBenefitLabel.style.visibility = "hidden";
		interestBenefit.style.visibility = "hidden";
		partAccountSeek.style.visibility = "hidden";
	}
	else
	{
		agreementCodeLbl.className = "frmLabel required";
		accSettRefLabel.style.visibility = "visible";
		accSettRef.style.visibility = "visible";
		partAccountLabel.style.visibility = "visible";
		partAccount.style.visibility = "visible";
		AccrualSettlementLabel.style.visibility = "visible";
		accrualSettlement.style.visibility = "visible";
		interestBenefitLabel.style.visibility = "visible";
		interestBenefit.style.visibility = "visible";
		if( partAccountSeek )
			partAccountSeek.style.visibility = "visible";
	}
	setComputationDivDisplay();
}

function setComputationDivDisplay()
{
	var computationDiv = document.getElementById( "computationDiv" );
	if( document.getElementById( "screenType" ).value == 'C' )
		computationDiv.style.visibility = "visible";
	else
		computationDiv.style.visibility = "hidden";
}
