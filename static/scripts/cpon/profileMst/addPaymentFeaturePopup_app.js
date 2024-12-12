var objPayFeaturePopup = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/profileMst/app',
			// appFolder : 'app',
			requires : ['GCP.view.PayFeaturePopup'],
			controllers : ['GCP.controller.PrfMstController'],
			launch : function() {
				objPayFeaturePopup = Ext.create('GCP.view.PayFeaturePopup',
						{
							itemId : 'payFeaturePopup',
							fnCallback : setSelectedPayFeatureItems
//							title : getLabel("payfeatureProfile", "Pay Feature")
						});
			}
		});

function getPayFeaturePopup() {
	if($('#chkAllFeaturesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif' || $('#chkAllFeaturesSelectedFlag').attr('src')=='static/images/icons/icon_checked_grey.gif')
	{
	   var payFeCheckBoxes = objPayFeaturePopup.query('checkboxgroup');
	   for(var i = 0; i<payFeCheckBoxes.length; i++ )
	   {
	    var cBox = payFeCheckBoxes[i].query('checkbox');
	    for(var j=0; j<cBox.length;j++)
	    {
	    	cBox[j].setValue(true);
	    } 
	   }
		var payFeTextFields = objPayFeaturePopup.query('textfield');
		for ( var i = 0; i < payFeTextFields.length; i++) {
			if ("textfield" === payFeTextFields[i].xtype) {
				payFeTextFields[i].setValue("999");
			}
		}
		objPayFeaturePopup.show();
	}	
	else
	{
		if (null != objPayFeaturePopup) {
			objPayFeaturePopup.show();
		}		
	}
}

function setSelectedPayFeatureItems(objJson) {
	selectedPayOptionList = JSON.stringify(objJson);
	popupPayFeaturesSelectedFlag = 'Y';
}
