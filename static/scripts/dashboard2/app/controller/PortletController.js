Ext.define('Cashweb.controller.PortletController', {
	extend : 'Ext.app.Controller',
	requires : ['Cashweb.view.settings.AddWidgetPopup',
			'Cashweb.store.WidgetStore', 'Ext.form.Label', 'Ext.panel.Tool',
			'Ext.ux.portal2.PortalPanel', 'Cashweb.store.AccountStore',
			'Ext.grid.column.Date', 'Cashweb.view.portlet.WSJPortlet',
			'Ext.window.MessageBox', 'Ext.panel.Panel',
			'Ext.chart.axis.Category', 'Ext.form.field.ComboBox',
			'Ext.Component', 'Ext.Img', 'Cashweb.view.portlet.WidgetTool',
			'Ext.form.RadioGroup', 'Ext.layout.container.Fit',
			'Cashweb.view.WidgetFactory', 'Ext.layout.container.VBox',
			'Ext.Ajax', 'Ext.tip.ToolTip', 'Cashweb.view.portlet.Banner',
			'Cashweb.view.portlet.DebitFailedPortlet',
			'Cashweb.view.portlet.BalancesLine',
			'Cashweb.view.portlet.ReportsForYou',
			'Cashweb.view.portlet.PaymentVolume',
			'Cashweb.view.portlet.UserActivity',
			'Cashweb.view.portlet.PaymentRequest',
			'Cashweb.store.AvailableWidgetStore',
			'Cashweb.view.portlet.AccountSummary',
			'Cashweb.view.portlet.TxnThisMonth',
			'Cashweb.view.portlet.WirePayment',
			'Cashweb.view.portlet.TransactionsPortlet',
			'Cashweb.view.portlet.DailyPaymentStatus',
			'Cashweb.view.portlet.Notifications',
			'Cashweb.view.portlet.PaymentsProcessed',
			'Cashweb.view.portlet.FXRate',
			'Cashweb.view.portlet.FscOverdueLoans',
			'Cashweb.view.portlet.TradeOverdueLoans',
			'Cashweb.view.portlet.OverdueBills',
			'Cashweb.view.portlet.OverdueInvoices',
			'Cashweb.view.portlet.CashPositionDtl',
			'Cashweb.view.portlet.CashPositionStatic',
			'Cashweb.view.portlet.LoansAccounts',
			'Cashweb.view.portlet.PaymentBreakup',
			'Cashweb.view.portlet.PaymentsPipe',
			'Cashweb.view.portlet.HalfBanner1',
			'Cashweb.view.portlet.HalfBanner2'],
	refs : [{
				ref : 'portletPanel',
				selector : 'portletpanel2'
			}, {
				ref : 'portlet',
				selector : 'portletpanel2 portlet2'
			}, {
				ref : 'portalColumn',
				selector : 'portletpanel2 portalcolumn2'
			}],

	config : {
		portletPanel : null,
		isBannerAdded : false,
		isBanner1Added : false,
		isBanner2Added : false
	},
	init : function(application) {
		var me = this;
		$(document).on('savePreference', function(event) {
					me.saveClearDashboardPref(true);
				});
		$(document).on('clearPreference', function(event) {
					me.saveClearDashboardPref(false);
				});
		me.control({
					'portletpanel2' : {
						'drop' : me.handlePortletDrop
					},
					'portlet2' : {
						'close' : me.updateWidgetList,
						'statechanged' : me.updateWidgetState,
						'saveSettings' : me.updateSettings,
						'collpaseClick' : me.collpaseClicked
					},
					'addWidgetPopup' : {
						'addWidget' : function(record) {
							me.addWidgetToDashoard(record);
						}
					}
				});
		if (isClientUser === '1') {
			me.fireAjaxRequest();
			// me.createDashboardHeader();
		} else {
			var loadingDiv = Ext.get("loadingDiv");
			if (!Ext.isEmpty(loadingDiv)) {
				loadingDiv.remove();
			}
		}
	},
	saveClearDashboardPref : function(saveFlag) {
		var thisClass = this;
		if (saveFlag) {
			var recordsCollection = globalWidgetsStore.getJSONDataArray();
			var updatedWidgets = Ext.JSON.encode(recordsCollection);
		} else {
			updatedWidgets = Ext.JSON.encode([]);;
		}
		Ext.Ajax.request({
					url : "services/updateUserWidgets.json?"+csrfTokenName + "=" + csrfTokenValue,
					method : 'POST',
					params : {
						dashboardWidgets : updatedWidgets
					},
					success : function(response) {
						if (!saveFlag)
							thisClass.fireAjaxRequest();
					},
					failure : function(response) {
					}
				});

	},
	updateWidgetState : function(record, colPref) {
		var thisClass = this;
		var settings = record.get('settings');
		if (Ext.isEmpty(settings))
			settings = [];
		for (var i = 0; i < settings.length; i++) {
			if (settings[i].field === 'colPref')
				settings.splice(i, 1);
		}
		settings.push({
					field : 'colPref',
					value1 : colPref
				});
		record.set('settings', settings);
		thisClass.collpaseClicked(record, 'false')
	},

	collpaseClicked : function(record, flag) {
		var thisClass = this;
		var recordToUpdate = record;
		if (!Ext.isEmpty(recordToUpdate)) {
			var widgetStore = globalWidgetsStore;
			recordToUpdate.set('collapsedFlag', flag);
			globalWidgetsStore.add(recordToUpdate);
			var recordsCollection = globalWidgetsStore.getJSONDataArray();
			var updatedWidgets = Ext.JSON.encode(recordsCollection);
			Ext.Ajax.request({
						url : "services/updateUserWidgets.json?"+csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						params : {
							dashboardWidgets : updatedWidgets
						},
						success : function(response) {
						},
						failure : function(response) {
						}
					});

		}
	},
	updateSettings : function(record, settings) {
		var thisClass = this;
		var recordToUpdate = record;
		if (!Ext.isEmpty(recordToUpdate)) {
			var widgetStore = globalWidgetsStore;
			var recordToUpdate = globalWidgetsStore.findRecord('position',
					record.data.position);
			recordToUpdate.set('settings', settings);
			// globalWidgetsStore.add(recordToUpdate);
			var recordsCollection = globalWidgetsStore.getJSONDataArray();
			var updatedWidgets = Ext.JSON.encode(recordsCollection);
			Ext.Ajax.request({
						url : "services/updateUserWidgets.json?"+csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						params : {
							dashboardWidgets : updatedWidgets
						},
						success : function(response) {
							// thisClass.fireAjaxRequest();
						},
						failure : function(response) {
						}
					});

		}
	},
	addWidgetToDashoard : function(record) {
		var thisClass = this, isBanner = false;
		var availableWidgetStore = Ext.getStore('available-widget-store');
		if(_IsEmulationMode == true)
		{
			Ext.MessageBox.show(
					{
						title : getLabel( 'messageErrorPopUpTitle', 'Error' ),
						msg : getLabel( 'emulationError', 'You are in emulation mode cannot perform save or update.' ),
						buttons : Ext.MessageBox.OK,
						cls : 'ux_popup',
						icon : Ext.MessageBox.ERROR
					} );
		}
		else
		{
			if (!Ext.isEmpty(record)) {
			var widgetStore = globalWidgetsStore;
			var recordToUpdate = availableWidgetStore.findRecord('widgetCode',
					record.widgetCode);
			if (!Ext.isEmpty(recordToUpdate)) {
				recordToUpdate = recordToUpdate.copy();
				recordToUpdate.set('position', widgetStore.getCount());
				recordToUpdate.set('settings', []);
				recordToUpdate.set('collapsedFlag', "false");
				widgetStore.add(recordToUpdate);
			}
			var recordsCollection = widgetStore.getJSONDataArray();
			var updatedWidgets = Ext.JSON.encode(recordsCollection);

			var record = widgetStore.getAt(widgetStore.getCount() - 1);
			var config = null, portalColumn;
			var widgetFactory = Ext.create('Cashweb.view.WidgetFactory');
			config = widgetFactory.createWidget(record.get('widgetCode')
							.toLowerCase(), record);
			config.controller = this;
			portalColumn = thisClass.getPortalColumn();
			if (config.record.get("widgetType") === "BANNER" || config.record.get("widgetType") === "HALFBANNER")
				isBanner = true;
			else{
				if(portalColumn != undefined){
					portalColumn.add(config);
				}
				else{
					var portalCol = Ext.create('Ext.ux.portal2.PortalColumn');
					portalColumn = thisClass.getPortalColumn();
					portalColumn.add(config);
				}
			}
			Ext.Ajax.request({
						url : "services/updateUserWidgets.json?"+csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						params : {
							dashboardWidgets : updatedWidgets
						},
						success : function(response) {
							if (isBanner)
								thisClass.fireAjaxRequest();
						},
						failure : function(response) {
						}
					});
			}
		}
	},
	createDashboardHeader : function(availableWidgetStore) {
		var me = this;
		if (availableWidgetStore.getCount() > 0) {
			$('#PageTitle').empty();
			var dashboardHeaderPanel = new Ext.container.Container({
				autoWidth : true,
				autoHeight : true,
				layout : 'hbox',
				items : [{
							xtype : 'label',
							align : 'left',
							text : getLabel('lbl.dashboard','Dashboard'),
							cls : 'ft-title leftfloating'
						}, {
							xtype : 'button',
							align : 'right',
							border : 0,
							width : 115,
							id    : 'btnAddWidget',
							text : getLabel('lbl.widget.add','Add Widgets'),
							tabIndex:'1',
							glyph : 'xf055@fontawesome',
							cls : 'mozilla-btn-rightAlign rightfloating',
							listeners : {
								click : {
									fn : function() {
										me.showWidgetsListPopup();
									}
								}
							}
						}],
				renderTo : Ext.get('PageTitle')
			});
		}
	},
	fireAjaxRequest : function() {
		var obj;
		var thisClass = this;
		// load the list of widgets available to client
		var availableWidgetStore = Ext
				.create('Cashweb.store.AvailableWidgetStore');
		//availableWidgetStore.load();
		availableWidgetStore.on('load', thisClass.createDashboardHeader,
				thisClass);
		availableWidgetStore.load();
		// preferred widgets
		var widgetStore = Ext.create('Cashweb.store.WidgetStore');
		widgetStore.on('load', thisClass.loadVisiblePortletsOnDashBoard,
				thisClass);
		widgetStore.load();
		globalWidgetsStore = widgetStore;
	},
	handlePortletDrop : function(portal) {
		var portletsArray = portal.column.items.items;
		for (index in portletsArray) {
			var record = globalWidgetsStore.findRecord('position',
					portletsArray[index].record.data.position);
			record.set('position', parseInt(index,10));
		}
		var widgetStore = globalWidgetsStore;
		widgetStore.sort([{
					property : 'position',
					direction : 'ASC'
				}]);
		var recordsCollection = widgetStore.getJSONDataArray();
		var updatedWidgets = Ext.JSON.encode(recordsCollection);
		Ext.Ajax.request({
					url : "services/updateUserWidgets.json?"+csrfTokenName + "=" + csrfTokenValue,
					method : 'POST',
					params : {
						dashboardWidgets : updatedWidgets
					},
					success : function(response) {
					},
					failure : function(response) {
					}
				});
	},

	// method invoked when widget is closed from dashboard
	updateWidgetList : function(portlet) {
		var thisClass = this;
		var recordToUpdate = portlet.record;
		if (!Ext.isEmpty(recordToUpdate)) {
			var positionOfRemoved = recordToUpdate.get('position');
			recordToUpdate.set('position', -1);
			var widgetStore = globalWidgetsStore;
			widgetStore.remove(recordToUpdate);
			for (var i = positionOfRemoved; i < widgetStore.count(); i++) {
				widgetStore.getAt(i).set('position', i);
			}
			var recordsCollection = widgetStore.getJSONDataArray();
			var updatedWidgets = Ext.JSON.encode(recordsCollection);
			Ext.Ajax.request({
						url : "services/updateUserWidgets.json?"+csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						params : {
							dashboardWidgets : updatedWidgets
						},
						success : function(response) {
							if (recordToUpdate.get('widgetType') === 'BANNER')
								thisClass.isBannerAdded = false;
							if (recordToUpdate.get('widgetCode') === 'HALFBANNER1')
								thisClass.isBanner1Added = false;
							if (recordToUpdate.get('widgetCode') === 'HALFBANNER2')
								thisClass.isBanner2Added = false;
						},
						failure : function(response) {
						}
					});
		}
	},
	loadVisiblePortletsOnDashBoard : function(widgetStore) {
		if (widgetStore.getCount() == 0) {
			var loadingDiv = Ext.get("loadingDiv");
			if (!Ext.isEmpty(loadingDiv)) {
				loadingDiv.remove();
			}
			return;
		}

		if (!Ext.isEmpty(this.portletPanel)) {
			while (document.getElementById("dashboardDiv").childNodes[0]) {
				document.getElementById("dashboardDiv").removeChild(document
						.getElementById("dashboardDiv").childNodes[0]);
			}
			this.portletPanel.destroy();
		}
		var defaultWidgetFlag = widgetStore.getAt(0).get('defaultWidgetFlag');
		if(!defaultWidgetFlag)
			widgetStore.sort('position', 'ASC');
		var recordsCount = widgetStore.getCount();
		var itemsConfigForPortletPanel = new Array();
		var widgetFactory = Ext.create('Cashweb.view.WidgetFactory');
		for (var recordIndex = 0; recordIndex < recordsCount; recordIndex++) {
			var record = widgetStore.getAt(recordIndex);
			var config = null;
			config = widgetFactory.createWidget(record.get('widgetCode')
							.toLowerCase(), record);
			config.controller = this;
			if (!Ext.isEmpty(config)) {
				if (record.get('widgetType') === 'BANNER')
					itemsConfigForPortletPanel.unshift(config);
				else
					itemsConfigForPortletPanel.push(config);
			}
			if (record.get('widgetType') === 'BANNER')
				this.isBannerAdded = true;
			if (record.get('widgetCode') === 'HALFBANNER1')
				this.isBanner1Added = true;
			if (record.get('widgetCode') === 'HALFBANNER2')
				this.isBanner2Added = true;
		}
		if (defaultWidgetFlag) {
			var availableCol = 3;
			for (var i = 0; i < itemsConfigForPortletPanel.length; i++) {
				var colSize = itemsConfigForPortletPanel[i].colspan;
				if (colSize === 2 || colSize === 1) {
					availableCol = availableCol - colSize;
					for (var j = i + 1; j < itemsConfigForPortletPanel.length; j++) {
						if (itemsConfigForPortletPanel[j].colspan <= availableCol) {
							var widgetToMove = itemsConfigForPortletPanel[j];
							itemsConfigForPortletPanel.splice(i + 1, 0,
									widgetToMove);
							itemsConfigForPortletPanel.splice(j + 1, 1);
							availableCol = availableCol
									- itemsConfigForPortletPanel[j].colspan;
							if (availableCol === 0) {
								availableCol = 3;
								break;
							}
						}
					}
				}
			}
		}
		this.loadPortletPanel(itemsConfigForPortletPanel);
		Ext.getCmp('btnAddWidget').focus();			
	},
	showWidgetsListPopup : function() {

		var addWidgetPopup = Ext.create('Cashweb.view.settings.AddWidgetPopup',
				{
					isBannerAdded : this.isBannerAdded,
					isBanner1Added : this.isBanner1Added,
					isBanner2Added : this.isBanner2Added
				});
		addWidgetPopup.show();
	},
	loadPortletPanel : function(itemsConfigForPortletPanel) {
		var loadingDiv = Ext.get("loadingDiv");
		if (!Ext.isEmpty(loadingDiv)) {
			loadingDiv.remove();
		}
		widgetPanel = new Ext.container.Container({
					autoWidth : true,
					autoHeight : true,
					id : 'pPanelId',
					items : [{
								xtype : 'portletpanel2',
								cls : 'portlet-panel',
								flex : 1,
								layout : 'fit',
								autoWidth : true,
								autoHeight : true,
								portletItems : itemsConfigForPortletPanel
							}],

					renderTo : Ext.get('dashboardDiv')
				});
		this.portletPanel = widgetPanel;
		Ext.EventManager.onWindowResize(function(w, h) {
					if (!Ext.isEmpty(widgetPanel)) {
						widgetPanel.doComponentLayout();
					}
				});
	}
});