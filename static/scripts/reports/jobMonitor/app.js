var objJobMonitorNewUXView = null;
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
			appFolder : 'static/scripts/reports/jobMonitor/app',
			requires : ['Ext.ux.gcp.PreferencesHandler',
					'Ext.ux.gcp.GroupView', 'GCP.view.JobMonitorView','Ext.ux.gcp.vtypes.CustomVTypes'],
			controllers : ['GCP.controller.JobMonitorController'],
			init : function(application) {
				//Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
				Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
				prefHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				prefHandler.init(application);
			},
			launch : function() {
				Ext.Ajax.timeout = Ext.isEmpty(requestTimeout)
						? 600000
						: parseInt(requestTimeout,10) * 1000 * 60;

				Ext.Ajax.on('requestexception', function(con, resp, op, e) {
							if (resp.status == 403) {
								// window.location='logoutUser.action';
								location.reload();
							}
						});
				objJobMonitorNewUXView = Ext.create('GCP.view.JobMonitorView', {
							renderTo : 'jobMonitorDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objJobMonitorNewUXView)) {
		objJobMonitorNewUXView.hide();
		objJobMonitorNewUXView.show();
	}
}

function submitForm(strUrl) {
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.action = strUrl;
		document.body.appendChild(form);
		form.appendChild(createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
		form.submit();
		document.body.removeChild(form);
}

function createFormField(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	}