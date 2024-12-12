function backToWorkflowProductLinkage(strUrl, frmId)
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
function discardRecord(strUrl,frmMain,index)
{
	var frm = document.getElementById("frmMain");
	document.getElementById("txtLineItemIndex").value = index;
	frm.action =strUrl ;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getWorkflowProducts(productCode) {
	setDirtyBit();
	var frm = document.getElementById("frmMain");
	frm.action = "newWorkflowProductLinkage.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function saveWorkflowProductLinkage() {
	var frm = document.getElementById("frmMain");
	frm.action = "saveWorkflowproductLinkage.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function updateWorkflowProductLinkage() {
	var frm = document.getElementById("frmMain");
	document.getElementById("txtLineItemIndex").value = 1;
	$('#mypProduct').removeAttr("disabled");
	frm.action = "updateWorkflowproductLinkage.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function acceptRejectRecord(strUrl, frmId, index) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtLineItemIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function rejectWorkflowProductRecord(strUrl, frmId, index,remarks)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtLineItemIndex").value = index;
	document.getElementById("txtRemarks").value=remarks;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function rejectRecord(strUrl, frmId, index) {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 473,
		modal : true,
		close: function() {$("#rejectCheck"+index).attr("checked", false);},
		buttons : {
			"OK" : function() {
		var remarks=$('#txtAreaRejectRemark').val();
		rejectWorkflowProductRecord(strUrl, frmId, index,remarks);
			},
			"CANCEL" : function() {
				$("#rejectCheck"+index).attr("checked", false);
				$(this).dialog("close");
			}
		}

	});
	$('#rejectPopup').dialog("open");
}
function getHistory(strUrl, frmId, invoiceNumber) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtLineItemIndex").value = invoiceNumber;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop = (screen.availHeight - 300) / 2;
	var intLeft = (screen.availWidth - 600) / 2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=600,height=300";
	window.open("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}
function addLinkage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewLinkage(strUrl, frmId, index) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtLineItemIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getConfirmationPopup(frmId, strUrl)
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

function enableDisableProductWorkflowLinkage(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
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