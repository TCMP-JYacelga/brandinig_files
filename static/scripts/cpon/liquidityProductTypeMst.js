function handleViewChanges(strUrl,mode) {
	var frm = document.forms["frmMain"];
	var strUrlValue = getLmsProductTypeEntryUrl(strUrl);
	// enableDisableForm(false);
	// var flagMixed = false;
	$('#VIEWCHANGES').val(mode);
	$('#productTypeName').removeAttr('disabled');
	// if($('#productCatType').is(":disabled")){
	// flag = true;
	// $('#productCatType').removeAttr('disabled');
	// $('#customLayoutId').removeAttr('disabled');
	// }
	frm.action = strUrlValue;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function postData(strUrl) {
	var frm = document.forms["frmMain"];
	var strUrlValue = getLmsProductTypeEntryUrl(strUrl);
	// enableDisableForm(false);
	// var flagMixed = false;
	$('#sellerId').removeAttr('disabled');
	$('#productTypeName').removeAttr('disabled');
	// if($('#productCatType').is(":disabled")){
	// flag = true;
	// $('#productCatType').removeAttr('disabled');
	// $('#customLayoutId').removeAttr('disabled');
	// }
	frm.action = strUrlValue;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	// if(flagMixed){
	// $('#productCatType').attr('disabled', 'disabled');
	// $('#customLayoutId').attr('disabled', 'disabled');
	// }
}

function getCancelConfirmPopUp(strUrl) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['okBtn']] = function() {
		$(this).dialog("close");
		goToPage(strUrl);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
	};
	if (dityBitSet) {
		$('#confirmMsgPopup').dialog({
					autoOpen : false,
					height : 150,
					width : 430,
					modal : true,
					buttons : buttonsOpts
				});
		$('#confirmMsgPopup').dialog("open");
	} else {
		goToPage(strUrl);
	}
}
jQuery.fn.dateTextBox = function() {
	return this.each(function() {
				$(this).keydown(function(e) {
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad for TAB
							return (key == 9 || key == 8 || key == 46);
						})
			})
};

function toggleCheckboxFeatureDetails(elem) {
	var element1 , image1 , str;
	var image = elem.getElementsByTagName("IMG")[0];
	var element = elem.getAttribute("id");
	var elementId = elem.getAttribute("id").replace("chkService_", "");
	// var selectedArray = document.getElementById("selectedEntryFeatures");
	if (image.src.search("icon_checked.gif") == -1) {
		image.src = "static/images/icons/icon_checked.gif";
		$("#FEATURE_" + elementId).val('Y');
		
		if('chkService_FLMS_000021' === element)
		{
			$('#chkService_FLMS_000023').parent().removeClass('hidden');
			$('#chkService_FLMS_000022').parent().removeClass('hidden');
			
			$('#chkImg_FLMS_000022').attr('src', "static/images/icons/icon_checked.gif");
			$('#FEATURE_FLMS_000022').val('Y');
			
		}
	} else {
		image.src = "static/images/icons/icon_unchecked.gif";
		$("#FEATURE_" + elementId).val('N');
		
		if('chkService_FLMS_000021' === element)
		{
			$('#chkService_FLMS_000023').parent().addClass('hidden');
			$('#chkService_FLMS_000022').parent().addClass('hidden');
			
			$('#chkImg_FLMS_000023').attr('src', "static/images/icons/icon_unchecked.gif");
			$('#chkImg_FLMS_000022').attr('src', "static/images/icons/icon_unchecked.gif");
			
			$('#FEATURE_FLMS_000023').val('N');
            $('#FEATURE_FLMS_000022').val('N');
        }
		
		if('chkService_FLMS_000022' === element)
		{
				$('#chkImg_FLMS_000023').attr('src', "static/images/icons/icon_checked.gif");
				$('#FEATURE_FLMS_000023').val('Y');
		}
		else if('chkService_FLMS_000023' === element)
		{
				$('#chkImg_FLMS_000022').attr('src', "static/images/icons/icon_checked.gif");
				$('#FEATURE_FLMS_000022').val('Y');
		}
	}
	if(element == 'chkService_FLMS_000010')
	{
		element1 = document.getElementById("chkService_FLMS_000011");
		str = 'FLMS_000011';
	}
	else if(element == 'chkService_FLMS_000011')
	{
		element1 = document.getElementById("chkService_FLMS_000010");
		str = 'FLMS_000010';
	}
	else if(element == 'chkService_FLMS_000001')
	{
		element1 = document.getElementById("chkService_FLMS_000002");
		str = 'FLMS_000002';
	}
	else if(element == 'chkService_FLMS_000002')
	{
		element1 = document.getElementById("chkService_FLMS_000001");
		str = 'FLMS_000001';
	}
	if(element == 'chkService_FLMS_000010' || element == 'chkService_FLMS_000011' 
		|| element == 'chkService_FLMS_000001' || element == 'chkService_FLMS_000002')
	{
		if(image.src.search("icon_checked.gif") == -1)
		{
			image1 = element1.getElementsByTagName("IMG")[0];
			image1.src = "static/images/icons/icon_checked.gif";
			$("#FEATURE_" + str).val('Y');
				if(linkedClientCount != 0 && element == 'chkService_FLMS_000011')
			$('#chkService_FLMS_000010').attr('onclick', 'toggleCheckboxFeatureDetails(chkService_FLMS_000010)');
		}
		else if(linkedClientCount != 0 && element == 'chkService_FLMS_000011' )
			{
			image1 = element1.getElementsByTagName("IMG")[0];
			image1.src = "static/images/icons/icon_unchecked.gif";
			$("#FEATURE_" + str).val('N');
			$('#chkService_FLMS_000010').attr('onclick', 'toggleCheckboxFeatureDetails(chkService_FLMS_000010)');
			}
		else
		{
			image1 = element1.getElementsByTagName("IMG")[0];
			image1.src = "static/images/icons/icon_unchecked.gif";
			$("#FEATURE_" + str).val('N');
		}
	}
	
}
function setDirtyBit() {
	dityBitSet = true;
}

