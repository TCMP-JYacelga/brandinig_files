//Search On Page
function searchOnPage()
{
	var srhChars = document.getElementById("textfield-1179-inputEl").value;

	var doReset = false;
	//Check blank/null value
	if ($.trim(srhChars) == "") {
		doReset = true;
	}
    //alert('search On page For : ' + srhChars);

				var grd = $('div.flexigrid');

				//Define just text columns to search (EXCLUDE columns having icons)
				var col_list = new Array(2,4,5,7,8,9);
				
				for (var m=0; m<col_list.length; m++) {
						//alert ("loop...: tr td:nth-child("+col_list[m]+") div");
				//Navigate thru given column list in flexigrid table 
				$('tr td:nth-child('+col_list[m]+') div', grd).each(function(i){ 
					//alert($(this).text());
					searchOnGivenColumn(doReset,srhChars,$(this),i);
				});
				}//for
	
}
function searchOnGivenColumn(doReset,srhChars,obj,i)
{
	//var visColValue = [];
						//alert(this.innerText.toLowerCase());

						//extract .text() which is plain text without html tags and
						//         also without <span> tags added for previous search highlight
								//alert("In..."+$(obj).text());
						var str = $(obj).text();
								//alert("["+i+"]"+str);
					if (doReset) {
							//alert("["+i+"]"+$(obj).html());
							//alert("["+i+"]"+str);
						$(obj).html(str);
						//$(obj).html(do_srhPg_reset(str));
					} else {
						//alert (str.toLowerCase() +'] ['+srhChars.toLowerCase());
						//var index = str.toLowerCase().indexOf(srhChars.toLowerCase());
						var index = str.search(new RegExp(srhChars, "ig"));
						if (index != -1) {
							//alert("["+i+"] index: "+index + str );
							str = do_srhPg_highlight(str,srhChars);
							//alert("["+i+"]"+"new string: " + str );
						} else {
							//alert("not found" );
							//str = do_srhPg_reset(str);
						}
						$(obj).html(str);
						//visColValue.push(str);
					}
				//alert('Matched Strings: ' + visColValue);
}

function do_srhPg_highlight(str,srhChars) {
	  function highlightStr(match)
		{
				//alert("Match: "+match);
				return "<span style=\"background-color:yellow\">" + match+ "</span>";
		}
	var regEx = new RegExp(srhChars, "ig");
    str = str.replace(regEx, highlightStr);
	return str;
}
/*
Following funxtions useful to selectively remove any html tags
  e.g. str = do_srhPg_reset(str);
function do_srhPg_reset(str) {
    var replace = new Array("<span style=\"background-color:yellow\">", "</span>");
    var by = new Array("", "");
	return do_string_replace(str,replace,by);
}
function do_string_replace(str,replace,by) {
    for (var i=0; i<replace.length; i++) {
        str = str.replace(new RegExp(replace[i], "g"), by[i]);
    }
	return str;
}
*/

// For Sort Grid Reports.
function changeReportCenterListSort(sortCol, sortOrd,colId) {
	var frm = document.getElementById('frmMain');
	//alert(sortCol+" "+ sortOrd+"   "+colId)
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if (!isEmpty(sortCol)) 
	{
		if(sortCol == "col_repname" && isEmpty(sortOrd))
			sortOrd = "desc";
		if(isEmpty(sortOrd))
			sortOrd = "asc";
		document.getElementById("txtSortColName").value=sortCol;
		document.getElementById("txtSortOrder").value= sortOrd;
		document.getElementById("txtSortColId").value=colId;
		//alert(document.getElementById("txtSortColId").value);
		frm.action = 'reportCenter.form';
   		frm.target = "";
   		frm.method = "POST";
   		frm.submit();
	}
	else {
	alert(_errMessages.ERR_NOFORM);
	return false;
	}
}

