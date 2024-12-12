var objClientCodeAutoCompleter = null;
var objCurrencyAutoCompleter = null;
var clientCodeVal = null;
var clientNameVal = null;
var agreementCodeVal = null;
var startdt = null;
var enddt = null;
var origstartdt=null;

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
			appFolder : 'static/scripts/lms/agreementNotionalMst/app',
			// appFolder : 'app',
			controllers : [],
			requires : [ 'Ext.ux.gcp.AutoCompleter', 'Ext.form.DateField' ],
			launch : function() {
			if(pageMode == 'ADD')
			{
				objClientCodeAutoCompleter = Ext
				.create(
						'Ext.ux.gcp.AutoCompleter',
						{
							padding : '1 0 0 2',
							name : 'clientCodeItemId',
							itemId : 'clientCodeItemId',
							fieldCls : 'xn-form-text w14 xn-suggestion-box',
							cfgUrl : 'services/userseek/notionalClientIdSeek.json',
							cfgProxyMethodType : 'POST',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'notionalClientIdSeek',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCRIPTION',
							cfgDataNode2 : 'SHORTNAME',
							cfgKeyNode : 'CODE',
							cfgExtraParams : 
								[ 
					                {
					                	key : '$filtercode1',
						            	value : document.getElementById("sellerId").value
						             }
								 ],
							renderTo : 'clientCodeDiv',
							listeners : {
								'select' : function( combo, record, index )
								{
									document.getElementById( "clientId" ).value = record[ 0 ].data.CODE;
									document.getElementById( "clientDesc" ).value = record[ 0 ].data.DESCRIPTION;
									objCurrencyAutoCompleter.cfgExtraParams[1].value = document.getElementById( "clientId" ).value;
									setCponEnforceStructureType();
									setDirtyBit();
								},
								'change' : function( combo, record, index )
								{
									if(combo.value == ''|| combo.value == null) 
									   {
										   var flag = document.getElementById("clientIdDirtyBit");
										   if( flag != null && flag.value == '1' )
										   {
											   document.getElementById("clientId").value = "";
											   document.getElementById("clientDesc").value = "";
										   }
										   flag.value = '1';
									   }
								}
							}
						});
				
				objCurrencyAutoCompleter = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 2',
					name : 'currencyCodeItemId',
					itemId : 'currencyCodeItemId',
					fieldCls : 'xn-form-text w14 xn-suggestion-box',
					cfgUrl : 'services/userseek/notionalAgreementMstCcySeek.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'notionalAgreementMstCcySeek',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'CODE',
					cfgDataNode2 : 'DESCR',
					cfgExtraParams :
						[
							{
								key : '$filtercode1',
								value : document.getElementById("sellerId").value
							},
							{
								key : '$filtercode2',
								value : document.getElementById("clientId").value
							}
						],	
					renderTo : 'currencyDiv',
					listeners : {
						'select' : function( combo, record, index )
						{
							document.getElementById( "poolCurrency" ).value = record[ 0 ].data.CODE;
							document.getElementById( "currencyDesc" ).value = record[ 0 ].data.DESCR;
							setDirtyBit();
						},
					   'change' : function( combo, record, index )
						{
						   if(combo.value == ''|| combo.value == null) 
						   {
							   var flag = document.getElementById("poolCurrencyDirtyBit");
							   if( flag != null && flag.value == '1' )
							   {
								   document.getElementById("poolCurrency").value = "";
								   document.getElementById("currencyDesc").value = "";
							   }
							   flag.value = '1';
						   }
						}
					   
					}
				});
				
				objClientCodeAutoCompleter.setValue('');
				objCurrencyAutoCompleter.setValue('');
				// following value set in case if user changes reference  time.
				objClientCodeAutoCompleter.setValue( document.getElementById( "clientDesc" ).value );
				objCurrencyAutoCompleter.setValue( document.getElementById( "poolCurrency" ).value );
			}

			if(requestState == '0' ||  pageMode == 'ADD') {
			var origStartdtValue = origStartDateModel == null || origStartDateModel == '' ? dtApplicationDate : origStartDateModel;
			origstartdt = Ext.create('Ext.form.DateField',
			{
				name : 'origStartDate',
				itemId : 'origStartDate',
				format : extJsDateFormat,
				editable : false,
				maxValue : dtApplicationDate, 
				value : origStartdtValue,
				renderTo : 'origStartDateDiv',
				listeners :
				{
					change: function ( datefield, newValue, oldValue, eOpts )
					{
						setDirtyBit();
					}
				}
			});
			}
			
			if(requestState == '0' ||  pageMode == 'ADD') {
			var startdtValue = startDateModel == null || startDateModel == '' ? dtApplicationDate : startDateModel;
			var startdt = Ext.create('Ext.form.DateField', {
				name : 'startDate',
				itemId : 'startDate',
				format : extJsDateFormat,
				editable : false,
				minValue : dtComputationDate,
				value : startdtValue,
				renderTo : 'startDateDiv',
				listeners :
				{
					change: function ( datefield, newValue, oldValue, eOpts ){
						setDirtyBit();
						document.getElementsByName("origStartDate")[0].value = Ext.util.Format.date( newValue, extJsDateFormat );
					}
				}
			});
			}
			var enddtValue = endDateModel != '' || endDateModel != null ? endDateModel
					: '';
			var enddt = Ext.create('Ext.form.DateField', {
				name : 'endDate',
				itemId : 'endDate',
				format : extJsDateFormat,
				editable : false,
				minValue : dtComputationDate,
				value : enddtValue,
				renderTo : 'endDateDiv',
				listeners :
				{
					change: function ( datefield, newValue, oldValue, eOpts ){
						setDirtyBit();
					}
				}
			});
			
			}
		
		});
function getLabel(key, defaultText)
{
	return (notionalMstLabelsMap && !Ext.isEmpty(notionalMstLabelsMap[key])) ? notionalMstLabelsMap[key]
	: defaultText
}

