exports.mqTrigger = (scopingEl = globalThis.document, filter = [], stylesheet) =>
	globalThis.document && (!stylesheet ? [...document.styleSheets] : [stylesheet])
		.filter(sheet => !sheet.href || sheet.href.indexOf(location.protocol+'//'+location.hostname) === 0)
		.forEach(sheet => {
			[...sheet.cssRules].forEach(rule => {
				if (!rule.media || !filter.filter(filter => rule.media[0].includes(filter)).length) return;
				const mqList = window.matchMedia(rule.media[0]);
				scopingEl.dispatchEvent(createEvt(mqList, scopingEl));
				mqList.addEventListener('change', mqList =>
					scopingEl.dispatchEvent(createEvt(mqList, scopingEl))
				);
			})
		});

function createEvt(mqList, el) {
	return new CustomEvent('mqChange', {
		detail: {
			query: mqList.media,
			matches: mqList.matches,
			styles: getComputedStyle(el)
		}
	});
}