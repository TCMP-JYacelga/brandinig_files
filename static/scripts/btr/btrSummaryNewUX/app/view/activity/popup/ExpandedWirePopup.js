/**
 * @class GCP.view.activity.popup.ExpandedWirePopup
 * @extends Ext.window.Window
 * @author Vinay Thube
 */
Ext.define('GCP.view.activity.popup.ExpandedWirePopup', {
	extend : 'Ext.window.Window',
	requires : ['Ext.form.field.Display', 'Ext.panel.Panel',
			'Ext.layout.container.Column', 'Ext.layout.container.VBox',
			'Ext.button.Button', 'Ext.container.Container', 'Ext.form.Panel'],
	xtype : 'expandedWirePopup',
	title : getLabel('incomingWire', 'Incoming Wire'),
	width : 735,
	closeAction : 'hide',
	autoHeight : true,
	minHeight: 156,
	maxHeight : 550,
	modal : true,
	cls: 'xn-popup',
	resizable : false,
	draggable : false,
	record : null,
	listeners : {
		'resize' : function(){
			this.center();
		}
	},
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'form',
			itemId : 'expandedWireForm',
			//height: '600px',
			items : [{
				xtype : 'component',
				cls: 'pull-right',
				hidden : fedWireExport =="" ? true : false,
				html : '<label>Export : &nbsp;</label><i class="fa fa-download cursor_pointer" title="Fedwire Export" style="font-size: 18px;"></i>',
				 listeners: {
				        click: {
				            element: 'el', //bind to the underlying el property on the panel
				            fn: function(){
				            	$(document).trigger("performReportActionExpandedWire");
				            }
				        }
				 }
			},{
				xtype : 'fieldset',
				cls : 'fieldGroup'	
			},{
				xtype : 'panel',
				itemId : 'incomingWirePanel',
				layout : 'vbox',
				items : [{
							xtype : 'displayfield',
							fieldLabel : 'Receiver Information',
							labelWidth : 150,
							labelSeparator : '',
							labelCls : 'boldText'
				},{
					xtype : 'panel',
					width : '100%',
					layout : 'column',
					cls : 'ft-padding-bottom',
					items : [
					         {
							xtype : 'container',
							columnWidth : 0.33,
							cls : 'ft-extraLargeMarginR',
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('btr.fed.amount',
										'Amount'),
										labelWidth : 65,
										itemId : 'receiverAccCcy',
										name : 'receiverAccCcy',
										labelSeparator : ' : ',
										labelCls : 'boldText',
										listeners : {
											'afterrender' : function(c){
												var fieldValue=c.getValue();
												document.getElementById(c.getId()+"-inputEl").setAttribute("data-qtip", fieldValue);
												if(c.getValue().length>22){
													var ellipsesText=fieldValue.substring(0,22)+'...'
													c.setValue(ellipsesText);
												}
											}
										}
									}]
						},
						{
							xtype : 'container',
							columnWidth : 0.33,
							cls : 'ft-extraLargeMarginR',
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('btr.fed.valueDate',
										'Value Date'),
										labelWidth : 82,
										itemId : 'valueDate',
										name : 'valueDate',
										labelSeparator : ' : ',
										labelCls : 'boldText',
										listeners : {
											'afterrender' : function(c){
												var fieldValue=c.getValue();
												document.getElementById(c.getId()+"-inputEl").setAttribute("data-qtip", fieldValue);
												if(c.getValue().length>22){
													var ellipsesText=fieldValue.substring(0,22)+'...'
													c.setValue(ellipsesText);
												}
											}
										}
									}]
						},
						{
							xtype : 'container',
							columnWidth : 0.33,
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('btr.fed.ref',
										'Fed Reference'),
										labelWidth : 108,
										itemId : 'valueDate',
										name : 'fedReference',
										labelSeparator : ' : ',
										labelCls : 'boldText',
										listeners : {
											'afterrender' : function(c){
												var fieldValue=c.getValue();
												document.getElementById(c.getId()+"-inputEl").setAttribute("data-qtip", fieldValue);
												if(c.getValue().length>22){
													var ellipsesText=fieldValue.substring(0,22)+'...'
													c.setValue(ellipsesText);
												}
											}
										}
									}]
						}]
				},{
					xtype : 'panel',
					width : '100%',
					layout : 'column',
					cls : 'ft-padding-bottom',
					items : [
					         {
							xtype : 'container',
							columnWidth : 0.33,
							cls : 'ft-extraLargeMarginR',
							items : [{
									xtype : 'displayfield',
									fieldLabel : getLabel('btr.fed.accNo',
									'Account'),
									labelWidth : 125,
									itemId : 'receiverAccNmbr',
									name : 'receiverAccNmbr',
									labelSeparator : ' : ',
									labelCls : 'boldText',
									listeners : {
										'afterrender' : function(c){
											var fieldValue=c.getValue();
											document.getElementById(c.getId()+"-inputEl").setAttribute("data-qtip", fieldValue);
											if(c.getValue().length>22){
												var ellipsesText=fieldValue.substring(0,22)+'...'
												c.setValue(ellipsesText);
											}
										}
									}
							}]
						},
						{
							xtype : 'container',
							columnWidth : 0.33,
							cls : 'ft-extraLargeMarginR',
							items : [{
									xtype : 'displayfield',
									fieldLabel : getLabel('btr.fed.custref',
									'Customer Reference'),
									itemId : 'customerRef',
									labelWidth : 148,
									name : 'customerRef',
									labelSeparator : ' : ',
									labelCls : 'boldText',
									listeners : {
										'afterrender' : function(c){
											var fieldValue=c.getValue();
											document.getElementById(c.getId()+"-inputEl").setAttribute("data-qtip", fieldValue);
											if(c.getValue().length>22){
												var ellipsesText=fieldValue.substring(0,22)+'...'
												c.setValue(ellipsesText);
											}
										}
									}
									}]
						},
						{
							xtype : 'container',
							columnWidth : 0.33,
							items : [{
									xtype : 'displayfield',
									fieldLabel : getLabel('btr.fed.accountName',
									'Account Name'),
									itemId : 'receiverAccName',
									labelWidth : 109,
									name : 'receiverAccName',
									labelSeparator : ' : ',
									labelCls : 'boldText',
									listeners : {
										'afterrender' : function(c){
											var fieldValue=c.getValue();
											document.getElementById(c.getId()+"-inputEl").setAttribute("data-qtip", fieldValue);
											if(c.getValue().length>22){
												var ellipsesText=fieldValue.substring(0,22)+'...'
												c.setValue(ellipsesText);
											}
										}
									}
								}]
						}]
				},{
					xtype : 'fieldset',
					cls : 'fieldGroup'	
				},
				{
					xtype : 'displayfield',
					fieldLabel : getLabel('btr.fed.sendingbankinfo','Sending Bank Information'),
					labelWidth : 200,
					labelSeparator : '',
					labelCls : 'boldText'
				},
				{
					xtype : 'panel',
					width : '100%',
					layout : 'column',
					cls : 'ft-padding-bottom',
					items : [
					         {
							xtype : 'container',
							columnWidth : 0.33,
							cls : 'ft-extraLargeMarginR',
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('btr.fed.bankName',
										'Name'),
										itemId : 'senderBankName',
										name : 'senderBankName',
										labelSeparator : ' : ',
										labelCls : 'boldText',
										listeners : {
											'afterrender' : function(c){
												var fieldValue=c.getValue();
												document.getElementById(c.getId()+"-inputEl").setAttribute("data-qtip", fieldValue);
												if(c.getValue().length>22){
													var ellipsesText=fieldValue.substring(0,22)+'...'
													c.setValue(ellipsesText);
												}
											}
										}
									}]
						},
						{
							xtype : 'container',
							columnWidth : 0.33,
							cls : 'ft-extraLargeMarginR',
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('btr.fed.fid', 'FID'),
										itemId : 'senderBankFiID',
										name : 'senderBankFiID',
										labelSeparator : ' : ',
										labelCls : 'boldText',
										listeners : {
											'afterrender' : function(c){
												var fieldValue=c.getValue();
												document.getElementById(c.getId()+"-inputEl").setAttribute("data-qtip", fieldValue);
												if(c.getValue().length>22){
													var ellipsesText=fieldValue.substring(0,22)+'...'
													c.setValue(ellipsesText);
												}
											}
										}
									}]
						},
						{
							xtype : 'container',
							columnWidth : 0.33,
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('btr.fed.senderName',
										'Sender Name'),
										itemId : 'senderName',
										name : 'senderName',
										labelSeparator : ' : ',
										labelCls : 'boldText',
										listeners : {
											'afterrender' : function(c){
												var fieldValue=c.getValue();
												document.getElementById(c.getId()+"-inputEl").setAttribute("data-qtip", fieldValue);
												if(c.getValue().length>22){
													var ellipsesText=fieldValue.substring(0,22)+'...'
													c.setValue(ellipsesText);
												}
											}
										}
									}]
						}]
				},
				{
					xtype : 'panel',
					width : '100%',
					layout : 'column',
					cls : 'ft-padding-bottom',
					items : [
					         {
							xtype : 'container',
							columnWidth : 0.33,
							cls : 'ft-extraLargeMarginR',
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('btr.fed.senderadd1',
										'Sender Address 1'),
										itemId : 'senderAddr',
										labelWidth : 130,
										name : 'senderAddr',
										labelSeparator : ' : ',
										labelCls : 'boldText',
										listeners : {
											'afterrender' : function(c){
												var fieldValue=c.getValue();
												document.getElementById(c.getId()+"-inputEl").setAttribute("data-qtip", fieldValue);
												if(c.getValue().length>22){
													var ellipsesText=fieldValue.substring(0,22)+'...'
													c.setValue(ellipsesText);
												}
											}
										}
									}]
						},
						{
							xtype : 'container',
							columnWidth : 0.33,
							cls : 'ft-extraLargeMarginR',
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('btr.fed.senderadd2',
										'Sender Address 2'),
										itemId : 'senderAddress2',
										labelWidth : 130,
										name : 'senderAddress2',
										labelSeparator : ' : ',
										labelCls : 'boldText',
										listeners : {
											'afterrender' : function(c){
												var fieldValue=c.getValue();
												document.getElementById(c.getId()+"-inputEl").setAttribute("data-qtip", fieldValue);
												if(c.getValue().length>22){
													var ellipsesText=fieldValue.substring(0,22)+'...'
													c.setValue(ellipsesText);
												}
											}
										}
									}]
						},
						{
							xtype : 'container',
							columnWidth : 0.33,
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('btr.fed.senderadd3',
										'Sender Address 3'),
										labelWidth : 130,
										itemId : 'senderAddress3',
										name : 'senderAddress3',
										labelSeparator : ' : ',
										labelCls : 'boldText',
										listeners : {
											'afterrender' : function(c){
												var fieldValue=c.getValue();
												document.getElementById(c.getId()+"-inputEl").setAttribute("data-qtip", fieldValue);
												if(c.getValue().length>22){
													var ellipsesText=fieldValue.substring(0,22)+'...'
													c.setValue(ellipsesText);
												}
											}
										}
									}]
						}]
				},
				{
					xtype : 'fieldset',
					cls : 'fieldGroup'	
				},
				{
					xtype : 'displayfield',
					fieldLabel : 'Other Information',
					labelWidth : 150,
					labelSeparator : '',
					labelCls : 'boldText'
				},
				{
					xtype : 'panel',
					width : '100%',
					layout : 'column',
					cls : 'ft-padding-bottom',
					items : [
					         {
							xtype : 'container',
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('btr.fed.orderinfo',
										'By Order Of Information'),
										itemId : 'orderInfo',
										labelWidth : 172,
										name : 'orderInfo',
										labelSeparator : ' : ',
										labelCls : 'boldText',
										cls : 'popup-long-textWrap'
									}]
						}
					]
				},
				{
					xtype : 'panel',
					width : '100%',
					layout : 'column',
					items : [
						{
							xtype : 'container',
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('btr.fed.additionalinfo',
										'Additional Information'),
										itemId : 'additionalInfo',
										labelWidth : 163,
										name : 'additionalInfo',
										labelSeparator : ' : ',
										labelCls : 'boldText',
										cls : 'popup-long-textWrap'
									}]
						}]
				}
					
					]
			}]
		}];

		me.bbar = ['->',{
					text : getLabel('btnClose', 'Close'),
					handler : function(btn, opts) {
						me.close();
					}
				}];
		me.on('beforeshow', function() {
					//me.showExpandedWirePopup(me.record);
				});
		me.callParent(arguments);
	},
	showExpandedWirePopup : function(record) {
		var me = this;
		var objPopUp = me.expandedWirePopup;
		Ext.Ajax.request({
			url : 'services/btrActivities/'+summaryType+'/btrIncomingWireInfo.srvc?'+csrfTokenName + '=' + csrfTokenValue,
			method : 'POST',
			async : false,
			jsonData : Ext.encode({
						id : record.get('identifier'),
						valueDate : record.get('valueDate'),
						fedReference : record.get('fedReference'),
						customerRefNo : record.get('customerRefNo'),
						txnAmount : record.get('txnAmount'),
						info19 : record.get('info19')

					}),
			success : function(response) {
				var data = Ext.decode(response.responseText);
				if (data && data.d && !Ext.isEmpty(data.d.incomingWire)
						&& data.d.incomingWire !== 'null') {
					var arrData = data.d.incomingWire;
					var objRec = null;
					if (arrData.length > 1) {
						Ext.MessageBox.show({
							title : getLabel('btrWarnPopUpTitle', 'Warn'),
							msg : getLabel('btrWarnPopUpMsg',
									'Multiple records found for this transaction..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});

					} else {
						objRec = arrData[0];
						me.setFedWireFormData(objRec);
						me.show();
					}
					me.show();
					me.center();
				} else {
					Ext.MessageBox.show({
								title : getLabel('btrWarnPopUpTitle', 'Warn'),
								msg : getLabel('btrWarnNoRecordFoundPopUpMsg',
										'No record found for this transaction..!'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.WARNING
							});
				}

			},
			failure : function(response) {
				Ext.MessageBox.show({
							title : getLabel('instrumentErrorPopUpTitle',
									'Error'),
							msg : getLabel('instrumentErrorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}

		});

	},
	setFedWireFormData : function(data) {
		var me = this;
		var form = me.down('form[itemId="expandedWireForm"]');

		if (form) {
			form.getForm().reset();
			if (data)
				form.getForm().setValues(data);
		}
	}
});
