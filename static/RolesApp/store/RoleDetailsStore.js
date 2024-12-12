/*global jQuery, RoleDetails */
(function ($) {
	'use strict';

	var updatedRole = [];
	
	var RoleDetails = {
			
		updateRoleDetails : function (e, data) {
			var index = roleCommand.findIndex(function(obj){
				return obj.commandName == "UpdateRoleDetail";
			})
			var existObj = roleCommand[index];
			
			if(undefined != existObj){
				roleCommand.splice(index, 1);
				roleCommand.push(data);
			}else{
				roleCommand.push(data);				
			}
			console.log(roleCommand);
		},
		
		createRoleDetail : function (e, data) {
			var index = roleCommand.findIndex(function(obj){
				return (obj.commandName == "CreateRoleDetail" || obj.commandName == "CopyRoleDetail");
			});
			var existObj = roleCommand[index];
			
			if(undefined != existObj){
				roleCommand.splice(index, 1);
				roleCommand.push(data);
			}else{
				roleCommand.push(data);				
			}
			console.log(roleCommand);
		},
		
		copyRoleDetail : function (e, data) {
			var index = roleCommand.findIndex(function(obj){
				return (obj.commandName == "CreateRoleDetail" || obj.commandName == "CopyRoleDetail");
			});
			var existObj = roleCommand[index];
			
			if(undefined != existObj){
				roleCommand.splice(index, 1);
				roleCommand.push(data);
			}else{
				roleCommand.push(data);				
			}
			console.log(roleCommand);
		},
		footerLinkRef :function(){
				
				var assignedAssets = [];
				var arrModuleList = [{"key":"all","value":"All"},{"key":"01","value":"Balance Reporting"},{"key":"02","value":"Payments"},{"key":"13","value":"Positive Pay"},{"key":"03","value":"Admin"},{"key":"14","value":"Check Management"},{"key":"04","value":"Liquidity"},{"key":"15","value":"Bank Reports"},{"key":"05","value":"Receivables"},{"key":"16","value":"Imaging"},{"key":"06","value":"SCF"},{"key":"07","value":"Loans"},{"key":"18","value":"Limits"},{"key":"19","value":"Portal"},{"key":"09","value":"Trade"},{"key":"20","value":"Mobile Banking"},{"key":"10","value":"Cashflow Forecast"},{"key":"21","value":"Sub Accounts"}];
				var assetNameEn;
				 				
				var tempWorkdata,tempRoleCmd = [];
			
				tempWorkdata = workingData;
				tempRoleCmd = roleCommand.concat(uiCommand);
				
				$.each(tempRoleCmd,function(index, command){
					if(command.commandName == "AddServices" || command.commandName == "RemoveServices" ){
						var index = workingData.services.findIndex(function(obj){
							return obj.serviceId == command.kv.serviceId;
			        	})
			        	$.extend( tempWorkdata.services[index], command.kv );
					}
				});
				
				for (var itemp = 0,j=0; itemp < tempWorkdata.services.length; itemp++) { 
	        		if(tempWorkdata.services[itemp].assignedFlag){
	        			
	        			assignedAssets[j] = {
	        				"assetName" : tempWorkdata.services[itemp].serviceName,
	        				"assetId" : tempWorkdata.services[itemp].serviceId
	        			}
	        			j++;
	        		}
	        	}
				if(assignedAssets.length > 0 ){
					arrModuleList.filter(function( selection ) {
						if(selection.key === assignedAssets[0].assetId) {
							assetNameEn = selection.value;
						}
					});
					var serviceName;
					for(var i = 0;i < tempWorkdata.services.length; i++)
					{
						if(tempWorkdata.services[i].assignedFlag)
						{
							serviceName = tempWorkdata.services[i].serviceNameDisplay;
							break;
						}
					}
					$('#Next').attr('href' , "#/" +(serviceName).replace(/ /g, ''));
					$('#Next').attr('data-assetid', assignedAssets[0].assetId);
				}
				
			},
	
		addSubsidiary : function (e, data) {
			var index = roleCommand.findIndex(function(obj){
					return obj.kv.subsidiaryId == data.kv.subsidiaryId;
			});
			var existObj = roleCommand[index];

			if(undefined != existObj && existObj.commandName == "RemoveSubsidiary"){
				roleCommand.splice(index, 1);
				uiCommand.push(data);
				//roleCommand.push(data);				
			}else{
				roleCommand.push(data);				
			}
			console.log("Subsidiary Store  Updated");
			console.log(roleCommand);
		},
		
		removeSubsidiary : function (e, data) {
			var index = roleCommand.findIndex(function(obj){
					return obj.kv.subsidiaryId == data.kv.subsidiaryId;
			});
			var existObj = roleCommand[index];
			
			if(undefined != existObj && existObj.commandName == "AddSubsidiary"){
				roleCommand.splice(index, 1);
				uiCommand.push(data);
				//roleCommand.push(data);				
			}else{
				roleCommand.push(data);				
			}
			console.log("Service store Updated");
			console.log(roleCommand);
		},
		
		
		addAllSubsidiary : function (e, data) {
			for(var i=0;i<data.length;i++){
				var cmdVersion = commandVersion + 1 ;
    			commandVersion += 1 ;
    			var isAssigned = false;
    			var subIndex = workingData.subsidiaries.findIndex(function(obj){
					return obj.subsidiaryId == data[i];
				})
    			
    			if(workingData.subsidiaries[subIndex].assignedFlag)
    				isAssigned = true; 
    				
		        if(!isAssigned){
				var subObj = {
						commandName: "AddSubsidiary",
						path: '/rolesApi/roleDetails/Subsidiary',
						kv: {
							subsidiaryId : data[i],
							subsidiaryName : $('#chkSub_'+ data[i]).text(),
							assignedFlag : true,
							digest : data[i].digest,
							commandVersion : cmdVersion
						}		
				}
				
				var index = roleCommand.findIndex(function(obj){
					return obj.kv.subsidiaryId == subObj.kv.subsidiaryId;
				})
				var existObj = roleCommand[index];
				
				if(undefined != existObj && existObj.commandName == "AddSubsidiary"){
					roleCommand.splice(index, 1);
					roleCommand.push(subObj);
				}else if(undefined != existObj && existObj.commandName == "RemoveSubsidiary"){
					roleCommand.splice(index, 1);
					//roleCommand.push(subObj);
				}else{
					roleCommand.push(subObj);				
				}
		      }else{
		      		var subId = data[i];
			     	var index = roleCommand.findIndex(function(obj){
						return obj.kv.subsidiaryId == subId;
					})
					var existObj = roleCommand[index];
					
					if(undefined != existObj && existObj.commandName == "RemoveSubsidiary"){
						roleCommand.splice(index, 1);
					}
		      }
			}
			console.log("Subsidiary store Updated after check all");
			console.log(roleCommand);
		},
		
		removeAllSubsidiary : function (e, data) {
			for(var i=0;i<data.length;i++){
				var cmdVersion = commandVersion + 1 ;
    			commandVersion += 1 ;
    			var isAssigned = false;
    			var subIndex = workingData.subsidiaries.findIndex(function(obj){
					return obj.subsidiaryId == data[i];
				})
    			
    			if(workingData.subsidiaries[subIndex].assignedFlag)
    				isAssigned = true;    				
		        if(isAssigned){
					var subObj = {
							commandName: "RemoveSubsidiary",
							path: '/rolesApi/roleDetails/Subsidiary',
							kv: {
								subsidiaryId : data[i],
								subsidiaryName : $('#chkSub_'+ data[i]).text(),
								assignedFlag : false,
								digest : data[i].digest,
								commandVersion : cmdVersion
							}		
					}
					
					var index = roleCommand.findIndex(function(obj){
						return obj.kv.subsidiaryId == subObj.kv.subsidiaryId;
					})
					var existObj = roleCommand[index];
					
					if(undefined != existObj && existObj.commandName == "RemoveSubsidiary"){
						roleCommand.splice(index, 1);
						roleCommand.push(subObj);
					}else if(undefined != existObj && existObj.commandName == "AddSubsidiary"){
						roleCommand.splice(index, 1);
						//roleCommand.push(subObj);
					}else{
						roleCommand.push(subObj);				
					}
			  }else{
			  		var subId = data[i];
			     	var index = roleCommand.findIndex(function(obj){
						return obj.kv.subsidiaryId == subId;
					})
					var existObj = roleCommand[index];
					
					if(undefined != existObj && existObj.commandName == "AddSubsidiary"){
						roleCommand.splice(index, 1);
					}
		      }
			}
			console.log("Subsidiary store Updated after uncheck all");
			console.log(roleCommand);
		},
		
		//On subsidiaries changes
		renderRole : function(e, loadOptions){
			var url;
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			
			$.ajax({
		        url: "services/rolesLookUpApi/roleDetails",
		        type: "POST",
		        data: {
		        	"roleId" : loadOptions.data.roleId,
		        	"corpId" : loadOptions.data.corpId,
		        	"subsidiaries" : JSON.stringify(loadOptions.data.subsidiaries)
		        },
		        dataType: "json",
		        async : false,
		        contentType: "application/json; charset=utf-8",
		        success: function (data) {
	        	$('#errorDiv').addClass('hidden');
		      		        	
		        	$.extend( workingData.services, data.services ); //merge
		        	$.extend( workingData.granPrivileges, data.granPrivileges ); //merge
		        	
		        	//TODO - Below Temporary code need to remove 
					 for(var i = 0; i < workingData.services.length; i++){
		        	        if(workingData.services[i].serviceId != "03" && workingData.services[i].serviceId != "01" && 
		        	        		workingData.services[i].serviceId != "02") {
		        	        	workingData.services.splice(i,1);
		        	            i--; // Prevent skipping an item
		        	        }
		        	  }
		        	
		        	
		        	$.each(roleCommand.concat(uiCommand), function(index, item) {
		        		if(item.commandName != "AddGR" && item.commandName != "RemoveGR" && 
		        				item.commandName != "AddServices" && item.commandName != "RemoveServices" ){
			        		CommonObj.updateWorkingData(item);			        			
		        		}
		        	});
		        	
		        	//Remove services & GR related commands from roleCommand & uiCommand
		        	 for(var i = 0; i < roleCommand.length; i++){
		        	        if(roleCommand[i].commandName == "AddGR" || roleCommand[i].commandName == "RemoveGR" || 
		        	        		roleCommand[i].commandName == "AddServices" || roleCommand[i].commandName == "RemoveServices") {
		        	        	roleCommand.splice(i,1);
		        	            i--; // Prevent skipping an item
		        	        }
		        	  }
		        	 
		        	 for(var i = 0; i < uiCommand.length; i++){
		        	        if(uiCommand[i].commandName == "AddGR" || uiCommand[i].commandName == "RemoveGR" || 
		        	        		uiCommand[i].commandName == "AddServices" || uiCommand[i].commandName == "RemoveServices") {
		        	        	uiCommand.splice(i,1);
		        	            i--; // Prevent skipping an item
		        	        }
		        	  }

		        	 //default admin service to be selected
		        	 $.each(workingData.services,function(index,item){
		        		if(item.serviceId == "03" && item.assignedFlag){
		        			var cmdVersion = commandVersion + 1 ;
							commandVersion += 1 ;
							RolesApp.trigger('AddServices', {
								commandName: "AddServices",
								path: '/rolesApi/roleDetails/Services',
								kv: {						
									serviceId : "03",
									assignedFlag : true,
									serviceName : $('#lblImgSrvc_03').val().trim(),
						            commandVersion : cmdVersion
								}
							});
							return false;
		        		} 
		        	 });
		        	 
		        	 var assignedAssets = [];	
			        	for (var itemp = 0,j=0; itemp < workingData.services.length; itemp++) { 
			        		if(workingData.services[itemp].assignedFlag){
			        			
			        			assignedAssets[j] = {
			        				"assetName" : workingData.services[itemp].serviceName,
			        				"assetId" : workingData.services[itemp].serviceId
			        			}
			        			j++;
			        		}
			        	}
			        	
			        	$('#Next').attr('href', '#/'+assignedAssets[0].assetName);  
		        	 
		        	RolesApp.trigger('renderRoleDetails', workingData );
		        	$.unblockUI();
		        },
		        error: function () {
		            //alert("An error has occured!!!");
		        	$('#errorDiv').removeClass('hidden');
		        	$('#errorPara').text("An error has occured!!!");
		        	$.unblockUI();
		        }
		    });
		
		},
		
		//On Click of Next
		saveRole : function(event){
			var url;
			/*$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});*/
			if(workingData.copyFromFlag){
				url= "services/rolesCommandApi/processCopy/?roleId=" + $('#roleId').val() + "&corpId="+ workingData.corporationId +"&recordKeyNo=" + workingData.recordKeyNo + "&commandVersion=" + commandVersion;								
			}else{
				url= "services/rolesCommandApi/process/?roleId=" + $('#roleId').val() + "&corpId="+ workingData.corporationId +"&recordKeyNo=" + workingData.recordKeyNo;				
			}
			
			$.ajax({
		        url: url,
		        type: "POST",
		        data: JSON.stringify(roleCommand),
		        async : false,
		        contentType: "application/json; charset=utf-8",
		        success: function (data) {
		        	if(null != data){
			        	if(workingData.copyFromFlag){
			        		workingData.recordKeyNo = data.recordKeyNo;
			        		commandVersion = data.commandVersion;
			        		workingData.copyFromFlag = false;
			        	}else{
			        		workingData.recordKeyNo = data;
			        	}
			        	$('#copyFromDiv').hide();
			        	$('#roleId').attr('disabled','disabled');
			        	$('#corporation').removeClass('ui-suggestion-box');
						$('#corporation').attr('disabled','disabled');
		        	}
		        	
		        	$.each(roleCommand, function(index, item) {
		        		CommonObj.updateWorkingData(item);
		        	})
		        	roleCommand = [];
		        	uiCommand = [];		        	
		        	$.unblockUI();
		        },
		        error: function (request, status, error) {
		            $('#errorDiv').removeClass('hidden');
		            
		            var er = JSON.parse(request.responseText);
		            if(er.length > 0){
		            	$.each(er,function(index,item){
		            		$('#errorPara').text(item.errorMessage);
		            	});
		            }
		            
		            if(event)
		            	event.preventDefault();
		        	$.unblockUI();
		        }
		    });
		},
		
		addServices : function (e, data) {
			var index = roleCommand.findIndex(function(obj){
					return obj.kv.serviceId == data.kv.serviceId;
			})
			var existObj = roleCommand[index];
			
			if(undefined != existObj && existObj.commandName == "RemoveServices"){
				roleCommand.splice(index, 1);
				uiCommand.push(data);
			}else{
				roleCommand.push(data);				
			}
			console.log("Service store Updated");
			console.log(roleCommand);
		},
		
		removeServices : function (e, data) {
				var index = roleCommand.findIndex(function(obj){
						return obj.kv.serviceId == data.kv.serviceId;
				});
				var existObj = roleCommand[index];
				
				if(undefined != existObj && existObj.commandName == "AddServices"){
					roleCommand.splice(index, 1);
					uiCommand.push(data);

				}else{
					roleCommand.push(data);				
				}
				console.log("Service store Updated");
				console.log(roleCommand);
		},
		
		addGR : function (e, data) {
			var index = roleCommand.findIndex(function(obj){
					return obj.kv.granularPrivilegeId == data.kv.granularPrivilegeId;
			});
			var existObj = roleCommand[index];
			
			if(undefined != existObj && existObj.commandName == "RemoveGR"){
				roleCommand.splice(index, 1);
			}else{
				roleCommand.push(data);				
			}
			console.log("GR Priv Updated");
			console.log(roleCommand);
		},
		
		removeGR : function (e, data) {
			var index = roleCommand.findIndex(function(obj){
					return obj.kv.granularPrivilegeId == data.kv.granularPrivilegeId;
			});
			var existObj = roleCommand[index];

			if(undefined != existObj && existObj.commandName == "AddGR"){
				roleCommand.splice(index, 1);
			}else{
				roleCommand.push(data);				
			}
			console.log("GR Priv Updated");
			console.log(roleCommand);
		}
	};
	
	jQuery.fn.CorporationAutoComplete = function() {
		var seekUrl = "services/rolesLookUpApi/Corporations";
		var results;
		return this.each(function() {
			$(this).autocomplete({
				source : function(request, response) {
					$.ajax({
								url : seekUrl,
								dataType : "json",
								type: "POST",
								data : {
									autoFilter : request.term,
									"$top" : 20
								},
								success : function(data) {
									var rec = data;
									if( rec.length == 0 ) {
										results = [{
													label : '',
													code : 'No Records Found'}
													];
										response(results);
									}
									else {
										response($.map(rec, function(item) {
											item.corpDesc = item.corpDesc.replace(/&quot;/g, '"');
												return {
													label : item.corpDesc.replace(/amp;/g, ''),
													value :item.corpDesc.replace(/amp;/g, ''),
													code : item.corpId
												}
											}));
									}
								}
							});
				},
				minLength : 1,
				select : function(event, ui) {
						var val = ui.item.code;
						console.log("Selected Corp ID = " + val  + "Name - " + ui.item.label);
						$('#corporation').val(ui.item.label);		
						workingData.corporationId = ui.item.code;
						workingData.corporationDesc = ui.item.label;
						workingData.copyFromFlag = false;
						workingData.roleId = null;
						roleCommand = [];
			        	RolesApp.trigger('renderRoleDetails', workingData );			        	
				},
				open : function() {
					$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
				},
				close : function() {
					$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
				}
			});/*.data("autocomplete")._renderItem = function(ul, item) {
				var inner_html;
				if( item.code == 'No Records Found' ) {
					inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.code + ' '+'</ul"><ul">' + item.label
					+ '</ul"></ol></a>';
				}
				else{
					inner_html = '<a><ol class="xn-autocompleter"><ul style="width:100px;" class="inline">'				
						+ item.label
						+ '</ul><ul style="width:200px;font-size:0.8em;color:#06C;" class=inline>'
						+ ' </ul></ol></a>';	
				}
				return $("<li></li>").data("item.autocomplete", item)
						.append(inner_html).appendTo(ul);
			};*/
		});
	};
	
	jQuery.fn.CopyFromAutoComplete = function() {
		var seekUrl = "services/rolesLookUpApi/roleDetails/roleList";
		var results;
		return this.each(function() {
			$(this).autocomplete({
				source : function(request, response) {
					$.ajax({
								url : seekUrl,
								dataType : "json",
								type: "POST",
								data : {
									autoFilter : request.term,
									corpId : workingData.corporationId
								},
								success : function(data) {
									var rec = data;
									existingRoleData = data;
									if( rec.length == 0 ) {
										results = [{
													label : '',
													code : 'No Records Found'}
													];
										response(results);
									}
									else {
										response($.map(rec, function(item) {
												return {
													label : item.CATDESCRIPTION,
													value :item.CATDESCRIPTION,
													code : item.CATCATEGORY,
													corpCode : item.CATCORPORATION
												}
											}));
									}
								}
							});
				},
				minLength : 1,
				select : function(event, selectedRole) {
						var val = selectedRole.item.code;
						console.log("Selected Role ID = " + val  + "Name - " + selectedRole.item.label);
						$('#copyFromRole').val(selectedRole.item.label);		
						workingData.roleDesc=$('#roleDesc').val();
						workingData.roleId=$('#roleId').val();
						workingData.srcRoleId = selectedRole.item.code;
						workingData.srcRoleDesc = selectedRole.item.label;
						workingData.srcComapany = selectedRole.item.corpCode;
						workingData.copyFromFlag = true;
						
						roleCommand = [];
						
						$.blockUI();
						$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
						css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
						$.ajax({
					        url: "services/rolesLookUpApi/roleDetails/roleDetailsChangeSet/",
					        type: "POST",
					        data: {
					        	"roleId" : workingData.srcRoleId,
					        	"assetId" : "00" ,
					        	"corpId" : workingData.srcComapany
					        },
					        async : false,
					        //contentType: "application/json; charset=utf-8",
					        dataType: "json",
					        success: function (data) {
					        	$.unblockUI();					        	
					        	commandVersion = data.commandVersion;
					        	roleCommand = data.roleCommandBeans;
					        	
					        	$.each(workingData.services,function(index,service){
					        		service.assignedFlag = false;
					        	});
					        	
					        	$.each(workingData.subsidiaries,function(index,subsidiary){
					        		subsidiary.assignedFlag = false;
					        	});
					        	if (workingData.granPrivileges != undefined) {
					        		$.each(workingData.granPrivileges,function(index,granPrivileges){
						        		granPrivileges.assignedFlag = false;
						        	});
								}
					        	
					        	$.each(data.roleCommandBeans, function(index, item) {
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
			        	RolesApp.trigger('renderRoleDetails', workingData );			        	
				},
				open : function() {
					$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
				},
				close : function() {
					$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
				}
			});/*.data("autocomplete")._renderItem = function(ul, item) {
				var inner_html;
				if( item.code == 'No Records Found' ) {
					inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.code + ' '+'</ul"><ul">' + item.label
					+ '</ul"></ol></a>';
				}
				else{
					inner_html = '<a><ol class="xn-autocompleter"><ul style="width:100px;" class="inline">'				
						+ item.code + ' |  ' +  item.label + 
						'</ul></ol></a>';	
				}				
				return $("<li></li>").data("item.autocomplete", item)
						.append(inner_html).appendTo(ul);
			};*/
		});
	};

	RolesApp.bind('UpdateRoleDetail', RoleDetails.updateRoleDetails);
	RolesApp.bind('CreateRoleDetail', RoleDetails.createRoleDetail);
	RolesApp.bind('CopyRoleDetail', RoleDetails.copyRoleDetail);	
	RolesApp.bind('footerLinkRef', RoleDetails.footerLinkRef);
	
	RolesApp.bind('AddServices', RoleDetails.addServices);
	RolesApp.bind('RemoveServices', RoleDetails.removeServices);
	
	RolesApp.bind('AddGR', RoleDetails.addGR);
	RolesApp.bind('RemoveGR', RoleDetails.removeGR);
	
	RolesApp.bind('AddSubsidiary', RoleDetails.addSubsidiary);
	RolesApp.bind('RemoveSubsidiary', RoleDetails.removeSubsidiary);
	
	RolesApp.bind('AddAllSubsidiary', RoleDetails.addAllSubsidiary);
	RolesApp.bind('RemoveAllSubsidiary', RoleDetails.removeAllSubsidiary);
	
	RolesApp.bind('RenderRole', RoleDetails.renderRole);	
	RolesApp.bind('SaveRole', RoleDetails.saveRole);	
	
})(jQuery);
