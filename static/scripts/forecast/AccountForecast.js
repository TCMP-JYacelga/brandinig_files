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
		strUrl = "accountForecastList.form";
	}
	else if(formName=="ForecastList")
	{
		showPreviousPage("filterAccountForecast.form");
		return;
	}
	else if(formName=="Forecast")
	{
		showPreviousPage("showBackPeriodData.form");
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
	frm.target ="";
	frm.method = "POST";
	frm.submit();
	
}



function showPreviousPage(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.target ="";
	frm.submit();
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
	frm.target ="";
	frm.submit();
}



function filterOrderBy(strUrl)
{
	var frm = document.forms["frmMain"]; 
	
	var order1 = frm.orderByOne.value;
	var order2 = frm.orderByTwo.value;
	var order3 = frm.orderByThree.value;
	
	
	
	if(order1 != null && order2 != null && order2 != '0' && order1 == order2)
	{
		alert("Then By Value cannot be equal to Order By");
		return false;
	}
	
	if(order1 != null && order2 != null && order3 != '0' && order2 != '0' && order3 != null && order1 == order3 || order2 == order3)
	{
		alert("Then By Value cannot be equal to Order By or Then By Value");
		return false;
	}
	
	frm.action = strUrl;
	frm.method = "POST";
	frm.target ="";
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
    	 document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;}
    	else {
    	 document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;} 
    	}
	}    
}
