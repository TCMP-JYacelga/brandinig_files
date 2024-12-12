var formType = "";
var formName  = "";
var pageTitle= "";


function ViewDynamicForm(referenceCode,requestfor,listype,replyform)
{
	var tokenValue;	
	var htmlView="";
	var row=0;
	$.blockUI({ overlayCSS: {opacity: 0 }});
	 var strData = {};
		strData["selectedReferenceCode"] = referenceCode;
		strData[csrfTokenName] = csrfTokenValue;	
	$.ajax({
        type: 'POST',
        data:strData,
        url: requestfor,	       
        success: function(data)
        {	  
        	tokenValue = data.OWASPCSRFTOKEN;
    		$('#'+csrfTokenName).val(tokenValue);
    		 if (typeof data != "undefined" &&
    				 typeof data[listype] != "undefined") 
			   { 
    			 var newDiv = $(document.createElement('div'));
    			 
    			 if (trim(replyform).length==0)
				 {
    				 var divId=viewDialog(newDiv,"View Message","dynamicViewform")
				 }
    			 else
    			 {
    				 var divId=replyDialog(newDiv,"Reply Message","dynamicViewform")
    			 }
        		 if (typeof data != "undefined" &&
        				 typeof data[listype] != "undefined" && 
        				 data[listype]!=null && data[listype].length > 0) {
        			 var $ctrl = $(document.createElement('label')).attr("id", "lbl_makerid").addClass("frmLabel");
        			 $ctrl.text("From User : ");
        			 //$($ctrl).css("vertical-align","top");
        			 $("#"+divId).append($ctrl); 
        			 
        			 var $ctrl = $(document.createElement('span')).attr("id", "val_makerid").addClass("w14 rounded inline_block");
        			 $ctrl.text(data[listype][row].MAKER_ID);
        			 $("#"+divId).append($ctrl); 
        			 $("#"+divId).append($("<br/>"));
        			 
    				 var $ctrl = $(document.createElement('label')).attr("id", "lbl_subject").addClass("frmLabel");
        			 $ctrl.text("Subject : ");
        			 //$($ctrl).css("vertical-align","top");
        			 $("#"+divId).append($ctrl); 
        			 
        			 var $ctrl = $(document.createElement('span')).attr("id", "val_subject").addClass("w14 rounded inline_block");
        			 $ctrl.text(data[listype][row].SUBJECT);
        			 $("#"+divId).append($ctrl);
        			 $("#"+divId).append($("<br/>"));
        			 
    				 var $ctrl = $(document.createElement('label')).attr("id", "lbl_date").addClass("frmLabel");
        			 $ctrl.text("Message Sent Date : ");
        			 //$($ctrl).css("vertical-align","top");
        			 $("#"+divId).append($ctrl); 
        			 
        			 var $ctrl = $(document.createElement('span')).attr("id", "val_date").addClass("w14 rounded inline_block");
        			var sentDate = $.datepicker.parseDate("dd/mm/yy",  data[listype][row].MAKER_STAMP);
        			sentDate = $.datepicker.formatDate(localeDatePickerFormat,sentDate);	    			     			 
        			 $ctrl.text(sentDate);    			     			 
        			 
        			 $("#"+divId).append($ctrl);
        			 $("#"+divId).append($("<br/>"));
        			 $("#"+divId).append($("<br/>"));
        			 var $ctrl = $(document.createElement('hr')).attr("id", "hr1");    			 
        			 $ctrl.attr("size","1");
        			 $("#"+divId).append($ctrl);
        			 $("#"+divId).append($("<br/>"));
        			 
    	        	   	
    					for (row=0;row<data[listype].length;row++)
    					{	 
    						 var $ctrl = $(document.createElement('label')).attr("id", "lbl").addClass("frmLabel");
    		    			 $ctrl.text(data[listype][row].FIELD_NAME);
    		    			 //$($ctrl).css("vertical-align","top");
    		    			 $("#"+divId).append($ctrl); 
    						 
    						 var $ctrl = $(document.createElement('span')).attr("id", "span").addClass("w14 rounded inline_block");
    		    			 $ctrl.text(data[listype][row].FIELD_VALUE);
    		    			 $("#"+divId).append($ctrl);
    		    			 
    		    			 $("#"+divId).append($("<br/>"));
    						 
    					}	
    		   			 
    	    			 $("#"+divId).append($("<br/>"));
    	    			 var $ctrl = $(document.createElement('hr')).attr("id", "hr2");	 
    	    			 $ctrl.attr("size","1");
    	    			 $("#"+divId).append($ctrl);
    	    			 $("#"+divId).append($("<br/>"));
    	    	
    	
    					 var $ctrl = $(document.createElement('label')).attr("id", "lbl_refid").addClass("frmLabel");
    	    			 $ctrl.text("Reference Number  :  ");
    	    			 //$($ctrl).css("vertical-align","top");
    	    			 $("#"+divId).append($ctrl); 
    					 
    					 var $ctrl = $(document.createElement('span')).attr("id", "span_refid").addClass("w14 rounded inline_block");
    	    			 $ctrl.text(data[listype][row-1].REFERENCE_NO);
    	    			 $("#"+divId).append($ctrl);
    	    			 $("#"+divId).append($("<br/>"));
    					 
    					 if (trim(replyform).length>0)
    					 {
    							 var $ctrl = $(document.createElement('label')).attr("id", "lbl_refid").addClass("frmLabel required");
    			    			 $ctrl.text("Reply :  ");
    			    			 $($ctrl).css("vertical-align","top");
    			    			 $("#"+divId).append($ctrl); 

    						 	var $ctrl = $(document.createElement('textarea')).addClass("textBox rounded");
    						    $($ctrl).attr("id","txtAr_reply");
    						    $($ctrl).attr("name","txtAr_reply");
    						    $($ctrl).attr("cols","50");
    						    $($ctrl).attr("rows","2");
    						    $($ctrl).attr("title",'Please Enter your Reply ');
    						    $($ctrl).bind("keypress",function(e) 
    						    	    {
    						    			 return keysandlengthonly(e,'A',this,"255");
    						    	    });
    						    $("#"+divId).append($ctrl); 
    					 }
    					 else
    					 {
    						 if (data[listype][row-1].REPLY_DATE!=null)
    						 {
    						 
    							 var $ctrl = $(document.createElement('label')).attr("id", "lbl_refid").addClass("frmLabel");
    			    			 $ctrl.text("Reply Date  :  ");
    			    			 //$($ctrl).css("vertical-align","top");
    			    			 $("#"+divId).append($ctrl); 
    							 
    							 var $ctrl = $(document.createElement('span')).attr("id", "span_refid").addClass("w14 rounded inline_block");
    				    		var replyDate = $.datepicker.parseDate("dd/mm/yy", data[listype][row-1].REPLY_DATE);
    				    		replyDate = $.datepicker.formatDate(localeDatePickerFormat,replyDate);								 
    			    			 $ctrl.text(replyDate);
    			    			 $("#"+divId).append($ctrl);
    			    			 
    			    			 $("#"+divId).append($("<br/>"));

    							 var $ctrl = $(document.createElement('label')).attr("id", "lbl_refid").addClass("frmLabel");
    			    			 $ctrl.text("Reply :  ");
    			    			 //$($ctrl).css("vertical-align","top");
    			    			 $("#"+divId).append($ctrl); 
    							 
    							 var $ctrl = $(document.createElement('span')).attr("id", "span_refid").addClass("w14 rounded inline_block");
    			    			 $ctrl.text(data[listype][row-1].REPLY);
    			    			 $("#"+divId).append($ctrl);
    			    			 
    			    			 $("#"+divId).append($("<br/>"));
    						 
    						 }
    					 }
        		 }
					// $("#"+divId).css("width","300");
			   }
			 $.unblockUI();	 
			 strData = "";
        }
    });
}
function showWelcomeForm()
{

	var frm = document.getElementById("frmMain");	
	frm.action = "showWelcome.form";
	frm.target ="";
	frm.method = "POST";
	frm.submit();
}

