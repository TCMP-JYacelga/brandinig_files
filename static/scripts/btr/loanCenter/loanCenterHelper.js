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

	if($('#payDownFieldForm').length >0)
		formId = 'payDownFieldForm';
		else
			formId = 'frmTxn';
			
	if( frequencyType == "MONTHLY" )
	{
		$( '#siRefDay > option' ).remove();
		$( '#siPeriod > option' ).remove();

		if( document.forms[ formId ].elements[ 'siRefDay' ].disabled == true )
		{
			document.forms[ formId ].elements[ 'siRefDay' ].disabled = false;
			$( '#siRefDay' ).removeClass( 'disabled' );
		}
		if( document.forms[ formId ].elements[ 'siHolidayAction' ].disabled == true )
		{
			document.forms[ formId ].elements[ 'siHolidayAction' ].disabled = false;
			$( '#siHolidayAction' ).removeClass( 'disabled' );
		}

		// code to remove the N/A option if it exist for siHolidayAction
		var temp = document.forms[ formId ].elements[ 'siHolidayAction' ].length;
		if( temp == 4 )
		{
			$( "#siHolidayAction option[value='3']" ).remove();
		}

		for( var i = 0 ; i < RefMonArray.length ; i++ )
		{
			eval( "document.forms[ formId ].elements[ 'siRefDay' ].options[i]=" + "new Option"
				+ RefMonArray[ i ] );
		}

		intPeriod = MonthlyPeriodArray.length;
		for( var i = 0 ; i < intPeriod ; i++ )
		{
			eval( "document.forms[ formId ].elements[ 'siPeriod' ].options[i]=" + "new Option"
				+ MonthlyPeriodArray[ i ] );

		}
	}
	else if( frequencyType == "WEEKLY" )
	{
		$( '#siRefDay > option' ).remove();
		$( '#siPeriod > option' ).remove();

		if( document.forms[ formId ].elements[ 'siRefDay' ].disabled == true )
		{
			document.forms[ formId ].elements[ 'siRefDay' ].disabled = false;
			$( '#siRefDay' ).removeClass( 'disabled' );
		}
		if( document.forms[ formId ].elements[ 'siHolidayAction' ].disabled == true )
		{
			document.forms[ formId ].elements[ 'siHolidayAction' ].disabled = false;
			$( '#siHolidayAction' ).removeClass( 'disabled' );
		}

		// code to remove the N/A option if it exist for siHolidayAction
		var temp = document.forms[ formId ].elements[ 'siHolidayAction' ].length;
		if( temp == 4 )
		{
			$( "#siHolidayAction option[value='3']" ).remove();
		}

		for( var i = 0 ; i < RefWeekDay.length ; i++ )
		{
			eval( "document.forms[ formId ].elements[ 'siRefDay' ].options[i]=" + "new Option"
				+ RefWeekDay[ i ] );
		}

		for( var i = 0 ; i < PeriodWeekArray.length ; i++ )
		{
			eval( "document.forms[ formId ].elements[ 'siPeriod' ].options[i]=" + "new Option"
				+ PeriodWeekArray[ i ] );
		}

	}
	else if( frequencyType == "DAILY" )
	{
		$( '#siRefDay > option' ).remove();
		$( '#siPeriod > option' ).remove();
		$( '#siRefDay' ).addClass( 'rounded w14 disabled' );
		$( '#siHolidayAction' ).addClass( 'rounded w14 disabled' );

		document.forms[ formId ].elements[ 'siRefDay' ].disabled = true;
		document.forms[ formId ].elements[ 'siHolidayAction' ].disabled = true;

		intPeriod = DailyPeriodArray.length;
		for( var i = 0 ; i < RefDay.length ; i++ )
		{
			eval( "document.forms[ formId ].elements[ 'siRefDay' ].options[i]=" + "new Option" + RefDay[ i ] );

		}
		eval( "document.forms[ formId ].elements[ 'siHolidayAction' ].options[3]=" + "new Option"
			+ HolidayAction[ 0 ] );
		document.forms[ formId ].elements[ 'siHolidayAction' ].options[ 3 ].selected = true;

		for( var i = 0 ; i < intPeriod ; i++ )
		{
			eval( "document.forms[ formId ].elements[ 'siPeriod' ].options[i]=" + "new Option"
				+ DailyPeriodArray[ i ] );
		}
	}
}

function goToPage( strUrl, frmId, seletedPayType, isOpenPopup, strNextDay )
{
	// seletedPayType is Paydown or Advance link
	// isOpenPopup tells whether to open popup after submitting the form
	document.getElementById( "selectedPayType" ).value = seletedPayType;
	document.getElementById( "isOpenPopup" ).value = isOpenPopup;
	var frm = document.getElementById( frmId );
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'strNextDay', strNextDay));
	document.body.appendChild(frm);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	strNextDay = "N";
	frm.submit();
}

