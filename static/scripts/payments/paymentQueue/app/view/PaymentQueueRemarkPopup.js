/**
 * @class GCP.view.PaymentQueueRemarkPopup
 * @extends Ext.window.Window
 * @author Anil Pahane
 */
Ext.define('GCP.view.PaymentQueueRemarkPopup', {
			extend : 'Ext.window.Window',
			requires : ['Ext.button.Button', 'Ext.form.field.TextArea'],
			autoOpen : false,
			maxHeight : 275,
			minHeight :156,
			width : 360,
			resizable: false,
			draggable: false,
			modal : true,
			cls : 'non-xn-popup',
			config : {
				strRemark : null,
				strAction : null
			},
			initComponent : function() {
				var me = this;
				var strTitle = me.strAction === 'ADD' ? getLabel('paymentQueue.field.lbl.remark',
								'Please enter remark') : getLabel(
						"titleViewRemark", "View Maker Remark");
				var strBtnText = me.strAction === 'ADD' ? getLabel("btnSave",
						"Ok") : getLabel("btnOk", "Cancel");
				me.title = getLabel('remark', 'Remark');
				me.items = [{
							xtype: 'displayfield',
							value: strTitle
						},{
							xtype : 'textarea',
							itemId : 'fieldMakerRemark',
							labelAlign : 'top',
							readOnly : me.strAction === 'VIEW',
							autoScroll : true,
							forceFit : true,
							width : '100%',
							height : 110,
							value : me.strAction === 'ADD' ? '' : me.strRemark,
							maxLength : 255,
							enforceMaxLength : true
						}];
				me.dockedItems= [{
					xtype: 'toolbar',
					dock: 'bottom',
					layout: {
						pack: 'center',
						type: 'hbox'
					},
					items: [{
						xtype : 'button',
						text : getLabel('OK', 'OK'),
						hidden : me.strAction === 'ADD' ? false : true,
						cls : 'ux_button-background-color ux_font-color-black',
						handler : function() {
							var strRemark = me
										.down('textarea[itemId="fieldMakerRemark"]')
										.getValue();
							me.fireEvent('addRemark', strRemark);
							me.close();
						}
					}, {
						xtype: 'tbspacer',
						hidden : me.strAction === 'ADD' ? false : true,
						width: 40
					},{
						xtype : 'button',
						text : getLabel('cancel', 'Cancel'),
						cls : 'ux_button-background-color ux_font-color-black',
						handler : function(btn, opts) {
							me.close();
						}
					}]
				}];

				/*this.bbar = ['->',{
					text : strBtnText,
					handler : function() {
						if (!Ext.isEmpty(me.strAction)
								&& me.strAction === 'ADD') {
							var strRemark = me
									.down('textarea[itemId="fieldMakerRemark"]')
									.getValue();
							me.fireEvent('addRemark', strRemark);
						}
						me.close();
					}
				}];*/
				
				me.callParent();
			}
		});
