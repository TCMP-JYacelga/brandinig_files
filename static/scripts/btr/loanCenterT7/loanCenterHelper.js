var isOnChange = false;
var ifFirstTimeClicked = true;
var debitItemList = null;
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
var currencyAccDebitSymbolArray = new Array();
var currencyAccDepositSymbolArray = new Array();
var currencySymbolDebitAcc,currencySymbolDepositAcc,currencySymbolObligation;

var DailyPeriodArray2 = new Array( "('Sunday',1)", "('Monday',2)", "('Tuesday',3)", "('Wednesday',4)", "('Thursday',5)",
		"('Friday',6)", "('Saturday',7)" );
var RefDayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//map variables for view
var mapPeriodWeek = {
		'1' : 'Every Week',
		'2' : 'Every 2nd Week',
		'3' : 'Every 3rd Week',
		'4' : 'Every 4th Week'
	};
var mapMonthlyPeriod = {
	'1' : 'Monthly',
	'2' : 'Every 2nd Month',
	'3' : 'Every 3rd Month',
	'4' : 'Every 4th Month',
	'5' : 'Every 5th Month',
	'6' : 'Every 6th Month',
	'7' : 'Every 7th Month',
	'8' : 'Every 8th Month',
	'9' : 'Every 9th Month',
	'10' : 'Every 10th Month',
	'11' : 'Every 11th Month',
	'12' : 'Every 12th Month'
};
var mapDailyPeriod = {
	'1' : 'Everyday',
	'2' : 'Every 2nd Day',
	'3' : 'Every 3rd Day',
	'4' : 'Every 4th Day',
	'5' : 'Every 5th Day',
	'6' : 'Every 6th Day',
	'7' : 'Every 7th Day'
};
var mapRefWeek = {
	'1' : 'Sunday',
	'2' : 'Monday',
	'3' : 'Tuesday',
	'4' : 'Wednesday',
	'5' : 'Thursday',
	'6' : 'Friday',
	'7' : 'Saturday'
};
var mapRefMonth = {
	'1' : '1',
	'2' : '2',
	'3' : '3',
	'4' : '4',
	'5' : '5',
	'6' : '6',
	'7' : '7',
	'8' : '8',
	'9' : '9',
	'10' : '10',
	'11' : '11',
	'12' : '12',
	'13' : '13',
	'14' : '14',
	'15' : '15',
	'16' : '16',
	'17' : '17',
	'18' : '18',
	'19' : '19',
	'20' : '20',
	'21' : '21',
	'22' : '22',
	'23' : '23',
	'24' : '24',
	'25' : '25',
	'26' : '26',
	'27' : '27',
	'28' : '28',
	'29' : '29',
	'30' : '30',
	'31' : '31'
};
var weekDaysMap = {
		"SUNDAY" : "1",
		"MONDAY" : "2",
		"TUESDAY" : "3",
		"WEDNESDAY" : "4",
		"THURSDAY" : "5",
		"FRIDAY" : "6",
		"SATURDAY" : "7"
	};
var mapRefDay = {
	 '0':'N/A'
};

function setRefAttributes( frequencyType )
{
	var weeklyOfDays = [];
	var weeklyOfSpecificDays = [];
	if (!isEmpty(arrWeeklyOff)) {
		for (var i = 0; i < arrWeeklyOff.length; i++) {
			var temp = arrWeeklyOff[i];
			if(temp != undefined && temp != null)
			{
				temp = temp.split('=')[1];
				if (weekDaysMap[temp])
				{
					weeklyOfDays.push(weekDaysMap[temp]);
					weeklyOfSpecificDays.push(temp);
				}
			}
		}
	}
	if( frequencyType == "MONTHLY" )
	{
		$( '#refDayDivlbl' ).removeClass( 'hidden' );
		$( '#siRefDay > option' ).remove();
		$( '#siPeriod > option' ).remove();
		
		$( '#siPeriod' ).removeClass( 'hidden' );
		$( '#lblDefault1' ).removeClass( 'hidden' );
		$( '#lblDefault1Div' ).removeClass( 'hidden' );
		$( '#payDownPopup #periodDivlbl' ).removeClass( 'hidden' );
		$( '#siPeriodDiv' ).removeClass( 'hidden' );
		var  ctrl  = $( '#siRefDay' );
		ctrl.multiselect("destroy");
		ctrl.attr('multiple', false);
		if( document.forms[ 'payDownFieldForm' ].elements[ 'siRefDay' ].disabled == true )
		{
			document.forms[ 'payDownFieldForm' ].elements[ 'siRefDay' ].disabled = false;
			$( '#siRefDay' ).removeClass( 'disabled' );
		}
		if( document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].disabled == true )
		{
			document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].disabled = false;
			$( '#siHolidayAction' ).removeClass( 'disabled' );
		}

		// code to remove the N/A option if it exist for siHolidayAction
		var temp = document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].length;
		if( temp == 4 )
		{
			$( "#siHolidayAction option[value='3']" ).remove();
		}

		for( var i = 0 ; i < RefMonArray.length ; i++ )
		{
			eval( "document.forms[ 'payDownFieldForm' ].elements[ 'siRefDay' ].options[i]=" + "new Option"
				+ RefMonArray[ i ] );
		}

		intPeriod = MonthlyPeriodArray.length;
		for( var i = 0 ; i < intPeriod ; i++ )
		{
			eval( "document.forms[ 'payDownFieldForm' ].elements[ 'siPeriod' ].options[i]=" + "new Option"
				+ MonthlyPeriodArray[ i ] );
		}
		$("#siRefDay").niceSelect('update');
		$("#siPeriod").niceSelect('update');
		$("#siHolidayAction").niceSelect('update');
	}
	else if( frequencyType == "WEEKLY" )
	{
		$( '#refDayDivlbl' ).removeClass( 'hidden' );
		$( '#siRefDay > option' ).remove();
		$( '#siPeriod > option' ).remove();

		$( '#siPeriod' ).removeClass( 'hidden' );
		$( '#lblDefault1' ).removeClass( 'hidden' );
		$( '#lblDefault1Div' ).removeClass( 'hidden' );
		$( '#payDownPopup #periodDivlbl' ).removeClass( 'hidden' );
		$( '#siPeriodDiv' ).removeClass( 'hidden' );
		var  ctrl  = $( '#siRefDay' );
		ctrl.multiselect("destroy");
		ctrl.attr('multiple', false);
		$("#siRefDay").niceSelect('destroy');
		if( document.forms[ 'payDownFieldForm' ].elements[ 'siRefDay' ].disabled == true )
		{
			document.forms[ 'payDownFieldForm' ].elements[ 'siRefDay' ].disabled = false;
			$( '#siRefDay' ).removeClass( 'disabled' );
		}
		if( document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].disabled == true )
		{
			document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].disabled = false;
			$( '#siHolidayAction' ).removeClass( 'disabled' );
		}

		// code to remove the N/A option if it exist for siHolidayAction
		var temp = document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].length;
		if( temp == 4 )
		{
			$( "#siHolidayAction option[value='3']" ).remove();
		}

		for( var i = 0 ; i < RefWeekDay.length ; i++ )
		{
			var refId = RefWeekDay[i].split(",");
			if (refId != undefined && refId != "")
			{
				refId = refId[1].replace(')','');
				if (jQuery.inArray(refId, weeklyOfDays) != -1)
				{
					continue;
				}
				else
				{
					var ele = document.forms[ 'payDownFieldForm' ].elements[ 'siRefDay' ];
					eval( "document.forms[ 'payDownFieldForm' ].elements[ 'siRefDay' ].options[" + ele.options.length + "]=" + "new Option"
							+ RefWeekDay[ i ] );
				}
			}
		}
		
		$("#siRefDay").find("option").each(function () {
		    if ($(this).val() == iSiRefDay) {
		        $(this).prop("selected", "selected");
		    }
		});
		for( var i = 0 ; i < PeriodWeekArray.length ; i++ )
		{
			eval( "document.forms[ 'payDownFieldForm' ].elements[ 'siPeriod' ].options[i]=" + "new Option"
				+ PeriodWeekArray[ i ] );
		}
		$("#siRefDay").niceSelect();
		$("#siRefDay").niceSelect('update');
		$("#siPeriod").niceSelect('update');
		$("#siHolidayAction").niceSelect('update');
	}
	else if( frequencyType == "DAILY" )
	{
		var siPeriodVal = $('#siPeriod option:selected').val();
		var isPeriodExist = false;
		var keyItem = 0;
		var keyMapDailyPeriod = Object.keys(mapDailyPeriod);
		$( '#siRefDay > option' ).remove();
		$( '#holidayActionDivlbl label').addClass( 'required' );
		$( '#siPeriod' ).removeClass( 'hidden' );
		$( '#lblDefault1' ).removeClass( 'hidden' );
		$( '#lblDefault1Div' ).removeClass( 'hidden' );
		$( '#payDownPopup #periodDivlbl' ).removeClass( 'hidden' );
		$( '#siPeriodDiv' ).removeClass( 'hidden' );
		$( '#refDayDivlbl' ).addClass( 'hidden' );
		var  ctrl  = $( '#siRefDay' );
		ctrl.multiselect("destroy");
		ctrl.attr('multiple', false);
		if( document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].disabled == true )
		{
			document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].disabled = false;
			$( '#siHolidayAction' ).removeClass( 'disabled' );
		}
		
		intPeriod = DailyPeriodArray.length;
		for (x in keyMapDailyPeriod)
		{
			keyItem = keyItem + 1;
			if (siPeriodVal == keyItem)
			{
				isPeriodExist = true;
			}
		}
		
		if (isPeriodExist && siPeriodVal != '1')
		{
			var temp = document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].length;
			if( temp == 4 )
			{
				$( "#siHolidayAction option[value='3']" ).remove();
			}
			document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].options[ 0 ].selected = true;
			
			for( var i = 0 ; i < intPeriod ; i++ )
			{
				eval( "document.forms[ 'payDownFieldForm' ].elements[ 'siPeriod' ].options[i]=" + "new Option"
					+ DailyPeriodArray[ i ] );
			}
			
			$("#siPeriod option").prop('selected', false).filter(function() {
			    return $(this).val() == siPeriodVal;  
			}).prop('selected', true);
			makeNiceSelect('siHolidayAction',true);
		}
		else
		{
			$( '#siPeriod > option' ).remove();
			$( '#siHolidayAction' ).addClass( 'rounded w14 disabled' );
			$( '#holidayActionDivlbl label').removeClass( 'required' );
			document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].disabled = true;
			
//			eval( "document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].options[3]=" + "new Option"
//					+ HolidayAction[ 0 ] );
				document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].options[ 2 ].selected = true;
				for( var i = 0 ; i < intPeriod ; i++ )
				{
					eval( "document.forms[ 'payDownFieldForm' ].elements[ 'siPeriod' ].options[i]=" + "new Option"
						+ DailyPeriodArray[ i ] );
				}
				makeNiceSelect('siHolidayAction',false);
		}
		makeNiceSelect('siPeriod',true);
	}
	else if( frequencyType == "SPECIFICDAY" )
	{
		$( '#refDayDivlbl' ).removeClass( 'hidden' );
		$( '#siRefDay > option' ).remove();
		$( '#siPeriod > option' ).remove();
		$( '#siPeriodDiv' ).addClass( 'hidden' );
		$( '#payDownPopup #periodDivlbl' ).addClass( 'hidden' );
		document.forms[ 'payDownFieldForm' ].elements[ 'siRefDay' ].disabled = false;
		/*if( $('#siHolidayAction').is('[disabled=disabled]') == true )
		{
			$("#siHolidayAction").attr("disabled",false);
			$("#siHolidayAction").removeClass("disabled");
		}
		if($('#siHolidayAction').options && $('#siHolidayAction').options.length == 4 )
		{
			$( "#siHolidayAction option[value='3']" ).remove();
		}*/
		if( document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].disabled == true )
		{
			document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].disabled = false;
			$( '#siHolidayAction' ).removeClass( 'disabled' );
		}
		var temp = document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].length;
		if( temp == 4 )
		{
			$( "#siHolidayAction option[value='3']" ).remove();
		}
		
		$("#siRefDay").niceSelect('destroy');
		$( '#siRefDay' ).addClass( 'form-control jq-multiselect' );
		$( '#siRefDay' ).attr('multiple', true);
		for( var index = 0 ; index < RefDayArray.length ; index++ )
		{
			var refId = RefDayArray[index];
			if (refId != undefined && refId != "")
			{
				if (jQuery.inArray(refId.toUpperCase(), weeklyOfSpecificDays) != -1)
				{
					continue;
				}
				else
				{
					var opt = $('<option />', {
						//value : RefDayArray[index],
						value : (index + 1),//DHGCPNG44-5343
						text : RefDayArray[index]
					});
					if(index==(startDayOfWeek-1))		
						opt.attr('selected','selected');
					opt.appendTo($( '#siRefDay' ));		
				}
			}
		}
		$("#siRefDay").find("option").each(function () {
		    if ($(this).val() == iSiRefDay) {
		        $(this).prop("selected", "selected");
		    }
		});
		$("#siRefDay").multiselect();
		for( var i = 0 ; i < DailyPeriodArray2.length ; i++ )
		{
			eval( "document.forms[ 'payDownFieldForm' ].elements[ 'siPeriod' ].options[i]=" + "new Option" + DailyPeriodArray2[ i ] );
		}
		$("#siPeriod").niceSelect('update');
		$("#siHolidayAction").niceSelect('update');
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

function showPayInvoicePopup(blnIsViewMode) {
	
	if(blnIsViewMode === "true")
	{
		strTitle = "View Pay Invoice";
	}
	else
	{
		strTitle = "Pay Invoice";
	}
	
	$('#payInvoicePopup').dialog({
				// maxHeight: 660,
				minHeight : (screen.width) > 1024 ? 156 : 0,
				width : 840,
				dialogClass : 'ft-dialog',
				resizable : false,
				draggable : false,
				modal : true,
				title : strTitle
			});
	
	if(blnIsViewMode === "true")
	{
		$('.viewModeFields').removeClass('hidden');
	}
	else
	{
		$('.viewModeFields').addClass('hidden');
	}
	$('#payInvoicePopup').dialog("open");
	var dialogHeight = $("#payInvoicePopup").height();
	
	$('#loanPayInvoicePopup .separator').html(' : ');
	$('#loanPayInvoicePopup .separator').css('font-weight', 'normal');
}

function showPaydownPopup(blnIsViewMode,data) {
	
	// flush errormessageDiv
	var errorContainer = $('#messageArea');
	errorContainer.empty();
	errorContainer.addClass('ui-helper-hidden');
	//$('#obligorID').val('');
	/*if (strTitle == 'both')
	{*/
		if(blnIsViewMode === "true")
		{
			strTitle = "View Paydown";
		}
		else
		{
			strTitle = "Paydown";
		}
	//}
/*	else if (strTitle == 'full')
	{
		if(blnIsViewMode === "true")
		{
			strTitle = " View Full PayDown";
		}
		else
		{
			strTitle = "Full PayDown";
		}
	}
	else if (strTitle == 'partial')
	{
		if(blnIsViewMode === "true")
		{
			strTitle = "View Partial PayDown";
		}
		else
		{
			strTitle = "Partial PayDown";
		}
	}
	else
	{
		if(blnIsViewMode === "true")
		{
			strTitle = "View Paydown";
		}
		else
		{
			strTitle = "Paydown";
		}
	}*/
	$('#payDownPopup').dialog({
				// maxHeight: 660,
				minHeight : (screen.width) > 1024 ? 156 : 0,
				width : 840,
				dialogClass : 'ft-dialog',
				resizable : false,
				draggable : false,
				modal : true,
				title : strTitle
			});
	setDataToObligorIdValue("#obligorID");
	$('#totalAmnt,#principalRepayAmnt,#interestRepayAmnt').on('drop', function(event) {
	    event.preventDefault();
	});

	if (blnIsViewMode === "true") {
		// setViewOnlyValuesForPaydown();
		$('#messageArea').addClass('ui-helper-hidden');
		//checkCutOffTime("LNPAYDOWN,", "", "", "", "N");
		$('#tab_1').removeClass('ft-status-bar-li-active')
				.addClass('ft-status-bar-li-done');
		$("#tab_2").addClass('ft-status-bar-li-active');
		/*if (isSiTabSelected === "Y")
			$('.isSiSectionEnabled').removeClass('hidden');
		else
			$('.isSiSectionEnabled').addClass('hidden');*/

		$('.viewOnlySection').removeClass('hidden');
		$('.viewModeFields').removeClass('hidden');
		$('.entryModeFields').addClass('hidden');
		$('.entryOnlySection').addClass('hidden');
//		var blnIsSiEnabled = $('#siEnabled1').is(":checked");
//		setViewOnlyValuesForPaydown(blnIsViewMode === "true" ? true : false);
		
		$('#viewDetailsSection .separator').html(' : ');
		$('#viewDetailsSection .separator').css('font-weight', 'normal');
		$('#viewDetailsSection label').removeClass('required');
		if(isSiTabSelected === "Y")
		{
			$('.viewSIStatusModeFields').removeClass('hidden');
			$('.viewStatusModeFields').addClass('hidden');
			if(data.siRequestStatusDesc != undefined)
				$('#payDownPopup1 .SIStatusViewOnly').text(data.siRequestStatusDesc);
			else
				$('#payDownPopup1 .SIStatusViewOnly').text("");
		}else{
			$('.viewSIStatusModeFields').addClass('hidden');
			$('.viewStatusModeFields').removeClass('hidden');
			if(data.requestStateDesc != undefined)
				$('#payDownPopup1 .StatusViewOnly').text(data.requestStateDesc);
			else
				$('#payDownPopup1 .StatusViewOnly').text("");
		}
		$('#payDownPopup1').css('padding','0px 12px 12px 12px');
	}
	else
	{
		$( '#tab_2' ).removeClass( 'ft-status-bar-li-active' );
		$( '#tab_1' ).removeClass('ft-status-bar-li-done').addClass( 'ft-status-bar-li-active' );
		$('.viewOnlySection').addClass('hidden');
		$('.viewModeFields').addClass('hidden');
		$('.entryOnlySection').removeClass('hidden');
		$('.entryModeFields').removeClass('hidden');
		$( '#lblDefault1Div' ).removeClass( 'hidden' );
		$( '#loanPayDownLowerRightSubmitBtn' ).attr( "class", "hidden entryModeFields" );
		$( '#loanPayDownLowerRightBtn' ).attr( "class", "block entryModeFields" );
		$('#siFrequency').val('');$('#siFrequency').niceSelect('update');
		$('#siPeriod').val('');$('#siPeriod').niceSelect('update');
		$('#siRefDay').val('');$('#siRefDay').niceSelect('update');
		$('#siHolidayAction').val('2');$('#siHolidayAction').niceSelect('update');
	}
	$('#payDownPopup').dialog("open");
	$('#payDownPopup').on('dialogclose', function(event) {
	         $('#nextBtnId').unbind('click');
	 });
	var dialogHeight = $("#payDownPopup").height();
	/*
	 * $( "#payDownPopup" ).dialog( "option", "height", parseInt( dialogHeight ) +
	 * 55 );
	 */
	$('#obligorID').niceSelect('update');	
	//$('#obligorID').trigger('change');
	if (blnIsViewMode === "true") 
	$('#loanPayDownLowerRightCancelBtnClose').focus();
	else
	$('#obligorID-niceSelect').focus();
	
	$('#obligorID-niceSelect, #obligationID-niceSelect, #debitAccNo-niceSelect,#totalAmnt, #siStartDate, #siEndDate ')
    .bind('blur', function () { markRequired(this);});

	$('#obligorID-niceSelect, #obligationID-niceSelect, #debitAccNo-niceSelect, #totalAmnt, #siStartDate, #siEndDate')
    .bind('focus', function () { removeMarkRequired(this);});
    
	$("#totalAmnt, #siStartDate, #siEndDate,#principalRepayAmnt,#interestRepayAmnt,#interestPaidDate").removeClass("requiredField");
	
	if($("input[type='radio'][name='paymentType']:checked").val() == 'P')
	{
		$('#fullDiscText').hide();
		$('#partialDiscText').show();		
	}
	else
	{	
		var form = document.getElementById( 'payDownFieldForm' );
		var radioRef = form[ 'paymentType' ];
		if(!Ext.isEmpty(radioRef))
		{
			if(radioRef.length=2)
			{
				$("#paymentType[value='F']").attr("checked", "checked");
			}
			else
			{
				if( radioRef[ 0 ].value == 'F' )
				{
					$("#paymentType[value='F']").attr("checked", "checked");
				}
				else
				{
					$("#paymentType[value='O']").attr("checked", "checked");
				}
			}
		}
		$('#partialDiscText').hide();
		$('#fullDiscText').show();
	}
	
	$('input[id="obligorID"]').hover(function() {
		$(this).attr('title', $(this).val()); 
		});

    autoFocusOnFirstElement(null, 'payDownPopup', true);
}
function setDataToObligorIdValue(elementId){
	var strUrl;
	if(GranularPermissionFlag == 'Y')
	{
			if(isSiTabSelected == 'Y')
				strUrl = 'services/userseek/loanCenterClientObligorIDSiGranularSeek.json';
			else
	 			strUrl = 'services/userseek/loanCenterClientObligorIDGranularSeek.json';
	}
	else
	 strUrl = 'services/userseek/loanCenterClientObligorIDSeek.json';
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				
				$.ajax({
					url :strUrl,
					type:'POST',
					data : {$autofilter : request.term},
					success : function(data) {
						$('#obligorID').attr('optionSelected',false);
						if(!isEmpty(data)&&!(isEmpty(data.d))){
							var rec = data.d.preferences;
							obligorIdRes = rec;
							response($.map(rec, function(item) {
								return {
									value : item.DESCRIPTION,
									label : item.DESCRIPTION,
									code :item.CODE
									}
							}));	
						}
					}
				});
			},
			focus: function( event, ui ) {
				$(".ui-autocomplete > li").attr("title", ui.item.label);
			},
			select: function( event, ui )
			{
				$('#obligorID').val(ui.item.value);
				setDataToObligationIdValue( "#obligationID", ui.item.code );
				getObligationDebitAccList(ui.item.code,obligationid,debitAccNo,isClone);
				setObligorAccCurrency('PAYDOWN');
				checkPaymentType();
				$('#obligorID').attr('optionSelected',true);				
				if(obligationIDlist.OBLIGATION_LIST.length == 1 )
				{	
					var abc = obligationIDlist.OBLIGATION_LIST[0];
					obligationIdRes[0] ={
						CODE: abc.filterCode,
						DESCRIPTION: abc.filterValue
					}; 
				}
			
				if(obligationIdRes != null && obligationIDlist.OBLIGATION_LIST.length == 1)
				{
					$('#obligationID').attr('optionSelected',true);
					checkObligationId();
				}
			}/*,
			change: function( event, ui )
			{ 
				if( Ext.isEmpty(ui.item) )
				{
					$('#obligationID').val("");
					setDataToObligationIdValue("#obligationID",'');
					getLoanAccBalanceDetails(this.value, "PAYDOWN");
					$.unblockUI();
				}
			}*/
		 });
}
function setDataToObligationIdValue(elementId, obligorIdValue)
{
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
			strUrl = 'services/userseek/loanCenterClientObligationIDSeek.json?$filtercode1=' + obligorIdValue;
			$.ajax({
					url :strUrl,
					type:'POST',
					data : {$autofilter : request.term},
					success : function(data) {
						$('#obligationID').attr('optionSelected',false);
						if(!isEmpty(data)&&!(isEmpty(data.d))){
							var rec = data.d.preferences;
							obligationIdRes = rec;
							response($.map(rec, function(item) {
								return {
									label : item.DESCRIPTION,
									value : item.DESCRIPTION,
									itemCode : item.CODE
									}
							}));	
						}
						if(data.d.preferences.length > 1)
							$('#obligationID').unbind('blur');
					}
				});
			},
			focus: function( event, ui ) {
				$(".ui-autocomplete > li").attr("title", ui.item.label);
			},
			select: function (event, ui) {
				console.log("in select");
					selectedObligationId = ui.item.itemCode;
					$('#obligationID').val(ui.item.itemCode);
					getLoanAccBalanceDetails(selectedObligationId, "PAYDOWN");
					$('#obligationID').attr('optionSelected',true);
				return true;
			},
			change : function() {
				if($('#obligationID').val() == "")
				{
					$('#obligationID').prop('title','');
				}
			}
		 });
}
function setDataToObligorIdAdvance(elementId){
	var strUrl;
	if(GranularPermissionFlag == 'Y')
	{
			if(isSiTabSelected == 'Y')
				strUrl = 'services/userseek/loanCenterClientObligorIDSiGranularSeek.json';
			else
	 			strUrl = 'services/userseek/loanCenterClientObligorIDGranularSeek.json';
	}
	else
	 strUrl = 'services/userseek/loanCenterClientObligorIDSeek.json';
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				
				$.ajax({
					url :strUrl,
					type:'POST',
					data : {$autofilter : request.term},
					success : function(data) {
						$('#obligorID').attr('optionSelected',false);
						if(!isEmpty(data)&&!(isEmpty(data.d))){
							var rec = data.d.preferences;
							obligorIdAdvRes = rec;
							response($.map(rec, function(item) {
								return {
									value : item.DESCRIPTION,
									label : item.DESCRIPTION,
                                    code :item.CODE
									}
							}));	
						}
					}
				});
			},
			focus: function( event, ui ) {
				$(".ui-autocomplete > li").attr("title", ui.item.label);
			},
			select: function( event, ui )
			{
				$('#obligorID').val(ui.item.value);
				setDataToObligationIdAdvance( "#obligationIDAdv", ui.item.code);
				getObligationDepositAccList(ui.item.code,obligationid,debitAccNo,isClone);
				 $('#obligorID').attr('optionSelected',true);
				 if(obligationIDAdvlist.OBLIGATION_LIST.length == 1 )
                {    
                    var abc = obligationIDAdvlist.OBLIGATION_LIST[0];
                    obligationIdAdvRes[0] ={
                        CODE: abc.filterCode,
                        DESCRIPTION: abc.filterValue
                    }; 
                }
            
                if(obligationIdAdvRes != null && obligationIDAdvlist.OBLIGATION_LIST.length == 1)
                {
                    $('#obligationIDAdv').attr('optionSelected',true);
                    checkAdvObligationId();
                }
			},
			change: function( event, ui )
			{ 
				if( Ext.isEmpty(ui.item) )
				{
					$('#obligationID').val("");
					setDataToObligationIdAdvance("#obligationIDAdv",'');
				}
			}
		 });
}
function setDataToObligationIdAdvance(elementId, obligorIdValue)
{
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
			strUrl = 'services/userseek/loanCenterClientObligationIDSeek.json?$filtercode1=' + obligorIdValue;
			$.ajax({
					url :strUrl,
					type:'POST',
					data : {$autofilter : request.term},
					success : function(data) {
						$('#obligationIDAdv').attr('optionSelected',false);
						if(!isEmpty(data)&&!(isEmpty(data.d))){
							var rec = data.d.preferences;
							obligationIdAdvRes = rec;
							response($.map(rec, function(item) {
								return {
									label : item.DESCRIPTION,
									value : item.DESCRIPTION,
									itemCode : item.CODE
									}
							}));	
						}
						if(data.d.preferences.length > 1)
                            $('#obligationID').unbind('blur');
					}
				});
			},
			focus: function( event, ui ) {
				$(".ui-autocomplete > li").attr("title", ui.item.label);
			},
			select: function (event, ui) {
					selectedObligationId = ui.item.itemCode;
					$('#obligationIDAdv').val(ui.item.itemCode);
					getLoanAccBalanceDetails(selectedObligationId, "ADVANCE");
					setAccCurrency("ADVANCE");
					setObligorAccCurrency('ADVANCE');
					//$(elementId).val(ui.item.label);
					$('#obligationIDAdv').attr('optionSelected',true);

				return true;
			},
			change : function() {
				if($('#obligationIDAdv').val() == "")
				{
					$('#obligationIDAdv').prop('title','');
				}
			}
		 });
}

