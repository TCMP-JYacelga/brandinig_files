var additionalFieldDate = '';
var additionalFieldDateFormat = '';
var additionalFieldJsonArray = new Array();
function additionalFieldCheckUncheck(imgElement, flag, flags)
{
    var flagsArray = new Array();
    if(flags != null & flags.length>0) {
        flagsArray = flags.split('~');
    } else {
        return false;
    }
	if(flagsArray.length>=2) {
        if (imgElement.src.indexOf("icon_unchecked.gif") > -1)
        {
            imgElement.src = "static/images/icons/icon_checked.gif";
            $('#'+flag).val(flagsArray[0]);
        }
        else
        {
            imgElement.src = "static/images/icons/icon_unchecked.gif";
            $('#'+flag).val(flagsArray[1]);
        }
    }
}

function processAdditionalField(masterName, objJsonArray) {
    var additionalFieldDivObj = $('#additionalFieldDiv');
    var sectionObj;
    var rowObject;
    var columnCnt = 0;
    if(masterName == 'X') { // Feature can customize the code based on master name
    	for( var i = 0 ; i < objJsonArray.length ; i++ ) {
	    	var objJson = objJsonArray[i];
	    	if((objJson.displaySection == 'undefined' || objJson.displaySection.indexOf('parent_')>-1) 
	    		&& (columnCnt == 0 || columnCnt == 3 || 
	    			columnCnt == 6 || columnCnt == 9)) 
	    	{
	    		if(objJson.tableOrDiv == 'T') {
			        rowObject = $( "<tr>" );
			    } else {
				    rowObject = $( "<div>" );
			    }
	    	}
	    	if(objJson.tableOrDiv == 'T') {
		        columnObj = $( "<td>" );
		    } else {
		    	columnObj = $("<div>" );
		    }
		    var labelObj = $("<label>");
			var objArray = new Array();
		    var input = '';
		    rowObject.addClass(objJson.rowCss);
		    columnObj.addClass(objJson.columnCss);
		    if(objJson.mandatory) {
		        labelObj.addClass("frmLabel required-lbl-right");
		    } else {
		        labelObj.addClass("frmLabel");
		    }
		    labelObj.html(objJson.displayName);
		    labelObj.appendTo(columnObj);
		    var brObj = $("<br>");
		    brObj.appendTo(columnObj);
		    if(objJson.dataType == 'String' || objJson.dataType == 'Date' 
		        || objJson.dataType == 'Amount' || objJson.dataType == 'Number') 
			{
		        var input = $( '<input>' ).attr(
		        {
		            'type' : 'text',
		            'id' : objJson.javaName,
		            'name' : objJson.javaName,
		            'class' : objJson.fieldCss,
		            'value' : objJson.value,
		            'maxlength' : objJson.maxLength
		        } );
			    if(objJson.dataType == 'Amount') {
		            input.prop( 'placeholder', '0.00' );
		            input.ForceNumericOnly();
			    } else if(objJson.dataType == 'Number') {
		            input.OnlyNumbers();
			    } else if('Date') {
		            $('#'+objJson.javaName).datepicker({dateFormat: additionalFieldDateFormat});
		            $('#'+objJson.javaName).datepicker( "option", "minDate", new Date(additionalFieldDate));
		        }
		        input.appendTo(columnObj);
		    } else if(objJson.dataType == 'Select' || objJson.dataType == 'JSelect') {
		        var input = $( '<select>' ).attr(
		        {        
		            'id' : objJson.javaName,
		            'name' : objJson.javaName,
		            'class' : objJson.fieldCss
		        } );
			    $(objJson.lov).each( function()
		        {
		            input.append($("<option>").attr('value', this.key).text(this.value));
		        } );
		        input.val(objJson.value);
		        input.appendTo(columnObj);
		        if(objJson.dataType == 'JSelect') {
		            makeNiceSelect(objJson.javaName, true);
		        }
		    } else if('CheckBox') {
		        var imgsrc = 'static/images/icons/icon_unchecked.gif';
		        var checkBoxValues = objJson.radioCheckboxValues;
		        if(checkBoxValues != "undefined" && checkBoxValues.length > 0 &&
		           (checkBoxValues.split(checkBoxValues, '~')[0] == objJson.value) )
		        {
		            var imgsrc = 'static/images/icons/icon_checked.gif';
		        }
		        var input = $( '<input>' ).attr(
		        {
					'type' : 'hidden',
					'id' : objJson.javaName,
					'name' : objJson.javaName,
					'class' : objJson.fieldCss,
					'value' : objJson.value
		        } );
		        var img = $( '<img>' ).attr(
		        {
		        	'src' : imgsrc,
		        	'class' : 'middleAlign',
		        	'width' : '14',
		        	'height' : '14',
		            'border' : '0', 
		            'id' : objJson.javaName+'checkbox1',
		            'onclick' : 'additionalFieldCheckUncheck(this,"'+objJson.javaName+'","'+objJson.radioCheckboxValues+'")'
		        } );        
			    input.appendTo(columnObj);
		        img.appendTo(columnObj);
			} else if('Radio') {
		        if(objJson.radioCheckboxValues!=null 
				   && objJson.radioCheckboxValues.length>=1) {
		            objArray = objJson.radioCheckboxValues.split('~');
		            var i = 1;
		            $(objJson.objArray).each( function()
		            {
						var input = $( '<input>' ).attr(
						{
		                    'type' : 'text',
		                    'id' : objJson.javaName+i,
		                    'name' : objJson.javaName,
		                    'class' : objJson.fieldCss,
		                    'value' : this.toString()
						} );
						input.appendTo(columnObj);
						i++;
		            } );
		        }
		    }
			if(objJson.displaySection != 'undefined' && objJson.displaySection.indexOf('parent_')<0) {
				sectionObj = $('#'+objJson.displaySection);
				columnObj.appendTo(sectionObj);
			} else {
				columnObj.appendTo(rowObject);
				if(columnCnt==0 || columnCnt==3 || columnCnt == 6 || columnCnt == 9) {
					if(objJson.displaySection != 'undefined' && objJson.displaySection.indexOf('parent_')>-1) {
						var parentObj = objJson.displaySection.substring(7);
						rowObject.appendTo($('#'+parentObj));
					} else {
						rowObject.appendTo(additionalFieldDivObj);
					}
				}
				columnCnt++;
			}
	    }
    }
}

