function selectNode(seekFrm)
{
	var xpath = document.getElementById('txtPath').value;
	var pathComponent = document.getElementById('txtPathComponent').value;
	var txtSequenceNumberComponent = document.getElementById('txtSequenceNumberComponent').value; 
	var sequenceNumber = document.getElementById('sequenceNumber').value;
	window.opener.setBandPath(xpath, pathComponent,txtSequenceNumberComponent,sequenceNumber);
	window.close();
}
function setBandPath(xpath, pathComponent)
{
	document.getElementById(pathComponent).value=xpath;
}
function closeSeek()
{
	window.close();
}
 /*IRISADM-150 : Implicit DataType conversion*/
function exploreDataType(dataTypeToMap)
{
	$("#divFileTree").find("li").each(function(){
		var dataType = $(this).attr("dataType");
		if(dataType == dataTypeToMap && dataType != 'STRING')
		{
			if(!$(this).hasClass("jstree-leaf"))
			{		
				if(!$(this).find("a:gt(0)").hasClass("red"))
				{
					$(this).find("a:gt(0)").addClass("orange");
					$(this).attr("class", "jstree-last jstree-open");
				}
			}
			if($(this).hasClass("jstree-leaf"))
			{	
				if(!$(this).find("a").hasClass("red"))
				{
					$(this).find("a").addClass("orange");
				}
			}
		}
	});	
}
function showWarningDiv()
{
	$('#messageArea').removeAttr('class');
	$('#messageArea').addClass('errors');
	return;
}
function matchDataType(dataTypeToMap,dataTypeOfElement)
{
	var validType = false;
	 switch(dataTypeToMap) 
	 {
	   case 'STRING':
		        validType = true;
		    break;
	   case 'NUMBER':
	   case 'DECIMAL':
	   case 'DATE':
	   case 'DATETIME':
		   if(dataTypeToMap == dataTypeOfElement)
				 validType = true;
		    break;
	   default:
			return false;
	  }
	 return validType;
}