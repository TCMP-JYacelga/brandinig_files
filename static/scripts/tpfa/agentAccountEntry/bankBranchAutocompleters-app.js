var objBankAutoCompleter = null;
var objBranchAutoCompleter = null;
Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});

Ext
		.application({
			name : 'GCP',
			appFolder : 'static/scripts/tpfa/agentSetupSummary/app',		
			controllers : [],
			requires : [ 'Ext.ux.gcp.AutoCompleter' ],
			launch : function() {
				
				var disabledFlag = false;		
				
				var fieldGreyClass = 'xn-form-text w14 xn-suggestion-box';
				if (pageMode == "VIEW") {
					fieldGreyClass  ='xn-form-text w14 xn-suggestion-box grey'
				}
				objBankAutoCompleter = Ext.create('Ext.ux.gcp.AutoCompleter',
						{
							padding : '1 0 0 2',
							name : 'bankItemId',
							itemId : 'bankItemId',
							fieldCls : fieldGreyClass,
							cfgUrl : 'services/userseek/{0}.json',
							cfgProxyMethodType : 'POST',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'tpfaBankList',
							cfgRootNode : 'd.preferences',
							disabled : pageMode == "VIEW"||autoOnboardFlag == "Y",
							cfgDataNode1 : 'DESCR',
							cfgKeyNode : 'CODE',							
							renderTo : 'accountBankDiv',
							cfgExtraParams : 
								[ 
								  {
					                	key : '$filtercode1',
						            	value : $('#sellerId').val()
						             }						            
								 ],
							listeners : {
								'select' : function( combo, record, index )
								{
									document.getElementById( "accountBankCode" ).value = record[0].raw.CODE;
									setDirtyBit();
								},
								'change' : function( combo, record, index )
								{
									if(combo.value == ''|| combo.value == null) 
									   {
										document.getElementById( "accountBankCode" ).value = "";
									   }
								}
							}
						});
				//Get the Profile Desc
				
				if(null != document.getElementById( "accountBankCode" ).value && "" !=  document.getElementById( "accountBankCode" ).value ) {
					
					Ext.Ajax.request 
				    ({ 
				        url: 'cpon/agentAccount/bankDesc.json', 
				        method: 'POST', 
				        params:  
				        { 
				        	bankKey:document.getElementById( "accountBankCode" ).value,
				        	sellerId : document.getElementById("sellerId").value
				        }, 
				        success: function(response) 
				        { 
				        	var objJson = null;				        									       
			        		objJson = Ext.decode(response.responseText);
			        		if (objJson.d.filter[0]) {				
									objBankAutoCompleter.setValue(objJson.d.filter[0].name);													
								}			        	
				        	
				        }, 
				        failure: function(response) 
				        { 
				            console.log(response.responseText); 
				        } 
				         
				    }) ;			
				}			
				
				objBranchAutoCompleter = Ext.create('Ext.ux.gcp.AutoCompleter',
						{
							padding : '1 0 0 2',
							name : 'branchItemId',
							itemId : 'branchItemId',
							fieldCls :fieldGreyClass,
							cfgUrl : 'services/userseek/{0}.json',
							cfgProxyMethodType : 'POST',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'tpfaBranchList',
							cfgRootNode : 'd.preferences',
							//disabled : pageMode == "VIEW" ||autoOnboardFlag == "Y",
							cfgDataNode1 : 'DESCR',
							cfgKeyNode : 'CODE',
							renderTo : 'accountBranchDiv',
							cfgExtraParams : 
								[ 
								  {
					                	key : '$filtercode1',
						            	value : $('#sellerId').val()
						             },
						             {
						                	key : '$filtercode2',
							            	value : document.getElementById( "accountBankCode" ).value
							            } 
								 ],
							listeners : {
								'select' : function( combo, record, index )
								{
									document.getElementById( "accountBranchCode" ).value = record[0].raw.CODE;
									setDirtyBit();
								},
								'change' : function( combo, record, index )
								{
									if(combo.value == ''|| combo.value == null) 
									   {
										document.getElementById( "accountBranchCode" ).value = "";
									   }
								}
							}
						});
				
					if(null != document.getElementById( "accountBranchCode" ).value && "" != document.getElementById( "accountBranchCode" ).value ) {
						
						Ext.Ajax.request 
					    ({ 
					        url: 'cpon/agentAccount/branchDesc.json', 
					        method: 'POST', 
					        params:  
					        { 
					        	branchKey:document.getElementById( "accountBranchCode" ).value,
					        	sellerId : document.getElementById("sellerId").value
					        }, 
					        success: function(response) 
					        {
					        	var objJson = null;												       
					        		objJson = Ext.decode(response.responseText);
							if (objJson.d.filter[0]) {
								objBranchAutoCompleter.setValue(objJson.d.filter[0].name);
							}
					   
					        
					        }, 
					        failure: function(response) 
					        { 
					            console.log(response.responseText); 
					        } 
					         
					    }) ;					
					}				
			}});