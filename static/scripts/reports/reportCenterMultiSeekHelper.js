/*function selectAll()
{
   
	var repcode=document.getElementsByName("repcode");
	var checkall=document.getElementById("checkall");
   
	var repcodeLen=repcode.length;
	
	var codename;
	if(checkall.checked)
	{    
		for (var i = 0; i <repcodeLen; i++)
        {   
		    if(!repcode[i].checked)
			{   
		        codename=JSON.parse(repcode[i].value).columns[0].value;
				document.getElementById("check"+i).checked=true;
                addCode(codename);
				
			}
			
        }

    }
	  
	else
	{   
	    for (var i = 0; i <repcodeLen; i++)
        {
		   
		        codename=JSON.parse(repcode[i].value).columns[0].value;
				document.getElementById("check"+i).checked=false;
                removeCode(codename);
        }
	}
	  
}
*/

function selectAll(elementId)
{
	
	var repcode=document.getElementsByName("repcode");
	var checkall=document.getElementById("checkall");
   
	var repcodeLen=repcode.length;
	console.log(repcode);
	var codename;
	if(checkall.checked)
	{    
		for (var i = 0; i <repcodeLen; i++)
        {   
		    if(!repcode[i].checked)
			{   
		        codename=JSON.parse(repcode[i].value).columns[0].value;
				//console.log(codename);
				document.getElementById("check_"+i).checked=true;
				toggleCheckboxDef(JSON.parse(document.getElementById("check_"+i).value), elementId, document.getElementById("check_"+i));
				
			}
			
        }

    }
	else
	{   
	    for (var i = 0; i <repcodeLen; i++)
        {
		   
		    codename=JSON.parse(repcode[i].value).columns[0].value;
			document.getElementById("check_"+i).checked=false;
            toggleCheckboxDef(JSON.parse(document.getElementById("check_"+i).value), elementId, document.getElementById("check_"+i));
        }
	}
	  
}

function loadData(selectedCol)
{
	var repcode=document.getElementsByName("repcode");
	var repcodeLen=repcode.length;
	var codename;
	
	var selectArray=new Array();
	if(selectedCol!="")
	{
		var indexcommano=selectedCol.indexOf(",");
				
		if(indexcommano>0)
		{
			selectArray=selectedCol.split(","); 			
		}		
		else
		{		
			selectArray[0]=selectedCol;			
		}		
		

		var selectedCount=0;
		for(var i = 0; i <selectArray.length; i++)
			{	
				for (var j = 0; j <repcodeLen; j++)
					{
						codename=JSON.parse(repcode[j].value).columns[0].value;
						if(codename==selectArray[i])
						{
							document.getElementById("check"+j).checked=true;
							selectedCount++;
						}
					}
		
			}
			
			if(selectedCount==repcodeLen)
			{
				document.getElementById("checkall").checked=true;
			}
			
	}
}
function getRecord(json,index,obj){

	var checkboxid=document.getElementsByName(obj);
	var repcode=JSON.parse(json).columns[0].value;

	if(checkboxid[index].checked)
	{ 
		addCode(repcode);
	}

	else
	{
		removeCode(repcode);

	}

}


function addCode(repcode){
	var selectedcol;
	var multicode=document.getElementById("selectedcol").value;
	if(multicode!="")
	{ 
		selectedcol=multicode+","+repcode;
	}

	else
	{
		selectedcol=repcode;

	}
    
	document.getElementById("selectedcol").value=selectedcol;
}


function removeCode(repcode){
	var selectedcol;
	var multicode=document.getElementById("selectedcol").value;

	var indexno=multicode.indexOf(repcode);

	if(indexno==0)
	{
	    var indexcommano=multicode.indexOf(",");
		if(indexcommano>0)
		{
			var temp=repcode+",";
			selectedcol=multicode.replace(temp,""); 
		}
		else
		{  var temp=repcode;
			selectedcol=multicode.replace(temp,""); 
		}	
	}
	else
	{
		var temp=","+repcode;
		selectedcol=multicode.replace(temp,""); 	
	}
	
    document.getElementById("selectedcol").value=selectedcol;
}
function showMultiValue()
{
	
    var selectedcol=document.getElementById("selectedcol").value;
	if(selectedcol=="")
	{
		alert("Please Select Code");  
	}
	else
	{
	
	var paramID=document.getElementById("paramID").value;
	var multiJson={"selectedcol":selectedcol};
 
    hWin = window.opener;
	hWin.showMultiRecord(JSON.stringify(multiJson),paramID);
	window.close();
	}
}	
function showMultiRecord(json,paramID)
{
	document.getElementById(paramID).value = JSON.parse(json).selectedcol;
}
function seekFirstPage(totPages, seekUrl)
{
     var frm = document.forms["frmSeek"]; 
     var url = seekUrl + "_seek_first.seek";
     frm.action = url;
     frm.method = "POST";
     frm.submit();
}                              

