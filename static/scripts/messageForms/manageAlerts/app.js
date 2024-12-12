var objProfileView = null;
var objWidgetsSelectionPopup = null;
var adminFeatureProfileId = null;
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
	appFolder : 'static/scripts/messageForms/manageAlerts/app',
	// appFolder : 'app',
	requires : [ 'GCP.view.ManageAlertsView', 'GCP.view.ValueSelectionPopup' ],
	controllers : [ 'GCP.controller.ManageAlertsController' ],
	launch : function() {
		if ($('#manageAlertsDiv').length) {
			objProfileView = Ext.create('GCP.view.ManageAlertsView', {
				renderTo : 'manageAlertsDiv'
			});
		}

	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}

function getSelectValuePopup(derivationClass, index) {
	selectedValues = removeDuplicateEntries(mapSelectedValues[index]);
	mapSelectedValues[index] = selectedValues;
	if (Ext.isEmpty(objWidgetsSelectionPopup)) {
		objWidgetsSelectionPopup = Ext.create('GCP.view.ValueSelectionPopup', {
			itemId : 'valueSelectionPopup',
			fnCallback : setSelectedWidgetItems,
			title : getLabel('selectValues', 'Select Values'),
			columnName : getLabel('values', 'Values'),
			derivationClass : derivationClass,
			selectedValues : selectedValues,
			index : index
		});
		objWidgetsSelectionPopup.show();
	} else {
		objWidgetsSelectionPopup = null;
		objWidgetsSelectionPopup = Ext.create('GCP.view.ValueSelectionPopup', {
			itemId : 'valueSelectionPopup',
			fnCallback : setSelectedWidgetItems,
			title : getLabel('selectValues', 'Select Values'),
			columnName : getLabel('values', 'Values'),
			derivationClass : derivationClass,
			selectedValues : selectedValues,
			index : index
		});
		objWidgetsSelectionPopup.show();
	}
}

function removeDuplicateEntries(selectedValues)
{
	var newArray = new Array();
	selectedValues = selectedValues.split(","); 
	for ( var i = 0; i < selectedValues.length; i++) {
		var val = selectedValues[i];
		if (newArray.indexOf(val) == -1) {
			newArray.push(val);
		}
	}
	return newArray;
}

function setSelectedWidgetItems(records, blnIsUnselected, index) {
	var selectedWidgetItems = "";
	for ( var i = 0; i < records.length; i++) {
		var val = records[i];
		selectedWidgetItems = selectedWidgetItems + val;
		if (i < records.length - 1) {
			selectedWidgetItems = selectedWidgetItems + ',';
		}
	}
	mapSelectedValues[index] = selectedWidgetItems;
	for ( var key in mapSelectedValues) {
		var elementID = "alertDetailBeans" + key + "dataValue";
		$("#" + elementID).val(mapSelectedValues[key]);
	}
}

function showEditCustomAlertForm(recViewState) {
	var frm = document.getElementById("frmMain");
	frm.action = "showEditCustomAlertForm.srvc";
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'viewState',
			recViewState));
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showViewCustomAlertForm(recViewState, subscriptionType) {
	var frm = document.getElementById("frmMain");
	frm.action = "showViewCustomAlertForm.srvc";
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'viewState',
			recViewState));
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'subscriptionType',
			subscriptionType));
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function getLabel(key, defaultText) {
	return (manageAlertsLabelsMap && !Ext.isEmpty(manageAlertsLabelsMap[key])) ? manageAlertsLabelsMap[key]
			: defaultText
}