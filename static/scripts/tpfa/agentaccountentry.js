
function reloadAccountStyleLov() {
	
	var accountStyleList;
	var sellerId = 'OWNER';
	var opt;
	Ext.Ajax.request 
    ({ 
        url: 'cpon/agentAccount/accountStyleList.json', 
        method: 'POST', 
        params:  
        { 
        	sellerId : sellerId
        }, 
        success: function(response) 
        {
        	$( '#accountStyleCode > option' ).remove();
        	var objJson = null;												       
        		objJson = Ext.decode(response.responseText);
		if (objJson.d.filter) {
			accountStyleList = objJson.d.filter;
			for( var i = 0 ; i < accountStyleList.length ; i++ )
			{
				opt = document.createElement("option");
	            document.getElementById("accountStyleCode").options.add(opt);
	            if("" == accountStyleList[i].value){
	            	 opt.text = "Select";
	            }
	            else{
	            opt.text = accountStyleList[i].value + " - " +  accountStyleList[i].name;
	            }
	            if(accountStyleVal == accountStyleList[i].value) {
	            	opt.selected = true;
	            }
	            opt.value =accountStyleList[i].value;
			}
		}
		
        }, 
        failure: function(response) 
        { 
            console.log(response.responseText); 
        } 
         
    });
}
	
	function reloadAccountUsageLov() {
		
		var accountUsageList;
		var sellerId = $('#sellerId').val();
		var opt;
		Ext.Ajax.request 
	    ({ 
	        url: 'cpon/agentAccount/accountUsageList.json', 
	        method: 'POST', 
	        params:  
	        { 
	        	sellerId : sellerId
	        }, 
	        success: function(response) 
	        {
	        	$( '#accountUsageCode > option' ).remove();
	        	var objJson = null;												       
	        		objJson = Ext.decode(response.responseText);
			if (objJson.d.filter) {
				accountUsageList = objJson.d.filter;
				for( var i = 0 ; i < accountUsageList.length ; i++ )
				{
					opt = document.createElement("option");
		            document.getElementById("accountUsageCode").options.add(opt);
		            if("" == accountUsageList[i].value){
		            	 opt.text = "Select";
		            }
		            else{
		            opt.text =  accountUsageList[i].name;
		            }
		            if(accountUsageVal == accountUsageList[i].value) {
		            	opt.selected = true;
		            }
		            opt.value =accountUsageList[i].value;
				}
			}
			
	        }, 
	        failure: function(response) 
	        { 
	            console.log(response.responseText); 
	        } 
	         
	    });
}
	
function callAccountLocator (me) {
	
	clearAndHideErrorDiv();
	var strUrl = 'cpon/callAccountLocator1.srvc';
	var strData = {};
	var accountVal = $('#accountNumber').val();
	
	if(!Ext.isEmpty(accountVal)) {
	
	strData[ 'accountNumber' ] = $('#accountNumber').val(); // temporary
	strData[ 'accountUsageCode' ] = $('#accountUsageCode').val();
	strData[ 'viewState' ] = $('#viewState').val();
	strData[ csrfTokenName ] = csrfTokenValue;
	
	clearFieldsBeforeServiceCall();
	
	$.blockUI();
	
	Ext.Ajax.request 
    ({ 
        url: strUrl, 
        method: 'POST',
        timeout: 20000, //20 Sec
        params: strData, 
        success: function(response) 
        {
        	//console.log(response.responseText);
        	var jsonObj = Ext.decode(response.responseText);
        	var webServiceErrorFlag =  jsonObj.WEBSERVICEERRORFLAG;
        	if("Y" == webServiceErrorFlag) {
        		$('#webServiceErrorFlag').val("Y");
        	}
        	else{
        		$('#webServiceErrorFlag').val("N");
        	}
        	var businessError = jsonObj.BUSINESSERROR;
        	if(null != businessError) {
        	var errorList = businessError.errors;        	
        	if(null != errorList && errorList.length > 0 ) {
        		
        		createErrorDiv();        	
        	for(i=0; i < errorList.length;i++){
        		addErrorToDiv(errorList[i].defaultMessage);
        	}
        	showErrorDiv();
        	}
        	}
        
        	$('#accountName').val(jsonObj.AcctTitle);
        	$('#accountStyleCode').val(jsonObj.AcctStyleCode);        	
        	$('#accountBranchCode').val(jsonObj.OriginatingBranch);
        	$('#accountNumber').val(jsonObj.AcctIdentValue);
        	
        	if(null != objBranchAutoCompleter && null != jsonObj.accountBranchDesc ){
        		objBranchAutoCompleter.setValue(jsonObj.accountBranchDesc);
        	}        	
        	 $.unblockUI();       	
        	
        }, 
        failure: function(response) 
        { 
            console.log(response.responseText); 
            $.unblockUI();
        } 
         
    });
	
	}
	
	
}

function clearFieldsBeforeServiceCall() {	
	$('#accountName').val('');
	$('#accountStyleCode').val('');        	
	$('#accountBranchCode').val('');
	objBranchAutoCompleter.setValue('');
}

function getBranchDescription(){
	
	var response = Ext.Ajax.request ({ 
        url: 'cpon/agentAccount/branchDesc.json', 
        method: 'POST', 
        params:  
        { 
        	bankKey:document.getElementById( "accountBranchCode" ).value 
        }, 
        success: function(response) 
        {
        	var objJson = null;												       
        		objJson = Ext.decode(response.responseText);
		if (objJson.d.filter[0]) {
			objBranchAutoCompleter.setValue(objJson.d.filter[0].name);
		}
   
        
        }, 
        failure: function(response) 
        { 
            console.log(response.responseText); 
        } 
         
    }) ;
	return response;
	
}

function goToAccountPage(strUrl, frmId) {
	
	var frm = document.getElementById(frmId);
	$('#frmMain :input').removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function createErrorDiv()
{
	var parentMessageArea = document.getElementById('parentMessageArea');
	var messageArea = document.getElementById('messageArea');
	if( null == messageArea )
	{
		messageArea = document.createElement('div');
		messageArea.id="messageArea";
		messageArea.className = "errors";
		parentMessageArea.appendChild(messageArea);
		messageArea.innerHTML = "<span>Error</span>";
	}
}
function addErrorToDiv(errorMessage)
{
	var updatedErrorMessage = "<ul><li>" + errorMessage + "</li></ul>";
	var messageArea = document.getElementById('messageArea');
	messageArea.innerHTML = "<span>Error</span>";
	messageArea.innerHTML += updatedErrorMessage;
}//
function closeErrorDiv()
{
	var messageArea = document.getElementById('messageArea');
	//messageArea.innerHTML += "</ul>";
}
function clearAndHideErrorDiv()
{
	var messageArea = document.getElementById('messageArea');
	if( null != messageArea )
	{
		messageArea.innerHTML = "";
		messageArea.style.display = 'none';		
	}
}
function showErrorDiv()
{
	var messageArea = document.getElementById('messageArea');
	if( null != messageArea )
	{
		messageArea.className = "errors";
		messageArea.style.display = 'block';		
	}
}