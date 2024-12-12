
var PeriodWeekArray = new Array( "('Every Week',1)", "('Every 2nd Week',2)", "('Every 3rd Week',3)",
	"('Every 4th Week',4)" );
var MonthlyPeriodArray = new Array( "('Monthly',1)", "('Every 2nd Month',2)", "('Every 3rd Month',3)",
	"('Every 4th Month',4)", "('Every 5th Month',5)", "('Every 6th Month',6)", "('Every 7th Month',7)",
	"('Every 8th Month',8)", "('Every 9th Month',9)", "('Every 10th Month',10)", "('Every 11th Month',11)",
	"('Every 12th Month',12)" );
var DailyPeriodArray = new Array( "('Everyday',1)", "('Every 2nd Day',2)", "('Every 3rd Day',3)",
	"('Every 4th Day',4)", "('Every 5th Day',5)", "('Every 6th Day',6)", "('Every 7th Day',7)" );

var RefWeekDay = new Array( "('Sunday',1)", "('Monday',2)", "('Tuesday',3)", "('Wednesday',4)", "('Thursday',5)",
	"('Friday',6)", "('Saturday',7)" );
var RefMonArray = new Array( "('1',1)", "('2',2)", "('3',3)", "('4',4)", "('5',5)", "('6',6)", "('7',7)", "('8',8)",
	"('9',9)", "('10',10)", "('11',11)", "('12',12)", "('13',13)", "('14',14)", "('15',15)", "('16',16)", "('17',17)",
	"('18',18)", "('19',19)", "('20',20)", "('21',21)", "('22',22)", "('23',23)", "('24',24)", "('25',25)",
	"('26',26)", "('27',27)", "('28',28)", "('29',29)", "('30',30)", "('31',31)" );
var RefDay = new Array( "('N/A',0)" );
var HolidayAction = new Array( "('N/A',3)" )
var currencyData = new Array();

