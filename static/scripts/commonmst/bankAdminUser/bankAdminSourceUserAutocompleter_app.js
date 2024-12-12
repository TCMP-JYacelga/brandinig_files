var objSourceUserAutoCompletor = null;

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
	appFolder : 'static/scripts/commonmst/bankAdminUser/app',
	// appFolder : 'app',
	controllers : [],
	requires : [ 'Ext.ux.gcp.AutoCompleter' ],
	launch : function() {
		if(pageMode == 'ADD')
		{
			document.getElementById( "srcUserNameDiv" ).innerHTML = "";
			objSourceUserAutoCompletor = Ext
			.create(
					'Ext.ux.gcp.AutoCompleter',
					{
						matchFieldWidth : true,
						width : '100%',
						padding : '1 0 0 2',
						name : 'srcUserNameCode',
						itemId : 'srcUserNameFilterItemId',
						fieldCls : 'xn-form-text w14 xn-suggestion-box field-control',
						cfgUrl : 'services/userseek/bankusrAdminAllAuthUserCodeSeek.json',
						cfgProxyMethodType : 'POST',
						cfgQueryParamName : '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'bankusrAdminAllAuthUserCodeSeek',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'CODE',
						cfgDataNode2 : 'DESCRIPTION',
						enableQueryParam:false,
						cfgStoreFields :
						[
							'CODE', 'DESCRIPTION', 'RECORD_KEY_NO'
						],
						cfgExtraParams :
						[
							{
								key : '$sellerCode',
								value : document.getElementById("sellerId").value
							}
						],
						
						renderTo : 'srcUserNameDiv',
						
						listeners : 
						{
							select : function( combo, record, index )
							{
								document.getElementById( "srcUserName" ).value = record[ 0 ].data.RECORD_KEY_NO;								
								showBankAdminUserAddRole();
								setDirtyBit();
							},
							afterRender : function(field){
								var strId = field.getEl()
									&& field.getEl().id
									? field.getEl().id
									: null;
								var inputField = strId
									? $('#' + strId
											+ '-inputEl')
									: null;
								inputField.attr("tabindex", 1);
								inputField.val(srcUserDescription);
							}
						}
					});
		}
	}		
});
