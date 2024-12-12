function showNextTab(strUrl)
{
	globalStrUrl = strUrl ;
	enableFileldsToSave();
	assignAccrualSchedulingParams();
	assignSettlementSchedulingParams();
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
					document.getElementById( "dirtyBit" ).value = '0';					
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
function cuttOffConfirmPopUp()
{
	$('#cutOffMsgPopup').dialog({
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : [{
			  text:getLabel('ok','Ok'), 
			click : function() {
				$(this).dialog("close");
			}
		}]
	});
	$('#cutOffMsgPopup').dialog("open");
}
function goToTab()
{
	var strUrl = null ;	
	var dirtyFlag =  $('#dirtyBit').val();
	var frm = document.getElementById("frmMain");
	enableFileldsToSave();
	frm.target = "";
	frm.method = "POST";
	if(globalTabId == 'tab_1')
	{
		if(pageMode == 'VIEW')
		{
			strUrl = 'viewAgreementNotionalMaster.srvc?$viewState='+viewState
			+'&'+csrfTokenName+'='+csrfTokenValue;
		}
		else
		{
			strUrl = 'editAgreementNotionalMaster.srvc?$viewState='+encodeURIComponent(viewState)
			+'&'+csrfTokenName+'='+csrfTokenValue;
		}
	}
	else if(globalTabId == 'tab_2')
	{
		strUrl = 'showAgreementNotionalConfigurePool.srvc?$viewState='+encodeURIComponent(viewState)
		+'&'+csrfTokenName+'='+csrfTokenValue+'&dirtyFlag='+dirtyFlag;		
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
		
		$('#cancelConfirmMsgbtn').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#doneConfirmMsgbtn').bind('click',function(){
			var frm = document.forms["frmMain"];
			frm.action = strUrl;
			frm.target = "";
			frm.method = "POST";
			frm.submit();
		});
	}
	else {
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}
function loadMonthDayNmbr()
{
	$('#accrualFreqMonthDayNmbr,#settlementFreqMonthDayNmbr')
    .append($("<option></option>")
               .attr("value",'')
               .text(getLabel('selectDayOfMonth')));
	
	for(var x = 1; x<=30;x++  )
	{
	     $('#accrualFreqMonthDayNmbr,#settlementFreqMonthDayNmbr')
	         .append($("<option></option>")
	                    .attr("value",x)
	                    .text(x));
	}
	
	$('#accrualFreqMonthDayNmbr,#settlementFreqMonthDayNmbr')
    .append($("<option></option>")
               .attr("value",'-1')
               .text(getLabel('endOfMonth')));
	
	$('#accrualFreqMonthDayNmbr,#settlementFreqMonthDayNmbr')
    .append($("<option></option>")
               .attr("value",'-2')
               .text(getLabel('lastFridayOfMonth')));	
}
function setDayOfMonth(accrualFreqMonthDayNmbr, settlementFreqMonthDayNmbr)
{
	$('select[id^="accrualFreqMonthDayNmbr"] option[value='+accrualFreqMonthDayNmbr+']').attr("selected","selected");
	$('select[id^="settlementFreqMonthDayNmbr"] option[value='+settlementFreqMonthDayNmbr+']').attr("selected","selected");
}