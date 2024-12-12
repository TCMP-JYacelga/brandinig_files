jQuery.fn.AgentCodeAutoComplete= function(){
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				agentSeekUrl = 'agentCodeSeek';
			
				$.ajax({
					url: 'services/userseek/' + agentSeekUrl + '.json',
							type : 'POST',
							dataType : "json",
							data : {
								$autofilter : request.term
							},
				success : function(data) {
					var rec = data.d.preferences;
					
					response($.map(rec, function(item) {
								return {	
									
									label : item.DISPLAYFIELD,	
									agentDtl : item
								}
					}));
		}
	});
},
minLength : 1,
select : function(event, ui) {
	var data = ui.item.agentDtl;
	if (data) {
		if (!isEmpty(data.CODE))
		{
			$('#agentCode').val(data.CODE);
			$('#agentDesc').val(data.DESCR);
			showHideInterestProfile();
			creditProfileRecKeyNo = data.CR_INTEREST_PROFILE_ID;
			debitProfileRecKeyNo = data.DR_INTEREST_PROFILE_ID;			
		}		
	}	
},
change : function (event, ui) {
	
	if ($('#agentDesc').val() === '' || $('#agentDesc').val() == null) {
		
		$('#agentCode').val('');
		$('#agentDesc').val('');
		showHideInterestProfile();
		creditProfileRecKeyNo = '';
		debitProfileRecKeyNo = '';		
	}
},
open : function() {
	$(this).removeClass("ui-corner-all")
			.addClass("ui-corner-top");
},
close : function() {
	$(this).removeClass("ui-corner-top")
			.addClass("ui-corner-all");
}
});/*.data("autocomplete")._renderItem = function(ul, item) {
var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
+ item.label + '</ul></ol></a>';
return $("<li></li>").data("item.autocomplete", item)
.append(inner_html).appendTo(ul);
};*/
});
};

function showHideInterestProfile() {
	
	if(!isEmpty($("#agentCode").val()) && 'Y' == tpfaR2EnableFlag){
		$("#interestProfileDiv").removeClass("hidden");
		$("#interestProfileDiv").show();
	}
	else{
		$("#interestProfileDiv").addClass("hidden");
		$("#interestProfileDiv").hide();
	}
}		


function setFeeType(comboval,flag)
{
	$("#content2").addClass("hidden");
	if(comboval == '' )
		comboval = "NOFEE";
	if (comboval == "NOFEE") {
		$("#flatFee").attr('disabled', true);
		$("#flatAmount").attr('disabled', true);
		$('#interPerc').attr('disabled',true);
		$('#netPerc').attr('disabled',true);
		$("#percentOfFee").val("");
		$('#interPerc').val("");
		$('#netPerc').val("");
		$("#flatAmount").val("");
		$('#flatFeeLabel').removeClass("required");
		$('#interestPercentage').removeClass("required");
		$('#netInterestPerc').removeClass("required");
	}
	if (comboval == "FLATFEE") {
		$("#flatFee").attr('disabled', false);
		$("#flatAmount").attr('disabled', false);
		$('#interPerc').attr('disabled',true);
		$('#netPerc').attr('disabled',true);
    	$("#percentOfFee").val("");
		$('#interPerc').val("");
		$('#netPerc').val("");
		$('#netpercent').attr('disabled', true);
		$('#interestPercentage').removeClass("required");
		$('#netInterestPerc').removeClass("required");
		$('#flatFeeLabel').addClass("required");
	}

	if (comboval == "INTAMTTYPE") {
	$("#flatAmount").val("");
		if(percentFee != '' && flag ==1)
			$('#interPerc').val(percentFee);
		else 
			$('#interPerc').val("");
		$('#netPerc').val("");
		$("#flatAmount").attr('disabled',true);
		$('#netPerc').attr('disabled',true);
		$('#interPerc').attr('disabled',false);
		$('#flatFeeLabel').removeClass("required");
		$('#netInterestPerc').removeClass("required");
		$('#interestPercentage').addClass("required");
	} 

	if (comboval== "INTNETTYPE") {
		$("#flatAmount").attr('disabled',true);
		$('#netPerc').attr('disabled',false);
		$('#interPerc').attr('disabled',true);
		$("#flatAmount").val("");
		$('#interPerc').val("");
		if(percentFee != '' && flag ==1 )
			$('#netPerc').val(percentFee);
		else 
			$('#netPerc').val("");
		$('#interestPercentage').attr('disabled', true);
		$('#flatFeeLabel').removeClass("required");
		$('#interestPercentage').removeClass("required");
		$('#netInterestPerc').addClass("required");
	} 
	if (comboval== "SLIDINGSCALE") {
    $("#content2").removeClass("hidden");
    $("#flatAmount").val("");
    $("#percentOfFee").val("");
		$('#netPerc').val("");
		$('#interPerc').val("");
		$("#flatAmount").attr('disabled',true);
		$('#netPerc').attr('disabled',true);
		$('#interPerc').attr('disabled',true);
		$('#flatFeeLabel').removeClass("required");
		$('#interestPercentage').removeClass("required");
		$('#netInterestPerc').removeClass("required");
	} 
}
function submitForm(strUrl) 
{
	if(document.getElementById('interPerc') != null || document.getElementById('netPerc') !=null){
		if(document.getElementById('interPerc').value != '')  {
			var intPerc =$("#interPerc").val(); 
			$('#percentOfFee').val(intPerc);
		} else {
			var netPerc = $("#netPerc").val();
			$('#percentOfFee').val(netPerc);
		}
	}
	var frm = document.forms["formMain"];
	$(':input').removeAttr('disabled');
	frm.action = strUrl;
	frm.method = "POST";
	removeAutoNumeic();
	frm.submit();
			
}
function saveProfile(strUrl)
{
	if(document.getElementById('interPerc') != null || document.getElementById('netPerc') !=null){
		if(document.getElementById('interPerc').value != '')  {
			var intPerc =$("#interPerc").val(); 
			$('#percentOfFee').val(intPerc);
		} else {
			var netPerc = $("#netPerc").val();
			$('#percentOfFee').val(netPerc);
	}
	}
	var frm = document.forms["formMain"];
	$(':input').removeAttr('disabled');
	removeAutoNumeic();
	frm.action = strUrl;	
	frm.method = "POST";	
	frm.submit();
}
// Retrieve last key pressed.  Works in IE and Netscape.  
// Returns the numeric key code for the key pressed.  
function getKey(e)  
{  
  if (window.event)  
     return window.event.keyCode;  
  else if (e)  
     return e.which;  
  else  
     return null;  
}  

