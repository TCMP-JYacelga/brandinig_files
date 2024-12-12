/**
 * @class GCP.view.activity.popup.EmailPopUpView
 * @extends Ext.window.Window
 * @author Vinay Thube
 */
Ext.define('GCP.view.activity.popup.EmailPopUpView', {
	extend : 'Ext.window.Window',
	requires : ['Ext.form.Panel', 'Ext.button.Button', 'Ext.form.Label',
			'Ext.form.field.TextArea', 'Ext.form.field.Text', 'Ext.Img'],
	xtype : 'emailPopUpView',
	title : getLabel('emailMsg', 'Email Message'),
	width : 650,
	height : 475,
	modal : true,
	layout : 'fit',
	record : null,
	parent : null,
	initComponent : function() {
		var me = this;
		var parentPanelView = Ext.create('Ext.form.Panel', {
			width : 550,
			height : 470,
			layout : {
				type : 'table',
				columns : 3
			},
			defaults : {
				bodyStyle : 'padding:18px'
			},
			items : [{
						xtype : 'label',
						text : getLabel('to', 'To'),
						cellCls : 'h3',
						cls : 'font_bold ux_font-size14',
						padding : '0 0 0 20',
						colspan : 1
					}, {
						xtype : 'label',
						text : getLabel(':', ':'),
						colspan : 1,
						width : 80
					}, {
						xtype : 'textfield',
						itemId : 'toEmailField',
						fieldCls : 'w32',
						margin : '10 0 0 40',
						allowBlank:false,
						vtype: 'email',
						colspan : 1
					}, {
						xtype : 'label',
						text : getLabel('subject', 'Subject'),
						cellCls : 'h3',
						cls : 'font_bold ux_font-size14',
						padding : '0 0 0 20',
						colspan : 1
					}, {
						xtype : 'label',
						text : getLabel(':', ':'),
						colspan : 1
					},{
						xtype : 'textfield',
						itemId : 'subjectField',
						fieldCls : 'w32',
						allowBlank:false,
						margin : '0 0 0 40',
						colspan : 1
					}, {
						xtype : 'label',
						text : getLabel('sendDate', 'Send Date'),
						cellCls : 'h2',
						cls : 'font_bold ux_font-size14',
						padding : '0 0 0 20',
						colspan : 1
					}, {
						xtype : 'label',
						text : getLabel(':', ':'),
						colspan : 1
					}, {
						xtype : 'label',
						cls : 'ux_font-size14-normal',
						itemId : 'lblSendDate',
						padding : '0 0 0 40',
						colspan : 1
					}, {
						xtype : 'label',
						text : getLabel('from', 'From'),
						cellCls : 'h3',
						cls : 'font_bold ux_font-size14',
						padding : '0 0 0 20',
						colspan : 1
					}, {
						xtype : 'label',
						text : getLabel(':', ':'),
						colspan : 1
					}, {
						xtype : 'label',
						cls : 'ux_font-size14-normal',
						itemId : 'lblFromEmail',
						padding : '0 0 0 40',
						colspan : 1
					}, {
						xtype : 'textarea',
						itemId : 'msgBody',
						colspan : 3,
						width : 570,
						padding : '0 0 0 20',
						height : 185,
						cellCls : 'h200p'
					}, {
						xtype : 'label',
						cls : 'font_bold ux_font-size14',
						text : getLabel('attachment', 'Attachment'),
						padding : '0 0 0 20',
						colspan : 1
					}, {
						xtype : 'button',
						itemId : 'btnAttachment',
						icon : 'static/images/misc/attach1.png',
						tooltip : getLabel('attachment', 'Attachment'),
						text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Transaction_Deatils.pdf',
						cls : 'ux_color',
						colspan : 2,
						handler : function() {
							me.fireEvent('viewEmailAttachment',me.record);
						}
					},{
						xtype : 'label',
						cls : 'ux_font-size13-normal',
						text : getLabel('txnReportPdf', 'A Transaction Report in PDF format will be sent as attachment'),
						padding : '0 0 0 20',
						colspan : 3
					}],
			bbar : ['->', {
						xtype : 'button',
						text : getLabel('send', 'Send'),
						formBind : true,
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						glyph : 'xf045@fontawesome',
						handler : function() {
							var arrayJson = new Array();
							var strSqlDateFormat = 'Y-m-d';
							var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
							var dateLabel = Ext.Date.format(date, strSqlDateFormat);
							var objJson = {
									emailTo : me.down('textfield[itemId="toEmailField"]').getValue(),
									emailFrom : useremail,
									emailSubject : me.down('textfield[itemId="subjectField"]').getValue(),
									identifier : me.record.get('identifier'),
									emailMsg : me.down('textfield[itemId="msgBody"]').getValue(),
									emailSendDate : dateLabel
								};
							arrayJson.push(objJson);
							var strValue = '', txnType = '', reportType = 'I', remApplicable = 'Y';
								strValue = me.getTxnAmount(me.record.get('creditUnit'), me.record.get('debitUnit'));	
								reportType = me.record.get('isHistoryFlag');		
								if (!Ext.isEmpty(strValue)) {
									if (strValue.indexOf("-") == 0) {
										txnType = 'Debit';
									} else {
										txnType = 'Credit';
									}
								} else  {
									txnType = 'Credit';
								}
							var strUrl =  'services/btrActivities/'+summaryType+'/sendActivityEmail.json?'
							strUrl += '&$reportType=' + reportType; // TODO
							strUrl += '&$txnType=' + txnType; 
							strUrl += '&$remApplicable=' + remApplicable; // TODO	
							me.close();
							var activityGrid = me.parent;
							if (activityGrid)
								activityGrid.setLoading(true);
							Ext.Ajax.request({
									url : strUrl,
									jsonData : Ext.encode(arrayJson || {}),
									success : function(response) {
										if (response) {
											var data = Ext.decode(response.responseText);
											if (!Ext.isEmpty(data) && data.success == "Y") {
			
												Ext.MessageBox.show({
													title : getLabel(
															'sendActivityEmailSuccessPopUpTitle',
															'Message'),
													msg : getLabel(
															'sendActivityEmailSuccessPopUpMsg',
															'Mail sent successfully..!'),
													buttons : Ext.MessageBox.OK,
													cls : 'ux_popup',
													icon : Ext.MessageBox.INFO
												});
												if (activityGrid)
														activityGrid.setLoading(false);
											} else {
												Ext.MessageBox.show({
													title : getLabel(
															'sendActivityEmailErrorPopUpTitle',
															'Message'),
													msg : getLabel(
															'sendActivityEmailErrorPopUpMsg',
															'Error while sending mail..!'),
													buttons : Ext.MessageBox.OK,
													cls : 'ux_popup',
													icon : Ext.MessageBox.ERROR
												});
												if (activityGrid)
													activityGrid.setLoading(false);
											}
										}
									},
									failure : function(response) {
										Ext.MessageBox.show({
											title : getLabel('sendActivityEmailErrorPopUpTitle', 'Message'),
											msg : getLabel('sendActivityEmailErrorPopUpMsg',
													'Error while sending mail..!'),
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
										if (activityGrid)
											activityGrid.setLoading(false);
									}
								});
							
						}
					},{
						xtype : 'button',
						text : getLabel('cancel', 'Cancel'),
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						handler : function() {
							me.close();
						}
					} ]
		});
		me.on('show', function() {
					me.showEmailDetails(me.record);
				});
		me.items = [parentPanelView];
		me.callParent(arguments);
	},
	showEmailDetails : function(record) {
		var me = this;
		var field = null, strValue = null;
		field = me.down('label[itemId="lblSendDate"]');
		if (!Ext.isEmpty(field))
		{
			var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
			var dateLabel = Ext.Date.format(date, strExtApplicationDateFormat);
			field.setText(dateLabel);
		}
		field = me.down('label[itemId="lblFromEmail"]');
		if (!Ext.isEmpty(field))
		{
			field.setText(useremail);
		}
	},
	getTxnAmount : function(creditUnit, debitUnit) {
		if (!Ext.isEmpty(creditUnit) && creditUnit != 0) {
			return creditUnit;
		} else if (!Ext.isEmpty(debitUnit) && debitUnit != 0) {
			return debitUnit;
		} else if ((Ext.isEmpty(debitUnit) || debitUnit === 0)
				&& (Ext.isEmpty(creditUnit) || creditUnit === 0)) {
			// console.log("Error Occured.. amount empty");
			return 0
		}
	}
});
