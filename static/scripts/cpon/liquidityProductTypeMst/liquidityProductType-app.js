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
			appFolder : 'static/scripts/cpon/liquidityProductTypeMst/app',
			requires : ['GCP.view.LiquidityProductTypeSummaryView'],
			controllers : ['GCP.controller.LiquidityProductTypeMstController'],
			init : function(application) {

			},
			launch : function() {
				objProfileView = Ext.create(
						'GCP.view.LiquidityProductTypeSummaryView', {
							renderTo : 'liquidityProductTypeDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
//var mapLmsProductTypeUrl = {
//	'summaryListUrl' : 'liquidityProductTypeMstList.form',
//	'entryUrl' : 'addLiquidityProductTypeMst.form'
//}
