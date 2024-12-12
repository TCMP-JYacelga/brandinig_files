var DataType=[];
 	DataType[1]="text";
	DataType[2]="textArea";
	DataType[3]="date";
	DataType[4]="Currency";
	DataType[5]="Number";
	DataType[6]="radio";
	DataType[7]="checkbox";
	DataType[8]="select";
	function createOptions(elementnm,value,Text)
	{	
//		var options =  $('#'+elementnm).attr('options');
//		alert(options);
//		if (options==undefined)
//			$('#'+elementnm).append( new Option(value, Text, true, true));
//		else
//			options[options.length] = new Option(value, Text);
		$('#'+elementnm).append($("<option>").val(Text).text(value));  
	}
function getTextFromDropdowns(objhtm)
{
	var selText= $('#'+objhtm+' :selected').text();	
	return selText;
}
function ResetSelectedDropdown(objhtm)
{
	$('#'+objhtm+' >option').remove();
}

function loadJsonData(Form_Code,Field_code,Field_Name,Field_value,Field_required,Field)
{
	return{Form_Code:Form_Code,Field_code:Field_code,Field_Name:Field_Name,Field_value:Field_value,Field_required:Field_required,Field:Field}
}


function submitDynamicDataNew(obj)
{
	var JsonData=[];
	var setActionandData=[];
	var strData = {}; 
	var datavalid=[];
	var controlnm="";
	var checkvalue="";
	var fieldRequired="";
	 
	var checkboxValues="";
	var chkfield="";	
	var chkfieldCode="";
	var chkformCode="";  	
	var tokenValue="";	 
	var referenceKey=' ';
	var checkboxfieldcode="";
	var checkboxfieldCodes=[];
	
	
	 	
	/*	if(document.getElementById("sel_formTypePopUp").value == ' ')
			{
			datavalid[datavalid.length]="Please Select valid  Form Type";
			fieldName="formtype";
			fieldIndex=0;
			
			}
		if(document.getElementById("sel_formNamePopUp").value == ' ')
		{
		datavalid[datavalid.length]="Please Select valid  Form Name";
		fieldName="formtype";
		fieldIndex=0;
		
		}*/
	formCode=$('#msgFormCode').val();	
	 $(obj).children('input[type=text],textarea,select').each(function()
	 {
		
		 if($(this).attr("type")=="text" || $(this).attr("type")=="textarea" )
		 { 		    	 
			 
	    	field=$(this).attr("jsonfield");
	    	fieldCode=$(this).attr("fieldCode");
	    	fieldRequired=$(this).attr("tag");
		  	value=$(this).val();
		  	JsonData.push(loadJsonData(formCode,fieldCode,field,value,fieldRequired,field));
		  	
		  	if (trim(fieldRequired)!="" && trim(value)=="" && ($(this).attr("type")=="text" || $(this).attr("type")=="textarea"))
		  	{
		  		datavalid[datavalid.length]="Please Enter valid "+field;
		  	}
		  	if (trim(fieldRequired)!="" && trim(value)=="" && $(this).attr("type")=="select-one")
		  	{
		  		datavalid[datavalid.length]="Please Select valid "+field;
		  	}
		 }
		 else if($(this).attr("fieldCode") != null)
			 {
			 	
			 	field=$(this).attr("jsonfield");
		    	fieldCode=$(this).attr("fieldCode");
		    	fieldRequired=$(this).attr("tag");
		    	value=$(this).val();
			  	JsonData.push(loadJsonData(formCode,fieldCode,field,value,fieldRequired,field));
				if (trim(fieldRequired)!="" && trim(value)=="" )
			  	{
			  		datavalid[datavalid.length]="Please Select valid "+field;
			  	}
			 }
 
	 });
	 
	
	 $(obj).children('input[type=checkbox]').each(function()
	 {
			
		
		 if (checkboxfieldcode!=$(this).attr("fieldCode"))
			 {
			 	checkboxfieldCodes[checkboxfieldCodes.length]=$(this).attr("fieldCode");
			 	checkboxfieldcode=$(this).attr("fieldCode");
			 }
 
	 });	 
	 
	 for (i=0;i<checkboxfieldCodes.length;i++)
		 {	
		
		 	checkboxfieldcode=trim(checkboxfieldCodes[i])
		 	
		 	fieldjson="";
		 	field="";
		 	fieldCode="";
		 	formCode="";		 	
		 	fieldRequired="";
		 	checkboxValues="";
		 	
		 	$(obj).children('input[type=checkbox]').each(function()
			 { 	
				 if (checkboxfieldcode== trim($(this).attr("fieldCode")))
					 {
					 	fieldjson=$(this).attr("jsonfield");
		 			  	field=$(this).attr("fieldId");	
		 			  	fieldCode=$(this).attr("fieldCode");
		 			  	fieldRequired=$(this).attr("tag");			  	 
		 			  	value=$(this).attr("checked")?1:0;					 
					 	if (eval(value)==1)
						 checkboxValues=checkboxValues+","+fieldjson;
					  
					 }
			 });
		 	
		 		if (trim(fieldRequired)!="" && trim(checkboxValues)=="")
		 		{
		 			datavalid[datavalid.length]="Please Select valid "+field;
		 		}
		 		if (trim(checkboxValues).length>0)
		  		{
		  			checkboxValues =checkboxValues.substr(1,checkboxValues.length);
		  			JsonData.push(loadJsonData(formCode,fieldCode,field,checkboxValues,fieldRequired,field));	
		  		}
		 }
	 
	if($(obj).find('input, select, textarea').length==0)
	{	 
		JsonData.push(loadJsonData(formCode,'','','','',''));
	}
	 var jsonDATA=$.toJSON(JsonData);
 	 var qry =  'data='+jsonDATA;	

	  if (datavalid.length==0)
		{	 
			$.blockUI({ overlayCSS: {opacity: 0 }});
			 var strData = {};
			 $('<input>').attr({
				    type: 'hidden',
				    id: 'dynamicdata',
				    name: 'dynamicdata'
				}).appendTo('frmMain');
			 strData["dynamicdata"] = jsonDATA;
			strData[csrfTokenName] = csrfTokenValue;	
			$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
			$.ajax({
			        type: 'POST',	
			        data:strData,
			        url: "postDynamicFormFieldsJson.formx",	       
			        success: function(data)
			        {	         	 
			         // tokenValue = data.OWASPCSRFTOKEN;
			          $('#'+csrfTokenName).val(csrfTokenValue);
			         //  $('#'+csrfTokenName).val(tokenValue);
			           referenceKey=data.referenceKey;
			           if(null != referenceKey)
			           {	   
						  var referenceDiv = $(document.createElement('div'));	 
						  var setErrDivTitle="Please Note Down your Reference Key";
						  var referencedivId=showErrorDialog(referenceDiv,setErrDivTitle,"Errorform");
						 $("#"+referencedivId).html("Reference Key :  "+referenceKey);
						 $("#"+referencedivId).css("vertical-align","top");
						 $("#"+referencedivId).css("color","#0078AE");
						 $("#"+referencedivId).css("font-size","1.2em");
						 $("#"+referencedivId).css("font-weight","bold");
						 $("#"+referencedivId).css("width","300");
						 $("#"+referencedivId).css("text-align","center");
						 $.unblockUI();	 
					
						 $(obj).remove();
						  $( this ).dialog( "close" );
						  removedivDialog(obj);
						  
						  if(referenceKey != ' ' )
						  {
							  $('#'+"dynamicParentformPopUp").remove();
						  }
			           }  
			        },
					error: function (request, status, error) 
					{
						var errors = eval("(" + request.responseText + ")");
						$('#messageArea').empty();
						$('#messageArea').removeClass("ui-helper-hidden");
						$('#messageArea').append("<span>"+errorTitleMsg+"</span>");
						$('#messageArea').append("<ul>");
						for(i=0;i<errors.globalerrors.length;i++)
						{
							var list="<li>"+errors.globalerrors[i]+"</li>";
							$('#messageArea ul').append(list);
						}
						$('#messageArea').append("</ul>");				
					}			
			    });
			strData = "";
			
		}
	  else
	  {
		  var errDiv = $(document.createElement('div'));	 
		  var setErrDivTitle="Fix Errors.......!";
		  var ErrdivId=showErrorDialog(errDiv,setErrDivTitle,"Errorform");
		  
		  for (r=0;r<datavalid.length;r++)
			{ 
			
			  var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldName+fieldIndex).addClass("frmLabel required");
				 $ctrl.text(trim(datavalid[r]));
				 $("#"+ErrdivId).append($ctrl);	
			  var $ctrl = $(document.createElement('br'));	 
				 $("#"+ErrdivId).append($ctrl);	
			}
	  }	 
		 //alert("in ifAAAAA"+referenceKey);
