var objLiquidityProdChangePopup = null;
var strProdType = null;
var strOldProd = null;

function genericPopupStoreReload(productId){
    
    var objCurrencyPopup=objCurrenciesSelectionPopup;
    var objAccountPopup=objAccountTypeSelectionPopup;
    
    var delRecord = [];
    
    var objCcyGridStore = null;
    var objAccGridStore = null;
    
    var strCcyProxyUrl=null;
    var strAccProxyUrl=null;
    
    if(!Ext.isEmpty(objCurrencyPopup)){
        var customUrl=objCurrencyPopup.getGeneratedFilterUrl();
        objCurrencyPopup.productId = productId;
        objCcyGridStore=objCurrencyPopup.down('smartgrid[itemId="summaryGrid_currenciesSelectionPopup"]').getStore();
        //console.log(objCcyGridStore);
        strCcyProxyUrl = objCcyGridStore.getProxy().url=customUrl;
        objCurrencyPopup.down('smartgrid[itemId="summaryGrid_currenciesSelectionPopup"]').refreshData();
    }
    
    
    if(!Ext.isEmpty(objAccountPopup)){
        var customUrl=objAccountPopup.getGeneratedFilterUrl();
        objAccountPopup.productId = productId;
        objAccGridStore=objAccountPopup.down('smartgrid[itemId="summaryGrid_accountTypeSelectionPopup"]').getStore();
        strAccProxyUrl = objAccGridStore.getProxy().url=customUrl;
        objAccountPopup.down('smartgrid[itemId="summaryGrid_accountTypeSelectionPopup"]').refreshData();
    }
}

function genericPoolPopupStoreReload(productId){
    //console.log(productId);
    var objPoolCurrencyPopup=objPoolCurrenciesSelectionPopup;
    var objPoolAccountPopup=objPoolAccountTypeSelectionPopup;
    
    var objCcyGridStore = null;
    var objAccGridStore = null;
    
    var strCcyProxyUrl=null;
    var strAccProxyUrl=null;
    
    if(!Ext.isEmpty(objPoolCurrencyPopup)){
        var customUrl=objPoolCurrencyPopup.getGeneratedFilterUrl();
        objPoolCurrencyPopup.productId = productId;
        objCcyGridStore=objPoolCurrencyPopup.down('smartgrid[itemId="summaryGrid_currenciesPoolSelectionPopup"]').getStore();
        strCcyProxyUrl = objCcyGridStore.getProxy().url=customUrl;
        objPoolCurrencyPopup.down('smartgrid[itemId="summaryGrid_currenciesPoolSelectionPopup"]').refreshData();
    }
    
    
    if(!Ext.isEmpty(objPoolAccountPopup)){
        var customUrl=objPoolAccountPopup.getGeneratedFilterUrl();
        objPoolAccountPopup.productId = productId;
        objAccGridStore=objPoolAccountPopup.down('smartgrid[itemId="summaryGrid_poolAccountTypeSelectionPopup"]').getStore();
        strAccProxyUrl = objAccGridStore.getProxy().url=customUrl;
        objPoolAccountPopup.down('smartgrid[itemId="summaryGrid_poolAccountTypeSelectionPopup"]').refreshData();
    }
}

var strThemeId=null;
var isCustomReportHideFlag = "N";
var isReportCenterHideFlag = "N";
var billingDate=null;

window.onload = function() {

/*
$("a[id^='chkService']").click(function() {  // this is your event
    setDirtyBit();
});
$("input").change(function() {  // this is your event
    setDirtyBit();
});
$("img[id^='chkAll']").click(function() {  // this is your event
    setDirtyBit();
});
$("a[class^='button_underline']").click(function() {  // this is your event
    setDirtyBit();
});
$("a[class^='thePointer button_underline']").click(function() {  // this is your event
    setDirtyBit();
});

$("a[id^='chk_']").click(function() {  // this is your event
    setDirtyBit();
});
$("img[id^='chk']").click(function() {  // this is your event
    setDirtyBit();
});*/
    
$('#lnkClientInfo').attr('disabled',true);
$('#lnkClientInfo').css({'pointer-events' : 'none',
                         'cursor' : 'default'});
(function ($) {
    $.fn.selected = function (fn) {
        return this.each(function () {
            $(this).change(function () {
                this.dataChanged = true;
                fn(this);
            })
        });
    };
})(jQuery);

/*
$("select").selected(function (e) {
    setDirtyBit();
});
*/
};
function goToPage(strUrl, frmId) {
    var me = this;
    var frm = document.getElementById(frmId);
    frm.action = strUrl;
    frm.target = "";
    frm.method = "POST";
    $("textarea").removeAttr('disabled');
	$("select").removeAttr('disabled');
	$("input[type=radio]").removeAttr('disabled');
	frm.submit();
}
function goToUpdatePage(strUrl, frmId) {
    var me = this;
    var frm = document.getElementById(frmId);
    frm.action = strUrl;
    frm.target = "";
    frm.method = "POST";
    $("textarea").removeAttr('disabled');
    $('#creditLine').removeClass('disabled');
    $('#lineDeposit').removeAttr('disabled');
	$('#lineInstrument').removeAttr('disabled');
	$('#limitDeposit').removeAttr('disabled');
	$('#limitInstrument').removeAttr('disabled');
    $('input[name=lineReversal]').removeAttr('disabled');
    $('input[name=accountingLevel]').removeAttr('disabled');
    $('input[name=limitProcessingFlag]').removeAttr('disabled');
    // value is undefined in IE for adminFeatureProfileId and ccy
    adminFeatureProfileId = $('input#adminFeatureProfileId[type="hidden"]');
    ccy = $('input#ccy[type="hidden"]');
    frm.appendChild(me.createFormField('INPUT','HIDDEN','adminFeatureProfileId',adminFeatureProfileId.val()));
    frm.appendChild(me.createFormField('INPUT','HIDDEN','ccy',ccy.val()));
    if($('#arrangementProfileId option:selected').val().length > 0){
        $('#arrangment').val($('#arrangementProfileId option:selected').text().split('-')[1].trim());    
    }else{
        $('#arrangment').val("");
    }    
    frm.submit();
}

function goToViewPage(strUrl, frmId) {
    var me = this;
    var frm = document.getElementById(frmId);
    frm.action = strUrl;
    frm.target = "";
    frm.method = "POST";
    $("textarea").removeAttr('disabled');
    frm.appendChild(me.createFormField('INPUT','HIDDEN','adminFeatureProfileId',adminFeatureProfileId.value));
    frm.appendChild(me.createFormField('INPUT','HIDDEN','ccy',ccy.value));
    
    frm.submit();
}

function goToHome( strUrl )
{
	var frm = document.getElementById( 'frmMain' );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function toggleCheckUncheck(imgElement, flag) {

    if (imgElement.src.indexOf("icon_unchecked_grey.gif") == -1) {

        if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
            imgElement.src = "static/images/icons/icon_checked.gif";
            $('#' + flag).val('Y');
        } else {
            imgElement.src = "static/images/icons/icon_unchecked.gif";
            $('#' + flag).val('N');
        }
    }
}

function setCheckUnchekPkgType(flag, fieldSingle, fieldMulti) {
    if (flag == 'M') {
        $('#' + fieldSingle)
                .attr('src', 'static/images/icons/icon_checked_grey.gif');
        $('#' + fieldMulti).attr('src', 'static/images/icons/icon_checked_grey.gif');
    } else if (flag == 'Q') {
        $('#' + fieldSingle)
                .attr('src', 'static/images/icons/icon_checked_grey.gif');
    } else if (flag == 'B') {
        $('#' + fieldMulti).attr('src', 'static/images/icons/icon_checked_grey.gif');
    } else {
        $('#' + fieldSingle).attr('src',
                'static/images/icons/icon_unchecked_grey.gif');
        $('#' + fieldMulti).attr('src',
                'static/images/icons/icon_unchecked_grey.gif');
    }
}

function toggleCheckUncheckPkgType(imgElement, flag) {
    var singleChk = document.getElementById('chkSinglePkgType');
    var multiChk = document.getElementById('chkMultiPkgType');
    if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
        imgElement.src = "static/images/icons/icon_checked.gif";
    } else {
        imgElement.src = "static/images/icons/icon_unchecked.gif";
    }

    if (singleChk.src.indexOf("icon_checked.gif") > -1
            && multiChk.src.indexOf("icon_checked.gif") > -1)
    {
        $('#' + flag).val('M');
    } 
    else if (singleChk.src.indexOf("icon_checked.gif") > -1) 
    {
        $('#' + flag).val('Q');
    } 
    else if (multiChk.src.indexOf("icon_checked.gif") > -1)
    {
        $('#' + flag).val('B');
    }
    else
        $('#' + flag).val('N');
}

function goToPageClientServiceSetupSave(strUrl, frmId) {
    var frm = document.getElementById(frmId);
    //var form = $(frmId).serialize();
    $('input:disabled').each( 
        function()
        {
            $(this).removeAttr( " disabled " );
            //form = form + '&' + $(this).attr('name') + '=' + $(this).val();
    });

    $('textarea:disabled').each( 
        function()
        {
            $(this).removeAttr( " disabled " );
            //form = form + '&' + $(this).attr('name') + '=' + $(this).val();
    });

    $('select:disabled').each( 
        function()
        {
            $(this).removeAttr( " disabled " );
            //form = form + '&' + $(this).attr('name') + '=' + $(this).val();
    });

    if($('#themeProfileId').val()==null || $('#themeProfileId').val()=='')
    {
        if(strThemeId!= null)
        {
            $('#themeProfileId').val(strThemeId);                
        }
        /*else  // commented to fix DHGCP441-2742
        {
            $('#themeProfileId').val(oldThemeId);
        }*/
    }
    
    var promoBillingDiscount ;
	if($('#promoBillingDiscount') != null)
	{
		blnAutoNumeric = isAutoNumericApplied('promoBillingDiscount');
		if (blnAutoNumeric)
			promoBillingDiscount = $("#promoBillingDiscount").autoNumeric('get');
		else
			promoBillingDiscount = $("#promoBillingDiscount").val();
	}
	document.getElementById('promoBillingDiscount').value = promoBillingDiscount;
    
    frm.action = strUrl;
    frm.target = "";
    frm.method = "POST";
    frm.submit(); 
}

function getBrandingPachakeDetails(element) {
    var elementValue = $(element).val();
    $.ajax({
        url : "cpon/clientServiceSetup/brandingPackageDetails.json",
    //    contentType : "application/json",
        type : 'POST',
        data : {packageId:elementValue},
        success : function(data) {
            $('#acctMgrCode').val(data.acctMgrCode);
            $('#acctMgrDesc').val(data.acctMgrDesc);
            $('#segmentType').val(data.segmentType);
            $('#industryType').val(data.industryType);
            $('#notes').val(data.notes);
            $('#themeProfileId').val(data.themeProfileId);
            $('#billingProfileId').val(data.billingProfileId);
            $('#billingProfileDesc').val(data.billingProfileDesc);
            $('#hiddenService_CUSTSER').val(data.customServicesFlag);
            $('#hiddenService_GRANPERM').val(data.granularPermission);
            strThemeId = data.themeProfileId;
                
            recKey = data.recordKeyNo;
            setCheckBoxServiceValue('br', data.brEnable);
            setCheckBoxServiceValue('bankRep', data.bankRepEnable);
            setCheckBoxServiceValue('collection', data.collectionEnable);
            togglePayoutServices(data.collectionEnable,'N');
            setCheckBoxServiceValue('forecast', data.forecastEnable);
            /*setCheckBoxServiceValue('incomingAch', data.incomingAchEnable);*/
            setCheckBoxServiceValue('incomingWire', data.incomingWireEnable);
            /*setCheckBoxServiceValue('investments', data.investmentsEnable);*/
            setCheckBoxServiceValue('payment', data.paymentEnable);
            setCheckBoxServiceValue('positivePay', data.positivePayEnable);
            setCheckBoxServiceValue('trade', data.tradeEnable);
            setCheckBoxServiceValue('fsc', data.fscEnable);
            setCheckBoxServiceValue('checks', data.checksEnable);
            setCheckBoxServiceValue('limits', data.limitsEnable);
            setCheckBoxServiceValue('loan', data.loanEnable);
            setCheckBoxServiceValue('deposits', data.depositsEnable);
            setCheckBoxServiceValue('liquidity', data.liquidityEnable);
            setCheckBoxServiceValue('lms', data.lmsEnable);
            setCheckBoxServiceValue('portal', data.portalEnable);
            setCheckBoxServiceValue('mobile', data.mobileEnable);
            setCheckBoxServiceValue('subAccount', data.subAccountEnable);
            setServiceCheckUnchek('hiddenService_CUSTSER','chkcustomServicesFlag',false);
            setServiceCheckUnchek('hiddenService_GRANPERM','chkgranularPermission',false);
            setMobileServiceCheckBox('Pay',data.mobilePayEnable,data.paymentEnable);
            setMobileServiceCheckBox('Btr',data.mobileBtrEnable,data.brEnable);
            setMobileServiceCheckBox('Pp',data.mobilePpEnable,data.positivePayEnable);
            $('#promotionalBilling').val(data.promotionalBilling);
            setPromoBillingCheckBox('promotionalBilling','promotionalbillingImg');
            $('#promoBillingStartDate').val(data.promoBillingStartDate);
            $('#promoBillingEndDate').val(data.promoBillingEndDate);
            $('#promoBillingDiscount').val(data.promoBillingDiscount);
			setCheckBoxServiceValueAndDisplayAddress('payment',data.paymentEnable);
            if(data.clientBillBy === 'CHARGE'){
                $('#billByAccountImg').attr('src','static/images/icons/icon_checked.gif');
                $('#billByActivityImg').attr('src','static/images/icons/icon_unchecked_grey.gif');
            }else if(data.clientBillBy === 'ACTVT'){
                $('#billByActivityImg').attr('src','static/images/icons/icon_checked.gif');
                $('#billByAccountImg').attr('src','static/images/icons/icon_unchecked_grey.gif');
            }
        }
    });
}

function setCheckBoxServiceValue(elm, elmValue) {
    var hiddenElement = document.getElementsByName(elm + "Enable")[0];
    elmValue = elmValue == undefined ? 'N' : elmValue;
    if (undefined != elmValue) {
        var checkBoxImgElm = document.getElementById('chk' + elm);
        if(undefined !=hiddenElement)
        {
            hiddenElement.value = elmValue.trim();
        }
        if (elmValue == 'Y' && null!=checkBoxImgElm) {
            checkBoxImgElm.src = "static/images/icons/icon_checked.gif";
        } else if (elmValue == 'N' && null!=checkBoxImgElm){
            checkBoxImgElm.src = "static/images/icons/icon_unchecked.gif";
        }
    }
    
}

function setMobileServiceCheckBox(ele,value,parentValue){
    var hiddenElement = document.getElementsByName("mobile"+ ele + "Enable")[0];    
    if (undefined != value) {
        var checkBoxImgElm = document.getElementById('chkMobile' + ele);
        if(undefined !=hiddenElement)
        {
            hiddenElement.value = value.trim();
        }
        if (value == 'Y' && null!=checkBoxImgElm) {
            checkBoxImgElm.src = "static/images/icons/icon_checked.gif";
        } else if (value == 'N' && null!=checkBoxImgElm){
            if(parentValue == 'Y'){
                checkBoxImgElm.src = "static/images/icons/icon_unchecked.gif";
                $(checkBoxImgElm).parent('a').attr('onclick','toggleMobileCheckboxServices(this,"N");javascript:setDirtyBit()');
            }else{
                checkBoxImgElm.src = "static/images/icons/icon_unchecked_grey.gif";
            }            
        }
    }
}

jQuery.fn.SetCheckboxValues = function(isAuthorized) {
    $(this)
            .each(
                    function(index) {
                        var imageList = $(this).find('IMG');
                        var elementId = $(this).attr("id").replace(
                                "chkService_", "");
                        if (null != document.getElementById("hiddenService_"
                                + elementId)) {
                            if ("N" === document
                                    .getElementById("hiddenService_"
                                            + elementId).value && undefined!=imageList) {
                                imageList[0].src = "static/images/icons/icon_unchecked.gif";
                            } else {
                                    
                                if(isAuthorized=='true'){
                                    imageList[0].src = "static/images/icons/icon_checked_grey.gif";
                                    $(this).removeAttr("onclick");
                                }
                                else
                                {
                                    imageList[0].src = "static/images/icons/icon_checked.gif";
                                }
                            }
                        }
                    });
};

jQuery.fn.SetClientCheckboxValues = function(isAuthorized) {
    $(this)
            .each(
                    function(index) {
                        var imageList = $(this).find('IMG');
                        var elementId = $(this).attr("id").replace(
                                "chkService_", "");
                        if (null != document.getElementById("hiddenService_"
                                + elementId)) {
                            if ("N" === document
                                    .getElementById("hiddenService_"
                                            + elementId).value && undefined!=imageList && elementId != 'PAYOUT' 
                                            && elementId != 'INTERNALCLIENT' && elementId != 'CREDITCARD') {
                                imageList[0].src = "static/images/icons/icon_unchecked.gif";
                            } else {
                                var mapKeyName = map[elementId];
								 if(isAuthorized==true && brndngPkgvar == false &&  (('payment' != mapKeyName && ( (cmServiceRemoval=='N' && 'checks' == mapKeyName) 
								 || ( ppServiceRemoval=='N' && 'positivePay' == mapKeyName)))) && 'br' != mapKeyName && serviceMap[mapKeyName]=='Y') 
								 {
                                    imageList[0].src = "static/images/icons/icon_checked_grey.gif";
                                    $(this).removeAttr("onclick");
                                    var anchorEle = document.getElementById("chkService_"+ elementId);
                                    if(anchorEle != null)enableDisableMobileServices(anchorEle,true);
                                }
                                else
                                {
									if (elementId == 'PAYOUT' || elementId == 'INTERNALCLIENT' || elementId == 'CREDITCARD') {
										imageList[0].src = "static/images/icons/icon_unchecked_grey.gif";
									}
									else
									{
										imageList[0].src = "static/images/icons/icon_checked.gif";
									}
                                    var anchorEle = document.getElementById("chkService_"+ elementId);
                                    if(anchorEle != null)enableDisableMobileServices(anchorEle,'N');
                                }
                            }
                        }
                    });
};

