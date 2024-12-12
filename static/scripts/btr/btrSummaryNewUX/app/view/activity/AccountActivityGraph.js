/**
 * @class GCP.view.activity.AccountActivityGraph
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.activity.AccountActivityGraph', {
	extend : 'Ext.panel.Panel',
	xtype : 'accountActivityGraph',
	itemId : 'accountActivityGraph',
	requires : ['Ext.data.JsonStore', 'Ext.chart.series.Column',
			'Ext.chart.series.Bar', 'Ext.chart.theme.Base',
			'Ext.chart.series.Series', 'Ext.chart.series.Line',
			'Ext.chart.axis.Numeric', 'Ext.button.Button',
			'Ext.chart.axis.Category', 'Ext.chart.axis.Axis'],
	border : false,
	layout : 'vbox',
	initComponent : function() {
		var me = this;
		var graphStore = Ext.create('Ext.data.Store', {
					extend : 'Ext.data.Store',
					fields : ['dates', 'credit', 'debit'],
					autoLoad : false
				});
		var graphObj = Ext.create('Ext.chart.Chart', {
					itemId : 'activityChart',
					width : '100%',
					height : 200,
					animate : true,
					store : graphStore,
					legend : {
						position : 'top'
					},
					style : {
						borderColor : 'black',
						borderStyle : 'solid'
					},
					shadow : false,
					axes : [{
								type : 'Numeric',
								position : 'left',
								fields : ['credit', 'debit'],
								grid : true,
								title : getLabel('crdramount',
										'Credit/Debit Amount'),
								labelTitle : {
									font : '18px calibri, helvetica, arial, sans-serif'
								},
								minimum : 0,
								majorTickStep : 1,
								label : {
									font : '11px calibri, helvetica, arial, sans-serif'
								}
							}, {
								type : 'Category',
								position : 'bottom',
								fields : ['dates'],
								title : getLabel('postingdate', 'Posting Date'),
								labelTitle : {
									font : '18px calibri, helvetica, arial, sans-serif'
								},
								label : {
									font : '11px calibri, helvetica, arial, sans-serif'
								}
							}],
					series : [{
						type : 'column',
						fill : true,
						showMarkers : false,
						title : [getLabel('credit', 'Credit'),
								getLabel('debit', 'Debit')],
						axis : 'bottom',
						xField : 'dates',
						yField : ['credit', 'debit']
					}]
				});
		me.items = [graphObj];
		me.on('resize', function() {
			me.doLayout();
		});
		me.callParent(arguments);
	},
	loadGraph : function(filterData) {
		var me = this;
		//me.ownerCt.setLoading(true);
		var chart = me.down('chart[itemId="activityChart"]');
		Ext.Ajax.request({
			url : 'services/activities/getActivityGraphData.json',
			jsonData : Ext.encode(filterData || {}),
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					var intMaxCreditCnt = 1, intMaxDebitCnt = 1, intMajorTicks = 0;
					arrGraphData = data.graphData || [];
				}
				chart.getStore().loadData(arrGraphData);
				//me.ownerCt.setLoading(false);
				
			},
			failure : function(response) {
				//me.ownerCt.setLoading(false);
			}
		});
	}
});