if (datavalid.length==0)
	$("dynamicdata").remove();
$("sel_formTypePopUp").remove();

}

function submitDynamicDataPackage(obj)
{
	var JsonData=[];
	var setActionandData=[];
	var strData = {}; 
	var datavalid=[];
	var controlnm="";
	var checkvalue="";
	var fieldRequired="";
	 
	var checkboxValues="";
	var chkfield="";	
	var chkfieldCode="";
	var chkformCode="";  	
	var tokenValue="";	 
	var referenceKey=' ';
	var checkboxfieldcode="";
	var checkboxfieldCodes=[];
	
	
	 	
	
     	
	 $(obj).children('input[type=text],textarea,select').each(function()
	 {
		
		 if($(this).attr("type")=="text" || $(this).attr("type")=="textarea" )
		 { 		    	 
			 
	    	field=$(this).attr("jsonfield");
	    	fieldCode=$(this).attr("fieldCode");
	    	formCode=$(this).attr("formCode");
	    	fieldRequired=$(this).attr("tag");
		  	value=$(this).val();
		  	JsonData.push(loadJsonData(formCode,fieldCode,field,value,fieldRequired,field));
		  	
		  	if (trim(fieldRequired)!="" && trim(value)=="" && ($(this).attr("type")=="text" || $(this).attr("type")=="textarea"))
		  	{
		  		datavalid[datavalid.length]="Please Enter valid "+field;
		  	}
		  	if (trim(fieldRequired)!="" && trim(value)=="" && $(this).attr("type")=="select-one")
		  	{
		  		datavalid[datavalid.length]="Please Select valid "+field;
		  	}
		 }
		 else if($(this).attr("fieldCode") != null)
			 {
			 	
			 	field=$(this).attr("jsonfield");
		    	fieldCode=$(this).attr("fieldCode");
		    	formCode=$(this).attr("formCode");
		    	fieldRequired=$(this).attr("tag");
		    	value=$(this).val();
			  	JsonData.push(loadJsonData(formCode,fieldCode,field,value,fieldRequired,field));
				if (trim(fieldRequired)!="" && trim(value)=="" )
			  	{
			  		datavalid[datavalid.length]="Please Select valid "+field;
			  	}
			 }
 
	 });
	 
	
	 $(obj).children('input[type=checkbox]').each(function()
	 {
			
		
		 if (checkboxfieldcode!=$(this).attr("fieldCode"))
			 {
			 	checkboxfieldCodes[checkboxfieldCodes.length]=$(this).attr("fieldCode");
			 	checkboxfieldcode=$(this).attr("fieldCode");
			 }
 
	 });	 
	 
	 for (i=0;i<checkboxfieldCodes.length;i++)
		 {	
		
		 	checkboxfieldcode=trim(checkboxfieldCodes[i])
		 	
		 	fieldjson="";
		 	field="";
		 	fieldCode="";
		 	formCode="";		 	
		 	fieldRequired="";
		 	checkboxValues="";
		 	
		 	$(obj).children('input[type=checkbox]').each(function()
			 { 	
				 if (checkboxfieldcode== trim($(this).attr("fieldCode")))
					 {
					 	fieldjson=$(this).attr("jsonfield");
		 			  	field=$(this).attr("fieldId");	
		 			  	fieldCode=$(this).attr("fieldCode");
		 			  	formCode=$(this).attr("formCode");
		 			  	fieldRequired=$(this).attr("tag");			  	 
		 			  	value=$(this).attr("checked")?1:0;					 
					 	if (eval(value)==1)
						 checkboxValues=checkboxValues+","+fieldjson;
					  
					 }
			 });
		 	
		 		if (trim(fieldRequired)!="" && trim(checkboxValues)=="")
		 		{
		 			datavalid[datavalid.length]="Please Select valid "+field;
		 		}
		 		if (trim(checkboxValues).length>0)
		  		{
		  			checkboxValues =checkboxValues.substr(1,checkboxValues.length);
		  			JsonData.push(loadJsonData(formCode,fieldCode,field,checkboxValues,fieldRequired,field));	
		  		}
		 }
	 
	 
	
	 var jsonDATA=$.toJSON(JsonData);
 	 var qry =  'data='+jsonDATA;	

	  if (datavalid.length==0)
		{	 
			//$.blockUI({ overlayCSS: {opacity: 0 }});
			 var strData = {};
			 $('<input>').attr({
				    type: 'hidden',
				    id: 'dynamicdata',
				    name: 'dynamicdata'
				}).appendTo('frmMain');
			 strData["dynamicdata"] = jsonDATA;
			//strData[csrfTokenName] = csrfTokenValue;	
			$.ajax({
			        type: 'POST',	
			        data:strData,
			        url: "submitPackageForm.action",	       
			        success: function(data)
			        {	         	 
			          //tokenValue = data.csrfTokenName;
			           //$('#'+csrfTokenName).val(tokenValue);
			           referenceKey=data.referenceKey;
			         alert("referenceKey"+referenceKey);
						  var referenceDiv = $(document.createElement('div'));	 
						  var setErrDivTitle="Please Note Down your Reference Key";
						  var referencedivId=showErrorDialog(referenceDiv,setErrDivTitle,"Errorform");
						 $("#"+referencedivId).html("Reference Key :  "+referenceKey);
						 $("#"+referencedivId).css("vertical-align","top");
						 $("#"+referencedivId).css("color","#0078AE");
						 $("#"+referencedivId).css("font-size","1.2em");
						 $("#"+referencedivId).css("font-weight","bold");
						 $("#"+referencedivId).css("width","300");
						 $("#"+referencedivId).css("text-align","center");
						 //$.unblockUI();	 
					
						 $(obj).remove();
						  $( this ).dialog( "close" );
						  removedivDialog(obj);
						  
						  if(referenceKey != ' ' )
						  {
							 
					  $('#'+"dynamicParentformPopUp").remove();
						  }
			        }
			    });
			strData = "";
			
		}
	  else
	  {
		  var errDiv = $(document.createElement('div'));	 
		  var setErrDivTitle="Fix Errors.......!";
		  var ErrdivId=showErrorDialog(errDiv,setErrDivTitle,"Errorform");
		  
		  for (r=0;r<datavalid.length;r++)
			{ 
			  var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldName+fieldIndex).addClass("frmLabel required");
				 $ctrl.text(trim(datavalid[r]));
				 $("#"+ErrdivId).append($ctrl);	
			  var $ctrl = $(document.createElement('br'));	 
				 $("#"+ErrdivId).append($ctrl);	
			}
	  }	 
		 //alert("in ifAAAAA"+referenceKey);
