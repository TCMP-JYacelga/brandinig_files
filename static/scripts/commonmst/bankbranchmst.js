function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showAddNewForm(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
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
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecordList(strUrl)
{
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function disableRecordList(strUrl)
{
	var frm = document.forms["frmMain"]; 
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(me,strUrl)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}	
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}


function getRejectRecord(me, rejTitle, rejMsg,strUrl)
{
    var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230, rejTitle, rejMsg, strUrl, rejectRecord);
}

function rejectRecord(arrData, strRemarks,strUrl)
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
		frm.target = "";
		frm.action = arrData;
		frm.method = 'POST';
		frm.submit();
	}
}

function deleteList(me,strUrl)
{
    var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record");
		return;
	} 
	deleteRecord(document.getElementById("updateIndex").value,strUrl);
}

function deleteRecord(arrData,strUrl)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = arrData;
	frm.target = "";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}


// List navigation
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


function selectRecord(ctrl, status, index, maker)
{
	var strAuthIndex = document.getElementById("updateIndex").value;
	var strActionMap = document.getElementById("actionmap").value;
	if (index.length < 2)
	{
		index = '0' + index;
	}	
	var aPosition = strAuthIndex.indexOf(index);
    var mapPosition;	
	var strCurrentAction;
	var strDelimAction;
	var lenDelimAction;
	var strArrSplitAction;
	var strFinalBitmap = document.getElementById("bitmapval").value;
	var lenLooplen;
	if (aPosition >= 0)
	{
		document.getElementById("updateIndex").value = strAuthIndex.replace(strAuthIndex.substring(aPosition, aPosition + 2),"");
		mapPosition = strActionMap.indexOf(index+":");
		document.getElementById("actionmap").value = strActionMap.replace(strActionMap.substring(mapPosition, mapPosition + 7),"");
	}
	else
	{
		document.getElementById("updateIndex").value = index+ ","+document.getElementById("updateIndex").value ;
		strCurrentAction = arrActionMap[status];
		document.getElementById("actionmap").value = index+":"+ strCurrentAction +","+document.getElementById("actionmap").value ;
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
		
		if (strArrSplitAction.length==1)
		{
			strFinalBitmap = strArrSplitAction[0];
		}
		else
		{
				lenLooplen =strArrSplitAction.length-1;
				for (var j=0; j<lenLooplen ; j++)
				{
					if (j==0)
					{
						strFinalBitmap = performAnd(strArrSplitAction[j],strArrSplitAction[j+1]);						
					}
					else
					{
						strFinalBitmap = performAnd(strFinalBitmap,strArrSplitAction[j+1]);
					}
				}
		}		
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
	var strOut = "";
	var i = 0;
	if (validAction.length = currentAction.length)
	{
		for (i=0; i<5; i++)
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
		for (i=0; i<5; i++)
		{
				switch (i)
				{
					case 0: 
					if (strActionButtons.charAt(i)*1 ==1 &&  maker != _strUserCode)
					{
						document.getElementById("btnAuth").className ="imagelink black inline_block button-icon icon-button-accept font_bold";
					}
					else
					{
						document.getElementById("btnAuth").className ="imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
					}
					break;					
					
					case 1: 
					if (strActionButtons.charAt(i)*1 ==1 &&  maker != _strUserCode)
					{
						document.getElementById("btnReject").className ="imagelink black inline_block button-icon icon-button-reject font_bold";
					}
					else
					{
						document.getElementById("btnReject").className ="imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
					}
					break;
					
					case 2: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						document.getElementById("btnEnable").className ="imagelink black inline_block button-icon icon-button-enable font_bold";
					}
					else
					{
						document.getElementById("btnEnable").className ="imagelink grey inline_block button-icon icon-button-enable-grey font-bold";
					}
					break;
					
					case 3: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						document.getElementById("btnDisable").className ="imagelink black inline_block button-icon icon-button-disable font_bold";
					}
					else
					{
						document.getElementById("btnDisable").className ="imagelink grey inline_block button-icon icon-button-disable-grey font-bold";
					}
					break;
						
					case 4: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						document.getElementById("btnDiscard").className ="imagelink black inline_block button-icon icon-button-discard font_bold";
					}
					else
					{
						document.getElementById("btnDiscard").className ="imagelink grey inline_block button-icon icon-button-discard-grey font-bold";
					}
					break;
				}
		}
	}	
}

