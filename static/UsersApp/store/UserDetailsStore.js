/*global jQuery, RoleDetails */

var authMatrixStore = [], subsidiaryStore = [];
var subsidiaryAssignedCount=0, subsidiayCount=0 , authMatrixAssignedCount=0, authMatrixCount=0;

(function ($) {
	'use strict';

	var UserDetails = {
			
		updateUserDetails : function (e, data) {
				var index = userCommand.findIndex(function(obj){
					return obj.commandName == "UpdateUserDetail";
				})
				var existObj = userCommand[index];
				
				if(undefined != existObj){
					userCommand.splice(index, 1);
					userCommand.push(data);
				}else{
					userCommand.push(data);				
				}
				console.log(userCommand);
			},
		
		createUserDetails : function (e, data) {
			var index = userCommand.findIndex(function(obj){
				return (obj.commandName == "CreateUserDetail" || obj.commandName == "CopyUserDetail");
			});
			var existObj = userCommand[index];
			
			if(undefined != existObj){
				userCommand.splice(index, 1);
				userCommand.push(data);
			}else{
				userCommand.push(data);				
			}
			console.log(userCommand);
		},
		
		
		copyUserDetail : function (e, data) {
			var index = userCommand.findIndex(function(obj){
				return (obj.commandName == "CreateUserDetail" || obj.commandName == "CopyUserDetail");
			});
			var existObj = userCommand[index];
			
			if(undefined != existObj){
				userCommand.splice(index, 1);
				userCommand.push(data);
			}else{
				userCommand.push(data);				
			}
			console.log(userCommand);
		},
		addApprovalMatrix : function (e, data) {
			var index = authMatrixStore.findIndex(function(obj){
					return obj.kv.authMatrixId == data.kv.authMatrixId;
			});
			var existObj = authMatrixStore[index];
			
			if(undefined != existObj && existObj.commandName == "RemoveApprovalMatrix"){
				authMatrixStore.splice(index, 1);
				authMatrixAssignedCount++
				$('#lblApprovalMatrixCount').text(authMatrixAssignedCount + " of " + authMatrixCount + " Selected");
			}else{
				authMatrixStore.push(data);	
				authMatrixAssignedCount++
				$('#lblApprovalMatrixCount').text(authMatrixAssignedCount + " of " + authMatrixCount + " Selected");
		}
			console.log("Auth matrix Updated");
			console.log(authMatrixStore);
		},
		
		removeApprovalMatrix : function (e, data) {
			var index = authMatrixStore.findIndex(function(obj){
					return obj.kv.authMatrixId == data.kv.authMatrixId;
			});
			var existObj = authMatrixStore[index];
			
			if(undefined != existObj && existObj.commandName == "AddApprovalMatrix"){
				authMatrixStore.splice(index, 1);
				authMatrixAssignedCount--
				$('#lblApprovalMatrixCount').text(authMatrixAssignedCount + " of " + authMatrixCount + " Selected");
			}else{
				authMatrixStore.push(data);	
				authMatrixAssignedCount--
				$('#lblApprovalMatrixCount').text(authMatrixAssignedCount + " of " + authMatrixCount + " Selected");
			}
			console.log("Auth matrix Updated");
			console.log(authMatrixStore);
		},
		
		applyAllApprovalMatrix : function (e, data) {
			
			authMatrixStore = [];
			authMatrixStore.push(data);
			
			authMatrixAssignedCount = authMatrixCount;
			$('#lblApprovalMatrixCount').text(authMatrixAssignedCount + " of " + authMatrixCount + " Selected");
			
			console.log("Apply All Auth matrix ");
			console.log(authMatrixStore);
		},
		
		removeAllApprovalMatrix : function (e, data) {
				
			authMatrixStore = [];
			authMatrixStore.push(data);
			authMatrixAssignedCount = 0;
			$('#lblApprovalMatrixCount').text(authMatrixAssignedCount + " of " + authMatrixCount + " Selected");
			console.log("Remove All Auth matrix ");
			console.log(authMatrixStore);
		},
		
		addSubsidiary : function (e, data) {
			var index = subsidiaryStore.findIndex(function(obj){
					return obj.kv.subsidiaryId == data.kv.subsidiaryId;
			});
			
			var existObj = subsidiaryStore[index];
			
			var toggleDefault = false;
			if(data.toggleDefault){
				toggleDefault = true;
				delete data.toggleDefault;
			}
			
			if(undefined != existObj && existObj.commandName == "RemoveUserSubsidiary"){
				var subsidiaryIndex = userWorkingData.subsidiaries.findIndex(function(obj){
					return obj.subsidiaryId == data.kv.subsidiaryId;
				});
				$.extend( userWorkingData.subsidiaries[subsidiaryIndex], data.kv );
				subsidiaryStore.splice(index, 1);
			//	subsidiaryAssignedCount++
				$('#lblSubsidiaryCount').text(subsidiaryAssignedCount + " of " + subsidiayCount + " Selected");
			}else if(undefined != existObj && existObj.commandName == "AddUserSubsidiary"){
				subsidiaryStore.splice(index, 1);
				subsidiaryStore.push(data);
			//	subsidiaryAssignedCount++
				$('#lblSubsidiaryCount').text(subsidiaryAssignedCount + " of " + subsidiayCount + " Selected");
			}else{
				subsidiaryStore.push(data);	
			//	subsidiaryAssignedCount++
				$('#lblSubsidiaryCount').text(subsidiaryAssignedCount + " of " + subsidiayCount + " Selected");
			}
			
			//if(!toggleDefault)
				UserDetails.renderApprovalMatrix(e, data);
				
			UserDetails.renderMFACheckbox(data);
			
			console.log("Subsidiary Updated");
			console.log(subsidiaryStore);
	},		
		removeSubsidiary : function (e, data) {
			var index = subsidiaryStore.findIndex(function(obj){
					return obj.kv.subsidiaryId == data.kv.subsidiaryId;
			});
			var existObj = subsidiaryStore[index];
			
			if(undefined != existObj && existObj.commandName == "AddUserSubsidiary"){
				var subsidiaryIndex = userWorkingData.subsidiaries.findIndex(function(obj){
					return obj.subsidiaryId == data.kv.subsidiaryId;
				});
				$.extend( userWorkingData.subsidiaries[subsidiaryIndex], data.kv );
				subsidiaryStore.splice(index, 1);
			//	subsidiaryAssignedCount--
				$('#lblSubsidiaryCount').text(subsidiaryAssignedCount + " of " + subsidiayCount + " Selected");
			}else{
				subsidiaryStore.push(data);	
			//	subsidiaryAssignedCount--
				$('#lblSubsidiaryCount').text(subsidiaryAssignedCount + " of " + subsidiayCount + " Selected");
			}
			UserDetails.renderApprovalMatrix(e,data);
			UserDetails.renderMFACheckbox(data);					
			console.log("Subsidiary Updated");
			console.log(subsidiaryStore);
		},
		
		renderApprovalMatrix : function(e, data) {
			var  subsidairies ="";
			var elem = $('img[id^="chkSubsidiary_"]')
			$.each(elem,function(index,elem){
				if(!($(this).attr('src').search("unchecked") != -1)){
					subsidairies += $(this).data('subsidiaryid') +",";
				}
			});

			subsidairies = subsidairies.substring(0, subsidairies.length - 1);
			/*var recKey = "";
			if(userWorkingData.recordKeyNo)
				recKey = userWorkingData.recordKeyNo;*/
			
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
			css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			
			var params = "userId=" + userWorkingData.loginId + "&roleId=" + data.kv.usrRoleId + "&subsidairies=" + subsidairies + "&corpId=" + data.kv.corpId;			
			 $.ajax({
			        url: "services/usersLookUpApi/approvalMatrix/?"+params,
			        type: "POST",
			        async : false,
			        //contentType: "application/json; charset=utf-8",
			        dataType: "json",
			        success: function (approvalMatrix) {
			        	userWorkingData.approvalMatrix = approvalMatrix;
			        	userWorkingData.loginId = $('#loginId').val();
			        	userWorkingData.authMatrixAssignedCount = 0;
			        	userWorkingData.authMatrixCount = approvalMatrix.length;
			        	authMatrixStore =[];
			        	$.each(TT_UserAppItem.getDetailStore(),function(index,command){
				        	CommonUserObj.updateUserDetailsuserWorkingData(command);
			        	});
			        	userWorkingData.commandVersion = commandVersion;
			        	UsersApp.trigger('renderUserDetails', userWorkingData);
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
		
		renderMFACheckbox : function(e, data) {
			var subsidairies = '';
			if(userWorkingData.subsidiaries ? (userWorkingData.subsidiaries.length == 1 ? true : false) : false)
				subsidairies=userWorkingData.subsidiaries[0].subsidiaryId;
			else{
			var elem = $('img[id^="chkSubsidiary_"]');
			$.each(elem, function(index,elem) {
				if(!($(this).attr('src').search("unchecked") != -1)) {
					//subsidairies = subsidairies + $(this).data('subsidiaryid') + ',';
					subsidairies = subsidairies + $(this).attr("data-subsidiaryid") + ',';
				}
			});

			subsidairies = subsidairies.substring(0, subsidairies.length - 1);
			}
			
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
			css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			
			var params = "subsidairies=" + subsidairies;
			$.ajax({
				url: "services/usersLookUpApi/MFARequired/?" + params,
				type: "POST",
				async : false,
				dataType: "text",
				success: function (response) {
					userWorkingData.metaData.mfaApplicable = response;
					if(userWorkingData.metaData.mfaApplicable == 'N' && userWorkingData.metaData.mfaApplicable){						
						var userCommand = TT_UserAppItem.getDetailStore();
						for(var i = 0; i < userCommand.length; i++){        	        
							if(userCommand[i].commandName == "CreateUserDetail" || userCommand[i].commandName == "UpdateUserDetail") {
								userCommand[i].kv.requireMFA = false;
							}
						}
					} 
					UsersApp.trigger('renderUserDetails', userWorkingData);
					$.unblockUI();
		        },
		        error: function (request, status, error) {
		            $('#errorDiv').removeClass('hidden');
		            
		            var er = JSON.parse(request.responseText);
		            if(er.length > 0) {
		            	$.each(er,function(index,item){
		            		$('#errorPara').text(item.errorMessage);
		            	});
		            }
		            
		            if(event)
		            	event.preventDefault();
		        	$.unblockUI();
			    }
			});
			
			$.ajax({
	        url: "services/usersLookUpApi/usrMfaTrigger",
	        type: "POST",
	        async : false,
	        contentType: "application/json; charset=utf-8",
	        success: function (data) {
	        	userWorkingData.usrMfaTrigger = $('#usrMfaTrigger').val();
	        	userWorkingData.usrMfaList = data;
	        			        
	        	$.each(userWorkingData.usrMfaList,function(index,item){
	        		if( item.mfaTriggerId == $('#usrMfaTrigger').val()){
	        			item.assignedFlag = true;
	        		}else{
	        			item.assignedFlag = false;
	        		}			        		
            	});
            	UsersApp.trigger('renderUserDetails', userWorkingData);
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
		
		renderState :  function(e, data){

			 $.ajax({
			        url: "services/usersLookUpApi/states?countryId=" +data.kv.countryId ,
			        type: "POST",
			        async : false,
			        contentType: "application/json; charset=utf-8",
			        success: function (data) {
			        	userWorkingData.usrCountry = $('#usrCountry').val();
			        	userWorkingData.address.stateList = data;
			        	
			        	$.each(userCommand, function(index, item) {
			        		CommonUserObj.updateUserDetailsuserWorkingData(item);
			        	});
			        	
			        	$.each(userWorkingData.address.countryList,function(index,item){
			        		if( item.countryId == $('#usrCountry').val()){
			        			item.assignedFlag = true;
			        		}else{
			        			item.assignedFlag = false;
			        		}			        		
		            	});
		            	// start of renderState
			        	UsersApp.trigger('renderState', data);
			        	// end
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
			 TT_UserAppItem.UserDetails();
				
			
		},
		
	
		//On role changes
		renderRole : function(e, data){
			var recKey = userWorkingData.recordKeyNo;
			
			 var index = userCommand.findIndex(function(obj){
					return (obj.commandName == "SwitchUserRole");
				});
			 var existObj = userCommand[index];
				
				if(undefined != existObj){
					userCommand.splice(index, 1);
					userCommand.push(data);
				}else{
					userCommand.push(data);				
				}
			 $.ajax({
			        url: "services/usersLookUpApi/userDetails/?roleId=" + data.kv.usrRoleId + "&corpId=" + data.kv.corpId,
			        type: "POST",
			        async : false,
			        contentType: "application/json; charset=utf-8",
			        success: function (data) {
			        	userWorkingData = data;
			        	if(recKey)
			        		userWorkingData.recordKeyNo = recKey;
			        	userWorkingData.firstName = $('#firstName').val();
			        	userWorkingData.lastName = $('#lastName').val();
			        	userWorkingData.usrRoleDesc = $('#userCategory').find("option:selected").text();
			        	userWorkingData.usrRoleId = $('#userCategory').val() == "Select" ? "" : $('#userCategory').val();
			        	userWorkingData.loginId = $('#loginId').val();
			        	userWorkingData.activationDate = $('#activationDate' ).val();
			        	userWorkingData.department = $('#department').val();
			        	userWorkingData.telephone = $('#telephone').val();
			        	userWorkingData.email = $('#email').val();
			        	userWorkingData.mobileNo = $('#mobileNo').val();
			        	userWorkingData.address.addressLine1 = $('#usrAddress').val();
			        	userWorkingData.address.zipCode = $('#zipCode').val();
			        	userWorkingData.address.fax = $('#fax').val();
			        	userWorkingData.address.city = $('#city').val();
			        	userWorkingData.usrCountry = $('#usrCountry').val(),
			        	userWorkingData.usrApprovalLevel = $('#approvalLevel').val();
			        	$.each(userWorkingData.approvalLevelList,function(index,item){
			        		if(item.optionId == userWorkingData.usrApprovalLevel)
			        			item.assignedFlag = true;
			        		else
			        			item.assignedFlag = false;
			        	});
			        	$.each(userWorkingData.subsidiaries,function(index,item){
			        		var subName = new String(item.subsidiaryName);
							subName = subName.replace(/quot;/g,'');
			        		item.subsidiaryName = subName.replace(/amp;/g,'');
			        	});
			        	
			        	if(userWorkingData.metaData.autoUsrCode == "PRODUCT"){
				        	userWorkingData.isTemplateOnly = ($('#chkTemplateOnlyFlag').attr('src').search("unchecked") != -1) ? false : true ;
				        	userWorkingData.superUser  = ($('#chkUsrSuperUser').attr('src').search("unchecked") != -1) ? false : true ;
				        	userWorkingData.allowConfidential  = ($('#chkUsrAccessType').attr('src').search("unchecked") != -1) ? false : true ;
							if(userWorkingData.metaData.disableRejectFlag === 'Y') {
                            userWorkingData.disableReject = ($('#chkDisableReject').attr('src').search("unchecked") != -1) ? false : true ;
                            }
				        	if(userWorkingData.metaData.mfaApplicable === 'Y') {
				        		userWorkingData.requireMFA  = ($('#chkUsrMultiFa').attr('src').search("unchecked") != -1) ? false : true ;
				        	} else {
				        		userWorkingData.requireMFA = false;
				        	}
			        	}
			        	
			        	userWorkingData.mode = 'new';
			        	userWorkingData.isCorpChange = false;
			        	userWorkingData.ssoLoginId = $('#ssoLoginId').val(),
			        	userWorkingData.commandVersion = commandVersion;
			        	
			        	TT_UserAppItem.UserDetails();
						console.log(userCommand);
			        	authMatrixStore = [];
			        	subsidiaryStore = [];
			        	UsersApp.trigger('renderUserDetails', userWorkingData);
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
		
		//On Click of Next
		saveUser : function(event){
			var url= "";
			
			
			if(userWorkingData.copyFromFlag){
				url= "services/userCommandApi/processCopy/?loginId=" + $('#loginId').val() + "&corpId="+ userWorkingData.corporationId +"&recordKeyNo=" + userWorkingData.recordKeyNo + "&commandVersion=" + commandVersion;								
			}else{
				url= "services/userCommandApi/process?loginId=" + $('#loginId').val() + "&recordKeyNo=" + userWorkingData.recordKeyNo + "&usrRoleId="+ userWorkingData.usrRoleId;	
			}
					
			$.ajax({
		        url: url,
		        type: "POST",
		        data: JSON.stringify(userCommand),
		        async : false,
		        contentType: "application/json; charset=utf-8",
		        success: function (data) {
		        	if(null != data){
		        			if(userWorkingData.copyFromFlag){
				        		$('#copyFromDiv').hide();
				        		userWorkingData.copyFromFlag = false;
				        		userWorkingData.recordKeyNo = data.recordKeyNo;
				        		commandVersion = data.commandVersion;
		        			}else{
				        		userWorkingData.recordKeyNo = data;
		        			}
			        		$('#loginId').attr('disabled', true);
			        		userWorkingData.loginId = $('#loginId').val();
			        		
			        		if(null !=  userWorkingData.recordKeyNo){
								$('#corporation').removeClass('ui-suggestion-box');
								$('#corporation').attr('disabled','disabled');
			        		}
			        	}
		        	
		        	$.each(userCommand, function(index, item) {
		        		CommonUserObj.updateUserDetailsuserWorkingData(item);
		        	});
		        	
		        	userCommand = [];
		        	authMatrixStore = [];
		        	subsidiaryStore = [];
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
		            $("html,body").scrollTop(0);
		            if(event)
		            	event.preventDefault();
		        	$.unblockUI();
		        }
		    });
		
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
													code : item.corpId.replace(/amp;/g, '')
												}
											}));
								}
								}
							});
				},
				minLength : 1,
				select : function(event, ui) {
						var val = ui.item.code;
						$('#corporation').val(ui.item.label);		
						userWorkingData.corpId = ui.item.code;
						userWorkingData.corpDesc = ui.item.label;
						userWorkingData.isCorpChange = true;
						userWorkingData.loginId = null;
						userCommand = [];
						authMatrixStore = [];
						subsidiaryStore = [];
			        	UsersApp.trigger('renderUserDetails', userWorkingData);
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
		var seekUrl = "services/usersApi/userList";
		
		return this.each(function() {
			$(this).autocomplete({
				source : function(request, response) {
					$.ajax({
								url : seekUrl,
								dataType : "json",
								type: "POST",
								data : {
									autoFilter : request.term,
									corpId : userWorkingData.corpId
								},
								success : function(data) {
									var rec = data;
									existingUserData = data;
									response($.map(rec, function(item) {
												return {
													label : item.userDesc,
													value :item.userDesc,
													code : item.userId,
													corpCode : item.userCorpDesc,
													recordKeyNo : item.recordKeyNo
												}
											}));
								}
							});
				},
				minLength : 1,
				select : function(event, selectedUser) {
						
						$.blockUI();
						$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
						css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
						
						var val = selectedUser.item.code;
						console.log("Selected User ID = " + val  + "Name - " + selectedUser.item.label);
						$('#copyFromUser').val(selectedUser.item.label);		
						userWorkingData.firstName=$('#firstName').val();
						userWorkingData.lastName=$('#lastName').val();
						userWorkingData.loginId=$('#loginId').val();
						userWorkingData.ssoLoginId = $('#ssoLoginId').val();
						userWorkingData.department= $('#department').val();
						userWorkingData.telephone= $('#telephone').val();
						userWorkingData.email= $('#email').val();
						userWorkingData.mobileNo= $('#mobileNo').val();
						
						userWorkingData.zipcode= $('#zipCode').val();
						userWorkingData.fax= $('#fax').val();
						userWorkingData.city= $('#city').val();
						
						userWorkingData.address.addressLine1 = $('#usrAddress').val();
			        	userWorkingData.address.zipCode = $('#zipCode').val();
			        	userWorkingData.address.fax = $('#fax').val();
			        	userWorkingData.address.city = $('#city').val();
			        	userWorkingData.address.countryId = $("#usrCountry").val(); 
			        	userWorkingData.address.usrState = $("#usrState").val(); 
						
						userWorkingData.usrRoleId = "";
						userWorkingData.usrCountry = $("#usrCountry").val();
						userWorkingData.activationDate = $('#activationDate' ).val();
						userWorkingData.usrState = $("#usrState").val();
						userWorkingData.usrLanguage = $("#usrLanguage :selected").text();
						userWorkingData.usrMfaTrigger = $("#usrMfaTrigger").val();
						userWorkingData.mfaTriggerDesc = $("#usrMfaTrigger :selected").text();
						
						//userWorkingData.loginId =  selectedUser.item.code;
						userWorkingData.srcUserId = selectedUser.item.code;
						userWorkingData.srcUserDesc = selectedUser.item.label;
						userWorkingData.srcUserComapany = selectedUser.item.corpCode;
						userWorkingData.copyFromFlag = true;
						userWorkingData.approvalMatrix = [];
						userWorkingData.subsidiaries = [];
						
						$.ajax({
					        url: "services/usersLookUpApi/userDetailsChangeSet/",
					        type: "POST",
					        data: {
					        	"userId" : userWorkingData.srcUserId,	
					        	"assetId" : "00" ,
					        	"recordKeyNo" : selectedUser.item.recordKeyNo,
					        	"corpId" : userWorkingData.corpId
					        },
					        async : false,
					    //    contentType: "application/json; charset=utf-8",
					        dataType: "json",
					        success: function (data) {
					        	commandVersion = data.commandVersion;
					        	userWorkingData.commandVersion = data.commandVersion;
								userCommand = [];
					        	
					        	//Copy Necessary Information From CopyUserDetails Command & remove it from userCommandBeans, so that it will not overwrite in merging 
					        	for(var i = 0; i < data.usrCommandBeans.length; i++){
				        	        
					        		if(data.usrCommandBeans[i].commandName == "CopyUserDetail") {

				        	        	userWorkingData.usrApprovalLevel = data.usrCommandBeans[i].kv.usrApprovalLevel;
				        	        	userWorkingData.isTemplateOnly = data.usrCommandBeans[i].kv.isTemplateOnly;
				        	        	userWorkingData.superUser = data.usrCommandBeans[i].kv.superUser;
				        	        	userWorkingData.allowConfidential = data.usrCommandBeans[i].kv.allowConfidential;
										userWorkingData.disableReject = data.usrCommandBeans[i].kv.disableReject;
				        	        	userWorkingData.requireMFA = data.usrCommandBeans[i].kv.requireMFA;
				        	        	/*userWorkingData.usrMobileEnble = data.usrCommandBeans[i].kv.usrMobileEnble;*/
				        	        	userWorkingData.corpId = data.usrCommandBeans[i].kv.corpId;
				        	        	userWorkingData.usrClient = data.usrCommandBeans[i].kv.usrClient;
				        	        	/*userWorkingData.rdcFlag = data.usrCommandBeans[i].kv.rdcFlag;
				        	        	userWorkingData.rdcUserKey = data.usrCommandBeans[i].kv.rdcUserKey;*/
										userWorkingData.recordKeyNo = data.usrCommandBeans[i].kv.recordKeyNo;
										userWorkingData.srcCorpId =  data.usrCommandBeans[i].kv.srcCorpId;
										userWorkingData.srcLoginId = data.usrCommandBeans[i].kv.srcLoginId;
										userWorkingData.srcRoleId = data.usrCommandBeans[i].kv.srcRoleId;

				        	        }else if(data.usrCommandBeans[i].commandName == "SwitchUserRole"){
				        	        	userCommand.push(data.usrCommandBeans[i]);
				        	        }else if(data.usrCommandBeans[i].commandName == "AddUserSubsidiary" || data.usrCommandBeans[i].commandName == "RemoveUserSubsidiary"){
				        	        	subsidiaryStore.push(data.usrCommandBeans[i]);
				        	        }else if(data.usrCommandBeans[i].commandName == "AddApprovalMatrix" || data.usrCommandBeans[i].commandName == "RemoveApprovalMatrix"){
				        	        	authMatrixStore.push(data.usrCommandBeans[i]);
				        	        }		
					        		data.usrCommandBeans.splice(i,1);
			        	            i--; // Prevent skipping an item
					        	 }
					        	
					        	$.each(TT_UserAppItem.getDetailStore(), function(index, item) {
					       			CommonUserObj.updateUserDetailsuserWorkingData(item);
					        	});
					        	userWorkingData.recordKeyNo = null;
					        	userWorkingData.loginId=$('#loginId').val();
					        },
					        error: function () {
					            $('#errorDiv').removeClass('hidden');
					        	$('#errorPara').text("An error has occured!!!");
					        	$.unblockUI();
					        	if(event)
						            event.preventDefault();
					        }
					    });	
						UsersApp.trigger('renderUserDetails', userWorkingData);		
						$.unblockUI();
				},
				open : function() {
					$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
				},
				close : function() {
					$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
				}
			});/*.data("autocomplete")._renderItem = function(ul, item) {
				var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:100px;" class="inline">'
						+ item.label
						+ '</ul><ul style="width:200px;font-size:0.8em;color:#06C;" class=inline>'
						+ ' </ul></ol></a>';					
				return $("<li></li>").data("item.autocomplete", item)
						.append(inner_html).appendTo(ul);
			};*/
		});
	};
	
	UsersApp.bind('CreateUserDetail', UserDetails.createUserDetails);	
	UsersApp.bind('CopyUserDetail', UserDetails.copyUserDetail);
	UsersApp.bind('UpdateUserDetail', UserDetails.updateUserDetails);
	
	UsersApp.bind('SwitchUserRole', UserDetails.renderRole);
	UsersApp.bind('UpdateCountry', UserDetails.renderState);
	UsersApp.bind('SaveUser', UserDetails.saveUser);
	
	UsersApp.bind('AddUserSubsidiary', UserDetails.addSubsidiary);
	UsersApp.bind('RemoveUserSubsidiary', UserDetails.removeSubsidiary);	
	
	UsersApp.bind('AddApprovalMatrix', UserDetails.addApprovalMatrix);
	UsersApp.bind('RemoveApprovalMatrix', UserDetails.removeApprovalMatrix);
	UsersApp.bind('ApplyAllApprovalMatrix', UserDetails.applyAllApprovalMatrix);
	UsersApp.bind('RemoveAllApprovalMatrix', UserDetails.removeAllApprovalMatrix);
	
	
})(jQuery);