if (datavalid.length==0)
	$("dynamicdata").remove();
$("sel_formTypePopUp").remove();

}


function submitDynamicData(obj,requestFor)
{		 
	
	var JsonData=[];
	var setActionandData=[];
	var strData = {}; 
	var datavalid=[];
	var controlnm="";
	var checkvalue="";
	var fieldRequired="";
	 
	var checkboxValues="";
	var chkfield="";	
	var chkfieldCode="";
	var chkformCode="";  	
	var tokenValue="";	 
	var referenceKey=' ';
	var checkboxfieldcode="";
	var checkboxfieldCodes=[];
	
	 	
		
     	
	 $(obj).children('input[type=text],textarea,select').each(function()
	 {
		
		 if($(this).attr("type")=="text" || $(this).attr("type")=="textarea" )
		 { 		    	 
			 
	    	field=$(this).attr("jsonfield");
	    	fieldCode=$(this).attr("fieldCode");
	    	formCode=$(this).attr("formCode");
	    	fieldRequired=$(this).attr("tag");
	    	
		  	value=$(this).val();
		  	
		  	JsonData.push(loadJsonData(formCode,fieldCode,field,value,fieldRequired,field));
		
		 }
		 else if($(this).attr("fieldCode") != null)
			 {
			 	
			 	field=$(this).attr("jsonfield");
		    	fieldCode=$(this).attr("fieldCode");
		    	formCode=$(this).attr("formCode");
		    	fieldRequired=$(this).attr("tag");
		    	value=$(this).val();
			  	JsonData.push(loadJsonData(formCode,fieldCode,field,value,fieldRequired,field));
			 }
 
	 });
	 
	
	 $(obj).children('input[type=checkbox]').each(function()
	 {
			
		
		 if (checkboxfieldcode!=$(this).attr("fieldCode"))
			 {
			 	checkboxfieldCodes[checkboxfieldCodes.length]=$(this).attr("fieldCode");
			 	checkboxfieldcode=$(this).attr("fieldCode");
			 }
 
	 });	 
	 
	 for (i=0;i<checkboxfieldCodes.length;i++)
		 {	
		
		 	checkboxfieldcode=trim(checkboxfieldCodes[i])
		 	
		 	fieldjson="";
		 	field="";
		 	fieldCode="";
		 	formCode="";		 	
		 	fieldRequired="";
		 	checkboxValues="";
		 	
		 	$(obj).children('input[type=checkbox]').each(function()
			 { 	
				 if (checkboxfieldcode== trim($(this).attr("fieldCode")))
					 {
					 	fieldjson=$(this).attr("jsonfield");
		 			  	field=$(this).attr("fieldId");	
		 			  	fieldCode=$(this).attr("fieldCode");
		 			  	formCode=$(this).attr("formCode");
		 			  	fieldRequired=$(this).attr("tag");			  	 
		 			  	value=$(this).attr("checked")?1:0;					 
					 	if (eval(value)==1)
						 checkboxValues=checkboxValues+","+fieldjson;
					  
					 }
			 });
		 	
		 		
		 		if (trim(checkboxValues).length>0)
		  		{
		 			
		  			checkboxValues =checkboxValues.substr(1,checkboxValues.length);
		 			
		  	  		
		  		}
		 		JsonData.push(loadJsonData(formCode,fieldCode,field,checkboxValues,fieldRequired,field));		
		 }
	 
	 
	
	 var jsonDATA=$.toJSON(JsonData);
 	 var qry =  'data='+jsonDATA;	
 
	  if (datavalid.length==0)
		{	 
		 
			
			 var strData = {};
			
			strData["dynamicdata"] = jsonDATA;
			strData[csrfTokenName] =csrfTokenValue ;	
			$.ajax({
			        type: 'POST',	
			        data:strData,
			        url:requestFor,	       
			        success: function(data)
			        {	   
			        	
			          //tokenValue = data.csrfTokenName;
			           //$('#'+csrfTokenName).val(tokenValue);
			           $('#'+csrfTokenName).val(csrfTokenValue);
			           referenceKey=data.referenceKey;
			         
			           	errorMessage=data.ERRORMESSAGE;
			           	if(referenceKey != null)
			           	{
			           		   
			           $('#messageArea').html("<div id='message' class='errors' >Message sent sucessfully.</div>");
			           	}
			           else
			        	   $('#messageArea').html("<div id='message' class='errors'><font color='red'><h1>"+errorMessage+" is Mandatory Field </h1></font></div>");
			        }
			
			    });
			strData = "";
		
		}
	  
		 //alert("in ifAAAAA"+referenceKey);
	 
}
function removeErrorDialog(obj)
{	
	$('#'+obj.id).remove();
}
function removedivDialog(obj)
{	
	
	$('#'+obj.id).remove();
	
}