function LoadDynamicFormPackage(formType,requestType,packageTypeName)
{
		
		var newDiv = $(document.createElement('div'));
		var divId=createDialogPackage(newDiv,"You Have Selected "+packageTypeName,"dynamicParentformPopUp");
		
		LoadDynamicFormFieldsPackage(formType,'FieldsList','packageFormField.action',formType,divId,requestType,packageTypeName);
}	 
function LoadDynamicForm(formType,formCode,formName)
{
		var newDiv = $(document.createElement('div'));
		var formTypeName;
		if (formType == 1)
			formTypeName="General Purpose Messages";
		if(formType == 2)
			formTypeName="Loan Messages";
		if(formType == 3)
			formTypeName="Customer Support Messages";
		
		var divId=createDialog(newDiv," "+formTypeName+" | " +formName,"dynamicParentformPopUp");	
		//var selctFormType=createDropDownOnly(divId,"Form Type","formTypePopUp","required");
		//var selectFromName=createDropDownOnly(divId,"Form Name","formNamePopUp","required");
		
		//LoadMessageFormTypesDropdowns(selctFormType,"messageForm_types","getDynamicMessageTypes.formx");
		
		if(formCode != null && formType != null) 
		{
		/*	var slectedopt=document.getElementById(selctFormType);
			slectedopt.value = formType;
		
			LoadMessageFormNamesDropdowns(selectFromName,'messageForm_names','getDynamicMessageFormNames.formx',selctFormType);
			var slectedopt=document.getElementById(selectFromName);
			slectedopt.value = formCode;*/
		
			LoadDynamicFormFields(formName,'FieldsList','getDynamicFormFieldsJson.formx',formCode,divId);
			$('#msgFormCode').val(formCode);
		}
		
		/*$("#"+selectFromName).bind("change",function() 
		   	    {
					LoadDynamicFormFields(selectFromName,'FieldsList','getDynamicFormFieldsJson.formx',selectFromName,divId);
				if($("#"+selectFromName).val() == ' ' )
				{
				$('#'+"dynamicform").remove();
				}
		   	    });
				
				
		$("#"+selctFormType).bind("change",function() 
		   	    {
			   		LoadMessageFormNamesDropdowns(selectFromName,'messageForm_names','getDynamicMessageFormNames.formx',selctFormType);
					$('#'+"dynamicform").remove();
					
		   	    });*/
} 
function LoadMessageFormTypesDropdowns(objhtm,listype,requestfor)	 
{	
	var strData = {};	  
	strData[csrfTokenName] = csrfTokenValue;	
	$.ajax({
	        type: 'POST',		    	
	        data:strData,
	        url: requestfor,	       
			async:false,
	        success: function(data)
	        {	        	 
	           if (data[listype]!=null) 
			   { 
	        	   createOptions(objhtm," "," ");
					for (row=0;row<data[listype].length;row++)
					{
						var optvalue= data[listype][row].Form_Type_code;	
						var optText= data[listype][row].Form_Type;
						createOptions(objhtm,optText,optvalue);						 
					}	
					 
			   }	          
	        }
	    });
	strData = "";
}

