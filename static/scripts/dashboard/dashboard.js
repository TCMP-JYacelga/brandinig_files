/**
 * Function for downloading the attachement for a specified news feed. This function directs the download to a new browser window
 * as no page refresh is required.
 * @param frmId The id of form whose contents will be posted.
 * @param destUrl The desitination url responsible for serving the attachment
 * @param intIndex The index of the news feed fow which the attachment is to be download
 */
function downloadAttachment(frmId, destUrl, intIndex) {
	var frm = document.getElementById(frmId);
	frm.target = "downloadWin";
	frm.action = destUrl;
	document.getElementById('txtIndex').value = intIndex;
	frm.submit();
}

/**
 * Function for downloading the pre-generated report. This function directs the download to a new browser window
 * as no page refresh is required.
 * @param frmId The id of form whose contents will be posted.
 * @param destUrl The desitination url responsible for serving the report
 * @param intIndex The index of the report
 */
function downloadReport(frmId, destUrl, intIndex) {
	var frm = document.getElementById(frmId);
	frm.target = "downloadWin";
	frm.action = destUrl;
	document.getElementById('txtIndex').value = intIndex;
	frm.submit();
}

function markRead(frmId, intIndex) {
	var frm = document.getElementById(frmId);
	frm.action = "markRead.form";
	document.getElementById('txtIndex').value = intIndex;
	frm.submit();
}

/**
 * function to display the mail details ina popup.
 * @param src The source control
 * @param index the mail details to be shown
 */
function showMailInfo(src, index) {
	var rec = mail_data[index];
	$('#mpFrom').text(rec.senderName + ' [' + rec.senderMail + ']');
	$('#mpTime').text(rec.msgTime);
	$('#mpSubject').text(rec.subject);
	$('#mpText').html(rec.messageText.replace(/(\r\n|[\r\n])/g, "<br />"));

	var pos = $(src).offset();
	var height = $('#mailContainer').height();
	$('#mailContainer').css({left: pos.left + 'px', top: pos.top - height - 10 + 'px'});
	$('#mailContainer').toggleClass('ui-helper-hidden');
}

function hideMailPopup() {
	$('#mailContainer').toggleClass('ui-helper-hidden');
}
