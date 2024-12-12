Ext.define('Cashweb.controller.PaymentStatisticController', {
	extend : 'Ext.app.Controller',
	xtype : 'PaymentStatisticController',
	views : ['Cashweb.view.portlet.PaymentStatistics'],
	requires : ['Cashweb.store.PaymentStatisticChartStore','Cashweb.store.CurrencyStore','Cashweb.model.PaymentStatisticChartModel'],
	mask:null,
	refs : [{
				ref : 'paymentstatistics',
				selector : 'pay_stat'
			}, {
				ref: 'currencyCombo',
				selector: 'pay_stat combobox[itemId=currencycombo]'
			},
			{
				ref : 'chart',
				selector : 'pay_stat chart'
			},
			{
				ref: 'chartRefreshTool',
				selector: 'portlet tool[itemId=pay_stat_refresh]'
			}],
			
	init : function() {
			this.control({
			'pay_stat': {
				render: this.portletRendered,
				afterrender: this.afterChartRender,
				boxready: this.onBoxReady
			},
			'pay_stat combobox[itemId=currencycombo]': {
				'change' : this.currencycombochange
			}
		});
	},
	onBoxReady: function(portlet) {
		portlet.ownerCt.setLoading(label_map.loading);
	},
	portletRendered: function(portlet) {
	this.getChartRefreshTool().on('click', this.portletRefresh, this);
	var currencystore = Ext.create('Cashweb.store.CurrencyStore');
	currencystore.on('load', this.currencyStoreLoaded, this);
	},
	currencyStoreLoaded: function(store) {
		var currencyCombo = this.getCurrencyCombo();
		if(!(Ext.isEmpty(currencyCombo) || Ext.isEmpty(this.getPaymentstatistics()))) {
			if(Ext.isEmpty(store) || store.getCount() == 0) {
				this.getPaymentstatistics().removeAll(true);
				this.getPaymentstatistics().update('<div class="no-data">'+ label_map.noDataFound +'</div>');
				currencyCombo.setVisible(false);
				this.getPaymentstatistics().ownerCt.setLoading(false);
			} else { 
				currencyCombo.store = store;
				currencyCombo.select(store.getAt(0));
				currencyCombo.setValue(store.getAt(0).get('ccy_code'));
				currencyCombo.setVisible(true);
				this.getChart().setVisible(true);
			}
		}
	}, 
	currencycombochange : function(combo, newVal){
		this.getPaymentstatistics().ownerCt.setLoading(label_map.loading);
		this.paymentstatisticschart(newVal);
	},
	paymentstatisticschart : function(selectedvalue)
	{
		var thisclass = this;
		var chartData = [];
		Ext.Ajax.request({
			url : './getPaymentStatistics.rest',
			params : {
				currency : selectedvalue
			 },
			success: function(response) {
				
					if(!Ext.isEmpty(response.responseText)){
						responseObj = Ext.decode(response.responseText);
						
						var fromDate = responseObj.paymentStats[0].FromDate;
						var newDate = Ext.Date.parse(fromDate,dateFormat);
						var newfromDate = Ext.Date.format(newDate,'M, Y');
						thisclass.getChart().series.getAt(0).setTitle(newfromDate);
		
						var toDate = responseObj.paymentStats[0].ToDate;
						var newDate1 = Ext.Date.parse(toDate, dateFormat);
						var newtoDate = Ext.Date.format(newDate1,'M, Y');
						thisclass.getChart().series.getAt(1).setTitle(newtoDate);

						var Daynum = responseObj.paymentStats[0].data.DayNum;
						var Daynum1 = responseObj.paymentStats[0].data.DayNum1;
						var data1 = responseObj.paymentStats[0].data.data1;
						var data2 = responseObj.paymentStats[0].data.data2;
						
						if( Daynum.length > Daynum1.length) 
						{
							for(var i =0; i < Daynum.length ; i++){
								chartData.push({
									DayNum : Daynum[i],
									data2 : data2[i]
									
								});
							}
							for(var j =0; j < Daynum1.length ; j++){
								chartData[j].DayNum1 = Daynum1[j];
								chartData[j].data1 = data1[j];
							}
						}
						else 
						{
							for(var j =0; j < Daynum1.length ; j++){
								chartData.push({
									DayNum1 : Daynum1[j],
									data1 : data1[j]
									
								});
								
							}
							
							for(var i =0; i < Daynum.length ; i++){
								chartData[i].DayNum = Daynum[i];
								chartData[i].data2 = data2[i];
							}
						}
												
						thisclass.getChart().surface.removeAll();
						thisclass.getChart().getStore().loadData(chartData);
						var bottomAxis = thisclass.getChart().axes.get('bottom');
						bottomAxis.setTitle(label_map.payScheduleXAxis);
						var leftAxis = thisclass.getChart().axes.get('left');
						leftAxis.setTitle(label_map.payScheduleYAxis);
						thisclass.getChart().redraw(true);				
						thisclass.getPaymentstatistics().ownerCt.setLoading(false);
						
					}
			},
		    failure : function(response) {
		    	thisclass.getPaymentstatistics().ownerCt.setLoading(false);
		    	var myref = thisclass.getPaymentstatistics();
				thisclass.mask = new Ext.LoadMask(myref ,{msgCls:'error-msg'});
				if (response.timedout) {
					thisclass.mask.msg=label_map.timeoutmsg;
					
				} else if (response.aborted) {
					thisclass.mask.msg=label_map.abortmsg;
					
				} else {
					 if(response.status === 0)
					{
						thisclass.mask.msg=label_map.serverStopmsg;
					}
					else
					thisclass.mask.msg=response.statusText;
					
				}
				thisclass.mask.show();	
		    }
		});
	},
	portletRefresh: function() {
		var currencyCombo = this.getCurrencyCombo();
		var currency = currencyCombo.getValue();
		if(!Ext.isEmpty(currency)) {
			if(this.mask != null)
			{
			this.mask.hide();
			Ext.destroy(this.mask);
			}
			this.getPaymentstatistics().ownerCt.setLoading(label_map.loading);
			this.paymentstatisticschart(currency);
		}
	},
	afterChartRender: function() {
		if(this.getChartRefreshTool().record.get('refreshType') == "A") {
			this.handleAutoRefresh(this.getChartRefreshTool().record);
		}
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
		this.getPaymentstatistics().taskRunner = taskRunner;
	}
	
	
});