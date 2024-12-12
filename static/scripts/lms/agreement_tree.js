var vis;
var GRAPH_SCHEMA = {
	"dataSchema": {
		"nodes": [
			{name:"label", type: "string"},
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

var EMPTY_JSON = {};

function getNodes(data, objNodes) {
	var arrNodes = new Array();
	arrNodes[0] = {"id" :"BI", "label" : "Root", "priority" : "0", "product" : "00",
				   "lead_account": "0", "acct_description": "ROOT"};

	for (key in data){
		var node = {};
		node.id = key;
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

/**
 * Function fetchTreeData is called from the grid ui and is responsible for making an AJAX call to the server (getAgreementInst.formx)
 * and fetching the instrcutions for an agreement. It only posts the row number.  The server side code is responsible for decoding
 * the viewstate and retrive the actual agreement id from the viestate array. The server side code is expected to return a JSON data
 * structure as a response for this call. The structure details are documented in showTreeDialog.
 */
function fetchTreeData(agrSerial) {
	$.blockUI({message: '<h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2>',
				css:{ height:'32px',padding:'8px 0 0 0'}});

	var strData = {};
	var csrfField = document.getElementById('CSRF_TOKEN');
	var frm = document.getElementById('frmMain');
	strData['viewState'] = frm.viewState.value;
	strData[csrfField.name] = csrfField.value;
	strData['txtRecordIndex'] = agrSerial;
	$.ajax({
		cache: false,
		complete: function(XMLHttpRequest, textStatus) {
			$.unblockUI();
			if ("error" == textStatus)
				alert("Unable to complete your request!");
		},
		data:strData,
		dataType:'json',
		success:showTreeDialog,
		url:'getAgreementInst.formx',
		type:'POST'
	});
}

function flashResult(e) {
	if (!e.success)
		alert("Unable to display the flash chart!");
}

/**
 * AJAX callback handler for rendering the tree. It expects data in following format
 * {
 *      "I12" :
 *      {
 *	        "instruction_name" : "INST1",
 *	        "priority" : "3",
 *	        "product_id" : "02",
 *	        "product" : "Real Pool In - IBFT",
 *	        "lead_account" : "1234",
 *	        "lead_account_nmbr" : "23456712",
 *	        "cluster_accounts" : ["3454","6576","7645"]
 *		},
 *      ...
 * }
 *
 * This function also expects that the following code be present in the original HTML of the calling page for showing the dialog box.
 * <div id="div_agrTree" title="Additional Information" class="ui-helper-hidden">
 *     <div id="graphContainer" class="ui-corner-all">
 *         The agreement hierarchy will be shown here.
 *     </div>
 * </div>
 */
function showTreeDialog(data, txtStatus, XMLHttpRequest) {
	$.unblockUI();

	if ("success" == txtStatus && !isEmpty(data) && data.isSuccess) {
		// id of Cytoscape Web container div
		var dlg = $('#div_agrTree');

		renderTree(dlg, data.treedata);
		dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:480,
						beforeClose: function(event, ui) {},
						buttons: {"Ok": function() {$(this).dialog("destroy"); },
						Cancel: function() {$(this).dialog('destroy');}}});
		dlg.dialog('open');
	}
}

/**
 * Function renderTree is responsible for rendering the graph using supplied data in the supplied dialog box.
 */
function renderTree(dlg, data) {
	var div_id = "graphContainer";
	var nodes = {};
	var nodeData = getNodes(data, nodes);
	var edgeData = getEdges(data, nodes);

	var nodTmp;

	for (key in nodes) {
		nodTmp = {};
		nodTmp.id = key + "toBI" ;
		nodTmp.target = "BI";
		nodTmp.source = key;
		edgeData[edgeData.length] = nodTmp;
	}

	// initialization options
	var options = {
		// where you have the Cytoscape Web SWF
		swfPath: "static/flash/CytoscapeWeb",
		// where you have the Flash installer SWF
		flashInstallerPath: "static/flash/playerProductInstall"
	};
	// init and draw
	vis = new org.cytoscapeweb.Visualization(div_id, options);
	vis.ready(function() {
		vis.visualStyleBypass({
			nodes: {
				"BI": {"color": "#336699", "labelFontColor": "#F0F0F0", "shape":"ECLIPSE"}
			},
			edges:{}
		});
	});
	GRAPH_SCHEMA.data.nodes = nodeData;
	GRAPH_SCHEMA.data.edges = edgeData;

	vis.draw({
		"network": GRAPH_SCHEMA,
		"layout":"Tree",
		"visualStyle":{
			"nodes":{
				"tooltipText": "<b>Product</b>: ${product}<br/><b>Lead Account</b>: ${acct_description}",
				"shape":"ROUNDRECT","size":80,"labelFontSize ": {defaultValue:8}, "labelFontName":"Tahoma", "borderWidth":2,
				"color": "#F0F0F0", "labelFontColor": "#336699","labelHorizontalAnchor":"center"
			},
			"edges": {
				"targetArrowShape": "ARROW", "color": "#616161"
			}
		},
		"nodeTooltipsEnabled": true
	});
}

function isEmpty(obj) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}