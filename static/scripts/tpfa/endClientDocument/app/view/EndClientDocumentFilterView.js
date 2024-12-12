var itemFile = null;
Ext.define('GCP.view.EndClientDocumentFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'endClientDocumentFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back',
			collapsible : true,
			cls : 'xn-ribbon ux_border-bottom',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {	
				
				var entityType = "";
				var documentType = "";
				var contentType = "";
				var itemFile = null;
				var me = this;
				
				var documentTypeStore = Ext.create('Ext.data.Store', {
					autoLoad: true,
					fields : ["CODE", "DESCR"],
						proxy : {
						type : 'ajax',
						url : 'services/userseek/getTaxonomyDocumentType.json',
						actionMethods : {
							read : 'POST'
							},
					reader : {
						type : 'json',
							root : 'd.preferences'
						},
					extraParams : {
								 '$filtercode1' : 1
							}
						},
			        listeners: {
			            load: function( store, records, successful, eOpts ) {
			                store.insert(0, {"CODE" : "","DESCR" :"Select"})
			                }
			            }
			        
					});
				
						
				var entityTypeDescMap = {
						"INDIVIDUAL" : "Individual",
						"COMPANY" : "Company",
						"TRUST" : "Trust",
						"PARTNERSHP" : "Partnership"
				};			
				
				var entityTypeCodeMap = {
						"INDIVIDUAL" : "CLT_IND",
						"PARTNERSHP" : "CLT_PART",
						"COMPANY" : "CLT_COMP",
						"TRUST" : "CLT_TRUST"
				};	

						var entityTypeStore = Ext.create('Ext.data.Store', {
					fields: ['CODE', 'DESCR'],
					data : [{"CODE" : "", "DESCR" : getLabel('lblSelect','Select')},
					{"CODE" : entityTypeCodeMap[endClientCategory], "DESCR" :  entityTypeDescMap[endClientCategory]},
					{"CODE" : "R_PERSON", "DESCR" : getLabel('lblRelatedPerson','Related Person')}]
				});
						
				var contentTypeStore = Ext.create('Ext.data.Store', {
					autoLoad: true,
					fields : ["CODE", "DESCR"],
						proxy : {
						type : 'ajax',
						url : 'services/userseek/getContentType.json',
						extraParams: {							
							'$filtercode1':  1
						},
					reader : {
							type : 'json',
							root : 'd.preferences'
						}
						},
						listeners: {
				            load: function( store, records, successful, eOpts ) {
				                store.insert(0, {"CODE" : "","DESCR" :"Select"})
				                }
				            }	
				});
				
				this.items = [{
					xtype : 'panel',
					layout : 'column',
					width : '100%',
					cls : 'ux_largepadding',
					items : [{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						columnWidth : 0.25,

						items : [{
									xtype : 'label',
									text : getLabel('lblEntityType', 'Entity Type'),
									cls : 'frmLabel required'
								}, {
									xtype : 'combobox',
									fieldCls : 'x-form-field x-form-empty-field x-form-text  x-trigger-noedit form-control',
									triggerBaseCls : 'xn-form-trigger',
									padding : '1 5 1 5',
									itemId : 'entityTypeFilter',
									filterParamName : 'entityType',
									store : entityTypeStore,
									valueField : 'CODE',
									displayField : 'DESCR',
									editable : false,
									value : entityType,
									listeners :
									{
										select : function( combo, record, index )
										{
											setDirtyBit();
											var meElement = me;
											this.fireEvent('filterEntityType', combo, record, index);
										},
										change : function( combo, newValue, oldValue )
										{

										}
									}		

								}]

				},//End of Entity Type
				{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					columnWidth : 0.25,

					items : [{
								xtype : 'label',
								text : getLabel('lblContentType', 'Content Type'),
								cls : 'frmLabel required'
							}, {
								xtype : 'combobox',
								fieldCls : 'x-form-field x-form-empty-field x-form-text  x-trigger-noedit form-control',
								triggerBaseCls : 'xn-form-trigger',
								padding : '1 5 1 5',
								itemId : 'contentTypeFilter',
								filterParamName : 'contentType',
								store : contentTypeStore,
								valueField : 'CODE',
								displayField : 'DESCR',
								value : "Select",
								editable : false,
								listeners :
								{
										select : function( combo, record, index )
										{
											setDirtyBit();
											this.fireEvent('filterContentType', combo, record, index);
										},
										change : function( combo, newValue, oldValue )
										{
											if(newValue == "")
											this.fireEvent('filterDocumentType' );
										}
									
								}	

							}]

			},//End of Content Type
				{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					columnWidth : 0.25,

					items : [ {
					xtype : 'label',
					text : getLabel('lblDocumentType', 'Document Type'),
					cls : 'frmLabel required'
				}, {
					xtype : 'combobox',
					itemId : 'documentTypeFilter',
					store : documentTypeStore,
					valueField : 'CODE',												
					displayField : 'DESCR',
					fieldCls : pageMode == 'VIEW' ? '' : 'x-form-field x-form-empty-field x-form-text  x-trigger-noedit form-control',
					triggerBaseCls : 'xn-form-trigger',
					value : "Select",					
					editable : false,
					listeners :
					{
						select : function( combo, record, index )
						{
							setDirtyBit();
							this.fireEvent('filterDocumentType', combo, record, index);
						},
						change : function( combo, newValue, oldValue )
						{
						}
					}
				}]
				}, //End of Document Type
				{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'hbox',					
					items : [ {
					xtype : 'tbspacer'
						}]
				},
				 {
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						columnWidth : 0.12,
						items : [
								{
									xtype : 'panel',
									layout : 'hbox',
									cls : 'ux_hide-image',
									padding : '23 0 1 5'
								},
																		
								{
									xtype : 'button',
									cls : 'ft-filter-search',
											itemId : 'btnFilter',
											text : getLabel('search',
													'Search')
											//width : 60
								}]
					},
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						columnWidth : 0.12,
						items : [{
						xtype : 'label',
						cls : 'f13 ux_font-size14 ux_normalmargin-bottom',
						padding : '17 0 0 5'
					}, {
						xtype: 'filefield',
						labelCls : 'f13 ux_font-size14 ',
						name: 'file',
						itemId : 'upload',
						fieldLabel: '',
						msgTarget: 'side',
						allowBlank: false,
						anchor: '100%',
						buttonText: 'Click to Upload',
						buttonOnly: true,
						buttonMargin : '0 0 0 12',
						buttonConfig : {
							iconCls : 'icon-upload-file',
							cls: 'ft-filter-search'
						},
						 listeners: {
						change : function(f , newValue) {												
							this.fireEvent("uploadFileAction",f, newValue);
							}							
						 }
					}]		
					
				}
					]}
					];
				
				this.callParent(arguments);
			},
			uploadFileAction : function(event){
				var files = event.target.files;
			    console.log(files);
			}
		});