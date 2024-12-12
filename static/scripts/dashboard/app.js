Ext.Loader.setConfig({
	enabled : true,
	setPath: {
		//'Ext': 'static/js/extjs/src',
		//'Ext.calendar': 'static/js/extjs/src'
		
		'Ext': 'static/js/extjs4.2.1/src',
//		'Ext.calendar': 'static/js/extjs4.2.1/src',
		'Ext.ux': 'static/js/extjs4.2.1/src/ux'
	}
});

var globalWidgetsStore ;
var globalDashboardAccountsStore ;
var investmentAccountStore;
var globalLayoutType;
var showPageSettingsPopup;
var controllerMap = {
	"Home": "HomeSettingsController",
	"Account": "AccountSettingsController"
};

Ext.application({
	name : 'Cashweb',
	appFolder : 'static/scripts/dashboard/app',
//    appFolder : 'app',
	requires : ['Ext.layout.container.Column','Ext.layout.ColumnLayout','Cashweb.view.portal.PortletPanel', 'Ext.ux.form.ItemSelector', 'Ext.ux.form.MultiSelect', 'Ext.ux.portal.PortalPanel', 'Ext.dom.Element', 'Cashweb.controller.HomeSettingsController', 
	            'Ext.data.Store', 'Ext.grid.column.Action', 'Ext.ux.portal.PortalDropZone', 'Ext.ux.IFrame', 'Ext.chart.theme.Base', 'Cashweb.controller.AccountSettingsController', 'Cashweb.controller.PortletController', 'Ext.ux.Calendar'],
	controllers : ['SummaryController', 'MessageController','ReportController', 'NewsController', 'BroadcastController', 'UserActionController', 'PageSettingsController', 
	               'AccountsGraphController', 'ChartController','PaymentStatisticController','PaymentSchedules','InvestmentController','AccountSummaryController','PaymentsActivityController','PayPendingApprController','CashflowDebitController', 
	               'Cashweb.controller.CashflowCreditController','Cashweb.controller.UserActivityController','Cashweb.controller.PayCreatedByMeController','Cashweb.controller.ReportsForYouController'],
	launch: function(){
		var module = this.readCookie('module');
		var application = this;
			if(!Ext.isEmpty(controllerMap[module])) {// in order to load the accounts before the portlets are rendered
				var settingsController = application.getController(controllerMap[module]);
			} else {
				application.getController('PortletController');//.init(application);
		}
		Ext.Ajax.on('requestexception', function(con, resp, op, e){
			  if(resp.status == 403){
				window.location='logoutUser.action';
			  }
			});
	},
	readCookie: function(name) {
		var nameEQ = name + "=";
	  	var ca = document.cookie.split(';');
	  	for (var i=0;i < ca.length;i++)
		{
	    	var c = ca[i];
	    	while (c.charAt(0) == ' ') c = c.substring(1,c.length);
	    	if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	  	}
	  	return null;
	}
	
	                
});

