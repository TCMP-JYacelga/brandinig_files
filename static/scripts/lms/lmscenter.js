var GRAPH_SCHEMA = {
	"dataSchema": {
		"nodes": [
			{name:"label", type: "string"},
			{name:"freqId", type: "string"},
			{name:"lead_account", type: "number"},
			{name:"acct_description", type:"string"},
			{name:"priority", type:"int"},
			{name:"product", type:"string"}
		]
	},
	"data": {
		"nodes": [],
		"edges": []
	}
};

var BLANK_CHART = {
	"elements":[],
	"x_axis": {
		"colour": "#FFFFFF","grid-colour": "#FFFFFF","labels": {"text": ""}
	},
	"y_axis": {
		"colour": "#FFFFFF","grid-colour": "#FFFFFF","labels": {"text": ""}
	},
	"bg_colour": "#FFFFFF"
};

var BAL_CHART = {"elements":[{"type":"bar", "colour":"#668CB2", "fill":"#336699", "fill-alpha": 0.7, "barwidth": 0.15,
					"alpha":0.8, "values": []}], "bg_colour":"#ffffff", "y_axis":{"min":0, "max":100, "steps":20,
					"offset":0,"grid-colour":"#DFDFDF", "colour":"#668CB2", "labels":{"size":8,"labels":[]}},
					"x_axis":{"steps":1, "min":0, "max":10, "offset":true, "grid-colour":"#DFDFDF", "colour":"#668CB2",
					"labels": {"labels":[], "size":7}}};



var EMPTY_JSON = {};

function showNext(blnClearVS) {
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	var txtVS = document.getElementById('lmsdashViewState');
	if (blnClearVS) txtVS.value = "";
	frm.action = 'showLMSWelcome.form';
	frm.method = "POST";
	frm.submit();
}

function showToday() {
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	frm.action = 'showFrequencyGraph.form';
	frm.method = "POST";
	frm.submit();
}

function getNodes(data, freqId, objNodes) {
	var arrNodes = new Array();
	arrNodes[0] = {"id" :"BI", "label" : "Root", "priority" : 0, "product" : "00",
				   "lead_account": 0, "freqId": "SYS", "acct_description": "ROOT"};
	for (key in data){
		var node = {};
		node.id = key;
		node.freqId = freqId;
		node.label = "(" + data[key].priority + ") - " + getInstType(data[key].product_id);
		node.priority = data[key].priority;
		node.product = data[key].product;
		node.lead_account = data[key].lead_account;
		node.acct_description = data[key].lead_account_nmbr;
		arrNodes[arrNodes.length] = node;
		objNodes[key] = "node";
	}
	return arrNodes;
}

function getEdges(data, nodes){
	var edge_data = new Array();
	for (key in data) {
		curInst = data[key];
		generateEdges(data, curInst, key, edge_data, nodes);
	}
	return edge_data;
}

function generateEdges(inst_data, currInst, idx, edges, nodes) {
	var edge;
	var skip = true;
	for (key in inst_data) {
		if (skip && idx != key)
			continue;
		else if (skip && idx == key) {
			skip = false;
			continue;
		}
		edge = {};
		prevInst = inst_data[key];

		if (isPoolIn(prevInst.product_id)){
			if (currInst.lead_account == prevInst.lead_account && isPoolOut(currInst.product_id)) {
				edge.id = idx + "to" + key;
				edge.target = key;
				edge.source = idx;
				delete nodes[idx];
			}
			else if(isInArray(currInst.lead_account, prevInst.cluster_accounts) && !isPoolOut(currInst.product_id)) {
				edge.id = idx + "to" + key;
				edge.target = key;
				edge.source = idx;
				delete nodes[idx];
			}
		}
		else if (isPoolOut(prevInst.product_id)) {
			if (isArrayInArray(prevInst.cluster_accounts, currInst.cluster_accounts) && !isPoolOut(currInst.product_id)) {
				edge.id = idx + "to" + key;
				edge.target = key;
				edge.source = idx;
				delete nodes[idx];
			}
			else if (isInArray(currInst.lead_account,prevInst.cluster_accounts) && isPoolOut(currInst.product_id)) {
				edge.id = idx + "to" + key;
				edge.target = key;
				edge.source = idx;
				delete nodes[idx];
			}
		}
		if (edge.id)
			edges[edges.length] = edge;
	}
}

function isPoolIn(productId) {
	return (productId == "01" || productId == "02");
}

function isPoolOut(productId) {
	return (productId == "03" || productId == "04");
}

function isFlexible(productId) {
	return (productId == "06");
}

function isNotional(productId) {
	return (productId == "05");
}

function getInstType(productId) {
	switch (productId) {
		case "01":
		case "02":
			return "POOLIN";
		case "03":
		case "04":
			return "POOLOUT";
		case "05":
			return "NOTIONAL";
		case "06":
			return "FLEXIBLE";
	}
}
function isInArray( id, idArray) {
	var retVal = false;
	for (j = 0; j < idArray.length; j++) {
		if (id == idArray[j]){
			retVal = true;
			break;
		}
	}
	return retVal;
}

function isArrayInArray(arr1,arr2){
	var retVal = false;

	for (j = 0; j < arr1.length; j++) {
		for (k = 0; k < arr2.length; k++) {
			if (arr1[j] == arr2[k]) {
				retval = true;
				break;
			}
		}
	}
	return retVal;
}