function createTextElementRequestType(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode,value)  
{
	fieldIsrequired=fieldIsrequired==0?"":"required";	
	var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldName+fieldIndex).addClass("frmLabel "+fieldIsrequired);
	 $ctrl.text(fieldName+" :  ");
    $("#"+divId).append($ctrl);    	
    var $ctrl = $('<input/>').attr({ type: 'text', id:'txt_'+fieldIndex, name:'txt_'+fieldIndex, value:value, disabled:'disabled' , tag:fieldIsrequired, fieldCode:fieldCode,formCode:formCode, jsonfield:fieldName, maxLength:fieldLength, title:'Please Enter '+fieldName}).addClass("amountBox rounded greyback ");
    $("#"+divId).append($ctrl);	
    
    var $ctrl = $(document.createElement('br'));	 
    $("#"+divId).append($ctrl);	
    var $ctrl = $(document.createElement('br'));
    $("#"+divId).append($ctrl);	
    
}
function createTextElement(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode)  
{
	
	fieldIsrequired=fieldIsrequired==0?"":"required";	
	
	/* if(fieldLength <=10)
	 fieldLength=10;
	 else if(fieldLength > 10 && fieldLength <=16)
	 fieldLength=16;
	 else
	 fieldLength=20; */ 
	var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldName+fieldIndex).addClass("frmLabel "+fieldIsrequired);
	 $ctrl.text(fieldName+" :  ");
    $("#"+divId).append($ctrl);    	
    var $ctrl = $('<input/>').attr({ type: 'text', id:'txt_'+fieldIndex, name:'txt_'+fieldIndex, value:'', tag:fieldIsrequired, fieldCode:fieldCode,formCode:formCode, jsonfield:fieldName,   title:'Please Enter '+fieldName}).addClass(" textBox w"+fieldLength+" rounded ");
    $($ctrl).bind("keypress",function(e) 
    {
		 return keysandlengthonly(e,'A',this,fieldLength);
    });
    var foo = fieldName.toLowerCase();
    
    var output=foo.indexOf("email");
    
    if (eval(output)>=0)
    {
    	 $($ctrl).bind("blur",function() 
		    {
    		 validate_email(this);
		    });
    }
    	
    $("#"+divId).append($ctrl);	
    
    var $ctrl = $(document.createElement('br'));	 
    $("#"+divId).append($ctrl);	
    var $ctrl = $(document.createElement('br'));
    $("#"+divId).append($ctrl);	
}
 