function restrictChars(e, obj)  
{  
  var CHAR_AFTER_DP = 4;  // number of decimal places  
  var validList = "0123456789.";  // allowed characters in field  
  var key, keyChar;  
  key = getKey(e);  
  if (key == null) return true;  
  // control keys  
  // null, backspace, tab, carriage return, escape  
  if ( key==0 || key==8 || key==9 || key==13 || key==27 )  
     return true;  
  // get character  
  keyChar = String.fromCharCode(key);  
  // check valid characters  
  if (validList.indexOf(keyChar) != -1)  
  {  
    // check for existing decimal point  
    var dp = 0;  
    if( (dp = obj.value.indexOf( ".")) > -1)  
    {  
      if( keyChar == ".")  
        return false;  // only one allowed  
      else  
      {  
        // room for more after decimal point?  
        if( obj.value.length - dp <= CHAR_AFTER_DP)  
          return true;  
      }  
    }  
    else return true;  
  }  
  // not a valid character  
  return false;  
}

function setLowerLimit(index,val)
{
	$('#feeSlabDetailList_'+index+'_lowerSlabLimit').val(val);
}
function setDirtyBit()
{
	dirtyBitSet = true;
}

function getCancelConfirmPopUp(strUrl) {
	if(dirtyBitSet)
	{
	$('#confirmMsgPopup').dialog({
				autoOpen : false,
				width : 430,
				modal : true,
				draggable: false,
				 resizable: false
			});
	$('#confirmMsgPopup').dialog("open");
	$('#cancelConfirmMsg').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
	});

	$('#doneConfirmMsgbutton').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
		goToPage(strUrl);
	});
	}
	else
	{
		goToPage(strUrl);
	}
}

function goToPage(strUrl)
{
	var frm = document.forms["formMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	$(':input').removeAttr('disabled');
	removeAutoNumeic();
	frm.submit();
}

function deleteSlab(strUrl,index)
{
	document.getElementById('selectedUnit').value=document.getElementById('feeSlabDetailList['+index+'].viewState').value;
	//removeAutoNumeric();
	var frm = document.forms["formMain"];
	//enableDisableForm(false);
	frm.action = strUrl;
	frm.method = "POST";
	$(':input').removeAttr('disabled');
	removeAutoNumeic();
	frm.submit();
}

function toggleCheckUncheckDefaultProfile(imgElement){
	if (imgElement.src.indexOf("checkbox.png") > -1)
	{
		imgElement.src = "static/styles/Themes/t7-SBSA/resources/images/T7/checked.png";	
		$('#defaultProfile').val("Y");
	}
	else
	{
		imgElement.src = "static/styles/Themes/t7-SBSA/resources/images/T7/checkbox.png";
		$('#defaultProfile').val("N");
	}
}

function isAutoNumericApplied(strId) {

	var autoNumericApplied = false;
	$.each(($('#'+strId).data('events')||[]), function(i, event) {
				$.each(event, function(i, eventHandler) {
				if (eventHandler.namespace === 'autoNumeric')
								autoNumericApplied = true;
							return false;
						});
			});
	return autoNumericApplied;
}

function removeAutoNumeic()
{
	var id_attr = null;
	var objVal = null;
	
	$(".tpfaAutoNumeric").each(function(){
		  id_attr = $(this).attr('id');
		  var blnAutoNumeric =  isAutoNumericApplied(id_attr);
			if (blnAutoNumeric){
				objVal =$(this).autoNumeric('get');
				$(this).val(objVal);
			}
			objVal = null;
		});
}

function applyAutoNumeic()
{
	$(".tpfaAutoNumeric").each(function(){
		   $(this).autoNumeric("init",
			{
				aSep: strGroupSeparator,
				aDec: strDecimalSeparator,
				mDec: strAmountMinFraction
			});
		});
	$(".tpfaAutoDecimal").each(function(){
		   $(this).autoNumeric("init",
			{
				aSep: strGroupSeparator,
				aDec: ".",
				mDec: strAmountMinFraction
			});
		});		
	$("[id ^=feeSlabDetailList_][id $=_lowerSlabLimit]").each(function(){
id_attr = $(this).attr('id');
$('#'+id_attr+'Span').text($('#'+id_attr).val());
});	
}