function showAdvancePopup(blnIsViewMode,data)
{
	if (blnIsViewMode === "true")
	{
		var strTitle= "View Advance";
	}
	else
	{
		var strTitle= "Advance";
	}
	$( '#advancedPopup' ).dialog(
	{
		//maxHeight: 660,
		minHeight: (screen.width) > 1024 ? 156 : 0 ,
		width : 840,
		dialogClass: 'ft-dialog',
		resizable: false,
		draggable: false,
		modal : true,
		title : strTitle
	} );
	setDataToObligorIdAdvance("#obligorIDAdv");
	$('#loanAdvanceAmnt').on('drop', function(event) {
	    event.preventDefault();
	});
	if (blnIsViewMode === "true") {
		$('#messageAreaAdvance').addClass('ui-helper-hidden');
		//checkCutOffTime("LNPAYDOWN,", "", "", "", "N");
		$( '#tab_1' ).removeClass( 'ft-status-bar-li-active' ).addClass('ft-status-bar-li-done');
		$("#tab_2").addClass('ft-status-bar-li-active');
		/*if (isSiTabSelected === "Y")
			$('.isSiSectionEnabled').removeClass('hidden');
		else
			$('.isSiSectionEnabled').addClass('hidden');*/
		$('.viewOnlySection').removeClass('hidden');
		$('.viewModeFields').removeClass('hidden');
		$('.entryOnlySection').addClass('hidden');
		$('.entryModeFields').addClass('hidden');
		var blnIsSiEnabled = $('#siEnabledAdv1').is(":checked");
		//setViewOnlyValuesForAdvancePopup(blnIsViewMode === "true"? true	: false);
		$('#viewDetailsSection .separator').html(' : ');
		$('#viewDetailsSection .separator').css('font-weight','normal');
		$('#viewDetailsSection label').removeClass('required');
		$('#loanAdvancePopup1').css('padding','0px 12px 12px 12px');
		if(isSiTabSelected === "Y")
		{
			$('.viewSIStatusModeFields').removeClass('hidden');
			$('.viewStatusModeFields').addClass('hidden');
			if(data.siRequestStatusDesc!=undefined)
				$('#loanAdvancePopup .SIStatusViewOnly').text(data.siRequestStatusDesc);
			else
				$('#loanAdvancePopup .SIStatusViewOnly').text("");
		}
		else
		{
			$('.viewSIStatusModeFields').addClass('hidden');
			$('.viewStatusModeFields').removeClass('hidden');
			if(data.requestStateDesc!=undefined)
				$('#loanAdvancePopup .StatusViewOnly').text(data.requestStateDesc);
			else
				$('#loanAdvancePopup .StatusViewOnly').text("");
		}
	}
	else
	{
		$( '#tab_2' ).removeClass( 'ft-status-bar-li-active' );
		$( '#tab_1' ).removeClass('ft-status-bar-li-done').addClass( 'ft-status-bar-li-active' );
		$('.viewOnlySection').addClass('hidden');
		$('.viewModeFields').addClass('hidden');
		$('.entryOnlySection').removeClass('hidden');
		$('.entryModeFields').removeClass('hidden');
		$( '#lblDefault1Div' ).removeClass( 'hidden' );
		$( '#loanAdvanceLowerRightSubmitBtn' ).attr( "class", "hidden entryModeFields" );
		$( '#loanAdvanceLowerRightBtn' ).attr( "class", "block entryModeFields" );
		$('#siFrequencyAdv').val('');$('#siFrequencyAdv').niceSelect('update');
		$('#siPeriodAdv').val('');$('#siPeriodAdv').niceSelect('update');
		$('#siRefDayAdv').val('');$('#siRefDayAdv').niceSelect('update');
		$('#siHolidayActionAdv').val('2');$('#siHolidayActionAdv').niceSelect('update');
	}
	
	$( "#loanAdvanceAmnt" ).attr( "placeholder", strPlaceHolder );
	$( '#advancedPopup' ).dialog( "open" );
	$('#obligorIDAdv-niceSelect').focus();
	initiateValidation();
	$('input[id="obligorIDAdv"]').hover(function() {
		$(this).attr('title', $(this).val()); 
		});
	var dialogHeight = $( "#advancedPopup" ).height();
	/*$( "#advancedPopup" ).dialog( "option", "height", parseInt( dialogHeight ) + 55 );*/
}
function initiateValidation()
{
    $('#obligorIDAdv-niceSelect')
    .bind('blur', function () { markRequired(this);});
    $('#creditAccNo-niceSelect')
    .bind('blur', function () { markRequired(this);});
    $('#obligationIDAdv-niceSelect')
    .bind('blur', function () { markRequired(this);});

    $('#obligorIDAdv-niceSelect, #obligationIDAdv-niceSelect, #creditAccNo-niceSelect')
    .bind('focus', function () { removeMarkRequired(this);});
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
		draggable : false,
		dialogClass: 'ux-dialog ft-dialog',
		title :'Pay Invoice'
	} );
	$( '#payInvoicePopup' ).dialog( "open" );
	$( '#payInvoiePopup' ).attr( "class", "block" );
	$('.entryOnlySection').addClass('hidden');
	$('.viewOnlySection').removeClass('hidden');
	$('#viewDetailsSection .separator').html(' : ');
	$('#viewDetailsSection label').removeClass('required');
	$('#payInvoice1').css('padding','0px 12px 12px 12px');
	
	$('#siEnabled1').attr('checked',false);
	$("#siStartDate").attr("disabled",true);
	$("#siEndDate").attr("disabled",true);
	$("#siExecType").attr("disabled",true);
	$("#siFrequency").attr("disabled",true);
	$("#siPeriod").attr("disabled",true);
	$("#siRefDay").attr("disabled",true);
	$("#siHolidayAction").attr("disabled",true);
	$("#siNextExecDate").attr("disabled",true);
	$('#payInvoicePopup').dialog("option", "position","center");

}

function showVerifySubmit()
{
	var paymentTypeRadio;	
	var paymentTypePartial;
	var checkExceed ;
	checkExceed = true;
	var principalBalanceAmnt = parseFloat($('#principalBalanceAmnt').val().replace(/[^0-9.-]+/g, ""),10);	
	var interestBalanceAmnt = parseFloat($('#interestBalanceAmnt').val().replace(/[^0-9.-]+/g, ""),10);
	var principalRepayAmnt ;
	if($('#principalRepayAmnt').val() == "" || $('#principalRepayAmnt').val() == null)
	{
		principalRepayAmnt = $('#principalRepayAmnt').val(0);
	}
	else
	{
		principalRepayAmnt = parseFloat($('#principalRepayAmnt').val().replace(/[^0-9.-]+/g, ""),10);
	}
	var interestRepayAmnt;
	if($('#interestRepayAmnt').val() == "" || $('#interestRepayAmnt').val() == null)
	{
		 interestRepayAmnt = $('#interestRepayAmnt').val(0);
	}
	else
	{
		 interestRepayAmnt = parseFloat($('#interestRepayAmnt').val().replace(/[^0-9.-]+/g, ""),10);
	}
	var totalAmnt = parseFloat($('#totalAmnt').val().replace(/[^0-9.-]+/g, ""),10);
	var startDt = new Date($('#siStartDate').val());
	var endDt = new Date($('#siEndDate').val());
	var effectiveDt = new Date($('#effectiveDate').val());
	var isSiEnabled = document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].checked;
	var frequency = $('#siFrequency').val();
	var refDay = $('#siRefDay').val();
	var mandatoryFieldArray = [
		'effectiveDate',
		'obligorID',
		'debitAccCcy',
		'obligationID',
		'siStartDate',
		'siEndDate',
		'totalAmnt'	
	];
	
	var mandatoryFieldLabel = {
		'effectiveDate':"Effective Date",
		'obligorID':"Obligor ID",
		'debitAccCcy':"Debit Account",
		'obligationID':"Obligation ID",
		'siStartDate':"Start Date",
		'siEndDate':"End Date",
		'totalAmnt':"Amount"		
	};
	
	var isFieldError = false;
	var errorMsg = "";
	if($("input[name='paymentType']:checked").val() == 'P')
	{
		paymentTypePartial = true;
	}
	else
	{
		paymentTypePartial = false;
	}
	
	$.each(mandatoryFieldArray, function(field) {
		if(document.forms[ 'payDownFieldForm' ].elements[ mandatoryFieldArray[field] ].value == "")
		{
			var fieldId = document.forms[ 'payDownFieldForm' ].elements[ mandatoryFieldArray[field] ].id;
			var fieldLabelName = fieldId;
			if(fieldId == 'siStartDate' || fieldId == 'siEndDate')
			{
				if($('#siEnabled1').is(":checked"))
				{
					errorMsg = errorMsg +getLabel(fieldLabelName,mandatoryFieldLabel[fieldLabelName])+" is required."+"<br/>"; 
					isFieldError = true;
				}
			}
			else
			{
				errorMsg = errorMsg +getLabel(fieldLabelName,mandatoryFieldLabel[fieldLabelName])+" is required."+"<br/>"; 
				isFieldError = true;
			}		
		}
	});
	if(isFieldError)
	{
		showErrorMessage(errorMsg);
		return false;
	}
	else if( $('#principalRepayAmnt').val() <= 0 && $('#interestRepayAmnt').val() <= 0 )
	{		
		showErrorMessage("Either Principal  or Interest Amount To pay should be greater  than Zero.");
		return false;
	}
	
	if (!isSiEnabled){
	if( totalAmnt <= 0 )
	{		
			//showErrorMessage("Principal/Interest should be greater than zero.");
			//return false;
	}
	}else{
		if( totalAmnt <= 0 )
		{
			//showErrorMessage("Amount should be greater than zero.");
			//return false;
		}
	}
	
	 checkExceed = checkBalanceExceeds();
    if(!checkExceed)
        return false;
	
	if(isSiEnabled ) {
		if (endDt <= startDt) {
			showErrorMessage("End Date cannot be less than or equal to Start Date.");
			return false;
		} else if (frequency === 'SPECIFICDAY' &&  refDay == null ) {
			showErrorMessage("Please provide Reference Day value for frequency type Specific Day.");
			return false;
		}
		if (startDt <= effectiveDt) {
			showErrorMessage("Start Date cannot be less than or equal to Effective Date.");
			return false;
		}
	}
	
	if(exceedBalancesFeature != 'Y' && paymentTypePartial
			&& ( ( !isSiEnabled && principalRepayAmnt <= 0 && interestRepayAmnt <= 0 )
			|| ( !isSiEnabled && principalRepayAmnt > 0 && principalRepayAmnt > principalBalanceAmnt )
			|| ( !isSiEnabled && interestRepayAmnt > 0 && interestRepayAmnt > interestBalanceAmnt ) 
			|| ( isSiEnabled && ( totalAmnt <= 0 || ( totalAmnt > 0 && totalAmnt > ( principalBalanceAmnt + interestBalanceAmnt ) ) ) ) ) )
	{
		var principleEntered = false;
		if( isSiEnabled )
		{
			if( totalAmnt <= 0 )
			{
				//showErrorMessage("Total amount should be greater than zero.");
				//return false;
			}
			else if( allowPayExBal =='N'  && allowPayExIntBal =='N'  && totalAmnt > 0 && totalAmnt > ( principalBalanceAmnt + interestBalanceAmnt ) )
			{
				//showErrorMessage("Total amount should be less than or equal to Principle Balance + Interest Balance.");
				//return false;
			}
		}
	}
	
	if($('#principalRepayAmnt').val() == 0 && $('#interestPaidDate').val() == '')
	{
		showErrorMessage("Interest Paid To Date is mandatory.");
		$('#interestPaidDate').addClass('requiredField');
		return false;
	}
	else if($('#principalRepayAmnt').val() != 0 && $('#interestRepayAmnt').val() != 0 && $('#interestPaidDate').val() == '')
	{
		showErrorMessage("Interest Paid To Date is mandatory.");
		$('#interestPaidDate').addClass('requiredField');
		return false;
	}
	else if($('#principalRepayAmnt').val() != 0 && $('#interestRepayAmnt').val() == 0 && $('#interestPaidDate').val() != '')
	{
		showErrorMessage("Interest Paid To Date is not required for Principal Payment and should be blank.");
		$('#interestPaidDate').addClass('requiredField');
		return false;
	}
	else{
		$( '#messageArea' ).addClass( 'ui-helper-hidden' );
		$('#interestPaidDate').removeClass('requiredField');
	}

	$( '#messageArea' ).addClass( 'ui-helper-hidden' );
	checkCutOffTime("LNPAYDOWN,", "", "", "", "N");
	$( '#tab_1' ).removeClass( 'ft-status-bar-li-active' ).addClass('ft-status-bar-li-done');
	$( "#tab_2" ).addClass( 'ft-status-bar-li-active' );
	$('#nextBtnId').unbind('click');
	$("#nextBtnId").bind("click",function(){
		$(this).unbind('click');
		submitPaydown('saveLoanCenterTxnPaydownDetails.srvc');
	});
	autoFocusOnFirstElement(null, 'loanPayDownLowerRightSubmitBtn', true);
	setTimeout(function() { autoFocusOnFirstElement(null, 'loanPayDownLowerRightSubmitBtn', true); }, 600);
}

function disable()
{
	$('#messageArea').addClass('ui-helper-hidden');
	$('#tab_1').find('a').removeClass('active');
	$("#tab_2").find('a').addClass('active');
	$('#loanPayDownRightSubmitBtn').attr("class", "block");
	$('#loanPayDownRightBtn').attr("class", "hidden");
	$('#loanPayDownLowerRightSubmitBtn').attr("class", "block entryModeFields");
	$('#loanPayDownLowerRightSubmitBtn').addClass('ux-dialog-footer');
	$('#loanPayDownLowerRightBtn').attr("class", "hidden entryModeFields");
	$('.viewOnlySection').removeClass('hidden');
	$('.entryOnlySection').addClass('hidden');
	var blnIsSiEnabled = $('#siEnabled1').is(":checked");
	if (blnIsSiEnabled && blnIsViewMode==="false")
		$('.isSiSectionEnabled').removeClass('hidden');
	else if(blnIsViewMode==="true" && isSiTabSelected==="Y")
		$('.isSiSectionEnabled').removeClass('hidden');
	else if((strIsViewMode==="true"?true:false) && (strSiEnabled==="Y"?true:false))
		$('.isSiSectionEnabled').removeClass('hidden');
	else
		$('.isSiSectionEnabled').addClass('hidden');	
	setViewOnlyValuesForPaydown(blnIsViewMode === "true" ? true : false);
	$('#viewDetailsSection .separator').html(' : ');
	$('#viewDetailsSection .separator').css('font-weight','normal');
	$('#viewDetailsSection label').removeClass('required');
}
function showPayDownDetails()
{
	var paymentTypeRadio;

	$( '#tab_2' ).removeClass( 'ft-status-bar-li-active' );
	$( '#tab_1' ).removeClass('ft-status-bar-li-done').addClass( 'ft-status-bar-li-active' );
	$( '#loanPayDownRightSubmitBtn' ).attr( "class", "hidden" );
	$( '#loanPayDownRightBtn' ).attr( "class", "block" );
	$( '#loanPayDownLowerRightSubmitBtn' ).attr( "class", "hidden entryModeFields" );
	$( '#loanPayDownLowerRightBtn' ).attr( "class", "block entryModeFields" );
		$( '#loanPayDownLowerRightBtn' ).addClass('ux-dialog-footer');
	$('.viewOnlySection').addClass('hidden');
	$('.entryOnlySection').removeClass('hidden');
	$( '#lblDefault1Div' ).removeClass( 'hidden' );
	$('#viewDetailsSection .separator').html(' : ');
	$('#viewDetailsSection .separator').css('font-weight','normal');
	$('#viewDetailsSection label').removeClass('required');
	$("#payDownPopup").dialog('option','position','center');
	autoFocusOnFirstElement(null, 'payDownPopup', true)
}