function createTextAreaElement(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode)
{
	
	fieldIsrequired=fieldIsrequired==0?"":"required";	
	var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldName+fieldIndex).addClass("frmLabel "+fieldIsrequired);
	$($ctrl).css("vertical-align","top");
	
	$ctrl.text(fieldName+" :  ");
    $("#"+divId).append($ctrl);  
    var $ctrl = $(document.createElement('textarea')).addClass("textBox rounded");
    $($ctrl).attr("type","textarea");
    $($ctrl).attr("id","txtAr_"+fieldIndex);
    $($ctrl).attr("name","txtAr_"+fieldIndex);
    $($ctrl).attr("cols","50");
    $($ctrl).attr("rows","2");
    $($ctrl).attr("tag",fieldIsrequired);
    $($ctrl).attr("fieldCode",fieldCode); 
    $($ctrl).attr("formCode",formCode);
    $($ctrl).attr("jsonfield",fieldName);   
    $($ctrl).attr("title",'Please Enter '+fieldName);
    $($ctrl).bind("keypress",function(e) 
    {
		 return keysandlengthonly(e,'A',this,fieldLength);
    });
    $("#"+divId).append($ctrl);	
    
    var $ctrl = $(document.createElement('br'));	 
    $("#"+divId).append($ctrl);	
}

function createNumberElement(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode)
{
	fieldIsrequired=fieldIsrequired==0?"":"required";	
	
	var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldName+fieldIndex).addClass("frmLabel "+fieldIsrequired);
	 $ctrl.text(fieldName+" :  ");
    $("#"+divId).append($ctrl); 
	var $ctrl = $('<input/>').attr({ type: 'text', id:'num_'+fieldIndex, name:'num_'+fieldIndex, value:'', tag:fieldIsrequired, fieldCode:fieldCode, formCode:formCode, jsonfield:fieldName, maxLength:fieldLength, title:'Please Enter '+fieldName}).addClass("amountBox w"+fieldLength+" rounded ");
    $($ctrl).bind("keypress",function(e) 
    {
		 return keysandlengthonly(e,'N',this,fieldLength);
    });
    $("#"+divId).append($ctrl);	
    
    var $ctrl = $(document.createElement('br'));	 
    $("#"+divId).append($ctrl);	
}
function createCurrencyElement(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode)
{
	fieldIsrequired=fieldIsrequired==0?"":"required";	
	var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldName+fieldIndex).addClass("frmLabel "+fieldIsrequired);
	 $ctrl.text(fieldName+" :  ");
    $("#"+divId).append($ctrl);   
	/* if(fieldLength <=10)
	 fieldLength=10;
	 else if(fieldLength > 10 && fieldLength <=16)
	 fieldLength=16;
	 else
	 fieldLength=20; */ 
    var $ctrl = $('<input/>').attr({ type: 'text', id:'cur_'+fieldIndex, name:'cur_'+fieldIndex, value:'', tag:fieldIsrequired,  fieldCode:fieldCode, formCode:formCode, jsonfield:fieldName, maxLength:fieldLength, title:'Please Enter '+fieldName}).addClass("amountBox w"+fieldLength+" rounded ");
    $($ctrl).bind("keypress",function(e) 
    {
		 return keysandlengthonly(e,'F',this,fieldLength);
    });
    $("#"+divId).append($ctrl);	
    
    var $ctrl = $(document.createElement('br'));	 
    $("#"+divId).append($ctrl);	
}
function createDateElement(divId,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode)
{
	fieldIsrequired=fieldIsrequired==0?"":"required";	
	var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldName+fieldIndex).addClass("frmLabel "+fieldIsrequired);
	 $ctrl.text(fieldName+" :  ");
    $("#"+divId).append($ctrl);	
	fieldLength = 10;
    var $ctrl = $('<input/>').attr({ type: 'text', id:'dt_'+fieldIndex, name:'dt_'+fieldIndex, value:'', tag:fieldIsrequired,  fieldCode:fieldCode, formCode:formCode, jsonfield:fieldName, maxLength:fieldLength, title:'Please Select '+fieldName}).addClass("dateBox rounded");
    $($ctrl).bind("change",function() 
    	    {
    			 datechecker(this);
    	    });
    
    $ctrl.datepicker({
		changeMonth: true,
		changeYear: true,			
		yearRange: '1950:3020',
		dateFormat: 'dd/mm/yy'
		
	}); 
    $("#"+divId).append($ctrl);	
    
    var $ctrl = $(document.createElement('br'));	 
    $("#"+divId).append($ctrl);	
}
function createCheckBoxElement(divId,fieldName,fieldValuelist,fieldIsrequired,fieldIndex,fieldCode,formCode)
{
	fieldIsrequired=fieldIsrequired==0?"":"required";	
	var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldName+fieldIndex).addClass("frmLabel "+fieldIsrequired);
	 $ctrl.text(fieldName+" :  ");
    $("#"+divId).append($ctrl);	
  
    var optList= fieldValuelist.split(",");
    
    for (r=0;r<optList.length;r++)
	{	
    	var $ctrl =   $(document.createElement('input')).attr({ type: 'checkbox', id:'chk_'+fieldIndex+'_'+r, name:'chk_'+fieldIndex+'_'+r, value:trim(optList[r]) , tag:fieldIsrequired,  fieldCode:fieldCode,formCode:formCode, fieldId:fieldName, jsonfield:trim(optList[r]), title:'Please Select '+optList[r]});
       	 $($ctrl).addClass("checkBox"); 
    	 $("#"+divId).append($ctrl);
    	 var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldName+fieldIndex);
    	 $ctrl.text("  "+trim(optList[r])+"  ");
         $("#"+divId).append($ctrl); 
	}
      
    var $ctrl = $(document.createElement('br'));	 
    $("#"+divId).append($ctrl);	
}

