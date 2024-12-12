var objCollectionParametersPopUp = null;

Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/collectionMethodMst/app',
			// appFolder : 'app',
			requires : ['GCP.view.CollectionParametersPopUp'],
			launch : function() {
				objCollectionParametersPopUp = Ext.create(
						'GCP.view.CollectionParametersPopUp', {
							itemId : 'collectionParametersPopUpId',
							title : getLabel('collPrdParam', 'Collection Product Parameters')
						});
			}
		});

function getCollectionParametersPopUp() {
	if (null != objCollectionParametersPopUp) {
		objCollectionParametersPopUp.show();
	}
}
