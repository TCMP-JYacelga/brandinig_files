var objProfileViewPopup = null;
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
	appFolder : 'static/scripts/realtime',
	requires : ['GCP.view.RealTimeResGrid'],	
	launch : function() {
		
	}
});

function openResponseGrid()
{
	if (!Ext.isEmpty(objProfileViewPopup)){
		objProfileViewPopup.destroy();
	}
	objProfileViewPopup = Ext.create('GCP.view.RealTimeResGrid', {
				renderTo : 'realTimeresPopupGrid'
	});
				
}
/*function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileViewPopup)) {
		objProfileViewPopup.hide();
		objProfileViewPopup.show();
	}
}*/