function editEnrichDetail(strUrl, frmId, rowIndex) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtDetailRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
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
		value=$.trim(value);
		$("#description" + rowIndex).after(
				'<input id="txtDesc' + rowIndex + '" name="txtDesc' + rowIndex
						+ '" class="w7"  value="' + value + '"/>');
		$("#description" + rowIndex).hide();
	}
	if ($("#position" + rowIndex)) {
		var value = $("#position" + rowIndex).text();
		value=$.trim(value);
		$("#position" + rowIndex).after(
				'<input id="txtPos' + rowIndex + '" name="txtPos' + rowIndex
						+ '" class="w7"  value="' + value + '"/>');
		$("#position" + rowIndex).hide();
	}

	$("#cancelEnrichDetail" + rowIndex).show();
	$("#saveEnrichDetail" + rowIndex).show();
	$("#editEnrichDetail" + rowIndex).hide();
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
	function goToBack(frmId, strUrl) {
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
	function display(crt)
	{
		
		if(crt.value == 'A')
			{
				
				$('#showDeduc').show();
				$('#showenrichacceptance').show();
				$('#enrichmentShowBuyer').show();
				$('#showenrichdeduction').hide();
			}
			else
			{
				$('#showDeduc').hide();
			}
			
		
		if(crt.value == 'D')
		{
				$('#showDeduc').show();
				$('#showenrichdeduction').show();
				$('#enrichmentShowBuyer').show();
				$('#showenrichacceptance').hide();
		}
			
	}

	function enableMin(crt) {
		if (crt.value == 'Y') {
			$('#minValueAmt').removeAttr("readonly");
			$('#minValueAmt').show();
		} else {
			$('#minValueAmt').attr("readonly", "readonly");
			$('#minValueAmt').hide();
			$('#minValueAmt').attr("value", "");
		}
	}

	function enableMax(crt) {
		if (crt.value == 'Y') {
			$('#maxValueAmt').removeAttr("readonly");
			$('#maxValueAmt').show();
		} else {
			$('#maxValueAmt').attr("readonly", "readonly");
			$('#maxValueAmt').hide();
			$('#maxValueAmt').attr("value", "");
		}
	}

	function getInfoFile() {
		if (document.getElementById('fileUploadFlag').checked == true) {
			$('#fileMandatory').show();

		} else {
			$('#fileMandatory').hide();
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