// Details
function addDetail(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function goToPage(strUrl, frmId) {
	var partnerIndecator=$('#chkPartnerBankFlag');
	var systemIndecator=$('#chkSystemIndicator');
	if( partnerIndecator.attr('src').indexOf('/icon_checked')!=-1 || systemIndecator.attr('src').indexOf('/icon_checked')!=-1)
	{ 
        $('#financialInstitutionType').removeAttr('disabled');
	}
	if(systemIndecator.attr('src').indexOf('/icon_checked')!=-1)
	{
		$('#chkSystemIndicator').removeAttr('disabled');
	}
	if(partnerIndecator.attr('src').indexOf('/icon_checked')!=-1)
	{
		$('#chkPartnerBankFlag').removeAttr('disabled');
	}
	if(bankCodeFlag=="Y")
	{
		$('#draweeBankCode').removeAttr('disabled');
		$('#draweeBankName').removeAttr('disabled');
	}
	if(branchCodeFlag=="Y")
	{
		$('#draweeBranchCode').removeAttr('disabled');
		$('#draweeBranchDescription').removeAttr('disabled');
	}
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	if(bankCodeFlag=="Y")
	{
		$('#draweeBankCode').prop('disabled', true);
		$('#draweeBankName').prop('disabled', true);
	}
	if(branchCodeFlag=="Y")
	{
		$('#draweeBranchCode').prop('disabled','true');
		$('#draweeBranchDescription').prop('disabled','true');
	}
	$('#financialInstitutionType').prop('disabled','true');
	$('#chkSystemIndicator').prop('disabled','true');
	$('#chkPartnerBankFlag').prop('disabled','true');
}

function gotoPageForSubmit(strUrl, frmId) {
	var partnerIndecator=$('#chkPartnerBankFlag');
	var systemIndecator=$('#chkSystemIndicator');
	if( partnerIndecator.attr('src').indexOf('/icon_checked')!=-1 || systemIndecator.attr('src').indexOf('/icon_checked')!=-1)
	{
		$('#financialInstitutionType').removeAttr('disabled');
	}
	if(systemIndecator.attr('src').indexOf('/icon_checked')!=-1)
	{
		$('#chkSystemIndicator').removeAttr('disabled');
	}
		if(partnerIndecator.attr('src').indexOf('/icon_checked')!=-1)
	{
		$('#chkPartnerBankFlag').removeAttr('disabled');
	}
	if(dityBitSet)
		document.getElementById("dirtyBitSet").value = true;
	if(bankCodeFlag=="Y")
	{
		$('#draweeBankCode').removeAttr('disabled');
		$('#draweeBankName').removeAttr('disabled');
	}
	if(branchCodeFlag=="Y")
	{
		$('#draweeBranchCode').removeAttr('disabled');
		$('#draweeBranchDescription').removeAttr('disabled');
	}
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	if(bankCodeFlag=="Y")
	{
		$('#draweeBankCode').prop('disabled', true);
		$('#draweeBankName').prop('disabled', true);
	}
	if(branchCodeFlag=="Y")
	{
		$('#draweeBranchCode').prop('disabled','true');
		$('#draweeBranchDescription').prop('disabled','true');
	}
	$('#financialInstitutionType').prop('disabled','true');
	$('#chkSystemIndicator').prop('disabled','true');
	$('#chkPartnerBankFlag').prop('disabled','true');
}
function toggleCheckUncheck(imgElement, flag) {

	if (imgElement.src.indexOf("icon_unchecked_grey.gif") == -1) {

		if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
			imgElement.src = "static/images/icons/icon_checked.gif";
			$('#' + flag).val('Y');
		} else {
			imgElement.src = "static/images/icons/icon_unchecked.gif";
			$('#' + flag).val('N');
			//getRemoveServiceConfirmationPopup('frmMain');
		}
	}
	
	if("printingAtBranchFlag" === flag){
		var printingAtBranchFlagVal = $("#printingAtBranchFlag").val();
		var systemFlag = $("#systemIndicator").val();
		enableDisablePrintingBranchField(printingAtBranchFlagVal,systemFlag);
	}
}

function enableDisablePrintingBranchField(printingAtBranchFlagVal,systemFlag){
	
		
		if("Y" === printingAtBranchFlagVal || "N" === systemFlag) { //printingAtBranchFlag is checked : disable printing branch 
			
			$('#printingBranchCode').val("");
			$('#printingBranchCode').prop('disabled','true');
			$('#printingBranchCode').addClass('disabled');
			$('#printingBranchCodeLbl').removeClass('required-lbl-right');
			
		}else if(("N" === printingAtBranchFlagVal || !printingAtBranchFlagVal) && "Y" === systemFlag){ // printingAtBranchFlag is unchecked : enable printing branch and make mandatory
			
			$('#printingBranchCode').removeAttr('disabled');
			$('#printingBranchCode').removeClass('disabled');
			$('#printingBranchCodeLbl').addClass('required-lbl-right');
		}
}
function toggleRadioButton(partnerFlag,field,elm, isFirstTime,type)
{
	var selectedLineCodes = $('#strSelectedLineCodes').val().split(',');
	var assignedCount = 0;
	var partnerIndecator=$('#chkPartnerBankFlag');
	$.each(selectedLineCodes, function(index, item) {
		if(item) {
			assignedCount++;
		}
	});
	
	if(elm == 'E') {
		$('#newBankType').hide();		
		$('#exisitingBank').show();
		if(!Ext.isEmpty(isFirstTime) && !isFirstTime && PAGE_MODE == 'ADD') {
			$('#newBankType').val('');
			$('#exisitingBank').val('');
		}
		if('Y' == bankCodeFlag) {
			$('#draweeBankName').attr('readonly', true);
			$('#draweeBankName').addClass('disabled');
		}
		$('#creditLinesCount').text('');
	} else if(elm == 'N') {
		$('#exisitingBank').hide();		
		$('#newBankType').show();
		if(PAGE_MODE == 'ADD' && type !== 'L'){
			$('#newBankType').val('');
			$('#draweeBankCode').val('')
			$('#exisitingBank').val('');
			$('#bankMicrCode').val('');
		}
		if('Y' == bankCodeFlag) {
			$('#draweeBankName').attr('readonly', false);
			$('#draweeBankName').removeClass('disabled');
		}
		$('#creditLinesCount').text('');
	}
	if ((partnerFlag == 'Y' || field.id == 'chkPartnerBankFlag' && partnerIndecator.attr('src').indexOf('/icon_checked') != -1)
			&& $('#newBankId').is(':checked')) {
		$('#creditLinesCount').text('(' + assignedCount + ')');
	}
	else {
		$('#creditLinesCount').text('');
	}
	if ($('#newBankId').is(':checked') && (PAGE_MODE === 'ADD' || (PAGE_MODE === 'EDIT' && $('#bankMicrCode').val()===''))) {
		$('#bankMicrCode').removeAttr('disabled');
		$('#bankMicrCode').removeClass('disabled');
	}
	else {
		$('#bankMicrCode').prop('disabled', 'true');
		$('#bankMicrCode').addClass('disabled');
	}
}


