Ext.define('Cashweb.model.MessageModel', {
			extend : 'Ext.data.Model',
			fields : ['messageText','recipient','recipientMail','senderMail','senderName','msgStatus','subject',{ name : 'eventTime'}]
		});