function createFormField( element, type, name, value )
{
	var inputField;
	inputField = document.createElement( element );
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function showPaydownPopup()
{
	$( '#payDownPopup' ).dialog(
	{
		autoOpen : false,
		height : 'auto',
		width : '65%',
		modal : true,
		resizable : false,
		title : "Paydown Payment"
	} ).dialog( "widget" ).find( ".ui-dialog-titlebar" ).hide();

	$( '#payDownPopup' ).dialog( "open" );
	var dialogHeight = $( "#payDownPopup" ).height();
	$( "#payDownPopup" ).dialog( "option", "height", parseInt( dialogHeight,10 ) + 55 );
}

function showAdvancePopup()
{
	$( '#advancedPopup' ).dialog(
	{
		autoOpen : false,
		height : 'auto',
		width : '65%',
		modal : true,
		resizable : false,
		title : "Add Advance"
	} ).dialog( "widget" ).find( ".ui-dialog-titlebar" ).hide();

	$( '#advancedPopup' ).dialog( "open" );
	var dialogHeight = $( "#advancedPopup" ).height();
	$( "#advancedPopup" ).dialog( "option", "height", parseInt( dialogHeight,10 ) + 55 );
}

function showInvoicePopup()
{
	$( '#payInvoicePopup' ).dialog(
	{
		autoOpen : false,
		height : 'auto',
		width : '65%',
		modal : true,
		resizable : false,
		title : "Add Pay Invoice"
	} ).dialog( "widget" ).find( ".ui-dialog-titlebar" ).hide();
	$( '#payInvoicePopup' ).dialog( "open" );
	$( '#payInvoicePopup' ).dialog( "option","positon","center" );
	$('#siEnabled1').attr('checked',false);
	$("#siStartDate").attr("disabled",true);
	$("#siEndDate").attr("disabled",true);
	$("#siExecType").attr("disabled",true);
	$("#siFrequency").attr("disabled",true);
	$("#siPeriod").attr("disabled",true);
	$("#siRefDay").attr("disabled",true);
	$("#siHolidayAction").attr("disabled",true);
	$("#siNextExecDate").attr("disabled",true);
}



function showVerifySubmit()
{
	
	
	var principalBalanceAmnt = parseInt($('#principalBalanceAmnt').val().replace(/[^0-9.]/g, ""),10);	
	var interestBalanceAmnt = parseInt($('#interestBalanceAmnt').val().replace(/[^0-9.]/g, ""),10);
	var principalRepayAmnt = parseInt($('#principalRepayAmnt').val().replace(/[^0-9.]/g, ""),10);
	var interestRepayAmnt = parseInt($('#interestRepayAmnt').val().replace(/[^0-9.]/g, ""),10);
	
	
	if(principalBalanceAmnt<0){
		alert("The Principal Balance is getting retrieved, \n Please Wait");
		return false;
	}
	var paymentTypeRadio;	
	var paymentTypePartial ;
	if($("#paymentType2").val() == 'P'){
		paymentTypePartial = true;
	}else {
		paymentTypePartial = false;
	}
	
	if((document.forms[ 'payDownFieldForm' ].elements[ 'effectiveDate' ].value == "")|| (document.forms[ 'payDownFieldForm' ].elements[ 'debitAccCcy' ].value == "")|| (document.forms[ 'payDownFieldForm' ].elements[ 'obligorID' ].value == "")|| (document.forms[ 'payDownFieldForm' ].elements[ 'obligationID' ].value == "")){
		$( '#messageArea' ).removeClass( 'ui-helper-hidden' );
		
	}else if(exceedBalancesFeature != 'Y' && paymentTypePartial
			&& (principalRepayAmnt > 0 && principalRepayAmnt >= principalBalanceAmnt
			||  interestRepayAmnt > 0 && interestRepayAmnt >= interestBalanceAmnt)){
			
			if(principalRepayAmnt > 0 && principalRepayAmnt >= principalBalanceAmnt){
				$( '#messageArea').empty();
				$( '#messageArea').append("<ul><li>Principle amount should be less than  Principle Balance.</ul></li>");
				$( '#messageArea' ).removeClass( 'ui-helper-hidden' );	
				principleEntered = true;
			}
			if(interestRepayAmnt > 0 && interestRepayAmnt >= interestBalanceAmnt){
				if(principleEntered){		
					$( '#messageArea').append("<ul><li>Interest amount should be less than  Interest Balance.</ul></li>");
					$( '#messageArea' ).removeClass( 'ui-helper-hidden' );			
				}else{
					$( '#messageArea').empty();
					$( '#messageArea' ).removeClass( 'ui-helper-hidden' );	
					$( '#messageArea').append("<ul><li>Interest amount should be less than  Interest Balance.</ul></li>");
					$( '#messageArea' ).removeClass( 'ui-helper-hidden' );	
					principleEntered = false;
				}
			}
		}else{
		$( '#messageArea' ).addClass( 'ui-helper-hidden' );
		checkCutOffTime("LNPAYDOWN,", "", "", "", "N");
		
		/*$( '#messageArea' ).addClass( 'ui-helper-hidden' );
		$( '#payDownPopup' ).attr( "class", "block" );
		$( '#tab_1' ).find( 'a' ).removeClass( 'active' );
		$( "#tab_2" ).find( 'a' ).addClass( 'active' );
		$( '#loanPayDownRightSubmitBtn' ).attr( "class", "block" );
		$( '#loanPayDownRightBtn' ).attr( "class", "hidden" );
		$( '#loanPayDownLowerRightSubmitBtn' ).attr( "class", "block" );
		$( '#loanPayDownLowerRightBtn' ).attr( "class", "hidden" );
		$( '#principalRepayAmnt' ).removeClass( 'rounded w14' );
		$( '#principalRepayAmnt' ).addClass( 'rounded w14 disabled' );
		$( '#interestRepayAmnt' ).removeClass( 'rounded w14' );
		$( '#interestRepayAmnt' ).addClass( 'rounded w14 disabled' );

		$( '#obligorID' ).addClass( 'rounded w14 disabled' );
		$( '#obligationID' ).addClass( 'rounded w14 disabled' );
		$( '#requestReference' ).addClass( 'rounded w14 disabled' );
		$( '#debitAccNo' ).addClass( 'rounded w14 disabled' );
		$( '#effectiveDate' ).addClass( 'rounded w14 disabled' );
		$( '#siStartDate' ).addClass( 'rounded w14 disabled' );
		$( '#siEndDate' ).addClass( 'rounded w14 disabled' );
		$( '#siExecType' ).addClass( 'rounded w14 disabled' );
		$( '#siFrequency' ).addClass( 'rounded w14 disabled' );
		$( '#siPeriod' ).addClass( 'rounded w14 disabled' );
		$( '#siRefDay' ).addClass( 'rounded w14 disabled' );
		$( '#siHolidayAction' ).addClass( 'rounded w14 disabled' );

		document.forms[ 'payDownFieldForm' ].elements[ 'obligorID' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'obligationID' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'requestReference' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'debitAccNo' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'effectiveDate' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'principalBalAmnt' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'interestBalAmnt' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'sellerId' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'debitAccCcy' ].disabled = true;
		paymentTypeRadio = document.forms[ 'payDownFieldForm' ].elements[ 'paymentType' ];
		for( var i = 0 ; i < paymentTypeRadio.length ; i++ )
		{
			paymentTypeRadio[ i ].disabled = true;
		}

		document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'siStartDate' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'siEndDate' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'siExecType' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'siFrequency' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'siPeriod' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'siRefDay' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].disabled = true;
		document.forms[ 'payDownFieldForm' ].elements[ 'siNextExecDate' ].disabled = true;*/
	}

}
function disable()
{
$( '#messageArea' ).addClass( 'ui-helper-hidden' );
$( '#payDownPopup' ).attr( "class", "block" );
$( '#tab_1' ).find( 'a' ).removeClass( 'active' );
$( "#tab_2" ).find( 'a' ).addClass( 'active' );
$( '#loanPayDownRightSubmitBtn' ).attr( "class", "block" );
$( '#loanPayDownRightBtn' ).attr( "class", "hidden" );
$( '#loanPayDownLowerRightSubmitBtn' ).attr( "class", "block" );
$( '#loanPayDownLowerRightBtn' ).attr( "class", "hidden" );
$( '#principalRepayAmnt' ).removeClass( 'rounded w14' );
$( '#principalRepayAmnt' ).addClass( 'rounded w14 disabled' );
$( '#interestRepayAmnt' ).removeClass( 'rounded w14' );
$( '#interestRepayAmnt' ).addClass( 'rounded w14 disabled' );

$( '#obligorID' ).addClass( 'rounded w14 disabled' );
$( '#obligationID' ).addClass( 'rounded w14 disabled' );
$( '#requestReference' ).addClass( 'rounded w14 disabled' );
$( '#debitAccNo' ).addClass( 'rounded w14 disabled' );
$( '#effectiveDate' ).addClass( 'rounded w14 disabled' );
$( '#siStartDate' ).addClass( 'rounded w14 disabled' );
$( '#siEndDate' ).addClass( 'rounded w14 disabled' );
$( '#siExecType' ).addClass( 'rounded w14 disabled' );
$( '#siFrequency' ).addClass( 'rounded w14 disabled' );
$( '#siPeriod' ).addClass( 'rounded w14 disabled' );
$( '#siRefDay' ).addClass( 'rounded w14 disabled' );
$( '#siHolidayAction' ).addClass( 'rounded w14 disabled' );

document.forms[ 'payDownFieldForm' ].elements[ 'obligorID' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'obligationID' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'requestReference' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'debitAccNo' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'effectiveDate' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'principalBalAmnt' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'interestBalAmnt' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'sellerId' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'debitAccCcy' ].disabled = true;
paymentTypeRadio = document.forms[ 'payDownFieldForm' ].elements[ 'paymentType' ];
for( var i = 0 ; i < paymentTypeRadio.length ; i++ )
{
	paymentTypeRadio[ i ].disabled = true;
}

document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'siStartDate' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'siEndDate' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'siExecType' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'siFrequency' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'siPeriod' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'siRefDay' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].disabled = true;
document.forms[ 'payDownFieldForm' ].elements[ 'siNextExecDate' ].disabled = true;
}
function showPayDownDetails()
{
	var paymentTypeRadio;

	$( '#payDownPopup' ).attr( "class", "block" );
	$( '#tab_2' ).find( 'a' ).removeClass( 'active' );
	$( "#tab_1" ).find( 'a' ).addClass( 'active' );
	$( '#loanPayDownRightSubmitBtn' ).attr( "class", "hidden" );
	$( '#loanPayDownRightBtn' ).attr( "class", "block" );
	$( '#loanPayDownLowerRightSubmitBtn' ).attr( "class", "hidden" );
	$( '#loanPayDownLowerRightBtn' ).attr( "class", "block" );
	$( '#principalRepayAmnt' ).removeClass( 'rounded w14 disabled' );
	$( '#principalRepayAmnt' ).addClass( 'rounded w14' );
	$( '#interestRepayAmnt' ).removeClass( 'rounded w14 disabled' );
	$( '#interestRepayAmnt' ).addClass( 'rounded w14' );

	$( '#obligorID' ).removeClass( 'disabled' );
	$( '#obligationID' ).removeClass( 'disabled' );
	$( '#requestReference' ).removeClass( 'disabled' );
	$( '#debitAccNo' ).removeClass( 'disabled' );
	$( '#effectiveDate' ).removeClass( 'disabled' );
	$( '#siStartDate' ).removeClass( 'disabled' );
	$( '#siEndDate' ).removeClass( 'disabled' );
	$( '#siExecType' ).removeClass( 'disabled' );
	$( '#siFrequency' ).removeClass( 'disabled' );
	$( '#siPeriod' ).removeClass( 'w14 disabled' );
	$( '#siRefDay' ).removeClass( 'disabled' );
	$( '#siHolidayAction' ).removeClass( 'disabled' );

	document.forms[ 'payDownFieldForm' ].elements[ 'obligorID' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'obligationID' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'requestReference' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'debitAccNo' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'effectiveDate' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'principalBalAmnt' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'interestBalAmnt' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'sellerId' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'debitAccCcy' ].disabled = false;
	paymentTypeRadio = document.forms[ 'payDownFieldForm' ].elements[ 'paymentType' ];
	for( var i = 0 ; i < paymentTypeRadio.length ; i++ )
	{
		paymentTypeRadio[ i ].disabled = false;
	}

	document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siStartDate' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siEndDate' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siExecType' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siFrequency' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siPeriod' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siRefDay' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siNextExecDate' ].disabled = false;
}

