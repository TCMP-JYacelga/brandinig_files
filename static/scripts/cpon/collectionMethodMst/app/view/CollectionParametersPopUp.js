Ext.define('GCP.view.CollectionParametersPopUp', {
	extend : 'Ext.window.Window',
	xtype : 'collectionParametersPopUp',
	width : 500,
	//height : 300,
	modal : true,
	draggable : false,
	closeAction : 'hide',
	autoScroll : true,
	listeners : {
				afterrender : function() {
					this.setInitialValues()
				}
	},
	config : {
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null
	},

	initComponent : function() {
		var me = this;
		this.title = me.title;

		this.items = [{
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				flex : 1,
				margin : '8 0 0 8',
				items : [{
					xtype : 'label',
					itemId : 'containerHdrLabel',
					cls : 'frmLabel',
					text : getLabel('collCreditLevel', 'Credit Level'),
					padding : '5 0 0 3'
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				xType: 'radiogroup',
				itemId : 'objCreditLevel',
				flex : 1,
				margin : '8 0 0 8',
				 items: [
			                {
			                	xtype : 'radiofield',	
			                    boxLabel  :getLabel('collBatch', 'Batch'),
			                    name      : 'rbCreditLevel',
			                    inputValue: 'B',
			                    padding : '0 5 0 0',
			                    id        : 'radio1',
								listeners : {
									'focus' : function(btn, opts) {
										me.setCreditLevel('B');
									}
								}								
			                }, {
			                	xtype : 'radiofield',
			                	boxLabel  :getLabel('collTxn', 'Transaction'),
			                    name      : 'rbCreditLevel',
			                    inputValue: 'I',
			                    id        : 'radio2',
								listeners : {
									'focus' : function(btn, opts) {
									me.setCreditLevel('I');
									}
								}		                    
			                }
			            ]
			}]
		},{
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				flex : 1,
				margin : '8 0 0 8',
				items : [{
					xtype : 'label',
					itemId : 'containerHdrLabel',
					cls : 'frmLabel',
					text : getLabel('collCreditLimProcess', 'Credit Limit Processing'),
					padding : '5 0 0 3'
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				xType: 'radiogroup',
				itemId : 'objCrLimProcessing',
				flex : 1,
				margin : '8 0 0 8',
				 items: [
			                {
			                	xtype : 'radiofield',	
			                    boxLabel  :getLabel('collBatch', 'Batch'),
			                    name      : 'rbCrLimProcessing',
			                    inputValue: 'B',
			                    padding : '0 5 0 0',
			                    id        : 'radio3',
								listeners : {
									'focus' : function(btn, opts) {
										me.setCrLimProcess('B');
									}
								}	
			                }, {
			                	xtype : 'radiofield',
			                	boxLabel  :getLabel('collTxn', 'Transaction'),
			                    name      : 'rbCrLimProcessing',
			                    inputValue: 'I',
			                    id        : 'radio4',
								listeners : {
									'focus' : function(btn, opts) {
										me.setCrLimProcess('I');
									}
								}	
			                }
			            ]	
			}]
		},{
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				flex : 1,
				margin : '8 0 0 8',
				items : [{
					xtype : 'label',
					cls : 'frmLabel',
					itemId : 'containerHdrLabel',
					text : getLabel('collCreditLineRev', 'Credit Line Reversal'),
					padding : '5 0 0 3'
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				xType: 'radiogroup',
				itemId : 'objCrLineRev',
				flex : 1,
				margin : '8 0 0 8',
				 items: [
			                {
			                	xtype : 'radiofield',
			                    boxLabel  :getLabel('collBatch', 'Batch'),
			                    name      : 'rbCrLineRev',
			                    inputValue: 'B',
			                    padding : '0 5 0 0',
			                    id        : 'radio5',
								listeners : {
									'focus' : function(btn, opts) {
										me.setCrLineRev('B');
									}
								}	
			                }, {
			                	xtype : 'radiofield',
			                	boxLabel  :getLabel('collTxn', 'Transaction'),
			                    name      : 'rbCrLineRev',
			                    inputValue: 'I',
			                    id        : 'radio6',
								listeners : {
									'focus' : function(btn, opts) {
										me.setCrLineRev('I');
									}
								}	
			                }
			            ]
			}]
		}];
		if(modeVal == 'VIEW')
		{
			this.buttons = [{
				xtype : 'button',
				text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+getLabel('cancel', 'Cancel'),
				itemId : 'btnCancelParamPopUp',
				cls : 'ux_button-background-color ux_button-padding',
				glyph : 'xf056@fontawesome',
				handler : function() {
					me.close();
				}
			}];			
		}
		else
		{
			this.buttons = [{
						xtype : 'button',
						text : '&nbsp;&nbsp;&nbsp;&nbsp;'+getLabel('save', 'Save'),
						itemId : 'btnSaveParamPopUp',
						cls : 'ux_button-padding ux_button-background-color',
						glyph : 'xf0c7@fontawesome',
						handler : function() {
							me.saveItems();
							me.close();
						}
			}, {
						xtype : 'button',
						text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+getLabel('cancel', 'Cancel'),
						itemId : 'btnCancelParamPopUp',
						cls : 'ux_button-background-color ux_button-padding',
						glyph : 'xf056@fontawesome',
						handler : function() {
							me.close();
						}
					}];
		}
		this.callParent(arguments);
	},

	saveItems : function() {
		var me = this;
	},
	setInitialValues : function() {
		var me = this;			
        var radio1 = Ext.getCmp('radio1');
        var radio2 = Ext.getCmp('radio2');
        var radio3 = Ext.getCmp('radio3');
        var radio4 = Ext.getCmp('radio4');
        var radio5 = Ext.getCmp('radio5');
        var radio6 = Ext.getCmp('radio6');        
        if(strCreditlevel=='B')
        {
        	radio1.setValue(true);
        }
        else
        {
        	radio2.setValue(true);
        }
        if(strCrLimProcess=='B')
        {
        	radio3.setValue(true);
        }
        else
        {
        	radio4.setValue(true);
        }
        if(strCreditlinereversal=='B')
        {
        	radio5.setValue(true);
        }
        else
        {
        	radio6.setValue(true);
        }
		if (modeVal == 'VIEW') {
			radio1.setDisabled(true);
			radio2.setDisabled(true);
			radio3.setDisabled(true);
			radio4.setDisabled(true);
			radio5.setDisabled(true);
			radio6.setDisabled(true);
		}        
	},
		setCreditLevel :  function(strCrLevType) {
			document.getElementById("creditlevel").value=strCrLevType;
		},
		setCrLimProcess :  function(strCrLimProcessType) {
			document.getElementById("creditlimitprocessing").value=strCrLimProcessType;
		},
		setCrLineRev :  function(strCrLineRevType) {
			document.getElementById("creditlinereversal").value=strCrLineRevType;
		}
});