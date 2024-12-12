function getHistory(strUrl, frmId, rowIndex) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
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
function assignProduct(strUrl, frmId, rowIndex) {
	var frm = document.getElementById(frmId);
	var v = $('#payment' + rowIndex).val();
	var r = $('#recon' + rowIndex).val();
	document.getElementById("payInitiation").value = v;
	document.getElementById("reconAction").value = r;
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function filterAssignments(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function acceptRecord(strUrl, frmId, rowIndex) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function rejectRecord(strUrl, frmId, rowIndex) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	document.getElementById("txtMyProductRejectRemark").value = $(
			'#txtAreaRejectRemark').val();
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function disableAssignRecord(strUrl, frmId, rowIndex) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function enableAssignRecord(strUrl, frmId, rowIndex) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function discardRecord(strUrl, frmId, rowIndex) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getRejectPopupNew(strUrl, frmId, rowIndex) {
	$('#rejectPopup').dialog({
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		close: function() {$("#rejectCheck"+rowIndex).attr("checked", false);},
		buttons : {
			"Ok" : function() {
				rejectRecord(strUrl, frmId, rowIndex);
			},
			"Cancel" : function() {
				$("#rejectCheck"+rowIndex).attr("checked", false);
				$(this).dialog("close");
			}
		}
	});
	$('#rejectPopup').dialog("open");
}
function messagePopup() {
	$('#messagePopup').dialog({
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