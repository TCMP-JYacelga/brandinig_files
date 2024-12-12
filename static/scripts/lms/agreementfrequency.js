
var agreementFreqType = null;
function showListBack( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "agreementCode" ).value = "";
	document.getElementById( "agreementID" ).value = "";
	document.getElementById( "ccyRestriction" ).value = "";
	document.getElementById( "frequencyCode" ).value = "";
	document.getElementById( "frequencyDesc" ).value = "";
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showList( strUrl )
{
	window.location = strUrl;
}
function showBack()
{
	var args = showBack.arguments;
	if( args.length > 0 )
		window.location = args[ 0 ];
	else
		window.location = "agreementFrequencyList.form";
	return true;
}

function showAddNewForm( strUrl )
{
	window.location = strUrl;
}
function discardDetailRecord( arrData )
{
	var frm = document.forms[ "frmMain" ];
	frm.txtIndex.value = arrData[ 1 ];
	frm.action = arrData[ 0 ];
	frm.method = "POST";
	frm.submit();
}
function showHistoryForm( strUrl, index )
{
	var intTop = ( screen.availHeight - 300 ) / 2;
	var intLeft = ( screen.availWidth - 400 ) / 2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms[ "frmMain" ];
	document.getElementById( "txtIndex" ).value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";
	window.open( "", "hWinHistory", strAttr );
	frm.submit();
	frm.target = "";

}

function doFormSubmit( strUrl, index )
{
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "txtIndex" ).value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function goToUrl( strUrl)
{
	var frm = document.forms[ "frmMain" ];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

/*
 * function showViewForm(strUrl, index) { var frm = document.forms["frmMain"];
 * document.getElementById("txtIndex").value = index; frm.action = strUrl;
 * frm.method = "POST"; frm.submit(); }
 * 
 * function showEditForm(strUrl, index) { var frm = document.forms["frmMain"];
 * document.getElementById("txtIndex").value = index; frm.action = strUrl;
 * frm.method = "POST"; frm.submit(); }
 *  // Enable, Disable, Accept and Reject requests function enableRecord(strUrl,
 * index) { var frm = document.forms["frmMain"];
 * document.getElementById("txtIndex").value = index; frm.action = strUrl;
 * frm.method = "POST"; frm.submit(); }
 * 
 * function disableRecord(strUrl, index) { var frm = document.forms["frmMain"];
 * document.getElementById("txtIndex").value = index; frm.action = strUrl;
 * frm.method = "POST"; frm.submit(); }
 * 
 * function acceptRecord(strUrl, index) { var frm = document.forms["frmMain"];
 * document.getElementById("txtIndex").value = index; frm.action = strUrl;
 * frm.method = 'POST'; frm.submit(); }
 */

function rejectRecord( arrData, retVal )
{
	var frm = document.forms[ "frmMain" ];
	frm.txtIndex.value = arrData[ 1 ];
	frm.rejectRemarks.value = retVal;
	frm.action = arrData[ 0 ];
	frm.method = "POST";
	frm.submit();
}

/*
 * function rejectSubmit(strUrl,index) { var frm = document.forms["frmMain"];
 * document.getElementById("txtIndex").value = index; frm.action = strUrl;
 * frm.method = "POST"; frm.submit(); }
 */

// List navigation
function prevPage( strUrl, intPg )
{
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "txtCurrent" ).value = intPg;
	if( isNaN( intPg ) || isNaN( lastPage ) )
	{
		showError( "Page number can accept integer only", null );
		return false;
	}

	if( intPg > lastPage )
	{
		showError( 'Page Number cannot be greater than total number of pages!',
				null );
		return false;
	}
	else if( intPg < 0 )
	{
		showError( 'Page Number should be greater than Zero!', null );
		return false;
	}

	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function nextPage( strUrl, intPg )
{
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "txtCurrent" ).value = intPg;
	if( isNaN( intPg ) || isNaN( lastPage ) )
	{
		showError( "Page number can accept integer only", null );
		return false;
	}

	if( intPg > lastPage )
	{
		showError( 'Page Number cannot be greater than total number of pages!',
				null );
		return false;
	}
	else if( intPg < 0 )
	{
		showError( 'Page Number should be greater than Zero!', null );
		return false;
	}
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

// Details
/*
 * function deleteDetail(strUrl, index) { var frm = document.forms["frmMain"];
 * document.getElementById("txtIndex").value = index; frm.action = strUrl;
 * frm.method = "POST"; frm.submit(); }
 * 
 * function viewDetailForm(strUrl, index) { var frm = document.forms["frmMain"];
 * document.getElementById("txtIndex").value = index; frm.action = strUrl;
 * frm.method = "POST"; frm.submit(); }
 * 
 * function editDetailForm(strUrl, index) { var frm = document.forms["frmMain"];
 * document.getElementById("txtIndex").value = index; frm.action = strUrl;
 * frm.method = "POST"; frm.submit();
 *  }
 */

function refreshNextExecutionDate()
{
	var url = 'showAgreementIntraDayFreq.srvc?'+csrfTokenName+'='+csrfTokenValue;
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "url" ).value = actionURL;
	document.getElementById( "newMode" ).value = newMODE;
	var holidaySchFlg = $('#frequencyHolidayReSched').val();
	document.getElementById("frequencyHolidayReSched").value = holidaySchFlg;
	assignAgreementSchedulingParams();
	try
	{
	/*	document.getElementById( "frequencyspan" ).innerHTML = document
				.getElementById( "frequencyName" ).value;*/
	}
	catch( e )
	{
	}
	document.forms[ 'frmMain' ].action = url;
	document.forms[ 'frmMain' ].method = 'POST';
	document.forms[ 'frmMain' ].submit();

}
function navigateBack()
{
	window.location = "welcome.jsp";
}
function doFilter( strUrl )
{
	var url = 'agreementFrequencyList.form';
	if( strUrl != null && strUrl != "" )
		url = strUrl;
	var frm = document.forms[ "frmMain" ];
	document.getElementById( 'filterFlag' ).value = 'filter';
	document.getElementById( "newFilter" ).value = 'new';
	document.forms[ 'frmMain' ].action = url;
	document.forms[ 'frmMain' ].method = 'POST';
	document.forms[ 'frmMain' ].submit();
	return true;
}

