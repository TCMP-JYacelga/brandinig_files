var arrColsPref = null;
if (entityType === '0' || client_count > 1) {
	arrColsPref = [{
				"colId" : "ahtskClientDesc",
				"colHeader" : "Client",
				"width" : 100
			}, {
				"colId" : "ahtskSrc",
				"colHeader" : "File Name",
				"width" : 190
			}, {
				"colId" : "uploadDate",
				"colHeader" : "Upload Date Time",
				"width" : 130
			}, {
				"colId" : "tskslRemarks",
				"colHeader" : "Remarks",
				"width" : 190
			}, {
				"colId" : "ahtskTotalInst",
				"colHeader" : "Total No of Txns",
				"colType" : "number",
				"width" : 100
			}, {
				"colId" : "ahtskTotalAmnt",
				"colHeader" : "Control Amount",
				"colType" : "number",
				"width" : 100
			}, {
				"colId" : "ahtskTotalInstRejected",
				"colHeader" : "Rejected Transactions",
				"colType" : "number",
				"width" : 110
			}, {
				"colId" : "ahtskStatus",
				"colHeader" : "Status",
				"width" : 100
			}];
} else {
	arrColsPref = [{
				"colId" : "ahtskSrc",
				"colHeader" : "File Name",
				"width" : 190
			}, {
				"colId" : "uploadDate",
				"colHeader" : "Upload Date Time",
				"width" : 130
			}, {
				"colId" : "tskslRemarks",
				"colHeader" : "Remarks",
				"width" : 190
			}, {
				"colId" : "ahtskTotalInst",
				"colHeader" : "Total No of Txns",
				"colType" : "number",
				"width" : 100
			}, {
				"colId" : "ahtskTotalAmnt",
				"colHeader" : "Control Amount",
				"colType" : "number",
				"width" : 110
			}, {
				"colId" : "ahtskTotalInstRejected",
				"colHeader" : "Rejected Transactions",
				"colType" : "number",
				"width" : 110
			}, {
				"colId" : "ahtskStatus",
				"colHeader" : "Status",
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
		
var arrActionColumnStatus = [['0', 'Draft'], ['1', 'For Submit'],
		['2,3', 'New'], ['5', 'New Rejected'], ['33', 'Enabled'],
		['73', 'Modified Rejected'], ['44,34', 'Prenote Pending'],
		['45', 'Prenote Sent'], ['46', 'Prenote Verified'],
		['47', 'Prenote Failed'], ['48', 'Hold Until'], ['8', ' Deleted'],
		['49', 'Partail Prenote Pending'], ['73', 'Modified Rejected'],
		['79', 'Modified Draft'], ['80', 'Modification For Submit'],
		['81,91', 'Disable Request '], ['82', 'Disabled'],
		['83,92', 'Enable Request '], ['84', 'Expired'], ['85', 'Used'],
		['86', ' Disable Request Reject'], ['87', 'Enable Request Reject'],
		['88,89', 'Modified']];
		