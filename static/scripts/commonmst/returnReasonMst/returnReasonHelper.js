var globalStrUrl = null ;
function getCancelConfirmPopUp(strUrl) {
    if ( $('#dirtyBitSet').val() == 'true') {
        $('#confirmMsgPopup').dialog({
            autoOpen : false,
            maxHeight: 550,
            minHeight:'auto',
            width : 400,
            modal : true,
            resizable: false,
            draggable: false
        });
        $('#confirmMsgPopup').dialog('open');
        $('#cancelConfirmMsgbtn').bind('click',function(){
            $('#confirmMsgPopup').dialog('close');
        });
        
        $('#doneConfirmMsgbtn').bind('click',function(){
            $('#confirmMsgPopup').dialog('close');
            goToHome(strUrl);
        });
        $('#textContent').focus();
    } else {
        goToHome(strUrl);
    }
}
function goToHome( strUrl )
{
    var frm = document.getElementById('frmMain');
    frm.action = strUrl;
    frm.target = '';
    frm.method = 'POST';
    frm.submit();
}
function saveReason( isPopup )
{ 
    $('#frmMain').find('input').addClass('enabled');
    $('#frmMain').find('input').attr('disabled', false );
    $('#frmMain').find('select').addClass('enabled');
    $('#frmMain').find('select').attr('disabled', false );
    var strUrl = null ;
    if( pageMode == 'ADD')
    {
        strUrl = 'saveReturnReasonMst.form';
    }
    else
    {
        strUrl = 'updateReturnReasonMst.form';
    }
    var frm = document.getElementById('frmMain');
    if(isPopup == 'Y')
        document.getElementById('fiprivclick').value = 'Y';
    frm.action = strUrl;
    frm.target = '';
    frm.method = 'POST';
    frm.submit();
}
function saveAndNext(url)
{ 
    $('#frmMain').find('input').addClass('enabled');
    $('#frmMain').find('input').attr('disabled', false );
    $('#frmMain').find('select').addClass('enabled');
    $('#frmMain').find('select').attr('disabled', false );
    var frm = document.getElementById('frmMain');
    frm.action ='submitReturnReasonMst.form';
    frm.target = '';
    frm.method = 'POST';
    frm.submit();
}
function ajaxError()
{
    alert('AJAX error, please contact admin!');
}
function editReturnReasonr( recordViewState )
{
    var frm = document.getElementById('frmMain');
    var strUrl = null;
    var viewState = document.getElementById('viewState');
    viewState.value= recordViewState;
    strUrl = 'editReturnReasonMst.form';
    strUrl = strUrl;
    frm.action = strUrl;
    frm.target = '';
    frm.method = 'POST';
    frm.submit();
}
function viewReturnReasonList( recordViewState )
{
    var frm = document.getElementById('frmMain');
    var strUrl = null;
    var viewState = document.getElementById('viewState');
    viewState.value= recordViewState;
    strUrl = 'showLiquidationReasonMst.srvc';
    strUrl = strUrl ;
    frm.action = strUrl;
    frm.target = '';
    frm.method = 'POST';
    frm.submit();
}
function setDirtyBit()
{
    document.getElementById('dirtyBitSet').value = 'true';
    $('.submit_button').removeClass('disabled');
}
function showConfirmPopup( strUrl )
{
    globalStrUrl = strUrl;
    document.getElementById('confirmPopup').style.visibility = 'visible';
    if( $('#dirtyBitSet').val() == 'true' || pageMode == 'ADD')
    {
        var dlg = $('#confirmPopup');
        dlg.dialog(
        {
            autoOpen : false,
            maxHeight: 550,
            minHeight:'auto',
            width : 400,
            modal : true,
            resizable: false,
            draggable: false
        } );
        dlg.dialog('open');
        $('#confirmPopup').dialog('open');
        $('#cancelConfirmMsg').bind('click',function(){
            closeConfirmPopup();
        });
        $('#doneConfirmMsgbutton').bind('click',function(){
            gotoHome('showLiquidationReasonMst.srvc');
        });
        $('#textContent').focus();
    }
    else
    {
        gotoHome('showLiquidationReasonMst.srvc');
    }
}//showConfirmPopup
function closeConfirmPopup()
{
    $('#confirmPopup').dialog('close');
}//closeConfirmPopup
function doSaveAndNext(url){
    if( $('#dirtyBitSet').val() == 'true' || pageMode == 'ADD')
    {
        saveAndNext(url);
    }
    else{
        gotoHome('showLiquidationReasonMst.srvc');
    }
}
function goToNextpage()
{
    var frm = document.getElementById('frmMain');
    frm.action = globalStrUrl;
    frm.target = '';
    frm.method = 'POST';
    frm.submit();
}//goToNextpage
function warnBeforeCancel(strUrl) {
    if( $('#dirtyBitSet').val() == 'true') {
        $('#confirmMsgPopup').dialog({
            autoOpen : false,
            height : 200,
            width : 420,
            modal : true,
            buttons : {
                'Yes' : function() {
                    var frm = document.forms['frmMain'];
                    frm.action = strUrl;
                    frm.target = '';
                    frm.method = 'POST';
                    frm.submit();
                },
                'No' : function() {
                    $(this).dialog('close');
                }
            }
        });
        $('#confirmMsgPopup').dialog('open');
    }
    else {
        var frm = document.forms['frmMain'];
        frm.action = strUrl;
        frm.target = '';
        frm.method = 'POST';
        frm.submit();
    }
}
function restSelectOption()
{
    document.getElementById('usrCategory').value=-1;
    document.getElementById('srcUserName').value=-1;    
}
function createFormField(element, type, name, value) {
    var inputField;
    inputField = document.createElement(element);
    inputField.type = type;
    inputField.name = name;
    inputField.value = value;
    return inputField;
}
function changeCase(ctrl)
{
    if (ctrl){
        ctrl.value = ctrl.value.toUpperCase().replace(/([^0-9A-Z])/g, '');
    }
}
function paintError(errorDiv,errorMsgDiv,errorMsg) {
    $(errorDiv).removeClass('ui-helper-hidden');
    element = $('<li class="error-msg-color">').text(errorMsg);
    element.appendTo(errorMsgDiv);
}
function showHideChargeType(productTypeCode){
    if(productTypeCode!=='D'){
        //Receivables 
        $('#retrychrgDiv').removeClass('hidden');
    }
    else{
    //Payments
     $('#retryLiqCharge2').removeAttr('checked')
     $('#retryLiqCharge1').attr('checked','checked');
     $('#retrychrgDiv').addClass('hidden');
    }
}
function updateReturnRasonType(productTypeCode,payCollDetail){
    $('#reasonType').find('option').remove();
    $('#reasonType').removeAttr('disabled');
    $('#productTypeCode').val(productTypeCode);
    if(productTypeCode=='D'){
        if(isInList(payCollDetail,'01,02,07')){
            // Payment – Physical
            $('#reasonType').append(new Option(getLabel('F', 'Financial'), 'F'));
            $('#reasonType').append(new Option(getLabel('H', 'Technical Return'), 'H'));
            $('#reasonType').val('F');
        }else{
            //Payment – Electronic
            $('#reasonType').append(new Option(getLabel('F', 'Financial'), 'F')).attr('disabled', 'disabled');
            $('#reasonType').val('F');
        }
    }else{
         if(payCollDetail=='15' || payCollDetail=='10' ||payCollDetail=='11'){
            //Receivables – Out /local/ local non bank
            $('#reasonType').append(new Option(getLabel('F', 'Financial'), 'F'));
            $('#reasonType').append(new Option(getLabel('L', 'Lost'), 'L'));
            $('#reasonType').append(new Option(getLabel('T', 'Technical'), 'T'));
            $('#reasonType').append(new Option(getLabel('J', 'Reject'), 'J'));
            if(payCollDetail=='15'){
                $('#reasonType').val('T');
            }
            else
            {
                $('#reasonType').val('F');
            }
        }
        else{
            //Receivables - Direct Debit
            $('#reasonType').append(new Option(getLabel('F', 'Financial'), 'F'))
            $('#reasonType').append(new Option(getLabel('T', 'Technical'), 'T'));
            $('#reasonType').val('F');
        }
    }
    if(pageMode=='ADD'){
        updateChargeType()
    }
    if(reasonTypeSelection != ''){
        $('#reasonType').val(reasonTypeSelection);
    }
    enableDisableTxnRetry();
}
function isInList(ctype,csvList){
    var listValuse=csvList.split(',');
    for(var i = 0; i < listValuse.length; i++){
        if(listValuse[i]==ctype){
            return true;
        }
    }
    return false;
}
function  updateChargeType(){
    if($('#productTypeCode').val()=='D'){
        $('#retryLiqCharge2').removeAttr('checked');
        $('#retryLiqCharge1').attr('checked','checked');
    }
    else{
        if($('#reasonType').val()=='F' || $('#reasonType').val()=='T'){
            $('#retryLiqCharge2').removeAttr('checked');
            $('#retryLiqCharge1').attr('checked','checked');
        }else{
            $('#retryLiqCharge1').removeAttr('checked')
            $('#retryLiqCharge2').attr('checked','checked');
        }
   }
}
function enableDisableTxnRetry(){
    $('#retryDirectDebitTxn1').attr('disabled', false);
    $('#retryDirectDebitTxn2').attr('disabled', false);
    $('#retryLiqCharge1').attr('disabled', false);
    $('#retryLiqCharge2').attr('disabled', false);
    if('J' == $('#reasonType').val()){
        $('#retryDirectDebitTxn1').attr('disabled', true);
        $('#retryDirectDebitTxn2').attr('disabled', true);
        $('#retryDirectDebitTxn1').removeAttr('checked')
        $('#retryDirectDebitTxn2').attr('checked','checked');
        $('#retryLiqCharge1').attr('disabled', true);
        $('#retryLiqCharge2').attr('disabled', true);
        $('#retryLiqCharge1').removeAttr('checked')
        $('#retryLiqCharge2').attr('checked','checked');
    }
}
function highlightRadioSpan(radioName,className){
    var arr=$('input[name='+radioName+']');
    for (i=0;i<arr.length;i++){
        if($(arr[i]).is(':checked')){
           $(arr[i]).next('span').addClass(className);
        }
    }
}
function showChanges(strUrl,viewMode)
{
    var frm = document.getElementById('frmMain');
    frm.appendChild(createFormField('INPUT', 'HIDDEN','VIEW_MODE', viewMode));
    frm.action = strUrl;
    frm.target = '';
    frm.method = 'POST';
    frm.submit();
}