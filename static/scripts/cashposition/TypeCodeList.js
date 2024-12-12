function filterTypeCodeList(frmId, mode)
{
	var frm = document.getElementById(frmId);
	if ('AUTH_MODE' == mode)
	{
		frm.action = "filterTypeCodeAuthList.form";
	}
	else
	{
		frm.action = "filterTypeCodeList.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getRecord(json, elementId)
{
	var myJSONObject = JSON.parse(json);
	var inputIdArray = elementId.split("|");
	for (i = 0; i < inputIdArray.length; i++) {
		var field = inputIdArray[i];
		if (document.getElementById(inputIdArray[i])) {
			var type = document.getElementById(inputIdArray[i]).type;
			if (type == 'text') {
				document.getElementById(inputIdArray[i]).value = JSON
						.parse(myJSONObject).columns[0].value;
			} else {
				document.getElementById(inputIdArray[i]).innerHTML = JSON
						.parse(myJSONObject).columns[0].value;
			}
		}
	}
}

function saveUpdateTypeCode(frmId, strUrl)
{	
	$('.disabled').removeAttr("disabled");
	$("#typeCodeCategory").removeAttr("disabled");
	$("#typeCodeTxnLevel").removeAttr("disabled");
	$("#typeCodeTxnType").removeAttr("disabled");
	goToPage(frmId,strUrl);
}

function goToPage(frmId,strUrl)
{	
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	$("#typeCode").removeAttr("disabled");
	$("#typeCodeTxnLevel").removeAttr("disabled");
	$("#typeCodeCategory").removeAttr("disabled");
	$("#typeCodeTxnType").removeAttr("disabled");
	$("#mappingTypeCode").removeAttr("disabled");
	frm.submit();
}

function showNewTypeCodeForm(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "addNewTypeCode.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function editTypeCode(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function viewTypeCode(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getRejectPopup(checkBox, strUrl, frmId, rowIndex)
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		close: function() {$("#rejectCheck"+rowIndex).attr("checked", false);},
		buttons :[
			{
				text:getLabel('btnOk','Ok'),
				click : function() {
					rejectRecord(strUrl, frmId, rowIndex);
				}
			},
			{
				text:getLabel('btncancel','Cancel'),
				click : function() {
					checkBox.checked = false;
					$('#txtAreaRejectRemark').val("");
					$(this).dialog("close");
				}
			}
		]
	});
	$('#rejectPopup').dialog("open");
}
function rejectRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	document.getElementById("txtRejectRemark").value = $('#txtAreaRejectRemark').val();	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function historyPage(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=600,height=300";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}
function discardRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showMsgBoxforDiscard(strUrl, frmId, rowIndex) {
	$('#confirmDiscard').dialog({
		autoOpen : false,				
		width : 500,
		modal : true,
		buttons: [{
                          id:"btn-no-rep",
                          text: "No",
                          click: function() {
                        	  $(this).dialog("close");
                                }
                        },{
                        	id:"btn-yes-rep",
                            text: "Yes",
                            click: function() {
                            	discardRecord(strUrl, frmId, rowIndex);
							 }
                        }],
		bgiframe:true, 
		height: 155,
		open : function()
		{
		$('#btn-no-rep').blur();
		$('#btn-yes-rep').blur();
		}
	});
	$('#confirmDiscard').dialog("open"); 
}

function getMsgPopup() 
{
	$('#successMsgPopup').dialog({
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
function disableRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function enableRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function enableDisableExisitngTypeCode(){
	var isMapping  = document.getElementById("mappingCheck").checked;
	if(isMapping){
		$("#mappingTypeCode").removeAttr("disabled");
		$("#typeCodeSeekRef").removeClass("linkbox_grey");
		$("#typeCodeSeekRef").removeClass("seeklink_grey");
		$('#typeCodeSeekRef').addClass('linkbox');
		$('#typeCodeSeekRef').addClass('seeklink');
		$('#lblmappingTypeCode').addClass('required-lbl-right');
	} else {
		$("#mappingTypeCode").attr("disabled","disabled");
		$("#typeCodeSeekRef").addClass("linkbox_grey");
		$("#typeCodeSeekRef").addClass("seeklink_grey");
		$('#typeCodeSeekRef').removeClass('linkbox');
		$('#typeCodeSeekRef').removeClass('seeklink');
		$('#mappingTypeCode').val('');
		$('#lblmappingTypeCode').removeClass('required-lbl-right');
	}	
}