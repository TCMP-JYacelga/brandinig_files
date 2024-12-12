Ext
	.define(
		'GCP.controller.CustomReportCenterChooseController',
		{
			extend : 'Ext.app.Controller',
			requires : [],
			views :
			[
				'GCP.view.CustomReportCenterChooseView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'reportModuleListPanel',
					selector : 'reportCenterChooseView panel[itemId="reportModuleListPanel"]'
				},
				{
					ref : 'reportsSelectionPanel',
					selector : 'reportCenterChooseView panel[itemId="reportsSelectionPanel"]'
				},
				{
					ref : 'reportsListPanel',
					selector : 'reportCenterChooseView panel[itemId="reportsListPanel"]'
				},
				{
					ref : 'selectReportPanelContainer',
					selector : 'reportCenterChooseView container[itemId="selectReportPanelContainer"]'
				}
			],
			config :
			{
				selectdModule : null,
				selectedReport : null,
				client : null,
				sellerName : null
			},
			/**
			 * A template method that is called when your application boots. It
			 * is called before the Application's launch function is executed so
			 * gives a hook point to run any code before your Viewport is
			 * created.
			 */
			init : function()
			{
				var me = this;
				
				me
					.control(
					{
						'reportCenterChooseView' :
						{
							render : function() {
								me.client=strClientDesc;
								me.populateModules(strClient);
							},
							'clientMenuSelect' : function(code) {
								me.clientComboSelect(code);
							}
						}
					} );
			},
			clientComboSelect : function(combo, record) 
			{
				var me = this;
				me.populateModules(combo,null);
			},
			loadModulesList : function(moduleList) {
				var me = this;
				var selectedType = "";
				var charLimitReached = 'N';
				var truncatedCheckboxLabel = '';
				var checkboxLabel = '';
				var parentCt = me.getReportModuleListPanel();
				var leftCt = me.getReportModuleListPanel();
				var rightCt = me.getReportsListPanel();
				
				var errorLable =  null;
				if(me.getReportsSelectionPanel())
					errorLable = me.getReportsSelectionPanel().down('label[itemId="noDataErrorLabel"]');
				
				if (moduleList && moduleList.length > 0) {
					var checkedFlg = false;
					var disableFlg = false;
					var strCls = '';
					var checkboxArray = [];
					for (var i = 0; i < moduleList[0].groups.length; i++) 
					{
						if(i == 0){
							selectedType = moduleList[0].groups[i].groupCode;
							strCls = 'selected-cb-background ux_padding2';
							checkedFlg = true;
							disableFlg = true;
						}
						else {
							checkedFlg = false;
							disableFlg = false;
							strCls = 'ux_margin2 ux_unselected';
						}
						
						checkboxLabel = moduleList[0].groups[i].groupDescription;
						if (!Ext.isEmpty(checkboxLabel)) {
							if (checkboxLabel.length > 21) {
								truncatedCheckboxLabel = Ext.util.Format.ellipsis(
										checkboxLabel, 21);
								charLimitReached = 'Y';
							} else {
								truncatedCheckboxLabel = checkboxLabel;
								charLimitReached = 'N';
							}
						}
						checkboxArray.push({
									code : moduleList[0].groups[i].groupCode,
									boxLabel : truncatedCheckboxLabel,
									checked : checkedFlg,
									cls : strCls,
									readOnly : disableFlg,
									width : 150,
									handler : function(btn, opts) {
										click : me.deselectModuleCheckbox(this,
												this.checked);
									},
									listeners : {
										render : function(c) {
											if (c.limitReached === 'Y') {
												Ext.create('Ext.tip.ToolTip', {
															target : c.getEl(),
															html : checkboxLabel
														});
											}
										}
									}
								});
								truncatedCheckboxLabel="";
					}
					if(errorLable)
						errorLable.hide();
					if(leftCt){
						leftCt.removeAll();
						leftCt.show();
						leftCt.add([{
									xtype : 'checkboxgroup',
									columns : 1,
									width : '100%',
									items : checkboxArray
						}]);
					}
					if(rightCt){
						rightCt.removeAll();
						rightCt.show();
					}
					me.populateReportList(selectedType);
					leftCt.doLayout();

				} else
				{
					var emptyLabel = Ext.create('Ext.form.Label', {
								text : getLabel('emptyDataMsg',
										'No Data Available for the moment.'),
								cls : 'ux_font-size14-normal',
								flex : 1
							});
					if(leftCt)
						leftCt.hide();
					
					if(rightCt)
						rightCt.hide();
					if(errorLable){
						errorLable.show();
					}
				}
			},
			deselectModuleCheckbox : function(cb, checked) {
				var me = this;
				if (checked) {
					cb.removeCls('ux_unselected');
					cb.addCls('selected-cb-background');
					cb.addCls('.ux_unselected');
					cb.setReadOnly(true);
					var group = cb.findParentByType('checkboxgroup');
					// get the siblings and uncheck
					if (group) {
						group.items.each(function(it) {
									if (it.getName() != cb.getName()) {
										it.setValue(0);
										it.removeCls('selected-cb-background');
										it.addCls('ux_unselected');
										it.setReadOnly(false);
									}
								});
					}
					me.selectdModule = cb.code;
					document.getElementById('module').value = me.selectdModule; 
					me.populateReportList(cb.code);
				}
			},
			populateReportList : function(selectdModule) {
				var me = this;
				me.sellerName=strSeller;
				var strUrl = 'services/getReportList.json?'+ csrfTokenName + "=" + csrfTokenValue +"&$module="+ selectdModule+"&$client="+me.client+"&$seller="+me.sellerName;

				Ext.Ajax.request({
							url : strUrl,
							method : "POST",
							success : function(response) {
								me.loadReportsList(Ext
										.decode(response.responseText));
							},
							failure : function(response) {
								Ext.MessageBox.show(
										{
											title : "Error",
											msg : getLabel( 'messageErrorPopUpMsg', 'Error while fetching data..!' ),
											buttons : Ext.MessageBox.OK,
											buttonText: {
									            ok: getLabel('btnOk', 'OK')
												},
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										} );
							}
						});

			},
			loadReportsList : function(reportList) {
				var me = this;
				var reportListPanel = me.getReportsListPanel();
				if (!Ext.isEmpty(reportListPanel)) {
					if (reportListPanel.items.length > 0) {
						reportListPanel.removeAll();
					}
				}

				if (reportList && reportList.length > 0) 
				{
					var panelCont = me.getSelectReportPanelContainer();
					if (!Ext.isEmpty(panelCont)) {
						if (panelCont.isHidden()) {
							panelCont.show();
						}
					}

					var errorLabel = null;
					if (!Ext.isEmpty(me.getReportsSelectionPanel()))
							errorLabel = me.getReportsSelectionPanel()
								.down('label[itemId="noDataErrorLabel"]');
					if (!Ext.isEmpty(errorLabel))
						errorLabel.hide();

					/*var reportList = data.d.reportCenter;
					reportList.sort(function(a, b){
					    if(a.reportCode < b.reportCode) return -1;
					    if(a.reportCode > b.reportCode) return 1;
					    return 0;
					});*/
					var checkedFlg = false;
					var disableFlg = false;
					var isFirstItem = true;
					var charLimitReached = 'N';
					var checkboxLabel = '';
					var truncatedCheckboxLabel = '';
					var checkboxArray = [];
					for (var i = 0; i < reportList.length; i++) {
							var details;
							checkboxLabel = reportList[i].REPDESCRIPTION;
							details = {
								"reportCode" : reportList[i].REPREPORT,
								"reportDesc" : reportList[i].REPDESCRIPTION
							}
							if(isFirstItem){
								checkedFlg = true;
								disableFlg = true;
								me.selectedReport = details;
							}
							else
							{
								checkedFlg = false;
								disableFlg = false;
							}
							if (checkboxLabel.length > 24) {
								truncatedCheckboxLabel = Ext.util.Format.ellipsis(
										checkboxLabel, 24);
								charLimitReached = 'Y';
							} else {
								truncatedCheckboxLabel = checkboxLabel;
								charLimitReached = 'N';
							}
							checkboxArray.push({
										boxLabel : truncatedCheckboxLabel,
										cls : 'ux_radio-button',
										checked : checkedFlg,
										readOnly : disableFlg,
										details : details,
										limitReached : charLimitReached,
										handler : function(btn, opts) {
											click : me.deselectCheckBox(this,
													this.checked, btn.details);
										},
										listeners : {
											render : function(c) {
												if (c.limitReached === 'Y') {
													Ext.create('Ext.tip.ToolTip', {
																target : c.getEl(),
																html : c.details.reportDesc
															});
												}
											}
										}
									});
							isFirstItem = false;
					}
					reportListPanel.add([{
								xtype : 'checkboxgroup',
								columns : 3,
								//columnWidth: 0.25,
								width : '100%',
								items : checkboxArray
							}]);
					reportListPanel.doLayout();
				} else {
					if (!Ext.isEmpty(me.getSelectReportPanelContainer()))
						me.getSelectReportPanelContainer().hide();
					var errorLabel = me.getReportsSelectionPanel()
							.down('label[itemId="noDataErrorLabel"]');
					if (!Ext.isEmpty(errorLabel))
						errorLabel.show();

				}
				me.handleUncheckedReport(me.getReportsListPanel(), true);
				if(!Ext.isEmpty(me.selectedReport))
				{
				document.getElementById('reportCode').value = me.selectedReport.reportCode;
				}
			},
			deselectCheckBox : function(cb, checked, details) {
				var me = this;
				if (checked) {
					cb.setReadOnly(true);
					var group = cb.findParentByType('checkboxgroup');
					// get the siblings and uncheck
					if (group) {
						group.items.each(function(it) {
									if (it.getName() != cb.getName()) {
										it.setValue(0);
										it.setReadOnly(false);
									}
								});
					}
					me.selectedReport = details;
					document.getElementById('reportCode').value = details.reportCode; 
				}
			},
			handleUncheckedReport : function(component, reqCmplte) {
				var checkBoxGrp = component.down('checkboxgroup');
				if (checkBoxGrp) {
					checkBoxGrp.items.each(function(it) {
								if (reqCmplte == true) {
									if (it.checked)
										it.setReadOnly(true);
									else
										it.setReadOnly(false);
								} else {
									it.setReadOnly(true);
								}
							});
				}
			},
			populateModules : function (combo,seller) {
				var me = this;
				if(typeof(combo) === "object")
					me.client = combo.getValue();
				else
					me.client = combo;
				document.getElementById('selectedClient').value = me.client;
				me.sellerName = strSeller;
				var strUrl = "services/getReportModulesList.json?$client="+ me.client+"&$seller="+seller;
				Ext.Ajax.request({ url: strUrl,
					   method: 'POST',
					   success: function(responseObject){
						   if(responseObject != null){
							var obj = Ext.decode(responseObject.responseText);
							me.loadModulesList(obj);
						   }
					   },
					   failure: function(responseObject){
						   Ext.MessageBox.show(
									{
										title : "Error",
										msg : getLabel( 'messageErrorPopUpMsg', 'Error while fetching data..!' ),
										buttons : Ext.MessageBox.OK,
										buttonText: {
									            ok: getLabel('btnOk', 'OK')
												},
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									} );
					   }
					});
			}
		} );
