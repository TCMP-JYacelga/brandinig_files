Ext.define('Cashweb.model.BroadcastModel', {
			extend : 'Ext.data.Model',
			fields : ['artifactId', 'urgent', 'internalName', 'feedDate', 'title', 'details', 
					  'docName', 'docPath','checkerDate', {name : 'artifactDate',	type : 'date'}
					 ]
		});