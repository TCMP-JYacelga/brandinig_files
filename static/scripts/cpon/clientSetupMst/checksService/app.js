var objCheckProfileSeek = null;
var objReportProfileFilterPopup = null;
var objAlertProfileFilterPopup = null;
var categoryStore = null;
var subCategoryStore = null;

Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});

Ext.Loader.setPath('GCP', 'static/scripts/cpon/common');

Ext.application({
			name : 'CPON',
			// appFolder : 'app',
			requires : ['GCP.view.copyCheckProfileSeek'],
			launch : function() {
				
				
/*				categoryStore = Ext.create('Ext.data.Store', {
							fields : ['name', 'value'],
							proxy : {
								type : 'ajax',
								url : 'cpon/cponseek/categoryList.json',
								reader : {
									type : 'json',
									root : 'd.filter'
								},
								noCache:false,
								actionMethods:  {
									create: "POST", 
									read: "POST", 
									update: "POST", 
									destroy: "POST"
								}
							},
							autoLoad : true
						});
						
				categoryStore.on('load',function(store){
					store.insert(0,{"name" : getLabel('all','ALL'), "value" : ""});
				});
				*/
				
				
				objCheckProfileSeek = Ext.create('GCP.view.copyCheckProfileSeek',
						{
							itemId : 'checkProfileSeek',
							title : getLabel('copycheckprofile', 'Copy Check Profile'),
							columnName : getLabel('checkfeatureprfname', 'Check Profile Name'),
							actionUrl : 'doCopyCheckProfile.form'
						});
				objReportProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objAlertProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
						
			}
		});

function showCheckProfileSeek() {
	if (null != objCheckProfileSeek) {
		objCheckProfileSeek.show();
	}
}

function showAlertsProfileFilterPopup(service,dropdownId,alertType){
	if (null != objAlertProfileFilterPopup){
		objAlertProfileFilterPopup.setService(service);
		objAlertProfileFilterPopup.setDropdownId(dropdownId);
		objAlertProfileFilterPopup.setDropdownType('A');
		objAlertProfileFilterPopup.setAlertType(alertType);
		objAlertProfileFilterPopup.show();
	}
}

function showReportsProfileFilterPopup(service,dropdownId){
	if (null != objReportProfileFilterPopup){
		objReportProfileFilterPopup.setService(service);
		objReportProfileFilterPopup.setDropdownId(dropdownId);
		objReportProfileFilterPopup.setDropdownType('R');
		objReportProfileFilterPopup.show();
	}
}

function showSelectedFields(service, dropdownId, dropdownType, seachType, category1, category2, alertType){
	var strUrl = 'cpon/clientServiceSetup/filterProfile.json';
	strUrl = strUrl + '?&type='+seachType+'&category='+category1+'&subcategory='+category2+'&service='+service+'&dropdownType='+dropdownType;
	
	strUrl = strUrl + '&alertType='+alertType;
	strUrl = strUrl + '&$viewmode='+viewmode;
	var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = {}, arrMatches, strGeneratedUrl;
	while (arrMatches = strRegex.exec(strUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
	}
	strGeneratedUrl = strUrl.substring(0, strUrl
							.indexOf('?'));
	strUrl=strGeneratedUrl;						
	Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						params:objParam,
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
							//console.log("Ajax Get data Call Failed");
						}

					});
}