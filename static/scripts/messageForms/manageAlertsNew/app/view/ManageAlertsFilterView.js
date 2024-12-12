Ext.define('GCP.view.ManageAlertsFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'manageAlertsFilterView',
	requires : [],
	margin : '0 0 10 0',
	layout :  'hbox',
	initComponent : function() {

var filterContainerArr = new Array();

var statusStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'key', 'value'
			],
			data :
			[
				
				{
				    "key" : "all",
				    "value" : getLabel( 'lblSelect', 'Select' )
				},
				{
				    "key" : "Y",
				    "value" : "Active"
				    
				},
				{
				    "key" : "N",
				    "value" : "Inactive"
				    
				}	
							]
		} );
		
		


		var statusTypeContainer = Ext.create('Ext.container.Container', {
			columnWidth : 0.35,
		//	padding : '10px',
			items : [{
						xtype : 'label',
						text : getLabel('status', 'Status'),
						cls : 'ux_font-size14'
						//padding : '1 0 0 10'
					}, {/*
						xtype : 'toolbar',
						padding : '6 0 0 8',
						cls : 'xn-toolbar-small',
						itemId : 'statusTypeToolBar',
						filterParamName : 'status',
						width : '100%',
						parent : this,
						border : false,
						componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
						items : [{
									text : getLabel('all', 'All'),
									code : 'all',
									btnDesc : getLabel('all', 'All'),
									btnId : 'allPaymentType',
									parent : this,
									cls : 'f13 xn-custom-heighlight',
									handler : function(btn, opts) {
										this.parent.fireEvent(
												'handleStatusType', btn);
									}
								}, {
									text : getLabel('active', 'Active'),
									code : 'Y',
									btnDesc : getLabel('active', 'Active'),
									btnId : 'allActiveType',
									parent : this,
									cls : 'f13',
									handler : function(btn, opts) {
										this.parent.fireEvent(
												'handleStatusType', btn);
									}
								}, {
									text : getLabel('inactive', 'Inactive'),
									code : 'N',
									btnDesc : getLabel('inactive', 'Inactive'),
									btnId : 'allInactiveType',
									parent : this,
									cls : 'f13',
									handler : function(btn, opts) {
										this.parent.fireEvent(
												'handleStatusType', btn);
									}
								}],
						listeners : {
							render : function(toolbar, opts) {
								// this.parent.handlePaymentTypeLoading(toolbar);
							}
						}
					*/
						

						xtype : 'container',
						layout : 'vbox',
						columnWidth : 0.3333,
						itemId : 'statusTypeToolBar',
						filterParamName : 'status',
						width : '100%',
						parent : this,
						border : false,
						
						items : [{/*
									xtype : 'combo',
									itemId : 'statusTypeToolBar',
									multiSelect : false,
									labelAlign : 'top',
									width  : (screen.width) > 1024 ? 220 : 230,								
									labelSeparator : '',
									labelCls : 'frmLabel',
									fieldCls : 'ux_no-border-right xn-form-field',
									cls : 'ft-extraLargeMargin-right',
									triggerBaseCls : 'xn-form-trigger',
									editable : false,
									displayField : 'colDesc',
									valueField : 'colId',
									queryMode : 'local',
									value : 'All',
									store : statusStore,
									fieldLabel : getLabel("status", "Status")
								*/
							
								
							xtype : 'combo',
							//fieldCls : 'xn-form-field inline_block',
							triggerBaseCls : 'xn-form-trigger',
						//	matchFieldWidth : true,
							itemId : 'statusId',
							width :240,
							padding : '-4 0 0 0',
							store : statusStore,
							valueField : 'key',
							displayField : 'value',
							editable : false,
							value : getLabel('select', 'Select'),
							parent : this,
							listeners :
							{
								select : function( combo, record, index )
								{
									this.parent.fireEvent('handleStatusType', combo.getValue(), combo.getRawValue());
								}
							}	
						
						
						}]
					
					}]
		});
		filterContainerArr.push(statusTypeContainer);
		
		this.items = [{
					xtype : 'container',
					width : '100%',
					layout : 'column',
					items : filterContainerArr
				}];
		this.callParent(arguments);
	}
});