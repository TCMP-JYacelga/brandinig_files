jQuery.fn.corpCodeSeekAutoComplete= function(summaryURL) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/foreCorpSeek.json",
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
								$('#txtBillMyClientDesc').val(data.DESCR);
								$('#txtBillMyClientCode').val(data.CODE);
								$('#CorpCode').val(data.CODE);
							}
							goToPage(summaryURL,'frmMain');
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
jQuery.fn.sellerCodeSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/foreSellerIdSeek.json",
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
														label : item.CODE,														
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
							if (!isEmpty(data.DESCRIPTION))
							{
								$('#txtMySellerDesc').val(data.DESCRIPTION);
								$('#txtMySellerCode').val(data.CODE);
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

jQuery.fn.clientCodeSeekAutoComplete= function(seller) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/foreuserclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$sellerCode : seller,
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
								$('#txtBillMyClientDesc').val(data.DESCR);
								$('#txtBillMyClientCode').val(data.CODE);
							}
							
							if(pagemode=='AUTH' && accessauth)
							{
								
							  goToPage('forecastAuthList.form','frmMain');
							}
							else
							{
								
							  goToPage('forecastList.form','frmMain');
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

jQuery.fn.clientCodeSeekAutoCompleteEntry= function(seller) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/foreuserclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$sellerCode : seller,
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
								$('#txtBillMyClientDesc').val(data.DESCR);
								$('#txtBillMyClientCode').val(data.CODE);
							}
						}
						reloadPage();
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
function goToPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showList(strUrl)
{
	if (formName=="Entry")
		strUrl="forecastList.form";
	else if(formName=="List")
		strUrl="welcome.jsp";
	else if(formName=="View")
	{
		if(mode=="AUTHVIEW")
			strUrl="forecastAuthList.form";
		else if(mode=="VIEWDETAIL")
			strUrl="showForecastHistoryList.form";
		else
			strUrl="forecastList.form";
	}
	window.location = strUrl;
}

function showAddNewForm(strUrl)
{
	window.location = strUrl;
}

