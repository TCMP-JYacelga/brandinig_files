var arrDlyStatus =  [
      {
        "CODE": "7",
        "DESCRIPTION": "Dispatch to Customer"
      },
      {
        "CODE": "2",
        "DESCRIPTION": "Dispatch to Beneficiary"
      }
    ];

jQuery.fn.clientCodeAutoComplete = function() {
 return this.each(function() {
  $(this).autocomplete({
     source : function(request, response) {
      $.ajax({
         url : "services/userseek/clientSeek.json",
         dataType : "json",
         data : {
          $autofilter : request.term
         },
         success : function(data) {
          if(data && data.d && data.d.preferences)
          {
        	  var rec = data.d.preferences;
              response($.map(rec, function(item) {
                 return {
                  label : item.CLIENT_NAME,
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
          $('#clientId').val('');
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
      if (data && !isEmpty(data.CLIENT_ID)) {
    	  $('#clientId').val(data.CLIENT_ID);
          $(this).attr('oldValue',ui.item.label);
          setDirtyBit();
      }
     },
     change : function() {
         if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val()))
         {
             $("#clientId").val('');
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
          if ($('#clientId').val() == '')
          {  
              $(this).val('');
              setDirtyBit();
          }
          if ($(this).val() == '')
          {
              $('#clientId').val('');
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

jQuery.fn.productCodeAutoComplete = function() {
 return this.each(function() {
  $(this).autocomplete({
     source : function(request, response) {
      $.ajax({
         url : "services/userseek/courierProduct.json",
         dataType : "json",
         data : {
          $autofilter : request.term
         },
         success : function(data) {
          if(data && data.d && data.d.preferences)
          {
        	  var rec = data.d.preferences;
              response($.map(rec, function(item) {
                 return {
                  label : item.PRODUCT_DESCRIPTION,
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
          $('#productCode').val('');
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
      if (data && !isEmpty(data.PRODUCT_CODE)) {
    	  $('#productCode').val(data.PRODUCT_CODE);
    	  $(this).attr('oldValue',ui.item.label);
          setDirtyBit();
      }
     },
     change : function() {
         if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val()))
         {
             $("#productCode").val('');
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
          if ($('#productCode').val() == '')
          {  
              $(this).val('');
              setDirtyBit();
          }
          if ($(this).val() == '')
          {
              $('#productCode').val('');
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

jQuery.fn.printBranchAutoComplete = function() {
 return this.each(function() {
  $(this).autocomplete({
     source : function(request, response) {
      $.ajax({
         url : "services/userseek/printBranch.json",
         dataType : "json",
         data : {
          $autofilter : request.term
         },
         success : function(data) {
          if(data && data.d && data.d.preferences)
          {
        	  var rec = data.d.preferences;
              response($.map(rec, function(item) {
                 return {
                  label : item.DESCRIPTION,
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
          $('#printBranchCode').val('');
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
      if (data && !isEmpty(data.CODE)) {
    	  $('#printBranchCode').val(data.CODE);
    	  $(this).attr('oldValue',ui.item.label);
          setDirtyBit();
      }
     },
     change : function() {
         if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val()))
         {
             $("#printBranchCode").val('');
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
          if ($('#printBranchCode').val() == '')
          {  
              $(this).val('');
              setDirtyBit();
          }
          if ($(this).val() == '')
          {
              $('#printBranchCode').val('');
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

function sellerAutocompleter(){
    $.ajax({
        url :'services/userseek/sellerSeek.json',    
       // data : {$autofilter : request.term},
        success : function(responseText) {
            var responseData=responseText.d.preferences;
            setMenuItems("sellerAutocomplete",responseData,sellerCode);
        }
    });
}

function reloadData(me)
{
    //calling swith admin seller service on seller change
    if(me != null)
        setAdminSeller(me.value);
}

function goToPage(strUrl) {    
    var frm = document.createElement('FORM');
    frm.action = strUrl;
    frm.target = "";
    frm.method = "POST";
    document.body.appendChild(frm);
    frm.submit();
}

function setMenuItems(elementId,data,selectedCode) {
    var el = $("#"+elementId);
    el.attr('multiple',false);
    if (typeof data != 'undefined' && data) {
        for(index=0;index<data.length;index++)
        {
            var opt = $('<option />', {
                value: data[index].CODE,
                text: data[index].DESCRIPTION
            });
            
            if(data[index].CODE == selectedCode){
                        opt.attr('selected','selected');    
            }
            opt.appendTo(el);
        }
        filterStatusCount=data.length;
    }  
}    

function getCancelConfirmPopUp(strUrl,buttonclicked) {
    var courierAckNumber = document.getElementById('courierAckNumber').value;
    clearErrorMsgAndHideMsgDiv();  
    if('' == courierAckNumber){
       clearErrorMsgAndShowMsgDiv();
       if('' == courierAckNumber){
         $('#messageArea').append("<ul style='list-style-type:none;padding-left: 0px;'><li>Couirer ACK Number is required.</ul></li>");
       }
       return;
    }
    
    $('#cancelConfirmMsg').bind('click', function() {
        $('#confirmMsgPopup').dialog('close');
    });

    $('#doneConfirmMsgbutton').bind('click', function() {
        $(this).dialog('close');
        goToPageDetail(strUrl,buttonclicked);
    });
    $('#confirmMsgPopup').dialog({
        autoOpen : false,
        maxHeight : 550,
        minHeight : 'auto',
        width : 400,
        modal : true,
        resizable : false,
        draggable : false
    });
    $('#confirmMsgPopup').dialog('open');
    $('#textContent').focus();
}

function goToPageDetail(strAction,buttonclicked){
    if(listOfIdentifiers.length>0){
        document.getElementById("listOfIdentifiers").value=listOfIdentifiers.toString();    
    }
    var frm = document.getElementById("courierDlyFrm");
    frm.action = strAction;
    frm.target = "";
    frm.method = "POST";
    frm.submit();
}

function clearErrorMsgAndHideMsgDiv(){
   $( '#messageArea').empty();
   $( '#messageArea' ).addClass( 'hidden' );
   $( '#messageContentDiv' ).addClass( 'hidden' );  
}

function clearErrorMsgAndShowMsgDiv(){
   $('#messageArea').empty();
   $('#messageArea' ).removeClass( 'hidden' );
   $('#messageContentDiv' ).removeClass( 'hidden'); 
}
function setDirtyBit()
{
    document.getElementById("dirtyBit").value = 'true';
}