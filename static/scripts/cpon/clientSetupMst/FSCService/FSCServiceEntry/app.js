var objInvEProfileFilterPopup = null;
var objFinancingProfileFilterPopup = null;
var objOverdueProfileFilterPopup = null;
var objEnrichmentsFilterPopup = null;
var objPackagesFilterPopup = null;
var objReportsFilterPopup = null;
var objCannedAlertsFilterPopup = null;
var objCustomAlertsFilterPopup = null;
Ext.Loader.setConfig({
			enabled : true,
			disableCaching : false,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
	name : 'CPON',
	appFolder : 'static/scripts/cpon/clientSetupMst/FSCService/FSCServiceEntry/app',
	requires : ['CPON.view.ScmProfileFilterPopup'],
	launch : function() {
	
		objInvEProfileFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		
		objFinancingProfileFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		
		objOverdueProfileFilterPopup= Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		
		objEnrichmentsFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		
		objPackagesFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		objReportsFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		objCannedAlertsFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});		
		objCustomAlertsFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		
	}
});


function showInvEProfileFilterPopup(service,dropdownId){
	if (null != objInvEProfileFilterPopup){
		objInvEProfileFilterPopup.setService(service);
		objInvEProfileFilterPopup.setDropdownId(dropdownId);
		objInvEProfileFilterPopup.setDropdownType('W');
		objInvEProfileFilterPopup.show();
	}
}

function showFinancingProfileFilterPopup(service,dropdownId){
	if (null != objFinancingProfileFilterPopup){
		objFinancingProfileFilterPopup.setService(service);
		objFinancingProfileFilterPopup.setDropdownId(dropdownId);
		objFinancingProfileFilterPopup.setDropdownType('F');
		objFinancingProfileFilterPopup.show();
	}
}

function showOverdueProfileFilterPopup(service,dropdownId){
	if (null != objOverdueProfileFilterPopup){
		objOverdueProfileFilterPopup.setService(service);
		objOverdueProfileFilterPopup.setDropdownId(dropdownId);
		objOverdueProfileFilterPopup.setDropdownType('O');
		objOverdueProfileFilterPopup.show();
	}
}

function showEnrichmentsFilterPopup(service,dropdownId, dropdownType){
	if (null != objEnrichmentsFilterPopup){
		objEnrichmentsFilterPopup.setService(service);
		objEnrichmentsFilterPopup.setDropdownId(dropdownId);
		objEnrichmentsFilterPopup.setDropdownType(dropdownType);
		objEnrichmentsFilterPopup.show();
	}
}

function showPackagesFilterPopup(service,dropdownId){
	if (null != objPackagesFilterPopup){
		objPackagesFilterPopup.setService(service);
		objPackagesFilterPopup.setDropdownId(dropdownId);
		objPackagesFilterPopup.setDropdownType('P');
		objPackagesFilterPopup.show();
	}
}
function showReportsFilterPopup(service,dropdownId){
	if (null != objReportsFilterPopup){
		objReportsFilterPopup.setService(service);
		objReportsFilterPopup.setDropdownId(dropdownId);
		objReportsFilterPopup.setDropdownType('R');
		objReportsFilterPopup.show();
	}
}
function showCannedAlertsFilterPopup(service,dropdownId){
	if (null != objCannedAlertsFilterPopup){
		objCannedAlertsFilterPopup.setService(service);
		objCannedAlertsFilterPopup.setDropdownId(dropdownId);
		objCannedAlertsFilterPopup.setDropdownType('N');
		objCannedAlertsFilterPopup.show();
	}
}
function showCustomAlertsFilterPopup(service,dropdownId){
	if (null != objCustomAlertsFilterPopup){
		objCustomAlertsFilterPopup.setService(service);
		objCustomAlertsFilterPopup.setDropdownId(dropdownId);
		objCustomAlertsFilterPopup.setDropdownType('U');
		objCustomAlertsFilterPopup.show();
	}
}
function showSelectedFields(service, dropdownId, dropdownType, seachType, category1, category2){
	var strUrl = 'services/fscScmProduct/filterProfile.json';
	strUrl = strUrl + '?&id='+encodeURIComponent(parentkey);
	strUrl = strUrl + '&type='+seachType+'&category='+category1+'&subcategory='+category2+'&service='+service+'&dropdownType='+dropdownType+'&productCode='+productCode;
	Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						success : function(response) {
							var data = Ext.decode(response.responseText);
							var combo = document.getElementById(dropdownId);
							combo.innerHTML="";
							var option = document.createElement("option");
								option.text = getLabel('select','Select');
								option.value = '';
								combo.appendChild(option);
							for(var i =0;i<data.length;i++)
							{
								var option = document.createElement("option");
									option.text = data[i].profile_name;
									option.value = data[i].profile_id;									
								combo.appendChild(option);
							}
						},
						failure : function(response) {
						}
					});
}