function showAdvanceVerifySubmit()
{
	
	var principalBalanceAmnt = parseFloat($('#principalBalanceAmnt').val().replace(/[^0-9.]/g, ""));
	var loanAdvanceAmnt = parseFloat($('#loanAdvanceAmnt').val().replace(/[^0-9.]/g, ""));

  
	$( '#messageArea').empty();
	if((document.forms[ 'loanAdvanceFieldForm' ].elements[ 'requestDate' ].value == "")|| (document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccCcy' ].value == "")|| (document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligorID' ].value == "")|| (document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligationID' ].value == "")|| (document.forms[ 'loanAdvanceFieldForm' ].elements[ 'loanAdvanceAmnt' ].value <="0.00")){
		$( '#messageArea').append("<ul><li>Mandatory Fields Required to Proceed.</ul></li>");
		$( '#messageArea' ).removeClass( 'ui-helper-hidden' );
		
	}
	else{
		
		checkCutOffTime("LNADVANCE,", "", "", "", "N");
	$( '#messageArea' ).addClass( 'ui-helper-hidden' );
	/*$( '#loanAdvancePopup' ).attr( "class", "block xn-pad-10" );
	$( '#tab1' ).find( 'a' ).removeClass( 'active' );
	$( "#tab2" ).find( 'a' ).addClass( 'active' );

	$( '#loanAdvanceRightSubmitBtn' ).attr( "class", "block" );
	$( '#loanAdvanceRightBtn' ).attr( "class", "hidden" );

	$( '#loanAdvanceLowerRightSubmitBtn' ).attr( "class", "block" );
	$( '#loanAdvanceLowerRightBtn' ).attr( "class", "hidden" );
	$( '#loanAdvanceAmnt' ).removeClass( 'rounded w14' );
	$( '#loanAdvanceAmnt' ).addClass( 'rounded w14 disabled' );

	$( '#obligorID' ).addClass( 'rounded w14 disabled' );
	$( '#obligationID' ).addClass( 'rounded w14 disabled' );
	$( '#requestReference' ).addClass( 'rounded w14 disabled' );
	$( '#creditAccNo' ).addClass( 'rounded w14 disabled' );
	$( '#requestDate' ).addClass( 'rounded w14 disabled' );
	$( '#siStartDate' ).addClass( 'rounded w14 disabled' );
	$( '#siStartDate' ).addClass( 'rounded w14 disabled' );
	$( '#siEndDate' ).addClass( 'rounded w14 disabled' );
	$( '#siExecType' ).addClass( 'rounded w14 disabled' );
	$( '#siFrequency' ).addClass( 'rounded w14 disabled' );
	$( '#siPeriod' ).addClass( 'rounded w14 disabled' );
	$( '#siRefDay' ).addClass( 'rounded w14 disabled' );
	$( '#siHolidayAction' ).addClass( 'rounded w14 disabled' );

	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligorID' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligationID' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'requestReference' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccNo' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'requestDate' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'loanAdvanceAmnt' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siEnabled' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siStartDate' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siEndDate' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siExecType' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siFrequency' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligationID' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siPeriod' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDay' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayAction' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siNextExecDate' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalAmnt' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalAmnt' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'sellerId' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccCcy' ].disabled = true;*/
	}
}

