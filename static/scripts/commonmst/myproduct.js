jQuery.fn.sellerCodeSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/foreSellerIdSeek.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,									
										$top:-1
										
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.CODE,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.DESCRIPTION))
							{
								$('#txtMySellerDesc').val(data.DESCRIPTION);
								$('#txtMySellerCode').val(data.CODE);
							}
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
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});	
};

jQuery.fn.clientCodeSeekAutoComplete= function(seller) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/foreuserclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,										
										$sellerCode : seller,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCR,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.DESCR))
							{
								$('#txtBillMyClientDesc').val(data.DESCR);
								$('#txtBillMyClientCode').val(data.CODE);
							}
						}
						goToFilterPage('','frmMain');
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.clientCodeEntrySeekAutoComplete= function(seller) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/foreuserclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,										
										$sellerCode : seller,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCR,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.DESCR))
							{
								$('#txtBillMyClientDesc').val(data.DESCR);
								$('#txtBillMyClientCode').val(data.CODE);
							}
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
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.mypClientCodeEntrySeekAutoComplete= function(seller) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/foreuserclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,										
										$sellerCode : seller,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCR,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.DESCR))
							{
								$('#txtBillMyClientDesc').val(data.DESCR);
								$('#txtBillMyClientCode').val(data.CODE);
							}
						}
						reloadPage('frmMain');
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function goToPage(strUrl, frmId)
{ 
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function reloadPage(frmId)
{ 
	var strUrl = '';
	if(mode == "ADD" || mode == "SAVE" || "PAYPRD" == mode || "COLLPRD" == mode)
	{
		if (strMstType == 'C' && strTemplateType == 'N')
			strUrl = "addCollMyProduct.form";
		else if (strMstType == 'C' && strTemplateType == 'Y')
			strUrl = "addCollTempMyProduct.form";
		else if (strMstType == "P" && strTemplateType == 'Y')
			strUrl = 'addTempMyProduct.form';
		else
			strUrl = "addMyProduct.form";
	}
	else
	{
		if (strMstType == 'C' && strTemplateType == 'N')
			strUrl = "editCollMyProduct.form";
		else if (strMstType == 'C' && strTemplateType == 'Y')
			strUrl = "editCollTempMyProduct.form";
		else if (strMstType == "P" && strTemplateType == 'Y')
			strUrl = 'editTempMyProduct.form';
		else
			strUrl = "editMyProduct.form";
	}	
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function goToFilterPage(strUrl, frmId)
{
	 if($("#txtBillMyClientDesc").length)
	 {
		 if($('#txtBillMyClientDesc').val()== null || $('#txtBillMyClientDesc').val()=='')
		 {
			 $('#txtBillMyClientCode').val('');
		 }
		 else
		 {
			 if($('#txtBillMyClientCode').val()== null|| $('#txtBillMyClientCode').val()=='')
			 {
				 $('#txtBillMyClientCode').val($('#txtBillMyClientDesc').val());  
			 }		  
		 }
	 }
	if(mode == "AUTH" )
	{
		if (strMstType == 'C' && strTemplateType == 'N')
			strUrl = "collMyProductAuthFilterList.form";
		else if (strMstType == 'C' && strTemplateType == 'Y')
			strUrl = "collTempMyProductAuthFilterList.form";
		else if (strMstType == 'F')
			strUrl = "foreMyProductAuthFilterList.form";
		else if (strMstType == "P" && strTemplateType == 'Y')
			strUrl = 'tempMyProductAuthFilterList.form';
		else
			strUrl = "myProductAuthFilterList.form";
	}
	else
	{
		if (strMstType == 'C' && strTemplateType == 'N')
			strUrl = "collMyProductFilterList.form";
		else if (strMstType == 'C' && strTemplateType == 'Y')
			strUrl = "collTempMyProductFilterList.form";
		else if (strMstType == 'F')
			strUrl = "foreMyProductFilterList.form";
		else if (strMstType == "P" && strTemplateType == 'Y')
			strUrl = 'tempMyProductFilterList.form';
		else
			strUrl = "myProductFilterList.form";
	}	 
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function checkApprovalReq()
	{
		if (!document.getElementById("mypApprManual1").checked)
			document.getElementById("autoAuthLimitManual").readOnly = false;
	
		if (!document.getElementById("mypApprUpload1").checked)
			document.getElementById("autoAuthLimitUpload").readOnly = false;
	
		if (document.getElementById("mypApprSIExecution1"))
		{
			if (!document.getElementById("mypApprSIExecution1").checked)
				document.getElementById("autoAuthLimitSIExecution").readOnly = false;
		}
	}
	
	function showList(strUrl)
	{
		if (frmName == "Entry")
		{
			if (strMstType == 'P' && strTemplateType == 'N')
				strUrl = "myProductList.form";
			else if (strMstType == 'P' && strTemplateType == 'Y')
				strUrl = "tempMyProductList.form";
			else if (strMstType == 'C' && strTemplateType == 'N')
				strUrl = "collMyProductList.form";
			else if (strMstType == 'C' && strTemplateType == 'Y')
				strUrl = "collTempMyProductList.form";
			else if (strMstType == 'F')
				strUrl = "foreMyProductList.form";
		}
		else if(frmName=="View")
		{
			if(mode == "AUTH_VIEW" )
			{
				if (strMstType == 'C' && strTemplateType == 'N')
					strUrl = "collMyProductAuthList.form";
				else if (strMstType == 'C' && strTemplateType == 'Y')
					strUrl = "collTempMyProductAuthList.form";
				else if (strMstType == 'F')
					strUrl = "foreMyProductAuthList.form";
				else if (strMstType == "P" && strTemplateType == 'Y')
					strUrl = 'tempMyProductAuthList.form';
				else
					strUrl = "myProductAuthList.form";
			}
			else
			{
				if (strMstType == 'C' && strTemplateType == 'N')
					strUrl = "collMyProductList.form";
				else if (strMstType == 'C' && strTemplateType == 'Y')
					strUrl = "collTempMyProductList.form";
				else if (strMstType == 'F')
					strUrl = "foreMyProductList.form";
				else if (strMstType == "P" && strTemplateType == 'Y')
					strUrl = 'tempMyProductList.form';
				else
					strUrl = "myProductList.form";
			}
		}
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
	}
	function createOptions(elementnm,value,Text,fieldname)
	{	
	
		$('#'+elementnm).append($("<option>").val(Text).text(value));  
	}
	function createCheckSelectText(count,divId, model)
	{
		 
		  var $ctrl =   $(document.createElement('input')).attr({ type: 'checkbox', id:'chk_'+count, name:'chk_'+count});
	   	 
			$("#"+divId).append($ctrl);
		  var $ctrl = $(document.createElement('select'));	
		    $($ctrl).attr("id","sel_"+count);
		    $($ctrl).attr("name","sel_"+count);   
		    $("#"+divId).append($ctrl);	
		    $('txt_'+count).after("<div > </div");
		    for (var r=0;r<model.D.length;r++)
			{		 
		    	
			  createOptions($($ctrl).attr("id"),model.D[r].Name,model.D[r].value);
			}   
		    $("#"+divId).append($ctrl);	
		  var $ctrl = $('<input/>').attr({ type: 'text', id:'txt_'+count, name:'txt_'+count, value:'',  title:'Please Enter '});
		    
		    $("#"+divId).append($ctrl);
		    
		  
		    
		   
		 
	}
	
	function refresh()
	{
		var json = document.getElementById("jsonAsString").value;
		var selectedList =[{}];
		var finalList =[{}];
		
		
		//var modelInstrument = {D:[{"value" : "lbl.pir.holidayAction", "Name" :" Holiday Action"},{"value" : "lbl.pirheader.status", "Name" :"status"},{"value" : "lbl.pirheader.txn.status", "Name" :"Transaction Status"}]};
		var count1 =document.getElementById("lables").value;
		var countInst =document.getElementById("lablesInst").value;
		var jsonString1 =document.getElementById("jsonAsString").value;
		
		var q=0;
		var index=0;
		
		var count = new Number(count1)+1;
		var countInst1 = new Number(countInst)+1;
		var divId ="textbox";
		var fieldName ='batch';
	
	
		
		  if(document.getElementById("mypUseFor1").checked )
		  {
			
		  	if(mode == 'ADD' || mode=='EDIT' || mode =='SAVE' || mode=='UPDATE')
		   	{
		   		document.getElementById("deleteRecord").parentNode.removeChild(document.getElementById("deleteRecord"));
			  	document.getElementById("source").parentNode.removeChild(document.getElementById("source"));
			   	document.getElementById("field").parentNode.removeChild(document.getElementById("field"));
			   	var count2 = count1;
			    for(var k=1; k<=count1 ;k++)  
	    		   {
			    
	    		   	document.getElementById("deleteRecord"+k).parentNode.removeChild(document.getElementById("deleteRecord"+k));
				  	document.getElementById("source"+k).parentNode.removeChild(document.getElementById("source"+k));
				   	document.getElementById("fieldDisplay"+k).parentNode.removeChild(document.getElementById("fieldDisplay"+k));
					document.getElementById("batch"+k).remove();
				  	count2=new Number(count2)-1
	    		   }
	    	   document.getElementById("batch").parentNode.removeChild(document.getElementById("batch"));
	    	   document.getElementById("deletebatch").parentNode.removeChild(document.getElementById("deletebatch"));
	    	   document.getElementById("lables").value=new Number(count2);
	    	   batch=0;
	    	
		   	}
		  }
		 var tab  = document.getElementById('table1');
		 var tr = tab.insertRow(count1);
		 tr.id= "batch"+count1;
	     var Check   = tr.insertCell(0);
	     var source = tr.insertCell(1);
	     var FieldDisply   = tr.insertCell(2);
	     var tabInstrument  = document.getElementById('tableInstrument');
	     var trinst =tabInstrument.insertRow(countInst1);
	     trinst.id= "inst"+count1;
	     var instrument   = trinst.insertCell(0);
	     var sourceInstrument = trinst.insertCell(1);
	     var FieldDisplyInstrument   = trinst.insertCell(2);
	     var lenB =0;
	     var lenI =0;
	     
	 	if(modelError != null && (count1==0 || countInst ==0) &&  modelError !=0)
		{
	 		for(var g=0;g<modelError.D.length;g++)
	 		{
	 			if(modelError.D[g].Flag =='B')
	 				lenB= new Number(lenB)+1;
	 			else
	 				lenI= new Number(lenI)+1;
	 		}
		 
		  if(!document.getElementById("mypUseFor1").checked && lenB!=0)
		  {
		  	Check.innerHTML ="<label  id='deleteRecord'  />Select";
		  	source.innerHTML ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label  id='source' class='frmLabel' >Default Label" ;
		  	FieldDisply.innerHTML="<label  id='field' class='frmLabel' /> Custom Label";
		  }
		   for(var h=0;h<modelError.D.length;h++)
		   {
			 
			   if(modelError.D[h].Flag=='B' && !document.getElementById("mypUseFor1").checked )
				{
				   count1 = new Number(count1)+1;
				   tab  = document.getElementById('table1');
				   tr =tab.insertRow(count1);
				   tr.id='deleteRecord"+count1+"';
				   Check   = tab.insertCell(0);
				   source = tab.insertCell(1);
				   FieldDisply   = tab.insertCell(2);
				   Check.innerHTML ="&nbsp;&nbsp;<input type='checkbox' id='deleteRecord"+count1+"' onclick='checkboxvalidation();'  />";
				   if(modelError.D[h].Value == 0)
					   {
					   source.innerHTML = "<center><select  id='source"+count1+"'  onchange='setfocus(this);' cssClass='comboBox rounded' class='comboBox rounded'>"+
				       "<option value='"+modelError.D[h].Value+"' selected>"+modelError.D[h].Name+"</option>"+
					   "</select></center>";
					   var select =document.getElementById("source"+count1);
					   var index =0;
					   for(var l=0;l<model.D.length;l++)
						   {
						   		if(model.D[l].Flag=='B')
						   		{
								   for(var k=0;k<modelError.D.length;k++)
								   {
									   
								      if(model.D[l].Value == modelError.D[k].Value)
								    	  {
								    	     index=index+1;
								    	  }
								   
								   }
								   if(index==0)
									   {
									   select.options[select.options.length] = new Option(model.D[l].Name, model.D[l].Value);
									   
									   }
								   else
									   index=0;
						   		}
						   }
					 
					  
					   }
				   else
					   {
			       source.innerHTML = "<center><select  id='source"+count1+"' disabled='disabled' onchange='setfocusInst(this);' cssClass='comboBox rounded'  class='comboBox rounded'>"+
			       "<option value='"+modelError.D[h].Value+"' selected>"+modelError.D[h].Name+"</option>"+
				   "</select></center>";
					   }
				   FieldDisply.innerHTML="<input type='text'  id='fieldDisplay"+count1+"' value='"+modelError.D[h].Display+"' cssClass='amountBox rounded' class='amountBox rounded'  />";
				}
			   else
				   {
				   		
				   	   countInst = new Number(countInst)+1;
				   	   tabInstrument  = document.getElementById('tableInstrument').insertRow(countInst);
				   	   instrument   = tabInstrument.insertCell(0);
				   	   sourceInstrument = tabInstrument.insertCell(1);
				   	   FieldDisplyInstrument   = tabInstrument.insertCell(2);
				   	   instrument.innerHTML ="&nbsp;&nbsp;<input type='checkbox' id='deleteInstrument"+countInst+"' onclick='checkboxvalidationInst();' cssClass='checkbox' />";
					   if(modelError.D[h].Value == 0)
					   {
						   sourceInstrument.innerHTML = "<center><select  id='sourceInstrument"+countInst+"'  onchange='setfocusInst(this);' cssClass='comboBox rounded'  class='comboBox rounded'>"+
				       "<option value='"+modelError.D[h].Value+"' selected>"+modelError.D[h].Name+"</option>"+
					   "</select></center>"; 
					   var select =document.getElementById("sourceInstrument"+countInst);
					   var index =0;
					   for(var l=0;l<model.D.length;l++)
						   {
						   		if(model.D[l].Flag=='I')
						   		{
						   			
								   for(var k=0;k<modelError.D.length;k++)
								   {
									  
								      if(model.D[l].Value == modelError.D[k].Value)
								    	  {
								    	     index=index+1;
								    	  }
								   
								   }
								   if(index==0)
									   {
									   select.options[select.options.length] = new Option(model.D[l].Name, model.D[l].Value);
									   }
								   else
									   index=0;
						   		}
						   }
					   document.getElementById("cloneButton1").disabled=true;
					   }
					   else
						   {
						   sourceInstrument.innerHTML = "<center><select  id='sourceInstrument"+countInst+"' disabled='disabled' onchange='setfocusInst(this);' cssClass='comboBox rounded'  class='comboBox rounded'>"+
					       "<option value='"+modelError.D[h].Value+"' selected>"+modelError.D[h].Name+"</option>"+
						   "</select></center>"; 
						   }
					   FieldDisplyInstrument.innerHTML="<input type='text'  id='fieldDisplayInstrument"+countInst+"' value='"+modelError.D[h].Display+"' cssClass='amountBox rounded'   />";
				   
				   
				   
				   }
			 
			   
		   }
		   if(!document.getElementById("mypUseFor1").checked && lenB !=0)
			   {
				   	 var element = document.createElement("input"); 
				     element.setAttribute("type", 'button');   
				     element.setAttribute("value", 'Add'); 
				     element.setAttribute("name", "batch");
				     element.setAttribute("id", "batch");
				     element.setAttribute("onclick", 'draw()');
				     element.setAttribute("class",'ux_button-padding ux_button-background ux_no-border');
				    // element.setAttribute("disabled", 'disabled');
				     var element1 = document.createElement("input"); 
				     element1.setAttribute("type", 'button');   
				     element1.setAttribute("value", 'Delete'); 
				     element1.setAttribute("name", "deletebatch");
				     element1.setAttribute("id", "deletebatch");
				     element1.setAttribute("onclick", 'deleterecord()');
				     element1.setAttribute("disabled", 'disabled');
				     element1.setAttribute("class",'ux_button-padding ux_button-background ux_no-border');
				     var foo = document.getElementById("fooBar"); 
				     foo.appendChild(element); 
				     foo.appendChild(element1); 
			   }
		   
		   document.getElementById("lables").value=new Number(count1); 
		   document.getElementById("lablesInst").value=new Number(countInst); 
		   if(countInst !=0 &&  document.getElementById("sourceInstrument"+countInst).value !=0)
			 {
			   document.getElementById("cloneButton1").disabled=false;
			 }
		 
		   if(  lenB !=0 && document.getElementById("source"+count1).value == 0)
			 {
			   document.getElementById("batch").disabled=true;
			 }
		   modelError=0; 
		  
		  
		  
		}
	     if(editmodel !=0)
	     {
	    	
	    	if(mode =='EDIT' &&   leneditBatch != 0  && !document.getElementById("mypUseFor1").checked)
	     	{
	    		  
	    		   Check.innerHTML ="<label  id='deleteRecord'  />Select";
	    		  	source.innerHTML ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label  id='source' class='frmLabel' >Default Label" ;
	    		  	FieldDisply.innerHTML="<label  id='field' class='frmLabel' /> Custom Label";
				   for(var h=0;h<editmodel.D.length;h++)
				   {
					   if(editmodel.D[h].Flag=='B')
						{
						   count1 = new Number(count1)+1;
						   tab  = document.getElementById('table1');
						   var tr= tab.insertRow(count1);
						   tr.id="batch"+count1;
						   Check   = tr.insertCell(0);
						   source = tr.insertCell(1);
						   FieldDisply   = tr.insertCell(2);
						   Check.innerHTML ="&nbsp;&nbsp;<input type='checkbox' id='deleteRecord"+count1+"' onclick='checkboxvalidation();'  cssClass='checkbox' />";
					       source.innerHTML = "<center><select  id='source"+count1+"' disabled='disabled' onchange='setfocusInst(this);' cssClass='comboBox rounded'  class='comboBox rounded'>"+
					       "<option value='"+editmodel.D[h].Value+"' selected>"+editmodel.D[h].Name+"</option>"+
						   "</select></center>"; 
						   FieldDisply.innerHTML="<input type='text' id='fieldDisplay"+count1+"' value='"+editmodel.D[h].Display+"' cssClass='amountBox rounded' class='amountBox rounded'  />";
						}
					   
				   }
				   
				   var element = document.createElement("input"); 
				     element.setAttribute("type", 'button');   
				     element.setAttribute("value", 'Add'); 
				     element.setAttribute("name", "batch");
				     element.setAttribute("id", "batch");
				     element.setAttribute("onclick", 'draw()');
				     element.setAttribute("class",'ux_button-padding ux_button-background ux_no-border');
				   //  element.setAttribute("disabled", 'disabled');
				     var element1 = document.createElement("input"); 
				     element1.setAttribute("type", 'button');   
				     element1.setAttribute("value", 'Delete'); 
				     element1.setAttribute("name", "deletebatch");
				     element1.setAttribute("id", "deletebatch");
				     element1.setAttribute("onclick", 'deleterecord()');
				     element1.setAttribute("disabled", 'disabled');
				     element1.setAttribute("class",'ux_button-padding ux_button-background ux_no-border');
				     var foo = document.getElementById("fooBar"); 
				     foo.appendChild(element); 
				     foo.appendChild(element1); 
				     editmodel=0;
				   document.getElementById("lables").value=new Number(count1); 
	     	}
	     }
	     	count1 =document.getElementById("lables").value;
	     
		  if(count1==0 && !document.getElementById("mypUseFor1").checked && batch==0 )
		 	{
			
			  		Check.innerHTML ="<label  id='deleteRecord'  />Select";
				  	source.innerHTML ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label  id='source' class='frmLabel' >Default Label" ;
				  	FieldDisply.innerHTML="<label  id='field' class='frmLabel' /> Custom Label";
				 /*  count = new Number(count1)+1;
				   tab  = document.getElementById('table1').insertRow(count);
				   Check   = tab.insertCell(0);
				   source = tab.insertCell(1);
				   FieldDisply   = tab.insertCell(2);
				   Check.innerHTML ="<input type='checkbox' id='deleteRecord"+count+"' onclick='checkboxvalidation();' cssClass='checkbox' />";
				   source.innerHTML = "<center><select  id='source"+count+"' onchange='setfocus(this);' class='comboBox rounded' cssClass='comboBox rounded'>"+
				   "<option value='0' selected>--Select--</option>"+
			       "</select></center>";
			     FieldDisply.innerHTML="<input type='text' onblur='validateDescBacth(this);' id='fieldDisplay"+count+"'  class='amountBox rounded' />";
			     var select =document.getElementById("source"+count);
			     for(var j=0;j< model.D.length;j++)
			     {
			    	if(model.D[j].Flag == 'B')
			    	{
			    		 select.options[select.options.length] = new Option(model.D[j].Name, model.D[j].Value);
			    	}
			     }*/
			     var element = document.createElement("input"); 
			     element.setAttribute("type", 'button');   
			     element.setAttribute("value", 'Add'); 
			     element.setAttribute("name", "batch");
			     element.setAttribute("id", "batch");
			     element.setAttribute("onclick", 'draw()');
			     element.setAttribute("class",'ux_button-padding ux_button-background ux_no-border');
			    // element.setAttribute("disabled", 'disabled');
			     var element1 = document.createElement("input"); 
			     element1.setAttribute("type", 'button');   
			     element1.setAttribute("value", 'Delete'); 
			     element1.setAttribute("name", "deletebatch");
			     element1.setAttribute("id", "deletebatch");
			     element1.setAttribute("onclick", 'deleterecord()');
			     element1.setAttribute("disabled", 'disabled');
			     element1.setAttribute("class",'ux_button-padding ux_button-background ux_no-border');
			     var foo = document.getElementById("fooBar"); 
			     foo.appendChild(element); 
			     foo.appendChild(element1); 
			     batch=batch+1;
			     //document.getElementById("lables").value=new Number(count);
		 	}
		   if(countInst==0)
			  {
			    /*instrument.innerHTML ="<input type='checkbox' id='deleteInstrument"+countInst1+"' onclick='checkboxvalidationInst();' cssClass='checkbox' />";
			     sourceInstrument.innerHTML = "<center><select  id='sourceInstrument"+countInst1+"' onchange='setfocusInst(this);' cssClass='comboBox rounded'>"+
			     "<option value='0' selected>--Select--</option>"+
			     "</select></center>";
			     FieldDisplyInstrument.innerHTML="<input type='text'  onblur='validateDescInst(this);' id='fieldDisplayInstrument"+countInst1+"' cssClass='amountBox rounded' class='amountBox rounded' />";
			     var selectInstrument =document.getElementById("sourceInstrument"+countInst1);
			     for(var j=0;j<model.D.length;j++)
			     {
			    	 if(model.D[j].Flag == 'I')
				    	{
			    		 selectInstrument.options[selectInstrument.options.length] = new Option(model.D[j].Name, model.D[j].Value);
				    	}
			     }
			     document.getElementById("lablesInst").value=new Number(countInst1);*/
			  }
	return true;
		
	}
	function deleteInstrument()
	{
		var count = document.getElementById("lablesInst").value;
		document.getElementById("deleteButton").disabled=true;
		var count2=count;
		var selectedList=[{}];
		var finalList =[{}];
		var q=0;
		var p=0;
		var t=0;
		var index=0;
		/*var model = {Maths:[{"value" : "lbl.pir.holidayAction", "Name" :" Holiday Action"},{"value" : "lbl.pirheader.status", "Name" :"status"},{"value" : "lbl.pirheader.txn.status", "Name" :"Transaction Status"}]};
		
		for(var i=1; i<= count;i++)
		{
			if(document.getElementById("deleteInstrument"+i).checked==true)
			{
			  t++;
			}
		}
		if(t==0)
		{
		  alert( "Please select atleast one row");
		  return false;
		}*/
		for(var i=1; i<= count;i++)
		{
		  
			if(document.getElementById("deleteInstrument"+i).checked==true)
				{
					
				  		t++;
					  	document.getElementById("deleteInstrument"+i).parentNode.removeChild(document.getElementById("deleteInstrument"+i));
					  	document.getElementById("sourceInstrument"+i).parentNode.removeChild(document.getElementById("sourceInstrument"+i));
					   	document.getElementById("fieldDisplayInstrument"+i).parentNode.removeChild(document.getElementById("fieldDisplayInstrument"+i));
						document.getElementById("inst"+i).remove();
					  	count2=new Number(count2)-1
					  	document.getElementById("lablesInst").value =new Number(count2);
			
				}
			else
				{
				
					   	selectedList[p] ={Maths:[{"checkbox":document.getElementById("deleteInstrument"+i).value,"source":document.getElementById("sourceInstrument"+i).value,"sourceName":document.getElementById("sourceInstrument"+i).options[document.getElementById("sourceInstrument"+i).selectedIndex].text,"fieldDisplay":document.getElementById("fieldDisplayInstrument"+i).value}]};
					   	document.getElementById("deleteInstrument"+i).parentNode.removeChild(document.getElementById("deleteInstrument"+i));
					  	document.getElementById("sourceInstrument"+i).parentNode.removeChild(document.getElementById("sourceInstrument"+i));
					   	document.getElementById("fieldDisplayInstrument"+i).parentNode.removeChild(document.getElementById("fieldDisplayInstrument"+i));
					   	document.getElementById("inst"+i).remove();
					   	p++;
				}
			
		}
		
	
		for(var i=0;i<model.D.length;i++)
		{
			for(var j=0;j<selectedList.length-1;j++)
				{
			
				   if(selectedList[j].Maths[0].source==model.D[i].Value )
					{
					     index=1;
					     break;
					}
				   else
					   index=0;
				}
			 	if(index!=1)
				 {
			 		if( model.D[i].Flag=='I')
				   	{
					   finalList[q]={Maths:[{"value":model.D[i].Value,"Name":model.D[i].Name}]};
					   q++;
				   	}
				 }
			}
			
						document.getElementById("list").value=new Number(finalList.length);
						count2=0;
						count=document.getElementById("lablesInst").value;
				for(i=1;i<=count;i++)
					{
							
							count2= new Number(count2)+1;
					 		var tab  = document.getElementById('tableInstrument');
					 		var tr = tab.insertRow(count2);
					 		tr.id="inst"+count2
				     		var Check   = tr.insertCell(0);
				    		var source = tr.insertCell(1);
				     		var FieldDisply   = tr.insertCell(2);
				     		Check.innerHTML ="&nbsp;&nbsp;<input type='checkbox' id='deleteInstrument"+i+"' onclick='checkboxvalidationInst();' Class='checkbox' />";
				     		if(selectedList[i-1].Maths[0].source !=0)
				     			{
						     	     source.innerHTML = "<center><select  id='sourceInstrument"+i+"' disabled='disabled' Class='comboBox rounded' onchange='setfocusInst(this);'>"+
						     	     "<option value='"+selectedList[i-1].Maths[0].source+"' selected>"+selectedList[i-1].Maths[0].sourceName+"</option>"+
						     	     "</select></center>"; 
				     			}else{
				     				 source.innerHTML = "<center><select  id='sourceInstrument"+i+"'  onchange='setfocusInst(this);' Class='comboBox rounded'>"+
						     	     "<option value='"+selectedList[i-1].Maths[0].source+"' selected>"+selectedList[i-1].Maths[0].sourceName+"</option>"+
						     	     "</select></center>"; 
				     			}
	    	     FieldDisply.innerHTML="<input type='text' id='fieldDisplayInstrument"+i+"' value='"+selectedList[i-1].Maths[0].fieldDisplay+"' cssClass='amountBox rounded' class='amountBox rounded'  />";
			   
	    	     var select =document.getElementById("sourceInstrument"+i);
	    	     for(var j=0 ;j<finalList.length;j++)
	    	    	 {
	    	    	    select.options[select.options.length] = new Option(finalList[j].Maths[0].Name, finalList[j].Maths[0].value);
	    	    	 }
				
				}
				if(count==0)
					{
					document.getElementById("cloneButton1").disabled=false;
					}
				if(lenInst > count)
				{
				document.getElementById("cloneButton1").disabled=false;
				}
				
				
		
		
	}
	function AddInstrument()
	{
	
		var selectedList =[{}];
		var finalList =[{}];
		var count1 =document.getElementById("lablesInst").value;
		var jsonString =document.getElementById("jsonAsStringInst").value;
		var q=0;
		var index=0;
		var count = new Number(count1)+1;
		var tabInst  = document.getElementById('tableInstrument');
		var tr = tabInst.insertRow(count);
 		tr.id="inst"+count;
	    var instrument   = tr.insertCell(0);
	    var sourceInst = tr.insertCell(1);
	    var FieldDisplyInst   = tr.insertCell(2);
	 	var list = document.getElementById("listInst").value;
		var list = new Array();
		var t=0;
		if(count1>0 && lenInst > count1)
	 	{
			var count3 = document.getElementById("lablesInst").value;
			var increment=0;
			/*for(var i=1; i<= count3;i++)
				{
					var e = document.getElementById("sourceInstrument"+i); 
				  	var index = e.options[e.selectedIndex].value; 
				   if (index==0)
					   {
					    	alert("Please select Source Field");
					    	document.getElementById("sourceInstrument"+i).focus();
					       return false;
					   }
				   if(document.getElementById("fieldDisplayInstrument"+i).value=="")
					   {
					     alert("Please Enter Data in Field Display text");
					     document.getElementById("fieldDisplayInstrument"+i).focus();
					       return false;
					   }
				}*/
	 		
	 		for(var j =1;count1>=j;j++)
	 		{	
			    selectedList[j-1] ={Maths:[{"checkbox":document.getElementById("deleteInstrument"+j).value,"source":document.getElementById("sourceInstrument"+j).value,"fieldDisplayInstrument":document.getElementById("fieldDisplayInstrument"+j).value}]};
	 		 	document.getElementById("sourceInstrument"+j).disabled=true;
	        }
	 		for(var i=0;i<model.D.length;i++)
	 			{
	 					
	 				for(var j=0;j<selectedList.length;j++)
	 				{
	 					
	 				   if(selectedList[j].Maths[0].source==model.D[i].Value )
	 					{
	 					    index=1;
	 					     break;
	 					}
	 				   else
	 					   index=0;
	 				   
	 				}
	 			 if(index!=1)
	 			   {
	 				 if( model.D[i].Flag=='I')
					   {
					   		finalList[q]={D:[{"value":model.D[i].Value,"Name":model.D[i].Name}]};
					   		q++;
					   	}
	 				 }
	 			}
	 		
	 		
	 		instrument.innerHTML ="&nbsp;&nbsp;<input type='checkbox' id='deleteInstrument"+count+"' onclick='checkboxvalidationInst();' Class='checkbox' />";
	 	     sourceInst.innerHTML = "<center><select  id='sourceInstrument"+count+"' onchange='setfocusInst(this);' Class='comboBox rounded'>"+
	 	     
	 	     "<option value='0' selected>--Select--</option>"+
	 	   
		      	     
	 	     "</select></center>"; 
	 	     
	 	    FieldDisplyInst.innerHTML="<input type='text'  id='fieldDisplayInstrument"+count+"' cssClass='amountBox rounded' class='amountBox rounded'/>";
	 	    var select =document.getElementById("sourceInstrument"+count);
	 	    
	 	   for(var j=0 ;j<finalList.length;j++)
	  	 {
	 		  
	 			  select.options[select.options.length] = new Option(finalList[j].D[0].Name, finalList[j].D[0].value);
		    	
	  	 }
			
				 
	 	     document.getElementById("lablesInst").value=new Number(count);
	 	     
	 		
	 	}else if(lenInst > count1 && count1==0){
	 		
	 		instrument.innerHTML ="&nbsp;&nbsp;<input type='checkbox' id='deleteInstrument"+count+"' onclick='checkboxvalidationInst();' Class='checkbox'/>";
	 		sourceInst.innerHTML = "<center><select  id='sourceInstrument"+count+"' onchange='setfocusInst(this);' Class='comboBox rounded'>"+
		     "<option value='0' selected>--Select--</option>"+
		     
		        "</select></center>";
	
	 		FieldDisplyInst.innerHTML="<input type='text'  id='fieldDisplayInstrument"+count+"' cssClass='amountBox rounded' class='amountBox rounded' />";
		     
		     var selectInstrument =document.getElementById("sourceInstrument"+count);
		     
		    
		     for(var j=0;j<model.D.length;j++)
		     {
		    	 if(model.D[j].Flag=='I')
			    	{
		    		 	selectInstrument.options[selectInstrument.options.length] = new Option(model.D[j].Name, model.D[j].Value);
			    	}
		     }
		     document.getElementById("lablesInst").value=new Number(count);
	
			
	 	}
		document.getElementById("cloneButton1").disabled=true;
	     
	}
		
	function draw()
	{
		
		var selectedList =[{}];
		var finalList =[{}];
		var count1 =document.getElementById("lables").value;
		var jsonString =document.getElementById("jsonAsString").value;
		var q=0;
		var index=0;
		var count = new Number(count1)+1;
		var tab  ;
	    var Check ;
	    var source ;
	    var FieldDisply;
	 	var list = document.getElementById("list").value;
		var list = new Array();
		var t=0;
		if(count1>0 && lenBatch > count1  )
	 	{
			var count3 = document.getElementById("lables").value;
			var increment=0;
			/*for(var i=1; i<= count3;i++)
				{
					var e = document.getElementById("source"+i); 
					var index = e.options[e.selectedIndex].value; 
				   if (index==0)
					   {
					    	alert("Please select Source Field");
					    	document.getElementById("source"+i).focus();
					       return false;
					   }
				   if(document.getElementById("fieldDisplay"+i).value=="")
					   {
					     alert("Please Enter Data in Field Display text");
					     document.getElementById("fieldDisplay"+i).focus();
					     return false;
					   }
				}*/
	 		
	 		for(var j =1;count1>=j;j++)
	 		{	
			    selectedList[j-1] ={Maths:[{"checkbox":document.getElementById("deleteRecord"+j).value,"source":document.getElementById("source"+j).value,"Name":document.getElementById("source"+j).options[document.getElementById("source"+j).selectedIndex].text, "fieldDisplay":document.getElementById("fieldDisplay"+j).value}]};
			    document.getElementById("deleteRecord"+j).parentNode.removeChild(document.getElementById("deleteRecord"+j));
			  	document.getElementById("source"+j).parentNode.removeChild(document.getElementById("source"+j));
			   	document.getElementById("fieldDisplay"+j).parentNode.removeChild(document.getElementById("fieldDisplay"+j));
				document.getElementById("batch"+j).remove();
			  
	        }
	 		for(var i=0;i<model.D.length ;i++)
	 			{
	 					
	 				for(var j=0;j<selectedList.length;j++)
	 				{
	 					
	 				   if(selectedList[j].Maths[0].source==model.D[i].Value )
	 					{
	 					 
	 					  
	 					    index=1;
	 					     break;
	 					   
	 					}
	 				   else
	 					   index=0;
	 				   
	 				}
	 			 if(index!=1)
	 				 {
	 				   	if( model.D[i].Flag=='B')
	 				   	{
	 				   		finalList[q]={D:[{"value":model.D[i].Value,"Name":model.D[i].Name}]};
	 				   		q++;
	 				   	}
	 				 }
	 			}
	 		
	 		for(var x=1;x<=selectedList.length;x++)
	 		{
	 			 tab  = document.getElementById('table1');
	 			 tr = tab.insertRow(x);
	 			 tr.id="batch"+x;
	 		     Check   = tr.insertCell(0);
	 		     source = tr.insertCell(1);
	 		     FieldDisply   = tr.insertCell(2);
	 		     Check.innerHTML ="&nbsp;&nbsp;<input type='checkbox' id='deleteRecord"+x+"' onclick='checkboxvalidation();' Class='checkbox' />";
	 		     source.innerHTML = "<center><select  id='source"+x+"' disabled='disabled' onchange='setfocus(this);' Class='comboBox rounded'>"+
	 		     "<option value='"+selectedList[x-1].Maths[0].source+"' selected>"+selectedList[x-1].Maths[0].Name+"</option>"+
	 		     "</select></center>"; 
		     
	 		     FieldDisply.innerHTML="<input type='text'  id='fieldDisplay"+x+"' value='"+selectedList[x-1].Maths[0].fieldDisplay+"' cssClass='amountBox rounded' class='amountBox rounded'  />";
	 			
	 		}
	 		 tab  = document.getElementById('table1');
	 		 tr = tab.insertRow(count);
			 tr.id="batch"+count;
	 		 Check   = tr.insertCell(0);
		     source = tr.insertCell(1);
		     FieldDisply   = tr.insertCell(2);
	 	 	 Check.innerHTML ="&nbsp;&nbsp;<input type='checkbox' id='deleteRecord"+count+"' onclick='checkboxvalidation();' Class='checkbox' />";
	 	     source.innerHTML = "<center><select  id='source"+count+"' onchange='setfocus(this);' Class='comboBox rounded'>"+
	 	     "<option value='0' selected>--Select--</option>"+
	 	     "</select></center>"; 
	         FieldDisply.innerHTML="<input type='text'   id='fieldDisplay"+count+"' cssClass='amountBox rounded' class='amountBox rounded' />";
	 	     var select =document.getElementById("source"+count);
	 	   for(var j=0 ;j<finalList.length;j++)
	 	   {
	 		   select.options[select.options.length] = new Option(finalList[j].D[0].Name, finalList[j].D[0].value);
	 	   }
	 	     document.getElementById("lables").value=new Number(count);
	 	}else if(lenBatch >count1 && count1==0){
	 		
	 		 tab  = document.getElementById('table1');
	 		 tr = tab.insertRow(count);
			 tr.id="batch"+count;
		     Check   = tr.insertCell(0);
		     source = tr.insertCell(1);
		     FieldDisply   = tr.insertCell(2);
		     Check.innerHTML ="&nbsp;&nbsp;<input type='checkbox' id='deleteRecord"+count+"'  onclick='checkboxvalidation();' Class='checkbox' />";
		     source.innerHTML = "<center><select  id='source"+count+"' onchange='setfocus(this);' Class='comboBox rounded'>"+
		     "<option value='0' selected>--Select--</option>"+
	         "</select></center>";
		     FieldDisply.innerHTML="<input type='text'  id='fieldDisplay"+count+"' cssClass='amountBox rounded' class='amountBox rounded' />";
		     var select =document.getElementById("source"+count);
		     for(var j=0;j< model.D.length;j++)
		     {
		    		if( model.D[j].Flag=='B')
					   	{
		    				select.options[select.options.length] = new Option(model.D[j].Name, model.D[j].Value);
					   	}
		     }
		     	document.getElementById("lables").value=new Number(count);
	 		
	 	}
		document.getElementById("batch").disabled=true;
		
			
	     
	}
	function setfocus(str)
	{
		var count = document.getElementById("lables").value;
		
		for(var i=1; i<= count;i++)
		{
			if(document.getElementById("source"+i).value ==str.value && document.getElementById("source"+i).value !=0)
				{
					
					document.getElementById("batch").disabled =false;
					document.getElementById("fieldDisplay"+i).focus();
					document.getElementById("fieldDisplay"+i).value="";
					
				}
			else if( document.getElementById("source"+i).value ==0)
				{
				
					document.getElementById("batch").disabled =true;
					document.getElementById("fieldDisplay"+i).focus();
					document.getElementById("fieldDisplay"+i).value="";
				}
		}
		 
	}
	function validateDescInst(elem){
		var alphaExp = /^[a-zA-Z ]+$/;
		if(elem.value.match(alphaExp))
			{
			 return true
			}
		else
			{
				if(elem.value == ' ')
				{
					alert("Please Enter Data ");
				}
				else{
					alert("only Alphabets and Spaces are allowed ");
				}
				var count = document.getElementById("lables").value;
				for(var i=1; i<= count;i++)
				{
					if(document.getElementById("fieldDisplay"+i).value ==elem.value)
						{
							
							document.getElementById("fieldDisplayInstrument"+i).focus();
							
						}
				}
				
			}
	}
	
	
	function validateDescBacth(elem){
		var alphaExp = /^[a-zA-Z ]+$/;
		
		if(elem.value.match(alphaExp))
			{
			 return true
			}
		else
			{
				if(elem.value == ' ')
				{
					alert("Please Enter Data ");
				}
				else{
					alert("only Alphabets and Spaces are allowed ");
				}
				var count = document.getElementById("lables").value;
				for(var i=1; i<= count;i++)
				{
					if(document.getElementById("fieldDisplay"+i).value ==elem.value)
						{
							
							document.getElementById("fieldDisplay"+i).focus();
							
						}
				}
				
			}
	}
	function setfocusInst(str)
	{
		var count = document.getElementById("lablesInst").value;
		for(var i=1; i<= count;i++)
		{
			if(document.getElementById("sourceInstrument"+i).value ==str.value && document.getElementById("sourceInstrument"+i).value !=0)
				{
					document.getElementById("cloneButton1").disabled=false;
					document.getElementById("fieldDisplayInstrument"+i).focus();
					document.getElementById("fieldDisplayInstrument"+i).value="";
					
				}
			else if(document.getElementById("sourceInstrument"+i).value ==0)
			{
			
				document.getElementById("cloneButton1").disabled =true;
				document.getElementById("fieldDisplayInstrument"+i).focus();
				document.getElementById("fieldDisplayInstrument"+i).value="";
			}
			
		}
		 
	}
	
	function validateQuickFlag()
	{
	   if(document.getElementById("mypQuickLink1").checked==true)
		   {
		   	document.getElementById("quickLinkDescription").disabled=false;
		   	document.getElementById("quickLinkDescription").focus();
		   }
	   else
		   {
		   	 document.getElementById("quickLinkDescription").value='';
		   	 document.getElementById("quickLinkDescription").disabled=true;
		   }
		
	}
	
		
	function validationLables()
	{
		
			
			var count = document.getElementById("lables").value;
			var countInstrument =document.getElementById("lablesInst").value;
			
			var p=0;
			if(count>=1)
			{
				for(var i=1; i<= count;i++)
				{
					if(document.getElementById("source"+i).value ==0)
						{
						   alert("Please select Source Field");
						   document.getElementById("source"+i).focus();
						   return false;
						}
					else  if(document.getElementById("fieldDisplay"+i).value=="")
					   {
					     alert("Please Enter Data in Field Display text");
					     document.getElementById("fieldDisplay"+i).focus();
					       return false;
					   }
				}
				for(var i=1; i<= countInstrument;i++)
				{
					if(document.getElementById("sourceInstrument"+i).value ==0)
						{
						   alert("Please select Source Field");
						   document.getElementById("sourceInstrument"+i).focus();
						   return false;
						}
					else  if(document.getElementById("fieldDisplayInstrument"+i).value=="")
					   {
					     alert("Please Enter Data in Field Display text");
					     document.getElementById("fieldDisplayInstrument"+i).focus();
					       return false;
					   }
				}
				
			}
	}
	
	function check(strUrl)
	{
		
		var count = document.getElementById("lables").value;
		var countInstrument =document.getElementById("lablesInst").value;
		var p=0;
		var selectedList={};
			for(var i=1; i<= count;i++)
			{
				
				//if(document.getElementById("source"+i).value !=0)
				{
					selectedList[p] ={Maths:[{"source":document.getElementById("source"+i).value,"sourceName":document.getElementById("source"+i).options[document.getElementById("source"+i).selectedIndex].text,"fieldDisplay":document.getElementById("fieldDisplay"+i).value,"flag":"B"}]};
					p++;
				}
				
			}
			for(var i=1; i<= countInstrument;i++)
			{
				
				//if(document.getElementById("sourceInstrument"+i).value !=0)
				{
					selectedList[p] ={Maths:[{"source":document.getElementById("sourceInstrument"+i).value,"sourceName":document.getElementById("sourceInstrument"+i).options[document.getElementById("sourceInstrument"+i).selectedIndex].text,"fieldDisplay":document.getElementById("fieldDisplayInstrument"+i).value,"flag":"I"}]};
					p++;
				}
			}
			var jsonAsString = JSON.stringify(selectedList); 
			document.getElementById("jsonAsString").value=jsonAsString;
			update(strUrl);
		return true;
	}
	
	function checkboxvalidationInst()
	{
		var count = document.getElementById("lablesInst").value;
		var t=0;
		for(var i=1; i<= count;i++)
		{
			if(document.getElementById("deleteInstrument"+i).checked==true)
			{
				document.getElementById("deleteButton").disabled=false;
			  t++;
			}
		}
		if(t==0)
		{
			
			document.getElementById("deleteButton").disabled=true;
		  return false;
		}
	}
	function checkboxvalidation()
	{
		var count = document.getElementById("lables").value;
		var t=0;
		for(var i=1; i<= count;i++)
		{
			if(document.getElementById("deleteRecord"+i).checked==true)
			{
				document.getElementById("deletebatch").disabled=false;
			  t++;
			}
		}
		if(t==0)
		{
			
			document.getElementById("deletebatch").disabled=true;
		  return false;
		}
	}
		
		
	function deleterecord()
	{
		var count = document.getElementById("lables").value;
		document.getElementById("deletebatch").disabled=true;
		var count2=count;
		var selectedList=[{}];
		var finalList =[{}];
		var q=0;
		var p=0;
		var t=0;
		var index=0;
		//var model = {Maths:[{"value" : "1", "Name" :"Product Entry"},{"value" : "2", "Name" :"Benifieshaiary"},{"value" : "3", "Name" :"Amount"},{"value" : "4", "Name" :"Client"},{"value" : "5", "Name" :"Bank"}]};
	
		for(var i=1; i<= count;i++)
		{
			if(document.getElementById("deleteRecord"+i).checked==true)
				{
				  		t++;
					  	document.getElementById("deleteRecord"+i).parentNode.removeChild(document.getElementById("deleteRecord"+i));
					  	document.getElementById("source"+i).parentNode.removeChild(document.getElementById("source"+i));
					   	document.getElementById("fieldDisplay"+i).parentNode.removeChild(document.getElementById("fieldDisplay"+i));
						document.getElementById("batch"+i).remove();
					  	count2=new Number(count2)-1
					  	document.getElementById("lables").value =new Number(count2);
			
				}
			else
				{
					   	selectedList[p] ={Maths:[{"checkbox":document.getElementById("deleteRecord"+i).value,"source":document.getElementById("source"+i).value,"sourceName":document.getElementById("source"+i).options[document.getElementById("source"+i).selectedIndex].text,"fieldDisplay":document.getElementById("fieldDisplay"+i).value}]};
					   	document.getElementById("deleteRecord"+i).parentNode.removeChild(document.getElementById("deleteRecord"+i));
					  	document.getElementById("source"+i).parentNode.removeChild(document.getElementById("source"+i));
					   	document.getElementById("fieldDisplay"+i).parentNode.removeChild(document.getElementById("fieldDisplay"+i));
					   	document.getElementById("batch"+i).remove();
					   	p++;
				}
			
		}
		for(var i=0;i<model.D.length;i++)
		{
			for(var j=0;j<selectedList.length-1;j++)
				{
			
				   if(selectedList[j].Maths[0].source==model.D[i].Value )
					{
					  
					    index=1;
					     break;
					   
					}
				   else
					   index=0;
				   
				}
			 if(index!=1)
				 {
					if( model.D[i].Flag=='B')
					   	{
						   finalList[q]={Maths:[{"value":model.D[i].Value,"Name":model.D[i].Name}]};
						   	q++;
					   	}
				 }
			}
			
					document.getElementById("list").value=new Number(finalList.length);
					count2=0;
					count=document.getElementById("lables").value;
				for(i=1;i<=count;i++)
					{
							
							count2= new Number(count2)+1;
					 		var tab  = document.getElementById('table1');
					 		var tr = tab.insertRow(count2);
					 		tr.id="batch"+count2;
				     		var Check   = tr.insertCell(0);
				    		var source = tr.insertCell(1);
				     		var FieldDisply   = tr.insertCell(2);
				     		Check.innerHTML ="&nbsp;&nbsp;<input type='checkbox' id='deleteRecord"+i+"' onclick='checkboxvalidation();' Class='checkbox'/>";
				     		
				     		if(selectedList[i-1].Maths[0].source !=0)
				     			{
						     	     source.innerHTML = "<center><select  id='source"+i+"' disabled='disabled'  onchange='setFocus(this);' Class='comboBox rounded'>"+
						     	     "<option value='"+selectedList[i-1].Maths[0].source+"' selected>"+selectedList[i-1].Maths[0].sourceName+"</option>"+
						     	    "</select></center>"; 
				     			}else{
				     				 source.innerHTML = "<center><select  id='source"+i+"'  onchange='setFocus(this);' Class='comboBox rounded'>"+
						     	     "<option value='"+selectedList[i-1].Maths[0].source+"' selected>"+selectedList[i-1].Maths[0].sourceName+"</option>"+
						     	    "</select></center>"; 
				     			}
				 FieldDisply.innerHTML="<input type='text' cssClass='amountBox rounded' class='amountBox rounded' id='fieldDisplay"+i+"' value='"+selectedList[i-1].Maths[0].fieldDisplay+"'  />";
			     var select =document.getElementById("source"+i);
			     
	    	     for(var j=0 ;j<finalList.length;j++)
	    	    	 {
	    	    	    select.options[select.options.length] = new Option(finalList[j].Maths[0].Name, finalList[j].Maths[0].value);
	    	    	 }
				}
				if(count==0)
				document.getElementById("batch").disabled=false;
				if(lenBatch > count)
					document.getElementById("batch").disabled=false;
				
				
	}
	
	function showAddNewForm(strUrl)
	{
		if (strMstType == "C" && strTemplateType == "N")
			strUrl = 'addCollMyProduct.form';
		else if (strMstType == "C" && strTemplateType == "Y")
			strUrl = 'addCollTempMyProduct.form';
		else if (strMstType == "P" && strTemplateType == "Y")
			strUrl = 'addTempMyProduct.form';
		else if (strMstType == "F")
			strUrl = 'addForeMyProduct.form';
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();	
	}
	
	function showHistoryForm(strAction, index)
	{
		var intTop  = (screen.availHeight - 300)/2;
		var intLeft = (screen.availWidth - 400)/2;
		var strAttr = "dependent=yes,scrollbars=yes,";
		strAttr = strAttr + "left=" + intLeft + ",";
		strAttr = strAttr + "top=" + intTop + ",";
		strAttr = strAttr + "width=400,height=300";
	
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;
		if ("AUTH" == strAction)
			frm.action = "myProductAuthHistory.hist";
		else
			frm.action = "myProductHistory.hist";
		frm.target = "hWinHistory";
		frm.method = "POST";
	
		window.open ("", "hWinHistory", strAttr);
		frm.submit();
	}
	
	function showViewForm(strUrl, index)
	{
		var frm = document.forms["frmMain"]; 
		document.getElementById("txtIndex").value = index;
		if(mode == "AUTH")
		{
			if (strMstType == 'C' && strTemplateType == 'N')
				strUrl = "authViewCollMyProduct.form";
			else if (strMstType == 'C' && strTemplateType == 'Y')
				strUrl = "authViewCollTempMyProduct.form";
			else if (strMstType == 'F')
				strUrl = "authViewForeMyProduct.form";
			else if (strMstType == 'P' && strTemplateType == 'Y')
				strUrl = "authViewTempMyProduct.form";
			else
				strUrl = "authViewMyProduct.form";
		}
		else
		{
			if (strMstType == 'C' && strTemplateType == 'N' )
				strUrl = "viewCollMyProduct.form";
			else if (strMstType == 'C' && strTemplateType == 'Y' )
				strUrl = "viewCollTempMyProduct.form";
			else if (strMstType == 'F')
				strUrl = "viewForeMyProduct.form";
			else if (strMstType == 'P' && strTemplateType == 'Y')
				strUrl = "viewTempMyProduct.form";
			else
				strUrl ="viewMyProduct.form";
		}
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	
	function showEditForm(strUrl, index)
	{
		var frm = document.forms["frmMain"]; 
		document.getElementById("txtIndex").value = index;
		if (strMstType == 'C' && strTemplateType == 'N' )
			strUrl = 'editCollMyProduct.form';
		else if (strMstType == 'C' && strTemplateType == 'Y' )
			strUrl = 'editCollTempMyProduct.form';
		else if (strMstType == 'F')
			strUrl = 'editForeMyProduct.form';
		else if (strMstType == 'P' && strTemplateType == 'Y')
			strUrl = "editTempMyProduct.form";
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	
	// Enable, Disable, Accept and Reject requests
	function enableRecord(strUrl, index)
	{
		var frm = document.forms["frmMain"]; 
		document.getElementById("txtIndex").value = index;
		frm.target = "";
		if (strMstType == 'C' && strTemplateType == 'N' )
			strUrl = 'enableCollMyProduct.form';
		else if (strMstType == 'C' && strTemplateType == 'Y' )
			strUrl = 'enableCollTempMyProduct.form';
		else if (strMstType == 'F')
			strUrl = 'enableForeMyProduct.form';
		else if (strMstType == 'P' && strTemplateType == 'Y')
			strUrl = "enableTempMyProduct.form";
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
	}
	
	function disableRecord(strUrl, index)
	{
		var frm = document.forms["frmMain"]; 
		document.getElementById("txtIndex").value = index;
		frm.target = "";
		if (strMstType == 'C' && strTemplateType == 'N')
			strUrl = 'disableCollMyProduct.form';
		else if (strMstType == 'C' && strTemplateType == 'Y')
			strUrl = 'disableCollTempMyProduct.form';
		else if (strMstType == 'F')
			strUrl = 'disableForeMyProduct.form';
		else if (strMstType == 'P' && strTemplateType == 'Y')
			strUrl = "disableTempMyProduct.form";
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
	}
	
	function acceptRecord(strUrl, index)
	{
		var frm = document.forms["frmMain"]; 
		document.getElementById("txtIndex").value = index;
		frm.target = "";
		if (strMstType == 'C' && strTemplateType == 'N')
			strUrl = 'acceptCollMyProduct.form';
		else if (strMstType == 'C' && strTemplateType == 'Y')
			strUrl = 'acceptCollTempMyProduct.form';
		else if (strMstType == 'F')
			strUrl = 'acceptForeMyProduct.form';
		else if (strMstType == 'P' && strTemplateType == 'Y')
			strUrl = "acceptTempMyProduct.form";
		frm.action = strUrl;
		frm.method = 'POST';
		frm.submit();
	}
	
	
	function rejectRecord(arrData,strRemarks)
	{
		var frm = document.forms["frmMain"];		
		if (strRemarks.length > 255)
		{
			alert("Reject Remarks Length Cannot Be Greater than 255 Characters!");	
			return false;
		}
		else
		{
			frm.rejectRemarks.value = strRemarks;
			frm.txtIndex.value = arrData[0];
			frm.target = "";
			if (strMstType == 'C' && strTemplateType == 'N')
				frm.action = 'rejectCollMyProduct.form';
			else if (strMstType == 'C' && strTemplateType == 'Y')
				frm.action = 'rejectCollTempMyProduct.form';
			else if (strMstType == 'F')
				frm.action = 'rejectForeMyProduct.form';
			else if (strMstType == 'P' && strTemplateType == 'Y')
				frm.action = "rejectTempMyProduct.form";
			else
				frm.action = "rejectMyProduct.form";
			frm.method = "POST";
			frm.submit();
		}
	}
	function discardRecord(arrData)
	{
		var frm = document.forms["frmMain"];
		strUrl = arrData[0];
		if (strMstType == 'C' && strTemplateType == 'N')
			strUrl = 'undoCollMyProduct.form';
		else if (strMstType == 'C' && strTemplateType == 'Y')
			strUrl = 'undoCollTempMyProduct.form';
		else if (strMstType == 'F')
			strUrl = 'undoForeMyProduct.form';
		else if (strMstType == 'P' && strTemplateType == 'Y')
			strUrl = "undoTempMyProduct.form";
		frm.txtIndex.value = arrData[1];
		frm.action = strUrl;
		frm.method = "POST";
		frm.target = "";	
		frm.submit();
	}
	function filter(mode,type)
	{
		var strUrl = null; 
		var frm = document.forms["frmMain"];
		frm.target ="";
		if(strMstType == 'P' && strTemplateType == 'N' && (mode == "AUTH" || mode == "ACCEPT" ||
				mode == "REJECT"|| mode =="AUTH_FILTER"))
			strUrl = "myProductAuthFilterList.form";
		else if(strMstType == 'C' && strTemplateType == 'N' && (mode == "AUTH" || mode == "ACCEPT" ||
				mode == "REJECT"|| mode =="AUTH_FILTER"))
			strUrl = "collMyProductAuthFilterList.form";
		else if(strMstType == 'C' && strTemplateType == 'N' && (mode == "LIST" || mode == "LIST_FILTER"
			 || mode == "VIEW" || mode == "ENABLE" || mode == "DISABLE"))
			strUrl = "collMyProductFilterList.form";
		else if(strMstType == 'C' && strTemplateType == 'Y' && (mode == "AUTH" || mode == "ACCEPT" ||
				mode == "REJECT"|| mode =="AUTH_FILTER"))
			strUrl = "collTempMyProductAuthFilterList.form";
		else if(strMstType == 'C' && strTemplateType == 'Y' && (mode == "LIST" || mode == "LIST_FILTER"
			 || mode == "VIEW" || mode == "ENABLE" || mode == "DISABLE"))
			strUrl = "collTempMyProductFilterList.form";
		else if(strMstType == 'F' && (mode == "AUTH" || mode == "ACCEPT" ||
				mode == "REJECT"|| mode =="AUTH_FILTER"))
			strUrl = "foreMyProductAuthFilterList.form";
		else if(strMstType == 'F' && (mode == "LIST" || mode == "LIST_FILTER"
			 || mode == "VIEW" || mode == "ENABLE" || mode == "DISABLE"))
			strUrl = "foreMyProductFilterList.form";
		else if(strMstType == 'P' && strTemplateType == 'Y' && (mode == "AUTH" || mode == "ACCEPT" ||
				mode == "REJECT"|| mode =="AUTH_FILTER"))
			strUrl = "tempMyProductAuthFilterList.form";
		else if(strMstType == 'P' && strTemplateType == 'Y' && (mode == "LIST" || mode == "LIST_FILTER"
			 || mode == "VIEW" || mode == "ENABLE" || mode == "DISABLE"))
			strUrl = "tempMyProductFilterList.form";
		else
			strUrl ="myProductFilterList.form";
		
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
	}
	
	function update(strUrl)
	{
		var frm = document.forms["frmMain"];	
		frm.target ="";
		if (strMstType == 'C' && strTemplateType == 'N' && (mode == "ADD" || mode == "SAVE" || mode == "COLLPRD"))
			strUrl = 'saveCollMyProduct.form';
		else if (strMstType == 'C' && strTemplateType == 'N' && (mode == "EDIT" || mode == "UPDATE" || mode == "COLLPRDUPDATE") )
			strUrl = 'updateCollMyProduct.form';
		else if (strMstType == 'C' && strTemplateType == 'Y' && (mode == "ADD" || mode == "SAVE" || mode == "COLLPRD"))
			strUrl = 'saveCollTempMyProduct.form';
		else if (strMstType == 'C' && strTemplateType == 'Y' && (mode == "EDIT" || mode == "UPDATE" || mode == "COLLPRDUPDATE") )
			strUrl = 'updateCollTempMyProduct.form';
		else if (strMstType == 'F' && (mode == "ADD" ||  mode == "SAVE"))
			strUrl = 'saveForeMyProduct.form';
		else if (strMstType == 'F' && (mode == "EDIT" || mode == "UPDATE") )
			strUrl = 'updateForeMyProduct.form';
		else if (strMstType == 'P' && strTemplateType == 'Y' && (mode == "ADD" || mode == "SAVE" || mode == "PAYPRD"))
			strUrl = 'saveTempMyProduct.form';
		else if (strMstType == 'P' && strTemplateType == 'Y' && (mode == "EDIT" || mode == "UPDATE" || mode == "PAYPRDUPDATE") )
			strUrl = 'updateTempMyProduct.form';
		if($('#txtBillMyClientCode').length)
			$('#txtBillMyClientCode').removeAttr("disabled");
		frm.action = strUrl;	
		frm.method = "POST";
		frm.submit();
	}
	function checkKey()
	{
	   if(window.event.keyCode == 13)
	   {
	   		var totalpage = document.getElementById("total_pages").value;
	   		goPgNmbr(mode,totalpage);
	   }
	}	
	function validateOrderPartyFlag()
	{
		if (strMstType == 'P')
		{
			if(document.getElementById("mypOrderingParty1").checked )		
			{	
				
				document.getElementById("mypRestrictionOrderingPty1").disabled = false;
				document.getElementById("adhocOrderingFlag1").disabled = false;
			}
			else
			{
				document.getElementById("adhocOrderingFlag1").disabled =true;
				document.getElementById("adhocOrderingFlag1").checked =false;
				document.getElementById("adhocOrderingFlag2").checked =true;
				document.getElementById("mypRestrictionOrderingPty1").disabled =true;
				document.getElementById("mypRestrictionOrderingPty1").checked =false;
				
			}
		}
	}
	function validateAdhocOrdering()
	{
		if(document.getElementById("mypOrderingParty1").checked && document.getElementById("adhocOrderingFlag1").checked)		
		{
			document.getElementById("mypRestrictionOrderingPty1").disabled = true;
			document.getElementById("mypRestrictionOrderingPty1").checked = false;
		}
		if(document.getElementById("mypOrderingParty1").checked && document.getElementById("adhocOrderingFlag2").checked )
		{
			document.getElementById("mypRestrictionOrderingPty1").disabled = false;
		}
	}
	function validateRestrictionFlag(flag)
	{
		if (strMstType == 'P')
		{
			if(document.getElementById("mypRestriction1").checked == true)
			{			
				document.getElementById("mypAllowAdhocBene1").checked =false;
				document.getElementById("mypAllowAdhocBank1").checked =false;
				document.getElementById("adhocOrderingFlag1").checked =false;
				
				document.getElementById("mypAllowAdhocBene1").disabled =true;
				document.getElementById("mypAllowAdhocBank1").disabled =true;
				document.getElementById("adhocOrderingFlag1").disabled =true;
				
				document.getElementById("mypAllowAdhocBene2").checked =true;
				document.getElementById("mypAllowAdhocBank2").checked =true;
				document.getElementById("adhocOrderingFlag2").checked =true;
			}
			else
			{
				
				if(flag == 'Y' && document.getElementById("mypBankBeneFlag1").checked)
				{
											
					document.getElementById("mypAllowAdhocBene1").disabled =true;
					document.getElementById("mypAllowAdhocBank1").disabled =true;
					document.getElementById("mypAllowAdhocBene1").checked =false;
					document.getElementById("mypAllowAdhocBank1").checked =false;
					document.getElementById("mypAllowAdhocBene2").checked =true;
					document.getElementById("mypAllowAdhocBank2").checked =true;
	               
				}
				else
					{
					document.getElementById("mypAllowAdhocBene1").disabled =false;
					document.getElementById("mypAllowAdhocBank1").disabled =false;
					document.getElementById("mypAllowAdhocBene1").checked =true;
					document.getElementById("mypAllowAdhocBank1").checked =true;
					document.getElementById("mypAllowAdhocBene2").checked =false;
					document.getElementById("mypAllowAdhocBank2").checked =false;
					}
				
				
			}
		}
	}
	function validateQuickPay()
	{
			if  (document.getElementById("mypUseFor1").checked)
			{
				document.getElementById("mypPaymentProd1").checked = true;
				document.getElementById("mypDebitAccount1").checked = true;
				document.getElementById("mypActivationDate1").checked = true;
				document.getElementById("mypAuthLevel1").checked = true;
				document.getElementById("mypPaymentProd1").disabled =false;
				document.getElementById("mypPaymentProd2").disabled =true;
				document.getElementById("mypDebitAccount2").disabled =true;
				document.getElementById("mypDebitAccount1").disabled =false;
				document.getElementById("mypAuthLevel1").disabled =false;
				document.getElementById("mypActivationDate2").disabled =true;
				document.getElementById("mypActivationDate1").disabled =false;
				document.getElementById("mypAuthLevel2").disabled =true;
				document.getElementById("batchLimit").disabled =true;
				
				if(strMstType =='P')
				{
					
					document.getElementById("mypTransType1").checked = false;
					document.getElementById("mypTransType2").checked = true;
					document.getElementById("mypTransType1").disabled =true;
					document.getElementById("authByMaxAmount1").checked = false;
					document.getElementById("authByMaxAmount1").disabled = true;
					document.getElementById("splitFileFlag1").checked = false;
					document.getElementById("splitFileFlag1").disabled = true;
				}
			}
			else
			{
				document.getElementById("mypPaymentProd1").disabled =false;
				document.getElementById("mypDebitAccount1").disabled =false;
				document.getElementById("mypActivationDate1").disabled =false;
				document.getElementById("mypAuthLevel1").disabled =false;
				document.getElementById("mypPaymentProd2").disabled =false;
				document.getElementById("mypDebitAccount2").disabled =false;
				document.getElementById("mypActivationDate2").disabled =false;
				document.getElementById("mypAuthLevel2").disabled =false;
				document.getElementById("batchLimit").disabled =false;
				
				if(strMstType =='P')
				{
					document.getElementById("mypTransType1").disabled =false;
				}
			}
			if(strMstType =='C')
			{
				document.getElementById("mypUseFor1").disabled = true;
				document.getElementById("mypUseFor2").checked = true;
			}
	}
	function validateTranType()
	{
		if  (document.getElementById("mypTransType1").checked)
		{
			document.getElementById("mypAuthLevel2").checked = true;
			document.getElementById("mypAuthLevel1").disabled = true;
			document.getElementById("mypPaymentProd2").checked = true;
			document.getElementById("mypPaymentProd1").disabled = true;
			document.getElementById("mypDebitAccount2").disabled =false;
			document.getElementById("mypDebitAccount2").checked =true;
			document.getElementById("mypDebitAccount1").disabled =true;
			document.getElementById("mypActivationDate2").checked =true;
			document.getElementById("mypActivationDate1").disabled =true;
			document.getElementById("mypDebitAccnoValue").disabled = false;
			if (strMstType == 'P')
			{
				document.getElementById("authByMaxAmount1").disabled = false;
				document.getElementById("splitFileFlag1").disabled = false;
			}
		}
		else
		{
			document.getElementById("mypAuthLevel1").disabled = false;
			document.getElementById("mypAuthLevel2").disabled = false;
			document.getElementById("mypPaymentProd1").disabled = false;
			document.getElementById("mypDebitAccount1").disabled = false;
			document.getElementById("mypActivationDate1").disabled = false;
			
			if  (document.getElementById("mypUseFor1").checked)
			{
				document.getElementById("mypAuthLevel1").disabled = false;
				document.getElementById("mypAuthLevel2").disabled = false;
				document.getElementById("mypAuthLevel1").checked = true;
				document.getElementById("mypAuthLevel2").disabled = true;
			}
			
			/*if  (document.getElementById("mypPrdOrAcc").value == "1" && document.getElementById("mypAuthLevel2").checked)
			{
				document.getElementById("mypDebitAccount1").disabled = true;
				document.getElementById("mypDebitAccount2").disabled = false;
				document.getElementById("mypDebitAccount2").checked = true;
				document.getElementById("mypDebitAccnoValue").disabled = false;
			}*/
		}
	}
	function validateDebitAccnt()
	{
		
		
		if(document.getElementById("mypPrdOrAcc").value == "4")
		{
			var instrDiv = $('#ncheker');
			instrDiv.show();
			
		}
		else
		{
			var instrDiv = $('#ncheker');
			instrDiv.hide();
		}
			if (document.getElementById("mypAuthLevel2").checked)
			{
				document.getElementById("mypDebitAccount1").disabled = true;
				document.getElementById("mypDebitAccount2").disabled = false;
				document.getElementById("mypDebitAccount2").checked = true;
				document.getElementById("mypDebitAccnoValue").disabled = false;
			}
			else if (document.getElementById("mypAuthLevel1").checked)
			{
				document.getElementById("mypDebitAccount1").disabled = false;
				document.getElementById("mypDebitAccount1").checked = true;
				document.getElementById("mypDebitAccount2").disabled = true;
				document.getElementById("mypDebitAccnoValue").disabled = false;
			}
		
		
		if(document.getElementById("mypPrdOrAcc").value == "1")
		{
			if (document.getElementById("mypAuthLevel2").checked)
			{
				document.getElementById("mypDebitAccount1").disabled = true;
				document.getElementById("mypDebitAccount2").disabled = false;
				document.getElementById("mypDebitAccount2").checked = true;
				document.getElementById("mypDebitAccnoValue").disabled = false;
			}
			else if (document.getElementById("mypAuthLevel1").checked)
			{
				document.getElementById("mypDebitAccount1").disabled = false;
				document.getElementById("mypDebitAccount1").checked = true;
				document.getElementById("mypDebitAccount2").disabled = true;
				document.getElementById("mypDebitAccnoValue").disabled = false;
			}
		}
		else
		{
			document.getElementById("mypDebitAccount1").disabled = false;
			document.getElementById("mypDebitAccount2").disabled = false;
		}
	
		if (strMstType == 'P')
		{
			if (document.getElementById("mypAuthLevel1").checked )
			{
				document.getElementById("authByMaxAmount1").checked = false;
				document.getElementById("authByMaxAmount1").disabled = true;
				document.getElementById("splitFileFlag1").checked = false;
				document.getElementById("splitFileFlag1").disabled = true;
			}
			else
			{
				document.getElementById("authByMaxAmount1").disabled = false;
				document.getElementById("splitFileFlag1").disabled = false;
			}
		}
	}
	function validateEnrichments()
	{
			if (!document.getElementById("mypReference1Mandatory1").checked)
			{
				document.getElementById("mypReference1Label").disabled = true;
				document.getElementById("mypReference1Label").value="";
			}
			else
				document.getElementById("mypReference1Label").disabled = false;
			
			if (!document.getElementById("mypReference2Mandatory1").checked)
			{
				document.getElementById("mypReference2Label").disabled = true;
				document.getElementById("mypReference2Label").value="";
			}
			else
				document.getElementById("mypReference2Label").disabled = false;
			
			if (!document.getElementById("mypReference3Mandatory1").checked)
			{
				document.getElementById("mypReference3Label").disabled = true;
				document.getElementById("mypReference3Label").value="";
			}
			else
				document.getElementById("mypReference3Label").disabled = false;
			
			if (!document.getElementById("mypReference4Mandatory1").checked)
			{
				document.getElementById("mypReference4Label").disabled = true;
				document.getElementById("mypReference4Label").value="";
			}
			else
				document.getElementById("mypReference4Label").disabled = false;
			
			if (!document.getElementById("mypReference5Mandatory1").checked)
			{
				document.getElementById("mypReference5Label").disabled = true;
				document.getElementById("mypReference5Label").value="";
			}
			else
				document.getElementById("mypReference5Label").disabled = false;
			if(strMstType =='C')
			{	
				if (!document.getElementById("mypBatchEnrich1Mandatory1").checked)
				{
					document.getElementById("mypBatchEnrich1Label").disabled = true;
					document.getElementById("mypBatchEnrich1Label").value="";
				}
				else
					document.getElementById("mypBatchEnrich1Label").disabled = false;
				
				if (!document.getElementById("mypBatchEnrich2Mandatory1").checked)
				{
					document.getElementById("mypBatchEnrich2Label").disabled = true;
					document.getElementById("mypBatchEnrich2Label").value="";
				}
				else
					document.getElementById("mypBatchEnrich2Label").disabled = false;
				
				if (!document.getElementById("mypBatchEnrich3Mandatory1").checked)
				{
					document.getElementById("mypBatchEnrich3Label").disabled = true;
					document.getElementById("mypBatchEnrich3Label").value="";
				}
				else
					document.getElementById("mypBatchEnrich3Label").disabled = false;
				
				if (!document.getElementById("mypBatchEnrich4Mandatory1").checked)
				{
					document.getElementById("mypBatchEnrich4Label").disabled = true;
					document.getElementById("mypBatchEnrich4Label").value="";
				}
				else
					document.getElementById("mypBatchEnrich4Label").disabled = false;
				
				if (!document.getElementById("mypBatchEnrich5Mandatory1").checked)
				{
					document.getElementById("mypBatchEnrich5Label").disabled = true;
					document.getElementById("mypBatchEnrich5Label").value="";
				}
				else
					document.getElementById("mypBatchEnrich5Label").disabled = false;
			}
	}
	function validateTxnEdit()
	{
		if (document.getElementById("closeRequired1").checked)
		{
			document.getElementById("mypAllowTxnEdit1").disabled = false;
		}
		else
		{
			document.getElementById("mypAllowTxnEdit1").disabled = true;
			document.getElementById("mypAllowTxnEdit1").checked = false;
		}	
	}
	function getPayPrdList(strUrl,mode)
	{
		if (strTemplateType == 'Y')
		{
			return;
		}
		var frm = document.forms["frmMain"];	
		frm.target ="";
		frm.action = strUrl;	
		frm.method = "POST";
		frm.submit();
	}
	
	function toggleBeneDetails(beneflag)
	{
		if (strMstType == "P")
		{
			if (beneflag == 'Y')
			{
				//fixed bene val
				if (document.getElementById("mypDefaultBeneficiary") != null)
					document.getElementById("mypDefaultBeneficiary").disabled = false;
				//document.getElementById("mypDefaultBeneficiary").value="NONE";
				//adhoc bene radio
				document.getElementById("mypAllowAdhocBene1").disabled = true;
				document.getElementById("mypAllowAdhocBene2").checked = true;
				//adhoc bene bank radio
				document.getElementById("mypAllowAdhocBank1").disabled = true;
				document.getElementById("mypAllowAdhocBank2").checked = true;
				//adhoc ordering party
				//document.getElementById("adhocOrderingFlag1").disabled = true;
				document.getElementById("adhocOrderingFlag2").checked = true;
				//txn type flag
			//	document.getElementById("mypTransType2").checked = true;
				//document.getElementById("mypTransType1").disabled = true;
				//payment product drop down disbale
				document.getElementById("mypPaymentDefValue").disabled = true;
				document.getElementById("mypPaymentDefValue").value="NONE"
			}
			else if (beneflag== 'N')
			{
				//fixed bene val	
				if (document.getElementById("mypDefaultBeneficiary") != null)
				{
					document.getElementById("mypDefaultBeneficiary").disabled = true;
					document.getElementById("mypDefaultBeneficiary").value="";
				}
				//adhoc bene radio
				if (document.getElementById("mypAllowAdhocBene1") != null)
					document.getElementById("mypAllowAdhocBene1").disabled = false;
				//adhoc bene bank radio
				if (document.getElementById("mypAllowAdhocBank1") != null)
					document.getElementById("mypAllowAdhocBank1").disabled = false;
				//adhoc ordering party
				if (document.getElementById("adhocOrderingFlag1") != null && 
						document.getElementById("mypOrderingParty1")!=null &&
						document.getElementById("mypOrderingParty1").checked)
					document.getElementById("adhocOrderingFlag1").disabled = false;
				//txn type flag
			/*	if (document.getElementById("mypTransType1") != null)
					document.getElementById("mypTransType1").disabled = false;*/
				//payment product drop down disbale
				if (document.getElementById("mypPaymentDefValue") != null)
					document.getElementById("mypPaymentDefValue").disabled = false;
				if (document.getElementById("mypUseFor2") != null)
					document.getElementById("mypUseFor2").disabled = false;
			}
		}
	}
	function chkMyPrdUsageFlg(fixedbene)
	{
		if (fixedbene.value != "")
		{
			document.getElementById("mypUseFor1").checked = true;
			document.getElementById("mypAuthLevel2").disabled = true;
		}
		else
		{
			document.getElementById("mypUseFor2").disabled = false;
		}
	}
	
	function validateForecastType()
	{
			if (!document.getElementById("mypBankedRequired1").checked)
			{
				document.getElementById("mypBankedPerExpectation").disabled = true;
				document.getElementById("mypBankedPerExpectation").value="0.00";
				document.getElementById("mypBankedEditable1").disabled = true;
			}
			else
			{
				document.getElementById("mypBankedPerExpectation").disabled = false;
				document.getElementById("mypBankedEditable1").disabled = false;
			}
			
			if (!document.getElementById("mypMandatedRequired1").checked)
			{
				document.getElementById("mypMandatedPerExpectation").disabled = true;
				document.getElementById("mypMandatedPerExpectation").value="0.00";
				document.getElementById("mypMandatedEditable1").disabled = true;
			}
			else
			{
				document.getElementById("mypMandatedPerExpectation").disabled = false;
				document.getElementById("mypMandatedEditable1").disabled = false;
			}
			
			if (!document.getElementById("mypInvoicedRequired1").checked)
			{
				document.getElementById("mypInvoicedPerExpectation").disabled = true;
				document.getElementById("mypInvoicedPerExpectation").value="0.00";
				document.getElementById("mypinvoicedEditable1").disabled = true;
			}
			else
			{
				document.getElementById("mypInvoicedPerExpectation").disabled = false;
				document.getElementById("mypinvoicedEditable1").disabled = false;
			}
			
			if (!document.getElementById("mypPoRequired1").checked)
			{
				document.getElementById("mypPoPerExpectation").disabled = true;
				document.getElementById("mypPoPerExpectation").value="0.00";
				document.getElementById("mypPoEditable1").disabled = true;
			}
			else
			{
				document.getElementById("mypPoPerExpectation").disabled = false;
				document.getElementById("mypPoEditable1").disabled = false;
			}
			
			if (!document.getElementById("mypContractedRequired1").checked)
			{
				document.getElementById("mypContractedPerExpectation").disabled = true;
				document.getElementById("mypContractedPerExpectation").value="0.00";
				document.getElementById("mypContractedEditable1").disabled = true;
			}
			else
			{
				document.getElementById("mypContractedPerExpectation").disabled = false;
				document.getElementById("mypContractedEditable1").disabled = false;
			}
			
			if (!document.getElementById("mypExpectedRequired1").checked)
			{
				document.getElementById("mypExpectedPerExpectation").disabled = true;
				document.getElementById("mypExpectedPerExpectation").value="0.00";
				document.getElementById("mypExpectedEditable1").disabled = true;
			}
			else
			{
				document.getElementById("mypExpectedPerExpectation").disabled = false;
				document.getElementById("mypExpectedEditable1").disabled = false;
			}
			
			if (!document.getElementById("mypPlanedRequired1").checked)
			{
				document.getElementById("mypPlanedPerExpectation").disabled = true;
				document.getElementById("mypPlanedPerExpectation").value="0.00";
				document.getElementById("mypPlanedEditable1").disabled = true;
			}
			else
			{
				document.getElementById("mypPlanedPerExpectation").disabled = false;
				document.getElementById("mypPlanedEditable1").disabled = false;
			}
			
			if (!document.getElementById("mypAllowAutoClose1").checked)
			{
				document.getElementById("mypafterDays").disabled = true;
				document.getElementById("mypafterDays").value="";
			}
			else
			{
				document.getElementById("mypafterDays").disabled = false;
			}
	}
	
	function validateAdhocBank()
	{
		if (document.getElementById("mypAllowAdhocBene2").checked)
		{
			//document.getElementById("mypAllowAdhocBene1").disabled = true;
			document.getElementById("mypAllowAdhocBank1").disabled = true;
			document.getElementById("mypAllowAdhocBank1").checked = false;
			document.getElementById("mypAllowAdhocBank2").checked = true;
		}
		else
		{
			document.getElementById("mypAllowAdhocBank1").disabled = false;
		//	document.getElementById("mypRestriction1").disabled = true;	
			//document.getElementById("mypAllowAdhocBene1").disabled = 
		}
		
	}
	
	function onlyNumbers(evt,obj)
	{
		 var validList = "0123456789.";
		 var CHAR_AFTER_DP=2;
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if ((charCode > 31 && (charCode < 48 || charCode > 57)) && !(charCode == 46))
			return false;
		/*if (charCode == 46)
			return false;*/
		keyChar = String.fromCharCode(charCode);
		if (validList.indexOf(keyChar) != -1)
	    {
	      // check for existing decimal point
	      var dp = 0;
	      if( (dp = obj.value.indexOf( ".")) > -1)
	      {
	        if( keyChar == ".")
	          return false;
	        else
	        {
	          // room for more after decimal point?
	          if( obj.value.length - dp <= CHAR_AFTER_DP)
	            return true;
	          else 
	        	  return false;
	        }
	    
	
	      }
	    }
		return true;
	
	}
	
	
	/*function onlyNumbers(evt,obj,id)
	{
		 var validList = "0123456789.";
		 var CHAR_AFTER_DP=2;
		 //alert('ID'+id);
		 var value1=document.getElementById("batchLimit").value;
		 //alert("length"+value1.length);
		
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if ((charCode > 31 && (charCode < 48 || charCode > 57)) && !(charCode == 46))
			return false;
		if (charCode == 46)
			return false;
		keyChar = String.fromCharCode(charCode);
		if (validList.indexOf(keyChar) != -1)
	    {
	      // check for existing decimal point
	      var dp = 0;
	      if(id == 5)
	  	{
	  		 //alert(document.getElementById("mypBnkProduct").value);
	  		 if(document.getElementById("mypBnkProduct").value == 'ADV')
	  			 {
	  			 
	  			 	
	  			 
	  			    if(value1.length ==11)
	  			    	return false;
	  			    else
	  			    	if(value1.length > 8 && keyChar == ".")
	  			    		return false;
	  			 }
	  		 else
	  			 {
	  			 	if(value1.length ==13)
				    	return false;
	  			  else
				    	if(value1.length > 10 && keyChar == ".")
				    		return false;
	  			 }
	  	
	  		 alert(obj.value.indexOf( "."));
	      if( (dp = obj.value.indexOf( ".")) > -1)
	      {
	        if( keyChar == ".")
	          return false;
	        else
	        {
	          // room for more after decimal point?
	          if( obj.value.length - dp <= CHAR_AFTER_DP)
	            return true;
	          else 
	        	  return false;
	        }
	    
	
	      }
	  	}
	    else
	      {
		   	  if( (dp = obj.value.indexOf( ".")) > -1)
		        {
		           if( keyChar == ".")
		              return false;
		        }
	      }
	      
	    }
		return true;
	
	}*/
	
	function PopulatePirData()  
	{
		var i,cntr;
		var isNew = true;
		if (document.getElementById("mypPirNarrationFrom").selectedIndex !=-1)
		{
			var AddLength = document.getElementById("mypPirNarrationFrom").length;		
			var selectedValue ;				
			
			for (i=0; i<=AddLength-1; i++)
			{			
				if (document.getElementById("mypPirNarrationFrom").options[i].selected)
				{					
					selectedValue = document.getElementById("mypPirNarrationFrom").options[i].value;
					document.getElementById("mypPirNarration").value = 
					document.getElementById("mypPirNarration").value+"$"+ selectedValue+"$";
				}
			}
			document.getElementById("mypPirNarrationFrom").selectedIndex=-1;
		}
	}
	
	function PopulateInstData()  
	{
		var i,cntr;
		var isNew = true;
		if (document.getElementById("mypInstNarrationFrom").selectedIndex !=-1)
		{
			var AddLength = document.getElementById("mypInstNarrationFrom").length;		
			var selectedValue ;				
			
			for (i=0; i<=AddLength-1; i++)
			{			
				if (document.getElementById("mypInstNarrationFrom").options[i].selected)
				{					
					selectedValue = document.getElementById("mypInstNarrationFrom").options[i].value;
					document.getElementById("mypInstNarration").value = 
					document.getElementById("mypInstNarration").value+"$"+ selectedValue+"$";
				}
			}
			document.getElementById("mypInstNarrationFrom").selectedIndex=-1;
		}
	}
	function LTrim( value ) {
		
		var re = /\s*((\S+\s*)*)/;
		return value.replace(re, "$1");
		
	}
	
	function RTrim( value ) {
		
		var re = /((\s*\S+)*)\s*/;
		return value.replace(re, "$1");
		
	}
	
	function trim( value ) {
		
		return LTrim(RTrim(value));
		
	}
	function enableCheckbox(me, chkelmentId)
	{
		var elementVal	=	trim(me.value);
		if (elementVal.length > 0)
		{
			chkelmentId.value="Y";
			chkelmentId.disabled=false;
		}
		else
		{
			chkelmentId.value="N";	
			chkelmentId.disabled=true;
		}	
	}
	function disableaccount()
	{
		if (strTemplateType == "Y" )
		{
			document.getElementById("mypPaymentDefValue").disabled = true;
			document.getElementById("mypPaymentDefValue").value="NONE";
			document.getElementById("mypDebitAccnoValue").disabled = true;
			document.getElementById("mypDebitAccnoValue").value="NONE";
		}
	}
	
	function toggleReadOnly(ctrl, elementId)
	{
		var frm = document.forms["frmMain"]; 
	
		if (ctrl.checked)
		{
			frm[elementId].value = "99999999999.99";
			frm[elementId].readOnly = true;
			frm[elementId].className = "amountBox rounded greyback";
		}
		else
		{
			frm[elementId].readOnly = false;
			frm[elementId].className = "amountBox rounded";
		}
	}

function enableCheckbox(me, chkelmentId)
{
	var elementVal	=	trim(me.value);
	if (elementVal.length > 0)
	{
		chkelmentId.value="Y";
		chkelmentId.disabled=false;
	}
	else
	{
		chkelmentId.value="N";	
		chkelmentId.disabled=true;
	}	
}
function disableaccount()
{
	if (strTemplateType == "Y" )
	{
		document.getElementById("mypPaymentDefValue").disabled = true;
		document.getElementById("mypPaymentDefValue").value="NONE";
		document.getElementById("mypDebitAccnoValue").disabled = true;
		document.getElementById("mypDebitAccnoValue").value="NONE";
	}
}

function toggleReadOnly(ctrl, elementId)
{
	var frm = document.forms["frmMain"]; 

	if (ctrl.checked)
	{
		frm[elementId].value = "99999999999.99";
		frm[elementId].readOnly = true;
		frm[elementId].className = "amountBox rounded greyback";
	}
	else
	{
		frm[elementId].readOnly = false;
		frm[elementId].className = "amountBox rounded";
	}
}


function accountTransferSettings(mstType, mode, bankBeneFlag, accountTransferProd)
{
	if(accountTransferProd == 'true' ||  $('#mypLayout1X1').is(':checked') || $('#mypLayoutX11').is(':checked') || $('#mypLayout111').is(':checked'))
	{
		if($('#mypLayout1X1').is(':checked') || $('#mypLayoutX11').is(':checked'))
		{
			$('#mypUseFor2').attr('checked',true);
			$('#mypUseFor1').attr('disabled',true);
		}
		else
		{
			$('#mypUseFor1').removeAttr('disabled');
		}
		$('#mypAllowAdhocBene1').attr('checked',true);
		$('#mypAllowAdhocBene1').attr('disabled',true);
		$('#mypAllowAdhocBene2').attr('disabled',true);
		$('#mypAllowAdhocBank2').attr('checked',true);
		$('#mypAllowAdhocBank1').attr('disabled',true);
		$('#mypApprUpload1').attr('checked',false);
		$('#mypApprUpload1').attr('disabled',true);
		$('#autoVerifyUpload1').attr('checked',false);
		$('#autoVerifyUpload1').attr('disabled',true);
		$('#mypSendUpload1').attr('checked',false);
		$('#mypSendUpload1').attr('disabled',true);
		$('#mypAllowTxnEdit1').attr('checked',false);
		$('#mypAllowTxnEdit1').attr('disabled',true);
		$('#fileRejRepPrceFlag').attr('disabled',true);
		$('#mypDebitAccount2').attr('checked',true);
		$('#mypDebitAccount1').attr('disabled',true);
		$('#mypPaymentProd2').attr('checked',true);
		$('#mypPaymentProd1').attr('disabled',true);
		$('#mypActivationDate2').attr('checked',true);
		$('#mypActivationDate1').attr('disabled',true);
		$('#mypFxRate2').attr('checked',true);
		$('#mypFxRate2').attr('disabled',true);
		$('#mypFxRate1').attr('disabled',true);
		$('#mypIsLoan1').attr('disabled',true);
		$('#mypIsLoan1').attr('checked',false);
		$('#mypIsInvestment1').attr('disabled',true);
		$('#mypIsInvestment1').attr('checked',false);
		$('#mypIsInvoice1').attr('disabled',true);
		$('#mypIsInvoice1').attr('checked',false);
		$('#mypAuthLevel1').attr('disabled',true);
		$('#mypAuthLevel2').attr('checked',true);
		$('#mypRestriction1').attr('checked',false);
		$('#mypRestriction1').attr('disabled',true);
						
	}
	else
	{
	    if(mstType == "P")
			checkApprovalReq();
		if(document.getElementById("mypPaymentProd2").checked && document.getElementById("mypDebitAccount2").checked)
		{
			document.getElementById("mypFxRate2").disabled = false;
		}else{
			document.getElementById("mypFxRate2").disabled = true;
		}
		
	    if(mstType == "P")
	    {
	    	checkApprovalReq();
	    }
		if(mstType == 'P' && bankBeneFlag == 'Y'){
			if(mode == 'ADD' || mode == 'PAYPRD'){			
				$('#mypBankBeneFlag1').attr('checked',true);
				$('#mypAllowAdhocBene1').attr('disabled',true);
				if ($("#mypDefaultBeneficiary"))
					$('#mypDefaultBeneficiary').removeAttr('disabled');
			}
		}else{
			//alert("flag"+"${BANKBENEFLAG}");
			toggleBeneDetails(bankBeneFlag);
		}
		$('#mypAllowAdhocBene2').removeAttr('disabled');
		$('#mypAllowAdhocBene1').removeAttr('disabled');
		$('#mypApprUpload1').removeAttr('disabled');
		$('#autoVerifyUpload1').removeAttr('disabled');
		$('#mypSendUpload1').removeAttr('disabled');
		$('#mypAllowTxnEdit1').removeAttr('disabled');
		$('#fileRejRepPrceFlag').removeAttr('disabled');
		$('#mypPaymentProd1').removeAttr('disabled');
		$('#mypDebitAccount1').removeAttr('disabled');
		$('#mypActivationDate1').removeAttr('disabled');
		$('#mypFxRate1').removeAttr('disabled');
		$('#mypFxRate2').removeAttr('disabled');
		$('#mypIsLoan1').removeAttr('disabled');
		$('#mypIsInvestment1').removeAttr('disabled');
		$('#mypIsInvoice1').removeAttr('disabled');
		$('#mypAuthLevel1').removeAttr('disabled');
		$('#mypRestriction1').removeAttr('disabled');
	}
	
	
}
jQuery.fn.ForceAlphaNumericAndPercentOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e) 
						{
							// allows only alphabets & numbers, backspace, tab
							var keycode = e.which || e.keyCode;						
							if ((keycode >= 48 && keycode <= 57) || (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122)
									|| keycode == 8 || keycode == 9 || keycode == 37)
								return true;

							return false;
						})
			})
};

function displayAlert(strMesg, callbackFunctionArgs, callbackFunction) {
	var popupElem = $('#confirmMsgPopup');
	var textContentElem = popupElem.find('#textContent');
	var cancelButtonElem = popupElem.find('#cancelConfirmMsg');
	var okButtonElem = popupElem.find('#okConfirmMsgbutton')
	if(strMesg && strMesg !== '') {
		popupElem.dialog({
			autoOpen : false,
			maxHeight: 550,
			minHeight:'auto',
			width : 400,
			modal : true,
			resizable: false,
			draggable: false
		});
		textContentElem.text(strMesg);
		popupElem.dialog("open");
		cancelButtonElem.on('click', function() {
			popupElem.dialog("close");
		});
		okButtonElem.on('click', function() {
			popupElem.dialog("close");
			callbackFunction.call(null, callbackFunctionArgs);
		});
		textContentElem.focus();
	}
}