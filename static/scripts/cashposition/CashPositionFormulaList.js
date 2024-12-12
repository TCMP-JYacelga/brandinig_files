function showNewFormulaForm(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "newCashPositionFormula.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function editFormula(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
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
function filterFormulaList(frmId, mode)
{
	var frm = document.getElementById(frmId);
	if ('AUTH_MODE' == mode)
	{
		frm.action = "filterCashPositionFormulaAuthList.form";
	}
	else
	{
		frm.action = "filterCashPositionFormulaList.form";
	}
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
			},
		]
	});
	$('#rejectPopup').dialog("open");
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
function viewCashPositionFormula(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
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
