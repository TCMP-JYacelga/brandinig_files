var seekUrl ;
var seekId ;

if(entityType == 0)
{
	seekUrl = 'cpon/userseek/userLimitClientIdSeek.json';
	seekId = 'userLimitClientIdSeek';
}
else
{
	seekUrl = 'cpon/userseek/userLimitClientIdSeekClient.json';
	seekId = 'userLimitClientIdSeekClient';
}


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
	appFolder : 'static/scripts/cpon/userLimitMst/app', 
	controllers : [],
	requires : [ 'Ext.ux.gcp.AutoCompleter' ],
	launch : function() {
		if(mode == 'ADD' && module == 'C')
		{
			autoCompleteObj = Ext.create('Ext.ux.gcp.AutoCompleter',{
				fieldCls : 'xn-form-text w14 xn-suggestion-box field-control',			
				name : 'ccy',
				width : '100%',
				itemId : 'companyId',
				cfgUrl : seekUrl,
				cfgQueryParamName : 'qfilter',
				cfgRecordCount : -1,
				cfgSeekId : seekId,
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCRIPTION',
				cfgKeyNode : 'CODE',
				cfgDataNode2 : 'SELLER',
				enableQueryParam:false,
				cfgExtraParams :
					[
						{
							key : '$filtercode1',
							value : document.getElementById( "sellerId" ).value
						}
					],
				cfgProxyMethodType : 'POST',
				renderTo: 'clientCodeDiv',			
				listeners : 
				{
					select : function( combo, record, index )
					{
						document.getElementById( "clientId" ).value = record[ 0 ].data.CODE;
						document.getElementById( "clientDescription" ).value = record[ 0 ].data.DESCRIPTION;
						if(entityType == 1)
						{
							document.getElementById( "sellerId" ).value = record[ 0 ].data.SELLER;
						}
						setDirtyBit();
					},
					afterRender : function(field){
										
					}
				}
			});
		}
	}
});