jQuery.fn.AdditionalFieldInfoAutoComplete = function(options) {
	var settings = $.extend({seekId:'seekId',
		 filter: "filter",
		 filterDesc: "filterDesc",
		 filter1: "filter1",
		 filter2: "filter2",
		 filter3: "filter3",
		 filter4: "filter4"
	}, options );
	var seekId = settings.seekId;
	var filter = settings.filter;
	var fieldDesc = settings.filterDesc;
	var filter1 = $('#'+settings.filter1).val();
	var filter2 = $('#'+settings.filter2).val();
	var filter3 = $('#'+settings.filter3).val();
	var filter4 = $('#'+settings.filter4).val();
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$('#'+filter).val('');
				$.ajax({
					url : "services/userseek/"+seekId+".json",
					type: "POST",
					dataType : "json",
					data : {
						'$autofilter' : $('#'+fieldDesc).val(),
						'$filtercode1': filter1,
						'$filtercode2': filter2,
						'$filtercode3': filter3,
						'$filtercode4': filter4,
						'$sellerCode': $('#sellerId').val()
					},
					success : function(data) {
							var rec = data.d.preferences;
							if(rec.length == 0) {
						        response( [ { label: 'No match found', value: '' } ] );
							} else {
								response($.map(rec, function(item) {
										return {														
											label : item.DESCR,
											clientDtl : item
									    }
							        }
								));
					      }
					}
				});
			},
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.clientDtl;
				if (data) {
					if (!isEmpty(data.CODE))
					{
						$('#'+fieldDesc).val(data.DESCR);
						$('#'+filter).val(data.CODE);
					}
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
				if($('#'+filter).val() =='') {
					$('#'+filter).autocomplete('search', '');
				}
			}
		});
	});
};