function showReportParam(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showReportSchedules(strUrl, strRepCode)
{
	document.getElementById("schReport").value = strRepCode;
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showPregenerated(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function GenerateReport(strUrl)
{
	if($('#errorDiv'))
		$('#errorDiv').hide();
	if(document.getElementById("rptorderid") != null){
		ordElemId = document.getElementById("rptorderid").value;
		setSelectedOrderData(ordElemId);
	}
	if(document.getElementById("columnBox1") != null){
		//var elem = document.getElementById("selectCol");
		//if(elem.value.trim() != ""){
			setSelectedColData();
		//}else{}
	}
	var elementId = null;
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	var strTxtCurrent = document.getElementById("txtCurrent").value;
	var viewState = document.getElementById("viewState").value;
	var multiValue = '';
	var multiDispalyValue = '';
	var index = 0;
	document.getElementById("current_index").value = strTxtCurrent;
	
	var disabledElementIds = [], count = 0;
	$( "#frmMain" ).find( 'input' ).each(function(index){
		if($(this).is(':disabled'))
			disabledElementIds[count++] = $(this).attr("id");
	});
	$( "#frmMain" ).find( 'select' ).each(function(index){
		if($(this).is(':disabled'))
			disabledElementIds[count++] = $(this).attr("id");
	});
	enableFieldsToSave();
	$('.jq-multiselect').each(function(i , element){
		if( $('#'+element.id).length > 0 )
		{
			multiValue = '';
			var elementName = "reportCenterParameterBean";
			index = element.id.substr(elementName.length, element.id.length);
			document.getElementById(elementName+"["+index+"].value").value = '';
			var checkedItems = $("#"+element.id).multiselect("getChecked");
			var allItems = $("#"+element.id).multiselect("getAllItems");
			if( allItems.length != checkedItems.length )
			{
				$("#"+element.id).multiselect("getChecked").map(function()
				{
					if(multiValue == '')
					{
					 	multiValue = this.value;
					 	multiDispalyValue = this.labels[0].title;
					}
					else
					{
						multiValue = multiValue+","+ this.value;
						multiDispalyValue = multiDispalyValue+","+ this.labels[0].title;
					}
						
				});
				document.getElementById(elementName+"["+index+"].value").value = multiValue;
			}
			else
			{
				document.getElementById(elementName+"["+index+"].value").value = "(ALL)";
			}
		}
	});
	$('form').find('.amountBox').each(function(){
       var self=$(this);
       var selfValue = self.autoNumeric('get');
       self.val(selfValue);
	});
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
	$(".amountBox").trigger("blur");
	for(var i=0; i < disabledElementIds.length; i++){
		elementId = disabledElementIds[i].replace(".","\\.");
		$('#'+elementId).attr("disabled", "true");
		$('#'+elementId).removeClass("enabled");
	}
	
}
function enableFieldsToSave()
{
	$( "#frmMain" ).find( 'input' ).addClass( "enabled" );
	$( "#frmMain" ).find( 'input' ).attr( "disabled", false );
	$( "#frmMain" ).find( 'select' ).addClass( "enabled" );
	$( "#frmMain" ).find( 'select' ).attr( "disabled", false );
}
function showViewReports(strUrl)
{
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function showBack(strUrl)
{
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}


function showSelectReports(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.elements['reportCode'].value = "";
	frm.elements['current_index'].value = "";
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function getRecord(json,elementId)
{		  
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
	
    for(i=0; i<inputIdArray.length; i++)
	{
    	var field = inputIdArray[i];
    	if(document.getElementById(inputIdArray[i]))
    	{
    	var type = document.getElementById(inputIdArray[i]).type;
    	if(type=='text'){
    	 document.getElementById(inputIdArray[i]).value = JSON.parse(myJSONObject).columns[0].value;}
    	else {
    	 document.getElementById(inputIdArray[i]).innerHTML = JSON.parse(myJSONObject).columns[0].value;} 
    	}
	}    
}

function savePrefReports(strUrl,index)
{
	var temp = document.getElementById("btnSave");
	if (temp.className.startsWith("rightAlign imagelink grey"))
	{
		return;
	}
	else
	{
		var repmodule = document.getElementById("module").value;
		var reptype = document.getElementById("type").value;
		$('#preftype').val(reptype); 
		$('#prefmodule').val(repmodule);	
		//var updSuccess = updateViewPref('{"repModule":"'+repmodule+'","repType":"'+reptype+'"}');
		//alert(updSuccess);
		var frm = document.forms["frmMain"]; 
		document.getElementById("current_index").value = index;
		frm.action = strUrl;
		frm.method = "POST";
		updateViewPref('{"repModule":"'+repmodule+'","repType":"'+reptype+'"}',frm);
		//frm.submit();
	}
}

function showMsgBoxforSavePref(yesRep,cancelRep,navType,newPage) {
	$('#confirmSave').dialog({
		autoOpen : false,				
		width : 500,
		modal : true,
		buttons: [{
                          id:"btn-no-rep",
                          text: cancelRep,
                          click: function() {
                        	  changePage(navType, newPage);
                                }
                        },{
                        	id:"btn-yes-rep",
                            text: yesRep,
                            click: function() {
							  savePrefReports('reportCenterSavePrefernce.form');
                                }
                        }],
		bgiframe:true, 
		height: 155,
		open : function()
		{
		$('#btn-no-rep').blur();
		$('#btn-yes-rep').blur();
		}
	});
	$('#confirmSave').dialog("open"); 
}

function showMsgBoxRepMax(btnOkRep) {
	var confirmbuttonsReportsMax = {};
	var confirmBtnsArrayMax = new Array();
	confirmBtnsArrayMax['btnOkRepMax'] = btnOkRep;
		
	confirmbuttonsReportsMax[confirmBtnsArrayMax['btnOkRepMax']] = function() {
		$(this).dialog("close");
	};

	$('#confirmMaxLimit').dialog({
		autoOpen : true,				
		width : 500,
		modal : true,
		buttons : confirmbuttonsReportsMax,				
		bgiframe:true, 
		height: 155
	});
	$('#confirmMaxLimit').dialog("open"); 
}

function toggleFavorite(ctrl, strRep, intPage, intIdx,nooffav)
{
	var frm, strTmp, arrTmp;
	var blnPresent = false;

	if (arrFavorites[strRep])
		blnPresent = true;
	
	frm = document.forms["frmMain"];
	strTmp = frm.favorites.value;
	
	if (isEmpty(strTmp))
		arrTmp = {};
	else
		arrTmp = JSON.parse(strTmp);
		
	var strKey = intPage + "_" + intIdx;
	
	if (arrTmp[strKey])
	{
		// We need to either remove the clicked account if it is not already a favorite account or mark it as to be removed
		// if it is already a favorite
	
		var objJson = arrTmp[strKey]
		
		var flg =objJson['remove'];
			
		if (!blnPresent)
		{
			if (flg){
			
				//if(totmarkedfavcount<5)
				//{
					objJson['remove'] = false;	
					$(ctrl).removeClass('icon-misc-nonfavorite');
					$(ctrl).addClass('icon-misc-selfavorite');
				//}
				//else
				//{
					//showMsgBoxRepMax(btnOkRep);
				//}
			}
			else {
			objJson['remove'] = true;
			$(ctrl).removeClass('icon-misc-selfavorite');
			$(ctrl).addClass('icon-misc-nonfavorite');
			totmarkedfavcount--;
			}
		}
		else
		{
			if (flg)
			{
			
				//if(totmarkedfavcount<5)
				//{
					objJson['remove'] = false;	
					$(ctrl).removeClass('icon-misc-nonfavorite');
					$(ctrl).addClass('icon-misc-favorite');
//				}else
				//{
					//showMsgBoxRepMax(btnOkRep);
				//}
			}
		else {
			objJson['remove'] = true;
			$(ctrl).removeClass('icon-misc-favorite');
			$(ctrl).addClass('icon-misc-nonfavorite');
			totmarkedfavcount--;
			}
		}
	}
	else
	{
		// Clicked account is to be marked as either favorite or non-favorite
		var objJson = {};
		objJson['report'] = strRep;
		if (blnPresent){
			objJson['remove'] = true;
			$(ctrl).removeClass('icon-misc-favorite');
			$(ctrl).addClass('icon-misc-nonfavorite');
			totmarkedfavcount--;
			}
		else {
			
				//if(totmarkedfavcount<5)
				//{
					objJson['remove'] = false;	
					$(ctrl).removeClass('icon-misc-nonfavorite');
					$(ctrl).addClass('icon-misc-selfavorite');
				//}
				//else
				//{
					//showMsgBoxRepMax(btnOkRep);
				//}
			}

		//if(totmarkedfavcount<5)
		//{	
		arrTmp[strKey] = objJson;
		//}
	}

	frm.favorites.value = JSON.stringify(arrTmp);

		var removereports = 0;
		var addreports = 0;
		var totalReportsCount=0;


		for(key in arrTmp)
		{
		var objJson = arrTmp[key];

		if(null != objJson)
		{
			var flg =objJson['remove'];
			
			if(arrFavorites[objJson['report']]){
				if(flg){
				removereports++;
				}
			}
			else 
			{
				if(!flg){
				addreports++;
				}
			}
		}
		}
		
		totFavcount = nooffav-removereports;
		
		totalReportsCount=totFavcount+addreports;
		
		totmarkedfavcount=totalReportsCount;
		

		for(key in arrTmp){
		var objJson = arrTmp[key];
		if(null != objJson){
			var flg =objJson['remove'];
			if(arrFavorites[objJson['report']]){
				if(flg){
					document.getElementById("btnSave").className ="imagelink black inline button-icon icon-button-submit font_bold";
					break;
				} else {
					document.getElementById("btnSave").className ="imagelink grey inline_block button-icon icon-button-save font_bold";
				}	
			} else {
				if(!flg){
					document.getElementById("btnSave").className ="imagelink black inline button-icon icon-button-submit font_bold";
					break;
				} else {
					document.getElementById("btnSave").className ="imagelink grey inline_block button-icon icon-button-save font_bold";					
				}
			}
		}
	}
		


	return false;
}

//Added By CHPL

/*function validateCurrentDate(usrdate,type,dtid)
{
	var one_day=1000*60*60*24;
	var todayDate=new Date();
	var todateDatetime=todayDate.getTime();
	var usrdate1=new Date(usrdate).getTime();
	var dateDiff =(todateDatetime-usrdate1)/one_day;
	if(dateDiff<0){
		alert(type+" Date should be less than Current Date");
		var vstdate = document.getElementById("viewFromdDate").value;
		$('#fromdt').val(vstdate);
	}
}
*/
//Added By CHPL
function validateDateRage(usrdate,dateId){
	var vtodate = document.getElementById("viewToDate").value;
	var vfromdate = document.getElementById("viewFromdDate").value;
	var ctodate = document.getElementById("todt").value;
	var cfromdate = document.getElementById("fromdt").value;
	if(validateDate(usrdate)){
		if(validateCurrentDate(usrdate,dateId)){
			var one_day=1000*60*60*24;
			if(dateId == "todt"){
				var todate1=new Date(usrdate).getTime();
				var fromdate1=new Date(cfromdate).getTime();
			}else{
				var todate1=new Date(ctodate).getTime();
				var fromdate1=new Date(usrdate).getTime();				
			}				
			var dateDiff =(todate1-fromdate1)/one_day;
			if(dateDiff<0){
				alert(" To Date should be Greater than From Date");
				if(dateId == "todt")
					$('#todt').val(vtodate);
				else
					$('#fromdt').val(vfromdate);		
			}
		}
	}else{
		if(dateId == "todt")
			$('#todt').val(vtodate);
		else
			$('#fromdt').val(vfromdate);	
	}
	return true;
}

function validateCurrentDate(usrdate, dateId)
{
	var one_day=1000*60*60*24;
	var todayDate=new Date();
	var todateDatetime=todayDate.getTime();
	var usrdate1=new Date(usrdate).getTime();
	var dateDiff =(todateDatetime-usrdate1)/one_day;
	var vstdate = document.getElementById("viewFromdDate").value;
	var vtodate = document.getElementById("viewToDate").value;
	if(dateDiff<0){
		if(dateId =="fromdt"){
			alert(" Form Date should be less than Current Date");
			$('#fromdt').val(vstdate);
		}
		else{
			alert(" To Date should be less than Current Date");
			$('#todt').val(vtodate);
		}
		return false;
	}
	return true;
}

function validateDate(date) {
    return (/^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/).test(date);
}

function removedivDialog(obj)
{	
	$('#'+obj).dialog('close');
}
function savemoreDates(moreid)
{
	var cfromdate =	document.getElementById("fromdt").value;
	var ctodate =	document.getElementById("todt").value;

	if(validateDateRage(cfromdate,"fromdt") && validateDateRage(ctodate,"todt")){
		document.getElementById("viewFromdDate").value=cfromdate;
		document.getElementById("viewToDate").value=ctodate;
		removedivDialog(moreid);
		var frm = document.forms["frmMain"]; 	
		frm.target ="";
		strUrl = 'reportCenter.form';
		frm.action = strUrl;
		frm.method = 'POST';
		frm.submit();		
	}
/*	var datesValid = false;
	var fromdate=document.getElementById("fromdt").value;
	var todate= document.getElementById("todt").value;
	$('#spn_FromDate').html(fromdate);
	$('#spn_FromDate').html(todate);
	// Convert both dates to milliseconds
	var ftdt=new Date(fromdate).getTime();
	var todt= new Date(todate).getTime();
	//Get 1 day in milliseconds
	var one_day=1000*60*60*24;
	// Calculate the difference in milliseconds
	var toDateDiff =( todt- ftdt)/one_day;
	if(toDateDiff<0){
		alert("To Date should be greater than from Date");
		$('#todt').focus();  
	}
	else if(fromdate==""|| todate=="" )
	{
		alert(" Enter Both Dates ");
	}
	else{
		document.getElementById("viewFromdDate").value=fromdate;
		document.getElementById("viewToDate").value=todate;
		removedivDialog(moreid);
		var frm = document.forms["frmMain"]; 	
		frm.target ="";
		strUrl = 'reportCenter.form';
		frm.action = strUrl;
		frm.method = 'POST';
		frm.submit();		
	}
*/
}

function newReport(strUrl)
{
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}
function LoadReportData(strUrl,selectid,allRepList){
	var selText= $('#'+selectid+' :selected').val();
	var strsize = allRepList.length - 2;
	var res = allRepList.substr(1,strsize);
	var repcodearray = res.split(",");
	for(i=0;i<repcodearray.length;i++){
		var currrep = repcodearray[i];
		if(currrep.trim() == selText.trim()){
			document.getElementById("current_index").value = i;
			break;
		}
	}
	var frm = document.forms["frmMain"]; 	
	frm.elements['reportCode'].value= selText;
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}
function getSelectedReportCode(selectedId,allRepList){
	var strsize = allRepList.length - 2;
	var res = allRepList.substr(1,strsize);
	var repcodearray = res.split(",");
	var currrep = repcodearray[selectedId];
	return currrep;
}
function addNewMyReport(strUrl,draftFlag)
{
	// Get and Set repPrivate flag
	var frm = document.forms["frmMain"]; 	
	var elemPrv = document.getElementById("rPrivateFlg");
	var imagePrv =  elemPrv.getElementsByTagName("IMG")[0];
	if (imagePrv.src.indexOf("icon_unchecked.gif") == -1)
		document.getElementById("repPrivate").value = "N";
	else
		document.getElementById("repPrivate").value = "Y";
		
	// Get and Set default and locked flag
	
	// Set draft flag
	document.getElementById("draftFlag").value = draftFlag;
	
	var valid = true;
	var selText= $('#sel_repcode :selected').val();
	frm.elements['reportCode'].value  = selText;
	if(selText.trim() == "" || selText.trim() == "-1"){
		valid = false;
	}
	if(valid){
		var repName = document.getElementById("myRepName").value;
		
		if(!(repName.trim() == "")){
			setSelectedColData();
			setSelectedOrderData(" ");
			
			frm.target ="";
			frm.action = strUrl;
			frm.method = 'POST';
			frm.submit();
		}else{
			alert("My Report Name is mandatory");
		}
	}else{
		alert("No Report Selected");
	}
}
function setSelectedColData()
{
	selectedCols = $("#columnBox2 option");
	unselectedCols = $("#columnBox1 option");
	input = '{"lstBoxdata":[{';
	$.each(unselectedCols,function(i,value){
		if(i==0){
			input += '"'+value.value+'":"'+value.text+'"';
		}else{
			input += ',"'+value.value+'":"'+value.text+'"';
		}					
	});
	input += "},{";
	output = "";
	output = "{";
	$.each(selectedCols,function(i,value){
		if(i==0){
			output += '"'+value.value+'" : "'+value.text+'"';
			input += '"'+value.value+'":"'+value.text+'"';
		}else{
			output += ',"'+value.value+'" : "'+value.text+'"';
			input += ',"'+value.value+'":"'+value.text+'"';
		}
	});
	input += "}]}";
	output += "}";
	document.getElementById("selectCol").value = output;
	document.getElementById("recollist").value = input;
}
function setSelectedOrderData(elementId)
{
	selectedOrd = $("#dataOrderBox2 option");
	unselectedOrd = $("#dataOrderBox1 option");

	input = '{"lstBoxdata":[{';
	$.each(unselectedOrd,function(i,value){
		if(i==0){
			input += '"'+value.value+'":"'+value.text+'"';
		}else{
			input += ',"'+value.value+'":"'+value.text+'"';
		}					
	});
	input += "},{";

	output = "";
	$.each(selectedOrd,function(i,value){
		if(i==0){
			output += value.value;
			input += '"'+value.value+'":"'+value.text+'"';
		}else{
			output += ','+value.value;
			input += ',"'+value.value+'":"'+value.text+'"';
		}
	});
	input += "}]}";
	if(!(elementId == " "))
		document.getElementById(elementId).value = output;
	document.getElementById("reorderlist").value = input;
}
function reportType(strUrl, type)
{
    var frm = document.forms["frmMain"]; 	
	frm.target ="";
	document.getElementById("type").value = type;	
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}
function moduleType(strUrl, module)
{
    var frm = document.forms["frmMain"]; 	
	frm.target ="";
	document.getElementById("module").value = module;
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();

}
function changeColor(reptype, curId){
	type = document.getElementById("type").value;
	if(reptype != type){
		$('#'+curId).css({ "background-color": ''});
	}
}
function changeColorMod(repmodule, curId){
	module = document.getElementById("module").value;
	if(repmodule != module){
		document.getElementById(curId).style.backgroundColor = '';
	}
}
function getTabDetails(curId){
		var thisObj = $('#'+curId);
		//var title = $('#'+curId).attr('title');
		//$("#current-accordian").val(title);
		$('.ui-section-header').each(function(i, obj) {	
			if(curId==obj.id)
			{
				thisObj.children('a').toggleClass("icon-expand icon-collapse");
				thisObj.next().slideToggle("fast");
				$("#"+obj.id+" label").hide();
				if(thisObj.children('a').hasClass('icon-expand'))
				{
				$("#"+obj.id+" label").show();
				}
			}				
		});
}

//For edit Custome Report.
function editReportParam(strUrl, index)
{
    //alert("edit");
	$("#mode").val("edit");
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
//For Update Custome Reports.
function updateNewMyReport(strUrl,draftFlag)
  {
    //alert("abcd");
	document.getElementById("draftFlag").value = draftFlag;
	if(document.getElementById("rptorderid") != null){
		ordElemId = document.getElementById("rptorderid").value;
		setSelectedOrderData(ordElemId);
	}
	if(document.getElementById("columnBox1") != null){
		//var elem = document.getElementById("selectCol");
		//if(elem.value.trim() != ""){
			setSelectedColData();
		//}else{}
	}	
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	var strTxtCurrent = document.getElementById("txtCurrent").value;
	var viewState = document.getElementById("viewState").value;
	document.getElementById("current_index").value = strTxtCurrent;	
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}
//For sequencing
function getSyncData(repdata123){
	for(var cnt = 101; cnt<199;cnt++){
		repdata123 = repdata123.replace('"'+cnt.toString()+'"','"f'+cnt.toString()+'"');
	}
	return repdata123;
}

// Sort Order Function

function toggleParamCheckbox(elem,fieldId,paramId,defValue,seekID,multiSeekId){
	var seekElem = document.getElementById(seekID);
	var multiSeekElem = document.getElementById(multiSeekId);
	var parameterElem = document.getElementById(paramId);
	var image =  elem.getElementsByTagName("IMG")[0];
	if (image.src.indexOf("icon_unchecked.gif") == -1){
		image.src = "static/images/icons/icon_unchecked.gif";
		$("#"+fieldId).val("N");
		parameterElem.removeAttribute('disabled');
		if(seekElem != null){
			seekElem.removeAttribute('style');
		}
		if(multiSeekElem != null){
			multiSeekElem.removeAttribute('style');
		}
	}	
	else{
		image.src = "static/images/icons/icon_checked.gif";
		$("#"+fieldId).val("Y");
		document.getElementById(paramId).value = defValue;
		parameterElem.setAttribute('disabled','true');
		if(seekElem != null){
			seekElem.setAttribute('style','display:none;');
		}
		if(multiSeekElem != null){
			multiSeekElem.setAttribute('style','display:none;');
		}
	}
}
function chkBlnk(fieldId){
	var name = fieldId.id;
	var listOfValueType  = $('#'+name.split('.')[0]+'\\.listOfValueType').val();
	var currval = document.getElementById(fieldId.id).value; //   $('#'+fieldId.id).val();
	if(currval.trim() === '' && listOfValueType === 'LA') {
		document.getElementById(fieldId.id).value = getLabel("(ALL)","(ALL)");
	}
}

//FROM-TO-DATE-SELECTOR >>

function pushFromToDates(selVal,sysApplDate,dtSelType,fromDateElemId,toDateElemId) {

	//alert ("push Dates ... ");
	var dtFrom = '', dtTo = '';
	//var strAppDate = dtApplicationDate;
	//var dtFormat = strExtApplicationDateFormat;
						//var date = new Date(Date.parse(strAppDate, dtFormat));

	//alert ("sysApplDate : "+sysApplDate);
	
	var parts = sysApplDate.split("/");
	var d1 = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
	//var d1 = Date.parseExact(sysApplDate, "d/M/yyyy");
	var date = new Date(d1);

	var dtJson = {};
						
	var index = document.getElementById("dtSel01").value;
		//alert ("Curr Date: "+date);
		//alert ("Index: "+index);

	if (index != '7') {
	
	switch (index) {
		case '1' :
			// Today
			dtFrom = date;
			dtTo = date;
			break;
		case '2' :
			// Yesterday
			dtFrom = getYesterdayDate(date);
			dtTo = getYesterdayDate(date);
			break;
		case '3' :
			// This Week
			dtJson = getThisWeekStartAndEndDate(date);
			dtFrom = dtJson.fromDate;
			dtTo = dtJson.toDate;
			break;
		case '4' :
			// Last Week
			dtJson = getLastWeekStartAndEndDate(date);
			dtFrom = dtJson.fromDate;
			dtTo = dtJson.toDate;
			break;
		case '5' :
			// This Month
			dtJson = getThisMonthStartAndEndDate(date);
			dtFrom = dtJson.fromDate;
			dtTo = dtJson.toDate;
			break;
		case '6' :
			// Last Month
			dtJson = getLastMonthStartAndEndDate(date);
			dtFrom = dtJson.fromDate;
			dtTo = dtJson.toDate;
			break;
		}
		
		//alert ("New Fm Date : "+setFmtDate(dtFrom));
		//alert ("New To Date : "+setFmtDate(dtTo));

		//These are passed as parameters to JS func
		//var fromDateElemId = "<c:out value="${fromDateElemId}"/>";
		//var toDateElemId = "<c:out value="${toDateElemId}"/>";
		//var dtSelType = "<c:out value="${dtSelType}"/>";

		//alert ("Elem Ids : "+fromDateElemId+" | "+toDateElemId);
		//alert ("dtSelType : "+dtSelType);

		//Push Back New Values to input fields
		var s0 = document.getElementById(''+fromDateElemId);
		s0.value = setFmtDate(dtFrom);
		if (dtSelType == 'fromTo') {
		var s1 = document.getElementById(''+toDateElemId);
		s1.value = setFmtDate(dtTo);
		}
		
		} else {
			//handle date range
		}
		
		}
		function getYesterdayDate (dtToday) {
			var dtDate = new Date(dtToday);
			return new Date(dtDate.setDate(dtDate.getDate()-1));
		}
		
		function getThisMonthStartAndEndDate (dtToday) {
		
			var dtDate = new Date(dtToday);
			var dtJson = {};
			var y = dtDate.getFullYear(), m = dtDate.getMonth();
			var firstDay = new Date(y, m, 1);
			var lastDay = new Date(y, m + 1, 0);
		
			dtJson = {	
				fromDate : firstDay,
				toDate : lastDay
			};
			return dtJson;
		}
		function getLastMonthStartAndEndDate (dtToday) {
		
			var dtDate = new Date(dtToday);
			var dtJson = {};
			var y = dtDate.getFullYear(), m = dtDate.getMonth();
			var firstDay = new Date(y, m - 1, 1);
			var lastDay = new Date(y, m , 0);
		
			dtJson = {	
				fromDate : firstDay,
				toDate : lastDay
			};
			return dtJson;
		}

		function getThisWeekStartAndEndDate (dtToday) {
			var dtDate = new Date(dtToday);
			var dtJson = {};
			var startDay = 1; // 0=sunday, 1=monday etc.
			// get the current day
			var day = dtDate.getDay();
			// rewind to start day
			var weekStart = new Date(dtDate.valueOf()
					- (day <= 0 ? 7 - startDay : day - startDay) * 86400000);
			// add 6 days to get last day
			var weekEnd = new Date(weekStart.valueOf() + 6 * 86400000);

			dtJson = {
				fromDate : new Date(weekStart),
				toDate : new Date(weekEnd)
			};
			return dtJson;
		}
		function getLastWeekStartAndEndDate (dtToday) {
			var dtDate = new Date(dtToday);
			var dtJson = {};
			var lastWeekEnd = dtDate.setTime(dtDate.getTime()
					- (dtDate.getDay() ? dtDate.getDay() : 7) * 86400000);
			var lastWeekStart = dtDate.setTime(dtDate.getTime() - 6
					* 86400000);
			dtJson = {
				fromDate : new Date(lastWeekStart),
				toDate : new Date(lastWeekEnd)
			};
			return dtJson;

		}
		function setFmtDate (dtToday) {
		    var d = new Date(dtToday);
			var curr_date = d.getDate();
			var curr_month = d.getMonth() + 1; //Months are zero based
			var curr_year = d.getFullYear();
			return (curr_date + "/" + curr_month + "/" + curr_year);

		}
//FROM-TO-DATE-SELECTOR <<

function showPageInfo(titaleId){
	var repType = $('#type').val();
	var repModule = $('#module').val();
	if(repType.trim()=="" || repType == null) {
		repType = "All";
	}
	if(repModule.trim()=="" || repModule == null){
		repModule = "All";
	}
	$('#'+titaleId).attr("title", "Report Type: "+repType+"\nReport Module: "+repModule);
}

// Set Filter Options

function setFilterOpts(){
	var enableSaveButton = false;
	var repType = $('#type').val();
	var repModule = $('#module').val();
	var prefModule = $('#prefmodule').val(); 
	var prefType = $('#preftype').val();	
	//alert(" repType = "+repType+" prefType = "+prefType+" repModule = "+repModule+" prefModule = "+prefModule);
	
	if(prefType == null || prefType.trim() == "" || prefModule == null || prefModule.trim() == ""){
		enableSaveButton = true;
	}
	
	if(repType == null || repType.trim() == "" || repModule == null || repModule.trim() == ""){
		if(prefType == null || prefType.trim() == "" || prefModule == null || prefModule.trim() == ""){
			repType = 'All';
			repModule = 'All';
		}else{
			repType = prefType;
			repModule = prefModule;			
		}
	}else{
		if(prefType != null && prefType != repType)
			enableSaveButton = true;
		if(prefModule != null && prefModule != repModule)
			enableSaveButton = true;
	}
	if(enableSaveButton)
		document.getElementById("btnSave").className ="imagelink black inline button-icon icon-button-submit font_bold";
}

function setRCPreferences(rcViewState){
	if(rcViewState != null && rcViewState.trim() != ""){
		rcViewState = rcViewState.replace(/&#034;/g,'"');
		var rcObj = JSON.parse(rcViewState); 
		var prefType = rcObj.repType;
		var prefModule = rcObj.repModule;
		$('#preftype').val(prefType); 
		$('#prefmodule').val(prefModule);
	}else{
		$('#preftype').val(""); 
		$('#prefmodule').val("");	
	}

}
function updateViewPref(viewPref,frm){
	$.ajax({
	   type: "POST",
	   url: "services/userpreferences/reportcenter/standardRCViewFilter.json",
	   data: viewPref,
	   dataType: 'json',
	   contentType:'application/json',
	   error: function (xhr, ajaxOptions, thrownError) { 
			alert('error:' + xhr.status); 
		},
	   success: function (data) { 
			//alert("View Peferences saved");
			frm.submit();			
	    }
	});
}

function callWebService(){
	$.ajax({
	   type: "GET",
	   url: "services/userpreferences/reportcenter/standardRCViewFilter.json",
	   dataType: document.json,
	   error: function (xhr, ajaxOptions, thrownError) { alert('error:' + xhr.status); },
	   success: function (xmlDoc) {
			var abc = JSON.parse(xmlDoc.preference);
			alert("Report Module = "+abc.repModule);
			alert("Report Type = "+abc.repType);
	   }
	});
}
function getClientCode(sellerCode)
{
	var strData = {};
	var opt ;
	var strUrl = 'getClientCode.srvc?'+ csrfTokenName + "=" + csrfTokenValue +"&$sellerCode="+ sellerCode.value;
	$.ajax({
	    url: strUrl,
	    type: "POST",
	    context: this,
	    error: function () {},
	    dataType: 'json',
	    data: strData ,
	    success : function (response) 
	    {
	    	$('#clientCode').empty();
	    	opt = document.createElement("option");
            document.getElementById("sel_repcode").options.add(opt);
        	opt.text = 'Select Client';
            opt.value ='-1';
            for(var i=0 ;i < response.length ; i++ )
            {
            	opt = document.createElement("option");
                document.getElementById("clientCode").options.add(opt);
            	opt.text = response[i].DESCRIPTION;
                opt.value =response[i].CODE;
            }
	    }
	});
}
function getReportCode(clientCode)
{
	var strData = {};
	var opt ;
	var strUrl = 'getReportCodeList.srvc?'+ csrfTokenName + "=" + csrfTokenValue +"&$clientCode="+ clientCode.value;
	$.ajax({
	    url: strUrl,
	    type: "POST",
	    context: this,
	    error: function () {},
	    dataType: 'json',
	    data: strData ,
	    success : function (response) 
	    {
	    	$('#sel_repcode').empty();
	    	opt = document.createElement("option");
            document.getElementById("sel_repcode").options.add(opt);
        	opt.text = 'Select Standard Report';
            opt.value ='-1';
	    	for(var i=0 ;i < response.length ; i++ )
            {
            	opt = document.createElement("option");
                document.getElementById("sel_repcode").options.add(opt);
            	opt.text = response[i].REPDESCRIPTION;
                opt.value =response[i].REPREPORT;
            }
	    }
	});
	$('#sel_repcode').removeAttr("disabled");
}
function setReportAndDownLoadLabel(srcType)
{
	/*if(srcType == 'R')
	{
		document.getElementById("lblschSrcName").innerHTML = getLabel("reportName","Report Name");
	}
	else
	{
		document.getElementById("lblschSrcName").innerHTML = getLabel("uploadName","Upload Name");
	}*/
	document.getElementById("lblschSrcName").innerHTML = getLabel("sourceName","Source Name");
}
function submitOndemandReport(strUrl)
{
	var frm = document.forms["frmMain"];
	enableFieldsToSave();
	$('.jq-multiselect').each(function(i , element){
		if( $('#'+element.id).length > 0 )
		{
			multiValue = '';
			var elementName = "reportCenterParameterBean";
			index = element.id.substr(elementName.length, element.id.length);
			document.getElementById(elementName+"["+index+"].value").value = '';
			var checkedItems = $("#"+element.id).multiselect("getChecked");
			var allItems = $("#"+element.id).multiselect("getAllItems");
			if( allItems.length != checkedItems.length )
			{
				$("#"+element.id).multiselect("getChecked").map(function()
				{
					if(multiValue == '') multiValue = this.value;
					else
						multiValue = multiValue+","+ this.value;
				});
				document.getElementById(elementName+"["+index+"].value").value = multiValue;
			}
			else
			{
				document.getElementById(elementName+"["+index+"].value").value = "(ALL)";
			}
		}
	});
	$('form').find('.amountBox').each(function(){
       var self=$(this);
       var selfValue = self.autoNumeric('get');
       self.val(selfValue);
	});
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}
function paintReportGenerateActions(myDraftIs,draft_flag,src_type,screen_name,showgeneratebtn)
{
	var elt = null, eltCancel = null, eltSubmit = null, eltGenerate = null;
	$('#reportGenerateActionButtonListLT,#reportGenerateActionButtonListLB, #reportGenerateActionButtonListRB, #reportGenerateActionButtonListRT').empty();
	var strBtnLTLB = '#reportGenerateActionButtonListLT,#reportGenerateActionButtonListLB';
	var strBtnRTRB = '#reportGenerateActionButtonListRT,#reportGenerateActionButtonListRB';
	
	if( screen_name === 'customReportCenter') {
		eltCancel = createButton('btnCancel', 'S', 'Cancel');
		eltCancel.click(function() {
			showBack('customReportCenter.srvc');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
	 } else {
		eltCancel = createButton('btnCancel', 'S', 'Cancel');
		eltCancel.click(function() {
			showBack('reportCenterNewUX.srvc');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
	 }
	 if(draft_flag === myDraftIs)
	{
		eltSubmit = createButton('btnSubmit', 'P', 'Submit',src_type);
		eltSubmit.click(function() {
			submitOndemandReport('submitGenerateReport.srvc');
		});
		eltSubmit.appendTo($(strBtnRTRB));
		if(src_type === 'R' && showgeneratebtn === 'Y')
		{
			eltGenerate = createButton('btnGenerate', 'P', 'Generate Now');
			eltGenerate.click(function() {
				GenerateReport('generateReport.srvc');
			});
			eltGenerate.appendTo($(strBtnRTRB));
			eltGenerate.bind('keydown',function (){autoFocusOnFirstElement(event, 'frmMain',false)});
			//$(strBtnRTRB).append("&nbsp;");
		}
//		$(strBtnRTRB).append("&nbsp;");
	}
}
function createButton(btnKey, charIsPrimary,btnVal,srcType) {
	var strCls = 'ft-button ft-btn-link';
			if(btnKey === 'btnSubmit'){
				if(!isEmpty(srcType) && srcType == 'R'){
					strCls = 'ft-button ft-margin-l ft-btn-link'
				}
				else{
					strCls = 'ft-button ft-margin-l ft-button-primary'
				}
			}
			else if(btnKey === 'btnGenerate'){
				strCls = 'ft-button ft-margin-l ft-button-primary'
			} 
			else if(btnKey === 'btnCancel'){
				strCls = 'ft-button ft-button-light'
			} 
	var elt = null;
	elt = $('<input>').attr({
				'type' : 'button',
				'class' : strCls,
				'id' : 'button_' + btnKey,
				'value' : getLabel(btnKey,btnVal),
				'tabindex':50
			});
	return elt;
}

function chkBlank(fieldId){
	
	var currval = document.getElementById(fieldId).value; //   $('#'+fieldId.id).val();
	if(currval.trim() == "")
		document.getElementById(fieldId).value = getLabel("(ALL)","(ALL)");
}

function ShowDesc(showFieldId,hideFieldId){
	document.getElementById(showFieldId).style.display = 'inline';
	document.getElementById(hideFieldId).style.display = 'none';
}