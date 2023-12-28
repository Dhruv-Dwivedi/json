const api_url = "https://api.nobelprize.org/v1/prize.json";

async function getapi(url) {
	const response = await fetch(url);
	var data = await response.json();
	display(data);
}

getapi(api_url);

function display(data) {
	let serialNumber = 1;
	let tab =
		`<tr>
		<th>S.No.</th>
          <th>Id</th>
          <th>First Name</th>
          <th>Sur Name</th>
		  <th>Year</th>
          <th>Category</th>
		  <th>Motivation</th>
		</tr>`;

	let winners = [];
	let exceptionalWinnerIds = [];
	let exceptionalWinners = [];
	data.prizes?.forEach(element => {
		element?.laureates?.forEach(laureate => {
			const winner = {
				id: laureate.id,
				firstname: laureate.firstname,
				surname: laureate.surname,
				year: element.year,
				category: element.category,
				motivation: laureate.motivation
			}
			if (!winners?.find(x => x.id == laureate.id)) {
				winners.push(winner)
			} else {
				exceptionalWinnerIds.push(laureate.id)
				exceptionalWinners.push(winner)
			}
		})
	});

	if (exceptionalWinnerIds) {

		exceptionalWinnerIds.forEach(element => {
			let exceptionalWinner = winners.find(winner => winner.id == element)
			if (exceptionalWinner) {
				exceptionalWinners.push(exceptionalWinner)
			}
		})

		for (let winner of exceptionalWinners) {
			tab += `<tr> 
        	<td>${serialNumber} </td>
			<td>${winner?.id ?? ''}</td> 	 
			<td>${winner.firstname ?? ''}</td> 	 
			<td>${winner.surname ?? ''}</td> 	
			<td>${winner.year} </td>
			<td>${winner.category?.toUpperCase()}</td>
			<td>${winner.motivation?.replace(/['"]+/g, '') ?? ''}</td>	
		    </tr>`;
			serialNumber++;
		}
	}

	document.getElementById("exceptionalWinners").innerHTML = tab;

	var $rows = $('#exceptionalWinners tr');
	$('#searchBox').keyup(function () {
		var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

		$rows.show().filter(function () {
			var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
			return !~text.indexOf(val);
		}).hide();
	});

}