function advanceDisable()
{
	$( '#messageArea' ).addClass( 'ui-helper-hidden' );
	$( '#loanAdvancePopup' ).attr( "class", "block xn-pad-10" );
	$( '#tab1' ).find( 'a' ).removeClass( 'active' );
	$( "#tab2" ).find( 'a' ).addClass( 'active' );

	$( '#loanAdvanceRightSubmitBtn' ).attr( "class", "block" );
	$( '#loanAdvanceRightBtn' ).attr( "class", "hidden" );

	$( '#loanAdvanceLowerRightSubmitBtn' ).attr( "class", "block" );
	$( '#loanAdvanceLowerRightBtn' ).attr( "class", "hidden" );
	$( '#loanAdvanceAmnt' ).removeClass( 'rounded w14' );
	$( '#loanAdvanceAmnt' ).addClass( 'rounded w14 disabled' );

	$( '#obligorID' ).addClass( 'rounded w14 disabled' );
	$( '#obligationID' ).addClass( 'rounded w14 disabled' );
	$( '#requestReference' ).addClass( 'rounded w14 disabled' );
	$( '#creditAccNo' ).addClass( 'rounded w14 disabled' );
	$( '#requestDate' ).addClass( 'rounded w14 disabled' );
	$( '#siStartDate' ).addClass( 'rounded w14 disabled' );
	$( '#siStartDate' ).addClass( 'rounded w14 disabled' );
	$( '#siEndDate' ).addClass( 'rounded w14 disabled' );
	$( '#siExecType' ).addClass( 'rounded w14 disabled' );
	$( '#siFrequency' ).addClass( 'rounded w14 disabled' );
	$( '#siPeriod' ).addClass( 'rounded w14 disabled' );
	$( '#siRefDay' ).addClass( 'rounded w14 disabled' );
	$( '#siHolidayAction' ).addClass( 'rounded w14 disabled' );

	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligorID' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligationID' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'requestReference' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccNo' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'requestDate' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'loanAdvanceAmnt' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siEnabled' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siStartDate' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siEndDate' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siExecType' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siFrequency' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligationID' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siPeriod' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDay' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayAction' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siNextExecDate' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalAmnt' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalAmnt' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'sellerId' ].disabled = true;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccCcy' ].disabled = true;
	}
