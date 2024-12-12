var objClientAutoCompleter = null;
var objCurrenncyAutoCompleter = null;
var enddt = null;
var startdt = null;

Ext
		.application({
			name : 'GCP',
			appFolder : 'static/scripts/lms/agreementMstHybridEntry/app',
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
												setDirtyBit();
											}
										}
									} );
						
						objCurrenncyAutoCompleter.setValue(document.getElementById( "agreementCurrency" ).value);
						*/			
							
									
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