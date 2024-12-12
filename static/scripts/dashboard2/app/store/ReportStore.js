Ext.define('Cashweb.store.ReportStore', {
			extend : 'Ext.data.Store',
			model : 'Cashweb.model.ReportModel',
			autoLoad : false,
			config : {
				dashboardReportsViewState : null
			},
			proxy : {
				type : 'ajax',
				url : './getMyReports.rest',
				reader : {
					type : 'json',
					root : 'reports',
					successProperty : 'success'
				}
			}
		});