function showHistoryForm(strUrl, index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(url,index)
{
	var frm = document.forms["frmMain"];
	var strUrl = null;
	frm.txtSummaryIndex.value = index;
	if(url != null && url != "")
	 	strUrl = url;
	if(pagemode=="AUTH")
		strUrl="authViewForecast.form";
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function disableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

/*function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function rejectRecord(arrData, retVal)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = arrData[1];

	if(retVal.length > 255)
	{
		showError("Reject Remarks Length Cannot Be Greater than 255 Characters", null);
		return false;
	}

	frm.rejectRemarks.value = retVal;
	frm.action = arrData[0];
	frm.method = "POST";
	frm.submit();
}*/

// List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"];
	frm.txtCurrent.value = intPg;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"];
	frm.txtCurrent.value = intPg;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

// Details
function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function orderByCond1Selected()
{

	var frm = document.forms["frmMain"];
	var cond1Var = frm.orderByCond1.value;
	if ( cond1Var == "")
	{
		showError('Please Enter value in Order By!',null)
		return;
	}
	if ( cond1Var == "None")
	{
		frm.orderByCond2.disabled = true;
		frm.orderByCond3.disabled = true;
		frm.orderByCond4.disabled = true;
		frm.orderByCond5.disabled = true;
	}
	else
	{
		frm.orderByCond2.disabled = false;
		frm.orderByCond3.disabled = false;
		frm.orderByCond4.disabled = false;
		frm.orderByCond5.disabled = false;
	}
}

function orderByCond2Selected()
{
	var frm = document.forms["frmMain"];
	var cond2Var = frm.orderByCond2.value;
	var cond1Var = frm.orderByCond1.value;
	if (cond1Var == cond2Var)
	{
		showError('This item is already selected ..Please select some other value! ',null);
		return;
	}
	if ( cond2Var == "None")
	{
		frm.orderByCond3.disabled=true;
		frm.orderByCond4.disabled=true;
		frm.orderByCond5.disabled=true;
	}
	else
	{
		frm.orderByCond3.disabled = false;
		frm.orderByCond4.disabled = false;
		frm.orderByCond5.disabled = false;
	}
}

function orderByCond3Selected()
{
	var cond3Var = frm.orderByCond3.value;
	var cond2Var = frm.orderByCond2.value;
	var cond1Var = frm.orderByCond1.value;


	if (cond1Var == cond3Var)
	{
		showError('This item is already selected ..Please select some other value! ',null);
		return;
	}
	if (cond2Var == cond3Var)
	{
		showError('This item is already selected ..Please select some other value! ',null);
		return;
	}
	if ( cond3Var == "None")
	{
		frm.orderByCond4.disabled=true;
		frm.orderByCond5.disabled=true;
	}
	else
	{
		frm.orderByCond4.disabled = false;
		frm.orderByCond5.disabled = false;
	}
}

function orderByCond4Selected()
{
	var frm = document.forms["frmMain"];
	var cond4Var = frm.orderByCond4.value;
	var cond3Var = frm.orderByCond3.value;
	var cond2Var = frm.orderByCond2.value;
	var cond1Var = frm.orderByCond1.value;


	if (cond1Var === cond4Var)
	{
		showError('This item is already selected ..Please select some other value! ',null);
		return;
	}
	if (cond2Var === cond4Var)
	{
		showError('This item is already selected ..Please select some other value! ',null);
		return;
	}
	if (cond3Var === cond4Var)
	{
		showError('This item is already selected ..Please select some other value! ',null);
		return;
	}
	if ( cond4Var === "None")
	{
		frm.orderByCond5.disabled=true;
	}
	else
	{
		frm.orderByCond5.disabled = false;
	}

}

function orderByCond5Selected()
{
	var frm = document.forms["frmMain"];
	var cond5Var = frm.orderByCond5.value;
	var cond4Var = frm.orderByCond4.value;
	var cond3Var = frm.orderByCond3.value;
	var cond2Var = frm.orderByCond2.value;
	var cond1Var = frm.orderByCond1.value;

	if ( cond5Var === "None")
	{
		showError('Condition 5 is None!')
	}
	if (cond1Var === cond5Var)
	{
		showError('This item is already selected ..Please select some other value! ',null);
		return;
	}
	if (cond2Var === cond5Var)
	{
		showError('This item is already selected ..Please select some other value! ',null);
		return;
	}
	if (cond3Var === cond5Var)
	{
		showError('This item is already selected ..Please select some other value! ',null);
		return;
	}
	if (cond4Var === cond5Var)
	{
		showError('This item is already selected ..Please select some other value! ',null);
		return;
	}
}

function advFilter(strUrl)
{
	var frm = document.forms["frmMain"];
	if(frm.forecastDateFrom.value == "")
	{
		showError('Please select value For forecast Date From!');
		return;
	}
	if(frm.forecastDateTo.value == "")
	{
		showError('Please select value For forecast Date From!');
		return;
	}
	if(frm.orderByCond1.value == "")
	{
		showError('Please select value For Order By!');
		return;
	}
	if(frm.forecastExpectationFrom.value > 100 || frm.forecastExpectationFrom.value < 0)
	{
		showError('Forecast Expectation From value should be within 0-100 range!',null);
		return;
	}

	if(frm.forecastExpectationTo.value > 100 || frm.forecastExpectationTo.value  < 0)
	{
		showError('Forecast Expectation To value should be within 0-100 range!',null);
		return;
	}

	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function downloadHistory(strUrl)
{
	var temp = document.getElementById("btnPrintxls");
	if (temp.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showHistoryList(strUrl)
{
	var frm = document.forms["frmMain"];
	var index = 1;
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	if(validate())
	{
		var frm = document.forms["frmMain"];
		frm.txtIndex.value = index;
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
	}
}
function filterList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function download(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function validate()
{
	var frm = document.forms["frmMain"];
/*	if(isNaN(frm.accountId.value))
	{
		alert("Please Enter the Number Only");
		frm.accountId.focus();
		return false;
	}
*/	return true;
}

function getAdditionalInfo()
{
	var frm = document.forms["frmMain"];
	var forecastMyProd = frm.forecastMyproduct.value;
	if(forecastMyProd != null && forecastMyProd != "")
	{

		frm.action = "forecastAdditionalInfo.form";
		frm.method = "POST";
		frm.submit();
	}
}


function setProductType()
{
	var frm = document.forms["frmMain"];
	var forecastMyProd = frm.forecastMyproduct.value;
	if(forecastMyProd != null && forecastMyProd != "")
	{
		frm.action = "forecastUpdateAdditionalInfo.form";
		frm.method = "POST";
		frm.submit();
	}
}

function getClient1()
{
	var frm = document.forms["frmMain"];
	var forecastMyProd = frm.forecastMyproduct.value;
	if(forecastMyProd != null && forecastMyProd != "")
	{
		frm.action = "forecastAdditionalInfo.form";
		frm.method = "POST";
		frm.submit();
	}
}


function showWelcomePage()
{
	window.location = "/WEB-INF/secure/welcome.jsp";
}

function showBackPage(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


function setACcy()
{
	var arr = null;
	var frm = document.forms["frmMain"];
	var glId = frm.glId.value;
/*	var acctId = frm.accountId.value;

	arr = acctId.split('|');
	frm.accountId.value = arr[5];
*/	if(glId != null && glId != " ")
	{
		frm.action = "forecastAcctCurr.form";
		frm.method = "POST";
		frm.submit();
	}
}

function setdtlno()
{
	var frm = document.forms["frmMain"];
	var glId = frm.glId.value;
/*	var acctId = frm.accountId.value;

	arr = acctId.split('|');
	frm.accountId.value = arr[5];
*/	if(glId != null && glId != " ")
	{
		frm.action = "forecastUpdateAcctCurr.form";
		frm.method = "POST";
		frm.submit();
	}
}


function goPgNmbr(strUrl, totalPages)
{
	var frm = document.forms["frmMain"];
	var pgNmbr = frm.goPageNumbr.value;
	frm.txtCurrent.value = pgNmbr - 1 ;
	if (pgNmbr > totalPages)
	{
			alert('Page Number cannot be greater than total number of pages!');
			return;
	}
	else if (pgNmbr==0)
	{
			alert('Page Number cannot be Zero!');
			return;
	}

	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


function Save()
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = actionUrl;
	frm.method = "POST";
	frm.submit();
	return true;
}


function getHelpForAccount(inputId, elementId, descriptionId, salt, validationType)
{
	var frm = document.forms["frmMain"];
	var forecastMyProd = frm.forecastMyproduct.value;
	if(forecastMyProd != null && forecastMyProd != "")
	{
		inputId = "userCode|forecastMyproduct|glId|";
		salt = salt4;
	}

	getHelp(inputId, elementId, descriptionId, salt, validationType);
}

function fupper(o)
{
	o.value=o.value.toUpperCase().replace(/([^0-9A-Z])/g,"");
}
function getRecord(json,elementId)
{
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length; i++)
    {
    	var field = inputIdArray[i];
        if(document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
        {
        	var type = document.getElementById(inputIdArray[i]).type;
	        if(type=='text')
	        {
	        	document.getElementById(inputIdArray[i]).value = myJSONObject.columns[i].value;
	        }
	        else if(type=='hidden')
	        {
	        	document.getElementById(inputIdArray[i]).value = myJSONObject.columns[i].value;
	        }
	        else
	        {
	        	document.getElementById(inputIdArray[i]).innerHTML = myJSONObject.columns[i].value;
	        }
        }
     }
    if (mode == "EDIT" || mode == "UPDATE")
    	setdtlno();
    else
    	setACcy();
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
		frm.action = 'rejectForecast.form';
		frm.method = "POST";
		frm.submit();
	}
}
// Added for forecast common list actions
function showAccountFilterList(strUrl, me)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
	if (me.value == "0")
	{
//		$('#myProduct').val('');
//		$('#myProduct1').val('');
//		$('#qryPhdReference').val('');
	}
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function shoAddForecast(strUrl)
{
	var frm = document.forms["frmMain"];
	$('#viewState').val('');
	document.getElementById("glId").value = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}
function authSubmit(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "acceptForecast.form";
	frm.method = "POST";
	frm.submit();
}
function getRejectRecord(me, rejTitle, rejMsg)
{
	var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230, rejTitle, rejMsg, [document.getElementById("updateIndex").value], rejectRecord);
}
function rejectRecord(arrData, strRemarks)
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
		document.getElementById("txtIndex").value = arrData;
		frm.target = "";
		frm.action = "rejectForecast.form";
		frm.method = 'POST';
		frm.submit();
	}
}
function deleteRecord(me)
{
	var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "undoForecast.form";
	frm.method = "POST";
	frm.submit();
}
function populateData(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	if(pagemode=='AUTH' && accessauth)
		frm.action = "forecastAuthList.form";
	else
		frm.action = strUrl;
	
	frm.method = "POST";
	frm.submit();
}
function showAdvancedFilter(fptrCallback)
{
	var dlg = $('#advanceFilter');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:true, width:520,title : 'Advanced Filter',
					buttons: 
						{
							"Search": function() {$(this).dialog("close"); fptrCallback.call(null, 'forecastList.form');},
							"Cancel": function() {$(this).dialog('close'); 
						}
					},
					open: function() {
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
           
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');

            $('.ui-dialog-buttonpane').find('button:contains("Search")').attr("title","Search");
            $('.ui-dialog-buttonpane').find('button:contains("Search")').find('.ui-button-text').prepend('<span class="fa fa-filter">&nbsp;&nbsp</span>');
        }
				});
	dlg.dialog('open');
}
function showQueryList(strUrl)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
    var frm = document.forms["frmMain"];
	if(pagemode=='AUTH' && accessauth)
		strUrl = "forecastAuthList.form";
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function acceptRecord(ctrl, status, index, maker)
{
	var strAuthIndex = document.getElementById("updateIndex").value;
	var strActionMap = document.getElementById("actionmap").value;
	if (index.length < 2)
	{
		index = '0' + index;
	}
	var aPosition = strAuthIndex.indexOf(index);
    var mapPosition;
	//alert('index' + index);
	var strCurrentAction;
	var strDelimAction;
	var lenDelimAction;
	var strArrSplitAction;
	var strFinalBitmap =document.getElementById("bitmapval").value;
	var lenLooplen;
	if (aPosition >= 0)
	{
		//alert('Removing');
		//alert('stractionmap' + strActionMap);
		document.getElementById("updateIndex").value = strAuthIndex.replace(strAuthIndex.substring(aPosition, aPosition + 2),"");
		mapPosition = strActionMap.indexOf(index+":");
		//alert('map position' + mapPosition);
		document.getElementById("actionmap").value = strActionMap.replace(strActionMap.substring(mapPosition, mapPosition + 9),"");
		//alert('Final Value' +  document.getElementById("actionmap").value) ;
	}
	else
	{
		//alert('Adding');
		document.getElementById("updateIndex").value = index+ ","+document.getElementById("updateIndex").value ;
		//alert('mode ' + mode + 'Request state ' +  status);
		strCurrentAction = arrForecast[status];

		document.getElementById("actionmap").value = index+":"+ strCurrentAction +","+document.getElementById("actionmap").value ;
		//alert('Final Value' +  document.getElementById("actionmap").value) ;
	}
	if (ctrl.className.indexOf("acceptlink") > -1)
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}
	// perform the operation of bitwise anding
	//alert(mode +":"+ _strValidActions + ":" +status);
	lenDelimAction = document.getElementById("actionmap").value.length;
	if (lenDelimAction > 1)
	{
		strDelimAction = document.getElementById("actionmap").value;
		strDelimAction = strDelimAction.substring(0, lenDelimAction-1);
		strArrSplitAction = strDelimAction.split(",");
		for (var i=0;i<strArrSplitAction.length;i++)
		{
			strArrSplitAction[i] = strArrSplitAction[i].substring(strArrSplitAction[i].indexOf(":")+1);
		}
		//alert('Binaries :: ' + strArrSplitAction);

		if (strArrSplitAction.length==1)
		{
			strFinalBitmap = strArrSplitAction[0];
		}
		else
		{
				lenLooplen =strArrSplitAction.length-1;
				//alert('Loop len' + lenLooplen);
				for (var j=0; j<lenLooplen ; j++)
				{
					if (j==0)
					{
						//alert('Anding the first');
						strFinalBitmap = performAnd(strArrSplitAction[j],strArrSplitAction[j+1]);
					}
					else
					{
						//alert('Anding the Subsequent');
						strFinalBitmap = performAnd(strFinalBitmap,strArrSplitAction[j+1]);
					}
				}
		}
		//alert('Final Bitmap ::: ' + strFinalBitmap);
		document.getElementById("bitmapval").value=	strFinalBitmap;
		refreshButtons(maker);
	}
	else
	{
		strFinalBitmap = _strValidActions;
		document.getElementById("bitmapval").value=	strFinalBitmap;
		refreshButtons(maker);
	}
}
function performAnd(validAction,currentAction)
{
	var strOut="";
	var i=0;
	if (validAction.length = currentAction.length)
	{
		for (i=0; i<3; i++)
		{
			strOut = strOut +((validAction.charAt(i)*1) && (currentAction.charAt(i)*1));
		}
	}
	return strOut;
}
function refreshButtons(maker)
{
	var strPopultedButtons=document.getElementById("bitmapval").value;
	var strActionButtons;
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd(strPopultedButtons,_strServerBitmap);
	//alert('the final bitmap::' + strActionButtons);
	var i=0;
	if (strActionButtons.length > 0)
	{
		for (i=0; i<3; i++)
		{
				switch (i)
				{
					case 0:
						if( pagemode=='AUTH' && accessauth ) {	
							if (strActionButtons.charAt(i)*1 ==1 &&  maker != _strUserCode)
							{
								document.getElementById("btnAuth").className ="imagelink black inline_block button-icon icon-button-accept font_bold";
							}
							else
							{
								document.getElementById("btnAuth").className ="imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
							}
						}	
					break;

					case 1:
						if( pagemode=='AUTH' && accessauth ) {	
							if (strActionButtons.charAt(i)*1 ==1 &&  maker != _strUserCode)
							{
								document.getElementById("btnReject").className ="imagelink black button-icon icon-button-reject font_bold";
							}
							else
							{
								document.getElementById("btnReject").className ="imagelink grey button-icon icon-button-reject-grey font-bold";
							}
						}		
					break;

					case 2:
						if( pagemode !='AUTH' &&  !!accessauth ) {		
							if (strActionButtons.charAt(i)*1 ==1)
							{
								document.getElementById("btnDiscard").className ="imagelink black button-icon icon-button-discard font_bold";
							}
							else
							{
								document.getElementById("btnDiscard").className ="imagelink grey button-icon icon-button-discard-grey font-bold";
							}
						}	
					break;
				}
		}
	}
}
function clearFields()
{
	if(document.getElementsByName("isRepetitive")[1] != null && document.getElementsByName("isRepetitive")[1].checked == true && document.getElementsByName("isRepetitive")[1].value=='N')
	{
			document.getElementById("frequencyCode").value="";
			document.getElementById("frequencyCode").disabled=true;
			document.getElementById("startEffectiveDate").value="";
			document.getElementById("endEffectiveDate").value="";
			document.getElementById("startEffectiveDate").readOnly=true;
			document.getElementById("endEffectiveDate").readOnly=true;
			document.getElementById("startEffectiveDate").disabled= true;
			document.getElementById("endEffectiveDate").disabled= true;
			document.getElementsByName("autoCloseFlag")[1].disabled=false;
	    	document.getElementById("autoCloseDays").readOnly = false;
	    	
	}
	else
	{
		document.getElementsByName("autoCloseFlag")[1].disabled=true;
    	document.getElementById("autoCloseDays").readOnly = true;
	}	
}
function dow(obj)
{
	var elename = obj.name;
	var element = document.getElementsByName(elename);
	for(i=0;i<element.length;i++)
	{
		if(obj.id != element[i].id)
		{
			element[i].checked =false;
		}
		else
		{
			element[i].checked =true;
		}
	}
}

function test(obj)
{
	var autoCloseDays = document.getElementById("autoCloseDays");
	autoCloseDays.value= "0";
	if(obj.value=='Y')
	{
		autoCloseDays.readOnly = false;
		autoCloseDays.disabled = false;
	}
	else
	{
		autoCloseDays.readOnly = true;
		autoCloseDays.disabled = true;
	}
}

function checkExpectation()
{
	var expectation = document.getElementById("forecastExpectation").value;
	if(parseInt(expectation,10) < 0 )
	{
		showError('Expectation cannot be negative !',null);
		document.getElementById("forecastExpectation").value = 0;
	}
	if(parseInt(expectation,10) > 100 )
	{
		showError('Expectation cannot be greater than 100 !',null);
		document.getElementById("forecastExpectation").value = 0;
	}
}
function showViewCcyForm(url,colType)
{
	var frm = document.forms["frmMain"];
	var strUrl = null;
	document.getElementById("ccyCode").value = colType;
	if(url != null && url != "")
	 	strUrl = url;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function OnChangeFormatAmount( me )
{
	if( isNaN( parseFloat( me.value ) ) )
		return false;
	me.value = parseFloat( me.value ).toFixed( 2 );
}