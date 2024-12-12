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
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/clientSetupMst/app',
			// appFolder : 'app',
			requires : ['GCP.view.ChargePrfCommissionAccountPopUp'],
			launch : function() {
				objCrgPrfCommissionAccountPopUp = Ext.create(
						'GCP.view.ChargePrfCommissionAccountPopUp', {
							itemId : 'chargePrfCommissionAccountPopUp'
							// fnCallback : setSelectedBRFeatureItems
					});

			}
		});

function getChargePrfCriteriaPopUp(index) {
	
	 sourceField = document.getElementById('criteriaList[' + index
			+ '].sourceFieldColumnName').value;
	var operator = document.getElementById('criteriaList[' + index
			+ '].operator').value;
	
	
	var comparisonValueDesc = document.getElementById('criteriaList[' + index
			+ '].comparisonValue').value;
	selectedValuesList = comparisonValueDesc;
	
	 eventViewState = eventViewStatenew;
	 
	 criteriaListValueDesc = new Array();
	 comparisonValue = new Array();
		
	var strUrl = 'services/chargeUnits/getCriteriaList.json';

	objChargePrfCriteriaPopUp = Ext.create('GCP.view.ChargePrfCriteriaPopUp', {
				itemId : 'ChargePrfCriteriaPopUp',
				storeUrl : strUrl,
				index : index,
				operator : operator
			});

	objChargePrfCriteriaPopUp.show();
}

function getChargePrfCriteriaViewPopUp(index,sourceFieldparam,operator,comparisonValueDesc) {
	sourceField = sourceFieldparam;
	selectedValuesList = comparisonValueDesc;
	
	 eventViewState = eventViewStatenew;
	var strUrl = 'services/chargeUnits/getCriteriaList.json';
	
	criteriaListValueDesc = new Array();
	comparisonValue = new Array();

	objChargePrfCriteriaPopUp = Ext.create('GCP.view.ChargePrfCriteriaPopUp', {
				itemId : 'ChargePrfCriteriaPopUp',
				storeUrl : strUrl,
				index : index,
				operator : operator
			});

	objChargePrfCriteriaPopUp.show();
	objChargePrfCriteriaPopUp.center();
}

function getChargePrfCommissionAccountPopUp() {
	objCrgPrfCommissionAccountPopUp = Ext.create(
			'GCP.view.ChargePrfCommissionAccountPopUp', {
				itemId : 'chargePrfCommissionAccountPopUp'
				// fnCallback : setSelectedBRFeatureItems
		});
	objCrgPrfCommissionAccountPopUp.show();
	objCrgPrfCommissionAccountPopUp.center();
}
