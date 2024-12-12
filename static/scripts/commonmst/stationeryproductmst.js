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
            goToPage(strUrl,'frmMain');
        });
        $('#textContent').focus();
    } else {
    	goToPage(strUrl,'frmMain');
    }
}

function goToPage(strUrl, frmId)
{
    $("#productCode").removeAttr("disabled");
    $("input").removeAttr('disabled');
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

function showUploadDialog(hlnk) {
    var ctrlFile = document.getElementById('productImage');
    var ctrlFileUploadFlag = document.getElementById('fileUploadFlag');
    var viewLink = document.getElementById('viewAttachmentSampleFile');
    if (_blnSelected) {
        $(hlnk).text(getLabel( 'addImage', 'Add Image'));
        $(hlnk).attr("title", getLabel( 'addImage', 'Add Image'));
        if(undefined !== viewLink && null !== viewLink)
        {
            viewLink.innerHTML = '';
        }
        if (!$.browser.msie) {
            ctrlFile.value = '';
        } else {
            $("#productImage").replaceWith($("#productImage").clone(true));
        }
        _blnSelected = false;
        ctrlFileUploadFlag.value = "N";
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
                $("#productImage").replaceWith(
                        $("#productImage").clone(true));
            }
            _blnSelected = false;
            $(hlnk).text(getLabel( 'addImage', 'Add Image'));
            $(dlg).dialog('destroy');
            ctrlFileUploadFlag.value = "N";
        });
        dlg.find('#okImportLogo .ft-button').off('click');
        dlg.find('#okImportLogo .ft-button').on('click', function() {
            if (ctrlFile.value !== null && ctrlFile.value !== "") {
            	var n = ctrlFile.value.lastIndexOf("\\");
                var fileExt = ctrlFile.value.split('.').pop();
                var fileText = getLabel( 'removeImage', 'Remove Image');
                var ft = fileText;
                $(hlnk).text(fileText + "..");
                $(hlnk).attr("title", ft);
                _blnSelected = true;
                ctrlFileUploadFlag.value = "Y";
                setDirtyBit();
            }
            $(dlg).dialog('close');
        });
        
        dlg.find('#chooseLogoFile').off('click');
        dlg.find('#chooseLogoFile').on('click', function() {
            $('#productImage').click();
        });
        
        dlg.find('#productImage').off('change');
        dlg.find('#productImage').on('change', function() {
            var filename = $('#productImage').val();
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

function viewSignatureAttachment(frmId) {
	var strUrl = 'stationeryProductMst/viewImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+'&viewState=' +
        document.getElementById("viewState").value+'&displayViewChanges='+displayViewChanges;
    $.ajax({
        type : 'POST',
        url : strUrl,
        dataType : 'html',
        success : function( data ){
            $('#productImageDiv').html( '<img src="data:image/jpeg;base64,' + data + '"/>' );
            $('#productImageDiv').dialog(
            {
                bgiframe : true,
                autoOpen : false,
                height : "600",
                modal : true,
                resizable : true,
                width : "1000",
                title : getLabel( 'prodImage', 'Stationery Product Image'),
                buttons :
                {
                    "OK" : function()
                    {
                        $( this ).dialog("close");
                    },   
                },
            });
            $('#dialogMode').val('1');
            $('#productImageDiv').dialog('open');
        },
        error : function(request,status,error)
        {
            $( '#productImageDiv').html( '<img src="./static/images/misc/no_image.jpg"/>');
            $( '#productImageDiv').dialog(
            {
                bgiframe : true,
                autoOpen : false,
                height : "340",
                modal : true,
                resizable : true,
                width : "300",
                zIndex: '29001',
                title : getLabel( 'prodImage', 'Stationery Product Image'),
                buttons :
                {
                    "Cancel" : function()
                    {
                        $(this).dialog("close");
                    }
                }
            } );
            $('#dialogMode').val('1');
            $('#productImageDiv').dialog('open');
        }
    });
}
