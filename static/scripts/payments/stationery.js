jQuery.fn.stateAutoComplete = function() {
 return this.each(function() {
  $(this).autocomplete({
     source : function(request, response) {
      $.ajax({
         url : "services/userseek/stationeryState.json",
         dataType : "json",
         data : {
          $autofilter : request.term,
          $filtercode1 : $('#country').val()
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
          $('#dispBankCode').val('');
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
          $('#stateCode').val(data.CODE);
          $(this).attr('oldValue',ui.item.label);
          setDirtyBit();
      }
     },
     change : function() {
         if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val()))
         {
             $("#stateCode").val('');
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
          if ($('#stateCode').val() == '')
          {  
              $(this).val('');
              setDirtyBit();
          }
          if ($(this).val() == '')
          {
              $('#stateCode').val('');
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
         url : "services/userseek/StationeryIndProduct.json",
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
      if (data && !isEmpty(data.CODE)) {
          $('#productCode').val(data.CODE);
          $(this).attr('oldValue',ui.item.label);
          addLinkViewImage();
          setDirtyBit();
      }
     },
     change : function() {
         if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val()))
         {
             $("#productCode").val('');
             $(this).val('');
             removeLinkViewImage();
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
              removeLinkViewImage();
              setDirtyBit();
          }
          if ($(this).val() == '')
          {
              $('#productCode').val('');
              removeLinkViewImage();
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

jQuery.fn.requestBranchAutoComplete = function() {
	 return this.each(function() {
	  $(this).autocomplete({
	     source : function(request, response) {
	      $.ajax({
	         url : "services/userseek/stationeryRequestBranch.json",
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
	          $('#requestBranchCode').val('');
	          $('#stateCode').val('');
	          $('#stateDesc').val('');
	          $('#country').val('');
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
	      if (data) {
	    	  if(!isEmpty(data.CODE))
	    	  {
		          $('#requestBranchCode').val(data.CODE);
		          $(this).attr('oldValue',ui.item.label);
	    	  }
	    	  if(!isEmpty(data.STATE_CODE) && !isEmpty(data.STATE_DESC))
	    	  {
	    		  $('#stateCode').val(data.STATE_CODE);
	    		  $('#stateDesc').val(data.STATE_DESC);
	    	  }
	    	  if(!isEmpty(data.COUNTRY_CODE))
	    	  {
	    		  $('#country').val(data.COUNTRY_CODE);
	    	  }
	          setDirtyBit();
	      }
	     },
	     change : function() {
	         if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val()))
	         {
	             $("#requestBranchCode").val('');
	             $('#stateCode').val('');
		         $('#stateDesc').val('');
		         $('#country').val('');
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
	          if ($('#requestBranchCode').val() == '')
	          {  
	              $(this).val('');
	              $('#stateCode').val('');
		          $('#stateDesc').val('');
		          $('#country').val('');
	              setDirtyBit();
	          }
	          if ($(this).val() == '')
	          {
	              $('#requestBranchCode').val('');
	              $('#stateCode').val('');
		          $('#stateDesc').val('');
		          $('#country').val('');
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

function resetInstNumber()
{
    $('#startInstNmbr').val('');
    $('#endInstNmbr').val('');
}

function calEndInstNumber()
{
    var startInst = $('#startInstNmbr').val();
    var receivedQuantity = $('#receivedQuantity').val();
    if(receivedQuantity !='' && startInst != '' && parseInt(receivedQuantity) > 0 && parseInt(startInst) >0)
    {
    	$('#endInstNmbr').val(parseInt(receivedQuantity)+parseInt(startInst)-1);
    }
    else
    {
    	$('#endInstNmbr').val('');
    }
}

function addLinkViewImage()
{
    $("#productImage").addClass("thePointer button_underline");
    $("#productImage").bind('click',function(){
    	viewStationeryProductImage();
    });
}

function removeLinkViewImage()
{
    $("#productImage").removeClass("thePointer button_underline");
    $("#productImage").unbind('click');
}

function viewStationeryImage(productCode,sellerCode)
{
	var strUrl = 'stationeryProductMst/viewStationeryImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+'&productCode=' +
    productCode+'&sellerCode='+sellerCode;
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
            $('#productImageDiv').dialog('open');
        }
    });
}

function viewStationeryProductImage() {
    var productCode = $("#productCode").val();
    if(productCode != '')
    {
        viewStationeryImage(productCode,sellerCode);
    }
}

jQuery.fn.NumericOnlyWithoutPrefixZero = function() {
	return $(this).each(function() {
		$(this).on('input', function(eventObj) {
			$(eventObj.target).val($(eventObj.target).val().replace(/[^0-9]/g, ''));
			$(eventObj.target).val($(eventObj.target).val().replace(/^0+/, ''));
		});
	});
};