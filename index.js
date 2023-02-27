exports.mqTrigger = (scopingEl, filter = [], stylesheet) =>
	globalThis.document && (!stylesheet ? [...document.styleSheets] : [stylesheet])
		.filter(sheet => !sheet.href || sheet.href.indexOf(location.protocol+'//'+location.hostname) === 0)
		.forEach(sheet => {
			[...sheet.cssRules].forEach(rule => {
				if (!rule.media || !filter.filter(filter => rule.media[0].includes(filter)).length) return;
				const mqList = window.matchMedia(rule.media[0]);
				window.dispatchEvent(createEvt(mqList, scopingEl));
				mqList.addEventListener('change', mqList =>
					window.dispatchEvent(createEvt(mqList, scopingEl))
				);
			})
		});

	function createEvt(mqList, el) {
		const styles = getComputedStyle(el);
		const vars = Object.values(styles).filter(style => /^--/.test(style)).reduce((acc, curr) => {
			acc[curr] = styles.getPropertyValue(curr);
			return acc;
		}, {});
		return new CustomEvent('mqChange', {
			detail: {
				query: mqList.media,
				matches: mqList.matches,
				vars
			}
		})
	}