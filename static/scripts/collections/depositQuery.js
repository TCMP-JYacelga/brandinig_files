function backFormSumm(){
 	var frm = document.forms["frmMain"];
  	frm.action = "depositInstrSummQueryList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function backFormDetail(){
 	var frm = document.forms["frmMain"];
  	frm.action = "backDepositInstrQueryList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showViewPir(productCode, Account){
    var frm = document.forms["frmMain"];
    document.getElementById('productCode').value = productCode ;
	document.getElementById('accountNumber').value = Account ;
	var cboDateFilter = document.getElementById('cboDateFilter');
	frm.action = "depositInstrQuerySummList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showViewPir(productCode, Account){
    var frm = document.forms["frmMain"];
    document.getElementById('productCode').value = productCode ;
	document.getElementById('accountNumber').value = Account ;
	var cboDateFilter = document.getElementById('cboDateFilter');
	frm.action = "depositInstrQuerySummList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showDepositHeaderList(strUrl, me)
{ 
	var frm = document.forms["frmMain"];
	showDateRange(me) ;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showDateRange(ctrl) 
{
	if ("7" == ctrl.options[ctrl.selectedIndex].value)
		$("#divDateRange").toggleClass("ui-helper-hidden", false);
	else
		$("#divDateRange").toggleClass("ui-helper-hidden", true);
}

function showAdvancedFilter(fptrCallback)
{
	var dlg = $('#advanceFilter');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:650,title : 'Advanced Filter',
					buttons: {"Continue": function() {$(this).dialog("close"); fptrCallback.call(null, 'depositQueryList.form');},
					"Cancel": function() {$(this).dialog('close'); }},
					open: function(){
						$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
			            $('.ui-dialog-buttonpane').find('button:contains("Continue")').attr("title","Continue");
			            $('.ui-dialog-buttonpane').find('button:contains("Continue")').find('.ui-button-text').prepend('<span class="fa fa-play-circle">&nbsp;&nbsp</span>');
			            
			            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
			            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
					}
	});
	dlg.dialog('open');
}

function showAdvancedInstFilter(fptrCallback)
{
	var dlg = $('#advanceFilter');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:650,title : 'Advanced Filter',
		buttons: {"Continue": function() {$(this).dialog("close"); fptrCallback.call(null, 'depositInstrQueryList.form');},
		Cancel: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
}

function showDepositQueryList(strUrl)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
	//document.getElementById("myProduct").value=document.getElementById("myProduct1").value;
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showInstQueryList(strUrl)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
	//document.getElementById("myProduct").value=document.getElementById("myProduct1").value;
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function filter(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function submitForm(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method='POST';
	frm.submit();
}

function showBackPage(strAction)
{
	var frm = document.forms["frmMain"];
	frm.target ="";

	frm.method = 'POST';
	frm.submit();
	return true;
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function backForm()
{
	var frm = document.forms["frmMain"];
	if(_mode == "VIEW_DETAIL")
		strUrl = "backDepositQueryList.form";
	else if (_mode == "INST_DETAIL")
		strUrl = "viewDepositQueryDetail.form";
	else if (_mode == "INST_VIEW")
		strUrl = "depositQueryInstrList.form";
	else if (_mode == "VIEW")	
		strUrl = "depositInstrQueryList.form";

	frm.action = strUrl;
	frm.target = "";
	frm.method='POST';
	frm.submit();

}
function showInstList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method='POST';
	frm.submit();
}

function downloadDeposit(strUrl)
{	
	var frm = document.forms["frmMain"];	
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showDetailViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	if(_mode == "LIST" || _mode == "BACK_LIST")
		strUrl = "viewDepositInstrQuery.form";
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getRecord(json, elementId)
{	
	var myJSONObject = JSON.parse(json);	
    var inputIdArray = elementId.split("|");
    for (i=0; i < inputIdArray.length; i++)
	{
    	if (document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
			if (null == myJSONObject.columns[i].value)
				myJSONObject.columns[i].value = "";
    		var type = document.getElementById(inputIdArray[i]).type;
    		if (type == 'text')
    			document.getElementById(inputIdArray[i]).value = myJSONObject.columns[i].value;
    		else
    			document.getElementById(inputIdArray[i]).innerHTML = myJSONObject.columns[i].value; 
    	}
	}    
}