function showAdvanceDetails()
{
	$( '#loanAdvancePopup' ).attr( "class", "block" );
	$( '#tab2' ).find( 'a' ).removeClass( 'active' );
	$( "#tab1" ).find( 'a' ).addClass( 'active' );

	$( '#loanAdvanceRightSubmitBtn' ).attr( "class", "hidden" );
	$( '#loanAdvanceRightBtn' ).attr( "class", "block" );
	$( '#loanAdvanceLowerRightSubmitBtn' ).attr( "class", "hidden" );
	$( '#loanAdvanceLowerRightBtn' ).attr( "class", "block" );
	$( '#loanAdvanceAmnt' ).removeClass( 'rounded w14 disabled' );
	$( '#loanAdvanceAmnt' ).addClass( 'rounded w14' );

	$( '#obligorID' ).removeClass( 'disabled' );
	$( '#obligationID' ).removeClass( 'disabled' );
	$( '#requestReference' ).removeClass( 'disabled' );
	$( '#creditAccNo' ).removeClass( 'disabled' );
	$( '#requestDate' ).removeClass( 'disabled' );
	$( '#siStartDate' ).removeClass( 'disabled' );
	$( '#siStartDate' ).removeClass( 'disabled' );
	$( '#siEndDate' ).removeClass( 'disabled' );
	$( '#siExecType' ).removeClass( 'disabled' );
	$( '#siFrequency' ).removeClass( 'disabled' );
	$( '#siPeriod' ).removeClass( 'disabled' );
	$( '#siRefDay' ).removeClass( 'disabled' );
	$( '#siHolidayAction' ).removeClass( 'disabled' );

	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligorID' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligationID' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'requestReference' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccNo' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'requestDate' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'loanAdvanceAmnt' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siEnabled' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siStartDate' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siEndDate' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siExecType' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siFrequency' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siPeriod' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDay' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayAction' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siNextExecDate' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalAmnt' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalAmnt' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'sellerId' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccCcy' ].disabled = false;
}

function getObligationDebitAccList( selectedOption )
{
	currencyData.length = 0;
	
	if( !Ext.Ajax )
	{
		setTimeout( function()
		{
			getObligationDebitAccList( selectedOption )
		}, 1000 );
	}
	else
	{
		if( selectedOption != '' )
		{
			$( '#obligationID > option' ).remove();
			$( '#debitAccNo > option' ).remove();
			var strUrl = 'getObligationNDebitAccDetails.srvc?' + csrfTokenName + "=" + csrfTokenValue
				+ '&$obligorIDFilter=' + selectedOption;
			Ext.Ajax.request(
			{
				url : strUrl,
				method : "POST",
				success : function( response )
				{
					loadObligationDebitAccData( Ext.decode( response.responseText ) );
				},
				failure : function( response )
				{
					console.log( 'Error Occured' );
				}
			} );
		}
	}
}
function loadObligationDebitAccData( obligationList )
{
	var temp;
	var obligationItemList = obligationList.OBLIGATION_LIST;
	var debitAccItemList = obligationList.DEBITACC_LIST;

	if( obligationItemList.length > 0 )
	{
		for( var i = 0 ; i < obligationItemList.length ; i++ )
		{
			eval( "document.forms['payDownFieldForm'].elements['obligationID'].options[i]=" + "new Option('"
				+ obligationItemList[ i ].filterValue + "','" + obligationItemList[ i ].filterCode + "')" );
		}
	}

	if( debitAccItemList.length > 0 )
	{
		for( var i = 0 ; i < debitAccItemList.length ; i++ )
		{
			temp = debitAccItemList[ i ].filterCode;
			currencyData[ i ] = temp.split( "|" );

			eval( "document.forms['payDownFieldForm'].elements['debitAccNo'].options[i]=" + "new Option('"
				+ debitAccItemList[ i ].filterValue + "','" + currencyData[ i ][ 0 ] + "')" );
		}
		if(drAcctNo && drAcctNo != ''){
		   var items=$('#debitAccNo option');
		   var key=null;
		 for(var i=0;i<items.length;i++){
		  if(items[i].text==drAcctNo)
		  key=items[i].value;
		 }
		$('#debitAccNo').val(key);
		}
		setAccCurrency( "PAYDOWN" );
		if(paymentType && 'F' === paymentType){
			$("#paymentType1").prop("checked", true);
			checkPaymentType();
		}
		if(paymentType && 'P' === paymentType){
			$("#paymentType2").prop("checked", true);
			checkPaymentType();
		}
	}
	$('#obligationID').trigger('change');
}

