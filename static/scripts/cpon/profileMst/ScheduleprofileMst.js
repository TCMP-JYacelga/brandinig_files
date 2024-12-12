function setFrequencyBasisAndType()
{
	frequencyBasis = $('input[name="schFreqBasis"]:checked').val();
	frequencyType = $('input[name="schFreqType"]:checked').val();
}
function setFrequencyAttributes( frequencyType )
{
	if(pageMode != 'view')
	{
		$( 'input[name=schFreqType]' ).attr( "disabled", false );
	}
	if( frequencyType == 'D' )
	{
		$('#evrDay').addClass('required-lbl-right');
		$('#evrWeek').removeClass('required-lbl-right');
		$('#evrMonth').removeClass('required-lbl-right');

		
		if(pageMode != 'view')
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
		$('#evrWeek').addClass('required-lbl-right');
		$('#evrDay').removeClass('required-lbl-right');
		$('#evrMonth').removeClass('required-lbl-right');

		
		if(pageMode != 'view')
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
		$('#evrMonth').addClass('required-lbl-right');
		$('#evrDay').removeClass('required-lbl-right');
		$('#evrWeek').removeClass('required-lbl-right');

		if(pageMode != 'view')
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
}
var strRefSpecificDay = new Array("('Sunday',1)", "('Monday',2)", "('Tuesday',3)",
		"('Wednesday',4)", "('Thursday',5)", "('Friday',6)", "('Saturday',7)");

function setBankScheduleFrequencyTabAttributes( )
{
	if( frequencyBasis == 'REFT' )
	{
		$( 'input[name="schFreqBasis"][value="' + frequencyBasis + '"]' ).prop( 'checked', true );
		$( "#repeatIntervalDiv" ).attr( "class", "hidden" );
		$( "#windowDiv" ).attr( "class", "hidden" );
		$( "#refTimeDiv" ).attr( "class", "block" );
		if(pageMode != 'view')
		{
			$( 'input[name=schFreqType]' ).attr( "disabled", false );
		}
		if( frequencyType == 'D' )
		{
			if(pageMode != 'view')
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
			$("#schFreqReftIterateSpecificDay").attr("disabled",true);
			$("#schFreqReftIterateSpecificDay").addClass("disabled");
			$("#schFreqReftTypeSpecificDay").multiselect('destroy');
			$("#schFreqReftTypeSpecificDay").attr("disabled",true);
			$("#schFreqReftTypeSpecificDay").addClass("disabled");
			$("#schFreqReftTypeMonth").attr("disabled",true);
			$("#schFreqReftTypeMonth").addClass("disabled");
			document.getElementById( "schFreqReftIterateDay" ).value = frequencyReftIterate;
			$('#schFreqReftIterateMonth').val("");
			$("#schFreqReftIterateWeek").val("");
			$('#schFreqReftIterateSpecificDay').val("");
		}
		else if(frequencyType == 'W')
		{
			if(pageMode != 'view')
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
			$("#schFreqReftIterateSpecificDay").attr("disabled",true);
			$("#schFreqReftIterateSpecificDay").addClass("disabled");
			$("#schFreqReftTypeSpecificDay").multiselect('destroy');
			$("#schFreqReftTypeSpecificDay").attr("disabled",true);
			$("#schFreqReftTypeSpecificDay").addClass("disabled");
			$("#schFreqReftTypeMonth").attr("disabled",true);
			$("#schFreqReftTypeMonth").addClass("disabled");
			document.getElementById( "schFreqReftIterateWeek" ).value = frequencyReftIterate;
			document.getElementById( "schFreqReftTypeWeek" ).value = frequencyReftType;
			$('#schFreqReftIterateMonth').val("");
			$('#schFreqReftIterateDay').val("");
			$('#schFreqReftIterateSpecificDay').val("");
		}
		else if(frequencyType == 'M')
		{
			if(pageMode != 'view')
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
			$("#schFreqReftIterateSpecificDay").attr("disabled",true);
			$("#schFreqReftIterateSpecificDay").addClass("disabled");
			$("#schFreqReftTypeSpecificDay").multiselect('destroy');
			$("#schFreqReftTypeSpecificDay").attr("disabled",true);
			$("#schFreqReftTypeSpecificDay").addClass("disabled");
			$("#schFreqReftTypeWeek").attr("disabled",true);
			$("#schFreqReftTypeWeek").addClass("disabled");
			document.getElementById( "schFreqReftIterateMonth" ).value = frequencyReftIterate;
			document.getElementById( "schFreqReftTypeMonth" ).value = frequencyReftType;
			$("#schFreqReftIterateWeek").val("");
			$('#schFreqReftIterateDay').val("");
			$('#schFreqReftIterateSpecificDay').val("");
		}
		else if(frequencyType == 'SD')
		{
			$("#schFreqReftIterateDay").attr("disabled",true);
			$("#schFreqReftIterateDay").addClass("disabled");
			$("#schFreqReftIterateWeek").attr("disabled",true);
			$("#schFreqReftIterateWeek").addClass("disabled");
			$("#schFreqReftIterateMonth").attr("disabled",true);
			$("#schFreqReftIterateMonth").addClass("disabled");
			$("#schFreqReftTypeWeek").attr("disabled",true);
			$("#schFreqReftTypeWeek").addClass("disabled");
			$("#schFreqReftTypeMonth").attr("disabled",true);
			$("#schFreqReftTypeMonth").addClass("disabled");
			$("#schFreqReftTypeSpecificDay").attr("disabled",false);
			$("#schFreqReftTypeSpecificDay").removeClass("disabled");
			document.getElementById( "schFreqReftIterateSpecificDay" ).value = frequencyReftIterate;
			$('#schFreqReftIterateDay').val("");
			$("#schFreqReftIterateWeek").val("");
			$('#schFreqReftIterateMonth').val("");
			populateMultiSelect();
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
		$("#schFreqReftIterateSpecificDay").attr("disabled",true);
		$("#schFreqReftIterateSpecificDay").addClass("disabled");
		if(frequencyType == 'SD'){
			$("#schFreqReftTypeSpecificDay").multiselect('destroy');
		}
		$("#schFreqReftTypeSpecificDay").attr("disabled",true);
		$("#schFreqReftTypeSpecificDay").addClass("disabled");
		document.getElementById( "schFreqReftIterateDay" ).value = 1;
		dynamicHolidayAction(frequencyBasis);
	}
	else if( frequencyBasis == 'BOD' ||  frequencyBasis == 'EOD' )
	{
		$( 'input[name="schFreqBasis"][value="' + frequencyBasis + '"]' ).prop( 'checked', true );
		$( "#repeatIntervalDiv" ).attr( "class", "hidden" );
		$( "#windowDiv" ).attr( "class", "hidden" );
		$( "#refTimeDiv" ).attr( "class", "hidden" );
		if(pageMode != 'view')
		{
			$( 'input[name=schFreqType]' ).attr( "disabled", false );
		}
		if( frequencyType == 'D' )
		{
			if(pageMode != 'view')
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
			$("#schFreqReftIterateSpecificDay").attr("disabled",true);
			$("#schFreqReftIterateSpecificDay").addClass("disabled");
			if(frequencyType == 'SD'){
				$("#schFreqReftTypeSpecificDay").multiselect('destroy');
			}
			$("#schFreqReftTypeSpecificDay").attr("disabled",true);
			$("#schFreqReftTypeSpecificDay").addClass("disabled");
			document.getElementById( "schFreqReftIterateDay" ).value = frequencyReftIterate;
			$('#schFreqReftIterateMonth').val("");
			$("#schFreqReftIterateWeek").val("");
			$('#schFreqReftIterateSpecificDay').val("");
		}
		else if(frequencyType == 'W')
		{
			if(pageMode != 'view')
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
			$("#schFreqReftIterateSpecificDay").attr("disabled",true);
			$("#schFreqReftIterateSpecificDay").addClass("disabled");
			$("#schFreqReftTypeSpecificDay").multiselect('destroy');
			$("#schFreqReftTypeSpecificDay").attr("disabled",true);
			$("#schFreqReftTypeSpecificDay").addClass("disabled");
			document.getElementById( "schFreqReftIterateWeek" ).value = frequencyReftIterate;
			document.getElementById( "schFreqReftTypeWeek" ).value = frequencyReftType;
			$('#schFreqReftIterateMonth').val("");
			$('#schFreqReftIterateDay').val("");
			$('#schFreqReftIterateSpecificDay').val("");
		}
		else if(frequencyType == 'M')
		{
			if(pageMode != 'view')
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
			$("#schFreqReftIterateSpecificDay").attr("disabled",true);
			$("#schFreqReftIterateSpecificDay").addClass("disabled");
			$("#schFreqReftTypeSpecificDay").multiselect('destroy');
			$("#schFreqReftTypeSpecificDay").attr("disabled",true);
			$("#schFreqReftTypeSpecificDay").addClass("disabled");
			document.getElementById( "schFreqReftIterateMonth" ).value = frequencyReftIterate;
			document.getElementById( "schFreqReftTypeMonth" ).value = frequencyReftType;
			$("#schFreqReftIterateWeek").val("");
			$('#schFreqReftIterateDay').val("");
			$('#schFreqReftIterateSpecificDay').val("");
		}
		else if(frequencyType == 'SD')
		{
			$("#schFreqReftIterateDay").attr("disabled",true);
			$("#schFreqReftIterateDay").addClass("disabled");
			$("#schFreqReftIterateWeek").attr("disabled",true);
			$("#schFreqReftIterateWeek").addClass("disabled");
			$("#schFreqReftIterateMonth").attr("disabled",true);
			$("#schFreqReftIterateMonth").addClass("disabled");
			$("#schFreqReftTypeWeek").attr("disabled",true);
			$("#schFreqReftTypeWeek").addClass("disabled");
			$("#schFreqReftTypeMonth").attr("disabled",true);
	     	$("#schFreqReftTypeMonth").addClass("disabled");
	     	$("#schFreqReftTypeSpecificDay").attr("disabled",false);
			$("#schFreqReftTypeSpecificDay").removeClass("disabled");
			document.getElementById( "schFreqReftIterateSpecificDay" ).value = frequencyReftIterate;
			$('#schFreqReftIterateDay').val("");
			$("#schFreqReftIterateWeek").val("");
			$('#schFreqReftIterateMonth').val("");
			populateMultiSelect();
		}
		dynamicHolidayAction(frequencyBasis);
	}
}
function populateMultiSelect()
{
	$("#schFreqReftIterateSpecificDay").attr("disabled",true);
	$("#schFreqReftIterateSpecificDay").addClass("disabled");
	
	if (pageMode != 'VIEW' && pageMode != 'VERIFY'){
		$("#schFreqReftTypeSpecificDay").multiselect('destroy');
		$('#schFreqReftTypeSpecificDay').multiselect(
				{	
					click: function(event, ui)
					{
						var specificDayvalue = $('#schFreqReftTypeSpecificDay').getMultiSelectValue();
						$('#schFreqReftIterateSpecificDay').val( specificDayvalue.length);
					}
				});
		$("#schFreqReftTypeSpecificDay").multiselect('refresh');
		$('#schFreqReftTypeSpecificDay').multiselect("widget").find(":checkbox").each(function() 
				{
			$(this).attr("checked", false);
				});
		
		if (frequencyReftType.length > 1){
			$.each(frequencyReftType.split(","), function(i , e)
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
			$("#schFreqReftTypeSpecificDay option[value='" + frequencyReftType + "']").attr("selected", "selected");
		}else{
			$("#schFreqReftTypeSpecificDay").multiselect("widget").find(":checkbox[value='"+frequencyReftType+"']").attr("checked","checked");
			var specificDayvalue = $('#schFreqReftTypeSpecificDay').getMultiSelectValue();
			$('#schFreqReftIterateSpecificDay').val( specificDayvalue.length);
		}
		$('#schFreqReftTypeSpecificDay').addClass( 'form-control jq-multiselect' );
	}else{
		$('#schFreqReftTypeSpecificDay').multiselect(
				{	
					click: function(event, ui)
					{
						var specificDayvalue = $('#schFreqReftTypeSpecificDay').getMultiSelectValue();
						$('#schFreqReftIterateSpecificDay').val( specificDayvalue.length);
					}
				});
		$("#schFreqReftTypeSpecificDay").multiselect('refresh');
		$('#schFreqReftTypeSpecificDay').multiselect("widget").find(":checkbox").each(function() 
				{
			$(this).attr("checked", false);
				});
		if (frequencyReftType.length > 1){
			$.each(frequencyReftType.split(","), function(i , e)
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
			$("#schFreqReftTypeSpecificDay option[value='" + frequencyReftType + "']").attr("selected", "selected");
		}else{
			$("#schFreqReftTypeSpecificDay option[value='" + frequencyReftType + "']").attr("selected", "selected");
		}
		$('#schFreqReftTypeSpecificDay').addClass( 'form-control jq-multiselect' );
	}
}

function dynamicHolidayAction(freqBasis)
{	
	var freqBasisREFT = new Array( "('Skip','S')", "('Postpone','P')", "('Prepone','A')");
	var freqBasisINTV = new Array( "('Skip','S')" );
	var holidayAction = document.getElementById( "schHolidayAction" ).value;
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
		for( var i = 0 ; i < freqBasisREFT.length ; i++ )
		{
			eval( "document.getElementById('schHolidayAction').options[i]=" + "new Option" + freqBasisREFT[ i ] );
			if( i == holidayAction )
				document.getElementById( "schHolidayAction" ).options[ i ].selected = true;
		}
	}
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
		document.getElementById( "schFreqReftIterate" ).value = document.getElementById( "schFreqReftIterateSpecificDay" ).value ;
		document.getElementById( "schFreqReftType" ).value =  $("#schFreqReftTypeSpecificDay").getMultiSelectValueString();
	}
}

function goToSchedulePage(strUrl)

{
	$('#scheduleName').removeAttr("disabled");	
	var frm = document.forms["frmMain"];
	if(dityBitSet)
		document.getElementById("dirtyBitSet").value = true;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

jQuery.fn.OnlyNumbers = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(event) {
							var prevKey = -1, prevControl = '';
							var keynum;							
							if (window.event) { // IE
								keynum = event.keyCode;
							}
							if (event.which) { // Netscape/Firefox/Opera
								keynum = event.which;
							}
							if (event.shiftKey)
							{
							  return false;
							}							
							return((keynum == 8 || keynum == 9 || keynum == 17 || keynum == 46 || (keynum >= 35 && keynum <= 40) || (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105) || (keynum == 65 && prevKey == 17 && prevControl == event.currentTarget.id)));							
							})
			})
	};
