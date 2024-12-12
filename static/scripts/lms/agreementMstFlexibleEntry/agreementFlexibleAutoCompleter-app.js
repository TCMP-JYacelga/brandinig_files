var objClientAutoCompleter = null;
var objCurrenncyAutoCompleter = null;
var objChargeAccountAutoCompleter = null;
var enddt = null;
var startdt = null;

Ext
		.application({
			name : 'GCP',
			appFolder : 'static/scripts/lms/agreementMstFlexibleEntry/app',
			// appFolder : 'app',
			controllers : [],
			requires : [ 'Ext.ux.gcp.AutoCompleter', 'Ext.form.DateField'],
			launch : function() {
				
				if(pageMode == 'ADD') {
					
				
					objClientAutoCompleter = Ext.create( 'Ext.ux.gcp.AutoCompleter',
							{
								xtype : 'AutoCompleter',
								fieldLabel : '',
								itemId : 'clientCodeItemId',
								fieldCls : 'xn-form-text w15 xn-suggestion-box',
								labelSeparator : '',
								cfgUrl : 'services/userseek/sweepClientIdSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'flexibleClientIdSeek',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'DESCRIPTION',
								cfgKeyNode : 'CODE',
								cfgDataNode2 : 'SAPBPID',
								renderTo : 'clientCodeDiv',
								cfgExtraParams :
								[
									{
										key : '$filtercode1',
										value : document.getElementById( "sellerId" ).value
									}
								],
								listeners :
								{
									select : function( combo, record, index )
									{
										document.getElementById( "clientCode" ).value = record[ 0 ].data.CODE;
										document.getElementById( "clientDescription" ).value = record[ 0 ].data.DESCRIPTION;
										objCurrenncyAutoCompleter.cfgExtraParams[0].value = document.getElementById( "clientCode" ).value;
										setCponEnforcedStructureType();
										setDirtyBit();
									},
									change : function(combo, record,
											index) {
										if (null == record	|| '' == record) {
											document.getElementById("clientCode").value = "";
											document.getElementById("clientDescription").value = "";
											setCponEnforcedStructureType();
										}
									}
								}
							} );
					objClientAutoCompleter.setValue(document.getElementById( "clientDescription" ).value);
					
				}
					
				
						
						objCurrenncyAutoCompleter = Ext.create( 'Ext.ux.gcp.AutoCompleter',
									{
										xtype : 'AutoCompleter',
										fieldLabel : '',
										itemId : 'currencyCodeItemId',
										fieldCls : 'xn-form-text w15 xn-suggestion-box',
										labelSeparator : '',
										cfgUrl : 'services/userseek/sweepAgreementMstCcySeek.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'sflexibleAgreementMstCcySeek',
										cfgRootNode : 'd.preferences',
										cfgKeyNode :'CODE',
										cfgDataNode2 : 'DESCR',
										cfgDataNode1 : 'CODE',
										cfgExtraParams :
											[			
												{
													key : '$filtercode1',
													value :  document.getElementById( "clientCode" ).value
												}
											],
										renderTo : 'currencyDiv',
										listeners :
										{
											select : function( combo, record, index )
											{
												document.getElementById( "agreementCurrency" ).value = record[ 0 ].data.CODE;
												document.getElementById( "currencyDesc" ).value = record[ 0 ].data.CODE;
												setDirtyBit();
											}
										}
									} );
						
						objCurrenncyAutoCompleter.setValue(document.getElementById( "agreementCurrency" ).value);
									
							
									document.getElementById( "chargeAcctDiv" ).innerHTML = "";
									var sellerCodeVal = '';
									var clientCodeValue = '';
									if( document.getElementById( "sellerId" ) != null ) {
									sellerCodeVal = document.getElementById( "sellerId" ).value;
									}
									if( document.getElementById( "clientCode" ) != null ) {
									clientCodeValue = document.getElementById( "clientCode" ).value
									}									
									
			objChargeAccountAutoCompleter = Ext.create( 'Ext.ux.gcp.AutoCompleter',
									{
										xtype : 'AutoCompleter',
										fieldLabel : '',
										itemId : 'chargeAcctNmbrItemId',
										fieldCls : 'xn-form-text w15 xn-suggestion-box',
										labelSeparator : '',
										cfgUrl : 'services/userseek/sweepChargeAccountSeek.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'flexibleChargeAccountSeek',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgKeyNode : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgDataNode3 : 'CCY',
										cfgDataNode4 : 'SAPBPID',
										renderTo : 'chargeAcctDiv',
										cfgExtraParams :
										[			
											{
												key : '$filtercode1',
												value :  document.getElementById( "clientCode" ).value
											},
											{
												key : '$sellerCode',
												value : document.getElementById( "sellerId" ).value
											},
											{
												key : '$filtercode2',
												value : user
											}
										],
										listeners :
										{
											select : function( combo, record, index )
											{
												document.getElementById( "chargeAccountNmbr" ).value = record[ 0 ].data.CODE;
												setDirtyBit();
												
											}
										}
									} );
			objChargeAccountAutoCompleter.setValue(document.getElementById( "chargeAccountNmbr" ).value);
		
			if (requestState == '0' || pageMode == 'ADD') {
					var startdtValue = startDateModel == null
							|| startDateModel == '' ? dtApplicationDate
							: startDateModel;
					startdt = Ext.create('Ext.form.DateField', {
						name : 'startDate',
						itemId : 'startDate',
						width : 166,
						renderTo : 'startDateDiv',
						format : extJsDateFormat,
						editable : false,
						minValue : dtApplicationDate,
						value : startdtValue
					});
					
				}
			
		

						var enddtValue = endDateModel != '' || endDateModel != null ? endDateModel
						: '';
				enddt = Ext.create('Ext.form.DateField', {
					name : 'endDate',
					itemId : 'endDate',
					renderTo : 'endDateDiv',
					width : 166,
					format : extJsDateFormat,
					editable : false,
					minValue : dtApplicationDate,
					value : enddtValue
				});
				
			
			
			}	
			});

function getLabel(key, defaultText)
{
	return defaultText;
}