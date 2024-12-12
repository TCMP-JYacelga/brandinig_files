function doAndOperation(arrInputMask, maskSize) {
	var accessMask = '', defaultMask = '', generatedMask = '', tempMask = '';;
	var bitA = '', bitB = '';
	defaultMask = generateDefaultMask(maskSize);

	if (null != arrInputMask && arrInputMask.length === 1) {
		return defaultMask;
	} else if (null != arrInputMask && arrInputMask.length > 1) {
		for (var index = 0; index < arrInputMask.length; index++) {
			accessMask = arrInputMask[index];
			if ((accessMask === null) || (accessMask === undefined)
					|| (accessMask.length === 0)) {
				generatedMask = defaultMask;
				break;
			}
			if (index == 0)
				generatedMask = accessMask;
			tempMask = '';
			for (var i = 0; i < maskSize; i++) {
				bitA = generatedMask.charAt(i) ? generatedMask.charAt(i) : 0;
				bitB = accessMask.charAt(i) ? accessMask.charAt(i) : 0;
				tempMask = tempMask + ((bitA * 1) && (bitB * 1));
			}
			generatedMask = tempMask;
		}
		return generatedMask;
	} else
		return defaultMask;
}

function isActionEnabled(arrInputMask, bitPosition) {
	var retValue = false;
	if (arrInputMask.charAt(bitPosition)
			&& arrInputMask.charAt(bitPosition) * 1 === 1)
		retValue = true;
	return retValue;
}

function generateDefaultMask(maskSize) {
	var defaultMask = '';
	for (var index = 0; index < maskSize; index++) {
		defaultMask = defaultMask + '0';
	}
	return defaultMask;
}