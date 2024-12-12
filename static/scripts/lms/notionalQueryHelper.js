function downloadXlsComputationSummary()
{
	var strUrl = "downloadXlsComputationSummaryData.srvc?" + csrfTokenName + '=' + csrfTokenValue + '&' + "$viewState="
		+ encodeURIComponent( viewState );
	strUrl = strUrl + '&' + "$pageType=" + pageType + '&' + "$structureType=" + structureType + '&' + '$structureSubType=' + structureSubType;
	strUrl = strUrl + '&' + "$isAccrualSettlement=" + isAccrualSettlement;
	if( !( typeof selectedDate === 'undefined' ) )
	{
		strUrl = strUrl + '&' + "$selectedDate=" + selectedDate;
	}
	var frm = document.getElementById( "frmMain" );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function downloadXlsAccrualSettlement()
{
	var strUrl = "downloadXlsAccrualSettlementData.srvc?" + csrfTokenName + '=' + csrfTokenValue + '&' + "$viewState="
	+ encodeURIComponent( viewState );
	strUrl = strUrl + '&' + "$pageType=" + pageType + '&' + "$structureType=" + structureType + '&' + '$structureSubType=' + structureSubType;
	strUrl = strUrl + '&' + "$groupOrAccount=" + groupOrAccount;
	
	if( !( typeof selectedDate === 'undefined' ) )
	{
		strUrl = strUrl + '&' + "$selectedDate=" + selectedDate;
	}
	if( queryType != null )
	{
		strUrl = strUrl + '&' + "$type=" + queryType;
	}
	if( !( typeof transactionId=== 'undefined' ) )
	{
		strUrl = strUrl + '&' + "$transactionId=" + transactionId;
	}
	
	var frm = document.getElementById( "frmMain" );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();

}

function gotoQueryPage( strUrl )
{
	strUrl = strUrl + "?&" + "$viewState=" + viewState + "&" + csrfTokenName + "=" + csrfTokenValue;
	var frm = document.createElement( "form" );
	document.body.appendChild(frm);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function gotoDteWisePage( strUrl )
{
	strUrl = strUrl + "?&" + "$viewState=" + viewState + "&" + csrfTokenName + "=" + csrfTokenValue;
	var frm = document.createElement( "form" );
	document.body.appendChild(frm);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function callToAccrualSetDtWisePage( transactionId, selectedDate, isAccrualSettlement )
{
	var form;
	var strUrl = 'getAccrualSettlmentDetailData.srvc';

	strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) +  "&" + "&$selectedDate=" + selectedDate;
	strUrl = strUrl + "&" +"&$isAccrualSettlement=" + isAccrualSettlement;
	
	// transactionId will be available only when call trigger from AccrualSettlement Summary 
	if( transactionId != null || transactionId != '' )
	{
		strUrl = strUrl + "&$transactionId=" + transactionId;
	}
	strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
	
	form = document.createElement( 'FORM' );
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
}

function clientSettlementFlagset()
{
	// for client login, for settlement query type if transaction type is Interest(03) then set flag true.
	// transaction type (10) option will be only in case of Compensation Net Agreement.
	if( entityType == '1' && queryType == '3' && ( transactionType == '03' || transactionType == '10'))
	{
		clientSettlementFlag = true;
	}
	else
	{
		clientSettlementFlag = false;
	}
}
