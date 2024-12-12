function goToPage(frmId,strUrl)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function PopulateSelectedTypeCode(fromList, toList)
{
	var i, cntr ;
	var isNew = true;
		
	if (document.getElementById(fromList).selectedIndex !=-1)
	{
		var RemLength = document.getElementById(toList).length;	
		var AddLength = document.getElementById(fromList).length;		
		var selectedItem; 
		var selectedText;		
		var selectedValue ;				
		var cntr;
		
		for (i=0; i<=AddLength-1; i++)
		{			
			if (document.getElementById(fromList).options[i].selected)
			{					
				selectedItem = document.getElementById(fromList).selectedItem;				     
				selectedText = document.getElementById(fromList).options[i].text;		
				selectedValue = document.getElementById(fromList).options[i].value;		
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById(toList).options[RemLength] = newoption;					
				RemLength = document.getElementById(toList).length;
			}
		}
		i=0;
		cntr=0;

		while(i<AddLength)
		{	
			if (document.getElementById(fromList).options[cntr].selected)
			{					
				document.getElementById(fromList).options[cntr]=null;
				cntr--;
			}
			 cntr++;
			 i++;
		} 
		document.getElementById(fromList).selectedIndex=-1;
	}
}
function PopulateAll(fromList, toList)  
{
		var i,cntr;
		var isNew = true;	
		var RemLength = document.getElementById(toList).length;	
		var AddLength = document.getElementById(fromList).length;		
		var selectedItem; 
		var selectedText;		
		var selectedValue ;				
		var cntr;
	
		for (i=0; i<=AddLength-1; i++)
		{	
				selectedItem = document.getElementById(fromList).selectedItem;				     
				selectedText = document.getElementById(fromList).options[i].text;		
				selectedValue = document.getElementById(fromList).options[i].value;		
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById(toList).options[RemLength] = newoption;					
				RemLength = document.getElementById(toList).length;
		}
		i=0;	
		cntr = -1;
		for (i=0; i<=AddLength-1; i++)
		{	
			cntr++;		
			document.getElementById(fromList).options[cntr]=null;
			cntr--;	
		} 
}
function RemoveAll(fromList, toList)  
{
		var i,cntr;
		var isNew = true;
		var RemLength = document.getElementById(toList).length;	
		var AddLength = document.getElementById(fromList).length;		
		var selectedItem; 
		var selectedText;		
		var selectedValue ;				
		var cntr;
	
		for (i=0; i<=RemLength-1; i++)
		{			
				selectedItem = document.getElementById(toList).selectedItem;				     
				selectedText = document.getElementById(toList).options[i].text;		
				selectedValue = document.getElementById(toList).options[i].value;		
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById(fromList).options[AddLength] = newoption;					
				AddLength = document.getElementById(fromList).length;
		}
		i=0;	
		cntr = -1;
		for (i=0; i<=RemLength-1; i++)
		{	
			cntr++;		
			document.getElementById(toList).options[cntr]=null;
			cntr--;	
		} 
}
function RemoveSelectedTypeCode(fromList, toList)   
{
	var i,cntr;
	var isNew = true;
	
	if (document.getElementById(toList).selectedIndex !=-1)
	{
		var RemLength = document.getElementById(toList).length;	
		var AddLength = document.getElementById(fromList).length;		
		var selectedItem; 		
		var selectedText;		
		var selectedValue ;				
		var cntr;
		
		for (i=0; i<RemLength; i++)
		{			
			if (document.getElementById(toList).options[i].selected)
			{	
				selectedItem = document.getElementById(toList).selectedItem;				     
				selectedText = document.getElementById(toList).options[i].text;		
				selectedValue = document.getElementById(toList).options[i].value;		
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById(fromList).options[AddLength] = newoption;				
				AddLength = document.getElementById(fromList).length;

			}

		}
		i=0;
		cntr=0;

		while(i<RemLength)
		{	
			if (document.getElementById(toList).options[cntr].selected)
			{					
				document.getElementById(toList).options[cntr]=null;
				cntr--;
			}
			 cntr++;
			 i++;
		} 

		document.getElementById(toList).selectedIndex=-1;
	}
}
function saveUpdateFormula(frmId, strUrl)
{
	selectTypeCodeLists("selectedPositivePreviousDayList");
	selectTypeCodeLists("selectedNegativePreviousDayList");
	selectTypeCodeLists("selectedPositiveIntraDayList");
	selectTypeCodeLists("selectedNegativeIntraDayList");
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function selectTypeCodeLists(listName)
{
	 var obj = document.getElementById(listName);
	    for (var i=0;i<obj.options.length; i++)
		{
		  obj.options[i].value=obj.options[i].value;
	      obj.options[i].selected = true;
		  }
		return true;
}
function getMsgPopup() {
	$('#successMsgPopup').dialog( 
{
		autoOpen : true,
		height : 150,
		width : 350,
		modal : true,
		buttons :[
			{
				text:getLabel('btnOk','Ok'),
				click : function() {
					$(this).dialog("close");
				}
			}
		]
	});
	$('#successMsgPopup').dialog('open');
}
function getRecord(json,elementId)
{		
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
	
    for(i=0; i<inputIdArray.length; i++)
	{
    	var field = inputIdArray[i];
    	if(document.getElementById(inputIdArray[i]))
    	{
    	var type = document.getElementById(inputIdArray[i]).type;
    	if(type=='text'){
    	 document.getElementById(inputIdArray[i]).value = JSON.parse(myJSONObject).columns[0].value;}
    	else {
    	 document.getElementById(inputIdArray[i]).innerHTML = JSON.parse(myJSONObject).columns[0].value;} 
    	}
	}    
}