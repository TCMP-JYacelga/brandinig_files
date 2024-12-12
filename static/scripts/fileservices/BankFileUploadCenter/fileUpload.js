var arrColsPref = null;
if (entityType === '0' || client_count > 1) {
	arrColsPref = [{
				"colId" : "ahtskClientDesc",
				"colHeader" : getLabel('client','Company Name'),
				"width" : 100
			}, {
				"colId" : "ahtskSrc",
				"colHeader" : getLabel( 'fileName' , 'File Name'),
				"width" : 190
			}, {
				"colId" : "uploadDate",
				"colHeader" : getLabel( 'lblImportDtTime' , 'Import Date Time'),
				"width" : 130
			}, {
				"colId" : "tskslRemarks",
				"colHeader" : getLabel( 'lblRemarks' , 'Remarks' ),
				"width" : 190
			}, {
				"colId" : "ahtskTotalInst",
				"colHeader" : getLabel( 'lblTotalNoTxn' , 'Total Number of Transactions' ),
				"colType" : "number",
				"width" : 100
			}, {
				"colId" : "ahtskTotalAmnt",
				"colHeader" : getLabel( 'lblControlAmnt' , 'Control Amount' ),
				"colType" : "number",
				"width" : 100
			}, {
				"colId" : "ahtskTotalInstRejected",
				"colHeader" : getLabel( 'lblRejectedTxn' , 'Rejected Transactions' ),
				"colType" : "number",
				"width" : 110
			},{
				"colId" : "ahtskMaker",
				"colHeader" : getLabel( 'uploadedBy' , 'Uploaded By'),
				"width" : 100
			},{
				"colId" : "ahtskStatus",
				"colHeader" : getLabel( 'status' , 'Status'),
				"width" : 100
			}];
} else {
	arrColsPref = [{
				"colId" : "ahtskSrc",
				"colHeader" : getLabel( 'fileName' , 'File Name'),
				"width" : 190
			}, {
				"colId" : "uploadDate",
				"colHeader" : getLabel( 'lblImportDtTime' , 'Import Date Time'),
				"width" : 130
			}, {
				"colId" : "tskslRemarks",
				"colHeader" : getLabel( 'lblRemarks' , 'Remarks' ),
				"width" : 190
			}, {
				"colId" : "ahtskTotalInst",
				"colHeader" : getLabel( 'lblTotalNoTxn' , 'Total Number of Transactions' ),
				"colType" : "number",
				"width" : 100
			}, {
				"colId" : "ahtskTotalAmnt",
				"colHeader" : getLabel( 'lblControlAmnt' , 'Control Amount' ),
				"colType" : "number",
				"width" : 110
			}, {
				"colId" : "ahtskTotalInstRejected",
				"colHeader" : getLabel( 'lblRejectedTxn' , 'Rejected Transactions' ),
				"colType" : "number",
				"width" : 110
			},{
				"colId" : "ahtskMaker",
				"colHeader" : getLabel( 'uploadedBy' , 'Uploaded By'),
				"width" : 100
			}, {
				"colId" : "ahtskStatus",
				"colHeader" : getLabel( 'status' , 'Status'),
				"width" : 100
			}];
}

var FILE_GENERIC_COLUMN_MODEL = arrColsPref;

var advFilterJsonArray = new Array();
advFilterJsonArray.push({
			"key" : "All",
			"value" : "All"
		});
advFilterJsonArray.push({
			"key" : "C",
			"value" : "Completed"
		});
advFilterJsonArray.push({
			"key" : "P",
			"value" : "Partial Successful"
		});
advFilterJsonArray.push({
			"key" : "E",
			"value" : "Aborted"
		});
advFilterJsonArray.push({
			"key" : "N",
			"value" : "New"
		});
advFilterJsonArray.push({
			"key" : "Q",
			"value" : "In Queue"
		});
advFilterJsonArray.push({
			"key" : "T",
			"value" : "Rejected"
		});