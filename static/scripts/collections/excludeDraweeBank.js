jQuery.fn.DraweeBankAutoComplete = function() {
 return this.each(function() {
  $(this).autocomplete({
     source : function(request, response) {
      $.ajax({
         url : "services/userseek/excludeDraweeBankSeek.json",
         dataType : "json",
         data : {
          $autofilter : request.term,
         },
         success : function(data) {
          if(data && data.d && data.d.preferences)
          {
              var rec = data.d.preferences;
              response($.map(rec, function(item) {
                 return {
                  label : item.CODE,
                  bankDtl : item
                 }
              }));
          }
          else
          {
              if($(this).hasClass("ui-corner-top")){
                  $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                  $(".ui-menu").hide();
              }
          }
          $('#draweeBankDesc').val('');
          $(this).focus();
         }
        });
     },
     focus: function( event, ui ) {
         $(".ui-autocomplete > li").attr("title", ui.item.label);
     },
     minLength : 1,
     select : function(event, ui) {
      var data = ui.item.bankDtl;
      if (data && !isEmpty(data.DESCRIPTION)) {
          $('#draweeBankDesc').val(data.DESCRIPTION);
          $(this).attr('oldValue',ui.item.label);
          setDirtyBit();
      }
     },
     change : function() {
         if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val()))
         {
             $("#draweeBankDesc").val('');
             $(this).val('');
             setDirtyBit();
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
    });
  $(this).on('blur',function(){
      if(!$('.ui-autocomplete.ui-widget:visible').length) {
          if ($('#draweeBankDesc').val() == '')
          {  
              $(this).val('');
              setDirtyBit();
          }
          if ($(this).val() == '')
          {
              $('#draweeBankDesc').val('');
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

function setDirtyBit()
{
    document.getElementById("dirtyBitSet").value = 'true';
    $(".submit_button").removeClass("disabled");
}

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

function submitViewForm(strUrl, frmId) {
    $('form#frmMain').find('input,select,checkbox').attr('disabled',false).addClass('disabled');
    goToPage(strUrl,frmId);
}

function goToPage(strUrl, frmId)
{
    $('form#frmMain').find('input,select,checkbox').removeAttr('disabled');
    var frm = document.getElementById(frmId);
    frm.action = strUrl;
    frm.target = "";
    frm.method = "POST";
    frm.submit();
}