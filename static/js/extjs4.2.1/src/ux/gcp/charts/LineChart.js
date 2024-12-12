/**
 * @class Ext.ux.gcp.charts.LineChart
 * @extends Ext.chart.Chart
 * @author Aditya Sharma
 * 
 * */
Ext.define('Ext.ux.gcp.charts.LineChart', {
	extend : 'Ext.chart.Chart',
	xtype : 'lineChart',
	width: '100%',
	height: 200,
	animate: false,
	shadow: false,
	tipTitleField : '',
	tipContentField : '',
	tipFooterField : '',
	initComponent : function() {
		var me = this;
		//Label styling for both axes
		var labelStyle = {
					fill: '#666',
					style: {
						'font-size': '10px'
					}
				};
		var title = '';
		var grid = true;
		me.axes[0].label = labelStyle;
		me.axes[0].title = title
		me.axes[0].grid = grid;
		me.axes[1].label = labelStyle;
		me.axes[1].title = title
		me.axes[1].grid = grid;
		
		//Series styling
		
		var seriesStyle1 = {};
		seriesStyle1.style =  {
					opacity: '1',
					'stroke-width': 1,
					stroke: '#7e4d76'
				};
		seriesStyle1.highlight= {
					'stroke-width': 1,
					size: 1,
					radius: 12
				};
		seriesStyle1.markerConfig= {
					type: 'circle',
					size: 1,
					radius: 4,
					'stroke-width': 18,
					'stroke-opacity': '.25',
					stroke: '#7e4d76',
					fill: '#7e4d76',
					opacity: '.85'
				};
		seriesStyle1.type = 'line';
		seriesStyle1.axis = 'left'
		
		
		me.series[0].style=seriesStyle1.style;
		me.series[0].highlight=seriesStyle1.highlight;
		me.series[0].markerConfig=seriesStyle1.markerConfig;
		me.series[0].type = seriesStyle1.type;
		me.series[0].axis = seriesStyle1.axis;
		me.series[0].tips = {
					trackMouse: true,
					width: 165,
					height: 96,
					target: (!Ext.isIE8)? 'bottomCallout' : '',
					anchor: (!Ext.isIE8)? 'bottomCallout' : '',
					anchorStyle: 'background-color:white',
					renderer: function(storeItem) {
						if(storeItem){
							var markup = [
								'<div class="ft-graph-tt-content">',
									'<div class="ft-graph-tt-title">$' + storeItem.get(me.tipTitleField) + '</div>',
									'<div class="ft-graph-tt-date">' + storeItem.get(me.tipContentField) + '</div>',
									'<div class="ft-graph-tt-bal">' + storeItem.get(me.tipFooterField) + ' Balance</div>',
								'</div>'
							].join('');
							this.setTitle('');
							this.update(markup);
						}
					}
				};
		var seriesStyle2 = {};
		seriesStyle2.style =  {
					opacity: '1',
					'stroke-width': 1,
					stroke: '#F36F27'
				};
		seriesStyle2.highlight= {};
		seriesStyle2.markerConfig= {
					type: 'circle',
					size: 1,
					radius: 4,
					'stroke-width': 1,
					'stroke-opacity': '.75',
					stroke: '#7e4d76',
					fill: '#7e4d76',
					opacity: '0'
				};
		seriesStyle2.type = 'line';
		seriesStyle2.axis = 'left'
		
		me.series[1].style=seriesStyle2.style;
		me.series[1].highlight=seriesStyle2.highlight;
		me.series[1].markerConfig=seriesStyle2.markerConfig;
		me.series[1].type = seriesStyle2.type;
		me.series[1].axis = seriesStyle2.axis;
		
		me.callParent(arguments);

	}

});