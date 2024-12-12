Ext.define('Cashweb.controller.ChartController', {
	extend : 'Ext.app.Controller',
	xtype : 'chartController',
	views : ['portlet.ChartPortlet'],
	stores : ['ChartStore'],
	models : ['AccountModel', 'ChartModel'],
	requires : ['Cashweb.store.AccountStore'],
	mask:null,
	refs : [{
				ref : 'chartPortlet',
				selector : 'cashflow'
			}, {
				ref : 'chart',
				selector : 'cashflow chart'
			}, {
				ref : 'chartCombo',
				selector : '#cashflow_widget_combo'
			}, {
				ref : 'transactionsGrid',
				selector : 'transactionsgrid'
			},
			{
				ref: 'toggleButton',
				selector: 'button[action=cashflowdateToggle]'
			},{
				ref: 'defaultDate',
				selector: '#1_mnth'
			}, {
				ref: 'chartRefreshTool',
				selector: 'portlet2 tool[itemId=cashflow_refresh]'
			}
			],
	dateFilter: null,
	init : function() {
		this.control({
					'cashflow' : {
						render : function(component, eOpts){this.onChartPortletRender(component, eOpts);},
						afterrender: function(component, eOpts){this.afterChartRender();}
					},
					'#cashflow_widget_combo' :  { select : this.onAccountSelect },
					'button[action=cashflowdateToggle]':{
												  click: this.toggleDateFilter
												}
				});
	},
	onChartPortletRender : function(component, eOpts) {
		this.getChartRefreshTool().on('click', this.portletRefresh, this);
		this.getChartPortlet().ownerCt.setLoading({msg : label_map.loading});
		this.afterDashboardAccountsLoad(globalDashboardAccountsStore);
	},
	afterChartRender: function() {
		if(this.getChartRefreshTool().record.get('refreshType') == "A") {
			this.handleAutoRefresh(this.getChartRefreshTool().record);
		}
	},
	afterDashboardAccountsLoad : function (store){
		var chartCombo = this.getChartCombo(),
			chartPortlet = this.getChartPortlet();
			
		if(!(Ext.isEmpty(chartCombo) || Ext.isEmpty(chartPortlet)) ){
			if(store.getCount() > 0){
				var records = store.getRange(0, store.getCount());
				chartCombo.setValue(store.getAt(0).get('id'));
				chartCombo.select(store.getAt(0));
				chartCombo.fireEvent('select', chartCombo, [store.getAt(0)]);
				chartCombo.setVisible(true);
				this.getChart().setVisible(true);
			} else {
				this.getChartPortlet().removeAll(true);
				try{
				if(!Ext.isEmpty(this.getChartPortlet())){
					this.getChartPortlet().add({
							html  : '<div class="no-data">'+ label_map.noDataFound +'</div>'
					});
				}
				} catch (v) {
						}
				this.getChartCombo().setVisible(false);
				this.getChartPortlet().ownerCt.setLoading(false);
			}
			this.getChartPortlet().setVisible(true);
		}
	},
	onAccountSelect : function (combo, records, eOpts){
		this.getChartPortlet().ownerCt.setLoading(true);
		var selectedIndex = combo.getStore().indexOf(records[0]);
		this.getDefaultDate().toggle(true, false);
		this.dateFilter = this.getDefaultDate().getText();
		this.getLastFiveTransactionsForSelectedAccount(selectedIndex);
		this.changeChartData(selectedIndex ,this.dateFilter);
	},
	getLastFiveTransactionsForSelectedAccount : function(selectedIndex){
		var dashboardAccountViewstate = this.getChartCombo().getStore().config.dashboardAccountViewstate;
		var obj;
		var thisClass = this;
		Ext.Ajax.request({
			 url : './getLastFiveTransactionsForAccount.rest',
			 method : "POST",
			 params : {
				 txtIndex : selectedIndex,
				 viewstate: dashboardAccountViewstate
			 },
			success : function(response) {
				if(!Ext.isEmpty(response.responseText)){
					obj = Ext.decode(response.responseText);
				}
				thisClass.getTransactionsGrid().config.currency = obj.accountInfo[0].accCurrency;
				if(null != obj.trans)
					thisClass.getTransactionsGrid().getStore().loadData(obj.trans);
			},
			failure : function(response) {
				thisClass.getTransactionsGrid().setLoading(false);
				var myref = thisClass.getChartPortlet();
				thisClass.mask = new Ext.LoadMask(myref ,{msgCls:'error-msg'});	
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
	changeChartData : function (selectedIndex ,dateFilterValue){
		var dashboardAccountViewstate = this.getChartCombo().getStore().config.dashboardAccountViewstate;
		var chartData = [], i;
		var thisClass = this;
		var responseObj;
		Ext.Ajax.request({
			url : './getCashflowChartData.rest',
			params : {
				 txtIndex : selectedIndex,
				 viewstate: dashboardAccountViewstate,
				 dateField: dateFilterValue
			 },
			success: function(response) {
					if(!Ext.isEmpty(response.responseText)){
						responseObj = Ext.decode(response.responseText);
						var labelArray = responseObj.graphdata[0].dates;
						var balArray = responseObj.graphdata[0].balances;
	            		var maximum = 0;

							if(labelArray.length > 0 && balArray.length > 0) {
								for(var index =0; index < labelArray.length; index++){
									chartData.push({
										labels : labelArray[index],
										balances : balArray[index]
									});
									if(balArray[index] > maximum)
	            						maximum = balArray[index];
								}
								
							} else {
								chartData.push({
									dates : 0,
									balances : 0
								});
							}
							if(maximum > 0)
								thisClass.getChart().maximum = maximum;
							thisClass.getChart().surface.removeAll();
							thisClass.getChart().getStore().loadData(chartData);
				}
					thisClass.getChart().ownerCt.setLoading(false);
					thisClass.getChartPortlet().ownerCt.setLoading(false);
			},
		    failure : function(response) {
				if(null != thisClass.getChart())
				{
					thisClass.getChart().ownerCt.setLoading(false);
				}
				if(null != thisClass.getChartPortlet())
				{
					thisClass.getChartPortlet().ownerCt.setLoading(false);
				}
				var myref = thisClass.getChartPortlet();
				thisClass.mask = new Ext.LoadMask(myref ,{msgCls:'error-msg'});	
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
			var record = this.getChartCombo().getStore().findRecord('account_number', this.getChartCombo().getRawValue());
			var selectedIndex = this.getChartCombo().getStore().indexOf(record);
			this.dateFilter = btn.getText();
			this.getChart().ownerCt.setLoading(true);
			this.changeChartData(selectedIndex ,this.dateFilter);
		}
		btn.toggle(true, false);
	},
	
	portletRefresh: function() {
		if(this.mask != null)
		{
			this.mask.hide();
			Ext.destroy(this.mask);
		}
		this.getChartPortlet().ownerCt.setLoading({msg : label_map.loading});
		var record = this.getChartCombo().getStore().findRecord('account_number', this.getChartCombo().getRawValue());
		var selectedIndex = this.getChartCombo().getStore().indexOf(record);
		this.changeChartData(selectedIndex, this.dateFilter);
		this.getLastFiveTransactionsForSelectedAccount(selectedIndex);
	},
	handleAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: portlet.portletRefresh,
			interval: record.get('refreshInterval') * 1000,
			scope: portlet
		});
		task.start();
		this.getChartPortlet().taskRunner = taskRunner;
	}
});