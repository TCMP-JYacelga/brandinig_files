function getCancelConfirmPopUp(strUrl) {
    if ( $('#dirtyBitSet').val() == 'true' ){
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
        $('#cancelConfirmMsg').bind('click',function(){
            $('#confirmMsgPopup').dialog("close");
        });
        
        $('#doneConfirmMsgbutton').bind('click',function(){
            $('#confirmMsgPopup').dialog("close");
            gotoPage(strUrl,'frmMain');
        });
        $('#textContent').focus();
    } else {
        gotoPage(strUrl,'frmMain');
    }
}

function goToPage(strUrl, frmId) 
{    
    $('form#frmMain').find('input,select,checkbox,textarea').removeAttr('disabled');
    var frm = document.getElementById(frmId);
    frm.action = strUrl;
    frm.target = "";
    frm.method = "POST";
    frm.submit(); 
}        

function setDirtyBit()
{
    document.getElementById( "dirtyBitSet" ).value = 'true';
    $(".submit_button").removeClass("disabled");
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

jQuery.fn.DraweeBankAutoComplete = function() {
    return this.each(function() {
        $(this).autocomplete({
            source : function(request, response) {
                $.ajax({
                            url : 'services/userseek/draweeBankSuspension.json',
                            dataType : "json",
                            data : {
                                top : -1,
                                $autofilter : request.term
                            },
                            success : function(data) {
                                if (data && data.d && data.d.preferences) {
                                    var rec = data.d.preferences;
                                    response($.map(rec, function(item) {
                                                return {
                                                    label : item.DESCRIPTION,
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
                                $("#draweeBankCode").val('');
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
                    $("#draweeBankCode").val(ui.item.details.CODE);
                    $(this).attr('oldValue',ui.item.label);
                    setDirtyBit();
                }
            },
            change : function() {
                if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val()))
                {
                    $("#draweeBankCode").val('');
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
                if ($('#draweeBankCode').val() == '')
                {  
                    $(this).val('');
                    setDirtyBit();
                }
                if ($(this).val() == '')
                {
                    $('#draweeBankCode').val('');
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

function setCheckUnchekDisable(flag, field)
{
    if(flag=='Y')
    {
        $('#'+field).attr('src','static/images/icons/icon_checked_grey.gif');
    }
    else
    {
        $('#'+field).attr('src','static/images/icons/icon_unchecked_grey.gif');
    }
}

function showWarnMessage(){
	var errorContainer = $('#errorContainerDiv');
	var errorMessage=$("#errorContainerMessage");
	errorContainer.empty();
	if ($('#errorContainerDiv').hasClass('ui-helper-hidden')) {
			$('#errorContainerDiv').removeClass('ui-helper-hidden');
		}
	var errorMsg = '';
	errorMsg+=getLabel('draweeSuspensionError','No Updates in Drawee Bank Suspension Master to Submit');
	errorContainer.append(errorMsg);	
	
}