function showAdvanceVerifySubmit()
{
	var principalBalanceAmnt = parseFloat($('#principalBalanceAmntAdv').val().replace(/[^0-9.]/g, ""));
	var creditBalanceAmnt = parseFloat($('#creditBalanceAmnt').val().replace(/[^0-9.]/g, ""));
	var loanAdvanceAmnt = parseFloat($('#loanAdvanceAmnt').val().replace(/[^0-9.]/g, ""));
	var blnIsSiEnabled = $('#siEnabledAdv1').is(":checked");
	var startDt = new Date($('#siStartDateAdv').val());
	var endDt = new Date($('#siEndDateAdv').val());
	var effectiveDtAdv = new Date($('#requestDate').val());
	var frequency = $('#siFrequencyAdv').val();
	var refDay = $('#siRefDayAdv').val();	

	var mandatoryFieldArray = [
		'requestDate',
		'creditAccCcy',
		'obligorIDAdv',
		'obligationIDAdv',
		'loanAdvanceAmnt',
		'siStartDateAdv',
		'siEndDateAdv'
	];
	
	var mandatoryFieldLabel = {
		'requestDate':"Effective Date",
		'creditAccCcy':"Deposit Account",
		'obligorIDAdv':"Obligor ID",
		'obligationIDAdv':"Obligation ID",
		'loanAdvanceAmnt':"Amount",
		'siStartDateAdv':"Start Date",
		'siEndDateAdv':"End Date"
	};
	
	var isFieldError = false;
	var errorMsg = "";
	
	$.each(mandatoryFieldArray, function(field) {
		if(document.forms[ 'loanAdvanceFieldForm' ].elements[ mandatoryFieldArray[field] ].value == "")
		{
			var fieldId = document.forms[ 'loanAdvanceFieldForm' ].elements[ mandatoryFieldArray[field] ].id;
			var fieldLabelName = fieldId;
			if(fieldId == 'siStartDateAdv' || fieldId == 'siEndDateAdv')
			{
				if($('#siEnabledAdv1').is(":checked"))
				{
					errorMsg = errorMsg +getLabel(fieldLabelName,mandatoryFieldLabel[fieldLabelName])+" is required."+"<br/>"; 
					isFieldError = true;
				}
			}
			else
			{
				errorMsg = errorMsg +getLabel(fieldLabelName,mandatoryFieldLabel[fieldLabelName])+" is required."+"<br/>"; 
				isFieldError = true;
			}	
		}
	});
	if(isFieldError)
	{
		showAdvanceErrorMessage(errorMsg);
		return false;
	}else if( principalBalanceAmnt <= 0 || isNaN(principalBalanceAmnt))
	{		
		showAdvanceErrorMessage("The Principal Balance should not be zero.");
		return false;
	}
	if( creditBalanceAmnt <= 0 || isNaN(creditBalanceAmnt))
	{		
		showAdvanceErrorMessage("Credit Available is not sufficient to process Advance Payment Request.");
		return false;
	}
	if( loanAdvanceAmnt <= 0 ||
		( loanAdvanceAmnt > 0 && loanAdvanceAmnt > creditBalanceAmnt ) )
	{
		if( loanAdvanceAmnt <= 0 )
		{
			showAdvanceErrorMessage("Requested amount should be greater than zero.");
			return false;
		}
		else if( loanAdvanceAmnt > creditBalanceAmnt )
		{
			showAdvanceErrorMessage("Requested amount should be less than or equal to Credit Available Balance.");
			return false;
		}
	} else if(blnIsSiEnabled ) {
		if (endDt <= startDt) {
			showAdvanceErrorMessage("End Date cannot be less than or equal to Start Date.");
			return false;
		} else if (frequency === 'SPECIFICDAY' &&  refDay == null ) {
			showAdvanceErrorMessage("Please provide Reference Day value for frequency type Specific Day.");
			return false;
		}
		if (startDt <= effectiveDtAdv) {
			showAdvanceErrorMessage("Start Date cannot be less than or equal to Effective Date.");
			return false;
		}
	}
	
	$( '#messageAreaAdvance' ).addClass( 'ui-helper-hidden' );
	checkCutOffTime("LNADVANCE,", "", "", "", "N");
	$( '#tab1' ).removeClass( 'ft-status-bar-li-active' ).addClass('ft-status-bar-li-done');
	$( "#tab2" ).addClass( 'ft-status-bar-li-active' );
	autoFocusOnFirstElement(null, 'loanAdvanceLowerRightSubmitBtn', true);
	setTimeout(function() { autoFocusOnFirstElement(null, 'loanAdvanceLowerRightSubmitBtn', true); }, 600);
}

function advanceDisable()
{
	$( '#messageAreaAdvance' ).addClass( 'ui-helper-hidden' );
	$( '#tab1' ).find( 'a' ).removeClass( 'active' );
	$( "#tab2" ).find( 'a' ).addClass( 'active' );

	$( '#loanAdvanceRightSubmitBtn' ).attr( "class", "block" );
	$( '#loanAdvanceRightBtn' ).attr( "class", "hidden" );

	$( '#loanAdvanceLowerRightSubmitBtn' ).attr( "class", "block entryModeFields" );
	$( '#loanAdvanceLowerRightBtn' ).attr( "class", "hidden entryModeFields" );
	
	$('.viewOnlySection').removeClass('hidden');
	$('.entryOnlySection').addClass('hidden');
	var blnIsSiEnabled = $('#siEnabledAdv1').is(":checked");
	if (blnIsSiEnabled && blnIsViewMode==="false")
		$('.isSiSectionEnabled').removeClass('hidden');
	else if(blnIsViewMode==="true" && isSiTabSelected==="Y")
		$('.isSiSectionEnabled').removeClass('hidden');
	else if((strIsViewMode==="true"?true:false) && (strSiEnabled==="Y"?true:false))
		$('.isSiSectionEnabled').removeClass('hidden');
	else
		$('.isSiSectionEnabled').addClass('hidden');	
	setViewOnlyValuesForAdvancePopup(blnIsViewMode==="true"?true:false);
	$('#viewDetailsSection .separator').html(' : ');
	$('#viewDetailsSection .separator').css('font-weight','normal');
	$('#viewDetailsSection label').removeClass('required');
	
	
	}
function showAdvanceDetails()
{
	$( '#loanAdvancePopup' ).attr( "class", "block" );
	$('#tab2').removeClass('ft-status-bar-li-active');
	$('#tab1').addClass('ft-status-bar-li-active').removeClass('ft-status-bar-li-done');

	$( '#loanAdvanceRightSubmitBtn' ).attr( "class", "hidden" );
	$( '#loanAdvanceRightBtn' ).attr( "class", "block" );
	$( '#loanAdvanceLowerRightSubmitBtn' ).attr( "class", "hidden entryModeFields" );
	$( '#loanAdvanceLowerRightBtn' ).attr( "class", "block entryModeFields" );
	$( '#loanAdvanceLowerRightBtn' ).attr( "class", "ux-dialog-footer" );
	$('.viewOnlySection').addClass('hidden');
	$('.entryOnlySection').removeClass('hidden');
	$('#viewDetailsSection .separator').html(' : ');
	$('#viewDetailsSection .separator').css('font-weight','normal');
	$('#viewDetailsSection label').removeClass('required');
	var blnIsSiEnabled = $('#siEnabledAdv1').is(":checked");
	if (blnIsSiEnabled || isSiTabSelected==="Y")
		$('.isSiSectionEnabled').removeClass('hidden');
	else
		$('.isSiSectionEnabled').addClass('hidden');
	$("#advancedPopup").dialog('option','position','center');
	setTimeout(function() { autoFocusOnFirstElement(null, 'advancedPopup', true); }, 50);
}

function getObligationDebitAccList( selectedOption,obligationid,debitAccNo,isClone )
{
	currencyData.length = 0;
	
	if( !Ext.Ajax )
	{
		setTimeout( function()
		{
			getObligationDebitAccList( selectedOption,obligationid,debitAccNo,isClone )
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
			var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
			while (arrMatches = strRegex.exec(strUrl)) {
		    	 objParam[arrMatches[1]] = arrMatches[2];
		   	}
		   	var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
		   	strUrl = strGeneratedUrl;
		    Ext.Ajax.request(
			{
				url : strUrl,
				method : "POST",
				params:objParam,
				async : false,
				success : function( response )
				{
					obligationIDlist = Ext.decode( response.responseText );
					loadObligationDebitAccData( Ext.decode( response.responseText ),obligationid, debitAccNo,isClone );
				},
				failure : function( response )
				{
					console.log( 'Error Occured' );
				}
			} );
		}else{
			var option = $('<option></option>').attr("value", "").text("Select");
			$("#obligationID").empty().append(option);
			$( '#debitAccNo > option' ).remove();
		}
	}
}
function resetObligationId()
{
	  if(isEmpty($('#obligorID').val()))
	  {
		  	$('#obligationID').val("");
	  } 
}
function resetObligationIdAdv()
{
	  if(isEmpty($('#obligorIDAdv').val()))
	  {
		  	$('#obligationIDAdv').val("");
	  } 
}
function loadObligationDebitAccData( obligationList, obligationid, debitAccNo,isClone)
{
	var temp;
	var obligationItemList = obligationList.OBLIGATION_LIST;
	debitItemList = obligationList.OBLIGATION_LIST;
	var debitAccItemList = obligationList.DEBITACC_LIST;

	if( obligationItemList.length > 0 )
	{
		$( '#obligationID > option' ).remove();
		for( var i = 0 ; i < obligationItemList.length ; i++ )
		{
			currencySymbolObligation=obligationItemList[ i ].additionalValue1;
			if(isClone && obligationid != '' && obligationItemList[ i ].filterCode == obligationid)
			{
				$('<option/>').val(obligationItemList[ i ].filterCode).text(obligationItemList[ i ].filterValue).attr('selected',true).appendTo($('#obligationID'));
				//$("#obligationID-niceSelect").val(obligationItemList[ i ].filterValue);
			}
			else
				$('<option/>').val(obligationItemList[ i ].filterCode).text(obligationItemList[ i ].filterValue).appendTo($('#obligationID'));
			
		}		
	}
	$('#obligationID').val();
	if( debitAccItemList.length > 0 )
	{
		$( '#debitAccNo > option' ).remove();
		for( var i = 0 ; i < debitAccItemList.length ; i++ )
		{
			temp = debitAccItemList[ i ].filterCode;
			currencyData[ i ] = temp.split( "|" );
			currencyAccDebitSymbolArray[i] = debitAccItemList[ i ].additionalValue1;
			if(isClone && debitAccNo!= '' && currencyData[ i ][ 0 ] == debitAccNo)
			{
				$('<option/>').val(currencyData[ i ][ 0 ]).text(debitAccItemList[ i ].filterValue).attr('selected',true).appendTo($('#debitAccNo'));
				//$("#debitAccNo-niceSelect").val(debitAccItemList[ i ].filterValue);
			}
			else
				$('<option/>').val(currencyData[ i ][ 0 ]).text(debitAccItemList[ i ].filterValue).appendTo($('#debitAccNo'));
			
		}
		$('#debitAccNo').niceSelect('update');
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
	 $('#debitAccNo-niceSelect,#obligationID-niceSelect').bind('blur', function () { markRequired(this);});
	 $('#debitAccNo-niceSelect,#obligationID-niceSelect').bind('focus', function () { removeMarkRequired(this);});
}

function getLoanAccBalanceDetails( selectedOption, screenType )
{
	var serviceIdList=0;
	var strUrl = 'getLoanAccBalanceDetails.srvc?' + csrfTokenName + "=" + csrfTokenValue + '&$loanAccNmbr='
                 + selectedOption + '&$screenType='    + screenType;
	var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
	while (arrMatches = strRegex.exec(strUrl)) {
    	 objParam[arrMatches[1]] = arrMatches[2];
   	}
	//$.blockUI();
	$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
			css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
   	var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
    strUrl = strGeneratedUrl;
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
				params:objParam,
				success : function( response )
				{
					serviceIdList = ( (Ext.decode( response.responseText )).SERVICEID_LIST);
					/*setTimeout( function(){*/ getPrincipalBalance( serviceIdList, screenType, 0);/* }, 3000 );*/
				},
				failure : function( response )
				{
					console.log( 'Error Occured' );
					$.unblockUI();
				}
			} );
		}
	}
}

function getPrincipalBalance( serviceIdList, screenType, countr )
{
	var principalBalanceAmnt = "";
	var strUrl = 'getPrincipalBalance.srvc?'+ csrfTokenName + "=" + csrfTokenValue + '&$serviceIdList='+ serviceIdList;
	var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
	while (arrMatches = strRegex.exec(strUrl)) {
    	objParam[arrMatches[1]] = arrMatches[2];
   	}
   	var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
   	strUrl = strGeneratedUrl;
   	if(serviceIdList == '')
   		reSetLoanAccBalanceDetails(screenType);
   	Ext.Ajax.request(
	{
		url : strUrl,
		method : "POST",
		params:objParam,
		success : function( response )
		{
			setLoanAccBalanceDetails( Ext.decode( response.responseText ), screenType );
			response = null;
				
			$.unblockUI();
		},
		failure : function( response )
		{
			console.log( 'Error Occured' );
			response = null;
			$.unblockUI();
		}
	} );
   	  
   	if( screenType == 'PAYDOWN' )
   		principalBalanceAmnt = document.getElementById('principalBalanceAmnt').value;
	else
		principalBalanceAmnt = document.getElementById('principalBalanceAmntAdv').value;
	
	if( principalBalanceAmnt == 0 || principalBalanceAmnt == '' )
	{
		if( countr <= 1 )
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
			if(document.forms[ 'payDownFieldForm' ].elements[ 'paymentType' ].value == 'O' || document.forms[ 'payDownFieldForm' ].elements[ 'paymentType' ].value == 'F')
			{
				var principalBal =  parseFloat((balList.PRINCIPAL_BAL).replace(/[^0-9.]/g, ""));
				var interestBal =  parseFloat((balList.INTEREST_BAL).replace(/[^0-9.]/g, ""));
				$('#totalAmnt').autoNumeric('set', principalBal + interestBal) ;
				if($('#principalBalanceAmnt').val() <= 0)
				{
					document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].value = 0.0;
					$('#principalRepayAmnt').autoNumeric('set', 0);
				}
				else
					document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].value = document.forms[ 'payDownFieldForm' ].elements[ 'principalBalAmnt' ].value;
					
				if($('#interestBalanceAmnt').val() <= 0)
				{
					document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value = 0.0;
					$('#interestRepayAmnt').autoNumeric('set', 0);
				}
				else
					document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value = document.forms[ 'payDownFieldForm' ].elements[ 'interestBalAmnt' ].value;
				//End
				isOnChange = true;
				calculateTotalAmnt();
				isOnChange = false;
					
			}
		}
		else
		{
			document.forms[ 'payDownFieldForm' ].elements[ 'principalBalanceAmnt' ].value = 0.0;
			document.forms[ 'payDownFieldForm' ].elements[ 'principalBalAmnt' ].value = 0.0;
			document.forms[ 'payDownFieldForm' ].elements[ 'interestBalanceAmnt' ].value = 0.0;
			document.forms[ 'payDownFieldForm' ].elements[ 'interestBalAmnt' ].value = 0.0;
			
		}
		$('#interestPaidDate').val("");
	}
	else
	{
		if(typeof(balList.PRINCIPAL_BAL) != "undefined")
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalanceAmntAdv' ].value = balList.PRINCIPAL_BAL;
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalAmnt' ].value = balList.PRINCIPAL_BAL;
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalanceAmnt' ].value = balList.CREDIT_BAL;
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalAmnt' ].value =balList.CREDIT_BAL;
		}
		else
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalanceAmntAdv' ].value = 0.0;
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalAmnt' ].value = 0.0;
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalanceAmnt' ].value = 0.0;
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalAmnt' ].value = 0.0;
		}
	}
}

function reSetLoanAccBalanceDetails( screenType )
{
	if( screenType == 'PAYDOWN' )
	{
		document.forms[ 'payDownFieldForm' ].elements[ 'principalBalanceAmnt' ].value = 0.0;
		document.forms[ 'payDownFieldForm' ].elements[ 'principalBalAmnt' ].value = 0.0;
		document.forms[ 'payDownFieldForm' ].elements[ 'interestBalanceAmnt' ].value = 0.0;
		document.forms[ 'payDownFieldForm' ].elements[ 'interestBalAmnt' ].value = 0.0;
	}
	else
	{
		document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalanceAmntAdv' ].value = 0.0;
		document.forms[ 'loanAdvanceFieldForm' ].elements[ 'principalBalAmnt' ].value = 0.0;
		document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalanceAmnt' ].value = 0.0;
		document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditBalAmnt' ].value = 0.0;
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
				if( selectedValue == 'F' || selectedValue == '')
				{
					document.forms[ 'payDownFieldForm' ].elements[ 'debitAccCcy' ].value = '';
				}
				else
				{
					document.forms[ 'payDownFieldForm' ].elements[ 'debitAccCcy' ].value = currencyData[ i ][ 1 ];
					currencySymbolDebitAcc = currencyAccDebitSymbolArray[i];
				}
			}
			else if( accFlag == "ADVANCE" )
			{
				if( selectedValue == 'F' || selectedValue == '')
				{
					document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccCcy' ].value = '';
					$('#loanAdvanceAmntLbl').text(loanAdvanceAmntLbl);
				}
				else
				{
					document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccCcy' ].value = currencyData[ i ][ 1 ];
					$('#loanAdvanceAmntLbl').text("Amount " + "(" + currencyData[ i ][ 1 ]+ ")");
					currencySymbolDepositAcc= currencyAccDepositSymbolArray[i];
				}
			}
			break;
		}
	}
}

