/**
 * @class GCP.view.activity.popup.RemarkPopup
 * @extends Ext.window.Window
 * @author Anil Pahane
 */
Ext.define('GCP.view.activity.popup.RemarkPopup', {
			extend : 'Ext.window.Window',
			requires : ['Ext.button.Button', 'Ext.form.field.TextArea','Ext.form.field.File'],
			width : 320,
			xtype : 'remarkPopup',
			itemId : 'remarkPopup',
			height : 275,
			modal : true,
			record : null,
			config : {
				strRemark : null,
				strAction : null,
				resetclicked : false
			},
			initComponent : function() {
				var me = this;
				var strTitle = getLabel('addupdatenotes', 'Notes');
				var strBtnText = me.strAction === 'ADD' ? getLabel("btnSave",
						"Save") : '&nbsp;'+getLabel("btnUpdate", "Update");
				me.title = strTitle;
				me.items = [{
							xtype : 'textarea',
							itemId : 'fieldRemark',
							fieldLabel : getLabel('notes', 'Notes'),
							labelAlign : 'top',
							autoScroll : true,
							forceFit : true,
							width : 295,
							height : 105,
							value : me.strRemark,
							maxLength : 255,
							enforceMaxLength : true
						}];
						
				if (!Ext.isEmpty(me.record.get('noteFilename')))
				{
					var filename = me.record.get('noteFilename');
					if(!Ext.isEmpty(filename) &&  filename.length > 20)
						filename = filename.substring(0,20) + "....";
					
					var showText = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + filename ||getLabel('viewFile','View File');
					
				me.items.push({
					xtype : 'button',
					itemId : 'btnViewNoteFile',
					tooltip : me.record.get('noteFilename'),
					text : showText,
					cls : 'ux_color',
					textAlign : 'left',
					glyph : 'xf00e@fontawesome',
					width : 200,
					margin : '20 0 0 0',
					handler : function() {
								me.fireEvent('viewNoteFile',me.record);
								
					}
				}, {
					xtype : 'button',
					itemId : 'btnResetNoteFile',
					tooltip : getLabel('resetFile', 'Reset File'),
					text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + getLabel('resetFile', 'Reset File'),
					cls : 'ux_color',
					glyph : 'xf0e2@fontawesome',
					margin : '20 0 0 0',
					handler : function() {
								me.remove('btnViewNoteFile');
								me.remove('btnResetNoteFile');
								me.resetclicked = true;
								me.add({
							xtype: 'filefield',
							name : 'noteFile',
							fieldLabel: getLabel('attachfile','Attach File'),
							labelAlign : 'top',
							msgTarget: 'side',
							width : 295,
							allowBlank: true,
							anchor: '100%',
							buttonText: '',
							buttonConfig: {
								iconCls: 'icon-upload-file'
							}
						});
					}
				});
				}
				else
				{
				me.items.push({
							xtype: 'filefield',
							name : 'noteFile',
							fieldLabel: getLabel('attachfile','Attach File'),
							labelAlign : 'top',
							msgTarget: 'side',
							width : 295,
							allowBlank: true,
							anchor: '100%',
							buttonText: '',
							buttonConfig: {
								iconCls: 'icon-upload-file'
							},
							listeners: {
		                        change: function(fld, value) {
		                            var newValue = value.replace(/C:\\fakepath\\/g, '');
		                            fld.setRawValue(newValue);
		                        }
		                    }
						});
				}

				me.buttons = [{
							text : '&nbsp;&nbsp;&nbsp;&nbsp;' + strBtnText,
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf0c7@fontawesome',
							handler : function() {
								var addedfile = "";
								var strRemark = me
										.down('textarea[itemId="fieldRemark"]')
										.getValue();
								var data = new FormData();
								if (me.resetclicked)
								{
									data.append("OldNoteFilename",me.record.get('noteFilename'));
								}
								if (null!=document.getElementsByName('noteFile')[0] && null!=document.getElementsByName('noteFile')[0].files[0])
								{
								data.append("noteFile",
									document.getElementsByName('noteFile')[0].files[0]);
								data.append("OldNoteFilename",me.record.get('noteFilename'));	
								addedfile = document.getElementsByName('noteFile')[0].files[0].name;
								}
								
								data.append("noteFilename",me.record.get('noteFilename'));
								data.append("noteText",strRemark);
								me.fireEvent('addNotes', data,strRemark,addedfile);
								me.close();
							}
						},{
							text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + getLabel("btnCancel", "Cancel"),
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf056@fontawesome',
							handler : function() {
								me.close();
							}
						}];
				
				me.callParent();
			},
			
			checkNoteFile : function(record) {
				
			}
		});
