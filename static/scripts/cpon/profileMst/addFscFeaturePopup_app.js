var objFSCFeaturePopup = null;
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
			requires : ['GCP.view.FSCFeaturePopup','Ext.util.MixedCollection','Ext.util.Filter'],
			launch : function() {
				objFSCFeaturePopup = Ext.create('GCP.view.FSCFeaturePopup',
						{
							itemId : 'fscFeaturePopup',
							fnCallback : setSelectedFSCFeatureItems,
							profileId : fscProfileId,
							featureType : 'P',
							module : '06'
						});
			}
		});

function getFSCFeaturePopup() {
	if($('#chkAllFeaturesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif')
  {
   var brCheckBoxes = objFSCFeaturePopup.query('checkboxgroup');
   for(var i = 0; i<10; i++ ){
    var cBox = brCheckBoxes[i].query('checkbox');
    for(var j=0; j<cBox.length;j++){
     cBox[j].setValue(true);      
    } 
   }
   objFSCFeaturePopup.show();
  }
  else
  {
     if (null != objFSCFeaturePopup) {
		objFSCFeaturePopup.show();
	}
  }
}

function setSelectedFSCFeatureItems(records, objJson) {
	strFscFeatureList = JSON.stringify(objJson);
	console.log(strFscFeatureList);
	popupFSCFeaturesSelectedFlag = 'Y';
}