function getLoanAccBalanceDetails( selectedOption, screenType )
{
	var serviceIdList=0;
	var strUrl = 'getLoanAccBalanceDetails.srvc?' + csrfTokenName + "=" + csrfTokenValue + '&$loanAccNmbr='
		+ selectedOption;

	if( !Ext.Ajax )
	{
		setTimeout( function()
		{
			getLoanAccBalanceDetails(  selectedOption, screenType )
		}, 1000 );
	}
	else
	{
		if( selectedOption != '' )
		{
			Ext.Ajax.request(
			{
				url : strUrl,
				method : "POST",
				success : function( response )
				{
					serviceIdList = ( (Ext.decode( response.responseText )).SERVICEID_LIST);
					setTimeout( function(){ getPrincipalBalance( serviceIdList, screenType, 0); }, 3000 );
				},
				failure : function( response )
				{
					console.log( 'Error Occured' );
				}
			} );
		}
	}
}

function getPrincipalBalance( serviceIdList, screenType, countr )
{
	var principalBalanceAmnt = "";
	var strUrl = 'getPrincipalBalance.srvc?'+ csrfTokenName + "=" + csrfTokenValue + '&$serviceIdList='+ serviceIdList;
	Ext.Ajax.request(
	{
		url : strUrl,
		method : "POST",
		success : function( response )
		{
			setLoanAccBalanceDetails( Ext.decode( response.responseText ), screenType );
			response = null;
		},
		failure : function( response )
		{
			console.log( 'Error Occured' );
			response = null;
		}
	} );
	
	principalBalanceAmnt = document.getElementById('principalBalanceAmnt').value;
	
	if( principalBalanceAmnt == 0 || principalBalanceAmnt == '' )
	{
		if( countr <= 2 )
		{
			countr++;
			setTimeout( function()
			{
				getPrincipalBalance( serviceIdList, screenType, countr )
			}, 3000 );
		}
	}
}

function setLoanAccBalanceDetails( balList, screenType )
{
	if( screenType == 'PAYDOWN' )
	{
		if(typeof(balList.PRINCIPAL_BAL) != "undefined")
		{
			document.forms[ 'payDownFieldForm' ].elements[ 'principalBalanceAmnt' ].value = balList.PRINCIPAL_BAL;
			document.forms[ 'payDownFieldForm' ].elements[ 'principalBalAmnt' ].value = balList.PRINCIPAL_BAL;
			document.forms[ 'payDownFieldForm' ].elements[ 'interestBalanceAmnt' ].value = balList.INTEREST_BAL;
			document.forms[ 'payDownFieldForm' ].elements[ 'interestBalAmnt' ].value = balList.INTEREST_BAL;
		}
		else
		{
			document.forms[ 'payDownFieldForm' ].elements[ 'principalBalanceAmnt' ].value = 0.0;
			document.forms[ 'payDownFieldForm' ].elements[ 'principalBalAmnt' ].value = 0.0;
			document.forms[ 'payDownFieldForm' ].elements[ 'interestBalanceAmnt' ].value = 0.0;
			document.forms[ 'payDownFieldForm' ].elements[ 'interestBalAmnt' ].value = 0.0;
			
		}
	}
	else
	{
		if(typeof(balList.PRINCIPAL_BAL) != "undefined")
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalanceAmnt' ].value = balList.PRINCIPAL_BAL;
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalAmnt' ].value = balList.PRINCIPAL_BAL;
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalanceAmnt' ].value = balList.CREDIT_BAL;
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalAmnt' ].value =balList.CREDIT_BAL;
		}
		else
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalanceAmnt' ].value = 0.0;
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalAmnt' ].value = 0.0;
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalanceAmnt' ].value = 0.0;
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalAmnt' ].value = 0.0;
		}
	}
}

function setAccCurrency( accFlag )
{
	var accNo, selectedValue;

	if( accFlag == "PAYDOWN" )
	{
		accNo = document.getElementById("debitAccNo");
		selectedValue = accNo.options[ accNo.selectedIndex ]?accNo.options[ accNo.selectedIndex ].value : '';
	}
	else if( accFlag == "ADVANCE" )
	{
		accNo = document.getElementById( "creditAccNo" );
		selectedValue = accNo.options[ accNo.selectedIndex ]?accNo.options[ accNo.selectedIndex ].value:'';
	}

	for( var i = 0 ; i < currencyData.length ; i++ )
	{
		if( currencyData[ i ][ 0 ] == selectedValue )
		{
			if( accFlag == "PAYDOWN" )
			{
				if( selectedValue == 'F' )
				{
					document.forms[ 'payDownFieldForm' ].elements[ 'debitAccCcy' ].value = '';
					document.forms[ 'payDownFieldForm' ].elements[ 'sellerId' ].value = '';
				}
				else
				{
					document.forms[ 'payDownFieldForm' ].elements[ 'debitAccCcy' ].value = currencyData[ i ][ 1 ];
					document.forms[ 'payDownFieldForm' ].elements[ 'sellerId' ].value = sellerDesc;
				}
			}
			else if( accFlag == "ADVANCE" )
			{
				if( selectedValue == 'F' )
				{
					document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccCcy' ].value = '';
					document.forms[ 'loanAdvanceFieldForm' ].elements[ 'sellerId' ].value = '';
				}
				else
				{
					document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccCcy' ].value = currencyData[ i ][ 1 ];
					document.forms[ 'loanAdvanceFieldForm' ].elements[ 'sellerId' ].value = sellerDesc;
				}
			}
			break;
		}
	}
}

