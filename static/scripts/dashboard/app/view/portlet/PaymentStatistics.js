Ext.define('Cashweb.view.portlet.PaymentStatistics',
		{
			extend : 'Ext.panel.Panel',
			alias : 'widget.pay_stat',
			border : false,
			padding : '0 0 0 5',
			taskRunner : null,
			layout : 'fit',
			hideHeaders : true,
			config: {
				title: ''
			},
			initComponent : function() {
				var thisClass = this;
				
				this.tools = [ {
					xtype : 'combobox',
					itemId : 'currencycombo',
					hidden : true,
					queryMode : 'local',
					valueField : 'ccy_code',
					emptyText : label_map.selectcurrency,
					displayField : 'ccy_code',
					editable : false

				} ];

				var chartstore = Ext.create('Cashweb.store.PaymentStatisticChartStore');

				this.items = [ {
					xtype : 'chart',
					height : 210,
					hidden: true,
					legend : {
						position : 'right'
					},
					width: '100%',
					animate : true,
					shadow : false,
					store : chartstore,
					axes : [
							{
								type : 'Numeric',
								title : '',
								minimum : 0,
								position : 'left',
								fields : [ 'data1', 'data2' ],
								grid : true,
								label : {
									font: '12px calibri, helvetica, arial, sans-serif',
									renderer : function(value) {
										var newvalue = Ext.util.Format.number(
												value, '0,000');
										return newvalue;
									}
								}
							},
							{
								type : 'Numeric',
								title : '',
								position : 'bottom',
								majorTickSteps :30,
								//maximum : 32,
								minimum : 1,
								grid : true,
								fields : [ 'DayNum','DayNum1'],
								label : {
									 font: '12px calibri, helvetica, arial, sans-serif',
									 rotate: {
											degrees: 315
										}
								}

							}],
					series : [ {
						type : 'line',
						showMarkers : false,
						style : {
							zIndex : 0
						},
						highlight : {
							size : 1,
							radius : 1
						},
						axis : 'left',
						fill : true,
						title : [ ' ' ],
						xField : 'DayNum',
						yField : 'data2',
						tips : {
							trackMouse : true,
							autoWidth : true,
							height : 25,
							renderer : function(storeItem, item) {
								this.update(storeItem.get('data2') + '');
							}
						}

					}, {
						type : 'line',
						showMarkers : false,
						style : {
							zIndex : 0
						},
						highlight : {
							size : 1,
							radius : 1
						},
						axis : 'left',
						fill : true,
						title : [ ' ' ],
						xField : 'DayNum1',
						yField : 'data1',
						tips : {
							trackMouse : true,
							autoWidth : true,
							height : 25,
							renderer : function(storeItem, item) {
								this.update(storeItem.get('data1') + '');
							}
						}

					} ]
				}];
				this.callParent(arguments);
			}

		});