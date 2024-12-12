var attachmentRecord = null;
var notesRecord = null; /*This will hold the record of note*/
function showRemarksPopup(strRemark,strAction,strNoteFilename,record)
{
	var strBtnText = strAction === 'ADD' ? "Save" : "Update" ;
	$('#remarksPopUp').dialog({
		autoOpen : false,
		maxHeight : 275,
		minHeight :156,
		width : 400,
		resizable: false,
		draggable: false,
		modal : true,
	/*	buttons :[{
	       	   id: 'saveBtn',
	       	   text: strBtnText,
	       	   click: function(){		    
	       		var addedfile = "";
				var strRemark = $("#fieldRemark").val();
				var resetclicked = $("#resetFileFlag").val() === 'N' ? false : true ;
				var data = new FormData();
				if (resetclicked)
				{
					data.append("OldNoteFilename",strNoteFilename);
				}
				if (null!=document.getElementsByName('noteFile') && null!=document.getElementsByName('noteFile'))
				{
					data.append("noteFile",document.getElementsByName('noteFile'));
					data.append("OldNoteFilename",strNoteFilename);	
					addedfile = $("#noteFile").val();
				}
				data.append("noteFilename",strNoteFilename);
				data.append("noteText",strRemark);
				
	       		$(document).trigger("addNotes",[id,data,strRemark,addedfile]);
				$(this).dialog("close");
	       	   }
          		  {
	       	   id: 'cancelBtn',
	       	   text: 'Cancel',
	       	   click: function(){
		       		$(this).dialog("close");
	       	   }
          }],*/
		open: function() {
			notesRecord = record;
			if(typeof(record) == "object" && !Ext.isEmpty(record.get('identifier')))
				$("#recId").attr('value', record.get('identifier'));
			else
				$("#recId").attr('value', record);
			$("#noteFilenameVal").attr('value', strNoteFilename);
			$("#lblSelectedFileName").empty();
			if(strNoteFilename != null && strNoteFilename != '')
			{
				if(!Ext.isEmpty(strNoteFilename) &&  strNoteFilename.length > 20)
					var filename = strNoteFilename.substring(0,20) + "....";
				
				var showText = strNoteFilename || getLabel('viewFile','View File');
				
				if (!$('#attachFileDiv').hasClass('ui-helper-hidden')) {
					$('#attachFileDiv').addClass('ui-helper-hidden');
				}
				if ($('#resetFileDiv').hasClass('ui-helper-hidden')) {
					$('#resetFileDiv').removeClass('ui-helper-hidden');					
				}
				//$("#btnViewNoteFile").attr('value', showText);				
				$("#btnViewNoteFile").attr('title', showText);
				$("#btnViewNoteFile").html(showText);
			}
			else
			{
				if ($('#attachFileDiv').hasClass('ui-helper-hidden')) {
					$('#attachFileDiv').removeClass('ui-helper-hidden');				
				}
				if (!$('#resetFileDiv').hasClass('ui-helper-hidden')) {
					$('#resetFileDiv').addClass('ui-helper-hidden');
				}
				$("#noteFile").attr('value', strNoteFilename);
			}
			$("#fieldRemark").attr('value', strRemark);
        }
	});
	$('#remarksPopUp').dialog("open");
}
function showTxnDetailsPopup(record,currentAccountNumber,strServiceParam)
{
	var strValue = '';
	attachmentRecord = record;
	$('#txnDetailsPopUp').dialog({
		autoOpen : false,
		maxHeight : 550,
		minHeight :156,
		width : 850,
		resizable: false,
		draggable: false,
		modal : true,
	/*	buttons :[{
			 id: 'saveBtn',
	       	 text: 'Report',
	       	 click: function(){	
	       		showReport(record);
	       		$(this).dialog("close");
	       	 }
		},{
	       	   id: 'cancelBtn',
	       	   text: 'Cancel',
	       	   click: function(){
		       		$(this).dialog("close");
	       	   }
          }],*/
		open: function() {
			
			/*strValue = getTxnAmount(record.get('creditUnit'), record.get('debitUnit'));
			
			$("#txndate").attr('value', record.get('postingDate') || '');
			$("#typeCodeDesc").attr('value', record.get('typeCodeDesc') || '');
			
			if (strValue != null && strValue != '') {
				if (strValue.indexOf("-") == 0) {
					strValue = strValue.substring(1);
					$("#amount").attr('value', "$" + (strValue));
					$("#amount").addClass('red');
				} else {
					$("#amount").attr('value', "$" + (strValue));
					if ($("#amount").hasClass('red'))
						$("#amount").removeClass('red');
				}
			} else {
				$("#amount").attr('value', '');
			}
			
			$("#accountId").attr('value', currentAccountNumber);
			$("#bankRef").attr('value', record.get('bankRef') || '');
			$("#customerRef").attr('value', record.get('customerRefNo') || '');
			$("#text").attr('value', record.get('text') || '');
			var strFlag= record.get('remittanceTextFlag');
			if(strFlag=="N")
			{					
				$("#remTextId").hide();				
			}
			else
			{
				$("#remTextId").show();
				$("#remText").attr('value', record.get('remittance') || '');
			}
			
			if (mapService['loanSubFacility'] == strServiceParam)
			{
				$('#checkNoContainer').addClass('ui-helper-hidden');
				$('#orgNameContainer').addClass('ui-helper-hidden');
			}
			else
			{
				$("#orgName").attr('value', record.get('info2') || '');
				$("#checkNo").attr('value', record.get('info3') || '');
			}
			$("#fxRate").attr('value', record.get('info1') || '');*/
			
			function tooltip(reference){
				   $(reference).prop("title",string);
		}
			
			strValue = getTxnAmount(record.get('creditUnit'), record.get('debitUnit'));
			
			if (!Ext.isEmpty(record.get('creditUnit')) && record.get('creditUnit') != 0) {
				document.getElementById('CRDRAmount').innerHTML = 'Credit Amount';
			} else if (!Ext.isEmpty(record.get('debitUnit')) && record.get('debitUnit') != 0) {
				document.getElementById('CRDRAmount').innerHTML = 'Debit Amount';
			} else if ((Ext.isEmpty(record.get('debitUnit')) || record.get('debitUnit') === 0)
					&& (Ext.isEmpty(record.get('creditUnit')) || record.get('creditUnit') === 0)) {
				document.getElementById('CRDRAmount').innerHTML = 'Amount';
			}
			
			var makerStamp,txnDate;					
			
			makerStamp = Ext.util.Format.date(Ext.Date.parse(record.get('postingDate'),strExtApplicationDateFormat),strExtApplicationDateFormat);
			txnDate = makerStamp;
					
			$("#txndate").text(txnDate || '');
			$("#txndate").prop("title",txnDate || '');
			
			$("#typeCodeDesc").text( decodeFinComponent(record.get('typeCodeDesc') || ''));
			$("#typeCodeDesc").prop("title",decodeFinComponent(record.get('typeCodeDesc') || ''));
			
			if (strValue != null && strValue != '') {
				if (strValue.indexOf("-") == 0) {
					strValue = strValue.substring(1);
					$("#amount").text(record.get('currencySymbol') + ' '+ (strValue));
					$("#amount").addClass('red');
					$("#amount").prop("title",record.get('currencySymbol') +' '+(strValue));
				} else {
					$("#amount").text(record.get('currencySymbol') +' ' +(strValue));
					$("#amount").prop("title",record.get('currencySymbol') +' '+(strValue));

					if ($("#amount").hasClass('red'))
						$("#amount").removeClass('red');
				}
			} else {
				$("#amount").text('');
			}
			
			$("#accountId").text(currentAccountNumber);
			$("#accountId").prop("title",currentAccountNumber);
			
			$("#bankRef").text(decodeFinComponent(record.get('bankRef') || ''));
			$("#bankRef").prop("title",decodeFinComponent(record.get('bankRef') || ''));
			
			
			$("#customerRef").text(decodeFinComponent(record.get('customerRefNo') || ''));
			$("#customerRef").prop("title",decodeFinComponent(record.get('customerRefNo') || ''));
			
			$("#text").text(decodeFinComponent(record.get('text').substring(0,300) || ''));
			$("#text").prop('title',decodeFinComponent(record.get('text')  || ''));
			
			var strFlag= record.get('remittanceTextFlag');
			if(strFlag=="N")
			{					
				$("#remTextId").hide();				
			}
			else
			{
				$("#remTextId").show();
				$("#remText").text(decodeFinComponent(record.get('remittance') || ''));
				if($("#remText").text()=='')
				{
				$("#remitDisplay").hide();
				}
				else
				{
					$("#remitDisplay").show();
				}
			}
			
			if (mapService['loanSubFacility'] == strServiceParam)
			{
				$('#checkNoContainer').addClass('ui-helper-hidden');
				$('#orgNameContainer').addClass('ui-helper-hidden');
			}
			else
			{
				$("#orgName").text(decodeFinComponent(record.get('info2') || ''));
				$("#checkNo").text(decodeFinComponent(record.get('info3') || ''));
			}
			$("#fxRate").text(decodeFinComponent(record.get('info1') || ''));
		}
	});
	$('#txnDetailsPopUp').dialog("open");
	$('#txndateDiv').focus();
	autoFocusOnFirstElement(null, 'txnDetailsPopUp', true);
}

