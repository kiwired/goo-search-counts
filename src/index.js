// Cписок доменов для обработки
const domains = `site:sellvia.com`

// Функция для отправки запроса к Google и парсинга результатов
function getGoogleResultsCount(query) {
	let url = `https://www.googleapis.com/customsearch/v1?q=${query}`;
	url += `&key=${process.env.GOO_SEARCH_KEY}`;
	url += `&cx=${process.env.GOO_SEARCH_CX}`;
	return fetch(url)
		.then((res) => res.json())
		.then(console.log)
		.then((res) => res.searchInformation.totalResults)
		.catch((err) => {
			reject(new Error(err.message))
		})
}

// Функция для обработки списка доменов
function processDomains(domains) {
	if (!domains.length) {
		return
	}

	const qeury = domains.shift()

	if (!qeury.trim()) {
		processDomains(domains)
		return
	}

	getGoogleResultsCount(qeury)
		.then((count) => {
			// console.log(`Для ${qeury} найдено ${count} результатов в Google.`)
			processDomains(domains)
		})
		.catch((error) => {
			console.log(`Ошибка при сканировании ${qeury}: ${error.message}`)
			processDomains(domains)
		})
}

const parseDomains = domains
	.replace(" ", ",")
	.split(",")
	.map((v) => v.trim())
	.filter((v) => v)
	.map((v) => `%22${v}%22`)

console.log("Старт:", parseDomains)
// Запускаем обработку
processDomains(parseDomains)