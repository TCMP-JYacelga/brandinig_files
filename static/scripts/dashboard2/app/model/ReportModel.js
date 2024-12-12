Ext.define('Cashweb.model.ReportModel', {
			extend : 'Ext.data.Model',
			fields : ['artifactId','title','docName','docPath',{name:'artifactDate',type:'date'}]
		});