var itemFile = null;
Ext.define('GCP.view.AgentDocumentListFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'agentDocumentListFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back',
			//collapsible : true,
			cls : 'xn-ribbon ux_no-border',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {	
				
				var entityType = "";
				var documentType = "";
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
							 '$filtercode1' : 19
						}							
						},
			        listeners: {
			            load: function( store, records, successful, eOpts ) {
			                store.insert(0, {"CODE" : "","DESCR" :"Select"})
			                }
			            }
			        
					});			
			
				var entityTypeDescMap = {
						"0" : "Individual(Sole Proprietor)",
						"1" : "Company",
						"2" : "Trust",
						"3" : "Partnership"
				};			
				
				var entityTypeCodeMap = {
						"0" : "AGT_IND",
						"1" : "AGT_COMP",
						"2" : "AGT_TRUST",
						"3" : "AGT_PART"
				};
				
				var entityTypeStore = Ext.create('Ext.data.Store', {
					fields: ['CODE', 'DESCR'],
					data : [{"CODE" : "", "DESCR" : getLabel('select','Select')},
					{"CODE" : entityTypeCodeMap[agentTypeCode], "DESCR" :  entityTypeDescMap[agentTypeCode]},
					{"CODE" : "D_PERSON", "DESCR" : getLabel('lblAgentDesignatedPerson','Designated Person')}]
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
						items : [ {
						xtype : 'tbspacer'
							}]
					},{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',						
						layout : 'vbox',
						columnWidth : 0.28,
						items : [ {
							xtype : 'tbspacer'
						},{
									xtype : 'label',
									text : getLabel('lblEntityType', 'Entity Type'),
									cls : 'frmLabel required'
									//padding : '0 0 0 5'
								}, {
									xtype : 'combobox',
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',								
									//padding : '1 5 1 5',
									width : 175,
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
					columnWidth : 0.28,
					items : [{
						xtype : 'tbspacer'
					}, {
					xtype : 'label',
					text : getLabel('lblDocumentType', 'Document Type'),
					cls : 'frmLabel required'					
				}, {
					xtype : 'combobox',
					itemId : 'documentTypeFilter',
					store : documentTypeStore,
					valueField : 'CODE',												
					width : 300,
					displayField : 'DESCR',
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',				
					value : documentType,					
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
						layout : 'vbox',					
						columnWidth : 0.15,
						items : [{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							layout : 'vbox',						
							columnWidth : 0.15,
							items : [{
							xtype : 'label',
							text : getLabel('lblSelectFile', 'Upload File'),
							cls : 'ux_font-size14 ux_normalmargin-bottom',
							padding : '4 0 0 0'
						}, {
							xtype: 'filefield',
							labelCls : 'ux_font-size12',
							name: 'file',
							itemId : 'upload',
							fieldLabel: '',
							labelWidth: 300,
							msgTarget: 'side',
							allowBlank: false,
							anchor: '100%',
							buttonText: 'Browse',
							buttonOnly: true,
							disabled : pageMode == "VIEW", 
							buttonMargin : '0 0 0 12',
							buttonConfig : {
								iconCls : 'icon-upload-file',
								width : 120,
								cls : 'ux_button-background-color'
							},
							 listeners: {
							change : function(f , newValue) {												
								this.fireEvent("uploadFileAction",f, newValue);
								}							
							 }
						}]					
				}]				
				},{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',					
				columnWidth : 0.15,
				items : [{
					xtype : 'panel',
					layout : 'hbox',
					cls : 'ux_hide-image',
					padding : '23 0 1 5'
					}, {
						xtype : 'button',
						cls : 'ux_button-background-color ux_button-padding',
								itemId : 'btnFilter',
								text : getLabel('search',
										'Search'),
								//width : 60,
								height : 22	
					}]			
				}]
			
	}];
				
				this.callParent(arguments);
			},
			uploadFileAction : function(event){
				var files = event.target.files;
			    console.log(files);
			}
		});