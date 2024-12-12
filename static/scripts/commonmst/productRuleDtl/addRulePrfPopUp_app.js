var sourceField = null;
var eventViewState =  null;
var criteriaListValueDesc = new Array();
var comparisonValue = new Array();
Ext.Loader.setConfig({
	enabled : true,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});

function getProdRuleCriteriaPopUp(index) {
	
	sourceField = document.getElementById('ruleDetails[' + index
			+ '].sourceFieldNo').value;
	 
	var operator = document.getElementById('ruleDetails[' + index
			+ '].operator').value;
	
	
	var comparisonValueDesc = document.getElementById('ruleDetails[' + index
			+ '].value').value;
	 selectedValuesList = comparisonValueDesc;
	 criteriaListValueDesc = new Array();
	 comparisonValue = new Array();
		
	var strUrl = 'services/productRule/getCriteriaList.json';

	objChargePrfCriteriaPopUp = Ext.create('static.scripts.commonmst.productRuleDtl.ProdRuleCriteriaPopUp', {
				itemId : 'ProdRuleCriteriaPopUp',
				storeUrl : strUrl,
				index : index,
				operator : operator
			});

	objChargePrfCriteriaPopUp.show();
}
