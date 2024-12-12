function showAddNewEnrichmentForm(frmId) {

	var frm = document.getElementById(frmId);
	frm.action = "newInvoiceEnrichment.form";
	frm.target = "";
	frm.method = "POST";
	if (doButtonDisabled() != true)
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
function addNewAcceptanceEnrichtForm(frmId) {
	var frm = document.getElementById(frmId);
	frm.action = "newInvAcceptEnrichment.form";
	frm.target = "";
	frm.method = "POST";
	if (doButtonDisabled() != true)
		frm.submit();
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

function filterEnrichments(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	if (dofilterButtonDisabled() != true)
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

function acceptEnrichment(strUrl, frmId, index) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
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

function discardEnrichment(strUrl, frmId, index) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function doButtonDisabled() {

	if ($('#txtmypProduct').val() == "") {
		$('#addNew')
				.attr(
						"class",
						"ui-button ui-widget ui-state-default ui-corner-all ui-button-disabled ui-state-disabled");
		$('#addNew').attr("disabled","disabled");
		return true;
	} else {
		if (cEdit == "true") {
			$('#addNew').attr("class",
					"ui-button ui-widget ui-state-default ui-corner-all");
			$('#addNew').removeAttr("disabled");
			$(document).ready(function() 
			{
			    $("input", "#buttonbar").button();
			});
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
	if ($('#txtmypProduct').val() == "") {
		$('#productFilter')
				.attr(
						"class",
						"ui-button ui-widget ui-state-default ui-corner-all ui-button-disabled ui-state-disabled");
		$('#productFilter').attr("disabled","disabled");
		return true;
	} else {
		$('#productFilter').attr("class",
				"ui-button ui-widget ui-state-default ui-corner-all");
		$('#productFilter').removeAttr("disabled");
		
		return false;
	}
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


function addEnrichmentDetails(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function enableEnrichDetailEdit(rowIndex) {
	if ($("description" + rowIndex)) {
		var value = $("#description" + rowIndex).text();
		$("#description" + rowIndex).after(
				'<input id="txtDesc' + rowIndex + '" name="txtDesc' + rowIndex
						+ '" class="w7"  value="' + value + '"/>');
		$("#description" + rowIndex).hide();
	}
	if ($("#position" + rowIndex)) {
		var value = $("#position" + rowIndex).text();
		$("#position" + rowIndex).after(
				'<input id="txtPos' + rowIndex + '" name="txtPos' + rowIndex
						+ '" class="w7"  value="' + value + '"/>');
		$("#position" + rowIndex).hide();
	}

	$("#cancelEnrichDetail" + rowIndex).show();
	$("#saveEnrichDetail" + rowIndex).show();
	$("#editEnrichDetail" + rowIndex).hide();
}

function editEnrichDetail(strUrl, frmId, rowIndex) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtDetailRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function disableEnrichDetailEdit(rowIndex) {
	$("#txtDesc" + rowIndex).remove();
	$("#txtPos" + rowIndex).remove();

	$("#description" + rowIndex).show();
	$("#position" + rowIndex).show();

	$("#cancelEnrichDetail" + rowIndex).hide();
	$("#saveEnrichDetail" + rowIndex).hide();
	$("#editEnrichDetail" + rowIndex).show();
}

function deleteEnrichDetail(strUrl, frmId, rowIndex) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtDetailRecordIndex").value = rowIndex;
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

/*################ scripts for Add MyProductEnrichMent ###################*/
function goToBack(frmId,strUrl) {
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
function addEnrichment(strUrl, frmId) {
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function saveAndAddEnrichment(strUrl, frmId) {
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function updateEnrichment(strUrl, frmId) {
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function updateAndAddEnrichment(strUrl, frmId) {
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getInfo(crt) {
	
	//setDirtyBit();
	if (crt.value == 'S') {
		$('#enrichmentLength').show();
		$('#enrichmentLengthLbl').show();
	} else {
		$('#enrichmentLength').hide();
		$('#enrichmentLengthLbl').hide();
	}
	if (crt.value == 'A') {
		$('#minVal').show();
		$('#maxVal').show();
	
		if ($('#MinValueFlag:checked').val() == 'Y') {
			$('#minValueAmt').show();
			$('#minValueAmt').removeAttr("readonly");
		}
		else {
				$('#minValueAmt').hide();
				$('#minValueAmt').attr("value", "");
			}

		if ($('#MaxValueFlag:checked').val() == 'Y') {
				$('#maxValueAmt').show();
				$('#maxValueAmt').removeAttr("readonly");
		}
		else {
				$('#maxValueAmt').hide();
				$('#maxValueAmt').attr("value", "");
			}

	} else {
		$('#minVal').hide();
		$('#maxVal').hide();
	}	
}

function enableMin(crt) {
	//setDirtyBit();
	if (crt.value == 'Y') {
		$('#minValueAmt').removeAttr("readonly");
		$('#minValueAmt').show();
	} else {
		$('#minValueAmt').hide();
		$('#minValueAmt').attr("value", "");
	}
	
}

function enableMax(crt) {
	//setDirtyBit();
	if (crt.value == 'Y') {
		$('#maxValueAmt').removeAttr("readonly");
		$('#maxValueAmt').show();
	} else {
		$('#maxValueAmt').hide();
		$('#maxValueAmt').attr("value", "");
	}
}

function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
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
jQuery.fn.dateTextBox = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) {
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad for TAB
							return (key == 9 || key==8 || key==46);
							})
			})
};

/*################ scripts for Add MyProductEnrichMent ends###################*/