function disableMe( var2 )
{
}
function enableMe( var1 )
{
}
function call( str )
{

	if( str == 'F2' )
	{
		showAddNewForm( 'addAgreementFrequency.form' );
	}
	else if( str == 'F12' )
	{
		try
		{
			if( backURL != null )
			{
				showBack( backURL );
			}
		}
		catch( e )
		{
			showList( 'welcome.jsp' );
		}
		finally
		{
			fun = "";
		}

	}
	else if( str == 'F11' )
	{
		save();
	}
	else if( str == "F3" )
	{

		doFilter( filterURL );
	}
	return true;
}

function goPgNmbr( strUrl, totalPages )
{
	var frm = document.forms[ "frmMain" ];
	var pgNmbr = document.getElementById( "goPageNumbr" ).value;
	if( isNaN( pgNmbr ) || isNaN( totalPages ) )
	{
		showError( "Page number can accept integer only", null );
		return false;
	}

	if( parseInt( pgNmbr,10 ) > parseInt( totalPages,10 ) )
	{
		showError( 'Page Number cannot be greater than total number of pages!',
				null );
		return false;
	}
	else if( parseInt( pgNmbr,10 ) <= 0 )
	{
		showError( 'Page Number should be greater than Zero!', null );
		return false;
	}
	document.getElementById( "txtCurrent" ).value = parseInt( pgNmbr,10 ) - 1;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function save( url )
{
	var frequencyType = document.getElementById( "frequencyType" );
	var holidayResch = document.getElementById( "frequencyHolidayReSched" );
	var priority = document.getElementById( "priority" );
	var eodBalanceFlag = document.getElementById( "eodBalanceFlag" );
	if(frequencyType.value != 'R')
	{
		holidayResch.value = "";
		priority.value = "";
		eodBalanceFlag.value ="";
	}
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = url;
	frm.method = "POST";
	frm.submit();
	return true;
}
function CheckProduct()
{
	var frm = document.forms[ "frmMain" ];
	document.getElementById( "url" ).value = actionURL;
	document.getElementById( "newMode" ).value = newMODE;
	frm.target = "";
	frm.action = "fetchAgreementFrequency.form";
	frm.method = "POST";
	frm.submit();
	return true;
}

function setEODBalFlagForEODProduct()
{
	var frm = document.forms[ "frmMain" ];
	// var prodType =document.getElementById("prodType");
	// if(prodType!=null)
	{
		// document.getElementById("eodBalanceFlag2").disabled ='true';
	}
}

function getRecord( json, elementId, fptrCallback )
{
	var myJSONObject = JSON.parse( json );
	var inputIdArray = elementId.split( "|" );
	for( i = 0 ; i < inputIdArray.length ; i++ )
	{
		var field = inputIdArray[ i ];
		if( document.getElementById( inputIdArray[ i ] )
				&& myJSONObject.columns[ i ] )
		{
			var type = document.getElementById( inputIdArray[ i ] ).type;
			if( type == 'text' )
			{
				document.getElementById( inputIdArray[ i ] ).value = myJSONObject.columns[ i ].value;
			}
			else if( type == 'hidden' )
			{
				document.getElementById( inputIdArray[ i ] ).value = myJSONObject.columns[ i ].value;
			}
			else
			{
				document.getElementById( inputIdArray[ i ] ).innerHTML = myJSONObject.columns[ i ].value;
			}
		}
	}
	if( !isEmpty( fptrCallback ) && typeof window[ fptrCallback ] == 'function' )
		window[ fptrCallback ]( json, elementId );
}

function onLoadhideFields()
{
	var frequencyType = document.getElementById( "frequencyType" );	
	$( "#bankFrequencyCode" ).attr( "disabled", false );
	$( "#bankFrequencyCode" ).removeClass( "disabled" );
	$( '#bankFrequencyCode').niceSelect('update');
	
	if( frequencyType.value == 'R' )
	{
		$("#divPriority").show();
		$("#divEodBalanceFlag").show();
		$("#divFrequencyHolidayReSched").show();
		$("#divScheduleDate").addClass("col-lg-offset-1");
	}
	else
	{
		$("#priority").val('0');
		$("#divPriority").hide();
		$("#divEodBalanceFlag").hide();
		$("#divFrequencyHolidayReSched").hide();
		$("#divScheduleDate").removeClass("col-lg-offset-1");
	}
	if( frequencyType.value == 'S' )
	{
   		document.getElementById( "bankFrequencyCode" ).value = 'BOD';
   		$('#frequencyCode').val('BOD');
   		$("#bankFrequencyCode").attr( "disabled", true );
		$("#bankFrequencyCode").addClass( "disabled" );
		$('#bankFrequencyCode').niceSelect('update');
	}
}


function getNextExecutionDate()
  {
	if($('#agreementCode').val()=='' || $('#clientId').val()=='' ||$('#priority').val()=='')
	{
		
	}
	else
	{
    var strData = {};
    var strUrl = 'agreementFrequencyMst/getNextExecutionDate.srvc';
    var agreementFreqType = $('input[type="radio"][name="agreementFreqType"]:checked').val()
    var agreementFreqPeriod = '1';
    var agreementFreqDayNmbr= '1';
    var canInvokeService = false;
    strData[ 'agreementCode' ]      = $('#agreementCode').val();
    strData[ 'agreementRecKey' ]    = $('#agreementRecKey').val();
    strData[ 'frequencyType' ]      =  $('#frequencyType').val();
    strData[ 'bankFrequencyCode' ]  =  $('#bankFrequencyCode').val();
    strData[ 'eodBalanceFlag' ]     =  $('#eodBalanceFlag').val();
    strData[ 'agreementFreqType' ]  = agreementFreqType;
    if('D' === agreementFreqType){
        agreementFreqPeriod  = $('#agreementFreqDayPeriod').val();
    }
    else if('W' === agreementFreqType){
    	agreementFreqPeriod = $('#agreementFreqWeekPeriod').val();
    	agreementFreqDayNmbr = $('#agreementFreqWeekDayNmbr').val();
    }
    else if('M' === agreementFreqType){
    	agreementFreqPeriod = $('#agreementFreqMonthPeriod').val();
    	agreementFreqDayNmbr = $('#agreementFreqMonthDayNmbr').val();
    }
    else if('S' === agreementFreqType){
    	agreementFreqDayNmbr = $('#AgrmntFreqTypeSpecificDay').getMultiSelectValueString();
    }
    strData[ 'agreementFreqPeriod' ]  = agreementFreqPeriod;
    strData[ 'agreementFreqDayNmbr' ] = agreementFreqDayNmbr;
    strData[ 'frequencyHolidayReSched' ]  =  $('#frequencyHolidayReSched').val();
    strData[ 'scheduleEffectiveDate' ]     =  $('#scheduleEffectiveDate').val();
    strData[ csrfTokenName ] = csrfTokenValue;
    if(!isEmpty(agreementFreqDayNmbr) || 'D' === agreementFreqType){
    	canInvokeService = true;
    }
    if(canInvokeService) {
        $.ajax(
        {
            cache : false,
            data : strData,
            dataType : 'json',
            success : function( response )
            {
                var element = $('<p>');
                if(response && response.d && (response.d.ERROR || response.d.VALIDATIONERROR))
                {
                	$('#messageContentDiv, #messageArea').removeClass('hidden');
                	$('#messageArea').empty();
                	$('#errorDiv').empty();
                	if(!isEmpty(response.d.VALIDATIONERROR)){
                	   element = $('<p>').text(response.d.VALIDATIONERROR);	
                	}
                	else if (!isEmpty(response.d.ERROR)){
                		element = $('<p>').text(response.d.ERROR);
                	}

                	element.appendTo($('#messageArea'));
                	$('html, body').animate({
                        scrollTop : 0
                    }, 'slow');
                	
                	$('#nxtExecutionDate').val(response.d.NextExecutionDate);
                }
                else if(response && response.d && response.d.NextExecutionDate){
                	$('#nxtExecutionDate').val(response.d.NextExecutionDate);
                	$('#nextExecDate').val(response.d.NextExecutionDate);
                }
            },
            error : ajaxError,
            url : strUrl,
            type : 'POST'
        } );
      }
  }
  }

  function setFrequencyType()
  {
	var strData = {};
  	var strUrl = 'checkInvestmentAgreement.srvc';
  	var agreementCode = document.getElementById( "agreementCode" ).value;
	var clientId = document.getElementById( "clientId" ).value;
  	
  	strData[ '$clientId' ] = clientId;  	
  	strData[ '$agreementCode' ] = agreementCode;
  	strData[ csrfTokenName ] = csrfTokenValue;

  	$.ajax(
  	{
  		cache : false,
  		data : strData,
  		dataType : 'json',
  		success : function( response )
  		{
  			loadFrequencyType( response.SWEEP_BACK_FLAG );
  		},
  		error : ajaxError,
  		url : strUrl,
  		type : 'POST'
  	} );
  }
  function setCponEnforcedStructureType()
  {
  	var strData = {};
  	var strUrl = 'getCponEnforcedSchData.srvc';
  	var clientId = document.getElementById( "clientId" ).value;
  	
  	strData[ '$clientId' ] = clientId;
  	strData[ csrfTokenName ] = csrfTokenValue;

  	$.ajax(
  	{
  		cache : false,
  		data : strData,
  		dataType : 'json',
  		success : function( response )
  		{
  			loadFrequencyType( response.SWEEP_BACK_FLAG );
  		},
  		error : ajaxError,
  		url : strUrl,
  		type : 'POST'
  	} );

  }
  
  function ajaxError()
  {
  	alert( "AJAX error, please contact admin!" );
  }
  
  function loadFrequencyType( sweepBackFlag )
  {
  	$( '#frequencyType > option' ).remove();
  	
  	// For inserting "Regular" option	
  	opt = document.createElement("option");
    document.getElementById("frequencyType").options.add(opt);
    opt.text = getLabel("sweepback.R","Regular");
    opt.value = "R";
    //opt.selected = true;
    
    // Sweep Back option add logic depending upon CPON flag value 
  	if( sweepBackFlag == 'T')
  	{
  		opt = document.createElement("option");
        document.getElementById("frequencyType").options.add(opt);
        opt.text = getLabel("sweepback.S","Sweep Back");
        opt.value = "S";
  	}
    
    // For inserting "Contribution Reset" option	
  	opt = document.createElement("option");
    document.getElementById("frequencyType").options.add(opt);
    opt.text = getLabel("sweepback.C","Contribution Reset");
    opt.value = "C";
    
    $("#frequencyType > option").each(function() {
       // alert(this.text + ' ' + this.value);
        if(this.value == modelFrequencyType){
        	this.selected = true;
        }
    });
    $('#frequencyType').niceSelect('update');
    onLoadhideFields();

  }

 
 //what is the use.
 function getComputationSummary( strUrl )
 {
 	
 	strUrl = strUrl + "?&" + csrfTokenName + "=" + csrfTokenValue;
 	var frm = document.getElementById( "frmAgreementSchedule" );
 	
 	frm.action = strUrl;
 	frm.target = "";
 	frm.method = "POST";
 	frm.submit();
 }
 function saveAgreementFrequencySchedule(frmId)
 {
 var frm = document.getElementById( frmId );
	var strUrl = null;
	assignAgreementSchedulingParams();
	enableFileldsToSave();	
	strUrl = 'saveAgreementFrequencySchedule.srvc';
	strUrl = strUrl+"?" + csrfTokenName + "=" + csrfTokenValue ;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
 }
 
 function updateAgreementFrequencySchedule(frmId)
 {
	 var strUrl = null;
	 var frm = document.getElementById( frmId );
	 assignAgreementSchedulingParams();
	 strUrl = 'updateAgreementFrequencySchedule.srvc';
	 strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState )+"&" + csrfTokenName + "=" + csrfTokenValue;
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
function setAgreementFreqType()
{
	agreementFreqType = $( 'input[name="agreementFreqType"]:checked' ).val();
}
function setAgreementFreqRefDay(Freq,gstrRef)
{
	var mapRefSpecificDay = {
	'1' : getLabel('lbl.agreementFrequencyMst.agrmntFreqspecificday.sun','Sunday'),
	'2' : getLabel('lbl.agreementFrequencyMst.agrmntFreqspecificday.mon','Monday'),
	'3' : getLabel('lbl.agreementFrequencyMst.agrmntFreqspecificday.tue','Tuesday'),
	'4' : getLabel('lbl.agreementFrequencyMst.agrmntFreqspecificday.wed','Wednesday'),
	'5' : getLabel('lbl.agreementFrequencyMst.agrmntFreqspecificday.thur','Thursday'),
	'6' : getLabel('lbl.agreementFrequencyMst.agrmntFreqspecificday.fri','Friday'),
	'7' : getLabel('lbl.agreementFrequencyMst.agrmntFreqspecificday.sat','Saturday')
	};
		if (Freq == "S") {
			//$('.period' + strPostFix).html(mapPeriodSpecificDay[gstrPeriod]);
			//$(".refDay" + strPostFix).html(mapRefSpecificDay[gstrRef]);
			//$("#periodHdrInfoSpanDiv").addClass('hidden');
			//$('#refDay'+strPostFix).prev('label').text("Specific Day :");
			
			var arrGstRef = gstrRef.split(',');
			var strRefDay ='';
			if(!isEmpty(arrGstRef)){
				$.each(arrGstRef, function(index, opt) {
					strRefDay  = strRefDay + ''+ mapRefSpecificDay[arrGstRef[index]];
					 if (index < arrGstRef.length - 1) {
						 strRefDay = strRefDay+", ";
					 }
				});
			}
			var strRefDayTooltip = strRefDay;
			if(strRefDay.length > 40)
				strRefDay = strRefDay.substr(0,40) +'...';
		
			$('#agreementFreqDayNmbr').text(strRefDay);
			
		}
}
function setAgreementFreqParamRender( onLoadFlag )
{
	var isVisible = $('#errorDiv').is(':visible');
	// Following If statement will set default Agreement Frequency to EOM.
	if( pageMode == 'ADD' && onLoadFlag == 'Y' && isVisible == false)
	{
		var agreementFreqTypeRadioRef = document.getElementsByName( "agreementFreqType" );

		for( var i = 0 ; i < agreementFreqTypeRadioRef.length ; i++ )
		{
			if( agreementFreqTypeRadioRef[ i ].value == 'M' )
			{
				agreementFreqTypeRadioRef[ i ].checked = true;
				setAgreementFreqType();
			}
		}
	}

	if( agreementFreqType == 'D' )
	{
		$( "#agreementFreqDayPeriod" ).attr( "disabled", false );
		$( "#agreementFreqDayPeriod" ).removeClass( "disabled" );

		if(pageMode != 'ADD' && onLoadFlag == 'Y' )
		{
			document.getElementById( "agreementFreqDayPeriod" ).value = document.getElementById( "agreementFreqPeriod" ).value;
		}
		else
		{
			if(isVisible==true){
				document.getElementById( "agreementFreqDayPeriod" ).value = document.getElementById( "agreementFreqPeriod" ).value;
			}
			else{
			document.getElementById( "agreementFreqDayPeriod" ).value = '1';
			document.getElementById( "agreementFreqWeekPeriod" ).value = '';
			document.getElementById( "agreementFreqMonthPeriod" ).value = '';
			}
		}
		if( (pageMode == 'VIEW' )  && onLoadFlag == 'Y' )
		{
			$( "#agreementFreqDayPeriod" ).attr( "disabled", true );
			$( "#agreementFreqDayPeriod" ).addClass( "disabled" );
		}

		$( "#agreementFreqWeekDayNmbr" ).attr( "disabled", true );
		$( "#agreementFreqWeekDayNmbr" ).addClass( "disabled" );
		$( "#agreementFreqWeekDayNmbr" ).val("");
		
		$( "#agreementFreqWeekPeriod" ).attr( "disabled", true );
		$( "#agreementFreqWeekPeriod" ).addClass( "disabled" );

		$( "#agreementFreqMonthDayNmbr" ).attr( "disabled", true );
		$( "#agreementFreqMonthDayNmbr" ).addClass( "disabled" );
		$( "#agreementFreqMonthDayNmbr" ).val("");
		
		$( "#agreementFreqMonthPeriod" ).attr( "disabled", true );
		$( "#agreementFreqMonthPeriod" ).addClass( "disabled" );
		
		$("#AgrmntFreqTypeSpecificDay").multiselect('destroy');
		$("#AgrmntFreqTypeSpecificDay").attr("disabled",true);
		$("#AgrmntFreqTypeSpecificDay").addClass("disabled");	
		$("#AgrmntFreqTypeSpecificDay").val("");	
	}

	else if( agreementFreqType == 'W' )
	{

		$( "#agreementFreqWeekPeriod" ).attr( "disabled", false );
		$( "#agreementFreqWeekPeriod" ).removeClass( "disabled" );

		$( "#agreementFreqWeekDayNmbr" ).attr( "disabled", false );
		$( "#agreementFreqWeekDayNmbr" ).removeClass( "disabled" );

		if( pageMode != 'ADD' && onLoadFlag == 'Y' )
		{
			document.getElementById( "agreementFreqWeekPeriod" ).value = document.getElementById( "agreementFreqPeriod" ).value;
			document.getElementById( "agreementFreqWeekDayNmbr" ).value = document.getElementById( "agreementFreqDayNmbr" ).value;
		}
		else
		{
			if(isVisible==true){
				document.getElementById( "agreementFreqWeekPeriod" ).value = document.getElementById( "agreementFreqPeriod" ).value;
				document.getElementById( "agreementFreqWeekDayNmbr" ).value = document.getElementById( "agreementFreqDayNmbr" ).value;
			}
			else{
			document.getElementById( "agreementFreqWeekPeriod" ).value = '1';
			document.getElementById( "agreementFreqDayPeriod" ).value = '';
			document.getElementById( "agreementFreqMonthPeriod" ).value = '';
			}
		}
		if( (pageMode == 'PRIOR_EDIT' || pageMode == 'VIEW' )  && onLoadFlag == 'Y' )
		{
			$( "#agreementFreqWeekPeriod" ).attr( "disabled", true );
			$( "#agreementFreqWeekPeriod" ).addClass( "disabled" );

			$( "#agreementFreqWeekDayNmbr" ).attr( "disabled", true );
			$( "#agreementFreqWeekDayNmbr" ).addClass( "disabled" );
		}
		
		$( "#agreementFreqDayPeriod" ).attr( "disabled", true );
		$( "#agreementFreqDayPeriod" ).addClass( "disabled" );

		$( "#agreementFreqMonthDayNmbr" ).attr( "disabled", true );
		$( "#agreementFreqMonthDayNmbr" ).addClass( "disabled" );
		$( "#agreementFreqMonthDayNmbr" ).val("");

		$( "#agreementFreqMonthPeriod" ).attr( "disabled", true );
		$( "#agreementFreqMonthPeriod" ).addClass( "disabled" );
		
		$("#AgrmntFreqTypeSpecificDay").multiselect('destroy');
		$("#AgrmntFreqTypeSpecificDay").attr("disabled",true);
		$("#AgrmntFreqTypeSpecificDay").addClass("disabled");	
		$("#AgrmntFreqTypeSpecificDay").val("");		
	}
	else if( agreementFreqType == 'M' )
	{
		$( "#agreementFreqMonthDayNmbr" ).attr( "disabled", false );
		$( "#agreementFreqMonthDayNmbr" ).removeClass( "disabled" );

		$( "#agreementFreqMonthPeriod" ).attr( "disabled", false );
		$( "#agreementFreqMonthPeriod" ).removeClass( "disabled" );

		if( pageMode == 'ADD' && onLoadFlag == 'Y' && isVisible == false)
		{
			document.getElementById( "agreementFreqMonthPeriod" ).value = 1;
			document.getElementById( "agreementFreqMonthDayNmbr" ).value = -1;
		}
		else
		{
			document.getElementById( "agreementFreqMonthPeriod" ).value = '1';
			document.getElementById( "agreementFreqDayPeriod" ).value = '';
			document.getElementById( "agreementFreqWeekPeriod" ).value = '';
		}
		if( pageMode != 'ADD' && onLoadFlag == 'Y' )
		{
			document.getElementById( "agreementFreqMonthPeriod" ).value = document.getElementById( "agreementFreqPeriod" ).value;
			document.getElementById( "agreementFreqMonthDayNmbr" ).value = document.getElementById( "agreementFreqDayNmbr" ).value;
		}
		if( (pageMode == 'PRIOR_EDIT' || pageMode == 'VIEW' )  && onLoadFlag == 'Y' )
		{
			$( "#agreementFreqMonthPeriod" ).attr( "disabled", true );
			$( "#agreementFreqMonthPeriod" ).addClass( "disabled" );

			$( "#agreementFreqMonthDayNmbr" ).attr( "disabled", true );
			$( "#agreementFreqMonthDayNmbr" ).addClass( "disabled" );
		}

		$( "#agreementFreqDayPeriod" ).attr( "disabled", true );
		$( "#agreementFreqDayPeriod" ).addClass( "disabled" );

		$( "#agreementFreqWeekDayNmbr" ).attr( "disabled", true );
		$( "#agreementFreqWeekDayNmbr" ).addClass( "disabled" );
		$( "#agreementFreqWeekDayNmbr" ).val("");
		
		$( "#agreementFreqWeekPeriod" ).attr( "disabled", true );
		$( "#agreementFreqWeekPeriod" ).addClass( "disabled" );
		
		$("#AgrmntFreqTypeSpecificDay").multiselect('destroy');
		$("#AgrmntFreqTypeSpecificDay").attr("disabled",true);
		$("#AgrmntFreqTypeSpecificDay").addClass("disabled");	
		$("#AgrmntFreqTypeSpecificDay").val("");		
	}
	else if( agreementFreqType == 'S' ){
		$( "#agreementFreqDayPeriod" ).attr( "disabled", true );
		$( "#agreementFreqDayPeriod" ).addClass( "disabled" );
	
		$( "#agreementFreqMonthDayNmbr" ).attr( "disabled", true );
		$( "#agreementFreqMonthDayNmbr" ).addClass( "disabled" );
		$( "#agreementFreqMonthDayNmbr" ).val("");

		$( "#agreementFreqMonthPeriod" ).attr( "disabled", true );
		$( "#agreementFreqMonthPeriod" ).addClass( "disabled" );		

		$( "#agreementFreqWeekDayNmbr" ).attr( "disabled", true );
		$( "#agreementFreqWeekDayNmbr" ).addClass( "disabled" );
		$( "#agreementFreqWeekDayNmbr" ).val("");
		
		$( "#agreementFreqWeekPeriod" ).attr( "disabled", true );
		$( "#agreementFreqWeekPeriod" ).addClass( "disabled" );		
		
		$("#AgrmntFreqTypeSpecificDay").attr("disabled",false);
		$("#AgrmntFreqTypeSpecificDay").removeClass("disabled");
		document.getElementById( "AgrmntFreqTypeSpecificDay" ).value = 1;
		populateMultiSelect();
	}
	$( '#agreementFreqWeekDayNmbr').niceSelect('update');
	$( '#agreementFreqMonthDayNmbr').niceSelect('update');
	$( '#AgrmntFreqTypeSpecificDay').niceSelect('update');
}

function setDirtyBit()
{
	document.getElementById( "dirtyBit" ).value = '1';
}
function assignAgreementSchedulingParams()
{
	if( agreementFreqType == 'D' )
	{
		document.getElementById( "agreementFreqPeriod" ).value = document.getElementById( "agreementFreqDayPeriod" ).value;
		document.getElementById( "agreementFreqDayNmbr" ).value = "";
	}
	else if( agreementFreqType == 'W' )
	{
		document.getElementById( "agreementFreqPeriod" ).value = document.getElementById( "agreementFreqWeekPeriod" ).value;
		document.getElementById( "agreementFreqDayNmbr" ).value = document.getElementById( "agreementFreqWeekDayNmbr" ).value;
	}
	else if( agreementFreqType == 'M' )
	{
		document.getElementById( "agreementFreqPeriod" ).value = document.getElementById( "agreementFreqMonthPeriod" ).value;
		document.getElementById( "agreementFreqDayNmbr" ).value = document.getElementById( "agreementFreqMonthDayNmbr" ).value;
	}
	else if( agreementFreqType == 'S' )
	{
		document.getElementById( "agreementFreqDayNmbr" ).value = $('#AgrmntFreqTypeSpecificDay').getMultiSelectValueString();
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

function handleHolidayRescheduling () {
	var agrFreqType = $( 'input[name="agreementFreqType"]:checked' ).val();
	var agrmntFreqDayPeriod = $('#agreementFreqDayPeriod').val();
	$('#frequencyHolidayReSched').empty();
	
	$('#frequencyHolidayReSched').append('<option value="S">'+getLabel('lbl.agreementReschedule.S','Skip')+'</option>');
	if (agrFreqType != 'D' || (agrFreqType == 'D' && agrmntFreqDayPeriod > 1 )) {
		$('#frequencyHolidayReSched').attr("disabled",false);
		$('#frequencyHolidayReSched').append(
				'<option value="A">'+getLabel("lbl.agreementReschedule.A","Prev Business Day")+'</option>');
		$('#frequencyHolidayReSched').append(
				'<option value="P">'+getLabel("lbl.agreementReschedule.P","Next Business Day")+'</option>');
	}
	else if (agrFreqType == 'D' && agrmntFreqDayPeriod == 1){
		$('#frequencyHolidayReSched').attr("disabled",true);
	}
	$('#frequencyHolidayReSched').trigger("chosen:updated");
	$("#frequencyHolidayReSched > option").each(function() {
        if(this.value == modelfreqHolidayReSchedFlag){
        	this.selected = true;
        }
    });
	 $('#frequencyHolidayReSched').niceSelect('update');
}

var globalTabId;

function closeConfirmPopup()
{
	$('#confirmPopup').dialog("close");
}

function showConfirmPopup(tabId)
{
	globalTabId = tabId ;
	var recordKeNo = document.getElementById('txtRecordKeyNo').value
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
	else
	{
		
	}
	
}

function goToNextpage()
{
	var frm = document.getElementById('frmMain');
	frm.action = globalStrUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit(); 
}

function updateAndSubmitAgreementFrequencySchedule(frmId)
{
	var frm = document.getElementById( frmId );
	var strUrl = null;
	assignAgreementSchedulingParams();
	enableFileldsToSave();
	strUrl = 'updateAndSubmitAgreementFrequencySchedule.srvc';
	strUrl = strUrl+"?$viewState=" + encodeURIComponent( viewState )+"&"+csrfTokenName+"="+csrfTokenValue;	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function setReferenceTime(me) {
	var referenceTimeList = document.getElementById("bankFrequencyCode");
	var selectedFrequencyCode = referenceTimeList.options[referenceTimeList.selectedIndex].value;
	$('#frequencyCode').val(referenceTimeList.options[referenceTimeList.selectedIndex].value);
	if(referenceTimeList.options[referenceTimeList.selectedIndex].value == '-1'){
		$('#bankReferenceTimeDesc').val('');	
	}
	else{
	$('#bankReferenceTimeDesc').val(referenceTimeList.options[referenceTimeList.selectedIndex].text);
	}
	handleHolidayRescheduling();
	
}

function setBalanceType(selectedFrequencyCode) {
	if(null!= selectedFrequencyCode || "" != selectedFrequencyCode ) {
	if(selectedFrequencyCode == "EOD") {		
		 $('#eodBalanceFlag').empty(); //remove all child nodes
		 $('#eodBalanceFlag').append('<option value="B">Book</option>');
	     $('#eodBalanceFlag').trigger("chosen:updated");		
	}
	else {
		 $('#eodBalanceFlag').empty(); //remove all child nodes
		 $('#eodBalanceFlag').append('<option value="Y">Book</option>');
		 $('#eodBalanceFlag').append('<option value="N">Available</option>');
	     $('#eodBalanceFlag').trigger("chosen:updated");		
	}
	}
	else {
		 $('#eodBalanceFlag').empty(); //remove all child nodes
		 $('#eodBalanceFlag').append('<option value="Y">Book</option>');
		 $('#eodBalanceFlag').append('<option value="N">Available</option>');
	     $('#eodBalanceFlag').trigger("chosen:updated");		
	}
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

function getDiscardConfirmPopUp(strUrl) {
	$('#cancelDiscardConfirmMsg').bind('click', function() {
		$('#discardMsgPopup').dialog('close');
	});
	$('#doneConfirmDiscardbutton').bind('click', function() {
		$(this).dialog('close');
		goToPage(strUrl);
	});
	$('#discardMsgPopup').dialog({
		autoOpen : false,
		maxHeight : 550,
		width : 400,
		modal : true,
		resizable : false,
		draggable : false
	});
	$('#discardMsgPopup').dialog('open');
	$('#textContent').focus();
}

function goToPage(strUrl) {
    //handleAutonumericvalues();
	var frm = document.getElementById('frmMain');
	$('#agreementName').attr('disabled', false);
	$('#agreementFreqDayPeriod').attr('disabled', false);
	$('#agreementFreqWeekPeriod').attr('disabled', false);
	$('#agreementFreqWeekDayNmbr').attr('disabled', false);
	$('#agreementFreqMonthPeriod').attr('disabled', false);
	$('#agreementFreqMonthDayNmbr').attr('disabled', false);
	$("#AgrmntFreqTypeSpecificDay").attr('disabled', false);
	$("#bankFrequencyCode").attr( "disabled", false );
	$('#nxtExecutionDate').attr('disabled', false);
	$('#frequencyType').attr('disabled', false);
	$('#sellerId').removeAttr('disabled');
	assignAgreementSchedulingParams();
	frm.action = strUrl;
	frm.target = '';
	frm.method = 'POST';
	frm.submit();
}

function showSummary(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function submitForm(strUrl)
{
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function populateMultiSelect()
{
	$("#AgrmntFreqTypeSpecificDay").niceSelect('destroy');

	if (pageMode != 'VIEW' && pageMode != 'VERIFY'){
		$("#AgrmntFreqTypeSpecificDay").multiselect('destroy');
		$('#AgrmntFreqTypeSpecificDay').multiselect(
				{	
					click: function(event, ui)
					{
						var specificDayvalue = $('#AgrmntFreqTypeSpecificDay').getMultiSelectValue();
					}
				});
		$("#AgrmntFreqTypeSpecificDay").multiselect('refresh');
		$('#AgrmntFreqTypeSpecificDay').multiselect("widget").find(":checkbox").each(function() 
				{
			$(this).attr("checked", false);
				});
		
		if (agreementFreqDayNmbr.length > 1){
			$.each(agreementFreqDayNmbr.split(","), function(i , e)
					{
				$("#AgrmntFreqTypeSpecificDay option[value='" + e + "']").attr("selected", "selected");
				$('#AgrmntFreqTypeSpecificDay').multiselect("widget").find(":checkbox").each(function() 
						{
					if ($(this).val() === e) 
					{
						$(this).attr("checked", true);
					}
						});			
					});
			$("#AgrmntFreqTypeSpecificDay option[value='" + agreementFreqDayNmbr + "']").attr("selected", "selected");
		}else{
			$("#AgrmntFreqTypeSpecificDay").multiselect("widget").find(":checkbox[value='1']").attr("checked","checked");
			var specificDayvalue = $('#AgrmntFreqTypeSpecificDay').getMultiSelectValue();
		}
		$('#AgrmntFreqTypeSpecificDay').addClass( 'form-control jq-multiselect' );
	}else{
		if (agreementFreqDayNmbr.length > 1){
			$.each(agreementFreqDayNmbr.split(","), function(i , e)
					{
				$("#AgrmntFreqTypeSpecificDay option[value='" + e + "']").attr("selected", "selected");
					});
			$("#AgrmntFreqTypeSpecificDay option[value='" + agreementFreqDayNmbr + "']").attr("selected", "selected");
		}else{
			$("#AgrmntFreqTypeSpecificDay option[value='" + agreementFreqDayNmbr + "']").attr("selected", "selected");
		}
	}
}
