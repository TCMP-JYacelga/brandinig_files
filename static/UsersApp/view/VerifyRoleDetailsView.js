/*global jQuery, RoleDetails */

(function ($) {
	'use strict';
	var tempGranPriv= [];
	var isGran = false;
	var Verify = {
		elem : {
			usersapp : '#verifyRoleDetail'
			
		},
		render : function () {
			var loadOptions;
			var roleDtlViewFromUser = 'N';
			var roleId = userWorkingData.usrRoleId;
			var corpId = userWorkingData.corpId;

			var strRegex =  /[?&]([^=#]+)=([^&#]*)/g,objParam = {},arrMatches = [];
			while (arrMatches = strRegex.exec(window.location.hash)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
			
			if(objParam.roleDtlViewFromUser){
				roleDtlViewFromUser = objParam.roleDtlViewFromUser;
			}
			if(objParam.roleId || objParam.corpId){
				loadOptions =  {
	                type: 'POST', 
	                cache : false,
	                aync : false,
	                dataType: 'json',
	                data: {
	                	"roleId" : objParam.roleId,
	                	"corpId" : objParam.corpId
	                }
				};
				
				/*if (window.prevMode != "view")
					mode = "view";*/
				
			}else{
				loadOptions =  {
							type: 'POST', 
			                cache : false,
			                aync : false,
			                dataType: 'json',
			                data: {
			                	"roleId" : roleId,
			                	"corpId" : corpId
			                }
	            };
			}
			
			
			console.log(" rendering Verify ");
			
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			this.load("services/rolesApi",loadOptions).then(
			function(data){
					workingData = data;
					var isFunction = false;
			       
			       
		        workingData.mode = mode;
		        workingData.prevMode = window.prevMode;
		        
		        if (workingData.mode != "viewChanges")
		        {
		        // Remove Unnecessary Data from JSON
		        $.each(workingData.assets,function(index,asset){
		        	
		        	if(asset.allowedFeatures){
		        		 for(var i = 0; i < asset.allowedFeatures.length; i++){
			        	        if(!asset.allowedFeatures[i].assignedFlag) {
			        	        	asset.allowedFeatures.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	
		        	if(asset.widgets){
		        		 for(var i = 0; i < asset.widgets.length; i++){
			        	        if(!asset.widgets[i].assignedFlag) {
			        	        	asset.widgets.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	
		        	
		        	if(asset.reports){
		        		 for(var i = 0; i < asset.reports.length; i++){
			        	        if(!asset.reports[i].assignedFlag) {
			        	        	asset.reports.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	if(asset.bankReports){
		        		 for(var i = 0; i < asset.bankReports.length; i++){
			        	        if(!asset.bankReports[i].assignedFlag) {
			        	        	asset.bankReports.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	if(asset.notionalAgreements){
		        		 for(var i = 0; i < asset.notionalAgreements.length; i++){
			        	        if(!asset.notionalAgreements[i].assignedFlag) {
			        	        	asset.notionalAgreements.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	if(asset.sweepAgreements){
		        		 for(var i = 0; i < asset.sweepAgreements.length; i++){
			        	        if(!asset.sweepAgreements[i].assignedFlag) {
			        	        	asset.sweepAgreements.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	
		        	if(asset.permissions){
		        		 for(var i = 0; i < asset.permissions.length; i++){
			        	        if(!asset.permissions[i].auth && !asset.permissions[i].edit 
			        	        		&& !asset.permissions[i].execute && !asset.permissions[i].view) {
			        	        	asset.permissions.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	
		        	/************* GRANULAR PERMISSION REMOVAL ******************************************/
		        	//TODO - NEED TO OPTIMIZE LOGIC
		        	if(asset.granularPermission.payments){
		        		for(var j=0;j<workingData.granPrivileges.length; j++){
		        			if( (workingData.granPrivileges[j].granularPrivilegeId == asset.assetId)
		        					&& workingData.granPrivileges[j].assignedFlag){
				        				for(var i = 0; i < asset.granularPermission.payments.length; i++){
						        	        if(asset.granularPermission.payments[i].mask == "000000000") {
						        	        	asset.granularPermission.payments.splice(i,1);
						        	            i--; // Prevent skipping an item
						        	        }
						        	  }
		        			}else{
		        				if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        					asset.granularPermission.payments = [];
		        				}
		        			}
		        		}
		        	}
		        	
		        	if(asset.granularPermission.standingInsts){
		        		for(var j=0;j<workingData.granPrivileges.length; j++){
		        			if( (workingData.granPrivileges[j].granularPrivilegeId == asset.assetId)
		        					&& workingData.granPrivileges[j].assignedFlag){
				        				for(var i = 0; i < asset.granularPermission.standingInsts.length; i++){
						        	        if(asset.granularPermission.standingInsts[i].mask == "00000") {
						        	        	asset.granularPermission.standingInsts.splice(i,1);
						        	            i--; // Prevent skipping an item
						        	        }
						        	  }
		        			}else{
		        				if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        					asset.granularPermission.standingInsts = [];
		        				}
		        			}
		        		}
		        	}
		        	
		        	if(asset.granularPermission.reversals){
		        		for(var j=0;j<workingData.granPrivileges.length; j++){
		        			if( (workingData.granPrivileges[j].granularPrivilegeId == asset.assetId)
		        					&& workingData.granPrivileges[j].assignedFlag){
				        				for(var i = 0; i < asset.granularPermission.reversals.length; i++){
						        	        if(asset.granularPermission.reversals[i].mask == "000") {
						        	        	asset.granularPermission.reversals.splice(i,1);
						        	            i--; // Prevent skipping an item
						        	        }
						        	  }
		        			}else{
		        				if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        					asset.granularPermission.reversals = [];
		        				}
		        			}
		        		}
		        	}
		        	
		        	if(asset.granularPermission.templates){
		        		for(var j=0;j<workingData.granPrivileges.length; j++){
		        			if( (workingData.granPrivileges[j].granularPrivilegeId == asset.assetId)
		        					&& workingData.granPrivileges[j].assignedFlag){
				        				for(var i = 0; i < asset.granularPermission.templates.length; i++){
						        	        if(asset.granularPermission.templates[i].mask.substring(3,21) == "000000000000000000") {
						        	        	asset.granularPermission.templates.splice(i,1);
						        	            i--; // Prevent skipping an item
						        	        }
						        	  }
		        			}else{
		        				if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        					asset.granularPermission.templates = [];
		        				}
		        			}
		        		}
		        	}
		        	
		        	if(asset.granularPermission.balanceRpts){
		        		for(var j=0;j<workingData.granPrivileges.length;j++){
		        			if( (workingData.granPrivileges[j].granularPrivilegeId == asset.assetId)
		        					&& workingData.granPrivileges[j].assignedFlag){
				        				for(var i = 0; i < asset.granularPermission.balanceRpts.length; i++){
						        	        if(asset.granularPermission.balanceRpts[i].mask == "0000000000") {
						        	        	asset.granularPermission.balanceRpts.splice(i,1);
						        	            i--; // Prevent skipping an item
						        	        }
						        	  }
		        			}else{
		        				if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        					asset.granularPermission.balanceRpts = [];
		        				}
		        			}
		        		}
		        	}
		        	
		        	
		        	if(asset.granularPermission.loans){
		        		for(var j=0;j<workingData.granPrivileges.length;j++){
		        			if( (workingData.granPrivileges[j].granularPrivilegeId == asset.assetId)
		        					&& workingData.granPrivileges[j].assignedFlag){
				        				for(var i = 0; i < asset.granularPermission.loans.length; i++){
						        	        if(asset.granularPermission.loans[i].mask == "000000000000000") {
						        	        	asset.granularPermission.loans.splice(i,1);
						        	            i--; // Prevent skipping an item
						        	        }
						        	  }
		        			}else{
		        				if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        					asset.granularPermission.loans = [];
		        				}
		        			}
		        		}
		        	}
		        	
		        	

		        	if(asset.granularPermission.checks){
		        		for(var j=0;j<workingData.granPrivileges.length;j++){
		        			if( (workingData.granPrivileges[j].granularPrivilegeId == asset.assetId)
		        					&& workingData.granPrivileges[j].assignedFlag){
				        				for(var i = 0; i < asset.granularPermission.checks.length; i++){
						        	        if(asset.granularPermission.checks[i].mask == "000000000") {
						        	        	asset.granularPermission.checks.splice(i,1);
						        	            i--; // Prevent skipping an item
						        	        }
						        	  }
		        			}else{
		        				if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        					asset.granularPermission.checks = [];
		        				}
		        			}
		        		}
		        	}
		        	

		        	if(asset.granularPermission.positivePays){
		        		for(var j=0;j<workingData.granPrivileges.length;j++){
		        			if( (workingData.granPrivileges[j].granularPrivilegeId == asset.assetId)
		        					&& workingData.granPrivileges[j].assignedFlag){
				        				for(var i = 0; i < asset.granularPermission.positivePays.length; i++){
						        	        if(asset.granularPermission.positivePays[i].mask == "0000000000") {
						        	        	asset.granularPermission.positivePays.splice(i,1);
						        	            i--; // Prevent skipping an item
						        	        }
						        	  }
		        			}else{
		        				if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        					asset.granularPermission.positivePays = [];
		        				}
		        			}
		        		}
		        	}
		        	/************* GRANULAR PERMISSION REMOVAL END******************************************/
		        	
		        	if(asset.interfaces){
		        		 for(var i = 0; i < asset.interfaces.length; i++){
			        	        if(!asset.interfaces[i].edit && !asset.interfaces[i].execute) {
			        	        	asset.interfaces.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	
		        	if(asset.packages){
		        		 for(var i = 0; i < asset.packages.length; i++){
			        	        if(!asset.packages[i].assignedFlag) {
			        	        	asset.packages.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	
		        	if(asset.messages){
		        		 for(var i = 0; i < asset.messages.length; i++){
			        	        if(!asset.messages[i].assignedFlag) {
			        	        	asset.messages.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	
		        	
		        	if(asset.accounts){
		        		 for(var i = 0; i < asset.accounts.length; i++){
			        	        if(!asset.accounts[i].assignedFlag) {
			        	        	asset.accounts.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	
		        	
		        	if(asset.alerts){
		        		 for(var i = 0; i < asset.alerts.length; i++){
			        	        if(!asset.alerts[i].assignedFlag) {
			        	        	asset.alerts.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	if(asset.companyIds){
		        		 for(var i = 0; i < asset.companyIds.length; i++){
			        	        if(!asset.companyIds[i].assignedFlag) {
			        	        	asset.companyIds.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        });
		        
		        }
		        else
		        {
		        	$.each(workingData.assets,function(index,asset){
		        		if(asset.permissions){
		        		 for(var i = 0; i < asset.permissions.length; i++){
			        	        if(!asset.permissions[i].auth && !asset.permissions[i].edit 
			        	        		&& !asset.permissions[i].execute && !asset.permissions[i].view && null == asset.permissions[i].colorClass) {
			        	        	asset.permissions.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        		}
		        		
		        		if(asset.interfaces){
		        		 for(var i = 0; i < asset.interfaces.length; i++){
			        	        if(!asset.interfaces[i].auth && !asset.interfaces[i].edit 
			        	        		&& !asset.interfaces[i].execute && !asset.interfaces[i].view && null == asset.interfaces[i].colorClass) {
			        	        	asset.interfaces.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        		}
		        		
		        		if(asset.granularPermission.balanceRpts){
		        		for(var j=0;j<workingData.granPrivileges.length;j++){
		        			if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        				for(var i = 0; i < asset.granularPermission.balanceRpts.length; i++){
				        	        if(asset.granularPermission.balanceRpts[i].mask == "0000000000" && null == asset.granularPermission.balanceRpts[i].colorClass) {
				        	        	asset.granularPermission.balanceRpts.splice(i,1);
				        	            i--; // Prevent skipping an item
				        	        }
				        	  }
		        			}
		        		}
		        	}
		        	
		        	if(asset.granularPermission.payments){
		        		for(var j=0;j<workingData.granPrivileges.length;j++){
		        			if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        				for(var i = 0; i < asset.granularPermission.payments.length; i++){
				        	        if(asset.granularPermission.payments[i].mask == "000000000" && null == asset.granularPermission.payments[i].colorClass) {
				        	        	asset.granularPermission.payments.splice(i,1);
				        	            i--; // Prevent skipping an item
				        	        }
				        	  }
		        			}
		        		}
		        	}
		        	
		        	
		        	if(asset.granularPermission.standingInsts){
		        		for(var j=0;j<workingData.granPrivileges.length;j++){
		        			if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        				for(var i = 0; i < asset.granularPermission.standingInsts.length; i++){
				        	        if(asset.granularPermission.standingInsts[i].mask == "00000" && null == asset.granularPermission.standingInsts[i].colorClass) {
				        	        	asset.granularPermission.standingInsts.splice(i,1);
				        	            i--; // Prevent skipping an item
				        	        }
				        	  }
		        			}
		        		}
		        	}
		        	
		        	
		        	if(asset.granularPermission.reversals){
		        		for(var j=0;j<workingData.granPrivileges.length;j++){
		        			if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        				for(var i = 0; i < asset.granularPermission.reversals.length; i++){
				        	        if(asset.granularPermission.reversals[i].mask == "000" && null == asset.granularPermission.reversals[i].colorClass) {
				        	        	asset.granularPermission.reversals.splice(i,1);
				        	            i--; // Prevent skipping an item
				        	        }
				        	  }
		        			}
		        		}
		        	}
		        	
		        	if(asset.granularPermission.templates){
		        		for(var j=0;j<workingData.granPrivileges.length;j++){
		        			if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        				for(var i = 0; i < asset.granularPermission.templates.length; i++){
				        	        if(asset.granularPermission.templates[i].mask.substring(3,21) == "000000000000000000" && null == asset.granularPermission.templates[i].colorClass) {
				        	        	asset.granularPermission.templates.splice(i,1);
				        	            i--; // Prevent skipping an item
				        	        }
				        	  }
		        			}
		        		}
		        	}
		        	
		        	if(asset.granularPermission.loans){
		        		for(var j=0;j<workingData.granPrivileges.length;j++){
		        			if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        				for(var i = 0; i < asset.granularPermission.loans.length; i++){
				        	        if(asset.granularPermission.loans[i].mask == "000000000000000" && null == asset.granularPermission.loans[i].colorClass) {
				        	        	asset.granularPermission.loans.splice(i,1);
				        	            i--; // Prevent skipping an item
				        	        }
				        	  }
		        			}
		        		}
		        	}
		        	
		        	if(asset.granularPermission.checks){
		        		for(var j=0;j<workingData.granPrivileges.length;j++){
		        			if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        				for(var i = 0; i < asset.granularPermission.checks.length; i++){
				        	        if(asset.granularPermission.checks[i].mask == "000000000" && null == asset.granularPermission.checks[i].colorClass) {
				        	        	asset.granularPermission.checks.splice(i,1);
				        	            i--; // Prevent skipping an item
				        	        }
				        	  }
		        			}
		        		}
		        	}
		        	
		        	if(asset.granularPermission.positivePays){
		        		for(var j=0;j<workingData.granPrivileges.length;j++){
		        			if(workingData.granPrivileges[j].granularPrivilegeId == asset.assetId){
		        				for(var i = 0; i < asset.granularPermission.positivePays.length; i++){
				        	        if(asset.granularPermission.positivePays[i].mask == "0000000000" && null == asset.granularPermission.positivePays[i].colorClass) {
				        	        	asset.granularPermission.positivePays.splice(i,1);
				        	            i--; // Prevent skipping an item
				        	        }
				        	  }
		        			}
		        		}
		        	}
		        	
		        	});
		        }
		        
		         for(var iTemp=0; iTemp < workingData.assets.length; iTemp++){
			        if( (workingData.assets[iTemp].allowedFeatures ? (workingData.assets[iTemp].allowedFeatures.length > 0 ? 
			        	((workingData.assets[iTemp].assetId !="04" && workingData.assets[iTemp].assetId !="05" && workingData.assets[iTemp].assetId != "06" && workingData.assets[iTemp].assetId != "10") ? true: false) : false) : false) ||
			        	(workingData.assets[iTemp].reports ? (workingData.assets[iTemp].reports.length > 0 ? true : false) : false) || 
			        	(workingData.assets[iTemp].widgets ? (workingData.assets[iTemp].widgets.length > 0 ? true : false) : false) ||
			        	(workingData.assets[iTemp].alerts ? (workingData.assets[iTemp].alerts.length > 0 ? true : false) : false) ||
			        	(workingData.assets[iTemp].messages ? (workingData.assets[iTemp].messages.length > 0 ? true : false) : false) ||
			        	(workingData.assets[iTemp].companyIds ? (workingData.assets[iTemp].companyIds.length > 0 ? true : false) : false) ||
			        	(workingData.assets[iTemp].packages ? (workingData.assets[iTemp].packages.length > 0 ? true : false) : false) ||
			        	(workingData.assets[iTemp].notionalAgreements ? (workingData.assets[iTemp].notionalAgreements.length > 0 ? true : false) : false) ||
			        	(workingData.assets[iTemp].sweepAgreements ? (workingData.assets[iTemp].sweepAgreements.length > 0 ? true : false) : false) ||
			        	(workingData.assets[iTemp].templates ? (workingData.assets[iTemp].templates.length > 0 ? true : false) : false)){
							workingData.assets[iTemp].isFunction = true;
					}else
						workingData.assets[iTemp].isFunction = false;
				}
		    
		         workingData.granPrivileges.sort(function(a, b) {
	      		  var nameA = a.granularPrivilegeName.toUpperCase(); // ignore upper and lowercase
	      		  var nameB = b.granularPrivilegeName.toUpperCase(); // ignore upper and lowercase
	      		  if (nameA < nameB) {
	      		    return -1;
	      		  }
	      		  if (nameA > nameB) {
	      		    return 1;
	      		  }

	      		  // names must be equal
	      		  return 0;
	      		});
		         workingData.services.sort(function(a, b) {
		      		  var nameA = a.serviceName.toUpperCase(); // ignore upper and lowercase
		      		  var nameB = b.serviceName.toUpperCase(); // ignore upper and lowercase
		      		  if (nameA < nameB) {
		      		    return -1;
		      		  }
		      		  if (nameA > nameB) {
		      		    return 1;
		      		  }

		      		  // names must be equal
		      		  return 0;
		      		});
		         
		        if(mode == "new" || mode == "edit")
		        	workingData.isVerify = true; 
		         
		        
		        $.each(workingData.granPrivileges,function(index,grItem){
		        	if(grItem.assignedFlag){
		        		isGran = true;
		        		return false;
		        	}else{
		        		isGran = false;
		        	}
		        });
		        
		        if(!isGran){
		        	tempGranPriv = workingData.granPrivileges;
		        	workingData.granPrivileges = [];
		        }
		        
				this.render('static/RolesApp/templates/Verify.hbs',workingData,'',{
					VerifyRoleDetails:'static/RolesApp/templates/VerifyRoleDetails.hbs',
					VerifyAdminServicePanel:'static/RolesApp/templates/VerifyAdminServicePanel.hbs',
					VerifyBRPanel:'static/RolesApp/templates/VerifyBRPanel.hbs',
					VerifyPaymentsPanel:'static/RolesApp/templates/VerifyPaymentsPanel.hbs',
					VerifyImagingPanel:'static/RolesApp/templates/VerifyImagingPanel.hbs',
					VerifyLoansPanel:'static/RolesApp/templates/VerifyLoansPanel.hbs',
					VerifyPositivePayPanel:'static/RolesApp/templates/VerifyPositivePayPanel.hbs',
					VerifyCheckManagementPanel:'static/RolesApp/templates/VerifyCheckManagementPanel.hbs',
					VerifyBankReportsPanel:'static/RolesApp/templates/VerifyBankReportsPanel.hbs',
					VerifyLiquidityPanel:'static/RolesApp/templates/VerifyLiquidityPanel.hbs',
					VerifyForecastPanel:'static/RolesApp/templates/VerifyForecastPanel.hbs',
					VerifySCFPanel:'static/RolesApp/templates/VerifySupplyChainPanel.hbs',
					VerifyPortalPanel:'static/RolesApp/templates/VerifyPortalPanel.hbs',
					VerifyReceivablesPanel:'static/RolesApp/templates/VerifyReceivablesPanel.hbs',
					VerifyMobileBankingPanel:'static/RolesApp/templates/VerifyMobileBankingPanel.hbs',
					VerifySubAccountsPanel:'static/RolesApp/templates/VerifySubAccountsServicePanel.hbs',
					VerifyTPFAPanel:'static/RolesApp/templates/VerifyTPFAPanel.hbs'
					}).then(function () {
					
					$.unblockUI();
					var userApp = $(Verify.elem.usersapp);
					userApp.html(this.content);
				//	$("html,body").scrollTop(0);
					Verify.hideShowGranColumn();
					if(!isGran)
						workingData.granPrivileges = tempGranPriv;
					for(var i=workingData.services.length-1; i>=0; i--){
						if(workingData.services[i].assignedFlag){
							var backAsset = workingData.services[i].serviceName.replace(/ /g, '');
							if(backAsset == "Receivables")
								backAsset = "Collection";
							
							$('#verifyBack').attr('href', '#/'+backAsset);
							break;
						}
					}
					
					//$('.ft-layout-header').empty()
					$('div#PageTitle').prependTo('.ft-layout-header');
					$('span.ft-title').prependTo('#PageTitle');
					$('.ft-layout-header').removeAttr( 'style' );
					$('.fa-refresh').hide();
					$('.t-update-text').hide();
					
						$('div#PageTitle').hide();
						$('div#viewChangesId').hide();
						$('div#footer').hide();
					
					
					//RolesApp.trigger('verifyInit');
				});
			});
			var buttonsOpts = {};
			buttonsOpts[CommonUser.getLabel('lbl.clientuser.btnOk','Ok')] = function() {
				$(this).dialog("close");
			};
			
			$('#verifyRoleDetail').dialog({
					autoOpen : false,
					title: CommonUser.getLabel('lbl.clientUser.roleDetails','Role Details'),
					height : 580,
					width : 840,
					modal : true,
					resizable: false,
					draggable: false,
					open: function() {
					
					},
					buttons : buttonsOpts 
						
					
				});
				$('#verifyRoleDetail').dialog("open");
		},
		
		hideShowGranColumn : function(){
			//Hide/Show Granular Panel Columns
			$.each(workingData.assets,function(index,asset){
				
				if(asset.assetId == "01"){ //BR
					$.each(asset.permissions,function(index,permission){
						if(permission.view){
							
							if(grBRColumnMap[permission.featureId]){
								var colIds = grBRColumnMap[permission.featureId].split(',');
								$.each(colIds,function(index,colId){
									$('#grBRColHdr_' + colId).removeClass('hidden');
									var elem = $('td[id^="chkGranView_01_' + colId + '_"]');
								
									$.each(elem,function(index,item){
										$(this).removeClass('hidden');
									});
								});
							}
						}
					});
				}else if(asset.assetId == "02"){ //Payment
					
					var tempColIds = [];
					var semRepFlag = false,repFlag=false,nonRepFlag=false;
					$.each(asset.allowedFeatures,function(index,feature){
						
						if(feature.featureId == "repetitiveFlag"){
							if(feature.assignedFlag)
								repFlag = true;
							else
								repFlag = false;
						}
						
						if(feature.featureId == "semiRepetitiveFlag"){
							if(feature.assignedFlag)
								semRepFlag = true;
							else
								semRepFlag = false;
						}
						
						if(feature.featureId == "nonRepetitiveFlag"){
							if(feature.assignedFlag)
								nonRepFlag = true;
							else
								nonRepFlag = false;
						}
					});
					
					$.each(asset.permissions,function(index,permission){
						if(grPaymentColumnMap.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
							var colIds = [];
							var colObj = grPaymentColumnMap[permission.featureId+"-"+permission.screenWeight];
							
							if(permission.view && colObj.hasOwnProperty("view"))
								colIds.push(colObj.view);
							
							if(permission.edit && colObj.hasOwnProperty("edit"))
								colIds.push(colObj.edit);
							
							if(permission.auth && colObj.hasOwnProperty("auth"))
								colIds.push(colObj.auth);
							
							
							$.each(colIds,function(index,colId){
								$('#grPayColHdr_' + colId).removeClass('hidden');
								var elem = $('td[id^="chkPayGranView_02_' + colId + '_"]');
							
								$.each(elem,function(index,item){
									$(this).removeClass('hidden');
								});
							});
						}						
						
						
						if(grSIColumnMap.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
							var colIds = [];
							var colObj = grSIColumnMap[permission.featureId+"-"+permission.screenWeight];
							
							if(permission.view && colObj.hasOwnProperty("view"))
								colIds.push(colObj.view);
							
							if(permission.edit && colObj.hasOwnProperty("edit"))
								colIds.push(colObj.edit);
							
							if(permission.auth && colObj.hasOwnProperty("auth"))
								colIds.push(colObj.auth);
							
							$.each(colIds,function(index,colId){
								$('#grSIColHdr_' + colId).removeClass('hidden');
								var elem = $('td[id^="chkSIGranView_02_' + colId + '_"]');
							
								$.each(elem,function(index,item){
									$(this).removeClass('hidden');
								});
							});
						}						
						
								
						if(grReversalColumnMap.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
							var colIds = [];
							var colObj = grReversalColumnMap[permission.featureId+"-"+permission.screenWeight];
							
							if(permission.view && colObj.hasOwnProperty("view"))
								colIds.push(colObj.view);
							
							if(permission.edit && colObj.hasOwnProperty("edit"))
								colIds.push(colObj.edit);
							
							if(permission.auth && colObj.hasOwnProperty("auth"))
								colIds.push(colObj.auth);
							$.each(colIds,function(index,colId){
								$('#grRevColHdr_' + colId).removeClass('hidden');
								var elem = $('td[id^="chkRevGranView_02_' + colId + '_"]');
							
								$.each(elem,function(index,item){
									$(this).removeClass('hidden');
								});
							});
						}
						
						if(grTemplateColumnMap.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
							var colObj = grTemplateColumnMap[permission.featureId+"-"+permission.screenWeight];
							if(permission.view && colObj.hasOwnProperty("view")){
								var colPos = colObj.view.split(',');
								$.each(colPos,function(index,pos){
									if(tempColIds.indexOf(pos) == -1)
										tempColIds.push(pos);
								});
							}
							
							if(permission.edit && colObj.hasOwnProperty("edit")){
								var colPos = colObj.edit.split(',');
								$.each(colPos,function(index,pos){
									if(tempColIds.indexOf(pos) == -1)
										tempColIds.push(pos);
								});
							}
							
							if(permission.auth && colObj.hasOwnProperty("auth")){
								var colPos = colObj.auth.split(',');
								$.each(colPos,function(index,pos){
									if(tempColIds.indexOf(pos) == -1)
										tempColIds.push(pos);
								});
							}
						}
					});
					
					if(tempColIds.length > 0){
						var semRepColSpanCnt = 0,repColSpanCnt=0,nonRepColSpanCnt=0;
						
						$.each(tempColIds,function(index,colId){
							if(repFlag && (colId == "3" || colId == "4" || colId == "5" || colId == "6" || colId == "7" || colId == "8")){
								repColSpanCnt++;
								$('#hdrType_' + colId).removeClass('hidden');
								var elem = $('td[id^="chkTemplateGran_02_' + colId + '_"]');
								
								$.each(elem,function(index,item){
									$(this).removeClass('hidden');
								});							
							}
							
							if(semRepFlag &&  (colId == "9" || colId == "10" || colId == "11" || colId == "12" || colId == "13" || colId == "14")){
								semRepColSpanCnt++;
								$('#hdrType_' + colId).removeClass('hidden');
								var elem = $('td[id^="chkTemplateGran_02_' + colId + '_"]');
							
								$.each(elem,function(index,item){
									$(this).removeClass('hidden');
								});							
							}
							
							if(nonRepFlag &&  (colId == "15" || colId == "16" || colId == "17" || colId == "18" || colId == "19" || colId == "20")){
								nonRepColSpanCnt++;
								$('#hdrType_' + colId).removeClass('hidden');
								var elem = $('td[id^="chkTemplateGran_02_' + colId + '_"]');
							
								$.each(elem,function(index,item){
									$(this).removeClass('hidden');
								});							
							}
						});
						
						if(repFlag && repColSpanCnt > 1){
							$('#repHdr').removeClass('hidden');
							$('#repHdr').attr('colspan',repColSpanCnt);
						}
						
						if(semRepFlag && semRepColSpanCnt > 1){
							$('#semRepHdr').removeClass('hidden');
							$('#semRepHdr').attr('colspan',semRepColSpanCnt);
						}
						
						if(nonRepFlag && nonRepColSpanCnt > 1){
							$('#nonRepHdr').removeClass('hidden');
							$('#nonRepHdr').attr('colspan',nonRepColSpanCnt);
						}
					}
					
				}else if(asset.assetId == "07"){ //Loan

					$.each(asset.permissions,function(index,permission){
						var colIds = [];
						
						if(grLoanColumnMap.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
							
							var colObj = grLoanColumnMap[permission.featureId+"-"+permission.screenWeight];
							
							if(permission.view && colObj.hasOwnProperty("view"))
								colIds.push(colObj.view);
							
							if(permission.edit && colObj.hasOwnProperty("edit"))
								colIds.push(colObj.edit);
							
							if(permission.auth && colObj.hasOwnProperty("auth"))
								colIds.push(colObj.auth);
						}						
						
						$.each(colIds,function(index,colId){
							$('#grLoanColHdr_' + colId).removeClass('hidden');
							var elem = $('td[id^="chkGranView_07_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).removeClass('hidden');
							});
						});
					});
				
					
				}else if(asset.assetId == "13"){ //PositivePay

					$.each(asset.permissions,function(index,permission){
						var colIds = [];
						
						if(grPPColumnMap.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
							
							var colObj = grPPColumnMap[permission.featureId+"-"+permission.screenWeight];
							
							if(permission.view && colObj.hasOwnProperty("view"))
								colIds.push(colObj.view);
							
							if(permission.edit && colObj.hasOwnProperty("edit"))
								colIds.push(colObj.edit);
							
							if(permission.auth && colObj.hasOwnProperty("auth"))
								colIds.push(colObj.auth);
						}						
						
								
						$.each(colIds,function(index,colId){
							$('#grPPColHdr_' + colId).removeClass('hidden');
							var elem = $('td[id^="chkGranView_13_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).removeClass('hidden');
							});
						});
					});
				
				}else if(asset.assetId == "14"){ //Check Management

					$.each(asset.permissions,function(index,permission){
						var colIds = [];
						
						if(grCheckColumnMap.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
							
							var colObj = grCheckColumnMap[permission.featureId+"-"+permission.screenWeight];
							
							if(permission.view && colObj.hasOwnProperty("view"))
								colIds.push(colObj.view);
							
							if(permission.edit && colObj.hasOwnProperty("edit"))
								colIds.push(colObj.edit);
							
							if(permission.auth && colObj.hasOwnProperty("auth"))
								colIds.push(colObj.auth);
						}						
						
								
						$.each(colIds,function(index,colId){
							$('#grCheckColHdr_' + colId).removeClass('hidden');
							var elem = $('td[id^="chkGranView_14_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).removeClass('hidden');
							});
						});
					});
				}
			});	
		}
	};

	UsersApp.bind('renderRoleDetailsVerify', Verify.render);

})(jQuery);