function getTxnAmount(creditUnit, debitUnit) {
	if (!Ext.isEmpty(creditUnit) && creditUnit != 0) {
		return creditUnit;
	} else if (!Ext.isEmpty(debitUnit) && debitUnit != 0) {
		return debitUnit;
	} else if ((Ext.isEmpty(debitUnit) || debitUnit === 0)
			&& (Ext.isEmpty(creditUnit) || creditUnit === 0)) {
		// console.log("Error Occured.. amount empty");
		return 0
	}
}
function showReport(record, actionType) {
	var me = this;	
	var field = null, strValue = '', txnType = '', reportType = 'I', remApplicable = 'Y';
	var accountNmbr = record.get('accountNo') || '';
	var sessionNmbr = record.get('sessionNumber') || '';
	var sequenceNmbr = record.get('sequenceNumber') || '';
	var accountID = record.get('accountId') || '';
	
	strValue = me.getTxnAmount(record.get('creditUnit'), record.get('debitUnit'));	
	reportType = record.get('isHistoryFlag');		
	/*if (!Ext.isEmpty(strValue)) {
		if (strValue.indexOf("-") < 0) {
			txnType = 'Debit';
		} else {
			txnType = 'Credit';
		}
	} else  {
		txnType = 'Credit';
	}*/
	if (record.get('debitUnit') != '' && record.get('debitUnit') != '0.00') {
		txnType = 'Debit';
	} else {
		txnType = 'Credit';
	}

	var includeRemitOnly = '';
	if(null!=actionType && ''!=actionType)
	{
		if('pdf'==actionType)
		{
			includeRemitOnly = document.getElementById("includeRemitOnlypdf").checked;
		} else {
			includeRemitOnly = document.getElementById("includeRemitOnly").checked;
		}
	}	
    if(summaryType == null || summaryType == '')
		if(reportType == 'I')
			summaryType = 'intraday';
		else
			summaryType = 'previousday';
		
	var strUrl = 'services/btrActivities/'+summaryType+'/generateReport' +'.'+ actionType; //pdf,csv,tsv,xls
	strUrl += '?&$expand=txndetails';
	strUrl += '&$accountID=' + accountID;
	strUrl += '&$accountNmbr=' + accountNmbr;
	strUrl += '&$sequenceNmbr=' + sequenceNmbr;
	strUrl += '&$sessionNmbr=' + sessionNmbr;
	strUrl += '&$reportType=' + reportType; // TODO
	strUrl += '&$txnType=' + txnType; 
	strUrl += '&$remApplicable=' + includeRemitOnly; // TODO
	strUrl += '&$includeRemitOnly=' + includeRemitOnly; 
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

function downloadReport(record, strExtn) {
	var me = this;	
	var strUrl = null;
	var field = null, strValue = '', txnType = '', reportType = 'I', remApplicable = 'Y';
	var accountNmbr = record.get('accountNo') || '';
	var sessionNmbr = record.get('sessionNumber') || '';
	var sequenceNmbr = record.get('sequenceNumber') || '';
	var accountID = record.get('accountId') || '';
	
	strValue = me.getTxnAmount(record.get('creditUnit'), record.get('debitUnit'));	
	reportType = record.get('isHistoryFlag');		
	if (!Ext.isEmpty(strValue)) {
		if (strValue.indexOf("-") == 0) {
			txnType = 'Debit';
		} else {
			txnType = 'Credit';
		}
	} else  {
		txnType = 'Credit';
	}
	if(null!=strExtn && ''!=strExtn)
	{
		strUrl = 'services/btrActivities/'+summaryType+'/generateReport.'+strExtn;
	}	
	else
	{
		strUrl = 'services/btrActivities/'+summaryType+'/generateReport.pdf';	
	}	
	
	strUrl += '?&$expand=txndetails';
	strUrl += '&$accountID=' + accountID;
	strUrl += '&$accountNmbr=' + accountNmbr;
	strUrl += '&$sequenceNmbr=' + sequenceNmbr;
	strUrl += '&$sessionNmbr=' + sessionNmbr;
	strUrl += '&$reportType=' + reportType; // TODO
	strUrl += '&$txnType=' + txnType; 
	strUrl += '&$remApplicable=' + remApplicable; // TODO
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}
function showEmailPopUp(record)
{
	var accountNmbr = record.get('accountNo') || '';
	var sessionNmbr = record.get('sessionNumber') || '';
	var sequenceNmbr = record.get('sequenceNumber') || '';
	var accountID = record.get('accountId') || '';
	var creditUnit = record.get('creditUnit');
	var debitUnit = record.get('debitUnit');
	var historyFlag = record.get('isHistoryFlag');
	attachmentRecord = record;
	$('#emailPopupErrorDiv').addClass('ui-helper-hidden');
	
	$('#emailDetailsPopUp').dialog({
		autoOpen : false,
		maxHeight : 550,
		minHeight :156,
		width : 500,
		modal : true,
		resizable: false,
		draggable: false,
	/*	buttons :[{
	       	   id: 'sendBtn',
	       	   text: 'Send',
	       	   click: function(){
	       		sendMail(record);
				$(this).dialog("close");
	       	   }
          },{
	       	   id: 'cancelBtn',
	       	   text: 'Cancel',
	       	   click: function(){
		       		$(this).dialog("close");
	       	   }
          }],*/
		open: function() {
			$("#toEmailField").attr('value','');
			$("#subjectField").attr('value','');
			$("#toEmailField").removeClass('requiredField');
			$("#subjectField").removeClass('requiredField');
			$("#msgBody").attr('value','');
			showEmailDetails();
			$("#accId").attr('value', accountID);
			$("#accNo").attr('value', accountNmbr);
			$("#seqNo").attr('value', sequenceNmbr);
			$("#sessNo").attr('value', sessionNmbr);
			$("#crUnit").attr('value', creditUnit);
			$("#drUnit").attr('value', debitUnit);
			$("#historyFlag").attr('value', historyFlag);
			$("#sendBtn").button("disable");
        }
	});
	$('#emailDetailsPopUp').dialog("open");
}
function showEmailDetails()
{
	var field = null, strValue = null;
	if ($("label[for='lblSendDate']"))
	{
		var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
		var dateLabel = Ext.Date.format(date, strExtApplicationDateFormat);
		$("label[for='lblSendDate']").html(dateLabel);
	}
	if ($("label[for='lblFromEmail']"))
	{
		$("label[for='lblFromEmail']").html(useremail);
	}
}
function sendMail(record)
{
	var arrayJson = new Array();
	var arrError = new Array();
	var strSqlDateFormat = 'Y-m-d';
	var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
	var dateLabel = Ext.Date.format(date, strSqlDateFormat);
	var objJson = {
			emailTo : $("#toEmailField").val(),
			emailFrom : useremail,
			emailSubject : $("#subjectField").val(),
			identifier : record.get('identifier'),
			emailMsg :  $("#msgBody").val(),
			emailSendDate : dateLabel
		};
	arrayJson.push(objJson);
	if($("#toEmailField").val() != "" && !(emailId_Chk($("#toEmailField").val())))
	{
			arrError.push({	"errorMessage" : "Please enter valid To Email ID"});
			$("#toEmailField").addClass('requiredField');
			paintEmailPopupErrors('#emailPopupErrorDiv','#emailPopupErrorMessage',arrError);
		}
	else if($("#toEmailField").val() == "" && $("#subjectField").val() == "")
	{
		arrError.push({	"errorMessage" : "Please enter To Email ID and Subject"});
		$("#subjectField").addClass('requiredField');
		$("#toEmailField").addClass('requiredField');
		paintEmailPopupErrors('#emailPopupErrorDiv','#emailPopupErrorMessage',arrError);
	}
	else if($("#toEmailField").val() == "")
	{
		arrError.push({	"errorMessage" : "Please enter To Email ID"});
		$("#toEmailField").addClass('requiredField');
		paintEmailPopupErrors('#emailPopupErrorDiv','#emailPopupErrorMessage',arrError);
	}
	else if($("#subjectField").val() == "")
	{
		arrError.push({	"errorMessage" : "Please enter Subject"});
		$("#subjectField").addClass('requiredField');
		paintEmailPopupErrors('#emailPopupErrorDiv','#emailPopupErrorMessage',arrError);
	}
	else
	{
	var strValue = '', txnType = '', reportType = 'I', remApplicable = 'Y';
		strValue = getTxnAmount(record.get('creditUnit'), record.get('debitUnit'));	
		reportType = record.get('isHistoryFlag');		
		if (!Ext.isEmpty(strValue)) {
			if (strValue.indexOf("-") == 0) {
				txnType = 'Debit';
			} else {
				txnType = 'Credit';
			}
		} else  {
			txnType = 'Credit';
		}
	var strUrl =  'services/btrActivities/'+summaryType+'/sendActivityEmail.srvc?'+csrfTokenName + '=' + csrfTokenValue
	strUrl += '&$reportType=' + reportType; // TODO
	strUrl += '&$txnType=' + txnType; 
	strUrl += '&$remApplicable=' + remApplicable; // TODO	
	/*var activityGrid = me.parent;
	if (activityGrid)
		activityGrid.setLoading(true);*/
	Ext.Ajax.request({
			url : strUrl,
			jsonData : Ext.encode(arrayJson || {}),
			success : function(response) {
				if (response) {
					var data = Ext.decode(response.responseText);
					if (!Ext.isEmpty(data) && data.success == "Y") {
						closeEmailPopup();
						
						Ext.MessageBox.show({
							title : getLabel(
									'sendActivityEmailSuccessPopUpTitle',
									'Message'),
							msg : getLabel(
									'sendActivityEmailSuccessPopUpMsg',
									'Mail sent successfully..!'),
							buttons : Ext.MessageBox.OK,
							buttonText: {
					            ok: getLabel('btnOk', 'OK')
								} ,
							cls : 't7-popup',
							icon : Ext.MessageBox.INFO
						});
							
						/*if (activityGrid)
								activityGrid.setLoading(false);*/
					} else {
						arrError.push({	"errorMessage" : "Error while sending mail..!"});
							paintEmailPopupErrors('#emailPopupErrorDiv','#emailPopupErrorMessage',arrError);
						/*if (activityGrid)
							activityGrid.setLoading(false);*/
					}
				}
			},
			failure : function(response) {
					arrError.push({	"errorMessage" : "Error while sending mail..!"});
					paintEmailPopupErrors('#emailPopupErrorDiv','#emailPopupErrorMessage',arrError);
				/*if (activityGrid)
					activityGrid.setLoading(false);*/
			}
		});
		}
}
function paintEmailPopupErrors(errorDiv,errorMsgDiv,arrError){
	if(!$(errorDiv).is(':visible')){
		$(errorDiv).removeClass('ui-helper-hidden');
	}$(errorMsgDiv).empty();
	if (arrError && arrError.length > 0) {
		$.each(arrError, function(index, error) {
		var errorMsg = error.errorMessage,element=null;
		element = $('<p>').text( errorMsg);
		element.appendTo(errorMsgDiv);			
		});
	}
	
}

function viewEmailAttachment()
{
	var me = this;
	var strValue = '', txnType = '', reportType = 'I', remApplicable = 'Y';
	
	var accountNmbr = $("#accNo").val();
	var sessionNmbr =  $("#sessNo").val();
	var sequenceNmbr = $("#seqNo").val();
	var accountID = $("#accId").val();
	var creditUnit = $("#crUnit").val();
	var debitUnit =  $("#drUnit").val();
	var reportType = $("#historyFlag").val();
	
	strValue = getTxnAmount(creditUnit, debitUnit);
	
	if (!Ext.isEmpty(strValue)) {
		if (strValue.indexOf("-") == 0) {
			txnType = 'Debit';
		} else {
			txnType = 'Credit';
		}
	} else  {
		txnType = 'Credit';
	}
	//download txn details report
	var strUrl = 'services/btrActivities/'+summaryType+'/generateReport.pdf?';
	strUrl += '$expand=txndetails';
	strUrl += '&$accountID=' + accountID;
	strUrl += '&$accountNmbr=' + accountNmbr;
	strUrl += '&$sequenceNmbr=' + sequenceNmbr;
	strUrl += '&$sessionNmbr=' + sessionNmbr;
	strUrl += '&$reportType=' + reportType; // TODO
	strUrl += '&$txnType=' + txnType; 
	strUrl += '&$remApplicable=' + remApplicable; // TODO
	
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(me.createFormField('INPUT', 'HIDDEN',
	csrfTokenName, tokenValue));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}
function showAdditionalInfoPopup(record)
{
	$('#additionalInfoPopUp').dialog({
		autoOpen : false,
		maxHeight : 550,
		minHeight :(screen.width) > 1024 ? 156 : 0,
		width : 870,
		modal : true,
		resizable: false,
		draggable: false,
		/*buttons :[{
	       	   id: 'okBtn',
	       	   text: 'Ok',
	       	   click: function(){
		       		$(this).dialog("close");
	       	   }
          }],*/
		open: function() {
			showAdditionalInfo(record);
        }
	});
	$('#additionalInfoPopUp').dialog("open");
	$('#accountDisplayDiv').focus();
	autoFocusOnFirstElement(null, 'additionalInfoPopUp', true);
}
function showAdditionalTypeCodePopup()
{
	$('#additionalTypeCodePopUp').dialog({
		autoOpen : false,
		maxHeight : 550,
		minHeight :(screen.width) > 1024 ? 156 : 0,
		width : 830,
		modal : true,
		resizable: false,
		draggable: false,
		/*buttons :[{
	       	   id: 'closeBtn',
	       	   text: getLabel('close','Close'),
	       	   click: function(){
		       		$(this).dialog("close");
	       	   }
          }],*/
		open: function() {
			showAdditionalTypeCodes(typeCodes,serviceParam);
        }
	});
	$('#additionalTypeCodePopUp').dialog("open");
	$('#additionalTypeCodePopUp').focus();
	autoFocusOnFirstElement(null, 'additionalTypeCodePopUp', true);
}
function showAdditionalTypeCodes(typeCodes, serviceParam) {
	$('#additionalTypeCodePopUp').html('');
	var contentTpl = "<label>{0}</label>&nbsp;:&nbsp;<span>{1}</span>";
	var parentDiv = $('<div class="form-group">');
	var firstrow = true;
	var rowDiv = $('<div class="row form-group">');
	var tAmount = '';
	if (Ext.isEmpty(objDefPref['ACTIVITY']['RIBBON'][serviceParam]))	
	{
		var model = objDefPref['ACTIVITY']['RIBBON']['BR_RIBBON_GENERIC']['columnModel'];
	}
	else
	{
		var model = objDefPref['ACTIVITY']['RIBBON'][serviceParam]['columnModel'] || objDefPref['ACTIVITY']['RIBBON']['BR_RIBBON_GENERIC']['columnModel'];
	}
	var objMap = {};
	jQuery.each(typeCodes, function(i, val) {
		objMap[(val || {}).typeCode] = val;
	});
	var index = 0;
	// if(typeCodesSign !== 0)
	// tAmount= (typeCodesSign==1?typeCodesCcy+''+val.typeCodeAmount :
	// '-'+typeCodesCcy+''+Math.abs(val.typeCodeAmount));
	jQuery.each(model, function(i, cfg) {
		var val = (objMap[cfg.colId] || {});
		var typeCodesSign = val.typeCodeAmount ? val.typeCodeAmount < 0 ? -1
				: 1 : 0
		if (typeCodesSign !== 0) {
			if (val.dataType === 'count')
				tAmount = (typeCodesSign == 1 ? val.typeCodeAmount : val.typeCodeAmount);
			else
				tAmount = (typeCodesSign == 1 ? typeCodesCcy + ''
						+ val.typeCodeAmount : typeCodesCcy + val.typeCodeAmount);
		}
		var contentDiv = $('<div>');
		if(val.typeCodeDescription != undefined){
			var htmltoRender = Ext.String.format(contentTpl,
					val.typeCodeDescription, tAmount);
			contentDiv.html(htmltoRender);
			contentDiv.addClass('col-sm-4');
			contentDiv.appendTo(rowDiv);
			if ((index + 1) % 3 === 0 || index + 1 === typeCodes.length) {
				rowDiv = $('<div class="row form-group">');
			}
			rowDiv.appendTo(parentDiv);
			index++;
		}
	});

	var buttonDiv = $('<div class="ux-dialog-footer"><ul class="ft-bar"><li class="ft-bar-stretch"></li>'
			+ '<li><button id="cancelBtn"  tabindex=1 class="ft-button ft-button-primary" onClick="closeSummaryInfoPopup();" onKeydown="restrictTabKey(event);">'
			+ getLabel('btnClose', 'Close') + '</button></li></ul></div>');
	$('#cancelBtn').bind('keydown',function(){
		restrictTabKey(event);
	});
	
	parentDiv.appendTo($('#additionalTypeCodePopUp'));
	buttonDiv.appendTo($('#additionalTypeCodePopUp'));

}
function closeSummaryInfoPopup()
{
	$('#additionalTypeCodePopUp').dialog("close");
}
function setPopUpData(record) {
	var me = this;
	var field = null, strValue = '';

	/*field = $("label[for='accountDisplay']");
	strValue = record.get('accountNumber') || '';
	if (!Ext.isEmpty(field)) {
		$("label[for='accountDisplay']").html(strValue);
	}

	field =  $("label[for='currencyDisplay']");
	strValue = record.get('currencyCode') || '';
	if (!Ext.isEmpty(field)) {
		//$("label[for='currencyDisplay']").html(strValue);
	}

	field = $("label[for='dateDisplay']");
	strValue = record.get('summaryDate') || '';
	if (!Ext.isEmpty(field)) {
		//$("label[for='dateDisplay']").html(strValue);
	}*/
	
	$('#accountDisplay').text(record.get('accountNumber') || '');
	$('#accountDisplay').prop('title',record.get('accountNumber') || '');
	
	$('#currencyDisplay').text(record.get('currencyCode') || '');
	$('#currencyDisplay').prop('title',record.get('currencyCode') || '');
	
	$('#dateDisplay').text(record.get('summaryDate') || '');
	$('#dateDisplay').prop('title',record.get('summaryDate') || '');
}
function showAdditionalInfo(record)
{
	var me = this;
	var jsonId = "{\"identifier\":" + "\"" + record.raw.identifier + "\"}";
	var _url = 'services/balanceSummary/'+summaryType+'/additionalinfo';
	if(Ext.isDefined(record) 
			&& Ext.isDefined(record.raw) 
			&& Ext.isDefined(record.raw.isHistoryFlag) 
			&& record.raw.isHistoryFlag == 'H') {
		_url = 'services/btrBalanceHistory/'+ summaryType+'/additionalinfo.json';
	}
	Ext.Ajax.request({
				url : _url,
				method : 'POST',
				jsonData : Ext.decode(jsonId),
				success : function(response) {
					$("#borderPanel").empty();
					$("#txnDetailsPanel").empty();
					me.setPopUpData(record);
					if(!Ext.isEmpty(response.responseText) && response.responseText != null && response.responseText != undefined){
						var data = Ext.decode(response.responseText);
						var showFlag = setDetailData(data);
						if (showFlag) {
								$('#txnDetailsPanel').removeClass('ui-helper-hidden');
								$('#errorPanel').addClass('ui-helper-hidden');
						} else {
							$('#txnDetailsPanel').addClass('ui-helper-hidden');
							$('#errorPanel').removeClass('ui-helper-hidden');
						}
					}
				},
				failure : function(response) {
				}

			});
}
function setDetailData(jsonData)
{
	var me = this;
	var arrLabels = jsonData.summaryInfoLabels;
	var arrValues = jsonData.summaryInfoValues;
	var borderPanel = Ext.create('Ext.panel.Panel', {
					width : 'auto',
					autoHeight : true,
					itemId : 'borderPanel',
					layout : {
						type : 'vbox'
					},
					items : [{
						xtype : 'label',
						cls : 'page-heading-bottom-border borderPanel-section-line'
						//width : 610,
						//margin : '10 0 0 10'
					}]
					//renderTo : 'borderPanel'
				});
	var panelDetail = Ext.create('Ext.panel.Panel', {
					//width : 520,
					autoHeight : true,
					itemId : 'parentPanel',
					/*layout : {
						type : 'vbox'
					},*/
					layout : 'column',
					items : [],
					renderTo : 'txnDetailsPanel'
				});
	if (!Ext.isEmpty(panelDetail)) {
		panelDetail.removeAll();
		if (Ext.isEmpty(arrLabels)) {
			return false;
		}
		if (arrLabels.length != arrValues.length) {
			return false;
		}
		if (!Ext.isEmpty(arrLabels) && !Ext.isEmpty(arrValues)) {
			var labelsListLength = arrLabels.length;
			if (arrLabels.length == arrValues.length) {
				for (var index = 0; index < labelsListLength; index++) {
					
					//remove duplicate fields Ccy desc and Account
					if(arrLabels[index]=="Account"){
						delete arrLabels[index];
						delete arrValues[index];
					}	
					if(arrLabels[index]=="Currency"){
						delete arrLabels[index];
						delete arrValues[index];
					}
					
					if (!Ext.isEmpty(arrValues[index])) {
						var currentContainer = Ext.create(
								'Ext.container.Container', {
									itemId : 'container_'
											+ arrLabels[index],
									columnWidth : 0.3326,		
									items : [{
												xtype : 'displayfield',
												fieldLabel : getLabel(arrLabels[index],arrLabels[index]),
												labelWidth : 'auto',
												itemId : arrLabels[index],
												labelSeparator : ' : ',
												name : arrLabels[index],
												cls : 'additional-info-label txnDetails-displayfield',
												value : Ext.String.ellipsis(arrValues[index],17),
												autoEl:{
													tag: 'table',
													'title': arrValues[index]
												},
												listeners: {
													
												   beforerender : function(){
													   if(arrLabels[index]=="Account type")
													   this.addCls('tabClass');   
												   },
											       render: function(c) {
//											    	   $(currentContainer).attr('title', Ext.String.ellipsis(arrValues[index],17));
											       }
											   }
											}]
								});
						panelDetail.add(currentContainer);
					}
				}
				return true;
			}
		}
	}
}
function showCheckImagePopup(record)
{
	$('#checkImagePopUp').dialog({
		autoOpen : false,
		maxHeight :480,
		width : 650,
		modal : true,
		buttons :[{
	       	   id: 'okBtn',
	       	   text: getLabel('ok', 'Ok'),
	       	   click: function(){
		       		$(this).dialog("close");
	       	   }
          }],
		open: function() {
			showCheckImage(record, 'F');
        }
	});
	$('#checkImagePopUp').dialog("open");
}
/*function showCheckImage(record) {
	var custRef = record.get('customerRefNo');
	Ext.Ajax.request({
				url : 'services/activities/showChequeImage.json?checkDepositeNo='
						+ custRef,
				method : 'GET',
				async : false,
				success : function(response) {
					var data = Ext.decode(response.responseText);
					if (!Ext.isEmpty(record.get('customerRefNo'))) {
						 $("#checkImage").attr("src", data.imagePath); 
					}
				},
				failure : function(response) {
				}

			});
}*/

function showCheckImage(record, side) {

	//$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.blockUI({
		overlayCSS : {
			opacity : 0.5
		},
		baseZ : 2000,
		message: '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
		css:{ }});
	var me = this;
	var id = record.get('identifier');
	
	var strUrl = 'services/btrActivities/'+summaryType+'/displayChequeImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+ '&identifier=' + Ext.encode(id) +
	'&$hostImageKey='+ record.get('hostImageKey') + '&$checkDepositeNo='+ record.get('customerRefNo') +'&$summaryType=' + summaryType + '&$accountId=' + record.get('accountId') +
	'&$sessionNo=' + record.get('sessionNumber') + '&$sequenceNo=' + record.get('sequenceNumber') +
	'&$side=' + side;
	if(Ext.isEmpty(summaryType))
	{
		strUrl = 'services/btrActivities/previousday/displayChequeImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+ '&identifier=' + Ext.encode(id) +
		'&$hostImageKey='+ record.get('hostImageKey') + '&$checkDepositeNo='+ record.get('customerRefNo') +'&$summaryType=' + summaryType + '&$accountId=' + record.get('accountId') +
		'&$sessionNo=' + record.get('sessionNumber') + '&$sequenceNo=' + record.get('sequenceNumber') +
		'&$side=' + side;
	}
	$.ajax(
	{
		type : 'POST',
		url : strUrl,
		dataType : 'html',
		success : function( data )
		{
			$.unblockUI();
			var $response = $( data );
			var jsonData = Ext.decode(data);

			if( $response.find( '#imageAppletDiv' ).length == 0 )
			{
				$( '#chkImageDiv' ).html( '<img width="1000" height="500" src="data:image/jpeg;base64,' + jsonData.FrontImage + '"/>' );
			}
			else
			{
				$( '#chkImageDiv' ).html( $response.find( '#imageAppletDiv' ) );
			} 
			$( '#chkImageDiv' ).dialog(
			{
				bgiframe : true,
				autoOpen : false,
				height : "700",
				modal : true,
				resizable : true,
				width : "1200",
				zIndex: '29001',				
				title : getLabel('image', 'Image'),
				buttons : 
				{
					"Cancel" : function()
					{
						$( this ).dialog( "close" );
					},
					"Flip Over" : function()
						{
							if(modelBytes=='Front'){
								//$( this ).dialog( "close" );
								//me.showCheckImage(record,'B');
								$( '#chkImageDiv' ).html( '<img width="1000" height="500" src="data:image/jpeg;base64,' + jsonData.BackImage + '"/>' );
								 modelBytes = 'Back';
							 }
							 else
							 {
								 //$( this ).dialog( "close" );
									//me.showCheckImage(record,'F');
									 $( '#chkImageDiv' ).html( '<img width="1000" height="500" src="data:image/jpeg;base64,' + jsonData.FrontImage + '"/>' );
								 modelBytes = 'Front';
							 }
						}
					,
					"Print" : function()
					{
						
						printFrontImage(jsonData);

					}
					},
		            open: function() {
		            	$('.ui-dialog-buttonpane').find('button:contains("Print")').css('color','#4a4a4a')
						.css('background-color','#FFF').css('margin-left','10px').css('border','1px solid #4a4a4a');
						$('.ui-dialog-buttonpane').find('button:contains("Flip Over")').css('color','#4a4a4a')
						.css('background-color','#FFF').css('margin-left','10px').css('border','1px solid #4a4a4a');
		            }
			} );

			$( '#dialogMode' ).val( '1' );
			$( '#chkImageDiv' ).dialog( 'open' );
		},
		error : function( request, status, error )
		{
			$.unblockUI();
			$( '#chkImageDiv' ).html( '<img src="./static/images/misc/no_image.jpg"/>' );
			$( '#chkImageDiv' ).dialog(
			{
				bgiframe : true,
				autoOpen : false,
				height : "300",
				modal : true,
				resizable : true,
				width : "285",
				zIndex: '29001',				
				title : getLabel('image', 'Image'),
				buttons : 
				{
					"Cancel" : function()
					{
						$( this ).dialog( "close" );
					}
				}
			} );
			$( '#dialogMode' ).val( '1' );
			$( '#chkImageDiv' ).dialog( 'open' );
		}
	} );
}
function emailId_Chk(me)
{
	var email = me;
	var oneChar;
	var length = email.length;
	var FinalVal = "";
	var j;
	if (length > 0)
	{
		j = new RegExp(); 
		j.compile("[A-Za-z0-9._-]+@[^.]+\..+"); 
		if (!j.test(email)) { 
			me.value="";
			return false;
		} 
	}
	return true;
}
function showEstatementInfoPopup(record)
{
	$('#estatementInfoPopUp').dialog({
		autoOpen : false,
		maxHeight : 550,
		minHeight :(screen.width) > 1024 ? 156 : 0,
		width : 870,
		modal : true,
		resizable: false,
		draggable: false,

		open: function() {
			showEstatementInfo(record);
        },

		close: function() {
			$('#wsError').text('');
			$('#accountDisplay1').empty();
			$('#statementPrd').off( "change" );
			$('#statementPrd').empty();
        }
	});
	$('#estatementInfoPopUp').dialog("open");
	$('#estatementAccountDisplayDiv').focus();
}

