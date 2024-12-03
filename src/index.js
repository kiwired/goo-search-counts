const fs = require('fs'); 

async function main() {

	console.log('Старт')

	const rows = await readData();
	console.log('Найдено слов:', rows.length)

	// Запускаем обработку
	const res = [];

	for await (const query of rows) {
		try {
			const count = await getGoogleResultsCount(query);
			res[res.length] = `${query},${count}`;
		} catch (error) {
			console.log('Не удалось обработать запрос: ', query);
		}
	}

	await writeData(res.join("\n"))
	console.log('Завершено')
}

main();

function readData(file = './data.csv') {
	let rows = [];
	return new Promise((res, rej) => {
		fs.createReadStream(file)
			.on('data', (chunk) => {
				const data = chunk
					.toString()
					.split("\n")
					.map((v) => v.trim())
					.filter((v) => v)

				rows = rows.concat(data);
			})
			.on('end', () => {
				res(rows);
			})
	});
}

function writeData(data, file = './result.csv') {
	return new Promise((res, rej) => {
		fs.writeFile(file, data, (err) => {
			if (err) {
				return rej(err);
			}
			res();
		});
	});
}

// Функция для отправки запроса к Google и парсинга результатов
function getGoogleResultsCount(query) {
	let url = `https://www.googleapis.com/customsearch/v1?q=${query}`;
	url += `&key=${process.env.GOO_SEARCH_KEY}`;
	url += `&cx=${process.env.GOO_SEARCH_CX}`;
	return fetch(url)
		.then((res) => res.json())
		.then((res) => res.searchInformation.totalResults)
}