function setDirtyBit() {
	dityBitSet= true;
}

function reloadData()
{
	var frmId = document.getElementById('frmMain');
	frmId.action = "addBankBranchMst.form";
	frmId.target = "";
	frmId.method = "POST";
	$('#country option').prop('selected',true);	
	
	$(frmId).submit();
}
function removeDisabled() {
	$("#clearingLocCode").removeAttr("disabled");
	$("#exisitingBank").removeAttr("disabled");
	$("#bankType").removeAttr("disabled");
	$("#newBankId").removeAttr("disabled");
	$("#country").removeAttr("disabled");
	$("#region").removeAttr("disabled");
	$("#draweeBranchDescription").removeAttr("disabled");
	$("#draweeBranchDescLocal").removeAttr("disabled");
	$("#newBankType").removeAttr("disabled");
	$("#sellerID").removeAttr("disabled");
	$("#bankMicrCode").removeAttr("disabled");
}

function populateStates(elmt, mState)
	{
		var state = "";
		if(elmt.id == "country")
		{
			if(elmt.value == "")
			{
				$('#state').attr("disabled", "true");
				$('#state').val("");
			}
			else
			{
				$('#state').removeAttr("disabled");
				state = document.getElementById("state");
			}
		}
		
		if(elmt.value != "")
		{
			//blockClientUI(true);
			$.post('cpon/clientServiceSetup/clientCountryStateList.json', { $countryCode: elmt.value}, 
			function(data){
				populateData(state, data);
				if(mState != "")
					state.value = mState;
				//blockClientUI(false);
			})
			.fail(function() 
			{
				//blockClientUI(false);
			});
		}
}
function populateClearingLocation(elmt, mLoc)
{
	var clearingLoc = "";
	if(elmt.id == "country")
	{
		if(elmt.value == "")
		{
			$('#clearingLocCode').attr("disabled", "true");
			$('#clearingLocCode').val("");
		}
		else
		{
			$('#clearingLocCode').removeAttr("disabled");
			clearingLoc = document.getElementById("clearingLocCode");
		}
	}
	
	if(elmt.value != "")
	{
		//blockClientUI(tmLocrue);
		$.post('cpon/bankBranchMst/countryClearingLocList.json', { $countryCode: elmt.value}, 
		function(data){
			populateLocData(clearingLoc, data);
			if(mLoc != "")
				clearingLoc.value = mLoc;
			//blockClientUI(false);
		})
		.fail(function() 
		{
			//blockClientUI(false);
		});
	}
}

function populateLocData(select, loc)
{
	var x;
	select.length=1;
	
	for (x in loc)
	{
		var option=document.createElement("option");
		option.text=loc[x].LOC_DESCRIPTION;
		option.value=loc[x].CLEARING_LOC_CODE;
		select.add(option);
	}
}

function populateData(select, states)
{
	select.length=1;
	
	for (var i=0;i<states.length;i++)
	{
		var option=document.createElement("option");
		option.text=states[i].STATE_DESC;
		option.value=states[i].STATE_CODE;
		select.add(option);
	}
}

