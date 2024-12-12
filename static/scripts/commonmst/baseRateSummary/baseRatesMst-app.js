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
			appFolder : 'static/scripts/commonmst/baseRateSummary/app',
			// appFolder : 'app',
			controllers : [],
			requires : [ 'Ext.ux.gcp.AutoCompleter'],
			launch : function() {
				
				// alert('Inside ... createCurrencyAutoCompletor');
				var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
				{
					xtype : 'AutoCompleter',
					fieldLabel : '',
					fieldCls : 'xn-form-text w16 xn-suggestion-box',
					itemId : 'baseRateCurrencyItemId',
					cls : 'autoCmplete-field',
					labelSeparator : '',
					cfgUrl : 'services/userseek/baseRatesMstCcySeek.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'baseRatesMstCcySeek',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'CODE',
					cfgDataNode2 : 'DESCR',
					cfgProxyMethodType:'POST',
				    enableQueryParam:false,
					listeners :
					{
						select : function( combo, record, index )
						{
							document.getElementById( "baseRateCurrency" ).value = record[ 0 ].data.CODE;
							setDirtyBit();							
						},
						change : function( combo, record, index )
						{						
						}
					}
				} );
				
				if(pageMode == 'add') { //In case of edit the autocompleter is not required.
					
				auto1.render( Ext.get( 'currencyDiv' ) );
				auto1.setValue( document.getElementById( "baseRateCurrency" ).value );
				
				}
				
			}
		
		
		});