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
			appFolder : 'static/scripts/cpon/clientSetupMst/app',
			// appFolder : 'app',
			requires : ['GCP.view.BRFeaturePopup','Ext.util.MixedCollection','Ext.util.Filter'],
			launch : function() {
				objBRFeaturePopup = Ext.create('GCP.view.BRFeaturePopup',
						{
							itemId : 'brFeaturePopup',
							fnCallback : setSelectedBRFeatureItems,
							profileId : adminFeatureProfileId,
							featureType : 'P',
							module : '01'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});
			}
		});

function getBRFeaturePopup() {

		if($('#chkAllBRFeaturesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif')
		{
			var brCheckBoxes = objBRFeaturePopup.query('checkboxgroup');
			for(var i = 0; i<brCheckBoxes.length; i++ ){
				var cBox = brCheckBoxes[i].query('checkbox');
				for(var j=0; j<cBox.length;j++){
					cBox[j].setValue(true);						
				}	
			}
			objBRFeaturePopup.show();
		}
		else
		{
			var brCheckBoxes = objBRFeaturePopup.query('checkboxgroup');
			for(var i = 0; i<brCheckBoxes.length; i++ ){
			
				if(brCheckBoxes[i] != undefined)
				{
					var cBox = brCheckBoxes[i].query('checkbox');
					for(var j=0; j<cBox.length;j++){
					if(cBox[j].defVal !== true)
						cBox[j].setValue(false);						
					}
				}
			}
			objBRFeaturePopup.show();
		}
}

function setSelectedBRFeatureItems(records, objJson) {
	var selectedAdminFItems = new Array();
	/*
	 * var msgCount='('+records.length+')'; $("#msgCnt").text(msgCount);
	 */
	strBrPrevililegesList = JSON.stringify(selectedAdminFItems);
	if ('S' === clientType) {
		var selectedNonReadOnlyItems = new Array();
		for (i = 0; i < objJson.length; i++) {
			if (undefined == objJson[i].readOnly || true != objJson[i].readOnly) {
				selectedNonReadOnlyItems.push(objJson[i]);
			}
		}
		strBrFeatureList = JSON.stringify(selectedNonReadOnlyItems);
	} else {
		strBrFeatureList = JSON.stringify(objJson);
	}
	popupBrFeaturesSelectedValue = 'Y';
}

