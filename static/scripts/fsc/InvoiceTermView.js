function MakeTabActive(ctrlId, tabId1, tabId2) {
	if ($("#" + tabId1).hasClass('ui-state-active')) {
		return;
	}
	$("#" + tabId1).addClass('ui-state-active');
	if ($("#" + tabId2).hasClass('ui-state-active')) {
		$("#" + tabId2).removeClass('ui-state-active');
	} else {
		return;
	}
	showHideActions(ctrlId, 'divTabs-1');
	showHideActions(ctrlId, 'divTabs-2');
}

function viewInvoiceTermGoToBack(frmId, txtTermMode, masterUrl, authUrl) {
	var frm = document.getElementById(frmId);
	var mode = document.getElementById(txtTermMode);

	if (null != mode && 'AUTH_MODE' == mode.value) {
		frm.action = authUrl;
	} else {
		frm.action = masterUrl;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}