function closePopup( dlgId )
{
/*	if('realtimeResPopup' == dlgId)
		stopRefresh = 'Y';
	$( '#' + dlgId + '' ).dialog( "close" );
	var frm = document.getElementById( 'frmMain' );
	var strUrl = 'loanCenterNew.srvc?'+ csrfTokenName + "=" + csrfTokenValue;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();*/
	$( '#' + dlgId + '' ).dialog( "close" );
}
function submitPaydown( strUrl, strNextDay1 )
{
	document.forms[ 'payDownFieldForm' ].elements[ 'obligorID' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'obligationID' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'debitAccNo' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siExecType' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siFrequency' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siPeriod' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siRefDay' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siStartDate' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siEndDate' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'effectiveDate' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'requestReference' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'principalBalAmnt' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'interestBalAmnt' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'sellerId' ].disabled = false;
	document.forms[ 'payDownFieldForm' ].elements[ 'debitAccCcy' ].disabled = false;

	paymentTypeRadio = document.forms[ 'payDownFieldForm' ].elements[ 'paymentType' ];
	for( var i = 0 ; i < paymentTypeRadio.length ; i++ )
	{
		paymentTypeRadio[ i ].disabled = false;
	}
	
	var frm = document.getElementById( 'payDownFieldForm' );
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'strNextDay', strNextDay));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function submitAdvance( strUrl, strNextDay )
{
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligorID' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligationID' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'requestReference' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccNo' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'loanAdvanceAmnt' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'requestDate' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siEnabled' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siStartDate' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siEndDate' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siExecType' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siFrequency' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siPeriod' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDay' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayAction' ].disabled = false;

	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalAmnt' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalAmnt' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'sellerId' ].disabled = false;
	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccCcy' ].disabled = false;

	var frm = document.getElementById( 'loanAdvanceFieldForm' );
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'strNextDay', strNextDay));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getObligationDepositAccList( selectedOption )
{
	currencyData.length = 0;
	$( '#obligationID > option' ).remove();
	$( '#creditAccNo > option' ).remove();
	if( !Ext.Ajax )
	{
		setTimeout( function()
		{
			getObligationDepositAccList( selectedOption )
		}, 1000 );
	}
	else
	{
		if( selectedOption != '' )
		{
			var strUrl = 'getObligationNDepositAccDetails.srvc?' + csrfTokenName + "=" + csrfTokenValue
				+ '&$obligorIDFilter=' + selectedOption;
			Ext.Ajax.request(
			{
				url : strUrl,
				method : "POST",
				success : function( response )
				{
					loadObligationDepositeAccData( Ext.decode( response.responseText ) );
				},
				failure : function( response )
				{
					console.log( 'Error Occured' );
				}
			} );
		}
	}
}

function loadObligationDepositeAccData( obligationList )
{
	var temp;
	var obligationItemList = obligationList.OBLIGATION_LIST;
	var depositAccItemList = obligationList.DEPOSITACC_LIST;

	if( obligationItemList.length > 0 )
	{
		for( var i = 0 ; i < obligationItemList.length ; i++ )
		{
			eval( "document.forms['loanAdvanceFieldForm'].elements['obligationID'].options[i]=" + "new Option('"
				+ obligationItemList[ i ].filterValue + "','" + obligationItemList[ i ].filterCode + "')" );

		}
	}

	if( depositAccItemList.length > 0 )
	{
		for( var i = 0 ; i < depositAccItemList.length ; i++ )
		{
			temp = depositAccItemList[ i ].filterCode;
			currencyData[ i ] = temp.split( "|" );
			eval( "document.forms['loanAdvanceFieldForm'].elements['creditAccNo'].options[i]=" + "new Option('"
				+ depositAccItemList[ i ].filterValue + "','" + currencyData[ i ][ 0 ] + "')" );
		}
		setAccCurrency( "ADVANCE" );
		if(crAcctNo && crAcctNo != ''){
		   var items=$('#creditAccNo option');
		   var key=null;
		 for(var i=0;i<items.length;i++){
		  if(items[i].text==crAcctNo)
		  key=items[i].value;
		 }
		$('#creditAccNo').val(key);
		}
	}
	$('#obligationID').trigger('change');
}

function checkSiEnabled( flag )
{
	if( flag.checked )
	{
		$( '#payDownRecPaymentParamDiv' ).attr( "class", "block  ux_panel-transparent-background  xn-pad-10 ux_label-style" );
		$('#siEnabled').val('Y');
	}
	else
	{
		$( '#payDownRecPaymentParamDiv' ).attr( "class", "hidden" );
		$('#siEnabled').val('N');
	}

}

