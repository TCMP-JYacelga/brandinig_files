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
	appFolder : 'static/scripts/common/realTimeIntResT7/app',
	requires : ['GCP.view.RealTimeResGrid'],	
	launch : function() {
		//Ext.Ajax.timeout = Ext.isEmpty(requestTimeout) ? 600000 : parseInt(requestTimeout) * 1000 * 60;
		//Ext.Ajax.on('requestexception', function(con, resp, op, e) {
							//if (resp.status == 403) {
							//location.reload();
							//}
					//});
		/*objProfileView = Ext.create('GCP.view.RealTimeResGrid', {
					renderTo : 'realTimeresPopup'
				}); */
	}
});

function openResponseGrid()
{
	if (!Ext.isEmpty(objProfileViewPopup)){
		objProfileViewPopup.destroy();
	}
	objProfileViewPopup = Ext.create('GCP.view.RealTimeResGrid', {
				renderTo : 'realTimeresPopup'
			});
				
}
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileViewPopup)) {
		objProfileViewPopup.hide();
		objProfileViewPopup.show();
	}
}