function getPopupItems() {
	var items = [];
	var nameFilterfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
		fieldCls : 'xn-form-text xn-suggestion-box popup-searchBox',
		itemId : 'nameFilter',
		emptyText : getLabel('namePleaceHolder','Search by Name'),
		cfgUrl: 'cpon/bankBranchMst/creditLineNameSeek.json',
		cfgQueryParamName : 'qfilter',
		cfgExtraParams: (PAGE_MODE == 'VIEW' || PAGE_MODE == 'SUBMIT')?[{key: '$seller', value: creditSellerCode}]: [{key: '$seller', value: $('#sellerId').val()}],
		cfgRecordCount : -1,
		cfgSeekId :'creditNameSeek',
		cfgDataNode1 : 'LINE_DESCRIPTION',
		cfgKeyNode:'LINE_DESCRIPTION',
		enableQueryParam:false,
		cfgProxyMethodType : 'POST',
		fitToParent : true,
		listeners: {
			select: function(combo) {
				var grid = combo.up('window[itemId="creditLinesPopupItemId"]').down('smartgrid[itemId="creditLineGridItemId"]');
				grid.refreshData();
				var clearLink = combo.up('window[itemId="creditLinesPopupItemId"]').down('component[itemId="clearNameLink"]');
				clearLink.show();
				if(nameFilterfield.value=="" || nameFilterfield.value==null)
				clearLink.hide();
			},
			change: function(combo) {
				if(Ext.isEmpty(combo.getValue())) {
					var grid = combo.up('window[itemId="creditLinesPopupItemId"]').down('smartgrid[itemId="creditLineGridItemId"]');
					grid.refreshData();
					var clearLink = combo.up('window[itemId="creditLinesPopupItemId"]').down('component[itemId="clearNameLink"]');
					clearLink.show();
					if(nameFilterfield.value=="" || nameFilterfield.value==null)
					clearLink.hide();
				}
			}
		}
	});
	
	var currFilterfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
		fieldCls : 'xn-form-text xn-suggestion-box popup-searchBox',
		margin : '0 0 0 30',
		itemId : 'currFilter',
		emptyText : getLabel('currencyPleaceHolder','Search by Currency'),
		cfgUrl: 'cpon/bankBranchMst/creditLineCurrSeek.json',
		cfgQueryParamName : 'qfilter',
		cfgExtraParams:(PAGE_MODE == 'VIEW' || PAGE_MODE == 'SUBMIT')?[{key: '$seller', value: creditSellerCode}]: [{key: '$seller', value: $('#sellerId').val()}],
		cfgRecordCount : -1,
		cfgSeekId :'creditCurrencySeek',
		cfgDataNode1 : 'CCY_CODE',
		cfgKeyNode:'CODE',
		enableQueryParam:false,
		cfgProxyMethodType : 'POST',
		fitToParent : true,
		listeners: {
			select: function(combo) {
				var grid = combo.up('window[itemId="creditLinesPopupItemId"]').down('smartgrid[itemId="creditLineGridItemId"]');
				grid.refreshData();
				var clearLink = combo.up('window[itemId="creditLinesPopupItemId"]').down('component[itemId="clearCurrLink"]');
				clearLink.show();
				if(currFilterfield.value=="" || currFilterfield.value==null)
				clearLink.hide();	
			},
			change: function(combo) {
				if(Ext.isEmpty(combo.getValue())) {
					var grid = combo.up('window[itemId="creditLinesPopupItemId"]').down('smartgrid[itemId="creditLineGridItemId"]');
					grid.refreshData();
					var clearLink = combo.up('window[itemId="creditLinesPopupItemId"]').down('component[itemId="clearCurrLink"]');
					clearLink.show();
					if(currFilterfield.value=="" || currFilterfield.value==null)
					clearLink.hide();
				}
			}
		}
	});
	
	var clearCurrLink = Ext.create('Ext.Component',{
		layout : 'hbox',
		itemId : 'clearCurrLink',
		hidden : true,
		cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l ',
		html: '<a>'+ getLabel('clear','Clear')+'</a>',
		listeners: {
			click: function(component) {
				currFilterfield.setValue("");
				clearCurrLink.hide();
			},
			element: 'el',
			delegate: 'a'
		}
	});
	
	var clearNameLink = Ext.create('Ext.Component',{
		layout : 'hbox',
		itemId : 'clearNameLink',
		hidden : true,
		cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l',
		html: '<a>'+ getLabel('clear','Clear')+'</a>',
		listeners: {
			click: function() {
				nameFilterfield.setValue("");
				clearNameLink.hide();
			},
			element: 'el',
			delegate: 'a'
		}
	});
	
	items.push(nameFilterfield, clearNameLink, currFilterfield, clearCurrLink);
	return items;
}
	
function creditLineApplicable() {
	var partnerBankFlag = $('input[type="hidden"]#partnerBankFlag').val();
	var systemIndicator = $('input[type="hidden"]#systemIndicator').val();
	var partnerOrSystem = (partnerBankFlag==='Y') || (systemIndicator==='Y');
	var bankType = $('input[name=bankType]:checked').val();
	return (bankType === 'N' && partnerOrSystem) ? true : false;
}

