var autoCompleteObj = null;

Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});

Ext.application({
	name : 'GCP',
	appFolder : 'static/scripts/commonmst/systemAccountMst/app', 
	controllers : [],
	requires : [ 'Ext.ux.gcp.AutoCompleter' ],
	launch : function() {
		if(pageMode == 'ADD')
		{
			document.getElementById("currencyField").innerHTML = "";			
			autoCompleteObj = Ext.create('Ext.ux.gcp.AutoCompleter',{
				fieldCls : 'xn-form-text w14 xn-suggestion-box field-control',			
				name : 'ccy',
				width : '100%',
				itemId : 'ccyFilter',
				cfgUrl : 'cpon/cponseek/{0}.json',
				cfgQueryParamName : 'qfilter',
				cfgRecordCount : -1,
				cfgSeekId : 'ccySeek',
				cfgRootNode : 'd.filter',
				cfgDataNode1 : 'name',
				enableQueryParam:false,
				cfgProxyMethodType : 'POST',
				renderTo: 'currencyField',			
				listeners : 
				{
					select : function( combo, record, index )
					{
						//document.getElementById( "srcUserName" ).value = record[ 0 ].data.RECORD_KEY_NO;								
						//showBankAdminUserAddRole();
						document.getElementById('ccyCode').value = record[0].data.name;
						setDirtyBit();
					},
					afterRender : function(field){
										
					}
				}
			});
		}
	}
});