function closePopup( dlgId )
{
	$( '#' + dlgId + '' ).dialog( "close" );
}
function submitPaydown( strUrl, strNextDay )
{

	if( displayVerificationFlag == 'false' )
	{
		var paymentTypeRadio;	
		var paymentTypePartial;
		var checkExceed ;
		checkExceed =  true;
		var principalBalanceAmnt = parseFloat($('#principalBalanceAmnt').val().replace(/[^0-9.-]+/g, ""),10);	
		var interestBalanceAmnt = parseFloat($('#interestBalanceAmnt').val().replace(/[^0-9.-]+/g, ""),10);
		var principalRepayAmnt ;
		if($('#principalRepayAmnt').val() == "" || $('#principalRepayAmnt').val() == null)
		{
			principalRepayAmnt = $('#principalRepayAmnt').val(0);
		}
		else
		{
			principalRepayAmnt = parseFloat($('#principalRepayAmnt').val().replace(/[^0-9.-]+/g, ""),10);
		}
		var interestRepayAmnt;
		if($('#interestRepayAmnt').val() == "" || $('#interestRepayAmnt').val() == null)
		{
			 interestRepayAmnt = $('#interestRepayAmnt').val(0);
		}
		else
		{
			 interestRepayAmnt = parseFloat($('#interestRepayAmnt').val().replace(/[^0-9.-]+/g, ""),10);
		}
		var totalAmnt = parseFloat($('#totalAmnt').val().replace(/[^0-9.-]+/g, ""),10);
		var startDt = new Date($('#siStartDate').val());
		var endDt = new Date($('#siEndDate').val());
		var isSiEnabled = document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].checked;
		var frequency = $('#siFrequency').val();
		var refDay = $('#siRefDay').val();
		if($("input[name='paymentType']:checked").val() == 'P')
		{
			paymentTypePartial = true;
		}
		else
		{
			paymentTypePartial = false;
		}
		
		if((document.forms[ 'payDownFieldForm' ].elements[ 'effectiveDate' ].value == "") 
				|| (document.forms[ 'payDownFieldForm' ].elements[ 'debitAccCcy' ].value == "") 
				|| (document.forms[ 'payDownFieldForm' ].elements[ 'obligorID' ].value == "")
				|| (document.forms[ 'payDownFieldForm' ].elements[ 'obligationID' ].value == "") 
				|| (isSiEnabled && document.forms[ 'payDownFieldForm' ].elements[ 'siEndDate' ].value == ""))
		{
			showErrorMessage("Mandatory Fields Required.");
			return false;
		}
		else if( $('#principalRepayAmnt').val() <= 0 && $('#interestRepayAmnt').val() <= 0 )
		{		
			showErrorMessage("Either Principal  or Interest Amount To pay should be greater  than Zero.");
			return false;
		}
				
		checkExceed = checkBalanceExceeds();
        if(!checkExceed)
            return false;
       		
		if (!isSiEnabled){
			if( totalAmnt <= 0 )
			{		
				//showErrorMessage("Principal/Interest should be greater than zero.");
				//return false;
			}
		}else{
			if( totalAmnt <= 0 )
			{
				//showErrorMessage("Amount should be greater than zero.");
				//return false;
			}
		}
		
		if(isSiEnabled ) {
			if (endDt <= startDt) {
				showErrorMessage("End Date cannot be less than or equal to Start Date.");
				return false;
			} else if (frequency === 'SPECIFICDAY' &&  refDay == null ) {
				showErrorMessage("Please provide Reference Day value for frequency type Specific Day.");
				return false;
			}
		}
		
		if(exceedBalancesFeature != 'Y' && paymentTypePartial
				&& ( ( !isSiEnabled && principalRepayAmnt <= 0 && interestRepayAmnt <= 0 )
				|| ( !isSiEnabled && principalRepayAmnt > 0 && principalRepayAmnt > principalBalanceAmnt )
				|| ( !isSiEnabled && interestRepayAmnt > 0 && interestRepayAmnt > interestBalanceAmnt ) 
				|| ( isSiEnabled && ( totalAmnt <= 0 || ( totalAmnt > 0 && totalAmnt > ( principalBalanceAmnt + interestBalanceAmnt ) ) ) ) ) )
		{
			var principleEntered = false;
			if( isSiEnabled )
			{
				if( totalAmnt <= 0 )
				{
					//showErrorMessage("Total amount should be greater than zero.");
					//return false;
				}
				else if( allowPayExBal =='N'  && allowPayExIntBal =='N'  && totalAmnt > 0 && totalAmnt > ( principalBalanceAmnt + interestBalanceAmnt ) )
				{
					//showErrorMessage("Total amount should be less than or equal to Principle Balance + Interest Balance.");
					//return false;
				}
			}					
		}
		
		if($('#principalRepayAmnt').val() == 0 && $('#interestPaidDate').val() == '')
		{
			showErrorMessage("Interest Paid To Date is mandatory.");
			$('#interestPaidDate').addClass('requiredField');
			return false;
		}
		else if($('#principalRepayAmnt').val() != 0 && $('#interestRepayAmnt').val() != 0 && $('#interestPaidDate').val() == '')
		{
			showErrorMessage("Interest Paid To Date is mandatory.");
			$('#interestPaidDate').addClass('requiredField');
			return false;
		}
		else if($('#principalRepayAmnt').val() != 0 && $('#interestRepayAmnt').val() == 0 && $('#interestPaidDate').val() != '')
		{
			showErrorMessage("Interest Paid To Date is not required for Principal Payment and should be blank.");
			$('#interestPaidDate').addClass('requiredField');
			return false;
		}
		else{
			$( '#messageArea' ).addClass( 'ui-helper-hidden' );
			$('#interestPaidDate').removeClass('requiredField');
		}
		
	}
	var frm = document.getElementById( 'payDownFieldForm' );
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'strNextDay', strNextDay));

	var objJson = {};
	var objVal = null, blnAutoNumeric = true;
	var obligorIdVal = document.forms[ 'payDownFieldForm' ].elements[ 'obligorID' ].value;
	
	objJson.obligorID = obligorIdVal.split('|')[0].trim();
	objJson.obligationID = selectedObligationId;
	objJson.debitAccNo = document.forms[ 'payDownFieldForm' ].elements[ 'debitAccNo' ].value;
	objJson.siExecType = document.forms[ 'payDownFieldForm' ].elements[ 'siExecType' ].value;
	objJson.siFrequency = document.forms[ 'payDownFieldForm' ].elements[ 'siFrequency' ].value;
	objJson.siPeriod = document.forms[ 'payDownFieldForm' ].elements[ 'siPeriod' ].value;
	objJson.siRefDay = document.forms[ 'payDownFieldForm' ].elements[ 'siRefDay' ].value;
	objJson.siHolidayAction = document.forms[ 'payDownFieldForm' ].elements[ 'siHolidayAction' ].value;
	objJson.siEnabled = document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].value;
	objJson.requestReference = document.forms[ 'payDownFieldForm' ].elements[ 'requestReference' ].value;
	objJson.debitAccCcy = document.forms[ 'payDownFieldForm' ].elements[ 'debitAccCcy' ].value;
	objJson.paymentType = $("input[name='paymentType']:checked").val();
	objJson.multiSiRefDay = $('#siRefDay').getMultiSelectValueString();
  //Setting Amount fields
	if($("#principalRepayAmnt") != null)
	{
		blnAutoNumeric = isAutoNumericApplied('principalRepayAmnt');
		if (blnAutoNumeric)
			objVal = $("#principalRepayAmnt").autoNumeric('get');
		else
			objVal = $("#principalRepayAmnt").val();
		
		objJson.principalRepayAmnt = objVal;
	}
	if($("#principalBalanceAmnt") != null)
	{
		$("#principalBalanceAmnt").autoNumeric('init');
		blnAutoNumeric = isAutoNumericApplied('principalBalanceAmnt');
		if (blnAutoNumeric)
			objVal = $("#principalBalanceAmnt").autoNumeric('get');
		
		objJson.principalBalAmnt = objVal;
	}
	if($("#interestBalanceAmnt") != null)
	{
		$("#interestBalanceAmnt").autoNumeric('init');
		blnAutoNumeric = isAutoNumericApplied('interestBalanceAmnt');
		if (blnAutoNumeric)
			objVal = $("#interestBalanceAmnt").autoNumeric('get');
		
		objJson.interestBalAmnt = objVal;
	}
	if($("#interestRepayAmnt") != null)
	{
		blnAutoNumeric = isAutoNumericApplied('interestRepayAmnt');
		if (blnAutoNumeric)
			objVal = $("#interestRepayAmnt").autoNumeric('get');
		else
			objVal = $("#interestRepayAmnt").val();
		
		objJson.interestRepayAmnt = objVal;
	}
	if($("#totalAmnt") != null)
	{
		blnAutoNumeric = isAutoNumericApplied('totalAmnt');
		if (blnAutoNumeric)
			objVal = $("#totalAmnt").autoNumeric('get');
		else
			objVal = $("#totalAmnt").val();
		
		objJson.totalAmnt = objVal;
	}
	//Setting Date fields
	objJson.effectiveDatePay =  Ext.util.Format.date(document.forms[ 'payDownFieldForm' ].elements[ 'effectiveDate' ].value, strExtApplicationDateFormat);
	if(document.forms[ 'payDownFieldForm' ].elements[ 'interestPaidDate' ].value != null && document.forms[ 'payDownFieldForm' ].elements[ 'interestPaidDate' ].value != '')
		objJson.interestPaidDate =  Ext.util.Format.date(document.forms[ 'payDownFieldForm' ].elements[ 'interestPaidDate' ].value, strExtApplicationDateFormat);
	if(document.forms[ 'payDownFieldForm' ].elements[ 'siStartDate' ].value != null && document.forms[ 'payDownFieldForm' ].elements[ 'siStartDate' ].value != '')
		objJson.siStartDatePay =  Ext.util.Format.date(document.forms[ 'payDownFieldForm' ].elements[ 'siStartDate' ].value, strExtApplicationDateFormat);
	if(document.forms[ 'payDownFieldForm' ].elements[ 'siEndDate' ].value != null && document.forms[ 'payDownFieldForm' ].elements[ 'siEndDate' ].value != '')
		objJson.siEndDatePay =  Ext.util.Format.date(document.forms[ 'payDownFieldForm' ].elements[ 'siEndDate' ].value, strExtApplicationDateFormat);
  
	$(document).trigger("savePaydownForm", [objJson]);
}

function submitAdvance( strUrl, strNextDay )
{
	
	if( displayVerificationFlag == 'false' )
	{
		var principalBalanceAmnt = parseFloat($('#principalBalanceAmntAdv').val().replace(/[^0-9.]/g, ""));
		var creditBalanceAmnt = parseFloat($('#creditBalanceAmnt').val().replace(/[^0-9.]/g, ""));
		var loanAdvanceAmnt = parseFloat($('#loanAdvanceAmnt').val().replace(/[^0-9.]/g, ""));
		var blnIsSiEnabled = $('#siEnabledAdv1').is(":checked");
		var startDt = new Date($('#siStartDateAdv').val());
		var endDt = new Date($('#siEndDateAdv').val());
		var frequency = $('#siFrequencyAdv').val();
		var refDay = $('#siRefDayAdv').val();	
		if( creditBalanceAmnt <= 0 )
		{		
			showAdvanceErrorMessage("Credit Available is not sufficient to process Advance Payment Request.");
			return false;
		}
		if((document.forms[ 'loanAdvanceFieldForm' ].elements[ 'requestDate' ].value == "") ||
				(document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccCcy' ].value == "") || 
				(document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligorIDAdv' ].value == "") ||
				(document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligationIDAdv' ].value == "") ||
				(document.forms[ 'loanAdvanceFieldForm' ].elements[ 'loanAdvanceAmnt' ].value ==""))
		{
			showAdvanceErrorMessage("Mandatory Fields are Required.");
			return false;		
		}
		else if( loanAdvanceAmnt <= 0 ||
			( loanAdvanceAmnt > 0 && loanAdvanceAmnt > creditBalanceAmnt ) )
		{
			if( loanAdvanceAmnt <= 0 )
			{
				showAdvanceErrorMessage("Requested amount should be greater than zero.");
				return false;
			}
			else if( loanAdvanceAmnt > creditBalanceAmnt )
			{
				showAdvanceErrorMessage("Requested amount should be less than or equal to Credit Available Balance.");
				return false;
			}
		} else if (blnIsSiEnabled ) {
			if (endDt <= startDt) {
				showAdvanceErrorMessage("End Date cannot be less than or equal to Start Date.");
				return false;
			} else if (frequency === 'SPECIFICDAY' &&  refDay == null ) {
				showAdvanceErrorMessage("Please provide Reference Day value for frequency type Specific Day.");
				return false;
			}
		}
	}

	var frm = document.getElementById( 'loanAdvanceFieldForm' );
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'strNextDay', strNextDay));
	
	var objJson = {};
	var objVal = null, blnAutoNumeric = true;
	var obligorIdVal = null;
	obligorIdVal = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'obligorIDAdv' ].value;
	
	objJson.obligorID = obligorIdVal.split('|')[0].trim();
	objJson.obligationID = selectedObligationId;
	objJson.requestReference = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'requestReferenceAdv' ].value;
	objJson.creditAccNo = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccNo' ].value;
	objJson.siEnabled = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siEnabledAdv' ].value;
	objJson.siExecType = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siExecTypeAdv' ].value;
	objJson.siFrequency = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siFrequencyAdv' ].value;
	objJson.siPeriod = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siPeriodAdv' ].value;
	objJson.siRefDay = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDayAdv' ].value;
	objJson.siHolidayAction = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].value;
	objJson.creditAccCcy = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'creditAccCcy' ].value;
	objJson.multiSiRefDay = $('#siRefDayAdv').getMultiSelectValueString();
	//Setting Amount fields
	if($("#loanAdvanceAmnt") != null)
	{
		blnAutoNumeric = isAutoNumericApplied('loanAdvanceAmnt');
		if (blnAutoNumeric)
			objVal = $("#loanAdvanceAmnt").autoNumeric('get');
		else
			objVal = $("#loanAdvanceAmnt").val();
		
		objJson.loanAdvanceAmnt = objVal;
	}
	if($("#principalBalanceAmntAdv") != null)
	{
		$("#principalBalanceAmntAdv").autoNumeric('init');
		blnAutoNumeric = isAutoNumericApplied('principalBalanceAmntAdv');
		if (blnAutoNumeric)
			objVal = $("#principalBalanceAmntAdv").autoNumeric('get');
		
		objJson.principalBalAmnt = objVal;
	}
	if($("#creditBalanceAmnt") != null)
	{
		$("#creditBalanceAmnt").autoNumeric('init');
		blnAutoNumeric = isAutoNumericApplied('creditBalanceAmnt');
		if (blnAutoNumeric)
			objVal = $("#creditBalanceAmnt").autoNumeric('get');
		
		objJson.creditBalAmnt = objVal;
	}
	//Setting Date fields
	objJson.requestDateAdv =  Ext.util.Format.date(document.forms[ 'loanAdvanceFieldForm' ].elements[ 'requestDate' ].value, strExtApplicationDateFormat);
	if(document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siStartDateAdv' ].value != null && document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siStartDateAdv' ].value != '')
		objJson.siStartDateAdv =  Ext.util.Format.date(document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siStartDateAdv' ].value, strExtApplicationDateFormat);
	if(document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siEndDateAdv' ].value != null && document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siEndDateAdv' ].value != '')
		objJson.siEndDateAdv =  Ext.util.Format.date(document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siEndDateAdv' ].value, strExtApplicationDateFormat);
	  
	$(document).trigger("saveAdvancedForm", [objJson]);
	  
}

function getObligationDepositAccList( selectedOption,obligationid,creditAccNo,isClone)
{
	currencyData.length = 0;
	$( '#obligationIDAdv > option' ).remove();
	$( '#creditAccNo > option' ).remove();
	if( !Ext.Ajax )
	{
		setTimeout( function()
		{
			getObligationDepositAccList( selectedOption,obligationid,creditAccNo,isClone )
		}, 1000 );
	}
	else
	{
		if( selectedOption != '' )
		{
			var strUrl = 'getObligationNDepositAccDetails.srvc?' + csrfTokenName + "=" + csrfTokenValue
				+ '&$obligorIDFilter=' + selectedOption;
			var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
			while (arrMatches = strRegex.exec(strUrl)) {
		    	 objParam[arrMatches[1]] = arrMatches[2];
		   	}
		   	var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
		    strUrl = strGeneratedUrl;
			Ext.Ajax.request(
			{
				url : strUrl,
				method : "POST",
				params:objParam,
				async : false,
				success : function( response )
				{
					obligationIDAdvlist = Ext.decode( response.responseText );
					loadObligationDepositeAccData( Ext.decode( response.responseText ),obligationid,creditAccNo,isClone );
				},
				failure : function( response )
				{
					console.log( 'Error Occured' );
				}
			} );
		}else{
			//reset obligation ID if there is no Obligator ID selected
			$('#obligationIDAdv > option' ).remove();
			var option = $('<option></option>').attr("value", "").text("Select");
			$("#obligationIDAdv").empty().append(option);
			$('#obligationIDAdv').niceSelect('update');
			$('#obligationIDAdv-niceSelect').bind('blur', function () { markRequired(this);});
			
			$('#obligationIDAdv-niceSelect').bind('focus', function () { removeMarkRequired(this);});
			$('#creditAccCcy').val("");
		}
	}
}

function loadObligationDepositeAccData( obligationList,obligationid,creditAccNo,isClone )
{
	var temp;
	var obligationItemList = obligationList.OBLIGATION_LIST;
	var depositAccItemList = obligationList.DEPOSITACC_LIST;

	if( obligationItemList.length > 0 )
	{
		$( '#obligationIDAdv > option' ).remove();
		for( var i = 0 ; i < obligationItemList.length ; i++ )
		{
			currencySymbolObligation=obligationItemList[ i ].additionalValue1;
			if(isClone && obligationid != '' && obligationItemList[ i ].filterCode == obligationid)
			{
				$('<option/>').val(obligationItemList[ i ].filterCode).text(obligationItemList[ i ].filterValue).attr('selected',true).appendTo($('#obligationIDAdv'));
			}
			else
			{
				$('<option/>').val(obligationItemList[ i ].filterCode).text(obligationItemList[ i ].filterValue).appendTo($('#obligationIDAdv'));
			}

		}
	}
	$('#obligationIDAdv').niceSelect('update');
	if( depositAccItemList.length > 0 )
	{
		$( '#creditAccNo > option' ).remove();
		for( var i = 0 ; i < depositAccItemList.length ; i++ )
		{
			temp = depositAccItemList[ i ].filterCode;
			currencyData[ i ] = temp.split( "|" );
			currencyAccDepositSymbolArray[i] = depositAccItemList[ i ].additionalValue1;
			if(isClone && creditAccNo != '' && currencyData[ i ][ 0 ] == creditAccNo)
			{
				$('<option/>').val(currencyData[ i ][ 0 ]).text(depositAccItemList[ i ].filterValue).attr('selected',true).appendTo($('#creditAccNo'));
				//$("#creditAccNo-niceSelect").val(depositAccItemList[ i ].filterValue);
			}
			else
			{
				$('<option/>').val(currencyData[ i ][ 0 ]).text(depositAccItemList[ i ].filterValue).appendTo($('#creditAccNo'));
			}
		}
		setAccCurrency( "ADVANCE" );
	}
	$('#creditAccNo').niceSelect('update');
	if(!isClone)
	{
		$('#obligationIDAdv').trigger('change');
	}
	$('#obligationIDAdv-niceSelect, #creditAccNo-niceSelect').bind('blur', function () { markRequired(this);});
	$('#obligationIDAdv-niceSelect, #creditAccNo-niceSelect').bind('focus', function () { removeMarkRequired(this);});
}

function checkSiEnabled( flag )
{
	$( '#principalRepayAmnt' ).val( '' );
	$( '#interestRepayAmnt' ).val( '' );
	$( '#totalAmnt' ).val( '' );
	
	setRefAttributes($('#siFrequency').val());
	if( flag.checked )
	{
		$( '#payDownRecPaymentParamDiv' ).attr( "class", "block  ux_panel-transparent-background  xn-pad-10 ux_label-style" );
		$('#siEnabled1').val('Y');
		
		// total amount to be enabled
		$( '#principalRepayAmnt' ).attr( "disabled", true );
		$( '#interestRepayAmnt' ).attr( "disabled", true );
		$( "#principalRepayAmnt" ).removeAttr( "placeholder");
		$( "#interestRepayAmnt" ).removeAttr( "placeholder");
		$( '#totalAmnt' ).attr( "disabled", false );
		$( '#totalAmnt' ).attr( "readonly", false );
		$( "#totalAmnt" ).attr( "placeholder", strPlaceHolder );
		$( '#siHeaderLine' ).removeClass( 'hidden' );
	}
	else
	{
		$( '#payDownRecPaymentParamDiv' ).attr( "class", "hidden" );
		$('#siEnabled1').val('N');
		$( '#lblDefault1Div' ).removeClass( 'hidden' );
		// total amount to be disabled
		$( '#principalRepayAmnt' ).attr( "disabled", false );
		$( '#interestRepayAmnt' ).attr( "disabled", false );
		$( "#principalRepayAmnt" ).attr( "placeholder", strPlaceHolder );
		$( "#interestRepayAmnt" ).attr( "placeholder", strPlaceHolder );
		$( '#totalAmnt' ).attr( "disabled", true );
		$( '#totalAmnt' ).attr( "readonly", true );
		$( "#totalAmnt" ).removeAttr( "placeholder");
		$( '#siHeaderLine' ).attr( "class", "hidden" );
		calculateTotalAmnt();
	}
}

