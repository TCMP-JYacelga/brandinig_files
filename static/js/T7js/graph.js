(function($, window, document, undefined1) {
	'use strict';

	//============
	// Dummy data.
	//============

	var JSON_STORE = Ext.create('Ext.data.JsonStore', {
		fields: [
			'name',
			'data1',
			'data2',
			'val',
			'date',
			'bal'
		],
		data: [{
			'name': 'Mon\n05/05',
			'data1': 30000,
			'data2': 40000,
			'val': '34,758',
			'date': '05/05/14, 9:30 am',
			'bal': 'Low'
		}, {
			'name': 'Mon\n05/12',
			'data1': 20000,
			'data2': 40000,
			'val': '22,188',
			'date': '05/12/14, 9:30 am',
			'bal': 'Low'
		}, {
			'name': 'Mon\n05/19',
			'data1': 50000,
			'data2': 40000,
			'val': '50,788',
			'date': '05/19/14, 9:30 am',
			'bal': 'Medium'
		}, {
			'name': 'Mon\n05/20',
			'data1': 90000,
			'data2': 40000,
			'val': '90,788',
			'date': '05/20/14, 9:30 am',
			'bal': 'Medium'
		}, {
			'name': 'Mon\n05/23',
			'data1': 150000,
			'data2': 40000,
			'val': '150,111',
			'date': '05/23/14, 9:30 am',
			'bal': 'High'
		}, {
			'name': 'Mon\n06/1',
			'data1': 40000,
			'data2': 40000,
			'val': '40,782',
			'date': '06/01/14, 9:30 am',
			'bal': 'Low'
		}, {
			'name': 'Mon\n06/3',
			'data1': 130000,
			'data2': 40000,
			'val': '132,748',
			'date': '06/03/14, 9:30 am',
			'bal': 'High'
		}, {
			'name': 'Mon\n06/12',
			'data1': 120000,
			'data2': 40000,
			'val': '122,788',
			'date': '06/12/14, 9:30 am',
			'bal': 'Medium'
		}, {
			'name': 'Mon\n06/20',
			'data1': 90000,
			'data2': 40000,
			'val': '92,188',
			'date': '06/20/14, 9:30 am',
			'bal': 'Medium'
		}, {
			'name': 'Mon\n06/31',
			'data1': 160000,
			'data2': 40000,
			'val': '160,788',
			'date': '06/31/14, 9:30 am',
			'bal': 'High'
		}]
	});

	//===================
	// Render the widget.
	//===================

	function render(width) {
		var EXT_ELEMENT = Ext.getElementById('ft-main-graph');

		// Set the dimensions.
		var ELEMENT_WIDTH = width;
		var ELEMENT_HEIGHT = 200;

		Ext.create('Ext.chart.Chart', {
			id: 'ft-ext-graph',
			renderTo: EXT_ELEMENT,
			width: ELEMENT_WIDTH,
			height: ELEMENT_HEIGHT,
			animate: false,
			store: JSON_STORE,
			shadow: false,
			axes: [{
				type: 'Numeric',
				position: 'left',
				fields: [
					'data1'
				],
				label: {
					renderer: function(num) {
						if (num >= 1000000000) {
							num = (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
						} else if (num >= 1000000) {
							num = (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
						} else if (num >= 1000) {
							num = (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
						}

						return '$' + num;
					},
					fill: '#666',
					style: {
						'font-size': '10px'
					}
				},
				title: '',
				grid: true,
				minimum: 2
			}, {
				type: 'Category',
				position: 'bottom',
				fields: ['name'],
				title: '',
				grid: true,
				label: {
					fill: '#666',
					style: {
						'font-size': '10px'
					}
				}
			}],
			series: [{
				type: 'line',
				style: {
					opacity: '1',
					'stroke-width': 1,
					stroke: '#7e4d76'
				},
				highlight: {
					'stroke-width': 1,
					size: 1,
					radius: 12
				},
				axis: 'left',
				xField: 'name',
				yField: 'data1',
				markerConfig: {
					type: 'circle',
					size: 1,
					radius: 4,
					'stroke-width': 18,
					'stroke-opacity': '.25',
					stroke: '#7e4d76',
					fill: '#7e4d76',
					opacity: '.85'
				},
				tips: {
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
									'<div class="ft-graph-tt-title">$' + storeItem.get('val') + '</div>',
									'<div class="ft-graph-tt-date">' + storeItem.get('date') + '</div>',
									'<div class="ft-graph-tt-bal">' + storeItem.get('bal') + ' Balance</div>',
									'<div class="ft-graph-tt-link">Details &gt;</div>',
								'</div>'
							].join('');
							this.setTitle('');
							this.update(markup);
						}
					}
				}
			}, {
				type: 'line',
				style: {
					opacity: '1',
					'stroke-width': 1,
					stroke: '#F36F27'
				},
				shadow: false,
				axis: 'left',
				xField: 'name',
				yField: 'data2',
				markerConfig: {
					type: 'circle',
					size: 1,
					radius: 4,
					'stroke-width': 1,
					'stroke-opacity': '.75',
					stroke: '#7e4d76',
					fill: '#7e4d76',
					opacity: '0'
				}
			}]
		});
	}

	//=====================
	// Rudimentary pub/sub.
	//=====================

	$(document).on('drawFluidWidgets', function(e, width) {
		render(width);
	});


})(jQuery, this, this.document);