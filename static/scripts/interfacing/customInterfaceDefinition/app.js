var objProfileView = null;
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
	appFolder : 'static/scripts/interfacing/customInterfaceDefinition',
	requires : ['GCP.view.FilterParamsView', 'GCP.view.FieldMappingView'],
	controllers : ['GCP.controller.FilterParamsController','GCP.controller.FieldMappingController'],
	launch : function() {
		if($('#advanceFilterParamsDiv').attr("id") != null){
			objProfileView = Ext.create('GCP.view.FilterParamsView', {
						renderTo : 'advanceFilterParamsDiv'
					});
			objFieldMapping = Ext.create( 'GCP.view.FieldMappingView',
				{
					renderTo : 'fieldMappingDiv'
				});
		}
		
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
