function gotoPage(strUrl)
{
	var frm = document.forms["frmMain"];
	$('input').removeAttr('disabled');
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function toggleCheckUncheck(imgElement,flag) 
{
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1)
	{
		imgElement.src = "static/images/icons/icon_checked.gif";	
		$('#'+flag).val('Y');
	}
	else
	{
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		$('#'+flag).val('N');
	}
}
function getCancelConfirmPopUp(strUrl) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['okBtn']] = function() {
		$(this).dialog("close");
		gotoPage(strUrl);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
	};
	if(dityBitSet)
	{
	$('#confirmMsgPopup').dialog({
				autoOpen : false,
				height : 150,
				width : 430,
				modal : true,
				buttons : buttonsOpts
			});
	$('#confirmMsgPopup').dialog("open");
	}
	else
	{
		gotoPage(strUrl);
	}
}

function saveProfile(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	selectTypeCodeLists('selectedTypeCodeList');
	$("#typeCodeCategory,#typeCodeCategoryDesc").removeAttr('disabled');
	$("#summaryComputationType").removeAttr('disabled');
	$("#typeCode").removeAttr('disabled');	
	$("#formula").removeAttr('readonly');
	$("#intradayFormula").removeAttr('readonly');
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function setDirtyBit()
{
	dityBitSet=true;
}

jQuery.fn.ForceAlphaNumericOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e) 
						{
							// allows only alphabets & numbers, backspace, tab
							var keycode = e.which || e.keyCode;						
							if ((keycode >= 48 && keycode <= 57) || (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122)
									|| keycode == 8 || keycode == 9)
								return true;

							return false;
						})
			})
};


var strAddedCodesList = [];
function PopulateSelectedTypeCode(fromList, toList)
{
	var i, cntr;
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
				selectedText = document.getElementById(fromList).options[i].text;		
				selectedValue = document.getElementById(fromList).options[i].value;
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById(toList).options[RemLength] = newoption;								
				RemLength = document.getElementById(toList).length;
				strAddedCodesList.push(selectedValue);
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

function PopulateAllTypeCodes(fromList, toList)
{
	var i, cntr;
	var isNew = true;
	if (document.getElementById(fromList).length>0)
	{
		var RemLength = document.getElementById(toList).length;	
		var AddLength = document.getElementById(fromList).length;		
		var selectedItem; 
		var selectedText;		
		var selectedValue ;				
		var cntr;
		for (i=0; i<=AddLength-1; i++)
		{
			selectedText = document.getElementById(fromList).options[i].text;		
			selectedValue = document.getElementById(fromList).options[i].value;
			newoption = new Option(selectedText, selectedValue, false, false);
			document.getElementById(toList).options[RemLength] = newoption;	
			RemLength = document.getElementById(toList).length;			
			strAddedCodesList.push(selectedValue);		
		}
	$('#'+fromList).empty();
	document.getElementById(fromList).selectedIndex=-1;
	}
}

var strRemovedAddCodesList = [];
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
				document.getElementById(fromList).options[AddLength++] = newoption;				
				strRemovedAddCodesList.push(selectedValue);
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

function RemoveAllTypeCodes(fromList, toList)   
{
	var i,cntr;
	if (document.getElementById(toList).length>0)
	{
		
		var RemLength = document.getElementById(toList).length;	
		var AddLength = document.getElementById(fromList).length;		
		var selectedItem; 		
		var selectedText;		
		var selectedValue ;				
		var cntr;
		for (i=0; i<RemLength; i++)
		{
			selectedItem = document.getElementById(toList).selectedItem;				     
			selectedText = document.getElementById(toList).options[i].text;		
			selectedValue = document.getElementById(toList).options[i].value;
			newoption = new Option(selectedText, selectedValue, false, false);
			document.getElementById(fromList).options[AddLength] = newoption;				
			AddLength = document.getElementById(fromList).length;
			strRemovedAddCodesList.push(selectedValue);
		}
		$('#'+toList).empty();
		document.getElementById(toList).selectedIndex=-1;
	}
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