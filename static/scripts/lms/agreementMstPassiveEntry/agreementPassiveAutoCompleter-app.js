var objClientAutoCompleter = null;
//var objCurrenncyAutoCompleter = null;
//var objChargeAccountAutoCompleter = null;
var objMasterAccountAutoCompleter = null;
var enddt = null;
var startdt = null;

Ext
		.application({
			name : 'GCP',
			appFolder : 'static/scripts/lms/agreementMstPassiveEntry/app',
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
								cfgSeekId : 'sweepClientIdSeek',
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
										//createChargeAcctAutoCompletor(sellerCodeValue);
										//createMasterMasterAcctNmbrAutoCompletor();
										setCponEnforcedStructureType();
										setDirtyBit();
									}
								}
							} );
					objClientAutoCompleter.setValue(document.getElementById( "clientDescription" ).value);
					
				}
					
				
						
						/*objCurrenncyAutoCompleter = Ext.create( 'Ext.ux.gcp.AutoCompleter',
									{
										xtype : 'AutoCompleter',
										fieldLabel : '',
										itemId : 'currencyCodeItemId',
										fieldCls : 'xn-form-text w15 xn-suggestion-box',
										labelSeparator : '',
										cfgUrl : 'services/userseek/sweepAgreementMstCcySeek.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'sweepAgreementMstCcySeek',
										cfgRootNode : 'd.preferences',
										cfgKeyNode :'CODE',
										cfgDataNode2 : 'DESCR',
										cfgDataNode1 : 'CODE',
										renderTo : 'currencyDiv',
										listeners :
										{
											select : function( combo, record, index )
											{
												document.getElementById( "agreementCurrency" ).value = record[ 0 ].data.CODE;
												document.getElementById( "currencyDesc" ).value = record[ 0 ].data.CODE;
												//createMasterMasterAcctNmbrAutoCompletor();
												setDirtyBit();
											}
										}
									} );  */
						//objCurrenncyAutoCompleter.render( Ext.get( 'currencyDiv' ) );
					//	objCurrenncyAutoCompleter.setValue(document.getElementById( "agreementCurrency" ).value);
									
							
									//document.getElementById( "chargeAcctDiv" ).innerHTML = "";
									var sellerCodeVal = '';
									var clientCodeValue = '';
									if( document.getElementById( "sellerId" ) != null ) {
									sellerCodeVal = document.getElementById( "sellerId" ).value;
									}
									if( document.getElementById( "clientCode" ) != null ) {
									clientCodeValue = document.getElementById( "clientCode" ).value
									}									
									//alert(clientCodeValue);
			 /* objChargeAccountAutoCompleter = Ext.create( 'Ext.ux.gcp.AutoCompleter',
									{
										xtype : 'AutoCompleter',
										fieldLabel : '',
										itemId : 'chargeAcctNmbrItemId',
										fieldCls : 'xn-form-text w15 xn-suggestion-box',
										labelSeparator : '',
										cfgUrl : 'services/userseek/sweepChargeAccountSeek.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'sweepChargeAccountSeek',
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
											}
										],
										listeners :
										{
											select : function( combo, record, index )
											{
												document.getElementById( "chargeAccountNmbr" ).value = record[ 0 ].data.CODE;
												setDirtyBit();
												//document.getElementById( "chargeAccountNmbr" ).value = record[ 0 ].data.DESCRIPTION;
											}
										}
									} ); */
			//objChargeAccountAutoCompleter.setValue(document.getElementById( "chargeAccountNmbr" ).value);
			//objChargeAccountAutoCompleter.render( Ext.get( 'chargeAcctDiv' ) );			
							
					
							// Master Account 
							if(pageMode == 'EDIT' || pageMode == 'ADD' ) {
							if( requestState == '3' || requestState == '1') {
							document.getElementById( "masterAccountNmbrDiv" ).innerHTML = "";
							var currencyCode ;
							var clientCodeValue;
							if(null != document.getElementById("sellerId")) {
								sellerCodeValue = document.getElementById("sellerId").value;
							}
							if(null != document.getElementById("agreementCurrency")) {
								currencyCode = document.getElementById("agreementCurrency").value;
							}
							if(null != document.getElementById("clientCode")) {
								clientCodeValue = document.getElementById("clientCode").value;
							}
			objMasterAccountAutoCompleter = Ext.create( 'Ext.ux.gcp.AutoCompleter',
							{
								xtype : 'AutoCompleter',
								fieldLabel : '',
								itemId : 'masterAccountNmbrItemId',
								fieldCls : 'xn-form-text w15 xn-suggestion-box',
								labelSeparator : '',
								cfgUrl : 'services/userseek/sweepMasterAccountSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'sweepMasterAccountSeek',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE',
								cfgDataNode2 : 'DESCRIPTION',
								cfgKeyNode : 'CODE',
								cfgDataNode3 : 'CCY',
								cfgDataNode4 : 'CLIENTNAME',
								renderTo : masterAccountNmbrDiv,
								cfgStoreFields :
									[
									 	'CODE', 'DESCRIPTION','ACCTID'
									],
								cfgExtraParams :
								[
									{
										key : '$filtercode1',
										value : document.getElementById("clientCode").value
									},
									{
										key : '$filtercode2',
										value : document.getElementById("agreementCurrency").value
									},
									{
										key : '$sellerCode',
										value : document.getElementById( "sellerId" ).value
									}
								],
								listeners :
								{
									select : function( combo, record, index )
									{
										document.getElementById( "masterAccountNmbr" ).value = record[ 0 ].data.CODE;
										//document.getElementById( "masterAccountNmbr" ).value = record[ 0 ].data.DESCRIPTION;
										document.getElementById( "masterAccountId" ).value = record[ 0 ].data.ACCTID;
										setDirtyBit();
									},
							
								change : function( combo, record, index )
								{
									if(null == combo.value || '' == combo.value){
										document.getElementById( "masterAccountNmbr" ).value = "";
										document.getElementById( "masterAccountId" ).value = "";
									}
								}
								}
							} );
			objMasterAccountAutoCompleter.setValue(document.getElementById( "masterAccountNmbr" ).value);
			//objMasterAccountAutoCompleter.render( Ext.get( 'masterAccountNmbrDiv' ) );
							} // end if requestState
							
						} //end pageMode Master Account
			

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
					// startdt.render(Ext.get('startDateDiv'));
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