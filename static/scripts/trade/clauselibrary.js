jQuery.fn.clientCodeSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/userclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCR,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.DESCR))
							{
								$('#txtLCMyClientDesc').val(data.DESCR);
								$('#txtLCMyClientCode').val(data.CODE);
							}
						}
						filter(mode,0);
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


function showList(strUrl)
{
	if (frmName == "Entry")
	{
		strUrl = "clauseLibraryControllerList.form";
		$('#clauseCode').val('');
		$('#clauseDesc').val('');
		$('#clauseType').val('');
		$('#txtLCMyClientCode').val('');
		$('#txtLCMyClientDesc').val('');
	}
	else if(frmName=="View")
	{
		if(mode == "AUTH_VIEW" )
		{
			strUrl = "authclauseLibraryControllerList.form";
		}
		else
		{
			strUrl = "clauseLibraryControllerList.form";
		}
	}
	var frm = document.forms["frmMain"];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showAddNewForm(strUrl)
{
	var frm = document.forms["frmMain"];
	document.getElementById("clauseCode").value = '';
	document.getElementById("clauseDesc").value = '';
	document.getElementById("clauseType").value = '';
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showHistoryForm(strAction, index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	frm.target = "";
	document.getElementById("txtIndex").value = index;
	if ("AUTH" == strAction)
		frm.action = "clauseLibraryAuthHistory.hist";
	else
		frm.action = "clauseLibraryHistory.hist";
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	if(mode == "AUTH")
	{
		strUrl = "authViewClauseLibrary.form";
	}
	else
	{
		strUrl ="viewClauseLibrary.form";
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function disableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target = "";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function rejectRecord(arrData,strRemarks)
{
	var frm = document.forms["frmMain"];		
	if (strRemarks.length > 255)
	{
		alert("Reject Remarks Length Cannot Be Greater than 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.txtIndex.value = arrData[0];
		frm.target = "";
		frm.action = "rejectClauseLibrary.form";
		frm.method = "POST";
		frm.submit();
	}
}

function discardRecord(arrData)
{
	var frm = document.forms["frmMain"];
	strUrl = arrData[0];
	frm.txtIndex.value = arrData[1];
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";	
	frm.submit();
}
function filter(mode,type)
{
	var strUrl = null; 
	var frm = document.forms["frmMain"];
	frm.target ="";
	if('0'==strEntity)
	 {
		if($('#txtLCMyClientDesc').val()== null || $('#txtLCMyClientDesc').val()=='')
		{
			$('#txtLCMyClientCode').val('');
		}
		else
		{
			if($('#txtLCMyClientCode').val()== null || $('#txtLCMyClientCode').val()=='')
			{
				$('#txtLCMyClientCode').val($('#txtLCMyClientDesc').val());  
			}		  
		}
	 }
	if((mode == "AUTH" || mode == "ACCEPT" || mode == "REJECT"|| mode =="AUTH_FILTER"))
		strUrl = "clauseLibraryAuthFilterList.form";	
	else
		strUrl ="clauseLibraryFilterList.form";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function update(strUrl)
{
	var frm = document.forms["frmMain"];
	document.getElementById("txtRecordIndex").value = 0;
	frm.target ="";	
	frm.action = strUrl;	
	frm.method = "POST";
	frm.submit();
}

function setClientDesc()
{
	$('#txtLCMyClientDesc').val($('#txtLCMyClientCode option:selected').text());
}

jQuery.fn.ForceAlphaNumericAndPercentOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e) 
						{
							// allows only alphabets & numbers, backspace, tab
							var keycode = e.which || e.keyCode;						
							if ((keycode >= 48 && keycode <= 57) || (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122)
									|| keycode == 8 || keycode == 9 || keycode == 37)
								return true;

							return false;
						})
			})
};

jQuery.fn.clientCodeSeekAutoCompleteOnEntry= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/userclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCR,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.DESCR))
							{
								$('#txtLCMyClientDesc').val(data.DESCR);
								$('#txtLCMyClientCode').val(data.CODE);
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
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};