var fieldJson = [];
Ext.define('GCPView.view.ForecastFeatuesPopup', {
	extend : 'Ext.window.Window',
	xtype : 'forecastFeatuesPopup',
	cls : 'non-xn-popup',
	width : 735,
	minHeight : 500,
	maxHeight : 550,
	draggable : false,
	viewmode : viewmode,
	resizable : false,
	title : getLabel('lblForecastAdvOptTitle', 'Forecast Advance Options'),
	layout : 'fit',
	overflowY : 'auto',
	config : {
		layout : 'fit',
		modal : true,
		draggable : false,
		closeAction : 'hide',
		autoScroll : true,
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null
	},
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'panel',
			cls : 'ft-padding-bottom',
			items : [{
				xtype : 'container',
				cls : 'ft-padding-bottom',
				itemId : 'forecastexport_id',
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
					}]
				}, {
					xtype : 'container',
					itemId : 'forecastexport_chkBox',
					width : '100%',
					labelCls : 'font_bold',
					padding : '0 0 0 0',
					layout : 'column',
					vertical : true,
					items : me.getExportOptions()
				}]
			}, {
				xtype : 'container',
				cls : 'ft-padding-bottom',
				itemId : 'forecastoptions_id',
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
					}]
				}, {
					xtype : 'container',
					itemId : 'forecastexport_chkBox',
					width : '100%',
					labelCls : 'font_bold',
					padding : '0 0 0 0',
					layout : 'column',
					vertical : true,
					items : me.getOptions()
				}]
			
			}]
		}];
		
		me.bbar = (me.viewmode == 'VIEW' || me.viewmode == 'MODIFIEDVIEW' || me.viewmode == 'VERIFY') ? ['->', {
			text : getLabel('cancel','Cancel'),
			handler : function(btn, opts) {
				me.close();
			}
		}] : [{
			text : getLabel('cancel','Cancel'),
			handler : function(btn, opts) {
				me.close();
			}
		}, '->', {
			text : getLabel('submit','Submit'),
			handler : function(btn, opts) {
				me.saveItems();
			}
		}];
		
		me.callParent(arguments);
	},
	saveItems : function() {
		var me = this;
		var blnViewFlag = true;
		var objCpFeatureChecked = document.getElementById('chkImg_F_SRV_BR_PRV_CP');
		var errorMsgLabel = me.down('label[itemId=errorLabel]');
		var count =0 ;
		Ext.each(fieldJson, function(field, index) {
			var featureId = field.featureId;
			var element = me.down('checkboxfield[featureId=' + featureId + ']');
			if (element != null && element != undefined) {
				field.featureValue = element.getValue();
				field.checked = element.checked;
				field.defVal = element.checked;	
				if(element.checked)
					count++;		
			} 
		});
		
		if(fieldJson.length ==count)
		{
			$('#chkAllForecastFeaturesSelectedFlag').attr('src','static/images/icons/icon_unchecked.gif');
		}
		else
		{
			$('#chkAllForecastFeaturesSelectedFlag').attr('src','static/images/icons/icon_checked.gif');
		}

		if (blnViewFlag == true) {
			if (!Ext.isEmpty(errorMsgLabel)) {
				errorMsgLabel.hide();
			} else {
				if (!Ext.isEmpty(me.fnCallback) && typeof me.fnCallback == 'function') {
					me.fnCallback('', fieldJson);
				}
				me.close();
			}
		}
	},
	loadFeaturs : function() {
		return forecastFeatureData;
	},
	getExportOptions : function() {
		var me = this;
		var data = me.loadFeaturs();
		var exportFeatures = [];
		
		Ext.each(data, function(item) {
			if(item.featureType === 'E') {
				var obj = {};
				if (item.profileFieldType != undefined) {
					obj.profileFieldType = item.profileFieldType;
				}
				if(Ext.isDefined(item.featureId)) {
					item.value = item.featureId;
				}
				if(Ext.isDefined(item.checked)) {
					item.isAssigned = item.checked;
				}
				if(Ext.isDefined(item.disabled)) {
					item.readOnly = item.disabled;
				}
				obj.xtype = 'checkbox';
				obj.boxLabel = '<span class="font_normal">' + item.name + '</span>';
				obj.featureId = item.value;
				obj.featureType = item.featureType;
				obj.featureSubsetCode = item.featureSubsetCode;
				obj.profileId = item.profileId;
				obj.columnWidth = 0.3333;
				if (!Ext.isEmpty(item.isAssigned) && item.isAssigned) {
					obj.checked = true;
					obj.defVal = true;
				}
				
				obj.readOnly = item.readOnly;
				fieldJson.push(obj);
				exportFeatures.push(obj);
			}
		});
		
		return exportFeatures;
	},
	
	getOptions : function() {
		var me = this;
		var data = me.loadFeaturs();
		var optionFeatures = [];
		
		Ext.each(data, function(item) {
			if(item.featureType === 'AO') {
				var obj = {};
				if (item.profileFieldType != undefined) {
					obj.profileFieldType = item.profileFieldType;
				}
				if(Ext.isDefined(item.featureId)) {
					item.value = item.featureId;
				}
				if(Ext.isDefined(item.checked)) {
					item.isAssigned = item.checked;
				}
				if(Ext.isDefined(item.disabled)) {
					item.readOnly = item.disabled;
				}
				obj.xtype = 'checkbox';
				obj.boxLabel = '<span class="font_normal">' + item.name + '</span>';
				obj.featureId = item.value;
				obj.featureType = item.featureType;
				obj.featureSubsetCode = item.featureSubsetCode;
				obj.profileId = item.profileId;
				obj.columnWidth = 0.3333;
				if (!Ext.isEmpty(item.isAssigned) && item.isAssigned) {
					obj.checked = true;
					obj.defVal = true;
				}
				
				obj.readOnly = item.readOnly;
				fieldJson.push(obj);
				optionFeatures.push(obj);
			}
		});
		
		return optionFeatures;
	}
});