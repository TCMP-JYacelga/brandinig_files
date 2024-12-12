Ext.define('Cashweb.model.NewsModel', {
			extend : 'Ext.data.Model',
			fields : ['artifactId', 'title', 'details', 'docName', 'docPath',
					'internalName', 'checkerDate', {
						name : 'artifactDate',
						type : 'date'
					}]
		});