function setRefAttributes( frequencyType )
{
	if( frequencyType == "MONTHLY" )
	{
		$( '#siRefDay > option' ).remove();
		$( '#siPeriod > option' ).remove();

		if( document.forms[ 'frmTxn' ].elements[ 'siRefDay' ].disabled == true )
		{
			document.forms[ 'frmTxn' ].elements[ 'siRefDay' ].disabled = false;
			$( '#siRefDay' ).removeClass( 'disabled' );
		}
		if( document.forms[ 'frmTxn' ].elements[ 'siHolidayAction' ].disabled == true )
		{
			document.forms[ 'frmTxn' ].elements[ 'siHolidayAction' ].disabled = false;
			$( '#siHolidayAction' ).removeClass( 'disabled' );
		}

		// code to remove the N/A option if it exist for siHolidayAction
		var temp = document.forms[ 'frmTxn' ].elements[ 'siHolidayAction' ].length;
		if( temp == 4 )
		{
			$( "#siHolidayAction option[value='3']" ).remove();
		}

		for( var i = 0 ; i < RefMonArray.length ; i++ )
		{
			eval( "document.forms[ 'frmTxn' ].elements[ 'siRefDay' ].options[i]=" + "new Option"
				+ RefMonArray[ i ] );
		}

		intPeriod = MonthlyPeriodArray.length;
		for( var i = 0 ; i < intPeriod ; i++ )
		{
			eval( "document.forms[ 'frmTxn' ].elements[ 'siPeriod' ].options[i]=" + "new Option"
				+ MonthlyPeriodArray[ i ] );

		}
	}
	else if( frequencyType == "WEEKLY" )
	{
		$( '#siRefDay > option' ).remove();
		$( '#siPeriod > option' ).remove();
		$( '#siRefDay').removeClass('disabled');
		$( '#siHolidayAction').removeClass('disabled');
		

		if( document.forms[ 'frmTxn' ].elements[ 'siRefDay' ].disabled == true )
		{
			document.forms[ 'frmTxn' ].elements[ 'siRefDay' ].disabled = false;
			$( '#siRefDay' ).removeClass( 'disabled' );
		}
		if( document.forms[ 'frmTxn' ].elements[ 'siHolidayAction' ].disabled == true )
		{
			document.forms[ 'frmTxn' ].elements[ 'siHolidayAction' ].disabled = false;
			$( '#siHolidayAction' ).removeClass( 'disabled' );
		}

		// code to remove the N/A option if it exist for siHolidayAction
		var temp = document.forms[ 'frmTxn' ].elements[ 'siHolidayAction' ].length;
		if( temp == 4 )
		{
			$( "#siHolidayAction option[value='3']" ).remove();
		}

		for( var i = 0 ; i < RefWeekDay.length ; i++ )
		{
			eval( "document.forms[ 'frmTxn' ].elements[ 'siRefDay' ].options[i]=" + "new Option"
				+ RefWeekDay[ i ] );
		}

		for( var i = 0 ; i < PeriodWeekArray.length ; i++ )
		{
			eval( "document.forms[ 'frmTxn' ].elements[ 'siPeriod' ].options[i]=" + "new Option"
				+ PeriodWeekArray[ i ] );
		}

	}
	else if( frequencyType == "DAILY" )
	{
		$( '#siRefDay > option' ).remove();
		$( '#siPeriod > option' ).remove();
		$( '#siRefDay' ).addClass( 'rounded w14 disabled' );
		$( '#siHolidayAction' ).addClass( 'rounded w14 disabled' );

		document.forms[ 'frmTxn' ].elements[ 'siRefDay' ].disabled = true;
		document.forms[ 'frmTxn' ].elements[ 'siHolidayAction' ].disabled = true;

		intPeriod = DailyPeriodArray.length;
		for( var i = 0 ; i < RefDay.length ; i++ )
		{
			eval( "document.forms[ 'frmTxn' ].elements[ 'siRefDay' ].options[i]=" + "new Option" + RefDay[ i ] );

		}
		eval( "document.forms[ 'frmTxn' ].elements[ 'siHolidayAction' ].options[3]=" + "new Option"
			+ HolidayAction[ 0 ] );
		document.forms[ 'frmTxn' ].elements[ 'siHolidayAction' ].options[ 3 ].selected = true;

		for( var i = 0 ; i < intPeriod ; i++ )
		{
			eval( "document.forms[ 'frmTxn' ].elements[ 'siPeriod' ].options[i]=" + "new Option"
				+ DailyPeriodArray[ i ] );
		}
	}
}
var currencyData = new Array();
function goToPage( strUrl, frmId )
{
	var frm = document.getElementById( frmId );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function payInvoice(record)
{
    if(!$( '#messageArea' ).hasClass( 'ui-helper-hidden' )){
      $('#messageArea ul').empty();
	  $('#messageArea').removeClass('errors');
  }
	document.getElementById( "payInvoiePopup" ).style.visibility = "visible";
	var dlg = $( '#payInvoiePopup' );
	dlg.dialog( {
		bgiframe : true,
		autoOpen : false,
		//height : 630,
		modal : true,
		resizable : true,
		width : 800,
		title : 'Invoice Summary > Add Pay Invoice'
	} ).dialog("widget").find(".ui-dialog-titlebar").hide();
	dlg.dialog( 'open' );
	$("#payInvoiceBtn1").attr("class","block ux_extralargepaddingtb");
	$("#submitBtn1").attr("class","hidden");
	$("#payInvoiceBtn2").attr("class","block ux_extralargepaddingtb");
	$("#submitBtn2").attr("class","hidden");	
	
	var data = record.data;
	
	document.getElementById('totalInvoiceDueAmntDesc').value = data.paidAmount;	
	document.getElementById('totalInvoiceDueAmnt').value = data.totalAmtDue ;//record.get( 'totalAmtDue' ) ;
	document.getElementById('invoicePayDueDate').value = data.dueDate ; //record.get('dueDate') ;
	document.getElementById('obligorIDDesc').value = data.clientId; //record.get('clientId') ;
	document.getElementById('obligorID').value = data.clientId; 	//record.get('clientId') ;
	document.getElementById('obligationIDDesc').value =data.accountNumber+" | "+data.accountName; 	//record.get('accountNumber') ;
	$('#obligationIDDesc').attr('title',$('#obligationIDDesc').val() );
	document.getElementById('obligationID').value = data.accountId;	//record.get('accountId') ;
	document.getElementById('invoiceNo').value = data.invoiceNumber ;//record.get('invoiceNumber') ;
	document.getElementById('routingNo').value =  data.routingNumber; //record.get('routingNumber') ;
	document.getElementById('principalBalAmnt').value = data.amountDue ;//record.get('amountDue') ;
	document.getElementById('principalBalAmntDesc').value = data.amountDueDesc ; //record.get('amountDueDesc') ;
	document.getElementById('interestBalAmnt').value = data.interestDue ;//record.get('interestDue') ;
	document.getElementById('interestBalAmntDesc').value = data.interestDueDesc ; //record.get('interestDueDesc') ;
	document.getElementById('feeBalAmnt').value = data.feeDue ; //record.get('feeDue') ;
	document.getElementById('feeBalAmntDesc').value = data.feeDueDesc //record.get('feeDueDesc') ;
	document.getElementById('sellerId').value = data.sellerId ;//record.get('sellerId') ;
	$("#dummyDebitAccNo").attr("disabled",false);
	$("#effectiveDate").attr("disabled",false);
	document.getElementById('effectiveDate').readOnly = false;
	document.getElementById('principalRepayAmnt').readOnly = false;
	$("#principalRepayAmnt").removeClass("disabled");
	document.getElementById('principalRepayAmnt').value = "0.00";
	document.getElementById('interestRepayAmnt').readOnly = false;
	$("#interestRepayAmnt").removeClass("disabled");
	document.getElementById('interestRepayAmnt').value = "0.00";
	document.getElementById('feeRepayAmnt').readOnly = false;
	$("#feeRepayAmnt").removeClass("disabled");
	document.getElementById('feeRepayAmnt').value = "0.00";
	
	getDebitAccList();
}
function nextToPayInvoice()
{	
      if(!$( '#messageArea' ).hasClass( 'ui-helper-hidden' )){
      $('#messageArea ul').empty();
	  $('#messageArea').removeClass('errors');
  }
   var principalAmt=parseFloat(document.forms[ 'frmTxn' ].elements[ 'principalBalAmntDesc' ].value.replace(/[^0-9.]/g, ""));
   var repayPrincipalAmnt= parseFloat(document.forms[ 'frmTxn' ].elements[ 'principalRepayAmnt' ].value.replace(/[^0-9.]/g, ""));
  
   var interestBalAmnt=parseFloat(document.forms[ 'frmTxn' ].elements[ 'interestBalAmnt' ].value.replace(/[^0-9.]/g, ""));
   var interestRepayAmnt= parseFloat(document.forms[ 'frmTxn' ].elements[ 'interestRepayAmnt' ].value.replace(/[^0-9.]/g, ""));
   
    var feeBalAmnt=parseFloat(document.forms[ 'frmTxn' ].elements[ 'feeBalAmnt' ].value.replace(/[^0-9.]/g, ""));
   var feeRepayAmnt= parseFloat(document.forms[ 'frmTxn' ].elements[ 'feeRepayAmnt' ].value.replace(/[^0-9.]/g, ""));
   
	if((document.forms[ 'frmTxn' ].elements[ 'effectiveDate' ].value == "")||(document.forms[ 'frmTxn' ].elements[ 'dummyDebitAccNo' ].value == "F")|| (document.forms[ 'frmTxn' ].elements[ 'debitAccCcy' ].value == "")|| (document.forms[ 'frmTxn' ].elements[ 'obligationID' ].value == "") ){
	    $( '#messageArea' ).removeClass( 'ui-helper-hidden' );	
		var node = document.getElementById('messageArea'),
		textContent = node.textContent;
		if(textContent.length==2){
		$('#messageArea ul').append('<li>Mandatory Fields Required to Proceed.</li>');
		 $('#messageArea').addClass('errors');
		}	
	}
  
	else{
	   if(principalAmt<repayPrincipalAmnt ||interestBalAmnt<interestRepayAmnt ||feeBalAmnt<feeRepayAmnt){
	   $( '#messageArea' ).addClass('errors');
	  $( '#messageArea' ).removeClass( 'ui-helper-hidden' );	
	 if(principalAmt<repayPrincipalAmnt){
		  $('#messageArea ul').append('<li>Repayment Principal should be lesser than or equal to principal balance amount</li>');
		}
	 if(interestBalAmnt<interestRepayAmnt){
		 $('#messageArea ul').append('<li>Repayment interest should be lesser than or equal to interest balance amount</li>');
		}
	
	if(feeBalAmnt<feeRepayAmnt){
		  $('#messageArea ul') .append('<li>Repayment fee should be lesser than fee balance Amount</li>');
		}
	}else{
	$( '#messageArea' ).addClass( 'ui-helper-hidden' );
	$("#payInvoiceBtn1").attr("class","hidden");
	$("#submitBtn1").attr("class","block ux_extralargepaddingtb");
	$("#payInvoiceBtn2").attr("class","hidden");
	$("#submitBtn2").attr("class","block ux_extralargepaddingtb");
	$('#tab_1').find('a').removeClass('active');
	$("#tab_2").find('a').addClass('active');
	
	$("#dummyDebitAccNo").attr("disabled",true);
	$("#effectiveDate").attr("disabled",true);
		
	$("#siStartDate").attr("disabled",true);
	$("#siEndDate").attr("disabled",true);
	$("#siExecType").attr("disabled",true);
	$("#siFrequency").attr("disabled",true);
	$("#siPeriod").attr("disabled",true);
	$("#siRefDay").attr("disabled",true);
	$("#siHolidayAction").attr("disabled",true);
	$("#siNextExecDate").attr("disabled",true);
	
	document.getElementById('effectiveDate').readOnly = true;
	
	document.getElementById('principalRepayAmnt').readOnly = true;
	$("#principalRepayAmnt").addClass("disabled");
	document.getElementById('interestRepayAmnt').readOnly = true;
	$("#interestRepayAmnt").addClass("disabled");
	document.getElementById('feeRepayAmnt').readOnly = true;
	$("#feeRepayAmnt").addClass("disabled");
	
	}
 }
}
function crumbClick(id)
{
 if(!$( '#messageArea' ).hasClass( 'ui-helper-hidden' )){
      $('#messageArea ul').empty();
	  $('#messageArea').removeClass('errors');
  }
var principalAmt=parseFloat(document.forms[ 'frmTxn' ].elements[ 'principalBalAmntDesc' ].value.replace(/[^0-9.]/g, ""));
   var repayPrincipalAmnt= parseFloat(document.forms[ 'frmTxn' ].elements[ 'principalRepayAmnt' ].value.replace(/[^0-9.]/g, ""));
  
   var interestBalAmnt=parseFloat(document.forms[ 'frmTxn' ].elements[ 'interestBalAmnt' ].value.replace(/[^0-9.]/g, ""));
   var interestRepayAmnt= parseFloat(document.forms[ 'frmTxn' ].elements[ 'interestRepayAmnt' ].value.replace(/[^0-9.]/g, ""));
   
    var feeBalAmnt=parseFloat(document.forms[ 'frmTxn' ].elements[ 'feeBalAmnt' ].value.replace(/[^0-9.]/g, ""));
   var feeRepayAmnt= parseFloat(document.forms[ 'frmTxn' ].elements[ 'feeRepayAmnt' ].value.replace(/[^0-9.]/g, ""));
   
	if(id == 'tab_1')
	{
		$("#payInvoiceBtn1").attr("class","block ux_extralargepaddingtb");
		$("#submitBtn1").attr("class","hidden");
		$("#payInvoiceBtn2").attr("class","block ux_extralargepaddingtb");
		$("#submitBtn2").attr("class","hidden");
		$('#tab_2').find('a').removeClass('active');
		$("#tab_1").find('a').addClass('active');
		
		$("#dummyDebitAccNo").attr("disabled",false);
		$("#effectiveDate").attr("disabled",false);
		document.getElementById('effectiveDate').readOnly = false;
		document.getElementById('principalRepayAmnt').readOnly = false;
		$("#principalRepayAmnt").removeClass("disabled");
		document.getElementById('interestRepayAmnt').readOnly = false;
		$("#interestRepayAmnt").removeClass("disabled");
		document.getElementById('feeRepayAmnt').readOnly = false;
		$("#feeRepayAmnt").removeClass("disabled");
		
		$("#siStartDate").attr("disabled",false);
		$("#siEndDate").attr("disabled",false);
		$("#siExecType").attr("disabled",false);
		$("#siFrequency").attr("disabled",false);
		$("#siPeriod").attr("disabled",false);
		$("#siRefDay").attr("disabled",false);
		$("#siHolidayAction").attr("disabled",false);
		$("#siNextExecDate").attr("disabled",false);
	}
	else
	{
	 if((document.forms[ 'frmTxn' ].elements[ 'effectiveDate' ].value == "")|| (document.forms[ 'frmTxn' ].elements[ 'dummyDebitAccNo' ].value == "F")||(document.forms[ 'frmTxn' ].elements[ 'debitAccCcy' ].value == "")|| (document.forms[ 'frmTxn' ].elements[ 'obligationID' ].value == "") ){
	   $( '#messageArea' ).removeClass( 'ui-helper-hidden' );
	   crumbClick("tab_1");
		var node = document.getElementById('messageArea'),
		textContent = node.textContent;
		if(textContent.length==2){
		$('#messageArea ul').append('<li>Mandatory Fields Required to Proceed.</li>');
		 $('#messageArea').addClass('errors');
		}	
		
	}
	else{
	if(principalAmt<repayPrincipalAmnt ||interestBalAmnt<interestRepayAmnt ||feeBalAmnt<feeRepayAmnt){
	   $( '#messageArea' ).addClass('errors');
	  $( '#messageArea' ).removeClass( 'ui-helper-hidden' );	
	 if(principalAmt<repayPrincipalAmnt){
		  $('#messageArea ul').append('<li>Repayment Principal should be lesser than or equal to principal balance amount</li>');
		}
	 if(interestBalAmnt<interestRepayAmnt){
		 $('#messageArea ul').append('<li>Repayment interest should be lesser than or equal to interest balance amount</li>');
		}
	
	if(feeBalAmnt<feeRepayAmnt){
		  $('#messageArea ul') .append('<li>Repayment fee should be lesser than fee balance Amount</li>');
		}
	}else{
          $( '#messageArea' ).removeClass( 'ui-helper-hidden' );		
		$("#payInvoiceBtn1").attr("class","hidden");
		$("#submitBtn1").attr("class","block ux_extralargepaddingtb");
		$("#payInvoiceBtn2").attr("class","hidden");
		$("#submitBtn2").attr("class","block ux_extralargepaddingtb");
		$('#tab_1').find('a').removeClass('active');
		$("#tab_2").find('a').addClass('active');
		
		$("#dummyDebitAccNo").attr("disabled",true);
		$("#effectiveDate").attr("disabled",true);
		
		document.getElementById('effectiveDate').readOnly = true;
		document.getElementById('principalRepayAmnt').readOnly = true;
		$("#principalRepayAmnt").addClass("disabled");
		document.getElementById('interestRepayAmnt').readOnly = true;
		$("#interestRepayAmnt").addClass("disabled");
		document.getElementById('feeRepayAmnt').readOnly = true;
		$("#feeRepayAmnt").addClass("disabled");
		
		$("#siStartDate").attr("disabled",true);
		$("#siEndDate").attr("disabled",true);
		$("#siExecType").attr("disabled",true);
		$("#siFrequency").attr("disabled",true);
		$("#siPeriod").attr("disabled",true);
		$("#siRefDay").attr("disabled",true);
		$("#siHolidayAction").attr("disabled",true);
		$("#siNextExecDate").attr("disabled",true);
	}	
	}
	}
}
function cancelPayInvoice()
{	
	document.getElementById('siExecType').value= '0';	
	document.getElementById('siFrequency').value= "DAILY";
	setRefAttributes('DAILY');
	$( '#payInvoiceParamsDiv' ).attr( "class", "hidden" );
	$('#siEnabled1').attr('checked',false);
	document.forms[ 'frmTxn' ].elements[ 'debitAccCcy' ].value = "";
	$('#tab_2').find('a').removeClass('active');
	$("#tab_1").find('a').addClass('active');	
	
	document.getElementById('siEndDate').value= "";	
	
	$( '#payInvoiePopup' ).dialog( 'close' );
}
function setDebitAccount(me)
{
	var debitAccountStr = me.value ;
	var strArray = debitAccountStr.split('|');
	document.getElementById('debitAccNo').value = strArray[0];
	if( debitAccountStr == 'F' )
		document.getElementById('debitAccCcy').value = '';
	else
		document.getElementById('debitAccCcy').value = strArray[1];
}
function savePayInvoice(strUrl, frmId,saveAction)
{
	$("#effectiveDate").attr("disabled",false);
	$("#obligorID").attr("disabled",false);
	$("#obligationID").attr("disabled",false);
	$("#siStartDate").attr("disabled",false);
	$("#requestReference").attr("disabled",false);
	$("#requestDate").attr("disabled",false);
	$("#siNextExecDate").attr("disabled",false);
	$("#siHolidayAction").attr("disabled",false);
	$("#siFrequency").attr("disabled",false);
	$("#siRefDay").attr("disabled",false);
	$("#siEndDate").attr("disabled",false);
	$("#siPeriod").attr("disabled",false);
	$("#siExecType").attr("disabled",false);
	$("#debitAccCcy").attr("disabled",false);
	$("#feeBalAmntDesc").attr("disabled",false);			
	$('#siEnabled1').attr('checked',false);	
	
	document.getElementById('saveAction').value = saveAction ; 
	var frm = document.getElementById( frmId );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getDebitAccList()
{
	var selectedOption = document.getElementById('obligorID').value ;
	var strUrl = 'getDebitAccDetails.srvc?' + csrfTokenName + "=" + csrfTokenValue
			+ '&$obligorIDFilter=' + selectedOption;
	Ext.Ajax.request(
	{
		url : strUrl,
		method : "POST",
		success : function( response )
		{
			loadDebitAccData( Ext.decode( response.responseText ) );
		},
		failure : function( response )
		{
			console.log( 'Error Occured' );
		}
	} );
}
function loadDebitAccData( obligationList )
{
	var temp;
	var debitAccItemList = obligationList.DEBITACCOUNT;
	var strDisText = '';
	strDisText = obligationList.DISCLAIMER_TEXT;
	var sysParamDisFlag = '';
	sysParamDisFlag = obligationList.SYS_PARAM_DISCLAIMER_TEXT;
	
	if(sysParamDisFlag==='Y'){
			$("label[id='disclaimerText']").text(strDisText);
		}
	
	
	if( debitAccItemList.length > 0 )
	{
		
		for( var i = 0 ; i < debitAccItemList.length ; i++ )
		{
			temp = debitAccItemList[ i ].filterCode;
			currencyData[ i ] = temp.split( "|" );
			
			eval( "document.forms['frmTxn'].elements['dummyDebitAccNo'].options[i]=" + "new Option('"
				+ debitAccItemList[ i ].filterValue + "','" + debitAccItemList[ i ].filterCode + "')" );
		}
	}

}

function showRealtimeResponsePopup()
{
	$( '#realtimeResPopup' ).dialog(
	{
		autoOpen : false,
		height : 300,
		width : '65%',
		modal : true,
		resizable : true,
		title : "Request in Process"
	} );
	openResponseGrid();
	$( '#realtimeResPopup' ).dialog( "open" );
	
}
function closePopup( dlgId )
{
	$( '#' + dlgId + '' ).dialog( "close" );
	
}
function hideUnhideBtns()
{
	$("#btnContInBackDiv").hide();
	$("#cancelDiv").show();
}
function checkInvoiceSiEnabled( flag )
{
	if( flag.checked )
	{
		$( '#payInvoiceParamsDiv' ).attr( "class", "block ux_panel-transparent-background  xn-pad-10 ux_label-style" );
		$('#siEnabled1').val('Y');
	}
	else
	{
		$( '#payInvoiceParamsDiv' ).attr( "class", "hidden" );
		$('#siEnabled1').val('N');
	}

}
function checkInvoiceSiEnabledOnLoad()
{
	if(isHidden( 'isSiEnabled' ) )
	{
		$( '#payInvoiceParams' ).attr( "class", "hidden" );
	}
	else
	{
		$( '#payInvoiceParams' ).attr( "class", "block jq-panel-header1 ux_header-padding ux_sifields-header ux_margin-top-12" );
	}

}