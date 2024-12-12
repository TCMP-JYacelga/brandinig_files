/**
 * Very simple function to submit the form.
 */
function savePreferences() {
	var frm = document.forms['frmMain'];
	var cboTo = document.getElementById('dashAccounts');
	for (i = 0; i < cboTo.length; i++) {
		cboTo.options[i].selected = true;
	}
	if (frm) {
		frm.action = "updatePreferences.form"
		frm.submit();
	}
}

function addSelected() {
	var cboFrom,cboTo;

	cboFrom = document.getElementById('stdAccounts');
	cboTo = document.getElementById('dashAccounts');
	addRemove(cboFrom, cboTo);
}

function removeSelected() {
	var cboFrom,cboTo;

	cboFrom = document.getElementById('stdAccounts');
	cboTo = document.getElementById('dashAccounts');
	addRemove(cboTo, cboFrom);
}

function addRemove(cboFrom, cboTo) {
	var opt, optNew;
	// Add selected element to cboTo
	for (var i = 0; i < cboFrom.length; i++) {
		opt = cboFrom.options[i];
		if (opt.selected) {
			optNew = document.createElement('option');
			optNew.text =  opt.text;
			optNew.value = opt.value;
			optNew.selected = true;
			cboTo.add(optNew, null);
		}
	}

	// Delete the selected element from cboFrom
	for (var i = cboFrom.length - 1; i >= 0; i--) {
		opt = cboFrom.options[i];
		if (opt.selected) cboFrom.remove(i);
	}
}
