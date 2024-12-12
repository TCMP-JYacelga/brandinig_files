/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var RoleDetails = {
		elem: {
			rolesapp: '#ft-layout-container',
			main: '#main',
			footer: '#footer'
		},

		render: function (e, data) {
			
			var loadOptions,role,corp,sub;
			if(mode == "edit"){
				role = workingData.roleId;
				corp = workingData.corporationId;
				sub = "";
			}else{
				var strRegex =  /[?&]([^=#]+)=([^&#]*)/g,objParam = {},arrMatches = [];
				while (arrMatches = strRegex.exec(window.location.hash)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
					
				if(role_id || corp_id){
					role = role_id;
					corp = corp_id;
					sub = "";
					mode = "edit";
					roleCommand = [];
				}else{
					
					if(undefined != workingData && workingData.length != 0){
						if(workingData.copyFromFlag){
							role = (null === workingData.srcRoleId ) ? "" : workingData.srcRoleId, 
							corp = (null === workingData.srcComapany ) ? "" : workingData.srcComapany
							sub = "";
						}else{
							role = (null === workingData.roleId ) ? "" : workingData.roleId,
							corp = (null === workingData.corporationId ) ? "" : workingData.corporationId
							sub = "";							
						}
					}else{
						role = "", 
						corp = "",
						sub = "";
					}
					mode = "new";
				}
			}
			loadOptions =  {
	                type: 'POST', 
	                dataType: 'JSON',
	                cache : false,
	                data: {
	                	"roleId" : role,
	                	"subsidiaries" : sub,
	                	"corpId" : corp
	                }
            };
			workingData.mode = mode;
			console.log(" rendering RoleDetails ");
			data = workingData; 
			
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2> </div>',
			css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});	
			
			if(workingData.copyFromFlag){
				this.render('static/RolesApp/templates/RoleDetails.hbs',workingData).then(function () {
					RoleDetails.elem.rolesapp.html(this.content);
		        	$.unblockUI();
		        	$("html,body").scrollTop(0);
					var el = $("#subsidiaries").multiselect({
						checkAllText: getLabel('checkAll','Check All'),
						uncheckAllText :getLabel('uncheckAll','Uncheck All'),
						noneSelectedText: getLabel('lblSelectOption','Select options'),
					    selectedText:  getLabel('lblSelected','# selected'),
						_setButtonValue: function(value){
							if(undefined != value)
							{
								var defaultValue = value.substring(3, 0);
								if(defaultValue == 'All')
								{
									defaultValue = getLabel('lblAll','All');
									value =value.replace('All',defaultValue);
								}
							}
						this.buttonlabel.text(value);
						},
						close: function(){
							var selectedSub = $('#subsidiaries').val();
							loadOptions.data.subsidiaries = selectedSub;
							loadOptions.data.corpId = workingData.corporationId;
							//RolesApp.trigger('RenderRole',loadOptions);	
						},
						checkAll: function(){
							var allSub = $("#subsidiaries").val();
							RolesApp.trigger('AddAllSubsidiary', allSub);
						},
						uncheckAll: function(){
							var allSub = $.map($('#subsidiaries option'), function(e) { return e.value; });
							RolesApp.trigger('RemoveAllSubsidiary', allSub);
						}
					}); 
					el.multiselect('refresh');
					
					//DHTTPRODMT-2527
					if( workingData && workingData.subsidiaries && workingData.subsidiaries.length == 1)
					{
						 $("#subsidiaries").multiselect("widget")
						 .find(":checkbox[value='"+workingData.subsidiaries[0].subsidiaryId+"']").attr("checked","checked");
						 
						 $("#subsidiaries option[value='" + workingData.subsidiaries[0].subsidiaryId + "']")
						 .attr("selected", "selected");
						  
						 var allSub = $("#subsidiaries").val();
						 RolesApp.trigger('AddAllSubsidiary', allSub);
						
						 $("#subsidiaries option[value='" + workingData.subsidiaries[0].subsidiaryId + "']")
						 .attr("disabled", "disabled");
						 $("#subsidiaries").multiselect('refresh');
					}
					if(!(workingData.recordKeyNo)){
						var cmdVersion = commandVersion + 1 ;
		    			commandVersion += 1 ;
		    			RolesApp.trigger('CopyRoleDetail', {
	    					commandName: "CopyRoleDetail",
	    					path: '/rolesApi/roleDetails/CopyRole',
	    					kv: {
	    						roleId: workingData.roleId,
	    						roleDesc: workingData.roleDesc,
	    						company : workingData.corporationId,
	    						srcRoleId : workingData.srcRoleId,
	    						srcRoleDesc : workingData.srcRoleDesc, 
	    						srcComapany : workingData.srcComapany,
	    						commandVersion : cmdVersion
	    					}
    				});
					}
					$("#corporation").CorporationAutoComplete();
					$("#corporation").val(workingData.corporationDesc);
					$('#roleDesc').text(workingData.roleDesc);
					$('#roleId').val(workingData.roleId);
					$("#copyFromRole").CopyFromAutoComplete();
					$("#copyFromRole").val(workingData.srcRoleDesc);
					
					if($('div#PageTitle').length > 1){
						$('.ft-layout-header').empty();							
					}
					$('div#PageTitle').prependTo('.ft-layout-header');
					$('span.ft-title').prependTo('#PageTitle');
					$('.ft-layout-header').removeAttr( 'style' );
					$('.fa-refresh').hide();
					$('.t-update-text').hide();
					RolesApp.trigger('footerLinkRef');
					RolesApp.trigger('roleDetailInit');
				});
			}else{
				this.load("services/rolesLookUpApi/roleDetails",loadOptions).then(
				function(data){
					workingData = data;
					workingData.mode = mode;
					workingData.copyFromFlag = false;
					commandVersion =  data.commandVersion ? (isNaN(data.commandVersion) ? data.commandVersion  :  parseInt(data.commandVersion) ): 0
					RoleDetails.elem.rolesapp = $(RoleDetails.elem.rolesapp);				
					
					//TODO - Below Temporary code need to remove 
					 for(var i = 0; i < workingData.services.length; i++){
		        	        if(workingData.services[i].serviceId == "09") {
		        	        	workingData.services.splice(i,1);
		        	            i--; // Prevent skipping an item
		        	        }
		        	  }
					
					if(null != workingData.roleId){
						 
						//Merging of Working JSON and undo buffer data 
						$.ajax({
					        url: "services/rolesCommandApi/loadChangeSet/",
					        type: "POST",
					        data: {
					        	"roleId" : workingData.roleId,
					        	"assetId" : "00" ,
					        	"corpId" : workingData.corporationId
					        },
					        async : false,
					       // contentType: "application/json; charset=utf-8",
					        dataType: "json",
					        success: function (data) {
					        	$.each(data, function(index, item) {
					        		CommonObj.updateWorkingData(item);
					        	});
					        },
					        error: function () {
					            $('#errorDiv').removeClass('hidden');
					        	$('#errorPara').text("An error has occured!!!");
					        	$.unblockUI();
					        	if(event)
						            event.preventDefault();
					        }
					    });						
					}
					workingData.services.sort(function(a, b) {
						var nameA="";
						var nameB="";
		        		  if(a.serviceName != "undefined")
						  {
							nameA = a.serviceName;
						  }
						  if(b.serviceName != "undefined")
						  {
							nameB = b.serviceName;
						  }						
		        		  if (nameA < nameB) {
		        		    return -1;
		        		  }
		        		  if (nameA > nameB) {
		        		    return 1;
		        		  }

		        		  // names must be equal
		        		  return 0;
		        		});
					this.render('static/RolesApp/templates/RoleDetails.hbs',workingData).then(function () {
						RoleDetails.elem.rolesapp.html(this.content);
			        	$.unblockUI();
			        	$("html,body").scrollTop(0);
			        	
			        	if(typeof(defaultHight) != "undefined"){
							$('.grid').css('max-height',defaultHight); 
							$('.gridGran').css('max-height',defaultHight);
						}			        	
						if(null ==  workingData.recordKeyNo){
							//default admin service to be selected
							if(workingData.services != undefined){
				        	 $.each(workingData.services,function(index,item){
				        		if(item.serviceId == "03" && item.assignedFlag && null == workingData.recordKeyNo ){
				        			var cmdVersion = commandVersion + 1 ;
				        			commandVersion += 1 ;
									RolesApp.trigger('AddServices', {
										commandName: "AddServices",
										path: '/rolesApi/roleDetails/Services',
										kv: {						
											serviceId : "03",
											assignedFlag : true,
											serviceName : $('#lblImgSrvc_03').val().trim(),
											digest :  item.digest,
											commandVersion : cmdVersion
										}
									});
									return false;
				        		} 
				        	 });
							}
						}else{
							$('#roleId').attr('disabled','disabled');
							$('#corporation').removeClass('ui-suggestion-box');
							$('#corporation').attr('disabled','disabled');
						}
						
						var el = $("#subsidiaries").multiselect({
							checkAllText: getLabel('checkAll','Check All'),
							uncheckAllText :getLabel('uncheckAll','Uncheck All'),
							noneSelectedText: getLabel('lblSelectOption','Select options'),
						    selectedText:  getLabel('lblSelected','# selected'),
							_setButtonValue: function(value){
								if(undefined != value)
								{
									var defaultValue = value.substring(3, 0);
									if(defaultValue == 'All')
									{
										defaultValue = getLabel('lblAll','All');
										value =value.replace('All',defaultValue);
									}
								}
								
							    this.buttonlabel.text(value);
							},
							close: function(){
								var selectedSub = $('#subsidiaries').val();
								loadOptions.data.subsidiaries = selectedSub;
								loadOptions.data.corpId = workingData.corporationId;
								//RolesApp.trigger('RenderRole',loadOptions);	
							},
							checkAll: function(){
								$.blockUI();
								$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
								css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
								var allSub = $("#subsidiaries").val();
								RolesApp.trigger('AddAllSubsidiary', allSub);
								$.unblockUI();
							},
							uncheckAll: function(){
								$.blockUI();
								$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
								css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
								var allSub = $.map($('#subsidiaries option'), function(e) { return e.value; });
								if(workingData.subsidiaries.length > 1){
									RolesApp.trigger('RemoveAllSubsidiary', allSub);
								}
								$.unblockUI();
							}
						}); 
						el.multiselect('refresh');
						//DHTTPRODMT-2527
						if( workingData && workingData.subsidiaries && workingData.subsidiaries.length == 1)
						{
							 $("#subsidiaries").multiselect("widget")
							 .find(":checkbox[value='"+workingData.subsidiaries[0].subsidiaryId+"']").attr("checked","checked");
							 
							 $("#subsidiaries option[value='" + workingData.subsidiaries[0].subsidiaryId + "']")
							 .attr("selected", "selected");
							  
							 var allSub = $("#subsidiaries").val();
							 RolesApp.trigger('AddAllSubsidiary', allSub);
							
							 $("#subsidiaries option[value='" + workingData.subsidiaries[0].subsidiaryId + "']")
							 .attr("disabled", "disabled");
							 $("#subsidiaries").multiselect('refresh');
						}
						$("#corporation").CorporationAutoComplete();
						if(workingData.corporationDesc != undefined){
						var corpDescValue = new String(workingData.corporationDesc);
					    corpDescValue = corpDescValue.replace(/&quot;/g, '"');
						workingData.corporationDesc = corpDescValue.replace(/amp;/g, '');
						}
						$("#corporation").val(workingData.corporationDesc);
						
						$("#copyFromRole").CopyFromAutoComplete();
						$("#copyFromRole").val(workingData.copyRoleDesc);
						$('#copyFromRole').attr('disabled','disabled');
						
						if($('div#PageTitle').length > 1){
							$('.ft-layout-header').empty();							
						}
						$('div#PageTitle').prependTo('.ft-layout-header');
						$('span.ft-title').prependTo('#PageTitle');
						$('.ft-layout-header').removeAttr( 'style' );
						$('.fa-refresh').hide();
						$('.t-update-text').hide();
						RolesApp.trigger('footerLinkRef');
						RolesApp.trigger('roleDetailInit');
					});
				});
			}
		}
	};

	RolesApp.bind('renderRoleDetails', RoleDetails.render);	
	
})(jQuery);
