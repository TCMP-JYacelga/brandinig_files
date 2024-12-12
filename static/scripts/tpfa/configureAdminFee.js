jQuery.fn.FeeProfileAutoComplete = function(selAgentCode) {
	return this
			.each(function() {
				$(this)
						.autocomplete(
								{
									source : function(request, response) {
										profileSeekUrl = 'endClientFeeProfileSeekUrl';

										$
												.ajax({
													url : 'services/userseek/'
															+ profileSeekUrl
															+ '.json',
													type : 'POST',
													dataType : "json",
													data : {
														$filtercode1 : selAgentCode,
														'$autofilter' : $('#feeProfileName').val()
													},
													success : function(data) {
														var rec = data.d.preferences;
														if( rec.length == 0 ) {
															results = [{
																		label : '',
																		profileDtl : 'No Records Found'}
																		];
															response(results);
														} else {
														response($
																.map(
																		rec,
																		function(
																				item) {
																			return {
																				label : item.DISPLAYFIELD,
																				profileDtl : item
																			}
																		}));
														}
													}
												});
									},
									minLength : 1,
									select : function(event, ui) {
										var data = ui.item.profileDtl;
										if (data && data != 'No Records Found' ) {
											if (!isEmpty(data.CODE)) {
												$('#feeProfileId').val(
														data.CODE);
												$('#feeProfileName').val(
														data.DESCR);
												document
														.getElementById('selectedFeeProfile').value = document
														.getElementById('feeProfileId').value;
												saveProfile('endClientConfigureAdminFee.srvc')
											}
										}
										else if(data == 'No Records Found') {
											$('#feeProfileId').val('');
											$('#feeProfileName').val('');
											document.getElementById('selectedFeeProfile').value = '';
											setFeeProfileType('A',0);											
										}

									},
									change : function(event, ui) {
										if ($('#feeProfileId').val() === '' || $('#feeProfileId').val() == null
												|| $('#feeProfileId').val() == '%') {
											$('#feeProfileId').val('');
											$('#feeProfileName').val('');
											document.getElementById('selectedFeeProfile').value = '';
											setFeeProfileType('A',0);
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
								});/*.data("autocomplete")._renderItem = function(
						ul, item) {				
					var inner_html;
					if( item.profileDtl == 'No Records Found' ) {
						inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.profileDtl + ' '+'</ul"><ul">' + item.label
						+ '</ul"></ol></a>';
					} else {
						
						inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.label
						+ '</ul></ol></a>';
					}
				return $("<li></li>").data("item.autocomplete", item)
						.append(inner_html).appendTo(ul);
					
					
				};*/
			});
};

function setFeeType(comboval, flag) {
	$("#content2").addClass("hidden");
	if (comboval == "NOFEE") {
		$("#flatFee").attr('disabled', true);
		$("#flatAmount").attr('disabled', true);
		$('#interPerc').attr('disabled',true);
		$('#netPerc').attr('disabled',true);
		$("#percentOfFee").val("");
		$("#flatAmount").val("");
		$('#interPerc').val("");
		$('#netPerc').val("");
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
		if(percentOfFee != '' && flag ==1)
			$('#interPerc').val(percentOfFee);
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

	if (comboval == "INTNETTYPE") {
		$("#flatAmount").attr('disabled',true);
		$('#netPerc').attr('disabled',false);
		$('#interPerc').attr('disabled',true);
		$("#flatAmount").val("");
		$('#interPerc').val("");
		if(percentOfFee != '' && flag == 1 )
			$('#netPerc').val(percentOfFee);
		else 
			$('#netPerc').val("");
		$('#interestPercentage').attr('disabled', true);
		$('#flatFeeLabel').removeClass("required");
		$('#interestPercentage').removeClass("required");
		$('#netInterestPerc').addClass("required");
	}
	if (comboval == "SLIDINGSCALE") {
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
function setDirtyBit() {
	dirtyBitSet = true;
}
function setFeeProfileType(val,flag) {
	if (val == 'A'){
		$('#feeProfile').attr('checked', true);
		if($('#feeProfileName').val() == ""){
		setFeeType('NOFEE', '0');
			$('#feeType').val("");	
			}
		//$('#feeType').attr('disabled',true);
		$("input[type=radio]").attr('disabled', true);
		$('#feeProfile').attr('disabled',false);
		$('#customProfile').attr('disabled',false);
		$('#feeType').niceSelect('update');
		$('#flatAmount').attr('disabled',true);
		$('#netPerc').attr('disabled',true);
		$('#interPerc').attr('disabled',true);
		$('#addSlabBtn').attr('disabled',true);
		for (i = 0; i < slabListLength; ++i) {
			$('#endClientSlabList_'+i+'_upperSlabLimit').attr('disabled',true);
			$('#endClientSlabList_'+i+'_percentOfFee').attr('disabled',true);
		}
		if(flag==0)
			$('#selectedFeeProfile').val('A');
		}
	else
		{
		$('#customProfile').attr('checked', true);
		$('#feeType').attr('disabled',false);
		$('#feeType').niceSelect('update');
		$('#feeProfileName').attr('disabled',true);
		$('#feeProfileNameLbl').removeClass("required");
		$('#selectedFeeProfile').val("");
		if(flag==0)
			$('#selectedFeeProfile').val('C');
		}
		if(flag==0)
			saveProfile('endClientConfigureAdminFee.srvc');
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
	$("[id ^=endClientSlabList_][id $=_lowerSlabLimit]").each(function(){
id_attr = $(this).attr('id');
if(id_attr != 'endClientSlabList_0_lowerSlabLimit')
$('#'+id_attr+'Span').text($('#'+id_attr).val());
});	
}


function onNextClick(updateUrl, nextUrl){
	if(dirtyBitSet)
		saveProfile(updateUrl);
	else
		saveProfile(nextUrl);
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
		saveProfile(strUrl);
	});
	}
	else
	{
		saveProfile(strUrl);
	}
}
function setLowerLimit(index,val)
{
	//var objVal = null;
	//var index1 = index-1;
	//objVal =$('#endClientSlabList_'+index1+'_upperSlabLimit').autoNumeric('get');
	$('#endClientSlabList_'+index+'_lowerSlabLimit').val(val);
}
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
  var CHAR_AFTER_DP = 2;  // number of decimal places  
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
function deleteSlab(strUrl,index)
{
	document.getElementById('selectedFeeProfile').value = document.getElementById('endClientSlabList['+index+'].viewState').value;
	var frm = document.forms["formMain"];
	frm.action = strUrl;
	frm.method = "POST";
	$(':input').removeAttr('disabled');
	removeAutoNumeic();
	frm.submit();
}