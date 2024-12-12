Ext
		.define(
				'GCP.view.AddLiquidityRefTimePopup',
				{
					extend : 'Ext.window.Window',
					xtype : 'addLiquidityRefTimePopup',
					requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store',
							'Ext.ux.gcp.AutoCompleter','Ext.form.ComboBox' ],
					width : 450,
					height : 170,
				//	autoHeight : true,
					modal : true,
				//	padding : '10 5 5 10',
					draggable : true,
					// closeAction : 'hide',
					config : {
						identifier : null,
						mode : null
						
					},
					autoScroll : true,
					layout : 'vbox',
					title : getLabel('addReferenceTime',
							'Add Reference Time'),
					initComponent : function() {
						var me = this;
						if ('VIEW' === me.mode)
						 this.title = "View Reference Time";
						if ('EDIT' === me.mode)
							 this.title = "Edit Reference Time";
						
						 var hoursStore = Ext.create('Ext.data.Store', {
						        fields: ['value', 'name'],
						        
						        data: [{"value": "00","name": "00"},{"value": "01","name": "01"},{"value": "02","name": "02"},{"value": "03","name": "03"},{"value": "04","name": "04"},{"value": "05","name": "05"},{"value": "06","name": "06"},{"value": "07","name": "07"},{"value": "08","name": "08"},{"value": "09","name": "09"},{"value": "10","name": "10"},
						               {"value": "11","name": "11"},{"value": "12","name": "12"},{"value": "13","name": "13"},{"value": "14","name": "14"},{"value": "15","name": "15"},{"value": "16","name": "16"},{"value": "17","name": "17"},{"value": "18","name": "18"},{"value": "19","name": "19"},{"value": "20","name": "20"},
						               {"value": "21","name": "21"},{"value": "22","name": "22"},{"value": "23","name": "23"}
						          ]}); 
						 
						 var minSecStore = Ext.create('Ext.data.Store', {
						        fields: ['value', 'name'],
						        
						        data: [{"value": "00","name": "00"},{"value": "01","name": "01"},{"value": "02","name": "02"},{"value": "03","name": "03"},{"value": "04","name": "04"},{"value": "05","name": "05"},{"value": "06","name": "06"},{"value": "07","name": "07"},{"value": "08","name": "08"},{"value": "09","name": "09"},{"value": "10","name": "10"},
						               {"value": "11","name": "11"},{"value": "12","name": "12"},{"value": "13","name": "13"},{"value": "14","name": "14"},{"value": "15","name": "15"},{"value": "16","name": "16"},{"value": "17","name": "17"},{"value": "18","name": "18"},{"value": "19","name": "19"},{"value": "20","name": "20"},
						               {"value": "21","name": "21"},{"value": "22","name": "22"},{"value": "23","name": "23"},{"value": "24","name": "24"},{"value": "25","name": "25"},{"value": "26","name": "26"},{"value": "27","name": "27"},{"value": "28","name": "28"},{"value": "29","name": "29"},{"value": "30","name": "30"},
						               {"value": "31","name": "31"},{"value": "32","name": "32"},{"value": "33","name": "33"},{"value": "34","name": "34"},{"value": "35","name": "35"},{"value": "36","name": "36"},{"value": "37","name": "37"},{"value": "38","name": "38"},{"value": "39","name": "39"},{"value": "40","name": "40"},
						               {"value": "41","name": "41"},{"value": "42","name": "42"},{"value": "43","name": "43"},{"value": "44","name": "44"},{"value": "45","name": "45"},{"value": "46","name": "46"},{"value": "47","name": "47"},{"value": "48","name": "48"},{"value": "49","name": "49"},{"value": "50","name": "50"},
						               {"value": "51","name": "51"},{"value": "52","name": "52"},{"value": "53","name": "53"},{"value": "54","name": "54"},{"value": "55","name": "55"},{"value": "56","name": "56"},{"value": "57","name": "57"},{"value": "58","name": "58"},{"value": "59","name": "59"}
						          ]});
						     
						        
						 
						var refTimeHoursComboView = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'refTimeHoursCombo',
									store : hoursStore,
									itemId : 'refTimeHoursCombo',
									fieldCls : 'xn-form-field w2',
			            			labelAlign : 'top',
									triggerBaseCls : 'xn-form-trigger',
									queryMode : 'local',
									displayField : 'name',
									valueField : 'value',
									padding : '5 20 0 0',
									editable : false,
									listeners : {
										scope : this
									}
								});
						
						var refMinComboView = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'refMinCombo',
									store : minSecStore,
									itemId : 'refMinCombo',
									fieldCls : 'xn-form-field w2',
									triggerBaseCls : 'xn-form-trigger',
									queryMode : 'local',
									displayField : 'name',
									valueField : 'value',
									padding : '5 20 0 0',
									editable : false,
									listeners : {
										scope : this
									}
								});
						
						var refSecComboView = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'refSecCombo',
									store : minSecStore,
									itemId : 'refSecCombo',
									fieldCls : 'xn-form-field w2',
									triggerBaseCls : 'xn-form-trigger',
									queryMode : 'local',
									displayField : 'name',
									valueField : 'value',
									padding : '5 20 0 0',
									editable : false,
									listeners : {
										scope : this
									}
								});
						
						
					
						
						me.items = [
							{
							    xtype: 'container',
							    items: [{
							     xtype: 'panel',
							     width:'auto',
							     id : 'Panel0',
							     layout:'hbox',
							     items: [ 
										  {
											    xtype: 'container',
											    items: [{
											     xtype: 'panel',
											     width:'auto',
											     id : 'XPanel1',
											     layout:'vbox',
											     padding : '5 30 0 0',
											     items: [
											     {
														xtype : 'label',
														text :  getLabel('frequencyName', 'Frequency Name'),
														cls : 'x-form-item-label ux_font-size14'
												 },
											     {
											     		xtype : 'textfield',
											     		width : 160,
											     		enforceMaxLength : true,
											     		maxLength : 40,
											     		itemId : 'freqNameField',
											     		padding : '2 10 0 0'
											     }]
											    
											  }] 
											},
											{
												    xtype: 'container',
											        items: [{
											        xtype: 'panel',
											        width:'auto',
											        id : 'Panel2',
											        layout:'vbox',
											        items: [{
																	xtype : 'label',
																	text : getLabel('referenceTime','Reference Time (HHMISS Format)'),
																	cls : 'x-form-item-label ux_font-size14'
																},
																{
																    xtype: 'container',
															     items: [{
															     xtype: 'panel',
															     width:'auto',
															     id : 'Panel3',
															     layout:'hbox',
															     items: [
															            
															             	refTimeHoursComboView,refMinComboView,refSecComboView
															             ]
															     }]
															}]
											  }] 
											}
							    ]}]
							}]; 
						     
						if ('VIEW' === me.mode) {
							me.buttons = [ {
								xtype : 'button',
								text : getLabel('cancel', 'Cancel'),
								cls : 'xn-button ux_button-background-color ux_cancel-button',
								glyph : 'xf056@fontawesome',
								handler : function() {
									me.close();
								}
							} ];
						} else {
							me.buttons = [
									{
										xtype : 'button',
										text : getLabel('cancel', 'Cancel'),
										cls : ' ux_button-background-color ux_cancel-button',
										glyph : 'xf056@fontawesome',
										height : 22,
										handler : function() {
											me.close();
										}
									},
									{
										xtype : 'button',
										text : getLabel('save', 'Save'),
										itemId : 'btnSubmitRefTime', 
										cls : 'ux_button-background-color ux_cancel-button',
										glyph : 'xf0c7@fontawesome',
										height : 22,
										handler : function() {
											//console.log(me.mode);
											this.fireEvent(
													"submitUpdateReferenceTime",
													me.identifier,me.mode);
										}
									} ];

						}
						me.callParent(arguments);
					}
				});