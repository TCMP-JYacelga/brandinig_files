Ext.define( 'GCP.view.FileUploadPopUp',
{
	extend : 'Ext.window.Window',
	requires :[],
	xtype : 'fileUploadPopUp',
	height : 250,
	width : 400,
	parent : null,
	modal : true,
	closeAction : 'hide',
	
	initComponent : function()
	{
		var me = this;
		this.title = getLabel( 'uploadFile', 'Import File' );
		
		this.items = [{
			xtype : 'label',
			itemId : 'fileFormatId',
			name : 'fileFormatId',
			text : getLabel('lblfileformat', 'File Format Type'),
			labelWidth : 100
		},{
			xtype: 'filefield',
			name: 'file',
			fieldLabel: 'File Name',
			labelWidth: 100,
			msgTarget: 'side',
			allowBlank: false,
			anchor: '100%',
			buttonText: 'Browse...'
		},{
			xtype : 'label',
			text : getLabel('note',	'Note :')
		},{
			xtype : 'label',
			text : getLabel('lblnote1', '1. Import has valid payment transactions')
		},{
			xtype : 'label',
			text : getLabel('lblnote2', '2. Please do not import file with same name as this will be rejected as Duplicates')
		},{
			xtype : 'label',
			text : getLabel('lblnote3', '3. Max file size allowed is 5MB')
		}
		];
		
		this.dockedItems =[{
			xtype : 'toolbar',
			padding : '25 0 0 0',
			dock : 'bottom',
			items : ['->',{
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel('btnUpload', 'Upload'),
						itemId : 'uploadBtn',
						actionName : 'upload',
						handler : function(btn) {
							//me.fireEvent( 'fileUploadEvent', btn );
						}
					 }]
			}];
		this.callParent( arguments );
	}
} );