function showEstatementInfo(record)
{
	$.blockUI({
	overlayCSS : {
		opacity : 0.5
	},
	baseZ : 2000,
	message: '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
	css:{ }});

	var me = this;
	var btrType = 'balanceSummary';
	var jsonId = "{\"identifier\":" + "\"" + record.raw.identifier + "\"}";

	if(Ext.isDefined(record) && Ext.isDefined(record.raw))
	{
	 if(Ext.isDefined( record.get('accountNo')))
		{
		 	//btrType = 'btrActivities';
		 	btrType = 'balanceSummary';
		}
	 if(Ext.isDefined(record.raw.isHistoryFlag) && record.raw.isHistoryFlag == 'H')
		{
			btrType = 'btrBalanceHistory';
		}
	if(Ext.isDefined(record.get('accountNo')) && Ext.isDefined(record.raw.isHistoryFlag) && record.raw.isHistoryFlag == 'H')
		{
			if(summaryType == 'intraday')
				btrType = 'balanceSummary';
			else if(summaryType == 'previousday')
				btrType = 'btrBalanceHistory';
		}
	}
	var _url = 'services/'+btrType+'/'+summaryType+'/estatementinfo';

	Ext.Ajax.request({
				url : _url,
				method : 'POST',
				jsonData : Ext.decode(jsonId),
				success : function(response) {
					$.unblockUI();
					var data = Ext.decode(response.responseText);
					$("#statementPrd").empty();
					me.setEstatementPopUpData(record,response);
					$("#statementPrd").niceSelect();
					autoFocusOnFirstElement(null, 'estatementInfoPopUp', true);
				},
				failure : function(response) {
					$.unblockUI();
					Ext.MessageBox.show({
						title : getLabel('estatementErrorPopUpTitle', 'Message'),
						msg : getLabel('eStatementErrorPopUpMsg',
								'Error while fetching eStatement..!'),
						buttons : Ext.MessageBox.OK,
						cls : 'ux_popup',
						icon : Ext.MessageBox.ERROR
					});
					autoFocusOnFirstElement(null, 'estatementInfoPopUp', true);
				}

			});
}
function setEstatementPopUpData(record,response) {
	var me = this;
	var paramList = null;
	var elementId = null;
	var responseData = null;
	var defaultOpt = null;
	if(Ext.isDefined(record) && Ext.isDefined(record.raw))
	{
	 if(Ext.isDefined( record.get('accountNumber')))
		{
			$('#accountDisplay1').text(record.get('accountNumber') || '');
			$('#accountDisplay1').prop('title',record.get('accountNumber') || '');
		}
	 else if(Ext.isDefined( record.get('accountNo')))
		{
			$('#accountDisplay1').text(record.get('accountNo') || '');
			$('#accountDisplay1').prop('title',record.get('accountNo') || '');
		}
	}
	if(!Ext.isEmpty(response) && !Ext.isEmpty(response.responseText)
			&& !Ext.isEmpty(response.responseText).param)
		{
			elementId = '#statementPrd';
			paramList = Ext.decode(response.responseText);
			if(!Ext.isEmpty(paramList) && !Ext.isEmpty(paramList.preferenceListBean)
					&& !Ext.isEmpty(paramList.preferenceListBean.d) && !Ext.isEmpty(paramList.preferenceListBean.d.preferences))
				{
					responseData=paramList.preferenceListBean.d.preferences;
					defaultOpt = $('<option />', {
						value : "all",
						text : getLabel('statementPrd', 'Select')
						});
					defaultOpt.appendTo(elementId);
					$.each(responseData,function(index,item){
						$(elementId).append($('<option>', {
							value: responseData[index].CODE,
							text : responseData[index].DESCR
							}));
				});
			}
			else if(!Ext.isEmpty(paramList) && !Ext.isEmpty(paramList.preferenceBean)
					&& !Ext.isEmpty(paramList.preferenceBean.error))
			{
						//alert(JSON.stringify(paramList));
						elementId = '#wsError';
						responseData = paramList.preferenceBean.error;
						if(responseData.errorCode.substr(0, 3) == "WSE")
							$(elementId).text(responseData.errorCode + "-" + objWSErrors[responseData.errorCode]);
						else
							$(elementId).text(responseData.errorCode + "-" + responseData.errorMessage);
			}
			//start select
			 $(elementId).change(function() {
				//e.stopPropagation(); 
				var selVal = null;
				$('#wsError').text('');
				var selText = $('#statementPrd :selected').text();
				selVal = $('#statementPrd :selected').val();
				if(selVal != ''){
					showSelectedEstatementDetails(record, selVal);
					//downloadEstatementReport(record,selVal);
				}
			 });
			 //End select
		}
}

