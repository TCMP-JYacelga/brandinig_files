jQuery.fn.anchorClientCounterPartyAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/anchorClientSeek.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCR,														
														company : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						$('#fileName').val("");
						var data = ui.item.company;
						if (data) {
							if (!isEmpty(data.CODE))
							{
								$('#enteredByClient').val(data.CODE);
								$('#enteredByClientDesc').val(data.DESCR);
							}
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
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:150px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.fileNameInvoiceNoAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services//userseek/fscFileNameSeek.json?$filtercode1="+$('#enteredByClient').val(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.CODE,														
														company : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.company;
						if (data) {
							if (!isEmpty(data.CODE))
							{
								$('#fileName').val(data.CODE);
							}
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
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:150px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
		};*/
	});
};
jQuery.fn.baseRateCodeAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/baseRateCodeSeek.json",
									type: "POST",
									dataType : "json",
									data : {
										$filtercode1: currency,
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCRIPTION,														
														company : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.company;
						if (data) {
							if (!isEmpty(data.CODE))
							{
								$('#baseRateCode').val(data.CODE);
								$('#baseRateCodeDesc').val(data.DESCRIPTION);
							}
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
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:150px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
		};*/
	});
};
function toggleDependantFields(me)
{
	if(null != me)
	{
		$('#baseRateCodeDesc').val('');
		$('#baseRateCode').val('');
		$('#fixedRateValue').val('');
		$('#intrBasisPoints').val('');
		toggleDependantOnLoad(me,'EDIT');
	}	
}
function toggleDependantOnLoad(me,screenMode)
{
	if(screenMode!='VIEW' && screenMode!='SUBMIT')
	{
			if(me.value=='F')
			{
				$('#fixedRateValue').attr('readOnly',true);
				$('#fixedRateValue').addClass('disabled');
				$('#lblFixedRate').removeClass('required-lbl-right');
		
				$('#intrBasisPoints').attr('readOnly',false);
				$('#intrBasisPoints').removeClass('disabled');
				$('#lblBasisPoints').addClass('required-lbl-right');
				
				$('#baseRateCodeDesc').attr('readOnly',false);
				$('#baseRateCodeDesc').removeClass('disabled');
				$('#lblBaseRate').addClass('required-lbl-right');
			}	
			else
			{
				$('#fixedRateValue').attr('readOnly',false);
				$('#fixedRateValue').removeClass('disabled');
				$('#lblFixedRate').addClass('required-lbl-right');
				
				$('#intrBasisPoints').attr('readOnly',true);
				$('#intrBasisPoints').addClass('disabled');
				$('#lblBasisPoints').removeClass('required-lbl-right');
				
				$('#baseRateCodeDesc').attr('readOnly',true);
				$('#baseRateCodeDesc').attr("placeholder", "Enter Keyword or %");
				$('#baseRateCodeDesc').addClass('disabled');
				$('#lblBaseRate').removeClass('required-lbl-right');
			}
	}
}
function clearSearch()
{
	$('#fileName').val('');
	$('#fileNameDesc').val('');
	
	$('#enteredByClient').val('');
	$('#enteredByClientDesc').val('');
	goToPage('addInterestRateApplication.srvc', 'frmMain');
}

function setDirtyBit() 
{
	$('#dirtyBit').val("1");
}

function goBackValidate(strUrl, frmId) {
	if (strUrl == 'null') {

	} else if ($('#dirtyBit').val() == "1")
		getConfirmationPopup(frmId, strUrl);
	else
		goToPage(strUrl, frmId);
}

function getConfirmationPopup(frmId, strUrl) {
	$('#confirmPopup').dialog({
			autoOpen : false,
			maxHeight: 550,
			minHeight:'auto',
			width : 400,
			modal : true,
			resizable: false,
			draggable: false
	});
	$('#confirmPopup').dialog("open");
	$('#cancelBackConfirmMsg').bind('click',function(){
		$('#confirmPopup').dialog("close");
	});
	
	$('#doneBackConfirmMsgbutton').bind('click',function(){
		var frm = document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	});
	$('#textContent').focus();
}

function goToPage(strUrl, frmId) 
{
	if(strUrl.indexOf('showSubmitInterestRate')!=-1)
	{
		if($('#invFinIntRefNmbr').val()==="")
		{
			return false;
		}		
	}
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function searchTransaction() 
{
	var form = null;
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	var url = 'searchInterestTransaction.srvc?&$clientId='+$('#enteredByClient').val()+'&$fileName='+$('#fileName').val();
	
	goToPage(url,'frmMain');
}
