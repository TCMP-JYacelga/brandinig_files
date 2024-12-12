function downloadXls()
{
	var frm = document.forms["frmMain"];
	frm.action ="downloadXls.xls";
	frm.method = "POST";
	frm.submit();
}


function downloadCurrencyXls()
{
	var frm = document.forms["frmMain"];
	frm.action ="downloadCurrencyXls.xls";
	frm.method = "POST";
	frm.submit();
	
}

function showData(index,strUrl)
{
	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action=strUrl;
	frm.method="POST";
	frm.submit();
}

function showList(strUrl)
{
	if(formName=="list")
	{
		strUrl = "welcome.jsp"
	}
	else if(formName=="ListForm")
	{
		strUrl = "currencyForecastList.form";
	}
	else if(formName=="ForecastList")
	{
		showPreviousPage("filterCurrencyForecast.form");
		return;
	}
	else if(formName=="Forecast")
	{
		showPreviousPage("showBackCurrencyPeriodData.form");
		return;
	}
	window.location = strUrl;
}

// List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showForecastData(ref)
{
	var frm = document.forms["frmMain"];
	document.getElementById("forecastReference").value = ref; 
	frm.action = "forecastDetail.form";
	frm.method = "POST";
	frm.submit();
	
}



function showPreviousPage(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}



function getHelp(inputId, elementId, descriptionId, salt, validationType)
{		
	var inputIdArray = inputId.split("|");
	var criteria;
	var inputBox;
	
	var txtSecond = document.getElementById(elementId).value;			
	if(document.getElementById(inputIdArray[0])!=null)
	{
		 inputBox= document.getElementById(inputIdArray[0]);
	     criteria = inputBox.value;
	}
	
	for(i=1; i<inputIdArray.length-1; i++)
	{
		inputBox = document.getElementById(inputIdArray[i]);
		

		if (inputBox != null)
		{
			criteria = criteria + "," + inputBox.value;
		}	
		else if((inputIdArray[i]!=null)) 
		{
			var temp1=inputIdArray[i];
			criteria = criteria + "," + document.getElementById(''+temp1[1]).value;					
		}
	}	
	var today = new Date();
	var winID = today.getTime();
	var bankIndicator = "";
	var strIndicator = "";
	if(txtSecond == 0) txtSecond = "";
	wind = "SeekNew.action?forgeryToken=" + csrfTok 
			+ "&rmDepOn=" +  intRmDepOn + "&rmweight=" 
			+  intRmWeight + "&searchCriteriaArray="  
			+ criteria + "&parent=" + elementId + "&seekId=" + salt + "&descriptionLabel=" 
			+ descriptionId + "&txtSecond=" + txtSecond + "&validationType=" + validationType;  					
	var winPopUpObj = window.open(wind,'winID','width=300,height=350,resizable=1,scrollbars=0');
	if (winPopUpObj != null)
		if (!(winPopUpObj.closed))
			winPopUpObj.focus();		
}

function hideAdvanceFilter()
{
	document.getElementById("addInfo").style.visibility  = 'hidden';
}


function showAdvanceFilter()
{
	document.getElementById("addInfo").style.visibility  = 'visible';
}

function goPgNmbr(strUrl, totalPages)
{	
	var frm = document.forms["frmMain"];
	var pgNmbr = document.getElementById("goPageNumbr").value;	
	document.getElementById("txtCurrent").value = pgNmbr - 1 ;
	if (pgNmbr > totalPages)	
	{
		showError('Page Number cannot be greater than total number of pages!',null);
			return;
	}
	else if (pgNmbr==0)
	{
		showError('Page Number cannot be Zero!',null);
			return;
	}
	
	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}


function getHelpForAccount(inputId, elementId, descriptionId, salt, validationType)
{
	var forecastMyProd = document.getElementById("forecastMyproduct").value;
	if(forecastMyProd != null && forecastMyProd != "")
	{
		inputId = "userCode|forecastMyproduct|accountId|";
		salt = salt5;
	}
		
	getHelp(inputId, elementId, descriptionId, salt, validationType);
}


function filterData(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function getRecord(json,elementId)
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
    	 document.getElementById(inputIdArray[i]).value = myJSONObject.columns[i].value;}
    	else {
    	 document.getElementById(inputIdArray[i]).innerHTML = myJSONObject.columns[i].value;} 
    	}
	}    
}