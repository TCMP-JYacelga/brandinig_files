/**
 * Function for downloading the attachement for a specified news feed. This
 * function directs the download to a new browser window as no page refresh is
 * required.
 * 
 * @param frmId
 *            The id of form whose contents will be posted.
 * @param destUrl
 *            The desitination url responsible for serving the attachment
 * @param intIndex
 *            The index of the news feed fow which the attachment is to be
 *            download
 */
function downloadAttachment(frmId, destUrl, intIndex) {
	var frm = document.getElementById(frmId);
	frm.target = "downloadWin";
	frm.action = destUrl;
	document.getElementById('txtIndex').value = intIndex;
	frm.submit();
}

/**
 * Function for downloading the pre-generated report. This function directs the
 * download to a new browser window as no page refresh is required.
 * 
 * @param frmId
 *            The id of form whose contents will be posted.
 * @param destUrl
 *            The desitination url responsible for serving the report
 * @param intIndex
 *            The index of the report
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
 * 
 * @param src
 *            The source control
 * @param index
 *            the mail details to be shown
 */
function showMailInfo(src, index) {
	var rec = mail_data[index];
	$('#mpFrom').text(rec.senderName + ' [' + rec.senderMail + ']');
	$('#mpTime').text(rec.msgTime);
	$('#mpSubject').text(rec.subject);
	$('#mpText').html(rec.messageText.replace(/(\r\n|[\r\n])/g, "<br />"));

	var pos = $(src).offset();
	var height = $('#mailContainer').height();
	$('#mailContainer').css({
				left : pos.left + 'px',
				top : pos.top - height - 10 + 'px'
			});
	$('#mailContainer').toggleClass('ui-helper-hidden');
}

function hideMailPopup() {
	$('#mailContainer').toggleClass('ui-helper-hidden');
}

function navigateTo(strUrl) {
	var frm = document.createElement('FORM');
	frm.appendChild(createnavFormField('INPUT', 'HIDDEN', csrfTokenName,
			tokVal));
	frm.action = strUrl;
	frm.name = 'frmMain';
	frm.id = 'frmMain';
	frm.method = "POST";
	document.body.appendChild(frm);
	frm.submit();
	document.body.removeChild(frm);
}

function createnavFormField(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	}
	
function toggleBannerCollapse(){	
		$(document).trigger('hidebanner');
}	
function closeBanner(bannerNumber){	
		if(bannerNumber === 1)
			$(document).trigger('closebanner1');
		
		if(bannerNumber === 2)
			$(document).trigger('closebanner2');
		
}
function prevImage(){	
		$('.jcarousel').jcarouselControl({
			target:    '-=1'
		});
}	
function nextImage(){	
		$('.jcarousel').jcarouselControl({
			target:    '+=1'
		});
}
function manageTypeCodeJsonObj(jsonObject) {
	var jsonObj ='';
	if(jsonObject  instanceof Object ==false)
		jsonObj =JSON.parse(jsonObject);
	if(jsonObject  instanceof Array)
		jsonObj =jsonObject;
	for (var i = 0; i < jsonObj.length; i++) {
		jsonObj[i].DESCR =  getLabel(jsonObj[i].CODE,jsonObj[i].DESCR);
	}
	if(jsonObject  instanceof Object ==false)
		jsonObj = JSON.stringify(jsonObj)
	return jsonObj;
}
function getJsonObj(jsonObject) {
    var jsonObj ='';
    if(jsonObject  instanceof Object ==false)
           jsonObj =JSON.parse(jsonObject);
    if(jsonObject  instanceof Array)
           jsonObj =jsonObject;
    for (var i = 0; i < jsonObj.length; i++) {
           jsonObj[i].instTypeDescription =  getLabel(jsonObj[i].instTypeCode,jsonObj[i].instTypeDescription);
    }
    if(jsonObject  instanceof Object ==false)
           jsonObj = JSON.stringify(jsonObj)
    return jsonObj;
}