function checkAdvanceSiEnabled( flag )
{
	if( flag.checked )
	{
		$( '#advanceRecPaymentParamDiv' ).attr( "class", "block ux_panel-transparent-background  xn-pad-10 ux_label-style" );
		$('#siEnabledAdv1').val('Y');
		$( '#siHeaderLine' ).removeClass( 'hidden' );
	}
	else
	{
		$( '#advanceRecPaymentParamDiv' ).attr( "class", "hidden" );
		$('#siEnabledAdv1').val('N');
		$( '#siHeaderLine' ).attr( "class", "hidden" );
	}

}
function checkPaymentType()
{	
	$( '#messageArea' ).addClass( 'ui-helper-hidden' );
	$('#principalRepayAmnt').removeClass('requiredField');
	$('#interestRepayAmnt').removeClass('requiredField');
	var form = document.getElementById( 'payDownFieldForm' ), radioRef = form[ 'paymentType' ], n;
	var interestRepayAmnt = null;
	var check;
	var obligorId = null;
	var obligationId =null;
	var endDateObj = new Date(year, month - 1, day);
	var newStartDate1 = addDays(endDateObj, 1);
	var setDateObj = subtractDays(newStartDate1, 1);
	var dateStr =  (setDateObj.getMonth()+1).toString() +"/"+ setDateObj.getDate().toString()+"/"+ setDateObj.getFullYear().toString();
	var principalBal = document.forms[ 'payDownFieldForm' ].elements[ 'principalBalAmnt' ].value;
	var interestBal = document.forms[ 'payDownFieldForm' ].elements[ 'interestBalAmnt' ].value;
		if(!Ext.isEmpty(radioRef)){
		for( n = 0 ; n < radioRef.length ; n++ )
		{
			if( radioRef[ n ].checked )
			{
				if( radioRef[ n ].value == 'F' )
				{
					// following code to uncheck the siEnabled checkbox along with
					// hiding the SI parameter <div>
					$('#siEnabled1').val("N");
					document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].checked = false;
					$( '#recPaymentParams' ).attr( "class", "hidden" );
					$( '#payDownRecPaymentParamDiv' ).attr( "class", "hidden" );

					obligorId = document.forms[ 'payDownFieldForm' ].elements[ 'obligorID' ].value;
					obligationId = document.forms[ 'payDownFieldForm' ].elements[ 'obligationID' ].value;
						
					document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].disabled = true;
					
					//document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].value = document.forms[ 'payDownFieldForm' ].elements[ 'principalBalAmnt' ].value;
					//document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value = document.forms[ 'payDownFieldForm' ].elements[ 'interestBalAmnt' ].value;
					
					if($('#principalBalanceAmnt').val() <= 0)
					{
						document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].value = 0.0;
						$('#principalRepayAmnt').autoNumeric('set', 0);
					}
					else
						document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].value = principalBal;
					
					if($('#interestBalanceAmnt').val() <= 0)
					{
						document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value = 0.0;
						$('#interestRepayAmnt').autoNumeric('set', 0);
					}
					else
						document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value = interestBal;
					
					if(obligorId == ""|| obligationId == "")
					{
						document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].value = "";
						document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value = "";
					}
					isOnChange = true;
					calculateTotalAmnt();
					isOnChange = false;
					
					if(allowPpIntEditable == 'Y')	
					{
						$( '#principalRepayAmnt' ).attr( "disabled", false );
						$( '#interestRepayAmnt' ).attr( "disabled", false );
					}
					else
					{
						$( '#principalRepayAmnt' ).attr( "disabled", true );
						$( '#interestRepayAmnt' ).attr( "disabled", true );
					}
															
					interestRepayAmnt = document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value;
					$( '#interestPaidDate' ).datepicker("enable");
					$('#interestPaidDate').val("");
										
					$('#payTitle').text = "Full PayDown";
					$( '#siHeaderLine' ).attr( "class", "hidden" );
					$('#partialDiscText').hide();
					$('#fullDiscText').show();
					$( '#totalAmnt' ).attr( "disabled", false );					
				}
				else if (radioRef[ n ].value == 'O')
				{
					// To Empty and disable Principal and interest repay amount
					obligorId = document.forms[ 'payDownFieldForm' ].elements[ 'obligorID' ].value;
					obligationId = document.forms[ 'payDownFieldForm' ].elements[ 'obligationID' ].value;
					
					//Set to empty if principal and interest balances are negative
					if($('#principalBalanceAmnt').val() <= 0)
					{
						document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].value = 0.0;
						$('#principalRepayAmnt').autoNumeric('set', 0);
					}
					else
						document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].value = principalBal;
					
					if($('#interestBalanceAmnt').val() <= 0)
					{
						document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value = 0.0;
						$('#interestRepayAmnt').autoNumeric('set', 0);
					}
					else
						document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value = interestBal;
					//End
					
					if(document.forms[ 'payDownFieldForm' ].elements[ 'obligationID' ].value == "")
						isOnChange = false;
					else
						isOnChange = true;
					
					if(obligorId == ""|| obligationId == "")
					{
						document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].value = "";
						document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value = "";
					}
					calculateTotalAmnt();
					isOnChange = false;
								        
			        //to hide recurring
			        $('#siEnabled1').val("N");
					document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].checked = false;
					$( '#recPaymentParams' ).attr( "class", "hidden" );
					$( '#payDownRecPaymentParamDiv' ).attr( "class", "hidden" );
					
					$( '#totalAmnt' ).attr( "disabled", true );
					
					if(allowPpIntEditable == 'Y')	
					{
						$( '#principalRepayAmnt' ).attr( "disabled", false );
						$( '#interestRepayAmnt' ).attr( "disabled", false );
					}
					else
					{
						$( '#principalRepayAmnt' ).attr( "disabled", true );
						$( '#interestRepayAmnt' ).attr( "disabled", true );
					}
										
					// To hide SI Section for Pay off
					$('#siEnabled1').val("N");
					document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].checked = false;
					document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].disabled = true;
					$( '#siHeaderLine' ).attr( "class", "hidden" );
					//$( '#interestPaidDate' ).datepicker("disable");
					dateStr = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('mm/dd/yy', dateStr));
					$('#interestPaidDate').val("");	
					
					$('#partialDiscText').hide();
					$('#fullDiscText').show();
				}
				else
				{
					$( '#principalRepayAmnt' ).attr( "disabled", false );
					$( '#interestRepayAmnt' ).attr( "disabled", false );
					$( '#totalAmnt' ).attr( "disabled", false );
					$( '#interestPaidDate' ).datepicker("enable");
					$('#interestPaidDate').val("");
					if( !isHidden( 'isSiEnabled' ) )
					{
						$( '#recPaymentParams' ).attr( "class", "block  jq-panel-header1 ux_header-padding ux_sifields-header ux_margin-top-12" );
						document.forms[ 'payDownFieldForm' ].elements[ 'siEnabled' ].disabled = false;
					}
					document.forms[ 'payDownFieldForm' ].elements[ 'principalRepayAmnt' ].value = '';
					document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value = '';
					
					isOnChange = true;
					calculateTotalAmnt();
					if( $('#siEnabled1').val() == 'N' )
					{
						$( '#principalRepayAmnt' ).attr( "disabled", false );
						$( '#interestRepayAmnt' ).attr( "disabled", false );
					}
					else
					{
						$( '#principalRepayAmnt' ).attr( "disabled", true );
						$( '#interestRepayAmnt' ).attr( "disabled", true );
					}
					
					$('#payTitle').text = "Partial PayDown";
					$('#fullDiscText').hide();
					$('#partialDiscText').show();
					
				}
			}
		}
	}
	if( $('#siEnabled1').val() == 'N' )
	{
		$( '#totalAmnt' ).attr( "disabled", true );
	}
	else
	{
		$( '#totalAmnt' ).attr( "disabled", false );
		$('#totalAmnt').prop('readonly',false)
	}
	interestRepayAmnt = document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value;
	if ((interestRepayAmnt.replace(/\,/g,'')) > 0)
	{
		$('#interestPaidDateLbl').addClass("required");		
	}	
	else
	{
		$('#interestPaidDateLbl').removeClass("required");		
	}
		if ( !$( '#principalRepayAmnt' ).prop( "disabled") && !$( '#interestRepayAmnt' ).prop( "disabled") )
		calculateTotalAmnt();
	}

function setAdvanceRefAttributes( frequencyType )
{
	var weeklyOfDays = [];
	var weeklyOfSpecificDays = [];
	if (!isEmpty(arrWeeklyOff)) {
		for (var i = 0; i < arrWeeklyOff.length; i++) {
			var temp = arrWeeklyOff[i];
			if(temp != undefined && temp != null)
			{
				temp = temp.split('=')[1];
				if (weekDaysMap[temp])
				{
					weeklyOfDays.push(weekDaysMap[temp]);
					weeklyOfSpecificDays.push(temp);
				}
			}
		}
	}
	if( frequencyType == "MONTHLY" )
	{
		$( '#siRefDayAdv > option' ).remove();
		$( '#siPeriodAdv > option' ).remove();
		$( '#siPeriodAdv' ).removeClass( 'hidden' );
		$( '#lblDefault1' ).removeClass( 'hidden' );
		$( '#siPeriodDiv' ).removeClass( 'hidden' );
		$( '#refDayAdvDivlbl' ).removeClass( 'hidden' );
		$( '#holidayActionAdvDivlbl label').addClass( 'required' );
		if( document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDayAdv' ].disabled == true )
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDayAdv' ].disabled = false;
			$( '#siRefDayAdv' ).removeClass( 'disabled' );
		}
		if( document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].disabled == true )
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].disabled = false;
			$( '#siHolidayActionAdv' ).removeClass( 'disabled' );
		}

		$( '#loanAdvancePopup #periodDivlbl' ).removeClass( 'hidden' );
		$( '#siRefDayAdv' ).removeClass( 'disabled' );
		var  ctrl  = $( '#siRefDayAdv' );
		ctrl.multiselect("destroy");
		ctrl.attr('multiple', false);
		ctrl.niceSelect();
		// code to remove the N/A option if it exist for siHolidayAction
		//if( siHolidayAction.options.length == 4 )
		/*if($('#siHolidayActionAdv').options && $('#siHolidayActionAdv').options.length == 4 )
		{
			$( "#siHolidayActionAdv option[value='3']" ).remove();
		}*/

		var temp = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].length;
		if( temp == 4 )
		{
			$( "#siHolidayActionAdv option[value='3']" ).remove();
		}
		
		for( var i = 0 ; i < RefMonArray.length ; i++ )
		{
			eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDayAdv' ].options[i]=" + "new Option"
				+ RefMonArray[ i ] );
		}

		intPeriod = MonthlyPeriodArray.length;
		for( var i = 0 ; i < intPeriod ; i++ )
		{
			eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siPeriodAdv' ].options[i]=" + "new Option"
				+ MonthlyPeriodArray[ i ] );
		}
		$("#siRefDayAdv").niceSelect('update');
		$("#siPeriodAdv").niceSelect('update');
		$("#siHolidayActionAdv").niceSelect('update');
	}
	else if( frequencyType == "WEEKLY" )
	{
		$( '#siRefDayAdv > option' ).remove();
		$( '#siPeriodAdv > option' ).remove();
		$( '#siPeriodAdv' ).removeClass( 'hidden' );
		$( '#lblDefault1' ).removeClass( 'hidden' );
		$( '#siPeriodDiv' ).removeClass( 'hidden' );
		$( '#refDayAdvDivlbl' ).removeClass( 'hidden' );
		$( '#holidayActionAdvDivlbl label').addClass( 'required' );
		if( document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDayAdv' ].disabled == true )
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDayAdv' ].disabled = false;
			$( '#siRefDayAdv' ).removeClass( 'disabled' );
		}
		if( document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].disabled == true )
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].disabled = false;
			$( '#siHolidayActionAdv' ).removeClass( 'disabled' );
		}
		$( '#loanAdvancePopup #periodDivlbl' ).removeClass( 'hidden' );
		$( '#siRefDayAdv' ).removeClass( 'disabled' );
		var  ctrl  = $( '#siRefDayAdv' );
		ctrl.multiselect("destroy");
		ctrl.attr('multiple', false);
		ctrl.niceSelect();
		// code to remove the N/A option if it exist for siHolidayActionAdv
		/*if($('#siHolidayActionAdv').options && $('#siHolidayActionAdv').options.length == 4 )
		{
			$( "#siHolidayActionAdv option[value='3']" ).remove();
		}*/
		var temp = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].length;
		if( temp == 4 )
		{
			$( "#siHolidayActionAdv option[value='3']" ).remove();
		}

		for( var i = 0 ; i < RefWeekDay.length ; i++ )
		{
			var refId = RefWeekDay[i].split(",");
			if (refId != undefined && refId != "")
			{
				refId = refId[1].replace(')','');
				if (jQuery.inArray(refId, weeklyOfDays) != -1)
				{
					continue;
				}
				else
				{
					var ele = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDayAdv' ];
					eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDayAdv' ].options[" + ele.options.length + "]=" + "new Option"
							+ RefWeekDay[ i ] );
				}
			}
		}
		
		$("#siRefDayAdv").find("option").each(function () {
		    if ($(this).val() == iSiRefDay) {
		        $(this).prop("selected", "selected");
		    }
		});
		
		for( var i = 0 ; i < PeriodWeekArray.length ; i++ )
		{
			eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siPeriodAdv' ].options[i]=" + "new Option"
				+ PeriodWeekArray[ i ] );
		}
		$("#siRefDayAdv").niceSelect();
		$("#siRefDayAdv").niceSelect('update');
		$("#siPeriodAdv").niceSelect('update');
		$("#siHolidayActionAdv").niceSelect('update');
	}
	else if( frequencyType == "DAILY" )
	{
		var siPeriodAdvVal = $('#siPeriodAdv option:selected').val();
		var isPeriodAdvExist = false;
		var keyItem = 0;
		var keyMapDailyPeriod = Object.keys(mapDailyPeriod);
		$( '#siRefDayAdv > option' ).remove();
		$( '#siPeriodAdv > option' ).remove();
		$( '#siPeriodAdv' ).removeClass( 'hidden' );
		$( '#loanAdvancePopup #periodDivlbl' ).removeClass( 'hidden' );
		$( '#siPeriodDiv' ).removeClass( 'hidden' );
		$( '#refDayAdvDivlbl' ).addClass( 'hidden' );
		$( '#siHolidayActionAdv' ).addClass( 'rounded w14 disabled' );
		$( '#holidayActionAdvDivlbl label').addClass( 'required' );

		var  ctrl  = $( '#siRefDayAdv' );
		ctrl.multiselect("destroy");
		ctrl.attr('multiple', false);
		ctrl.niceSelect();
		
		if( document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].disabled == true )
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].disabled = false;
			$( '#siHolidayActionAdv' ).removeClass( 'disabled' );
		}
		intPeriod = DailyPeriodArray.length;
		
		for (x in keyMapDailyPeriod)
		{
			keyItem = keyItem+1;
			if (siPeriodAdvVal == keyItem)
			{
				isPeriodAdvExist = true;
			}
		}
		
		if (isPeriodAdvExist && siPeriodAdvVal != '1')
		{
			var temp = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].length;
			
			$( '#siHolidayActionAdv' ).removeClass( 'rounded w14 disabled' );
			if( temp == 4 )
			{
				$( "#siHolidayActionAdv option[value='3']" ).remove();
			}
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].options[ 0 ].selected = true;
			for( var i = 0 ; i < intPeriod ; i++ )
			{
				eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siPeriodAdv' ].options[i]=" + "new Option"
					+ DailyPeriodArray[ i ] );
			}
			
			$("#siPeriodAdv option").prop('selected', false).filter(function() {
			    return $(this).val() == siPeriodAdvVal;  
			}).prop('selected', true);
			
		}
		else
		{
			$( '#siPeriodAdv > option' ).remove();
			$( '#siHolidayActionAdv' ).addClass( 'rounded w14 disabled' );
			$( '#holidayActionAdvDivlbl label').removeClass( 'required' );
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].disabled = true;
			
//			eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].options[3]=" + "new Option"
//					+ HolidayAction[ 0 ] );
				document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].options[ 2 ].selected = true;
				for( var i = 0 ; i < intPeriod ; i++ )
				{
					eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siPeriodAdv' ].options[i]=" + "new Option"
						+ DailyPeriodArray[ i ] );
				}
		}	
		$("#siPeriodAdv").niceSelect('update');
		$("#siHolidayActionAdv").niceSelect('update');
	}
	else if( frequencyType == "SPECIFICDAY" )
	{
		$( '#siRefDayAdv > option' ).remove();
		$( '#siPeriodAdv > option' ).remove();
		$( '#siPeriodDiv' ).addClass( 'hidden' );
		$( '#loanAdvancePopup #periodDivlbl' ).addClass( 'hidden' );
		$( '#refDayAdvDivlbl' ).removeClass( 'hidden' );
		$( '#holidayActionAdvDivlbl label').addClass( 'required' );
		document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siRefDayAdv' ].disabled = false;
		if( document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].disabled == true )
		{
			document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].disabled = false;
			$( '#siHolidayActionAdv' ).removeClass( 'disabled' );
		}
		
		var temp = document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siHolidayActionAdv' ].length;
		if( temp == 4 )
		{
			$( "#siHolidayActionAdv option[value='3']" ).remove();
		}
		
		$("#siRefDayAdv").niceSelect('destroy');
		$( '#siRefDayAdv' ).addClass( 'form-control jq-multiselect' );
		$( '#siRefDayAdv' ).attr('multiple', true);
		
		for( var index = 0 ; index < RefDayArray.length ; index++ )
		{
			var refId = RefDayArray[index];
			if (refId != undefined && refId != "")
			{
				if (jQuery.inArray(refId.toUpperCase(), weeklyOfSpecificDays) != -1)
				{
					continue;
				}
				else
				{
					var opt = $('<option />', {
						//value : RefDayArray[index],
						value : (index + 1),//DHGCPNG44-5343
						text : RefDayArray[index]
					});
					if(index==(startDayOfWeek-1))		
						opt.attr('selected','selected');
					opt.appendTo($( '#siRefDayAdv' ));		
				}
			}
		}
		$("#siRefDayAdv").find("option").each(function () {
		    if ($(this).val() == iSiRefDay) {
		        $(this).prop("selected", "selected");
		    }
		});
		
		$("#siRefDayAdv").multiselect();

		for( var i = 0 ; i < DailyPeriodArray2.length ; i++ )
		{
			eval( "document.forms[ 'loanAdvanceFieldForm' ].elements[ 'siPeriodAdv' ].options[i]=" + "new Option" + DailyPeriodArray2[ i ] );
		}
		$("#siPeriodAdv").niceSelect('update');
		$("#siHolidayActionAdv").niceSelect('update');
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
}

function checkPaydownSiEnabledOnLoad()
{
	if( isHidden( 'isSiEnabled' ) )
	{
		$( '#recPaymentParams' ).attr( "class", "hidden" );
	}
	else
	{
		$( '#recPaymentParams' ).attr( "class", "block jq-panel-header1 ux_header-padding ux_sifields-header ux_margin-top-12" );
	}
}

function showRealtimeResponsePopup()
{
	$( '#realtimeResPopup' ).dialog(
	{
		autoOpen : false,
		height : 450,
		width : '65%',
		modal : true,
		resizable : true,
		title : "Request in Process"
	} );
	openResponseGrid();
	$( '#realtimeResPopup' ).dialog( "open" );
	$('#realtimeResPopup').dialog("option", "position", { my : "center", at : "center", of : window });
	
}

function hideUnhideBtns()
{
	$("#btnContInBackDiv").hide();
	$("#cancelDiv").show();
}

function checkBalanceExceeds()
{
	var principalRepayAmnt = parseFloat($('#principalRepayAmnt').val().replace(/[^0-9.-]+/g, ""));
	var interestRepayAmnt = parseFloat($('#interestRepayAmnt').val().replace(/[^0-9.-]+/g, ""));
	var principalBalance=parseFloat($('#principalBalanceAmnt').val().replace(/[^0-9.-]+/g, ""));
	if(isNaN(principalBalance))
	{
		principalBalance = 0;
	}
	var interestBalance=parseFloat($('#interestBalanceAmnt').val().replace(/[^0-9.-]+/g, ""));
	if(isNaN(interestBalance))
	{
		interestBalance = 0;
	}
	var payType= $("input[type='radio'][name='paymentType']:checked").val();
	var errorMsg = "";
	
	if((allowPayExBal =='N' && principalRepayAmnt > principalBalance ) )
	{
		errorMsg = errorMsg + "The Principal Payment Amount cannot exceed Principal Balance."+"<br/>";
		$('#principalRepayAmnt').addClass('requiredField');
	}
	else
	{
		$( '#messageArea' ).addClass( 'ui-helper-hidden' );
		$('#principalRepayAmnt').removeClass('requiredField');
	}
	
	if((allowPayExIntBal=='N' && interestRepayAmnt > interestBalance))
	{
		errorMsg = errorMsg + "The Interest Payment Amount cannot exceed Interest Balance."+"<br/>";	
		$('#interestRepayAmnt').addClass('requiredField');
	}
	else
	{
		$( '#messageArea' ).addClass( 'ui-helper-hidden' );
		$('#interestRepayAmnt').removeClass('requiredField');
	}
	if(errorMsg != "")
	{	
		showErrorMessage(errorMsg);
		return false;
	}
	return true;
}

function calculateTotalAmnt()
{
	var principalRepayAmnt;
	var interestRepayAmnt;
	/*if(allowPpIntEditable =='Y')
	{
		checkBalanceExceeds();
	}*/
	if(isOnChange)
	{
		 principalRepayAmnt = parseFloat($('#principalRepayAmnt').val().replace(/[^0-9.-]+/g, ""));
		if(isNaN(principalRepayAmnt))
		{
			principalRepayAmnt = 0;
		}
		$('#totalAmnt').autoNumeric('set', principalRepayAmnt);
		interestRepayAmnt = parseFloat($('#interestRepayAmnt').val().replace(/[^0-9.-]+/g, ""));
		if(isNaN(interestRepayAmnt))
		{
			interestRepayAmnt = 0;
		}
	
		/*if($("input[type='radio'][name='paymentType']:checked").val() == 'O')
		{
				if(allowPayExBal =='N')
					principalRepayAmnt = parseFloat($('#principalBalanceAmnt').val().replace(/[^0-9.]/g, ""));
				if(allowPayExIntBal == 'N')
					interestRepayAmnt = parseFloat($('#interestBalanceAmnt').val().replace(/[^0-9.]/g, ""));
		}*/
			
		$('#totalAmnt').autoNumeric('set', principalRepayAmnt + interestRepayAmnt );
	}
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
	if( !isHidden( 'isSiEnabled' ) )
	{
		$( '#payInvoiceParams' ).attr( "class", "hidden" );
	}
	else
	{
		$( '#payInvoiceParams' ).attr( "class", "block jq-panel-header1 ux_header-padding ux_sifields-header ux_margin-top-12" );
	}
}

function showTxnSummaryReport(paymentType,recordKeyNo)
{
	var reportType = 'loanTxnSummaryDetailReport';	
	var strUrl = 'services/getLoanCenterList/getDynamicReport.pdf';
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
				'$reportType', reportType));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
				'$identifier', recordKeyNo));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
				'$isSiTabSelected', isSiTabSelected));		
	form.appendChild(createFormField('INPUT', 'HIDDEN',
				'$paymentType', paymentType));					
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

function createFormField(element, type, name, value)
{
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}
/**
 * Approval Confirmation Section Starts Here
 */
