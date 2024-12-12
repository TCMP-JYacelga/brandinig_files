Ext.define('Cashweb.controller.InvestmentController',{
	extend : 'Ext.app.Controller',
	xtype : 'investmentcontroller',
	views : [ 'portlet.InvestmentPortlet' ],
	stores : [ 'InvestmentGraphStore','InvestmentAccountStore'],
	models : [ 'InvestmentGraphmodel', 'InvestmentAccountModel' ],
	refs : [{
		ref : 'graphPortlet',
		selector : 'investment'
	},
	{
		ref: 'investmentRefreshTool',
		selector: 'portlet tool[itemId=investment_refresh]'
	},
	{
		ref : 'graphCombo',
		selector : '#investment_widget_combo'
	},
	{
		ref: 'toggleButton',
		selector: 'button[action=DateToggle]'
	},
	{
		ref: 'defaultDate',
		selector: '#1month'
	},
	{
		ref : 'graph',
		selector : 'investment chart'
	},
	{
		ref: 'investmentGrid',
		selector: 'investment investmentdatagrid'
	}],
	dateFilter: null,
	init : function() {
		this.control({
			'investment' : {
				render : this.onGraphPortletRender,
				afterrender: this.afterGraphRender
			},
			'investment combobox[itemId=investment_widget_combo]': {
				'select' : this.onInvestmentAccountSelect
			},
			'button[action=DateToggle]': {
			  click: this.toggleDateFilter
			 }
		});
	},
	onGraphPortletRender: function() {
	this.getInvestmentRefreshTool().on('click', this.portletRefresh, this);
	this.getGraphPortlet().ownerCt.setLoading({msg : label_map.loading});
	var accountstore = Ext.create('Cashweb.store.InvestmentAccountStore');
	var thisClass = this;
	 Ext.Ajax.request({
			url : './getInvestmentAccount.rest',
			success : function(response) {
				if(!Ext.isEmpty(response.responseText))
				{
					obj = Ext.decode(response.responseText);
					accountstore.loadData(obj.investmentAccount);
					accountstore.config.investmentAccountViewstate = obj.investmentAccountViewState;
					thisClass.investmentAccountsLoaded(accountstore);
				}
				thisClass.getGraphPortlet().ownerCt.setLoading(false);
			},
			failure : function(response) {
				thisClass.getGraphPortlet().ownerCt.setLoading(false);
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
	
	investmentAccountsLoaded : function (store){
		var accountCombo = this.getGraphCombo();
		if(!(Ext.isEmpty(accountCombo) || Ext.isEmpty(this.getGraphPortlet()))) {
			if(Ext.isEmpty(store) || store.getCount() == 0) {
				this.getGraphPortlet().removeAll(true);
				this.getGraphPortlet().update('<div class="no-data">'+ label_map.noDataFound +'</div>');
				accountCombo.setVisible(false);
				this.getGraphPortlet().ownerCt.setLoading(false);
			} else { 
				accountCombo.store = store;
				accountCombo.select(store.getAt(0));
				accountCombo.setValue(store.getAt(0).get('account'));
				accountCombo.fireEvent('select', accountCombo, [store.getAt(0)]);
				accountCombo.setVisible(true);
				this.getGraph().setVisible(true);
			}
		}
	},
	onInvestmentAccountSelect: function(combo,record) {
		this.getGraphPortlet().ownerCt.setLoading(true);
		var selectedIndex = this.getGraphCombo().getStore().indexOf(record[0]);
		this.getDefaultDate().toggle(true, false);
		this.dateFilter = this.getDefaultDate().getText();
		this.getGraphData(selectedIndex, this.dateFilter);
	},
	getGraphData: function(selectedIndex, dateFilterValue) {
		var investmentAccountViewstate = this.getGraphCombo().getStore().config.investmentAccountViewstate;
		var thisClass = this;
		var graphData = [], gridData = [];
		Ext.Ajax.request({
			url : './getInvestmentGraphData.rest',
			params : {
				txtIndex : selectedIndex,
				viewstate: investmentAccountViewstate,
				dateValue: dateFilterValue
			 },
			success: function(response) {
				var fromDate = null;
				var toDate = null;
				
				if(!Ext.isEmpty(response.responseText)){
						
					var combostore = thisClass.getGraphCombo().getStore();

					var accontno = combostore.getAt(selectedIndex).get('account');
					var accountdet = combostore.getAt(selectedIndex).get('descrption');
					var currency = combostore.getAt(selectedIndex).get('currency');
				
					var responseObj = Ext.decode(response.responseText);
					var datesArray = responseObj.graphData[0].dates;
					var purchaseArray = responseObj.graphData[0].purchase;
					var redeemArray = responseObj.graphData[0].redeem;
					
					var currentvalue = (responseObj.accountData.availableUnits)* (responseObj.accountData.netAssetValue);
					
					var newarray = purchaseArray.concat(redeemArray);
					var maxvalue = newarray[0];
					for(var i=0 ; i<newarray.length ; i++)
					{
						if(newarray[i] > maxvalue)
							maxvalue = newarray[i];
					}
					thisClass.getGraph().axes.getAt(0).maximum = maxvalue;
					
					if(datesArray.length > 0 && purchaseArray.length > 0 && redeemArray.length > 0 ) {
							for(var index =0; index < datesArray.length; index++){
								graphData.push({
									dates : datesArray[index],
									purchase : purchaseArray[index],
									redeem : redeemArray[index]
								});
							}
										
						} else {
							graphData.push({
								dates : 0,
								purchase : 0,
								redeem : 0
							});
						}
						var dataPanel = thisClass.getGraphPortlet().down('panel[itemId=AccountDetail]');
						
						dataPanel.update('<div class="account-detail">'+accountdet+' - '+'['+accontno+']'+' - '+'['+currency+']'+'</div>');
						
						if(null != responseObj.accountData.availableUnits)
						{
							gridData.push({
								title: label_map.availableunits,
								value: responseObj.accountData.availableUnits
							});
						}
						if(null != responseObj.accountData.netAssetValue)
						{
							gridData.push({
								title: label_map.netassetvalue,
								value: responseObj.accountData.netAssetValue
							});
						}
						if(null != currentvalue)
						{
							gridData.push({
								title: label_map.currentvalue,
								value: currentvalue
							});
						}
						if(null != responseObj.graphData[0].totalPurchase) 
						{
							gridData.push({
								title: label_map.totalpurchase,
								value: responseObj.graphData[0].totalPurchase
							});
						}
						if(null != responseObj.graphData[0].totalRedeem)
						{
							gridData.push({
								title: label_map.totalredeem,
								value: responseObj.graphData[0].totalRedeem
							});
						}
						thisClass.getGraph().surface.removeAll();
						thisClass.getInvestmentGrid().config.currency = currency;
						thisClass.getGraph().getStore().loadData(graphData);
						thisClass.getInvestmentGrid().getStore().loadData(gridData);
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
				thisClass.getGraphPortlet().ownerCt.setLoading(false);
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
			var record = this.getGraphCombo().getStore().findRecord('account', this.getGraphCombo().getRawValue());
			var selectedIndex = this.getGraphCombo().getStore().indexOf(record);
			this.dateFilter = btn.getText();
			this.getGraph().ownerCt.setLoading(true);
			this.getGraphData(selectedIndex, this.dateFilter);
		}
		btn.toggle(true, false);
	},
	afterGraphRender: function() {
		if(this.getInvestmentRefreshTool().record.get('refreshType') == "A") {
			this.handleGraphAutoRefresh(this.getInvestmentRefreshTool().record);
		}
	},
	portletRefresh: function() {
		if(this.mask != null)
		{
			this.mask.hide();
			Ext.destroy(this.mask);
		}
		this.getGraphPortlet().ownerCt.setLoading({msg : label_map.loading});
		var record = this.getGraphCombo().getStore().findRecord('account', this.getGraphCombo().getRawValue());
		var selectedIndex = this.getGraphCombo().getStore().indexOf(record);
		this.getGraphData(selectedIndex, this.dateFilter);
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