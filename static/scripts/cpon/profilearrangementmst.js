function goToTab(strUrl, frmId, tabName)
{
	var frm = document.getElementById(frmId);
	document.getElementById("currentTab").value=tabName;
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function setDirtyBit()
{
	dityBitSet=true;
}

function getCancelConfirmPopUp(strUrl) {
	if(dityBitSet)
	{
		$('#confirmMsgPopup').dialog({
			autoOpen : false,
			maxHeight: 550,
			minHeight:'auto',
			width : 400,
			modal : true,
			resizable: false,
			draggable: false
		});
		
		$('#confirmMsgPopup').dialog("open");
		
		$('#cancelBackConfirmMsg').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#doneBackConfirmMsgbutton').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
			gotoPage(strUrl);
		});
		
		$('#textContent').focus();
	}
	else
	{
		gotoPage(strUrl);
	}
}

function saveProfile(strUrl)
{
	var frm = document.forms["frmMain"];
	if(dityBitSet)
		document.getElementById("dirtyBitSet").value = true;
	frm.action = strUrl;	
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}


function toggleArrangementDetails(moduleId,arrangementTypeId)
{
	var module = $('#'+moduleId).val();
	var arrangementType = $('#'+arrangementTypeId).val();
	var hidebleDivs = null;
	if(!isEmpty(module) && !isEmpty(arrangementType))
	{
		$("#arrangementDetailDiv_"+module+"_"+arrangementType).show();
		hidebleDivs = $('[id^="arrangementDetailDiv_"]:not([id$="'+module+"_"+arrangementType+'"])');
		populateArrangementCode(module, arrangementType)
	}
	else
	{
		hidebleDivs = $('[id^="arrangementDetailDiv_"]');
	}
	hidebleDivs.hide();
	hidebleDivs.find("input[id^='parent_']").each(function(){
		var parentCode = $(this).val();
		$("#input_"+parentCode).prop('readonly',false) .val('0');
		$("#imgCheck_"+parentCode).prop('src','static/images/icons/icon_checked.gif');
		$("#flag_"+parentCode).val('Y');
		processDependentField(parentCode,'Y');
	});
}

function enableDisableField(elementCode,module,arrangementType)
{
	var field = document.getElementById("input_"+elementCode);
	var image = document.getElementById("imgCheck_"+elementCode);
	
	if (image.src.indexOf("checked_grey.gif") > -1){
		return false;
	}
	
	if (image.src.indexOf("icon_checked.gif") < 0)
	{
		image.src = "static/images/icons/icon_checked.gif";
		document.getElementById('flag_'+elementCode).value = "Y";
		$(field).prop('readonly',false);
		processDependentField(elementCode,"Y");
		
	} 
	else 
	{

		image.src = "static/images/icons/icon_unchecked.gif";
		document.getElementById('flag_'+elementCode).value = "N";
		$(field).prop('readonly',true) .val("0");
		processDependentField(elementCode,"N");
	}
	populateArrangementCode(module, arrangementType);
}

function processDependentField(elementCode, enableFlag)
{
	var childElements = $('input[name="relation_Y_'+elementCode+'"], input[name="relation_A_'+elementCode+'"]');
	
	if(childElements.length > 0){
			childElements.each(function(){
					var childCode = $(this).val();
					enableDisableDependentField(childCode,enableFlag)
			});
	}
	
	childElements = $('input[name="relation_N_'+elementCode+'"]');
	
	if(childElements.length > 0){
			childElements.each(function(){
					var childCode = $(this).val();
					enableDisableReverseField(childCode,enableFlag)
			});
	}
}

function enableDisableDependentField(childCode,enableFlag)
{
	if ("Y" === enableFlag)
	{
		$("#imgCheck_"+childCode).prop('src','static/images/icons/icon_unchecked.gif');
	} 
	else 
	{
		$("#imgCheck_"+childCode).prop('src','static/images/icons/icon_unchecked_grey.gif');

	}
	$("#input_"+childCode).prop('readonly',true) .val('0');
	$("#flag_"+childCode).val('N');
}

function enableDisableReverseField(childCode,enableFlag)
{
	if ("Y" === enableFlag)
	{
		$("#imgCheck_"+childCode).prop('src','static/images/icons/icon_unchecked_grey.gif');
		$("#input_"+childCode).prop('readonly',true) .val('0');
		$("#flag_"+childCode).val('N');
	} 
	else 
	{
		$("#imgCheck_"+childCode).prop('src','static/images/icons/icon_checked_grey.gif');
		$("#input_"+childCode).prop('readonly',false);
		$("#flag_"+childCode).val('Y');
	}
}

function populateArrangementCode(module, arrangementType)
{
	var arrangementCode = "";
	
	if(!isEmpty(module) && !isEmpty(arrangementType)){
		var value = "";
		var parentId = $("#parent_"+module+"_"+arrangementType).val();
		var appendElementId = $("input[name='relation_A_"+parentId+"']").val();
		var reverseElementId = $("input[name='relation_N_"+parentId+"']").val();
		
		if("Y" === $('#flag_'+parentId).val())
		{
			arrangementCode = "D";
			value = $('#input_'+parentId).val();
			if(!isEmpty(value)){
				if(value.indexOf('-') < 0) {
					value = "+" + value;
				}
			}
			else
			{
				$('#input_'+parentId).val('0');
				value = "+0";
			}
			
			if(appendElementId)
			{
				var appendElement =  $('#input_'+appendElementId);
				//appendElement length should be one
				if("Y" === $('#flag_'+appendElementId).val())
				{
					if(!isEmpty(appendElement.val()) && '0' !== appendElement.val()){
						value = value + "," + appendElement.val();
					}
				}
			}
			arrangementCode = arrangementCode + value;
		}
		else
		{
			arrangementCode = "CLEAR";
			//reverseElement length should be  one
			if(reverseElementId)
			{
				var reverseElement =  $('#input_'+reverseElementId);
				
				if("Y" === $('#flag_'+reverseElementId).val())
				{
					value = reverseElement.val();
					if(!isEmpty(value))
					{
						if(value.indexOf('-') < 0) {
							value = "+" + value;
						}
					}
					else
					{
						reverseElement.val('0');
						value = "+0";
					}
				}
				else
				{
					value = "+0";
				}
			}
			else
			{
				value = "+0";
			}
			arrangementCode = arrangementCode + value;
		}
	}
	
	$('#arrangementCode').val(arrangementCode);
}