function showSelectedEstatementDetails(record, selVal)
{
	$.blockUI({
		overlayCSS : {
			opacity : 0.5
		},
		baseZ : 2000,
		message: '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
		css:{ }});
	var me = this;

	var accountNmbr = null;
	accountNmbr = record.get('accountNumber') || '';
	if(accountNmbr === undefined || accountNmbr === null || accountNmbr === "")
		accountNmbr = record.get('accountNo') || '';
	var jsonId = "{\"identifier\":" + "\"" + record.raw.identifier + "\",\"selectVal\":" + "\"" + selVal + "\",\"accountNmbr\":" + "\"" + accountNmbr + "\"}";
	var _url = 'services/balanceSummary/'+summaryType+'/estatementdtl';
	
	/*if(Ext.isDefined(record) 
			&& Ext.isDefined(record.raw) 
			&& Ext.isDefined(record.raw.isHistoryFlag)
			&& record.raw.isHistoryFlag == 'H') {
		_url = 'services/btrBalanceHistory/'+ summaryType+'/estatementdtl';
	}
	strUrl = 'services/balanceSummary/'+summaryType+'/estatementdtl';

	strUrl += '?$accountNmbr=' + accountNmbr;
	strUrl += '&$selectVal=' + selVal;*/
	
	Ext.Ajax.request({
				url : _url,
				documenttype: "application\*",
				method : 'POST',
				jsonData : Ext.decode(jsonId),
				success : function(response) {
					$.unblockUI();
					if (response)
					{
						paramList = Ext.decode(response.responseText)
						//alert(JSON.stringify(paramList));
						if(!Ext.isEmpty(paramList) && !Ext.isEmpty(paramList.preference)
								&& !Ext.isEmpty(paramList.preferenceType))
						{
							//alert(JSON.stringify(paramList.preferenceType));
							//alert(JSON.stringify(paramList.preference));
							downloadResponseFile(paramList.preference, paramList.preferenceType);
							//downloadEstatementReport(record,selVal);
							// window.open(paramList.preferenceBean.preference);
							//$('.div_imagetranscrits').html('<img src="data:image/png;base64,' + response + '" />');
						}
						else if(!Ext.isEmpty(paramList) && !Ext.isEmpty(paramList.error))
						{
							elementId = '#wsError';
							responseData = paramList.error;
							if(responseData.errorCode.substr(0, 3) == "WSE")
								$(elementId).text(responseData.errorCode + "-" + objWSErrors[responseData.errorCode]);
							else
								$(elementId).text(responseData.errorCode + "-" + responseData.errorMessage);
						}
					}
				},
				failure : function(response) {
					$.unblockUI();
					Ext.MessageBox.show({
						title : getLabel('estatementErrorPopUpTitle', 'Message'),
						msg : getLabel('eStatementErrorPopUpMsg',
								'Error while fetching eStatement pdf..!'),
						buttons : Ext.MessageBox.OK,
						cls : 'ux_popup',
						icon : Ext.MessageBox.ERROR
					});

				}

			});
}

