var objBRFeaturePopup = null;
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
			requires : ['GCP.view.BRFeaturePopup','Ext.util.MixedCollection','Ext.util.Filter'],
			launch : function() {
				objBRFeaturePopup = Ext.create('GCP.view.BRFeaturePopup',
						{
							itemId : 'brFeaturePopup',
							fnCallback : setSelectedBRFeatureItems,
							profileId : brFeatureProfileId,
							featureType : 'P',
							module : '01'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});
			}
		});

function getBRFeaturePopup() {
	if($('#chkAllBRFeaturesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif' || $('#chkAllBRFeaturesSelectedFlag').attr('src')=='static/images/icons/icon_checked_grey.gif')
	{
	   var brCheckBoxes = objBRFeaturePopup.query('checkboxgroup');
	   for(var i = 0; i<brCheckBoxes.length; i++ )
	   {
	    var cBox = brCheckBoxes[i].query('checkbox');
	    for(var j=0; j<cBox.length;j++)
	    {
	    	cBox[j].setValue(true);
	    } 
	   }
		var brTextFields = objBRFeaturePopup.query('textfield');
		for ( var i = 0; i < brTextFields.length; i++) {
			if ("textfield" === brTextFields[i].xtype) {
				brTextFields[i].setValue("999");
			}
		}
	   objBRFeaturePopup.show();
  }
  else
  {
     if (null != objBRFeaturePopup) {
		objBRFeaturePopup.show();
	}
  }
}

function setSelectedBRFeatureItems(records, objJson) {
	var selectedAdminFItems = new Array();
	/*var msgCount='('+records.length+')';
	 $("#msgCnt").text(msgCount);*/
	strBrPrevililegesList= JSON.stringify(selectedAdminFItems);
	strBrFeatureList = JSON.stringify(objJson);
	console.log(strBrFeatureList);
	popupBrFeaturesSelectedFlag = 'Y';
}
