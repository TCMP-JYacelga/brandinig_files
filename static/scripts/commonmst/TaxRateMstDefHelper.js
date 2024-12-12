function showNextTab(strUrl)
{
	globalStrUrl = strUrl ;
	var recordKeNo = document.getElementById('txtRecordKeyNo').value
	document.getElementById( "confirmNextPopup" ).style.visibility = "visible";
	if($('#dirtyBit').val()=="1" || recordKeNo == null ||  recordKeNo == '')
	{
		var dlg = $( '#confirmNextPopup' );
		dlg.dialog( {
			autoOpen : false,
			height : "auto",
			modal : true,
			width : 420,
			title : 'Message'
		} );
		dlg.dialog( 'open' );
	}
	else
	{
		goToHome(strUrl);
	}
}



function goToHome(strUrl)
{
	var frm = document.getElementById( 'frmMain' );
	frm.action = strUrl;	
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function updateAndSubmitTaxRate(strUrl)
{
	var frm = document.getElementById( 'frmMain' );
	frm.action = strUrl +'?viewState='+viewState;	
	enableFileldsToSave();
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

function onchangeTaxRate(taxRate){
	var taxRateVal = taxRate.value;
	if (/[^\d\.]/.test(taxRateVal)) {
	taxRate.value='0.00';
	taxRate.focus()
	}
	//TODO - need to handle gt 99
	taxRate.value = formatTaxRate(taxRateVal);
	//var s = taxRate.split('.');	
	//var num = Number(s);
	//taxRate.value= num.toPrecision(5);
		
}



function formatTaxRate(taxRate){

var s = taxRate.split('.');
	
  var beforeDecimal = s[0];         // This is the number BEFORE the decimal.
  var afterDecimal = '0000';        // Default value for digits after decimal
  if (s.length > 1)                 // Check that there indeed is a decimal separator.
    afterDecimal = s[1];            // This is the number AFTER the decimal.
  if (beforeDecimal.length > 2) {
    // Too many numbers before decimal.
    // Get the first 2 digits and discard the rest.
   beforeDecimal = beforeDecimal.substring(0, 2);
  }
  if (afterDecimal.length > 4) {
    // Too many numbers after decimal.
    // Get the first 4 digits and discard the rest.
    afterDecimal = afterDecimal.substring(0, 4);
  }

  // Return the new number with at most 2 digits before the decimal
  // and at most 4 after.
  return beforeDecimal + "." + afterDecimal;

  }
