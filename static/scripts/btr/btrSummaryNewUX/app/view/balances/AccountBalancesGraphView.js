/**
 * @class GCP.view.balances.AccountBalancesGraphView
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.balances.AccountBalancesGraphView', {
	extend : 'Ext.panel.Panel',
	xtype : 'accountBalancesGraphView',
	requires : ['Ext.data.JsonStore', 'Ext.chart.series.Column',
			'Ext.chart.series.Bar', 'Ext.chart.theme.Base',
			'Ext.chart.series.Series', 'Ext.chart.series.Line',
			'Ext.chart.axis.Numeric', 'Ext.button.Button',
			'Ext.chart.axis.Category', 'Ext.chart.axis.Axis'],
	border : false,
	layout : 'vbox',
	padding : '5 0 0 0',
	cls : 'ux_panel-transparent-background xn-pad-10 ux_border-top',
	responseObj : null,
	initComponent : function() {
		var thisClass = this;
		var graphStore = Ext.create('Ext.data.Store', {
			extend : 'Ext.data.Store',
			fields: ['dates', 'balances'],
			autoLoad : false
			 
		});
		var graphObj = Ext.create('Ext.chart.Chart', {
					itemId : 'balancesChart',
					width : '100%',
					height : 200,
					animate : true,
					store : graphStore,
					axes : [{
								type : 'Numeric',
								position : 'left',
								fields : ['balances'],
								grid : true,
								minimum : 0,
								title : getLabel('balances', 'Balances'),
								labelTitle : {
									font : '18px calibri, helvetica, arial, sans-serif'
								},
								label : {
									font : '11px calibri, helvetica, arial, sans-serif'
								}
							}, {
								type : 'Category',
								position : 'bottom',
								fields : ['dates'],
								title : getLabel('summarydate', 'Summary Date'),
								labelTitle : {
									font : '18px calibri, helvetica, arial, sans-serif'
								},
								label : {
									font : '11px calibri, helvetica, arial, sans-serif'
								}
							}],
					series : [{
								type : 'line',
								fill : true,
								showMarkers : false,
								axis : 'bottom',
								xField : 'dates',
								yField : 'balances',
								style : {
									'stroke-width' : 1,
									stroke : 'rgb(0, 0, 255)'

								}
							}]
				});
		this.items = [graphObj];
		this.callParent(arguments);
	},
	loadGraph : function(filterData, typecodeValue) {
		var me = this;
		//me.ownerCt.setLoading(false);
		var chart = me.down('chart[itemId="balancesChart"]');
		Ext.Ajax.request({
					url : 'services/activities/getHistoryGraphData.json',
					jsonData : Ext.encode(filterData || {}),
					async : false,
					success : function(response) {
						var fromDate = null;
						var toDate = null;
						if (!Ext.isEmpty(response.responseText)) {
							me.responseObj = Ext.decode(response.responseText);
							me.loadGraphData(typecodeValue);
							//var graphData = responseObj.graphData || [];
							//if(!Ext.isEmpty(chart) && !Ext.isEmpty(graphData))
								//chart.getStore().loadData(graphData);
						}
						//me.ownerCt.setLoading(false);
					},
					failure : function(response) {
							//me.ownerCt.setLoading(false);
					}
				})
	},
	loadGraphData : function(select) {
		var me = this;
		var chart = me.down('chart[itemId="balancesChart"]');
		var storeData = [];
		var arrData = me.responseObj.graphData;
		for (var i = 0; i < arrData.length; i++) {
			var colJson = {};
			if (arrData[i]) {
				colJson["dates"] = arrData[i].dates;
				var arrBalances = arrData[i].balances;
				if(undefined != arrBalances[select])
					colJson["balances"] = Number(arrBalances[select].replace(/,/g,''));
			}
			storeData.push(colJson);
		}
		chart.getStore().removeAll();
		chart.getStore().loadData(storeData);
	}
});