var approvalConfGrid = null;
var objArgs = null;
function showApprovalConfirmationPopup(arrSelectedRecords, arrColumnModel,
		storeFields, objDataArgs) {
	$("#approvalConfirmationPopupDiv").dialog({
		bgiframe : true,
		resizable : false,
		draggable : false,
		modal : true,
		width :  "735px",
		title : isSiTabSelected === 'Y' ? getLabel('lblApprovalConfirmationSiPopup',
				'Recurring Payment Approval') : getLabel('lblApprovalConfirmationPopup',
				'Transaction Summary Approval'),
		open : function(event, ui) {
			objArgs = objDataArgs;
			approvalConfGrid = null;
			$('#approvalConfirmationGrid').empty();
			approvalConfGrid = createApprovalConfirmationGrid(
					arrSelectedRecords, arrColumnModel, storeFields);
			
			$("#approvalConfirmationPopupDiv").dialog("option", "position", { my : "center", at : "center", of : window });
			autoFocusOnFirstElement(null, 'approvalConfirmationPopupDiv', true);
		}
	});

}
function closeApprovalConfirmationPopup() {
	approvalConfGrid = null;
	$('#approvalConfirmationPopupDiv').dialog('close');
	$('#messageContentDiv').appendTo($('#messageContentHeaderDiv'));
}

function approveSelectedRecords() {
	$(document).trigger("approvalConfirmed", [objArgs]);
	closeApprovalConfirmationPopup();
}
function createSelectRecordsGridStore(arrSelectedRecords, storeFields) {
	var i = 0;
	var gridJson = {};
	var gridObjectJson = {};
	var arrRecords = [];
	for (i = 0; i < arrSelectedRecords.length; i++) {
		arrRecords.push(arrSelectedRecords[i].data);
	}
	if (arrRecords && arrRecords.length > 0) {
		gridJson['selectedRecords'] = arrRecords;
		gridJson['totalRows'] = arrRecords.length;
		gridJson['SUCCESS'] = true;
	}
	gridObjectJson['d'] = gridJson;

	var myStore = Ext.create('Ext.data.Store', {
				storeId : 'selectedRecordsStore',
				fields : storeFields,
				proxy : {
					type : 'pagingmemory',
					data : gridObjectJson,
					reader : {
						type : 'json',
						root : 'd.selectedRecords',
						totalProperty : 'totalRows',
						successProperty : 'SUCCESS'

					}
				}
			});
	myStore.load();
	return myStore;
}

function getColumns(arrColumnModel) {
	var arrColsPref = arrColumnModel;
	var arrCols = [], objCol = null, cfgCol = null, objWidthMap ={};
	if (isSiTabSelected === 'Y') {
		objWidthMap = {
			"requestReference" : 160,
			"obligorID" : 100,
			"obligationID" : 120,
			"accountName" : 120,
			"requestedAmnt" : 100,
			"effectiveDate" : 100,
			"paymentTypeDesc" : 90,
			"siRequestStatusDesc" : 120
		};
	} else {
		objWidthMap = {
			"requestReference" : 160,
			"obligorID" : 100,
			"obligationID" : 120,
			"accountName" : 120,
			"requestedAmnt" : 100,
			"trackingNo" : 120,
			"requestDate" : 100,
			"paymentTypeDesc" : 90,
			"requestStatusDesc" : 120,
			"hostResponseMsg" : 120
		};
	}
	if (!Ext.isEmpty(arrColsPref)) {
		for (var i = 0; i < arrColsPref.length; i++) {
			objCol = arrColsPref[i];
			cfgCol = {};
			cfgCol.dataIndex = objCol.colId;
			cfgCol.text = objCol.colHeader;
			cfgCol.width = cfgCol.width = !isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;
			cfgCol.colType = objCol.colType;
			cfgCol.resizable = objCol.resizable;
			cfgCol.hideable = objCol.hideable;
			cfgCol.draggable = objCol.draggable;
			cfgCol.sortable = objCol.sortable;
			cfgCol.flex = objCol.flex;
			cfgCol.menuDisabled = true;
			if (!Ext.isEmpty(objCol.colType) && cfgCol.colType === "amount") {
				cfgCol.align = 'right';
			}
			cfgCol.renderer = columnRenderer; 
			arrCols.push(cfgCol);
		}
	}
	return arrCols;
}
function columnRenderer(value, metaData, record, rowIndex, colIndex, store)
{ 
	metaData.tdAttr = 'title="' + value + '"';
	return value;
}
function createApprovalConfirmationGrid(arrSelectedRecords, arrColumnModel,
		storeFields) {
	var store = createSelectRecordsGridStore(arrSelectedRecords, storeFields);
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				width : 1100,
				overflowY : false,
				enableColumnHeaderMenu :false,				
				columns : getColumns(arrColumnModel),
				renderTo : 'approvalConfirmationGrid'
			});

	return grid;
}
function setViewOnlyValuesForPaydown(blnIsViewMode) {
	var paymentType =  null;
	if($("input[name='paymentType']:checked").val() === 'F')
		paymentType = getLabel('lblLoanFullAmount', 'Full');
	else if($("input[name='paymentType']:checked").val() === 'P')
		paymentType = getLabel('lblPartialAmount', 'Partial');
	else
		paymentType = getLabel('lblPayoff', 'Payoff');
	if (!blnIsViewMode) {
		$('#payDownPopup1 .obligorIDViewOnly').text($('#obligorID').val());
		setToolTip('#payDownPopup1 .obligorIDViewOnly');
		$('#payDownPopup1 .obligationIDViewOnly').text($('#obligationID').val());
		setToolTip('#payDownPopup1 .obligationIDViewOnly');
		$('#payDownPopup1 .requestReferenceViewOnly').text($('#requestReference').val());
		setToolTip('#payDownPopup1 .requestReferenceViewOnly');
		$('#payDownPopup1 .principalBalAmntViewOnly').text(currencySymbolObligation+" "+$('#principalBalanceAmnt').val());
		setToolTip('#payDownPopup1 .principalBalAmntViewOnly');
		$('#payDownPopup1 .interestBalAmntViewOnly').text(currencySymbolObligation+" "+$('#interestBalanceAmnt').val());
		setToolTip('#payDownPopup1 .interestBalAmntViewOnly');
		$('#payDownPopup1 .sellerDescriptionViewOnly').text(sellerDesc);
		if(!isEmpty(sellerDesc) && sellerDesc.length>13)
			$('#payDownPopup1 .sellerDescriptionViewOnly').addClass('popup-text-ellipsis').attr('title',sellerDesc);
		var selectedDebitAcc = $('#debitAccNo').find("option:selected").text();
		$('#payDownPopup1 .debitAccNoViewOnly').text(selectedDebitAcc);
		setToolTip('#payDownPopup1 .debitAccNoViewOnly');
		$('#payDownPopup1 .debitAccCcyViewOnly').text($('#debitAccCcy').val());
		setToolTip('#payDownPopup1 .debitAccCcyViewOnly');
		$('#payDownPopup1 .paymentTypeViewOnly').text(paymentType);
		setToolTip('#payDownPopup1 .paymentTypeViewOnly');
		$('#payDownPopup1 .effectiveDateViewOnly').text($('#effectiveDate').val());
		setToolTip('#payDownPopup1 .effectiveDateViewOnly');
		$('#payDownPopup1 .interestPaidDateViewOnly').text($('#interestPaidDate').val());
		setToolTip('#payDownPopup1 .interestPaidDateViewOnly');
		$('#payDownPopup1 .principalRepayAmntViewOnly').text(currencySymbolDebitAcc+" "+$('#principalRepayAmnt').val());
		setToolTip('#payDownPopup1 .principalRepayAmntViewOnly');
		$('#payDownPopup1 .interestRepayAmntViewOnly').text(currencySymbolDebitAcc+" "+$('#interestRepayAmnt').val());
		setToolTip('#payDownPopup1 .interestRepayAmntViewOnly');
		$('#payDownPopup1 .totalAmntViewOnly').text(currencySymbolDebitAcc+" "+$('#totalAmnt').val());
		setToolTip('#payDownPopup1 .totalAmntViewOnly');
		// View only
		if($('#Status').val() !=undefined)
			$('#payDownPopup1 .StatusViewOnly').text($('#Status').val());
		else
			$('#payDownPopup1 .StatusViewOnly').text("");
		setToolTip('#payDownPopup1 .StatusViewOnly');
		$('#payDownPopup1 .trackingNoViewOnly').text($('#trackingNo').val());
		setToolTip('#payDownPopup1 .trackingNoViewOnly');
		$('#payDownPopup1 .siStartDateViewOnly').text($('#siStartDate').val());
		setToolTip('#payDownPopup1 .siStartDateViewOnly');
		$('#payDownPopup1 .siEndDateViewOnly').text($('#siEndDate').val());
		setToolTip('#payDownPopup1 .siEndDateViewOnly');
		if($("#siEnabled1").is(':checked'))
		{
			$('#payDownPopup1 #lblDefault1Div').addClass('hidden');
			$('#payDownPopup1 #principalRepayAmntViewOnlyDiv').addClass('hidden');
		}else{
			$('#payDownPopup1 #lblDefault1Div').removeClass('hidden');
			$('#payDownPopup1 #principalRepayAmntViewOnlyDiv').removeClass('hidden');
		}
	}
	if(multiSiRefDay != null && multiSiRefDay != "")
	{
		if(isviewmode && siFrequency != '' &&  siFrequency === 'SPECIFICDAY')
		{
			$('#payDownPopup1 #periodDivlbl').addClass('hidden');
			$('#payDownPopup1 #refDayViewOnlyDiv').removeClass('hidden');
			var str = '';
			for (var a in multiSiRefDay)
			{
				str = str + RefDayArray[multiSiRefDay[a]-1]+",";
			}
			$('#payDownPopup1 .siRefDayViewOnly').text(str.substring(0, (str.length)-1));
			setToolTip('#payDownPopup1 .siRefDayViewOnly');
		}
	}
	else {
			var refDay = $('#siRefDay option:selected').text();
			if (refDay.length > 9) {
				var refDay = refDay.replace(/y/g, 'y,');
				refDay = refDay.substring(0, (refDay.length)-1);
			}
			$('#payDownPopup1 .siRefDayViewOnly').text(refDay);
			setToolTip('#payDownPopup1 .siRefDayViewOnly');
			$('#payDownPopup1 .siExecTypeViewOnly')
					.text($('#siExecType option:selected').text());
			setToolTip('#payDownPopup1 .siExecTypeViewOnly');
			$('#payDownPopup1 .siFrequencyViewOnly')
					.text($('#siFrequency option:selected').text());
			setToolTip('#payDownPopup1 .siFrequencyViewOnly');
	}
	var freqViewOnly = $('#siFrequency option:selected').text();
	if (freqViewOnly == 'Daily') {
		$('#payDownPopup1 #refDayViewOnlyDiv').addClass('hidden');
		$('#payDownPopup1 #periodDivlbl').removeClass('hidden');
		$('#payDownPopup1 .siPeriodViewOnly').text($('#siPeriod option:selected').text());
		setToolTip('#payDownPopup1 .siPeriodViewOnly');
	}
	else if(freqViewOnly == 'Specific Day') {
		$('#payDownPopup1 #periodDivViewlbl').addClass('hidden');
		$('#payDownPopup1 #refDayViewOnlyDiv').removeClass('hidden');
	}else{
		$('#payDownPopup1 #periodDivlbl').removeClass('hidden');
		$('#payDownPopup1 #refDayViewOnlyDiv').removeClass('hidden');
		$('#payDownPopup1 .siPeriodViewOnly').text($('#siPeriod option:selected').text());
		setToolTip('#payDownPopup1 .siPeriodViewOnly');
	}
	
	$('#payDownPopup1 .siHolidayActionViewOnly')
			.text($('#siHolidayAction option:selected').text());
	setToolTip('#payDownPopup1 .siHolidayActionViewOnly');
	$('#payDownPopup1 .siNextExecDateViewOnly').text($('#siNextExecDate')
			.val());
	setToolTip('#payDownPopup1 .siNextExecDateViewOnly');
	var holidayActionView = $('#siHolidayAction').val();
	if (holidayActionView) {
		if (holidayActionView == 0) {
			$('.siHolidayActionViewOnly').attr('title',getLabel('nextBusinessDay','Next Business Day'));
		}else if (holidayActionView == 1) {
			$('.siHolidayActionViewOnly').attr('title',getLabel('previousBusinessDay','Previous Business Day'));
		}else {
			$('.siHolidayActionViewOnly').attr('title',getLabel('skipBusinessDay','Skip'));
		}
	}
	if(isSiEnabled == 'Y')
	{
		$('#payDownPopup1 #lblDefault1Div').addClass('hidden');
		$('#payDownPopup1 #principalRepayAmntViewOnlyDiv').addClass('hidden');
	}
	
}
function setViewOnlyValuesForAdvancePopup(blnIsViewMode){
	if (!blnIsViewMode) {
		$('#loanAdvancePopup .obligorIDViewOnly').text($('#obligorIDAdv').val());
		setToolTip('#loanAdvancePopup .obligorIDViewOnly');
		$('#loanAdvancePopup .obligationIDViewOnly').text($('#obligationIDAdv').val());
		setToolTip('#loanAdvancePopup .obligationIDViewOnly');
		$('#loanAdvancePopup .requestReferenceViewOnly').text($('#requestReferenceAdv').val());
		setToolTip('#loanAdvancePopup .requestReferenceViewOnly');
		$('#loanAdvancePopup .principalBalAmntViewOnly').text(currencySymbolObligation+" "+$('#principalBalanceAmntAdv').val());
		setToolTip('#loanAdvancePopup .principalBalAmntViewOnly');
		$('#loanAdvancePopup .creditBalAmntViewOnly').text(currencySymbolObligation+" "+$('#creditBalanceAmnt').val());
		setToolTip('#loanAdvancePopup .creditBalAmntViewOnly');
		var selectedDebitAcc = $('#creditAccNo').find("option:selected").text();
		$('#loanAdvancePopup .creditAccNoViewOnly').text(selectedDebitAcc);
		setToolTip('#loanAdvancePopup .creditAccNoViewOnly');
		$('#loanAdvancePopup .sellerIdViewOnly').text(sellerDesc);
		if(!isEmpty(sellerDesc) && sellerDesc.length>13)
			$('#loanAdvancePopup .sellerIdViewOnly').addClass('popup-text-ellipsis').attr('title',sellerDesc);
		$('#loanAdvancePopup .creditAccCcyViewOnly').text($('#creditAccCcy').val());
		setToolTip('#loanAdvancePopup .creditAccCcyViewOnly');
		$('#loanAdvancePopup .loanAdvanceAmntViewOnly').text(currencySymbolDepositAcc+" "+$('#loanAdvanceAmnt').val());
		setToolTip('#loanAdvancePopup .loanAdvanceAmntViewOnly');
		$('#loanAdvancePopup .requestDateViewOnly').text($('#requestDate').val());
		setToolTip('#loanAdvancePopup .requestDateViewOnly');
		$('#loanAdvancePopup .trackingNoViewOnly').text($('#trackingNo').val());
		setToolTip('#loanAdvancePopup .trackingNoViewOnly');
		$('#loanAdvancePopup .siStartDateViewOnly').text($('#siStartDateAdv').val());
		setToolTip('#loanAdvancePopup .siStartDateViewOnly');
		$('#loanAdvancePopup .siEndDateViewOnly').text($('#siEndDateAdv').val());
		setToolTip('#loanAdvancePopup .siEndDateViewOnly');
		if($('#Status').val()!=undefined)
			$('#loanAdvancePopup .StatusViewOnly').text($('#Status').val());
		else
			$('#loanAdvancePopup .StatusViewOnly').text("");
	}
	$('#loanAdvancePopup .siExecTypeViewOnly').text($('#siExecTypeAdv option:selected').text());
	setToolTip('#loanAdvancePopup .siExecTypeViewOnly');
	$('#loanAdvancePopup .siFrequencyViewOnly').text($('#siFrequencyAdv option:selected').text());
	setToolTip('#loanAdvancePopup .siFrequencyViewOnly');
	$('#loanAdvancePopup .siPeriodViewOnly').text($('#siPeriodAdv option:selected').text());
	setToolTip('#loanAdvancePopup .siPeriodViewOnly');
	var freqViewOnly = $('#siFrequencyAdv option:selected').text();
	if (freqViewOnly == 'Daily') {
		$('#loanAdvancePopup #refDayViewOnlyDiv').addClass('hidden');
		$('#loanAdvancePopup #periodDivlbl').removeClass('hidden');
		$('#loanAdvancePopup .siPeriodViewOnly').text($('#siPeriodAdv option:selected').text());
		setToolTip('#loanAdvancePopup .siPeriodViewOnly');
	}
	else if(freqViewOnly == 'Specific Day') {
		$('#loanAdvancePopup #periodDivViewlbl').addClass('hidden');
		$('#loanAdvancePopup #refDayViewOnlyDiv').removeClass('hidden');
	}else{
		$('#loanAdvancePopup #periodDivlbl').removeClass('hidden');
		$('#loanAdvancePopup #refDayViewOnlyDiv').removeClass('hidden');
		$('#loanAdvancePopup .siPeriodViewOnly').text($('#siPeriodAdv option:selected').text());
		setToolTip('#loanAdvancePopup .siPeriodViewOnly');
	}

	var refDay = $('#siRefDayAdv option:selected').text();
	if (refDay.length > 9) {
		var refDay = refDay.replace(/y/g, 'y,');
		refDay = refDay.substring(0, (refDay.length)-1);
	}
	$('#loanAdvancePopup .siRefDayViewOnly').text(refDay);
	setToolTip('#loanAdvancePopup .siRefDayViewOnly');
	$('#loanAdvancePopup .siHolidayActionViewOnly').text($('#siHolidayActionAdv option:selected').text());
	setToolTip('#loanAdvancePopup .siHolidayActionViewOnly');
	$('#loanAdvancePopup .siNextExecDateViewOnly').text($('#siNextExecDateAdv').val());
	setToolTip('#loanAdvancePopup .siNextExecDateViewOnly');
}

function showErrorMessage(errMessage)
{
	$( '#messageArea').empty();
	$('#messageArea').append("<span class='ft-bold-font'>ERROR : </span>");
	$( '#messageArea').append("<ul><li>"+ errMessage +"</ul></li>");
	$( '#messageArea' ).removeClass( 'ui-helper-hidden' );
}
function showAdvanceErrorMessage(errMessage)
{
	$( '#messageAreaAdvance').empty();
	$( '#messageAreaAdvance').append("<span class='ft-bold-font'>ERROR : </span>");
	$( '#messageAreaAdvance').append("<ul><li>"+ errMessage +"</ul></li>");
	$( '#messageAreaAdvance' ).removeClass( 'ui-helper-hidden' );
}
function showLaonCenterView(record) {
	
	var strFilterUrl = 'viewLoanCenterRecord.srvc'+ "?" + csrfTokenName + "=" + csrfTokenValue + "&" + "$isSiTabSelected" + "="+ isSiTabSelected;
	Ext.Ajax.request({
		url : strFilterUrl,
		jsonData : Ext.encode( record.get('identifier') ),
		success : function(response) {
			var responseData = Ext.decode(response.responseText);
			var data = responseData.d.loanCenterTxnBean;
			if (data) {
				var paymentType = record.get( 'paymentType' );
				
				if( paymentType == 'I' )
				{
					//document.forms[ 'payDownFieldForm' ].reset();
					paintPayInvoiceViewOnly(data);
					showPayInvoicePopup("true");
					$('#payInvoicePopup .ft-pdf-btn').bind('click', function(e) {
						showTxnSummaryReport('I', data.recordKeyNo);

					});					
				}
				else if( paymentType == 'F' || paymentType == 'P' || paymentType == 'O')
				{
					document.forms[ 'payDownFieldForm' ].reset();
					paintPaydownViewOnly(data);
					showPaydownPopup('true',data);
					$('#payDownPopup1 .ft-pdf-btn').bind('click', function(e) {
						showTxnSummaryReport('P', data.recordKeyNo);

					});
				}
				else
				{
					document.forms[ 'loanAdvanceFieldForm' ].reset();
					paintAdvanceViewOnly(data);
					showAdvancePopup('true',data);
					$('#loanAdvancePopup .ft-pdf-btn').bind('click', function(e) {
						showTxnSummaryReport('D', data.recordKeyNo);

					});
				}
			}
			ifFirstTimeClicked = true;
			$.unblockUI();
		},
		failure : function(response) {
			console.log('Error on loan center view');
			ifFirstTimeClicked = true;
		}
	});
}