function downloadEstatementReport(record,selectVal) {
	var me = this;
	var strUrl = null;
	var accountNmbr = null;
	accountNmbr = record.get('accountNumber') || '';
	if(accountNmbr === undefined || accountNmbr === null || accountNmbr === "")
		accountNmbr = record.get('accountNo') || '';

	strUrl = 'services/balanceSummary/'+summaryType+'/estatementdtl';

	//strUrl += '?$accountNmbr=' + accountNmbr;
	//strUrl += '&$selectVal=' + selectVal;

	form = document.createElement('FORM');
	form.name = 'frmNew';
	form.id = 'frmNew';
	form.method = 'POST';
	//form.target="_blank";
	form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
	form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'identifier', accountNmbr));
	form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectVal', selectVal));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}


function downloadResponseFile(downloadedFile, strFileName)
{
	var data = $.trim(downloadedFile); 
	console.log(data);

	var winparams = 'dependent=yes,locationbar=no,scrollbars=yes,menubar=yes,'+
					'resizable,screenX=50,screenY=50,width=850,height=1050';

	var htmlText = '<html><head>' + strFileName + '</head><body><embed width=100% height=100%'
					+ ' type="application/pdf"'
					+ ' src="data:application/pdf;base64,'
					+ data
					+ '"></embed></body></html>'; 

		//For IE using atob convert base64 encoded data to byte array
	if (window.navigator && window.navigator.msSaveOrOpenBlob) {
		var byteCharacters = $.base64.atob(data);
		var byteNumbers = new Array(byteCharacters.length);
		for (var i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		var byteArray = new Uint8Array(byteNumbers);
		var blob = new Blob([byteArray], {
				type: 'application/pdf'
		});
		//alert("blob:" + blob);
		window.navigator.msSaveOrOpenBlob(blob, strFileName);
	}
	else
	{ 
		// Directly use base 64 encoded data for rest browsers (not IE)
		// Open PDF in new browser window
		var detailWindow = window.open ("", "", winparams);
		/*detailWindow.onload = function(){
			detailWindow.document.title = strFileName;
		};*/
		detailWindow.document.write (htmlText);
		detailWindow.document.close ();
	}
	 
}

;(function($) {

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        a256 = '',
        r64 = [256],
        r256 = [256],
        i = 0;

    var UTF8 = {

        /**
         * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
         * (BMP / basic multilingual plane only)
         *
         * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
         *
         * @param {String} strUni Unicode string to be encoded as UTF-8
         * @returns {String} encoded string
         */
        encode: function(strUni) {
            // use regular expressions & String.replace callback function for better efficiency
            // than procedural approaches
            var strUtf = strUni.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
            })
            .replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
            });
            return strUtf;
        },

        /**
         * Decode utf-8 encoded string back into multi-byte Unicode characters
         *
         * @param {String} strUtf UTF-8 string to be decoded back to Unicode
         * @returns {String} decoded string
         */
        decode: function(strUtf) {
            // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
            var strUni = strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
            function(c) { // (note parentheses for precence)
                var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                return String.fromCharCode(cc);
            })
            .replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
            function(c) { // (note parentheses for precence)
                var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                return String.fromCharCode(cc);
            });
            return strUni;
        }
    };

    while(i < 256) {
        var c = String.fromCharCode(i);
        a256 += c;
        r256[i] = i;
        r64[i] = b64.indexOf(c);
        ++i;
    }

    function code(s, discard, alpha, beta, w1, w2) {
        s = String(s);
        var buffer = 0,
            i = 0,
            length = s.length,
            result = '',
            bitsInBuffer = 0;

        while(i < length) {
            var c = s.charCodeAt(i);
            c = c < 256 ? alpha[c] : -1;

            buffer = (buffer << w1) + c;
            bitsInBuffer += w1;

            while(bitsInBuffer >= w2) {
                bitsInBuffer -= w2;
                var tmp = buffer >> bitsInBuffer;
                result += beta.charAt(tmp);
                buffer ^= tmp << bitsInBuffer;
            }
            ++i;
        }
        if(!discard && bitsInBuffer > 0) result += beta.charAt(buffer << (w2 - bitsInBuffer));
        return result;
    }

    var Plugin = $.base64 = function(dir, input, encode) {
            return input ? Plugin[dir](input, encode) : dir ? null : this;
        };

    Plugin.btoa = Plugin.encode = function(plain, utf8encode) {
        plain = Plugin.raw === false || Plugin.utf8encode || utf8encode ? UTF8.encode(plain) : plain;
        plain = code(plain, false, r256, b64, 8, 6);
        return plain + '===='.slice((plain.length % 4) || 4);
    };

    Plugin.atob = Plugin.decode = function(coded, utf8decode) {
        coded = coded.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        coded = String(coded).split('=');
        var i = coded.length;
        do {--i;
            coded[i] = code(coded[i], true, r64, a256, 6, 8);
        } while (i > 0);
        coded = coded.join('');
        return Plugin.raw === false || Plugin.utf8decode || utf8decode ? UTF8.decode(coded) : coded;
    };
}(jQuery));
