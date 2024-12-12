Ext.define('Cashweb.view.portlet.PaymentsProcessed', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.paymentsprocessed',
	requires : ['Ext.data.JsonStore', 'Ext.chart.theme.Base',
			'Ext.chart.series.Series', 'Ext.chart.series.Line',
			'Ext.chart.axis.Numeric', 'Ext.button.Button', 'Ext.tab.Panel',
			'Ext.chart.Chart', 'Ext.chart.series.Pie'],
	border : false,
	padding : 3,
	cols : 1,
	emptyText : null,
	taskRunner : null,
	dateFilterLabel : 'Entry Date( Latest )',
	colorSet : [],
	hideHeaders : true,
	strFilterUrl : '',
	navStore : null,

	initComponent : function() {
		var me = this;
		me.emptyText = label_map.noDataFound;
		me.on('refreshWidget', function() {
					var record = me.record, settings = [];
					var filterUrl = '';
					me.setLoading(label_map.loading);
					if (!Ext.isEmpty(record.get('settings')))
						settings = record.get('settings');
					filterUrl = me.generateUrl(settings);
					me.strFilterUrl = filterUrl;
					me.ajaxRequest(filterUrl);
				});
		this.on('render', function(component, eOpts) {
					var settings = [];
					var filterUrl = '';
					var record = me.record;
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
					}
					filterUrl = me.generateUrl(settings);
					me.strFilterUrl = filterUrl;
					me.ajaxRequest(filterUrl);
				});
		Ext.define('Ext.ux.chart.LegendItem.Unclickable', {
			override : 'Ext.chart.LegendItem',
			onMouseDown : function() {
				var index = this.yFieldIndex;
				var categoryCode = me.navStore.getAt(index).get("categoryCode");

				var filter = me.strFilterUrl;
				var start = filter.indexOf('AccountNoPDT') - 1;
				var filterDetail = filter.substr(start);
				var end = filterDetail.indexOf(')') + 1;
				filterDetail = filterDetail.substr(0, end);
				filter = filter.replace(filterDetail, '');
				if (!Ext.isEmpty(filterDetail))
					filter = filter.substr(0, filter.length - 5);
				if (Ext.isEmpty(filter))
					filter = filter + "InstrumentType eq '" + categoryCode
							+ "'";
				else
					filter = filter + " and InstrumentType eq '" + categoryCode
							+ "'";
				filter = filter + '&$filterDetail=' + filterDetail;
				me.fireEvent('seeMorePaymentRecords', filter);
			}
		});
		Ext.apply(this, {
					items : [{
								xtype : 'label',
								hidden : true,
								cls : 'font_normal',
								itemId : 'errorLabel',
								text : label_map.noDataFound
							}, {
								layout : {
									type : 'vbox',
									align : 'center'
								},
								itemId : 'cashflowCreditPanel',
								autoHeight : true,
								items : [{
											xtype : 'panel',
											itemId : 'chartCreditPanel',
											items : [],
											margins : {
												top : 10,
												left : 0,
												right : 0,
												bottom : 0
											}
										}]
							}, {
								xtype : "label",
								margin : '5 0 0 58',
								text : "Payments Processed",
								style : {
									color : '#7F4B72',
									font : '15px arial, sans-serif'
								},
								cls : 'my-label-style'
							}]
				});

		me.callParent(arguments);
	},
	setRefreshLabel : function() {
		var thisClass = this;
		$("#" + thisClass.titleId).empty();
		var label = Ext.create('Ext.form.Label', {
					text :getLabel('asof',"As of ")+ displaycurrenttime(),
					margin : '0 0 0 5',
					style : {
						'font-size' : '14px !important',
						'font-weight' : 'bold',
						'position' : 'absolute',
						'right' : '50px',
						'color' : '#67686b'
					},
					renderTo : Ext.get(thisClass.titleId)
				});
	},
	ajaxRequest : function(filterUrl) {
		var me = this;
		var strSqlDateFormat = 'Y-m-d';
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(dtApplicationDate, dtFormat));
		var appDate = Ext.Date.format(date, strSqlDateFormat);
		var strUrl = 'services/getPaymentVolume.json';
		if (!Ext.isEmpty(filterUrl)) {
			strUrl = strUrl + '?$filter=' + filterUrl;
			if (!Ext.isEmpty(me.ccyUrl))
				strUrl = strUrl + '&' + me.ccyUrl;
		} else {
			if (!Ext.isEmpty(me.ccyUrl))
				strUrl = strUrl + '?' + me.ccyUrl;
		}
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					success : function(response) {
						me.chartServiceData = response.responseText;
						var objData = Ext.decode(me.chartServiceData);
						if (Ext.isEmpty(objData.week)) {
							me.down('label[itemId=errorLabel]').show();
							me.down('panel[itemId=cashflowCreditPanel]').hide();
							me.getTargetEl().unmask();
						} else {
							me.down('label[itemId=errorLabel]').hide();
							me.down('panel[itemId=cashflowCreditPanel]').show();
							me.loadChartData(me.chartServiceData);
						}

						me.setLoading(false);
						me.setRefreshLabel();
					},
					failure : function(response) {
						if(response.status === 400) {
								me.setLoading(false);
							}
						 if(response.status === 500) {
								me.setLoading(false);
							}
					}
				});

	},
	loadChartData : function(data) {
		var me = this;
		var storeData = [];
		var objData = Ext.decode(data);
		var arrData = objData.summary;
		if (!Ext.isEmpty(arrData)) {
			for (var i = 0; i < arrData.length; i++) {
				var colJson = {};
				if (arrData[i]) {
					colJson["name"] = arrData[i].productCategory;
					colJson["data"] = arrData[i].percentage;
					colJson["amount"] = arrData[i].amount;
					colJson["count"] = arrData[i].count;
					colJson["ccy_symbol"] = objData.ccy_symbol;
					colJson["categoryCode"] = arrData[i].categoryCode;
				}
				storeData.push(colJson);
			}
		}

		if (storeData.length == 0) {
			var debitChart = me.createCreditChart(storeData);
			var chartPanel = me.down('panel[itemId=chartCreditPanel]');
			chartPanel.removeAll();
			chartPanel.add(debitChart);
			me.doLayout();
		}
		me.getTargetEl().unmask();
	},
	createCreditChart : function(storeData) {
		var me = this, chart;
		/*
		 * var pieChartStore = Ext.create('Ext.data.JsonStore', { fields :
		 * ['name', 'data', 'amount', 'count', 'ccy_symbol','categoryCode'] });
		 * 
		 * pieChartStore.loadData(storeData); me.navStore=pieChartStore;
		 */

		var store = Ext.create('Ext.data.JsonStore', {
					fields : ['data'],
					data : [{
								'data' : 25
							}, {
								'data' : 75
							}]
				});

		chart = Ext.create('Ext.chart.Chart', {
					minWidth : 280,
					minHeight : 182,
					itemId : 'paymentsprocessed',
					animate : true,
					shadow : false,
					store : store,
					theme : 'Newthemename',
					series : [{
								type : 'pie',
								angleField : 'data',
								showInLegend : false,
								donut : 80,
								tips : {
									trackMouse : true,
									constrainPosition : true,
									anchor : 'bottom',
									bodyStyle : {
										background : '#525252',
										color : 'black',
										padding : '10px'
									},
									renderer : function(storeItem, item) {
										this.update(storeItem.get('data'));
									}
								},
								highlight : {
									segment : {
										margin : 20
									}
								}
							}],
					items : [{
								type : "text",
								text : store.max('data') + "%",
								fill : '#7F4B72',
								font : "36px monospace",
								x : 110,
								y : 100
							}]
				});
		return chart;
	},

	// Date field handling ends
	generateUrl : function(settings) {
	},

	showSettingsPopup : function(widgetCode, titleforsettings, record) {
		var me = this;
		var portletSettings = Ext.create('Ext.window.Window', {
					record : record,
					minHeight : 200,
					cls : 'settings-popup',
					buttonAlign : 'center',
					itemId : widgetCode + 'SettingsPanel',
					title : titleforsettings,
					autoHeight : true,
					width : 800,
					modal : true,
					resizable : false,
					items : me.getSettingsPanel(),
					buttons : [{
								text : getLabel("cancel", "Cancel"),
								cls : 'xn-btn ux-button-s',
								handler : function() {
									this.up('window').close();
								}
							}, '->', {
								text : getLabel("save", "Save"),
								cls : 'xn-btn ux-button-s',
								handler : function() {
									me.up('panel').fireEvent(
											'saveSettings',
											record,
											me.getSettingsPanel()
													.getSettings(this
															.up('window')));
									/*var settings = me.getSettingsPanel()
													.getSettings(this
															.up('window'));
									me.record.set('settings', settings);	
									me.setLoading(label_map.loading);
									var filterUrl = me.generateUrl(settings);
									me.strFilterUrl = filterUrl;
									me.ajaxRequest(filterUrl);				
									me.up('panel').fireEvent(
											'saveSettings',
											record, settings);*/
									this.up('window').close();
								}
							}]
				});
		portletSettings.show();
	},
	getSettingsPanel : function() {
	},

	getDataPanel : function() {
		return this;
	}
});

Ext.define('Ext.chart.theme.Newthemename', {
			extend : 'Ext.chart.theme.Base',

			constructor : function(config) {
				this.callParent([Ext.apply({
							colors : ['#F1F1F1', '#7F4B72']
						}, config)]);
			}
		});