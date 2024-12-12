var globalRowIndex;

function saveConfigurePool( strUrl )
{
	var form = document.forms[ "frmMain" ];
	var viewState = document.getElementById( "viewState" ).value
	var url = strUrl + '?$viewState=' + encodeURIComponent( viewState ) + '&' + csrfTokenName + '=' + csrfTokenValue;
	var root = cellEditGrid.store.getRootNode().getChildAt( 0 );
	globalRowIndex = 0;
	for( var i = 0 ; i < root.childNodes.length ; i++ )
	{
		appendFormField( root.getChildAt( i ), form );
		globalRowIndex = globalRowIndex + 1;
		iterateNode( root.getChildAt( i ), form );
	}
	appendFormField( root, form );
	form.method = 'POST';
	form.action = url;
	$.blockUI();
	form.submit();
}
function iterateNode( node, form )
{
	for( var j = 0 ; j < node.childNodes.length ; j++ )
	{
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].nodeDescription', node.getChildAt( j ).get( 'nodeDescription' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN',
			'agreementNotionalDtlBean[' + globalRowIndex + '].nodeId', node.getChildAt( j ).get( 'nodeId' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN',
				'agreementNotionalDtlBean[' + globalRowIndex + '].accountId', node.getChildAt( j ).get( 'accountId' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].parentNodeId', node.getChildAt( j ).get( 'parentNodeId' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].benefitAllocationRatio', node.getChildAt( j ).get( 'allocationRatio' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].nodeType', node.getChildAt( j ).get( 'nodeType' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].creditApportmentProfileRecKey', node.getChildAt( j ).get( 'creditApportmentProfileRecKey' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].creditApportmentProfileDesc', node.getChildAt( j ).get( 'creditApportmentProfileDesc' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].debitApportmentProfileRecKey', node.getChildAt( j ).get( 'debitApportmentProfileRecKey' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].debitApportmentProfileDesc', node.getChildAt( j ).get( 'debitApportmentProfileDesc' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].creditInterestProfRecKey', node.getChildAt( j ).get( 'creditInterestProfRecKey' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].debitInterestProfRecKey', node.getChildAt( j ).get( 'debitInterestProfRecKey' ) ) );
		if(node.getChildAt( j ).get( 'nodeType' ) == 'A')
		{
			form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
					+ '].creditInterestProfDesc', node.getChildAt( j ).get( 'bankCreditInterestProfDesc' ) ) );
			form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
					+ '].debitInterestProfDesc', node.getChildAt( j ).get( 'bankDebitInterestProfDesc' ) ) );
		}
		else
		{
			form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
					+ '].creditInterestProfDesc', node.getChildAt( j ).get( 'bankCreditInterestProfDesc' ) ) );
			form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
					+ '].debitInterestProfDesc', node.getChildAt( j ).get( 'bankDebitInterestProfDesc' ) ) );
		}
		
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].nominatedCreditAccId', node.getChildAt( j ).get( 'nominatedCreditAccId' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].nominatedCreditDesc', node.getChildAt( j ).get( 'nominatedCreditAccDesc' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].nominatedDebitAccId', node.getChildAt( j ).get( 'nominatedDebitAccId' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].nominatedDebitDesc', node.getChildAt( j ).get( 'nominatedDebitAccDesc' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].contraCreditAccId', node.getChildAt( j ).get( 'contraCreditAccId' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].contraCreditDesc', node.getChildAt( j ).get( 'contraCreditAccDesc' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].contraDebitAccId', node.getChildAt( j ).get( 'contraDebitAccId' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].contraDebitDesc', node.getChildAt( j ).get( 'contraDebitAccDesc' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].inheritApportionmentFrom', node.getChildAt( j ).get( 'apportionment' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].chargeAccId', node.getChildAt( j ).get( 'chargeAccId' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].chargeAccName', node.getChildAt( j ).get( 'chargeAccount' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].nodeCurrency', node.getChildAt( j ).get( 'nodeCurrency' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].hierarchyLevel', node.getChildAt( j ).get( 'hierarchyLevel' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].nodeName', node.getChildAt( j ).get( 'nodeName' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].parentRecordKey', node.getChildAt( j ).get( 'parentRecordKey' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].creditLimit', node.getChildAt( j ).get( 'creditLimit' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].apportmentType', node.getChildAt( j ).get( 'apportionmentType' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].bankCode', node.getChildAt( j ).get( 'bank' ) ) );
		
		globalRowIndex = globalRowIndex + 1;
		iterateNode( node.getChildAt( j ), form );
	}
}
function appendFormField( root, form )
{
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].nodeDescription', root.get( 'nodeDescription' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex + '].nodeId',
		root.get( 'nodeId' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex + '].accountId',
			root.get( 'accountId' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].parentNodeId', root.get( 'parentNodeId' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].benefitAllocationRatio', root.get( 'allocationRatio' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex + '].nodeType',
		root.get( 'nodeType' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].creditApportmentProfileRecKey', root.get( 'creditApportmentProfileRecKey' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].creditApportmentProfileDesc', root.get( 'creditApportmentProfileDesc' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].debitApportmentProfileRecKey', root.get( 'debitApportmentProfileRecKey' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].debitApportmentProfileDesc', root.get( 'debitApportmentProfileDesc' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].creditInterestProfRecKey', root.get( 'creditInterestProfRecKey' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].debitInterestProfRecKey', root.get( 'debitInterestProfRecKey' ) ) );
	if(root.get( 'nodeType' ) == 'A')
	{
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].creditInterestProfDesc', root.get( 'bankCreditInterestProfDesc' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].debitInterestProfDesc', root.get( 'bankDebitInterestProfDesc' ) ) );
	}
	else
	{
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].creditInterestProfDesc', root.get( 'bankCreditInterestProfDesc' ) ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
				+ '].debitInterestProfDesc', root.get( 'bankDebitInterestProfDesc' ) ) );
	}
	
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].nominatedCreditAccId', root.get( 'nominatedCreditAccId' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].nominatedCreditDesc', root.get( 'nominatedCreditAccDesc' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].nominatedDebitAccId', root.get( 'nominatedDebitAccId' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].nominatedDebitDesc', root.get( 'nominatedDebitAccDesc' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].contraCreditAccId', root.get( 'contraCreditAccId' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].contraCreditDesc', root.get( 'contraCreditAccDesc' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].contraDebitAccId', root.get( 'contraDebitAccId' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].contraDebitDesc', root.get( 'contraDebitAccDesc' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].inheritApportionmentFrom', root.get( 'apportionment' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].chargeAccId', root.get( 'chargeAccId' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].chargeAccName', root.get( 'chargeAccount' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].nodeCurrency', root.get( 'nodeCurrency' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].hierarchyLevel', root.get( 'hierarchyLevel' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex 
			+ '].nodeName',root.get( 'nodeName' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
		+ '].parentRecordKey', root.get( 'parentRecordKey' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].creditLimit', root.get( 'creditLimit' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].apportmentType', root.get( 'apportionmentType' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'agreementNotionalDtlBean[' + globalRowIndex
			+ '].bankCode', root.get( 'bank' ) ) );
}
function createFormField( element, type, name, value )
{
	var inputField;
	inputField = document.createElement( element );
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}
