function goToBack(frmId, strUrl) {
		var frm = document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function getInfo(crt) {
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

		} else {
			$('#minVal').hide();
			$('#maxVal').hide();
		}

		$('#minValueAmt').hide();
		$('#maxValueAmt').hide();

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

	function setDirtyBit() {
		document.getElementById("dirtyBit").value = "1";
	}

	function getInfoFile() {
		if (document.getElementById('fileUploadFlag1').checked == true) {
			$('#fileMandatory').show();

		} else {
			$('#fileMandatory').hide();
		}

	}