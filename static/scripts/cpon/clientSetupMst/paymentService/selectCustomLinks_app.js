var objCustIdSelectionPopup = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'CPON',
			appFolder : 'static/scripts/cpon/clientSetupMst/paymentService/app',
			requires : ['CPON.view.PayProductCustomLayoutPopup'],
			launch : function() {
				objCustIdSelectionPopup = Ext.create(
						'CPON.view.PayProductCustomLayoutPopup', {
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