function paintPayInvoiceViewOnly(data)
{
	$('#loanPayInvoicePopup .obligorIDViewOnly').text(data.obligorID);
	$('#loanPayInvoicePopup .obligorIDViewOnly').attr("title", data.obligorID);	
	
	$('#loanPayInvoicePopup .obligationIDViewOnly').text(data.obligationID);
	$('#loanPayInvoicePopup .obligationIDViewOnly').attr("title", data.obligationID);
	
	$('#loanPayInvoicePopup .payInvoiceNmbrViewOnly').text(data.invoiceNo);
	$('#loanPayInvoicePopup .payInvoiceNmbrViewOnly').attr("title", data.invoiceNo);
	
	
	$('#loanPayInvoicePopup .principalDueViewOnly').text(data.principalBalAmntFormatted);
	$('#loanPayInvoicePopup .interestDueViewOnly').text(data.interestBalAmntFormatted);
	$('#loanPayInvoicePopup .feesDueViewOnly').text(data.feeBalAmntFormatted);
	
	$('#loanPayInvoicePopup .debitAccViewOnly').text(data.debitAccNo);
	$('#loanPayInvoicePopup .sellerDescViewOnly').text(data.sellerId);
	$('#loanPayInvoicePopup .sellerDescViewOnly').attr("title", data.sellerId);
	$('#loanPayInvoicePopup .currencyViewOnly').text(data.debitAccCcy);
	
	$('#loanPayInvoicePopup .principalViewOnly').text(data.principalRepayAmntFormatted);
	$('#loanPayInvoicePopup .interestViewOnly').text(data.interestRepayAmntFormatted);
	$('#loanPayInvoicePopup .feesViewOnly').text(data.feeRepayAmntFormatted);
	
	$('#loanPayInvoicePopup .totalAmntViewOnly').text(data.requestedAmountFormatted);
	$('#loanPayInvoicePopup .effectDateViewOnly').text(data.effectiveDate);
	if(data.requestStateDesc!=undefined)
		$('#loanPayInvoicePopup .statusViewOnly').text(data.requestStateDesc);
	else
		$('#loanPayInvoicePopup .statusViewOnly').text("");
	$('#loanPayInvoicePopup .trackingNoViewOnly').text(data.trackingNo);
}
function paintPaydownViewOnly(data)
{
	var paydownType = data.paydownType;
	/*if(paydownType == 'both' || paydownType == 'all'){
		$('#payDownPopup1 .dsclmrPaydownPartial').text(data.dsclmrPaydownPartial);
		$('#payDownPopup1 .dsclmrPaydownFull').text(data.dsclmrPaydownFull);
		setToolTip('#payDownPopup1 .dsclmrPaydownPartial');
		setToolTip('#payDownPopup1 .dsclmrPaydownFull');
	}else if(paydownType == 'partial'){
		$('#payDownPopup1 .dsclmrPaydownPartial').text(data.dsclmrPaydownPartial);
		setToolTip('#payDownPopup1 .dsclmrPaydownPartial');
	}else if(paydownType == 'full'){
		$('#payDownPopup1 .dsclmrPaydownFull').text(data.dsclmrPaydownPartial);
		setToolTip('#payDownPopup1 .dsclmrPaydownFull');
	}*/
	if(data.paymentType=='P' )
	{
		$('#payDownPopup1 .dsclmrPaydownPartial').text(data.dsclmrPaydownPartial);
		setToolTip('#payDownPopup1 .dsclmrPaydownPartial');
	}	
	else
	{
		$('#payDownPopup1 .dsclmrPaydownPartial').text(data.dsclmrPaydownFull);
		setToolTip('#payDownPopup1 .dsclmrPaydownPartial');
	}
	$('#payDownPopup1 .obligorIDViewOnly').text(data.obligorID + ' | ' + data.accountName);
	setToolTip('#payDownPopup1 .obligorIDViewOnly');	
	$('#payDownPopup1 .obligationIDViewOnly').text(data.obligationID);
	setToolTip('#payDownPopup1 .obligationIDViewOnly');
	if(data.requestReference != undefined)
	{
		$('#payDownPopup1 .requestReferenceViewOnly').text(data.requestReference);
		setToolTip('#payDownPopup1 .requestReferenceViewOnly');
	}
	else
	{
		$('#payDownPopup1 .requestReferenceViewOnly').text("");
	}
	$('#payDownPopup1 .principalBalAmntViewOnly').text(/*currencySymbolObligation+ */data.principalBalAmntFormatted);
	setToolTip('#payDownPopup1 .principalBalAmntViewOnly');
	$('#payDownPopup1 .interestBalAmntViewOnly').text(/*currencySymbolObligation+ */data.interestBalAmntFormatted);
	setToolTip('#payDownPopup1 .interestBalAmntViewOnly');
	var fidesc = data.sellerId;
	$('#payDownPopup1 .sellerDescriptionViewOnly').text(fidesc);
	if(!isEmpty(fidesc) && fidesc.length>13)
		$('#payDownPopup1 .sellerDescriptionViewOnly').addClass('popup-text-ellipsis').attr('title',fidesc);
	var selectedDebitAcc = data.debitAccNo;
	$('#payDownPopup1 .debitAccNoViewOnly').text(selectedDebitAcc);
	setToolTip('#payDownPopup1 .debitAccNoViewOnly');
	$('#payDownPopup1 .debitAccCcyViewOnly').text(data.debitAccCcy);
	setToolTip('#payDownPopup1 .debitAccCcyViewOnly');
	$('#payDownPopup1 .paymentTypeViewOnly')
			.text((data.paymentType === 'F'|| data.paymentType ==='O') ? 
					(data.paymentType ==='O'? getLabel('lblPayOff', 'PayOff') : getLabel(
							'lblLoanFullAmount', 'Full')):getLabel(
									'lblPartialAmount', 'Partial'));
	setToolTip('#payDownPopup1 .paymentTypeViewOnly');
	$('#payDownPopup1 .effectiveDateViewOnly').text(data.effectiveDate);
	setToolTip('#payDownPopup1 .effectiveDateViewOnly');
	if(data.interestPaidDate != undefined)
	{
		$('#payDownPopup1 .interestPaidDateViewOnly').text(data.interestPaidDate);
		setToolTip('#payDownPopup1 .interestPaidDateViewOnly');
	}
	else
	{
		$('#payDownPopup1 .interestPaidDateViewOnly').text("");
	}
	$('#payDownPopup1 .principalRepayAmntViewOnly')
			.text(/*currencySymbolDebitAcc+*/ data.principalRepayAmntFormatted);
	setToolTip('#payDownPopup1 .principalRepayAmntViewOnly');
	$('#payDownPopup1 .interestRepayAmntViewOnly')
			.text(/*currencySymbolDebitAcc+*/data.interestRepayAmntFormatted);
	setToolTip('#payDownPopup1 .interestRepayAmntViewOnly');
	$('#payDownPopup1 .totalAmntViewOnly').text(/*currencySymbolDebitAcc+ */data.totalAmntFormatted);
	setToolTip('#payDownPopup1 .totalAmntViewOnly');
	// View only
	//$('#payDownPopup1 .StatusViewOnly').text(record.get('Status'));
	$('#payDownPopup1 .trackingNoViewOnly').text(data.trackingNo);
	setToolTip('#payDownPopup1 .trackingNoViewOnly');
	$('#payDownPopup1 .siStartDateViewOnly').text(data.siStartDate);
	setToolTip('#payDownPopup1 .siStartDateViewOnly');
	$('#payDownPopup1 .siEndDateViewOnly').text(data.siEndDate);
	setToolTip('#payDownPopup1 .siEndDateViewOnly');
	if(data.siEnabled == 'Y')
	{
		$('#payDownPopup1 #lblDefault1Div').addClass('hidden');
		$('#payDownPopup1 #principalRepayAmntViewOnlyDiv').addClass('hidden');
	}else{
		$('#payDownPopup1 #lblDefault1Div').removeClass('hidden');
		$('#payDownPopup1 #principalRepayAmntViewOnlyDiv').removeClass('hidden');
	}
	if(data.siEnabled == 'Y' || isSiTabSelected === "Y")
		$('.isSiSectionEnabled').removeClass('hidden');
	else
		$('.isSiSectionEnabled').addClass('hidden');
	
	var freqViewOnly = data.siFrequency;
	$('#payDownPopup1 .siExecTypeViewOnly').text(data.siExecType);
	setToolTip('#payDownPopup1 .siExecTypeViewOnly');
	$('#payDownPopup1 .siFrequencyViewOnly').text(freqViewOnly);
	setToolTip('#payDownPopup1 .siFrequencyViewOnly');
	if (freqViewOnly == 'DAILY') {
		$('#payDownPopup1 .siFrequencyViewOnly').text('Daily');
		$('#payDownPopup1 #periodDivViewlbl').removeClass('hidden');
		$('#payDownPopup1 #refDayViewOnlyDiv').addClass('hidden');
		$('#payDownPopup1 #siHolidayActionViewOnlyDiv').addClass('hidden');
	}
	else if(freqViewOnly == 'SPECIFICDAY') {
		$('#payDownPopup1 .siFrequencyViewOnly').text('Specific Day');
		$('#payDownPopup1 #periodDivViewlbl').addClass('hidden');
		$('#payDownPopup1 #refDayViewOnlyDiv').removeClass('hidden');
		$('#payDownPopup1 #siHolidayActionViewOnlyDiv').removeClass('hidden');
	}else{
		if(freqViewOnly == 'WEEKLY')
			 $('#payDownPopup1 .siFrequencyViewOnly').text('Weekly');
		 if(freqViewOnly == 'MONTHLY')
			 $('#payDownPopup1 .siFrequencyViewOnly').text('Monthly');
		$('#payDownPopup1 #periodDivViewlbl').removeClass('hidden');
		$('#payDownPopup1 #refDayViewOnlyDiv').removeClass('hidden');
		$('#payDownPopup1 #siHolidayActionViewOnlyDiv').removeClass('hidden');
	}
	setSiExtraParameters(data.siPeriod, data.siRefDay, freqViewOnly, data.multiSiRefDay);
	
	$('#payDownPopup1 .siNextExecDateViewOnly').text(data.siNextExecDate);
	var holidayActionView = data.siHolidayAction;
	if (holidayActionView !== undefined || holidayActionView !== null) {
		if (holidayActionView == 0) {
			$('#payDownPopup1 .siHolidayActionViewOnly').text(getLabel('nextBusinessDay','Next Business Day'));
			$('#payDownPopup1 .siHolidayActionViewOnly').attr("title", getLabel('nextBusinessDay','Next Business Day'));
		}else if (holidayActionView == 1) {
			$('#payDownPopup1 .siHolidayActionViewOnly').text(getLabel('previousBusinessDay','Previous Business Day'));
			$('#payDownPopup1 .siHolidayActionViewOnly').attr("title", getLabel('previousBusinessDay','Previous Business Day'));			
		}else {
			$('#payDownPopup1 .siHolidayActionViewOnly').text(getLabel('skipBusinessDay','Skip'));
			$('#payDownPopup1 .siHolidayActionViewOnly').attr("title", getLabel('skipBusinessDay','Skip'));
		}
	}
}
function paintAdvanceViewOnly(data)
{
	$('#loanAdvancePopup .dsclmrAdvance').text(data.dsclmrAdvanceTxt);
	setToolTip('#loanAdvancePopup .dsclmrAdvance');
	$('#loanAdvancePopup .obligorIDViewOnly').text(data.obligorID + ' | ' + data.accountName);
	setToolTip('#loanAdvancePopup .obligorIDViewOnly');
	$('#loanAdvancePopup .obligationIDViewOnly').text(data.obligationID);
	setToolTip('#loanAdvancePopup .obligationIDViewOnly');	
	if(data.requestReference != undefined)
	{
		$('#loanAdvancePopup .requestReferenceViewOnly').text(data.requestReference);
		setToolTip('#loanAdvancePopup .requestReferenceViewOnly');
	}
	else
	{
		$('#loanAdvancePopup .requestReferenceViewOnly').text("");
	}
	$('#loanAdvancePopup .principalBalAmntViewOnly').text(/*currencySymbolObligation + */data.principalBalAmntFormatted);
	setToolTip('#loanAdvancePopup .principalBalAmntViewOnly');	
	$('#loanAdvancePopup .creditBalAmntViewOnly').text(/*currencySymbolObligation + */data.creditBalAmntFormatted);
	setToolTip('#loanAdvancePopup .creditBalAmntViewOnly');
	$('#loanAdvancePopup .creditAccNoViewOnly').text(data.creditAccNo);
	setToolTip('#loanAdvancePopup .creditAccNoViewOnly');
	var fidesc = data.sellerId;
	$('#loanAdvancePopup .sellerIdViewOnly').text(fidesc);
	if(!isEmpty(fidesc) && fidesc.length>13)
		$('#payDownPopup1 .sellerIdViewOnly').addClass('popup-text-ellipsis').attr('title',fidesc);
	
	$('#loanAdvancePopup .creditAccCcyViewOnly').text(data.creditAccCcy);
	setToolTip('#loanAdvancePopup .creditAccCcyViewOnly');
	$('#loanAdvancePopup .loanAdvanceAmntViewOnly').text(data.loanAdvanceAmntFormatted);
	setToolTip('#loanAdvancePopup .loanAdvanceAmntViewOnly')
	$('#loanAdvancePopup .requestDateViewOnly').text(data.effectiveDate);
	setToolTip('#loanAdvancePopup .requestDateViewOnly')
	
	$('#loanAdvancePopup .trackingNoViewOnly').text(data.trackingNo);
	setToolTip('#loanAdvancePopup .trackingNoViewOnly');
	
	if(data.siEnabled == 'Y' || isSiTabSelected === "Y")
	{
		$('.isSiSectionEnabled').removeClass('hidden');
	}
	else
	{
		$('.isSiSectionEnabled').addClass('hidden');
	}
	$('#loanAdvancePopup .siStartDateViewOnly').text(data.siStartDate);
	setToolTip('#loanAdvancePopup .siStartDateViewOnly');
	$('#loanAdvancePopup .siEndDateViewOnly').text(data.siEndDate);
	setToolTip('#loanAdvancePopup .siEndDateViewOnly');
	var freqViewOnly = data.siFrequency;
	$('#loanAdvancePopup .siExecTypeViewOnly').text(data.siExecType);
	setToolTip('#loanAdvancePopup .siExecTypeViewOnly');
	$('#loanAdvancePopup .siFrequencyViewOnly').text(freqViewOnly);
	setToolTip('#loanAdvancePopup .siFrequencyViewOnly');
	if (freqViewOnly == 'DAILY') {
		$('#loanAdvancePopup #periodDivViewlbl').removeClass('hidden');
		$('#loanAdvancePopup #refDayViewOnlyDiv').addClass('hidden');
		$('#loanAdvancePopup #siHolidayActionViewOnlyDiv').addClass('hidden');
	}
	else if(freqViewOnly == 'SPECIFICDAY') {
		$('#loanAdvancePopup #periodDivViewlbl').addClass('hidden');
		$('#loanAdvancePopup #refDayViewOnlyDiv').removeClass('hidden');
		$('#loanAdvancePopup #siHolidayActionViewOnlyDiv').removeClass('hidden');
	}else{
		$('#loanAdvancePopup #periodDivViewlbl').removeClass('hidden');
		$('#loanAdvancePopup #refDayViewOnlyDiv').removeClass('hidden');
		$('#loanAdvancePopup #siHolidayActionViewOnlyDiv').removeClass('hidden');
	}
	
	setAdvSiExtraParameters(data.siPeriod, data.siRefDay, freqViewOnly, data.multiSiRefDay);
	var holidayActionView = data.siHolidayAction;
	if (holidayActionView !== undefined || holidayActionView !== null) {
		if (holidayActionView == 0) {
			$('#loanAdvancePopup .siHolidayActionViewOnly').text(getLabel('nextBusinessDay','Next Business Day'));
			$('#loanAdvancePopup .siHolidayActionViewOnly').attr("title", getLabel('nextBusinessDay','Next Business Day'));
		}else if (holidayActionView == 1) {
			$('#loanAdvancePopup .siHolidayActionViewOnly').text(getLabel('previousBusinessDay','Previous Business Day'));
			$('#loanAdvancePopup .siHolidayActionViewOnly').attr("title", getLabel('previousBusinessDay','Previous Business Day'));
		}else {
			$('#loanAdvancePopup .siHolidayActionViewOnly').text(getLabel('skipBusinessDay','Skip'));
			$('#loanAdvancePopup .siHolidayActionViewOnly').attr("title", getLabel('skipBusinessDay','Skip'));
		}
	}
	$('#loanAdvancePopup .siNextExecDateViewOnly').text(data.siNextExecDate);
	setToolTip('#loanAdvancePopup .siNextExecDateViewOnly');
}

function setSiExtraParameters(strPeriod, strRef, Freq, multiSiRefDay) {
	if (Freq == "WEEKLY") {
		$('#payDownPopup1 .siPeriodViewOnly').text(mapPeriodWeek[strPeriod]);
		$('#payDownPopup1 .siRefDayViewOnly').text(mapRefWeek[strRef]);
	} 
	else if (Freq == "MONTHLY") {
		$('#payDownPopup1 .siPeriodViewOnly').text(mapMonthlyPeriod[strPeriod]);
		$('#payDownPopup1 .siRefDayViewOnly').text(mapRefMonth[strRef]);
	}
	else if (Freq == "DAILY") {
		$('#payDownPopup1 .siPeriodViewOnly').text(mapDailyPeriod[strPeriod]);
		$('#payDownPopup1 .siRefDayViewOnly').text(mapRefDay[strRef]);
	}	
	else if (Freq == "SPECIFICDAY") {
		$('#payDownPopup1 .siPeriodViewOnly').text('');
		$('#payDownPopup1 .siRefDayViewOnly').text(mapRefWeek[strRef]);
		$('#payDownPopup1 .siRefDayViewOnly').prev('label').text("Specific Day :");
		if(multiSiRefDay != null && multiSiRefDay != "")
		{
			var arrGstRef = multiSiRefDay.split(',');
			var strRefDay ='';
			if(!isEmpty(arrGstRef)){
				$.each(arrGstRef, function(index, opt) {
					strRefDay  = strRefDay + ''+ mapRefWeek[arrGstRef[index]];
					 if (index < arrGstRef.length - 1) {
						 strRefDay = strRefDay+", ";
					 }
				});
			}
			var strRefDayTooltip = strRefDay;
			if(strRefDay.length > 40)
				strRefDay = strRefDay.substr(0,40) +'...';
			$('#payDownPopup1 .siRefDayViewOnly').text(strRefDay);
			$('#payDownPopup1 .siRefDayViewOnly').attr('title',strRefDayTooltip);
		}
	}
}

function setAdvSiExtraParameters(strPeriod, strRef, Freq, multiSiRefDay) {
	if (Freq == "WEEKLY") {
		$('#loanAdvancePopup .siPeriodViewOnly').text(mapPeriodWeek[strPeriod]);
		$('#loanAdvancePopup .siRefDayViewOnly').text(mapRefWeek[strRef]);
	} 
	else if (Freq == "MONTHLY") {
		$('#loanAdvancePopup .siPeriodViewOnly').text(mapMonthlyPeriod[strPeriod]);
		$('#loanAdvancePopup .siRefDayViewOnly').text(mapRefMonth[strRef]);
	}
	else if (Freq == "DAILY") {
		$('#loanAdvancePopup .siPeriodViewOnly').text(mapDailyPeriod[strPeriod]);
		$('#loanAdvancePopup .siRefDayViewOnly').text(mapRefDay[strRef]);
	}	
	else if (Freq == "SPECIFICDAY") {
		$('#loanAdvancePopup .siPeriodViewOnly').text('');
		$('#loanAdvancePopup .siRefDayViewOnly').text(mapRefWeek[strRef]);
		$('#loanAdvancePopup .siRefDayViewOnly').prev('label').text("Specific Day :");
		if(multiSiRefDay != null && multiSiRefDay != "")
		{
			var arrGstRef = multiSiRefDay.split(',');
			var strRefDay ='';
			if(!isEmpty(arrGstRef)){
				$.each(arrGstRef, function(index, opt) {
					strRefDay  = strRefDay + ''+ mapRefWeek[arrGstRef[index]];
					 if (index < arrGstRef.length - 1) {
						 strRefDay = strRefDay+", ";
					 }
				});
			}
			var strRefDayTooltip = strRefDay;
			if(strRefDay.length > 40)
				strRefDay = strRefDay.substr(0,40) +'...';
			$('#loanAdvancePopup .siRefDayViewOnly').text(strRefDay);
			$('#loanAdvancePopup .siRefDayViewOnly').attr('title',strRefDayTooltip);
		}
	}
}

