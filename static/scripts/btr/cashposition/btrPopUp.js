var attachmentRecord = null;
var notesRecord = null; /*This will hold the record of note*/

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
	
		open: function() {
			
			$("#transactionExport").hide();
			$("#transactionDetailPopup").hide();
			//$(".moreCriteria").toggleClass("hidden");
			
			function tooltip(reference){
				   $(reference).prop("title",string);
		}
			
		
			strValue = getTxnAmount(record);
			
			$("#txndate").text( Ext.Date.format(new Date(record.get('transactionDate')), 'm/d/Y')|| ''); 
			
			$("#typeCodeDesc").text( record.get('typeCodeDesc') || '');
			$("#typeCodeDesc").prop("title",record.get('typeCodeDesc') || '');
			
			if (strValue != null && strValue != '') {
				if (strValue.indexOf("-") == 0) {
					strValue = strValue.substring(1);
					$("#amount").text("$" + (strValue));
					$("#amount").addClass('red');
					$("#amount").prop("title","$" + (strValue));
				} else {
					$("#amount").text("$" + (strValue));
					$("#amount").prop("title","$" + (strValue));

					if ($("#amount").hasClass('red'))
						$("#amount").removeClass('red');
				}
			} else {
				$("#amount").text('');
			}
			
			$("#accountId").text(record.get('accountNumber'));
			$("#accountId").prop("title",record.get('accountNumber'));
			
			$("#bankRef").text(record.get('bankReference') || '');
			$("#bankRef").prop("title",record.get('bankReference') || '');
			
			
			$("#customerRef").text(record.get('customerReference') || '');
			$("#customerRef").prop("title",record.get('customerReference') || '');
			
			$("#text").text(record.get('textField') || '');
			var strFlag= record.get('remittanceTextFlag');
			if(strFlag=="N")
			{					
				$("#remTextId").hide();				
			}
			else
			{
				$("#remTextId").show();
				$("#remText").text(record.get('remittanceText') || '');
			}
			
			if (mapService['loanSubFacility'] == strServiceParam)
			{
				$('#checkNoContainer').addClass('ui-helper-hidden');
				$('#orgNameContainer').addClass('ui-helper-hidden');
			}
			else
			{
				$("#orgName").text(record.get('info2') || '');
				$("#checkNo").text(record.get('info3') || '');
			}
			$("#fxRate").text(record.get('info1') || '');
		}
	});
	$('#txnDetailsPopUp').dialog("open");
	$('#txndateDiv').focus();
}

function getTxnAmount(record) {
	 if (!Ext.isEmpty(record.get('transactionAmt')) && record.get('transactionAmt')>0){
				return Ext.util.Format.number(Math.abs(record.get('transactionAmt')),'0,000.00');
	 }
	  else{
	  	return Ext.util.Format.number(Math.abs(record.get('transactionAmt')),'0,000.00');
	  }
}