function navigateTo(index, totPages, seekUrl)
{
     var frm = document.forms["frmSeek"]; 
	 if (index == 1)
	    frm.action = seekUrl + "_seek_next.seek";
	 else 
	    frm.action = seekUrl + "_seek_previous.seek";
     frm.method = "POST";
     frm.submit();
}                              

function seekLastPage(totPages, seekUrl)
{
      var frm = document.forms["frmSeek"]; 
      frm.action = seekUrl + "_seek_last.seek";
      frm.method = "POST";
      frm.submit();
}

function selectRecord(json, elementId, fptrCallback)
{		  
	hWin = window.opener;
	hWin.getRecord(JSON.stringify(json), elementId, fptrCallback);
	window.close();
}

function selectQuickPayRecord(json, elementId, fptrCallback)
{		  
	hWin = window.opener;
	hWin.getQuickPayRecord(JSON.stringify(json), elementId, fptrCallback);
	window.close();
}

function selectRightMenuRecord(json, elementId, fptrCallback)
{		  
	hWin = window.opener;
	hWin.getRightMenuRecord(JSON.stringify(json), elementId, fptrCallback);
	window.close();
}

function selectReportsRecord(json, elementId, fptrCallback)
{		  
	hWin = window.opener;
	hWin.getReportsRecord(JSON.stringify(json), elementId, fptrCallback);
	window.close();
}

function doOrderBy(index, sortDirection)
{

    var frm = document.forms["frmSeek"]; 

    if (sortDirection == 0)
      document.getElementById("sortDirection").value = "1";
    else
      document.getElementById("sortDirection").value = "0";

    document.getElementById("orderBy").value = index;
    frm.method = "POST";
    frm.submit();
}

function selectBankBranchRecord(json, elementId )
{		  
	window.opener.getBankBranchRecord(JSON.stringify(json),elementId);
	window.close();
}

function filterList()
{
	var frm = document.forms["frmSeek"]; 
	var url = stripExtension(frm.action) + "_first.seek";
	frm.action = url;
	frm.method = "POST";
	frm.submit();	
}	
function stripExtension(strUrl) {
	if (isEmpty(strUrl)) {return strUrl;}
	var pos = strUrl.lastIndexOf("_");
	if (pos > -1) {return strUrl.substring(0, pos);}
	return strUrl;
}

function selectAccount(json, elementId, fptrCallback) {
	hWin = window.opener;
	hWin.getSelectedAccount(JSON.stringify(json), elementId, fptrCallback);
	window.close();
}

/* Added For Multiple Select Record */
function toggleCheckboxDef(myJSONObject, elementId, thisRef)
{
	var value = retriveValue(myJSONObject);
	
	var alreadyPresent = checkIfRecordExist(elementId+'_multipleSelectRecords', value);
				/* Add to Selection List */
				if (!alreadyPresent && thisRef.checked) {
					var alreadyRecords = window.opener.document.getElementById(elementId+'_multipleSelectRecords').value;
					window.opener.document.getElementById(elementId+'_multipleSelectRecords').value = alreadyRecords + value + ",";
					alreadyPresent = false;
				}
				/* Remove From De Selected List */
				if(alreadyPresent && !thisRef.checked)
				removeElementIfExist(elementId+'_multipleSelectRecords',value);
}

function retriveValue(myJSONObject)
{
	return myJSONObject.columns[0].value;
}

function checkIfRecordExist(elementId, value)
{
	var alreadyRecords = window.opener.document.getElementById(elementId).value;
	var newArray = alreadyRecords.split(',');
	for(var i = 0; i< newArray.length; i++){
		if(newArray[i] == value)
		{
			return true;
		}
	}
	return false;
}

function removeElementIfExist(elementId, value)
{
	var alreadyRecords = window.opener.document.getElementById(elementId).value;
	var newArray = alreadyRecords.split(',');
	var index = -1;
				for ( var i = 0; i < newArray.length; i++) {
					var rowRecord = newArray[i];
					if (rowRecord === value || ($.isNumeric(value) && parseInt(value,10) == rowRecord)) {
						index = i;
						break;
					}
				}
				if (index > -1) {
					newArray.splice(index, 1);
				}
	window.opener.document.getElementById(elementId).value = newArray.join(",");
}

function checkIfRecordAlreadySelected(elementId, value, isPresent)
{
	var alreadyRecords = window.opener.document.getElementById(elementId).value;
	var newArray = alreadyRecords.split(',');
	for(var i = 0; i< newArray.length; i++){
		if(newArray[i] == value)
		{
			isPresent = true;
			return true;
		}
	}
	if (!isPresent)
		window.opener.document.getElementById(elementId).value = "";
	return false;
}
function setSelectedRecordsToText(elementId)
{
	var alreadySelected = window.opener.document.getElementById(elementId+'_multipleSelectRecords').value;
	
	if(alreadySelected[alreadySelected.length - 1] == ","){
		alreadySelected = alreadySelected.substr(0, alreadySelected.length - 1); // Removes last ',' 
	}
	window.opener.document.getElementById(elementId).value = alreadySelected;
	window.close();
}