function prepareData(arrData) {
	var cntr, minVal, maxVal, avgVal, valTemp, balSum, minY, maxY, yStart, yEnd;

	minVal = 0;
	maxVal = 0;
	avgVal = 0;
	balSum = 0;
	for (cntr = 0; cntr < arrData.length; cntr++) {
		valTemp = arrData[cntr];
		balSum += valTemp;
		if (minVal == 0) {
			minVal = valTemp;
		}
		else if (valTemp < minVal) {
			minVal = valTemp;
		}
		if (valTemp > maxVal)
			maxVal = valTemp;
	}
	avgVal = balSum / arrData.length;
	minY = (avgVal - (avgVal/2)).toFixed(0);
	maxY = (avgVal + (avgVal/2)).toFixed(0);
	yStart = (minVal <= minY ? minVal : minY);
	yEnd = (maxVal > maxY ? maxVal : maxY);
	return {'yStart': yStart, 'yEnd': yEnd};
}

/**
 * A AJAX callback rsponsible for rendering the balance graph. It expects data
 * in following format {"isSuccess": true, "balances":{"<ACCOUNT_ID>":
 * 6476478.00, ...}}
 */
function updateGraph(data, textStatus, XMLHttpRequest) {
	$.unblockUI();

	var arrData = new Array();
	var arrLabels = new Array();
	
	if ("success" == textStatus && data.isSuccess) {
		for (key in data.balances) {
			arrLabels[arrLabels.length] = key;
			arrData[arrData.length] = 1* data.balances[key];
		}
		var minMaxInfo = prepareData(arrData);
		var retVal = owl.deepCopy(BAL_CHART);
			retVal.y_axis.min = minMaxInfo.yStart;
			retVal.y_axis.max = minMaxInfo.yEnd;
			retVal.y_axis.steps = ((minMaxInfo.yEnd - minMaxInfo.yStart) / 6);
			if (minMaxInfo.yStart < 0)
				retVal.y_axis.offset = 0; // Math.abs(minMaxInfo.yStart);
			retVal.x_axis.max = arrData.length;
			retVal.x_axis.labels.labels = arrLabels;
			retVal.elements[0].values = arrData;
		var grph = swfobject.getObjectById('swfBalances');
		grph.load(JSON.stringify(retVal));
	}
}

function loadBalances(freqId, instId) {
	$.blockUI({message: '<h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2>',
				css:{ height:'32px',padding:'8px 0 0 0'}});

	var strData = {};
	var csrfField = document.getElementById('CSRF_TOKEN');
	var frm = document.getElementById('frmMain');
	strData['viewState'] = frm.viewState.value;
	strData[csrfField.name] = csrfField.value;
	strData['selection'] = instId;
	$.ajax({
		cache: false,
		complete: function(XMLHttpRequest, textStatus) {
			$.unblockUI();
			if ("error" == textStatus)
				alert("Unable to complete your request!");
		},
		data:strData,
		dataType:'json',
		success:updateGraph,
		url:'getLMSBalances.formx',
		type:'POST'
	});
}

function flashResult(e) {
	if (!e.success)
		alert("Unable to display the flash chart!");
}

function ofc_ready() {}
function findSWF(movieName) {
    if (navigator.appName.indexOf("Microsoft")!= -1)
        return window[movieName];
    else
        return document[movieName];
}
function getChartData() {
	return JSON.stringify(BLANK_CHART);
}

function getFirstKey(jsonobject)  {
	var retVal = null;

	if (isEmpty(jsonobject)) return retVal;
	for (key in jsonobject) {
		retVal = key;
		break;
	}
	return retVal;
}

var FREQ_SCHEMA = {
		"dataSchema": {
			"nodes": [
				{name:"label", type: "string"},
				{name:"type", type: "string"},
				{name:"cutoff", type: "string"}
			]
		},
		"data": {
			"nodes": [],
			"edges": []
		}
	};

function showFrequencyDetail(freqId){
	var frm = document.getElementById('frmMain');
	frm.selection.value = freqId;
	frm.action = 'showFrquency.form';
	frm.method= 'POST';
	frm.submit();
}

function getFreqNodes(fJson) {
	var cntr = 1;
	var arrNodes = new Array();
	
	for (key in fJson){
		var node = {};
		node.id = 'N' + cntr;
		node.label = fJson[key].desc;
		node.cutoff = toTime(fJson[key].cutoff);
		node.type = fJson[key].type;
		arrNodes[arrNodes.length] = node;
		cntr++;
	}
	return arrNodes;
}

function toTime(strTime) {
    var pat = /(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])/i;
    var result = pat.exec(strTime);
    if (result != null && result.length === 4) {
        return (result[1] + ':' + result[2] + ':' + result[3]);
    }
    else
        return strTime;
}

function getFreqEdges(nodes){
	var curNode, prevNode;
	var edge_data = new Array();
	for (var i = 1; i < nodes.length; i++) {
		var edge = {};
		prevNode = nodes[i - 1];
		curNode = nodes[i];
		edge.id = curNode.id.substring(1) + 'to' + prevNode.id.substring(1);
		edge.target = curNode.id;
		edge.source = prevNode.id;
		edge_data[edge_data.length] = edge;
	}
	return edge_data;
}
function populateMT9xx(me)
{
	var csrf_name = document.getElementById( "csrfTok" ).name;
	var csrf_token = document.getElementById(csrf_name).value;
	var strData = {};
	
	strData[ 'MESSEGETYPE' ] = me.value;
	strData[ csrf_name ] = csrf_token;
	
	$.ajax( {
		cache : false,
		data : strData,
		dataType : 'html',
		error : ajaxError,
		url : 'showAccountStatementStatus.form',
		type : 'POST',
		success : function( data )
			{
				var $response = $( data );
				$( '#showAccountStatementStatus' ).html($response.find( '#showAccountStatementStatus' ) );
			}
	} );
}
function ajaxCallback( data, XMLHttpRequest )
{
	if( data.error != undefined && data.error != "" )
	{
		showError( data.error, null );
	}
}

function ajaxError()
{
	alert( "Error While Getting Account Statement Status, Please Contact Admin!" );
}
