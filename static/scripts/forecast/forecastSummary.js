function showList(strUrl)
{
	window.location = strUrl;
}
function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function showViewActivitiesForm(strUrl, index,passDate)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	document.getElementById("inputDate").value = passDate;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function filter(strUrl)
{
	var frm = document.forms["frmMain"];
	$.blockUI({message: '<h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2>', timeout:2000,
		css:{ height:'32px',padding:'8px 0 0 0'}});
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function tabFilter(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
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

function viewRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showBackPage(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showHistoryInfo(strFrmId, intRec, tokId, tokVal) {
	var strData = {};
	$.blockUI({message: '<h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2>', timeout:2000,
		css:{ height:'32px',padding:'8px 0 0 0'}});
	strData["txtIndex"] = intRec;
	strData["viewState"] = $('#viewState').val();
	strData[tokId] = tokVal;
	$.post('forecastSummHistory.form', strData, paintHistoryInfo, "json");
	return false;
}
function paintHistoryInfo(data) {
	var cntr, lbl, spn,row, cntr, acTbl,dataCol;
	var actData = data.forcastData;
	if (isEmpty(actData)) return false;
	var dlg = $('#addiInfo');
	dlg.children("#fld_forecastAccount").text(actData.accountNmbr);
	dlg.children("#fld_forecastDate").text(actData.forecastDate);
	dlg.children("#fld_forecastreference").text(actData.forecastRef);
	dlg.children("#fld_forecastType").text(actData.forecastType);
	dlg.children("#fld_forecastMyProduct").text(actData.forecastMyp);
	dlg.children("#fld_forecastAmount").text(actData.forecastAmnt);
	
	acTbl = dlg.children('#info_fields').children("#acTable");
	acTbl.children('tbody').remove();
	cntr = 0;
	row = $('<tr></tr>');

	// Add dynamic fields
	for (key in actData) {
		if (key.match(/^info/)) {
			cntr++;
			lblCol = null;
			dataCol = null;
			dataCol = $('<td>' + actData[key] + '</td>');
			row.append(dataCol);
			if (cntr % 8 == 0) {
				acTbl.append(row);
				row = $('<tr></tr>');
			}
		}
	}
	if (cntr % 8 != 0) {
		row.append(dataCol);
		acTbl.append(row);
	}	

	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:900,
				beforeClose: function(event, ui) {},
				buttons: {"Ok": function() {$(this).dialog("destroy");}}});
	dlg.dialog('open');
	return false;
}

function showQueryList(strUrl)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showAdvancedFilter(fptrCallback, strUrl)
{
	var dlg = $('#advanceFilter');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:true, width:580,title : 'Advanced Filter',
					buttons: {"Search": function() {$(this).dialog("close"); fptrCallback.call(null, strUrl);},
					Cancel: function() {$(this).dialog('close'); }},
					open: function(){
						$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
						
						$('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
			            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');

			            $('.ui-dialog-buttonpane').find('button:contains("Search")').attr("title","Search");
			            $('.ui-dialog-buttonpane').find('button:contains("Search")').find('.ui-button-text').prepend('<span class="fa fa-filter">&nbsp;&nbsp</span>');
					}
	});
	dlg.dialog('open');
}
function showHistoryForm(strUrl, index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=600,height=500";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";
	window.open ("", "hWinHistory", strAttr);
	frm.submit();
	frm.target = "";
}

function showDateRange(ctrl) 
{
	if ( ctrl != null && "R" == ctrl.options[ctrl.selectedIndex].value)
		$("#divDateRange").toggleClass("ui-helper-hidden", false);
	else
		$("#divDateRange").toggleClass("ui-helper-hidden", true);
}

function showForecastView(url,index)
{
	var strUrl = null;
	var frm = document.forms["frmMain"];
	$.blockUI({message: '<h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2>', timeout:2000,
		css:{ height:'32px',padding:'8px 0 0 0'}});
	if(url != null && url != "")
	 	strUrl = url;
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


function setForecastTypeToAllChecked()
{
	document.getElementById("forecastType1").checked = true;
	document.getElementById("forecastType2").checked = true;
	document.getElementById("forecastType3").checked = true;
	document.getElementById("forecastType4").checked = true;
	document.getElementById("forecastType5").checked = true;
	document.getElementById("forecastType6").checked = true;
	document.getElementById("forecastType7").checked = true;
}
