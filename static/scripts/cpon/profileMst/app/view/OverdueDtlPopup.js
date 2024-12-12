Ext.define('GCP.view.OverdueDtlPopup',
				{
					extend : 'Ext.window.Window',
					xtype : 'overdueDtlPopup',
					width : (screen.width) > 1024 ? 733 : 709,
					minHeight : 156,
					maxHeight : 550,
					layout: 'vbox',
					autoHeight : true,
					cls: 'non-xn-popup',
					modal : true,
					//componentCls: 'ux_no-padding',
					requires:['Ext.form.field.Number','Ext.form.field.ComboBox','Ext.form.field.Text','Ext.button.Button','Ext.container.Container'],
					draggable : false,
					resizable : false,
					config : {
						srNo : null,
						description : null,
						toDay : null,
						productCode : null,
						sellerCode : null,
						fromDay : null,
						nextToDay : null, 
						mode:null
					},
					autoScroll : true,
			setOverdueActions : function(){
				var me = this;
				var data;
				Ext.Ajax.request({
				  url: 'cpon/overdueProfileMst/getActionsList.json?$sellerCode='+me.sellerCode+'&$productCode='+me.productCode,
				  async: false,
				  method: 'POST',
				  success: function (response, opts) {  
						data = Ext.decode(response.responseText) 
					},  
				  failure: function (response, opts) {  
//						console.log("failure");  
					}  
				}); 
				var featureItems = [];
				var featuredata = data.d.filter;
				Ext.each(featuredata, function(feature, index) {
					var obj = new Object();
					var loanType = feature.name;
					obj.xtype = "combo";
					obj.itemId=feature.name;
					obj.fieldCls = 'xn-form-field',
					obj.triggerBaseCls = 'xn-form-trigger',
					obj.labelCls = 'frmLabel',
					obj.emptyText = getLabel('select','Select'),
					obj.fieldLabel = feature.value;
					obj.labelAlign = 'top';	
					obj.editable = false;
					obj.labelSeparator = "";
					var loanStore = Ext	.create(
						'Ext.data.Store',
						{
							fields : [ 'name', 'value' ],
							proxy : {
								type : 'ajax',
								url : 'cpon/cponseek/loanTypes.json?$top=-1&qfilter='+loanType+'&bucketNo='+me.srNo,
								actionMethods : {
									create : "POST",
									read : "POST",
									update : "POST",
									destroy : "POST"
								},
								reader : {
									type : 'json',
									root : 'd.filter'
								}
							},
							autoLoad : true
						});
					obj.store = loanStore;	
					obj.cls = 'ft-extraLargeMarginR ux_margin-top-12';
					//obj.margin = 8;	
					obj.columnWidth= 0.40;
					obj.displayField = 'value',
					obj.valueField = 'name',
					obj.loanType = loanType;
					featureItems.push(obj);
				});
				
				/*
				var obj = new Object();
					//var loanType = feature.name;
					obj.xtype = "combo";
					//obj.itemId=feature.name;
					obj.fieldCls = 'xn-form-field',
					obj.triggerBaseCls = 'xn-form-trigger',
					obj.emptyText = getLabel('select','Select'),
					obj.fieldLabel = "fffff";
					obj.labelAlign = 'top';	
					obj.labelSeparator = "";
					obj.margin = 8;	
					obj.columnWidth= 0.30;
					
				featureItems.push(obj);*/
				
				return featureItems;
			},		
					initComponent : function() {
						var me = this;
						me.items = [{
							xtype: 'container',
							layout: 'column',
							cls: 'ft-padding-bottom ux_panel-transparent-background',
							items: [
								{
									xtype : 'textfield',
									itemId : 'txtBucketNo',
									fieldLabel : getLabel('overdueBucketNo',
											'Overdue Bucket #'),
									labelAlign : 'top',
									labelSeparator : "",
									labelCls: 'frmLabel',
									cls : 'ft-extraLargeMarginR',
									//fieldCls: 'w10',
									//padding : '0 20 20 0',
									width  : 220,
									value : me.srNo,
									readOnly : true
								}, 
								{
									xtype : 'textfield',
									itemId : 'txtDescription',
									fieldLabel : getLabel('prfMstDescription',
											'Description'),
									labelAlign : 'top',
									//fieldCls: 'w10',
									cls : 'ft-extraLargeMarginR',
									labelCls: 'frmLabel',
									labelSeparator : "",
									width  : 220,
									//padding : '0 20 20 0',
									value : me.description
								},
								{
									xtype: 'numberfield',
									itemId : 'txtToDay',
									//labelCls : 'required',
									width  : 220,
									fieldCls : 'xn-field-amount popup-searchBox',
									allowDecimals : false,
									labelCls: 'frmLabel',
									fieldLabel : getLabel('toDays','To Days'),
									hideTrigger: true,
									keyNavEnabled: false,
									mouseWheelEnabled: false,
									minValue: 1,
									allowBlank:false,
									labelAlign : 'top',		
									labelSeparator : "",
									//padding : '0 20 20 0',
									value : me.toDay
								}]
							},{
								xtype: 'panel',
								title: getLabel('overdueActions','Overdue Actions'),
								itemId : 'actionsPanel',
								collapsible : true,
								layout:'column',
								cls : 'xn-ribbon',
								bodyCls: 'ux_border-top',
								width: '100%',
								collapseFirst : true,
								items:  me.setOverdueActions()
								
							}];
							me.bbar = [
									{
										xtype : 'button',
										text : getLabel('cancel', 'Cancel'),
										//glyph : 'xf056@fontawesome',
										itemId : 'btnCancelOverdueBuckets',
										//cls : 'ux_button-padding ux_button-background-color',
										handler : function() {
											me.close();
										}
									},'->',{
										xtype : 'button',
										text : getLabel('save', 'Save'),
										itemId : 'btnSaveOverdueBuckets',
										disabled:true,
										//glyph : 'xf0c7@fontawesome',
										//cls : 'ux_button-padding ux_button-background-color',
										handler : function() {
											me.close();
										}
									}
									];

						
						me.callParent(arguments);
				}

			});