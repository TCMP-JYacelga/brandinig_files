Ext.define('GCP.view.ImportTokenFile',
		{
			extend : 'Ext.window.Window',
			xtype : 'importTokenFile',
			requires : [ 'Ext.button.Button', 'Ext.form.field.File' ],
			maxHeight: 550,
			minHeight:156,
			width : 700,
			modal : true,
			resizable: false,
			draggable: false,
			title : getLabel('importTokenFile', 'Import Token File'),
			cls : 'non-xn-popup',
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
				profileId : null,
				featureType : null,
				module : null,
				strAction : null,
				resetclicked : false,				
				title : null
			},
			initComponent : function() {
				var me = this, arrItems = [];
				var firstSeller;
				var strBtnText = getLabel("btnDone", "Done");
				
				Ext.Ajax.request({
					url : 'services/userseek/adminSellersListCommon.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var sellerData = data.d.preferences;
						if (!Ext.isEmpty(data)) {
							storeData = sellerData;
						}
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}
				});
				
				var objSellerStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'preferences'
					},
				listeners : {
				'load' : function(store) {
					if(!Ext.isEmpty(store) && !Ext.isEmpty(store.first()))
						firstSeller = store.first().get('CODE');					
				}}
				});	
				
				
				var objTokenTypeStore = Ext.create('Ext.data.Store', {
					fields : [ 'tokenType', 'tokenDesc' ],
					data : [{
						tokenType : 'S',
						tokenDesc : getLabel('importSoftToken', 'Soft')
					}, {
						tokenType : 'H',
						tokenDesc : getLabel('importHardToken', 'Hard')
					} ]
				});
				
				Ext.Ajax.request({
					url : 'services/userseek/tokenFileFormatType.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var tokendata = data.d.preferences;
						if (!Ext.isEmpty(data)) {
							storeData = tokendata;
						}
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}
				});
				var objFileFormatTypeStore = Ext.create('Ext.data.Store', {
					fields : [ 'FILETYPE', 'FILEDESC' ],
					data :storeData,
					reader : {
						type : 'json',
						root : 'preferences'
					}
				
				});
				arrItems = [{
						xtype : 'panel',
						itemId: 'errorText',
						cls : 'ft-padding-bottom',
						hidden :true
					},{
					xtype : 'panel',
					layout : 'column',
					width : '100%',	
					flex : 1,
					items : [{
						xtype : 'container',
						columnWidth : 0.3334,
						cls : 'ux_extralargemargin-right',
						//flex : 1,
						layout : {
							type : 'vbox'
						},
						items : [{
									xtype : 'label',
									text : getLabel('seller', 'Financial Institution'),
									cls : 'ux_font-size14-normal required-lbl-right'
								},
								{
									xtype : 'combo',
									width : '100%',
									//columnWidth: 0.60,
									
								    fieldCls : 'xn-form-field inline_block x-trigger-noedit ',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'sellerId',
									name : 'sellerCode',
									itemId : 'sellerCodeID',									
									editable : false,
									displayField : 'DESCR',
									valueField : 'CODE',
									store : objSellerStore,
									value : firstSeller,
									listeners : {
										'render' : function(combo, record) {
											console.log('render');
										},
										'load': function(){
											console.log('loaded');
										}
									}
								}
							]
					 },
					 {
							xtype : 'container',
							columnWidth : 0.3334,
							cls : 'ux_extralargemargin-right ux_extralargemargin-left',
							layout : {
								type : 'vbox'
							},
							items : [{
										xtype : 'label',
										//maxWidth : 100,
										text : getLabel('tokentype', 'Token Type'),
										cls : 'ux_font-size14-normal required-lbl-right'
									},
									{
										xtype : 'combo',
										width : '100%',
										//columnWidth: 0.60,
										fieldCls : 'xn-form-field inline_block x-trigger-noedit ',
										triggerBaseCls : 'xn-form-trigger',
										filterParamName : 'tokenType',
										displayField : 'tokenDesc',
										itemId : 'tokenType',
										valueField : 'tokenType',
										name : 'tokenType',
										editable : false,
										value : 'H',
										store : objTokenTypeStore
									}
								]
					},
					{
							xtype : 'container',
							columnWidth : 0.3334,
							cls : 'ux_extralargemargin-left',
							layout : {
								type : 'vbox'
							},
							items : [{
										xtype : 'label',
										text : getLabel('selectdpxfile', 'File Format Type'),
										cls : 'ux_font-size14-normal required-lbl-right'
									},
									{
										xtype : 'combo',
										width : '100%',
										//columnWidth: 0.60,
										displayField : 'FILEDESC',
										fieldCls : 'xn-form-field inline_block x-trigger-noedit ',
										triggerBaseCls : 'xn-form-trigger',
										filterParamName : 'FILETYPE',
										itemId : 'FILETYPE',
										valueField : 'FILETYPE',
										name : 'FILETYPE',
										editable : false,
										labelWidth : 100, 
										value : 'Select',
										store : objFileFormatTypeStore
									}
								]
					}]
				}].concat(me.getFileUploadItems());
				me.items = [ {
					xtype : 'container',
					itemId : 'itemCt',
					layout : 'vbox',
					margin : '6 0 3 0',
					flex : 1,
					items : arrItems
				} ];

				me.bbar = [{
					xtype : 'button',
					text : getLabel("btnCancel", "Cancel"),
					handler : function() {
						me.close();
					}
				},'->',{
					xtype : 'button',
					text : strBtnText,
					handler : function() {
						me.fireEvent('addFile');
					}
				}];				
				me.on('resize', function() {
					me.doLayout();
				});
				me.callParent(arguments);
			},

			getFileUploadItems : function() {
				var me = this;
				var arrItems = [];
					arrItems = [{
						xtype : 'panel',
						layout : 'column',
						width : '100%',	
						cls : 'ux_extralargepadding-top',
						items : [
									{
										xtype : 'container',
										columnWidth : 0.3334,
										cls : 'ux_extralargemargin-right',
										layout : {
											type : 'vbox'
										},
										items : [{
													xtype : 'label',
													//margin : '5 0 0 0',
													text : getLabel('lblselectfile','File Name'),
													cls : 'ux_font-size14-normal required-lbl-right'
												},
												{
													xtype : 'filefield',
													labelCls : 'f13 ux_font-size14-normal required-lbl-right',
													msgTarget: 'side',
													fieldCls : 'xn-form-field inline_block ',
													//columnWidth: 0.60,
													width : '100%',
													//padding : '0 0 0 10',
													name : 'tokenFile',
													itemId : 'tokenFile',
													allowBlank : true,
													anchor : '100%',
													buttonText : '',
													buttonMargin : '0 0 0 12',
													buttonConfig : {
														iconCls : 'icon-upload-file'
													},
													listeners : {
														change : function(fld, value) {
															var newValue = value.replace(
																	/C:\\fakepath\\/g, '');
															fld.setRawValue(newValue);
														}
													}
												}
											]
										},
											         
										{
											xtype : 'container',
											columnWidth : 0.3334,
											//margin : '0 12 0 12',
											cls : 'ux_extralargemargin-left ux_extralargemargin-right',
											layout : {
												type : 'vbox'
											},
											items : [{
														xtype : 'label',
														//margin : '5 0 0 0',
														text : getLabel('lblencKey', 'Encryption Key'),
														cls : 'ux_font-size14-normal required-lbl-right'
													},
													{
														xtype : 'textfield',
														//columnWidth: 0.60,
														width : '100%',
														height : 25,
														fieldCls : 'inline_block x-trigger-noedit',
														name : 'encKey',
														itemId : 'encKey'
													}
												]
											}
								]
					},
					{
						xtype : 'container',
						//padding : '12 0 0 0',
						cls : 'ux_extralargepadding-top',
						layout : 'vbox',
						items : [
							{
							xtype : 'text',
							text : getLabel('lblTokenNote','Note :')
							},
							{
							xtype : 'text',
							padding : '4 0 0 0',
							text : getLabel('lblTokenNote1','1. File to be uploaded should consists valid token details.')
							},
							{
							xtype : 'text',
							padding : '2 0 0 0',
							text : getLabel('lblTokenNote2','2. Please do not import file with same name again as this will be rejected as duplicate.')
							},
							{
							xtype : 'text',
							padding : '2 0 0 0',
							text : getLabel('lblTokenNote4','3. Max file size allowed is 5MB.')
							}
						]
					}];
				return arrItems;
			}

		});