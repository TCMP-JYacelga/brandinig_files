/**
 * Helper function for changing the languages.
 * @param strlang the new language to switch to.
 * @author Prasad P. Khandekar
 * @lastmodified Nov. 18, 2010
 */
function changeLanguage(strLang) {
	var fld = $('#current_locale');
	var frm; 
	if (document.forms["frmMain"])
		frm = document.forms["frmMain"];
	else
		frm = fld.closest('form');
	if (fld != null && frm != null) {
		fld.val(strLang);
		frm.action = location.href.split('?')[0];
		frm.submit();
	}
}

/**
 * Helper function for show the select language dialog
 * @author Prasad P. Khandekar
 * @lastmodified Nov. 18, 2010
 */
function selectLanguage() {
	$('#langSwitcher').dialog({autoOpen:false,resizable:false,width:180,height:"auto", 
								modal:true, position: ['right','top']});
	$('#langSwitcher').dialog("open");							
}