var DataRender = {};

DataRender.amountFormatter = function (_strdata, _strConfig) {
	let formattedAmount = 0;
	if(_strdata)
	{
		let amountObj = $('<input type="text">')
						.autoNumeric('init',
							{
								aSep : _strConfig.groupSeparator, 
								aDec : _strConfig.decimalSeparator, 
								mDec : _strConfig.amountMinFraction, 
								vMin : 0,
								wEmpty : 'zero'
							});
		amountObj.autoNumeric('set',_strdata);
		formattedAmount = amountObj.val();
		amountObj.remove();
    }
  return formattedAmount;
}
DataRender.dataMapper = function (_strdata, _strMapper) {
	let mappedValue = '';
	if(_strdata)
	{
		mappedValue = _strMapper[_strdata];
		if(!mappedValue) mappedValue = _strdata;
    }
  return mappedValue;
}