function enableDuplicatePeriodInDays(flag) {
    (flag == 1) ? ($("#dupCheckPeriod").removeAttr("disabled"))
            : ($("#dupCheckPeriod").attr("disabled", "true"));
}
function enableWorkflowProfile(flag) {
    (flag == 1) ? ($("#workflowProfileId").removeAttr("disabled"))
            : ($("#workflowProfileId").attr("disabled", "true"));
}
function enableCustomAlertProfile(flag) {
    (flag == 1) ? ($("#customAlertProfileId").removeAttr("disabled"))
            : ($("#customAlertProfileId").attr("disabled", "true"));
}
function enableOthersCheckBox(flag) {
    if ((flag == 1)) {
        if ((document.getElementById("hiddenService_othersDepositInquiry").value) == 'N')
            document.getElementById('imgService_othersDepositInquiry').src = "static/images/icons/icon_unchecked.gif";
        else
            document.getElementById('imgService_othersDepositInquiry').src = "static/images/icons/icon_checked.gif";
        if ((document.getElementById("hiddenService_othersLoanRepayment").value) == 'N')
            document.getElementById('imgService_othersLoanRepayment').src = "static/images/icons/icon_unchecked.gif";
        else
            document.getElementById('imgService_othersLoanRepayment').src = "static/images/icons/icon_checked.gif";
        if ((document.getElementById("hiddenService_advanceDeposit").value) == 'N')
            document.getElementById('imgService_advanceDeposit').src = "static/images/icons/icon_unchecked.gif";
        else
            document.getElementById('imgService_advanceDeposit').src = "static/images/icons/icon_checked.gif";
        if ((document.getElementById("hiddenService_othersRedemptionCredit").value) == 'N')
            document.getElementById('imgService_othersRedemptionCredit').src = "static/images/icons/icon_unchecked.gif";
        else
            document.getElementById('imgService_othersRedemptionCredit').src = "static/images/icons/icon_checked.gif";
        $("#chkService_othersDepositInquiry").attr("onclick", "toggleCheckbox(this);");
        $("#chkService_othersLoanRepayment").attr("onclick", "toggleCheckbox(this);");
        $("#chkService_othersRedemptionCredit").attr("onclick", "toggleCheckbox(this);");
    } else {
        if ((null!=document.getElementById("chkImgPayments") && (document.getElementById("chkImgPayments").src
                .indexOf("icon_checked.gif")) == -1)
                && ((null != document.getElementById("chkImgBR")) && (document.getElementById("chkImgBR").src
                        .indexOf("icon_checked.gif")) == -1)) {
            document.getElementById('imgService_othersDepositInquiry').src = "static/images/icons/icon_unchecked_grey.gif";
            document.getElementById("hiddenService_othersDepositInquiry").value = 'N';
            $("#chkService_othersDepositInquiry").removeAttr("onclick");
            document.getElementById('imgService_othersLoanRepayment').src = "static/images/icons/icon_unchecked_grey.gif";
            document.getElementById("hiddenService_othersLoanRepayment").value = 'N';
            $("#chkService_othersLoanRepayment").removeAttr("onclick");
            document.getElementById("hiddenService_advanceDeposit").value = 'N';
            $("#chkService_advanceDeposit").removeAttr("onclick");
            document.getElementById('imgService_othersRedemptionCredit').src = "static/images/icons/icon_unchecked_grey.gif";
            document.getElementById("hiddenService_othersRedemptionCredit").value = 'N';
            $("#chkService_othersRedemptionCredit").removeAttr("onclick");
        }
    }
}
function enableLimitFields(flag) {
    if (flag == 1) {
        $("#flCrLimit").removeAttr("disabled");
        $("#flDrLimit").removeAttr("disabled");
        $("#blCrLimit").removeAttr("disabled");
        $("#blDrLimit").removeAttr("disabled");
    } else {
        $("#flCrLimit").attr("disabled", "true");
        $("#flDrLimit").attr("disabled", "true");
        $("#blCrLimit").attr("disabled", "true");
        $("#blDrLimit").attr("disabled", "true");
    }
}
function toggleCheckbox(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    var elementId = elem.getAttribute("id").replace("chkService_", "");
    var assignRec = true;
    if (undefined != image)
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        document.getElementById("hiddenService_" + elementId).value = "Y";
        if ((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_dupCheckRequiredFlag")
            enableDuplicatePeriodInDays(1);
        if ((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_workflowProfileFlag")
            enableWorkflowProfile(1);
        if ((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_acctUsageBr")
        {
            $("#divBR").show();
            //enableOthersCheckBox(1);
            // $("#acctGroup").removeAttr("disabled");
        }
        
        if (((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_acctUsagePortal"))
        {
            if( portalIBILLPAY != '' || portalESTMT != '')
                $("#divPortal").show();
            //enableOthersCheckBox(1);
            // $("#acctGroup").removeAttr("disabled");
        }
        
        if ((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_passThroughFlag")
            enableLimitFields(1);
        if ((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_paymentPrefunding") {
            $("#pLinkedBatchThresholdAmt").removeAttr("disabled");
            $("#accountPCcyCode").removeAttr("disabled");
        }
        
        if(null!=document.getElementById("hiddenService_acctUsageBr"))
        {
            /*if(document.getElementById("hiddenService_acctUsageBr").value == "Y" ||
            document.getElementById("hiddenService_acctUsagePay").value == "Y" || 
            document.getElementById("hiddenService_acctUsageLMS").value == "Y" || 
            document.getElementById("hiddenService_acctUsageColl").value == "Y" || 
            document.getElementById("hiddenService_acctUsageFSC").value == "Y" ||
            document.getElementById("hiddenService_acctUsageDispOnHP").value == "Y" )
        {
            $("#imgService_othersChecks").attr("src", "static/images/icons/icon_unchecked_grey.gif");
            $("#chkService_othersChecks").removeAttr("onclick");
            document.getElementById("hiddenService_othersChecks").value = "N";
        }*/
        }
        if (((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_acctUsageLimits"))
        {
            $("#divLimits").show();
        }
        if (((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_acctUsageBankReports"))
        {
            assignRec = true;
            //assignAccBankReport(assignRec);
        }
        if (((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_acctUsageSubAccounts"))
        {
            $("#divSubAccounts").show();
        }
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        document.getElementById("hiddenService_" + elementId).value = "N";

        if ((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_dupCheckRequiredFlag") {
            enableDuplicatePeriodInDays(0);
            $("#dupCheckPeriod").val('0');
        }
        if ((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_workflowProfileFlag") {
            enableWorkflowProfile(0);
            $("#workflowProfileId").val('Select');
        }
        if (((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_acctUsageBr"))
        {
            $("#divBR").hide();
            $('#chkImgBRAccountIntraDay').attr('src', 'static/images/icons/icon_unchecked.gif');
            $('#imgService_othersIncomingWires').attr('src', 'static/images/icons/icon_unchecked.gif');
            $('#chkImgDispOnHP').attr('src', 'static/images/icons/icon_unchecked.gif');
            //enableOthersCheckBox(0);
            // $("#acctGroup").attr("disabled","true");
            // document.getElementById("acctGroup").value = "";
        }
        if (((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_acctUsagePortal"))
        {
            $("#divPortal").hide();
            
            if( document.getElementById("hiddenService_portalIBillPayFlag") )
                document.getElementById("hiddenService_portalIBillPayFlag").value = "N";
            if( document.getElementById("hiddenService_portalEStatementFlag") )
                document.getElementById("hiddenService_portalEStatementFlag").value = "N";
            
            if( document.getElementById("chkImgPortalIBillPayFlag") )
                document.getElementById("chkImgPortalIBillPayFlag").src = "static/images/icons/icon_unchecked.gif";
            if( document.getElementById("chkImgPortalEStatementFlag") )
                document.getElementById("chkImgPortalEStatementFlag").src = "static/images/icons/icon_unchecked.gif";
            //enableOthersCheckBox(1);
            // $("#acctGroup").removeAttr("disabled");
        }
        if ((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_passThroughFlag") {
            enableLimitFields(0);
            $("#flCrLimit").val('0');
            $("#flDrLimit").val('0');
            $("#blCrLimit").val('0');
            $("#blDrLimit").val('0');
        }
        if ((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_paymentPrefunding") {
            $("#pLinkedBatchThresholdAmt").attr("disabled", "true");
            $("#accountPCcyCode").attr("disabled", "true");
            $("#pLinkedBatchThresholdAmt").val('');
            $("#accountPCcyCode").val('CCY');
        }
        
        if (((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_acctUsageLimits"))
        {
            $("#divLimits").hide();
        }
        if (((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_acctUsageBankReports"))
        {
            assignRec = false;
            //assignAccBankReport(assignRec);
        }
        if (((document.getElementById("hiddenService_" + elementId).id) == "hiddenService_acctUsageSubAccounts"))
        {
            $("#clientConstChars").val('');
            $("#issuableAcc").val('');
            $("#clientConstantLen").val('');
            $("input[name=partialMatch][value ='N']").prop('checked', true);
            $("input[name=autoAssignVA][value ='Y']").prop('checked', true);
            $("input[name=clientSpecifiedVA][value ='N']").prop('checked', true);
            $("#divSubAccounts").hide();
        }
        
    }
}
// used for client service setup entry Services
function toggleCheckboxServices(elem,isAuthorized) {
    var image = elem.getElementsByTagName("IMG")[0];
    var chkDisplayAddress= document.getElementById("chkDisplayAddress");
    var elementId = elem.getAttribute("id").replace("chkService_", "");
	var clientType = $('#clientType').val();
    if (undefined != image)
    if (image.src.indexOf("icon_checked.gif") == -1) {
        if(true === isAuthorized)
        {
            image.src = "static/images/icons/icon_checked_grey.gif";
        }
        else
        {
            image.src = "static/images/icons/icon_checked.gif";
            if(elementId=='02' && brndngPkgvar == false)
			{
					chkDisplayAddress.src = "static/images/icons/icon_checked.gif";
					document.getElementById("displayAddressFlag").value="Y";
			}
        }    
        document.getElementById("hiddenService_" + elementId).value = "Y";
        if (elementId == "05")
            togglePayoutServices("Y",getIsAuthorized(isAuthorized));
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        if(true === isAuthorized)
        {
            image.src = "static/images/icons/icon_unchecked_grey.gif";
        }
        else
        {
            image.src = "static/images/icons/icon_unchecked.gif";
            if(elementId=='02' && brndngPkgvar == false)
			{
					chkDisplayAddress.src = "static/images/icons/icon_unchecked.gif";
					document.getElementById("displayAddressFlag").value="N";
			}
        }
		if( clientType == 'M' && elementId == '02'  && brndngPkgvar == false)
		{
			if(pageMode!='ADD')
			getRemoveSerivecConfimationPopupCorp(image,getModuleLabel('02','Payments'),'frmMain',clientType);
		}
		else if( clientType == 'M' && elementId == '14'  && brndngPkgvar == false)
		{
			if(pageMode!='ADD')
			getRemoveSerivecConfimationPopupCorp(image,getModuleLabel('14','Check Management'),'frmMain',clientType);
		}
		else if( clientType == 'M' && elementId == '13'  && brndngPkgvar == false)
		{
			if(pageMode!='ADD')
			getRemoveSerivecConfimationPopupCorp(image,getModuleLabel('13','Positive Pay'),'frmMain',clientType);
		}
		else if( clientType == 'S' && (elementId == '02' || elementId == '13' || elementId == '14')  && brndngPkgvar == false)
		{
			if(pageMode!='ADD')
			getRemoveSerivecConfimationPopupCorp(image,getModuleLabel(elementId,'This'),'frmMain',clientType);

		}
        document.getElementById("hiddenService_" + elementId).value = "N";
        if (elementId == "05")
            togglePayoutServices("N",getIsAuthorized(isAuthorized));
    }
}

function toggleMobileCheckboxServices(elem,isAuthorized) {
    var image = elem.getElementsByTagName("IMG")[0];
    var elementId = elem.getAttribute("id").replace("mobileService_", "");    
    if (undefined != image)        
    if (image.src.indexOf("icon_checked.gif") == -1) {        
        if(true === isAuthorized)
        {
            image.src = "static/images/icons/icon_checked_grey.gif";
        }
        else
        {
            image.src = "static/images/icons/icon_checked.gif";
        }    
        document.getElementById("hiddenService_" + elementId).value = "Y";
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        if(true === isAuthorized)
        {
            image.src = "static/images/icons/icon_unchecked_grey.gif";
        }
        else
        {
            image.src = "static/images/icons/icon_unchecked.gif";
        }
        getRemoveSerivecConfimationPopupCorp(image,getModuleLabel(elementId,' '),'frmMain',$('#clientType').val());
        document.getElementById("hiddenService_" + elementId).value = "N";
    }    
}

function enableDisableMobileServices(element,isAuthorized){
    var image = element.getElementsByTagName("IMG")[0];
    var elementId = element.getAttribute("id").replace("chkService_", ""),
        imgId = null,eleId = null,
        clientType = $('#clientType').val();    
    if (undefined != image){
        switch(elementId){
            case '01': //Balance Reporting
                imgId = 'MobileBtr';
                eleId = "MOBILE_BTR";
                break;
            case '02': //Payments
                imgId = 'MobilePay';
                eleId = "MOBILE_PAY";
                break;
            case '13': //Positive Pay
                imgId = 'MobilePp';
                eleId = "MOBILE_PP";
                break;
            case '20': //Mobile Banking
                toggleMobileBankingCheckboxServices(image, element,clientType, elementId, isAuthorized );
                break;
        }        
        enableDisableMobileChkBoxServices(image, imgId, eleId, clientType, elementId, isAuthorized);
    }
}

function toggleCheckboxDisabled(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    var elementId = elem.getAttribute("id").replace("chkService_", "");
    var chkDisplayAddress= document.getElementById("chkDisplayAddress"); 

    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        document.getElementById("hiddenService_" + elementId).value = "Y";
        if(elementId=='02')
		{
				chkDisplayAddress.src = "static/images/icons/icon_checked.gif";
				document.getElementById("displayAddressFlag").value="Y";
		
		}

    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        document.getElementById("hiddenService_" + elementId).value = "N";
        if(elementId=='02')
		{
			chkDisplayAddress.src = "static/images/icons/icon_unchecked.gif";
			document.getElementById("displayAddressFlag").value="N";
		}
        
    }
    
}

function toggleCheckboxPCreditAccount(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        $("#hiddenService_paymentCreditAcc").val("Y");
        if(null != objCreditAccountAutoCompleter) {
        	objCreditAccountAutoCompleter.setValue("");
        	objCreditAccountAutoCompleter.setDisabled(true);
        }
        $("#lblpLinkedCreditAccount").addClass("toplabel");
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        $("#hiddenService_paymentCreditAcc").val("N");
        if(null != objCreditAccountAutoCompleter) 
        	objCreditAccountAutoCompleter.setDisabled(false);
        $("#lblpLinkedCreditAccount").removeClass('');
    }
}
function toggleCheckboxPChargeAccount(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    if (image.src.indexOf("grey.gif") != -1) {
        return;
    }
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";

        $("#hiddenService_paymentChargeAcct").val("Y");
        if(null != objChargeAccountAutoCompleter) {
        	objChargeAccountAutoCompleter.setValue("");
        	objChargeAccountAutoCompleter.setDisabled(true);
        }
        $("#lblpLinkedChargeAccount").addClass("toplabel");
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        $("#hiddenService_paymentChargeAcct").val("N");
        if(null != objChargeAccountAutoCompleter) 
        	objChargeAccountAutoCompleter.setDisabled(false);
        $("#lblpLinkedChargeAccount").removeClass('');
    }
}
function toggleCheckboxCReturnAccount(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        $("#hiddenService_collectionsReturnsAcct").val("Y");
        $("#collLinkedReturnsAcct").removeAttr("disabled");
        $("#lblcLinkedReturnsAcct").addClass("toplabel");
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        $("#hiddenService_paymentCreditAcc").val("N");
        $("#lblcLinkedReturnsAcct").removeClass('');
        $("#collLinkedReturnsAcct").attr("disabled", "true");
    }
}
function toggleCheckboxPGstAccount(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    if (image.src.indexOf("grey.gif") != -1) {
        return;
    }
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        $("#hiddenService_paymentGstAcct").val("Y");
        if(null != objGstAccountAutoCompleter) {  
        	objGstAccountAutoCompleter.setValue("");
        	objGstAccountAutoCompleter.setDisabled(true);
        }
        $("#lblpLinkedGstAccount").addClass("toplabel");
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        $("#hiddenService_paymentGstAcct").val("N");
        if(null != objGstAccountAutoCompleter) 
        	objGstAccountAutoCompleter.setDisabled(false);
        $("#lblpLinkedGstAccount").removeClass('');
    }
}
function toggleCheckboxCChargeAccount(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    if (image.src.indexOf("grey.gif") != -1) {
        return;
    }
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        $("#hiddenService_collectionsChargeAcct").val("Y");
        if(null != objCollChargeAccountAutoCompleter) {
        	objCollChargeAccountAutoCompleter.setDisabled(true);
        	objCollChargeAccountAutoCompleter.setValue("");
		}
        $("#lblcLinkedChargeAcct").addClass("toplabel");
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        $("#hiddenService_collectionsChargeAcct").val("N");
        if(null != objCollChargeAccountAutoCompleter) {
        	objCollChargeAccountAutoCompleter.setDisabled(false);
        	objCollChargeAccountAutoCompleter.setValue("");
		}
    }
}
function toggleCheckboxCGstAccount(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    if (image.src.indexOf("grey.gif") != -1) {
        return;
    }
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        $("#hiddenService_collectionsGstAcct").val("Y");
        if(null != objCollGstAccountAutoCompleter) {
        	objCollGstAccountAutoCompleter.setDisabled(true);
        	objCollGstAccountAutoCompleter.setValue("");
		}
        $("#lblcLinkedChargeAcct").addClass("toplabel");
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        $("#hiddenService_collectionsGstAcct").val("N");
        $("#lblcLinkedGstAcct").removeClass('');
        if(null != objCollGstAccountAutoCompleter) {
        	objCollGstAccountAutoCompleter.setDisabled(false);
        	objCollGstAccountAutoCompleter.setValue("");
		}
    }
}

jQuery.fn.SetSplittedSet1Values = function() {
    $(this)
            .each(
                    function(index) {
                        var elementId = $(this).attr("id").replace(
                                "splitset1_", "").replace("CountryCode", "");
                        if (null != document.getElementById("hidden_"
                                + elementId)
                                && null != document.getElementById("hidden_"
                                        + elementId).value
                                && 0 != document.getElementById("hidden_"
                                        + elementId).value.length) {
                                var code = $("#hidden_" + elementId).val().substring(0, 3);
                                    $(this).val(code);
                        }
                    });
};

jQuery.fn.SetSplittedSet2Values = function() {
    $(this)
            .each(
                    function(index) {
                        var elementId = $(this).attr("id").replace(
                                "splitset2_", "");
                        if (null != document.getElementById("hidden_"
                                + elementId)
                                && null != document.getElementById("hidden_"
                                        + elementId).value
                                && 0 != document.getElementById("hidden_"
                                        + elementId).value.length) {
                            $(this).val(
                                    $("#hidden_" + elementId).val()
                                            .substring(3));
                        }
                    });
};

function combineSplittedValues() {
     var mobCode=document.getElementById("splitset1_mobileNmbrCountryCode").value
 var mobNo=document.getElementById("splitset2_mobileNmbr").value
 var altCode=document.getElementById("splitset1_alternateMobileCountryCode").value
  var altNo=document.getElementById("splitset2_alternateMobile").value
 var faxCode=document.getElementById("splitset1_faxNmbrCountryCode").value
 var faxNo=document.getElementById("splitset2_faxNmbr").value
var billCode=document.getElementById("splitset1_billingFaxNmbrCountryCode").value
var billNo=document.getElementById("splitset2_billingFaxNmbr").value
var telCode=document.getElementById("splitset1_telephoneCountryCode").value
var telNo=document.getElementById("splitset2_telephone").value
var billtelCode=document.getElementById("splitset1_billingTelephoneCountryCode").value
var billtelNo=document.getElementById("splitset2_billingTelephone").value
 if((mobNo.length!=0)&&(mobCode.length==0))
 {
 mobCode="000";
 }
 
 if((telNo.length!=0)&&(telCode.length==0))
 {
 telCode="000";
 }
 if((faxNo.length!=0)&&(faxCode.length==0))
 {
     faxCode="000";
 }
 if((altNo.length!=0)&&(altCode.length==0))
 {
     altCode="000";
 }
 if((billNo.length!=0)&&(billCode.length==0))
 {
     billCode="000";
 }
 if((billtelCode.length!=0)&&(billtelNo.length==0))
 {
	 billtelCode="000";
 }
 if((mobCode!="") && (mobCode.length < 3))
 {
	 if (mobCode.length == 1)
	 {
		 mobCode = "00" + mobCode;
	 }
	 else
	 {
		 mobCode = "0" + mobCode;
	 }
 }
 if((telCode!="") && (telCode.length < 3))
 {
	 if (telCode.length == 1)
	 {
		 telCode = "00" + telCode;
	 }
	 else
	 {
		 telCode = "0" + telCode;
	 }
 }
    document.getElementById("hidden_mobileNmbr").value = mobCode + mobNo;
    document.getElementById("hidden_alternateMobile").value = altCode + altNo;
    document.getElementById("hidden_faxNmbr").value = faxCode + faxNo;
    document.getElementById("hidden_billingFaxNmbr").value = billCode + billNo;
    document.getElementById("hidden_telephone").value = telCode + telNo;
	document.getElementById("hidden_billingTelephone").value = billtelCode + billtelNo;
}

jQuery.fn.FormatCountryCode = function(value) {
    $(this).each(function(index) {

        if (value.length == 2) {
            $(this).val("0" + $(this).val());
        }
        if (value.length == 1) {
            $(this).val("00" + $(this).val());
        }
    });
};

function setDirtyBit() {
    //if(document.getElementById("dirtyBit"))    document.getElementById("dirtyBit").value = "0";
    $('#dirtyBit').val("1");
}

function goBackValidate(strUrl, frmId) {
    if (strUrl == 'null') {
        $("#frmMainCashPosition").dialog("close");
    } else if ($('#dirtyBit').val() == "1")
        getConfirmationPopup(frmId, strUrl);    
    else
    	goToPage(strUrl, frmId);
}

function getCancelConfirmPopUp(strUrl, frmId) {	
	$('#confirmMsgPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:'auto',
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
	});
	
	$('#confirmMsgPopup').dialog("open");
	if(event)
        event.preventDefault();
	
	$('#cancelBackConfirmMsgbutton').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
	});
	
	$('#okBackConfirmMsgbutton').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
		goToPage(strUrl, frmId);
	});
		
	$('#textContent').focus();		
	
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
        //position: { of: $( "#frmMain" ), at: "center top" },
        /*buttons : {
            "Yes" : {
                text: 'Yes',
                "class": "ux_label-margin-right",
                click: function() {
                var frm = document.getElementById(frmId);
                frm.action = strUrl;
                frm.target = "";
                frm.method = "POST";
                frm.submit();
            }
            },
            "No" : {
                text: 'No',
                click: function() {
                $(this).dialog("close");
            }
            }
        }*/
    });
    $('#confirmPopup').dialog("open");
    $('#cancelBackConfirmMsg').bind('click',function(){
        $('#confirmPopup').dialog("close");
    });
    $('#doneBackConfirmMsgbutton').bind('click',function(){
        var isSuccess = false;
        if(typeof dirtyRecords != 'undefined' && (Object.keys(dirtyRecords).length > 0 || $('#hiddenService_acctUsageSubAccounts').val() === 'Y')){
            var store = vaGrid.getStore();
            var requestData = [];
            var parentIdentifier = $('input[type="hidden"][name="viewState"]').val();
            $.each(store.data.items, function(index,item){
                if(dirtyRecords[item.data.recordKeyNo]){
                    requestData.push({
                        serialNo: index,
                        identifier: item.data.identifier,
                        userMessage: parentIdentifier
                    });
                }
            });
            if(requestData.length) {
                requestData = requestData.sort(function(valA, valB) {
                    return valA.serialNo - valB.serialNo;
                });
                var discardUrl = 'services/clientServiceSetup/discard.json?clientIdentifier=' + parentkey;
                $.ajax({
                    url: discardUrl,
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function(arrResponse) {
                        if(arrResponse.length) {
                            isSuccess = true;
                            $.each(arrResponse, function(index, response) {
                                if(response.success !== 'Y') {
                                    isSuccess = false;
                                }
                            });
                            if(isSuccess){
                                var frm = document.getElementById(frmId);
                                frm.action = strUrl;
                                frm.target = '';
                                frm.method = 'POST';
                                frm.submit();
                            }
                        }
                    },
                    error: function(response) {
                    }
                });
            }else{
                var frm = document.getElementById(frmId);
                frm.action = strUrl;
                frm.target = '';
                frm.method = 'POST';
                frm.submit();
            }
        }else{
            var frm = document.getElementById(frmId);
            frm.action = strUrl;
            frm.target = '';
            frm.method = 'POST';
            frm.submit();
        }
    });
    $('#textContent').focus();
}

function nextClickHandler(strUrl1, strUrl2, strUrl3, frmId) {
    /*
     * if ($('#dirtyBit').val() == "1") { if ($('#txtRecordKeyNo').val() == "") {
     * goToPage(strUrl1, frmId); } else { getConfirmationPopup(frmId, strUrl2); } }
     * else { if ($('#txtRecordKeyNo').val() == "") goToPage(strUrl1, frmId);
     * else goToPage(strUrl3, frmId); }
     */
    if ($('#dirtyBit').val() == "1")
        getConfirmationPopup(frmId, strUrl2);
    else
        goToPage(strUrl3, frmId);
}
/*
 * function getFilterData(ctrl) { var filterCode =
 * ctrl.options[ctrl.selectedIndex].value; var versionCode =
 * document.getElementById("txtVersion").value; if (filterCode) { var strData =
 * {}; strData['client_id'] = filterCode; strData['version'] = versionCode;
 * strData["screenId"] = 'Client Setup'; strData[csrfTokenName] =
 * csrfTokenValue;
 * $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI); $.ajax({ type :
 * 'POST', data : strData, url : "brandingPackageInfo.formx", success :
 * function(data) { if (data != null) { //advFilterResetForm('filterForm'); //
 * ctrl.value = filterCode; //valuesRetrieved(data, filterCode); } else { } }
 * }); } }
 */

function saveClientAdminFeatureProfile(strUrl) {
   /* if(clientType=='M')
    {
      selectedEntryFeatures.push("MC");
    }*/
   
    if(strUrl == 'clientServiceSetupList.form')
    	goBackValidate(strUrl, "frmMain")
    else
    {    var frm = document.forms["frmMain"]; 	
	    frm.action = strUrl;
	    frm.target = "";
	    frm.method = "POST";
	    if('Y' === popupMessagessSelectedValue || 'Y' ===  $('#allMessagesSelectedFlag').val()){
	        if(!selectedAdminFeatureList) {
	            if(preSelectedJson){
	                selectedAdminFeatureList = preSelectedJson; 
	            }
	            else{
	                selectedAdminFeatureList = [];
	            }
	        }
	        else{
	            selectedAdminFeatureList = JSON.parse(selectedAdminFeatureList);
	        }
	        selectedAdminFeatureList = JSON.stringify(selectedAdminFeatureList);
	        popupAdmFeaturesSelectedValue = 'Y';
	    }
	    // $('#selectedWidgets').val(selectedWidgetList);
	    // $('#selectedActionLinks').val(selectedActionList);
	    // $('#selectedMessages').val(selectedMessageList);
	     $('#selectedAdmFeatures').val(selectedAdminFeatureList);
	
	    // $('#popupWidgetsSelectedFlag').val(popupWidgetsSelectedValue);
	    // $('#popupLinksSelectedFlag').val(popupLinksSelectedValue);
	     $('#popupAdmFeaturesSelectedFlag').val(popupAdmFeaturesSelectedValue);
	    // $('#popupMessagessSelectedFlag').val(popupMessagessSelectedValue);
	    $('#entryFeatures').val(selectedEntryFeatures);
	    if (undefined != clientType && !isEmpty(clientType) && 'S' === clientType) {
	        $('#selectedWidgets').val([]);
	        $('#selectedLinks').val([]);
	        $('#selectedMessages').val([]);
	        $('#selectedAdmFeatures').val([]);
	        $('#allLinksSelectedFlag').val('N');
	        $('#allWidgetsSelectedFlag').val('N');
	        $('#allMessagesSelectedFlag').val('N');
	        $('#allAdmFeaturesSelectedFlag').val('N');
	    }
	    $.blockUI();
	    frm.submit();
    }
}

function saveClientLiquidityFeatureProfile(strUrl)
{
	 if(strUrl == 'clientServiceSetupList.form')
	    	goBackValidate(strUrl, "frmMain")
	    else
	    {
		    var frm = document.forms["frmMain"];
		    frm.action = strUrl;
		    frm.target = "";
		    frm.method = "POST";
		    // $('#selectedWidgets').val(selectedWidgetList);
		    // $('#selectedActionLinks').val(selectedActionList);
		    $('#entryFeatures').val(selectedEntryFeatures);
		    // $('#popupWidgetsSelectedFlag').val(popupWidgetsSelectedValue);
		    // $('#popupLinksSelectedFlag').val(popupLinksSelectedValue);
		    if ((selectedLiquidityFeatureList instanceof Array)) {
		            selectedLiquidityFeatureList = JSON
		                    .stringify(selectedLiquidityFeatureList);
		        }
		     $('#selectedLiqFeatures').val(selectedLiquidityFeatureList);
		     $('#selectedPopupOptions').val(strLMSFeatureList);
		    $('#popupLiqFeaturesSelectedFlag').val(popupLiqFeaturesSelectedValue);
		    $("#frmMain").find('select').addClass("enabled");
		    $("#frmMain").find('select').attr("disabled",false);
		    $.blockUI();
		    frm.submit();
	    }    
}

function saveClientLmsFeatureProfile(strUrl)
{
    var frm = document.forms["frmMain"];
    frm.action = strUrl;
    frm.target = "";
    frm.method = "POST";
    // $('#selectedWidgets').val(selectedWidgetList);
    // $('#selectedActionLinks').val(selectedActionList);
    $('#entryFeatures').val(selectedEntryFeatures);
    // $('#popupWidgetsSelectedFlag').val(popupWidgetsSelectedValue);
    // $('#popupLinksSelectedFlag').val(popupLinksSelectedValue);
    frm.submit();
}

function saveClientFSCFeatureProfile(strUrl) {
	if(strUrl == 'clientServiceSetupList.form')
    	goBackValidate(strUrl, "frmMain")
    else
    {
	    var frm = document.forms["frmMain"];
	    frm.action = strUrl;
	    frm.target = "";
	    frm.method = "POST";
	    if (clientType === 'S') {
	        $('#allLinksSelectedFlag').val('N');
	        $('#allWidgetsSelectedFlag').val('N');
	        $('#selectedWidgets').val([]);
	        $('#selectedActionLinks').val([]);
	        $('#entryFeatures').val(selectedEntryFeatures);
	        $('#selectedFSCFeatures').val([]);
	        $('#selectedPopupOptions').val([]);
	    } else {
	        $('#entryFeatures').val(selectedEntryFeatures);
	        $('#selectedFSCFeatures').val(strFSCPrevililegesList);
	        $('#selectedPopupOptions').val(strFSCFeatureList);
	        $('#popupFSCFeaturesSelectedFlag').val(popupFSCFeaturesSelectedValue);
	    }
	    $('#selectedLineCodes').val(selectedLineItemsList);
	    $('#popupLineCodeSelectedFlag').val(popupLineItemsSelectedValue);
	    $.blockUI();
	    frm.submit();
    }
}

function saveClientBrFeatureProfile(strUrl) {
	 if(strUrl == 'clientServiceSetupList.form')
	    	goBackValidate(strUrl, "frmMain")
	    else
	    {
		    var frm = document.forms["frmMain"];
		    frm.action = strUrl;
		    frm.target = "";
		    frm.method = "POST";
		    $("#cashPosFlag").val('Y');
		//    if ($('#chkAllBRFeaturesSelectedFlag').attr('src') == 'static/images/icons/icon_checked.gif') {
		    if(Ext.isEmpty(objBRFeaturePopup)){
		        getBRFeaturePopup();
		        objBRFeaturePopup.saveItems();
		        objBRFeaturePopup.close();
		    }else{
		        objBRFeaturePopup.saveItems();
		        objBRFeaturePopup.close();
		    }
		//    }
		    // $('#selectedWidgets').val(selectedWidgetList);
		    // $('#selectedActionLinks').val(selectedActionList);
		    $('#selectedBrFeatures').val(strBrPrevililegesList);
		    $('#selectedPopupOptions').val(strBrFeatureList);
		    // $('#selectedIntraDayAccnts').val(selectedIntraDayAccountList);
		    // $('#selectedPrevDayAccnts').val(selectedPrevDayAccountList);
		    // $('#selectedAccounts').val(selectedAccountList);
		    $('#entryFeatures').val(selectedEntryFeatures);
		    // $('#popupWidgetsSelectedFlag').val(popupWidgetsSelectedValue);
		    // $('#popupLinksSelectedFlag').val(popupLinksSelectedValue);
		    $('#popupBrFeaturesSelectedFlag').val(popupBrFeaturesSelectedValue);
		    // $('#popupIntraDayAcctSelectedFlag').val(popupIntraDayAcctSelectedValue);
		    // $('#popupPrevDayAcctSelectedFlag').val(popupPrevDayAcctSelectedValue);
		    // $('#popupAcctSelectedFlag').val(popupAcctSelectedValue);
		    $('#idScreenDisclaimerText').removeAttr("disabled");
		    $('#idReportDisclaimerText').removeAttr("disabled");
		    $('#pdScreenDisclaimerText').removeAttr("disabled");
		    $('#pdReportDisclaimerText').removeAttr("disabled");
		    if (undefined != clientType && !isEmpty(clientType) && 'S' === clientType) {
		        $('#selectedWidgets').val([]);
		        $('#selectedLinks').val([]);
		        $('#selectedCPC').val([]);
		        $('#selectedBrFeatures').val([]);
		        $('#allLinksSelectedFlag').val('N');
		        $('#allWidgetsSelectedFlag').val('N');
		        $('#allMessagesSelectedFlag').val('N');
		        $('#allBRFeaturesSelectedFlag').val('N');
		    }
		    $.blockUI();
		    frm.submit();
	    }    
}

function saveClientTradeFeatureProfile(strUrl) {
	 if(strUrl == 'clientServiceSetupList.form')
	    	goBackValidate(strUrl, "frmMain")
	 else
	 {
	    var frm = document.forms["frmMain"];
	    frm.action = strUrl;
	    frm.target = "";
	    frm.method = "POST";
	    if (clientType === 'S') {
	        $('#selectedTradeFeatures').val([]);
	        $('#selectedPopupOptions').val([]);
	        $('#entryFeatures').val([]);
	        $('#allWidgetsSelectedFlag').val('N');
	        $('#allLinksSelectedFlag').val('N');
	        $('#selectedWidgets').val([]);
	        $('#selectedActionLinks').val([]);
	    } else {
	        // $('#selectedWidgets').val(selectedWidgetList);
	        // $('#selectedActionLinks').val(selectedActionList);
	        $('#selectedTradeFeatures').val(strTradePrevililegesList);
	        $('#selectedPopupOptions').val(strTradeFeatureList);
	        $('#entryFeatures').val(selectedEntryFeatures);
	        // $('#popupWidgetsSelectedFlag').val(popupWidgetsSelectedValue);
	        // $('#popupLinksSelectedFlag').val(popupLinksSelectedValue);
	        $('#popupTradeFeaturesSelectedFlag')
	                .val(popupTradeFeaturesSelectedValue);
	    }
	    $.blockUI();
	    frm.submit();
	 }   
}

function saveClientForecastFeatureProfile(strUrl) {
	if(strUrl == 'clientServiceSetupList.form')
	    	goBackValidate(strUrl, "frmMain")
	else
	{
	    var frm = document.forms["frmMain"];
	    frm.action = strUrl;
	    frm.target = "";
	    frm.method = "POST";
	    
	    if(clientType==='M'){
	        $("textarea").removeAttr('disabled');
	        $("input[name='forTxnCntrDisclaimerRadioFlag']").removeAttr('disabled');
	        $("input[name='forSumDisclaimerRadioFlag']").removeAttr('disabled');
	        $("input[name='forPerSumDisclaimerRadioFlag']").removeAttr('disabled');
	        $("input[name='forTxnSumDisclaimerRadioFlag']").removeAttr('disabled');
	        
	    }
	    else if (undefined != clientType && !isEmpty(clientType) && 'S' === clientType) {
	        $('#selectedWidgets').val([]);
	        $('#selectedActionLinks').val([]);
	        $('#allWidgetsSelectedFlag').val('N');
	        $('#allLinksSelectedFlag').val('N');
	        $('#forTxnSumDisclaimerRadioFlag').val('');
	        $('#forTxnSumDisclaimerText').val('');
	        $('#forPerSumDisclaimerRadioFlag').val('');
	        $('#forPerSumDisclaimerText').val('');
	        $('#forSumDisclaimerRadioFlag').val('');
	        $('#forSumDisclaimerText').val('');
	        $('#forTxnCntrDisclaimerRadioFlag').val('');
	        $('#forTxnCntrDisclaimerText').val('');
	    }
	    // $('#selectedWidgets').val(selectedWidgetList);
	    // $('#selectedActionLinks').val(selectedActionList);
	    $('#entryFeatures').val(selectedEntryFeatures);
	    $('#selectedPopupOptions').val(strForecastFeatureList);
	    $('#popupForecastFeaturesSelectedFlag').val(popupForecastFeaturesSelectedValue);
	    // $('#popupWidgetsSelectedFlag').val(popupWidgetsSelectedValue);
	    // $('#popupLinksSelectedFlag').val(popupLinksSelectedValue);
	    $.blockUI();
	    frm.submit();
	}   
}

function saveClientSubAccountProfile(strUrl)
{
    var frm = document.forms["frmMain"];
    frm.action = strUrl;
    frm.target = "";
    frm.method = "POST";
    $('#entryFeatures').val(selectedEntryFeatures);
    frm.submit();
}


function goToFeaturePage(strUrl, frmId) {
    var frm = document.getElementById(frmId);
    var viewStateField = document.getElementById("viewState");
    frm.action = strUrl;
    frm.target = "";
    frm.method = "POST";
    frm.appendChild(createJSFormField('INPUT', 'HIDDEN', 'viewState',
            viewStateField));
    frm.submit();
}
function createJSFormField(element, type, name, value) {
    var inputField;
    inputField = document.createElement(element);
    inputField.type = type;
    inputField.name = name;
    inputField.value = value;
    return inputField;
}
function saveClientPaymentFeatureProfile(strUrl) {
	 if(strUrl == 'clientServiceSetupList.form')
	    	goBackValidate(strUrl, "frmMain")
	 else
	 {
	    var frm = document.forms["frmMain"];
	    frm.action = strUrl;
	    frm.target = "";
	    frm.method = "POST";
	    if (undefined != clientType && !isEmpty(clientType) && 'S' === clientType) {
	        $('#selectedWidgets').val([]);
	        $('#selectedActionLinks').val([]);
	        $('#allLinksSelectedFlag').val('N');
	        $('#allWidgetsSelectedFlag').val('N');
	    }
	    if ((strPaymentPrevililegesList instanceof Array)) {
	            strPaymentPrevililegesList = JSON
	                    .stringify(strPaymentPrevililegesList);
	        }
	        if ((strPaymentFeatureList instanceof Array)) {
	            strPaymentFeatureList = JSON
	                    .stringify(strPaymentFeatureList);
	        }
	    $('#selectedPaymentFeatures').val(strPaymentPrevililegesList);
	    $('#selectedPopupOptions').val(strPaymentFeatureList);
	    $('#entryFeatures').val(selectedEntryFeatures);
	    // $('#popupWidgetsSelectedFlag').val(popupWidgetsSelectedValue);
	    // $('#popupLinksSelectedFlag').val(popupLinksSelectedValue);
	    $('#popupPayFeaturesSelectedFlag').val(popupPayFeaturesSelectedValue);
	    $('#hostVerifyAttemps').removeAttr("disabled");
	    $('#fxThresholdAmt').removeAttr("disabled");
	    $('#achPassThruProfileId').removeAttr("disabled");
	    checkCategories();
	    $('#selectedCategoryLimitList').val(selectedCategoryLimitList);
	    if($('#minNoOfApprovers').val()=="")
	    {
	        $('#minNoOfApprovers').val("0");
	    }
	    if($('#hostVerifyAttemps').val()=="")
	    {
	        $('#hostVerifyAttemps').val("0");
	    }
	    $.blockUI();
	    frm.submit();
	 }  
}
function saveClientCollectionFeatureProfile(strUrl) {
    //selectedEntryFeatures.push("MCCOL");
	 if(strUrl == 'clientServiceSetupList.form')
	    	goBackValidate(strUrl, "frmMain")
	 else
	 {
		    var frm = document.forms["frmMain"];
		    frm.action = strUrl;
		    frm.target = "";
		    frm.method = "POST";
		    if (undefined != clientType && !isEmpty(clientType) && 'S' === clientType) {
		        $('#selectedWidgets').val([]);
		        $('#selectedActionLinks').val([]);
		        $('#allLinksSelectedFlag').val('N');
		        $('#allWidgetsSelectedFlag').val('N');
		    }
		    // $('#selectedWidgets').val(selectedWidgetList);
		    // $('#selectedActionLinks').val(selectedActionList);
		    $('#selectedPaymentFeatures').val(strPaymentPrevililegesList);
		    $('#selectedPopupOptions').val(strPaymentFeatureList);
		    $('#entryFeatures').val(selectedEntryFeatures);
		    // $('#popupWidgetsSelectedFlag').val(popupWidgetsSelectedValue);
		    // $('#popupLinksSelectedFlag').val(popupLinksSelectedValue);$('#popupWidgetsSelectedFlag').val(popupWidgetsSelectedValue);
		    // $('#popupLinksSelectedFlag').val(popupLinksSelectedValue);$('#popupWidgetsSelectedFlag').val(popupWidgetsSelectedValue);
		    // $('#popupLinksSelectedFlag').val(popupLinksSelectedValue);$('#popupWidgetsSelectedFlag').val(popupWidgetsSelectedValue);
		    // $('#popupLinksSelectedFlag').val(popupLinksSelectedValue);$('#popupWidgetsSelectedFlag').val(popupWidgetsSelectedValue);
		    // $('#popupLinksSelectedFlag').val(popupLinksSelectedValue);
		    $('#popupPayFeaturesSelectedFlag').val(popupPayFeaturesSelectedValue);
		    $('#hostVerifyAttemps, #workflowProfileId, #paymentCurr, #payoutBranch').removeAttr("disabled");
		    $('#fxThresholdAmt').removeAttr("disabled");
		    $('#dupCheckPeriod').removeAttr("disabled");
		    checkCategories();
		    $('#selectedCategoryLimitList').val(selectedCategoryLimitList);
		    if($('#minNoOfApprovers').val()=="")
		    {
		        $('#minNoOfApprovers').val("0");
		    }
		    if($('#hostVerifyAttemps').val()=="")
		    {
		        $('#hostVerifyAttemps').val("0");
		    }
		    $('#selectedLineCodes').val(selectedLineItemsList);
		    $('#popupLineCodeSelectedFlag').val(popupLineItemsSelectedValue);
		    $.blockUI();
		    frm.submit();
	 }
}
function saveClientIncomingPaymProfile(strUrl) {
	 if(strUrl == 'clientServiceSetupList.form')
	    	goBackValidate(strUrl, "frmMain")
	 else
	 {
		var objAmount = null;
	    var frm = document.forms["frmMain"];
	    frm.action = strUrl;
	    frm.target = "";
	    frm.method = "POST";
	    $.blockUI();
	    if(clientType==='M'){
	        $("textarea").removeAttr('disabled');
	        $('#anonymRecLimitAmt').removeAttr('disabled');
	        $("input[name='disclaimerRadioFlag']").removeAttr('disabled');
	        $("input[name='disclaimerRadioFlagExc']").removeAttr('disabled');
	        $("input[name='disclaimerRadioFlagAch']").removeAttr('disabled');
	    }
	    
	    $('#defActExcpUnapprAmtCcyCode').removeAttr('disabled');
		$('#defActAchUnapprAmtCcyCode').removeAttr('disabled');
		$('#alertDurationSecAch').removeAttr('disabled');
		$('#decisionCutOffHrAch').removeAttr('disabled');
		$('#decisionCutOffMinAch').removeAttr('disabled');
		$('#decisionCutOffSecAch').removeAttr('disabled');
	    $('#approveLimitAmt').removeAttr('disabled');
	    $('#approveAmtCcyCode').removeAttr('disabled');
	    if ($('#FRIEP_value')!= undefined  &&  $('#FRIEP_value').val() === "")
	        $('#FRIEP_value').val(999);
	    if( $('#achTransactionTypeMulti').length > 0 )
		{
			var myDropDownListValues = $("#achTransactionTypeMulti").multiselect("getChecked").map(function()
			{
				return this.value;    
			}).get();
			$('#achTransactionType').val(myDropDownListValues+'');
		}
		if( $('#achSecCodesMulti').length > 0 )
		{
			var myDropDownListValues = $("#achSecCodesMulti").multiselect("getChecked").map(function()
			{
				return this.value;    
			}).get();
			$('#achSecCodes').val(myDropDownListValues+'');
		}
		convertToNumber('ISSUAN_value');
		convertToNumber('POSPAYAPPR_value');
		convertToNumber('FPOP-000010_value');
		convertToNumber('PPPTHR_value');
		convertToNumber('anonymRecLimitAmt');
		convertToNumber('anonymAchRecLimitAmt');
	    frm.submit();
	 }   
}

function convertToNumber(id) 
{ 
        objAmount = document.getElementById(id); 
        // jquery autoNumeric formatting 
        blnAutoNumeric = isAutoNumericApplied(id); 
        if (blnAutoNumeric) 
        { 
        	if ($('#' + id).length > 0)
        	{
        		document.getElementById(id).value = $('#' + id).autoNumeric('get');
        	}	
        } 
        else 
        { 
            if ($('#' + id).length > 0) 
            { 
               document.getElementById(id).value = $('#' + id).val(); 
            } 
        } 
}

function saveClientPortalProfile(strUrl) {
    //console.log("selectedFeatures :"+selectedFeatures);
    if(typeof selectedFeatures != 'undefined' ){
        document.getElementById("selectedFeatures").value = selectedFeatures;
    }
    if(strUrl == 'clientServiceSetupList.form')
    	goBackValidate(strUrl, "frmMain")
    else
    {
	    var frm = document.forms["frmMain"];
	    frm.action = strUrl;
	    frm.target = "";
	    frm.method = "POST";
	    $.blockUI();
	    frm.submit();
    }
}
function saveClientMobileFeatureProfile(strUrl) {
	 if(strUrl == 'clientServiceSetupList.form')
	    	goBackValidate(strUrl, "frmMain")
    else
    {
	    var frm = document.forms["frmMain"];
	    frm.action = strUrl;
	    frm.target = "";
	    frm.method = "POST";
	    if(clientType==='M'){
	    $('#entryFeatures').val(selectedEntryFeatures);
	    }
	    else
	    {
	        $('#entryFeatures').val('');
	    }
	    $('#initiationCategories').val(selectedInitiationCategories);
	    $('#approvalCategories').val(selectedApprovalCategories);
	    var brFeatureImg = document.getElementById('chkImg_FMOB-000002');
	    if((null == brFeatureImg) || (brFeatureImg.src.indexOf("icon_unchecked") != -1)){
	        $("#InfoDiv_BALREP").remove();
	    }
	//    checkCategories();
	    $.blockUI();
	    frm.submit();
    }
}
function showPaymentSection(elem, frmName) {
    var image = elem.getElementsByTagName("IMG")[0];
    (image.src.indexOf("icon_checked.gif") != -1) ? ($("#divPayment").show())
            : $("#divPayment").hide();
}
function showCollectionsSection(elem, frmName) {
    var image = elem.getElementsByTagName("IMG")[0];
    (image.src.indexOf("icon_checked.gif") != -1) ? ($("#divCollections")
            .show()) : $("#divCollections").hide();
}

var moreInfoDlg;
function showAdditionalAccountInfo(frmName) {
    // moreInfoDlg = $('#divEnrichments').clone();
    moreInfoDlg = $('#divEnrichments').dialog({
        autoOpen : false,
        height : "auto",
        modal : true,
        draggable : false,
        resizable : false,
        width : 450,
        open : function() {
            /*
             * if(CAN_EDIT=="false") { $("#btn-ok").attr('disabled','disabled'); }
             */
        }
    });
    moreInfoDlg.dialog('open');
}

function showUploadDialog(hlnk) {
    var ctrlFile = document.getElementById('sampleFile');
    var ctrlFileUploadFlag = document.getElementById('sampleFileUploadFlag');
    var logoFileUploadFlag = document.getElementById('logoFileUploadFlag');
    
    var viewLink = document.getElementById('viewAttachmentSampleFile');
    if (_blnSelected) {
        $(hlnk).text('Logo');
        $(hlnk).attr("title", 'Logo');
        if(undefined !== viewLink && null !== viewLink)
        {
            viewLink.innerHTML = '';
        }
        if (!$.browser.msie) {
            ctrlFile.value = '';    
        } else {
            $("#sampleFile").replaceWith($("#sampleFile").clone(true));
        }
        $('#sampleFileType').val('');
        _blnSelected = false;
        ctrlFileUploadFlag.value = "N";
        logoFileUploadFlag.value ="N";
        setDirtyBit();
    } else {
        var dlg = $('#divFilUpload');
        dlg.dialog({
            bgiframe : true,
            autoOpen : false,
            height : "auto",
            modal : true,
            resizable : false,
            width : '400',
            hide : false
        });
        
        dlg.find('#cancelImportLogo .ft-button').off('click');
        dlg.find('#cancelImportLogo .ft-button').on('click', function() {
            if (!$.browser.msie) {
                ctrlFile.value = '';
            } else {
                $("#sampleFile").replaceWith(
                        $("#sampleFile").clone(true));
            }
            _blnSelected = false;
            $(hlnk).text('Logo');
            $(dlg).dialog('destroy');
            ctrlFileUploadFlag.value = "N";
            logoFileUploadFlag.value ="N";
        });
        dlg.find('#okImportLogo .ft-button').off('click');
        dlg.find('#okImportLogo .ft-button').on('click', function() {
            if (ctrlFile.value !== null && ctrlFile.value !== "") {
                if (!ctrlFile.value.match(/\.(bmp|jpg|jpeg|png|gif|BMP|JPG|JPEG|PNG|GIF)$/)) {
                    alert('Not an image!');
                    if (!$.browser.msie) {
                        ctrlFile.value = '';
                    } else {
                        $("#sampleFile").replaceWith(
                                $("#sampleFile").clone(true));
                    }
                } else {
                
                    var n = ctrlFile.value.lastIndexOf("\\");
                    var fileExt = ctrlFile.value.split('.').pop();
                    var fileText = 'Remove Logo ';
                    var ft = fileText;
                    
                    $(hlnk).text(fileText + "..");
                    $(hlnk).attr("title", ft);
                    $('#sampleFileType').val(fileExt);
                    _blnSelected = true;
                    ctrlFileUploadFlag.value = "Y";
                    logoFileUploadFlag.value ="Y";
                    setDirtyBit();
                }
            }
            $(dlg).dialog('close');
        });
        
        dlg.find('#chooseLogoFile').off('click');
        dlg.find('#chooseLogoFile').on('click', function() {
            $('#sampleFile').click();
        });
        
        dlg.find('#sampleFile').off('change');
        dlg.find('#sampleFile').on('change', function() {
            var filename = $('#sampleFile').val();
            if(filename) {
                $('#lblSelectedLogoFileName').text(filename.substring(filename.lastIndexOf('\\')+1));
            } else {
                $('#lblSelectedLogoFileName').text('No File Selected');
            }
            $('#lblSelectedFileName').attr('title', filename); 
        });
        dlg.parent().appendTo($('#frmMain'));
        dlg.dialog('open');
    }
}
function viewSampleFileAttachment(frmId) {
    var frm = document.getElementById(frmId);
    frm.action = "viewLogoAttachment.form";
    frm.target = "";
    frm.method = "POST";
    frm.submit();
}
jQuery.fn.EnableSystemBeneProfile = function() {
    if ($("#hiddenService_systemBeneFlag").val() == 'Y') {
        $("#lblSysBeneProfileId").addClass("frmLabel required");
        $("#sysBeneProfileId").removeAttr("disabled");

    } else {
        $("#sysBeneProfileId").attr("disabled", "true");
        $("#sysBeneProfileId").val("");
        $("#lblSysBeneProfileId").removeClass("frmLabel required");
    }

};
function saveClientCheckProfile(strUrl) {
	 if(strUrl == 'clientServiceSetupList.form')
	    	goBackValidate(strUrl, "frmMain")
	 else
	 {
	    if($('#maxInquiryDays').val()=="")
	    {
	        $('#maxInquiryDays').val("0");
	    }
	    if(clientType==='S')
	    {
	        $('#allWidgetsSelectedFlag').val('N');
	        $('#selectedWidgets').val([]);
	        $('#disclaimerText, #disclaimerTextInq, #maxInquiryDays').attr('disabled','disabled');
	    }else{
	        $("#disclaimerText").removeAttr("disabled");
	        $("#inqdisclaimerText").removeAttr("disabled");
	    }
	    var frm = document.forms["frmMain"];
	    frm.action = strUrl;
	    frm.target = "";
	    frm.method = "POST";
	    
	    $.blockUI();
	    frm.submit();
	 }   
}

jQuery.fn.ForceNoSpecialSymbol = function() {
    return this
            .each(function() {
                $(this)
                        .keydown(
                                function(e) {
                                    var key = e.charCode || e.keyCode || 0;
                                    // allow backspace, tab, delete, numbers
                                    // keypad numbers, letters ONLY
                                    if (event.which) { // Netscape/Firefox/Opera
                                        keynum = event.which;
                                    }
                                    if (event.shiftKey || event.ctrlKey) {
                                        return false;
                                    }
                                    return (key == 8 || key == 9 || key == 46
                                            || key == 190
                                            || (key >= 37 && key <= 40)
                                            || (key >= 48 && key <= 57)
                                            || (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
                                })
            })
};

function handleApprovalRequired(elementId,isSelected) {
    if(isSelected == 'Y') {
        var element = '';
        if(elementId == 'TPL') {
            element = $('#chkService_TEMPYB')[0];
        } else if(elementId == 'SIS') {
            element = $('#chkService_SIYB')[0];
        } else if(elementId == 'PSS') {
            element = $('#chkService_ACPS')[0];
        }
            if(element) {
                var image = element.getElementsByTagName("IMG")[0];
                image.src = "static/images/icons/icon_unchecked.gif";
                $(element).attr('onclick','setDirtyBit();toggleCheckboxFeatureDetails(this);');
            }
    } else {
        var element = '';
        if(elementId == 'TPL') {
            element = $('#chkService_TEMPYB')[0];
            var position = jQuery.inArray('TEMPYB', selectedEntryFeatures);
            if (-1 != position) {
                selectedEntryFeatures.splice(position, 1);
            }
        } else if(elementId == 'PSS') {
            element = $('#chkService_ACPS')[0];
            var position = jQuery.inArray('ACPS', selectedEntryFeatures);
            if (-1 != position) {
                selectedEntryFeatures.splice(position, 1);
            }
        }
            if(element) {
                var image = element.getElementsByTagName("IMG")[0];
                image.src = "static/images/icons/icon_unchecked_grey.gif";
                $(element).attr('onclick','');
            }
    }
}

function toggleCheckboxFeatureDetails(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    var elementId = elem.getAttribute("id").replace("chkService_", "");
    // var selectedArray = document.getElementById("selectedEntryFeatures");
    if (image.src.search("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        // $("#hiddenService_" + elementId).val(elementId);
        if (elementId != 'MFA')
        {
        if (null == selectedEntryFeatures) {
            selectedEntryFeatures = new Array();
            selectedEntryFeatures.push(elementId);
            // $("#selectedEntryFeatures").val(selectedArray);
        } else if (-1 == jQuery.inArray(elementId, selectedEntryFeatures)) {
            selectedEntryFeatures.push(elementId);
        }
        }
        
        if(elementId=="PSS"){
            passThroughFeatureSelected=true;
            setCheckUncheckMandatoryCombo(image,'achPassThruProfileId');
        }
        if(elementId == 'TPL' || elementId == 'SIS' || elementId == 'PSS') {
            handleApprovalRequired(elementId,'Y');
        }
    } else {
        if(elementId=='SIS') {
            showSIDisabledPopup(image,elementId);
        }
        else{
        image.src = "static/images/icons/icon_unchecked.gif";
        if (null != selectedEntryFeatures) {
            var position = jQuery.inArray(elementId, selectedEntryFeatures);
            if (-1 != position) {
                selectedEntryFeatures.splice(position, 1);
            }
        }
        
        if(elementId=="PSS"){
            passThroughFeatureSelected=false;
            setCheckUncheckMandatoryCombo(image,'achPassThruProfileId');
        }
            if(elementId == 'TPL' || elementId == 'PSS') {
                handleApprovalRequired(elementId,'N');
            }
        }
    }
    
    if( elem.id == 'chkService_CUSTREPORT' && ( viewmode == 'ADD' || viewmode == 'EDIT' ))
    {
        checkCustomReportFlag();
    }
    
    if(elem.id == 'chkService_VIEWSTANDREP' && ( viewmode == 'ADD' || viewmode == 'EDIT' ))
    {
        checkReportCenterFlag();
    }
    if(elem.id == 'chkService_TPL')
    {
        checkPaymentTemplateFlag();
    } else if (elem.id == 'chkService_TEMPYB') {
        checkPaymentTemplateApprovalApplicableFlag();
    }
}

function toggleARRCheckboxFlag(elem)
{
	var image = elem.getElementsByTagName("IMG")[0];
    var element = '';
    var imageClientVerificationForTxnFlag = '';
    
    element = $('#chkService_CLIENTVERIREQFORTXN')[0];
    imageClientVerificationForTxnFlag = element.getElementsByTagName("IMG")[0];
    
    if (image.src.search("icon_checked.gif") == -1) 
    {
    	imageClientVerificationForTxnFlag.src = "static/images/icons/icon_unchecked_grey.gif";
        $(element).attr('onclick','');
    }
    else
    {
    	imageClientVerificationForTxnFlag.src = "static/images/icons/icon_unchecked.gif";
        $(element).attr('onclick','setDirtyBit();toggleCheckboxFeatureDetails(this);');
    }
}

function checkPaymentTemplateFlag()
{
    var payTemplateId = document.getElementById("chkImg_TPL");
    if(payTemplateId != null && payTemplateId != undefined)
    {
        if( payTemplateId.src.indexOf("icon_unchecked.gif") > -1 
                || payTemplateId.src.indexOf("icon_unchecked_grey.gif") > -1)
        {
            isPaymentTemplateApplicable = "N";
        }
        else if( payTemplateId.src.indexOf("icon_checked.gif") > -1 
                || payTemplateId.src.indexOf("icon_checked_grey.gif") > -1)
        {
            isPaymentTemplateApplicable = "Y";
        }
    }
}

function checkPaymentTemplateApprovalApplicableFlag()
{
    var payTemplateApprovalId = document.getElementById("chkImg_TEMPYB");
    if(payTemplateApprovalId != null && payTemplateApprovalId != undefined)
    {
        if( payTemplateApprovalId.src.indexOf("icon_unchecked.gif") > -1 
                || payTemplateApprovalId.src.indexOf("icon_unchecked_grey.gif") > -1)
        {
            isPaymentTemplateApprovalApplicable = "N";
        }
        else if( payTemplateApprovalId.src.indexOf("icon_checked.gif") > -1 
                || payTemplateApprovalId.src.indexOf("icon_checked_grey.gif") > -1)
        {
            isPaymentTemplateApprovalApplicable = "Y";
        }
    }
}
function checkLoansPaydownLinkage(clickEvent,pageMode)
{
    var apeFeature = document.getElementById("chkImg_APE");
    var rpyFeature = document.getElementById("chkImg_RPY");
    if(isPayDownloadFeature == true)
    {
        $( '#chkDiv_APE' ).attr( "class", "col_1_3 ux_no-padding  ux_line-height20" );
        if(pageMode == "EDIT")
        {
            if( rpyFeature.src.indexOf("icon_unchecked.gif") > -1 
                    || rpyFeature.src.indexOf("icon_unchecked_grey.gif") > -1)
            {
                apeFeature.src = "static/images/icons/icon_unchecked_grey.gif";
                apeFeature.removeAttribute('onClick');
            }
            else if( rpyFeature.src.indexOf("icon_checked.gif") > -1 
                    || rpyFeature.src.indexOf("icon_checked_grey.gif") > -1)
            {
                if(clickEvent == true)
                {
                    apeFeature.src = "static/images/icons/icon_unchecked.gif";
                    apeFeature.setAttribute('onClick','setDirtyBit();checkuncheckFeature(this,"APE");');
                }
            }
        }
    }
    else
    {
        $( '#chkDiv_APE' ).attr( "class", "hidden" );
    }
}
function checkLoansPaydownPartialLinkage(clickEvent,pageMode)
{
    var apeFeature = document.getElementById("chkImg_APE");
    var FLON_000001Feature = document.getElementById("chkImg_FLON_000001");
	if(isPartialPayDownloadFeature == true)
    {
        $( '#chkDiv_APE' ).attr( "class", "col_1_3 ux_no-padding  ux_line-height20" );
        if(pageMode == "EDIT")
        {
            if( FLON_000001Feature.src.indexOf("icon_unchecked.gif") > -1 
                    || FLON_000001Feature.src.indexOf("icon_unchecked_grey.gif") > -1)
            {
                apeFeature.src = "static/images/icons/icon_unchecked_grey.gif";
                apeFeature.removeAttribute('onClick');
            }
            else if( FLON_000001Feature.src.indexOf("icon_checked.gif") > -1 
                    || FLON_000001Feature.src.indexOf("icon_checked_grey.gif") > -1)
            {
                if(clickEvent == true)
                {
                    apeFeature.src = "static/images/icons/icon_unchecked.gif";
                    apeFeature.setAttribute('onClick','setDirtyBit();checkuncheckFeature(this,"APE");');
                }
            }
        }
    }
    else
    {
        $( '#chkDiv_APE' ).attr( "class", "hidden" );
    }
}

function renderLoansOptions( imgElement, featureId, clickEvent,pageMode)
{
    if(featureId == "RPY")
    {
        checkLoansPaydownLinkage(clickEvent,pageMode);
    }
    else if(featureId == "LNI")
    {
        checkLoansManageInvoiceLinkage(clickEvent,pageMode);
    }
    else if(featureId == "FLON_000001")
    {
        checkLoansPaydownPartialLinkage(clickEvent,pageMode);
    }
 	else if(featureId == "APE" || featureId == "APEI")
    {
    	checkPrincipalInterestEditable(clickEvent,pageMode);
    }
}
function checkPrincipalInterestEditable(clickEvent,pageMode)
{
    
    var apeFeature = document.getElementById("chkImg_APE");
    var apeiFeature = document.getElementById("chkImg_APEI");
    var apiedFeature = document.getElementById("chkImg_APIED");
    if(isPayDownloadFeature == true || isPayOff == true || isPartialPayDownloadFeature == true)
    {
        $( '#chkDiv_APE' ).attr( "class", "col_1_3 ux_no-padding  ux_line-height20" );
        $( '#chkDiv_APEI' ).attr( "class", "col_1_3 ux_no-padding  ux_line-height20" );
        if(pageMode == "EDIT")
        {
             if( apeFeature.src.indexOf("icon_checked.gif") > -1  || apeFeature.src.indexOf("icon_checked_grey.gif") > -1 
            		 || apeiFeature.src.indexOf("icon_checked.gif") > -1  || apeiFeature.src.indexOf("icon_checked_grey.gif") > -1 )
            {
            	apiedFeature.src = "static/images/icons/icon_checked.gif";
            	 $('#APIED_value').val('Y');
            	apiedFeature.setAttribute('onClick','');
            }
             else
             {
            	 if(clickEvent == true)
                 {
                     apiedFeature.src = "static/images/icons/icon_unchecked.gif";
                     apiedFeature.setAttribute('onClick','setDirtyBit();checkuncheckFeature(this,"APIED");');
                 }
             }
        }
    }
    else
    {
        $( '#chkDiv_APE' ).attr( "class", "hidden" );
        $( '#chkDiv_APEI' ).attr( "class", "hidden" );
        $( '#chkDiv_APIED' ).attr( "class", "hidden" );
    }
}
function checkLoansManageInvoiceLinkage(clickEvent,pageMode)
{
    
    var ropinvFeature = document.getElementById("chkImg_ROPINV");
    var lniFeature = document.getElementById("chkImg_LNI");
    if(isPayDownloadFeature == true)
    {
        $( '#chkDiv_ROPINV' ).attr( "class", "col_1_3 ux_no-padding  ux_line-height20" );
        if(pageMode == "EDIT")
        {
            if( lniFeature.src.indexOf("icon_unchecked.gif") > -1 
                    || lniFeature.src.indexOf("icon_unchecked_grey.gif") > -1)
            {
                ropinvFeature.src = "static/images/icons/icon_unchecked_grey.gif";
                ropinvFeature.setAttribute('onClick','');
            }
            else if( lniFeature.src.indexOf("icon_checked.gif") > -1 
                    || lniFeature.src.indexOf("icon_checked_grey.gif") > -1)
            {
                if(clickEvent == true)
                {
                    ropinvFeature.src = "static/images/icons/icon_unchecked.gif";
                    ropinvFeature.setAttribute('onClick','setDirtyBit();checkuncheckFeature(this,"ROPINV");');
                }
            }
        }
    }
    else
    {
        $( '#chkDiv_ROPINV' ).attr( "class", "hidden" );
    }
}
function checkACHProductCatFlag()
{
    var achId = document.getElementById("chkImg_ACH");
    if(achId != null && achId != undefined)
    {
        if( achId.src.indexOf("icon_unchecked.gif") > -1 
                || achId.src.indexOf("icon_unchecked_grey.gif") > -1)
        {
            $( '#companyIdDiv' ).attr( "class", "hidden" );
        }
        else if( achId.src.indexOf("icon_checked.gif") > -1 
                || achId.src.indexOf("icon_checked_grey.gif") > -1)
        {
            $( '#companyIdDiv' ).attr( "class", "block" );
        }
    }
    else
    {
        $( '#companyIdDiv' ).attr( "class", "hidden" );
    }
}


function forceChecked(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    var elementId = elem.getAttribute("id").replace("chkService_", "");
    image.src = "static/images/icons/icon_checked.gif";
        if (null == selectedEntryFeatures) {
            selectedEntryFeatures = new Array();
            selectedEntryFeatures.push(elementId);
            // $("#selectedEntryFeatures").val(selectedArray);
        } else if (-1 == jQuery.inArray(elementId, selectedEntryFeatures)) {
            selectedEntryFeatures.push(elementId);
        }
}

function enablePrevDayAccounts(ele,isError){
    if(!isError)
    {
        if(selectedCountPA==countPA && countPA!=0)
            $('#chkAllPrevDayAccntsSelectedFlag')[0].src =  "static/images/icons/icon_checked.gif";
            else
            $('#chkAllPrevDayAccntsSelectedFlag')[0].src =  "static/images/icons/icon_unchecked.gif";
        var prevdayCnt = "";    
        
        if(selectedCountPA=="")
            prevdayCnt = '(0)';
        else
            prevdayCnt = '('+selectedCountPA+')';
            
        $("#previousdayCnt").text(prevdayCnt);
        
        if(selectedCountPA==countPA && countPA!=0)
            $('#allPrevDayAccntsSelectedFlag').val('Y');
    }
    
    $("#chkAllPrevDayAccntsSelectedFlag").unbind('click');
    $("#selectBRFeatureLinkPrevDay").unbind('click');
    $("#chkAllPrevDayAccntsSelectedFlag").bind("click",function(){
        toggleCheckUncheck($('#chkAllPrevDayAccntsSelectedFlag')[0],'allPrevDayAccntsSelectedFlag', selectedCountPA, 'previousdayCnt');
    });
    
    $("#selectBRFeatureLinkPrevDay").bind("click",function(){
        getSelectBRFeaturePrevAccountsPopup();
    });
}

function disablePrevDayAccounts(){
    $('#chkAllPrevDayAccntsSelectedFlag').unbind('click');
    $('#selectBRFeatureLinkPrevDay').unbind('click');
    $('#chkAllPrevDayAccntsSelectedFlag')[0].src =  "static/images/icons/icon_unchecked_grey.gif";
    var prevdayCnt = '(0)';
    $("#previousdayCnt").text(prevdayCnt);
    //selectedPrevDayAccountList = '';
    $('#allPrevDayAccntsSelectedFlag').val('N');
}

function enableDisablePrevdayAccounts(ele,isError,brandingPkgType){
if(brandingPkgType =='N'){
    var eleId= ele.id;
    var allFlagId ='';
    var selectLink ='';
    var image = ele.getElementsByTagName("IMG")[0];
    if (image.src.search("icon_checked.gif") == -1) {
        disablePrevDayAccounts();    
    }    
    else{
        enablePrevDayAccounts(ele,isError);
    }

}
}

function enableIntraDayAccounts(ele,isError){
    if($('#chkAllIntraDayAccntsSelectedFlag')[0].src.search("icon_unchecked_grey.gif") != -1)
    {
        $('#chkAllIntraDayAccntsSelectedFlag')[0].src =  "static/images/icons/icon_unchecked.gif";
        $('#allIntraDayAccntsSelectedFlag').val('N');
    }
            
    $("#chkAllIntraDayAccntsSelectedFlag").unbind('click');
    $("#selectBRFeatureLinkIntraDay").unbind('click');
    $("#chkAllIntraDayAccntsSelectedFlag").bind("click",function(){
        toggleCheckUncheck($('#chkAllIntraDayAccntsSelectedFlag')[0],'allIntraDayAccntsSelectedFlag', selectedCountIA, 'intradayCnt');
    });
    
    $("#selectBRFeatureLinkIntraDay").bind("click",function(){
        getSelectBRFeatureIntraAccountsPopup();
    });
}

function disableIntraDayAccounts(){
    $('#chkAllIntraDayAccntsSelectedFlag').unbind('click');
    $('#selectBRFeatureLinkIntraDay').unbind('click');
    $('#chkAllIntraDayAccntsSelectedFlag')[0].src =  "static/images/icons/icon_unchecked_grey.gif";
    var intradayCnt = '(0)';
    $("#intradayCnt").text(intradayCnt);
    //selectedIntraDayAccountList = '';
    $('#allIntraDayAccntsSelectedFlag').val('N');
}

function enableDisableIntradayAccounts(ele,isError,brandingPkgType){
if(brandingPkgType =='N'){

var eleId= ele.id;
    var allFlagId ='';
    var selectLink ='';
    var image = ele.getElementsByTagName("IMG")[0];
    if (image.src.search("icon_checked.gif") == -1) {
        disableIntraDayAccounts();
    }    
    else{
        enableIntraDayAccounts(ele,isError);        
    }
}
}

function toggleCheckboxCategoryDetails(elem, frmService) {
    var image = elem.getElementsByTagName("IMG")[0];
    var elementId = elem.getAttribute("id").replace("chkService_", "");

    if (image.src.search("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        if (null == selectedCategories) {
            selectedCategories = new Array();
            selectedCategories.push(elementId);
        } else if (-1 == jQuery.inArray(elementId, selectedCategories)) {
            selectedCategories.push(elementId);
        }
        var pdcElement = document.getElementById('chkImg_FCOL-000001');
        var crossCcyElement = document.getElementById('chkImg_FCOL-000002');
        $('#chkService_FCOL-000001').attr('onclick','toggleCheckboxFeatureDetails(this)');
        if(pdcElement) {
            pdcElement.src = "static/images/icons/icon_unchecked.gif";
        }
        $('#chkService_FCOL-000002').attr('onclick','toggleCheckboxFeatureDetails(this)');
        if(crossCcyElement) {
            crossCcyElement.src = "static/images/icons/icon_unchecked.gif";
        }
        
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        if (null != selectedCategories) {
            var position = jQuery.inArray(elementId, selectedCategories);
            if (-1 != position) {
                selectedCategories.splice(position, 1);
            }
        }
            var pdcElement = document.getElementById('chkImg_FCOL-000001');
            var crossCcyElement = document.getElementById('chkImg_FCOL-000002');
            $('#chkService_FCOL-000001').attr('onclick','');
            if(pdcElement) {
                pdcElement.src = "static/images/icons/icon_unchecked_grey.gif";
            }
            $('#chkService_FCOL-000002').attr('onclick','');
            if(crossCcyElement) {
                crossCcyElement.src = "static/images/icons/icon_unchecked_grey.gif";
            }
            var index = selectedEntryFeatures.indexOf('FCOL-000001');
            if(index!=-1){
                selectedEntryFeatures.splice(index, 1);
            }
            var index = selectedEntryFeatures.indexOf('FCOL-000002');
            if(index!=-1){
                selectedEntryFeatures.splice(index, 1);
            }
    }
    if(null != selectedCategories && selectedCategories.length>0)
    {
        updateAttachPackageLink(false);
    }    
    else
    {
        updateAttachPackageLink(true);
    }  
    if(elementId == "ACH")
    {
        if (image.src.search("icon_checked.gif") > -1) 
        {
            $( '#companyIdDiv' ).attr( "class", "block" );
        }
        else
        {
            $( '#companyIdDiv' ).attr( "class", "hidden" );
        }
    }
    saveOrUpdate(frmService);
}

function saveOrUpdate(frmService)
{
	var strUrl = '';
	if(frmService === 'P')
		strUrl = 'saveClientPaymentFeatureProfileMst.form';
	else if(frmService === 'C')
		strUrl = 'saveClientCollectionFeatureProfileMst.form';
	if('Y' == isAUthorizedClient &&  (viewmode == 'EDIT' || viewmode == 'ADD'))
	{
		if(viewmode == 'EDIT')
		{
			if(frmService === 'P')
				strUrl = 'updateClientPayFeatureProfileMst.form';
			else if(frmService === 'C')
				strUrl = 'updateClientCollectionFeatureProfileMst.form';
		}
		if(frmService === 'P') saveClientPaymentFeatureProfile(strUrl);
		else if(frmService === 'C') saveClientCollectionFeatureProfile(strUrl);
	}
}

function toggleCheckboxCategoryInitiationDetails(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    var elementId = elem.getAttribute("id").replace("chkService_", "");
    if (image.src.search("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        if (null == selectedInitiationCategories) {
            selectedInitiationCategories = new Array();
            selectedInitiationCategories.push(elementId);
        } else if (-1 == jQuery.inArray(elementId, selectedInitiationCategories)) {
            selectedInitiationCategories.push(elementId);
        }
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        if (null != selectedInitiationCategories) {
            var position = jQuery.inArray(elementId, selectedInitiationCategories);
            if (-1 != position) {
                selectedInitiationCategories.splice(position, 1);
            }
        }
    }
}
function toggleCheckboxCategoryApprovalDetails(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    var elementId = elem.getAttribute("id").replace("chkServiceAR_", "");
    if (image.src.search("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        if (null == selectedApprovalCategories) {
            selectedApprovalCategories = new Array();
            selectedApprovalCategories.push(elementId);
        } else if (-1 == jQuery.inArray(elementId, selectedApprovalCategories)) {
            selectedApprovalCategories.push(elementId);
        }
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        if (null != selectedApprovalCategories) {
            var position = jQuery.inArray(elementId, selectedApprovalCategories);
            if (-1 != position) {
                selectedApprovalCategories.splice(position, 1);
            }
        }
    }
}

function toggleAttachPackageLink()
{
    if(null != selectedCategories && selectedCategories.length>0)
    {
        updateAttachPackageLink(false);
    }    
    else
    {
        updateAttachPackageLink(true);
    }
}

function showBankSearchFilterPopup() {
    var filterPanel = Ext.create('Ext.window.Window', {
        bodyPadding : 5, // Don't want content to crunch against the borders
        width : 325,
        title : 'Bank Search Filter',
        layout : 'hbox',
        overflowY : 'auto',
        config : {
            layout : 'fit',
            modal : true
        },

        items : [ {
            xtype : 'textfield',
            fieldLabel : 'Bank Identification #',

            labelAlign : 'top'
        }, {
            xtype : 'button',
            text : 'Search',
            margin : '20 10 0 25',
            cls : 'xn-button',
            handler : function() {
                searchBankDetails();
            }
        } ],
        renderTo : Ext.getBody()
    });
    filterPanel.show();
}

function showBranchSearchFilterPopup() {
    var filterPanel = Ext.create('Ext.window.Window', {
        bodyPadding : 5, // Don't want content to crunch against the borders
        width : 325,
        title : 'Branch Search Filter',
        layout : 'hbox',
        overflowY : 'auto',
        config : {
            layout : 'fit',
            modal : true
        },

        items : [ {
            xtype : 'textfield',
            fieldLabel : 'Branch Identification #',

            labelAlign : 'top'
        }, {
            xtype : 'button',
            text : 'Search',
            margin : '20 10 0 25',
            cls : 'xn-button',
            handler : function() {
                searchBranchDetails();
            }
        } ],
        renderTo : Ext.getBody()
    });
    filterPanel.show();
}

function searchBankDetails() {

}
function searchBranchDetails() {

}

function setOtherServicesOnVerify()
{
    var strService = $('#otherServiceDetails span:first-child').text();
    if(strService !="" && strService.indexOf(',')!= -1)
    {
        strService = strService.replace(',','');
        $('#otherServiceDetails span:first-child').text(strService);
    }
}

jQuery.fn.SetSplittedSet1ValuesForSpan = function() {
    $(this)
            .each(
                    function(index) {
                        var elementId = $(this).attr("id").replace(
                                "splitset1_", "").replace("CountryCode", "");
                        if (null != document.getElementById("hidden_"
                                + elementId)
                                && null != document.getElementById("hidden_"
                                        + elementId).value
                                && 0 != document.getElementById("hidden_"
                                        + elementId).value.length) {
                            $(this).text(
                                    $("#hidden_" + elementId).val().substring(
                                            0, 3));
                        }
                    });
};

jQuery.fn.SetSplittedSet2ValuesForSpan = function() {
    $(this)
            .each(
                    function(index) {
                        var elementId = $(this).attr("id").replace(
                                "splitset2_", "");
                        if (null != document.getElementById("hidden_"
                                + elementId)
                                && null != document.getElementById("hidden_"
                                        + elementId).value
                                && 0 != document.getElementById("hidden_"
                                        + elementId).value.length) {
                            $(this).html(
                                    "&nbsp;"+$("#hidden_" + elementId).val()
                                            .substring(3));
                        }
                    });
};

function createFormAndNavigate(strUrl, mode) {
    var me = this;
    var form;
    var viewState = parentkey;

    form = document.createElement('FORM');
    form.name = 'frmMain';
    form.id = 'frmMain';
    form.method = 'POST';
    form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,
            tokenValue));
    form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
            viewState));
    form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'MODE', mode));
    
// Please do not delete or modify below Code unless working on Migration Part
    var isMigratedClient = document.getElementById('isMigratedClient');
    var strCPClientID = document.getElementById('strCPClientID');
    if (null != isMigratedClient){
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'isMigratedClient', isMigratedClient.value));
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'strCPClientID', strCPClientID.value));
    }
// End    
    form.action = strUrl;
    document.body.appendChild(form);
    form.submit();
}

function createFormField(element, type, name, value) {
    var inputField;
    inputField = document.createElement(element);
    inputField.type = type;
    inputField.name = name;
    inputField.value = value;
    return inputField;
}

function openPopup(strUrl, frmId) {

    //console.log("strUrl :"+strUrl);
    //console.log("frmId :"+frmId);
    $('#'+frmId).dialog({
        autoOpen : false,
        maxHeight: 550,
        minHeight:156,
        width : 500,
        modal : true,
        resizable: false,
        draggable: false,
        title : 'Cash Position Export'
    });
    $('#'+frmId).dialog("open");
    $('#'+frmId).parent().appendTo($("#frmMain"));
}

function closePopupCashPositionExport(frmId){
    $('#'+frmId).dialog("close");
}

function validateAndNavigate(strUrl, frmId) {
    if ($('#dirtyBit').val() == "1")
        getNavigationPopup(frmId, strUrl);
    else
        goToPage(strUrl, frmId);
}

function warnAndNavigate(strUrl, frmId) {
    if ($('#dirtyBit').val() == "1")
        getNavigationPopup(frmId, strUrl);
    else
        goToPage(strUrl, frmId);
}

function getNavigationPopup(frmId, strUrl) {
    $('#navigatePopup').dialog({
        autoOpen : false,
        maxHeight: 550,
        minHeight: 156,
        width : 400,
        modal : true,
        resizable: false,
        draggable: false
        /*buttons : {
            "Yes" : {
                text: 'Yes',
                "class": "ux_label-margin-right",
                click: function() {
                var frm = document.getElementById(frmId);
                frm.action = strUrl;
                frm.target = "";
                frm.method = "POST";
                frm.submit();
            }
            },
            "No" : {
                text: 'No',
                click: function() {
                $(this).dialog("close");
            }
            }
        }*/
    });
    $('#navigatePopup').dialog("open");
    
    $('#cancelNavConfirmMsg').bind('click',function(){
        $('#navigatePopup').dialog("close");
    });
    
    $('#doneNavConfirmMsgbutton').bind('click',function(){
        var frm =  document.getElementById(frmId);
        frm.action = strUrl;
        frm.target = "";
        frm.method = "POST";
        frm.submit();
    });
    $('#textContent').focus();
    
}
jQuery.fn.ForceAmountOnly = function() {
    return this
            .each(function() {
                $(this)
                        .keydown(
                                function(event) {
                                    var keynum;
                                    var keychar;
                                    if (window.event) { // IE
                                        keynum = event.keyCode;
                                    }
                                    if (event.which) { // Netscape/Firefox/Opera
                                        keynum = event.which;
                                    }
                                    if (event.shiftKey) {
                                        return false;
                                    }
                                    if ((keynum == 8
                                            || keynum == 9
                                            || keynum == 27
                                            || keynum == 46
                                            ||
                                            // Allow: Ctrl+A
                                            (keynum == 65 && event.ctrlKey === true)
                                            ||
                                            // Allow: home, end, left, right
                                            (keynum >= 35 && keynum <= 40)
                                            || (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))) {
                                        if (((keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))
                                                && (this.value.indexOf('.') != -1 && (this.value
                                                        .substring(this.value
                                                                .indexOf('.'))).length > 4))
                                            return false;
                                        return true;
                                    } else if (keynum == 110 || keynum == 190) {
                                        var checkdot = this.value;
                                        var i = 0;
                                        for (i = 0; i < checkdot.length; i++) {
                                            if (checkdot[i] == '.')
                                                return false;
                                        }
                                        if (checkdot.length == 0)
                                            this.value = '0';
                                        return true;
                                    } else {
                                        // Ensure that it is a number and stop
                                        // the keypress
                                        if (event.shiftKey
                                                || (keynum < 48 || keynum > 57)
                                                && (keynum < 96 || keynum > 105)) {
                                            event.preventDefault();
                                        }
                                    }

                                    keychar = String.fromCharCode(keynum);

                                    return !isNaN(keychar);
                                })
            })
};

function enableCopyClientParam() {
    $("#copyClientParamImg").attr("src",
            "static/images/icons/icon_unchecked.gif");
    $("#copyClientParamChkBox").attr("onclick",
            "toggleCheckboxCopyClientParam(this);getClientParamsDetails();");
    $("#copyClientParamLink").attr("onclick","setDirtyBit();toggleCheckboxCopyClientParam(this);getClientParamsDetails();");    
}
function disableCopyClientParam() {
    $("#copyClientParamImg").attr("src",
    "static/images/icons/icon_unchecked_grey.gif");
    $("#copyClientParamLink").attr("onclick",null);
    $("#copyClientParam").val('N');

    if($('#sysBranchCode')){
        $('#sysBranchCode').val(null);
        $('#sysBranchDesc').val(null);
    }
    if($('#chkretailCustomer')){
        toggleCheckboxByIDAndValue('chkretailCustomer','N');
    }
    if($('#chkclientIsFi')){
        toggleCheckboxByIDAndValue('chkclientIsFi','N');
    }
    if($('#chkcreditCardClient')){
        toggleCheckboxByIDAndValue('chkcreditCardClient','N');
    }
    if($('#chkSTPEnable')){
        toggleCheckboxByIDAndValue('chkSTPEnable','N');
    }   
    if($('#acctMgrCode')){
        $('#acctMgrCode').val(null);
        $('#acctMgrDesc').val(null);
    }
    
    if($('#segmentType')){
        $('#segmentType').val(null);
    }
    
    if($('#industryType')){
        $('#industryType').val(null);
    }
    
    if($('#Country')){
        $('#Country').val(null);
    }
    
    if($('#billingCountry')){
        $('#billingCountry').val(null);
    }    
    
    if($('#hiddenService_CUSTSER')){
        $('#hiddenService_CUSTSER').val(null);
    }
    
    if($('#hiddenService_GRANPERM')){
        $('#hiddenService_GRANPERM').val(null);
    }
    
    if($('#chkcustomServicesFlag')){
        setServiceCheckUnchek('hiddenService_CUSTSER','chkcustomServicesFlag',false);
    }
    
    if($('#chkgranularPermission')){
        setServiceCheckUnchek('hiddenService_GRANPERM','chkgranularPermission',false);
    }
}
function getClientParamsDetails() {
    if('Y' ===$("#copyClientParam").val()){
    var elementValue = $('#corporationName').val();
    $
            .ajax({
                url : "cpon/clientServiceSetup/clientParameterDetails.json?corporationId="
                        + elementValue,
                contentType : "application/json",
                type : 'POST',
                data : {},
                success : function(data) {
                    $('#sysBranchCode').val(data.sysBranchCode);
                    $('#sysBranchDesc').val(data.sysBranchDesc);
                    if('Y' ==data.retailCustomer && $("#clientType").val() != 'S')
                    {
                        toggleCheckboxByIDAndValue('chkretailCustomer','Y');
                    }else{
                        toggleCheckboxByIDAndValue('chkretailCustomer','N');
                        $('#chkretailCustomer').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_RETAILCUST');setDirtyBit();");
                    }
                    if('Y' == data.clientIsFi && $("#clientType").val() != 'S'){
                        toggleCheckboxByIDAndValue('chkclientIsFi','Y');
                    }else{
                        toggleCheckboxByIDAndValue('chkclientIsFi','N');
                        $('#chkclientIsFi').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_CLIENTISFI');setDirtyBit();");
                    }
                    if('Y' == data.creditCardClient){
                        toggleCheckboxByIDAndValue('chkcreditCardClient','Y');
                    }else{
                        toggleCheckboxByIDAndValue('chkcreditCardClient','N');
                    }
                    if('Y' == data.STPEnable){
                        toggleCheckboxByIDAndValue('chkSTPEnable','Y');
                    }else{
                        toggleCheckboxByIDAndValue('chkSTPEnable','N');
                    }
                    
                    $('#acctMgrCode').val(data.acctMgrCode);
                    $('#acctMgrDesc').val(data.acctMgrDesc);
                    $('#segmentType').val(data.segmentType);
                    $('#industryType').val(data.industryType);    
                    $('#Country').val(data.country);
                    $('#billingCountry').val(data.billingCountry);                    
                    $('#hiddenService_CUSTSER').val(data.customServicesFlag);
                    $('#hiddenService_GRANPERM').val(data.granularPermission);
                    setServiceCheckUnchek('hiddenService_CUSTSER','chkcustomServicesFlag',false);
                    setServiceCheckUnchek('hiddenService_GRANPERM','chkgranularPermission',true);
                }
            });
    }
    else
    {
    $('#chkcustomServicesFlag').attr("src","static/images/icons/icon_unchecked.gif");
    $('#chkcustomServicesFlag').val('N');
    }
}
function getGlobalParamsDetails() {
    
    var elementValue = $('#corporationName').val();
    $
            .ajax({
                url : "cpon/clientServiceSetup/globalParameterDetails.json?corporationId="
                        + elementValue,
                contentType : "application/json",
                type : 'POST',
                data : {},
                success : function(data) {
                    if(undefined !=data.sellerId && $('#userSellerId').val()==data.sellerId)
                    {
                        isSameSeller = 'Y';
                    } else {
                    	isSameSeller = 'N';
                    }
                    if('Y'==isSameSeller)
                    {
                        $('#lblCopyFromCorporation').attr("disabled","true");
                        $('#copyFromCorporation').attr("disabled","true");
                        var chkbox = document.getElementById("copyClientParamLink");
                        if(undefined!=chkbox || null!=chkbox)
                        {
                            if( data.sellerId != $('#sellerId').val() && $("#clientType").val() == 'S')
                            {
                                disableCopyClientParam();
                            }
                            else
                            {
                                toggleCheckboxCopyClientParam(chkbox);
                                getClientParamsDetails();
                            }
                        }
                    }
                    else
                    {
                        $('#lblCopyFromCorporation').removeAttr("disabled");
                        $('#copyFromCorporation').removeAttr("disabled");
                        var chkbox = document.getElementById("copyClientParamLink");
                        if(undefined!=chkbox || null!=chkbox)
                        {
                            if( data.sellerId != $('#sellerId').val() && $("#clientType").val() == 'S')
                            {
                                disableCopyClientParam();
                            }
                            else
                            {
                                toggleCheckboxCopyClientParam(chkbox);
                                getClientParamsDetails();
                            }
                        }
                    }
                    $('#brandingPkgName').val(data.brandingPkgName);                        
                    strThemeId = data.themeProfileId;
                    // setCheckBoxServiceValueAndDisabled('admin',
                    // data.adminEnable);
                    setCheckBoxServiceValueAndDisabled('br', data.brEnable);
                    setCheckBoxServiceValueAndDisabled('bankRep',
                            data.bankRepEnable);
                    setCheckBoxServiceValueAndDisabled('collection',
                            data.collectionEnable);
                    togglePayoutServices(data.collectionEnable,'N');
                    setCheckBoxServiceValueAndDisabled('forecast',
                            data.forecastEnable);
                    /*setCheckBoxServiceValueAndDisabled('incomingAch',
                            data.incomingAchEnable);*/
                    setCheckBoxServiceValueAndDisabled('incomingWire',
                            data.incomingWireEnable);
                    setCheckBoxServiceValueAndDisabled('invest',
                            data.investEnable);
                    setCheckBoxServiceValueAndDisabled('payment',
                            data.paymentEnable);
                    setCheckBoxServiceValueAndDisabled('positivePay',
                            data.positivePayEnable);
                    setCheckBoxServiceValueAndDisabled('trade',
                            data.tradeEnable);
                    setCheckBoxServiceValueAndDisabled('fsc', data.fscEnable);
                    setCheckBoxServiceValueAndDisabled('checks',
                            data.checksEnable);
                    setCheckBoxServiceValueAndDisabled('deposits',
                            data.depositsEnable);
setCheckBoxServiceValueAndDisabled('loan',
                            data.loanEnable);
/*setCheckBoxServiceValueAndDisabled('investments',
                            data.investmentsEnable);*/
/*setCheckBoxServiceValueAndDisabled('incomingWires',
                            data.incomingWiresEnable);*/                            
                            setCheckBoxServiceValueAndDisabled('limits',
                            data.limitsEnable);                            
                    setCheckBoxServiceValueAndDisabled('liquidity', data.liquidityEnable);
                    setCheckBoxServiceValueAndDisabled('lms', data.lmsEnable);
                    setCheckBoxServiceValueAndDisabled('portal', data.portalEnable);
                    setCheckBoxServiceValueAndDisabled('mobile', data.mobileEnable);
                    setCheckBoxServiceValueAndDisabled('subAccount',data.subAccountEnable);
                //    setCheckBoxServiceValueAndDisabled('customServicesFlag', data.customServicesFlag);
                //    setCheckBoxServiceValueAndDisabled('granularPermission', data.granularPermission);
                    setMobileServiceValue('Pay',data.mobilePayEnable,'payment');
                    setMobileServiceValue('Btr',data.mobileBtrEnable,'br');
                    setMobileServiceValue('Pp',data.mobilePpEnable,'positivePay');
                    setCheckBoxServiceValueAndDisplayAddress('payment',data.paymentEnable);
                //    billingDate = data.billingStartDate;                                
                //    var billDate = new Date(billingDate);
                //    $('#billingStartDate').datepicker( "option", "minDate", billDate);    
                //    $('#billingStartDate').val(billingDate);                
                }
            });
}
function setCheckBoxServiceValueAndDisplayAddress(elm, elmValue) {    
    
	   if (elmValue == 'N') {
					$('#chkDisplayAddress')[0].src = 'static/images/icons/icon_unchecked.gif';
						document.getElementById("displayAddressFlag").value = "N";
			} else {
					$('#chkDisplayAddress')[0].src = 'static/images/icons/icon_checked.gif';
						document.getElementById("displayAddressFlag").value = "Y";
					}
	}

function setCheckBoxServiceValueAndDisabled(elm, elmValue) {    
    
    var  hiddenElement = document.getElementsByName(elm + "Enable")[0];    
    if (undefined != hiddenElement) {
        var strID = hiddenElement.id.replace("hiddenService_", "chkService_");
        var anchorElement = document.getElementById(strID);
        var checkBoxImgElm = document.getElementById('chk' + elm);

        if (elmValue == 'Y') {
            checkBoxImgElm.src = "static/images/icons/icon_checked.gif";
            $('#'+hiddenElement.id).val('Y');
            if(!arrayContains(selectedServices,elm))
            {
                selectedServices.push(elm);
            }
        } else {
            checkBoxImgElm.src = "static/images/icons/icon_unchecked_grey.gif";
            $('#'+hiddenElement.id).val('N');
            $('#'+strID).attr('onclick','');
            
        }
        //enableDisableMobileServices(anchorElement,'N');
    }
}

function setMobileServiceValue(ele,value,parentServ){    
    var  hiddenElement = document.getElementsByName("mobile" + ele + "Enable")[0];
    if (undefined != hiddenElement) {
        var strID = hiddenElement.id.replace("hiddenService_", "mobileService_");
        var anchorElement = document.getElementById(strID);
        var checkBoxImgElm = document.getElementById('chkMobile' + ele);
        
        if(value == 'Y'){
            checkBoxImgElm.src = "static/images/icons/icon_checked_grey.gif";
            $('#'+hiddenElement.id).val('Y');
        }else {
            if(!arrayContains(selectedServices,parentServ.toLowerCase())){
                checkBoxImgElm.src = "static/images/icons/icon_unchecked_grey.gif";
                $('#'+hiddenElement.id).val('N');
                $('#'+strID).attr('onclick','');
            }else{
                checkBoxImgElm.src = "static/images/icons/icon_unchecked_grey.gif";
                $('#'+hiddenElement.id).val('N');                
            }
        }
    }
}

jQuery.fn.SetCheckboxValuesSemiEdit = function(isAuthorized) {
    $(this)
            .each(
                    function(index) {
                        var imageList = $(this).find('IMG');
                        var elementId = $(this).attr("id").replace(
                                "chkService_", "");
                        if (null != document.getElementById("hiddenService_"
                                + elementId)) {
                            if ("N" === document
                                    .getElementById("hiddenService_"
											+ elementId).value ) {
                                if(!arrayContains(selectedServices,map[elementId]))
                                {    
                                    imageList[0].src = "static/images/icons/icon_unchecked_grey.gif";
                                    $(this).removeAttr("onclick");
                                }                                
                                else
                                {
                                    imageList[0].src = "static/images/icons/icon_unchecked.gif";
                                }
                                        
                            } else {
                                var mapKeyName = map[elementId];
								if(isAuthorized==true  && serviceMap[mapKeyName]=='Y' && ('payment' != mapKeyName 
								&& ((cmServiceRemoval=='N' && 'checks' == mapKeyName)  || (ppServiceRemoval=='N' && 'positivePay' == mapKeyName) )
												 && 'br' != mapKeyName )){
                                    imageList[0].src = "static/images/icons/icon_checked_grey.gif";
                                    $(this).removeAttr("onclick");
                                }
								else if(isAuthorized==true  && serviceMap[mapKeyName]=='N' && ('payment' != mapKeyName 
								&& ((cmServiceRemoval=='Y' && 'checks' == mapKeyName) || (ppServiceRemoval=='Y' && 'positivePay' == mapKeyName))
											&& 'br' != mapKeyName )){
									imageList[0].src = "static/images/icons/icon_unchecked.gif";
								}
                                else{
                                imageList[0].src = "static/images/icons/icon_checked.gif";
                                }
                            }
                        }
                    });
};
// used for clinet service setup entry service checkbox handling for subsidiary
// in edit mode
function setCorporationSelectedServicesDetails(element,isAuthorized,strReqState) {
    var elementValue = $(element).val();
    $
            .ajax({
                url : "cpon/clientServiceSetup/globalParameterDetails.json?corporationId="
                        + elementValue,
                contentType : "application/json",
                type : 'POST',
                data : {},
                success : function(data) {
					if(null!= data.granularPermission && "Y"==data.granularPermission)
					{
						if($('#hiddenService_GRANPERM').length>-1)
						{
							if("Y"==$('#hiddenService_GRANPERM').val() && "3"==strReqState && true==isAuthorized)
							{
								setServiceCheckUnchek('hiddenService_GRANPERM','chkgranularPermission',true);
							}
							else
							{
								setServiceCheckUnchek('hiddenService_GRANPERM','chkgranularPermission',false);
								$('#chkgranularPermission').attr("onclick","toggleCheckUncheck(this,'hiddenService_GRANPERM');setDirtyBit();");
							}
						}
					}
                    setCorporationSelectedServices('br', data.brEnable);
                    setCorporationSelectedServices('bankRep',
                            data.bankRepEnable);
                    setCorporationSelectedServices('collection',
                            data.collectionEnable);
                    setCorporationSelectedServices('forecast',
                            data.forecastEnable);
                    /*setCorporationSelectedServices('incomingAch',
                            data.incomingAchEnable);*/
                    setCorporationSelectedServices('incomingWire',
                            data.incomingWireEnable);
                    setCorporationSelectedServices('invest',
                            data.investEnable);
					setCorporationSelectedServices('payment',
							data.paymentEnable);
                    setCorporationSelectedServices('positivePay',
                            data.positivePayEnable);
                    setCorporationSelectedServices('trade',
                            data.tradeEnable);
                    setCorporationSelectedServices('fsc', data.fscEnable);
                    setCorporationSelectedServices('checks',
                            data.checksEnable);
                    setCorporationSelectedServices('deposits',
                            data.depositsEnable);
					setCorporationSelectedServices('portal',
							data.depositsEnable);
					setCorporationSelectedServices('mobile',
							data.depositsEnable);
					setCorporationSelectedServices('loan',
                            data.loanEnable);
					/*setCorporationSelectedServices('investments',
                            data.investmentsEnable);*/
					/*setCorporationSelectedServices('incomingWires',
                            data.incomingWiresEnable);*/                            
                    setCorporationSelectedServices('limits',
		                    data.limitsEnable);    
                    setCorporationSelectedServices('liquidity',
                            data.liquidityEnable);            
                    setCorporationSelectedServices('lms',data.limitsEnable);
                    setCorporationSelectedServices('subAccount',data.subAccountEnable);
                    $("a[id^='chkService']").SetCheckboxValuesSemiEdit(isAuthorized);            
                    //checkCopyClientParam(data.sellerId);
                }
            });
}

function checkCopyClientParam(corpSeller)
{
	if( corpSeller != $('#sellerId').val() && $("#clientType").val() == 'S')
    {
        disableCopyClientParam();
    }
}

function setCorporationSelectedServices(elm, elmValue) {
    var hiddenElement = document.getElementsByName(elm + "Enable")[0];
    if (undefined != hiddenElement) {
        if (elmValue == 'Y') {
    
            if(!arrayContains(selectedServices,elm))
            {
                selectedServices.push(elm);
            }
        } 
    }
}

jQuery.fn.SetCheckboxValuesForView = function() {
    $(this)
            .each(
                    function(index) {
                        var imageList = $(this).find('IMG');
                        var elementId = $(this).attr("id").replace(
                                "chkService_", "");
                        if (null != document.getElementById("hiddenService_"
                                + elementId)) {
                            if ("N" === document
                                    .getElementById("hiddenService_"
                                            + elementId).value) {
                                imageList[0].src = "static/images/icons/icon_unchecked_grey.gif";
                            } else {
                                imageList[0].src = "static/images/icons/icon_checked_grey.gif";
                            }
                        }
                    });
};

jQuery.fn.SetMobileCheckboxValuesForView = function(){
    $(this).each(function(index){
        var imgs = $(this).find('img'),
            eleId = $(this).attr('id').replace('mobileService_',"");
        
        if($('#hiddenService_'+ eleId)!= null && $('#hiddenService_'+ eleId).length > 0){
            if($('#hiddenService_'+ eleId).val() == "N"){
                imgs[0].src = "static/images/icons/icon_unchecked_grey.gif";
            }else{
                imgs[0].src = "static/images/icons/icon_checked_grey.gif";
            }
        }        
    });
};

jQuery.fn.SetServiceText = function() {
    $(this)
            .each(
                    function(index) {
                        var elementId = $(this).attr("id").replace(
                                "serviceDiv", "");

                        if (null != document.getElementById("hiddenService_"
                                + elementId)) {
                            if ('Y' === document
                                    .getElementById("hiddenService_"
                                            + elementId).value) {
                                document.getElementById("serviceDiv" + elementId).innerHTML = document.getElementById("serviceDiv" + elementId).title + ",";
                            } else {
                                document.getElementById("serviceDiv" + elementId).innerHTML = "";
                            }
                        }
                    });
    $('#serviceDetail DIV').last().html($('#serviceDetail DIV').last().html().replace(',',''));
                
};

jQuery.fn.SetOtherServiceText = function() {
    $(this).each(function(index){
        var elementId = $(this).attr("id").replace("otherServiceDiv", "");
        if (null != document.getElementById("hiddenService_"+ elementId)){
            if ('Y' === document.getElementById("hiddenService_"+ elementId).value){
                document.getElementById("otherServiceDiv" + elementId).innerHTML = document.getElementById("otherServiceDiv" + elementId).title + ",";
            } else {
                document.getElementById("otherServiceDiv" + elementId).innerHTML = "";
            }
        }
    });
    $('#otherServiceDetails DIV').last().html($('#otherServiceDetails DIV').last().html().replace(',',''));
};

jQuery.fn.setMobileServiceText = function(){
    $(this).each(function(index){
        var eleId = $(this).attr("id").replace("mobileServicesDiv","");
        
        if($("#hiddenService_"+ eleId).length > 0){
            if('Y' == $("#hiddenService_"+ eleId).val()){
                $('#mobileServicesDiv'+eleId).html($('#mobileServicesDiv'+eleId).attr('title') + ",");
            }else{
                $('#mobileServicesDiv'+eleId).html("");
            }
        }
    });    
    if($('#mobileServicesDetail div').last().html($('#mobileServicesDetail div').last().html()).length > 0)
        $('#mobileServicesDetail div').last().html($('#mobileServicesDetail div').last().html().replace(",",""));    
};

jQuery.fn.SetCheckIconsForMenu = function() {
    $(this)
            .each(
                    function(index) {
                        var imageList = $(this).find('IMG');
                        var elementId = $(this).attr("id").replace(
                                "chkService1_", "");
                        if (null != document.getElementById("hiddenService_"
                                + elementId)) {
                            if ("N" === document
                                    .getElementById("hiddenService_"
                                            + elementId).value) {
                                imageList[0].src = "static/images/icons/icon_checked_wrong.png";
                            } else {
                                imageList[0].src = "static/images/icons/icon_checked_correct.png";
                            }
                        }
                    });
};

function goToFeaturePageDynamically(srvcCode, mode, frmId) {
    var serviceValue = document.getElementById("hiddenService_"+srvcCode).value;
    if(serviceValue == 'N' || serviceValue == null)
    {
        return false;
    }
    var frm = document.getElementById(frmId);
    var viewStateField = document.getElementById("viewState");
    var strUrl = '';
    var addOrView;
    if (mode == 'VIEW' || mode == 'MODIFIEDVIEW')
        addOrView = 'view';
    else
        addOrView = 'add';
    switch (srvcCode) {
    case '01':
        strUrl = addOrView.concat('ClientBRFeatureProfileMst.form');
        break;
    case '03':
        strUrl = addOrView.concat('ClientAdminFeatureProfileMst.form');
        break;
    case '04':
        strUrl = addOrView.concat('ClientLiquidityFeatureProfileMst.form');
        break;    
    case '05':
        strUrl = addOrView.concat('ClientCollectionFeatureProfileMst.form');
        break;    
    case '02':
        strUrl = addOrView.concat('ClientPaymentFeatureProfileMst.form');
        break;
    case '13':
        strUrl = addOrView.concat('ClientPositivePayProfile.form');
        break;
    case '11':
        strUrl = addOrView.concat('ClientIncomingPayProfile.form');
        break;
    case '06':
        strUrl = addOrView.concat('ClientFSCFeatureProfileMst.form');
        break;
    case '07':
        strUrl = addOrView.concat('ClientLoanProfileMst.form');
        break;
    case '08':
        strUrl = addOrView.concat('ClientInvestmentProfileMst.form');
        break;
    case '14':
        strUrl = addOrView.concat('ClientCheckProfileMst.form');
        break;
    case '15':
        strUrl = 'viewClientBankReportProfileMstList.form';
        break;
    case '18':
        strUrl = addOrView.concat('ClientLimitServiceMst.form');
        break;
    case '19':
        strUrl = addOrView.concat('ClientPortalProfile.form');
        break;
    case '10':
        strUrl = addOrView.concat('ClientForecastFeatureProfileMst.form');
        break;
    case '09':
        strUrl = addOrView.concat('ClientTradeFeatureProfileMst.form');
        break;
    case '16':
        strUrl = addOrView.concat('ClientDepositFeatureProfileMst.form');
        break;
    case '20':
        strUrl = addOrView.concat('ClientMobileFeatureProfileMst.form');// Temporarily given
        break;
    case '21':
        strUrl = addOrView.concat('ClientSubAccountProfileMst.form');
        break;
    case 'OTHERS':
        strUrl = addOrView.concat('ClientOthersProfileMst.form');;
        break;
    }
    if(viewStateField==null)
    frm.appendChild(createJSFormField('INPUT', 'HIDDEN', 'viewState',
            viewStateField));
    if ($('#dirtyBit').val() == "1")
        getNavigationPopup(frmId, strUrl);
    else
        goToPage(strUrl, frmId);
//    frm.action = strUrl;
//    frm.target = "";
//    frm.method = "POST";

//    frm.submit();
}


function arrayContains(arrayList, key) {
    for (i = 0; i < arrayList.length; i++) {
        if (arrayList[i] === key) {
            return true;
        }
    }
    return false;
}

function toggleRadioCorpSub(elm)
{
    var cType=$("#clientType").val();
    if(elm == 'M')
    {
        $("#clientType").val('M');
        $("#rowSubLabels").addClass("hidden");
        $("#rowSubFields").addClass("hidden");
        $("#corporationName,#corpDesc").val('');
        $("#chkDisplayAddress").attr('src','static/images/icons/icon_unchecked.gif');
        $("#copyClientParamImg").attr('src','static/images/icons/icon_unchecked.gif');
        $("#rowCorpLabels").removeClass("hidden");
        $("#rowCorpFields").removeClass("hidden");
        if(cType=='S')
        {
            var service_div=document.getElementById("divDynamicServices");
            var service_div_chk=service_div.getElementsByTagName("img");
            var service_div_anchor=service_div.getElementsByTagName("a");
            var chk_length=service_div_chk.length;
            for(var iCount=0;iCount<chk_length;iCount++)
                {
                if(service_div_chk[iCount].id!="")
                    {
                    $("#"+service_div_chk[iCount].id).attr("src",
                              "static/images/icons/icon_unchecked.gif");
                    if(isEmpty($("#"+service_div_anchor[iCount].id).attr("onclick")))
                        $("#"+service_div_anchor[iCount].id).attr("onclick","toggleCheckboxServices(this,'N');javascript:setDirtyBit();enableDisableMobileServices(this,'N');");
                    }
                }
                
            $('#divDynamicMobileServices').find('img').each(function(index,ele){
                if($(ele).attr('id') != null && $(ele).attr('id').length > 0){
                    $(ele).attr('src','static/images/icons/icon_unchecked_grey.gif');
                }
            });
            
                
            var element_str="brandingPkgName,sysBranchCode";
            var element_arr = element_str.split(","); 
            for(var iCount=0;iCount<element_arr.length;iCount++)
                document.getElementById(element_arr[iCount]).value="";
        }
    }
    else
    {
        $("#clientType").val('S');
        $("#rowSubLabels").removeClass("hidden");
        $("#rowSubFields").removeClass("hidden");
        $("#rowCorpLabels").addClass("hidden");
        $("#rowCorpFields").addClass("hidden");
        $("#chkDisplayAddress").attr('src','static/images/icons/icon_unchecked.gif');
        if(cType=='M')
        {
            var service_div=document.getElementById("divDynamicServices");
            var service_div_chk=service_div.getElementsByTagName("img");
            var service_div_anchor=service_div.getElementsByTagName("a");
            var chk_length=service_div_chk.length;
            for(var iCount=0;iCount<chk_length;iCount++)
                {
                if(service_div_chk[iCount].id!="")
                    {
                    $("#"+service_div_chk[iCount].id).attr("src",
                              "static/images/icons/icon_unchecked.gif");
                    if(isEmpty($("#"+service_div_anchor[iCount].id).attr("onclick")))
                        $("#"+service_div_anchor[iCount].id).attr("onclick",
                                "toggleCheckboxServices(this,'N');javascript:setDirtyBit();enableDisableMobileServices(this,'N');");
                    }
                }
                $('#divDynamicMobileServices').find('img').each(function(index,ele){
                if($(ele).attr('id').length > 0 && $(ele).attr('id') != null){
                    $(ele).attr('src','static/images/icons/icon_unchecked_grey.gif');
                }
            });
            var element_str="corporationName,sysBranchCode,notes";
            var element_arr = element_str.split(","); 
            for(var iCount=0;iCount<element_arr.length;iCount++)
                document.getElementById(element_arr[iCount]).value="";
        
        }
    }
}
/*
 * function toggleCheckboxSubOfCorp(elem) { var image =
 * elem.getElementsByTagName("IMG")[0]; if
 * (image.src.indexOf("icon_checked.gif") == -1) { image.src =
 * "static/images/icons/icon_checked.gif"; //$("#clientType").val('S');
 * //$("#corporationName").removeAttr("disabled");
 * //$("#lblSubOfCorp").addClass("frmLabel required requiredPdl");
 * //$("#brandingPkgName").attr("disabled", "true");
 * //$("#brandingPkgName").val(""); } else { image.src =
 * "static/images/icons/icon_unchecked.gif"; //$("#clientType").val('M');
 * //$("#corporationName").attr("disabled", "true");
 * //$("#lblSubOfCorp").removeClass('frmLabel required requiredPdl');
 * //$("#corporationName").val("Select");
 * //$("#brandingPkgName").removeAttr("disabled");
 * //$("#copyClientParamChkBox").removeAttr("onclick");
 * //$("#copyClientParamImg").attr("src",
 * "static/images/icons/icon_unchecked_grey.gif"); } }
 */
function toggleCheckboxDef(imgElement,elm)
{
    var checkedStatus = false;
    if (imgElement.src.indexOf("icon_unchecked_grey.gif") == -1) {

        if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
            imgElement.src = "static/images/icons/icon_checked.gif";
            checkedStatus = true;
        } else {
            imgElement.src = "static/images/icons/icon_unchecked.gif";
            checkedStatus = false;
        }
    }
    if(checkedStatus == true)
    {
        $("#hiddenService_"+elm).val('Y');
    }
    else
    {
        $("#hiddenService_"+elm).val('N');
    }
}

function checkCategories()
{
    if(undefined===selectedTotalCategories[0])
    {
    for (var i=0;i< selectedCategories.length;i++)
    {
        var objUserMessage = 
        {
            categoryId: selectedCategories[i]
        };
        selectedTotalCategories.push(objUserMessage);
    }
    }
    else
    {
    for (var i=0;i< selectedCategories.length;i++){
        if(!checkIfCategoryAdded(selectedTotalCategories,selectedCategories[i]))
        {
            var objUserMessage = 
            {
                categoryId: selectedCategories[i]
            };
        selectedTotalCategories.push(objUserMessage);
        }
        }
    }
    selectedCategoryLimitList = JSON.stringify(selectedTotalCategories);
}

function checkIfCategoryAdded(arrayObj,categoryId)
{
        for (i = 0; i < arrayObj.length; i++) {
            if (arrayObj[i].categoryId === categoryId) {
                return true;
            }
        }
        return false;
}

function checkuncheckFeature(imgElement,featureId)
{
    if (imgElement.src.indexOf("icon_unchecked.gif") > -1)
    {
        imgElement.src = "static/images/icons/icon_checked.gif";    
        $('#'+featureId+"_value").val('Y');
    }
    else
    {
        imgElement.src = "static/images/icons/icon_unchecked.gif";
        $('#'+featureId+"_value").val('N');
    }
    if (srvc === 'CHECKS')
    {
        enableAdvStopPayFeature();
        renderCheckApprovalOptions( imgElement,featureId, 'Y');
    }
    else if (srvc === 'LOAN')
    {
        renderLoansOptions(imgElement,featureId,true,"EDIT");
    }
}

function checkUncheckCponConfigFields(imgElement,flag)
{
    if (imgElement.src.indexOf("icon_checked.gif") == -1) 
    {
        imgElement.src = "static/images/icons/icon_checked.gif";
        $('#' + flag).val('Y');
    } 
    else 
    {
        imgElement.src = "static/images/icons/icon_unchecked.gif";
        $('#' + flag).val('N');
    }
}

function setCheckUncheckCponConfigFields(imgInput,value, viewMode)
{
	if(viewMode)
	{
	    if (value == 'Y') 
		{
	        imgInput.attr( 'src', 'static/images/icons/icon_checked_grey.gif' );
	    } 
		else 
		{
	        imgInput.attr( 'src', 'static/images/icons/icon_unchecked_grey.gif' );
	    }		
	}
	else
	{
	    if (value == 'Y') 
		{
	        imgInput.attr( 'src', 'static/images/icons/icon_checked.gif' );
	    } 
		else 
		{
	        imgInput.attr( 'src', 'static/images/icons/icon_unchecked.gif' );
	    }
	}
}

function enableAdvStopPayFeature()
{
    if( $('#CHKINQ_value').val() == 'Y' && $('#CHKSTP_value').val() == 'Y' )
    {
    
        if( $('#FCHK-000003_value').val() == 'N' )
        {
            var chkReference = document.getElementById("chkImg_FCHK-000003");
            chkReference.src = "static/images/icons/icon_unchecked.gif";
            document.getElementById("chkImg_FCHK-000003").setAttribute('onClick','setDirtyBit();checkuncheckFeature(this,"FCHK-000003");');
        }
    }
    else
    {
        var chkReference = document.getElementById("chkImg_FCHK-000003");
        chkReference.src = "static/images/icons/icon_unchecked_grey.gif";
        document.getElementById("chkImg_FCHK-000003").setAttribute('onClick','');
        $("#FCHK-000003_value").val('N');
    }    
}

function renderCheckApprovalOptions( imgElement, featureId, clickEvent )
{
    // for check Management features
    if( featureId == 'CHKSTP' )
    {
        var chkReference = document.getElementById("chkImg_ARFS");
        var verReference = document.getElementById("chkImg_FCHK-000001");
        
        if( imgElement != null && imgElement!= '' )
        {
            if ( imgElement.src.indexOf("icon_checked.gif") > -1 || imgElement.src.indexOf("icon_checked_grey.gif") > -1)
            {
                if( chkReference != null && verReference!=null )
                {
                    // following flag to differenciate call from source
                    if( clickEvent == 'Y' )
                    {
                        chkReference.src = "static/images/icons/icon_unchecked.gif";
                        verReference.src = "static/images/icons/icon_unchecked.gif";
                    }
                    if(clientType==='M'){
                        document.getElementById("chkImg_ARFS").setAttribute('onClick','setDirtyBit();checkuncheckFeature(this, "ARFS");');
                        document.getElementById("chkImg_FCHK-000001").setAttribute('onClick','setDirtyBit();checkuncheckFeature(this, "FCHK-000001");');
                    }    
                }
            }
            else
            {
                if( chkReference != null && verReference!=null )
                {
                    chkReference.src = "static/images/icons/icon_unchecked_grey.gif";
                    verReference.src = "static/images/icons/icon_unchecked_grey.gif";
                    document.getElementById("chkImg_ARFS").setAttribute('onClick','');
                    document.getElementById("chkImg_FCHK-000001").setAttribute('onClick','');
                    $("#ARFS_value").val('N');
                    $("#FCHK-000001_value").val('N');
                }
            }
        }

    }
    else if( featureId == 'CHKCSTP' )
    {
        var chkReference = document.getElementById("chkImg_ARFC");
        var verReference = document.getElementById("div_FCHK-000002");
        
        if( imgElement != null && imgElement!= '' )
        {
            if (imgElement.src.indexOf("icon_checked.gif") > -1 || imgElement.src.indexOf("icon_checked_grey.gif") > -1)
            {
                if( chkReference != null && verReference!=null)
                {
                    if( clickEvent == 'Y' )
                    {
                        chkReference.src = "static/images/icons/icon_unchecked.gif";
                        verReference.src = "static/images/icons/icon_unchecked.gif";
                        $('#chkImg_FCHK-000002').attr('src','static/images/icons/icon_unchecked.gif');
                    }
                    if(clientType==='M'){
                        document.getElementById("chkImg_ARFC").setAttribute('onClick','setDirtyBit();checkuncheckFeature(this, "ARFC");');
                        document.getElementById("chkImg_FCHK-000002").setAttribute('onClick','setDirtyBit();checkuncheckFeature(this, "FCHK-000002");');
                    }    
                }
            }
            else
            {
                if( chkReference != null && verReference!=null )
                {
                    chkReference.src = "static/images/icons/icon_unchecked_grey.gif";
                    verReference.src = "static/images/icons/icon_unchecked_grey.gif";
                    $('#chkImg_FCHK-000002').attr('src','static/images/icons/icon_unchecked_grey.gif');
                    document.getElementById("chkImg_ARFC").setAttribute('onClick','');
                    document.getElementById("chkImg_FCHK-000002").setAttribute('onClick','');
                    $("#ARFC_value").val('N');
                    $("#FCHK-000002_value").val('N');
                }
            }
        }
        
    }
}
jQuery.fn.dateTextBox = function() {
    return this
            .each(function() {
                $(this)
                        .keydown(function(e) {
                            var key = e.charCode || e.keyCode || 0;
                            // allow backspace, tab, delete, arrows, numbers and
                            // keypad for TAB
                            return (key == 9 || key==8 || key==46);
                            })
            })
};

function toggleCheckBoxBilling(elem){
    var image = elem.getElementsByTagName("IMG")[0];
    if (image.src.indexOf("grey.gif") != -1) {
        return;
    }
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        if(elem.id ==='billByAccountChkbox' || elem.id ==='billByActivityChkbox'){
            if(elem.id==='billByAccountChkbox'){
                $('#billByActivityImg').attr('src','static/images/icons/icon_unchecked_grey.gif');
                $('#clientBillBy').val('CHARGE');
            }
            else {
                $('#billByAccountImg').attr('src','static/images/icons/icon_unchecked_grey.gif');
                $('#clientBillBy').val('ACTVT');
            }
        }
    }else {
        image.src = "static/images/icons/icon_unchecked.gif";
        if(elem.id ==='billByAccountChkbox' || elem.id ==='billByActivityChkbox'){
            if(elem.id==='billByAccountChkbox'){
                $('#billByActivityImg').attr('src','static/images/icons/icon_unchecked.gif');
                $('#clientBillBy').val('');
            }
            else {
                $('#billByAccountImg').attr('src','static/images/icons/icon_unchecked.gif');
                $('#clientBillBy').val('');
            }
        }
    }
}

function toggleCheckboxSameAddress(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        document.getElementById('billingAddress').value = document.getElementById('Address').value;
        enableDisableInputField('billingAddress', true);
        document.getElementById('billingCity').value = document.getElementById('city').value;
        enableDisableInputField('billingCity',true);
        document.getElementById('billingState').value = document.getElementById('state').value;
        enableDisableInputField('billingState',true);
        document.getElementById('billingCountry').value = document.getElementById('Country').value;
        enableDisableInputField('billingCountry',true);
        document.getElementById('splitset1_billingFaxNmbrCountryCode').value = document.getElementById('splitset1_faxNmbrCountryCode').value;
        enableDisableInputField('splitset1_billingFaxNmbrCountryCode',true);
        document.getElementById('splitset2_billingFaxNmbr').value = document.getElementById('splitset2_faxNmbr').value;
        enableDisableInputField('splitset2_billingFaxNmbr',true);
        document.getElementById('alternateContactPerson').value = document.getElementById('contactPerson').value;
        enableDisableInputField('alternateContactPerson',true);
        document.getElementById('alternateEmail').value = document.getElementById('emailId').value;
        enableDisableInputField('alternateEmail',true);
        document.getElementById('splitset1_alternateMobileCountryCode').value = document.getElementById('splitset1_mobileNmbrCountryCode').value;
        enableDisableInputField('splitset1_alternateMobileCountryCode',true);
        document.getElementById('splitset2_alternateMobile').value = document.getElementById('splitset2_mobileNmbr').value;
        enableDisableInputField('splitset2_alternateMobile',true);
        //Following fields are not available on JSP and causing JS errors hence commenting
        //document.getElementById('clientAdditionalInfo10').value = document.getElementById('ZipCode').value;
        //enableDisableInputField('clientAdditionalInfo10',true);
        var state = document.getElementById('state').value;
        populateStates(document.getElementById("billingCountry"), state);
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        document.getElementById('billingAddress').value = "";
        enableDisableInputField('billingAddress', false);
        document.getElementById('billingCity').value = "";
        enableDisableInputField('billingCity', false);
        document.getElementById('billingState').value = "";
        enableDisableInputField('billingState', false);
        document.getElementById('billingCountry').value = "";
        enableDisableInputField('billingCountry', false);
        document.getElementById('splitset1_billingFaxNmbrCountryCode').value = "";
        enableDisableInputField('splitset1_billingFaxNmbrCountryCode', false);
        document.getElementById('splitset2_billingFaxNmbr').value = "";
        enableDisableInputField('splitset2_billingFaxNmbr', false);
        document.getElementById('alternateContactPerson').value = "";
        enableDisableInputField('alternateContactPerson', false);
        document.getElementById('alternateEmail').value = "";
        enableDisableInputField('alternateEmail', false);
        document.getElementById('splitset1_alternateMobileCountryCode').value = "";
        enableDisableInputField('splitset1_alternateMobileCountryCode', false);        
        document.getElementById('splitset2_alternateMobile').value = "";
        enableDisableInputField('splitset2_alternateMobile', false);
        //Following fields are not available on JSP and causing JS errors hence commenting
        //document.getElementById('clientAdditionalInfo10').value = "";
        //enableDisableInputField('clientAdditionalInfo10', false);
    }
}

function enableDisableInputField(fieldId, disable) {
    var elemId = '#' + fieldId;
    if (disable) {
        $(elemId).attr("readOnly", "true");
        $(elemId).attr("disabled", "disabled");
        $(elemId).addClass("disabled");
    } else {
        $(elemId).removeAttr("readOnly");
        $(elemId).removeAttr("disabled");
        $(elemId).removeClass("disabled");
    }
}

function to_upperCase(element)
{
    $(element).val($(element).val().toUpperCase());
	$(element).val($(element).val().replace(/^\s+|\s+$/gm,''));
}

function toggleCheckboxByIDAndValue(elementId,value)
{
    var checkBoxElm = document.getElementById(elementId);
    if(value == 'Y')
    {
        $('#'+elementId).attr("checked",true);
        $('#'+elementId).attr("src","static/images/icons/icon_checked.gif");
        if(elementId == 'chkretailCustomer')
        {
            $("#hiddenService_RETAILCUST").val('Y');
            $('#'+elementId).attr('onclick','toggleCheckboxDef(this,"RETAILCUST");setDirtyBit();');
        }else if(elementId == 'chkclientIsFi'){
            $("#hiddenService_CLIENTISFI").val('Y');
            $('#'+elementId).attr('onclick','toggleCheckboxDef(this,"CLIENTISFI");setDirtyBit();');
        }
        else if(elementId == 'chkSTPEnable'){
            $("#hiddenService_STPEnable").val('Y');
            $('#'+elementId).attr('onclick','toggleCheckboxDef(this,"STPEnable");setDirtyBit();');
        }
    }
    else
    {
        $('#'+elementId).attr("checked",false);
        $('#'+elementId).attr('src','static/images/icons/icon_unchecked.gif');
        if(elementId == 'chkretailCustomer')
        {
            $("#hiddenService_RETAILCUST").val('N');
            $('#'+elementId).attr('onclick','toggleCheckboxDef(this,"RETAILCUST");setDirtyBit();');
        }else if(elementId == 'chkclientIsFi'){
            $("#hiddenService_CLIENTISFI").val('N');
            $('#'+elementId).attr('onclick','toggleCheckboxDef(this,"CLIENTISFI");setDirtyBit();');
        }
    }
}

function toggleCheckUncheckCombo(imgElement, obj,comboBoxId) 
{
    
    if (imgElement.src.indexOf("icon_unchecked.gif") > -1)
    {
        imgElement.src = "static/images/icons/icon_checked.gif";    
        $('#'+obj).val('Y');
        $('#'+comboBoxId).removeAttr('disabled');
    }
    else
    {
        imgElement.src = "static/images/icons/icon_unchecked.gif";
        $('#'+obj).val('N');
        $('#'+comboBoxId).attr('disabled','true');
        $('#'+comboBoxId).val('');
    
    }
}

function setCheckUncheckMandatoryCombo(imgElement,comboBoxId) 
{
    if (imgElement.src.indexOf("icon_unchecked") > -1)
    {
        $('#'+comboBoxId+'Lbl').removeClass('required-lbl-right');
        $('#'+comboBoxId).val('')
                         .attr('disabled','disabled')
                         .addClass('disabled');    
    }
    else
    {
        $('#'+comboBoxId+'Lbl').addClass('required-lbl-right');
        $('#'+comboBoxId).removeAttr('disabled')
                        .removeClass('disabled');
    }
}

function toggleCheckUncheckAllowConfidential(imgElement,imgElement_confidential, flag, confidentialMandatoryFlag) {
    var ele=document.getElementById(imgElement_confidential);
        if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
            imgElement.src = "static/images/icons/icon_checked.gif";
            ele.src="static/images/icons/icon_unchecked.gif";
            $('#' + flag).val('Y');
        } else {
            imgElement.src = "static/images/icons/icon_unchecked.gif";
            ele.src="static/images/icons/icon_unchecked_grey.gif";
            $('#' + flag).val('N');
			$('#' + confidentialMandatoryFlag).val('N');
        }
    }

function setCountOfPopups(modelObjName,idCount)
{
    var optionsSelected = $('#'+modelObjName).val();
    var options = optionsSelected.split(",");
    $('#'+idCount).text("("+(options.length)+")");
}

jQuery.fn.ForceSpecificSpecialCharacters = function() {
    return this
            .each(function() {
                $(this)
                        .keydown(
                                function(e) {
                                    var key = e.charCode || e.keyCode || 0;
                                    // allow backspace, tab, delete, numbers,
                                    // comma, fullstop, hyphen, semicolon
                                    // keypad numbers, letters ONLY
                                    if (event.which) { // Netscape/Firefox/Opera
                                        keynum = event.which;
                                    }
                                    if (event.shiftKey) {
                                        return false;
                                    }
                                    return (key == 8 || key == 9 || key == 46
                                            || key == 190 || key == 188 || key == 189 || key == 186 
                                            || (key >= 37 && key <= 40)
                                            || (key >= 48 && key <= 57)
                                            || (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
                                })
            })
};

function toggleCustomClientDefinition(element)
{
    var imageList = $(element).find('IMG');
    var pathValue = $("#customClientDefinition").val();
    var brandingPkgValue = $("#brandingPkgName").val();
    if ("N" === pathValue) 
    {
        imageList[0].src = "static/images/icons/icon_checked.gif";
		if( brandingPkgCount == 1)
		{
			brandingPackageValue = brandingPkgValue ;
		}
        $("#customClientDefinition").val("Y");
        $("#brandingPkgName").val("");
        $('#brandingPkgName').attr("disabled", "true");
        $("#lblbrandingPkgName").removeClass("required-lbl-right");
        $("#lblThemeProfileId").addClass("required-lbl-right");
        strThemeId = '';
        
        if("" != brandingPkgValue)
        {
            $('#acctMgrCode').val('');
            $('#segmentType').val('');
            $('#industryType').val('');
            $('#notes').val('');
            $('#themeProfileId').val('');
            
            setCheckBoxServiceValue('br', 'N');
            setCheckBoxServiceValue('bankRep', 'N');
            setCheckBoxServiceValue('collection', 'N');
            togglePayoutServices("N",'N');
            setCheckBoxServiceValue('forecast', 'N');
            setCheckBoxServiceValue('incomingAch', 'N');
            setCheckBoxServiceValue('incomingWire', 'N');
            setCheckBoxServiceValue('investments', 'N');
            setCheckBoxServiceValue('payment', 'N');
            setCheckBoxServiceValue('positivePay', 'N');
            setCheckBoxServiceValue('trade', 'N');
            setCheckBoxServiceValue('fsc', 'N');
            setCheckBoxServiceValue('checks', 'N');
            setCheckBoxServiceValue('limits', 'N');
            setCheckBoxServiceValue('loan', 'N');
            setCheckBoxServiceValue('deposits', 'N');
            setCheckBoxServiceValue('liquidity', 'N');
            setCheckBoxServiceValue('lms', 'N');
            setCheckBoxServiceValue('portal', 'N');
            setCheckBoxServiceValue('mobile', 'N');
            setCheckBoxServiceValue('subAccount', 'N');
        }
    } else {
        imageList[0].src = "static/images/icons/icon_unchecked.gif";
        $("#customClientDefinition").val("N");
		if( brandingPkgCount == 1)
		{
			$("#brandingPkgName").val(brandingPackageValue);
			getBrandingPachakeDetails($("#brandingPkgName"));
		}
		else
		{
			$("#brandingPkgName").val(brandingPkgValue);
		}
        $("#brandingPkgName").removeAttr("disabled");
        $("#lblbrandingPkgName").addClass("required-lbl-right");
        $("#lblThemeProfileId").removeClass("required-lbl-right");
        var srvcPkg = $("#brandingPkgName").val();
        $.ajax({
            url : "cpon/clientServiceSetup/brandingPackageDetails.json?packageId="
                    + srvcPkg,
            contentType : "application/json",
            type : 'POST',
            data : {},
            success : function(data) {
                $('#themeProfileId').val(data.themeProfileId);    
                strThemeId = data.themeProfileId;
            }
        });
    }
    pathValue = $("#customClientDefinition").val();
    enableDisableTheme(pathValue);
}

function toggleCheckboxCopyClientParam(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        $("#copyClientParam").val('Y');

        if ('Y' === $("#copyClientParam").val() && 'N' == isSameSeller) {
            enableCopyClientParamsFrom();
        }
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        $("#copyClientParam").val('N');
        $("#chkretailCustomer").attr("checked", false);
        $("#hiddenService_RETAILCUST").val('N');
        //$('#sysBranchCode').val('Select');
        //$('#acctMgrCode').val('Select');
        $('#copyFromCorporation').attr("disabled", "true");
        //$('#copyFromCorporation').val('Select');
        $('#copyFromCorporation').removeClass("hidden");
        $('#copyFromCorporationDiv').addClass("hidden");
    }
}

function enableCopyClientParamsFrom() {
    var elementValue = $('#corporationName').val();
    var sellerId = $('#sellerCode').val();
    $
        .ajax({
            url: "cpon/clientServiceSetup/validSubsidairies.json?corporationId=" + elementValue + '&sellerId=' + sellerId,
            contentType: "application/json",
            type: 'POST',
            data: {},
            success: function (data) {
                var count = 1;
              //  document.getElementById('copyFromCorporation').length = 1;
                for (i = 0; i < data.d.filter.length; i++) {
                    var object = data.d.filter[i];
                    var key = object.name;
                    var value = object.value;
                    var newoption = new Option(value, key, false, false);
                 //   document.getElementById('copyFromCorporation').options[count++] = newoption;
                }

                if (1 == data.d.filter.length) {
                //    $('#copyFromCorporation').val(data.d.filter[0].name);
                 //   $('#copyFromCorporation').addClass("hidden");
                    $('#copyFromCorporationDiv').removeClass("hidden");
                    $('#copyFromCorporationDiv').text(data.d.filter[0].value);
                } else {
                 //   $('#copyFromCorporation').removeAttr("disabled");
                  //  $('#copyFromCorporation').val('Select');
                  //  $('#copyFromCorporation').removeClass("hidden");
                  //  $('#copyFromCorporationDiv').addClass("hidden");
                }
            }
        });
}

function toggleCheckboxImage(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    var elementId = elem.getAttribute("id").replace("chkLink_", "");
    if (undefined != image)
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        document.getElementById(elementId).value = "Y";
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        document.getElementById(elementId).value = "N";
    }
}

function getRemoveSerivecConfimationPopupCorp(imageId,serviceName,frmId,clientType) {
		var msg = '';
	$('#removeServiceConfirmPopupCorp').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:'auto',
		width : 400,
		modal : true,
		resizable: false,
		draggable: false,
		draggable: false
	});
	
	if (clientType =='M')	
	 msg = serviceName+' ' +getLabel("removeServiceMsgCorp", "service will be revoked for the selected corporation and its associated subsidiaries, Do you want to continue?");
	else		
	 msg = serviceName+' ' +getLabel("removeServiceMsgSub", "service will be revoked for the selected subsidiary, Do you want to continue?");
 
	$('#serviceRemoval').text(msg);
	
	$('#removeServiceConfirmPopupCorp').dialog("open");
	
	$('#cancelServiceConfirmbutton').bind('click',function(){
		imageId.src = "static/images/icons/icon_checked.gif";
		$('#removeServiceConfirmPopupCorp').dialog("close");
	});
	
	$('#okServiceConfirmbutton').bind('click',function(){
		$('#removeServiceConfirmPopupCorp').dialog("close");
	});
	}

jQuery.fn.SetCustomCheckboxValues = function(isDisabled) {
    $(this)
            .each(
                    function(index) {
                        var imageList = $(this).find('IMG');
                        var elementId = $(this).attr("id").replace(
                                "chkCustom_", "");
                        if (null != document.getElementById("hiddenService_"
                                + elementId)) {
                                if ("N" === document
                                    .getElementById("hiddenService_"
                                            + elementId).value && undefined!=imageList) {
                                if(isDisabled==true || (imageList[0].src.indexOf("grey") != -1)){
                                imageList[0].src = "static/images/icons/icon_unchecked_grey.gif";                                
                                }
                                else{            
                                imageList[0].src = "static/images/icons/icon_unchecked.gif";
                                }
                            } else {
                                    
                                if(isDisabled==true || (imageList[0].src.indexOf("grey") != -1)){
                                    imageList[0].src = "static/images/icons/icon_checked_grey.gif";
                                    $(this).removeAttr("onclick");
                                }
                                else
                                {
                                    imageList[0].src = "static/images/icons/icon_checked.gif";
                                }
                            }
                        }
                    });
};


function showSIDisabledPopup(image,elementId)
{
    $('#StandingInstructionsDisabledPopup').dialog({
        autoOpen : false,
        height : 150,
        width : 416,
        modal : true,
        resizable : false,
        position: { of: $( "#frmMain" ), at: "center middle" },
        buttons : {
            "Yes" : function() {
                image.src = "static/images/icons/icon_unchecked.gif";
                if (null != selectedEntryFeatures) {
                    var position = jQuery.inArray(elementId, selectedEntryFeatures);
                    if (-1 != position) {
                        selectedEntryFeatures.splice(position, 1);
                    }
                }
                var element = $('#chkService_SIYB')[0];
                if(element) {
                    var img = element.getElementsByTagName("IMG")[0];
                    img.src = "static/images/icons/icon_unchecked_grey.gif";
                    $(element).attr('onclick','');
                }
                var position = jQuery.inArray('SIYB', selectedEntryFeatures);
                if (-1 != position) {
                    selectedEntryFeatures.splice(position, 1);
                }
                $(this).dialog("close");
            },
            "No" : function() {
                $(this).dialog("close");
            }
        }
    });
    $('#StandingInstructionsDisabledPopup').dialog("open");
}

function populateStates(elmt, mState)
{
    var state = "";
    if(elmt && elmt.id == "Country")
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
    else if(elmt && elmt.id == "billingCountry")
    {
        if(elmt.value == "")
        {
            $('#billingState').attr("disabled", "true");
            $('#billingState').val("");
        }
        else
        {
            $('#billingState').removeAttr("disabled");
            state = document.getElementById("billingState");
        }
    }
    if(elmt && elmt.value != "")
    {
        blockClientUI(true);
        $.post('cpon/clientServiceSetup/clientCountryStateList.json', { $countryCode: elmt.value}, 
        function(data){
            populateData(state, data);
            if(mState != "")
                state.value = mState;
            blockClientUI(false);
            if("EDIT" ==  pageMode)
            { 
            	$('#tab_v').find('a').attr("onclick","validateAndNavigate('addClientAdminFeatureProfileMst.form','frmMain');");
            	$('#tab_e').find('a').attr("onclick","validateAndNavigate('clientAccountMasterList.form','frmMain');");
            	$.unblockUI();
            }
        })
        .fail(function() 
        {
            blockClientUI(false);
            if("EDIT" ==  pageMode)
            { 
            	$('#tab_v').find('a').attr("onclick","validateAndNavigate('addClientAdminFeatureProfileMst.form','frmMain');");
            	$('#tab_e').find('a').attr("onclick","validateAndNavigate('clientAccountMasterList.form','frmMain');");
            	$.unblockUI();
            }
        });
    }
}

function blockClientUI(blnBlock) {
    if (blnBlock === true) {
        $("#pageContentDiv").addClass('ui-helper-hidden');
        $('#entryFormDiv').block({
            overlayCSS : {
                opacity : 0
            },
            baseZ : 2000,
            message : '<div style="z-index: 1"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
            css : {
                height : '32px',
                padding : '8px 0 0 0'
            }
        });
    } else {
        $("#pageContentDiv").removeClass('ui-helper-hidden');
        $('#entryFormDiv').unblock();
    }
}

function populateData(select, states)
{
    select.length=1;
    for(var i=0;i<states.length;i++)
	{
		var option=document.createElement("option");
        option.text=getStateMstLabel(states[i].COUNTRY_CODE+"."+states[i].STATE_CODE,states[i].STATE_DESC);
        option.value=states[i].STATE_CODE;
        select.add(option);
	}
}

function enableDisableTheme(cstmClntDef)
{
    ("Y" == cstmClntDef) ? ($("#themeProfileId").removeAttr("disabled"))
            : ($("#themeProfileId").attr("disabled", "true"));
}

function showFetchLink(){
    if($('#clientShortName').val()){
        $('#lnkClientInfo').attr('disabled',false);
        $('#lnkClientInfo').css({'pointer-events' : 'auto',    'cursor' : 'pointer'});
        //$('#lnkClientInfo').click(function(){ goToPage("getClientInfo.form", "frmMain")});
        $('#lnkClientInfo').click(function(){ fetchClientDetails("frmMain")});
    }else{
        $('#lnkClientInfo').css({'pointer-events' : 'none',
                                    'cursor' : 'default'});
        $('#lnkClientInfo').attr('disabled',true);
    }    
}

function showAccountFetchLink(){
    if($('#acctNmbr').val())
    {
        $('#lnkAccountInfo').attr('disabled',false);
        $('#lnkAccountInfo').css(
        {
            'pointer-events' : 'auto',    'cursor' : 'pointer'
        });
        $('#lnkAccountInfo').click(function()
        { 
            goToPage("getAccountInfo.form", "frmMain")
        });
    }
    else
    {
        $('#lnkAccountInfo').css(
        {
            'pointer-events' : 'none',
            'cursor' : 'default'
        });
        $('#lnkAccountInfo').attr('disabled',true);
    }    
}

function checkReportCenterFlag()
{
    var standardReportRef = document.getElementById("chkImg_VIEWSTANDREP");

    if( standardReportRef != null )
    {
        if( standardReportRef.src.indexOf("icon_unchecked.gif") > -1 )
        {
            isReportCenterHideFlag = "Y";
        }
        else if( standardReportRef.src.indexOf("icon_checked.gif") > -1 )
        {
            isReportCenterHideFlag = "N";
        }
    }
}

function checkCustomReportFlag()
{
    var customReportRef = document.getElementById("chkImg_CUSTREPORT");
    
    if( customReportRef != null )
    {
        if( customReportRef.src.indexOf("icon_unchecked.gif") > -1 )
        {
            isCustomReportHideFlag = "Y";
            disbaleCustomReport();
        }
        else if( customReportRef.src.indexOf("icon_checked.gif") > -1 )
        {
            isCustomReportHideFlag = "N";
            enableCustomReport();
        }
    }
    
}

function disbaleCustomReport()
{
    var custConf = document.getElementById("chkImg_CUSTCOLCONF");
    var custConfRep = document.getElementById("chkImg_CUSTCONFREPSELUNLOCK");
    
    if( custConf != null )
    {
        custConf.src = "static/images/icons/icon_unchecked_grey.gif";
        document.getElementById("chkService_CUSTCOLCONF").onclick = "";
        
        // this call to remove the feature from selectedEntryFeatures list
        updateSelectedEntryFeatures( "CUSTCOLCONF" );
    }
    
    if( custConfRep != null )
    {
        custConfRep.src = "static/images/icons/icon_unchecked_grey.gif";
        document.getElementById("chkService_CUSTCONFREPSELUNLOCK").onclick = "";
        
        // this call to remove the feature from selectedEntryFeatures list
        updateSelectedEntryFeatures( "CUSTCONFREPSELUNLOCK" );
    }
    
}

function updateSelectedEntryFeatures( elementId )
{
    if (null != selectedEntryFeatures)
    {
        var position = jQuery.inArray(elementId, selectedEntryFeatures);
        if (-1 != position) {
            selectedEntryFeatures.splice(position, 1);
        }
    }

}
function enableCustomReport()
{
    var custConf = document.getElementById("chkImg_CUSTCOLCONF");
    var custConfRep = document.getElementById("chkImg_CUSTCONFREPSELUNLOCK");
    
    if( custConf != null )
    {
        if( custConf.src.indexOf("icon_unchecked_grey.gif") > -1 )
        {
            custConf.src = "static/images/icons/icon_unchecked.gif";
            $("#chkService_CUSTCOLCONF").removeAttr('onclick');
            document.getElementById("chkService_CUSTCOLCONF").setAttribute('onClick','setDirtyBit();toggleCheckboxFeatureDetails(this);'); 
            
        }
        else
        {
            custConf.src = "static/images/icons/icon_checked.gif";
            $("#chkService_CUSTCOLCONF").removeAttr('onclick');
            document.getElementById("chkService_CUSTCOLCONF").setAttribute('onClick','setDirtyBit();toggleCheckboxFeatureDetails(this);'); 
        }
    }
    
    if( custConfRep != null )
    {
        if( custConfRep.src.indexOf("icon_unchecked_grey.gif") > -1 )
        {
            custConfRep.src = "static/images/icons/icon_unchecked.gif";
            $("#chkService_CUSTCONFREPSELUNLOCK").removeAttr('onclick');
            document.getElementById("chkService_CUSTCONFREPSELUNLOCK").setAttribute('onClick','setDirtyBit();toggleCheckboxFeatureDetails(this);');
        }
        else
        {
            custConfRep.src = "static/images/icons/icon_checked.gif";
            $("#chkService_CUSTCONFREPSELUNLOCK").removeAttr('onclick');
            document.getElementById("chkService_CUSTCONFREPSELUNLOCK").setAttribute('onClick','setDirtyBit();toggleCheckboxFeatureDetails(this);');
        }
    }
    
}

function setCustomReportHideFlag()
{
    var reference = document.getElementById("chkImg_CUSTREPORT");
    
    if( reference != null )
    {
        if( reference.src.indexOf("icon_unchecked_grey.gif") > -1 )
        {
            isCustomReportHideFlag = "Y";
        }
        else
        {
            isCustomReportHideFlag = "N";
        }
    }
}

function provideBankBasedAccountUsageOptions()
{
    var isSystemBank = document.getElementById("hiddenService_systemBankFlag").value ;
    if(isSystemBank == "Y")
    {
    	virtualAccountCheck();
        $('#chkImg_othersDefaultChargeAccount,#chkImg_othersDefaultGstAccount, #imgService_othersPositivePayImaging, #imgService_reversePositivePay, #chkImgPayments, #chkImgFSC, #chkImgCollections, #chkImgForecast, #chkImgTrade, #chkImgBR, #chkImgSweeping, #chkImgPooling, #chkImgPortal, #chkImgLimits, #chkImg_othersChargeAccount').attr('src', 'static/images/icons/icon_unchecked.gif');
        $("#chkService_acctUsagePay").attr("onclick", "pToggleCheckbox(this);showPaymentSection(this,'frmMain');");
        $("#chkService_acctUsageFSC").attr("onclick", "toggleCheckbox(this);");
        $("#chkService_acctUsageColl").attr("onclick", "pToggleCheckbox(this);showCollectionsSection(this,'frmMain');");
        $("#chkService_acctUsageForecast").attr("onclick", "toggleCheckbox(this);");
        $("#chkService_acctUsageTrade").attr("onclick", "toggleCheckbox(this);");
        $("#chkService_acctUsagePooling").attr("onclick", "toggleCheckbox(this);showLiqSection(this,'frmMain');");
        $("#chkService_othersDefaultChargeAccount,#chkService_othersDefaultGstAccount").attr("onclick", "toggleCheckbox(this);");
        $("#chkService_othersPositivePayImaging").attr("onclick", "toggleCheckbox(this);");
        $("#chkLink_reversePositivePay").attr("onclick", "toggleCheckboxImage(this);");
        $("#chkService_acctUsageLimits").attr("onclick", "toggleCheckbox(this);");
        $("#chkService_othersChargeAccount, #chkService_othersGstAccount").attr("onclick", "toggleCheckbox(this);");
        $("#divBR").hide();
        $("#divLiquidity").hide();
        $("#divPortal").hide();
        $("#divPayment").hide();
        $('#hiddenService_acctUsageBr, #hiddenService_acctUsageSweeping,#hiddenService_acctUsagePay, #hiddenService_acctUsagePooling, #hiddenService_acctUsagePortal, #hiddenService_othersChargeAccount, #hiddenService_othersGstAccount').val('N');
        toggleMT101Services(isSystemBank);
    }
    else
    {
        $('#chkImg_othersDefaultChargeAccount,#chkImg_othersDefaultGstAccount, #imgService_othersPositivePayImaging, #imgService_reversePositivePay, #chkImgPooling, #chkImgFSC, #chkImgCollections, #chkImgForecast, #chkImgTrade, #chkImgLimits, #chkImg_othersChargeAccount, #chkImgSubAccounts').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
        $('#chkService_othersDefaultChargeAccount,#chkService_othersDefaultGstAccount, #chkService_othersPositivePayImaging, #chkLink_reversePositivePay, #chkService_acctUsagePooling, #chkService_acctUsageFSC, #chkService_acctUsageColl, #chkService_acctUsageForecast, #chkService_acctUsageTrade, #chkService_acctUsageLimits, #chkService_othersChargeAccount, #chkService_othersGstAccount, #chkService_acctUsageSubAccounts').removeAttr('onclick');
        $("#divBR").hide();
        $("#divPayment, #divLimits").hide();
       /* $("#divLiquidity").hide();*/
        $("#divCollections").hide();
        $("#divPortal").hide();
        $("#divSubAccounts").hide();
        $('#chkImgBR, #chkImgSweeping, #chkImgPortal').attr('src', 'static/images/icons/icon_unchecked.gif');
        resetBalanceReportingService();
        $('#hiddenService_othersDefaultChargeAccount,#hiddenService_othersDefaultGstAccount, #hiddenService_othersPositivePayImaging,#reversePositivePay , #hiddenService_acctUsageBr, #hiddenService_acctUsageSweeping, #hiddenService_acctUsagePooling, #hiddenService_acctUsageFSC, #hiddenService_acctUsageColl, #hiddenService_acctUsagePortal, #hiddenService_acctUsageForecast, #hiddenService_acctUsageTrade, #hiddenService_acctUsageLimits, #hiddenService_othersChargeAccount, #hiddenService_othersGstAccount').val('N');

        if(mt101Applicable === "true"){
            $('#chkImgPayments').attr('src', 'static/images/icons/icon_unchecked.gif');
        }
        else{
                $('#chkImgPayments').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
                $('#chkService_acctUsagePay').removeAttr('onclick');
                $('#hiddenService_acctUsagePay').val('N');
        }
        toggleMT101Services(isSystemBank);
    }
}
function provideBankBasedAccountUsageOptionsForEditMode() {
    var isSystemBank = document.getElementById("hiddenService_systemBankFlag").value ;
    if (isSystemBank == "Y") {
    	virtualAccountCheck();
        $('#chkImg_othersDefaultChargeAccount,#chkImg_othersDefaultGstAccount, #imgService_othersPositivePayImaging, #imgService_reversePositivePay, #chkImgPayments, #chkImgFSC, #chkImgCollections, #chkImgForecast, #chkImgTrade, #chkImgBR, #chkImgSweeping, #chkImgPooling, #chkImgPortal, #chkImgLimits, #chkImg_othersChargeAccount')
                .attr('src', 'static/images/icons/icon_unchecked.gif');
        $("#chkService_acctUsagePay").attr("onclick",
                "pToggleCheckbox(this);showPaymentSection(this,'frmMain');");
        $("#chkService_acctUsageFSC, #chkService_othersChargeAccount, #chkService_othersGstAccount").attr("onclick", "toggleCheckbox(this);");
        $("#chkService_acctUsageColl")
                .attr("onclick",
                        "pToggleCheckbox(this);showCollectionsSection(this,'frmMain');");
        $("#chkService_acctUsageForecast").attr("onclick",
                "toggleCheckbox(this);");
        $("#chkService_acctUsageTrade")
                .attr("onclick", "toggleCheckbox(this);");
        $("#chkService_othersDefaultChargeAccount,#chkService_othersDefaultGstAccount").attr("onclick",
                "toggleCheckbox(this);");
        $("#chkService_othersPositivePayImaging").attr("onclick", "toggleCheckbox(this);");
        $("#chkLink_reversePositivePay").attr("onclick", "toggleCheckboxImage(this);");
        $("#chkService_acctUsagePooling").attr("onclick",
                "toggleCheckbox(this);showLiqSection(this,'frmMain');");
        $("#chkService_acctUsageLimits").attr("onclick",
                "toggleCheckbox(this);");
        $("#divBR").hide();
        $("#divLiquidity").hide();
        $("#divPayment").hide();
        $("#divPortal").hide();
        toggleMT101Services(isSystemBank);
    } else {
        $('#chkImg_othersDefaultChargeAccount,#chkImg_othersDefaultGstAccount, #imgService_othersPositivePayImaging, #imgService_reversePositivePay, #chkImgPooling, #chkImgFSC, #chkImgCollections, #chkImgForecast, #chkImgTrade, #chkImgLimits, #chkImg_othersChargeAccount, #chkImgSubAccounts')
                .attr('src', 'static/images/icons/icon_unchecked_grey.gif');
        $('#chkService_othersDefaultChargeAccount,#chkService_othersDefaultGstAccount,#chkService_othersPositivePayImaging, #chkLink_reversePositivePay, #chkService_acctUsageFSC, #chkService_acctUsageColl, #chkService_acctUsageForecast, #chkService_acctUsageTrade, #chkService_acctUsagePooling,#chkService_acctUsageLimits, #chkService_othersChargeAccount, #chkService_othersGstAccount, #chkService_acctUsageSubAccounts')
                .removeAttr('onclick');
        $("#divLimits").hide();
       /* $("#divLiquidity").hide();*/
        $("#divCollections").hide();
        $("#divPortal").hide();
        $("#divSubAccounts").hide();
        $('#hiddenService_othersDefaultChargeAccount,#hiddenService_othersDefaultGstAccount,#hiddenService_othersPositivePayImaging,#reversePositivePay , #hiddenService_acctUsagePooling, #hiddenService_acctUsageFSC, #hiddenService_acctUsageColl, #hiddenService_acctUsagePortal, #hiddenService_acctUsageForecast, #hiddenService_acctUsageTrade, #hiddenService_acctUsageLimits, #hiddenService_othersChargeAccount, #hiddenService_acctUsageSubAccounts')
                .val('N');
        if(mt101Applicable === "true"){
            if(mode != "EDIT"){
                $('#chkImgPayments').attr('src', 'static/images/icons/icon_unchecked.gif');
                $('#hiddenService_acctUsagePay').val('N');
            }
        }
        else{
                $('#chkImgPayments').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
                $('#chkService_acctUsagePay').removeAttr('onclick');
                $('#hiddenService_acctUsagePay').val('N');
        }
        toggleMT101Services(isSystemBank);
    }
}
function resetBalanceReportingService(){
    $('#hiddenService_accntIntraDayFlag, #hiddenService_accntPreviousDayFlag,#hiddenService_accntRemittenceText,#hiddenService_othersIncomingWires,#hiddenService_acctUsageDispOnHP,#hiddenService_expandedWiresFlag,#customizeCashPositionFlag,#includeRemittanceInfoFlag').val('N');
    $('#chkImgBRAccountIntraDay,#chkImgBRAccountPrevDay,#imgService_accntRemittenceText,#imgService_othersIncomingWires,#chkImgDispOnHP,#imgService_expandedWiresFlag,#chkCustomizeCashPositionFlag,#chkIncludeRemittanceInfoFlag').attr('src','static/images/icons/icon_unchecked.gif');
    $('input:radio[name="separateFileFlag"]').filter('[value="S"]').attr('checked', true);
    $('input:radio[name="summaryDetailFlag"]').filter('[value="S"]').attr('checked', true);
    $('input:radio[name="cummulativeIncrementalFlag"]').filter('[value="S"]').attr('checked', true);
} 
// Please do not delete or modify below Code unless working on Migration Part
function viewPossibleValues(fieldName,cpfieldName) {
    var strCPClientID = "";
    strCPClientID = document.getElementById("strCPClientID").value;
    $('#'+csrfTokenName).val(tokenValue);
    $.ajax({
        url : "getPossibleCPFieldValues.srvc?$cpFieldName="+ fieldName+"&$strClientId="+strCPClientID,
        headers: objHdrCsrfParams,
        contentType : "application/json",
        type : 'GET',
        data : {},
        success : function(data) {
            showPossibleFieldsPopup(data,cpfieldName);
        }
    });    
}

function showPossibleFieldsPopup(cpdata,fieldName) {
    var mystore = Ext.create('Ext.data.Store',{
      data   : cpdata,
      fields : ['POSSIBLEVALUE']
    });

    var cpgrid = Ext.create('Ext.grid.Panel', {
        itemId: 'possibleFieldsGrid',
        store: mystore,
        loadMask: true,
        width: 400,
        columns: [{
                xtype : 'rownumberer',
                text : '#',
                align : 'center',
                hideable : false,
                sortable : false,
                tdCls : 'xn-grid-cell-padding ',
                width : 30
            },{
                header: fieldName,
                dataIndex: 'POSSIBLEVALUE',
                width: 230,
                flex: 1
        }]
    });
    
    var cpFieldsPanel = Ext.create('Ext.window.Window', {
        //bodyPadding : 5, // Don't want content to crunch against the borders
        title : 'CP Field Values',
        layout : 'hbox',
        overflowY : 'auto',
        modal : true,
        config : {
            layout : 'fit',
            modal : true
        },
        items : [ cpgrid],
        renderTo : Ext.getBody()
    });
    cpFieldsPanel.show();
}

function viewServiceMappingDetails(module,fieldName,relProfileId) {
    var strCPClientID = "";
    var strCPONClientID = "";
    strCPClientID = document.getElementById("strCPClientID").value;
    strCPONClientID = document.getElementById("strCPONClientID").value;
    $('#'+csrfTokenName).val(csrfTokenValue);
    $.ajax({
        url : "getServiceMappingDetails.srvc?$cpFieldName="+ fieldName+"&$strClientId="+strCPClientID+"&$relProfileId="+relProfileId+"&$strModule="+module+"&$strBrClientId="+strCPONClientID,
       headers: objHdrCsrfParams,
        contentType : "application/json",
        type : 'GET',
        data : {},
        success : function(data) {
                showServiceMappingDetailsPopup(data,fieldName);
        }
    });    
}

function showServiceMappingDetailsPopup(cpdata,fieldName) {
    var mystore = Ext.create('Ext.data.Store',{
      data   : cpdata,
      fields : ['DESCRIPTION','CP','GCP']
    });

    var cpgrid = Ext.create('Ext.grid.Panel', {
        itemId: 'possibleFieldsGrid',
        store: mystore,
        loadMask: true,
        width: 440,
        height : 300,
        autoScroll : true,
        overflowY : 'hidden',
        columns: [{
                xtype : 'rownumberer',
                text : '#',
                align : 'center',
                hideable : false,
                sortable : false,
                tdCls : 'xn-grid-cell-padding ',
                width : 50
            },{
                header: 'Description',
                dataIndex: 'DESCRIPTION',
                width: 200,
                flex: 1
        },{
                header: 'CP',
                dataIndex: 'CP',
                width: 40,
                renderer: function(value) {
                        var retVal = value;
                        if(value == 'Y')
                            retVal = '<font color=green>&#x2714;</font>';
                        else if(value == 'N')
                            retVal = '<font color=red>&#x2716;</font>';
                        return retVal;
                }
        },{
                header: 'GCP',
                dataIndex: 'GCP',
                width: 40,
                renderer: function(value) {
                        var retVal = value;
                        if(value == 'Y')
                            retVal = '<font color=green>&#x2714;</font>';
                        else if(value == 'N')
                            retVal = '<font color=red>&#x2716;</font>';
                        return retVal;
                }                
        }]
    });
    
    var cpFieldsPanel = Ext.create('Ext.window.Window', {
        title : 'Mapping Details For '+fieldName,
        layout : 'hbox',
        overflowY : 'auto',
        modal : true,
        config : {
            layout : 'fit',
            modal : true
        },
        items : [ cpgrid],
        renderTo : Ext.getBody()
    });
    cpFieldsPanel.show();
}

jQuery.fn.parentCompanyAutoComplete= function() {
    return this.each(function() {
        $(this).autocomplete({
                    source : function(request, response) {
                        $.ajax({
                                    url : "cpon/clientServiceSetup/parentCompanySeek.json?$company="+$('#corpDesc').val()+"&$sellerCode="+$('#sellerId').val(),
                                    type: "POST",
                                    dataType : "json",
                                    data : {
                                        $autofilter : request.term
                                    },
                                    success : function(data) {
                                        var rec = data;
                                        response($.map(rec, function(item) {
                                                    return {                                                        
                                                        label : item.CLIENT_NAME,                                                        
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
                            if (!isEmpty(data.CLIENT_ID))
                            {
                                $('#corporationName').val(data.CLIENT_ID);
                                $('#corpDesc').val(data.CLIENT_NAME);
                                
                                enableCopyClientParam();
                                getGlobalParamsDetails() ;
                            // following if statement to set activation and billing date of corporation to underline subsidiary. 
                            // this will run only in case of clientType is Subsidiary        
                                var clientType = document.getElementById( "clientType" );
                            //commenting for JIRA :- FTMNTBANK-3254
                                /*if( clientType && clientType.value == 'S' )
                                {
                                    var dtActivationDate = data.ACTIVATION_DATE;
                                    var minDate = new Date(dtActivationDate);
                                    
                                    $('#activationDate').datepicker( "option", "minDate", minDate);
                                    $('#activationDate').val(dtActivationDate);
                                    
                                    $('#billingStartDate').datepicker( "option", "minDate", minDate);
                                    $('#billingStartDate').val(dtActivationDate);
                                                                                                                                                
                                }*/
                                                                
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
jQuery.fn.validateZipcode = function() {
	return this.each(function() {
		$(this).keydown(function(event) {
			var prevKey = -1, prevControl = '';
			var keynum;
			
			if (window.event) { // IE
				keynum = event.keyCode;
			}
			if (event.which) { // Netscape/Firefox/Opera
				keynum = event.which;
			}
			if((keynum == 86 ) && event.ctrlKey)
			{
				$(this).on('input', function(eventObj) {
					$(eventObj.target).val($(eventObj.target).val().replace(/[^0-9]/g, ''));
				});
				return true ;
			}
			if((keynum == 67 ) && event.ctrlKey)
			{
				return true ;
			}
			if ((event.shiftKey )&&( keynum == 35 ||  keynum == 36 ||keynum == 37 || keynum == 39 || keynum == 9)) {
				return true;
			}
			else if(event.shiftKey){
				return false;
			}
			return ((keynum == 8 || keynum == 9 || keynum == 17 || keynum == 46
					|| (keynum >= 35 && keynum <= 40)
					|| (keynum >= 48 && keynum <= 57)
					|| (keynum >= 96 && keynum <= 105) || (keynum == 65
					&& prevKey == 17 && prevControl == event.currentTarget.id)));
		})
	})
};
// End
function getOldNewValueClass(profileFieldType) {
    if (profileFieldType == 'MODIFIED')
        return "modifiedFieldValue ";
    else if (profileFieldType == 'NEW')
        return "newFieldValue ";
    else if (profileFieldType == 'DELETED')
        return "deletedFieldValue ";
}

function getReportClientSetupDetail(strClientId){
    var form = document.createElement('FORM');
    var strUrl = "services/reportClientSetupDetail.pdf";
    form.name = 'frmMain';
    form.id = 'frmMain';
    form.method = 'POST';
    form.appendChild(createFormField('INPUT', 'HIDDEN',
            csrfTokenName, tokenValue));
    form.appendChild(createFormField('INPUT', 'HIDDEN',
            'strClientId', strClientId));
    form.action = strUrl;
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

function setServiceCheckUnchek(serviceID, imgID, isDisabled)
{
    var flagValue = $('#'+serviceID).val();
    if(flagValue=='Y')
    {
        if(isDisabled)
        {
            $('#'+imgID).attr('src','static/images/icons/icon_checked_grey.gif');
            $('#'+imgID).removeAttr("onclick");
        }    
        else
        {
            $('#'+imgID).attr('src','static/images/icons/icon_checked.gif');
			if ('hiddenService_PAYOUT' == serviceID){
				$('#chkinternalCustEnable').attr('src','static/images/icons/icon_unchecked_grey.gif');
				$('#chkinternalCustEnable').removeAttr("onclick");
				$('#chkpayoutCustEnable').attr("onclick","toggleCheckUncheckPayoutOrInternal(this,'hiddenService_PAYOUT');setDirtyBit();");
			}
			if ('hiddenService_INTERNALCLIENT' == serviceID){
				$('#chkpayoutCustEnable').attr('src','static/images/icons/icon_unchecked_grey.gif');
				$('#chkpayoutCustEnable').removeAttr("onclick");
				$('#chkinternalCustEnable').attr("onclick","toggleCheckUncheckPayoutOrInternal(this,'hiddenService_INTERNALCLIENT');setDirtyBit();");
			}
			if ('hiddenService_RETAILCUST' == serviceID){
				$('#chkcreditCardClient').attr('src','static/images/icons/icon_unchecked_grey.gif');
				$('#chkcreditCardClient').removeAttr("onclick");
				$('#chkretailCustomer').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_RETAILCUST');setDirtyBit();");
			}
			if ('hiddenService_CREDITCARD' == serviceID){
				$('#chkretailCustomer').attr('src','static/images/icons/icon_unchecked_grey.gif');
				$('#chkretailCustomer').removeAttr("onclick");
				$('#chkcreditCardClient').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_CREDITCARD');setDirtyBit();");
			}
			if ('hiddenService_CLIENTISFI' == serviceID){
				$('#chkclientIsFi').attr('src','static/images/icons/icon_unchecked_grey.gif');
				$('#chkclientIsFi').removeAttr("onclick");
				$('#chkclientIsFi').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_CLIENTISFI');setDirtyBit();");
			}
        }
    }
    else
    {
        if(isDisabled)
        {
            $('#'+imgID).attr('src','static/images/icons/icon_unchecked_grey.gif');
            $('#'+imgID).removeAttr("onclick");
        }
        else
        {
            $('#'+imgID).attr('src','static/images/icons/icon_unchecked.gif');
            if ('hiddenService_PAYOUT' == serviceID){
				if($('#hiddenService_INTERNALCLIENT').val() == 'Y')
				{
					$('#'+imgID).attr('src','static/images/icons/icon_unchecked_grey.gif');
					$('#'+imgID).removeAttr("onclick");
				}
				else
				{
					$('#chkpayoutCustEnable').attr("onclick","toggleCheckUncheckPayoutOrInternal(this,'hiddenService_PAYOUT');setDirtyBit();");
				}
			}
			if ('hiddenService_INTERNALCLIENT' == serviceID){
				if($('#hiddenService_PAYOUT').val() == 'Y')
				{
					$('#'+imgID).attr('src','static/images/icons/icon_unchecked_grey.gif');
					$('#'+imgID).removeAttr("onclick");
				}
				else
				{
					$('#chkinternalCustEnable').attr("onclick","toggleCheckUncheckPayoutOrInternal(this,'hiddenService_INTERNALCLIENT');setDirtyBit();");
				}
			}
			if ('hiddenService_CREDITCARD' == serviceID){
				if($('#hiddenService_RETAILCUST').val() == 'Y')
				{
					$('#'+imgID).attr('src','static/images/icons/icon_unchecked_grey.gif');
					$('#'+imgID).removeAttr("onclick");
				}
				else
				{
					$('#chkcreditCardClient').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_CREDITCARD');setDirtyBit();");
				}
			}
			if ('hiddenService_RETAILCUST' == serviceID){
				if($('#hiddenService_CREDITCARD').val() == 'Y')
				{
					$('#'+imgID).attr('src','static/images/icons/icon_unchecked_grey.gif');
					$('#'+imgID).removeAttr("onclick");
				}
				else
				{
					$('#chkretailCustomer').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_RETAILCUST');setDirtyBit();");
				}
			}
			if ('hiddenService_CLIENTISFI' == serviceID){
				if($('#hiddenService_RETAILCUST').val() == 'Y')
				{
					$('#'+imgID).attr('src','static/images/icons/icon_unchecked_grey.gif');
					$('#'+imgID).removeAttr("onclick");
				}
				else
				{
					$('#chkclientIsFi').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_CLIENTISFI');setDirtyBit();");
				}
			}
        }        
    }    
}

function setServiceCheckBoxes(isAuthorized,serviceID,imgID,clientType,subDisabled)
{
        if(clientType == 'S' && subDisabled)
        {
            setServiceCheckUnchek(serviceID,imgID,true);
        }
        else
        {
            
            if(isAuthorized && null!=serviceMap && serviceMap[serviceID] == 'Y' )
            {
                setServiceCheckUnchek(serviceID,imgID,true);
            }
            else
            {
                setServiceCheckUnchek(serviceID,imgID,false);
            }
        }
}
function setCustomServiceCheckBox(serviceId,imgId,clientType){
    setServiceCheckUnchek(serviceId,imgId,false);    
}

function createFormField(element, type, name, value) {
    var inputField;
    inputField = document.createElement(element);
    inputField.type = type;
    inputField.name = name;
    inputField.value = value;
    return inputField;
}
function enableDisableMobileServices(element,isAuthorized){
    var image = element.getElementsByTagName("IMG")[0];
    var elementId = element.getAttribute("id").replace("chkService_", ""),
        imgId = null,eleId = null,
        clientType = $('#clientType').val();    
    if (undefined != image){
        switch(elementId){
            case '01': //Balance Reporting
                imgId = 'MobileBtr';
                eleId = "MOBILE_BTR";
                break;
            case '02': //Payments
                imgId = 'MobilePay';
                eleId = "MOBILE_PAY";
                break;
            case '13': //Positive Pay
                imgId = 'MobilePp';
                eleId = "MOBILE_PP";
                break;
            case '20': //Mobile Banking
            //    toggleMobileBankingCheckboxServices(image, element, clientType, elementId, isAuthorized);
                break;
        }        
        enableDisableMobileChkBoxServices(image, imgId, eleId, clientType, elementId, isAuthorized);
    }
}
function toggleMobileCheckboxServices(elem,isAuthorized) {
    var image = elem.getElementsByTagName("IMG")[0];
    var elementId = elem.getAttribute("id").replace("mobileService_", "");    
    if (undefined != image)        
    if (image.src.indexOf("icon_checked.gif") == -1) {        
        if(true === isAuthorized)
        {
            image.src = "static/images/icons/icon_checked_grey.gif";
        }
        else
        {
            image.src = "static/images/icons/icon_checked.gif";
        }    
        document.getElementById("hiddenService_" + elementId).value = "Y";
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        if(true === isAuthorized)
        {
            image.src = "static/images/icons/icon_unchecked_grey.gif";
        }
        else
        {
            image.src = "static/images/icons/icon_unchecked.gif";
        }
        getRemoveSerivecConfimationPopupCorp(image,getModuleLabel(elementId,' '),'frmMain',$('#clientType').val());
        document.getElementById("hiddenService_" + elementId).value = "N";
    }
    
}
function setCustomServiceCheckBox(serviceId,imgId,clientType){
    setServiceCheckUnchek(serviceId,imgId,false);    
}

function processAdditionalInfoJsonBase( additional_info, mode )
{
    //console.log( 'Inside ProcessAdditionalInfoJsonBase : ' + mode );
    if( additional_info == null || additional_info == '' )
        return false;
    for( index = 0 ; index < additional_info.length ; index++ )
    {
        var columnid = additional_info[ index ].javaName;
        var nonMandatoryCss = 'toplabel frmLabel';
        var mandatoryCss = 'toplabel required-lbl-right frmLabel';
        var label = document.querySelector( 'label[for=' + columnid + ']' );
        
        if( label )
        {
            label.textContent = getLabel( additional_info[ index ].javaName, additional_info[ index ].displayName ) ;

            if(additional_info[ index ].tableName != null && additional_info[ index ].tableName != 'CPON_ACCOUNT_MST'
                && 'systemBank' != additional_info[ index ].javaName)
            {    if( additional_info[ index ].mandatory == true )
                    label.className = mandatoryCss;
                else
                    label.className = nonMandatoryCss;
            }        
        }
        var inputTxtField = $( '#' + columnid );
        if(additional_info[ index ].tableName != null && ( additional_info[ index ].tableName != 'CPON_ACCOUNT_MST'
            && 'systemBank' != additional_info[ index ].javaName && !brndngPkgvar || additional_info[ index ].isBase=='E'))
            {
                if( additional_info[ index ].readOnly == true || mode == 'VIEW' )
                {
                    inputTxtField.prop( 'readonly', true );
                    inputTxtField.addClass( 'disabled' );
                    inputTxtField.attr( "disabled", true );
                }
                else
                    inputTxtField.prop( 'readonly', false );
            }
    }
}// processAdditionalInfoJsonBase

function addEmptyRow(referenceTbl)
{
    for (var i = 0; i < 1; i++) {
        var row = $('<tr></tr>').attr({ 'class': ["class1", "class2", "class3"].join(' ') }).appendTo(referenceTbl);
        for (var j = 0; j < 2; j++) {
            $('<td></td>').prepend("&nbsp;").appendTo(row); 
        }
    }
}// END : addEmptyRow

function processAdditionalInfoJson( additional_info, mode)
{
    //console.log( 'Inside processAdditionalInfoJson : ' + mode );

    var rowForTxt;
    var rowForLabel;
    var oldSection = 'X';
    var fieldPerRowCounter = 0;
    var strSection;
    var table;
    var tdForField;
    var tdForLabel;
    var columnid;

    if( additional_info == null || additional_info == '' )
    {
        return false;
    }

    for( index = 0 ; index < additional_info.length ; index++ )
    {
        strSection = additional_info[ index ].displaySection;
        table = $( '#' + strSection );
        tdForField = $( "<td>" );
        tdForLabel = $( "<td>" );
        columnid = additional_info[ index ].javaName;

        if( strSection != oldSection || fieldPerRowCounter > 2 )
        {
            rowForTxt = $( "<tr id = " + columnid + "_" + additional_info[ index ].displaySequence + ">" );
            rowForLabel = $( "<tr id = " + columnid + "lblRow" + index + ">" );
            fieldPerRowCounter = 0;
            if(additional_info[ index ].tableName != null && additional_info[ index ].tableName == 'CPON_ACCOUNT_MST' )
            addEmptyRow(table);

        }
        oldSection = strSection;
        fieldPerRowCounter++;

        tdForLabel.attr(
        {
            'id' : 'tdlbl' + columnid
        } );

        tdForLabel.addClass( ' leftAlign ' );
        
        if(additional_info[ index ].tableName != null && additional_info[ index ].tableName != 'CPON_ACCOUNT_MST' )
            tdForLabel.addClass( " ux_extralargepadding-top col_1_3 " );
        //console.log('Table Name : '+additional_info[ index ].tableName);
        tdForField.attr(
        {
            'id' : 'td_' + columnid
        } );

        tdForField.addClass( ' leftAlign ' );
        
        if(additional_info[ index ].tableName != null && additional_info[ index ].tableName != 'CPON_ACCOUNT_MST' )
            tdForField.addClass( ' col_1_3 ' );

        if( strSection == 'tbl_contactInfoDiv' || strSection == 'tbl_billingInfoDiv' || strSection == 'tbl_clientInfo' || strSection == 'tbl_ClientMoreDetails' )
        {
            if( mode != 'VERIFY_SUBMIT' && strSection != 'tbl_clientInfo' && strSection != 'tbl_ClientMoreDetails' )
            {
                tdForField.addClass( ' nofloating ' );
                tdForLabel.addClass( ' nofloating ' );
            }
            
            if( ( mode == 'VIEW' || mode == 'MODIFIEDVIEW' ) && ( strSection == 'tbl_clientInfo' || strSection == 'tbl_ClientMoreDetails' ) )
            {
                tdForField.addClass( ' nofloating ' );
                tdForLabel.addClass( ' nofloating ' );
            }
            
            if( ( mode == 'VIEW' || mode == 'MODIFIEDVIEW' ) && strSection != 'tbl_clientInfo' && strSection != 'tbl_ClientMoreDetails' )
            {
                tdForField.addClass( ' topAlign ' );
                tdForLabel.addClass( ' topAlign ' );
            }
            
        }

        renderLabel( additional_info[ index ], rowForLabel, tdForLabel, mode );
        
        if( additional_info[ index ].dataType == 'text' )
        {
            renderText( additional_info[ index ], rowForTxt, tdForField, mode );
        }
        else if( additional_info[ index ].dataType == 'select' )
        {
            renderSelect( additional_info[ index ], rowForTxt, tdForField, mode );
        }
        else if( additional_info[ index ].dataType == 'date' )
        {
            renderDateField( additional_info[ index ], rowForTxt, tdForField, mode );
        }
        else if( additional_info[ index ].dataType == 'Checkbox' )
        {
            renderCheckbox( additional_info[ index ], rowForTxt, tdForField, mode, columnid );
        }        
        else if( additional_info[ index ].dataType == 'Number' || additional_info[ index ].dataType == 'number' )
        {
            renderNumberField( additional_info[ index ], rowForTxt, tdForField, mode );
        }
		else if( additional_info[ index ].dataType == 'time' ) 
		{
			renderTimeField( additional_info[ index ], rowForTxt, tdForField, mode );
		}
        
        if(additional_info[ index ].dataType != 'Checkbox')
        {
        	rowForLabel.appendTo( table );
        }
        rowForTxt.appendTo( table );
    }
    return true;
}// processAdditionalInfoJson

//Start Time Extension 
function renderTimeField( additionalInfoField, rowForTxt, tdForField, mode ) {
	var fieldCss = 'w4 rounded'; 
	
	var input = $( '<input>' ).attr({
        'type' : 'hidden',
        'id' : additionalInfoField.javaName,
        'name' : additionalInfoField.javaName
    } );
	var inputHH = $( '<select>' ).attr({
        'id' : additionalInfoField.javaName+"HH",
        'name' : additionalInfoField.javaName+"HH"
    } ).addClass( fieldCss );
	var inputMM = $( '<select>' ).attr({
        'id' : additionalInfoField.javaName+"MM",
        'name' : additionalInfoField.javaName+"MM"
    } ).addClass( fieldCss );
	var inputSS = $( '<select>' ).attr({
        'id' : additionalInfoField.javaName+"SS",
        'name' : additionalInfoField.javaName+"SS"
    } ).addClass( fieldCss );
	
	var valHH ;
	for(i=0;i<=23;i++) {
		if(i<10) valHH = '0'+i;
		else 	 valHH = i;
        inputHH.append( $( "<option>" ).attr( 'value', valHH ).text( valHH ) );
    }
	var valMS ;
	for(i=0;i<=59;i++) {
		if(i<10) valMS = '0'+i;
		else 	 valMS = i;
        inputMM.append( $( "<option>" ).attr( 'value', valMS ).text( valMS ) );
		inputSS.append( $( "<option>" ).attr( 'value', valMS ).text( valMS ) );
    }
	
	inputHH.bind('change', function() { setAdditionalFieldTimeValue(additionalInfoField.javaName); });
	inputMM.bind('change', function() { setAdditionalFieldTimeValue(additionalInfoField.javaName); });
	inputSS.bind('change', function() { setAdditionalFieldTimeValue(additionalInfoField.javaName); });
	
    if( additionalInfoField.readOnly == true || ( mode == 'VIEW' || mode == 'VERIFY_SUBMIT' || mode == 'MODIFIEDVIEW' ) ) {
        inputHH.prop( 'readonly', true );
        inputHH.addClass( 'disabled' );
        inputHH.attr( "disabled", true );

		inputMM.prop( 'readonly', true );
        inputMM.addClass( 'disabled' );
        inputMM.attr( "disabled", true );
		
		inputSS.prop( 'readonly', true );
        inputSS.addClass( 'disabled' );
        inputSS.attr( "disabled", true );
    }
    if( additionalInfoField.value !== null ) {
		inputHH.val( (additionalInfoField.value).substring(0,2) );
		inputMM.val( (additionalInfoField.value).substring(2,4) );
		inputSS.val( (additionalInfoField.value).substring(4,6) );
		
		input.val(additionalInfoField.value);
    }
    else if( additionalInfoField.defaultValue !== null && ( additionalInfoField.readOnly == true || mode == 'ADD' ) ){
		inputHH.val( (additionalInfoField.defaultValue).substring(0,2) );
		inputMM.val( (additionalInfoField.defaultValue).substring(2,4) );
		inputSS.val( (additionalInfoField.defaultValue).substring(4,6) );
		
		input.val(additionalInfoField.defaultValue);
    }
    if( mode == 'MODIFIEDVIEW' ) {
		if( modifiedList && modifiedList !== '' ) {
            if( modifiedList.indexOf( additionalInfoField.javaName + '=' ) != -1 ) {
                inputHH.addClass( 'modifiedFieldValue' );
				inputMM.addClass( 'modifiedFieldValue' );
				inputSS.addClass( 'modifiedFieldValue' );
            }
        }
        if( newList && newList !== '' ){
            if( newList.indexOf( additionalInfoField.javaName + '=' ) != -1 ) {
                inputHH.addClass( 'newFieldValue' );
				inputMM.addClass( 'newFieldValue' );
				inputSS.addClass( 'newFieldValue' );
            }
        }
        if( deletedList && deletedList !== '' ) {
            if( deletedList.indexOf( additionalInfoField.javaName + '=' ) != -1 ){
                inputHH.addClass( 'deletedFieldValue' );
				inputMM.addClass( 'deletedFieldValue' );
				inputSS.addClass( 'deletedFieldValue' );
            }
        }
        if( oldValuesList && oldValuesList != '' ){
            if( oldValuesList.indexOf( additionalInfoField.javaName + '=' ) != -1 ){
                inputHH.attr( 'title', oldValuesListMapArray[ "" + additionalInfoField.javaName+"HH" + "" ] );
				inputMM.attr( 'title', oldValuesListMapArray[ "" + additionalInfoField.javaName+"MM" + "" ] );
				inputSS.attr( 'title', oldValuesListMapArray[ "" + additionalInfoField.javaName+"SS" + "" ] );
            }
        }
    }
	
	var label = $( "<label class = 'frmLabel'>" ).html( "&nbsp;:&nbsp;" );
	var label1 = $( "<label class = 'frmLabel'>" ).html( "&nbsp;:&nbsp;" );
	inputHH.appendTo(tdForField);
	label.appendTo(tdForField);
	inputMM.appendTo(tdForField);
	label1.appendTo(tdForField);
	inputSS.appendTo(tdForField);
	
	input.appendTo(tdForField);
	
    tdForField.appendTo( rowForTxt );
}// renderTimeField

function setAdditionalFieldTimeValue(fieldJavaName){
	$("#"+fieldJavaName).val( $("#"+fieldJavaName+"HH").val()+$("#"+fieldJavaName+"MM").val()+$("#"+fieldJavaName+"SS").val());
}
//End Time Extension 

function renderText( additionalInfoField, rowForTxt, tdForField, mode )
{
    var fieldCss = 'w14_8 rounded ux_no-margin';
    var input = $( '<input>' ).attr(
    {
        'type' : 'text',
        'id' : additionalInfoField.javaName,
        'name' : additionalInfoField.javaName
    } ).addClass( fieldCss );

    if( additionalInfoField.readOnly == true || ( mode == 'VIEW' || mode == 'VERIFY_SUBMIT' || mode == 'MODIFIEDVIEW' ) )
    {
        input.prop( 'readonly', true );
        input.addClass( 'disabled' );
        input.attr( "disabled", true );
    }

    input.attr( 'maxlength', additionalInfoField.maxLength );

    if( additionalInfoField.value !== null )
    {
        input.val( additionalInfoField.value );
    }
    else if( additionalInfoField.defaultValue !== null && ( additionalInfoField.readOnly == true || mode == 'ADD' ) )
    {
        input.val( additionalInfoField.defaultValue );
    }
    
    if( mode == 'MODIFIEDVIEW' )
    {
        if( modifiedList && modifiedList !== '' )
        {
            if( modifiedList.indexOf( additionalInfoField.javaName + '=' ) != -1 )
            {
                input.addClass( 'modifiedFieldValue' );
            }
        }
        if( newList && newList !== '' )
        {
            if( newList.indexOf( additionalInfoField.javaName + '=' ) != -1 )
            {
                input.addClass( 'newFieldValue' );
            }
        }
        if( deletedList && deletedList !== '' )
        {
            if( deletedList.indexOf( additionalInfoField.javaName + '=' ) != -1 )
            {
                input.addClass( 'deletedFieldValue' );
            }
        }
        if( oldValuesList && oldValuesList != '' )
        {
            if( oldValuesList.indexOf( additionalInfoField.javaName + '=' ) != -1 )
            {
                input.attr( 'title', oldValuesListMapArray[ "" + additionalInfoField.javaName + "" ] );
            }
        }
    }

    input.appendTo( tdForField );
    tdForField.appendTo( rowForTxt );
}// renderText

function renderLabel( additionalInfoField, rowForLabel, tdForLabel, mode )
{
    var labelCss = 'required-lbl-right';
    var label = $( "<label class = 'frmLabel'>" ).attr(
    {
        'for' : "lbl" + additionalInfoField.javaName
    } ).html( getLabel( additionalInfoField.javaName, additionalInfoField.displayName ) );

    var labelCheckbox = $( "<label class = 'ux_extralargepadding-top col_1_3'>" ).attr(
    {
    	'for' : "lbl" + additionalInfoField.javaName
    } );
    
    if(additionalInfoField.mandatory == true  && (( additionalInfoField.tableName != 'CPON_ACCOUNT_MST' ) 
        || (mode == 'ADD' && additionalInfoField.tableName != null && additionalInfoField.tableName == 'CPON_ACCOUNT_MST') )) 
    {
        label.addClass( labelCss );
    }

    if( mode == 'VIEW' )
        label.addClass( ' toplabel ' );
   
    if( additionalInfoField.dataType == 'Checkbox' )
    {
    	labelCheckbox.appendTo( tdForLabel );
    }
    else
    {
    	label.appendTo( tdForLabel );
    }
    tdForLabel.appendTo( rowForLabel );
}// renderLabel

function renderSelect( additionalInfoField, rowForTxt, tdForField, mode )
{
    var fieldCss = 'w15_7 rounded';
    var input = $( '<select>' ).attr(
    {
        'id' : additionalInfoField.javaName,
        'name' : additionalInfoField.javaName
    } ).addClass( fieldCss );

    $( additionalInfoField.lov ).each( function()
    {
        input.append( $( "<option>" ).attr( 'value', this.key ).text( this.value ) );
    } );

    if( additionalInfoField.value !== null )
    {
        input.val( additionalInfoField.value );
    }
    else if( additionalInfoField.defaultValue !== null && ( additionalInfoField.readOnly == true || mode == 'ADD' ) )
    {
        input.val( additionalInfoField.defaultValue );
    }
    if( additionalInfoField.readOnly == true || ( mode == 'VIEW' || mode == 'VERIFY_SUBMIT' || mode == 'MODIFIEDVIEW' ) )
    {
        input.attr( "disabled", true );
        input.prop( 'readonly', true );
        input.addClass( 'disabled' );
    }
    input.appendTo( tdForField );
    tdForField.appendTo( rowForTxt );
}// renderSelect

function renderCheckbox( additionalInfoField, rowForTxt, tdForField, mode, columnid )
{
    var fieldCss = 'w14_8 rounded ux_no-margin';
    var viewMode = false;
    var labelCss = 'required-lbl-right';
    var input = $( '<input>' ).attr(
    {
        'type' : 'hidden',
        'id' : additionalInfoField.javaName,
        'name' : additionalInfoField.javaName
    } ).addClass( fieldCss );
	var imgInput = $('<img>').attr({
		'id' : 'img_' + additionalInfoField.javaName,
		'width' : '14',
		'border' : '0',
		'onclick' : 'checkUncheckCponConfigFields(this,'+'"'+additionalInfoField.javaName+'"'+');setDirtyBit();'
	});	
    var label = $( "<label class = 'middleAlign'>" ).attr(
    	{
    	     'for' : "lbl" + additionalInfoField.javaName
    	} ).html( getLabel( additionalInfoField.javaName, additionalInfoField.displayName ) );
    var impSpace = $('<a>&nbsp;&nbsp;&nbsp;</a>');
    
    if(additionalInfoField.defaultValue == null)
    	additionalInfoField.defaultValue = "N";
    if( additionalInfoField.value !== null )
    {
        input.val( additionalInfoField.value );
        setCheckUncheckCponConfigFields(imgInput,additionalInfoField.value,viewMode);
    }
    else
    {
        input.val( additionalInfoField.defaultValue );
        additionalInfoField.value = additionalInfoField.defaultValue;
        setCheckUncheckCponConfigFields(imgInput,additionalInfoField.defaultValue,viewMode);
    }
    
    if( additionalInfoField.readOnly == true || ( mode == 'VIEW' || mode == 'VERIFY_SUBMIT' || mode == 'MODIFIEDVIEW' ) )
    {
    	viewMode = true;
    	imgInput.prop( 'readonly', true );
    	setCheckUncheckCponConfigFields(imgInput,additionalInfoField.value,viewMode )
    	imgInput.removeAttr("onclick");
    }
    
    if( mode == 'VIEW' )
    	label.addClass( ' toplabel ' );
    
    if(additionalInfoField.mandatory == true  && mode == 'ADD' && additionalInfoField.readOnly == false ) 
        {
            label.addClass( labelCss );
        }

    imgInput.appendTo( tdForField );
    impSpace.appendTo( tdForField );
    label.appendTo( tdForField );
    input.appendTo( tdForField );
    tdForField.appendTo( rowForTxt );
}//renderCheckbox

function renderDateField( additionalInfoField, rowForTxt, tdForField, mode )
{
    var fieldClass = 'w14_8 rounded ux_no-margin hasDatepicker';
    
    var input = $( '<input>' ).attr(
    {
        'type' : 'text',
        'id' : additionalInfoField.javaName,
        'name' : additionalInfoField.javaName
    } ).datepicker(
    {
        dateFormat : jqueryDateFormat,
        defaultDate : additional_info_appldate,
        appendText : jqueryDateFormat
    } ).datepicker( 'setDate', additional_info_appldate ).addClass( fieldClass );

    
    if( additionalInfoField.readOnly == true || ( mode == 'VIEW' || mode == 'VERIFY_SUBMIT' || mode == 'MODIFIEDVIEW' ) )
    {
        input.prop( 'readonly', true );
        input.attr( "disabled", true );
        input.addClass( 'disabled' );
    }

    if( additionalInfoField.value !== null )
    {
        input.val( additionalInfoField.value );
    }
    else if( additionalInfoField.defaultValue !== null && ( additionalInfoField.readOnly == true || mode == 'ADD' ) )
    {
        var parsedValueDate = $.datepicker.parseDate( jqueryDateFormat, additionalInfoField.defaultValue );
        var formatedDate = $.datepicker.formatDate( jqueryDateFormat, parsedValueDate );
        input.datepicker(
        {
            defaultDate : formatedDate
        } );
    }
    input.appendTo( tdForField );
    tdForField.appendTo( rowForTxt );
}// renderDateField

function renderNumberField( additionalInfoField, rowForTxt, tdForField, mode )
{
    var fieldCss = 'w14_8 rounded ux_no-margin';
    var input = $( '<input>' ).attr(
    {
        'type' : 'text',
        'id' : additionalInfoField.javaName,
        'name' : additionalInfoField.javaName
    } ).addClass( fieldCss );

    if( additionalInfoField.readOnly == true || ( mode == 'VIEW' || mode == 'VERIFY_SUBMIT' || mode == 'MODIFIEDVIEW' ) )
    {
        input.prop( 'readonly', true );
        input.addClass( 'disabled' );
        input.attr( "disabled", true );
    }

    input.attr( 'maxlength', additionalInfoField.maxLength );

    if( additionalInfoField.value !== null )
    {
        input.val( additionalInfoField.value );
    }
    else if( additionalInfoField.defaultValue !== null && ( additionalInfoField.readOnly == true || mode == 'ADD' ) )
    {
        input.val( additionalInfoField.defaultValue );
    }
    
    if( mode == 'MODIFIEDVIEW' )
    {
        if( modifiedList && modifiedList !== '' )
        {
            if( modifiedList.indexOf( additionalInfoField.javaName + '=' ) != -1 )
            {
                input.addClass( 'modifiedFieldValue' );
            }
        }
        if( newList && newList !== '' )
        {
            if( newList.indexOf( additionalInfoField.javaName + '=' ) != -1 )
            {
                input.addClass( 'newFieldValue' );
            }
        }
        if( deletedList && deletedList !== '' )
        {
            if( deletedList.indexOf( additionalInfoField.javaName + '=' ) != -1 )
            {
                input.addClass( 'deletedFieldValue' );
            }
        }
        if( oldValuesList && oldValuesList != '' )
        {
            if( oldValuesList.indexOf( additionalInfoField.javaName + '=' ) != -1 )
            {
                input.attr( 'title', oldValuesListMapArray[ "" + additionalInfoField.javaName + "" ] );
            }
        }
    }

    input.OnlyNumbers();
    input.appendTo( tdForField );
    tdForField.appendTo( rowForTxt );
}// renderNumberField

function setPromoBillingCheckBox(serviceId,imgId){
    setServiceCheckUnchek(serviceId,imgId,false);
    setPromoBillingFields(serviceId,imgId);
}

function togglePromotionalBillingCheck(element)
{
    var imageList = $(element).find('IMG');
    var strAppDate = dtApplicationDate;
    var promoBillingFlag = $("#promotionalBilling").val();
    if ("N" === promoBillingFlag)
    {
        imageList[0].src = "static/images/icons/icon_checked.gif";
        $("#promotionalBilling").val("Y");
        
        $("#lblPromoBillingStartDate").addClass("required-lbl-right");
        $("#promoBillingStartDate").removeAttr("disabled");
        $("#promoBillingStartDate").val(strAppDate);
        
        $("#lblPromoBillingEndDate").addClass("required-lbl-right");
        $("#promoBillingEndDate").removeAttr("disabled");
        $("#promoBillingEndDate").val(strAppDate);
        
        $("#lblPromoBillingDiscount").addClass("required-lbl-right");
        $("#promoBillingDiscount").removeAttr("disabled");
    } 
    else
    {
        imageList[0].src = "static/images/icons/icon_unchecked.gif";
        document.getElementById("promotionalBilling").value = "N";
        $("#promotionalBilling").val("N");
        
        $("#lblPromoBillingStartDate").removeClass("required-lbl-right");
        $("#promoBillingStartDate").val("");
        $('#promoBillingStartDate').attr("disabled", "true");
        
        $("#lblPromoBillingEndDate").removeClass("required-lbl-right");
        $("#promoBillingEndDate").val("");
        $('#promoBillingEndDate').attr("disabled", "true");
        
        $("#lblPromoBillingDiscount").removeClass("required-lbl-right");
        $("#promoBillingDiscount").attr("disabled", "true");
        $("#promoBillingDiscount").val("");
    }
    promoBillingFlag = $("#promotionalBilling").val();
}

function setPromoBillingFields(serviceId,imgID)
{
    var promoBillingFlag = $('#'+serviceId).val();
    if(promoBillingFlag=='Y')
    {
        $('#'+imgID).attr('src','static/images/icons/icon_checked.gif');
        
        $("#lblPromoBillingStartDate").addClass("required-lbl-right");
        $("#promoBillingStartDate").removeAttr("disabled");
        
        $("#lblPromoBillingEndDate").addClass("required-lbl-right");
        $("#promoBillingEndDate").removeAttr("disabled");
        
        $("#lblPromoBillingDiscount").addClass("required-lbl-right");
        $("#promoBillingDiscount").removeAttr("disabled");
    }
    else
    {
        $('#'+imgID).attr('src','static/images/icons/icon_unchecked.gif');
        
        $("#lblPromoBillingStartDate").removeClass("required-lbl-right");
        $("#promoBillingStartDate").val("");
        $('#promoBillingStartDate').attr("disabled", "true");
        
        $("#lblPromoBillingEndDate").removeClass("required-lbl-right");
        $("#promoBillingEndDate").val("");
        $('#promoBillingEndDate').attr("disabled", "true");
        
        $("#lblPromoBillingDiscount").removeClass("required-lbl-right");
        $("#promoBillingDiscount").attr("disabled", "true");
        $("#promoBillingDiscount").val("");
    }
}

function toggleCheckUncheckProductType(elem) {
    var image = elem.getElementsByTagName("IMG")[0];
    if (image.src.search("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
    }
}

function copyProductTypeDetails(elem, prodTypeCat) {
    var elemValue = $(elem).val();
    $.ajax({
        url : "cpon/clientServiceSetup/productTypeDetails.json",
        type : 'POST',
        data : {productTypeId : elemValue, id : parentkey, productTypeCategory : prodTypeCat},
        success : function(data)
        {
            checkUncheckDisableFeatures(data, prodTypeCat);
            setCcyAccCount(data, prodTypeCat);            
        }
    });
    
    if( hasAgreement == 'Y' && 'S' == prodTypeCat && origLiquidityProductId != "" && origLiquidityProductId != elemValue && clientValidFlag == 'Y')
    {
        getAgreementHamperedPopup(prodTypeCat, origLiquidityProductId);
    }
}
function copyProductTypeDetailsForCorp(elemValue, prodTypeCat) {
    $.ajax({
        url : "cpon/clientServiceSetup/productTypeDetails.json",
        type : 'POST',
        data : {productTypeId : elemValue, id : parentkey, productTypeCategory : prodTypeCat},
        success : function(data) {
            checkUncheckDisableFeatures(data, prodTypeCat);
            setCcyAccCount(data, prodTypeCat);
        }
    });
}
function checkUncheckDisableFeatures(responseData, prodTypeCat) {
    if ('S' == prodTypeCat) {
        if (null != previouslySelectedSweepProductTypeFeatures) {
            for (p=0 ; p<previouslySelectedSweepProductTypeFeatures.length ; p++) {
                var elem = document.getElementById('chkService_'+previouslySelectedSweepProductTypeFeatures[p]);
                var image = elem.getElementsByTagName("IMG")[0];
                
                elem.setAttribute("onclick", "setDirtyBit(); toggleCheckboxFeatureDetails(this);");
                image.src = "static/images/icons/icon_unchecked.gif";
                if (null != selectedEntryFeatures) {
                    var position = jQuery.inArray(previouslySelectedSweepProductTypeFeatures[p],selectedEntryFeatures);
                    if (-1 != position) {
                        selectedEntryFeatures.splice(position, 1);
                    }
                }
            }
        }
    } else if ('N' == prodTypeCat) {
        if (null != previouslySelectedPoolProductTypeFeatures) {
            for (p=0 ; p<previouslySelectedPoolProductTypeFeatures.length ; p++) {
                var elem = document.getElementById('chkService_'+previouslySelectedPoolProductTypeFeatures[p]);
                var image = elem.getElementsByTagName("IMG")[0];
                
                elem.setAttribute("onclick", "setDirtyBit(); toggleCheckboxFeatureDetails(this);");
                image.src = "static/images/icons/icon_unchecked.gif";
                if (null != selectedEntryFeatures) {
                    var position = jQuery.inArray(previouslySelectedPoolProductTypeFeatures[p],selectedEntryFeatures);
                    if (-1 != position) {
                        selectedEntryFeatures.splice(position, 1);
                    }
                }
            }
        }
    }
    if ('S' == prodTypeCat) {
        previouslySelectedSweepProductTypeFeatures = new Array();
        selectedProduct = $('#sweepProductTypeId').val();
    } else if ('N' == prodTypeCat) {
        previouslySelectedPoolProductTypeFeatures = new Array();
        selectedProduct = $('#notionalProductTypeId').val();
    }

    enableDisableOtherFeatures(prodTypeCat);
    var showBalancActivityFlags = false;
    for (i=0 ; i<responseData['Features'].length ; i++) {
        var elem = document.getElementById('chkService_'+responseData['Features'][i]);
        var image = elem.getElementsByTagName("IMG")[0];
        
        //elem.removeAttribute("onclick");
        if(selectedProduct === "")
            image.src = "static/images/icons/icon_unchecked_grey.gif";
        else 
            {
            image.src = "static/images/icons/icon_checked_grey.gif";
            elem.removeAttribute("onclick");
            }
        if (null == selectedEntryFeatures) {
            selectedEntryFeatures = new Array();
            selectedEntryFeatures.push(responseData['Features'][i]);
        } else if (-1 == jQuery.inArray(responseData['Features'][i],selectedEntryFeatures)) {
            selectedEntryFeatures.push(responseData['Features'][i]);
        }
        toggleEntityFeatures(responseData['Features'][i]);
        if ('S' == prodTypeCat) {
            previouslySelectedSweepProductTypeFeatures.push(responseData['Features'][i]);
            
            if ('FLMS_000021' === responseData['Features'][i]) {
				showBalancActivityFlags = true;
			}
			if (showBalancActivityFlags) {
				$('#chkService_FLMS_000023').parent().removeClass('hidden');
				$('#chkService_FLMS_000022').parent().removeClass('hidden');
			} else {
				$('#chkService_FLMS_000023').parent().addClass('hidden');
				$('#chkService_FLMS_000022').parent().addClass('hidden');
			}
            
        } else if ('N' == prodTypeCat) {
            previouslySelectedPoolProductTypeFeatures.push(responseData['Features'][i]);
        }
    }
}

function toggleEntityFeatures(featureId)
{
    var element , img ;
    if(featureId == 'FLMS_000010')
    {
        element = document.getElementById("chkService_FLMS_000011");
        img = element.getElementsByTagName("IMG")[0];
        img.src = "static/images/icons/icon_unchecked_grey.gif";
        element.removeAttribute("onclick");
    }
    else if(featureId == 'FLMS_000011')
    {
        element = document.getElementById("chkService_FLMS_000010");
        img = element.getElementsByTagName("IMG")[0];
        img.src = "static/images/icons/icon_unchecked_grey.gif";
        element.removeAttribute("onclick");
    }
    else if(featureId == 'FLMS_000001')
    {
        element = document.getElementById("chkService_FLMS_000002");
        img = element.getElementsByTagName("IMG")[0];
        img.src = "static/images/icons/icon_unchecked_grey.gif";
        element.removeAttribute("onclick");
    }
    else if(featureId == 'FLMS_000002')
    {
        element = document.getElementById("chkService_FLMS_000001");
        img = element.getElementsByTagName("IMG")[0];
        img.src = "static/images/icons/icon_unchecked_grey.gif";
        element.removeAttribute("onclick");
    }
}

function toggleContainerVisibility(strTargetDivId) {
    $((strTargetDivId ? '#' + strTargetDivId + ' ' : '') + '.canParentHide')
            .each(function() {
                if($(this).find('.canHide').length===0)
                    $(this).addClass('hidden');
                else
                    $(this).removeClass('hidden');
                if($(this).find('.canHide').length === $(this)
                        .find('.canHide.hidden').length) {
                    $(this).addClass('hidden');
                } else
                    $(this).removeClass('hidden');
            });
    $((strTargetDivId ? '#' + strTargetDivId + ' ' : '') + '.canContainerHide')
        .each(function() {
            if ($(this).find('.canParentHide').length === $(this)
                    .find('.canParentHide.hidden').length) {
                $(this).addClass('hidden');
            } else
                $(this).removeClass('hidden');
        });
}

function setCcyAccCount(responseData, prodTypeCat) {
    if ('S' == prodTypeCat) {
        $('#currenciesCnt').text("("+(responseData['C'])+")");
        $('#accountTypeCnt').text("("+(responseData['A'])+")");
    } else if ('N' == prodTypeCat) {
        $('#PoolCurrenciesCnt').text("("+(responseData['C'])+")");
        $('#PoolAccountTypeCnt').text("("+(responseData['A'])+")");
    }
}

function toggleMobileBankingCheckboxServices(image, elem, clientType, elementId, isAuthorized)
{
    enableDisableMobileChkBoxServices(image, 'MobileBtr', 'MOBILE_BTR', clientType, elementId, isAuthorized);
    enableDisableMobileChkBoxServices(image, 'MobilePay', 'MOBILE_PAY', clientType, elementId, isAuthorized);
    enableDisableMobileChkBoxServices(image, 'MobilePp', 'MOBILE_PP', clientType, elementId, isAuthorized);
}

function enableDisableMobileChkBoxServices(image, imgId, eleId,clientType, elementId, isAuthorized)
{ 
    if(imgId != null && eleId != null){                        
            var mobileImg = $('#chk'+imgId);            
            
        if(clientType != 'S'){                
            if(null != document.getElementById("hiddenService_"+ eleId)){                
                if(image.src.indexOf("icon_checked.gif") > -1 || image.src.indexOf("icon_checked_grey.gif") > -1){
                    if(document.getElementById("hiddenService_"+ eleId).value == "Y"){
                        if(true === isAuthorized){
                            mobileImg.attr('src',"static/images/icons/icon_checked_grey.gif");
                            mobileImg.parent('a').attr('onclick','');
                        }else{
                            mobileImg.attr('src',"static/images/icons/icon_checked.gif");
                            mobileImg.parent('a').attr('onclick','toggleMobileCheckboxServices(this,"N");javascript:setDirtyBit()');
                        }                                                
                        document.getElementById("hiddenService_"+ eleId).value = "Y";
                    }else{
                        mobileImg.attr('src',"static/images/icons/icon_unchecked.gif");
                        mobileImg.parent('a').attr('onclick','toggleMobileCheckboxServices(this,"N");javascript:setDirtyBit()');                        
                        document.getElementById("hiddenService_"+ eleId).value = "N";
                    }
                }else{
                    if(true === isAuthorized)
                    {
                        mobileImg.attr('src',"static/images/icons/icon_unchecked_grey.gif");
                    }
                    else
                    {
                        mobileImg.attr('src',"static/images/icons/icon_unchecked_grey.gif");
                    }
                    mobileImg.parent('a').attr('onclick','');
                    document.getElementById("hiddenService_"+ eleId).value = "N";
                }
            }
        }else{
            if(null != document.getElementById("hiddenService_"+ elementId)){
                if(document.getElementById("hiddenService_"+ elementId).value == "N"){
                    mobileImg.attr('src',"static/images/icons/icon_unchecked_grey.gif");
                    document.getElementById("hiddenService_"+ eleId).value = "N";
                }
                mobileImg.parent('a').attr('onclick','');
            }
        }
    }
}
function enableDisableField(checkboxId,inputId, elemId,linkId,popUpFuction){
    field = document.getElementById(inputId);
    var image = document.getElementById(elemId);
    var linkElement = document.getElementById(linkId);
    
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        document.getElementById(checkboxId).value = "Y";
        
        $(field).prop('disabled',false);
        $(linkElement).attr('onclick',popUpFuction);
        $(linkElement).removeClass('link_disable');
        $(linkElement).addClass('button_underline thePointer');

    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        document.getElementById(checkboxId).value = "N";
        
        $(field).prop('disabled',true);
        $(field).val("");
        $(linkElement).removeAttr('onclick');
        $(linkElement).removeClass('button_underline thePointer');
        $(linkElement).addClass('link_disable');
        
    }
}
function assignAccBankReport(assignRec)
{
    var accNmbr = $('#acctNmbr').val();
    var accType = $('#acctType').val();
    var accSubType = $('#acctSubType').val();
    var accName = $('#orgAccName').val();
    var relativeId = $('#systemBranchRelativeId').val();
    
    $.ajax({
        url : "cpon/clientServiceSetup/assignBankReportsToAccount.json",
        type : 'POST',
        data : {
            accNmbr:accNmbr,
            accType:accType,
            accSubType:accSubType,
            accName:accName,
            relativeId:relativeId,
            assignRec : assignRec,
            id:encodeURIComponent(parentkey)
        },
        success : function(data) {
            
            if (!isEmpty(data))
            {
                if(!isEmpty(data.parentIdentifier))
                {
                    parentkey = data.parentIdentifier;
                    document.getElementById('viewState').value = data.parentIdentifier;
                }
            }
        }
    });
}
function toggleMobileConfigurationSection(elem){
    var image = elem.getElementsByTagName("IMG")[0];
    var elementId = elem.getAttribute("id").replace("chkService_", "");
    var imgEleArr = [];
    if (image.src.search("icon_checked.gif") == -1) {
        $('#div_'+elementId).hide();
        if('FMOB-000003' === elementId){
            selectedInitiationCategories = [];
            selectedApprovalCategories = [];
            imgEleArr = $('#InfoDiv_'+elementId).find('img');
            for(i=0;i<imgEleArr.length;i++){
                var elementIdToRemove = '';
                elementIdToRemove = imgEleArr[i].getAttribute("id").replace("chkImg_", "");
                $('#chkImg_'+elementIdToRemove).attr('src',"static/images/icons/icon_unchecked.gif");
                elementIdToRemove = imgEleArr[i].getAttribute("id").replace("chkImgAR_", "");
                $('#chkImgAR_'+elementIdToRemove).attr('src',"static/images/icons/icon_unchecked.gif");
            }
        }else if('FMOB-000002' === elementId){
            $('.canClearValue').val('');
            $( "#InfoDiv_BALREP input[id$='days']" ).prop( "disabled", true );
            $( "#InfoDiv_BALREP input[id$='maxFilterRecord']" ).val('999');
            $( "#InfoDiv_BALREP input:disabled" ).addClass('disabled');
        }else{
            imgEleArr = $('#InfoDiv_'+elementId).find('img');
            for(i=0;i<imgEleArr.length;i++){
                var elementIdToRemove = '';
                elementIdToRemove = imgEleArr[i].getAttribute("id").replace("chkImg_", "");
                var position = jQuery.inArray(elementIdToRemove, selectedEntryFeatures);
                if (-1 != position) {
                    selectedEntryFeatures.splice(position, 1);
                    $('#chkImg_'+elementIdToRemove).attr('src',"static/images/icons/icon_unchecked.gif");
                }
            }
        }
    }else{
        $('#div_'+elementId).show();
    }
    
}
function gotoNextPage(strSaveAndNextUrl, frmId, strNextPageUrl) {
    var strDirtyBit = $('#dirtyBit').val();
    if(pageMode == 'EDIT' && !isEmpty(strDirtyBit) && strDirtyBit==="0")
        goToPage(strNextPageUrl, frmId);
    else
        goToPageClientServiceSetupSave(strSaveAndNextUrl, frmId);
}
function gotoNextConfigureServicePage(fnCallBackForSaveAndNext, argSaveAndNext, fnCallBackForNext, argForNextPage) {
    var strDirtyBit = $('#dirtyBit').val();
    if(!isEmpty(strDirtyBit) && strDirtyBit==="0")
        fnCallBackForNext(argForNextPage[0],argForNextPage[1]);
    else
        fnCallBackForSaveAndNext(argSaveAndNext);
}
function gotoSaveConfigurePage(strUrl){
    var frm = document.getElementById('frmMain');
    frm.action = strUrl;
    frm.target = "";
    frm.method = "POST";
    $("textarea").removeAttr('disabled');
    $("select").removeAttr('disabled');
    $("input[name='periodType']").removeAttr('disabled');
    frm.submit();
}
function resetDirtyBit(){
    $('#dirtyBit').val("0");
}
//Check Management Section Starts Here
function checkuncheckChkProfFeatureWithNodeType(imgElement, strFeatureId,
        value, strNodeType) {
    if (imgElement) {
        if (value != null && value != "") {
            if (clientType === 'M') {
                imgElement.src = "static/images/icons/icon_checked.gif";
                document.getElementById(strFeatureId + "_value").value = 'Y';
            } else if (clientType === 'S') {
                if (!(strNodeType === 'C Param' || strNodeType === 'C Other')) {
                    imgElement.src = "static/images/icons/icon_checked_grey.gif";
                    $(imgElement).attr('onclick', '');
                } else if (strNodeType === 'C Param'
                        || strNodeType === 'C Other') {
                    imgElement.src = "static/images/icons/icon_checked.gif";
                    document.getElementById(strFeatureId + "_value").value = 'Y';
                }
            }
        } else {
            if (clientType === 'M') {
                imgElement.src = "static/images/icons/icon_unchecked.gif";
                document.getElementById(strFeatureId + "_value").value = 'N';
            } else if (clientType === 'S') {
                if (!(strNodeType === 'C Param' || strNodeType === 'C Other')) {
                    imgElement.src = "static/images/icons/icon_unchecked_grey.gif";
                } else if (!(strNodeType === 'C Param' || strNodeType === 'C Other')) {
                    imgElement.src = "static/images/icons/icon_unchecked.gif";
                }
            }
        }
    }
}
//Check Management Section Ends Here

function saveClientDepositFeatureProfile(strUrl) {
	if(strUrl == 'clientServiceSetupList.form')
    	goBackValidate(strUrl, "frmMain")
    else
    {
	    var frm = document.forms["frmMain"];
	    frm.action = strUrl;
	    frm.target = "";
	    frm.method = "POST";
	    
	    if (undefined != clientType && !isEmpty(clientType) && 'S' === clientType) {
	        $('#selectedWidgets').val([]);
	        $('#allWidgetsSelectedFlag').val('N');
	        $('#DRTW_value').val('');
	        $('#depositItemText').val('');
	        $('#depositText').val('');
	    }
	    $.blockUI();
	    frm.submit();
    }   
}
function saveClientLoanFeatureProfile(strUrl) {
	if(strUrl == 'clientServiceSetupList.form')
    	goBackValidate(strUrl, "frmMain")
    else
    {
	    var frm = document.forms["frmMain"];
	    frm.action = strUrl;
	    frm.target = "";
	    frm.method = "POST";
	    if(clientType==='M'){
	        $("textarea").removeAttr('disabled');
	        $("input[name='disclaimerRadioFlag']").removeAttr('disabled');
	        $("input[name='partialDisclaimerRadioFlag']").removeAttr('disabled');
	        $("input[name='disclaimerRadioFlagAdv']").removeAttr('disabled');
	        $("input[name='disclaimerRadioFlagInv']").removeAttr('disabled');
	    }
	    else if (undefined != clientType && !isEmpty(clientType) && 'S' === clientType) {
	        $('#selectedWidgets').val([]);
	        $('#allWidgetsSelectedFlag').val('N');
	        $('#payDisclaimerText').val('');
	        $('#payPartialDisclaimerText').val('');
	        $('#advdisclaimerText').val('');
	        $('#invdisclaimerText').val('');
	        $('#disclaimerRadioFlagInv').val('');
	        $('#disclaimerRadioFlagAdv').val('');
	        $('#partialDisclaimerRadioFlag').val('');
	        $('#disclaimerRadioFlag').val('');
	    }
	    
		if($('#chkImg_ABD').length)
		{
	    var chkABD = $('#chkImg_ABD')[0].src;
	    if(chkABD.split('/').pop() === "icon_unchecked.gif")
	    {
	            $('#MBD_value').removeAttr('disabled');
	            $('#MBDAD_value').removeAttr('disabled');
	            $('#MBDIP_value').removeAttr('disabled');
	            $('#MBDIPTD_value').removeAttr('disabled');
					$('#ABD_value').val("N");
					$('#MBD_value').val("0");
					$('#MBDAD_value').val("");			
					$('#MBDIP_value').val("");
				    $('#MBDIPTD_value').val("");
	    }
	    else
	    {
					/*if($('#MBD_value').val() === "")
						$('#MBD_value').val("");
	            if($('#MBDAD_value').val() === "")
						$('#MBDAD_value').val("");
	            if($('#MBDIP_value').val() === "")
						$('#MBDIP_value').val("");*/
	    }
		}
	    
		if($('#chkImg_AFD').length)
		{
	    var chkAFD = $('#chkImg_AFD')[0].src;
	    if(chkAFD.split('/').pop() === "icon_unchecked.gif")
	    {
	            $('#MFD_value').removeAttr('disabled');
	            $('#MFDAD_value').removeAttr('disabled');
	            $('#MFDIP_value').removeAttr('disabled');
	            $('#MFDIPTD_value').removeAttr('disabled');	            
					$('#AFD_value').val("N");
					$('#MFD_value').val("0");
					$('#MFDAD_value').val("");
					$('#MFDIP_value').val("");
					$('#MFDIPTD_value').val("");					
	    }
	    else
	    {
					/*if($('#MFD_value').val() === "")
						$('#MFD_value').val("");
	            if($('#MFDAD_value').val() === "")
						$('#MFDAD_value').val("");
	            if($('#MFDIP_value').val() === "")
						$('#MFDIP_value').val("");*/
	    }
		}
	    
		if($('#chkImg_LDO').length)
		{
	    var chkLDO = $('#chkImg_LDO')[0].src;
	    if(chkLDO.split('/').pop() === "icon_unchecked.gif")
	    {
	            $('#MBDAD_value').removeAttr('disabled');
	            $('#MFDAD_value').removeAttr('disabled');
					$('#LDO_value').val("N");
					$('#MBDAD_value').val("");
					$('#MFDAD_value').val("");
	    }
	    else
	    {
					/*if($('#MBDAD_value').val() === "")
						$('#MBDAD_value').val("");
	            if($('#MFDAD_value').val() === "")
						$('#MFDAD_value').val("");*/
	            
	    }
		}
	    
		if($('#chkImg_LNI').length)
		{
	    var chkLNI = $('#chkImg_LNI')[0].src;
	    if(chkLNI.split('/').pop() === "icon_unchecked.gif")
	    {
	            $('#MFDIP_value').removeAttr('disabled');
	            $('#MBDIP_value').removeAttr('disabled');
					$('#LNI_value').val("N");
					$('#MFDIP_value').val("");
					$('#MBDIP_value').val("");
	    }
	    else
	    {
					/*if($('#MFDIP_value').val() === "")
						$('#MFDIP_value').val("");
	            if($('#MBDIP_value').val() === "")
						$('#MBDIP_value').val("");*/
	            
	    }
		}
		$('#loanParamatersDIV').find('img').each(function(index,ele){
			if($(ele).attr('id') != null && $(ele).attr('id').length > 0){
			
			var element = $(ele)[0].src ;
			var elementId = $(ele).attr('id').replace('chkImg_','');
			
			if(element.split('/').pop() === "icon_checked.gif")
			{
				$('#'+elementId+'_value').val("Y");
			}
			else
				$('#'+elementId+'_value').val("N");
			}
		});
		
	    $.blockUI();
	    frm.submit();
    }  
}
//Positive Pay Section Starts Here
function checkIfDependentFeatureAssigned(strFeatureId, strMode) {
    var mapDependentFeatures = {};
    mapDependentFeatures['ISSUAN'] = 'ISSNC';
    mapDependentFeatures['PPPTHR'] = 'PPPT'
    mapDependentFeatures['POSPAYAPPR'] = 'EXDE';
    mapDependentFeatures['FPOP-000010'] = 'FPOP-000009';
    if (!isEmpty(mapDependentFeatures[strFeatureId])) {
        var objDependentElement = $('#chkImg_'
                + mapDependentFeatures[strFeatureId]);
        objDependentElement = $('#chkImg_' + mapDependentFeatures[strFeatureId]).length > 0
                ? $('#chkImg_' + mapDependentFeatures[strFeatureId])[0]
                : null;
        if (strMode === 'VIEW') {
            if (null != objDependentElement
                    && objDependentElement.src.indexOf("icon_checked_grey.gif") > -1)
                return true;
        } else {
            if (null != objDependentElement
                    && objDependentElement.src.indexOf("icon_checked.gif") > -1)
                return true;
        }
    }
    return false;
}
function enableDependentPositivePayField(strDependentFieldId,strElementId, strValue){
    var imgDependentElement = $('#'+strDependentFieldId);
    var imgElement = $('#'+strElementId) && $('#'+strElementId).length >0 ? $('#'+strElementId)[0]:null;
    var elementId = imgElement.getAttribute("id").replace("chkImg_", "");
    if(imgDependentElement && imgDependentElement.length>0){
        imgDependentElement = imgDependentElement[0];
        if (imgDependentElement.src.indexOf("icon_checked.gif") > -1)
        {
            if(strValue === "N")
            	imgElement.src = "static/images/icons/icon_unchecked.gif";
            else
            	imgElement.src = "static/images/icons/icon_checked.gif";
            
            if(elementId === "ISSUAN")
                $(imgElement).attr('onclick','setDirtyBit();checkuncheckFeature(this,"ISSUAN")');
            else if(elementId === "POSPAYAPPR")
            {
                var imgAutoAllDecisionFeature = $('#chkImg_POSPAYAUTOAPPCCY');
                if(imgAutoAllDecisionFeature && imgAutoAllDecisionFeature.length>0
                        && imgAutoAllDecisionFeature[0] != null && imgAutoAllDecisionFeature[0].src.indexOf("icon_checked.gif") > -1)
                {
                        autoApproveAllDecisionChange();
                }
                else
                    $(imgElement).attr('onclick','setDirtyBit();checkuncheckFeature(this,"POSPAYAPPR")');
            }                
            else if(elementId === "PPPTHR")
                $(imgElement).attr('onclick','setDirtyBit();checkuncheckFeature(this,"PPPTHR")');
            else if( elementId === "FPOP-000010")
            {
            	var imgAutoAllDecisionFeature = $('#chkImg_POSPAYAUTOAPPCCY');
                if(imgAutoAllDecisionFeature && imgAutoAllDecisionFeature.length>0
                        && imgAutoAllDecisionFeature[0] != null && imgAutoAllDecisionFeature[0].src.indexOf("icon_checked.gif") > -1){
                		autoApproveAllAchDecisionChange();
                }
                else
                	$(imgElement).attr('onclick','setDirtyBit();checkuncheckFeature(this,"FPOP-000010")'); 
			}
            else if(elementId === "FPOP-000009")
            {
            	$(imgElement).attr('onclick','setDirtyBit();checkuncheckFeature(this,"FPOP-000009")');
            	enableDependentPositivePayField('chkImg_FPOP-000009','chkImg_FPOP-000010','Y');
            }
            else if(elementId === "POSPAYAUTOAPPCCY")
            {
            	$(imgElement).attr('onclick','setDirtyBit();checkuncheckFeature(this,"POSPAYAUTOAPPCCY")');
            }
            else if(elementId === "POSPAYAPPEX")
            {
            	$(imgElement).attr('onclick','setDirtyBit();checkuncheckFeature(this,"POSPAYAPPEX")');
            	autoDecisionChange();
            }    
        }
        else if(imgDependentElement.src.indexOf("icon_unchecked_grey") > -1)
        {
        	imgElement.src = "static/images/icons/icon_unchecked_grey.gif";
        	$(imgElement).attr('onclick','');
        	 if(elementId === "FPOP-000009")
             {
             	enableDependentPositivePayField('chkImg_FPOP-000009','chkImg_FPOP-000010','N');
             }
        }	
        else
        {
            if(imgElement.src.indexOf("icon_checked.gif") > -1)
            {
                imgElement.src = "static/images/icons/icon_unchecked_grey.gif";
                $(imgElement).attr('onclick','');
            }
            else{
                if(imgElement.src.indexOf("icon_unchecked_grey.gif") > -1) {                    
                } else {
                    imgElement.click();
                }
                imgElement.src = "static/images/icons/icon_unchecked_grey.gif";
                $(imgElement).attr('onclick','');
            }
            if(elementId === "POSPAYAPPEX")
            {               
            	autoDecisionChange();
            }    
            if(elementId === "FPOP-000009")
            {
            	enableDependentPositivePayField('chkImg_FPOP-000009','chkImg_FPOP-000010','Y');
            }
        }
    }
}
function autoApproveAllDecisionChange(){
    var imgDependentElement = $('#chkImg_POSPAYAUTOAPPCCY');
    var strElementId = 'chkImg_POSPAYAPPR';
    var imgElement = $('#'+strElementId) && $('#'+strElementId).length >0 ? $('#'+strElementId)[0]:null;
    var elementId = imgElement.getAttribute("id").replace("chkImg_", "");
    if(imgDependentElement && imgDependentElement.length>0){
        imgDependentElement = imgDependentElement[0];
        if (imgDependentElement.src.indexOf("icon_checked.gif") > -1)
        {
            if(imgElement.src.indexOf("icon_checked.gif") > -1)
            {
                imgElement.src = "static/images/icons/icon_unchecked_grey.gif";
                $(imgElement).attr('onclick','');
            }
            else{
                imgElement.click();
                imgElement.src = "static/images/icons/icon_unchecked_grey.gif";
                $(imgElement).attr('onclick','');
            }
        }
        else
        {
            imgElement.src = "static/images/icons/icon_checked.gif";
            $(imgElement).attr('onclick','setDirtyBit();checkuncheckFeature(this,"POSPAYAPPR")');
        }
    }
}
function isAutoNumericApplied(strId) {
	var isAutoNumericApplied = false;
	$.each(($('#'+strId).data('events')||[]), function(i, event) {
				if (isAutoNumericApplied === true)
					return false;
				$.each(event, function(i, eventHandler) {
							if (eventHandler.namespace === 'autoNumeric')
								isAutoNumericApplied = true;
							return false;
						});
			});
	return isAutoNumericApplied;
}
function showWarnMessage(){
	var errorContainer = $('#errorContainerDiv');
	var errorMessage=$("#errorContainerMessage");
	errorContainer.empty();
	if ($('#errorContainerDiv').hasClass('ui-helper-hidden')) {
			$('#errorContainerDiv').removeClass('ui-helper-hidden');
		}
	var errorMsg = '';
	errorMsg+=getLabel('clientSetupError','No Updates in Client Service Set up to Submit');
	errorContainer.append(errorMsg);	
	
}
//Positive Pay Section Ends Here

function toggleMT101Services(isSystemBank){
    if(isSystemBank == "N" && mt101Applicable == "true"){
        $('#chkService_recievingAccountFlag img,#chkService_paymentPrefunding img,#chkService_paymentBookTransEODProc img,#chkAllCompanySelectedFlag,#chkService_sameDayACHFlag img,#imgCheck_paymentChargeAcct,#imgCheck_paymentGstAcct').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
        $('#chkService_recievingAccountFlag,#chkService_paymentPrefunding,#chkService_paymentBookTransEODProc,#chkAllCompanySelectedFlag,#companyIdDiv a,#chkService_sameDayACHFlag,#chkService_paymentChargeAcct,#chkService_paymentGstAcct').removeAttr('onclick');
        $('#pLinkedChargeAcct,#pLinkedGstAcct').removeAttr('disabled');
        $("label[for='paymentChargeAmt']").removeClass("required-lbl-right");
        $("label[for='paymentGstAcct']").addClass("required-lbl-right");
        $('#pLinkedChargeAcct').children('option:first').text('Select Charge Account');
        $('#pLinkedGstAcct').children('option:first').text('Select GST Account');
        //Disable Payment Section Services
        $('#hiddenService_recievingAccountFlag,#hiddenService_paymentPrefunding,#hiddenService_paymentBookTransEODProc,#hiddenService_sameDayACHFlag,#hiddenService_paymentChargeAcct,#hiddenService_paymentGstAcct').val('N');
        //Disable Loan Section Services
        $('#hiddenService_acctUsagePaydown,#hiddenService_acctUsageAdvance,#hiddenService_acctUsageInvoicePay,#hiddenService_othersLoanRepayment,#hiddenService_advanceDeposit').val('N');
        //Disable Others Section Services
        $('#hiddenService_othersDepositInquiry,#hiddenService_othersChecks,#hiddenService_othersPositivePayImaging,#reversePositivePay,#hiddenService_othersDefaultChargeAccount,#hiddenService_othersDefaultGstAccount').val('N');
        $('#divLoan,#divOthers').hide();
        
    }
    else{
        $('#chkService_recievingAccountFlag img,#chkService_paymentPrefunding img,#chkService_paymentBookTransEODProc img,#chkAllCompanySelectedFlag,#chkService_sameDayACHFlag img,#imgCheck_paymentChargeAcct,#imgCheck_paymentGstAcct').attr('src', 'static/images/icons/icon_unchecked.gif');
        $('#hiddenService_recievingAccountFlag,#hiddenService_paymentPrefunding,#hiddenService_paymentBookTransEODProc,#hiddenService_sameDayACHFlag,#hiddenService_paymentChargeAcct,#hiddenService_paymentGstAcct').val('N');
        $('#chkService_recievingAccountFlag,#chkService_paymentPrefunding,#chkService_paymentBookTransEODProc,#chkService_sameDayACHFlag').attr("onclick", "toggleCheckbox(this);");
        $('#chkService_paymentChargeAcct').attr("onclick","toggleCheckboxPChargeAccount(this);");
        $('#chkService_paymentGstAcct').attr("onclick","toggleCheckboxPGstAccount(this);");
        $("label[for='paymentChargeAmt']").addClass("required-lbl-right");
        $("label[for='paymentGstAcct']").addClass("required-lbl-right");
        $('#pLinkedChargeAcct').children('option:first').text('Linked Charge Account');
        $('#pLinkedGstAcct').children('option:first').text('Linked GST Account');
        $('#companyIdDiv a').attr("onclick","getPayCompanyIdPopup();");
        
        if(!Ext.isEmpty(companyIdCount) && companyIdCount != "0"){
            $('#chkAllCompanySelectedFlag').attr("onclick","toggleCheckUncheck(this,'allCompanySelectedFlag');");
        }
        $('#divLoan,#divOthers').show();
    }
}

function setPayoutServiceCheckBox(serviceId,imgId,clientType){
    setServiceCheckUnchek(serviceId,imgId,false);    
}

function setInternalClientServiceCheckBox(serviceId,imgId,clientType){
    setServiceCheckUnchek(serviceId,imgId,false);    
}

function setCreditCardServiceCheckBox(serviceId,imgId,clientType){
    setServiceCheckUnchek(serviceId,imgId,false);
}
function toggleCheckUncheckPayoutOrInternal(imgElement, flag) {
    if (imgElement.src.indexOf("icon_unchecked_grey.gif") == -1) {
    
        if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
            imgElement.src = "static/images/icons/icon_checked.gif";
            $('#' + flag).val('Y');
            if(flag === 'hiddenService_INTERNALCLIENT'){
                $('#chkpayoutCustEnable')[0].src = 'static/images/icons/icon_unchecked_grey.gif';
                $('#chkpayoutCustEnable').attr('disabled','true');
                $('#chkpayoutCustEnable').removeAttr("onclick");
            }
            else if(flag === 'hiddenService_PAYOUT' && pageMode !== 'EDIT'){
                $('#chkinternalCustEnable')[0].src = 'static/images/icons/icon_unchecked_grey.gif';
                $('#chkinternalCustEnable').attr('disabled','true');
                $('#chkinternalCustEnable').removeAttr("onclick");
            }
        } else {
            imgElement.src = "static/images/icons/icon_unchecked.gif";
            $('#' + flag).val('N');
            if(flag === 'hiddenService_INTERNALCLIENT'){
                $('#chkpayoutCustEnable')[0].src = 'static/images/icons/icon_unchecked.gif';
                $('#chkpayoutCustEnable').removeAttr('disabled');
                $('#chkpayoutCustEnable').attr("onclick","toggleCheckUncheckPayoutOrInternal(this,'hiddenService_PAYOUT');setDirtyBit();");
            }
            else if(flag === 'hiddenService_PAYOUT' && pageMode !== 'EDIT'){
                $('#chkinternalCustEnable')[0].src = 'static/images/icons/icon_unchecked.gif';
                $('#chkinternalCustEnable').removeAttr('disabled');
                $('#chkinternalCustEnable').attr("onclick","toggleCheckUncheckPayoutOrInternal(this,'hiddenService_INTERNALCLIENT');setDirtyBit();");
            }
        }
    }
}

function togglePayoutServices(setFlag,isAuthorized)
{
	if (undefined != $('#chkpayoutCustEnable')[0])
    if("Y" == setFlag)
    {
        $('#chkpayoutCustEnable')[0].src = 'static/images/icons/icon_unchecked.gif';
        $('#chkpayoutCustEnable').removeAttr('disabled');
        $('#chkpayoutCustEnable').attr("onclick","toggleCheckUncheckPayoutOrInternal(this,'hiddenService_PAYOUT');setDirtyBit();");
        $('#chkinternalCustEnable')[0].src = 'static/images/icons/icon_unchecked.gif';
        $('#chkinternalCustEnable').removeAttr('disabled');
        $('#chkinternalCustEnable').attr("onclick","toggleCheckUncheckPayoutOrInternal(this,'hiddenService_INTERNALCLIENT');setDirtyBit();");
    }
    else
    {
        $('#chkpayoutCustEnable')[0].src = 'static/images/icons/icon_unchecked_grey.gif';
        $('#chkpayoutCustEnable').attr('disabled','true');
        $('#chkpayoutCustEnable').removeAttr("onclick");
        $('#chkinternalCustEnable')[0].src = 'static/images/icons/icon_unchecked_grey.gif';
        $('#chkinternalCustEnable').attr('disabled','true');
        $('#chkinternalCustEnable').removeAttr("onclick");
        $('#hiddenService_PAYOUT').val("N");
        $('#hiddenService_INTERNALCLIENT').val("N");
    }
    if("N" == isAuthorized)
    {
        if("Y" == setFlag)
        {
            if (undefined != $('#chkretailCustomer')[0])
            {
                if($('#chkretailCustomer')[0].src.indexOf("icon_checked.gif") > -1 || $('#chkretailCustomer')[0].src.indexOf("icon_checked_grey.gif") > -1)
                {
                    if (undefined != $('#chkcreditCardClient')[0])
                    {
                        $('#chkcreditCardClient').attr('src','static/images/icons/icon_unchecked_grey.gif');
                        $('#chkcreditCardClient').attr('disabled','true');
                        $('#chkcreditCardClient').removeAttr("onclick");
                    }
                    if (undefined != $('#chkclientIsFi')[0])
                    {
                        $('#chkclientIsFi').attr('src','static/images/icons/icon_unchecked_grey.gif');
                        $('#chkclientIsFi').attr('disabled','true');
                        $('#chkclientIsFi').removeAttr("onclick");
                    }
                }
                else
                {
                    if (undefined != $('#chkcreditCardClient')[0])
                    {
                        $('#chkcreditCardClient').attr('src','static/images/icons/icon_unchecked.gif');
                        $('#chkcreditCardClient').attr('disabled','false');
                        $('#chkcreditCardClient').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_CREDITCARD');setDirtyBit();");
                    }
                    if (undefined != $('#chkclientIsFi')[0])
                    {
                        $('#chkclientIsFi').attr('src','static/images/icons/icon_unchecked.gif');
                        $('#chkclientIsFi').attr('disabled','false');
                        $('#chkclientIsFi').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_CLIENTISFI');setDirtyBit();");
                    }
                }
            }
        }
        else
        {
            if (undefined != $('#chkcreditCardClient')[0])
            {
                $('#chkcreditCardClient').attr('src','static/images/icons/icon_unchecked_grey.gif');
                $('#chkcreditCardClient').attr('disabled','true');
                $('#chkcreditCardClient').removeAttr("onclick");
                $('#hiddenService_CREDITCARD').val("N");
            }
            if (undefined != $('#chkclientIsFi')[0])
            {
                $('#chkclientIsFi').attr('src','static/images/icons/icon_unchecked_grey.gif');
                $('#chkclientIsFi').attr('disabled','true');
                $('#chkclientIsFi').removeAttr("onclick");
                $('#hiddenService_CLIENTISFI').val("N");
            }
            if (undefined != $('#chkretailCustomer')[0])
            {
                if($('#chkretailCustomer')[0].src.indexOf("icon_checked.gif") > -1 || $('#chkretailCustomer')[0].src.indexOf("icon_checked_grey.gif") > -1)
                {
                    $('#chkretailCustomer').attr('src','static/images/icons/icon_checked.gif');
                    $('#chkretailCustomer').attr('disabled','false');
                    $('#chkretailCustomer').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_RETAILCUST');setDirtyBit();");
                    $('#hiddenService_RETAILCUST').val("Y");
                }
                else
                {
                    $('#chkretailCustomer').attr('src','static/images/icons/icon_unchecked.gif');
                    $('#chkretailCustomer').attr('disabled','false');
                    $('#chkretailCustomer').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_RETAILCUST');setDirtyBit();");
                    $('#hiddenService_RETAILCUST').val("N");
                }
            }
        }
    }
    if("Y" === isAuthorized)
    {
        $('#chkcreditCardClient').attr('disabled','true');
        $('#chkcreditCardClient').removeAttr("onclick");
        $('#chkclientIsFi').attr('disabled','true');
        $('#chkclientIsFi').removeAttr("onclick");
        if (undefined != $('#chkretailCustomer')[0])
        {
            if($('#chkretailCustomer')[0].src.indexOf("icon_checked.gif") > -1 || $('#chkretailCustomer')[0].src.indexOf("icon_checked_grey.gif") > -1)
            {
                $('#chkretailCustomer').attr('src','static/images/icons/icon_checked_grey.gif');
                $('#chkretailCustomer').attr('disabled','true');
                $('#hiddenService_RETAILCUST').val("Y");
            }
            else
            {
                $('#chkretailCustomer').attr('src','static/images/icons/icon_unchecked_grey.gif');
                $('#chkretailCustomer').attr('disabled','true');
                $('#hiddenService_RETAILCUST').val("N");
            }
        }
    }
    if("N" == setFlag && "Y" === isAuthorized)
    {
        if (undefined != $('#chkcreditCardClient')[0])
        {
            $('#chkcreditCardClient').attr('src','static/images/icons/icon_unchecked_grey.gif');
            $('#chkcreditCardClient').attr('disabled','true');
            $('#chkcreditCardClient').removeAttr("onclick");
            $('#hiddenService_CREDITCARD').val("N");
        }
        
        if (undefined != $('#chkretailCustomer')[0])
        {
            $('#chkretailCustomer').attr('src','static/images/icons/icon_unchecked_grey.gif');
            $('#chkretailCustomer').attr('disabled','true');
            $('#chkretailCustomer').removeAttr("onclick");
            $('#hiddenService_RETAILCUST').val("N");
        }
        
        if (undefined != $('#chkclientIsFi')[0])
        {
            $('#chkclientIsFi').attr('src','static/images/icons/icon_unchecked_grey.gif');
            $('#chkclientIsFi').attr('disabled','true');
            $('#chkclientIsFi').removeAttr("onclick");
            $('#hiddenService_CLIENTISFI').val("N");
        }
    }
}

function showPopup(frmId)
{

$('#'+frmId).dialog({
        autoOpen : false,
        maxHeight: 580,
        minHeight: (screen.width) > 1024 ? 156 : 0 ,
        width : 840,
        resizable: false,
        draggable: false,
        title : 'Payout Parameters',
        modal : true,
      focus :function(){
            
      },
      close : function(){
      }
    });
    $('#'+frmId).dialog("open");
    $('#'+frmId).parent().appendTo($("#frmMain"));
    
}
function checkSubAccType(type)
{
    if($('#acctType').val() === 'FAC00010')
        {
    	$('#acctNmbr').addClass('hidden');
    	$('#acctNmbr1').removeClass('hidden');
    	if(type === 'S')
    		{
    		$('#acctNmbr').val('');
    		}
    	if((mode !== 'EDIT' && errorFlag !== '1') || (mode !== 'EDIT' && errorFlag === '1' && $('#acctNmbr').val() === ''))
    	{
    		$('#acctNmbr1').val('');
    		$('#acctNmbr1').prop('title','');
    	}
    	$('#acctNmbr1').accntNmbrAutoComplete();
    	if(mode !== 'EDIT')
    	{
    	$('#ccyCode').removeAttr("disabled");
    	}
        }
    else
        {
        $('#ccyCode').removeAttr("disabled");
        }
    
    
    }

jQuery.fn.accntNmbrAutoComplete = function() {
if($('#acctSubType').val() === 'SUBFAC1001')//client
	{
	subAccTypeVar = 1;
	}
else if ($('#acctSubType').val() === 'SUBFAC1002')//subsidiary
	{
	subAccTypeVar = 2;
	}
else if ($('#acctSubType').val() === 'SUBFAC1003')//aggregator
	{
	subAccTypeVar = 3;
	}
	var stUrl = 'services/userseek/virtualAccNo.json';
	   return this.each(function() {
	        $(this).autocomplete({
	            source : function(request, response) {
	                $.ajax({
	                    url : stUrl,
	                    dataType : "json",
	                    type : 'POST',
	                    data : {
	                        top : -1,
	                        $filtercode1 : clientId,
	                        $filtercode2 : subAccTypeVar,
	                        $autofilter : request.term
	                    },
	                    success : function(data) {
	                        var accountData = data.d.preferences;
	                        if (isEmpty(accountData) || (isEmpty(data.d)) || accountData.length === 0) {
	                            var rec = [ {
	                                label : 'No match found..',
	                                value : ""
	                            } ];
	                            response($.map(rec, function(item) {
	                                return {
	                                    label : item.label,
	                                    value : item.value
	                                }
	                            }));

	                        }
	                        else {
	                            var rec = data.d.preferences;
	                            response($.map(rec, function(item) {
	                                return {
	                                    label : item.CODE,
	                                    record : item
	                                }
	                            }));

	                        }
	                    }
	                });
	            },
	            minLength : 1,
	            select : function(event, ui) {
	                var rec = ui.item.record;
	                $('#acctNmbr').val(rec.CODE);
	                $('#ccyCode').val(rec.DESCR);
	                $('#ccyCode').attr('disabled', true);
	                $('#acctNmbr1').prop('title',rec.CODE);
	            },
	            change : function(event, ui) {
	            	var value = $('#acctNmbr1').val();
	            	$('#acctNmbr').val(value);
	            	$('#acctNmbr1').prop('title',value);
	            	
	            },
	            open : function() {
	            	$('.ui-autocomplete').css('width', '300px'); 
	                $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
	            },
	            close : function() {
	                $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
	            }
	        });/*.data("autocomplete")._renderItem = function(ul, item) {
	            var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.label + '</ul></ol></a>';

	            return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
	        };*/
	    });
	};
	

function virtualAccCheck() {
	if (mode === 'EDIT' && $('#acctType').val() === 'FAC00010') {
		
		$('#acctNmbr1').attr('disabled', true);
		$('#ccyCode').attr('disabled', true);
		$('#acctType').attr('disabled', true);
		$('#acctSubType').attr("disabled", true);
	}
	else
		if (mode === 'ADD' && $('#acctType').val() !== 'FAC00010') {
			$('#acctNmbr1').autocomplete('destroy');
			$('#acctNmbr1').addClass('hidden');
			$('#acctNmbr').removeClass('hidden');
			if(errorFlag !== '1')
			{
				$('#acctNmbr,#acctNmbr1').val('');
			}
			$('#ccyCode').removeAttr("disabled");
		}

	if ($('#acctType').val() === 'FAC00010') {
		$(
				"#chkImgFSC,#chkImgPortal,#chkImgForecast,#chkImgTrade,#chkImgBankReports")
				.attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		$(
				"#chkService_acctUsageFSC,"
						+ "#chkService_acctUsageBankReports,#chkService_acctUsagePortal,#chkService_acctUsageForecast")
				.removeAttr('onclick');

		if (null != document.getElementById("hiddenService_acctUsagePay")) {
			if ("N" === document.getElementById("hiddenService_acctUsagePay").value) {
				$('#chkImgPayments').attr('src', 'static/images/icons/icon_unchecked.gif');
			}
			else {

				$('#chkImgPayments').attr('src', 'static/images/icons/icon_checked.gif');

			}
		}

		if (null != document.getElementById("hiddenService_acctUsageColl")) {
			if ("N" === document.getElementById("hiddenService_acctUsageColl").value) {
				$('#chkImgCollections').attr('src', 'static/images/icons/icon_unchecked.gif');
			}
			else {

				$('#chkImgCollections').attr('src', 'static/images/icons/icon_checked.gif');

			}
		}

	}
	else
		if (mode === 'ADD') {
			virtualAccountCheck();
			$("#chkService_acctUsageSweeping,#chkService_acctUsagePooling").attr('onclick',
					'toggleCheckbox(this);showLiqSection(this,"frmMain");');
			$("#chkService_acctUsageFSC,#chkService_acctUsagePortal,#chkService_acctUsageForecast,#chkService_acctUsageTrade,"
							+ "#chkService_acctUsageBankReports,#chkService_acctUsageLimits,#chkService_acctUsageBr").attr('onclick',
					'toggleCheckbox(this);');
		}

}

function setCheckUnchek(flag, field)
{
	if(flag=='Y')
	{
		$('#'+field).attr('src','static/images/icons/icon_checked.gif');
	}
	else
	{
		$('#'+field).attr('src','static/images/icons/icon_unchecked.gif');		
	}	
}

function setCheckUnchekIban(flag, field, cat)
{
	if(flag=='Y')
	{
		$('#'+field).attr('src','static/images/icons/icon_checked_grey.gif');
	}
	else
	{
		$('#'+field).attr('src','static/images/icons/icon_unchecked_grey.gif');		
	}
	
	if (cat == 'SCT' || cat == 'RFP'){
		$('#ibanValidationDiv').show();
	}else{
		$('#ibanValidationDiv').hide();

	}
}


function virtualAccountCheck(){
	if($('#hiddenService_systemBankFlag').val() == 'N' && $('#acctType').val() != 'FAC00010'){
        $('#chkImgSubAccounts').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
        $('#chkService_acctUsageSubAccounts').removeAttr('onclick');
        $('#hiddenService_acctUsageSubAccounts').val('N');
    }
	else{
		if($('#hiddenService_acctUsageSubAccounts').val() == 'Y') {
			$('#chkImgSubAccounts').attr('src', 'static/images/icons/icon_checked.gif');
			$("#chkService_acctUsageSubAccounts").attr("onclick", "toggleCheckbox(this);launchExtApplication();");
			$('#hiddenService_acctUsageSubAccounts').val('Y');
		}
		else{
			$('#chkImgSubAccounts').attr('src', 'static/images/icons/icon_unchecked.gif');
			$("#chkService_acctUsageSubAccounts").attr("onclick", "toggleCheckbox(this);launchExtApplication();");
			$('#hiddenService_acctUsageSubAccounts').val('N');
		}
	}
	
}

function handleDebitLevel(strProductLevel,strDebitAccountLevel,strValueDateLevel,strFxRateLevel,element){
	var _debitLevel;
	var isGray = false;
	if(element.length == 1)
		_debitLevel = element[0].value;
	else
		_debitLevel = element.value;
	var isBatchFields = (strProductLevel === 'B' && strDebitAccountLevel === 'B' && strValueDateLevel === 'B') ? true: false ;
	strProductLevel = isEmpty(strProductLevel)?"I":strProductLevel;
	strDebitAccountLevel = isEmpty(strDebitAccountLevel)?"I":strDebitAccountLevel;
	strValueDateLevel = isEmpty(strValueDateLevel)?"I":strValueDateLevel;
	strFxRateLevel = isEmpty(strFxRateLevel)?"I":strFxRateLevel;
	if(!isEmpty(_debitLevel) && _debitLevel=="B")
	{
		isGray = false;
		$('#chkFxRateLevel').attr('disabled', 'disabled');
		$('#chkFxRateLevel').attr('src','static/images/icons/icon_unchecked_grey.gif');
		$('#chkFxRateLevel').removeAttr("onclick");
		
		toggleGrayCheckUncheckLevels('#chkFxRateLevel','fxRateLevel',"I",true);
		toggleGrayCheckUncheckLevels('#chkProductLevel','productLevel',strProductLevel,isGray);
		toggleGrayCheckUncheckLevels('#chkDebitAccountLevel','debitAccountLevel',strDebitAccountLevel,isGray);
		toggleGrayCheckUncheckLevels('#chkValueDateLevel','valueDateLevel',strValueDateLevel,isGray);
	}
	else 
	{	
				
		toggleGrayCheckUncheckLevels('#chkProductLevel','productLevel',strProductLevel,isGray);
		toggleGrayCheckUncheckLevels('#chkDebitAccountLevel','debitAccountLevel',strDebitAccountLevel,isGray);
		toggleGrayCheckUncheckLevels('#chkValueDateLevel','valueDateLevel',strValueDateLevel,isGray);
		toggleGrayCheckUncheckLevels('#chkFxRateLevel','fxRateLevel',strFxRateLevel,isBatchFields ? false : true);
	
	}
}



function toggleCheckUncheckBatchLevels(imgElement,flag){
	
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1)
	{
		imgElement.src = "static/images/icons/icon_checked.gif";
		$('#'+flag).val('B');
		var isBatchFields = ($('#productLevel').val() === 'B' && $('#debitAccountLevel').val() === 'B' && $('#valueDateLevel').val() === 'B') ? true: false ;
		var debitLevel = $("input[type=radio][name=debitLevel]:checked")[0].value;
		if(((!isEmpty($('#customLayoutId').val()) && $('#customLayoutId').val() != 'MIXEDLAYOUT' && $('#customLayoutId').val() != 'CHECKSLAYOUT') && isBatchFields)
				||(debitLevel === "I" && isBatchFields))
		{
			$('#chkFxRateLevel').attr("onclick","toggleCheckUncheckFxLevels(this,'chkFxRateLevel');setDirtyBit()");
			$('#chkFxRateLevel').attr('src', 'static/images/icons/icon_checked.gif');
			$('#fxRateLevel').val('B');
		}
		else{			
			$('#fxRateLevel').val('I');
			$('#chkFxRateLevel').removeAttr('onclick');
			$('#chkFxRateLevel').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		}
	}
	else
	{
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		$('#'+flag).val('I');
		if(flag != 'fxRateLevel'){
			$('#fxRateLevel').val('I');
			$('#chkFxRateLevel').removeAttr('onclick');
			$('#chkFxRateLevel').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		}
		
	}
}


function toggleGrayCheckUncheckLevels(imgElement, fieldId, flag, isGray)
{
	$('#'+fieldId).val(flag);
	
	if (flag === 'B')
	{
		if(isGray === true) {
			$(imgElement).attr('src','static/images/icons/icon_checked_grey.gif');
			$(imgElement).removeAttr('onclick');
		}
		else {
			$(imgElement).attr('src','static/images/icons/icon_checked.gif');
			
			if(fieldId != 'fxRateLevel')
				$(imgElement).attr("onclick","toggleCheckUncheckBatchLevels(this, '"+fieldId+"');setDirtyBit()");
			else
				$(imgElement).attr("onclick","toggleCheckUncheckFxLevels(this, '"+fieldId+"');setDirtyBit()");
		}
	}
	else
	{
		if(isGray === true) {
			$(imgElement).attr('src','static/images/icons/icon_unchecked_grey.gif');
			$(imgElement).removeAttr('onclick');
		}
		else {
			$(imgElement).attr('src','static/images/icons/icon_unchecked.gif');
			
			if(fieldId != 'fxRateLevel')
				$(imgElement).attr("onclick","toggleCheckUncheckBatchLevels(this, '"+fieldId+"');setDirtyBit()");
			else
				$(imgElement).attr("onclick","toggleCheckUncheckFxLevels(this, '"+fieldId+"');setDirtyBit()");
		}
	}
	
}

function getAgreementHamperedPopup(prodType, oldProd)
{
	strProdType = prodType;
	strOldProd = oldProd;
	if (Ext.isEmpty(objLiquidityProdChangePopup))
	{
		objLiquidityProdChangePopup = Ext.create('CPON.view.LiquidityProductChangePopup', {
			itemId : 'liquidityProductChangePopup',
			fnCallback : setSelectedLiqFeatureItems,
			profileId : liquidityPofileId, 
			featureType : 'P',
			module : '04',
			title : getLabel('agreementNotif', 'Affected Agreements Notification'),
			isAllSelected : isLiquidityOptionsAllSelected
		});
	}
	objLiquidityProdChangePopup.show();
	objLiquidityProdChangePopup.center();
}

function getDefDebitAcctConfirmationPopup(frmId, strUrl) {
    $('#defaultDebitAcctConfirmMsgPopup').dialog({
            autoOpen : false,
            maxHeight: 550,
            minHeight:'auto',
            width : 400,
            modal : true,
            resizable: false,
            draggable: false      
        
    });
    $('#defAcctTextContent').text("");
    if($('#hiddenService_defaultDebitAcc').val() === "Y")
    	$('#defAcctTextContent').text(defAcctCnfText);
    /*else
    	$('#defAcctTextContent').text(defAcctDisableCnfText);*/ /*commented as no requirement on uncheck action */
    $('#defaultDebitAcctConfirmMsgPopup').dialog("open");
    if(event)
        event.preventDefault();
    $('#cancelDefAcctConfirmMsgbutton').bind('click',function(){
        $('#defaultDebitAcctConfirmMsgPopup').dialog("close");
    });
  $('#okDefAcctConfirmMsgbutton').bind('click',function(){
		$('#defaultDebitAcctConfirmMsgPopup').dialog("close");
		showAccountList(strUrl, frmId);
	});
    $('#defAcctTextContent').focus();
}

function autoApproveAllAchDecisionChange(){
    var imgDependentElement = $('#chkImg_POSPAYAUTOAPPCCY');
    var strElementId = 'chkImg_FPOP-000010';
    var imgElement = $('#'+strElementId) && $('#'+strElementId).length >0 ? $('#'+strElementId)[0]:null;
    var elementId = imgElement.getAttribute("id").replace("chkImg_", "");
    if(imgDependentElement && imgDependentElement.length>0){
        imgDependentElement = imgDependentElement[0];
        if (imgDependentElement.src.indexOf("icon_checked.gif") > -1)
        {
            if(imgElement.src.indexOf("icon_checked.gif") > -1)
            {
                imgElement.src = "static/images/icons/icon_unchecked_grey.gif";
                $(imgElement).attr('onclick','');
            }
            else{
                imgElement.click();
                imgElement.src = "static/images/icons/icon_unchecked_grey.gif";
                $(imgElement).attr('onclick','');
            }
        }
        else
        {
            imgElement.src = "static/images/icons/icon_checked.gif";
            $(imgElement).attr('onclick','setDirtyBit();checkuncheckFeature(this,"FPOP-000010")');
        }
    }
}
function autoDecisionChange()
{	 
		$('#anonymRecLimitAmt').attr('disabled', 'disabled');
		$('#anonymRecLimitAmt').addClass('disabled');
		$('#defActExcpUnapprAmtCcyCode').attr('disabled', 'disabled');
		$('#defActExcpUnapprAmtCcyCode').addClass('disabled');
		$('#defActExcpUnapprAmtCcyCode').val(defActExcpUnapprAmtCcyCode); 				 
		$('#anonymRecLimitAmt').val('');
}

function clientCodeToClientDesc()
{
	if (cponClientCode == 'Y')
	{
		if (clientCodeToDesc == 'Y' )
		{	
			$('#clientName').val('');
			if( $('#clientCode').val() != '')
			{
				$('#clientName').val($('#clientCode').val() +' : ');
			}	
			if(clientCodeToAlternate == 'Y' && $('#clientNameInEnglish').val() != '')
			{
				$('#clientName').val($('#clientName').val() + $('#clientNameInEnglish').val());
			}
		}
		if (clientCodeToShort == 'Y' && $('#clientShortName').val() == '') 
		{
			$('#clientShortName').val($('#clientCode').val());
		}
	}
}

function populateCompanyName()
{
	if(clientCodeToAlternate == 'Y')
	{
		if (clientCodeToDesc == 'Y' && $('#clientCode').val() != '' )
		{
			$('#clientName').val($('#clientCode').val() +' : '+ $('#clientNameInEnglish').val());
		}
		else
		{
			$('#clientName').val($('#clientNameInEnglish').val());
		}
	}
}

function fetchPosByGstInId() {
    if($('#gstStateCode').val() == '')
    {
        var gstInId = $('#gstnId').val();
        if(gstInId != '' && gstInId.length > 2)
        {
            var gstInStateCode = gstInId.substring(0, 2);
            $.ajax({
                url : "services/userseek/posByGstInId.json",
                dataType: 'json',
                data : {
                    top : -1,
                    $filtercode1 : gstInStateCode,
                    $filtercode2 : sellerCountry
                },
                success : function(data) {
                    if (data && data.d && data.d.preferences && data.d.preferences[0]) {
                        var rec = data.d.preferences[0];
                        $('#gstStateCode').val(rec.CODE);
                        $('#pointOfService').val(rec.CODE+' | '+rec.DESCRIPTION);
                    }
                    else
                    {
                        $('#gstStateCode').val('');
                        $('#pointOfService').val('');
                    }
                }
            });
        }
    }
}

function toggleClientDisabledFlag(element)
{
    var image = element.getElementsByTagName("IMG")[0];
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        $("#clientDisabledFlag").val('Y');
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        $("#clientDisabledFlag").val('N');
    }
}

function toggleCheckUncheckCreditCardOrRetail(imgElement, flag) {
    var collectionFlag = $("#hiddenService_05").val() ? $("#hiddenService_05").val() : 'N';
    var clientAsFIFlag = $("#hiddenService_CLIENTISFI").val() ? $("#hiddenService_CLIENTISFI").val() : 'N';
    var creditCardClientFlag = $("#hiddenService_CREDITCARD").val() ? $("#hiddenService_CREDITCARD").val() : 'N';
    if (imgElement.src.indexOf("icon_unchecked_grey.gif") == -1) {
        if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
            imgElement.src = "static/images/icons/icon_checked.gif";
            $('#' + flag).val('Y');
            if((flag === 'hiddenService_CREDITCARD') || (flag === 'hiddenService_CLIENTISFI')){
                if (undefined != $('#chkretailCustomer')[0])
                {
                    $('#chkretailCustomer').attr('src','static/images/icons/icon_unchecked_grey.gif');
                    $('#chkretailCustomer').attr('disabled','true');
                    $('#chkretailCustomer').removeAttr("onclick");
                }
            }
            else if(flag === 'hiddenService_RETAILCUST' && validFlag == 'N'){
                if (undefined != $('#chkcreditCardClient')[0])
                {
                    $('#chkcreditCardClient').attr('src','static/images/icons/icon_unchecked_grey.gif');
                    $('#chkcreditCardClient').attr('disabled','true');
                    $('#chkcreditCardClient').removeAttr("onclick");
                }
                if (undefined != $('#chkclientIsFi')[0])
                {
                    $('#chkclientIsFi').attr('src','static/images/icons/icon_unchecked_grey.gif');
                    $('#chkclientIsFi').attr('disabled','true');
                    $('#chkclientIsFi').removeAttr("onclick");
                }
            }
        } else {
            imgElement.src = "static/images/icons/icon_unchecked.gif";
            $('#' + flag).val('N');
                if(flag === 'hiddenService_CREDITCARD' && clientAsFIFlag == 'N' && collectionFlag === "Y")
                {
	                $('#chkretailCustomer').attr('src','static/images/icons/icon_unchecked.gif');
	                $('#chkretailCustomer').removeAttr('disabled');
	                $('#chkretailCustomer').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_RETAILCUST');setDirtyBit();");
                }
                else if(flag === 'hiddenService_CLIENTISFI' && creditCardClientFlag == 'N' && collectionFlag === "Y")
                {
	                $('#chkretailCustomer').attr('src','static/images/icons/icon_unchecked.gif');
	                $('#chkretailCustomer').removeAttr('disabled');
	                $('#chkretailCustomer').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_RETAILCUST');setDirtyBit();");
                }
	            else if(flag === 'hiddenService_RETAILCUST' && validFlag == 'N' && collectionFlag === "Y")
	            {
	                $('#chkcreditCardClient').attr('src','static/images/icons/icon_unchecked.gif');
	                $('#chkcreditCardClient').removeAttr('disabled');
	                $('#chkcreditCardClient').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_CREDITCARD');setDirtyBit();");
	                $('#chkclientIsFi').attr('src','static/images/icons/icon_unchecked.gif');
	                $('#chkclientIsFi').removeAttr('disabled');
	                $('#chkclientIsFi').attr("onclick","toggleCheckUncheckCreditCardOrRetail(this,'hiddenService_CLIENTISFI');setDirtyBit();");
	            }
        }
    }
}
function toggleEnableDisable(imgElement, id) 
{
    if (imgElement.src.indexOf('icon_unchecked_grey.gif') == -1 && imgElement.src.indexOf('icon_checked_grey.gif') == -1)
    {
        if (imgElement.src.indexOf('icon_unchecked.gif') > -1)
        {
            imgElement.src = 'static/images/icons/icon_checked.gif';
            $('#' + id).val('Y');
            enableTotalLimitFields();
        }
        else
        {
            imgElement.src = 'static/images/icons/icon_unchecked.gif';
            $('#' + id).val('N');
            disableTotalLimitFields();
            cleartotalLimitFields();
        }
    }
}

function enableTotalLimitFields()
{
    $('#totalCorpLimit').removeAttr('disabled');
    $('#totalCorpLimit').removeClass('disabled');
    $('#limitExpiryDate').removeAttr('disabled');
    $('#limitExpiryDate').removeClass('disabled');
    $('#lblLimitExpiryDate').addClass('required-lbl-right');
}

function disableTotalLimitFields()
{
    $('#totalCorpLimit').attr('disabled','true');
    $('#totalCorpLimit').addClass('disabled');
    $('#limitExpiryDate').attr('disabled','true');
    $('#limitExpiryDate').addClass('disabled');
    $('#lblLimitExpiryDate').removeClass('required-lbl-right');
}

function cleartotalLimitFields()
{
    $('#totalCorpLimit').val('');
    $('#totalCorpLimitUtilized').val('');
    $('#totalCorpLimitUnutilized').val('');
    $('#limitExpiryDate').val('');
	if(totalCorpLimitFlag == 'Y')
		createWarnDialog("Warning", getLabel("totalCorpLimitWarning","Total Corporation limit is removed, kindly review Risk manager Action"));
    $('#limitRemarks').val('');
}

function toggleCreditCardClientFlag(element)
{
    var image = element.getElementsByTagName("IMG")[0];
    if (image.src.indexOf("icon_checked.gif") == -1) {
        image.src = "static/images/icons/icon_checked.gif";
        $("#creditCardClient").val('Y');
    } else {
        image.src = "static/images/icons/icon_unchecked.gif";
        $("#creditCardClient").val('N');
    }
}

function createWarnDialog(title, text1) {
    return $("<div class='dialog' title='" + title + "'><div class = 'ux-view-labelValuePair-dialog label-color' style = 'margin:13px;'>" + text1 + "</div></div>")
    .dialog({
		maxHeight: 550,
		minHeight:'auto',
		width : 400,
		modal : true,
		resizable: false,
		draggable: false,
        buttons: {
            "Ok": function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

function getIsAuthorized(isAuthorized)
{
	var retValue = 'N';
	if (isAuthorized == true || isAuthorized == 'Y')
	{
		retValue = 'Y';
	}
	return retValue;
}