function showCreditLinesPopup(readOnly) {
	if(creditLineApplicable()) {
		if(Ext.isEmpty(objCreditLinesPopup) || blnViewOld ) {
			var lineAmountEditor = new Ext.form.field.Text({
				itemId:'editor',
				/*maxLength : 17,*/
				hideTrigger : true,
				disabled : readOnly,
				maskRe: /[0-9.]/
			});
			
			var columns = [{ header: getLabel('creditLine.name','Name'), colId: 'lineDescription', width: 120 },
			               { header: getLabel('creditLine.tenor','Tenor'), colId: 'lineTenor', width: 120} ,
			               { header: getLabel('creditLine.currency','Currency'), colId: 'currencyCode'},
			               { header: getLabel('creditLine.amount','Amount'), colId: 'amount', width: 200, editor: lineAmountEditor }];
			var columnModel = [];
			Ext.each(columns, function(columnDetails) {
				var cfgCol = {
					colHeader: columnDetails.header,
					colId: columnDetails.colId,
					sortable: false
				};
				if(!Ext.isEmpty(columnDetails.width)) {
					cfgCol.width = columnDetails.width
				}
				cfgCol.fnColumnRenderer = creditLineColumnRenderer;
				if(!Ext.isEmpty(columnDetails.editor) && !readOnly) {
					cfgCol.editor = columnDetails.editor;
				}
				columnModel.push(cfgCol);
			});
			var editingOn = false;
			
			var creditLineGridView = Ext.create('Ext.ux.gcp.SmartGrid', {
				stateful: false,
				itemId: 'creditLineGridItemId',
				showEmptyRow: false,
				width: 'auto',
				cls: 't7-grid',
				height: 'auto',
				minHeight: 'auto',
				showPager: true,
				pageSize: 5,
				columnModel: columnModel,
				hideRowNumbererColumn: true,
				checkBoxColumnWidth: 36,
				storeModel: {
					fields: ['lineDescription', 'currencyCode', 'amount', 'lineCode', 'lineTenor'],
					proxyUrl: 'cpon/bankBranchMst/creditLineCodes',
					rootNode: 'dataItems',
					totalRowsNode: 'count'
				},
				selType: 'cellmodel',
				plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
				})],
				listeners: {
					render: function(grid) {
						handleCreditLineGridData(grid, grid.store.dataUrl, grid.pageSize, 1, 1, null);
					},
					beforeselect: function() {
						if(editingOn===true) return false;
					},
					beforedeselect: function() {
						if(editingOn===true) return false;
					},
					beforeedit: function( editor, e, eOpts) {
						editingOn = true;
						return true;
					},
					edit: function(editor, e) {
						editingOn = false;
						if(isValidCreditLineAmount(e.value)) {
							objCreditLineAmounts[e.record.data.lineCode] = e.value;
						} else {
							objCreditLineAmounts[e.record.data.lineCode] = null;
							e.store.getRange()[e.rowIdx].set('amount', '');
							if(!Ext.isEmpty(e.value)) {
								Ext.Msg.alert("Error", "Maximum length allowed for Amount is 12,4");
							} else {
								creditLineGridView.refreshData();
							}
						}
					},
					gridPageChange: handleCreditLineGridData,
					select: function(me, record) {
						objCreditLineCodes[record.data.lineCode] = true;
					},
					deselect: function(me, record) {
						objCreditLineCodes[record.data.lineCode] = false;
					}
				}
			});
			
			creditLineGridView.getSelectionModel().setLocked(readOnly);
			window.objCreditLinesPopup = Ext.create('Ext.window.Window', {
				title: getLabel('titleCreditLine','Credit Line'),
				itemId: 'creditLinesPopupItemId',
				width: 600,
				minHeight: 156,
				maxHeight: 550,
				autoHeight: true,
				modal: true,
				resizable: false,
				draggable: false,
				cls: 'non-xn-popup',
				closeAction: 'hide',
				autoScroll: true,
				items: [{
					xtype : 'container',
					layout : 'column',
					cls : 'ft-padding-bottom',
					items: getPopupItems()
				}, creditLineGridView],
				bbar: [{
					xtype: 'button',
					text:  getLabel('cancel','Cancel'),
					handler: function() {
						var popup = this;
						popup = popup.up('window[itemId="creditLinesPopupItemId"]');
						popup.close();
					}
				}, '->', {
					xtype: 'button',
					text: getLabel('submit','Submit'),
					hidden: readOnly,
					handler: function() {
						var popup = this;
						var selectedCreditLineValue = '';
						
						popup = popup.up('window[itemId="creditLinesPopupItemId"]');
						var assignedCount = 0;
						$.each(objCreditLineCodes, function(lineCode, isChecked) {
							if(isChecked) {
								if(selectedCreditLineValue !== '') {
									selectedCreditLineValue = selectedCreditLineValue + ',';
								}
								selectedCreditLineValue = selectedCreditLineValue + lineCode + ':' + objCreditLineAmounts[lineCode];
								assignedCount++;
							}
						});
						
						if(validateCreditLineValues(objCreditLineCodes, objCreditLineAmounts)) {
							$('#strSelectedLineCodes').val(selectedCreditLineValue);
							$('#creditLinesCount').text('(' + assignedCount + ')');
							popup.close();
						}
					}
				}]
			});
		}
		var searchField = objCreditLinesPopup.down('AutoCompleter[itemId="nameFilter"]');
		var searchField2 = objCreditLinesPopup.down('AutoCompleter[itemId="currFilter"]');
			if((searchField!="" && searchField!=undefined))
			{
				searchField.setValue('');
			}
			if( (searchField2!="" && searchField2!=undefined  ))
			{
			searchField2.setValue('');
			}
			objCreditLinesPopup.show();
			objCreditLinesPopup.center();

	}
}

function isValidCreditLineAmount(value) {
	var validFlag = true;
	value = value.toString();
	if(Ext.isEmpty(value) || isNaN(value)) {
		validFlag = false;
	} else {
		var decimalPoints = value.length - value.indexOf('.') - 1;
		if(decimalPoints == value.length) {
			decimalPoints = 0;
		}
		if((decimalPoints > 4) || (value.indexOf('.')+1 === value.length) || (value.length > 17)) {
			validFlag = false;
		}
	}
	return validFlag;
}

