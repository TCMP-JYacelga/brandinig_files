var objCreditInterestProfileAutoCompleter = null;
var objDebitInterestProfileAutoCompleter = null;
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
				if (pageMode == "VIEW" || profileFlag == "Y") {
					fieldGreyClass  ='xn-form-text w14 xn-suggestion-box grey'
				}
				objCreditInterestProfileAutoCompleter = Ext.create('Ext.ux.gcp.AutoCompleter',
						{
							padding : '1 0 0 2',
							name : 'creditInterestProfileItemId',
							itemId : 'creditInterestProfileItemId',
							fieldCls : fieldGreyClass,
							cfgUrl : 'services/userseek/{0}.json',
							cfgProxyMethodType : 'POST',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'agentInterestProfileList',
							cfgRootNode : 'd.preferences',
							disabled : pageMode == "VIEW"|| profileFlag == "Y",
							cfgDataNode1 : 'CODE',
							cfgKeyNode : 'CODE',
							cfgExtraParams : 
								[ 
								  {
					                	key : '$filtercode1',
						            	value : 'C'
						             },
						             {
						                	key : '$filtercode2',
							            	value : 'B'
							            } 
								 ],
							renderTo : 'creditInterestProfileDiv',
							listeners : {
								'select' : function( combo, record, index )
								{
									document.getElementById( "creditInterestProfileKey" ).value = record[0].raw.RECORD_KEY;
									setDirtyBit();
								},
								'change' : function( combo, record, index )
								{
									if(combo.value == ''|| combo.value == null) 
									   {
										document.getElementById( "creditInterestProfileKey" ).value = "";
									   }
								}
							}
						});
				//Get the Profile Desc
				
				if(null != document.getElementById( "creditInterestProfileKey" ).value && "" !=  document.getElementById( "creditInterestProfileKey" ).value ) {
				
				$.ajax({
					url : "cpon/agentSetup/interestProfileDesc.json",
				//	contentType : "application/json",
					type : "POST",
					data : {
						profileKey:document.getElementById( "creditInterestProfileKey" ).value						
					},
					success : function(data) {						
						if (data.d.filter[0]) {							
							objCreditInterestProfileAutoCompleter.setValue(data.d.filter[0].value);													
						}
					}
				});
				
				}			
				
				objDebitInterestProfileAutoCompleter = Ext.create('Ext.ux.gcp.AutoCompleter',
						{
							padding : '1 0 0 2',
							name : 'debitInterestProfileItemId',
							itemId : 'debitInterestProfileItemId',
							fieldCls :fieldGreyClass,
							cfgUrl : 'services/userseek/{0}.json',
							cfgProxyMethodType : 'POST',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'agentInterestProfileList',
							cfgRootNode : 'd.preferences',
							disabled : pageMode == "VIEW"|| profileFlag == "Y",
							cfgDataNode1 : 'CODE',
							cfgKeyNode : 'CODE',
							cfgExtraParams : 
								[ 
									{
										key : '$filtercode1',
										value : 'D'
									 },
									 {
									    	key : '$filtercode2',
									    	value : 'B'
									    } 
								 ],
							renderTo : 'debitInterestProfileDiv',
							listeners : {
								'select' : function( combo, record, index )
								{
									document.getElementById( "debitInterestProfileKey" ).value = record[0].raw.RECORD_KEY;
									setDirtyBit();
								},
								'change' : function( combo, record, index )
								{
									if(combo.value == ''|| combo.value == null) 
									   {
										document.getElementById( "debitInterestProfileKey" ).value = "";
									   }
								}
							}
						});
				
					if(null != document.getElementById( "debitInterestProfileKey" ).value && "" != document.getElementById( "debitInterestProfileKey" ).value ) {
					
					$.ajax({
						url : "cpon/agentSetup/interestProfileDesc.json",
					//	contentType : "application/json",
						type : "POST",
						data : {
							profileKey:document.getElementById( "debitInterestProfileKey" ).value						
						},
						success : function(data) {						
							if (data.d.filter[0]) {							
								objDebitInterestProfileAutoCompleter.setValue(data.d.filter[0].value);													
							}
						}
					});
					
					}
				
			}});