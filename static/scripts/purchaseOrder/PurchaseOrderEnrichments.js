/**
 * 
 */

function doButtonDisabled() {

	if ($('#txtMypProduct').val() == "") {
		$('#addNew')
				.attr(
						"class",
						"ui-button ui-widget ui-state-default ui-corner-all ui-button-disabled ui-state-disabled");
		return true;
	} else {
		if (cEdit == "true") {
			$('#addNew').attr("class",
					"ui-button ui-widget ui-state-default ui-corner-all");
			return false;
		} else {
			$('#addNew')
					.attr(
							"class",
							"ui-button ui-widget ui-state-default ui-corner-all ui-button-disabled ui-state-disabled");
			return true;
		}

	}
}

function dofilterButtonDisabled() {
	if ($('#txtMypProduct').val() == "") {
		$('#productFilter')
				.attr(
						"class",
						"ui-button ui-widget ui-state-default ui-corner-all ui-button-disabled ui-state-disabled");
		return true;
	} else {
		$('#productFilter').attr("class",
				"ui-button ui-widget ui-state-default ui-corner-all");
		return false;
	}
}

function filterEnrichments(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	if (dofilterButtonDisabled() != true)
		frm.submit();
}

function showAddNewPoEnrichmentForm(frmId) {

	var frm = document.getElementById(frmId);
	
	frm.action = "newPoEnrichment.form";
	frm.target = "";
	frm.method = "POST";
	if (doButtonDisabled() != true)
		frm.submit();
}

function getHistory(strUrl, frmId, rowIndex) {

	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = rowIndex;
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

function viewEnrichment(strUrl, frmId, index) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function editEnrichment(strUrl, frmId, rowIndex) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptEnrichment(strUrl, frmId, index) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function disableEnrichment(checkBox, strUrl, frmId, rowIndex) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = rowIndex;
	document.getElementById("txtCheckboxValue").value = checkBox.checked;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


function enableEnrichment(checkBox, strUrl, frmId, rowIndex) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = rowIndex;
	document.getElementById("txtCheckboxValue").value = checkBox.checked;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getRejectPopupNew(strUrl, frmId, rowIndex) {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		close: function() {$("#rejectCheck"+rowIndex).attr("checked", false);},
		buttons : {
			"Ok" : function() {
				rejectEnrichment(strUrl, frmId, rowIndex);
			},
			"Cancel" : function() {
				$("#rejectCheck"+rowIndex).attr("checked", false);
				$(this).dialog("close");
			}
		}
	});
	$('#rejectPopup').dialog("open");
}

function discardEnrichment(strUrl, frmId, index) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = index;
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


function rejectEnrichment(strUrl, frmId, index) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = index;
	document.getElementById("txtEnrichmentRejectRemark").value = $(
			'#txtAreaRejectRemark').val();
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}