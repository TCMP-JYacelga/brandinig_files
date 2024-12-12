Ext.define('GCP.view.AddZeroProofPopup', {
			extend : 'Ext.window.Window',
			xtype : 'AddZeroProofPopup',
			width : 400,
			autoScroll : true,
			title : '',
			config : {
				searchFlag : false,
				layout : 'fit'
			},
			initComponent : function() {
				var me = this;
				
				me.items = [
				{
					xtype : 'panel',
					itemId : 'leftPanel',
					//layout : 'vbox',
					padding : '5 5 5 5',
					// width : 200,
					// height : 100
					items : [
						{
								xtype : 'combo',
								fieldLabel : getLabel('primebandid',
										'Prime Band Id'),
								labelCls : 'frmLabel',
								cls: 'ux_trigger-height',
								editable : false,
								itemId : 'primeBandId',
								//store : reqStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								margin : '5 5 5 20',
								labelStyle: 'padding-right : 5px !important'
								
						},
						{
								xtype : 'combo',
								fieldLabel : getLabel('primefield',
										'Prime Field'),
								labelCls : 'frmLabel',
								cls: 'ux_trigger-height',
								editable : false,
								itemId : 'primeField',
								//store : reqStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								margin : '5 5 5 20',
								labelStyle: 'padding-right : 5px !important'
						},
						{
								xtype : 'combo',
								fieldLabel : getLabel('type',
										'Type'),
								labelCls : 'frmLabel',
								cls: 'ux_trigger-height',
								editable : false,
								itemId : 'type',
								//store : reqStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								margin : '5 5 5 20',
								labelStyle: 'padding-right : 5px !important'
						},
						{
								xtype : 'combo',
								fieldLabel : getLabel('sourcebandid',
										'Source Band Id'),
								labelCls : 'frmLabel',
								cls: 'ux_trigger-height',
								editable : false,
								itemId : 'sourceBandId',
								//store : reqStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								margin : '5 5 5 20',
								labelStyle: 'padding-right : 5px !important'
						},
						{
								xtype : 'combo',
								fieldLabel : getLabel('sourcefield',
										'Source Field'),
								labelCls : 'frmLabel',
								cls: 'ux_trigger-height',
								editable : false,
								itemId : 'sourceField',
								//store : reqStore,
								displayField : 'name',
								valueField : 'value',
								labelSeparator : '',
								margin : '5 5 5 20',
								labelStyle: 'padding-right : 5px !important'
						}
					]
				}];
				
				me.buttons = [ {
					xtype : 'button',
					text : getLabel('add', 'Add'),
					cls : 'xn-button ux_button-background-color ux_cancel-button',
					glyph : 'xf0c7@fontawesome',
					itemId : 'saveButton',
					handler : function() {
						me.fireEvent("addZeroProof", me);
						me.close();
					}
				},
				{
					xtype : 'button',
					text : getLabel('cancel', 'Cancel'),
					cls : 'xn-button ux_button-background-color ux_cancel-button',
					//glyph : 'xf0c7@fontawesome',
					itemId : 'cancelButton',
					handler : function() {
						me.close();
					}
				}];
				
				me.callParent(arguments);
			
			}
});