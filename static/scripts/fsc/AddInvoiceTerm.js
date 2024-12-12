function onPenaltyTypeChange(ctrl)
{
	if($('#penaltyChargeType').val()=='V')
	{
		$('#gracePeriodType').attr("disabled","disabled");
		$('#penaltyGracePeriod').attr("disabled","disabled");
		$('#penaltyFrequency').attr("disabled","disabled");
		$('#penaltyFrequencyType').attr("disabled","disabled");
		$('#penalityApplTillFlag').attr("disabled","disabled");
		$('#penaltyInterestType').attr("disabled","disabled");	
	}
	else
	{
		$('#gracePeriodType').removeAttr("disabled");
		$('#penaltyGracePeriod').removeAttr("disabled");
		$('#penaltyFrequency').removeAttr("disabled");
		$('#penaltyFrequencyType').removeAttr("disabled");
		$('#penalityApplTillFlag').removeAttr("disabled");
		$('#penaltyInterestType').removeAttr("disabled");
	}	
}
function MakeTabActive(ctrlId, tabId1, tabId2)
{
	if($("#"+tabId1).hasClass('ui-state-active'))
	{
		return;
	}
	$("#"+tabId1).addClass('ui-state-active');
	if($("#"+tabId2).hasClass('ui-state-active'))
	{
		$("#"+tabId2).removeClass('ui-state-active');
	}
	else
	{
		return;
	}
	showHideActions(ctrlId, 'divTabs-1');
	showHideActions(ctrlId, 'divTabs-2');
}
function enableRebateEdit(rowIndex)
{
	if($("#rebateMinDays"+rowIndex))
	{
		var value = $("#rebateMinDays"+rowIndex).text();
		$("#rebateMinDays"+rowIndex).after('<input id="txtRMinDays'+rowIndex+'" name="txtRMinDays'+rowIndex+'" class="w6"  value="'+value+'"/>');
		$("#rebateMinDays"+rowIndex).hide();
	}	
	if($("#rebateMaxDays"+rowIndex))
	{
		var value = $("#rebateMaxDays"+rowIndex).text();
		$("#rebateMaxDays"+rowIndex).after('<input id="txtRMaxDays'+rowIndex+'" name="txtRMaxDays'+rowIndex+'" class="w6"  value="'+value+'"/>');
		$("#rebateMaxDays"+rowIndex).hide();
	}	
	if($("#rebateMinAmnt"+rowIndex))
	{
		var value = $("#rebateMinAmnt"+rowIndex).text();
		$("#rebateMinAmnt"+rowIndex).after('<input id="txtRMinAmnt'+rowIndex+'" name="txtRMinAmnt'+rowIndex+'" class="w6 numberBox"  value="'+value+'"/>');
		$("#rebateMinAmnt"+rowIndex).hide();
	}	
	if($("#rebateMaxAmnt"+rowIndex))
	{
		var value = $("#rebateMaxAmnt"+rowIndex).text();
		$("#rebateMaxAmnt"+rowIndex).after('<input id="txtRMaxAmnt'+rowIndex+'" name="txtRMaxAmnt'+rowIndex+'" class="w6 numberBox"  value="'+value+'"/>');
		$("#rebateMaxAmnt"+rowIndex).hide();
	}	
	if($("#rebateFixAmnt"+rowIndex))
	{
		var value = $("#rebateFixAmnt"+rowIndex).text();
		$("#rebateFixAmnt"+rowIndex).after('<input id="txtRFixAmnt'+rowIndex+'" name="txtRFixAmnt'+rowIndex+'" class="w6 numberBox"  value="'+value+'"/>');
		$("#rebateFixAmnt"+rowIndex).hide();
	}	
	if($("#rebateBasisRate"+rowIndex))
	{
		var value = $("#rebateBasisRate"+rowIndex).text();
		$("#rebateBasisRate"+rowIndex).after('<input id="txtRBRate'+rowIndex+'" name="txtRBRate'+rowIndex+'" class="w6 numberBox"  value="'+value+'"/>');
		$("#rebateBasisRate"+rowIndex).hide();
	}	
	if($("#rebateNotifyMethod"+rowIndex))
	{
		var value = $("#rebateNotifyMethod"+rowIndex).text();
		$("#rebateNotifyMethod"+rowIndex).after('<input id="txtRMethod'+rowIndex+'" name="txtRMethod'+rowIndex+'" class="w6" value="'+value+'"/>');
		$("#rebateNotifyMethod"+rowIndex).hide();
	}	
	$("#cancelRabate"+rowIndex).show();
	$("#saveRebate"+rowIndex).show();
	$("#editRebate"+rowIndex).hide();	
}
function disableRebateEdit(rowIndex)
{
	$("#txtRMinDays"+rowIndex).remove();
	$("#txtRMaxDays"+rowIndex).remove();
	$("#txtRMinAmnt"+rowIndex).remove();
	$("#txtRMaxAmnt"+rowIndex).remove();
	$("#txtRFixAmnt"+rowIndex).remove();
	$("#txtRBRate"+rowIndex).remove();
	$("#txtRMethod"+rowIndex).remove();
	
	$("#rebateMinDays"+rowIndex).show();
	$("#rebateMaxDays"+rowIndex).show();
	$("#rebateMinAmnt"+rowIndex).show();
	$("#rebateMaxAmnt"+rowIndex).show();
	$("#rebateFixAmnt"+rowIndex).show();
	$("#rebateBasisRate"+rowIndex).show();
	$("#rebateNotifyMethod"+rowIndex).show();
	
	$("#cancelRabate"+rowIndex).hide();
	$("#saveRebate"+rowIndex).hide();
	$("#editRebate"+rowIndex).show();
}
function enablePenaltyEdit(rowIndex)
{
	if($("#penaltyMinDays"+rowIndex))
	{
		var value = $("#penaltyMinDays"+rowIndex).text();
		$("#penaltyMinDays"+rowIndex).after('<input id="txtPMinDays'+rowIndex+'" name="txtPMinDays'+rowIndex+'" class="w6" value="'+value+'"/>');
		$("#penaltyMinDays"+rowIndex).hide();
	}	
	if($("#penaltyMaxDays"+rowIndex))
	{
		var value = $("#penaltyMaxDays"+rowIndex).text();
		$("#penaltyMaxDays"+rowIndex).after('<input id="txtPMaxDays'+rowIndex+'" name="txtPMaxDays'+rowIndex+'" class="w6" value="'+value+'"/>');
		$("#penaltyMaxDays"+rowIndex).hide();
	}	
	if($("#penaltyMinAmnt"+rowIndex))
	{
		var value = $("#penaltyMinAmnt"+rowIndex).text();
		$("#penaltyMinAmnt"+rowIndex).after('<input id="txtPMinAmnt'+rowIndex+'" name="txtPMinAmnt'+rowIndex+'" class="w6 numberBox"  value="'+value+'"/>');
		$("#penaltyMinAmnt"+rowIndex).hide();
	}	
	if($("#penaltyMaxAmnt"+rowIndex))
	{
		var value = $("#penaltyMaxAmnt"+rowIndex).text();
		$("#penaltyMaxAmnt"+rowIndex).after('<input id="txtPMaxAmnt'+rowIndex+'" name="txtPMaxAmnt'+rowIndex+'" class="w6 numberBox"  value="'+value+'"/>');
		$("#penaltyMaxAmnt"+rowIndex).hide();
	}	
	if($("#penaltyFixAmnt"+rowIndex))
	{
		var value = $("#penaltyFixAmnt"+rowIndex).text();
		$("#penaltyFixAmnt"+rowIndex).after('<input id="txtPFixAmnt'+rowIndex+'" name="txtPFixAmnt'+rowIndex+'" class="w6 numberBox"  value="'+value+'"/>');
		$("#penaltyFixAmnt"+rowIndex).hide();
	}	
	if($("#penaltyBasisRate"+rowIndex))
	{
		var value = $("#penaltyBasisRate"+rowIndex).text();
		$("#penaltyBasisRate"+rowIndex).after('<input id="txtPBRate'+rowIndex+'" name="txtPBRate'+rowIndex+'" class="w6 numberBox"  value="'+value+'"/>');
		$("#penaltyBasisRate"+rowIndex).hide();
	}	
	if($("#penaltyNotifyMethod"+rowIndex))
	{
		var value = $("#penaltyNotifyMethod"+rowIndex).text();
		$("#penaltyNotifyMethod"+rowIndex).after('<input id="txtPMethod'+rowIndex+'" name="txtPMethod'+rowIndex+'" class="w6" value="'+value+'"/>');
		$("#penaltyNotifyMethod"+rowIndex).hide();
	}	
	$("#cancelPenalty"+rowIndex).show();
	$("#savePenalty"+rowIndex).show();
	$("#editPenalty"+rowIndex).hide();	
}
function disablePenaltyEdit(rowIndex)
{
	$("#txtPMinDays"+rowIndex).remove();
	$("#txtPMaxDays"+rowIndex).remove();
	$("#txtPMinAmnt"+rowIndex).remove();
	$("#txtPMaxAmnt"+rowIndex).remove();
	$("#txtPFixAmnt"+rowIndex).remove();
	$("#txtPBRate"+rowIndex).remove();
	$("#txtPMethod"+rowIndex).remove();
	
	$("#penaltyMinDays"+rowIndex).show();
	$("#penaltyMaxDays"+rowIndex).show();
	$("#penaltyMinAmnt"+rowIndex).show();
	$("#penaltyMaxAmnt"+rowIndex).show();
	$("#penaltyFixAmnt"+rowIndex).show();
	$("#penaltyBasisRate"+rowIndex).show();
	$("#penaltyNotifyMethod"+rowIndex).show();
	
	$("#cancelPenalty"+rowIndex).hide();
	$("#savePenalty"+rowIndex).hide();
	$("#editPenalty"+rowIndex).show();	
}
function goToBack(frmId, strUrl)
{
	if($('#dirtyBit').val()=="1")
		getConfirmationPopup(frmId, strUrl);
	else
    {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	}
}
function addNewInvoiceTerm(frmId, strUrl)
{
		$('#gracePeriodType').removeAttr("disabled");
		$('#penaltyGracePeriod').removeAttr("disabled");
		$('#penaltyFrequency').removeAttr("disabled");
		$('#penaltyFrequencyType').removeAttr("disabled");
		$('#penalityApplTillFlag').removeAttr("disabled");
		$('#penaltyInterestType').removeAttr("disabled");
		$('#rebateBasisCode').removeAttr("disabled");
		$('#rebateChargeType').removeAttr("disabled");
		$('#penaltyChargeType').removeAttr("disabled");
		$('#penaltyBasisType').removeAttr("disabled");
		var frm = document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
}
function openTermDetailForm(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function addPenaltyItem(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.appendChild(document.getElementById("commonDiv"));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function deletePenaltyItem(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtDetailRecordIndex").value = rowIndex;
	frm.appendChild(document.getElementById("commonDiv"));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function editPenaltyItem(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtDetailRecordIndex").value = rowIndex;
	frm.appendChild(document.getElementById("commonDiv"));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function addRebateItem(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.appendChild(document.getElementById("commonDiv"));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function deleteRebateItem(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtDetailRecordIndex").value = rowIndex;
	frm.appendChild(document.getElementById("commonDiv"));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function editRebateItem(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtDetailRecordIndex").value = rowIndex;
	frm.appendChild(document.getElementById("commonDiv"));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getSaveConfirmationPopup(frmId, strUrl) {
	$('#saveConfirmationPopup').dialog( {
		autoOpen : false,
		height : 150,
		width : 420,
		modal : true,
		buttons : {
				"Save" : function() {
					addNewInvoiceTerm(frmId, strUrl);
				},
				"Cancel" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#saveConfirmationPopup').dialog("open");
}
function getConfirmationPopup(frmId, strUrl, strUrlSave)
{
	$('#confirmPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Yes" : function() {
					var frm = document.getElementById(frmId);
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
					},
				"No" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#confirmPopup').dialog("open");
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}

function messagePopup() {
$('#messagePopup').dialog( {
	autoOpen : true,
	height : 150,
	width : 350,
	modal : true,
	buttons : {
			"OK" : function() {
				$(this).dialog('close');
			}
	}
});
$('#messagePopup').dialog('open');
}