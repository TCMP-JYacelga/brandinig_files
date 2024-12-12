function printSingleRecord(strUrl, frmId, refId) {
	var frm = document.getElementById(frmId);
	$("#txnReferenceNumber").val(refId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewBillOfExchange(strUrl, frmId, refId) {
	var frm = document.getElementById(frmId);
	$("#txnReferenceNumber").val(refId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function switchField() {
	if ($('#filterBy').val() == 'DATED') {
		$('#textSpan').hide();
		$('#dateSpan').show();
	} else {
		$('#dateSpan').hide();
		$('#textSpan').show();
	}
}
function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

jQuery.fn.dateTextBox = function() {
	return this.each(function() {
		$(this).keydown(function(e) {
			var key = e.charCode || e.keyCode || 0;
			// allow backspace, tab, delete, arrows, numbers and
			// keypad for TAB
			return (key == 9 || key == 8 || key == 46);
		})
	})
};
function applySimpleFilter(strUrl, frmId) {
	goToPage(strUrl, frmId);
}
function getAdvancedFilterPopup(strUrl, frmId) {
	var defaultFromDate = btns['defaultFromDate'];
	var defaultToDate = btns['defaultToDate'];
	var fromDate = $('#fromDate').val();
	var toDate = $('#toDate').val();
	var dueFromDate = $('#fromDueDate').val();
	var dueToDate = $('#toDueDate').val();
	if (fromDate == null || fromDate == "") {
		$('#fromDate').addClass('grey');
		$('#fromDate').val(defaultFromDate);
	}
	if (toDate == null || toDate == "") {
		$('#toDate').addClass('grey');
		$('#toDate').val(defaultToDate);
	}
	if (dueFromDate == null || dueFromDate == "") {
		$('#fromDueDate').addClass('grey');
		$('#fromDueDate').val(defaultFromDate);
	}
	if (dueToDate == null || dueToDate == "") {
		$('#toDueDate').addClass('grey');
		$('#toDueDate').val(defaultToDate);
	}

	buttonsOpts[btns['cancelBtn']] = function() {
		$('#filterForm').each(function() {
			this.reset();
			$('#txtAmount').val("0.00");
			fromDate = "";
			toDate = "";
			dueFromDate = "";
			dueToDate = "";

		});
		$(this).dialog("close");
	};
	buttonsOpts[btns['goBtn']] = function() {
		if ($('#fromDate').val() == defaultFromDate) {
			$('#fromDate').val("");
		}
		if ($('#fromDueDate').val() == defaultFromDate) {
			$('#fromDueDate').val("");
		}
		if ($('#toDate').val() == defaultToDate) {
			$('#toDate').val("");
		}
		if ($('#toDueDate').val() == defaultToDate) {
			$('#toDueDate').val("");
		}
		if ($('#txtAmount').val() == "") {
			$('#txtAmount').val("0");
		}

		$(this).dialog("close");
		goToPage(strUrl, frmId);
	};
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		height : 400,
		width : 473,
		modal : true,
		buttons : buttonsOpts,
		open: function() {
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
            
            $('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');

            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').attr("title","Go");
            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').find('.ui-button-text').prepend('<span class="fa fa-filter">&nbsp;&nbsp</span>');
        }
	});
	$('#advancedFilterPopup').dialog("open");
}
function getPrintPopup(strUrl, frmId) {

	buttonsOpts[btns['cancelBtn']] = function() {
		$('#printForm').each(function() {
			this.reset();
		});
		$(this).dialog("close");
	};
	buttonsOpts[btns['goBtn']] = function() {
		$(this).dialog("close");
		goToPage(strUrl, frmId);
	};
	$('#printPopup').dialog({
		autoOpen : false,
		height : 200,
		width : 473,
		modal : true,
		buttons : buttonsOpts,
		open: function(){
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
			$('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').attr("title","Go");
            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').find('.ui-button-text').prepend('<span class="fa fa-check-circle">&nbsp;&nbsp</span>');
		}
	});
	$('#printPopup').dialog("open");
}

function fromDate_TextChanged(element, defaultFromDate) {
	var dateValue = $(element).val();
	if (dateValue != '' || dateValue != null) {
		$(element).removeClass('grey');
		;
		$(element).addClass('black');
	}
	if ((dateValue == '' || dateValue == null)) {
		$(element).removeClass('black');
		;
		$(element).addClass('grey');
		$(element).val(defaultFromDate);
	}
}
function toDate_TextChanged(element, defaultToDate) {
	var dateValue = $(element).val();
	if (dateValue != '' || dateValue != null) {
		$(element).removeClass('grey');
		;
		$(element).addClass('black');
	}
	if ((dateValue == '' || dateValue == null)) {
		$(element).removeClass('black');
		;
		$(element).addClass('grey');
		$(element).val(defaultToDate);
	}
}