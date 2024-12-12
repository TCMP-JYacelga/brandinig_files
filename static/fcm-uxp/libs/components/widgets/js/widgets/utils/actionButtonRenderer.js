var ActionButtonRenderer = {};
var actionButtonSequence = [ 'VIEW', 'EDIT', 'ACCEPT', 'REJECT', 'ENABLE',
		'DISABLE', 'SUBMIT', 'DISCARD', 'VIEWHISTORY', 'CREATE',
		'CREATEFROMTEMPLATE', 'DOWNLOAD', 'PRINT', 'SEND', 'HOLD', 'RELEASE',
		'STOP', 'VERIFY', 'CLONE', 'CLONETOTEMPLATE', 'REVERSE' ];

ActionButtonRenderer.buttonMaskMapper = function(_strRecordMask,
		_strButtonMask, _strAction) {
	let isHidden = false;

	if (this.isEmpty(_strRecordMask) || this.isEmpty(_strButtonMask)) {
		return true;
	}
	if (_strRecordMask.length != _strButtonMask.length) {
		return true;
	}
	isHidden = this.fetchActionPostionValue(_strRecordMask, _strButtonMask,
			_strAction)

	return isHidden;
}

ActionButtonRenderer.isEmpty = function(_strValue) {
	let isEmpty = false;

	if (_strValue == null || _strValue == '' || _strValue == 'undefined') {
		isEmpty = true;
	}
	return isEmpty;
}

ActionButtonRenderer.fetchActionPostionValue = function(_strRecordMask,
		_strButtonMask, _strAction) {
	let isHidden = false;

	let position = actionButtonSequence.indexOf(_strAction);

	isHidden = this.validateMaskLength(_strRecordMask, _strButtonMask,
			_strAction);
	if (!isHidden) {
		if ((_strRecordMask.charAt(position) * 1)
				&& (_strButtonMask.charAt(position) * 1) == 1) {
			isHidden = false;
		} else {
			isHidden = true;
		}
	}
	return isHidden;
}

ActionButtonRenderer.validateMaskLength = function(_strRecordMask,
		_strButtonMask, _strAction) {
	let isHidden = false;

	let position = actionButtonSequence.indexOf(_strAction);
	if (position == -1
			|| (_strRecordMask.length <= position && _strButtonMask.length <= position)) {
		isHidden = true;
	}
	return isHidden;
}

ActionButtonRenderer.viewMoreBind = function(widgetId, seeMoreUrl) {
	let viewMoreDiv = '<div class="view-more-btn viewMore"><a class="btn btn-primary float-right" style="font-size:12px;padding: 0rem 0.5rem;" href="' + seeMoreUrl + '">';
	viewMoreDiv += getDashLabel('utils.link.viewMore');
	viewMoreDiv += '</a></div>';
	$('#widget-footer-'+widgetId).empty();
	$('#widget-footer-'+widgetId).append(viewMoreDiv);
};