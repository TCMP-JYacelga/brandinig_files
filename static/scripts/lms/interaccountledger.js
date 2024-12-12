function showViewForm(index, strUrl)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = index;
	frm.method="POST";
	frm.action=strUrl;
	frm.submit();
}

function back(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.method="POST";
	frm.action=strUrl;
	frm.submit();
}

function showList(strUrl)
{
	window.location = strUrl;
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

function getRecord(json, elementId,fptrCallback)
{
    var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length; i++)
     {
	    var field = inputIdArray[i];
	    if(document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
	    {
          var type = document.getElementById(inputIdArray[i]).type;
          if(type=='text')
          {
               document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
          }
          else if (type == 'hidden')
          {
               document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
          }
          else
          {
               document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;
          }
	    }
     }
    if( !isEmpty( fptrCallback ) && typeof window[ fptrCallback ] == 'function' )
		window[ fptrCallback ]( json, elementId );
}

function filterData(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function getClient1()
{
	var acctId = null;
	var arr = null;
	if(document.getElementById("accountId1").value != null && document.getElementById("accountId1").value != "")
	{
		acctId = document.getElementById("accountId1").value;
		
		arr = acctId.split("|");
		
		document.getElementById("accountId1").value = arr[5];
	}
}


function abc()
{
	var acctId = null;
	var arr = null;
	if(document.getElementById("accountId2").value != null && document.getElementById("accountId2").value != "")
	{
		acctId = document.getElementById("accountId2").value;
		
		arr = acctId.split("|");
		
		document.getElementById("accountId2").value = arr[5];
	}
}

function call(str)
{
	if(str == 'F3')
	{
		back('interAccountLendingFilter.form');
	}
	if(str == 'F12')
	{
		showList('welcome.jsp');
	}
	
}

function getCcyInterAccountPosition()
{
	 var currencyOut = document.getElementById("acct1Ccy");
}
	
function setclientdesc()
{
	if(document.getElementById("clientDescription"))
	document.getElementById("clientdescspan").innerHTML = document.getElementById("clientDescription").value; 
}
function setToAccount()
{
	callBackAccount1();
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = 'interAccountLedgerSeek.form';
	frm.method = "POST";
	frm.submit();
}
function callBackAgreementCode()
{
	document.getElementById('account1').value = "";
	document.getElementById('accountOneDescription').value = "";
	document.getElementById('accountId1').value = "";
	document.getElementById('account2').value = "";
	document.getElementById('accountTwoDescription').value = "";
	document.getElementById('accountId2').value = "";
}
function callBackAccount1()
{
	document.getElementById('account2').value = "";
	document.getElementById('accountTwoDescription').value = "";
	document.getElementById('accountId2').value = "";
}