function createRadioElement(divId,fieldName,fieldValuelist,fieldIsrequired,fieldIndex,fieldCode,formCode)
{
	fieldIsrequired=fieldIsrequired==0?"":"required";	
	var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldIndex).addClass("frmLabel "+fieldIsrequired);
	 $ctrl.text(fieldName+" :  ");
    $("#"+divId).append($ctrl);	
  
    var optList= fieldValuelist.split(",");
    
    for (r=0;r<optList.length;r++)
	{	    	
       	var $ctrl =   $(document.createElement('input')).attr({ type: 'radio', id:'radio_'+fieldIndex+'_'+r, name:'radio_'+fieldIndex+'_'+r, value:trim(optList[r]) , tag:fieldIsrequired,  fieldCode:fieldCode,formCode:formCode, fieldId:fieldName, jsonfield:trim(optList[r]), title:'Please Select '+optList[r]});
      	 $($ctrl).addClass("checkBox"); 
   	     $("#"+divId).append($ctrl);
   	    var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldName+fieldIndex);
   	    $ctrl.text("  "+trim(optList[r])+"  ");
        $("#"+divId).append($ctrl); 
	}
    
    $("#"+divId).append($ctrl);	
    
    var $ctrl = $(document.createElement('br'));	 
    $("#"+divId).append($ctrl);	
}
function createDropDownOnly(divId,fieldName,fieldid,fieldIsrequired)
{
	var retrunCtrl="";
	var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldid).addClass("frmLabel "+fieldIsrequired);
	 $ctrl.text(fieldName+" :  ");
   $("#"+divId).append($ctrl);
   
   var $ctrl = $(document.createElement('select')).addClass("comboBox rounded");	
   $($ctrl).attr("id","sel_"+fieldid);
   $($ctrl).attr("name","sel_"+fieldid);  
   $($ctrl).attr("title",'Please '+fieldName);
   
   retrunCtrl=$ctrl;
   $("#"+divId).append($ctrl);	
   var $ctrl = $(document.createElement('br'));	 
   $("#"+divId).append($ctrl);	
   return  $(retrunCtrl).attr("id");   
}
function createDropdownElement(divId,fieldName,fieldValuelist,fieldIsrequired,fieldIndex,fieldCode,formCode)
{
	fieldIsrequired=fieldIsrequired==0?"":"required";	
	var $ctrl = $(document.createElement('label')).attr("id", "lbl_"+fieldName+fieldIndex).addClass("frmLabel "+fieldIsrequired);
	 $ctrl.text(fieldName+" :  ");
    $("#"+divId).append($ctrl);
    
    var $ctrl = $(document.createElement('select')).addClass("comboBox rounded");	
    $($ctrl).attr("id","sel_"+fieldIndex);
    $($ctrl).attr("name","sel_"+fieldIndex);   
    $($ctrl).attr("tag",fieldIsrequired);
    $($ctrl).attr("fieldCode",fieldCode);    
    $($ctrl).attr("jsonfield",fieldName); 
    $($ctrl).attr("formCode",formCode);
    
    $($ctrl).attr("title",'Please Enter '+fieldName);
    
     
    $("#"+divId).append($ctrl);	
    
    var selid=$($ctrl).attr("id");
    if (fieldValuelist!=null)
    {
    	 var optList= fieldValuelist.split(",");
    	    
    	    createOptions($($ctrl).attr("id")," "," ");
    	    
    	    for (r=0;r<optList.length;r++)
    		{		 
    	    	
    		  createOptions($($ctrl).attr("id"),optList[r],optList[r]);
    		}   
    }
   
    
    var $ctrl = $(document.createElement('br'));	 
    $("#"+divId).append($ctrl);	
}
function CreatedynamicFormContentDiv(ParrentElement,title)
{
	
	 var $myDiv = $('#dynamicform'+title);
	
	   	$('#dynamicform').remove();
	   	
   	var errorDiv = 	$(document.createElement('div'));
   	$(errorDiv).attr("id","messageArea");
   	$(errorDiv).attr("class","errors ui-helper-hidden");
   	
	var newDiv = $(document.createElement('div'));	
	$(newDiv).attr("id","dynamicform");
	/*var $ctrl = $(document.createElement('span')).attr("id", "span_hd");	
	
	$($ctrl).css("vertical-align","top");
	$($ctrl).css("color","#0078AE");
	$($ctrl).css("font-size","1.2em");
	$($ctrl).css("font-weight","bold");*/
	
	// $ctrl.text(title);
	 
	 $(newDiv).append(errorDiv);
	 $(newDiv).append($ctrl);
	 var $ctrl = $(document.createElement('br'));	 
	 $(newDiv).append($ctrl);
	 var $ctrl = $(document.createElement('br'));	 
	 $(newDiv).append($ctrl);	
	$("#"+ParrentElement).append(newDiv);	
	return  $(newDiv).attr("id");
}
function createDialogPackage(newDiv,divTitle,divid)
{	 
	$(newDiv).attr("id",divid);
	$(newDiv).addClass("ui-widget-content");
	$(newDiv).dialog
	(
		{
			title:divTitle,	
			show:"blind",	       
	        width: 500,
            height: 'auto',
            modal: true,
            closeText: 'X',
            closeOnEscape: false,
            beforeclose: function (event, ui) { return false; },
            dialogClass: "noclose",
           
            buttons: 
            {
            	Cancel: function() 
            	 {
                 	removedivDialog(this);
                 },
                "SUBMIT": function(event, ui) 
                {
                	
                	submitDynamicDataPackage("#dynamicform");
                }
            },
            close: function(event, ui) 
            {
            	removedivDialog(this);
            }
            	
	    }
		
	).css('background-color','white');
	return  $(newDiv).attr("id");
} 

