Ext.define('Cashweb.controller.AccountsGraphController', {
	extend : 'Ext.app.Controller',
	xtype : 'accountsgraphcontroller',
	views : [ 'portlet.AccountGraphPortlet' ],
	stores : [ 'AccountsGraphStore' ],
	models : [ 'AccountModel', 'AccountsGraphModel' ],
	requires : [ 'Cashweb.store.AccountStore' ],
	mask:null,
	refs : [ {
		ref : 'graphPortlet',
		selector : 'cashposition'
	},{
		ref : 'graphCombo',
		selector : '#cashposition_widget_combo'
	},{
		ref : 'graph',
		selector : 'cashposition chart'
	}, {
		ref: 'toggleButton',
		selector: 'button[action=dateToggle]'
	}, {
		ref: 'cashpositiondatapanel',
		selector: 'cashpositiondatapanel'
	}, {
		ref: 'ledgerField',
		selector: '#opledger'
	}, {
		ref: 'availableField',
		selector: '#opavlbl'
	},
	{
		ref: 'defaultDate',
		selector: '#one_mnth'
	}, {
		ref: 'cashpositionGrid',
		selector: 'cashposition cashpositiondatagrid'
	}, {
		ref: 'cashpositionRefreshTool',
		selector: 'portlet tool[itemId=cashposition_refresh]'
	} ],
	dateFilter: null,
	init : function() {
		this.control({
			'cashposition' : {
				render : this.onGraphPortletRender,
				afterrender: this.afterGraphRender
			},
		
		  '#cashposition_widget_combo' : { select : this.onUserAccountSelect },
		  'button[action=dateToggle]': {
			  click: this.toggleDateFilter
		  }
		 
		});
	},
	onGraphPortletRender: function() {
		this.getCashpositionRefreshTool().on('click', this.portletRefresh, this);
		this.getGraphPortlet().ownerCt.setLoading({msg : label_map.loading});
		this.dashboardAccountsLoaded(globalDashboardAccountsStore);
	},
	afterGraphRender: function() {
		if(this.getCashpositionRefreshTool().record.get('refreshType') == "A") {
			this.handleGraphAutoRefresh(this.getCashpositionRefreshTool().record);
		}
	},
	dashboardAccountsLoaded : function (store){
		var graphCombo = this.getGraphCombo();
			graphPortlet = this.getGraphPortlet();
		if(!(Ext.isEmpty(graphCombo) || Ext.isEmpty(graphPortlet)) ) {
			if(store.getCount() > 0) {
				graphCombo.setValue(store.getAt(0).get('id'));
				graphCombo.select(store.getAt(0));
				graphCombo.fireEvent('select', graphCombo, [store.getAt(0)]);
				graphCombo.setVisible(true);
				this.getGraph().setVisible(true);
			} else {
				this.getGraphPortlet().removeAll(false);
				this.getGraphPortlet().update('<div class="no-data">'+  label_map.noDataFound  +'</div>');
				this.getGraphCombo().setVisible(false);
				this.getGraphPortlet().ownerCt.setLoading(false);
			}
			this.getGraphPortlet().setVisible(true);
		}
	},
	
	onUserAccountSelect: function(combo, records, eOpts) {
		this.getGraphPortlet().ownerCt.setLoading(true);
		var selectedIndex = combo.getStore().indexOf(records[0]);
		this.getDefaultDate().toggle(true, false);
		this.dateFilter = this.getDefaultDate().getText();
		this.getAccountSummaryData(selectedIndex, this.dateFilter);
	},
	
	getAccountSummaryData: function(selectedIndex, dateFilterValue) {
		var dashboardAccountViewstate = this.getGraphCombo().getStore().config.dashboardAccountViewstate;
		var thisClass = this;
		var graphData = [], balancesLabels = [];
		Ext.Ajax.request({
			url : './getAccountSummaryData.rest',
			params : {
				txtIndex : selectedIndex,
				viewstate: dashboardAccountViewstate,
				dateField: dateFilterValue
			 },
			success: function(response) {
				var fromDate = null;
				var toDate = null;
				if(!Ext.isEmpty(response.responseText)){
					var responseObj = Ext.decode(response.responseText);
					var datesArray = responseObj.graphdata[0].dates;
					var balencesArray = responseObj.graphdata[0].balances;
					var currency = "";
					if(datesArray.length > 0 && balencesArray.length > 0) {
							for(var index =0; index < datesArray.length; index++){
								graphData.push({
									dates : datesArray[index],
									balances : balencesArray[index]
								});
							}
										
						} else {
							graphData.push({
								dates : 0,
								balances : 0
							});
						}
						var dataPanel = thisClass.getGraphPortlet().down('panel[itemId=account-data]');
						dataPanel.update('<div class="account-detail">'+responseObj.accountInfo[0].accDescription+' - ' + thisClass.getGraphCombo().getRawValue()+'</div>');
						if(!Ext.isEmpty(responseObj.accountInfo[0])) {
							currency = responseObj.accountInfo[0].accCurrency;
						} else {
							currency = responseObj.graphdata[0].currency;
						}
						
						if(null != responseObj.graphdata[0].opening_ledger_balance) 
						{
							balancesLabels.push({
								title: label_map.openingledger,
								value: responseObj.graphdata[0].opening_ledger_balance
							});
						}
						if(null != responseObj.graphdata[0].opening_current_balance)
						{
							balancesLabels.push({
								title: label_map.openingavailable,
								value: responseObj.graphdata[0].opening_current_balance
							});
						}
						if(null != responseObj.debitCreditArray[0].creditAmount)
						{
							balancesLabels.push({
								title: label_map.credits,
								value: responseObj.debitCreditArray[0].creditAmount
							});
						}
						if(null != responseObj.debitCreditArray[0].debitAmount)
						{
							balancesLabels.push({
								title: label_map.debits,
								value: responseObj.debitCreditArray[0].debitAmount
							});
						}
						thisClass.getGraph().surface.removeAll();
						thisClass.getCashpositionGrid().config.currency = currency;
						thisClass.getCashpositionGrid().config.creditCount = responseObj.debitCreditArray[0].creditCount;
						thisClass.getCashpositionGrid().config.debitCount = responseObj.debitCreditArray[0].debitCount;
						thisClass.getGraph().getStore().loadData(graphData);
						thisClass.getCashpositionGrid().getStore().loadData(balancesLabels);
						thisClass.getGraph().redraw();
			  }
				
				thisClass.getGraph().ownerCt.setLoading(false);
				thisClass.getGraphPortlet().ownerCt.setLoading(false);
			},
		    failure : function(response) {
				if(null != thisClass.getGraph())
				{
					thisClass.getGraph().ownerCt.setLoading(false);
				}
				if(null != thisClass.getGraphPortlet())
				{
				thisClass.getGraphPortlet().ownerCt.setLoading(false);
				}
				var viewref = thisClass.getGraphPortlet();
				thisClass.mask = new Ext.LoadMask(viewref ,{msgCls:'error-msg'});	
				if (response.timedout) {
					thisClass.mask.msg=label_map.timeoutmsg;				
				} else if (response.aborted) {
					 thisClass.mask.msg=label_map.abortmsg;
				} else {
					if(response.status === 0)
					{
						thisClass.mask.msg=label_map.serverStopmsg;
					}
					else
					thisClass.mask.msg=response.statusText;
				}
				thisClass.mask.show();
		    }
		});
	},
	
	toggleDateFilter: function(btn, event, opts) {
		if(btn.pressed == true) {
			var record = this.getGraphCombo().getStore().findRecord('account_number', this.getGraphCombo().getRawValue());
			var selectedIndex = this.getGraphCombo().getStore().indexOf(record);
			this.dateFilter = btn.getText();
			this.getGraph().ownerCt.setLoading(true);
			this.getAccountSummaryData(selectedIndex, this.dateFilter);
		}
		btn.toggle(true, false);
	},
	
	portletRefresh: function() {
		if(this.mask != null)
		{
			this.mask.hide();
			Ext.destroy(this.mask);
		}
		this.getGraphPortlet().ownerCt.setLoading({msg : label_map.loading});
		var record = this.getGraphCombo().getStore().findRecord('account_number', this.getGraphCombo().getRawValue());
		var selectedIndex = this.getGraphCombo().getStore().indexOf(record);
		this.getAccountSummaryData(selectedIndex, this.dateFilter);
	},
	handleGraphAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: portlet.portletRefresh,
			interval: record.get('refreshInterval') * 1000,
			scope: portlet
		});
		task.start();
		this.getGraphPortlet().taskRunner = taskRunner;
	}
});