function checkAdvanceSiEnabled( flag )
{
	if( flag.checked )
	{
		$( '#advanceRecPaymentParamDiv' ).attr( "class", "block ux_panel-transparent-background  xn-pad-10 ux_label-style" );
		$('#siEnabled').val('Y');
	}
	else
	{
		$( '#advanceRecPaymentParamDiv' ).attr( "class", "hidden" );
		$('#siEnabled').val('N');
	}

}
function checkPaymentType()
{
	var form = document.getElementById( 'payDownFieldForm' ), radioRef = form[ 'paymentType' ], n;
	for( n = 0 ; n < radioRef.length ; n++ )
	{
		if( radioRef[ n ].checked )
		{
			if( radioRef[ n ].value == 'F' )
			{
				// following code to uncheck the siEnabled checkbox along with
				// hiding the SI parameter <div>
				document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].checked = false;
				$( '#recPaymentParams' ).attr( "class", "hidden" );
				$( '#payDownRecPaymentParamDiv' ).attr( "class", "hidden" );

				document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].disabled = true;
				document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].value = document.forms[ 'payDownFieldForm' ].elements[ 'principalBalAmnt' ].value;
				document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value = document.forms[ 'payDownFieldForm' ].elements[ 'interestBalAmnt' ].value;
				$( '#principalRepayAmnt' ).addClass( 'w14 amountBox rounded disabled' );
				$( '#interestRepayAmnt' ).addClass( 'w14 amountBox rounded disabled' );
				document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].readonly = true;
				document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].readonly = true;
			}
			else
			{
				if( !isHidden( 'isSiEnabled' ) )
				{
					$( '#recPaymentParams' ).attr( "class", "block  jq-panel-header1 ux_header-padding ux_sifields-header ux_margin-top-12" );
					document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].disabled = false;
				}
				document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].value = '0.00';
				document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value = '0.00';
				document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].readonly = false;
				document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].readonly = false;
				$( '#principalRepayAmnt' ).removeClass( 'disabled' );
				$( '#interestRepayAmnt' ).removeClass( 'disabled' );
			}
		}
	}
}

function setAdvanceRefAttributes( frequencyType )
{

	if( frequencyType == "MONTHLY" )
	{
		$( '#siRefDay > option' ).remove();
		$( '#siPeriod > option' ).remove();

		if( document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDay' ].disabled == true )
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDay' ].disabled = false;
			$( '#siRefDay' ).removeClass( 'disabled' );
		}
		if( document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayAction' ].disabled == true )
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayAction' ].disabled = false;
			$( '#siHolidayAction' ).removeClass( 'disabled' );
		}

		// code to remove the N/A option if it exist for siHolidayAction
		if( siHolidayAction.options.length == 4 )
		{
			$( "#siHolidayAction option[value='3']" ).remove();
		}

		for( var i = 0 ; i < RefMonArray.length ; i++ )
		{
			eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDay' ].options[i]=" + "new Option"
				+ RefMonArray[ i ] );
		}

		intPeriod = MonthlyPeriodArray.length;
		for( var i = 0 ; i < intPeriod ; i++ )
		{
			eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siPeriod' ].options[i]=" + "new Option"
				+ MonthlyPeriodArray[ i ] );
		}
	}
	else if( frequencyType == "WEEKLY" )
	{
		$( '#siRefDay > option' ).remove();
		$( '#siPeriod > option' ).remove();

		if( document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDay' ].disabled == true )
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDay' ].disabled = false;
			$( '#siRefDay' ).removeClass( 'disabled' );
		}
		if( document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayAction' ].disabled == true )
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayAction' ].disabled = false;
			$( '#siHolidayAction' ).removeClass( 'disabled' );
		}

		// code to remove the N/A option if it exist for siHolidayAction
		if( siHolidayAction.options.length == 4 )
		{
			$( "#siHolidayAction option[value='3']" ).remove();
		}

		for( var i = 0 ; i < RefWeekDay.length ; i++ )
		{
			eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDay' ].options[i]=" + "new Option"
				+ RefWeekDay[ i ] );
		}

		for( var i = 0 ; i < PeriodWeekArray.length ; i++ )
		{
			eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siPeriod' ].options[i]=" + "new Option"
				+ PeriodWeekArray[ i ] );
		}

	}
	else if( frequencyType == "DAILY" )
	{
		$( '#siRefDay > option' ).remove();
		$( '#siPeriod > option' ).remove();
		$( '#siRefDay' ).addClass( 'rounded w14 disabled' );
		$( '#siHolidayAction' ).addClass( 'rounded w14 disabled' );

		document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDay' ].disabled = true;
		document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayAction' ].disabled = true;

		intPeriod = DailyPeriodArray.length;
		for( var i = 0 ; i < RefDay.length ; i++ )
		{
			eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDay' ].options[i]=" + "new Option"
				+ RefDay[ i ] );
		}
		eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayAction' ].options[3]=" + "new Option"
			+ HolidayAction[ 0 ] );
		document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayAction' ].options[ 3 ].selected = true;
		for( var i = 0 ; i < intPeriod ; i++ )
		{
			eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siPeriod' ].options[i]=" + "new Option"
				+ DailyPeriodArray[ i ] );
		}
	}
}

function checkAdvanceSiEnabledOnLoad()
{
	if( isHidden( 'isSiEnabled' ) )
	{
		$( '#advanceRecPaymentParams' ).attr( "class", "hidden" );
	}
	else
	{
		$( '#advanceRecPaymentParams' ).attr( "class", "block jq-panel-header1 ux_header-padding ux_sifields-header ux_margin-top-12" );
	}
//	document.forms[ 'loanAdvanceFieldForm' ].elements[ 'loanAdvanceAmnt' ].value = '0.00';
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
		$('#siEnabled').val('Y');
	}
	else
	{
		$( '#payInvoiceParamsDiv' ).attr( "class", "hidden" );
		$('#siEnabled').val('N');
	}

}
function checkInvoiceSiEnabledOnLoad()
{
	if( !isHidden( 'isSiEnabled' ) )
	{
		$( '#payInvoiceParams' ).attr( "class", "hidden" );
	}
	else
	{
		$( '#payInvoiceParams' ).attr( "class", "block jq-panel-header1 ux_header-padding ux_sifields-header ux_margin-top-12" );
	}

}