function setDefualtSIDates(type)
{
	// jquery autoNumeric formatting
	var endDateObj = new Date(year, month - 1, day);
	var newStartDate1 = addDays(endDateObj, 1);
	var newEndDate = addDays(endDateObj, 2);
	
	var dateStr =  newStartDate1.getMonth().toString() +"/"+ newStartDate1.getDate().toString()+"/"+ newStartDate1.getFullYear().toString();
	var endDateStr = newEndDate.getMonth().toString() +"/"+ newEndDate.getDate().toString()+"/"+ newEndDate.getFullYear().toString();
	
	if(type == 'P')
	{
		checkSiEnabled(false);
		$('#siStartDate, #siEndDate, #siNextExecDate').datepicker({ defaultDate: newStartDate1 });
		$('#siStartDate').val(dateStr);	
		$('#siEndDate').val(endDateStr);
		$('#siEndDate').datepicker('option', 'minDate', newEndDate);
		$('#siStartDate').datepicker('option', 'minDate', newStartDate1);
	}
	else
	{
		checkAdvanceSiEnabled(false);
		$('#siStartDateAdv, #siEndDateAdv, #siNextExecDateAdv').datepicker({ defaultDate: newStartDate1 });
		$('#siStartDateAdv').val(dateStr);	
		$('#siEndDateAdv').val(endDateStr);
		$('#siEndDateAdv').datepicker('option', 'minDate', newEndDate);
		$('#siStartDateAdv').datepicker('option', 'minDate', newStartDate1);
	}
	
	var interestDateStr =$.datepick.formatDate(strApplicationDefaultFormat, new Date(year, month - 1, day));
	$('#interestPaidDate').val("");	
}
function CloneLoanCenter(record) {
	
	var strFilterUrl = 'cloneLoanPayment.srvc?';
	Ext.Ajax.request({
		url : strFilterUrl + csrfTokenName + "=" + csrfTokenValue,
		jsonData : Ext.encode( record.get('identifier') ),
		success : function(response) {
			var responseData = Ext.decode(response.responseText);
			var data = responseData.d.loanCenterTxnBean;
			var obligorID = data.obligorID + ' | ' + data.accountName;
			var obligationid = data.cloneObligationID;
			var debitAccNo =  data.cloneDebitAccNo;
			var creditAccNo =  data.cloneCreditAccNo;
			var obligationidDesc = data.obligationID;
			var isClone = true;
			
			if (data) {
				var paymentType = record.get( 'paymentType' );
				if( paymentType == 'F' || paymentType == 'P' || paymentType == 'O' )
				{
					document.forms[ 'payDownFieldForm' ].reset();
					$("#obligorID-niceSelect").val(obligorID);
					$("#obligorID").val(obligorID);
					$("#obligorID").niceSelect('update');
					$("#obligationID").val(obligationidDesc);
					$("#obligationID").niceSelect('update');
					setCloneValuesForPaydown(data);
					getObligationDebitAccList(obligorID,obligationid,debitAccNo,isClone);
					showPaydownPopup('false');
					
					$('#obligationID').trigger('change');
					$('#obligorID-niceSelect').focus();
					
					getLoanAccBalanceDetails(obligationid, "PAYDOWN");
										
				}
				else
				{
					var selectedOption = obligationid;
					document.forms[ 'loanAdvanceFieldForm' ].reset();
					$("#obligorIDAdv-niceSelect").val(obligorID);
					$("#obligorIDAdv").val(obligorID);
					$("#obligationIDAdv").val(obligationidDesc);
					$("#obligorIDAdv").niceSelect('update');
					$("#obligationIDAdv").niceSelect('update');
					$('#obligationIDAdv-niceSelect').bind('blur', function () { markRequired(this);});
					$('#obligationIDAdv-niceSelect').bind('focus', function () { removeMarkRequired(this);});
					$('#messageAreaAdvance').addClass( 'ui-helper-hidden' );
					getObligationDepositAccList(obligorID,obligationid,creditAccNo,isClone);
					setCloneValuesForAdvance(data);
					showAdvancePopup('false');
					
					getLoanAccBalanceDetails(obligationid, 'ADVANCE');
				}
				selectedObligationId = obligationid;
			}						
		},
		failure : function(response) {
			console.log('Error on loan center view');
		}
	});
}
function setCloneValuesForPaydown(data) {
	$('#obligorID-niceSelect').text(data.obligorID);
	$('#obligationID-niceSelect').text(data.obligationID);
	$('#requestReference').val(data.requestReference);
	$('#principalBalanceAmnt').val(data.principalBalAmnt);
	$('#interestBalanceAmnt').val(data.interestBalAmnt);
	$('#principalBalAmnt').val(data.principalBalAmnt);
	$('#interestBalAmnt').val(data.interestBalAmnt);
	$("#paymentType[value='"+data.paymentType+"']").attr("checked", "checked");
	dateStr1= $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('mm/dd/yy', dtApplicationDate));
	$("#interestPaidDate").val(dateStr1);
	if(data.paymentType && (data.paymentType == 'P' || data.paymentType == 'F'))
	{
		$( '#interestPaidDate' ).datepicker("enable");
	}
	var principalRepayAmnt='', interestRepayAmnt='';
	if(data.principalRepayAmnt)
		principalRepayAmnt= data.principalRepayAmnt;
	$('#principalRepayAmnt').autoNumeric('set',principalRepayAmnt);
	if(data.interestRepayAmnt)
		interestRepayAmnt=data.interestRepayAmnt;
	$('#interestRepayAmnt').autoNumeric('set',interestRepayAmnt);
	$('#totalAmnt').autoNumeric('set', data.totalAmnt );
	if(data.siEnabled == 'N')
	{	
		$('#siEnabled1').attr('checked',false);
		$('.isSiSectionEnabled').addClass('hidden');
		$( '#siHeaderLine' ).attr( "class", "hidden" );
	}
	else
	{
		var endDateObj = new Date(year, month - 1, day);
		var newStartDate1 = addDays(endDateObj, 1);
		var newEndDate = addDays(endDateObj, 2); 
		var dateStr =  newStartDate1.getMonth().toString() +"/"+ newStartDate1.getDate().toString()+"/"+ newStartDate1.getFullYear().toString();
		var endDateStr = newEndDate.getMonth().toString() +"/"+ newEndDate.getDate().toString()+"/"+ newEndDate.getFullYear().toString();
		$('#siStartDate, #siEndDate, #siNextExecDate').datepicker({ defaultDate: newStartDate1 });
		
		if(data.siStartDate == null || data.siStartDate=='')
		{
			$('#siStartDate').val(dateStr);				
		}
		else
		{
			$('#siStartDate').val(data.siStartDate);								
		}
		if(data.siEndDate == null || data.siEndDate=='')
		{
			$('#siEndDate').val(endDateStr);				
		}
		else
		{
			$('#siEndDate').val(data.siEndDate);								
		}
		if(nextExecDate == null || nextExecDate=='')
		{
			//$('#siNextExecDate').val(newDate);				
		}
		else
		{
			$('#siNextExecDate').val(nextExecDate);								
		}
		$('#siEndDate').datepicker('option', 'minDate', newEndDate);
		$('#siStartDate').datepicker('option', 'minDate', newStartDate1);
		
		$('#siEnabled1').attr('checked',true);
		$('.isSiSectionEnabled').removeClass('hidden');
		$('#siEnabled1').val('Y');
		$('#siHeaderLine').removeClass( 'hidden' );
		$('#siFrequency').val(data.siFrequency);
		$('#siFrequency').niceSelect('update');
		setRefAttributes(data.siFrequency);
		$('#siPeriod').val(data.siPeriod);
		$('#siPeriod').niceSelect('update');
		//$("#siPeriod").prop('selectedIndex', (data.siPeriod - 1));
		$('#siStartDate').val(data.siStartDate);
		$('#siEndDate').val(data.siEndDate);
		$('#siRefDay').val(data.siRefDay);
		if(!($('#siRefDay').attr('multiple')==='multiple')){
			$('#siRefDay').niceSelect('update');
		}
		$('#siHolidayAction').val(data.siHolidayAction);
		$('#siHolidayAction').niceSelect('update');
		
		
		//$('#siStartDate').val(data.siStartDate);	
		//$('#siEndDate').val(data.siEndDate);
		//$('#siEndDate').datepicker('option', 'minDate', newEndDate);
		//$('#siStartDate').datepicker('option', 'minDate', newStartDate1);
	}
}
function setCloneValuesForAdvance(data) {
	$('#requestReferenceAdv').val(data.requestReference);
	$('#principalBalanceAmntAdv').val(data.principalBalAmnt);
	$('#creditBalanceAmnt').val(data.creditBalAmnt);
	//$('#loanAdvanceAmnt').val(data.loanAdvanceAmnt);
	$('#loanAdvanceAmnt').autoNumeric('set', data.loanAdvanceAmnt );
	$('#principalBalanceAmnt').val(data.principalBalAmnt);
	$('#interestBalanceAmnt').val(data.creditBalAmnt);
	$('#principalBalAmnt').val(data.principalBalAmnt);
	$('#interestBalAmnt').val(data.interestBalAmnt);
	if(data.siEnabled == 'N')
	{	
		$('#siEnabledAdv1').attr('checked',false);
		$( '#advanceRecPaymentParamDiv' ).attr( "class", "ui-helper-hidden" );
		$( '#siHeaderLine' ).attr( "class", "hidden" );
	}
	else
	{
		$('#siEnabledAdv1').attr('checked',true);
		$('#siEnabledAdv1').val('Y');
		$('#advanceRecPaymentParamDiv').removeClass( 'ui-helper-hidden' );
		$('#siHeaderLine').removeClass( 'hidden' );
		$('#siFrequencyAdv').val(data.siFrequency);
		$('#siFrequencyAdv').niceSelect('update');
		setAdvanceRefAttributes(data.siFrequency);
		$('#siPeriodAdv').val(data.siPeriod);
		$('#siPeriodAdv').niceSelect('update');
		$('#siStartDateAdv').val(data.siStartDate);
		$('#siEndDateAdv').val(data.siEndDate);
		$('#siRefDayAdv').val(data.siRefDay);
		if(!($('#siRefDayAdv').attr('multiple')==='multiple')){
			$('#siRefDayAdv').niceSelect('update');
		}
		$('#siHolidayActionAdv').val(data.siHolidayAction);
		$('#siHolidayActionAdv').niceSelect('update');
	}
}

function isAutoNumericApplied(strId) {
	var isAutoNumericApplied = false;
	$.each(($('#'+strId).data('events')||[]), function(i, event) {
				if (isAutoNumericApplied === true)
					return false;
				$.each(event, function(i, eventHandler) {
							if (eventHandler.namespace === 'autoNumeric')
								isAutoNumericApplied = true;
							return false;
						});
			});
	return isAutoNumericApplied;
}

function resetLoanTxnAdvancePopupFields(){
	
	$('#obligorIDAdv').niceSelect('update');
	$("#obligorIDAdv").trigger('change');
	$("#obligorIDAdv-niceSelect").removeClass("requiredField");
	$('#obligationIDAdv > option' ).remove();
	//$('#obligationIDAdv').append("<option>Select</option>");
	var option = $('<option></option>').attr("value", "").text("Select");
	$("#obligationIDAdv").empty().append(option);
	$('#obligationIDAdv').niceSelect('update');
	$('#obligationIDAdv-niceSelect').bind('blur', function () { markRequired(this);});
	$('#obligationIDAdv-niceSelect').bind('focus', function () { removeMarkRequired(this);});
	$('#creditAccNo').append("<option value=''>Select</option>");
	$('#creditAccNo').niceSelect('update');
	$("#creditAccNo").trigger('change');
	$("#creditAccNo-niceSelect").removeClass("requiredField");
	$("#siFrequencyAdv").val($("#siFrequencyAdv option:first").val());
	$("#siFrequencyAdv").niceSelect('update');
	$("#siFrequencyAdv").trigger('change');
	$('#siEnabledAdv1').attr('checked',false);
	$('#messageAreaAdvance').addClass( 'ui-helper-hidden' );
	$("#loanAdvanceAmnt").removeClass("requiredField");
	$("#obligorIDAdv-niceSelect").removeClass("requiredField");
}
function renderPaymentType(value)
{
	if( GranularPermissionFlag == 'Y' )
	{
		renderGranPayType(value);
	}
	else
	{
		renderPayType(value);
	}
}

function renderGranPayType(value)
{
	for( var i = 0 ; i < debitItemList.length ; i++ )
	{
		if( value == debitItemList[i].filterCode)
		{

			// debitItemList[i].additionalValue3  - For Full Paydown
			// debitItemList[i].additionalValue4  - For Partial Paydown
			if( debitItemList[i].additionalValue3 && debitItemList[i].additionalValue3 =='Y' &&
					debitItemList[i].additionalValue4 && debitItemList[i].additionalValue4 == 'Y' )
			{
				// do nothing
				$("input[type=radio][id='paymentType']").attr('disabled', false);
				$("#paymentType[value='P']").attr("checked", "checked");
			}
			// Full Paydown
			else if( debitItemList[i].additionalValue3 && debitItemList[i].additionalValue3 =='Y' &&
					debitItemList[i].additionalValue4 && debitItemList[i].additionalValue4 == 'N' )
			{
				$("#paymentType[value='F']").attr("checked", "checked");
				$("input[type=radio][id='paymentType']").attr('disabled', true);
				checkPaymentType();
			}
			// partial Paydown
			else if( debitItemList[i].additionalValue3 && debitItemList[i].additionalValue3 =='N' &&
					debitItemList[i].additionalValue4 && debitItemList[i].additionalValue4 == 'Y' )
			{
				$("#paymentType[value='P']").attr("checked", "checked");
				$("input[type=radio][id='paymentType']").attr('disabled', true);
				checkPaymentType();
			}				
		}
		else if(value == 'F')
		{
			$("input[type=radio][id='paymentType']").attr('disabled', false);
			$("#paymentType[value='P']").attr("checked", "checked");
		}
		
	}	

}
function renderPayType(value)
{
	//$("#paymentType[value='O']").attr("checked", "checked");
	if(value == 'F')
	{
		$("input[type=radio][id='paymentType']").attr('disabled', false);
		$("#paymentType[value='P']").attr("checked", "checked");
	}
	else
	{
		if( privPaydownFlag != null && privPaydownFlag != '' && privPaydownFlag == 'Y' && 
				privPartPaydownFlag != null && privPartPaydownFlag != '' && privPartPaydownFlag == 'Y' )
		{
			// do nothing
			$("input[type=radio][id='paymentType']").attr('disabled', false);
			$("#paymentType[value='P']").attr("checked", "checked");
		}
		// Full Paydown
		else if( privPaydownFlag != null && privPaydownFlag != '' && privPaydownFlag == 'Y')
		{
			$("#paymentType[value='F']").attr("checked", "checked");
			$("input[type=radio][id='paymentType']").attr('disabled', true);
			checkPaymentType();
		}
		// partial Paydown
		else if( privPartPaydownFlag != null && privPartPaydownFlag != '' && privPartPaydownFlag == 'Y')
		{
			$("#paymentType[value='P']").attr("checked", "checked");
			$("input[type=radio][id='paymentType']").attr('disabled', true);
			checkPaymentType();		
		}		
	}

}

function setToolTip(idSelector)
{
	$(idSelector).attr('title', $(idSelector).text());
	$(idSelector).addClass('popup-text-ellipsis');
}

function setObligorAccCurrency(strPayType)
{
	var accNo, selectedValue,strCCY;
	if(strPayType == 'PAYDOWN')
	{
		accNo = document.getElementById("obligorID");
	}
	else
	{
		accNo = document.getElementById("obligorIDAdv");
	}
	
	selectedValue=!isEmpty(accNo.value)?accNo.value: '';
	for( var i = 0 ; i < obligorCurrencyData.length ; i++ )
	{
		if( obligorCurrencyData[ i ][ 0 ] == selectedValue )
		{
			strCCY = obligorCurrencyData[ i ][ 1 ] ;
			if(strPayType == 'PAYDOWN')
			{
				$('#principalBalanceAmntLbl').text(principalBalanceAmntLbl + "(" + strCCY+ ")");
				$('#interestBalanceAmntLbl').text(interestBalanceAmntLbl + "(" + strCCY+ ")");
				$('#principalRepayAmntLbl').text(principalRepayAmntLbl + "(" + strCCY+ ")");
				$('#interestRepayAmntLbl').text(interestRepayAmntLbl + "(" + strCCY+ ")");
				$('#totalAmntLbl').text(totalAmntLbl+ "(" + strCCY+ ")");
			}
			else
			{
				$('#principalBalanceAmntAdvLbl').text(principalBalanceAmntAdvLbl + "(" + strCCY+ ")");
				$('#creditBalanceAmntLbl').text(creditBalanceAmntLbl + "(" + strCCY+ ")");
			}
			break;
		}
		else
		{
			if(strPayType == 'PAYDOWN')
			{
				$('#principalBalanceAmntLbl').text(principalBalanceAmntLbl);
				$('#interestBalanceAmntLbl').text(interestBalanceAmntLbl);
				$('#principalRepayAmntLbl').text(principalRepayAmntLbl );
				$('#interestRepayAmntLbl').text(interestRepayAmntLbl);
				$('#totalAmntLbl').text(totalAmntLbl);
			}
			else
			{
				$('#principalBalanceAmntAdvLbl').text(principalBalanceAmntAdvLbl);
				$('#creditBalanceAmntLbl').text(creditBalanceAmntLbl);
			}
		}
	}	
}
function markRequiredInterestPaidDate()
{
	var interestRepayAmnt = null;
	interestRepayAmnt = document.forms[ 'payDownFieldForm' ].elements[ 'interestRepayAmnt' ].value;
	if (interestRepayAmnt && (interestRepayAmnt.replace(/\,/g,'')) > 0)
	{
		$('#interestPaidDateLbl').addClass("required");		
	}	
	else
	{
		$('#interestPaidDateLbl').removeClass("required");		
	}
}

function checkObligorId() {
	var attribute = $('#obligorID').attr('optionSelected');
	var count = null, code = null, desc = null;
	if($('#obligorID').val() == '')
	{
	  $("#principalBalanceAmntLbl").val(0);
	  $("#interestBalanceAmnt").val(0);
	}
	if(obligorIdRes != null)
	{	
		count = obligorIdRes.length;
		if(count == 0)
		{
			if(attribute != 'true')
				$("#obligorID").val('');
		}
		else if(count == 1)
		{
			obligorIdRes.map(function(ele)
            {
				code = ele.CODE;
				desc = ele.DESCRIPTION ;
			});
			$("#obligorID").val(desc);
			setDataToObligationIdValue( "#obligationID", code);
			getObligationDebitAccList(code,obligationid,debitAccNo,isClone);
			setObligorAccCurrency('PAYDOWN');
			checkPaymentType();
			
				if(obligationIDlist.OBLIGATION_LIST.length == 1 )
				{	
					var abc = obligationIDlist.OBLIGATION_LIST[0];
					obligationIdRes[0] ={
						CODE: abc.filterCode,
						DESCRIPTION: abc.filterValue
					}; 
				}
			
			if(obligationIdRes != null)
			{
				$('#obligationID').attr('optionSelected',true);
				checkObligationId();
			}
			//$('#obligationID').unbind('blur');
		}
		else
		{
			if(attribute != 'true')
				$("#obligorID").val('');
		}
	}
		
}

function checkObligationId() {
	var attribute = $('#obligationID').attr('optionSelected');
	console.log("in blur");
	if(obligationIdRes != null)
	{	if($("#obligationID").val() == '' && attribute != 'true')
		{
			$("#obligationID").val('');
			reSetLoanAccBalanceDetails('PAYDOWN');
			$('.ui-autocomplete').hide();
			$('#obligationID').unbind('blur');
		}
		else
		{
			count = obligationIdRes.length;
			if(count == 0)
			{
				if(attribute != 'true')
					$("#obligationID").val('');
			}
			else if(count == 1)
			{
				obligationIdRes.map(function(ele)
	            {
					code = ele.CODE;
					desc = ele.DESCRIPTION ;
				});
				$('#obligationID').val(desc);
				selectedObligationId = code;
				$('.ui-autocomplete').hide();
				getLoanAccBalanceDetails(code, "PAYDOWN");
				$('#obligationID').val(desc);
				return true;
			}
			else
			{
				if(attribute != 'true')
					$("#obligationID").val('');
			}
		}
	}
}

function checkAdvObligorId() {
	var attribute = $('#obligorID').attr('optionSelected');
	var count = null, code = null, desc = null;
	if(obligorIdAdvRes != null)
	{	
		count = obligorIdAdvRes.length;
		if(count == 0)
		{
			if(attribute != 'true')
				$("#obligorIDAdv").val('');
		}
		else if(count == 1)
		{
			obligorIdAdvRes.map(function(ele)
            {
				code = ele.CODE;
				desc = ele.DESCRIPTION ;
			});
			$("#obligorIDAdv").val(desc);
			setDataToObligationIdAdvance( "#obligationIDAdv", code);
			getObligationDepositAccList(code,obligationid,debitAccNo,isClone);
				if(obligationIDAdvlist.OBLIGATION_LIST.length == 1 )
				{	
					var abc = obligationIDAdvlist.OBLIGATION_LIST[0];
					obligationIdAdvRes[0] ={
						CODE: abc.filterCode,
						DESCRIPTION: abc.filterValue
					}; 
				}
			
			if(obligationIdAdvRes != null)
			{
				$('#obligationIDAdv').attr('optionSelected',true);
				checkAdvObligationId();
			}
			//$('#obligationID').unbind('blur');
		}
		else
		{
			if(attribute != 'true')
				$("#obligorIDAdv").val('');
		}
	}
}

function checkAdvObligationId() {
	var attribute = $('#obligationIDAdv').attr('optionSelected');
	if(obligationIdAdvRes != null)
	{	if($("#obligationIDAdv").val() == '' && attribute != 'true')
		{
			$("#obligationIDAdv").val('');
			reSetLoanAccBalanceDetails('ADVANCE');
			$('.ui-autocomplete').hide();
			$('#obligationIDAdv').unbind('blur');
		}
		else
		{
			count = obligationIdAdvRes.length;
			if(count <= 0)
			{
				if(attribute != 'true')
					$("#obligationIDAdv").val('');
			}
			else if(count <= 1)
			{
				obligationIdAdvRes.map(function(ele)
	            {
					code = ele.CODE;
					desc = ele.DESCRIPTION ;
				});
				$('#obligationIDAdv').val(desc);
				selectedObligationId = code;
				$('.ui-autocomplete').hide();
				getLoanAccBalanceDetails(code, "ADVANCE");
				$('#obligationIDAdv').val(desc);
				setAccCurrency("ADVANCE");
				setObligorAccCurrency('ADVANCE');
			}
			else
			{
				if(attribute != 'true')
					$("#obligationIDAdv").val('');
			}
			
		}
}	
}

function getAdvFilterObligationId(obligorIdValue)
{
	var strUrl = 'services/userseek/loanCenterClientObligationIDSeek.json?$filtercode1=' + obligorIdValue;
	var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
	while (arrMatches = strRegex.exec(strUrl)) {
    	 objParam[arrMatches[1]] = arrMatches[2];
   	}
   	var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
   	strUrl = strGeneratedUrl;
	Ext.Ajax.request(
			{
				url : strUrl,
				method : "POST",
				params:objParam,
				async : false,
				success : function( response )
				{
					obligationIDlist = Ext.decode( response.responseText ).d.preferences;
					
				},
				failure : function( response )
				{
					console.log( 'Error Occured' );
				}
			} );
}