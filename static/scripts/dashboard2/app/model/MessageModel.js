Ext.define('Cashweb.model.MessageModel', {
			extend : 'Ext.data.Model',
			fields : ['identifier','jornalNmbr','eventId','messageText','recipient','recipientMail','senderMail','senderName','msgStatus','subject',{ name : 'eventTime'},'module']
		});