Ext.define( 'GCP.view.CheckManagementResViewPopup',
{
	extend : 'Ext.window.Window',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'checkManagementResViewPopup',
	width : '1000',
	//height : '500',
	autoHeight : true,
	layout : 'fit',
	resizable : false,
	draggable : false,
	cls:'xn-popup',
	parent : null,
	title : getLabel('lbltxninfo', 'Request in Process'),
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;


var strDisplayField, strValueField;
		var rangeStore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			autoLoad : true,
				data : arrStoreKeyValue
					});
		this.items =
		[{
		 	    xtype : 'hidden',
		 	    name: csrfTokenName,
		 	    value: tokenValue
		 	},{
			xtype: 'container',
			width: 'auto',
			layout: 'vbox',
			defaults: {
				labelAlign: 'top',
				labelSeparator: ''
			},
			
			items: [
			/*	{
					xtype: 'fieldset',
					title: 'Check Information',
					width: '100%',
					cls : 'ux_no-padding',
					border: false
					//collapsed: true
				},*/{
					xtype: 'container',	
					cls : 'ux_extralargepadding-bottom',
					layout: 'hbox',
					defaults: {
						labelAlign: 'top',
						flex : 1,
						labelSeparator: '',
						bodyStyle: 'font-size:17px;'
					},
					items: [{
						xtype: 'panel',
						height: 30,
						width: 1000,
						title: '',						
						html: '<span class="fa fa-info-circle" style="color: #609bb7;"> </span> If you close the window the system will continue to process. Please visit the summary screen to view the latest status.'
						}]
					},
					/*{
					xtype: 'container',	
					cls : 'ux_extralargepadding-bottom',
					layout: 'hbox',
					columnWidth : 0.33,
					defaults: {
						labelAlign: 'top',
						flex : 1,
						labelSeparator: ''
					},
					items: [{
							xtype: 'label',
							//fieldLabel: getLabel("lblcheckActSubmit", "Check Actions Submitted"),								
							labelCls : 'ux_font-size14',
							fieldCls : 'ux_smallmargin-top',
							forId: 'checkActSubmitlbl',
							padding: '2 2 2 2',
							text : "Check Actions Submitted :",	
							autoShow : true,
							readOnly: true								
					        
						},{
								xtype: 'label',	
								labelCls : 'ux_font-size14',
								fieldCls : 'ux_smallmargin-top',
								padding: '2 2 2 90',
								forId: 'checkActProcesslbl',
								text : "Check Actions Processed :",
								autoShow : true,
								readOnly: true
							}
							]
				},*/
									 
				{
					xtype : 'panel',
					width : '98%',
					itemId : 'chkMgmtRealTimeRespGrid',
					items :
					[
						{
							xtype : 'container',
							layout : 'hbox',
							items :
							[
								{
									xtype : 'label',
									text : '',
									flex : 1
								}
							]

						}
					]
				}				
				]
		}];
		this.dockedItems =
			[
				{
					xtype : 'toolbar',
					padding : '20 20 20 920',
					dock : 'bottom',
					items :
					['->',
						
							{
								xtype : 'button',
								//margin: '0 0 12 0',
								text : getLabel( 'btnClose', 'Close' ),
								itemId : 'cancelBtn',
								id : 'cancelBtn',
								tabIndex :"1",
								padding : '5 5 5 5',
								actionName : 'cancel',
								cls : 'ft-button canDisable ft-button-primary ft-margin-l',
								listeners :
								{
									click : function( btn )
									{
										me.fireEvent('closeChkMgmtResViewPopup', btn);
									},
									blur : function( btn, event, eOpts )
									{	
										Ext.getCmp('cancelBtn').focus();
									}
								}	
							}
					
					]
				}
			];
		this.callParent( arguments );
		
	},
	listeners:{
		
        close:function(panel, eOpts ){
        	this.fireEvent('closeChkMgmtResViewPopup', eOpts);
        }
	
	}
	
	
} );
