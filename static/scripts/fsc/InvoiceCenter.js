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
						goToPage('simpleFilterInvoice.form','frmMain');
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

function getRejectPopup() {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Cancel" : function() {
				$('#txtAreaRejectRemark').val('');
				$(this).dialog("close");
				},
				"Go" : function() {
					 rejectInvoices("rejectInvoice.form", "frmMain");
				}
		}
	});
	$('#rejectPopup').dialog("open");
}
function getRejectViewPopup() {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Cancel" : function() {
				$(this).dialog("close");
				},
				"Go" : function() {
					rejectViewedInvoice('rejectViewedInvoice.form','frmMain');
				}
		}
	});
	$('#rejectPopup').dialog("open");
}
/*
function getPaymentPopUp(index) {
$('#txtInvPayIntRefNum1').val(index);
	$('#paymentPopUp').dialog( {
		autoOpen : false,
		resizable : false,
		width : 480,
		height : 225,
		modal : true,
		position : [ 'center', 'middle' ],
		buttons : {
			"Cancel" : function() {
				$(this).dialog("close");
			}
		}
	});
	$('#paymentPopUp').dialog("open");
}
*/

function getPaymentPopUp(index)
{
    var frm = document.getElementById("frmMain");
    $('#txtInvPayIntRefNum').val(index);
    frm.action = 'invoicePayment.form';    
    frm.target = "";
    frm.method = "POST"    
    frm.submit();
    
}

jQuery.fn.invoiceClientAutoComplete= function() {
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
								$('#addInvoiceClientDesc').val(data.DESCR);
								$('#addInvoiceClientCode').val(data.CODE);
							}
							addInvoiceClientFilter();
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

function showAcceptancePopup(arrSelectedRecords) {
	$('#verifyPopup').dialog( {
		autoOpen : false,
		resizable : false,
//		height : 150,
		width : 420,
		modal : true,
		draggable : false,
		position : [ 'center', 'middle' ]
//		buttons : {
//			"Cancel" : function() {
//				$(this).dialog("close");
//			},
//			"Accept" : function() {
//				$(document).trigger('handlePOverifyAction', ['services/invoiceCenter/verifyAccept.json', arrSelectedRecords, 'verifyAccept']);
//				$('#verifyPopup').dialog("close");
//			},
//			"Reject" : function() {
//				$(document).trigger('handlePOverifyAction', ['services/invoiceCenter/verifyReject.json', arrSelectedRecords, 'verifyReject']);
//				$('#verifyPopup').dialog("close");
//			}
//		},
//		open:function(){
//			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
//			$('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
//            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
//		}
	});
	$('#verifyPopup').dialog("open");
	
	$('#invoiceCancelButton').unbind('click');
	$('#invoiceCancelButton').click(function(){
		$('#verifyPopup').dialog("close");
	});
	
	$('#invoiceRejectButton').unbind('click');
	$('#invoiceRejectButton').click(function(){
		$(document).trigger('handlePOverifyAction', ['services/invoiceCenter/verifyReject.json', arrSelectedRecords, 'verifyReject']);
		$('#verifyPopup').dialog("close");
	});
	
	$('#invoiceAcceptButton').unbind('click');
	$('#invoiceAcceptButton').click(function(){
		$(document).trigger('handlePOverifyAction', ['services/invoiceCenter/verifyAccept.json', arrSelectedRecords, 'verifyAccept']);
		$('#verifyPopup').dialog("close");
	});
}