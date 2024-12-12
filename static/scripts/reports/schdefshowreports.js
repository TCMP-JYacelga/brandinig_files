var frequencyBasis = null ;
var frequencyType = null ;
var pageMode = null;
function showBack( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function showList( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.elements[ 'reportCode' ].value = document.getElementById( "schReport" ).value;
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showAddNewForm( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	if( document.getElementById( "schReport" ).value == "ALL" )
	{
		$( '#OKDialog' ).dialog(
		{
			autoOpen : false,
			width : 400,
			title : 'Schedule Definition',
			modal : true,
			position : 'top'
		} );
		$( '#dialogMode' ).val( '1' );
		$( '#OKDialog' ).dialog( 'open' );
	}
	else
	{
		frm.elements[ 'reportCode' ].value = document.getElementById( "schReport" ).value;
		frm.target = "";
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
	}
}

function showNewForm( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.elements[ 'reportCode' ].value = document.getElementById( "schReport" ).value;
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function reloadForm()
{
	var frm = document.forms[ "frmMain" ];
	frm.elements[ 'reportCode' ].value = document.getElementById( "schReport" ).value;
	var strMode = frm.elements[ 'mode' ].value;
	if( strMode == 'edit' )
		strUrl = "editScheduleReport.srvc";
	else
		strUrl = "addScheduleDefination.srvc";
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function cancelOK()
{
	$( '#OKDialog' ).dialog( 'close' );
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = "";
}

function discardRecord( strUrl, index )
{
	var frm = document.forms[ "frmMain" ];
	$( '#DiscardDialog' ).dialog(
	{
		autoOpen : false,
		width : 400,
		title : 'Schedule Definition',
		modal : true,
		position : 'top'
	} );
	$( '#dialogMode' ).val( '1' );
	$( '#DiscardDialog' ).dialog( 'open' );
	document.getElementById( "txtIndex" ).value = index;
}

function discard()
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = 'undoSchDef.form';
	frm.method = "POST";
	frm.submit();
}

function cancelDiscard()
{
	$( '#DiscardDialog' ).dialog( 'close' );
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = "";
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
}

function showViewForm( index, mode )
{
	var frm = document.forms[ "frmMain" ];
	var strUrl = null;
	document.getElementById( "txtIndex" ).value = index;
	frm.target = "";
	strUrl = "viewSchDef.form";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showEditForm( strUrl, index )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	document.getElementById( "txtIndex" ).value = index;
	document.getElementById( "txtCurrent" ).value = '';
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord( strUrl, index )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	document.getElementById( "txtIndex" ).value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function disableRecord( strUrl, index )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	document.getElementById( "txtIndex" ).value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function acceptRecord( strUrl, index )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	document.getElementById( "txtIndex" ).value = index;
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function rejectRecord( arrData, strRemarks )
{
	var frm = document.forms[ "frmMain" ];
	if( strRemarks.length > 255 )
	{
		alert( "Reject Remarks Length Cannot Be Greater than 255 Characters!" );
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.txtIndex.value = arrData[ 0 ];
		frm.target = "";
		frm.action = "rejectSchDef.form";
		frm.method = 'POST';
		frm.submit();
	}
}

// List navigation
function prevPage( strUrl, intPg )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	document.getElementById( "txtCurrent" ).value = intPg;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function nextPage( strUrl, intPg )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	document.getElementById( "txtCurrent" ).value = intPg;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
// Details
function deleteDetail( strUrl, index )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	document.getElementById( "txtIndex" ).value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm( strUrl, index )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	document.getElementById( "txtIndex" ).value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm( strUrl, index )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	document.getElementById( "txtIndex" ).value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showAddDetail( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showListEntry( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	if( document.getElementById( "drawerCode" ) != null )
	{
		document.getElementById( "drawerCode" ).value = '';
	}
	document.getElementById( "drawerDesc" ).value = '';
	document.getElementById( "txtCurrent" ).value = '';
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function filter( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.elements[ 'reportCode' ].value = document.getElementById( "schSrcName" ).value;
	
	if($('#schFreqReftTypeSpecificDay'))
	{
		var multiSelectValues = $('#schFreqReftTypeSpecificDay').getMultiSelectValue().join(",");
		var obj  = document.getElementById( "schFreqReftTypeSpecificDay" );
		obj.parentNode.removeChild(obj);
		frm.appendChild(createFormField('INPUT', 'HIDDEN', 'schFreqReftTypeSpecificDay', multiSelectValues));
	}
	enableFileldsToSave();
	$('.jq-multiselect').each(function(i , element){
		if( $('#'+element.id).length > 0 )
		{
			multiValue = '';
			var elementName = "reportParameterBean";
			index = element.id.substr(elementName.length, element.id.length);
			document.getElementById(elementName+"["+index+"].value").value = '';
			var checkedItems = $("#"+element.id).multiselect("getChecked");
			var allItems = $("#"+element.id).multiselect("getAllItems");
			if( allItems.length != checkedItems.length )
			{
				$("#"+element.id).multiselect("getChecked").map(function()
				{
					if(multiValue == '') multiValue = this.value;
					else
						multiValue = multiValue+","+ this.value;
				});
				document.getElementById(elementName+"["+index+"].value").value = multiValue;
			}
			else
			{
				document.getElementById(elementName+"["+index+"].value").value = "(ALL)";
			}
		}
	});
	$('form').find('.amountBox').each(function(){
       var self=$(this);
       var selfValue = self.autoNumeric('get');
       self.val(selfValue);
	});
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function enableFileldsToSave()
{
	$( "#frmMain" ).find( 'input' ).addClass( "enabled" );
	$( "#frmMain" ).find( 'input' ).attr( "disabled", false );
	$( "#frmMain" ).find( 'select' ).addClass( "enabled" );
	$( "#frmMain" ).find( 'select' ).attr( "disabled", false );
}
function setRepeatEveryAndREFTTypeValue()
{
	var freqType = $('input[name="schFreqType"]:checked').val();
	
	if(freqType == 'D')
	{
		document.getElementById( "schFreqReftIterate" ).value = document.getElementById( "schFreqReftIterateDay" ).value ;
	}
	else if(freqType == 'W')
	{
		document.getElementById( "schFreqReftIterate" ).value = document.getElementById( "schFreqReftIterateWeek" ).value ;
		document.getElementById( "schFreqReftType" ).value = document.getElementById( "schFreqReftTypeWeek" ).value ;
	}
	else if(freqType == 'M')
	{
		document.getElementById( "schFreqReftIterate" ).value = document.getElementById( "schFreqReftIterateMonth" ).value ;
		document.getElementById( "schFreqReftType" ).value = document.getElementById( "schFreqReftTypeMonth" ).value ;
	}
	else if(freqType == 'SD')
	{
		document.getElementById( "schFreqReftIterate" ).value = document.getElementById( "schFreqReftIterateSpecificDay" ).value;
	}
}
function populateState( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function populateGenDate()
{
	var startDate = document.getElementById( "schStartDate" ).value;
	document.getElementById( "schNextGenDate" ).value = startDate;
	document.getElementById( "schPrevGenDate" ).value = startDate;
}

function saveDetail( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function updateDetail( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function saveHeader( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

var gstrPeriod, gstrRef, gstrFreq;
var PeriodWeekArray = new Array( "('Weekly',0)", "('Every 2nd Week',1)", "('Every 3rd Week',2)", "('Every 4th Week',3)" );
var MonthlyPeriodArray = new Array( "('Monthly',0)", "('Every 2nd Month',1)", "('Every 3rd Month',2)",
	"('Every 4th Month',3)", "('Every 5th Month',4)", "('Every 6th Month',5)", "('Every 7th Month',6)",
	"('Every 8th Month',7)", "('Every 9th Month',8)", "('Every 10th Month',9)", "('Every 11th Month',10)",
	"('Every 12th Month',11)" );
var DailyPeriodArray = new Array( "('Everyday',0)", "('Every 2nd Day',1)", "('Every 3rd Day',2)", "('Every 4th Day',3)",
	"('Every 5th Day',4)", "('Every 6th Day',5)", "('Every 7th Day',6)" );
var RefMonArray = new Array(  "('End Of Month','EOM')", "('1',1)", "('2',2)", "('3',3)", "('4',4)", "('5',5)", "('6',6)", "('7',7)", "('8',8)",
	"('9',9)", "('10',10)", "('11',11)", "('12',12)", "('13',13)", "('14',14)", "('15',15)", "('16',16)", "('17',17)",
	"('18',18)", "('19',19)", "('20',20)", "('21',21)", "('22',22)", "('23',23)", "('24',24)", "('25',25)", "('26',26)",
	"('27',27)", "('28',28)", "('29',29)", "('30',30)", "('31',31)" );
var RefDay = new Array( "('N/A',0)" );
var RefWeekDay = new Array( "('Sunday',1)", "('Monday',2)", "('Tuesday',3)", "('Wednesday',4)", "('Thursday',5)", "('Friday',6)",
	"('Saturday',7)" );

function GetPeriod()
{
	var i, intDay, intMonth, intclear, intPeriod;
	var Freq = document.getElementById( "schType" ).value;
	var gstrPeriod = document.getElementById( "schPeriod" ).value;
	var gstrRef = document.getElementById( "schRefNmbr" ).value;

	document.getElementById( "schPeriod" ).length = 0;
	document.getElementById( "schRefNmbr" ).length = 0;
	if( Freq == "" )
		return false;
	if( Freq == "W" )
	{
		for( var i = 0 ; i < PeriodWeekArray.length ; i++ )
		{
			eval( "document.getElementById('schPeriod').options[i]=" + "new Option" + PeriodWeekArray[ i ] );
			if( i == gstrPeriod )
				document.getElementById( "schPeriod" ).options[ i ].selected = true;
		}

		for( var i = 0 ; i < RefWeekDay.length ; i++ )
		{
			eval( "document.getElementById('schRefNmbr').options[i]=" + "new Option" + RefWeekDay[ i ] );
			if( i == gstrRef )
				document.getElementById( "schRefNmbr" ).options[ i ].selected = true;
		}
	}
	else
	{
		intPeriod = 7;
		if( Freq == "M" )
		{
			intPeriod = MonthlyPeriodArray.length;
			for( var i = 0 ; i < intPeriod ; i++ )
			{
				eval( "document.getElementById('schPeriod').options[i]=" + "new Option" + MonthlyPeriodArray[ i ] );
				if( i == gstrPeriod )
					document.getElementById( "schPeriod" ).options[ i ].selected = true;

			}
		}
		if( Freq == "M" )
			for( var i = 0 ; i < RefMonArray.length ; i++ )
			{
				eval( "document.getElementById('schRefNmbr').options[i]=" + "new Option" + RefMonArray[ i ] );
				if( i == gstrRef )
					document.getElementById( "schRefNmbr" ).options[ i ].selected = true;
			}
		if( Freq == "D" )
		{
			for( var i = 0 ; i < intPeriod ; i++ )
			{
				eval( "document.getElementById('schPeriod').options[i]=" + "new Option" + DailyPeriodArray[ i ] );
				if( i == gstrPeriod )
					document.getElementById( "schPeriod" ).options[ i ].selected = true;

			}
			for( var i = 0 ; i < RefDay.length ; i++ )
			{
				eval( "document.getElementById('schRefNmbr').options[i]=" + "new Option" + RefDay[ i ] );
				if( i == gstrRef )
					document.getElementById( "schRefNmbr" ).options[ i ].selected = true;
			}
		}
	}
}

function getRecord( json, elementId )
{
	var myJSONObject = JSON.parse( json );
	var inputIdArray = elementId.split( "|" );
	for( i = 0 ; i < inputIdArray.length ; i++ )
	{
		var field = inputIdArray[ i ];
		if( document.getElementById( inputIdArray[ i ] ) && myJSONObject.columns[ i ] )
		{
			var type = document.getElementById( inputIdArray[ i ] ).type;
			if( type == 'text' )
			{
				document.getElementById( inputIdArray[ i ] ).value = myJSONObject.columns[ i ].value;
			}
			else
			{
				document.getElementById( inputIdArray[ i ] ).innerHTML = myJSONObject.columns[ i ].value;
			}
		}
	}
}
function getClientCode( sellerCode )
{
	var strData = {};
	var opt;
	var strUrl = 'getClientCode.srvc?' + csrfTokenName + "=" + csrfTokenValue + "&$sellerCode=" + sellerCode.value;
	$.ajax(
	{
		url : strUrl,
		type : "POST",
		context : this,
		error : function()
		{
		},
		dataType : 'json',
		data : strData,
		success : function( response )
		{
			$( '#clientCode' ).empty();
			for( var i = 0 ; i < response.length ; i++ )
			{
				opt = document.createElement( "option" );
				document.getElementById( "clientCode" ).options.add( opt );
				opt.text = response[ i ].DESCRIPTION;
				opt.value = response[ i ].CODE;
			}
		}
	} );
}
function showHideOutputType( element )
{
	if( element == 'R' )
	{
		document.getElementById( "lblOutput" ).style.display = "block";
		document.getElementById( "lblschReport" ).innerHTML = "Report Name";
		document.getElementById( "schRdOutput" ).style.display = "block";
	}
	else
	{
		document.getElementById( "lblOutput" ).style.display = "none";
		document.getElementById( "lblschReport" ).innerHTML = "Upload Name";
		document.getElementById( "schRdOutput" ).style.display = "none";

	}
}
function setFrequencyAttributes( frequencyType )
{
	if(pageMode != 'view' && pageMode != 'edit' )
	{
		$( 'input[name=schFreqType]' ).attr( "disabled", false );
	}
	if( frequencyType === 'D' )
	{
		$('#evrDay').addClass('required');
		$('#evrWeek').removeClass('required');
		$('#evrMonth').removeClass('required');
		$('#specificDay').removeClass('required');
		var ctrl = $( '#schFreqReftTypeSpecificDay' );
		$("#schFreqReftTypeSpecificDay").multiselect('uncheckAll');
		try{
			if($("#schFreqReftTypeSpecificDay")[0][0].value == '0'){
				$("#schFreqReftTypeSpecificDay")[0].options[$("#schFreqReftTypeSpecificDay")[0].selectedIndex] = null;
			}
			var option = document.createElement("option");
			  option.text = "Select Options";
			  option.value = "0";
			  option.selected = "selected";
			  ctrl[0].add(option, ctrl[0][0]);		
		}catch(err){}
		ctrl.multiselect("destroy");
		//ctrl.niceSelect('destroy');
		if(pageMode != 'view' && pageMode != 'edit' )
		{
			$("#schFreqReftIterateDay").attr("disabled",false);
			$("#schFreqReftIterateDay").removeClass("disabled");
		}
		else
		{
			$("#schFreqReftIterateDay").attr("disabled",true);
			$("#schFreqReftIterateDay").addClass("disabled");
		}
		$("#schFreqReftIterateSpecificDay").attr("disabled",true);
		$("#schFreqReftIterateSpecificDay").addClass("disabled");
		$("#schFreqReftTypeSpecificDay").attr("disabled",true);
		$("#schFreqReftTypeSpecificDay").addClass("disabled");
		$("#schFreqReftIterateWeek").attr("disabled",true);
		$("#schFreqReftIterateWeek").addClass("disabled");
		$("#schFreqReftTypeWeek").val('');
		$("#schFreqReftTypeWeek").attr("disabled",true);
		$("#schFreqReftTypeWeek").addClass("disabled");
		$("#schFreqReftTypeWeek").niceSelect('update');
		$("#schFreqReftIterateMonth").attr("disabled",true);
		$("#schFreqReftIterateMonth").addClass("disabled");
		$("#schFreqReftTypeSpecificDay").multiselect('destroy');
		$("#schFreqReftIterateSpecificDay").attr("disabled",true);
		$("#schFreqReftIterateSpecificDay").addClass("disabled");
		$("#schFreqReftTypeSpecificDay").multiselect('destroy');
		$("#schFreqReftTypeSpecificDay").attr("disabled",true);
		$("#schFreqReftTypeSpecificDay").addClass("disabled");
		//$( '#schFreqReftTypeSpecificDay' ).addClass( 'form-control jq-multiselect' );
		//$( '#schFreqReftTypeSpecificDay' ).attr('multiple', true);
		//$("#schFreqReftTypeSpecificDay").multiselect();
		
		$("#schFreqReftTypeMonth").val('');
		$("#schFreqReftTypeMonth").attr("disabled",true);
		$("#schFreqReftTypeMonth").addClass("disabled");
		$("#schFreqReftTypeMonth").niceSelect('update');
		document.getElementById( "schFreqReftIterateDay" ).value = dailyFrequencyReftIterate;
		$('#schFreqReftIterateMonth').val("");
		$("#schFreqReftIterateWeek").val("");
		$('#schFreqReftIterateSpecificDay').val("");
		$('#schFreqReftTypeWeek').val("");
		$('#schFreqReftTypeMonth').val("");
		specificFrequencyReftIterate=0;
		specificFrequencyReftType='';
		monthFrequencyReftIterate = 1;
		weekFrequencyReftIterate = 1;
		monthFrequencyReftType = 0;
		weekFrequencyReftType = 0;
		removeMarkRequired('#schFreqReftIterateWeek');
	}
	else if(frequencyType === 'W')
	{
		$('#evrWeek').addClass('required');
		$('#evrDay').removeClass('required');
		$('#evrMonth').removeClass('required');
		$('#specificDay').removeClass('required');
		var ctrl = $( '#schFreqReftTypeSpecificDay' );
		$("#schFreqReftTypeSpecificDay").multiselect('uncheckAll');
		try{
			if($("#schFreqReftTypeSpecificDay")[0][0].value == '0'){
				$("#schFreqReftTypeSpecificDay")[0].options[$("#schFreqReftTypeSpecificDay")[0].selectedIndex] = null;
			}
			var option = document.createElement("option");
			  option.text = "Select Options";
			  option.value = "0";
			  option.selected = "selected";
			  ctrl[0].add(option, ctrl[0][0]);
			}catch(err){}
		ctrl.multiselect("destroy");
		if(pageMode != 'view' && pageMode != 'edit' )
		{
			$("#schFreqReftIterateWeek").attr("disabled",false);
			$("#schFreqReftIterateWeek").removeClass("disabled");
			$("#schFreqReftTypeWeek").attr("disabled",false);
			$("#schFreqReftTypeWeek").removeClass("disabled");
			makeNiceSelect('schFreqReftTypeWeek',true);
		}
		else
		{
			$("#schFreqReftIterateWeek").attr("disabled",true);
			$("#schFreqReftIterateWeek").addClass("disabled");
			$("#schFreqReftTypeWeek").val('');
			$("#schFreqReftTypeWeek").attr("disabled",true);
			$("#schFreqReftTypeWeek").addClass("disabled");
			$("#schFreqReftTypeWeek").niceSelect('update');
		}
		$("#schFreqReftIterateSpecificDay").attr("disabled",true);
		$("#schFreqReftIterateSpecificDay").addClass("disabled");
		$("#schFreqReftTypeSpecificDay").attr("disabled",true);
		$("#schFreqReftTypeSpecificDay").addClass("disabled");
		$("#schFreqReftIterateDay").attr("disabled",true);
		$("#schFreqReftIterateDay").addClass("disabled");
		$("#schFreqReftIterateMonth").attr("disabled",true);
		$("#schFreqReftIterateMonth").addClass("disabled");
		$("#schFreqReftTypeSpecificDay").multiselect('destroy');
		$("#schFreqReftIterateSpecificDay").attr("disabled",true);
		$("#schFreqReftIterateSpecificDay").addClass("disabled");
		$("#schFreqReftTypeSpecificDay").multiselect('destroy');
		$("#schFreqReftTypeSpecificDay").attr("disabled",true);
		$("#schFreqReftTypeSpecificDay").addClass("disabled");
		$("#schFreqReftTypeMonth").val('');
		$("#schFreqReftTypeMonth").attr("disabled",true);
		$("#schFreqReftTypeMonth").addClass("disabled");
		$("#schFreqReftTypeMonth").niceSelect('update');
		document.getElementById( "schFreqReftIterateWeek" ).value = weekFrequencyReftIterate;
		document.getElementById( "schFreqReftTypeWeek" ).value = weekFrequencyReftType;
		$('#schFreqReftIterateMonth').val("");
		$('#schFreqReftIterateDay').val("");
		$('#schFreqReftIterateSpecificDay').val("");
		$('#schFreqReftTypeMonth').val("");
		$('#schFreqReftTypeSpecificDay').val("");
		specificFrequencyReftIterate=0;
		specificFrequencyReftType='';
		dailyFrequencyReftIterate = 1;
		monthFrequencyReftIterate = 1;
		monthFrequencyReftType = 0;
		removeMarkRequired('#schFreqReftIterateDay');
	}
	else if(frequencyType === 'M')
	{
		$('#evrMonth').addClass('required');
		$('#evrDay').removeClass('required');
		$('#evrWeek').removeClass('required');
		$('#specificDay').removeClass('required');
		var ctrl = $( '#schFreqReftTypeSpecificDay' );
		$("#schFreqReftTypeSpecificDay").multiselect('uncheckAll');
		try{
			if($("#schFreqReftTypeSpecificDay")[0][0].value == '0'){
				$("#schFreqReftTypeSpecificDay")[0].options[$("#schFreqReftTypeSpecificDay")[0].selectedIndex] = null;
			}
			var option = document.createElement("option");
			  option.text = "Select Options";
			  option.value = "0";
			  option.selected = "selected";
			  ctrl[0].add(option, ctrl[0][0]);
			}catch(err){}
		ctrl.multiselect("destroy");
		if(pageMode != 'view' && pageMode != 'edit' )
		{
			$("#schFreqReftIterateMonth").attr("disabled",false);
			$("#schFreqReftIterateMonth").removeClass("disabled");
			$("#schFreqReftTypeMonth").attr("disabled",false);
			$("#schFreqReftTypeMonth").removeClass("disabled");
			$("#schFreqReftTypeMonth").niceSelect('update');
			makeNiceSelect("schFreqReftTypeMonth", true);
		}
		else
		{
			$("#schFreqReftIterateMonth").attr("disabled",true);
			$("#schFreqReftIterateMonth").addClass("disabled");
			$("#schFreqReftTypeMonth").val('');
			$("#schFreqReftTypeMonth").attr("disabled",true);
			$("#schFreqReftTypeMonth").addClass("disabled");
			$("#schFreqReftTypeMonth").niceSelect('update');
		}
		$("#schFreqReftTypeSpecificDay").multiselect('destroy');
		$("#schFreqReftIterateSpecificDay").attr("disabled",true);
		$("#schFreqReftIterateSpecificDay").addClass("disabled");
		$("#schFreqReftTypeSpecificDay").attr("disabled",true);
		$("#schFreqReftTypeSpecificDay").addClass("disabled");
		$("#schFreqReftIterateDay").attr("disabled",true);
		$("#schFreqReftIterateDay").addClass("disabled");
		$("#schFreqReftIterateWeek").attr("disabled",true);
		$("#schFreqReftIterateWeek").addClass("disabled");
		$("#schFreqReftTypeWeek").val('');
		unbindMarkRemoveRequired('schFreqReftTypeWeek-niceSelect');
		$("#schFreqReftTypeWeek").attr("disabled",true);
		$("#schFreqReftTypeWeek").addClass("disabled");
		$("#schFreqReftTypeWeek").niceSelect('update');
		document.getElementById( "schFreqReftIterateMonth" ).value = monthFrequencyReftIterate;
		document.getElementById( "schFreqReftTypeMonth" ).value = monthFrequencyReftType;
		$("#schFreqReftIterateWeek").val("");
		$('#schFreqReftIterateDay').val("");
		$('#schFreqReftIterateSpecificDay').val("");
		$('#schFreqReftTypeWeek').val("");
		$('#schFreqReftTypeSpecificDay').val("");
		specificFrequencyReftIterate=0;
		specificFrequencyReftType='';
		dailyFrequencyReftIterate = 1;
		weekFrequencyReftIterate = 1;
		weekFrequencyReftType = 0;
		removeMarkRequired('#schFreqReftIterateWeek');
		removeMarkRequired('#schFreqReftIterateDay');
	}
	else if( frequencyType === 'SD' )
	{
		try{
			if($("#schFreqReftTypeSpecificDay")[0][0].value == '0'){
				$("#schFreqReftTypeSpecificDay")[0].options[$("#schFreqReftTypeSpecificDay")[0].selectedIndex] = null;
			}
		}catch(err){}
		$('#specificDay').addClass('required');	
		$('#evrMonth').removeClass('required');
		$('#evrDay').removeClass('required');
		$('#evrWeek').removeClass('required');

		if(pageMode != 'view' && pageMode != 'edit' )
		{
			$("#schFreqReftIterateSpecificDay").attr("disabled",false);
			$("#schFreqReftIterateSpecificDay").removeClass("disabled");
			$("#schFreqReftTypeSpecificDay").attr("disabled",false);
			$("#schFreqReftTypeSpecificDay").removeClass("disabled");
		}
		else
		{
			$("#schFreqReftIterateSpecificDay").attr("disabled",true);
			$("#schFreqReftIterateSpecificDay").addClass("disabled");
			$("#schFreqReftTypeSpecificDay").attr("disabled",true);
			$("#schFreqReftTypeSpecificDay").addClass("disabled");
		}
		
		$("#schFreqReftIterateMonth").attr("disabled",true);
		$("#schFreqReftIterateMonth").addClass("disabled");
		
		$("#schFreqReftIterateDay").attr("disabled",true);
		$("#schFreqReftIterateDay").addClass("disabled");
		
		$("#schFreqReftIterateWeek").attr("disabled",true);
		$("#schFreqReftIterateWeek").addClass("disabled");
		
		$("#schFreqReftTypeWeek").val('');
		$("#schFreqReftTypeWeek").attr("disabled",true);
		$("#schFreqReftTypeWeek").addClass("disabled");
		$("#schFreqReftTypeWeek").niceSelect('update');
		
		$("#schFreqReftTypeMonth").val('');
		unbindMarkRemoveRequired('schFreqReftTypeWeek-niceSelect');
		$("#schFreqReftTypeMonth").attr("disabled",true);
		$("#schFreqReftTypeMonth").addClass("disabled");
		$("#schFreqReftTypeMonth").niceSelect('update');
		
		document.getElementById( "schFreqReftIterateSpecificDay" ).value = specificFrequencyReftIterate;
		$("#schFreqReftIterateWeek").val("");
		$('#schFreqReftIterateDay').val("");
		$('#schFreqReftIterateMonth').val("");

		$('#schFreqReftTypeWeek').val("");
		$('#schFreqReftTypeMonth').val("");
		dailyFrequencyReftIterate = 1;
		monthFrequencyReftIterate = 1;
		weekFrequencyReftIterate = 1;
		monthFrequencyReftType = 0;
		weekFrequencyReftType = 0;
		
		$('#schFreqReftTypeSpecificDay').multiselect(
		{
			noneSelectedText:'Select Options',
			click: function(event, ui)
			{
				var specificDayvalue = $('#schFreqReftTypeSpecificDay').getMultiSelectValue();
				$('#schFreqReftIterateSpecificDay').val( specificDayvalue.length);
				
				if ($('#schFreqReftIterateSpecificDay').val() == '0')
				{
					$("#schFreqReftTypeSpecificDay").parent().find("button").attr("onfocus",$("#schFreqReftTypeSpecificDay").attr("onfocus"));
					$("#schFreqReftTypeSpecificDay").parent().find("button").attr("onblur",$("#schFreqReftTypeSpecificDay").attr("onblur"));
				}
			}
		});
		$("#schFreqReftTypeSpecificDay").parent().find("button").attr("onfocus",$("#schFreqReftTypeSpecificDay").attr("onfocus"));
		$("#schFreqReftTypeSpecificDay").parent().find("button").attr("onblur",$("#schFreqReftTypeSpecificDay").attr("onblur"));

		$('#schFreqReftTypeSpecificDay').multiselect('uncheckAll');
		if (specificFrequencyReftType.length > 1){
			$.each(specificFrequencyReftType.split(","), function(i , e)
					{
				$("#schFreqReftTypeSpecificDay option[value='" + e + "']").attr("selected", "selected");
				$('#schFreqReftTypeSpecificDay').multiselect("widget").find(":checkbox").each(function() 
						{
					if ($(this).val() === e) 
					{
						$(this).attr("checked", true);
					}
						});			
					});
			$("#schFreqReftTypeSpecificDay option[value='" + specificFrequencyReftType + "']").attr("selected", "selected");
			$("#schFreqReftTypeSpecificDay").multiselect({
				selectedText: "# selected"
			});	
		}else{
			$("#schFreqReftTypeSpecificDay").multiselect("widget").find(":checkbox[value='"+specificFrequencyReftType+"']").attr("checked","checked");
			var specificDayvalue = $('#schFreqReftTypeSpecificDay').getMultiSelectValue();
			$('#schFreqReftIterateSpecificDay').val( specificDayvalue.length);
		}
		$('#schFreqReftTypeSpecificDay').addClass( 'form-control jq-multiselect' );
		removeMarkRequired('#schFreqReftIterateWeek');
		
	}
}
function setBankScheduleFrequencyTabAttributes( )
{
	if( frequencyBasis == 'REFT' )
	{
		$( 'input[name="schFreqBasis"][value="' + frequencyBasis + '"]' ).prop( 'checked', true );
		$( "#repeatIntervalDiv" ).attr( "class", "hidden" );
		$( "#windowDiv" ).attr( "class", "hidden" );
		$( "#refTimeDiv" ).attr( "class", "block" );
		if(pageMode != 'view' && pageMode != 'edit' )
		{
			$( 'input[name=schFreqType]' ).attr( "disabled", false );
		}
		if( frequencyType == 'D' )
		{
			if(pageMode != 'view' && pageMode != 'edit' )
			{
				$("#schFreqReftIterateDay").attr("disabled",false);
				$("#schFreqReftIterateDay").removeClass("disabled");
			}
			else
			{
				$("#schFreqReftIterateDay").attr("disabled",true);
				$("#schFreqReftIterateDay").addClass("disabled");
			}
			$("#schFreqReftIterateWeek").attr("disabled",true);
			$("#schFreqReftIterateWeek").addClass("disabled");
			$("#schFreqReftTypeWeek").attr("disabled",true);
			$("#schFreqReftTypeWeek").addClass("disabled");
			$("#schFreqReftIterateMonth").attr("disabled",true);
			$("#schFreqReftIterateMonth").addClass("disabled");
			$("#schFreqReftTypeMonth").attr("disabled",true);
			$("#schFreqReftTypeMonth").addClass("disabled");
			document.getElementById( "schFreqReftIterateDay" ).value = frequencyReftIterate;
			$('#schFreqReftIterateMonth').val("");
			$("#schFreqReftIterateWeek").val("");
		}
		else if(frequencyType == 'W')
		{
			if(pageMode != 'view' && pageMode != 'edit' )
			{
				$("#schFreqReftIterateWeek").attr("disabled",false);
				$("#schFreqReftIterateWeek").removeClass("disabled");
				$("#schFreqReftTypeWeek").attr("disabled",false);
				$("#schFreqReftTypeWeek").removeClass("disabled");
			}
			else
			{
				$("#schFreqReftIterateWeek").attr("disabled",true);
				$("#schFreqReftIterateWeek").addClass("disabled");
				$("#schFreqReftTypeWeek").attr("disabled",true);
				$("#schFreqReftTypeWeek").addClass("disabled");
			}
			$("#schFreqReftIterateDay").attr("disabled",true);
			$("#schFreqReftIterateDay").addClass("disabled");
			$("#schFreqReftIterateMonth").attr("disabled",true);
			$("#schFreqReftIterateMonth").addClass("disabled");
			$("#schFreqReftTypeMonth").attr("disabled",true);
			$("#schFreqReftTypeMonth").addClass("disabled");
			document.getElementById( "schFreqReftIterateWeek" ).value = frequencyReftIterate;
			document.getElementById( "schFreqReftTypeWeek" ).value = frequencyReftType;
			$('#schFreqReftIterateMonth').val("");
			$('#schFreqReftIterateDay').val("");
		}
		else if(frequencyType == 'M')
		{
			if(pageMode != 'view' && pageMode != 'edit' )
			{
				$("#schFreqReftIterateMonth").attr("disabled",false);
				$("#schFreqReftIterateMonth").removeClass("disabled");
				$("#schFreqReftTypeMonth").attr("disabled",false);
				$("#schFreqReftTypeMonth").removeClass("disabled");
				makeNiceSelect("#schFreqReftTypeMonth", true);
			}
			else
			{
				$("#schFreqReftIterateMonth").attr("disabled",true);
				$("#schFreqReftIterateMonth").addClass("disabled");
				$("#schFreqReftTypeMonth").attr("disabled",true);
				$("#schFreqReftTypeMonth").addClass("disabled");
			}
			$("#schFreqReftIterateDay").attr("disabled",true);
			$("#schFreqReftIterateDay").addClass("disabled");
			$("#schFreqReftIterateWeek").attr("disabled",true);
			$("#schFreqReftIterateWeek").addClass("disabled");
			$("#schFreqReftTypeWeek").attr("disabled",true);
			$("#schFreqReftTypeWeek").addClass("disabled");
			document.getElementById( "schFreqReftIterateMonth" ).value = frequencyReftIterate;
			document.getElementById( "schFreqReftTypeMonth" ).value = frequencyReftType;
			$("#schFreqReftIterateWeek").val("");
			$('#schFreqReftIterateDay').val("");
		}		
		dynamicHolidayAction(frequencyBasis);
	}
	else if( frequencyBasis == 'INTV' )
	{
		$( 'input[name="schFreqBasis"][value="' + frequencyBasis + '"]' ).prop( 'checked', true );
		$( 'input[name="schFreqType"][value="D"]' ).prop( 'checked', true );
		$( 'input[name=schFreqType]' ).attr( "disabled", true );
		$( "#repeatIntervalDiv" ).attr( "class", "block" );
		$( "#windowDiv" ).attr( "class", "block" );
		$( "#refTimeDiv" ).attr( "class", "hidden" );
		
		$("#schFreqReftIterateDay").attr("disabled",true);
		$("#schFreqReftIterateDay").addClass("disabled");
		$("#schFreqReftIterateWeek").attr("disabled",true);
		$("#schFreqReftIterateWeek").addClass("disabled");
		$("#schFreqReftTypeWeek").attr("disabled",true);
		$("#schFreqReftTypeWeek").addClass("disabled");
		$("#schFreqReftIterateMonth").attr("disabled",true);
		$("#schFreqReftIterateMonth").addClass("disabled");
		$("#schFreqReftTypeMonth").attr("disabled",true);
		$("#schFreqReftTypeMonth").addClass("disabled");
		document.getElementById( "schFreqReftIterateDay" ).value = 1;
		dynamicHolidayAction(frequencyBasis);
	}
	else if( frequencyBasis == 'BOD' ||  frequencyBasis == 'EOD' )
	{
		$( 'input[name="schFreqBasis"][value="' + frequencyBasis + '"]' ).prop( 'checked', true );
		$( "#repeatIntervalDiv" ).attr( "class", "hidden" );
		$( "#windowDiv" ).attr( "class", "hidden" );
		$( "#refTimeDiv" ).attr( "class", "hidden" );
		if(pageMode != 'view' && pageMode != 'edit' )
		{
			$( 'input[name=schFreqType]' ).attr( "disabled", false );
		}
		if( frequencyType == 'D' )
		{
			if(pageMode != 'view' && pageMode != 'edit' )
			{
				$("#schFreqReftIterateDay").attr("disabled",false);
				$("#schFreqReftIterateDay").removeClass("disabled");
			}
			else
			{
				$("#schFreqReftIterateDay").attr("disabled",true);
				$("#schFreqReftIterateDay").addClass("disabled");
			}
			$("#schFreqReftIterateWeek").attr("disabled",true);
			$("#schFreqReftIterateWeek").addClass("disabled");
			$("#schFreqReftTypeWeek").attr("disabled",true);
			$("#schFreqReftTypeWeek").addClass("disabled");
			$("#schFreqReftIterateMonth").attr("disabled",true);
			$("#schFreqReftIterateMonth").addClass("disabled");
			$("#schFreqReftTypeMonth").attr("disabled",true);
			$("#schFreqReftTypeMonth").addClass("disabled");
			document.getElementById( "schFreqReftIterateDay" ).value = frequencyReftIterate;
			$('#schFreqReftIterateMonth').val("");
			$("#schFreqReftIterateWeek").val("");
		}
		else if(frequencyType == 'W')
		{
			if(pageMode != 'view' && pageMode != 'edit' )
			{
				$("#schFreqReftIterateWeek").attr("disabled",false);
				$("#schFreqReftIterateWeek").removeClass("disabled");
				$("#schFreqReftTypeWeek").attr("disabled",false);
				$("#schFreqReftTypeWeek").removeClass("disabled");
			}
			else
			{
				$("#schFreqReftIterateWeek").attr("disabled",true);
				$("#schFreqReftIterateWeek").addClass("disabled");
				$("#schFreqReftTypeWeek").attr("disabled",true);
				$("#schFreqReftTypeWeek").addClass("disabled");
			}
			$("#schFreqReftIterateDay").attr("disabled",true);
			$("#schFreqReftIterateDay").addClass("disabled");
			$("#schFreqReftIterateMonth").attr("disabled",true);
			$("#schFreqReftIterateMonth").addClass("disabled");
			$("#schFreqReftTypeMonth").attr("disabled",true);
			$("#schFreqReftTypeMonth").addClass("disabled");
			document.getElementById( "schFreqReftIterateWeek" ).value = frequencyReftIterate;
			document.getElementById( "schFreqReftTypeWeek" ).value = frequencyReftType;
			$('#schFreqReftIterateMonth').val("");
			$('#schFreqReftIterateDay').val("");
		}
		else if(frequencyType == 'M')
		{
			if(pageMode != 'view' && pageMode != 'edit' )
			{
				$("#schFreqReftIterateMonth").attr("disabled",false);
				$("#schFreqReftIterateMonth").removeClass("disabled");
				$("#schFreqReftTypeMonth").attr("disabled",false);
				$("#schFreqReftTypeMonth").removeClass("disabled");
			}
			else
			{
				$("#schFreqReftIterateMonth").attr("disabled",true);
				$("#schFreqReftIterateMonth").addClass("disabled");
				$("#schFreqReftTypeMonth").attr("disabled",true);
				$("#schFreqReftTypeMonth").addClass("disabled");
			}
			$("#schFreqReftIterateDay").attr("disabled",true);
			$("#schFreqReftIterateDay").addClass("disabled");
			$("#schFreqReftIterateWeek").attr("disabled",true);
			$("#schFreqReftIterateWeek").addClass("disabled");
			$("#schFreqReftTypeWeek").attr("disabled",true);
			$("#schFreqReftTypeWeek").addClass("disabled");
			document.getElementById( "schFreqReftIterateMonth" ).value = frequencyReftIterate;
			document.getElementById( "schFreqReftTypeMonth" ).value = frequencyReftType;
			$("#schFreqReftIterateWeek").val("");
			$('#schFreqReftIterateDay').val("");
		}		
		dynamicHolidayAction(frequencyBasis);
	}
}
function dynamicHolidayAction(freqBasis)
{	
	var freqBasisREFT = new Array( "('"+getLabel('reportCenterActionSkip')+"','S')", "('"+getLabel('postpone','Postpone')+"','P')", "('"+getLabel('prepone','Prepone')+"','A')", "('"+getLabel('none','None')+"','N')" );
	var freqBasisINTV = new Array("('"+getLabel('reportCenterActionSkip')+"','S')",  "('"+getLabel('none','None')+"','N')"  );
    var holidayAction =$("#schHolidayAction").val();
	if(isEmpty(holidayAction))
		holidayAction = selectedHolidayAction;
	document.getElementById( "schHolidayAction" ).length = 0;
	if(freqBasis != null && freqBasis == 'INTV')
	{
		for( var i = 0 ; i < freqBasisINTV.length ; i++ )
		{			
			eval( "document.getElementById('schHolidayAction').options[i]=" + "new Option" + freqBasisINTV[ i ] );
			if( i == holidayAction )
				document.getElementById( "schHolidayAction" ).options[ i ].selected = true;
		}
	}	
	else
	{
		var newlyAddedOption;
		for( var i = 0 ; i < freqBasisREFT.length ; i++ )
		{
			eval( "document.getElementById('schHolidayAction').options[i]=" + "new Option" + freqBasisREFT[ i ] );
			newlyAddedOption=document.getElementById('schHolidayAction').options[i];
			if( newlyAddedOption.value == holidayAction )
				newlyAddedOption.selected = true;
		}
	}
}
function showReportparameters()
{
	$( "#reportScheduleDiv" ).attr( "class", "ui-section ui-widget ui-widget-content ui-corner-all" );
	$( '#parameterLink' ).toggleClass( "icon-expand icon-collapse" );
	$( '#parameterLinkDiv' ).slideToggle( "fast" );
}
function setReportAndDownLoadLabel(srcType)
{
	/*if(srcType == 'R')
	{
		document.getElementById("lblschSrcName").innerHTML = "Report Name";
	}
	else if(srcType == 'D')
	{
		document.getElementById("lblschSrcName").innerHTML = "Upload Name";
	}
	else if(srcType == 'U')
	{
		document.getElementById("lblschSrcName").innerHTML = "Import Name";
	}
	*/	
}
function setFrequencyBasisAndType()
{
	frequencyBasis = $('input[name="schFreqBasis"]:checked').val();
	frequencyType = $('input[name="schFreqType"]:checked').val();
}
function showDatePicker(id,me)
{
	var divId ;
	divId = document.getElementById( id+'.Div' );
	if(me.value == '')
	{
		divId.style.visibility = "visible";
	}
	else
	{
		divId.style.visibility = "hidden";
	}
}
function paintAddSchActions(pageMode,addMode,editMode)
{
	var elt = null, eltCancel = null, eltSaveAndExit = null, eltSaveAndAdd = null;
	$('#reportAddSchActionButtonListLT,#reportAddSchActionButtonListLB, #reportAddSchActionButtonListRB, #reportAddSchActionButtonListRT').empty();
	var strBtnLTLB = '#reportAddSchActionButtonListLT,#reportAddSchActionButtonListLB';
	var strBtnRTRB = '#reportAddSchActionButtonListRT,#reportAddSchActionButtonListRB';
	
	eltCancel = createButton('btnCancel', 'S', 'Cancel');
	eltCancel.click(function() {
		showBack('reportCenterNewUX.srvc');
	});
	eltCancel.appendTo($(strBtnLTLB));
	$(strBtnLTLB).append("&nbsp;");
	
	if(pageMode === addMode)
	{
		eltSaveAndAdd = createButton('btnSaveAndAdd', 'L', 'Save and Add');
		eltSaveAndAdd.click(function() {
			setRepeatEveryAndREFTTypeValue();
			filter('saveAndAddScheduleDefination.srvc');
		});
		eltSaveAndAdd.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
		
		eltSaveAndExit = createButton('btnSaveAndExit', 'P', 'Save and Exit');
		eltSaveAndExit.click(function() {
			setRepeatEveryAndREFTTypeValue();
			filter('saveScheduleDefination.srvc');
		});
		eltSaveAndExit.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
		eltSaveAndExit.bind('keydown',function (){autoFocusOnFirstElement(event, 'frmMain',false)});
	}
	if(pageMode === editMode)
	{
		eltSaveAndAdd = createButton('btnSaveAndAdd', 'L', 'Save and Add');
		eltSaveAndAdd.click(function() {
			setRepeatEveryAndREFTTypeValue();
			filter('updateAndAddScheduleDefination.srvc');
		});
		eltSaveAndAdd.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
		
		eltSaveAndExit = createButton('btnSaveAndExit', 'P', 'Save and Exit');
		eltSaveAndExit.click(function() {
			setRepeatEveryAndREFTTypeValue();
			filter('updateScheduleDefination.srvc');
		});
		eltSaveAndExit.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
		eltSaveAndExit.bind('keydown',function (){autoFocusOnFirstElement(event, 'frmMain',false)});
	}
}

function populateEndDate(tempEndDate,tempStartDate){
	if (tempEndDate != "") {
		var endDate = $(tempEndDate).val();
		if (endDate != "") {
			var templateEndDate = new Date(Ext.Date.parse(endDate, extJsDateFormat)); 
			var templateStartDate = new Date(Date.parse($(tempStartDate).val()));
			if (  !(isNaN(endDate) && !isNaN(templateEndDate))  || (templateStartDate >   templateEndDate))	{ 
				templateEndDate.setDate(templateStartDate.getDate()+1);
				$(tempEndDate).datepicker('setDate', templateEndDate);
			}
		}
	}
}


function paintViewSchActions()
{
	var elt = null, eltCancel = null,eltSaveAndAdd = null;
	$('#reportViewSchActionButtonListLT,#reportViewSchActionButtonListLB, #reportViewSchActionButtonListRB, #reportViewSchActionButtonListRT').empty();
	var strBtnLTLB = '#reportViewSchActionButtonListLT,#reportViewSchActionButtonListLB';
	var strBtnRTRB = '#reportViewSchActionButtonListRT,#reportViewSchActionButtonListRB';
	
	if(mode == 'view') {
		eltBack = createButton('btnBack', 'S', 'Back');
		eltBack.click(function() {
			setRepeatEveryAndREFTTypeValue();
			document.getElementById( "pageMode" ).value = "new";
			document.getElementById( "scheduleName" ).value = ""
			document.getElementById( "schPrevGenDate" ).value = "";
			document.getElementById( "schNextGenDate" ).value = "";
			document.getElementById( "schEndDate" ).value = "";
			filter('addScheduleDefination.srvc');
		});
		eltBack.appendTo($(strBtnLTLB));
	} else {
		eltCancel = createButton('btnCancel', 'S', 'Cancel');
		eltCancel.click(function() {
			showBack('reportCenterNewUX.srvc');
		});
		
		eltCancel.appendTo($(strBtnLTLB));
	}
	
	$(strBtnLTLB).append("&nbsp;");
	
	eltSaveAndAdd = createButton('btnAdd', 'P', 'AddNew Schedule');
	eltSaveAndAdd.click(function() {
		setRepeatEveryAndREFTTypeValue();
		document.getElementById( "pageMode" ).value = "new";
		document.getElementById( "scheduleName" ).value = ""
		document.getElementById( "schPrevGenDate" ).value = "";
		document.getElementById( "schNextGenDate" ).value = "";
		document.getElementById( "schEndDate" ).value = "";
		filter('addScheduleDefination.srvc');
	});
	eltSaveAndAdd.appendTo($(strBtnRTRB));
	$(strBtnRTRB).append("&nbsp;");
}
function createButton(btnKey, charIsPrimary,btnVal) 
{
	var strCls ='';
	if(charIsPrimary === 'P')
		strCls="ft-button ft-button-primary";
	else if(charIsPrimary === 'S')
		strCls ="ft-button ft-button-light";
	else if(charIsPrimary === 'L')
		strCls="ft-margin-l ft-btn-link";
	var elt = null;
	elt = $('<input>').attr({
				'type' : 'button',
				'class' : strCls,
				'id' : 'button_' + btnKey,
				'value' : getLabel(btnKey,btnVal)
			});
	return elt;
}
function enableDisableField(checkboxId, elemId)
{
	var image = document.getElementById(elemId);

	if (image.src.indexOf("icon_checked.gif") == -1) {
		image.src = "static/images/icons/icon_checked.gif";
		document.getElementById(checkboxId).value = "Y";
	} else {
		image.src = "static/images/icons/icon_unchecked.gif";
		document.getElementById(checkboxId).value = "N";
	}
}

function enableFrequecyFields()
{
	var frequencyBasis = $('input[name="schFreqBasis"]:checked').val();
	if(frequencyBasis == 'REFT'){
		$('#refTimeDIV').show();
	}
	else{
		$('#refTimeDIV').hide();
	}
}

function chkBlank(fieldId){
	
	var currval = document.getElementById(fieldId).value; //   $('#'+fieldId.id).val();
	if(currval.trim() == "")
		document.getElementById(fieldId).value = getLabel('ALL',"ALL");
}