function getLmsProductTypeMstUrl(urlKey) {
	return mapLmsProductTypeUrl[modelSelectedMst][urlKey];
}
function getLmsProductTypeEntryUrl(urlKey) {
	var chrProdutTypeCategory = $('#productTypeCategory').val();
	return mapLmsProductTypeUrl[chrProdutTypeCategory][urlKey];
}
var mapLmsProductTypeUrl = {
	'S' : {
		'summaryListUrl' : 'sweepingProductTypeMstList.form',
		'viewUrl' : 'viewLiquiditySweepingProductTypeMst.form',
		'entryUrl' : 'addLiquiditySweepingProductTypeMst.form',
		'editUrl' : 'editLiquiditySweepingProductTypeMst.form',
		'saveUrl' : 'saveLiquiditySweepingProductTypeMst.form',
		'updateUrl' : 'updateLiquiditySweepingProductTypeMst.form',
		'viewChanges' : 'viewChangesLiquiditySweepingProductTypeMst.form',
		'submitUrl' : 'submitLiquiditySweepingProductTypeMst.form',
		'historyurl' : 'liquiditySweepingProductTypeMstHistory.hist',
		'lmsFeatures' : 'cpon/liquiditySweepingProductTypeMst/LmsFeatures',
		'listUrl' : 'services/liquiditySweepingProductTypeMstList.json'

	},
	'N' : {
		'summaryListUrl' : 'poolingProductTypeMstList.form',
		'viewUrl' : 'viewLiquidityPoolingProductTypeMst.form',
		'entryUrl' : 'addLiquidityPoolingProductTypeMst.form',
		'editUrl' : 'editLiquidityPoolingProductTypeMst.form',
		'saveUrl' : 'saveLiquidityPoolingProductTypeMst.form',
		'updateUrl' : 'updateLiquidityPoolingProductTypeMst.form',
		'viewChanges' : 'viewChangesLiquidityPoolingProductTypeMst.form',
		'submitUrl' : 'submitLiquidityPoolingProductTypeMst.form',
		'historyurl' : 'liquidityPoolingProductTypeMstHistory.hist',
		'lmsFeatures' : 'cpon/liquidityPoolingProductTypeMst/LmsFeatures',
		'listUrl' : 'services/liquidityPoolingProductTypeMstList.json'
	}
};
