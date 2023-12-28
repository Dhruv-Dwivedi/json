const api_url = "https://api.nobelprize.org/v1/prize.json";
let winnersData = [];

async function getapi(url) {
	const response = await fetch(url);
	var data = await response.json();
	winnersData = data;
	display(data);
}

getapi(api_url);

function display(data) {
	let serialNumber = 1;
	let tab =
		`<tr  class="table-header">
		<th>S.No.</th>
          <th>Year</th>
          <th>Category</th>
          <th>Id</th>
          <th>First Name</th>
          <th>Sur Name</th>
		  <th>Motivation</th>
		  <th>Overall Motivation/ Comments</th>
		</tr>`;

	const winnersData = data.prizes ?? data;

	if (winnersData) {
		for (let prize of winnersData) {
			for (let index = 0; index <= prize?.laureates?.length; index++) {
				tab += `<tr> 
        	<td>${serialNumber} </td>
			<td>${prize.year} </td>
			<td>${prize.category?.toUpperCase()}</td>
			<td>${prize.laureates?.[index]?.id ?? ''}</td> 	 
			<td>${prize.laureates?.[index]?.firstname ?? ''}</td> 	 
			<td>${prize.laureates?.[index]?.surname ?? ''}</td> 	
			<td>${prize.laureates?.[index]?.motivation?.replace(/['"]+/g, '') ?? ''}</td>
			<td>${prize.overallMotivation?.replace(/['"]+/g, '') ?? ''}</td> 	
		    </tr>`;
				serialNumber++;
			}
		}

		const categories = [...new Set(winnersData?.map(item => item?.category))];
		const categoryDropdown = document.getElementById('category');
		if (categoryDropdown?.length == 0) {
			const categoryDropdownOption = document.createElement('option');
			categoryDropdown.add(categoryDropdownOption);
			categories.forEach(category => {
				const option = document.createElement('option');
				option.value = category?.toUpperCase();
				option.text = category?.toUpperCase();
				categoryDropdown.add(option);
			});
		}
	}

	document.getElementById("allWinners").innerHTML = tab;

	const yearDropdown = document.getElementById('year');
	if (yearDropdown?.length == 0) {
		const yearDropdownOption = document.createElement('option');
		yearDropdown.append(yearDropdownOption);
		for (let year = 1900; year <= 2018; year++) {
			const option = document.createElement('option');
			option.value = year;
			option.text = year;
			if (!yearDropdown.contains(option)) {
				yearDropdown.append(option);
			}
		}
	}

	var $rows = $('#allWinners tr');
	$('#searchBox').keyup(function () {
		var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

		$rows.show().filter(function () {
			var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
			return !~text.indexOf(val);
		}).hide();
	});
}

function filterWinners() {
	const selectedYear = document.getElementById('year').value;
	const selectedCategory = document.getElementById('category').value?.toLowerCase();

	const filteredWinners = winnersData?.prizes?.filter(prize => {
		return (selectedYear === '' || prize.year == selectedYear) &&
			(selectedCategory === '' || prize.category?.toLowerCase() === selectedCategory);
	});

	display(filteredWinners);
}
