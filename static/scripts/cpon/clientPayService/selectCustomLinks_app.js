var objCustIdSelectionPopup = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/clientPayService/app',
			// appFolder : 'app',
			requires : ['GCP.view.PayProductCustomLayoutPopup'],
			launch : function() {
				objCustIdSelectionPopup = Ext.create(
						'GCP.view.PayProductCustomLayoutPopup', {
							itemId : 'payProductCustomLayoutPopupId',
							title : getLabel('widget', 'Widget')							
						});
			}
		});

function getCustomIdPopup() {
	if (null != objCustIdSelectionPopup) {
		objCustIdSelectionPopup.show();
	}
}