function creditLineColumnRenderer(value, meta, record, rowIndex, colIndex, store, view, colId) {
	var returnValue = value;
	var clsName = '';
	if(colId === 'col_amount') {
		if(Ext.isEmpty(returnValue) && objCreditLineAmounts[record.data.lineCode]) {
			returnValue = objCreditLineAmounts[record.data.lineCode];
		}
	}
	if(blnViewOld && Object.keys(objCreditLineChangedItems).length != 0 && !Ext.isEmpty(record.get('lineCode'))) 
	{	
		clsName = objCreditLineChangedItems[record.get('lineCode')];
		if(colId === 'col_amount' && clsName == 'modifiedFieldValue')
		{
		  let oldAmount = objCreditLineOldAmounts[record.get('lineCode')];
		  clsName = 'fa fa-clock-o modifiedFieldValue';
		  if(oldAmount.toString().length > 4)
		  {
			   var oldAmountPart = oldAmount.toString().substring(0,5);
			   return returnValue + "\xa0\xa0"+'<span id="modifiedCreditLine" class="' + clsName + '" title="' + oldAmount + '">' +oldAmountPart+'...' +'</span>';
		  }
		  return returnValue +'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'+ '<span id="modifiedCreditLine" class="' + clsName + '">' + oldAmount+'</span>';
		}
		if(clsName == 'modifiedFieldValue')
		{
			clsName = '';
		}
		if(!Ext.isEmpty(objCreditLineDeletedFieldAmount[record.get('lineCode')]) && colId === 'col_amount') {
			returnValue = objCreditLineDeletedFieldAmount[record.get('lineCode')];
		}
		return '<span id="modifiedCreditLine" class="' + clsName + '">' + returnValue + '</span>';
	}	
	return '<span class="' + clsName + '">' + returnValue + '</span>';
}

function validateCreditLineValues(assignmentDetails, amountDetails) {
	var isValid = true;
	var strMessage = '';
	$.each(assignmentDetails, function(objProperty, objValue) {
		if(assignmentDetails[objProperty] && Ext.isEmpty(amountDetails[objProperty])) {
			isValid = false;
			strMessage = 'Please enter the amount for selected records';
		} else if(amountDetails[objProperty] && Number(amountDetails[objProperty]) > maxCreditLineAmountAllowed) {
			isValid = false;
			strMessage = 'Transaction Amount is greater than Maximum Amount Limit';
		}
	});
	if(!isValid) {
		Ext.Msg.alert("Error", strMessage);
	}
	
	return isValid;
}

function handleCreditLineGridData(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
	var popup = grid.up('window[itemId="creditLinesPopupItemId"]');
	var nameFilter = popup.down('AutoCompleter[itemId="nameFilter"]');
	var currFilter = popup.down('AutoCompleter[itemId="currFilter"]');
	var strFilter = '';
	var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if(PAGE_MODE == 'VIEW' || PAGE_MODE == 'SUBMIT')
		strUrl = strUrl + '&$seller=' + creditSellerCode;
		else
			strUrl = strUrl + '&$seller=' + encodeURIComponent($('#sellerId').val());
	
	if(!Ext.isEmpty(nameFilter.getValue())) {
		if(Ext.isEmpty(strFilter)) {
			strFilter = '&filter=';
		}
		strFilter = strFilter + 'Name:' + nameFilter.getValue();
	}
	if(!Ext.isEmpty(currFilter.getValue())) {
		if(Ext.isEmpty(strFilter)) {
			strFilter = '&filter=';
		} else {
			strFilter = strFilter + ',';
		}
		strFilter = strFilter + 'Curr:' + currFilter.getValue();
	}
	
	strUrl = strUrl + strFilter;

	grid.loadGridData(strUrl, function() {
		var grid = this;
		var isLocked = grid.getSelectionModel().isLocked();
		var store = grid.getStore();
		grid.getSelectionModel().setLocked(false);
		Ext.each(store.data.items, function(storeItem, storeItemIndex) {
			if(objCreditLineCodes[storeItem.data.lineCode]) {
				grid.selectRecord(storeItem, true);
			}
			if(objCreditLineAmounts[storeItem.data.lineCode]) {
				storeItem.data.amount = objCreditLineAmounts[storeItem.data.lineCode];
			}
		});
		grid.getSelectionModel().setLocked(isLocked);
	}, null, false, grid);
}

function enableDisableDispatch(field,count,branch,approvedFlag,partnerFlag,systemFlag,cmsFlag)
{
	var partnerIndecator=$('#chkPartnerBankFlag');
	var systemIndecator=$('#chkSystemIndicator');
	if(systemFlag=='Y')
	{
		if(PAGE_MODE == 'ADD')
		{
			cmsFlag='Y';
			$("#cmsFlag").val(cmsFlag);
		}
		$('#chkcmsFlag').attr('onclick',"toggleCheckUncheck(this,'cmsFlag');setDirtyBit();");
		$('#chkcmsFlag').attr('src','static/images/icons/icon_unchecked.gif');
		if(cmsFlag=='Y')
		{
			$('#chkcmsFlag').attr('src','static/images/icons/icon_checked.gif');
		}
		if(PAGE_MODE == 'EDIT' && sysControllingBranch && draweeBranchCode && sysControllingBranch == draweeBranchCode)
		{
			$('#chkcmsFlag').removeAttr("onclick");
			$('#chkcmsFlag').attr('src','static/images/icons/icon_unchecked_grey.gif');
			if(cmsFlag=='Y')
			{
				$('#chkcmsFlag').attr('src','static/images/icons/icon_checked_grey.gif');
			}
		}
	}
	else
	{
		$('#chkcmsFlag').attr('src','static/images/icons/icon_unchecked_grey.gif');
		$('#chkcmsFlag').removeAttr("onclick");
	}
	if(partnerFlag=='Y' || (field.id=='chkPartnerBankFlag' && partnerIndecator.attr('src').indexOf('/icon_checked')!=-1)
			||  systemFlag=='Y' || (field.id=='chkSystemIndicator' && systemIndecator.attr('src').indexOf('/icon_checked')!=-1))
		{ 
	
			if(approvedFlag=='Y' || count==1){
				$('#financialInstitutionType').prop('disabled','true');
				$('#financialInstitutionType').removeClass('disabled');
					}
			else
			{
			$('#financialInstitutionType').removeAttr('disabled');
			$('#financialInstitutionType').removeClass('disabled');
			}
	
		$('#pickupFacility').removeAttr('disabled');
		$('#pickupFacility').removeClass('disabled');
		
		$('#chkbranchSupportPrintingFlag').attr('onclick',"toggleCheckUncheck(this,'printingAtBranchFlag');setDirtyBit();");
		
		if(branch=='Y'){
			$('#chkbranchSupportPrintingFlag').attr('src','static/images/icons/icon_checked.gif');
		}else{
			$('#chkbranchSupportPrintingFlag').attr('src','static/images/icons/icon_unchecked.gif'); 
		}
		if($('#partnerBankFlag').val() == 'Y')
			{
			$('#chkbranchSupportPrintingFlag').attr('src','static/images/icons/icon_unchecked_grey.gif');
			$('#chkbranchSupportPrintingFlag').removeAttr("onclick");
			}
		}
	else
		{
		$('#financialInstitutionType').prop('disabled','true');
		
		$('#pickupFacility').prop('disabled','true');
		
		$('#chkbranchSupportPrintingFlag').attr('src','static/images/icons/icon_unchecked_grey.gif');
		$('#chkbranchSupportPrintingFlag').removeAttr("onclick");
		}
	
		enableDisablePrintingBranchField(branch,systemFlag);
	}
