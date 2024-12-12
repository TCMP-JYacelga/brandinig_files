var objLanguageSelectionPopup = null;
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
	appFolder : 'static/scripts/commonmst/reportDefMst/app',
	requires : ['GCP.view.LanguageSelectionPopup'],
	launch : function() {
		objLanguageSelectionPopup = Ext.create('GCP.view.LanguageSelectionPopup', {
			itemId : 'languageSelectionPopup',
			fnCallback : setSelectedLanguages,
			reportCode : strReportCode,
			parameterCode : strParameterCode,
			parentKey :parentKey,
			paramViewState :strParamViewState			
		});		
	}
});

//Forming JSON Array like [{'languageCode' : AR_DZ, 'parameterDesc' : ABC}]
function setSelectedLanguages(records, removedRecords, blnIsUnselected)
{
	var selectedLanguages = "[";
	for ( var i = 0; i < records.length; i++)
	{
		var val = records[i];
		selectedLanguages +="{";
		if (!Ext.isEmpty(val) && !Ext.isEmpty(val.data))
		{
			selectedLanguages += "'languageCode' : '"+val.data.languageCode + "', 'parameterDesc' : '" + val.data.parameterDesc+"' ";
		}
		selectedLanguages +="}";
		if (i < records.length - 1) {
			selectedLanguages = selectedLanguages + ',';
		}		
	}
	for(var j=0; j<assignedLanguageList.length; j++)
	{
		var assignedRecord = null;
		assignedRecord = assignedLanguageList[j];
		if(!checkIfLanguageExist(records,assignedRecord.languageCode))
		{
			for ( var i = 0; i < removedRecords.length; i++)
			{
				var removed=false;
				var val = removedRecords[i];
				if (!Ext.isEmpty(val) && !Ext.isEmpty(val.data))
				{				
					if(assignedRecord.languageCode==val.data.languageCode)
					{
						removed = true;
						break;
					}
				}
			}
			if(selectedLanguages.charAt(selectedLanguages.length - 1)!=',')
			{
				selectedLanguages = selectedLanguages + ',';
			}
			if(removed==false)	
			{
				selectedLanguages +="{";
				selectedLanguages += "'languageCode' : '"+assignedRecord.languageCode + "', 'parameterDesc' : '" + assignedRecord.parameterDesc+"' ";
				selectedLanguages +="}";
				if (j < assignedLanguageList.length - 1)
				{
					selectedLanguages = selectedLanguages + ',';
				}
			}				
		}		
		
	}	
	selectedLanguages+="]";
	selectedLanguageList = selectedLanguages;	
	popupLanguagesSelectedValue = 'Y';
}

function checkIfLanguageExist(assignedArrayList,languageCode){
	var isRecordPresent = false;		
	for ( var i = 0; i < assignedArrayList.length; i++) {		
		var rowRecord = assignedArrayList[i];	
		if(rowRecord!=null)
		{
			if (rowRecord.data.languageCode === languageCode) {
				isRecordPresent = true;
				break;
			}
		}
	}
	return isRecordPresent;	
}

function getAdditionLanguagesPopup()
{
	selectedr = [];
	var optionsSelected = $('#selectedLanguageSelection').val();
	if (!Ext.isEmpty(optionsSelected))
	{
		var options = optionsSelected.split(",");
	} 
	if (Ext.isEmpty(objLanguageSelectionPopup))
	{
		objLanguageSelectionPopup =  Ext.create('GCP.view.LanguageSelectionPopup', {
			itemId : 'languageSelectionPopup',
			fnCallback : setSelectedLanguages,
			reportCode : strReportCode,
			parameterCode : strParameterCode,
			parentKey :parentKey,
			paramViewState :strParamViewState
		});
		objLanguageSelectionPopup.show();
	}
	else{
		objLanguageSelectionPopup.lastSelectedWidgets = options;
		objLanguageSelectionPopup.show();
	}
}