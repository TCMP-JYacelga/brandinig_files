Ext.define('Cashweb.controller.PortletController', {

					extend : 'Ext.app.Controller',
					requires : ['Cashweb.view.portlet.ReportsForYou','Cashweb.view.portlet.PayCreatedByMe','Cashweb.view.portlet.UserActivity','Cashweb.view.portlet.CashflowCredit','Cashweb.view.portlet.CashflowCredit','Cashweb.store.WidgetStore', 'Ext.form.Label', 'Ext.panel.Tool', 
							'Cashweb.store.AccountStore', 'Ext.grid.column.Date', 'Cashweb.view.portlet.PaymentsPortlet', 'Cashweb.view.portlet.WSJPortlet',
							'Cashweb.view.portlet.RSSFeedsPortlet', 'Ext.window.MessageBox', 'Ext.panel.Panel', 'Ext.chart.axis.Category', 'Ext.form.field.ComboBox', 'Ext.Component', 'Ext.Img', 'Cashweb.view.portlet.WidgetTool', 
							'Ext.form.RadioGroup', 'Ext.layout.container.Fit', 'Cashweb.view.WidgetFactory', 'Ext.layout.container.VBox', 'Ext.Ajax', 'Ext.tip.ToolTip', 'Cashweb.view.portlet.ProductPortlet', 'Cashweb.view.portlet.PendingPayment',
							'Cashweb.view.portlet.PaymentException', 'Cashweb.view.portlet.FileUploadStatus', 'Cashweb.view.portlet.PaymentSchedules', 'Cashweb.view.portlet.Banner','Cashweb.view.portlet.InvestmentPortlet','Cashweb.view.portlet.AccountSummary','Cashweb.view.portlet.PaymentsActivity'],
					refs : [ {
						ref : 'portletPanel',
						selector : 'portletpanel'
					} ],

					config : {
						portletPanel : null
					},
					init : function(application) {
						this.control({
							'portletpanel' : {
								drop : this.handlePortletDrop
							}
						});
						this.fireAjaxRequest();
					},
					fireAjaxRequest : function() {
						var obj;
						var thisClass = this;
						//load the list of widgets available to client 
						var availableWidgetStore = Ext.create('Cashweb.store.AvailableWidgetStore');
						availableWidgetStore.load();
						//preferred widgets
						var widgetStore = Ext.create('Cashweb.store.WidgetStore');
						widgetStore.on('load',thisClass.loadVisiblePortletsOnDashBoard,
														thisClass);
						widgetStore.load();
						globalWidgetsStore = widgetStore;
					},
					handlePortletDrop : function(portal) {
						var portletsArray = portal.column.items.items;
						for (index in portletsArray) {
							portletsArray[index].record.data.position = index;
							var record = globalWidgetsStore.findRecord('widgetCode', portletsArray[index].record.data.widgetCode);
							record.set('position', index);
						}
					},
					
					//method invoked when widget is closed from dashboard
					updateWidgetList : function(panel, widgetCode, portlet) {
						var thisClass = this;
						var recordToUpdate = globalWidgetsStore.findRecord('widgetCode', widgetCode);
						if(!Ext.isEmpty(recordToUpdate)) {
							recordToUpdate.set('position', -1);
							var widgetStore = globalWidgetsStore;
							var records = widgetStore.getRange(0, widgetStore.getCount());
							var visibleWidgets = 0;
							for(var count = 0; count< records.length; count++) {
								if(records[count].data.position >= 0) {
									visibleWidgets++;
								}
							}
							if (visibleWidgets == 0) {
								recordToUpdate.set('position', 1);
								Ext.Msg.alert(label_map.widgetclose, label_map.widgetclosemsg);
								return false;
							} else {
								globalWidgetsStore.remove(recordToUpdate);
								var recordsCollection = globalWidgetsStore.getJSONDataArray();
								var updatedWidgets = Ext.JSON.encode(recordsCollection);
								Ext.Ajax.request({
									url : './updateDashboardWidgetPreferences.rest',
									params : {
										dashboardWidgets : updatedWidgets
									},
									success : function(response) {
										panel.doClose();
									},
									failure : function(response) {
										var panelMask = new Ext.LoadMask(panel, {msgCls:'error-msg'});
										panelMask.msg = label_map.widgetRemoveError;
										panelMask.show();
										var taskRunner = new Ext.util.TaskRunner();
										var task = taskRunner.newTask({
											run: function() {
												panelMask.hide();
												taskRunner.stopAll();
												taskRunner.destroy();
											},
											interval: 3 * 1000,
											scope: panel
										});
										task.start();
									}
								});
							}
					  } else { //widget removed from selected list
					  		panel.doClose();
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
								document.getElementById("dashboardDiv").removeChild(document.getElementById("dashboardDiv").childNodes[0]);
							}
							this.portletPanel.destroy();
						}
						widgetStore.sort('position', 'ASC');
						var recordsCount = widgetStore.getCount();
						var itemsConfigForPortletPanel = new Array();
						
						var widgetFactory = Ext.create('Cashweb.view.WidgetFactory');
						for (var recordIndex = 0; recordIndex < recordsCount; recordIndex++) {
							var record = widgetStore.getAt(recordIndex);
							var config = null;
							config = widgetFactory.createWidget(record.get('widgetCode').toLowerCase(), record);
							config.controller = this;
							if (!Ext.isEmpty(config)) {
								itemsConfigForPortletPanel.push(config);
							}
						}
						this.loadPortletPanel(itemsConfigForPortletPanel);
					},
					loadPortletPanel : function(itemsConfigForPortletPanel) {
						var loadingDiv = Ext.get("loadingDiv");
						if (!Ext.isEmpty(loadingDiv)) {
							loadingDiv.remove();
						}
						var myPanel = new Ext.container.Container({
									autoWidth : true,
									autoHeight: true,
									id : 'pPanelId',
									layout : 'fit',
									items : [ {
										layout : {
											type : 'vbox',
											align : 'stretch'
										},
										items : [{
													xtype : 'portletpanel',
													cls : 'portlet-panel',
													flex : 1,
													layout : 'fit',
													autoWidth : true,
													autoHeight: true,
													portletItems : itemsConfigForPortletPanel
												} ]
									} ],

									renderTo : Ext.get('dashboardDiv')
								});
						this.portletPanel = myPanel;
						Ext.EventManager.onWindowResize(function(w, h) {
							if (!Ext.isEmpty(myPanel)) {
								myPanel.doComponentLayout();
							}
						});
					}
				});