function clearBank()
{
	$('#exisitingBank').val('');
	$('#draweeBankCode').val('');
}

jQuery.fn.existingBankAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
					url : "cpon/bankBranchMst/existingBankAutoComplete.json?$bankName="
							+ encodeURIComponent($('#exisitingBank').val())
							+ "&$seller="
							+ $('#sellerId').val(),
					type : "POST",
					dataType : "json",
					data : {
						$autofilter : request.term
					},
					success : function(data) {
						var rec = data;
						response($.map(rec, function(item) {
									return {
										label : ('Y' == bankCodeFlag) ? item.DESCR : item.DRAWEE_BANK_DESCRIPTION,
										value : ('Y' == bankCodeFlag) ? item.DRAWEE_BANK_CODE : item.DRAWEE_BANK_DESCRIPTION,
										bankList : item
									}
								}));
					}
				});
			},
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.bankList;
				if (data) {
					if (!isEmpty(data.DRAWEE_BANK_CODE)) {
						if('Y' == bankCodeFlag) {
							$('#exisitingBank').val(data.DRAWEE_BANK_CODE);
							$('#newBankType').val(data.DRAWEE_BANK_CODE);
							$('#draweeBankName').val(data.DRAWEE_BANK_DESCRIPTION);
							$('#bankMicrCode').val(data.MICR_CODE);
						} else {
							$('#exisitingBank').val(data.DRAWEE_BANK_DESCRIPTION);
							$('#draweeBankCode').val(data.DRAWEE_BANK_CODE);
							$('#bankMicrCode').val(data.MICR_CODE);
						}
						if(data.SYSTEM_BANK == 'Y')
						{
							$('#chkSystemIndicator').attr('src','static/images/icons/icon_checked_grey.gif');
							$('#systemIndicator').val('Y');
							$('#chkPartnerBankFlag').attr('src','static/images/icons/icon_unchecked_grey.gif');
							$('#partnerBankFlag').val('N');
							$('#chkPartnerBankFlag').css( "pointer-events", "none" );
							$('#psd2div').attr('hidden',true);
							$('#mt920div').attr('hidden',true);
							$('#chkPSD2Flag').attr('src','static/images/icons/icon_unchecked_grey.gif');
							$('#psd2Flag').val('N');
							$('#chkPSD2Flag').css( "pointer-events", "none" );
							$('#chkMt920Flag').attr('src','static/images/icons/icon_unchecked_grey.gif');
							$('#mt920Flag').val('N');
							$('#chkMt920Flag').css( "pointer-events", "none" );
							$('#branchtype').show();
							$('#wholesaleType').prop("checked", true);
						}
						else
						{
							$('#chkSystemIndicator').attr('src','static/images/icons/icon_unchecked_grey.gif');
							$('#systemIndicator').val('N');
							$('#chkPartnerBankFlag').attr('src','static/images/icons/icon_unchecked.gif');
							$('#partnerBankFlag').val('N');
							$('#chkPartnerBankFlag').css( "pointer-events", "auto" );
							$('#psd2div').removeAttr('hidden');
							$('#mt920div').removeAttr('hidden');
							$('#chkPSD2Flag').attr('src','static/images/icons/icon_unchecked.gif');
							$('#psd2Flag').val('N');
							$('#chkPSD2Flag').css( "pointer-events", "auto" );
							$('#chkMt920Flag').attr('src','static/images/icons/icon_unchecked.gif');
							$('#mt920Flag').val('N');
							$('#chkMt920Flag').css( "pointer-events", "auto" );
							$('#branchtype').hide();
							$('#wholesaleType').prop("checked", false);
						}
					}
					if(data.SYSTEM_BANK=='Y')
						{
							$('#chkSystemIndicator').removeAttr('onclick');
							$('#chkSystemIndicator').attr('src','static/images/icons/icon_checked_grey.gif'); 
							$('#systemIndicator').val('Y');
							$('#partnerBankFlag').val('N');
							enableDisableDispatch('',fiCount,'','','','Y','');
							$('#chkPartnerBankFlag').removeAttr('onclick');
							$('#chkPartnerBankFlag').attr('src','static/images/icons/icon_unchecked_grey.gif');
							$('#psd2div').attr('hidden',true);
							$('#mt920div').attr('hidden',true);
							$('#chkPSD2Flag').attr('src','static/images/icons/icon_unchecked_grey.gif');
							$('#psd2Flag').val('N');
							$('#chkPSD2Flag').css( "pointer-events", "none" );
							$('#chkMt920Flag').attr('src','static/images/icons/icon_unchecked_grey.gif');
							$('#mt920Flag').val('N');
							$('#chkMt920Flag').css( "pointer-events", "none" );
							$('#branchtype').show();
							$('#wholesaleType').prop("checked", true);
					}
					else
					{
						$('#chkSystemIndicator').attr('src','static/images/icons/icon_unchecked_grey.gif'); 
						$('#chkSystemIndicator').removeAttr('onclick');
						$('#systemIndicator').val('N');
						$('#chkPartnerBankFlag').attr('src','static/images/icons/icon_unchecked.gif'); 
						$('#chkPartnerBankFlag').attr('onclick',"toggleCheckUncheck(this,'partnerBankFlag');setDirtyBit();enableDisableSystem(this);enableDisableDispatch(this,fiCount);toggleRadioButton('',this)");
						enableDisableDispatch('',fiCount,'','','N','N','');
						$('#psd2div').removeAttr('hidden');
						$('#mt920div').removeAttr('hidden');
						$('#chkPSD2Flag').attr('src','static/images/icons/icon_unchecked.gif');
						$('#psd2Flag').val('N');
						$('#chkPSD2Flag').css( "pointer-events", "auto" );
						$('#chkMt920Flag').attr('src','static/images/icons/icon_unchecked.gif');
						$('#mt920Flag').val('N');
						$('#chkMt920Flag').css( "pointer-events", "auto" );
						$('#branchtype').hide();
						$('#wholesaleType').prop("checked", false);
					}
				}
			},
			change:function(event,ui){
				 var val=ui.item;
				if(val===null)
				clearBank();
				},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function disableEnableBranch()
{
	if( $('#newBankId').prop('checked') == true )
	{
		$('#systemIndicator').val('N');
	}
		$('#chkSystemIndicator').attr('src','static/images/icons/icon_unchecked_grey.gif');
}

