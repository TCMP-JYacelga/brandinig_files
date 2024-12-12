function getSpecialEditData( editType )
{
	var viewState = null;
	var editEffectDate = null;
	var specialEditRemarks = null;
	var strData = {};
	var strUrl = 'specialEditAgreementNotionalMaster.srvc';

	viewState = document.getElementById( "specialEditViewState" ).value;
	document.getElementById( "specialEditType" ).value = editType;

	strUrl = strUrl + "?$specialEditViewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="
		+ csrfTokenValue;
	var frm = document.getElementById( "frmSpecialEdit" );

	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	$(document.body).append(frm);
	frm.submit();
}
function goToPoolView()
{
	var strUrl = 'showLmsNotionalPoolView.srvc';
	var frm = document.createElement('form');
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'agreementRecKey';
    input.value = agreementRecKey;
    frm.appendChild(input);
    
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'agreementDesc';
    input.value = agreementDesc;
    frm.appendChild(input);
    
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'agreementCode';
    input.value = agreementCode;
    frm.appendChild(input);
    
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'agreementSubType';
    input.value = agreementSubType;
    frm.appendChild(input);
    
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'clientCode';
    input.value = clientCode;
    frm.appendChild(input);
    
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'clientDesc';
    input.value = clientDesc;
    frm.appendChild(input);
    
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'sellerCode';
    input.value = sellerCode;
    frm.appendChild(input);    
    
	strUrl = strUrl + "?" +  csrfTokenName + "=" + csrfTokenValue; 
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	$(document.body).append(frm);
	frm.submit();
}
function viewInterestRateSlabDetails(strUrl, agreementFilters)
{
	var frm = document.createElement('form');
	if(null != agreementFilters && "" != agreementFilters){
		
		if( null != agreementFilters.agreementRecKey )
		{
			var input = document.createElement('input');
		    input.type = 'hidden';
		    input.name = 'agreementRecKey';
		    input.value = agreementFilters.agreementRecKey;
		    frm.appendChild(input);
		}
		if( null != agreementFilters.agreementDesc )
		{
			var input = document.createElement('input');
		    input.type = 'hidden';
		    input.name = 'agreementDesc';
		    input.value = agreementFilters.agreementDesc;
		    frm.appendChild(input);
		}
		if( null != agreementFilters.agreementCode )
		{
			var input = document.createElement('input');
		    input.type = 'hidden';
		    input.name = 'agreementCode';
		    input.value = agreementFilters.agreementCode;
		    frm.appendChild(input);
		}
		if( null != agreementFilters.agreementSubType )
		{
			var input = document.createElement('input');
		    input.type = 'hidden';
		    input.name = 'agreementSubType';
		    input.value = agreementFilters.agreementSubType;
		    frm.appendChild(input);
		}
		if( null != agreementFilters.clientCode )
		{
			var input = document.createElement('input');
		    input.type = 'hidden';
		    input.name = 'clientCode';
		    input.value = agreementFilters.clientCode;
		    frm.appendChild(input);
		}
		if( null != agreementFilters.clientDesc )
		{
			var input = document.createElement('input');
		    input.type = 'hidden';
		    input.name = 'clientDesc';
		    input.value = agreementFilters.clientDesc;
		    frm.appendChild(input);
		}		
		if( null != agreementFilters.sellerCode )
		{
			var input = document.createElement('input');
		    input.type = 'hidden';
		    input.name = 'sellerCode';
		    input.value = agreementFilters.sellerCode;
		    frm.appendChild(input);
		}
	}
	frm.action = strUrl;
	frm.method = "POST";
	$(document.body).append(frm);
	frm.submit();
	frm.target = "";
}//showInterestProfile
function goToBVQuery()
{
$(document).trigger("handleFilterPanelVisibility");
}

function callViewInterestRateSlabDetails(strUrl, agreementFilters){
	$(document).trigger("redirectToInterestRateSlabDtls",[strUrl, agreementFilters]);
}