Ext.define('Cashweb.store.RSSFeedStore', {
			extend : 'Ext.data.Store',
			requires: ['Ext.data.reader.Xml'],
			model : 'Cashweb.model.RSSFeedModel',
			autoLoad : true
		});