function LoadMessageFormNamesDropdowns(objhtm,listype,requestfor,obj)	 
{	
	ResetSelectedDropdown(objhtm);
	var tokenValue;
	$.blockUI({ overlayCSS: {opacity: 0 }});
	 var strData = {};
	strData["strFormType"] = $('#'+obj).val();
	strData[csrfTokenName] = csrfTokenValue ;	
	$.ajax({
	        type: 'POST',	
	        data:strData,
			async:false,
	        url: requestfor,	       
	        success: function(data)
	        {	         	 
	           if (data[listype]!=null) 
			   { 
	        	   //	tokenValue = data.OWASPCSRFTOKEN;
	        	   	$('#'+csrfTokenName).val(csrfTokenValue);
	           		//$('#'+csrfTokenName).val(tokenValue);
	           	 	createOptions(objhtm," "," ");
	        		for (row=0;row<data[listype].length;row++)
					{
						var optvalue= data[listype][row].FORM_CODE;	
						var optText= data[listype][row].FORM_NAME;	
						createOptions(objhtm,optText,optvalue);						 
					}						 
			   }       	
	        }
	    });
	$.unblockUI();	 
	strData = "";
}
function LoadDynamicFormFieldsPackage(objhtm,listype,requestfor,obj,newDiv,value,packagetype)
{	
	
	var length=10;
	var widthdialog=300;
	var heightDialog=50;
	//if (obj.length>0 )
	{  
		//alert("obj"+trim($('#'+obj).val()).length);
		var tokenValue;
		//$.blockUI({ overlayCSS: {opacity: 0 }});
		 var strData = {};	  
		strData["selectedFormCode"] = obj;
		//strData[csrfTokenName] = csrfTokenValue;	
		//alert("obj1"+csrfTokenValue);
		strData[csrfTokenName] ='sssss11'
		$.ajax({
			type: 'POST',
	        data:strData,
			async:false,
	        url: requestfor,
	        
	        success: function(data)
	        {
	        	
	           if (data[listype]!=null) 
			   {   
	        		
	       				//tokenValue = data.csrfTokenName;
	       				//$('#'+csrfTokenName).val(tokenValue);
	       				 
	       				var setDivTitle=getTextFromDropdowns(objhtm);
	       				var divId=CreatedynamicFormContentDiv(newDiv,setDivTitle);
	       				
	       					//createDialog(newDiv,setDivTitle,"dynamicform");	
	       				
					for (row=0;row<data[listype].length;row++)
					{
						 
						fieldType=DataType[eval(data[listype][row].fieldType)];					
						fieldLength=eval(data[listype][row].fieldLength) ;
						fieldName=data[listype][row].fieldName;
					
						fieldIsrequired=eval(data[listype][row].fieldIsrequired);
						fieldValuelist=data[listype][row].fieldValuelist;
						fieldCode=data[listype][row].fieldCode;
						
						formCode=data[listype][row].formCode; 
						fieldIndex=eval(row);
						if (fieldType=="text" && fieldCode=='REQUESTTYPE')	
							{
							
							createTextElementRequestType(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode,value);
							}
						if (fieldType=="text" && fieldCode=='PACKAGETYPE')	
						{
						
						createTextElementRequestType(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode,packagetype);
						}
						if (fieldType=="text" && fieldCode!='REQUESTTYPE' &&  fieldCode!='PACKAGETYPE')	
							createTextElement(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="textArea")
							createTextAreaElement(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="date")						 
							createDateElement(divId,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="radio")		
							createRadioElement(divId,fieldName,fieldValuelist,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="checkbox")		
							createCheckBoxElement(divId,fieldName,fieldValuelist,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="select")
							createDropdownElement(divId,fieldName,fieldValuelist,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="Number")	
							createNumberElement(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="Currency")	
							createCurrencyElement(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if(fieldLength > length)
							length=fieldLength;
					}
					if(length <= 10)
						widthdialog=100;
					else if(length <= 20 && length > 10)
						widthdialog=250;
					else if(length > 20 && length <= 100)
						widthdialog=500;
					else if(length > 100 && length <= 200)
						widthdialog=350;
					else
						widthdialog=550;
					if(data[listype].length > 0)
						heightDialog= heightDialog * data[listype].length;
						
					//alert("widthdialog"+widthdialog);
					//alert("heightDialog"+heightDialog);
						$("#"+divId).css({ width: widthdialog, height: heightDialog }).resize();
					 
			   }
	           $.unblockUI();
	        }
	    });
		strData = "";
		$('#saveUpdate').prop('disabled',false);
	
	}
		
}
function LoadDynamicFormFields(objhtm,listype,requestfor,obj,newDiv)
{	
	var length=10;
	var widthdialog=300;
	var heightDialog=50;
	//if (trim($('#'+obj).val()).length>0 )
	if (obj != null )
	{  
	
		var tokenValue;
		$.blockUI({ overlayCSS: {opacity: 0 }});
		 var strData = {};	
		 if(obj == 'sel_formName' || obj == 'formName')
			 {
			 	strData["selectedFormCode"] = $('#'+obj).val();
			 }else{
				strData["selectedFormCode"] = obj;
			 }
		strData[csrfTokenName] = csrfTokenValue ;	
		
		$.ajax({
	        type: 'POST',
	        data:strData,
			async:false,
	        url: requestfor,	       
	        success: function(data)
	        {	        	 
	           if (data[listype]!=null) 
			   {   
	       				tokenValue = data.csrfTokenName;
	       				$('#'+csrfTokenName).val(tokenValue);
	       				 
	       				//var setDivTitle=getTextFromDropdowns(objhtm);
	       			 if(obj == 'sel_formName' || obj == 'formName')
	    			 {
	    			 	name = $('#'+obj).val();
	    			 }else{
	    				name = obj;
	    			 }
	       				var divId=CreatedynamicFormContentDiv(newDiv,name);
	       				
	       					//createDialog(newDiv,setDivTitle,"dynamicform");	
	       				
					for (row=0;row<data[listype].length;row++)
					{
						 
						fieldType=DataType[eval(data[listype][row].fieldType)];					
						fieldLength=eval(data[listype][row].fieldLength) ;
						fieldName=data[listype][row].fieldName;
						fieldIsrequired=eval(data[listype][row].fieldIsrequired);
						fieldValuelist=data[listype][row].fieldValuelist;
						fieldCode=data[listype][row].fieldCode;
						formCode=data[listype][row].formCode; 
						fieldIndex=eval(row);
						if (fieldType=="text")	
							createTextElement(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="textArea")
							createTextAreaElement(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="date")						 
							createDateElement(divId,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="radio")		
							createRadioElement(divId,fieldName,fieldValuelist,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="checkbox")		
							createCheckBoxElement(divId,fieldName,fieldValuelist,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="select")
							createDropdownElement(divId,fieldName,fieldValuelist,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="Number")	
							createNumberElement(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if (fieldType=="Currency")	
							createCurrencyElement(divId,fieldLength,fieldName,fieldIsrequired,fieldIndex,fieldCode,formCode);
						if(fieldLength > length)
						length=fieldLength;
					}
					
					//$("#dialogBox").dialog('option','width',700); $("#"+divId)
					//$("#"+divId).dialog('option','width',700);
					//$("#"+divId).dialog('option','width',700);
					if(length <= 10)
						widthdialog=300;
					else if(length <= 20 && length > 10)
						widthdialog=350;
					else if(length > 20 && length <= 100)
						widthdialog=400;
					else if(length > 100 && length <= 200)
						widthdialog=450;
					else
						widthdialog=550;
					
//					if(data[listype].length <=5)
//						heightDialog=200;
//					else if(data[listype].length >5 && data[listype].length <=10)
//						heightDialog=300;
//					else if(data[listype].length >10 && data[listype].length <=15)
//						heightDialog=350;
//					else if(data[listype].length >15 && data[listype].length <=20)
//						heightDialog=400;
//					else
//						heightDialog=500;
//					
					if(data[listype].length > 0)
					heightDialog= heightDialog * data[listype].length;
					
					$("#"+divId).css({ width: widthdialog, height: heightDialog }).resize();
					
			   }
	           $.unblockUI();
	        }
	    });
		strData = "";
		$('#saveUpdate').prop('disabled',false);
	
	}
		
}
 