function populateLocations(elmt, mLocation)
{
	var location = document.getElementById("clearingLocCode");
	
	if(elmt.value != "")
	{
		
		$.post('cpon/clientServiceSetup/clientCountryLocationList.json', { $countryCode: elmt.value}, 
		function(data){
			populateLocationData(location, data);
			if(mLocation != "")
				location.value = mLocation;
			})
		
	}
}
function populateLocationData(select, locations)
{
	var x;
	select.length=1;
	
	for (x in locations)
	{
		var option=document.createElement("option");
		option.text=locations[x].LOC_DESCRIPTION;
		option.value=locations[x].CLEARING_LOC_CODE;
		select.add(option);
	}
}

jQuery.fn.ClearingLocationAutoComplete = function() {
    return this.each(function() {
        $(this).autocomplete({
            source : function(request, response) {
                $.ajax({
                            url : 'services/userseek/bankBranchClrLocation.json',
                            dataType : "json",
                            data : {
                                top : -1,
                                $autofilter : request.term,
                                $filtercode1 : strCountry
                            },
                            success : function(data) {
                                if (data && data.d && data.d.preferences) {
                                    var rec = data.d.preferences;
                                    response($.map(rec, function(item) {
                                                return {
                                                    label : item.CODE+':'+item.DESCRIPTION,
                                                    details : item
                                        }
                                    }));
                                }
                                else{
                                    if($(this).hasClass("ui-corner-top")){
                                        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                                        $(".ui-menu").hide();
                                    }
                                }
                                $("#clearingLocCode").val('');
                                $(this).focus();
                            }
                        });
            },
            focus: function( event, ui ) {
                $(".ui-autocomplete > li").attr("title", ui.item.label);
            },
            minLength : 1,
            select : function(event, ui) 
            {
                if (ui.item)
                {
                    $("#clearingLocCode").val(ui.item.details.CODE);
                    $(this).attr('oldValue',ui.item.label);
                    setDirtyBit();
                }
            },
            change : function() {
                if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val()))
                {
                    $("#clearingLocCode").val('');
                    $(this).val('');
                    setDirtyBit();
                }
            },
            open : function() {
                $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
            },
            close : function() {
                $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                $(this).focus();
            }
        });
        $(this).on('blur',function(){
            if(!$('.ui-autocomplete.ui-widget:visible').length) {
                if ($('#clearingLocCode').val() == '')
                {  
                    $(this).val('');
                    setDirtyBit();
                }
                if ($(this).val() == '')
                {
                    $('#clearingLocCode').val('');
                    setDirtyBit();
                }
            }
            else
            {
                $(this).focus();
            }
        });
    });
};
function showHideBranchType()
{
	if($('#systemIndicator').val()=='N')
	{
		$('#branchtype').hide();
		$('#wholesaleType').prop("checked", false);
		$('#retailType').prop("checked", false);
	}
	else
		$('#branchtype').show();
}