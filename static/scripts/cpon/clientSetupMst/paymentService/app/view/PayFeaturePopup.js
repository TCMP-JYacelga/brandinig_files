var fieldJson = [];
Ext.define('CPON.view.PayFeaturePopup', {
	extend : 'Ext.window.Window',
	xtype : 'payFeaturePopup',
	cls : 'non-xn-popup',
	width : 735,
	minHeight : 156,
	maxHeight : 550,
	draggable : false,
	resizable : false,

	closeAction : 'hide',
	title : getLabel('paymentfeatures', 'Payment Features'),
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	layout : 'fit',
	overflowY : 'auto',
	config : {
		layout : 'fit',
		modal : true,
		draggable : true,
		//closeAction : 'hide',
		autoScroll : true,
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null,
		isAllSelected : null
	},
	listeners : {

		show : function() {
			//var passthroughOptions = Ext.getCmp('passthroughOptions');
			//passthroughOptions.show();
			//this.showCheckedSection();
			// this.render();
		}
	},
	loadFeatures : function() {
		return featureData;
	},
	setDaysField : function(feature) {
		var containerItems = [];
		var panel = Ext.create('Ext.panel.Panel', {
					layout : 'hbox'
				});

		var obj = new Object();
		if (feature.profileFieldType != undefined) {
			obj.profileFieldType = feature.profileFieldType;
		}
		obj.xtype = 'textfield';
		obj.featureId = feature.value;

		obj.featureType = feature.featureType;
		obj.featureSubsetCode = feature.featureSubsetCode;
		obj.readOnly = feature.readOnly;
		obj.nodeType = feature.privParam;
		obj.sequenceNo = feature.sequenceNo;
		obj.updated = feature.updated;
		obj.profileId = feature.profileId;
		obj.columnWidth = 0.2;
		obj.width = 40;
		obj.value = clientType==='S'? '' :resDaysPay;
		if (feature.isAssigned != undefined && feature.isAssigned != null
				&& feature.isAssigned) {
			obj.value = feature.featureValue;
		}

		if (feature.readOnly == true) {
			obj.disabled = true;
		}
		obj.maxLength = 3;
		obj.enforceMaxLength = true;
		var container = Ext.create('Ext.container.Container', {
					layout : 'hbox',
					items : [obj, {
								xtype : 'component',
								width : 100,
								autoEl : {
									tag : 'span',
									html : getLabel('days', 'Days')
								},
								cls : 'ux_font-size14-normal',
								padding : '5 0 0 4'
							}]
				});
		panel.insert(0, {
					xtype : 'label',
					width : 105,
					text : getLabel('filterrs', 'Data Restrictions'),
					cls : 'ux_font-size14-normal',
					padding : '5 0 0 0'
				});
		panel.insert(1, container);
		return panel;
	},
	setPayType : function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'PO', '');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var skip = false;
					if(feature.value === 'FPAY-000007' && $('#chkImg_WIRE').attr('src') && $('#chkImg_WIRE').attr('src').indexOf('icon_checked') === -1){
						skip = true;
					}
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = '<span class="font_normal">' + feature.name
							+ '</span>';
					obj.featureId = feature.value;
					
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.nodeType = feature.privParam;
					obj.sequenceNo = feature.sequenceNo;
					obj.updated = feature.updated;
					obj.value = feature.value;
					obj.isAssigned = feature.isAssigned;
					obj.columnWidth = 0.3333;
					obj.xtype = 'checkbox';
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
					if(skip){
						obj.isAssigned = false;
						obj.hidden = true;
					}
					featureItems.push(obj);
					obj.readOnly = feature.readOnly;
					obj.featureValue = feature.featureValue;
					obj.privParam = feature.privParam;
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setPayFileType : function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'F', '');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.nodeType = feature.privParam;
					obj.sequenceNo = feature.sequenceNo;
					obj.updated = feature.updated;
					obj.value = feature.value;
					obj.isAssigned = feature.isAssigned;
					if (feature.value === 'TEMPLTAUTH')
						obj.columnWidth = 0.333;
					else
						obj.columnWidth = 0.3333;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true) {
						obj.disabled = true;
					}
					featureItems.push(obj);
					obj.readOnly = feature.readOnly;
					obj.featureValue = feature.featureValue;
					obj.privParam = feature.privParam;
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setPayExportOptions : function(flag) {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'E', '');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = '<span class="font_normal">' + feature.name
							+ '</span>';
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.nodeType = feature.privParam;
					//obj.readOnly =feature.readOnly;
					obj.sequenceNo = feature.sequenceNo;
					obj.updated = feature.updated;
					obj.value = feature.value;
					obj.xtype = 'checkbox';
					obj.isAssigned = feature.isAssigned;
					obj.columnWidth = 0.3333;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}

					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;

					featureItems.push(obj);
					obj.readOnly = feature.readOnly;
					obj.featureValue = feature.featureValue;
					obj.privParam = feature.privParam;
					if (flag)
						fieldJson.push(obj);
				});
		return featureItems;
	},
	setPayViewOptions : function() {
		var self = this;
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'V', '');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.nodeType = feature.privParam;
					obj.sequenceNo = feature.sequenceNo;
					obj.updated = feature.updated;
					obj.value = feature.value;
					obj.columnWidth = 0.3333;
					obj.id = obj.featureId;
					obj.isAssigned = feature.isAssigned;

					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}

					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;

					/*if (obj.featureId == 'ID' || obj.featureId == 'DGE') {
						obj.handler = function() {
							self.comboBoxHandler();
						}
					}*/
					featureItems.push(obj);
					/*if (obj.featureId == 'DFUL')
						featureItems.push(self.setBRViewComboBox(feature));
					else
						featureItems.push(obj);*/
					obj.readOnly = feature.readOnly;
					obj.featureValue = feature.featureValue;
					obj.privParam = feature.privParam;
					fieldJson.push(obj);
				});
		return featureItems;
	},
	comboBoxHandler : function() {
		var GRIV = Ext.getCmp('ID');
		var WIDV = Ext.getCmp('DGE');
		var element = Ext.getCmp('DFUL');
		if (element) {
			if (WIDV.getValue() && GRIV.getValue()) {
				element.setDisabled(false);
			} else {
				element.setDisabled(true);
			}
		}
	},
	setBRViewComboBox : function(feature) {
		var obj = new Object();
		if (feature.profileFieldType != undefined) {
			obj.profileFieldType = feature.profileFieldType;
		}
		obj.xtype = 'combo';
		//obj.labelWidth = '50';
		obj.fieldWidth = '2';
		obj.fieldLabel = feature.name;
		obj.featureId = feature.value;
		obj.featureType = feature.featureType;
		obj.featureSubsetCode = feature.featureSubsetCode;
		obj.nodeType = feature.privParam;
		obj.sequenceNo = feature.sequenceNo;
		obj.updated = feature.updated;
		obj.columnWidth = 0.25;
		if (feature.readOnly == true) {
			obj.disabled = true;
		}
		obj.id = obj.featureId;
		obj.editable = false;
		obj.disabled = true;
		obj.store = Ext.create('Ext.data.Store', {
					data : [{
								"featureId" : "W",
								"name" : "Widget"
							}, {
								"featureId" : "G",
								"name" : "Grid"
							}],
					fields : ['featureId', 'name']
				});
		obj.displayField = 'name';
		obj.valueField = 'featureId';
		obj.value = "W";
		obj.featureValue = feature.featureValue;
		if (feature.profileId != undefined && feature.featureValue != null
				&& feature.featureValue != 'null') {
			obj.value = feature.featureValue;
		}
		return obj;
	},
	setPayOptions : function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'O', '');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					//obj.readOnly = feature.readOnly;
					obj.nodeType = feature.privParam;
					obj.sequenceNo = feature.sequenceNo;
					obj.updated = feature.updated;
					obj.value = feature.value;
					obj.columnWidth = 0.3333;
					obj.isAssigned = feature.isAssigned;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true) {
						obj.disabled = true;
					}
					featureItems.push(obj);
					obj.readOnly = feature.readOnly;
					obj.featureValue = feature.featureValue;
					obj.privParam = feature.privParam;
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setPassthroughOptions : function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'O', 'PASSPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			if (feature.sequenceNo == 1) {
				var obj = new Object();
				if (feature.profileFieldType != undefined) {
					obj.profileFieldType = feature.profileFieldType;
				}
				obj.boxLabel = feature.name;
				obj.featureId = feature.value;
				obj.value = feature.featureValue;
				//obj.readOnly = feature.readOnly;
				obj.nodeType = feature.privParam;
				obj.sequenceNo = feature.sequenceNo;
				obj.updated = feature.updated;
				obj.value = feature.value;
				obj.profileId = feature.profileId;
				if (feature.profileId != undefined && feature.profileId != null) {
					obj.checked = true;
				}
				if (feature.readOnly == true) {
					obj.disabled = true;
				}
				obj.featureType = feature.featureType;
				obj.featureSubsetCode = feature.featureSubsetCode;
				obj.columnWidth = 0.50;
				featureItems.push(obj);
				obj.readOnly = feature.readOnly;
				obj.featureValue = feature.featureValue;
				obj.privParam = feature.privParam;
				fieldJson.push(obj);
			}
		});
		return featureItems;
	},

	setTempParams : function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'O', 'TPL');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			if (feature.sequenceNo == 1) {
				var obj = new Object();
				if (feature.profileFieldType != undefined) {
					obj.profileFieldType = feature.profileFieldType;
				}
				obj.boxLabel = feature.name;
				obj.featureId = feature.value;
				obj.value = feature.featureValue;
				if (feature.profileId != undefined && feature.profileId != null) {
					obj.checked = true;
				}
				if (feature.readOnly == true) {
					obj.disabled = true;
				} else {
					obj.readOnly = false;
					obj.disabled = false;
				}
				obj.nodeType = feature.privParam;
				obj.featureType = feature.featureType;
				obj.featureSubsetCode = feature.featureSubsetCode;
				obj.columnWidth = 0.50;
				featureItems.push(obj);
				obj.readOnly = feature.readOnly;
				obj.featureValue = feature.featureValue;
				obj.privParam = feature.privParam;
				fieldJson.push(obj);
			}
		});
		return featureItems;
	},
	setACHParams : function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'O', 'TPL');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			if (feature.sequenceNo == 1) {
				var obj = new Object();
				if (feature.profileFieldType != undefined) {
					obj.profileFieldType = feature.profileFieldType;
				}
				obj.boxLabel = feature.name;
				obj.featureId = feature.value;
				obj.value = feature.featureValue;
				if (feature.profileId != undefined && feature.profileId != null) {
					obj.checked = true;
				}
				if (feature.readOnly == true) {
					obj.disabled = true;
				}
				obj.featureType = feature.featureType;
				obj.nodeType = feature.privParam;
				obj.featureSubsetCode = feature.featureSubsetCode;
				obj.columnWidth = 0.50;
				featureItems.push(obj);
				obj.readOnly = feature.readOnly;
				obj.featureValue = feature.featureValue;
				obj.privParam = feature.privParam;
				fieldJson.push(obj);
			}
		});
		return featureItems;
	},
	setLimits : function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'O', 'PASSPRM');
		var featureItems = [];
		var count = 0;
		Ext.each(filteredData, function(feature, index) {
					if (feature.sequenceNo != 1) {
						var obj = new Object();
						if (feature.profileFieldType != undefined) {
							obj.profileFieldType = feature.profileFieldType;
						}
						obj.xtype = 'textfield';
						obj.fieldLabel = feature.name;
						obj.labelAlign = 'top';
						obj.defaultAlign = 'right';
						obj.width = 50;
						obj.featureId = feature.value;
						obj.isAssigned = feature.isAssigned;
						obj.profileId = feature.profileId;
						obj.nodeType = feature.privParam;
						if (feature.isAssigned != undefined
								&& feature.isAssigned != null
								&& feature.isAssigned) {
							obj.value = feature.featureValue;
						}
						if (feature.readOnly == true) {
							obj.disabled = true;
						}
						count++;
						if (count % 3 === 0)
							obj.cls = 'clearLeft';
						obj.featureType = feature.featureType;
						obj.featureSubsetCode = feature.featureSubsetCode;
						obj.readOnly = feature.readOnly;
						obj.sequenceNo = feature.sequenceNo;
						obj.updated = feature.updated;
						obj.columnWidth = 0.25;
						obj.margin = '0 15 0 0 ';
						obj.maxLength = 20;
						obj.enforceMaxLength = true;
						featureItems.push(obj);
						obj.featureValue = feature.featureValue;
						obj.privParam = feature.privParam;
						fieldJson.push(obj);
					}
				});
		return featureItems;
	},
	setTemplatesOptions : function(flag) {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'T', 'TPL');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if (feature.profileFieldType != undefined) {
				obj.profileFieldType = feature.profileFieldType;
			}

			obj.xtype = 'checkbox';
			obj.boxLabel = '<span class="font_normal">' + feature.name
					+ '</span>';
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			obj.nodeType = feature.privParam;
			if (feature.isAssigned != undefined && feature.isAssigned != null
					&& feature.isAssigned) {
				obj.checked = true;
			} 
			if(isPaymentTemplateApplicable== "N")
				obj.checked = false;

			if (feature.readOnly == true)
			{	obj.disabled = true;
			}
			else{
				obj.disabled = false;
				obj.readOnly = false;
			}
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.nodeType = feature.privParam;
			obj.columnWidth = 0.3333;
			//if(clientType === 'S' && feature.isAssigned == false) {
			//	obj.hidden = true;
			//}
			obj.listeners = {
				'change' : function() {
					var payCheckBoxes = objPayFeaturePopup.query('container');
					var isRepChecked = false, isNonRepChecked = false, isSemiRepChecked = false;
					for (var i = 0; i < payCheckBoxes.length; i++) {
						if (payCheckBoxes[i].id == "templatesSection") {
							var cBox = payCheckBoxes[i].query('checkbox');
							var objCbRep = null;
							for (var j = 0; j < cBox.length; j++) {
								if (!isEmpty(cBox[j].featureId)) {
									if ('REP' === cBox[j].featureId) {
										isRepChecked = cBox[j].getValue();
										objCbRep = cBox[j];
									} else if ('NREP' === cBox[j].featureId)
										isNonRepChecked = cBox[j].getValue();
									else if ('SREP' === cBox[j].featureId)
										isSemiRepChecked = cBox[j].getValue();
								}
							}
							if (!isNonRepChecked && !isSemiRepChecked) {
								isRepChecked= true;
								objCbRep.setValue(isRepChecked);
								objCbRep.setDisabled(true);
							} else {
								objCbRep.setValue(isRepChecked);
								objCbRep.setDisabled(false);
							}
						}
					}
					
					for (var i = 0; i < payCheckBoxes.length; i++) {
						if (payCheckBoxes[i].id == "templatesApprovalSection") {
							var cBox = payCheckBoxes[i].query('checkbox');
							var objCbAppRep = null, objCbAppNonRep = null, objCbAppSemiRep = null;

							for (var j = 0; j < cBox.length; j++) {
								if (!isEmpty(cBox[j].featureId)) {
									if ('AREP' === cBox[j].featureId) {
											if (isRepChecked)
												cBox[j].setDisabled(false);
											else {
												cBox[j].setDisabled(true);
												cBox[j].setValue(false);
											}
										} else if ('ANREP' === cBox[j].featureId) {
											if (isNonRepChecked)
												cBox[j].setDisabled(false);
											else {
												cBox[j].setDisabled(true);
												cBox[j].setValue(false);
											}
										}

										else if ('ASREP' === cBox[j].featureId) {
											if (isSemiRepChecked)
												cBox[j].setDisabled(false);
											else {
												cBox[j].setDisabled(true);
												cBox[j].setValue(false);
											}
										}
								}
							}

						}
					}
				}

			};
			featureItems.push(obj);
			obj.readOnly = feature.readOnly;
			obj.featureValue = feature.featureValue;
			obj.privParam = feature.privParam;
			if (flag)
				fieldJson.push(obj);
		});
		//if (isPaymentTemplateApplicable == "N") {
		//	featureItems = [];
		//}
		return featureItems;
	},
	setTemplatesApprovalOptions : function(flag) {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'AT', 'TPL');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if (feature.profileFieldType != undefined) {
				obj.profileFieldType = feature.profileFieldType;
			}

			obj.xtype = 'checkbox';
			obj.boxLabel = '<span class="font_normal">' + feature.name
					+ '</span>';
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			obj.nodeType = feature.privParam;
			if (feature.isAssigned != undefined && feature.isAssigned != null
					&& feature.isAssigned) {
				obj.checked = true;
			}

			if (feature.readOnly == true)
				obj.disabled = true;
			else if (feature.isAssigned != undefined
					&& feature.isAssigned != null && feature.isAssigned){
				obj.readonly=false;obj.disabled = false;}
			else
				obj.disabled = true;
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth = 0.3333;
			//if(clientType == 'S' && feature.isAssigned == false) {
			//	obj.hidden = true;
			//}
			obj.listeners = {
				
			};
			featureItems.push(obj);
			obj.readOnly = feature.readOnly;
			obj.featureValue = feature.featureValue;
			obj.privParam = feature.privParam;
			if (flag)
				fieldJson.push(obj);
		});
		//if (isPaymentTemplateApplicable == "N") {
		//	featureItems = [];
		//}
		return featureItems;
	},
	setOptions : function(flag) {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'O', '');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.xtype = 'checkbox';
					obj.boxLabel = '<span class="font_normal">' + feature.name
							+ '</span>';
					obj.featureId = feature.value;
					obj.style = {
						'font-weight' : 'normal !important'
					};
					obj.value = feature.featureValue;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
					}

					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;

					obj.featureType = feature.featureType;
					obj.nodeType = feature.privParam;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.3333;
					featureItems.push(obj);
					obj.readOnly = feature.readOnly;
					obj.featureValue = feature.featureValue;
					obj.privParam = feature.privParam;
					if (flag)
						fieldJson.push(obj);
				});
		return featureItems;
	},
	setAOComboBox : function(feature) {
		var panel = Ext.create('Ext.panel.Panel', {
					columnWidth : 0.26,
					layout : 'column'
				});
		var obj = new Object();
		if (feature.profileFieldType != undefined) {
			obj.profileFieldType = feature.profileFieldType;
		}
		obj.xtype = 'combo';
		//obj.labelWidth='2px';
		obj.width = 150;
		//obj.fieldLabel = feature.name;
		obj.featureId = feature.value;
		obj.featureType = feature.featureType;
		obj.featureSubsetCode = feature.featureSubsetCode;
		obj.nodeType = feature.privParam;
		//obj.columnWidth= 0.26;

		obj.id = obj.featureId;
		//obj.editable= false;
		//obj.disabled = true;
		obj.store = new Ext.data.Store({
					data : [{
								"featureId" : "MC",
								"name" : getLabel('makerChecker', 'Maker Checker')
							}, {
								"featureId" : "SV",
								"name" : getLabel('svm', "Signatory Verification")
							}, {
								"featureId" : "AV",
								"name" : getLabel('avm', "Authorization Verification")
							}],
					fields : ['featureId', 'name']
				});
		obj.displayField = 'name';
		obj.valueField = 'featureId';
		if (feature.isAssigned != undefined && feature.featureValue != null
				&& feature.featureValue != 'null' && feature.isAssigned) {
			obj.value = feature.featureValue;
		}
		panel.insert(0, obj);
		return panel;
	},
	setScreenOptions : function(flag) {
		var self = this;
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'SO', '');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = '<span class="font_normal">' + feature.name
							+ '</span>';
					obj.featureId = feature.value;
					obj.value = feature.featureValue;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
					}

					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;

					obj.xtype = 'checkbox';
					obj.featureType = feature.featureType;
					obj.nodeType = feature.privParam;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.3333;
					obj.readOnly = feature.readOnly;
					obj.featureValue = feature.featureValue;
					obj.privParam = feature.privParam;
					if (flag)
						fieldJson.push(obj);
					if (obj.featureId == 'DRD') {
						//featureItems.push(self.setDaysField(feature));
					} else {
						featureItems.push(obj);
					}
				});
		return featureItems;
	},
	setScreenDays : function() {
		var self = this;
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'SO', '');
		var screenDaysPanel = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					obj.featureId = feature.value;
					if (obj.featureId == 'DRD') {
						screenDaysPanel.push(self.setDaysField(feature));
					}
				});
		return screenDaysPanel;
	},
	setPaymentPackages : function() {
		var me = this;
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'PP', '');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.value = feature.featureValue;
					obj.nodeType = feature.privParam;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
					}

					if (feature.readOnly == false)
						obj.disabled = true;
					else
						obj.disabled = false;

					/*if(obj.featureId == "CLONEPACKAGE")
					obj.disabled=true;*/

					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.24;
					obj.handler = function(checkBox, value) {
						me.fireEvent('pmtPkgCheckBoxClicked', checkBox, value);
					}
					featureItems.push(obj);
					obj.readOnly = feature.readOnly;
					obj.featureValue = feature.featureValue;
					obj.privParam = feature.privParam;
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setPWDOptions : function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'PWD', '');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.value = feature.featureValue;
					obj.nodeType = feature.privParam;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
					}

					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;

					/*if(obj.featureId =='EDITSTNDWORKFLOW' || obj.featureId =='NEWWORKFLOWDEF')
						obj.disabled=true;*/

					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.24;
					featureItems.push(obj);
					obj.readOnly = feature.readOnly;
					obj.featureValue = feature.featureValue;
					obj.privParam = feature.privParam;
					fieldJson.push(obj);
				});
		return featureItems;
	},
	filterFeatures : function(data, featureType, subsetCode) {
		var allFeatures = new Ext.util.MixedCollection();
		allFeatures.addAll(data);
		var featureFilter = new Ext.util.Filter({
					filterFn : function(item) {
						return item.featureType == featureType;
					}
				});
		var featurs = allFeatures.filter(featureFilter);
		return featurs.items;
	},
	initComponent : function() {
		var thisClass = this;
		var strUrl = 'cpon/clientServiceSetup/cponPermissionFeatures';
		var colModel = thisClass.getColumns();

		featureGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					xtype : 'payFeatureViewGrid',
					itemId : 'payFeatureViewGrid',
					showPager : false,
					showAllRecords : true,
					stateful : false,
					showEmptyRow : false,
					showCheckBoxColumn : false,
					padding : '5 0 0 0',
					minHeight : 10,
					autoWidth : true,

					columnModel : colModel,
					storeModel : {
						fields : ['name', 'isAssigned', 'value',
								'isAutoApproved', 'profileId', 'readOnly'],
						proxyUrl : strUrl,
						rootNode : 'd.filter',
						totalRowsNode : 'd.__count'
					},
					listeners : {
						render : function(grid) {
							thisClass.handleLoadGridData(grid,
									grid.store.dataUrl, grid.pageSize, 1, 1,
									null);
						},
						gridPageChange : thisClass.handleLoadGridData,
						gridSortChange : thisClass.handleLoadGridData,
						gridRowSelectionChange : function(grid, record,
								recordIndex, records, jsonData) {
						}
					}
				});

		thisClass.items = [{
			xtype : 'container',
			items : [{
				xtype : 'panel',
				listeners : {
						'afterrender' : function() {
							var payCheckBoxes = objPayFeaturePopup
									.query('container');
							var isRepChecked = false, isNonRepChecked = false, isSemiRepChecked = false;
							for (var i = 0; i < payCheckBoxes.length; i++) {
							if (payCheckBoxes[i].id == "templatesSection") {
								var cBox = payCheckBoxes[i].query('checkbox');
								var objCbRep = null;
								for (var j = 0; j < cBox.length; j++) {
									if (!isEmpty(cBox[j].featureId)) {
										if ('REP' === cBox[j].featureId)
											isRepChecked = cBox[j].getValue();
										else if ('NREP' === cBox[j].featureId)
											isNonRepChecked = cBox[j]
													.getValue();
										else if ('SREP' === cBox[j].featureId)
											isSemiRepChecked = cBox[j]
													.getValue();
									}
									//if(clientType == 'S') {
									//	cBox[j].setDisabled(true);
									//}
								}
							}
						}

							for (var i = 0; i < payCheckBoxes.length; i++) {
							if (payCheckBoxes[i].id == "templatesApprovalSection") {
								var cBox = payCheckBoxes[i].query('checkbox');
								for (var j = 0; j < cBox.length; j++) {
									if (!isEmpty(cBox[j].featureId)) {
										if ('AREP' === cBox[j].featureId) {
											if (isRepChecked)
												cBox[j].setDisabled(false);

											else {
												cBox[j].setDisabled(true);
												cBox[j].setValue(false);
											}
										} else if ('ANREP' === cBox[j].featureId) {
											if (isNonRepChecked)
												cBox[j].setDisabled(false);

											else {
												cBox[j].setDisabled(true);
												cBox[j].setValue(false);
											}
										}

										else if ('ASREP' === cBox[j].featureId) {
											if (isSemiRepChecked)
												cBox[j].setDisabled(false);

											else {
												cBox[j].setDisabled(true);
												cBox[j].setValue(false);
											}
										}
									}
									//if(clientType == 'S') {
									//	cBox[j].setDisabled(true);
									//}
								}
							}
						}
						}

					},
				items : [{
					xtype : 'container',
					cls : 'ft-padding-bottom',
					itemId : 'payOptions_id',
					layout : {
						type : 'vbox'
					},
					items : [{
						xtype : 'container',
						layout : {
							type : 'hbox'
						},
						items : [{
									xtype : 'label',
									text : getLabel('paymentType',
											'Payment Type'),
									width : '100%'
								}/*, {
									xtype : 'container',
									itemId : 'payOptions_links',
									width : '100%',
									hidden : thisClass.enableDisableLinks('PO',
											''),
									margin : '0 0 3 15',
									items : [{
										xtype : 'button',
										cls : 'xn-account-filter-btnmenu',
										border : 0,
										width : (screen.width) > 1024 ? 54 : 45,
										text : '<span style="font-size:13px" class="button_underline ux_no-padding-left thePointer">'
												+ getLabel('selectAll',
														'Select All')
												+ '</span>',
										handler : function() {
											thisClass
													.selectAll_Clear(
															this
																	.up('container[itemId=payOptions_id]')
																	.down('container[itemId=payOptions_chkBox]'),
															true);
										}
									}, {
										xtype : 'button',
										text : '<span style="font-size:13px" class="button_underline thePointer">'
												+ getLabel('clear', 'Clear')
												+ '</span>',
										cls : 'xn-account-filter-btnmenu ux_verylargemargin-left',
										handler : function() {
											thisClass
													.selectAll_Clear(
															this
																	.up('container[itemId=payOptions_id]')
																	.down('container[itemId=payOptions_chkBox]'),
															false);
										}
									}]
								}*/]
					}, {
						xtype : 'container',
						itemId : 'payOptions_chkBox',
						featureId : 2,
						layout : 'column',
						width : '100%',
						padding : '0 0 0 0',
						vertical : false,
						items : thisClass.setPayType()
					}]
				}, {
					xtype : 'container',
					cls : 'ft-padding-bottom',
					itemId : 'templateOptions_id',
					id : 'templatesSection',
					hidden : Ext.isEmpty(thisClass.setTemplatesOptions(false))
							? true
							: false,
					layout : {
						type : 'vbox'
					},
					items : [{
						xtype : 'container',
						layout : {
							type : 'hbox'
						},
						items : [{
									xtype : 'label',
									text : getLabel('templates', 'Templates'),
									width : '100%'
								}/*, {
									xtype : 'container',
									itemId : 'templateOptions_links',
									width : '100%',
									hidden : thisClass.enableDisableLinks('T',
											'TPL'),
									margin : '0 0 3 15',
									items : [{
										xtype : 'button',
										width : (screen.width) > 1024 ? 54 : 45,
										style : {
											'font-size' : '13px'
										},
										text : '<span style="font-size:13px" class="button_underline ux_no-padding-left thePointer">'
												+ getLabel('selectAll',
														'Select All')
												+ '</span>',
										cls : 'xn-account-filter-btnmenu',
										handler : function() {
											thisClass
													.selectAll_Clear(
															this
																	.up('container[itemId=templateOptions_id]')
																	.down('container[itemId=templateOptions_chkBox]'),
															true);
										}
									}, {
										xtype : 'button',
										text : '<span style="font-size:13px" class="button_underline thePointer">'
												+ getLabel('clear', 'Clear')
												+ '</span>',
										cls : 'xn-account-filter-btnmenu ux_verylargemargin-left',
										handler : function() {
											thisClass
													.selectAll_Clear(
															this
																	.up('container[itemId=templateOptions_id]')
																	.down('container[itemId=templateOptions_chkBox]'),
															false);
										}
									}]
								}*/]
					}, {
						xtype : 'container',
						itemId : 'templateOptions_chkBox',
						featureId : 2,
						layout : 'column',
						width : '100%',
						padding : '0 0 0 0',
						vertical : false,
						items : thisClass.setTemplatesOptions(true)
					}]
				}, {
					xtype : 'container',
					cls : 'ft-padding-bottom',
					itemId : 'templateApprovalOptions_id',
					id : 'templatesApprovalSection',
					hidden : Ext.isEmpty(thisClass
							.setTemplatesApprovalOptions(false)) ? true : false,
					layout : {
						type : 'vbox'
					},
					items : [{
						xtype : 'container',
						layout : {
							type : 'hbox'
						},
						items : [{
									xtype : 'label',
									text : getLabel('approvaltemplate', 'Approval Required for Templates'),
									width : '100%'
								}]
					}, {
						xtype : 'container',
						itemId : 'templateApprovalOptions_chkBox',
						featureId : 2,
						layout : 'column',
						width : '100%',
						padding : '0 0 0 0',
						vertical : false,
						items : thisClass.setTemplatesApprovalOptions(true)
					}]
				}, {
					xtype : 'container',
					cls : 'ft-padding-bottom',
					itemId : 'options_id',
					layout : {
						type : 'vbox'
					},
					items : [{
						xtype : 'container',
						layout : {
							type : 'hbox'
						},
						items : [{
									xtype : 'label',
									text : getLabel('options', 'Options'),
									width : '100%'
								}/*, {
									xtype : 'container',
									itemId : 'options_links',
									width : '100%',
									hidden : thisClass.enableDisableLinks('O',
											''),
									margin : '0 0 3 15',
									items : [{
										xtype : 'button',
										width : (screen.width) > 1024 ? 54 : 45,
										text : '<span style="font-size:13px" class="button_underline ux_no-padding-left thePointer">'
												+ getLabel('selectAll',
														'Select All')
												+ '</span>',
										cls : 'xn-account-filter-btnmenu',
										handler : function() {
											thisClass
													.selectAll_Clear(
															this
																	.up('container[itemId=options_id]')
																	.down('container[itemId=options_chkBox]'),
															true);
										}
									}, {
										xtype : 'button',
										text : '<span style="font-size:13px" class="button_underline thePointer">'
												+ getLabel('clear', 'Clear')
												+ '</span>',
										cls : 'xn-account-filter-btnmenu ux_verylargemargin-left',
										handler : function() {
											thisClass
													.selectAll_Clear(
															this
																	.up('container[itemId=options_id]')
																	.down('container[itemId=options_chkBox]'),
															false);
										}
									}]
								}*/]
					}, {
						xtype : 'container',
						itemId : 'options_chkBox',
						featureId : 2,
						layout : 'column',
						width : '100%',
						padding : '0 0 0 0',
						vertical : false,
						items : thisClass.setOptions(true),
						hidden : Ext.isEmpty(thisClass.setOptions(false))
								? true
								: false
					}]
				}, {
					xtype : 'container',
					itemId : 'screenOptions_id',
					cls : 'ft-padding-bottom',
					layout : {
						type : 'vbox'
					},
					items : [{
						xtype : 'container',
						layout : {
							type : 'hbox'
						},
						items : [{
									xtype : 'label',
									text : getLabel('screenOptions',
											'Screen Options'),
									width : '100%'
								}/*, {
									xtype : 'container',
									width : '100%',
									itemId : 'screenOptions_links',
									hidden : thisClass.enableDisableLinks('SO',
											''),
									margin : '0 0 3 15',
									items : [{
										xtype : 'button',
										width : (screen.width) > 1024 ? 54 : 45,
										text : '<span style="font-size:13px" class="button_underline ux_no-padding-left thePointer">'
												+ getLabel('selectAll',
														'Select All')
												+ '</span>',
										cls : 'xn-account-filter-btnmenu',
										handler : function() {
											thisClass
													.selectAll_Clear(
															this
																	.up('container[itemId=screenOptions_id]')
																	.down('container[itemId=screen_options_chkBox]'),
															true);
										}
									}, {
										xtype : 'button',
										text : '<span style="font-size:13px" class="button_underline thePointer">'
												+ getLabel('clear', 'Clear')
												+ '</span>',
										cls : 'xn-account-filter-btnmenu ux_verylargemargin-left',
										handler : function() {
											thisClass
													.selectAll_Clear(
															this
																	.up('container[itemId=screenOptions_id]')
																	.down('container[itemId=screen_options_chkBox]'),
															false);
										}
									}]
								}*/]
					}, {
						xtype : 'container',
						itemId : 'screen_options_chkBox',
						featureId : 2,
						width : '100%',
						padding : '0 0 0 0',
						layout : 'column',
						vertical : true,
						items : thisClass.setScreenOptions(true),
						hidden : Ext.isEmpty(thisClass.setScreenOptions(false))
								? true
								: false
					}]
				},
						/*{
					xtype: 'checkboxgroup',
					featureId: 2,
					fieldLabel: getLabel('view','View'),
					layout : 'column',								
					width: '100%',
					padding: '0 0 0 10',
					vertical: true,
					items: thisClass.setPayViewOptions()
				},*/
						{
							xtype : 'container',
							itemId : 'exportOptions_id',
							cls : 'ft-padding-bottom',
							layout : {
								type : 'vbox'
							},
							items : [{
								xtype : 'container',
								layout : {
									type : 'hbox'
								},
								items : [{
											xtype : 'label',
											text : getLabel('export', 'Export'),
											width : '100%'
										}/*, {
											xtype : 'container',
											itemId : 'export_options_links',
											width : '100%',
											hidden : thisClass
													.enableDisableLinks('E', ''),
											margin : '0 0 3 15',
											items : [{
												xtype : 'button',
												width : (screen.width) > 1024
														? 54
														: 45,
												text : '<span style="font-size:13px" class="button_underline thePointer">'
														+ getLabel('selectAll',
																'Select All')
														+ '</span>',
												cls : 'xn-account-filter-btnmenu ux_no-padding-left',
												handler : function() {
													thisClass
															.selectAll_Clear(
																	this
																			.up('container[itemId=exportOptions_id]')
																			.down('container[itemId=export_options_chkBox]'),
																	true);
												}
											}, {
												xtype : 'button',
												text : '<span style="font-size:13px" class="button_underline thePointer">'
														+ getLabel('clear',
																'Clear')
														+ '</span>',
												cls : 'xn-account-filter-btnmenu ux_verylargemargin-left',
												handler : function() {
													thisClass
															.selectAll_Clear(
																	this
																			.up('container[itemId=exportOptions_id]')
																			.down('container[itemId=export_options_chkBox]'),
																	false);
												}
											}]
										}*/]
							}, {
								xtype : 'container',
								itemId : 'export_options_chkBox',
								featureId : 2,
								width : '100%',
								padding : '0 0 0 0',
								layout : 'column',
								vertical : true,
								items : thisClass.setPayExportOptions(true),
								hidden : Ext.isEmpty(thisClass
										.setPayExportOptions(false)) ? true : false
							}]
						}, {
							xtype : 'container',
							itemId : 'restrictionDays',
							cls : 'ft-padding-bottom',
							layout : {
								type : 'vbox'
							},
							items : thisClass.setScreenDays()
						}

				/*,{
						xtype: 'checkboxgroup',
						itemId:'paymentPackages',
						layout:'column',
						fieldLabel: getLabel('paymentPackages','Payment Methods'),
						width: '100%',
						padding: '0 0 0 10',
						vertical: true,
						items: thisClass.setPaymentPackages()											
				},{
						xtype: 'checkboxgroup',
						itemId:'paymentWorkflowDefinition',
						layout:'column',
						fieldLabel: getLabel('paymentWorkflowDefinition','Payment Workflow Definition'),
						width: '100%',
						padding: '0 0 0 10',
						vertical: true,
						items: thisClass.setPWDOptions()											
				}*/
				]
			}, {
				xtype : 'container',
				collapsible : true,
				cls : 'xn-ribbon ft-padding-bottom',
				collapseFirst : true,
				items : [featureGrid]

			}]
		}];

		thisClass.bbar = (viewmode == 'VIEW' || viewmode == "MODIFIEDVIEW"
						|| viewmode == "VERIFY") ?['->',{
					text : getLabel('cancel', 'Cancel'),
					//glyph : 'xf056@fontawesome',
					handler : function(btn, opts) {
						thisClass.close();
					}
				}] :[{
					text : getLabel('cancel', 'Cancel'),
					//glyph : 'xf056@fontawesome',
					handler : function(btn, opts) {
						thisClass.close();
					}
				}, '->', {
					text : getLabel('submit', 'Submit'),
					//cls : 'ft-button-secondary new-rule-priority-xbtn-left ux_button-padding ux_cancel-button filter-poup-btn-margin-l footer-btns',
					//glyph : 'xf058@fontawesome',
					handler : function(btn, opts) {
						thisClass.saveItems();
						thisClass.close();
					}
				}];
		this.callParent(arguments);
		this.comboBoxHandler();
		if (viewmode == 'VIEW' || viewmode == "MODIFIEDVIEW"
				|| pagemode == "VERIFY") {
			this.setOldNewValueClass();
			this.removeSelectionsLinks();
		}

	},
	getColumns : function() {
		arrColsPref = [{
					"colId" : "name",
					"colDesc" : 'Type'
				}];
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.width = 200;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		if (viewmode == 'VIEW' || viewmode == "MODIFIEDVIEW"
				|| pagemode == "VERIFY") {
			arrCols.push(me.createViewAssignedActionColumn());
			arrCols.push(me.createViewAutoApproveActionColumn());
		} else {
			arrCols.push(me.createAssignedActionColumn());
			arrCols.push(me.createAutoApproveActionColumn());
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if(record.raw.updated != 0 && (record.raw.isChangedUpdated == "M" || record.raw.isChangedAutoApproved == "M" 
					|| record.raw.isChangedUpdated == "N" || record.raw.isChangedAutoApproved == "N"))
				{
					strRetValue = '<span id="Advpopup'+rowIndex+'">'+value+'</span>';
					if(record.raw.isChangedUpdated == "M"){
						admPrivList[rowIndex] = "modifiedFieldValue";
					}
					else if(record.raw.isChangedUpdated == "N"){
						admPrivList[rowIndex] = "newFieldGridValue";
					}
					else{
						admPrivList[rowIndex] = "noChange";
					}
					if(record.raw.isChangedAutoApproved == "M"){
						admPrivAutoAppList[rowIndex] = "modifiedFieldValue";
					}
					else if(record.raw.isChangedAutoApproved == "N"){
						admPrivAutoAppList[rowIndex] = "newFieldGridValue";
					}
					else{
						admPrivAutoAppList[rowIndex] = "noChange";
					}
				}
		else
				{
					strRetValue = '<span id="Advpopup'+rowIndex+'">'+value+'</span>';
					admPrivList[rowIndex] = null;
					admPrivAutoAppList[rowIndex] = null;
				}
		return strRetValue;
	},

	createViewAssignedActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'isAssigned',
			colHeader : getLabel('lblAssign','Assign'),
			width : 200,
			align : 'center',
			items : [{
				itemId : 'isAssigned',
				fnIconRenderer : function(value, metaData, record, rowIndex,
						colIndex, store, view) {
					if (!record.get('isEmpty')) {
						if (record.data.readOnly === true) {
							if (record.data.isAssigned === true) {
								var iconClsClass = 'icon-checkbox-checked-grey';
								return iconClsClass;
							} else {
								var iconClsClass = 'icon-checkbox-unchecked-grey';
								return iconClsClass;
							}
						} else {
							if (record.data.isAssigned === true) {
								var iconClsClass = 'icon-checkbox-checked';
								return iconClsClass;
							} else {
								var iconClsClass = 'icon-checkbox-unchecked';
								return iconClsClass;
							}
						}
					}
				}
			}]
		};

		return objActionCol;
	},
	createViewAutoApproveActionColumn : function() {
		var me = this;
		var arrNonAuthFeature = ['FPAY-000011','FPAY-000012'];
		var objActionCol = {
			colType : 'action',
			colId : 'isAutoApproved',
			colHeader : getLabel('autoapprove','Approval Required'),
			width : 200,
			align : 'center',
			items : [{
				itemId : 'isAutoApproved',
				fnIconRenderer : function(value, metaData, record, rowIndex,
						colIndex, store, view) {
					if (!record.get('isEmpty') && arrNonAuthFeature.indexOf(record.data.value) < 0) {
						if (record.data.readOnly === true) {
							if (record.data.isAutoApproved === true) {
								var iconClsClass = 'icon-checkbox-checked-grey';
								return iconClsClass;
							} else {
								var iconClsClass = 'icon-checkbox-unchecked-grey';
								return iconClsClass;
							}
						} else {
							if (record.data.isAutoApproved === true) {
								var iconClsClass = 'icon-checkbox-checked';
								return iconClsClass;
							} else {
								var iconClsClass = 'icon-checkbox-unchecked';
								return iconClsClass;
							}
						}
					}
				}
			}]
		};
		return objActionCol;
	},
	createAssignedActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'isAssigned',
			colHeader : getLabel('lblAssign','Assign'),
			width : 200,
			align : 'center',
			items : [{
				itemId : 'isAssigned',
				fnClickHandler : function(tableView, rowIndex, columnIndex,
						btn, event, record) {
					var panel = tableView.up('window');
					var target = panel.getTargetEl();
					if (record.data.readOnly === false) {
						var arrXY = target.getScroll();
						if (record.data.isAssigned === false) {
							record.set("isAssigned", true);
							target.scrollTo('top',arrXY.top);
						} else {
							record.set("isAssigned", false);
							target.scrollTo('top',arrXY.top);
						}
					}
				},
				fnIconRenderer : function(value, metaData, record, rowIndex,
						colIndex, store, view) {
					if (!record.get('isEmpty')) {
						if (record.data.readOnly === true) {
							if (record.data.isAssigned === true) {
								var iconClsClass = 'icon-checkbox-checked-grey';
								return iconClsClass;
							} else {
								var iconClsClass = 'icon-checkbox-unchecked-grey';
								return iconClsClass;
							}
						} else {
							if (record.data.isAssigned === true) {
								var iconClsClass = 'icon-checkbox-checked';
								return iconClsClass;
							} else {
								var iconClsClass = 'icon-checkbox-unchecked';
								return iconClsClass;
							}
						}
					}
				}
			}]
		};

		return objActionCol;
	},
	createAutoApproveActionColumn : function() {
		var me = this;
		var arrNonAuthFeature = ['FPAY-000011','FPAY-000012'];
		var objActionCol = {
			colType : 'action',
			colId : 'isAutoApproved',
			colHeader : getLabel('autoapprove','Approval Required'),
			width : 200,
			align : 'center',
			items : [{
				itemId : 'isAutoApproved',
				fnClickHandler : function(tableView, rowIndex, columnIndex,
						btn, event, record) {
					var panel = tableView.up('window');
					var target = panel.getTargetEl();
					if (record.data.readOnly === false) {
						var arrXY = target.getScroll();
						if (record.data.isAutoApproved === false) {
							record.set("isAutoApproved", true);
							target.scrollTo('top',arrXY.top);
						} else {
							record.set("isAutoApproved", false);
							target.scrollTo('top',arrXY.top);
						}
					}
				},
				fnIconRenderer : function(value, metaData, record, rowIndex,
						colIndex, store, view) {
					if (!record.get('isEmpty') && arrNonAuthFeature.indexOf(record.data.value) < 0) {
						if (record.data.readOnly === true) {
							if (record.data.isAutoApproved === true) {
								var iconClsClass = 'icon-checkbox-checked-grey';
								return iconClsClass;
							} else {
								var iconClsClass = 'icon-checkbox-unchecked-grey';
								return iconClsClass;
							}
						} else {
							if (record.data.isAutoApproved === true) {
								var iconClsClass = 'icon-checkbox-checked';
								return iconClsClass;
							} else {
								var iconClsClass = 'icon-checkbox-unchecked';
								return iconClsClass;
							}
						}
					}
				}
			}]
		};
		return objActionCol;
	},
	setOldNewValueClass : function() {
		var me = this;
		Ext.each(fieldJson, function(field, index) {
			var featureId = field.featureId;
			var element = me.down('checkboxfield[featureId=' + featureId + ']');

			if (element != null && element != undefined) {
				element.setReadOnly(true);
				if (viewmode == 'MODIFIEDVIEW') {
					if (field.profileFieldType == 'MODIFIED')
						element.boxLabel = '<span class="modifiedFieldValue" id="VIEW_'+featureId+'">'
								+ element.boxLabel + '</span>';
					else if (field.profileFieldType == 'NEW')
						element.boxLabel = '<span class="newFieldGridValue" id="VIEW_'+featureId+'">'
								+ element.boxLabel + '</span>';
					else if (field.profileFieldType == 'DELETED')
						element.boxLabel = '<span class="deletedFieldValue" id="VIEW_'+featureId+'">'
								+ element.boxLabel + '</span>';
				}
			} else {

				var element = me.down('textareafield[featureId=' + featureId
						+ ']');
				if (element != null && element != undefined) {
					element.setReadOnly(true);
					if (viewmode == 'MODIFIEDVIEW') {
						element.fieldCls = me.getOldNewValueClass(field);
					}
				} else {

					var element = me.down('textfield[featureId=' + featureId
							+ ']');
					if (element != null && element != undefined) {
						element.setReadOnly(true);
						if (viewmode == 'MODIFIEDVIEW') {
							element.fieldCls = me.getOldNewValueClass(field);
							if ('MODIFIED' == field.profileFieldType
									&& !Ext.isEmpty(objOldFieldValues)) {
								element.on('render', function() {
									Ext.create('Ext.tip.ToolTip', {
												target : element.id,
												html : objOldFieldValues[featureId]
											});
								});
							}
						}
					}
				}
			}
		});
	},
	removeSelectionsLinks : function() {
		var me = this;
		if(me.down('container[itemId=payOptions_links]') != null)
			me.down('container[itemId=payOptions_links]').hide();
		if(me.down('container[itemId=templateOptions_links]') != null)
			me.down('container[itemId=templateOptions_links]').hide();
		if(me.down('container[itemId=fileOptions_links]') != null)
			me.down('container[itemId=fileOptions_links]').hide();
		if(me.down('container[itemId=options_links]') != null)
			me.down('container[itemId=options_links]').hide();
		if(me.down('container[itemId=screenOptions_links]') != null)
			me.down('container[itemId=screenOptions_links]').hide();
		if(me.down('container[itemId=export_options_links]') != null)
			me.down('container[itemId=export_options_links]').hide();
	},
	getOldNewValueClass : function(feature) {
		if (feature.profileFieldType == 'MODIFIED')
			return "modifiedFieldValue ";
		else if (feature.profileFieldType == 'NEW')
			return "newFieldValue ";
		else if (feature.profileFieldType == 'DELETED')
			return "deletedFieldValue ";
	},
	showCheckedSection : function() {
	},
	isSectionChecked : function(featureId) {

		if (selectedEntryFeatures == undefined)
			return false;
		var result = $.grep(selectedEntryFeatures, function(e) {
					return e == featureId;
				});
		return (result.length > 0);
	},
	saveItems : function() {
		var blnIsUnselected = false;
		var me = this;
		var grid = me.down('grid[itemId=payFeatureViewGrid]');
		var records = grid.store.data;
		Ext.each(fieldJson, function(field, index) {
			var featureId = field.featureId;
			var element = me.down('checkboxfield[featureId=' + featureId + ']');
			var strNodeType = !isEmpty(field.nodeType) ? field.nodeType : '';
			if ('S' === clientType && 'C Param'===strNodeType) {
				if (element != null && element != undefined) {
					field.featureValue = element.getValue();
					field.isAssigned = element.getValue();
				} else {
					var element = me.down('textfield[featureId=' + featureId
							+ ']');
					if (element != null && element != undefined) {
						field.featureValue = element.getValue();
						field.value = element.featureId;
						field.isAssigned = true;
					} else {
						var element = me.down('textareafield[featureId='
								+ featureId + ']');
						if (element != null && element != undefined) {
							field.featureValue = element.getValue();
							// field.profileId = element.getValue();
						}
					}
				}
			} else if ('M' === clientType) {
				if (element != null && element != undefined) {
					field.featureValue = element.getValue();
					field.isAssigned = element.getValue();
				} else {
					var element = me.down('textfield[featureId=' + featureId
							+ ']');
					if (element != null && element != undefined) {
						field.featureValue = element.getValue();
						field.value = element.featureId;
						field.isAssigned = true;
					} else {
						var element = me.down('textareafield[featureId='
								+ featureId + ']');
						if (element != null && element != undefined) {
							field.featureValue = element.getValue();
							// field.profileId = element.getValue();
						}
					}
				}
			}

		});
		for (i = 0; i < fieldJson.length; i++) {
			var item = fieldJson[i];
			if (item != null && item != undefined) {
				if (item.isAssigned != undefined && !item.isAssigned)
					isUnselected = true;
			}

		}
		if (!Ext.isEmpty(me.fnCallback) && typeof me.fnCallback == 'function') {
			me.fnCallback(records, fieldJson, blnIsUnselected);
			me.close();
		}
		if(pageMode === "ADD")
		{
			saveClientPaymentFeatureProfile('saveClientPaymentFeatureProfileMst.form');
		}
		else
		{
			saveClientPaymentFeatureProfile('updateClientPayFeatureProfileMst.form');
		}
			
	},
	updateCheckboxSelection : function(grid, responseData, args) {
		var me = this;
		if (!(strPaymentPrevililegesList instanceof Array)) {
			strPaymentPrevililegesList = jQuery
					.parseJSON(strPaymentPrevililegesList);
		}

		if (!Ext.isEmpty(strPaymentPrevililegesList)) {
			var previousSelectedData = strPaymentPrevililegesList;
			if (!Ext.isEmpty(grid)) {
				var store = grid.getStore();
				var records = store.data;
				if (!Ext.isEmpty(records)) {
					var items = records.items;
					if (!Ext.isEmpty(items)) {
						for (var index = 0; index < items.length; index++) {
							var item = items[index].data;
							item.isAssigned = false;
							item.isAutoApproved = false;
						}

						for (var index = 0; index < previousSelectedData.length; index++) {
							var currentData = previousSelectedData[index];
							for (var i = 0; i < items.length; i++) {
								var item = items[i].data;
								if (currentData.value == item.value) {
									item.isAssigned = currentData.isAssigned;
									item.isAutoApproved = currentData.isAutoApproved;
								}
							}
						}
					}
				}
			}
		}
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&id=' + encodeURIComponent(parentkey);
		if (!Ext.isEmpty(me.profileId)) {
			var url = Ext.String.format(
					'&featureType={0}&module={1}&profileId={2}',
					me.featureType, me.module, me.profileId);
			strUrl = strUrl + url;
		} else {
			var url = Ext.String.format('&featureType={0}&module={1}',
					me.featureType, me.module);
			strUrl = strUrl + url;
		}
		if (me.isAllSelected == "Y") {
			strUrl = strUrl + '&isAllSelected=Y';
		}
		grid.loadGridData(strUrl, me.updateCheckboxSelection, grid, false);
	}/*,
	selectAll_Clear : function(parentContainer, flag) {
		var checkboxArray = parentContainer.items.items;
		for (var i = 0; i < checkboxArray.length; i++) {
			if (checkboxArray[i].xtype === 'checkbox') {
				if (!checkboxArray[i].isDisabled()) {
					if (flag === true) {
						checkboxArray[i].setValue(true)
					} else {
						checkboxArray[i].setValue(false)
					}
				}
			}
		}
	},
	enableDisableLinks : function(fId, fGroup) {
		//if(viewMode === 'VIEW')
		//	return true;
		//else{
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, fId, fGroup);
		var featureItems = [];
		for (var i = 0; i < filteredData.length; i++) {
			if (filteredData[i].readOnly === false)
				return false;
		}
		return true;
		//}
	}*/
});