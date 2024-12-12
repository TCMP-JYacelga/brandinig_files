Ext.define('GCP.view.ScheduleDelayPopup', {
			extend : 'Ext.window.Window',
			xtype : 'scheduleDelayPopup',
			modal : true,
			config : 
			{
				identifier : null
			},
	width : 400,
	cls : 'non-xn-popup',
	//height : 200,
	minHeight : 156,
	maxHeight : 550,
	resizable : false,
	draggable : false,
	layout : 'hbox',
	delayTypeValue : 'T',
	hourValue : 0,
	minuteValue : 0,
	initComponent : function() {
		var me = this;
		var i = 1, desc;
		var hourData = [], minuteData = [];
		for(i = 0;i < 24; i++)
		{
			if(i <= 9)
				desc = "0"+i;
			else
				desc = i;
			hourData.push({"name" : desc, "value" : i});
		}
		for(i = 0;i < 60; i++)
		{
			if(i <= 9)
				desc = "0"+i;
			else
				desc = i;
			minuteData.push({"name" : desc, "value" : i});
		}
		
		var hourStore = Ext.create('Ext.data.Store', {
			fields : [ 'name', 'value' ],
			data : hourData
		});
		var minuteStore = Ext.create('Ext.data.Store', {
			fields : [ 'name', 'value' ],
			data : minuteData
		});
		me.items = [
				{
					xtype : 'panel',
					itemId : 'leftPanel',
					layout : 'vbox',
					// width : 200,
					// height : 100
					items : [
							{
								xtype      : 'fieldcontainer',
								fieldLabel : 'Delay Type',
								labelAlign:'top',
								labelSeparator : '',
								defaultType: 'radiofield',
								cls : 'ft-padding-bottom',
								height : 50,
								defaults: {
									flex: 1
								},
								layout: 'hbox',
								items: [
									{
										boxLabel  : 'Time',
										name      : 'delayType',
										inputValue: 'T',
										margin : '5 10 0 0',
										itemId  : 'delayTypeRadio1',
										labelPad : 20,
										fieldStyle : {
											'margin' : '2px 3px 0px 0px !important'
										},
										boxLabelCls : 'label-font-normal',
										checked : true,
										listeners : {
											'change' : function(){
												var hourContainer = me.down('fieldcontainer[itemId=hourFieldContainer]');
												var minuteContainer = me.down('fieldcontainer[itemId=minuteFieldContainer]');
												var daysContainer = me.down('fieldcontainer[itemId=daysFieldContainer]');
												if(this.checked)
												{
													hourContainer.show();
													minuteContainer.show();
													daysContainer.hide();
													me.delayTypeValue = 'T';
												}
												else
												{
													hourContainer.hide();
													minuteContainer.hide();
													daysContainer.show();
													me.delayTypeValue = 'D';
												}
											}
										}
									}, {
										boxLabel  : 'Days',
										name      : 'delayType',
										inputValue: 'D',
										margin : '5 0 0 0',
										itemId        : 'delayTypeRadio2',
										labelPad : 20,
										fieldStyle : {
											'margin' : '2px 3px 0px 0px !important'
										},
										labelPad : 20,
										checked : false,
										boxLabelCls : 'label-font-normal',
										listeners : {
											'change' : function(){
												var hourContainer = me.down('fieldcontainer[itemId=hourFieldContainer]');
												var minuteContainer = me.down('fieldcontainer[itemId=minuteFieldContainer]');
												var daysContainer = me.down('fieldcontainer[itemId=daysFieldContainer]');
												if(this.checked)
												{
													hourContainer.hide();
													minuteContainer.hide();
													daysContainer.show();
													me.delayTypeValue = 'D';
												}
												else
												{
													hourContainer.show();
													minuteContainer.show();
													daysContainer.hide();
													me.delayTypeValue = 'T';
												}
											}
										}
									}
								]
							},
							{
								xtype   : 'fieldcontainer',
								itemId : 'hourFieldContainer',
								layout: 'vbox',//'hbox',
								cls : 'ft-padding-bottom',
								//height : (screen.width) > 1024 ? 35 : 35,
								defaults: {
									flex: 1
								},
								items: [
									{
										xtype : 'label',
										text : 'Hours',
										labelCls : 'frmLabel'
									}, {
										xtype : 'combo',
										itemId : 'delayHour',
										labelSeparator : '',
										editable : false,
										fieldCls : 'xn-form-field inline_block x-trigger-noedit',
										triggerBaseCls : 'xn-form-trigger',
										store : hourStore,
										displayField : 'name',
										valueField : 'value',
										value : 0,
										width : 220,
										listeners : {
											'change' : function(combo,value){
												me.hourValue = combo.getValue();
											}
										}
									}
								]
							},
							{
								xtype   : 'fieldcontainer',
								layout: 'vbox',//'hbox',
								//height : (screen.width) > 1024 ? 35 : 35,
								itemId : 'minuteFieldContainer',
								defaults: {
									flex: 1
								},
								items: [
									{
										xtype : 'label',
										text : 'Minutes',
										labelCls : 'frmLabel'
									}, {
										xtype : 'combo',
										itemId : 'delayMinute',
										labelSeparator : '',
										editable : false,
										fieldCls : 'xn-form-field inline_block x-trigger-noedit',
										triggerBaseCls : 'xn-form-trigger',
										store : minuteStore,
										displayField : 'name',
										valueField : 'value',
										value : 0,
										width : 220,
										listeners : {
											'change' : function(combo,value){
												me.minuteValue = combo.getValue();
											}
										}
									}
								]
							},
							{
								xtype   : 'fieldcontainer',
								itemId : 'daysFieldContainer',
								layout: 'vbox',//'hbox',
								hidden : true,
								defaults: {
									flex: 1
								},
								items: [
									{
										xtype : 'label',
										text : 'Days',
										labelCls : 'frmLabel'
									}, {
										xtype : 'textfield',
										itemId : 'delayDays',
										labelSeparator : '',
										value : 0,
										width : 220
										
									}
								]
							}]
				}]
			
		me.bbar = ['->', {
			xtype : 'button',
			text : getLabel('save', 'Save'),
			//cls : 'xn-button ux_button-background-color ux_cancel-button',
			//glyph : 'xf0c7@fontawesome',
			itemId : 'saveButton',
			handler : function() {
				me.fireEvent("updateScheduleDelayInfo", me);
				me.close();
			}
		} ];
		this.callParent(arguments);
	},
	
	getFormData : function()
	{
		var me = this;
		var filterJson = {};
		var daysField = me.down('textfield[itemId=delayDays]');
		filterJson['delayType'] = me.delayTypeValue;
		filterJson['hours'] = me.hourValue;
		filterJson['minutes'] = me.minuteValue;
		filterJson['days'] = daysField.getValue();
		filterJson['identifier'] = me.getIdentifier();
		return filterJson;
	}
});

