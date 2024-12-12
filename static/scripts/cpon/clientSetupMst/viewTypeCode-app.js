var objTypeCode = null;
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
	appFolder : 'static/scripts/cpon/clientSetupMst/app',
//	appFolder : 'app',
	requires : ['GCP.view.TypeCodeView'],
	controllers : [],
	launch : function() {
		Ext.Ajax.timeout = 600000;
		if(typecode_profileid.length > 0)
		{
			objTypeCode = Ext.create('GCP.view.TypeCodeView', {
				renderTo : 'typeCode'
			});
		}
		
	}
});
function showTypeCode() {
	if (!Ext.isEmpty(objTypeCode)) {
		objTypeCode.hide();
		objTypeCode.show();
	}
}
