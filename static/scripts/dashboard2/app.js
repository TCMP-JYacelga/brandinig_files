Ext.Loader.setConfig({
			enabled : true,
			disableCaching : false,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});

var globalWidgetsStore;
var globalDashboardAccountsStore;
var investmentAccountStore;
var globalLayoutType;
var widgetPanel= null;
var showPageSettingsPopup;
var controllerMap = {
	"Home" : "HomeSettingsController",
	"Account" : "AccountSettingsController"
};

Ext.application({
			name : 'Cashweb',
			appFolder : 'static/scripts/dashboard2/app',
			// appFolder : 'app',
			requires : ['Ext.layout.container.Column',
					'Ext.layout.ColumnLayout',
					'Cashweb.view.portal.PortletPanel',
					'Ext.ux.form.ItemSelector', 'Ext.ux.form.MultiSelect',
					'Ext.ux.portal.PortalPanel', 'Ext.dom.Element',
					'Cashweb.controller.HomeSettingsController',
					'Ext.data.Store', 'Ext.grid.column.Action',
					'Ext.ux.portal2.PortalDropZone', 'Ext.ux.IFrame',
					'Ext.chart.theme.Base', 'Ext.ux.gcp.CheckCombo',
					'Cashweb.controller.AccountSettingsController',
					'Cashweb.controller.PortletController', 'Ext.ux.Calendar'],
			controllers : ['BroadcastController', 'PageSettingsController',
					'AccountSummaryController',	'PaymentsTrendController',
					'PayPendingApprController',	'PaymentsThisMonthController',
					'UserActivityController', 'PaymentRequestController',
					'DebitFailedPortletController', 'MessageController',
					'ReportsForYouController', 'WirePaymentController',
					'TxnThisMonthController', 'TransactionsPortletController',
					'DailyPaymentStatusController', 'BalancesGridController',
					'BalancesLineController', 'PaymentVolumeController',
					'FscOverdueLoansController', 'OverdueBillsController',
					'TradeOverdueLoansController', 'OverdueInvoicesController',
					'CashPositionDtlController', 'CashPositionStaticController',
					'PaymentBreakupController', 'LoansAccountsController',
					'PaymentsPipeController'],
			launch : function() {
				var application = this;
				application.getController('PortletController');
				Ext.Ajax.timeout = 600000;
				Ext.Ajax.on('requestexception', function(con, resp, op, e) {
							if (resp.status == 403) {
								window.location = 'logoutUser.action';
							}
						});
			},
			readCookie : function(name) {
				var nameEQ = name + "=";
				var ca = document.cookie.split(';');
				for (var i = 0; i < ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0) == ' ')
						c = c.substring(1, c.length);
					if (c.indexOf(nameEQ) == 0)
						return c.substring(nameEQ.length, c.length);
				}
				return null;
			}

		});



function resizeContentPanel() {
	if (!Ext.isEmpty(widgetPanel)) {
		widgetPanel.hide();
		widgetPanel.show();
	}	
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});