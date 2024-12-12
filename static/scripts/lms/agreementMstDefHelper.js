var globalTabId;

function showNextTab(strUrl)
{
	globalStrUrl = strUrl ;
	var recordKeNo = document.getElementById('txtRecordKeyNo').value;
	enableFileldsToSave();
	if($('#clientDescription').val() === '')
		{
		$('#clientDescription').val($('#clientCode :selected').text());
		}
	strUrl = strUrl+'?$viewState='+encodeURIComponent(viewState)
	+'&'+csrfTokenName+'='+csrfTokenValue;
		goToHome(strUrl);
	
}
function closeConfirmPopup()
{
	$('#confirmPopup').dialog("close");
}
function showConfirmPopup(tabId)
{
	globalTabId = tabId ;
	var recordKeNo = document.getElementById('txtRecordKeyNo').value;
	document.getElementById( "confirmPopup" ).style.visibility = "visible";
	if($('#dirtyBit').val()=="1" || recordKeNo == null ||  recordKeNo == '')
	{
		var dlg = $( '#confirmPopup' );
		dlg.dialog( {
			autoOpen : false,
			height : 200,
			modal : true,
			width : 400,
			title : getLabel('message', 'Message'),
			open: function(event, ui) {
	        $("button").blur();
	    	},
			buttons : {
				"Yes" : function() {
					goToTab();
				},
				"No" : function() {
					closeConfirmPopup();
				}
			}
		} );
		dlg.dialog( 'open' );
	}
	else
	{
		goToTab();
	}
	
}
function goToTab()
{
	var strUrl = null ;
	var frm = document.getElementById("frmMain");
	frm.target = "";
	frm.method = "POST";
	if(globalTabId == 'tab_1')
	{
		if(pageMode == 'VIEW')
		{
			strUrl = 'viewAgreementMaster.srvc?$viewState='+encodeURIComponent(viewState)
			+'&'+csrfTokenName+'='+csrfTokenValue;
		}
		else
		{
			strUrl = 'editAgreementMaster.srvc?$viewState='+encodeURIComponent(viewState)
			+'&'+csrfTokenName+'='+csrfTokenValue;
		}
	}
	else if(globalTabId == 'tab_2')
	{
		if(structureType == '101')
		strUrl = 'showAgreementSweepConfigureInstruction.srvc';
		else if(structureType == '501')
		strUrl = 'showAgreementHybridConfigureInstruction.srvc';
		else if(structureType == '201')
		strUrl = 'showAgreementFlexibleConfigureInstruction.srvc';	
	}
	frm.action = strUrl;
	frm.submit();
}
function closeConfirmNextPopup()
{
	$( '#confirmNextPopup' ).dialog( 'close' );
}

function goToNextpage()
{
	var frm = document.getElementById('frmMain');
	frm.action = globalStrUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit(); 
}
function goToHome(strUrl)
{
	
	var frm = document.getElementById( 'frmMain' );
	frm.action = strUrl;		
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function structureTypeChange()
{	
	var frm = document.forms[ "frmMain" ];
	var strUrl = "showAgreementMstEntryForm.srvc";
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	$('#balance,#allowOnTrigger,#activity,#partOfHybrid').val('N');
	enableFileldsToSave();
	frm.submit();	
}

function saveAgreementMaster( frmId )
{
	var frm = document.getElementById( frmId );
	var strUrl = null;
	if( pageMode == 'ADD' )
	{
		strUrl = 'saveAgreementMaster.srvc';
		strUrl = strUrl;
	}
	else
	{
		strUrl = 'updateAgreementMaster.srvc';
		strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState )+'&'+csrfTokenName+'='+csrfTokenValue;
	}
	enableFileldsToSave();
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function enableFileldsToSave()
{
	$("#frmMain").find('input').addClass("enabled");
	$("#frmMain").find('input').attr("disabled",false);
	$("#frmMain").find('select').addClass("enabled");
	$("#frmMain").find('select').attr("disabled",false);
}

function createExtJsStartDateField() {
	var startdtValue = startDateModel == null || startDateModel == '' ? dtApplicationDate
			: startDateModel;
	var startdt = Ext.create('Ext.form.DateField', {
		name : 'startDate',
		itemId : 'startDate',
		width : 166,
		format : extJsDateFormat,
		editable : false,
		minValue : dtApplicationDate, 
		value : startdtValue,
		listeners :
		{
			change: function ( datefield, newValue, oldValue, eOpts ){
				setDirtyBit();
			}
		}
	});
	startdt.render(Ext.get('startDateDiv'));
}

function createExtJsEndDateField() {
	var enddtValue = endDateModel != '' || endDateModel != null ? endDateModel
			: '';
	var enddt = Ext.create('Ext.form.DateField', {
		name : 'endDate',
		itemId : 'endDate',
		width : 166,
		format : extJsDateFormat,
		editable : false,
		minValue : dtApplicationDate,
		value : enddtValue,
		listeners :
		{
			change: function ( datefield, newValue, oldValue, eOpts ){
				setDirtyBit();
			}
		}
	});
	enddt.render(Ext.get('endDateDiv'));
}
function warnBeforeCancel(strUrl) {
	var dirtyBit = $('#dirtyBit').val();
	if('1' == dirtyBit) {
		$('#confirmMsgPopup').dialog({
			autoOpen : false,
			maxHeight: 550,
			minHeight:'auto',
			width : 400,
			modal : true,
			resizable: false,
			draggable: false
		});
		
		$('#confirmMsgPopup').dialog("open");
		
		$('#cancelBackConfirmMsg').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#doneBackConfirmMsgbutton').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
			var frm = document.forms["frmMain"];
			frm.action = strUrl;
			frm.target = "";
			frm.method = "POST";
			frm.submit();
		});
		
		$('#textContent').focus();
	}
	else {
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}

function downloadAgreementMst(reckeyNo) {
	
	var recordKeNo = document.getElementById('txtRecordKeyNo').value;
	var sellerIdSelected = document.getElementById('sellerId').value;
	document.getElementById( "confirmPopup" ).style.visibility = "visible";
	if($('#dirtyBit').val()=="1" || recordKeNo == null ||  recordKeNo == '')
	{
		var dlg = $( '#confirmPopup' );
		dlg.dialog( {
			autoOpen : false,
			height : "auto",
			modal : true,
			width : 420,
			title : getLabel('message', 'Message')
		} );
		dlg.dialog( 'open' );
	}
	else {		
		
			var strUrl =  'services/agreementMst/printAgreement.srvc';				
				form = document.createElement('FORM');
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild(createFormField('INPUT', 'HIDDEN',
						csrfTokenName, tokenValue));
				form.appendChild(createFormField('INPUT', 'HIDDEN', 'recordKeyNo',
						recordKeNo));
				form.appendChild(createFormField('INPUT', 'HIDDEN', 'sellerId',
						sellerIdSelected));
				form.action = strUrl;
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);	
		}
}

function createFormField ( element, type, name, value ) {
	
	var inputField;
	inputField = document.createElement( element );
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function saveRecord(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}