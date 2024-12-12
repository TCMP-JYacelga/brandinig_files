Ext.define('Cashweb.view.portlet.ChartPortlet', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.cashflow',

	requires : ['Ext.data.JsonStore', 'Ext.chart.theme.Base',
	            'Ext.chart.series.Series', 'Ext.chart.series.Line',
	            'Ext.chart.axis.Numeric','Ext.button.Button','Ext.tab.Panel','Cashweb.view.portlet.TransactionsGrid'],
	            padding : '0 0 0 5',
	            border : false,
	            taskRunner: null,
	            config : {
	            },
	            initComponent : function() {
	            	this.tools = [ {
						xtype : 'combobox',
						id :  'cashflow_widget_combo',
						store : globalDashboardAccountsStore,
						queryMode : 'local',
						valueField : 'id',
						emptyText : label_map.selectaccount,
						displayField : 'account_number',
						editable : false,
						value: (globalDashboardAccountsStore.getCount() > 0) ? globalDashboardAccountsStore.getAt(0).get('id') : ''
					}];
	            	var chartStore = Ext.create('Cashweb.store.ChartStore');
	            	this.store = chartStore;
	            	
	            	Ext.apply(this, {
	            		items : [{
	            			layout : {
	            				type : 'hbox',
	            				align : 'stretch'
	            			},
	            			items : [ {
	            				flex : 5,
	            				layout: {
	            					type: 'vbox',
	            					align: 'stretch'
	            				},
	            				items: [{
	            					height: 30,
	            					defaultType: 'button',
	            					defaults: {
	            						height: 20,
	            						action: 'cashflowdateToggle',
	            						cls: 'toggleBtnCls',
	            						enableToggle: true
									
	            					},
	            					items: [{
									text : label_map.openingBal,
									xtype: 'label',
									height : 30,
									padding: '0 10 0 0',
									cls : 'cashflowopeningbalanceslabel'
									}, {
	            						text: label_map.oneday,
	            						id: '1_day',
	            						cls: 'toggleGrpCls',
	            						toggleGroup: 'cashflowdates'
	            					},{
	            						text: label_map.fiveday,
	            						id: '5_day',
	            						cls: 'toggleGrpCls',
	            						toggleGroup: 'cashflowdates'
	            					},{
	            						text: label_map.onemonth,
	            						id: '1_mnth',
	            						pressed: true,
	            						toggleGroup: 'cashflowdates'
	            					},{
	            						text: label_map.threemonth,
	            						id: '3_mnth',
	            						toggleGroup: 'cashflowdates'
	            					},{
	            						text: label_map.sixmonth,
	            						id: '6_mnth',
	            						toggleGroup: 'cashflowdates'
	            					},{
	            						text: label_map.oneyear,
	            						id: '1_year',
	            						toggleGroup: 'cashflowdates'
	            					},{
	            						text: label_map.twoyear,
	            						id: '2_yrs',
	            						cls: 'toggleGrpCls',
	            						toggleGroup: 'cashflowdates'
	            					}]
	            				},{
	            					xtype : 'chart',
	            					height : 200,
	            					flex: 3.5,
	            					style: {
	            					    borderColor: 'black',
	            					    borderStyle: 'solid'
	            					},
	            					width: '100%',
	            					animate : true,
	            					shadow : false,
	            					hidden : true,
	            					store : chartStore,
									axes : [{
	            						type : 'Numeric',
	            						minimum : 0,
	            						position : 'left',
	            						fields : ['balances'],
	            						grid : true,
	            						label : {
	            							font: '11px calibri, helvetica, arial, sans-serif'
	            						}
	            					}, {
	            						type : 'Category',
	            						position : 'bottom',
	            						fields : ['labels'],
	            						title : false,
	            						label : {
	            							font: '11px calibri, helvetica, arial, sans-serif',
	            							scopePt : this,
											renderer: function(value)
											{
												var btnOneYr = this.scopePt.ownerCt.down('button[id=1_year]');
												var btnTwoYr = this.scopePt.ownerCt.down('button[id=2_yrs]');
												if(!Ext.isEmpty(btnOneYr) && !Ext.isEmpty(btnTwoYr))
												{
												if(btnOneYr.pressed || btnTwoYr.pressed)
													return Ext.util.Format.date(Ext.Date.parse(value,'d/m/Y'),serverdateFormat);
												else
													return Ext.util.Format.date(Ext.Date.parse(value,'d/m/Y'),'m/d');
													}
													else
													return Ext.util.Format.date(Ext.Date.parse(value,'d/m/Y'),serverdateFormat);
													
											}
	            						}
	            					}],
	            					series : [{
	            								type : 'line',
	            								fill : true,
												showMarkers : false,
	            								axis : 'bottom',
	            								yField : 'balances',
	            								xField : 'labels',
	            								style : {
	            									 'stroke-width' : 1,
	            									stroke : 'rgb(148, 174, 10)'

	            								}
	            							}]
	            				}]
	            			},{
   			        		 xtype : 'transactionsgrid',
			        		 flex : 3.5,
							 padding : '29.1 0 0 0',
			        		 collapsible : false
			        		
			        	 }]
	            		}]
	            		});

				this.callParent(arguments);
			}

		});
