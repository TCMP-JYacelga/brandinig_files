var objWorkflowsFilterPopup = null;
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
	appFolder : 'static/scripts/cpon/counterParty/counterPartyEntry/app',
	requires : ['CPON.view.ScmProfileFilterPopup'],
	launch : function() {
	
		objWorkflowsFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
	}
});


function showWorkflowsFilterPopup(service,dropdownId){
	if (null != objWorkflowsFilterPopup){
		objWorkflowsFilterPopup.setService(service);
		objWorkflowsFilterPopup.setDropdownId(dropdownId);
		objWorkflowsFilterPopup.setDropdownType('W');
		objWorkflowsFilterPopup.show();
	}
}

function showSelectedFields(service, dropdownId, dropdownType, seachType, category1, category2){
	var strUrl = 'services/fscScmProduct/filterProfile.json';
	strUrl = strUrl + '?&id='+encodeURIComponent(parentkey);
	strUrl = strUrl + '&type='+seachType+'&category='+category1+'&subcategory='+category2+'&service='+service+'&dropdownType='+dropdownType;
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
