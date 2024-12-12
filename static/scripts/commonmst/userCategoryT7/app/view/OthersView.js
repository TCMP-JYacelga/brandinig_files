var fieldJson = [];
Ext
		.define(
				'GCP.view.OthersView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'othersPanel',
					width : 600,
					// border: 1,
					height : 500,
					layout : 'fit',
					overflowY : 'auto',
					// cls : 'border',
					config : {
						fnCallback : null,
						profileId : null,
						featureType : null,
						module : null,
						title : null
					},
					// listeners :
					loadFeaturs : function() {
						var me = this;
						if (mode === "VIEW") {
							Ext.Ajax
									.request({
										url : 'services/userCategory/previlige.json',
										method : 'POST',
										async : false,
										params : {
											module : 'OTH',
											categoryId : userCategory
										},
										success : function(response) {
											featureData = Ext.JSON
													.decode(response.responseText);
											return featureData;
										},
										failure : function() {
											var errMsg = "";
											Ext.MessageBox
													.show({
														title : getLabel(
																'instrumentErrorPopUpTitle',
																'Error'),
														msg : getLabel(
																'instrumentErrorPopUpMsg',
																'Error while fetching data..!'),
														buttons : Ext.MessageBox.OK,
														icon : Ext.MessageBox.ERROR
													});
										}
									});

						}
						return featureData;
					},
					filterFeatures : function(data, subsetCode) {
						var allFeatures = new Ext.util.MixedCollection();
						allFeatures.addAll(data);
						var featureFilter = new Ext.util.Filter({
							filterFn : function(item) {
								return item.subsetCode == subsetCode;
							}
						});
						var featurs = allFeatures.filter(featureFilter);
						return featurs.items;
					},
					getBooleanvalue : function(strValue) {
						if (strValue == 'Y' || strValue == true) {
							return true;
						} else {
							return false;
						}
					},
					setColumnHeader : function() {
						var featureItems = [];
						featureItems.push({
							xtype : 'label',
							columnWidth : 0.38,
							text : getLabel('lbl.type', 'Type'),
							padding : '5 0 0 0',
							cls : 'boldText background'
						});
						featureItems.push({
							xtype : 'label',
							columnWidth : 0.20,
							text : getLabel('view', 'View'),
							padding : '5 0 0 0',
							cls : 'boldText background'
						});
						featureItems.push({
							xtype : 'label',
							columnWidth : 0.20,
							text : getLabel('edit', 'Edit'),
							padding : '5 0 0 0',
							cls : 'boldText background'
						});
						featureItems.push({
							xtype : 'label',
							columnWidth : 0.20,
							text : getLabel('auth', 'Auth'),
							padding : '5 0 0 0',
							cls : 'boldText background'
						});
						return featureItems;
					},
					setPanelHeader : function(id, title, subsetCode) {
						var featureItems = [];
						// Handling for All Checkbox
						var viewIcon = editIcon = authIcon = "./static/images/icons/icon_checkmulti.gif";
						var editFlag = false, viewFlag = false, authFlag = false;
						var data = this.loadFeaturs();
						var filteredData = this
								.filterFeatures(data, subsetCode);
						for ( var i = 0; i < filteredData.length; i++) {
							if (filteredData[i].canView == 'Y')
								viewFlag = true;
							else {
								viewFlag = false;
								viewIcon = "./static/images/icons/icon_uncheckmulti.gif";
								break;
							}
						}

						for ( var i = 0; i < filteredData.length; i++) {
							if (filteredData[i].canEdit == 'Y')
								editFlag = true;
							else {
								editFlag = false;
								editIcon = "./static/images/icons/icon_uncheckmulti.gif";
								break;
							}
						}

						for ( var i = 0; i < filteredData.length; i++) {
							if (filteredData[i].canAuth == 'Y')
								authFlag = true;
							else {
								authFlag = false;
								authIcon = "./static/images/icons/icon_uncheckmulti.gif";
								break;
							}
						}

						featureItems.push({
							xtype : 'label',
							columnWidth : 0.38,
							text : title,
							padding : '5 0 0 10',
							cls : 'boldText'
						});
						featureItems.push({
							xtype : 'button',
							columnWidth : 0.21,
							icon : viewIcon,
							margin : '0 0 0 0',
							width : 10,
							height : 20,
							itemId : id + "_viewIcon",
							border : 0,
							cls : 'btn '
						});
						featureItems.push({
							xtype : 'button',
							columnWidth : 0.21,
							icon : editIcon,
							margin : '0 0 0 104',
							width : 15,
							height : 20,
							itemId : id + "_editIcon",
							border : 0,
							cls : 'btn '
						});
						featureItems.push({
							xtype : 'button',
							columnWidth : 0.20,
							icon : authIcon,
							margin : '0 0 0 104',
							width : 15,
							height : 20,
							itemId : id + "_authIcon",
							border : 0,
							cls : 'btn '
						});
						return featureItems;
					},
					setPriviligeMenu : function(feature, MODE) {
						var obj = new Object();
						if (MODE == 'VIEW') {
							var i = !this.getBooleanvalue(feature.rmForView);
							// obj.hidden =
							// !this.getBooleanvalue(feature.rmForView);
							obj.checked = this.getBooleanvalue(feature.canView);
						} else if (MODE == 'EDIT') {
							var i = !this.getBooleanvalue(feature.rmForEdit);
							// obj.hidden =
							// !this.getBooleanvalue(feature.rmForEdit);
							obj.checked = this.getBooleanvalue(feature.canEdit);
						} else if (MODE == 'AUTH') {
							var i = !this.getBooleanvalue(feature.rmForAuth);
							// obj.hidden =
							// !this.getBooleanvalue(feature.rmForAuth);
							obj.checked = this.getBooleanvalue(feature.canAuth);
						}
						if (i === false) {
							obj.xtype = "checkbox";
							// obj.cls = 'cellContent';
						} else {
							obj.xtype = "label";
							obj.text = ".";
							// obj.cls = 'whitetext';
							// obj.hidden = true;
						}
						obj.columnWidth = '0.20';
						obj.padding = '0 0 0 0';
						obj.itemId = feature.featureWeight + "_" + MODE;
						obj.featureWeight = feature.featureWeight;
						obj.mode = MODE;
						obj.rmSerial = feature.rmSerial;
						// obj.border = 1;

						if (mode === "VIEW") {
							obj.readOnly = true;
						}
						fieldJson.push(obj);
						return obj;
					},

					setPositivePayOptions : function() {
						var self = this;
						var data = this.loadFeaturs();
						var filteredData = this.filterFeatures(data,
								'POSITIVEPAYPRM');
						var featureItems = [];
						Ext.each(filteredData, function(feature, index) {
							var panel = Ext.create('Ext.panel.Panel', {
								columnWidth : 1,
								layout : 'column',
								bodyStyle : {
									background : ' #FAFAFA '
								}
							});
							panel.insert({
								xtype : 'label',
								columnWidth : 0.38,
								text : feature.featureName,
								padding : '5 0 0 10'
							});
							panel
									.insert(self.setPriviligeMenu(feature,
											"VIEW"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"EDIT"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"AUTH"));
							featureItems.push(panel);
						});
						return featureItems;
					},
					setIncomingACHOptions : function() {
						var self = this;
						var data = this.loadFeaturs();
						var filteredData = this.filterFeatures(data,
								'INCOMINGACHPRM');
						var featureItems = [];
						Ext.each(filteredData, function(feature, index) {
							var panel = Ext.create('Ext.panel.Panel', {
								columnWidth : 1,
								layout : 'column',
								bodyStyle : {
									background : ' #FAFAFA '
								}
							});
							panel.insert({
								xtype : 'label',
								columnWidth : 0.38,
								text : feature.featureName,
								padding : '5 0 0 10'
							});
							panel
									.insert(self.setPriviligeMenu(feature,
											"VIEW"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"EDIT"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"AUTH"));
							featureItems.push(panel);
						});
						return featureItems;
					},
					setIncomingWireOptions : function() {
						var self = this;
						var data = this.loadFeaturs();
						var filteredData = this.filterFeatures(data,
								'INCOMINGWIREPRM');
						var featureItems = [];
						Ext.each(filteredData, function(feature, index) {
							var panel = Ext.create('Ext.panel.Panel', {
								columnWidth : 1,
								layout : 'column',
								bodyStyle : {
									background : ' #FAFAFA '
								}
							});
							panel.insert({
								xtype : 'label',
								columnWidth : 0.38,
								text : feature.featureName,
								padding : '5 0 0 10'
							});
							panel
									.insert(self.setPriviligeMenu(feature,
											"VIEW"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"EDIT"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"AUTH"));
							featureItems.push(panel);
						});
						return featureItems;
					},
					setChecksOptions : function() {
						var self = this;
						var data = this.loadFeaturs();
						var filteredData = this
								.filterFeatures(data, 'CHECKPRM');
						var featureItems = [];
						Ext.each(filteredData, function(feature, index) {
							var panel = Ext.create('Ext.panel.Panel', {
								columnWidth : 1,
								layout : 'column',
								bodyStyle : {
									background : ' #FAFAFA '
								}
							});
							panel.insert({
								xtype : 'label',
								columnWidth : 0.38,
								text : feature.featureName,
								padding : '5 0 0 10'
							});
							panel
									.insert(self.setPriviligeMenu(feature,
											"VIEW"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"EDIT"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"AUTH"));
							featureItems.push(panel);
						});
						return featureItems;
					},
					setLoansRights : function() {
						var self = this;
						var data = this.loadFeaturs();
						var filteredData = this.filterFeatures(data, 'LOANPRM');
						var featureItems = [];
						Ext.each(filteredData, function(feature, index) {
							var panel = Ext.create('Ext.panel.Panel', {
								columnWidth : 1,
								layout : 'column',
								bodyStyle : {
									background : ' #FAFAFA '
								}
							});
							panel.insert({
								xtype : 'label',
								columnWidth : 0.38,
								text : feature.featureName,
								padding : '5 0 0 10'
							});
							panel
									.insert(self.setPriviligeMenu(feature,
											"VIEW"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"EDIT"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"AUTH"));
							featureItems.push(panel);
						});
						return featureItems;
					},
					setInvestRights : function() {
						var self = this;
						var data = this.loadFeaturs();
						var filteredData = this.filterFeatures(data,
								'INVESTPRM');
						var featureItems = [];
						Ext.each(filteredData, function(feature, index) {
							var panel = Ext.create('Ext.panel.Panel', {
								columnWidth : 1,
								layout : 'column',
								bodyStyle : {
									background : ' #FAFAFA '
								}
							});
							panel.insert({
								xtype : 'label',
								columnWidth : 0.38,
								text : feature.featureName,
								padding : '5 0 0 10'
							});
							panel
									.insert(self.setPriviligeMenu(feature,
											"VIEW"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"EDIT"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"AUTH"));
							featureItems.push(panel);
						});
						return featureItems;
					},
					setDepositViewRights : function() {
						var self = this;
						var data = this.loadFeaturs();
						var filteredData = this.filterFeatures(data, 'DEPVW');
						var featureItems = [];
						Ext.each(filteredData, function(feature, index) {
							var panel = Ext.create('Ext.panel.Panel', {
								columnWidth : 1,
								layout : 'column',
								bodyStyle : {
									background : ' #FAFAFA '
								}
							});
							panel.insert({
								xtype : 'label',
								columnWidth : 0.38,
								text : feature.featureName,
								padding : '5 0 0 10'
							});
							panel
									.insert(self.setPriviligeMenu(feature,
											"VIEW"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"EDIT"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"AUTH"));
							featureItems.push(panel);
						});
						return featureItems;
					},
					setReportSchedulingOptions : function() {
						var self = this;
						var data = this.loadFeaturs();
						var filteredData = this.filterFeatures(data,
								'BKREPORTPRM');
						var featureItems = [];
						Ext.each(filteredData, function(feature, index) {
							var panel = Ext.create('Ext.panel.Panel', {
								columnWidth : 1,
								layout : 'column',
								// cls : 'border',
								bodyStyle : {
									background : ' #FAFAFA '
								}
							});
							panel.insert({
								xtype : 'label',
								columnWidth : 0.38,
								text : feature.parentField,
								padding : '5 0 0 10'
							});
							panel
									.insert(self.setPriviligeMenu(feature,
											"VIEW"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"EDIT"));
							panel
									.insert(self.setPriviligeMenu(feature,
											"AUTH"));
							featureItems.push(panel);
						});
						return featureItems;
					},
					initComponent : function() {
						var thisClass = this;
						thisClass.items = [ {
							xtype : 'container',
							cls : 'background',
							items : [ {
								xtype : 'panel',
								items : [
										{
											xtype : 'panel',
											id : 'othColumnHeader',
											layout : 'column',
											// cls: 'alignCenter',
											margin : '5 5 5 5',
											padding : '5 5 5 5',
											items : thisClass.setColumnHeader()
										},
										{
											xtype : 'panel',
											id : 'pPayHeader',
											layout : 'column',
											cls : 'red-bg',
											margin : '4 0 0 0',
											items : thisClass.setPanelHeader(
													'pPayHeader',
													'Positive Pay',
													'POSITIVEPAYPRM')
										},
										{
											xtype : 'panel',
											// title:
											// getLabel('positivePay','Positive
											// Pay'),
											titleAlign : "left",
											// collapsible : true,
											cls : 'xn-ribbon',
											collapseFirst : true,
											id : 'positivePaySection',
											layout : 'column',
											items : thisClass
													.setPositivePayOptions()

										},
										{
											xtype : 'panel',
											id : 'incomingHeader',
											layout : 'column',
											cls : 'red-bg',
											margin : '4 0 0 0',
											items : thisClass.setPanelHeader(
													'incomingHeader',
													'Incoming ACH',
													'INCOMINGACHPRM')
										},
										{
											xtype : 'panel',
											//title: getLabel('incomingAch','Incoming ACH'),
											//collapsible : true,
											//cls : 'xn-ribbon',
											//collapseFirst : true,
											id : 'incomingAchSection',
											layout : 'column',
											items : thisClass
													.setIncomingACHOptions()
										},
										{
											xtype : 'panel',
											id : 'checksHeader',
											layout : 'column',
											cls : 'red-bg',
											margin : '4 0 0 0',
											items : thisClass.setPanelHeader(
													'checksHeader', 'Checks',
													'CHECKPRM')
										},
										{
											xtype : 'panel',
											//title: getLabel('checks','Checks'),
											//collapsible : true,
											cls : 'xn-ribbon',
											collapseFirst : true,
											id : 'checksSection',
											layout : 'column',
											items : thisClass
													.setChecksOptions()
										},

										{
											xtype : 'panel',
											id : 'incomingWireHeader',
											layout : 'column',
											cls : 'red-bg',
											margin : '4 0 0 0',
											items : thisClass.setPanelHeader(
													'incomingWireHeader',
													'Incoming Wire',
													'INCOMINGWIREPRM')
										},
										{
											xtype : 'panel',
											//title: getLabel('incomingAch','Incoming ACH'),
											//collapsible : true,
											//cls : 'xn-ribbon',
											//collapseFirst : true,
											id : 'incomingWireSection',
											layout : 'column',
											items : thisClass
													.setIncomingWireOptions()
										},
										{
											xtype : 'panel',
											id : 'reportHeader',
											cls : 'red-bg',
											margin : '4 0 0 0',
											layout : 'column',
											items : thisClass.setPanelHeader(
													'reportHeader',
													'Report Scheduling',
													'BKREPORTPRM')
										},
										{
											xtype : 'panel',
											//title: getLabel('reportScheduling','Report Scheduling'),
											//collapsible : true,
											//cls : 'xn-ribbon',
											collapseFirst : true,
											id : 'reportSchedulingSection',
											layout : 'column',
											items : thisClass
													.setReportSchedulingOptions()
										} ]
							} ]

						} ];
						this.callParent(arguments);
					},
					saveItems : function() {
						var me = this;
						var viewSerials = {};
						var authSerials = {};
						var editSerials = {};
						Ext.each(fieldJson, function(field, index) {
							var featureId = field.itemId;
							var element = me.down('checkboxfield[itemId='
									+ featureId + ']');
							if (element != null && element != undefined
									&& !element.hidden) {
								//element.boxLabelCls =element.boxLabelCls+" newFieldValue";
								var mode = element.mode;
								if ('VIEW' == mode) {
									viewSerials[field.rmSerial] = element
											.getValue();
								}
								if ('EDIT' == mode) {
									editSerials[field.rmSerial] = element
											.getValue();
								}
								if ('AUTH' == mode) {
									authSerials[field.rmSerial] = element
											.getValue();
								}
							}
						});
						if (!Ext.isEmpty(me.fnCallback)
								&& typeof me.fnCallback == 'function') {
							me
									.fnCallback(viewSerials, authSerials,
											editSerials);
							me.close();
						}
					}
				});