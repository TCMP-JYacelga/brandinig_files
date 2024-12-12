﻿function setAutoCompleter(fieldId,fieldDesc,seekId,code1,code2,code3,code4,code5){
    $('#'+fieldDesc).autocomplete({
        minLength: 1,
        source: function(request, response) {
            $.ajax({
                url :'services/userseek/'+seekId+'.json',
                dataType : "json",
                data :{
                    $autofilter : request.term,
                    $filtercode1 : code1,
                    $filtercode2 : code2,
                    $filtercode3 : code3,
                    $filtercode4 : code4,
                    $filtercode5 : code5
                },
                async: false,  
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
                    $('#'+fieldId).val('');
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
                $('#'+fieldId).val(ui.item.details.CODE);
                $(this).attr('oldValue',ui.item.label);
                setDirtyBit();
            }
        },
        change : function() {
            if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val()))
            {
                $('#'+fieldId).val('');
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
    $('#'+fieldDesc).on('blur',function(){
        if(!$('.ui-autocomplete.ui-widget:visible').length) {
            if ($('#'+fieldId).val() == '')
            {  
                $(this).val('');
                setDirtyBit();
            }
            if ($(this).val() == '')
            {
                $('#'+fieldId).val('');
                setDirtyBit();
            }
        }
        else
        {
            $(this).focus();
        }
    });
}

function setAutoCompleterWithField(fieldId,fieldDesc,seekId,fieldId1,fieldId2,fieldId3,fieldId4,fieldId5){
    $('#'+fieldDesc).autocomplete({
        minLength: 1,
        source: function(request, response) {
            var code1=$('#'+fieldId1).val();
            var code2=$('#'+fieldId2).val();
            var code3=$('#'+fieldId3).val();
            var code4=$('#'+fieldId4).val();
            var code5=$('#'+fieldId5).val();
            $.ajax({
                url :'services/userseek/'+seekId+'.json',
                dataType : "json",
                data :{
                    $autofilter : request.term,
                    $filtercode1 : code1,
                    $filtercode2 : code2,
                    $filtercode3 : code3,
                    $filtercode4 : code4,
                    $filtercode5 : code5
                },
                async: false,  
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
                    $('#'+fieldId).val('');
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
                $('#'+fieldId).val(ui.item.details.CODE);
                $(this).attr('oldValue',ui.item.label);
                setDirtyBit();
            }
        },
        change : function() {
            if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val()))
            {
                $('#'+fieldId).val('');
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
    $('#'+fieldDesc).on('blur',function(){
        if(!$('.ui-autocomplete.ui-widget:visible').length) {
            if ($('#'+fieldId).val() == '')
            {  
                $(this).val('');
                setDirtyBit();
            }
            if ($(this).val() == '')
            {
                $('#'+fieldId).val('');
                setDirtyBit();
            }
        }
        else
        {
            $(this).focus();
        }
    });
}

function setDirtyBit() {
    $('#dirtyBit').val("1");
}