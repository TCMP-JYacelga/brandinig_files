Ext.define('GCP.view.UserTokenAssignmentPopup', {
	extend : 'Ext.window.Window',
	xtype : 'userTokenAssignmentPopup',
	requires : ['Ext.button.Button'],
	id : 'userTokenAssignmentPopup',
	width : 560,
	height : 470,
	title : getLabel('assignTokenToUser', 'Assign Token to User'),
	componentCls : 'ux_no-padding',
	layout : 'fit',
	overflowY : 'auto',
	config : {
		layout : 'fit',
		modal : true,
		draggable : false,
		closeAction : 'destroy',
		autoScroll : true,
		fnCallback : null,
		userNm : null,
		userEmail : null,
		userId: null,
		usrRequestStateDesc : null,
		tokenStatusDesc : null,
		userClient : null,
		corp : null
	},
	initComponent : function() {
		
		var me = this;		 
		me.items = [{
			xtype : 'container',
			layout : 'vbox',
			margin : '6 0 3 0',
			flex : 1,
			items : [{
						xtype : 'container',
						itemId : 'errorContainer',
						maxHeight : 150,
						layout : 'vbox',
						width : '100%',	
						height : 'auto',
						//margin : '0 0 5 0',
						hidden : true
					},{
						xtype : 'container',								            
						layout : 'column',	
						width : '100%',	
						items: [{
								xtype : 'label',
								padding : '13 0 0 10',	
								columnWidth: 0.15,
								text : getLabel('popupUserName','User Name'),
								cls : 'ux_font-size14'
							},{
								xtype : 'label',
								padding : '13 0 0 40',
								columnWidth: 0.35,
								text : me.userNm,
								cls : 'ux_font-size14-normal'
							},{
								xtype : 'label',
								columnWidth: 0.5,
								padding : '13 10 0 35',
								text : me.usrRequestStateDesc,
								cls : 'ux_font-size14-normal rightAlign'
							}]				
					},{
						xtype : 'container',								            
						layout : 'column',	
						width : '100%',	
						items: [{
								xtype : 'label',
								padding : '13 22 0 10',
								columnWidth: 0.15,
								text : getLabel('tokenUsrEmail','Email'),
								cls : 'ux_font-size14'
							},{
								xtype : 'label',
								padding : '13 0 0 40',
								columnWidth: 0.5,
								text : me.userEmail,
								cls : 'ux_font-size14-normal ofcontents'
							},{
								xtype : 'label',
								padding : '13 0 0 10',
								columnWidth: 0.10,
								text : getLabel('lbltoken','Token'),
								cls : 'ux_font-size14-normal rightAlign'
							},{
								xtype : 'label',
								padding : '13 10 0 5',
								columnWidth: 0.25,
								text : me.tokenStatusDesc,
								cls : 'ux_font-size14-normal rightAlign'
							}]				
					},{
						xtype : 'container',								            
						layout : 'column',
						width : '100%',							
						items: [{
								xtype : 'label',
								padding : '13 22 0 10',								
								text : getLabel('lblUserID','User Id'),
								columnWidth: 0.15,
								cls : 'ux_font-size14'
							},{
								xtype : 'label',
								padding : '13 0 0 40',
								columnWidth: 0.35,
								text : me.userId,
								cls : 'ux_font-size14-normal'
							}]				
					},{
						xtype : 'container',								            
						width : '100%',								
						items: [{
								xtype : 'checkbox',
								itemId : 'secondaryAuthReqFlag',
								flex : 1.5,
								cls : 'f13 ux_font-size14-normal',
								padding : '13 0 0 10',
								labelSeparator : ' ',
								boxLabel : getLabel('lblsecondAuthReq', 'Secondary Authentication Required'),
								labelAlign : 'right',
								name : 'secondaryAuthReqFlag'									
						}]
					},{
						xtype : 'container',								            
						layout : 'column',	
						width : '100%',				
						items: [{
							xtype : 'label',
							padding : '13 0 0 10',		
							columnWidth: 0.20,
							text : getLabel('lblTokenType','Token Type'),
							cls : 'ux_font-size14'
							},{
								xtype : 'radiogroup',
								itemId : 'tokenTypeRadio',
								id : 'tokenRadio',
								columnWidth: 0.80,
								columns:[.25, .75],
								padding : '13 0 0 7',
								items :[{
										boxLabel : getLabel( 'softToken', 'Soft Token' ),
										name : 'tokenType',
										inputValue : 'S',
										//labelWidth : 100,
										checked : true,
										listeners:{
											"change" : function(){
												if('S'!==Ext.getCmp('tokenRadio').lastValue.tokenType)
												{
													Ext.getCmp('srNumber').setVisible(false);
													Ext.getCmp('serialNumberLabel').setVisible(false);
												}
												else
												{
													Ext.getCmp('srNumber').setVisible(true);
													Ext.getCmp('serialNumberLabel').setVisible(true);
												}
											}
										}
									},{
										boxLabel : getLabel( 'hardToken', 'Hard Token' ),
										name : 'tokenType',
										//labelWidth : 100,
										inputValue : 'H'
									}
								]
						}]
					},{
						xtype : 'container',								            
						layout : 'vbox',
						padding: '10 0 0 0',						
						width : '100%',		
						hidden : tokenRegWithSerialNo === 'Y' ? true : false,
						items: [{
							xtype : 'label',
							id : 'serialNumberLabel',
							hidden:true,
							//hidden : tokenRegWithSerialNo === 'Y' ? true : false,
							margin : '0 0 0 10',								
							text : getLabel('lbltokenSerialNo','Token Serial Number'),
							cls : 'required-lbl-right ux_font-size14'
							},{
								xtype : 'textfield',
								padding : '13 15 0 10',	
								width : '100%',
								itemId : 'srNumber',
								id : 'srNumber',
								hidden:true,
								name : 'srNumber',
								readonly : true,
								cfgRecordCount : -1,								
								cfgDataNode1 : 'CODE',
								cfgKeyNode : 'CODE'
							}]
					},{
						xtype : 'container',								            
						layout : 'vbox',
						padding: '10 0 0 0',						
						width : '100%',		
						hidden : tokenRegWithSerialNo === 'Y' ? false : true,
						items: [{
							xtype : 'label',
							hidden : tokenRegWithSerialNo === 'Y' ? false : true,
							margin : '0 0 0 10',								
							text : getLabel('lbltokenSerialNo','Token Serial Number'),
							cls : 'required-lbl-right ux_font-size14'
							},{
								xtype : 'AutoCompleter',
								padding : '13 15 0 10',	
								width : '100%',
								fieldCls : 'xn-form-text xn-suggestion-box',
								itemId : 'serialNumber',
								name : 'serialNumber',
								cfgUrl : 'cpon/{0}.json',
								cfgProxyMethodType : 'POST',
								cfgQueryParamName : 'serialNumberFilter',
								cfgRecordCount : -1,								
								cfgSeekId : 'serialNumberSeek',
								cfgDataNode1 : 'CODE',
								cfgKeyNode : 'CODE'
							}]
					},
					{
						xtype : 'container',								            
						layout : 'hbox',	
						width : 400,						
						items: [{
							xtype : 'button',
							margin : '13 0 0 10',
							text : getLabel('saveFilter', 'Save'),
							itemId : 'assignTokenButton',
							formBind : true,
							cls : 'xn-button ux_button-background-color ux_cancel-button w7',
							glyph : 'xf0c7@fontawesome',
							handler : function(btn) {
								var strSecondAuthReq;
								var cbAuthreq = me.down('checkbox[itemId=secondaryAuthReqFlag]');
								var rbTokenType = me.down('radiogroup[itemId="tokenTypeRadio"]').getValue().tokenType;
								var strTokenSerial = me.down('textfield[itemId="serialNumber"]').getValue();
								if(cbAuthreq.checked==true)
								{
									strSecondAuthReq = 'Y';
								}
								else
								{
									strSecondAuthReq = 'N';
								}
								me.fireEvent('assignUserToken',btn,me.userId,me.userClient,me.corp,strSecondAuthReq,rbTokenType,strTokenSerial,oldSerialNo,oldRecordKey);
							}
						}]
					}]
		}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});