function createDialog(newDiv,divTitle,divid)
{	 
	$(newDiv).attr("id",divid);
	$(newDiv).dialog
	(
		{
			title:divTitle,	
			show:"blind",	       
	        width: 'auto',
            height: 'auto',
            modal: true,
           
            buttons: 
            {
            	Cancel: function() 
            	 {
                 	removedivDialog(this);
                 },
                "SUBMIT": function(event, ui) 
                {
                  	submitDynamicDataNew("#dynamicform");
                }
            },
            close: function(event, ui) 
            {
            	removedivDialog(this);
            }
            	
	    }
	);
	return  $(newDiv).attr("id");
} 

function replyDialog(newDiv,divTitle,divid)
{	 
	$(newDiv).attr("id",divid);
	$(newDiv).dialog
	(
		{
			title:divTitle,				
	        show: "blind",
	        width: 750,
            height: 500,
            modal: true,
            buttons: 
            {
            	Cancel: function() 
            	 {
                 	removedivDialog(this);
                 },
                "SUBMIT": function(event, ui) 
                {
                	submitReplyDynamicData("#dynamicViewform");
                }
            },
            close: function(event, ui) 
            {
            	removedivDialog(this);
            }
            	
	    }
	);
	return  $(newDiv).attr("id");
} 
function submitReplyDynamicData(obj)
{
	if (trim($("#txtAr_reply").val()).length==0)
	{
		$("#txtAr_reply").focus();
		  var errDiv = $(document.createElement('div'));	 
		  var setErrDivTitle="Fix Errors.......!";
		  var ErrdivId=showErrorDialog(errDiv,setErrDivTitle,"Errorform");		  
		  var $ctrl = $(document.createElement('label')).attr("id", "lbl_err").addClass("frmLabel  required");
			 $ctrl.text("please Enter valid Reply Message up to 255 Characters");
			 $("#"+ErrdivId).append($ctrl);
	}
	else
	{
		var requestfor="updateDynamicFormReply.formx";		
		var tokenValue;
		$.blockUI({ overlayCSS: {opacity: 0 }});
		 var strData = {};
		strData["strFormReply"] = $("#txtAr_reply").val();
		strData["strFormRefId"] = $("#span_refid").text();
		strData[csrfTokenName] = csrfTokenValue;	
		$.ajax({
		        type: 'POST',	
		        data:strData,
		        url: requestfor,	       
		        success: function(data)
		        {	         	 
		           if (data!=null) 
				   { 
		        		 alert (data.replymsg);	
		        		 refresh();
				   }       	
		        }
		    });
		 $(obj).remove();
			$( this ).dialog( "close" );
		$.unblockUI();
		strData = "";
	}
}

function viewDialog(newDiv,divTitle,divid)
{	 
	$(newDiv).attr("id",divid);
	$(newDiv).dialog
	(
		{
			title:divTitle,				
	        show: "blind",
	        width: 750,
            height: 500,
            modal: true,
            buttons: 
            {
            	 
                "OK": function(event, ui) 
                {
                	removedivDialog(this);
                }
            },
            
            close: function(event, ui) 
            {
            	removedivDialog(this);
            }
            	
	    }
	);
	return  $(newDiv).attr("id");
} 


function showErrorDialog(newDiv,divTitle,divid)
{	 
	$(newDiv).attr("id",divid);
	$(newDiv).dialog
	(
		{
			title:divTitle,				
	        show: "blind",
	        width: 300,
            height: 200,      
            modal: true,

            close: function(event, ui) 
            {
            	removeErrorDialog(this);
            }
            	
	    }
	);
	return  $(newDiv).attr("id");
}


function trim(str, chars) {
	return ltrim(rtrim(str, chars), chars);
}
 
function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}
function keysandlengthonly(the_key,allkeys,Object, MaxLen)
{	 
		
	the_key=the_key.which;
	
	//VALIDATION ROLES 
	//S means :- String only
	//N means :- Numbers only
	//F means :- float only
	//A means :- Alpha Numeric Only
	//SPL means : -Special Characters : -  ' , +() 
	var decimalkey=48;
	var backspancekey=8;
	var numminkey=47;
	var	nummaxkey=58;	
	var upperminkey=65;
	var uppermaxkey=90;
	
	var lowerminkey=97;
	var lowermaxkey=122;
	var spacebarkey=32;
	 
	var leftbracketKey=40;
	var rightbracketkey=41;
	var pluskey=43;
	var commakey=44;
	var singlequote=39;
	
	if (the_key!=parseInt(backspancekey,10) &&  parseInt(Object.value.length,10) == parseInt(MaxLen,10))	
	return false;
	 
 
	if ( ! the_key )
    {
        the_key = event.keyCode;
    }
	 
	if (allkeys=='F')
	{
		decimalkey=46;		 
	}	 
	
	if (allkeys=='S')
	{		
		if ( the_key==parseInt(backspancekey,10) || the_key>=parseInt(upperminkey,10) && the_key<=parseInt(uppermaxkey,10) || the_key>=parseInt(lowerminkey,10) && the_key<=parseInt(lowermaxkey,10) || the_key==parseInt(spacebarkey,10))		 
			return true;
		else
			return false;
	}
	else if (allkeys=='A')
		return true;
	else if (allkeys=='F' || allkeys=='N')
	{	 
		if ( the_key==parseInt(backspancekey,10) || the_key==parseInt(decimalkey,10) || the_key>parseInt(numminkey,10) && the_key<parseInt(nummaxkey,10))		 
			return true;
		else
			return false;
	} 	
	else if ( allkeys=='SPL')
	{
		decimalkey=46;	
		if ( the_key==parseInt(backspancekey,10) || the_key==parseInt(decimalkey,10) || the_key>parseInt(numminkey,10) && the_key<parseInt(nummaxkey,10)  
			|| the_key==parseInt(leftbracketKey,10) || the_key==parseInt(rightbracketkey,10) || the_key==parseInt(pluskey,10) || the_key==parseInt(commakey,10) || the_key==parseInt(singlequote,10)
			|| the_key>=parseInt(upperminkey,10) && the_key<=parseInt(uppermaxkey,10) || the_key>=parseInt(lowerminkey,10) && the_key<=parseInt(lowermaxkey,10) || the_key==parseInt(spacebarkey,10) )
			return true;
		else
			return false;

	}
}

