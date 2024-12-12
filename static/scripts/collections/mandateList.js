jQuery.fn.clientCodeSeekAutoComplete= function(mode) {
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
						mandateFilter(mode)
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
function showHistory(index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("current_index").value = index;
	frm.action = "showMandateHistory.hist";
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strAction, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.target ="";
	if (strAction == "AUTH")
		frm.action = "authViewMandate.form";
	else
		frm.action = "viewMandate.form";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(ctrl, index)
{
	var frm = document.forms["frmMain"]; 
	ctrl.className = "linkbox acceptedlink";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "acceptMandate.form";
	frm.method = 'POST';
	frm.submit();
}

function rejectRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"];

	if (strRemarks.length > 255)
	{
		alert(locMessages.ERR_REMARKS);	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.current_index.value = arrData[0];
		frm.target = "";
		frm.action = "rejectMandate.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function showAddNewForm(strUrl)
{
	window.location = strUrl;
}

function showWelcomePage()
{
	var frm = document.forms["frmMain"]; 
	frm.target ="";
	frm.action = "showWelcome.form";
	frm.method = 'POST';
	frm.submit();
}

function deleteRecord(ctrl, index)
{
	var frm = document.forms["frmMain"];
	ctrl.className = "linkbox deletedlink";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "deleteMandate.form";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "editMandate.form";
	frm.method = "POST";
	frm.submit();
}


function enableRecord(ctrl, index)
{
	var frm = document.forms["frmMain"]; 
	ctrl.className = "linkbox disablelink_grey";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "enableMandate.form";
	frm.method = "POST";
	frm.submit();
}

function disableRecord(ctrl, index)
{
	var frm = document.forms["frmMain"]; 
	ctrl.className = "linkbox enablelink_grey";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "disableMandate.form";
	frm.method = "POST";
	frm.submit();
}

function mandateFilter(strAction)
{
    var frm = document.forms["frmMain"];	
	var strUrl='';
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
	if ("AUTH" == strAction)
	   frm.action = "authMandate.form";
	else
	   frm.action = "mandateList.form"
	
	frm.method = "POST";
	frm.submit();
}


function undoRecord(ctrl, index)
{
	var frm = document.forms["frmMain"]; 
	ctrl.className = "linkbox deletedlink";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "undoMandate.form";
	frm.method = 'POST';
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


//List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