function validate_email(obj) 
{	 
		field=obj.value;
		apos=field.indexOf("@")
		dotpos=field.lastIndexOf(".")
		if (apos<1||dotpos-apos<2)	 		 
			obj.value=""; 		
	
}

function datechecker(field)
{
	var checker=validdate(field);
	 
	if (checker==0)
	{
		field.value="";
		field.focus();
	}
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function validdate(field)
{	
	var crdt=field.value
	if (dtvalid(crdt)==false)      
		return 0;	  
	else
		return 1;
	
	var dminyear = 1900;
	var dmaxyear = 2200;
	var chsep= "/";
	function checkinteger(str1)
	{
		var x;
		for (x = 0; x < str1.length; x++)
		{ 
	//		verify current character is number or not !
			var cr = str1.charAt(x);
			if (((cr < "0") || (cr > "9"))) 
				return false;
		}
		return true;
	}
	function getcharacters(s, chsep1)
	{
		var x;
		var Stringreturn = "";
		for (x = 0; x < s.length; x++){ 
			var cr = s.charAt(x);
			if ("/".indexOf(cr) == -1) 
				Stringreturn += cr;
		}
		return Stringreturn;
	}
	function februarycheck(cyear)
	{
		return (((cyear % 4 == 0) && ( (!(cyear % 100 == 0)) || (cyear % 400 == 0))) ? 29 : 28 );
	}
	function finaldays(nr) 
	{
		for (var x = 1; x <= nr; x++) {
			this[x] = 31
			if (x==4 || x==6 || x==9 || x==11)
			{
				this[x] = 30}
			if (x==2)
			{
				this[x] = 29}
		} 
		return this
	} 
	function dtvalid(strdate)
	{
		var monthdays = finaldays(12)
		var cpos1=strdate.indexOf("/")
		var cpos2=strdate.indexOf("/",cpos1+1)
		var daystr=strdate.substring(0,cpos1)
		var monthstr=strdate.substring(cpos1+1,cpos2)
		var yearstr=strdate.substring(cpos2+1)
		strYr=yearstr
		if (strdate.charAt(0)=="0" && strdate.length>1) strdate=strdate.substring(1)
		if (monthstr.charAt(0)=="0" && monthstr.length>1) monthstr=monthstr.substring(1)
		for (var i = 1; i <= 3; i++) {
			if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1)
		}
	//	The parseInt is used to get a numeric value from a string
		pmonth=parseInt(monthstr,10)
		pday=parseInt(daystr,10)
		pyear=parseInt(strYr,10)
		if (cpos1==-1 || cpos2==-1){
			field.value="";
			alert("The date format must be : dd/mm/yyyy")
			return false
		}
		if (monthstr.length<1 || pmonth<1 || pmonth>12){
			field.value="";
			alert("Input a valid month")
			return false
		}
		if (daystr.length<1 || pday<1 || pday>31 || (pmonth==2 && pday>februarycheck(pyear))         || pday > monthdays[pmonth]){
			field.value="";
			alert("Input a valid day")
			return false
		}
		if (yearstr.length != 4 || pyear==0 || pyear<dminyear || pyear>dmaxyear){
			field.value="";
			alert("Input a valid 4 digit year between "+dminyear+" and "+dmaxyear)
			return false
		}
		if (strdate.indexOf("/",cpos2+1)!=-1 || checkinteger(getcharacters(strdate, "/"))==false){
			field.value="";
			alert("Input a valid date")
			return false
		}
		return true
	}	
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function checkDate(field) 
{  
 
	  obj = field;
	  date = obj.value;
	  if(date.length==0) 
	  {
			return 1; 
	  }
	  day = date.substring(0, 2);
	  month = date.substring(3, 5);
	  year = date.substring(6, 10);
	  
	  if(day.length==1)
	  {
		  day = "0"+day;
		  date=day+"/"+month+"/"+year;
	  }		  
	  
	  if(month.length==1)
	  {
		  month = "0"+month;
		  date=day+"/"+month+"/"+year;
	  }		  
	  
	  if (date.length!= 10) 
	  {
			obj.value="";  		 
			return 0;
	  } 
	 
	  if( isNaN(day) || (day < 0) || isNaN(year) || (year < 1)) 
	  {
			obj.value="";    			
			return 0;
	  } 

	  
	  if( (month == 01) || (month == 03) || (month == 05) || 
	      (month == 07) || (month == 08) || (month == 10) || 
	      (month == 12) ) { monthdays = 31 }
	  else if( (month == 04) || (month == 06) || (month == 09) ||
	           (month == 11) ) { monthdays = 30 }
	  else if(month == 02) { 
	    monthdays = ((year % 4) == 0) ? 29 : 28; 
	  }
	  else {
		obj.value="";
	    return 0;
	  }
	  if(day > monthdays) 
	  {
		obj.value="";
		 
	    return 0;
	  }
	  
	  
	  return 1;
}